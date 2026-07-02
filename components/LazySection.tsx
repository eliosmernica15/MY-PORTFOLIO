import React, { useState, useEffect, useRef, Suspense } from 'react';

interface LazySectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  /** Section id for nav scroll targets; ensures element exists so nav links work before section is in view */
  id?: string;
}

/**
 * Mounts children (typically a lazy component) only when the section is near the viewport,
 * to defer loading of below-the-fold content until needed.
 * The optional id is set on the wrapper so nav links can scroll to it even before the section mounts.
 */
const LazySection: React.FC<LazySectionProps> = ({
  children,
  fallback = <div className="min-h-[120px]" aria-hidden="true" />,
  rootMargin = '120px',
  id,
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div
      ref={ref}
      id={id}
      className={id ? 'scroll-mt-24' : undefined}
    >
      {inView ? <Suspense fallback={fallback}>{children}</Suspense> : fallback}
    </div>
  );
};

export default LazySection;
