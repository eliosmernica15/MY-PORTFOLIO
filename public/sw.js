// Hand-rolled service worker for the Elios Mernica portfolio.
// Strategies:
//   - Network-first for EVERYTHING; no caching of HTML. HTML carries a
//     per-request CSP nonce, so caching it would replay stale nonce'd
//     markup. Only the offline page may be precached, never a page response.
//   - Cache-first exception: content-hashed _next/static assets only.
//   - Offline fallback: /offline (precached).
// Bump CACHE_VERSION on any strategy change; activate purges old caches.
const CACHE_VERSION = "v3";
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

  // Never cache API routes.
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

  // Network-first for navigations. On failure, fall back to the precached
  // offline page. HTML is NEVER cached (nonce-safe).
  if (
    req.mode === "navigate" ||
    req.headers.get("accept")?.includes("text/html")
  ) {
    event.respondWith(fetch(req).catch(() => caches.match("/offline")));
    return;
  }

  // Network-first for everything else; no cache fallback for non-HTML assets.
  event.respondWith(fetch(req));
});
