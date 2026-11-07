/**
 * Global Teardown for Playwright Tests
 *
 * Runs once after all tests to clean up the testing environment.
 */

export default async function globalTeardown(): Promise<void> {
  console.log('[Global Teardown] Cleaning up after Playwright tests...');
  // Any cleanup tasks can go here
  console.log('[Global Teardown] Cleanup completed.');
}