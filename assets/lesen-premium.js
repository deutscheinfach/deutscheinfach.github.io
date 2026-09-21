/* ===== جلب مواضيع Lesen ديال Premium =====

   النصوص المدفوعة ماكايناش ف assets/lesen-b2-content.js — الـ repo
   عام. كيسكنو ف Cloudflare KV، والـ Worker ماكيعطيهمش حتى يتحقق
   من الـ ID token ديال Firebase ومن الاشتراك.

   يعني: حتى لو حل واحد DevTools، ماغايلقى حتى نص. اللي كيقرر هو
   الحساب ديالو، ماشي الواجهة.

   الاستعمال:  await window.__lesenPremiumFetch("insel")
               → المحتوى، ولا null إلا ماكانش مشترك.
*/

(function () {
    "use strict";

    const ENDPOINT = "https://deutsch-einfach-correction.soufianemouyr.workers.dev";
    const cache = new Map();

    async function idToken() {
        /* site-header.js عندو Firebase محمّل — كناخدو منو */
        const auth = window.__deutschEinfachAuth;
        const user = auth && auth.currentUser;
        if (!user) return null;
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

    window.__lesenPremiumFetch = async function (themaId) {
        if (cache.has(themaId)) return cache.get(themaId);

        const token = await idToken();
        if (!token) return { ok: false, why: "ماشي داخل بحساب." };

        let result;
        try {
            const response = await fetch(ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lesenId: themaId, idToken: token })
            });

            if (!response.ok) {
                result = {
                    ok: false,
                    status: response.status,
                    why: WHY[response.status] || ("الـ Worker رجع HTTP " + response.status)
                };
            } else {
                result = { ok: true, data: await response.json() };
            }
        } catch (error) {
            result = {
                ok: false,
                why: "ما وصلناش للـ Worker. شوف الأنترنت، ولا مانع الإعلانات."
            };
        }

        if (result.ok) cache.set(themaId, result);
        return result;
    };
})();
