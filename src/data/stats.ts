// Stat cards for the StatsSection. Values match the `52b4575` baseline
// (pre-f252738 portfolio): four headline numbers for the home page.
//
// If you want to update these, this is the single source of truth — the
// `StatsSection` component imports `STATS` from here and renders one card
// per entry. Keep `value` numeric (it feeds the `AnimatedCounter`); the
// `suffix` is a small visual flourish (e.g. `'+'`) and the `label` is the
// caption under the number.
export const STATS = [
  { value: 12, suffix: '+', label: 'Projects Completed' },
  { value: 3, suffix: '+', label: 'Years Experience' },
  { value: 15, suffix: '+', label: 'Happy Clients' },
  { value: 8, suffix: '+', label: 'Skills Mastered' },
];
