import React from 'react';

const FloatingOrbs: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div
      className="absolute top-20 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.07]"
      style={{
        background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
        animation: 'float 20s ease-in-out infinite',
      }}
    />
    <div
      className="absolute bottom-20 -right-32 w-[400px] h-[400px] rounded-full opacity-[0.05]"
      style={{
        background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
        animation: 'floatReverse 25s ease-in-out infinite',
      }}
    />
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04]"
      style={{
        background: 'radial-gradient(circle, var(--accent-light) 0%, transparent 70%)',
        animation: 'floatSlow 30s ease-in-out infinite',
      }}
    />
  </div>
);

export default FloatingOrbs;
