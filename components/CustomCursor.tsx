import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [useCustomCursor, setUseCustomCursor] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const ringX = useSpring(rawX, springConfig);
  const ringY = useSpring(rawY, springConfig);

  const dotX = useTransform(rawX, (v) => v - 4);
  const dotY = useTransform(rawY, (v) => v - 4);
  const ringXCentered = useTransform(ringX, (v) => v - 20);
  const ringYCentered = useTransform(ringY, (v) => v - 20);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    const isTouchDevice = () =>
      'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice()) return;

    const handleMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };

    const handleLeave = () => setIsVisible(false);
    const handleEnter = () => setIsVisible(true);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('[data-cursor-hover]')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseOut = () => setIsHovering(false);

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);
    document.documentElement.addEventListener('mouseleave', handleLeave);
    document.documentElement.addEventListener('mouseenter', handleEnter);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      document.documentElement.removeEventListener('mouseleave', handleLeave);
      document.documentElement.removeEventListener('mouseenter', handleEnter);
    };
  }, [mounted, isVisible, rawX, rawY]);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const use = !isTouch && !prefersReducedMotion;
    setUseCustomCursor(use);
    if (use) document.body.classList.add('cursor-custom');
    return () => {
      document.body.classList.remove('cursor-custom');
    };
  }, [mounted]);

  if (!mounted || !useCustomCursor) return null;

  return (
    <>
      {/* Dot - follows cursor directly */}
      <motion.div
        className="custom-cursor-dot"
        style={{
          x: dotX,
          y: dotY,
          opacity: isVisible ? 1 : 0,
          pointerEvents: 'none',
        }}
        animate={{
          scale: isHovering ? 0.4 : 1,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      />
      {/* Ring - smooth trailing */}
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
          borderColor: isHovering
            ? 'var(--selection-bg)'
            : 'var(--border)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      />
    </>
  );
};

export default CustomCursor;
