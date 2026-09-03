import React, { Suspense, useEffect, useRef } from 'react';
import Spline from '@splinetool/react-spline';

const SPLINE_SCENE_URL = 'https://prod.spline.design/RONF3SHpGTERZs4g/scene.splinecode';

function hideSplineWatermark(root: ParentNode) {
  root.querySelectorAll('a[href*="spline.design"], a[href*="spline.tool"]').forEach(node => {
    const el = node as HTMLElement;
    el.style.setProperty('display', 'none', 'important');
    el.style.setProperty('visibility', 'hidden', 'important');
    el.style.setProperty('opacity', '0', 'important');
  });
}

const SplineScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const onLoad = (spline: { setBackgroundColor: (color: string) => void }) => {
    spline.setBackgroundColor('transparent');
    if (containerRef.current) hideSplineWatermark(containerRef.current);
    [100, 500, 1500].forEach(delay =>
      setTimeout(() => {
        if (containerRef.current) hideSplineWatermark(containerRef.current);
      }, delay)
    );
  };

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    hideSplineWatermark(root);
    const observer = new MutationObserver(() => hideSplineWatermark(root));
    observer.observe(root, { childList: true, subtree: true });

    const stopAt = window.setTimeout(() => observer.disconnect(), 8000);
    return () => {
      clearTimeout(stopAt);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none min-h-[100dvh] sm:min-h-0"
      aria-hidden
    >
      <Suspense fallback={null}>
        <div
          className="absolute inset-0 min-w-full min-h-full scale-[1.05] sm:scale-[1.18] md:scale-[1.18] lg:scale-[1.15] origin-center"
          style={{ background: 'transparent' }}
        >
          <Spline scene={SPLINE_SCENE_URL} onLoad={onLoad} style={{ background: 'transparent' }} />
        </div>
      </Suspense>
      <div
        className="absolute bottom-0 left-0 right-0 h-14 sm:h-16 pointer-events-none z-[9999]"
        style={{ backgroundColor: 'var(--bg-primary)' }}
        aria-hidden
      />
    </div>
  );
};

export default SplineScene;
