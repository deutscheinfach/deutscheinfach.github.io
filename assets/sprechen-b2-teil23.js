/* ===== Sprechen B2 · Teil 2 و Teil 3 =====

   Teil 2 — "Über ein Thema sprechen": كتقرا نص قصير، ومن بعد
            كتلخصو (Inhalt)، كتعطي رأيك (Meinung)، وكتحكي
            التجربة ديالك (Erfahrung). الـPrüfer كيسولك على
            أي وحدة فيهم.

   Teil 3 — "Gemeinsam planen": نتا والـPartner كتخططو لشي
            حاجة مع بعضياتكم (حفلة، خرجة…) نقطة بنقطة، وفاللخر
            كتتفقو على plan.

   شكل Teil 2:
   {
     kind: "text",
     title, text: { title, de, ar },
     glossar:  [{ de, ar }],              // كلمات كيتلونو فالنص
     kern:     { frage, optionen: [], richtig, warum },   // الفكرة الأساسية
     punkte:   [{ de, ar }],              // النقط المهمة ديال النص
     meinung:  { pro: [{de,ar}], contra: [{de,ar}] },
     erfahrung:[{ de, ar }],              // أسئلة كيعاونوك تحكي
     muster:   { inhalt:{de,ar}, meinung:{de,ar}, erfahrung:{de,ar} },
     fragen:   { inhalt:[{de,ar}], meinung:[{de,ar}], erfahrung:[{de,ar}] }
   }

   شكل Teil 3:
   {
     kind: "plan",
     title, situation: { de, ar },
     punkte: [{
       key, label, ar,
       ideen: ["…", "…"],                 // اختيارات للقرار
       partner: { vorschlag, reaktion }   // شنو كيقترح الـPartner / كيف كيرد
     }],
     dialog: [{ who: "A"|"B", de, ar }]    // حوار نموذجي
   }

   ⚠️ هادو مواضيع مثال باش يخدم المحرك. غادي يتبدلو بالنصوص
   ديال الـPDF ملي توصل.
*/

(function () {
    "use strict";

    const TOPICS = [
        { id: "t2-homeoffice", title: "Homeoffice – Fluch oder Segen?", ar: "الخدمة من الدار", parts: ["teil2"], locked: false },
        { id: "t3-abschied",   title: "Abschiedsfeier für die Kursleiterin", ar: "حفلة توديع الأستاذة", parts: ["teil3"], locked: false }
    ];

    const CONTENT = {

        "t2-homeoffice": { teil2: {
            kind: "text",
            title: "Homeoffice – Fluch oder Segen?",
            text: {
                title: "Arbeiten, wo das Bett steht",
                de: "Seit der Corona-Pandemie arbeiten in Deutschland deutlich mehr Menschen von zu Hause aus. Laut einer aktuellen Umfrage verbringt fast ein Viertel aller Beschäftigten mindestens einen Tag pro Woche im Homeoffice. Viele schätzen vor allem, dass der lange Weg zur Arbeit wegfällt. Dadurch sparen sie nicht nur Zeit, sondern auch Geld, und sie können Beruf und Familie besser vereinbaren.\nDoch das Arbeiten in den eigenen vier Wänden hat auch Schattenseiten. Psychologen warnen, dass die Grenze zwischen Arbeit und Freizeit immer mehr verschwimmt. Wer im Wohnzimmer arbeitet, beantwortet oft auch am Abend noch E-Mails. Außerdem fehlt vielen der persönliche Kontakt zu den Kolleginnen und Kollegen. Besonders junge Berufstätige fühlen sich häufig isoliert und lernen weniger von erfahrenen Mitarbeitern.\nExperten empfehlen deshalb eine Mischung: zwei bis drei Tage im Büro, den Rest zu Hause. Wichtig sei außerdem ein fester Arbeitsplatz in der Wohnung und klare Arbeitszeiten.",
                ar: "من بعد الكورونا، ولّاو بزاف ديال الناس فألمانيا كيخدمو من الدار. على حسب واحد الاستطلاع جديد، تقريباً ربع الخدامين كيدوزو على الأقل نهار فالسيمانة فالهوم أوفيس. بزاف منهم كيعجبهم بالخصوص أن الطريق الطويلة للخدمة ما بقاتش. بهادشي كيربحو الوقت والفلوس، وكيقدرو يجمعو بين الخدمة والعائلة مزيان.\nولكن الخدمة فالدار عندها حتى جوانب سلبية. علماء النفس كيحذرو بلي الحدود بين الخدمة ووقت الفراغ كتضيع. اللي كيخدم فالصالون كيجاوب بزاف ديال المرات على الإيميلات حتى فالليل. زيادة على هادشي، بزاف ما عندهمش التواصل المباشر مع الزملاء. الشباب اللي بداو يخدمو بالخصوص كيحسو بالعزلة وكيتعلمو قل من الخدامة اللي عندهم التجربة.\nالخبراء كينصحو إذن بالخليط: جوج ولا تلاتة ديال الأيام فالبيرو، والباقي فالدار. ومهم حتى تكون عندك بلاصة ثابتة للخدمة فالدار ووقت واضح ديال الخدمة."
            },
            glossar: [
                { de: "Beschäftigten", ar: "الخدامة / الموظفين" },
                { de: "wegfällt", ar: "كيتحيد / ما بقاش" },
                { de: "vereinbaren", ar: "يجمع بين / يوفق" },
                { de: "Schattenseiten", ar: "الجوانب السلبية" },
                { de: "verschwimmt", ar: "كتضبّب / كتضيع" },
                { de: "isoliert", ar: "معزول" },
                { de: "Mischung", ar: "خليط" }
            ],
            kern: {
                frage: "Was ist die Hauptaussage des Textes?",
                optionen: [
                    "Homeoffice ist für alle Beschäftigten die beste Lösung.",
                    "Homeoffice hat Vor- und Nachteile, deshalb ist eine Mischung sinnvoll.",
                    "Junge Leute sollten nie von zu Hause arbeiten."
                ],
                richtig: 1,
                warum: "النص كيعطي الإيجابيات (الوقت، الفلوس، العائلة) والسلبيات (الحدود، العزلة)، وفاللخر الخبراء كينصحو بالخليط."
            },
            punkte: [
                { de: "Seit Corona arbeiten viel mehr Menschen im Homeoffice (fast 25 %).", ar: "من بعد كورونا بزاف كيخدمو من الدار (تقريباً 25٪)." },
                { de: "Vorteile: kein Arbeitsweg, Zeit und Geld sparen, Familie und Beruf.", ar: "الإيجابيات: ما كاينش الطريق، كتربح الوقت والفلوس، العائلة والخدمة." },
                { de: "Nachteile: keine klare Grenze zwischen Arbeit und Freizeit, Isolation.", ar: "السلبيات: ما كاينش فرق واضح بين الخدمة والراحة، العزلة." },
                { de: "Empfehlung: Mischung aus Büro und Homeoffice, fester Arbeitsplatz.", ar: "النصيحة: خليط بين البيرو والدار، وبلاصة ثابتة للخدمة." }
            ],
            meinung: {
                pro: [
                    { de: "Man spart Zeit und Geld.", ar: "كتربح الوقت والفلوس." },
                    { de: "Man kann sich besser konzentrieren.", ar: "كتقدر تركز كثر." },
                    { de: "Gut für Eltern mit kleinen Kindern.", ar: "مزيان للوالدين اللي عندهم دراري صغار." }
                ],
                contra: [
                    { de: "Man arbeitet oft länger.", ar: "بزاف ديال المرات كتخدم كثر." },
                    { de: "Der Kontakt zu Kollegen fehlt.", ar: "كيخصك التواصل مع الزملاء." },
                    { de: "Nicht jeder hat genug Platz zu Hause.", ar: "ماشي كلشي عندو البلاصة فالدار." }
                ]
            },
            erfahrung: [
                { de: "Haben Sie schon einmal von zu Hause gearbeitet oder gelernt?", ar: "واش عمرك خدمتي ولا قريتي من الدار؟" },
                { de: "Wie war das für Sie – eher positiv oder negativ?", ar: "كيفاش كانت بالنسبة ليك؟" },
                { de: "Wie ist die Situation in Ihrem Heimatland?", ar: "كيفاش الوضعية فبلادك؟" }
            ],
            muster: {
                inhalt: {
                    de: "In dem Text geht es um das Thema Homeoffice. Der Autor berichtet, dass seit der Corona-Pandemie deutlich mehr Menschen von zu Hause arbeiten – fast ein Viertel der Beschäftigten mindestens einen Tag pro Woche. Als Vorteile werden genannt, dass man keinen Arbeitsweg hat und so Zeit und Geld spart. Außerdem kann man Familie und Beruf besser vereinbaren. Der Text zeigt aber auch Nachteile: Die Grenze zwischen Arbeit und Freizeit verschwimmt, und vielen fehlt der Kontakt zu Kollegen. Am Ende empfehlen Experten eine Mischung aus Büro und Homeoffice.",
                    ar: "النص كيهضر على الخدمة من الدار. الكاتب كيقول بلي من بعد كورونا ولّاو بزاف ديال الناس كيخدمو من الدار — تقريباً ربع الخدامة على الأقل نهار فالسيمانة. من الإيجابيات: ما كاينش الطريق للخدمة وبهادشي كتربح الوقت والفلوس، وكتقدر تجمع بين العائلة والخدمة. ولكن النص كيبين حتى السلبيات: الحدود بين الخدمة والراحة كتضيع، وبزاف كيخصهم التواصل مع الزملاء. فاللخر الخبراء كينصحو بخليط بين البيرو والدار."
                },
                meinung: {
                    de: "Meiner Meinung nach ist Homeoffice eine gute Sache, aber nicht für jeden Tag. Einerseits kann ich mich zu Hause oft besser konzentrieren, andererseits vermisse ich die Gespräche mit Kollegen. Deshalb finde ich die Idee mit zwei oder drei Tagen im Büro sehr sinnvoll.",
                    ar: "فرأيي الخدمة من الدار حاجة مزيانة، ولكن ماشي كل نهار. من جهة كنقدر نركز كثر فالدار، ومن جهة خرى كيتوحشني الهضرة مع الزملاء. داكشي علاش كنشوف فكرة جوج ولا تلاتة ديال الأيام فالبيرو معقولة بزاف."
                },
                erfahrung: {
                    de: "Ich selbst habe während der Pandemie ein Jahr lang online studiert. Am Anfang fand ich das bequem, aber nach einigen Monaten habe ich mich ziemlich allein gefühlt. In Marokko arbeiten die meisten Menschen noch im Büro, aber bei großen Firmen in Casablanca wird Homeoffice immer beliebter.",
                    ar: "أنا شخصياً قريت أونلاين عام كامل فوقت الكورونا. فالأول كان ساهل ومريح، ولكن من بعد شي شهور ولّيت كنحس براسي بوحدي. فالمغرب أغلب الناس باقي كيخدمو فالبيرو، ولكن فالشركات الكبار فكازا الخدمة من الدار كتولي محبوبة كثر."
                }
            },
            fragen: {
                inhalt: [
                    { de: "Welche Nachteile nennt der Text genau?", ar: "شنو السلبيات اللي كيذكر النص بالضبط؟" },
                    { de: "Was empfehlen die Experten am Ende des Textes?", ar: "شنو كينصحو الخبراء فاللخر؟" }
                ],
                meinung: [
                    { de: "Möchten Sie später lieber im Büro oder zu Hause arbeiten? Warum?", ar: "باغي تخدم من بعد فالبيرو ولا فالدار؟ علاش؟" },
                    { de: "Sollten Firmen ihren Mitarbeitern Homeoffice erlauben?", ar: "واش خاص الشركات تسمح للخدامة يخدمو من الدار؟" }
                ],
                erfahrung: [
                    { de: "Wie organisieren Sie Ihren Tag, wenn Sie zu Hause lernen?", ar: "كيفاش كتنظم نهارك ملي كتقرا فالدار؟" },
                    { de: "Kennen Sie jemanden, der im Homeoffice arbeitet? Wie findet er oder sie das?", ar: "واش كتعرف شي حد كيخدم من الدار؟ كيفاش كيشوفها؟" }
                ]
            }
        } },

        "t3-abschied": { teil3: {
            kind: "plan",
            title: "Eine Abschiedsfeier planen",
            situation: {
                de: "Ihre Kursleiterin verlässt nach drei Jahren die Sprachschule. Sie und Ihr Gesprächspartner sollen zusammen eine kleine Abschiedsfeier für sie organisieren. Machen Sie Vorschläge, reagieren Sie auf die Vorschläge Ihres Partners und einigen Sie sich am Ende auf einen gemeinsamen Plan.",
                ar: "الأستاذة ديالكم غادة تخرج من مدرسة اللغات من بعد تلت سنين. نتا والشريك ديالك خاصكم تنظمو ليها حفلة توديع صغيرة. اقترح أفكار، جاوب على الاقتراحات ديال الشريك، وفاللخر تفقو على plan مشترك."
            },
            punkte: [
                { key: "wann", label: "Wann?", ar: "إمتى؟",
                  ideen: ["Freitag nach dem Unterricht", "Samstagabend", "In der letzten Kursstunde"],
                  partner: {
                      vorschlag: "Ich würde vorschlagen, dass wir die Feier am Samstagabend machen. Dann haben wir mehr Zeit.",
                      reaktion: "Gute Idee, aber am Wochenende haben viele schon Pläne. Wie wäre es mit Freitag direkt nach dem Unterricht?"
                  } },
                { key: "wo", label: "Wo?", ar: "فين؟",
                  ideen: ["Im Kursraum", "In einem Café in der Nähe", "Im Park bei gutem Wetter"],
                  partner: {
                      vorschlag: "Wir könnten die Feier doch einfach im Kursraum machen. Das kostet nichts.",
                      reaktion: "Hm, im Kursraum ist es nicht so gemütlich. Was hältst du von dem kleinen Café gegenüber?"
                  } },
                { key: "essen", label: "Essen & Getränke", ar: "الماكلة والمشروبات",
                  ideen: ["Jeder bringt etwas mit", "Wir bestellen Pizza", "Kuchen und Tee aus dem Café"],
                  partner: {
                      vorschlag: "Beim Essen finde ich es am einfachsten, wenn jeder etwas mitbringt – zum Beispiel ein Gericht aus seinem Land.",
                      reaktion: "Das ist eine schöne Idee! Dann haben wir ein internationales Buffet. Da bin ich ganz dabei."
                  } },
                { key: "geschenk", label: "Geschenk", ar: "الهدية",
                  ideen: ["Ein Fotobuch vom Kurs", "Ein Gutschein", "Blumen und eine Karte"],
                  partner: {
                      vorschlag: "Als Geschenk könnten wir ihr einen Gutschein für ein Restaurant kaufen.",
                      reaktion: "Ein Gutschein ist praktisch, aber ein bisschen unpersönlich. Wie findest du ein Fotobuch mit Bildern von uns allen?"
                  } },
                { key: "aufgaben", label: "Wer macht was?", ar: "شكون غادي يدير شنو؟",
                  ideen: ["Ich kümmere mich um das Geschenk, du um das Essen", "Wir fragen die anderen Teilnehmer um Hilfe", "Wir machen alles zusammen"],
                  partner: {
                      vorschlag: "Sollen wir die Aufgaben verteilen? Ich könnte mich um das Geschenk kümmern.",
                      reaktion: "Einverstanden. Dann übernehme ich die Einladung und rede mit dem Café."
                  } }
            ],
            dialog: [
                { who: "A", de: "Also, wir müssen die Abschiedsfeier für Frau Weber planen. Wann sollen wir sie machen? Ich würde Samstagabend vorschlagen.", ar: "إذن خاصنا نخططو لحفلة التوديع ديال السيدة فيبر. إمتى نديروها؟ أنا نقترح السبت فالليل." },
                { who: "B", de: "Am Samstag haben viele schon Pläne. Wie wäre es mit Freitag direkt nach dem Unterricht? Da sind sowieso alle da.", ar: "السبت بزاف عندهم برامج. شنو بان ليك فالجمعة مباشرة من بعد الدرس؟ تما كلشي حاضر." },
                { who: "A", de: "Stimmt, das ist praktischer. Und wo? Im Kursraum?", ar: "صحيح، هادي عملية كثر. وفين؟ فالقسم؟" },
                { who: "B", de: "Da ist es nicht so gemütlich. Ich schlage das Café gegenüber vor.", ar: "تما ماشي مريح بزاف. أنا نقترح القهوة اللي قدام." },
                { who: "A", de: "Einverstanden. Beim Essen könnte jeder etwas aus seinem Land mitbringen.", ar: "متفق. فالماكلة كل واحد يقدر يجيب شي حاجة من بلادو." },
                { who: "B", de: "Super Idee! Und als Geschenk? Ein Gutschein ist mir zu unpersönlich – was hältst du von einem Fotobuch?", ar: "فكرة زوينة! والهدية؟ البون ماشي شخصي بزاف — شنو رأيك فألبوم ديال التصاور؟" },
                { who: "A", de: "Das gefällt mir. Ich kümmere mich um das Fotobuch, und du sprichst mit dem Café, okay?", ar: "عجبني. أنا نتكلف بالألبوم، ونتا تهضر مع القهوة، واخا؟" },
                { who: "B", de: "Okay. Dann halten wir fest: Freitag nach dem Unterricht im Café, jeder bringt etwas mit, und wir schenken ihr ein Fotobuch.", ar: "واخا. إذن تفقنا: الجمعة من بعد الدرس فالقهوة، كل واحد يجيب شي حاجة، ونهديو ليها ألبوم ديال التصاور." }
            ]
        } }
    };

    window.SPRECHEN_B2_TOPICS = TOPICS.concat(window.SPRECHEN_B2_TOPICS || []);
    const all = window.SPRECHEN_B2_CONTENT = window.SPRECHEN_B2_CONTENT || {};
    Object.keys(CONTENT).forEach(function (id) {
        all[id] = Object.assign({}, all[id], CONTENT[id]);
    });
})();
