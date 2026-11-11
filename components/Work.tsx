"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getProjects } from "@/data/i18n";
import { useT, useLocale } from "@/i18n/LocaleProvider";

/**
 * Work index — two covers (A++(APL), ESMP) then a tight list of the rest.
 * Numbered like a print index. One line per project. Nothing to read twice.
 */

const FEATURED = ["apl", "esmp"] as const;

const Work: React.FC = () => {
  const t = useT();
  const locale = useLocale();
  const projects = getProjects(locale);

  const featured = FEATURED.map((id) => projects.find((p) => p.id === id)!);
  const rest = projects.filter(
    (p) => !FEATURED.includes(p.id as (typeof FEATURED)[number]),
  );

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
            <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-[var(--accent)]">
              {t("work.kicker")}
            </p>
            <h2
              id="work-heading"
              className="font-display mt-2 text-4xl sm:text-6xl font-semibold tracking-[-0.02em] text-[var(--text-primary)]"
            >
              {t("work.title")}
            </h2>
          </div>
          <p className="hidden sm:block max-w-[16rem] text-right font-mono text-[9px] uppercase leading-relaxed tracking-[0.2em] text-[var(--text-muted)]">
            {t("work.count", { count: projects.length })}
          </p>
        </div>

        {/* Two covers */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {featured.map((project, i) => (
            <Link
              key={project.id}
              href={`/project/${project.id}`}
              className="group block border"
              style={{ borderColor: "var(--border)" }}
            >
              <div
                className="overflow-hidden"
                style={{ background: "#1c1a17" }}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  width={1200}
                  height={720}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>
              <div
                className="flex items-baseline justify-between gap-4 border-t px-4 py-3.5"
                style={{ borderColor: "var(--border)" }}
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
                <ArrowUpRight
                  size={20}
                  strokeWidth={1.5}
                  aria-hidden
                  className="shrink-0 text-[var(--text-muted)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]"
                />
              </div>
            </Link>
          ))}
        </div>

        {/* The index */}
        <ol
          className="mt-8 divide-y border"
          style={{ borderColor: "var(--border)" }}
        >
          {rest.map((project, i) => (
            <li key={project.id}>
              <Link
                href={`/project/${project.id}`}
                className="group grid grid-cols-[2.25rem_1fr_auto] sm:grid-cols-[3rem_5.5rem_1fr_auto_auto] items-center gap-3 sm:gap-5 px-3 sm:px-4 py-3 sm:py-4 transition-colors"
                style={{ background: "var(--bg-card)" }}
              >
                <span className="font-mono text-[9px] sm:text-[10px] tabular-nums text-[var(--text-muted)]">
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
                  <span className="block truncate text-[13px] sm:text-sm font-bold text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
                    {project.title}
                  </span>
                  <span className="mt-0.5 block truncate text-[10px] sm:text-[11px] text-[var(--text-secondary)]">
                    {project.description}
                  </span>
                </span>
                <span className="hidden md:block font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--text-muted)]">
                  {project.year}
                </span>
                <ArrowUpRight
                  size={16}
                  strokeWidth={1.5}
                  aria-hidden
                  className="justify-self-end text-[var(--text-muted)] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]"
                />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Work;
