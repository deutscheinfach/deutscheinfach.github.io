/* ===== فيديو الشرح ديال كل موضوع (الكلمات المفتاحية) =====

   الأدمين كيزيد رابط YouTube (Unlisted) من الموقع نيشان: زر «🎬 فيديو»
   كيبان ليه فوق كل موضوع. الطلبة كيشوفو بطاقة الفيديو غير إلا كان.

   التخزين: KV «videos» = { "<مفتاح الموضوع>": "<YouTube ID>" }
     GET  ?videos=1                          → الخريطة كاملة (عامة)
     POST { adminSetVideo: {key, yt}, idToken } → غير الأدمين (yt خاوي = حيد)

   المفاتيح:  lesen-b2-insel-teil1 · hoeren-b2-teil1-<quizId> …

   السرعة: الفيديو ما كيتحملش حتى يبرك الطالب على ▶ (غير صورة صغيرة
   من YouTube). بلا أنترنت ما كتبانش البطاقة.

   الاستعمال:  window.__deVideo.mount(container, key, { title, before }) */
(function () {
    "use strict";
    if (window.__deVideo) return;

    const ENDPOINT = "https://deutsch-einfach-correction.soufianemouyr.workers.dev";
    const CACHE = "de-videos";
    const TTL = 2 * 60 * 1000;

    let map = null;
    let loading = null;
    const mounts = [];

    function readCache() {
        try {
            const v = JSON.parse(localStorage.getItem(CACHE) || "null");
            return v && v.map ? v : null;
        } catch (e) { return null; }
    }

    function load(force) {
        if (loading && !force) return loading;
        const cached = readCache();
        if (cached) map = cached.map;
        if (!force && cached && Date.now() - cached.t < TTL) return (loading = Promise.resolve(map));
        loading = fetch(ENDPOINT + "?videos=1" + (force ? "&t=" + Date.now() : ""), { credentials: "omit" })
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (m) {
                if (m && typeof m === "object") {
                    map = m;
                    try { localStorage.setItem(CACHE, JSON.stringify({ t: Date.now(), map: m })); } catch (e) { /* */ }
                }
                return map || {};
            })
            .catch(function () { return map || {}; });
        return loading;
    }

    function isAdmin() {
        if (window.__deIsAdmin === true) return true;
        try { return window.parent !== window && window.parent.__deIsAdmin === true; } catch (e) { return false; }
    }

    /* https://youtu.be/ID · watch?v=ID · /shorts/ID · /embed/ID · ID */
    function parseId(text) {
        const s = String(text || "").trim();
        if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
        const m = s.match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/|\/live\/)([A-Za-z0-9_-]{11})/);
        return m ? m[1] : "";
    }

    function el(tag, cls, text) {
        const n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text != null) n.textContent = text;
        return n;
    }

    function card(yt, title) {
        const box = el("div", "dv-card");
        const btn = el("button", "dv-thumb");
        btn.type = "button";
        btn.setAttribute("aria-label", "شوف الشرح بالفيديو");
        const img = new Image();
        img.alt = "";
        img.loading = "lazy";
        img.decoding = "async";
        img.src = "https://i.ytimg.com/vi/" + yt + "/hqdefault.jpg";
        btn.appendChild(img);
        btn.appendChild(el("span", "dv-play"));
        const lab = el("span", "dv-label", "🎬 شرح الكلمات المفتاحية");
        btn.appendChild(lab);
        btn.addEventListener("click", function () {
            const frame = document.createElement("iframe");
            frame.className = "dv-frame";
            frame.src = "https://www.youtube-nocookie.com/embed/" + yt
                + "?autoplay=1&rel=0&modestbranding=1&playsinline=1";
            frame.title = title || "Video";
            frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
            frame.setAttribute("allowfullscreen", "");
            btn.replaceWith(frame);
        });
        box.appendChild(btn);
        return box;
    }

    function adminTools(slot, key) {
        const bar = el("div", "dv-admin");
        const has = map && map[key];
        const b = el("button", "dv-admin-btn", has ? "🎬 بدّل الفيديو" : "🎬 زيد فيديو ديال الشرح");
        b.type = "button";
        b.addEventListener("click", async function () {
            const ans = window.prompt("رابط YouTube ديال الشرح (Unlisted).\nخليه خاوي باش تحيد الفيديو.", has ? "https://youtu.be/" + map[key] : "");
            if (ans === null) return;
            const yt = ans.trim() ? parseId(ans) : "";
            if (ans.trim() && !yt) { window.alert("ما عرفتش هاد الرابط ديال YouTube."); return; }
            b.disabled = true;
            b.textContent = "كنحفظو…";
            try {
                const auth = window.__deutschEinfachAuth;
                const user = auth && auth.currentUser;
                const token = user ? await user.getIdToken() : "";
                const res = await fetch(ENDPOINT, {
                    method: "POST",
                    headers: { "Content-Type": "text/plain;charset=UTF-8" },
                    body: JSON.stringify({ adminSetVideo: { key: key, yt: yt }, idToken: token })
                });
                const out = await res.json().catch(function () { return {}; });
                if (!res.ok || !out.ok) throw new Error(out.error || ("HTTP " + res.status));
                map = out.videos || {};
                try { localStorage.setItem(CACHE, JSON.stringify({ t: Date.now(), map: map })); } catch (e) { /* */ }
                repaintAll();
            } catch (e) {
                window.alert("ما تحفظش: " + e.message);
                b.disabled = false;
                b.textContent = has ? "🎬 بدّل الفيديو" : "🎬 زيد فيديو ديال الشرح";
            }
        });
        bar.appendChild(b);
        bar.appendChild(el("span", "dv-admin-key", key));
        return bar;
    }

    function paint(m) {
        const slot = m.slot;
        if (!slot.isConnected) return false;
        slot.textContent = "";
        const yt = map && map[m.key];
        if (yt && navigator.onLine !== false) slot.appendChild(card(yt, m.title));
        if (isAdmin()) slot.appendChild(adminTools(slot, m.key));
        slot.hidden = !slot.firstChild;
        return true;
    }

    function repaintAll() {
        for (let i = mounts.length - 1; i >= 0; i--) {
            if (!paint(mounts[i])) mounts.splice(i, 1);
        }
    }

    window.__deVideo = {
        key: function () {
            return Array.prototype.slice.call(arguments).filter(Boolean).join("-")
                .toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "")
                .replace(/ß/g, "ss").replace(/[^a-z0-9._-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 120);
        },
        mount: function (container, key, opts) {
            if (!container || !key) return null;
            opts = opts || {};
            const slot = el("div", "dv-slot");
            slot.hidden = true;
            if (opts.before && opts.before.parentNode === container) container.insertBefore(slot, opts.before);
            else container.appendChild(slot);
            const m = { slot: slot, key: key, title: opts.title || "" };
            mounts.push(m);
            if (map) paint(m);
            load(false).then(function () { paint(m); });
            return slot;
        },
        /* Lesen: المستوى من الصفحة، الموضوع من ?thema= */
        mountLesen: function (wrap, part, title) {
            const lv = /(^|\/)b1-/.test(location.pathname) ? "b1" : "b2";
            const thema = new URLSearchParams(location.search).get("thema");
            if (!thema || /[?&]embed=1/.test(location.search)) return null;
            const id = thema.toLowerCase().indexOf(lv + "-") === 0 ? thema : lv + "-" + thema;
            return this.mount(wrap, this.key("lesen", id, part), { title: title });
        },
        reload: function () { return load(true).then(repaintAll); }
    };

    document.addEventListener("de-admin", repaintAll);
    window.addEventListener("online", repaintAll);
    window.addEventListener("offline", repaintAll);

    /* الستايل (ملف واحد، بلا CSS زايد) */
    const css = el("style");
    css.textContent =
        ".dv-slot{margin:0 auto 18px;max-width:600px;width:100%}" +
        ".dv-card{border-radius:20px;overflow:hidden;background:#0b1633;box-shadow:0 18px 40px -22px rgba(21,42,94,.6),0 0 0 2px rgba(255,206,0,.55)}" +
        ".dv-thumb{position:relative;display:block;width:100%;aspect-ratio:16/9;border:0;padding:0;margin:0;cursor:pointer;background:#0b1633;overflow:hidden}" +
        ".dv-thumb img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.9}" +
        ".dv-thumb::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,22,51,0) 40%,rgba(11,22,51,.75))}" +
        ".dv-play{position:absolute;left:50%;top:50%;z-index:1;width:72px;height:72px;margin:-36px 0 0 -36px;border-radius:50%;background:#ffce00;box-shadow:0 0 0 10px rgba(255,206,0,.25),0 10px 26px rgba(0,0,0,.45)}" +
        ".dv-play::before{content:'';position:absolute;left:29px;top:22px;border-left:22px solid #152a5e;border-top:14px solid transparent;border-bottom:14px solid transparent}" +
        ".dv-label{position:absolute;z-index:1;right:14px;bottom:12px;color:#fff;font:800 14px/1.3 Cairo,system-ui,sans-serif;direction:rtl}" +
        ".dv-frame{display:block;width:100%;aspect-ratio:16/9;border:0;background:#000}" +
        ".dv-admin{display:flex;align-items:center;justify-content:center;gap:10px;margin-top:8px;direction:rtl;flex-wrap:wrap}" +
        ".dv-admin-btn{border:1.5px dashed #265be3;background:#eef3ff;color:#1b46b3;border-radius:999px;padding:7px 16px;font:800 13.5px Cairo,system-ui,sans-serif;cursor:pointer}" +
        ".dv-admin-btn:disabled{opacity:.6}" +
        ".dv-admin-key{font:600 11px ui-monospace,monospace;color:#8a91a3;direction:ltr}" +
        "@media (max-width:700px){.dv-slot{margin-bottom:14px}.dv-play{width:56px;height:56px;margin:-28px 0 0 -28px}.dv-play::before{left:22px;top:16px;border-left-width:17px;border-top-width:12px;border-bottom-width:12px}}";
    document.head.appendChild(css);
})();
