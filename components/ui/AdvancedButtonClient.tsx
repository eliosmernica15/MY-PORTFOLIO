'use client';

import * as React from 'react';
import { useRef } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { getDeviceProfile } from '@/hooks/useDeviceProfile';
import type { AdvancedButtonOwnProps } from './AdvancedButton';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

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

const profile = getDeviceProfile();

/**
 * Client-only variant of AdvancedButton that adds a magnetic hover effect.
 * Imported internally by the default `AdvancedButton` export when
 * `magnetic` is true.
 */
export function AdvancedButtonClient(props: AdvancedButtonOwnProps) {
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

  const wrapRef = useRef<HTMLDivElement>(null);

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

  const isFullWidth = className?.includes('w-full') ?? false;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!profile.enableMagnetic) return;
    const node = wrapRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const strength = 0.12;
    const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const y = (e.clientY - (rect.top + rect.height / 2)) * strength;
    node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const handleMouseLeave = () => {
    if (!profile.enableMagnetic) return;
    const node = wrapRef.current;
    if (!node) return;
    node.style.transform = 'translate3d(0, 0, 0)';
  };

  const inner = to ? (
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
  ) : href ? (
    <a
      href={href}
      className={classes}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      target={target ?? (/^https?:\/\//i.test(href) ? '_blank' : undefined)}
      rel={rel ?? (/^https?:\/\//i.test(href) ? 'noopener noreferrer' : undefined)}
      data-cursor-hover
      onClick={onClick}
    >
      {content}
    </a>
  ) : (
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

  if (!profile.enableMagnetic) {
    return <div className={cn(isFullWidth && 'w-full')}>{inner}</div>;
  }

  return (
    <div
      ref={wrapRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn('magnetic-wrap', isFullWidth && 'w-full')}
    >
      {inner}
    </div>
  );
}
