import React from "react";
import { useCurrentFrame } from "remotion";
import { Part, Line } from "../Part";
import { X, type XProps } from "../context";
import { Glow } from "../effects";
import { blob, circle, ellipse, roundPoly, roundRect } from "../shapes";
import { palette, shadeHex } from "../style";
import { rng } from "../random";

/**
 * Greek / Persian trireme facing +x. Origin = waterline center.
 * `sink` 0..1 tilts and lowers the ship; `crack` splits the hull.
 */
export const Trireme: React.FC<
  XProps & { len?: number; side?: "greek" | "persian"; sink?: number; crack?: number; sail?: boolean; crew?: number; seed?: number; row?: number }
> = ({ len = 900, side = "greek", sink = 0, crack = 0, sail = true, crew = 5, seed = 1, row = 1, ...xf }) => {
  const frame = useCurrentFrame();
  const hull = side === "greek" ? "#6e4a2c" : "#5a3a2a";
  const band = side === "greek" ? "#2f5f9a" : "#a3302a";
  const sailCol = side === "greek" ? "#f1e6cf" : "#e8d0a0";
  const L = len / 2;
  const hh = len * 0.11;
  const r = rng(seed);
  const oarPhase = (frame / 30) * 1.4 * Math.PI * 2 * row + seed;
  const tilt = sink * -0.45;
  return (
    <X {...xf}>
      <X rot={tilt} y={-sink * hh * 2.4}>
        {/* oars (behind the hull) */}
        {Array.from({ length: 11 }, (_, i) => {
          const x = -L * 0.6 + (i / 10) * L * 1.15;
          const a = Math.sin(oarPhase + i * 0.15) * 0.25 * (1 - sink);
          return (
            <X key={`o${i}`} x={x} y={hh * 0.35} rot={-0.5 + a} z={-0.01}>
              <Line pts={[[0, 0], [0, -hh * 1.6]]} width={6} color="#c9a274" />
            </X>
          );
        })}
        {sail ? (
          <X x={-L * 0.05} z={-0.02}>
            <Part shape={roundRect(12, hh * 3.4, 6)} color={shadeHex(hull, -0.1)} y={hh * 1.7} />
            <Part shape={roundPoly([[-L * 0.32, hh * 3.1], [L * 0.32, hh * 3.1], [L * 0.28, hh * 1.2], [-L * 0.28, hh * 1.2]], 10)} color={sailCol} shade={0.2} z={0.001} />
            {side === "greek" ? (
              <Part shape={circle(hh * 0.45)} color={band} flat outline={4} y={hh * 2.15} z={0.002} />
            ) : (
              <Part shape={roundRect(L * 0.5, hh * 0.3, 4)} color={band} flat outline={0} y={hh * 2.15} z={0.002} />
            )}
          </X>
        ) : null}
        {/* crew heads above the rail */}
        {Array.from({ length: crew }, (_, i) => (
          <Part key={`c${i}`} shape={circle(hh * 0.32)} color="#f6f5f8" shade={0.24} x={-L * 0.45 + (i + 0.5) * ((L * 0.9) / crew) + (r() - 0.5) * 20} y={hh * 1.05} z={-0.005} />
        ))}
        {/* hull */}
        <Part
          shape={blob(
            [
              [-L * 1.02, hh * 1.6],
              [-L * 0.9, hh * 1.15],
              [-L * 0.7, hh * 0.95],
              [0, hh * 0.9],
              [L * 0.78, hh * 0.95],
              [L * 0.95, hh * 1.3],
              [L * 0.98, hh * 0.6],
              [L * 0.9, -hh * 0.2],
              [L * 0.6, -hh * 0.55],
              [-L * 0.6, -hh * 0.55],
              [-L * 0.9, -hh * 0.1],
            ],
            8,
          )}
          color={hull}
          shade={0.22}
          light={{ dir: [-0.4, 1] }}
        />
        <Part shape={roundPoly([[-L * 0.8, hh * 0.55], [L * 0.86, hh * 0.55], [L * 0.84, hh * 0.25], [-L * 0.78, hh * 0.25]], 8)} color={band} flat z={0.001} />
        {Array.from({ length: 11 }, (_, i) => (
          <Part key={`p${i}`} shape={circle(5)} color="#2a1e1a" flat outline={0} x={-L * 0.6 + (i / 10) * L * 1.15} y={hh * 0.1} z={0.002} />
        ))}
        {/* painted eye */}
        <X x={L * 0.78} y={hh * 0.15} z={0.003}>
          <Part shape={ellipse(hh * 0.32, hh * 0.2)} color="#ffffff" flat outline={4} />
          <Part shape={circle(hh * 0.11)} color="#1d1519" flat outline={0} x={hh * 0.06} z={0.001} />
        </X>
        {/* bronze ram */}
        <Part shape={roundPoly([[L * 0.82, -hh * 0.15], [L * 1.18, -hh * 0.38], [L * 0.86, -hh * 0.6]], 6)} color="#c9963f" shade={0.3} z={0.004} />
        {crack > 0 ? (
          <Line pts={[[0, hh * 0.9], [-hh * 0.3, hh * 0.3], [hh * 0.2, -hh * 0.1], [-hh * 0.1, -hh * 0.55]]} width={8 + crack * 6} color="#1d1519" z={0.005} />
        ) : null}
      </X>
      {sink > 0.05 ? <Glow rx={L * 0.9} ry={hh} color="#ffffff" alpha={0.25 * sink} y={0} z={0.01} /> : null}
    </X>
  );
};

/** Water splash burst; t 0..1 over its life. Origin = water surface. */
export const Splash: React.FC<XProps & { t: number; size?: number; seed?: number }> = ({ t, size = 1, seed = 2, ...xf }) => {
  if (t <= 0 || t >= 1) return null;
  const r = rng(seed);
  const drops = Array.from({ length: 12 }, () => [(r() - 0.5) * 2, 0.6 + r() * 0.8, 6 + r() * 10]);
  return (
    <X {...xf} s={(xf.s ?? 1) * size}>
      <Part
        shape={blob([[-90, 0], [-60, 80], [-30, 40], [0, 130], [30, 40], [60, 80], [90, 0]], 6)}
        color="#dff3ff"
        flat
        outline={5}
        sy={Math.sin(t * Math.PI)}
        opacity={1 - t * 0.5}
      />
      {drops.map(([vx, vy, rr], i) => {
        const x = vx * 160 * t;
        const y = vy * 320 * t - 420 * t * t;
        return <Part key={i} shape={circle(rr)} color="#dff3ff" flat outline={4} x={x} y={Math.max(0, y)} opacity={1 - t} z={0.01} />;
      })}
    </X>
  );
};

/** Top-down ship token for maps; facing +x. */
const Token: React.FC<XProps & { color: string }> = ({ color, ...xf }) => (
  <X {...xf}>
    <Part shape={blob([[-34, 0], [-26, 12], [20, 12], [40, 0], [20, -12], [-26, -12]], 6)} color={color} shade={0.2} outline={4} />
    {[-14, 0, 14].map((x) => (
      <Line key={x} pts={[[x, 12], [x - 6, 24]]} width={3} />
    ))}
    {[-14, 0, 14].map((x) => (
      <Line key={`b${x}`} pts={[[x, -12], [x - 6, -24]]} width={3} />
    ))}
  </X>
);

/**
 * Parchment map of the Salamis strait. `t` 0..1 animates the Persian fleet
 * entering and the Greek fleet closing the trap. Origin = center; w x h.
 */
export const StraitMap: React.FC<XProps & { w?: number; h?: number; t?: number }> = ({ w = 900, h = 1300, t = 0, ...xf }) => {
  const enter = Math.min(1, t * 1.6);
  const close = Math.max(0, (t - 0.45) / 0.55);
  const persians = Array.from({ length: 9 }, (_, i) => {
    const row = i % 3;
    const col = Math.floor(i / 3);
    return { x: w * 0.42 - enter * w * 0.5 - col * 90, y: -h * 0.02 + (row - 1) * 70 + col * 10 };
  });
  const greeksTop = Array.from({ length: 5 }, (_, i) => ({ x: -w * 0.32 + i * 85, y: h * 0.2 - close * h * 0.1 }));
  const greeksBot = Array.from({ length: 5 }, (_, i) => ({ x: -w * 0.3 + i * 85, y: -h * 0.24 + close * h * 0.12 }));
  return (
    <X {...xf}>
      <Part shape={roundRect(w, h, 18)} color="#e9dcb8" shade={0.08} />
      <Part shape={roundRect(w - 60, h - 60, 10)} color="#9ec8d8" flat outline={5} z={0.001} />
      {/* mainland (top) and Salamis island (bottom) */}
      <Part
        shape={blob([[-w * 0.47, h * 0.46], [w * 0.47, h * 0.46], [w * 0.47, h * 0.18], [w * 0.2, h * 0.12], [-w * 0.05, h * 0.2], [-w * 0.3, h * 0.13], [-w * 0.47, h * 0.18]], 8)}
        color="#d9c48e"
        shade={0.12}
        z={0.002}
      />
      <Part
        shape={blob([[-w * 0.47, -h * 0.46], [w * 0.1, -h * 0.46], [w * 0.15, -h * 0.3], [-w * 0.05, -h * 0.16], [-w * 0.3, -h * 0.18], [-w * 0.47, -h * 0.12]], 8)}
        color="#d9c48e"
        shade={0.12}
        z={0.002}
      />
      {persians.map((p, i) => (
        <Token key={`p${i}`} color="#c0362c" x={p.x} y={p.y} rot={Math.PI} z={0.01 + i * 0.001} />
      ))}
      {greeksTop.map((p, i) => (
        <Token key={`g${i}`} color="#2f5f9a" x={p.x} y={p.y} rot={-Math.PI / 2 + 0.3} z={0.02 + i * 0.001} />
      ))}
      {greeksBot.map((p, i) => (
        <Token key={`h${i}`} color="#2f5f9a" x={p.x} y={p.y} rot={Math.PI / 2 - 0.3} z={0.03 + i * 0.001} />
      ))}
      {close > 0.3 ? (
        <Line
          pts={Array.from({ length: 25 }, (_, k) => {
            const a = (k / 24) * Math.PI * 2;
            return [Math.cos(a) * 230 - w * 0.08, Math.sin(a) * 160 - h * 0.02] as [number, number];
          })}
          width={7}
          color={palette.red}
          opacity={Math.min(1, (close - 0.3) * 3)}
          z={0.05}
        />
      ) : null}
    </X>
  );
};


