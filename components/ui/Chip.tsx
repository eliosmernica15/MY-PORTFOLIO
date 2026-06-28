import React, { memo } from 'react';

interface ChipProps {
  children: React.ReactNode;
  className?: string;
}

const Chip = memo(function Chip({ children, className = '' }: ChipProps) {
  return <span className={`chip-enterprise ${className}`.trim()}>{children}</span>;
});

export default Chip;
