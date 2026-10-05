/* ===== "محتوى مقفل": نافذة وحدة لكل المواضيع ديال Premium =====

   قبل، البركة على موضوع مقفول كانت كتحل الموضوع وتبين لوحة وسط
   الصفحة (Lesen/Sprechen/Schreiben)، ولا نافذة قديمة كتصيفط
   لـ WhatsApp (Hören). دابا: نفس النافذة ف كل قسم، والزر ديالها
   كيدي لصفحة العروض (payment.html).

   كيخدم بوحدو:
   - أي بطاقة a.lesen-card.locked (Lesen، Sprechen، Schreiben، Prüfungen)
   - الأزرار ديال Hören (openHoerenPremium / openHoerenTeil2Premium /
     openHoerenTeil3Premium) — كنبدلوهم بهاد النافذة.

   window.__deLocked({ title: "…" }) باش تحلها من أي بلاصة. */

(function () {
    "use strict";

    var OFFERS = "payment.html";
    var modal = null;
    var lastFocus = null;

    function isPremium() { return !!window.__deutschEinfachIsPremium; }

    function css() {
        if (document.getElementById("de-locked-css")) return;
        var style = document.createElement("style");
        style.id = "de-locked-css";
        style.textContent = [
            ".dl-back{position:fixed;inset:0;z-index:2147482000;display:grid;place-items:center;padding:16px;",
            "background:rgba(8,10,20,.55);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);",
            "opacity:0;transition:opacity .18s ease}",
            ".dl-back.show{opacity:1}",
            ".dl-box,.dl-box *{box-sizing:border-box}",
            "@media (pointer:coarse){.dl-back{-webkit-backdrop-filter:none;backdrop-filter:none;background:rgba(8,10,20,.7)}}",
            ".dl-box{position:relative;width:min(400px,100%);direction:rtl;text-align:center;",
            "padding:30px 24px 20px;border-radius:24px;background:var(--surface,#fff);color:var(--text,#101a36);",
            "border:1px solid var(--line,rgba(16,26,54,.11));",
            "box-shadow:0 30px 80px -20px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.04) inset;",
            "transform:translateY(12px) scale(.97);transition:transform .22s cubic-bezier(.22,.8,.3,1);overflow:hidden}",
            ".dl-back.show .dl-box{transform:none}",
            ".dl-box::before{content:\"\";position:absolute;inset:0 0 auto 0;height:120px;pointer-events:none;",
            "background:radial-gradient(70% 100% at 50% 0,color-mix(in srgb,var(--brand,#e3163f) 22%,transparent),transparent)}",
            ".dl-ico{position:relative;width:64px;height:64px;margin:0 auto 14px;border-radius:18px;display:grid;place-items:center;",
            "background:var(--grad-brand,linear-gradient(135deg,#ff4a6b,#e3163f 45%,#b30e30));color:#fff;",
            "box-shadow:0 12px 26px -10px var(--brand,#e3163f)}",
            ".dl-ico svg{width:30px;height:30px}",
            ".dl-title{position:relative;margin:0 0 4px;font-size:1.55rem;font-weight:900;letter-spacing:-.01em}",
            ".dl-sub{position:relative;margin:0 0 18px;color:var(--muted,#56607a);font-size:14.5px;line-height:1.7}",
            ".dl-topic{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;",
            "padding:11px 14px;margin:0 0 10px;border-radius:14px;background:var(--surface-2,#f4f6fb);",
            "border:1px solid var(--line,rgba(16,26,54,.11));font-weight:800;font-size:14.5px}",
            ".dl-topic b{direction:ltr;unicode-bidi:isolate}",
            ".dl-plan{display:inline-flex;align-items:center;gap:6px;margin:0 0 18px;font-size:13.5px;font-weight:800;color:var(--muted,#56607a)}",
            ".dl-plan span{padding:3px 10px;border-radius:999px;color:#fff;background:var(--brand,#e3163f);font-weight:900;letter-spacing:.02em}",
            ".dl-go{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:14px 16px;border-radius:14px;",
            "background:var(--grad-brand,linear-gradient(135deg,#ff4a6b,#e3163f 45%,#b30e30));color:#fff !important;",
            "font-weight:900;font-size:16px;text-decoration:none;box-shadow:0 14px 30px -12px var(--brand,#e3163f);",
            "transition:transform .15s ease,box-shadow .15s ease}",
            ".dl-go:hover{transform:translateY(-1px);box-shadow:0 18px 34px -12px var(--brand,#e3163f)}",
            ".dl-go svg{width:19px;height:19px}",
            ".dl-login{display:block;margin:12px 0 0;color:var(--text,#101a36);font-weight:800;font-size:14px;text-decoration:underline}",
            ".dl-later{display:block;margin:10px auto 0;padding:6px 12px;border:0;background:none;cursor:pointer;",
            "color:var(--muted,#56607a);font:inherit;font-size:14px;font-weight:700}",
            ".dl-later:hover{color:var(--text,#101a36)}",
            "@media (prefers-reduced-motion:reduce){.dl-back,.dl-box{transition:none}}"
        ].join("");
        document.head.appendChild(style);
    }

    var CROWN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" '
        + 'stroke-linejoin="round" aria-hidden="true"><path d="M3 7l4.5 4L12 4l4.5 7L21 7l-2 12H5z"/></svg>';
    var LOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" '
        + 'stroke-linejoin="round" aria-hidden="true"><rect x="4" y="10" width="16" height="11" rx="2.5"/>'
        + '<path d="M8 10V7a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15.5" r="1.4" fill="currentColor" stroke="none"/></svg>';

    function close() {
        if (!modal) return;
        var node = modal;
        modal = null;
        node.classList.remove("show");
        document.documentElement.style.overflow = "";
        document.removeEventListener("keydown", onKey, true);
        setTimeout(function () { node.remove(); }, 200);
        if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
    }

    function onKey(event) {
        if (event.key === "Escape") { event.stopPropagation(); close(); }
    }

    window.__deLocked = function (options) {
        var config = options || {};
        css();
        if (modal) close();
        lastFocus = document.activeElement;

        var back = document.createElement("div");
        back.className = "dl-back";
        back.setAttribute("role", "dialog");
        back.setAttribute("aria-modal", "true");
        back.setAttribute("aria-labelledby", "dl-title");

        var box = document.createElement("div");
        box.className = "dl-box";
        box.innerHTML =
            '<div class="dl-ico">' + LOCK + '</div>'
            + '<h2 class="dl-title" id="dl-title"></h2><p class="dl-sub"></p>';
        box.querySelector(".dl-title").textContent = config.heading || "محتوى مقفل";
        box.querySelector(".dl-sub").textContent = config.text
            || "هاد الموضوع كيتفتح مع الاشتراك ف Premium — مع گاع المواضيع ديال Lesen، Hören، Schreiben و Sprechen.";

        if (config.title) {
            var topic = document.createElement("div");
            topic.className = "dl-topic";
            topic.appendChild(document.createTextNode("🔒 "));
            var name = document.createElement("b");
            name.textContent = config.title;
            topic.appendChild(name);
            box.appendChild(topic);
        }

        var plan = document.createElement("div");
        plan.className = "dl-plan";
        plan.innerHTML = "كيتطلب باقة: <span>Premium</span>";
        box.appendChild(plan);

        var go = document.createElement("a");
        go.className = "dl-go";
        go.href = OFFERS;
        go.innerHTML = "شوف العروض وفتح الحساب " + CROWN;
        box.appendChild(go);

        if (!window.__deutschEinfachUser) {
            var login = document.createElement("a");
            login.className = "dl-login";
            login.href = "login.html";
            login.textContent = "عندك حساب Premium؟ دخل";
            box.appendChild(login);
        }

        var later = document.createElement("button");
        later.type = "button";
        later.className = "dl-later";
        later.textContent = "ماشي دابا";
        later.addEventListener("click", close);
        box.appendChild(later);

        back.appendChild(box);
        back.addEventListener("click", function (event) { if (event.target === back) close(); });
        document.body.appendChild(back);
        document.documentElement.style.overflow = "hidden";
        document.addEventListener("keydown", onKey, true);
        modal = back;

        requestAnimationFrame(function () {
            back.classList.add("show");
            go.focus({ preventScroll: true });
        });
    };

    /* ---- البطاقات المقفولة (Lesen، Sprechen، Schreiben، Prüfungen) ----
       capture: قبل ما الـ hub يحل الموضوع ف نفس الصفحة. */
    document.addEventListener("click", function (event) {
        var card = event.target.closest && event.target.closest("a.lesen-card.locked");
        if (!card || isPremium()) return;
        if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        event.stopPropagation();
        var title = card.querySelector(".lesen-card-title");
        var text = title ? (title.firstChild && title.firstChild.nodeType === 3
            ? title.firstChild.nodeValue : title.textContent) : "";
        window.__deLocked({ title: (text || "").trim() });
    }, true);

    /* ---- Hören: نبدلو النوافذ القديمة ديال كل Teil ---- */
    function hoeren(title) { window.__deLocked({ title: title }); }
    function swap() {
        ["openHoerenPremium", "openHoerenTeil2Premium", "openHoerenTeil3Premium"].forEach(function (name) {
            if (typeof window[name] === "function" && window[name] !== hoeren) window[name] = hoeren;
        });
    }
    swap();
    /* شي صفحات كيعرفوهم ف DOMContentLoaded — نعاودو من بعد */
    document.addEventListener("DOMContentLoaded", function () { setTimeout(swap, 0); });
    window.addEventListener("load", swap);
})();
