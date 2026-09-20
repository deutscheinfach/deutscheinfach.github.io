/* ===== محتوى امتحانات Lesen B2 =====

   مرتب حسب الموضوع، ومن بعد حسب الجزء:

     LESEN_B2_CONTENT["kaffee"]["teil1"] = { … }

   المفاتيح ديال الأجزاء: teil1 · teil2 · teil3 · sprach1 · sprach2
   الموضوع ماشي مجبور يكون عندو گاع الأجزاء — الصفحة كتبين
   غير اللي كاينين.

   شكل الجزء (نفس اللي كيفهمو assets/lesen-engine.js):

   "teil1" (ترويسات):
     {
       title: "…",
       kind: "matching",
       intro: "…",
       texts:   [ { label: "a", body: "…" }, … ],
       options: [ { value: "1", text: "…" }, … ],
       questions: [ { text: "Text a", answer: "3" }, … ]
     }

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
*/

window.LESEN_B2_CONTENT = {
};
