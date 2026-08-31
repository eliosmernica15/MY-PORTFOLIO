import { Star, GitFork, ExternalLink } from 'lucide-react';
import { FEATURED_REPOS } from '@/data/featuredRepos';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { RevealSection } from '@/components/RevealSection';

interface Repo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
  updated_at: string;
}

async function fetchRepos(username: string): Promise<Repo[] | null> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=5`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function GitHubActivity({ username = 'eliosmernica15' }: { username?: string }) {
  const repos = (await fetchRepos(username)) ?? FEATURED_REPOS.map(r => ({
    name: r.name,
    description: r.description,
    language: r.language,
    stargazers_count: r.stars,
    html_url: r.url,
    updated_at: new Date().toISOString(),
  }));

  return (
    <div>
      <RevealSection>
        <SectionHeader
          eyebrow="Open Source"
          title={
            <>
              What I'm <span className="italic" style={{ color: 'var(--text-muted)' }}>building.</span>
            </>
          }
          subtitle="Public repos updated recently. Cached hourly, with a curated fallback for rate-limited scenarios."
        />
      </RevealSection>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
        {repos.map((repo, idx) => (
          <RevealSection key={repo.name} delay={idx * 0.05}>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 rounded-2xl border transition-colors hover:border-[var(--border-hover)] group"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border)',
              }}
              data-cursor-hover
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-bold text-base group-hover:text-[var(--accent-light)] transition-colors" style={{ color: 'var(--text-primary)' }}>
                  {repo.name}
                </h3>
                <ExternalLink size={14} className="opacity-40 group-hover:opacity-100 transition-opacity mt-1 shrink-0" />
              </div>
              {repo.description && (
                <p className="text-sm leading-relaxed mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                  {repo.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                {repo.language && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: languageColor(repo.language) }} />
                    {repo.language}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Star size={12} /> {repo.stargazers_count}
                </span>
              </div>
            </a>
          </RevealSection>
        ))}
      </div>
    </div>
  );
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  HTML: '#e34c26',
  CSS: '#563d7c',
};

function languageColor(lang: string): string {
  return LANG_COLORS[lang] ?? '#8b5cf6';
}
