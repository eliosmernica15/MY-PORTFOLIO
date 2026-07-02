import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

interface ScrollState {
  scrolled: boolean;
  navVisible: boolean;
  showBackToTop: boolean;
}

const ScrollContext = createContext<ScrollState>({
  scrolled: false,
  navVisible: true,
  showBackToTop: false,
});

export const useScrollState = () => useContext(ScrollContext);

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ScrollState>({
    scrolled: false,
    navVisible: true,
    showBackToTop: false,
  });
  const lastY = useRef(0);
  const ticking = useRef(false);
  const progressRef = useRef<HTMLDivElement | null>(null);

  const setProgressRef = useCallback((node: HTMLDivElement | null) => {
    progressRef.current = node;
  }, []);

  useEffect(() => {
    const update = () => {
      ticking.current = false;
      const y = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, y / docHeight)) : 0;

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }

      setState(prev => {
        const scrolled = y > 50;
        const showBackToTop = y > 250;
        let navVisible = prev.navVisible;
        if (y > lastY.current + 8 && y > 100) navVisible = false;
        else if (y < lastY.current - 4) navVisible = true;

        if (
          prev.scrolled === scrolled &&
          prev.showBackToTop === showBackToTop &&
          prev.navVisible === navVisible
        ) {
          return prev;
        }
        return { scrolled, navVisible, showBackToTop };
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
  }, []);

  return (
    <ScrollContext.Provider value={state}>
      <div
        ref={setProgressRef}
        className="scroll-progress-bar"
        aria-hidden
      />
      {children}
    </ScrollContext.Provider>
  );
};
