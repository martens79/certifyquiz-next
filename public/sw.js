const CACHE_NAME = "certifyquiz-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then((cached) => {
        return cached || new Response("Offline", {
          status: 503,
          headers: { "Content-Type": "text/plain" },
        });
      });
    })
  );
});