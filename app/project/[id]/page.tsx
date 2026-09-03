import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PROJECTS } from '@/data/projects';
import { SITE } from '@/data/site';
import { buildBreadcrumbs } from '@/lib/breadcrumbs';
import { gradientBlur } from '@/lib/blurDataURL';
import ProjectDetail from '@/components/ProjectDetail';

// `dynamicParams = false` means every project route is statically
// prebuilt at build time. This is critical for click-to-detail
// speed: the page's HTML, RSC payload, and JS chunk are all
// precomputed and cached at the edge, so the click resolves
// against a warm cache with no DB / SSR compute in the hot path.
export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map(p => ({ id: p.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const project = PROJECTS.find(p => p.id === id);
  if (!project) return { title: 'Project not found' };

  const title = `${project.title} — Case Study`;
  const description = project.description;
  return {
    title,
    description,
    alternates: { canonical: `/project/${project.id}` },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `${SITE.url}/project/${project.id}`,
      siteName: SITE.name,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function ProjectPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = PROJECTS.find(p => p.id === id);
  if (!project) notFound();
  const breadcrumbs = buildBreadcrumbs(`/project/${id}`);
  // Per-project blur placeholder. The Next/Image component uses
  // this as the `blurDataURL`, which paints a tiny gradient under
  // the full-size image as it loads. Without it, the image area
  // shows a white flash while the postimg URL is fetched.
  const blur = gradientBlur(project.color || '#171717', '#0a0a0a');
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
