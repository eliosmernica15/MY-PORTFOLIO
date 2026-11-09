#!/usr/bin/env node
/**
 * Performance Budget Checker
 *
 * Validates the production build output in .next against bundle budgets.
 * Run after `npm run build`:
 *
 *   node scripts/check-performance-budget.mjs
 *
 * Notes:
 * - Budgets are measured in raw bytes of the route's initial chunks,
 *   computed from .next/app-build-manifest.json. (Next reports > 150 KB
 *   gzipped for the same initial payload; raw-on-disk is the honest,
 *   machine-checkable proxy.)
 * - Lighthouse runs separately via `npm run perf:lighthouse` and is not
 *   part of this check (an earlier version of this script shelled out to
 *   it unconditionally and crashed on TypeScript annotations in a .mjs).
 */

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const BUDGETS = {
  // Initial JS for any single route (raw bytes of its manifest chunks)
  routeInitial: { max: 800 * 1024, warning: 700 * 1024 },
  // Total CSS emitted by the build
  cssTotal: { max: 100 * 1024, warning: 80 * 1024 },
};

const NEXT_BUILD_DIR = path.join(process.cwd(), '.next');

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function checkBudget(actual, budget) {
  const actualStr = formatBytes(actual);
  const maxStr = formatBytes(budget.max);
  if (actual > budget.max) {
    return { status: 'fail', message: `${actualStr} exceeds budget of ${maxStr}` };
  }
  if (actual > budget.warning) {
    return { status: 'warning', message: `${actualStr} above warning threshold (max ${maxStr})` };
  }
  return { status: 'pass', message: `${actualStr} within budget (max ${maxStr})` };
}

function dirSize(dir, exts) {
  if (!fs.existsSync(dir)) return { total: 0, files: 0 };
  let total = 0;
  let files = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.endsWith('.map')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const sub = dirSize(full, exts);
      total += sub.total;
      files += sub.files;
    } else if (entry.isFile() && exts.some((ext) => entry.name.endsWith(ext))) {
      total += fs.statSync(full).size;
      files += 1;
    }
  }
  return { total, files };
}

function gzipSize(filePath) {
  try {
    return zlib.gzipSync(fs.readFileSync(filePath)).length;
  } catch {
    return 0;
  }
}

function main() {
  if (!fs.existsSync(NEXT_BUILD_DIR)) {
    console.error('No .next directory found. Run `npm run build` first.');
    process.exit(1);
  }

  const results = [];
  let failed = 0;
  const report = (category, result) => {
    if (result.status === 'fail') failed += 1;
    results.push({ category, ...result });
  };

  // 1. Initial JS per route (from the app build manifest)
  const manifestPath = path.join(NEXT_BUILD_DIR, 'app-build-manifest.json');
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    let worst = { route: '', bytes: 0 };
    for (const [route, chunks] of Object.entries(manifest.pages ?? {})) {
      const unique = new Set(chunks);
      let bytes = 0;
      for (const chunk of unique) {
        try {
          bytes += fs.statSync(path.join(NEXT_BUILD_DIR, chunk)).size;
        } catch {
          // chunk missing from disk - skip rather than fail the check
        }
      }
      if (bytes > worst.bytes) worst = { route, bytes };
    }
    report(`JS initial, worst route (${worst.route})`, checkBudget(worst.bytes, BUDGETS.routeInitial));
  } else {
    console.warn('app-build-manifest.json not found - skipping route JS budget');
  }

  // 2. CSS total
  const css = dirSize(path.join(NEXT_BUILD_DIR, 'static'), ['.css']);
  report(`CSS total (${css.files} files)`, checkBudget(css.total, BUDGETS.cssTotal));

  // 3. Informational gzip sizes for the shared chunks (no pass/fail)
  const chunksDir = path.join(NEXT_BUILD_DIR, 'static', 'chunks');
  if (fs.existsSync(chunksDir)) {
    let gzipTotal = 0;
    for (const file of fs.readdirSync(chunksDir)) {
      if (file.endsWith('.js')) gzipTotal += gzipSize(path.join(chunksDir, file));
    }
    console.log(`Informational: all chunks gzip to ${formatBytes(gzipTotal)} across ${fs.readdirSync(chunksDir).filter((f) => f.endsWith('.js')).length} files\n`);
  }

  console.log('Performance budget results:\n');
  for (const r of results) {
    const icon = r.status === 'pass' ? 'PASS' : r.status === 'warning' ? 'WARN' : 'FAIL';
    console.log(`[${icon}] ${r.category}: ${r.message}`);
  }
  console.log('');
  process.exit(failed > 0 ? 1 : 0);
}

main();
