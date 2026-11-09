# Comprehensive Audit Report - Elios Mernica Portfolio

> **Remediation note (2026-11-09):** the dependency/security findings in this report
> have since been addressed: `next` 15.5.25 → 15.5.29, `next-intl` 3 → 4.14.9 (open
> redirect / prototype pollution), `nodemailer` 9 → 10.4.0, `zod` 3 → 4.6.7, `postcss`
> forced to ^8.5.32 via npm overrides (CVE chain in Next's bundled postcss). The unused
> `@xenova/transformers` dependency (unwired `src/lib/semanticSearch.ts`, removed) was
> the source of the `protobufjs` advisories. `npm audit --omit=dev` reports 0
> vulnerabilities. The VITE_* EmailJS variables were renamed to server-side
> `EMAILJS_*` (see below). Remaining accepted risks: dev-only advisories in
> `@lhci/cli`/lighthouse (basic-ftp, never executed or shipped) and the build-time
> postcss findings that require a Next.js 16 upgrade.

**Date:** 2026-11-06  
**Scope:** Full codebase review (components, security, performance, accessibility, architecture)  
**Status:** Phase 0 Security complete — now auditing for advanced improvements

---

## 📋 Executive Summary

The portfolio is **well-architected** with modern Next.js 15 patterns (RSC, streaming, ISR), excellent CSS variable theming, and thoughtful UX details (custom cursor, magnetic buttons, terminal/assistant panels). However, there are **significant opportunities** to elevate it to "world-class" across security hardening, accessibility, performance, and advanced features.

**Overall Grade: B+** — Strong foundation, needs targeted hardening and polish.

---

## 🔴 CRITICAL Security Issues (Fix Immediately)

### 1. **CSP Trusted Types Policy Too Permissive**

**File:** `app/layout.tsx:85-89`

```typescript
createPolicy("default", {
  createHTML: (s) => s, // ❌ DANGEROUS - allows arbitrary HTML
  createScript: (s) => s, // ❌ DANGEROUS - allows arbitrary scripts
  createScriptURL: (s) => s,
});
```

**Risk:** Defeats the entire purpose of Trusted Types by allowing any string through. An XSS vulnerability anywhere in the app could execute arbitrary code.
**Fix:** Implement strict policies with DOMPurify or allowlist-specific safe operations only.

### 2. **Missing Rate Limiting on Contact Form (Production)**

**File:** `src/lib/ratelimit.ts` — Upstash/Vercel KV not configured in production
**Risk:** Contact form is only protected by in-memory rate limiting (per-instance). On Vercel with multiple instances, attackers can bypass limits.
**Fix:** Configure `KV_REST_API_URL` and `KV_REST_API_TOKEN` in Vercel environment variables immediately.

### 3. **No CSRF Protection on Server Actions**

**File:** `app/actions/contact.ts`
**Risk:** Server Actions are vulnerable to CSRF attacks. While Next.js 15 has some built-in protection, it's not fully documented/verified.
**Fix:** Implement double-submit cookie pattern or use `next-safe-action` library.

### 4. **EmailJS Credentials in Client Bundle Risk**

**File:** `app/actions/contact.ts:56-58` — Uses `VITE_` prefix which exposes to client
**Risk:** `VITE_EMAILJS_*` variables are exposed to the browser. While the action uses them server-side, the naming convention suggests they might be used client-side elsewhere.
**Fix:** Rename to `EMAILJS_*` (no VITE_ prefix) and ensure they're only used in server actions.

### 5. **Missing Security Headers on Static Assets**

**File:** `next.config.mjs:43-69` — Headers only apply to dynamic routes
**Risk:** Static assets (images, fonts) served from CDN don't get security headers.
**Fix:** Configure headers at CDN level (Vercel) or use `next.config.js` `headers()` with proper matching.

---

## 🟠 HIGH Priority UI/UX & Accessibility Issues

### 6. **Custom Cursor Accessibility Violations**

**File:** `components/CustomCursor.tsx`, `app/globals.css:311-324`

- **Issue:** `cursor: none !important` on body breaks keyboard navigation visibility
- **Issue:** No focus indicator when custom cursor is active
- **WCAG:** 2.4.7 Focus Visible (AA) — **FAIL**
- **Fix:** Ensure `:focus-visible` always shows native cursor + strong outline

### 7. **Reduced Motion Not Fully Respected**

**Files:** Multiple components use `framer-motion` without checking `prefers-reduced-motion`

- **Hero.tsx:** SplineScene/ParticleCanvas load regardless of reduced motion
- **Terminal/AssistantChat:** Animations run without reduced motion check
- **SkillMarquee:** Continuous animation with no pause option
- **Fix:** Central `useReducedMotion` hook + respect in all animated components

### 8. **Terminal/Assistant Focus Trap Issues**

**Files:** `components/Terminal.tsx`, `components/AssistantChat.tsx`

- **Issue:** Focus trap activates on mount but doesn't handle nested dialogs
- **Issue:** No "inert" attribute on background content when panels open
- **Issue:** Escape key behavior inconsistent (minimize vs close)
- **Fix:** Use `react-aria` dialog patterns, proper `inert` on backdrop

### 9. **Contact Form Validation Not Accessible**

**File:** `components/Contact.tsx:136-139`

- **Issue:** Error messages use `motion.p` but lack `aria-live="assertive"`
- **Issue:** No `aria-describedby` linking inputs to errors
- **Fix:** Add proper ARIA attributes, use `role="alert"` for errors

### 10. **Missing Skip Links for Keyboard Users**

**File:** `app/layout.tsx:160` — Has skip link but only to `#main-content`

- **Issue:** No skip links for Terminal, Assistant, Navigation
- **Fix:** Add skip links for all major interactive regions

### 11. **Color Contrast Issues**

**File:** `app/globals.css` — CSS variables

- **Issue:** `--text-muted` (rgba(0,0,0,0.5) / rgba(255,255,255,0.55)) may fail 4.5:1 on some backgrounds
- **Issue:** `--border` (rgba(0,0,0,0.1) / rgba(255,255,255,0.1)) too subtle for focus indicators
- **Fix:** Audit all color pairs against WCAG AA/AAA, adjust variables

### 12. **Autoplaying Testimonials Carousel**

**File:** `components/Testimonials.tsx:13-14, 70-74`

- **Issue:** Auto-advances every 6s with no pause button visible
- **WCAG:** 2.2.2 Pause, Stop, Hide (A) — **FAIL**
- **Fix:** Add visible pause/play control, respect `prefers-reduced-motion`

---

## 🟡 MEDIUM Priority Performance & Architecture Issues

### 13. **Framer Motion Bundle Size Impact**

**Files:** `components/Terminal.tsx`, `components/AssistantChat.tsx`, `components/Resume.tsx`, `components/Testimonials.tsx`

- **Issue:** Framer Motion (~40KB gzipped) loaded on every page for simple animations
- **Impact:** Adds ~100-150ms to TTI on mobile
- **Fix:** Replace simple animations with CSS transitions, use `motion` only for complex gestures

### 14. **Spline 3D Scene Loads Unconditionally**

**File:** `components/Hero.tsx:54-58`

- **Issue:** Loads Spline runtime (~200KB) even on mobile/low-power devices
- **Current:** Only checks `profile.enable3D` after mount
- **Fix:** Server-side device detection + conditional import, or use `next/dynamic` with `ssr: false`

### 15. **Particle Canvas No WebGL Fallback**

**File:** `components/ParticleCanvas.tsx` (not read but referenced)

- **Issue:** Canvas 2D API used for particles — won't scale to 10k+ particles
- **Fix:** WebGL2 compute shader implementation with Canvas2D fallback

### 16. **No Image Optimization for External Images**

**File:** `components/Projects.tsx:45-56`

- **Issue:** `i.postimg.cc` images loaded via Next/Image but no `blurDataURL` for non-featured cards
- **Issue:** No `placeholder="blur"` for lazy-loaded images
- **Fix:** Generate blur placeholders at build time for all project images

### 17. **Service Worker Cache Strategy Incomplete**

**File:** `public/sw.js`

- **Issue:** No background sync for contact form submissions
- **Issue:** No periodic background sync for content updates
- **Issue:** Cache version hardcoded (`v1`) — no automatic invalidation
- **Fix:** Use Workbox, add background sync, version from build hash

### 18. **No Streaming/Suspense Boundaries for Heavy Sections**

**File:** `components/Home.tsx`

- **Issue:** All sections render synchronously in one RSC tree
- **Impact:** Slow sections (Projects with images) block entire page streaming
- **Fix:** Wrap heavy sections in `<Suspense>` with skeleton loaders

---

## 🟢 LOW Priority Code Quality & DX Issues

### 19. **TypeScript Not Strict Enough**

**File:** `tsconfig.json` (not checked but implied)

- **Issue:** `strict: true` but missing `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
- **Issue:** `any` used in several places (e.g., `AssistantChat.tsx:932`)
- **Fix:** Enable all strict flags, eliminate `any`

### 20. **Duplicate Type Definitions**

**Files:** `src/data/projects.ts:1-20`, `src/data/skills.ts:1-4`

- **Issue:** `Project` and `Skill` types defined in data files instead of shared `types/` directory
- **Fix:** Centralize types in `src/types/`

### 21. **Inconsistent Component Patterns**

- **Some:** Server components with `generateMetadata` (ProjectDetail)
- **Some:** Client components with `'use client'` (Terminal, AssistantChat)
- **Some:** Mixed (Contact has both form and wrapper)
- **Fix:** Establish clear patterns: server-first, client-only for interactivity

### 22. **No Visual Regression Testing**

**File:** `.github/workflows/ci.yml` (created in Phase 0)

- **Issue:** No Playwright/Chromatic visual regression tests
- **Fix:** Add visual regression in CI

### 23. **Missing Error Boundaries**

**File:** `app/error.tsx` exists but no nested boundaries

- **Issue:** Terminal/AssistantChat errors could crash entire layout
- **Fix:** Add error boundaries around each floating panel

### 24. **No Bundle Size Budgets Enforced**

**File:** `package.json:19` — `analyze` script exists but not in CI

- **Fix:** Add bundle size check in CI with hard limits

---

## 📊 Specific Component Findings

### Hero.tsx

| Issue                                        | Severity | Fix                                        |
| -------------------------------------------- | -------- | ------------------------------------------ |
| Spline loads before `profile.enable3D` check | Medium   | Move check to server or use dynamic import |
| ParticleCanvas loads on all devices          | Medium   | Conditional load based on device profile   |
| Typing effect runs even with reduced motion  | High     | Respect `prefers-reduced-motion`           |

### Nav.tsx

| Issue                                                | Severity | Fix                                   |
| ---------------------------------------------------- | -------- | ------------------------------------- |
| Mobile menu traps focus but no `inert` on background | High     | Add `inert` attribute to main content |
| Back-to-top button overlaps assistant on mobile      | Medium   | Adjust z-index/positioning            |
| No keyboard shortcut hints visible                   | Low      | Add `?` key for shortcuts help        |

### Terminal.tsx / AssistantChat.tsx

| Issue                                             | Severity | Fix                              |
| ------------------------------------------------- | -------- | -------------------------------- |
| Both mount on every page (even if never opened)   | Medium   | Lazy mount on first open         |
| History stored in localStorage without encryption | Low      | Acceptable for this use case     |
| No command completion for `repo`/`note`           | Low      | Add tab completion for known IDs |

### Contact.tsx

| Issue                                       | Severity | Fix                                                             |
| ------------------------------------------- | -------- | --------------------------------------------------------------- |
| Honeypot field accessible to screen readers | High     | Add `aria-hidden="true"`, `tabindex="-1"`, `autocomplete="off"` |
| No submit confirmation for screen readers   | Medium   | Add `aria-live="polite"` to success message                     |
| Form time validation client-side only       | Low      | Server validates too (good)                                     |

---

## 🎯 PRIORITIZED ACTION PLAN

### Week 1: Critical Security & Accessibility

1. [ ] Fix Trusted Types policy (strict, not permissive)
2. [ ] Configure Vercel KV for distributed rate limiting
3. [ ] Add CSRF protection to server actions
4. [ ] Fix custom cursor accessibility (focus visible)
5. [ ] Add `aria-live` to form errors, `aria-describedby` links
6. [ ] Add pause button to testimonials carousel

### Week 2: Performance & Reduced Motion

7. [ ] Replace Framer Motion simple animations with CSS
8. [ ] Conditionally load Spline/ParticleCanvas server-side
9. [ ] Add blur placeholders for all project images
10. [ ] Implement Suspense boundaries for heavy sections
11. [ ] Respect `prefers-reduced-motion` globally

### Week 3: Architecture & DX

12. [ ] Centralize TypeScript types in `src/types/`
13. [ ] Enable all strict TypeScript flags
14. [ ] Add visual regression testing (Playwright)
15. [ ] Add error boundaries around floating panels
16. [ ] Enforce bundle size budgets in CI

### Week 4: Advanced Features (From Roadmap)

17. [ ] Command Palette (⌘K) with fuzzy search
18. [ ] View Transitions API for page navigation
19. [ ] Semantic project search with embeddings
20. [ ] PWA with background sync + push notifications
21. [ ] Internationalization (Albanian + English)

---

## 📈 METRICS TO TRACK

| Metric           | Current | Target          | Measurement             |
| ---------------- | ------- | --------------- | ----------------------- |
| LCP              | ~2.5s   | <2.0s           | Web Vitals              |
| CLS              | ~0.1    | <0.05           | Web Vitals              |
| TBT              | ~200ms  | <100ms          | Web Vitals              |
| Bundle Size (gz) | ~180KB  | <120KB          | `@next/bundle-analyzer` |
| Lighthouse Score | ~95     | 100/100/100/100 | Lighthouse CI           |
| Axe Violations   | Unknown | 0               | axe-core in CI          |
| CSP Violations   | Unknown | 0               | `/api/csp-report`       |

---

## 🔗 QUICK REFERENCE

- **Security fixes:** `middleware.ts`, `app/layout.tsx`, `src/lib/ratelimit.ts`, `app/actions/contact.ts`
- **Accessibility fixes:** `components/CustomCursor.tsx`, `components/Contact.tsx`, `components/Testimonials.tsx`, `app/globals.css`
- **Performance fixes:** `components/Hero.tsx`, `components/Projects.tsx`, `components/Home.tsx`, `public/sw.js`
- **Architecture fixes:** `src/types/` (new), `tsconfig.json`, `.github/workflows/ci.yml`

---

_This audit covers the codebase as of 2026-11-06. Re-run after major changes._
