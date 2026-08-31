import * as React from 'react';
import { cn } from '@/lib/cn';

export interface ChipProps {
  children: React.ReactNode;
  className?: string;
  /** Render as a different tag (e.g. `<button>`). */
  as?: keyof React.JSX.IntrinsicElements;
  id?: string;
}

/**
 * Chip — server-component compatible small pill. All colors come from
 * the design-system variables in `app/globals.css` (`.chip-enterprise`).
 */
export default function Chip({ children, className, as: Tag = 'span', id }: ChipProps) {
  const Component = Tag as React.ElementType;
  return (
    <Component id={id} className={cn('chip-enterprise', className)}>
      {children}
    </Component>
  );
}

export { Chip };
