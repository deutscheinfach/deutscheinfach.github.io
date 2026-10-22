/* ===== ➕ الأدمين كيزيد موضوع Lesen من الموقع (Teil 1، 2، 3) =====

   ف لائحة Teil 1/2/3 كتبان للأدمين بطاقة «+». كتحل فورم بنفس الشكل
   ديال الموضوع: Teil 1 = 10 عناوين و5 نصوص؛ Teil 2 = النص و5 أسئلة
   (a/b/c)؛ Teil 3 = 12 إعلان و10 وضعيات — ولكل وحدة الجواب الصحيح. الحفظ كيمشي للـWorker (adminSaveTopic) → KV، والموضوع
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

    /* ---------- الفورمات ديال كل جزء ----------
       كل وحدة كترسم الخانات ف box وكترجع collect() → data ولا throw "رسالة" */
    function input(ph, dir, cls) {
        const n = el("input", cls || "");
        n.placeholder = ph;
        n.dir = dir || "ltr";
        return n;
    }
    function area(ph, rows) {
        const n = el("textarea");
        n.placeholder = ph;
        n.dir = "ltr";
        if (rows) n.style.minHeight = rows + "px";
        return n;
    }
    function select(first, values) {
        const n = el("select");
        n.appendChild(new Option(first, ""));
        values.forEach(function (v) { n.appendChild(new Option(v, v)); });
        return n;
    }
    function opt(o, key, field) { const v = field.value.trim(); if (v) o[key] = v; return o; }

    const FORMS = {
        teil1: function (box) {
            const grid = el("div", "nt-grid");
            const texts = el("div", "nt-col");
            const heads = el("div", "nt-col");
            grid.append(texts, heads);
            box.appendChild(grid);
            const textRows = [];
            for (let i = 0; i < 5; i++) {
                const card = el("div", "nt-card");
                const head = el("div", "nt-card-head");
                const pick = select("— الجواب الصحيح (Überschrift) —", KEYS.split(""));
                head.append(el("span", "nt-num", String(i + 1)), pick);
                const body = area("Text " + (i + 1));
                const sum = input("ملخص النص بالعربية (اختياري)", "rtl", "nt-small");
                card.append(head, body, sum);
                texts.appendChild(card);
                textRows.push({ pick: pick, body: body, sum: sum });
            }
            const headCard = el("div", "nt-card");
            headCard.appendChild(el("span", "nt-label", "ÜBERSCHRIFTEN — العناوين (A–J)"));
            const optRows = [];
            for (let k = 0; k < KEYS.length; k++) {
                const row = el("div", "nt-opt");
                const inp = input("Überschrift " + KEYS[k]);
                const tr = input("بالعربية (اختياري)", "rtl", "nt-small");
                const wrap = el("div", "nt-col");
                wrap.style.gap = "4px";
                wrap.style.flex = "1";
                wrap.append(inp, tr);
                row.append(el("span", "nt-num", KEYS[k]), wrap);
                headCard.appendChild(row);
                optRows.push({ text: inp, ar: tr });
            }
            heads.appendChild(headCard);
            return function collect(title) {
                const options = optRows.map(function (r, k) { return opt({ value: KEYS[k], text: r.text.value.trim() }, "ar", r.ar); });
                if (options.some(function (o) { return !o.text; })) throw "عمّر العناوين العشرة (A–J).";
                const used = {};
                const texts5 = textRows.map(function (r, i) {
                    if (!r.body.value.trim()) throw "عمّر النص " + (i + 1) + ".";
                    if (!r.pick.value) throw "ختار الجواب ديال النص " + (i + 1) + ".";
                    if (used[r.pick.value]) throw "العنوان " + r.pick.value + " مختار لجوج نصوص.";
                    used[r.pick.value] = true;
                    return opt({ answer: r.pick.value, body: r.body.value.trim() }, "ar", r.sum);
                });
                return { title: title, kind: "matching",
                    variants: [{ label: "الأساسي", intro: INTRO, options: options, texts: texts5 }] };
            };
        },

        teil2: function (box) {
            const grid = el("div", "nt-grid");
            const texts = el("div", "nt-col");
            const qs = el("div", "nt-col");
            grid.append(texts, qs);
            box.appendChild(grid);
            const paras = [];
            const textCard = el("div", "nt-card");
            textCard.appendChild(el("span", "nt-label", "النص — الفقرات"));
            for (let i = 0; i < 5; i++) {
                const body = area("Absatz " + (i + 1), 110);
                const ar = input("ترجمة الفقرة (اختياري)", "rtl", "nt-small");
                textCard.append(body, ar);
                paras.push({ body: body, ar: ar });
            }
            texts.appendChild(textCard);
            const rows = [];
            for (let i = 0; i < 5; i++) {
                const card = el("div", "nt-card");
                const head = el("div", "nt-card-head");
                const q = input("Frage " + (6 + i));
                head.append(el("span", "nt-num", String(6 + i)), q);
                const options = ["a", "b", "c"].map(function (k) {
                    const r = el("div", "nt-opt");
                    const t = input("Antwort " + k);
                    r.append(el("span", "nt-num", k), t);
                    card.appendChild(r);
                    return t;
                });
                const ans = select("— الجواب الصحيح —", ["a", "b", "c"]);
                const why = input("علاش (اختياري)", "rtl", "nt-small");
                card.prepend(head);
                card.append(ans, why);
                qs.appendChild(card);
                rows.push({ q: q, options: options, ans: ans, why: why });
            }
            return function collect(title) {
                const texts5 = paras.filter(function (p) { return p.body.value.trim(); })
                    .map(function (p) { return opt({ body: p.body.value.trim() }, "ar", p.ar); });
                if (!texts5.length) throw "عمّر النص.";
                const questions = rows.map(function (r, i) {
                    if (!r.q.value.trim()) throw "عمّر السؤال " + (6 + i) + ".";
                    const o = r.options.map(function (t) { return { text: t.value.trim() }; });
                    if (o.some(function (x) { return !x.text; })) throw "عمّر الاختيارات ديال السؤال " + (6 + i) + ".";
                    if (!r.ans.value) throw "ختار الجواب ديال السؤال " + (6 + i) + ".";
                    return opt({ num: 6 + i, text: r.q.value.trim(), options: o, answer: "abc".indexOf(r.ans.value) }, "why", r.why);
                });
                return { title: title, kind: "mc", texts: texts5, variants: [{ label: "الأساسي", questions: questions }] };
            };
        },

        teil3: function (box) {
            const ADS = "ABCDEFGHIJKL";
            const grid = el("div", "nt-grid");
            const left = el("div", "nt-col");
            const right = el("div", "nt-col");
            grid.append(left, right);
            box.appendChild(grid);
            const ads = [];
            for (let i = 0; i < ADS.length; i++) {
                const card = el("div", "nt-card");
                const head = el("div", "nt-card-head");
                const h = input("Überschrift der Anzeige " + ADS[i]);
                head.append(el("span", "nt-num", ADS[i]), h);
                const b = area("Text der Anzeige " + ADS[i], 90);
                const ar = input("ملخص بالعربية (اختياري)", "rtl", "nt-small");
                card.append(head, b, ar);
                left.appendChild(card);
                ads.push({ h: h, b: b, ar: ar });
            }
            const sitCard = el("div", "nt-card");
            sitCard.appendChild(el("span", "nt-label", "SITUATIONEN 11–20 — والجواب (A–L ولا X)"));
            const sits = [];
            for (let i = 0; i < 10; i++) {
                const row = el("div", "nt-opt");
                const de = input("Situation " + (11 + i));
                const ar = input("بالعربية (اختياري)", "rtl", "nt-small");
                const ans = select("—", ADS.split("").concat(["X"]));
                ans.style.width = "70px";
                ans.style.flex = "0 0 70px";
                const wrap = el("div", "nt-col");
                wrap.style.gap = "4px";
                wrap.style.flex = "1";
                wrap.append(de, ar);
                row.append(el("span", "nt-num", String(11 + i)), wrap, ans);
                sitCard.appendChild(row);
                sits.push({ de: de, ar: ar, ans: ans });
            }
            right.appendChild(sitCard);
            return function collect(title) {
                const adList = ads.map(function (a, i) {
                    if (!a.h.value.trim() && !a.b.value.trim()) throw "عمّر الإعلان " + ADS[i] + ".";
                    return opt({ key: ADS[i], head: a.h.value.trim(), body: a.b.value.trim() }, "ar", a.ar);
                });
                const used = {};
                const answers = [];
                const situations = sits.map(function (s2, i) {
                    if (!s2.de.value.trim()) throw "عمّر الوضعية " + (11 + i) + ".";
                    if (!s2.ans.value) throw "ختار الجواب ديال الوضعية " + (11 + i) + ".";
                    if (s2.ans.value !== "X" && used[s2.ans.value]) throw "الإعلان " + s2.ans.value + " مختار لجوج وضعيات.";
                    used[s2.ans.value] = true;
                    answers.push(s2.ans.value);
                    return opt({ no: 11 + i, de: s2.de.value.trim() }, "ar", s2.ar);
                });
                return { title: title, kind: "ads",
                    intro: "Lesen Sie die Situationen 11–20 und die Anzeigen A–L. Welche Anzeige passt zu welcher Situation? Jede Anzeige können Sie nur einmal verwenden. Gibt es zu einer Situation keine passende Anzeige, markieren Sie X.",
                    ads: adList, situations: situations, variants: [{ label: "الأساسي", answers: answers }] };
            };
        }
    };
    const PART_NAME = { teil1: "Lesen Teil 1", teil2: "Lesen Teil 2", teil3: "Lesen Teil 3" };

    function open(opts) {
        css();
        const level = opts.level;
        const part = FORMS[opts.part] ? opts.part : "teil1";
        const bg = el("div", "nt-bg");
        const box = el("div", "nt-box");
        const top = el("div", "nt-top");
        const x = el("button", "nt-x", "✕");
        x.type = "button";
        top.append(el("b", "", "موضوع جديد — " + PART_NAME[part] + " · " + level.toUpperCase()), x);

        const titles = el("div", "nt-titles");
        const title = input("اسم الموضوع (Titel)");
        const ar = input("الاسم بالعربية (اختياري)", "rtl");
        titles.append(title, ar);
        box.append(top, titles);
        const collect = FORMS[part](box);

        const foot = el("div", "nt-foot");
        const save = el("button", "nt-save", "حفظ الموضوع ✓");
        save.type = "button";
        const msg = el("span", "nt-msg", "عمّر كلشي ومن بعد حفظ. الموضوع كيبان ف اللائحة (Premium).");
        foot.append(save, msg);
        box.appendChild(foot);
        bg.appendChild(box);
        document.body.appendChild(bg);
        document.documentElement.style.overflow = "hidden";
        title.focus();

        function close() { bg.remove(); document.documentElement.style.overflow = ""; }
        x.addEventListener("click", close);
        function bad(text) { msg.className = "nt-msg is-bad"; msg.textContent = text; }

        save.addEventListener("click", async function () {
            if (!title.value.trim()) return bad("كتب اسم الموضوع.");
            let data;
            try { data = collect(title.value.trim()); } catch (e) { return bad(String(e && e.message || e)); }
            save.disabled = true;
            msg.className = "nt-msg";
            msg.textContent = "كنحفظو…";
            try {
                const out = await post({ adminSaveTopic: { level: level, part: part, title: data.title, ar: ar.value.trim(), data: data } });
                delete lists[level];
                close();
                if (opts.onSaved) opts.onSaved(out.entry);
            } catch (err) {
                save.disabled = false;
                bad("ما تحفظش: " + err.message);
            }
        });
    }

    async function post(body) {
        const auth = window.__deutschEinfachAuth;
        const user = auth && auth.currentUser;
        if (!user) throw new Error("ماشي داخل بحساب");
        body.idToken = await user.getIdToken();
        const res = await fetch(ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=UTF-8" },
            body: JSON.stringify(body)
        });
        const out = await res.json().catch(function () { return {}; });
        if (!res.ok) throw new Error(out.error || ("HTTP " + res.status));
        return out;
    }

    window.__lesenNewTopic = { open: open, list: list, addCard: addCard, post: post, css: css, el: el, parts: Object.keys(FORMS) };
})();
