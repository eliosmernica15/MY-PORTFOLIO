# Elios Mernica — Portfolio

A high-performance, content-first portfolio for a software engineer specializing in AI systems, full-stack web platforms, compilers, and network infrastructure.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v3 · framer-motion · WebGL2 (vanilla) · Spline · zod · nodemailer (optional)

---

## What's in it

| Section | Notes |
|---|---|
| **Hero** | Custom typing carousel, WebGL particle field layered over a Spline scene, custom cursor, "Now" pill (dismissible, persisted). |
| **About** | Capability grid + a 5-stop horizontal timeline (Now → 2023) with hover/focus reveals. |
| **Services** | 4-card grid driven by `src/data/services.ts`. |
| **Projects** | 2-column grid with "Load more" pagination, link-out to a per-project case study. |
| **Stack Map** | Categorized skills with 1–5 confidence dots. |
| **Skill marquee** | Infinite horizontal scroller. |
| **Notes (writing)** | Markdown-lite posts at `/notes` and `/notes/[slug]`, rendered from typed block arrays. |
| **GitHub activity** | Server component with ISR (1h), curated fallback from `featuredRepos`. |
| **Resume** | Education + experience + CV download. |
| **Testimonials** | Auto-rotating carousel with `aria-live`. |
| **Contact** | Server action, zod-validated, honeypot + behavioral heuristic + per-IP rate limit. |
| **Terminal** | Floating, draggable, focus-trapped, persisted history, 18+ commands. |
| **Elios AI** | Floating, scripted assistant — quick prompts, free chat, voice input, copy-transcript. Knowledge base auto-synced from the data layer. |
| **Service worker** | Cache-first for `_next/static` and images, stale-while-revalidate for HTML, offline fallback at `/offline`. |

---

## Architecture

```
app/                      Next.js App Router
  layout.tsx              Root layout · theme-init script · JSON-LD Person + WebSite · <SwRegister/>
  page.tsx                /               · composes <Home /> + BreadcrumbList JSON-LD
  project/[id]/page.tsx   /project/<id>   · generateStaticParams, generateMetadata, BreadcrumbList
  notes/...               Notes index + slug pages
  actions/contact.ts      Server action (zod + rate limit + honeypot)
  sw-register.tsx         Client-only SW registration
  loading.tsx / error.tsx Branded <Brand> on the fallback screens
  sitemap.ts / robots.ts  Auto-generated
  icon.tsx / og-image.tsx Build-time ImageResponse
  middleware.ts           Per-request CSP nonce, theme forwarding, UA blocklist

src/
  data/                   Typed source of truth — projects, services, notes, testimonials, knowledge…
  hooks/                  useLocalStorage, useDeviceProfile, useFocusTrap, useTypewriter, …
  lib/                    matchKnowledge, buildKnowledge, ratelimit, blurDataURL, format, sound, breadcrumbs

components/
  Home.tsx                Composes the home page
  Terminal.tsx            Floating interactive terminal
  AssistantChat.tsx       Elios AI panel
  ParticleField.tsx       WebGL2 particle field (1500–3000 particles)
  SplineScene.tsx         Ambient Spline base layer
  AboutTimeline.tsx       5-stop dot timeline
  Brand.tsx (in ui/)      Custom SVG monogram (E + M with accent dot)
  case-study/             Overview / Architecture / Gallery
  notes/Renderer.tsx      Block-based note renderer
  ui/                     AdvancedButton, PremiumCard, SectionHeader, Chip, SEO

public/
  sw.js                   Hand-rolled service worker
  Elios-Mernica-CV.pdf    Static CV
  *.png                   Per-project hero art

scripts/
  build-knowledge.mjs     Generates src/data/knowledge.generated.ts at predev/prebuild
middleware.ts             CSP nonce + theme forwarding + UA blocklist
```

### RSC vs client components

- Server components by default for everything that doesn't need interactivity (data files, case-study sections, layout).
- `'use client'` only where the component reads state, refs, effects, or events: `Home.tsx`, `Terminal.tsx`, `AssistantChat.tsx`, `ParticleField.tsx`, `NowWidget.tsx`, the form, the nav, the cursor, the toggle, etc.
- The contact form is a client component but calls a **server action** (`app/actions/contact.ts`) — zod validation, SMTP via nodemailer (when configured), or a server-side EmailJS fallback. The public EmailJS key is no longer exposed to the browser.

### CSP

Strict Content-Security-Policy is set per request in `middleware.ts`:
- `script-src 'self' 'nonce-<random>' 'strict-dynamic' https://prod.spline.design`
- `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com` (inline styles are used heavily for theming)
- `frame-src 'self' https://*.spline.design`, `connect-src` includes `https://api.github.com` and `https://*.spline.design`
- `worker-src 'self' blob:`, `manifest-src 'self'`
- `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`, `upgrade-insecure-requests`

The nonce is generated per request, attached to the response as a header, and consumed by the theme-init script in `<head>` (no `unsafe-inline` on scripts).

### Service worker

`public/sw.js` is a hand-rolled 76-line worker (no Workbox). It is registered by `app/sw-register.tsx` only in production. Strategies:

- **Cache-first** for `/_next/static/*`, `/_next/image*`, and image/font extensions.
- **Stale-while-revalidate** for HTML navigations (falls back to `/offline` on network failure).
- **Network-first** with cache fallback for everything else.

The offline fallback page is at `app/offline/page.tsx` with a "Retry" button.

---

## Data flow

```
Edit any of these                         Live everywhere
─────────────────────                     ──────────────
src/data/site.ts                  ───►   Title, tagline, socials
src/data/projects.ts              ───►   Home projects grid, case studies, /project/[id] page, OG image
                                          ➜ Assistant "project:<id>" knowledge entries
src/data/services.ts              ───►   Services grid
                                          ➜ Assistant "service:<id>" knowledge entries
src/data/skills.ts                ───►   Stack map + skill marquee
                                          ➜ Assistant "skill:<name>" knowledge entries
src/data/testimonials.ts          ───►   Testimonials carousel
src/data/notes.ts                 ───►   /notes index + /notes/[slug]
                                          ➜ Assistant "note:<slug>" knowledge entries
src/data/now.ts                   ───►   "Now" pill in hero
src/data/featuredRepos.ts         ───►   GitHub widget fallback (when API rate-limits)
src/data/education.ts             ───►   Resume education list
src/data/experience.ts            ───►   Resume experience list
src/data/socials.ts               ───►   Footer social row
src/data/knowledge.static.ts      ───►   Assistant static entries (about, contact, easter eggs, fallback)
```

`scripts/build-knowledge.mjs` runs at `predev` and `prebuild`. It reads every typed data file and writes `src/data/knowledge.generated.ts`. The assistant's matcher unions that with the static entries. **Edit a project, run the dev server, the assistant immediately knows about it.** No separate config to maintain.

---

## Editing content

1. Add or edit a project in `src/data/projects.ts`.
2. Save.
3. The dev server regenerates `src/data/knowledge.generated.ts` (via `predev`).
4. Refresh — the home grid, the case-study page, the sitemap, and the assistant all reflect the change.

Same for notes, services, skills, testimonials, and the "now" line.

To add a new page route, create a folder under `app/` and a `page.tsx`. To exclude a route from the sitemap, edit `app/sitemap.ts`. To customize the OG image for a project, edit `app/project/[id]/opengraph-image.tsx`.

---

## Environment variables

| Variable | Purpose | Default |
|---|---|---|
| `SMTP_HOST` | SMTP server hostname (optional) | none — contact form falls back to EmailJS server-side |
| `SMTP_PORT` | SMTP port (typically 587) | unset |
| `SMTP_USER` | SMTP username | unset |
| `SMTP_PASS` | SMTP password | unset |
| `SMTP_TO` | Destination address | `SITE.email` |
| `EMAILJS_SERVICE_ID` | EmailJS service id (fallback transport) | unset |
| `EMAILJS_TEMPLATE_ID` | EmailJS template id | unset |
| `EMAILJS_PUBLIC_KEY` | EmailJS public key | unset |
| `EMAILJS_PRIVATE_KEY` | EmailJS private key (server-only) | unset |
| `NEXT_PUBLIC_CSP_REPORT` | Optional CSP report-uri | unset |

No variables are required for the dev server to start.

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Regenerate the knowledge base, then start Next dev on port 3000 |
| `npm run build` | Regenerate the knowledge base, then `next build` (with IPv4-first DNS preload) |
| `npm run build:direct` | Same as `build` but without the IPv4-first preload (for non-Windows hosts) |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint with the flat config |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run analyze` | Bundle analyzer report (`@next/bundle-analyzer`) |
| `npm run sync:kb` | Manually regenerate the assistant's knowledge base |

### Windows-only build scripts

`scripts/ipv4-first.cjs` — loaded by the `build` script via `node --require`. It monkey-patches `dns.lookup` to prefer IPv4, because on this Windows host `fonts.googleapis.com` and `fonts.gstatic.com` resolve to both A and AAAA records and `next/font/google`'s bundled `node-fetch` follows the OS resolver order, hitting the broken IPv6 path and timing out. Drop the preload on a host where IPv6 works and the build will succeed without it.

`scripts/patch-vercel-og.cjs` — runs on `postinstall`. It rewrites three lines in `node_modules/next/dist/compiled/@vercel/og/index.node.js` from `fileURLToPath(join(import.meta.url, "../…"))` to `fileURLToPath(new URL("./…", import.meta.url))`. The original lines crash on Windows when prerendering dynamic `opengraph-image` routes with `TypeError: Invalid URL`. The fix was upstreamed in `vercel/next.js#77650` and released in Next.js 15.3.0; this patch keeps it working on 15.1.6. The patch is idempotent.

---

## Terminal commands

The floating terminal (open with `` ` ``) supports:

```
help            List commands
about           Short bio
projects        List projects with categories
skills          List skills
services        List services
now             What I'm working on right now
contact         Open the contact section
cv              Trigger CV download
theme <mode>    dark | light | toggle
whoami          Easter egg
clear           Clear the buffer
history         Show recent commands
matrix          Particle-rain easter egg
sudo <cmd>      "Permission denied."
github          Open GitHub profile
repo <name>     Search the knowledge base for a project
note <slug>     Open a note
open <url>      Open a URL
coffee          "I run on espresso and well-named variables."
```

Up/down arrow: history. `Tab`: completion. `Esc`: close.

---

## Assistant (Elios AI) commands

The floating assistant (open with `Cmd/Ctrl+K` or the bottom-right button) supports quick chips and free text. The matcher scores token overlap + synonym map + intent classifier against the live knowledge base. Intents include `greeting`, `availability`, `pricing`, `ai`, `frontend`, `backend`, `contact`, `resume`, `project:<id>`, `skill:<name>`, `location`, `process`, `timeline`, `rates`, `stack`, `rate_card`, `case_study`, `easter_egg`, `fallback`. Voice input is feature-detected and degrades silently.

A small debug panel is wired in development only (`NODE_ENV === 'development'`) to surface which entries fired for a given input.

---

## Accessibility

- Skip link to `#main-content` in the root layout.
- `aria-live` on the hero typing phrase, the Now widget, the testimonials carousel, and the assistant message stream.
- `aria-busy` on the contact submit button while loading.
- `aria-current` on the active nav link.
- Focus trap in the terminal and the assistant panel.
- `prefers-reduced-motion` carve-outs in `app/globals.css` and on key components.
- `<noscript>` block in the root layout with a `mailto:` fallback.

---

## Deployment

The site is a standard Next.js 15 app. Build and run anywhere Node 20+ runs.

```bash
npm install
npm run build
npm run start
```

On Vercel, no extra config is required — the build, env, and ISR (revalidate 1h on `api.github.com`) work out of the box.

---

## Roadmap

- Real LLM-backed assistant (the scripted matcher is the floor, not the ceiling).
- MDX-based notes (the current block renderer is intentionally dependency-free).
- Comments on notes.
- Real CMS for the project entries (or a Notion/Obsidian sync).
- A blog with RSS.
- Real Captcha (no keys available; current honeypot + rate-limit + behavioral heuristic is the best honest layer).
- i18n.
