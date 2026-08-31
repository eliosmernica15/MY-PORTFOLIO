// scripts/build-knowledge.mjs
//
// Build-time generator that produces `src/data/knowledge.generated.ts`.
//
// - Imports the data modules from `src/data/`
// - Emits typed KnowledgeEntry[] entries for every project, category,
//   service, skill, note, and the current NOW line
// - Combines them with the hand-written KNOWLEDGE_STATIC entries from
//   `src/data/knowledge.static.ts`
//
// Usage:
//   node scripts/build-knowledge.mjs
//
// Designed to be called by `predev` / `prebuild` npm scripts.

import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');
const SRC_DATA = resolve(ROOT, 'src', 'data');

// --- Helpers -----------------------------------------------------------------

const escapeForSingleQuotes = (value) =>
  String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r?\n/g, '\\n');

const toIntentId = (raw) =>
  String(raw)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

/**
 * Load a TS module by re-parsing its source: Node's strip-types only handles
 * type syntax, so the data files we generate against are pure runtime data
 * that imports cleanly via `import()` once strip-types is enabled.
 *
 * To avoid the experimental flag leaking into end-user commands we re-export
 * a `re.mjs` loader below — but the simplest path that works in Node 22.6+
 * is just `import()` with the flag. Since the script is wired to the
 * `predev`/`prebuild` hook, we re-invoke Node with the flag set.
 */

const importTs = async (relPath) => {
  const abs = resolve(SRC_DATA, relPath);
  return import(pathToFileURL(abs).href);
};

// --- Generation --------------------------------------------------------------

function buildProjectEntries(projects) {
  return projects.map((p) => {
    const id = `project_${toIntentId(p.id)}`;
    const longSlice = String(p.longDescription || '').slice(0, 280);
    const text = `${p.title} — ${p.description}. ${longSlice}`.trim();
    return {
      id,
      intent: id,
      weight: 0.8,
      text,
      related: ['projects', `category_${toIntentId(p.category)}`],
      action: { type: 'open_route', target: `/project/${p.id}` },
    };
  });
}

function buildCategoryEntries(projects) {
  const byCategory = new Map();
  for (const p of projects) {
    const key = p.category || 'Uncategorized';
    if (!byCategory.has(key)) byCategory.set(key, []);
    byCategory.get(key).push(p.title);
  }
  const out = [];
  for (const [name, titles] of byCategory) {
    const id = `category_${toIntentId(name)}`;
    out.push({
      id,
      intent: id,
      weight: 0.6,
      text: `Category: ${name}. Projects: ${titles.join(', ')}`,
    });
  }
  return out;
}

function buildServiceEntries(services) {
  return services.map((s) => {
    const id = `service_${toIntentId(s.id || s.title)}`;
    return {
      id,
      intent: id,
      weight: 0.7,
      text: `${s.title} — ${s.desc}`,
    };
  });
}

function buildSkillEntries(skillCategories) {
  const out = [];
  for (const cat of skillCategories) {
    for (const skill of cat.skills) {
      const id = `skill_${toIntentId(skill.name)}`;
      out.push({
        id,
        intent: id,
        weight: 0.5,
        text: `Skill: ${skill.name} (${cat.name}) — level ${skill.level}/5.`,
        related: [`category_${toIntentId(cat.name)}`],
      });
    }
  }
  return out;
}

function buildNoteEntries(notes) {
  return notes.map((n) => {
    const id = `note_${toIntentId(n.slug)}`;
    return {
      id,
      intent: id,
      weight: 0.6,
      text: `Note: ${n.title} — ${n.summary}`,
      related: n.tags.map((t) => `tag_${toIntentId(t)}`),
      action: { type: 'open_route', target: `/notes/${n.slug}` },
    };
  });
}

function buildNowEntry(now) {
  return {
    id: 'now_current',
    intent: 'now',
    weight: 0.95,
    text: `Right now: ${now.line} (updated ${now.updatedAt}).`,
  };
}

// --- Emission ----------------------------------------------------------------

function entryToSource(entry, indent = '  ') {
  const lines = [`${indent}{`];
  lines.push(`${indent}  id: ${JSON.stringify(entry.id)},`);
  lines.push(`${indent}  intent: ${JSON.stringify(entry.intent)},`);
  lines.push(`${indent}  weight: ${Number(entry.weight).toFixed(2)},`);
  lines.push(`${indent}  text: ${JSON.stringify(entry.text)},`);
  if (entry.related && entry.related.length) {
    lines.push(`${indent}  related: [${entry.related.map((r) => JSON.stringify(r)).join(', ')}],`);
  }
  if (entry.action) {
    lines.push(`${indent}  action: {`);
    lines.push(`${indent}    type: ${JSON.stringify(entry.action.type)},`);
    lines.push(`${indent}    target: ${JSON.stringify(entry.action.target)},`);
    lines.push(`${indent}  },`);
  }
  lines.push(`${indent}},`);
  return lines.join('\n');
}

function emitFile(staticEntries, generatedEntries) {
  const all = [...staticEntries, ...generatedEntries];
  const blocks = all.map((e) => entryToSource(e, '  ')).join('\n');

  const header = [
    '// AUTO-GENERATED by scripts/build-knowledge.mjs. Do not edit by hand.',
    '// Run `node scripts/build-knowledge.mjs` (or `npm run sync:kb`) to regenerate.',
    '/* eslint-disable */',
    '',
    'import type { KnowledgeEntry } from \'./knowledge.static\';',
    '',
    'export const KNOWLEDGE_GENERATED: KnowledgeEntry[] = [',
  ].join('\n');

  const footer = '];\n';

  const body = `${header}\n${blocks}\n${footer}`;
  const outPath = resolve(SRC_DATA, 'knowledge.generated.ts');
  mkdirSync(SRC_DATA, { recursive: true });
  writeFileSync(outPath, body, 'utf8');
  return { outPath, count: all.length };
}

// --- Main --------------------------------------------------------------------

async function main() {
  if (!existsSync(SRC_DATA)) {
    throw new Error(`Expected ${SRC_DATA} to exist`);
  }

  const [site, projects, services, skillsMod, now, notes, staticMod] = await Promise.all([
    importTs('site.ts'),
    importTs('projects.ts'),
    importTs('services.ts'),
    importTs('skills.ts'),
    importTs('now.ts'),
    importTs('notes.ts'),
    importTs('knowledge.static.ts'),
  ]);

  const generated = [
    ...buildProjectEntries(projects.PROJECTS),
    ...buildCategoryEntries(projects.PROJECTS),
    ...buildServiceEntries(services.SERVICES),
    ...buildSkillEntries(skillsMod.SKILL_CATEGORIES),
    ...buildNoteEntries(notes.NOTES),
    buildNowEntry(now.NOW),
  ];

  const { outPath, count } = emitFile(staticMod.KNOWLEDGE_STATIC, generated);

  // Verify a side check: count projects, categories, services, notes, skills.
  const projectCount = projects.PROJECTS.length;
  const categoryCount = new Set(projects.PROJECTS.map((p) => p.category)).size;
  const serviceCount = services.SERVICES.length;
  const skillCount = skillsMod.SKILL_CATEGORIES.reduce(
    (acc, c) => acc + c.skills.length,
    0,
  );
  const noteCount = notes.NOTES.length;
  const staticCount = staticMod.KNOWLEDGE_STATIC.length;

  console.log(
    `[build-knowledge] wrote ${count} entries (${staticCount} static + ${generated.length} generated) to ${outPath}`,
  );
  console.log(
    `[build-knowledge] breakdown: projects=${projectCount}, categories=${categoryCount}, services=${serviceCount}, skills=${skillCount}, notes=${noteCount}`,
  );
  // Touch the site module so unused-import lints stay happy in tooling.
  if (!site.SITE?.name) throw new Error('SITE export missing');
}

main().catch((err) => {
  console.error('[build-knowledge] failed:', err);
  process.exitCode = 1;
});
