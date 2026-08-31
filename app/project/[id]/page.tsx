import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PROJECTS } from '@/data/projects';
import { SITE } from '@/data/site';
import ProjectDetail from '@/components/ProjectDetail';

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
  return <ProjectDetail project={project} />;
}
