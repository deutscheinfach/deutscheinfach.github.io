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

    let active = mount.dataset.active || "";

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

    /* المستوى ديال الصفحة الحالية: b1-lesen.html → "b1" */
    const pageLevel =
        (location.pathname.split("/").pop() || "").indexOf("b1-") === 0 ? "b1" : "b2";

    NAV.forEach(function (item) {
        const link = document.createElement("a");
        /* كانت الروابط ديما b2-*، حتى ملي تكون ف صفحة B1 — إذن
           من B1 Hören، البركة على Lesen كتوديك ل B2. دابا كل
           رابط كيتبع المستوى ديال الصفحة اللي راك فيها.
           Community ماعندهاش مستوى. */
        link.href = item.key === "chat"
            ? item.href
            : pageLevel + "-" + item.key + ".html";
        link.textContent = item.label;
        /* الراوتر كيقارن بالمفتاح ماشي بالرابط: الروابط هنا ديما
           b2-*، حتى ملي تكون ف صفحة B1 (مبدّل المستوى هو اللي
           كيتكلف بالمستوى). */
        link.dataset.key = item.key;
        if (item.key === active) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
        nav.appendChild(link);
    });
    inner.appendChild(nav);

    /* ---- المؤشر اللي كيزلق بين الأقسام ----

       ملي تبرك على قسم آخر، المؤشر كيزلق ليه والمحتوى كيتلاشى،
       ومن بعد كتمشي الصفحة. */
    const pill = document.createElement("span");
    pill.className = "site-nav-pill is-first";
    pill.setAttribute("aria-hidden", "true");
    nav.insertBefore(pill, nav.firstChild);
    nav.classList.add("has-pill");

    function movePill(target) {
        if (!target) { pill.style.opacity = "0"; return; }
        pill.style.opacity = "1";
        pill.style.width = target.offsetWidth + "px";
        pill.style.height = target.offsetHeight + "px";
        pill.style.transform =
            "translate(" + target.offsetLeft + "px," + target.offsetTop + "px)";
    }

    function placePill() { movePill(nav.querySelector("a.active")); }

    /* الخطوط ما زال ما تحملوش — العرض ديال الروابط كيتبدل من بعد */
    placePill();
    requestAnimationFrame(placePill);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(placePill);
    window.addEventListener("resize", placePill);
    setTimeout(function () { pill.classList.remove("is-first"); }, 60);

    /* ---- الانتقال ديال الصفحة ----

       المؤشر كيزلق، المحتوى كيتلاشى، ومنين تسالي الحركة كنمشيو
       للصفحة الجاية. الهيدر ماشي داخل — كيبقى واقف. */
    const still = window.matchMedia
        && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---- واش المتصفح كيدير View Transitions بين الصفحات؟ ----

       إلا كان كيديرها، هو اللي خاصو يسوق الانتقال: كياخد صورة
       ديال البار قبل ما يمشي وكيلصقها مع البار ديال الصفحة
       الجديدة، إذن كتبان واقفة بلا ما تغمض. وخاصنا نحيدو
       الـfade ديالنا، وإلا كنطفيو المحتوى قبل ما ياخد المتصفح
       الصورة — وكيخرج انتقال ديال صفحة خاوية.

       onpagereveal هو العلامة ديال الانتقال بين الصفحات
       (ماشي غير داخل نفس الصفحة بحال startViewTransition). */
    const crossDocVT = "onpagereveal" in window
        && typeof CSS !== "undefined"
        && CSS.supports
        && CSS.supports("view-transition-name", "none");

    if (crossDocVT) document.documentElement.classList.add("de-vt");

    /* بركة عادية على رابط ماشي نشيط؟ */
    function plain(event) {
        const link = event.target.closest("a");
        if (!link || link.classList.contains("active")) return null;
        if (event.defaultPrevented || event.button
            || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
        return link;
    }

    /* كنطفيو المحتوى، ومنين تسالي الحركة كنمشيو. */
    function leaveTo(href) {
        document.documentElement.classList.add("de-leaving");

        let gone = false;
        const go = function () {
            if (gone) return;
            gone = true;
            location.href = href;
        };

        /* إلا ما وصلاتش نهاية الحركة (تبويب مخبي مثلا) ما نبقاوش واقفين */
        const guard = setTimeout(go, 320);
        document.addEventListener("animationend", function once(e) {
            if (e.animationName !== "de-page-out") return;
            clearTimeout(guard);
            document.removeEventListener("animationend", once);
            go();
        });
    }

    nav.addEventListener("click", function (event) {
        /* المتصفح كيسوق الانتقال بوحدو — ماخاصناش نوقفو الرابط.
           المؤشر ديال القسم الجديد كيكون ديجا فبلاصتو ف الصفحة
           الجاية، إذن حتى هو ماخاصوش تحريك بالـJS. */
        if (still || crossDocVT) return;
        const link = plain(event);
        if (!link) return;
        event.preventDefault();

        /* اللون ديال الكلمات خاصو يمشي مع المؤشر:

           - القديمة: كانت بيضا حيت المؤشر كان تحتيها. ملي
             يمشي، خاصها ترجع رمادية *دغيا* — إلا خليناها
             تتبدل بشوية، كتدوز على بياض فوق بياض وكتغيب.

           - الجديدة: ما تولّيش بيضا حتى يوصل ليها المؤشر،
             وإلا تبقى بيضا فوق بياض حتى يجي. */
        Array.prototype.forEach.call(nav.querySelectorAll("a.active"), function (old) {
            old.style.transition = "none";
            old.classList.remove("active");
            old.removeAttribute("aria-current");
            /* قراءة اللون كتجبر المتصفح يحسب الستايل دابا —
               إذن التبديل كيوقع بلا انتقال. */
            getComputedStyle(old).getPropertyValue("color");
            old.style.transition = "";
        });

        link.style.transition = "color .12s ease .18s";
        link.classList.add("active");
        link.setAttribute("aria-current", "page");

        movePill(link);
        leaveTo(link.href);
    });

    /* ---- نوجدو الصفحة الجاية قبل ما تبرك ----

       هادي هي اللي كتخلي البار ما يغمضش: المتصفح كيحمل
       وكيرسم الصفحة الجاية بالخفية ملي تحط الماوس على
       التبويب. منين تبرك، كيبدلها ف 0 ثانية — الهيدر ديال
       الصفحة الجديدة كيكون ديجا مرسوم ف نفس البلاصة.

       اللي ماعندوش Speculation Rules (Safari/Firefox) كيتجاهل
       هاد السطور وكلشي كيبقى خدام عادي. */
    (function prerender() {
        if (still) return;

        const file = (location.pathname.split("/").pop() || "").toLowerCase();
        const level = file.indexOf("b1-") === 0 ? "b1" : "b2";

        const urls = [];
        NAV.forEach(function (item) {
            if (item.key === active || item.key === "chat") return;
            urls.push(level + "-" + item.key + ".html");
        });
        /* والمستوى الآخر ديال نفس القسم */
        if (active) urls.push((level === "b1" ? "b2" : "b1") + "-" + active + ".html");

        if (!urls.length) return;

        /* prefetch: كيجيب غير الـHTML، وكيخدم ف بزاف د المتصفحات.
           prerender: كيرسمها كاملة، وكيخدم غير ف Chrome الجديد.
           اللي ماعندوش لا هاد لا هاك، كلشي كيبقى خدام عادي. */
        urls.forEach(function (url) {
            const tag = document.createElement("link");
            tag.rel = "prefetch";
            tag.href = url;
            tag.as = "document";
            document.head.appendChild(tag);
        });

        if (!HTMLScriptElement.supports
            || !HTMLScriptElement.supports("speculationrules")) return;

        const rules = document.createElement("script");
        rules.type = "speculationrules";
        rules.textContent = JSON.stringify({
            prerender: [{ source: "list", urls: urls, eagerness: "moderate" }]
        });
        document.head.appendChild(rules);
    }());

    /* رجعتي لور؟ الصفحة كانت مطفية فالكاش — نرجعوها */
    window.addEventListener("pageshow", function () {
        document.documentElement.classList.remove("de-leaving");
        placePill();
    });

    /* ---- اليمين ---- */
    const actions = document.createElement("div");
    actions.className = "site-actions";

    /* ضيف — حتى نعرفو شكون داخل */
    const guest = document.createElement("span");
    guest.className = "site-actions";
    guest.id = "site-guest";
    /* البار ولات fixed، إذن كل سطر زائد فيها كياكل من الشاشة
       ديال التيليفون. الكلمة الطويلة كتغيب تحت 560px
       (.site-btn-label-long) وكيبقى «الدخول» و«حساب» — وهكا
       العلامة والأزرار كيدخلو ف سطر واحد بدل جوج. */
    guest.innerHTML =
        '<a class="site-btn" href="login.html">'
        + '<span class="site-btn-label-long">تسجيل </span>الدخول</a>'
        + '<a class="site-btn site-btn-primary" href="signup.html">'
        + '<span class="site-btn-label-long">إنشاء </span>حساب</a>';
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

    /* ---- الحساب ديال آخر مرة ----

       Firebase كياخد نص ثانية باش يجاوب. حتى دوك اللحظات،
       البار كتبين «تسجيل الدخول / إنشاء حساب» حتى للمشترك،
       ومن بعد كتقلب للاسم ديالو. يعني ف كل برْكة على Lesen ولا
       Hören، البار كتبدل الشكل ديالها قدام عينيه.

       الحل: كنحتافظو بآخر حالة معروفة، وكنرسموها دغيا. ملي
       يجاوب Firebase كنصلحو إلا تبدل شي حاجة. هادي زينة
       برك — الاشتراك الحقيقي كيتحقق منو الـWorker، ماشي هنا. */
    const LAST = "deutschEinfachLastAccount";

    function remember(data) {
        try {
            if (data) localStorage.setItem(LAST, JSON.stringify(data));
            else localStorage.removeItem(LAST);
        } catch (error) { /* تصفح خاص: ماشي مشكل */ }
    }

    function recall() {
        try {
            const raw = localStorage.getItem(LAST);
            if (!raw) return null;
            const data = JSON.parse(raw);
            return (data && typeof data.name === "string") ? data : null;
        } catch (error) { return null; }
    }

    /* ---- رسم الزر ديال الحساب ---- */
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

    /* كنرسمو آخر حالة معروفة دغيا — بلا ما نستناو Firebase.
       القائمة ما كتتبناش دابا: ماكاينش لعجلة، وهي محتاجة
       الإيميل الحقيقي. كتوجد ملي يجاوب Firebase. */
    const last = recall();
    if (last) {
        guest.hidden = true;
        account.hidden = false;
        paint(last.name, last.premium === true);
        /* الأقفال ديال الصفحة كيتسناو هاد الخبر. كنعطيوهم
           التخمين ديال دابا باش البطائق ما يبانوش مقفولين
           ومن بعد يتحلو — والـWorker على كل حال ماكيعطي حتى
           كلمة بلا ما يتحقق من token حقيقي. */
        if (last.premium === true) window.__deutschEinfachIsPremium = true;
    }

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
       كنعرفو المستوى الحالي من اسم الصفحة.

       ⚠ ماكيدخلش ف <header>: البار ولات fixed، وإلا زدنا
       هاد المبدّل معاها كتولي 154px واقفين فوق الشاشة (238
       فالتيليفون — تلت الشاشة كاملة على واحد الزر كتستعملو
       مرة فالعام). إذن كيبقى ف التدفق العادي تحت البار. */
    let levelWrap = null;

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
            link.dataset.level = pair[0];
            if (pair[0] === level) {
                link.classList.add("active");
                link.setAttribute("aria-current", "page");
            }
            box.appendChild(link);
        });

        /* مبدّل المستوى كيمشي بنفس الانتقال ديال الأقسام */
        box.addEventListener("click", function (event) {
            if (still || crossDocVT) return;
            const link = plain(event);
            if (!link) return;
            event.preventDefault();
            leaveTo(link.href);
        });

        wrap.appendChild(box);
        levelWrap = wrap;
    }

    /* ---- الهيدر كيتعلق ف <body> مباشرة ----

       قبل، كان كيتحط ف بلاصة #site-header. فـ index.html داك
       الـ mount كان داخل .container، و:

         · .container كياخد حركة الدخول/الخروج ديال الصفحة
           (transform) — والعنصر اللي عندو جد متحرك بـ transform
           ماكيبقاش position:fixed كيخدم بالنسبة للشاشة؛
         · وحتى overflow ديال شي جد كيقدر يقطع sticky.

       ملي كيكون ولد مباشر ديال <body>، البار كتبقى واقفة
       حقيقة وما كتهزّ حتى مع الصفحة. */
    mount.remove();
    document.body.insertBefore(header, document.body.firstChild);
    if (levelWrap) header.insertAdjacentElement("afterend", levelWrap);


    /* ===================================================================
       تبديل القسم بلا ما تتحمل الصفحة
       ===================================================================

       المشكل: Lesen و Hören و Schreiben و Sprechen هوما أربع صفحات
       HTML. ملي تبرك على وحدة، المتصفح كيهدم الصفحة الحالية — والبار
       معاها — وكيعاود يبني كلشي من الصفر. مهما نكتبو `position: fixed`،
       البار كتغيب ف داك الوقت. هادا هو الـ"refresh" اللي كيبان.

       الحل: كنجيبو الصفحة الجاية بـ fetch، وكنبدلو غير المحتوى ديال
       <body>. البار ما كنمسوهاش — هي نفس العنصر من أول ما تحلّ الموقع
       حتى تسدّو. ماكاينش تحميل، ماكاينش وميض، والحالة ديال الحساب
       كتبقى كيف ما هي.

       علاش هادشي آمن هنا: أربع الصفحات ماعندهمش inline scripts، وكل
       ملفات assets/*.js مكتوبين ف IIFE بلا تعريفات ف الجذر — إذن
       كيتعاودو يتنفذو على DOM جديد بلا تصادم. والنسخة القديمة ديال كل
       hub كتسكت بوحدها (stale()).

       إلا طاح شي حاجة (نت مقطوع، صفحة ماشي ف اللائحة…) كنرجعو للتنقل
       العادي ديال المتصفح — ماكاين حتى طريق مسدود.
       =================================================================== */
    const routerOn = (function () {
        /* الأقسام + صفحات الأجزاء ديال Lesen (نفس الملفات بالضبط،
           غير data-teil كيتبدل).

           ماشي داخلين:
             · chat.html — module كبير و WebRTC، إعادة تنفيذه
               كتخلق مستمعين مكررين ومكالمات مزدوجة؛
             · b2-hoeren-teil*.html — فيهم inline scripts فيهم
               `const` ف الجذر، و`const` مرتين ف نفس الصفحة =
               SyntaxError.
           هادو كيتنقلو عادي، وهادشي ماشي مشكل: البار كتعاود
           تتبنى غير تما، ماشي ف كل برْكة. */
        const ROUTABLE =
            /^(b1|b2)-(lesen|hoeren|schreiben|sprechen)\.html$|^b2-lesen-(teil[123]|sprach[12])\.html$/;

        /* عائلة Lesen: lesen-hub.js كيتكلف بتبديل الأجزاء فنفس
           الصفحة، إذن ملي يكون التنقل جوا هاد العائلة الراوتر
           خاصو يبعد وما يعاودش يجيب الصفحة. */
        function lesenFamily(file) {
            return /^b2-lesen(-(teil[123]|sprach[12]))?\.html$/.test(file || "");
        }

        /* هادو كيخدمو ف كل الأقسام: كيتحملو مرة وحدة وكيبقاو.
           إعادة تحميلهم = بار ثانية وحارس جلسة ثاني. */
        const PERSIST = /\/(site-header|session-guard)\.js/;

        if (!window.fetch || !window.DOMParser
            || !history.pushState || !window.Promise) return false;

        function fileOf(url) {
            try {
                const u = new URL(url, location.href);
                if (u.origin !== location.origin) return null;
                return u.pathname.split("/").pop() || "index.html";
            } catch (error) { return null; }
        }

        function routable(url) {
            const file = fileOf(url);
            return !!file && ROUTABLE.test(file);
        }

        /* الستايلات: كنزيدو غير اللي ناقص. ماكنحيدو والو — ملفات
           الأقسام مشتركين، وحيدان وحدة كتخلي الصفحة عريانة للحظة. */
        function addStyles(doc) {
            const have = {};
            Array.prototype.forEach.call(
                document.querySelectorAll('link[rel="stylesheet"]'),
                function (link) { have[fileOf(link.href) || link.href] = true; });

            const waits = [];
            Array.prototype.forEach.call(
                doc.querySelectorAll('link[rel="stylesheet"]'),
                function (link) {
                    const href = link.getAttribute("href");
                    const key = fileOf(href) || href;
                    if (!href || have[key]) return;
                    have[key] = true;

                    const tag = document.createElement("link");
                    tag.rel = "stylesheet";
                    tag.href = href;
                    waits.push(new Promise(function (done) {
                        tag.onload = tag.onerror = done;
                        /* ما نوقفوش التبديل على ستايل بطيء */
                        setTimeout(done, 1500);
                    }));
                    document.head.appendChild(tag);
                });
            return Promise.all(waits);
        }

        /* <script> اللي كيجي من innerHTML ماكيتنفذش — خاصنا نعاودو
           نبنيوه. وكيخصهم يتنفذو واحد من بعد واحد: lesen-hub.js
           محتاج الداتا اللي قبلو. */
        function runScripts(nodes) {
            return nodes.reduce(function (chain, node) {
                return chain.then(function () {
                    return new Promise(function (done) {
                        const tag = document.createElement("script");
                        Array.prototype.forEach.call(node.attributes, function (a) {
                            tag.setAttribute(a.name, a.value);
                        });
                        if (node.src) {
                            tag.onload = tag.onerror = done;
                        } else {
                            tag.textContent = node.textContent;
                        }
                        document.body.appendChild(tag);
                        if (!node.src) done();
                    });
                });
            }, Promise.resolve());
        }

        /* البار: القسم النشيط، المؤشر، وروابط المستوى */
        function setActive(key) {
            active = key;

            const lvl = (fileOf(location.pathname) || "").indexOf("b1-") === 0 ? "b1" : "b2";

            Array.prototype.forEach.call(nav.querySelectorAll("a"), function (link) {
                const mine = link.dataset.key === key;
                /* بدلنا المستوى؟ الروابط خاصها تتبع */
                if (link.dataset.key !== "chat") {
                    link.href = lvl + "-" + link.dataset.key + ".html";
                }
                link.classList.toggle("active", mine);
                if (mine) link.setAttribute("aria-current", "page");
                else link.removeAttribute("aria-current");
            });
            placePill();

            /* مبدّل المستوى كيبقى على نفس القسم: Lesen B1 ↔ Lesen B2 */
            if (levelWrap) {
                Array.prototype.forEach.call(levelWrap.querySelectorAll("a"), function (link) {
                    const mine = link.dataset.level === lvl;
                    link.href = link.dataset.level + "-" + key + ".html";
                    link.classList.toggle("active", mine);
                    if (mine) link.setAttribute("aria-current", "page");
                    else link.removeAttribute("aria-current");
                });
            }
        }

        let busy = false;
        let herefile = fileOf(location.pathname);

        function swap(doc) {
            /* كنحيدو المحتوى القديم — غير البار وشريط المستوى
               كيبقاو. هوما نفس العناصر، ماكيتبناوش من جديد. */
            const keep = [header, levelWrap];
            Array.prototype.slice.call(document.body.childNodes).forEach(function (node) {
                if (keep.indexOf(node) === -1) node.remove();
            });

            const scripts = [];
            Array.prototype.slice.call(doc.body.children).forEach(function (node) {
                if (node.tagName === "SCRIPT") {
                    if (!PERSIST.test(node.getAttribute("src") || "")) scripts.push(node);
                    return;
                }
                /* الـmount ديال البار: عندنا وحدة حية، ماخاصناش ثانية */
                if (node.id === "site-header") {
                    active = node.dataset.active || active;
                    return;
                }
                document.body.appendChild(document.importNode(node, true));
            });

            document.title = doc.title || document.title;
            /* الاتجاه واللغة ديال الصفحة الجديدة (rtl/ltr). بلا هادي،
               الدخول من صفحة rtl كان كيخلي Lesen/Sprechen مقلوبين حتى
               يدير المستخدم refresh. */
            ["dir", "lang"].forEach(function (name) {
                const value = doc.documentElement.getAttribute(name);
                if (value) document.documentElement.setAttribute(name, value);
                else document.documentElement.removeAttribute(name);
            });
            setActive(active);
            return scripts;
        }

        function go(url, push) {
            if (busy) return;
            busy = true;
            herefile = fileOf(url);

            const bail = function () { location.href = url; };

            fetch(url, { credentials: "same-origin" })
                .then(function (res) {
                    if (!res.ok) throw new Error("HTTP " + res.status);
                    return res.text();
                })
                .then(function (html) {
                    const doc = new DOMParser().parseFromString(html, "text/html");
                    if (!doc || !doc.body) throw new Error("ما تقراش");

                    return addStyles(doc).then(function () {
                        if (push) history.pushState({ de: url }, "", url);

                        const paint = function () {
                            const scripts = swap(doc);
                            window.scrollTo(0, 0);
                            return runScripts(scripts);
                        };

                        /* المتصفح كياخد صورة قبل وبعد وكيمزج بيناتهم.
                           البار عندها view-transition-name ديالها، إذن
                           ما كتدخلش فالحركة — كتبقى واقفة. */
                        if (document.startViewTransition
                            && !(window.matchMedia
                                 && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
                            return document.startViewTransition(paint).finished
                                .catch(function () {});
                        }
                        return paint();
                    });
                })
                .then(function () { busy = false; })
                .catch(function (error) {
                    console.warn("Router: رجعنا للتنقل العادي", error);
                    busy = false;
                    bail();
                });
        }

        /* برْكة على صفحة راك فيها = ماشي تنقل. بلا هادشي،
           المتصفح كيعاود يحمل نفس الصفحة — وهادا بالضبط
           الـ"refresh" اللي ماكانش خاصو يكون. */
        function here(link) {
            const target = link.getAttribute("href");
            if (!target) return false;
            const u = new URL(target, location.href);
            return u.pathname === location.pathname && u.search === location.search;
        }

        /* البار */
        nav.addEventListener("click", function (event) {
            const link = event.target.closest("a");
            if (!link) return;
            if (event.button || event.metaKey || event.ctrlKey
                || event.shiftKey || event.altKey) return;
            if (link.classList.contains("active") || here(link)) {
                event.preventDefault();
                return;
            }
            if (event.defaultPrevented || event.button
                || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            if (!routable(link.getAttribute("href"))) return;
            event.preventDefault();
            go(link.href, true);
        }, true);

        /* مبدّل المستوى */
        if (levelWrap) {
            levelWrap.addEventListener("click", function (event) {
                const link = event.target.closest("a");
                if (!link) return;
                if (event.button || event.metaKey || event.ctrlKey
                    || event.shiftKey || event.altKey) return;
                if (link.classList.contains("active") || here(link)) {
                    event.preventDefault();
                    return;
                }
                if (event.defaultPrevented || event.button
                    || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                if (!routable(link.getAttribute("href"))) return;
                event.preventDefault();
                go(link.href, true);
            }, true);
        }

        /* زر الرجوع: إلا تبدل اسم الصفحة كنعاودو نجيبوها.
           إلا تبدل غير ?thema= ولا ?teil=، كنخليو hub ديال
           القسم يتكلف بيه — ماشي شغلنا. */
        window.addEventListener("popstate", function () {
            const now = fileOf(location.pathname);
            if (now === herefile) return;

            /* Teil 1 ↔ Teil 3 مثلا: hub ديال Lesen كيتكلف */
            if (lesenFamily(now) && lesenFamily(herefile)) {
                herefile = now;
                return;
            }

            if (routable(location.pathname)) { go(location.href, false); return; }

            /* صفحة ماشي ف اللائحة (chat، Hören Teil…): الرابط ديجا
               تبدل، إذن reload كيحمل الصفحة الصحيحة. */
            herefile = now;
            location.reload();
        });

        return true;
    }());

    /* الزر العايم ديال الوضع ماعندوش معنى وهاد الزر كاين */
    const floating = document.querySelector(".de-theme-btn");
    if (floating) floating.remove();
    document.documentElement.classList.add("has-site-header");

    /* ---- الطول ديال البار ----

       البار ولات fixed، إذن كتخرج من التدفق. خاص الصفحة
       تعرف شحال تخلي ليها من فوق — و التبويبات (Teil 1/2/3)
       خاصها تعرف فين تلصق تحتيها. الطول كيتبدل مع العرض
       ديال الشاشة، إذن كنقيسوه بدل ما نكتبو رقم ثابت. */
    function measure() {
        const h = Math.round(header.getBoundingClientRect().height);
        if (h > 0) {
            document.documentElement.style.setProperty("--site-header-h", h + "px");
        }
    }

    measure();
    requestAnimationFrame(measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    window.addEventListener("resize", measure);
    if (window.ResizeObserver) new ResizeObserver(measure).observe(header);

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
                      appId: "1:152448766933:web:f7824c4db8ab3caccbe35c",
                      measurementId: "G-9QV234Z0KZ"
                  });

            const auth = authMod.getAuth(app);
            const db = fsMod.getFirestore(app);

            /* lesen-premium.js كيحتاج الـ ID token باش يجيب المواضيع
               المدفوعة من الـ Worker. كنعطيوه auth عوض ما يعاود يحمل
               Firebase من جديد. */
            window.__deutschEinfachAuth = auth;

            authMod.onAuthStateChanged(auth, async function (person) {
                if (!person) {
                    /* خرج بصح — كنمسحو الذاكرة باش المرة الجاية
                       ما نرسموش ليه حساب ماكاينش. */
                    remember(null);
                    guest.hidden = false;
                    account.hidden = true;
                    openMenu(false);
                    window.__deutschEinfachIsPremium = false;
                    document.dispatchEvent(new CustomEvent("de-premium", { detail: false }));
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

                /* باش المرة الجاية البار تبان صحيحة من أول رسمة */
                remember({ name: name, premium: premium });

                paint(name, premium);
                buildMenu(person, name, premium);

                /* صفحات فيها محتوى مقفول كتسنى هاد الخبر */
                document.dispatchEvent(new CustomEvent("de-premium", { detail: premium }));

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
                            /* نمسحو الذاكرة قبل ما نمشيو — وإلا
                               index.html كتبدا برسم حساب خارج. */
                            remember(null);
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

            /* كان هنا غير `guest.hidden = false` — بلا ما يخبي
               الحساب. النتيجة: البار كتبين الزوج ف نفس الوقت،
               الاسم ديال المستعمل *و* «تسجيل الدخول».

               وزيادة: ماقدرناش نتحققو من شكون داخل، إذن إلا
               كانت عندنا آخر حالة معروفة كنخليوها — أحسن من
               نوريو «تسجيل الدخول» لواحد داخل ومشترك. */
            if (recall()) {
                guest.hidden = true;
                account.hidden = false;
            } else {
                guest.hidden = false;
                account.hidden = true;
            }
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
