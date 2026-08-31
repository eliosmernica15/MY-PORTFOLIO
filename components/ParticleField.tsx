'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useDeviceProfile } from '@/hooks/useDeviceProfile';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { VERTEX_SHADER, FRAGMENT_SHADER } from './particle/shaders';

// Default to dark if the context isn't mounted for any reason.
const DEFAULT_THEME: 'dark' | 'light' = 'dark';

// Read the current theme from the DOM (set by the inline themeInitScript
// in app/layout.tsx and by the ThemeProvider effect). This avoids coupling
// to a specific context path and works whether or not ThemeProvider is mounted.
function readTheme(): 'dark' | 'light' {
  if (typeof document === 'undefined') return DEFAULT_THEME;
  const root = document.documentElement;
  const fromAttr = root.getAttribute('data-theme');
  if (fromAttr === 'dark' || fromAttr === 'light') return fromAttr;
  if (root.classList.contains('light')) return 'light';
  if (root.classList.contains('dark')) return 'dark';
  return DEFAULT_THEME;
}

/**
 * WebGL2 particle nebula for the hero section.
 * - Vanilla WebGL2, no dependencies.
 * - ~1500-3000 instanced point sprites, drifting via FBM noise.
 * - Mouse repels nearby particles, scroll produces a parallax tilt.
 * - Theme-aware: white particles in dark mode, near-black in light mode.
 * - Layered over the Spline scene (which remains the ambient base).
 *
 * The component is fully self-contained and renders nothing if WebGL2 is
 * unavailable, the user prefers reduced motion, or the device is too weak.
 */
const ParticleField: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Theme — read live from the DOM so it stays in sync with the provider
  // or the inline init script, with a dark default if neither is present.
  const [theme, setTheme] = useState<'dark' | 'light'>(DEFAULT_THEME);
  useEffect(() => {
    setTheme(readTheme());
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const observer = new MutationObserver(() => setTheme(readTheme()));
    observer.observe(root, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    });
    return () => observer.disconnect();
  }, []);

  const profile = useDeviceProfile();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (reducedMotion) return;
    if (!profile.enable3D) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // --- 1. WebGL2 detection ---
    const gl = (canvas.getContext('webgl2', {
      alpha: true,
      antialias: true,
      premultipliedAlpha: true,
    }) as WebGL2RenderingContext | null);
    if (!gl) return;

    // --- 2. Compile + link program ---
    const compile = (type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const log = gl.getShaderInfoLog(shader);
        // eslint-disable-next-line no-console
        console.warn('[ParticleField] shader compile error:', log);
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) {
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const log = gl.getProgramInfoLog(program);
      // eslint-disable-next-line no-console
      console.warn('[ParticleField] program link error:', log);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      return;
    }
    // Shaders can be detached + deleted now that the program is linked.
    gl.detachShader(program, vs);
    gl.detachShader(program, fs);
    gl.deleteShader(vs);
    gl.deleteShader(fs);

    gl.useProgram(program);

    // --- 3. Particle count (scales with CPU cores) ---
    const cores = navigator.hardwareConcurrency ?? 4;
    const N = cores <= 4 ? 1500 : cores <= 8 ? 2500 : 3000;

    // --- 4. Build particle buffer: vec3 position + float seed ---
    const stride = 4 * 4; // 3 floats position + 1 float seed, 4 bytes each
    const data = new Float32Array(N * 4);
    for (let i = 0; i < N; i++) {
      const i4 = i * 4;
      // Distribute positions in a unit cube, biased toward the XY plane.
      data[i4 + 0] = (Math.random() - 0.5) * 2.2; // x: [-1.1, 1.1]
      data[i4 + 1] = (Math.random() - 0.5) * 2.2; // y
      data[i4 + 2] = (Math.random() - 0.5) * 1.4; // z: [-0.7, 0.7]
      data[i4 + 3] = Math.random();               // seed
    }

    const buffer = gl.createBuffer();
    if (!buffer) {
      gl.deleteProgram(program);
      return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, 'aPosition');
    const aSeed = gl.getAttribLocation(program, 'aSeed');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, stride, 0);
    gl.enableVertexAttribArray(aSeed);
    gl.vertexAttribPointer(aSeed, 1, gl.FLOAT, false, stride, 12);

    // --- 5. Uniform locations ---
    const uTime = gl.getUniformLocation(program, 'uTime');
    const uMouse = gl.getUniformLocation(program, 'uMouse');
    const uMouseStrength = gl.getUniformLocation(program, 'uMouseStrength');
    const uResolution = gl.getUniformLocation(program, 'uResolution');
    const uScroll = gl.getUniformLocation(program, 'uScroll');
    const uTheme = gl.getUniformLocation(program, 'uTheme');
    const uPixelRatio = gl.getUniformLocation(program, 'uPixelRatio');

    // --- 6. Render state ---
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    // Premultiplied alpha: SRC_ONE, SRC_ONE_MINUS_ALPHA gives the "additive
    // glow" feel when colors are already multiplied by alpha.
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.DEPTH_TEST);

    // --- 7. Animation / interaction state ---
    const state = {
      mouseX: 0,
      mouseY: 0,
      mouseStrength: 0,
      scroll: 0,
      width: 0,
      height: 0,
      dpr: 1,
      visible: document.visibilityState === 'visible',
      inView: false,
      running: true,
      startTime: performance.now(),
    };
    let rafId = 0;

    const resize = (): void => {
      const parent = container.parentElement;
      const w = parent ? parent.clientWidth : window.innerWidth;
      const h = parent ? parent.clientHeight : window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      state.width = w;
      state.height = h;
      state.dpr = dpr;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    const onMouseMove = (e: MouseEvent): void => {
      const rect = container.getBoundingClientRect();
      // Normalize to clip space [-1, 1] with Y flipped (screen Y is down).
      const nx = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1);
      state.mouseX = Math.max(-1.5, Math.min(1.5, nx));
      state.mouseY = Math.max(-1.5, Math.min(1.5, ny));
      // Boost strength on activity.
      state.mouseStrength = Math.min(1.4, state.mouseStrength + 0.6);
    };

    const onMouseLeave = (): void => {
      state.mouseStrength = 0;
    };

    let scrollPending = false;
    const onScroll = (): void => {
      if (scrollPending) return;
      scrollPending = true;
      requestAnimationFrame(() => {
        scrollPending = false;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        state.scroll = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      });
    };

    const onVisibility = (): void => {
      state.visible = document.visibilityState === 'visible';
      if (state.visible && state.inView && !state.running) {
        state.running = true;
        rafId = requestAnimationFrame(frame);
      }
    };

    const onResize = (): void => resize();

    // --- 8. IntersectionObserver — only render when visible ---
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          state.inView = entry.isIntersecting;
          if (state.inView && state.visible && !state.running) {
            state.running = true;
            rafId = requestAnimationFrame(frame);
          } else if (!state.inView) {
            state.running = false;
            if (rafId) cancelAnimationFrame(rafId);
            rafId = 0;
          }
        }
      },
      { threshold: 0.01 }
    );
    observer.observe(container);

    // --- 9. Render loop ---
    const frame = (now: number): void => {
      if (!state.running) return;
      rafId = requestAnimationFrame(frame);

      const t = (now - state.startTime) / 1000;

      // Decay mouse strength smoothly so the field "relaxes".
      state.mouseStrength *= 0.94;

      gl.clear(gl.COLOR_BUFFER_BIT);

      if (uTime) gl.uniform1f(uTime, t);
      if (uMouse) gl.uniform2f(uMouse, state.mouseX, state.mouseY);
      if (uMouseStrength) gl.uniform1f(uMouseStrength, Math.max(0, Math.min(1.5, state.mouseStrength)));
      if (uScroll) gl.uniform1f(uScroll, state.scroll);
      if (uResolution) gl.uniform2f(uResolution, canvas.width, canvas.height);
      if (uPixelRatio) gl.uniform1f(uPixelRatio, state.dpr);
      if (uTheme) gl.uniform1f(uTheme, theme === 'light' ? 1.0 : 0.0);

      gl.drawArrays(gl.POINTS, 0, N);
    };

    rafId = requestAnimationFrame(frame);

    // --- 10. Event listeners ---
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    container.addEventListener('mouseleave', onMouseLeave);

    // --- 11. Cleanup ---
    return () => {
      state.running = false;
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      container.removeEventListener('mouseleave', onMouseLeave);

      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [profile.enable3D, reducedMotion, theme]);

  // Don't render anything if we won't animate.
  if (reducedMotion || !profile.enable3D) return null;

  return (
    <div
      ref={containerRef}
      className="webgl-canvas"
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        // Sit above the Spline scene, below the hero text.
        zIndex: 1,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default ParticleField;
