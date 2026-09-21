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

    window.__lesenPremiumFetch = async function (themaId) {
        if (cache.has(themaId)) return cache.get(themaId);

        const token = await idToken();
        if (!token) return null;

        let payload = null;
        try {
            const response = await fetch(ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lesenId: themaId, idToken: token })
            });

            if (!response.ok) {
                /* 401 ماشي داخل · 403 ماشي مشترك · 404 ما زال ماكاينش */
                return null;
            }
            payload = await response.json();
        } catch (error) {
            console.debug("LESEN PREMIUM:", error && error.message);
            return null;
        }

        cache.set(themaId, payload);
        return payload;
    };
})();
