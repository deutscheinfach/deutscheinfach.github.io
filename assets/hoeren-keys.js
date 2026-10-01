/* ===== Hören: الكلمات المفتاحية ف الجمل الصحيحة =====

   ماكاينش النص ديال الأوديو ف الموقع، إذن ماكنقدروش نقارنو بحال
   Lesen. ولكن ملي كيتصحح (Antworten prüfen / anzeigen)، الجمل اللي
   الجواب ديالها «Richtig» هي اللي كتقول بالضبط شنو تسمع ف الأوديو:
   كنلونو فيها الأسماء (بالألمانية كيبداو بحرف كبير)، الأسماء ديال
   البلايص والناس، والأرقام — بحال «Sportverein in Deutschland».

   ولا كانت «قصة سهلة للحفظ» (theme.note) فيها كلمات ألمانية بين
   قوسين — هادوك هوما الكلمات المفتاحية اللي حطيناهم: كنلونوهم ف
   القصة، وكنلونو نفس الكلمات (نفس الجذر) ف الجمل الصحيحة.

   كيخدم مع الكود اللي ف b*-hoeren-teil*.html بلا ما نبدلوه:
   كل سطر عندو data-answer، وكنسمعو للضغطات على الأزرار. */
(function () {
    "use strict";

    /* كلمات كتبدا بحرف كبير غير حيت جات ف أول الجملة */
    const STOP = new Set(("aber als am an auf aus bei beim da das dass dem den der des die dies diese dieser dieses durch ein eine einem einen einer eines er es für im in ist jetzt man mit nach nicht noch nun nur ob oder seit sie sind so um und unter vom von vor war wegen weil wenn wer wie wir wird zu zum zur über").split(" "));
    const WORD = /[0-9][0-9.,]*\s?%?|[A-Za-zÄÖÜäöüß][A-Za-zÄÖÜäöüß-]*/g;

    function isKey(word, first) {
        if (/^[0-9]/.test(word)) return true;
        if (word.length < 3) return false;
        if (!/^[A-ZÄÖÜ]/.test(word)) return false;
        if (first && STOP.has(word.toLowerCase())) return false;
        if (/^(Sie|Ihr|Ihre|Ihrem|Ihren|Ihrer|Ihres|Ihnen)$/.test(word)) return false;   /* Sie ماشي اسم */
        return true;
    }

    /* النص ديال الجملة كيكون text node من بعد الرقم — كنلفوه ف span مرة وحدة */
    function sentence(textEl) {
        let span = textEl.querySelector(".nq-de");
        if (span) return span;
        const node = Array.from(textEl.childNodes).find(function (n) {
            return n.nodeType === 3 && n.textContent.trim();
        });
        if (!node) return null;
        span = document.createElement("span");
        span.className = "nq-de";
        span.textContent = node.textContent;
        node.replaceWith(span);
        return span;
    }

    /* كلمة وحدة برك ف كل جملة: الأطول من بين الكلمات المرشحة
       (الأسماء الطويلة كتكون هي المعنى: Reisebüro، Überstunden…) */
    function paintOne(span, accept) {
        if (span.__kwText == null) span.__kwText = span.textContent;
        const text = span.__kwText;
        let best = null, m, first = true;
        WORD.lastIndex = 0;
        while ((m = WORD.exec(text))) {
            const w = m[0].trim();
            const ok = accept(w, first);
            first = false;
            if (ok && (!best || w.length > best.w.length)) best = { w: w, at: m.index };
        }
        span.textContent = "";
        if (!best) { span.textContent = text; return; }
        span.appendChild(document.createTextNode(text.slice(0, best.at)));
        const mark = document.createElement("mark");
        mark.className = "kw";
        mark.textContent = best.w;
        span.appendChild(mark);
        span.appendChild(document.createTextNode(text.slice(best.at + best.w.length)));
    }
    function paint(span) { paintOne(span, isKey); }

    /* ---- الكلمات ديال القصة (بين قوسين) ---- */
    const PAREN = /\(([^()]*[A-Za-zÄÖÜäöüß][^()]*)\)/g;
    const LATIN = /[A-Za-zÄÖÜäöüß][A-Za-zÄÖÜäöüß-]*/g;
    function fold(w) {
        return w.toLowerCase().replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/ß/g, "ss");
    }
    function stem(w) {
        const f = fold(w);
        const ends = ["ern", "en", "er", "es", "em", "e", "n", "s"];
        for (let i = 0; i < ends.length; i++) {
            if (f.length - ends[i].length >= 4 && f.endsWith(ends[i])) return f.slice(0, -ends[i].length);
        }
        return f;
    }
    /* كل جملة بين قوسين = لائحة ديال الجذور */
    function notePhrases(text) {
        const out = [];
        let m;
        PAREN.lastIndex = 0;
        while ((m = PAREN.exec(text))) {
            const set = new Set();
            (m[1].match(LATIN) || []).forEach(function (w) {
                if (w.length >= 4 && !STOP.has(w.toLowerCase())) set.add(stem(w));
            });
            (m[1].match(/[0-9]+/g) || []).forEach(function (n) { set.add(n); });
            if (set.size) out.push(Array.from(set));
        }
        return out;
    }
    /* الجملة كتاخد غير العبارة اللي كتشبه ليها كثر */
    /* العبارات ف القصة كيجيو بنفس الترتيب ديال الجمل الصحيحة، وكل وحدة
       لجملة وحدة — إذن العبارة اللي تخدمات ماكتعاودش. */
    function bestPhrase(text, phrases, used) {
        const words = text.match(WORD) || [];
        let best = null, score = 0;
        phrases.forEach(function (stems) {
            if (used.has(stems)) return;
            const n = words.filter(function (w) { return hit(w.trim(), stems); }).length;
            if (n > score) { score = n; best = stems; }
        });
        if (best) used.add(best);
        return best;
    }
    function hit(word, stems) {
        if (/^[0-9]/.test(word)) return stems.indexOf(word.replace(/[^0-9]/g, "")) !== -1;
        if (word.length < 4 || STOP.has(word.toLowerCase())) return false;
        const s = stem(word);
        return stems.some(function (k) {
            return s === k || (k.length >= 5 && s.indexOf(k) !== -1) || (s.length >= 5 && k.indexOf(s) !== -1);
        });
    }
    /* كنلونو ف الجملة كلمة وحدة من العبارة ديال القصة */
    function paintFrom(span, stems) {
        paintOne(span, function (w) { return hit(w, stems); });
    }
    /* ف القصة: الجمل اللي بين قوسين كاملين */
    function paintNote(span) {
        if (span.__kwText == null) span.__kwText = span.textContent;
        const text = span.__kwText;
        span.textContent = "";
        let last = 0, m;
        PAREN.lastIndex = 0;
        while ((m = PAREN.exec(text))) {
            span.appendChild(document.createTextNode(text.slice(last, m.index + 1)));
            const mark = document.createElement("mark");
            mark.className = "kw";
            mark.dir = "ltr";
            mark.textContent = m[1];
            span.appendChild(mark);
            last = m.index + 1 + m[1].length;
        }
        span.appendChild(document.createTextNode(text.slice(last)));
    }

    function clear(span) {
        if (span && span.__kwText != null) { span.textContent = span.__kwText; span.__kwText = null; }
    }

    /* صفحات Hören ماكيحملوش section.css — الستايل هنا */
    const css = document.createElement("style");
    css.textContent =
        ".nq-question-text mark.kw,.nq-note mark.kw{background:#fff3a6;color:inherit;border-bottom:2px solid #f2c200;border-radius:4px;padding:0 2px}" +
        "html.dark .nq-question-text mark.kw,html.dark .nq-note mark.kw,:root[data-theme=dark] .nq-question-text mark.kw,:root[data-theme=dark] .nq-note mark.kw{background:rgba(255,206,0,.28);border-bottom-color:#ffce00}";
    document.head.appendChild(css);

    function rowsOf(wrap) {
        return Array.from(wrap.querySelectorAll("[data-answer]"));
    }

    /* ===== زر الترجمة العربية =====
       شي مواضيع عندهم الترجمة (q.ar) وزر ديالهم. للباقيين كنزيدو نفس
       الزر، والترجمة كتجي من الـWorker (نفس translate ديال Schreiben،
       مع كاش 30 يوم — كتترجم مرة وحدة للجميع). */
    const ENDPOINT = "https://deutsch-einfach-correction.soufianemouyr.workers.dev";

    function statementsOf(wrap) {
        return rowsOf(wrap).map(function (row) {
            const textEl = row.querySelector(".nq-question-text");
            const span = textEl && sentence(textEl);
            return { textEl: textEl, text: span ? (span.__kwText != null ? span.__kwText : span.textContent).trim() : "" };
        });
    }

    async function translate(items) {
        const source = items.map(function (it, i) { return (i + 1) + ". " + it.text; }).join("\n");
        const res = await fetch(ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ translate: { text: source } })
        });
        const data = await res.json().catch(function () { return {}; });
        if (!res.ok || !data.translation) throw new Error(data.error || ("HTTP " + res.status));
        const out = [];
        data.translation.split("\n").forEach(function (line) {
            const m = line.match(/^\s*([0-9\u0660-\u0669]+)\s*[.)\-:]\s*(.+)$/);
            if (!m) return;
            const n = Number(m[1].replace(/[\u0660-\u0669]/g, function (d) { return d.charCodeAt(0) - 0x0660; }));
            out[n - 1] = m[2].trim();
        });
        return out;
    }

    function addArButton(wrap) {
        if (wrap.__arDone || wrap.querySelector(".ar-toggle")) return;
        if (!rowsOf(wrap).length) return;
        wrap.__arDone = true;

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "ar-toggle";
        btn.style.margin = "0 0 14px";
        const icon = document.createElement("span");
        icon.className = "ar-toggle-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = "ع";
        const label = document.createElement("span");
        btn.append(icon, label);

        let loaded = false, busy = false;
        function show(on) {
            wrap.classList.toggle("show-ar", on);
            btn.classList.toggle("is-on", on);
            btn.setAttribute("aria-pressed", on ? "true" : "false");
            label.textContent = on ? "خبي الترجمة" : "بين الترجمة العربية";
        }
        show(false);

        btn.addEventListener("click", async function () {
            if (busy) return;
            if (loaded) { show(!wrap.classList.contains("show-ar")); return; }
            busy = true;
            label.textContent = "كنترجمو…";
            try {
                const items = statementsOf(wrap);
                const ar = await translate(items);
                items.forEach(function (it, i) {
                    if (!it.textEl || !ar[i]) return;
                    const el = document.createElement("span");
                    el.className = "nq-question-ar";
                    el.dir = "rtl";
                    el.textContent = ar[i];
                    it.textEl.appendChild(el);
                });
                loaded = true;
                show(true);
            } catch (e) {
                label.textContent = "ما قدرناش نترجمو — عاود";
            }
            busy = false;
        });

        const after = wrap.querySelector(".nq-note") || wrap.querySelector(".nq-intro");
        if (after) after.insertAdjacentElement("afterend", btn);
        else wrap.insertBefore(btn, wrap.firstChild);
    }

    function scan() {
        document.querySelectorAll(".native-quiz-wrap").forEach(addArButton);
    }
    new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
    scan();

    document.addEventListener("click", function (event) {
        const btn = event.target.closest(".nq-btn-check, .nq-btn-show, .nq-btn-retry");
        if (!btn) return;
        const wrap = btn.closest(".native-quiz-wrap");
        if (!wrap) return;
        const retry = btn.classList.contains("nq-btn-retry");
        /* من بعد ما يخدم الكود ديال الصفحة */
        setTimeout(function () {
            const noteSpan = wrap.querySelector(".nq-note span");
            clear(noteSpan);
            const phrases = noteSpan ? notePhrases(noteSpan.textContent) : [];
            if (!retry && phrases.length) paintNote(noteSpan);
            const used = new Set();
            rowsOf(wrap).forEach(function (row) {
                const textEl = row.querySelector(".nq-question-text");
                if (!textEl) return;
                const span = sentence(textEl);
                if (!span) return;
                clear(span);
                if (retry || row.dataset.answer !== "richtig") return;
                if (!phrases.length) { paint(span); return; }
                const best = bestPhrase(span.textContent, phrases, used);
                if (best) paintFrom(span, best);
            });
        }, 0);
    });
}());
