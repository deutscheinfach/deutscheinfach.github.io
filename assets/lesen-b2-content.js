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

    /* شي نسخ كتعاود ترتيب الترويسات، إذن الحروف كيتبدلو
       والحلول معاهم. النصوص كيبقاو هوما هوما — كنعطيوهم غير
       مفاتيح جدد:

          answers(TEXTS, ["D","J","C","B","E"])

       كل نص كيتنسخ، إذن الحلول ديال نسخة ماكيمساش لللخرى. */
    function answers(texts, keys) {
        return texts.map(function (text, i) {
            return Object.assign({}, text, { answer: keys[i] });
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
        })(),

        /* ================================================================
           Impfung
           النصوص والترويسات والحلول كما صيفطهم صاحب الموقع.
           ================================================================ */
        "impfung": (function () {

            const TEXTS = [
                { answer: "B",
                  body: "Immer wieder überspringen Krankheitserreger aus dem Tierreich die Artengrenze und werden auch dem Menschen gefährlich. Allerdings galt die Gruppe Adenoviren bislang als artgebunden: Manche verursachen beim Menschen verschiedene Probleme, von Schnupfen über Durchfall bis hin zu Lungenentzündung. Andere machen bestimmten Tierarten zu schaffen. Aber noch nie wurde bekannt, dass solche Viren von einer Spezies auf eine andere wechseln. Nun berichten Forscher erstmals von einem solchen Fall: Demnach erlitten in einem kalifornischen Primatenzentrum 23 von insgesamt 65 Roten Springaffen Entzündungen der Atemwege oder der Leber. Nur vier der infizierten Tiere überlebten. Als Ursache identifizierten die Mediziner das bislang unbekannte Adenovirus TMAdV. Dieser Erreger kann auch Menschen befallen: Ein Mitarbeiter des Primatenzentrums, der viel Kontakt zu den erkrankten Affen hatte, bekam Fieber und Husten. Zudem steckte er ein Mitglied seiner Familie an. Die Experten empfehlen, Adenoviren künftig sorgfältiger zu beobachten, um rechtzeitig auf mögliche Gefahren für den Menschen aufmerksam zu werden.",
                  ar: "غالبا الميكروبات كيدوزو من الحيوانات للبشر، ولكن ڤيروسات «أدينوڤيروس» كانو كيحساب ليهم باللي كيبقاو غير فنوع واحد. دابا، الباحثين لقاو حالة جديدة فمركز ديال القردة فكاليفورنيا، فين مرض عدد كبير من القردة الحمر بواحد ڤيروس جديد و ماتو. والأهم من هادشي، أن هاد الفيروس قفز حتى للبشر: واحد خدام فالمركز تصاب بالحمى والكحّة، وعْدى معاه واحد من عائلتو. ذاكشي علاش، الخبراء نصحو باللي خاصنا نراقبو هاد الفيروسات مزيان باش نعرفو أي خطر ممكن يهدد الناس." },

                { answer: "C",
                  body: "Virologen ist es gelungen, den Vogelgrippe-Erreger hochansteckend zu machen. Nun empfiehlt das US-Gesundheitsministerium Fachzeitschriften, die entsprechenden Daten nicht zu veröffentlichen, weil Terroristen mit ihrer Hilfe Biowaffen basteln könnten. Nur die Ergebnisse der Versuche sollen erscheinen, nicht aber Einzelheiten über die Arbeitsweise der Forscher oder Details über die Beschaffenheit der Viren. Das Ministerium stützt seine Entscheidung auf die Empfehlungen des unabhängigen Expertengremiums NSABB. Es ist das erste Mal, dass das Gremium eine solche Empfehlung ausgesprochen hat. Ihr vorausgegangen war eine wochenlange Diskussion darüber, wie Forscher mit heiklen Erkenntnissen umgehen sollen: Alles offenlegen oder brisante Versuche unterlassen und erst recht nicht veröffentlichen? Für die betroffenen Forscher steht die Freiheit der Forschung und der Presse auf dem Spiel. Unklar ist noch, inwieweit sie und die Fachjournale den Empfehlungen des NSABB folgen. Es ist für die öffentliche Gesundheit notwendig, dass alle Details jeder wissenschaftlichen Analyse zu Influenzaviren Forschern zugänglich sind.",
                  ar: "العلماء ديال الفيروسات نجحو باش يخليو فيروس أنفلونزا الطيور مُعدي بزاف. لكن وزارة الصحة الأمريكية نصحات باش ما يتنشروش جميع التفاصيل ديال هاد البحث. السبب هو أنهم خايفين الإرهابيين يستعملو ديك المعطيات باش يصنعو أسلحة بيولوجية. هاد القرار دار نقاش كبير حول حرية البحث مقابل حماية الأمن العام، وواش خاص العلماء ينشرو هاد النتائج الخطيرة ولا يخبيوها." },

                { answer: "D",
                  body: "Ein neuer Impfstoff gegen Grippe könnte in Zukunft sämtliche Varianten der Krankheit abdecken und damit die jährliche Spritze überflüssig machen. Der Stoff bekämpft die stets gleichen Proteine im Inneren der Grippeviren statt wie derzeitige Substanzen die sich ständig ändernden an der Außenhülle. Ein Forscherteam der Universität Oxford hat den Impfstoff erstmals an Menschen getestet. Weitere Studien sollen folgen. Es kann Jahre dauern, bis die Substanz eine Zulassung bekommt. Doch die Forscher sind optimistisch. Derzeit müssen jedes Jahr neue Impfstoffe für die Grippesaison entwickelt werden, weil sich die Virenhülle so schnell wandelt. Da der neue Stoff an den stabileren inneren Proteinen der Viren ansetze, könnte das in Zukunft überflüssig werden. Es könnte eine Routine-Impfung wie gegen andere Krankheiten wie zum Beispiel Tetanus entwickelt werden. Bei der bisherigen Impfung gehe es vor allem darum, den Körper zur Produktion von Antikörpern gegen die Grippeviren zu aktivieren. Der neue Stoff hingegen rege die so genannten T-Zellen an, die ebenfalls ein wichtiger Teil des Immunsystems sind.",
                  ar: "كاين واحد اللقاح جديد ضد لْگريب، لي يقدر يْغَطِّي جميع السلالات ويْحيد علينا الشّكة دْيال كُل عام. هو كايْهْجَم على البروتينات القارّة لي فْ الداخل ديال الفيروس، ماشي بحال اللقاحات القديمة لي كَتْخْدَم على الغِلاف الخارجي لي ديما كايتْغَيَّر. فريق ديال جامعة أوكسفورد جربوه على الناس، والعلماء متفائلين بزاف بالنتيجة رغم أن العملية دْيال الترخيص غادا تاخد سنين. هادشي يقدر يخليه يولي تلقيح روتيني بحال ديال أمراض أخرى، حيت كايْحَفَّز الخلايا «تي» لي جزء مهم من جهاز المناعة." },

                { answer: "G",
                  body: "Breitet sich die Grippe in einer Schule aus, sind es besonders geschlechtshomogene Gruppen, in denen das Virus schnell neue Opfer findet. Denn wie US-Mediziner herausgefunden haben, stecken Buben vor allem Buben und Mädchen in erster Linie Mädchen an. Infektionen innerhalb eines Geschlechts passieren dreimal häufiger als über die Geschlechtergrenzen hinweg. Innerhalb derselben Schulklasse sind Übertragungen fünfmal häufiger als zu einer Parallelklasse und 25 Mal häufiger als zu den Schülern anderer Schulstufen, fanden die Forscher bei Untersuchungen an einer Volksschule heraus. Ein weiterer interessanter Befund: Ob ein Kind neben einem bereits infizierten Schulkollegen saß oder nicht, machte keinen Unterschied bei der Ausbreitung der Influenza.",
                  ar: "العلماء دارو بحث فواحد المدرسة ولقاو بلي لڭريب كتنتشر بالزربة بزاف، وكتصيب التلاميذ اللي من نفس الجنس أكثر من الآخرين. الدراري كيعاديو بعضياتهم والبنات كذلك، وهادشي كيوقع ثلاثة المرات كثر من العدوى بين الذكور والإناث. العدوى بين التلاميذ ديال نفس القسم كتكون قوية بزاف بالمقارنة مع الأقسام الموازية أو المستويات التعليمية الأخرى. المهم هو أن الجلوس حدا شي واحد مريض فالفصل ما عندو حتى شي تأثير كبير على طريقة انتشار الفيروس." },

                { answer: "E",
                  body: "Da sich Influenzaviren immer wieder verändern, unternimmt die Weltgesundheitsorganisation WHO jedes Jahr große Anstrengungen, um die gerade umlaufenden Grippeviren zu identifizieren, anhand derer Pharmaunternehmen dann gezielt Impfstoffe herstellen können. Die Entwicklung solcher Impfstoffe nimmt allerdings bis zu neun Monate in Anspruch. Daher kann es vorkommen, dass sich gerade aktive Influenza-Viren von denen, die für die Herstellung des Impfstoffes verwendet wurden, etwas unterscheiden. Prinzipiell ist also jedes Jahr eine erneute Impfung notwendig. Eine neue Studie liefert Anhaltspunkte dafür, dass die tatsächliche Wirksamkeit von Grippeimpfstoffen weit niedriger sein soll als bisher angenommen. Denn in der Studie zeigte sich, dass gängige Grippeimpfstoffe nur 59 von 100 Grippefällen verhindern konnten.",
                  ar: "بما أن فيروسات الكريب كتبدل بزاف، المنظمة العالمية للصحة (WHO) كتبدل مجهود باش تعرف الأنواع الجديدة اللي دايرة باش تصايب لْها دوا. لكن، تصنيع هاد اللقاحات كيطلب حتى لتسعة ديال الشهور، داكشي علاش ضروري نديرو التلقيح كل عام حيت كيقدر يكون الفرق بين الفيروس اللي كاين و الفيروس اللي تصنع بيه اللقاح. ودراسة جديدة بينات بلي هاد اللقاحات الفعالية ديالها أقل من اللي كنا كانظنو، حيت كتمنع غير 59 حالة كريب من كل 100." }
            ];

            const HEADINGS = [
                { value: "A", text: "WHO gibt neue Empfehlungen für Grippe-Impfung heraus",
                  ar: "منظمة الصحة العالمية تصدر توصيات جديدة بشأن لقاح الإنفلونزا" },
                { value: "B", text: "Neue Erkenntnisse über artübergreifende Krankheitserreger.",
                  ar: "اكتشافات جديدة حول مسببات الأمراض عبر الأنواع." },
                { value: "C", text: "Kontroverse um den Zugang zu Forschungsergebnissen.",
                  ar: "الجدل حول الوصول إلى نتائج البحث." },
                { value: "D", text: "Hoffnung auf einen allumfassenden Grippeschutz.",
                  ar: "أمل في حماية شاملة من الإنفلونزا." },
                { value: "E", text: "Hinweise auf eingeschränkten Erfolg von Influenza-Impfungen.",
                  ar: "إشارات إلى نجاح محدود للقاحات الإنفلونزا." },
                { value: "F", text: "Gesetz verpflichtet Forscher zur Veröffentlichung ihrer Ergebnisse.",
                  ar: "القانون يُلزم الباحثين بنشر نتائجهم." },
                { value: "G", text: "Geschlechtsspezifische Übertragung von Grippeviren",
                  ar: "انتقال فيروسات الإنفلونزا حسب الجنس" },
                { value: "H", text: "Endlich eine universale Grippe-Impfung auf dem Markt",
                  ar: "أخيرًا لقاح عالمي للإنفلونزا في السوق" },
                { value: "I", text: "Durchschlagender Erfolg der diesjährigen Grippeimpfung",
                  ar: "نجاح ساحق للقاح الإنفلونزا هذا العام" },
                { value: "J", text: "Die häufigsten Kinderkrankheiten in der Grundschule.",
                  ar: "أكثر الأمراض الشائعة لدى الأطفال في المدرسة الابتدائية." }
            ];

            return {
                teil1: {
                    title: "Impfung",
                    kind: "matching",
                    variants: [
                        variant("الأساسي", overrides(HEADINGS, {}), TEXTS)
                    ]
                }
            };
        })(),

        /* ================================================================
           Tanzkurs
           النصوص والترويسات والحلول كما صيفطهم صاحب الموقع.
           ================================================================ */
        "tanzkurs": (function () {

            const TEXTS = [
                { answer: "E",
                  body: "Der Begriff Extremsport wird oft subjektiv verwendet. Man kann viele gängige Sportarten als Extremsport bezeichnen, wenn sie mit einem erhöhten Risiko für das eigene Leben ausgeübt werden, z. B. Skifahren auf ungesicherten Pisten oder Klettern ohne Sicherung. Extremsportlern geht es aber nicht darum, das höchste Risiko einzugehen, sondern ihre eigenen Grenzen zu erkennen. Extremsport kann man an vielen Orten betreiben: in der Wüste, unter Wasser, auf Klippen oder Bergen, in der Luft oder sogar auf dem eigenen Hausdach. Es gibt viele Wettbewerbe in verschiedenen extremen Sportarten, zum Beispiel Bungee-Jumping, das früher ursprünglich ein Ritual für junge Männer in der Südsee war. Eine andere Art des Extremsports ist Freeclimbing: Man klettert ohne jegliche Sicherung an mehreren hundert Meter hohen Felswänden. Kein Berg ist zu hoch, keine Wand zu steil, keine Schlucht zu tief, um für den Adrenalinkick zu sorgen. Manchen Sportlern kann es nicht aufregend genug sein. Leider entwickeln nicht wenige Extremsportler dabei eine regelrechte „Sportsucht“, die krankhaft ist. Viele Extremsportler ignorieren die Gefahren, was zu schweren Unfällen führt und sie häufig das Leben kostet.",
                  ar: "رياضة المخاطر (Extremsport) كتكون ديما مرتبطة بارتفاع الخطر على الحياة ديال بنادم، ولكن الهدف ديال الرياضيين هو يتعرفو على القدرات والحدود ديالهم. هاد الرياضات كيداروا في بزاف ديال البلايص صعيبة بحال الصحراء، تحت الما، و لا فوق الجبال العالية بحال التسلق الحر (اللي كيكون بلا حبال أمان). الرياضيين كيقلبو على الإحساس ديال «الأدرينالين» و الإثارة القوية، ولكن للأسف كاين اللي كيطور عندو إدمان مرضي لهاد الرياضات. هاد الإدمان كيخليهم يتجاهلو الأخطار، و هادشي هو اللي كيأدي لحوادث خطيرة بزاف أو حتى الموت في غالب الأحيان." },

                { answer: "D",
                  body: "Musik, Sport, ehrenamtliches Engagement – die Teilnahme von Jugendlichen an diesen sogenannten bildungsorientierten Freizeitaktivitäten hat in den vergangenen zehn Jahren deutlich zugenommen. So lautet das Ergebnis einer Studie des Deutschen Instituts für Wirtschaftsforschung. Während vor zehn Jahren erst 48 Prozent aller 16- bis 17-Jährigen an bildungsorientierten Aktivitäten teilnahmen, waren es im vergangenen Jahr bereits 62 Prozent. Die Daten zeigen außerdem: Während vor zehn Jahren nur etwa zehn Prozent der 16- bis 17-Jährigen musizierten, waren es im letzten Jahr bereits 18 Prozent. Noch stärker hat im gleichen Zeitraum das ehrenamtliche Engagement der 16- bis 17-Jährigen zugenommen (von 11 auf 22 Prozent). Darüber hinaus ist auch der Anteil der Jugendlichen gestiegen, die Sport treiben, tanzen oder Theater spielen. Gleichzeitig verzeichnen die Forscher einen Abwärtstrend bei den sogenannten informellen Freizeitbeschäftigungen. So ist der Anteil derer, die täglich mit der besten Freundin oder dem besten Freund unterwegs sind, im Untersuchungszeitraum von 40 auf 25 Prozent zurückgegangen. Auffallend ist, dass Jugendliche aus sozial schwächeren Haushalten bildungsorientierte Angebote deutlich seltener nutzen als junge Menschen aus gut situierten Familien.",
                  ar: "المشاركة ديال الشباب (بين 16 و 17 سنة) في الأنشطة المنظمة بحال الموسيقى والرياضة زادت بزاف فـ العشر سنين الأخيرة. النسبة ديالهم طلعت من 48 في المية حتى لـ 62 في المية، خصوصاً في العمل التطوعي لي ضاعف. فـ نفس الوقت، نقص الوقت لي كيدوزوه مع صحابهم فـ الأنشطة العادية اليومية. ولكن هاد التطور كاين بقلة عند الشباب ديال العائلات الفقيرة مقارنة مع العائلات الميسورة." },

                { answer: "F",
                  body: "In Firmen gibt es sie schon, jetzt wollen auch Schulen Entspannungskurse anbieten. Schüler sollen zwischen den Unterrichtsstunden mit Entspannungstechniken lernen, Stress abzubauen. Ein erster Probelauf des Projekts an einer Gesamtschule in Hamburg ist bei den Teilnehmenden gut angekommen. Die Schüler waren zu Beginn zwar skeptisch, dann aber vom Ergebnis überzeugt. „Ich konnte mich in meiner nächsten Stunde nach der Entspannungsübung viel besser konzentrieren und habe viel mehr mitbekommen“, berichtet Jens aus der 12. Klasse. Die Schule hat damit auf Kritik von Schülern und Lehrern reagiert: Nach der Umstrukturierung der Stundenpläne klagten die Schüler zunehmend über Stress und zu wenige Pausen. Gerade Entspannungspausen seien aber wichtig, erklären Pädagogen und auch Neurowissenschaftler. Nur wer ausreichend Pausen macht, kann sich Dinge auch langfristig merken. Nachdem das Projekt in Hamburg einen so großen Erfolg hatte, wollen es jetzt auch andere Schulen anbieten.",
                  ar: "المدارس بدات كتفكر دير دروس ديال الإسترخاء للتلامذ باش يقدروا ينقصوا من ستريس اللي ولا عندهم بزاف. هادشي جا من بعد ما تشكاو التلاميذ والأساتذة من التوقيت الجديد وقلة ديال الراحة. جربو الفكرة فواحد المدرسة ف هامبورغ ونجحات: التلامذ ولي عندهم تركيز أحسن، وعلماء النفس أكدو بلي هاد الوقفات ديال الإسترخاء مهمة للذاكرة. بما أن المشروع جاب نتيجة مزيانة، مدارس أخرى ناوية تبدأ تطبق هاد البرنامج." },

                { answer: "A",
                  body: "Tanja Kleist ist vom modernen Tanz absolut begeistert. Seit ihrem neunten Lebensjahr tanzt sie, früher sogar auf Wettkampfniveau. Seit einigen Jahren engagiert sie sich beim TSV Neustadt. Die Freude, die sie beim Tanzen empfindet, möchte sie weitergeben und mehr Jugendliche motivieren, diesem einzigartigen Sport eine Chance zu geben. Und diese Chance ist nun für alle Interessierten besonders groß: Für ihre Hip-Hop-Tanzgruppe sucht Frau Kleist neue tanzbegeisterte Teilnehmerinnen und Teilnehmer, da im vergangenen Sommer viele nach dem Abitur die Gruppe verlassen haben. Das abwechslungsreiche Training vereint Kreatives mit „Handwerklichem“. Im Mittelpunkt der Übungsstunden steht die Erarbeitung kleiner choreografierter Sequenzen auf der Basis von Musikvideos bekannter Hip-Hopper. Aber auch das Techniktraining und die Schulung akrobatischer Grundelemente kommen nicht zu kurz. Es entstehen Choreografien, die die Gruppe bei öffentlichen Auftritten präsentiert. Ein tolles Tanzangebot mit viel Spaß, das es ab sofort beim TSV Neustadt für Jugendliche ab 14 Jahren gibt!",
                  ar: "السيدة تانيا كلايست، اللي كاتحمق على الرقص وكاتخدم مع «تي إس في نويشتات»، بغات تشجع الشباب على فن الهيب هوب. حالياً، هي كاتقلب على مشاركين جداد اللي كايعجبهم الرقص وعمرهم ابتداءً من 14 عام، حيت بزاف ديال الأعضاء القدام مشاو من بعد الباكالوريا. البرنامج ديال التدريب متنوع، وفيه تمارين ديال التقنيات الأساسية وخلق عروض فنية قصيرة باش تقدمها المجموعة قدام الناس." },

                { answer: "G",
                  body: "Montags Tennis, dienstags Klavierunterricht, mittwochs Jazztanz in der Gruppe und donnerstags das Treffen der Astronomie-Gruppe. Was wie der Terminkalender eines vielbeschäftigten Erwachsenen klingt, ist heute oft eine ganz normale Woche im Leben von Kindern und Jugendlichen. Nicht genug damit, dass sie sechs oder sieben Stunden Schule haben, dann vielleicht noch Hausaufgaben machen und natürlich auch etwas essen müssen – in ihrer Freizeit haben sie dann gleich weitere Termine. Dabei suchen sich das viele Kinder und Jugendliche gar nicht selbst aus, sondern die Eltern wollen, dass ihr Nachwuchs möglichst viel unternimmt. Einige hoffen, aus ihrem Sohn könnte ein neuer Spitzensportler werden, andere denken an eine Karriere als Musikerin. Meist jedoch glauben die Eltern „nur“, sie müssten ihre Kinder ständig beschäftigen – sonst könnte es ihnen ja langweilig werden, und wer weiß, was sie dann machen. Viele Eltern haben Angst, dass ihre Kinder dann „auf dumme Gedanken“ kommen oder dass sie zu Hause nur vor dem Fernseher oder Computer sitzen, wenn sie nicht ständig etwas unternehmen. Ob der Freizeitstress für alle Beteiligten wirklich gut ist?",
                  ar: "النص كيهضر على كيفاش بزاف ديال الدراري الصغار والمراهقين ولا عندهم برنامج عامر بزاف بحال الناس الكبار. هاد المواعيد ديال وقت الفراغ ماشي هما اللي كيختاروها، ولكن الوالدين ديالهم اللي كيبغيوهم يديرو بزاف د الأنشطة. الوالدين يا إما كيحلمو بولادهم يوليّو نجوم ف شي حاجة بحال الرياضة أو الموسيقى، ولا خايفين لا يملّو ويجلسو غير قدام البيسي ولا التلفزة. السؤال اللي مطروح هو واش هاد الضغط وهاد الزربة ف وقت الراحة ديال الأطفال مزيان للجميع." }
            ];

            const HEADINGS = [
                { value: "A", text: "Freie Plätze im Tanzkurs",
                  ar: "أماكن شاغرة في دورة الرقص" },
                { value: "B", text: "Neue Lerntechniken präsentiert",
                  ar: "تقنيات تعلم جديدة مقدمة" },
                { value: "C", text: "Stolze Eltern: vom Schüler zum Superstar",
                  ar: "آباء فخورون: من الطالب إلى النجم الساطع" },
                { value: "D", text: "Verändertes Freizeitverhalten von Jugendlichen",
                  ar: "تغير سلوك أوقات الفراغ لدى الشباب" },
                { value: "E", text: "Höher, schneller, weiter. Suche nach dem Nervenkitzel",
                  ar: "أعلى، أسرع، أبعد. البحث عن الإثارة" },
                { value: "F", text: "Hilfen für überforderte Schüler",
                  ar: "مساعدات للطلاب المرهقين" },
                { value: "G", text: "Keine Zeit für Langeweile",
                  ar: "لا وقت للملل" },
                { value: "H", text: "Neue Sportarten",
                  ar: "رياضات جديدة" },
                { value: "I", text: "Tanzlehrer fordern, moderne Tänze bekannter zu machen",
                  ar: "يطالب معلمو الرقص بجعل الرقصات الحديثة أكثر شهرة" },
                { value: "J", text: "Befragung bestätigt alte Vorurteile",
                  ar: "استطلاع يؤكد التحيزات القديمة" }
            ];

            return {
                teil1: {
                    title: "Tanzkurs",
                    kind: "matching",
                    variants: [

                        variant("الأساسي", overrides(HEADINGS, {}), TEXTS),

                        /* الترويسات معاود ترتيبهم أبجديا، إذن الحروف
                           كاملين تبدلو — والحلول ولاو D · J · C · B · E.
                           J هي الوحيدة اللي تبدلات الصياغة ديالها. */
                        variant("المعدل 1", [
                            { value: "A", text: "Befragung bestätigt alte Vorurteile",
                              ar: "استطلاع يؤكد الأحكام المسبقة القديمة" },
                            { value: "B", text: "Freie Plätze im Tanzkurs",
                              ar: "أماكن شاغرة في دورة الرقص" },
                            { value: "C", text: "Hilfen für überforderte Schüler",
                              ar: "مساعدات للطلاب المتعثرين" },
                            { value: "D", text: "Höher, schneller, weiter: Suche nach dem Nervenkitzel",
                              ar: "أعلى، أسرع، أبعد: البحث عن الإثارة" },
                            { value: "E", text: "Keine Zeit für Langeweile",
                              ar: "لا وقت للملل" },
                            { value: "F", text: "Neue Lerntechniken präsentiert",
                              ar: "تقنيات تعلم جديدة مقدمة" },
                            { value: "G", text: "Neue Sportarten",
                              ar: "رياضات جديدة" },
                            { value: "H", text: "Stolze Eltern: vom Schüler zum Superstar",
                              ar: "آباء فخورون: من الطالب إلى النجم الساطع" },
                            { value: "I", text: "Tanzlehrer fordern, moderne Tänze bekannter zu machen",
                              ar: "يطالب معلمو الرقص بجعل الرقصات الحديثة أكثر شهرة" },
                            { value: "J", text: "Wandel im Freizeitverhalten von Jugendlichen",
                              ar: "تغيير في سلوك أوقات الفراغ لدى الشباب" }
                        ], answers(TEXTS, ["D", "J", "C", "B", "E"])),

                        /* رجع لترتيب الأساسي، إذن نفس الحلول E · D · F · A · G.
                           كيتبدل غير F، و J الترجمة ديالها. */
                        variant("المعدل 2", overrides(HEADINGS, {
                            F: { text: "Schulen unterstützen die Konzentration.",
                                 ar: "تدعم المدارس التركيز." },
                            J: { ar: "استطلاع يؤكد الأحكام المسبقة القديمة" }
                        }), TEXTS)
                    ]
                }
            };
        })()


    };
})();
