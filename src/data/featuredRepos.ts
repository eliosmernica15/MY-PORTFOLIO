export type FeaturedRepo = {
  name: string;
  description: string;
  language: string;
  stars: number;
  url: string;
};

export const FEATURED_REPOS: FeaturedRepo[] = [
  { name: 'apl-plus', description: 'A++(APL) — programming in Albanian, compiles to Python/React/FastAPI.', language: 'Python', stars: 124, url: 'https://github.com/eliosmernica15/apl-plus' },
  { name: 'esmp', description: 'Enterprise marketplace OS — storefront, payments, invoicing, analytics.', language: 'TypeScript', stars: 87, url: 'https://github.com/eliosmernica15/esmp' },
  { name: 'forexpulse', description: 'Trading platform for forex and prop traders — 50+ pairs, live rates.', language: 'JavaScript', stars: 41, url: 'https://github.com/eliosmernica15/forexpulse' },
  { name: 'eltrix-cloud', description: 'AI-powered creative platform for content creation and digital assets.', language: 'TypeScript', stars: 33, url: 'https://github.com/eliosmernica15/eltrix-cloud' },
];
