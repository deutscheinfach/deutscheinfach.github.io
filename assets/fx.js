/* ===== أنيماسيون خفاف للصفحات ديال الأقسام =====

   1) الأرقام (.lesen-stat b: «192 مواضيع»، «28 نماذج»…) كيعدو من 0
      ملي كيبانو.
   2) البطاقات (.lesen-card، .part-card) كيطلعو وحدة بوحدة ملي كيوصلو
      ليهم — حتى اللي كيتزادو من بعد (البحث، تبديل B1/B2…).

   prefers-reduced-motion → بلا حركة. */
(function () {
    "use strict";

    var CALM = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
    var root = document.documentElement;

    var css = document.createElement("style");
    css.textContent =
        "html.fx-on .fx-wait{opacity:0;transform:translateY(22px) scale(.97)}" +
        "html.fx-on .fx-anim{transition:opacity .55s ease,transform .7s cubic-bezier(.2,.9,.3,1.15)!important}";
    if (!CALM) {
        document.head.appendChild(css);
        root.classList.add("fx-on");
    }

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
        if (CALM || !io || card.__fx) return;
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
        if (CALM) return;
        document.querySelectorAll(".lesen-stat b").forEach(function (el) {
            if (!io) return countUp(el);
            var o = new IntersectionObserver(function (es) {
                if (es[0].isIntersecting) { o.disconnect(); countUp(el); }
            });
            o.observe(el);
        });
    }

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
