"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { SITE } from "@/data/site";
import { CONTACT_INFO } from "@/data/contact-info";
import { useT } from "@/i18n/LocaleProvider";

/**
 * Colophon footer — a small type specimen note and the two true links.
 */
const Footer: React.FC = () => {
  const t = useT();
  const year = new Date().getFullYear();

  const links = [
    { label: "GitHub", href: "https://github.com/eliosmernica15" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/elios-mernica-880562204/",
    },
    { label: "Instagram", href: "https://www.instagram.com/e_mer03/" },
  ];

  return (
    <footer
      className="border-t px-5 sm:px-8 py-10"
      style={{ borderColor: "var(--border)", background: "var(--bg-primary)" }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
              Elios{" "}
              <em className="italic" style={{ color: "var(--accent)" }}>
                Mernica.
              </em>
            </p>
            <p className="mt-1 font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
              {t("footer.tagline")}
            </p>
          </div>

          <nav
            aria-label={t("navigation.main")}
            className="flex flex-wrap items-center gap-x-6 gap-y-2"
          >
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer me"
                className="interactive-btn inline-flex items-center gap-1 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
              >
                {link.label}
                <ArrowUpRight size={11} aria-hidden />
              </a>
            ))}
            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className="interactive-btn font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--text-primary)] transition-colors hover:text-[var(--accent)]"
            >
              {t("footer.email")}
            </a>
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(new CustomEvent("elios:palette-toggle"))
              }
              aria-keyshortcuts="Control+K Meta+K"
              title={t("palette.label")}
              className="interactive-btn inline-flex items-center gap-1 rounded border border-[var(--border)] bg-[var(--pill-bg)] px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
            >
              ⌘K
            </button>
          </nav>
        </div>

        <div
          className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 border-t pt-5 font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)]"
          style={{ borderColor: "var(--border)" }}
        >
          <p>
            © {year} {SITE.name} — {t("footer.rights")}
          </p>
          <p>{t("footer.colophon")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
