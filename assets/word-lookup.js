/* ===== البحث عن كلمة ألمانية ف القاموس =====

   كيقبل كلمة كيف ما كتبانة ف النص (Verträge، kündigte، gearbeitet…)
   وكيرجع المعنى ديال الأصل ديالها (der Vertrag، kündigen، arbeiten).

   القاموس ماشي فيه الجمع ولا التصريف، إذن كنجربو الأشكال الممكنة:
   الجمع والتأنيث (-e، -en، -er، -n، -nen)، أنوميلوط الجمع (Väter ← Vater)،
   الأفعال (-t، -st، -te، -ten) والـPartizip (ge…t، aufgeräumt).
   الأفعال الشاذة (ging، ist، hat…) كيجيو من word-core.js (forms).

   الدقة أهم من التغطية: معنى غالط أسوأ من «ما لقيتهاش». إذن كنقبلو غير
   الشكل اللي كيطابق كلمة ف القاموس بالضبط.

   الكلمات الصغار (حروف الجر، الضمائر، الأرقام) كتطابق غير بالشكل بالضبط:
   بلا هادشي، «nichts» كتولي «nicht» و«male» كتولي «mal».

   window.DE_LOOKUP.build(entries, irregular, closed)
       entries   = [{ de, ar }] — الأول كيربح
       irregular = { شكل: أصل }
       closed    = [{ de, ar }] — مطابقة بالضبط غير
   window.DE_LOOKUP.find("Verträge") → { de, ar, form, via } ولا null */

(function () {
    "use strict";

    const ARTICLE = /^(der|die|das)\s+/i;
    const PREP = /^(um|auf|an|für|von|mit|über|nach|zu|vor|in|bei|aus|gegen|unter|durch|zwischen)$/;

    /* بادئات الأفعال المنفصلة: angekommen، aufgeräumt، mitgemacht */
    const SEPARABLE = ["zurück", "zusammen", "vorbei", "weiter", "wieder", "statt", "fest",
        "teil", "hoch", "frei", "los", "weg", "her", "hin", "an", "auf", "aus", "ab",
        "bei", "ein", "mit", "nach", "vor", "zu"];

    let exact = new Map();    /* الأصل ← مدخل */
    let nouns = new Map();    /* الاسم بلا أنوميلوط ← مدخل (Väter ← Vater) */
    let forms = new Map();    /* شكل شاذ ← الأصل (ging ← gehen) */

    function fold(s) {
        return s.replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/ß/g, "ss");
    }

    /* "sich bewerben um + Akk." → bewerben | "die Arbeitsstelle" → arbeitsstelle.
       عبارة بجوج كلمات (krankgeschrieben sein) ما كندخلوهاش: ما كتفهمش
       بكلمة وحدة. غير فعل + حرف جر (bewerben um) كنخدمو بالفعل. */
    function head(raw) {
        let s = String(raw)
            .replace(/\s*\+\s*(Akk|Dat|Gen)\.?(\s*\/\s*(Akk|Dat|Gen)\.?)?/g, "")
            .replace(/\(.*?\)/g, "")
            .replace(/…/g, "")
            .replace(/^sich\s+/i, "")
            .trim();
        const article = ARTICLE.test(s);
        s = s.replace(ARTICLE, "").replace(/,.*$/, "").trim();

        const tokens = s.split(/\s+/);
        if (tokens.length > 1) {
            if (article || !/(en|ern|eln)$/.test(tokens[0]) || !PREP.test(tokens[1])) return null;
        }
        if (!/^[A-Za-zÄÖÜäöüß-]+$/.test(tokens[0])) return null;
        return { word: tokens[0].toLowerCase(), noun: article };
    }

    function build(entries, irregular, closed) {
        exact = new Map();
        nouns = new Map();
        forms = new Map();

        const add = function (entry, fixed) {
            if (!entry || !entry.de || !entry.ar) return;
            const h = head(entry.de);
            if (!h || exact.has(h.word)) return;
            const item = { de: String(entry.de), ar: String(entry.ar), fixed: !!fixed };
            exact.set(h.word, item);
            if (h.noun && !nouns.has(fold(h.word))) nouns.set(fold(h.word), item);
        };

        (entries || []).forEach(function (entry) { add(entry, false); });
        (closed || []).forEach(function (entry) { add(entry, true); });

        Object.keys(irregular || {}).forEach(function (form) {
            forms.set(form.toLowerCase(), String(irregular[form]).toLowerCase());
        });
    }

    /* الجمع، الإعراب ديال الصفات، التأنيث */
    function nounish(w) {
        const out = [];
        ["nen", "ern", "en", "er", "es", "em", "e", "n", "s"].forEach(function (end) {
            if (w.length - end.length < 3 || !w.endsWith(end)) return;
            const stem = w.slice(0, -end.length);
            out.push(stem);
            if (end === "nen") out.push(stem + "n");     /* Lehrerinnen ← Lehrerin */
        });
        return out;
    }

    /* تصريف الأفعال: كنرجعو للمصدر */
    function verbish(w) {
        const out = [];
        const add = function (stem) {
            if (stem.length < 2) return;
            out.push(stem + "en", stem + "n");
            /* sammle ← sammeln، wandre ← wandern */
            if (/[^aeiouäöü][lr]$/.test(stem)) out.push(stem.slice(0, -1) + "e" + stem.slice(-1) + "n");
        };

        ["test", "tet", "ten", "est", "te", "st", "et", "t", "e"].forEach(function (end) {
            if (w.length - end.length >= 2 && w.endsWith(end)) add(w.slice(0, -end.length));
        });

        /* Partizip II: gemacht، gearbeitet، angerufen ← anrufen */
        const part = function (rest, prefix) {
            if (!/^ge/.test(rest)) return;
            const core = rest.slice(2);
            if (/(et|t)$/.test(core)) {
                const stem = core.replace(/et$|t$/, "");
                if (stem.length >= 2) out.push(prefix + stem + "en", prefix + stem + "n");
            }
        };
        part(w, "");
        SEPARABLE.forEach(function (p) {
            if (w.startsWith(p + "ge")) part(w.slice(p.length), p);
        });

        return out;
    }

    function find(word) {
        if (!exact.size || typeof word !== "string") return null;
        const raw = word.replace(/^[^A-Za-zÄÖÜäöüß]+|[^A-Za-zÄÖÜäöüß]+$/g, "");
        if (raw.length < 2 || !/^[A-Za-zÄÖÜäöüß]+(-[A-Za-zÄÖÜäöüß]+)*$/.test(raw)) return null;

        const w = raw.toLowerCase();
        const capital = raw[0] !== w[0];

        const hit = function (key, via) {
            const item = exact.get(key);
            if (!item || (item.fixed && via === "derived")) return null;
            return { de: item.de, ar: item.ar, form: raw, via: via };
        };

        let found = hit(w, "exact");
        if (found) return found;

        if (forms.has(w)) {
            found = hit(forms.get(w), "irregular");
            if (found) return found;
        }

        /* الأسماء كتبدا بحرف كبير: الاسم قبل، والفعل قبل ف الباقي */
        const groups = capital ? [nounish(w), verbish(w)] : [verbish(w), nounish(w)];
        for (let g = 0; g < groups.length; g++) {
            for (let i = 0; i < groups[g].length; i++) {
                if (groups[g][i].length < 3) continue;
                found = hit(groups[g][i], "derived");
                if (found) return found;
            }
        }

        /* Väter ← Vater، Städte ← Stadt: الأسماء غير */
        if (capital) {
            const folded = [fold(w)].concat(nounish(w).map(fold));
            for (let i = 0; i < folded.length; i++) {
                const item = nouns.get(folded[i]);
                if (item && folded[i].length >= 3) return { de: item.de, ar: item.ar, form: raw, via: "umlaut" };
            }
        }

        return null;
    }

    window.DE_LOOKUP = { build: build, find: find, size: function () { return exact.size; } };
})();
