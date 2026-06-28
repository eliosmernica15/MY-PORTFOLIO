import { useEffect, useRef, useState } from 'react';

interface ScrollSnapshot {
  y: number;
  scrolled: boolean;
  navVisible: boolean;
  showBackToTop: boolean;
}

export function useRafScroll(threshold = 50, backToTopAt = 250): ScrollSnapshot {
  const [snapshot, setSnapshot] = useState<ScrollSnapshot>({
    y: 0,
    scrolled: false,
    navVisible: true,
    showBackToTop: false,
  });
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const update = () => {
      ticking.current = false;
      const y = window.scrollY;
      setSnapshot(prev => {
        let navVisible = prev.navVisible;
        if (y > lastY.current + 8 && y > 100) navVisible = false;
        else if (y < lastY.current - 4) navVisible = true;

        return {
          y,
          scrolled: y > threshold,
          navVisible,
          showBackToTop: y > backToTopAt,
        };
      });
      lastY.current = y;
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold, backToTopAt]);

  return snapshot;
}
