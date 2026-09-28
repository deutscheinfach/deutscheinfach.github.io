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
    { id: "t2-01", title: "Bücherhören", ar: "الكتب الصوتية", parts: ["teil2"], locked: false, level: "B1" },
    { id: "t2-02", title: "Tanzen", ar: "الرقص", parts: ["teil2"], locked: false, level: "B1" },
    { id: "t2-03", title: "Schöner Wohnen", ar: "السكن الزوين", parts: ["teil2"], locked: false, level: "B1" },
    { id: "t2-04", title: "Stress", ar: "الضغط", parts: ["teil2"], locked: false, level: "B1" },
    { id: "t2-05", title: "Arbeitszeiten in der Gastronomie", ar: "أوقات الخدمة فالمطاعم", parts: ["teil2"], locked: false, level: "B1" },
    { id: "t2-06", title: "Lebensmittel im Internet", ar: "شراء الماكلة من الإنترنت", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-07", title: "Essensgewohnheiten", ar: "عادات الماكلة", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-08", title: "Geld sparen", ar: "توفير الفلوس", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-09", title: "Am Wochenende etwas unternehmen?", ar: "الخرجات فالويكاند", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-10", title: "Rapmusik", ar: "موسيقى الراب", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-11", title: "Auto, Bus oder Bahn", ar: "الطوموبيل، الطوبيس ولا التران", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-12", title: "Große Feier veranstalten", ar: "تنظيم حفلة كبيرة", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-13", title: "TikTok", ar: "تيك توك", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-14", title: "Smartphone", ar: "السمارتفون", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-15", title: "Handynutzung in öffentlichen Verkehrsmitteln", ar: "التيليفون فالنقل العمومي", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-16", title: "Allein wohnen", ar: "السكن بوحدك", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-17", title: "Großeltern", ar: "الجدود", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-18", title: "Nachbarn", ar: "الجيران", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-19", title: "Geburtstag feiern", ar: "الاحتفال بعيد الميلاد", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-20", title: "Urlaub mit Freunden", ar: "العطلة مع الصحاب", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-21", title: "Gefahren im Internet", ar: "مخاطر الإنترنت", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-22", title: "Sport treiben", ar: "ممارسة الرياضة", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-23", title: "Lebenslanges Lernen", ar: "التعلم مدى الحياة", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-24", title: "Zukunftspläne", ar: "مخططات المستقبل", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-25", title: "Handy", ar: "التيليفون", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-26", title: "Umzug", ar: "الرحيل", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-27", title: "Bauernmarkt", ar: "سوق الفلاحة", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-28", title: "Gemeinsame Mahlzeiten", ar: "الماكلة مجموعين", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-29", title: "Öffentliche Verkehrsmittel", ar: "النقل العمومي", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-30", title: "Essen kochen", ar: "الطياب", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-31", title: "Kleidung und Mode", ar: "الحوايج والموضة", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-32", title: "Fernsehen", ar: "التلفزة", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-33", title: "Beste Freunde", ar: "أعز الصحاب", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-34", title: "Kinofilm", ar: "فيلم فالسينما", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-35", title: "Rauchen", ar: "التدخين", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-36", title: "Mehr Zeit", ar: "وقت كثر", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-37", title: "Geschenkaustausch", ar: "تبادل الهدايا", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-38", title: "Haustier", ar: "حيوان الدار", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-39", title: "Wohnen in der Stadt oder auf dem Land", ar: "السكن فالمدينة ولا فالبادية", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-40", title: "Abenteuer", ar: "المغامرة", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-41", title: "Kleidung", ar: "الحوايج", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-42", title: "Im Internet bestellen", ar: "الطلب من الإنترنت", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-43", title: "Smartphone in der Schule", ar: "السمارتفون فالمدرسة", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-44", title: "Brief oder E-Mail", ar: "رسالة ولا إيميل", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-45", title: "Kinder im Freizeitstress – Ehrgeizige Eltern", ar: "الضغط على الدراري فوقت الفراغ", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-46", title: "Auto kaufen", ar: "شراء طوموبيل", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-47", title: "Gastfreundschaft", ar: "الضيافة", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-48", title: "Ausziehen oder allein wohnen", ar: "الخروج من دار الوالدين", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-49", title: "Sammlungen und sammeln", ar: "جمع الحوايج", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-50", title: "Heiraten / Hochzeit", ar: "الزواج / العرس", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-51", title: "Gemeinschaftsgarten", ar: "جردة مشتركة", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-52", title: "Serie oder Film", ar: "مسلسل ولا فيلم", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-53", title: "Sport im Fitnessstudio", ar: "الرياضة فالصالة", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-54", title: "Klassentreffen", ar: "لقاء صحاب القسم", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-55", title: "Führerschein", ar: "البيرمي", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-56", title: "Immer online", ar: "ديما أونلاين", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-57", title: "Wohngemeinschaft", ar: "السكن المشترك", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-58", title: "Der ideale Urlaub", ar: "العطلة المثالية", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-59", title: "Alter und Lebenserfahrung", ar: "السن وتجربة الحياة", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-60", title: "Verwandtschaft", ar: "العائلة والقرابة", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-61", title: "Hauskauf oder Mieten", ar: "شراء الدار ولا الكرا", parts: ["teil2"], locked: true, level: "B1" },
    { id: "t2-62", title: "Essen", ar: "الماكلة", parts: ["teil2"], locked: true, level: "B1" }
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
    },

    /* ---- Teil 2 ---- (Person A / B: النص ديال الامتحان كما هو؛ الباقي تمارين ديالنا) */
    "t2-01": { teil2: {
        "kind": "meinungen",
        "title": "Bücherhören",
        "a": {
            "de": "Ich lese gern. Das Lesen von Büchern hilft mir, meinen Geist zu entspannen und Stress abzubauen. Ich verbringe viel Zeit damit, Bücher zu lesen.",
            "ar": "كنبغي القراية. قراية الكتب كتعاوني نرتاح فراسي ونقص من الضغط. كندوز بزاف ديال الوقت كنقرا الكتب."
        },
        "b": {
            "de": "Bücher hören ist besser. Ich kann jederzeit und überall Bücher hören, zum Beispiel beim Kochen, beim Sport oder bei anderen Aktivitäten. Für mich ist das Lesen relativ zeitaufwändig.",
            "ar": "سماع الكتب حسن. نقدر نسمع الكتب فأي وقت وفأي بلاصة، مثلا وأنا كنطيب، كندير الرياضة ولا شي حاجة أخرى. بالنسبة ليا القراية كتاخد شوية بزاف ديال الوقت."
        },
        "kurzA": [
            {
                "de": "Lesen macht ihr Spaß.",
                "ar": "كتبغي القراية."
            },
            {
                "de": "Bücher beruhigen sie.",
                "ar": "الكتب كيهدنوها."
            },
            {
                "de": "Durch Lesen hat sie weniger Stress.",
                "ar": "بالقراية كينقص عليها الضغط."
            },
            {
                "de": "Sie liest oft und lange.",
                "ar": "كتقرا بزاف ولمدة طويلة."
            }
        ],
        "kurzB": [
            {
                "de": "Sie hört lieber Hörbücher.",
                "ar": "كتفضل الكتب الصوتية."
            },
            {
                "de": "Sie kann überall und jederzeit hören.",
                "ar": "تقدر تسمع فأي بلاصة وفأي وقت."
            },
            {
                "de": "Zum Beispiel beim Kochen oder beim Sport.",
                "ar": "مثلا وهي كطيب ولا كدير الرياضة."
            },
            {
                "de": "Lesen dauert ihr zu lange.",
                "ar": "القراية كتطول عليها."
            }
        ],
        "fragen": [
            {
                "de": "Liest du gern? Was liest du am liebsten?",
                "ar": "واش كتبغي القراية؟ شنو كتقرا كثر؟"
            },
            {
                "de": "Hast du schon einmal ein Hörbuch gehört?",
                "ar": "واش عمرك سمعتي كتاب صوتي؟"
            },
            {
                "de": "Wann und wo hörst du Hörbücher oder Podcasts?",
                "ar": "فوقاش وفين كتسمع الكتب الصوتية ولا البودكاست؟"
            },
            {
                "de": "Was hilft dir mehr beim Deutschlernen: Lesen oder Hören?",
                "ar": "شنو كيعاونك كثر فتعلم الألمانية: القراية ولا السماع؟"
            }
        ],
        "dialog": [
            {
                "who": "A",
                "de": "In meinem Text geht es ums Lesen. Die Person liest sehr gern, weil Bücher ihr helfen, sich zu entspannen und Stress abzubauen. Was steht in deinem Text?",
                "ar": "فالنص ديالي الموضوع على القراية. الشخص كيبغي القراية بزاف، حيت الكتب كتعاونو يرتاح وينقص من الضغط. شنو كاين فالنص ديالك؟"
            },
            {
                "who": "B",
                "de": "Die Person in meinem Text hört lieber Hörbücher. Sie findet das praktisch, weil sie dabei kochen oder Sport machen kann. Lesen kostet ihr zu viel Zeit.",
                "ar": "الشخص فالنص ديالي كيفضل الكتب الصوتية. كيلقاها عملية، حيت يقدر يطيب ولا يدير الرياضة فنفس الوقت. القراية كتاخد ليه بزاف ديال الوقت."
            },
            {
                "who": "A",
                "de": "Und wie ist das bei dir? Liest du lieber oder hörst du lieber?",
                "ar": "ونتا كيفاش؟ كتفضل تقرا ولا تسمع؟"
            },
            {
                "who": "B",
                "de": "Ich höre oft Hörbücher, zum Beispiel morgens in der Straßenbahn. Da habe ich keine Hand frei für ein Buch. Und du?",
                "ar": "كنسمع بزاف الكتب الصوتية، مثلا فالصباح فالطرامواي. تما ما عنديش يد خاوية للكتاب. ونتا؟"
            },
            {
                "who": "A",
                "de": "Ich lese lieber richtige Bücher. Beim Lesen kann ich langsam machen und schwierige Stellen noch einmal lesen. Das ist gut für mein Deutsch.",
                "ar": "أنا كنفضل الكتب الحقيقية. فالقراية نقدر نمشي بشوية ونعاود نقرا البلايص الصعيبة. هادشي مزيان للألمانية ديالي."
            },
            {
                "who": "B",
                "de": "Das stimmt. Beim Hören verpasse ich manchmal etwas, wenn ich nicht aufpasse. Aber ich lerne dabei die Aussprache.",
                "ar": "عندك الحق. فالسماع كتفلت ليا شي حوايج ملي ما كنكونش مركز. ولكن كنتعلم النطق."
            },
            {
                "who": "A",
                "de": "Das ist ein guter Punkt. Vielleicht probiere ich ein deutsches Hörbuch aus. Kannst du mir eins empfehlen?",
                "ar": "هادي نقطة مزيانة. يمكن نجرب شي كتاب صوتي بالألمانية. تقدر تنصحني بشي واحد؟"
            },
            {
                "who": "B",
                "de": "Ja, für den Anfang sind kurze Geschichten gut. Man kann sie auch etwas langsamer abspielen.",
                "ar": "إيه، فالبداية القصص القصيرة مزيانين. وتقدر حتى تشغلهم بشوية."
            },
            {
                "who": "A",
                "de": "Ich glaube, beides hat Vorteile: Zu Hause lese ich, und unterwegs könnte ich hören.",
                "ar": "كنظن بجوج عندهم مزايا: فالدار نقرا، وفالطريق نقدر نسمع."
            },
            {
                "who": "B",
                "de": "Genau, so sehe ich das auch.",
                "ar": "بالضبط، حتى أنا كنشوفها هكا."
            }
        ],
        "woerter": [
            {
                "de": "das Hörbuch",
                "ar": "الكتاب الصوتي"
            },
            {
                "de": "die Geschichte",
                "ar": "القصة"
            },
            {
                "de": "unterwegs",
                "ar": "فالطريق"
            },
            {
                "de": "sich entspannen",
                "ar": "يرتاح"
            },
            {
                "de": "Stress abbauen",
                "ar": "ينقص من الضغط"
            },
            {
                "de": "zeitaufwändig",
                "ar": "كياخد بزاف ديال الوقت"
            },
            {
                "de": "sich konzentrieren",
                "ar": "يركز"
            },
            {
                "de": "etwas verpassen",
                "ar": "تفلت ليه شي حاجة"
            },
            {
                "de": "die Aussprache",
                "ar": "النطق"
            },
            {
                "de": "empfehlen",
                "ar": "ينصح بـ"
            }
        ]
    } },

    "t2-02": { teil2: {
        "kind": "meinungen",
        "title": "Tanzen",
        "a": {
            "de": "Ich bin ein musikalischer Mensch und habe ein großes Interesse am Tanzen. Ich fühle mich beim Tanzen sehr entspannt. Ich habe auch schon an einigen Tanzkursen teilgenommen. An Wochenenden gehe ich regelmäßig mit Freundinnen in die Disko und genieße diese Zeit bis zur Erschöpfung. Ich habe viel Spaß dabei.",
            "ar": "أنا إنسانة كنبغي الموسيقى وكيعجبني الرقص بزاف. ملي كنشطح كنحس براسي مرتاحة. وقريت من قبل فشي كورات ديال الرقص. فالويكاند كنمشي ديما مع صاحباتي للديسكو وكنتمتع بالوقت حتى كنعيا. كنتبسط بزاف."
        },
        "b": {
            "de": "Ich interessiere mich für Musikhören, aber Tanzen liegt mir nicht. Meine Frau wollte mich oft überreden, an einem Tanzkurs teilzunehmen. Aber das hat sie bis jetzt noch nicht geschafft. Ich will kein großer Tänzer werden.",
            "ar": "كيعجبني نسمع الموسيقى، ولكن الرقص ماشي ديالي. مراتي بغات تقنعني بزاف ديال المرات نقرا كور ديال الرقص، ولكن حتى لدابا ما قدراتش. وأنا ما باغيش نولي راقص كبير."
        },
        "kurzA": [
            {
                "de": "Sie liebt Musik und tanzt sehr gern.",
                "ar": "كتبغي الموسيقى وكتبغي الرقص بزاف."
            },
            {
                "de": "Beim Tanzen kann sie sich gut entspannen.",
                "ar": "فالرقص كترتاح مزيان."
            },
            {
                "de": "Sie hat schon Tanzkurse gemacht.",
                "ar": "دارت من قبل كورات ديال الرقص."
            },
            {
                "de": "Am Wochenende tanzt sie mit Freundinnen in der Disko.",
                "ar": "فالويكاند كتشطح مع صاحباتها فالديسكو."
            }
        ],
        "kurzB": [
            {
                "de": "Er hört gern Musik, tanzt aber nicht gern.",
                "ar": "كيبغي يسمع الموسيقى، ولكن ما كيبغيش يشطح."
            },
            {
                "de": "Seine Frau möchte, dass er einen Tanzkurs macht.",
                "ar": "مراتو بغاتو يدير كور ديال الرقص."
            },
            {
                "de": "Bis jetzt hat er immer Nein gesagt.",
                "ar": "حتى لدابا ديما قال لا."
            },
            {
                "de": "Tanzen ist für ihn nicht wichtig.",
                "ar": "الرقص ماشي مهم عندو."
            }
        ],
        "fragen": [
            {
                "de": "Tanzt du gern? Wo und mit wem?",
                "ar": "واش كتبغي تشطح؟ فين ومع من؟"
            },
            {
                "de": "Hast du schon einmal einen Tanzkurs gemacht?",
                "ar": "واش عمرك درتي كور ديال الرقص؟"
            },
            {
                "de": "Welche Musik hörst du am liebsten?",
                "ar": "أشمن موسيقى كتسمع كثر؟"
            },
            {
                "de": "Wie feiert man in deinem Heimatland? Wird dort viel getanzt?",
                "ar": "كيفاش كيحتفلو فبلادك؟ واش كيشطحو بزاف؟"
            }
        ],
        "dialog": [
            {
                "who": "A",
                "de": "In meinem Text geht es um eine Frau, die sehr gern tanzt. Beim Tanzen entspannt sie sich, und am Wochenende geht sie mit Freundinnen in die Disko. Was steht in deinem Text?",
                "ar": "فالنص ديالي كاينة وحدة المرا كتبغي الرقص بزاف. فالرقص كترتاح، وفالويكاند كتمشي مع صاحباتها للديسكو. شنو كاين فالنص ديالك؟"
            },
            {
                "who": "B",
                "de": "In meinem Text hört ein Mann gern Musik, aber er tanzt nicht gern. Seine Frau möchte, dass er einen Tanzkurs macht, aber er will nicht.",
                "ar": "فالنص ديالي واحد الراجل كيبغي يسمع الموسيقى، ولكن ما كيبغيش يشطح. مراتو بغاتو يدير كور ديال الرقص، ولكن هو ما بغاش."
            },
            {
                "who": "A",
                "de": "Und du? Tanzt du gern?",
                "ar": "ونتا؟ واش كتبغي تشطح؟"
            },
            {
                "who": "B",
                "de": "Ehrlich gesagt nicht so gern. Ich höre lieber Musik oder gehe auf ein Konzert. Beim Tanzen fühle ich mich ein bisschen unsicher. Und du?",
                "ar": "بصراحة ماشي بزاف. كنفضل نسمع الموسيقى ولا نمشي لشي حفلة. فالرقص كنحس براسي مقلق شوية. ونتا؟"
            },
            {
                "who": "A",
                "de": "Ich tanze sehr gern, vor allem auf Hochzeiten. Bei uns in Marokko tanzen auf Festen fast alle, auch die Großeltern.",
                "ar": "أنا كنبغي الرقص بزاف، خصوصا فالأعراس. عندنا فالمغرب فالأفراح تقريبا كولشي كيشطح، حتى الجدود."
            },
            {
                "who": "B",
                "de": "Das finde ich schön. Aber muss man dafür nicht gut tanzen können?",
                "ar": "هادشي زوين. ولكن ما خاصكش تعرف تشطح مزيان باش تدير هكا؟"
            },
            {
                "who": "A",
                "de": "Nein, gar nicht! Es geht um den Spaß, nicht um perfekte Schritte. Außerdem ist Tanzen ein guter Sport.",
                "ar": "لا، أبدا! المهم هو الفرحة، ماشي الخطوات الكاملة. وزيد على هادشي الرقص رياضة مزيانة."
            },
            {
                "who": "B",
                "de": "Das stimmt. Vielleicht probiere ich doch einmal einen Anfängerkurs aus, zusammen mit Freunden.",
                "ar": "عندك الحق. يمكن نجرب واحد الكور ديال المبتدئين، مع الصحاب."
            },
            {
                "who": "A",
                "de": "Gute Idee! Mit Freunden macht es sicher mehr Spaß.",
                "ar": "فكرة مزيانة! مع الصحاب أكيد غادي تكون فيها فرحة كثر."
            },
            {
                "who": "B",
                "de": "Ja, und wenn es mir nicht gefällt, höre ich eben weiter nur Musik.",
                "ar": "إيه، وإلا ما عجبنيش، نبقى غير نسمع الموسيقى."
            }
        ],
        "woerter": [
            {
                "de": "tanzen",
                "ar": "يشطح / يرقص"
            },
            {
                "de": "der Tanzkurs",
                "ar": "كور ديال الرقص"
            },
            {
                "de": "teilnehmen an",
                "ar": "يشارك فـ"
            },
            {
                "de": "die Disko",
                "ar": "الديسكو"
            },
            {
                "de": "genießen",
                "ar": "يتمتع بـ"
            },
            {
                "de": "die Erschöpfung",
                "ar": "العيا"
            },
            {
                "de": "jemanden überreden",
                "ar": "يقنع شي واحد"
            },
            {
                "de": "Das liegt mir nicht.",
                "ar": "هادشي ماشي ديالي"
            },
            {
                "de": "der Anfängerkurs",
                "ar": "كور المبتدئين"
            },
            {
                "de": "unsicher",
                "ar": "مقلق / ماشي واثق"
            }
        ]
    } },

    "t2-03": { teil2: {
        "kind": "meinungen",
        "title": "Schöner Wohnen",
        "a": {
            "de": "Ich liebe schöne Möbel und Bilder! In meiner Wohnung habe ich sogar ein paar Antiquitäten und moderne Designermöbel. Außerdem ist meine Wohnung immer aufgeräumt und alles hat seinen festen Platz. So fühle ich mich einfach wohl!",
            "ar": "كنبغي الأثاث والتصاور الزوينين! فالشقة ديالي عندي حتى شي أنتيكات وأثاث عصري ديال الديزاين. وزيد على هادشي الشقة ديالي ديما مرتبة وكل حاجة عندها بلاصتها. هكا كنحس براسي مرتاح!"
        },
        "b": {
            "de": "Für mich hat es keine Bedeutung, wie meine Einrichtung aussieht. Wichtig für mich ist, ob die Möbel bequem und praktisch sind. Die Qualität spielt auch eine wichtige Rolle. Denn wenn man Geld ausgibt, will man ja auch etwas davon haben.",
            "ar": "بالنسبة ليا ما كيهمنيش كيف داير الأثاث ديالي. المهم عندي واش الأثاث مريح وعملي. والجودة حتى هي مهمة، حيت ملي كتخلص الفلوس بغيتي تستافد منهم."
        },
        "kurzA": [
            {
                "de": "Schöne Möbel und Bilder sind ihr wichtig.",
                "ar": "الأثاث والتصاور الزوينين مهمين عندها."
            },
            {
                "de": "Sie hat Antiquitäten und Designermöbel.",
                "ar": "عندها أنتيكات وأثاث ديال الديزاين."
            },
            {
                "de": "Ihre Wohnung ist immer aufgeräumt.",
                "ar": "الشقة ديالها ديما مرتبة."
            },
            {
                "de": "So fühlt sie sich wohl.",
                "ar": "هكا كتحس براسها مرتاحة."
            }
        ],
        "kurzB": [
            {
                "de": "Das Aussehen der Möbel ist ihm egal.",
                "ar": "الشكل ديال الأثاث ما كيهموش."
            },
            {
                "de": "Möbel müssen bequem und praktisch sein.",
                "ar": "الأثاث خاصو يكون مريح وعملي."
            },
            {
                "de": "Gute Qualität ist ihm wichtig.",
                "ar": "الجودة مهمة عندو."
            },
            {
                "de": "Für sein Geld möchte er etwas Gutes.",
                "ar": "بغا حاجة مزيانة مقابل الفلوس ديالو."
            }
        ],
        "fragen": [
            {
                "de": "Wie ist deine Wohnung eingerichtet?",
                "ar": "كيفاش مفرشة الدار ديالك؟"
            },
            {
                "de": "Was ist dir bei Möbeln wichtiger: schön oder praktisch?",
                "ar": "شنو أهم عندك فالأثاث: الزين ولا العملي؟"
            },
            {
                "de": "Wo kaufst du am liebsten Möbel?",
                "ar": "فين كتفضل تشري الأثاث؟"
            },
            {
                "de": "Wie wohnt man in deinem Heimatland?",
                "ar": "كيفاش كيسكنو الناس فبلادك؟"
            }
        ],
        "dialog": [
            {
                "who": "A",
                "de": "In meinem Text geht es um eine Person, die schöne Möbel liebt. Sie hat sogar Antiquitäten, und in ihrer Wohnung ist alles ordentlich. Was steht in deinem Text?",
                "ar": "فالنص ديالي كاين شخص كيبغي الأثاث الزوين. عندو حتى أنتيكات، وفالشقة ديالو كلشي مرتب. شنو كاين فالنص ديالك؟"
            },
            {
                "who": "B",
                "de": "Die Person in meinem Text findet das Aussehen nicht wichtig. Für sie müssen Möbel bequem, praktisch und von guter Qualität sein.",
                "ar": "الشخص فالنص ديالي ما كيشوفش الشكل مهم. عندو الأثاث خاصو يكون مريح وعملي وجودتو مزيانة."
            },
            {
                "who": "A",
                "de": "Und wie ist das bei dir? Achtest du auf schöne Möbel?",
                "ar": "ونتا كيفاش؟ واش كتهتم بالأثاث الزوين؟"
            },
            {
                "who": "B",
                "de": "Nicht so sehr. Mein Sofa ist alt, aber sehr bequem. Ich gebe mein Geld lieber für Reisen aus. Und du?",
                "ar": "ماشي بزاف. الكنبة ديالي قديمة ولكن مريحة بزاف. كنفضل نصرف الفلوس ديالي فالسفر. ونتا؟"
            },
            {
                "who": "A",
                "de": "Mir ist eine schöne Wohnung wichtig, weil ich viel Zeit zu Hause verbringe. Ich habe zum Beispiel einen schönen Teppich aus Marokko.",
                "ar": "أنا الدار الزوينة مهمة عندي، حيت كندوز بزاف ديال الوقت فالدار. مثلا عندي زربية زوينة من المغرب."
            },
            {
                "who": "B",
                "de": "Das klingt gemütlich. Aber sind schöne Möbel nicht oft sehr teuer?",
                "ar": "هادشي كيبان مريح. ولكن الأثاث الزوين ماشي غالبا غالي بزاف؟"
            },
            {
                "who": "A",
                "de": "Nicht immer. Auf dem Flohmarkt findet man manchmal schöne Sachen für wenig Geld.",
                "ar": "ماشي ديما. فالجوطية كتلقى شي مرات حوايج زوينة بثمن قليل."
            },
            {
                "who": "B",
                "de": "Gute Idee! Vielleicht kann man ja beides haben: schön und praktisch.",
                "ar": "فكرة مزيانة! يمكن نقدرو يكون عندنا بجوج: الزين والعملي."
            },
            {
                "who": "A",
                "de": "Genau. Am wichtigsten ist, dass man sich zu Hause wohlfühlt.",
                "ar": "بالضبط. الأهم هو تحس براسك مرتاح فالدار."
            }
        ],
        "woerter": [
            {
                "de": "die Möbel (Pl.)",
                "ar": "الأثاث"
            },
            {
                "de": "die Einrichtung",
                "ar": "الفرش / التأثيث"
            },
            {
                "de": "die Antiquität",
                "ar": "الأنتيكة"
            },
            {
                "de": "aufgeräumt",
                "ar": "مرتب"
            },
            {
                "de": "bequem",
                "ar": "مريح"
            },
            {
                "de": "praktisch",
                "ar": "عملي"
            },
            {
                "de": "die Qualität",
                "ar": "الجودة"
            },
            {
                "de": "Geld ausgeben",
                "ar": "يصرف الفلوس"
            },
            {
                "de": "der Flohmarkt",
                "ar": "الجوطية"
            },
            {
                "de": "sich wohlfühlen",
                "ar": "يحس براسو مرتاح"
            }
        ]
    } },

    "t2-04": { teil2: {
        "kind": "meinungen",
        "title": "Stress",
        "a": {
            "de": "Ich bin sehr beschäftigt. Die Arbeit wächst mir langsam über den Kopf. Aus diesem Grund bin ich immer sehr erschöpft. Für meine eigenen Interessen und zum Entspannen möchte ich mehr Zeit haben. Auch mit meinem Mann und den Kindern möchte ich mehr unternehmen.",
            "ar": "أنا مشغولة بزاف. الخدمة بدات كتفوتني شوية بشوية. لهذا ديما كنكون عيانة بزاف. بغيت يكون عندي وقت كثر للحوايج اللي كتعجبني وباش نرتاح. وبغيت حتى ندير حوايج كثر مع راجلي والدراري."
        },
        "b": {
            "de": "Ich bin eine sehr lebhafte und neugierige Person. Für mich ist die Abwechslung im Leben wichtig. Ich habe keine Ahnung, was Stress bedeutet. Ich bin immer unterwegs und das macht mir Spaß. Ich fühle mich wohl, wenn ich viel zu tun habe.",
            "ar": "أنا شخص نشيط وفضولي بزاف. التنوع فالحياة مهم عندي. ما عنديش فكرة شنو هو الستريس. ديما كنكون خارج وهادشي كيعجبني. كنحس براسي مرتاح ملي كيكون عندي بزاف ديال الخدمة."
        },
        "kurzA": [
            {
                "de": "Sie hat sehr viel Arbeit.",
                "ar": "عندها بزاف ديال الخدمة."
            },
            {
                "de": "Sie ist oft sehr müde.",
                "ar": "غالبا كتكون عيانة بزاف."
            },
            {
                "de": "Sie möchte mehr Zeit für sich.",
                "ar": "بغات وقت كثر لراسها."
            },
            {
                "de": "Sie möchte mehr mit der Familie machen.",
                "ar": "بغات دير حوايج كثر مع العائلة."
            }
        ],
        "kurzB": [
            {
                "de": "Die Person ist aktiv und neugierig.",
                "ar": "الشخص نشيط وفضولي."
            },
            {
                "de": "Abwechslung ist ihr wichtig.",
                "ar": "التنوع مهم عندو."
            },
            {
                "de": "Sie kennt keinen Stress.",
                "ar": "ما كيعرفش الستريس."
            },
            {
                "de": "Viel zu tun macht ihr Spaß.",
                "ar": "الخدمة الكثيرة كتعجبو."
            }
        ],
        "fragen": [
            {
                "de": "Hast du oft Stress? Wann?",
                "ar": "واش كيكون عندك الستريس بزاف؟ فوقاش؟"
            },
            {
                "de": "Was machst du gegen Stress?",
                "ar": "شنو كدير ضد الستريس؟"
            },
            {
                "de": "Hast du genug Zeit für deine Familie und Hobbys?",
                "ar": "واش عندك وقت كافي للعائلة والهوايات ديالك؟"
            },
            {
                "de": "Arbeitest du lieber ruhig oder mit viel Abwechslung?",
                "ar": "كتفضل تخدم بالهدوء ولا بزاف ديال التنوع؟"
            }
        ],
        "dialog": [
            {
                "who": "A",
                "de": "In meinem Text hat eine Frau sehr viel Arbeit. Sie ist immer müde und hat zu wenig Zeit für sich und ihre Familie. Was steht in deinem Text?",
                "ar": "فالنص ديالي كاينة وحدة المرا عندها بزاف ديال الخدمة. ديما عيانة وما عندهاش وقت كافي لراسها وللعائلة ديالها. شنو كاين فالنص ديالك؟"
            },
            {
                "who": "B",
                "de": "In meinem Text ist es ganz anders. Die Person ist gern aktiv und hat keinen Stress. Sie fühlt sich gut, wenn sie viel zu tun hat.",
                "ar": "فالنص ديالي الأمر مختلف تماما. الشخص كيبغي يكون نشيط وما عندوش الستريس. كيحس براسو مزيان ملي كيكون عندو بزاف ديال الخدمة."
            },
            {
                "who": "A",
                "de": "Und du? Hast du oft Stress?",
                "ar": "ونتا؟ واش كيكون عندك الستريس بزاف؟"
            },
            {
                "who": "B",
                "de": "Manchmal, besonders vor Prüfungen. Dann schlafe ich schlecht. Wie ist das bei dir?",
                "ar": "شي مرات، خصوصا قبل الامتحانات. كنعس ناقص. وعندك كيفاش؟"
            },
            {
                "who": "A",
                "de": "Bei mir ist es wie bei der Frau in meinem Text. Arbeit, Deutschkurs, Haushalt … Am Abend bin ich total kaputt.",
                "ar": "عندي بحال المرا فالنص ديالي. الخدمة، الكور ديال الألمانية، شغل الدار … فالليل كنكون عيانة بزاف."
            },
            {
                "who": "B",
                "de": "Was machst du, um dich zu entspannen?",
                "ar": "شنو كدير باش ترتاح؟"
            },
            {
                "who": "A",
                "de": "Am Wochenende gehe ich gern spazieren, am liebsten im Park. Das hilft mir. Und du?",
                "ar": "فالويكاند كنبغي نتسارا، خصوصا فالجردة. هادشي كيعاوني. ونتا؟"
            },
            {
                "who": "B",
                "de": "Ich mache Sport. Nach dem Joggen fühle ich mich viel besser.",
                "ar": "أنا كندير الرياضة. من بعد الجري كنحس براسي حسن بزاف."
            },
            {
                "who": "A",
                "de": "Ich glaube, ein bisschen Stress ist normal, aber man braucht auch Pausen.",
                "ar": "كنظن شوية ديال الستريس عادي، ولكن خاص حتى الراحة."
            },
            {
                "who": "B",
                "de": "Da hast du recht. Wichtig ist die richtige Mischung.",
                "ar": "عندك الحق. المهم هو التوازن."
            }
        ],
        "woerter": [
            {
                "de": "beschäftigt",
                "ar": "مشغول"
            },
            {
                "de": "erschöpft",
                "ar": "عيان بزاف"
            },
            {
                "de": "Die Arbeit wächst mir über den Kopf.",
                "ar": "الخدمة فاتتني"
            },
            {
                "de": "sich entspannen",
                "ar": "يرتاح"
            },
            {
                "de": "etwas unternehmen",
                "ar": "يدير شي خرجة / نشاط"
            },
            {
                "de": "lebhaft",
                "ar": "نشيط"
            },
            {
                "de": "neugierig",
                "ar": "فضولي"
            },
            {
                "de": "die Abwechslung",
                "ar": "التنوع"
            },
            {
                "de": "die Pause",
                "ar": "الراحة / البوز"
            },
            {
                "de": "kaputt sein (ugs.)",
                "ar": "عيان بزاف"
            }
        ]
    } },

    "t2-05": { teil2: {
        "kind": "meinungen",
        "title": "Arbeitszeiten in der Gastronomie",
        "a": {
            "de": "Ich bin mein eigener Chef, deshalb habe ich keine geregelten Arbeitszeiten. Zum Glück läuft mein Bekleidungsgeschäft gut. Obwohl ich sehr wenig Urlaub machen kann und immer abends und am Wochenende arbeiten muss, will ich nicht klagen.",
            "ar": "أنا الشاف ديال راسي، لهذا ما عنديش أوقات خدمة منظمة. الحمد لله المحل ديال الحوايج ديالي خدام مزيان. واخا كناخد عطلة قليلة بزاف وديما خاصني نخدم فالعشية وفالويكاند، ما بغيتش نشكي."
        },
        "b": {
            "de": "Zurzeit arbeite ich Teilzeit, das heißt nur vormittags. Neben der Hausarbeit muss ich mich um unsere kleinen Kinder kümmern. In ein paar Jahren, wenn sie größer sind, möchte ich wieder ganztags arbeiten. Darüber habe ich auch schon mit meinem Mann gesprochen. Er wird mich immer unterstützen.",
            "ar": "دابا كنخدم نص الوقت، يعني غير فالصباح. من غير شغل الدار خاصني نتهلا فالدراري الصغار ديالنا. من هنا شي سنين، ملي يكبرو، بغيت نرجع نخدم الوقت كامل. وهضرت فهادشي مع راجلي، وغادي يعاوني ديما."
        },
        "kurzA": [
            {
                "de": "Die Person ist selbstständig.",
                "ar": "الشخص خدام لحسابو."
            },
            {
                "de": "Sie hat keine festen Arbeitszeiten.",
                "ar": "ما عندهاش أوقات خدمة ثابتة."
            },
            {
                "de": "Sie arbeitet abends und am Wochenende.",
                "ar": "كتخدم فالعشية وفالويكاند."
            },
            {
                "de": "Trotzdem ist sie zufrieden.",
                "ar": "ومع ذلك راضية."
            }
        ],
        "kurzB": [
            {
                "de": "Sie arbeitet nur vormittags (Teilzeit).",
                "ar": "كتخدم غير فالصباح (نص الوقت)."
            },
            {
                "de": "Sie kümmert sich um die Kinder und den Haushalt.",
                "ar": "كتتهلا فالدراري وفشغل الدار."
            },
            {
                "de": "Später möchte sie wieder ganztags arbeiten.",
                "ar": "من بعد بغات ترجع تخدم الوقت كامل."
            },
            {
                "de": "Ihr Mann unterstützt sie.",
                "ar": "راجلها كيعاونها."
            }
        ],
        "fragen": [
            {
                "de": "Wie sind deine Arbeitszeiten?",
                "ar": "كيفاش هي أوقات الخدمة ديالك؟"
            },
            {
                "de": "Möchtest du lieber Teilzeit oder Vollzeit arbeiten?",
                "ar": "كتفضل تخدم نص الوقت ولا الوقت كامل؟"
            },
            {
                "de": "Würdest du gern selbstständig sein?",
                "ar": "واش تبغي تخدم لحسابك؟"
            },
            {
                "de": "Wer kümmert sich in deinem Heimatland meistens um die Kinder?",
                "ar": "شكون غالبا كيتهلا فالدراري فبلادك؟"
            }
        ],
        "dialog": [
            {
                "who": "A",
                "de": "In meinem Text hat eine Person ein eigenes Geschäft. Sie arbeitet oft abends und am Wochenende und hat wenig Urlaub, aber sie ist zufrieden. Was steht in deinem Text?",
                "ar": "فالنص ديالي كاين شخص عندو محل ديالو. كيخدم بزاف فالعشية وفالويكاند وعطلتو قليلة، ولكن راضي. شنو كاين فالنص ديالك؟"
            },
            {
                "who": "B",
                "de": "In meinem Text arbeitet eine Frau nur vormittags, weil sie kleine Kinder hat. Später möchte sie wieder ganztags arbeiten, und ihr Mann hilft ihr.",
                "ar": "فالنص ديالي وحدة المرا كتخدم غير فالصباح، حيت عندها دراري صغار. من بعد بغات ترجع تخدم الوقت كامل، وراجلها كيعاونها."
            },
            {
                "who": "A",
                "de": "Und wie ist das bei dir? Arbeitest du Vollzeit?",
                "ar": "ونتا كيفاش؟ كتخدم الوقت كامل؟"
            },
            {
                "who": "B",
                "de": "Im Moment arbeite ich in einem Restaurant, oft bis spät in die Nacht. Das ist anstrengend. Und du?",
                "ar": "دابا كنخدم فمطعم، غالبا حتى لوقت متأخر فالليل. هادشي متعب. ونتا؟"
            },
            {
                "who": "A",
                "de": "Ich arbeite von acht bis fünf in einem Büro. Die Abende und Wochenenden sind frei. Das finde ich sehr wichtig.",
                "ar": "أنا كنخدم من التمنية حتى الخمسة فمكتب. العشيات والويكاند خاويين. هادشي كنشوفو مهم بزاف."
            },
            {
                "who": "B",
                "de": "Das verstehe ich. Möchtest du irgendwann selbstständig sein?",
                "ar": "فهمتك. واش بغيتي شي نهار تخدم لحسابك؟"
            },
            {
                "who": "A",
                "de": "Eher nicht. Man verdient vielleicht mehr, aber man hat kaum Freizeit.",
                "ar": "لا، ماشي بزاف. يمكن تربح كثر، ولكن ما كيبقاش عندك وقت فراغ."
            },
            {
                "who": "B",
                "de": "Da hast du recht. Aber man ist frei und kann selbst entscheiden.",
                "ar": "عندك الحق. ولكن كتكون حر وكتقرر براسك."
            },
            {
                "who": "A",
                "de": "Stimmt. Ich glaube, jeder muss die richtige Arbeitszeit für sein Leben finden.",
                "ar": "صحيح. كنظن كل واحد خاصو يلقى الوقت ديال الخدمة اللي مناسب لحياتو."
            }
        ],
        "woerter": [
            {
                "de": "die Arbeitszeit",
                "ar": "وقت الخدمة"
            },
            {
                "de": "selbstständig",
                "ar": "خدام لحسابو"
            },
            {
                "de": "geregelt",
                "ar": "منظم"
            },
            {
                "de": "das Geschäft",
                "ar": "المحل / البيزنس"
            },
            {
                "de": "klagen",
                "ar": "يشكي"
            },
            {
                "de": "die Teilzeit",
                "ar": "نص الوقت"
            },
            {
                "de": "ganztags / Vollzeit",
                "ar": "الوقت كامل"
            },
            {
                "de": "sich kümmern um",
                "ar": "يتهلا فـ"
            },
            {
                "de": "unterstützen",
                "ar": "يعاون / يدعم"
            },
            {
                "de": "die Freizeit",
                "ar": "وقت الفراغ"
            }
        ]
    } }
};
