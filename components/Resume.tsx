import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Sparkles, Zap, Download } from 'lucide-react';
import { EDUCATION, EXPERIENCE, SKILLS_PROGRESS, CONTACT_INFO } from '../constants';
import RevealSection from './RevealSection';
import SectionHeader from './ui/SectionHeader';
import AdvancedButton from './ui/AdvancedButton';
import PremiumCard from './ui/PremiumCard';

const Resume: React.FC = () => {
  return (
    <section id="resume" className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 relative snap-section content-auto z-[1]">
      <div className="max-w-7xl mx-auto relative z-10">
        <RevealSection className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4 space-y-10">
            <SectionHeader
              eyebrow="Resume"
              title={
                <>
                  Career <span className="italic" style={{ color: 'var(--text-muted)' }}>Core.</span>
                </>
              }
              className="!mb-0"
            />
            <PremiumCard>
              <div className="space-y-4">
                {[
                  { icon: Mail, text: CONTACT_INFO.email, href: `mailto:${CONTACT_INFO.email}` },
                  { icon: Phone, text: CONTACT_INFO.phone, href: `tel:${CONTACT_INFO.phone}` },
                  { icon: MapPin, text: CONTACT_INFO.location },
                ].map(({ icon: Icon, text, href }, i) => {
                  const row = (
                    <div className="flex items-center gap-4 transition-colors hover:text-[var(--accent-light)]" style={{ color: 'var(--text-secondary)' }}>
                      <div className="w-8 h-8 rounded-lg bg-[var(--glass-accent-bg)] flex items-center justify-center">
                        <Icon size={14} style={{ color: 'var(--accent-light)' }} />
                      </div>
                      <span className="text-xs tracking-wide font-medium">{text}</span>
                    </div>
                  );
                  return href ? (
                    <a key={i} href={href} className="interactive-btn block">
                      {row}
                    </a>
                  ) : (
                    <div key={i}>{row}</div>
                  );
                })}
              </div>
            </PremiumCard>
            <AdvancedButton
              variant="primary"
              size="md"
              href="/Elios-Mernica-CV.pdf"
              icon={<Download size={16} />}
              className="w-full"
            >
              Download CV
            </AdvancedButton>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              { title: 'Education', icon: Sparkles, items: EDUCATION },
              { title: 'Experience', icon: Zap, items: EXPERIENCE.map(e => ({ title: e.company, period: e.period, desc: e.desc })) },
            ].map(({ title, icon: Icon, items }) => (
              <div key={title} className="space-y-6">
                <div className="flex items-center gap-3 font-bold uppercase tracking-widest text-xs pb-4" style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border)' }}>
                  <div className="w-6 h-6 rounded-md bg-[var(--glass-accent-bg)] flex items-center justify-center">
                    <Icon size={12} style={{ color: 'var(--accent-light)' }} />
                  </div>
                  {title}
                </div>
                <div className="space-y-6 pl-6" style={{ borderLeft: '1px solid var(--border)' }}>
                  {items.map((item, idx) => (
                    <motion.div
                      key={`${title}-${idx}`}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.08 }}
                      className="relative group"
                    >
                      <div className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-[var(--accent)] border-2 shadow-accent group-hover:shadow-accent-hover transition-all" style={{ borderColor: 'var(--bg-primary)' }} />
                      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--accent-light)' }}>
                        {item.period}
                      </span>
                      <h4 className="text-base font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                        {item.title}
                      </h4>
                      <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        {item.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </RevealSection>

        <RevealSection className="mt-24">
          <PremiumCard glow>
            <h3 className="text-xs font-bold mb-10 text-center uppercase tracking-[0.4em]" style={{ color: 'var(--accent-light)' }}>
              System Proficiency
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
              {SKILLS_PROGRESS.map((skill, idx) => (
                <div key={skill.name} className="space-y-2.5">
                  <div className="flex justify-between font-bold text-[10px] uppercase tracking-widest">
                    <span style={{ color: 'var(--text-secondary)' }}>{skill.name}</span>
                    <span style={{ color: 'var(--text-primary)' }}>{skill.value}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--border)] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full bg-[var(--accent)] shadow-accent"
                    />
                  </div>
                </div>
              ))}
            </div>
          </PremiumCard>
        </RevealSection>
      </div>
    </section>
  );
};

export default Resume;
