import * as THREE from "three";

/** Warm near-black used for every outline, like the reference illustrations. */
export const INK = "#2b2320";
/** Key light direction (world space): upper-right-front, so shadows fall lower-left. */
export const LIGHT_DIR = new THREE.Vector3(0.75, 0.6, 0.4).normalize();
/** Default outline thickness in world units. */
export const OUTLINE = 0.022;

const NOISE_GLSL = /* glsl */ `
float hash13(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 31.32);
  return fract((p3.x + p3.y) * p3.z);
}
float vnoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash13(i), hash13(i + vec3(1, 0, 0)), f.x),
        mix(hash13(i + vec3(0, 1, 0)), hash13(i + vec3(1, 1, 0)), f.x), f.y),
    mix(mix(hash13(i + vec3(0, 0, 1)), hash13(i + vec3(1, 0, 1)), f.x),
        mix(hash13(i + vec3(0, 1, 1)), hash13(i + vec3(1, 1, 1)), f.x), f.y),
    f.z);
}
float specks(vec3 p) {
  vec3 c = floor(p);
  vec3 o = vec3(hash13(c + 7.1), hash13(c + 3.7), hash13(c + 1.3));
  float d = length(fract(p) - o);
  return step(0.85, hash13(c)) * (1.0 - smoothstep(0.08, 0.14, d));
}
`;

/** Shared atmospheric haze: far objects fade toward the sky color, like the painted backdrops. */
export const HAZE = {
  uHazeColor: { value: new THREE.Color("#f1dcae") },
  uHazeNear: { value: 12 },
  uHazeFar: { value: 45 },
  uHazeMax: { value: 0.6 },
};

export const setHaze = (color: string, near: number, far: number, max: number) => {
  HAZE.uHazeColor.value.set(color);
  HAZE.uHazeNear.value = near;
  HAZE.uHazeFar.value = far;
  HAZE.uHazeMax.value = max;
};

/**
 * Shared look switches. Default = bold cartoon (LastSoldier). `setStyle` with
 * hatch > 0 gives an optional colored-pencil look: hatched fills, softer
 * shadows, navy wobbly outlines that "boil" a little every few frames.
 */
export const STYLE = {
  uHatch: { value: 0 },
  uHatchSpacing: { value: 7 },
  uShadeStrength: { value: 1 },
  uPaper: { value: new THREE.Color("#efe5cc") },
  uInk: { value: new THREE.Color(INK) },
  uWobble: { value: 0 },
  uBoil: { value: 0 },
};

export const setStyle = (o: {
  hatch: number;
  shadeStrength: number;
  ink: string;
  paper: string;
  wobble: number;
  boil: number;
}) => {
  STYLE.uHatch.value = o.hatch;
  STYLE.uShadeStrength.value = o.shadeStrength;
  STYLE.uInk.value.set(o.ink);
  STYLE.uPaper.value.set(o.paper);
  STYLE.uWobble.value = o.wobble;
  STYLE.uBoil.value = o.boil;
};

const HAZE_GLSL = /* glsl */ `
uniform vec3 uHazeColor;
uniform float uHazeNear;
uniform float uHazeFar;
uniform float uHazeMax;
varying float vDepth;
vec3 haze(vec3 col) {
  return mix(col, uHazeColor, smoothstep(uHazeNear, uHazeFar, vDepth) * uHazeMax);
}
`;

const TOON_VERT = /* glsl */ `
uniform vec3 uLightDir;
varying vec3 vN;
varying vec3 vL;
varying vec3 vObj;
varying float vDepth;
void main() {
  vObj = position;
  vN = normalize(normalMatrix * normal);
  vL = normalize((viewMatrix * vec4(uLightDir, 0.0)).xyz);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}
`;

const TOON_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uShade;
uniform vec3 uPattern;
uniform float uPatternAmt;
uniform float uPatternScale;
uniform float uGrain;
uniform sampler2D uFace;
uniform float uHasFace;
uniform float uOpacity;
uniform vec3 uStripe;
uniform vec3 uStripeShade;
uniform float uStripes;
uniform float uHatch;
uniform float uHatchSpacing;
uniform float uShadeStrength;
uniform vec3 uPaper;
varying vec3 vN;
varying vec3 vL;
varying vec3 vObj;
${NOISE_GLSL}
${HAZE_GLSL}
// 1 on a pencil stroke, 0 between strokes (screen space, slightly wavy and broken).
float hatchLine(vec2 p, float angle, float spacing) {
  vec2 dir = vec2(cos(angle), sin(angle));
  float d = dot(p, dir) / spacing + vnoise(vec3(p * 0.012, 1.0)) * 1.2;
  float f = abs(fract(d) - 0.5) * 2.0;
  float along = vnoise(vec3(dot(p, vec2(-dir.y, dir.x)) * 0.05, floor(d), 2.0));
  return (1.0 - smoothstep(0.25, 0.6, f)) * smoothstep(0.2, 0.45, along);
}
void main() {
  float d = dot(normalize(vN), vL);
  float lit = smoothstep(-0.05, 0.3, d);
  vec3 col = mix(mix(uColor, uShade, uShadeStrength), uColor, lit);
  if (uStripes > 0.0) {
    float a = atan(vObj.z, vObj.x) / 6.2831853 * uStripes;
    float band = smoothstep(0.47, 0.53, abs(fract(a) - 0.5) * 2.0);
    col = mix(col, mix(uStripeShade, uStripe, lit), band);
  }
  if (uPatternAmt > 0.0) {
    float b = vnoise(vObj * uPatternScale + 3.0);
    col = mix(col, uPattern * mix(0.82, 1.0, lit), uPatternAmt * smoothstep(0.56, 0.6, b));
  }
  col *= 1.0 - uGrain * (vnoise(vObj * 7.0) * 0.5 + specks(vObj * 16.0) * 0.9);
  if (uHatch > 0.0) {
    vec2 p = gl_FragCoord.xy;
    float h1 = hatchLine(p, 0.8, uHatchSpacing);
    float h2 = hatchLine(p, -0.7, uHatchSpacing * 0.85);
    col = mix(col, uPaper, uHatch * 0.22 * (1.0 - h1));
    col *= 1.0 - uHatch * (0.1 * h1 + 0.2 * (1.0 - lit) * h2);
  }
  if (uHasFace > 0.5 && vObj.z > 0.0) {
    vec4 f = texture2D(uFace, vObj.xy * 0.5 + 0.5);
    col = mix(col, f.rgb, f.a);
  }
  gl_FragColor = vec4(haze(col), uOpacity);
  #include <colorspace_fragment>
}
`;

const OUTLINE_VERT = /* glsl */ `
uniform float uThickness;
uniform float uWobble;
uniform float uBoil;
varying float vDepth;
${NOISE_GLSL}
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  float w = 1.0 + uWobble * (vnoise(position * 9.0 + uBoil * 17.0) - 0.5) * 2.0;
  mv.xyz += normalize(normalMatrix * normal) * uThickness * w;
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}
`;

const OUTLINE_FRAG = /* glsl */ `
uniform vec3 uColor;
${HAZE_GLSL}
void main() {
  gl_FragColor = vec4(haze(uColor), 1.0);
  #include <colorspace_fragment>
}
`;

export type ToonOpts = {
  color: string;
  /** Shadow-side color. Defaults to a cooler, darker version of `color`. */
  shade?: string;
  /** Strength of the grainy dirt texture (0-1). */
  grain?: number;
  /** Blotch color for camo / dirt / patches. */
  pattern?: string;
  patternAmt?: number;
  patternScale?: number;
  /** Unlit look (flames, glowing things): shade equals color. */
  flat?: boolean;
  opacity?: number;
  /** Vertical stripes around the y axis (tents, banners): second color and count. */
  stripe?: string;
  stripes?: number;
};

const shadeOf = (hex: string) =>
  new THREE.Color(hex).multiplyScalar(0.6).lerp(new THREE.Color("#4b4f6e"), 0.1);

const makeToon = (o: ToonOpts, face: THREE.Texture | null) => {
  const color = new THREE.Color(o.color);
  const shade = o.flat ? color.clone() : o.shade ? new THREE.Color(o.shade) : shadeOf(o.color);
  const opacity = o.opacity ?? 1;
  return new THREE.ShaderMaterial({
    vertexShader: TOON_VERT,
    fragmentShader: TOON_FRAG,
    transparent: opacity < 1,
    uniforms: {
      uColor: { value: color },
      uShade: { value: shade },
      uPattern: { value: new THREE.Color(o.pattern ?? o.color) },
      uPatternAmt: { value: o.pattern ? (o.patternAmt ?? 0.5) : 0 },
      uPatternScale: { value: o.patternScale ?? 3 },
      uGrain: { value: o.grain ?? 0.06 },
      uFace: { value: face },
      uHasFace: { value: face ? 1 : 0 },
      uLightDir: { value: LIGHT_DIR },
      uOpacity: { value: opacity },
      uStripe: { value: new THREE.Color(o.stripe ?? o.color) },
      uStripeShade: { value: o.flat ? new THREE.Color(o.stripe ?? o.color) : shadeOf(o.stripe ?? o.color) },
      uStripes: { value: o.stripe ? (o.stripes ?? 10) : 0 },
      ...HAZE,
      ...STYLE,
    },
  });
};

const toonCache = new Map<string, THREE.ShaderMaterial>();

/** Cel-shaded material with a soft two-tone band, grain and optional pattern. Cached by options. */
export const toonMaterial = (o: ToonOpts): THREE.ShaderMaterial => {
  const key = JSON.stringify(o);
  let m = toonCache.get(key);
  if (!m) {
    m = makeToon(o, null);
    toonCache.set(key, m);
  }
  return m;
};

const faceCache = new Map<string, THREE.ShaderMaterial>();

/** Toon material whose front (+z, object space) has a painted texture (face, emblem) projected onto it. */
export const faceMaterial = (o: ToonOpts, face: THREE.Texture): THREE.ShaderMaterial => {
  const key = `${face.uuid}|${JSON.stringify(o)}`;
  let m = faceCache.get(key);
  if (!m) {
    m = makeToon(o, face);
    faceCache.set(key, m);
  }
  return m;
};

const outlineCache = new Map<string, THREE.ShaderMaterial>();

/** Inverted-hull outline: back faces pushed out along the normal, drawn in the style's ink. */
export const outlineMaterial = (thickness: number, color?: string) => {
  const key = `${thickness}|${color}`;
  let m = outlineCache.get(key);
  if (!m) {
    m = new THREE.ShaderMaterial({
      vertexShader: OUTLINE_VERT,
      fragmentShader: OUTLINE_FRAG,
      side: THREE.BackSide,
      uniforms: {
        uThickness: { value: thickness },
        ...HAZE,
        ...STYLE,
        uColor: color ? { value: new THREE.Color(color) } : STYLE.uInk,
      },
    });
    outlineCache.set(key, m);
  }
  return m;
};
