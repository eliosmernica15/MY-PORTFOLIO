"use client";

import { useEffect, useRef } from "react";

/**
 * Restrained scroll parallax: sets `--py` (px) on the referenced element,
 * proportional to how far its center is from the viewport center.
 * rAF-throttled, transform-only, inert under prefers-reduced-motion.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(
  strength = 42,
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = ref.current;
    if (!el) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight || 1;
      // -1..1 across the scroll span of this element
      const progress =
        (rect.top + rect.height / 2 - viewportH / 2) /
        (viewportH / 2 + rect.height / 2);
      const clamped = Math.max(-1, Math.min(1, progress));
      el.style.setProperty("--py", `${Math.round(clamped * strength)}px`);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [strength]);

  return ref;
}
