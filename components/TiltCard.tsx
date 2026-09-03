import React, { useRef, memo } from 'react';
import { useDeviceProfile } from '../hooks/useDeviceProfile';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltStrength?: number;
}

const TiltCard = memo(function TiltCard({
  children,
  className = '',
  tiltStrength = 6,
}: TiltCardProps) {
  const profile = useDeviceProfile();
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);

  if (!profile.enableMagnetic) {
    return <div className={`relative ${className}`}>{children}</div>;
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!card) return;

    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      const rect = card.getBoundingClientRect();
      const xPos = (e.clientX - rect.left) / rect.width;
      const yPos = (e.clientY - rect.top) / rect.height;
      const rotateX = (yPos - 0.5) * -tiltStrength;
      const rotateY = (xPos - 0.5) * tiltStrength;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      if (glare) {
        glare.style.background = `radial-gradient(circle at ${xPos * 100}% ${yPos * 100}%, rgba(255,255,255,0.12), transparent 60%)`;
        glare.style.opacity = '1';
      }
    });
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    const glare = glareRef.current;
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    if (card) card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    if (glare) glare.style.opacity = '0';
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`tilt-card relative ${className}`}
    >
      {children}
      <div
        ref={glareRef}
        className="absolute inset-0 rounded-[2rem] pointer-events-none opacity-0 transition-opacity duration-300"
        aria-hidden
      />
    </div>
  );
});

export default TiltCard;
