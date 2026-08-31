import { NextRequest, NextResponse } from 'next/server';

const BLOCKED_UA_PATTERNS = [
  /semrush/i,
  /ahrefsbot/i,
  /mj12bot/i,
  /dotbot/i,
  /petalbot/i,
];

export function middleware(req: NextRequest) {
  const ua = req.headers.get('user-agent') ?? '';
  if (BLOCKED_UA_PATTERNS.some(re => re.test(ua))) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const cspHeader = buildCsp(nonce);

  const reqHeaders = new Headers(req.headers);
  reqHeaders.set('x-nonce', nonce);

  // Read theme from cookie and forward as request header so layout can SSR correctly
  const theme = req.cookies.get('theme')?.value;
  if (theme === 'dark' || theme === 'light') {
    reqHeaders.set('x-theme', theme);
  }

  const res = NextResponse.next({ request: { headers: reqHeaders } });

  res.headers.set('Content-Security-Policy', cspHeader);
  res.headers.set('x-nonce', nonce);
  res.headers.set('Vary', 'Accept-Encoding');

  return res;
}

function buildCsp(nonce: string): string {
  // `'strict-dynamic'` is intentional: it lets the nonce-validated
  // `<script>` tags bootstrap the Spline runtime (which then loads
  // further scripts from `prod.spline.design`).
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://prod.spline.design`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://api.emailjs.com https://api.github.com https://prod.spline.design https://*.spline.design",
    "frame-src 'self' https://my.spline.design https://*.spline.design",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join('; ');
}

export const config = {
  matcher: [
    // Run on all paths except _next/static, _next/image, favicon, public files
    '/((?!_next/static|_next/image|favicon.ico|sw.js|.*\\..*).*)',
  ],
};
