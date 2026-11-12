import type { KnowledgeEntry, KnowledgeAction } from "@/types";

export const KNOWLEDGE_STATIC: KnowledgeEntry[] = [
  {
    id: "about_short",
    intent: "about",
    weight: 1.0,
    text: "I'm Elios Mernica, a software engineer based in Vushtrri, Kosovo. I build AI systems, full-stack web platforms, and the network infrastructure that holds them up. I'm available for remote work worldwide.",
    textSq:
      "Unë jam Elios Mernica, inxhinier softueri me bazë në Vushtrri, Kosovë. Ndërtoj sisteme IA, platforma web full-stack dhe infrastrukturën e rrjetit që i mban lart. Jam i disponueshëm për punë remote në mbarë botën.",
    related: ["projects", "skills"],
  },
  {
    id: "about_long",
    intent: "about",
    weight: 0.9,
    text: "I work across the full stack — from React/TypeScript frontends to Node and Python backends, plus the network plumbing underneath. My current focus is AI systems: I've built a programming language in Albanian (A++(APL)) and an enterprise marketplace OS (ESMP). I treat every project as a production system, not a demo.",
    textSq:
      "Punoj në të gjithë stack-un — nga frontendet React/TypeScript deri te backendet Node dhe Python, plus hidraulikën e rrjetit poshtë. Fokusimi im aktual janë sistemet e IA: kam ndërtuar një gjuhë programimi në shqip (A++(APL)) dhe një marketplace OS ndërmarrës (ESMP). Çdo projekt e trajtoj si sistem produksioni, jo si demo.",
  },
  {
    id: "contact_email",
    intent: "contact",
    weight: 0.95,
    text: "Email me at eliosmernica@gmail.com or use the contact form below. I reply within 24 hours, Mon–Sat, GMT+1.",
    textSq:
      "Shkruani te eliosmernica@gmail.com ose përdorni formularin e kontaktit poshtë. Përgjigjem brenda 24 orëve, Hënë–Shtunë, GMT+1.",
    action: { type: "scroll_to", target: "#contact" },
  },
  {
    id: "contact_phone",
    intent: "contact",
    weight: 0.6,
    text: "Phone: +383 (49) 363 163 — best reached by email first.",
    textSq: "Telefon: +383 (49) 363 163 — më së miri filloni me email.",
  },
  {
    id: "availability",
    intent: "availability",
    weight: 1.0,
    text: "I'm currently open to contract roles and select full-time opportunities. Remote-first; can align with EU, UK, and US Eastern time zones.",
    textSq:
      "Aktualisht jam i hapur për role me kontratë dhe pozicione të zgjedhura full-time. Remote-first; mund të koordinohem me zonat kohore të BE-së, Britanisë së Madhe dhe bregut lindor të SHBA-së.",
  },
  {
    id: "rates",
    intent: "rates",
    weight: 0.85,
    text: "My rate depends on scope and timeline. For a focused 2–6 week build, projects typically land in the €4,000–€15,000 range. For ongoing work, I prefer a monthly retainer. Email me with a brief and I'll send a quote.",
    textSq:
      "Norma ime varet nga shtrirja dhe afati kohor. Për një ndërtim të fokusuar 2–6 javësh, projektet zakonisht bien në rangun €4,000–€15,000. Për punë të vazhdueshme, preferoj një retainer mujor. Më dërgoni një brief dhe do t'ju dërgoj një ofertë.",
  },
  {
    id: "process",
    intent: "process",
    weight: 0.9,
    text: "My process: (1) discovery call, 30 minutes, free; (2) a 1–2 page brief with scope, milestones, and price; (3) iterative build with weekly demos; (4) launch + 30 days of bug-fix support. No long contracts, no surprises.",
    textSq:
      "Procesi im: (1) telefonatë zbuluese, 30 minuta, falas; (2) një brief 1–2 faqesh me shtrirje, etapa dhe çmim; (3) ndërtim iterativ me demo javore; (4) lanҫim + 30 ditë mbështetje për korrigjim gabimesh. Pa kontrata të gjata, pa surpriza.",
  },
  {
    id: "stack",
    intent: "stack",
    weight: 0.95,
    text: "Frontend: React, Next.js, TypeScript, Tailwind, Framer Motion. Backend: Node, NestJS, Python, FastAPI, .NET. Data: PostgreSQL, MongoDB, Redis, Pinecone. Infra: Vercel, Netlify, Cloudflare, Linux. AI: OpenAI, Anthropic, custom RAG, vector search.",
    textSq:
      "Frontend: React, Next.js, TypeScript, Tailwind, Framer Motion. Backend: Node, NestJS, Python, FastAPI, .NET. Të dhëna: PostgreSQL, MongoDB, Redis, Pinecone. Infra: Vercel, Netlify, Cloudflare, Linux. IA: OpenAI, Anthropic, RAG të caktuar, kërkim vektorial.",
  },
  {
    id: "ai_work",
    intent: "ai",
    weight: 1.0,
    text: "AI is my current frontier. I've built a programming language compiler (A++(APL)), integrated LLM APIs into production products, and designed RAG pipelines. I'm most interested in agent systems, tool use, and AI-native UX.",
    textSq:
      "IA është fronti im aktual. Kam ndërtuar një kompilues gjuhe programimi (A++(APL)), kam integruar API të LLM-ve në produkte produksioni dhe kam projektuar pipelines RAG. Më interesojnë më së shumti sistemet e agjentëve, përdorimi i mjeteve dhe UX-ja AI-native.",
  },
  {
    id: "frontend",
    intent: "frontend",
    weight: 0.9,
    text: "I build production-grade React and Next.js frontends. Recent work: ESMP (an enterprise marketplace OS), ForexPulse (a real-time trading platform with 50+ pairs), and FlixVerse (a Netflix-style streaming UI).",
    textSq:
      "Ndërtoj frontenda React dhe Next.js të nivelit të produksionit. Puna e fundit: ESMP (një marketplace OS ndërmarrës), ForexPulse (platformë tregtimi në kohë reale me 50+ çifte) dhe FlixVerse (UI transmetimi stil Netflix).",
  },
  {
    id: "backend",
    intent: "backend",
    weight: 0.85,
    text: "Backend: Node.js + Express/NestJS, Python + FastAPI, .NET for enterprise clients. I design for horizontal scaling, clean APIs, and clear observability.",
    textSq:
      "Backend: Node.js + Express/NestJS, Python + FastAPI, .NET për klientë ndërmarrës. Projektoj për shkallëzim horizontal, API të pastra dhe observabilitet të qartë.",
  },
  {
    id: "infrastructure",
    intent: "infrastructure",
    weight: 0.85,
    text: "Network and infrastructure: I've run production deployments on Vercel/Netlify, configured edge networks and CDN rules, and have hands-on Linux experience. I treat the network as a first-class part of the stack.",
    textSq:
      "Rrjeti dhe infrastruktura: kam drejtuar deploy-e produksioni në Vercel/Netlify, kam konfiguruar rrjete edge dhe rregulla CDN, dhe kam përvojë praktike me Linux. Rrjetin e trajtoj si pjesë të klasit të parë të stack-ut.",
  },
  {
    id: "kosovo",
    intent: "location",
    weight: 1.0,
    text: "I'm based in Vushtrri, Kosovo (Central Europe / GMT+1). I work fully remote and have shipped to clients in the US, UK, Germany, and the Balkans.",
    textSq:
      "Jam me bazë në Vushtrri, Kosovë (Evropa Qendrore / GMT+1). Punon plotësisht remote dhe kam dërguar për klientë në SHBA, Britani të Madhe, Gjermani dhe Ballkan.",
  },
  {
    id: "cv_download",
    intent: "cv",
    weight: 0.95,
    text: "You can download my CV using the 'Download CV' button on the Resume section, or directly at /Elios-Mernica-CV.pdf.",
    textSq:
      "CV-në mund ta shkarkoni me butonin 'Shkarko CV-në' në seksionin e profilit, ose direkt te /Elios-Mernica-CV.pdf.",
    action: { type: "open_link", target: "/Elios-Mernica-CV.pdf" },
  },
  {
    id: "greeting",
    intent: "greeting",
    weight: 1.0,
    text: "Hey — I'm Elios. Ask me about my work, my stack, or how to get in touch.",
    textSq:
      "Hej — unë jam Elios. Pyetni për punën time, stack-un ose si të lidheni me mua.",
  },
  {
    id: "thanks",
    intent: "thanks",
    weight: 1.0,
    text: "Anytime. If you want to work together, the contact form is one click away.",
    textSq:
      "Gjithmonë. Nëse doni të punojmë bashkë, formulari i kontaktit është një klikim larg.",
  },
  {
    id: "fallback",
    intent: "fallback",
    weight: 1.0,
    text: "I'm not sure I have a direct answer for that. Try one of these instead: 'What do you do?', 'Are you available?', 'Show me your AI work', or 'How do we start?'.",
    textSq:
      "Nuk jam i sigurt që kam një përgjigje të menjëhershme për këtë. Provoni një nga këto në vend të saj: 'Çfarë bëni?', 'A jeni i disponueshëm?', 'Trego punën me IA', ose 'Si fillojmë?'.",
  },
  {
    id: "easter_egg_coffee",
    intent: "easter_egg",
    weight: 0.5,
    text: "I run on espresso and well-named variables. The ratio is approximately 1:3, espresso to variables, on a good day.",
    textSq:
      "Funksionoj me espresso dhe variabla me emra të mirë. Raporti është afërsisht 1:3, espresso me variabla, në një ditë të mirë.",
  },
  {
    id: "easter_egg_sudo",
    intent: "easter_egg",
    weight: 0.5,
    text: "Permission denied: you're not in the sudoers file. This incident will be reported (to nobody, because I have no logs).",
    textSq:
      "Leje e refuzuar: nuk jeni në skedarin sudoers. Ky incident do të raportohet (te askush, sepse nuk kam regjistra).",
  },
  {
    id: "easter_egg_matrix",
    intent: "easter_egg",
    weight: 0.4,
    text: "There is no matrix. There is only the codebase. (Type 'matrix' in the terminal if you want the rain.)",
    textSq:
      "Nuk ka matrriks. Ka vetëm bazën e kodit. (Shkruani 'matrix' në terminal nëse doni shiun.)",
  },
];
