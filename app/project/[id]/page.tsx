import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getProjects } from "@/data/i18n";
import { SITE } from "@/data/site";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import { gradientBlur } from "@/lib/blurDataURL";
import ProjectDetail from "@/components/ProjectDetail";

// Case studies render in the visitor's language: the HTML is streamed with
// a per-request CSP nonce anyway, so static generation would only serve a
// stale English artifact to Albanian readers. Locale comes from x-locale
// (set by middleware from path/cookie/Accept-Language).
export const dynamic = "force-dynamic";

function resolveLocale(value: string | null): "en" | "sq" {
  return value === "sq" ? "sq" : "en";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const locale = resolveLocale((await headers()).get("x-locale"));
  const project = getProjects(locale).find((p) => p.id === id);
  if (!project) return { title: "Project not found" };

  const title = `${project.title} — Case Study`;
  const description = project.description;
  return {
    title,
    description,
    alternates: {
      canonical: `/project/${project.id}`,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: `${SITE.url}/project/${project.id}`,
      siteName: SITE.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = resolveLocale((await headers()).get("x-locale"));
  const project = getProjects(locale).find((p) => p.id === id);
  if (!project) notFound();
  const breadcrumbs = buildBreadcrumbs(`/project/${id}`);
  // Per-project blur placeholder painted under the full-size image.
  const blur = gradientBlur(project.color || "#171717", "#0a0a0a");
  return (
    <>
      <ProjectDetail project={project} blurDataURL={blur} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
    </>
  );
}
