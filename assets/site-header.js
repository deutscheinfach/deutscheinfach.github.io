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

    const themeBtn = document.createElement("button");
    themeBtn.type = "button";
    themeBtn.className = "site-btn site-btn-icon";
    themeBtn.id = "site-theme-btn";
    themeBtn.setAttribute("aria-label", "الوضع الفاتح/المظلم");
    themeBtn.innerHTML =
        '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" ' +
        'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<circle cx="12" cy="12" r="8"></circle>' +
        '<path d="M12 4a8 8 0 0 0 0 16z" fill="currentColor" stroke="none"></path></svg>';
    themeBtn.addEventListener("click", function () {
        if (window.__deTheme) window.__deTheme.toggle();
    });
    actions.appendChild(themeBtn);

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
