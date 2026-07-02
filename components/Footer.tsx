import React, { memo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Github, Instagram, Linkedin, Mail, ArrowUp } from 'lucide-react';
import { SOCIALS, CONTACT_INFO, PERSONAL_INFO } from '../constants';
import MagneticButton from './MagneticButton';
import { useScrollState } from '../context/ScrollContext';

const quickLinks = [
  { name: 'Projects', id: 'projects' },
  { name: 'Services', id: 'services' },
  { name: 'Resume', id: 'resume' },
  { name: 'About', id: 'about' },
  { name: 'Contact', id: 'contact' },
];

const Footer: React.FC = () => {
  const { showBackToTop } = useScrollState();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleNavClick = (id: string) => {
    if (pathname !== '/') {
      navigate('/');
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <footer className="relative overflow-hidden content-auto" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-50" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 mb-12 sm:mb-16">
            <div>
              <Link to="/" className="flex items-center gap-3 group mb-6 interactive-btn">
                <div className="w-10 h-10 bg-[var(--accent)] text-[var(--accent-contrast)] rounded-xl flex items-center justify-center font-bold text-sm shadow-accent">
                  EM
                </div>
                <span
                  className="text-sm font-bold transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {PERSONAL_INFO.name}
                </span>
              </Link>
              <p
                className="text-sm leading-relaxed max-w-xs"
                style={{ color: 'var(--text-secondary)' }}
              >
                Full-stack developer crafting digital experiences with precision and
                purpose. Based in Kosovo, available worldwide.
              </p>
            </div>

            <div>
              <h4
                className="text-[10px] font-bold uppercase tracking-[0.4em] mb-6"
                style={{ color: 'var(--accent-light)' }}
              >
                Quick Links
              </h4>
              <nav className="flex flex-col gap-3" aria-label="Footer navigation">
                {quickLinks.map(link => (
                  <button
                    key={link.name}
                    type="button"
                    onClick={() => handleNavClick(link.id)}
                    className="interactive-btn text-sm text-left transition-colors hover:text-[var(--accent-light)]"
                    style={{ color: 'var(--text-secondary)' }}
                    aria-label={`Go to ${link.name} section`}
                  >
                    {link.name}
                  </button>
                ))}
              </nav>
            </div>

            <div>
              <h4
                className="text-[10px] font-bold uppercase tracking-[0.4em] mb-6"
                style={{ color: 'var(--accent-light)' }}
              >
                Connect
              </h4>
              <div className="flex flex-col gap-3 mb-6">
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="interactive-btn text-sm flex items-center gap-2 transition-colors hover:text-[var(--accent-light)]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <Mail size={14} /> {CONTACT_INFO.email}
                </a>
              </div>
              <div className="flex gap-3">
                {SOCIALS.map(s => (
                  <MagneticButton key={s.name} strength={0.2}>
                    <a
                      href={s.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="interactive-btn w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-300 hover:scale-105"
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border)',
                        color: 'var(--text-secondary)',
                      }}
                      aria-label={s.name}
                    >
                      {s.icon === 'Github' && <Github size={18} />}
                      {s.icon === 'Instagram' && <Instagram size={18} />}
                      {s.icon === 'Linkedin' && <Linkedin size={18} />}
                    </a>
                  </MagneticButton>
                ))}
              </div>
            </div>
          </div>

          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              &copy; {new Date().getFullYear()} {PERSONAL_INFO.name}. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <span className="status-live">
                <span className="status-live-dot" aria-hidden />
                Available for projects
              </span>
              <div
                className="flex gap-3 text-[10px] font-medium uppercase tracking-[0.2em]"
                style={{ color: 'var(--text-secondary)' }}
              >
              <span className="hover:text-[var(--accent-light)] transition-colors cursor-default">React</span>
              <span style={{ opacity: 0.3 }}>/</span>
              <span className="hover:text-[var(--accent-light)] transition-colors cursor-default">TypeScript</span>
              <span style={{ opacity: 0.3 }}>/</span>
              <span className="hover:text-[var(--accent-light)] transition-colors cursor-default">Vite</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {showBackToTop && (
        <div className="fixed z-40 right-[max(2rem,env(safe-area-inset-right))] bottom-[max(2rem,env(safe-area-inset-bottom))] back-to-top-enter">
          <MagneticButton strength={0.3}>
            <button
              type="button"
              onClick={scrollToTop}
              className="interactive-btn w-12 h-12 rounded-full bg-[var(--accent)] text-[var(--accent-contrast)] flex items-center justify-center shadow-accent hover:shadow-accent-hover transition-transform hover:scale-105 active:scale-95"
              aria-label="Back to top"
            >
              <ArrowUp size={20} />
            </button>
          </MagneticButton>
        </div>
      )}
    </>
  );
};

export default memo(Footer);
