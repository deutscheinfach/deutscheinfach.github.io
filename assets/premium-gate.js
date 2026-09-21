/* ===== لوحة Premium =====

   عوض سطر جاف "هاد الموضوع ديال Premium"، كنبنيو لوحة كاملة:
   قفل، شنو كيربح الطالب، وزر للعروض. ونحطو تحتها نموذج مغبّش
   من التمرين باش يشوف شنو كاين — بلا ما يقدر يقراه.

   الاستعمال:  window.__premiumGate(into, { title: "…" })
*/

(function () {
    "use strict";

    function el(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    const PERKS = [
        "45 موضوع ف Leseverstehen Teil 1",
        "3 نسخ لكل موضوع — نفس النص بترويسات مختلفة",
        "ملخص بالدارجة لكل نص",
        "تصحيح فوري مع الحلول"
    ];

    window.__premiumGate = function (into, options) {
        const config = options || {};

        const card = el("section", "pg");

        /* ---- الرأس ---- */
        const head = el("div", "pg-head");

        const badge = el("span", "pg-lock");
        badge.setAttribute("aria-hidden", "true");
        badge.innerHTML =
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"' +
            ' stroke-linecap="round" stroke-linejoin="round">' +
            '<rect x="4" y="10" width="16" height="11" rx="2.5"></rect>' +
            '<path d="M8 10V7a4 4 0 0 1 8 0v3"></path>' +
            '<circle cx="12" cy="15.5" r="1.4" fill="currentColor" stroke="none"></circle>' +
            "</svg>";
        head.appendChild(badge);

        const titles = el("div", "pg-titles");
        titles.appendChild(el("span", "pg-chip", "PREMIUM"));
        titles.appendChild(el("h2", "pg-title",
            config.title || "هاد الموضوع ديال المشتركين"));
        titles.appendChild(el("p", "pg-lead",
            "المواضيع المجانية محلولة كاملة. باقي المواضيع كيفتحو مع الاشتراك."));
        head.appendChild(titles);
        card.appendChild(head);

        /* ---- شنو كيربح ---- */
        const list = el("ul", "pg-perks");
        PERKS.forEach(function (perk) {
            const row = el("li", "");
            row.appendChild(el("span", "pg-tick", "✓"));
            row.appendChild(document.createTextNode(perk));
            list.appendChild(row);
        });
        card.appendChild(list);

        /* ---- الأزرار ---- */
        const actions = el("div", "pg-actions");

        const buy = el("a", "pg-btn pg-btn-main", "شوف العروض");
        buy.href = "payment.html";
        actions.appendChild(buy);

        if (!window.__deutschEinfachUser) {
            const login = el("a", "pg-btn pg-btn-ghost", "عندك حساب؟ دخل");
            login.href = "login.html";
            actions.appendChild(login);
        }
        card.appendChild(actions);

        /* هادي كتبان غير إلا كان المستعمل مشترك وما وصلوش المحتوى —
           يعني كاين شي حاجة خايبة فالإعداد، ماشي فالاشتراك ديالو. */
        if (config.note) {
            const note = el("div", "pg-note");
            note.appendChild(el("b", "", "ملاحظة تقنية"));
            note.appendChild(el("span", "", config.note));
            card.appendChild(note);
        }

        /* ---- نموذج مغبّش: كيوري الشكل بلا ما يعطي المحتوى ---- */
        const peek = el("div", "pg-peek");
        peek.setAttribute("aria-hidden", "true");
        for (let i = 0; i < 3; i++) {
            const row = el("div", "pg-peek-row");
            row.appendChild(el("span", "pg-peek-num", String(i + 1)));
            const lines = el("div", "pg-peek-lines");
            lines.appendChild(el("span", "pg-peek-line"));
            lines.appendChild(el("span", "pg-peek-line"));
            lines.appendChild(el("span", "pg-peek-line short"));
            row.appendChild(lines);
            peek.appendChild(row);
        }
        card.appendChild(peek);

        into.appendChild(card);
    };
})();
