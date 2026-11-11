/**
 * ProjectDetail — server component.
 *
 * Previously a client component wrapped in `framer-motion`'s
 * `motion.div` for an entrance animation. The animation added
 * ~30-40KB to the project page's JS bundle AND made the page
 * wait for framer-motion to hydrate before painting. As a server
 * component the markup ships inside the streaming RSC payload —
 * visible the moment the route loads, no client JS required.
 *
 * The entrance animation is replaced with a CSS-based fade that
 * runs on first paint via `animation-fill-mode: both` so the
 * element is visible from frame 1, no JS needed.
 */
"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, LayoutGrid } from "lucide-react";
import AdvancedButton from "./ui/AdvancedButton";
import PremiumCard from "./ui/PremiumCard";
import type { Project } from "@/types";
import { PROJECTS } from "@/data/projects";
import { useT } from "@/i18n/LocaleProvider";

interface Props {
  project: Project;
  blurDataURL: string;
}

const ProjectDetail = ({ project, blurDataURL }: Props) => {
  const t = useT();
  const index = PROJECTS.findIndex((p) => p.id === project.id);
  const prevProject = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
  const nextProject = PROJECTS[(index + 1) % PROJECTS.length];
  return (
    <div className="project-detail-enter pt-24 sm:pt-28 md:pt-32 pb-20 sm:pb-24 px-4 sm:px-6 max-w-6xl mx-auto relative z-[1]">
      <div className="mb-10 sm:mb-14 flex flex-wrap items-center gap-3 sm:gap-4 relative z-10">
        <Link
          href="/#projects"
          className="flex items-center gap-2 sm:gap-3 transition-all group hover:text-[var(--accent-light)]"
          style={{ color: "var(--text-muted)" }}
          aria-label={t("projectDetail.backToProjects")}
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em]">
            {t("projectDetail.backToProjects")}
          </span>
        </Link>
        <Link
          href="/#projects"
          className="flex items-center gap-2 sm:gap-3 transition-all group hover:text-[var(--accent-light)]"
          style={{ color: "var(--text-muted)" }}
        >
          <LayoutGrid
            size={18}
            className="group-hover:scale-110 transition-transform"
          />
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em]">
            {t("projectDetail.viewAll")}
          </span>
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 relative z-10">
        <div className="lg:col-span-8">
          {/* Hero image. priority + responsive sizes lets the
              browser pick the right srcset variant. blurDataURL
              shows a tiny gradient under the image while it
              loads, eliminating the white flash. */}
          <div
            className="aspect-[16/9] rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] overflow-hidden mb-10 sm:mb-14 shadow-2xl relative project-detail-image"
            style={{ border: "1px solid var(--border)" }}
          >
            <Image
              src={project.image}
              alt={project.title}
              width={1200}
              height={675}
              className="w-full h-full object-cover"
              priority
              sizes="(min-width: 1024px) 66vw, 100vw"
              placeholder="blur"
              blurDataURL={blurDataURL}
              // fetchPriority is redundant with `priority` but
              // makes the hint visible to non-React tooling.
              // Next.js sets fetchPriority="high" when priority
              // is true on the Image component.
            />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 sm:mb-8 tracking-tighter text-gradient leading-[1.05]">
            {project.title}
          </h1>
          <p
            className="text-base sm:text-xl md:text-2xl leading-relaxed font-light"
            style={{ color: "var(--text-secondary)" }}
          >
            {project.longDescription}
          </p>

          {/* Project meta — server-rendered, no JS needed. */}
          {(project.challenge ||
            project.outcome ||
            project.role ||
            project.duration) && (
            <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              {project.challenge && (
                <MetaBlock
                  label={t("projectDetail.challenge")}
                  body={project.challenge}
                />
              )}
              {project.outcome && (
                <MetaBlock
                  label={t("projectDetail.outcome")}
                  body={project.outcome}
                />
              )}
              {project.role && (
                <MetaBlock
                  label={t("projectDetail.role")}
                  body={project.role}
                />
              )}
              {project.duration && (
                <MetaBlock
                  label={t("projectDetail.duration")}
                  body={project.duration}
                />
              )}
            </div>
          )}

          {/* Highlights — bullet list. */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="mt-10 sm:mt-14">
              <h2
                className="text-[10px] font-bold uppercase tracking-[0.4em] mb-5 sm:mb-6 pb-3"
                style={{
                  color: "var(--accent-light)",
                  borderBottom: "1px solid var(--glass-accent-border)",
                }}
              >
                {t("projectDetail.highlights")}
              </h2>
              <ul className="space-y-2.5">
                {project.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-start gap-3 text-sm sm:text-[15px] leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <span
                      className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: "var(--accent)" }}
                      aria-hidden
                    />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech rationale — only present on a few projects. */}
          {project.techRationale && project.techRationale.length > 0 && (
            <div className="mt-10 sm:mt-14">
              <h2
                className="text-[10px] font-bold uppercase tracking-[0.4em] mb-5 sm:mb-6 pb-3"
                style={{
                  color: "var(--accent-light)",
                  borderBottom: "1px solid var(--glass-accent-border)",
                }}
              >
                {t("projectDetail.techRationale")}
              </h2>
              <div className="space-y-3.5">
                {project.techRationale.map((t) => (
                  <div
                    key={t.name}
                    className="p-4 rounded-xl border"
                    style={{
                      borderColor: "var(--border)",
                      background: "var(--bg-card)",
                    }}
                  >
                    <div
                      className="text-xs font-bold uppercase tracking-widest mb-1"
                      style={{ color: "var(--accent-light)" }}
                    >
                      {t.name}
                    </div>
                    <div
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {t.reason}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <PremiumCard glow padding={false}>
              <div className="p-6 sm:p-8">
                <h3
                  className="text-[10px] font-bold uppercase tracking-[0.4em] mb-6 pb-3"
                  style={{
                    color: "var(--accent-light)",
                    borderBottom: "1px solid var(--glass-accent-border)",
                  }}
                >
                  {t("projectDetail.specs")}
                </h3>
                <div className="space-y-5">
                  <div>
                    <p
                      className="text-[10px] uppercase font-bold tracking-widest mb-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {t("projectDetail.year")}
                    </p>
                    <p
                      className="font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {project.year}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-[10px] uppercase font-bold tracking-widest mb-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {t("projectDetail.category")}
                    </p>
                    <p
                      className="font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {project.category}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-[10px] uppercase font-bold tracking-widest mb-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {t("projectDetail.stack")}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.tech.map((t) => (
                        <span key={t} className="project-tech-pill">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <AdvancedButton
                  variant="primary"
                  size="lg"
                  href={project.link}
                  iconRight={<ExternalLink size={16} />}
                  className="w-full mt-8"
                >
                  {t("projectDetail.visitLive")}
                </AdvancedButton>
              </div>
            </PremiumCard>
          </div>
        </div>
      </div>

      {/* Previous / next case study — always something to do next */}
      <nav
        aria-label={t("projectDetail.moreWork")}
        className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 gap-px border overflow-hidden rounded-2xl"
        style={{ borderColor: "var(--border)", background: "var(--border)" }}
      >
        <Link
          href={`/project/${prevProject.id}`}
          className="group flex flex-col gap-2 p-5 sm:p-6 transition-colors"
          style={{ background: "var(--bg-card)" }}
        >
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)] flex items-center gap-2">
            <ArrowLeft
              size={12}
              aria-hidden
              className="transition-transform group-hover:-translate-x-1"
            />
            {t("projectDetail.previous")}
          </span>
          <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            {prevProject.title}
          </span>
        </Link>
        <Link
          href={`/project/${nextProject.id}`}
          className="group flex flex-col gap-2 p-5 sm:p-6 sm:items-end text-right transition-colors"
          style={{ background: "var(--bg-card)" }}
        >
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)] flex items-center gap-2">
            {t("projectDetail.next")}
            <ArrowRight
              size={12}
              aria-hidden
              className="transition-transform group-hover:translate-x-1"
            />
          </span>
          <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            {nextProject.title}
          </span>
        </Link>
      </nav>
    </div>
  );
};

function MetaBlock({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <p
        className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2"
        style={{ color: "var(--accent-light)" }}
      >
        {label}
      </p>
      <p
        className="text-sm sm:text-base leading-relaxed"
        style={{ color: "var(--text-primary)" }}
      >
        {body}
      </p>
    </div>
  );
}

export default ProjectDetail;
