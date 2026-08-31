# Elios Mernica — Portfolio

A high-performance, content-first portfolio for a software engineer specializing in AI systems, full-stack web platforms, and network infrastructure. Built on **Next.js 15 (App Router) + TypeScript + Tailwind CSS + framer-motion**.

The portfolio includes several signature features designed to make the work stand out:

- **Live interactive terminal** — open with `` ` ``, run commands like `projects`, `theme dark`, `matrix`.
- **Scripted AI assistant** ("Elios AI") — a knowledge-base-driven chat panel that knows everything on the site. **Auto-synced**: edit any file in `src/data/` and the assistant knows about it.
- **Custom WebGL2 particle field** layered over Spline 3D in the hero.
- **Project case-study deep-dive pages** with per-project metrics, architecture rationale, and dynamic Open Graph images.
- **Writing / Notes** section.
- **GitHub activity widget** (ISR, with curated fallback).
- **Stack Map** categorized skill tree.
- **Dark / light theme** with SSR-aware cookie, no FOUC.

---

## Tech stack

- **Next.js 15** (App Router) — file-based routing, RSC, server actions, `<Image>`, `next/og`, edge runtime.
- **React 19** + **TypeScript** (strict mode).
- **Tailwind CSS 3** — utility-first styling, with a complete custom design-token system in `app/globals.css`.
- **framer-motion** — animations.
- **lucide-react** — icons.
- **@splinetool/react-spline** — 3D hero fallback.
- **zod** + **nodemailer** (server-only) — contact form validation and delivery.
- **WebGL2** — custom particle field, no three.js.
- **Web Audio API** — procedural sound design.
- **Web Speech API** — assistant voice input (best-effort, degrades gracefully).

Zero new runtime services required. The portfolio is self-contained.

---

## Project structure

```
.
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout, theme init, JSON-LD
│   ├── page.tsx                      # Home
│   ├── globals.css                   # Design system (CSS variables, components)
│   ├── loading.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   ├── offline/page.tsx
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── icon.tsx                      # Favicon (next/og, edge)
│   ├── og-image.tsx                  # Root OG (next/og, edge)
│   ├── manifest.ts
│   ├── actions/contact.ts            # Server Action with zod + rate limit + honeypot
│   ├── project/[id]/                 # Case study
│   │   ├── page.tsx
│   │   ├── opengraph-image.tsx       # Per-project dynamic OG (edge)
│   │   └── not-found.tsx
│   └── notes/                        # Writing section
│       ├── page.tsx
│       └── [slug]/
│           ├── page.tsx
│           └── not-found.tsx
├── components/                       # React components
│   ├── ui/                           # Primitives: Brand, AdvancedButton, PremiumCard, SectionHeader, Chip, SEO
│   ├── assistant/                    # AssistantChat sub-components
│   ├── case-study/                   # Overview, Architecture, Gallery
│   ├── particle/                     # WebGL shaders
│   ├── terminal/                     # Terminal sub-components
│   ├── notes/                        # Note renderer
│   ├── Home.tsx, Hero.tsx, About.tsx, Nav.tsx, Footer.tsx, Contact.tsx,
│   ├── AmbientBackground.tsx, CustomCursor.tsx, ParticleField.tsx,
│   ├── RevealSection.tsx, AnimatedCounter.tsx, MagneticButton.tsx, TiltCard.tsx,
│   ├── AssistantChat.tsx, Terminal.tsx, NowWidget.tsx, StackMap.tsx,
│   ├── GitHubActivity.tsx, ThemeToggle.tsx, ThemeContext.tsx, SoundToggle.tsx
├── src/
│   ├── data/                         # Single source of truth for content
│   │   ├── site.ts                   # Site-wide config
│   │   ├── projects.ts               # 8 projects (with highlights, metrics, rationale)
│   │   ├── services.ts
│   │   ├── education.ts
│   │   ├── experience.ts
│   │   ├── socials.ts
│   │   ├── testimonials.ts
│   │   ├── skills.ts                 # Categorized skill tree
│   │   ├── now.ts                    # "Now" widget content
│   │   ├── notes.ts                  # 3 starter posts (typed block bodies)
│   │   ├── featuredRepos.ts          # GitHub widget fallback
│   │   ├── caseStudies.ts
│   │   ├── knowledge.static.ts       # Hand-written assistant entries
│   │   └── knowledge.generated.ts    # Auto-generated; gitignored
│   ├── hooks/                        # React hooks
│   └── lib/                          # Utilities (cn, format, ratelimit, sound, blurDataURL, matchKnowledge, buildKnowledge)
├── scripts/
│   └── build-knowledge.mjs           # Generates knowledge.generated.ts from src/data/*
├── public/
│   ├── sw.js                         # Hand-rolled service worker
│   ├── manifest.webmanifest
│   └── Elios-Mernica-CV.pdf          # The resume PDF
├── middleware.ts                     # CSP nonce, theme cookie, UA blocklist
├── next.config.mjs                   # CSP headers, image domains, bundle analyzer
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Data flow — the single source of truth

Every piece of content lives in `src/data/*.ts`. The rest of the site consumes that data:

```
src/data/projects.ts ──┬──> components/Projects.tsx (UI)
                       ├──> app/project/[id]/page.tsx (case study)
                       ├──> app/project/[id]/opengraph-image.tsx (per-project OG)
                       ├──> app/sitemap.ts (URLs)
                       ├──> scripts/build-knowledge.mjs ──> src/data/knowledge.generated.ts ──> components/AssistantChat.tsx (assistant)
                       └──> components/Terminal.tsx (`projects` command)
```

**Editing content is a one-file change**: edit `src/data/projects.ts`, run `npm run dev`, and the home page, case study, OG image, sitemap, and assistant all reflect the update. The `predev` and `prebuild` scripts regenerate `src/data/knowledge.generated.ts` automatically.

---

## Setup

```bash
# Node 20+ recommended
git clone https://github.com/eliosmernica15/MY-PORTFOLIO.git
cd MY-PORTFOLIO
npm install

# Optional: configure environment for the contact form
cp .env.example .env.local
# Edit .env.local with SMTP_* or EmailJS keys

npm run dev
```

Open http://localhost:3000.

### Scripts

| Command                 | Description                                              |
|-------------------------|----------------------------------------------------------|
| `npm run dev`           | Dev server (regenerates knowledge base, hot-reload)      |
| `npm run build`         | Production build                                         |
| `npm run start`         | Run the production build                                 |
| `npm run typecheck`     | TypeScript strict check                                  |
| `npm run lint`          | ESLint                                                   |
| `npm run analyze`       | Bundle analyzer                                          |
| `npm run sync:kb`       | Regenerate the assistant knowledge base                  |

---

## Editing content

**Add a project**: edit `src/data/projects.ts`, append a new object to the array, save. The home page grid, case-study page, OG image, sitemap, and assistant all update.

**Add a note**: edit `src/data/notes.ts`, append a new `Note` object, save. The notes index, note page, and assistant all update.

**Update "Now" widget**: edit `src/data/now.ts`, change the `line` field, save.

**Add assistant knowledge (without code generation)**: edit `src/data/knowledge.static.ts` and append a `KnowledgeEntry`. Useful for entries that don't correspond to data files (greetings, easter eggs, fallback copy).

**Update contact info**: edit `src/data/site.ts` (email, phone, location).

---

## Terminal commands

Press `` ` `` (backtick) or click the floating terminal button. Commands:

```
help              List all commands
about             Short bio
projects          List all projects
skills            List skill categories
services          List services offered
contact           Open the contact form
cv                Download the CV
theme dark|light  Toggle theme
whoami            elios@worldwide
clear             Clear the buffer
history           Show recent commands
matrix            "There is no spoon."
coffee            Espresso + well-named variables
github            GitHub profile
repo <id>         Open a project (e.g. repo esmp)
note <slug>       Open a note (e.g. note designing-a-60fps-particle-field)
```

Up/Down: navigate history. Tab: complete commands. Esc: close.

---

## Assistant

Press `Cmd/Ctrl+K` or click the floating "Ask Elios AI" button. The assistant is a scripted knowledge-base matcher:

- It knows everything in `src/data/` (auto-generated, no manual sync).
- Quick-prompt chips for common questions.
- Free-text chat with intent matching and a synonym map.
- Card responses (project cards, skill lists) for richer answers.
- Action responses (theme change, scroll-to, open-link) that drive the UI.
- Voice input (where Web Speech API is supported).
- Conversation history persisted in `localStorage`.
- Dev-only debug panel shows which entries fired and their scores.

**Honest copy**: the assistant is a scripted knowledge base, not an LLM. Replies are generated from portfolio data only. No data leaves the browser.

---

## Security

- **Strict CSP** via `next.config.mjs` headers and per-request nonce via `middleware.ts`.
- **HSTS**, **X-Frame-Options: DENY**, **X-Content-Type-Options: nosniff**, **Referrer-Policy: strict-origin-when-cross-origin**, **Permissions-Policy** (camera/mic/geolocation disabled).
- **Honeypot** + **behavioral heuristic** + **rate limit** (1 / 30s, 5 / hour per IP) on the contact Server Action.
- **Server-side delivery**: EmailJS is called from the Server Action, not the client — the public key never reaches the browser when SMTP is the primary path.
- **UA blocklist** in middleware for known referrer-spam crawlers.
- **Zod validation** on every form input.

---

## Performance

- **RSC by default**: only interactive components ship JS. Static sections are zero-JS.
- **`<Image>` everywhere** with AVIF/WebP, responsive `srcset`, blur placeholders, `priority` on LCP.
- **Code splitting**: Next 15 automatically splits `app/` routes. The Spline scene and the framer-motion library are isolated into separate chunks.
- **Font self-hosting** via `next/font` — no third-party requests, no FOUT.
- **Hand-rolled service worker**: cache-first for hashed assets, stale-while-revalidate for HTML, offline fallback.
- **Particle field** gated by `useDeviceProfile` and `prefers-reduced-motion`; pauses when the hero is out of view or the tab is hidden.
- **Bundle analyzer** via `npm run analyze` to keep the budget honest.

---

## Accessibility

- Skip link, focus-visible, focus trap in modal panels.
- `role="progressbar"` + `aria-valuenow` on the scroll progress bar.
- `aria-live="polite"` on the typing hero.
- `prefers-reduced-motion` short-circuits every animation.
- Semantic HTML throughout: `<ol>` for timelines, `<nav>` for navigation, `<header>` for sections, `<article>` for notes.
- Keyboard shortcuts: `` ` `` (terminal), `Cmd/Ctrl+K` (assistant), `Esc` (close any panel).

---

## Deploy

The project is set up for [Vercel](https://vercel.com). Push to `main` to trigger a deploy. Set the env vars from `.env.example` in the Vercel project settings.

For other platforms: `npm run build` produces a Next.js app in `.next/`. Use `npm run start` to serve it.

---

## License

Private. All rights reserved.
