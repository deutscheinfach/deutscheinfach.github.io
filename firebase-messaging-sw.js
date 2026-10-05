/* ===== Service Worker ديال الإشعارات =====

   هاد الملف خاصو يبقى ف جذر الموقع بهاد الاسم بالضبط —
   Firebase Messaging كيقلب عليه هكا.

   دورو: يستقبل الإشعار حتى ملي تكون الصفحة مسدودة،
   ويبين "مكالمة واردة" ولا التذكير ديال كل نهار.

   وهو حتى الـ service worker ديال التطبيق (assets/app-install.js
   كيسجلو ف كل صفحة): كيخزن الملفات باش التنقل يكون سريع، وملي
   ماكاينش الانترنت كيبين offline.html. */

const OFFLINE_CACHE = "de-offline-v1";
const ASSET_CACHE = "de-assets-v1";
const PAGE_CACHE = "de-pages-v1";

self.addEventListener("install", function (event) {
    event.waitUntil(caches.open(OFFLINE_CACHE).then(function (c) {
        return c.addAll(["offline.html", "assets/icon-192.png"]);
    }));
    self.skipWaiting();
});
self.addEventListener("activate", function (event) {
    event.waitUntil(self.clients.claim());
});

/* ===== السرعة: التنقل بين Lesen / Sprechen / Hören / Schreiben =====

   GitHub Pages كيخلي التيليفون يخزن الملفات غير 10 دقايق. من بعد،
   كل صفحة كتسول السيرفر على كل ملف (15-20 ملف) واش تبدل — وهادشي
   هو اللي كيتقل الانتقال ف الأنترنت ديال التيليفون.

   الملفات ديالنا فيهم ?v=… (tools/bump.mjs) — إلا تبدل الملف تبدل
   الرابط. إذن نفس الرابط = نفس المحتوى ديما، ونقدرو نعطيوه من
   الكاش نيشان بلا ما نسولو حتى واحد. نفس الشي لـ Firebase من
   gstatic (النسخة فالرابط) وللخطوط ديال Google.

   الصفحات (HTML) كتجي ديما من الشبكة باش التعديلات تبان دغيا؛
   الكاش غير إلا طاحت الشبكة ولا تعطلات بزاف. */

function isImmutable(url) {
    if (url.origin === self.location.origin) {
        return /\/assets\/.+\.(js|css|png|jpe?g|webp|svg|woff2?)$/.test(url.pathname)
            && /^\?v=[\w.-]+$/.test(url.search);
    }
    if (url.hostname === "fonts.gstatic.com") return true;
    if (url.hostname === "www.gstatic.com") return /^\/firebasejs\/\d/.test(url.pathname);
    return false;
}

/* نسخة جديدة ديال نفس الملف → القديمة ماعندها لاش تبقى */
function prune(cache, url) {
    if (url.origin !== self.location.origin) return;
    cache.keys().then(function (keys) {
        keys.forEach(function (req) {
            const u = new URL(req.url);
            if (u.pathname === url.pathname && u.search !== url.search) cache.delete(req);
        });
    });
}

function cacheFirst(request, url) {
    return caches.open(ASSET_CACHE).then(function (cache) {
        return cache.match(request).then(function (hit) {
            if (hit) return hit;
            return fetch(request).then(function (res) {
                if (res && (res.ok || res.type === "opaque")) {
                    cache.put(request, res.clone());
                    prune(cache, url);
                }
                return res;
            });
        });
    });
}

/* CSS ديال Google Fonts: من الكاش دغيا، ونجددوه من وراه */
function staleWhileRevalidate(request) {
    return caches.open(ASSET_CACHE).then(function (cache) {
        return cache.match(request).then(function (hit) {
            const fresh = fetch(request).then(function (res) {
                if (res && res.ok) cache.put(request, res.clone());
                return res;
            });
            if (hit) { fresh.catch(function () {}); return hit; }
            return fresh;
        });
    });
}

/* الصفحة من الشبكة. إلا طاحت (ولا بقات 4 ثواني بلا جواب) → النسخة
   اللي شفنا آخر مرة، وإلا offline.html. */
function pageFromNetwork(event) {
    const request = event.request;
    /* cache: "no-cache": المتصفح كيخبي HTML ديال GitHub Pages 10 دقايق.
       بلا هادي، تعديل جديد (ثمن، نص…) كان كيبقى ما بانش حتى بعد F5.
       دابا كل صفحة كتسول السيرفر واش تبدلات (304 خفيف إلا لا). */
    const fresh = fetch(request.url, { cache: "no-cache", credentials: "same-origin" })
        .then(function (res) { return res.redirected ? fetch(request) : res; })
        .catch(function () { return fetch(request); });
    const net = fresh.then(function (res) {
        if (res && res.ok && res.type === "basic") {
            const copy = res.clone();
            caches.open(PAGE_CACHE).then(function (c) { c.put(request.url.split("#")[0], copy); });
        }
        return res;
    });
    event.waitUntil(net.catch(function () {}));

    const cached = function () {
        return caches.match(request.url.split("#")[0], { ignoreSearch: true });
    };
    const slow = new Promise(function (resolve) {
        setTimeout(function () {
            cached().then(function (hit) { if (hit) resolve(hit); });
        }, 4000);
    });

    return Promise.race([net, slow]).catch(function () {
        return cached().then(function (hit) { return hit || caches.match("offline.html"); });
    });
}

self.addEventListener("fetch", function (event) {
    const request = event.request;
    if (request.method !== "GET") return;

    if (request.mode === "navigate") {
        event.respondWith(pageFromNetwork(event));
        return;
    }

    let url;
    try { url = new URL(request.url); } catch (e) { return; }

    if (isImmutable(url)) {
        event.respondWith(cacheFirst(request, url).catch(function () { return fetch(request); }));
    } else if (url.hostname === "fonts.googleapis.com") {
        event.respondWith(staleWhileRevalidate(request).catch(function () { return fetch(request); }));
    }
    /* الباقي (Firestore، الصوت، الفيديو، الـ Worker...) كيمشي عادي */
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
