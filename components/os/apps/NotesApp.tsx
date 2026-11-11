"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  CalendarDays,
  Tag,
} from "lucide-react";
import { getNotes } from "@/data/i18n";
import { useT, useLocale } from "@/i18n/LocaleProvider";
import { NoteRenderer } from "@/components/notes/Renderer";
import { formatDate, formatReadTime } from "@/lib/format";

/**
 * Notes — editorial reader for the technical articles, inside ELIOS/OS.
 * Full article routes (/notes/[slug]) remain the canonical, shareable form.
 */
const NotesApp: React.FC = () => {
  const t = useT();
  const locale = useLocale();
  const notes = getNotes(locale);
  const intl = locale === "sq" ? "sq" : "en-US";

  const [selectedSlug, setSelectedSlug] = useState<string>(
    notes[0]?.slug ?? "",
  );
  const [mobileList, setMobileList] = useState(false);

  const selected =
    notes.find((n) => n.slug === selectedSlug) ?? notes[0] ?? null;

  return (
    <div className="grid h-full grid-cols-1 md:grid-cols-[15rem_1fr]">
      {/* Article index */}
      <nav
        aria-label={t("notes.title")}
        className={`${mobileList || !selected ? "" : "hidden md:flex"} flex-col gap-1 border-r p-2 overflow-y-auto`}
        style={{
          borderColor: "var(--border)",
          background: "var(--surface-elevated)",
        }}
      >
        <p className="px-1.5 pb-1.5 pt-1 font-mono text-[8px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
          {t("notes.title")} — {notes.length}
        </p>
        {notes.map((note) => {
          const active = selected?.slug === note.slug;
          return (
            <button
              key={note.slug}
              type="button"
              onClick={() => {
                setSelectedSlug(note.slug);
                setMobileList(false);
              }}
              aria-current={active ? "true" : undefined}
              className="interactive-btn group w-full rounded-lg p-2 text-left transition-colors"
              style={{
                background: active ? "var(--pill-border)" : "transparent",
              }}
            >
              <span className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.25em] text-[var(--text-muted)]">
                <CalendarDays size={10} aria-hidden />
                {formatDate(note.date, intl)}
                <span aria-hidden>·</span>
                {formatReadTime(note.readMin, intl)}
              </span>
              <span className="mt-1 block text-[11px] font-bold leading-snug text-[var(--text-primary)]">
                {note.title}
              </span>
            </button>
          );
        })}
        <div
          className="mt-auto border-t pt-2"
          style={{ borderColor: "var(--border)" }}
        >
          <Link
            href="/notes"
            className="interactive-btn flex items-center justify-between rounded-lg px-2 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            {t("notes.blog")}
            <ArrowRight size={12} aria-hidden />
          </Link>
        </div>
      </nav>

      {/* Reader */}
      {selected && (
        <article
          className={`${mobileList ? "hidden md:block" : ""} min-w-0 overflow-y-auto`}
        >
          <button
            type="button"
            onClick={() => setMobileList(true)}
            className="interactive-btn flex items-center gap-1.5 border-b px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-[var(--text-muted)] md:hidden"
            style={{ borderColor: "var(--border)" }}
          >
            <ArrowLeft size={12} aria-hidden /> {t("notes.backToNotes")}
          </button>

          <header
            className="border-b px-5 sm:px-7 pb-5 pt-5"
            style={{ borderColor: "var(--border)" }}
          >
            <p className="flex flex-wrap items-center gap-2 font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
              <Tag size={10} aria-hidden />
              {selected.tags.join(" · ")}
              <span aria-hidden>·</span>
              {formatDate(selected.date, intl)}
            </p>
            <h1 className="font-display mt-2 text-2xl sm:text-3xl font-bold leading-[1.05] tracking-tight text-[var(--text-primary)]">
              {selected.title}
            </h1>
            <p className="mt-2 text-[11px] sm:text-xs leading-relaxed text-[var(--text-secondary)]">
              {selected.summary}
            </p>
          </header>

          <div className="px-5 sm:px-7 py-5 text-sm">
            <NoteRenderer blocks={selected.body} />
          </div>

          <footer
            className="border-t px-5 sm:px-7 py-4"
            style={{ borderColor: "var(--border)" }}
          >
            <Link
              href={`/notes/${selected.slug}`}
              className="interactive-btn inline-flex items-center gap-1.5 rounded-full border border-[var(--border-hover)] px-4 py-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--text-primary)] hover:bg-[var(--pill-bg)]"
            >
              {t("notesApp.openFull")}
              <ExternalLink size={11} strokeWidth={2.25} aria-hidden />
            </Link>
          </footer>
        </article>
      )}
    </div>
  );
};

export default NotesApp;
