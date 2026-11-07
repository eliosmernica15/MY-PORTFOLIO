#!/usr/bin/env node
/**
 * Build-time environment validation script.
 * Runs during `prebuild` to validate all required environment variables.
 * Exits with non-zero code if validation fails.
 */

import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  try {
    console.log('🔍 Validating environment variables...');
    const { validateServerEnv } = await import(
      `file://${resolve(__dirname, '../src/lib/env.ts')}`
    );
    const env = validateServerEnv();
    console.log('✅ Environment validation passed');
    console.log('   SMTP configured:', !!(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS));
    console.log('   EmailJS configured:', !!(env.EMAILJS_SERVICE_ID && env.EMAILJS_TEMPLATE_ID && env.EMAILJS_PUBLIC_KEY));
    console.log('   Vercel KV configured:', !!(env.KV_REST_API_URL && env.KV_REST_API_TOKEN));
    console.log('   Upstash Redis configured:', !!(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN));
    process.exit(0);
  } catch (error) {
    console.error('❌ Environment validation failed:');
    console.error(error.message);
    process.exit(1);
  }
}

main();