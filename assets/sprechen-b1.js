/* ===== Sprechen B1 =====

   Teil 1 (Einander kennenlernen) ديما هو هو فالامتحان:
   جوج مترشحين كيتعرفو على بعضياتهم ~3 دقايق.
   لهذا كاين غير تمرين واحد ديال Teil 1.

   Teil 2 و Teil 3 غادي يتزادو من بعد فنفس الملف.

   شكل التمرين (كيبنيه sprechen-engine.js):
   {
     title, minutes,
     intro:  "…" ولا ["سطر", "سطر"],
     points: ["…"],  note: "…",
     ar:     { intro, points: [], note },       // ترجمة المهمة
     fragen: [{ head, items: [{ q, a, ar }] }], // أسئلة وأجوبة نموذجية
     redemittel: { label, groups: [{ head, items: [] }] }
   }
*/

window.SPRECHEN_B1_TOPICS = [
    { id: "kennenlernen", title: "Einander kennenlernen", ar: "التعارف", parts: ["teil1"], locked: false, level: "B1" },

    /* ---- Teil 2 · Über ein Thema sprechen ----
       soon: true = المحتوى ما زال ماوصلش (البطاقة كتبان بلا رابط). */
    { id: "t2-01", title: "Bücherhören", ar: "الكتب الصوتية", parts: ["teil2"], locked: false, soon: true, level: "B1" },
    { id: "t2-02", title: "Tanzen", ar: "الرقص", parts: ["teil2"], locked: false, soon: true, level: "B1" },
    { id: "t2-03", title: "Schöner Wohnen", ar: "السكن الزوين", parts: ["teil2"], locked: false, soon: true, level: "B1" },
    { id: "t2-04", title: "Stress", ar: "الضغط", parts: ["teil2"], locked: false, soon: true, level: "B1" },
    { id: "t2-05", title: "Arbeitszeiten in der Gastronomie", ar: "أوقات الخدمة فالمطاعم", parts: ["teil2"], locked: false, soon: true, level: "B1" },
    { id: "t2-06", title: "Lebensmittel im Internet", ar: "شراء الماكلة من الإنترنت", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-07", title: "Essensgewohnheiten", ar: "عادات الماكلة", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-08", title: "Geld sparen", ar: "توفير الفلوس", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-09", title: "Am Wochenende etwas unternehmen?", ar: "الخرجات فالويكاند", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-10", title: "Rapmusik", ar: "موسيقى الراب", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-11", title: "Auto, Bus oder Bahn", ar: "الطوموبيل، الطوبيس ولا التران", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-12", title: "Große Feier veranstalten", ar: "تنظيم حفلة كبيرة", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-13", title: "TikTok", ar: "تيك توك", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-14", title: "Smartphone", ar: "السمارتفون", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-15", title: "Handynutzung in öffentlichen Verkehrsmitteln", ar: "التيليفون فالنقل العمومي", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-16", title: "Allein wohnen", ar: "السكن بوحدك", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-17", title: "Großeltern", ar: "الجدود", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-18", title: "Nachbarn", ar: "الجيران", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-19", title: "Geburtstag feiern", ar: "الاحتفال بعيد الميلاد", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-20", title: "Urlaub mit Freunden", ar: "العطلة مع الصحاب", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-21", title: "Gefahren im Internet", ar: "مخاطر الإنترنت", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-22", title: "Sport treiben", ar: "ممارسة الرياضة", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-23", title: "Lebenslanges Lernen", ar: "التعلم مدى الحياة", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-24", title: "Zukunftspläne", ar: "مخططات المستقبل", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-25", title: "Handy", ar: "التيليفون", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-26", title: "Umzug", ar: "الرحيل", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-27", title: "Bauernmarkt", ar: "سوق الفلاحة", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-28", title: "Gemeinsame Mahlzeiten", ar: "الماكلة مجموعين", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-29", title: "Öffentliche Verkehrsmittel", ar: "النقل العمومي", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-30", title: "Essen kochen", ar: "الطياب", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-31", title: "Kleidung und Mode", ar: "الحوايج والموضة", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-32", title: "Fernsehen", ar: "التلفزة", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-33", title: "Beste Freunde", ar: "أعز الصحاب", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-34", title: "Kinofilm", ar: "فيلم فالسينما", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-35", title: "Rauchen", ar: "التدخين", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-36", title: "Mehr Zeit", ar: "وقت كثر", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-37", title: "Geschenkaustausch", ar: "تبادل الهدايا", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-38", title: "Haustier", ar: "حيوان الدار", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-39", title: "Wohnen in der Stadt oder auf dem Land", ar: "السكن فالمدينة ولا فالبادية", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-40", title: "Abenteuer", ar: "المغامرة", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-41", title: "Kleidung", ar: "الحوايج", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-42", title: "Im Internet bestellen", ar: "الطلب من الإنترنت", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-43", title: "Smartphone in der Schule", ar: "السمارتفون فالمدرسة", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-44", title: "Brief oder E-Mail", ar: "رسالة ولا إيميل", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-45", title: "Kinder im Freizeitstress – Ehrgeizige Eltern", ar: "الضغط على الدراري فوقت الفراغ", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-46", title: "Auto kaufen", ar: "شراء طوموبيل", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-47", title: "Gastfreundschaft", ar: "الضيافة", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-48", title: "Ausziehen oder allein wohnen", ar: "الخروج من دار الوالدين", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-49", title: "Sammlungen und sammeln", ar: "جمع الحوايج", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-50", title: "Heiraten / Hochzeit", ar: "الزواج / العرس", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-51", title: "Gemeinschaftsgarten", ar: "جردة مشتركة", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-52", title: "Serie oder Film", ar: "مسلسل ولا فيلم", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-53", title: "Sport im Fitnessstudio", ar: "الرياضة فالصالة", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-54", title: "Klassentreffen", ar: "لقاء صحاب القسم", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-55", title: "Führerschein", ar: "البيرمي", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-56", title: "Immer online", ar: "ديما أونلاين", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-57", title: "Wohngemeinschaft", ar: "السكن المشترك", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-58", title: "Der ideale Urlaub", ar: "العطلة المثالية", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-59", title: "Alter und Lebenserfahrung", ar: "السن وتجربة الحياة", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-60", title: "Verwandtschaft", ar: "العائلة والقرابة", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-61", title: "Hauskauf oder Mieten", ar: "شراء الدار ولا الكرا", parts: ["teil2"], locked: true, soon: true, level: "B1" },
    { id: "t2-62", title: "Essen", ar: "الماكلة", parts: ["teil2"], locked: true, soon: true, level: "B1" }
];

window.SPRECHEN_B1_CONTENT = {

    "kennenlernen": {
        teil1: {
            title: "Einander kennenlernen",
            minutes: 3,
            intro: [
                "Teilnehmende A und B: Teil 1 Einander kennenlernen",
                "Unterhalten Sie sich mit Ihrer Partnerin bzw. Ihrem Partner über folgende Themen:"
            ],
            points: [
                "Name",
                "Woher sie oder er kommt",
                "Wie sie oder er wohnt (Wohnung, Haus, Garten …)",
                "Familie",
                "Wo sie oder er Deutsch gelernt hat",
                "Was sie oder er macht (Schule, Studium, Beruf …)",
                "Sprachen (welche? wie lange? warum?)"
            ],
            note: "Die Prüfenden können außerdem noch weitere Fragen stellen.",

            ar: {
                intro: "المترشح A و B: الجزء 1 — التعارف. تكلمو مع الشريك ديالك (ولا الشريكة) على هاد المواضيع:",
                points: [
                    "الاسم",
                    "منين جا",
                    "فين وكيفاش ساكن (شقة، دار، جردة …)",
                    "العائلة",
                    "فين تعلم الألمانية",
                    "آش كيدير (قراية، جامعة، خدمة …)",
                    "اللغات (أشمن لغات؟ شحال من وقت؟ علاش؟)"
                ],
                note: "الممتحنين يقدرو يزيدو يسولوكم أسئلة أخرى."
            },

            fragenLabel: "❓ أسئلة وأجوبة نموذجية (سول الشريك ديالك وجاوب)",
            fragen: [
                { head: "Name", items: [
                    { q: "Wie heißt du?", a: "Ich heiße Karim. Mein Familienname ist Benali.", ar: "شنو سميتك؟ — سميتي كريم، والنسب ديالي بنعلي." },
                    { q: "Wie schreibt man deinen Namen?", a: "K – A – R – I – M.", ar: "كيفاش كتكتب سميتك؟" }
                ] },
                { head: "Woher sie oder er kommt", items: [
                    { q: "Woher kommst du?", a: "Ich komme aus Marokko, aus Casablanca.", ar: "منين نتا؟ — أنا من المغرب، من الدار البيضاء." },
                    { q: "Wie lange bist du schon in Deutschland?", a: "Ich bin seit zwei Jahren hier.", ar: "شحال هادي وانت فألمانيا؟ — عندي عامين هنا." }
                ] },
                { head: "Wie sie oder er wohnt", items: [
                    { q: "Wo wohnst du? Wohnst du in einer Wohnung oder in einem Haus?", a: "Ich wohne in einer kleinen Wohnung im Stadtzentrum. Sie hat zwei Zimmer und einen Balkon.", ar: "فين ساكن؟ فشقة ولا فدار؟ — ساكن فشقة صغيرة فوسط المدينة، فيها جوج بيوت وبالكون." },
                    { q: "Wohnst du allein?", a: "Nein, ich wohne mit meinem Bruder zusammen.", ar: "ساكن بوحدك؟ — لا، ساكن مع خويا." }
                ] },
                { head: "Familie", items: [
                    { q: "Erzähl mal von deiner Familie. Hast du Geschwister?", a: "Ja, ich habe eine Schwester und zwei Brüder. Meine Eltern leben noch in Marokko.", ar: "حكي ليا على العائلة ديالك. عندك خوت؟ — إيه، عندي أخت وجوج خوت. الوالدين ديالي ساكنين فالمغرب." },
                    { q: "Bist du verheiratet?", a: "Ja, ich bin verheiratet und habe eine Tochter. Sie ist drei Jahre alt.", ar: "واش مزوج؟ — إيه، مزوج وعندي بنت عندها 3 سنين." }
                ] },
                { head: "Wo sie oder er Deutsch gelernt hat", items: [
                    { q: "Wo hast du Deutsch gelernt?", a: "Ich habe zuerst im Goethe-Institut in Casablanca gelernt. Jetzt mache ich einen Kurs an der Volkshochschule.", ar: "فين تعلمتي الألمانية؟ — تعلمت الأول فمعهد غوته فكازا، ودابا كنقرا كور فالـ Volkshochschule." },
                    { q: "Wie lange lernst du schon Deutsch?", a: "Seit ungefähr anderthalb Jahren.", ar: "شحال هادي وانت كتعلم الألمانية؟ — تقريبا عام ونص." }
                ] },
                { head: "Was sie oder er macht", items: [
                    { q: "Was machst du beruflich?", a: "Ich bin Krankenpfleger und arbeite in einem Krankenhaus.", ar: "آش كتخدم؟ — أنا ممرض وكنخدم فسبيطار." },
                    { q: "Studierst du oder arbeitest du?", a: "Im Moment studiere ich Informatik. Am Wochenende arbeite ich in einem Café.", ar: "كتقرا ولا كتخدم؟ — دابا كنقرا الإعلاميات، وفالويكاند كنخدم فمقهى." }
                ] },
                { head: "Sprachen", items: [
                    { q: "Welche Sprachen sprichst du?", a: "Ich spreche Arabisch, Französisch und ein bisschen Englisch. Und natürlich Deutsch.", ar: "أشمن لغات كتهضر؟ — كنهضر العربية، الفرنسية وشوية ديال الإنجليزية. وطبعا الألمانية." },
                    { q: "Warum lernst du Deutsch?", a: "Ich möchte in Deutschland arbeiten. Deshalb brauche ich das B1-Zertifikat.", ar: "علاش كتعلم الألمانية؟ — بغيت نخدم فألمانيا، لهذا خاصني شهادة B1." }
                ] }
            ],

            redemittel: {
                label: "Einander kennenlernen",
                groups: [
                    { head: "البداية", items: [
                        "Hallo, ich heiße … . Und wie heißt du?",
                        "Freut mich, dich kennenzulernen.",
                        "Sollen wir uns duzen?" ] },
                    { head: "باش تسول الشريك", items: [
                        "Und du? / Und wie ist das bei dir?",
                        "Erzähl doch mal etwas über … .",
                        "Darf ich fragen, … ?" ] },
                    { head: "باش تجاوب على كلامو", items: [
                        "Das ist ja interessant!",
                        "Bei mir ist das ähnlich. / Bei mir ist das ganz anders.",
                        "Das kenne ich gut." ] },
                    { head: "ملي ما فهمتيش", items: [
                        "Entschuldigung, kannst du das bitte wiederholen?",
                        "Wie bitte? Ich habe das leider nicht verstanden.",
                        "Kannst du bitte etwas langsamer sprechen?" ] },
                    { head: "الخاتمة", items: [
                        "Es war schön, mit dir zu sprechen.",
                        "Viel Erfolg bei der Prüfung!" ] }
                ]
            }
        }
    }
};
