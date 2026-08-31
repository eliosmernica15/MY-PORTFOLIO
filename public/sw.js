// Hand-rolled service worker for the Elios Mernica portfolio.
// Strategy:
//   - Cache-first for hashed _next/static assets and images
//   - Stale-while-revalidate for HTML navigations
//   - Network-first for everything else
//   - Offline fallback at /offline
const CACHE = 'elios-portfolio-v1';
const PRECACHE = ['/', '/offline'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  // Cache-first for hashed static assets and images
  if (
    sameOrigin &&
    (url.pathname.startsWith('/_next/static/') ||
      url.pathname.startsWith('/_next/image') ||
      /\.(?:png|jpg|jpeg|svg|webp|avif|ico|woff2?)$/i.test(url.pathname))
  ) {
    event.respondWith(
      caches.match(req).then(
        (cached) =>
          cached ||
          fetch(req).then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
            return res;
          })
      )
    );
    return;
  }

  // Stale-while-revalidate for HTML navigations
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() =>
          caches.match(req).then((cached) => cached || caches.match('/offline'))
        )
    );
    return;
  }

  // Network-first for everything else
  if (sameOrigin) {
    event.respondWith(
      fetch(req).catch(() => caches.match(req))
    );
  }
});
