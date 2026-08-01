const CACHE_NAME = "certifyquiz-v2";

const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([OFFLINE_URL]);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then((cached) => {
        if (cached) return cached;

        return caches.match(OFFLINE_URL).then((offlinePage) => {
          return (
            offlinePage ||
            new Response("Offline", {
              status: 503,
              headers: { "Content-Type": "text/plain" },
            })
          );
        });
      });
    })
  );
});

function safeNotificationUrl(value) {
  try {
    const target = new URL(typeof value === "string" ? value : "/", self.location.origin);
    return target.origin === self.location.origin ? target.href : self.location.origin;
  } catch (_) { return self.location.origin; }
}

self.addEventListener("push", (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (_) { data = {}; }
  const title = typeof data.title === "string" ? data.title : "CertifyQuiz";
  const options = {
    body: typeof data.body === "string" ? data.body : "Hai un nuovo aggiornamento.",
    icon: typeof data.icon === "string" ? data.icon : "/icons/icon-192.png",
    badge: typeof data.badge === "string" ? data.badge : "/icons/icon-192.png",
    image: typeof data.image === "string" ? data.image : undefined,
    tag: typeof data.tag === "string" ? data.tag : undefined,
    data: { url: safeNotificationUrl(data.url), notificationId: Number(data.notificationId) || null },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = safeNotificationUrl(event.notification.data?.url);
  const notificationId = event.notification.data?.notificationId;
  event.waitUntil(Promise.all([
    notificationId ? fetch("/api/backend/push/click", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ notificationId }), keepalive: true }).catch(() => undefined) : Promise.resolve(),
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(async (clients) => {
      for (const client of clients) { if (new URL(client.url).origin === self.location.origin) { await client.navigate(target); return client.focus(); } }
      return self.clients.openWindow(target);
    }),
  ]));
});

self.addEventListener("notificationclose", (event) => { event.waitUntil(Promise.resolve()); });
