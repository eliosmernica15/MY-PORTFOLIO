import React, { Suspense, useEffect, useRef } from 'react';
import Spline from '@splinetool/react-spline';

const SPLINE_SCENE_URL = 'https://prod.spline.design/RONF3SHpGTERZs4g/scene.splinecode';

const HIDE_DURATION_MS = 25000; // Run on all devices (including slow phones) for 25s

function hideSplineWatermark() {
  // Hide links that are clearly the "Build with Spline" / Spline branding
  document.querySelectorAll('a[href*="spline.design"], a[href*="spline.tool"]').forEach((node) => {
    const el = node as HTMLElement;
    const label = (el.textContent || el.getAttribute('aria-label') || '').toLowerCase();
    if (!label || /built|spline|powered|logo|watermark|made with/.test(label)) {
      el.style.setProperty('display', 'none', 'important');
      el.style.setProperty('visibility', 'hidden', 'important');
      el.style.setProperty('opacity', '0', 'important');
    }
  });
  // Hide any element whose text is only "Build with Spline" or similar
  document.querySelectorAll('a, span, div').forEach((node) => {
    const el = node as HTMLElement;
    const text = (el.textContent || '').trim().toLowerCase();
    if (/^build with spline$|^made with spline$|^spline$/.test(text) && el.offsetParent !== null) {
      el.style.setProperty('display', 'none', 'important');
      el.style.setProperty('visibility', 'hidden', 'important');
      el.style.setProperty('opacity', '0', 'important');
    }
  });
  // Hide known Spline viewer UI containers (e.g. logo wrapper) by role or class-like patterns
  document.querySelectorAll('[class*="spline"], [id*="spline"]').forEach((node) => {
    const el = node as HTMLElement;
    const text = (el.textContent || '').toLowerCase();
    if (/build with spline|made with spline|spline\.design|spline\.tool/.test(text)) {
      el.style.setProperty('display', 'none', 'important');
      el.style.setProperty('visibility', 'hidden', 'important');
      el.style.setProperty('opacity', '0', 'important');
    }
  });
}

const SplineScene: React.FC = () => {
  const observerRef = useRef<MutationObserver | null>(null);

  const onLoad = (spline: { setBackgroundColor: (color: string) => void }) => {
    spline.setBackgroundColor('transparent');
    hideSplineWatermark();
    [0, 100, 300, 600, 1000, 2000, 4000, 8000].forEach((delay) =>
      setTimeout(hideSplineWatermark, delay)
    );
  };

  useEffect(() => {
    hideSplineWatermark();
    observerRef.current = new MutationObserver(hideSplineWatermark);
    observerRef.current.observe(document.body, { childList: true, subtree: true });
    const interval = setInterval(hideSplineWatermark, 400);
    const stop = () => {
      clearInterval(interval);
      observerRef.current?.disconnect();
    };
    const t = setTimeout(stop, HIDE_DURATION_MS);
    return () => {
      clearTimeout(t);
      stop();
    };
  }, []);

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none min-h-[100dvh] sm:min-h-0"
      aria-hidden
    >
      <Suspense
        fallback={
          <div className="absolute inset-0 min-w-full min-h-full" style={{ background: 'transparent' }} />
        }
      >
        {/* Responsive scale: smaller on phones, then scale up for tablet/desktop */}
        <div className="absolute inset-0 min-w-full min-h-full scale-[1.05] sm:scale-[1.18] md:scale-[1.18] lg:scale-[1.15] origin-center" style={{ background: 'transparent' }}>
          <Spline scene={SPLINE_SCENE_URL} onLoad={onLoad} style={{ background: 'transparent' }} />
        </div>
      </Suspense>
      {/* Cover Spline "Build with Spline" logo (above iframe; logo is in iframe so JS/CSS cannot remove it) */}
      <div
        className="absolute bottom-0 right-0 w-[150px] h-[44px] sm:w-[160px] sm:h-[48px] pointer-events-none z-[9999]"
        style={{ backgroundColor: 'var(--bg-primary)' }}
        aria-hidden
      />
    </div>
  );
};

export default SplineScene;
