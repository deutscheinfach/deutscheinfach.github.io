/* ===== الكلمات اللي كتعاود ف كل نص =====

   قاموس Wortschatz فيه الكلمات الصعيبة ديال telc، ماشي الكلمات الصغار
   اللي كتعاود ف كل سطر (und، der، ist، hat…). هادو ماكاينينش هنا، والطالب
   كيبرك عليهم. بلا هاد الملف، كل ضغطة على «die» كتمشي للـ Worker.

   words  = [الكلمة، المعنى]  — الأصل (المصدر ف الأفعال)، كيتجبدو منو الأشكال
   closed = نفس الشكل، للكلمات الصغار: كتطابق غير بالضبط
   forms  = الشكل ← الأصل، غير للأشكال الشاذة اللي ما كيجيبهاش
            word-lookup.js بوحدو (ging ← gehen، ist ← sein).
            الأفعال العادية (macht، machte، gemacht) ما خاصهاش.

   هاد المعاني كتبناهم بالدارجة، ماشي من مصدر خارجي: راجعهم إلا بغيتي
   صياغة آخرى — الملف بسيط، سطر لكل كلمة. */

window.DE_CORE = {
    words: [
        /* الأدوات */
        ["ein", "واحد (أداة التنكير)"],
        ["kein", "ماشي / ما كاين حتى (نفي الاسم)"],

        /* الضمائر */
        ["ihr", "نتوما / ديالها / ديالهم"],
        ["mein", "ديالي"],
        ["dein", "ديالك"],
        ["unser", "ديالنا"],
        ["euer", "ديالكم"],

        /* أسماء كتعاود بزاف */
        ["das Kind", "الطفل"],
        ["der Mensch", "الإنسان"],
        ["das Jahr", "العام / السنة"],
        ["der Tag", "النهار / اليوم"],
        ["die Zeit", "الوقت / الزمن"],
        ["die Uhr", "الساعة"],
        ["die Frau", "المرا"],
        ["der Mann", "الراجل"],
        ["die Familie", "العائلة"],
        ["das Land", "البلاد"],
        ["die Welt", "العالم"],
        ["das Leben", "الحياة"],

        /* أرقام */
        ["erst", "الأول / غير (ظرف)"],

        /* ظروف وصفات كتعاود */
        ["gut", "مزيان"],
        ["neu", "جديد"],
        ["ander", "آخر / آخرين"],
        ["jeder", "كل / كل واحد"],
        ["dieser", "هاد / هادا"],
        ["ganz", "كامل / بزاف"],

        /* أسماء كتعاود ف النصوص */
        ["die Schule", "المدرسة"],
        ["der Schüler", "التلميذ"],
        ["der Hund", "الكلب"],
        ["die Gruppe", "المجموعة"],
        ["das Auto", "الطوموبيل"],
        ["der Computer", "الكمبيوتر"],
        ["die Woche", "السيمانة"],
        ["die Studie", "الدراسة"],
        ["die Information", "المعلومة"],
        ["das Prozent", "بالمية"],
        ["die Überschrift", "العنوان"],
        ["Deutschland", "ألمانيا"],

        /* أفعال */
        ["sein", "كان / كيكون (فعل) — ديالو (ملكية)"],
        ["haben", "عندو (كيملك)"],
        ["werden", "ولّى / غادي (للمستقبل)"],
        ["können", "قدر (يقدر)"],
        ["müssen", "خاصو (واجب)"],
        ["wollen", "بغى"],
        ["sollen", "خاصو (مطلوب منو)"],
        ["dürfen", "يقدر (عندو الإذن)"],
        ["mögen", "عجبو / كيحب"],
        ["gehen", "مشى"],
        ["kommen", "جا"],
        ["geben", "عطى — es gibt = كاين"],
        ["sehen", "شاف"],
        ["nehmen", "خد"],
        ["wissen", "عرف (معلومة)"],
        ["kennen", "عرف (شخص / بلاصة)"],
        ["stehen", "وقف / كان واقف"],
        ["bleiben", "بقا"],
        ["bringen", "جاب"],
        ["denken", "فكّر"],
        ["finden", "لقى"],
        ["sprechen", "هضر"],
        ["lesen", "قرا"],
        ["schreiben", "كتب"],
        ["treffen", "لاقى / تلاقى"],
        ["helfen", "عاون"],
        ["fahren", "ساق / سافر"],
        ["tun", "دار"],
        ["lassen", "خلّى"],
        ["halten", "مسك / وقّف"],
        ["heißen", "سميتو"],
        ["gehören", "ديال / تابع ل"],
        ["möchten", "بغى (بأدب)"],
        ["machen", "دار / عمل"],
        ["arbeiten", "خدم"],
        ["spielen", "لعب"],
        ["suchen", "قلّب على"],
        ["sagen", "قال"],
        ["bieten", "عرض / قدّم"],
        ["passen", "ناسب / جا مزيان"]
    ],

    /* الكلمات الصغار (حروف الجر، الضمائر، الأرقام…): ما كتتصرفش، إذن كتطابق
       غير بالشكل بالضبط. بلا هادشي: nichts ← nicht، male ← mal. */
    closed: [
        /* الأدوات */
        ["der", "ال (أداة التعريف للمذكر)"],
        ["die", "ال (أداة التعريف للمؤنث والجمع) / اللي"],
        ["das", "ال (أداة التعريف للمحايد) / هادشي / اللي"],

        /* الضمائر */
        ["ich", "أنا"],
        ["du", "نتا / نتي"],
        ["er", "هو"],
        ["sie", "هي / هوما / (Sie) حضرتك"],
        ["es", "هو / هي (للأشياء) — es gibt = كاين"],
        ["wir", "حنا"],
        ["man", "الواحد / الناس (ضمير عام)"],
        ["sich", "راسو / راسها / راسهم (ضمير الانعكاس)"],
        ["uns", "لينا / علينا (حنا كمفعول)"],

        /* حروف الربط والظروف */
        ["und", "و"],
        ["oder", "ولا"],
        ["aber", "ولكن"],
        ["denn", "حيت"],
        ["weil", "حيت / بسبب"],
        ["dass", "بلي / أن"],
        ["wenn", "إلا / منين"],
        ["ob", "واش"],
        ["als", "منين (ف الماضي) / ك"],
        ["wie", "كيفاش / بحال"],
        ["so", "هكا / بهاد الشكل"],
        ["auch", "حتى / زيادة"],
        ["nur", "غير"],
        ["noch", "باقي / مازال / زيادة"],
        ["schon", "ديجا"],
        ["sehr", "بزاف"],
        ["mehr", "أكثر / زيادة"],
        ["viel", "بزاف"],
        ["viele", "بزاف د / كثيرين"],
        ["etwas", "شي حاجة / شوية"],
        ["immer", "ديما"],
        ["nie", "عمرو"],
        ["oft", "بزاف د المرات"],
        ["manchmal", "مرات"],
        ["dann", "من بعد"],
        ["jetzt", "دابا"],
        ["heute", "اليوم"],
        ["morgen", "غدا"],
        ["gestern", "البارح"],
        ["hier", "هنا"],
        ["dort", "تما"],
        ["da", "هنا / تما / حيت"],
        ["dabei", "فنفس الوقت / فهاد الشي / معاه"],
        ["nicht", "ماشي / ما…ش"],
        ["ja", "إيه"],
        ["nein", "لا"],
        ["bitte", "عفاك / من فضلك"],
        ["danke", "شكرا"],

        /* أدوات الاستفهام */
        ["was", "شنو"],
        ["wer", "شكون"],
        ["wo", "فين"],
        ["wann", "امتى"],
        ["warum", "علاش"],
        ["welche", "أي / شمن"],
        ["wohin", "لفين"],
        ["woher", "منين"],

        /* حروف الجر */
        ["in", "ف"],
        ["im", "ف (in dem)"],
        ["an", "على / حدا"],
        ["am", "ف / على (an dem) — مع التواريخ والأيام"],
        ["auf", "على / فوق"],
        ["aus", "من (داخل)"],
        ["bei", "عند / حدا"],
        ["beim", "عند (bei dem)"],
        ["bis", "حتى / ل"],
        ["durch", "عبر / بواسطة"],
        ["für", "ل / على قبل"],
        ["gegen", "ضد / حدود (تقريبا)"],
        ["mit", "مع / ب"],
        ["nach", "بعد / ل / حسب"],
        ["ohne", "بلا"],
        ["seit", "من (مدة) / من نهار"],
        ["über", "فوق / على (حول)"],
        ["um", "حدود (ساعة) / باش (um … zu)"],
        ["unter", "تحت / بين"],
        ["von", "من / ديال"],
        ["vom", "من / ديال (von dem)"],
        ["vor", "قبل / قدام"],
        ["zu", "ل / عند / باش (مع الفعل)"],
        ["zum", "ل (zu dem)"],
        ["zur", "ل (zu der)"],
        ["zwischen", "بين"],
        ["ins", "ل / ف (in das)"],

        /* أرقام */
        ["zwei", "جوج"],
        ["drei", "تلاتة"],
        ["vier", "ربعة"],
        ["fünf", "خمسة"],
        ["sechs", "ستة"],
        ["sieben", "سبعة"],
        ["acht", "تمانية"],
        ["neun", "تسعة"],
        ["zehn", "عشرة"],
        ["hundert", "مية"],
        ["tausend", "ألف"],

        /* ظروف وصفات كتعاود */
        ["alle", "كاع / الكل"],
        ["alles", "كلشي"],
        ["wieder", "عاود / مرة أخرى"],
        ["einmal", "مرة / مرة وحدة"],
        ["mal", "مرة / شوية (للتلطيف)"],
        ["doch", "بلى / ولكن"],
        ["ab", "من (تاريخ) / بعيد"],
        ["nun", "دابا / إذن"],
        ["sogar", "حتى"],
        ["fast", "تقريبا"],
        ["selbst", "راسو / حتى"],
        ["also", "يعني / إذن"],
        ["pro", "ل كل / فكل"],
        ["zwar", "صحيح (zwar … aber = صحيح ولكن)"],
        ["bereits", "ديجا"],
        ["täglich", "كل نهار"],
        ["gerade", "دابا / توا"]
    ],

    forms: {
        /* أدوات وضمائر */
        den: "der", dem: "der", des: "der",
        eine: "ein", einen: "ein", einem: "ein", einer: "ein", eines: "ein",
        keine: "kein", keinen: "kein", keinem: "kein", keiner: "kein",
        ihre: "ihr", ihren: "ihr", ihrem: "ihr", ihrer: "ihr", ihres: "ihr",
        seine: "sein", seinen: "sein", seinem: "sein", seiner: "sein", seines: "sein",
        meine: "mein", meinen: "mein", meinem: "mein", meiner: "mein",
        deine: "dein", deinen: "dein", deinem: "dein", deiner: "dein",
        unsere: "unser", unseren: "unser", unserem: "unser", unserer: "unser",
        mich: "ich", mir: "ich", dich: "du", dir: "du", ihn: "er", ihm: "er", ihnen: "sie",
        euch: "ihr",

        /* sein */
        bin: "sein", bist: "sein", ist: "sein", sind: "sein", seid: "sein",
        war: "sein", warst: "sein", waren: "sein", wart: "sein", gewesen: "sein",
        wäre: "sein", wären: "sein",

        /* haben */
        habe: "haben", hast: "haben", hat: "haben", habt: "haben",
        hatte: "haben", hattest: "haben", hatten: "haben", hattet: "haben", gehabt: "haben",
        hätte: "haben", hätten: "haben",

        /* werden */
        wird: "werden", wirst: "werden", werdet: "werden",
        wurde: "werden", wurden: "werden", geworden: "werden",
        würde: "werden", würden: "werden",

        /* الأفعال المساعدة */
        kann: "können", kannst: "können", könnt: "können",
        konnte: "können", konnten: "können", gekonnt: "können", könnte: "können", könnten: "können",
        muss: "müssen", musst: "müssen", müsst: "müssen",
        musste: "müssen", mussten: "müssen", gemusst: "müssen", müsste: "müssen",
        will: "wollen", willst: "wollen", wollt: "wollen", wollte: "wollen", wollten: "wollen",
        soll: "sollen", sollst: "sollen", sollt: "sollen", sollte: "sollen", sollten: "sollen",
        darf: "dürfen", darfst: "dürfen", dürft: "dürfen", durfte: "dürfen", durften: "dürfen",
        mag: "mögen", magst: "mögen", mochte: "mögen", mochten: "mögen",

        /* أفعال شاذة */
        gehst: "gehen", ging: "gehen", gingen: "gehen", gegangen: "gehen",
        kam: "kommen", kamen: "kommen", gekommen: "kommen",
        gibt: "geben", gibst: "geben", gab: "geben", gaben: "geben", gegeben: "geben",
        sieht: "sehen", siehst: "sehen", sah: "sehen", sahen: "sehen", gesehen: "sehen",
        nimmt: "nehmen", nimmst: "nehmen", nahm: "nehmen", nahmen: "nehmen", genommen: "nehmen",
        weiß: "wissen", weißt: "wissen", wusste: "wissen", wussten: "wissen", gewusst: "wissen",
        kannte: "kennen", kannten: "kennen", gekannt: "kennen",
        steht: "stehen", stand: "stehen", standen: "stehen", gestanden: "stehen",
        blieb: "bleiben", blieben: "bleiben", geblieben: "bleiben",
        brachte: "bringen", brachten: "bringen", gebracht: "bringen",
        dachte: "denken", dachten: "denken", gedacht: "denken",
        fand: "finden", fanden: "finden", gefunden: "finden",
        spricht: "sprechen", sprichst: "sprechen", sprach: "sprechen", sprachen: "sprechen", gesprochen: "sprechen",
        liest: "lesen", las: "lesen", lasen: "lesen", gelesen: "lesen",
        schrieb: "schreiben", schrieben: "schreiben", geschrieben: "schreiben",
        trifft: "treffen", triffst: "treffen", traf: "treffen", trafen: "treffen", getroffen: "treffen",
        hilft: "helfen", hilfst: "helfen", half: "helfen", halfen: "helfen", geholfen: "helfen",
        fährt: "fahren", fährst: "fahren", fuhr: "fahren", fuhren: "fahren", gefahren: "fahren",
        tut: "tun", tust: "tun", tat: "tun", taten: "tun", getan: "tun",
        lässt: "lassen", ließ: "lassen", ließen: "lassen", gelassen: "lassen",
        hält: "halten", hältst: "halten", hielt: "halten", hielten: "halten", gehalten: "halten",
        hieß: "heißen", hießen: "heißen", geheißen: "heißen",

        /* ما كيتجبدوش بالقواعد: diese ← dieser، jede ← jeder، besser ← gut */
        diese: "dieser", dieses: "dieser", diesen: "dieser", diesem: "dieser",
        jede: "jeder", jedes: "jeder", jeden: "jeder", jedem: "jeder",
        besser: "gut", beste: "gut", besten: "gut", bester: "gut", bestes: "gut",
        vielen: "viel", vieler: "viel", vielem: "viel", vieles: "viel",
        allen: "alle", aller: "alle", allem: "alle",
        welchen: "welche", welchem: "welche", welcher: "welche", welches: "welche"
    }
};
