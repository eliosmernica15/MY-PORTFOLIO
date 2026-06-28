import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { getDeviceProfile } from '../hooks/useDeviceProfile';

const profile = getDeviceProfile();

const CustomCursor: React.FC = () => {
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
  const [isVisible, setIsVisible] = useState(false);

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
        setIsVisible(true);
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
      setIsVisible(false);
    };
    const handleEnter = () => {
      visibleRef.current = true;
      setIsVisible(true);
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
        style={{ x: dotX, y: dotY, opacity: isVisible ? 1 : 0, pointerEvents: 'none' }}
        animate={{ scale: isHovering ? 0.4 : 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      />
      <motion.div
        className="custom-cursor-ring"
        style={{
          x: ringXCentered,
          y: ringYCentered,
          opacity: isVisible ? 1 : 0,
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
