# Rinor Zeqiri — Portfolio

A modern, responsive portfolio site built with React, TypeScript, and Vite. Features a 3D Spline hero, dark/light theme, and smooth animations.

## Tech stack

- **React 19** + **TypeScript**
- **Vite** — build tool and dev server
- **Tailwind CSS** — styling (v3.4)
- **Framer Motion** — animations
- **React Router** — routing (Home, project detail, 404)
- **Spline** — 3D hero scene
- **EmailJS** — contact form (optional, via env)

## Project structure

```
├── components/       # UI components (Hero, Nav, Footer, Projects, Contact, etc.)
├── pages/            # Route pages (Home, ProjectDetail, NotFound)
├── constants.ts      # Projects, services, and site copy
├── index.html
├── index.tsx         # App entry, routes, theme
└── index.css         # Global styles and theme variables
```

## Prerequisites

- **Node.js** (v18 or newer recommended)

## Setup

1. **Clone and install**

   ```bash
   git clone https://github.com/eliosmernica15/MY-PORTFOLIO.git
   cd MY-PORTFOLIO
   npm install
   ```

2. **Environment (optional — contact form)**

   To enable the contact form, copy the example env file and add your [EmailJS](https://www.emailjs.com/) keys:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set:

   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_TEMPLATE_ID`
   - `VITE_EMAILJS_PUBLIC_KEY`

   See `.env.example` for setup steps. The site runs without these; the form will show a demo message if they are missing.

3. **Run locally**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command           | Description              |
|-------------------|--------------------------|
| `npm run dev`     | Start dev server (port 3000) |
| `npm run build`   | Production build         |
| `npm run preview` | Preview production build |

## Required static assets

Place these in the `public/` folder so links and images resolve correctly:

- **Hero images:** `forexpulse-hero.png` (included). For full project coverage, add `eltrix-cloud-hero.png` and `flixverse-hero.png` if you use those projects (or update `constants.ts` to use external URLs).
- **Resume:** Add `Rinor-Zeqiri-CV.pdf` to `public/` if you want the Resume section “Download CV” link to work; otherwise replace the link in `components/Resume.tsx` with your own URL.

## Deploy

The project is set up for [Vercel](https://vercel.com). Push to `main` to trigger a deploy. Ensure any required env vars (e.g. EmailJS) are set in the Vercel project settings.

## License

Private. All rights reserved.
