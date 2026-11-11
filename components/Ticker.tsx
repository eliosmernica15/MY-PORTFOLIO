"use client";

import React, { memo } from "react";
import { useT } from "@/i18n/LocaleProvider";

/**
 * The single marquee: a slim mono ticker between hero and work.
 * Duplicated content makes the -50% translateX loop seamless.
 * Pauses on hover; disabled entirely under reduced motion (CSS).
 */
const Ticker: React.FC = () => {
  const t = useT();
  const line = t("ticker.line");

  return (
    <div
      className="ticker overflow-hidden border-y py-2.5 select-none"
      style={{ borderColor: "var(--border)", background: "var(--bg-primary)" }}
      aria-hidden="true"
    >
      <p className="sr-only">{line}</p>
      <div className="ticker-track">
        {[0, 1].map((copy) => (
          <span
            key={copy}
            className="whitespace-nowrap font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.32em] text-[var(--text-secondary)]"
          >
            {line} <span style={{ color: "var(--accent)" }}>◆</span>{" "}
          </span>
        ))}
      </div>
    </div>
  );
};

export default memo(Ticker);
