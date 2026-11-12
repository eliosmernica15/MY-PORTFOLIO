"use client";

import React from "react";
import { Download, ArrowUpRight } from "lucide-react";
import { SITE } from "@/data/site";
import { useT } from "@/i18n/LocaleProvider";
import { Reveal } from "./motion/Reveal";

/**
 * About — one statement, six facts. Reveals label-first, facts cascade.
 */
const About: React.FC = () => {
  const t = useT();

  const facts: [string, string][] = [
    [t("about.based"), t("about.basedValue")],
    [t("about.languages"), t("about.languagesValue")],
    [t("about.availability"), t("about.availabilityValue")],
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
          <Reveal
            as="p"
            variant="rise"
            className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-[var(--accent)]"
          >
            {t("about.title")}
          </Reveal>
          <h2
            id="about-heading"
            className="font-display mt-4 text-4xl sm:text-6xl font-semibold leading-[1.0] tracking-[-0.02em] text-[var(--text-primary)]"
          >
            <Reveal as="span" variant="mask" delay={80}>
              {t("about.subtitle")}
            </Reveal>
          </h2>
          <Reveal
            as="p"
            variant="rise"
            delay={160}
            className="mt-6 max-w-md text-[15px] sm:text-lg leading-snug"
            style={{ color: "var(--text-secondary)" }}
          >
            {t("about.description")}
          </Reveal>
          <Reveal variant="rise" delay={240}>
            <a
              href="/Elios-Mernica-CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="interactive-btn btn-lift mt-8 inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 font-bold text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[var(--bg-primary)]"
              style={{ background: "var(--accent)" }}
            >
              <Download size={16} strokeWidth={2.5} aria-hidden />
              {t("resume.downloadCV")}
            </a>
          </Reveal>
        </div>

        <div className="lg:col-span-5">
          <dl className="border-t" style={{ borderColor: "var(--border)" }}>
            {facts.map(([label, value], i) => (
              <Reveal
                key={label}
                variant="rise"
                delay={i * 70}
                className="grid grid-cols-[6.5rem_1fr] sm:grid-cols-[8rem_1fr] gap-x-4 border-b py-4"
                style={{ borderColor: "var(--border)" }}
              >
                <dt
                  className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.25em] pt-1"
                  style={{ color: "var(--accent)" }}
                >
                  {label}
                </dt>
                <dd className="text-[13px] sm:text-sm font-semibold leading-snug text-[var(--text-primary)]">
                  {value}
                </dd>
              </Reveal>
            ))}
            <Reveal
              variant="rise"
              delay={facts.length * 70}
              className="grid grid-cols-[6.5rem_1fr] sm:grid-cols-[8rem_1fr] gap-x-4 py-4"
            >
              <dt
                className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.25em] pt-1"
                style={{ color: "var(--accent)" }}
              >
                {t("about.contact")}
              </dt>
              <dd className="min-w-0">
                <a
                  href={`mailto:${SITE.email}`}
                  className="link-draw inline-flex max-w-full items-center gap-1 text-[13px] sm:text-sm font-semibold text-[var(--text-primary)] transition-colors hover:text-[var(--accent)]"
                >
                  <span className="truncate">{SITE.email}</span>
                  <ArrowUpRight
                    size={13}
                    aria-hidden
                    className="arrow-nudge shrink-0"
                  />
                </a>
              </dd>
            </Reveal>
          </dl>
        </div>
      </div>
    </section>
  );
};

export default About;
