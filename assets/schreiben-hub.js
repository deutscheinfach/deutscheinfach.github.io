/* ===== شبكة مواضيع Schreiben B2 =====
   نفس شكل البطائق ديال Lesen. كل بطاقة كتحل الصفحة ديالها. */

(function () {
    "use strict";

    const grid = document.getElementById("lesen-grid");
    const search = document.getElementById("lesen-search-input");
    const sortBtn = document.getElementById("lesen-sort-btn");
    const countEl = document.getElementById("lesen-count");

    /* الملف كيعرّف const، ماشي window.X — إذن ماكيبانش
       ف window. كنقراوه بحال متغير عام عادي. */
    const source = (typeof SCHREIBEN_B2_TOPICS !== "undefined")
        ? SCHREIBEN_B2_TOPICS
        : null;

    if (!grid || !source) return;

    /* ===== نسخة قديمة؟ =====

       ملي كيتبدل القسم بلا تحميل صفحة، هاد الملف كيتعاود
       يتنفذ على DOM جديد. النسخة القديمة كتبقى معلقة ف
       listeners ديال window/document وكتخدم على عناصر تحيدو
       من الصفحة. هاد الفحص كيسكتها: إلا ماكانش الـgrid ديالي
       ما زال فالصفحة، إذن أنا النسخة القديمة. */
    function stale() { return !document.body.contains(grid); }

    const topics = Object.keys(source)
        .sort()
        .map(function (id) {
            return Object.assign({ id: id }, source[id]);
        });

    const SORTS = [
        { key: "default", label: "ترتيب" },
        { key: "alpha", label: "أبجدي" },
        { key: "free", label: "المجاني أولا" }
    ];
    let sortIndex = 0;

    function listed() {
        const term = (search ? search.value : "").trim().toLowerCase();

        let list = topics.filter(function (topic) {
            if (!term) return true;
            return (topic.title || "").toLowerCase().includes(term)
                || (topic.type || "").toLowerCase().includes(term)
                || topic.id.includes(term);
        });

        const mode = SORTS[sortIndex].key;
        if (mode === "alpha") {
            list = list.slice().sort(function (a, b) {
                return (a.title || "").localeCompare(b.title || "", "de");
            });
        } else if (mode === "free") {
            list = list.slice().sort(function (a, b) {
                return (!!a.locked === !!b.locked) ? 0 : (a.locked ? 1 : -1);
            });
        }
        return list;
    }

    function chip(className, text) {
        const node = document.createElement("span");
        node.className = "lesen-chip " + className;
        node.textContent = text;
        return node;
    }

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

    function card(topic) {
        const node = document.createElement("a");
        /* المشترك عندو گاع المواضيع — ماعندوش علاش يشوف القفل */
        const shut = topic.locked && !window.__deutschEinfachIsPremium;
        node.className = "lesen-card" + (shut ? " locked" : "");
        node.href = "b2-schreiben-" + topic.id + ".html";

        const title = document.createElement("div");
        title.className = "lesen-card-title";
        title.textContent = topic.title || topic.id;
        node.appendChild(title);

        if (topic.type) {
            const row = document.createElement("div");
            row.appendChild(chip("lesen-chip-type", topic.type));
            node.appendChild(row);
        }

        const rule = document.createElement("div");
        rule.className = "lesen-card-rule";
        node.appendChild(rule);

        const foot = document.createElement("div");
        foot.className = "lesen-card-foot";
        foot.appendChild(timeChip(topic.time || "30 min"));
        foot.appendChild(chip("lesen-chip-level", topic.level || "B2"));

        const go = document.createElement("span");
        go.className = "lesen-card-go";
        go.textContent = shut ? "🔒" : "›";
        go.setAttribute("aria-hidden", "true");
        foot.appendChild(go);

        node.appendChild(foot);
        return node;
    }

    function render() {
        const list = listed();
        grid.textContent = "";

        if (countEl) countEl.textContent = list.length ? list.length + " موضوع" : "";

        if (!list.length) {
            const empty = document.createElement("div");
            empty.className = "lesen-empty";
            const searching = (search ? search.value : "").trim() !== "";
            empty.textContent = searching
                ? "ماكاين حتى موضوع بهاد الاسم."
                : "ما زال ماكاينش مواضيع. قريبا 🙏";
            grid.appendChild(empty);
            return;
        }

        list.forEach(function (topic) { grid.appendChild(card(topic)); });
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

    /* حالة الاشتراك كتوصل من الهيدر من بعد ما يجاوب Firebase —
       اللائحة خاصها تتعاود باش الأقفال يطيحو. */
    document.addEventListener("de-premium", function () {
        if (stale()) return;
        render();
    });
})();
