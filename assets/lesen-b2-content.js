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
           Au-pair-Mädchen — Leseverstehen Teil 3
           12 إعلان A–L · 10 وضعيات 11–20 · X مرتين (11 و 13)
           ================================================================ */
        "t3-aupair": {
            teil3: {
                title: "Au-pair-Mädchen",
                kind: "ads",
                intro: "Lesen Sie die Situationen 11–20 und die Anzeigen A–L. "
                     + "Welche Anzeige passt zu welcher Situation? "
                     + "Jede Anzeige können Sie nur einmal verwenden. "
                     + "Gibt es zu einer Situation keine passende Anzeige, "
                     + "markieren Sie X.",

                ads: [
                    { key: "A", head: "Infos zur Auslandsüberweisung",
                      body: "Bitte verwenden Sie die Funktion Auslandsüberweisung für Zahlungen in Länder, die nicht zum SEPA-Zahlungsraum gehören. Zu diesem Raum zählen die Mitgliedsstaaten der Europäischen Union sowie Island, Norwegen, Liechtenstein, die Schweiz und Monaco; hier gilt die Inlandsüberweisung, mit der Bürgerinnen und Bürger günstiger überweisen können. Für alle anderen Länder gilt die Auslandsüberweisung. Bitte beachten Sie, dass bei Auslandsüberweisungen in der Regel Spesen zu zahlen sind. Für nähere Auskünfte über deren Höhe wenden Sie sich bitte direkt an die Kundenbetreuung.",
                      ar: "باش تصيفط لفلوس للبلدان اللي خارجة على منطقة «SEPA»، خاصك تستعمل التحويل الدولي. التحويل لوسط بلدان SEPA (الاتحاد الأوروبي + إيسلندا، النرويج، ليختنشتاين، سويسرا وموناكو) كيكون رخيص بحال إلا كتصيفط لفلوس غير فوسط لبلاد. رد لبال بلي التحويلات الدولية لبلدان خرى غالبا كيكونوا عليها مصاريف زايدة. باش تعرف شحال هي، تواصل ديريكت مع مصلحة الزبناء." },

                    { key: "B", head: "Übersetzungen Deutsch–Französisch / Englisch–Französisch",
                      body: "Französische Muttersprachler bieten Übersetzungen Deutsch–Französisch und Englisch–Französisch von Schulzeugnissen, Lebensläufen, Bewerbungen (Anschreiben und Motivationsschreiben, Arbeitszeugnisse usw.), Arbeitsverträgen und Versicherungsverträgen. Auf Wunsch erstellen wir Ihre Anzeigen für den französischsprachigen Raum, angepasst an die jeweils landesübliche Anzeigengestaltung. Einwandfreie Qualität, schnell, garantiert termingerecht und zu einem fairen Preis. Kostenvoranschläge innerhalb von zwei Tagen. Standort Wien, Lieferungen innerhalb der EU. Nutzen Sie zur Kontaktaufnahme bitte das Online-Formular am Ende dieser Seite.",
                      ar: "هاد الناس لي لغتهم الأصلية هي الفرانسوية كيقدمو خدمات ديال الترجمة من الألمانية والإنجليزية للفرانسوية. كيترجمو بزاف ديال الوريقات بحال الشواهد ديال القراية، السيرة الذاتية، وعقود الخدمة والتأمين بجودة عالية وأثمنة مناسبة. كيعطيوك شحال غاتخلص فظرف يومين، وكيوصلو الخدمة فكاع دول الاتحاد الأوروبي. باش تواصل معاهم، عمّر الاستمارة الإلكترونية لي كاينة لتحت فهاد الصفحة." },

                    { key: "C", head: "Ein Schuljahr im Ausland",
                      body: "Als Austauschschüler/in verbringst du einige Monate oder ein ganzes Jahr im Ausland. Du kannst ein Land in Europa wählen, aber auch Länder auf einem anderen Kontinent, wie zum Beispiel Amerika oder Australien. In dem Land deiner Wahl wohnst du bei einer Gastfamilie. Du besuchst die reguläre Schule, gemeinsam mit Schülerinnen und Schülern aus deinem Gastland. So lernst du die Lebensweise und die Traditionen anderer Menschen kennen. Natürlich lernst du auch die Sprache deines Gastlandes. Wir bieten Informationsveranstaltungen in allen Bundesländern an. Dort beantworten wir alle deine Fragen. Schau doch einfach bei uns vorbei! Wir freuen uns auf dich.",
                      ar: "تقدر تمشي تقرا برا كتلميذ متبادل لواحد الشهور ولا عام كامل في أوروبا ولا فبلايص خرين بحال ميريكان وأستراليا. غادي تسكن مع عائلة تما وتمشي للمدرسة مع الدراري ديال داك لبلاد باش تعلم لغتهم وتعرف كيفاش كيعيشوا وتقاليدهم. كينظمو لقاءات إخبارية فكاع الولايات باش يجاوبو على كاع لأسئلة ديالك." },

                    { key: "D", head: "Übersetzungen Deutsch–Englisch",
                      body: "Als gebürtige Engländerin mit einem Studienabschluss in Englisch lebe ich seit vielen Jahren in Österreich. Ich biete Übersetzungen vom Deutschen ins Englische an: Lebensläufe, Ausbildungsunterlagen, Präsentationen, Websites, Produktbeschreibungen, Firmenflyer usw. Ich habe 20 Jahre Erfahrung mit Übersetzungen. Zu meinen zufriedenen Kunden zählen namhafte Unternehmen aus dem In- und Ausland. Auf Wunsch schicke ich Ihnen gerne eine Liste mit Referenzen zu. Wenn es einmal besonders schnell gehen muss, übernehme ich Expressarbeiten auch an Wochenenden. Effizient und zu einem angemessenen Preis. susan@language.at · www.susanlanguage.at",
                      ar: "هاد السيدة أصلها بريطانية وساكنة ف النمسا، كتقدم خدمة ديال الترجمة من اللغة الألمانية للغة الإنجليزية. عندها خبرة ديال عشرين عام وكترجم كاع الوثائق بحال السيرة الذاتية، المواقع الإلكترونية، والمنشورات ديال الشركات. كدير حتى الخدمة السريعة ف أيام العطلة وبأثمنة مناسبة." },

                    { key: "E", head: "Ein Konto bei der RUFA",
                      body: "Mit einem Konto bei der RUFA profitieren Sie von attraktiven Angeboten und von persönlicher Beratung. Wir haben das passende Konto für Sie – vom Girokonto bis zum Gratiskonto für Jugendliche. Jetzt aktuell: GRATIS Studentenkonto! Ihnen steht ein persönlicher Berater zur Seite, wenn Sie Auskunft oder Hilfe brauchen. Zusätzlich bietet Ihnen das Konto einige Vorteile, z. B. eine gratis Unfallversicherung bis 24 Jahre. Mit Ihrer RUFA-Clubkarte bekommen Sie außerdem Ermäßigungen in ausgewählten Shops und bei bestimmten Veranstaltungen.",
                      ar: "بنك «روفا» كيقدم عروض زوينة وأنواع مختلفة ديال الحسابات البنكية مع مواكبة شخصية لكل كليان. كاين دابا عرض خاص للطلبة باش يحلوا حساب فابور. هاد الحساب كيعطي للشباب اللي قل من 24 عام تأمين على الحوادث بلا خلاص، وكارط كتوفر ليك تخفيضات فبزاف ديال المحلات والحفلات." },

                    { key: "F", head: "Gastfamilie werden",
                      body: "Wir laden Sie dazu ein, internationale Schülerinnen und Schüler bei Ihnen zu Hause aufzunehmen. Dabei bieten Sie einem jungen Menschen mehr als nur einen Platz zum Schlafen und etwas zu essen. Sie helfen ihm, sich in einer fremden Umgebung zurechtzufinden, andere Sitten und Gebräuche und eine fremde Sprache kennenzulernen. Eine Gastschülerin oder einen Gastschüler aufzunehmen ist eine wunderbare Möglichkeit, selbst eine andere Kultur kennenzulernen und gleichzeitig die eigene Kultur zu teilen. Im Alltag können Sie gemeinsam kulturelle Unterschiede entdecken und schätzen lernen. Egal, ob Sie selbst Kinder haben, allein oder in einem klassischen Familienhaushalt leben: Wir freuen uns auf Ihre Bewerbung.",
                      ar: "هاد الإعلان كيعرض على الناس يستقبلو تلاميذ من بلدان خرى عندهم في الدار. المهمة هي تعاونوهم يوالفو العيشة هنا ويتعلمو اللغة والتقاليد، ماشي غير الماكلة والنعاس. هادي فرصة باش تكتشفو ثقافة جديدة وتشاركو معاهم حتى نتوما التقاليد ديالكم. يقدر أي واحد يقدم الطلب ديالو، سواء كان ساكن بوحدو ولا مع عائلتو ووليداتو." },

                    { key: "G", head: "Freie Mitarbeit: Übersetzungen ins Französische",
                      body: "Französisch ist Ihre Muttersprache? Wir suchen eine freie Mitarbeiterin oder einen freien Mitarbeiter für Übersetzungen vom Deutschen ins Französische. Sie arbeiten fallweise und von zu Hause aus (keine feste Anstellung). Ihr Aufgabenbereich: Übersetzung von einfachen, kurzen Texten (Anfragen, Beantwortung von Anfragen, Reaktion auf Beschwerden usw.). Wenn nötig, führen Sie auch kurze Telefonate mit französischen Kundinnen oder Kunden. Sie werden von uns eingearbeitet. Sie lernen unsere Produkte und das Fachvokabular anhand zweisprachiger Unterlagen kennen. Bei Fragen stehen Ihnen unsere Mitarbeiter gerne zur Verfügung. Interessiert? Wir freuen uns auf Ihre Online-Bewerbung.",
                      ar: "كايقلبو على شي حد لغتو الأم هي الفرانساوية باش يخدم معاهم فالترجمة من الألمانية. الخدمة حرة ومن الدار (ماشي عقد قار)، وفيها غير نصوص قصيرة وشي مكالمات مع الكليان. غادي يعاونوك فالبداية باش تعلم السلعة والمصطلحات اللي كايخدمو بيها. إلا عجبك العرض، تقدر تدفع الطلب ديالك فالأنترنت." },

                    { key: "H", head: "Ein Tag im Zeichen der guten Nachbarschaft",
                      body: "Im Rahmen des europäischen Nachbarschaftstages wurde auch heuer wieder in unserem Bezirk zu gemeinsamem Kochen und Genießen eingeladen. Solche Veranstaltungen dienen dazu, andere Menschen und Kulturen besser kennenzulernen. Wie auch in den vergangenen Jahren wurde das Fest wieder sehr gut aufgenommen; die Veranstalter erhielten begeisterte Mails. Da viele Leute die zahlreichen Spezialitäten aus aller Welt nachkochen möchten, finden Sie hier unser Online-Rezeptbuch mit allen Gerichten des Tages.",
                      ar: "هاد الإعلان كيهضر على واحد النشاط داروه فالحومة بمناسبة يوم الجيران الأوروبي، فين تجمعات الناس باش يطيبو وياكلو مع بعضياتهم. هاد المناسبة كتعاون الناس باش يتعرفو على بعضياتهم وعلى ثقافات جديدة. الحفلة نجحات بزاف والناس عجباتهم الفكرة. وباش الناس يقدرو يطيبو دوك الشهيوات فديورهم، حطو ليهم كتاب الوصفات فالموقع ديالهم." },

                    { key: "I", head: "Konto-Neuheiten",
                      body: "Mit der neuen BaZa-App erledigen Sie Ihre Bankgeschäfte, wann und wo Sie wollen. Für die schnelle Überweisung unterwegs, mit ein paar Klicks: Geben Sie einfach den Namen Ihres BaZa-Kontaktes an, alles andere erledigt die App für Sie. Oder per Smartphone-Kamera: Sie fotografieren einen Zahlschein, und die App erfasst die Daten automatisch. Mit der App können Sie auch direkt mit Ihrer Kundenbetreuerin oder Ihrem Kundenbetreuer Kontakt aufnehmen – eine Nachricht schicken, einen Termin vereinbaren oder um einen Rückruf bitten. Für alle, die schon ein BaZa-Konto haben: jetzt die neue App herunterladen.",
                      ar: "هاد الإعلان كيهضر على تطبيق «باَزا» الجديد اللي كايخليك تدير الأمور البنكية ديالك فينما كنتي وفوقتما بغيتي. تقدر تصيفط الفلوس بسرعة غير بالسمية ديال الشخص، ولا تصوّر ورقة الخلاص بالكاميرا والتطبيق كيقيد المعلومات بوحدو. كيمكن لك كذلك تتواصل مباشرة مع المستشار البنكي ديالك باش تصيفط ليه رسالة ولا تاخد موعد." },

                    { key: "J", head: "Laiendolmetscher an der Volkshochschule",
                      body: "Seit einigen Jahren bietet die Volkshochschule Laiendolmetscherinnen und Laiendolmetscher an, die fremdsprachigen Eltern den Kontakt mit der Schule erleichtern sollen. Das Angebot soll dazu beitragen, die Beziehungen zwischen Eltern, Lehrerinnen und Lehrern sowie der Schulleitung zu verbessern. Das Ziel ist ein besseres Miteinander und mehr Verständnis füreinander. Die Laiendolmetscher werden von der VHS auf ihre Aufgabe vorbereitet. Momentan bietet die VHS Laiendolmetscher in den Sprachen Albanisch, Bosnisch, Kroatisch, Serbisch, Slowakisch, Rumänisch, Türkisch, Spanisch und Italienisch an. In Zukunft soll das Angebot um weitere Sprachen erweitert werden.",
                      ar: "مؤسسة التعليم الشعبي (VHS) كتقدم خدمة ديال المترجمين المتطوعين باش يعاونو الوالدين الأجانب يتواصلو بسهولة مع المدرسة د ولادهم. الهدف هو تحسين التفاهم بين الوالدين، الأساتذة، وإدارة المدرسة. هاد المترجمين كيتدربو فـالمؤسسة وحالياً متوفرين بـ 9 د اللغات منها التركية، الإسبانية والإيطالية، وفي المستقبل غادي يزادو لغات أخرين." },

                    { key: "K", head: "Spezialitäten aus der Küche",
                      body: "Viele klassische Gerichte, die in Österreich auf den Tisch kommen, stammen aus den ehemaligen Kronländern: So kommt das Schnitzel aus Italien, die Palatschinke aus Ungarn, Golatschen und Knödel kommen aus dem heutigen Tschechien. Dazu kommen zahlreiche regionale Spezialitäten wie Kasnudeln aus Kärnten, steirisches Wurzelfleisch oder Salzburger Nockerl. Dies und vieles mehr können Sie bei einem unserer Kochkurse kennenlernen. Besonders willkommen sind Menschen, die aus anderen Ländern zu uns gekommen sind. Die Liste der Veranstaltungen finden Sie weiter unten.",
                      ar: "هاد الإعلان كيهضر على دورات ديال الطبخ فالنمسا فين يمكن لك تتعلم تطيب أطباق نمساوية تقليدية. بزاف من هاد الأطباق أصلها من بلدان مجاورة بحال إيطاليا والمجر وجمهورية التشيك. هاد الدورات كترحب بالخصوص بالناس اللي جايين من دول أخرين. قائمة الأنشطة والمواعيد كاينة لتحت." },

                    { key: "L", head: "Am Weltspartag zur Bank",
                      body: "Der Weltspartag wurde am 1. internationalen Sparkassenkongress in Mailand im Oktober 1924 ins Leben gerufen, um die Bevölkerung zum Sparen zu bringen. Offiziell wird der Weltspartag am 31. Oktober gefeiert, in Österreich manchmal auch am letzten Werktag vor dem 31. Oktober. Denn an diesem speziellen Tag sollen die Banken für Kunden geöffnet haben. Besonders bei Kindern ist der Weltspartag sehr beliebt. Sie erhalten nämlich kleine Geschenke, wenn sie an diesem Tag mit ihrem Sparschwein zur Bank kommen. Aber auch für Erwachsene gibt es am Weltspartag oft besondere Angebote.",
                      ar: "اليوم العالمي للتوفير بدا ف سنة 1924 باش يشجّع الناس يجمعو الفلوس. كيتحتفلو بيه رسمياً نهار 31 أكتوبر، وهاد النهار كيكونو الأبناك حلّين للزبناء. الدراري الصغار كيعجبهم هاد النهار بزاف حيت كياخدو هدايا صغار فاش كيجيبو الحصّالة ديالهم للبنك. وحتى الكبار كيكونو عندهم عروض خاصة." }
                ],

                situations: [
                    { no: 11, de: "Sie suchen ein Au-pair-Mädchen, das im Haushalt helfen und mit Ihren Kindern Englisch sprechen soll.",
                             ar: "كتقلب على بنت أوبير تعاونك فالدار وتهضر مع وليداتك بالإنجليزية." },
                    { no: 12, de: "Ihre 14-jährige Nichte möchte sich über einen Auslandsaufenthalt informieren.",
                             ar: "بنت ختك اللي عندها 14 عام باغة تعرف على الإقامة فالخارج." },
                    { no: 13, de: "Ihr Sohn möchte als Koch im Ausland arbeiten. Er sucht nach einer passenden Stelle.",
                             ar: "ولدك باغي يخدم كطباخ فالخارج وكيقلب على شي بلاصة مناسبة." },
                    { no: 14, de: "Eine französische Bekannte ist Übersetzerin und möchte gelegentlich arbeiten.",
                             ar: "وحدة صاحبتك فرنسية مترجمة وباغة تخدم مرة مرة." },
                    { no: 15, de: "Ihre kinderlose Nachbarsfamilie möchte für einige Zeit einen jungen Menschen aufnehmen.",
                             ar: "الجيران ديالك اللي ما عندهمش دراري باغين يستقبلو شي شاب لواحد المدة." },
                    { no: 16, de: "Sie sollen die neue Webseite Ihrer Firma ins Englische übersetzen lassen.",
                             ar: "خاصك تترجم الموقع الجديد ديال الشركة ديالك للإنجليزية." },
                    { no: 17, de: "Sie kochen gerne und suchen nach Rezepten aus anderen Ländern.",
                             ar: "كيعجبك الطياب وكتقلب على وصفات من بلدان أخرى." },
                    { no: 18, de: "Im Herbst beginnt Ihre Tochter ein Studium. Sie möchte ein Bankkonto eröffnen.",
                             ar: "بنتك غادي تبدا القراية فالخريف وباغة تحل حساب بنكي." },
                    { no: 19, de: "Sie wollen Geld nach Kanada überweisen. Sie möchten wissen, wie viel Sie für die Überweisung bezahlen müssen.",
                             ar: "باغي تصيفط فلوس لكندا وباغي تعرف شحال غاتخلص على التحويل." },
                    { no: 20, de: "Ein Freund aus Salzburg will sich in Frankreich bewerben. Er möchte seine Zeugnisse übersetzen lassen.",
                             ar: "واحد صاحبك من سالزبورغ باغي يقدم طلب خدمة ف فرنسا وباغي يترجم الشواهد ديالو." }
                ],

                variants: [
                    { label: "الأساسي",
                      answers: ["X", "C", "X", "G", "F", "D", "H", "E", "A", "B"] }
                ]
            }
        },


        /* ================================================================
           Anwalt — Leseverstehen Teil 3
           12 إعلان A–L · 10 وضعيات 11–20 · X = ماكاين حتى واحد مناسب
           ================================================================ */
        "t3-anwalt": {
            teil3: {
                title: "Anwalt",
                kind: "ads",
                intro: "Lesen Sie die Situationen 11–20 und die Anzeigen A–L. "
                     + "Welche Anzeige passt zu welcher Situation? "
                     + "Jede Anzeige können Sie nur einmal verwenden. "
                     + "Gibt es zu einer Situation keine passende Anzeige, "
                     + "markieren Sie X.",

                ads: [
                    { key: "A", head: "Urlaub auf dem Sofa",
                      body: "Im Urlaub zu Hause bleiben und sich auf dem Sofa ausruhen? Das fanden wir zu langweilig! Sofa ja, aber nicht das eigene – so lässt sich unsere Urlaubsidee zusammenfassen. Wenn Sie durch Deutschland, Frankreich, England oder andere europäische Länder reisen und dabei nicht nur Hotelzimmer, sondern ganz normale Leute kennenlernen wollen, dann buchen Sie jetzt bei uns. In unserer Datenbank bieten Menschen aus ganz Europa einen Schlafplatz für eine Person in ihrer Wohnung an – manchmal ein Zimmer, manchmal ein Sofa. Gegen eine geringe Gebühr kann man dort übernachten, und das Frühstück ist auch mit dabei. So lernen Sie Länder, Städte und Menschen mal von einer ganz anderen Seite kennen! Infos und Buchung unter: www.schlafplaetze-in-europa.eu",
                      ar: "هاد الإعلان كيهضر على طريقة جديدة للسفر ف أوروبا بلا ما تبيت ف لوطيل. كيمكن ليك تخلص ثمن رخيص وتنعس عند ناس ف ديورهم، إما ف بيت بوحدك ولا غير فوق السوفا، ومعاها حتى لفطور. هاد الفكرة غاتخليك تكتشف بلدان والناس ديالها بطريقة مختلفة على لعادة." },

                    { key: "B", head: "Alte Möbel aufarbeiten",
                      body: "Viele Menschen hängen an ihren alten Möbeln und möchten sie nicht gegen andere tauschen, obwohl diese ihre besten Tage schon hinter sich haben. Wir bieten Ihnen für wenig Geld die Restauration Ihrer Möbel an. Mit einer anderen Farbe wirken viele Stücke wieder wie neu! Und falls ein Anstrich nicht reicht, zeigt Ihnen unsere Werkstatt, was noch möglich ist: z. B. neue Türen an Schränken oder neue Bezüge für Ihre Sessel und Sofas. Wir kommen gern zu Ihnen nach Hause und machen Ihnen ein kostenloses Angebot! www.schreiner.de",
                      ar: "هاد الشركة كترجع المّابل القديم اللي عزيز عليك بحال الجديد بثمن رخيص. كيقدروا يصبغوه، يبدلو ليه البيبان، ولا يغلفو الكراسي والفوطويات. كيجيو حتى لعندك للدار وكيعطيوك ثمن الخدمة فابور بلا ما تخلص والو." },

                    { key: "C", head: "Kunstmarkt",
                      body: "In unseren Ausstellungsräumen am Platanenhof bieten wir an jedem ersten Samstag im Monat jungen Künstlerinnen und Künstlern die Möglichkeit, sich und einige ihrer Werke vorzustellen. Wenn Sie an einer Ausstellung interessiert sind, melden Sie sich bitte spätestens sechs Wochen vor dem gewünschten Termin bei uns an. Aber auch Besucher sind herzlich willkommen! Gegen einen geringen Eintritt erwartet Sie nicht nur neue Kunst, auch Kaffee und Tee werden serviert, und natürlich haben Sie auch die Gelegenheit, ein Werk gleich zu kaufen und mitzunehmen. Weitere Informationen und Anmeldung unter: www.galeria.de",
                      ar: "هاد البلاصة ف «بلاتانِنهوف» كتدير معرض كل أول سبت ف الشهر باش تعاون الفنانين الشباب يوريو الخدمة ديالهم. إلا كنتي فنان وبغيتي تشارك، خاصك تسجل ستة د السيمانات قبل الموعد. حتى الزوار يقدرو يجيو يشوفو الفن، يشربو القهوة وأتاي ويشريو اللوحات لي عجباتهم مقابل ثمن بسيط للدخول." },

                    { key: "D", head: "Die eigene Wohnung",
                      body: "Für viele ist die eigene Wohnung ein Traum – aber es gibt auch Fragen und Probleme. Wir bieten extra für alle, die zum ersten Mal die eigenen vier Wände beziehen, Infoabende an, in denen Sie alles Wichtige zur Haushaltsführung erfahren: Wie bewahrt man Lebensmittel richtig auf? Wie viele Vorräte braucht man? Wie putzt man richtig und welches Mittel ist am besten geeignet? Wie spart man Strom und Heizkosten? Erfahren Sie alles, was wichtig ist, von Omas Spar-Rezepten bis hin zu moderner Küchentechnik. Die Teilnahme ist kostenlos, um Anmeldung wird aber gebeten. AWO Kirchhellen, Tel. 0800 / 61619012",
                      ar: "هاد الإعلان كيقدم أمسيات توعوية مجانية للناس اللي غادي يسكنو بوحدهم لمرة الأولى. غايعلموكم فيها كلشي على تنظيم الدار، بحال تخزين الماكلة، التنظيف الصحيح، وكيفاش تقتصدو فمصاريف الضو والتدفئة. غاتستافدو من نصائح قديمة ومن تقنيات الكوزينة الحديثة. الحضور فابور ولكن خاص التسجيل مسبقاً." },

                    { key: "E", head: "Unser neues Wohnkonzept",
                      body: "Unser Angebot: 1-Zimmer-Wohnungen mit kompletter Ausstattung, auch Telefon und Internet, außerdem morgens kostenlose Tageszeitung nach Wunsch sowie ein komplettes Frühstück. Alle Wohnungen verfügen über großzügige Arbeitsplätze sowie Drucker, Fax etc. In über 25 Städten buchbar. Außerdem auf Wunsch persönlicher Service (Kurierdienst, Abholung vom Bahnhof/Flughafen etc.). Wir gestalten Ihre Geschäftsreise so angenehm wie möglich – für alle, denen Hotels zu unpersönlich sind. Informationen unter: www.wohnkonzept.de",
                      ar: "هاد الإعلان كيقدم كرا ديال شقق صغيرة مجهزة بالكامل للناس اللي مسافرين على قبل الخدمة ف أكثر من 25 مدينة. هاد الشقق فيهم كاع داكشي اللي كتحتاج بحال لانتيرنيت، الفطور، وبلاصة مخصصة للخدمة فيها الطباعة والفاكس. كيقدمو حتى خدمات زايدة بحال التوصيل من المطار ولا المحطة. هاد العرض مناسب للناس اللي ما كيعجبهمش يبقاو فالفنادق." },

                    { key: "F", head: "Ihr gutes Recht",
                      body: "Wenn es um Rechtsfragen geht, kann es schnell teuer werden. Anwalts- und vielleicht auch Gerichtskosten werden fällig – von den Nerven, die man verliert, ganz zu schweigen. Wir bieten eine günstige und zuverlässige Alternative in allen Fragen rund um das Mietrecht: Ihre Miete wurde erhöht oder Ihr Vermieter repariert Schäden in der Wohnung nicht? Oder haben Sie eine Kündigung von Ihrem Vermieter erhalten, obwohl Sie immer pünktlich die Miete überwiesen haben und auch sonst alles in Ordnung war? Dann vereinbaren Sie einen kostenlosen Beratungstermin bei uns! Wenn wir Sie von unserem Angebot überzeugt haben, können Sie anschließend Mitglied in unserem Verein werden – für nur 75,00 Euro pro Jahr! Mieterschutzbund Brandenburg",
                      ar: "هاد الإعلان من جمعية «Mieterschutzbund Brandenburg» اللي كتعاون الناس اللي كاريين فاش كيكون عندهم مشاكل قانونية مع موالين الديور. إلا تزادت عليك سومة الكرا، ولا مول الدار مابغاش يصلح الصداع اللي فدارك، ولا صيفط ليك لوراق باش تخوي الدار بلا سباب، هوما كيدافعو عليك. كيقدمو ليك موعد ديال استشارة أولى فابور. وإلا عجباتك الخدمة ديالهم، تقدر تولي عضو غير بـ 75 يورو فالعام." },

                    { key: "G", head: "Günstig wohnen in über 70 Städten in Deutschland",
                      body: "Wir bieten Ihnen die preiswerte Alternative zum teuren Hotelzimmer: Erleben Sie Deutschland und wohnen Sie in über 70 Städten von Flensburg bis Konstanz in einer unserer neuen Pensionen. Wir bieten gemütliche Mehrbettzimmer, einige auch mit Bad. Unsere Häuser sind jeweils zentral gelegen und somit gut zu erreichen. Wir bieten Ihnen auch kleine warme Mahlzeiten an, aber fast überall in der Nähe unserer Pensionen finden Sie kleine Cafés. Ideal für alle, die günstig reisen möchten! Weitere Informationen und Buchung unter: www.pensionen.de",
                      ar: "هاد الإعلان كيقدم بديل رخيص للأوتيلات الغاليين ف كتر من 70 مدينة ف ألمانيا. عندهم بيتات مريحين كيهزو بزاف د الناس وموقعهم فوسط لمدينة باش يسهال توصل ليهم. كيقدمو وجبات سخونة خفيفة، وكاينين حتى قهاوي صغار قراب ليهم. هاد العرض مزيان للناس اللي بغاو يسافرو بثمن قليل." },

                    { key: "H", head: "Zuhause bleiben und trotzdem was erleben",
                      body: "Urlaub zu Hause – für viele das schönste Urlaubserlebnis! Wir haben Tipps, wie Sie Ihren Urlaub noch schöner machen können: Veranstaltungstipps (Konzerte, Theater …), Kurse (Kochkurse, Singen, Musikinstrumente …), Sport- und Ausflugstipps für Ihre Region. Ob allein, zu zweit oder mit der ganzen Familie – bei uns finden Sie das Passende! Registrieren Sie sich jetzt, und Sie können auswählen, welche Tipps wir Ihnen zuschicken sollen. Natürlich kostenlos! Infos und Registrierung unter: www.urlaubzuhause.info",
                      ar: "هاد السيت كيقدم نصائح للناس اللي بغاو يدوزو عطلة زوينة فمدينتهم بلا ما يسافرو بعيد. كاينين بزاف د الأنشطة بحال الحفلات، دروس الطياب، والرياضة اللي كاتناسب العائلات ولا الناس اللي بوحدهم. التسجيل فابور وتقدر تختار غير الحوايج اللي مهتم بيهم باش يوصلوك." },

                    { key: "I", head: "Guter Rat ist nicht teuer",
                      body: "Probleme mit Arbeitgeber oder Vermieter? Hatten Sie einen Unfall und niemand will die Kosten für Ihren Krankenhausaufenthalt zahlen? In solchen Fragen ist es gut, wenn man einen Anwalt an seiner Seite hat – und ihn auch bezahlen kann. Schließen Sie deshalb unsere kostengünstige Rechtsschutzversicherung ab. Wir zahlen den Anwalt und die Gerichtskosten – je nach Tarif komplett oder zum Teil. Informieren Sie sich auch über unsere günstigen Familientarife! Rufen Sie an: Thüringer Versicherungen, Tel. 08074 55339. Wichtig: Sie können die Leistungen erst 6 Monate nach Vertragsabschluss in Anspruch nehmen!",
                      ar: "إلا كانوا عندك مشاكل مع الخدمة ولا مع مول الكرا، ولا درتي حادثة وما بغاوْش يخلصو ليك السبيطار، هاد الإعلان كايقدم ليك تأمين قانوني رخيص. هاد التأمين كايخلص عليك المحامي ومصاريف المحكمة كاملة ولا غير جزء منها على حسب العرض، وكاينين حتى عروض مزيانة للعائلات. حاجة مهمة: كتقدر تستافد من هاد الخدمة غير من بعد ستة د الشهور ملي تسني العقدة." },

                    { key: "J", head: "Kunst und Kultur für Einsteiger",
                      body: "Nicht nur im Urlaub möchten viele Menschen in der Freizeit Neues ausprobieren. Wir bieten Schnupperkurse zu verschiedenen Freizeitaktivitäten an: Malen war schon immer Ihre Leidenschaft? Sie wollten schon lange probieren, welches Instrument zu Ihnen passt? Dann besuchen Sie einfach unsere Schnupperkurse „Kunst und Kultur für Einsteiger“! Nur 60 Minuten pro Kurs, danach können Sie entscheiden, ob Sie einen anderen Kurs ausprobieren möchten oder sich gleich für einen „richtigen“ Kurs anmelden wollen. Malerei, Musik, Literatur und Geschichte stehen auf dem Programm. Informieren Sie sich jetzt: Kunstschule Heckmann, Tel. 0800 444509434",
                      ar: "مدرسة «هيكمان» للفنون كتقدم دروس تجريبية قصيرة للناس اللي بغاو يجربوا هوايات جديدة بحال الرسم ولا الموسيقى. كل حصة مدتها غير 60 دقيقة، ومن بعد تقدر تقرر واش بغيتي تسجل في دورة كاملة ولا تجرب شي حاجة أخرى. هاد البرنامج فيه بزاف ديال المجالات بحال الرسم، الموسيقى، الأدب، والتاريخ." },

                    { key: "K", head: "Ihr kompetenter Partner für Rechtsberatung seit über 20 Jahren",
                      body: "Ihr kompetenter Rechtsberater in ganz Deutschland! Unsere Anwälte vertreten Ihre Interessen zügig und zuverlässig im Bereich „Arbeit“. Vom Arbeitsvertrag über Probleme am Arbeitsplatz bis hin zu Kündigungen oder auch Problemen bei der Zahlung des Arbeitslosengeldes unterstützen wir Sie sowohl vor Gericht als auch außerhalb. Unsere Erfahrung ist Ihr Vorteil. Natürlich ist eine Abrechnung über Ihre Rechtsschutzversicherung möglich; sprechen Sie uns einfach an und vereinbaren Sie einen Beratungstermin! Kanzlei Hummel und Schröder, Torstraße 21, 80121 München, Tel. 089 1234567",
                      ar: "هاد مكتب المحاماة «هومل وشرويدر» كاين ف ألمانيا وكيساعد الناس ف كاع اللي كيتعلق بمشاكل الخدمة. كيدافعو عليك ف أمور بحال عقد العمل، ولا إلى جراو عليك، وحتى ف لمشاكل ديال لفلوس ديال الشوماج. عندهم تجربة كبيرة وكيقدرو يمثلوك قدام المحكمة، وتقدر تخلصهم عن طريق التأمين القانوني ديالك." },

                    { key: "L", head: "Immer das richtige Möbel – ob Büro oder Wohnzimmer",
                      body: "Egal, ob Sie beruflich oft unterwegs sind oder viel Wert auf ein gemütliches Zuhause legen: Sie wissen, dass es bei Möbeln und weiterer Ausstattung auf die Details ankommt. Wir bieten für jeden Bedarf das Richtige an: Schreibtische mit integrierten Kabeln für Telefon- oder Internetverbindungen, Sofas mit praktischer Bettfunktion und farblich passenden Leuchten. Wir bieten auch gebrauchte Möbel günstig an, natürlich nur in bestem Zustand. Schauen Sie sich unsere Ausstellung an! Möbel Weber GmbH, Am Langen Hahn 24, 42188 Dortmund",
                      ar: "هاد الإعلان ديال شركة الأثاث «Möbel Weber» كايقدم تجهيزات ممتازة للدار وللخدمة ومهتمة بزاف بالتفاصيل. عندهم مكاتب فيهم كابلات ديال التلفون والأنترنيت، وسوفيات كايتحلو يرجعو ناموسية مع إضاءة مناسبة. كايبيعو حتى الأثاث المستعمل بثمن رخيص وفي حالة ممتازة." }
                ],

                situations: [
                    { no: 11, de: "Einem Bekannten wurde die Arbeitsstelle gekündigt. Er möchte bei einem Anwalt um Rat fragen.",
                             ar: "واحد صاحبك جراو عليه من الخدمة وباغي يشاور شي محامي." },
                    { no: 12, de: "Ihr Bekannter ist beruflich oft unterwegs und sucht eine Alternative zu Hotels. Es soll dort aber Internetzugang und Frühstück geben.",
                             ar: "واحد صاحبك كيسافر بزاف على قبل الخدمة وكيقلب على بديل للفنادق، ولكن خاص يكون فيه أنترنيت وفطور." },
                    { no: 13, de: "Sie reisen gerne und oft und möchten nun Informationen zu einer Reiseversicherung.",
                             ar: "كتسافر بزاف وباغي معلومات على تأمين السفر." },
                    { no: 14, de: "Sie möchten durch Europa reisen und privat übernachten.",
                             ar: "باغي تسافر ف أوروبا وتبات عند ناس ف ديورهم." },
                    { no: 15, de: "Eine Bekannte malt sehr gut und sucht eine Gelegenheit, anderen ihre Bilder zu zeigen oder sie zu verkaufen.",
                             ar: "وحدة صاحبتك كترسم مزيان وكتقلب على فرصة باش توري اللوحات ديالها ولا تبيعهم." },
                    { no: 16, de: "Sie möchten im Urlaub zwar nicht verreisen, aber trotzdem etwas unternehmen.",
                             ar: "فالعطلة ما باغيش تسافر، ولكن باغي دير شي حاجة." },
                    { no: 17, de: "Sie haben Streit mit Ihrem Vermieter wegen der Nebenkosten und möchten sich beraten lassen.",
                             ar: "عندك مشكل مع مول الدار على قبل مصاريف الشارج وباغي شي استشارة." },
                    { no: 18, de: "Sie möchten ausprobieren, ob Ihnen Zeichnen Spaß macht.",
                             ar: "باغي تجرب واش الرسم غايعجبك." },
                    { no: 19, de: "Ihre Möbel sehen nicht mehr so gut aus. Daran möchten Sie etwas ändern.",
                             ar: "المّابل ديالك ما بقاش شكلو مزيان وباغي تبدل شي حاجة." },
                    { no: 20, de: "Sie möchten mit Freunden durch Deutschland reisen und dabei günstig übernachten.",
                             ar: "باغي تسافر مع صحابك ف ألمانيا وتبات بثمن رخيص." }
                ],

                variants: [
                    { label: "الأساسي",
                      answers: ["K", "E", "X", "A", "C", "H", "F", "J", "B", "G"] },

                    /* نفس الإعلانات ونفس الحلول — سبعة ديال الوضعيات
                       (11 · 12 · 13 · 15 · 17 · 18 · 19) تعاودات صياغتها. */
                    { label: "المعدل",
                      answers: ["K", "E", "X", "A", "C", "H", "F", "J", "B", "G"],
                      situations: [
                          { no: 11, de: "Ein Bekannter hat seine Arbeitsstelle verloren. Er möchte sich von einem Anwalt beraten lassen.",
                                   ar: "واحد صاحبك تلف ليه الخدمة وباغي يتشاور مع شي محامي." },
                          { no: 12, de: "Ihr Bekannter ist beruflich oft unterwegs und sucht eine Alternative zu Hotels. Auf Frühstück und Internet möchte er aber nicht verzichten.",
                                   ar: "واحد صاحبك كيسافر بزاف على قبل الخدمة وكيقلب على بديل للفنادق، ولكن ما باغيش يتخلى على الفطور والأنترنيت." },
                          { no: 13, de: "Sie verreisen oft und möchten daher Informationen zu einer guten Reiseversicherung.",
                                   ar: "كتسافر بزاف وباغي معلومات على شي تأمين سفر مزيان." },
                          { no: 14, de: "Sie möchten durch Europa reisen und privat übernachten.",
                                   ar: "باغي تسافر ف أوروبا وتبات عند ناس ف ديورهم." },
                          { no: 15, de: "Eine Bekannte malt sehr gut und sucht eine Gelegenheit, ihre Bilder zu vermarkten.",
                                   ar: "وحدة صاحبتك كترسم مزيان وكتقلب على فرصة باش تسوّق اللوحات ديالها." },
                          { no: 16, de: "Sie möchten im Urlaub zwar nicht verreisen, aber trotzdem etwas unternehmen.",
                                   ar: "فالعطلة ما باغيش تسافر، ولكن باغي دير شي حاجة." },
                          { no: 17, de: "Sie haben Streit mit Ihrem Vermieter wegen der Nebenkosten und brauchen eine Auskunft.",
                                   ar: "عندك مشكل مع مول الدار على قبل مصاريف الشارج ومحتاج شي معلومة." },
                          { no: 18, de: "Sie möchten ausprobieren, ob Sie kreativ mit Stiften, Pinseln und Farben umgehen können.",
                                   ar: "باغي تجرب واش عندك موهبة فالرسم بالقلوما والبنسل والألوان." },
                          { no: 19, de: "Ihre Wohnungseinrichtung sieht nicht mehr so gut aus. Daran möchten Sie etwas ändern.",
                                   ar: "الأثاث ديال دارك ما بقاش شكلو مزيان وباغي تبدل شي حاجة." },
                          { no: 20, de: "Sie möchten mit Freunden durch Deutschland reisen und dabei günstig übernachten.",
                                   ar: "باغي تسافر مع صحابك ف ألمانيا وتبات بثمن رخيص." }
                      ] }
                ]
            }
        },


        /* ================================================================
           Aflam — Leseverstehen Teil 3 (إعلانات البرامج ديال التلفزة)
           12 إعلان A–L · 10 وضعيات 11–20 · X = ماكاين حتى واحد مناسب
           ================================================================ */
        "t3-aflam": {
            teil3: {
                title: "Aflam",
                kind: "ads",
                intro: "Lesen Sie die Situationen 11–20 und die Anzeigen A–L. "
                     + "Welche Anzeige passt zu welcher Situation? "
                     + "Jede Anzeige können Sie nur einmal verwenden. "
                     + "Gibt es zu einer Situation keine passende Anzeige, "
                     + "markieren Sie X.",

                ads: [
                    { key: "A", head: "23.15 3SAT — Es geschah im August",
                      body: "Ulrich Kasten und Hans-Hermann Hertle schildern in ihrer hervorragenden Dokumentation anhand von Archivmaterial minutiös sämtliche Stationen des Mauerbaus. Sie erzählen die Vorgeschichte der Berlin-Krise und beleuchten die Hintergründe der Teilung Deutschlands. Ferner haben sie Zeitzeugen nach ihren Reaktionen auf das einschneidende Ereignis befragt. Zu Wort kommen in dem Film nicht nur namhafte Vertreter der internationalen Politik, sondern auch Grenzsoldaten, Flüchtlinge und Angehörige von Maueropfern.",
                      ar: "هاد الفيلم الوثائقي كيهضر بدقة على كاع المراحل ديال بناء حيط برلين وكيفاش بدات الأزمة اللي قسمات ألمانيا. المخرجين استعملو فيديوهات وتصاور قديمة من الأرشيف باش يبينو الحقيقة ديال داكشي اللي طرا. وجابو بزاف ديال الناس عاودو على التجربة ديالهم، بحال سياسيين كبار، عسكر، وحتى عائلات الضحايا اللي تضررو من هاد الحيط. هاد العمل كيعاونا باش نفهمو مزيان هاد الحدث التاريخي والمشاكل اللي كانت موراه." },

                    { key: "B", head: "21.00 NDR — Joja Wendt",
                      body: "Ob Klassik, Rock’n’Roll oder Jazz: Joja Wendt, Hamburger Pianist mit enormen Entertainer-Qualitäten, variiert bekannte Songs und stellt seine Fingerfertigkeit auch in eigenen Kompositionen unter Beweis. Stargast in dem heutigen Fernseh-Special ist die Schlagersängerin Michelle mit dem Titel „Ich schicke dir jetzt einen Engel“.",
                      ar: "هاد الإعلان كيهضر على واحد العازف د البيانو ألماني مشهور سميتو جوجا ويندت، اللي كيعزف أنواع كثيرة د الموسيقى. هو فنان كيعرف ينشط الجمهور مزيان وكيعزف أغاني معروفة ومقطوعات ديالو بمهارة كبيرة. اليوم غادي يكون فواحد البرنامج تلفزيوني خاص وغادي يقدم فيه العزف ديالو. وغادي تحضر معاه المغنية ميشيل كضيفة شرف باش تغني وحدة من الأغاني ديالها المعروفة." },

                    { key: "C", head: "20.15 SAT.1 — Einfach unwiderstehlich",
                      body: "Gut kochen kann Amanda nicht. Folglich steht ihr kleines, von der Mutter geerbtes Restaurant in Manhattan kurz vor dem Aus. Da entflieht plötzlich ein Krebs aus ihrem Einkaufskorb und sorgt mit seinen Zauberkünsten für lukullische Sensationen. Tom, Manager eines Gourmet-Restaurants an der Fifth Avenue, kommt als einer der Ersten in deren Genuss. Amanda hat sich in ihn verliebt, als der schon bekannte Krebs unter Toms Hosenbein flüchtet. Seine Zauberkräfte werden dringend gebraucht, denn Tom gehört zu den Männern, die ziemlich viel Angst vor Liebesbeziehungen haben.",
                      ar: "أماندا عندها مطعم صغير فنيويورك ورثاتو على ماماها، ولكن ما كتعرفش تطيب مزيان وداكشي علاش المحل ديالها كان غايسد. واحد النهار، بان واحد السرطان سحري بدا كيوجد ماكلة لذيذة بزاف خلات كاع الناس يعجبهم الحال. طوم، اللي هو مدير ديال مطعم مشهور، داق الماكلة وعجباتو بزاف، وأماندا طاحت فحبّو. هاد السرطان غايستعمل السحر ديالو باش يقرّب بيناتهم، حيت طوم راجل كيخاف بزاف من العلاقات والارتباط." },

                    { key: "D", head: "22.00 HR — New York Express",
                      body: "Aus Sorge um die nationale Sicherheit versteckt der amerikanische Geheimdienst den genialen, aber vermeintlich psychisch kranken Physiker Arthur Vincenti. Der völlig verrückte New Yorker Psychiater Dr. Snow erhält den Auftrag, ihn zu heilen. Immer nachts wird er mit verbundenen Augen zu dem Versteck gebracht. Aber auch einige Gangster sind nicht untätig. Sie haben es auf das Wissen des Geheimnisträgers Vincenti abgesehen, das sie fremden Spionen verkaufen möchten.",
                      ar: "المخابرات الميريكانية مخبية واحد الفيزيائي واعر سميتو آرثر فينسينتي حيت خايفين على الأمن ديال البلاد. جابو واحد الطبيب نفساني مسطي سميتو الدكتور سنو باش يعالجو، وكيصيفطوه للبلاصة فين مخبي ديما بالليل وهو مغمضين ليه عينيه. وفنفس الوقت، كاينين شي مجرمين باغيين يديو هاد الفيزيائي باش يسرقو الأسرار لي فدماغو ويبيعوها لجواسيس برانيين." },

                    { key: "E", head: "20.15 PRO 7 — Kein Vater von gestern",
                      body: "Er schreit wie am Spieß, wenn er lange Hosen tragen soll, und lacht sich kaputt, wenn er die Katze in eine Mülltüte gesteckt hat. Alles ist einfacher, als sich um den fünfjährigen Calvin zu kümmern. Doch sein liebevoller Vater Russell, der den Jungen allein erzieht, meistert sämtliche Katastrophen mit Bravour und Geduld. Weil sich Kind und Karriere nicht unter einen Hut bringen ließen, verlor der Jurist einen tollen Job in einer renommierten Chicagoer Anwaltskanzlei. Jetzt sitzt er mit seinem Sohn in einem Dorf in Kansas und arbeitet in der Kanzlei eines Freundes. Die Bekanntschaft mit der attraktiven Beth bringt neuen Schwung in sein Leben. Doch da taucht Russells Ex-Ehefrau wieder auf.",
                      ar: "راسل واحد المحامي كيربي ولدو كالفن بوحدو، وهاد الدري الصغير اللي عندو خمس سنين صعيب بزاف فالتصرفات ديالو. بسباب ولدو، راسل ضحى بخدمتو المهمة فمدينة شيكاغو ومشا يسكن فقرية صغيرة باش يقدر يوازن بين الخدمة والتربية. حياتو بدات كتحسن مِلي تلاقى مع واحد السيدة سميتها بيث، ولكن فجأة بانت طليقتو ورجعات حياتو تخربقات من جديد." },

                    { key: "F", head: "22.45 SAT.1 — Nur nich’ nach Hause",
                      body: "„Hier in Berlin bei meinen Freunden habe ich mein Zuhause hinter mir gelassen. Hier geht’s mir gut. Ich bin endlich frei“, sagt Sascha. Der 16-Jährige ist einer der Jugendlichen, die hierzulande auf der Straße leben. Sie schlafen in Notunterkünften, Treppenhäusern und U-Bahn-Stationen und betteln tagsüber Passanten um Kleingeld an. Peter Schmidt hat Sascha mehrere Wochen lang begleitet und ihn nach seinen Wünschen und Hoffnungen gefragt. Zudem beleuchtet der Filmautor die individuelle Geschichte des Jugendlichen.",
                      ar: "هاد النص كيهضر على ساشا، دري فعمرو 16 عام وعايش ف الزنقة ف مدينة برلين. هو واحد من الشباب اللي كينعسو ف المحطات وكيطلبو الفلوس من الناس باش يدبّرو على راسهم. بيتر شميت، اللي هو صانع أفلام، تبع ساشا لواحد المدة باش يصور القصة ديالو ويسمع للأحلام ديالو. هاد العمل كيوضح كيفاش كيعيشو هاد المراهقين اللي هربو من ديورهم وشنو كيتمنّاو فالمستقبل." },

                    { key: "G", head: "21.15 ARD — Großer Kick auf schmalem Grat",
                      body: "Mit Sandalen und T-Shirt hängen sie in den Felswänden, ihr Handy halten sie für eine Lebensversicherung, die Alpen für einen Freizeitpark. Vierzig Menschen verunglücken jedes Jahr tödlich am Montblanc, bis zu eintausend Einsätze fliegt die Bergwacht Chamonix pro Saison. Filmer Oliver Baumgart begleitet die Retter zwei Wochen lang.",
                      ar: "بزاف د الناس كيمشيو لجبال «مون بلان» بلا ما يوجدو ليهم مزيان، وكيسحاب ليهم واش الجبل غير منتزه ديال اللعب. هاد التهاون كيتسبب فبزاف د الحوادث والموت كل عام، والمنقذين كيديرو مئات التدخلات باش يعتقوهم. المخرج أوليفر بومغارت بقا مع هاد الفرقة د الإنقاذ جوج سيمانات باش يصور الخدمة الصعيبة اللي كيديرو." },

                    { key: "H", head: "20.15 RTL — Zwei Engel mit vier Fäusten: Schwere Jungs",
                      body: "„Schwere Jungs“ bildet den Auftakt zu einer sechsteiligen Reihe mit Actionkomödien: Hau-drauf-Filme, wie sie schon unzählige Male mit dem Schläger-Duo Terence Hill und Bud Spencer über den Bildschirm flimmerten. Die beiden Gauner Joe und Bob fliehen aus dem Gefängnis und finden als Mönche getarnt Unterschlupf in einer Missionsstation.",
                      ar: "هاد الفيلم سميتو «شويري يونغس» وهو البداية ديال واحد السلسلة فيها ستة د الأفلام د الأكشن والضحك. هاد النوع د الأفلام كيشبه لدوك اللي فيهم بزاف د الصداع والمضاربة بحال اللي كيديرو تيرانس هيل وباد سبينسر. القصة كتهضر على جوج ديال الشفارة، جو وبوب، هربو من الحبس. باش يتخباو وما يحصلوش، تنكرو فلبسة ديال الرهبان ومشاو تخباو فواحد المركز ديال الدين." },

                    { key: "I", head: "17.30 ZDF — Olympia-Highlights",
                      body: "Nach den Weltcup-Siegen in Willingen und Sapporo stehen die Chancen für das österreichische Team gut, beim Skispringen ganz weit vorn zu landen. Überflieger Gregor Schlierenzauer und sein Mannschaftskollege Thomas Morgenstern sind jedenfalls in blendender Verfassung. Die deutschen Springer Martin Schmitt und Jörg Ritzerfeld werden sich anstrengen müssen. Übertragung von der 120-Meter-Skisprungschanze im Utah Olympic Park.",
                      ar: "هاد الإعلان كيهضر على واحد المسابقة ديال القفز على التلج اللي غادي تنقل مباشرة من «يوتا أولمبيك بارك». الفريق ديال النمسا عندو حظوظ كبيرة باش يربح حيت اللعابة ديالو واجدين وففورمة مزيانة بزاف. أما اللعابة ديال ألمانيا فخاصهم يتقاتلو ويديرو مجهود كبير باش يقدرو يوصلو ليهم. هاد المنافسة غادي تكون فواحد البلاصة ديال القفز الطول ديالها مية وعشرين ميترو." },

                    { key: "J", head: "14.15 DRS — Basler Fasnacht",
                      body: "Man darf gespannt sein, wie viel Spott die für ihre spitzen Zungen bekannten Basler Fasnächtler für das vergangene Jahr übrig haben. DRS überträgt die Straßenfasnacht, den Umzug der Pfeifen- und Trommlergruppen, die ihre Themen präsentieren, live. Die fachkundigen Kommentare zum Karneval am Oberrhein liefern Robert Pichler und der Basler Fasnachtsjournalist Roger Thiriet.",
                      ar: "هاد الإعلان كيهضر على الكرنفال ديال مدينة بازل اللي غادي تنقلو قناة دي آر إس مباشرة. غادي يكون استعراض كبير فيه المزمار والطبل، والناس كيتسناو يشوفو السخرية والانتقادات ديال المشاركين على داكشي اللي وقع ف العام اللي فات. الخبير روبيرت پيشلر والصحفي روجي تيري هما اللي غادي يعلقو ويشرحو هاد الاحتفالات للمشاهدين." },

                    { key: "K", head: "0.05 BR — Rockpalast",
                      body: "Dreizehn Alben hat die vielköpfige korsische Gruppe „I Muvrini“ um die Brüder Jean-François und Alain Bernardini bereits veröffentlicht. Hierzulande galten die „wilden Schafe“ noch bis vor Kurzem als Geheimtipp. Inzwischen sind die Musiker mit ihrer Mischung aus korsischer Folklore, afrikanischen und keltischen Elementen, aber auch aus Jazz, Pop und Cajun bei uns bekannt.",
                      ar: "هاد النص كيهضر على واحد المجموعة موسيقية من جزيرة كورسيكا سميتها «إي موفريني» اللي أسسوها جوج خوت. هاد الفرقة خرجات حتال دابا تلطاشر ألبوم، وفالبداية ما كانتش معروفة بزاف عند الناس. دابا ولاو مشهورين حيت كيديرو واحد النوع ديال الموسيقى كايخلط بين الفولكلور الكورسيكي، وألحان إفريقية، وكالتية، وحتى الجاز والبوب. هاد التنوع هو اللي خلاهم يوليو معروفين بزاف ف ألمانيا." },

                    { key: "L", head: "20.15 PHOENIX — Mephisto",
                      body: "Man sollte meinen, Schauspieler Hendrik Höfgen wäre gegen unmoralische Angebote gefeit. Schließlich feierte er zur Zeit der Weimarer Republik große Erfolge in der Rolle des Mephisto. Der Mann müsste also wissen, wie schnell es gehen kann, dass man seine Seele verkauft. Als die Nazis die Macht ergreifen, stellt Höfgen seine Kunst ganz in den Dienst der neuen Herrscher. Und bald wird er zum Intendanten des Staatstheaters ernannt. Das Drama um Kunst und Politik entstand nach dem gleichnamigen Roman von Klaus Mann.",
                      ar: "هاد النص كيهضر على واحد الممثل سميتو هندريك هوفغن اللي كان مشهور بزاف فالدور ديال ميفيستو. ملي جاو النازيين للحكم، قرر يتعاون معاهم ويستغل الفن ديالو باش يرضيهم ويطلع فالمناصب. بسباب هاد الشي، رجع هو المدير ديال المسرح الوطني ولكن راه بحال إلا باع الروح ديالو على قبل الشهرة. هاد القصة مأخوذة من رواية ديال كلاوس مان وكتورينا الصراع اللي كيكون بين الفن والسياسة." }
                ],

                situations: [
                    { no: 11, de: "Ein Bekannter möchte einen Film sehen, der nach dem Werk eines Schriftstellers gedreht wurde.",
                             ar: "واحد صاحبك باغي يشوف فيلم مقتبس من عمل ديال كاتب." },
                    { no: 12, de: "Bekannte interessieren sich für Wintersportveranstaltungen.",
                             ar: "شي معارف مهتمين بتظاهرات الرياضات الشتوية." },
                    { no: 13, de: "Sie suchen eine Musiksendung. Sie mögen besonders Klaviermusik.",
                             ar: "كتقلب على برنامج موسيقي، وكتبغي بالخصوص موسيقى البيانو." },
                    { no: 14, de: "Sie mögen Filme mit viel Action und viel Spaß. Ihre Lieblingshelden können auch mal zuschlagen.",
                             ar: "كتبغي أفلام فيها بزاف د الأكشن والضحك، وأبطالك المفضلين ما كيخافوش من المضاربة." },
                    { no: 15, de: "Ein Bekannter interessiert sich für korsische Geschichte.",
                             ar: "واحد صاحبك مهتم بتاريخ جزيرة كورسيكا." },
                    { no: 16, de: "Sie mögen Familienkomödien, besonders mit frechen Kindern.",
                             ar: "كتبغي الكوميديا العائلية، خصوصاً اللي فيها دراري مشاغبين." },
                    { no: 17, de: "Eine Bekannte interessiert sich für die Geschichte des bis 1989 geteilten Berlins.",
                             ar: "وحدة صاحبتك مهتمة بتاريخ برلين المقسمة حتى 1989." },
                    { no: 18, de: "Sie sehen gern spannende, aber auch spaßige Agentenfilme.",
                             ar: "كيعجبك تشوف أفلام الجواسيس المثيرة واللي فيها ضحك تاني." },
                    { no: 19, de: "Sie würden gern etwas über Großstadtjugendliche erfahren, die am Rand der Gesellschaft leben.",
                             ar: "بغيتي تعرف شي حاجة على شباب المدن الكبار اللي عايشين على هامش المجتمع." },
                    { no: 20, de: "Sie möchten im nächsten Urlaub bergsteigen und sich über die Risiken informieren.",
                             ar: "باغي تطلع للجبال فالعطلة الجاية وباغي تعرف المخاطر." }
                ],

                variants: [
                    { label: "الأساسي",
                      answers: ["L", "I", "B", "H", "X", "E", "A", "D", "F", "G"] },

                    /* نفس الإعلانات ونفس الحلول — تلاتة ديال الوضعيات
                       (12 · 13 · 17) تعاودات صياغتها. */
                    { label: "المعدل",
                      answers: ["L", "I", "B", "H", "X", "E", "A", "D", "F", "G"],
                      situations: [
                          { no: 11, de: "Ein Bekannter möchte einen Film sehen, der nach dem Werk eines Schriftstellers gedreht wurde.",
                                   ar: "واحد صاحبك باغي يشوف فيلم مقتبس من عمل ديال كاتب." },
                          { no: 12, de: "Ihre Bekannten verfolgen gern sportliche Wettkämpfe.",
                                   ar: "صحابك كيعجبهم يتبعو المنافسات الرياضية." },
                          { no: 13, de: "Sie suchen eine abwechslungsreiche Musiksendung mit Klaviermusik.",
                                   ar: "كتقلب على برنامج موسيقي متنوع فيه موسيقى البيانو." },
                          { no: 14, de: "Sie mögen Filme mit viel Action und viel Spaß. Ihre Lieblingshelden können auch mal zuschlagen.",
                                   ar: "كتبغي أفلام فيها بزاف د الأكشن والضحك، وأبطالك المفضلين ما كيخافوش من المضاربة." },
                          { no: 15, de: "Ein Bekannter interessiert sich für korsische Geschichte.",
                                   ar: "واحد صاحبك مهتم بتاريخ جزيرة كورسيكا." },
                          { no: 16, de: "Sie mögen Familienkomödien, besonders mit frechen Kindern.",
                                   ar: "كتبغي الكوميديا العائلية، خصوصاً اللي فيها دراري مشاغبين." },
                          { no: 17, de: "Eine Bekannte interessiert sich für informative Beiträge zur neueren Geschichte.",
                                   ar: "وحدة صاحبتك مهتمة بالبرامج اللي كتعطي معلومات على التاريخ الحديث." },
                          { no: 18, de: "Sie sehen gern spannende, aber auch spaßige Agentenfilme.",
                                   ar: "كيعجبك تشوف أفلام الجواسيس المثيرة واللي فيها ضحك تاني." },
                          { no: 19, de: "Sie würden gern etwas über Großstadtjugendliche erfahren, die am Rand der Gesellschaft leben.",
                                   ar: "بغيتي تعرف شي حاجة على شباب المدن الكبار اللي عايشين على هامش المجتمع." },
                          { no: 20, de: "Sie möchten im nächsten Urlaub bergsteigen und sich über die Risiken informieren.",
                                   ar: "باغي تطلع للجبال فالعطلة الجاية وباغي تعرف المخاطر." }
                      ] }
                ]
            }
        },


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
