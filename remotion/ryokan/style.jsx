import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";

// Palette sampled/eyeballed from the colored-pencil reference.
export const C = {
  paper: "#F4EEDC",
  ink: "#1E2559",
  inkSoft: "#4A5285",
  grass: "#8FB16C",
  grassDark: "#6E9452",
  bush: "#6F9A57",
  pine: "#557F4C",
  haze: "#A9C3BA",
  hazeDark: "#86A79C",
  sun: "#F0A443",
  sunCore: "#F7C46A",
  dirt: "#D5B98F",
  skin: "#F5CBA2",
  blush: "#F09A9A",
  scalp: "#B8C0D2",
  robe: "#4E5574",
  kesa: "#CC9046",
  under: "#FBF8EE",
  thiefCloth: "#4FA068",
  thiefSuit: "#3D4570",
  thiefPants: "#59618C",
  thatch: "#D9B568",
  thatchDark: "#B88F45",
  wood: "#BE8D5A",
  woodDark: "#8C623E",
  shadow: "#6A4B37",
  straw: "#DCC88F",
  bowl: "#7D4D33",
  night: "#2F3B78",
  nightDeep: "#202A5E",
  moon: "#F8DF8C",
  moonDeep: "#EBC665",
  petal: "#F2B2B8",
  pink: "#EE8E9C",
  temariRed: "#E0625A",
  temariTeal: "#4FA3A5",
  temariGold: "#F2BE4E",
};

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
export const ease = Easing.bezier(0.45, 0, 0.25, 1);
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

// Seconds -> eased 0..1 progress between two timestamps.
export const prog = (t, a, b, easing = ease) =>
  interpolate(t, [a, b], [0, 1], { ...clamp, easing });

// A little overshoot "pop", like stickers being placed in the reference.
export const pop = (t, at, dur = 0.35) => {
  if (t < at) return 0;
  const x = Math.min(1, (t - at) / dur);
  return 1 + Math.sin(x * Math.PI) * 0.18 * (1 - x) - (1 - x) ** 3;
};

// Hand-drawn animation is usually held "on twos"; poses step at 15 fps.
export const onTwos = (t, fps = 30) => Math.floor(t * fps / 2) * 2 / fps;

// SVG filters shared by every scene. The line boil cycles three noise seeds
// every four frames, the classic trick for a living pencil line.
export const Defs = () => {
  const frame = useCurrentFrame();
  const boil = Math.floor(frame / 4) % 3;
  return (
    <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden>
      <defs>
        <filter id="crayon" x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.02 0.85" numOctaves="2" seed="3" result="streak" />
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="8" result="grain" />
          <feComposite in="streak" in2="grain" operator="arithmetic" k1="0" k2="0.62" k3="0.55" k4="-0.04" result="mix" />
          <feColorMatrix in="mix" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3.4 0 0 0 -1.0" result="mask" />
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed={boil + 1} result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="5" xChannelSelector="R" yChannelSelector="G" result="rough" />
          <feComposite in="rough" in2="mask" operator="in" />
        </filter>
        <filter id="ink" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed={boil + 11} result="w" />
          <feDisplacementMap in="SourceGraphic" in2="w" scale="3.4" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="5" result="g" />
          <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.2 0 0 0 -0.25" result="gm" />
          <feComposite in="d" in2="gm" operator="in" />
        </filter>
        <filter id="base" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed={boil + 11} result="w" />
          <feDisplacementMap in="SourceGraphic" in2="w" scale="3.4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="softglow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
        <filter id="paperGrain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" seed="21" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.42  0 0 0 0 0.36  0 0 0 0 0.25  -1.25 0 0 0 0.7" />
        </filter>
        <filter id="paperBlotch" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.005" numOctaves="3" seed="4" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.62  0 0 0 0 0.55  0 0 0 0 0.4  0.9 0 0 0 -0.38" />
        </filter>
        <radialGradient id="vignette" cx="50%" cy="48%" r="72%">
          <stop offset="62%" stopColor="#E3D9BE" stopOpacity="0" />
          <stop offset="100%" stopColor="#CDBF9C" stopOpacity="0.55" />
        </radialGradient>
        <radialGradient id="moonGlow">
          <stop offset="0%" stopColor="#FFF4C8" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#FCE7A4" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FCE7A4" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
};

// Colored-pencil fill. The wrapper is rotated so the streaky noise lands as
// diagonal hatching, then the content is rotated back upright.
export const Crayon = ({ children, angle = -38, opacity = 1 }) => (
  <g transform={`rotate(${angle})`} filter="url(#crayon)" opacity={opacity}>
    <g transform={`rotate(${-angle})`}>{children}</g>
  </g>
);

export const Ink = ({ children }) => <g filter="url(#ink)">{children}</g>;

// One drawable layer: opaque paper underlay (hides what is behind it),
// pencil fills, then ink outlines and details.
// part = { d, fill, line=true, w, inkFill, alpha, base=true, cap }
export const Layer = ({ parts, angle, base = true }) => {
  const filled = parts.filter((p) => p.fill);
  const based = filled.filter((p) => p.base !== false);
  return (
    <>
      {base && based.length > 0 && (
        <g filter="url(#base)">
          {based.map((p, i) => <path key={i} d={p.d} fill={C.paper} />)}
        </g>
      )}
      <Crayon angle={angle}>
        {filled.map((p, i) => <path key={i} d={p.d} fill={p.fill} opacity={p.alpha ?? 1} />)}
      </Crayon>
      <Ink>
        {parts.filter((p) => p.line !== false).map((p, i) => (
          <path
            key={i}
            d={p.d}
            fill={p.inkFill ?? "none"}
            stroke={p.inkFill && !p.w ? "none" : p.stroke ?? C.ink}
            strokeWidth={p.w ?? 3.2}
            strokeLinecap={p.cap ?? "round"}
            strokeLinejoin="round"
            opacity={p.inkAlpha ?? 1}
          />
        ))}
      </Ink>
    </>
  );
};

// ---------- path helpers ----------

export const circle = (cx, cy, r) =>
  `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0 Z`;

export const ellipse = (cx, cy, rx, ry) =>
  `M ${cx - rx} ${cy} a ${rx} ${ry} 0 1 0 ${2 * rx} 0 a ${rx} ${ry} 0 1 0 ${-2 * rx} 0 Z`;

// A capsule that follows a polyline: arms, legs, trunks.
export const limb = (pts, w0, w1 = w0) => {
  const n = pts.length;
  const L = [];
  const R = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(n - 1, i + 1)];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    const w = (w0 + (w1 - w0) * (i / (n - 1))) / 2;
    const nx = (-dy / len) * w;
    const ny = (dx / len) * w;
    L.push([pts[i][0] + nx, pts[i][1] + ny]);
    R.push([pts[i][0] - nx, pts[i][1] - ny]);
  }
  const f = (p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
  const r1 = w1 / 2;
  const r0 = w0 / 2;
  let d = `M ${f(L[0])}`;
  for (let i = 1; i < n; i++) d += ` L ${f(L[i])}`;
  d += ` A ${r1} ${r1} 0 0 1 ${f(R[n - 1])}`;
  for (let i = n - 2; i >= 0; i--) d += ` L ${f(R[i])}`;
  d += ` A ${r0} ${r0} 0 0 1 ${f(L[0])} Z`;
  return d;
};

// Two-bone joint chain from a root, using absolute angles in degrees.
export const chain = (x, y, segs) => {
  const pts = [[x, y]];
  let cx = x;
  let cy = y;
  for (const [len, deg] of segs) {
    const r = (deg * Math.PI) / 180;
    cx += Math.cos(r) * len;
    cy += Math.sin(r) * len;
    pts.push([cx, cy]);
  }
  return pts;
};

// Scalloped "cloud" outline: pine pads, bushes, smoke puffs.
export const cloudPad = (cx, cy, w, h, bumps = 5, flatBottom = true) => {
  const left = cx - w / 2;
  const step = w / bumps;
  let d = `M ${left} ${cy}`;
  for (let i = 0; i < bumps; i++) {
    const x0 = left + i * step;
    const lift = h * (0.75 + 0.25 * Math.sin(i * 1.7 + cx));
    d += ` C ${x0} ${cy - lift}, ${x0 + step} ${cy - lift}, ${x0 + step} ${cy}`;
  }
  if (flatBottom) {
    d += ` Q ${cx} ${cy + h * 0.35} ${left} ${cy} Z`;
  } else {
    for (let i = bumps - 1; i >= 0; i--) {
      const x0 = left + i * step;
      const drop = h * 0.55;
      d += ` C ${x0 + step} ${cy + drop}, ${x0} ${cy + drop}, ${x0} ${cy}`;
    }
    d += " Z";
  }
  return d;
};

// Small spiral used for the thief's karakusa furoshiki pattern.
export const spiral = (cx, cy, r, turns = 1.6, dir = 1) => {
  let d = "";
  const steps = 18;
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * turns * Math.PI * 2 * dir;
    const rr = r * (1 - i / steps) + 1.5;
    const x = cx + Math.cos(a) * rr;
    const y = cy + Math.sin(a) * rr;
    d += `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return d;
};

// Paper texture laid over the whole frame (multiply), so the drawings and
// the background share the same tooth.
export const PaperOverlay = () => (
  <svg viewBox="0 0 1080 1080" style={{ position: "absolute", inset: 0, mixBlendMode: "multiply" }}>
    <rect width="1080" height="1080" filter="url(#paperBlotch)" opacity="0.45" />
    <rect width="1080" height="1080" filter="url(#paperGrain)" opacity="0.8" />
    <rect width="1080" height="1080" fill="url(#vignette)" />
  </svg>
);
