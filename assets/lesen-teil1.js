/* ===== Lesen Teil 1 — Überschriften zuordnen =====

   شكل الصفحة:
     - تبويبات ديال النسخ (الأساسي / المعدل 1 / المعدل 2)
     - على اليسار: النصوص، كل نص فوقيه خانة الترويسة ديالو
       وتحتيه ملخص بالدارجة (مطوي)
     - على اليمين: لائحة الترويسات A–J بالألماني والعربية.
       تبرك على وحدة كتمشي للنص المفتوح.

   شكل البيانات:
   {
     title: "Sport ist gesund",
     kind: "matching",
     variants: [
       {
         label: "الأساسي",
         intro: "…",                                  // اختياري
         options: [ { value: "A", text: "…", ar: "…" }, … ],
         texts:   [ { body: "…", ar: "…", answer: "H" }, … ]
       }, …
     ]
   }

   النسخة القديمة (texts + options + questions) ما زال خدامة —
   كتتحول لنسخة وحدة بوحدها.
*/

(function () {
    "use strict";

    function el(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    /* الشكل القديم → نفس الشكل الجديد */
    function toVariants(task) {
        if (Array.isArray(task.variants) && task.variants.length) {
            /* النسخ ديال موضوع واحد عندهم نفس النصوص. إذن النصوص
               كيتكتبو مرة وحدة فوق (task.texts) وكل نسخة كتعطي غير
               الحلول ديالها (answers) — هاكا الترويسات يقدرو يتبدل
               الترتيب ديالهم بلا ما نعاودو نكتبو النصوص.

               ونسخة اللي عندها texts ديالها كتبقى خدامة كيف ما كانت. */
            return task.variants.map(function (variant) {
                if (Array.isArray(variant.texts)) return variant;

                const shared = Array.isArray(task.texts) ? task.texts : [];
                const keys = variant.answers || [];

                return Object.assign({}, variant, {
                    texts: shared.map(function (text, i) {
                        return Object.assign({}, text, { answer: keys[i] });
                    })
                });
            });
        }

        const questions = task.questions || [];
        return [{
            label: "",
            intro: task.intro,
            options: task.options || [],
            texts: (task.texts || []).map(function (text, i) {
                return {
                    body: text.body,
                    ar: text.ar,
                    answer: questions[i] ? questions[i].answer : ""
                };
            })
        }];
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

        const wrap = el("div", "t1");

        /* ---- تبويبات النسخ ---- */
        if (variants.length > 1) {
            const bar = el("div", "t1-variants");
            variants.forEach(function (variant, i) {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "t1-variant" + (i === 0 ? " active" : "");
                btn.textContent = variant.label || ("نسخة " + (i + 1));
                btn.addEventListener("click", function () {
                    if (i === index) return;
                    /* من فين لفين — باش الانتقال يمشي فالجهة الصحيحة */
                    const forward = i > index;
                    index = i;
                    Array.from(bar.children).forEach(function (other, oi) {
                        other.classList.toggle("active", oi === index);
                    });
                    swap(forward);
                });
                bar.appendChild(btn);
            });
            wrap.appendChild(bar);
        }

        const head = el("div", "t1-head");
        head.appendChild(el("h2", "t1-title", task.title || "Leseverstehen"));
        head.appendChild(el("div", "t1-kicker", "LESEVERSTEHEN TEIL 1"));
        wrap.appendChild(head);

        const board = el("div", "t1-board");
        wrap.appendChild(board);

        into.appendChild(wrap);
        paint();

        /* تبديل النسخة بانتقال.

           فخ: transitionend كيطلع من الوليدات. البطائق والترويسات
           عندهم transition ديالهم على الـ hover، إذن إلا كان الماوس
           فوق وحدة وبركتي على التبويب، داك الحدث ديالها كيوصل هنا
           وكيقتل الانتقال قبل ما يبان. حيت هاكا كنقبلو غير الحدث
           اللي جا من board نفسو. */
        function swap(forward) {
            const still = window.matchMedia
                && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

            if (still) { paint(); return; }
            if (board.dataset.busy === "1") return;
            board.dataset.busy = "1";

            board.classList.remove("t1-in-right", "t1-in-left", "t1-stagger");
            board.classList.add(forward ? "t1-out-left" : "t1-out-right");

            let finished = false;

            const done = function (event) {
                if (event && event.target !== board) return;   /* وليد، ماشي هو */
                if (finished) return;
                finished = true;

                board.removeEventListener("transitionend", done);
                clearTimeout(guard);

                board.classList.remove("t1-out-left", "t1-out-right");
                board.classList.add(forward ? "t1-in-right" : "t1-in-left");
                paint();

                /* نخليه يترسم مرة قبل ما نرجعوه لبلاصتو */
                requestAnimationFrame(function () {
                    requestAnimationFrame(function () {
                        board.classList.remove("t1-in-right", "t1-in-left");
                        board.classList.add("t1-stagger");
                        board.dataset.busy = "";
                    });
                });
            };

            /* إلا ما وصلش transitionend (تبويب مخبي مثلا) ما نبقاوش واقفين */
            const guard = setTimeout(done, 420);
            board.addEventListener("transitionend", done);
        }

        /* ================= رسم نسخة وحدة ================= */

        function paint() {
            const variant = variants[index];
            const options = variant.options || [];
            const texts = variant.texts || [];
            board.textContent = "";

            const rows = [];        /* { select, box, text }  */
            let activeRow = null;

            /* ---- العمود ديال النصوص ---- */
            const column = el("div", "t1-texts");

            if (variant.intro) column.appendChild(el("p", "t1-intro", variant.intro));

            texts.forEach(function (text, i) {
                const box = el("article", "t1-text");

                const top = el("div", "t1-text-top");
                top.appendChild(el("span", "t1-text-num", String(i + 1)));

                const select = document.createElement("select");
                select.className = "t1-select";
                select.setAttribute("aria-label", "Überschrift für Text " + (i + 1));
                select.appendChild(new Option("— Überschrift wählen —", ""));
                options.forEach(function (option) {
                    select.appendChild(new Option(
                        option.value + " — " + option.text, option.value));
                });
                top.appendChild(select);
                box.appendChild(top);

                box.appendChild(el("p", "t1-body", text.body || ""));

                if (text.ar) {
                    const sum = document.createElement("details");
                    sum.className = "t1-summary";
                    const s = document.createElement("summary");
                    s.textContent = "ملخص النص";
                    sum.appendChild(s);
                    sum.appendChild(el("p", "", text.ar));
                    box.appendChild(sum);
                }

                const row = { select: select, box: box, text: text };
                rows.push(row);

                function focusRow() {
                    activeRow = row;
                    rows.forEach(function (other) {
                        other.box.classList.toggle("is-active", other === row);
                    });
                }

                box.addEventListener("click", focusRow);
                select.addEventListener("focus", focusRow);
                select.addEventListener("change", function () {
                    focusRow();
                    paintUsed();
                });

                column.appendChild(box);
            });

            if (rows.length) {
                activeRow = rows[0];
                rows[0].box.classList.add("is-active");
            }

            /* ---- لوحة الترويسات ---- */
            const side = el("aside", "t1-side");
            const panel = el("div", "t1-panel");

            const panelHead = el("div", "t1-panel-head");
            panelHead.appendChild(el("span", "t1-panel-title", "ÜBERSCHRIFTEN"));
            const progress = el("span", "t1-progress", "0/" + rows.length);
            panelHead.appendChild(progress);
            panel.appendChild(panelHead);

            const optionRows = [];

            options.forEach(function (option) {
                const item = document.createElement("button");
                item.type = "button";
                item.className = "t1-option";

                item.appendChild(el("span", "t1-option-key", option.value));

                const textWrap = el("span", "t1-option-text");
                textWrap.appendChild(el("span", "t1-option-de", option.text || ""));
                if (option.ar) textWrap.appendChild(el("span", "t1-option-ar", option.ar));
                item.appendChild(textWrap);

                item.addEventListener("click", function () {
                    const target = activeRow || rows[0];
                    if (!target) return;
                    /* نفس الترويسة مرتين ماشي ممكن — كنحيدوها من اللخرين */
                    rows.forEach(function (other) {
                        if (other !== target && other.select.value === option.value) {
                            other.select.value = "";
                        }
                    });
                    target.select.value = option.value;
                    paintUsed();
                    /* نمشيو للنص اللي من بعد باش ما يبقاش يتبرك بزاف */
                    const at = rows.indexOf(target);
                    const next = rows[at + 1];
                    if (next) {
                        activeRow = next;
                        rows.forEach(function (other) {
                            other.box.classList.toggle("is-active", other === next);
                        });
                    }
                });

                optionRows.push({ node: item, value: option.value });
                panel.appendChild(item);
            });

            side.appendChild(panel);

            board.append(column, side);

            /* ---- الأزرار ---- */
            const actions = el("div", "lesen-actions");
            const checkBtn = btn("lesen-btn lesen-btn-check", "Antworten prüfen");
            const showBtn = btn("lesen-btn lesen-btn-show", "Lösungen anzeigen");
            const retryBtn = btn("lesen-btn lesen-btn-retry", "Nochmal versuchen");
            actions.append(checkBtn, showBtn, retryBtn);
            column.appendChild(actions);

            const score = el("div", "lesen-score");
            score.hidden = true;
            column.appendChild(score);

            checkBtn.addEventListener("click", function () { grade(false); });
            showBtn.addEventListener("click", function () { grade(true); });
            retryBtn.addEventListener("click", reset);

            paintUsed();

            /* ---- الترويسات المستعملة + العداد ---- */
            function paintUsed() {
                const used = rows.map(function (row) { return row.select.value; })
                                 .filter(Boolean);
                optionRows.forEach(function (item) {
                    item.node.classList.toggle("is-used", used.indexOf(item.value) !== -1);
                });
                progress.textContent = used.length + "/" + rows.length;
            }

            /* ---- التصحيح ---- */
            function grade(reveal) {
                let right = 0;
                let answered = 0;

                rows.forEach(function (row) {
                    clear(row);

                    const expected = String(row.text.answer || "");
                    const given = row.select.value;

                    if (given !== "") answered++;
                    const ok = given !== "" && given === expected;
                    if (ok) right++;

                    if (reveal) {
                        row.select.value = expected;
                        row.box.classList.add("correct");
                    } else {
                        row.box.classList.add(ok ? "correct" : "wrong");
                    }

                    row.box.appendChild(el("div", "lesen-mark " + (ok ? "ok" : "no"),
                        ok ? "✓ Richtig"
                           : (reveal ? "Lösung: " + expected
                                     : (given === "" ? "Noch nicht beantwortet" : "✗ Falsch"))));
                });

                paintUsed();
                score.hidden = false;
                score.textContent = reveal
                    ? "الحلول كاينة فوق. " + right + " من " + rows.length + " كانو صحاح."
                    : right + " / " + rows.length + " صحيحة" +
                      (answered < rows.length
                          ? " · باقي " + (rows.length - answered) + " بلا جواب" : "");
            }

            function clear(row) {
                row.box.classList.remove("correct", "wrong");
                const mark = row.box.querySelector(".lesen-mark");
                if (mark) mark.remove();
            }

            function reset() {
                rows.forEach(function (row) {
                    clear(row);
                    row.select.value = "";
                });
                paintUsed();
                score.hidden = true;
                wrap.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    }

    function btn(className, text) {
        const node = document.createElement("button");
        node.type = "button";
        node.className = className;
        node.textContent = text;
        return node;
    }

    window.__lesenTeil1Render = render;
})();
