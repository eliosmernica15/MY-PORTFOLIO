import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import localFont from 'next/font/local';
import { getTranslations, getLocale } from 'next-intl/server';
import '../globals.css';
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

const trustedTypesScript = `
(function() {
  if (window.trustedTypes && window.trustedTypes.createPolicy) {
    try {
      // Strict Trusted Types policy - only allows safe operations
      // This prevents DOM XSS by rejecting unsafe HTML/scripts/URLs
      window.trustedTypes.createPolicy('default', {
        // Only allow plain text content, no HTML tags
        // If you need HTML, create a named policy with explicit allowlist
        createHTML: (string, sink) => {
          // For terminal/assistant output: only allow plain text
          // The sink parameter tells us the target element
          if (sink && (sink.tagName === 'PRE' || sink.tagName === 'CODE' || sink.classList?.contains('terminal-output'))) {
            return string; // Plain text is safe in pre/code
          }
          // For all other sinks, reject HTML - force use of textContent instead
          throw new TypeError('TrustedTypes: createHTML only allowed for terminal/code sinks. Use textContent for dynamic content.');
        },
        // Never allow dynamic script creation
        createScript: (string, sink) => {
          throw new TypeError('TrustedTypes: createScript is not allowed. All scripts must be statically defined or loaded via nonce.');
        },
        // Only allow same-origin script URLs
        createScriptURL: (string, sink) => {
          try {
            const url = new URL(string, window.location.origin);
            if (url.origin !== window.location.origin) {
              throw new TypeError('TrustedTypes: cross-origin script URLs not allowed');
            }
            return string;
          } catch {
            throw new TypeError('TrustedTypes: invalid script URL');
          }
        },
      });
    } catch (e) {
      // Policy already exists or Trusted Types not supported
      console.warn('[TrustedTypes] Policy creation failed:', e.message);
    }
  }
})();
`;

const themeInitScript = `
(function() {
  try {
    var t = document.cookie.match(/(?:^|; )theme=(dark|light)/);
    var stored = null;
    try { stored = localStorage.getItem('theme'); } catch (e) {}
    var pref = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    var theme = t ? t[1] : (stored === 'dark' || stored === 'light' ? stored : pref);
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
        {/* Trusted Types policy. Must be created before any scripts run to prevent
            DOM XSS sinks. Carries the per-request CSP nonce. */}
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: trustedTypesScript }} />
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