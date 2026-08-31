export type KnowledgeAction =
  | { type: 'scroll_to'; target: string }
  | { type: 'open_link'; target: string }
  | { type: 'open_route'; target: string };

export type KnowledgeEntry = {
  id: string;
  intent: string;
  weight: number;
  text: string;
  related?: string[];
  action?: KnowledgeAction;
};

export const KNOWLEDGE_STATIC: KnowledgeEntry[] = [
  { id: 'about_short', intent: 'about', weight: 1.0, text: "I'm Elios Mernica, a software engineer based in Vushtrri, Kosovo. I build AI systems, full-stack web platforms, and the network infrastructure that holds them up. I'm available for remote work worldwide.", related: ['projects', 'skills'] },
  { id: 'about_long', intent: 'about', weight: 0.9, text: "I work across the full stack — from React/TypeScript frontends to Node and Python backends, plus the network plumbing underneath. My current focus is AI systems: I've built a programming language in Albanian (A++(APL)) and an enterprise marketplace OS (ESMP). I treat every project as a production system, not a demo." },
  { id: 'contact_email', intent: 'contact', weight: 0.95, text: "Email me at eliosmernica@gmail.com or use the contact form below. I reply within 24 hours, Mon–Sat, GMT+1.", action: { type: 'scroll_to', target: '#contact' } },
  { id: 'contact_phone', intent: 'contact', weight: 0.6, text: "Phone: +383 (49) 363 163 — best reached by email first." },
  { id: 'availability', intent: 'availability', weight: 1.0, text: "I'm currently open to contract roles and select full-time opportunities. Remote-first; can align with EU, UK, and US Eastern time zones." },
  { id: 'rates', intent: 'rates', weight: 0.85, text: "My rate depends on scope and timeline. For a focused 2–6 week build, projects typically land in the €4,000–€15,000 range. For ongoing work, I prefer a monthly retainer. Email me with a brief and I'll send a quote." },
  { id: 'process', intent: 'process', weight: 0.9, text: "My process: (1) discovery call, 30 minutes, free; (2) a 1–2 page brief with scope, milestones, and price; (3) iterative build with weekly demos; (4) launch + 30 days of bug-fix support. No long contracts, no surprises." },
  { id: 'stack', intent: 'stack', weight: 0.95, text: "Frontend: React, Next.js, TypeScript, Tailwind, Framer Motion. Backend: Node, NestJS, Python, FastAPI, .NET. Data: PostgreSQL, MongoDB, Redis, Pinecone. Infra: Vercel, Netlify, Cloudflare, Linux. AI: OpenAI, Anthropic, custom RAG, vector search." },
  { id: 'ai_work', intent: 'ai', weight: 1.0, text: "AI is my current frontier. I've built a programming language compiler (A++(APL)), integrated LLM APIs into production products, and designed RAG pipelines. I'm most interested in agent systems, tool use, and AI-native UX." },
  { id: 'frontend', intent: 'frontend', weight: 0.9, text: "I build production-grade React and Next.js frontends. Recent work: ESMP (an enterprise marketplace OS), ForexPulse (a real-time trading platform with 50+ pairs), and FlixVerse (a Netflix-style streaming UI)." },
  { id: 'backend', intent: 'backend', weight: 0.85, text: "Backend: Node.js + Express/NestJS, Python + FastAPI, .NET for enterprise clients. I design for horizontal scaling, clean APIs, and clear observability." },
  { id: 'infrastructure', intent: 'infrastructure', weight: 0.85, text: "Network and infrastructure: I've run production deployments on Vercel/Netlify, configured edge networks and CDN rules, and have hands-on Linux experience. I treat the network as a first-class part of the stack." },
  { id: 'kosovo', intent: 'location', weight: 1.0, text: "I'm based in Vushtrri, Kosovo (Central Europe / GMT+1). I work fully remote and have shipped to clients in the US, UK, Germany, and the Balkans." },
  { id: 'cv_download', intent: 'cv', weight: 0.95, text: "You can download my CV using the 'Download CV' button on the Resume section, or directly at /Elios-Mernica-CV.pdf.", action: { type: 'open_link', target: '/Elios-Mernica-CV.pdf' } },
  { id: 'greeting', intent: 'greeting', weight: 1.0, text: "Hey — I'm Elios. Ask me about my work, my stack, or how to get in touch." },
  { id: 'thanks', intent: 'thanks', weight: 1.0, text: "Anytime. If you want to work together, the contact form is one click away." },
  { id: 'fallback', intent: 'fallback', weight: 1.0, text: "I'm not sure I have a direct answer for that. Try one of these instead: 'What do you do?', 'Are you available?', 'Show me your AI work', or 'How do we start?'." },
  { id: 'easter_egg_coffee', intent: 'easter_egg', weight: 0.5, text: "I run on espresso and well-named variables. The ratio is approximately 1:3, espresso to variables, on a good day." },
  { id: 'easter_egg_sudo', intent: 'easter_egg', weight: 0.5, text: "Permission denied: you're not in the sudoers file. This incident will be reported (to nobody, because I have no logs)." },
  { id: 'easter_egg_matrix', intent: 'easter_egg', weight: 0.4, text: "There is no matrix. There is only the codebase. (Type 'matrix' in the terminal if you want the rain.)" },
];
