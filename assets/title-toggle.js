/* ===== خبي عنوان الموضوع =====

   المشكل: العنوان الكبير فوق التمرين كيفضح الجواب. مثلا ف
   Lesen Teil 1، الموضوع سميتو "Sport ist gesund" — وهي
   بحالها وحدة من الـÜberschriften اللي خاصك تختار.

   الحل: زر صغير حدا زر الترجمة كيخبي:
     - العنوان الكبير (.t1-title) والسطر اللي تحتو (.t1-kicker)
     - وسميّة الموضوع ف الشريط ديال فوق (.lesen-detail-title)

   الاختيار كيتحفظ ف localStorage، إذن كيبقى ف كل المواضيع
   وف كل الصفحات، ماشي غير ف هاد الوحدة.

   الزر كيتزاد بوحدو ف أي .t1-head كيطلع — حيت الرؤوس
   كيتعاودو يتبناو ف كل paint (تبديل النسخة، تبديل الجزء…)،
   إذن ماكيكفيش نزيدوه مرة وحدة. */

(function () {
    "use strict";

    var KEY = "de-hide-title";
    var ON = "de-hide-title";

    function stored() {
        try { return localStorage.getItem(KEY) === "1"; }
        catch (e) { return false; }
    }
    function remember(on) {
        try { on ? localStorage.setItem(KEY, "1") : localStorage.removeItem(KEY); }
        catch (e) { /* التصفح الخاص: كيخدم، غير ماكيتعاودش */ }
    }

    /* كنطبقو دغيا قبل ما يبان شي حاجة — بلا هادشي العنوان
       كيبان شي لحظة من بعد كيختافى، وهادشي كيفضح الجواب. */
    function apply(on) {
        document.documentElement.classList.toggle(ON, on);
    }
    apply(stored());

    function label(on) {
        return on ? "بين العنوان" : "خبي العنوان";
    }

    function build() {
        var button = document.createElement("button");
        button.type = "button";
        button.className = "ar-toggle title-toggle";
        var icon = document.createElement("span");
        icon.className = "ar-toggle-icon";
        icon.textContent = "👁";
        icon.setAttribute("aria-hidden", "true");
        var text = document.createElement("span");
        button.append(icon, text);

        function paint() {
            var on = document.documentElement.classList.contains(ON);
            text.textContent = label(on);
            button.classList.toggle("is-on", on);
            button.setAttribute("aria-pressed", on ? "true" : "false");
        }
        paint();

        button.addEventListener("click", function () {
            var next = !document.documentElement.classList.contains(ON);
            apply(next);
            remember(next);
            /* كاين بزاف ديال الأزرار ف الصفحة (رأس لكل جزء) —
               كنحدّثوهم كاملين باش ما يتناقضوش */
            Array.prototype.forEach.call(
                document.querySelectorAll(".title-toggle"),
                function (other) { other.__paint && other.__paint(); }
            );
        });

        button.__paint = paint;
        return button;
    }

    function install(head) {
        if (!head || head.querySelector(".title-toggle")) return;
        head.appendChild(build());
    }

    function scan(root) {
        if (!root || root.nodeType !== 1) return;
        if (root.classList && root.classList.contains("t1-head")) install(root);
        var heads = root.querySelectorAll ? root.querySelectorAll(".t1-head") : [];
        Array.prototype.forEach.call(heads, install);
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
