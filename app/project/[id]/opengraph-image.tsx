import { ImageResponse } from 'next/og';
import { PROJECTS } from '@/data/projects';
import { SITE } from '@/data/site';

export const alt = 'Project case study';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateImageMetadata(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return [{ id, alt: PROJECTS.find(p => p.id === id)?.title ?? 'Project', contentType, size }];
}

export async function generateStaticParams() {
  return PROJECTS.map(p => ({ id: p.id }));
}

export default async function OGImage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = PROJECTS.find(p => p.id === id);
  if (!project) {
    return new ImageResponse(<div>Project not found</div>, { ...size });
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 80,
          background: '#0a0a0a',
          color: '#ffffff',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 600,
            height: 600,
            background: `radial-gradient(circle at 100% 0%, ${project.color}33, transparent 70%)`,
            display: 'flex',
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            color: project.color,
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: 'uppercase',
          }}
        >
          <div style={{ width: 32, height: 2, background: project.color }} />
          {project.category} · {project.year}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto' }}>
          <div
            style={{
              fontSize: 104,
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              maxWidth: 1000,
            }}
          >
            {project.title}
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 400,
              color: 'rgba(255,255,255,0.7)',
              marginTop: 32,
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            {project.description}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 48,
            color: 'rgba(255,255,255,0.5)',
            fontSize: 16,
            fontWeight: 500,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          <span>{SITE.name}</span>
          <span>Case Study · {project.year}</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
