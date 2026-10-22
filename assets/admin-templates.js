/* ===== 📋 قالب موضوع جديد (غير الأدمين) =====

   ف صفحات Lesen / Hören / Schreiben (b1 و b2) كيبان للأدمين زر «قالب
   موضوع جديد». كيحل نافذة فيها الشكل (JSON) ديال كل جزء — نفس الشكل
   اللي كيتخزن ف الموقع — مع «نسخ». الأدمين كينسخو، كيعمرو، وكيصيفطو
   (ولا كيحطو ف KV / الملف ديال المواضيع). */
(function () {
    "use strict";
    if (window.__deAdminTemplates) return;
    window.__deAdminTemplates = true;

    const PAGE = /(b1|b2)-(lesen|hoeren|schreiben)\b/.exec(location.pathname);
    if (!PAGE) return;
    const LV = PAGE[1], SECTION = PAGE[2];

    function range(n, fn) { const out = []; for (let i = 0; i < n; i++) out.push(fn(i)); return out; }
    const L = "ABCDEFGHIJKLMNO";
    const AR = "الترجمة بالعربية";

    const LESEN = {
        "Teil 1": {
            note: "5 نصوص و10 عناوين (A–J). answer = حرف العنوان الصحيح. variants: الأساسي (والمعدل 1، 2… بنفس الشكل).",
            data: {
                title: "Titel des Themas", kind: "matching",
                variants: [{
                    label: "الأساسي",
                    intro: "Lesen Sie die fünf Texte und die zehn Überschriften. Entscheiden Sie, welche Überschrift am besten zu welchem Text passt. Jede Überschrift können Sie nur einmal verwenden.",
                    options: range(10, function (i) { return { value: L[i], text: "Überschrift " + L[i], ar: AR }; }),
                    texts: range(5, function (i) { return { answer: "A", body: "Text " + (i + 1), ar: "ملخص النص " + (i + 1) }; })
                }]
            }
        },
        "Teil 2": {
            note: "5 فقرات (texts) و5 أسئلة (6–10)، كل سؤال 3 اختيارات. answer = رقم الاختيار الصحيح (0، 1 ولا 2).",
            data: {
                title: "Titel des Themas", kind: "mc",
                texts: range(5, function (i) { return { body: "Absatz " + (i + 1), ar: AR }; }),
                variants: [{
                    label: "الأساسي",
                    questions: range(5, function (i) {
                        return { num: 6 + i, text: "Frage " + (6 + i), ar: AR,
                            options: range(3, function (j) { return { text: "Antwort " + "abc"[j], ar: AR }; }),
                            answer: 0, why: "علاش هادا هو الجواب" };
                    })
                }]
            }
        },
        "Teil 3": {
            note: "12 إعلان (A–L) و10 وضعيات (11–20). answers = الحرف ديال الإعلان لكل وضعية بالترتيب، X إلا ماكاين حتى إعلان.",
            data: {
                title: "Titel des Themas", kind: "ads",
                intro: "Lesen Sie die Situationen 11–20 und die Anzeigen A–L. Welche Anzeige passt zu welcher Situation? Jede Anzeige können Sie nur einmal verwenden. Gibt es zu einer Situation keine passende Anzeige, markieren Sie X.",
                ads: range(12, function (i) { return { key: "ABCDEFGHIJKL"[i], head: "Überschrift der Anzeige", body: "Text der Anzeige", ar: AR }; }),
                situations: range(10, function (i) { return { no: 11 + i, de: "Situation " + (11 + i), ar: AR }; }),
                variants: [{ label: "الأساسي", answers: range(10, function () { return "A"; }) }]
            }
        },
        "Sprachbausteine 1": {
            note: "النص فيه الفراغات [21] … [30]. كل فراغ 3 اختيارات، answer = رقم الاختيار الصحيح (0، 1 ولا 2).",
            data: {
                title: "Titel des Themas", kind: "gaps",
                variants: [{
                    label: "الأساسي",
                    texts: [{ body: "Liebe …, ich [21] dir … [22] …" }],
                    questions: range(10, function (i) { return { num: 21 + i, options: ["a", "b", "c"], answer: 0, why: "علاش" }; })
                }]
            }
        },
        "Sprachbausteine 2": {
            note: "النص فيه [31] … [40]. words = 15 كلمة (A–O بالترتيب). answer = الحرف ديال الكلمة الصحيحة.",
            data: {
                title: "Titel des Themas", kind: "bank",
                variants: [{
                    label: "الأساسي",
                    texts: [{ body: "Text mit [31] … [40]" }],
                    words: range(15, function (i) { return "WORT_" + L[i]; }),
                    questions: range(10, function (i) { return { num: 31 + i, answer: "A", why: "علاش" }; })
                }]
            }
        },
        ["اللائحة (lesen-" + LV + "-topics.js)"]: {
            note: "السطر اللي كيتزاد ف اللائحة. parts: الأجزاء اللي فيها (teil1, teil2, teil3, sprach1, sprach2). locked: true = Premium.",
            data: { id: "mein-thema", title: "Titel des Themas", ar: "العنوان بالعربية", parts: ["teil1"], locked: true }
        }
    };

    function hoeren(n) {
        return {
            note: n + " جمل. answer = \"richtig\" ولا \"falsch\". ar = الترجمة. المعدل: نفس الشكل وزيد (المعدل 1) ف العنوان.",
            data: { href: "", title: "Titel (الأساسي)", quizId: "Titel (الأساسي)",
                questions: range(n, function (i) { return { text: "Aussage " + (i + 1), answer: "richtig", ar: AR }; }) }
        };
    }
    const HOEREN = { "Teil 1": hoeren(5), "Teil 2": hoeren(10), "Teil 3": hoeren(5) };

    const SCHREIBEN = LV === "b1" ? {
        "B1 Schreiben": {
            note: "رقم الموضوع (\"35\") هو المفتاح ف assets/schreiben-topics-b1.js. points = 4 نقط.",
            data: { "35": { title: "Titel", type: "Brief", level: "B1", time: "30 min", locked: true,
                ad: "Der Brief / die E-Mail …", situation: "", intro: "Antworten Sie auf den Brief. Schreiben Sie etwas zu den folgenden Punkten:",
                words: "150–180", points: ["Punkt 1", "Punkt 2", "Punkt 3", "Punkt 4"] } }
        }
    } : {
        "B2 Schreiben": {
            note: "رقم الموضوع (\"42\") هو المفتاح ف assets/schreiben-topics-b2.js. points = 4 نقط (ولا 3).",
            data: { "42": { title: "Titel", type: "Beschwerde", level: "B2", time: "30 min", locked: true,
                ad: "Text der Anzeige …", situation: "Was ist passiert …", points: ["Punkt 1", "Punkt 2", "Punkt 3", "Punkt 4"] } }
        }
    };

    const SETS = { lesen: LESEN, hoeren: HOEREN, schreiben: SCHREIBEN };
    const NAMES = { lesen: "Lesen", hoeren: "Hören", schreiben: "Schreiben" };

    function isAdmin() { return window.__deIsAdmin === true; }
    function el(tag, cls, text) {
        const n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text != null) n.textContent = text;
        return n;
    }

    let styled = false;
    function css() {
        if (styled) return;
        styled = true;
        const s = el("style");
        s.textContent =
            ".at-open{position:fixed;left:16px;bottom:16px;z-index:2147483000;border:1px dashed #e0a800;border-radius:999px;padding:9px 16px;background:#fff8d6;color:#5a4200;font:800 13px Cairo,system-ui,sans-serif;cursor:pointer;box-shadow:0 8px 20px -10px rgba(0,0,0,.4)}" +
            ".at-bg{position:fixed;inset:0;z-index:2147483500;background:rgba(10,18,40,.55);display:flex;align-items:center;justify-content:center;padding:16px}" +
            ".at-box{width:min(820px,100%);max-height:92vh;display:flex;flex-direction:column;gap:10px;background:#fff;border-radius:20px;padding:18px;direction:rtl;font-family:Cairo,system-ui,sans-serif;color:#14204a;box-shadow:0 30px 70px -20px rgba(0,0,0,.5)}" +
            ".at-head{display:flex;align-items:center;justify-content:space-between;gap:10px}.at-head b{font-size:17px}" +
            ".at-x{border:0;background:#eef2fb;border-radius:10px;width:34px;height:34px;cursor:pointer;font-size:16px}" +
            ".at-tabs{display:flex;flex-wrap:wrap;gap:6px}" +
            ".at-tabs button{border:1px solid #d6deef;background:#fbfcff;border-radius:999px;padding:6px 12px;font:700 13px Cairo,system-ui,sans-serif;cursor:pointer;color:#152a5e}" +
            ".at-tabs button.is-on{background:#1c367a;border-color:#1c367a;color:#fff}" +
            ".at-note{font-size:13px;color:#5b6275;margin:0}" +
            ".at-box textarea{flex:1;min-height:320px;direction:ltr;text-align:left;font:13px/1.55 ui-monospace,Menlo,Consolas,monospace;border:1.5px solid #d6deef;border-radius:12px;padding:10px 12px;color:#14204a;background:#fbfcff;resize:vertical}" +
            ".at-copy{align-self:flex-start;border:0;border-radius:12px;padding:10px 18px;font:800 14px Cairo,system-ui,sans-serif;cursor:pointer;background:linear-gradient(135deg,#ffe04d,#f2bc00);color:#3a2700}" +
            "html[data-theme=dark] .at-box{background:#151b2e;color:#e8ecf7}html[data-theme=dark] .at-box textarea{background:#1d2439;color:#e8ecf7;border-color:#2b3655}";
        document.head.appendChild(s);
    }

    function show() {
        const set = SETS[SECTION];
        const bg = el("div", "at-bg");
        const box = el("div", "at-box");
        const head = el("div", "at-head");
        const x = el("button", "at-x", "✕");
        x.type = "button";
        head.append(el("b", "", "قالب موضوع جديد — " + NAMES[SECTION] + " " + LV.toUpperCase()), x);
        const tabs = el("div", "at-tabs");
        const note = el("p", "at-note");
        const ta = el("textarea");
        ta.readOnly = true;
        ta.spellcheck = false;
        const copy = el("button", "at-copy", "نسخ");
        copy.type = "button";
        box.append(head, tabs, note, ta, copy);
        bg.appendChild(box);
        document.body.appendChild(bg);

        function pick(name, btn) {
            Array.prototype.forEach.call(tabs.children, function (b) { b.classList.toggle("is-on", b === btn); });
            note.textContent = set[name].note;
            ta.value = JSON.stringify(set[name].data, null, 2);
            copy.textContent = "نسخ";
        }
        Object.keys(set).forEach(function (name, i) {
            const b = el("button", "", name);
            b.type = "button";
            b.addEventListener("click", function () { pick(name, b); });
            tabs.appendChild(b);
            if (i === 0) pick(name, b);
        });
        copy.addEventListener("click", function () {
            const done = function () { copy.textContent = "تنسخ ✓"; };
            try { navigator.clipboard.writeText(ta.value).then(done, function () { ta.select(); document.execCommand("copy"); done(); }); }
            catch (e) { ta.select(); document.execCommand("copy"); done(); }
        });
        function close() { bg.remove(); }
        x.addEventListener("click", close);
        bg.addEventListener("click", function (e) { if (e.target === bg) close(); });
    }

    let btn = null;
    function paint() {
        if (!isAdmin()) { if (btn) { btn.remove(); btn = null; } return; }
        if (btn) return;
        css();
        btn = el("button", "at-open", "قالب موضوع جديد");
        btn.type = "button";
        btn.addEventListener("click", show);
        document.body.appendChild(btn);
    }
    document.addEventListener("de-admin", paint);
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", paint);
    else paint();
})();
