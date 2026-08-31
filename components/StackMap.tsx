import { SKILL_CATEGORIES } from '@/data/skills';

export function StackMap() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {SKILL_CATEGORIES.map((category) => (
        <div
          key={category.name}
          className="p-6 sm:p-8 rounded-2xl border"
          style={{
            background: 'var(--bg-card)',
            borderColor: 'var(--border)',
          }}
        >
          <h3
            className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6 pb-3"
            style={{
              color: 'var(--accent-light)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            {category.name}
          </h3>
          <ul className="space-y-3">
            {category.skills.map((skill) => (
              <li key={skill.name} className="flex items-center gap-3">
                <span className="flex items-center gap-1" aria-label={`Level ${skill.level} of 5`}>
                  {[1, 2, 3, 4, 5].map((dot) => (
                    <span
                      key={dot}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: dot <= skill.level ? 'var(--accent)' : 'var(--border)',
                      }}
                    />
                  ))}
                </span>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {skill.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
