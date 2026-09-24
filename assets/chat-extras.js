/* ===== إضافات الشات للي كيتعلمو الألمانية =====

   1) Wort des Tages — كلمة B2 كل نهار فالجنب، مع المعنى ومثال.
      زر → كلمة أخرى، وزر "استعملها" كيحط المثال فالخانة.
   2) حروف ä ö ü ß فوق خانة الكتابة (كلاڤيي ديال التيليفون ماكيعطيهمش ديما).
   3) "💡 Ideen" — جمل جاهزين باش تبدا الهضرة بالألمانية،
      وكيبانو حتى فالمحادثة الخاوية.

   ما كيقيس والو فالمنطق ديال Firebase — غير كيزيد عناصر
   وكيكتب فـ #messageInput بحال المستخدم. */

(function () {
    "use strict";

    const WORDS = [
        { de: "die Herausforderung", ar: "التحدي", ex: "Die Prüfung ist eine echte Herausforderung für mich." },
        { de: "sich bewerben um", ar: "قدّم ترشيحو لـ", ex: "Ich bewerbe mich um eine Stelle in Berlin." },
        { de: "die Erfahrung", ar: "التجربة", ex: "Welche Erfahrungen hast du mit Deutsch gemacht?" },
        { de: "vermeiden", ar: "تفادى", ex: "Ich versuche, Fehler beim Sprechen zu vermeiden." },
        { de: "der Vorteil", ar: "الإيجابية / الميزة", ex: "Ein Vorteil von Online-Kursen ist die Flexibilität." },
        { de: "der Nachteil", ar: "السلبية", ex: "Der Nachteil ist, dass man allein lernt." },
        { de: "überzeugen", ar: "أقنع", ex: "Mit guten Argumenten kannst du jeden überzeugen." },
        { de: "die Voraussetzung", ar: "الشرط", ex: "B2 ist eine Voraussetzung für mein Studium." },
        { de: "sich gewöhnen an", ar: "تعوّد على", ex: "Ich habe mich an das Wetter in Deutschland gewöhnt." },
        { de: "zuverlässig", ar: "كيتّكل عليه", ex: "Mein Lernpartner ist sehr zuverlässig." },
        { de: "die Möglichkeit", ar: "الإمكانية / الفرصة", ex: "Gibt es die Möglichkeit, heute zusammen zu üben?" },
        { de: "sich kümmern um", ar: "تهلّا فـ", ex: "Wer kümmert sich um die Präsentation?" },
        { de: "beeindruckend", ar: "مؤثر / كيبهر", ex: "Die Stadt war wirklich beeindruckend." },
        { de: "die Umwelt", ar: "البيئة", ex: "Wir sollten mehr für die Umwelt tun." },
        { de: "verantwortlich", ar: "مسؤول", ex: "Wer ist für die Organisation verantwortlich?" },
        { de: "die Entscheidung", ar: "القرار", ex: "Das war eine schwierige Entscheidung." },
        { de: "unterstützen", ar: "ساند / عاون", ex: "Kannst du mich beim Schreiben unterstützen?" },
        { de: "der Termin", ar: "الموعد", ex: "Mein Prüfungstermin ist im Juni." },
        { de: "sich verabreden", ar: "تواعد مع", ex: "Wollen wir uns für Sprechen-Übungen verabreden?" },
        { de: "die Absicht", ar: "النية", ex: "Ich habe die Absicht, in Deutschland zu arbeiten." },
        { de: "nachvollziehen", ar: "فهم / تفهّم", ex: "Deine Meinung kann ich gut nachvollziehen." },
        { de: "der Zusammenhang", ar: "العلاقة / السياق", ex: "In diesem Zusammenhang möchte ich etwas sagen." },
        { de: "anstrengend", ar: "متعب", ex: "Der Tag war anstrengend, aber schön." },
        { de: "empfehlen", ar: "نصح بـ", ex: "Welches Buch kannst du mir empfehlen?" },
        { de: "die Geduld", ar: "الصبر", ex: "Beim Sprachenlernen braucht man viel Geduld." },
        { de: "zufrieden", ar: "راضي", ex: "Ich bin mit meinem Ergebnis zufrieden." },
        { de: "die Meinung", ar: "الرأي", ex: "Meiner Meinung nach ist Üben das Wichtigste." },
        { de: "abhängen von", ar: "كيتعلق بـ", ex: "Das hängt davon ab, wie viel Zeit wir haben." },
        { de: "vorschlagen", ar: "اقترح", ex: "Ich schlage vor, dass wir morgen üben." },
        { de: "sich freuen auf", ar: "فرحان بـ (شي حاجة جاية)", ex: "Ich freue mich auf unser Gespräch!" }
    ];

    const STARTERS = [
        "Hallo zusammen! Wie läuft eure Vorbereitung auf telc B2? 😊",
        "Wer möchte heute Sprechen Teil 3 mit mir üben?",
        "Welcher Teil ist für euch am schwierigsten: Lesen, Hören, Schreiben oder Sprechen?",
        "Kann mir jemand einen Tipp für Sprachbausteine geben?",
        "Wann ist eure Prüfung? Meine ist am …",
        "Ich suche einen Lernpartner für Sprechen. Hat jemand Zeit?",
        "Was macht ihr, um neue Wörter nicht zu vergessen?",
        "Guten Morgen! Heute lerne ich … Und ihr?"
    ];

    const UMLAUTS = ["ä", "ö", "ü", "ß", "Ä", "Ö", "Ü"];

    function el(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }
    function btn(className, text) {
        const node = el("button", className, text);
        node.type = "button";
        return node;
    }

    /* كنكتبو فالخانة بحال إلا المستخدم هو اللي كتب */
    function insert(text, replace) {
        const input = document.getElementById("messageInput");
        if (!input) return;
        const max = input.maxLength > 0 ? input.maxLength : 500;
        if (replace) {
            input.value = text.slice(0, max);
            input.setSelectionRange(input.value.length, input.value.length);
        } else {
            const start = input.selectionStart == null ? input.value.length : input.selectionStart;
            const end = input.selectionEnd == null ? input.value.length : input.selectionEnd;
            const next = (input.value.slice(0, start) + text + input.value.slice(end)).slice(0, max);
            input.value = next;
            const pos = Math.min(start + text.length, next.length);
            input.setSelectionRange(pos, pos);
        }
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.focus();
    }

    /* ---- 1) Wort des Tages ---- */
    function wordCard() {
        const host = document.getElementById("tab-chats");
        if (!host || host.querySelector(".dx-word")) return;
        const day = Math.floor(Date.now() / 86400000);
        let index = day % WORDS.length;

        const card = el("div", "dx-word");
        const top = el("div", "dx-word-top");
        top.appendChild(el("span", "dx-word-label", "Wort des Tages"));
        const next = btn("dx-word-next", "→");
        next.setAttribute("aria-label", "Nächstes Wort");
        top.appendChild(next);
        const de = el("p", "dx-word-de");
        const ar = el("p", "dx-word-ar");
        ar.dir = "rtl";
        const ex = el("p", "dx-word-ex");
        const use = btn("dx-word-use", "✍️ استعملها فالشات");
        card.append(top, de, ar, ex, use);

        function paint() {
            const w = WORDS[index];
            de.textContent = w.de;
            ar.textContent = w.ar;
            ex.textContent = "„" + w.ex + "“";
        }
        next.addEventListener("click", function () {
            index = (index + 1) % WORDS.length;
            paint();
        });
        use.addEventListener("click", function () { insert(WORDS[index].ex, true); });
        paint();
        host.insertBefore(card, host.firstChild);
    }

    /* ---- 2 + 3) الأدوات فوق خانة الكتابة ---- */
    function starterList() {
        const list = el("div", "dx-starters");
        STARTERS.forEach(function (text) {
            const b = btn("dx-starter", text);
            b.addEventListener("click", function () {
                insert(text, true);
                if (list.parentNode && list.parentNode.classList.contains("dx-tools-wrap")) list.hidden = true;
            });
            list.appendChild(b);
        });
        return list;
    }

    function composerTools() {
        const area = document.querySelector(".input-area");
        const composer = area && area.querySelector(".composer");
        if (!area || !composer || area.querySelector(".dx-tools")) return;

        const wrap = el("div", "dx-tools-wrap");
        wrap.style.flexBasis = "100%";
        wrap.style.width = "100%";
        const tools = el("div", "dx-tools");
        UMLAUTS.forEach(function (ch) {
            const key = btn("dx-key", ch);
            key.setAttribute("aria-label", "Buchstabe " + ch);
            /* ما نخليوش الخانة تفقد الـfocus (الكلاڤيي ديال التيليفون كيتسد) */
            key.addEventListener("mousedown", function (e) { e.preventDefault(); });
            key.addEventListener("click", function () { insert(ch, false); });
            tools.appendChild(key);
        });
        const ideas = btn("dx-starters-btn", "💡 Ideen");
        ideas.setAttribute("aria-expanded", "false");
        tools.appendChild(ideas);

        const list = starterList();
        list.hidden = true;
        ideas.addEventListener("click", function () {
            list.hidden = !list.hidden;
            ideas.setAttribute("aria-expanded", list.hidden ? "false" : "true");
        });

        wrap.append(tools, list);
        area.insertBefore(wrap, area.firstChild);
    }

    /* المحادثة الخاوية: جمل باش تبدا */
    function emptyStarters() {
        const empty = document.querySelector("#messages .empty");
        if (!empty || empty.querySelector(".dx-starters")) return;
        const inner = empty.firstElementChild || empty;
        const hint = el("p", "", "💡 ما عرفتيش باش تبدا؟ اختار جملة:");
        hint.style.marginTop = "18px";
        hint.style.fontWeight = "700";
        inner.append(hint, starterList());
    }

    function init() {
        wordCard();
        composerTools();
        emptyStarters();
        const messages = document.getElementById("messages");
        if (messages && window.MutationObserver) {
            new MutationObserver(emptyStarters).observe(messages, { childList: true });
        }
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
})();
