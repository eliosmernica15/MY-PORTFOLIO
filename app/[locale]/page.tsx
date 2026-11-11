import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Home from "@/components/Home";
import { SITE } from "@/data/site";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import { isValidLocale } from "@/i18n/config";

interface PageProps {
  params: Promise<{ locale: string }>;
}

// Force dynamic rendering - the HTML carries a per-request CSP nonce.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const isAlbanian = locale === "sq";
  const title = isAlbanian
    ? `${SITE.name} — Inxhinier Softueri`
    : `${SITE.name} — ${SITE.title}`;
  const description = isAlbanian
    ? "Inxhinier softueri i specializuar në zhvillim web, dizajn sistemesh dhe infrastrukturë rrjetesh. Bazuar në Kosovë, i disponueshëm në të gjithë botën."
    : SITE.summary;

  return {
    title: {
      default: title,
      template: `%s · ${SITE.name}`,
    },
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", sq: "/sq", "x-default": "/en" },
    },
    openGraph: {
      locale: isAlbanian ? "sq_AL" : "en_US",
      alternateLocale: isAlbanian ? ["en_US"] : ["sq_AL"],
      url: `https://eliosmernica.vercel.app/${locale}`,
      siteName: SITE.name,
      title,
      description,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
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
