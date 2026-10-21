/* ===== الكلمات المفتاحية اللي كيزيدهم الأدمين من الموقع =====

   الخوارزمية كتلون الكلمات المشتركين بين النص والجواب. ملي ما كتلقاش
   (مرادف: Pkw ↔ Auto)، الأدمين كيحدد الكلمة ف النص وكيبرك «زيد» —
   كتسجل ف Firestore وكتبان لكاع الطلبة.

   التخزين:  keywords/{doc} = { items: { <key>: ["كلمة", …] }, updatedAt }
     doc:  lesen-b2-<id الموضوع>  ·  hoeren-b2-teil1 (صفحة Hören كاملة)
     key:  hash ديال النص اللي كتخصو الكلمات (النص، السؤال، الوضعية،
           الجملة) — كيبقى صحيح حتى إلا تبدل الترتيب ولا النسخة.
     «!كلمة» ف نفس اللائحة = كلمة ملونة (حتى الأوتوماتيكية) حيدها الأدمين:
           كتبان عادية لكاع الطلبة. الأدمين كيبرك عليها ف النص باش يحيدها.
     «كلمة#kNODE:2» = غير هاد البلاصة: النص اللي فيه (hash ديالو) والمرة
           الشحال (0، 1، 2…) اللي كتجي فيها الكلمة ف داك النص. بلا #… = كل
           المرات (القديم). نفس الشي لـ«!كلمة#kNODE:2».

   القراية: وثيقة وحدة لكل موضوع، محفوظة ف المتصفح 30 دقيقة (الخطة
   المجانية ديال Firestore). الأدمين ديما كيقرا الجديد.

   الاستعمال (lesen-engine.js و hoeren-keys.js):
     __kwCustom.key(text)              → key
     __kwCustom.phrases(doc, key)      → ["…"] (من الذاكرة، بلا انتظار)
     __kwCustom.load(doc)              → Promise (كيجيب من Firestore)
     __kwCustom.tools(box, opts)       → أزرار الأدمين تحت النص
     document "de-kw-change" {doc}     → تبدلات، عاود لون */
(function () {
    "use strict";

    if (window.__kwCustom) return;

    const TTL = 30 * 60 * 1000;
    const CACHE = "de-kw:";
    const MAX = 80;
    const docs = {};

    function store() {
        try { return window.localStorage; } catch (error) { return null; }
    }
    function cacheGet(id) {
        try {
            const v = JSON.parse(store().getItem(CACHE + id) || "null");
            return v && v.items && Date.now() - v.t < TTL ? v.items : null;
        } catch (error) { return null; }
    }
    function cacheSet(id, items) {
        try { store().setItem(CACHE + id, JSON.stringify({ t: Date.now(), items: items })); } catch (error) { /* */ }
    }

    /* داخل «اختبر نفسك» (iframe): Firebase ديال الصفحة الأم */
    function firebase() {
        if (window.__deFirebase) return window.__deFirebase;
        try { return window.parent !== window ? window.parent.__deFirebase || null : null; } catch (e) { return null; }
    }
    function isAdmin() {
        if (window.__deIsAdmin === true) return true;
        try { return window.parent !== window && window.parent.__deIsAdmin === true; } catch (e) { return false; }
    }
    function waitFirebase(ms) {
        return new Promise(function (done) {
            const end = Date.now() + ms;
            (function poll() {
                const fb = firebase();
                if (fb || Date.now() > end) return done(fb);
                setTimeout(poll, 250);
            })();
        });
    }

    /* FNV-1a على النص بلا فراغات زايدين */
    function key(text) {
        const s = String(text || "").replace(/\s+/g, " ").trim().toLowerCase();
        let h = 0x811c9dc5;
        for (let i = 0; i < s.length; i++) {
            h ^= s.charCodeAt(i);
            h = Math.imul(h, 0x01000193) >>> 0;
        }
        return "k" + h.toString(36);
    }

    function entry(id) {
        if (!docs[id]) docs[id] = { items: cacheGet(id), fresh: false, job: null };
        return docs[id];
    }

    function raw(id, k) {
        const d = entry(id);
        const list = d.items && d.items[k];
        return Array.isArray(list) ? list : [];
    }
    const SPEC = /#(k[0-9a-z]+):(\d+)$/;
    function parse(r) {
        const off = r.charAt(0) === "!";
        let word = off ? r.slice(1) : r;
        const m = SPEC.exec(word);
        if (m) word = word.slice(0, m.index);
        return { raw: r, off: off, word: word, node: m ? m[1] : "", n: m ? +m[2] : -1 };
    }
    function entries(id, k) { return raw(id, k).map(parse); }
    /* الكلمات اللي كيلونهم الـengine (من بعد refine كيخلي غير البلاصة المختارة) */
    function phrases(id, k) {
        const out = [];
        entries(id, k).forEach(function (e) { if (!e.off && out.indexOf(e.word) === -1) out.push(e.word); });
        return out;
    }
    /* المحيدين ف كل البلايص (القديم، بلا #…) */
    function hidden(id, k) {
        return entries(id, k).filter(function (e) { return e.off && !e.node; }).map(function (e) { return e.word; });
    }
    function norm(w) { return String(w || "").replace(/\s+/g, " ").trim().toLowerCase(); }

    /* شحال من مرة جات الكلمة ف node قبل البلاصة (container, offset) ولا قبل عنصر */
    function occ(node, word, before) {
        const r = document.createRange();
        r.setStart(node, 0);
        if (before.nodeType === 1 && before !== node) r.setEndBefore(before);
        else r.setEnd(before.container, before.offset);
        const text = r.toString().toLowerCase(), want = norm(word);
        if (!want) return 0;
        let n = 0, at = text.indexOf(want);
        while (at !== -1) { n++; at = text.indexOf(want, at + want.length); }
        return n;
    }
    function unwrap(m) {
        const parent = m.parentNode;
        parent.replaceChild(document.createTextNode(m.textContent), m);
        parent.normalize();
    }

    /* من بعد ما كيلون الـengine: كنحيدو المحيدين، والكلمات اللي تختارت
       ف بلاصة وحدة كيبقاو غير ف ديك البلاصة */
    function refine(id, k, nodes) {
        const list = entries(id, k);
        if (!list.length) return;
        const offs = list.filter(function (e) { return e.off; });
        const pins = list.filter(function (e) { return !e.off && e.node; });
        const plain = list.filter(function (e) { return !e.off && !e.node; }).map(function (e) { return norm(e.word); });
        nodes.forEach(function (node) {
            if (!node || !node.querySelectorAll) return;
            const nk = key(node.textContent);
            const drop = [];
            Array.prototype.forEach.call(node.querySelectorAll("mark.kw"), function (m) {
                const w = norm(m.textContent);
                const i = occ(node, w, m);
                const off = offs.some(function (e) { return norm(e.word) === w && (!e.node || (e.node === nk && e.n === i)); });
                const mine = pins.filter(function (e) { return norm(e.word) === w; });
                const here = mine.some(function (e) { return e.node === nk && e.n === i; });
                if (off || (mine.length && !here && plain.indexOf(w) === -1)) drop.push(m);
            });
            drop.forEach(unwrap);
        });
    }

    function loaded(id) {
        const d = entry(id);
        return d.fresh || (!!d.items && !isAdmin());
    }

    function load(id) {
        const d = entry(id);
        if (loaded(id)) return Promise.resolve(d.items || {});
        if (d.job) return d.job;
        d.job = waitFirebase(10000).then(function (fb) {
            if (!fb) return null;
            return fb.fs.getDoc(fb.fs.doc(fb.db, "keywords", id));
        }).then(function (snap) {
            if (snap === null) { d.items = d.items || {}; return d.items; }
            d.items = snap.exists() ? (snap.data().items || {}) : {};
            d.fresh = true;
            cacheSet(id, d.items);
            return d.items;
        }).catch(function (error) {
            console.warn("Keywords: ما قدرناش نجيبو", id, error && (error.code || error.message));
            d.items = d.items || {};
            return d.items;
        }).finally(function () { d.job = null; });
        return d.job;
    }

    function changed(id) {
        document.dispatchEvent(new CustomEvent("de-kw-change", { detail: { doc: id } }));
    }

    async function save(id, k, phrase, add) {
        const fb = firebase();
        if (!fb || !isAdmin()) throw new Error("ماشي أدمين");
        const fs = fb.fs;
        const op = add ? fs.arrayUnion(phrase) : fs.arrayRemove(phrase);
        const items = {};
        items[k] = op;
        await fs.setDoc(fs.doc(fb.db, "keywords", id),
            { items: items, updatedAt: fs.serverTimestamp() }, { merge: true });
        const d = entry(id);
        d.items = d.items || {};
        const list = (d.items[k] || []).filter(function (p) { return p !== phrase; });
        if (add) list.push(phrase);
        if (list.length) d.items[k] = list; else delete d.items[k];
        cacheSet(id, d.items);
        changed(id);
    }

    /* ===== التحديد =====
       ف التيليفون، البركة على الزر كتمسح التحديد قبل ما يوصل الحدث.
       إذن كنحفظو آخر تحديد ماشي خاوي. */
    let lastSel = null;
    function grab(sel) {
        const text = sel ? String(sel).replace(/\s+/g, " ").trim() : "";
        if (!text) return null;
        const r = sel.rangeCount ? sel.getRangeAt(0) : null;
        return { text: text, node: sel.anchorNode, range: r ? r.cloneRange() : null, at: Date.now() };
    }
    document.addEventListener("selectionchange", function () {
        const got = grab(window.getSelection && window.getSelection());
        if (got) lastSel = got;
    });
    function selection() {
        const got = grab(window.getSelection && window.getSelection());
        if (got) return got;
        if (lastSel && Date.now() - lastSel.at < 60000) return lastSel;
        return null;
    }
    function scopeOf(opts) { return (typeof opts.scope === "function" ? opts.scope() : opts.scope) || []; }

    /* الأدمين كيبرك على كلمة ملونة ف النص → كتحيد غير هادي (ماشي كاع المرات) */
    const boxes = [];   /* { box, opts } */
    document.addEventListener("click", async function (event) {
        if (!isAdmin()) return;
        const mark = event.target.closest && event.target.closest("mark.kw");
        if (!mark) return;
        const sel = window.getSelection && window.getSelection();
        if (sel && String(sel).trim()) return;   /* كيحدد باش يزيد، ماشي باش يحيد */
        const hit = boxes.filter(function (b) { return b.box.isConnected && b.box.contains(mark); }).pop();
        if (!hit) return;
        const word = mark.textContent.trim();
        if (!word) return;
        event.preventDefault();
        event.stopPropagation();
        const k = hit.opts.key, id = hit.opts.doc;
        if (!confirm("نحيدو «" + word + "» من هاد البلاصة؟\n(غير هادي — تقدر ترجعها من ↩)")) return;
        try {
            const node = scopeOf(hit.opts).filter(function (n) { return n && n.contains(mark); })[0];
            if (!node) { await save(id, k, "!" + word, true); return; }
            const nk = key(node.textContent), i = occ(node, word, mark);
            const pin = entries(id, k).filter(function (e) { return !e.off && e.node === nk && e.n === i && norm(e.word) === norm(word); })[0];
            if (pin) await save(id, k, pin.raw, false);
            else await save(id, k, "!" + word + "#" + nk + ":" + i, true);
        } catch (error) {
            alert("ما تحيداتش: " + (error.code || error.message));
        }
    }, true);

    /* ===== أزرار الأدمين =====
       opts = { doc, key, scope: () => [عناصر فين يقدر يحدد], title } */
    function tools(box, opts) {
        if (!box || !opts || !opts.doc || !opts.key) return;
        Array.prototype.forEach.call(box.querySelectorAll(".kw-admin"), function (old) {
            if (old.dataset.key === opts.key) old.remove();
        });
        /* المحيدين والبلايص المختارة: لكاع الناس */
        const scope = scopeOf(opts);
        refine(opts.doc, opts.key, scope.length ? scope : [box]);
        if (!isAdmin()) return;
        css();
        for (let i = boxes.length - 1; i >= 0; i--) {
            if (!boxes[i].box.isConnected || (boxes[i].box === box && boxes[i].opts.key === opts.key)) boxes.splice(i, 1);
        }
        boxes.push({ box: box, opts: opts });

        const bar = document.createElement("div");
        bar.className = "kw-admin";
        bar.dataset.key = opts.key;
        bar.dir = "rtl";

        const label = document.createElement("span");
        label.className = "kw-admin-label";
        label.textContent = "✏️ " + (opts.title || "كلمات مفتاحية") + ":";
        bar.appendChild(label);

        entries(opts.doc, opts.key).forEach(function (e) {
            const chip = document.createElement("span");
            chip.className = "kw-admin-chip" + (e.off ? " is-off" : "");
            chip.dir = "ltr";
            chip.title = e.off ? "محيدة" : (e.node ? "غير ف هاد البلاصة" : "ف كل البلايص");
            chip.appendChild(document.createTextNode(e.word));
            const x = document.createElement("button");
            x.type = "button";
            x.title = e.off ? "رجعها ملونة" : "حيد";
            x.setAttribute("aria-label", (e.off ? "رجع " : "حيد ") + e.word);
            x.textContent = e.off ? "↩" : "✕";
            x.addEventListener("click", async function () {
                if (!e.off && !confirm("نحيدو «" + e.word + "» من الكلمات المفتاحية؟")) return;
                x.disabled = true;
                try { await save(opts.doc, opts.key, e.raw, false); }
                catch (error) { say("ما تبدلاتش: " + (error.code || error.message), true); x.disabled = false; }
            });
            chip.appendChild(x);
            bar.appendChild(chip);
        });

        const add = document.createElement("button");
        add.type = "button";
        add.className = "kw-admin-add";
        add.textContent = "➕ زيد الكلمة اللي حددتي";
        /* ف PC: البركة ما تمسحش التحديد */
        add.addEventListener("mousedown", function (event) { event.preventDefault(); });
        add.addEventListener("click", async function () {
            const sel = selection();
            if (!sel) { say("حدد (selectionner) كلمة ولا جملة ف النص، ومن بعد برك هنا.", true); return; }
            const scope = scopeOf(opts);
            const node = sel.node && sel.node.nodeType === 3 ? sel.node.parentNode : sel.node;
            const owner = scope.filter(function (n) { return n && node && n.contains(node); })[0];
            if (!owner) { say("الكلمة اللي حددتي ماشي من هاد النص ولا الجواب ديالو.", true); return; }
            const phrase = sel.text.replace(/^[^\wÄÖÜäöüß0-9]+|[^\wÄÖÜäöüß0-9]+$/g, "");
            if (!phrase) { say("حدد كلمة.", true); return; }
            if (phrase.length > MAX) { say("طويلة بزاف — حدد كلمة ولا جملة قصيرة (" + MAX + " حرف).", true); return; }
            /* غير البلاصة اللي تحددات: النص ديالها + شحال من مرة جات الكلمة قبلها */
            const nk = key(owner.textContent);
            const i = sel.range ? occ(owner, phrase, { container: sel.range.startContainer, offset: sel.range.startOffset }) : 0;
            const rawNew = phrase + "#" + nk + ":" + i;
            if (raw(opts.doc, opts.key).indexOf(rawNew) !== -1) { say("«" + phrase + "» ديجا كاينة هنا.", true); return; }
            add.disabled = true;
            say("كنسجلو…", false);
            try {
                /* كانت محيدة (ف كل البلايص ولا ف هادي)؟ نرجعوها */
                const off = entries(opts.doc, opts.key).filter(function (e) {
                    return e.off && norm(e.word) === norm(phrase) && (!e.node || (e.node === nk && e.n === i));
                });
                for (let j = 0; j < off.length; j++) await save(opts.doc, opts.key, off[j].raw, false);
                await save(opts.doc, opts.key, rawNew, true);
                try { window.getSelection().removeAllRanges(); } catch (e) { /* */ }
                lastSel = null;
            } catch (error) {
                add.disabled = false;
                say("ما تسجلاتش: " + (error.code || error.message)
                    + (error.code === "permission-denied" ? " — واش زدتي القاعدة ديال keywords ف Firestore؟" : ""), true);
            }
        });
        bar.appendChild(add);

        const tip = document.createElement("span");
        tip.className = "kw-admin-tip";
        tip.textContent = "💡 الكلمة اللي كتزيد كتتلون غير ف البلاصة اللي حددتي. برك على أي كلمة ملونة ف النص باش تحيد غير هادي.";
        bar.appendChild(tip);

        const note = document.createElement("span");
        note.className = "kw-admin-note";
        bar.appendChild(note);
        function say(text, bad) {
            note.textContent = text;
            note.classList.toggle("is-bad", !!bad);
        }

        box.appendChild(bar);
    }

    let styled = false;
    function css() {
        if (styled) return;
        styled = true;
        const style = document.createElement("style");
        style.textContent =
            ".kw-admin{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:10px 0 0;padding:8px 10px;" +
            "border:1.5px dashed #e0a800;border-radius:12px;background:rgba(255,206,0,.08);font-size:13px;line-height:1.5}" +
            ".kw-admin-label{font-weight:800;color:inherit;opacity:.85}" +
            ".kw-admin-chip{display:inline-flex;align-items:center;gap:4px;padding:2px 4px 2px 9px;border-radius:999px;" +
            "background:#fff3a6;color:#3a2a00;border:1px solid #f2c200;font-weight:700}" +
            ".kw-admin-chip button{border:0;background:transparent;color:#8a5a00;cursor:pointer;font:inherit;font-size:12px;padding:0 4px;line-height:1}" +
            ".kw-admin-add{border:0;border-radius:999px;padding:5px 12px;background:#e0a800;color:#1a1300;font:inherit;font-weight:800;cursor:pointer}" +
            ".kw-admin-add:disabled{opacity:.6;cursor:default}" +
            ".kw-admin-chip.is-off{background:transparent;color:#8a8f9c;border-style:dashed;text-decoration:line-through}" +
            ".kw-admin-chip.is-off button{text-decoration:none;color:#1c367a;font-weight:900}" +
            ".kw-admin-tip{flex-basis:100%;font-size:12px;opacity:.75}" +
            "[data-kw-box] mark.kw,.nq-question mark.kw{cursor:pointer}" +
            ".kw-admin-note{flex-basis:100%;font-size:12.5px;opacity:.8}.kw-admin-note:empty{display:none}" +
            ".kw-admin-note.is-bad{color:#c0392b;opacity:1;font-weight:700}" +
            ".t3-sit-kw .kw-admin{margin:4px 0 8px;font-size:12.5px}" +
            ":root[data-theme=dark] .kw-admin-chip,html.dark .kw-admin-chip{background:rgba(255,206,0,.25);color:#ffe9a8;border-color:#a88400}";
        document.head.appendChild(style);
    }

    window.__kwCustom = {
        key: key,
        phrases: phrases,
        loaded: loaded,
        load: load,
        tools: tools,
        hidden: hidden,
        isAdmin: isAdmin
    };
})();
