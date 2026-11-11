import { SKILL_CATEGORIES } from "@/data/skills";
import { useT } from "@/i18n/LocaleProvider";

const CATEGORY_KEY: Record<string, string> = {
  Languages: "languages",
  Frontend: "frontend",
  Backend: "backend",
  "Database & AI": "database",
  "DevOps & Infra": "devops",
  Design: "design",
};

export function StackMap() {
  const t = useT();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {SKILL_CATEGORIES.map((category) => (
        <div
          key={category.name}
          className="p-6 sm:p-8 rounded-2xl border"
          style={{
            background: "var(--bg-card)",
            borderColor: "var(--border)",
          }}
        >
          <h3
            className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6 pb-3"
            style={{
              color: "var(--accent-light)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            {t(
              `skills.categories.${CATEGORY_KEY[category.name] ?? "frontend"}`,
            )}
          </h3>
          <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
            {category.skills.map((skill) => (
              <li
                key={skill.name}
                className="py-2 text-sm"
                style={{ borderColor: "var(--border)" }}
              >
                <span style={{ color: "var(--text-secondary)" }}>
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
