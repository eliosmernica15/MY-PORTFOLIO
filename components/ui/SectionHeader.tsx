import * as React from 'react';
import { cn } from '@/lib/cn';

export interface SectionHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
  id?: string;
}

/**
 * SectionHeader — server-component compatible. Renders an
 * eyebrow + title + subtitle block used at the top of every section.
 */
export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  className,
  id,
}: SectionHeaderProps) {
  return (
    <header
      id={id}
      className={cn(
        'section-header',
        align === 'center' && 'text-center mx-auto',
        className,
      )}
    >
      <span className="section-eyebrow">{eyebrow}</span>
      <h2 className="section-title">{title}</h2>
      {subtitle && (
        <p
          className={cn(
            'section-subtitle',
            align === 'center' ? 'max-w-2xl mx-auto' : 'max-w-2xl',
          )}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
}

export { SectionHeader };
