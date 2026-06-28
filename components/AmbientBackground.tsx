import React, { memo } from 'react';

const AmbientBackground: React.FC = () => (
  <div className="ambient-background" aria-hidden>
    <div className="ambient-grid" />
    <div className="ambient-orb ambient-orb-a" />
    <div className="ambient-orb ambient-orb-b" />
    <div className="ambient-vignette" />
  </div>
);

export default memo(AmbientBackground);
