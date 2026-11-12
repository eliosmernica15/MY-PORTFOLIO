import type { Metadata } from "next";
import Home from "@/components/Home";
import { SITE } from "@/data/site";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";

// Force dynamic rendering - the HTML carries a per-request CSP nonce.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} - ${SITE.title}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.summary,
  alternates: { canonical: "/en" },
};

export default function Page() {
  const breadcrumbs = buildBreadcrumbs("/");
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
