/* ===== اضغط على كلمة = المعنى بالدارجة =====

   ف نصوص Lesen، الطالب كيبرك على أي كلمة ألمانية وكيبان ليه المعنى.

   جوج مصادر، بهاد الترتيب:
   1) القاموس ديال الموقع (Wortschatz + word-core.js): فوري، بلا نت،
      والمعاني مكتوبين بالدارجة. كيعرف الجمع والتصريف (Verträge، kündigte…).
   2) الـWorker: الكلمات اللي ماكايناش ف القاموس كتتصيفط لـ Gemini
      (نفس route الـtranslate ديال Hören و Schreiben). الجواب كيتحفظ ف
      الكاش ديال Cloudflare وف المتصفح، إذن الكلمة كتتترجم مرة وحدة.
   إلا طاح الـWorker، كيبان رابط Google Translate.

   ماكنبدلو حتى حاجة ف النص: كنعرفو الكلمة من بلاصة البركة (caret) —
   الـmarkup ديال Lesen (النقط، الكلمات المفتاحية…) كيبقى كيف ما هو.
   كتخدم غير ف النصوص (SCOPE) ماشي ف الاختيارات: البركة عليهم كتختار الجواب.

   Modelltest (is-embed) بلا مساعدة، بحال الامتحان الحقيقي. */

(function () {
    "use strict";

    if (window.__deWordTap) return;
    window.__deWordTap = true;

    const SCOPE = ".t1-body, .t1-intro, .t2-q-de, .t3-ad-head";
    const SKIP = "a, button, input, select, textarea, label, option, summary, "
        + "[role='button'], [contenteditable='true']";
    const ENDPOINT = "https://deutsch-einfach-correction.soufianemouyr.workers.dev";
    const DATA = ["assets/wortschatz-1000.js", "assets/wortschatz-b2.js",
        "assets/word-lookup.js", "assets/word-core.js"];
    const CACHE_KEY = "de-wt-v1";
    const HINT_KEY = "de-wt-hint";
    const QUOTA_KEY = "de-wt-day";

    /* نفس مفتاح Gemini كيخدم Schreiben (الدفع). كلمة غير معروفة = طلب،
       إذن كل جهاز عندو حد ف النهار باش ما يوقعش الضغط على التصحيح. */
    const DAILY = 80;
    const LETTER = /[A-Za-zÄÖÜäöüß]/;

    const ICON = {
        speak: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>',
        plus: '<path d="M12 5v14M5 12h14"/>',
        check: '<path d="m5 12 5 5 9-10"/>',
        close: '<path d="M6 6l12 12M18 6 6 18"/>'
    };

    let pop = null;
    let current = null;
    let seq = 0;
    let ready = null;
    let failures = 0;
    let coolUntil = 0;

    function el(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    function icon(name) {
        const span = el("span", "wt-svg");
        span.setAttribute("aria-hidden", "true");
        span.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"'
            + ' stroke-linecap="round" stroke-linejoin="round">' + ICON[name] + "</svg>";
        return span;
    }

    function style() {
        if (document.getElementById("wt-style")) return;
        const css = document.createElement("style");
        css.id = "wt-style";
        css.textContent = [
            ".wt-pop{position:fixed;z-index:2147483000;width:min(320px,calc(100vw - 16px));box-sizing:border-box;",
            "padding:12px 14px;border-radius:14px;background:var(--surface,#fff);color:var(--text,#14161f);",
            "border:1px solid var(--line-gold,rgba(214,178,94,.5));box-shadow:0 14px 40px -8px rgba(0,0,0,.4);",
            "font-family:'Cairo',system-ui,sans-serif;line-height:1.5;direction:ltr;text-align:left}",
            ".wt-pop[hidden]{display:none}",
            ".wt-pop.wt-sheet{left:8px!important;right:8px;top:auto!important;width:auto;",
            "bottom:calc(8px + env(safe-area-inset-bottom,0px))}",
            ".wt-head{display:flex;align-items:center;gap:6px}",
            ".wt-de{flex:1;min-width:0;font-weight:800;font-size:17px;overflow-wrap:anywhere}",
            ".wt-ic{flex:none;display:grid;place-items:center;width:34px;height:34px;padding:0;border-radius:10px;",
            "border:1px solid var(--border,rgba(20,22,31,.15));background:transparent;color:inherit;cursor:pointer}",
            ".wt-ic:hover{border-color:var(--gold,#d6b25e)}",
            ".wt-svg{display:inline-grid;width:18px;height:18px}.wt-svg svg{width:100%;height:100%}",
            ".wt-ar{margin-top:6px;font-size:18px;font-weight:700;direction:rtl;text-align:right}",
            ".wt-ar.wt-wait{font-weight:500;color:var(--text-dim,#5b6172)}",
            ".wt-note{margin-top:4px;font-size:12px;color:var(--text-dim,#5b6172);direction:rtl;text-align:right}",
            ".wt-foot{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;direction:rtl}",
            ".wt-btn{display:inline-flex;align-items:center;gap:6px;padding:7px 12px;border-radius:999px;",
            "border:1px solid var(--line-gold,rgba(214,178,94,.5));background:transparent;color:inherit;",
            "font:700 13px 'Cairo',system-ui,sans-serif;cursor:pointer;text-decoration:none}",
            ".wt-btn:hover{background:var(--gold-soft,rgba(214,178,94,.15))}",
            ".wt-btn[disabled]{opacity:.65;cursor:default}",
            ".wt-btn .wt-svg{width:15px;height:15px}",
            "::highlight(wt-hit){background-color:rgba(214,178,94,.4);color:inherit}",
            ".wt-hint{position:fixed;z-index:2147482999;left:50%;transform:translateX(-50%);",
            "bottom:calc(16px + env(safe-area-inset-bottom,0px));max-width:calc(100vw - 24px);padding:10px 16px;",
            "border-radius:999px;background:var(--ink,#14161f);color:#fff;font:700 13px 'Cairo',system-ui,sans-serif;",
            "box-shadow:0 10px 30px -8px rgba(0,0,0,.5);direction:rtl;text-align:center}"
        ].join("");
        document.head.appendChild(css);
    }

    /* ---------- القاموس ---------- */

    function load(src) {
        return new Promise(function (done, fail) {
            const tag = document.createElement("script");
            tag.src = src;
            tag.onload = done;
            tag.onerror = function () { fail(new Error(src)); };
            document.head.appendChild(tag);
        });
    }

    /* كيتحمل مرة وحدة، ملي كيبان أول نص ولا عند أول بركة */
    function prepare() {
        if (ready) return ready;
        ready = Promise.all([
            window.DE_WORDS_1000 ? 0 : load(DATA[0]),
            window.DE_VOCAB ? 0 : load(DATA[1]),
            window.DE_LOOKUP ? 0 : load(DATA[2]),
            window.DE_CORE ? 0 : load(DATA[3])
        ]).then(function () {
            const pair = function (w) { return { de: w[0], ar: w[1] }; };
            const core = window.DE_CORE || { words: [], closed: [], forms: {} };
            /* الكلمات اللي حفظها الطالب كتربح على الباقي */
            const own = window.DEProgress
                ? window.DEProgress.custom().map(function (w) { return { de: w.de, ar: w.ar }; })
                : [];
            const cards = window.DE_VOCAB
                ? window.DE_VOCAB.cards()
                    .filter(function (c) { return c.deck !== "meine"; })
                    .map(function (c) { return { de: c.de, ar: c.ar }; })
                : [];
            window.DE_LOOKUP.build(own.concat(cards, core.words.map(pair)), core.forms,
                core.closed.map(pair));
        });
        ready.catch(function () { ready = null; });
        return ready;
    }

    /* ---------- الـWorker ---------- */

    function cacheRead() {
        try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || {}; }
        catch (error) { return {}; }
    }

    function cacheWrite(word, text) {
        try {
            const all = cacheRead();
            all[word] = text;
            const keys = Object.keys(all);
            while (keys.length > 400) delete all[keys.shift()];
            localStorage.setItem(CACHE_KEY, JSON.stringify(all));
        } catch (error) { /* التصفح الخاص: ماشي مشكل */ }
    }

    /* true = باقي ليك طلبات اليوم (وكنحسبو هاد الطلب) */
    function spend() {
        try {
            const day = new Date().toISOString().slice(0, 10);
            const box = JSON.parse(localStorage.getItem(QUOTA_KEY) || "{}");
            const used = box.day === day ? box.n : 0;
            if (used >= DAILY) return false;
            localStorage.setItem(QUOTA_KEY, JSON.stringify({ day: day, n: used + 1 }));
        } catch (error) { /* التصفح الخاص: بلا حد */ }
        return true;
    }

    function remote(word) {
        const saved = cacheRead()[word];
        if (saved) return Promise.resolve(saved);

        /* الـWorker طايح؟ ماكنزيدوش نضغطو عليه */
        if (Date.now() < coolUntil) return Promise.reject(new Error("cooling"));
        if (!spend()) return Promise.reject(new Error("limit"));

        const control = window.AbortController ? new AbortController() : null;
        const timer = setTimeout(function () { if (control) control.abort(); }, 9000);

        return fetch(ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ translate: { text: word } }),
            signal: control ? control.signal : undefined
        }).then(function (res) {
            return res.json().catch(function () { return {}; }).then(function (data) {
                if (!res.ok || !data.translation) throw new Error(data.error || ("HTTP " + res.status));
                const text = String(data.translation).trim().split("\n")[0].slice(0, 120);
                if (!text) throw new Error("empty");
                failures = 0;
                cacheWrite(word, text);
                return text;
            });
        }).catch(function (error) {
            if (++failures >= 3) { failures = 0; coolUntil = Date.now() + 5 * 60 * 1000; }
            throw error;
        }).then(function (text) { clearTimeout(timer); return text; },
                function (error) { clearTimeout(timer); throw error; });
    }

    function lookup(word) {
        return prepare().catch(function () { return null; }).then(function () {
            const local = window.DE_LOOKUP && window.DE_LOOKUP.find(word);
            if (local) return { phase: "found", tapped: word, de: local.de, ar: local.ar, via: local.via };
            return remote(word).then(
                function (ar) { return { phase: "auto", tapped: word, de: word, ar: ar }; },
                function (error) { return { phase: "missing", tapped: word, limit: error.message === "limit" }; });
        });
    }

    /* ---------- الكلمة تحت الصبع ---------- */

    function caret(x, y) {
        if (document.caretPositionFromPoint) {
            const p = document.caretPositionFromPoint(x, y);
            return p && p.offsetNode ? { node: p.offsetNode, offset: p.offset } : null;
        }
        if (document.caretRangeFromPoint) {
            const r = document.caretRangeFromPoint(x, y);
            return r ? { node: r.startContainer, offset: r.startOffset } : null;
        }
        return null;
    }

    /* الحرف، ولا - و ' بين جوج حروف (E-Mail، geht's) */
    function inWord(text, i) {
        const ch = text.charAt(i);
        if (LETTER.test(ch)) return true;
        return (ch === "-" || ch === "'" || ch === "’")
            && LETTER.test(text.charAt(i - 1)) && LETTER.test(text.charAt(i + 1));
    }

    function wordAt(x, y) {
        const c = caret(x, y);
        if (!c || c.node.nodeType !== 3) return null;

        const text = c.node.nodeValue;
        let a = c.offset;
        let b = c.offset;
        while (a > 0 && inWord(text, a - 1)) a--;
        while (b < text.length && inWord(text, b)) b++;
        if (b - a < 2) return null;

        const range = document.createRange();
        range.setStart(c.node, a);
        range.setEnd(c.node, b);

        /* caret كيقرب لأقرب حرف حتى ملي كتبرك ف الفراغ (آخر السطر…).
           خاصنا نتأكدو بلي الصبع فعلا على الكلمة. */
        const on = Array.prototype.some.call(range.getClientRects(), function (r) {
            return x >= r.left - 3 && x <= r.right + 3 && y >= r.top - 3 && y <= r.bottom + 3;
        });
        if (!on) return null;

        return { node: c.node, start: a, end: b, word: text.slice(a, b), range: range };
    }

    /* الجملة اللي فيها الكلمة: كتتحفظ مع الكلمة كمثال */
    function sentence(hit, block) {
        const before = document.createRange();
        before.setStart(block, 0);
        before.setEnd(hit.node, hit.start);
        const at = before.toString().length;
        const full = block.textContent;

        const start = Math.max(full.lastIndexOf(". ", at - 1), full.lastIndexOf("! ", at - 1),
            full.lastIndexOf("? ", at - 1));
        const after = full.slice(at).search(/[.!?](\s|$)/);
        const end = after < 0 ? full.length : at + after + 1;
        return full.slice(start < 0 ? 0 : start + 2, end).replace(/\s+/g, " ").trim().slice(0, 180);
    }

    function mark(range) {
        if (window.CSS && CSS.highlights && window.Highlight) {
            CSS.highlights.set("wt-hit", new Highlight(range));
        }
    }

    function unmark() {
        if (window.CSS && CSS.highlights) CSS.highlights.delete("wt-hit");
    }

    /* ---------- النافذة ---------- */

    function speak(text) {
        if (!window.speechSynthesis) return;
        try {
            speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(String(text).replace(/\+ ?(Akk|Dat|Gen)\./g, ""));
            u.lang = "de-DE";
            u.rate = 0.9;
            const voice = speechSynthesis.getVoices().find(function (v) { return /^de/i.test(v.lang); });
            if (voice) u.voice = voice;
            speechSynthesis.speak(u);
        } catch (error) { /* ماشي مشكل */ }
    }

    function saved(de) {
        return !!window.DEProgress && window.DEProgress.custom().some(function (w) {
            return w.de.toLowerCase() === de.toLowerCase();
        });
    }

    function render(state) {
        pop.textContent = "";

        const head = el("div", "wt-head");
        head.appendChild(el("div", "wt-de", state.de || state.tapped));
        if (state.phase !== "loading" && window.speechSynthesis) {
            const say = el("button", "wt-ic");
            say.type = "button";
            say.setAttribute("aria-label", "النطق");
            say.appendChild(icon("speak"));
            say.addEventListener("click", function () { speak(state.de || state.tapped); });
            head.appendChild(say);
        }
        const x = el("button", "wt-ic");
        x.type = "button";
        x.setAttribute("aria-label", "سد");
        x.appendChild(icon("close"));
        x.addEventListener("click", close);
        head.appendChild(x);
        pop.appendChild(head);

        if (state.phase === "loading") {
            pop.appendChild(el("div", "wt-ar wt-wait", "كنقلب…"));
            return;
        }

        if (state.phase === "missing") {
            pop.appendChild(el("div", "wt-ar wt-wait", state.limit
                ? "وصلتي الحد اليومي ديال الترجمة التلقائية (" + DAILY + " كلمة)"
                : "ما قدرتش نترجم هاد الكلمة دابا"));
            const foot = el("div", "wt-foot");
            const link = el("a", "wt-btn", "Google Translate");
            link.href = "https://translate.google.com/?sl=de&tl=ar&op=translate&text="
                + encodeURIComponent(state.tapped);
            link.target = "_blank";
            link.rel = "noopener";
            foot.appendChild(link);
            pop.appendChild(foot);
            return;
        }

        pop.appendChild(el("div", "wt-ar", state.ar));

        if (state.phase === "auto") {
            pop.appendChild(el("div", "wt-note", "ترجمة تلقائية — ممكن تغلط، تأكد من السياق"));
        } else if (state.via && state.via !== "exact") {
            pop.appendChild(el("div", "wt-note", "ف النص: " + state.tapped));
        }

        if (window.DEProgress && current) {
            const foot = el("div", "wt-foot");
            const keep = el("button", "wt-btn");
            keep.type = "button";
            const done = saved(state.de);
            keep.appendChild(icon(done ? "check" : "plus"));
            keep.appendChild(document.createTextNode(done ? "محفوظة ف «الكلمات ديالي»" : "حفظ الكلمة"));
            keep.disabled = done;
            keep.addEventListener("click", function () {
                window.DEProgress.addCustom(state.de, state.ar, current.example || "");
                keep.disabled = true;
                keep.textContent = "";
                keep.appendChild(icon("check"));
                keep.appendChild(document.createTextNode("محفوظة ف «الكلمات ديالي»"));
            });
            foot.appendChild(keep);
            pop.appendChild(foot);
        }
    }

    function place(reveal) {
        if (!pop || pop.hidden || !current) return;
        if (!current.node.isConnected) { close(); return; }

        const r = current.range.getBoundingClientRect();
        if (!r.width && !r.height) { close(); return; }

        const vw = document.documentElement.clientWidth;
        const vh = window.innerHeight;

        /* التيليفون: ورقة ف الأسفل. وإلا كانت الكلمة تحتها، كنطلعوها */
        if (vw <= 560) {
            pop.classList.add("wt-sheet");
            if (reveal) {
                const limit = vh - pop.offsetHeight - 24;
                if (r.bottom > limit) window.scrollBy(0, r.bottom - limit);
            }
            return;
        }

        pop.classList.remove("wt-sheet");
        const w = pop.offsetWidth;
        const h = pop.offsetHeight;
        const left = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), vw - w - 8);
        let top = r.bottom + 10;
        if (top + h > vh - 8) top = Math.max(8, r.top - h - 10);
        pop.style.left = left + "px";
        pop.style.top = top + "px";
    }

    function close() {
        seq++;
        current = null;
        unmark();
        if (pop) pop.hidden = true;
        if (window.speechSynthesis) { try { speechSynthesis.cancel(); } catch (error) { /* */ } }
    }

    function open(hit, block) {
        style();
        if (!pop) {
            pop = el("div", "wt-pop");
            pop.setAttribute("role", "dialog");
            pop.setAttribute("aria-live", "polite");
            pop.hidden = true;
            document.documentElement.appendChild(pop);
        }

        hit.example = sentence(hit, block);
        current = hit;
        mark(hit.range);
        dropHint();

        const mine = ++seq;
        render({ phase: "loading", tapped: hit.word });
        pop.hidden = false;
        place(true);

        lookup(hit.word).then(function (state) {
            if (mine !== seq || !current) return;
            render(state);
            place(false);
        });
    }

    function onClick(event) {
        const target = event.target;
        if (!(target instanceof Element)) return;
        if (document.documentElement.classList.contains("is-embed")) return;
        if (target.closest(".wt-pop")) return;

        const block = !target.closest(SKIP) && target.closest(SCOPE);
        if (!block) { if (current) close(); return; }

        /* الطالب كيختار نص باش ينسخو؟ ما نعطلوش عليه */
        const selection = window.getSelection && window.getSelection();
        if (selection && !selection.isCollapsed && String(selection).trim()) return;

        const hit = wordAt(event.clientX, event.clientY);
        if (!hit || !block.contains(hit.node)) { if (current) close(); return; }
        open(hit, block);
    }

    /* ---------- التنبيه الأول ---------- */

    let hintBox = null;

    function dropHint() {
        if (!hintBox) return;
        hintBox.remove();
        hintBox = null;
    }

    function hint() {
        try { if (localStorage.getItem(HINT_KEY) === "1") return; }
        catch (error) { /* خاص */ }

        style();
        hintBox = el("div", "wt-hint", "اضغط على أي كلمة ألمانية ف النص باش تشوف معناها");
        document.documentElement.appendChild(hintBox);
        setTimeout(dropHint, 7000);
        try { localStorage.setItem(HINT_KEY, "1"); } catch (error) { /* خاص */ }
    }

    /* كنتسناو يبان أول نص (الطالب كيحل موضوع من اللائحة) */
    function watch() {
        const present = function () { return !!document.querySelector(".t1-body"); };
        const start = function () { prepare().catch(function () { /* غير بلا قاموس */ }); hint(); };

        if (present()) { start(); return; }
        if (!window.MutationObserver) return;
        const watcher = new MutationObserver(function () {
            if (!present()) return;
            watcher.disconnect();
            start();
        });
        watcher.observe(document.body, { childList: true, subtree: true });
    }

    document.addEventListener("click", onClick);
    document.addEventListener("keydown", function (event) { if (event.key === "Escape" && current) close(); });
    window.addEventListener("scroll", function () { place(false); }, { passive: true });
    window.addEventListener("resize", function () { place(false); });
    window.addEventListener("popstate", close);

    watch();
})();
