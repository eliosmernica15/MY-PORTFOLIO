import React, { Suspense } from 'react';
import Spline from '@splinetool/react-spline';

const SPLINE_SCENE_URL = 'https://prod.spline.design/RONF3SHpGTERZs4g/scene.splinecode';

const SplineScene: React.FC = () => {
  const onLoad = (spline: { setBackgroundColor: (color: string) => void }) => {
    spline.setBackgroundColor('transparent');
  };

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none min-h-[100dvh] sm:min-h-0"
      aria-hidden
    >
      <Suspense
        fallback={
          <div className="absolute inset-0 min-w-full min-h-full" style={{ background: 'transparent' }} />
        }
      >
        {/* Responsive scale: smaller on phones, then scale up for tablet/desktop */}
        <div className="absolute inset-0 min-w-full min-h-full scale-[1.05] sm:scale-[1.18] md:scale-[1.18] lg:scale-[1.15] origin-center" style={{ background: 'transparent' }}>
          <Spline scene={SPLINE_SCENE_URL} onLoad={onLoad} style={{ background: 'transparent' }} />
        </div>
      </Suspense>
    </div>
  );
};

export default SplineScene;
