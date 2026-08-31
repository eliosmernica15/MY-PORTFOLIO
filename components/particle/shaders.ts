// GLSL ES 3.00 shaders for the WebGL2 particle nebula.
// Vanilla WebGL2 — no three.js, no extra dependencies.

export const VERTEX_SHADER = /* glsl */ `#version 300 es
precision highp float;

// Per-vertex attributes
in vec3 aPosition; // base position in a unit cube (x,y in NDC, z in [-1,1])
in float aSeed;    // per-particle random seed [0,1]

// Uniforms
uniform float uTime;
uniform vec2 uMouse;          // mouse position in clip space ([-1,1])
uniform float uMouseStrength; // current repulsion strength (decays over time)
uniform vec2 uResolution;     // canvas size in pixels (post-DPR)
uniform float uScroll;        // normalized scroll progress [0,1]
uniform float uTheme;         // 0 = dark, 1 = light
uniform float uPixelRatio;    // device pixel ratio (capped at 1.5)

// Varyings to fragment shader
out float vAlpha;
out float vSeed;
out float vDistFromCenter;

// --- Hash & noise helpers ---
float hash(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(
      mix(hash(i + vec3(0.0, 0.0, 0.0)), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
      mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x),
      f.y
    ),
    mix(
      mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
      mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x),
      f.y
    ),
    f.z
  );
}

float fbm(vec3 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  // --- 1. Base position with FBM displacement ---
  float t = uTime * 0.05;
  vec3 disp = vec3(
    fbm(aPosition * 0.5 + vec3(t, 0.0, 0.0)),
    fbm(aPosition * 0.5 + vec3(100.0, t, 0.0)),
    fbm(aPosition * 0.5 + vec3(200.0, 0.0, t))
  ) * 0.6;

  vec3 pos = aPosition + disp;

  // --- 2. Mouse repulsion (push particles outward from cursor) ---
  // uMouse is in clip space ([-1,1]); aPosition.xy is in the same range.
  vec2 toMouse = pos.xy - uMouse;
  float mouseDist = length(toMouse);
  float repelRadius = 0.18; // ~120px radius in normalized space at typical view
  if (mouseDist < repelRadius && uMouseStrength > 0.001) {
    float falloff = 1.0 - smoothstep(0.0, repelRadius, mouseDist);
    vec2 pushDir = (mouseDist > 0.0001) ? normalize(toMouse) : vec2(0.0, 1.0);
    pos.xy += pushDir * falloff * 0.35 * uMouseStrength;
    pos.z += falloff * 0.2 * uMouseStrength * (aSeed - 0.5);
  }

  // --- 3. Scroll tilt (slight rotation around the X axis) ---
  float tilt = (uScroll - 0.5) * 0.4; // ~±0.2 rad
  float c = cos(tilt);
  float s = sin(tilt);
  pos.yz = mat2(c, -s, s, c) * pos.yz;

  // --- 4. Project to clip space ---
  gl_Position = vec4(pos.xy, pos.z * 0.6, 1.0);

  // --- 5. Per-particle point size, scaled by depth and pixel ratio ---
  float baseSize = 1.5 + aSeed * 3.5; // [1.5, 5.0]
  float depth = max(0.4, 1.0 - gl_Position.w * 0.0 + (1.0 - pos.z) * 0.4);
  float pxSize = baseSize * depth * uPixelRatio;
  gl_PointSize = clamp(pxSize, 1.0, 8.0);

  // --- 6. Varyings for fragment shader ---
  vSeed = aSeed;

  // Alpha: subtle, deeper particles slightly dimmer
  vAlpha = 0.32 + 0.18 * aSeed;
  // Mouse proximity adds a soft highlight near the cursor
  vAlpha += falloff * 0.0; // (intentionally no extra flicker)

  // Distance from screen center for vignette tint
  vec2 ndc = pos.xy;
  vDistFromCenter = length(ndc);
}
`;

export const FRAGMENT_SHADER = /* glsl */ `#version 300 es
precision highp float;

in float vAlpha;
in float vSeed;
in float vDistFromCenter;

uniform float uTheme; // 0 = dark, 1 = light

out vec4 fragColor;

void main() {
  // Soft circular point sprite
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;

  float core = smoothstep(0.5, 0.0, d);
  // Add a bright center for a touch of life
  float hot = smoothstep(0.18, 0.0, d) * 0.6;
  float a = (core * 0.85 + hot) * vAlpha;

  // Particle color: white in dark mode, near-black in light mode
  vec3 colDark = vec3(1.0);
  vec3 colLight = vec3(0.06);
  vec3 color = mix(colDark, colLight, uTheme);

  // Subtle hue variation driven by per-particle seed (cool blue → warm)
  vec3 tint = mix(vec3(0.75, 0.85, 1.0), vec3(1.0, 0.9, 0.8), vSeed);
  color *= mix(vec3(1.0), tint, 0.18);

  // Vignette: fade out particles further from screen center
  float vignette = 1.0 - smoothstep(0.55, 1.25, vDistFromCenter);
  a *= vignette;

  // Output with premultiplied alpha (renderer uses premultipliedAlpha: true)
  fragColor = vec4(color * a, a);
}
`;
