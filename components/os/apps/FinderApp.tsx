"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Folder,
  Star,
  ChevronRight,
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  Globe,
} from "lucide-react";
import { getProjects } from "@/data/i18n";
import { useT, useLocale } from "@/i18n/LocaleProvider";

/**
 * Finder — the project collection, browsed like a file manager.
 * Sidebar (collections) → list column → detail pane.
 * Keyboard: arrow keys move the selection, Enter opens the preview.
 */

type Collection = "all" | "featured" | string;

const FEATURED = new Set(["esmp", "apl", "eltrix-cloud"]);

const FinderApp: React.FC = () => {
  const t = useT();
  const locale = useLocale();
  const projects = useMemo(() => getProjects(locale), [locale]);

  const collections = useMemo(() => {
    const cats = Array.from(new Set(projects.map((p) => p.category))).sort();
    return [
      { id: "all", label: t("finder.all"), count: projects.length },
      { id: "featured", label: t("finder.featured"), count: FEATURED.size },
      ...cats.map((c) => ({
        id: c,
        label: c,
        count: projects.filter((p) => p.category === c).length,
      })),
    ];
  }, [projects, t]);

  const [collection, setCollection] = useState<Collection>("all");
  const [selectedId, setSelectedId] = useState<string>(projects[0]?.id ?? "");
  const [mobileDetail, setMobileDetail] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const visible = useMemo(() => {
    if (collection === "all") return projects;
    if (collection === "featured")
      return projects.filter((p) => FEATURED.has(p.id));
    return projects.filter((p) => p.category === collection);
  }, [projects, collection]);

  const selected =
    visible.find((p) => p.id === selectedId) ?? visible[0] ?? null;

  // Keep selection inside the visible collection.
  useEffect(() => {
    if (selected && selected.id !== selectedId) setSelectedId(selected.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection]);

  const onListKeyDown = (e: React.KeyboardEvent) => {
    if (!visible.length) return;
    const idx = visible.findIndex((p) => p.id === (selected?.id ?? ""));
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const next =
        (idx + (e.key === "ArrowDown" ? 1 : -1) + visible.length) %
        visible.length;
      setSelectedId(visible[next].id);
      listRef.current
        ?.querySelector<HTMLButtonElement>(
          `[data-project-id="${visible[next].id}"]`,
        )
        ?.focus();
    } else if (e.key === "Enter" && selected) {
      setMobileDetail(true);
    }
  };

  return (
    <div className="grid h-full grid-cols-[7.5rem_1fr] md:grid-cols-[9.5rem_15rem_1fr]">
      {/* Sidebar — collections */}
      <nav
        aria-label={t("finder.collections")}
        className="flex flex-col gap-0.5 border-r p-2"
        style={{
          borderColor: "var(--border)",
          background: "var(--surface-elevated)",
        }}
      >
        <p className="px-1.5 pb-1.5 pt-1 font-mono text-[8px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
          {t("finder.collections")}
        </p>
        {collections.map((c) => {
          const active = collection === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setCollection(c.id)}
              aria-pressed={active}
              className={`interactive-btn flex w-full items-center gap-1.5 rounded-lg px-1.5 py-1.5 text-left text-[10px] font-semibold transition-colors ${
                active
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)]"
              }`}
              style={{
                background: active ? "var(--pill-border)" : "transparent",
              }}
            >
              {c.id === "featured" ? (
                <Star size={11} aria-hidden className="shrink-0" />
              ) : (
                <Folder size={11} aria-hidden className="shrink-0" />
              )}
              <span className="min-w-0 flex-1 truncate">{c.label}</span>
              <span className="font-mono text-[8px] tabular-nums text-[var(--text-muted)]">
                {c.count}
              </span>
            </button>
          );
        })}
      </nav>

      {/* List column */}
      <div
        ref={listRef}
        role="listbox"
        aria-label={t("finder.projectsLabel")}
        aria-activedescendant={selected ? `finder-${selected.id}` : undefined}
        onKeyDown={onListKeyDown}
        className={`${mobileDetail ? "hidden md:block" : ""} overflow-y-auto border-r p-1.5`}
        style={{ borderColor: "var(--border)" }}
      >
        {visible.length === 0 && (
          <p className="p-3 text-[10px] text-[var(--text-muted)]">
            {t("finder.empty")}
          </p>
        )}
        {visible.map((p) => {
          const active = selected?.id === p.id;
          return (
            <button
              key={p.id}
              id={`finder-${p.id}`}
              data-project-id={p.id}
              type="button"
              role="option"
              aria-selected={active}
              onClick={() => {
                setSelectedId(p.id);
                setMobileDetail(true);
              }}
              className="interactive-btn group flex w-full items-center gap-2 rounded-lg p-1.5 text-left transition-colors"
              style={{
                background: active ? "var(--pill-border)" : "transparent",
              }}
            >
              <span
                aria-hidden
                className="flex h-9 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border font-mono text-[9px] font-bold text-[var(--text-muted)]"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--input-bg)",
                }}
              >
                {p.year.slice(2)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[11px] font-bold text-[var(--text-primary)]">
                  {p.title}
                </span>
                <span className="block truncate font-mono text-[8px] uppercase tracking-widest text-[var(--text-muted)]">
                  {p.category}
                </span>
              </span>
              <ChevronRight
                size={12}
                aria-hidden
                className={`shrink-0 text-[var(--text-muted)] transition-transform ${
                  active ? "translate-x-0.5 text-[var(--text-secondary)]" : ""
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Detail pane */}
      <div
        className={`${mobileDetail ? "" : "hidden md:block"} min-w-0 overflow-y-auto`}
      >
        {selected && (
          <article className="flex h-full flex-col">
            <button
              type="button"
              onClick={() => setMobileDetail(false)}
              className="interactive-btn flex items-center gap-1.5 border-b px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--text-muted)] md:hidden"
              style={{ borderColor: "var(--border)" }}
            >
              <ArrowLeft size={12} aria-hidden /> {t("finder.backToList")}
            </button>

            <div
              className="relative border-b"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="relative h-28 sm:h-36 md:h-40 w-full overflow-hidden">
                <Image
                  src={selected.image}
                  alt={`${selected.title} — ${t("finder.previewAlt")}`}
                  fill
                  sizes="(min-width: 768px) 25vw, 100vw"
                  className="object-cover object-top"
                  priority={false}
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, var(--bg-card) 100%)",
                  }}
                />
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-3 p-4 sm:p-5">
              <div>
                <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
                  {selected.category} · {selected.year}
                </p>
                <h2 className="font-display mt-1 text-2xl sm:text-3xl font-bold leading-none tracking-tight text-[var(--text-primary)]">
                  {selected.title}
                </h2>
              </div>

              <p className="text-[11px] sm:text-xs leading-relaxed text-[var(--text-secondary)]">
                {selected.description}
              </p>

              <div>
                <p className="os-label">{t("finder.stack")}</p>
                <ul className="flex flex-wrap gap-1.5">
                  {selected.tech.map((tech) => (
                    <li key={tech} className="os-chip">
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="mt-auto flex items-center gap-2 border-t pt-3"
                style={{ borderColor: "var(--border)" }}
              >
                <Link
                  href={`/project/${selected.id}`}
                  className="interactive-btn inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-4 py-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--accent-contrast)]"
                >
                  {t("finder.openCaseStudy")}
                  <ArrowRight size={12} strokeWidth={2.5} aria-hidden />
                </Link>
                {selected.link && (
                  <a
                    href={selected.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="interactive-btn inline-flex items-center gap-1.5 rounded-full border border-[var(--border-hover)] px-4 py-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--text-primary)] hover:bg-[var(--pill-bg)]"
                  >
                    {t("finder.liveSite")}
                    <ArrowUpRight size={12} strokeWidth={2.5} aria-hidden />
                  </a>
                )}
                <Globe
                  size={12}
                  aria-hidden
                  className="ml-auto text-[var(--text-muted)]"
                />
              </div>
            </div>
          </article>
        )}
      </div>
    </div>
  );
};

export default FinderApp;
