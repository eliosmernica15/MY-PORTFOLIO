"use client";

import React, { useState, useEffect, lazy, Suspense } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, MapPin } from "lucide-react";
import { useDeviceProfile } from "@/hooks/useDeviceProfile";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useT } from "@/i18n/LocaleProvider";

const LazySplineScene = lazy(() => import("./SplineScene"));

/**
 * ELIOS/OS Desktop — the signature opening experience.
 *
 * The desktop is a full-viewport hero environment: the ELIOS/OS wordmark,
 * the design thesis in Space Grotesk, the two defining projects (APL, ESMP)
 * as editorial links, and a monochrome "about this system" panel. All CTAs
 * are ordinary in-page navigation; the dock and menu bar are the OS chrome.
 *
 * Spline is ambient only, lazy, and never loaded on mobile or under
 * prefers-reduced-motion. The section is readable and functional without it.
 */

const FEATURED = [
  {
    id: "apl",
    index: "01",
    nameKey: "desktop.aplName",
    descKey: "desktop.aplDesc",
  },
  {
    id: "esmp",
    index: "02",
    nameKey: "desktop.esmpName",
    descKey: "desktop.esmpDesc",
  },
] as const;

const Desktop: React.FC = () => {
  const t = useT();
  const profile = useDeviceProfile();
  const prefersReducedMotion = useReducedMotion();
  const [loadSpline, setLoadSpline] = useState(false);

  useEffect(() => {
    if (!profile.enable3D || prefersReducedMotion) return;
    let cancelled = false;
    const run = () => {
      if (!cancelled) setLoadSpline(true);
    };
    const delay = 600;
    const id =
      typeof requestIdleCallback !== "undefined"
        ? requestIdleCallback(run, { timeout: delay + 400 })
        : window.setTimeout(run, delay);
    return () => {
      cancelled = true;
      if (typeof cancelIdleCallback !== "undefined")
        cancelIdleCallback(id as number);
      else window.clearTimeout(id);
    };
  }, [profile.enable3D, prefersReducedMotion]);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="home"
      aria-label={t("desktop.mastheadTag")}
      className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden px-4 sm:px-6 pt-16 sm:pt-20 pb-32 sm:pb-36"
    >
      {/* Ambient Spline — decorative, lazy, device-gated */}
      {loadSpline && (
        <div
          aria-hidden
          className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        >
          <Suspense fallback={null}>
            <LazySplineScene />
          </Suspense>
        </div>
      )}
      {/* Blueprint grid — pure CSS, no assets */}
      <div
        aria-hidden
        className="desktop-grid pointer-events-none absolute inset-0 z-[1]"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        {/* Masthead row */}
        <div
          className="pointer-events-none mb-6 sm:mb-10 flex items-center justify-between border-b pb-4"
          style={{ borderColor: "var(--border)" }}
        >
          <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-[var(--text-muted)]">
            {t("desktop.osLabel")}{" "}
            <span className="text-[var(--border-hover)]">/</span>{" "}
            {t("desktop.mastheadTag")}
          </p>
          <p className="hidden sm:block font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--text-muted)]">
            {t("desktop.osVersion")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-end">
          {/* Left: thesis + CTAs + featured work */}
          <div className="lg:col-span-8">
            <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.32em] mb-5 sm:mb-7 text-[var(--text-muted)]">
              {t("desktop.kicker")}
            </p>

            <h1 className="font-display font-bold text-[var(--text-primary)] leading-[0.95] tracking-[-0.035em] text-[clamp(2.55rem,9.5vw,6rem)]">
              {t("desktop.headline")
                .split("\n")
                .map((line, i) => (
                  <span key={i} className="block">
                    {i === 1 ? (
                      <span className="text-outline">{line}</span>
                    ) : (
                      line
                    )}
                    {i === 3 && <span className="text-[var(--accent)]">.</span>}
                  </span>
                ))}
            </h1>

            <p
              className="mt-6 sm:mt-8 max-w-xl text-base sm:text-lg leading-relaxed font-light"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("desktop.lede")}
            </p>
            <p className="mt-3 sm:mt-4 flex items-center gap-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[var(--text-muted)]">
              <MapPin size={12} strokeWidth={2} aria-hidden />
              {t("desktop.location")}
            </p>

            <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={scrollTo("projects")}
                className="interactive-btn inline-flex items-center gap-2 rounded-full bg-[var(--accent)] text-[var(--accent-contrast)] px-6 sm:px-7 py-3 sm:py-3.5 font-bold text-[11px] sm:text-xs uppercase tracking-[0.22em] transition-transform active:scale-95"
              >
                {t("desktop.ctaWork")}
                <ArrowDown size={14} strokeWidth={2.5} aria-hidden />
              </button>
              <button
                type="button"
                onClick={scrollTo("contact")}
                className="interactive-btn inline-flex items-center gap-2 rounded-full border px-6 sm:px-7 py-3 sm:py-3.5 font-bold text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[var(--text-primary)] border-[var(--border-hover)] hover:bg-[var(--pill-bg)] transition-colors"
              >
                {t("desktop.ctaHire")}
                <ArrowUpRight size={14} strokeWidth={2.5} aria-hidden />
              </button>
            </div>

            {/* Featured work — APL first, then ESMP */}
            <div
              className="mt-10 sm:mt-14 border-t"
              style={{ borderColor: "var(--border)" }}
            >
              {FEATURED.map((p) => (
                <Link
                  key={p.id}
                  href={`/project/${p.id}`}
                  className="group featured-row flex items-center gap-5 sm:gap-8 border-b py-4 sm:py-5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span className="font-mono text-[10px] sm:text-[11px] text-[var(--text-muted)] tabular-nums">
                    {p.index}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="font-display block text-lg sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                      {t(p.nameKey)}
                    </span>
                    <span className="mt-1 block text-[11px] sm:text-xs leading-snug text-[var(--text-muted)] max-w-md">
                      {t(p.descKey)}
                    </span>
                  </span>
                  <ArrowUpRight
                    size={20}
                    strokeWidth={1.5}
                    aria-hidden
                    className="shrink-0 text-[var(--text-muted)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--text-primary)]"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Right: about this system */}
          <aside className="lg:col-span-4">
            <div
              className="overflow-hidden rounded-2xl border backdrop-blur-xl"
              style={{
                borderColor: "var(--border-hover)",
                background: "var(--hero-card-bg)",
              }}
            >
              {/* Title bar — squares, not traffic lights (no macOS cosplay) */}
              <div
                className="flex h-9 items-center gap-3 border-b px-4"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--surface-elevated)",
                }}
              >
                <span aria-hidden className="flex items-center gap-1.5">
                  <span className="block h-[5px] w-[5px] rounded-[1px] bg-[var(--accent)]" />
                  <span className="block h-[5px] w-[5px] rounded-[1px] bg-[var(--border-hover)]" />
                  <span className="block h-[5px] w-[5px] rounded-[1px] bg-[var(--border-hover)]" />
                </span>
                <span className="truncate font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
                  {t("desktop.specTitle")}
                </span>
              </div>

              <dl className="px-4 sm:px-5 py-4 sm:py-5 font-mono text-[10px] sm:text-[11px] leading-relaxed">
                {[
                  ["specName", "specNameValue"],
                  ["specRole", "specRoleValue"],
                  ["specFocus", "specFocusValue"],
                  ["specLocation", "specLocationValue"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="grid grid-cols-[5.5rem_1fr] sm:grid-cols-[6.5rem_1fr] gap-x-3 py-2 border-b last:border-b-0"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <dt className="uppercase tracking-[0.22em] text-[var(--text-muted)] text-[8px] sm:text-[9px] pt-0.5">
                      {t(`desktop.${label}`)}
                    </dt>
                    <dd className="text-[var(--text-secondary)]">
                      {t(`desktop.${value}`)}
                    </dd>
                  </div>
                ))}
                <div className="grid grid-cols-[5.5rem_1fr] sm:grid-cols-[6.5rem_1fr] gap-x-3 py-2">
                  <dt className="uppercase tracking-[0.22em] text-[var(--text-muted)] text-[8px] sm:text-[9px] pt-0.5">
                    {t("desktop.specStatus")}
                  </dt>
                  <dd className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] motion-safe:animate-pulse"
                    />
                    {t("desktop.specStatusValue")}
                  </dd>
                </div>
              </dl>

              <div
                className="flex items-center justify-between gap-2 border-t px-4 sm:px-5 py-3 font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-[var(--text-muted)]"
                style={{ borderColor: "var(--border)" }}
              >
                <span>
                  {t("desktop.osLabel")} {t("desktop.osVersion")}
                </span>
                <span>next 15 · react 19</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Desktop;
