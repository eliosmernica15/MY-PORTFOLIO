import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Menu, X, Sparkles } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import MagneticButton from './MagneticButton';

const Nav: React.FC = () => {
  const [activeTab, setActiveTab] = useState('About');
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      if (y > lastY.current + 8 && y > 100) setVisible(false);
      else if (y < lastY.current - 4) setVisible(true);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { name: 'Projects', id: 'projects' },
    { name: 'Resume', id: 'resume' },
    { name: 'About', id: 'about' },
    { name: 'Case Studies', id: 'case-studies' },
    { name: 'Contact', id: 'contact' },
  ];

  // Sync nav highlight with section in view (home page only)
  useEffect(() => {
    if (pathname !== '/') return;

    const sectionIds = navLinks.map(l => l.id);
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          const link = navLinks.find(l => l.id === id);
          if (link) setActiveTab(link.name);
        }
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    const els = sectionIds
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el != null);
    els.forEach(el => observer.observe(el));
    return () => els.forEach(el => observer.unobserve(el));
  }, [pathname]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent, link: { name: string; id: string }) => {
      e.preventDefault();
      setActiveTab(link.name);
      if (pathname !== '/') {
        navigate('/');
        setTimeout(
          () => document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' }),
          100
        );
      } else {
        document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' });
      }
      setIsOpen(false);
    },
    [pathname, navigate]
  );

  return (
    <>
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
        <motion.nav
          animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="pointer-events-auto max-w-fit px-3 py-2 rounded-full flex items-center justify-center gap-2 transition-colors duration-500 backdrop-blur-2xl"
          style={{
            backgroundColor: scrolled ? 'var(--nav-bg-scrolled)' : 'var(--nav-bg)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'var(--border)',
            boxShadow: scrolled ? '0 8px 32px var(--shadow-color)' : 'none',
          }}
          role="navigation"
          aria-label="Main navigation"
        >
        <Link
          to="/"
          onClick={() => setActiveTab('About')}
          className="flex items-center px-1"
          aria-label="Home"
        >
          <MagneticButton strength={0.2}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] rounded-xl flex items-center justify-center font-bold text-xs text-white shadow-lg shadow-violet-500/20"
            >
              EM
            </motion.div>
          </MagneticButton>
        </Link>

        <div className="hidden lg:flex items-center gap-0.5">
          {navLinks.map(link => {
            const isActive = activeTab === link.name;
            return (
              <MagneticButton key={link.name} strength={0.15}>
                <button
                  onClick={e => handleNavClick(e, link)}
                  className="relative px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 z-10 rounded-full"
                  style={{
                    color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {isActive && (
                    <motion.div
                      layoutId="pill-bg"
                      className="absolute inset-0 rounded-full -z-10"
                      style={{
                        backgroundColor: 'var(--pill-bg)',
                        border: '1px solid var(--pill-border)',
                      }}
                      transition={{
                        type: 'spring',
                        duration: 0.5,
                        bounce: 0.15,
                      }}
                    />
                  )}
                  {link.name}
                </button>
              </MagneticButton>
            );
          })}
        </div>

        <ThemeToggle />

        <MagneticButton strength={0.2}>
          <button
            onClick={e => handleNavClick(e, { name: 'Hire', id: 'contact' })}
            className="hidden lg:flex items-center gap-2 px-5 py-2.5 text-[10px] font-bold rounded-full uppercase tracking-widest bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)] text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transition-all duration-300 hover:scale-105"
          >
            <Sparkles size={12} /> Hire Me
          </button>
        </MagneticButton>

        <button
          className="lg:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          style={{ color: 'var(--text-primary)' }}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </motion.nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 backdrop-blur-2xl lg:hidden"
            style={{ backgroundColor: 'var(--overlay-bg)' }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="flex flex-col justify-center h-full px-10">
              <div className="flex flex-col gap-6">
                {navLinks.map((link, idx) => {
                  const isActive = activeTab === link.name;
                  return (
                    <motion.button
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      key={link.name}
                      onClick={e => handleNavClick(e, link)}
                      className="text-left flex items-center justify-between py-2"
                      style={{
                        color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                      }}
                    >
                      <span className="flex items-center gap-4 text-3xl font-bold">
                        {isActive && (
                          <motion.div
                            layoutId="mob-dot"
                            className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_12px_var(--accent)]"
                          />
                        )}
                        {link.name}
                      </span>
                      <ChevronRight
                        size={20}
                        className={isActive ? 'text-[var(--accent)]' : 'opacity-30'}
                      />
                    </motion.button>
                  );
                })}
              </div>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={e => handleNavClick(e, { name: 'Hire', id: 'contact' })}
                className="mt-12 w-full py-4 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)] text-white font-bold rounded-2xl text-center text-sm uppercase tracking-widest"
              >
                Get in Touch
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Nav;
