export const SKILLS: string[] = [
  "React.Js",
  "Next.js",
  "Node.Js",
  ".NET",
  "Nest Js",
  "Angular",
  "React Native",
  "MySQL",
  "JavaScript",
  "TypeScript",
  "MongoDB",
  "MSSQl",
  "Github",
  "WordPress",
  "Firebase",
  "CSS",
  "HTML",
  "Python (AI/ML)",
  "Tailwind CSS",
  "Framer Motion",
];

// Evidence-based presentation: what Elios builds with, grouped by domain.
// No self-rated proficiency meters — names only.
export const SKILL_CATEGORIES: { name: string; skills: { name: string }[] }[] =
  [
    {
      name: "Languages",
      skills: [
        { name: "TypeScript" },
        { name: "JavaScript" },
        { name: "Python (AI/ML)" },
      ],
    },
    {
      name: "Frontend",
      skills: [
        { name: "React" },
        { name: "Next.js" },
        { name: "Tailwind CSS" },
        { name: "Framer Motion" },
      ],
    },
    {
      name: "Backend",
      skills: [
        { name: "Node.js" },
        { name: ".NET" },
        { name: "NestJS" },
        { name: "FastAPI" },
      ],
    },
    {
      name: "Data & AI",
      skills: [
        { name: "OpenAI / Anthropic APIs" },
        { name: "LangChain" },
        { name: "Vector databases" },
        { name: "Compilers & CIL" },
      ],
    },
    {
      name: "Infra & DevOps",
      skills: [
        { name: "Vercel / Netlify" },
        { name: "Network infrastructure" },
        { name: "Linux" },
      ],
    },
    {
      name: "Design",
      skills: [{ name: "Figma" }, { name: "UI/UX engineering" }],
    },
  ];
