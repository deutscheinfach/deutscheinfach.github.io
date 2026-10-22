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
         note: "…",                                   // اختياري: ملاحظة على النسخة
         options: [ { value: "A", text: "…", ar: "…" }, … ],   // changed: true = ترويسة معدلة
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
                    keys: text.keys,
                    answer: questions[i] ? questions[i].answer : ""
                };
            })
        }];
    }

    function render(into, task, meta) {
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
        if (window.__lesenArToggle) window.__lesenArToggle(head, wrap, task);
        wrap.appendChild(head);
        /* فيديو الشرح ديال هاد الجزء (assets/topic-video.js) */
        if (window.__deVideo) window.__deVideo.mountLesen(wrap, "teil1", task && task.title);

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
            /* بلا انتقال: النسخة الجديدة كتبان ف اللحظة (الانتقال كان كيدير lag) */
            const still = true;

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
            let dragJustEnded = false;

            /* ---- العمود ديال النصوص ---- */
            const column = el("div", "t1-texts");

            /* الجملة ديال التعليمات (Lesen Sie …) ماكتبانش: النصوص كيبداو
               ف نفس المستوى ديال العمود ديال Überschriften. */
            if (variant.note) column.appendChild(el("p", "t1-note", variant.note));

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
                /* 🧠 قصة الربط (assets/keyword-story.js): Premium، الأدمين كيكتبها */
                if (window.__deStory) {
                    const right = options.find(function (o) { return o.value === text.answer; });
                    const base = index > 0 && variants[0].texts ? variants[0].texts[i] : null;
                    window.__deStory.attach(top, text.body, { head: right ? right.text : "" },
                        { variant: index, pos: i, baseText: base ? base.body : "" });
                }

                box.appendChild(el("p", "t1-body", text.body || ""));

                if (text.ar) box.appendChild(window.__lesenArBlock(text.ar, "ملخص النص"));

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
                    /* احتياط: القائمة كتسد الترويسات المستعملين (paintUsed) */
                    if (select.value && rows.some(function (other) { return other.select !== select && other.select.value === select.value; })) {
                        select.value = "";
                    }
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
                if (option.changed) textWrap.appendChild(el("span", "t1-option-changed", "معدل"));
                if (option.ar) textWrap.appendChild(el("span", "t1-option-ar", option.ar));
                item.appendChild(textWrap);

                item.addEventListener("click", function () {
                    if (dragJustEnded) return;   /* السحب كيطلق click من بعدو */
                    assign(activeRow || rows[0], option.value);
                });

                makeDraggable(item, option);

                optionRows.push({ node: item, value: option.value });
                panel.appendChild(item);
            });

            /* ---- نحطو ترويسة ف نص (بالكليك ولا بالسحب) ---- */
            function assign(target, value) {
                if (!target) return;
                /* نفس الترويسة مرتين ماشي ممكن: إلا مختارة لنص آخر، ماكتتحطش
                   (خاص الطالب يحيدها من النص الأول) */
                if (rows.some(function (other) { return other !== target && other.select.value === value; })) return;
                target.select.value = value;
                paintUsed();
                /* نمشيو للنص اللي من بعد اللي باقي خاوي */
                const at = rows.indexOf(target);
                const next = rows.slice(at + 1).find(function (r) { return !r.select.value; })
                          || rows[at + 1];
                if (next) {
                    activeRow = next;
                    rows.forEach(function (other) {
                        other.box.classList.toggle("is-active", other === next);
                    });
                }
            }

            /* ---- السحب: هز الترويسة وحطها فوق النص ----
               الماوس: كيبدا ملي تحرك شوية. التيليفون: ضغطة طويلة
               (باش السكرول العادي يبقى خدام). */
            function makeDraggable(item, option) {
                item.addEventListener("pointerdown", function (down) {
                    if (down.button !== 0 || item.classList.contains("is-locked")) return;
                    const touch = down.pointerType !== "mouse";
                    const sx = down.clientX, sy = down.clientY;
                    let drag = null, timer = 0, lastX = sx, lastY = sy, over = null, raf = 0;

                    function begin() {
                        const r = item.getBoundingClientRect();
                        const ghost = item.cloneNode(true);
                        ghost.className = "t1-option t1-ghost";
                        ghost.style.width = r.width + "px";
                        document.body.appendChild(ghost);
                        drag = { ghost: ghost, dx: sx - r.left, dy: sy - r.top };
                        item.classList.add("is-dragging");
                        document.documentElement.classList.add("t1-dragging");
                        if (touch && navigator.vibrate) { try { navigator.vibrate(15); } catch (e) { /* */ } }
                        place();
                        tick();
                    }
                    function place() {
                        if (!drag) return;
                        drag.ghost.style.transform = "translate(" + (lastX - drag.dx) + "px," + (lastY - drag.dy) + "px)";
                        const hit = document.elementFromPoint(lastX, lastY);
                        const box = hit && hit.closest ? hit.closest(".t1-text") : null;
                        const row = box ? rows.find(function (r) { return r.box === box; }) : null;
                        if (over && over !== row) over.box.classList.remove("is-drop");
                        over = row || null;
                        if (over) over.box.classList.add("is-drop");
                    }
                    /* سكرول أوتوماتيكي ملي تقرب للفوق ولا للتحت */
                    function tick() {
                        if (!drag) return;
                        const edge = 90, h = window.innerHeight;
                        let v = 0;
                        if (lastY < edge) v = -Math.ceil((edge - lastY) / 6);
                        else if (lastY > h - edge) v = Math.ceil((lastY - (h - edge)) / 6);
                        if (v) { window.scrollBy(0, v); place(); }
                        raf = requestAnimationFrame(tick);
                    }
                    function move(ev) {
                        if (ev.pointerId !== down.pointerId) return;
                        lastX = ev.clientX; lastY = ev.clientY;
                        const far = Math.abs(lastX - sx) + Math.abs(lastY - sy);
                        if (!drag) {
                            if (touch) { if (far > 10) stop(); return; }   /* سكرول، ماشي سحب */
                            if (far > 6) begin();
                            return;
                        }
                        place();
                    }
                    function blockScroll(ev) { if (drag) ev.preventDefault(); }
                    function up(ev) {
                        if (ev.pointerId !== down.pointerId) return;
                        if (drag && over && ev.type === "pointerup") {
                            assign(over, option.value);
                        }
                        stop();
                    }
                    function stop() {
                        clearTimeout(timer);
                        cancelAnimationFrame(raf);
                        window.removeEventListener("pointermove", move);
                        window.removeEventListener("pointerup", up);
                        window.removeEventListener("pointercancel", up);
                        document.removeEventListener("touchmove", blockScroll, { passive: false });
                        if (over) over.box.classList.remove("is-drop");
                        if (drag) {
                            drag.ghost.remove();
                            item.classList.remove("is-dragging");
                            document.documentElement.classList.remove("t1-dragging");
                            dragJustEnded = true;
                            setTimeout(function () { dragJustEnded = false; }, 0);
                        }
                        drag = null; over = null;
                    }

                    window.addEventListener("pointermove", move);
                    window.addEventListener("pointerup", up);
                    window.addEventListener("pointercancel", up);
                    document.addEventListener("touchmove", blockScroll, { passive: false });
                    if (touch) timer = setTimeout(begin, 320);
                });
                /* الضغطة الطويلة ف التيليفون ما تحلّش القائمة ديال النظام */
                item.addEventListener("contextmenu", function (ev) { ev.preventDefault(); });
            }

            side.appendChild(panel);

            board.append(column, side);

            /* ---- الأزرار ---- */
            const actions = el("div", "lesen-actions");
            const checkBtn = btn("lesen-btn lesen-btn-check", "تحقق من الإجابات");
            const showBtn = btn("lesen-btn lesen-btn-show", "شوف الحل");
            const retryBtn = btn("lesen-btn lesen-btn-retry", "عاود من جديد");
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
                rows.forEach(function (row) {
                    row.box.classList.toggle("has-pick", !!row.select.value);
                    /* ف القائمة: الترويسات ديال النصوص الخرين مسدودين */
                    Array.prototype.forEach.call(row.select.options, function (opt) {
                        opt.disabled = !!opt.value && opt.value !== row.select.value && used.indexOf(opt.value) !== -1;
                    });
                });
                progress.textContent = used.length + "/" + rows.length;
                progress.style.setProperty("--p", rows.length ? (used.length) / rows.length : 0);
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

                    /* الترويسة الصحيحة فوق النص + الكلمات المفتاحية ملونين */
                    const head = options.find(function (o) { return String(o.value) === expected; });
                    const body = row.box.querySelector(".t1-body");
                    /* «تحقق» و «شوف الحل» بجوج كيبينو الترويسة والكلمات */
                    if (head && body && window.__lesenKeys) {
                        const title = el("div", "kw-title");
                        title.appendChild(el("span", "kw-key", expected));
                        const words = el("span", "kw-words", head.text || "");
                        title.appendChild(words);
                        body.parentNode.insertBefore(title, body);
                        /* حتى ف لوحة الترويسات: الكلمات + «Text n» */
                        const item = optionRows.find(function (o) { return String(o.value) === expected; });
                        const de = item && item.node.querySelector(".t1-option-de");
                        if (item) {
                            item.node.classList.add("kw-answer");
                            const tag = el("span", "kw-for", "Text " + (rows.indexOf(row) + 1));
                            item.node.appendChild(tag);
                        }
                        /* + اللي كتبناهم بالإيد لهاد النص (assets/lesen-keys.js) */
                        const manual = window.__lesenKeys.manual(meta, rows.indexOf(row) + 1, row.text);
                        window.__lesenKeys.link([body], de ? [words, de] : [words], [manual],
                            kwCtx(meta, row.box, [
                                { text: row.text.body, title: "Text " + (rows.indexOf(row) + 1) },
                                /* الترويسة عندها الكلمات ديالها (كتحدد ف الترويسة اللي فوق النص) */
                                { text: "Überschrift: " + (head.text || ""), title: "Überschrift " + expected }
                            ]));
                    }
                });

                paintUsed();
                window.__lesenScore(score, "teil1", right, rows.length, reveal,
                    rows.length - answered);
            }

            function clear(row) {
                row.box.classList.remove("correct", "wrong");
                const mark = row.box.querySelector(".lesen-mark");
                if (mark) mark.remove();
                const title = row.box.querySelector(".kw-title");
                if (title) title.remove();
                if (window.__lesenKeys) window.__lesenKeys.clear([row.box.querySelector(".t1-body")]);
                const item = optionRows.find(function (o) { return String(o.value) === String(row.text.answer || ""); });
                if (item) {
                    item.node.classList.remove("kw-answer");
                    const tag = item.node.querySelector(".kw-for");
                    if (tag) tag.remove();
                    if (window.__lesenKeys) window.__lesenKeys.clear([item.node.querySelector(".t1-option-de")]);
                }
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

    /* الكلمات اللي كيزيدهم الأدمين من الموقع (assets/kw-custom.js) */
    function kwCtx(meta, box, parts) {
        if (!window.__kwCustom || !meta || !meta.id) return null;
        return {
            doc: "lesen-" + String(meta.level || "b2").toLowerCase() + "-" + meta.id,
            items: parts.map(function (part) {
                return { key: window.__kwCustom.key(part.text), box: box, title: "كلمات مفتاحية — " + part.title };
            })
        };
    }

    window.__lesenTeil1Render = render;
})();
