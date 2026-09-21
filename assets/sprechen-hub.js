/* ===== شبكة مواضيع Sprechen + التمرين فنفس الصفحة =====

   نفس الفكرة ديال lesen-hub.js:
     - اللائحة: تبويبات الأجزاء، بحث، ترتيب، وبطائق.
     - التمرين: كيعوض اللائحة فنفس الصفحة، مع زر رجوع.

   ماكاينش تنقل لصفحة أخرى — غير الرابط كيتبدل (?thema=…&teil=…)
   باش زر الرجوع ديال الـ navigateur والتحديث يخدمو. */

(function () {
    "use strict";

    const grid = document.getElementById("sprechen-grid");
    const detail = document.getElementById("sprechen-detail");
    const toolbar = document.querySelector(".lesen-toolbar");
    const tabsNav = document.getElementById("sprechen-tabs");
    const countEl = document.getElementById("sprechen-count");
    const heroEl = document.querySelector(".lesen-head-row");
    const search = document.getElementById("sprechen-search-input");
    const sortBtn = document.getElementById("sprechen-sort-btn");
    const totalEl = document.getElementById("sprechen-total");

    if (!grid || !detail) return;

    const PARTS = [
        { key: "teil1", label: "Teil 1", name: "Präsentation" },
        { key: "teil2", label: "Teil 2", name: "Diskussion" },
        { key: "teil3", label: "Teil 3", name: "Problemlösung" }
    ];
    const PART_LABEL = {};
    const PART_NAME = {};
    PARTS.forEach(function (p) { PART_LABEL[p.key] = p.label; PART_NAME[p.key] = p.name; });

    const topics = Array.isArray(window.SPRECHEN_B2_TOPICS)
        ? window.SPRECHEN_B2_TOPICS.slice()
        : [];

    const SORTS = [
        { key: "default", label: "ترتيب" },
        { key: "alpha",   label: "أبجدي" },
        { key: "free",    label: "المجاني أولا" }
    ];
    let sortIndex = 0;

    /* الجزء المختار من التبويبات. فارغ = گاع الأجزاء. */
    let activePart = "";

    /* ================= اللائحة ================= */

    function listed() {
        const term = (search ? search.value : "").trim().toLowerCase();

        let list = topics.filter(function (topic) {
            if (activePart) {
                const parts = topic.parts || [];
                if (parts.length && parts.indexOf(activePart) === -1) return false;
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

    function renderList() {
        const list = listed();
        grid.textContent = "";

        if (countEl) countEl.textContent = list.length ? list.length + " موضوع" : "";

        if (!list.length) {
            const empty = document.createElement("div");
            empty.className = "lesen-empty";
            empty.textContent = topics.length
                ? "ماكاين حتى موضوع بهاد الاسم."
                : "ما زال ماكاينش مواضيع.";
            grid.appendChild(empty);
            return;
        }

        list.forEach(function (topic) { grid.appendChild(card(topic)); });
    }

    function card(topic) {
        const parts = topic.parts || [];
        const shownPart = activePart || parts[0] || "teil1";

        const shut = topic.locked && !window.__deutschEinfachIsPremium;

        const node = document.createElement("a");
        node.className = "lesen-card" + (shut ? " locked" : "");
        node.href = pageUrl(topic.id, shownPart);

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
        foot.appendChild(chip("lesen-chip-parts",
            activePart ? PART_NAME[activePart] : (parts.length + " أجزاء")));

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
            open(topic.id, shownPart, true);
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
        if (themaId) params.set("thema", themaId);
        if (part) params.set("teil", part);
        const query = params.toString();
        return location.pathname + (query ? "?" + query : "");
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

        const content = (window.SPRECHEN_B2_CONTENT || {})[themaId] || {};
        const available = (topic.parts && topic.parts.length)
            ? PARTS.filter(function (p) { return topic.parts.indexOf(p.key) !== -1; })
            : PARTS;

        let current = available.some(function (p) { return p.key === part; })
            ? part
            : available[0].key;

        if (available.length > 1) {
            const tabs = document.createElement("nav");
            tabs.className = "lesen-tabs lesen-part-tabs";

            available.forEach(function (p) {
                const tab = document.createElement("button");
                tab.type = "button";
                tab.className = "lesen-tab" + (p.key === current ? " active" : "");
                const nr = document.createElement("span");
                nr.textContent = p.label;
                const nm = document.createElement("span");
                nm.className = "sp-tab-name";
                nm.textContent = p.name;
                tab.append(nr, nm);
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
        stack.id = "sprechen-stack";
        detail.appendChild(stack);

        window.scrollTo({ top: 0, behavior: "smooth" });
        paint();

        function paint() {
            stack.textContent = "";

            if (topic.locked && !window.__deutschEinfachIsPremium) {
                if (typeof window.__premiumGate === "function") {
                    window.__premiumGate(stack, { title: topic.title });
                } else {
                    const box = document.createElement("div");
                    box.className = "lesen-empty";
                    box.textContent = "🔒 هاد الموضوع ديال Premium.";
                    stack.appendChild(box);
                }
                return;
            }

            if (typeof window.__sprechenRender === "function") {
                window.__sprechenRender(stack, current, content[current]);
            }
        }
    }

    function close(push) {
        if (push) history.pushState({}, "", pageUrl("", activePart));
        detail.hidden = true;
        detail.textContent = "";
        if (heroEl) heroEl.hidden = false;
        if (tabsNav) tabsNav.hidden = false;
        if (toolbar) toolbar.hidden = false;
        if (countEl) countEl.hidden = false;
        grid.hidden = false;
    }

    /* ================= التبويبات ديال فوق ================= */

    function setPart(part, push) {
        activePart = part || "";
        if (tabsNav) {
            Array.from(tabsNav.querySelectorAll(".lesen-tab")).forEach(function (tab) {
                tab.classList.toggle("active", (tab.dataset.teil || "") === activePart);
            });
        }
        if (push) history.pushState({ teil: activePart }, "", pageUrl("", activePart));
        renderList();
    }

    if (tabsNav) {
        Array.from(tabsNav.querySelectorAll(".lesen-tab")).forEach(function (tab) {
            tab.addEventListener("click", function (event) {
                event.preventDefault();
                setPart(tab.dataset.teil || "", true);
            });
        });
    }

    /* زر الرجوع ديال الـ navigateur */
    window.addEventListener("popstate", function () {
        const params = new URLSearchParams(location.search);
        const thema = params.get("thema");
        if (thema) { open(thema, params.get("teil") || "teil1", false); return; }
        close(false);
        setPart(params.get("teil") || "", false);
    });

    if (search) search.addEventListener("input", renderList);
    if (sortBtn) {
        sortBtn.addEventListener("click", function () {
            sortIndex = (sortIndex + 1) % SORTS.length;
            const label = sortBtn.querySelector(".label");
            if (label) label.textContent = SORTS[sortIndex].label;
            renderList();
        });
    }

    if (totalEl) totalEl.textContent = String(topics.length);

    /* حالة الاشتراك كتوصل من الهيدر من بعد ما يجاوب Firebase. */
    document.addEventListener("de-premium", function () {
        renderList();
        if (detail.hidden) return;
        const params = new URLSearchParams(location.search);
        const thema = params.get("thema");
        if (thema) open(thema, params.get("teil") || "teil1", false);
    });

    /* الرابط جا فيه موضوع؟ نحلوه دغيا. */
    const startParams = new URLSearchParams(location.search);
    const startThema = startParams.get("thema");
    const startTeil = startParams.get("teil") || "";

    if (startThema) {
        setPart(PART_LABEL[startTeil] ? startTeil : "", false);
        open(startThema, startTeil || "teil1", false);
    } else {
        setPart(PART_LABEL[startTeil] ? startTeil : "", false);
    }
})();
