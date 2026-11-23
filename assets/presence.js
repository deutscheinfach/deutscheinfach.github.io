/* ===== شحال من واحد ف الموقع دابا =====

   كل متصفح (داخل بحساب ولا لا) عندو id عشوائي، وكيكتب كل 5 دقايق
   presence/{id} = { at: وقت السيرفر } — غير ملي الصفحة باينة.
   admin.html كيحسب الوثائق اللي at ديالهم ف آخر 7 دقايق (5 + 2 د ديال
   الهامش) — getCountFromServer: قراية وحدة، ماشي وحدة لكل زائر.

   ⚠ كل كتبة كتحسب ف الخطة المجانية ديال Firestore (20.000 ف النهار).
   كنت كل 90 ثانية = 40 كتبة ف الساعة لكل زائر؛ دابا 12. إلا بدلتي
   BEAT_MS، بدّل النافذة ف liveCount() ديال admin.html (BEAT_MS + 2 د). */
(function () {
    "use strict";
    if (window.__dePresence) return;
    window.__dePresence = true;

    var KEY = "de-presence-id";
    var id = null;
    try { id = localStorage.getItem(KEY); } catch (e) { /* خاص */ }
    if (!id || !/^[a-z0-9]{16,40}$/.test(id)) {
        id = "";
        var abc = "abcdefghijklmnopqrstuvwxyz0123456789";
        var rnd = new Uint8Array(20);
        (window.crypto || {}).getRandomValues ? crypto.getRandomValues(rnd) : rnd.forEach(function (_, i) { rnd[i] = Math.random() * 256; });
        rnd.forEach(function (b) { id += abc[b % abc.length]; });
        try { localStorage.setItem(KEY, id); } catch (e) { /* خاص */ }
    }

    /* من بعد ما يبان المحتوى (assets/diag.js) — Firestore ثقيل */
    (window.__deAfterContent || function (fn) { setTimeout(fn, 2500); })(async function () {
        try {
            var mods = await Promise.all([
                import("https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js"),
                import("https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js")
            ]);
            var appMod = mods[0], fsMod = mods[1];
            var app = appMod.getApps().length ? appMod.getApp() : appMod.initializeApp({
                apiKey: "AIzaSyDHMmaHLYRRHfdRDj-hf7s5LOqeWPTiOxU",
                authDomain: "deutsch-einfach-4c81f.firebaseapp.com",
                projectId: "deutsch-einfach-4c81f",
                storageBucket: "deutsch-einfach-4c81f.firebasestorage.app",
                messagingSenderId: "152448766933",
                appId: "1:152448766933:web:f7824c4db8ab3caccbe35c"
            });
            var db = fsMod.getFirestore(app);
            var ref = fsMod.doc(db, "presence", id);
            var BEAT_MS = 5 * 60000;
            var IDLE_MS = 10 * 60000;   /* بلا حركة 10 د (وبلا صوت خدام) = ماكيتحسبش */
            var last = 0;

            /* الحساب (إلا داخل): باش الأدمين يعرف شكون ومشحال من وقت */
            var user = null;
            try {
                var authMod = await import("https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js");
                var auth = authMod.getAuth(app);
                user = await new Promise(function (resolve) {
                    var stop = authMod.onAuthStateChanged(auth, function (u) { stop(); resolve(u); });
                });
                authMod.onAuthStateChanged(auth, function (u) { user = u; });
            } catch (e) { /* بلا حساب: غير العدد */ }

            /* الوقت: غير ملي الصفحة باينة والطالب كيتحرك (ولا كيسمع) */
            var lastMove = Date.now();
            ["pointerdown", "keydown", "scroll", "touchstart", "mousemove"].forEach(function (evt) {
                document.addEventListener(evt, function () { lastMove = Date.now(); }, { passive: true, capture: true });
            });
            function playing() {
                return Array.prototype.some.call(document.querySelectorAll("audio, video"), function (m) { return !m.paused && !m.ended; });
            }
            var acc = 0;
            var since = document.visibilityState === "visible" ? Date.now() : null;
            function tick() {
                var now = Date.now();
                if (since != null) {
                    var active = now - lastMove < IDLE_MS || playing();
                    /* التيليفون/الحاسوب نعس: الـ interval ماخدمش — ماكنحسبوش الوقت كامل */
                    if (active) acc += Math.min(now - since, BEAT_MS + 60000);
                    since = document.visibilityState === "visible" ? now : null;
                }
            }
            function today() {
                try { return new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Casablanca" }); }
                catch (e) { return new Date().toISOString().slice(0, 10); }
            }
            var full = true;   /* القواعد القديمة كيقبلو غير { at } */
            function write(force) {
                if (!force && Date.now() - last < BEAT_MS - 60000) return;
                last = Date.now();
                var data = { at: fsMod.serverTimestamp() };
                if (full && user) {
                    var mins = Math.round(acc / 60000);
                    acc -= mins * 60000;
                    var day = today(), prevDay = null, prevUid = null;
                    try { prevDay = localStorage.getItem("de-presence-day"); prevUid = localStorage.getItem("de-presence-uid"); } catch (e) { /* */ }
                    var fresh = prevUid !== user.uid;
                    data.uid = user.uid;
                    data.name = String(user.displayName || (user.email || "").split("@")[0] || "").slice(0, 60);
                    data.premium = window.__deutschEinfachIsPremium === true;
                    data.page = (location.pathname.split("/").pop() || "/").slice(0, 120);
                    data.day = day;
                    data.todayMin = (fresh || prevDay !== day) ? mins : fsMod.increment(mins);
                    data.totalMin = fresh ? mins : fsMod.increment(mins);
                    try { localStorage.setItem("de-presence-day", day); localStorage.setItem("de-presence-uid", user.uid); } catch (e) { /* */ }
                }
                fsMod.setDoc(ref, data, { merge: true }).catch(function () {
                    /* firestore.rules الجديدة ما تنشراتش: نرجعو للعدد بوحدو */
                    if (full && data.uid) { full = false; fsMod.setDoc(ref, { at: fsMod.serverTimestamp() }, { merge: true }).catch(function () {}); }
                });
            }
            function beat() {
                tick();
                if (document.visibilityState !== "visible") return;
                /* الـ interval كيجي كل BEAT_MS؛ الحاجز كيمنع غير الرجوع السريع
                   للتبويب (visibilitychange) يكتب كل مرة. */
                write(false);
            }
            write(true);
            setInterval(beat, BEAT_MS);
            document.addEventListener("visibilitychange", function () {
                if (document.visibilityState === "visible") { since = Date.now(); beat(); return; }
                /* خرج من التبويب: نكتبو الوقت اللي تجمع (إلا فات دقيقة) */
                tick();
                if (user && full && acc >= 60000) write(true);
            });
        } catch (e) { /* بلا انترنت */ }
    });
})();
