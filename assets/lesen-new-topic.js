/* ===== ➕ الأدمين كيزيد موضوع Lesen من الموقع (Teil 1) =====

   ف لائحة Teil 1 كتبان للأدمين بطاقة «+». كتحل فورم بنفس الشكل
   ديال الموضوع: العنوان، 10 ديال العناوين (A–J) و5 نصوص، ولكل نص
   الجواب الصحيح. الحفظ كيمشي للـWorker (adminSaveTopic) → KV، والموضوع
   كيبان ف اللائحة (Premium) بلا ما نبدلو حتى ملف.

   window.__lesenNewTopic.open({ level, part, onSaved(entry) })
   window.__lesenNewTopic.list(level) → Promise([{ id, title, ar, parts, locked }]) */
(function () {
    "use strict";
    if (window.__lesenNewTopic) return;

    const ENDPOINT = "https://deutsch-einfach-correction.soufianemouyr.workers.dev";
    const KEYS = "ABCDEFGHIJ";
    const INTRO = "Lesen Sie die fünf Texte und die zehn Überschriften. Entscheiden Sie, welche Überschrift am besten zu welchem Text passt. Jede Überschrift können Sie nur einmal verwenden.";

    function el(tag, cls, text) {
        const n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text != null) n.textContent = text;
        return n;
    }

    const lists = {};
    function list(level) {
        if (!lists[level]) {
            lists[level] = fetch(ENDPOINT + "?lesenlist=" + level, { credentials: "omit" })
                .then(function (r) { return r.ok ? r.json() : []; })
                .then(function (d) { return Array.isArray(d) ? d : []; })
                .catch(function () { delete lists[level]; return []; });
        }
        return lists[level];
    }

    let styled = false;
    function css() {
        if (styled) return;
        styled = true;
        const s = el("style");
        s.textContent =
            ".lesen-card.nt-add{display:flex;align-items:center;justify-content:center;flex-direction:column;gap:6px;min-height:120px;border:2px dashed #b9c3dd;background:transparent;box-shadow:none;cursor:pointer;color:#1c367a;font:800 14px Cairo,system-ui,sans-serif}" +
            ".lesen-card.nt-add:hover{border-color:#1c367a;background:rgba(28,54,122,.04)}" +
            ".nt-plus{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:#1c367a;color:#fff;font-size:26px;line-height:1}" +
            ".nt-bg{position:fixed;inset:0;z-index:2147483500;background:rgba(10,18,40,.55);overflow:auto;padding:24px 12px}" +
            ".nt-box{max-width:1100px;margin:0 auto;background:#f5f6fa;border-radius:22px;padding:18px;font-family:Cairo,system-ui,sans-serif;color:#161a2b;box-shadow:0 30px 70px -20px rgba(0,0,0,.5)}" +
            ".nt-top{display:flex;align-items:center;justify-content:space-between;gap:10px;direction:rtl;margin-bottom:12px}.nt-top b{font-size:18px}" +
            ".nt-x{border:0;background:#fff;border-radius:10px;width:36px;height:36px;cursor:pointer;font-size:16px}" +
            ".nt-titles{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px}" +
            ".nt-box input,.nt-box textarea,.nt-box select{font:600 14px/1.6 system-ui,sans-serif;border:1.5px solid #d6deef;border-radius:12px;padding:9px 11px;color:#161a2b;background:#fff;width:100%;box-sizing:border-box}" +
            ".nt-box textarea{min-height:130px;resize:vertical}" +
            ".nt-box [dir=rtl]{text-align:right}" +
            ".nt-grid{display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:16px;align-items:start}" +
            "@media (max-width:900px){.nt-grid{grid-template-columns:1fr}.nt-titles{grid-template-columns:1fr}}" +
            ".nt-col{display:flex;flex-direction:column;gap:12px}" +
            ".nt-card{background:#fff;border:1px solid #e3e6ee;border-radius:16px;padding:12px;display:flex;flex-direction:column;gap:8px}" +
            ".nt-card-head{display:flex;align-items:center;gap:8px}" +
            ".nt-num{flex:0 0 30px;height:30px;border-radius:10px;display:grid;place-items:center;border:1px solid #e3e6ee;font-weight:800}" +
            ".nt-card-head select{flex:1}" +
            ".nt-opt{display:flex;gap:8px;align-items:center}.nt-opt .nt-num{background:#f7f8fb}" +
            ".nt-small{font-size:12.5px!important;padding:6px 9px!important;color:#5b6275!important}" +
            ".nt-foot{display:flex;align-items:center;gap:12px;margin-top:14px;direction:rtl;flex-wrap:wrap}" +
            ".nt-save{border:0;border-radius:14px;padding:12px 22px;font:900 15px Cairo,system-ui,sans-serif;cursor:pointer;background:linear-gradient(135deg,#ffe04d,#f2bc00);color:#3a2700}" +
            ".nt-msg{font-size:13.5px;font-weight:700;color:#5b6275}.nt-msg.is-bad{color:#b42318}" +
            ".nt-label{font-size:12.5px;font-weight:800;color:#5b6275;direction:rtl}";
        document.head.appendChild(s);
    }

    function addCard(onClick) {
        css();
        const node = el("button", "lesen-card nt-add");
        node.type = "button";
        node.append(el("span", "nt-plus", "+"), el("span", "", "زيد موضوع جديد"));
        node.addEventListener("click", onClick);
        return node;
    }

    function open(opts) {
        css();
        const level = opts.level;
        const bg = el("div", "nt-bg");
        const box = el("div", "nt-box");
        const top = el("div", "nt-top");
        const x = el("button", "nt-x", "✕");
        x.type = "button";
        top.append(el("b", "", "موضوع جديد — Lesen Teil 1 · " + level.toUpperCase()), x);

        const titles = el("div", "nt-titles");
        const title = el("input");
        title.placeholder = "اسم الموضوع (Titel)";
        title.dir = "ltr";
        const ar = el("input");
        ar.placeholder = "الاسم بالعربية (اختياري)";
        ar.dir = "rtl";
        titles.append(title, ar);

        const grid = el("div", "nt-grid");
        const texts = el("div", "nt-col");
        const heads = el("div", "nt-col");
        grid.append(texts, heads);

        const textRows = [];
        for (let i = 0; i < 5; i++) {
            const card = el("div", "nt-card");
            const head = el("div", "nt-card-head");
            const pick = el("select");
            pick.appendChild(new Option("— الجواب الصحيح (Überschrift) —", ""));
            for (let k = 0; k < KEYS.length; k++) pick.appendChild(new Option(KEYS[k], KEYS[k]));
            head.append(el("span", "nt-num", String(i + 1)), pick);
            const body = el("textarea");
            body.placeholder = "Text " + (i + 1);
            body.dir = "ltr";
            const sum = el("input", "nt-small");
            sum.placeholder = "ملخص النص بالعربية (اختياري)";
            sum.dir = "rtl";
            card.append(head, body, sum);
            texts.appendChild(card);
            textRows.push({ pick: pick, body: body, sum: sum });
        }

        const headCard = el("div", "nt-card");
        headCard.appendChild(el("span", "nt-label", "ÜBERSCHRIFTEN — العناوين (A–J)"));
        const optRows = [];
        for (let k = 0; k < KEYS.length; k++) {
            const row = el("div", "nt-opt");
            const inp = el("input");
            inp.placeholder = "Überschrift " + KEYS[k];
            inp.dir = "ltr";
            const tr = el("input", "nt-small");
            tr.placeholder = "بالعربية (اختياري)";
            tr.dir = "rtl";
            const wrap = el("div", "nt-col");
            wrap.style.gap = "4px";
            wrap.style.flex = "1";
            wrap.append(inp, tr);
            row.append(el("span", "nt-num", KEYS[k]), wrap);
            headCard.appendChild(row);
            optRows.push({ text: inp, ar: tr });
        }
        heads.appendChild(headCard);

        const foot = el("div", "nt-foot");
        const save = el("button", "nt-save", "حفظ الموضوع ✓");
        save.type = "button";
        const msg = el("span", "nt-msg", "عمّر كلشي ومن بعد حفظ. الموضوع كيبان ف اللائحة (Premium).");
        foot.append(save, msg);

        box.append(top, titles, grid, foot);
        bg.appendChild(box);
        document.body.appendChild(bg);
        document.documentElement.style.overflow = "hidden";
        title.focus();

        function close() { bg.remove(); document.documentElement.style.overflow = ""; }
        x.addEventListener("click", close);
        function bad(text) { msg.className = "nt-msg is-bad"; msg.textContent = text; }

        save.addEventListener("click", async function () {
            if (!title.value.trim()) return bad("كتب اسم الموضوع.");
            const options = optRows.map(function (r, k) {
                const o = { value: KEYS[k], text: r.text.value.trim() };
                if (r.ar.value.trim()) o.ar = r.ar.value.trim();
                return o;
            });
            if (options.some(function (o) { return !o.text; })) return bad("عمّر العناوين العشرة (A–J).");
            const used = {};
            const list5 = [];
            for (let i = 0; i < textRows.length; i++) {
                const r = textRows[i];
                if (!r.body.value.trim()) return bad("عمّر النص " + (i + 1) + ".");
                if (!r.pick.value) return bad("ختار الجواب ديال النص " + (i + 1) + ".");
                if (used[r.pick.value]) return bad("العنوان " + r.pick.value + " مختار لجوج نصوص.");
                used[r.pick.value] = true;
                const t = { answer: r.pick.value, body: r.body.value.trim() };
                if (r.sum.value.trim()) t.ar = r.sum.value.trim();
                list5.push(t);
            }
            const data = { title: title.value.trim(), kind: "matching",
                variants: [{ label: "الأساسي", intro: INTRO, options: options, texts: list5 }] };
            save.disabled = true;
            msg.className = "nt-msg";
            msg.textContent = "كنحفظو…";
            try {
                const auth = window.__deutschEinfachAuth;
                const user = auth && auth.currentUser;
                if (!user) throw new Error("ماشي داخل بحساب");
                const res = await fetch(ENDPOINT, {
                    method: "POST",
                    headers: { "Content-Type": "text/plain;charset=UTF-8" },
                    body: JSON.stringify({ adminSaveTopic: { level: level, part: "teil1", title: data.title, ar: ar.value.trim(), data: data },
                        idToken: await user.getIdToken() })
                });
                const out = await res.json().catch(function () { return {}; });
                if (!res.ok) throw new Error(out.error || ("HTTP " + res.status));
                delete lists[level];
                close();
                if (opts.onSaved) opts.onSaved(out.entry);
            } catch (err) {
                save.disabled = false;
                bad("ما تحفظش: " + err.message);
            }
        });
    }

    window.__lesenNewTopic = { open: open, list: list, addCard: addCard };
})();
