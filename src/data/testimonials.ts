export type Testimonial = {
  name: string;
  role: string;
  text: string;
  avatar: string;
  company?: string;
  linkedinUrl?: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Daniel Lewis',
    role: 'Director of Brand Strategy',
    company: 'Northwind Studio',
    linkedinUrl: 'https://www.linkedin.com/in/example-daniel-lewis',
    text: "Elios was hired to create a corporate identity. It's modern, clean and with a beautiful design that got a lot of praises from colleagues and visitors. We were very pleased with the work done. He has a lot of experience and is very concerned about the needs of client.",
    avatar: 'https://i.postimg.cc/zGDHfn3G/avatar-1.png',
  },
  {
    name: 'Jessica Miller',
    role: 'Project Manager',
    company: 'Helios Agency',
    text: 'Working with Elios has been an absolute pleasure. I was impressed with his attention to detail, his web design skills and his professional approach to our timelines and processes.',
    avatar: 'https://i.postimg.cc/DwY0yHtx/avatar-2.png',
  },
  {
    name: 'Emily Evans',
    role: 'Marketing Manager',
    company: 'Vermilion & Co.',
    linkedinUrl: 'https://www.linkedin.com/in/example-emily-evans',
    text: "I couldn't be happier with the website that Elios created for us. His attention to detail and creativity is unmatched. Our clients frequently compliment the design, and it has significantly improved our brand image.",
    avatar: 'https://i.postimg.cc/fRFWhX9F/avatar-3.png',
  },
  {
    name: 'Henry Williams',
    role: 'Business Owner',
    company: 'Williams Goods',
    text: "I was overwhelmed with the thought of redesigning my online store, but Elios made the process seamless. The site is not only visually appealing but also optimized for conversions. I've seen a 50% increase in traffic since the launch!",
    avatar: 'https://i.postimg.cc/zXv1Xv81/avatar-4.png',
  },
];
