/* ===== 🧠 قصة الربط بالدارجة (Keyword story) — Premium =====

   حدا كل نص ف Lesen (Teil 1 و Teil 3) كاين زر «🧠 قصة». ملي كيبرك عليه
   الطالب كتطلع نافذة: الكلمة المفتاحية ديال العنوان ↔ ديال النص، وقصة
   صغيرة بالدارجة (تخيل هاد المشهد…) باش يعقل على الربط.

   الأدمين بوحدو كيكتب القصص: نفس الزر كيحل ليه فورم (كلمة العنوان، كلمة
   النص، القصة). ماكاينش code ف كل موضوع.

   التخزين (الـ Worker → KV «stories:<doc>»):
     { storiesGet: doc, idToken }                       → Premium ولا الأدمين
     { adminSetStory: { doc, key, h, t, story }, idToken } → الأدمين
   doc  = lesen-b2-<الموضوع>  ·  key = __kwCustom.key(نص)  (الأساسي)

   النسخ المعدلة (المعدل 1، 2…): كتورث القصة ديال نفس النص ف الأساسي.
   ملي الأدمين كيبدلها ف المعدل كتتحفظ ف key ديال النسخة (v<رقم>-<بلاصة>)،
   والأساسي ما كيتقاسش. قصة خاوية ف المعدل = يرجع يورث من الأساسي.

   Hören: قصة وحدة لكل موضوع — attachTheme(container, { doc, id, rows })
   doc = hoeren-b2-teil1 · key = hash(quizId ولا العنوان).
   rows = الجمل اللي جوابها Richtig ({ n, text }): الأدمين كيكتب كلمة مفتاحية لكل
   جملة، والطالب كيشوف «رقم الجملة → الكلمة» ومن تحت القصة.
   الكلمات كيتخزنو ف h و t ديال الـWorker بحال «1=Bundesbank|4=Lehrer»
   (120 حرف لكل واحد، إذن كنعمرو h عاد t).

   غير المشترك: الزر كيبان بقفل 🔒، والبركة كتحل نافذة Premium. */
(function () {
    "use strict";
    if (window.__deStory) return;

    const ENDPOINT = "https://deutsch-einfach-correction.soufianemouyr.workers.dev";
    const docs = {};      /* doc → { map, at } */
    const buttons = [];   /* { btn, doc, key, hint } */

    function el(tag, cls, text) {
        const n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text != null) n.textContent = text;
        return n;
    }
    function isAdmin() {
        if (window.__deIsAdmin === true) return true;
        try { return window.parent !== window && window.parent.__deIsAdmin === true; } catch (e) { return false; }
    }
    function isPremium() { return window.__deutschEinfachIsPremium === true || isAdmin(); }
    function keyOf(text) {
        if (window.__kwCustom && window.__kwCustom.key) return window.__kwCustom.key(text);
        const s = String(text || "").replace(/\s+/g, " ").trim().toLowerCase();
        let h = 0x811c9dc5;
        for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
        const k = "k" + h.toString(36);
        return (window.__deKeyAlias && window.__deKeyAlias[k]) || k;
    }
    function docOf() {
        const lv = /(^|\/)b1-/.test(location.pathname) ? "b1" : "b2";
        const thema = new URLSearchParams(location.search).get("thema") || "";
        if (!thema) return "";
        const id = thema.toLowerCase().indexOf(lv + "-") === 0 ? thema : lv + "-" + thema;
        return ("lesen-" + id).toLowerCase().replace(/[^a-z0-9._-]+/g, "-").slice(0, 120);
    }
    async function token() {
        const auth = window.__deutschEinfachAuth;
        const user = auth && auth.currentUser;
        return user ? user.getIdToken() : "";
    }
    async function call(body) {
        const res = await fetch(ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=UTF-8" },
            body: JSON.stringify(Object.assign({ idToken: await token() }, body))
        });
        const out = await res.json().catch(function () { return {}; });
        if (!res.ok) throw new Error(out.error || ("HTTP " + res.status));
        return out;
    }

    /* القصص ديال الموضوع: مرة وحدة، ومحفوظين ف المتصفح (بلا أنترنت كيبقاو) */
    function load(doc) {
        const d = docs[doc] || (docs[doc] = {});
        if (d.promise) return d.promise;
        const LS = "de-story:" + doc;
        try { const c = JSON.parse(localStorage.getItem(LS) || "null"); if (c && c.map) d.map = c.map; } catch (e) { /* */ }
        d.promise = (async function () {
            if (!isPremium()) return d.map || {};
            try {
                const out = await call({ storiesGet: doc });
                d.map = out.stories || {};
                try { localStorage.setItem(LS, JSON.stringify({ t: Date.now(), map: d.map })); } catch (e) { /* */ }
            } catch (e) { /* بلا أنترنت ولا ماشي مشترك: اللي عندنا */ }
            return d.map || {};
        })();
        return d.promise;
    }

    /* القصة ديال هاد الزر: ديال النسخة، ولا (ف المعدل) الموروثة من الأساسي */
    function find(b) {
        const map = (docs[b.doc] || {}).map || {};
        for (let i = 0; i < b.keys.length; i++) {
            if (map[b.keys[i]]) return { s: map[b.keys[i]], inherited: i === b.keys.length - 1 && i > 0 && b.inherits };
        }
        return { s: null, inherited: false };
    }

    function paintButton(b) {
        if (!b.btn.isConnected) return false;
        const has = !!find(b).s;
        const admin = isAdmin();
        const prem = isPremium();
        /* الزر كيبان ديما. الأدمين: «زيد قصة» إلا ما كايناش.
           الطالب: «قصة» ولا «قريبا» إلا ما زال ما تكتبات. */
        b.btn.hidden = false;
        b.btn.classList.toggle("is-locked", !prem);
        b.btn.classList.toggle("is-empty", admin && !has);
        b.btn.classList.toggle("is-soon", !admin && !has && prem);
        b.btn.innerHTML = "";
        /* بلا emoji (كتبان احترافية): غير قفل SVG لغير المشترك */
        if (!admin && !prem) {
            const ico = el("span", "ks-ico");
            ico.innerHTML = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
            b.btn.append(ico);
        }
        b.btn.append(el("span", "ks-txt", admin ? (has ? "قصة" : "زيد قصة") : (has ? "قصة" : "قصة · قريبا")));
        b.btn.append(el("span", "ks-pro", "PRO"));
        return true;
    }
    function repaint() {
        for (let i = buttons.length - 1; i >= 0; i--) if (!paintButton(buttons[i])) buttons.splice(i, 1);
    }

    /* ---------- النافذة ---------- */
    let modal = null;
    let unguard = null;
    function close() {
        if (unguard) { unguard(); unguard = null; }
        if (modal) { modal.remove(); modal = null; }
    }

    /* ===== حماية القصة (غير ف نافذة الطالب) =====
       بلا تحديد، بلا copie، بلا clic droit، بلا طباعة. الـ capture
       ماكيتمنعش 100% ف المتصفح (خصوصا ف التيليفون) — إذن: القصة كتضبّب
       ملي الصفحة كتفقد الـfocus (أداة capture ف PC) ولا ملي كيتبرك
       PrintScreen. */
    function guard(box) {
        box.classList.add("ks-guard");
        const stop = function (e) { if (box.contains(e.target)) e.preventDefault(); };
        const hide = function () { box.classList.add("is-veiled"); };
        const show = function () { if (document.hasFocus()) box.classList.remove("is-veiled"); };
        const key = function (e) {
            const k = (e.key || "").toLowerCase();
            if (k === "printscreen" || ((e.ctrlKey || e.metaKey) && (k === "c" || k === "p" || k === "s" || k === "a")) ||
                (e.metaKey && e.shiftKey)) {
                e.preventDefault();
                hide();
                if (k === "printscreen") { try { navigator.clipboard.writeText(""); } catch (x) { /* */ } }
                setTimeout(show, 1500);
            }
        };
        const vis = function () { if (document.hidden) hide(); else show(); };
        ["copy", "cut", "contextmenu", "selectstart", "dragstart"].forEach(function (t) { document.addEventListener(t, stop, true); });
        document.addEventListener("keydown", key, true);
        document.addEventListener("keyup", key, true);
        document.addEventListener("visibilitychange", vis);
        window.addEventListener("blur", hide);
        window.addEventListener("focus", show);
        box.addEventListener("click", show);
        return function () {
            ["copy", "cut", "contextmenu", "selectstart", "dragstart"].forEach(function (t) { document.removeEventListener(t, stop, true); });
            document.removeEventListener("keydown", key, true);
            document.removeEventListener("keyup", key, true);
            document.removeEventListener("visibilitychange", vis);
            window.removeEventListener("blur", hide);
            window.removeEventListener("focus", show);
        };
    }

    function shell(title) {
        close();
        modal = el("div", "ks-bg");
        modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
        const box = el("div", "ks-box");
        box.setAttribute("role", "dialog");
        box.setAttribute("aria-modal", "true");
        const head = el("div", "ks-head");
        const ht = el("div", "ks-head-t");
        ht.append(el("small", "", "DEUTSCH EINFACH · KEYWORD STORY"), el("b", "", title));
        const x = el("button", "ks-x", "✕");
        x.type = "button";
        x.setAttribute("aria-label", "سد");
        x.addEventListener("click", close);
        head.append(ht, x);
        const body = el("div", "ks-body");
        box.append(head, body);
        modal.appendChild(box);
        document.body.appendChild(modal);
        document.addEventListener("keydown", function esc(e) {
            if (e.key === "Escape") { close(); document.removeEventListener("keydown", esc); }
        });
        return body;
    }

    /* السميات ديال الكلمتين ف Lesen (العنوان ↔ النص) */
    const LESEN = { h: "العنوان", t: "النص" };

    /* Hören: { رقم الجملة: كلمة } ⇄ h + t */
    function kwDecode(s) {
        const map = {};
        String((s && s.h) || "").concat("|", (s && s.t) || "").split("|").forEach(function (part) {
            const m = /^\s*(\d+)\s*=(.*)$/.exec(part);
            if (m && m[2].trim()) map[m[1]] = m[2].trim();
        });
        return map;
    }
    function kwEncode(pairs) {
        const out = ["", ""];
        let slot = 0;
        pairs.forEach(function (p) {
            const one = p.n + "=" + p.kw.replace(/[|=]/g, " ").trim();
            while (slot < 2 && (out[slot] ? out[slot].length + 1 : 0) + one.length > 120) slot++;
            if (slot > 1) throw new Error("الكلمات طوال بزاف — قصرهم شوية");
            out[slot] = out[slot] ? out[slot] + "|" + one : one;
        });
        return { h: out[0], t: out[1] };
    }
    function kwList(b, map, editable) {
        const list = el("div", "ks-rows");
        const inputs = [];
        b.rows.forEach(function (r) {
            const line = el("div", "ks-r");
            line.append(el("span", "ks-n", String(r.n)));
            if (editable) {
                const box = el("div", "ks-r-in");
                box.append(el("small", "", r.text));
                const inp = document.createElement("input");
                inp.dir = "ltr"; inp.value = map[r.n] || ""; inp.placeholder = "الكلمة المفتاحية";
                box.append(inp);
                line.append(box);
                inputs.push({ n: r.n, inp: inp });
            } else {
                line.append(el("span", "ks-chip", map[r.n] || "—"));
            }
            list.append(line);
        });
        return { list: list, inputs: inputs };
    }

    function showStory(s, b) {
        const labels = LESEN;
        const body = shell("قصة الربط بالدارجة");
        /* كل كلمة فوقها منين جات: العنوان ولا النص */
        function chip(label, word) {
            const box = el("div", "ks-kw");
            box.append(el("small", "", label), el("span", "ks-chip", word || "—"));
            return box;
        }
        let chips = el("div", "ks-chips");
        if (b && b.rows) {
            const map = kwDecode(s);
            chips = b.rows.some(function (r) { return map[r.n]; })
                ? kwList({ rows: b.rows.filter(function (r) { return map[r.n]; }) }, map, false).list
                : el("div");
        } else {
            chips.append(chip("من " + labels.h, s.h), el("i", "ks-link", "↔"), chip("من " + labels.t, s.t));
        }
        const scene = el("div", "ks-scene");
        scene.append(el("small", "", "🎬 تخيل هاد المشهد"), el("p", "", s.story));
        const tip = el("p", "ks-tip", "💡 هادي طريقة باش تربط الكلمات فذاكرتك، ماشي ترجمة حرفية. الجواب خاصو يبقى مبني على معنى النص كامل.");
        body.append(chips, scene, tip);
        /* الأدمين (معاينة «شوف كيف كتبان للطلبة») كيبقى حر */
        if (!isAdmin()) unguard = guard(body.parentNode);
    }

    /* ===== ⌨️ كلافيي عربي (الأدمين يكتب القصة بلا ما يبدل الكلافيي) =====
       كيكتب ف آخر خانة كان فيها (القصة، الكلمة، الترجمة) ف بلاصة الـcurseur. */
    const AR_ROWS = [
        ["ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ج", "د"],
        ["ش", "س", "ي", "ب", "ل", "ا", "ت", "ن", "م", "ك", "ط", "ذ"],
        ["ئ", "ء", "ؤ", "ر", "لا", "ى", "ة", "و", "ز", "ظ", "أ", "إ"],
        ["آ", "ڭ", "ڤ", "پ", "،", "؟", "!", ".", "«", "»", "=", "ـ"]
    ];
    function arabicKeyboard(form) {
        let target = null;
        form.addEventListener("focusin", function (e) {
            if (e.target.matches("input, textarea")) target = e.target;
        });
        const wrap = el("div", "ks-kb");
        const toggle = el("button", "ks-kb-toggle", "⌨️ كلافيي عربي");
        toggle.type = "button";
        const pad = el("div", "ks-kb-pad");
        pad.hidden = true;
        toggle.addEventListener("click", function () {
            pad.hidden = !pad.hidden;
            toggle.classList.toggle("is-on", !pad.hidden);
            if (!target) target = form.querySelector("textarea") || form.querySelector("input");
            if (target) target.focus();
        });
        function insert(text) {
            const t = target || form.querySelector("textarea");
            if (!t) return;
            const a = t.selectionStart == null ? t.value.length : t.selectionStart;
            const z = t.selectionEnd == null ? t.value.length : t.selectionEnd;
            if (text === "⌫") {
                const from = a === z ? Math.max(0, a - 1) : a;
                t.value = t.value.slice(0, from) + t.value.slice(z);
                t.selectionStart = t.selectionEnd = from;
            } else {
                t.value = t.value.slice(0, a) + text + t.value.slice(z);
                t.selectionStart = t.selectionEnd = a + text.length;
            }
            t.dispatchEvent(new Event("input", { bubbles: true }));
            t.focus();
        }
        AR_ROWS.forEach(function (row) {
            const line = el("div", "ks-kb-row");
            row.forEach(function (ch) {
                const k = el("button", "ks-kb-key", ch);
                k.type = "button";
                /* البركة ما تديش الـfocus من الخانة (ف PC والتيليفون) */
                k.addEventListener("mousedown", function (e) { e.preventDefault(); });
                k.addEventListener("click", function () { insert(ch); });
                line.appendChild(k);
            });
            pad.appendChild(line);
        });
        const last = el("div", "ks-kb-row");
        [["⌫", "⌫", "ks-kb-wide"], ["مسافة", " ", "ks-kb-space"], ["↵", "\n", "ks-kb-wide"]].forEach(function (x) {
            const k = el("button", "ks-kb-key " + x[2], x[0]);
            k.type = "button";
            k.addEventListener("mousedown", function (e) { e.preventDefault(); });
            k.addEventListener("click", function () { insert(x[1]); });
            last.appendChild(k);
        });
        pad.appendChild(last);
        wrap.append(toggle, pad);
        return wrap;
    }

    function showEditor(b, s, inherited) {
        const body = shell(s ? "بدّل القصة ✍️" : "زيد قصة ✍️");
        const f = el("form", "ks-form");
        if (inherited) {
            f.appendChild(el("p", "ks-note", "📋 هادي القصة ديال «الأساسي». إلا بدلتيها هنا، كتبدل غير ف هاد النسخة المعدلة — الأساسي كيبقى كيف هو."));
        }
        function field(label, name, value, ph, multi) {
            const l = el("label", "ks-field");
            l.append(el("span", "", label));
            const inp = document.createElement(multi ? "textarea" : "input");
            inp.name = name; inp.value = value || ""; inp.placeholder = ph || "";
            if (multi) inp.rows = 5; else inp.dir = "ltr";
            l.appendChild(inp);
            f.appendChild(l);
            return inp;
        }
        let h = null, t = null, kws = null;
        if (b.rows) {
            /* Hören: الجمل الصحيحة، وقدام كل وحدة الكلمة المفتاحية */
            const head = el("p", "ks-field");
            head.append(el("span", "", b.rows.length ? "الجمل الصحيحة (Richtig) — الكلمة المفتاحية ديال كل وحدة" : "ما لقيناش الأجوبة ديال هاد الموضوع (Richtig) — كتب غير القصة"));
            f.appendChild(head);
            const built = kwList(b, kwDecode(s), true);
            f.appendChild(built.list);
            kws = built.inputs;
        } else {
            h = field("الكلمة المفتاحية ف العنوان", "h", s ? s.h : "", b.hint.head ? "مثلا: " + b.hint.head : "Leistungssport");
            t = field("الكلمة المفتاحية ف النص", "t", s ? s.t : "", "42,2 km · Marathon");
        }
        const story = field(b.inherits ? "القصة بالدارجة (خليها خاوية باش ترجع ديال الأساسي)" : "القصة بالدارجة (خليها خاوية باش تحيدها)",
            "story", s ? s.story : "", "تخيل واحد…", true);
        story.dir = "rtl";
        if (b.hint.head) f.appendChild(el("p", "ks-hint", "العنوان الصحيح: " + b.hint.head));
        const msg = el("p", "ks-msg");
        const save = el("button", "ks-btn ks-main", "حفظ ✓");
        save.type = "submit";
        f.append(arabicKeyboard(f), save, msg);
        f.addEventListener("submit", async function (e) {
            e.preventDefault();
            save.disabled = true; msg.textContent = "كنحفظو…";
            try {
                const ht = kws
                    ? kwEncode(kws.filter(function (k) { return k.inp.value.trim(); }).map(function (k) { return { n: k.n, kw: k.inp.value }; }))
                    : { h: h.value, t: t.value };
                const out = await call({ adminSetStory: { doc: b.doc, key: b.key, h: ht.h, t: ht.t, story: story.value } });
                const d = docs[b.doc] || (docs[b.doc] = {});
                d.map = out.stories || {};
                try { localStorage.setItem("de-story:" + b.doc, JSON.stringify({ t: Date.now(), map: d.map })); } catch (e2) { /* */ }
                repaint();
                close();
            } catch (err) {
                msg.textContent = "ما تحفظش: " + err.message;
                save.disabled = false;
            }
        });
        body.appendChild(f);
        if (s) {
            const view = el("button", "ks-btn", "شوف كيف كتبان للطلبة 👀");
            view.type = "button";
            view.addEventListener("click", function () { showStory(s, b); });
            body.appendChild(view);
        }
    }

    function open(b) {
        const found = find(b);
        const s = found.s;
        if (isAdmin()) { showEditor(b, s, found.inherited); return; }
        if (!isPremium()) {
            if (window.__deLocked) window.__deLocked({ title: "قصة الربط بالدارجة" });
            return;
        }
        if (!s) { showSoon(); return; }
        showStory(s, b);
    }

    /* القصة ما زال ما تكتبات */
    function showSoon() {
        const body = shell("قصة الربط بالدارجة");
        const box = el("div", "ks-soon");
        box.append(el("b", "", "✍️ هاد القصة غادي تكون مكتوبة قريبا"),
            el("p", "", "كنكتبو قصة صغيرة بالدارجة لكل نص باش تعقل على الكلمة المفتاحية. رجع من بعد شوية!"));
        const ok = el("button", "ks-btn ks-main", "واخا 👍");
        ok.type = "button";
        ok.addEventListener("click", close);
        body.append(box, ok);
    }

    function mount(top, b) {
        b.btn.addEventListener("click", function (e) { e.stopPropagation(); open(b); });
        top.appendChild(b.btn);
        buttons.push(b);
        paintButton(b);
        load(b.doc).then(function () { paintButton(b); });
    }

    window.__deStory = {
        /* Hören: قصة وحدة للموضوع. container: فين يتزاد السطر ديال الزر
           info: { doc: "hoeren-b2-teil1", id: quizId ولا العنوان } */
        attachTheme: function (container, info) {
            info = info || {};
            const doc = String(info.doc || "").toLowerCase().replace(/[^a-z0-9._-]+/g, "-").slice(0, 120);
            if (!container || !doc || !info.id || /[?&]embed=1/.test(location.search)) return;
            const row = el("div", "ks-row");
            container.appendChild(row);
            const btn = el("button", "ks-open");
            btn.type = "button";
            btn.hidden = true;
            const key = keyOf(info.id);
            const rows = (info.rows || []).map(function (r) { return { n: r.n, text: String(r.text || "") }; });
            mount(row, { btn: btn, doc: doc, key: key, keys: [key], inherits: false, hint: {}, rows: rows });
        },

        /* top: البلاصة فين كيتزاد الزر · text: النص (للمفتاح) · hint: { head }
           ctx (اختياري): { variant, pos, baseText } — variant > 0 = نسخة معدلة */
        attach: function (top, text, hint, ctx) {
            const doc = docOf();
            if (!top || !doc || /[?&]embed=1/.test(location.search)) return;
            const btn = el("button", "ks-open");
            btn.type = "button";
            btn.hidden = true;
            const own = keyOf(text);
            const b = { btn: btn, doc: doc, key: own, keys: [own], inherits: false, hint: hint || {} };
            if (ctx && ctx.variant > 0) {
                /* المعدل: كنحفظو ف key ديال النسخة؛ كنقراو: ديال النسخة ← القديم (hash ديال النص) ← الأساسي */
                b.key = ("v" + ctx.variant + "-" + String(ctx.pos).toLowerCase().replace(/[^a-z0-9]+/g, "")).slice(0, 64);
                b.keys = [b.key, own];
                if (ctx.baseText) {
                    const base = keyOf(ctx.baseText);
                    if (base !== own) b.keys.push(base);
                    b.inherits = true;
                }
            }
            mount(top, b);
        }
    };

    function reload() {
        Object.keys(docs).forEach(function (k) { docs[k].promise = null; load(k).then(repaint); });
        repaint();
    }
    document.addEventListener("de-admin", reload);
    document.addEventListener("de-premium", reload);
    document.addEventListener("de-premium-state", repaint);

    const css = el("style");
    css.textContent =
        ".ks-open{margin-inline-start:auto;flex:0 0 auto;display:inline-flex;align-items:center;gap:6px;border:0;border-radius:999px;padding:6px 10px 6px 12px;background:linear-gradient(135deg,#1c367a,#265be3);color:#fff;font:800 13px Cairo,system-ui,sans-serif;cursor:pointer;box-shadow:0 6px 14px -8px rgba(38,91,227,.8)}" +
        ".ks-open[hidden]{display:none}" +
        ".ks-row{display:flex;justify-content:flex-end;margin:8px 0}" +
        ".ks-rows{display:flex;flex-direction:column;gap:8px;direction:ltr}" +
        ".ks-r{display:flex;align-items:center;gap:10px}" +
        ".ks-n{flex:0 0 30px;height:30px;border-radius:10px;display:grid;place-items:center;background:#1c367a;color:#fff;font-weight:900;font-size:14px}" +
        ".ks-r-in{flex:1;display:flex;flex-direction:column;gap:4px;min-width:0}" +
        ".ks-r-in small{font-size:12.5px;color:#5b6275;font-weight:600;text-align:left;line-height:1.5}" +
        ".ks-r-in input{font:700 15px Cairo,system-ui,sans-serif;border:1.5px solid #d6deef;border-radius:12px;padding:8px 12px;color:#14204a;background:#fbfcff}" +
        "html[data-theme=dark] .ks-r-in input{background:#1d2439;color:#e8ecf7;border-color:#2b3655}html[data-theme=dark] .ks-r-in small{color:#a9b1c6}" +
        ".ks-open .ks-pro{background:#ffce00;color:#3a2700;border-radius:999px;padding:0 6px;font-size:10px;letter-spacing:.06em}" +
        ".ks-open.is-locked{background:#e9edf7;color:#1c367a;box-shadow:none}" +
        ".ks-open.is-soon{background:#eef2fb;color:#1b46b3;box-shadow:none}" +
        ".ks-soon{text-align:center;background:#f2f6ff;border:1px dashed #9fb5ee;border-radius:18px;padding:22px 18px}.ks-soon b{display:block;font-size:19px;font-weight:900;color:#1b46b3;margin-bottom:8px}.ks-soon p{font-size:15px;font-weight:700;line-height:1.8;color:#3c4766}" +
        ".ks-open.is-empty{background:#fff;color:#1b46b3;border:1.5px dashed #265be3;box-shadow:none}" +
        ".ks-bg{position:fixed;inset:0;z-index:2147483500;background:rgba(10,18,40,.55);display:flex;align-items:center;justify-content:center;padding:16px}" +
        ".ks-box{width:min(560px,100%);max-height:92vh;overflow:auto;background:#fff;border-radius:24px;box-shadow:0 30px 70px -20px rgba(0,0,0,.5);direction:rtl;font-family:Cairo,system-ui,sans-serif;color:#14204a}" +
        ".ks-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:20px 22px;background:linear-gradient(135deg,#152a5e,#265be3);color:#fff;border-radius:24px 24px 0 0}" +
        ".ks-head small{display:block;font-size:11px;letter-spacing:.14em;opacity:.8;direction:ltr;text-align:right;font-weight:700}" +
        ".ks-head b{font-size:21px;font-weight:900}" +
        ".ks-x{flex:0 0 40px;height:40px;border-radius:12px;border:1px solid rgba(255,255,255,.35);background:rgba(255,255,255,.12);color:#fff;font-size:18px;cursor:pointer}" +
        ".ks-body{padding:20px 22px 18px;display:flex;flex-direction:column;gap:14px}" +
        ".ks-chips{display:flex;align-items:flex-end;justify-content:center;gap:12px;flex-wrap:wrap;direction:ltr}" +
        ".ks-kw{display:flex;flex-direction:column;align-items:center;gap:4px}" +
        ".ks-kw small{font-size:12px;font-weight:800;color:#1b46b3}" +
        ".ks-chip{background:#fff3b0;border:1.5px solid #ffce00;border-radius:12px;padding:8px 14px;font-weight:800;font-size:15px}" +
        ".ks-link{font-style:normal;color:#265be3;font-size:20px;font-weight:900;padding-bottom:8px}" +
        ".ks-guard,.ks-guard *{-webkit-user-select:none!important;user-select:none!important;-webkit-touch-callout:none!important}" +
        ".ks-guard{position:relative}.ks-guard .ks-body{position:relative;transition:filter .15s}" +
        ".ks-guard.is-veiled .ks-body{filter:blur(14px)}" +
        "@media print{.ks-bg{display:none!important}}" +
        ".ks-scene{background:#f2f6ff;border:1px solid #dbe5fb;border-radius:18px;padding:14px 18px}" +
        ".ks-scene small{display:block;color:#1b46b3;font-weight:800;margin-bottom:6px}" +
        ".ks-scene p{font-size:17px;font-weight:800;line-height:1.9;white-space:pre-line}" +
        ".ks-tip{font-size:12.5px;color:#7a8299;text-align:center}" +
        ".ks-btn{border:0;border-radius:16px;padding:13px 14px;font:900 15px Cairo,system-ui,sans-serif;cursor:pointer;background:#eef2fb;color:#152a5e}" +
        ".ks-main{background:linear-gradient(135deg,#ffe04d,#f2bc00);color:#3a2700}" +
        ".ks-form{display:flex;flex-direction:column;gap:12px}" +
        ".ks-field{display:flex;flex-direction:column;gap:5px;font-weight:800;font-size:14px}" +
        ".ks-field input,.ks-field textarea{font:600 15px Cairo,system-ui,sans-serif;border:1.5px solid #d6deef;border-radius:12px;padding:10px 12px;color:#14204a;background:#fbfcff}" +
        ".ks-kb{display:flex;flex-direction:column;gap:6px}" +
        ".ks-kb-toggle{align-self:flex-start;border:1px dashed #1c367a;background:transparent;color:#1c367a;border-radius:999px;padding:6px 14px;font:800 13px Cairo,system-ui,sans-serif;cursor:pointer}" +
        ".ks-kb-toggle.is-on{background:#1c367a;color:#fff}" +
        ".ks-kb-pad{display:flex;flex-direction:column;gap:4px;padding:8px;border-radius:14px;background:#eef2fb;direction:rtl}" +
        ".ks-kb-pad[hidden]{display:none}" +
        ".ks-kb-row{display:flex;gap:4px;justify-content:center}" +
        ".ks-kb-key{flex:1 1 0;min-width:0;height:38px;border:1px solid #d6deef;border-radius:9px;background:#fff;color:#14204a;font:700 17px Cairo,system-ui,sans-serif;cursor:pointer;padding:0}" +
        ".ks-kb-key:active{background:#ffe9a0}" +
        ".ks-kb-wide{flex:1.6 1 0;font-size:15px}.ks-kb-space{flex:5 1 0;font-size:13px}" +
        "html[data-theme=dark] .ks-kb-pad{background:#1d2439}html[data-theme=dark] .ks-kb-key{background:#151b2e;color:#e8ecf7;border-color:#2b3655}" +
        "@media (max-width:480px){.ks-kb-key{height:34px;font-size:15px;border-radius:7px}.ks-kb-row{gap:3px}}" +
        ".ks-note{font-size:13px;font-weight:700;color:#7a5a00;background:#fff6d6;border:1px solid #ffe08a;border-radius:12px;padding:8px 12px}" +
        ".ks-hint{font-size:13px;color:#1b46b3;font-weight:700;direction:ltr;text-align:right}" +
        ".ks-msg{font-size:13px;color:#b42318;min-height:1em}" +
        "html[data-theme=dark] .ks-box{background:#151b2e;color:#e8ecf7}html[data-theme=dark] .ks-scene{background:#1d2439;border-color:#2b3655}" +
        "html[data-theme=dark] .ks-btn:not(.ks-main){background:#1d2439;color:#e8ecf7}html[data-theme=dark] .ks-chip{color:#3a2700}html[data-theme=dark] .ks-kw small{color:#9db8ff}" +
        "html[data-theme=dark] .ks-field input,html[data-theme=dark] .ks-field textarea{background:#1d2439;color:#e8ecf7;border-color:#2b3655}";
    document.head.appendChild(css);
})();
