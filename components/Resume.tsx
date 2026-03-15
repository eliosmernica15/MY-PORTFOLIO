import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Sparkles, Zap, Download } from 'lucide-react';
import { EDUCATION, EXPERIENCE, SKILLS_PROGRESS, CONTACT_INFO } from '../constants';
import RevealSection from './RevealSection';
import FloatingOrbs from './FloatingOrbs';
import MagneticButton from './MagneticButton';

const Resume: React.FC = () => {
  return (
    <section className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 relative snap-section">
      <FloatingOrbs />
      <div className="max-w-7xl mx-auto relative z-10">
        <RevealSection className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4 space-y-10">
            <div>
              <span
                className="font-bold text-[10px] uppercase tracking-[0.5em] mb-4 block"
                style={{ color: 'var(--accent-light)' }}
              >
                Resume
              </span>
              <h2 className="text-5xl font-black mb-8 leading-tight">
                Career{' '}
                <span className="italic" style={{ color: 'var(--text-muted)' }}>
                  Core.
                </span>
              </h2>
            </div>
            <div
              className="space-y-4 p-6 rounded-2xl"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
              }}
            >
              {[
                { icon: Mail, text: CONTACT_INFO.email },
                { icon: Phone, text: CONTACT_INFO.phone },
                { icon: MapPin, text: CONTACT_INFO.location },
              ].map(({ icon: Icon, text }, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 transition-colors hover:text-[var(--accent-light)]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <div className="w-8 h-8 rounded-lg bg-[var(--glass-accent-bg)] flex items-center justify-center">
                    <Icon size={14} style={{ color: 'var(--accent-light)' }} />
                  </div>
                  <span className="text-xs tracking-wide font-medium">{text}</span>
                </div>
              ))}
            </div>

            {/* Download CV Button */}
            <MagneticButton strength={0.15}>
              <motion.a
                href="https://eliosmernica.vercel.app/Elios-Mernica-CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-3 w-full py-4 bg-[var(--accent)] text-[var(--accent-contrast)] font-bold rounded-2xl hover:shadow-accent-hover shadow-accent transition-all text-sm uppercase tracking-widest"
              >
                <Download size={16} /> Download CV
              </motion.a>
            </MagneticButton>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Education */}
            <div className="space-y-6">
              <div
                className="flex items-center gap-3 font-bold uppercase tracking-widest text-xs pb-4"
                style={{
                  color: 'var(--text-primary)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <div className="w-6 h-6 rounded-md bg-[var(--glass-accent-bg)] flex items-center justify-center">
                  <Sparkles size={12} style={{ color: 'var(--accent-light)' }} />
                </div>
                Education
              </div>
              <div
                className="space-y-6 pl-6"
                style={{ borderLeft: '1px solid var(--border)' }}
              >
                {EDUCATION.map((edu, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08 }}
                    className="relative group"
                  >
                    <div className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-[var(--accent)] border-2 shadow-accent group-hover:shadow-accent-hover transition-all" style={{ borderColor: 'var(--bg-primary)' }} />
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: 'var(--accent-light)' }}
                    >
                      {edu.period}
                    </span>
                    <h4 className="text-base font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                      {edu.title}
                    </h4>
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      {edu.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-6">
              <div
                className="flex items-center gap-3 font-bold uppercase tracking-widest text-xs pb-4"
                style={{
                  color: 'var(--text-primary)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <div className="w-6 h-6 rounded-md bg-[var(--glass-accent-bg)] flex items-center justify-center">
                  <Zap size={12} style={{ color: 'var(--accent-light)' }} />
                </div>
                Experience
              </div>
              <div
                className="space-y-6 pl-6"
                style={{ borderLeft: '1px solid var(--border)' }}
              >
                {EXPERIENCE.map((exp, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08 }}
                    className="relative group"
                  >
                    <div className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-[var(--accent)] border-2 shadow-accent group-hover:shadow-accent-hover transition-all" style={{ borderColor: 'var(--bg-primary)' }} />
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: 'var(--accent-light)' }}
                    >
                      {exp.period}
                    </span>
                    <h4 className="text-base font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                      {exp.company}
                    </h4>
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      {exp.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </RevealSection>

        {/* Skills Progress */}
        <RevealSection className="mt-24">
          <div
            className="p-10 rounded-[2.5rem]"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
            }}
          >
            <h3
              className="text-xs font-bold mb-10 text-center uppercase tracking-[0.4em]"
              style={{ color: 'var(--accent-light)' }}
            >
              System Proficiency
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
              {SKILLS_PROGRESS.map((skill, idx) => (
                <div key={idx} className="space-y-2.5">
                  <div className="flex justify-between font-bold text-[10px] uppercase tracking-widest">
                    <span style={{ color: 'var(--text-secondary)' }}>{skill.name}</span>
                    <span style={{ color: 'var(--text-primary)' }}>{skill.value}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--border)] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.value}%` }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1.2,
                        delay: idx * 0.1,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="h-full rounded-full bg-[var(--accent)] shadow-accent"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
};

export default Resume;
