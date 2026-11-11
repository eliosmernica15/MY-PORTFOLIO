"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getProjects } from "@/data/i18n";
import { useT, useLocale } from "@/i18n/LocaleProvider";

/**
 * Preview — the case-study reader.
 * Compact project switcher up top; below, the shape of a case study:
 * classification → context → challenge → role → architecture → outcome.
 * The canonical, shareable form stays at /project/[id].
 */
const PreviewApp: React.FC = () => {
  const t = useT();
  const locale = useLocale();
  const projects = getProjects(locale);

  const [activeId, setActiveId] = useState("apl");
  const active = projects.find((p) => p.id === activeId) ?? projects[0];

  if (!active) return null;

  return (
    <div className="flex h-full flex-col">
      {/* Switcher */}
      <div
        className="flex shrink-0 items-center gap-1.5 overflow-x-auto border-b px-3 py-2 no-scrollbar"
        style={{
          borderColor: "var(--border)",
          background: "var(--surface-elevated)",
        }}
        role="tablist"
        aria-label={t("dock.preview")}
      >
        {projects.map((p) => {
          const selected = p.id === active.id;
          return (
            <button
              key={p.id}
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveId(p.id)}
              className="interactive-btn shrink-0 rounded-full border px-3 py-1.5 font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.18em] transition-colors"
              style={{
                borderColor: selected ? "var(--accent)" : "var(--border)",
                background: selected ? "var(--accent)" : "transparent",
                color: selected
                  ? "var(--accent-contrast)"
                  : "var(--text-secondary)",
              }}
            >
              {p.title}
            </button>
          );
        })}
      </div>

      {/* Document */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div
          className="relative border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <Image
            src={active.image}
            alt={`${active.title} — ${t("finder.previewAlt")}`}
            width={1200}
            height={480}
            sizes="(min-width: 768px) 30rem, 100vw"
            className="h-32 sm:h-44 w-full object-cover object-top"
            priority={false}
          />
        </div>

        <div className="px-5 sm:px-7 py-5">
          <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
            {active.category} · {active.year}
            {active.duration ? ` · ${active.duration}` : ""}
          </p>
          <h1 className="font-display mt-1.5 text-3xl sm:text-4xl font-bold leading-[0.95] tracking-tight text-[var(--text-primary)]">
            {active.title}
          </h1>
          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            {active.longDescription}
          </p>

          {(active.challenge || active.outcome) && (
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {active.challenge && (
                <div
                  className="rounded-xl border p-3"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--input-bg)",
                  }}
                >
                  <p className="os-label">{t("preview.challenge")}</p>
                  <p className="text-[11px] sm:text-xs leading-snug text-[var(--text-secondary)]">
                    {active.challenge}
                  </p>
                </div>
              )}
              {active.outcome && (
                <div
                  className="rounded-xl border p-3"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--input-bg)",
                  }}
                >
                  <p className="os-label">{t("preview.outcome")}</p>
                  <p className="text-[11px] sm:text-xs leading-snug text-[var(--text-secondary)]">
                    {active.outcome}
                  </p>
                </div>
              )}
            </div>
          )}

          {active.role && (
            <p className="mt-4 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)]">
              {t("preview.role")}:{" "}
              <span className="text-[var(--text-secondary)]">
                {active.role}
              </span>
            </p>
          )}

          <div className="mt-4">
            <p className="os-label">{t("finder.stack")}</p>
            <ul className="flex flex-wrap gap-1.5">
              {active.tech.map((tech) => (
                <li key={tech} className="os-chip">
                  {tech}
                </li>
              ))}
            </ul>
          </div>

          {active.metrics && active.metrics.length > 0 && (
            <div className="mt-4">
              <p className="os-label">{t("preview.metrics")}</p>
              <dl className="grid grid-cols-3 gap-2">
                {active.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-xl border p-2.5 text-center"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <dt className="font-mono text-[7px] sm:text-[8px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                      {m.label}
                    </dt>
                    <dd className="font-display mt-0.5 text-base sm:text-lg font-bold leading-none text-[var(--text-primary)]">
                      {m.value}
                      <span className="text-[9px] font-semibold text-[var(--text-muted)]">
                        {" "}
                        {m.suffix}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        <footer
          className="sticky bottom-0 flex items-center gap-2 border-t px-5 sm:px-7 py-3 backdrop-blur-xl"
          style={{
            borderColor: "var(--border)",
            background: "var(--hero-card-bg)",
          }}
        >
          <Link
            href={`/project/${active.id}`}
            className="interactive-btn inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-4 py-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--accent-contrast)]"
          >
            {t("finder.openCaseStudy")}
            <ArrowRight size={12} strokeWidth={2.5} aria-hidden />
          </Link>
          {active.link && (
            <a
              href={active.link}
              target="_blank"
              rel="noopener noreferrer"
              className="interactive-btn inline-flex items-center gap-1.5 rounded-full border border-[var(--border-hover)] px-4 py-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--text-primary)] hover:bg-[var(--pill-bg)]"
            >
              {t("finder.liveSite")}
              <ArrowUpRight size={12} strokeWidth={2.5} aria-hidden />
            </a>
          )}
        </footer>
      </div>
    </div>
  );
};

export default PreviewApp;
