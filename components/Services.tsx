import React from 'react';
import { Database, MonitorSmartphone, Store, Code } from 'lucide-react';
import { SERVICES } from '@/data/services';
import RevealSection from './RevealSection';
import SectionHeader from './ui/SectionHeader';
import PremiumCard from './ui/PremiumCard';

const iconMap: Record<string, React.ReactNode> = {
  MonitorSmartphone: <MonitorSmartphone size={24} />,
  Store: <Store size={24} />,
  Database: <Database size={24} />,
  Code: <Code size={24} />,
};

const Services: React.FC = () => {
  return (
    <section id="services" className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 scroll-mt-24 relative overflow-hidden content-auto z-[1]">
      <div className="absolute top-0 right-1/4 w-96 h-96 blur-[120px] rounded-full pointer-events-none opacity-40" style={{ background: 'var(--glass-accent-bg)' }} />
      <div className="max-w-7xl mx-auto relative z-10">
        <RevealSection>
          <SectionHeader
            align="center"
            eyebrow="Services you can trust"
            title={
              <>
                Unique Web <span className="italic" style={{ color: 'var(--text-muted)' }}>Projects.</span>
              </>
            }
            subtitle="I transform ideas into high-performance digital products — engineered for clarity, speed, and long-term scalability."
          />
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {SERVICES.map((s, idx) => (
            <RevealSection key={s.id} delay={idx * 0.08}>
              <PremiumCard className="h-full group">
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
                <p className="text-base leading-relaxed relative z-10" style={{ color: 'var(--text-secondary)' }}>
                  {s.desc}
                </p>
              </PremiumCard>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
