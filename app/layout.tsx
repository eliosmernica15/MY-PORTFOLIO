import type { Metadata } from 'next';
import { headers } from 'next/headers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Elios Mernica — Software Engineer',
  description: 'Software engineer specializing in web development, system design, and network infrastructure. Based in Kosovo, available worldwide.',
};

// Theme bootstrap — runs before React hydrates so the theme is applied
// without a light/dark flash. This mirrors the bootstrap in
// app/[locale]/layout.tsx (which also sets data-theme on <html> for SSR).
// The root layout cannot render <html> itself (nested layouts would
// produce nested <html> tags), so this script sets the attribute on
// documentElement directly. The script MUST carry the per-request CSP
// nonce: the CSP uses 'strict-dynamic', which ignores 'unsafe-inline',
// so a nonce-less inline script is blocked from executing.
// Resolves from the SAME single source of truth ThemeProvider uses
// (elios-theme-config), so pre-hydration and post-hydration agree:
// cookie > explicit config mode > legacy localStorage key > system pref.
// ThemeProvider keeps data-theme and the palette CSS vars in sync from
// here on (see the MutationObserver in context/ThemeProvider.tsx).
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const nonce = (await headers()).get('x-nonce') ?? '';
  // NOTE: no redirect here. The root layout wraps every route (including
  // /[locale]/*), so a redirect to the default locale here loops on
  // /en itself (ERR_TOO_MANY_REDIRECTS). The root page (app/page.tsx)
  // renders the home page at /, and /[locale] handles localized paths.
  return (
    <>
      <script nonce={nonce} dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      {children}
    </>
  );
}
