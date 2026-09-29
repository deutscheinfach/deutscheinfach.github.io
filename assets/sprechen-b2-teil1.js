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
                    "kind": "erfahrung",
                    "title": "Über eine Reise sprechen",
                    "aufgabe": "Berichten Sie von einer Reise, die Sie gemacht haben und an die Sie sich gern erinnern.",
                    "aufgabeAr": "حكي على شي سفر درتيه وكتبغي تتفكرو.",
                    "leitfragen": [
                            {
                                    "de": "Wohin sind Sie gereist und wann war das?",
                                    "ar": "فين سافرتي وإمتى؟"
                            },
                            {
                                    "de": "Mit wem sind Sie gereist?",
                                    "ar": "مع من مشيتي؟"
                            },
                            {
                                    "de": "Wie sind Sie dorthin gekommen und wo haben Sie übernachtet?",
                                    "ar": "كيفاش وصلتي وفين بتّي؟"
                            },
                            {
                                    "de": "Was haben Sie erlebt? Gab es ein besonderes Erlebnis?",
                                    "ar": "شنو درتي؟ واش وقعات شي حاجة خاصة؟"
                            },
                            {
                                    "de": "Was hat Ihnen gefallen – und was nicht?",
                                    "ar": "شنو عجبك وشنو ما عجبكش؟"
                            },
                            {
                                    "de": "Würden Sie die Reise weiterempfehlen? Warum?",
                                    "ar": "واش تنصح بيها؟ علاش؟"
                            }
                    ],
                    "wortschatz": [
                            {
                                    "de": "die Unterkunft",
                                    "ar": "بلاصة المبيت"
                            },
                            {
                                    "de": "die Sehenswürdigkeit",
                                    "ar": "معلمة سياحية"
                            },
                            {
                                    "de": "einen Ausflug machen",
                                    "ar": "دار نزهة / خرجة"
                            },
                            {
                                    "de": "die Landschaft",
                                    "ar": "المنظر الطبيعي"
                            },
                            {
                                    "de": "sich verlaufen",
                                    "ar": "تلف فالطريق"
                            },
                            {
                                    "de": "die Einheimischen",
                                    "ar": "ناس البلاد"
                            },
                            {
                                    "de": "atemberaubend",
                                    "ar": "كيقطع النفس (زوين بزاف)"
                            },
                            {
                                    "de": "unvergesslich",
                                    "ar": "ما كيتنساش"
                            }
                    ],
                    "muster": {
                            "de": "Ich möchte Ihnen heute von meiner Reise nach Chefchaouen erzählen, einer kleinen Stadt im Norden Marokkos. Letzten Sommer bin ich mit zwei Freunden für vier Tage dorthin gefahren. Wir haben den Bus von Tanger genommen und in einem kleinen Gästehaus in der Altstadt übernachtet. Besonders beeindruckt haben mich die blauen Gassen – man fühlt sich wie in einem Märchen. Am zweiten Tag haben wir eine Wanderung zum Wasserfall von Akchour gemacht. Das war zwar anstrengend, aber die Landschaft war einfach atemberaubend. Ein Erlebnis werde ich nie vergessen: Wir haben uns abends in der Altstadt verlaufen, und eine ältere Frau hat uns nicht nur den Weg gezeigt, sondern uns auch zu einem Tee eingeladen. Weniger schön fand ich, dass es sehr viele Touristen gab. Trotzdem würde ich die Reise jedem empfehlen, der Natur und Ruhe mag. Für mich war es eine der schönsten Reisen, weil ich viel über die Menschen und die Kultur gelernt habe.",
                            "ar": "بغيت نحكي ليكم اليوم على السفر ديالي لشفشاون، مدينة صغيرة فشمال المغرب. الصيف اللي فات مشيت ليها مع جوج صحابي ربعة د الأيام. خدينا الكار من طنجة وبتنا فدار ضيافة صغيرة فالمدينة القديمة. أكثر حاجة عجباتني هي الزناقي الزرقين — كتحس براسك وسط شي حكاية. فالنهار التاني درنا مشية على رجلينا للشلال ديال أقشور. كانت عيانة شوية، ولكن المنظر كان زوين بزاف. واحد الحاجة عمري ننساها: فالليل تلفنا فالمدينة القديمة، وواحد السيدة كبيرة ماشي غير ورّاتنا الطريق، ولكن حتى عيطات علينا نشربو أتاي. اللي ما عجبنيش بزاف هو أنه كانو بزاف ديال السياح. ومع ذلك، ننصح بهاد السفر لأي واحد كيبغي الطبيعة والهدوء. بالنسبة ليا كانت من أحسن السفريات، حيت تعلمت بزاف على الناس والثقافة."
                    },
                    "fragen": [
                            {
                                    "de": "Würden Sie noch einmal dorthin fahren? Warum (nicht)?",
                                    "ar": "واش ترجع ليها مرة خرى؟ علاش؟"
                            },
                            {
                                    "de": "Reisen Sie lieber allein oder mit anderen Menschen?",
                                    "ar": "كتفضل تسافر بوحدك ولا مع الناس؟"
                            },
                            {
                                    "de": "Wie haben Sie die Reise geplant und organisiert?",
                                    "ar": "كيفاش وجدتي ونظمتي السفر؟"
                            },
                            {
                                    "de": "Was war das größte Problem auf dieser Reise?",
                                    "ar": "شنو أكبر مشكل تلاقيتي فهاد السفر؟"
                            },
                            {
                                    "de": "Welches Reiseziel möchten Sie unbedingt noch kennenlernen?",
                                    "ar": "شمن بلاصة باغي تزورها ضروري؟"
                            },
                            {
                                    "de": "Was ist Ihnen im Urlaub wichtiger: Erholung oder Abenteuer?",
                                    "ar": "شنو مهم عندك فالعطلة: الراحة ولا المغامرة؟"
                            }
                    ]
            },
            "e-buch": {
                    "kind": "erfahrung",
                    "title": "Über ein Buch sprechen",
                    "aufgabe": "Berichten Sie von einem Buch, das Sie gelesen haben und das Sie beeindruckt hat.",
                    "aufgabeAr": "حكي على شي كتاب قريتيه وأثّر فيك.",
                    "leitfragen": [
                            {
                                    "de": "Wie heißt das Buch und wer hat es geschrieben?",
                                    "ar": "شنو سميتو وشكون كتبو؟"
                            },
                            {
                                    "de": "Wann und warum haben Sie es gelesen?",
                                    "ar": "إمتى وعلاش قريتيه؟"
                            },
                            {
                                    "de": "Worum geht es in dem Buch? (kurz!)",
                                    "ar": "على شنو كيهضر؟ (باختصار)"
                            },
                            {
                                    "de": "Welche Figur oder welche Szene hat Ihnen besonders gefallen?",
                                    "ar": "شمن شخصية ولا مشهد عجبك أكثر؟"
                            },
                            {
                                    "de": "Was haben Sie aus dem Buch gelernt?",
                                    "ar": "شنو تعلمتي منو؟"
                            },
                            {
                                    "de": "Für wen ist das Buch geeignet?",
                                    "ar": "لمن كيصلح هاد الكتاب؟"
                            }
                    ],
                    "wortschatz": [
                            {
                                    "de": "der Roman",
                                    "ar": "الرواية"
                            },
                            {
                                    "de": "der Autor / die Autorin",
                                    "ar": "الكاتب / الكاتبة"
                            },
                            {
                                    "de": "die Hauptfigur",
                                    "ar": "الشخصية الرئيسية"
                            },
                            {
                                    "de": "die Handlung",
                                    "ar": "الأحداث"
                            },
                            {
                                    "de": "spannend",
                                    "ar": "مشوّق"
                            },
                            {
                                    "de": "Es geht um …",
                                    "ar": "كيهضر على …"
                            },
                            {
                                    "de": "zum Nachdenken anregen",
                                    "ar": "كيخليك تفكر"
                            },
                            {
                                    "de": "Ich konnte es nicht aus der Hand legen.",
                                    "ar": "ما قدرتش نحبس القراية"
                            }
                    ],
                    "muster": {
                            "de": "Ich möchte Ihnen von dem Roman „Der Alchimist“ von Paulo Coelho erzählen. Ich habe das Buch vor zwei Jahren gelesen, weil eine Freundin es mir zum Geburtstag geschenkt hat. Am Anfang war ich skeptisch, denn ich lese normalerweise keine Romane. Aber schon nach den ersten Seiten konnte ich es nicht mehr aus der Hand legen. Es geht um einen jungen Hirten aus Spanien, der von einem Schatz träumt und deshalb eine lange Reise bis nach Ägypten macht. Unterwegs trifft er viele Menschen, die ihm etwas über das Leben beibringen. Besonders gefallen hat mir die Szene in der Wüste, weil sie sehr ruhig und poetisch beschrieben ist. Aus dem Buch habe ich gelernt, dass man seine Träume nicht aufgeben sollte, auch wenn der Weg schwierig ist. Das Buch ist einfach geschrieben, deshalb ist es auch für Deutschlernende geeignet – es gibt es nämlich auch auf Deutsch. Ich empfehle es allen, die gerade eine wichtige Entscheidung treffen müssen.",
                            "ar": "بغيت نحكي ليكم على الرواية ديال «الخيميائي» ديال باولو كويلو. قريتها هادي عامين، حيت واحد صاحبتي هدّاتها ليا فعيد الميلاد. فالأول ما كنتش مقتانع، حيت عادة ما كنقراش الروايات. ولكن من الصفحات اللولين ما بقيتش قادر نحبس. كتحكي على راعي صغير من إسبانيا كيحلم بواحد الكنز، وعلى هادشي كيدير سفر طويل حتى لمصر. فالطريق كيتلاقى بزاف ديال الناس اللي كيعلموه شي حاجة على الحياة. أكثر حاجة عجباتني هي المشهد ديال الصحرا، حيت موصوف بطريقة هادئة وشاعرية. تعلمت من هاد الكتاب أنه ما خاصناش نتخلاو على الأحلام ديالنا، واخا الطريق صعيبة. الكتاب مكتوب بطريقة ساهلة، داكشي علاش كيصلح حتى للي كيتعلمو الألمانية — حيت كاين حتى بالألمانية. كننصح بيه لكل واحد خاصو ياخد شي قرار مهم."
                    },
                    "fragen": [
                            {
                                    "de": "Lesen Sie lieber gedruckte Bücher oder E-Books?",
                                    "ar": "كتفضل الكتب المطبوعة ولا الإلكترونية؟"
                            },
                            {
                                    "de": "Haben Sie auch den Film zum Buch gesehen?",
                                    "ar": "واش شفتي الفيلم ديال هاد الكتاب؟"
                            },
                            {
                                    "de": "Wie viel Zeit haben Sie normalerweise zum Lesen?",
                                    "ar": "شحال ديال الوقت عندك عادة للقراية؟"
                            },
                            {
                                    "de": "Welches Buch möchten Sie als Nächstes lesen?",
                                    "ar": "شنو الكتاب اللي باغي تقرا من بعد؟"
                            },
                            {
                                    "de": "Lesen junge Leute heute weniger als früher? Was meinen Sie?",
                                    "ar": "واش الشباب اليوم كيقراو قل من قبل؟ شنو رأيك؟"
                            },
                            {
                                    "de": "Haben Sie schon einmal ein Buch auf Deutsch gelesen?",
                                    "ar": "واش عمرك قريتي كتاب بالألمانية؟"
                            }
                    ]
            },
            "e-film": {
                    "kind": "erfahrung",
                    "title": "Über einen Film sprechen",
                    "aufgabe": "Berichten Sie von einem Film, den Sie gesehen haben und der Ihnen in Erinnerung geblieben ist.",
                    "aufgabeAr": "حكي على شي فيلم شفتيه وبقى فبالك.",
                    "leitfragen": [
                            {
                                    "de": "Wie heißt der Film und was für ein Film ist es?",
                                    "ar": "شنو سميتو وشمن نوع ديال الأفلام؟"
                            },
                            {
                                    "de": "Wo und mit wem haben Sie ihn gesehen?",
                                    "ar": "فين ومع من شفتيه؟"
                            },
                            {
                                    "de": "Worum geht es in dem Film? (kurz!)",
                                    "ar": "على شنو كيهضر؟ (باختصار)"
                            },
                            {
                                    "de": "Welche Szene oder welcher Schauspieler hat Sie beeindruckt?",
                                    "ar": "شمن مشهد ولا ممثل عجبك؟"
                            },
                            {
                                    "de": "Was fanden Sie weniger gut?",
                                    "ar": "شنو ما عجبكش بزاف؟"
                            },
                            {
                                    "de": "Würden Sie den Film empfehlen? Wem?",
                                    "ar": "واش تنصح بيه؟ لمن؟"
                            }
                    ],
                    "wortschatz": [
                            {
                                    "de": "die Komödie / das Drama",
                                    "ar": "كوميديا / دراما"
                            },
                            {
                                    "de": "der Schauspieler / die Schauspielerin",
                                    "ar": "الممثل / الممثلة"
                            },
                            {
                                    "de": "die Hauptrolle spielen",
                                    "ar": "لعب الدور الرئيسي"
                            },
                            {
                                    "de": "auf einer wahren Geschichte beruhen",
                                    "ar": "مبني على قصة حقيقية"
                            },
                            {
                                    "de": "berührend",
                                    "ar": "مؤثر"
                            },
                            {
                                    "de": "die Szene",
                                    "ar": "المشهد"
                            },
                            {
                                    "de": "das Ende",
                                    "ar": "النهاية"
                            },
                            {
                                    "de": "Ich musste lachen / weinen.",
                                    "ar": "ضحكت / بكيت"
                            }
                    ],
                    "muster": {
                            "de": "Ich möchte über den französischen Film „Ziemlich beste Freunde“ sprechen. Ich habe ihn zum ersten Mal vor drei Jahren zu Hause mit meiner Familie gesehen, und zwar mit deutschen Untertiteln. Der Film beruht auf einer wahren Geschichte. Es geht um einen reichen Mann, der nach einem Unfall im Rollstuhl sitzt, und um einen jungen Mann aus einem armen Viertel, der sein Pfleger wird. Obwohl die beiden sehr verschieden sind, werden sie richtig gute Freunde. Besonders beeindruckt hat mich die Szene, in der sie zusammen Paragliding machen – da musste ich gleichzeitig lachen und fast weinen. Die Schauspieler spielen sehr natürlich, deshalb glaubt man ihnen jedes Wort. Weniger gut fand ich, dass einige Probleme am Ende sehr schnell gelöst werden. Trotzdem ist es für mich einer der besten Filme, die ich kenne, weil er zeigt, dass Freundschaft keine Grenzen hat. Ich würde ihn allen empfehlen, besonders wenn man einen schlechten Tag hatte.",
                            "ar": "بغيت نهضر على الفيلم الفرنسي «أصدقاء تقريباً مزيانين» (Intouchables). شفتو أول مرة هادي تلت سنين فالدار مع العائلة، وكان بالترجمة الألمانية. الفيلم مبني على قصة حقيقية. كيحكي على راجل غني ولّا فالكرسي المتحرك من بعد حادثة، وعلى شاب من حومة فقيرة ولّا هو اللي كيتلاها بيه. واخا بجوج مختلفين بزاف، كيوليو صحاب بصح. أكثر مشهد أثّر فيا هو ملي طارو بجوج بالباراشوت — ضحكت وقربت نبكي فنفس الوقت. الممثلين كيلعبو بطريقة طبيعية، داكشي علاش كتصدقهم فكل كلمة. اللي ما عجبنيش بزاف هو أنه شي مشاكل تحلّو بزربة فاللخر. ومع ذلك، بالنسبة ليا هو من أحسن الأفلام اللي كنعرف، حيت كيبين أن الصداقة ما عندهاش حدود. ننصح بيه للجميع، خصوصاً إلا كان عندك نهار خايب."
                    },
                    "fragen": [
                            {
                                    "de": "Gehen Sie lieber ins Kino oder schauen Sie Filme zu Hause?",
                                    "ar": "كتفضل السينما ولا تشوف الأفلام فالدار؟"
                            },
                            {
                                    "de": "Schauen Sie Filme lieber im Original oder synchronisiert?",
                                    "ar": "كتفضل الأفلام بلغتها الأصلية ولا مدبلجة؟"
                            },
                            {
                                    "de": "Welche Filme mögen Sie gar nicht? Warum?",
                                    "ar": "شمن أفلام ما كتبغيهاش بتاتاً؟ علاش؟"
                            },
                            {
                                    "de": "Helfen Filme beim Deutschlernen? Wie?",
                                    "ar": "واش الأفلام كتعاون فتعلم الألمانية؟ كيفاش؟"
                            },
                            {
                                    "de": "Haben Sie den Film mehr als einmal gesehen?",
                                    "ar": "واش شفتيه كثر من مرة؟"
                            },
                            {
                                    "de": "Welchen Film sollte man Ihrer Meinung nach unbedingt sehen?",
                                    "ar": "شنو الفيلم اللي خاص الواحد يشوفو ضروري فرأيك؟"
                            }
                    ]
            },
            "e-sport": {
                    "kind": "erfahrung",
                    "title": "Über ein Sportereignis sprechen",
                    "aufgabe": "Berichten Sie von einem Sportereignis, das Sie besucht oder gesehen haben.",
                    "aufgabeAr": "حكي على شي حدث رياضي حضرتيه ولا تفرجتي فيه.",
                    "leitfragen": [
                            {
                                    "de": "Um welches Ereignis ging es und wann war das?",
                                    "ar": "شمن حدث وإمتى كان؟"
                            },
                            {
                                    "de": "Wo haben Sie es erlebt – im Stadion, im Café, zu Hause?",
                                    "ar": "فين عشتيه — فالملعب، فالقهوة، فالدار؟"
                            },
                            {
                                    "de": "Mit wem waren Sie dort?",
                                    "ar": "مع من كنتي؟"
                            },
                            {
                                    "de": "Wie war die Stimmung?",
                                    "ar": "كيفاش كان الجو؟"
                            },
                            {
                                    "de": "Was war der spannendste Moment?",
                                    "ar": "شنو أكثر لحظة كانت مشوقة؟"
                            },
                            {
                                    "de": "Warum ist Ihnen dieses Ereignis in Erinnerung geblieben?",
                                    "ar": "علاش بقى فبالك؟"
                            }
                    ],
                    "wortschatz": [
                            {
                                    "de": "das Spiel / das Turnier",
                                    "ar": "الماتش / الدوري"
                            },
                            {
                                    "de": "die Mannschaft",
                                    "ar": "الفريق"
                            },
                            {
                                    "de": "ein Tor schießen",
                                    "ar": "سجّل هدف"
                            },
                            {
                                    "de": "gewinnen / verlieren",
                                    "ar": "ربح / خسر"
                            },
                            {
                                    "de": "das Halbfinale",
                                    "ar": "نصف النهاية"
                            },
                            {
                                    "de": "die Fans jubeln",
                                    "ar": "الجمهور كيفرح ويغوّت"
                            },
                            {
                                    "de": "Gänsehaut bekommen",
                                    "ar": "تشوّك / تقفقف من الفرحة"
                            },
                            {
                                    "de": "die Stimmung war unglaublich",
                                    "ar": "الجو كان خيالي"
                            }
                    ],
                    "muster": {
                            "de": "Ich möchte Ihnen von einem Fußballspiel erzählen, das ich nie vergessen werde: dem Viertelfinale der Weltmeisterschaft 2022 zwischen Marokko und Portugal. Ich habe das Spiel nicht im Stadion gesehen, sondern in einem Café in meinem Viertel, zusammen mit meinen Brüdern und vielen Nachbarn. Schon zwei Stunden vor dem Anpfiff war das Café völlig voll. Die Stimmung war unglaublich: Alle haben gesungen, und viele hatten Fahnen dabei. Der spannendste Moment war natürlich das Tor von Youssef En-Nesyri kurz vor der Pause. Danach war die zweite Halbzeit sehr nervös, weil Portugal immer wieder angegriffen hat. Als der Schiedsrichter endlich abgepfiffen hat, sind alle auf die Straße gelaufen und haben bis spät in die Nacht gefeiert. Ich hatte die ganze Zeit Gänsehaut. Dieses Ereignis ist mir in Erinnerung geblieben, weil ich noch nie so viele Menschen gleichzeitig so glücklich gesehen habe. Es hat mir gezeigt, wie sehr Sport Menschen verbinden kann.",
                            "ar": "بغيت نحكي ليكم على واحد الماتش عمري ننساه: ربع النهاية ديال كأس العالم 2022 بين المغرب والبرتغال. ما شفتوش فالملعب، شفتو فواحد القهوة فالحومة ديالي، مع خوتي وبزاف ديال الجيران. جوج سوايع قبل الماتش القهوة كانت عامرة. الجو كان خيالي: كلشي كيغني، وبزاف كانو هازين الرايات. أكثر لحظة مشوقة طبعاً هي الهدف ديال يوسف النصيري قبل الاستراحة بشوية. من بعد، الشوط التاني كان فيه بزاف ديال التوتر، حيت البرتغال بقات كتهجم. ملي الحكم صفّر أخيراً، كلشي خرج للزنقة وبقاو كيحتافلو حتى لوقت متأخر فالليل. بقيت مقفقف طول الوقت. هاد الحدث بقى فبالي حيت عمري شفت هاد العدد ديال الناس فرحانين فنفس الوقت. بيّن ليا شحال الرياضة تقدر تجمع الناس."
                    },
                    "fragen": [
                            {
                                    "de": "Schauen Sie Sport lieber im Stadion oder im Fernsehen?",
                                    "ar": "كتفضل تتفرج فالملعب ولا فالتلفزة؟"
                            },
                            {
                                    "de": "Treiben Sie selbst auch Sport? Welchen?",
                                    "ar": "واش كتمارس حتى نتا شي رياضة؟ شمن وحدة؟"
                            },
                            {
                                    "de": "Sind die Eintrittskarten für große Spiele zu teuer?",
                                    "ar": "واش البطاقات ديال الماتشات الكبار غاليين بزاف؟"
                            },
                            {
                                    "de": "Warum ist Fußball in Ihrem Land so beliebt?",
                                    "ar": "علاش الكرة محبوبة بزاف فبلادك؟"
                            },
                            {
                                    "de": "Welches Sportereignis möchten Sie einmal live erleben?",
                                    "ar": "شمن حدث رياضي باغي تحضرو مباشرة؟"
                            },
                            {
                                    "de": "Kann Sport auch negative Seiten haben? Welche?",
                                    "ar": "واش الرياضة عندها حتى جوانب سلبية؟ شنو هي؟"
                            }
                    ]
            }
    };

    window.SPRECHEN_B2_TOPICS = TOPICS.concat(window.SPRECHEN_B2_TOPICS || []);
    const all = window.SPRECHEN_B2_CONTENT = window.SPRECHEN_B2_CONTENT || {};
    Object.keys(CONTENT).forEach(function (id) {
        all[id] = Object.assign({}, all[id], { teil1: CONTENT[id] });
    });
})();
