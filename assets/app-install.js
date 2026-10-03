/* ===== التطبيق: «زيد للتيليفون» + «فكرني كل نهار» =====

   1) كنسجلو الـ service worker (firebase-messaging-sw.js) ف كل صفحة:
      الموقع كيولي قابل يتزاد للشاشة بحال تطبيق، وكيبين offline.html
      ملي ماكاينش الانترنت.
   2) ف الصفحة الرئيسية و «التقدم ديالي» كتبان بطاقة صغيرة:
      - «زيد التطبيق»: Android/Chrome كيستعمل beforeinstallprompt،
        iPhone كنوريوه الخطوات (Partager → Sur l'écran d'accueil).
      - «فكرني كل نهار»: كيطلب الإذن ديال الإشعارات ويحفظ token
        ف users/{uid}/private/push مع daily: true. الـ Worker
        (scheduled) كيصيفط التذكير كل نهار.
   البطاقة كتتسد 14 يوم إلا سدها المستخدم. */
(function () {
    "use strict";

    /* VAPID public key — Firebase Console → Paramètres du projet →
       Cloud Messaging → Certificats Web Push. عمومي، ماشي سر. */
    window.__DE_VAPID_KEY = window.__DE_VAPID_KEY || "BEUXkJWtTGvpCGRHIsr-yjUNTE4_3iXvCkjrXozcw4jxmFGBuwZNAsXp3HGo9W3KrEJGrmV-T41dDm5BnpJL8gc";

    if (window.__deApp) return;

    var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    var CARD_PAGES = ["index.html", "", "fortschritt.html"];
    var DISMISS_KEY = "de-app-card-hide";
    var DAILY_KEY = "de-daily-on";
    var deferred = null;

    function store(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { /* خاص */ } }
    function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
        || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    function standalone() {
        return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
    }
    function pushPossible() {
        return !!window.__DE_VAPID_KEY && "Notification" in window && "serviceWorker" in navigator
            && Notification.permission !== "denied";
    }

    /* ---- 1) الـ service worker ---- */
    if ("serviceWorker" in navigator && location.protocol !== "file:") {
        window.addEventListener("load", function () {
            navigator.serviceWorker.register("firebase-messaging-sw.js").catch(function () { /* ماشي ضروري */ });
        });
    }

    window.addEventListener("beforeinstallprompt", function (e) {
        e.preventDefault();
        deferred = e;
        paint();
    });
    window.addEventListener("appinstalled", function () {
        deferred = null;
        paint();
    });

    /* ---- 2) البطاقة ---- */
    var css = document.createElement("style");
    css.textContent =
        ".de-app{position:fixed;left:50%;bottom:calc(16px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:900;" +
        "width:min(440px,calc(100vw - 24px));background:#7a1426;color:#fff;border:2px solid rgba(255,206,0,.55);border-radius:20px;" +
        "box-shadow:0 18px 50px rgba(0,0,0,.45);padding:14px 16px;direction:rtl;font-family:Cairo,system-ui,sans-serif;animation:de-app-in .35s ease}" +
        "@keyframes de-app-in{from{opacity:0;transform:translate(-50%,20px)}to{opacity:1;transform:translate(-50%,0)}}" +
        ".de-app-x{position:absolute;top:8px;left:10px;border:0;background:transparent;color:#fff;font-size:22px;line-height:1;cursor:pointer;opacity:.75}" +
        ".de-app-row{display:flex;align-items:center;gap:12px}.de-app-row+.de-app-row{margin-top:10px;padding-top:10px;border-top:1px solid rgba(255,255,255,.18)}" +
        ".de-app-row img{width:44px;height:44px;border-radius:50%;flex:0 0 auto}" +
        ".de-app-t{flex:1;min-width:0;font-size:14px;line-height:1.5}.de-app-t b{display:block;font-size:15.5px;font-weight:900}" +
        ".de-app-btn{flex:0 0 auto;border:0;border-radius:999px;padding:9px 16px;background:#ffce00;color:#2a0710;font:inherit;font-weight:900;font-size:14px;cursor:pointer;white-space:nowrap;text-decoration:none}" +
        ".de-app-btn.ghost{background:transparent;color:#ffce00;border:1.5px solid rgba(255,206,0,.6)}" +
        ".de-app-ios{margin:10px 0 0;padding:10px 12px;border-radius:12px;background:rgba(0,0,0,.22);font-size:14px;line-height:1.9}" +
        ".de-app-ios b{color:#ffce00}.de-app-msg{font-size:13.5px;color:#ffce00;font-weight:800}";
    document.head.appendChild(css);

    var card = null;

    function wantInstall() { return !standalone() && (deferred || isIOS); }
    function wantDaily() { return pushPossible() && read(DAILY_KEY) !== "1"; }

    function paint() {
        if (CARD_PAGES.indexOf(page) === -1) return;
        var hidden = Number(read(DISMISS_KEY) || 0);
        if (hidden && Date.now() - hidden < 14 * 86400000) return;
        var install = wantInstall(), daily = wantDaily();
        if (!install && !daily) { if (card) { card.remove(); card = null; } return; }
        if (!card) {
            card = document.createElement("div");
            card.className = "de-app";
            card.setAttribute("role", "dialog");
            card.setAttribute("aria-label", "Deutsch Einfach app");
            document.body.appendChild(card);
        }
        card.innerHTML = "";
        var x = document.createElement("button");
        x.className = "de-app-x"; x.type = "button"; x.setAttribute("aria-label", "سد"); x.textContent = "×";
        x.addEventListener("click", function () { store(DISMISS_KEY, String(Date.now())); card.remove(); card = null; });
        card.appendChild(x);

        if (install) {
            var r = row('<img src="assets/icon-192.png" alt="">',
                "<b>📲 زيد Deutsch Einfach للتيليفون</b>بحال تطبيق — كيتحل بضغطة، بلا Play Store.",
                isIOS && !deferred ? "كيفاش؟" : "زيد");
            r.btn.addEventListener("click", function () {
                if (deferred) {
                    deferred.prompt();
                    deferred.userChoice.finally(function () { deferred = null; paint(); });
                    return;
                }
                if (!card.querySelector(".de-app-ios")) {
                    var tip = document.createElement("div");
                    tip.className = "de-app-ios";
                    tip.innerHTML = "1. ف Safari ضغط على <b>Partager</b> ⬆️ (لتحت)<br>" +
                        "2. ختار <b>Sur l'écran d'accueil</b> ➕<br>3. ضغط <b>Ajouter</b> — وصافي ✅";
                    r.el.insertAdjacentElement("afterend", tip);
                }
            });
        }

        if (daily) {
            var d = row("", "<b>🔔 فكرني كل نهار بالتمرين</b>إشعار وحيد ف النهار مع 7 د الليل — باش ما تقطعش.", "فكرني");
            d.btn.classList.toggle("ghost", install);
            d.btn.addEventListener("click", function () { enableDaily(d); });
        }
    }

    function row(icon, text, label) {
        var el = document.createElement("div");
        el.className = "de-app-row";
        el.innerHTML = icon + '<div class="de-app-t">' + text + "</div>";
        var btn = document.createElement("button");
        btn.type = "button"; btn.className = "de-app-btn"; btn.textContent = label;
        el.appendChild(btn);
        card.appendChild(el);
        return { el: el, btn: btn };
    }

    function loadPush() {
        if (window.__dePushEnable) return Promise.resolve();
        return new Promise(function (ok, bad) {
            var s = document.createElement("script");
            s.src = "assets/push-register.js?v=1";
            s.onload = ok; s.onerror = bad;
            document.head.appendChild(s);
        });
    }

    function say(d, html) {
        var t = d.el.querySelector(".de-app-t");
        t.innerHTML = '<span class="de-app-msg">' + html + "</span>";
    }

    function enableDaily(d) {
        d.btn.disabled = true;
        d.btn.textContent = "…";
        loadPush().then(function () { return window.__dePushEnable({ daily: true }); }).then(function (res) {
            d.btn.remove();
            if (res && res.ok) {
                store(DAILY_KEY, "1");
                say(d, "✅ صافي! غادي نفكروك كل نهار مع 7 د الليل.");
                setTimeout(function () { paint(); }, 4000);
            } else if (res && res.needsLogin) {
                say(d, 'دخل لحسابك باش نفكروك — <a class="de-app-btn" href="login.html">الدخول</a>');
            } else if (res && res.needsHomeScreen) {
                say(d, "ف iPhone: زيد التطبيق للشاشة أولا، ومن بعد حلو وضغط «فكرني».");
            } else if (window.Notification && Notification.permission === "denied") {
                say(d, "الإشعارات مسدودة ف المتصفح — حلها من الإعدادات ديال الموقع.");
            } else {
                say(d, "ما قدرناش نفعلو الإشعارات ف هاد المتصفح.");
            }
        }).catch(function () {
            d.btn.remove();
            say(d, "ما قدرناش نفعلو الإشعارات دابا — عاود من بعد.");
        });
    }

    window.__deApp = { show: function () { store(DISMISS_KEY, null); paint(); } };

    /* كنخليو الزائر يشوف الصفحة شوية عاد نبينو البطاقة */
    setTimeout(paint, 6000);
})();
