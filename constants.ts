/* Projects with image paths like /name.png expect files in public/. See README "Required static assets". */
export const PERSONAL_INFO = {
  name: 'Elios Mernica',
  title: 'Software Engineer',
  summary: 'Software engineer specializing in web development, system design, and network infrastructure. Based in Kosovo, available worldwide.',
};

export const PROJECTS = [
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
  },
  {
    id: 'forexpulse',
    title: 'ForexPulse',
    category: 'Web Development',
    description: 'Trading platform for forex and prop with live rates, charts, tools, and dashboard.',
    longDescription:
      'ForexPulse is a trading platform built for forex and prop traders. It delivers real-time forex rates for 50+ pairs via the Frankfurter API, pair detail pages with full charts, a Tools page with pip value, position size calculator, and currency converter, plus a dashboard for portfolio snapshot and watchlist. The landing page and app share a dark, modern UI with amber accents—free to use, with optional sign-in for saving preferences.',
    image: '/forexpulse-hero.png',
    link: 'https://forexpulse-trading.vercel.app/',
    color: '#f59e0b',
    tech: ['HTML', 'JavaScript', 'Tailwind CSS', 'Frankfurter API', 'Vercel'],
    year: '2025',
  },
  {
    id: 'eltrix-cloud',
    title: 'Eltrix Cloud',
    category: 'Applications',
    description: 'AI-powered creative platform for content creation, file sharing, and digital asset management.',
    longDescription:
      'Eltrix Cloud is an all-in-one AI-powered platform that combines content creation, file sharing, and digital asset management into a seamless experience. It features AI-assisted content generation, secure cloud storage, real-time collaboration tools, and an intuitive dashboard for managing digital assets. The platform delivers a premium, immersive UI with 3D visuals and smooth interactions.',
    image: 'https://i.postimg.cc/VLP0pdyx/Eltrix-Cloud-AI-IMG.png',
    link: 'https://eltrixcloud.netlify.app/',
    color: '#7c3aed',
    tech: ['React', 'TypeScript', 'AI Integration', 'Cloud Storage', 'Tailwind CSS'],
    year: '2025',
  },
  {
    id: 'flixverse',
    title: 'FlixVerse',
    category: 'Web Development',
    description: 'A premium streaming platform with real-time content discovery and immersive UI.',
    longDescription:
      'FlixVerse is a full-featured streaming platform inspired by Netflix, built with a focus on performance and user experience. It features dynamic content carousels, real-time search with autocomplete, user authentication, watchlist management, and HD-ready video playback. The UI delivers a cinematic feel with smooth animations and responsive layouts across all devices.',
    image: 'https://i.postimg.cc/DZy2krtn/Screenshot-2026-03-14-201510.png',
    link: 'https://flixverse-streaming-pro.vercel.app/',
    color: '#e50914',
    tech: ['React', 'TypeScript', 'TMDB API', 'Tailwind CSS', 'Vercel'],
    year: '2025',
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
  },
];

export const EDUCATION = [
  {
    title: 'Unity Tech Hub',
    period: '2025 - Present',
    desc: 'Web Development',
  },
  {
    title: 'Isa Boletini - UBMI',
    period: '2025 - Present',
    desc: 'Computer Science',
  },
  {
    title: 'Course of Web and design developer',
    period: '2024 - 2026',
    desc: 'Innovation academy course, Web development directions.',
  },
  {
    title: 'Natural Science',
    period: '2022 - 2025',
    desc: 'High School "Eqrem Çabej"',
  },
  {
    title: 'Speaking Development',
    period: '2015 - 2024',
    desc: '"The Cambridge School" (Native Speaking "American English")',
  },
];

export const EXPERIENCE = [
  {
    company: 'Linkify',
    period: '2024',
    desc: 'English Speaking Support',
  },
];

export const SKILLS_PROGRESS = [
  { name: 'Web Developer', value: 90 },
  { name: 'Web Design', value: 50 },
  { name: 'IT Systems', value: 60 },
  { name: 'WordPress', value: 80 },
  { name: 'Application Development', value: 70 },
  { name: 'AI Engineer', value: 95 },
];

export const SKILLS = [
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

export const SERVICES = [
  {
    title: 'Responsive Design',
    desc: 'Ensure your website looks great on every device. I build fluid, resilient layouts tailored for any screen size.',
    icon: 'MonitorSmartphone',
    number: '01',
  },
  {
    title: 'E-Commerce',
    desc: 'Elevate your business to the next level. I can showcase and sell your products on a custom, professional e-commerce platform.',
    icon: 'Store',
    number: '02',
  },
  {
    title: 'Data Integration',
    desc: 'Seamlessly connect data to the user interface. I present complex information in an optimal, user-friendly format.',
    icon: 'Database',
    number: '03',
  },
  {
    title: 'Full-Stack Web Creation',
    desc: 'Transform an idea into a real project. I oversee its development from zero to production, providing ongoing maintenance.',
    icon: 'Code',
    number: '04',
  },
];

export const SOCIALS = [
  { name: 'GitHub', link: 'https://github.com/eliosmernica15', icon: 'Github' },
  { name: 'Instagram', link: 'https://www.instagram.com/e_mer03/', icon: 'Instagram' },
  { name: 'LinkedIn', link: 'https://www.linkedin.com/in/elios-mernica-880562204/', icon: 'Linkedin' },
];

export const TESTIMONIALS = [
  {
    name: 'Daniel Lewis',
    role: 'Director of Brand Strategy',
    text: "Elios was hired to create a corporate identity. It's modern, clean and with a beautiful design that got a lot of praises from colleagues and visitors. We were very pleased with the work done. He has a lot of experience and is very concerned about the needs of client.",
    avatar: 'https://i.postimg.cc/zGDHfn3G/avatar-1.png',
  },
  {
    name: 'Jessica Miller',
    role: 'Project Manager',
    text: 'Working with Elios has been an absolute pleasure. I was impressed with his attention to detail, his web design skills and his professional approach to our timelines and processes.',
    avatar: 'https://i.postimg.cc/DwY0yHtx/avatar-2.png',
  },
  {
    name: 'Emily Evans',
    role: 'Marketing Manager',
    text: "I couldn't be happier with the website that Elios created for us. His attention to detail and creativity is unmatched. Our clients frequently compliment the design, and it has significantly improved our brand image.",
    avatar: 'https://i.postimg.cc/fRFWhX9F/avatar-3.png',
  },
  {
    name: 'Henry Williams',
    role: 'Business Owner',
    text: "I was overwhelmed with the thought of redesigning my online store, but Elios made the process seamless. The site is not only visually appealing but also optimized for conversions. I've seen a 50% increase in traffic since the launch!",
    avatar: 'https://i.postimg.cc/zXv1Xv81/avatar-4.png',
  },
];

export const CONTACT_INFO = {
  email: 'eliosmernica@gmail.com',
  phone: '+383 (49) 363 163',
  birthday: 'March 15, 2007',
  location: 'Vushtrri, Kosovo',
};

export const CASE_STUDIES = [
  {
    title: 'EM Motors: A Modern Car Presentation Platform',
    category: 'Web Development',
    date: '2026',
    challenge: 'Design and develop a responsive and visually appealing car dealership website with a focus on user experience.',
    solution: 'Built a custom interface using HTML, CSS, JavaScript, and Bootstrap. Implemented dynamic vehicle loading and mobile-first patterns.',
    result: 'A sleek, fast, and interactive platform that effectively displays cars and engages potential customers.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Bootstrap'],
    img: 'https://i.postimg.cc/W3kCFhRg/Screenshot-2026-03-14-205330.png',
  },
  {
    title: 'ForexPulse: A Trading Platform for Forex & Prop',
    category: 'Web Development',
    date: '2025',
    challenge: 'Build a single place for traders to view live rates, open charts, and manage a dashboard.',
    solution: 'Built a multi-page app with Tailwind CSS and Frankfurter API. Implemented pip value and position size calculators.',
    result: 'A focused trading platform with 50+ pairs and live rates in one place.',
    tech: ['HTML', 'JavaScript', 'Tailwind CSS', 'Frankfurter API'],
    img: '/forexpulse-hero.png',
  },
  {
    title: 'Eltrix Cloud: AI-Powered Creative Platform',
    category: 'Applications',
    date: '2025',
    challenge: 'Build an all-in-one platform for AI content creation and file sharing.',
    solution: 'Developed a React application with AI integration and secure cloud storage.',
    result: 'A polished platform that streamlines digital workflows with AI tools.',
    tech: ['React', 'TypeScript', 'AI Integration'],
    img: 'https://i.postimg.cc/VLP0pdyx/Eltrix-Cloud-AI-IMG.png',
  },
  {
    title: 'FlixVerse: Building a Premium Streaming Experience',
    category: 'Web Development',
    date: '2025',
    challenge: 'Create a cinematic streaming platform with real-time content discovery.',
    solution: 'Built with React and leveraging the TMDB API. Implemented dynamic carousels and instant search.',
    result: 'A performant streaming UI with a premium feel across all devices.',
    tech: ['React', 'TypeScript', 'TMDB API'],
    img: 'https://i.postimg.cc/wjCXkDWx/projectimg3.png',
  },
];

export const STATS = [
  { value: 12, suffix: '+', label: 'Projects Completed' },
  { value: 3, suffix: '+', label: 'Years Experience' },
  { value: 15, suffix: '+', label: 'Happy Clients' },
  { value: 8, suffix: '+', label: 'Skills Mastered' },
];
