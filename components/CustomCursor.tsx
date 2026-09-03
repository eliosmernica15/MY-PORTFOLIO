import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useDeviceProfile } from '../hooks/useDeviceProfile';

const CustomCursor: React.FC = () => {
  const profile = useDeviceProfile();
  const [mounted, setMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const visibleRef = useRef(false);
  const frameRef = useRef<number | null>(null);
  const pendingRef = useRef({ x: -100, y: -100 });

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  const ringX = useSpring(rawX, { damping: 28, stiffness: 280, mass: 0.45 });
  const ringY = useSpring(rawY, { damping: 28, stiffness: 280, mass: 0.45 });
  const dotX = useTransform(rawX, v => v - 4);
  const dotY = useTransform(rawY, v => v - 4);
  const ringXCentered = useTransform(ringX, v => v - 20);
  const ringYCentered = useTransform(ringY, v => v - 20);
  // Opacity is a motion value rather than React state — flipping
  // it on `mouseenter` / `mouseleave` doesn't trigger a re-render
  // of the cursor tree. The previous version held `isVisible` as
  // `useState`, so every visibility flip re-rendered the entire
  // `<CustomCursor />` component. With ~120 mouseenter/leave events
  // per minute on a typical page, that was ~120 re-renders/min
  // for a component that should be a pure transform.
  const opacityMV = useMotionValue(0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !profile.enableCustomCursor) return;

    document.body.classList.add('cursor-custom');

    const flushMove = () => {
      frameRef.current = null;
      rawX.set(pendingRef.current.x);
      rawY.set(pendingRef.current.y);
      if (!visibleRef.current) {
        visibleRef.current = true;
        opacityMV.set(1);
      }
    };

    const handleMove = (e: MouseEvent) => {
      pendingRef.current = { x: e.clientX, y: e.clientY };
      if (frameRef.current === null) {
        frameRef.current = requestAnimationFrame(flushMove);
      }
    };

    const handleLeave = () => {
      visibleRef.current = false;
      opacityMV.set(0);
    };
    const handleEnter = () => {
      visibleRef.current = true;
      opacityMV.set(1);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest(
        'a, button, [role="button"], input, textarea, [data-cursor-hover]'
      );
      setIsHovering(Boolean(interactive));
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleLeave);
    document.documentElement.addEventListener('mouseenter', handleEnter);

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.documentElement.removeEventListener('mouseleave', handleLeave);
      document.documentElement.removeEventListener('mouseenter', handleEnter);
      document.body.classList.remove('cursor-custom');
    };
  }, [mounted, rawX, rawY]);

  if (!mounted || !profile.enableCustomCursor) return null;

  return (
    <>
      <motion.div
        className="custom-cursor-dot"
        style={{ x: dotX, y: dotY, opacity: opacityMV, pointerEvents: 'none' }}
        animate={{ scale: isHovering ? 0.4 : 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      />
      <motion.div
        className="custom-cursor-ring"
        style={{
          x: ringXCentered,
          y: ringYCentered,
          opacity: opacityMV,
          pointerEvents: 'none',
        }}
        animate={{
          scale: isHovering ? 1.8 : 1,
          borderColor: isHovering ? 'var(--selection-bg)' : 'var(--border)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      />
    </>
  );
};

export default CustomCursor;
