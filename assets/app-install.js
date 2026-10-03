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
        ".de-app-ios b{color:#ffce00}.de-app-msg{font-size:13.5px;color:#ffce00;font-weight:800}" +
        /* نافذة الإذن (بحال اللي كتبين Google قبل الإذن ديال المتصفح) */
        ".de-ask-bg{position:fixed;inset:0;z-index:1000;background:rgba(20,6,10,.55);display:flex;align-items:flex-start;justify-content:center;padding:calc(18px + env(safe-area-inset-top)) 14px;animation:de-fade .2s ease}" +
        "@keyframes de-fade{from{opacity:0}to{opacity:1}}" +
        ".de-ask{width:min(400px,100%);background:#fff;color:#1f1f1f;border-radius:22px;box-shadow:0 24px 60px rgba(0,0,0,.4);padding:22px 22px 16px;direction:rtl;font-family:Cairo,system-ui,sans-serif;animation:de-drop .3s cubic-bezier(.2,.9,.3,1.2)}" +
        "@keyframes de-drop{from{transform:translateY(-24px);opacity:0}to{transform:none;opacity:1}}" +
        ".de-ask-top{display:flex;align-items:center;gap:12px;margin-bottom:12px}" +
        ".de-ask-top img{width:46px;height:46px;border-radius:50%;box-shadow:0 4px 12px rgba(0,0,0,.2)}" +
        ".de-ask-top small{display:block;color:#666;font-size:12.5px;font-weight:700;direction:ltr;text-align:right}" +
        ".de-ask-top b{font-size:15px}" +
        ".de-ask h3{margin:0 0 6px;font-size:19px;font-weight:900;line-height:1.35}" +
        ".de-ask p{margin:0 0 14px;color:#444;font-size:14.5px;line-height:1.7}" +
        ".de-ask-demo{display:flex;gap:10px;align-items:center;background:#f3f1ec;border-radius:14px;padding:10px 12px;margin-bottom:16px;font-size:13px;color:#333}" +
        ".de-ask-demo img{width:30px;height:30px;border-radius:8px}.de-ask-demo b{display:block;font-size:13.5px}" +
        ".de-ask-btns{display:flex;gap:10px;justify-content:flex-start}" +
        ".de-ask-btns button{flex:1;border-radius:999px;padding:11px 14px;font:inherit;font-weight:900;font-size:15px;cursor:pointer}" +
        ".de-ask-yes{border:0;background:#7a1426;color:#fff}.de-ask-no{border:1.5px solid #d8d4cc;background:#fff;color:#444}" +
        ".de-ask-ok{text-align:center;font-weight:900;color:#15803d;font-size:15px;padding:6px 0}" +
        "html[data-theme=dark] .de-ask{background:#1f1a1c;color:#f4f1ea}html[data-theme=dark] .de-ask p{color:#cfc8bd}" +
        "html[data-theme=dark] .de-ask-demo{background:#2c2427;color:#e9e3d8}html[data-theme=dark] .de-ask-no{background:transparent;color:#e9e3d8;border-color:#4a4044}" +
        "html[data-theme=dark] .de-ask-top small{color:#aaa}";
    document.head.appendChild(css);

    var card = null;

    function wantInstall() { return !standalone() && (deferred || isIOS); }
    function wantDaily() { return pushPossible() && read(DAILY_KEY) !== "1"; }

    function paint() {
        if (CARD_PAGES.indexOf(page) === -1) return;
        if (document.querySelector(".de-ask-bg")) { setTimeout(paint, 3000); return; }
        var hidden = Number(read(DISMISS_KEY) || 0);
        if (hidden && Date.now() - hidden < 14 * 86400000) return;
        var install = wantInstall(), daily = false;   /* التذكير عندو نافذة بوحدو (askDaily) */
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

    /* ===== «فكرني كل نهار»: نافذة الإذن =====
       كتبان غير للي داخل بحسابو (الـ token كيتحفظ ف الحساب)، والإذن
       ديال المتصفح مازال ما تسولش. ملي يضغط «سماح» عاد كيطلع
       الإذن الحقيقي (Autoriser / Bloquer). «ماشي دابا» = 7 أيام. */
    var ASK_KEY = "de-daily-asked";

    function currentUser() {
        return new Promise(function (resolve) {
            var tries = 0;
            (function wait() {
                var a = window.__deutschEinfachAuth;
                if (a && a.currentUser) return resolve(a.currentUser);
                if (a && tries > 6) return resolve(a.currentUser || null);
                if (++tries > 40) return resolve(null);
                setTimeout(wait, 250);
            })();
        });
    }

    function askDaily(delay) {
        if (!pushPossible() || read(DAILY_KEY) === "1") return;
        if (isIOS && !standalone()) return;   /* iPhone: غير من التطبيق المزيد للشاشة */
        setTimeout(function () {
            currentUser().then(function (user) {
                if (!user) return;
                /* سبق قبل ف جهاز آخر ولا هنا: نعاودو نسجلو بلا ما نسولو */
                if (Notification.permission === "granted") {
                    loadPush().then(function () { return window.__dePushEnable({ daily: true }); })
                        .then(function (r) { if (r && r.ok) store(DAILY_KEY, "1"); }).catch(function () {});
                    return;
                }
                var last = Number(read(ASK_KEY) || 0);
                if (last && Date.now() - last < 7 * 86400000) return;
                showAsk();
            });
        }, delay);
    }

    function showAsk() {
        if (document.querySelector(".de-ask-bg")) return;
        var bg = document.createElement("div");
        bg.className = "de-ask-bg";
        bg.innerHTML =
            '<div class="de-ask" role="dialog" aria-modal="true" aria-labelledby="de-ask-h">' +
            '<div class="de-ask-top"><img src="assets/icon-192.png" alt=""><div><b>Deutsch Einfach</b><small>deutsch-einfach.online</small></div></div>' +
            '<h3 id="de-ask-h">🔔 بغيتي نفكروك بالتمرين كل نهار؟</h3>' +
            "<p>إشعار واحد ف النهار مع <b>7 د الليل</b> باش تبقى منتظم وتوجد لـ telc. بلا إزعاج، وتقدر توقفو فأي وقت.</p>" +
            '<div class="de-ask-demo"><img src="assets/icon-192.png" alt=""><div><b>🔥 ما تقطعش اليوم!</b>10 دقايق ديال Lesen كيفرقو ف telc.</div></div>' +
            '<div class="de-ask-btns"><button type="button" class="de-ask-yes">سماح</button><button type="button" class="de-ask-no">ماشي دابا</button></div>' +
            "</div>";
        document.body.appendChild(bg);
        function close() { bg.remove(); }
        bg.querySelector(".de-ask-no").addEventListener("click", function () { store(ASK_KEY, String(Date.now())); close(); });
        bg.addEventListener("click", function (e) { if (e.target === bg) { store(ASK_KEY, String(Date.now())); close(); } });
        bg.querySelector(".de-ask-yes").addEventListener("click", function () {
            var box = bg.querySelector(".de-ask-btns");
            box.innerHTML = '<div class="de-ask-ok">… ضغط «Autoriser» ف النافذة ديال المتصفح</div>';
            loadPush().then(function () { return window.__dePushEnable({ daily: true }); }).then(function (r) {
                if (r && r.ok) {
                    store(DAILY_KEY, "1");
                    box.innerHTML = '<div class="de-ask-ok">✅ صافي! نتلاقاو غدا مع 7 د الليل.</div>';
                    setTimeout(close, 2200);
                } else {
                    store(ASK_KEY, String(Date.now()));
                    box.innerHTML = '<div class="de-ask-ok" style="color:#b42318">' +
                        (window.Notification && Notification.permission === "denied"
                            ? "الإشعارات مسدودة — تقدر تحلها من 🔒 حدا العنوان ديال الموقع."
                            : "ما تفعلاتش دابا — نعاودو نسولوك من بعد.") + "</div>";
                    setTimeout(close, 3500);
                }
            }).catch(function () { close(); });
        });
    }

    window.__deApp = {
        show: function () { store(DISMISS_KEY, null); paint(); },
        askDaily: function () { store(ASK_KEY, null); askDaily(0); }
    };

    /* كنخليو الزائر يشوف الصفحة شوية عاد نبينو البطاقة */
    setTimeout(paint, 6000);

    /* من بعد التسجيل: النافذة كتطلع دغيا ف الصفحة الرئيسية */
    var justSigned = false;
    try { justSigned = sessionStorage.getItem("de-just-signed-up") === "1"; sessionStorage.removeItem("de-just-signed-up"); } catch (e) { /* خاص */ }
    if (CARD_PAGES.indexOf(page) !== -1) askDaily(justSigned ? 1500 : 4000);
})();
