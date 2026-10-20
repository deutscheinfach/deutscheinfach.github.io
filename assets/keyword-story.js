/* ===== 🧠 قصة الربط بالدارجة (Keyword story) — Premium =====

   حدا كل نص ف Lesen (Teil 1 و Teil 3) كاين زر «🧠 قصة». ملي كيبرك عليه
   الطالب كتطلع نافذة: الكلمة المفتاحية ديال العنوان ↔ ديال النص، وقصة
   صغيرة بالدارجة (تخيل هاد المشهد…) باش يعقل على الربط.

   الأدمين بوحدو كيكتب القصص: نفس الزر كيحل ليه فورم (كلمة العنوان، كلمة
   النص، القصة). ماكاينش code ف كل موضوع.

   التخزين (الـ Worker → KV «stories:<doc>»):
     { storiesGet: doc, idToken }                       → Premium ولا الأدمين
     { adminSetStory: { doc, key, h, t, story }, idToken } → الأدمين
   doc  = lesen-b2-<الموضوع>  ·  key = __kwCustom.key(نص)  (كيبقى صحيح ف كل نسخة)

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
        return "k" + h.toString(36);
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

    function paintButton(b) {
        if (!b.btn.isConnected) return false;
        const d = docs[b.doc] || {};
        const has = !!(d.map && d.map[b.key]);
        const admin = isAdmin();
        const prem = isPremium();
        /* الطالب: الزر غير إلا كاينة قصة. الأدمين: ديما (باش يكتب). */
        b.btn.hidden = !(has || admin);
        b.btn.classList.toggle("is-locked", has && !prem);
        b.btn.classList.toggle("is-empty", !has);
        b.btn.innerHTML = "";
        b.btn.append(el("span", "ks-ico", !has ? "✍️" : (prem ? "🧠" : "🔒")),
            el("span", "ks-txt", !has ? "زيد قصة" : "قصة"));
        if (has || admin) b.btn.append(el("span", "ks-pro", "PRO"));
        return true;
    }
    function repaint() {
        for (let i = buttons.length - 1; i >= 0; i--) if (!paintButton(buttons[i])) buttons.splice(i, 1);
    }

    /* ---------- النافذة ---------- */
    let modal = null;
    function close() { if (modal) { modal.remove(); modal = null; } try { speechSynthesis.cancel(); } catch (e) { /* */ } }

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

    function speak(text, btn) {
        try {
            if (!("speechSynthesis" in window)) throw new Error("no");
            speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(text);
            const voices = speechSynthesis.getVoices();
            const v = voices.find(function (x) { return /^ar-MA/i.test(x.lang); })
                || voices.find(function (x) { return /^ar/i.test(x.lang); });
            if (v) u.voice = v;
            u.lang = v ? v.lang : "ar-MA";
            u.rate = 0.95;
            btn.classList.add("is-on");
            u.onend = u.onerror = function () { btn.classList.remove("is-on"); };
            speechSynthesis.speak(u);
        } catch (e) {
            btn.textContent = "الصوت ماكاينش ف هاد المتصفح";
        }
    }

    function showStory(s) {
        const body = shell("قصة الربط بالدارجة 🧠");
        const chips = el("div", "ks-chips");
        const hChip = el("span", "ks-chip", s.h || "—");
        chips.append(hChip, el("i", "ks-link", "↔"), el("span", "ks-chip", s.t || "—"));
        const scene = el("div", "ks-scene");
        scene.append(el("small", "", "🎬 تخيل هاد المشهد"), el("p", "", s.story));
        const tip = el("p", "ks-tip", "💡 هادي طريقة باش تربط الكلمات فذاكرتك، ماشي ترجمة حرفية. الجواب خاصو يبقى مبني على معنى النص كامل.");
        const row = el("div", "ks-actions");
        const listen = el("button", "ks-btn ks-main", "سمع القصة 🔊");
        listen.type = "button";
        listen.addEventListener("click", function () { speak(s.story, listen); });
        const quiz = el("button", "ks-btn", "جرّب الذاكرة 🧩");
        quiz.type = "button";
        quiz.addEventListener("click", function () {
            /* نخبيو كلمة العنوان: واش عقلتي عليها من كلمة النص؟ */
            if (hChip.dataset.hidden === "1") {
                hChip.textContent = s.h || "—"; hChip.dataset.hidden = ""; hChip.classList.remove("is-hidden");
                quiz.textContent = "جرّب الذاكرة 🧩";
            } else {
                hChip.textContent = "؟؟؟"; hChip.dataset.hidden = "1"; hChip.classList.add("is-hidden");
                quiz.textContent = "بيّن الجواب 👀";
            }
        });
        row.append(quiz, listen);
        body.append(chips, scene, tip, row, el("p", "ks-foot", "الصوت كيعتمد على الأصوات المتوفرة فالمتصفح."));
    }

    function showEditor(b, s) {
        const body = shell(s ? "بدّل القصة ✍️" : "زيد قصة ✍️");
        const f = el("form", "ks-form");
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
        const h = field("الكلمة المفتاحية ف العنوان", "h", s ? s.h : "", b.hint.head ? "مثلا: " + b.hint.head : "Leistungssport");
        const t = field("الكلمة المفتاحية ف النص", "t", s ? s.t : "", "42,2 km · Marathon");
        const story = field("القصة بالدارجة (خليها خاوية باش تحيدها)", "story", s ? s.story : "", "تخيل واحد…", true);
        story.dir = "rtl";
        if (b.hint.head) f.appendChild(el("p", "ks-hint", "العنوان الصحيح: " + b.hint.head));
        const msg = el("p", "ks-msg");
        const save = el("button", "ks-btn ks-main", "حفظ ✓");
        save.type = "submit";
        f.append(save, msg);
        f.addEventListener("submit", async function (e) {
            e.preventDefault();
            save.disabled = true; msg.textContent = "كنحفظو…";
            try {
                const out = await call({ adminSetStory: { doc: b.doc, key: b.key, h: h.value, t: t.value, story: story.value } });
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
            view.addEventListener("click", function () { showStory(s); });
            body.appendChild(view);
        }
    }

    function open(b) {
        const d = docs[b.doc] || {};
        const s = d.map && d.map[b.key];
        if (isAdmin()) { showEditor(b, s); return; }
        if (!s) return;
        if (!isPremium()) {
            if (window.__deLocked) window.__deLocked({ title: "قصة الربط بالدارجة 🧠" });
            return;
        }
        showStory(s);
    }

    window.__deStory = {
        /* top: البلاصة فين كيتزاد الزر · text: النص (للمفتاح) · hint: { head } */
        attach: function (top, text, hint) {
            const doc = docOf();
            if (!top || !doc || /[?&]embed=1/.test(location.search)) return;
            const btn = el("button", "ks-open");
            btn.type = "button";
            btn.hidden = true;
            const b = { btn: btn, doc: doc, key: keyOf(text), hint: hint || {} };
            btn.addEventListener("click", function (e) { e.stopPropagation(); open(b); });
            top.appendChild(btn);
            buttons.push(b);
            paintButton(b);
            load(doc).then(function () { paintButton(b); });
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
        ".ks-open .ks-pro{background:#ffce00;color:#3a2700;border-radius:999px;padding:0 6px;font-size:10px;letter-spacing:.06em}" +
        ".ks-open.is-locked{background:#e9edf7;color:#1c367a;box-shadow:none}" +
        ".ks-open.is-empty{background:#fff;color:#1b46b3;border:1.5px dashed #265be3;box-shadow:none}" +
        ".ks-bg{position:fixed;inset:0;z-index:2147483500;background:rgba(10,18,40,.55);display:flex;align-items:center;justify-content:center;padding:16px}" +
        ".ks-box{width:min(560px,100%);max-height:92vh;overflow:auto;background:#fff;border-radius:24px;box-shadow:0 30px 70px -20px rgba(0,0,0,.5);direction:rtl;font-family:Cairo,system-ui,sans-serif;color:#14204a}" +
        ".ks-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:20px 22px;background:linear-gradient(135deg,#152a5e,#265be3);color:#fff;border-radius:24px 24px 0 0}" +
        ".ks-head small{display:block;font-size:11px;letter-spacing:.14em;opacity:.8;direction:ltr;text-align:right;font-weight:700}" +
        ".ks-head b{font-size:21px;font-weight:900}" +
        ".ks-x{flex:0 0 40px;height:40px;border-radius:12px;border:1px solid rgba(255,255,255,.35);background:rgba(255,255,255,.12);color:#fff;font-size:18px;cursor:pointer}" +
        ".ks-body{padding:20px 22px 18px;display:flex;flex-direction:column;gap:14px}" +
        ".ks-chips{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;direction:ltr}" +
        ".ks-chip{background:#fff3b0;border:1.5px solid #ffce00;border-radius:12px;padding:8px 14px;font-weight:800;font-size:15px}" +
        ".ks-chip.is-hidden{background:#eef2fb;border-color:#c8d3ee;color:#8a91a3}" +
        ".ks-link{font-style:normal;color:#265be3;font-size:20px;font-weight:900}" +
        ".ks-scene{background:#f2f6ff;border:1px solid #dbe5fb;border-radius:18px;padding:14px 18px}" +
        ".ks-scene small{display:block;color:#1b46b3;font-weight:800;margin-bottom:6px}" +
        ".ks-scene p{font-size:17px;font-weight:800;line-height:1.9;white-space:pre-line}" +
        ".ks-tip{font-size:12.5px;color:#7a8299;text-align:center}" +
        ".ks-actions{display:grid;grid-template-columns:1fr 1fr;gap:12px}" +
        ".ks-btn{border:0;border-radius:16px;padding:13px 14px;font:900 15px Cairo,system-ui,sans-serif;cursor:pointer;background:#eef2fb;color:#152a5e}" +
        ".ks-main{background:linear-gradient(135deg,#ffe04d,#f2bc00);color:#3a2700}" +
        ".ks-main.is-on{outline:3px solid #265be3}" +
        ".ks-foot{font-size:11.5px;color:#9aa1b2;text-align:center}" +
        ".ks-form{display:flex;flex-direction:column;gap:12px}" +
        ".ks-field{display:flex;flex-direction:column;gap:5px;font-weight:800;font-size:14px}" +
        ".ks-field input,.ks-field textarea{font:600 15px Cairo,system-ui,sans-serif;border:1.5px solid #d6deef;border-radius:12px;padding:10px 12px;color:#14204a;background:#fbfcff}" +
        ".ks-hint{font-size:13px;color:#1b46b3;font-weight:700;direction:ltr;text-align:right}" +
        ".ks-msg{font-size:13px;color:#b42318;min-height:1em}" +
        "html[data-theme=dark] .ks-box{background:#151b2e;color:#e8ecf7}html[data-theme=dark] .ks-scene{background:#1d2439;border-color:#2b3655}" +
        "html[data-theme=dark] .ks-btn:not(.ks-main){background:#1d2439;color:#e8ecf7}html[data-theme=dark] .ks-chip{color:#3a2700}" +
        "html[data-theme=dark] .ks-field input,html[data-theme=dark] .ks-field textarea{background:#1d2439;color:#e8ecf7;border-color:#2b3655}";
    document.head.appendChild(css);
})();
