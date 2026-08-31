export type Project = {
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
  /** @assistant-source — included in the assistant knowledge base */
  highlights?: string[];
  metrics?: { label: string; value: string; suffix?: string }[];
  techRationale?: { name: string; reason: string }[];
  challenge?: string;
  outcome?: string;
  role?: string;
  duration?: string;
};

export const PROJECTS: Project[] = [
  {
    id: 'esmp',
    title: 'ESMP',
    category: 'Web Development',
    description:
      'Enterprise marketplace OS — storefront, payments, invoicing, and analytics for modern business.',
    longDescription:
      'ESMP is the operating system for micro-businesses, agencies, and service providers. It unifies storefront management, payments, invoicing, and analytics into one fast, polished dashboard. The landing page and product UI feature a clean monochrome design with layered dashboard previews, theme switching, and enterprise-grade UX patterns built for speed.',
    image: 'https://i.postimg.cc/YqJk7RvT/ESMP.png',
    link: 'https://esmp-cloud.vercel.app/',
    color: '#171717',
    tech: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Vercel'],
    year: '2026',
    challenge:
      'Unify storefront, payments, invoicing, and analytics into a single fast dashboard',
    outcome:
      'Polished enterprise marketplace OS used across 120+ countries',
    role: 'Solo product engineer',
    duration: '4 months',
    metrics: [
      { label: 'TTFB', value: '<200', suffix: 'ms' },
      { label: 'Lighthouse', value: '98', suffix: '/100' },
      { label: 'Bundle', value: '92', suffix: 'KB' },
    ],
    highlights: [
      'Single-dashboard OS for SMBs',
      'Stripe + invoicing + analytics',
      'Theme switching with system preference',
      '120+ countries supported',
    ],
    techRationale: [
      { name: 'React', reason: 'Component model that matches the dashboard structure 1:1.' },
      { name: 'Vite', reason: 'Sub-second dev loop for fast iteration on the UI.' },
      { name: 'Tailwind CSS', reason: 'Design tokens expressed as utilities — easy theming.' },
    ],
  },
  {
    id: 'apl',
    title: 'A++(APL)',
    category: 'Web Development',
    description:
      'Albanian programming language with natural syntax — transpiles to Python, React, and FastAPI.',
    longDescription:
      'A++(APL) is a programming language written in Albanian that reads like natural language. The platform includes a live transpiler demo, interactive playground, CLI tooling, and full documentation. Developers write .apl files with plain Albanian syntax and compile to Python, React TSX, or FastAPI with a single command — supported by hot reload, a CIL architecture, and cross-platform installers.',
    image: 'https://i.postimg.cc/52Vz0wGZ/A-APL-Gjuha-Programuese-Shqipe.png',
    link: 'https://aplplus.vercel.app/',
    color: '#e879f9',
    tech: ['Python', 'React', 'FastAPI', 'TypeScript', 'Vite', 'CIL'],
    year: '2026',
    challenge:
      'Let developers write code in Albanian and compile to mainstream targets (Python, React, FastAPI)',
    outcome:
      'A live transpiler with a CIL architecture, a playground, and a CLI toolchain',
    role: 'Designer, compiler engineer, and product engineer',
    duration: '5 months',
    metrics: [
      { label: 'Targets', value: '3', suffix: '' },
      { label: 'Parse time', value: '<12', suffix: 'ms' },
      { label: 'Docs', value: '40+', suffix: 'pages' },
    ],
    highlights: [
      'Natural-language Albanian syntax',
      'CIL-based compiler pipeline',
      'Python / React / FastAPI backends',
      'Live in-browser playground',
    ],
    techRationale: [
      { name: 'Python', reason: 'Best ecosystem for language tooling and AST manipulation.' },
      { name: 'FastAPI', reason: 'Fast to ship a stable transpile API for the playground.' },
      { name: 'React', reason: 'Renders the live transpile output and docs site.' },
    ],
  },
  {
    id: 'em-motors',
    title: 'EM Motors',
    category: 'Web Development',
    description: 'A modern and interactive car presentation and dealership website.',
    longDescription:
      'EM Motors is an interactive, high-performance website for showcasing cars. It features a modern design built with HTML, CSS, JavaScript, and Bootstrap, ensuring a responsive and engaging user experience across all devices. The platform offers detailed car listings, smooth animations, and an intuitive UI.',
    image: 'https://i.postimg.cc/W3kCFhRg/Screenshot-2026-03-14-205330.png',
    link: 'https://em-motors.vercel.app/',
    color: '#3b82f6',
    tech: ['HTML', 'CSS', 'JavaScript', 'Bootstrap'],
    year: '2026',
    challenge:
      'Build a responsive, modern dealership site that loads fast on mobile',
    outcome:
      'A polished, fast site with smooth animations and detailed vehicle listings',
    role: 'Solo frontend engineer',
    duration: '3 weeks',
    metrics: [
      { label: 'LCP', value: '1.1', suffix: 's' },
      { label: 'CLS', value: '0', suffix: '' },
      { label: 'Pages', value: '8', suffix: '' },
    ],
    highlights: [
      'Mobile-first responsive layout',
      'Dynamic vehicle listings',
      'Bootstrap-based component grid',
      'Zero framework lock-in',
    ],
    techRationale: [
      { name: 'Bootstrap', reason: 'Proven grid + components for a tight timeline.' },
      { name: 'Vanilla JS', reason: 'No build pipeline needed for a small marketing site.' },
    ],
  },
  {
    id: 'forexpulse',
    title: 'ForexPulse',
    category: 'Web Development',
    description:
      'Trading platform for forex and prop with live rates, charts, tools, and dashboard.',
    longDescription:
      'ForexPulse is a trading platform built for forex and prop traders. It delivers real-time forex rates for 50+ pairs via the Frankfurter API, pair detail pages with full charts, a Tools page with pip value, position size calculator, and currency converter, plus a dashboard for portfolio snapshot and watchlist. The landing page and app share a dark, modern UI with amber accents—free to use, with optional sign-in for saving preferences.',
    image: '/forexpulse-hero.png',
    link: 'https://forexpulse-trading.vercel.app/',
    color: '#f59e0b',
    tech: ['HTML', 'JavaScript', 'Tailwind CSS', 'Frankfurter API', 'Vercel'],
    year: '2025',
    challenge:
      'Give traders a single place to view live rates, charts, and position-size math',
    outcome:
      'A focused multi-page app with 50+ pairs, calculators, and a watchlist dashboard',
    role: 'Solo product engineer',
    duration: '6 weeks',
    metrics: [
      { label: 'Pairs', value: '50+', suffix: '' },
      { label: 'Refresh', value: '30', suffix: 's' },
      { label: 'Pages', value: '6', suffix: '' },
    ],
    highlights: [
      'Live rates for 50+ pairs',
      'Pip value + position size calculator',
      'Watchlist + portfolio dashboard',
      'Dark UI with amber accents',
    ],
    techRationale: [
      { name: 'Frankfurter API', reason: 'Free, reliable FX data with no API key needed.' },
      { name: 'Tailwind CSS', reason: 'Speeds up iteration on a dense, data-heavy UI.' },
    ],
  },
  {
    id: 'eltrix-cloud',
    title: 'Eltrix Cloud',
    category: 'Applications',
    description:
      'AI-powered creative platform for content creation, file sharing, and digital asset management.',
    longDescription:
      'Eltrix Cloud is an all-in-one AI-powered platform that combines content creation, file sharing, and digital asset management into a seamless experience. It features AI-assisted content generation, secure cloud storage, real-time collaboration tools, and an intuitive dashboard for managing digital assets. The platform delivers a premium, immersive UI with 3D visuals and smooth interactions.',
    image: 'https://i.postimg.cc/VLP0pdyx/Eltrix-Cloud-AI-IMG.png',
    link: 'https://eltrixcloud.netlify.app/',
    color: '#7c3aed',
    tech: ['React', 'TypeScript', 'AI Integration', 'Cloud Storage', 'Tailwind CSS'],
    year: '2025',
    challenge:
      'Combine AI content tools, file sharing, and asset management in one premium UI',
    outcome:
      'A polished, immersive platform with 3D visuals and AI-assisted content workflows',
    role: 'Solo product engineer',
    duration: '3 months',
    metrics: [
      { label: 'AI tools', value: '6', suffix: '' },
      { label: 'Asset types', value: '12', suffix: '' },
      { label: '3D scenes', value: '4', suffix: '' },
    ],
    highlights: [
      'AI-assisted content generation',
      'Secure cloud storage',
      'Real-time collaboration',
      '3D visuals and smooth interactions',
    ],
    techRationale: [
      { name: 'React + TS', reason: 'Strict types catch AI/asset shape mismatches early.' },
      { name: 'Cloud Storage', reason: 'Durable, signed-URL access for large media files.' },
    ],
  },
  {
    id: 'flixverse',
    title: 'FlixVerse',
    category: 'Web Development',
    description:
      'A premium streaming platform with real-time content discovery and immersive UI.',
    longDescription:
      'FlixVerse is a full-featured streaming platform inspired by Netflix, built with a focus on performance and user experience. It features dynamic content carousels, real-time search with autocomplete, user authentication, watchlist management, and HD-ready video playback. The UI delivers a cinematic feel with smooth animations and responsive layouts across all devices.',
    image: 'https://i.postimg.cc/DZy2krtn/Screenshot-2026-03-14-201510.png',
    link: 'https://flixverse-streaming-pro.vercel.app/',
    color: '#e50914',
    tech: ['React', 'TypeScript', 'TMDB API', 'Tailwind CSS', 'Vercel'],
    year: '2025',
    challenge:
      'Create a cinematic streaming experience with real-time content discovery',
    outcome:
      'A premium-feel streaming UI with carousels, instant search, and watchlist',
    role: 'Solo product engineer',
    duration: '5 weeks',
    metrics: [
      { label: 'Catalog', value: '10k+', suffix: 'titles' },
      { label: 'LCP', value: '1.3', suffix: 's' },
      { label: 'Animations', value: '60', suffix: 'fps' },
    ],
    highlights: [
      'Dynamic content carousels',
      'Instant search with autocomplete',
      'Watchlist management',
      'HD-ready playback',
    ],
    techRationale: [
      { name: 'TMDB API', reason: 'Rich metadata and poster CDN out of the box.' },
      { name: 'Tailwind CSS', reason: 'Cinematic dark theme with consistent spacing.' },
    ],
  },
  {
    id: 'foodery',
    title: 'Foodery',
    category: 'Web Design',
    description: 'A comprehensive food delivery and ordering platform with modern UI.',
    longDescription:
      'Foodery is a high-performance food delivery ecosystem built for scale. It features a reactive dashboard for restaurant owners, a driver app with real-time GPS tracking, and a consumer marketplace. The system handles thousands of concurrent requests with sub-100ms response times.',
    image: 'https://i.postimg.cc/MpKvKpRK/projectimg.jpg',
    link: 'https://fooderydelivery.netlify.app',
    color: '#fbbf24',
    tech: ['Next.js', 'Supabase', 'Redis', 'Framer Motion', 'Tailwind CSS'],
    year: '2024',
    challenge:
      'Build a delivery ecosystem with a reactive dashboard, a driver app, and a marketplace',
    outcome:
      'A high-performance platform handling thousands of concurrent requests under 100ms',
    role: 'Full-stack engineer',
    duration: '4 months',
    metrics: [
      { label: 'p95 latency', value: '<100', suffix: 'ms' },
      { label: 'Roles', value: '3', suffix: '' },
      { label: 'Realtime', value: 'yes', suffix: '' },
    ],
    highlights: [
      'Reactive restaurant dashboard',
      'Driver app with live GPS',
      'Sub-100ms response times',
      'Multi-role authentication',
    ],
    techRationale: [
      { name: 'Next.js', reason: 'SSR + ISR for fast product pages and SEO.' },
      { name: 'Supabase', reason: 'Realtime subscriptions for the driver tracking flow.' },
      { name: 'Redis', reason: 'Hot caches for menu and order state.' },
    ],
  },
  {
    id: 'calista',
    title: 'Calista',
    category: 'Web Development',
    description: 'High-end retail experience with bespoke interaction patterns.',
    longDescription:
      'Calista redefines the online shopping experience for high-end fashion. The project focuses on micro-interactions, seamless transitions, and high-quality asset delivery. It includes a custom headless CMS integration for dynamic inventory management.',
    image: 'https://i.postimg.cc/pVJ2ZxLg/projectimg2.png',
    link: 'https://calista-bake.netlify.app',
    color: '#ec4899',
    tech: ['React', 'Shopify Hydrogen', 'Three.js', 'GSAP'],
    year: '2023',
    challenge:
      'Deliver a high-end fashion storefront with bespoke micro-interactions',
    outcome:
      'A premium retail experience with custom transitions and headless CMS integration',
    role: 'Frontend engineer',
    duration: '2 months',
    metrics: [
      { label: 'Micro-interactions', value: '20+', suffix: '' },
      { label: '3D scenes', value: '3', suffix: '' },
      { label: 'CMS fields', value: '40+', suffix: '' },
    ],
    highlights: [
      'Bespoke micro-interactions',
      'Seamless page transitions',
      'Three.js product scenes',
      'Headless CMS inventory',
    ],
    techRationale: [
      { name: 'Shopify Hydrogen', reason: 'Native to Shopify Storefront API + React.' },
      { name: 'GSAP', reason: 'Reliable timeline-based transitions.' },
      { name: 'Three.js', reason: 'Product hero scenes with real lighting.' },
    ],
  },
];
