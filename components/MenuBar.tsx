"use client";

import React, { useEffect, useRef, useState, memo } from "react";
import ThemeToggle from "./ThemeToggle";
import { useT, useLocale, useSetLocale } from "@/i18n/LocaleProvider";
import { useOs } from "./os/OsContext";
import { Sparkles, Search } from "lucide-react";

/**
 * ELIOS/OS menu bar — fixed top edge bar.
 * Left: EM monogram + wordmark + active application name.
 * Center (≥md): primary destinations (Projects · Notes · About · Contact).
 * Right: live local clock · EN/SQ · theme · Hire Me.
 *
 * Deliberately no fake status icons (battery/Wi-Fi). Only real,
 * locally-computed information is shown.
 */

// App names shown in the menu bar derive from the section in view.
const APP_FOR_SECTION: Record<string, string> = {
  home: "desktop",
  projects: "finder",
  stack: "finder",
  notes: "notes",
  about: "about",
  resume: "about",
  services: "preferences",
  contact: "mail",
};

const PRIMARY_LINKS = [
  { id: "projects", labelKey: "navigation.projects" },
  { id: "notes", labelKey: "navigation.notes" },
  { id: "about", labelKey: "navigation.about" },
  { id: "contact", labelKey: "navigation.contact" },
] as const;

function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

function useIsMac() {
  const [mac, setMac] = useState(false);
  useEffect(() => {
    setMac(/mac/i.test(window.navigator.platform));
  }, []);
  return mac;
}

const MenuBar: React.FC = () => {
  const t = useT();
  const locale = useLocale();
  const setLocale = useSetLocale();
  const os = useOs();
  const now = useNow();
  const isMac = useIsMac();
  const [activeApp, setActiveApp] = useState<string>("desktop");
  const lastActiveUpdate = useRef(0);

  // Derive the "active application" from the section in view.
  useEffect(() => {
    const sectionIds = Object.keys(APP_FOR_SECTION);
    const observer = new IntersectionObserver(
      (entries) => {
        const stamp = Date.now();
        if (stamp - lastActiveUpdate.current < 200) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          lastActiveUpdate.current = stamp;
          setActiveApp(APP_FOR_SECTION[visible.target.id] ?? "desktop");
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.25, 0.5] },
    );
    const observed: HTMLElement[] = [];
    const observeAll = () => {
      observed.forEach((el) => observer.unobserve(el));
      observed.length = 0;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          observer.observe(el);
          observed.push(el);
        }
      }
    };
    observeAll();
    const timer = window.setTimeout(observeAll, 600);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [locale]);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const clock = now
    ? new Intl.DateTimeFormat(locale === "sq" ? "sq" : "en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now)
    : "--:--:--";

  // Focused OS window wins over the scroll heuristic.
  const focusedApp = os.focused;
  const FOCUSED_LABEL: Record<string, string> = {
    finder: "dock.finder",
    preview: "dock.preview",
    notes: "dock.notes",
    about: "dock.about",
    preferences: "dock.preferences",
    mail: "dock.mail",
    hire: "dock.hireMe",
  };
  const activeAppLabel = focusedApp
    ? t(FOCUSED_LABEL[focusedApp] ?? "dock.desktop")
    : t(`dock.${activeApp}`);

  return (
    <header
      id="navigation"
      role="navigation"
      aria-label={t("navigation.main")}
      className="fixed inset-x-0 top-0 z-50 border-b"
      style={{
        borderColor: "var(--border)",
        background: "var(--nav-bg)",
        backdropFilter: "blur(14px) saturate(1.1)",
        WebkitBackdropFilter: "blur(14px) saturate(1.1)",
      }}
    >
      <div className="mx-auto flex h-11 sm:h-12 max-w-[100rem] items-center justify-between gap-2 px-3 sm:px-5 pt-[env(safe-area-inset-top)]">
        {/* Left: monogram + wordmark + active app */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={scrollTo("home")}
            aria-label={t("navigation.logo")}
            className="interactive-btn flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-[7px] bg-[var(--accent)] font-display text-[10px] sm:text-[11px] font-bold tracking-tight text-[var(--accent-contrast)]"
          >
            EM
          </button>
          <button
            type="button"
            onClick={scrollTo("home")}
            className="interactive-btn font-display text-[11px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[var(--text-primary)]"
          >
            {t("menubar.brand")}
          </button>
          <span
            aria-hidden
            className="hidden sm:inline text-[var(--border-hover)]"
          >
            |
          </span>
          <p
            className="hidden sm:block truncate text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]"
            aria-live="polite"
          >
            {activeAppLabel}
          </p>
        </div>

        {/* Center: primary destinations */}
        <nav
          className="hidden lg:flex items-center gap-1"
          aria-label={t("navigation.main")}
        >
          {PRIMARY_LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={scrollTo(link.id)}
              className="interactive-btn rounded-md px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] hover:bg-[var(--pill-bg)]"
            >
              {t(link.labelKey)}
            </button>
          ))}
        </nav>

        {/* Right: palette · clock · language · theme · hire */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("elios:palette-toggle"))
            }
            aria-label={`${t("palette.label")} (${isMac ? "⌘K" : "Ctrl K"})`}
            title={`${t("palette.label")} — ${isMac ? "⌘K" : "Ctrl K"}`}
            className="interactive-btn inline-flex h-7 items-center gap-1.5 rounded-md border px-2 font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] hover:bg-[var(--pill-bg)]"
            style={{
              borderColor: "var(--border)",
              background: "var(--pill-bg)",
            }}
          >
            <Search size={12} aria-hidden />
            <span className="hidden md:inline">{t("palette.short")}</span>
            <kbd
              aria-hidden
              className="hidden md:inline rounded border border-[var(--border)] bg-[var(--bg-card)] px-1 text-[8px] text-[var(--text-muted)]"
            >
              {isMac ? "⌘K" : "⌃K"}
            </kbd>
          </button>

          <time
            className="hidden sm:block font-mono text-[11px] tabular-nums tracking-wider text-[var(--text-secondary)]"
            suppressHydrationWarning
            aria-hidden="true"
          >
            {clock}
          </time>

          <div
            className="flex items-center rounded-full border p-0.5 gap-0.5"
            role="group"
            aria-label={t("accessibility.switchLanguage")}
            style={{
              borderColor: "var(--border)",
              background: "var(--pill-bg)",
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
                  className="interactive-btn rounded-full px-2 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all duration-200"
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

          <ThemeToggle />

          <button
            type="button"
            onClick={scrollTo("contact")}
            className="interactive-btn hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-3 sm:px-4 py-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.22em] text-[var(--accent-contrast)] transition-transform active:scale-95"
          >
            <Sparkles size={11} strokeWidth={2.5} />
            {t("navigation.hireMe")}
          </button>
        </div>
      </div>
    </header>
  );
};

export default memo(MenuBar);
