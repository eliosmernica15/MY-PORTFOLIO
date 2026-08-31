'use client';
import { useEffect } from 'react';

export function useDocumentMeta(opts: { title?: string; description?: string; canonical?: string }) {
  useEffect(() => {
    if (opts.title) document.title = opts.title;
    if (opts.description) {
      let el = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.name = 'description';
        document.head.appendChild(el);
      }
      el.content = opts.description;
    }
    if (opts.canonical) {
      let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement('link');
        el.rel = 'canonical';
        document.head.appendChild(el);
      }
      el.href = opts.canonical;
    }
  }, [opts.title, opts.description, opts.canonical]);
}
