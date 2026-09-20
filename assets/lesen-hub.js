/* ===== شبكة مواضيع Lesen B2 =====
   بحث + ترتيب. كلشي من window.LESEN_B2_TOPICS. */

(function () {
    "use strict";

    const grid = document.getElementById("lesen-grid");
    const search = document.getElementById("lesen-search-input");
    const sortBtn = document.getElementById("lesen-sort-btn");
    const countEl = document.getElementById("lesen-count");

    if (!grid) return;

    const topics = Array.isArray(window.LESEN_B2_TOPICS)
        ? window.LESEN_B2_TOPICS.slice()
        : [];

    /* الترتيب: كيف ما جاو → أ-ي → المجاني الأول */
    const SORTS = [
        { key: "default", label: "ترتيب" },
        { key: "alpha", label: "أبجدي" },
        { key: "free", label: "المجاني أولا" }
    ];
    let sortIndex = 0;

    function visible() {
        const term = (search ? search.value : "").trim().toLowerCase();

        let list = topics.filter(function (topic) {
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

    function render() {
        const list = visible();
        grid.textContent = "";

        if (countEl) {
            countEl.textContent = list.length
                ? list.length + " موضوع"
                : "";
        }

        if (!list.length) {
            const empty = document.createElement("div");
            empty.className = "lesen-empty";
            empty.textContent = topics.length
                ? "ماكاين حتى موضوع بهاد الاسم."
                : "ما زال ماكاينش مواضيع.";
            grid.appendChild(empty);
            return;
        }

        list.forEach(function (topic) {
            grid.appendChild(card(topic));
        });
    }

    function card(topic) {
        const node = document.createElement("a");
        node.className = "lesen-card" + (topic.locked ? " locked" : "");
        /* البطاقة كتحل الامتحان ديال الموضوع، وفيه الأجزاء
           ديالو. قبل كانت كتوجه لصفحة Teil 1 عامة — علاش كان
           كيبان بحال ما تبدل والو. */
        node.href = "b2-lesen-thema.html?thema=" + encodeURIComponent(topic.id);
        if (grid.dataset.teil) node.href += "&teil=" + grid.dataset.teil;

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

        node.appendChild(rule());

        const foot = document.createElement("div");
        foot.className = "lesen-card-foot";

        foot.appendChild(timeChip((topic.minutes || 90) + " min"));
        foot.appendChild(chip("lesen-chip-level", topic.level || "B2"));

        if (topic.parts && topic.parts > 1) {
            foot.appendChild(chip("lesen-chip-parts", "+" + topic.parts));
        }

        const go = document.createElement("span");
        go.className = "lesen-card-go";
        go.textContent = topic.locked ? "🔒" : "›";
        go.setAttribute("aria-hidden", "true");
        foot.appendChild(go);

        node.appendChild(foot);

        if (topic.locked) {
            node.setAttribute("aria-label", (topic.title || "") + " — Premium");
        }

        return node;
    }

    function rule() {
        const node = document.createElement("div");
        node.className = "lesen-card-rule";
        return node;
    }

    /* ساعة SVG كتاخذ لون النص، عوض إيموجي كيبان بحال نقطة كحلة */
    function timeChip(text) {
        const node = document.createElement("span");
        node.className = "lesen-chip lesen-chip-time";
        node.innerHTML =
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>';
        node.appendChild(document.createTextNode(text));
        return node;
    }

    function chip(className, text) {
        const node = document.createElement("span");
        node.className = "lesen-chip " + className;
        node.textContent = text;
        return node;
    }

    if (search) search.addEventListener("input", render);

    if (sortBtn) {
        sortBtn.addEventListener("click", function () {
            sortIndex = (sortIndex + 1) % SORTS.length;
            sortBtn.querySelector(".label").textContent = SORTS[sortIndex].label;
            render();
        });
    }

    render();
})();
