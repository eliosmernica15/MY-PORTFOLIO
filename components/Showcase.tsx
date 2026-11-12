"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Trophy } from "lucide-react";
import { getProjects } from "@/data/i18n";
import { useT, useLocale } from "@/i18n/LocaleProvider";
import { Reveal } from "./motion/Reveal";

/**
 * The work, up close — sticky editorial storytelling.
 * Desktop: the chapter list stays pinned while large figures scroll past.
 * Mobile: a simple stacked sequence (no sticky traps on small screens).
 */

const CHAPTER_IDS = ["eltrix-cloud", "apl", "esmp"] as const;

const Showcase: React.FC = () => {
  const t = useT();
  const locale = useLocale();
  const projects = getProjects(locale);

  const chapters = CHAPTER_IDS.map((id) =>
    projects.find((p) => p.id === id)!,
  ).filter(Boolean);

  const [active, setActive] = useState<string>(chapters[0]?.id ?? "apl");
  const figuresRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const figures = figuresRef.current.filter(
      (el): el is HTMLElement => el != null,
    );
    if (figures.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-chapter");
            if (id) setActive(id);
          }
        }
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: 0 },
    );
    figures.forEach((f) => io.observe(f));
    return () => io.disconnect();
  }, [chapters.length]);

  const scrollToFigure = (index: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    figuresRef.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <section
      id="showcase"
      aria-labelledby="showcase-heading"
      className="border-t px-5 sm:px-8 py-16 sm:py-20 scroll-mt-24"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="mx-auto max-w-6xl">
        <p
          id="showcase-kicker"
          className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-[var(--accent)]"
        >
          {t("showcase.kicker")}
        </p>
        <h2 id="showcase-heading" className="sr-only">
          {t("showcase.kicker")}
        </h2>

        {/* Desktop: sticky editorial spread */}
        <div className="mt-6 hidden md:grid grid-cols-12 gap-10">
          {/* Sticky chapter rail */}
          <aside className="col-span-4 sticky top-24 self-start">
            <ol className="divide-y" style={{ borderColor: "var(--border)" }}>
              {chapters.map((chapter, i) => {
                const isActive = chapter.id === active;
                return (
                  <li key={chapter.id} className="relative">
                    <a
                      href={`/project/${chapter.id}`}
                      onClick={scrollToFigure(i)}
                      aria-current={isActive ? "true" : undefined}
                      className="group block py-6"
                    >
                      <span
                        className="font-mono text-[10px] uppercase tracking-[0.35em] transition-colors duration-300"
                        style={{
                          color: isActive
                            ? "var(--accent)"
                            : "var(--text-muted)",
                        }}
                      >
                        0{i + 1} · {chapter.year}
                      </span>
                      <span
                        className="font-display mt-1 block text-3xl xl:text-4xl font-semibold tracking-tight transition-colors duration-300"
                        style={{
                          color: isActive
                            ? "var(--text-primary)"
                            : "var(--text-muted)",
                        }}
                      >
                        {chapter.title}
                      </span>
                      <span
                        className="mt-2 block text-xs leading-snug transition-colors duration-300"
                        style={{
                          color: isActive
                            ? "var(--text-secondary)"
                            : "var(--text-muted)",
                        }}
                      >
                        {chapter.description}
                      </span>
                      {chapter.awards?.length ? (
                        <span className="mt-2 inline-flex max-w-full items-center gap-1.5 font-mono text-[8px] sm:text-[9px] font-bold uppercase leading-snug tracking-[0.12em] text-amber-500">
                          <Trophy
                            size={11}
                            strokeWidth={2.5}
                            aria-hidden
                            className="shrink-0"
                          />
                          <span
                            className="truncate"
                            title={chapter.awards.join(" · ")}
                          >
                            {chapter.awards[0]}
                          </span>
                        </span>
                      ) : null}
                      <span
                        aria-hidden
                        className="absolute left-0 top-0 h-full w-[2px] transition-all duration-500"
                        style={{
                          background: isActive
                            ? "var(--accent)"
                            : "transparent",
                        }}
                      />
                    </a>
                  </li>
                );
              })}
            </ol>
            <Link
              href={`/project/${active}`}
              className="interactive-btn mt-8 inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.25em]"
              style={{ color: "var(--text-primary)" }}
            >
              {t("showcase.openCaseStudy")}
              <ArrowRight
                size={12}
                strokeWidth={2.5}
                aria-hidden
                className="arrow-nudge"
              />
            </Link>
          </aside>

          {/* Scrolling figures */}
          <div className="col-span-8 flex flex-col">
            {chapters.map((chapter, i) => (
              <figure
                key={chapter.id}
                data-chapter={chapter.id}
                ref={(el) => {
                  figuresRef.current[i] = el;
                }}
                className="flex min-h-[78vh] flex-col justify-center border-l pl-10"
                style={{ borderColor: "var(--border)" }}
              >
                <Reveal variant="clip" className="block w-full">
                  <Link
                    href={`/project/${chapter.id}`}
                    aria-label={chapter.title}
                    className="panel-frame group block"
                  >
                    <div
                      className="skeleton-shimmer relative overflow-hidden"
                      style={{ background: "#0d0d0f" }}
                    >
                      <Image
                        src={chapter.image}
                        alt={chapter.title}
                        width={1400}
                        height={880}
                        sizes="(min-width: 768px) 660px, 100vw"
                        loading="eager"
                        priority={i === 0}
                        className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                      />
                      <span
                        aria-hidden
                        className="pointer-events-none absolute left-3 top-3 rounded-full border px-3 py-1 font-mono text-[8px] font-bold uppercase tracking-[0.3em]"
                        style={{
                          borderColor: "rgba(250,247,242,0.18)",
                          background: "rgba(13,13,15,0.55)",
                          color: "#FAF7F2",
                          backdropFilter: "blur(6px)",
                        }}
                      >
                        Case 0{i + 1}
                      </span>
                    </div>
                  </Link>
                </Reveal>
                <figcaption className="mt-4 flex items-baseline justify-between gap-4">
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
                      {chapter.category} · {chapter.year}
                    </span>
                    {chapter.awards?.length ? (
                      <span className="inline-flex items-center gap-1.5 font-mono text-[8px] sm:text-[9px] font-bold uppercase leading-snug tracking-[0.12em] text-amber-500">
                        <Trophy
                          size={11}
                          strokeWidth={2.5}
                          aria-hidden
                          className="shrink-0"
                        />
                        <span
                          className="truncate"
                          title={chapter.awards.join(" · ")}
                        >
                          {chapter.awards[0]}
                        </span>
                      </span>
                    ) : null}
                  </span>
                  <Link
                    href={`/project/${chapter.id}`}
                    className="link-draw inline-flex shrink-0 items-center gap-1 font-bold text-[10px] uppercase tracking-[0.25em]"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {t("showcase.openCaseStudy")}
                    <ArrowUpRight
                      size={11}
                      aria-hidden
                      className="arrow-nudge"
                    />
                  </Link>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* Mobile: stacked editorial cards */}
        <div className="mt-6 flex flex-col gap-8 md:hidden">
          {chapters.map((chapter, i) => (
            <Link
              key={chapter.id}
              href={`/project/${chapter.id}`}
              className="group block border"
              style={{ borderColor: "var(--border)" }}
            >
              <div
                className="skeleton-shimmer overflow-hidden"
                style={{ background: "#1c1a17" }}
              >
                <Image
                  src={chapter.image}
                  alt={chapter.title}
                  width={1200}
                  height={750}
                  sizes="100vw"
                  loading="eager"
                  className="aspect-[16/10] w-full object-cover object-top"
                />
              </div>
              <div
                className="border-t px-4 py-4"
                style={{ borderColor: "var(--border)" }}
              >
                <p
                  className="font-mono text-[8px] uppercase tracking-[0.3em]"
                  style={{ color: "var(--accent)" }}
                >
                  0{i + 1} · {chapter.year}
                </p>
                <h3 className="font-display mt-1 text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
                  {chapter.title}
                </h3>
                <p
                  className="mt-1 text-[12px] leading-snug"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {chapter.description}
                </p>
                {chapter.awards?.length ? (
                  <p className="mt-2 inline-flex max-w-full items-center gap-1.5 font-mono text-[8px] font-bold uppercase leading-snug tracking-[0.12em] text-amber-500">
                    <Trophy
                      size={11}
                      strokeWidth={2.5}
                      aria-hidden
                      className="shrink-0"
                    />
                    <span
                      className="truncate"
                      title={chapter.awards.join(" · ")}
                    >
                      {chapter.awards[0]}
                    </span>
                  </p>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Showcase;
