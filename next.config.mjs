import withBundleAnalyzer from '@next/bundle-analyzer';

const ANALYZE = process.env.ANALYZE === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    // Cache optimized images at the edge for 30 days. The
    // default is 60s, which means every repeat visit to a
    // project detail page re-fetches the image from the origin.
    // With 30 days, returning users see the cached variant.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: 'https', hostname: 'i.postimg.cc' },
      { protocol: 'https', hostname: 'i.imgur.com' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'prod.spline.design' },
      { protocol: 'https', hostname: 'my.spline.design' },
    ],
  },
  experimental: {
    // Tree-shake lucide-react + framer-motion exports.
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    // `staleTimes` controls how long the Next.js client router
    // serves a cached version of a route before revalidating. The
    // defaults (0s for dynamic, 30s for static) mean a back-
    // navigation from /project/foo to / fetches the home page
    // again. Bumping the static window to 5 minutes means the
    // router keeps the home page's RSC payload warm and the
    // back-navigation is instant.
    staleTimes: {
      dynamic: 30,
      static: 300,
    },
  },
  serverExternalPackages: ['nodemailer'],
  async headers() {
    // Security headers only — Content-Security-Policy is set by middleware.ts
    // so it can be per-request-aware. Don't define it here, otherwise the
    // browser sees two CSP headers and the stricter one (middleware) wins
    // for each directive, which used to block the inline theme-init script
    // and leave the page stuck on its Suspense loading fallback.
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer({ enabled: ANALYZE })(nextConfig);
