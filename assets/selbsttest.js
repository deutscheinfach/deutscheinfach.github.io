/* ===== «اختبر نفسك»: امتحان كامل عشوائي (Premium) =====

   كل مرة كوكتيل جديد: كل جزء من موضوع مختار بالقرعة من گاع المواضيع
   (المجانيين و Premium):
     Lesen Teil 1-3 + Sprachbausteine 1-2 → b2-lesen.html?pruefung=mix (iframe)
     Hören Teil 1-3                      → b2-hoeren-teilN.html?thema=X (iframe)
   بار واحد فوق فيه الأجزاء الثمانية بحال telc، ووقت واحد (90 دقيقة).
   التصحيح كامل ف اللخر، ومن بعد صفحة النتيجة: المجموع، النسبة، كل جزء
   بوحدو، المشاركة، «امتحان عشوائي جديد» و «الصفحة الرئيسية».

   الصفحات اللي داخل الـiframe (?embed=1&nav=0) كيخبيو البار والأزرار
   ديالهم، والنقط كتجي بالأحداث lesen-points و hoeren-points. */

(function () {
    "use strict";

    const root = document.getElementById("st-root");
    if (!root) return;

    const STATE_KEY = "de-st-state";
    /* عدد المواضيع ف كل جزء ديال Hören (b1/b2-hoeren-teilN.html) */
    const HOEREN_COUNT = { b1: [23, 20, 22], b2: [62, 71, 59] };
    const LEVEL_KEY = "de-st-level";
    function chosenLevel() {
        try { const v = localStorage.getItem(LEVEL_KEY); if (v === "b1" || v === "b2") return v; } catch (e) { /* */ }
        return "b2";
    }
    function lv() { return (state && state.level) || chosenLevel(); }
    const LIMIT_MIN = 90;
    const TOTAL = 180, PASS = 108;
    const PARTS = [
        { key: "teil1",   grp: "lesen",  kind: "Lesen",  nr: "Teil 1", max: 25, name: "Lesen Teil 1" },
        { key: "teil2",   grp: "lesen",  kind: "Lesen",  nr: "Teil 2", max: 25, name: "Lesen Teil 2" },
        { key: "teil3",   grp: "lesen",  kind: "Lesen",  nr: "Teil 3", max: 25, name: "Lesen Teil 3" },
        { key: "sprach1", grp: "lesen",  kind: "SB",     nr: "Teil 1", max: 15, name: "Sprachbausteine Teil 1" },
        { key: "sprach2", grp: "lesen",  kind: "SB",     nr: "Teil 2", max: 15, name: "Sprachbausteine Teil 2" },
        { key: "h1",      grp: "hoeren", kind: "Hören",  nr: "Teil 1", max: 25, name: "Hören Teil 1", sub: 0 },
        { key: "h2",      grp: "hoeren", kind: "Hören",  nr: "Teil 2", max: 25, name: "Hören Teil 2", sub: 1 },
        { key: "h3",      grp: "hoeren", kind: "Hören",  nr: "Teil 3", max: 25, name: "Hören Teil 3", sub: 2 }
    ];

    const ICON = {
        clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
        back: '<path d="M15 18l-6-6 6-6"/>',
        check: '<path d="m5 12 5 5 9-10"/>',
        x: '<path d="M18 6 6 18M6 6l12 12"/>',
        share: '<path d="M12 3v13"/><path d="m8 7 4-4 4 4"/><path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/>',
        home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
        alert: '<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/>',
        dice: '<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8" cy="8" r="1.3" fill="currentColor"/><circle cx="16" cy="8" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="8" cy="16" r="1.3" fill="currentColor"/><circle cx="16" cy="16" r="1.3" fill="currentColor"/>'
    };
    function svg(name, size) {
        return '<svg viewBox="0 0 24 24" width="' + (size || 18) + '" height="' + (size || 18) + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[name] + "</svg>";
    }
    function esc(s) {
        return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
        });
    }
    function fmt(n) { return (Math.round(n * 2) / 2).toString().replace(".", ","); }
    function pad(n) { return String(n).padStart(2, "0"); }
    function premium() { return window.__deutschEinfachIsPremium === true; }

    /* ---------- القرعة ---------- */
    function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
    function mixPick() {
        const topics = window["LESEN_" + lv().toUpperCase() + "_TOPICS"] || [];
        const lesen = PARTS.filter(function (p) { return p.grp === "lesen"; }).map(function (p) {
            const pool = topics.filter(function (t) { return (t.parts || []).indexOf(p.key) !== -1; });
            return pool.length ? pick(pool).id : "";
        });
        const hoeren = HOEREN_COUNT[lv()].map(function (count) { return 1 + Math.floor(Math.random() * count); });
        return { lesen: lesen, hoeren: hoeren };
    }
    function lesenTitle(id) {
        const t = (window["LESEN_" + lv().toUpperCase() + "_TOPICS"] || []).find(function (x) { return x.id === id; });
        return t ? t.title : "";
    }

    /* ---------- الحالة ---------- */
    let state = null;
    function save() { try { sessionStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch (e) { /* */ } }
    function load() { try { return JSON.parse(sessionStorage.getItem(STATE_KEY) || "null"); } catch (e) { return null; } }
    function clear() { state = null; try { sessionStorage.removeItem(STATE_KEY); } catch (e) { /* */ } }

    function points(p) {
        return p.grp === "lesen" ? state.lesen[p.key] : state.hoeren["teil" + (p.sub + 1)];
    }
    function sums() {
        let total = 0;
        PARTS.forEach(function (p) { total += points(p) || 0; });
        return total;
    }

    /* ---------- البداية ---------- */
    function renderStart() {
        document.documentElement.classList.remove("is-exam-focus");
        document.body.classList.remove("st-running");
        const head = document.getElementById("st-head");
        if (head) head.hidden = false;
        const last = (window.DEProgress && window.DEProgress.results().filter(function (r) {
            return r.skill === "modelltest" && r.topic === "modelltest-random";
        }).pop()) || null;
        const L = chosenLevel();
        paintLevel(true);
        root.innerHTML = '<section class="mt-rand">' +
            '<span class="mt-rand-chip">امتحان كامل · telc ' + L.toUpperCase() + " · " + (premium() ? "Premium ✓" : "Premium 👑") + "</span>" +
            "<h2>محاكاة الامتحان الكامل</h2>" +
            '<p class="mt-rand-lead">كل مرة كتضغط، كنصاوبو ليك <b>كوكتيل</b> ديال امتحان جديد: كل جزء ديال Lesen و Sprachbausteine و Hören جاي من موضوع مختلف. ' +
            "هكا ما كتحفظش الأجوبة — كتواجه أسئلة جديدة بحال نهار الامتحان الحقيقي.</p>" +
            '<div class="mt-rand-grid">' +
            '<div class="mt-rand-f"><i>🔀</i><div><b>خلط عشوائي</b><span>كل Teil من نموذج امتحان مختلف</span></div></div>' +
            '<div class="mt-rand-f"><i>⏱️</i><div><b>بالوقت بحال telc</b><span>90 دقيقة لـ Lesen و Hören</span></div></div>' +
            '<div class="mt-rand-f"><i>🎯</i><div><b>نتيجة كاملة</b><span>من 180 نقطة · كل جزء بوحدو</span></div></div>' +
            "</div>" +
            (last ? '<p class="mt-last">آخر محاولة: <b>' + fmt(last.points) + " / " + (last.max || TOTAL) + "</b> · " + new Date(last.at).toLocaleDateString("de-DE") + "</p>" : "") +
            '<button class="mt-rand-go" type="button" data-act="start">' + svg("dice", 22) + "<span>بدا امتحان عشوائي</span><em>←</em></button>" +
            "</section>";
    }

    /* B1 / B2 فوق «اختبر نفسك» (#st-level ف الصفحة) */
    function paintLevel(visible) {
        const box = document.getElementById("st-level");
        if (!box) return;
        box.hidden = !visible;
        if (!visible) return;
        const L = chosenLevel();
        box.innerHTML = ["b1", "b2"].map(function (x) {
            return '<button type="button" role="tab" data-lv="' + x + '" class="' + (x === L ? "is-on" : "") + '" aria-selected="' + (x === L) + '">' + x.toUpperCase() + "</button>";
        }).join("");
    }
    const levelBox = document.getElementById("st-level");
    if (levelBox) levelBox.addEventListener("click", function (e) {
        const b = e.target.closest("[data-lv]");
        if (!b || state) return;
        try { localStorage.setItem(LEVEL_KEY, b.dataset.lv); } catch (err) { /* */ }
        renderStart();
    });

    function askStart() {
        if (!premium()) {
            if (typeof window.__deLocked === "function") {
                window.__deLocked({
                    heading: "خاص بالمشتركين Premium",
                    text: "اشترك ف Premium باش تفتح «اختبر نفسك» وتدوز امتحانات مخلطة وجديدة ف كل مرة: Lesen و Sprachbausteine و Hören بالوقت بحال telc."
                });
            } else location.href = "payment.html";
            return;
        }
        start();
    }

    function start() {
        state = { level: chosenLevel(), mix: null, at: 0, deadline: Date.now() + LIMIT_MIN * 60000, lesen: {}, hoeren: {}, titles: {}, done: false, saved: false };
        state.mix = mixPick();
        state.mix.lesen.forEach(function (id, i) { state.titles[PARTS[i].key] = lesenTitle(id); });
        save();
        renderExam();
    }

    /* ---------- الامتحان ---------- */
    let timer = 0;
    let lesenFrame = null;
    const hoerenFrames = [];

    function frameSrc(p) {
        if (p.grp === "lesen") {
            return lv() + "-lesen.html?pruefung=mix&mix=" + encodeURIComponent(state.mix.lesen.join(",")) + "&teil=teil1&embed=1&nav=0";
        }
        return lv() + "-hoeren-teil" + (p.sub + 1) + ".html?thema=" + state.mix.hoeren[p.sub] + "&embed=1&nav=0";
    }

    function hook(frame, grp, sub) {
        frame.addEventListener("load", function () {
            let w, doc;
            try { w = frame.contentWindow; doc = frame.contentDocument; w.addEventListener; } catch (e) { return; }
            if (grp === "lesen") {
                w.addEventListener("lesen-points", function (e) {
                    const d = e.detail || {};
                    const p = PARTS.find(function (x) { return x.key === d.part; });
                    if (p) { state.lesen[p.key] = Math.min(p.max, Number(d.points) || 0); save(); paintTabs(); }
                });
                syncLesen();
            } else {
                w.addEventListener("hoeren-points", function (e) {
                    const d = e.detail || {};
                    if (d.total > 0 && /^teil[123]$/.test(d.teil)) {
                        state.hoeren[d.teil] = Math.round(d.right / d.total * 25 * 2) / 2;
                        if (d.title) state.titles["h" + d.teil.slice(-1)] = d.title;
                        save(); paintTabs();
                    }
                });
                /* السمية ديال الموضوع (للنتيجة) */
                setTimeout(function () {
                    try {
                        const t = doc.querySelector(".theme-item-title");
                        if (t && !state.titles["h" + (sub + 1)]) { state.titles["h" + (sub + 1)] = t.textContent.trim(); save(); }
                    } catch (e) { /* */ }
                }, 800);
            }
        });
    }

    /* الجزء ديال Lesen اللي باين خاصو يتبدل داخل الـiframe */
    function syncLesen() {
        const p = PARTS[state.at];
        if (!lesenFrame || p.grp !== "lesen") return;
        let w = null;
        try { w = lesenFrame.contentWindow; } catch (e) { return; }
        if (w && typeof w.__examGo === "function") w.__examGo(p.key);
        else setTimeout(syncLesen, 300);
    }

    function renderExam() {
        clearInterval(timer);
        hoerenFrames.length = 0;
        document.documentElement.classList.add("is-exam-focus");
        document.body.classList.add("st-running");
        paintLevel(false);
        const head = document.getElementById("st-head");
        if (head) head.hidden = true;

        root.innerHTML =
            '<div class="st-bar"><div class="st-bar-in">' +
            '<button class="st-back" type="button" data-act="exit" title="خرج من الامتحان">' + svg("back", 20) + "</button>" +
            '<div class="st-meta"><span class="st-lvl">' + lv().toUpperCase() + '</span><b>اختبر نفسك</b></div>' +
            '<nav class="st-tabs" aria-label="الأجزاء">' + PARTS.map(function (p, i) {
                return '<button type="button" class="st-tab" data-tab="' + i + '"><small>' + p.kind + "</small><b>" + p.nr + "</b><em>" + p.max + "P</em></button>";
            }).join("") + "</nav>" +
            '<span class="st-timer" id="st-timer">' + svg("clock", 17) + '<span id="st-timer-t">--:--</span></span>' +
            "</div></div>" +
            '<div class="st-frames">' +
            '<iframe class="st-frame" data-grp="lesen" title="Lesen" src="' + frameSrc(PARTS[0]) + '"></iframe>' +
            [5, 6, 7].map(function (i) {
                return '<iframe class="st-frame" data-grp="hoeren" data-sub="' + PARTS[i].sub + '" title="' + PARTS[i].name + '" hidden src="' + frameSrc(PARTS[i]) + '"></iframe>';
            }).join("") + "</div>" +
            '<div class="st-foot"><div class="st-foot-in">' +
            '<button class="tr-btn" type="button" data-act="prev">السابق</button>' +
            '<button class="tr-btn tr-btn-gold" type="button" data-act="next" id="st-next"></button>' +
            "</div></div>";

        lesenFrame = root.querySelector('iframe[data-grp="lesen"]');
        hook(lesenFrame, "lesen", 0);
        root.querySelectorAll('iframe[data-grp="hoeren"]').forEach(function (f) {
            const sub = Number(f.dataset.sub);
            hoerenFrames[sub] = f;
            hook(f, "hoeren", sub);
        });
        /* الإطار كيبدا نيشان تحت البار (البار كتبدل الطول ف التيليفون) */
        const bar = root.querySelector(".st-bar");
        const setH = function () { document.documentElement.style.setProperty("--st-bar-h", bar.offsetHeight + "px"); };
        setH();
        if (window.ResizeObserver) new ResizeObserver(setH).observe(bar);
        show(state.at);
        tick();
        timer = setInterval(tick, 1000);
    }

    function show(i) {
        state.at = Math.max(0, Math.min(PARTS.length - 1, i));
        save();
        const p = PARTS[state.at];
        if (lesenFrame) lesenFrame.hidden = p.grp !== "lesen";
        hoerenFrames.forEach(function (f, k) { if (f) f.hidden = !(p.grp === "hoeren" && p.sub === k); });
        if (p.grp === "lesen") syncLesen();
        paintTabs();
        const next = document.getElementById("st-next");
        const last = state.at === PARTS.length - 1;
        if (next) next.innerHTML = last ? svg("check", 17) + "صحح وشوف النتيجة" : PARTS[state.at + 1].name + " →";
        if (next) next.dataset.act = last ? "finish" : "next";
        const prev = root.querySelector('[data-act="prev"]');
        if (prev) prev.disabled = state.at === 0;
        const tab = root.querySelector('.st-tab[data-tab="' + state.at + '"]');
        if (tab && tab.scrollIntoView) tab.scrollIntoView({ block: "nearest", inline: "center" });
        window.scrollTo({ top: 0 });
    }

    function paintTabs() {
        root.querySelectorAll(".st-tab").forEach(function (b, i) {
            b.classList.toggle("is-on", i === state.at);
            b.classList.toggle("is-seen", points(PARTS[i]) != null);
        });
    }

    function tick() {
        const el = document.getElementById("st-timer-t");
        if (!el || !state || state.done) return;
        const left = Math.max(0, Math.round((state.deadline - Date.now()) / 1000));
        el.textContent = pad(Math.floor(left / 60)) + ":" + pad(left % 60);
        document.getElementById("st-timer").classList.toggle("is-low", left <= 300);
        if (left === 0 && !document.querySelector(".tr-modal[data-timeup]")) {
            const m = modal('<h2 style="justify-content:center">' + svg("clock") + " سالا الوقت!</h2>" +
                '<p class="tr-muted">الأجوبة اللي درتي كيتحسبو. يلاه نشوفو النتيجة.</p>' +
                '<div class="tr-row" style="justify-content:center;margin-top:12px"><button class="tr-btn tr-btn-gold" type="button" data-ok>شوف النتيجة</button></div>');
            m.dataset.timeup = "1";
            m.querySelector("[data-ok]").addEventListener("click", function () { m.remove(); finish(); });
        }
    }

    function modal(html) {
        const m = document.createElement("div");
        m.className = "tr-modal";
        m.innerHTML = '<div class="tr-card tr-card-gold">' + html + "</div>";
        document.body.appendChild(m);
        return m;
    }

    function askFinish() {
        const m = modal('<h2 style="justify-content:center">' + svg("check") + " نصححو الامتحان؟</h2>" +
            '<p class="tr-muted">غادي نصححو الأجزاء الثمانية كاملين ونوريوك النتيجة. ماغاديش تقدر تبدل الأجوبة من بعد.</p>' +
            '<div class="tr-row" style="justify-content:center;margin-top:12px"><button class="tr-btn" type="button" data-no>رجع للامتحان</button><button class="tr-btn tr-btn-gold" type="button" data-yes>صحح دابا</button></div>');
        m.querySelector("[data-no]").addEventListener("click", function () { m.remove(); });
        m.querySelector("[data-yes]").addEventListener("click", function () { m.remove(); finish(); });
    }

    /* التصحيح: كنضغطو أزرار التصحيح داخل الـiframes، والنقط كتجي بالأحداث */
    function finish() {
        clearInterval(timer);
        try { if (lesenFrame && typeof lesenFrame.contentWindow.__examGradeAll === "function") lesenFrame.contentWindow.__examGradeAll(); } catch (e) { /* */ }
        hoerenFrames.forEach(function (f) {
            try { f.contentDocument.querySelectorAll(".nq-btn-check").forEach(function (b) { b.click(); }); } catch (e) { /* */ }
        });
        root.querySelector(".st-frames").insertAdjacentHTML("beforebegin", '<p class="st-grading">كنصححو…</p>');
        setTimeout(function () {
            /* جزء ما تصححش (ماتحملش) = 0 */
            PARTS.forEach(function (p) {
                if (p.grp === "lesen" && state.lesen[p.key] == null) state.lesen[p.key] = 0;
                if (p.grp === "hoeren" && state.hoeren["teil" + (p.sub + 1)] == null) state.hoeren["teil" + (p.sub + 1)] = 0;
            });
            state.done = true;
            save();
            renderResult();
        }, 1200);
    }

    /* ---------- النتيجة ---------- */
    function renderResult() {
        clearInterval(timer);
        paintLevel(false);
        document.documentElement.classList.remove("is-exam-focus");
        document.body.classList.remove("st-running");
        const head = document.getElementById("st-head");
        if (head) head.hidden = true;
        const total = sums();
        const pass = total >= PASS;
        const pct = Math.round(total / TOTAL * 100);

        if (!state.saved && window.DEProgress) {
            window.DEProgress.add({
                skill: "modelltest", part: "schriftlich", topic: "modelltest-random", title: "اختبر نفسك " + lv().toUpperCase(),
                points: total, max: TOTAL,
                detail: { lesen: (state.lesen.teil1 || 0) + (state.lesen.teil2 || 0) + (state.lesen.teil3 || 0),
                          sprach: (state.lesen.sprach1 || 0) + (state.lesen.sprach2 || 0),
                          hoeren: (state.hoeren.teil1 || 0) + (state.hoeren.teil2 || 0) + (state.hoeren.teil3 || 0) }
            });
            state.saved = true;
            save();
        }

        root.innerHTML =
            '<section class="st-res ' + (pass ? "is-pass" : "is-fail") + '">' +
            '<span class="st-res-badge">' + svg(pass ? "check" : "alert", 15) + (pass ? "Bestanden · نجحتي" : "Nicht bestanden · ما نجحتيش") + "</span>" +
            "<h1>" + (pass ? "مبروك، نجحتي! 🎉" : "للأسف، ما نجحتيش هاد المرة.") + "</h1>" +
            "<p>" + (pass
                ? "جبتي أكثر من 60٪ — بهاد المستوى غادي تدوز الامتحان الحقيقي. كمل هاكا!"
                : "خاصك 60٪ (108 نقطة) باش تنجح. شوف التحليل لتحت وركز على الأجزاء الضعيفة.") + "</p>" +
            '<div class="st-res-stats">' +
            '<div><span>النتيجة الإجمالية</span><b>' + fmt(total) + " <small>/ " + TOTAL + "</small></b></div>" +
            '<div><span>النسبة المئوية</span><b class="st-c">' + pct + "%</b></div>" +
            '<div><span>التقييم</span><b class="st-c">' + (pass ? "ناجح" : "ما نجحش") + "</b></div>" +
            "</div></section>" +
            '<div class="st-res-actions">' +
            (window.DEShare ? '<button class="tr-btn tr-btn-gold" type="button" data-act="share">' + svg("share", 17) + "شارك النتيجة</button>" : "") +
            '<button class="tr-btn" type="button" data-act="again">' + svg("dice", 17) + "امتحان عشوائي جديد</button>" +
            '<a class="tr-btn" href="index.html">' + svg("home", 17) + "الصفحة الرئيسية</a>" +
            "</div>" +
            '<h2 class="st-res-h">نتائج مفصلة</h2>' +
            '<div class="st-res-list">' + PARTS.map(function (p) {
                const pts = points(p) || 0;
                const ok = pts / p.max >= 0.6;
                const title = state.titles[p.key] || (p.grp === "hoeren" ? "Thema " + state.mix.hoeren[p.sub] : "");
                return '<div class="st-row"><div class="st-row-name"><b>' + esc(p.name) + '</b><span class="st-chip ' + (ok ? "ok" : "bad") + '">' + (ok ? "ناجح" : "راسب") + "</span>" +
                    (title ? "<small>" + esc(title) + "</small>" : "") + "</div>" +
                    '<div class="st-row-bar"><i class="' + (ok ? "ok" : "bad") + '" style="width:' + Math.round(pts / p.max * 100) + '%"></i></div>' +
                    '<div class="st-row-pts"><b>' + fmt(pts) + "</b> / " + p.max + "</div></div>";
            }).join("") + "</div>";
        window.scrollTo({ top: 0 });
    }

    function share() {
        if (!window.DEShare || !state) return;
        const total = sums();
        let streak = 0;
        try { streak = (window.DEProgress && window.DEProgress.streak()) || 0; } catch (e) { /* */ }
        window.DEShare.open({
            kind: "modelltest-random",
            title: "اختبر نفسك · telc " + lv().toUpperCase(),
            score: Math.round(total * 2) / 2,
            max: TOTAL,
            pass: total >= PASS,
            rows: [
                ["Leseverstehen", (state.lesen.teil1 || 0) + (state.lesen.teil2 || 0) + (state.lesen.teil3 || 0), 75],
                ["Sprachbausteine", (state.lesen.sprach1 || 0) + (state.lesen.sprach2 || 0), 30],
                ["Hörverstehen", (state.hoeren.teil1 || 0) + (state.hoeren.teil2 || 0) + (state.hoeren.teil3 || 0), 75]
            ],
            streak: streak,
            shareText: (total >= PASS ? "نجحت ف «اختبر نفسك» telc " + lv().toUpperCase() + " — " : "درت «اختبر نفسك» telc " + lv().toUpperCase() + " — ") + fmt(total) + "/" + TOTAL + " 💪"
        });
    }

    /* ---------- الأحداث ---------- */
    root.addEventListener("click", function (e) {
        const tab = e.target.closest("[data-tab]");
        if (tab && state) { show(Number(tab.dataset.tab)); return; }
        const act = e.target.closest("[data-act]");
        if (!act) return;
        const a = act.dataset.act;
        if (a === "start") askStart();
        else if (a === "next" && state) show(state.at + 1);
        else if (a === "prev" && state) show(state.at - 1);
        else if (a === "finish") askFinish();
        else if (a === "share") share();
        else if (a === "again") { clear(); askStart(); }
        else if (a === "exit") {
            /* خروج نيشان بضغطة وحدة */
            clearInterval(timer); clear(); renderStart(); window.scrollTo({ top: 0 });
        }
    });

    window.addEventListener("beforeunload", function (e) {
        if (state && !state.done) { e.preventDefault(); e.returnValue = ""; }
    });
    document.addEventListener("de-premium", function () { if (!state) renderStart(); });

    state = load();
    if (state && state.done) renderResult();
    else if (state && state.mix) renderExam();
    else { state = null; renderStart(); }
})();
