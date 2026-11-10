"use client";

import { useEffect, useState } from "react";
import { Star, ExternalLink } from "lucide-react";
import { FEATURED_REPOS } from "@/data/featuredRepos";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RevealSection } from "@/components/RevealSection";

interface Repo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
};

function languageColor(lang: string): string {
  return LANG_COLORS[lang] ?? "#8b5cf6";
}

const FALLBACK: Repo[] = FEATURED_REPOS.map((r) => ({
  name: r.name,
  description: r.description,
  language: r.language,
  stargazers_count: r.stars,
  html_url: r.url,
}));

export function GitHubActivity({
  username = "eliosmernica15",
}: {
  username?: string;
}) {
  // Render the curated fallback immediately (no CLS), then swap in the live
  // public repos when the fetch resolves. Rate-limited or offline visitors
  // simply keep the fallback.
  const [repos, setRepos] = useState<Repo[]>(FALLBACK);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const res = await fetch(
          `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=6&type=owner`,
          { signal: controller.signal },
        );
        if (!res.ok) return; // keep the curated fallback
        const data = (await res.json()) as Array<Repo & { fork: boolean }>;
        const own = data.filter((r) => !r.fork);
        if (own.length > 0) setRepos(own);
      } catch {
        // keep the curated fallback
      }
    }
    void load();
    return () => controller.abort();
  }, [username]);

  return (
    <section
      id="github"
      className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 max-w-7xl mx-auto content-auto relative z-[1]"
      aria-label="Recently updated public repositories"
    >
      <RevealSection>
        <SectionHeader
          eyebrow="Open Source"
          title={
            <>
              What I&apos;m{" "}
              <span className="italic" style={{ color: "var(--text-muted)" }}>
                building.
              </span>
            </>
          }
          subtitle="Public repositories on GitHub, updated live. Falls back to a curated list when rate-limited."
        />
      </RevealSection>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
        {repos.slice(0, 6).map((repo, idx) => (
          <RevealSection key={repo.name} delay={idx * 0.05}>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 rounded-2xl border transition-colors hover:border-[var(--border-hover)] group h-full"
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3
                  className="font-bold text-base group-hover:text-[var(--accent-light)] transition-colors break-all"
                  style={{ color: "var(--text-primary)" }}
                >
                  {repo.name}
                </h3>
                <ExternalLink
                  size={14}
                  className="opacity-40 group-hover:opacity-100 transition-opacity mt-1 shrink-0"
                  aria-hidden
                />
              </div>
              {repo.description && (
                <p
                  className="text-sm leading-relaxed mb-3 line-clamp-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {repo.description}
                </p>
              )}
              <div
                className="flex items-center gap-4 text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                {repo.language && (
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: languageColor(repo.language) }}
                      aria-hidden
                    />
                    {repo.language}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Star size={12} aria-hidden /> {repo.stargazers_count}
                </span>
              </div>
            </a>
          </RevealSection>
        ))}
      </div>
    </section>
  );
}
