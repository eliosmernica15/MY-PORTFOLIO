// Thin re-export shim during the Vite -> Next.js 15 migration.
// New code should import directly from `src/data/...` or `@data/...`.

export * from './src/data/site';
export * from './src/data/projects';
export * from './src/data/services';
export * from './src/data/education';
export * from './src/data/experience';
export * from './src/data/socials';
export * from './src/data/testimonials';
export * from './src/data/skills';
export * from './src/data/now';
export * from './src/data/notes';
export * from './src/data/featuredRepos';

// Backward-compatible aliases for the legacy top-level names used in
// components that still reference the old constants.ts shape.
import { SITE } from './src/data/site';
export const PERSONAL_INFO = {
  name: SITE.name,
  title: SITE.title,
  summary: SITE.summary,
};

import { SKILLS } from './src/data/skills';
export const SKILLS_PROGRESS = SKILLS.map((name, i) => ({
  name,
  value: 80 - (i % 5) * 5,
}));

export const CONTACT_INFO = {
  email: SITE.email,
  phone: SITE.phone,
  birthday: SITE.birthday,
  location: SITE.location,
};

export const STATS = [
  { value: 12, suffix: '+', label: 'Projects Completed' },
  { value: 3, suffix: '+', label: 'Years Experience' },
  { value: 15, suffix: '+', label: 'Happy Clients' },
  { value: 8, suffix: '+', label: 'Skills Mastered' },
];

// CASE_STUDIES used to live in constants.ts; keep an empty array for back-compat
// until the components are migrated to read from the projects data module.
export const CASE_STUDIES: never[] = [];
