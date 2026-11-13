self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        const responseClone = response.clone();

        if (response.ok) {
          caches.open("2d3d-cache-v1").then((cache) => {
            cache.put(event.request, responseClone);
          });
        }

        return response;
      });
    }),
  );
});
