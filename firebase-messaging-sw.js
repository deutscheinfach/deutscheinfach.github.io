/* ===== Service Worker ديال الإشعارات =====

   هاد الملف خاصو يبقى ف جذر الموقع بهاد الاسم بالضبط —
   Firebase Messaging كيقلب عليه هكا.

   دورو: يستقبل الإشعار حتى ملي تكون الصفحة مسدودة،
   ويبين "مكالمة واردة" ف النظام. */

importScripts(
    "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts(
    "https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyDHMmaHLYRRHfdRDj-hf7s5LOqeWPTiOxU",
    authDomain: "deutsch-einfach-4c81f.firebaseapp.com",
    projectId: "deutsch-einfach-4c81f",
    storageBucket: "deutsch-einfach-4c81f.firebasestorage.app",
    messagingSenderId: "152448766933",
    appId: "1:152448766933:web:f7824c4db8ab3caccbe35c"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    const data = payload.data || {};
    const isCall = data.kind === "call";

    self.registration.showNotification(
        isCall
            ? (data.callType === "video" ? "📹 مكالمة فيديو" : "📞 مكالمة واردة")
            : (data.title || "Deutsch Einfach"),
        {
            body: isCall
                ? (data.fromName || "صديق") + " كيعيط ليك"
                : (data.body || ""),
            icon: "icon1.png",
            badge: "icon1.png",
            tag: isCall ? "de-call" : "de-msg",
            renotify: true,
            requireInteraction: isCall,
            /* الهزاز ديال الأندرويد كيخدم من هنا حتى والموقع مسدود */
            vibrate: isCall ? [400, 200, 400, 200, 400] : [200],
            data: { url: data.url || "chat.html" }
        }
    );
});

/* برك على الإشعار → كيحل الشات، وإلا كان محلول كيجيبو لقدام */
self.addEventListener("notificationclick", function (event) {
    event.notification.close();

    const target = (event.notification.data && event.notification.data.url) || "chat.html";

    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true })
            .then(function (list) {
                for (const client of list) {
                    if (client.url.includes("chat.html") && "focus" in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) return clients.openWindow(target);
            })
    );
});
