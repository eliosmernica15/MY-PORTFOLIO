import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, isValidLocale } from './src/i18n/config';

const BLOCKED_UA_PATTERNS = [
  /semrush/i,
  /ahrefsbot/i,
  /mj12bot/i,
  /dotbot/i,
  /petalbot/i,
];

const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';
const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

// Generate a per-request CSP nonce. The layout reads this from the
// `x-nonce` request header (via `headers()`) and attaches it to every
// inline <script> it renders. Pairing the nonce with `'strict-dynamic'`
// also lets any script the inline bootstrap loads (the Next.js RSC
// runtime and its chunks) run without their own hashes — which is how
// the RSC payload data gets handed to React and the page hydrates.
// Cache-busting: 2026-11-07T19:45:00Z - Force redeploy to clear redirect loop cache
function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  // base64-encode without padding; matches the format Next.js examples use.
  return btoa(String.fromCharCode(...bytes)).replace(/=+$/, '');
}

function getLocaleFromPath(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  if (firstSegment && ['en', 'sq'].includes(firstSegment)) {
    return firstSegment;
  }
  return null;
}

function getLocaleFromCookie(req: NextRequest): string | null {
  const cookie = req.cookies.get('NEXT_LOCALE')?.value;
  if (cookie && ['en', 'sq'].includes(cookie)) {
    return cookie;
  }
  return null;
}

function getLocaleFromAcceptLanguage(req: NextRequest): string {
  const acceptLanguage = req.headers.get('accept-language');
  if (!acceptLanguage) return 'en';

  // Parse accept-language header
  const languages = acceptLanguage
    .split(',')
    .map(part => {
      const [lang, quality] = part.split(';q=');
      return {
        lang: lang.trim().toLowerCase(),
        quality: quality ? parseFloat(quality) : 1,
      };
    })
    .sort((a, b) => b.quality - a.quality);

  // Find first supported locale
  for (const { lang } of languages) {
    const baseLang = lang.split('-')[0];
    if (['en', 'sq'].includes(baseLang)) {
      return baseLang;
    }
  }

  return 'en';
}

export function middleware(req: NextRequest) {
  const ua = req.headers.get('user-agent') ?? '';
  if (BLOCKED_UA_PATTERNS.some(re => re.test(ua))) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const pathname = req.nextUrl.pathname;
  const pathnameLocale = getLocaleFromPath(pathname);

  // If no locale in path, set locale cookie based on accept-language
  // but DO NOT rewrite/redirect - let the page handle locale detection
  // This completely eliminates redirect loops
  if (!pathnameLocale) {
    const cookieLocale = getLocaleFromCookie(req);
    const acceptLangLocale = getLocaleFromAcceptLanguage(req);
    const locale = cookieLocale || acceptLangLocale || 'en';

    const response = NextResponse.next();

    // Set locale cookie for downstream components
    response.cookies.set('NEXT_LOCALE', locale, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    // Add nonce and security headers
    const nonce = generateNonce();
    const cspHeader = buildCsp(nonce);
    const cspReportOnlyHeader = buildCspReportOnly(nonce);

    response.headers.set('Content-Security-Policy', cspHeader);
    response.headers.set('Content-Security-Policy-Report-Only', cspReportOnlyHeader);
    response.headers.set('Permissions-Policy', buildPermissionsPolicy());
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-DNS-Prefetch-Control', 'off');
    response.headers.set('X-Download-Options', 'noopen');
    response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    response.headers.set('Expect-CT', 'max-age=86400, enforce');
    response.headers.set('Vary', 'Accept-Encoding');

    return response;
  }

  // Locale exists in path, continue with normal middleware
  const nonce = generateNonce();
  const cspHeader = buildCsp(nonce);
  const cspReportOnlyHeader = buildCspReportOnly(nonce);

  // Update locale cookie if different from path
  const cookieLocale = getLocaleFromCookie(req);
  if (cookieLocale !== pathnameLocale) {
    const response = NextResponse.next();
    response.cookies.set('NEXT_LOCALE', pathnameLocale, {
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    // Add security headers
    const nonce = generateNonce();
    const cspHeader = buildCsp(nonce);
    const cspReportOnlyHeader = buildCspReportOnly(nonce);

    response.headers.set('Content-Security-Policy', cspHeader);
    response.headers.set('Content-Security-Policy-Report-Only', cspReportOnlyHeader);
    response.headers.set('Permissions-Policy', buildPermissionsPolicy());
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-DNS-Prefetch-Control', 'off');
    response.headers.set('X-Download-Options', 'noopen');
    response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    response.headers.set('Expect-CT', 'max-age=86400, enforce');
    response.headers.set('Vary', 'Accept-Encoding');

    return response;
  }

  // Forward the nonce to the request so server components (the layout) can
  // read it from `headers()` and attach it to inline <script> tags. We
  // intentionally do NOT use `x-forwarded-*` here — `x-nonce` is a
  // request-scoped value the browser never sees, so leaking it would only
  // matter if a downstream proxy trusted it, which is not our setup.
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-nonce', nonce);

  const res = NextResponse.next({ request: { headers: requestHeaders } });

  // Enforced CSP
  res.headers.set('Content-Security-Policy', cspHeader);
  // Report-Only CSP for violation monitoring without blocking
  res.headers.set('Content-Security-Policy-Report-Only', cspReportOnlyHeader);

  // Additional security headers (removed overly restrictive COEP/CORP/COOP)
  res.headers.set('Permissions-Policy', buildPermissionsPolicy());
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-DNS-Prefetch-Control', 'off');
  res.headers.set('X-Download-Options', 'noopen');
  res.headers.set('X-Permitted-Cross-Domain-Policies', 'none');

  // HSTS with preload preparation (max-age=2 years, include subdomains)
  // Note: Submit to hstspreload.org after verifying all subdomains work
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  // Expect-CT for Certificate Transparency
  res.headers.set('Expect-CT', 'max-age=86400, enforce');

  res.headers.set('Vary', 'Accept-Encoding');

  return res;
}

function buildCsp(nonce: string): string {
  const NEXT_REQUEST_ANIMATION_FRAME_SHA256 =
    "'sha256-7mu4H06fwDCjmnxxr/xNHyuQC6pLTHr4M2E4jXw5WZs='";
  const NEXT_F_BOOTSTRAP_SHA256 =
    "'sha256-OBTN3RiyCV4Bq7dFqZ5a2pAXjnCcCYeTJMO2I/LYKeo='";

  return [
    "default-src 'self'",
    // Trusted Types for DOM XSS prevention
    "trusted-types default allow-duplicates; require-trusted-types-for 'script'",
    // `'strict-dynamic'` is the key directive: it tells the browser to
    // trust any script loaded by a nonced/trusted script. That covers
    // Next.js's RSC runtime (loaded by the nonced theme-init) and
    // transitively the per-page RSC payload chunks. `'unsafe-inline'`
    // is paired so legacy browsers (no nonce support) still let the
    // theme bootstrap through; modern browsers ignore it when a nonce
    // is present. `'self'` is kept as a fallback for browsers that
    // don't implement `'strict-dynamic'`.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-inline' 'unsafe-eval' ${NEXT_REQUEST_ANIMATION_FRAME_SHA256} ${NEXT_F_BOOTSTRAP_SHA256} https://prod.spline.design https://unpkg.com`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://api.emailjs.com https://api.github.com https://prod.spline.design https://*.spline.design https://unpkg.com https://fonts.googleapis.com https://fonts.gstatic.com",
    "frame-src 'self' https://my.spline.design https://*.spline.design",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "media-src 'self' data: https:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
    // Report violations to our endpoint
    "report-uri /api/csp-report",
  ].join('; ');
}

function buildCspReportOnly(nonce: string): string {
  const NEXT_REQUEST_ANIMATION_FRAME_SHA256 =
    "'sha256-7mu4H06fwDCjmnxxr/xNHyuQC6pLTHr4M2E4jXw5WZs='";
  const NEXT_F_BOOTSTRAP_SHA256 =
    "'sha256-OBTN3RiyCV4Bq7dFqZ5a2pAXjnCcCYeTJMO2I/LYKeo='";

  // Report-only version - same policy but report-only mode
  // This allows us to catch violations without blocking anything
  return [
    "default-src 'self'",
    "trusted-types default allow-duplicates; require-trusted-types-for 'script'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-inline' 'unsafe-eval' ${NEXT_REQUEST_ANIMATION_FRAME_SHA256} ${NEXT_F_BOOTSTRAP_SHA256} https://prod.spline.design https://unpkg.com`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://api.emailjs.com https://api.github.com https://prod.spline.design https://*.spline.design https://unpkg.com https://fonts.googleapis.com https://fonts.gstatic.com",
    "frame-src 'self' https://my.spline.design https://*.spline.design",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "media-src 'self' data: https:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
    "report-uri /api/csp-report",
  ].join('; ');
}

function buildPermissionsPolicy(): string {
  return [
    'accelerometer=()',
    'ambient-light-sensor=()',
    'autoplay=(self)',
    'battery=()',
    'camera=()',
    'cross-origin-isolated=()',
    'display-capture=()',
    'document-domain=()',
    'encrypted-media=()',
    'execution-while-not-rendered=()',
    'execution-while-out-of-viewport=()',
    'fullscreen=(self)',
    'geolocation=()',
    'gyroscope=()',
    'hid=()',
    'identity-credentials-get=()',
    'idle-detection=()',
    'local-fonts=()',
    'magnetometer=()',
    'microphone=()',
    'midi=()',
    'otp-credentials=()',
    'payment=()',
    'picture-in-picture=()',
    'publickey-credentials-get=()',
    'screen-wake-lock=()',
    'serial=()',
    'speaker-selection=()',
    'sync-xhr=()',
    'usb=()',
    'web-share=()',
    'window-management=()',
    'xr-spatial-tracking=()',
  ].join(', ');
}

export const config = {
  matcher: [
    // Run on all paths except _next/static, _next/image, favicon, public files
    '/((?!_next/static|_next/image|favicon.ico|sw.js|.*\\..*).*)',
  ],
};