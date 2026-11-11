"use client";

import React from "react";
import {
  MapPin,
  Download,
  Mail,
  GraduationCap,
  BriefcaseBusiness,
  Sparkles,
} from "lucide-react";
import { SITE } from "@/data/site";
import { getEducation, getExperience, getNow } from "@/data/i18n";
import { useT, useLocale } from "@/i18n/LocaleProvider";
import { formatDate } from "@/lib/format";

/**
 * About This System — the human profile inside ELIOS/OS.
 * Real data only: education, experience, the current NOW line, CV link.
 */
const AboutApp: React.FC = () => {
  const t = useT();
  const locale = useLocale();
  const intl = locale === "sq" ? "sq" : "en-US";
  const education = getEducation(locale);
  const experience = getExperience(locale);
  const nowLine = getNow(locale);

  return (
    <div className="overflow-y-auto px-5 sm:px-7 py-5">
      {/* Identity */}
      <div
        className="flex items-start gap-4 border-b pb-5"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          aria-hidden
          className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl font-display text-2xl sm:text-3xl font-bold text-[var(--accent-contrast)]"
          style={{ background: "var(--accent)" }}
        >
          EM
        </div>
        <div className="min-w-0">
          <h1 className="font-display text-2xl sm:text-3xl font-bold leading-none tracking-tight text-[var(--text-primary)]">
            {SITE.name}
          </h1>
          <p className="mt-1.5 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[var(--text-secondary)]">
            {t("desktop.specRoleValue")}
          </p>
          <p className="mt-2 flex items-center gap-1.5 font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-[var(--text-muted)]">
            <MapPin size={10} aria-hidden />
            {t("desktop.specLocationValue")}
          </p>
          <p
            className="mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.25em]"
            style={{
              borderColor: "var(--border-hover)",
              color: "var(--text-secondary)",
            }}
          >
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] motion-safe:animate-pulse"
            />
            {t("desktop.specStatusValue")}
          </p>
        </div>
      </div>

      {/* Philosophy */}
      <div className="border-b py-4" style={{ borderColor: "var(--border)" }}>
        <p className="os-label">{t("aboutSystem.philosophyLabel")}</p>
        <p className="text-[12px] sm:text-sm leading-relaxed text-[var(--text-secondary)]">
          {t("aboutSystem.philosophy")}
        </p>
      </div>

      {/* Now */}
      <div className="border-b py-4" style={{ borderColor: "var(--border)" }}>
        <p className="os-label flex items-center gap-1.5">
          <Sparkles size={10} aria-hidden /> {t("aboutSystem.nowLabel")}
        </p>
        <p className="text-[11px] sm:text-xs leading-snug text-[var(--text-secondary)]">
          {nowLine}
        </p>
      </div>

      {/* Education */}
      <div className="border-b py-4" style={{ borderColor: "var(--border)" }}>
        <p className="os-label flex items-center gap-1.5">
          <GraduationCap size={11} aria-hidden /> {t("resume.education")}
        </p>
        <ul className="mt-1 space-y-2">
          {education.map((item, i) => (
            <li
              key={i}
              className="grid grid-cols-[5.5rem_1fr] sm:grid-cols-[6.5rem_1fr] gap-x-3 text-[11px] sm:text-xs"
            >
              <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider text-[var(--text-muted)] pt-0.5">
                {item.period}
              </span>
              <span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {item.title}
                </span>
                <span className="block text-[var(--text-muted)]">
                  {item.desc}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Experience */}
      <div className="border-b py-4" style={{ borderColor: "var(--border)" }}>
        <p className="os-label flex items-center gap-1.5">
          <BriefcaseBusiness size={11} aria-hidden /> {t("resume.experience")}
        </p>
        <ul className="mt-1 space-y-2">
          {experience.map((item, i) => (
            <li
              key={i}
              className="grid grid-cols-[5.5rem_1fr] sm:grid-cols-[6.5rem_1fr] gap-x-3 text-[11px] sm:text-xs"
            >
              <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider text-[var(--text-muted)] pt-0.5">
                {item.period}
              </span>
              <span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {item.company}
                </span>
                <span className="block text-[var(--text-muted)]">
                  {item.desc}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTAs */}
      <div className="flex flex-wrap items-center gap-2 pt-4">
        <a
          href="/Elios-Mernica-CV.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="interactive-btn inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--accent-contrast)]"
        >
          <Download size={12} strokeWidth={2.5} aria-hidden />
          {t("resume.downloadCV")}
        </a>
        <a
          href={`mailto:${SITE.email}`}
          className="interactive-btn inline-flex items-center gap-2 rounded-full border border-[var(--border-hover)] px-5 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--text-primary)] hover:bg-[var(--pill-bg)]"
        >
          <Mail size={12} strokeWidth={2.5} aria-hidden />
          {t("desktop.ctaHire")}
        </a>
      </div>
    </div>
  );
};

export default AboutApp;
