/**
 * Global Setup for Playwright Tests
 *
 * Runs once before all tests to prepare the testing environment.
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';

export default async function globalSetup(): Promise<void> {
  console.log('[Global Setup] Starting Playwright test setup...');

  // Ensure the build exists
  if (!existsSync('./.next')) {
    console.log('[Global Setup] Building the application...');
    try {
      execSync('npm run build', { stdio: 'inherit', timeout: 300_000 });
      console.log('[Global Setup] Build completed successfully.');
    } catch (error) {
      console.error('[Global Setup] Build failed:', error);
      throw new Error('Failed to build the application for testing');
    }
  } else {
    console.log('[Global Setup] Build already exists, skipping build.');
  }

  // Create snapshots directory if it doesn't exist
  if (!existsSync('./tests/snapshots')) {
    execSync('mkdir -p ./tests/snapshots', { stdio: 'inherit' });
    console.log('[Global Setup] Created snapshots directory.');
  }

  console.log('[Global Setup] Setup completed.');
}