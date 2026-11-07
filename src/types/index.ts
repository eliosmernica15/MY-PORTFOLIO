/**
 * Centralized TypeScript Types
 *
 * This file contains all shared type definitions used across the portfolio.
 * Types are organized by domain and re-exported for easy importing.
 *
 * Import pattern:
 *   import type { Project, Skill, Service, ... } from '@/types';
 */

// ============================================================
// Project Types
// ============================================================

export interface ProjectTechRationale {
  name: string;
  reason: string;
}

export interface ProjectMetric {
  label: string;
  value: string;
  suffix?: string;
}

export interface ProjectHighlight {
  text: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  image: string;
  link: string;
  color: string;
  tech: string[];
  year: string;
  highlights?: string[];
  metrics?: ProjectMetric[];
  techRationale?: ProjectTechRationale[];
  challenge?: string;
  outcome?: string;
  role?: string;
  duration?: string;
}

// ============================================================
// Skill Types
// ============================================================

export type SkillLevel = 1 | 2 | 3 | 4 | 5;

export interface Skill {
  name: string;
  level: SkillLevel;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

// ============================================================
// Service Types
// ============================================================

export interface Service {
  id: string;
  title: string;
  desc: string;
  icon: string;
  number: string;
}

// ============================================================
// Testimonial Types
// ============================================================

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  avatar: string;
  company?: string;
  linkedinUrl?: string;
}

// ============================================================
// Note Types
// ============================================================

export type NoteBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'code'; lang: string; code: string }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'callout'; tone: 'info' | 'warn' | 'success'; text: string };

export interface Note {
  slug: string;
  title: string;
  date: string;
  readMin: number;
  tags: string[];
  summary: string;
  body: NoteBlock[];
}

// ============================================================
// Site/Contact Types
// ============================================================

export interface SiteConfig {
  name: string;
  title: string;
  shortTitle: string;
  tagline: string;
  summary: string;
  url: string;
  email: string;
  phone: string;
  location: string;
  birthday: string;
  ogImagePath: string;
  twitterHandle: string;
  locale: string;
  themeColor: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  birthday: string;
}

// ============================================================
// Experience & Education Types
// ============================================================

export interface ExperienceEntry {
  company: string;
  period: string;
  desc: string;
}

export interface EducationEntry {
  title: string;
  period: string;
  desc: string;
}

// ============================================================
// Knowledge/Assistant Types
// ============================================================

export type KnowledgeAction =
  | { type: 'scroll_to'; target: string }
  | { type: 'open_link'; target: string }
  | { type: 'open_route'; target: string };

export interface KnowledgeEntry {
  id: string;
  intent: string;
  weight: number;
  text: string;
  related?: string[];
  action?: KnowledgeAction;
}

// ============================================================
// Social Types
// ============================================================

export interface SocialLink {
  name: string;
  link: string;
  icon: string;
}

// ============================================================
// Stats Types
// ============================================================

export interface StatCard {
  value: number;
  suffix: string;
  label: string;
}

// ============================================================
// Navigation Types
// ============================================================

export interface NavLink {
  name: string;
  id: string;
}

// ============================================================
// Form Types
// ============================================================

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  company?: string;
  formTime?: number;
}

// ============================================================
// Theme Types
// ============================================================

export type ThemeMode = 'light' | 'dark' | 'auto' | 'time';

export interface ThemeConfig {
  paletteId: string;
  mode: ThemeMode;
  autoSwitch: boolean;
}

export interface AccentPaletteColors {
  accent: string;
  accentLight: string;
  accentDark: string;
  accentMuted: string;
  accentContrast: string;
  textOnAccent: string;
  shadowAccent: string;
  ringFocus: string;
  gradientFrom: string;
  gradientMid: string;
  gradientTo: string;
  scrollbarThumb: string;
  selectionBg: string;
}

export interface AccentPalette {
  id: string;
  name: string;
  light: AccentPaletteColors;
  dark: AccentPaletteColors;
}

// ============================================================
// Animation/Motion Types
// ============================================================

export type EasingFunction =
  | [number, number, number, number]
  | { type: 'spring'; stiffness: number; damping: number };

export interface MotionDurations {
  instant: 0;
  fast: 150;
  normal: 250;
  slow: 400;
  slower: 600;
  slowest: 1000;
}

export interface MotionStaggers {
  tight: 0.04;
  normal: 0.08;
  loose: 0.12;
  section: 0.16;
}

// ============================================================
// Device Profile Types
// ============================================================

export interface DeviceProfile {
  enable3D: boolean;
  enableHeavyEffects: boolean;
  enableCustomCursor: boolean;
  isMobile: boolean;
  isTablet: boolean;
  prefersReducedMotion: boolean;
}

// ============================================================
// Rate Limiting Types
// ============================================================

export interface RateLimitOptions {
  capacity: number;
  refillPerSecond: number;
}

export interface RateLimitResult {
  ok: boolean;
  retryAfterMs: number;
  remaining: number;
}

// ============================================================
// Search Types
// ============================================================

export interface SearchResult<T = unknown> {
  item: T;
  score: number;
  matchedFields: string[];
  snippet: string;
}

export interface SearchOptions {
  topK?: number;
  threshold?: number;
  includeSnippet?: boolean;
  queryExpansion?: boolean;
}

// ============================================================
// Terminal Types
// ============================================================

export type TerminalAction =
  | { type: 'scroll_to'; target: string }
  | { type: 'open_link'; target: string }
  | { type: 'open_route'; target: string }
  | { type: 'set_theme'; theme: 'dark' | 'light' | 'toggle' }
  | { type: 'clear' };

export type CommandOutput = string | { output: string; action?: TerminalAction };

export interface TerminalMessage {
  id: string;
  prompt: string;
  text: string;
  ts: number;
}

// ============================================================
// Assistant Chat Types
// ============================================================

export type AssistantMessageRole = 'user' | 'bot';

export interface AssistantMessage {
  id: string;
  role: AssistantMessageRole;
  content: string;
  card?: KnowledgeEntry;
  ts: number;
}

export interface QuickPrompt {
  text: string;
  intent?: string;
}

// ============================================================
// Utility Types
// ============================================================

/** Make all properties of T required */
export type Required<T> = {
  [P in keyof T]-?: T[P];
};

/** Make all properties of T optional */
export type Optional<T> = {
  [P in keyof T]?: T[P];
};

/** Extract the element type of an array */
export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

/** Extract the return type of a function */
export type ReturnType<T> = T extends (...args: unknown[]) => infer R ? R : never;

/** Deep partial type */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/** Non-nullable type */
export type NonNullable<T> = T extends null | undefined ? never : T;

/** Make specific keys required */
export type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

/** Make specific keys optional */
export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// ============================================================
// Re-export commonly used types for convenience
// ============================================================

// Data arrays (for components that need the actual data)
// Note: These are the actual data arrays, not types
// import { PROJECTS, SKILL_CATEGORIES, SERVICES, ... } from '@/data/...'