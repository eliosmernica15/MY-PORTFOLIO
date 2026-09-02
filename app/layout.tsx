import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import { headers } from 'next/headers';
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

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600'],
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
  // Read theme and CSP nonce forwarded by middleware; fall back to dark
  // and an empty nonce (the empty nonce is enough for `'strict-dynamic'`
  // to permit the inline theme-init script; the CSP itself sets `'self'`
  // + nonce + `https://prod.spline.design`).
  const h = await headers();
  const theme = (h.get('x-theme') as 'dark' | 'light' | null) ?? 'dark';
  const nonce = h.get('x-nonce') ?? '';

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
    <html lang="en" data-theme={theme} className={`${jakarta.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://prod.spline.design" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://i.postimg.cc" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.github.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.emailjs.com" />
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
