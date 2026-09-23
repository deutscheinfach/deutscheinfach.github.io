/* ===== Lesen Sprachbausteine — نص بفراغات =====

   شكل الصفحة (بحال Teil 2):
     - تبويبات ديال النسخ (الأساسي / المعدل …) إلا كانو كثر من وحدة
     - على اليسار: الرسالة، وكل فراغ مرقم [21] كيبان فيها
       بحال خانة. فاش كتختار جواب كيتكتب فالخانة.
     - على اليمين: لوحة "AUFGABEN" — Lücke 21–30، كل وحدة فيها
       3 اختيارات، والشرح كيبان من بعد التصحيح.

   شكل البيانات:
   {
     title: "…",
     kind: "gaps",
     variants: [
       {
         label: "الأساسي",
         title: "…",                               // اختياري
         texts: [ { title: "…", body: "… [21] …" } ],  // \n = فقرة جديدة
         questions: [
           { num: 21, options: ["anstatt", "ohne", "um"],
             answer: 2,                            // فهرس: 0 = a
             why: "…" },                           // الشرح بالدارجة
           …
         ]
       }
     ]
   }
*/

(function () {
    "use strict";

    const KEYS = ["a", "b", "c", "d"];
    const GAP = /\[(\d+)\]/g;

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

        const wrap = el("div", "t1 t2 sp");

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
        const titleEl = el("h2", "t1-title");
        head.appendChild(titleEl);
        head.appendChild(el("div", "t1-kicker", task.kicker || "SPRACHBAUSTEINE TEIL 1"));
        if (window.__lesenArToggle) window.__lesenArToggle(head, wrap, task);
        wrap.appendChild(head);

        const board = el("div", "t1-board t1-stagger");
        wrap.appendChild(board);

        into.appendChild(wrap);
        paint();

        /* ================= رسم نسخة وحدة ================= */

        function paint() {
            const variant = variants[index];
            board.textContent = "";
            titleEl.textContent = variant.title || task.title || "Sprachbausteine";

            /* كل فراغ فالنص كيتربط بالسؤال ديالو بالرقم */
            const gaps = {};

            /* ---- النص ---- */
            const column = el("div", "t1-texts");
            if (variant.intro) column.appendChild(el("p", "t1-intro", variant.intro));

            variant.texts.forEach(function (text) {
                const box = el("article", "t1-text sp-text");
                if (text.title) box.appendChild(el("h3", "t2-sub", text.title));

                String(text.body || "").split("\n").forEach(function (line) {
                    const p = el("p", "t1-body sp-line");
                    if (!line.trim()) p.classList.add("sp-blank");
                    let last = 0;
                    line.replace(GAP, function (match, num, at) {
                        if (at > last) p.appendChild(document.createTextNode(line.slice(last, at)));
                        const gap = btn("sp-gap", "");
                        gap.appendChild(el("span", "sp-gap-num", num));
                        const word = el("span", "sp-gap-word", "…");
                        gap.appendChild(word);
                        gap.setAttribute("aria-label", "Lücke " + num);
                        /* نفس الرقم يقدر يتكرر (entweder … oder) */
                        (gaps[num] = gaps[num] || []).push({ node: gap, word: word });
                        p.appendChild(gap);
                        last = at + match.length;
                        return match;
                    });
                    if (last < line.length) p.appendChild(document.createTextNode(line.slice(last)));
                    box.appendChild(p);
                });

                if (text.ar) box.appendChild(window.__lesenArBlock(text.ar));
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

            if (variant.note) panel.appendChild(el("p", "t2-note", variant.note));

            const rows = variant.questions.map(function (question, qi) {
                const num = String(question.num || qi + 1);
                const box = el("div", "t2-q sp-q");

                const top = el("div", "t2-q-top");
                top.appendChild(el("span", "t3-sit-num", num));
                const stem = el("div", "t2-q-stem");
                stem.appendChild(el("p", "t2-q-de", question.text || ("Lücke " + num)));
                top.appendChild(stem);
                if (question.changed) top.appendChild(el("span", "t2-q-changed", "معدل"));
                box.appendChild(top);

                const choices = el("div", "sp-choices");
                box.appendChild(choices);

                const row = { box: box, question: question, picked: -1, buttons: [],
                              gap: gaps[num] || null };
                row.fill = function (text) { fill(row, text); };

                (question.options || []).forEach(function (option, oi) {
                    const label = typeof option === "string" ? option : (option.text || "");
                    const item = btn("t1-option t2-option sp-option", "");
                    item.appendChild(el("span", "t1-option-key", KEYS[oi] || String(oi + 1)));
                    item.appendChild(el("span", "t1-option-de", label));

                    item.addEventListener("click", function () {
                        if (box.classList.contains("is-done")) return;
                        row.picked = oi;
                        row.buttons.forEach(function (other, i) {
                            other.classList.toggle("is-picked", i === oi);
                        });
                        row.fill(label);
                        paintProgress();
                    });

                    row.buttons.push(item);
                    choices.appendChild(item);
                });

                /* الضغط على الفراغ فالنص كيدّيك للسؤال ديالو */
                (row.gap || []).forEach(function (gap) {
                    gap.node.addEventListener("click", function () {
                        box.scrollIntoView({ behavior: "smooth", block: "center" });
                        box.classList.remove("sp-flash");
                        void box.offsetWidth;
                        box.classList.add("sp-flash");
                    });
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

            /* "entweder ... oder" → كل جزء فالفراغ ديالو */
            function fill(row, text) {
                const gapsOf = row.gap || [];
                const parts = gapsOf.length > 1 ? String(text).split(/\s*(?:\.\.\.|…)\s*/) : [text];
                gapsOf.forEach(function (gap, i) {
                    gap.word.textContent = text === null ? "…" : (parts[i] !== undefined ? parts[i] : text);
                    gap.node.classList.toggle("is-filled", text !== null);
                });
            }

            function optionText(row, i) {
                const option = (row.question.options || [])[i];
                return typeof option === "string" ? option : ((option || {}).text || "");
            }

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

                    (row.gap || []).forEach(function (gap) {
                        gap.node.classList.add(ok ? "is-right" : "is-wrong");
                    });
                    if (reveal) row.fill(optionText(row, expected));

                    row.box.appendChild(el("div", "lesen-mark " + (ok ? "ok" : "no"),
                        ok ? "✓ Richtig"
                           : (reveal ? "Lösung: " + optionText(row, expected)
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
                (row.gap || []).forEach(function (gap) {
                    gap.node.classList.remove("is-right", "is-wrong");
                });
                row.fill(row.picked === -1 ? null : optionText(row, row.picked));
            }

            function reset() {
                rows.forEach(function (row) {
                    row.picked = -1;
                    clear(row);
                    row.buttons.forEach(function (item) { item.classList.remove("is-picked"); });
                });
                paintProgress();
                score.hidden = true;
                wrap.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    }

    window.__lesenSprachRender = render;
})();
