import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';
export const runtime = 'edge';

export default function Icon() {
  // Monogram: "E" with a dot, drawn at 32×32.
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000000',
          color: '#ffffff',
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: '-0.05em',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        E<span style={{ color: '#a78bfa' }}>.</span>
      </div>
    ),
    { ...size }
  );
}
