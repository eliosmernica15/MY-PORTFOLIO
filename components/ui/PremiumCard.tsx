import * as React from 'react';
import { cn } from '@/lib/cn';

export interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  padding?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
}

/**
 * PremiumCard — server-component compatible card wrapper.
 * All colors come from the design-system CSS variables in `app/globals.css`.
 */
export default function PremiumCard({
  children,
  className,
  hover = true,
  glow = false,
  padding = true,
  as: Tag = 'div',
}: PremiumCardProps) {
  const Component = Tag as React.ElementType;
  return (
    <Component
      className={cn(
        'premium-card',
        hover && 'premium-card-hover',
        glow && 'premium-card-glow',
        padding && 'premium-card-padded',
        className,
      )}
    >
      <div className="premium-card-inner">{children}</div>
    </Component>
  );
}

export { PremiumCard };
