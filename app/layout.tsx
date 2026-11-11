import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import localFont from "next/font/local";
import "./globals.css";
import { SITE } from "@/data/site";
import { Providers } from "./Providers";
import { SwRegister } from "./sw-register";

// Self-hosted Plus Jakarta Sans (variable, latin) - avoids the build-time
// Google Fonts fetch that crashes Vercel builds.
const jakarta = localFont({
  src: "./fonts/plus-jakarta-sans-latin-variable.woff2",
  display: "swap",
  variable: "--font-jakarta",
  weight: "200 800",
  preload: true,
});

// Self-hosted Space Grotesk Variable (SIL OFL 1.1, see ./fonts/space-grotesk-OFL.txt).
// Display typeface for the ELIOS/OS masthead, section titles and large numerals.
// latin subset covers U+0000-00FF, which includes Albanian ë (U+00EB) and ç (U+00E7).
const spaceGrotesk = localFont({
  src: "./fonts/space-grotesk-latin-variable.woff2",
  display: "swap",
  variable: "--font-space-grotesk",
  weight: "300 700",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.title}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.summary,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  keywords: [
    "Elios Mernica",
    "software engineer",
    "web developer",
    "AI engineer",
    "portfolio",
    "Kosovo",
    "React",
    "Next.js",
    "TypeScript",
    "full-stack",
    "AI systems",
    "network infrastructure",
  ],
  creator: SITE.name,
  publisher: SITE.name,
  alternates: {
    canonical: "/",
    languages: { en: "/en", sq: "/sq", "x-default": "/en" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.title}`,
    description: SITE.summary,
    images: [
      {
        url: "/og-image",
        width: 1200,
        height: 630,
        alt: `${SITE.name} — ${SITE.title}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.title}`,
    description: SITE.summary,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  colorScheme: "dark light",
};

// Theme bootstrap - runs before React hydrates so the theme is applied
// without a light/dark flash. Mirrors the resolver ThemeProvider uses
// (elios-theme-config): cookie > explicit config mode > legacy key > system.
// MUST carry the per-request CSP nonce ('strict-dynamic' ignores
// 'unsafe-inline' for scripts).
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Reading the nonce/locale opts this layout into dynamic rendering; the
  // rendered output is cached at the edge by Vercel.
  const h = await headers();
  const nonce = h.get("x-nonce") ?? "";
  const locale = h.get("x-locale") ?? "en";

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.name,
    jobTitle: "Software Engineer",
    url: SITE.url,
    email: `mailto:${SITE.email}`,
    telephone: SITE.phone,
    address: { "@type": "PostalAddress", addressLocality: SITE.location },
    sameAs: [
      "https://github.com/eliosmernica15",
      "https://www.linkedin.com/in/elios-mernica-880562204/",
      "https://www.instagram.com/e_mer03/",
    ],
    knowsAbout: [
      "Software Engineering",
      "Artificial Intelligence",
      "Web Development",
      "System Design",
      "Network Infrastructure",
      "Compilers",
    ],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    inLanguage: "en",
    publisher: { "@type": "Person", name: SITE.name },
  };

  return (
    <html
      lang={locale}
      data-theme="dark"
      className={`${jakarta.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        <link
          rel="preconnect"
          href="https://prod.spline.design"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://i.postimg.cc"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://api.github.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://api.emailjs.com" />
        {/* View Transitions API - smooth page transitions for same-origin navigation */}
        <meta name="view-transition" content="same-origin" />
        {/* Theme bootstrap. Carries the per-request CSP nonce. */}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body className="noise">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <a href="#terminal" className="skip-link">
          Skip to terminal
        </a>
        <a href="#assistant" className="skip-link">
          Skip to AI assistant
        </a>
        <a href="#navigation" className="skip-link">
          Skip to navigation
        </a>
        <noscript>
          <div
            style={{
              padding: "12px 16px",
              background: "var(--surface-elevated)",
              borderBottom: "1px solid var(--border)",
              textAlign: "center",
              fontSize: 13,
              color: "var(--text-secondary)",
            }}
          >
            JavaScript is off — the site still works, but a few interactive
            features (the assistant, terminal, particle field) are disabled.
            Reach me at{" "}
            <a
              href={`mailto:${SITE.email}`}
              style={{ color: "var(--accent-light)" }}
            >
              {SITE.email}
            </a>
            .
          </div>
        </noscript>
        <Providers initialLocale={locale as "en" | "sq"}>{children}</Providers>
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
