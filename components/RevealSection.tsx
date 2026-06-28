import React, { memo } from 'react';
import { motion } from 'framer-motion';

interface RevealSectionProps {
  children?: React.ReactNode;
  className?: string;
  id?: string;
  delay?: number;
}

const RevealSection = memo(function RevealSection({
  children,
  className = '',
  id,
  delay = 0,
}: RevealSectionProps) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

export default RevealSection;
