"use client";

import React, { useState } from "react";
import { Wrench, Cpu, CheckCircle2 } from "lucide-react";
import { SERVICES } from "@/data/services";
import { SKILL_CATEGORIES } from "@/data/skills";
import { useT } from "@/i18n/LocaleProvider";

/**
 * System Preferences — services & skills, OS-settings style.
 * Two panes: what I deliver (services, with concrete descriptions)
 * and the working stack (grouped, no self-rated percentage meters).
 */

type Pane = "services" | "stack";

const PreferencesApp: React.FC = () => {
  const t = useT();
  const [pane, setPane] = useState<Pane>("services");

  const services = SERVICES; // 4 entries; titles/descs come from i18n

  return (
    <div className="grid h-full grid-cols-[7rem_1fr] sm:grid-cols-[10rem_1fr]">
      {/* Sidebar */}
      <nav
        aria-label={t("dock.preferences")}
        className="flex flex-col gap-0.5 border-r p-2"
        style={{
          borderColor: "var(--border)",
          background: "var(--surface-elevated)",
        }}
      >
        {(
          [
            { id: "services", icon: Wrench, label: t("prefs.servicesPane") },
            { id: "stack", icon: Cpu, label: t("prefs.stackPane") },
          ] as const
        ).map((item) => {
          const active = pane === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setPane(item.id)}
              aria-pressed={active}
              className="interactive-btn flex items-center gap-2 rounded-lg px-2 py-2 text-left text-[9px] sm:text-[10px] font-semibold"
              style={{
                background: active ? "var(--pill-border)" : "transparent",
                color: active ? "var(--text-primary)" : "var(--text-secondary)",
              }}
            >
              <Icon size={13} aria-hidden className="shrink-0" />
              <span className="min-w-0 truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Pane */}
      <div className="min-w-0 overflow-y-auto p-4 sm:p-6">
        {pane === "services" ? (
          <>
            <p className="os-label">{t("prefs.deliverLabel")}</p>
            <ul className="space-y-2.5">
              {services.map((service, idx) => (
                <li
                  key={service.id}
                  className="rounded-xl border p-3 sm:p-4"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--input-bg)",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-[9px] sm:text-[10px] tabular-nums text-[var(--text-muted)] pt-0.5">
                      0{idx + 1}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-[12px] sm:text-sm font-bold leading-snug text-[var(--text-primary)]">
                        {t(`services.items.${idx}.title`)}
                      </h3>
                      <p className="mt-1 text-[10px] sm:text-[11px] leading-snug text-[var(--text-secondary)]">
                        {t(`services.items.${idx}.description`)}
                      </p>
                    </div>
                    <CheckCircle2
                      size={16}
                      aria-hidden
                      className="ml-auto shrink-0 self-start text-[var(--accent)]"
                    />
                  </div>
                </li>
              ))}
            </ul>
            <p className="os-note mt-3">{t("prefs.servicesNote")}</p>
          </>
        ) : (
          <>
            <p className="os-label">{t("prefs.stackLabel")}</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SKILL_CATEGORIES.map((category) => (
                <div
                  key={category.name}
                  className="rounded-xl border p-3"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--input-bg)",
                  }}
                >
                  <h3 className="font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--text-muted)]">
                    {category.name}
                  </h3>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {category.skills.map((skill) => (
                      <li key={skill.name} className="os-chip">
                        {skill.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="os-note mt-3">{t("prefs.stackNote")}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PreferencesApp;
