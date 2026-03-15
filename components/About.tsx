import React from 'react';
import RevealSection from './RevealSection';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 scroll-mt-24 snap-section">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          <RevealSection className="lg:col-span-12">
            <div
              className="p-6 sm:p-10 md:p-14 rounded-[2rem] sm:rounded-[3rem] relative overflow-hidden"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
              }}
            >
              <div className="absolute -top-20 -right-20 w-60 h-60 blur-[80px] rounded-full pointer-events-none" style={{ background: 'var(--glass-accent-bg)' }} />
              <span
                className="font-bold text-[10px] uppercase tracking-[0.5em] mb-4 block"
                style={{ color: 'var(--accent-light)' }}
              >
                About Me
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 sm:mb-8 leading-tight">
                I am Elios <br />
                <span className="italic" style={{ color: 'var(--text-muted)' }}>
                  Web-App Developer
                </span>
              </h2>
              <p
                className="text-lg md:text-xl leading-relaxed font-light mb-10"
                style={{ color: 'var(--text-secondary)' }}
              >
                I am Elios Mernica, a web app developer with a keen interest in building innovative, user-friendly applications and robust system infrastructures. My goal is to create modern web apps that solve real-world problems while delivering an exceptional, seamless user experience.
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
        </div>
      </div>
    </section>
  );
};

export default About;
