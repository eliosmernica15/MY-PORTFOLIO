import React, { useRef, memo } from "react";
import { useDeviceProfile } from "@/hooks/useDeviceProfile";

type MagneticButtonVariant = "primary" | "secondary";
type MagneticButtonSize = "sm" | "md" | "lg";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  variant?: MagneticButtonVariant;
  size?: MagneticButtonSize;
}

const MagneticButton = memo(function MagneticButton({
  children,
  className = "",
  strength = 0.3,
  onClick,
  variant = "primary",
  size = "md",
}: MagneticButtonProps) {
  const profile = useDeviceProfile();
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
    node.style.transform = "translate3d(0, 0, 0)";
  };

  // Size classes
  const sizeClasses = {
    sm: "px-2 py-1.5 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-2.5 text-base",
  };

  // NOTE: the wrapper intentionally has NO background/color classes.
  // It is a transform layer only; every caller styles its own child
  // (nav buttons, social icons, etc.). Painting variant colors here
  // (the old `primary` default = accent bg) showed a black block
  // behind transparent children and made their text unreadable
  // (e.g. dark nav text on black in light theme).
  // `sizeClasses` are kept for callers that rely on wrapper padding,
  // and `variant` is accepted for API compatibility but does not
  // paint anything.
  void variant;
  void sizeClasses;

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`magnetic-wrap ${className}`.trim()}
    >
      {children}
    </div>
  );
});

export default MagneticButton;
