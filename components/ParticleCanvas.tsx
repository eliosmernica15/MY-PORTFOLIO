import React, { useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getDeviceProfile } from '../hooks/useDeviceProfile';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

const profile = getDeviceProfile();

const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (profile.prefersReducedMotion || !profile.enableHeavyEffects) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationId = 0;
    let width = 0;
    let height = 0;
    let visible = document.visibilityState === 'visible';
    const particles: Particle[] = [];

    const particleColor = isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.2)';

    const getParticleConfig = () => {
      const w = window.innerWidth;
      if (profile.isLowPower) {
        if (w < 640) return { numParticles: 10, connectionDistance: 65 };
        if (w < 1024) return { numParticles: 14, connectionDistance: 80 };
        return { numParticles: 18, connectionDistance: 95 };
      }
      if (w < 640) return { numParticles: 18, connectionDistance: 85 };
      if (w < 1024) return { numParticles: 28, connectionDistance: 100 };
      return { numParticles: 36, connectionDistance: 120 };
    };

    const { numParticles, connectionDistance } = getParticleConfig();

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seedParticles = () => {
      particles.length = 0;
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          size: Math.random() * 1.5 + 0.6,
        });
      }
    };

    resize();
    seedParticles();

    const onVisibility = () => {
      visible = document.visibilityState === 'visible';
      if (visible && animationId === 0) animationId = requestAnimationFrame(animate);
    };

    const animate = () => {
      if (!visible) {
        animationId = 0;
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;
          const maxDist = connectionDistance;
          if (distSq < maxDist * maxDist) {
            const dist = Math.sqrt(distSq);
            const alpha = (isDark ? 0.08 : 0.05) * (1 - dist / maxDist);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = isDark ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [isDark]);

  if (profile.prefersReducedMotion || !profile.enableHeavyEffects) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full gpu-layer"
      style={{ opacity: 0.45 }}
      aria-hidden="true"
    />
  );
};

export default ParticleCanvas;
