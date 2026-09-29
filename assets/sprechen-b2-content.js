/* ===== Sprechen B2 — المحتوى المجاني برك =====

   المواضيع المقفولة ماكايناش هنا: الريبو عام. كيسكنو ف
   Cloudflare KV تحت lesen-sprechen-b2-<id>، والـ Worker
   ماكيعطيهمش حتى يتحقق من الحساب ومن الاشتراك — نفس
   الطريق ديال Lesen و Hören.

   هاد الملف مولّد:  node tools/split-sprechen.mjs
   ما تبدلوش بيدك — بدل premium-sprechen.json وعاود شغّل. */

window.SPRECHEN_B2_CONTENT = {
    "sport-gesundheit": {
        "teil2": {
            "title": "Diskussion",
            "minutes": 3,
            "intro": "Diskutieren Sie mit Ihrem Gesprächspartner über die folgende These: »Jede Schule sollte täglich eine Stunde Sport verpflichtend anbieten.«",
            "points": [
                "Sagen Sie klar, ob Sie zustimmen oder nicht – und warum.",
                "Nennen Sie ein Argument aus der Sicht der Schüler.",
                "Nennen Sie ein Argument aus der Sicht der Lehrer oder der Eltern.",
                "Reagieren Sie auf mindestens ein Argument Ihres Partners.",
                "Fassen Sie am Ende Ihre Position in einem Satz zusammen."
            ],
            "note": "ماشي خاصك تتفق معاه. الأهم: تعطي رأيك، تعلّلو، وتجاوب على ديالو."
        },
        "teil3": {
            "title": "Gemeinsam eine Aufgabe lösen",
            "minutes": 4,
            "intro": "Ihr Deutschkurs möchte einen Sporttag organisieren. Planen Sie ihn gemeinsam mit Ihrem Gesprächspartner.",
            "points": [
                "Wann und wo soll der Sporttag stattfinden?",
                "Welche Sportarten bieten Sie an? Denken Sie auch an weniger sportliche Teilnehmer.",
                "Wer kümmert sich um Getränke und Material?",
                "Wie informieren Sie die anderen Kursteilnehmer?",
                "Was kostet der Tag und wer bezahlt?"
            ],
            "note": "خاصكوم تخرجو بقرار مشترك فالآخر — ماشي غير كل واحد يقول رأيو."
        }
    },
    "smartphone-alltag": {
        "teil2": {
            "title": "Diskussion",
            "minutes": 3,
            "intro": "Diskutieren Sie mit Ihrem Gesprächspartner über die folgende These: »Handys sollten in der Schule komplett verboten werden.«",
            "points": [
                "Sagen Sie klar, ob Sie zustimmen oder nicht – und warum.",
                "Welche Probleme entstehen durch Handys im Unterricht?",
                "Wofür kann ein Handy im Unterricht auch nützlich sein?",
                "Reagieren Sie auf mindestens ein Argument Ihres Partners.",
                "Gibt es einen Kompromiss? Machen Sie einen Vorschlag."
            ],
            "note": "ماشي خاصك تتفق معاه. الأهم: تعطي رأيك، تعلّلو، وتجاوب على ديالو."
        },
        "teil3": {
            "title": "Gemeinsam eine Aufgabe lösen",
            "minutes": 4,
            "intro": "Ein Freund von Ihnen ist ständig am Handy und vernachlässigt Studium und Familie. Überlegen Sie gemeinsam, wie Sie ihm helfen können.",
            "points": [
                "Wie sprechen Sie ihn an, ohne ihn zu verletzen?",
                "Welche konkreten Regeln könnten ihm helfen?",
                "Welche Alternativen zur Handyzeit schlagen Sie ihm vor?",
                "Wer von Ihnen beiden spricht mit ihm – und wann?",
                "Was machen Sie, wenn sich nichts ändert?"
            ],
            "note": "خاصكوم تخرجو بقرار مشترك فالآخر — ماشي غير كل واحد يقول رأيو."
        }
    },
    "umweltschutz": {
        "teil2": {
            "title": "Diskussion",
            "minutes": 3,
            "intro": "Diskutieren Sie mit Ihrem Gesprächspartner über die folgende These: »Plastiktüten und Einwegverpackungen sollten überall verboten werden.«",
            "points": [
                "Sagen Sie klar, ob Sie zustimmen oder nicht – und warum.",
                "Was bedeutet ein Verbot für normale Familien?",
                "Was bedeutet es für kleine Geschäfte?",
                "Reagieren Sie auf mindestens ein Argument Ihres Partners.",
                "Wer sollte handeln: der Staat, die Firmen oder jeder Einzelne?"
            ],
            "note": "ماشي خاصك تتفق معاه. الأهم: تعطي رأيك، تعلّلو، وتجاوب على ديالو."
        },
        "teil3": {
            "title": "Gemeinsam eine Aufgabe lösen",
            "minutes": 4,
            "intro": "In Ihrem Wohnhaus wird der Müll nicht getrennt. Planen Sie gemeinsam eine Aktion, die das ändert.",
            "points": [
                "Wie erklären Sie den Nachbarn das Problem?",
                "Welche Hilfsmittel brauchen Sie (Behälter, Schilder, Infoblatt)?",
                "Wer spricht mit dem Hausverwalter?",
                "Wie motivieren Sie Nachbarn, die kein Interesse haben?",
                "Wann starten Sie und wie kontrollieren Sie das Ergebnis?"
            ],
            "note": "خاصكوم تخرجو بقرار مشترك فالآخر — ماشي غير كل واحد يقول رأيو."
        }
    },
    "ernaehrung": {
        "teil2": {
            "title": "Diskussion",
            "minutes": 3,
            "intro": "Diskutieren Sie mit Ihrem Gesprächspartner über die folgende These: »Ungesunde Lebensmittel sollten höher besteuert werden.«",
            "points": [
                "Sagen Sie klar, ob Sie zustimmen oder nicht – und warum.",
                "Welche Wirkung hätte eine solche Steuer wirklich?",
                "Wen würde sie am stärksten treffen?",
                "Reagieren Sie auf mindestens ein Argument Ihres Partners.",
                "Welche andere Maßnahme wäre vielleicht besser?"
            ],
            "note": "ماشي خاصك تتفق معاه. الأهم: تعطي رأيك، تعلّلو، وتجاوب على ديالو."
        },
        "teil3": {
            "title": "Gemeinsam eine Aufgabe lösen",
            "minutes": 4,
            "intro": "Sie organisieren zusammen ein internationales Essen für Ihren Deutschkurs. Planen Sie es gemeinsam.",
            "points": [
                "Wann und wo findet das Essen statt?",
                "Wer bringt was mit? Denken Sie an verschiedene Essgewohnheiten.",
                "Wie viel darf jeder ausgeben?",
                "Wer kümmert sich um Geschirr und Aufräumen?",
                "Wie laden Sie den Lehrer und andere Kurse ein?"
            ],
            "note": "خاصكوم تخرجو بقرار مشترك فالآخر — ماشي غير كل واحد يقول رأيو."
        }
    },
    "stadt-land": {
        "teil2": {
            "title": "Diskussion",
            "minutes": 3,
            "intro": "Diskutieren Sie mit Ihrem Gesprächspartner über die folgende These: »Familien mit Kindern sollten lieber auf dem Land wohnen.«",
            "points": [
                "Sagen Sie klar, ob Sie zustimmen oder nicht – und warum.",
                "Was bietet das Land den Kindern?",
                "Was bietet die Stadt den Eltern?",
                "Reagieren Sie auf mindestens ein Argument Ihres Partners.",
                "Wovon hängt die richtige Entscheidung Ihrer Meinung nach ab?"
            ],
            "note": "ماشي خاصك تتفق معاه. الأهم: تعطي رأيك، تعلّلو، وتجاوب على ديالو."
        },
        "teil3": {
            "title": "Gemeinsam eine Aufgabe lösen",
            "minutes": 4,
            "intro": "Sie und Ihr Gesprächspartner suchen zusammen eine Wohnung. Einigen Sie sich auf die Kriterien.",
            "points": [
                "Stadtzentrum oder Randgebiet – was ist wichtiger?",
                "Wie hoch darf die Miete höchstens sein?",
                "Welche Verkehrsanbindung brauchen Sie?",
                "Welche Ausstattung ist Pflicht, welche nur ein Wunsch?",
                "Wer übernimmt die Suche und wer die Besichtigungen?"
            ],
            "note": "خاصكوم تخرجو بقرار مشترك فالآخر — ماشي غير كل واحد يقول رأيو."
        }
    },
    "fremdsprachen": {
        "teil2": {
            "title": "Diskussion",
            "minutes": 3,
            "intro": "Diskutieren Sie mit Ihrem Gesprächspartner über die folgende These: »Eine Sprache lernt man am besten im Ausland, nicht im Kurs.«",
            "points": [
                "Sagen Sie klar, ob Sie zustimmen oder nicht – und warum.",
                "Was lernt man im Kurs besser?",
                "Was lernt man nur im Alltag im Ausland?",
                "Reagieren Sie auf mindestens ein Argument Ihres Partners.",
                "Welchen Weg empfehlen Sie einem Anfänger?"
            ],
            "note": "ماشي خاصك تتفق معاه. الأهم: تعطي رأيك، تعلّلو، وتجاوب على ديالو."
        },
        "teil3": {
            "title": "Gemeinsam eine Aufgabe lösen",
            "minutes": 4,
            "intro": "Ihr Kurs möchte eine Lerngruppe gründen, die sich regelmäßig trifft. Planen Sie sie gemeinsam.",
            "points": [
                "Wie oft und wie lange treffen Sie sich?",
                "Online oder in Präsenz – was passt besser?",
                "Woran arbeiten Sie: Sprechen, Grammatik oder Prüfungstraining?",
                "Wie sorgen Sie dafür, dass alle wirklich kommen?",
                "Wer leitet die Gruppe und bereitet das Material vor?"
            ],
            "note": "خاصكوم تخرجو بقرار مشترك فالآخر — ماشي غير كل واحد يقول رأيو."
        }
    }
};
