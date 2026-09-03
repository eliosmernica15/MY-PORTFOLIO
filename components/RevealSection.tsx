'use client';

import React, { memo, useEffect, useRef, useState } from 'react';

interface RevealSectionProps {
  children?: React.ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  /**
   * When true, render the children with the "visible" state on the
   * very first paint (no fade-in). Useful for above-the-fold content
   * that should appear immediately on page load.
   */
  instant?: boolean;
}

const RevealSection = memo(function RevealSection({
  children,
  className = '',
  id,
  delay = 0,
  instant = false,
}: RevealSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  // `visible` starts as `instant` so above-the-fold content is
  // shown immediately. The IntersectionObserver only handles
  // off-screen content; if the element is already in the viewport
  // at mount (the common case for above-the-fold sections), we
  // skip the observer entirely and let CSS show it from frame 1.
  const [visible, setVisible] = useState(instant);

  useEffect(() => {
    if (instant) return; // already visible, no observer needed
    const el = ref.current;
    if (!el) return;

    // If the browser doesn't support IntersectionObserver (very old
    // browsers), fall back to showing immediately. This avoids a
    // permanent invisible state on a 0.1% of users.
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    // If the element is already in the viewport at mount time
    // (e.g. immediately after a route change for a top-of-page
    // section), skip the observer and show it now.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      // Threshold 0 with a negative bottom rootMargin means the
      // observer fires as soon as ANY pixel of the element
      // peeks above the viewport bottom. The previous 0.1
      // threshold delayed the reveal until 10% of the element
      // was visible, which felt sluggish on long sections.
      { threshold: 0, rootMargin: '0px 0px -64px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [instant]);

  return (
    <div
      ref={ref}
      id={id}
      className={`reveal-section ${visible ? 'reveal-visible' : ''} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
});

export default RevealSection;
export { RevealSection };
