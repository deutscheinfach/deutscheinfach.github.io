/* ===== Lesen Teil 3 — Anzeigen zuordnen =====

   شكل الصفحة:
     - تبويبات ديال النسخ (الأساسي / المعدل …)
     - على اليسار: الإعلانات A–L، كل واحد فيه العنوان، النص،
       وملخص بالدارجة (مطوي)
     - على اليمين: الوضعيات 11–20. تبرك على إعلان كيتحط
       فالوضعية الخدامة. "X" = ماكاين حتى إعلان مناسب.

   شكل البيانات:
   {
     title: "Aflam",
     kind: "ads",
     ads: [ { key: "A", head: "23.15 3SAT …", body: "…", ar: "…" }, … ],
     variants: [
       {
         label: "الأساسي",
         intro: "…",                                   // اختياري
         note: "…",                                    // اختياري: ملاحظة
         situations: [ { no: 11, de: "…", ar: "…" }, … ],   // changed: true = معدلة
         answers: [ "L", "I", "B", … ]                  // ولا situations[].answer
       }, …
     ]
   }

   الإعلانات والوضعيات كيتكتبو مرة وحدة فوق، وكل نسخة كتعطي
   غير الحلول ديالها — بحال Teil 1.
*/

(function () {
    "use strict";

    const NONE = "X";

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

    /* كل نسخة كتاخد الإعلانات والوضعيات ديال الموضوع إلا ماعندهاش ديالها */
    function toVariants(task) {
        const ads = Array.isArray(task.ads) ? task.ads : [];
        const sits = Array.isArray(task.situations) ? task.situations : [];

        const list = (Array.isArray(task.variants) && task.variants.length)
            ? task.variants
            : [{ label: "الأساسي", intro: task.intro, answers: task.answers }];

        return list.map(function (variant) {
            const own = Array.isArray(variant.situations) ? variant.situations : sits;
            const keys = variant.answers || [];

            return Object.assign({}, variant, {
                ads: Array.isArray(variant.ads) ? variant.ads : ads,
                situations: own.map(function (sit, i) {
                    return Object.assign({}, sit, {
                        answer: sit.answer !== undefined ? sit.answer : keys[i]
                    });
                })
            });
        });
    }

    function render(into, task) {
        const variants = toVariants(task);
        let index = 0;

        const wrap = el("div", "t3-wrap");

        /* ---- تبويبات النسخ ---- */
        if (variants.length > 1) {
            const bar = el("nav", "t1-variants");
            bar.setAttribute("aria-label", "نسخ التمرين");

            variants.forEach(function (variant, i) {
                const tab = btn("t1-variant" + (i === 0 ? " active" : ""),
                                variant.label || ("نسخة " + (i + 1)));
                tab.addEventListener("click", function () {
                    if (i === index) return;
                    const forward = i > index;
                    index = i;
                    Array.from(bar.children).forEach(function (other, oi) {
                        other.classList.toggle("active", oi === index);
                    });
                    swap(forward);
                });
                bar.appendChild(tab);
            });
            wrap.appendChild(bar);
        }

        const head = el("div", "t1-head");
        head.appendChild(el("h2", "t1-title", task.title || "Leseverstehen"));
        head.appendChild(el("div", "t1-kicker", "LESEVERSTEHEN TEIL 3"));
        if (window.__lesenArToggle) window.__lesenArToggle(head, wrap, task);
        wrap.appendChild(head);

        const board = el("div", "t1-board");
        wrap.appendChild(board);

        into.appendChild(wrap);
        paint();

        /* تبديل النسخة بانتقال — transitionend كيطلع من الوليدات،
           إذن كنقبلو غير اللي جا من board نفسو. */
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
                if (event && event.target !== board) return;
                if (finished) return;
                finished = true;

                board.removeEventListener("transitionend", done);
                clearTimeout(guard);

                board.classList.remove("t1-out-left", "t1-out-right");
                board.classList.add(forward ? "t1-in-right" : "t1-in-left");
                paint();

                requestAnimationFrame(function () {
                    requestAnimationFrame(function () {
                        board.classList.remove("t1-in-right", "t1-in-left");
                        board.classList.add("t1-stagger");
                        board.dataset.busy = "";
                    });
                });
            };

            const guard = setTimeout(done, 420);
            board.addEventListener("transitionend", done);
        }

        /* ================= رسم نسخة وحدة ================= */

        function paint() {
            const variant = variants[index];
            const ads = variant.ads || [];
            const sits = variant.situations || [];
            board.textContent = "";

            const rows = [];            /* { select, box, sit } */
            const adRows = [];          /* { node, key, slot }  */
            let activeRow = null;

            /* ---- الإعلانات ---- */
            const column = el("div", "t1-texts");
            if (variant.intro) column.appendChild(el("p", "t1-intro", variant.intro));
            if (variant.note) column.appendChild(el("p", "t1-note", variant.note));

            ads.forEach(function (ad) {
                const box = el("article", "t1-text t3-ad");

                const top = el("div", "t3-ad-top");
                top.appendChild(el("span", "t3-ad-key", ad.key));
                top.appendChild(el("span", "t3-ad-head", ad.head || ""));

                const slot = el("span", "t3-ad-slot");
                slot.hidden = true;
                top.appendChild(slot);
                box.appendChild(top);

                box.appendChild(el("p", "t1-body", ad.body || ""));

                if (ad.ar) box.appendChild(window.__lesenArBlock(ad.ar, "ملخص الإعلان"));

                /* تبرك على الإعلان = كيتحط فالوضعية الخدامة */
                box.addEventListener("click", function (event) {
                    if (event.target.closest(".ar-block")) return;   /* قراية الملخص */
                    assign(ad.key);
                });

                adRows.push({ node: box, key: ad.key, slot: slot });
                column.appendChild(box);
            });

            /* ---- لوحة الوضعيات ---- */
            const side = el("aside", "t1-side");
            const panel = el("div", "t1-panel t3-panel");

            const panelHead = el("div", "t1-panel-head");
            panelHead.appendChild(el("span", "t1-panel-title", "SITUATIONEN"));
            const progress = el("span", "t1-progress", "0/" + sits.length);
            panelHead.appendChild(progress);
            panel.appendChild(panelHead);

            sits.forEach(function (sit, i) {
                const box = el("div", "t3-sit");

                const top = el("div", "t3-sit-top");
                top.appendChild(el("span", "t3-sit-num", String(sit.no || (i + 11))));

                const select = document.createElement("select");
                select.className = "t1-select t3-select";
                select.setAttribute("aria-label",
                    "Anzeige für Situation " + (sit.no || (i + 11)));
                select.appendChild(new Option("—", ""));
                ads.forEach(function (ad) {
                    select.appendChild(new Option(ad.key, ad.key));
                });
                select.appendChild(new Option(NONE, NONE));
                top.appendChild(select);
                box.appendChild(top);

                if (sit.changed) box.appendChild(el("span", "t1-option-changed", "معدل"));
                box.appendChild(el("p", "t3-sit-de", sit.de || ""));
                if (sit.ar) box.appendChild(el("p", "t3-sit-ar", sit.ar));

                const row = { select: select, box: box, sit: sit };
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
                    /* نفس الإعلان ماشي ف جوج وضعيات — غير X كيتعاود */
                    if (select.value && select.value !== NONE) {
                        rows.forEach(function (other) {
                            if (other !== row && other.select.value === select.value) {
                                other.select.value = "";
                            }
                        });
                    }
                    paintUsed();
                });

                panel.appendChild(box);
            });

            if (rows.length) {
                activeRow = rows[0];
                rows[0].box.classList.add("is-active");
            }

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

            /* ---- تبرك على إعلان ---- */
            function assign(key) {
                const target = activeRow || rows[0];
                if (!target) return;

                rows.forEach(function (other) {
                    if (other !== target && other.select.value === key) {
                        other.select.value = "";
                    }
                });
                target.select.value = key;
                paintUsed();

                const at = rows.indexOf(target);
                const next = rows[at + 1];
                if (next) {
                    activeRow = next;
                    rows.forEach(function (other) {
                        other.box.classList.toggle("is-active", other === next);
                    });
                }
            }

            /* ---- الإعلانات المستعملة + العداد ---- */
            function paintUsed() {
                const used = {};
                rows.forEach(function (row) {
                    if (row.select.value) used[row.select.value] = row.sit.no;
                });

                adRows.forEach(function (item) {
                    const at = used[item.key];
                    item.node.classList.toggle("is-used", at !== undefined);
                    item.slot.hidden = at === undefined;
                    item.slot.textContent = at === undefined ? "" : "Situation " + at;
                });

                const answered = rows.filter(function (r) { return r.select.value; }).length;
                progress.textContent = answered + "/" + rows.length;
            }

            /* ---- التصحيح ---- */
            function grade(reveal) {
                let right = 0;
                let answered = 0;

                rows.forEach(function (row) {
                    clear(row);

                    const expected = String(row.sit.answer || "");
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
                window.__lesenScore(score, "teil3", right, rows.length, reveal,
                    rows.length - answered);
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
                /* نرجعو للوضعية الأولى، ماشي نبقاو واقفين فين كنا */
                activeRow = rows[0] || null;
                rows.forEach(function (other) {
                    other.box.classList.toggle("is-active", other === activeRow);
                });
                paintUsed();
                score.hidden = true;
                wrap.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    }

    window.__lesenTeil3Render = render;
})();
