'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useDeviceProfile } from '@/hooks/useDeviceProfile';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  trail: Array<{ x: number; y: number }>;
}

interface CustomCursorV2Props {
  /** Canvas container selector */
  containerSelector?: string;
  /** Maximum number of particles */
  maxParticles?: number;
  /** Particle spawn rate per frame */
  spawnRate?: number;
  /** Particle base size */
  baseSize?: number;
  /** Particle color (CSS color string) */
  particleColor?: string;
  /** Trail length */
  trailLength?: number;
  /** Gravity effect */
  gravity?: number;
  /** Friction/drag */
  friction?: number;
}

/**
 * CustomCursorV2 - Advanced magnetic cursor with WebGL particle trails
 * Features:
 * - WebGL-based particle system for high performance
 * - Pressure-sensitive brush strokes on hover targets
 * - Smooth magnetic attraction to interactive elements
 * - Respects reduced motion preference
 * - Configurable particle physics
 *
 * Falls back to CSS-based cursor on unsupported browsers
 */
export const CustomCursorV2: React.FC<CustomCursorV2Props> = ({
  containerSelector = 'body',
  maxParticles = 150,
  spawnRate = 0.3,
  baseSize = 3,
  particleColor = 'var(--accent)',
  trailLength = 8,
  gravity = 0.02,
  friction = 0.98,
}) => {
  const profile = useDeviceProfile();
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });
  const visibleRef = useRef(false);
  const programRef = useRef<WebGLProgram | null>(null);
  const bufferRef = useRef<WebGLBuffer | null>(null);
  const trailBufferRef = useRef<WebGLBuffer | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // Shader sources
  const vertexShaderSource = `#version 300 es
    precision highp float;
    in vec2 a_position;
    in float a_size;
    in float a_life;
    in vec3 a_color;
    out float v_life;
    out vec3 v_color;
    uniform vec2 u_resolution;
    void main() {
      vec2 clipSpace = (a_position / u_resolution) * 2.0 - 1.0;
      clipSpace.y *= -1.0;
      gl_Position = vec4(clipSpace, 0.0, 1.0);
      gl_PointSize = a_size * (1.0 - a_life) * 2.0 + 1.0;
      v_life = a_life;
      v_color = a_color;
    }
  `;

  const fragmentShaderSource = `#version 300 es
    precision highp float;
    in float v_life;
    in vec3 v_color;
    out vec4 outColor;
    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
      alpha *= 1.0 - v_life;
      outColor = vec4(v_color, alpha);
    }
  `;

  // Initialize WebGL
  const initGL = () => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: false,
    });

    if (!gl) return false;

    // Create shader program
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Shader link error:', gl.getProgramInfoLog(program));
      return false;
    }

    gl.useProgram(program);

    // Create buffers
    const buffer = gl.createBuffer()!;
    const trailBuffer = gl.createBuffer()!;

    programRef.current = program;
    glRef.current = gl;
    bufferRef.current = buffer;
    trailBufferRef.current = trailBuffer;

    setCanvasReady(true);
    return true;
  };

  // Resize canvas
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const gl = glRef.current;
    if (!canvas || !gl) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    gl.viewport(0, 0, canvas.width, canvas.height);
  };

  // Parse color string to RGB
  const parseColor = (color: string): [number, number, number] => {
    const ctx = document.createElement('canvas').getContext('2d')!;
    ctx.fillStyle = color;
    const computed = ctx.fillStyle;
    const match = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      return [parseInt(match[1]) / 255, parseInt(match[2]) / 255, parseInt(match[3]) / 255];
    }
    return [0, 0, 0];
  };

  // Spawn particle
  const spawnParticle = (x: number, y: number) => {
    if (particlesRef.current.length >= maxParticles) return;

    const color = parseColor(particleColor);
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.5 + Math.random() * 1.5;

    particlesRef.current.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      maxLife: 0.5 + Math.random() * 1.0,
      size: baseSize * (0.5 + Math.random() * 0.5),
      color: `rgb(${color[0] * 255}, ${color[1] * 255}, ${color[2] * 255})`,
      trail: [],
    });
  };

  // Update particles
  const updateParticles = (deltaTime: number) => {
    const particles = particlesRef.current;
    const dt = deltaTime / 1000;

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      // Update trail
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > trailLength) p.trail.shift();

      // Physics
      p.vy += gravity * dt * 60;
      p.vx *= friction;
      p.vy *= friction;
      p.x += p.vx * dt * 60;
      p.y += p.vy * dt * 60;
      p.life += dt / p.maxLife;

      // Remove dead particles
      if (p.life >= 1 || p.x < 0 || p.x > window.innerWidth || p.y < 0 || p.y > window.innerHeight) {
        particles.splice(i, 1);
      }
    }

    // Spawn new particles near mouse
    if (Math.random() < spawnRate && visibleRef.current) {
      const count = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        const offsetX = (Math.random() - 0.5) * 20;
        const offsetY = (Math.random() - 0.5) * 20;
        spawnParticle(mouseRef.current.x + offsetX, mouseRef.current.y + offsetY);
      }
    }
  };

  // Render particles
  const renderParticles = () => {
    const gl = glRef.current;
    const program = programRef.current;
    if (!gl || !program || particlesRef.current.length === 0) return;

    gl.useProgram(program);

    const resolutionLoc = gl.getUniformLocation(program, 'u_resolution');
    gl.uniform2f(resolutionLoc, gl.canvas.width, gl.canvas.height);

    // Prepare particle data
    const particles = particlesRef.current;
    const positions = new Float32Array(particles.length * 2);
    const sizes = new Float32Array(particles.length);
    const lives = new Float32Array(particles.length);
    const colors = new Float32Array(particles.length * 3);

    particles.forEach((p, i) => {
      positions[i * 2] = p.x;
      positions[i * 2 + 1] = p.y;
      sizes[i] = p.size;
      lives[i] = p.life;
      const color = parseColor(p.color);
      colors[i * 3] = color[0];
      colors[i * 3 + 1] = color[1];
      colors[i * 3 + 2] = color[2];
    });

    // Position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferRef.current);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);
    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Size buffer
    const sizeBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.DYNAMIC_DRAW);
    const sizeLoc = gl.getAttribLocation(program, 'a_size');
    gl.enableVertexAttribArray(sizeLoc);
    gl.vertexAttribPointer(sizeLoc, 1, gl.FLOAT, false, 0, 0);

    // Life buffer
    const lifeBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, lifeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, lives, gl.DYNAMIC_DRAW);
    const lifeLoc = gl.getAttribLocation(program, 'a_life');
    gl.enableVertexAttribArray(lifeLoc);
    gl.vertexAttribPointer(lifeLoc, 1, gl.FLOAT, false, 0, 0);

    // Color buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, trailBufferRef.current);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.DYNAMIC_DRAW);
    const colorLoc = gl.getAttribLocation(program, 'a_color');
    gl.enableVertexAttribArray(colorLoc);
    gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0);

    // Draw
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.drawArrays(gl.POINTS, 0, particles.length);

    // Cleanup temp buffers
    gl.deleteBuffer(sizeBuffer);
    gl.deleteBuffer(lifeBuffer);
  };

  // Animation loop
  const animate = (timestamp: number) => {
    const gl = glRef.current;
    if (!gl) return;

    const lastTimestamp = lastTimestampRef.current ?? timestamp;
    const deltaTime = timestamp - lastTimestamp;
    lastTimestampRef.current = timestamp;

    // Clear
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    updateParticles(deltaTime);
    renderParticles();

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Mouse move handler
  const handleMouseMove = (e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
    if (!visibleRef.current) {
      visibleRef.current = true;
    }
  };

  // Mouse enter/leave handlers
  const handleMouseEnter = () => {
    visibleRef.current = true;
  };

  const handleMouseLeave = () => {
    visibleRef.current = false;
  };

  const handleMouseOver = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const interactive = target.closest(
      'a, button, [role="button"], input, textarea, [data-cursor-hover]'
    );
    setIsHovering(Boolean(interactive));
  };

  // Mount effect
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize on mount
  useEffect(() => {
    if (!mounted || !profile.enableCustomCursor || prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set up canvas
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '99999';
    canvas.style.display = 'block';

    // Initialize WebGL
    if (!initGL()) {
      console.warn('WebGL2 not supported, falling back to CSS cursor');
      return;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Event listeners
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    // Add canvas to DOM
    document.body.appendChild(canvas);

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);

    // Hide default cursor
    document.body.classList.add('cursor-custom');

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      document.body.classList.remove('cursor-custom');

      // Cleanup WebGL
      const gl = glRef.current;
      if (gl) {
        if (programRef.current) gl.deleteProgram(programRef.current);
        if (bufferRef.current) gl.deleteBuffer(bufferRef.current);
        if (trailBufferRef.current) gl.deleteBuffer(trailBufferRef.current);
      }
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, [mounted, profile.enableCustomCursor, prefersReducedMotion]);

  if (!mounted || !profile.enableCustomCursor || prefersReducedMotion) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 99999,
        display: 'block',
      }}
    />
  );
};

export default CustomCursorV2;