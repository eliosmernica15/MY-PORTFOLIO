'use client';

import * as React from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { AdvancedButtonClient } from './AdvancedButtonClient';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

export interface AdvancedButtonOwnProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  /** Render as a Next.js internal link (preserves client-side navigation). */
  to?: string;
  /** Render as a plain anchor (`<a>`). */
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  className?: string;
  /** When true (default) the button is wrapped in a magnetic hover layer. */
  magnetic?: boolean;
  /** Marks the button as a full-width block. */
  fullWidth?: boolean;
  'aria-label'?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  target?: string;
  rel?: string;
}

const SIZE_CLASS: Record<Size, string> = {
  sm: 'btn-enterprise-sm',
  md: 'btn-enterprise-md',
  lg: 'btn-enterprise-lg',
};

const VARIANT_CLASS: Record<Variant, string> = {
  primary: 'btn-enterprise-primary',
  secondary: 'btn-enterprise-secondary',
  ghost: 'btn-enterprise-ghost',
};

function AdvancedButtonInner(props: AdvancedButtonOwnProps) {
  const {
    children,
    variant = 'primary',
    size = 'md',
    to,
    href,
    type = 'button',
    disabled = false,
    loading = false,
    icon,
    iconRight,
    className,
    onClick,
    target,
    rel,
    'aria-label': ariaLabel,
  } = props;

  const classes = cn(
    'btn-enterprise',
    'interactive-btn',
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    loading && 'btn-enterprise-loading',
    className,
  );

  const content = (
    <>
      <span className="btn-enterprise-shine" aria-hidden />
      {loading ? (
        <Loader2 size={16} className="btn-enterprise-spinner" aria-hidden />
      ) : (
        icon && <span className="btn-enterprise-icon">{icon}</span>
      )}
      <span className="btn-enterprise-label">{children}</span>
      {!loading && iconRight && <span className="btn-enterprise-icon">{iconRight}</span>}
    </>
  );

  if (to) {
    return (
      <Link
        href={to}
        className={classes}
        aria-label={ariaLabel}
        aria-busy={loading || undefined}
        data-cursor-hover
        onClick={onClick}
      >
        {content}
      </Link>
    );
  }

  if (href) {
    const isExternal = /^https?:\/\//i.test(href);
    return (
      <a
        href={href}
        className={classes}
        aria-label={ariaLabel}
        aria-busy={loading || undefined}
        target={target ?? (isExternal ? '_blank' : undefined)}
        rel={rel ?? (isExternal ? 'noopener noreferrer' : undefined)}
        data-cursor-hover
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      data-cursor-hover
    >
      {content}
    </button>
  );
}

/**
 * AdvancedButton — server-component compatible.
 * If `magnetic` is enabled, renders the client-side wrapper; otherwise the
 * button is fully static and SSR-friendly.
 */
export default function AdvancedButton(props: AdvancedButtonOwnProps) {
  const { magnetic = true, fullWidth = false, className } = props;

  if (!magnetic) {
    return <AdvancedButtonInner {...props} className={cn(fullWidth && 'w-full', className)} />;
  }

  return (
    <AdvancedButtonClient
      {...props}
      className={cn(fullWidth && 'w-full', className)}
    />
  );
}

export { AdvancedButton };
