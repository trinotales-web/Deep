import React, { useMemo } from "react";
import * as THREE from "three";
import { useCurrentFrame } from "remotion";
import { Part, Line } from "../Part";
import { X, type XProps } from "../context";
import { Gradient, Glow } from "../effects";
import { blob, circle, ellipse, poly, roundPoly, type ShapeSpec } from "../shapes";
import { palette, shadeHex, mixHex } from "../style";
import { rng, noise1 } from "../random";

/** Puffy cartoon cloud: scalloped top, flatter bottom, soft shadow underneath. */
export const cloudShape = (w: number, h: number, lobes = 5, seed = 1): ShapeSpec => ({
  key: `cloud:${w}:${h}:${lobes}:${seed}`,
  build: () => {
    const r = rng(seed);
    const pts: THREE.Vector2[] = [];
    const N = 160;
    const phase = r() * Math.PI;
    const amps = Array.from({ length: lobes * 2 }, () => 0.75 + r() * 0.5);
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      const k = Math.abs(Math.sin((a * lobes) / 1 + phase));
      const lobe = amps[Math.floor(((a * lobes) / Math.PI + phase / Math.PI) % (lobes * 2))] ?? 1;
      const top = Math.sin(a) > -0.2;
      const rr = 1 + (top ? 0.16 * Math.sqrt(k) * lobe : 0.05 * Math.sqrt(k));
      let x = Math.cos(a) * (w / 2) * rr;
      let y = Math.sin(a) * (h / 2) * rr;
      y = Math.max(y, -h * 0.32);
      pts.push(new THREE.Vector2(x, y));
    }
    return { shapes: [new THREE.Shape(pts)], contours: [pts] };
  },
});

export const Cloud: React.FC<XProps & { w: number; h?: number; seed?: number; color?: string; shadow?: string; drift?: number }> = ({
  w,
  h,
  seed = 1,
  color = "#f8f5ef",
  shadow = "#d6d8e4",
  drift = 0.15,
  ...xf
}) => {
  const frame = useCurrentFrame();
  return (
    <X {...xf} x={(xf.x ?? 0) + frame * drift}>
      <Part
        shape={cloudShape(w, h ?? w * 0.42, Math.max(3, Math.round(w / 90)), seed)}
        color={color}
        shadow={shadow}
        shade={0.24}
        light={{ dir: [-0.25, 1] }}
      />
    </X>
  );
};

/** Background mountain range with a few peaks. Bottom edge at y=0. */
export const Mountains: React.FC<
  XProps & { w: number; peaks: [number, number][]; color?: string; snow?: string | null; outline?: number }
> = ({ w, peaks, color = "#9fb0c8", snow = null, outline = 4, ...xf }) => {
  const pts: [number, number][] = [[-w / 2, 0], ...peaks, [w / 2, 0]];
  const radius = pts.map((_, i) => (i === 0 || i === pts.length - 1 ? 0 : 22));
  return (
    <X {...xf}>
      <Part shape={roundPoly(pts, radius)} color={color} outline={outline} shade={0.18} light={{ dir: [-1, 0.25] }} />
      {snow
        ? peaks
            .filter(([, y]) => y > 180)
            .map(([x, y], i) => (
              <Part
                key={i}
                shape={roundPoly([[x - 46, y - 52], [x, y - 3], [x + 46, y - 52], [x + 22, y - 44], [x, y - 58], [x - 22, y - 44]], 6)}
                color={snow}
                flat
                outline={outline * 0.8}
                z={0.001}
              />
            ))
        : null}
    </X>
  );
};

/** Rolling hill (blob) — anchor at bottom center. */
export const Hill: React.FC<XProps & { w: number; h: number; color?: string; seed?: number; bumps?: number }> = ({
  w,
  h,
  color = palette.jungle,
  seed = 3,
  bumps = 0,
  ...xf
}) => {
  const r = rng(seed);
  const pts: [number, number][] = [[-w / 2 - 20, -40]];
  const n = 7 + bumps;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = -w / 2 + t * w;
    const y = Math.sin(t * Math.PI) * h * (0.85 + r() * 0.15) + (bumps ? r() * h * 0.12 : 0);
    pts.push([x, Math.max(y, 0)]);
  }
  pts.push([w / 2 + 20, -40]);
  return (
    <X {...xf}>
      <Part shape={blob(pts, 8)} color={color} shade={0.18} light={{ dir: [-1, 0.5] }} />
    </X>
  );
};

/** Sea band with sparkle lines. Top edge at y=0, extends down by h. */
export const Sea: React.FC<XProps & { w: number; h: number; color?: string; deep?: string; seed?: number }> = ({
  w,
  h,
  color = palette.sea,
  deep,
  seed = 5,
  ...xf
}) => {
  const frame = useCurrentFrame();
  const r = rng(seed);
  const lines = Array.from({ length: Math.round((w * h) / 26000) }, () => [r() * w - w / 2, -r() * h * 0.9 - 10, 20 + r() * 50, r() * 6.28]);
  return (
    <X {...xf}>
      <Gradient w={w} h={h} y={-h / 2} stops={[[0, mixHex(color, "#ffffff", 0.18)], [1, deep ?? shadeHex(color, 0.25)]]} />
      <Line pts={[[-w / 2, 0], [w / 2, 0]]} width={6} z={0.01} />
      {lines.map(([x, y, len, ph], i) => {
        const a = 0.35 + 0.35 * Math.sin(frame * 0.08 + ph);
        const dx = Math.sin(frame * 0.03 + ph) * 8;
        return <Line key={i} pts={[[x + dx, y], [x + dx + len, y]]} width={4} color="#ffffff" opacity={a} z={0.02} />;
      })}
    </X>
  );
};

/** Flat ground with scattered pebbles and grass tufts. Top edge at y=0. */
export const Ground: React.FC<
  XProps & { w: number; h: number; color?: string; far?: string; pebbles?: number; tufts?: number; seed?: number; tuftColor?: string }
> = ({ w, h, color = "#c9a56a", far, pebbles = 14, tufts = 10, seed = 9, tuftColor, ...xf }) => {
  const r = rng(seed);
  const items = useMemo(() => {
    const ps = Array.from({ length: pebbles }, () => [r() * w - w / 2, -20 - r() * (h - 60), 8 + r() * 16, r()]);
    const ts = Array.from({ length: tufts }, () => [r() * w - w / 2, -16 - r() * (h - 60), 0.7 + r() * 0.6]);
    return { ps, ts };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [w, h, pebbles, tufts, seed]);
  const tc = tuftColor ?? shadeHex(color, 0.25);
  return (
    <X {...xf}>
      <Gradient w={w} h={h} y={-h / 2} stops={[[0, far ?? mixHex(color, "#ffffff", 0.08)], [1, shadeHex(color, 0.18)]]} />
      <Line pts={[[-w / 2, 0], [w / 2, 0]]} width={6} z={0.01} />
      {items.ps.map(([x, y, s, c], i) => (
        <Part
          key={`p${i}`}
          shape={ellipse(s, s * 0.55)}
          color={c > 0.5 ? mixHex(color, "#8a8790", 0.6) : shadeHex(color, 0.2)}
          shade={0.35}
          outline={4.5}
          x={x}
          y={y}
          z={0.02 + i * 1e-4}
        />
      ))}
      {items.ts.map(([x, y, s], i) => (
        <X key={`t${i}`} x={x} y={y} s={s} z={0.03}>
          <Line pts={[[-14, 0], [-20, 22]]} width={4.5} color={tc} />
          <Line pts={[[-4, 0], [-4, 30]]} width={4.5} color={tc} />
          <Line pts={[[6, 0], [14, 24]]} width={4.5} color={tc} />
        </X>
      ))}
    </X>
  );
};

/** Leafy bush / jungle clump. */
export const Bush: React.FC<XProps & { w: number; h?: number; color?: string; seed?: number }> = ({
  w,
  h,
  color = palette.jungle,
  seed = 2,
  ...xf
}) => {
  const hh = h ?? w * 0.6;
  return (
    <X {...xf}>
      <Part shape={cloudShape(w, hh * 1.4, Math.max(3, Math.round(w / 70)), seed)} color={color} shade={0.24} y={hh * 0.42} light={{ dir: [-0.6, 0.8] }} />
    </X>
  );
};

/** Palm tree with swaying fronds. Origin at the base of the trunk. */
export const PalmTree: React.FC<XProps & { h?: number; lean?: number; seed?: number; frond?: string }> = ({
  h = 520,
  lean = 0.18,
  seed = 1,
  frond = "#3f8f3a",
  ...xf
}) => {
  const frame = useCurrentFrame();
  const sway = noise1(frame / 45, seed) * 0.05;
  const topX = Math.sin(lean) * h;
  const segs = 8;
  const trunk: [number, number][] = [];
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    trunk.push([topX * t * t, h * t]);
  }
  const left = trunk.map(([x, y], i) => [x - (18 - (i / segs) * 7), y] as [number, number]);
  const right = trunk.map(([x, y], i) => [x + (18 - (i / segs) * 7), y] as [number, number]).reverse();
  const fronds = [-2.6, -2.0, -1.2, -0.5, 0.2, 0.9, 2.3];
  return (
    <X {...xf}>
      <Part shape={poly([...left, ...right])} color="#a8794a" shade={0.3} light={{ dir: [-1, 0.2] }} />
      {trunk.slice(1, -1).map(([x, y], i) => (
        <Line key={i} pts={[[x - 14, y - 6], [x, y + 4], [x + 14, y - 6]]} smooth width={4} z={0.001} />
      ))}
      <X x={topX} y={h} rot={sway} z={0.01}>
        {fronds.map((a, i) => (
          <X key={i} rot={a + Math.sin(frame * 0.05 + i) * 0.04} z={i * 0.001}>
            <Part
              shape={blob([[0, -6], [70, 18], [150, 8], [210, -34], [150, -12], [70, -14]], 8)}
              color={i % 2 ? frond : shadeHex(frond, 0.12)}
              shade={0.3}
            />
          </X>
        ))}
        {[[-14, -12], [8, -18], [-2, -26]].map(([cx, cy], i) => (
          <Part key={`c${i}`} shape={circle(14)} color="#6b4a2a" shade={0.35} x={cx} y={cy} z={0.02} />
        ))}
      </X>
    </X>
  );
};

export const Sun: React.FC<XProps & { r?: number; color?: string; glow?: number }> = ({ r = 70, color = "#fff2b8", glow = 0.6, ...xf }) => (
  <X {...xf}>
    <Glow rx={r * 5} color="#fff3c9" alpha={glow * 0.6} additive />
    <Part shape={circle(r)} color={color} flat outline={0} />
  </X>
);

export const Moon: React.FC<XProps & { r?: number }> = ({ r = 46, ...xf }) => (
  <X {...xf}>
    <Glow rx={r * 4} color="#c9d6ff" alpha={0.25} additive />
    <Part shape={circle(r)} color="#f4f1de" shade={0.12} light={{ dir: [-1, 0.4] }} outline={5}>
      <Part shape={circle(r * 0.18)} color="#ddd8c0" flat outline={0} x={r * 0.3} y={r * 0.2} z={0.001} />
      <Part shape={circle(r * 0.12)} color="#ddd8c0" flat outline={0} x={-r * 0.25} y={-r * 0.35} z={0.001} />
    </Part>
  </X>
);

export const Stars: React.FC<XProps & { w: number; h: number; count?: number; seed?: number }> = ({ w, h, count = 60, seed = 4, ...xf }) => {
  const frame = useCurrentFrame();
  const r = rng(seed);
  const stars = Array.from({ length: count }, () => [r() * w - w / 2, r() * h - h / 2, 1.5 + r() * 3, r() * 6.28]);
  return (
    <X {...xf}>
      {stars.map(([x, y, s, p], i) => (
        <Part key={i} shape={circle(s)} color="#fff6d8" flat outline={0} opacity={0.55 + 0.45 * Math.sin(frame * 0.12 + p)} x={x} y={y} />
      ))}
    </X>
  );
};

/** Sky gradient filling a w*h rectangle centered at x,y. */
export const Sky: React.FC<XProps & { w: number; h: number; top?: string; bottom?: string; mid?: string }> = ({
  w,
  h,
  top = palette.skyTop,
  bottom = "#cfeaf7",
  mid,
  ...xf
}) => (
  <Gradient {...xf} w={w} h={h} stops={mid ? [[0, top], [0.55, mid], [1, bottom]] : [[0, top], [1, bottom]]} />
);

/** Rotating light rays behind a subject (dramatic emphasis frames). */
export const Sunburst: React.FC<XProps & { r?: number; rays?: number; color?: string; alt?: string; speed?: number }> = ({
  r = 2200,
  rays = 18,
  color = "#7a2a24",
  alt = "#692220",
  speed = 0.004,
  ...xf
}) => {
  const frame = useCurrentFrame();
  return (
    <X {...xf}>
      <Part shape={circle(r)} color={alt} flat outline={0} />
      <X rot={frame * speed} z={0.001}>
        {Array.from({ length: rays }, (_, i) => {
          const a0 = (i / rays) * Math.PI * 2;
          const a1 = a0 + Math.PI / rays;
          return (
            <Part
              key={i}
              shape={poly([[0, 0], [Math.cos(a0) * r, Math.sin(a0) * r], [Math.cos(a1) * r, Math.sin(a1) * r]])}
              color={color}
              flat
              outline={0}
            />
          );
        })}
      </X>
    </X>
  );
};
