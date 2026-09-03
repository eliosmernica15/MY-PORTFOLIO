'use client';

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { ChevronRight, Menu, X, Sparkles } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import MagneticButton from './MagneticButton';
import AdvancedButton from './ui/AdvancedButton';
import { SITE } from '@/data/site';

const navLinks = [
  { name: 'Home', id: 'home' },
  { name: 'About', id: 'about' },
  { name: 'Services', id: 'services' },
  { name: 'Projects', id: 'projects' },
  { name: 'Resume', id: 'resume' },
  { name: 'Contact', id: 'contact' },
];

const useScrollFlags = () => {
  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      setShowBackToTop(y > 250);
      if (y > lastY.current + 8 && y > 100) setNavVisible(false);
      else if (y < lastY.current - 4) setNavVisible(true);
      lastY.current = y;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return { scrolled, navVisible, showBackToTop };
};

const Nav: React.FC = () => {
  const [activeTab, setActiveTab] = useState('About');
  const [isOpen, setIsOpen] = useState(false);
  const { scrolled, navVisible } = useScrollFlags();
  const lastActiveUpdate = useRef(0);

  useEffect(() => {
    const sectionIds = navLinks.map(l => l.id);
    const observer = new IntersectionObserver(
      entries => {
        const now = Date.now();
        if (now - lastActiveUpdate.current < 200) return;
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const link = navLinks.find(l => l.id === visible.target.id);
        if (link) {
          lastActiveUpdate.current = now;
          setActiveTab(link.name);
        }
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: [0, 0.25, 0.5] }
    );

    let observed: HTMLElement[] = [];
    const observeAll = () => {
      observed.forEach(el => observer.unobserve(el));
      observed = sectionIds
        .map(id => document.getElementById(id))
        .filter((el): el is HTMLElement => el != null);
      observed.forEach(el => observer.observe(el));
    };

    observeAll();
    const t = setTimeout(observeAll, 600);
    return () => {
      clearTimeout(t);
      observed.forEach(el => observer.unobserve(el));
    };
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const scroll = (): boolean => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return true;
      }
      return false;
    };
    if (scroll()) return;
    const deadline = Date.now() + 3000;
    const interval = setInterval(() => {
      if (Date.now() > deadline) {
        clearInterval(interval);
        return;
      }
      if (scroll()) clearInterval(interval);
    }, 80);
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent, link: { name: string; id: string }) => {
      e.preventDefault();
      setActiveTab(link.name);
      scrollToSection(link.id);
      setIsOpen(false);
    },
    [scrollToSection]
  );

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  return (
    <>
      <div className="fixed top-3 sm:top-4 left-0 right-0 z-50 flex justify-center pointer-events-none px-3 sm:px-4 pt-[env(safe-area-inset-top)] sm:top-6">
        <nav
          className={`nav-floating pointer-events-auto max-w-fit px-2.5 sm:px-3 py-2 rounded-full flex items-center justify-center gap-1.5 sm:gap-2 nav-blur ${
            navVisible ? '' : 'nav-floating-hidden'
          }`}
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
          <a
            href="#home"
            onClick={() => setActiveTab('About')}
            className="flex items-center px-1"
            aria-label="Home"
          >
            <MagneticButton strength={0.2}>
              <div className="interactive-btn w-10 h-10 bg-[var(--accent)] text-[var(--accent-contrast)] rounded-xl flex items-center justify-center font-bold text-xs shadow-accent">
                EM
              </div>
            </MagneticButton>
          </a>

          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map(link => {
              const isActive = activeTab === link.name;
              return (
                <MagneticButton key={link.name} strength={0.15}>
                  <button
                    type="button"
                    onClick={e => handleNavClick(e, link)}
                    className={`nav-link relative px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest z-10 rounded-full ${
                      isActive ? 'nav-link-active' : ''
                    }`}
                    style={{
                      color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                    }}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {link.name}
                  </button>
                </MagneticButton>
              );
            })}
          </div>

          <ThemeToggle />

          <AdvancedButton
            variant="primary"
            size="sm"
            icon={<Sparkles size={12} />}
            onClick={() => {
              setActiveTab('Hire');
              scrollToSection('contact');
              setIsOpen(false);
            }}
            className="hidden lg:inline-flex"
          >
            Hire Me
          </AdvancedButton>

          <button
            type="button"
            className="lg:hidden p-2 interactive-btn"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            style={{ color: 'var(--text-primary)' }}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 nav-overlay nav-menu-enter lg:hidden"
          style={{ backgroundColor: 'var(--overlay-bg)' }}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="flex flex-col justify-center h-full px-6 sm:px-10">
            <div className="flex flex-col gap-4 sm:gap-6">
              {navLinks.map(link => {
                const isActive = activeTab === link.name;
                return (
                  <button
                    type="button"
                    key={link.name}
                    onClick={e => handleNavClick(e, link)}
                    className="text-left flex items-center justify-between py-2 interactive-btn"
                    style={{
                      color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                    }}
                  >
                    <span className="flex items-center gap-3 sm:gap-4 text-2xl sm:text-3xl font-bold">
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_12px_var(--accent)]" />
                      )}
                      {link.name}
                    </span>
                    <ChevronRight
                      size={20}
                      className={isActive ? 'text-[var(--accent)]' : 'opacity-30'}
                    />
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={e => handleNavClick(e, { name: 'Hire', id: 'contact' })}
              className="interactive-btn mt-10 sm:mt-12 w-full py-4 bg-[var(--accent)] text-[var(--accent-contrast)] font-bold rounded-2xl text-center text-sm uppercase tracking-widest"
            >
              Get in Touch
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(Nav);
