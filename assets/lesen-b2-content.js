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

   ملاحظة: النصوص هنا مكتوبين خصيصا لهاد الموقع على شكل
   امتحان telc B2 — ماشي منقولين من حتى شي كتاب ولا شي موقع.
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
           ================================================================ */
        "sport": {
            teil1: {
                title: "Sport ist gesund",
                kind: "matching",
                variants: [

                    /* ---------------- الأساسي ---------------- */
                    variant("الأساسي",
                        [
                            { value: "A", text: "Gesund bleiben – aber nur mit den richtigen Regeln",
                              ar: "تبقى فصحتك — ولكن غير إلا احترمتي بعض القواعد" },
                            { value: "B", text: "Vereine auf der Suche nach neuen Mitgliedern",
                              ar: "الجمعيات الرياضية كتقلب على منخرطين جداد" },
                            { value: "C", text: "Wenig Zeit und trotzdem fit",
                              ar: "وقت قليل ومع ذلك تبقى ف اللياقة" },
                            { value: "D", text: "Was das Gehirn vom Training hat",
                              ar: "شنو كيستافد الدماغ من التمرين" },
                            { value: "E", text: "Bewegung zwischen zwei Terminen",
                              ar: "الحركة بين جوج مواعيد" },
                            { value: "F", text: "Wenn die Eltern wieder laufen und das Kind mitfährt",
                              ar: "ملي الوالدين كيرجعو للجري والطفل معاهم" },
                            { value: "G", text: "Kurze Sprints schlagen jedes Ausdauertraining",
                              ar: "السباقات القصيرة كتغلب أي تدريب طويل" },
                            { value: "H", text: "Ein Sport, den man bis ins Alter treiben kann",
                              ar: "رياضة كتقدر تمارسها حتى للكبر" },
                            { value: "I", text: "Das richtige Essen vor dem Wettkampf",
                              ar: "الماكلة المناسبة قبل المباراة" },
                            { value: "J", text: "Kinderwagen im Test: Worauf Eltern achten sollten",
                              ar: "اختبار كروسات الصغار: على أش خاص الوالدين يردو البال" }
                        ],
                        [
                            { answer: "H",
                              body: "Laufen gehört zu den wenigen Sportarten, die man vom Schulalter bis weit über siebzig betreiben kann. Man braucht weder eine Halle noch einen Verein, sondern nur ein Paar passende Schuhe und eine halbe Stunde Zeit. Ärzte weisen allerdings darauf hin, dass Einsteiger langsam beginnen sollten: Wer jahrelang kaum in Bewegung war, überfordert Sehnen und Gelenke innerhalb weniger Wochen. Wechselt man am Anfang zwischen Gehen und Laufen, gewöhnt sich der Körper ohne Schaden an die neue Belastung. Viele Laufgruppen nehmen deshalb ausdrücklich auch ältere Anfänger auf.",
                              ar: "الجري من الرياضات القلال اللي كتقدر تمارسها من الصغر حتى لفوق السبعين. ماخاصك لا قاعة لا جمعية — غير صباط مزيان ونص ساعة. ولكن الأطباء كيقولو للمبتدئ يبدا بشوية: اللي بقا سنين بلا حركة كيتعب المفاصل بزربة. الحل: بدّل بين المشي والجري فالبداية. حيت هاكا بزاف ديال مجموعات الجري كتقبل حتى الناس الكبار." },

                            { answer: "F",
                              body: "Wer nach der Geburt eines Kindes wieder mit dem Laufen beginnen möchte, stand lange vor einem sehr praktischen Problem: Für das Kind war während des Trainings niemand da. Seit einigen Jahren gibt es dafür Wagen mit drei luftgefüllten Rädern, die sich schieben lassen, ohne bei jedem Schritt zu schwanken. Die Hersteller werben mit Freiheit für die ganze Familie, und tatsächlich kehren viele Mütter und Väter auf diese Weise früher zum Sport zurück. Prüfstellen mahnen allerdings zur Vorsicht: Der Schwerpunkt dieser Wagen liegt weit hinten, sodass sie leichter nach hinten kippen als gewöhnliche Modelle. Auf die Laufstrecke gehören sie erst, wenn das Kind sicher allein sitzen kann.",
                              ar: "اللي بغا يرجع للجري من بعد ما يجيه الولد كان ديما عندو مشكل بسيط: شكون غادي يبقى مع الصغير وقت التدريب. من شي سنين خرجو كروسات ب تلاتة ديال الروايض بالهوا، كتتدفع بلا ما تهز وتهبط ف كل خطوة. الشركات كتشهر بالحرية للعائلة كاملة، وبالفعل بزاف ديال الوالدين كيرجعو للرياضة بكري بفضلها. ولكن مكاتب الفحص كيحذرو: مركز الثقل ديال هاد الكروسات لور بزاف، ولهذا كتقلب لور بسهولة كتر من العادية. وماخاصهاش تخرج للطريق حتى يقدر الصغير يجلس بوحدو مزيان." },

                            { answer: "E",
                              body: "Wer acht Stunden am Schreibtisch sitzt, kommt selten auf die empfohlene Zahl von Schritten pro Tag. Arbeitsmediziner raten deshalb, Bewegung in den Arbeitstag einzubauen, statt sie auf den Abend zu verschieben. Das Gespräch mit dem Kollegen lässt sich im Gehen führen, die Treppe ersetzt den Aufzug, und wer telefoniert, kann dabei stehen. Entscheidend ist nicht die Länge der einzelnen Einheit, sondern dass die langen Sitzphasen regelmäßig unterbrochen werden. Schon zwei bis drei Minuten Bewegung pro Stunde wirken sich messbar auf Rücken und Kreislauf aus.",
                              ar: "اللي كيجلس تمن سوايع قدام الطابلة قلما كيوصل لعدد الخطوات المنصوح بيه. أطباء الشغل كيقولو: دخّل الحركة ف نهار الخدمة، ماتأجلهاش للعشية. هضر مع الزميل وانت كتمشي، طلع بالدرج ماشي بلاسونسور، وهضر فالتيليفون واقف. المهم ماشي طول الحصة، المهم تقطع الجلسة الطويلة بانتظام. حتى جوج ولا تلت دقائق ف كل ساعة كيبان الفرق ديالهم على الضهر والدورة الدموية." },

                            { answer: "C",
                              body: "Zeitmangel ist der häufigste Grund, den Menschen für fehlenden Sport nennen. Mehrere Studien der letzten Jahre zeigen jedoch, dass auch sehr kurze, dafür sehr intensive Einheiten den Kreislauf verbessern. In einem Versuch trainierte eine Gruppe täglich eine Stunde ausdauernd, eine zweite absolvierte nur wenige Minuten mit hoher Belastung. Nach drei Monaten waren die gemessenen Werte in beiden Gruppen ähnlich. Die Forscher betonen allerdings, dass intensives Training nicht für jeden geeignet ist und dass es das längere Ausdauertraining nicht übertrifft, sondern lediglich ersetzen kann.",
                              ar: "قلة الوقت هي السبب الأول اللي كيعطيوه الناس باش ماكيديروش الرياضة. ولكن دراسات ديال هاد السنين بينو أن حتى الحصص القصيرة بزاف — إلا كانت قوية — كتحسن الدورة الدموية. ف تجربة، مجموعة تدربات ساعة كل نهار، والأخرى غير شي دقائق بقوة عالية. من بعد تلت شهور، النتائج كانت متقاربة. ولكن الباحثين كيشددو: هاد التدريب القوي ماشي مناسب لكل واحد، وماكيتغلبش على التدريب الطويل — غير كيقدر يعوضو." },

                            { answer: "A",
                              body: "Wer nach langer Pause wieder mit Sport beginnt, sollte einige Regeln beachten, sonst wird aus dem guten Vorsatz schnell eine Verletzung. Die ersten Einheiten dauern besser zwanzig bis dreißig Minuten und finden höchstens zweimal pro Woche statt. Zwischen zwei Trainingstagen gehört ein Ruhetag, weil sich Muskeln und Sehnen erst in der Pause anpassen. Wer älter als vierzig ist oder Vorerkrankungen hat, lässt sich besser vorher ärztlich untersuchen. Und schließlich gilt: Schmerz ist kein Zeichen von Fortschritt, sondern ein Grund aufzuhören.",
                              ar: "اللي بغا يرجع للرياضة من بعد توقف طويل خاصو يحترم شي قواعد، وإلا النية المزيانة كتولي إصابة. الحصص الأولى حسن يكونو من 20 ل 30 دقيقة، وجوج مرات فالأسبوع ماكترش. وخلي نهار راحة بين جوج تداريب، حيت العضلات كتتأقلم فالراحة ماشي فالتمرين. واللي فات الأربعين ولا عندو شي مرض، حسن ليه يمشي للطبيب قبل. وفالآخر: الحريق ماشي علامة ديال التقدم — هو سبب باش توقف." }
                        ]),

                    /* ---------------- المعدل 1 ---------------- */
                    variant("المعدل 1",
                        [
                            { value: "A", text: "Wenn der Körper mehr Pause braucht",
                              ar: "ملي الجسم كيحتاج راحة كتر" },
                            { value: "B", text: "Das Wasser trägt einen Teil des Gewichts",
                              ar: "الما كيحمل جزء من الوزن" },
                            { value: "C", text: "Mitspieler sind der beste Grund zu kommen",
                              ar: "الزملاء هوما أحسن سبب باش تجي" },
                            { value: "D", text: "Vertrag unterschrieben, Studio nie gesehen",
                              ar: "وقّع العقد وعمرو مادخل للقاعة" },
                            { value: "E", text: "Früh am Morgen oder spät am Abend?",
                              ar: "بكري فالصباح ولا متأخر فالليل؟" },
                            { value: "F", text: "Schwimmen lernen im Erwachsenenalter",
                              ar: "تعلم العومان فسن الكبر" },
                            { value: "G", text: "Trainer werden im Nebenberuf",
                              ar: "تولي مدرب كخدمة ثانوية" },
                            { value: "H", text: "Wettkämpfe für Hobbysportler",
                              ar: "مباريات لهواة الرياضة" },
                            { value: "I", text: "Sportverletzungen richtig behandeln",
                              ar: "تعالج الإصابات الرياضية بالشكل الصحيح" },
                            { value: "J", text: "Was eine Mitgliedschaft wirklich kostet",
                              ar: "شحال كيسوى الانخراط بجد" }
                        ],
                        [
                            { answer: "B",
                              body: "Für Menschen mit Rücken- oder Knieproblemen empfehlen Ärzte fast immer dieselbe Sportart. Im Becken trägt das Wasser einen großen Teil des Körpergewichts, sodass Gelenke und Wirbelsäule deutlich weniger belastet werden als beim Laufen. Gleichzeitig arbeitet fast die gesamte Muskulatur mit, und der Widerstand des Wassers sorgt dafür, dass auch langsame Bewegungen anstrengend bleiben. Wichtig ist allerdings die Technik: Wer den Kopf dauerhaft über Wasser hält, verspannt den Nacken und erreicht genau das Gegenteil dessen, was er wollte.",
                              ar: "للناس اللي عندهم مشاكل فالضهر ولا الركبة، الأطباء كينصحو ديما بنفس الرياضة. فالبيسين، الما كيحمل جزء كبير من وزن الجسم، وهاكا المفاصل والعمود الفقري كيتحملو أقل بزاف من الجري. وفنفس الوقت تقريبا گاع العضلات كتخدم، ومقاومة الما كتخلي حتى الحركات البطيئة متعبة. ولكن التقنية مهمة: اللي كيبقى رافع راسو فوق الما ديما كيشد ليه الرقبة وكيوصل للعكس ديال اللي بغا." },

                            { answer: "C",
                              body: "Wer allein trainiert, hört im Schnitt nach wenigen Monaten wieder auf. In einer Mannschaft ist das anders, und der Grund ist weniger sportlich als sozial: Wer nicht kommt, fehlt den anderen. Diese Verpflichtung gegenüber der Gruppe hält viele Spieler über Jahre dabei, auch an Abenden, an denen sie allein sicher zu Hause geblieben wären. Vereine berichten außerdem, dass gerade Zugezogene über die Mannschaft schnell Anschluss finden. Das Training ist dann fast nur noch der Anlass, sich überhaupt regelmäßig zu treffen.",
                              ar: "اللي كيتدرب بوحدو، فالمعدل كيحبس من بعد شي شهور. فالفريق الأمر مختلف، والسبب اجتماعي ماشي رياضي: اللي ماجاش كينقص على الآخرين. هاد الالتزام مع المجموعة كيخلي بزاف ديال اللاعبين مستمرين سنين، حتى ف الليالي اللي كانو غيبقاو فيهم فالدار بلا شك. الجمعيات كتقول حتى الناس الجداد فالمدينة كيلقاو أصحاب بزربة عن طريق الفريق. والتدريب كيولي تقريبا غير الذريعة باش يتلاقاو بانتظام." },

                            { answer: "A",
                              body: "Nicht jede Müdigkeit nach dem Sport ist normal. Wer wochenlang hart trainiert und die Pausen streicht, bemerkt irgendwann das Gegenteil des erhofften Fortschritts: Die Leistung sinkt, der Schlaf wird schlechter, und schon kleine Belastungen fühlen sich schwer an. Sportmediziner sprechen dann von einem Zustand, in dem sich der Körper zwischen den Einheiten nicht mehr erholen kann. Hilfreich ist in diesem Fall nur eines, und es fällt den Betroffenen am schwersten: mehrere Tage oder sogar Wochen gar nichts zu tun.",
                              ar: "ماشي كل عياء من بعد الرياضة طبيعي. اللي كيتدرب بقوة أسابيع وكيمسح الراحة، كيلاحظ فشي وقت عكس اللي كان كيتسنا: المستوى كينقص، النعاس كيخسر، وحتى المجهود الصغير كيولي ثقيل. أطباء الرياضة كيسميوها حالة اللي فيها الجسم مابقاش كيقدر يرتاح بين الحصص. والحل الوحيد هو اللي صعيب على هاد الناس: تبقى أيام ولا حتى أسابيع ماتدير والو." },

                            { answer: "E",
                              body: "Die Frage taucht in jedem Kurs auf, und die ehrliche Antwort lautet: Es kommt darauf an. Am Morgen ist der Kreislauf noch nicht auf Betriebstemperatur, dafür stört später nichts mehr den Plan. Am Abend arbeiten Muskeln und Reaktionsvermögen nachweislich besser, doch ein intensives Training kurz vor dem Zubettgehen kann das Einschlafen verzögern. Untersuchungen zeigen, dass der Unterschied für Freizeitsportler ohnehin gering ist. Entscheidend bleibt die Tageszeit, zu der man den Sport tatsächlich durchhält, und nicht die theoretisch beste Stunde.",
                              ar: "هاد السؤال كيطرح ف كل دورة، والجواب الصادق هو: كيتوقف. فالصباح الدورة الدموية ماوصلاتش لحرارتها، ولكن من بعد ماغاديش يخربق ليك شي حاجة فالبرنامج. فالعشية العضلات ورد الفعل كيخدمو حسن، ولكن تدريب قوي قبل النعاس بشوية كيقدر يأخر النوم. الدراسات كتبين أن الفرق عند الهاوي صغير على كل حال. المهم هو الوقت اللي غادي تقدر تستمر فيه بجد، ماشي الساعة المثالية نظريا." },

                            { answer: "D",
                              body: "Im Januar steigen die Anmeldezahlen in den Fitnessstudios sprunghaft an, im März sind viele Geräte wieder frei. Die Branche kennt das Muster genau und kalkuliert damit: Ein großer Teil der Mitglieder zahlt zwölf Monate lang und erscheint nach den ersten Wochen kaum noch. Verbraucherschützer raten deshalb, vor der Unterschrift auf die Laufzeit und die Kündigungsfrist zu achten und im Zweifel einen kurzen Vertrag zu wählen, auch wenn er pro Monat teurer ist. Wer wirklich regelmäßig geht, kann später immer noch verlängern.",
                              ar: "ف يناير عدد التسجيلات فقاعات الرياضة كيطلع بزربة، وف مارس بزاف ديال الآلات كيرجعو خاويين. القطاع عارف هاد النمط مزيان وكيحسب عليه: جزء كبير من المنخرطين كيخلص 12 شهر وكيجي غير الأسابيع الأولى. حيت هاكا جمعيات حماية المستهلك كتنصح: قبل ماتوقع شوف مدة العقد وأجل الإلغاء، وإلا شكيتي خود عقد قصير حتى إلا كان غالي فالشهر. واللي غادي يمشي بجد يقدر يمدد من بعد." }
                        ]),

                    /* ---------------- المعدل 2 ---------------- */
                    variant("المعدل 2",
                        [
                            { value: "A", text: "Zahlen am Handgelenk statt eigenem Gefühl",
                              ar: "أرقام فالمعصم بدل الإحساس ديالك" },
                            { value: "B", text: "Wenn Schule und Sofa die Bewegung ersetzen",
                              ar: "ملي المدرسة والصالون كيعوضو الحركة" },
                            { value: "C", text: "Der Arbeitsweg als tägliches Training",
                              ar: "طريق الخدمة كتدريب يومي" },
                            { value: "D", text: "Eine Sportart ohne Altersgrenze und ohne Verein",
                              ar: "رياضة بلا حد للعمر وبلا جمعية" },
                            { value: "E", text: "Lieber abwarten, bis das Fieber weg ist",
                              ar: "حسن تتسنا حتى يمشي السخون" },
                            { value: "F", text: "Neue Radwege in den Städten",
                              ar: "ممرات جديدة ديال البيسكليط فالمدن" },
                            { value: "G", text: "Warum der Schulsport gestrichen wird",
                              ar: "علاش كيمسحو حصص الرياضة فالمدرسة" },
                            { value: "H", text: "Urlaub in den Bergen wird teurer",
                              ar: "العطلة فالجبال ولات غالية" },
                            { value: "I", text: "Wie viel Schlaf Sportler brauchen",
                              ar: "شحال من النعاس خاص الرياضي" },
                            { value: "J", text: "Den passenden Verein für Kinder finden",
                              ar: "تلقى الجمعية المناسبة للدراري" }
                        ],
                        [
                            { answer: "B",
                              body: "Kinderärzte beobachten seit Jahren dieselbe Entwicklung: Der Schulweg wird mit dem Auto zurückgelegt, der Nachmittag vor dem Bildschirm verbracht, und draußen spielt kaum noch jemand ohne Verabredung. Die Folgen zeigen sich nicht sofort, sondern erst in Untersuchungen zur Haltung und zur Ausdauer, die heute deutlich schlechter ausfallen als vor zwanzig Jahren. Fachleute fordern deshalb keine neuen Programme, sondern etwas Einfacheres: Kinder sollten den Weg zur Schule wieder selbst zurücklegen und täglich mindestens eine Stunde draußen sein.",
                              ar: "أطباء الأطفال كيلاحظو من سنين نفس الشي: الطريق للمدرسة كتقطع بالطوموبيل، العشية كتدوز قدام الشاشة، وفالبرا تقريبا حتى واحد مابقا كيلعب بلا موعد. النتائج ماكتبانش دغيا، كتبان غير فالفحوصات ديال الوضعية والتحمل، اللي ولات ضعيفة بزاف على 20 عام هاد الشي. حيت هاكا الخبراء ماكيطلبوش برامج جديدة، كيطلبو حاجة أبسط: خلي الدراري يمشيو للمدرسة برجليهم ويبقاو فالبرا ساعة على الأقل كل نهار." },

                            { answer: "D",
                              body: "Kein Beitrag, keine feste Trainingszeit, keine Mannschaft, auf die man Rücksicht nehmen muss: Wandern ist die Sportart mit den wenigsten Hürden. Man kann in jedem Alter damit anfangen und die Belastung über die Streckenlänge fast beliebig steuern. Gesundheitlich wirkt es ähnlich wie leichtes Ausdauertraining, belastet die Gelenke aber kaum. Erfahrene Wanderer warnen allerdings davor, die Strecke zu unterschätzen: Ein langer Abstieg beansprucht die Knie stärker als der Aufstieg, und schlechtes Schuhwerk ist die häufigste Ursache für Verletzungen.",
                              ar: "لا اشتراك، لا وقت تدريب محدد، لا فريق خاصك تحسب ليه حساب: المشي فالجبال هي الرياضة بأقل عراقيل. كتقدر تبدا فيها ف أي عمر وتتحكم فالمجهود عن طريق طول المسافة. صحيا كتشبه التدريب الخفيف، ولكن تقريبا ماكتعيقش المفاصل. ولكن المتمرسين كيحذرو: ماتستهينش بالمسافة — الهبوط الطويل كيتعب الركبة كتر من الطلوع، والصباط الخايب هو السبب الأول فالإصابات." },

                            { answer: "A",
                              body: "Schritte, Puls, Schlafphasen, verbrauchte Kalorien: Moderne Uhren messen fast alles und zeigen dem Träger jeden Abend, wie aktiv er war. Für viele ist das eine echte Hilfe, weil abstrakte Vorsätze plötzlich überprüfbar werden. Sportpsychologen sehen die Entwicklung jedoch zwiespältig. Wer nur noch auf das Display schaut, verlernt, auf die eigenen Signale zu hören, und trainiert an Tagen weiter, an denen eine Pause sinnvoller wäre. Die Geräte seien nützlich, so das Fazit, solange sie das Körpergefühl ergänzen und nicht ersetzen.",
                              ar: "الخطوات، دقات القلب، مراحل النعاس، السعرات: الساعات ديال دابا كتقيس تقريبا كل شي وكتوري ليك كل عشية شحال كنتي نشيط. لبزاف ديال الناس هادي معاونة بجد، حيت النوايا المجردة كتولي قابلة للقياس. ولكن علماء النفس الرياضي شايفين الأمر بعينين: اللي كيبقى غير كيشوف فالشاشة كينسى يسمع لإشارات جسمو، وكيكمل التدريب ف أيام اللي كانت الراحة حسن فيهم. الخلاصة: الأجهزة نافعة باش تكمل الإحساس بالجسم، ماشي باش تعوضو." },

                            { answer: "E",
                              body: "Eine leichte Erkältung ohne Fieber spricht nach Ansicht der meisten Ärzte nicht grundsätzlich gegen einen ruhigen Spaziergang. Sobald jedoch die Temperatur steigt, gilt eine klare Regel, und sie wird erstaunlich oft ignoriert. Der Kreislauf arbeitet bereits gegen die Infektion, und zusätzliche Belastung kann in seltenen Fällen den Herzmuskel schädigen. Fachleute raten deshalb, nach einem fieberhaften Infekt mindestens so viele Tage zu pausieren, wie die Beschwerden gedauert haben, und danach mit deutlich geringerer Intensität wieder einzusteigen.",
                              ar: "الرواح الخفيف بلا سخانة ماكيمنعش، فرأي أغلب الأطباء، تخرج تتمشى بشوية. ولكن ملي كتطلع الحرارة كاينة قاعدة واضحة، والناس كيتجاهلوها بزاف. الدورة الدموية أصلا كتحارب العدوى، وزيادة المجهود تقدر ف حالات نادرة تضر عضلة القلب. حيت هاكا الخبراء كينصحو: من بعد عدوى بالسخانة، ارتاح على الأقل نفس عدد الأيام اللي دام فيهم المرض، ومن بعد رجع بشدة أقل بزاف." },

                            { answer: "C",
                              body: "Wer täglich mit dem Rad zur Arbeit fährt, sammelt ohne zusätzlichen Zeitaufwand eine Trainingsmenge, für die andere abends extra ins Studio gehen. Genau darin liegt der Vorteil: Die Einheit fällt nicht aus, weil sie ohnehin stattfinden muss. Firmen haben das erkannt und bieten inzwischen Duschen, sichere Stellplätze und in einigen Fällen sogar geleaste Räder an. Wer die Strecke anfangs zu weit findet, kann einen Teil mit Bus oder Bahn zurücklegen und erst die letzten Kilometer selbst fahren.",
                              ar: "اللي كيمشي كل نهار للخدمة بالبيسكليط كيجمع، بلا مايضيع وقت زائد، كمية ديال التدريب اللي الآخرين كيمشيو ليها للقاعة فالعشية. وهنا هي الفايدة: الحصة ماكتطيحش حيت على كل حال خاصها تدار. الشركات فهمات هاد الشي وولات كتوفر دوشات، بلايص آمنة، وفشي حالات حتى بيسكليطات بالكراء. واللي شاف المسافة بعيدة فالبداية، يقدر يدوز جزء بالطوبيس ولا التران ويجري غير الكيلومترات الأخيرة." }
                        ])
                ]
            }
        }
    };
})();
