'use client';

import { useEffect } from 'react';

/**
 * SwRegister — registers the hand-rolled service worker in `public/sw.js`.
 *
 * Only runs in production. Dev keeps no SW so HMR / cache-busting aren't fought.
 * Failures are silenced (logged to console) so the app still paints if the
 * browser blocks registration (private mode, third-party cookies off, etc.).
 */
export function SwRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    const onLoad = () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/', updateViaCache: 'none' })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.warn('[sw] registration failed', err);
        });
    };

    if (document.readyState === 'complete') {
      onLoad();
    } else {
      window.addEventListener('load', onLoad, { once: true });
      return () => window.removeEventListener('load', onLoad);
    }
  }, []);

  return null;
}
