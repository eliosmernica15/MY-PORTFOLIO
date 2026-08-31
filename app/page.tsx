import type { Metadata } from 'next';
import Home from '@/components/Home';
import { SITE } from '@/data/site';
import { buildBreadcrumbs } from '@/lib/breadcrumbs';

export const metadata: Metadata = {
  title: { default: `${SITE.name} — ${SITE.title}`, template: `%s · ${SITE.name}` },
  description: SITE.summary,
  alternates: { canonical: '/' },
};

export default function Page() {
  const breadcrumbs = buildBreadcrumbs('/');
  return (
    <>
      <Home />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
    </>
  );
}
