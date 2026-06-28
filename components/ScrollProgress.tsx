import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--accent)] via-[var(--accent-light)] to-[var(--accent-dark)] z-[100] origin-left gpu-layer"
      style={{ scaleX }}
    />
  );
};

export default ScrollProgress;
