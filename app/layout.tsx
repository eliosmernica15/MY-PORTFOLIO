import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Elios Mernica — Software Engineer',
  description: 'Software engineer specializing in web development, system design, and network infrastructure. Based in Kosovo, available worldwide.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // NOTE: no redirect here. The root layout wraps every route (including
  // /[locale]/*), so a redirect to the default locale here loops on
  // /en itself (ERR_TOO_MANY_REDIRECTS). The root page (app/page.tsx)
  // renders the home page at /, and /[locale] handles localized paths.
  return <>{children}</>;
}
