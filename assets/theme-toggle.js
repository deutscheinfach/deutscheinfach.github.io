/* ===== تبديل الوضع: ذهبي على أسود ↔ أبيض وذهبي =====

   الحالة كتتخزن ف localStorage تحت "de-theme" وكتطبق على
   <html data-theme> و <body data-theme> بجوج:
   theme.css كيقرا من <html>، وschreiben-style.css كيقرا من
   <body> حيت هكا كان مكتوب من قبل.

   خاصو يتزاد ف <head> باش الوضع يتطبق قبل ما تبان الصفحة
   وما يبانش وميض أبيض. */

(function () {
    "use strict";

    var KEY = "de-theme";
    var DARK = "dark";
    var LIGHT = "light";

    function stored() {
        try {
            return localStorage.getItem(KEY);
        } catch (error) {
            return null;
        }
    }

    function remember(mode) {
        try {
            localStorage.setItem(KEY, mode);
        } catch (error) {
            /* التصفح الخاص: الوضع كيخدم، غير ماكيتعاودش ملي تسد */
        }
    }

    function current() {
        return document.documentElement.getAttribute("data-theme") === LIGHT
            ? LIGHT
            : DARK;
    }

    function apply(mode, save) {
        var light = mode === LIGHT;
        var root = document.documentElement;

        root.setAttribute("data-theme", light ? LIGHT : DARK);
        if (document.body) {
            document.body.setAttribute("data-theme", light ? LIGHT : DARK);
        }

        /* صفحات Hören عندها كلاس .dark قديم ديالها. إلا خليناه
           مشعل فالوضع الفاتح، كيبقى كيفرض ألوان مظلمة. */
        root.classList.remove("dark");

        if (save) remember(light ? LIGHT : DARK);
        refreshButtons();
    }

    function label(btn) {
        var light = current() === LIGHT;
        btn.textContent = light ? "🌙 مظلم" : "☀️ فاتح";
        btn.setAttribute("aria-label", light ? "الوضع المظلم" : "الوضع الفاتح");
        btn.setAttribute("aria-pressed", light ? "true" : "false");
    }

    function refreshButtons() {
        var own = document.querySelectorAll(".de-theme-btn");
        for (var i = 0; i < own.length; i++) label(own[i]);
    }

    function toggle() {
        apply(current() === LIGHT ? DARK : LIGHT, true);
    }

    /* 1. طبّق الوضع المحفوظ دغيا، قبل ما يتبنى الـ body. */
    apply(stored() === LIGHT ? LIGHT : DARK, false);

    /* 2. ملي يكون الـ body جاهز: طبّق عليه وزيد الزر. */
    function addFloatingButton() {
        if (document.querySelector(".de-theme-btn")) return;
        /* الصفحات اللي فيها الهيدر المشترك عندها زر ديالها
           فوق — ماكنزيدوش واحد عايم فوقو. */
        if (document.querySelector(".site-header, #site-header")) return;
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "de-theme-btn";
        btn.addEventListener("click", toggle);
        label(btn);
        document.body.appendChild(btn);
    }

    function ensureButton() {
        /* صفحات Schreiben عندها زر ف الـ header. ماكنزيدوش
           واحد آخر عايم فوقو. */
        var header = document.getElementById("theme-toggle");
        if (header) {
            if (!header.__deWired) {
                header.__deWired = true;
                header.addEventListener("click", function (event) {
                    event.preventDefault();
                    toggle();
                });
            }
            return;
        }
        addFloatingButton();
    }

    function install() {
        apply(current(), false);
        ensureButton();

        /* شاشة Premium كتعوض document.body.innerHTML كامل، وكتمسح
           معاها الزر ديال الـ header. إذن كنراقبو الـ body
           وكنرجعو الزر إلا مشا. */
        if (typeof MutationObserver === "function") {
            new MutationObserver(function () {
                if (
                    !document.getElementById("theme-toggle") &&
                    !document.querySelector(".de-theme-btn")
                ) {
                    addFloatingButton();
                }
            }).observe(document.body, { childList: true, subtree: false });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", install);
    } else {
        install();
    }

    window.__deTheme = {
        get: current,
        set: function (m) { apply(m, true); },
        toggle: toggle,
        ensureButton: ensureButton
    };
})();
