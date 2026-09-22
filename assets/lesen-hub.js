/* ===== شبكة المواضيع + التمرين فنفس الصفحة =====

   الصفحة عندها حالتين:
     - اللائحة: بحث، ترتيب، وبطائق.
     - التمرين: كيعوض اللائحة فنفس الصفحة، مع زر رجوع.

   ماكاينش تنقل لصفحة أخرى — غير الرابط كيتبدل (?thema=…)
   باش زر الرجوع ديال الـ navigateur والتحديث يخدمو. */

(function () {
    "use strict";

    const grid = document.getElementById("lesen-grid");
    const toolbar = document.querySelector(".lesen-toolbar");
    const countEl = document.getElementById("lesen-count");
    const statEl  = document.getElementById("lesen-stat-count");
    /* الهيدر ديال القسم كامل (العنوان + العداد) والتبويبات ديال فوق —
       خاصهم يتخباو ملي يتحل التمرين، وإلا كيبقاو معلقين فوقو. */
    const heroEl = document.querySelector(".lesen-head-row")
        || document.querySelector(".lesen-hero");
    const tabsNav = document.querySelector(".lesen-shell > .lesen-tabs");
    const detail = document.getElementById("lesen-detail");
    const search = document.getElementById("lesen-search-input");
    const sortBtn = document.getElementById("lesen-sort-btn");

    if (!grid || !detail) return;

    /* الانتقال بين Teil 1 و Teil 2/3: المتصفحات الجديدة كتديرو بوحدها
       (@view-transition ف الـCSS). اللي ما عندوش، كنطفيو الصفحة بشوية
       قبل ما نمشيو باش ما يبقاش القطع خشين. */
    (function tabTransitions() {
        const shell = document.querySelector(".lesen-shell");
        const nav = document.querySelector(".lesen-shell > .lesen-tabs");
        if (!shell || !nav) return;
        if (document.startViewTransition) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        nav.addEventListener("click", function (event) {
            const tab = event.target.closest("a.lesen-tab");
            if (!tab || tab.classList.contains("active")) return;
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.button) return;

            event.preventDefault();
            shell.classList.add("lt-leaving");
            const go = function () { location.href = tab.href; };
            const guard = setTimeout(go, 220);
            shell.addEventListener("transitionend", function once(e) {
                if (e.target !== shell) return;
                clearTimeout(guard);
                shell.removeEventListener("transitionend", once);
                go();
            });
        });
    }());



    const PARTS = [
        { key: "teil1",   label: "Teil 1" },
        { key: "teil2",   label: "Teil 2" },
        { key: "teil3",   label: "Teil 3" },
        { key: "sprach1", label: "Sprach 1" },
        { key: "sprach2", label: "Sprach 2" }
    ];
    const PART_LABEL = {};
    PARTS.forEach(function (p) { PART_LABEL[p.key] = p.label; });

    /* الجزء ديال هاد الصفحة: teil1 مثلا. فارغ = صفحة Prüfungen. */
    const pagePart = grid.dataset.teil || "";

    const topics = Array.isArray(window.LESEN_B2_TOPICS)
        ? window.LESEN_B2_TOPICS.slice()
        : [];

    const SORTS = [
        { key: "default", label: "ترتيب" },
        { key: "alpha", label: "أبجدي" },
        { key: "free", label: "المجاني أولا" }
    ];
    let sortIndex = 0;

    /* ================= اللائحة ================= */

    function listed() {
        const term = (search ? search.value : "").trim().toLowerCase();

        let list = topics.filter(function (topic) {
            /* صفحة جزء معيّن كتبين غير المواضيع اللي فيهم داك الجزء */
            if (pagePart) {
                const parts = topic.parts || [];
                if (parts.length && parts.indexOf(pagePart) === -1) return false;
            }
            if (!term) return true;
            return (topic.title || "").toLowerCase().includes(term)
                || (topic.ar || "").includes(term)
                || (topic.id || "").toLowerCase().includes(term);
        });

        const mode = SORTS[sortIndex].key;

        if (mode === "alpha") {
            list = list.slice().sort(function (a, b) {
                return (a.title || "").localeCompare(b.title || "", "de");
            });
        } else if (mode === "free") {
            list = list.slice().sort(function (a, b) {
                return (a.locked === b.locked) ? 0 : (a.locked ? 1 : -1);
            });
        }

        return list;
    }

    /* الحركة ديال البطائق كتبان ملي تحل اللائحة ولا تبدل الترتيب،
       ماشي مع كل حرف كيتكتب ف البحث. */
    function renderList(animate) {
        const list = listed();
        grid.textContent = "";

        if (countEl) countEl.textContent = list.length ? list.length + " موضوع" : "";
        /* الرقم ديال فوق كيتبع التبويب الحالي، ماشي رقم ثابت. */
        if (statEl) statEl.textContent = String(list.length);

        if (!list.length) {
            const empty = document.createElement("div");
            empty.className = "lesen-empty";
            empty.textContent = topics.length
                ? "ماكاين حتى موضوع بهاد الاسم."
                : "ما زال ماكاينش مواضيع.";
            grid.appendChild(empty);
            return;
        }

        grid.classList.remove("lt-enter");
        if (animate) void grid.offsetWidth;

        list.forEach(function (topic, i) {
            const node = card(topic);
            /* رقم لكل بطاقة باش يطلعو وحدة من بعد وحدة */
            node.style.setProperty("--lt-i", Math.min(i, 14));
            grid.appendChild(node);
        });

        if (animate) grid.classList.add("lt-enter");
    }

    function card(topic) {
        /* المشترك عندو گاع المواضيع — ماعندوش علاش يشوف PRO */
        const shut = topic.locked && !window.__deutschEinfachIsPremium;

        const node = document.createElement("a");
        node.className = "lesen-card" + (shut ? " locked" : "");
        node.href = pageUrl(topic.id, pagePart);

        const title = document.createElement("div");
        title.className = "lesen-card-title";
        title.appendChild(document.createTextNode(topic.title || topic.id));
        if (topic.ar) {
            const ar = document.createElement("span");
            ar.className = "lesen-card-ar";
            ar.textContent = "(" + topic.ar + ")";
            title.appendChild(ar);
        }
        node.appendChild(title);

        const rule = document.createElement("div");
        rule.className = "lesen-card-rule";
        node.appendChild(rule);

        const foot = document.createElement("div");
        foot.className = "lesen-card-foot";
        foot.appendChild(chip("lesen-chip-level", topic.level || "B2"));

        const parts = topic.parts || [];
        const shownPart = pagePart || parts[0];
        if (shownPart) {
            foot.appendChild(chip("lesen-chip-parts", "Lesen " + (PART_LABEL[shownPart] || shownPart)));
        }
        if (!pagePart && parts.length > 1) {
            foot.appendChild(chip("lesen-chip-parts", "+" + parts.length));
        }

        /* المجاني خاصو يبان — هو اللي كيخلي الطالب يجرب */
        if (!topic.locked) foot.appendChild(chip("lesen-chip-free", "مجاني"));

        const go = document.createElement("span");
        go.className = "lesen-card-go";
        go.textContent = shut ? "🔒" : "›";
        go.setAttribute("aria-hidden", "true");
        foot.appendChild(go);

        node.appendChild(foot);

        node.addEventListener("click", function (event) {
            /* فتح ف تبويب جديد خاصو يبقى خدام عادي */
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
            event.preventDefault();
            open(topic.id, pagePart || parts[0] || "teil1", true);
        });

        return node;
    }

    function chip(className, text) {
        const node = document.createElement("span");
        node.className = "lesen-chip " + className;
        node.textContent = text;
        return node;
    }

    /* ================= التمرين ================= */

    function pageUrl(themaId, part) {
        const params = new URLSearchParams();
        params.set("thema", themaId);
        if (part) params.set("teil", part);
        return location.pathname + "?" + params.toString();
    }

    function open(themaId, part, push) {
        const topic = topics.find(function (t) { return t.id === themaId; });
        if (!topic) { close(push); return; }

        if (push) history.pushState({ thema: themaId, teil: part }, "", pageUrl(themaId, part));

        if (heroEl) heroEl.hidden = true;
        if (tabsNav) tabsNav.hidden = true;
        if (toolbar) toolbar.hidden = true;
        if (countEl) countEl.hidden = true;
        grid.hidden = true;
        detail.hidden = false;

        detail.textContent = "";

        /* رأس التمرين: رجوع + الاسم */
        const head = document.createElement("div");
        head.className = "lesen-detail-head";

        const back = document.createElement("button");
        back.type = "button";
        back.className = "lesen-back";
        back.textContent = "← اللائحة";
        back.addEventListener("click", function () { close(true); });
        head.appendChild(back);

        const h1 = document.createElement("h1");
        h1.className = "lesen-detail-title";
        h1.appendChild(document.createTextNode(topic.title || topic.id));
        if (topic.ar) {
            const ar = document.createElement("span");
            ar.className = "lesen-card-ar";
            ar.textContent = "(" + topic.ar + ")";
            h1.appendChild(ar);
        }
        head.appendChild(h1);
        detail.appendChild(head);

        const content = (window.LESEN_B2_CONTENT || {})[themaId] || {};
        const available = (topic.parts && topic.parts.length)
            ? PARTS.filter(function (p) { return topic.parts.indexOf(p.key) !== -1; })
            : PARTS;

        let current = available.some(function (p) { return p.key === part; })
            ? part
            : available[0].key;

        /* تبويبات الأجزاء — غير إلا كان الموضوع فيه أكثر من واحد */
        if (available.length > 1) {
            const tabs = document.createElement("nav");
            tabs.className = "lesen-tabs lesen-part-tabs";

            available.forEach(function (p) {
                const tab = document.createElement("button");
                tab.type = "button";
                tab.className = "lesen-tab" + (p.key === current ? " active" : "");
                tab.textContent = p.label;
                if (!content[p.key]) tab.classList.add("is-empty");
                tab.addEventListener("click", function () {
                    current = p.key;
                    Array.from(tabs.children).forEach(function (other, i) {
                        other.classList.toggle("active", available[i].key === current);
                    });
                    history.replaceState({ thema: themaId, teil: current }, "",
                        pageUrl(themaId, current));
                    paint();
                });
                tabs.appendChild(tab);
            });

            detail.appendChild(tabs);
        }

        const stack = document.createElement("div");
        stack.id = "lesen-stack";
        stack.setAttribute("data-manual", "");
        detail.appendChild(stack);

        window.scrollTo({ top: 0, behavior: "smooth" });
        paint();

        function paint() {
            stack.textContent = "";

            /* المواضيع المدفوعة ماكايناش نصوصهم فهاد الملف. كيتجابو من
               الـ Worker، اللي كيتحقق من الـ ID token ومن الاشتراك قبل
               ما يعطي حتى كلمة. */
            if (topic.locked) {
                if (!window.__deutschEinfachIsPremium) { gate(); return; }

                const loading = document.createElement("div");
                loading.className = "lesen-empty";
                loading.textContent = "كنجيبو التمرين…";
                stack.appendChild(loading);

                const wanted = current;
                Promise.resolve(
                    typeof window.__lesenPremiumFetch === "function"
                        ? window.__lesenPremiumFetch(themaId)
                        : null
                ).then(function (result) {
                    /* بدّل الجزء ولا خرج من التمرين وهو كيجيب؟ نحبسو. */
                    if (current !== wanted || detail.hidden) return;
                    stack.textContent = "";

                    const remote = result && result.ok
                        ? (result.data || {})[wanted]
                        : null;

                    /* مشترك وما وصلوش المحتوى = كاين شي حاجة خايبة،
                       خاصو يعرف شنو هي بدل ما يشوف غير القفل. */
                    if (!remote) {
                        gate(result && result.why
                            ? result.why
                            : "ما لقيناش هاد الموضوع فالمحتوى المدفوع.");
                        return;
                    }
                    draw(remote);
                });
                return;
            }

            const task = content[current];

            if (!task) {
                const box = document.createElement("div");
                box.className = "lesen-empty";
                box.textContent = "ما زال ماكاينش تمارين ف هاد الجزء.";
                stack.appendChild(box);
                return;
            }

            draw(task);
        }

        function gate(why) {
            stack.textContent = "";
            if (typeof window.__premiumGate === "function") {
                window.__premiumGate(stack, { title: topic.title, note: why });
            } else {
                const box = document.createElement("div");
                box.className = "lesen-empty";
                box.textContent = "🔒 هاد الموضوع ديال Premium.";
                stack.appendChild(box);
            }
        }

        function draw(task) {
            /* Teil 1 عندو شكل ديالو: نسخ، لوحة ترويسات، وملخصات. */
            if (task.kind === "matching"
                && typeof window.__lesenTeil1Render === "function") {
                window.__lesenTeil1Render(stack, task);
                return;
            }

            window.LESEN_TOPICS = [Object.assign({ id: themaId + "-" + current }, task)];
            if (typeof window.__lesenRenderInto === "function") {
                window.__lesenRenderInto(stack);
            }
        }
    }

    function close(push) {
        if (push) history.pushState({}, "", location.pathname);
        detail.hidden = true;
        detail.textContent = "";
        if (heroEl) heroEl.hidden = false;
        if (tabsNav) tabsNav.hidden = false;
        if (toolbar) toolbar.hidden = false;
        if (countEl) countEl.hidden = false;
        grid.hidden = false;
    }

    /* زر الرجوع ديال الـ navigateur */
    window.addEventListener("popstate", function () {
        const params = new URLSearchParams(location.search);
        const thema = params.get("thema");
        if (thema) open(thema, params.get("teil") || pagePart || "teil1", false);
        else close(false);
    });

    if (search) search.addEventListener("input", function () { renderList(false); });
    if (sortBtn) {
        sortBtn.addEventListener("click", function () {
            sortIndex = (sortIndex + 1) % SORTS.length;
            sortBtn.querySelector(".label").textContent = SORTS[sortIndex].label;
            renderList(true);
        });
    }

    renderList(true);

    /* حالة الاشتراك كتوصل من الهيدر من بعد ما يجاوب Firebase.
       إلا كان التمرين محلول وهو Premium، كنعاودو نرسموه. */
    document.addEventListener("de-premium", function () {
        /* اللائحة خاصها تتعاود: الأقفال كيطيحو ملي يبان الاشتراك */
        renderList();

        if (detail.hidden) return;
        const params = new URLSearchParams(location.search);
        const thema = params.get("thema");
        if (thema) open(thema, params.get("teil") || pagePart || "teil1", false);
    });

    /* الرابط جا فيه موضوع؟ نحلوه دغيا. */
    const startParams = new URLSearchParams(location.search);
    if (startParams.get("thema")) {
        open(startParams.get("thema"),
             startParams.get("teil") || pagePart || "teil1", false);
    }
})();
