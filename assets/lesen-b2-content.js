/* ===== محتوى امتحانات Lesen B2 =====

   مرتب حسب الموضوع، ومن بعد حسب الجزء:

     LESEN_B2_CONTENT["sport"]["teil1"] = { … }

   المفاتيح ديال الأجزاء: teil1 · teil2 · teil3 · sprach1 · sprach2
   الموضوع ماشي مجبور يكون عندو گاع الأجزاء — الصفحة كتبين
   غير اللي كاينين.

   ---------------------------------------------------------------
   "teil1" (ترويسات) — الشكل الجديد، فيه نسخ:

   {
     title: "Sport ist gesund",
     kind: "matching",
     variants: [
       {
         label: "الأساسي",
         intro:   "…",                                // التعليمة
         options: [ { value:"A", text:"…", ar:"…" }, … ],   // 10 ترويسات
         texts:   [ { body:"…", ar:"…", answer:"H" }, … ]   // 5 نصوص
       },
       { label: "المعدل 1", … },
       { label: "المعدل 2", … }
     ]
   }

   ar ديال النص = الملخص بالدارجة اللي كيبان تحتو (مطوي).
   ar ديال الترويسة = الترجمة اللي كتبان فاللوحة ديال اليمين.
   ---------------------------------------------------------------

   "teil2" و "sprach1" و "sprach2" (اختيار من متعدد):
     {
       title: "…",
       kind: "choice",
       texts: [ { title: "…", body: "…" } ],
       questions: [ { text: "…", options: ["…","…","…"], answer: 0 } ]
     }

   "teil3" (إعلانات):
     {
       title: "…",
       kind: "anzeigen",
       options: [ { value: "a", text: "…" }, … ],
       questions: [ { text: "Situation 1", answer: "c" }, … ]
     }
     الخيار "x — keine Anzeige passt" كيتزاد بوحدو.

   ملاحظة على المصدر: النصوص اللي كيصيفط صاحب الموقع كتدخل
   كما هي. اللي كتبتها أنا كتكون مكتوبة على شكل telc B2
   وكينكتب هادشي فوق الموضوع.
*/

(function () {
    "use strict";

    const INTRO = "Lesen Sie die fünf Texte und die zehn Überschriften. "
                + "Entscheiden Sie, welche Überschrift am besten zu welchem Text passt. "
                + "Jede Überschrift können Sie nur einmal verwenden.";

    function variant(label, options, texts) {
        return { label: label, intro: INTRO, options: options, texts: texts };
    }

    window.LESEN_B2_CONTENT = {

        /* ================================================================
           Sport ist gesund
           النصوص والترويسات والحلول كما صيفطهم صاحب الموقع.

           التلاتة ديال النسخ عندهم نفس النصوص ونفس الحلول
           (H · F · C · A · D). اللي كيتبدل هو صياغة الترويسات.

           إذن: النصوص مكتوبين مرة وحدة، والترويسات عندهم
           لائحة أساسية، وكل نسخة كتقول غير أش كتبدل فيها.
           هاكا الفرق بين النسخ كيبان من بعيد، وإلا صلحتي شي
           حاجة فالأساس كتتصلح فگاع النسخ.

           باش تزيد نسخة: زيد variant("السمية", overrides(…), SPORT_TEXTS)
           باش تعطي نسخة نصوص ديالها: عوض SPORT_TEXTS بلائحة ديالها.
           ================================================================ */

        "sport": (function () {

            const SPORT_TEXTS = [
        { answer: "H",
          body: "An der Ostküste Attikas in Griechenland lag in der Antike der Ort Marathon. Dort siegte der griechische König Milthiades im Jahr 490 vor Christus über das Heer der Perser. Der Sage nach soll ein Soldat die 42,2 km lange Strecke nach Athen gerannt sein, um die Nachricht dieses für Griechenland wichtigen Sieges zu überbringen. Bei seiner Ankunft in Athen brach er, noch während er die Nachricht verkündete, vor Erschöpfung tot zusammen. Auf diese Legende geht eine sportliche Disziplin zurück: der Marathonlauf. Bereits seit 1896 ist er olympische Disziplin, seit 1984 auch für Frauen. Die Streckenlänge von 42.195 m wurde 1924 festgelegt. Der Marathonlauf gilt als einziger Leistungssport, der bis ins hohe Alter ausgeübt werden kann. Wissenschaftler erklären das mit der menschlichen Evolution. Der Mensch jagte in der Frühzeit seine Beute so lange vor sich her, bis diese vor Erschöpfung nicht mehr weiter konnte. Die Fähigkeit, ausdauernd über lange Strecken zu rennen, ist also in den menschlichen Genen verankert.",
          ar: "النص كيعاود على مدينة ماراثون فاليونان، فاش ربحو اليونانيين على الجيش ديال الفرس عام 490 قبل الميلاد. كيقولو باللي واحد الجندي جرا مسافة 42 كيلومتر حتى لأثينا باش يوصل خبار النصر، ولكن مات بالعيا (بالإرهاق الشديد) ملي وصل. هاد القصة الشهيرة هي الأصل ديال سباق الماراثون اللي ولا رياضة أولمبية معروفة. العلماء كيشوفو بلي القدرة على الجري لمسافات طويلة مدفونة في الجينات ديالنا، حيت الإنسان القديم كان كيتسابق مع الفريسة ديالو حتى كاتطيح من العيا." },

        { answer: "F",
          body: "Warum soll sich der Mensch nun auf Straßen und Wegen fortbewegen? Sich in Feld und Wald, über Stock und Stein fortzubewegen, ist mindestens ebenso interessant. Daher erfand die Autoindustrie den Geländewagen und die Fahrradindustrie das Mountainbike. Da fehlte eigentlich nur noch eine Neuentwicklung eines Gefährts, dessen Mobilitätsmöglichkeiten bisher relativ begrenzt waren: der Kinderwagen. Doch das ist jetzt auch vorbei: Im Trend liegt jetzt der Jogging-Stroller, ein Kinderwagen mit nur noch drei bereiften Rädern. Diese neuen Transportmittel für Babys können sportbegeisterte und von grenzenloser Mobilität träumende Eltern jetzt samt Kind beim Joggen oder beim Inlineskaten vor sich herschieben. Die Babys sollen begeistert sein von der Geschwindigkeit, die mit solchen Geräten erreichbar ist. Doch der die Gerätesicherheit prüfende TÜV, bei Fahrzeugbesitzern in Deutschland schon seit langem als Spielverderber bekannt, warnte vor den Jogging-Strollern: Sie haben einen ungünstigen Schwerpunkt auf der Hinterachse, d.h. sie kippen leicht nach hinten um, und sie können sich leicht selbständig machen - jedenfalls solange, bis die Babys das Bremsen gelernt haben.",
          ar: "من بعد ما بانوا الطوموبيلات والبشكليطات ديال الجبل، دابا خرج نوع جديد ديال الكروسات د الدراري الصغار فيها تلاتة ديال الروايض. هاد الكروسة مصاوبة للوالدين اللي كيبغيو يجريو ولا يديرو الرياضة وهوما كيدفعوا ولادهم قدامهم. الدراري الصغار كتعجبهم السرعة ديال هاد الكروسات الجديدة، ولكن الخبراء ف ألمانيا حذروا منها حيت كاين خطر. هاد النوع يقدر يتقلب بسهولة للور وما فيهش الأمان الكافي للدراري." },

        { answer: "C",
          body: "Schweizer Forscher haben herausgefunden, dass nur 6 Minuten Hochleistungstraining pro Woche – also weniger als eine Minute pro Tag – ausreichen, um den Körper fit zu halten. In einem Versuch mit mehreren Probanden nahm eine Gruppe an einem traditionellen Ausdauertraining teil, mit ein bis zwei Trainingsstunden täglich. Die zweite Gruppe führte dagegen täglich 60 Sekunden dauernde Radsprints durch, wobei die Teilnehmer quasi aus dem Stand Höchstgeschwindigkeit erreichen mussten. Das Ergebnis war überraschend: Beide Gruppen zeigten die gleichen gesundheitlichen Verbesserungen. Die Muskeln nahmen gleich viel Sauerstoff auf, und auch die Werte des für die Sauerstoffaufnahme verantwortlichen Zitratenzyms waren gleich. Sehr kurze und hochintensive sportliche Übungen verbessern die Fitness also genauso wie das zeitaufwendige traditionelle Ausdauertraining.",
          ar: "الباحثين ف سويسرا لقاو بلي ماشي ضروري تضيع الوقت بزاف فالرياضة باش تحافظ على الصحة ديالك. غير ستة ديال الدقائق ديال التمارين القاصحة في السيمانة كافيين باش الجسم يبقى في صحة جيدة. فواحد التجربة، قارنو بين ناس كيديرو التدريب التقليدي الطويل، وناس كيديرو غير سباقات قصيرة ومجهدة ديال ستين ثانية كل نهار. النتيجة كانت مفاجئة، وهي أن المجموعات بجوج وصلو لنفس التحسن. هادشي كيعني أن التمارين القصيرة والمجهدة عندها نفس الفعالية ديال التدريب الطويل اللي كيطلب وقت بزاف." },

        { answer: "A",
          body: "Mehr Bewegung als Ausgleich für zu langes Sitzen im Büro und in der Freizeit ist zurzeit angesagt, um Übergewicht, Bluthochdruck und Herz-Kreislauf-Erkrankungen vorzubeugen und um fit zu bleiben. Gerade für Einsteiger gibt es jedoch bei den die Ausdauer trainierenden Sportarten wie dem Joggen einige Grundregeln, die beachtet werden müssen, will man gesundheitliche Schäden vermeiden. Die ersten Trainingseinheiten sollen nicht länger als 20 bis 30 Minuten dauern und zweimal pro Woche durchgeführt werden. Der Puls sollte nie den Wert 200 minus Lebensalter überschreiten, bei einem 20-Jährigen kann er also bei 180, bei einem 60-Jährigen hingegen nur bei 140 liegen. Außerdem gilt für alle, die beim Sport abnehmen möchten: Je höher der Pulsschlag, desto weniger Fett wird verbrannt. Hoher Pulsschlag lässt Sporttreibenden langsamer abnehmen.",
          ar: "خصنا نديرو الرياضة بزاف باش نوقفو الأمراض بحال السمنة وضغط الدم ونبقاو بصحة جيدة. الناس اللي عاد كيبداو التمارين، خاص الحصة ماتفوتش 20 حتى 30 دقيقة وتكون غير جوج مرات فالأسبوع. من الضروري أن دقات القلب (البولص) ما تفوتش أبداً القيمة ديال 200 ناقص العمر ديالك. وكنصيحة مهمة للي بغا ينقص الوزن: كول ما كانت دقات القلب سريعة بزاف، كول ما كيتحرق دهن أقل." },

        { answer: "D",
          body: "Viele frischgebackene Eltern stehen einem riesigen Angebot an Kinderwagen gegenüber, das in Kinderläden und Großmärkten feilgeboten wird. Doch welcher ist der richtige? Experten raten, beim Kauf dieses für die ersten Jahre mit dem Kleinkind wichtigen Gefährts auf ein paar Dinge zu achten. Erstens sollte die Matratze nicht zu weich sein, damit das Kind nicht einsinkt, wodurch die Atmung behindert werden kann. Zweitens sollten die Räder gefedert sein, um Erschütterungen auf unebenen Wegen auszugleichen. Ein hoher Wagen schützt die Babys vor dem Auspuff der Autos an Straßenkreuzungen. Zusammenklappbare Wagen passen in jeden Kofferraum und lassen sich fast überallhin mitnehmen. Der Wagen sollte vor allem kippsicher sein und keine scharfen Kanten haben, an denen sich die Kinder verletzen können. Vom TÜV geprüfte Kinderwagen erhalten ein Prüfzeichen. Damit haben die Eltern eine gewisse Sicherheit, dass der Kinderwagen auch nach Dauergebrauch nicht zu einem Sicherheitsrisiko für ihr Kind werden kann.",
          ar: "الوالدين كيحيروا في الاختيار ديال العربة ديال الرضيع حيت كاين بزاف الأنواع في السوق. الخبراء كينصحوا بالاهتمام لشي نقط مهمة باش يكون الطفل في أمان. خاص المطلة ما تكونش رطبة بزاف باش النفس ديالو ما تضيقش، و الرويض خاصهم يكونوا فيهم السور باش ما يحسش بالتقرقيب في الطريق. و أهم حاجة هي تكون العربة ثابتة ومافيهاش شي حوايج ماضيين، ومن الأحسن تكون عندها علامة السلامة المعتمدة." }
            ];

            /* اللائحة الأساسية ديال الترويسات */
            const SPORT_HEADINGS = [
                { value: "A", text: "Sport ist gesund - wenn man einige wichtige Regeln beachtet.",
                  ar: "الرياضة صحية - إذا تم مراعاة بعض القواعد المهمة." },
                { value: "B", text: "Griechische Sportler so erfolgreich wie nie zuvor.",
                  ar: "الرياضيون اليونانيون ناجحون كما لم يحدث من قبل." },
                { value: "C", text: "Fitness auch mit wenig Zeitaufwand erreichbar.",
                  ar: "يمكن الوصول إلى اللياقة البدنية أيضاً مع قلة الوقت." },
                { value: "D", text: "Geprüfte Qualität für Babys.",
                  ar: "جودة معتمدة للأطفال." },
                { value: "E", text: "Bluthochdruck beschleunigt das Abnehmen.",
                  ar: "ارتفاع ضغط الدم يسرع فقدان الوزن." },
                { value: "F", text: "Sportbegeisterte Eltern - und auch die Babys sind beim Joggen dabei.",
                  ar: "الآباء المهتمون بالرياضة - وحتى الرضع يشاركون في الجري." },
                { value: "G", text: "Täglich kurze Sprints besser als langes Ausdauertraining.",
                  ar: "الجري السريع يوميًا أفضل من التدريب الطويل على التحمل." },
                { value: "H", text: "Ein Leistungssport für jedes Alter.",
                  ar: "رياضة تنافسية لكل الأعمار." },
                { value: "I", text: "Unüberschaubares Angebot an Kinderwagen überfordert junge Eltern.",
                  ar: "عرض غير محدود من عربات الأطفال يربك الآباء الشباب." },
                { value: "J", text: "Autoindustrie: In Zukunft Mobilität ohne Grenzen.",
                  ar: "صناعة السيارات: في المستقبل، تنقل بلا حدود." }
            ];

            /* كتاخد غير اللي كيتبدل: { "H": { text: "…", ar: "…" } } */
            function overrides(changes) {
                return SPORT_HEADINGS.map(function (heading) {
                    return Object.assign({}, heading, changes[heading.value] || {});
                });
            }

            return {
                teil1: {
                    title: "Sport ist gesund",
                    kind: "matching",
                    variants: [

                        variant("الأساسي", overrides({}), SPORT_TEXTS),

                        variant("المعدل 1", overrides({
                            C: { ar: "اللياقة البدنية ممكنة أيضاً مع جهد زمني قليل." },
                            D: { ar: "جودة مُعتمَدة للأطفال." },
                            F: { ar: "الآباء المتحمسون للرياضة - والأطفال الرضع أيضاً يشاركون في الجري." },
                            H: { text: "Sport ohne ausgrenzen Alter.",
                                 ar: "الرياضة دون تمييز بين الأعمار." }
                        }), SPORT_TEXTS),

                        variant("المعدل 2", overrides({
                            C: { ar: "اللياقة البدنية ممكنة أيضاً مع قلة الوقت." },
                            D: { ar: "جودة مُعتمَدة للأطفال." },
                            F: { ar: "آباء مهووسون بالرياضة - والأطفال الرضع أيضاً يشاركون في الجري." },
                            H: { text: "Eine Disziplin, die für alle Altersgruppen geeignet ist.",
                                 ar: "انضباط مناسب لجميع الفئات العمرية." }
                        }), SPORT_TEXTS)
                    ]
                }
            };
        })()
    };
})();
