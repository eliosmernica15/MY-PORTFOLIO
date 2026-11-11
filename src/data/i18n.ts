/**
 * Locale-aware data resolvers. Components call these instead of importing the
 * raw English datasets directly; the Albanian dataset is selected when the
 * active locale is 'sq'.
 */
import { PROJECTS } from "./projects";
import { NOTES } from "./notes";
import { EDUCATION } from "./education";
import { EXPERIENCE } from "./experience";
import { NOW } from "./now";
import { TESTIMONIALS } from "./testimonials";
import { SQ_PROJECTS } from "./locale-sq";
import {
  SQ_NOTES,
  SQ_TESTIMONIALS,
  SQ_EDUCATION,
  SQ_EXPERIENCE,
  SQ_NOW,
} from "./locale-sq-content";
import type { Locale } from "@/i18n/config";
import type {
  Project,
  Note,
  Testimonial,
  EducationEntry,
  ExperienceEntry,
} from "@/types";

export const getProjects = (locale: Locale): Project[] =>
  locale === "sq" ? SQ_PROJECTS : PROJECTS;
export const getNotes = (locale: Locale): Note[] =>
  locale === "sq" ? SQ_NOTES : NOTES;
export const getTestimonials = (locale: Locale): Testimonial[] =>
  locale === "sq" ? SQ_TESTIMONIALS : TESTIMONIALS;
export const getEducation = (locale: Locale): EducationEntry[] =>
  locale === "sq" ? SQ_EDUCATION : EDUCATION;
export const getExperience = (locale: Locale): ExperienceEntry[] =>
  locale === "sq" ? SQ_EXPERIENCE : EXPERIENCE;
export const getNow = (locale: Locale): string =>
  locale === "sq" ? SQ_NOW : NOW.line;
