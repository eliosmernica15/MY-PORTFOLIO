// Self-rated proficiency bars for the "System Proficiency" card in the
// Resume section. Values match the `52b4575` baseline; the `Resume`
// component reads them and animates each bar from 0 to `value` percent
// when the section scrolls into view.
//
// These are intentionally separate from `SKILL_CATEGORIES` (the modern
// per-skill `{ name, level: 1-5 }` data the Terminal and Assistant
// read). The Resume section wants a single hand-picked set of "what
// I bill myself as proficient in" with a percentage, not the broader
// categorized stack.
export const SKILLS_PROGRESS = [
  { name: 'Web Developer', value: 90 },
  { name: 'Web Design', value: 50 },
  { name: 'IT Systems', value: 60 },
  { name: 'WordPress', value: 80 },
  { name: 'Application Development', value: 70 },
  { name: 'AI Engineer', value: 95 },
];
