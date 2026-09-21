/* ===== الهيدر المشترك =====

   كيبني نفس الهيدر ف كل الصفحات: العلامة، التنقل، الوضع
   الفاتح/المظلم، وحالة الحساب.

   الاستعمال:
     <div id="site-header" data-active="lesen"></div>

   data-active: lesen · hoeren · schreiben · sprechen · chat
*/

(function () {
    "use strict";

    const mount = document.getElementById("site-header");
    if (!mount) return;

    const NAV = [
        { key: "lesen",     href: "b2-lesen.html",     label: "Lesen" },
        { key: "hoeren",    href: "b2-hoeren.html",    label: "Hören" },
        { key: "schreiben", href: "b2-schreiben.html", label: "Schreiben" },
        { key: "sprechen",  href: "b2-sprechen.html",  label: "Sprechen" },
        { key: "chat",      href: "chat.html",         label: "Community" }
    ];

    const active = mount.dataset.active || "";

    const header = document.createElement("header");
    header.className = "site-header";

    const inner = document.createElement("div");
    inner.className = "site-header-inner";

    /* ---- العلامة ---- */
    const brand = document.createElement("a");
    brand.className = "site-brand";
    brand.href = "index.html";
    brand.innerHTML =
        '<img src="icon1.png" alt="Deutsch Einfach">' +
        '<span class="site-brand-text">' +
        '<span class="site-brand-name">Deutsch <span>Einfach</span></span>' +
        '<span class="site-brand-sub">TELC PREP B1/B2</span>' +
        "</span>";
    inner.appendChild(brand);

    /* ---- التنقل ---- */
    const nav = document.createElement("nav");
    nav.className = "site-nav";
    nav.setAttribute("aria-label", "Bereiche");

    NAV.forEach(function (item) {
        const link = document.createElement("a");
        link.href = item.href;
        link.textContent = item.label;
        if (item.key === active) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
        nav.appendChild(link);
    });
    inner.appendChild(nav);

    /* ---- اليمين ---- */
    const actions = document.createElement("div");
    actions.className = "site-actions";

    /* ضيف — حتى نعرفو شكون داخل */
    const guest = document.createElement("span");
    guest.className = "site-actions";
    guest.id = "site-guest";
    guest.innerHTML =
        '<a class="site-btn" href="login.html">تسجيل الدخول</a>' +
        '<a class="site-btn site-btn-primary" href="signup.html">إنشاء حساب</a>';
    actions.appendChild(guest);

    const user = document.createElement("a");
    user.className = "site-user";
    user.id = "site-user";
    user.href = "index.html";
    user.hidden = true;
    actions.appendChild(user);

    inner.appendChild(actions);
    header.appendChild(inner);

    /* ---- مبدّل المستوى ----
       بدل صفحات b1.html و b2.html اللي كانو كيجمعو كلشي،
       المستوى كيتبدل جوا القسم نفسو: Lesen B1 ↔ Lesen B2.
       كنعرفو المستوى الحالي من اسم الصفحة. */
    if (active) {
        const file = (location.pathname.split("/").pop() || "").toLowerCase();
        const level = file.indexOf("b1-") === 0 ? "b1" : "b2";

        const wrap = document.createElement("div");
        wrap.className = "site-level-wrap";

        const box = document.createElement("div");
        box.className = "site-level";

        [["b1", "Telc B1"], ["b2", "Telc B2"]].forEach(function (pair) {
            const link = document.createElement("a");
            link.href = pair[0] + "-" + active + ".html";
            link.textContent = pair[1];
            if (pair[0] === level) {
                link.classList.add("active");
                link.setAttribute("aria-current", "page");
            }
            box.appendChild(link);
        });

        wrap.appendChild(box);
        header.appendChild(wrap);
    }

    mount.replaceWith(header);

    /* الزر العايم ديال الوضع ماعندوش معنى وهاد الزر كاين */
    const floating = document.querySelector(".de-theme-btn");
    if (floating) floating.remove();
    document.documentElement.classList.add("has-site-header");

    /* ---- حالة الحساب ---- */
    (async function () {
        try {
            const appMod = await import("https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js");
            const authMod = await import("https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js");
            const fsMod = await import("https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js");

            const app = appMod.getApps().length
                ? appMod.getApp()
                : appMod.initializeApp({
                      apiKey: "AIzaSyDHMmaHLYRRHfdRDj-hf7s5LOqeWPTiOxU",
                      authDomain: "deutsch-einfach-4c81f.firebaseapp.com",
                      projectId: "deutsch-einfach-4c81f",
                      storageBucket: "deutsch-einfach-4c81f.firebasestorage.app",
                      messagingSenderId: "152448766933",
                      appId: "1:152448766933:web:f7824c4db8ab3caccbe35c"
                  });

            const auth = authMod.getAuth(app);
            const db = fsMod.getFirestore(app);

            /* lesen-premium.js كيحتاج الـ ID token باش يجيب المواضيع
               المدفوعة من الـ Worker. كنعطيوه auth عوض ما يعاود يحمل
               Firebase من جديد. */
            window.__deutschEinfachAuth = auth;

            authMod.onAuthStateChanged(auth, async function (account) {
                if (!account) {
                    guest.hidden = false;
                    user.hidden = true;
                    window.__deutschEinfachIsPremium = false;
                    return;
                }

                guest.hidden = true;
                user.hidden = false;

                let name = account.displayName
                    || (account.email || "").split("@")[0]
                    || "Student";
                let premium = false;

                try {
                    const snap = await fsMod.getDoc(fsMod.doc(db, "users", account.uid));
                    if (snap.exists()) {
                        const data = snap.data();
                        if (data.name) name = data.name;
                        const notExpired = !data.subscriptionEnd
                            || (data.subscriptionEnd.toDate
                                && data.subscriptionEnd.toDate().getTime() > Date.now());
                        premium = data.subscriptionActive === true && notExpired;
                    }
                } catch (error) {
                    console.warn("Header: ما قدرناش نقراو الحساب", error);
                }

                window.__deutschEinfachIsPremium = premium;

                user.textContent = "";
                const avatar = document.createElement("span");
                avatar.className = "site-avatar";
                avatar.textContent = name.trim().charAt(0).toUpperCase();
                user.appendChild(avatar);
                user.appendChild(document.createTextNode(name));

                if (premium) {
                    const badge = document.createElement("span");
                    badge.className = "site-premium";
                    badge.textContent = "PREMIUM";
                    user.appendChild(badge);
                }

                /* صفحات فيها محتوى مقفول كتسنى هاد الخبر */
                document.dispatchEvent(new CustomEvent("de-premium", { detail: premium }));
            });
        } catch (error) {
            console.warn("Header: Firebase ما تحملش", error);
            guest.hidden = false;
        }
    })();
})();

/* ===== تنضيف Service Worker قديم =====

   الموقع كان فيه PWA كيسجل /sw.js. داك الملف تحيد، ولكن
   اللي زار الموقع من قبل ما زال داك الـ worker مركّب عندو
   وكيتحكم فالصفحات — يعني كيقدر يعطيه نسخ قدام حتى من بعد
   Ctrl+Shift+R، حيت هو اللي كيجاوب قبل الشبكة.

   كنحيدو أي worker ماشي ديال الإشعارات، وكنمسحو Cache Storage.
   firebase-messaging-sw.js كيبقى — الإشعارات كتحتاجو. */

(function () {
    "use strict";

    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.getRegistrations().then(function (regs) {
        let removed = 0;

        regs.forEach(function (reg) {
            const worker = reg.active || reg.waiting || reg.installing;
            const url = worker ? worker.scriptURL : "";
            if (url.indexOf("firebase-messaging-sw.js") !== -1) return;
            removed++;
            reg.unregister();
        });

        if (!removed || !window.caches || !caches.keys) return;

        /* الـ worker القديم خلا وراه ملفات مخزنة — خاصهم يمشيو حتى هوما */
        caches.keys().then(function (names) {
            return Promise.all(names.map(function (name) { return caches.delete(name); }));
        }).then(function () {
            /* تحميلة وحدة بلا worker باش الزائر يشوف النسخة الجديدة دغيا */
            if (!sessionStorage.getItem("de-sw-cleaned")) {
                sessionStorage.setItem("de-sw-cleaned", "1");
                location.reload();
            }
        }).catch(function () { /* الوضع الخاص كيمنع caches — ماشي مشكل */ });
    }).catch(function () { /* ماكاين باس */ });
})();

/* ===== الصفحة كتعرف بوحدها إلا كانت قديمة =====

   الملفات ديال assets عندهم ?v=<بصمة>، إذن ملي كتبدل شي ملف
   المتصفح كيجيب الجديد. ولكن صفحة HTML بوحدها ماعندهاش ?v=،
   والمتصفح كيخزنها. إذن كتبقى الصفحة القديمة كتطلب الملفات
   القدام — ومنو كيبان "ما زال ماكاينش تمارين" على موضوع
   راه مدفوع.

   الحل: version.json كيتجاب ديما من الشبكة. إلا كانت البصمات
   اللي فالصفحة مخالفة لللي فيه، كنعاودو نحملو الصفحة برابط
   فيه ?_v=<build> — رابط جديد، إذن المتصفح مايقدرش يعطينا
   النسخة المخزنة. ومن بعد كنمسحو _v من الرابط باش يبقى نقي.

   sessionStorage كيمنع التكرار: كل build كيتعاود مرة وحدة. */

(function () {
    "use strict";

    /* نمسحو _v من الرابط — كان غير باش نكسرو الكاش */
    try {
        const here = new URL(location.href);
        if (here.searchParams.has("_v")) {
            here.searchParams.delete("_v");
            history.replaceState(history.state, "", here.pathname + here.search + here.hash);
        }
    } catch (error) { /* متصفح قديم — ماشي مشكل */ }

    /* هاد الملف كيتحمل قبل باقي الـ <script> ديال الصفحة، إذن
       ف هاد اللحظة ما زال ماكاينينش فالـ DOM وماغاديش نشوفو
       البصمات ديالهم. خاصنا نتسناو حتى تسالي قراءة الصفحة. */
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", check);
    } else {
        check();
    }

    function check() {

    const stamped = Array.prototype.slice
        .call(document.querySelectorAll("script[src], link[href]"))
        .map(function (node) { return node.getAttribute("src") || node.getAttribute("href"); })
        .filter(function (url) { return url && /^assets\/[^?]+\?v=[0-9a-f]+$/.test(url); });

    if (!stamped.length || typeof fetch !== "function") return;

    fetch("version.json?t=" + Date.now(), { cache: "no-store" })
        .then(function (response) { return response.ok ? response.json() : null; })
        .then(function (manifest) {
            if (!manifest || !manifest.assets || !manifest.build) return;

            const stale = stamped.some(function (url) {
                const parts = url.split("?v=");
                const fresh = manifest.assets[parts[0]];
                return fresh && fresh !== parts[1];
            });
            if (!stale) return;

            /* عاودناها من قبل لهاد الـ build؟ ما نبقاوش ندورو. */
            try {
                if (sessionStorage.getItem("de-build") === manifest.build) return;
                sessionStorage.setItem("de-build", manifest.build);
            } catch (error) { return; }

            const next = new URL(location.href);
            next.searchParams.set("_v", manifest.build);
            location.replace(next.toString());
        })
        .catch(function () { /* ماكاين لا شبكة لا ملف — الصفحة كتبقى خدامة */ });

    }
})();
