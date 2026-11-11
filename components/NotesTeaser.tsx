"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getNotes } from "@/data/i18n";
import { useT, useLocale } from "@/i18n/LocaleProvider";
import { formatDate, formatReadTime } from "@/lib/format";
import { Reveal } from "./motion/Reveal";

/**
 * Notes — an index, not a blog feed. Rows cascade in; arrows nudge.
 */
const NotesTeaser: React.FC = () => {
  const t = useT();
  const locale = useLocale();
  const intl = locale === "sq" ? "sq" : "en-US";
  const latest = getNotes(locale).slice(0, 3);

  return (
    <section
      id="notes"
      aria-labelledby="notes-heading"
      className="border-t px-5 sm:px-8 py-16 sm:py-20"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="mx-auto max-w-6xl">
        <div
          className="flex items-end justify-between gap-6 border-b pb-5"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <Reveal
              as="p"
              variant="rise"
              className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-[var(--accent)]"
            >
              {t("notes.blog")}
            </Reveal>
            <h2
              id="notes-heading"
              className="font-display mt-2 text-4xl sm:text-6xl font-semibold tracking-[-0.02em] text-[var(--text-primary)]"
            >
              <Reveal as="span" variant="mask" delay={90}>
                {t("notes.teaserHeading")}
              </Reveal>
            </h2>
          </div>
          <Link
            href="/notes"
            className="interactive-btn link-draw shrink-0 inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.25em]"
            style={{ color: "var(--accent)" }}
          >
            {t("notes.viewAll")}
            <ArrowRight
              size={13}
              strokeWidth={2.25}
              aria-hidden
              className="arrow-nudge"
            />
          </Link>
        </div>

        <ol>
          {latest.map((note, i) => (
            <li key={note.slug}>
              <Reveal variant="slide" delay={i * 80}>
                <Link
                  href={`/notes/${note.slug}`}
                  className="group row-accent grid grid-cols-[1fr_auto] sm:grid-cols-[9rem_1fr_auto] items-baseline gap-3 sm:gap-6 border-b py-5 pl-4 sm:pl-5 pr-2 sm:pr-4 transition-colors hover:bg-[var(--pill-bg)]"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span className="hidden sm:block font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    {formatDate(note.date, intl)}
                  </span>
                  <span className="min-w-0">
                    <span className="font-display block text-lg sm:text-2xl font-semibold leading-snug tracking-tight text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
                      {note.title}
                    </span>
                    <span className="mt-1 block font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-[var(--text-muted)] sm:hidden">
                      {formatDate(note.date, intl)} ·{" "}
                      {formatReadTime(note.readMin, intl)}
                    </span>
                  </span>
                  <span className="hidden sm:flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--text-muted)]">
                    {formatReadTime(note.readMin, intl)}
                    <ArrowUpRight
                      size={13}
                      aria-hidden
                      className="arrow-nudge"
                    />
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default NotesTeaser;
