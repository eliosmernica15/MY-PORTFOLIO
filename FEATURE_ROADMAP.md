# FEATURE_ROADMAP.md — Elios Mernica Portfolio

> **Vision:** Transform this portfolio into a **world-class, enterprise-grade interactive experience** that showcases not just projects, but engineering excellence, security-first thinking, and cutting-edge UX. Every feature should feel intentional, performant, and delightful.

---

## 📋 Roadmap Structure

| Phase | Timeline | Focus |
|-------|----------|-------|
| **Phase 0** | Immediate | Security hardening, critical bugs, foundation |
| **Phase 1** | Weeks 1–4 | Core UX polish, advanced interactions, performance |
| **Phase 2** | Weeks 5–10 | AI/ML features, content platform, analytics |
| **Phase 3** | Weeks 11–20 | Internationalization, PWA, advanced tooling |
| **Phase 4** | Ongoing | Experimental, community, platform features |

---

## 🔒 PHASE 0: SECURITY FOUNDATION (Critical — Do First)

### 0.1 Content Security Policy Hardening
- [ ] **CSP Report-Only Mode** — Deploy `Content-Security-Policy-Report-Only` header with `/api/csp-report` endpoint to collect violations without blocking
- [ ] **Nonce Rotation** — Rotate CSP nonces per-request (already implemented) + add `script-src-elem` / `script-src-attr` for granular control
- [ ] **Trusted Types** — Enable `trusted-types` directive + `require-trusted-types-for 'script'` to prevent DOM XSS sinks
- [ ] **CSP Hash Inventory** — Automated script to extract all inline scripts/styles, generate hashes, and update middleware on every build
- [ ] **Report-URI Integration** — Send CSP violations to external monitoring (Sentry, Datadog, or self-hosted)

### 0.2 Rate Limiting & Abuse Prevention
- [ ] **Distributed Rate Limiter** — Replace in-memory `rateLimit` with Redis-backed (Upstash/Vercel KV) for multi-instance deployments
- [ ] **IP Reputation** — Integrate AbuseIPDB / Cloudflare Bot Management for known bad actors
- [ ] **CAPTCHA Challenge** — hCaptcha / Turnstile on contact form after 2 failed submissions
- [ ] **Request Validation** — Zod schemas for ALL server actions (already good) + JSON body size limits (`next.config.js` `api.bodyParser.sizeLimit`)
- [ ] **CSRF Protection** — Double-submit cookie pattern for mutation endpoints (Next.js 15 has built-in but verify)

### 0.3 Headers & Transport Security
- [ ] **HSTS Preload** — Submit to `hstspreload.org` after verifying all subdomains
- [ ] **Permissions Policy** — Restrict `camera=(), microphone=(), geolocation=(), payment=()` via `Permissions-Policy` header
- [ ] **Cross-Origin Policies** — `Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Resource-Policy: same-origin`, `Cross-Origin-Embedder-Policy: require-corp`
- [ ] **Expect-CT** — Certificate Transparency enforcement header
- [ ] **Referrer Policy** — `strict-origin-when-cross-origin` (already default in Next.js, verify)

### 0.4 Dependency & Supply Chain Security
- [ ] **SBOM Generation** — `@cyclonedx/bom` or `syft` in CI to generate Software Bill of Materials
- [ ] **Dependency Scanning** — `npm audit` + `osv-scanner` + `snyk test` in CI pipeline
- [ ] **Lockfile Integrity** — `npm audit signatures` verification in CI
- [ ] **Renovate/Dependabot** — Automated PRs with auto-merge for patch/minor, manual for major
- [ ] **Allowed Licenses** — `license-checker` to block GPL/AGPL/viral licenses in production deps

### 0.5 Secrets & Environment Hygiene
- [ ] **Secret Scanning** — `trufflehog` / `gitleaks` in pre-commit + CI
- [ ] **Env Validation** — Zod schema for `process.env` at build time (fail fast if missing)
- [ ] **Vercel Env Sync** — CLI script to sync `.env.example` → Vercel project env vars
- [ ] **Rotation Schedule** — Documented 90-day rotation for SMTP, EmailJS, API keys

---

## 🎨 PHASE 1: ADVANCED UI/UX & INTERACTIONS (Weeks 1–4)

### 1.1 Motion & Animation System
- [ ] **Motion Tokens** — Extract all Framer Motion variants into a design token system (`motion.tokens.ts`) with semantic names: `entrance`, `exit`, `hover`, `tap`, `focus`, `drag`, `scroll`
- [ ] **Reduced Motion First** — Every animation respects `prefers-reduced-motion` by default; provide "enhanced motion" opt-in toggle in settings panel
- [ ] **Scroll-Driven Animations** — Native CSS `animation-timeline: scroll()` + `view()` for hero parallax, reveal sections, progress indicators (zero JS)
- [ ] **View Transitions API** — SPA-like page transitions between routes (`@view-transitions` for Next.js) with custom morphing for project cards → detail pages
- [ ] **Staggered Entrance System** — Declarative `<Stagger>` component using `IntersectionObserver` + CSS `animation-delay` variables (no Framer Motion overhead)

### 1.2 Advanced Interaction Patterns
- [ ] **Magnetic Cursor v2** — WebGL-based cursor trail (Three.js / OGL) with pressure-sensitive brush strokes on hover targets
- [ ] **Command Palette (⌘K)** — Global fuzzy-search (projects, skills, notes, commands, settings) with `cmdk` + keyboard shortcuts for power users
- [ ] **Spatial Navigation** — 3D "room" metaphor: sections as rooms, smooth camera transitions between them (react-three-fiber + gsap)
- [ ] **Gesture Support** — Swipe navigation on mobile (left/right for sections, up/down for panels) using `react-use-gesture`
- [ ] **Haptic Feedback** — `navigator.vibrate()` on mobile for button taps, terminal keystrokes, assistant messages

### 1.3 Visual Polish & Delight
- [ ] **Dynamic Theming** — User-selectable accent colors (8 curated palettes) with CSS custom property injection + localStorage persistence
- [ ] **Adaptive Color Schemes** — Auto-switch theme based on time of day / sunrise-sunset API + manual override
- [ ] **Glass Morphism v2** — Layered glass with `backdrop-filter: blur()` + noise texture + subtle border highlights (CSS-only)
- [ ] **Particle System Rewrite** — GPU compute shaders (WebGL2) for 10k+ particles at 60fps; fallback to Canvas2D
- [ ] **Spline Scene Choreography** — Scene reacts to scroll, cursor, theme, time of day; load different `.spline` files per section

### 1.4 Component Library & Design System
- [ ] **Storybook** — Document all UI components with controls, a11y addon, visual regression (Chromatic)
- [ ] **Component Variants** — `cva` (class-variance-authority) for all buttons, cards, inputs, badges
- [ ] **Design Token Figma Sync** — `figma-tokens` pipeline: Figma → `tokens.json` → TypeScript + CSS custom properties
- [ ] **Icon System** — Custom SVG icon set (Lucide subset + custom) with `<Icon name="..." />` component + tree-shaking

### 1.5 Terminal & Assistant Upgrades
- [ ] **Terminal: Tabs & Splits** — Multiple sessions, horizontal/vertical splits, session persistence (IndexedDB)
- [ ] **Terminal: AI Copilot** — `⌘⏎` to send current buffer to Assistant for explanation/debugging
- [ ] **Terminal: Themes** — 10+ terminal themes (Dracula, Nord, Catppuccin, etc.) with live preview
- [ ] **Assistant: Multi-Modal** — Image upload (drag-drop) → OCR / vision model analysis (local: `transformers.js` or server: Vercel AI SDK)
- [ ] **Assistant: Code Execution** — Sandboxed JS/TS execution via `pyodide` / `webcontainer` for live demos
- [ ] **Assistant: Conversation Branching** — Fork conversations, compare answers, merge context

---

## 🚀 PHASE 2: AI/ML FEATURES & CONTENT PLATFORM (Weeks 5–10)

### 2.1 AI-Powered Portfolio Features
- [ ] **Semantic Project Search** — Vector embeddings (OpenAI `text-embedding-3-small` or local `all-MiniLM-L6-v2` via `transformers.js`) for "show me projects with real-time data"
- [ ] **Auto-Generated Case Studies** — Feed project metadata + repo → LLM generates detailed case study (challenge, solution, metrics, code snippets)
- [ ] **Skill Gap Analysis** — Compare user's skills (from resume) → job descriptions → suggest learning path
- [ ] **Code Tour Generator** — AST-based (TypeScript `ts-morph`) automated codebase walkthroughs for open-source projects
- [ ] **Interview Simulator** — Assistant role-plays technical interviews based on project experience

### 2.2 Content Management & Publishing
- [ ] **MDX Blog/Notes** — Next.js 15 `mdx` support with frontmatter, syntax highlighting (Shiki), custom components
- [ ] **Headless CMS Option** — Sanity/Contentful integration for non-technical content updates (optional)
- [ ] **Content Versioning** — Git-based versioning for all content; `/notes/[slug]?v=abc123` for historical views
- [ ] **Auto-Syndication** — Publish to Dev.to, Hashnode, Medium via API on merge to main
- [ ] **RSS/Atom/JSON Feed** — Full-text feeds with enclosures for podcasts/videos
- [ ] **Newsletter Integration** — Buttondown/ConvertKit embed + custom signup flow with double opt-in

### 2.3 Analytics & Observability (Privacy-First)
- [ ] **Plausible / Umami / PostHog** — Self-hosted or cloud; no cookies, GDPR/CCPA compliant
- [ ] **Custom Events** — Track: `project_view`, `terminal_command`, `assistant_query`, `contact_submit`, `theme_change`, `cv_download`
- [ ] **Heatmaps** — Click/scroll heatmaps (PostHog) for UX optimization
- [ ] **Session Replay** — Opt-in replay for debugging user-reported issues
- [ ] **Performance Budgets** — CI gate: LCP < 2.5s, CLS < 0.1, TBT < 200ms, bundle size < 150KB gzipped
- [ ] **Real User Monitoring (RUM)** — Web Vitals + custom metrics to analytics endpoint

### 2.4 Advanced Project Showcase
- [ ] **Live Demo Embeds** — `<iframe>` sandbox + `postMessage` API for interactive project demos within case study
- [ ] **Architecture Diagrams** — Mermaid.js / Excalidraw embeds rendered server-side to SVG
- [ ] **Code Snippets with Run Button** — WebContainer-powered runnable snippets in case studies
- [ ] **Project Comparison Matrix** — Side-by-side comparison of similar projects (tech, metrics, outcomes)
- [ ] **Contributor Graph** — GitHub API: visualize contributors, commit frequency, language breakdown per project

---

## 🌍 PHASE 3: INTERNATIONALIZATION, PWA & PLATFORM (Weeks 11–20)

### 3.1 Internationalization (i18n)
- [ ] **Next.js 15 i18n** — `[lang]` segment routing (`/en/`, `/sq/`, `/de/`) with `next-intl` or built-in
- [ ] **Locale Detection** — `Accept-Language` header + geo-IP + user preference (cookie/localStorage)
- [ ] **Translation Management** — `lingui` or `next-intl` with JSON message catalogs; CI check for missing keys
- [ ] **RTL Support** — Full RTL layout for Arabic/Hebrew (CSS logical properties, `dir="auto"`)
- [ ] **Date/Number/Currency Formatting** — `Intl` API throughout; no hardcoded formats
- [ ] **Localized Assets** — Per-locale images, OG images, CVs (already have Albanian CV!)

### 3.2 Progressive Web App (PWA)
- [ ] **Service Worker v2** — Workbox + `next-pwa` with:
  - [ ] **Precache** — All static assets, routes, fonts
  - [ ] **Runtime Caching** — Stale-while-revalidate for API, images; network-first for HTML
  - [ ] **Offline Fallback** — Custom `/offline` page with cached content index
  - [ ] **Background Sync** — Queue contact form submissions when offline
  - [ ] **Push Notifications** — Web Push API (VAPID) for "new project published" alerts
- [ ] **App Manifest** — `display: standalone`, `shortcuts` for quick actions (Contact, Terminal, CV)
- [ ] **Install Prompt** — Custom "Add to Home Screen" banner with feature highlights
- [ ] **File Handling** — Register as handler for `.apl` files (Albanian programming language)
- [ ] **Protocol Handling** — `web+elios:` protocol for deep links from email/terminal

### 3.3 Developer Experience & Tooling
- [ ] **Monorepo Migration** — Turborepo/Nx: `apps/portfolio`, `packages/ui`, `packages/config`, `packages/knowledge`
- [ ] **Component Playground** — Interactive prop controls + code preview (like Storybook but embedded in `/lab`)
- [ ] **Visual Regression** — Playwright + Pixelmatch in CI; baseline images in repo
- [ ] **E2E Testing** — Playwright: critical paths (contact, terminal, assistant, project navigation)
- [ ] **Contract Testing** — Pact for server action APIs
- [ ] **Performance CI** — Lighthouse CI budgets + `web-vitals` tracking per PR
- [ ] **Bundle Analyzer** — `@next/bundle-analyzer` + `webpack-bundle-analyzer` in CI artifact

### 3.4 Platform & Extensibility
- [ ] **Plugin System** — Dynamic `import()` for features (terminal, assistant, 3D) — load on demand
- [ ] **Web Components Export** — Wrap Terminal/Assistant as custom elements for embedding elsewhere
- [ ] **API Layer** — Public REST/GraphQL API (`/api/v1/`) for projects, skills, blog (rate-limited, cached)
- [ ] **Webhook System** — Subscribe to events: `project.published`, `contact.received`, `cv.downloaded`
- [ ] **OAuth App** — "Login with Elios Portfolio" for demo apps (shows off auth integration)

---

## 🧪 PHASE 4: EXPERIMENTAL & COMMUNITY (Ongoing)

### 4.1 Cutting-Edge Web APIs
- [ ] **WebGPU Compute** — Particle simulation, ML inference on GPU (fallback to WebGL)
- [ ] **WebAssembly** — Compile performance-critical logic (parser, crypto) to WASM (Rust → `wasm-bindgen`)
- [ ] **File System Access API** — Drag-drop folders to terminal for local file ops
- [ ] **Web Serial / USB / Bluetooth** — Hardware project demos (Arduino, ESP32)
- [ ] **Eye Tracking** — WebGazer.js for gaze-controlled navigation (accessibility + demo)

### 4.2 Community & Social
- [ ] **Guestbook / Comments** — GitHub Discussions / Giscus embedded on project pages
- [ ] **Live Collaboration** — Yjs / PartyKit for real-time cursor sharing (pair programming demo)
- [ ] **Mentorship Matching** — Profile → match with learners (Calendly integration)
- [ ] **Open Source Badges** — Dynamic shields.io badges for each project (stars, forks, issues, license)
- [ ] **Contribution Graph** — GitHub-style heatmap of all coding activity (public + private via PAT)

### 4.3 Research & Publications
- [ ] **Paper/Article Renderer** — LaTeX → HTML (KaTeX) for academic publications
- [ ] **Citation Export** — BibTeX / RIS / APA / MLA for each project/publication
- [ ] **DOI Registration** — Zenodo integration for permanent citations

---

## 📦 TECHNICAL DEBT & INFRASTRUCTURE (Continuous)

### Code Quality
- [ ] **Strict TypeScript** — `strict: true`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
- [ ] **ESLint + Prettier** — Airbnb/Next.js config + custom rules (no `any`, no `console.log` in prod)
- [ ] **Knip** — Dead code/unused dependency detection in CI
- [ ] **TSC Alias** — Path aliases (`@/*`) resolved in build
- [ ] **Barrel File Audit** — Eliminate circular deps, optimize imports

### Build & Deploy
- [ ] **Vercel Edge Middleware** — Move CSP, rate limiting, geo-routing to Edge
- [ ] **ISR / On-Demand Revalidation** — `revalidateTag` for content updates without rebuild
- [ ] **Preview Deployments** — Every PR gets unique preview URL + Lighthouse diff comment
- [ ] **Rollback Automation** — One-click rollback via Vercel CLI / GitHub Actions
- [ ] **Blue-Green Deploy** — Zero-downtime with health checks

### Monitoring & Operations
- [ ] **Sentry** — Error tracking + performance monitoring (client + server)
- [ ] **Uptime Monitoring** — Better Uptime / UptimeRobot + status page
- [ ] **Log Aggregation** — Vercel Logs → Datadog / Axiom / Loki
- [ ] **Alerting** — PagerDuty / Opsgenie for: build failures, error spikes, latency p99 > 2s

---

## 🎯 PRIORITIZATION MATRIX

| Feature | Impact | Effort | Phase | Rationale |
|---------|--------|--------|-------|-----------|
| CSP Report-Only + Trusted Types | 🔴 Critical | Low | 0 | Security baseline |
| Redis Rate Limiter | 🔴 Critical | Medium | 0 | Production hardening |
| View Transitions API | 🟢 High | Medium | 1 | "Wow" factor, modern UX |
| Command Palette (⌘K) | 🟢 High | Medium | 1 | Power user delight |
| Semantic Search (Embeddings) | 🟢 High | High | 2 | Differentiator |
| MDX Blog/Notes | 🟢 High | Medium | 2 | Content platform |
| PWA + Push Notifications | 🟡 Medium | High | 3 | Engagement |
| i18n (Albanian + more) | 🟡 Medium | High | 3 | Personal brand |
| WebGPU/WASM Experiments | 🔵 Low | Very High | 4 | Innovation showcase |

---

## 📊 SUCCESS METRICS

| Metric | Target | Measurement |
|--------|--------|-------------|
| **LCP** | < 2.0s | Web Vitals (75th percentile) |
| **CLS** | < 0.05 | Web Vitals |
| **TBT** | < 100ms | Web Vitals |
| **Security Headers** | A+ | securityheaders.com / observatory.mozilla.org |
| **Lighthouse** | 100/100/100/100 | Perf/A11y/Best Practices/SEO |
| **Bundle Size (gz)** | < 120KB | `@next/bundle-analyzer` |
| **Time to Interactive** | < 3.0s | Web Vitals |
| **Contact Form Conversion** | > 5% | Analytics events |
| **Assistant Engagement** | > 3 queries/session | Custom events |
| **Return Visitor Rate** | > 30% | Analytics |
| **PWA Install Rate** | > 2% | `beforeinstallprompt` |

---

## 🛠 IMPLEMENTATION APPROACH

### Branch Strategy
```
main ← protected, auto-deploy to production
├── develop ← integration branch, auto-deploy to staging
├── feature/* ← individual features
├── security/* ← security patches (fast-track)
└── experiment/* → spike branches (no CI gate)
```

### Definition of Done (per feature)
- [ ] TypeScript strict mode passes
- [ ] ESLint + Prettier clean
- [ ] Unit tests (≥ 80% coverage for new code)
- [ ] E2E test for critical path
- [ ] Visual regression baseline updated
- [ ] Lighthouse CI passes budgets
- [ ] Bundle size impact documented
- [ ] Accessibility audit (axe-core)
- [ ] Documentation updated (README, Storybook, CHANGELOG)
- [ ] Deployed to preview + manual QA

### Weekly Cadence
- **Monday**: Sprint planning + security review
- **Wednesday**: Mid-week sync + unblock
- **Friday**: Demo + retrospective + metrics review

---

## 📝 CHANGELOG TEMPLATE

```markdown
## [Unreleased]
### 🔒 Security
- CSP Trusted Types enforcement
- Redis-backed rate limiting

### ✨ Features
- View Transitions API for page navigation
- Command Palette (⌘K) with fuzzy search

### 🎨 UI/UX
- Dynamic accent color themes
- Scroll-driven animations (CSS-native)

### 🤖 AI/ML
- Semantic project search via embeddings
- Assistant code execution sandbox

### 📦 Infrastructure
- Turborepo monorepo migration
- Playwright E2E suite
```

---

## 🔗 QUICK LINKS

- **Repo**: `github.com/eliosmernica15/portfolio`
- **Production**: `https://eliosmernica.vercel.app`
- **Staging**: `https://eliosmernica-git-develop.vercel.app`
- **Storybook**: `https://eliosmernica-portfolio-storybook.vercel.app`
- **Analytics**: `https://plausible.io/eliosmernica.vercel.app`
- **Sentry**: `https://sentry.io/organizations/eliosmernica/projects/portfolio`
- **Status Page**: `https://status.eliosmernica.dev`

---

## 💡 NOTES & IDEAS PARKING LOT

> *Dump ideas here; promote to roadmap when validated.*

- [ ] **3D Skill Constellation** — Three.js force-directed graph of skills, click to filter projects
- [ ] **Terminal ASCII Art Gallery** — `cat` command shows rotating ASCII art
- [ ] **Voice Portfolio** — ElevenLabs narration of case studies
- [ ] **AR Business Card** — `model-viewer` + QR code for AR contact card
- [ ] **GitHub Actions Dashboard** — Live CI status for all projects
- [ ] **Keyboard Shortcut Cheatsheet** — `?` key opens modal with all shortcuts
- [ ] **Focus Mode** — Distraction-free reading (hide nav, terminal, assistant)
- [ ] **Timezone Display** — "It's 14:32 in Vushtrri" in footer/terminal
- [ ] **CO2 Footprint** — Website Carbon API badge + optimization tips
- [ ] **Open Source Sponsors** — GitHub Sponsors / OpenCollective integration

---

*Last updated: 2026-11-05*  
*Next review: 2026-11-12 (Weekly cadence)*  
*Maintainer: Elios Mernica*