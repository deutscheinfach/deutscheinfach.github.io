/* ===== Hören Teil 1/2/3: لائحة المواضيع (فهرس صغير) =====

   كتبين گاع السميات ديال المواضيع بالترتيب، باش اللي خدام ف شي
   موضوع ويبغي يقلب على موضوع آخر يمشي ليه بضربة وحدة.

   - الشاشة الكبيرة: عمود صغير ثابت على اليمين.
   - التيليفون: زر «المواضيع» تحت، كيفتح نفس اللائحة.
   - فيها خانة البحث (بالسمية ولا بالرقم) والموضوع اللي نتا فيه
     كيبان ملوّن.

   كتقرا المواضيع من الصفحة (.theme-item) وكتعاود تبني راسها
   ملي الصفحة كتعاود ترسم (Premium كيجي من بعد).
   ماكتبانش داخل Modelltest (?embed=1) ولا ف ?thema=N. */
(function () {
    "use strict";

    var q = location.search;
    if (/[?&]embed=1/.test(q) || /[?&]thema=\d/.test(q)) return;
    try { if (window.top !== window) return; } catch (e) { return; }

    var CSS =
        "html.has-htoc{--htoc-w:230px}" +
        ".htoc{position:fixed;z-index:900;right:16px;top:calc(var(--site-header-h,92px) + 14px);bottom:16px;width:var(--htoc-w);" +
        "display:flex;flex-direction:column;font-family:'Cairo',system-ui,sans-serif;background:var(--surface,#fff);color:var(--text,#1a1220);" +
        "border:1px solid var(--line,rgba(26,18,32,.1));border-radius:18px;box-shadow:0 18px 40px -26px rgba(40,10,20,.55);overflow:hidden}" +
        ".htoc-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 12px 8px;direction:rtl}" +
        ".htoc-head b{font-size:14px;font-weight:900}" +
        ".htoc-head small{font-size:11px;font-weight:800;color:var(--muted,#6b6274);padding:2px 8px;border-radius:999px;border:1px solid var(--line,rgba(26,18,32,.12))}" +
        ".htoc-close{display:none;width:30px;height:30px;border:0;border-radius:9px;background:var(--surface-2,#f6f4ef);color:inherit;font:900 18px/1 inherit;cursor:pointer}" +
        ".htoc-search{margin:0 10px 8px;padding:7px 10px;border-radius:10px;border:1px solid var(--line,rgba(26,18,32,.14));background:var(--surface-2,#f6f4ef);" +
        "color:inherit;font:600 12.5px/1.3 'Cairo',system-ui,sans-serif;outline:none;direction:rtl}" +
        ".htoc-search:focus{border-color:#f2b705;box-shadow:0 0 0 3px rgba(242,183,5,.18)}" +
        ".htoc-list{flex:1;overflow-y:auto;overscroll-behavior:contain;margin:0;padding:0 6px 10px;list-style:none;scrollbar-width:thin}" +
        ".htoc-list li{margin:0}" +
        ".htoc-list a{display:flex;align-items:flex-start;gap:7px;padding:5px 6px;border-radius:9px;color:inherit;text-decoration:none;font-size:12.5px;font-weight:700;line-height:1.35;direction:ltr}" +
        ".htoc-list a:hover{background:var(--surface-2,#f6f4ef)}" +
        ".htoc-list a span{flex:none;min-width:22px;height:20px;padding:0 4px;box-sizing:border-box;display:grid;place-items:center;border-radius:6px;font-size:11px;font-weight:900;" +
        "color:var(--muted,#6b6274);background:var(--surface-2,#f1eee6)}" +
        ".htoc-list a em{font-style:normal;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}" +
        ".htoc-list a.is-on{background:linear-gradient(135deg,#fff3c4,#ffe58a);color:#2a1500}" +
        ".htoc-list a.is-on span{background:linear-gradient(135deg,#ffd84d,#f2b705);color:#2a1500}" +
        "html[data-theme='dark'] .htoc-list a.is-on{background:rgba(242,183,5,.18);color:inherit}" +
        ".htoc-empty{padding:10px;font-size:12px;color:var(--muted,#6b6274);text-align:center;direction:rtl}" +
        ".htoc-btn{display:none;position:fixed;z-index:950;right:14px;bottom:calc(16px + env(safe-area-inset-bottom));align-items:center;gap:7px;padding:9px 14px;border:0;border-radius:999px;" +
        "font:900 13px/1 'Cairo',system-ui,sans-serif;color:#2a1500;background:linear-gradient(135deg,#ffe58a,#f2b705);box-shadow:0 10px 24px -10px rgba(120,80,0,.7);cursor:pointer}" +
        ".htoc-bg{display:none}" +
        ".theme-item.htoc-flash{outline:3px solid #f2b705;outline-offset:2px;transition:outline-color .6s}" +
        "@media (min-width:1180px){html.has-htoc body{padding-right:calc(var(--htoc-w) + 22px)!important}}" +
        "@media (max-width:1179px){" +
        ".htoc-btn{display:inline-flex}" +
        ".htoc{top:auto;right:12px;left:12px;bottom:calc(12px + env(safe-area-inset-bottom));width:auto;max-height:70vh;z-index:10002;transform:translateY(calc(100% + 30px));transition:transform .22s ease;visibility:hidden}" +
        "html.htoc-open .htoc{transform:none;visibility:visible}" +
        ".htoc-close{display:block}" +
        ".htoc-list a{font-size:13.5px;padding:7px 6px}" +
        "html.htoc-open .htoc-bg{display:block;position:fixed;inset:0;z-index:10001;background:rgba(15,10,12,.45)}" +
        "}";

    var root = document.documentElement;
    var stack, box, list, search, countEl, btn, bg;
    var links = [];
    var active = -1;

    function headerOffset() {
        var h = parseFloat(getComputedStyle(root).getPropertyValue("--site-header-h")) || 92;
        return h + 14;
    }

    function themeItems() {
        return stack ? stack.querySelectorAll(":scope > .theme-item") : [];
    }

    function close() { root.classList.remove("htoc-open"); }

    function go(item) {
        if (!item) return;
        item.classList.remove("collapsed");
        close();
        var y = item.getBoundingClientRect().top + window.pageYOffset - headerOffset();
        window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
        item.classList.add("htoc-flash");
        setTimeout(function () { item.classList.remove("htoc-flash"); }, 1400);
    }

    function build() {
        var items = themeItems();
        list.textContent = "";
        links = [];
        active = -1;
        Array.prototype.forEach.call(items, function (item, i) {
            var t = item.querySelector(".theme-item-title");
            var n = item.querySelector(".theme-item-index");
            var title = t ? t.textContent.trim() : "Thema " + (i + 1);
            var li = document.createElement("li");
            var a = document.createElement("a");
            a.href = "#" + item.id;
            var num = document.createElement("span");
            num.textContent = n ? n.textContent.trim() : String(i + 1);
            var em = document.createElement("em");
            em.textContent = title;
            a.title = title;
            a.appendChild(num);
            a.appendChild(em);
            a.addEventListener("click", function (e) { e.preventDefault(); go(item); });
            li.appendChild(a);
            list.appendChild(li);
            links.push({ a: a, li: li, item: item, key: (num.textContent + " " + title).toLowerCase() });
        });
        countEl.textContent = links.length;
        filter();
        spy();
    }

    function filter() {
        var s = search.value.trim().toLowerCase();
        var shown = 0;
        links.forEach(function (l) {
            var ok = !s || l.key.indexOf(s) !== -1;
            l.li.style.display = ok ? "" : "none";
            if (ok) shown++;
        });
        var empty = list.querySelector(".htoc-empty");
        if (!shown && links.length) {
            if (!empty) {
                empty = document.createElement("li");
                empty.className = "htoc-empty";
                empty.textContent = "ما كاين حتى موضوع بهاد السمية";
                list.appendChild(empty);
            }
        } else if (empty) {
            empty.remove();
        }
    }

    /* الموضوع اللي نتا فيه دابا */
    function spy() {
        var line = headerOffset() + 40;
        var cur = -1;
        for (var i = 0; i < links.length; i++) {
            if (links[i].item.getBoundingClientRect().top <= line) cur = i; else break;
        }
        if (cur === -1 && links.length) cur = 0;
        if (cur === active) return;
        if (active !== -1 && links[active]) links[active].a.classList.remove("is-on");
        active = cur;
        if (cur === -1) return;
        var a = links[cur].a;
        a.classList.add("is-on");
        /* نخليو الموضوع الملوّن باين ف اللائحة، بلا ما نحركو الصفحة */
        var lt = a.offsetTop, lh = a.offsetHeight;
        if (lt < list.scrollTop + 8 || lt + lh > list.scrollTop + list.clientHeight - 8) {
            list.scrollTop = lt - list.clientHeight / 2 + lh / 2;
        }
    }

    function init() {
        stack = document.querySelector('[id^="hoeren-teil"][id$="-stack"]');
        if (!stack) return;

        var st = document.createElement("style");
        st.id = "hoeren-toc-css";
        st.textContent = CSS;
        document.head.appendChild(st);

        box = document.createElement("aside");
        box.className = "htoc";
        box.setAttribute("aria-label", "المواضيع");
        box.innerHTML =
            '<div class="htoc-head"><b>المواضيع</b><small></small>' +
            '<button type="button" class="htoc-close" aria-label="سد">×</button></div>' +
            '<input class="htoc-search" type="search" placeholder="قلّب على موضوع…" autocomplete="off">' +
            '<ul class="htoc-list"></ul>';
        list = box.querySelector(".htoc-list");
        search = box.querySelector(".htoc-search");
        countEl = box.querySelector(".htoc-head small");

        btn = document.createElement("button");
        btn.type = "button";
        btn.className = "htoc-btn";
        btn.innerHTML = "☰ <span>المواضيع</span>";
        bg = document.createElement("div");
        bg.className = "htoc-bg";

        btn.addEventListener("click", function () {
            root.classList.add("htoc-open");
            spy();
        });
        bg.addEventListener("click", close);
        box.querySelector(".htoc-close").addEventListener("click", close);
        document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

        search.addEventListener("input", filter);
        search.addEventListener("keydown", function (e) {
            if (e.key !== "Enter") return;
            for (var i = 0; i < links.length; i++) {
                if (links[i].li.style.display !== "none") { go(links[i].item); break; }
            }
        });

        document.body.appendChild(bg);
        document.body.appendChild(box);
        document.body.appendChild(btn);
        root.classList.add("has-htoc");

        build();
        new MutationObserver(build).observe(stack, { childList: true });

        var ticking = false;
        window.addEventListener("scroll", function () {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(function () { ticking = false; spy(); });
        }, { passive: true });
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
})();
