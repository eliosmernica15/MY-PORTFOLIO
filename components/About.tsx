"use client";

import React from "react";
import { Download, ArrowUpRight } from "lucide-react";
import { SITE } from "@/data/site";
import { useT } from "@/i18n/LocaleProvider";

/**
 * About — one statement, six facts. No timeline, no cards.
 */
const About: React.FC = () => {
  const t = useT();

  const facts: [string, string][] = [
    [t("about.based"), t("about.basedValue")],
    [t("about.languages"), t("about.languagesValue")],
    [t("about.availability"), t("about.values.2")],
    [t("about.experience"), t("about.experienceValue")],
  ];

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="border-t px-5 sm:px-8 py-16 sm:py-20"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-[var(--accent)]">
            {t("about.title")}
          </p>
          <h2
            id="about-heading"
            className="font-display mt-4 text-4xl sm:text-6xl font-semibold leading-[1.0] tracking-[-0.02em] text-[var(--text-primary)]"
          >
            {t("about.subtitle")}
          </h2>
          <p
            className="mt-6 max-w-md text-[15px] sm:text-lg leading-snug"
            style={{ color: "var(--text-secondary)" }}
          >
            {t("about.description")}
          </p>
          <a
            href="/Elios-Mernica-CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="interactive-btn mt-8 inline-flex items-center gap-2 font-bold text-[11px] sm:text-xs uppercase tracking-[0.22em]"
            style={{ color: "var(--text-primary)" }}
          >
            <Download
              size={14}
              strokeWidth={2.25}
              aria-hidden
              style={{ color: "var(--accent)" }}
            />
            {t("resume.downloadCV")}
          </a>
        </div>

        <div className="lg:col-span-5">
          <dl className="border-t" style={{ borderColor: "var(--border)" }}>
            {facts.map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-[6.5rem_1fr] sm:grid-cols-[8rem_1fr] gap-x-4 border-b py-4"
                style={{ borderColor: "var(--border)" }}
              >
                <dt className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-[var(--text-muted)] pt-1">
                  {label}
                </dt>
                <dd className="text-[13px] sm:text-sm font-semibold leading-snug text-[var(--text-primary)]">
                  {value}
                </dd>
              </div>
            ))}
            <div className="grid grid-cols-[6.5rem_1fr] sm:grid-cols-[8rem_1fr] gap-x-4 py-4">
              <dt className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-[var(--text-muted)] pt-1">
                {t("about.contact")}
              </dt>
              <dd className="min-w-0">
                <a
                  href={`mailto:${SITE.email}`}
                  className="inline-flex max-w-full items-center gap-1 text-[13px] sm:text-sm font-semibold text-[var(--text-primary)] transition-colors hover:text-[var(--accent)]"
                >
                  <span className="truncate">{SITE.email}</span>
                  <ArrowUpRight size={13} aria-hidden className="shrink-0" />
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
};

export default About;
