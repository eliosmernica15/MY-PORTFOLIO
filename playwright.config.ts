import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Visual Regression Testing
 *
 * This configuration sets up Playwright for:
 * - Cross-browser testing (Chromium, Firefox, WebKit)
 * - Visual regression testing with pixel-perfect comparison
 * - Mobile and desktop viewport testing
 * - CI integration with proper artifacts
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],

  // Global setup/teardown
  globalSetup: './tests/global-setup.ts',
  globalTeardown: './tests/global-teardown.ts',

  // Snapshot configuration for visual regression
  snapshotDir: './tests/snapshots',
  snapshotPathTemplate: '{snapshotDir}/{testFilePath}/{arg}{ext}',

  // Timeout settings
  timeout: 30_000,
  expect: {
    timeout: 10_000,
    // Visual comparison threshold
    toHaveScreenshot: {
      maxDiffPixels: 100,
      threshold: 0.2,
      animations: 'disabled',
      caret: 'hide',
    },
  },

  use: {
    // Base URL for tests
    baseURL: 'http://localhost:3000',
    // Trace on failure
    trace: 'on-first-retry',
    // Screenshot on failure
    screenshot: 'only-on-failure',
    // Video on failure
    video: 'retain-on-failure',
    // Viewport for desktop tests
    viewport: { width: 1280, height: 720 },
    // Ignore HTTPS errors
    ignoreHTTPSErrors: true,
  },

  // Test projects (browsers/viewports)
  projects: [
    // Desktop browsers
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 720 } },
    },
    {
      name: 'firefox-desktop',
      use: { ...devices['Desktop Firefox'], viewport: { width: 1280, height: 720 } },
    },
    {
      name: 'webkit-desktop',
      use: { ...devices['Desktop Safari'], viewport: { width: 1280, height: 720 } },
    },
    // Tablet
    {
      name: 'chromium-tablet',
      use: { ...devices['iPad Pro'], viewport: { width: 1024, height: 768 } },
    },
    {
      name: 'webkit-tablet',
      use: { ...devices['iPad Pro'], viewport: { width: 1024, height: 768 } },
    },
    // Mobile
    {
      name: 'chromium-mobile',
      use: { ...devices['iPhone 15'], viewport: { width: 390, height: 844 } },
    },
    {
      name: 'webkit-mobile',
      use: { ...devices['iPhone 15'], viewport: { width: 390, height: 844 } },
    },
  ],

  // Web server for testing
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      NODE_ENV: 'production',
    },
  },
});