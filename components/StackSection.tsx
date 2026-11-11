import React from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RevealSection } from "@/components/RevealSection";
import { StackMap } from "@/components/StackMap";
import SkillMarquee from "@/components/SkillMarquee";
import { useT } from "@/i18n/LocaleProvider";

/**
 * Stack section: categorized skills with confidence dots (StackMap) above the
 * infinite skill marquee. Kept as its own section so Home stays readable.
 */
const StackSection: React.FC = () => {
  const t = useT();
  return (
    <section
      id="stack"
      className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 max-w-7xl mx-auto relative z-[1] content-auto"
      aria-labelledby="stack-heading"
    >
      <RevealSection>
        <SectionHeader
          eyebrow={t("skills.title")}
          title={t("skills.stackTagline")}
          subtitle={t("skills.tagline")}
        />
      </RevealSection>
      <RevealSection className="mt-14">
        <StackMap />
      </RevealSection>
      <RevealSection className="mt-16">
        <SkillMarquee />
      </RevealSection>
    </section>
  );
};

export default StackSection;
