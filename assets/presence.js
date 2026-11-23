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
            var BEAT_MS = 5 * 60000;      /* بلا حساب: غير العدد */
            var USER_BEAT_MS = 2 * 60000; /* داخل بحسابو: الوقت كيتكتب كل 2 د */
            var IDLE_MS = 10 * 60000;     /* بلا حركة 10 د (وبلا صوت خدام) = ماكيتحسبش */
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

            /* الوقت: غير ملي الصفحة باينة والطالب كيتحرك (ولا كيسمع).

               الوقت اللي ما تكتبش باقي كيتخبا ف localStorage (de-presence-acc)
               ماشي ف الذاكرة: الطالب كيبدل الصفحة كل دقيقة ولا جوج، والكتبة
               ملي كتسد الصفحة ما كتوصلش — كان كيضيع كلشي وكيبان «0 د».
               دابا الصفحة الجاية كتكمل من فين وقفات السابقة. */
            var ACC_KEY = "de-presence-acc";
            function readAcc() {
                try {
                    var v = JSON.parse(localStorage.getItem(ACC_KEY) || "null");
                    if (v && user && v.uid === user.uid && typeof v.ms === "number") return v.ms;
                } catch (e) { /* */ }
                return 0;
            }
            function saveAcc(ms) {
                if (!user) return;
                try { localStorage.setItem(ACC_KEY, JSON.stringify({ uid: user.uid, ms: Math.max(0, ms) })); } catch (e) { /* */ }
            }
            var lastMove = Date.now();
            ["pointerdown", "keydown", "scroll", "touchstart", "mousemove"].forEach(function (evt) {
                document.addEventListener(evt, function () { lastMove = Date.now(); }, { passive: true, capture: true });
            });
            function playing() {
                return Array.prototype.some.call(document.querySelectorAll("audio, video"), function (m) { return !m.paused && !m.ended; });
            }
            /* كنحسبو من اللحظة اللي بدات فيها الصفحة، ماشي من ملي تحمل Firebase */
            var start = (window.performance && performance.timeOrigin) ? Math.round(performance.timeOrigin) : Date.now();
            var since = document.visibilityState === "visible" ? Math.min(start, Date.now()) : null;
            function tick() {
                var now = Date.now();
                if (since != null) {
                    var active = now - lastMove < IDLE_MS || playing();
                    /* التيليفون/الحاسوب نعس: الـ interval ماخدمش — ماكنحسبوش الوقت كامل */
                    if (active && user) saveAcc(readAcc() + Math.min(now - since, 2 * 60000 + 30000));
                }
                since = document.visibilityState === "visible" ? now : null;
            }
            function today() {
                try { return new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Casablanca" }); }
                catch (e) { return new Date().toISOString().slice(0, 10); }
            }
            var full = true;   /* القواعد القديمة كيقبلو غير { at } */
            function write(force) {
                var gap = (user && full) ? USER_BEAT_MS : BEAT_MS;
                if (!force && Date.now() - last < gap - 15000) return;
                last = Date.now();
                var data = { at: fsMod.serverTimestamp() };
                var mins = 0;
                if (full && user) {
                    var ms = readAcc();
                    mins = Math.floor(ms / 60000);
                    saveAcc(ms - mins * 60000);   /* الباقي (أقل من دقيقة) كيبقى للمرة الجاية */
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
                    /* ما تكتبش: نرجعو الدقايق للخزنة باش ما يضيعوش */
                    if (mins) saveAcc(readAcc() + mins * 60000);
                    /* firestore.rules الجديدة ما تنشراتش: نرجعو للعدد بوحدو */
                    if (full && data.uid) { full = false; fsMod.setDoc(ref, { at: fsMod.serverTimestamp() }, { merge: true }).catch(function () {}); }
                });
            }
            /* كل دقيقة كنزيدو الوقت للخزنة؛ الكتبة لـFirestore كل 2 د (5 بلا حساب) */
            function beat() {
                tick();
                if (document.visibilityState !== "visible") return;
                write(false);
            }
            tick();
            write(true);
            setInterval(beat, 60000);
            document.addEventListener("visibilitychange", function () {
                /* خرج / رجع: الوقت كيتخبا ف الخزنة، والكتبة كتجي ف الصفحة الجاية */
                tick();
                if (document.visibilityState === "visible") beat();
            });
            window.addEventListener("pagehide", tick);
        } catch (e) { /* بلا انترنت */ }
    });
})();
