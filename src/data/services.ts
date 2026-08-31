export type Service = {
  id: string;
  title: string;
  desc: string;
  icon: string;
  number: string;
};

export const SERVICES: Service[] = [
  {
    id: 'responsive-design',
    title: 'Responsive Design',
    desc: 'Ensure your website looks great on every device. I build fluid, resilient layouts tailored for any screen size.',
    icon: 'MonitorSmartphone',
    number: '01',
  },
  {
    id: 'e-commerce',
    title: 'E-Commerce',
    desc: 'Elevate your business to the next level. I can showcase and sell your products on a custom, professional e-commerce platform.',
    icon: 'Store',
    number: '02',
  },
  {
    id: 'data-integration',
    title: 'Data Integration',
    desc: 'Seamlessly connect data to the user interface. I present complex information in an optimal, user-friendly format.',
    icon: 'Database',
    number: '03',
  },
  {
    id: 'full-stack-web',
    title: 'Full-Stack Web Creation',
    desc: 'Transform an idea into a real project. I oversee its development from zero to production, providing ongoing maintenance.',
    icon: 'Code',
    number: '04',
  },
];
