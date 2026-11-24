const CACHE_NAME = "certifyquiz-v5";

const OFFLINE_URL = "/offline.html";

// One bounded retry for page NAVIGATIONS only. It runs when the first attempt fails fast
// (DNS, reset, handshake: nothing hung) and the browser still reports online, so a slow
// failure never waits twice and an offline device is not delayed. Non-navigation requests
// (API, chunks, images) are never retried here: callers own their retry/resume logic.
const NAVIGATION_RETRY_DELAY_MS = 350;
const NAVIGATION_RETRY_MAX_FAST_FAIL_MS = 3000;

function fetchNavigation(request) {
  const startedAt = Date.now();
  return fetch(request).catch((error) => {
    const failedFast = Date.now() - startedAt <= NAVIGATION_RETRY_MAX_FAST_FAIL_MS;
    if (!failedFast || self.navigator.onLine === false) throw error;
    return new Promise((resolve) => setTimeout(resolve, NAVIGATION_RETRY_DELAY_MS)).then(() => fetch(request));
  });
}

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
    (event.request.mode === "navigate" ? fetchNavigation(event.request) : fetch(event.request)).catch(() => {
      // An HTML navigation fallback is never an API response or a script.
      // Preserve a transport failure so callers can safely resume/retry.
      if (event.request.mode !== "navigate") {
        return new Response("Service unavailable", {
          status: 503,
          headers: { "Content-Type": "text/plain", "Cache-Control": "no-store" },
        });
      }
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
    renotify: typeof data.tag === "string" && data.tag.length > 0,
    requireInteraction: false,
    timestamp: Date.now(),
    vibrate: [180, 80, 180],
    data: { url: safeNotificationUrl(data.url), notificationId: Number(data.notificationId) || null },
  };
  event.waitUntil(Promise.all([
    self.registration.showNotification(title, options),
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) =>
      Promise.all(clients.map((client) => client.postMessage({ type: "CQ_PUSH_RECEIVED", notificationId: options.data.notificationId })))
    ),
  ]));
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
