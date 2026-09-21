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

    /* النسخ (الأساسي / المعدل 1 / المعدل 2) عندهم نفس النصوص —
       اللي كيتبدل هو صياغة شي ترويسات. عوض ما نعاودو كتابة
       العشرة ديالهم ف كل نسخة، كنعطيو اللائحة الأساسية وغير
       اللي كيتبدل:

          overrides(HEADINGS, { H: { text: "…", ar: "…" } })

       كل عنصر كيتنسخ، إذن نسخة ماتقدرش تبدل فاللخرى. */
    function overrides(base, changes) {
        return base.map(function (heading) {
            return Object.assign({}, heading, changes[heading.value] || {});
        });
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

            return {
                teil1: {
                    title: "Sport ist gesund",
                    kind: "matching",
                    variants: [

                        variant("الأساسي", overrides(SPORT_HEADINGS, {}), SPORT_TEXTS),

                        variant("المعدل 1", overrides(SPORT_HEADINGS, {
                            C: { ar: "اللياقة البدنية ممكنة أيضاً مع جهد زمني قليل." },
                            D: { ar: "جودة مُعتمَدة للأطفال." },
                            F: { ar: "الآباء المتحمسون للرياضة - والأطفال الرضع أيضاً يشاركون في الجري." },
                            H: { text: "Sport ohne ausgrenzen Alter.",
                                 ar: "الرياضة دون تمييز بين الأعمار." }
                        }), SPORT_TEXTS),

                        variant("المعدل 2", overrides(SPORT_HEADINGS, {
                            C: { ar: "اللياقة البدنية ممكنة أيضاً مع قلة الوقت." },
                            D: { ar: "جودة مُعتمَدة للأطفال." },
                            F: { ar: "آباء مهووسون بالرياضة - والأطفال الرضع أيضاً يشاركون في الجري." },
                            H: { text: "Eine Disziplin, die für alle Altersgruppen geeignet ist.",
                                 ar: "انضباط مناسب لجميع الفئات العمرية." }
                        }), SPORT_TEXTS)
                    ]
                }
            };
        })(),

        /* ================================================================
           Jugend forscht / Kellner
           النصوص والترويسات كما صيفطهم صاحب الموقع.
           الحلول ماكانوش معاهم — استنتجتهم من النصوص، شوف الشرح
           فالمحادثة وأكّدهم.
           ================================================================ */
        "jugend": (function () {

            const TEXTS = [
                { answer: "J",
                  body: "Die Zahlen wirken auf den ersten Blick dramatisch: 15 Prozent der Kinder sind übergewichtig und davon sechs Prozent sogar fettleibig. Der Ernährungswissenschaftler Timo Schmidt betreibt in Berlin ein Kochstudio für Kinder und Jugendliche. Timo Schmidt meint, es fehle vor allem an Praxis-Erfahrungen in der Küche. Kinder und Jugendliche können heute oft nicht mehr kochen, so seine Erfahrung. Das Interesse ist oft da, und die Kinder wollen kochen. Aber das Problem sind die Eltern. Oft haben sie keine Zeit, den Kindern alles zu erklären. Zum anderen haben sie Angst wegen der scharfen Messer. Dabei ist die Quote von Schnittverletzungen im Kinder- und Jugendkochstudio verschwindend gering. Besonders erschreckend findet Schmidt, dass viele Kinder Lebensmittel einfach nicht mehr erkennen. So standen im Kochstudio beispielsweise Erdbeeren auf dem Tisch, die dann für Tomaten gehalten wurden. Und eine gelbe Zucchini wird gerne mal als Banane bezeichnet. „Was fehlt, ist die Praxis“, meint Schmidt. „Deswegen schneiden die Kinder dann mit der stumpfen Seite des Messers oder wissen nicht, wie heiß die Pfanne beim Kochen wird.“",
                  ar: "لقاوا الناس اللي كايتكلّفو بالصحة أن نسبة كبيرة من الأطفال الوزن ديالهم زايد، والسبب الرئيسي هو النقص في الممارسة ديال الطبخ. الخبير تيمو شميت كيقول بلي المشكل كاين في التجربة، حيت الدراري ما كايعرفوش يطيبو. الأطفال باغيين يتعلمو، ولكن الوالدين يا إما ما عندهمش الوقت باش يعلموهم، يا إما كيخافو من الموس الحاد. وهاد النقص في التطبيق خلى بزاف ديال الدراري ما كايقدروش يفرّقو بين الماكلة العادية، بحال اللي كايصحاب ليهم الفريز هو مطيشة." },

                { answer: "H",
                  body: "Immer mehr Mädchen leiden an schweren Essstörungen - und das, obwohl Ärzte und Fachleute seit Jahren vor den negativen Folgen des Schlankheitswahns warnen. Die Kinder- und Jugendpsychiatrie im Kinderkrankenhaus in Hannover schlägt jetzt Alarm. „Allein in den letzten zwei Jahren hat die Nachfrage für einen Therapieplatz um fast 50 Prozent zugenommen“, sagt der leitende Psychologe Gerd Kuznik. Von 33 zur Verfügung stehenden Plätzen in der Jugendpsychiatrie seien derzeit 25 von Mädchen mit Essstörungen belegt. „Wir wissen längst, dass dünn zu sein weder gesund noch lebensverlängernd ist“, sagt Kuznik, „doch unsere Gesellschaft konfrontiert gerade junge Mädchen noch immer mit völlig überzogenen Schlankheitsvorstellungen.“ Das allein verursacht noch keine Essstörung. „Wenn aber noch ein grundlegendes familiäres Problem hinzukommt, legen viele Mädchen einen übertriebenen Wert auf ihr Aussehen.“ So berichtet eine 17-Jährige, dass sie aus dem Gefühl heraus, „nichts hinzubekommen“, eine Diät gemacht habe. Und die Diät war dann endlich etwas, das klappte. Als Folge davon hat sie nicht nur wie geplant zwei Kilo abgenommen, sondern dreizehn. So zieht Gerd Kuznik nicht nur in diesem Fall das Fazit: Mit einer harmlosen Diät fängt es meist an, mit einer schweren Krankheit kann es enden.",
                  ar: "كولشي كيشوف بلي عدد كبير ديال البنات صغار ولاو كيعانيو من أمراض صعيبة ديال الماكلة. أطباء في مستشفى ديال الأطفال في هانوفر دقوا ناقوس الخطر، حيث طلب على بلايص العلاج تزاد بخمسين فالمية في عامين. السبب الرئيسي هو ضغط المجتمع اللي كيفرض على البنات فكرة مبالغ فيها ديال النحافة والرشاقة. هاد المشكل غالباً ما كيبدا بريجيم عادي، خصوصاً ملي كاتكون شي مشكلة أساسية فالعائلة، وكيتحول فالاخير لمرض خطير." },

                { answer: "B",
                  body: "Energiesparlampen, umweltfreundliche Elektrogeräte, Bio-Nagellack - sieht man sich die Themen an, mit denen sich die Teilnehmer des 46. Regionalwettbewerbs „Jugend forscht“ beschäftigt haben, wird vor allem eines klar: Das ökologische Bewusstsein hat die Klassenzimmer erreicht. Knapp 100 Schüler nahmen an dem Wettbewerb teil. Die Teilnehmer schreckten auch vor komplexen Themen nicht zurück. Die Zwölftklässler Adrian, Thanh und Son beschäftigten sich mit der Herstellung künstlicher Muskeln. „Die Herausforderung war, sich mit drei Fachgebieten - Anatomie, Technik und Chemie - zu beschäftigen“, sagt Adrian. Gelohnt hat es sich - in der Rubrik Technik erreichte die Gruppe den ersten Platz. In der Rubrik Arbeitswelt ermittelten die Abiturientinnen Yara-Alessandra und Bahir die Ökobilanz von Gartengeräten. „Wir haben festgestellt, dass Laubbläser mit Benzinmotor nicht nur große Mengen Kohlenstoffdioxid produzieren, sie vernichten auch Würmer und Insekten, die für das Gleichgewicht der Umwelt wichtig sind“, sagt Yara-Alessandra. Die Jury honorierte das Projekt mit dem zweiten Platz. Die Gewinner bereiten sich nun auf den Landeswettbewerb „Jugend forscht“ vor.",
                  ar: "المسابقة الجهوية ديال «الشباب كايقلّب» بيّنات باللي التلاميذ ولا عندهم وعي كبير بالبيئة. شارك فيها تقريبا 100 تلميذ، وكل واحد فيهم خدم على مواضيع علمية صعيبة بزاف. واحد المجموعة ربحات المرتبة الأولى منين صنعت عضلات اصطناعية خلطات فيها ثلاثة ديال العلوم. ومجموعات أخرى وراو باللي الماكينات اللي كاتخدم بالبنزين كاضرّ البيئة والحشرات بزاف. دابا هاد الرابحين كايوجدو للمسابقة الكبيرة ديال البلاد." },

                { answer: "A",
                  body: "13,5 Meter lang und leuchtend gelb - die „Aldebaran“ zieht die Blicke im Jachthafen auf sich. Für drei Schüler aus Diepholz ist ein Traum wahr geworden. Als Meeresforscher auf See arbeiten sie an einem eigenen Forschungsprojekt. Sie nehmen am Meereswettbewerb „Forschen auf See“ teil. Ziel des Projektes: junge Leute an wissenschaftliche Arbeiten heranzuführen. Die drei Schüler Jonas, Annika und Katharina sind 17 Jahre alt. Ihr Thema: die Verschmutzung der Nordsee mit winzigen Plastikteilchen. Zu Hause in Diepholz engagieren sich die drei in der Umwelt-Arbeitsgruppe ihrer Schule. Über die Verschmutzung der Meere mit winzigen Plastikteilchen und die Gefahren für Fische und Meeressäuger wissen sie schon einiges. Mit ihren Untersuchungen wollen sie die Aufmerksamkeit auf das Problem lenken. Die Proben sind zwar noch nicht ausgewertet, die ersten Plastikteile haben die Jugendlichen aber schon gefunden. „Es sieht so aus, dass wir Ergebnisse kriegen, die gut für unser Projekt sind - aber nicht gut für die Umwelt.“",
                  ar: "ثلاثة ديال التلاميذ شباب حققوا الحلم ديالهم: خدامين دابا كباحثين فالبحر فواحد الباطو سميتو «ألديباران»، وكيشاركوا فواحد المسابقة ديال البحث. الموضوع ديالهم هو التلوث ديال بحر الشمال بالجزيئات الصغيرة ديال البلاستيك والخطورة ديالها على الكائنات البحرية. الهدف الرئيسي من البحث هو يجلبوا الانتباه لهاد المشكل البيئي. النتائج الأولية أكدات بلي كاين بلاستيك، وكيقولو «النتائج مزيانة للمشروع ولكن ماشي مزيانة بالمرة للبيئة»." },

                { answer: "E",
                  body: "Mobbing ist kein neues Phänomen. Es ist auch in Schulen weitverbreitet. Da spricht zum Beispiel eine Lehrerin vor der Klasse negativ über eine Schülerin, weil sie etwas nicht versteht oder immer wieder krank ist. Oder die Mitschüler lachen oder lassen beleidigende Bemerkungen fallen, wenn ein bestimmter Schüler sich zu Wort meldet. Da lauern Jungen einer 4. Klasse einem schüchternen Mitschüler auf dem Schulweg auf und erpressen von ihm Geld oder Kleidung. Häufig sind die Erwachsenen ratlos oder schauen weg, während die Opfer die Schuld bei sich selbst suchen und zunehmend in eine soziale Isolation geraten. Lehrkräfte sind meist überrascht, wenn man sie auf Mobbing in einer Klasse anspricht. Denn die Schikanen geschehen oft zu subtil und meist außerhalb des Unterrichts, während der Pausen oder auf dem Schulweg.",
                  ar: "التنمر ظاهرة منتشرة بزاف فالمدارس وعندها بزاف ديال الأشكال. كايقدر يكون على شكل أستاذة كاتهضر بالخايب على التلميذ، أو التلاميذ كايضحكو على صاحبهم ولا كايخطفو منو الفلوس والملابس. الكبار غالباً ماكايعرفوش آش يديرو أو كايتجاهلو هادشي، والضحايا كايحملو الذنب على راسهم وكايتّعزلو. هاد المضايقات كايوقعو بزاف خفية ماشي فوسط القسم، بحال فالفترات ديال الراحة ولا فاش كيكونوا غاديين للمدرسة، داكشي علاش الأساتذة كايتفاجئو فاش كاتهضر معاهم عليها." }
            ];

            const HEADINGS = [
                { value: "A", text: "Jugend forscht - auch auf dem Meer",
                  ar: "لقاوا الناس اللي كايتكلّفو بالصحة أن نسبة كبيرة من الأطفال الوزن ديالهم زايد، والسبب الرئيسي هو النقص في الممارسة ديال الطبخ. الخبير تيمو شميت كيقول بلي المشكل كاين في التجربة، حيت الدراري ما كايعرفوش يطيبو. الأطفال باغيين يتعلمو، ولكن الوالدين يا إما ما عندهمش الوقت باش يعلموهم، يا إما كيخافو من الموس الحاد. وهاد النقص في التطبيق خلى بزاف ديال الدراري ما كايقدروش يفرّقو بين الماكلة العادية، بحال اللي كايصحاب ليهم الفريز هو مطيشة." },
                { value: "B", text: "Jugend engagiert sich für den Umweltschutz",
                  ar: "كولشي كيشوف بلي عدد كبير ديال البنات صغار ولاو كيعانيو من أمراض صعيبة ديال الماكلة. أطباء في مستشفى ديال الأطفال في هانوفر دقوا ناقوس الخطر، حيث طلب على بلايص العلاج تزاد بخمسين فالمية في عامين. السبب الرئيسي هو ضغط المجتمع اللي كيفرض على البنات فكرة مبالغ فيها ديال النحافة والرشاقة. هاد المشكل غالباً ما كيبدا بريجيم عادي، خصوصاً ملي كاتكون شي مشكلة أساسية فالعائلة، وكيتحول فالاخير لمرض خطير." },
                { value: "C", text: "Kochen für Eltern und Kinder",
                  ar: "المسابقة الجهوية ديال «الشباب كايقلّب» بيّنات باللي التلاميذ ولا عندهم وعي كبير بالبيئة. شارك فيها تقريبا 100 تلميذ، وكل واحد فيهم خدم على مواضيع علمية صعيبة بزاف. واحد المجموعة ربحات المرتبة الأولى منين صنعت عضلات اصطناعية خلطات فيها ثلاثة ديال العلوم. ومجموعات أخرى وراو باللي الماكينات اللي كاتخدم بالبنزين كاضرّ البيئة والحشرات بزاف. دابا هاد الرابحين كايوجدو للمسابقة الكبيرة ديال البلاد." },
                { value: "D", text: "Mehr Gewalt auf Schulhöfen",
                  ar: "ثلاثة ديال التلاميذ شباب حققوا الحلم ديالهم: خدامين دابا كباحثين فالبحر فواحد الباطو سميتو «ألديباران»، وكيشاركوا فواحد المسابقة ديال البحث. الموضوع ديالهم هو التلوث ديال بحر الشمال بالجزيئات الصغيرة ديال البلاستيك والخطورة ديالها على الكائنات البحرية. الهدف الرئيسي من البحث هو يجلبوا الانتباه لهاد المشكل البيئي. النتائج الأولية أكدات بلي كاين بلاستيك، وكيقولو «النتائج مزيانة للمشروع ولكن ماشي مزيانة بالمرة للبيئة»." },
                { value: "E", text: "Psychoterror an der Schule",
                  ar: "التنمر ظاهرة منتشرة بزاف فالمدارس وعندها بزاف ديال الأشكال. كايقدر يكون على شكل أستاذة كاتهضر بالخايب على التلميذ، أو التلاميذ كايضحكو على صاحبهم ولا كايخطفو منو الفلوس والملابس. الكبار غالباً ماكايعرفوش آش يديرو أو كايتجاهلو هادشي، والضحايا كايحملو الذنب على راسهم وكايتّعزلو. هاد المضايقات كايوقعو بزاف خفية ماشي فوسط القسم، بحال فالفترات ديال الراحة ولا فاش كيكونوا غاديين للمدرسة، داكشي علاش الأساتذة كايتفاجئو فاش كاتهضر معاهم عليها." },
                { value: "F", text: "Schiffsreise für Jugendliche",
                  ar: "رحلة بحرية للشباب" },
                { value: "G", text: "Starker Wettbewerb um Schüler",
                  ar: "تنافس قوي على الطلاب" },
                { value: "H", text: "Von der Diät zur Krankheit",
                  ar: "من الحمية إلى المرض" },
                { value: "I", text: "Wenn Lernen krank macht",
                  ar: "إذا كان التعلم يسبب المرض" },
                { value: "J", text: "Wenn aus Erdbeeren Tomaten werden",
                  ar: "عندما تصبح الفراولة طماطم" }
            ];

            return {
                teil1: {
                    title: "Jugend forscht",
                    kind: "matching",
                    variants: [

                        variant("الأساسي", overrides(HEADINGS, {}), TEXTS),

                        /* نفس النصوص ونفس الحلول — B و H متبدلة الصياغة،
                           و C و D الترجمة ديالهم متبدلة. */
                        variant("المعدل 1", overrides(HEADINGS, {
                            B: { text: "Schülerwettbewerb Umweltschutz.",
                                 ar: "مسابقة الطلاب لحماية البيئة" },
                            C: { ar: "الطهي للآباء والأبناء" },
                            D: { ar: "زيادة العنف في ساحات المدارس" },
                            H: { text: "Madchen abnehmen krankenhelten.",
                                 ar: "فتيات يتخلصن من الوزن ويعالجون المرضى." }
                        }), TEXTS),

                        /* نفس النصوص ونفس الحلول — B و H بصياغة أخرى.
                           C و D رجعو لترجمة الأساسي، إذن ماكاينش override. */
                        variant("المعدل 2", overrides(HEADINGS, {
                            B: { text: "Schülerwettbewerb mit Schwerpunkt Umwelt.",
                                 ar: "مسابقة طلابية في مجال البيئة" },
                            H: { text: "Wenn Abnehmen krank kann",
                                 ar: "إذا كان فقدان الوزن مرضًا" }
                        }), TEXTS)
                    ]
                }
            };
        })()
    };
})();
