import React from 'react';
import { Database, MonitorSmartphone, Store, Code } from 'lucide-react';
import { SERVICES } from '../constants';
import RevealSection from './RevealSection';

const iconMap: Record<string, React.ReactNode> = {
  MonitorSmartphone: <MonitorSmartphone size={24} />,
  Store: <Store size={24} />,
  Database: <Database size={24} />,
  Code: <Code size={24} />,
};

const Services: React.FC = () => {
  return (
    <section id="services" className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 scroll-mt-24 snap-section relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 blur-[120px] rounded-full pointer-events-none opacity-50" style={{ background: 'var(--glass-accent-bg)' }} />
      <div className="max-w-7xl mx-auto relative z-10">
        <RevealSection className="mb-16 md:mb-20 text-center">
          <span
            className="font-bold text-[10px] uppercase tracking-[0.5em] mb-4 block"
            style={{ color: 'var(--accent-light)' }}
          >
            Services you can trust
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-tight">
            Unique Web <span className="italic" style={{ color: 'var(--text-muted)' }}>Projects.</span>
          </h2>
          <p className="text-lg md:text-xl font-light max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            I put your ideas and thus your wishes in the form of a unique web project that inspires you and your customers.
          </p>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {SERVICES.map((s, idx) => (
            <RevealSection key={idx} delay={idx * 0.1}>
              <div
                className="p-8 sm:p-10 rounded-[2rem] flex flex-col h-full transition-all duration-500 group relative overflow-hidden"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                }}
              >
                <div className="absolute top-0 right-0 p-8 text-5xl font-black opacity-[0.03] pointer-events-none transition-opacity duration-500 group-hover:opacity-10" style={{ color: 'var(--text-primary)' }}>
                  {s.number || `0${idx + 1}`}
                </div>
                
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-accent group-hover:shadow-accent-hover transition-all duration-300 relative z-10"
                  style={{ backgroundColor: 'var(--glass-accent-bg)', color: 'var(--accent)' }}
                >
                  {iconMap[s.icon] || <Code size={24} />}
                </div>
                
                <h3 className="text-2xl font-black mb-4 tracking-tight relative z-10" style={{ color: 'var(--text-primary)' }}>
                  {s.title}
                </h3>
                
                <p className="text-base leading-relaxed flex-grow relative z-10" style={{ color: 'var(--text-secondary)' }}>
                  {s.desc}
                </p>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
