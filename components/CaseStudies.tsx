import React from 'react';
import { CASE_STUDIES } from '../constants';
import RevealSection from './RevealSection';

const CaseStudies: React.FC = () => {
  return (
    <section id="case-studies" className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 scroll-mt-24 snap-section">
      <div className="max-w-7xl mx-auto">
        <RevealSection className="text-center mb-16">
          <span
            className="font-bold text-[10px] uppercase tracking-[0.5em] mb-4 block"
            style={{ color: 'var(--accent-light)' }}
          >
            Case Studies
          </span>
          <h2 className="text-5xl md:text-7xl font-black">
            Deep{' '}
            <span className="italic" style={{ color: 'var(--text-muted)' }}>
              Dives.
            </span>
          </h2>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CASE_STUDIES.map((study, idx) => (
            <RevealSection key={idx} delay={idx * 0.06}>
              <div
                className="group rounded-[2rem] overflow-hidden transition-all duration-500 h-full flex flex-col"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                }}
              >
                {/* Image */}
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src={study.img}
                    alt={study.title}
                    className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                </div>

                {/* Content */}
                <div className="p-7 flex-1 flex flex-col">
                  {/* Category + Date */}
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest mb-4">
                    <span style={{ color: 'var(--accent-light)' }}>{study.category}</span>
                    <span
                      className="w-1 h-1 rounded-full"
                      style={{ backgroundColor: 'var(--border)' }}
                    />
                    <span style={{ color: 'var(--text-muted)' }}>{study.date}</span>
                  </div>

                  {/* Title */}
                  <h3
                    className="text-lg font-bold mb-4 tracking-tight group-hover:text-[var(--accent-light)] transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {study.title}
                  </h3>

                  {/* Challenge / Solution / Result */}
                  <div className="space-y-3 flex-1">
                    <div>
                      <span
                        className="text-[9px] font-bold uppercase tracking-[0.3em] block mb-1"
                        style={{ color: 'var(--accent-light)' }}
                      >
                        Challenge
                      </span>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {study.challenge}
                      </p>
                    </div>
                    <div>
                      <span
                        className="text-[9px] font-bold uppercase tracking-[0.3em] block mb-1"
                        style={{ color: 'var(--accent-light)' }}
                      >
                        Solution
                      </span>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {study.solution}
                      </p>
                    </div>
                    <div>
                      <span
                        className="text-[9px] font-bold uppercase tracking-[0.3em] block mb-1"
                        style={{ color: 'var(--accent-light)' }}
                      >
                        Result
                      </span>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {study.result}
                      </p>
                    </div>
                  </div>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-2 mt-5 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                    {study.tech.map(t => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-lg text-[9px] font-bold"
                        style={{
                          backgroundColor: 'var(--glass-accent-bg)',
                          border: '1px solid var(--glass-accent-border)',
                          color: 'var(--accent-muted)',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
