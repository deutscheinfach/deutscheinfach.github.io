/* ===== Wortschatz: بطاقات مع التكرار (Leitner) =====

   - كنختارو المجموعة (Konnektoren، Verben…) ولا "الكل"
   - الجلسة: البطاقات اللي حان وقتها + حتى 10 جداد
   - الوجه: الكلمة بالألمانية (ورقة بيضة) → كليك/Space كيقلب:
     المعنى بالدارجة + مثال
   - "Gewusst" كتبعدها (1→2→4→7→14 يوم)، "Nochmal" كترجعها للصندوق 1
     وكتعاود فنفس الجلسة
   - "Meine Wörter": المستخدم كيزيد الكلمات ديالو */

(function () {
    "use strict";

    const P = window.DEProgress;
    const V = window.DE_VOCAB;
    const root = document.getElementById("ws-root");
    if (!P || !V || !root) return;

    const NEW_PER_SESSION = 10;
    const ICON = {
        speak: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>',
        check: '<path d="m5 12 5 5 9-10"/>',
        again: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
        trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
        plus: '<path d="M12 5v14M5 12h14"/>',
        list: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6h.01M4 12h.01M4 18h.01"/>',
        cards: '<rect x="3" y="5" width="14" height="16" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v14"/>'
    };
    function svg(name, cls) {
        return '<svg class="' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[name] + "</svg>";
    }
    function esc(s) {
        return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
        });
    }
    function shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; }
        return a;
    }

    let deck = "";
    try { deck = localStorage.getItem("de-ws-deck") || ""; } catch (e) { /* */ }
    let session = null;

    function all() { return V.cards(); }
    function inDeck(c) { return !deck || c.deck === deck; }
    function known(c) { const s = P.card(c.id); return s && s.b >= 4; }

    function stats() {
        const cards = all();
        const due = cards.filter(function (c) { return P.card(c.id) && P.isDue(c.id); }).length;
        document.getElementById("ws-due").textContent = String(due);
        document.getElementById("ws-known").textContent = String(cards.filter(known).length);
        document.getElementById("ws-total").textContent = String(cards.length);
    }

    function startSession() {
        const cards = all().filter(inDeck);
        const due = shuffle(cards.filter(function (c) { return P.card(c.id) && P.isDue(c.id); }));
        const fresh = cards.filter(function (c) { return !P.card(c.id); }).slice(0, NEW_PER_SESSION);
        session = { queue: due.concat(fresh), done: 0, total: due.length + fresh.length, flipped: false, right: 0 };
    }

    function speak(text) {
        if (!window.speechSynthesis) return;
        try {
            speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(text.replace(/\+ ?(Akk|Dat)\./g, "").replace(/…/g, ""));
            u.lang = "de-DE";
            u.rate = 0.92;
            const voice = speechSynthesis.getVoices().find(function (v) { return /^de/i.test(v.lang); });
            if (voice) u.voice = voice;
            speechSynthesis.speak(u);
        } catch (e) { /* */ }
    }

    function deckName(key) {
        const d = V.decks().find(function (x) { return x.key === key; });
        return d ? d.name : "";
    }

    function chipsHtml() {
        const cards = all();
        const chips = [{ key: "", name: "Alle", n: cards.length }].concat(V.decks().map(function (d) {
            return { key: d.key, name: d.name, n: cards.filter(function (c) { return c.deck === d.key; }).length };
        })).filter(function (c) { return c.n > 0 || c.key === "meine"; });
        return '<div class="ws-chips" role="tablist">' + chips.map(function (c) {
            return '<button type="button" class="ws-chip' + (c.key === deck ? " is-on" : "") + '" data-deck="' + esc(c.key) + '">' + esc(c.name) + "<span>" + c.n + "</span></button>";
        }).join("") + "</div>";
    }

    function stageHtml() {
        if (!session) startSession();
        const card = session.queue[0];
        if (!card) {
            const next = all().filter(inDeck).filter(function (c) { return P.card(c.id); })
                .map(function (c) { return P.card(c.id).d; }).sort()[0];
            return '<div class="tr-card ws-done"><b>' + (session.total ? "Super! Fertig für heute 🎉" : "Alles wiederholt ✓") + "</b>" +
                '<p class="tr-muted">' + (session.total ? "صححتي " + session.right + " من " + session.total + " من المرة الأولى." : "ما كاين حتى بطاقة كتسناك دابا فهاد المجموعة.") +
                (next ? " البطاقات الجايين: " + new Date(next + "T00:00:00").toLocaleDateString("de-DE") : "") + "</p>" +
                '<div class="tr-row" style="justify-content:center;margin-top:12px"><button class="tr-btn tr-btn-gold" type="button" data-act="more">' + svg("plus") + "10 neue Karten</button></div></div>";
        }
        const pctDone = session.total ? Math.round(session.done / session.total * 100) : 0;
        const box = (P.card(card.id) || {}).b || 0;
        return '<div class="ws-progress"><span>' + session.done + " / " + session.total + '</span><div class="tr-bar"><i style="width:' + pctDone + '%"></i></div>' +
            '<span class="ws-level" title="Box ' + box + '">' + [1, 2, 3, 4, 5].map(function (i) { return '<i class="' + (i <= box ? "on" : "") + '"></i>'; }).join("") + "</span></div>" +
            '<div class="ws-flash' + (session.flipped ? " is-flipped" : "") + '" id="ws-flash" tabindex="0" role="button" aria-label="Karte umdrehen"><div class="ws-flash-in">' +
            '<div class="ws-face ws-front"><button type="button" class="ws-speak" data-act="speak" aria-label="Aussprache">' + svg("speak") + "</button>" +
            '<span class="ws-deck">' + esc(deckName(card.deck)) + '</span><span class="ws-word">' + esc(card.de) + '</span><span class="ws-hint">Tippen zum Umdrehen · برك باش تقلب</span></div>' +
            '<div class="ws-face ws-back"><button type="button" class="ws-speak" data-act="speak" aria-label="Aussprache">' + svg("speak") + "</button>" +
            '<span class="ws-word" style="font-size:20px">' + esc(card.de) + '</span><span class="ws-ar" dir="rtl">' + esc(card.ar) + "</span>" +
            (card.ex ? '<span class="ws-ex">„' + esc(card.ex) + "“</span>" : "") + "</div></div></div>" +
            '<div class="ws-actions"><button class="tr-btn tr-btn-red" type="button" data-act="again"' + (session.flipped ? "" : " disabled") + ">" + svg("again") + "Nochmal</button>" +
            '<button class="tr-btn tr-btn-gold" type="button" data-act="ok"' + (session.flipped ? "" : " disabled") + ">" + svg("check") + "Gewusst</button></div>" +
            '<p class="ws-keys">Space = umdrehen · ← Nochmal · → Gewusst</p>';
    }

    function mineHtml() {
        const mine = P.custom();
        const list = mine.length
            ? '<ul class="ws-table">' + mine.slice().reverse().map(function (w) {
                const box = (P.card(w.id) || {}).b || 0;
                return "<li><span><b>" + esc(w.de) + '</b> <span class="ws-level">' + [1, 2, 3, 4, 5].map(function (i) { return '<i class="' + (i <= box ? "on" : "") + '"></i>'; }).join("") +
                    '</span></span><span class="ar" dir="rtl">' + esc(w.ar) + '</span><button type="button" class="ws-del" data-del="' + esc(w.id) + '" aria-label="Löschen">' + svg("trash") + "</button></li>";
            }).join("") + "</ul>"
            : '<p class="tr-muted">مازال ما زدتي حتى كلمة. زيد الكلمات اللي كتلقاهم فالنصوص وما كتعرفهمش.</p>';
        return '<div class="tr-card"><h2>' + svg("plus", "ico") + "Meine Wörter · زيد كلمة</h2>" +
            '<form class="ws-form" id="ws-form" autocomplete="off"><input name="de" placeholder="Deutsch · مثلا: die Rechnung" required maxlength="80">' +
            '<input name="ar" placeholder="المعنى بالعربية" dir="rtl" maxlength="120">' +
            '<input class="full" name="ex" placeholder="Beispielsatz (optional)" maxlength="200">' +
            '<button class="tr-btn tr-btn-gold full" type="submit">' + svg("plus") + "Hinzufügen</button></form>" +
            '<div class="tr-section">' + list + "</div></div>";
    }

    function listHtml() {
        const cards = all().filter(inDeck).filter(function (c) { return c.deck !== "meine"; });
        if (!cards.length) return "";
        return '<details class="tr-card tr-section"><summary style="cursor:pointer;font-weight:800;display:flex;align-items:center;gap:8px">' + svg("list", "ico") +
            "Alle Karten ansehen (" + cards.length + ')</summary><ul class="ws-table tr-section">' + cards.map(function (c) {
                const box = (P.card(c.id) || {}).b || 0;
                return "<li><span><b>" + esc(c.de) + '</b> <span class="ws-level">' + [1, 2, 3, 4, 5].map(function (i) { return '<i class="' + (i <= box ? "on" : "") + '"></i>'; }).join("") +
                    '</span></span><span class="ar" dir="rtl">' + esc(c.ar) + "</span><span></span></li>";
            }).join("") + "</ul></details>";
    }

    function render() {
        stats();
        root.innerHTML = chipsHtml() +
            '<div class="tr-grid" style="grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);align-items:start" id="ws-grid">' +
            '<div class="ws-stage" id="ws-stage">' + stageHtml() + "</div>" + mineHtml() + "</div>" + listHtml();
        const grid = document.getElementById("ws-grid");
        if (window.matchMedia("(max-width: 900px)").matches) grid.style.gridTemplateColumns = "minmax(0,1fr)";
    }
    function renderStage() {
        const stage = document.getElementById("ws-stage");
        if (stage) stage.innerHTML = stageHtml();
        stats();
    }

    function flip() {
        if (!session || !session.queue[0]) return;
        session.flipped = !session.flipped;
        const f = document.getElementById("ws-flash");
        if (f) f.classList.toggle("is-flipped", session.flipped);
        document.querySelectorAll('[data-act="again"],[data-act="ok"]').forEach(function (b) { b.disabled = !session.flipped; });
    }
    function answer(ok) {
        if (!session || !session.queue[0] || !session.flipped) return;
        const card = session.queue.shift();
        if (!card.retried && ok) session.right++;
        P.grade(card.id, ok);
        if (ok) session.done++;
        else { card.retried = true; session.queue.splice(Math.min(3, session.queue.length), 0, card); }
        session.flipped = false;
        renderStage();
    }

    root.addEventListener("click", function (e) {
        const chip = e.target.closest(".ws-chip");
        if (chip) {
            deck = chip.dataset.deck;
            try { localStorage.setItem("de-ws-deck", deck); } catch (err) { /* */ }
            session = null;
            render();
            return;
        }
        const act = e.target.closest("[data-act]");
        if (act) {
            e.stopPropagation();
            const card = session && session.queue[0];
            if (act.dataset.act === "speak" && card) speak(card.de);
            if (act.dataset.act === "again") answer(false);
            if (act.dataset.act === "ok") answer(true);
            if (act.dataset.act === "more") {
                const fresh = all().filter(inDeck).filter(function (c) { return !P.card(c.id); }).slice(0, NEW_PER_SESSION);
                session = { queue: fresh, done: 0, total: fresh.length, flipped: false, right: 0 };
                renderStage();
            }
            return;
        }
        if (e.target.closest("#ws-flash")) { flip(); return; }
        const del = e.target.closest("[data-del]");
        if (del && confirm("Wort löschen? · نمسحو هاد الكلمة؟")) {
            P.removeCustom(del.dataset.del);
            session = null;
            render();
        }
    });

    root.addEventListener("submit", function (e) {
        if (e.target.id !== "ws-form") return;
        e.preventDefault();
        const f = e.target;
        const w = P.addCustom(f.de.value, f.ar.value, f.ex.value);
        if (w) {
            deck = "meine";
            try { localStorage.setItem("de-ws-deck", deck); } catch (err) { /* */ }
            session = null;
            render();
        }
    });

    document.addEventListener("keydown", function (e) {
        if (e.target.closest && e.target.closest("input, textarea")) return;
        if (e.key === " " || e.key === "Enter") { if (document.getElementById("ws-flash")) { e.preventDefault(); flip(); } }
        else if (e.key === "ArrowLeft") answer(false);
        else if (e.key === "ArrowRight") answer(true);
    });

    render();
    /* من بعد المزامنة: إلا مازال ما بدا، كنعاودو الجلسة بالمعطيات الجداد */
    P.sync().then(function () {
        if (!session || (session.done === 0 && !session.flipped)) { session = null; render(); }
        else stats();
    });
})();
