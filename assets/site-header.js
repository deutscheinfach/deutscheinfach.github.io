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

    /* ---- الحساب: زر + قائمة ----
       كان غير رابط. ولا زر كيحل قائمة فيها تبديل الاسم
       وتسجيل الخروج، حيت ماكانتش شي بلاصة يدير فيها المستعمل
       هاد الحوايج. */
    const account = document.createElement("div");
    account.className = "site-account";
    account.hidden = true;

    const user = document.createElement("button");
    user.type = "button";
    user.className = "site-user";
    user.id = "site-user";
    user.setAttribute("aria-haspopup", "menu");
    user.setAttribute("aria-expanded", "false");

    const caret = document.createElement("span");
    caret.className = "site-user-caret";
    caret.setAttribute("aria-hidden", "true");

    const menu = document.createElement("div");
    menu.className = "site-menu";
    menu.setAttribute("role", "menu");
    menu.hidden = true;

    account.append(user, menu);
    actions.appendChild(account);

    function openMenu(open) {
        menu.hidden = !open;
        account.classList.toggle("is-open", open);
        user.setAttribute("aria-expanded", open ? "true" : "false");
    }

    user.addEventListener("click", function (event) {
        event.stopPropagation();
        openMenu(menu.hidden);
    });
    document.addEventListener("click", function (event) {
        if (!account.contains(event.target)) openMenu(false);
    });
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") openMenu(false);
    });

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

            authMod.onAuthStateChanged(auth, async function (person) {
                if (!person) {
                    guest.hidden = false;
                    account.hidden = true;
                    openMenu(false);
                    window.__deutschEinfachIsPremium = false;
                    return;
                }

                guest.hidden = true;
                account.hidden = false;

                let name = person.displayName
                    || (person.email || "").split("@")[0]
                    || "Student";
                let premium = false;

                try {
                    const snap = await fsMod.getDoc(fsMod.doc(db, "users", person.uid));
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

                paint(name, premium);
                buildMenu(person, name, premium);

                /* صفحات فيها محتوى مقفول كتسنى هاد الخبر */
                document.dispatchEvent(new CustomEvent("de-premium", { detail: premium }));

                /* ---- رسم الزر ---- */
                function paint(label, isPremium) {
                    user.textContent = "";

                    const avatar = document.createElement("span");
                    avatar.className = "site-avatar";
                    avatar.textContent = label.trim().charAt(0).toUpperCase() || "?";
                    user.appendChild(avatar);

                    const text = document.createElement("span");
                    text.className = "site-user-name";
                    text.textContent = label;
                    user.appendChild(text);

                    if (isPremium) {
                        const badge = document.createElement("span");
                        badge.className = "site-premium";
                        badge.textContent = "PREMIUM";
                        user.appendChild(badge);
                    }

                    user.appendChild(caret);
                }

                /* ---- القائمة ---- */
                function buildMenu(who, label, isPremium) {
                    menu.textContent = "";

                    /* الرأس: الاسم والإيميل */
                    const head = document.createElement("div");
                    head.className = "site-menu-head";

                    const big = document.createElement("span");
                    big.className = "site-avatar site-avatar-lg";
                    big.textContent = label.trim().charAt(0).toUpperCase() || "?";

                    const who2 = document.createElement("span");
                    who2.className = "site-menu-who";

                    const nameEl = document.createElement("strong");
                    nameEl.textContent = label;
                    const mailEl = document.createElement("span");
                    mailEl.textContent = who.email || "";
                    who2.append(nameEl, mailEl);

                    head.append(big, who2);
                    menu.appendChild(head);

                    if (!isPremium) {
                        const up = document.createElement("a");
                        up.className = "site-menu-item site-menu-up";
                        up.href = "payment.html";
                        up.append(icon("star"),
                                  document.createTextNode("ترقّى لـ Premium"));
                        menu.appendChild(up);
                    }

                    /* تبديل الاسم والنسب */
                    const rename = item("user", "بدّل الاسم والنسب");
                    menu.appendChild(rename);

                    const form = document.createElement("form");
                    form.className = "site-menu-form";
                    form.hidden = true;

                    const input = document.createElement("input");
                    input.type = "text";
                    input.className = "site-menu-input";
                    input.value = label;
                    input.maxLength = 60;
                    input.autocomplete = "name";
                    input.setAttribute("aria-label", "الاسم والنسب");

                    const save = document.createElement("button");
                    save.type = "submit";
                    save.className = "site-menu-save";
                    save.textContent = "حفظ";

                    const note = document.createElement("p");
                    note.className = "site-menu-note";
                    note.hidden = true;

                    form.append(input, save, note);
                    menu.appendChild(form);

                    rename.addEventListener("click", function () {
                        form.hidden = !form.hidden;
                        rename.classList.toggle("is-open", !form.hidden);
                        if (!form.hidden) { input.focus(); input.select(); }
                    });

                    form.addEventListener("submit", async function (event) {
                        event.preventDefault();

                        const next = input.value.trim().replace(/\s+/g, " ");
                        if (!next) {
                            say("عافاك كتب الاسم ديالك.", true);
                            return;
                        }
                        if (next === label) { form.hidden = true; return; }

                        save.disabled = true;
                        save.textContent = "…";

                        try {
                            await fsMod.setDoc(
                                fsMod.doc(db, "users", who.uid),
                                { name: next },
                                { merge: true });
                            try {
                                await authMod.updateProfile(who, { displayName: next });
                            } catch (error) { /* Firestore هو المرجع */ }

                            paint(next, isPremium);
                            nameEl.textContent = next;
                            big.textContent = next.charAt(0).toUpperCase();
                            say("تبدل الاسم ديالك.", false);
                            setTimeout(function () {
                                form.hidden = true;
                                rename.classList.remove("is-open");
                                note.hidden = true;
                            }, 1200);
                        } catch (error) {
                            console.warn("Header: ما تبدلش الاسم", error);
                            say("ما قدرناش نحفظو. عاود جرب.", true);
                        }

                        save.disabled = false;
                        save.textContent = "حفظ";
                    });

                    function say(text, bad) {
                        note.textContent = text;
                        note.hidden = false;
                        note.classList.toggle("is-bad", !!bad);
                    }

                    /* تسجيل الخروج */
                    const out = item("out", "تسجيل الخروج");
                    out.classList.add("site-menu-out");
                    out.addEventListener("click", async function () {
                        out.disabled = true;
                        try {
                            await authMod.signOut(auth);
                            location.href = "index.html";
                        } catch (error) {
                            console.warn("Header: ما خرجناش", error);
                            out.disabled = false;
                        }
                    });
                    menu.appendChild(out);
                }

                function item(kind, label) {
                    const node = document.createElement("button");
                    node.type = "button";
                    node.className = "site-menu-item";
                    node.setAttribute("role", "menuitem");
                    node.append(icon(kind), document.createTextNode(label));
                    return node;
                }

                function icon(kind) {
                    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    svg.setAttribute("viewBox", "0 0 24 24");
                    svg.setAttribute("class", "site-menu-icon");
                    svg.setAttribute("aria-hidden", "true");
                    svg.setAttribute("fill", "none");
                    svg.setAttribute("stroke", "currentColor");
                    svg.setAttribute("stroke-width", "1.8");
                    svg.setAttribute("stroke-linecap", "round");
                    svg.setAttribute("stroke-linejoin", "round");

                    const paths = {
                        user: ["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6"],
                        out:  ["M15 17l5-5-5-5", "M20 12H9", "M12 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6"],
                        star: ["M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5Z"]
                    };

                    (paths[kind] || []).forEach(function (d) {
                        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                        path.setAttribute("d", d);
                        svg.appendChild(path);
                    });
                    return svg;
                }
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
