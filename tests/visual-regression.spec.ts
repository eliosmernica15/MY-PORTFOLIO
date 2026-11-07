/**
 * Visual Regression Tests
 *
 * These tests capture screenshots of key pages and components
 * and compare them against baseline snapshots to detect visual changes.
 *
 * Run with: npm run test:visual
 * Update snapshots with: npm run test:visual:update
 */

import { test, expect } from '@playwright/test';

// Test configuration
const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 667 },
];

// Pages to test
const PAGES = [
  { path: '/', name: 'home' },
  { path: '/en', name: 'home-en' },
  { path: '/sq', name: 'home-sq' },
];

test.describe('Visual Regression Tests', () => {
  // Test each page at each viewport
  for (const viewport of VIEWPORTS) {
    test.describe(`${viewport.name} viewport (${viewport.width}x${viewport.height})`, () => {
      test.use({ viewport: { width: viewport.width, height: viewport.height } });

      for (const page of PAGES) {
        test(`${page.name} - ${viewport.name}`, async ({ page: testPage }) => {
          // Navigate to the page
          await testPage.goto(page.path, { waitUntil: 'networkidle' });

          // Wait for animations to complete
          await testPage.waitForTimeout(1000);

          // Wait for fonts to load
          await testPage.evaluate(() => document.fonts.ready);

          // Take screenshot and compare with baseline
          await expect(testPage).toHaveScreenshot(`${page.name}-${viewport.name}.png`, {
            fullPage: true,
            animations: 'disabled',
            caret: 'hide',
            threshold: 0.2,
            maxDiffPixels: 200,
          });
        });
      }
    });
  }

  // Test specific components
  test.describe('Component Visual Tests', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('Hero section', async ({ page }) => {
      await page.goto('/en', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      await page.evaluate(() => document.fonts.ready);

      const hero = page.locator('#home, section:first-of-type');
      await expect(hero).toHaveScreenshot('hero-desktop.png', {
        animations: 'disabled',
        caret: 'hide',
        threshold: 0.2,
        maxDiffPixels: 100,
      });
    });

    test('Navigation bar', async ({ page }) => {
      await page.goto('/en', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      await page.evaluate(() => document.fonts.ready);

      const nav = page.locator('nav[role="navigation"]');
      await expect(nav).toHaveScreenshot('nav-desktop.png', {
        animations: 'disabled',
        caret: 'hide',
        threshold: 0.2,
        maxDiffPixels: 50,
      });
    });

    test('Projects grid', async ({ page }) => {
      await page.goto('/en', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      await page.evaluate(() => document.fonts.ready);

      // Scroll to projects section
      const projects = page.locator('#projects');
      await projects.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      await expect(projects).toHaveScreenshot('projects-desktop.png', {
        animations: 'disabled',
        caret: 'hide',
        threshold: 0.2,
        maxDiffPixels: 150,
      });
    });

    test('Contact form', async ({ page }) => {
      await page.goto('/en', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      await page.evaluate(() => document.fonts.ready);

      // Scroll to contact section
      const contact = page.locator('#contact');
      await contact.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      await expect(contact).toHaveScreenshot('contact-desktop.png', {
        animations: 'disabled',
        caret: 'hide',
        threshold: 0.2,
        maxDiffPixels: 100,
      });
    });

    test('Footer', async ({ page }) => {
      await page.goto('/en', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      await page.evaluate(() => document.fonts.ready);

      // Scroll to footer
      const footer = page.locator('footer');
      await footer.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      await expect(footer).toHaveScreenshot('footer-desktop.png', {
        animations: 'disabled',
        caret: 'hide',
        threshold: 0.2,
        maxDiffPixels: 50,
      });
    });
  });

  // Test theme variations
  test.describe('Theme Variations', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('Dark theme', async ({ page }) => {
      await page.goto('/en', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      await page.evaluate(() => document.fonts.ready);

      // Ensure dark theme is active
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
      });
      await page.waitForTimeout(300);

      await expect(page).toHaveScreenshot('home-dark-theme.png', {
        fullPage: true,
        animations: 'disabled',
        caret: 'hide',
        threshold: 0.2,
        maxDiffPixels: 200,
      });
    });

    test('Light theme', async ({ page }) => {
      await page.goto('/en', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      await page.evaluate(() => document.fonts.ready);

      // Switch to light theme
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'light');
      });
      await page.waitForTimeout(300);

      await expect(page).toHaveScreenshot('home-light-theme.png', {
        fullPage: true,
        animations: 'disabled',
        caret: 'hide',
        threshold: 0.2,
        maxDiffPixels: 200,
      });
    });
  });

  // Test locale variations
  test.describe('Locale Variations', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('English locale', async ({ page }) => {
      await page.goto('/en', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      await page.evaluate(() => document.fonts.ready);

      await expect(page).toHaveScreenshot('home-en.png', {
        fullPage: true,
        animations: 'disabled',
        caret: 'hide',
        threshold: 0.2,
        maxDiffPixels: 200,
      });
    });

    test('Albanian locale', async ({ page }) => {
      await page.goto('/sq', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      await page.evaluate(() => document.fonts.ready);

      await expect(page).toHaveScreenshot('home-sq.png', {
        fullPage: true,
        animations: 'disabled',
        caret: 'hide',
        threshold: 0.2,
        maxDiffPixels: 200,
      });
    });
  });

  // Test interactive states
  test.describe('Interactive States', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('Button hover state', async ({ page }) => {
      await page.goto('/en', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      await page.evaluate(() => document.fonts.ready);

      // Find a button and hover it
      const button = page.locator('button, a[role="button"]').first();
      await button.hover();
      await page.waitForTimeout(200);

      await expect(button).toHaveScreenshot('button-hover.png', {
        animations: 'disabled',
        caret: 'hide',
        threshold: 0.2,
        maxDiffPixels: 30,
      });
    });

    test('Navigation active state', async ({ page }) => {
      await page.goto('/en', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      await page.evaluate(() => document.fonts.ready);

      // Find active nav link
      const activeLink = page.locator('nav [aria-current="page"]').first();
      if (await activeLink.count() > 0) {
        await expect(activeLink).toHaveScreenshot('nav-active-link.png', {
          animations: 'disabled',
          caret: 'hide',
          threshold: 0.2,
          maxDiffPixels: 30,
        });
      }
    });
  });

  // Test reduced motion
  test.describe('Reduced Motion', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('Respects prefers-reduced-motion', async ({ page }) => {
      // Set reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/en', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      await page.evaluate(() => document.fonts.ready);

      await expect(page).toHaveScreenshot('home-reduced-motion.png', {
        fullPage: true,
        animations: 'disabled',
        caret: 'hide',
        threshold: 0.2,
        maxDiffPixels: 200,
      });
    });
  });
});

// Accessibility visual tests
test.describe('Accessibility Visual Tests', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test('Focus visible styles', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.evaluate(() => document.fonts.ready);

    // Tab to first focusable element
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);

    const focused = page.locator(':focus-visible');
    if (await focused.count() > 0) {
      await expect(focused).toHaveScreenshot('focus-visible.png', {
        animations: 'disabled',
        caret: 'hide',
        threshold: 0.2,
        maxDiffPixels: 30,
      });
    }
  });

  test('Skip links visible on focus', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.evaluate(() => document.fonts.ready);

    // Tab to skip link
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);

    const skipLink = page.locator('.skip-link:focus');
    if (await skipLink.count() > 0) {
      await expect(skipLink).toHaveScreenshot('skip-link-focus.png', {
        animations: 'disabled',
        caret: 'hide',
        threshold: 0.2,
        maxDiffPixels: 30,
      });
    }
  });
});