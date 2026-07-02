import React from 'react';
import RevealSection from './RevealSection';
import PremiumCard from './ui/PremiumCard';
import Chip from './ui/Chip';
import SectionHeader from './ui/SectionHeader';
import { PERSONAL_INFO } from '../constants';

const CAPABILITIES = [
  'Full-Stack Engineering',
  'System Architecture',
  'Performance Optimization',
  'UI/UX Engineering',
  'Cloud Deployment',
  'API Design',
];

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 scroll-mt-24 content-auto relative z-[1]">
      <div className="max-w-7xl mx-auto">
        <RevealSection>
          <PremiumCard glow className="overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 blur-[80px] rounded-full pointer-events-none opacity-60" style={{ background: 'var(--glass-accent-bg)' }} />
            <SectionHeader
              eyebrow="About Me"
              title={
                <>
                  I am {PERSONAL_INFO.name.split(' ')[0]}{' '}
                  <span className="italic" style={{ color: 'var(--text-muted)' }}>
                    {PERSONAL_INFO.title}
                  </span>
                </>
              }
              subtitle={PERSONAL_INFO.summary}
              className="mb-8 !mb-10 relative z-10"
            />
            <div className="flex flex-wrap gap-2 mb-10 relative z-10">
              {CAPABILITIES.map(item => (
                <Chip key={item}>{item}</Chip>
              ))}
            </div>
            <div
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 relative z-10"
              style={{ borderTop: '1px solid var(--border)' }}
            >
              {[
                { label: 'Focus', value: 'Web & Infrastructure' },
                { label: 'Principle', value: 'Minimalism & Speed' },
                { label: 'Availability', value: 'Remote · Worldwide' },
              ].map(item => (
                <div key={item.label} className="space-y-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: 'var(--accent-light)' }}>
                    {item.label}
                  </h4>
                  <p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </PremiumCard>
        </RevealSection>
      </div>
    </section>
  );
};

export default About;
