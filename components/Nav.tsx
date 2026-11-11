"use client";

import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { ChevronRight, Menu, X, Sparkles } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import MagneticButton from "./MagneticButton";
import AdvancedButton from "./ui/AdvancedButton";
import { SITE } from "@/data/site";
import { useInertBackground } from "@/hooks/useFocusTrap";
import { useT, useLocale, useSetLocale } from "@/i18n/LocaleProvider";

const useNavLinks = (t: (key: string) => string) => [
  { name: t("navigation.home"), id: "home" },
  { name: t("navigation.about"), id: "about" },
  { name: t("navigation.services"), id: "services" },
  { name: t("navigation.projects"), id: "projects" },
  { name: t("navigation.resume"), id: "resume" },
  { name: t("navigation.contact"), id: "contact" },
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
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return { scrolled, navVisible, showBackToTop };
};

const Nav: React.FC = () => {
  const t = useT();
  const locale = useLocale();
  const setLocale = useSetLocale();
  const navLinks = useNavLinks(t);
  const [activeTab, setActiveTab] = useState(navLinks[0]?.name ?? "");

  // Keep the active tab consistent across a locale switch.
  useEffect(() => {
    setActiveTab(navLinks[0]?.name ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);
  const [isOpen, setIsOpen] = useState(false);
  // Apply inert to background content when mobile menu is open
  useInertBackground({
    active: isOpen,
    excludeSelectors: ["#navigation", "[data-floating-trigger]"],
  });
  const { scrolled, navVisible } = useScrollFlags();
  const lastActiveUpdate = useRef(0);

  useEffect(() => {
    const sectionIds = navLinks.map((l) => l.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const now = Date.now();
        if (now - lastActiveUpdate.current < 200) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const link = navLinks.find((l) => l.id === visible.target.id);
        if (link) {
          lastActiveUpdate.current = now;
          setActiveTab(link.name);
        }
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0, 0.25, 0.5] },
    );

    let observed: HTMLElement[] = [];
    const observeAll = () => {
      observed.forEach((el) => observer.unobserve(el));
      observed = sectionIds
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => el != null);
      observed.forEach((el) => observer.observe(el));
    };

    observeAll();
    const t = setTimeout(observeAll, 600);
    return () => {
      clearTimeout(t);
      observed.forEach((el) => observer.unobserve(el));
    };
    // Re-observe when the locale (and thus the translated section names) changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const scrollToSection = useCallback((id: string) => {
    const scroll = (): boolean => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
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
    [scrollToSection],
  );

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <>
      <div className="fixed top-3 sm:top-4 left-0 right-0 z-50 flex justify-center pointer-events-none px-3 sm:px-4 pt-[env(safe-area-inset-top)] sm:top-6">
        <nav
          id="navigation"
          className={`nav-floating pointer-events-auto max-w-fit px-2.5 sm:px-3 py-2 rounded-full flex items-center justify-center gap-1.5 sm:gap-2 nav-blur ${
            navVisible ? "" : "nav-floating-hidden"
          }`}
          style={{
            backgroundColor: scrolled
              ? "var(--nav-bg-scrolled)"
              : "var(--nav-bg)",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "var(--border)",
            boxShadow: scrolled ? "0 8px 32px var(--shadow-color)" : "none",
          }}
          role="navigation"
          aria-label={t("navigation.main")}
        >
          <a
            href="#home"
            className="flex items-center px-1"
            aria-label={t("navigation.logo")}
          >
            <MagneticButton strength={0.2}>
              <div className="interactive-btn w-10 h-10 bg-[var(--accent)] text-[var(--accent-contrast)] rounded-xl flex items-center justify-center font-bold text-xs shadow-accent">
                EM
              </div>
            </MagneticButton>
          </a>

          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = activeTab === link.name;
              return (
                <MagneticButton key={link.name} strength={0.15}>
                  <button
                    type="button"
                    onClick={(e) => handleNavClick(e, link)}
                    className={`nav-link relative px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest z-10 rounded-full ${
                      isActive ? "nav-link-active" : ""
                    }`}
                    style={{
                      color: isActive
                        ? "var(--text-primary)"
                        : "var(--text-secondary)",
                    }}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.name}
                  </button>
                </MagneticButton>
              );
            })}
          </div>

          <ThemeToggle />

          {/* Locale toggle: EN | SQ */}
          <div
            className="hidden sm:flex items-center rounded-full border p-0.5 gap-0.5"
            role="group"
            aria-label={t("accessibility.switchLanguage")}
            style={{
              borderColor: "var(--border)",
              background: "var(--bg-card)",
            }}
          >
            {(["en", "sq"] as const).map((l) => {
              const active = locale === l;
              return (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLocale(l)}
                  aria-pressed={active}
                  className="px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-200 interactive-btn"
                  style={{
                    background: active ? "var(--accent)" : "transparent",
                    color: active
                      ? "var(--accent-contrast)"
                      : "var(--text-muted)",
                  }}
                >
                  {l.toUpperCase()}
                </button>
              );
            })}
          </div>

          <AdvancedButton
            variant="primary"
            size="sm"
            icon={<Sparkles size={12} />}
            onClick={() => {
              setActiveTab(navLinks[navLinks.length - 1]?.name ?? "");
              scrollToSection("contact");
              setIsOpen(false);
            }}
            className="hidden lg:inline-flex"
          >
            {t("navigation.hireMe")}
          </AdvancedButton>

          <button
            type="button"
            className="lg:hidden p-2 interactive-btn"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={
              isOpen
                ? t("accessibility.closeMenu")
                : t("accessibility.openMenu")
            }
            aria-expanded={isOpen}
            style={{ color: "var(--text-primary)" }}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 nav-overlay nav-menu-enter lg:hidden"
          style={{ backgroundColor: "var(--overlay-bg)" }}
          role="dialog"
          aria-modal="true"
          aria-label={t("navigation.main")}
        >
          <div className="flex flex-col justify-center h-full px-6 sm:px-10">
            <div
              className="flex items-center justify-between px-2 pb-2 border-b"
              style={{ borderColor: "var(--border)" }}
            >
              <span
                className="text-[10px] font-bold uppercase tracking-[0.3em]"
                style={{ color: "var(--text-muted)" }}
              >
                {SITE.name}
              </span>
              <div
                className="flex items-center rounded-full border p-0.5 gap-0.5"
                role="group"
                aria-label={t("accessibility.switchLanguage")}
                style={{ borderColor: "var(--border)" }}
              >
                {(["en", "sq"] as const).map((l) => {
                  const active = locale === l;
                  return (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLocale(l)}
                      aria-pressed={active}
                      className="px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-widest interactive-btn"
                      style={{
                        background: active ? "var(--accent)" : "transparent",
                        color: active
                          ? "var(--accent-contrast)"
                          : "var(--text-muted)",
                      }}
                    >
                      {l.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:gap-6">
              {navLinks.map((link) => {
                const isActive = activeTab === link.name;
                return (
                  <button
                    type="button"
                    key={link.name}
                    onClick={(e) => handleNavClick(e, link)}
                    className="text-left flex items-center justify-between py-2 interactive-btn"
                    style={{
                      color: isActive
                        ? "var(--text-primary)"
                        : "var(--text-secondary)",
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
                      className={
                        isActive ? "text-[var(--accent)]" : "opacity-30"
                      }
                    />
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={(e) =>
                handleNavClick(
                  e,
                  navLinks[navLinks.length - 1] ?? {
                    name: t("navigation.contact"),
                    id: "contact",
                  },
                )
              }
              className="interactive-btn mt-10 sm:mt-12 w-full py-4 bg-[var(--accent)] text-[var(--accent-contrast)] font-bold rounded-2xl text-center text-sm uppercase tracking-widest"
            >
              {t("navigation.getInTouch")}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(Nav);
