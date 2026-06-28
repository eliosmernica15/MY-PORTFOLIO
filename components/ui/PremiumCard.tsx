import React, { memo } from 'react';

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  padding?: boolean;
}

const PremiumCard = memo(function PremiumCard({
  children,
  className = '',
  hover = true,
  glow = false,
  padding = true,
}: PremiumCardProps) {
  return (
    <div
      className={[
        'premium-card',
        hover ? 'premium-card-hover' : '',
        glow ? 'premium-card-glow' : '',
        padding ? 'premium-card-padded' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="premium-card-inner">{children}</div>
    </div>
  );
});

export default PremiumCard;
