import React from 'react';
import { motion } from 'framer-motion';

interface RevealSectionProps {
  children?: React.ReactNode;
  className?: string;
  id?: string;
  delay?: number;
}

const RevealSection: React.FC<RevealSectionProps> = ({
  children,
  className = '',
  id,
  delay = 0,
}) => (
  <motion.div
    id={id}
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.08 }}
    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export default RevealSection;
