/* ===== حساب واحد = جهاز واحد =====

   ملي كيدخل شي واحد بالحساب ديالو، كنكتبو sessionId جديد ف
   users/{uid}. كل جهاز آخر واقف فنفس الحساب كيشوف التبديل
   مباشرة (onSnapshot) وكيخرج بوحدو.

   قبل، هاد الفحص كان غير ف dashboard.html و index.html، إذن
   شي واحد واقف ف chat ولا ف شي تمرين كان كيبقى داخل على طول.
   هاد الملف كيتزاد ف كل الصفحات المحمية.

   ملاحظة: إلا ماكانش sessionId محلي (مثلا مستخدم دخل قبل ما
   نزيدو هاد الخاصية، ولا التخزين مسدود)، ماكنخرجوش حتى واحد —
   ماعندناش باش نتأكدو، والخروج بلا سبب أسوأ. */

(function () {
    "use strict";

    var SESSION_KEY = "deutschEinfachSessionId";
    var LOGIN_PAGE = "login.html";

    /* الصفحات اللي خاصها تبقى بلا حارس: الدخول والتسجيل. */
    var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    if (page === "login.html" || page === "signup.html" || page === "forgot-password.html") {
        return;
    }

    function readSessionId() {
        try {
            return localStorage.getItem(SESSION_KEY);
        } catch (error) {
            return null;
        }
    }

    function clearSessionId() {
        try {
            localStorage.removeItem(SESSION_KEY);
        } catch (error) {
            /* التصفح الخاص: ماشي مشكل */
        }
    }

    var mySessionId = readSessionId();
    if (!mySessionId) return;

    (async function () {
        try {
            var appMod = await import("https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js");
            var authMod = await import("https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js");
            var fsMod = await import("https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js");

            /* الصفحة يمكن تكون ديجا دارت initializeApp. إلا عاودنا،
               Firebase كيرمي خطأ، إذن كنعاودو نستعملو اللي كاين. */
            var app = appMod.getApps().length
                ? appMod.getApp()
                : appMod.initializeApp({
                      apiKey: "AIzaSyDHMmaHLYRRHfdRDj-hf7s5LOqeWPTiOxU",
                      authDomain: "deutsch-einfach-4c81f.firebaseapp.com",
                      projectId: "deutsch-einfach-4c81f",
                      storageBucket: "deutsch-einfach-4c81f.firebasestorage.app",
                      messagingSenderId: "152448766933",
                      appId: "1:152448766933:web:f7824c4db8ab3caccbe35c",
                      measurementId: "G-9QV234Z0KZ"
                  });

            var auth = authMod.getAuth(app);
            var db = fsMod.getFirestore(app);
            var stop = null;

            authMod.onAuthStateChanged(auth, function (user) {
                if (stop) {
                    stop();
                    stop = null;
                }
                if (!user) return;

                /* الـ id يقدر يكون تبدل ملي كان الـ auth كيتحمل. */
                mySessionId = readSessionId();
                if (!mySessionId) return;

                stop = fsMod.onSnapshot(
                    fsMod.doc(db, "users", user.uid),
                    async function (snapshot) {
                        if (!snapshot.exists()) return;

                        var otherSessionId = snapshot.data().sessionId;
                        if (!otherSessionId || otherSessionId === mySessionId) return;

                        if (stop) {
                            stop();
                            stop = null;
                        }
                        clearSessionId();

                        try {
                            await authMod.signOut(auth);
                        } catch (error) {
                            console.error("Auto logout error:", error);
                        }

                        alert(
                            "تم تسجيل الدخول من جهاز آخر.\n\n" +
                            "تم تسجيل خروج هذا الجهاز تلقائياً."
                        );
                        location.replace(LOGIN_PAGE);
                    },
                    function (error) {
                        console.error("Session guard listener error:", error);
                    }
                );
            });
        } catch (error) {
            console.error("Session guard load error:", error);
        }
    })();
})();
