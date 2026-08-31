export type Skill = {
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
};

export const SKILLS: string[] = [
  'React.Js',
  'Next.js',
  'Node.Js',
  '.NET',
  'Nest Js',
  'Angular',
  'React Native',
  'MySQL',
  'JavaScript',
  'TypeScript',
  'MongoDB',
  'MSSQl',
  'Github',
  'WordPress',
  'Firebase',
  'CSS',
  'HTML',
  'Python (AI/ML)',
  'Tailwind CSS',
  'Framer Motion',
];

export const SKILL_CATEGORIES: { name: string; skills: Skill[] }[] = [
  {
    name: 'Languages',
    skills: [
      { name: 'TypeScript', level: 5 },
      { name: 'JavaScript', level: 5 },
      { name: 'Python (AI/ML)', level: 4 },
    ],
  },
  {
    name: 'Frontend',
    skills: [
      { name: 'React', level: 5 },
      { name: 'Next.js', level: 4 },
      { name: 'Tailwind CSS', level: 5 },
      { name: 'Framer Motion', level: 4 },
    ],
  },
  {
    name: 'Backend',
    skills: [
      { name: 'Node.js', level: 4 },
      { name: '.NET', level: 3 },
      { name: 'NestJS', level: 3 },
      { name: 'FastAPI', level: 3 },
    ],
  },
  {
    name: 'Data & AI',
    skills: [
      { name: 'OpenAI / Anthropic APIs', level: 5 },
      { name: 'LangChain', level: 3 },
      { name: 'Vector databases', level: 3 },
      { name: 'Compilers & CIL', level: 4 },
    ],
  },
  {
    name: 'Infra & DevOps',
    skills: [
      { name: 'Vercel / Netlify', level: 5 },
      { name: 'Network infrastructure', level: 4 },
      { name: 'Linux', level: 3 },
    ],
  },
  {
    name: 'Design',
    skills: [
      { name: 'Figma', level: 4 },
      { name: 'UI/UX engineering', level: 5 },
    ],
  },
];
