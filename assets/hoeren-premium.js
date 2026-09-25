/* ===== Hören Premium: المواضيع 6 وطالع =====

   الـ repo عام، إذن الجمل والأجوبة ديال المواضيع المدفوعة ماكايناش
   فـ b2-hoeren-teil*.html. كيسكنو فـ Cloudflare KV تحت المفاتيح
   lesen-hoeren-teil1 / lesen-hoeren-teil2 / lesen-hoeren-teil3،
   والـ Worker ماكيعطيهمش حتى يتحقق من الـ ID token ومن الاشتراك
   (نفس الطريق ديال Lesen: { lesenId: "hoeren-teil2", idToken }).

   window.__hoerenPremiumLoad("teil2") → { ok, data: { themes: { "6": {questions, note} } } }
                                        ولا { ok: false, why } */

(function () {
    "use strict";

    const ENDPOINT = "https://deutsch-einfach-correction.soufianemouyr.workers.dev";
    const cache = {};

    const WHY = {
        400: "الـ Worker ف Cloudflare قديم. خاصك تدير Deploy لـ cloudflare-worker.js.",
        401: "الحساب ما تقبلش. خرج وعاود دخل.",
        403: "الحساب ماشي Premium (subscriptionActive خاصو يكون true).",
        404: "ماكاينش المفتاح ديال Hören فـ Cloudflare KV (lesen-hoeren-teil…).",
        500: "الـ KV binding سميتو TOPICS ماشي مربوط بالـ Worker."
    };

    async function token() {
        const user = window.__hoerenUser
            || (window.__deutschEinfachAuth && window.__deutschEinfachAuth.currentUser);
        if (!user) return null;
        try { return await user.getIdToken(); } catch (e) { return null; }
    }

    window.__hoerenPremiumLoad = function (teil) {
        if (cache[teil]) return cache[teil];
        cache[teil] = (async function () {
            const idToken = await token();
            if (!idToken) return { ok: false, why: "ماشي داخل بحساب." };
            try {
                const res = await fetch(ENDPOINT, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ lesenId: "hoeren-" + teil, idToken: idToken })
                });
                if (!res.ok) return { ok: false, status: res.status, why: WHY[res.status] || ("HTTP " + res.status) };
                return { ok: true, data: await res.json() };
            } catch (e) {
                return { ok: false, why: "ما وصلناش للـ Worker. شوف الأنترنت." };
            }
        })();
        cache[teil].then(function (r) { if (!r.ok) delete cache[teil]; });
        return cache[teil];
    };

    /* كتزيد الجمل للمواضيع المقفولين (premium: true) من الجواب ديال KV */
    window.__hoerenPremiumMerge = function (themes, result) {
        if (!result || !result.ok || !result.data || !result.data.themes) return;
        themes.forEach(function (t, i) {
            const p = result.data.themes[String(i + 1)];
            if (t.premium && p && Array.isArray(p.questions)) {
                t.questions = p.questions;
                if (p.note) t.note = p.note;
            }
        });
    };
})();
