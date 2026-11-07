#!/usr/bin/env node
/**
 * Performance Budget Checker
 *
 * Validates build output against performance budgets:
 * - Bundle size limits
 * - Asset size limits
 * - Resource count limits
 * - Lighthouse CI integration
 *
 * Usage: node scripts/check-performance-budget.mjs
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// ============================================================
// Budget Configuration
// ============================================================

const BUDGETS = {
  // JavaScript bundle budgets (gzipped)
  javascript: {
    initial: { max: 120 * 1024, warning: 100 * 1024 }, // 120KB max, 100KB warning
    total: { max: 200 * 1024, warning: 170 * 1024 },   // 200KB max, 170KB warning
  },
  // CSS budgets (gzipped)
  css: {
    initial: { max: 50 * 1024, warning: 40 * 1024 },   // 50KB max, 40KB warning
    total: { max: 80 * 1024, warning: 65 * 1024 },    // 80KB max, 65KB warning
  },
  // Total asset budgets
  total: {
    max: 500 * 1024, // 500KB max total
    warning: 400 * 1024,
  },
  // Resource count budgets
  resources: {
    js: { max: 10, warning: 8 },
    css: { max: 5, warning: 4 },
    fonts: { max: 4, warning: 3 },
    images: { max: 20, warning: 15 },
    total: { max: 40, warning: 30 },
  },
  // Lighthouse score thresholds
  lighthouse: {
    performance: { min: 90, warning: 95 },
    accessibility: { min: 100, warning: 100 },
    'best-practices': { min: 100, warning: 100 },
    seo: { min: 100, warning: 100 },
  },
  // Core Web Vitals
  webVitals: {
    'first-contentful-paint': { max: 2000, warning: 1500 }, // ms
    'largest-contentful-paint': { max: 2500, warning: 2000 }, // ms
    'cumulative-layout-shift': { max: 0.05, warning: 0.01 },
    'total-blocking-time': { max: 100, warning: 50 }, // ms
    'speed-index': { max: 3000, warning: 2500 }, // ms
    'interactive': { max: 3000, warning: 2500 }, // ms
  },
};

const NEXT_BUILD_DIR = path.join(process.cwd(), '.next');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

// ============================================================
// Utility Functions
// ============================================================

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatMs(ms: number): string {
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

function checkBudget(actual: number, budget: { max: number; warning: number }, unit: string): { status: 'pass' | 'warning' | 'fail'; message: string } {
  const actualStr = unit === 'ms' ? formatMs(actual) : formatBytes(actual);
  const maxStr = unit === 'ms' ? formatMs(budget.max) : formatBytes(budget.max);
  const warningStr = unit === 'ms' ? formatMs(budget.warning) : formatBytes(budget.warning);

  if (actual > budget.max) {
    return {
      status: 'fail',
      message: `❌ ${actualStr} exceeds budget of ${maxStr} (warning at ${warningStr})`,
    };
  }
  if (actual > budget.warning) {
    return {
      status: 'warning',
      message: `⚠️ ${actualStr} exceeds warning threshold of ${warningStr} (max ${maxStr})`,
    };
  }
  return {
    status: 'pass',
    message: `✅ ${actualStr} within budget (max ${maxStr}, warning ${warningStr})`,
  };
}

// ============================================================
// Bundle Analysis
// ============================================================

async function analyzeBundle(): Promise<{
  jsSizes: { initial: number; total: number; files: string[] };
  cssSizes: { initial: number; total: number; files: string[] };
  assetCounts: { js: number; css: number; fonts: number; images: number; total: number };
}> {
  const jsFiles: string[] = [];
  const cssFiles: string[] = [];
  let jsInitial = 0;
  let jsTotal = 0;
  let cssInitial = 0;
  let cssTotal = 0;
  let fontCount = 0;
  let imageCount = 0;

  // Analyze Next.js build output
  const buildDir = path.join(NEXT_BUILD_DIR, 'static');
  if (fs.existsSync(buildDir)) {
    const chunksDir = path.join(buildDir, 'chunks');
    if (fs.existsSync(chunksDir)) {
      const chunkFiles = fs.readdirSync(chunksDir);
      for (const file of chunkFiles) {
        const filePath = path.join(chunksDir, file);
        const stats = fs.statSync(filePath);
        const size = stats.size;

        if (file.endsWith('.js')) {
          jsFiles.push(file);
          jsTotal += size;
          if (file.includes('main') || file.includes('app') || file.includes('pages')) {
            jsInitial += size;
          }
        }
      }
    }

    const cssDir = path.join(buildDir, 'css');
    if (fs.existsSync(cssDir)) {
      const cssFiles = fs.readdirSync(cssDir);
      for (const file of cssFiles) {
        const filePath = path.join(cssDir, file);
        const stats = fs.statSync(filePath);
        const size = stats.size;

        cssFiles.push(file);
        cssTotal += size;
        if (file.includes('main') || file.includes('app') || file.includes('pages')) {
          cssInitial += size;
        }
      }
    }
  }

  // Count assets in public directory
  if (fs.existsSync(PUBLIC_DIR)) {
    const countAssets = (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          countAssets(fullPath);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (['.woff', '.woff2', '.ttf', '.otf', '.eot'].includes(ext)) {
            fontCount++;
          } else if (['.png', '.jpg', '.jpeg', '.webp', '.avif', '.svg', '.gif', '.ico'].includes(ext)) {
            imageCount++;
          }
        }
      }
    };
    countAssets(PUBLIC_DIR);
  }

  // Get CSS files from .next/static/css
  const cssDir = path.join(NEXT_BUILD_DIR, 'static', 'css');
  let cssInitial = 0;
  let cssTotal = 0;
  const cssFiles: string[] = [];

  if (fs.existsSync(cssDir)) {
    const files = fs.readdirSync(cssDir);
    for (const file of files) {
      const filePath = path.join(cssDir, file);
      const stats = fs.statSync(filePath);
      const size = stats.size;

      cssFiles.push(file);
      cssTotal += size;
      if (file.includes('main') || file.includes('app') || file.includes('pages')) {
        cssInitial += size;
      }
    }
  }

  // Get JS files from .next/static/chunks
  const chunksDir = path.join(NEXT_BUILD_DIR, 'static', 'chunks');
  let jsInitial = 0;
  let jsTotal = 0;
  const jsFiles: string[] = [];

  if (fs.existsSync(chunksDir)) {
    const files = fs.readdirSync(chunksDir);
    for (const file of files) {
      const filePath = path.join(chunksDir, file);
      const stats = fs.statSync(filePath);
      const size = stats.size;

      jsFiles.push(file);
      jsTotal += size;
      if (file.includes('main') || file.includes('app') || file.includes('pages') || file.includes('webpack')) {
        jsInitial += size;
      }
    }
  }

  return {
    jsSizes: { initial: jsInitial, total: jsTotal, files: jsFiles },
    cssSizes: { initial: cssInitial, total: cssTotal, files: cssFiles },
    assetCounts: {
      js: jsFiles.length,
      css: cssFiles.length,
      fonts: fontCount,
      images: imageCount,
      total: jsFiles.length + cssFiles.length + fontCount + imageCount,
    },
  };
}

// ============================================================
// Lighthouse CI Integration
// ============================================================

async function runLighthouseCI(): Promise<{
  passed: boolean;
  scores: Record<string, number>;
  webVitals: Record<string, number>;
  output: string;
}> {
  try {
    const result = execSync('npx lighthouse-ci autorun --config=lighthouserc.json', {
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024,
      timeout: 300000, // 5 minutes
    });

    // Parse Lighthouse CI output
    const output = result.toString();
    const scores: Record<string, number> = {};
    const webVitals: Record<string, number> = {};

    // Parse scores from output
    const scoreRegex = /(\w+):\s*(\d+(?:\.\d+)?)/g;
    let match;
    while ((match = scoreRegex.exec(output)) !== null) {
      const [, name, value] = match;
      scores[name] = parseFloat(value);
    }

    // Parse web vitals
    const vitalRegex = /(first-contentful-paint|largest-contentful-paint|cumulative-layout-shift|total-blocking-time|speed-index|interactive):\s*([\d.]+)/gi;
    while ((match = vitalRegex.exec(output)) !== null) {
      const [, name, value] = match;
      webVitals[name] = parseFloat(value);
    }

    const passed = output.includes('LHCI: All assertions passed.') ||
      output.includes('All assertions passed');

    return { passed, scores, webVitals, output };
  } catch (error: any) {
    return {
      passed: false,
      scores: {},
      webVitals: {},
      output: error.stdout?.toString() || error.message,
    };
  }
}

// ============================================================
// Main Check Function
// ============================================================

async function checkPerformanceBudget(): Promise<boolean> {
  console.log('🔍 Checking Performance Budgets...\n');

  let allPassed = true;
  const results: { category: string; status: 'pass' | 'warning' | 'fail'; message: string }[] = [];

  // 1. Analyze bundle sizes
  console.log('📦 Analyzing bundle sizes...');
  const bundle = await analyzeBundle();

  // JavaScript budgets
  const jsInitialResult = checkBudget(bundle.jsSizes.initial, BUDGETS.javascript.initial, 'bytes');
  const jsTotalResult = checkBudget(bundle.jsSizes.total, BUDGETS.javascript.total, 'bytes');

  results.push({ category: 'JS Initial', ...jsInitialResult });
  results.push({ category: 'JS Total', ...jsTotalResult });

  if (jsInitialResult.status === 'fail' || jsTotalResult.status === 'fail') allPassed = false;

  // CSS budgets
  const cssInitialResult = checkBudget(bundle.cssSizes.initial, BUDGETS.css.initial, 'bytes');
  const cssTotalResult = checkBudget(bundle.cssSizes.total, BUDGETS.css.total, 'bytes');

  results.push({ category: 'CSS Initial', ...cssInitialResult });
  results.push({ category: 'CSS Total', ...cssTotalResult });

  if (cssInitialResult.status === 'fail' || cssTotalResult.status === 'fail') allPassed = false;

  // Total asset budget
  const totalAssets = bundle.jsSizes.total + bundle.cssSizes.total;
  const totalResult = checkBudget(totalAssets, BUDGETS.total, 'bytes');
  results.push({ category: 'Total Assets', ...totalResult });
  if (totalResult.status === 'fail') allPassed = false;

  // Resource counts
  const jsCountResult = checkBudget(bundle.assetCounts.js, BUDGETS.resources.js, 'count');
  const cssCountResult = checkBudget(bundle.assetCounts.css, BUDGETS.resources.css, 'count');
  const fontCountResult = checkBudget(bundle.assetCounts.fonts, BUDGETS.resources.fonts, 'count');
  const imageCountResult = checkBudget(bundle.assetCounts.images, BUDGETS.resources.images, 'count');
  const totalCountResult = checkBudget(bundle.assetCounts.total, BUDGETS.resources.total, 'count');

  results.push({ category: 'JS Files', ...jsCountResult });
  results.push({ category: 'CSS Files', ...cssCountResult });
  results.push({ category: 'Fonts', ...fontCountResult });
  results.push({ category: 'Images', ...imageCountResult });
  results.push({ category: 'Total Resources', ...totalCountResult });

  if (jsCountResult.status === 'fail' || cssCountResult.status === 'fail' ||
      fontCountResult.status === 'fail' || imageCountResult.status === 'fail' ||
      totalCountResult.status === 'fail') {
    allPassed = false;
  }

  // 2. Run Lighthouse CI
  console.log('\n🔦 Running Lighthouse CI...');
  const lighthouse = await runLighthouseCI();

  if (lighthouse.passed) {
    results.push({ category: 'Lighthouse CI', status: 'pass', message: '✅ All Lighthouse assertions passed' });
  } else {
    results.push({ category: 'Lighthouse CI', status: 'fail', message: '❌ Lighthouse assertions failed' });
    allPassed = false;
  }

  // Lighthouse scores
  for (const [category, score] of Object.entries(lighthouse.scores)) {
    const budget = BUDGETS.lighthouse[category as keyof typeof BUDGETS.lighthouse];
    if (budget) {
      const result = checkBudget(score, budget, 'score');
      results.push({ category: `Lighthouse ${category}`, ...result });
      if (result.status === 'fail') allPassed = false;
    }
  }

  // Web Vitals
  for (const [vital, value] of Object.entries(lighthouse.webVitals)) {
    const budget = BUDGETS.webVitals[vital as keyof typeof BUDGETS.webVitals];
    if (budget) {
      const result = checkBudget(value, budget, 'ms');
      results.push({ category: `Web Vital ${vital}`, ...result });
      if (result.status === 'fail') allPassed = false;
    }
  }

  // Print results
  console.log('\n📊 Performance Budget Results:\n');
  console.log('─'.repeat(80));

  for (const result of results) {
    const icon = result.status === 'pass' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
    console.log(`${icon} ${result.category}: ${result.message}`);
  }

  console.log('─'.repeat(80));

  // Summary
  const passed = results.filter(r => r.status === 'pass').length;
  const warnings = results.filter(r => r.status === 'warning').length;
  const failed = results.filter(r => r.status === 'fail').length;

  console.log(`\n📈 Summary: ${passed} passed, ${warnings} warnings, ${failed} failed\n`);

  if (!allPassed) {
    console.log('💡 Recommendations:');
    for (const result of results.filter(r => r.status !== 'pass')) {
      console.log(`  - ${result.category}: ${result.message}`);
    }
    console.log('\n🔧 Optimization suggestions:');
    console.log('  - Enable compression (gzip/brotli) for all assets');
    console.log('  - Enable code splitting and lazy loading');
    console.log('  - Optimize images (WebP/AVIF, proper sizing)');
    console.log('  - Remove unused JavaScript/CSS');
    console.log('  - Use font-display: swap for fonts');
    console.log('  - Preload critical resources');
    console.log('  - Minimize third-party scripts');
  }

  return allPassed;
}

// ============================================================
// Main
// ============================================================

async function main() {
  try {
    const passed = await checkPerformanceBudget();
    process.exit(passed ? 0 : 1);
  } catch (error) {
    console.error('❌ Performance budget check failed:', error);
    process.exit(1);
  }
}

main();