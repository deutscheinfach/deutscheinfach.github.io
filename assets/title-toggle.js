/* ===== خبي عنوان الموضوع =====

   المشكل: العنوان كيفضح الجواب. مثلا ف Lesen Teil 1، سميّة
   الموضوع "Sport ist gesund" هي بحالها وحدة من الـÜberschriften
   اللي خاصك تختار.

   الزر: غير عين صغيرة حدا سميّة الموضوع ف الشريط ديال فوق.
   كيخبي:
     - سميّة الموضوع ف الشريط (.lesen-detail-title)
     - العنوان الكبير فوق التمرين (.t1-title) والسطر اللي تحتو
       (.t1-kicker)

   مهم: الزر كيتحط ف .lesen-detail-head حدا الـh1، ماشي جواه —
   وإلا كيتخبى هو حتى هو ملي كيتخبى العنوان.

   الاختيار كيتحفظ ف localStorage، إذن كيبقى ف كل المواضيع
   وكل الصفحات.

   الزر كيتزاد بوحدو ف أي رأس كيطلع (MutationObserver) حيت
   الرؤوس كيتعاودو يتبناو ف كل paint. */

(function () {
    "use strict";

    var KEY = "de-hide-title";
    var ON = "de-hide-title";
    var HOST = ".lesen-detail-head";
    var FALLBACK = ".t1-head";

    function stored() {
        try { return localStorage.getItem(KEY) === "1"; }
        catch (e) { return false; }
    }
    function remember(on) {
        try { on ? localStorage.setItem(KEY, "1") : localStorage.removeItem(KEY); }
        catch (e) { /* التصفح الخاص: كيخدم، غير ماكيتعاودش */ }
    }

    /* كنطبقو دغيا — بلا هادشي العنوان كيبان شي لحظة
       من بعد كيختافى، وهادشي كيفضح الجواب. */
    function apply(on) {
        document.documentElement.classList.toggle(ON, on);
    }
    apply(stored());

    function build() {
        var button = document.createElement("button");
        button.type = "button";
        button.className = "title-toggle";

        var icon = document.createElement("span");
        icon.className = "title-toggle-icon";
        icon.textContent = "👁";
        icon.setAttribute("aria-hidden", "true");
        button.appendChild(icon);

        function paint() {
            var on = document.documentElement.classList.contains(ON);
            var label = on ? "بين العنوان" : "خبي العنوان";
            button.classList.toggle("is-on", on);
            button.setAttribute("aria-pressed", on ? "true" : "false");
            button.setAttribute("aria-label", label);
            button.title = label;
        }
        paint();

        button.addEventListener("click", function () {
            var next = !document.documentElement.classList.contains(ON);
            apply(next);
            remember(next);
            /* ممكن يكون كثر من زر ف الصفحة — كنحدثوهم كاملين */
            Array.prototype.forEach.call(
                document.querySelectorAll(".title-toggle"),
                function (other) { other.__paint && other.__paint(); }
            );
        });

        button.__paint = paint;
        return button;
    }

    function install(host) {
        if (!host || host.querySelector(".title-toggle")) return;
        host.appendChild(build());
    }

    /* الشريط ديال فوق هو البلاصة. الصفحات اللي ماعندهاش
       (التمرين لوحدو ف صفحة) كتاخد الرأس ديال التمرين. */
    function pick(root) {
        var out = [];
        if (root.nodeType !== 1) return out;
        if (root.matches && root.matches(HOST)) out.push(root);
        if (root.querySelectorAll) {
            out = out.concat(Array.prototype.slice.call(root.querySelectorAll(HOST)));
        }
        if (out.length) return out;
        if (document.querySelector(HOST)) return out;      /* كاين فبلاصة أخرى */
        if (root.matches && root.matches(FALLBACK)) out.push(root);
        if (root.querySelectorAll) {
            out = out.concat(Array.prototype.slice.call(root.querySelectorAll(FALLBACK)));
        }
        return out;
    }

    function scan(root) {
        pick(root).forEach(install);
    }

    function start() {
        scan(document.body);
        new MutationObserver(function (records) {
            records.forEach(function (record) {
                Array.prototype.forEach.call(record.addedNodes, scan);
            });
        }).observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start);
    } else {
        start();
    }
}());
