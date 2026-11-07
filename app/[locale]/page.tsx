import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Home from '@/components/Home';
import { getTranslations } from 'next-intl/server';
import { SITE } from '@/data/site';
import { buildBreadcrumbs } from '@/lib/breadcrumbs';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });

  return {
    title: {
      default: `${SITE.name} — ${SITE.title}`,
      template: `%s · ${SITE.name}`,
    },
    description: SITE.summary,
    alternates: {
      canonical: `/${locale}`,
    },
    openGraph: {
      locale: 'en_US',
      url: `https://eliosmernica.vercel.app/${locale}`,
      siteName: SITE.name,
      title: `${SITE.name} — ${SITE.title}`,
      description: SITE.summary,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const breadcrumbs = await buildBreadcrumbs(`/${locale}`);

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