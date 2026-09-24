/* ===== محتوى Sprechen B2 =====

   مرتب حسب الموضوع، ومن بعد حسب الجزء:

     SPRECHEN_B2_CONTENT["sport-gesundheit"]["teil2"] = { … }

   المفاتيح: teil2 (Diskussion) · teil3 (Problemlösung / gemeinsam planen)
   Teil 1 (Über Erfahrungen sprechen) عندو ملف ديالو: sprechen-b2-teil1.js

   شكل الجزء:
   {
     title:   "…",
     minutes: 3,                       // الوقت ديال هاد الجزء
     intro:   "…",                     // شنو مطلوب منك
     points:  [ "…", "…", "…" ],       // النقط اللي خاصك تغطي
     note:    "…"                      // اختياري: ملاحظة بالدارجة
   }

   ملاحظة مهمة: هادو تمارين تحضيرية مكتوبين على شكل الامتحان
   (telc B2 mündliche Prüfung). ماشي أوراق امتحان رسمية.
   إلا عندك النصوص ديالك، بدّلهم من هنا نيشان.
*/

(function () {
    "use strict";

    function diskussion(these, punkte) {
        return {
            title: "Diskussion",
            minutes: 3,
            intro: "Diskutieren Sie mit Ihrem Gesprächspartner über die folgende These: »"
                 + these + "«",
            points: punkte,
            note: "ماشي خاصك تتفق معاه. الأهم: تعطي رأيك، تعلّلو، وتجاوب على ديالو."
        };
    }

    function problem(aufgabe, punkte) {
        return {
            title: "Gemeinsam eine Aufgabe lösen",
            minutes: 4,
            intro: aufgabe,
            points: punkte,
            note: "خاصكوم تخرجو بقرار مشترك فالآخر — ماشي غير كل واحد يقول رأيو."
        };
    }

    window.SPRECHEN_B2_CONTENT = {

        "sport-gesundheit": {
            teil2: diskussion(
                "Jede Schule sollte täglich eine Stunde Sport verpflichtend anbieten.",
                [
                    "Sagen Sie klar, ob Sie zustimmen oder nicht – und warum.",
                    "Nennen Sie ein Argument aus der Sicht der Schüler.",
                    "Nennen Sie ein Argument aus der Sicht der Lehrer oder der Eltern.",
                    "Reagieren Sie auf mindestens ein Argument Ihres Partners.",
                    "Fassen Sie am Ende Ihre Position in einem Satz zusammen."
                ]),
            teil3: problem(
                "Ihr Deutschkurs möchte einen Sporttag organisieren. Planen Sie ihn gemeinsam mit Ihrem Gesprächspartner.",
                [
                    "Wann und wo soll der Sporttag stattfinden?",
                    "Welche Sportarten bieten Sie an? Denken Sie auch an weniger sportliche Teilnehmer.",
                    "Wer kümmert sich um Getränke und Material?",
                    "Wie informieren Sie die anderen Kursteilnehmer?",
                    "Was kostet der Tag und wer bezahlt?"
                ])
        },

        "smartphone-alltag": {
            teil2: diskussion(
                "Handys sollten in der Schule komplett verboten werden.",
                [
                    "Sagen Sie klar, ob Sie zustimmen oder nicht – und warum.",
                    "Welche Probleme entstehen durch Handys im Unterricht?",
                    "Wofür kann ein Handy im Unterricht auch nützlich sein?",
                    "Reagieren Sie auf mindestens ein Argument Ihres Partners.",
                    "Gibt es einen Kompromiss? Machen Sie einen Vorschlag."
                ]),
            teil3: problem(
                "Ein Freund von Ihnen ist ständig am Handy und vernachlässigt Studium und Familie. Überlegen Sie gemeinsam, wie Sie ihm helfen können.",
                [
                    "Wie sprechen Sie ihn an, ohne ihn zu verletzen?",
                    "Welche konkreten Regeln könnten ihm helfen?",
                    "Welche Alternativen zur Handyzeit schlagen Sie ihm vor?",
                    "Wer von Ihnen beiden spricht mit ihm – und wann?",
                    "Was machen Sie, wenn sich nichts ändert?"
                ])
        },

        "umweltschutz": {
            teil2: diskussion(
                "Plastiktüten und Einwegverpackungen sollten überall verboten werden.",
                [
                    "Sagen Sie klar, ob Sie zustimmen oder nicht – und warum.",
                    "Was bedeutet ein Verbot für normale Familien?",
                    "Was bedeutet es für kleine Geschäfte?",
                    "Reagieren Sie auf mindestens ein Argument Ihres Partners.",
                    "Wer sollte handeln: der Staat, die Firmen oder jeder Einzelne?"
                ]),
            teil3: problem(
                "In Ihrem Wohnhaus wird der Müll nicht getrennt. Planen Sie gemeinsam eine Aktion, die das ändert.",
                [
                    "Wie erklären Sie den Nachbarn das Problem?",
                    "Welche Hilfsmittel brauchen Sie (Behälter, Schilder, Infoblatt)?",
                    "Wer spricht mit dem Hausverwalter?",
                    "Wie motivieren Sie Nachbarn, die kein Interesse haben?",
                    "Wann starten Sie und wie kontrollieren Sie das Ergebnis?"
                ])
        },

        "ernaehrung": {
            teil2: diskussion(
                "Ungesunde Lebensmittel sollten höher besteuert werden.",
                [
                    "Sagen Sie klar, ob Sie zustimmen oder nicht – und warum.",
                    "Welche Wirkung hätte eine solche Steuer wirklich?",
                    "Wen würde sie am stärksten treffen?",
                    "Reagieren Sie auf mindestens ein Argument Ihres Partners.",
                    "Welche andere Maßnahme wäre vielleicht besser?"
                ]),
            teil3: problem(
                "Sie organisieren zusammen ein internationales Essen für Ihren Deutschkurs. Planen Sie es gemeinsam.",
                [
                    "Wann und wo findet das Essen statt?",
                    "Wer bringt was mit? Denken Sie an verschiedene Essgewohnheiten.",
                    "Wie viel darf jeder ausgeben?",
                    "Wer kümmert sich um Geschirr und Aufräumen?",
                    "Wie laden Sie den Lehrer und andere Kurse ein?"
                ])
        },

        "stadt-land": {
            teil2: diskussion(
                "Familien mit Kindern sollten lieber auf dem Land wohnen.",
                [
                    "Sagen Sie klar, ob Sie zustimmen oder nicht – und warum.",
                    "Was bietet das Land den Kindern?",
                    "Was bietet die Stadt den Eltern?",
                    "Reagieren Sie auf mindestens ein Argument Ihres Partners.",
                    "Wovon hängt die richtige Entscheidung Ihrer Meinung nach ab?"
                ]),
            teil3: problem(
                "Sie und Ihr Gesprächspartner suchen zusammen eine Wohnung. Einigen Sie sich auf die Kriterien.",
                [
                    "Stadtzentrum oder Randgebiet – was ist wichtiger?",
                    "Wie hoch darf die Miete höchstens sein?",
                    "Welche Verkehrsanbindung brauchen Sie?",
                    "Welche Ausstattung ist Pflicht, welche nur ein Wunsch?",
                    "Wer übernimmt die Suche und wer die Besichtigungen?"
                ])
        },

        "fremdsprachen": {
            teil2: diskussion(
                "Eine Sprache lernt man am besten im Ausland, nicht im Kurs.",
                [
                    "Sagen Sie klar, ob Sie zustimmen oder nicht – und warum.",
                    "Was lernt man im Kurs besser?",
                    "Was lernt man nur im Alltag im Ausland?",
                    "Reagieren Sie auf mindestens ein Argument Ihres Partners.",
                    "Welchen Weg empfehlen Sie einem Anfänger?"
                ]),
            teil3: problem(
                "Ihr Kurs möchte eine Lerngruppe gründen, die sich regelmäßig trifft. Planen Sie sie gemeinsam.",
                [
                    "Wie oft und wie lange treffen Sie sich?",
                    "Online oder in Präsenz – was passt besser?",
                    "Woran arbeiten Sie: Sprechen, Grammatik oder Prüfungstraining?",
                    "Wie sorgen Sie dafür, dass alle wirklich kommen?",
                    "Wer leitet die Gruppe und bereitet das Material vor?"
                ])
        },

        "soziale-netzwerke": {
            teil2: diskussion(
                "Kinder unter 16 Jahren sollten keine sozialen Netzwerke benutzen dürfen.",
                [
                    "Sagen Sie klar, ob Sie zustimmen oder nicht – und warum.",
                    "Welche Gefahren sehen Sie für Kinder?",
                    "Wäre ein Verbot überhaupt kontrollierbar?",
                    "Reagieren Sie auf mindestens ein Argument Ihres Partners.",
                    "Welche Verantwortung haben die Eltern, welche der Staat?"
                ]),
            teil3: problem(
                "Ihre Sprachschule möchte eine Seite in einem sozialen Netzwerk starten. Planen Sie sie gemeinsam.",
                [
                    "Welches Netzwerk wählen Sie und warum?",
                    "Welche Inhalte posten Sie regelmäßig?",
                    "Wer schreibt die Beiträge und wer antwortet auf Kommentare?",
                    "Wie gehen Sie mit negativen Kommentaren um?",
                    "Woran erkennen Sie nach drei Monaten, ob es funktioniert hat?"
                ])
        },

        "beruf-familie": {
            teil2: diskussion(
                "Eltern von kleinen Kindern sollten nur in Teilzeit arbeiten.",
                [
                    "Sagen Sie klar, ob Sie zustimmen oder nicht – und warum.",
                    "Welche Folgen hat Teilzeit für das Einkommen und die Karriere?",
                    "Welche Folgen hat Vollzeit für die Kinder?",
                    "Reagieren Sie auf mindestens ein Argument Ihres Partners.",
                    "Was könnten Arbeitgeber konkret verbessern?"
                ]),
            teil3: problem(
                "In Ihrer Firma sollen die Arbeitszeiten familienfreundlicher werden. Erarbeiten Sie gemeinsam einen Vorschlag für die Chefin.",
                [
                    "Welche Arbeitszeiten schlagen Sie vor?",
                    "Wie bleibt die Firma trotzdem für Kunden erreichbar?",
                    "Welche Regeln brauchen Sie für Homeoffice?",
                    "Wie reagieren Sie auf Kollegen ohne Kinder, die sich benachteiligt fühlen?",
                    "Wie stellen Sie den Vorschlag vor: schriftlich oder im Meeting?"
                ])
        },

        "online-shopping": {
            teil2: diskussion(
                "Das Einkaufen im Internet ruiniert die kleinen Geschäfte in den Städten.",
                [
                    "Sagen Sie klar, ob Sie zustimmen oder nicht – und warum.",
                    "Was verlieren die Innenstädte konkret?",
                    "Welche Vorteile hat der Online-Handel für die Kunden?",
                    "Reagieren Sie auf mindestens ein Argument Ihres Partners.",
                    "Wie könnten kleine Geschäfte trotzdem überleben?"
                ]),
            teil3: problem(
                "Sie bestellen gemeinsam Material für ein Kursprojekt im Internet. Einigen Sie sich auf das Vorgehen.",
                [
                    "Was brauchen Sie genau und in welcher Menge?",
                    "Welcher Anbieter: billig und langsam oder teurer und schnell?",
                    "Wie viel Geld steht Ihnen zur Verfügung?",
                    "An welche Adresse wird geliefert und wer nimmt an?",
                    "Was machen Sie, wenn die Ware beschädigt ankommt?"
                ])
        },

        "verkehr": {
            teil2: diskussion(
                "In den Innenstädten sollte es gar keine Autos mehr geben.",
                [
                    "Sagen Sie klar, ob Sie zustimmen oder nicht – und warum.",
                    "Welche Vorteile hätte eine autofreie Innenstadt?",
                    "Wer hätte dadurch Probleme (Handwerker, ältere Menschen, Geschäfte)?",
                    "Reagieren Sie auf mindestens ein Argument Ihres Partners.",
                    "Welche Bedingungen müssten vorher erfüllt sein?"
                ]),
            teil3: problem(
                "Ihr Kurs macht einen Ausflug in eine andere Stadt. Planen Sie gemeinsam die Anreise.",
                [
                    "Zug, Bus oder Fahrgemeinschaften – was wählen Sie?",
                    "Wann fahren Sie los und wann sind Sie zurück?",
                    "Was kostet es pro Person?",
                    "Wie organisieren Sie die Tickets?",
                    "Was ist Ihr Plan B, wenn ein Zug ausfällt?"
                ])
        },

        "ehrenamt": {
            teil2: diskussion(
                "Jeder junge Mensch sollte ein Jahr lang ehrenamtlich arbeiten müssen.",
                [
                    "Sagen Sie klar, ob Sie zustimmen oder nicht – und warum.",
                    "Was lernen junge Menschen dabei?",
                    "Ist eine Pflicht noch ein Ehrenamt? Begründen Sie.",
                    "Reagieren Sie auf mindestens ein Argument Ihres Partners.",
                    "Wie könnte man freiwilliges Engagement attraktiver machen?"
                ]),
            teil3: problem(
                "Ihr Verein sucht neue freiwillige Helfer. Planen Sie gemeinsam eine Werbeaktion.",
                [
                    "Wen wollen Sie ansprechen: Studenten, Rentner, Familien?",
                    "Welche Aufgaben bieten Sie den neuen Helfern an?",
                    "Wo und wie werben Sie?",
                    "Was bieten Sie als Dank an, wenn es kein Geld gibt?",
                    "Wer betreut die neuen Helfer am Anfang?"
                ])
        },

        "werbung": {
            teil2: diskussion(
                "Werbung für Kinder sollte im Fernsehen und im Internet verboten werden.",
                [
                    "Sagen Sie klar, ob Sie zustimmen oder nicht – und warum.",
                    "Warum ist Werbung für Kinder besonders wirksam?",
                    "Welche Folgen hätte ein Verbot für die Sender?",
                    "Reagieren Sie auf mindestens ein Argument Ihres Partners.",
                    "Welche Rolle spielen die Eltern dabei?"
                ]),
            teil3: problem(
                "Sie sollen zusammen eine kleine Werbeaktion für Ihre Sprachschule planen.",
                [
                    "Welche Zielgruppe sprechen Sie an?",
                    "Welches Argument stellen Sie in den Mittelpunkt?",
                    "Plakat, Video oder Flyer – wofür entscheiden Sie sich?",
                    "Wie viel Budget brauchen Sie ungefähr?",
                    "Wie messen Sie, ob die Aktion erfolgreich war?"
                ])
        },

        "bildung": {
            teil2: diskussion(
                "Noten in der Schule schaden mehr, als sie nützen.",
                [
                    "Sagen Sie klar, ob Sie zustimmen oder nicht – und warum.",
                    "Was bewirken Noten bei schwachen Schülern?",
                    "Wie könnte man Leistung sonst bewerten?",
                    "Reagieren Sie auf mindestens ein Argument Ihres Partners.",
                    "Was würden Lehrer und Eltern dazu sagen?"
                ]),
            teil3: problem(
                "Ihre Schule bekommt Geld für ein neues Projekt. Einigen Sie sich gemeinsam, wofür es ausgegeben wird.",
                [
                    "Welche Möglichkeiten kommen infrage (Computer, Bibliothek, Sportplatz)?",
                    "Welche Gruppe profitiert am meisten davon?",
                    "Was ist dringend und was kann warten?",
                    "Wer entscheidet am Ende: Lehrer, Schüler oder beide?",
                    "Wie informieren Sie alle über die Entscheidung?"
                ])
        },

        "reisen": {
            teil2: diskussion(
                "Der Massentourismus zerstört die schönsten Orte der Welt.",
                [
                    "Sagen Sie klar, ob Sie zustimmen oder nicht – und warum.",
                    "Welche Schäden entstehen für Natur und Einwohner?",
                    "Was bringt der Tourismus der lokalen Wirtschaft?",
                    "Reagieren Sie auf mindestens ein Argument Ihres Partners.",
                    "Wie könnte man verantwortungsvoll reisen?"
                ]),
            teil3: problem(
                "Sie planen zusammen eine Wochenendreise für Ihre Lerngruppe.",
                [
                    "Welches Ziel wählen Sie und warum?",
                    "Wie reisen Sie hin und wo übernachten Sie?",
                    "Wie hoch darf der Preis pro Person sein?",
                    "Welches Programm bieten Sie an: Kultur, Natur oder Freizeit?",
                    "Wer kümmert sich um die Buchung?"
                ])
        },

        "medien": {
            teil2: diskussion(
                "Nachrichten im Internet sind weniger zuverlässig als im Fernsehen.",
                [
                    "Sagen Sie klar, ob Sie zustimmen oder nicht – und warum.",
                    "Woran erkennt man eine seriöse Quelle?",
                    "Welche Vorteile hat das Internet bei aktuellen Ereignissen?",
                    "Reagieren Sie auf mindestens ein Argument Ihres Partners.",
                    "Wie schützt man sich vor Falschmeldungen?"
                ]),
            teil3: problem(
                "Ihr Kurs möchte einen kleinen Podcast auf Deutsch produzieren. Planen Sie ihn gemeinsam.",
                [
                    "Welches Thema und welche Länge?",
                    "Wer moderiert und wer schneidet?",
                    "Welche Technik brauchen Sie mindestens?",
                    "Wie oft erscheint eine neue Folge?",
                    "Wo veröffentlichen Sie den Podcast?"
                ])
        },

        "haustiere": {
            teil2: diskussion(
                "In einer kleinen Stadtwohnung sollte man keinen Hund halten.",
                [
                    "Sagen Sie klar, ob Sie zustimmen oder nicht – und warum.",
                    "Was braucht ein Hund wirklich jeden Tag?",
                    "Was bedeutet ein Haustier für einsame Menschen?",
                    "Reagieren Sie auf mindestens ein Argument Ihres Partners.",
                    "Unter welchen Bedingungen wäre es doch möglich?"
                ]),
            teil3: problem(
                "Ihre Nachbarin muss für vier Wochen ins Krankenhaus und ihre Katze braucht Betreuung. Finden Sie gemeinsam eine Lösung.",
                [
                    "Wer kann die Katze nehmen und wie lange?",
                    "Wie teilen Sie die Aufgaben auf?",
                    "Was kostet das Futter und wer bezahlt?",
                    "Was machen Sie, wenn die Katze krank wird?",
                    "Wie informieren Sie die Nachbarin über alles?"
                ])
        },

        "gleichberechtigung": {
            teil2: diskussion(
                "In Führungspositionen sollte es eine feste Quote für Frauen geben.",
                [
                    "Sagen Sie klar, ob Sie zustimmen oder nicht – und warum.",
                    "Welches Problem soll eine Quote lösen?",
                    "Welche Nachteile kann eine Quote haben?",
                    "Reagieren Sie auf mindestens ein Argument Ihres Partners.",
                    "Welche andere Maßnahme wäre wirksamer?"
                ]),
            teil3: problem(
                "Ihre Firma möchte mehr Frauen für technische Berufe gewinnen. Erarbeiten Sie gemeinsam einen Plan.",
                [
                    "Wo und wie sprechen Sie Bewerberinnen an?",
                    "Was müsste sich im Arbeitsalltag ändern?",
                    "Welche Rolle spielen Praktika und Schulbesuche?",
                    "Wie überzeugen Sie skeptische Kollegen?",
                    "Woran messen Sie den Erfolg nach einem Jahr?"
                ])
        },

        "leben-im-ausland": {
            teil2: diskussion(
                "Wer im Ausland lebt, sollte sich vollständig an die neue Kultur anpassen.",
                [
                    "Sagen Sie klar, ob Sie zustimmen oder nicht – und warum.",
                    "Was bedeutet »Anpassung« für Sie konkret?",
                    "Was sollte man von der eigenen Kultur behalten?",
                    "Reagieren Sie auf mindestens ein Argument Ihres Partners.",
                    "Welche Verantwortung hat die aufnehmende Gesellschaft?"
                ]),
            teil3: problem(
                "Ein neuer Kursteilnehmer ist gerade angekommen und kennt niemanden. Planen Sie gemeinsam, wie Sie ihm den Anfang erleichtern.",
                [
                    "Welche Informationen braucht er in der ersten Woche?",
                    "Bei welchen Behördengängen können Sie helfen?",
                    "Wie machen Sie ihn mit den anderen bekannt?",
                    "Wer übernimmt was und wann?",
                    "Wie vermeiden Sie, dass er sich bevormundet fühlt?"
                ])
        },

        "homeoffice": {
            teil2: diskussion(
                "Wer von zu Hause arbeitet, arbeitet weniger konzentriert.",
                [
                    "Sagen Sie klar, ob Sie zustimmen oder nicht – und warum.",
                    "Welche Ablenkungen gibt es zu Hause?",
                    "Was funktioniert zu Hause sogar besser als im Büro?",
                    "Reagieren Sie auf mindestens ein Argument Ihres Partners.",
                    "Welche Regeln helfen beim Arbeiten zu Hause?"
                ]),
            teil3: problem(
                "Ihr Team arbeitet je zur Hälfte im Büro und zu Hause. Einigen Sie sich gemeinsam auf klare Regeln.",
                [
                    "An welchen Tagen sind alle im Büro?",
                    "Wie sind die Erreichbarkeitszeiten geregelt?",
                    "Wie laufen Besprechungen, wenn nicht alle da sind?",
                    "Wer stellt die Technik für zu Hause?",
                    "Wie lösen Sie Konflikte, wenn sich jemand nicht an die Regeln hält?"
                ])
        },

        "stress-freizeit": {
            teil2: diskussion(
                "Erwachsene brauchen mehr Urlaubstage als heute üblich.",
                [
                    "Sagen Sie klar, ob Sie zustimmen oder nicht – und warum.",
                    "Welche Folgen hat Dauerstress für die Gesundheit?",
                    "Was bedeuten mehr Urlaubstage für die Firmen?",
                    "Reagieren Sie auf mindestens ein Argument Ihres Partners.",
                    "Was kann jeder selbst gegen Stress tun?"
                ]),
            teil3: problem(
                "Ihre Kollegen sind überlastet. Erarbeiten Sie gemeinsam drei Vorschläge für die Chefin.",
                [
                    "Woran liegt die Überlastung konkret?",
                    "Welche Aufgaben könnte man streichen oder verteilen?",
                    "Braucht es mehr Personal oder bessere Organisation?",
                    "Welcher Vorschlag ist sofort umsetzbar?",
                    "Wer trägt die Vorschläge vor und wann?"
                ])
        }
    };
})();
