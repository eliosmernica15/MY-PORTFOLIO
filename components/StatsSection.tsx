import React from 'react';
import { motion } from 'framer-motion';
import { STATS } from '../constants';
import AnimatedCounter from './AnimatedCounter';
import RevealSection from './RevealSection';

const StatsSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto snap-section content-auto relative z-[1]">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {STATS.map((stat, idx) => (
          <RevealSection key={stat.label} delay={idx * 0.08}>
            <div
              className="stat-card-enterprise p-5 sm:p-6 md:p-8 rounded-[1.25rem] sm:rounded-[1.5rem] md:rounded-[2rem] border text-center group transition-all duration-500 hover:-translate-y-1"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border)',
              }}
            >
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gradient-accent mb-2 sm:mb-3">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </h3>
              <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--text-secondary)' }}>
                {stat.label}
              </p>
            </div>
          </RevealSection>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
