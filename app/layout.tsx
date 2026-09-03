import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { SITE } from '@/data/site';
import { Providers } from './Providers';
import { SwRegister } from './sw-register';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
  weight: ['300', '400', '500', '600', '700', '800'],
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
    locale: SITE.locale,
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
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
    inLanguage: SITE.locale,
    publisher: { '@type': 'Person', name: SITE.name },
  };

  return (
    <html lang="en" data-theme={theme} className={jakarta.variable}>
      <head>
        <link rel="preconnect" href="https://prod.spline.design" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://i.postimg.cc" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.github.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.emailjs.com" />
        {/* Theme bootstrap. Runs before React hydrates so the user never sees a
            light/dark flash. Carries the per-request CSP nonce from
            middleware so the inline script is trusted under our strict
            `script-src` policy. */}
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="noise">
        <a href="#main-content" className="skip-link">Skip to main content</a>
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
