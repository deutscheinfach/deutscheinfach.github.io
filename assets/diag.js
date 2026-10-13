/* ===== مشاكل الطلبة: كتتسجل بوحدها =====

   ملي كيطيح شي خطأ ف المتصفح ديال الطالب (JavaScript، ملف ما تحملش)
   ولا الكود كيقول «ما وصلناش للموضوع» / «بطا بزاف»، كنصيفطو سطر لـ
   Firestore (diag/{auto}). الأدمين كيشوفهم ف admin.html → «مشاكل الطلبة»
   مجموعين: شنو، فين، شحال من مرة، وشمن متصفح/شاشة.

   كنكتبو بـ REST نيشان (ماشي SDK ديال Firebase): حتى إلا ما تحملش
   Firebase (هادي بوحدها مشكلة كنبغيو نعرفوها)، التقرير كيوصل.

   الاستعمال من الكود:  window.__deDiag("fail" | "slow" | "error", "الرسالة", { ms })
   · ماكثرش من 6 ف الصفحة، وكل رسالة مرة وحدة.
   · غير ف الموقع الحقيقي (ماشي localhost).
   · ما كيتسجلش الإيميل ولا الاسم — غير واش مشترك ولا لا. */
/* ===== من بعد المحتوى =====
   window.__deAfterContent(fn): Firestore (178 KB) وأي حاجة ماشي ضرورية
   كيتسناو حتى يبان المحتوى (Lesen كيصيفط de-content)، ولا 2.5 ثانية من
   بعد load (6 ف صفحات Lesen). ف الأنترنت الضعيفة، المحتوى كياخد الشبكة
   بوحدو. */
(function () {
    "use strict";
    if (window.__deAfterContent) return;
    let open = false;
    const queue = [];
    function release() {
        if (open) return;
        open = true;
        queue.splice(0).forEach(function (fn) { try { fn(); } catch (e) { /* */ } });
    }
    document.addEventListener("de-content", function () { setTimeout(release, 300); }, { once: true });
    /* موضوع Lesen محلول (كيتسنى المحتوى من Cloudflare): حتى 6 ث، ولا
       de-content قبل. الصفحات الأخرى: 2.5 ث */
    const waitTopic = /-lesen(-[a-z0-9]+)?\.html$/.test(location.pathname)
        && /[?&](thema|pruefung)=/.test(location.search);
    const later = function () { setTimeout(release, waitTopic ? 6000 : 2500); };
    if (document.readyState === "complete") later();
    else window.addEventListener("load", later, { once: true });
    window.__deAfterContent = function (fn) {
        if (open) fn(); else queue.push(fn);
    };
    window.__deAfterContent.now = release;
})();

(function () {
    "use strict";
    if (window.__deDiag) return;

    const LIVE = /(^|\.)deutsch-einfach\.online$/.test(location.hostname);
    const URL = "https://firestore.googleapis.com/v1/projects/deutsch-einfach-4c81f/databases/(default)/documents/diag"
        + "?key=AIzaSyDHMmaHLYRRHfdRDj-hf7s5LOqeWPTiOxU";
    const MAX = 6;
    const sent = new Set();
    let count = 0;

    function cut(v, n) { return String(v == null ? "" : v).slice(0, n); }

    function send(type, msg, extra) {
        try {
            const text = cut(msg, 400);
            const sig = type + "|" + text;
            if (!text || sent.has(sig) || count >= MAX) return;
            sent.add(sig);
            count++;
            if (!LIVE) { console.info("[diag]", type, text); return; }
            const ms = extra && typeof extra.ms === "number" ? extra.ms : (window.performance ? performance.now() : 0);
            const conn = navigator.connection || {};
            const fields = {
                type:    { stringValue: cut(type, 20) },
                msg:     { stringValue: text },
                page:    { stringValue: cut(location.pathname + location.search, 200) },
                ua:      { stringValue: cut(navigator.userAgent, 250) },
                vw:      { integerValue: String(window.innerWidth || 0) },
                vh:      { integerValue: String(window.innerHeight || 0) },
                dpr:     { doubleValue: window.devicePixelRatio || 1 },
                ms:      { integerValue: String(Math.round(ms)) },
                net:     { stringValue: cut(conn.effectiveType || "", 10) },
                premium: { booleanValue: window.__deutschEinfachIsPremium === true },
                at:      { timestampValue: new Date().toISOString() }
            };
            fetch(URL, {
                method: "POST",
                keepalive: true,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fields: fields })
            }).catch(function () { /* ما كاين ما نديرو */ });
        } catch (e) { /* التقرير ما خاصوش يطيح الصفحة */ }
    }
    window.__deDiag = send;

    /* أخطاء ماشي ديالنا: إضافات المتصفح، والـ ResizeObserver (عادي) */
    function noise(text, file) {
        return /^(chrome|moz|safari|ms-browser)-extension:/.test(file || "")
            || /ResizeObserver loop|Script error\.?$/.test(text || "");
    }

    window.addEventListener("error", function (e) {
        const t = e.target;
        /* ملف ما تحملش (script / css / صورة) */
        if (t && t !== window && (t.src || t.href)) {
            const url = t.src || t.href;
            /* غير الملفات ديالنا و Firebase — الإحصائيات (Cloudflare Insights…)
               كيبلوكيوها مانعي الإعلانات، وماشي مشكل */
            let host = "";
            try { host = new URL(url, location.href).hostname; } catch (err) { return; }
            if (host !== location.hostname && host !== "www.gstatic.com") return;
            send("load", "ما تحملش: " + url.replace(/\?v=[0-9a-f]+/, ""));
            return;
        }
        if (noise(e.message, e.filename)) return;
        const where = (e.filename || "").split("/").pop().replace(/\?v=[0-9a-f]+/, "");
        send("error", (e.message || "Error") + (where ? " @ " + where + ":" + e.lineno : ""));
    }, true);

    window.addEventListener("unhandledrejection", function (e) {
        const r = e.reason;
        const text = r && (r.message || r.code) ? (r.code ? r.code + " " : "") + (r.message || "") : String(r);
        if (noise(text, r && r.stack)) return;
        send("error", "Promise: " + text);
    });
})();
