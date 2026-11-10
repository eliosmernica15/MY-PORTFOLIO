/**
 * Curated fallback for the GitHubActivity widget when api.github.com is
 * unreachable or rate-limited (60 req/h per IP for unauthenticated calls).
 *
 * IMPORTANT: only real, verifiable public repositories belong here. The
 * banner used to list private/fabricated repos with invented star counts -
 * now it mirrors the account's actual public repos.
 */

export type FeaturedRepo = {
  name: string;
  description: string;
  language: string;
  stars: number;
  url: string;
};

export const FEATURED_REPOS: FeaturedRepo[] = [
  {
    name: "MY-PORTFOLIO",
    description:
      "This very site - Next.js 15 App Router, strict per-request CSP with nonces, hand-rolled service worker.",
    language: "TypeScript",
    stars: 0,
    url: "https://github.com/eliosmernica15/MY-PORTFOLIO",
  },
  {
    name: "veyra-labs",
    description: "Experimental decoder-only Transformer.",
    language: "Python",
    stars: 0,
    url: "https://github.com/eliosmernica15/veyra-labs",
  },
  {
    name: "Google-studio-Discover-Kosova",
    description:
      "Google Studio experiment - discover Kosova with generative UI.",
    language: "TypeScript",
    stars: 0,
    url: "https://github.com/eliosmernica15/Google-studio-Discover-Kosova",
  },
];
