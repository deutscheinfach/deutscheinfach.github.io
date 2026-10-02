/* ===== صفحة Ultra Premium =====

   الروابط ديال WhatsApp كيتبناو من هنا، ماشي مكتوبين
   ف الـHTML — هكا الرقم ف بلاصة وحدة، وكل زر كيصيفط
   الرسالة ديالو باش تعرف شمن عرض بغا. */

(function () {
    "use strict";

    var TEL = "212776551898";

    Array.prototype.forEach.call(
        document.querySelectorAll(".up-cta"),
        function (cta) {
            var offer = cta.getAttribute("data-offer") || "";
            var text = "سلام، بغيت نعرف على " + offer + ".";
            cta.href = "https://wa.me/" + TEL + "?text=" + encodeURIComponent(text);
            cta.target = "_blank";
            cta.rel = "noopener";
        }
    );
}());
