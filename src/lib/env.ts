/**
 * Environment validation with Zod.
 * Validates all required environment variables at build time.
 * Fails fast if any required variables are missing or invalid.
 */

import { z } from 'zod';

// Schema for server-side environment variables
const serverEnvSchema = z.object({
  // SMTP Configuration (Option A for contact form)
  SMTP_HOST: z.string().min(1, 'SMTP_HOST is required when using SMTP').optional(),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: z.string().min(1, 'SMTP_USER is required when using SMTP').optional(),
  SMTP_PASS: z.string().min(1, 'SMTP_PASS is required when using SMTP').optional(),

  // EmailJS Configuration (Option B for contact form)
  EMAILJS_SERVICE_ID: z.string().min(1, 'EMAILJS_SERVICE_ID is required when using EmailJS').optional(),
  EMAILJS_TEMPLATE_ID: z.string().min(1, 'EMAILJS_TEMPLATE_ID is required when using EmailJS').optional(),
  EMAILJS_PUBLIC_KEY: z.string().min(1, 'EMAILJS_PUBLIC_KEY is required when using EmailJS').optional(),

  // Contact form destination
  CONTACT_TO: z.string().email('CONTACT_TO must be a valid email').default('eliosmernica@gmail.com'),

  // Optional integrations
  GITHUB_USERNAME: z.string().min(1).default('eliosmernica15'),

  // Site URL for metadata, sitemap, OG images
  NEXT_PUBLIC_SITE_URL: z.string().url('NEXT_PUBLIC_SITE_URL must be a valid URL').default('https://eliosmernica.vercel.app'),

  // Vercel KV (for rate limiting)
  KV_REST_API_URL: z.string().url('KV_REST_API_URL must be a valid URL').optional(),
  KV_REST_API_TOKEN: z.string().min(1).optional(),

  // Upstash Redis (alternative for rate limiting)
  UPSTASH_REDIS_REST_URL: z.string().url('UPSTASH_REDIS_REST_URL must be a valid URL').optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
});

// Schema for client-side environment variables (prefixed with NEXT_PUBLIC_)
const clientEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default('https://eliosmernica.vercel.app'),
  GITHUB_USERNAME: z.string().default('eliosmernica15'),
});

/**
 * Validates server-side environment variables.
 * Call this at build time or in server-only code.
 */
export function validateServerEnv(): z.infer<typeof serverEnvSchema> {
  const result = serverEnvSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.issues.map(issue => {
      const path = issue.path.join('.');
      return `  ${path}: ${issue.message}`;
    }).join('\n');

    throw new Error(
      `❌ Invalid server environment variables:\n${errors}\n\n` +
      `Check your .env.local or Vercel environment variables.`
    );
  }

  // Additional validation: if SMTP is partially configured, warn
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = result.data;
  const smtpConfigured = [SMTP_HOST, SMTP_USER, SMTP_PASS].filter(Boolean).length > 0;
  const smtpComplete = SMTP_HOST && SMTP_USER && SMTP_PASS;

  if (smtpConfigured && !smtpComplete) {
    console.warn(
      '⚠️  SMTP is partially configured. All of SMTP_HOST, SMTP_USER, and SMTP_PASS are required. ' +
      'Contact form will fall back to EmailJS if configured, or fail.'
    );
  }

  // Additional validation: if EmailJS is partially configured, warn
  const { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY } = result.data;
  const emailjsConfigured = [EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY].filter(Boolean).length > 0;
  const emailjsComplete = EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY;

  if (emailjsConfigured && !emailjsComplete) {
    console.warn(
      '⚠️  EmailJS is partially configured. All of EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, ' +
      'and EMAILJS_PUBLIC_KEY are required. Contact form will fail if SMTP is not configured.'
    );
  }

  // Warn if neither SMTP nor EmailJS is configured
  if (!smtpComplete && !emailjsComplete) {
    console.warn(
      '⚠️  Neither SMTP nor EmailJS is fully configured. Contact form will not work. ' +
      'Configure at least one delivery method in your environment variables.'
    );
  }

  return result.data;
}

/**
 * Validates client-side environment variables.
 * Call this in client components or layouts.
 */
export function validateClientEnv(): z.infer<typeof clientEnvSchema> {
  // Only include variables that are actually exposed to the client
  const clientEnv = {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    GITHUB_USERNAME: process.env.GITHUB_USERNAME,
  };

  const result = clientEnvSchema.safeParse(clientEnv);

  if (!result.success) {
    const errors = result.error.issues.map(issue => {
      const path = issue.path.join('.');
      return `  ${path}: ${issue.message}`;
    }).join('\n');

    throw new Error(
      `❌ Invalid client environment variables:\n${errors}\n\n` +
      `Check your .env.local or Vercel environment variables.`
    );
  }

  return result.data;
}

// Export validated env for use in the application
// These are validated at module load time (build time for server, runtime for client)
let serverEnvCache: z.infer<typeof serverEnvSchema> | null = null;
let clientEnvCache: z.infer<typeof clientEnvSchema> | null = null;

export function getServerEnv() {
  if (!serverEnvCache) {
    serverEnvCache = validateServerEnv();
  }
  return serverEnvCache;
}

export function getClientEnv() {
  if (!clientEnvCache) {
    clientEnvCache = validateClientEnv();
  }
  return clientEnvCache;
}

// Type exports
export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;