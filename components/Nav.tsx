"use client";

import React, { memo, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useT, useLocale, useSetLocale } from "@/i18n/LocaleProvider";

/**
 * Minimal paper masthead: wordmark left, four destinations right,
 * language switch. No clocks, no status icons, no chrome.
 */

const LINKS = [
  { id: "work", key: "navigation.projects" },
  { id: "notes", key: "navigation.notes" },
  { id: "about", key: "navigation.about" },
  { id: "contact", key: "navigation.contact" },
] as const;

const Nav: React.FC = () => {
  const t = useT();
  const locale = useLocale();
  const setLocale = useSetLocale();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      id="navigation"
      role="navigation"
      aria-label={t("navigation.main")}
      className="fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300"
      style={{
        borderColor: scrolled ? "var(--border)" : "transparent",
        background: scrolled ? "var(--nav-bg-scrolled)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <a
          href="#home"
          onClick={scrollTo("home")}
          className="font-display text-[15px] sm:text-lg font-semibold tracking-tight text-[var(--text-primary)] whitespace-nowrap"
          aria-label={t("navigation.logo")}
        >
          <span className="sm:hidden">
            Elios{" "}
            <em className="italic" style={{ color: "var(--accent)" }}>
              M.
            </em>
          </span>
          <span className="hidden sm:inline">
            Elios{" "}
            <em className="italic" style={{ color: "var(--accent)" }}>
              Mernica.
            </em>
          </span>
        </a>

        <nav className="flex items-center gap-2.5 sm:gap-6">
          {LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={scrollTo(link.id)}
              className="link-draw font-mono text-[8px] sm:text-[11px] uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)] whitespace-nowrap"
            >
              {t(link.key)}
            </a>
          ))}

          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("elios:palette-toggle"))
            }
            aria-keyshortcuts="Control+K Meta+K"
            aria-label={t("palette.label")}
            title={t("palette.label")}
            className="interactive-btn btn-lift inline-flex h-7 sm:h-8 items-center gap-1.5 rounded-md border px-2 font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
            style={{
              borderColor: "var(--border)",
              background: "var(--pill-bg)",
            }}
          >
            <Search size={12} strokeWidth={2.25} aria-hidden />
            <span className="hidden md:inline">{t("palette.short")}</span>
            <kbd
              aria-hidden
              className="hidden sm:inline rounded border px-1 text-[8px]"
              style={{
                borderColor: "var(--border)",
                background: "var(--bg-card)",
                color: "var(--text-muted)",
              }}
            >
              ⌘K
            </kbd>
          </button>

          <div
            className="flex items-center rounded-full border p-0.5"
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
                  className="interactive-btn rounded-full px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-widest transition-colors"
                  style={{
                    background: active ? "var(--text-primary)" : "transparent",
                    color: active ? "var(--bg-primary)" : "var(--text-muted)",
                  }}
                >
                  {l.toUpperCase()}
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default memo(Nav);
