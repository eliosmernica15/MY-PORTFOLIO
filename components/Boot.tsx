"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useT } from "@/i18n/LocaleProvider";

/**
 * ELIOS/OS startup overlay.
 *
 * Design constraints (from the brief):
 *  - Maximum ~1.2s, a visible Skip button, never blocks access to the site.
 *  - Skipped entirely for prefers-reduced-motion and returning visitors.
 *  - Renders nothing during SSR and first paint; the overlay is added
 *    after mount so new visitors see the boot instead of a flash of the page.
 *  - The boot never captures focus permanently; Skip is focusable and
 *    reachable by keyboard.
 */

const BOOT_FLAG = "elios-os-booted-v1";
const STATUS_STEPS = [
  "boot.status1",
  "boot.status2",
  "boot.status3",
  "boot.status4",
] as const;
const BOOT_MS = 1150;
const FADE_MS = 280;

export default function Boot() {
  const t = useT();
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef(0);

  const shouldBoot = () => {
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        return false;
      if (window.localStorage.getItem(BOOT_FLAG) === "1") return false;
    } catch {
      // Storage blocked (private mode etc.): still boot, just skip persistence.
    }
    return true;
  };

  const markBooted = () => {
    try {
      window.localStorage.setItem(BOOT_FLAG, "1");
    } catch {
      /* storage blocked — boot again next visit, fine */
    }
  };

  useEffect(() => {
    if (!shouldBoot()) {
      markBooted();
      return;
    }
    setVisible(true);
    startRef.current = performance.now();

    const tick = (now: number) => {
      // Clamp to [0, BOOT_MS]: rAF timestamps can precede a performance.now()
      // captured in the same effect, which used to yield a negative step and
      // crash the render with an undefined i18n key.
      const elapsed = Math.min(BOOT_MS, Math.max(0, now - startRef.current));
      const linear = Math.min(1, elapsed / BOOT_MS);
      // easeOutCubic so progress feels deliberate, not linear-slow
      const eased = 1 - Math.pow(1 - linear, 3);
      setProgress(eased);
      setStep(
        Math.min(
          STATUS_STEPS.length - 1,
          Math.max(0, Math.floor((elapsed / BOOT_MS) * STATUS_STEPS.length)),
        ),
      );
      if (linear < 1) {
        rafRef.current = window.requestAnimationFrame(tick);
      } else {
        finish();
      }
    };
    rafRef.current = window.requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finish = () => {
    setLeaving(true);
    markBooted();
    window.setTimeout(() => setVisible(false), FADE_MS);
  };

  const skip = () => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    finish();
  };

  const barWidth = useMemo(
    () => `${Math.round(progress * 1000) / 10}%`,
    [progress],
  );

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-label={t("boot.srLabel")}
      className={`fixed inset-0 z-[100] flex flex-col bg-[#000000] text-white transition-opacity duration-300 ease-out ${
        leaving ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Top bar: name + skip */}
      <div className="flex items-center justify-between px-5 sm:px-8 pt-4 sm:pt-6">
        <span className="font-display text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.45em] text-white/50">
          {t("boot.title")}
          <span className="ml-3 text-white/30">{t("boot.version")}</span>
        </span>
        <button
          type="button"
          onClick={skip}
          className="interactive-btn rounded-full border border-white/20 px-4 py-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] text-white/70 transition-colors hover:border-white/50 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {t("boot.skip")} →
        </button>
      </div>

      {/* Center: monogram + progress */}
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <div
          aria-hidden
          className="font-display select-none font-bold leading-none tracking-[-0.05em] text-white"
          style={{ fontSize: "clamp(5rem, 22vw, 11rem)" }}
        >
          EM
        </div>
        <p className="mt-5 sm:mt-7 font-mono text-[10px] sm:text-xs uppercase tracking-[0.35em] text-white/45">
          {t("desktop.osLabel")}{" "}
          <span className="text-white/25">{t("desktop.osVersion")}</span>
        </p>

        <div
          className="mt-8 sm:mt-10 h-px w-48 sm:w-72 bg-white/10 overflow-hidden"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          aria-label={t("boot.srLabel")}
        >
          <div
            className="h-full bg-white transition-[width] duration-75 ease-out"
            style={{ width: barWidth }}
          />
        </div>
        <p
          aria-hidden
          className="mt-4 font-mono text-[10px] sm:text-[11px] tracking-wider text-white/55 min-h-[1.25rem]"
        >
          {t(STATUS_STEPS[step])}
        </p>
      </div>

      {/* Bottom strip: honest boot log line */}
      <div className="px-5 sm:px-8 pb-5 sm:pb-7 flex items-center justify-between font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-white/30">
        <span>elios@kos — tty1</span>
        <span>{t("desktop.mastheadTag")}</span>
      </div>
    </div>
  );
}
