// Hand-rolled service worker for the Elios Mernica portfolio.
// Strategies:
//   - Network-first with cache fallback for HTML navigations (falls back to /offline).
//     HTML is NOT precached: it carries a per-request CSP nonce, so caching it
//     would serve stale (and unusable) markup.
//   - Cache-first for hashed _next/static assets (content-addressed, safe forever).
//   - No caching for /api/* or anything else.
// Bump CACHE_VERSION on any strategy change; the activate handler purges old versions.
const CACHE_VERSION = "v2";
const CACHE = `elios-portfolio-${CACHE_VERSION}`;
const PRECACHE = ["/offline"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .catch(() => {}),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  // Never cache API routes or non-GET traffic.
  if (url.pathname.startsWith("/api/")) return;

  // Cache-first for hashed Next.js static assets (content-hashed filenames).
  if (
    sameOrigin &&
    (url.pathname.startsWith("/_next/static/") ||
      url.pathname.startsWith("/_next/image") ||
      /\.(?:png|jpg|jpeg|svg|webp|avif|ico|woff2?)$/i.test(url.pathname))
  ) {
    event.respondWith(
      caches.match(req).then(
        (cached) =>
          cached ||
          fetch(req).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches
                .open(CACHE)
                .then((c) => c.put(req, copy))
                .catch(() => {});
            }
            return res;
          }),
      ),
    );
    return;
  }

  // Network-first for HTML navigations; fall back to cache, then /offline.
  if (
    req.mode === "navigate" ||
    req.headers.get("accept")?.includes("text/html")
  ) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches
              .open(CACHE)
              .then((c) => c.put(req, copy))
              .catch(() => {});
          }
          return res;
        })
        .catch(() =>
          caches
            .match(req)
            .then((cached) => cached || caches.match("/offline")),
        ),
    );
    return;
  }

  // Network-first for everything else; fall back to cache (no /offline for non-HTML).
  if (sameOrigin) {
    event.respondWith(fetch(req).catch(() => caches.match(req)));
  }
});
