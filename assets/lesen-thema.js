/* ===== صفحة امتحان واحد =====
   كتقرا ?thema= من الرابط، وكتبين الأجزاء ديال داك الموضوع
   (Teil 1/2/3 و Sprachbausteine) ف تبويبات، بلا ما تعاود تحمل
   الصفحة. الجزء المفتوح كيتحط فالرابط باش الرجوع يخدم. */

(function () {
    "use strict";

    const PARTS = [
        { key: "teil1",   label: "Teil 1" },
        { key: "teil2",   label: "Teil 2" },
        { key: "teil3",   label: "Teil 3" },
        { key: "sprach1", label: "Sprach 1" },
        { key: "sprach2", label: "Sprach 2" }
    ];

    const tabsEl = document.getElementById("thema-tabs");
    const stackEl = document.getElementById("lesen-stack");
    const titleEl = document.getElementById("thema-title");
    const leadEl = document.getElementById("thema-lead");

    if (!stackEl) return;

    const params = new URLSearchParams(location.search);
    const themaId = params.get("thema") || "";

    const topics = Array.isArray(window.LESEN_B2_TOPICS) ? window.LESEN_B2_TOPICS : [];
    const topic = topics.find(function (t) { return t.id === themaId; });

    if (!topic) {
        if (titleEl) titleEl.textContent = "الموضوع ماكاينش";
        stackEl.innerHTML =
            '<div class="lesen-empty">ما لقيناش هاد الموضوع.<br>' +
            '<a class="lesen-back" style="margin-top:14px" href="b2-lesen.html">' +
            "← رجع للمواضيع</a></div>";
        return;
    }

    document.title = "Deutsch Einfach – " + topic.title;
    if (titleEl) {
        titleEl.textContent = topic.title;
        if (topic.ar) {
            const ar = document.createElement("span");
            ar.className = "lesen-card-ar";
            ar.style.marginInlineStart = "10px";
            ar.textContent = "(" + topic.ar + ")";
            titleEl.appendChild(ar);
        }
    }

    const content = (window.LESEN_B2_CONTENT || {})[themaId] || {};

    /* غير الأجزاء اللي عندهم محتوى. إلا ماكاين حتى واحد،
       كنبينو گاع الأجزاء باش يبان شنو غادي يجي. */
    const available = PARTS.filter(function (part) { return content[part.key]; });
    const shown = available.length ? available : PARTS;

    let current = params.get("teil");
    if (!shown.some(function (p) { return p.key === current; })) {
        current = shown[0].key;
    }

    if (leadEl) {
        leadEl.textContent = available.length
            ? available.length + " من الأجزاء جاهزين."
            : "ما زال ماكاينش تمارين ف هاد الموضوع.";
    }

    /* ---------- التبويبات ---------- */

    if (tabsEl) {
        shown.forEach(function (part) {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "lesen-tab" + (part.key === current ? " active" : "");
            btn.textContent = part.label;
            btn.dataset.part = part.key;

            if (!content[part.key]) {
                btn.classList.add("is-empty");
                btn.title = "ما زال ماكاينش";
            }

            btn.addEventListener("click", function () {
                current = part.key;
                Array.from(tabsEl.children).forEach(function (other) {
                    other.classList.toggle("active", other.dataset.part === current);
                });
                const next = new URLSearchParams(location.search);
                next.set("teil", current);
                history.replaceState(null, "", location.pathname + "?" + next.toString());
                renderPart();
            });

            tabsEl.appendChild(btn);
        });
    }

    /* ---------- المحتوى ---------- */

    function renderPart() {
        stackEl.textContent = "";

        if (topic.locked && !window.__deutschEinfachIsPremium) {
            stackEl.appendChild(premiumNotice());
            return;
        }

        const task = content[current];

        if (!task) {
            const empty = document.createElement("div");
            empty.className = "lesen-empty";
            empty.textContent = "ما زال ماكاينش تمارين ف هاد الجزء.";
            stackEl.appendChild(empty);
            return;
        }

        /* المحرك كيقرا من window.LESEN_TOPICS وكيبني ف #lesen-stack */
        window.LESEN_TOPICS = [Object.assign({ id: themaId + "-" + current }, task)];
        window.__lesenRender();
    }

    function premiumNotice() {
        const box = document.createElement("div");
        box.className = "lesen-empty";
        box.innerHTML =
            "🔒 هاد الموضوع ديال Premium.<br>" +
            '<a class="lesen-back" style="margin-top:14px" href="b2-lesen.html">' +
            "← رجع للمواضيع</a>";
        return box;
    }

    renderPart();
})();
