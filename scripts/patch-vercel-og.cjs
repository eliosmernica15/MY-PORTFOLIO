/**
 * Postinstall patch for the bundled `@vercel/og/index.node.js` in `next`.
 *
 * Why: Next.js 15.1.6 ships a Windows-broken version of `@vercel/og`. The broken
 * lines do `fileURLToPath(join(import.meta.url, "../…"))` — on Windows, `join`
 * returns a backslash path, which `fileURLToPath` rejects with
 *   TypeError: Invalid URL
 * during `next build` prerender of dynamic opengraph-image routes. The fix is to
 * use `new URL(…, import.meta.url)` so the relative path is always URL-encoded
 * correctly. Upstream fix: vercel/next.js#77650 (released in 15.3.0).
 *
 * We rewrite the three matching lines in place after `npm install`. The patch is
 * idempotent — a re-run on an already-patched file is a no-op. We do NOT use
 * `patch-package` because the target is a single short line and our own
 * controlled script is easier to audit.
 *
 * Lines rewritten (identical across the three sites):
 *   fs.readFileSync(fileURLToPath(join(import.meta.url, "../X")));
 * to:
 *   fs.readFileSync(fileURLToPath(new URL("./X", import.meta.url)));
 */
'use strict';

const fs = require('fs');
const path = require('path');

const target = path.join(
  __dirname,
  '..',
  'node_modules',
  'next',
  'dist',
  'compiled',
  '@vercel',
  'og',
  'index.node.js',
);

if (!fs.existsSync(target)) {
  console.log('[patch-vercel-og] no @vercel/og bundle found, skipping');
  process.exit(0);
}

const original = fs.readFileSync(target, 'utf8');

const replacements = [
  {
    from: 'fs.readFileSync(fileURLToPath(join(import.meta.url, "../noto-sans-v27-latin-regular.ttf")))',
    to:   'fs.readFileSync(fileURLToPath(new URL("./noto-sans-v27-latin-regular.ttf", import.meta.url)))',
    label: 'noto-sans font',
  },
  {
    from: 'fs.readFileSync(fileURLToPath(join(import.meta.url, "../yoga.wasm")))',
    to:   'fs.readFileSync(fileURLToPath(new URL("./yoga.wasm", import.meta.url)))',
    label: 'yoga.wasm',
  },
  {
    from: 'fs.readFileSync(fileURLToPath(join(import.meta.url, "../resvg.wasm")))',
    to:   'fs.readFileSync(fileURLToPath(new URL("./resvg.wasm", import.meta.url)))',
    label: 'resvg.wasm',
  },
];

let patched = original;
let hit = 0;
for (const { from, to, label } of replacements) {
  if (patched.includes(from)) {
    patched = patched.replace(from, to);
    hit++;
    console.log(`[patch-vercel-og] patched ${label}`);
  }
}

if (hit === 0) {
  console.log('[patch-vercel-og] already patched or upstream-fixed, nothing to do');
  process.exit(0);
}

if (hit !== replacements.length) {
  console.warn(`[patch-vercel-og] patched only ${hit}/${replacements.length} sites`);
}

fs.writeFileSync(target, patched, 'utf8');
console.log(`[patch-vercel-og] wrote ${target}`);
