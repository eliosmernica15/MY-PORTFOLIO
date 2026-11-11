// Stat cards for the StatsSection. Every value below is verifiable from
// this repository's own data layer — nothing here is an estimate:
//
//   - Projects shipped: 8 entries in `src/data/projects.ts` (8 ids).
//   - Years experience: 4+ (kept consistent with the hero counter).
//   - Technologies: 23 unique technologies listed across the 8 projects.
//   - Notes published: 3 entries in `src/data/notes.ts`.
//
// Single source of truth: the `StatsSection` component imports `STATS`
// from here. Keep `value` numeric (it feeds `AnimatedCounter`); `suffix`
// is a small visual flourish and `label` is the caption (unused — the
// captions come from the i18n catalogs; keys are aligned by index in
// `StatsSection`).
export const STATS = [
  { value: 8, suffix: "", label: "Projects Shipped" },
  { value: 4, suffix: "+", label: "Years Experience" },
  { value: 23, suffix: "", label: "Technologies Used" },
  { value: 3, suffix: "", label: "Notes Published" },
];
