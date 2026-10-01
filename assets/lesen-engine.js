/* ===== محرك Lesen B2 =====

   كيبني التمرين من البيانات، إذن زيادة موضوع جديد = زيادة
   كائن فالملف ديال البيانات، بلا ما تكتب HTML.

   تلاتة ديال الأنواع، هوما اللي كيجيو ف telc B2:

   1) "matching"  — نصوص قصار + لائحة ديال الترويسات.
                    كل نص كيختار واحدة من select.
   2) "choice"    — نص طويل + أسئلة a/b/c.
   3) "anzeigen"  — مواقف + إعلانات. كل موقف كيختار إعلان،
                    ولا "x" إلا ماكاين حتى واحد مناسب.

   شكل البيانات:
   {
     id: "01",
     title: "…",
     kind: "matching" | "choice" | "anzeigen",
     intro: "…",                     // اختياري
     texts:   [{ label:"a", title:"…", body:"…" }],
     options: [{ value:"1", text:"…" }],   // للـ matching و anzeigen
     questions: [
       { text:"…", answer:"3" }                       // matching / anzeigen
       { text:"…", options:["…","…","…"], answer:1 }  // choice (فهرس)
     ]
   }
*/

(function () {
    "use strict";

    /* الصفحة كتبدل التمرين ملي تبرك على تبويب، وكتبني
       الحاوية ديالو من جديد — إذن ماقدرناش نمسكو عنصر
       واحد ثابت. كنقبلو الحاوية كوسيطة. */
    function render(into) {
        const root = into
            || document.getElementById("lesen-stack");

        if (!root) return;

        const topics = window.LESEN_TOPICS;

        root.textContent = "";

        if (!Array.isArray(topics) || !topics.length) {
            const empty = document.createElement("div");
            empty.className = "lesen-empty";
            empty.textContent = "ما زال ماكاينش تمارين ف هاد الجزء.";
            root.appendChild(empty);
            return;
        }

        topics.forEach(function (topic, index) {
            root.appendChild(buildTask(topic, index));
        });
    }

    window.__lesenRender = render;
    window.__lesenRenderInto = render;

    /* ---- النقط ديال كل جزء (بحال telc) ----
       Teil 1، 2، 3 = 25 نقطة · Sprachbausteine 1 و 2 = 15 نقطة.
       كنرسمو النتيجة فالـscore، وكنصيفطو حدث "lesen-points"
       باش الـPrüfung الكاملة تجمع المجموع. */
    const MAX_POINTS = { teil1: 25, teil2: 25, teil3: 25, sprach1: 15, sprach2: 15 };

    function fmt(n) {
        return Number.isInteger(n) ? String(n) : n.toFixed(1).replace(".", ",");
    }

    /* ---- مكان الأزرار ديال Teil 2 / Sprach 1 / Sprach 2 ----
       فالـPC: تحت النصوص (بحال Teil 1)، ماشي مدفونين لتحت فاللوحة اللي كتسكرولي.
       فالتيليفون: من بعد الأسئلة، حيت الأسئلة كتجي تحت النصوص. */
    const WIDE = window.matchMedia("(min-width: 1001px)");
    function placeFoot(foot) {
        if (WIDE.matches) foot.__column.appendChild(foot);
        else foot.__side.after(foot);
    }
    window.__lesenFoot = function (column, side, nodes) {
        const foot = document.createElement("div");
        foot.className = "t1-foot";
        nodes.forEach(function (n) { foot.appendChild(n); });
        foot.__column = column;
        foot.__side = side;
        placeFoot(foot);
        return foot;
    };
    WIDE.addEventListener("change", function () {
        document.querySelectorAll(".t1-foot").forEach(function (foot) {
            if (foot.__column) placeFoot(foot);
        });
    });

    /* ---- شريط الأزرار الثابت تحت (بحال التطبيقات) ----
       كل جزء كيبني الأزرار ديالو فبلاصتهم. هنا كنبدلوهم بعلامة خاوية
       وكنديوهم لشريط واحد فالـbody: الـboard فيه transform (الانتقال بين
       النسخ)، وأي position: fixed داخلو كيتبع ليه ماشي للشاشة.
       الشريط كيبين الأزرار ديال الجزء اللي باين دابا، وكيتخبى فاللائحة. */
    const bar = document.createElement("div");
    bar.className = "lesen-bar";
    bar.hidden = true;
    const slot = document.createElement("div");
    slot.className = "lesen-bar-slot";
    const extraBox = document.createElement("div");
    extraBox.className = "lesen-bar-extra";
    bar.append(slot, extraBox);
    let adopted = [];
    let queued = false;
    /* زيادة فالشريط (أزرار الامتحان الكامل). كتبان غير ملي owner باين. */
    /* mode: "live" = غير «تحقق» ديال الجزء · "done" = غير «شوف الحل» */
    let extra = null, extraOwner = null, examMode = "";
    window.__lesenBarExtra = function (node, owner, options) {
        extra = node || null;
        extraOwner = owner || null;
        examMode = (options && options.mode) || "";
        queueBar();
    };

    function syncBar() {
        queued = false;
        document.querySelectorAll(".lesen-actions").forEach(function (actions) {
            if (actions.__anchor || bar.contains(actions)) return;
            const anchor = document.createElement("span");
            anchor.className = "lesen-actions-anchor";
            actions.replaceWith(anchor);
            actions.__anchor = anchor;
            anchor.__actions = actions;
            adopted.push(actions);
        });
        adopted = adopted.filter(function (a) { return a.__anchor.isConnected; });
        let current = null;
        adopted.forEach(function (a) { if (a.__anchor.getClientRects().length) current = a; });

        const showExtra = !!(extra && extraOwner && extraOwner.isConnected
                             && extraOwner.getClientRects().length);
        const shown = !!current || showExtra;

        if (!bar.isConnected) document.body.appendChild(bar);
        if (current && current.parentNode !== slot) slot.replaceChildren(current);
        if (!current && slot.firstChild) slot.replaceChildren();
        if (showExtra && extra.parentNode !== extraBox) extraBox.replaceChildren(extra);
        if (!showExtra && extraBox.firstChild) extraBox.replaceChildren();
        if (bar.classList.contains("has-extra") !== showExtra) bar.classList.toggle("has-extra", showExtra);
        const mode = showExtra ? examMode : "";
        if ((bar.dataset.exam || "") !== mode) {
            if (mode) bar.dataset.exam = mode; else delete bar.dataset.exam;
        }
        if (bar.hidden !== !shown) bar.hidden = !shown;
        if (document.body.classList.contains("has-lesen-bar") !== shown) {
            document.body.classList.toggle("has-lesen-bar", shown);
        }
    }
    function queueBar() {
        if (queued) return;
        queued = true;
        requestAnimationFrame(syncBar);
    }
    new MutationObserver(queueBar).observe(document.body, {
        childList: true, subtree: true,
        attributes: true, attributeFilter: ["hidden", "class", "style"],
    });
    queueBar();

    /* من بعد ما يختار جواب: فالـPC اللوحة كتسكرولي بوحدها للسؤال الجاي
       اللي مازال ماتجاوبش — ماكيحتاجش يقلب عليه. الصفحة ماكتتحركش. */
    window.__lesenNext = function (panel, rows, row) {
        if (!WIDE.matches || panel.scrollHeight <= panel.clientHeight + 4) return;
        const at = rows.indexOf(row);
        const next = rows.slice(at + 1).concat(rows.slice(0, at))
            .find(function (r) { return r.picked === -1; });
        if (!next) return;
        panel.scrollTo({ top: Math.max(0, next.box.offsetTop - 70), behavior: "smooth" });
    };

    window.__lesenScore = function (box, part, right, total, reveal, missing) {
        const max = MAX_POINTS[part] || 25;
        const points = total ? Math.round(right / total * max * 2) / 2 : 0;
        box.hidden = false;
        box.textContent = "";
        box.classList.add("lesen-score-points");
        const pct = max ? points / max : 0;
        box.dataset.tone = pct >= 0.8 ? "good" : pct >= 0.6 ? "mid" : "bad";

        const big = document.createElement("b");
        big.className = "lesen-points";
        big.textContent = fmt(points) + " / " + max;
        const unit = document.createElement("span");
        unit.className = "lesen-points-unit";
        unit.textContent = "Punkte";
        const detail = document.createElement("span");
        detail.className = "lesen-points-detail";
        detail.textContent = reveal
            ? "الحلول كاينة فوق · " + right + " من " + total + " كانو صحاح"
            : right + " / " + total + " صحيحة" + (missing ? " · باقي " + missing + " بلا جواب" : "");
        box.append(big, unit, detail);
        /* الأزرار ولاو تحت فالشريط الثابت: كنوريو النتيجة باش ماتبقاش مخبية */
        box.scrollIntoView({ behavior: "smooth", block: "nearest" });

        try {
            window.dispatchEvent(new CustomEvent("lesen-points",
                { detail: { part: part, points: points, max: max, right: right, total: total } }));
        } catch (e) { /* متصفح قديم */ }
        return points;
    };

    /* ---- زر الترجمة العربية ----
       الترجمة مخبية فالبداية. كل تمرين فيه ترجمة كياخد زر
       فالعنوان ديالو، والضغطة كتزيد "show-ar" للحاوية كاملة
       (كتبقى حتى ملي كيتبدل التبويب ديال النسخة). */
    function hasArabic(task) {
        try { return /"ar":"[^"]/.test(JSON.stringify(task)); }
        catch (e) { return false; }
    }

    window.__lesenArToggle = function (head, wrap, task) {
        if (task && !hasArabic(task)) return null;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "ar-toggle";
        button.setAttribute("aria-pressed", "false");
        const icon = document.createElement("span");
        icon.className = "ar-toggle-icon";
        icon.textContent = "ع";
        icon.setAttribute("aria-hidden", "true");
        const label = document.createElement("span");
        button.append(icon, label);

        function paint(on) {
            wrap.classList.toggle("show-ar", on);
            button.classList.toggle("is-on", on);
            button.setAttribute("aria-pressed", on ? "true" : "false");
            label.textContent = on ? "خبي الترجمة" : "بين الترجمة العربية";
        }
        paint(false);
        button.addEventListener("click", function () {
            paint(!wrap.classList.contains("show-ar"));
        });
        head.appendChild(button);
        return button;
    };

    /* بلوك ديال الترجمة تحت النص (كيبان غير مع show-ar) */
    window.__lesenArBlock = function (text, label) {
        const box = document.createElement("div");
        box.className = "ar-block";
        box.dir = "rtl";
        box.lang = "ar";
        const tag = document.createElement("span");
        tag.className = "ar-block-label";
        tag.textContent = label || "الترجمة العربية";
        const p = document.createElement("p");
        p.textContent = text;
        box.append(tag, p);
        return box;
    };

    /* ===== الكلمات المفتاحية (بحال Zertify) =====
       ملي كيتصحح Teil 1 ولا Teil 3، كنلونو الكلمات اللي مشتركين بين
       النص والترويسة (ولا الوضعية والإعلان) — باش يبان علاش هادا
       هو الجواب. بلا داتا زايدة: كنقارنو الجذور ديال الكلمات
       (Alter ↔ Lebensalter، Sport ↔ Leistungssport). */
    const KW_STOP = new Set(("andere anderen bekannte bekannten bekannter besonders einige einigen einiger interessieren interessiert manche mochte mochten mogen sucht suchen aber alle allem allen aller alles also auch auf aus bei beim bis bitte dabei damit dann darf das dass dem den denn der des dessen die dies diese diesem diesen dieser dieses doch dort durch eine einem einen einer eines etwas euch fur gibt ganz gegen geht hier hinter ihnen ihre ihrem ihren ihrer immer jede jedem jeden jeder jedes jetzt kann kein keine keinen konnen machen macht mehr mein meine muss mussen nach neue neuen nicht noch nur oder ohne schon sehr sein seine seit sich sind soll sollen sowie uber unter unsere viel viele vielen vom von vor wann warum weil wenig wenn werden wieder will wird wollen wurde zum zur zwei zwischen").split(" "));
    function kwFold(w) {
        return w.toLowerCase().replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/ß/g, "ss");
    }
    function kwStem(w) {
        const f = kwFold(w);
        const ends = ["ern", "en", "er", "es", "em", "e", "n", "s"];
        for (let i = 0; i < ends.length; i++) {
            if (f.length - ends[i].length >= 4 && f.endsWith(ends[i])) return f.slice(0, -ends[i].length);
        }
        return f;
    }
    const KW_WORD = /[A-Za-zÄÖÜäöüß]+/g;
    function kwStems(text) {
        const out = new Set();
        (String(text || "").match(KW_WORD) || []).forEach(function (w) {
            if (w.length < 4 || KW_STOP.has(kwFold(w))) return;
            const st = kwStem(w);
            if (st.length >= 4) out.add(st);
        });
        return Array.from(out);
    }
    function kwHit(word, stems) {
        if (word.length < 4 || KW_STOP.has(kwFold(word))) return false;
        const s = kwStem(word);
        return stems.some(function (k) {
            return s === k || (k.length >= 5 && s.indexOf(k) !== -1) || (s.length >= 5 && k.indexOf(s) !== -1);
        });
    }
    function kwPaint(node, stems) {
        if (node.__kwText == null) node.__kwText = node.textContent;
        const text = node.__kwText;
        node.textContent = "";
        let last = 0, hits = 0, m;
        KW_WORD.lastIndex = 0;
        while ((m = KW_WORD.exec(text))) {
            if (!kwHit(m[0], stems)) continue;
            node.appendChild(document.createTextNode(text.slice(last, m.index)));
            const mark = document.createElement("mark");
            mark.className = "kw";
            mark.textContent = m[0];
            node.appendChild(mark);
            last = m.index + m[0].length;
            hits++;
        }
        node.appendChild(document.createTextNode(text.slice(last)));
        return hits;
    }
    window.__lesenKeys = {
        /* a و b: لائحتين ديال العناصر (نص عادي) — كنلونو ف a الكلمات
           اللي كاينين ف b، والعكس. */
        link: function (a, b) {
            const sa = kwStems(a.map(function (n) { return n.__kwText != null ? n.__kwText : n.textContent; }).join(" "));
            const sb = kwStems(b.map(function (n) { return n.__kwText != null ? n.__kwText : n.textContent; }).join(" "));
            let hits = 0;
            a.forEach(function (n) { hits += kwPaint(n, sb); });
            b.forEach(function (n) { hits += kwPaint(n, sa); });
            return hits;
        },
        clear: function (nodes) {
            nodes.forEach(function (n) {
                if (n && n.__kwText != null) { n.textContent = n.__kwText; n.__kwText = null; }
            });
        }
    };

    /* الصفحات العادية كترسم دغيا. الصفحات اللي كتبدل
       التمرين بوحدها كتحط data-manual. */
    const initial = document.getElementById("lesen-stack");
    if (initial && !initial.hasAttribute("data-manual")) {
        render(initial);
    }

    /* ---------- بناء تمرين واحد ---------- */

    function buildTask(topic, index) {
        const card = el("section", "lesen-task");

        const head = el("div", "lesen-task-head");
        head.appendChild(el("span", "lesen-task-num", String(index + 1)));
        const h2 = el("h2", "", topic.title || "Aufgabe " + (index + 1));
        head.appendChild(h2);
        card.appendChild(head);

        const body = el("div", "lesen-task-body");

        if (topic.intro) {
            body.appendChild(el("p", "lead", topic.intro));
        }

        (topic.texts || []).forEach(function (text) {
            const box = el("div", "lesen-text");
            if (text.label) {
                box.appendChild(el("span", "lesen-text-label", text.label));
            }
            if (text.title) {
                box.appendChild(el("h3", "", text.title));
            }
            box.appendChild(document.createTextNode(text.body || ""));
            body.appendChild(box);
        });

        /* لائحة الاختيارات المشتركة (الترويسات ولا الإعلانات) */
        if (topic.kind !== "choice" && Array.isArray(topic.options)) {
            const list = el("div", "lesen-text");
            list.appendChild(el("span", "lesen-text-label",
                topic.kind === "anzeigen" ? "Anzeigen" : "Überschriften"));
            topic.options.forEach(function (option) {
                const row = el("div", "", option.value + " — " + option.text);
                list.appendChild(row);
            });
            body.appendChild(list);
        }

        const inputs = [];

        (topic.questions || []).forEach(function (question, qi) {
            const row = el("div", "lesen-q");

            const label = el("div", "lesen-q-text");
            label.appendChild(el("span", "lesen-q-num", String(qi + 1)));
            label.appendChild(document.createTextNode(question.text || ""));
            row.appendChild(label);

            if (topic.kind === "choice") {
                const group = el("div", "lesen-options");
                const name = "t" + topic.id + "q" + qi;

                (question.options || []).forEach(function (text, oi) {
                    const option = el("label", "lesen-option");
                    const input = document.createElement("input");
                    input.type = "radio";
                    input.name = name;
                    input.value = String(oi);
                    option.appendChild(input);
                    option.appendChild(document.createTextNode(text));
                    group.appendChild(option);
                });

                row.appendChild(group);
                inputs.push({ row: row, group: group, name: name, question: question });
            } else {
                const select = document.createElement("select");
                select.className = "lesen-select";

                select.appendChild(new Option("— auswählen —", ""));
                (topic.options || []).forEach(function (option) {
                    select.appendChild(new Option(
                        option.value + " — " + option.text, option.value));
                });
                if (topic.kind === "anzeigen") {
                    select.appendChild(new Option("x — keine Anzeige passt", "x"));
                }

                row.appendChild(select);
                inputs.push({ row: row, select: select, question: question });
            }

            body.appendChild(row);
        });

        /* ---------- الأزرار ---------- */

        const actions = el("div", "lesen-actions");
        const checkBtn = button("lesen-btn lesen-btn-check", "تحقق من الإجابات");
        const showBtn = button("lesen-btn lesen-btn-show", "شوف الحل");
        const retryBtn = button("lesen-btn lesen-btn-retry", "عاود من جديد");
        actions.append(checkBtn, showBtn, retryBtn);
        body.appendChild(actions);

        const score = el("div", "lesen-score");
        score.hidden = true;
        body.appendChild(score);

        checkBtn.addEventListener("click", function () { grade(false); });
        showBtn.addEventListener("click", function () { grade(true); });
        retryBtn.addEventListener("click", reset);

        card.appendChild(body);
        return card;

        /* ---------- التصحيح ---------- */

        function grade(reveal) {
            let right = 0;
            let answered = 0;

            inputs.forEach(function (item) {
                clearMarks(item);

                const expected = String(item.question.answer);
                let given = "";

                if (item.select) {
                    given = item.select.value;
                } else {
                    const picked = item.group.querySelector("input:checked");
                    given = picked ? picked.value : "";
                }

                if (given !== "") answered++;

                const ok = given !== "" && given === expected;
                if (ok) right++;

                item.row.classList.add(ok ? "correct" : "wrong");

                if (item.group) {
                    Array.from(item.group.children).forEach(function (option, oi) {
                        const input = option.querySelector("input");
                        if (input && input.checked) {
                            option.classList.add(ok ? "picked-correct" : "picked-wrong");
                        }
                        if (reveal && String(oi) === expected) {
                            option.classList.add("is-answer");
                        }
                    });
                }

                if (reveal && item.select) {
                    item.select.value = expected;
                    item.row.classList.remove("wrong");
                    item.row.classList.add("correct");
                }

                const mark = el("div", "lesen-mark " + (ok ? "ok" : "no"),
                    ok ? "✓ Richtig"
                       : (reveal ? "Lösung: " + solutionLabel(item, expected)
                                 : (given === "" ? "Noch nicht beantwortet" : "✗ Falsch")));
                item.row.appendChild(mark);
            });

            const total = inputs.length;
            score.hidden = false;
            score.textContent = reveal
                ? "الحلول كاينة فوق. " + right + " من " + total + " كانو صحاح."
                : right + " / " + total + " صحيحة" +
                  (answered < total ? " · باقي " + (total - answered) + " بلا جواب" : "");
        }

        function solutionLabel(item, expected) {
            if (item.select) return expected;
            const option = (item.question.options || [])[Number(expected)];
            return option || expected;
        }

        function clearMarks(item) {
            item.row.classList.remove("correct", "wrong");
            const mark = item.row.querySelector(".lesen-mark");
            if (mark) mark.remove();
            if (item.group) {
                Array.from(item.group.children).forEach(function (option) {
                    option.classList.remove("picked-correct", "picked-wrong", "is-answer");
                });
            }
        }

        function reset() {
            inputs.forEach(function (item) {
                clearMarks(item);
                if (item.select) item.select.value = "";
                if (item.group) {
                    item.group.querySelectorAll("input").forEach(function (input) {
                        input.checked = false;
                    });
                }
            });
            score.hidden = true;
            card.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    /* ---------- أدوات صغيرة ---------- */

    function el(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    function button(className, text) {
        const node = document.createElement("button");
        node.type = "button";
        node.className = className;
        node.textContent = text;
        return node;
    }
})();
