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
        const checkBtn = button("lesen-btn lesen-btn-check", "Antworten prüfen");
        const showBtn = button("lesen-btn lesen-btn-show", "Lösungen anzeigen");
        const retryBtn = button("lesen-btn lesen-btn-retry", "Nochmal versuchen");
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
