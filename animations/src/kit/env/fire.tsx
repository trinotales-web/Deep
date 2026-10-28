import React from "react";
import { useCurrentFrame } from "remotion";
import { Part, Line } from "../Part";
import { X, type XProps } from "../context";
import { Glow } from "../effects";
import { blob, ellipse, roundRect } from "../shapes";
import { palette } from "../style";
import { noise1, rng } from "../random";

const flameShape = blob([[0, 120], [26, 60], [42, 24], [38, -4], [20, -20], [0, -24], [-20, -20], [-38, -4], [-42, 24], [-26, 60]], 8);

/** Layered cartoon flame with frame-driven flicker. Origin = flame base. */
export const Flame: React.FC<XProps & { size?: number; seed?: number }> = ({ size = 1, seed = 0, ...xf }) => {
  const frame = useCurrentFrame();
  const f = frame / 3;
  const layer = (k: number) => ({
    sx: 1 + noise1(f + k * 3, seed + k) * 0.12,
    sy: 1 + noise1(f * 1.3 + k * 5, seed + k + 9) * 0.18,
    rot: noise1(f * 0.8 + k, seed + k + 4) * 0.12,
  });
  return (
    <X {...xf} s={(xf.s ?? 1) * size}>
      <X {...layer(0)}>
        <Part shape={flameShape} color={palette.fireRed} flat outline={6} y={24} />
      </X>
      <X {...layer(1)} s={0.72} z={0.01}>
        <Part shape={flameShape} color={palette.fire} flat outline={0} y={24} />
      </X>
      <X {...layer(2)} s={0.42} z={0.02}>
        <Part shape={flameShape} color={palette.fireCore} flat outline={0} y={24} />
      </X>
    </X>
  );
};

/** Campfire: stones, crossed logs, flame, warm glow and rising sparks. Origin = ground center. */
export const Campfire: React.FC<XProps & { size?: number; glow?: number; seed?: number }> = ({ size = 1, glow = 1, seed = 2, ...xf }) => {
  const frame = useCurrentFrame();
  const flick = 1 + noise1(frame / 4, seed) * 0.12;
  const r = rng(seed);
  const sparks = Array.from({ length: 8 }, () => [r() * 80 - 40, r() * 60, r() * 6.28]);
  return (
    <X {...xf} s={(xf.s ?? 1) * size}>
      <Glow rx={720 * flick} ry={560 * flick} color="#ff9a3c" alpha={0.32 * glow} y={60} additive z={-0.5} />
      <Glow rx={220} color="#ffd27a" alpha={0.45 * glow * flick} y={70} additive z={0.05} />
      {[-110, -70, 70, 110, -35, 35].map((x, i) => (
        <Part key={i} shape={ellipse(30, 18)} color="#8a8790" shade={0.35} x={x} y={i < 4 ? 6 : -8} z={i < 4 ? 0.001 : 0.04} />
      ))}
      <X rot={0.35} y={14} z={0.01}>
        <Part shape={roundRect(170, 30, 14)} color={palette.woodDark} shade={0.3} />
      </X>
      <X rot={-0.35} y={14} z={0.011}>
        <Part shape={roundRect(170, 30, 14)} color="#7a5232" shade={0.3} />
      </X>
      <Flame y={16} seed={seed} z={0.02} />
      {sparks.map(([x, y0, p], i) => {
        const t = ((frame * 2.4 + y0 * 3 + i * 17) % 160) / 160;
        return (
          <Part
            key={`s${i}`}
            shape={ellipse(4, 4)}
            color={palette.fireCore}
            flat
            outline={0}
            opacity={1 - t}
            x={x + Math.sin(frame * 0.1 + p) * 14}
            y={120 + t * 260}
            z={0.06}
          />
        );
      })}
    </X>
  );
};

/** Wall torch. Origin = bracket. */
export const Torch: React.FC<XProps & { seed?: number }> = ({ seed = 1, ...xf }) => {
  const frame = useCurrentFrame();
  const flick = 1 + noise1(frame / 4, seed) * 0.1;
  return (
    <X {...xf}>
      <Glow rx={260 * flick} color="#ffb04a" alpha={0.35} y={90} additive z={-0.2} />
      <X rot={-0.2}>
        <Part shape={roundRect(18, 130, 8)} color={palette.woodDark} y={10} />
        <Part shape={roundRect(34, 30, 8)} color="#4a3a32" y={70} z={0.001} />
      </X>
      <Flame size={0.45} y={86} x={-14} seed={seed} z={0.01} />
      <Line pts={[[-26, -20], [26, -20]]} width={8} z={0.002} />
    </X>
  );
};
