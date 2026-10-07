/* ===== أنيماسيون خفاف للصفحات ديال الأقسام =====

   1) الأرقام (.lesen-stat b: «192 مواضيع»، «28 نماذج»…) كيعدو من 0
      ملي كيبانو.
   2) البطاقات (.lesen-card، .part-card) كيطلعو وحدة بوحدة ملي كيوصلو
      ليهم — حتى اللي كيتزادو من بعد (البحث، تبديل B1/B2…).
   3) Confetti بالألوان ديال ألمانيا ملي الطالب كيجيب النقطة كاملة
      (lesen-points / hoeren-points)، غير ملي جاوب هو — ماشي «شوف الحل».

   prefers-reduced-motion → والو. داخل Modelltest / اختبر نفسك (?embed=1)
   ماكاينش confetti. */
(function () {
    "use strict";

    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var EMBED = /[?&]embed=1/.test(location.search);
    var root = document.documentElement;

    var css = document.createElement("style");
    css.textContent =
        "html.fx-on .fx-wait{opacity:0;transform:translateY(22px) scale(.97)}" +
        "html.fx-on .fx-anim{transition:opacity .55s ease,transform .7s cubic-bezier(.2,.9,.3,1.15)!important}" +
        ".fx-confetti{position:fixed;inset:0;z-index:2147483000;pointer-events:none}";
    document.head.appendChild(css);
    root.classList.add("fx-on");

    /* ---------- 2) البطاقات ---------- */
    var CARDS = ".lesen-card, .part-card";
    var queue = [], flushQueued = false;
    var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            io.unobserve(e.target);
            queue.push(e.target);
        });
        if (queue.length && !flushQueued) { flushQueued = true; requestAnimationFrame(flush); }
    }, { rootMargin: "0px 0px -6% 0px" }) : null;

    function flush() {
        flushQueued = false;
        queue.splice(0).forEach(function (card, i) {
            card.style.transitionDelay = Math.min(i, 8) * 70 + "ms";
            card.classList.add("fx-anim");
            card.classList.remove("fx-wait");
            setTimeout(function () {
                card.classList.remove("fx-anim");
                card.style.transitionDelay = "";
            }, 1400);
        });
    }
    function watch(card) {
        if (!io || card.__fx) return;
        card.__fx = true;
        card.classList.add("fx-wait");
        io.observe(card);
    }
    function scanCards(scope) {
        if (scope.matches && scope.matches(CARDS)) watch(scope);
        if (scope.querySelectorAll) scope.querySelectorAll(CARDS).forEach(watch);
    }

    /* ---------- 1) الأرقام ---------- */
    function countUp(el) {
        if (el.__fxCount) return;
        var text = el.textContent.trim();
        if (!/^\d{2,4}$/.test(text)) return;
        el.__fxCount = true;
        var to = parseInt(text, 10), t0 = 0, last = null;
        function step(now) {
            /* إلا بدل الكود ديال الصفحة الرقم وسط الأنيماسيون، كنحبسو ونخليو ديالو */
            if (last !== null && el.textContent !== last) return;
            if (!t0) t0 = now;
            var k = Math.min(1, (now - t0) / 1100);
            last = String(Math.round(to * (1 - Math.pow(1 - k, 3))));
            el.textContent = last;
            if (k < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }
    function scanCounters() {
        document.querySelectorAll(".lesen-stat b").forEach(function (el) {
            if (!io) return countUp(el);
            var o = new IntersectionObserver(function (es) {
                if (es[0].isIntersecting) { o.disconnect(); countUp(el); }
            });
            o.observe(el);
        });
    }

    /* ---------- 3) Confetti ---------- */
    var COLORS = ["#111111", "#dd0000", "#ffce00", "#f2b705", "#ffffff", "#b30e30"];
    function confetti() {
        if (EMBED) return;
        var c = document.createElement("canvas");
        c.className = "fx-confetti";
        var dpr = Math.min(2, window.devicePixelRatio || 1);
        var W = innerWidth, H = innerHeight;
        c.width = W * dpr; c.height = H * dpr;
        document.body.appendChild(c);
        var ctx = c.getContext("2d");
        ctx.scale(dpr, dpr);
        var parts = [];
        for (var i = 0; i < 140; i++) {
            var fromLeft = i % 2 === 0;
            parts.push({
                x: fromLeft ? -10 : W + 10, y: H * (0.55 + Math.random() * 0.25),
                vx: (fromLeft ? 1 : -1) * (4 + Math.random() * 7), vy: -(9 + Math.random() * 9),
                w: 6 + Math.random() * 6, h: 8 + Math.random() * 8,
                r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
                c: COLORS[i % COLORS.length]
            });
        }
        var t0 = 0;
        function frame(now) {
            if (!t0) t0 = now;
            var t = now - t0;
            ctx.clearRect(0, 0, W, H);
            parts.forEach(function (p) {
                p.vy += 0.32; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
                ctx.save();
                ctx.globalAlpha = Math.max(0, 1 - Math.max(0, t - 1600) / 700);
                ctx.translate(p.x, p.y); ctx.rotate(p.r);
                ctx.fillStyle = p.c;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r * 2)) + 2);
                ctx.restore();
            });
            if (t < 2300) requestAnimationFrame(frame); else c.remove();
        }
        requestAnimationFrame(frame);
    }
    window.__deConfetti = confetti;
    window.addEventListener("lesen-points", function (e) {
        var d = e.detail || {};
        if (!d.reveal && d.total > 0 && d.right === d.total) confetti();
    });
    window.addEventListener("hoeren-points", function (e) {
        var d = e.detail || {};
        if (d.total > 0 && d.right === d.total) confetti();
    });

    function init() {
        scanCards(document.body);
        new MutationObserver(function (list) {
            list.forEach(function (m) {
                m.addedNodes.forEach(function (n) { if (n.nodeType === 1) scanCards(n); });
            });
        }).observe(document.body, { childList: true, subtree: true });
        scanCounters();
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
})();
