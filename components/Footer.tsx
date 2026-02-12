import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Instagram, Linkedin, Mail, ArrowUp } from 'lucide-react';
import { SOCIALS, CONTACT_INFO } from '../constants';
import MagneticButton from './MagneticButton';

const Footer: React.FC = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleNavClick = (id: string) => {
    if (pathname !== '/') {
      navigate('/');
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const quickLinks = [
    { name: 'Projects', id: 'projects' },
    { name: 'Resume', id: 'resume' },
    { name: 'About', id: 'about' },
    { name: 'Case Studies', id: 'case-studies' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <>
      <footer className="relative overflow-hidden" style={{ borderTop: '1px solid var(--border)' }}>
        {/* Gradient divider */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-50" />

        <div className="max-w-7xl mx-auto px-6 pt-20 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            {/* Brand */}
            <div>
              <Link to="/" className="flex items-center gap-3 group mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-violet-500/20">
                  EM
                </div>
                <span
                  className="text-sm font-bold transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Elios Mernica
                </span>
              </Link>
              <p
                className="text-sm leading-relaxed max-w-xs"
                style={{ color: 'var(--text-secondary)' }}
              >
                Software engineer crafting digital experiences with precision and
                purpose. Based in Kosovo, available worldwide.
              </p>
            </div>

            {/* Quick Links */}
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
                    onClick={() => handleNavClick(link.id)}
                    className="text-sm text-left transition-colors hover:text-[var(--accent-light)]"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {link.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Connect */}
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
                  className="text-sm flex items-center gap-2 transition-colors hover:text-[var(--accent-light)]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <Mail size={14} /> {CONTACT_INFO.email}
                </a>
              </div>
              <div className="flex gap-3">
                {SOCIALS.map(s => (
                  <MagneticButton key={s.name} strength={0.2}>
                    <motion.a
                      href={s.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      className="w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-300"
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
                    </motion.a>
                  </MagneticButton>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="flex flex-col md:flex-row items-center justify-between gap-4 py-6"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              &copy; {new Date().getFullYear()} Elios Mernica. All rights reserved.
            </p>
            <div className="flex gap-3 text-[10px] font-medium uppercase tracking-[0.2em]" style={{ color: 'var(--text-secondary)' }}>
              <span className="hover:text-[var(--accent-light)] transition-colors cursor-default">React</span>
              <span style={{ opacity: 0.3 }}>/</span>
              <span className="hover:text-[var(--accent-light)] transition-colors cursor-default">TypeScript</span>
              <span style={{ opacity: 0.3 }}>/</span>
              <span className="hover:text-[var(--accent-light)] transition-colors cursor-default">Framer Motion</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 right-8 z-40"
          >
            <MagneticButton strength={0.3}>
              <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-shadow"
                aria-label="Back to top"
              >
                <ArrowUp size={20} />
              </motion.button>
            </MagneticButton>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Footer;
