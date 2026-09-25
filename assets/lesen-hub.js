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

    /* ===== نسخة قديمة؟ =====

       ملي كيتبدل القسم بلا تحميل صفحة، هاد الملف كيتعاود
       يتنفذ على DOM جديد. النسخة القديمة كتبقى معلقة ف
       listeners ديال window/document وكتخدم على عناصر تحيدو
       من الصفحة. هاد الفحص كيسكتها: إلا ماكانش الـgrid ديالي
       ما زال فالصفحة، إذن أنا النسخة القديمة. */
    function stale() { return !document.body.contains(grid); }

    /* ===== التنقل بين Teil 1/2/3 بلا تحميل صفحة جديدة =====

       ست الصفحات (b2-lesen، teil1…sprach2) كيحمّلو نفس الملفات
       ونفس الداتا — الفرق الوحيد بيناتهم هو data-teil. إذن ماكاين
       حتى سبب باش نعاودو نحمّلو كلشي من الصفر: كنبدلو غير الفلتر
       والرابط، والبار ديال فوق ما كتهزّ حتى.

       الصفحات بوحدهم كيبقاو خدامين ديريكت (رابط محفوظ، بحث Google…)
       — غير البركة من داخل الموقع هي اللي ولات فورية. */

    const SHELL = document.querySelector(".lesen-shell");

    /* المستوى ديال الصفحة: <main class="lesen-shell" data-level="b1">.
       نفس الكود كيخدم B1 و B2 — غير الداتا والأسماء كيتبدلو. */
    const LEVEL = (SHELL && SHELL.dataset.level) || "b2";
    const LV = LEVEL.toUpperCase();

    /* الرأس ديال كل جزء: العنوان والسطر الصغير تحتيه. */
    const HEADS = {
        "":        { h1: "Leseverstehen",     lead: "امتحانات كاملة — كل امتحان فيه الأجزاء الخمسة ديال Lesen.",
                     title: "Deutsch Einfach – B2 Lesen Leseverstehen" },
        "teil1":   { h1: "Teil 1",            lead: "Überschriften zuordnen",
                     title: "Deutsch Einfach – B2 Lesen Teil 1" },
        "teil2":   { h1: "Teil 2",            lead: "Multiple Choice",
                     title: "Deutsch Einfach – B2 Lesen Teil 2" },
        "teil3":   { h1: "Teil 3",            lead: "Anzeigen zuordnen",
                     title: "Deutsch Einfach – B2 Lesen Teil 3" },
        "sprach1": { h1: "Sprachbausteine 1", lead: "Grammatik im Text",
                     title: "Deutsch Einfach – B2 Lesen Sprachbausteine 1" },
        "sprach2": { h1: "Sprachbausteine 2", lead: "Wortschatz im Text",
                     title: "Deutsch Einfach – B2 Lesen Sprachbausteine 2" }
    };

    /* b2-lesen-teil2.html → "teil2" · b2-lesen.html → "" */
    function partOfFile(name) {
        const match = new RegExp(LEVEL + "-lesen-(teil[123]|sprach[12])\\.html$").exec(name || "");
        if (match) return match[1];
        return new RegExp(LEVEL + "-lesen\\.html$").test(name || "") ? "" : null;
    }

    function paintHead(part) {
        const head = HEADS[part];
        if (!head) return;
        head.title = head.title.replace("B2", LV);
        const h1 = SHELL && SHELL.querySelector(".lesen-hero h1");
        const lead = SHELL && SHELL.querySelector(".lesen-hero .lead");
        if (h1) h1.textContent = head.h1;
        if (lead) lead.textContent = head.lead;
        document.title = head.title;
    }

    /* كنبدلو الجزء فنفس الصفحة: الفلتر، الرابط، الرأس، واللائحة. */
    function switchPart(part, href, push) {
        pagePart = part;
        grid.dataset.teil = part;

        if (tabsNav) {
            Array.prototype.forEach.call(tabsNav.querySelectorAll("a.lesen-tab"), function (tab) {
                const mine = partOfFile(tab.getAttribute("href")) === part;
                tab.classList.toggle("active", mine);
                if (mine) tab.setAttribute("aria-current", "page");
                else tab.removeAttribute("aria-current");
            });
        }

        if (push) history.pushState({ teil: part }, "", href);
        paintHead(part);
        renderList(true);
    }

    if (SHELL && tabsNav) {
        tabsNav.addEventListener("click", function (event) {
            const tab = event.target.closest("a.lesen-tab");
            if (!tab || tab.classList.contains("active")) return;
            if (event.defaultPrevented || event.button
                || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

            const part = partOfFile(tab.getAttribute("href"));
            /* تبويب ماشي ديال Lesen؟ نخليوه يمشي عادي. */
            if (part === null) return;

            event.preventDefault();

            const still = window.matchMedia
                && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

            if (still) {
                switchPart(part, tab.href, true);
                return;
            }

            /* المحتوى كيطفا، كيتبدل، وكيرجع. التبويبات والبار
               ما كيتحركوش — هوما ديما مرسومين. */
            SHELL.classList.add("lt-leaving");
            let done = false;
            const swap = function () {
                if (done) return;
                done = true;
                switchPart(part, tab.href, true);
                SHELL.classList.remove("lt-leaving");
                /* اللائحة الجديدة كتبدا من فوق */
                const tabsTop = tabsNav.getBoundingClientRect().top + window.scrollY;
                const barH = parseInt(
                    getComputedStyle(document.documentElement)
                        .getPropertyValue("--site-header-h"), 10) || 72;
                if (window.scrollY > tabsTop - barH) {
                    window.scrollTo({ top: Math.max(0, tabsTop - barH) });
                }
            };
            const guard = setTimeout(swap, 200);
            SHELL.addEventListener("transitionend", function once(e) {
                if (e.target !== grid) return;
                clearTimeout(guard);
                SHELL.removeEventListener("transitionend", once);
                swap();
            });
        });
    }



    const PARTS = [
        { key: "teil1",   label: "Teil 1" },
        { key: "teil2",   label: "Teil 2" },
        { key: "teil3",   label: "Teil 3" },
        { key: "sprach1", label: "Sprach 1" },
        { key: "sprach2", label: "Sprach 2" }
    ];
    const PART_LABEL = {};
    PARTS.forEach(function (p) { PART_LABEL[p.key] = p.label; });

    /* الجزء ديال هاد الصفحة: teil1 مثلا. فارغ = صفحة Prüfungen.
       كيتبدل ملي تبرك على تبويب آخر — بلا ما تتحمل صفحة جديدة. */
    let pagePart = grid.dataset.teil || "";

    const topics = Array.isArray(window["LESEN_" + LV + "_TOPICS"])
        ? window["LESEN_" + LV + "_TOPICS"].slice()
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
        /* صفحة Prüfungen: امتحانات كاملة، ماشي مواضيع */
        if (!pagePart) { renderExams(animate); return; }
        const list = listed();
        grid.textContent = "";

        if (countEl) countEl.textContent = list.length ? list.length + " موضوع" : "";
        /* الرقم ديال فوق كيتبع التبويب الحالي، ماشي رقم ثابت. */
        if (statEl) statEl.textContent = String(list.length);

        if (!list.length) {
            const empty = document.createElement("div");
            empty.className = "lesen-empty";
            /* فرق مهم: "ماكاين حتى موضوع بهاد الاسم" كتقال غير ملي
               كاين بحث. إلا كان الجزء خاوي أصلا (Teil 2، Sprach 1/2
               ما زال ماكاينش فيهم نماذج)، الطالب خاصو يفهم بلي هاد
               القسم كنوجدوه، ماشي بلي البحث ديالو خايب. */
            const searching = (search ? search.value : "").trim() !== "";
            empty.textContent = searching
                ? "ماكاين حتى موضوع بهاد الاسم."
                : "ما زال ماكاينش نماذج ف هاد الجزء. قريبا 🙏";
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
        foot.appendChild(chip("lesen-chip-level", topic.level || LV));

        const parts = topic.parts || [];
        const shownPart = pagePart || parts[0];
        if (shownPart) {
            foot.appendChild(chip("lesen-chip-parts", "Lesen " + (PART_LABEL[shownPart] || shownPart)));
        }
        if (!pagePart && parts.length > 1) {
            foot.appendChild(chip("lesen-chip-parts", "+" + parts.length));
        }

        /* عدد النسخ (الأساسي + المعدل…) */
        if (topic.variants > 1) foot.appendChild(chip("lesen-chip-parts", topic.variants + " تعديلات"));

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

    /* ================= رسم جزء واحد ديال موضوع =================
       كيتستعمل فالتمرين العادي وفالـPrüfung الكاملة.
       stillWanted(): واش المستخدم باقي فنفس الجزء (المحتوى المدفوع
       كيوصل من بعد، وممكن يكون بدّل الجزء فهاد الوقت). */
    function renderPart(stack, topic, part, stillWanted) {
        stack.textContent = "";
        const themaId = topic.id;
        const content = (window["LESEN_" + LV + "_CONTENT"] || {})[themaId] || {};

        /* المواضيع المدفوعة ماكايناش نصوصهم فهاد الملف. كيتجابو من
           الـ Worker، اللي كيتحقق من الـ ID token ومن الاشتراك قبل
           ما يعطي حتى كلمة. */
        if (topic.locked) {
            if (!window.__deutschEinfachIsPremium) { gate(); return; }

            const loading = document.createElement("div");
            loading.className = "lesen-empty";
            loading.textContent = "كنجيبو التمرين…";
            stack.appendChild(loading);

            Promise.resolve(
                typeof window.__lesenPremiumFetch === "function"
                    ? window.__lesenPremiumFetch(themaId)
                    : null
            ).then(function (result) {
                /* بدّل الجزء ولا خرج من التمرين وهو كيجيب؟ نحبسو. */
                if (!stillWanted()) return;
                stack.textContent = "";

                const remote = result && result.ok
                    ? (result.data || {})[part]
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

        const task = content[part];

        if (!task) {
            const box = document.createElement("div");
            box.className = "lesen-empty";
            box.textContent = "ما زال ماكاينش تمارين ف هاد الجزء.";
            stack.appendChild(box);
            return;
        }

        draw(task);

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
            const RENDER = {
                matching: window.__lesenTeil1Render,   /* Teil 1: ترويسات */
                mc:       window.__lesenTeil2Render,   /* Teil 2: A/B/C */
                bank:     window.__lesenSprach2Render, /* Sprach 2: 15 كلمة */
                gaps:     window.__lesenSprachRender,  /* Sprach 1: فراغات */
                ads:      window.__lesenTeil3Render    /* Teil 3: إعلانات */
            };
            const fn = RENDER[task.kind];
            if (typeof fn === "function") { fn(stack, task); return; }

            window.LESEN_TOPICS = [Object.assign({ id: themaId + "-" + part }, task)];
            if (typeof window.__lesenRenderInto === "function") {
                window.__lesenRenderInto(stack);
            }
        }
    }

    /* ================= Prüfungen: امتحان كامل =================
       Prüfung n = الموضوع رقم n من كل جزء (Teil 1، 2، 3، Sprach 1، 2).
       عدد الامتحانات = عدد المواضيع ديال الجزء اللي فيه أقل. */
    function examList() {
        const lists = PARTS.map(function (p) {
            return topics.filter(function (t) { return (t.parts || []).indexOf(p.key) !== -1; });
        });
        const count = Math.min.apply(null, lists.map(function (l) { return l.length; }));
        const out = [];
        for (let i = 0; i < count; i++) {
            const parts = {};
            PARTS.forEach(function (p, j) { parts[p.key] = lists[j][i]; });
            out.push({
                n: i + 1,
                parts: parts,
                locked: PARTS.some(function (p) { return parts[p.key].locked; })
            });
        }
        return out;
    }

    function renderExams(animate) {
        const term = (search ? search.value : "").trim().toLowerCase();
        let list = examList().filter(function (exam) {
            if (!term) return true;
            if (("prüfung " + exam.n).indexOf(term) !== -1 || String(exam.n) === term) return true;
            return PARTS.some(function (p) {
                const t = exam.parts[p.key];
                return (t.title || "").toLowerCase().includes(term) || (t.ar || "").includes(term);
            });
        });
        if (SORTS[sortIndex].key === "free") {
            list = list.slice().sort(function (a, b) { return (a.locked === b.locked) ? 0 : (a.locked ? 1 : -1); });
        }

        grid.textContent = "";
        if (countEl) countEl.textContent = list.length ? list.length + " Prüfungen" : "";
        if (statEl) statEl.textContent = String(list.length);

        if (!list.length) {
            const empty = document.createElement("div");
            empty.className = "lesen-empty";
            empty.textContent = examList().length
                ? "ماكاين حتى امتحان بهاد الاسم."
                : "الامتحانات الكاملة غادي يتزادو ملي يكونو Teil 1، 2، 3 و Sprach 1، 2 واجدين. دابا تقدر تتمرن جزء بجزء 🙏";
            grid.appendChild(empty);
            return;
        }

        grid.classList.remove("lt-enter");
        if (animate) void grid.offsetWidth;
        list.forEach(function (exam, i) {
            const node = examCard(exam);
            node.style.setProperty("--lt-i", Math.min(i, 14));
            grid.appendChild(node);
        });
        if (animate) grid.classList.add("lt-enter");
    }

    function examCard(exam) {
        const shut = exam.locked && !window.__deutschEinfachIsPremium;
        const node = document.createElement("a");
        node.className = "lesen-card exam-card" + (shut ? " locked" : "");
        node.href = examUrl(exam.n, "teil1");

        const title = document.createElement("div");
        title.className = "lesen-card-title";
        title.appendChild(document.createTextNode("Prüfung " + exam.n));
        const sub = document.createElement("span");
        sub.className = "lesen-card-ar";
        sub.textContent = "(امتحان كامل)";
        title.appendChild(sub);
        node.appendChild(title);

        const ul = document.createElement("ul");
        ul.className = "exam-card-parts";
        PARTS.forEach(function (p) {
            const li = document.createElement("li");
            const b = document.createElement("b");
            b.textContent = p.label;
            li.appendChild(b);
            li.appendChild(document.createTextNode(exam.parts[p.key].title || ""));
            ul.appendChild(li);
        });
        node.appendChild(ul);

        const foot = document.createElement("div");
        foot.className = "lesen-card-foot";
        foot.appendChild(chip("lesen-chip-level", LV));
        foot.appendChild(chip("lesen-chip-parts", PARTS.length + " Teile"));
        if (!exam.locked) foot.appendChild(chip("lesen-chip-free", "مجاني"));
        const go = document.createElement("span");
        go.className = "lesen-card-go";
        go.textContent = shut ? "🔒" : "›";
        go.setAttribute("aria-hidden", "true");
        foot.appendChild(go);
        node.appendChild(foot);

        node.addEventListener("click", function (event) {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
            event.preventDefault();
            openExam(exam.n, "teil1", true);
        });
        return node;
    }

    function examUrl(n, part) {
        const params = new URLSearchParams();
        params.set("pruefung", String(n));
        if (part) params.set("teil", part);
        return location.pathname + "?" + params.toString();
    }

    /* النقط ديال الامتحان المحلول دابا (كيتجمعو من الحدث lesen-points) */
    let examListener = null;
    const EXAM_MAX = { teil1: 25, teil2: 25, teil3: 25, sprach1: 15, sprach2: 15 };

    function fmtPts(n) {
        return Number.isInteger(n) ? String(n) : n.toFixed(1).replace(".", ",");
    }

    function openExam(n, part, push) {
        const exam = examList()[n - 1];
        if (!exam) { close(push); return; }
        const scores = {};
        let current = PART_LABEL[part] ? part : "teil1";

        if (push) history.pushState({ pruefung: n, teil: current }, "", examUrl(n, current));

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
        h1.appendChild(document.createTextNode("Prüfung " + n));
        const ar = document.createElement("span");
        ar.className = "lesen-card-ar";
        ar.textContent = "(Lesen " + LV + " · امتحان كامل)";
        h1.appendChild(ar);
        head.appendChild(h1);
        detail.appendChild(head);

        const tabs = document.createElement("nav");
        tabs.className = "lesen-tabs lesen-part-tabs exam-tabs";
        PARTS.forEach(function (p) {
            const tab = document.createElement("button");
            tab.type = "button";
            tab.className = "lesen-tab exam-tab" + (p.key === current ? " active" : "");
            const nr = document.createElement("span");
            nr.className = "exam-tab-nr";
            nr.textContent = p.label;
            const nm = document.createElement("span");
            nm.className = "exam-tab-topic";
            nm.textContent = exam.parts[p.key].title || "";
            tab.append(nr, nm);
            if (exam.parts[p.key].locked && !window.__deutschEinfachIsPremium) tab.classList.add("is-locked");
            const pts = document.createElement("span");
            pts.className = "exam-tab-pts";
            pts.hidden = true;
            tab.appendChild(pts);
            tab.addEventListener("click", function () { go(p.key); });
            tabs.appendChild(tab);
        });
        detail.appendChild(tabs);

        if (examListener) window.removeEventListener("lesen-points", examListener);
        examListener = function (event) {
            if (detail.hidden || !document.body.contains(tabs)) {
                window.removeEventListener("lesen-points", examListener);
                examListener = null;
                return;
            }
            const d = event.detail || {};
            if (d.part !== current) return;
            scores[current] = d.points;
            paintScores();
        };
        window.addEventListener("lesen-points", examListener);

        const stack = document.createElement("div");
        stack.id = "lesen-stack";
        stack.setAttribute("data-manual", "");
        detail.appendChild(stack);

        const next = document.createElement("div");
        next.className = "exam-next";
        detail.appendChild(next);

        const summary = document.createElement("div");
        summary.className = "exam-summary";
        summary.hidden = true;
        detail.appendChild(summary);

        window.scrollTo({ top: 0, behavior: "smooth" });
        paint();

        /* النقط فالتبويبات + بطاقة المجموع */
        function paintScores() {
            Array.from(tabs.children).forEach(function (tab, i) {
                const key = PARTS[i].key;
                const badge = tab.querySelector(".exam-tab-pts");
                if (scores[key] === undefined) { badge.hidden = true; return; }
                badge.hidden = false;
                badge.textContent = fmtPts(scores[key]) + "/" + EXAM_MAX[key];
            });

            const done = PARTS.filter(function (p) { return scores[p.key] !== undefined; });
            summary.hidden = !done.length;
            if (!done.length) return;
            const total = done.reduce(function (a, p) { return a + scores[p.key]; }, 0);
            const max = PARTS.reduce(function (a, p) { return a + EXAM_MAX[p.key]; }, 0);
            const need = Math.ceil(max * 0.6);
            summary.textContent = "";
            summary.dataset.tone = done.length < PARTS.length ? "" : (total >= need ? "good" : "bad");

            const head = document.createElement("div");
            head.className = "exam-summary-head";
            const t = document.createElement("span");
            t.textContent = "Ergebnis · النتيجة";
            const big = document.createElement("b");
            big.textContent = fmtPts(total) + " / " + max;
            head.append(t, big);
            summary.appendChild(head);

            const rows = document.createElement("div");
            rows.className = "exam-summary-rows";
            PARTS.forEach(function (p) {
                const r = document.createElement("div");
                r.className = "exam-summary-row" + (scores[p.key] === undefined ? " is-open" : "");
                const a = document.createElement("span");
                a.textContent = p.label;
                const track = document.createElement("span");
                track.className = "exam-summary-track";
                const fill = document.createElement("span");
                fill.style.width = scores[p.key] === undefined ? "0" : (scores[p.key] / EXAM_MAX[p.key] * 100) + "%";
                track.appendChild(fill);
                const v = document.createElement("b");
                v.textContent = (scores[p.key] === undefined ? "—" : fmtPts(scores[p.key])) + " / " + EXAM_MAX[p.key];
                r.append(a, track, v);
                rows.appendChild(r);
            });
            summary.appendChild(rows);

            const note = document.createElement("p");
            note.className = "exam-summary-note";
            note.textContent = done.length < PARTS.length
                ? "باقي " + (PARTS.length - done.length) + " ديال الأجزاء. صحح كل جزء بـ «Antworten prüfen» باش تبان النتيجة الكاملة."
                : (total >= need
                    ? "🎉 ناجح! جبتي " + Math.round(total / max * 100) + "٪ — خاصك على الأقل 60٪ (" + need + " نقطة)."
                    : "باقي شوية: جبتي " + Math.round(total / max * 100) + "٪ — خاصك على الأقل 60٪ (" + need + " نقطة). عاود الأجزاء الضعاف.");
            summary.appendChild(note);
        }

        function go(key) {
            current = key;
            Array.from(tabs.children).forEach(function (tab, i) {
                tab.classList.toggle("active", PARTS[i].key === current);
            });
            history.replaceState({ pruefung: n, teil: current }, "", examUrl(n, current));
            paint();
            tabs.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        function paint() {
            const wanted = current;
            renderPart(stack, exam.parts[current], current, function () {
                return current === wanted && !detail.hidden;
            });

            /* زر للجزء اللي من بعد */
            next.textContent = "";
            const at = PARTS.findIndex(function (p) { return p.key === current; });
            const after = PARTS[at + 1];
            const b = document.createElement("button");
            b.type = "button";
            b.className = "exam-next-btn";
            if (after) {
                b.textContent = "الجزء اللي من بعد: " + after.label + " ←";
                b.addEventListener("click", function () { go(after.key); });
            } else {
                b.textContent = "✓ ساليتي الامتحان — رجع للائحة";
                b.addEventListener("click", function () { close(true); });
            }
            next.appendChild(b);
        }
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

        const content = (window["LESEN_" + LV + "_CONTENT"] || {})[themaId] || {};
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
            const wanted = current;
            renderPart(stack, topic, current, function () {
                return current === wanted && !detail.hidden;
            });
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

    /* زر الرجوع ديال الـ navigateur.

       دابا الرابط كيقدر يتبدل فجوج حالات: موضوع محلول (?thema=)
       ولا جزء آخر (المسار نفسو). خاصنا نتبعو بجوج. */
    window.addEventListener("popstate", function () {
        if (stale()) return;
        const wanted = partOfFile(location.pathname.split("/").pop());
        if (wanted !== null && wanted !== pagePart) switchPart(wanted, null, false);

        const params = new URLSearchParams(location.search);
        const thema = params.get("thema");
        const exam = parseInt(params.get("pruefung"), 10);
        if (exam) openExam(exam, params.get("teil") || "teil1", false);
        else if (thema) open(thema, params.get("teil") || pagePart || "teil1", false);
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
        if (stale()) return;
        /* اللائحة خاصها تتعاود: الأقفال كيطيحو ملي يبان الاشتراك */
        renderList();

        if (detail.hidden) return;
        const params = new URLSearchParams(location.search);
        const thema = params.get("thema");
        const exam = parseInt(params.get("pruefung"), 10);
        if (exam) openExam(exam, params.get("teil") || "teil1", false);
        else if (thema) open(thema, params.get("teil") || pagePart || "teil1", false);
    });

    /* الرابط جا فيه موضوع؟ نحلوه دغيا. */
    const startParams = new URLSearchParams(location.search);
    if (parseInt(startParams.get("pruefung"), 10)) {
        openExam(parseInt(startParams.get("pruefung"), 10), startParams.get("teil") || "teil1", false);
    } else if (startParams.get("thema")) {
        open(startParams.get("thema"),
             startParams.get("teil") || pagePart || "teil1", false);
    }
})();
