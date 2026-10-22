/* ===== ✏️ الأدمين كيعدل نص ولا عنوان ف Lesen =====

   حدا كل نص (.t1-body)، عنوان (.t1-option-de)، رأس إعلان (.t3-ad-head)
   وسؤال (.t2-q-de) كيبان للأدمين زر ✏️. كيحل نافذة فيها النص: كيزيد
   ولا كينقص كلمة ويحفظ.

   التخزين: الـWorker (adminSetEdit) → KV «lesen-edits». الـWorker كيبدل
   النص قبل ما يعطيه للطلبة (المجاني والـPremium)، إذن ماكيبانش ف
   GitHub. نص خاوي ف النافذة = نرجعو الأصل.

   الكاش: الطلبة عندهم نسخة محفوظة (Cache Storage / localStorage). كل
   صفحة كتسول الـWorker على «الرقم ديال التعديلات» (?editsv=1)، وإلا
   تبدل كتمسح الكاش ديال Lesen — التعديل كيبان من التحميلة الجاية. */
(function () {
    "use strict";
    if (window.__deLesenEdit) return;
    window.__deLesenEdit = true;

    const ENDPOINT = "https://deutsch-einfach-correction.soufianemouyr.workers.dev";
    const SEL = ".t1-body, .t1-option-de, .t3-ad-head, .t2-q-de";
    const VKEY = "de-lesen-edits-v";

    function dropCache() {
        try {
            const drop = [];
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                if (k && k.indexOf("de-lp:") === 0) drop.push(k);
            }
            drop.forEach(function (k) { localStorage.removeItem(k); });
        } catch (e) { /* وضع خاص */ }
        try { if (window.caches) caches.delete("de-lesen-free-v1"); } catch (e) { /* */ }
    }

    /* ---- لكاع الناس: واش تبدل شي نص من آخر مرة؟ ---- */
    try {
        fetch(ENDPOINT + "?editsv=1", { credentials: "omit" })
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (d) {
                if (!d || typeof d.v !== "number") return;
                const seen = localStorage.getItem(VKEY);
                if (seen !== String(d.v)) {
                    if (seen !== null || d.v) dropCache();
                    localStorage.setItem(VKEY, String(d.v));
                }
            })
            .catch(function () { /* بلا أنترنت */ });
    } catch (e) { /* */ }

    /* ---- الأدمين ---- */
    function isAdmin() {
        if (window.__deIsAdmin === true) return true;
        try { return window.parent !== window && window.parent.__deIsAdmin === true; } catch (e) { return false; }
    }
    function el(tag, cls, text) {
        const n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text != null) n.textContent = text;
        return n;
    }
    function textOf(node) { return node.__kwText != null ? node.__kwText : node.textContent; }
    function key(text) {
        if (window.__kwCustom) return window.__kwCustom.key(text);
        return "";
    }

    let styled = false;
    function css() {
        if (styled) return;
        styled = true;
        const s = el("style");
        s.textContent =
            ".le-pen{display:inline-grid;place-items:center;width:26px;height:26px;margin:0 4px;vertical-align:middle;border:1px dashed #e0a800;border-radius:8px;background:#fff8d6;color:#7a5a00;font-size:13px;cursor:pointer;flex:0 0 auto}" +
            ".le-pen:hover{background:#ffe9a0}" +
            ".t1-body + .le-pen{display:grid;margin:6px 0 0 auto}" +
            ".le-bg{position:fixed;inset:0;z-index:2147483500;background:rgba(10,18,40,.55);display:flex;align-items:center;justify-content:center;padding:16px}" +
            ".le-box{width:min(680px,100%);background:#fff;border-radius:20px;padding:18px;display:flex;flex-direction:column;gap:10px;font-family:Cairo,system-ui,sans-serif;color:#14204a;direction:rtl;box-shadow:0 30px 70px -20px rgba(0,0,0,.5)}" +
            ".le-box b{font-size:17px}" +
            ".le-box textarea{direction:ltr;text-align:left;font:500 15px/1.7 system-ui,sans-serif;border:1.5px solid #d6deef;border-radius:12px;padding:10px 12px;min-height:180px;resize:vertical;color:#14204a}" +
            ".le-row{display:flex;gap:8px;flex-wrap:wrap}" +
            ".le-row button{border:0;border-radius:12px;padding:10px 16px;font:800 14px Cairo,system-ui,sans-serif;cursor:pointer;background:#eef2fb;color:#152a5e}" +
            ".le-row .le-save{background:linear-gradient(135deg,#ffe04d,#f2bc00);color:#3a2700}" +
            ".le-msg{font-size:13px;color:#7a8299;min-height:1em}.le-msg.is-bad{color:#b42318;font-weight:700}" +
            "html[data-theme=dark] .le-box{background:#151b2e;color:#e8ecf7}html[data-theme=dark] .le-box textarea{background:#1d2439;color:#e8ecf7;border-color:#2b3655}";
        document.head.appendChild(s);
    }

    function open(node) {
        const before = textOf(node);
        const bg = el("div", "le-bg");
        const box = el("div", "le-box");
        box.setAttribute("role", "dialog");
        const ta = el("textarea");
        ta.value = before;
        const msg = el("p", "le-msg", "زيد ولا نقص اللي بغيتي. خليه خاوي باش ترجع النص الأصلي.");
        const save = el("button", "le-save", "حفظ ✓");
        const cancel = el("button", "", "إلغاء");
        save.type = cancel.type = "button";
        const row = el("div", "le-row");
        row.append(save, cancel);
        box.append(el("b", "", "✏️ تعديل النص"), ta, row, msg);
        bg.appendChild(box);
        document.body.appendChild(bg);
        ta.focus();
        function close() { bg.remove(); }
        cancel.addEventListener("click", close);
        bg.addEventListener("click", function (e) { if (e.target === bg) close(); });
        save.addEventListener("click", async function () {
            const next = ta.value.replace(/\s+$/g, "");
            if (next === before) { close(); return; }
            save.disabled = true;
            msg.className = "le-msg";
            msg.textContent = "كنحفظو…";
            try {
                const auth = window.__deutschEinfachAuth;
                const user = auth && auth.currentUser;
                if (!user) throw new Error("ماشي داخل بحساب");
                const res = await fetch(ENDPOINT, {
                    method: "POST",
                    headers: { "Content-Type": "text/plain;charset=UTF-8" },
                    body: JSON.stringify({ adminSetEdit: { orig: before, text: next }, idToken: await user.getIdToken() })
                });
                const out = await res.json().catch(function () { return {}; });
                if (!res.ok) throw new Error(out.error || ("HTTP " + res.status));
                /* الكلمات والقصص ديال النص كيبقاو مربوطين بالأصل */
                const shown = next.trim() ? next : before;
                const newKey = key(shown);
                if (out.key && newKey && newKey !== out.key) {
                    window.__deKeyAlias = window.__deKeyAlias || {};
                    window.__deKeyAlias[newKey] = out.key;
                }
                if (next.trim()) {
                    node.__kwText = null;
                    node.textContent = next;
                    document.dispatchEvent(new CustomEvent("de-kw-change", { detail: {} }));
                }
                dropCache();
                try { localStorage.removeItem(VKEY); } catch (e) { /* */ }
                if (!next.trim()) {
                    msg.textContent = "رجع النص الأصلي — كيبان من بعد ما تعاود تحمل الصفحة.";
                    save.disabled = false;
                    return;
                }
                close();
            } catch (err) {
                save.disabled = false;
                msg.className = "le-msg is-bad";
                msg.textContent = "ما تحفظش: " + err.message;
            }
        });
    }

    function pens() {
        if (!isAdmin()) {
            Array.prototype.forEach.call(document.querySelectorAll(".le-pen"), function (p) { p.remove(); });
            return;
        }
        css();
        Array.prototype.forEach.call(document.querySelectorAll(SEL), function (node) {
            if (node.__lePen && node.__lePen.isConnected) return;
            const pen = el("button", "le-pen", "✏️");
            pen.type = "button";
            pen.title = "عدّل النص";
            pen.setAttribute("aria-label", "عدّل النص");
            ["pointerdown", "mousedown", "touchstart"].forEach(function (t) {
                pen.addEventListener(t, function (e) { e.stopPropagation(); }, { passive: true });
            });
            pen.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                open(node);
            });
            node.insertAdjacentElement("afterend", pen);
            node.__lePen = pen;
        });
    }

    let queued = false;
    function queue() {
        if (queued) return;
        queued = true;
        requestAnimationFrame(function () { queued = false; pens(); });
    }
    new MutationObserver(function () { if (isAdmin()) queue(); })
        .observe(document.documentElement, { childList: true, subtree: true });
    document.addEventListener("de-admin", queue);
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", queue);
    else queue();
})();
