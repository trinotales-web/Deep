import React from "react";
import { useCurrentFrame } from "remotion";
import { X, type XProps } from "../context";
import { Part } from "../Part";
import { limb, circle, poly, blob } from "../shapes";
import { rng } from "../random";
import { cloudShape } from "./nature";

// Branching trees drawn as one silhouette: every branch is a tapered limb, drawn
// twice (outlined, then fill-only on top) so the joints merge without seams.

type Seg = { x: number; y: number; a: number; len: number; w0: number; w1: number; depth: number };
type Tip = { x: number; y: number; a: number; depth: number };

const grow = (seed: number, h: number, spread: number, maxDepth: number, lean: number) => {
  const r = rng(seed);
  const segs: Seg[] = [];
  const tips: Tip[] = [];
  const step = (x: number, y: number, a: number, len: number, w: number, depth: number) => {
    const w1 = w * (depth === 0 ? 0.62 : 0.6);
    segs.push({ x, y, a, len, w0: w, w1, depth });
    const ex = x + Math.cos(a) * len;
    const ey = y + Math.sin(a) * len;
    if (depth >= maxDepth) {
      tips.push({ x: ex, y: ey, a, depth });
      return;
    }
    const n = depth === 0 ? 3 : r() < 0.35 ? 3 : 2;
    for (let i = 0; i < n; i++) {
      const k = i / (n - 1) - 0.5;
      const da = k * spread * (1.1 - depth * 0.12) + (r() - 0.5) * 0.35;
      const towardUp = (Math.PI / 2 - a) * 0.18;
      step(ex, ey, a + da + towardUp, len * (0.68 + r() * 0.14), w1, depth + 1);
    }
    // a short twig partway along big limbs
    if (depth <= 1 && r() < 0.7) {
      const t = 0.45 + r() * 0.25;
      const side = r() < 0.5 ? -1 : 1;
      step(x + Math.cos(a) * len * t, y + Math.sin(a) * len * t, a + side * (0.7 + r() * 0.3), len * 0.45, w * 0.42, maxDepth);
    }
  };
  step(0, 0, Math.PI / 2 + lean, h * 0.36, h * 0.075, 0);
  return { segs, tips, r };
};

export type TreeKind = "autumn" | "persimmon" | "green" | "bare";

const LEAVES: Record<TreeKind, string[]> = {
  autumn: ["#e0672a", "#f0a23a", "#c9452a", "#f4c04a", "#d8572c"],
  persimmon: ["#d98a3a", "#c9a24a", "#b8732e"],
  green: ["#5a9a46", "#4f8a3e", "#66a850", "#478036"],
  bare: [],
};

/**
 * Branching tree, origin = foot of the trunk. `kind` sets the foliage:
 * autumn (orange/red crowns), persimmon (sparse leaves + hanging orange fruit),
 * green, bare. `sway` 0..1 moves the crowns in the wind.
 */
export const Tree: React.FC<XProps & { h?: number; kind?: TreeKind; seed?: number; spread?: number; depth?: number; lean?: number; sway?: number; bark?: string }> = ({
  h = 600,
  kind = "autumn",
  seed = 4,
  spread = 1.25,
  depth = 3,
  lean = 0,
  sway = 0.5,
  bark = "#4a3428",
  ...xf
}) => {
  const frame = useCurrentFrame();
  const { segs, tips, r } = grow(seed, h, spread, depth, lean);
  const leaves = LEAVES[kind];
  const wind = (i: number) => Math.sin(frame * 0.06 + i * 1.7) * 4 * sway;
  const crown = kind === "autumn" || kind === "green";
  const crownSize = h * 0.2;
  return (
    <X {...xf}>
      {/* back foliage, darker, behind the branches */}
      {crown
        ? tips.map((t, i) => (
            <Part
              key={`b${i}`}
              shape={cloudShape(crownSize * 1.25, crownSize * 0.95, 5, seed * 7 + i)}
              color={leaves[(i + 2) % leaves.length]}
              shade={0.3}
              x={t.x + wind(i) - 10}
              y={t.y + 10}
              z={-0.02}
            />
          ))
        : null}
      {/* branches: outlined pass then fill pass hides the joints */}
      {segs.map((s, i) => (
        <X key={`o${i}`} x={s.x} y={s.y} rot={s.a + Math.PI / 2} z={-0.01 + i * 0.00001}>
          <Part shape={limb(s.len + s.w1 * 0.3, s.w0, s.w1)} color={bark} shade={0.25} />
        </X>
      ))}
      {segs.map((s, i) => (
        <X key={`f${i}`} x={s.x} y={s.y} rot={s.a + Math.PI / 2} z={-0.005 + i * 0.00001}>
          <Part shape={limb(s.len + s.w1 * 0.3, Math.max(1, s.w0 - 6), Math.max(1, s.w1 - 6))} color={bark} shade={0.25} outline={0} />
        </X>
      ))}
      {/* bark lines on the trunk */}
      <Part shape={poly([[-h * 0.012, h * 0.05], [-h * 0.006, h * 0.05], [-h * 0.01, h * 0.25], [-h * 0.016, h * 0.25]])} color="#2e2018" flat outline={0} z={-0.004} />
      {crown
        ? tips.map((t, i) => {
            const c = leaves[i % leaves.length];
            return (
              <X key={`c${i}`} x={t.x + wind(i)} y={t.y} z={0.01 + i * 0.0001}>
                <Part shape={cloudShape(crownSize, crownSize * 0.8, 5, seed + i * 3)} color={c} shade={0.26} />
                <Part shape={cloudShape(crownSize * 0.62, crownSize * 0.5, 4, seed + i * 5)} color={leaves[(i + 1) % leaves.length]} shade={0.22} x={crownSize * 0.28} y={crownSize * 0.22} z={0.001} />
              </X>
            );
          })
        : null}
      {kind === "persimmon"
        ? tips.map((t, i) => (
            <X key={`p${i}`} x={t.x + wind(i) * 0.4} y={t.y} z={0.01 + i * 0.0001}>
              {/* a few leaves */}
              {[0, 1].map((k) => (
                <X key={k} rot={t.a - Math.PI / 2 + (k ? 0.7 : -0.7)} z={-0.001}>
                  <Part shape={blob([[0, 0], [12, 16], [0, 40], [-12, 16]], 6)} color={leaves[(i + k) % leaves.length]} shade={0.2} />
                </X>
              ))}
              {/* fruit hanging just below the twig end */}
              {Array.from({ length: 1 + (i % 2) }, (_, k) => {
                const fx = (r() - 0.5) * 30 + k * 26;
                const fy = -18 - r() * 16;
                const fr = h * 0.03;
                return (
                  <X key={`fr${k}`} x={fx} y={fy} z={0.002 + k * 0.0001}>
                    <Part shape={circle(fr)} color="#f07a1a" shade={0.24} />
                    <Part shape={poly([[-fr * 0.5, fr * 0.7], [0, fr * 1.15], [fr * 0.5, fr * 0.7], [0, fr * 0.55]])} color="#4a6a2a" flat outline={2.5} z={0.001} />
                    <Part shape={circle(fr * 0.22)} color="#ffd0a0" flat outline={0} x={-fr * 0.35} y={fr * 0.3} z={0.001} />
                  </X>
                );
              })}
            </X>
          ))
        : null}
    </X>
  );
};

/** Leaves drifting down across a w×h box centred on the origin (loops forever). */
export const FallingLeaves: React.FC<XProps & { w?: number; h?: number; count?: number; seed?: number; colors?: string[]; size?: number; speed?: number }> = ({
  w = 2200,
  h = 1300,
  count = 18,
  seed = 2,
  colors = LEAVES.autumn,
  size = 1,
  speed = 1,
  ...xf
}) => {
  const frame = useCurrentFrame();
  const r = rng(seed);
  return (
    <X {...xf}>
      {Array.from({ length: count }, (_, i) => {
        const x0 = (r() - 0.5) * w;
        const ph = r() * h;
        const v = (1.6 + r() * 1.4) * speed;
        const sz = (10 + r() * 10) * size;
        const fall = (ph + frame * v) % h;
        const y = h / 2 - fall;
        const x = x0 + Math.sin(frame * 0.05 + i) * 40 + frame * 0.8 * speed;
        const xw = (((x + w / 2) % w) + w) % w - w / 2;
        return (
          <X key={i} x={xw} y={y} rot={Math.sin(frame * 0.08 + i * 2) * 1.2} sy={0.6 + 0.4 * Math.abs(Math.cos(frame * 0.07 + i))}>
            <Part shape={blob([[0, -sz], [sz * 0.55, 0], [0, sz], [-sz * 0.55, 0]], 6)} color={colors[i % colors.length]} flat outline={2.5} />
          </X>
        );
      })}
    </X>
  );
};
