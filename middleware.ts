import { NextRequest, NextResponse } from 'next/server';

const BLOCKED_UA_PATTERNS = [
  /semrush/i,
  /ahrefsbot/i,
  /mj12bot/i,
  /dotbot/i,
  /petalbot/i,
];

// Generate a per-request CSP nonce. The layout reads this from the
// `x-nonce` request header (via `headers()`) and attaches it to every
// inline <script> it renders. Pairing the nonce with `'strict-dynamic'`
// also lets any script the inline bootstrap loads (the Next.js RSC
// runtime and its chunks) run without their own hashes — which is how
// the RSC payload data gets handed to React and the page hydrates.
function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  // base64-encode without padding; matches the format Next.js examples use.
  return btoa(String.fromCharCode(...bytes)).replace(/=+$/, '');
}

export function middleware(req: NextRequest) {
  const ua = req.headers.get('user-agent') ?? '';
  if (BLOCKED_UA_PATTERNS.some(re => re.test(ua))) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const nonce = generateNonce();
  const cspHeader = buildCsp(nonce);

  // Forward the nonce to the request so server components (the layout) can
  // read it from `headers()` and attach it to inline <script> tags. We
  // intentionally do NOT use `x-forwarded-*` here — `x-nonce` is a
  // request-scoped value the browser never sees, so leaking it would only
  // matter if a downstream proxy trusted it, which is not our setup.
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-nonce', nonce);

  const res = NextResponse.next({ request: { headers: requestHeaders } });
  res.headers.set('Content-Security-Policy', cspHeader);
  res.headers.set('Vary', 'Accept-Encoding');

  return res;
}

function buildCsp(nonce: string): string {
  // Inline scripts on this page fall into two camps:
  //
  //   1. The theme-init bootstrap in `app/layout.tsx` — we tag it with the
  //      nonce in the layout, so CSP trusts it via `'nonce-...'` and
  //      `'strict-dynamic'` cascades trust to anything it loads.
  //
  //   2. The RSC payload chunks (`self.__next_f.push([1, ...])`) — these
  //      are emitted by Next.js itself, NOT by code we control, so we
  //      can't attach a nonce to them. Hashing them isn't viable either:
  //      their content changes per build (different per-route payload,
  //      different cached prerender data, etc.). What we CAN do is
  //      whitelist them with a single, content-free hash that
  //      corresponds to the `requestAnimationFrame` performance-mark
  //      shim Next.js injects, and rely on `'strict-dynamic'` to extend
  //      the trust set to all the `self.__next_f.push([1, ...])`
  //      chunks that follow, because the runtime reads the cached
  //      payload from the HTML that was already shipped under the
  //      `'strict-dynamic'`-protected bootstrap.
  //
  // The two hashes below are stable for Next.js 15.5.x. If you upgrade
  // Next.js, rebuild and re-derive them with:
  //   node -e 'const h=require("fs").readFileSync(".next/server/app/index.html","utf8");[...h.matchAll(/<script>([\\s\\S]*?)<\\/script>/g)].forEach((m,i)=>console.log(i,"sha256-"+require("crypto").createHash("sha256").update(m[1]).digest("base64")))'
  // and update the constants.
  //
  // JSON-LD `<script type="application/ld+json">` blocks are NOT subject
  // to `script-src` per the CSP spec (they're data, not executable), so
  // the Person / WebSite / BreadcrumbList payloads in the layout render
  // fine without their own hash.
  const NEXT_REQUEST_ANIMATION_FRAME_SHA256 =
    "'sha256-7mu4H06fwDCjmnxxr/xNHyuQC6pLTHr4M2E4jXw5WZs='";
  const NEXT_F_BOOTSTRAP_SHA256 =
    "'sha256-OBTN3RiyCV4Bq7dFqZ5a2pAXjnCcCYeTJMO2I/LYKeo='";

  return [
    "default-src 'self'",
    // `'strict-dynamic'` is the key directive: it tells the browser to
    // trust any script loaded by a nonced/trusted script. That covers
    // Next.js's RSC runtime (loaded by the nonced theme-init) and
    // transitively the per-page RSC payload chunks. `'unsafe-inline'`
    // is paired so legacy browsers (no nonce support) still let the
    // theme bootstrap through; modern browsers ignore it when a nonce
    // is present. `'self'` is kept as a fallback for browsers that
    // don't implement `'strict-dynamic'`.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-inline' ${NEXT_REQUEST_ANIMATION_FRAME_SHA256} ${NEXT_F_BOOTSTRAP_SHA256} https://prod.spline.design`,
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
