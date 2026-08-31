'use client';
import { useEffect, useRef } from 'react';

export function useFocusTrap<T extends HTMLElement>(active: boolean) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!active || !ref.current) return;
    const root = ref.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusables = () => Array.from(
      root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => !el.hasAttribute('aria-hidden'));

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const list = focusables();
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };

    root.addEventListener('keydown', onKey);
    // focus the first focusable element
    const t = setTimeout(() => { focusables()[0]?.focus(); }, 0);

    return () => {
      root.removeEventListener('keydown', onKey);
      clearTimeout(t);
      previouslyFocused?.focus?.();
    };
  }, [active]);

  return ref;
}
