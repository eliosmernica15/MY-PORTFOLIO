export type NoteBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'code'; lang: string; code: string }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'callout'; tone: 'info' | 'warn' | 'success'; text: string };

export type Note = {
  slug: string;
  title: string;
  date: string;
  readMin: number;
  tags: string[];
  summary: string;
  body: NoteBlock[];
};

export const NOTES: Note[] = [
  {
    slug: 'designing-a-60fps-particle-field',
    title: 'Designing a 60fps Particle Field in the Browser',
    date: '2026-08-15',
    readMin: 7,
    tags: ['webgl', 'performance', 'shaders'],
    summary:
      'A practical walkthrough of building a 3D particle nebula with vanilla WebGL2 and FBM noise — and keeping it at 60fps on a mid-tier laptop.',
    body: [
      { type: 'p', text: 'Most "particle fields" on the web are either: a 2D canvas with circles, or a heavy three.js scene. There is a middle ground that gives you 3D depth, custom shaders, and a tiny bundle, all in vanilla WebGL2.' },
      { type: 'h2', text: 'Why WebGL2 and not three.js?' },
      { type: 'p', text: 'For pure particle work — instanced quads with a vertex shader doing the heavy lifting — three.js adds 100KB+ of runtime you do not need. WebGL2 gives you instanced drawing, vertex array objects, and the modern texture formats you want.' },
      { type: 'h2', text: 'The core loop' },
      { type: 'list', items: [
        'Buffer geometry for N particles (positions, velocities, ages)',
        'Instanced rendering with a single quad',
        'Vertex shader displaces by time + mouse',
        'Fragment shader: soft circular falloff with additive blending',
        'Paused when document.hidden or hero out of view',
      ]},
      { type: 'h2', text: 'Keeping it fast' },
      { type: 'p', text: 'The single biggest win is pausing when the user cannot see the canvas. IntersectionObserver plus the visibilitychange API gets you 90% of the way to "free" when scrolled away.' },
      { type: 'callout', tone: 'info', text: 'Cap dpr at 1.5. On a Retina display, the unconstrained dpr is 2.0+, which doubles your fragment work for almost no visual gain on small particles.' },
      { type: 'h2', text: 'Source' },
      { type: 'p', text: 'The full component is open source in this portfolio repo — see the ParticleField component for the complete implementation.' },
    ],
  },
  {
    slug: 'why-i-built-apl',
    title: 'Why I Built a Programming Language in Albanian',
    date: '2026-07-02',
    readMin: 9,
    tags: ['compilers', 'language-design', 'albanian'],
    summary:
      'A++(APL) lets you write code that reads like Albanian and compiles to Python, React, or FastAPI. Here is the why and the how.',
    body: [
      { type: 'p', text: 'Most programming languages are written in English. Keywords like "if", "for", "function" — and the surrounding ecosystem (docs, libraries, examples) — assume English fluency. That is a barrier for the majority of the world.' },
      { type: 'h2', text: 'The goal' },
      { type: 'p', text: 'A++(APL) is an experiment: can we let a developer write code in their first language — Albanian in our case — and compile it to a mainstream target? The grammar maps Albanian verbs to Python control flow, Albanian nouns to identifiers.' },
      { type: 'code', lang: 'apl', code: '// Albanian\nvariabel emri = "Elios"\nper secili nxenes ne klasa:\n    printo nxenes.emri\n\n// compiles to Python\nfor student in class:\n    print(student.name)' },
      { type: 'h2', text: 'Architecture' },
      { type: 'list', items: [
        'Lexer: tokenizes Albanian input, normalizes whitespace, handles Unicode',
        'Parser: produces an AST with language-agnostic nodes',
        'CIL: an intermediate representation similar to .NET IL',
        'Backends: Python, React TSX, FastAPI (more in progress)',
      ]},
      { type: 'h2', text: 'What surprised me' },
      { type: 'p', text: 'The hardest part is not the compiler — it is the documentation. Writing a spec in Albanian that explains a stack frame is harder than writing the spec in English.' },
      { type: 'quote', text: 'If you can read your code aloud and it sounds like a sentence, you have a real language — not just a syntax sugar over Python.' },
    ],
  },
  {
    slug: 'edge-rendering-a-portfolio',
    title: 'Edge-Rendering a Portfolio: Static, Smart, and Fast',
    date: '2026-05-20',
    readMin: 5,
    tags: ['nextjs', 'vercel', 'performance'],
    summary:
      'How I rebuilt this portfolio on Next.js 15 with per-route OG images, ISR, and a service worker — and why the architecture matters more than the visual polish.',
    body: [
      { type: 'p', text: 'A portfolio has one job: get out of the way and let the work speak. That means the page should appear in under a second, look great on a phone, and degrade gracefully on a flaky network.' },
      { type: 'h2', text: 'Static by default' },
      { type: 'p', text: 'Next.js 15 lets the App Router statically render every route at build time. The home page is one HTML file, ~12KB, served from the edge.' },
      { type: 'h2', text: 'Dynamic only where it matters' },
      { type: 'p', text: 'The project pages generate metadata and a custom OG image per project at build time. Sharing a link to /project/esmp produces a real preview card on Slack, Twitter, and LinkedIn — no manual image uploads.' },
      { type: 'h2', text: 'A scripted assistant' },
      { type: 'p', text: 'The portfolio includes an AI-style assistant that knows the content. It is not a real LLM — it is a token-overlap matcher over the same data the page renders. The point is to show the architecture: the same source of truth feeds the UI, the sitemap, the OG images, and the assistant.' },
      { type: 'callout', tone: 'success', text: 'The single best metric for a portfolio is the time from click to "I understand what you do." Architecture is a multiplier on every other choice.' },
    ],
  },
];
