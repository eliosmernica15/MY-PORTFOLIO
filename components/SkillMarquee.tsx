import React, { memo, useEffect, useRef } from 'react';
import { SKILLS } from '@/data/skills';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const SkillMarquee: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  const row1 = [...SKILLS, ...SKILLS];
  const row2 = [...[...SKILLS].reverse(), ...[...SKILLS].reverse()];

  const pillClass =
    'shrink-0 px-5 py-2.5 rounded-xl border text-sm font-medium transition-colors duration-300 cursor-default whitespace-nowrap select-none hover:bg-[var(--accent)] hover:text-[var(--accent-contrast)]';

  // Pause animation on reduced motion preference
  useEffect(() => {
    if (prefersReducedMotion) {
      row1Ref.current?.style.setProperty('animation-play-state', 'paused');
      row2Ref.current?.style.setProperty('animation-play-state', 'paused');
    } else {
      row1Ref.current?.style.setProperty('animation-play-state', 'running');
      row2Ref.current?.style.setProperty('animation-play-state', 'running');
    }
  }, [prefersReducedMotion]);

  return (
    <div className="space-y-3 overflow-hidden py-2 marquee-wrap">
      <div ref={row1Ref} className="flex gap-3 marquee-row-left gpu-layer">
        {row1.map((skill, i) => (
          <div
            key={`a-${i}`}
            className={pillClass}
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-secondary)',
            }}
          >
            {skill}
          </div>
        ))}
      </div>
      <div ref={row2Ref} className="flex gap-3 marquee-row-right gpu-layer">
        {row2.map((skill, i) => (
          <div
            key={`b-${i}`}
            className={pillClass}
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-secondary)',
            }}
          >
            {skill}
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(SkillMarquee);
