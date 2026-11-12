"use client";

import React, { memo, useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useT } from "@/i18n/LocaleProvider";

/**
 * Elegant back-to-top: a small ink disc that rises into view after
 * one screen of scroll. Smooth scroll on capable systems, instant
 * under reduced motion.
 */
const BackToTop: React.FC = () => {
  const t = useT();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () =>
      setVisible(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label={t("accessibility.backToTop")}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`interactive-btn fixed bottom-5 sm:bottom-6 left-1/2 z-[65] flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border transition-all duration-500 ${
        visible
          ? "opacity-100 translate-y-0"
          : "pointer-events-none opacity-0 translate-y-4"
      }`}
      style={{
        borderColor: "var(--border-hover)",
        background: "var(--text-primary)",
        color: "var(--bg-primary)",
        boxShadow: "0 14px 34px rgba(28,26,23,0.28)",
      }}
    >
      <ArrowUp size={16} strokeWidth={2.25} aria-hidden />
    </button>
  );
};

export default memo(BackToTop);
