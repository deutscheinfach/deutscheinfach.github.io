/* ===== ➕ الأدمين كيزيد موضوع Schreiben من الموقع (B1 و B2) =====

   - اللائحة (b?-schreiben.html): المواضيع اللي زادهم الأدمين كيجيو من
     ?schreibenlist=b2 وكيتحلو ف b?-schreiben-x.html?t=NN (صفحة وحدة للكل).
   - الأدمين: بطاقة «+» → فورم: العنوان، الإعلان/الرسالة، الوضعية (B2)
     و4 نقط. الرقم (NN) هو اللي من بعد آخر موضوع. الحفظ → الـWorker:
     B2 «topic-NN»، B1 «lesen-schreiben-b1-NN» (نفس الطريق ديال الموقع).

   window.__schreibenNewTopic = { list, open, addCard }
   window.__schreibenCustomMeta(level, id) → Promise(meta | null) */
(function () {
    "use strict";
    if (window.__schreibenNewTopic) return;

    const ENDPOINT = "https://deutsch-einfach-correction.soufianemouyr.workers.dev";
    const lists = {};

    function el(tag, cls, text) {
        const n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text != null) n.textContent = text;
        return n;
    }
    function list(level) {
        if (!lists[level]) {
            lists[level] = fetch(ENDPOINT + "?schreibenlist=" + level, { credentials: "omit" })
                .then(function (r) { return r.ok ? r.json() : []; })
                .then(function (d) { return Array.isArray(d) ? d : []; })
                .catch(function () { delete lists[level]; return []; });
        }
        return lists[level];
    }
    window.__schreibenCustomMeta = function (level, id) {
        if (!/^\d{2}$/.test(String(id || ""))) return Promise.resolve(null);
        return list(level).then(function (l) {
            const e = l.find(function (x) { return x.id === id; });
            return e ? Object.assign({}, e) : null;
        });
    };

    let styled = false;
    function css() {
        if (styled) return;
        styled = true;
        const s = el("style");
        s.textContent =
            ".lesen-card.sn-add{display:flex;align-items:center;justify-content:center;flex-direction:column;gap:6px;min-height:120px;border:2px dashed #b9c3dd;background:transparent;box-shadow:none;cursor:pointer;color:#1c367a;font:800 14px Cairo,system-ui,sans-serif}" +
            ".lesen-card.sn-add:hover{border-color:#1c367a;background:rgba(28,54,122,.04)}" +
            ".sn-plus{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:#1c367a;color:#fff;font-size:26px;line-height:1}" +
            ".sn-bg{position:fixed;inset:0;z-index:2147483500;background:rgba(10,18,40,.55);overflow:auto;padding:24px 12px}" +
            ".sn-box{max-width:820px;margin:0 auto;background:#f5f6fa;border-radius:22px;padding:18px;font-family:Cairo,system-ui,sans-serif;color:#161a2b;display:flex;flex-direction:column;gap:10px}" +
            ".sn-top{display:flex;align-items:center;justify-content:space-between;direction:rtl}.sn-top b{font-size:18px}" +
            ".sn-x{border:0;background:#fff;border-radius:10px;width:36px;height:36px;cursor:pointer}" +
            ".sn-box input,.sn-box textarea{font:600 14px/1.6 system-ui,sans-serif;border:1.5px solid #d6deef;border-radius:12px;padding:9px 11px;background:#fff;color:#161a2b;box-sizing:border-box;width:100%}" +
            ".sn-box textarea{min-height:150px;resize:vertical}" +
            ".sn-label{font-size:12.5px;font-weight:800;color:#5b6275;direction:rtl}" +
            ".sn-foot{display:flex;gap:12px;align-items:center;direction:rtl;flex-wrap:wrap}" +
            ".sn-save{border:0;border-radius:14px;padding:12px 22px;font:900 15px Cairo,system-ui,sans-serif;cursor:pointer;background:linear-gradient(135deg,#ffe04d,#f2bc00);color:#3a2700}" +
            ".sn-msg{font-size:13.5px;font-weight:700;color:#5b6275}.sn-msg.is-bad{color:#b42318}";
        document.head.appendChild(s);
    }

    function addCard(onClick) {
        css();
        const node = el("button", "lesen-card sn-add");
        node.type = "button";
        node.append(el("span", "sn-plus", "+"), el("span", "", "زيد موضوع جديد"));
        node.addEventListener("click", onClick);
        return node;
    }

    function open(opts) {
        css();
        const level = opts.level, id = opts.id;
        const b2 = level === "b2";
        const bg = el("div", "sn-bg");
        const box = el("div", "sn-box");
        const top = el("div", "sn-top");
        const x = el("button", "sn-x", "✕");
        x.type = "button";
        top.append(el("b", "", "موضوع جديد — Schreiben " + level.toUpperCase() + " · Thema " + id), x);
        function field(label, node) { box.append(el("span", "sn-label", label), node); return node; }
        function inp(ph) { const n = el("input"); n.placeholder = ph; n.dir = "ltr"; return n; }
        function ta(ph) { const n = el("textarea"); n.placeholder = ph; n.dir = "ltr"; return n; }
        box.appendChild(top);
        const title = field("اسم الموضوع", inp("Titel"));
        const ad = field(b2 ? "الإعلان (Anzeige)" : "الرسالة (Brief / E-Mail)", ta(b2 ? "Text der Anzeige …" : "Liebe(r) …"));
        const situation = b2 ? field("الوضعية (Situation)", ta("Was ist passiert …")) : null;
        if (situation) situation.style.minHeight = "100px";
        const intro = b2 ? null : field("التعليمة", inp(""));
        if (intro) intro.value = "Antworten Sie auf den Brief. Schreiben Sie etwas zu den folgenden Punkten:";
        box.appendChild(el("span", "sn-label", "النقط (3 ولا 4)"));
        const points = [1, 2, 3, 4].map(function (n) { const p = inp("Punkt " + n); box.appendChild(p); return p; });
        const words = b2 ? null : field("عدد الكلمات", inp(""));
        if (words) words.value = "80";
        const foot = el("div", "sn-foot");
        const save = el("button", "sn-save", "حفظ الموضوع ✓");
        save.type = "button";
        const msg = el("span", "sn-msg", "الموضوع كيبان ف اللائحة (Premium).");
        foot.append(save, msg);
        box.appendChild(foot);
        bg.appendChild(box);
        document.body.appendChild(bg);
        document.documentElement.style.overflow = "hidden";
        title.focus();
        function close() { bg.remove(); document.documentElement.style.overflow = ""; }
        x.addEventListener("click", close);
        function bad(t) { msg.className = "sn-msg is-bad"; msg.textContent = t; }

        save.addEventListener("click", async function () {
            if (!title.value.trim()) return bad("كتب اسم الموضوع.");
            if (!ad.value.trim()) return bad(b2 ? "عمّر الإعلان." : "عمّر الرسالة.");
            const pts = points.map(function (p) { return p.value.trim(); }).filter(Boolean);
            if (pts.length < 3) return bad("عمّر 3 نقط على الأقل.");
            const content = { ad: ad.value.trim(), situation: situation ? situation.value.trim() : "", points: pts };
            if (intro && intro.value.trim()) content.intro = intro.value.trim();
            if (words && words.value.trim()) content.words = words.value.trim();
            save.disabled = true;
            msg.className = "sn-msg";
            msg.textContent = "كنحفظو…";
            try {
                const auth = window.__deutschEinfachAuth;
                const u = auth && auth.currentUser;
                if (!u) throw new Error("ماشي داخل بحساب");
                const res = await fetch(ENDPOINT, {
                    method: "POST",
                    headers: { "Content-Type": "text/plain;charset=UTF-8" },
                    body: JSON.stringify({ adminSaveTopic: { kind: "schreiben", level: level, id: id, title: title.value.trim(), content: content },
                        idToken: await u.getIdToken() })
                });
                const out = await res.json().catch(function () { return {}; });
                if (!res.ok) throw new Error(out.error === "id_taken" ? "الرقم " + id + " مستعمل — عاود حل الصفحة" : (out.error || ("HTTP " + res.status)));
                delete lists[level];
                close();
                if (opts.onSaved) opts.onSaved(out.entry);
            } catch (err) {
                save.disabled = false;
                bad("ما تحفظش: " + err.message);
            }
        });
    }

    window.__schreibenNewTopic = { list: list, open: open, addCard: addCard };
})();
