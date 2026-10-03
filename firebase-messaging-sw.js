/* ===== Service Worker ديال الإشعارات =====

   هاد الملف خاصو يبقى ف جذر الموقع بهاد الاسم بالضبط —
   Firebase Messaging كيقلب عليه هكا.

   دورو: يستقبل الإشعار حتى ملي تكون الصفحة مسدودة،
   ويبين "مكالمة واردة" ولا التذكير ديال كل نهار.

   وهو حتى الـ service worker ديال التطبيق (assets/app-install.js
   كيسجلو ف كل صفحة): ملي ماكاينش الانترنت كيبين offline.html. */

const OFFLINE_CACHE = "de-offline-v1";
self.addEventListener("install", function (event) {
    event.waitUntil(caches.open(OFFLINE_CACHE).then(function (c) {
        return c.addAll(["offline.html", "assets/icon-192.png"]);
    }));
    self.skipWaiting();
});
self.addEventListener("activate", function (event) {
    event.waitUntil(self.clients.claim());
});
/* غير الصفحات: إلا طاحت الشبكة كنعطيو offline.html. الباقي ماكنقيسوهش. */
self.addEventListener("fetch", function (event) {
    if (event.request.mode !== "navigate") return;
    event.respondWith(fetch(event.request).catch(function () {
        return caches.match("offline.html");
    }));
});

/* Firebase ف try: إلا ماتحملش (بلا انترنت ف أول مرة)، الـ worker
   كيبقى خدام للـ offline والتثبيت. */
let messaging = null;
try {
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

    messaging = firebase.messaging();
} catch (e) { /* بلا إشعارات هاد المرة */ }

if (messaging) messaging.onBackgroundMessage(function (payload) {
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
            icon: "assets/icon-192.png",
            badge: "assets/icon-192.png",
            tag: isCall ? "de-call" : "de-msg",
            renotify: true,
            requireInteraction: isCall,
            /* الهزاز ديال الأندرويد كيخدم من هنا حتى والموقع مسدود */
            vibrate: isCall ? [400, 200, 400, 200, 400] : [200],
            data: { url: data.url || (isCall ? "chat.html" : "index.html") }
        }
    );
});


/* برك على الإشعار → كيحل الشات، وإلا كان محلول كيجيبو لقدام */
self.addEventListener("notificationclick", function (event) {
    event.notification.close();

    const target = (event.notification.data && event.notification.data.url) || "index.html";
    const page = target.split("?")[0];

    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true })
            .then(function (list) {
                for (const client of list) {
                    if (client.url.includes(page) && "focus" in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) return clients.openWindow(target);
            })
    );
});
