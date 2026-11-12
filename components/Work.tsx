"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getProjects } from "@/data/i18n";
import { useT, useLocale } from "@/i18n/LocaleProvider";
import { useParallax } from "@/hooks/useParallax";
import { Reveal } from "./motion/Reveal";

/**
 * Work index — two covers with restrained parallax, then a numbered
 * index of the rest. Rows slide in; arrows nudge on hover.
 * Project order (PROJECTS / SQ_PROJECTS) is latest-first per the CV.
 * The two featured covers are the two most recent projects.
 */

const FEATURED = ["genpact-hackathon-2026", "em-motors"] as const;

const Work: React.FC = () => {
  const t = useT();
  const locale = useLocale();
  const projects = getProjects(locale);

  const featured = FEATURED.map((id) => projects.find((p) => p.id === id)!);
  const rest = projects.filter(
    (p) => !FEATURED.includes(p.id as (typeof FEATURED)[number]),
  );

  const coverA = useParallax<HTMLDivElement>(30);
  const coverB = useParallax<HTMLDivElement>(30);
  const covers = [coverA, coverB];

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
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
              {t("work.kicker")}
            </Reveal>
            <h2
              id="work-heading"
              className="font-display mt-2 text-4xl sm:text-6xl font-semibold tracking-[-0.02em] text-[var(--text-primary)]"
            >
              <Reveal as="span" variant="mask" delay={90}>
                {t("work.title")}
              </Reveal>
            </h2>
          </div>
          <p className="hidden sm:block max-w-[16rem] text-right font-mono text-[9px] uppercase leading-relaxed tracking-[0.2em] text-[var(--text-muted)]">
            {t("work.count", { count: projects.length })}
          </p>
        </div>

        {/* Two covers — plain render. The clip-path reveal used here never
            opened on some devices/networks, leaving a huge empty gap with an
            invisible cover in it. Covers must always be visible. */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {featured.map((project, i) => (
            <Link
              key={project.id}
              href={`/project/${project.id}`}
              className="panel-frame group block"
              aria-label={project.title}
            >
              <div
                ref={covers[i]}
                className="parallax-frame relative aspect-[16/10]"
                style={{ background: "#0d0d0f" }}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  width={1200}
                  height={750}
                  sizes="(min-width: 768px) 556px, 100vw"
                  priority={i === 0}
                  loading="eager"
                  className="parallax-inner aspect-[16/10] w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                {project.awards?.length ? (
                  <span
                    className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-black/60 px-2.5 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.14em] text-amber-300 backdrop-blur-sm"
                    title={project.awards.join(" · ")}
                  >
                    <span aria-hidden>🏆</span>
                    {project.awards[0].split("—")[0].trim()}
                  </span>
                ) : null}
              </div>
              <div
                className="relative flex items-baseline justify-between gap-4 border-t px-4 py-3.5"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--bg-card)",
                }}
              >
                <div className="min-w-0">
                  <p
                    className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.3em]"
                    style={{ color: "var(--accent)" }}
                  >
                    0{i + 1} · {project.year}
                  </p>
                  <h3 className="font-display mt-1 truncate text-xl sm:text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
                    {project.title}
                  </h3>
                </div>
                <span className="ghost-index" aria-hidden>
                  0{i + 1}
                </span>
                <ArrowUpRight
                  size={20}
                  strokeWidth={1.5}
                  aria-hidden
                  className="arrow-nudge relative shrink-0 text-[var(--text-muted)] group-hover:text-[var(--accent)]"
                />
              </div>
            </Link>
          ))}
        </div>

        {/* The index — rows slide in */}
        <ol
          className="mt-8 divide-y border"
          style={{ borderColor: "var(--border)" }}
        >
          {rest.map((project, i) => (
            <li key={project.id}>
              <Reveal as="div" variant="slide" delay={i * 60}>
                <Link
                  href={`/project/${project.id}`}
                  className="group row-accent grid grid-cols-[2.25rem_1fr_auto] sm:grid-cols-[3rem_5.5rem_1fr_auto_auto] items-center gap-3 sm:gap-5 pl-4 sm:pl-5 pr-3 sm:pr-4 py-3 sm:py-4 transition-colors hover:bg-[var(--pill-bg)]"
                  style={{ background: "var(--bg-card)" }}
                >
                  <span className="font-mono text-[9px] sm:text-[10px] tabular-nums text-[var(--text-muted)] transition-colors group-hover:text-[var(--accent)]">
                    0{i + 3}
                  </span>
                  <span
                    className="relative hidden h-12 overflow-hidden sm:block"
                    style={{ background: "#1c1a17" }}
                  >
                    <Image
                      src={project.image}
                      alt=""
                      fill
                      sizes="88px"
                      className="object-cover object-top"
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5">
                      <span className="block truncate text-[13px] sm:text-sm font-bold text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
                        {project.title}
                      </span>
                      {project.awards?.length ? (
                        <span
                          className="shrink-0 text-[11px] leading-none text-amber-400"
                          title={project.awards.join(" · ")}
                          aria-label={project.awards.join(" · ")}
                        >
                          🏆
                        </span>
                      ) : null}
                    </span>
                    <span
                      className="mt-0.5 block truncate text-[10px] sm:text-[11px]"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {project.awards?.length
                        ? project.awards[0]
                        : project.description}
                    </span>
                  </span>
                  <span className="hidden md:block font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--text-muted)]">
                    {project.year}
                  </span>
                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.5}
                    aria-hidden
                    className="arrow-nudge justify-self-end text-[var(--text-muted)] group-hover:text-[var(--accent)]"
                  />
                </Link>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Work;
