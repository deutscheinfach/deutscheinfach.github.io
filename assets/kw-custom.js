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
    function phrases(id, k) {
        return raw(id, k).filter(function (p) { return p.charAt(0) !== "!"; });
    }
    /* الكلمات الملونة اللي حيدها الأدمين */
    function hidden(id, k) {
        return raw(id, k).filter(function (p) { return p.charAt(0) === "!"; }).map(function (p) { return p.slice(1); });
    }
    function norm(w) { return String(w || "").replace(/\s+/g, " ").trim().toLowerCase(); }

    /* كنرجعو الكلمات المحيدة نص عادي (من بعد ما كيلون الـengine) */
    function unmark(nodes, list) {
        if (!list.length) return;
        const want = list.map(norm);
        nodes.forEach(function (n) {
            if (!n || !n.querySelectorAll) return;
            Array.prototype.forEach.call(n.querySelectorAll("mark.kw"), function (m) {
                if (want.indexOf(norm(m.textContent)) === -1) return;
                const parent = m.parentNode;
                parent.replaceChild(document.createTextNode(m.textContent), m);
                parent.normalize();
            });
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
    document.addEventListener("selectionchange", function () {
        const sel = window.getSelection && window.getSelection();
        const text = sel ? String(sel).replace(/\s+/g, " ").trim() : "";
        if (text) lastSel = { text: text, node: sel.anchorNode, at: Date.now() };
    });
    function selection() {
        const sel = window.getSelection && window.getSelection();
        const text = sel ? String(sel).replace(/\s+/g, " ").trim() : "";
        if (text) return { text: text, node: sel.anchorNode };
        if (lastSel && Date.now() - lastSel.at < 60000) return lastSel;
        return null;
    }

    /* الأدمين كيبرك على كلمة ملونة ف النص → كيحيدها */
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
        if (!confirm("نحيدو «" + word + "» من الكلمات الملونة؟\n(كتبان عادية لكاع الطلبة — تقدر ترجعها من ↩)")) return;
        try {
            if (phrases(id, k).some(function (p) { return norm(p) === norm(word); })) {
                const own = phrases(id, k).filter(function (p) { return norm(p) === norm(word); });
                for (let i = 0; i < own.length; i++) await save(id, k, own[i], false);
            }
            await save(id, k, "!" + word, true);
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
        /* الكلمات المحيدة: لكاع الناس */
        const scope = (typeof opts.scope === "function" ? opts.scope() : opts.scope) || [];
        unmark(scope.concat([box]), hidden(opts.doc, opts.key));
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

        phrases(opts.doc, opts.key).forEach(function (phrase) {
            const chip = document.createElement("span");
            chip.className = "kw-admin-chip";
            chip.dir = "ltr";
            chip.appendChild(document.createTextNode(phrase));
            const x = document.createElement("button");
            x.type = "button";
            x.title = "حيد";
            x.setAttribute("aria-label", "حيد " + phrase);
            x.textContent = "✕";
            x.addEventListener("click", async function () {
                if (!confirm("نحيدو «" + phrase + "» من الكلمات المفتاحية؟")) return;
                x.disabled = true;
                try { await save(opts.doc, opts.key, phrase, false); }
                catch (error) { say("ما تحيداتش: " + (error.code || error.message), true); x.disabled = false; }
            });
            chip.appendChild(x);
            bar.appendChild(chip);
        });

        /* المحيدين: ↩ كترجعها ملونة */
        hidden(opts.doc, opts.key).forEach(function (word) {
            const chip = document.createElement("span");
            chip.className = "kw-admin-chip is-off";
            chip.dir = "ltr";
            chip.title = "محيدة";
            chip.appendChild(document.createTextNode(word));
            const back = document.createElement("button");
            back.type = "button";
            back.title = "رجعها ملونة";
            back.setAttribute("aria-label", "رجع " + word);
            back.textContent = "↩";
            back.addEventListener("click", async function () {
                back.disabled = true;
                try { await save(opts.doc, opts.key, "!" + word, false); }
                catch (error) { say("ما رجعاتش: " + (error.code || error.message), true); back.disabled = false; }
            });
            chip.appendChild(back);
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
            const scope = (typeof opts.scope === "function" ? opts.scope() : opts.scope) || [];
            const node = sel.node && sel.node.nodeType === 3 ? sel.node.parentNode : sel.node;
            const inside = scope.some(function (n) { return n && node && n.contains(node); });
            if (!inside) { say("الكلمة اللي حددتي ماشي من هاد النص ولا الجواب ديالو.", true); return; }
            const phrase = sel.text.replace(/^[^\wÄÖÜäöüß0-9]+|[^\wÄÖÜäöüß0-9]+$/g, "");
            if (!phrase) { say("حدد كلمة.", true); return; }
            if (phrase.length > MAX) { say("طويلة بزاف — حدد كلمة ولا جملة قصيرة (" + MAX + " حرف).", true); return; }
            if (phrases(opts.doc, opts.key).indexOf(phrase) !== -1) { say("«" + phrase + "» ديجا كاينة.", true); return; }
            add.disabled = true;
            say("كنسجلو…", false);
            try {
                /* كانت محيدة؟ نرجعوها */
                const off = hidden(opts.doc, opts.key).filter(function (w) { return norm(w) === norm(phrase); });
                for (let i = 0; i < off.length; i++) await save(opts.doc, opts.key, "!" + off[i], false);
                await save(opts.doc, opts.key, phrase, true);
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
        tip.textContent = "💡 برك على أي كلمة ملونة ف النص باش تحيدها.";
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
