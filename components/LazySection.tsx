import React, { useState, useEffect, useRef, Suspense } from 'react';

interface LazySectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
}

/**
 * Mounts children (typically a lazy component) only when the section is near the viewport,
 * to defer loading of below-the-fold content until needed.
 */
const LazySection: React.FC<LazySectionProps> = ({
  children,
  fallback = <div className="min-h-[120px]" aria-hidden="true" />,
  rootMargin = '120px',
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref}>
      {inView ? <Suspense fallback={fallback}>{children}</Suspense> : fallback}
    </div>
  );
};

export default LazySection;
