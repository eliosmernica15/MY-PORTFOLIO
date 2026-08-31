import type { Metadata } from 'next';
import Home from '@/components/Home';
import { SITE } from '@/data/site';

export const metadata: Metadata = {
  title: { default: `${SITE.name} — ${SITE.title}`, template: `%s · ${SITE.name}` },
  description: SITE.summary,
  alternates: { canonical: '/' },
};

export default function Page() {
  return <Home />;
}
