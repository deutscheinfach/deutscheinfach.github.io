/* ===== المواضيع المجانية ديال Lesen (من Cloudflare) =====

   كانو ف assets/lesen-b1-content.js و lesen-b2-content.js — وأي واحد
   كيقدر يحلهم من View source. دابا كيجيو من الـ Worker (GET ?free=lesen-b2)
   ملي كتتحل الصفحة، وكيتحطو ف window.LESEN_B2_CONTENT بحال قبل.

   الاستعمال:  window.__lesenFreeReady("b2").then(...)
               → كيتسالى ملي يوصل المحتوى (ولا ملي يفشل: {} خاوي). */
(function () {
    "use strict";

    const ENDPOINT = "https://deutsch-einfach-correction.soufianemouyr.workers.dev";
    const jobs = {};

    function load(level, attempt) {
        return fetch(ENDPOINT + "?free=lesen-" + level, { credentials: "omit" })
            .then(function (res) {
                if (!res.ok) throw new Error("HTTP " + res.status);
                return res.json();
            })
            .catch(function (error) {
                if (attempt < 1) {
                    return new Promise(function (go) { setTimeout(go, 600); })
                        .then(function () { return load(level, attempt + 1); });
                }
                console.warn("Lesen: المواضيع المجانية ما وصلوش", error);
                return null;
            });
    }

    window.__lesenFreeReady = function (level) {
        const lv = String(level || "b2").toLowerCase();
        const key = "LESEN_" + lv.toUpperCase() + "_CONTENT";
        if (window[key] && Object.keys(window[key]).length) return Promise.resolve(window[key]);
        if (!jobs[lv]) {
            jobs[lv] = load(lv, 0).then(function (data) {
                window[key] = Object.assign(window[key] || {}, data || {});
                if (!data) delete jobs[lv];   /* فشل: المرة الجاية نعاودو */
                return window[key];
            });
        }
        return jobs[lv];
    };

    /* كنبداو الجلب دغيا (الصفحة ديال Lesen) */
    try {
        const shell = document.querySelector(".lesen-shell");
        const lv = (shell && shell.dataset.level) || (/b1-/.test(location.pathname) ? "b1" : "b2");
        window.__lesenFreeReady(lv);
        const link = document.createElement("link");
        link.rel = "preconnect"; link.href = ENDPOINT; link.crossOrigin = "";
        document.head.appendChild(link);
    } catch (error) { /* */ }
})();
