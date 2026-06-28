import React, { useRef, memo } from 'react';
import { getDeviceProfile } from '../hooks/useDeviceProfile';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

const profile = getDeviceProfile();

const MagneticButton = memo(function MagneticButton({
  children,
  className = '',
  strength = 0.3,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  if (!profile.enableMagnetic) {
    return <div className={className}>{children}</div>;
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const y = (e.clientY - (rect.top + rect.height / 2)) * strength;
    node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const handleMouseLeave = () => {
    const node = ref.current;
    if (!node) return;
    node.style.transform = 'translate3d(0, 0, 0)';
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`magnetic-wrap ${className}`.trim()}
    >
      {children}
    </div>
  );
});

export default MagneticButton;
