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
    { id: "kennenlernen", title: "Einander kennenlernen", ar: "التعارف", parts: ["teil1"], locked: false, level: "B1" }
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
