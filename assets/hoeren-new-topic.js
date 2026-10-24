/* ===== ➕ الأدمين كيزيد موضوع Hören من الموقع (Teil 1، 2، 3 — B1 و B2) =====

   - كل الناس: كنجيبو المواضيع اللي زادهم الأدمين (?hoerenlist=b2-teil2)
     وكنزيدوهم ف آخر اللائحة (window.__hoerenExtra → boot() ديال الصفحة).
     الجمل ديالهم (Premium) كيتجابو من الـWorker بـ lesenId «hoeren-x-…».
   - الأدمين: ف آخر اللائحة «+ زيد موضوع جديد» → فورم: العنوان والجمل،
     ولكل جملة Richtig / Falsch (والترجمة اختيارية). */
(function () {
    "use strict";
    if (window.__hoerenNewTopic) return;
    window.__hoerenNewTopic = true;

    const PAGE = /(b1|b2)-hoeren-(teil[123])/.exec(location.pathname);
    if (!PAGE || /[?&]embed=1/.test(location.search)) return;
    const LV = PAGE[1], TEIL = PAGE[2];
    const ENDPOINT = "https://deutsch-einfach-correction.soufianemouyr.workers.dev";
    const COUNT = TEIL === "teil2" ? 10 : 5;

    function el(tag, cls, text) {
        const n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text != null) n.textContent = text;
        return n;
    }
    function user() {
        const auth = window.__deutschEinfachAuth;
        return auth && auth.currentUser;
    }
    function waitUser(ms) {
        return new Promise(function (done) {
            const end = Date.now() + ms;
            (function poll() {
                const u = user();
                if (u || Date.now() > end) return done(u);
                setTimeout(poll, 250);
            })();
        });
    }
    function reboot() { if (typeof window.__hoerenReboot === "function") window.__hoerenReboot(); }

    /* ---- اللائحة + الجمل ---- */
    let extra = [];
    async function loadContent(entry) {
        /* بلا أنترنت: النسخة المحفوظة ف التيليفون (__deStore، diag.js) */
        const KEY = "l:hoeren-" + entry.kv;
        const offline = async function () {
            const d = window.__deStore ? await window.__deStore.get(KEY) : null;
            if (d && Array.isArray(d.questions)) entry.questions = d.questions;
        };
        if (navigator.onLine === false) return offline();
        const u = await waitUser(10000);
        if (!u) return offline();
        try {
            const res = await fetch(ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "text/plain;charset=UTF-8" },
                body: JSON.stringify({ lesenId: "hoeren-" + entry.kv, idToken: await u.getIdToken() })
            });
            if (!res.ok) return;
            const d = await res.json();
            if (d && Array.isArray(d.questions)) {
                entry.questions = d.questions;
                if (window.__deStore) window.__deStore.put(KEY, d);
            }
        } catch (e) { await offline(); }
    }
    fetch(ENDPOINT + "?hoerenlist=" + LV + "-" + TEIL, { credentials: "omit" })
        .then(function (r) { return r.ok ? r.json() : []; })
        .then(async function (list) {
            if (!Array.isArray(list) || !list.length) return;
            extra = list.map(function (e) { return Object.assign({}, e, { questions: [] }); });
            window.__hoerenExtra = extra;
            reboot();
            const premium = window.__deutschEinfachIsPremium === true || window.__deIsAdmin === true;
            if (!premium && !(await waitUser(4000))) return;
            await Promise.all(extra.map(loadContent));
            reboot();
        })
        .catch(function () { /* */ });

    /* ---- الأدمين ---- */
    let styled = false;
    function css() {
        if (styled) return;
        styled = true;
        const s = el("style");
        s.textContent =
            ".hn-add{display:flex;align-items:center;justify-content:center;gap:10px;margin:14px 0;padding:18px;border:2px dashed #b9c3dd;border-radius:18px;background:transparent;color:#1c367a;font:800 15px Cairo,system-ui,sans-serif;cursor:pointer;width:100%}" +
            ".hn-add:hover{border-color:#1c367a;background:rgba(28,54,122,.04)}" +
            ".hn-plus{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;background:#1c367a;color:#fff;font-size:22px}" +
            ".hn-bg{position:fixed;inset:0;z-index:2147483500;background:rgba(10,18,40,.55);overflow:auto;padding:24px 12px}" +
            ".hn-box{max-width:860px;margin:0 auto;background:#f5f6fa;border-radius:22px;padding:18px;font-family:Cairo,system-ui,sans-serif;color:#161a2b;display:flex;flex-direction:column;gap:10px}" +
            ".hn-top{display:flex;align-items:center;justify-content:space-between;direction:rtl}.hn-top b{font-size:18px}" +
            ".hn-x{border:0;background:#fff;border-radius:10px;width:36px;height:36px;cursor:pointer}" +
            ".hn-box input,.hn-box select{font:600 14px system-ui,sans-serif;border:1.5px solid #d6deef;border-radius:12px;padding:9px 11px;background:#fff;color:#161a2b;box-sizing:border-box}" +
            ".hn-row{display:grid;grid-template-columns:34px minmax(0,1fr) 120px;gap:8px;align-items:start;background:#fff;border:1px solid #e3e6ee;border-radius:14px;padding:10px}" +
            ".hn-row .hn-ar{grid-column:2/4;font-size:12.5px;color:#5b6275}" +
            ".hn-n{height:34px;border-radius:10px;display:grid;place-items:center;border:1px solid #e3e6ee;font-weight:800}" +
            ".hn-more{align-self:flex-start;border:1px dashed #1c367a;background:transparent;color:#1c367a;border-radius:999px;padding:6px 14px;font:800 13px Cairo,system-ui,sans-serif;cursor:pointer}" +
            ".hn-foot{display:flex;gap:12px;align-items:center;direction:rtl;flex-wrap:wrap}" +
            ".hn-save{border:0;border-radius:14px;padding:12px 22px;font:900 15px Cairo,system-ui,sans-serif;cursor:pointer;background:linear-gradient(135deg,#ffe04d,#f2bc00);color:#3a2700}" +
            ".hn-msg{font-size:13.5px;font-weight:700;color:#5b6275}.hn-msg.is-bad{color:#b42318}" +
            "@media (max-width:600px){.hn-row{grid-template-columns:30px minmax(0,1fr)}.hn-row select{grid-column:2}.hn-row .hn-ar{grid-column:2}}";
        document.head.appendChild(s);
    }

    function open() {
        css();
        const bg = el("div", "hn-bg");
        const box = el("div", "hn-box");
        const top = el("div", "hn-top");
        const x = el("button", "hn-x", "✕");
        x.type = "button";
        top.append(el("b", "", "موضوع جديد — Hören " + TEIL.replace("teil", "Teil ") + " · " + LV.toUpperCase()), x);
        const title = el("input");
        title.placeholder = "اسم الموضوع (مثلا: Frau Eichhorn (الأساسي))";
        const list = el("div", "hn-box");
        list.style.padding = "0";
        list.style.background = "transparent";
        const rows = [];
        function addRow() {
            const n = rows.length + 1;
            const row = el("div", "hn-row");
            const text = el("input");
            text.placeholder = "Aussage " + n;
            text.dir = "ltr";
            const ans = el("select");
            ans.append(new Option("— الجواب —", ""), new Option("Richtig", "richtig"), new Option("Falsch", "falsch"));
            const ar = el("input", "hn-ar");
            ar.placeholder = "الترجمة بالعربية (اختياري)";
            ar.dir = "rtl";
            row.append(el("span", "hn-n", String(n)), text, ans, ar);
            list.appendChild(row);
            rows.push({ text: text, ans: ans, ar: ar });
        }
        for (let i = 0; i < COUNT; i++) addRow();
        const more = el("button", "hn-more", "+ زيد جملة");
        more.type = "button";
        more.addEventListener("click", addRow);
        const foot = el("div", "hn-foot");
        const save = el("button", "hn-save", "حفظ الموضوع ✓");
        save.type = "button";
        const msg = el("span", "hn-msg", "عمّر الجمل وختار Richtig ولا Falsch. الموضوع كيبان ف آخر اللائحة (Premium).");
        foot.append(save, msg);
        box.append(top, title, list, more, foot);
        bg.appendChild(box);
        document.body.appendChild(bg);
        document.documentElement.style.overflow = "hidden";
        title.focus();
        function close() { bg.remove(); document.documentElement.style.overflow = ""; }
        x.addEventListener("click", close);
        function bad(t) { msg.className = "hn-msg is-bad"; msg.textContent = t; }

        save.addEventListener("click", async function () {
            if (!title.value.trim()) return bad("كتب اسم الموضوع.");
            const filled = rows.filter(function (r) { return r.text.value.trim(); });
            if (!filled.length) return bad("عمّر الجمل.");
            const missing = filled.findIndex(function (r) { return !r.ans.value; });
            if (missing !== -1) return bad("ختار Richtig ولا Falsch للجملة " + (rows.indexOf(filled[missing]) + 1) + ".");
            const questions = filled.map(function (r) {
                const q = { text: r.text.value.trim(), answer: r.ans.value };
                if (r.ar.value.trim()) q.ar = r.ar.value.trim();
                return q;
            });
            save.disabled = true;
            msg.className = "hn-msg";
            msg.textContent = "كنحفظو…";
            try {
                const u = user();
                if (!u) throw new Error("ماشي داخل بحساب");
                const res = await fetch(ENDPOINT, {
                    method: "POST",
                    headers: { "Content-Type": "text/plain;charset=UTF-8" },
                    body: JSON.stringify({ adminSaveTopic: { kind: "hoeren", level: LV, teil: TEIL, title: title.value.trim(), questions: questions },
                        idToken: await u.getIdToken() })
                });
                const out = await res.json().catch(function () { return {}; });
                if (!res.ok) throw new Error(out.error || ("HTTP " + res.status));
                const entry = Object.assign({}, out.entry, { questions: questions });
                extra = extra.filter(function (e) { return e.kv !== entry.kv; }).concat([entry]);
                window.__hoerenExtra = extra;
                close();
                reboot();
                const last = document.querySelectorAll(".theme-item");
                if (last.length) last[last.length - 1].scrollIntoView({ behavior: "smooth", block: "center" });
            } catch (err) {
                save.disabled = false;
                bad("ما تحفظش: " + err.message);
            }
        });
    }

    /* «+» ف آخر اللائحة (الصفحة كتعاود ترسم اللائحة كاملة ف boot) */
    function ensureAdd() {
        const stack = document.querySelector("[id^='hoeren-teil'][id$='-stack']");
        if (!stack) return;
        const has = stack.querySelector(".hn-add");
        if (window.__deIsAdmin !== true) { if (has) has.remove(); return; }
        if (has && has === stack.lastElementChild) return;
        if (has) has.remove();
        css();
        const add = el("button", "hn-add");
        add.type = "button";
        add.append(el("span", "hn-plus", "+"), el("span", "", "زيد موضوع جديد"));
        add.addEventListener("click", open);
        stack.appendChild(add);
    }
    new MutationObserver(function () { ensureAdd(); })
        .observe(document.documentElement, { childList: true, subtree: true });
    document.addEventListener("de-admin", ensureAdd);
})();
