import React from "react";
import { useCurrentFrame } from "remotion";
import { Part, Line } from "../Part";
import { X, type XProps } from "../context";
import { Glow } from "../effects";
import { blob, circle, poly, roundPoly, roundRect } from "../shapes";
import { palette, shadeHex, mixHex } from "../style";
import { rng, noise1 } from "../random";
import { FireLine, Smoke, Flame } from "./fire";

const MARBLE = "#efe6d6";

/** Greek temple facade. Origin = ground center under the steps. */
export const GreekTemple: React.FC<
  XProps & { w?: number; colH?: number; cols?: number; color?: string; door?: boolean; burn?: number; seed?: number }
> = ({ w = 700, colH = 300, cols = 6, color = MARBLE, door = false, burn = 0, seed = 3, ...xf }) => {
  const c = burn > 0 ? mixHex(color, "#5a4a44", burn * 0.55) : color;
  const stepH = 22;
  const base = stepH * 3;
  const cw = w / (cols * 2.2);
  const span = w * 0.88;
  const top = base + colH;
  return (
    <X {...xf}>
      {/* cella wall behind the columns */}
      <Part shape={roundRect(span, colH, 2)} color={shadeHex(c, 0.42)} flat y={base + colH / 2} />
      {door ? <Part shape={roundRect(cw * 2.2, colH * 0.7, 6)} color="#1d1519" flat y={base + colH * 0.35} z={0.001} /> : null}
      {[0, 1, 2].map((i) => (
        <Part key={`s${i}`} shape={roundRect(w + 60 - i * 30, stepH, 3)} color={shadeHex(c, 0.04 * (2 - i))} y={stepH * i + stepH / 2} z={0.002 + i * 0.0001} />
      ))}
      {Array.from({ length: cols }, (_, i) => {
        const x = -span / 2 + (i / (cols - 1)) * span;
        return (
          <X key={`c${i}`} x={x} z={0.01 + i * 0.0001}>
            <Part shape={roundRect(cw * 1.3, 12, 3)} color={c} y={base + 6} />
            <Part shape={roundRect(cw, colH - 30, 3)} color={c} shade={0.3} y={base + 12 + (colH - 30) / 2}>
              <Line pts={[[-cw * 0.2, -(colH - 30) / 2 + 8], [-cw * 0.2, (colH - 30) / 2 - 8]]} width={3} color={shadeHex(c, 0.22)} z={0.001} />
              <Line pts={[[cw * 0.15, -(colH - 30) / 2 + 8], [cw * 0.15, (colH - 30) / 2 - 8]]} width={3} color={shadeHex(c, 0.22)} z={0.001} />
            </Part>
            <Part shape={roundRect(cw * 1.6, 18, 4)} color={c} y={top - 9} z={0.001} />
          </X>
        );
      })}
      <Part shape={roundRect(w + 10, 34, 3)} color={c} y={top + 17} z={0.02} />
      <Part shape={roundRect(w + 10, 30, 3)} color={shadeHex(c, 0.06)} y={top + 49} z={0.021}>
        {Array.from({ length: cols * 2 }, (_, i) => (
          <Part key={i} shape={roundRect(12, 24, 2)} color={shadeHex(c, 0.3)} flat outline={0} x={-w / 2 + 20 + (i / (cols * 2 - 1)) * (w - 40)} z={0.001} />
        ))}
      </Part>
      <Part shape={roundRect(w + 40, 16, 4)} color={c} y={top + 72} z={0.022} />
      <Part shape={poly([[-w / 2 - 20, top + 80], [w / 2 + 20, top + 80], [0, top + 80 + w * 0.2]])} color={c} shade={0.12} light={{ dir: [-0.6, 1] }} z={0.023}>
        <Part shape={poly([[-w / 2 + 30, top + 92], [w / 2 - 30, top + 92], [0, top + 70 + w * 0.2]])} color={shadeHex(c, 0.12)} flat outline={4} z={0.001} />
      </Part>
      {burn > 0 ? (
        <>
          <FireLine w={w * 0.9} y={top + 60} intensity={burn} seed={seed} z={0.05} />
          <Smoke y={top + 120} w={w * 0.4} h={1100} alpha={0.6 * burn} seed={seed + 1} z={0.06} />
        </>
      ) : null}
    </X>
  );
};

/** Rocky flat-topped hill (Acropolis / Areopagus). Origin = ground center. */
export const RockHill: React.FC<
  XProps & { w?: number; h?: number; color?: string; seed?: number; path?: boolean; steep?: "left" | "right"; bushes?: number }
> = ({ w = 1200, h = 520, color = "#c9b18c", seed = 2, path = true, steep = "right", bushes = 5, ...xf }) => {
  const r = rng(seed);
  const s = steep === "right" ? 1 : -1;
  // left side gentle, right side steep (mirrored if steep = left)
  const raw: [number, number][] = [
    [-w / 2, 0],
    [-w * 0.42, h * 0.32],
    [-w * 0.36, h * 0.62],
    [-w * 0.3, h * 0.9],
    [-w * 0.18, h],
    [w * 0.22, h * 0.98],
    [w * 0.36, h * 0.94],
    [w * 0.4, h * 0.55],
    [w * 0.44, h * 0.2],
    [w / 2, 0],
  ];
  const pts = raw.map(([x, y]) => [x * s, y] as [number, number]);
  if (s < 0) pts.reverse();
  const strata = Array.from({ length: 5 }, (_, i) => (i + 1) / 6);
  const sideX = (y: number, side: -1 | 1) => {
    // interpolate along the raw outline for the given side
    const half = side * s < 0 ? raw.slice(0, 5) : raw.slice(5).reverse();
    for (let i = 0; i < half.length - 1; i++) {
      const [x0, y0] = half[i];
      const [x1, y1] = half[i + 1];
      if ((y - y0) * (y - y1) <= 0 && y1 !== y0) return (x0 + ((y - y0) / (y1 - y0)) * (x1 - x0)) * s;
    }
    return side * w * 0.3;
  };
  return (
    <X {...xf}>
      <Part shape={roundPoly(pts, pts.map((_, i) => (i === 0 || i === pts.length - 1 ? 0 : 40)))} color={color} shade={0.16} light={{ dir: [-0.9, 0.45] }} />
      {strata.map((f, i) => {
        const y = f * h;
        const xl = Math.min(sideX(y, -1), sideX(y, 1)) + 30;
        const xr = Math.max(sideX(y, -1), sideX(y, 1)) - 30;
        const n = 6;
        const pts2: [number, number][] = Array.from({ length: n + 1 }, (_, k) => [xl + ((xr - xl) * k) / n, y + (r() - 0.5) * 18]);
        return <Line key={i} pts={pts2} smooth width={4} color={shadeHex(color, 0.3)} z={0.001} />;
      })}
      {Array.from({ length: 7 }, (_, i) => {
        const x = (r() - 0.5) * w * 0.6;
        const y = (0.15 + r() * 0.6) * h;
        return <Line key={`k${i}`} pts={[[x, y], [x + 8, y - 30], [x - 4, y - 56]]} width={4} color={shadeHex(color, 0.35)} z={0.002} />;
      })}
      {path ? (
        <Line
          pts={[[-w * 0.38 * s, 10], [-w * 0.1 * s, h * 0.22], [-w * 0.32 * s, h * 0.45], [-w * 0.08 * s, h * 0.68], [-w * 0.24 * s, h * 0.95]]}
          width={14}
          color={mixHex(color, "#ffffff", 0.3)}
          z={0.003}
        />
      ) : null}
      {Array.from({ length: bushes }, (_, i) => {
        const x = (-0.3 + r() * 0.62) * w;
        return <Part key={`b${i}`} shape={circle(22 + r() * 16)} color="#6f8a45" shade={0.3} x={x} y={h * 0.97 - Math.abs(x) * 0.02} z={0.004} />;
      })}
    </X>
  );
};

/** Wall of planks and old doors. Origin = ground center. `burn` 0..1. */
export const Barricade: React.FC<XProps & { w?: number; h?: number; burn?: number; char?: number; seed?: number }> = ({
  w = 700,
  h = 300,
  burn = 0,
  char,
  seed = 4,
  ...xf
}) => {
  const r = rng(seed);
  const ch = char ?? burn;
  const wood = (c: string) => mixHex(c, "#2e2420", ch * 0.75);
  const tones = ["#b98a54", "#a5764a", "#c79a62", "#9a6c42"];
  const doors = [-w * 0.24, w * 0.22];
  const planks = Array.from({ length: Math.round(h / 52) }, (_, i) => ({
    y: 30 + i * 50 + (r() - 0.5) * 8,
    len: w * (0.82 + r() * 0.2),
    x: (r() - 0.5) * 60,
    rot: (r() - 0.5) * 0.08,
    c: tones[Math.floor(r() * tones.length)],
  }));
  return (
    <X {...xf}>
      {[-w / 2 + 20, w / 2 - 20].map((x, i) => (
        <Part key={`p${i}`} shape={roundRect(36, h + 40, 6)} color={wood("#7a5232")} shade={0.25} x={x} y={(h + 40) / 2} />
      ))}
      {doors.map((x, i) => (
        <X key={`d${i}`} x={x} y={h * 0.5} rot={(i ? 0.05 : -0.04)} z={0.01}>
          <Part shape={roundRect(w * 0.26, h * 0.92, 6)} color={wood(i ? "#8a5a3a" : "#6e4a2c")} shade={0.22}>
            {[-1, 1].map((k) => (
              <Part key={k} shape={roundRect(w * 0.18, h * 0.36, 4)} color={wood(shadeHex(i ? "#8a5a3a" : "#6e4a2c", -0.08))} flat outline={4} y={k * h * 0.21} z={0.001} />
            ))}
            <Part shape={circle(12)} color={wood("#c9963f")} flat outline={4} x={w * 0.07} z={0.002}>
              <Part shape={circle(5)} color={wood("#7a5a2a")} flat outline={0} z={0.001} />
            </Part>
          </Part>
        </X>
      ))}
      {planks.map((p, i) => (
        <X key={`l${i}`} x={p.x} y={p.y} rot={p.rot} z={0.02 + i * 0.001}>
          <Part shape={roundRect(p.len, 40, 5)} color={wood(p.c)} shade={0.26}>
            <Line pts={[[-p.len / 2 + 30, 5], [p.len / 2 - 120, 8]]} width={3} color={wood(shadeHex(p.c, 0.35))} z={0.001} />
            <Line pts={[[-p.len / 2 + 140, -7], [p.len / 2 - 40, -5]]} width={3} color={wood(shadeHex(p.c, 0.35))} z={0.001} />
            {[-p.len / 2 + 16, p.len / 2 - 16].map((x) => (
              <Part key={x} shape={circle(4.5)} color="#3a3a42" flat outline={0} x={x} z={0.002} />
            ))}
          </Part>
        </X>
      ))}
      {burn > 0 ? (
        <>
          <Glow rx={w * 0.8} ry={h * 0.9} color="#ff6a2a" alpha={0.25 * burn} y={h * 0.5} additive z={0.08} />
          <FireLine w={w * 0.95} y={h * 0.62} intensity={burn} seed={seed + 2} z={0.09} />
          <FireLine w={w * 0.7} y={h * 0.15} intensity={burn * 0.75} seed={seed + 3} glow={0.5} z={0.091} />
          <Smoke y={h} w={w * 0.35} h={1200} alpha={0.55 * burn} seed={seed + 4} z={0.1} />
        </>
      ) : null}
    </X>
  );
};

/** Simple Greek house: whitewashed walls, terracotta roof. Origin = ground center. */
export const GreekHouse: React.FC<XProps & { w?: number; h?: number; roof?: string; wall?: string; window?: boolean }> = ({
  w = 220,
  h = 160,
  roof = "#b8583a",
  wall = "#f1e6cf",
  window: win = true,
  ...xf
}) => (
  <X {...xf}>
    <Part shape={roundRect(w, h, 4)} color={wall} shade={0.2} y={h / 2} />
    <Part shape={roundPoly([[-w / 2 - 18, h - 6], [w / 2 + 18, h - 6], [w * 0.32, h + w * 0.22], [-w * 0.32, h + w * 0.22]], 6)} color={roof} shade={0.22} z={0.001} />
    <Part shape={roundRect(w * 0.22, h * 0.5, 4)} color="#6e4a2c" flat y={h * 0.25} x={-w * 0.18} z={0.002} />
    {win ? <Part shape={roundRect(w * 0.18, w * 0.18, 3)} color="#3a2e2a" flat x={w * 0.22} y={h * 0.62} z={0.002} /> : null}
  </X>
);

/** A cluster of Greek houses (background city). */
export const City: React.FC<XProps & { w?: number; rows?: number; seed?: number; scale?: number }> = ({ w = 1400, rows = 2, seed = 8, scale = 1, ...xf }) => {
  const r = rng(seed);
  const items: { x: number; y: number; s: number; roof: string; z: number }[] = [];
  for (let row = 0; row < rows; row++) {
    const n = Math.round(w / (240 * scale));
    for (let i = 0; i < n; i++) {
      items.push({
        x: -w / 2 + (i + 0.5) * (w / n) + (r() - 0.5) * 60,
        y: row * -60 * scale,
        s: scale * (0.7 + r() * 0.5) * (1 + row * 0.15),
        roof: ["#b8583a", "#a94f34", "#c8673f"][Math.floor(r() * 3)],
        z: row * 0.1 + i * 0.001,
      });
    }
  }
  return (
    <X {...xf}>
      {items.map((it, i) => (
        <GreekHouse key={i} x={it.x} y={it.y} s={it.s} roof={it.roof} z={it.z} window={r() > 0.3} />
      ))}
    </X>
  );
};

export const OliveTree: React.FC<XProps & { h?: number; seed?: number }> = ({ h = 300, seed = 2, ...xf }) => {
  const frame = useCurrentFrame();
  const sway = noise1(frame / 50, seed) * 0.03;
  return (
    <X {...xf}>
      <Part shape={blob([[-26, 0], [26, 0], [16, h * 0.4], [34, h * 0.7], [10, h * 0.62], [-8, h * 0.72], [-14, h * 0.4]], 6)} color="#7a5a3a" shade={0.3} />
      <X y={h * 0.72} rot={sway} z={0.01}>
        {[
          [-70, 10, 90],
          [60, 20, 95],
          [0, 70, 105],
          [-30, -20, 70],
          [40, -26, 70],
        ].map(([x, y, rr], i) => (
          <Part key={i} shape={circle(rr)} color={i % 2 ? "#8c9b5c" : "#7c8c4f"} shade={0.28} x={x} y={y} z={i * 0.001} />
        ))}
      </X>
    </X>
  );
};

/** Persian army tent. Origin = ground center. */
export const Tent: React.FC<XProps & { w?: number; h?: number; a?: string; b?: string }> = ({ w = 300, h = 220, a = "#c0362c", b = "#efe2c4", ...xf }) => (
  <X {...xf}>
    <Part shape={roundPoly([[-w / 2, 0], [w / 2, 0], [w * 0.08, h], [-w * 0.08, h]], [4, 4, 12, 12])} color={b} shade={0.2} />
    {[-0.3, 0, 0.3].map((f, i) => (
      <Part key={i} shape={poly([[f * w - w * 0.06, 2], [f * w + w * 0.06, 2], [f * w * 0.15 + 4, h - 10], [f * w * 0.15 - 4, h - 10]])} color={a} flat outline={0} z={0.001} />
    ))}
    <Part shape={poly([[-w * 0.1, 0], [w * 0.1, 0], [0, h * 0.45]])} color="#2a1e1c" flat z={0.002} />
    <Line pts={[[0, h], [0, h + 40]]} width={6} z={0.003} />
  </X>
);

/** Banner on a pole (Persian winged-sun emblem by default). Origin = pole base. */
export const Banner: React.FC<XProps & { pole?: number; color?: string; emblem?: string; seed?: number }> = ({
  pole = 420,
  color = "#7a2a6a",
  emblem = "#e9ba41",
  seed = 1,
  ...xf
}) => {
  const frame = useCurrentFrame();
  const wave = Math.sin(frame * 0.12 + seed) * 0.05;
  return (
    <X {...xf}>
      <Part shape={roundRect(12, pole, 6)} color={palette.woodDark} y={pole / 2} />
      <X y={pole - 14} rot={wave} z={0.01}>
        <Part shape={roundPoly([[6, 0], [150, 0], [150, -170], [78, -140], [6, -170]], 6)} color={color} shade={0.2} />
        <Part shape={circle(20)} color={emblem} flat outline={4} x={78} y={-62} z={0.001} />
        <Part shape={blob([[58, -62], [30, -50], [18, -66], [36, -72]], 6)} color={emblem} flat outline={3.5} z={0.001} />
        <Part shape={blob([[98, -62], [126, -50], [138, -66], [120, -72]], 6)} color={emblem} flat outline={3.5} z={0.001} />
      </X>
      <Part shape={circle(12)} color={palette.gold} y={pole + 6} z={0.02} />
    </X>
  );
};

/** Royal throne. Origin = ground center. */
export const Throne: React.FC<XProps & { color?: string; cushion?: string }> = ({ color = palette.gold, cushion = "#7a2a6a", ...xf }) => (
  <X {...xf}>
    <Part shape={roundPoly([[-110, 120], [110, 120], [92, 470], [0, 520], [-92, 470]], [10, 10, 30, 40, 30])} color={color} shade={0.25} />
    <Part shape={roundPoly([[-80, 150], [80, 150], [66, 440], [0, 480], [-66, 440]], 16)} color={cushion} flat outline={5} z={0.001} />
    {[-1, 1].map((k) => (
      <Part key={k} shape={roundRect(40, 130, 10)} color={shadeHex(color, 0.1)} shade={0.25} x={k * 110} y={65} z={0.002} />
    ))}
    <Part shape={roundRect(280, 40, 10)} color={color} shade={0.2} y={140} z={0.003} />
  </X>
);

/** Delphi tripod with the oracle's vapours. Origin = ground center. */
export const Tripod: React.FC<XProps & { h?: number }> = ({ h = 260, ...xf }) => (
  <X {...xf}>
    {[-1, 0, 1].map((k) => (
      <Line key={k} pts={[[k * 90, 0], [k * 30, h]]} width={14} color="#c9963f" />
    ))}
    <Part shape={blob([[-110, h], [110, h], [84, h - 50], [0, h - 66], [-84, h - 50]], 6)} color="#c9963f" shade={0.28} z={0.01} />
  </X>
);

/** Fire bowl on legs. Origin = ground center. */
export const Brazier: React.FC<XProps & { seed?: number }> = ({ seed = 4, ...xf }) => {
  const frame = useCurrentFrame();
  return (
    <X {...xf}>
      <Glow rx={380 * (1 + noise1(frame / 4, seed) * 0.1)} color="#ff9a3c" alpha={0.35} y={150} additive z={-0.1} />
      {[-1, 1].map((k) => (
        <Line key={k} pts={[[k * 50, 0], [k * 26, 120]]} width={12} color="#5a4a44" />
      ))}
      <Part shape={blob([[-80, 150], [80, 150], [60, 110], [0, 100], [-60, 110]], 6)} color="#6e5a4a" shade={0.3} z={0.01} />
      <Flame y={140} size={0.6} seed={seed} z={0.02} />
    </X>
  );
};



/** Thick wall of cut stone blocks. Origin = ground center. */
export const StoneWall: React.FC<XProps & { w?: number; h?: number; color?: string; seed?: number }> = ({ w = 400, h = 600, color = "#a9a3a0", seed = 6, ...xf }) => {
  const r = rng(seed);
  const rows = Math.round(h / 70);
  const rh = h / rows;
  return (
    <X {...xf}>
      <Part shape={roundRect(w, h, 6)} color={shadeHex(color, 0.15)} flat y={h / 2} />
      {Array.from({ length: rows }, (_, row) => {
        const off = row % 2 ? 0.5 : 0;
        const n = Math.round(w / 120);
        const bw = w / n;
        return Array.from({ length: n + 1 }, (_, i) => {
          const x0 = Math.max(-w / 2, -w / 2 + (i - off) * bw);
          const x1 = Math.min(w / 2, -w / 2 + (i + 1 - off) * bw);
          if (x1 - x0 < 20) return null;
          return (
            <Part
              key={`${row}-${i}`}
              shape={roundRect(x1 - x0 - 8, rh - 8, 8)}
              color={mixHex(color, r() > 0.5 ? "#ffffff" : "#6a6470", r() * 0.15)}
              shade={0.25}
              x={(x0 + x1) / 2}
              y={row * rh + rh / 2}
              z={0.001 + row * 0.0001}
            />
          );
        });
      })}
    </X>
  );
};

/** Old wooden door; origin = bottom center (pivot for falling). `char` 0..1 burns it. */
export const OldDoor: React.FC<XProps & { w?: number; h?: number; char?: number; color?: string }> = ({ w = 220, h = 360, char = 0, color = "#7a5232", ...xf }) => {
  const c = mixHex(color, "#2e2420", char * 0.8);
  return (
    <X {...xf}>
      <Part shape={roundRect(w, h, 6)} color={c} shade={0.22} y={h / 2}>
        {[-1, 1].map((k) => (
          <Part key={k} shape={roundRect(w * 0.7, h * 0.36, 4)} color={shadeHex(c, -0.08)} flat outline={4} y={k * h * 0.21} z={0.001} />
        ))}
        {[-0.3, 0.3].map((k) => (
          <Part key={`h${k}`} shape={roundRect(w * 0.9, 14, 3)} color={mixHex("#3a3a42", "#000000", char * 0.3)} flat outline={3} y={k * h} z={0.002} />
        ))}
        <Part shape={circle(11)} color={mixHex("#c9963f", "#3a2a22", char * 0.7)} flat outline={4} x={w * 0.3} z={0.003} />
      </Part>
      {char > 0.3 ? <Glow rx={w * 0.6} ry={h * 0.4} color="#ff6a2a" alpha={0.15 * char} y={h * 0.3} additive z={0.01} /> : null}
    </X>
  );
};

/** Chinese pagoda / hall with curved roofs. Origin = ground center. */
export const Pagoda: React.FC<XProps & { tiers?: number; w?: number; color?: string; roof?: string }> = ({ tiers = 3, w = 360, color = "#b8322a", roof = "#3a4a3a", ...xf }) => (
  <X {...xf}>
    {Array.from({ length: tiers }, (_, i) => {
      const ww = w * (1 - i * 0.18);
      const y = i * 170;
      return (
        <X key={i} y={y} z={i * 0.01}>
          <Part shape={roundRect(ww * 0.7, 130, 4)} color={color} shade={0.22} y={65} />
          <Part
            shape={blob([[-ww * 0.72, 140], [-ww * 0.5, 160], [0, 210], [ww * 0.5, 160], [ww * 0.72, 140], [ww * 0.5, 150], [0, 180], [-ww * 0.5, 150]], 8)}
            color={roof}
            shade={0.22}
            z={0.005}
          />
        </X>
      );
    })}
    <Part shape={roundRect(14, 80, 6)} color={palette.gold} y={tiers * 170 + 60} z={0.1} />
  </X>
);

/** Egyptian pyramid with stone courses; the side away from the light is a darker facet. Origin = ground center. */
export const Pyramid: React.FC<XProps & { w?: number; h?: number; color?: string }> = ({ w = 420, h = 260, color = "#e3bb7a", ...xf }) => {
  const rows = 7;
  return (
    <X {...xf}>
      <Part shape={poly([[-w / 2, 0], [w / 2, 0], [0, h]])} color={color} shade={0.1}>
        <Part shape={poly([[w * 0.12, 0], [w / 2, 0], [0, h]])} color={shadeHex(color, 0.16)} flat outline={0} z={0.001} />
        {Array.from({ length: rows - 1 }, (_, i) => {
          const y = ((i + 1) / rows) * h;
          const half = (w / 2) * (1 - y / h);
          return <Line key={i} pts={[[-half + 6, y], [half - 6, y]]} width={3.5} color={shadeHex(color, 0.35)} z={0.002} />;
        })}
      </Part>
    </X>
  );
};

/** Leaning Tower of Pisa (arcaded tiers + belfry). Origin = ground center; `lean` in radians (negative leans right). */
export const LeaningTower: React.FC<XProps & { tiers?: number; w?: number; lean?: number; color?: string }> = ({ tiers = 6, w = 130, lean = -0.08, color = "#f1ece0", ...xf }) => {
  const th = 52;
  return (
    <X {...xf}>
      <X rot={lean}>
        <Part shape={roundRect(w * 1.08, 26, 6)} color={shadeHex(color, 0.06)} shade={0.2} y={13} />
        {Array.from({ length: tiers }, (_, i) => (
          <X key={i} y={26 + i * th} z={0.001 + i * 0.001}>
            <Part shape={roundRect(w, th, 4)} color={color} shade={0.22} y={th / 2} />
            {[-0.32, -0.11, 0.11, 0.32].map((k) => (
              <Part key={k} shape={roundRect(w * 0.12, th * 0.56, w * 0.06)} color={shadeHex(color, 0.4)} flat outline={3} x={k * w} y={th * 0.44} z={0.001} />
            ))}
            <Part shape={roundRect(w * 1.08, 10, 4)} color={shadeHex(color, 0.04)} shade={0.2} y={th} z={0.002} />
          </X>
        ))}
        <X y={26 + tiers * th} z={0.02}>
          <Part shape={roundRect(w * 0.72, th * 0.8, 4)} color={color} shade={0.22} y={th * 0.4} />
          {[-0.15, 0.15].map((k) => (
            <Part key={k} shape={roundRect(w * 0.1, th * 0.42, w * 0.05)} color={shadeHex(color, 0.4)} flat outline={3} x={k * w} y={th * 0.4} z={0.001} />
          ))}
          <Part shape={roundRect(w * 0.8, 10, 4)} color={shadeHex(color, 0.04)} shade={0.2} y={th * 0.8} z={0.002} />
        </X>
      </X>
    </X>
  );
};

/** Easter Island moai, seen from the front. Origin = ground center. */
export const Moai: React.FC<XProps & { h?: number; color?: string; hat?: boolean }> = ({ h = 300, color = "#8a8580", hat = false, ...xf }) => {
  const w = h * 0.5;
  return (
    <X {...xf}>
      {[-1, 1].map((k) => (
        <Part key={k} shape={roundRect(w * 0.16, h * 0.34, w * 0.07)} color={shadeHex(color, 0.06)} shade={0.25} x={k * w * 0.54} y={h * 0.62} z={-0.001} />
      ))}
      <Part shape={roundPoly([[-w * 0.5, 0], [w * 0.5, 0], [w * 0.52, h * 0.86], [w * 0.4, h], [-w * 0.4, h], [-w * 0.52, h * 0.86]], 14)} color={color} shade={0.22}>
        <Part shape={roundRect(w * 0.9, h * 0.08, h * 0.04)} color={shadeHex(color, 0.28)} flat outline={0} y={h * 0.7} z={0.001} />
        <Part shape={roundPoly([[-w * 0.1, h * 0.7], [w * 0.1, h * 0.7], [w * 0.16, h * 0.42], [-w * 0.16, h * 0.42]], 8)} color={shadeHex(color, 0.08)} shade={0.25} z={0.002} />
        <Line pts={[[-w * 0.22, h * 0.3], [w * 0.22, h * 0.3]]} width={5} color={shadeHex(color, 0.45)} z={0.003} />
        <Line pts={[[-w * 0.16, h * 0.24], [w * 0.16, h * 0.24]]} width={4} color={shadeHex(color, 0.45)} z={0.003} />
      </Part>
      {hat ? <Part shape={roundRect(w * 0.6, h * 0.14, h * 0.05)} color="#b0533a" shade={0.25} y={h * 1.04} z={0.01} /> : null}
    </X>
  );
};
