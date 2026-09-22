/* ===== Lesen Teil 2 — Multiple Choice =====

   شكل الصفحة (بحال Teil 1 و Teil 3):
     - تبويبات ديال النسخ (الأساسي / المعدل …) إلا كانو كثر من وحدة
     - على اليسار: النص مقسوم فقرات، كل فقرة تحتها
       الترجمة العربية (مطوية)
     - على اليمين: لوحة "AUFGABEN" — الأسئلة 6–10، كل سؤال
       فيه A/B/C بالألماني والعربية، والشرح كيبان من بعد التصحيح.

   شكل البيانات:
   {
     title: "…",
     kind: "mc",
     texts: [ { body: "…", ar: "…" }, … ],       // مشتركين بين النسخ
     variants: [
       {
         label: "الأساسي",
         texts: [ … ],                           // اختياري — كيعوض المشتركين
         questions: [
           { num: 6, text: "…", ar: "…",
             options: [ { text: "…", ar: "…" }, … ],
             answer: 0,                          // فهرس: 0 = A
             why: "…" },                         // الشرح بالدارجة
           …
         ]
       }
     ]
   }
*/

(function () {
    "use strict";

    const KEYS = ["A", "B", "C", "D"];

    function el(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    function btn(className, text) {
        const node = document.createElement("button");
        node.type = "button";
        node.className = className;
        node.textContent = text;
        return node;
    }

    function toVariants(task) {
        const shared = Array.isArray(task.texts) ? task.texts : [];
        const list = (Array.isArray(task.variants) && task.variants.length)
            ? task.variants
            : [{ label: "الأساسي", questions: task.questions || [] }];

        return list.map(function (variant) {
            return Object.assign({}, variant, {
                texts: Array.isArray(variant.texts) ? variant.texts : shared,
                questions: variant.questions || []
            });
        });
    }

    function render(into, task) {
        into.textContent = "";
        if (!task) {
            into.appendChild(el("div", "lesen-empty",
                "ما زال ماكاينش تمرين ف هاد الجزء."));
            return;
        }

        const variants = toVariants(task);
        let index = 0;

        const wrap = el("div", "t1 t2");

        if (variants.length > 1) {
            const bar = el("div", "t1-variants");
            variants.forEach(function (variant, i) {
                const tab = btn("t1-variant" + (i === 0 ? " active" : ""),
                                variant.label || ("نسخة " + (i + 1)));
                tab.addEventListener("click", function () {
                    if (i === index) return;
                    index = i;
                    Array.from(bar.children).forEach(function (other, oi) {
                        other.classList.toggle("active", oi === index);
                    });
                    paint();
                });
                bar.appendChild(tab);
            });
            wrap.appendChild(bar);
        }

        const head = el("div", "t1-head");
        head.appendChild(el("h2", "t1-title", task.title || "Leseverstehen"));
        head.appendChild(el("div", "t1-kicker", "LESEVERSTEHEN TEIL 2"));
        wrap.appendChild(head);

        const board = el("div", "t1-board t1-stagger");
        wrap.appendChild(board);

        into.appendChild(wrap);
        paint();

        /* ================= رسم نسخة وحدة ================= */

        function paint() {
            const variant = variants[index];
            board.textContent = "";

            /* ---- النص ---- */
            const column = el("div", "t1-texts");
            if (variant.intro) column.appendChild(el("p", "t1-intro", variant.intro));

            variant.texts.forEach(function (text) {
                const box = el("article", "t1-text");
                box.appendChild(el("p", "t1-body", text.body || ""));
                if (text.ar) {
                    const tr = document.createElement("details");
                    tr.className = "t1-summary";
                    tr.appendChild(el("summary", "", "الترجمة العربية"));
                    tr.appendChild(el("p", "", text.ar));
                    box.appendChild(tr);
                }
                column.appendChild(box);
            });

            /* ---- لوحة الأسئلة ---- */
            const side = el("aside", "t1-side");
            const panel = el("div", "t1-panel t2-panel");

            const panelHead = el("div", "t1-panel-head");
            panelHead.appendChild(el("span", "t1-panel-title", "AUFGABEN"));
            const progress = el("span", "t1-progress");
            panelHead.appendChild(progress);
            panel.appendChild(panelHead);

            const rows = variant.questions.map(function (question, qi) {
                const box = el("div", "t2-q");

                const top = el("div", "t2-q-top");
                top.appendChild(el("span", "t3-sit-num",
                    String(question.num || qi + 1) + "."));
                const stem = el("div", "t2-q-stem");
                stem.appendChild(el("p", "t2-q-de", question.text || ""));
                if (question.ar) stem.appendChild(el("p", "t2-q-ar", question.ar));
                top.appendChild(stem);
                box.appendChild(top);

                const row = { box: box, question: question, picked: -1, buttons: [] };

                (question.options || []).forEach(function (option, oi) {
                    const item = btn("t1-option t2-option", "");
                    item.appendChild(el("span", "t1-option-key", KEYS[oi] || String(oi + 1)));
                    const textWrap = el("span", "t1-option-text");
                    textWrap.appendChild(el("span", "t1-option-de", option.text || ""));
                    if (option.ar) textWrap.appendChild(el("span", "t1-option-ar", option.ar));
                    item.appendChild(textWrap);

                    item.addEventListener("click", function () {
                        if (box.classList.contains("is-done")) return;
                        row.picked = oi;
                        row.buttons.forEach(function (other, i) {
                            other.classList.toggle("is-picked", i === oi);
                        });
                        paintProgress();
                    });

                    row.buttons.push(item);
                    box.appendChild(item);
                });

                if (question.why) {
                    const why = document.createElement("details");
                    why.className = "t1-summary t2-why";
                    why.hidden = true;
                    why.appendChild(el("summary", "", "الشرح"));
                    why.appendChild(el("p", "", question.why));
                    box.appendChild(why);
                    row.why = why;
                }

                panel.appendChild(box);
                return row;
            });

            /* ---- الأزرار ---- */
            const actions = el("div", "lesen-actions t2-actions");
            const checkBtn = btn("lesen-btn lesen-btn-check", "Antworten prüfen");
            const showBtn = btn("lesen-btn lesen-btn-show", "Lösungen anzeigen");
            const retryBtn = btn("lesen-btn lesen-btn-retry", "Nochmal versuchen");
            actions.append(checkBtn, showBtn, retryBtn);
            panel.appendChild(actions);

            const score = el("div", "lesen-score");
            score.hidden = true;
            panel.appendChild(score);

            checkBtn.addEventListener("click", function () { grade(false); });
            showBtn.addEventListener("click", function () { grade(true); });
            retryBtn.addEventListener("click", reset);

            side.appendChild(panel);
            board.append(column, side);
            paintProgress();

            function paintProgress() {
                const done = rows.filter(function (r) { return r.picked !== -1; }).length;
                progress.textContent = done + "/" + rows.length;
            }

            function grade(reveal) {
                let right = 0;
                let answered = 0;

                rows.forEach(function (row) {
                    clear(row);
                    const expected = Number(row.question.answer);
                    if (row.picked !== -1) answered++;
                    const ok = row.picked === expected;
                    if (ok) right++;

                    row.box.classList.add("is-done", ok ? "correct" : "wrong");
                    row.buttons.forEach(function (item, i) {
                        item.classList.remove("is-picked");
                        if (i === row.picked) item.classList.add(ok ? "is-right" : "is-wrong");
                        if (i === expected && (ok || reveal)) item.classList.add("is-right");
                    });

                    row.box.appendChild(el("div", "lesen-mark " + (ok ? "ok" : "no"),
                        ok ? "✓ Richtig"
                           : (reveal ? "Lösung: " + (KEYS[expected] || expected)
                                     : (row.picked === -1 ? "Noch nicht beantwortet" : "✗ Falsch"))));

                    if (row.why && (ok || reveal)) row.why.hidden = false;
                });

                score.hidden = false;
                score.textContent = reveal
                    ? "الحلول كاينة فوق. " + right + " من " + rows.length + " كانو صحاح."
                    : right + " / " + rows.length + " صحيحة" +
                      (answered < rows.length
                          ? " · باقي " + (rows.length - answered) + " بلا جواب" : "");
            }

            function clear(row) {
                row.box.classList.remove("is-done", "correct", "wrong");
                row.buttons.forEach(function (item) {
                    item.classList.remove("is-right", "is-wrong");
                });
                const mark = row.box.querySelector(".lesen-mark");
                if (mark) mark.remove();
                if (row.why) { row.why.hidden = true; row.why.open = false; }
            }

            function reset() {
                rows.forEach(function (row) {
                    clear(row);
                    row.picked = -1;
                    row.buttons.forEach(function (item) { item.classList.remove("is-picked"); });
                });
                paintProgress();
                score.hidden = true;
                wrap.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    }

    window.__lesenTeil2Render = render;
})();
