"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Quote,
  Star,
  Pause,
  Play,
} from "lucide-react";
import { TESTIMONIALS as EN_TESTIMONIALS } from "@/data/testimonials";
import RevealSection from "./RevealSection";
import SectionHeader from "./ui/SectionHeader";
import MagneticButton from "./MagneticButton";
import { useT, useLocale } from "@/i18n/LocaleProvider";
import { getTestimonials } from "@/data/i18n";

type Testimonial = (typeof EN_TESTIMONIALS)[number];
const AUTOPLAY_MS = 6000;

const StarRating: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <div className="flex gap-1">
    {Array.from({ length: count }).map((_, i) => (
      <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
    ))}
  </div>
);

const TestimonialSlide = memo<{ testimonial: Testimonial }>(
  function TestimonialSlide({ testimonial }) {
    return (
      <>
        <Quote
          size={48}
          className="sm:hidden absolute top-4 left-4 opacity-[0.08]"
          style={{ color: "var(--accent)" }}
        />
        <Quote
          size={60}
          className="hidden sm:block absolute top-6 left-8 opacity-[0.08]"
          style={{ color: "var(--accent)" }}
        />
        <div className="flex justify-center mb-6">
          <StarRating />
        </div>
        <p
          className="text-base sm:text-lg md:text-2xl font-medium leading-relaxed mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          &ldquo;{testimonial.text}&rdquo;
        </p>
        <div className="flex flex-col items-center">
          <div
            className="w-16 h-16 rounded-full mb-3 p-0.5 overflow-hidden relative"
            style={{ border: "2px solid var(--accent)" }}
          >
            <Image
              src={testimonial.avatar}
              alt={testimonial.name}
              className="rounded-full object-cover"
              width={64}
              height={64}
              loading="lazy"
            />
          </div>
          <h4
            className="font-bold text-lg"
            style={{ color: "var(--text-primary)" }}
          >
            {testimonial.name}
          </h4>
          <p
            className="text-[10px] uppercase tracking-widest font-bold mt-1"
            style={{ color: "var(--accent-light)" }}
          >
            {testimonial.role}
            {testimonial.company ? `, ${testimonial.company}` : ""}
          </p>
        </div>
      </>
    );
  },
);

const TestimonialCarousel: React.FC<{ testimonials: Testimonial[] }> = ({
  testimonials,
}) => {
  const t = useT();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  const next = useCallback(() => {
    setIndex((p) => (p + 1) % testimonials.length);
    setProgressKey((k) => k + 1);
  }, [testimonials.length]);
  const prev = useCallback(() => {
    setIndex((p) => (p - 1 + testimonials.length) % testimonials.length);
    setProgressKey((k) => k + 1);
  }, [testimonials.length]);

  const togglePause = useCallback(() => {
    setPaused((p) => !p);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, next]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex items-center justify-center min-h-[440px] sm:min-h-[420px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl w-full text-center relative"
          >
            <div className="premium-card premium-card-glow">
              <div className="premium-card-inner p-6 sm:p-10 md:p-14 relative overflow-hidden">
                <TestimonialSlide testimonial={testimonials[index]} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="progress-enterprise mt-6 max-w-md mx-auto">
        <motion.div
          key={progressKey}
          className="progress-enterprise-fill"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: paused ? undefined : 1 }}
          transition={{
            duration: paused ? 0 : AUTOPLAY_MS / 1000,
            ease: "linear",
          }}
          style={paused ? { transform: "scaleX(0)" } : undefined}
        />
      </div>

      <div className="flex items-center justify-center gap-5 mt-6">
        <MagneticButton strength={0.2}>
          <button
            type="button"
            onClick={prev}
            className="interactive-btn w-10 h-10 rounded-full flex items-center justify-center nav-link"
            style={{
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-primary)",
            }}
            aria-label={t("testimonials.previous")}
          >
            <ChevronLeft size={16} />
          </button>
        </MagneticButton>
        <div className="flex items-center gap-3">
          <span
            className="text-[10px] font-bold uppercase tracking-widest tabular-nums"
            style={{ color: "var(--text-muted)" }}
            aria-live="polite"
          >
            {index + 1} / {testimonials.length}
          </span>
          <div className="flex items-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setIndex(i);
                  setProgressKey((k) => k + 1);
                }}
                className={`rounded-full transition-all duration-300 ${i === index ? "w-6 h-2 bg-[var(--accent)]" : "w-2 h-2 hover:opacity-60"}`}
                style={
                  i !== index ? { backgroundColor: "var(--border)" } : undefined
                }
                aria-label={t("testimonials.goTo", { index: i + 1 })}
                aria-current={i === index ? "true" : undefined}
              />
            ))}
          </div>
        </div>
        <MagneticButton strength={0.2}>
          <button
            type="button"
            onClick={next}
            className="interactive-btn w-10 h-10 rounded-full flex items-center justify-center nav-link"
            style={{
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-primary)",
            }}
            aria-label={t("testimonials.next")}
          >
            <ChevronRight size={16} />
          </button>
        </MagneticButton>

        {/* Pause/Play button for WCAG 2.2.2 */}
        <MagneticButton strength={0.2}>
          <button
            type="button"
            onClick={togglePause}
            className="interactive-btn w-10 h-10 rounded-full flex items-center justify-center nav-link"
            style={{
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-primary)",
            }}
            aria-label={
              paused ? t("testimonials.play") : t("testimonials.pause")
            }
            aria-pressed={paused}
          >
            {paused ? <Play size={16} /> : <Pause size={16} />}
          </button>
        </MagneticButton>
      </div>
    </div>
  );
};

const Testimonials: React.FC = () => {
  const t = useT();
  const locale = useLocale();
  const testimonials = getTestimonials(locale);
  return (
    <section className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 max-w-7xl mx-auto content-auto relative z-[1]">
      <RevealSection>
        <SectionHeader
          align="center"
          eyebrow={t("testimonials.title")}
          title={t("testimonials.subtitle")}
          subtitle={t("testimonials.description")}
        />
      </RevealSection>
      <TestimonialCarousel testimonials={testimonials} />
    </section>
  );
};

export default Testimonials;
