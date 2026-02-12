import React from 'react';
import { Cpu, Palette, Zap, Camera } from 'lucide-react';
import { SERVICES } from '../constants';
import RevealSection from './RevealSection';

const About: React.FC = () => {
  return (
    <section id="about" className="py-28 px-6 scroll-mt-24 snap-section">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <RevealSection className="lg:col-span-7">
            <div
              className="p-10 md:p-14 rounded-[3rem] relative overflow-hidden"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
              }}
            >
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-[rgba(139,92,246,0.05)] blur-[80px] rounded-full pointer-events-none" />
              <span
                className="font-bold text-[10px] uppercase tracking-[0.5em] mb-4 block"
                style={{ color: 'var(--accent-light)' }}
              >
                About
              </span>
              <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
                Pure <br />
                <span className="italic" style={{ color: 'var(--text-muted)' }}>
                  Logic.
                </span>
              </h2>
              <p
                className="text-lg md:text-xl leading-relaxed font-light mb-10"
                style={{ color: 'var(--text-secondary)' }}
              >
                As a skilled IT engineer, I specialize in web development, system
                design, and network infrastructure. With expertise in both front-end
                and back-end development, I create responsive, user-friendly websites
                and robust software systems. Additionally, I hold certifications in
                network configuration and administration, ensuring seamless
                connectivity and secure IT environments.
              </p>
              <div
                className="grid grid-cols-2 gap-8 pt-8"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                <div>
                  <h4
                    className="text-[10px] font-bold uppercase tracking-[0.4em] mb-3"
                    style={{ color: 'var(--accent-light)' }}
                  >
                    Focus
                  </h4>
                  <p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                    Web & Infrastructure
                  </p>
                </div>
                <div>
                  <h4
                    className="text-[10px] font-bold uppercase tracking-[0.4em] mb-3"
                    style={{ color: 'var(--accent-light)' }}
                  >
                    Principle
                  </h4>
                  <p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                    Minimalism & Speed
                  </p>
                </div>
              </div>
            </div>
          </RevealSection>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {SERVICES.map((s, idx) => (
              <RevealSection
                key={idx}
                delay={idx * 0.1}
                className={`${idx === 3 ? 'col-span-2' : ''}`}
              >
                <div
                  className="p-8 rounded-[2rem] flex flex-col justify-between transition-all duration-500 group h-full"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl bg-[rgba(139,92,246,0.1)] flex items-center justify-center mb-10 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] group-hover:bg-[rgba(139,92,246,0.2)] transition-all"
                    style={{ color: 'var(--accent-light)' }}
                  >
                    {s.icon === 'Cpu' && <Cpu size={20} />}
                    {s.icon === 'Palette' &&
                      (s.title === 'Photography' ? (
                        <Camera size={20} />
                      ) : (
                        <Palette size={20} />
                      ))}
                    {s.icon === 'Zap' && <Zap size={20} />}
                  </div>
                  <div>
                    <h3
                      className="font-black text-lg mb-3 tracking-tight"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {s.title}
                    </h3>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      {s.desc}
                    </p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
