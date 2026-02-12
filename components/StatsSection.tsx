import React from 'react';
import { motion } from 'framer-motion';
import { STATS } from '../constants';
import AnimatedCounter from './AnimatedCounter';
import RevealSection from './RevealSection';

const StatsSection: React.FC = () => {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto snap-section">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {STATS.map((stat, idx) => (
          <RevealSection key={idx} delay={idx * 0.1}>
            <motion.div
              whileHover={{
                y: -4,
                boxShadow: '0 0 30px rgba(139, 92, 246, 0.15)',
              }}
              className="p-8 rounded-[2rem] border text-center group transition-all duration-500"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border)',
              }}
            >
              <h3 className="text-4xl md:text-5xl font-black text-gradient-accent mb-3">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </h3>
              <p
                className="text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: 'var(--text-secondary)' }}
              >
                {stat.label}
              </p>
            </motion.div>
          </RevealSection>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
