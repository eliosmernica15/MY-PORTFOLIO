"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useT } from "@/i18n/LocaleProvider";

/**
 * The paper masthead — an editorial opening scene.
 * Kicker → masked headline lines (terracotta italic with a drawing
 * underline) → lede → artwork wipe → CTAs → proof line.
 * All transform/opacity; reduced-motion users get an instant page.
 */
const Hero: React.FC = () => {
  const t = useT();
  const [inView, setInView] = useState(false);

  useEffect(() => {
    // Kick the entrance on the next frame so the SSR paint happens first.
    const id = window.requestAnimationFrame(() => setInView(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const headline = t("hero.headline").split("\n");
  const fade = (d: number) => ({ "--d": `${d}ms` }) as React.CSSProperties;

  return (
    <section
      id="home"
      aria-label={t("hero.kicker")}
      className={`hero relative overflow-hidden px-5 sm:px-8 pt-24 sm:pt-28 pb-14 sm:pb-20 ${
        inView ? "hero-in" : ""
      }`}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-12">
        {/* Statement */}
        <div className="lg:col-span-7">
          <p
            className="hero-fade font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-[var(--accent)]"
            style={fade(0)}
          >
            {t("hero.kicker")}
          </p>

          <h1 className="font-display mt-5 sm:mt-7 font-semibold leading-[0.98] tracking-[-0.02em] text-[var(--text-primary)] text-[clamp(2.7rem,9.2vw,6.75rem)]">
            <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
              <span
                className="hero-line-inner block"
                style={{ transitionDelay: "80ms" }}
              >
                {headline[0]}
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
              <span
                className="hero-line-inner block italic"
                style={{ transitionDelay: "170ms", color: "var(--accent)" }}
              >
                <span
                  className="hero-underline-draw"
                  style={{ "--line-delay": "680ms" } as React.CSSProperties}
                >
                  {headline[1]}
                </span>
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
              <span
                className="hero-line-inner block"
                style={{ transitionDelay: "260ms" }}
              >
                {headline[2]}
              </span>
            </span>
          </h1>

          <p
            className="hero-fade mt-6 sm:mt-8 max-w-md text-[15px] sm:text-lg leading-snug"
            style={{ ...fade(380), color: "var(--text-secondary)" }}
          >
            {t("hero.lede")}
          </p>

          <div
            className="hero-fade mt-8 sm:mt-10 flex flex-wrap items-center gap-x-6 gap-y-4"
            style={fade(480)}
          >
            <a
              href="#work"
              onClick={scrollTo("work")}
              className="btn-lift inline-flex items-center gap-2 rounded-full px-6 py-3 text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[var(--bg-primary)]"
              style={{ background: "var(--text-primary)" }}
            >
              {t("hero.ctaWork")}
              <ArrowDown
                size={13}
                strokeWidth={2.5}
                aria-hidden
                className="arrow-nudge"
              />
            </a>
            <a
              href="#contact"
              onClick={scrollTo("contact")}
              className="link-draw inline-flex items-center gap-1.5 font-bold text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[var(--text-primary)]"
            >
              {t("hero.ctaHire")}
              <ArrowUpRight
                size={14}
                strokeWidth={2.5}
                aria-hidden
                className="arrow-nudge"
                style={{ color: "var(--accent)" }}
              />
            </a>
          </div>

          <p
            className="hero-fade mt-10 sm:mt-12 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-[var(--text-muted)]"
            style={fade(590)}
          >
            {t("hero.proofLine")}
          </p>
        </div>

        {/* One proof — wipes open */}
        <figure className="lg:col-span-5">
          <Link
            href="/project/apl"
            className="hero-figure group block border"
            style={
              {
                borderColor: "var(--border)",
                "--fig-delay": "300ms",
              } as React.CSSProperties
            }
            aria-label={t("hero.aplLinkLabel")}
          >
            <div className="overflow-hidden" style={{ background: "#1c1a17" }}>
              <Image
                src="/projects/apl.png"
                alt={t("hero.aplImageAlt")}
                width={1200}
                height={900}
                priority
                className="aspect-[4/3] w-full object-cover object-top"
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
