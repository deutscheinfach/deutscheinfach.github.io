/* ===== Sprechen B2 · Teil 1 — Über Erfahrungen sprechen =====

   فالامتحان: كتختار موضوع (سفر، كتاب، فيلم…) وكتهضر عليه
   بوحدك بين 90 و180 ثانية. من بعد الـPrüfer كيسولك جوج أسئلة
   على داكشي اللي حكيتي.

   هاد الملف فيه المواضيع ديال Teil 1 بوحدهم. كيتزادو
   لـ SPRECHEN_B2_TOPICS و SPRECHEN_B2_CONTENT باش الشبكة
   ديال b2-sprechen.html تبينهم تحت "Teil 1".

   شكل الموضوع:
   {
     kind: "erfahrung",
     aufgabe:   "…",  aufgabeAr: "…",
     leitfragen: [{ de, ar }],     // على شنو خاصك تهضر
     wortschatz: [{ de, ar }],     // كلمات كتنفع فهاد الموضوع
     muster:     { de, ar },       // نموذج ديال الكلام (~150 كلمة)
     fragen:     [{ de, ar }]      // أسئلة الـPrüfer — كيتختارو جوج بالصدفة
   }

   ملاحظة: هادو تمارين تحضيرية على شكل الامتحان، ماشي أوراق رسمية.
*/

(function () {
    "use strict";

    const TOPICS = [
        { id: "e-reise",      title: "Reise",                     ar: "رحلة أو عطلة",   parts: ["teil1"], locked: false },
        { id: "e-buch",       title: "Buch",                      ar: "كتاب أو رواية",  parts: ["teil1"], locked: false },
        { id: "e-film",       title: "Film",                      ar: "فيلم سينمائي",   parts: ["teil1"], locked: false },
        { id: "e-sport",      title: "Sportereignis",             ar: "حدث رياضي",      parts: ["teil1"], locked: false },
        { id: "e-musik",      title: "Musikveranstaltung",        ar: "حفل موسيقي",     parts: ["teil1"], locked: true },
        { id: "e-person",     title: "Wichtige Person im Leben",  ar: "شخصية مهمة",     parts: ["teil1"], locked: true },
        { id: "e-erfahrung",  title: "Wichtige Erfahrung",        ar: "تجربة مهمة",     parts: ["teil1"], locked: true },
        { id: "e-fest",       title: "Fest oder Feier",           ar: "عرس أو حفلة",    parts: ["teil1"], locked: true }
    ];

    const CONTENT = {

        "e-reise": {
            kind: "erfahrung",
            title: "Über eine Reise sprechen",
            aufgabe: "Berichten Sie von einer Reise, die Sie gemacht haben und an die Sie sich gern erinnern.",
            aufgabeAr: "حكي على شي سفر درتيه وكتبغي تتفكرو.",
            leitfragen: [
                { de: "Wohin sind Sie gereist und wann war das?", ar: "فين سافرتي وإمتى؟" },
                { de: "Mit wem sind Sie gereist?", ar: "مع من مشيتي؟" },
                { de: "Wie sind Sie dorthin gekommen und wo haben Sie übernachtet?", ar: "كيفاش وصلتي وفين بتّي؟" },
                { de: "Was haben Sie erlebt? Gab es ein besonderes Erlebnis?", ar: "شنو درتي؟ واش وقعات شي حاجة خاصة؟" },
                { de: "Was hat Ihnen gefallen – und was nicht?", ar: "شنو عجبك وشنو ما عجبكش؟" },
                { de: "Würden Sie die Reise weiterempfehlen? Warum?", ar: "واش تنصح بيها؟ علاش؟" }
            ],
            wortschatz: [
                { de: "die Unterkunft", ar: "بلاصة المبيت" },
                { de: "die Sehenswürdigkeit", ar: "معلمة سياحية" },
                { de: "einen Ausflug machen", ar: "دار نزهة / خرجة" },
                { de: "die Landschaft", ar: "المنظر الطبيعي" },
                { de: "sich verlaufen", ar: "تلف فالطريق" },
                { de: "die Einheimischen", ar: "ناس البلاد" },
                { de: "atemberaubend", ar: "كيقطع النفس (زوين بزاف)" },
                { de: "unvergesslich", ar: "ما كيتنساش" }
            ],
            muster: {
                de: "Ich möchte Ihnen heute von meiner Reise nach Chefchaouen erzählen, einer kleinen Stadt im Norden Marokkos. Letzten Sommer bin ich mit zwei Freunden für vier Tage dorthin gefahren. Wir haben den Bus von Tanger genommen und in einem kleinen Gästehaus in der Altstadt übernachtet. Besonders beeindruckt haben mich die blauen Gassen – man fühlt sich wie in einem Märchen. Am zweiten Tag haben wir eine Wanderung zum Wasserfall von Akchour gemacht. Das war zwar anstrengend, aber die Landschaft war einfach atemberaubend. Ein Erlebnis werde ich nie vergessen: Wir haben uns abends in der Altstadt verlaufen, und eine ältere Frau hat uns nicht nur den Weg gezeigt, sondern uns auch zu einem Tee eingeladen. Weniger schön fand ich, dass es sehr viele Touristen gab. Trotzdem würde ich die Reise jedem empfehlen, der Natur und Ruhe mag. Für mich war es eine der schönsten Reisen, weil ich viel über die Menschen und die Kultur gelernt habe.",
                ar: "بغيت نحكي ليكم اليوم على السفر ديالي لشفشاون، مدينة صغيرة فشمال المغرب. الصيف اللي فات مشيت ليها مع جوج صحابي ربعة د الأيام. خدينا الكار من طنجة وبتنا فدار ضيافة صغيرة فالمدينة القديمة. أكثر حاجة عجباتني هي الزناقي الزرقين — كتحس براسك وسط شي حكاية. فالنهار التاني درنا مشية على رجلينا للشلال ديال أقشور. كانت عيانة شوية، ولكن المنظر كان زوين بزاف. واحد الحاجة عمري ننساها: فالليل تلفنا فالمدينة القديمة، وواحد السيدة كبيرة ماشي غير ورّاتنا الطريق، ولكن حتى عيطات علينا نشربو أتاي. اللي ما عجبنيش بزاف هو أنه كانو بزاف ديال السياح. ومع ذلك، ننصح بهاد السفر لأي واحد كيبغي الطبيعة والهدوء. بالنسبة ليا كانت من أحسن السفريات، حيت تعلمت بزاف على الناس والثقافة."
            },
            fragen: [
                { de: "Würden Sie noch einmal dorthin fahren? Warum (nicht)?", ar: "واش ترجع ليها مرة خرى؟ علاش؟" },
                { de: "Reisen Sie lieber allein oder mit anderen Menschen?", ar: "كتفضل تسافر بوحدك ولا مع الناس؟" },
                { de: "Wie haben Sie die Reise geplant und organisiert?", ar: "كيفاش وجدتي ونظمتي السفر؟" },
                { de: "Was war das größte Problem auf dieser Reise?", ar: "شنو أكبر مشكل تلاقيتي فهاد السفر؟" },
                { de: "Welches Reiseziel möchten Sie unbedingt noch kennenlernen?", ar: "شمن بلاصة باغي تزورها ضروري؟" },
                { de: "Was ist Ihnen im Urlaub wichtiger: Erholung oder Abenteuer?", ar: "شنو مهم عندك فالعطلة: الراحة ولا المغامرة؟" }
            ]
        },

        "e-buch": {
            kind: "erfahrung",
            title: "Über ein Buch sprechen",
            aufgabe: "Berichten Sie von einem Buch, das Sie gelesen haben und das Sie beeindruckt hat.",
            aufgabeAr: "حكي على شي كتاب قريتيه وأثّر فيك.",
            leitfragen: [
                { de: "Wie heißt das Buch und wer hat es geschrieben?", ar: "شنو سميتو وشكون كتبو؟" },
                { de: "Wann und warum haben Sie es gelesen?", ar: "إمتى وعلاش قريتيه؟" },
                { de: "Worum geht es in dem Buch? (kurz!)", ar: "على شنو كيهضر؟ (باختصار)" },
                { de: "Welche Figur oder welche Szene hat Ihnen besonders gefallen?", ar: "شمن شخصية ولا مشهد عجبك أكثر؟" },
                { de: "Was haben Sie aus dem Buch gelernt?", ar: "شنو تعلمتي منو؟" },
                { de: "Für wen ist das Buch geeignet?", ar: "لمن كيصلح هاد الكتاب؟" }
            ],
            wortschatz: [
                { de: "der Roman", ar: "الرواية" },
                { de: "der Autor / die Autorin", ar: "الكاتب / الكاتبة" },
                { de: "die Hauptfigur", ar: "الشخصية الرئيسية" },
                { de: "die Handlung", ar: "الأحداث" },
                { de: "spannend", ar: "مشوّق" },
                { de: "Es geht um …", ar: "كيهضر على …" },
                { de: "zum Nachdenken anregen", ar: "كيخليك تفكر" },
                { de: "Ich konnte es nicht aus der Hand legen.", ar: "ما قدرتش نحبس القراية" }
            ],
            muster: {
                de: "Ich möchte Ihnen von dem Roman „Der Alchimist“ von Paulo Coelho erzählen. Ich habe das Buch vor zwei Jahren gelesen, weil eine Freundin es mir zum Geburtstag geschenkt hat. Am Anfang war ich skeptisch, denn ich lese normalerweise keine Romane. Aber schon nach den ersten Seiten konnte ich es nicht mehr aus der Hand legen. Es geht um einen jungen Hirten aus Spanien, der von einem Schatz träumt und deshalb eine lange Reise bis nach Ägypten macht. Unterwegs trifft er viele Menschen, die ihm etwas über das Leben beibringen. Besonders gefallen hat mir die Szene in der Wüste, weil sie sehr ruhig und poetisch beschrieben ist. Aus dem Buch habe ich gelernt, dass man seine Träume nicht aufgeben sollte, auch wenn der Weg schwierig ist. Das Buch ist einfach geschrieben, deshalb ist es auch für Deutschlernende geeignet – es gibt es nämlich auch auf Deutsch. Ich empfehle es allen, die gerade eine wichtige Entscheidung treffen müssen.",
                ar: "بغيت نحكي ليكم على الرواية ديال «الخيميائي» ديال باولو كويلو. قريتها هادي عامين، حيت واحد صاحبتي هدّاتها ليا فعيد الميلاد. فالأول ما كنتش مقتانع، حيت عادة ما كنقراش الروايات. ولكن من الصفحات اللولين ما بقيتش قادر نحبس. كتحكي على راعي صغير من إسبانيا كيحلم بواحد الكنز، وعلى هادشي كيدير سفر طويل حتى لمصر. فالطريق كيتلاقى بزاف ديال الناس اللي كيعلموه شي حاجة على الحياة. أكثر حاجة عجباتني هي المشهد ديال الصحرا، حيت موصوف بطريقة هادئة وشاعرية. تعلمت من هاد الكتاب أنه ما خاصناش نتخلاو على الأحلام ديالنا، واخا الطريق صعيبة. الكتاب مكتوب بطريقة ساهلة، داكشي علاش كيصلح حتى للي كيتعلمو الألمانية — حيت كاين حتى بالألمانية. كننصح بيه لكل واحد خاصو ياخد شي قرار مهم."
            },
            fragen: [
                { de: "Lesen Sie lieber gedruckte Bücher oder E-Books?", ar: "كتفضل الكتب المطبوعة ولا الإلكترونية؟" },
                { de: "Haben Sie auch den Film zum Buch gesehen?", ar: "واش شفتي الفيلم ديال هاد الكتاب؟" },
                { de: "Wie viel Zeit haben Sie normalerweise zum Lesen?", ar: "شحال ديال الوقت عندك عادة للقراية؟" },
                { de: "Welches Buch möchten Sie als Nächstes lesen?", ar: "شنو الكتاب اللي باغي تقرا من بعد؟" },
                { de: "Lesen junge Leute heute weniger als früher? Was meinen Sie?", ar: "واش الشباب اليوم كيقراو قل من قبل؟ شنو رأيك؟" },
                { de: "Haben Sie schon einmal ein Buch auf Deutsch gelesen?", ar: "واش عمرك قريتي كتاب بالألمانية؟" }
            ]
        },

        "e-film": {
            kind: "erfahrung",
            title: "Über einen Film sprechen",
            aufgabe: "Berichten Sie von einem Film, den Sie gesehen haben und der Ihnen in Erinnerung geblieben ist.",
            aufgabeAr: "حكي على شي فيلم شفتيه وبقى فبالك.",
            leitfragen: [
                { de: "Wie heißt der Film und was für ein Film ist es?", ar: "شنو سميتو وشمن نوع ديال الأفلام؟" },
                { de: "Wo und mit wem haben Sie ihn gesehen?", ar: "فين ومع من شفتيه؟" },
                { de: "Worum geht es in dem Film? (kurz!)", ar: "على شنو كيهضر؟ (باختصار)" },
                { de: "Welche Szene oder welcher Schauspieler hat Sie beeindruckt?", ar: "شمن مشهد ولا ممثل عجبك؟" },
                { de: "Was fanden Sie weniger gut?", ar: "شنو ما عجبكش بزاف؟" },
                { de: "Würden Sie den Film empfehlen? Wem?", ar: "واش تنصح بيه؟ لمن؟" }
            ],
            wortschatz: [
                { de: "die Komödie / das Drama", ar: "كوميديا / دراما" },
                { de: "der Schauspieler / die Schauspielerin", ar: "الممثل / الممثلة" },
                { de: "die Hauptrolle spielen", ar: "لعب الدور الرئيسي" },
                { de: "auf einer wahren Geschichte beruhen", ar: "مبني على قصة حقيقية" },
                { de: "berührend", ar: "مؤثر" },
                { de: "die Szene", ar: "المشهد" },
                { de: "das Ende", ar: "النهاية" },
                { de: "Ich musste lachen / weinen.", ar: "ضحكت / بكيت" }
            ],
            muster: {
                de: "Ich möchte über den französischen Film „Ziemlich beste Freunde“ sprechen. Ich habe ihn zum ersten Mal vor drei Jahren zu Hause mit meiner Familie gesehen, und zwar mit deutschen Untertiteln. Der Film beruht auf einer wahren Geschichte. Es geht um einen reichen Mann, der nach einem Unfall im Rollstuhl sitzt, und um einen jungen Mann aus einem armen Viertel, der sein Pfleger wird. Obwohl die beiden sehr verschieden sind, werden sie richtig gute Freunde. Besonders beeindruckt hat mich die Szene, in der sie zusammen Paragliding machen – da musste ich gleichzeitig lachen und fast weinen. Die Schauspieler spielen sehr natürlich, deshalb glaubt man ihnen jedes Wort. Weniger gut fand ich, dass einige Probleme am Ende sehr schnell gelöst werden. Trotzdem ist es für mich einer der besten Filme, die ich kenne, weil er zeigt, dass Freundschaft keine Grenzen hat. Ich würde ihn allen empfehlen, besonders wenn man einen schlechten Tag hatte.",
                ar: "بغيت نهضر على الفيلم الفرنسي «أصدقاء تقريباً مزيانين» (Intouchables). شفتو أول مرة هادي تلت سنين فالدار مع العائلة، وكان بالترجمة الألمانية. الفيلم مبني على قصة حقيقية. كيحكي على راجل غني ولّا فالكرسي المتحرك من بعد حادثة، وعلى شاب من حومة فقيرة ولّا هو اللي كيتلاها بيه. واخا بجوج مختلفين بزاف، كيوليو صحاب بصح. أكثر مشهد أثّر فيا هو ملي طارو بجوج بالباراشوت — ضحكت وقربت نبكي فنفس الوقت. الممثلين كيلعبو بطريقة طبيعية، داكشي علاش كتصدقهم فكل كلمة. اللي ما عجبنيش بزاف هو أنه شي مشاكل تحلّو بزربة فاللخر. ومع ذلك، بالنسبة ليا هو من أحسن الأفلام اللي كنعرف، حيت كيبين أن الصداقة ما عندهاش حدود. ننصح بيه للجميع، خصوصاً إلا كان عندك نهار خايب."
            },
            fragen: [
                { de: "Gehen Sie lieber ins Kino oder schauen Sie Filme zu Hause?", ar: "كتفضل السينما ولا تشوف الأفلام فالدار؟" },
                { de: "Schauen Sie Filme lieber im Original oder synchronisiert?", ar: "كتفضل الأفلام بلغتها الأصلية ولا مدبلجة؟" },
                { de: "Welche Filme mögen Sie gar nicht? Warum?", ar: "شمن أفلام ما كتبغيهاش بتاتاً؟ علاش؟" },
                { de: "Helfen Filme beim Deutschlernen? Wie?", ar: "واش الأفلام كتعاون فتعلم الألمانية؟ كيفاش؟" },
                { de: "Haben Sie den Film mehr als einmal gesehen?", ar: "واش شفتيه كثر من مرة؟" },
                { de: "Welchen Film sollte man Ihrer Meinung nach unbedingt sehen?", ar: "شنو الفيلم اللي خاص الواحد يشوفو ضروري فرأيك؟" }
            ]
        },

        "e-sport": {
            kind: "erfahrung",
            title: "Über ein Sportereignis sprechen",
            aufgabe: "Berichten Sie von einem Sportereignis, das Sie besucht oder gesehen haben.",
            aufgabeAr: "حكي على شي حدث رياضي حضرتيه ولا تفرجتي فيه.",
            leitfragen: [
                { de: "Um welches Ereignis ging es und wann war das?", ar: "شمن حدث وإمتى كان؟" },
                { de: "Wo haben Sie es erlebt – im Stadion, im Café, zu Hause?", ar: "فين عشتيه — فالملعب، فالقهوة، فالدار؟" },
                { de: "Mit wem waren Sie dort?", ar: "مع من كنتي؟" },
                { de: "Wie war die Stimmung?", ar: "كيفاش كان الجو؟" },
                { de: "Was war der spannendste Moment?", ar: "شنو أكثر لحظة كانت مشوقة؟" },
                { de: "Warum ist Ihnen dieses Ereignis in Erinnerung geblieben?", ar: "علاش بقى فبالك؟" }
            ],
            wortschatz: [
                { de: "das Spiel / das Turnier", ar: "الماتش / الدوري" },
                { de: "die Mannschaft", ar: "الفريق" },
                { de: "ein Tor schießen", ar: "سجّل هدف" },
                { de: "gewinnen / verlieren", ar: "ربح / خسر" },
                { de: "das Halbfinale", ar: "نصف النهاية" },
                { de: "die Fans jubeln", ar: "الجمهور كيفرح ويغوّت" },
                { de: "Gänsehaut bekommen", ar: "تشوّك / تقفقف من الفرحة" },
                { de: "die Stimmung war unglaublich", ar: "الجو كان خيالي" }
            ],
            muster: {
                de: "Ich möchte Ihnen von einem Fußballspiel erzählen, das ich nie vergessen werde: dem Viertelfinale der Weltmeisterschaft 2022 zwischen Marokko und Portugal. Ich habe das Spiel nicht im Stadion gesehen, sondern in einem Café in meinem Viertel, zusammen mit meinen Brüdern und vielen Nachbarn. Schon zwei Stunden vor dem Anpfiff war das Café völlig voll. Die Stimmung war unglaublich: Alle haben gesungen, und viele hatten Fahnen dabei. Der spannendste Moment war natürlich das Tor von Youssef En-Nesyri kurz vor der Pause. Danach war die zweite Halbzeit sehr nervös, weil Portugal immer wieder angegriffen hat. Als der Schiedsrichter endlich abgepfiffen hat, sind alle auf die Straße gelaufen und haben bis spät in die Nacht gefeiert. Ich hatte die ganze Zeit Gänsehaut. Dieses Ereignis ist mir in Erinnerung geblieben, weil ich noch nie so viele Menschen gleichzeitig so glücklich gesehen habe. Es hat mir gezeigt, wie sehr Sport Menschen verbinden kann.",
                ar: "بغيت نحكي ليكم على واحد الماتش عمري ننساه: ربع النهاية ديال كأس العالم 2022 بين المغرب والبرتغال. ما شفتوش فالملعب، شفتو فواحد القهوة فالحومة ديالي، مع خوتي وبزاف ديال الجيران. جوج سوايع قبل الماتش القهوة كانت عامرة. الجو كان خيالي: كلشي كيغني، وبزاف كانو هازين الرايات. أكثر لحظة مشوقة طبعاً هي الهدف ديال يوسف النصيري قبل الاستراحة بشوية. من بعد، الشوط التاني كان فيه بزاف ديال التوتر، حيت البرتغال بقات كتهجم. ملي الحكم صفّر أخيراً، كلشي خرج للزنقة وبقاو كيحتافلو حتى لوقت متأخر فالليل. بقيت مقفقف طول الوقت. هاد الحدث بقى فبالي حيت عمري شفت هاد العدد ديال الناس فرحانين فنفس الوقت. بيّن ليا شحال الرياضة تقدر تجمع الناس."
            },
            fragen: [
                { de: "Schauen Sie Sport lieber im Stadion oder im Fernsehen?", ar: "كتفضل تتفرج فالملعب ولا فالتلفزة؟" },
                { de: "Treiben Sie selbst auch Sport? Welchen?", ar: "واش كتمارس حتى نتا شي رياضة؟ شمن وحدة؟" },
                { de: "Sind die Eintrittskarten für große Spiele zu teuer?", ar: "واش البطاقات ديال الماتشات الكبار غاليين بزاف؟" },
                { de: "Warum ist Fußball in Ihrem Land so beliebt?", ar: "علاش الكرة محبوبة بزاف فبلادك؟" },
                { de: "Welches Sportereignis möchten Sie einmal live erleben?", ar: "شمن حدث رياضي باغي تحضرو مباشرة؟" },
                { de: "Kann Sport auch negative Seiten haben? Welche?", ar: "واش الرياضة عندها حتى جوانب سلبية؟ شنو هي؟" }
            ]
        },

        "e-musik": {
            kind: "erfahrung",
            title: "Über eine Musikveranstaltung sprechen",
            aufgabe: "Berichten Sie von einem Konzert oder Musikfestival, das Sie besucht haben.",
            aufgabeAr: "حكي على شي حفلة ولا مهرجان موسيقي حضرتيه.",
            leitfragen: [
                { de: "Welche Veranstaltung war es, wann und wo?", ar: "شمن حفلة، إمتى وفين؟" },
                { de: "Wie sind Sie an die Karten gekommen? Was haben sie gekostet?", ar: "كيفاش جبتي البطائق؟ بشحال؟" },
                { de: "Mit wem waren Sie dort?", ar: "مع من مشيتي؟" },
                { de: "Wie war die Atmosphäre und das Publikum?", ar: "كيفاش كان الجو والجمهور؟" },
                { de: "Welcher Moment war der Höhepunkt?", ar: "شنو أحسن لحظة؟" },
                { de: "Gab es auch etwas Negatives?", ar: "واش كانت شي حاجة سلبية؟" }
            ],
            wortschatz: [
                { de: "das Konzert / das Festival", ar: "الحفلة / المهرجان" },
                { de: "die Bühne", ar: "المنصة" },
                { de: "auftreten", ar: "طلع يغني / قدّم عرض" },
                { de: "das Publikum", ar: "الجمهور" },
                { de: "die Eintrittskarte", ar: "بطاقة الدخول" },
                { de: "mitsingen", ar: "غنّى معاه" },
                { de: "die Lautstärke", ar: "قوة الصوت" },
                { de: "der Höhepunkt", ar: "أحسن لحظة / الذروة" }
            ],
            muster: {
                de: "Ich möchte Ihnen vom Gnaoua-Festival in Essaouira erzählen, das ich vor zwei Jahren im Juni besucht habe. Das Besondere an diesem Festival ist, dass die meisten Konzerte kostenlos sind und direkt am Meer oder auf großen Plätzen in der Altstadt stattfinden. Ich bin mit meiner Cousine und zwei Freundinnen hingefahren, und wir haben bei einer Familie übernachtet, die Zimmer vermietet. Die Atmosphäre war einmalig: Menschen aus der ganzen Welt haben zusammen getanzt, obwohl sie sich gar nicht kannten. Der Höhepunkt war für mich ein Konzert, bei dem ein Gnaoua-Meister gemeinsam mit einem Jazzmusiker aus Frankreich aufgetreten ist. Diese Mischung hatte ich vorher noch nie gehört. Negativ war nur, dass es abends extrem voll war und wir manchmal kaum etwas sehen konnten. Außerdem waren die Hotels in dieser Woche sehr teuer. Trotzdem möchte ich unbedingt wieder hinfahren, weil Musik dort wirklich Menschen und Kulturen zusammenbringt.",
                ar: "بغيت نحكي ليكم على مهرجان كناوة فالصويرة، اللي حضرتو هادي عامين فشهر يونيو. الحاجة الخاصة فهاد المهرجان هي أن أغلب الحفلات فابور وكيكونو قدام البحر ولا فالساحات الكبار فالمدينة القديمة. مشيت مع بنت عمي وجوج صاحباتي، وبتنا عند واحد العائلة كتكري البيوت. الجو كان ما كيتعاودش: ناس من العالم كامل كيشطحو مع بعضياتهم، واخا ما كيعرفوش بعضياتهم. أحسن لحظة بالنسبة ليا كانت حفلة طلع فيها معلم كناوي مع موسيقي ديال الجاز من فرنسا. هاد الخليط عمري سمعتو قبل. الحاجة السلبية الوحيدة هي أنه فالليل كان عامر بزاف وشي مرات ما كنا كنشوفو والو. زيادة على هادشي، الأوتيلات كانو غاليين بزاف فداك السيمانة. ومع ذلك باغي نرجع ضروري، حيت الموسيقى تما كتجمع بصح الناس والثقافات."
            },
            fragen: [
                { de: "Welche Musik hören Sie am liebsten?", ar: "شمن موسيقى كتبغي أكثر؟" },
                { de: "Gehen Sie lieber auf große Festivals oder auf kleine Konzerte?", ar: "كتفضل المهرجانات الكبار ولا الحفلات الصغار؟" },
                { de: "Spielen Sie selbst ein Instrument?", ar: "واش كتعزف على شي آلة؟" },
                { de: "Hören Sie auch deutsche Musik? Welche?", ar: "واش كتسمع حتى الموسيقى الألمانية؟ شمن وحدة؟" },
                { de: "Sollten Konzerte für junge Leute billiger sein?", ar: "واش الحفلات خاصها تكون أرخص للشباب؟" },
                { de: "Welchen Künstler möchten Sie einmal live sehen?", ar: "شمن فنان باغي تشوفو مباشرة؟" }
            ]
        },

        "e-person": {
            kind: "erfahrung",
            title: "Über eine wichtige Person sprechen",
            aufgabe: "Berichten Sie von einer Person, die in Ihrem Leben wichtig war oder ist.",
            aufgabeAr: "حكي على شي شخص كان ولا باقي مهم فحياتك.",
            leitfragen: [
                { de: "Wer ist diese Person und woher kennen Sie sie?", ar: "شكون هاد الشخص ومنين كتعرفو؟" },
                { de: "Wie würden Sie die Person beschreiben?", ar: "كيفاش توصفو؟" },
                { de: "Was haben Sie gemeinsam erlebt?", ar: "شنو عشتو مع بعضياتكم؟" },
                { de: "Warum ist diese Person so wichtig für Sie?", ar: "علاش مهم عندك؟" },
                { de: "Was haben Sie von ihr gelernt?", ar: "شنو تعلمتي منو؟" },
                { de: "Wie ist Ihr Kontakt heute?", ar: "كيفاش العلاقة ديالكم دابا؟" }
            ],
            wortschatz: [
                { de: "das Vorbild", ar: "القدوة" },
                { de: "geduldig", ar: "صبّار" },
                { de: "hilfsbereit", ar: "كيعاون الناس" },
                { de: "sich auf jemanden verlassen", ar: "اعتمد على شي حد" },
                { de: "jemanden unterstützen", ar: "ساند شي حد" },
                { de: "einen Rat geben", ar: "عطى نصيحة" },
                { de: "prägen", ar: "أثّر فيه / طبعو" },
                { de: "dankbar sein", ar: "كان ممتن" }
            ],
            muster: {
                de: "Die wichtigste Person in meinem Leben ist meine Großmutter. Ich habe als Kind oft bei ihr gewohnt, weil meine Eltern beide gearbeitet haben. Sie ist eine sehr geduldige und warmherzige Frau, die immer Zeit für andere hat. Obwohl sie selbst nie zur Schule gehen konnte, hat sie mich jeden Tag gefragt, was ich gelernt habe, und hat sich meine Hausaufgaben angesehen. Ich erinnere mich besonders an einen Abend, als ich eine schlechte Note bekommen hatte und sehr traurig war. Sie hat mir damals gesagt: „Wer fällt, steht wieder auf – das ist das Einzige, was zählt.“ Diesen Satz habe ich nie vergessen. Von ihr habe ich gelernt, dankbar zu sein und nicht so schnell aufzugeben. Heute wohne ich in einer anderen Stadt, aber ich rufe sie fast jeden Tag an. Wenn ich die Prüfung bestehe und nach Deutschland gehe, wird sie mir sehr fehlen. Sie ist für mich ein echtes Vorbild, weil sie trotz vieler Schwierigkeiten immer positiv geblieben ist.",
                ar: "أهم شخص فحياتي هي جدتي. ملي كنت صغير كنت كنسكن عندها بزاف، حيت الوالدين بجوج كانو خدامين. هي مرا صبّارة وحنينة بزاف، ديما عندها الوقت للناس. واخا هي عمرها قرات، كانت كل نهار كتسولني شنو تعلمت وكتشوف الواجبات ديالي. كنتفكر خصوصاً واحد الليلة جبت فيها نقطة خايبة وكنت مقلق بزاف. قالت ليا ديك الساعة: «اللي طاح كينوض — هادي هي الحاجة الوحيدة اللي كتحسب.» هاد الجملة عمري نسيتها. تعلمت منها نكون ممتن وما نطيحش اليدين بزربة. دابا كنسكن فمدينة خرى، ولكن كنعيط ليها تقريباً كل نهار. إلا نجحت فالامتحان ومشيت لألمانيا، غتوحشني بزاف. هي بالنسبة ليا قدوة حقيقية، حيت بقات ديما إيجابية واخا الصعوبات بزاف."
            },
            fragen: [
                { de: "Haben Sie auch heute noch Vorbilder?", ar: "واش باقي عندك قدوة حتى دابا؟" },
                { de: "Sind Sie selbst für jemanden ein Vorbild?", ar: "واش نتا قدوة لشي حد؟" },
                { de: "Welche Rolle spielen Großeltern in Ihrem Land?", ar: "شنو الدور ديال الجدود فبلادك؟" },
                { de: "Was ist Ihnen in einer Freundschaft am wichtigsten?", ar: "شنو أهم حاجة عندك فالصداقة؟" },
                { de: "Wie halten Sie Kontakt mit Menschen, die weit weg wohnen?", ar: "كيفاش كتبقى على تواصل مع الناس البعاد؟" },
                { de: "Gibt es eine berühmte Person, die Sie bewundern?", ar: "واش كاين شي شخص مشهور كتعجب بيه؟" }
            ]
        },

        "e-erfahrung": {
            kind: "erfahrung",
            title: "Über eine wichtige Erfahrung sprechen",
            aufgabe: "Berichten Sie von einer Erfahrung, die für Sie besonders wichtig war.",
            aufgabeAr: "حكي على شي تجربة كانت مهمة بزاف بالنسبة ليك.",
            leitfragen: [
                { de: "Um welche Erfahrung geht es und wann war das?", ar: "شمن تجربة وإمتى كانت؟" },
                { de: "Wie ist es dazu gekommen?", ar: "كيفاش وصلتي ليها؟" },
                { de: "Was ist genau passiert?", ar: "شنو وقع بالضبط؟" },
                { de: "Welche Schwierigkeiten gab es?", ar: "شنو الصعوبات اللي كانت؟" },
                { de: "Wie haben Sie sich dabei gefühlt?", ar: "كيفاش حسيتي؟" },
                { de: "Was haben Sie daraus gelernt?", ar: "شنو تعلمتي منها؟" }
            ],
            wortschatz: [
                { de: "die Herausforderung", ar: "التحدي" },
                { de: "zum ersten Mal", ar: "أول مرة" },
                { de: "aufgeregt / nervös", ar: "متوتر / مخلوع" },
                { de: "Schwierigkeiten überwinden", ar: "تغلّب على الصعوبات" },
                { de: "selbstständig werden", ar: "ولّى معتمد على راسو" },
                { de: "sich an etwas gewöhnen", ar: "تعوّد على شي حاجة" },
                { de: "stolz auf etwas sein", ar: "فخور بشي حاجة" },
                { de: "Im Nachhinein …", ar: "من بعد، ملي كنشوف اللور …" }
            ],
            muster: {
                de: "Eine sehr wichtige Erfahrung für mich war mein erstes Praktikum in einem Hotel in Agadir. Das war vor drei Jahren, direkt nach meinem Abschluss. Ich hatte mich eigentlich nur beworben, weil ein Freund dort gearbeitet hat, aber zu meiner Überraschung wurde ich sofort genommen. Zum ersten Mal habe ich allein in einer anderen Stadt gewohnt und mein eigenes Geld verdient. Am Anfang war das sehr schwierig: Ich musste um sechs Uhr morgens anfangen, und an der Rezeption habe ich mit Gästen aus vielen Ländern gesprochen – auch auf Deutsch, was mich total nervös gemacht hat. In der ersten Woche habe ich einen Gast falsch verstanden und ihm das falsche Zimmer gegeben. Das war mir sehr peinlich. Meine Chefin hat aber nur gelacht und mir geholfen. Mit der Zeit habe ich mich an alles gewöhnt und bin viel selbstständiger geworden. Im Nachhinein bin ich sehr stolz auf diese Zeit, weil ich dort gemerkt habe, dass ich Deutsch wirklich brauche – deshalb lerne ich heute so intensiv.",
                ar: "واحد التجربة مهمة بزاف بالنسبة ليا هي أول ستاج درتو فواحد الأوتيل فأكادير. كان هادي تلت سنين، مباشرة من بعد ما ساليت القراية. فالحقيقة قدمت غير حيت واحد صاحبي كان خدام تما، ولكن تفاجأت حيت قبلوني ديريكت. أول مرة سكنت بوحدي فمدينة خرى وربحت الفلوس ديالي. فالأول كان صعيب بزاف: كان خاصني نبدا مع الستة د الصباح، وفالاستقبال كنت كنهضر مع ضياف من بزاف ديال البلدان — حتى بالألمانية، وهادشي كان كيخلعني بزاف. فالسيمانة اللولة فهمت واحد الضيف غلط وعطيتو بيت ماشي ديالو. حشمت بزاف. ولكن المسؤولة ديالي غير ضحكات وعاونتني. مع الوقت تعودت على كلشي وليت معتمد على راسي كثر. ملي كنشوف اللور، فخور بزاف بداك الوقت، حيت تما عرفت بلي الألمانية كنحتاجها بصح — داكشي علاش كنقرا دابا بجدية."
            },
            fragen: [
                { de: "Würden Sie heute etwas anders machen?", ar: "واش دابا غادي تدير شي حاجة بطريقة مختلفة؟" },
                { de: "Wer hat Ihnen in dieser Zeit am meisten geholfen?", ar: "شكون عاونك أكثر فداك الوقت؟" },
                { de: "Welchen Rat würden Sie jemandem in derselben Situation geben?", ar: "شنو النصيحة اللي تعطي لشي حد فنفس الوضعية؟" },
                { de: "Sind Fehler wichtig, um etwas zu lernen?", ar: "واش الأخطاء مهمة باش الواحد يتعلم؟" },
                { de: "Wie gehen Sie normalerweise mit Stress um?", ar: "كيفاش عادة كتعامل مع الضغط؟" },
                { de: "Welche Erfahrung möchten Sie in Zukunft noch machen?", ar: "شمن تجربة باغي تعيش فالمستقبل؟" }
            ]
        },

        "e-fest": {
            kind: "erfahrung",
            title: "Über ein Fest sprechen",
            aufgabe: "Berichten Sie von einem Fest oder einer Feier, an die Sie sich gern erinnern.",
            aufgabeAr: "حكي على شي عرس ولا حفلة كتبغي تتفكرها.",
            leitfragen: [
                { de: "Was wurde gefeiert und wann?", ar: "شنو كانو كيحتافلو بيه وإمتى؟" },
                { de: "Wo hat das Fest stattgefunden und wer war dabei?", ar: "فين دازت الحفلة وشكون كان حاضر؟" },
                { de: "Wie haben Sie sich vorbereitet?", ar: "كيفاش وجدتو؟" },
                { de: "Welche Traditionen gab es? (Essen, Kleidung, Musik)", ar: "شنو التقاليد اللي كانت؟ (الماكلة، اللبسة، الموسيقى)" },
                { de: "Was war der schönste Moment?", ar: "شنو أزين لحظة؟" },
                { de: "Was unterscheidet das Fest von Feiern in Deutschland?", ar: "شنو الفرق بينها وبين الحفلات فألمانيا؟" }
            ],
            wortschatz: [
                { de: "die Hochzeit", ar: "العرس" },
                { de: "das Brautpaar", ar: "العروسة والعريس" },
                { de: "die Gäste einladen", ar: "عرض على الضياف" },
                { de: "traditionelle Kleidung tragen", ar: "لبس لبسة تقليدية" },
                { de: "die ganze Nacht feiern", ar: "حتافل الليل كامل" },
                { de: "der Brauch / die Tradition", ar: "العادة / التقليد" },
                { de: "sich vorbereiten auf", ar: "توجّد لـ" },
                { de: "Es war ein unvergesslicher Abend.", ar: "كانت ليلة ما كتتنساش" }
            ],
            muster: {
                de: "Ich möchte Ihnen von der Hochzeit meines Cousins erzählen, die letzten August in Fès stattgefunden hat. Eine marokkanische Hochzeit dauert oft mehrere Tage, und fast die ganze Familie hilft bei der Vorbereitung. Ich war schon eine Woche vorher dort und habe zum Beispiel beim Dekorieren und Einkaufen geholfen. Am Hauptabend waren ungefähr dreihundert Gäste da. Alle haben traditionelle Kleidung getragen, die Frauen Kaftans und die Männer Djellabas. Es gab eine Band, die bis vier Uhr morgens gespielt hat, und natürlich sehr viel Essen – zuerst Pastilla, danach Hähnchen mit Oliven und am Ende Obst und Süßigkeiten. Der schönste Moment war für mich, als das Brautpaar in der „Amaria“ hereingetragen wurde. Da haben alle gleichzeitig geklatscht und gesungen. Anstrengend war nur, dass ich am nächsten Tag sehr müde war. Im Vergleich zu Deutschland sind Hochzeiten bei uns viel größer und lauter, dafür aber vielleicht weniger persönlich. Es war trotzdem ein unvergesslicher Abend.",
                ar: "بغيت نحكي ليكم على العرس ديال ولد عمي، اللي دار فغشت اللي فات ففاس. العرس المغربي كيدوم عادة بزاف ديال الأيام، وتقريباً العائلة كاملة كتعاون فالتوجاد. مشيت سيمانة قبل وعاونت مثلاً فالزواق والتقدية. فالليلة الكبيرة كانو تقريباً تلت مية ديال الضياف. كلشي كان لابس اللبسة التقليدية: العيالات القفاطن والرجال الجلالب. كانت واحد الجوق بقات كتعزف حتى الربعة د الصباح، وطبعاً بزاف ديال الماكلة — فالأول البسطيلة، من بعد الدجاج بالزيتون، وفاللخر الفاكية والحلويات. أزين لحظة بالنسبة ليا هي ملي دخلو العروسة والعريس فالعمارية. ديك الساعة كلشي صفق وغنى فنفس الوقت. الحاجة الوحيدة اللي كانت عيانة هي أني النهار اللي من بعد كنت عيان بزاف. إلا قارنا مع ألمانيا، الأعراس عندنا كبار وفيهم الصداع كثر، ولكن يمكن فيهم خصوصية قل. ومع ذلك كانت ليلة ما كتتنساش."
            },
            fragen: [
                { de: "Welches Fest feiern Sie am liebsten? Warum?", ar: "شمن عيد ولا حفلة كتبغي أكثر؟ علاش؟" },
                { de: "Sind große Hochzeiten Ihrer Meinung nach zu teuer?", ar: "واش الأعراس الكبار غاليين بزاف فرأيك؟" },
                { de: "Wie würden Sie selbst gern heiraten oder feiern?", ar: "كيفاش باغي دير العرس ولا الحفلة ديالك؟" },
                { de: "Haben Sie schon einmal ein deutsches Fest erlebt?", ar: "واش عمرك حضرتي شي حفلة ألمانية؟" },
                { de: "Welche Traditionen sollte man unbedingt bewahren?", ar: "شنو التقاليد اللي خاصنا نحافظو عليها ضروري؟" },
                { de: "Feiern Sie Ihren Geburtstag? Wie?", ar: "واش كتحتافل بعيد ميلادك؟ كيفاش؟" }
            ]
        }
    };

    window.SPRECHEN_B2_TOPICS = TOPICS.concat(window.SPRECHEN_B2_TOPICS || []);
    const all = window.SPRECHEN_B2_CONTENT = window.SPRECHEN_B2_CONTENT || {};
    Object.keys(CONTENT).forEach(function (id) {
        all[id] = Object.assign({}, all[id], { teil1: CONTENT[id] });
    });
})();
