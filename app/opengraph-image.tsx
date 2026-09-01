import { ImageResponse } from 'next/og';
import { SITE } from '@/data/site';

export const alt = `${SITE.name} — ${SITE.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const runtime = 'edge';

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '80px',
          background: '#000000',
          color: '#ffffff',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#a78bfa', fontSize: 18, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase' }}>
          <div style={{ width: 32, height: 2, background: '#a78bfa' }} />
          Portfolio · 2026
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto' }}>
          <div style={{ fontSize: 96, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>
            {SITE.name}
          </div>
          <div style={{ fontSize: 36, fontWeight: 300, color: 'rgba(255,255,255,0.7)', marginTop: 24, maxWidth: 900, lineHeight: 1.3 }}>
            {SITE.tagline}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 48, color: 'rgba(255,255,255,0.5)', fontSize: 18, fontWeight: 500, letterSpacing: 2, textTransform: 'uppercase' }}>
          <span>{SITE.location}</span>
          <span>·</span>
          <span>Available for projects</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
