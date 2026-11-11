import React from "react";
import RevealSection from "./RevealSection";
import PremiumCard from "./ui/PremiumCard";
import Chip from "./ui/Chip";
import SectionHeader from "./ui/SectionHeader";
import { AboutTimeline } from "./AboutTimeline";
import { useT } from "@/i18n/LocaleProvider";

const CAPABILITY_KEYS = [0, 1, 2, 3, 4, 5];
const STAT_VALUE_KEYS = [0, 1, 2];

const About: React.FC = () => {
  const t = useT();

  return (
    <section
      id="about"
      className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 scroll-mt-24 content-auto relative z-[1]"
    >
      <div className="max-w-7xl mx-auto">
        <RevealSection>
          <PremiumCard glow className="overflow-hidden">
            <div
              className="absolute -top-20 -right-20 w-60 h-60 blur-[80px] rounded-full pointer-events-none opacity-60"
              style={{ background: "var(--glass-accent-bg)" }}
            />
            <SectionHeader
              eyebrow={t("about.title")}
              title={t("about.subtitle")}
              subtitle={t("about.description")}
              className="mb-8 !mb-10 relative z-10"
            />
            <div className="flex flex-wrap gap-2 mb-2 relative z-10">
              {CAPABILITY_KEYS.map((i) => (
                <Chip key={i}>{t(`about.capabilities.${i}`)}</Chip>
              ))}
            </div>
            <AboutTimeline />
            <div
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 relative z-10"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              {[
                { label: t("about.focus"), value: t("about.values.0") },
                { label: t("about.principle"), value: t("about.values.1") },
                { label: t("about.availability"), value: t("about.values.2") },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <h4
                    className="text-[10px] font-bold uppercase tracking-[0.4em]"
                    style={{ color: "var(--accent-light)" }}
                  >
                    {item.label}
                  </h4>
                  <p
                    className="text-base font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </PremiumCard>
        </RevealSection>
      </div>
    </section>
  );
};

export default About;
