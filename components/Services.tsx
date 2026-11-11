"use client";

import React from "react";
import { SERVICES } from "@/data/services";
import { useT } from "@/i18n/LocaleProvider";

/**
 * Services — four rows, zero card chrome. What he actually delivers.
 */
const Services: React.FC = () => {
  const t = useT();

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="border-t px-5 sm:px-8 py-16 sm:py-20"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="border-b pb-5" style={{ borderColor: "var(--border)" }}>
          <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-[var(--accent)]">
            {t("services.eyebrow")}
          </p>
          <h2
            id="services-heading"
            className="font-display mt-2 text-4xl sm:text-6xl font-semibold tracking-[-0.02em] text-[var(--text-primary)]"
          >
            {t("services.subtitle")}
          </h2>
        </div>

        <ol>
          {SERVICES.map((service, idx) => (
            <li
              key={service.id}
              className="grid grid-cols-[2.5rem_1fr] sm:grid-cols-[4.5rem_1fr_1.25fr] gap-x-4 sm:gap-x-8 gap-y-1 border-b py-5 sm:py-6"
              style={{ borderColor: "var(--border)" }}
            >
              <span className="font-mono text-[10px] sm:text-xs tabular-nums text-[var(--accent)] pt-1">
                0{idx + 1}
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
                {t(`services.items.${idx}.title`)}
              </h3>
              <p
                className="col-start-2 sm:col-start-3 text-[12px] sm:text-sm leading-snug"
                style={{ color: "var(--text-secondary)" }}
              >
                {t(`services.items.${idx}.description`)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Services;
