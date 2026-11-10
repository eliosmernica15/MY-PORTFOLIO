import React from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RevealSection } from "@/components/RevealSection";
import { StackMap } from "@/components/StackMap";
import SkillMarquee from "@/components/SkillMarquee";

/**
 * Stack section: categorized skills with confidence dots (StackMap) above the
 * infinite skill marquee. Kept as its own section so Home stays readable.
 */
const StackSection: React.FC = () => {
  return (
    <section
      id="stack"
      className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 max-w-7xl mx-auto relative z-[1] content-auto"
      aria-labelledby="stack-heading"
    >
      <RevealSection>
        <SectionHeader
          eyebrow="Stack"
          title={
            <>
              What I build{" "}
              <span className="italic" style={{ color: "var(--text-muted)" }}>
                with.
              </span>
            </>
          }
          subtitle="Categorized by what they actually do in production - not a wall of logos."
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
