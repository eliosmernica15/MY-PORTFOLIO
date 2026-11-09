import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import localFont from 'next/font/local';
import { getTranslations, getLocale } from 'next-intl/server';
// globals.css is imported once in the root layout (app/layout.tsx) so
// that both the root page (/) and [locale] routes get styles.
import { SITE } from '@/data/site';
import { Providers } from '../Providers';
import { SwRegister } from '../sw-register';
import { localeNames, localeFlags } from '@/i18n/config';

// Self-hosted Plus Jakarta Sans (variable, latin) — avoids the
// build-time Google Fonts fetch in next/font/google, which crashes
// Vercel builds with "Cannot read properties of null (reading '1')"
// in @next/font's google loader whenever the CSS response parsing
// yields a non-font URL (confirmed variable wght range 200-800).
const jakarta = localFont({
  src: '../fonts/plus-jakarta-sans-latin-variable.woff2',
  display: 'swap',
  variable: '--font-jakarta',
  weight: '200 800',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.title}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.summary,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  keywords: [
    'Elios Mernica', 'software engineer', 'web developer', 'AI engineer',
    'portfolio', 'Kosovo', 'React', 'Next.js', 'TypeScript', 'full-stack',
    'AI systems', 'network infrastructure',
  ],
  creator: SITE.name,
  publisher: SITE.name,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.title}`,
    description: SITE.summary,
    images: [
      {
        url: '/og-image',
        width: 1200,
        height: 630,
        alt: `${SITE.name} — ${SITE.title}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — ${SITE.title}`,
    description: SITE.summary,
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
  colorScheme: 'dark light',
};

// NOTE: no page-defined Trusted Types 'default' policy is created here.
// A strict default policy (rejecting HTML for non-terminal sinks) breaks
// framework rendering: React/Next assign innerHTML for JSON-LD scripts
// and hydration, and the policy rejects it. Trusted Types policies are
// instead created by the framework itself:
// - Next.js client  -> policy named `nextjs`
// - webpack runtime -> policy named `nextjs#bundler`
// Both are allowlisted in the CSP `trusted-types` directive (middleware.ts).
// XSS protection for inline scripts comes from the CSP nonce +
// 'strict-dynamic', not from a page-level TT policy.

// Resolves the theme from the SAME single source of truth ThemeProvider
// uses (elios-theme-config), so pre-hydration and post-hydration agree:
// cookie > explicit config mode > legacy localStorage key > system pref.
const themeInitScript = `
(function() {
  try {
    var t = document.cookie.match(/(?:^|; )theme=(dark|light)/);
    var cfgMode = null;
    try {
      var raw = localStorage.getItem('elios-theme-config');
      if (raw) cfgMode = JSON.parse(raw).mode;
    } catch (e) {}
    var legacy = null;
    try { legacy = localStorage.getItem('theme'); } catch (e) {}
    var pref = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    var theme = t ? t[1]
      : (cfgMode === 'dark' || cfgMode === 'light') ? cfgMode
      : (legacy === 'dark' || legacy === 'light') ? legacy
      : pref;
    document.documentElement.setAttribute('data-theme', theme);
  } catch(e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'sq' },
  ];
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Await params for locale
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  // Read the per-request CSP nonce that middleware generates and forwards
  // via the `x-nonce` request header. The nonce is attached to the inline
  // theme-init script below, which is the only inline script this layout
  // owns. Pairing it with `'strict-dynamic'` in the middleware CSP lets
  // Next.js's RSC bootstrap (and the per-route RSC payload chunks it
  // loads) run too — those don't have a nonce we can stamp on, but the
  // strict-dynamic cascade trusts them transitively.
  //
  // Reading the header opts this layout into dynamic rendering, which is
  // the trade-off the previous static-rendering attempt couldn't honor:
  // the RSC payload chunks the page needs to hydrate are inline scripts
  // that we can't hash (their content changes per build), and the only
  // way to allow them under a strict CSP is to either use `'unsafe-inline'`
  // (security regression) or pin them under a nonced trust anchor (this).
  // Vercel still caches the rendered output at the edge, so the dynamic
  // rendering here is a per-cold-cache recompute, not a per-request hit.
  const h = await headers();
  const nonce = h.get('x-nonce') ?? '';
  const theme = 'dark';

  // Get translations for this locale
  const t = await getTranslations({ locale });

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE.name,
    jobTitle: 'Software Engineer',
    url: SITE.url,
    email: `mailto:${SITE.email}`,
    telephone: SITE.phone,
    address: { '@type': 'PostalAddress', addressLocality: SITE.location },
    sameAs: [
      'https://github.com/eliosmernica15',
      'https://www.linkedin.com/in/elios-mernica-880562204/',
      'https://www.instagram.com/e_mer03/',
    ],
    knowsAbout: [
      'Software Engineering', 'Artificial Intelligence', 'Web Development',
      'System Design', 'Network Infrastructure', 'Compilers',
    ],
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
    inLanguage: 'en',
    publisher: { '@type': 'Person', name: SITE.name },
  };

  // Get locale info for alternate URLs
  const alternateUrls = {
    en: `https://eliosmernica.vercel.app/en`,
    sq: `https://eliosmernica.vercel.app/sq`,
  };

  return (
    <html lang={locale} data-theme={theme} className={jakarta.variable}>
      <head>
        <link rel="preconnect" href="https://prod.spline.design" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://i.postimg.cc" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.github.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.emailjs.com" />
        {/* View Transitions API - enables smooth page transitions for same-origin navigation */}
        <meta name="view-transition" content="same-origin" />
        {/* Alternate URLs for hreflang */}
        <link rel="alternate" href={alternateUrls.en} hrefLang="en" />
        <link rel="alternate" href={alternateUrls.sq} hrefLang="sq" />
        <link rel="alternate" href="https://eliosmernica.vercel.app/en" hrefLang="x-default" />
        {/* No page-defined Trusted Types policy (see note near the top of
            this file). Framework policies `nextjs` / `nextjs#bundler` are
            allowlisted via the CSP header instead. */}
        {/* Theme bootstrap. Runs before React hydrates so the user never sees a
            light/dark flash. Carries the per-request CSP nonce from
            middleware so the inline script is trusted under our strict
            `script-src` policy. */}
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="noise">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <a href="#terminal" className="skip-link">Skip to terminal</a>
        <a href="#assistant" className="skip-link">Skip to AI assistant</a>
        <a href="#navigation" className="skip-link">Skip to navigation</a>
        <noscript>
          <div
            style={{
              padding: '12px 16px',
              background: 'var(--surface-elevated)',
              borderBottom: '1px solid var(--border)',
              textAlign: 'center',
              fontSize: 13,
              color: 'var(--text-secondary)',
            }}
          >
            JavaScript is off — the site still works, but a few interactive features (the assistant, terminal, particle field) are disabled. Reach me at{' '}
            <a href={`mailto:${SITE.email}`} style={{ color: 'var(--accent-light)' }}>
              {SITE.email}
            </a>
            .
          </div>
        </noscript>
        <Providers>{children}</Providers>
        <SwRegister />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </body>
    </html>
  );
}