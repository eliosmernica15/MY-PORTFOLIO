'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to detect and respond to prefers-reduced-motion media query.
 * Returns true if the user prefers reduced motion.
 */
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReduced(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReduced;
}

/**
 * Hook that provides reduced motion variants for Framer Motion.
 * Returns variants that disable animations when reduced motion is preferred.
 */
export function useReducedMotionVariants<T extends Record<string, any>>(
  variants: T,
  prefersReduced: boolean
): T {
  if (!prefersReduced) return variants;

  // Return variants with all animations disabled
  const reducedVariants: Record<string, any> = {};
  for (const [key, variant] of Object.entries(variants)) {
    if (typeof variant === 'object' && variant !== null) {
      reducedVariants[key] = {
        ...variant,
        transition: { duration: 0 },
      };
    } else {
      reducedVariants[key] = variant;
    }
  }
  return reducedVariants as T;
}