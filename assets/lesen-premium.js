/* ===== جلب مواضيع Lesen ديال Premium =====

   النصوص المدفوعة ماكايناش ف assets/lesen-b2-content.js — الـ repo
   عام. كيسكنو ف Cloudflare KV، والـ Worker ماكيعطيهمش حتى يتحقق
   من الـ ID token ديال Firebase ومن الاشتراك.

   يعني: حتى لو حل واحد DevTools، ماغايلقى حتى نص. اللي كيقرر هو
   الحساب ديالو، ماشي الواجهة.

   الاستعمال:  await window.__lesenPremiumFetch("insel")
               → المحتوى، ولا null إلا ماكانش مشترك.
               window.__lesenPremiumWarm("insel")
               → كيبدا الجلب من قبل ما يبرك (hover / لمسة).

   السرعة:
   · الجواب كيتحفظ ف window.__lesenPremiumState، ماشي ف السكريبت: الراوتر
     كيعاود تنفيذ السكريبتات مع كل تبديل ديال القسم، وكان كل مرة يضيع
     الكاش ونعاودو الطلب.
   · طلبين لنفس الموضوع ف نفس الوقت = طلب واحد.
   · الطلب text/plain، ماشي application/json: هادا "طلب بسيط" عند
     المتصفح، بلا preflight (OPTIONS) — رحلة كاملة أقل. الـ Worker كيقرا
     الجسم بـ request.json() ومايهمّوش الـ Content-Type.
   · الكاش مربوط بالحساب (uid): واحد خرج وآخر دخل ما كيتقاسموش النصوص.
   · 404 كيتحفظ 60 ثانية: الاحتياطي (lesen-<id>-<part>) ماكيبقاش كيضرب
     الـ Worker ف كل فتحة. */

(function () {
    "use strict";

    const ENDPOINT = "https://deutsch-einfach-correction.soufianemouyr.workers.dev";
    const TIMEOUT_MS = 20000;
    const MISS_MS = 60000;

    const state = window.__lesenPremiumState || (window.__lesenPremiumState = {
        done: new Map(),   /* uid|id → result ناجح */
        miss: new Map(),   /* uid|id → { result, until } ديال 404 */
        busy: new Map()    /* uid|id → Promise ديال طلب خدام */
    });

    /* فتح الاتصال (DNS + TLS) قبل أول طلب. مرة وحدة ف الصفحة. */
    function preconnect() {
        try {
            if (document.head.querySelector('link[rel="preconnect"][href="' + ENDPOINT + '"]')) return;
            const link = document.createElement("link");
            link.rel = "preconnect";
            link.href = ENDPOINT;
            link.crossOrigin = "";
            document.head.appendChild(link);
        } catch (error) { /* غير تسريع */ }
    }
    preconnect();

    function currentUser() {
        /* site-header.js عندو Firebase محمّل — كناخدو منو */
        const auth = window.__deutschEinfachAuth;
        return (auth && auth.currentUser) || null;
    }

    async function idToken(user) {
        try {
            return await user.getIdToken();
        } catch (error) {
            return null;
        }
    }

    /* شنو معناه كل كود — باش الصفحة تقدر تقول للمستعمل فين المشكل
       بدل ما تبقى ساكتة وتوري القفل. */
    const WHY = {
        400: "الـ Worker ف Cloudflare ما زال قديم — ماكيعرفش Lesen. " +
             "خاصك تدفع cloudflare-worker.js الجديد وتدير Deploy.",
        401: "الـ Worker ما قبلش الحساب. جرب تخرج وتعاود تدخل.",
        403: "الـ Worker شاف الحساب ولكن ماشي مشترك. " +
             "ف Firestore خاص subscriptionActive يكون true بنوع boolean ماشي نص.",
        404: "الـ Worker خدام، ولكن ماكاينش المفتاح premium-lesen ف KV " +
             "— ولا كاين وماكاينش فيه هاد الموضوع.",
        500: "الـ KV binding سميتو TOPICS ماشي مربوط بالـ Worker."
    };

    /* طلب واحد للـ Worker. غلطة شبكة ولا 502/503/504 (Firestore تعطل
       لحظة): محاولة ثانية وحدة، قبل ما نقولو للمستعمل شي حاجة. */
    async function ask(themaId, token) {
        for (let attempt = 0; ; attempt++) {
            const guard = typeof AbortController === "function" ? new AbortController() : null;
            const timer = guard ? setTimeout(function () { guard.abort(); }, TIMEOUT_MS) : 0;
            try {
                const response = await fetch(ENDPOINT, {
                    method: "POST",
                    headers: { "Content-Type": "text/plain;charset=UTF-8" },
                    body: JSON.stringify({ lesenId: themaId, idToken: token }),
                    signal: guard ? guard.signal : undefined
                });

                if (response.ok) return { ok: true, data: await response.json() };

                if (attempt === 0 && (response.status === 502 || response.status === 503 || response.status === 504)) {
                    await new Promise(function (go) { setTimeout(go, 400); });
                    continue;
                }
                return {
                    ok: false,
                    status: response.status,
                    why: WHY[response.status] || ("الـ Worker رجع HTTP " + response.status)
                };
            } catch (error) {
                if (attempt === 0 && !(guard && guard.signal.aborted)) {
                    await new Promise(function (go) { setTimeout(go, 400); });
                    continue;
                }
                /* الـ Worker ماكيقبل غير https://. إلا تحلات الصفحة بـ http://
                   المتصفح كيبلوكي الجواب (CORS) وكيبان بحال إلا ماكاينش أنترنت. */
                return {
                    ok: false,
                    why: guard && guard.signal.aborted
                        ? "الـ Worker تأخر بزاف. عاود المحاولة."
                        : location.protocol === "http:"
                            ? "الصفحة محلولة بـ http:// والـ Worker ماكيقبل غير https://. " +
                              "حلها بـ https://" + location.host + " — " +
                              "ولا فعّل Enforce HTTPS ف GitHub Pages."
                            : "ما وصلناش للـ Worker. شوف الأنترنت، ولا مانع الإعلانات."
                };
            } finally {
                clearTimeout(timer);
            }
        }
    }

    window.__lesenPremiumFetch = function (themaId) {
        const user = currentUser();
        if (!user) {
            /* خرج من الحساب: ما نخليوش نصوص المشترك ف الذاكرة */
            state.done.clear();
            state.miss.clear();
            return Promise.resolve({ ok: false, why: "ماشي داخل بحساب." });
        }

        const key = user.uid + "|" + themaId;

        if (state.done.has(key)) return Promise.resolve(state.done.get(key));

        const miss = state.miss.get(key);
        if (miss && miss.until > Date.now()) return Promise.resolve(miss.result);

        const running = state.busy.get(key);
        if (running) return running;

        const job = (async function () {
            const token = await idToken(user);
            if (!token) return { ok: false, why: "ماشي داخل بحساب." };

            const result = await ask(themaId, token);

            if (result.ok) state.done.set(key, result);
            else if (result.status === 404) state.miss.set(key, { result: result, until: Date.now() + MISS_MS });
            return result;
        })().finally(function () { state.busy.delete(key); });

        state.busy.set(key, job);
        return job;
    };

    /* واش هاد المفتاح ديجا ف الذاكرة؟ (الجواب ديالو، ولا undefined) — بلا طلب.
       Sprechen كيستعملها باش ما يطلبش مفتاح احتياطي إلا كان الأساسي ما جاش. */
    window.__lesenPremiumPeek = function (themaId) {
        const user = currentUser();
        return user ? state.done.get(user.uid + "|" + themaId) : undefined;
    };

    /* كيبدا الجلب والمستعمل باقي ما بركش: hover ف الكمبيوتر، أول لمسة ف
       التيليفون. لغير المشتركين ما كيدير والو (باش ما نضربوش الـ Worker
       بـ 403 بلا فايدة). الخطأ ما كيبانش — إلا بركو من بعد، كيتعاود الطلب. */
    window.__lesenPremiumWarm = function (themaId) {
        try {
            if (!window.__deutschEinfachIsPremium || !currentUser()) return;
            window.__lesenPremiumFetch(themaId);
        } catch (error) { /* غير تسريع */ }
    };
})();
