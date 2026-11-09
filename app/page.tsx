import type { Metadata } from 'next';
import Home from '@/components/Home';
import { SITE } from '@/data/site';
import { buildBreadcrumbs } from '@/lib/breadcrumbs';
import { Providers } from './Providers';

// Force dynamic rendering to avoid prerender cache that causes redirect loops
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { default: `${SITE.name} — ${SITE.title}`, template: `%s · ${SITE.name}` },
  description: SITE.summary,
  alternates: { canonical: '/' },
};

export default function Page() {
  const breadcrumbs = buildBreadcrumbs('/');
  return (
    // NOTE: the root page lives outside app/[locale], so it must provide
    // its own Providers (ThemeProvider etc.) — Home uses useTheme() and
    // throws "useTheme must be used within a ThemeProvider" without it.
    <Providers>
      <Home />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
    </Providers>
  );
}
