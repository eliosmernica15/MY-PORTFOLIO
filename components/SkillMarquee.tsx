import React from 'react';
import { SKILLS } from '../constants';

const SkillMarquee: React.FC = () => {
  const row1 = [...SKILLS, ...SKILLS, ...SKILLS];
  const row2 = [
    ...[...SKILLS].reverse(),
    ...[...SKILLS].reverse(),
    ...[...SKILLS].reverse(),
  ];

  const pillClass =
    'shrink-0 px-5 py-2.5 rounded-xl border text-sm font-medium transition-colors duration-300 cursor-default whitespace-nowrap select-none hover:text-white';

  return (
    <div className="space-y-3 overflow-hidden py-2 [&:hover_div]:![animation-play-state:paused]">
      <div
        className="flex gap-3"
        style={{
          animation: 'marquee-left 40s linear infinite',
          width: 'max-content',
        }}
      >
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
      <div
        className="flex gap-3"
        style={{
          animation: 'marquee-right 45s linear infinite',
          width: 'max-content',
        }}
      >
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

export default SkillMarquee;
