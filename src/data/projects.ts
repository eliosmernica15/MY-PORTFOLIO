/**
 * Selected work, ordered latest-first by completion time (per the CV).
 * 2026: Genpact Hackathon (3rd place), EM Motors
 * 2025: Eltrix Cloud (1st place, AI), FlixVerse, A++ (APL)
 * 2024: ESMP, Foodery, ForexPulse, Calista
 */
import type { Project, ProjectMetric, ProjectTechRationale } from "@/types";

export const PROJECTS: Project[] = [
  {
    id: "genpact-hackathon-2026",
    title: "Genpact Hackathon 2026",
    category: "AI & Healthcare",
    description:
      "Enterprise-grade AI healthcare diagnostic triage — streaming records, FHIR-compliant, sub-second decision support.",
    longDescription:
      "Genpact Hackathon 2026 (Kosovo) — 3rd Place. An enterprise-grade AI healthcare diagnostic triage platform featuring streaming clinical records ingestion, FHIR compliance, and sub-second decision support. Built under hackathon time pressure end-to-end: ingestion pipeline, triage model integration, clinician-facing UI, and a Dockerized deployment.",
    image: "/projects/genpact-hackathon-2026.svg",
    link: "",
    color: "#1a1611",
    tech: ["Python", "FastAPI", "React", "PostgreSQL", "LLMs", "Docker"],
    year: "2026",
    awards: ["3rd Place — Genpact Hackathon 2026, Kosovo"],
    challenge:
      "Triage clinical records of any volume down to sub-second, explainable recommendations for clinicians",
    outcome:
      "A streaming, FHIR-compliant triage pipeline with sub-second decision support, taken from zero to working demo in the hackathon",
    role: "AI systems architect & full-stack engineer",
    duration: "Hackathon",
    metrics: [{ label: "Placement", value: "3rd", suffix: "Place" }],
    highlights: [
      "3rd Place, Genpact Hackathon 2026 (Kosovo)",
      "FHIR-compliant streaming records ingestion",
      "Sub-second diagnostic decision support",
      "Engineered end-to-end in the hackathon",
    ],
    techRationale: [
      {
        name: "FastAPI",
        reason:
          "Streaming-friendly async runtime for the records ingestion pipeline.",
      },
      {
        name: "PostgreSQL",
        reason:
          "Durable clinical store with JSONB for variable-record payloads.",
      },
    ],
  },
  {
    id: "em-motors",
    title: "EM Motors",
    category: "Web Development",
    description:
      "A modern and interactive car presentation and dealership website.",
    longDescription:
      "EM Motors is an interactive, high-performance website for showcasing cars. It features a modern design built with HTML, CSS, JavaScript, and Bootstrap, ensuring a responsive and engaging user experience across all devices. The platform offers detailed car listings, smooth animations, and an intuitive UI.",
    image: "/projects/em-motors.png",
    link: "https://em-motors.vercel.app/",
    color: "#262626",
    tech: ["HTML", "CSS", "JavaScript", "Bootstrap"],
    year: "2026",
    challenge:
      "Build a responsive, modern dealership site that loads fast on mobile",
    outcome:
      "A polished, fast site with smooth animations and detailed vehicle listings",
    role: "Solo frontend engineer",
    duration: "3 weeks",
    metrics: [],
    highlights: [
      "Mobile-first responsive layout",
      "Dynamic vehicle listings",
      "Bootstrap-based component grid",
      "Zero framework lock-in",
    ],
    techRationale: [
      {
        name: "Bootstrap",
        reason: "Proven grid + components for a tight timeline.",
      },
      {
        name: "Vanilla JS",
        reason: "No build pipeline needed for a small marketing site.",
      },
    ],
  },
  {
    id: "eltrix-cloud",
    title: "Eltrix Cloud",
    category: "Applications",
    description:
      "AI-powered creative platform for content creation, file sharing, and digital asset management.",
    longDescription:
      "Eltrix Cloud is a distributed creative content platform powered by the Anthropic Claude API, LangChain and LangGraph, with pgvector semantic indexing and automated RAG workflows. It combines AI-assisted content generation, secure cloud storage, real-time collaboration tools, and a premium, immersive UI with 3D visuals.",
    image: "/projects/eltrix-cloud.png",
    link: "https://eltrixcloud.netlify.app/",
    color: "#232323",
    tech: [
      "FastAPI",
      "Python",
      "React",
      "TypeScript",
      "LangChain",
      "Claude API",
      "PostgreSQL",
    ],
    year: "2025",
    awards: ["1st Place (AI) — Innovation Academy Hackathon, June 2025"],
    challenge:
      "Combine AI content tools, file sharing, and asset management in one premium UI",
    outcome:
      "A distributed creative-content platform with automated RAG workflows — winner, Innovation Academy Hackathon, June 2025",
    role: "Solo product engineer",
    duration: "Hackathon — June 2025",
    metrics: [],
    highlights: [
      "1st Place (AI) — Innovation Academy Hackathon, June 2025",
      "Claude API + LangChain & LangGraph agents",
      "pgvector semantic indexing",
      "Automated RAG content workflows",
      "3D visuals and smooth interactions",
    ],
    techRationale: [
      {
        name: "Claude API",
        reason:
          "Best-in-class model for content reasoning inside RAG pipelines.",
      },
      {
        name: "pgvector",
        reason:
          "Semantic retrieval for assets and generated content — inside Postgres.",
      },
      {
        name: "LangChain / LangGraph",
        reason:
          "Composable, inspectable RAG and agent graphs with human-in-the-loop steps.",
      },
    ],
  },
  {
    id: "flixverse",
    title: "FlixVerse",
    category: "Web Development",
    description:
      "A premium streaming platform with real-time content discovery and immersive UI.",
    longDescription:
      "FlixVerse is a full-featured streaming platform inspired by Netflix, built with a focus on performance and user experience. It features dynamic content carousels, real-time search with autocomplete, user authentication, watchlist management, and HD-ready video playback. The UI delivers a cinematic feel with smooth animations and responsive layouts across all devices.",
    image: "/flixverse-hero.png",
    link: "https://flixverse-streaming-pro.vercel.app/",
    color: "#191919",
    tech: ["React", "TypeScript", "TMDB API", "Tailwind CSS", "Vercel"],
    year: "2025",
    challenge:
      "Create a cinematic streaming experience with real-time content discovery",
    outcome:
      "A premium-feel streaming UI with carousels, instant search, and watchlist",
    role: "Solo product engineer",
    duration: "5 weeks",
    metrics: [{ label: "Catalog", value: "10k+", suffix: "titles" }],
    highlights: [
      "Dynamic content carousels",
      "Instant search with autocomplete",
      "Watchlist management",
      "HD-ready playback",
    ],
    techRationale: [
      {
        name: "TMDB API",
        reason: "Rich metadata and poster CDN out of the box.",
      },
      {
        name: "Tailwind CSS",
        reason: "Cinematic dark theme with consistent spacing.",
      },
    ],
  },
  {
    id: "apl",
    title: "A++(APL)",
    category: "Web Development",
    description:
      "Albanian programming language with natural syntax — transpiles to Python, React, and FastAPI.",
    longDescription:
      "A++(APL) is a programming language written in Albanian that reads like natural language. The platform includes an AI-assisted live transpiler demo, an AST parser, an interactive web playground, a secure containerized execution sandbox and a CLI toolchain. Developers write .apl files with plain Albanian syntax and compile to Python or TypeScript with a single command.",
    image: "/projects/apl.png",
    link: "https://aplplus.vercel.app/",
    color: "#2e2e2e",
    tech: ["Python", "FastAPI", "React", "Node.js", "WebGL"],
    year: "2024 – 2025",
    challenge:
      "Let developers write code in Albanian and compile to mainstream targets (Python, React, FastAPI)",
    outcome:
      "A live transpiler with a CIL architecture, a playground, and a CLI toolchain",
    role: "Designer, compiler engineer, and product engineer",
    duration: "5 months",
    metrics: [{ label: "Targets", value: "3", suffix: "" }],
    highlights: [
      "AI-assisted live transpiler",
      "AST parser + CIL compiler pipeline",
      "Interactive web playground",
      "CLI toolchain",
      "Containerized execution sandbox",
    ],
    techRationale: [
      {
        name: "Python",
        reason: "Best ecosystem for language tooling and AST manipulation.",
      },
      {
        name: "WebGL",
        reason:
          "Hardware-accelerated rendering for the live playground and diagnostics views.",
      },
      {
        name: "FastAPI",
        reason: "Fast to ship a stable transpile API for the playground.",
      },
    ],
  },
  {
    id: "esmp",
    title: "ESMP",
    category: "Web Development",
    description:
      "Enterprise marketplace OS — storefront, payments, invoicing, and analytics for modern business.",
    longDescription:
      "ESMP is a high-throughput e-commerce marketplace infrastructure. It unifies storefront management, ledger-grade automated invoicing, real-time streaming analytics and distributed inventory locking into one dashboard — with secure Stripe webhooks moving money end to end.",
    image: "/projects/esmp.png",
    link: "https://esmp-cloud.vercel.app/",
    color: "#171717",
    tech: ["React", "TypeScript", "Node.js", "PostgreSQL", "MongoDB", "Redis"],
    year: "2024",
    challenge:
      "Unify storefront, payments, invoicing, and analytics into a single fast dashboard",
    outcome:
      "Enterprise marketplace OS — storefront, payments, invoicing and analytics unified in one production dashboard",
    role: "Solo product engineer",
    duration: "4 months",
    metrics: [],
    highlights: [
      "High-throughput marketplace runtime",
      "Real-time streaming analytics",
      "Ledger-grade automated invoicing",
      "Distributed inventory locking",
      "Secure Stripe webhooks",
    ],
    techRationale: [
      {
        name: "Redis",
        reason: "Hot caches, rate limiting and distributed inventory locks.",
      },
      {
        name: "PostgreSQL",
        reason: "Ledger-grade transactional truth — invoicing and payouts.",
      },
      {
        name: "Node.js",
        reason: "Event-driven API tier for the streaming analytics feed.",
      },
    ],
  },
  {
    id: "foodery",
    title: "Foodery",
    category: "Web Design",
    description:
      "A comprehensive food delivery and ordering platform with modern UI.",
    longDescription:
      "Foodery is a scalable microservices delivery ecosystem: a reactive executive dashboard for restaurant owners, a driver app with live GPS WebSocket tracking, and a consumer marketplace. Geospatial dispatcher routing algorithms match orders to drivers; Supabase powers realtime location and auth; Postgres holds order truth.",
    image: "/projects/project-7.jpg",
    link: "https://fooderydelivery.netlify.app",
    color: "#2b2b2b",
    tech: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "WebSockets"],
    year: "2024",
    challenge:
      "Build a delivery ecosystem with a reactive dashboard, a driver app, and a marketplace",
    outcome:
      "A food delivery ecosystem: restaurant dashboard, driver app with live GPS, and a consumer marketplace",
    role: "Full-stack engineer",
    duration: "4 months",
    metrics: [{ label: "Roles", value: "3", suffix: "" }],
    highlights: [
      "Reactive restaurant dashboard",
      "Driver app with live GPS",
      "Multi-role authentication",
    ],
    techRationale: [
      { name: "Next.js", reason: "SSR + ISR for fast product pages and SEO." },
      {
        name: "Supabase",
        reason: "Realtime subscriptions for the driver tracking flow.",
      },
      { name: "Redis", reason: "Hot caches for menu and order state." },
    ],
  },
  {
    id: "forexpulse",
    title: "ForexPulse",
    category: "Web Development",
    description:
      "Trading platform for forex and prop with live rates, charts, tools, and dashboard.",
    longDescription:
      "ForexPulse is a financial market telemetry engine with high-frequency WebSocket rate feeds. 50+ currency pairs with 30-second refresh — pip-value and position-size calculators, a tools page, and a watchlist dashboard.",
    image: "/forexpulse-hero.png",
    link: "https://forexpulse-trading.vercel.app/",
    color: "#1f1f1f",
    tech: [
      "JavaScript",
      "React",
      "Tailwind CSS",
      "WebSockets",
      "Frankfurter API",
    ],
    year: "2024",
    challenge:
      "Give traders a single place to view live rates, charts, and position-size math",
    outcome:
      "A focused multi-page app with 50+ pairs, calculators, and a watchlist dashboard",
    role: "Solo product engineer",
    duration: "6 weeks",
    metrics: [
      { label: "Pairs", value: "50+", suffix: "" },
      { label: "Refresh", value: "30", suffix: "s" },
      { label: "Pages", value: "6", suffix: "" },
    ],
    highlights: [
      "Live rates for 50+ pairs",
      "Pip value + position size calculator",
      "Watchlist + portfolio dashboard",
      "Dark UI with amber accents",
    ],
    techRationale: [
      {
        name: "Frankfurter API",
        reason: "Free, reliable FX data with no API key needed.",
      },
      {
        name: "Tailwind CSS",
        reason: "Speeds up iteration on a dense, data-heavy UI.",
      },
    ],
  },
  {
    id: "calista",
    title: "Calista",
    category: "Web Development",
    description:
      "High-end retail experience with bespoke interaction patterns.",
    longDescription:
      "Calista is a high-performance luxury e-commerce portal with GPU-accelerated 3D WebGL rendering, bespoke micro-interactions, seamless transitions, and a headless CMS driving dynamic inventory.",
    image: "/projects/project-8.png",
    link: "https://calista-bake.netlify.app",
    color: "#282828",
    tech: ["React", "Three.js", "Shopify Hydrogen", "GSAP"],
    year: "2024",
    challenge:
      "Deliver a high-end fashion storefront with bespoke micro-interactions",
    outcome:
      "A premium retail experience with custom transitions and headless CMS integration",
    role: "Frontend engineer",
    duration: "2 months",
    metrics: [],
    highlights: [
      "Bespoke micro-interactions",
      "Seamless page transitions",
      "Three.js product scenes",
      "Headless CMS inventory",
    ],
    techRationale: [
      {
        name: "Shopify Hydrogen",
        reason: "Native to Shopify Storefront API + React.",
      },
      { name: "GSAP", reason: "Reliable timeline-based transitions." },
      { name: "Three.js", reason: "Product hero scenes with real lighting." },
    ],
  },
];
