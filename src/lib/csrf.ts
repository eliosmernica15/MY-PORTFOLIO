/**
 * CSRF Protection for Server Actions
 * Double-submit cookie pattern implementation
 */

import { cookies } from 'next/headers';
import crypto from 'node:crypto';

const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_HEADER_NAME = 'x-csrf-token';
const CSRF_TOKEN_LENGTH = 32;

/**
 * Generate a secure CSRF token
 */
function generateCsrfToken(): string {
  return crypto.randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
}

/**
 * Get the CSRF token from cookies (for validation)
 */
export async function getCsrfToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CSRF_COOKIE_NAME)?.value;
  if (token) return token;

  // Generate new token if not present
  const newToken = generateCsrfToken();
  cookieStore.set(CSRF_COOKIE_NAME, newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
  return newToken;
}

/**
 * Validate CSRF token from form data or header
 */
export async function validateCsrfToken(submittedToken: string): Promise<boolean> {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(CSRF_COOKIE_NAME)?.value;

  if (!cookieToken || !submittedToken) {
    return false;
  }

  // Constant-time comparison to prevent timing attacks
  if (cookieToken.length !== submittedToken.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < cookieToken.length; i++) {
    result |= cookieToken.charCodeAt(i) ^ submittedToken.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Extract CSRF token from FormData
 */
export function extractCsrfToken(formData: FormData): string | null {
  return formData.get('csrf_token') as string | null;
}

/**
 * Create a hidden input with CSRF token for forms
 */
export async function getCsrfInput(): Promise<string> {
  const token = await getCsrfToken();
  return `<input type="hidden" name="csrf_token" value="${token}" />`;
}

/**
 * Middleware helper to add CSRF token to response cookies
 * Use this in middleware or server actions that render forms
 */
export async function ensureCsrfCookie(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(CSRF_COOKIE_NAME)?.value;
  if (existing) return existing;

  const token = generateCsrfToken();
  cookieStore.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24,
    path: '/',
  });
  return token;
}

/**
 * Server action wrapper that validates CSRF token
 * Usage: export const myAction = withCsrfProtection(async (formData: FormData) => { ... })
 */
export function withCsrfProtection<T extends (formData: FormData) => Promise<any>>(
  action: T,
  options?: { csrfFieldName?: string }
): T {
  const fieldName = options?.csrfFieldName ?? 'csrf_token';

  return (async (formData: FormData) => {
    const submittedToken = formData.get(fieldName) as string | null;
    const isValid = await validateCsrfToken(submittedToken ?? '');

    if (!isValid) {
      throw new Error('CSRF validation failed');
    }

    return action(formData);
  }) as T;
}