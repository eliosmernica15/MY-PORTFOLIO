import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import MagneticButton from '../MagneticButton';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface AdvancedButtonProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  onClick?: () => void;
  href?: string;
  to?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  className?: string;
  magnetic?: boolean;
  'aria-label'?: string;
}

const sizeClass: Record<Size, string> = {
  sm: 'btn-enterprise-sm',
  md: 'btn-enterprise-md',
  lg: 'btn-enterprise-lg',
};

const variantClass: Record<Variant, string> = {
  primary: 'btn-enterprise-primary',
  secondary: 'btn-enterprise-secondary',
  ghost: 'btn-enterprise-ghost',
};

const AdvancedButton = memo(function AdvancedButton({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  href,
  to,
  type = 'button',
  disabled = false,
  loading = false,
  icon,
  iconRight,
  className = '',
  magnetic = true,
  'aria-label': ariaLabel,
}: AdvancedButtonProps) {
  const classes = [
    'btn-enterprise',
    'interactive-btn',
    variantClass[variant],
    sizeClass[size],
    loading ? 'btn-enterprise-loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      <span className="btn-enterprise-shine" aria-hidden />
      {loading ? (
        <Loader2 size={16} className="btn-enterprise-spinner" />
      ) : (
        icon && <span className="btn-enterprise-icon">{icon}</span>
      )}
      <span className="btn-enterprise-label">{children}</span>
      {!loading && iconRight && <span className="btn-enterprise-icon">{iconRight}</span>}
    </>
  );

  const node = to ? (
    <Link to={to} className={classes} aria-label={ariaLabel} data-cursor-hover>
      {content}
    </Link>
  ) : href ? (
    <a
      href={href}
      className={classes}
      aria-label={ariaLabel}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      data-cursor-hover
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
      aria-busy={loading}
      data-cursor-hover
    >
      {content}
    </button>
  );

  if (!magnetic) return node;
  return (
    <MagneticButton strength={0.12} className={className.includes('w-full') ? 'w-full' : ''}>
      {node}
    </MagneticButton>
  );
});

export default AdvancedButton;
