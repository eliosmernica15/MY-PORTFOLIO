"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useT } from "@/i18n/LocaleProvider";

/**
 * The paper masthead: one statement, one proof, two actions.
 * Fraunces display, warm paper, terracotta accent. Nothing else.
 */
const Hero: React.FC = () => {
  const t = useT();

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const headline = t("hero.headline").split("\n");
  const headlineLine = (line: string, i: number) =>
    i === 1 ? (
      <em key={i} className="block italic" style={{ color: "var(--accent)" }}>
        {line}
      </em>
    ) : (
      <span key={i} className="block">
        {line}
      </span>
    );

  return (
    <section
      id="home"
      aria-label={t("hero.kicker")}
      className="relative overflow-hidden px-5 sm:px-8 pt-24 sm:pt-28 pb-14 sm:pb-20"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-12">
        {/* Statement */}
        <div className="lg:col-span-7">
          <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-[var(--accent)]">
            {t("hero.kicker")}
          </p>

          <h1 className="font-display mt-5 sm:mt-7 font-semibold leading-[0.98] tracking-[-0.02em] text-[var(--text-primary)] text-[clamp(2.7rem,9.2vw,6.75rem)]">
            {headline.map(headlineLine)}
          </h1>

          <p
            className="mt-6 sm:mt-8 max-w-md text-[15px] sm:text-lg leading-snug"
            style={{ color: "var(--text-secondary)" }}
          >
            {t("hero.lede")}
          </p>

          <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a
              href="#work"
              onClick={scrollTo("work")}
              className="interactive-btn inline-flex items-center gap-2 rounded-full px-6 py-3 text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[var(--bg-primary)]"
              style={{ background: "var(--text-primary)" }}
            >
              {t("hero.ctaWork")}
              <ArrowDown size={13} strokeWidth={2.5} aria-hidden />
            </a>
            <a
              href="#contact"
              onClick={scrollTo("contact")}
              className="interactive-btn inline-flex items-center gap-1.5 font-bold text-[11px] sm:text-xs uppercase tracking-[0.22em]"
              style={{ color: "var(--text-primary)" }}
            >
              {t("hero.ctaHire")}
              <ArrowUpRight
                size={14}
                strokeWidth={2.5}
                aria-hidden
                style={{ color: "var(--accent)" }}
              />
            </a>
          </div>

          <p className="mt-10 sm:mt-12 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-[var(--text-muted)]">
            {t("hero.proofLine")}
          </p>
        </div>

        {/* One proof */}
        <figure className="lg:col-span-5">
          <Link
            href="/project/apl"
            className="group block border"
            style={{ borderColor: "var(--border)" }}
            aria-label={t("hero.aplLinkLabel")}
          >
            <div className="overflow-hidden" style={{ background: "#1c1a17" }}>
              <Image
                src="/projects/apl.png"
                alt={t("hero.aplImageAlt")}
                width={1200}
                height={900}
                priority
                className="aspect-[4/3] w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            </div>
            <figcaption
              className="flex items-baseline justify-between gap-4 border-t px-4 py-3"
              style={{ borderColor: "var(--border)" }}
            >
              <span
                className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.3em]"
                style={{ color: "var(--accent)" }}
              >
                A++(APL) — 2026
              </span>
              <span
                className="truncate text-[10px] sm:text-[11px]"
                style={{ color: "var(--text-secondary)" }}
              >
                {t("hero.aplCaption")}
              </span>
            </figcaption>
          </Link>
        </figure>
      </div>
    </section>
  );
};

export default Hero;
