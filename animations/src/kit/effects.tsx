import React, { useMemo } from "react";
import * as THREE from "three";
import { X, type XProps } from "./context";
import { hexToRgb } from "./style";

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const useShader = (frag: string, uniforms: Record<string, THREE.IUniform>, additive = false) =>
  useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: frag,
        uniforms,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [frag, additive],
  );

const v3 = (hex: string) => new THREE.Vector3(...hexToRgb(hex));

const plane = new THREE.PlaneGeometry(1, 1);

// ---------------------------------------------------------------------------

const GRADIENT_FRAG = /* glsl */ `
varying vec2 vUv;
uniform vec3 uC[4];
uniform float uP[4];
uniform int uN;
void main() {
  float t = 1.0 - vUv.y; // 0 at top
  vec3 col = uC[0];
  for (int i = 1; i < 4; i++) {
    if (i >= uN) break;
    float k = clamp((t - uP[i - 1]) / max(uP[i] - uP[i - 1], 1e-5), 0.0, 1.0);
    if (t >= uP[i - 1]) col = mix(uC[i - 1], uC[i], k);
  }
  gl_FragColor = vec4(col, 1.0);
}`;

export type GradientProps = XProps & {
  w: number;
  h: number;
  /** [position 0 (top) .. 1 (bottom), color] — up to 4 stops. */
  stops: [number, string][];
};

/** Vertical gradient rectangle (skies, walls, light falloff). */
export const Gradient: React.FC<GradientProps> = ({ w, h, stops, ...xf }) => {
  const mat = useShader(GRADIENT_FRAG, {
    uC: { value: [v3("#000"), v3("#000"), v3("#000"), v3("#000")] },
    uP: { value: [0, 1, 1, 1] },
    uN: { value: 2 },
  });
  const s = stops.slice(0, 4);
  s.forEach(([p, c], i) => {
    (mat.uniforms.uC.value as THREE.Vector3[])[i].set(...hexToRgb(c));
    (mat.uniforms.uP.value as number[])[i] = p;
  });
  mat.uniforms.uN.value = s.length;
  return (
    <X {...xf}>
      <mesh geometry={plane} material={mat} scale={[w, h, 1]} frustumCulled={false} />
    </X>
  );
};

// ---------------------------------------------------------------------------

const GLOW_FRAG = /* glsl */ `
varying vec2 vUv;
uniform vec3 uColor;
uniform float uAlpha;
uniform float uInner;
uniform float uPower;
void main() {
  float r = length(vUv - 0.5) * 2.0;
  float a = 1.0 - smoothstep(uInner, 1.0, r);
  a = pow(a, uPower) * uAlpha;
  gl_FragColor = vec4(uColor, a);
}`;

export type GlowProps = XProps & {
  rx: number;
  ry?: number;
  color: string;
  alpha?: number;
  /** 0..1, radius where the falloff starts. */
  inner?: number;
  power?: number;
  additive?: boolean;
};

/** Soft radial light / haze. */
export const Glow: React.FC<GlowProps> = ({
  rx,
  ry,
  color,
  alpha = 0.5,
  inner = 0,
  power = 1.6,
  additive = false,
  ...xf
}) => {
  const mat = useShader(
    GLOW_FRAG,
    {
      uColor: { value: v3(color) },
      uAlpha: { value: alpha },
      uInner: { value: inner },
      uPower: { value: power },
    },
    additive,
  );
  (mat.uniforms.uColor.value as THREE.Vector3).set(...hexToRgb(color));
  mat.uniforms.uAlpha.value = alpha;
  mat.uniforms.uInner.value = inner;
  mat.uniforms.uPower.value = power;
  return (
    <X {...xf}>
      <mesh geometry={plane} material={mat} scale={[rx * 2, (ry ?? rx) * 2, 1]} frustumCulled={false} />
    </X>
  );
};

/** Soft contact shadow under feet and props. */
export const GroundShadow: React.FC<XProps & { w: number; h?: number; alpha?: number; color?: string }> = ({
  w,
  h,
  alpha = 0.28,
  color = "#1a1014",
  ...xf
}) => <Glow rx={w / 2} ry={(h ?? w * 0.16) / 2} color={color} alpha={alpha} inner={0.55} power={1} {...xf} />;

// ---------------------------------------------------------------------------

const CONE_FRAG = /* glsl */ `
varying vec2 vUv;
uniform vec3 uColor;
uniform float uAlpha;
uniform float uTop;
void main() {
  float y = 1.0 - vUv.y;            // 0 at the lamp, 1 at the bottom
  float hw = mix(uTop, 1.0, y) * 0.5;
  float x = abs(vUv.x - 0.5);
  float side = 1.0 - smoothstep(hw * 0.7, hw, x);
  float fall = pow(1.0 - y, 1.3);
  gl_FragColor = vec4(uColor, uAlpha * side * fall);
}`;

export type LightConeProps = XProps & { w: number; h: number; top?: number; color?: string; alpha?: number };

/** Light cone from a hanging lamp; origin is at the lamp. */
export const LightCone: React.FC<LightConeProps> = ({ w, h, top = 0.25, color = "#fff2c6", alpha = 0.22, ...xf }) => {
  const mat = useShader(CONE_FRAG, { uColor: { value: v3(color) }, uAlpha: { value: alpha }, uTop: { value: top } });
  (mat.uniforms.uColor.value as THREE.Vector3).set(...hexToRgb(color));
  mat.uniforms.uAlpha.value = alpha;
  mat.uniforms.uTop.value = top;
  return (
    <X {...xf}>
      <mesh geometry={plane} material={mat} position={[0, -h / 2, 0]} scale={[w, h, 1]} frustumCulled={false} />
    </X>
  );
};

// ---------------------------------------------------------------------------

const VIGNETTE_FRAG = /* glsl */ `
varying vec2 vUv;
uniform vec3 uColor;
uniform float uStrength;
uniform float uAspect;
uniform float uSeed;
uniform float uGrain;
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233)) + uSeed * 7.31) * 43758.5453); }
void main() {
  vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
  float d = length(p) / length(vec2(uAspect, 1.0) * 0.5);
  float a = uStrength * smoothstep(0.22, 1.08, d);
  float g = (hash(floor(gl_FragCoord.xy)) - 0.5) * uGrain;
  // dark edges + a little film grain (light or dark speckle)
  float ga = abs(g);
  vec3 grainCol = g > 0.0 ? vec3(1.0) : vec3(0.0);
  float outA = a + ga * (1.0 - a);
  vec3 outC = (uColor * a + grainCol * ga * (1.0 - a)) / max(outA, 1e-4);
  gl_FragColor = vec4(outC, outA);
}`;

const WASH_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uAlpha;
void main() { gl_FragColor = vec4(uColor, uAlpha); }`;

/** Screen-space vignette + grain. Place outside the camera group. */
export const Vignette: React.FC<{
  width: number;
  height: number;
  strength?: number;
  color?: string;
  grain?: number;
  seed?: number;
}> = ({ width, height, strength = 0.55, color = "#1a1012", grain = 0.04, seed = 0 }) => {
  const mat = useShader(VIGNETTE_FRAG, {
    uColor: { value: v3(color) },
    uStrength: { value: strength },
    uAspect: { value: width / height },
    uSeed: { value: seed },
    uGrain: { value: grain },
  });
  (mat.uniforms.uColor.value as THREE.Vector3).set(...hexToRgb(color));
  mat.uniforms.uStrength.value = strength;
  mat.uniforms.uAspect.value = width / height;
  mat.uniforms.uSeed.value = seed;
  mat.uniforms.uGrain.value = grain;
  return <mesh geometry={plane} material={mat} position={[0, 0, 450]} scale={[width, height, 1]} frustumCulled={false} />;
};

/** Full-frame color wash (fades to black, flashes, night tint). */
export const Wash: React.FC<{ width: number; height: number; color?: string; alpha: number; z?: number }> = ({
  width,
  height,
  color = "#000000",
  alpha,
  z = 460,
}) => {
  const mat = useShader(WASH_FRAG, { uColor: { value: v3(color) }, uAlpha: { value: alpha } });
  (mat.uniforms.uColor.value as THREE.Vector3).set(...hexToRgb(color));
  mat.uniforms.uAlpha.value = alpha;
  return <mesh geometry={plane} material={mat} position={[0, 0, z]} scale={[width * 1.5, height * 1.5, 1]} frustumCulled={false} />;
};
