import React from "react";
import { useCurrentFrame } from "remotion";
import { Part, Line } from "../Part";
import { X, type XProps } from "../context";
import { Glow } from "../effects";
import { blob, circle, ellipse, poly, roundPoly, roundRect } from "../shapes";
import { palette, shadeHex, mixHex } from "../style";
import { rng, noise1 } from "../random";
import { Smoke, Flame } from "./fire";
import { cloudShape } from "./nature";

// WWII Pacific / wartime-Japan set pieces.

const IJN_GREEN = "#4f5d3a";
const IJN_GREY = "#c9c6b6";
const NAVY_GREY = "#8994a3";

/** Japanese red-sun roundel (white rim). */
export const Hinomaru: React.FC<XProps & { r?: number; rim?: boolean }> = ({ r = 30, rim = true, ...xf }) => (
  <X {...xf}>
    {rim ? <Part shape={circle(r + 6)} color="#f4f1ea" flat outline={3} /> : null}
    <Part shape={circle(r)} color="#c8262f" flat outline={rim ? 0 : 3} z={0.001} />
  </X>
);

/** Four-engine bomber (B-17 style), side view facing +x. Origin = fuselage centre. */
export const Bomber: React.FC<XProps & { insignia?: "us" | "raf"; color?: string; spin?: number }> = ({ insignia = "us", color = "#7c7a5c", spin = 1, ...xf }) => (
  <X {...xf}>
    <Part shape={blob([[-400, 40], [-330, 210], [-280, 200], [-270, 40]], 8)} color={color} shade={0.22} z={-0.01} />
    <Part
      shape={blob([[-420, 30], [-300, 60], [0, 66], [260, 56], [340, 30], [360, 0], [330, -30], [240, -48], [0, -52], [-300, -36], [-420, 10]], 10)}
      color={color}
      shade={0.2}
    />
    <Part shape={blob([[300, 40], [360, 14], [372, -6], [340, -30], [290, -20]], 8)} color="#bfe6f6" flat outline={5} opacity={0.6} z={0.01} />
    <Part shape={blob([[120, 56], [170, 86], [230, 80], [250, 54]], 6)} color="#bfe6f6" flat outline={5} opacity={0.6} z={0.01} />
    <X x={20} y={-10} z={0.02}>
      <Part shape={roundRect(360, 26, 12)} color={shadeHex(color, 0.06)} shade={0.2} />
      {[-110, 70].map((x) => (
        <X key={x} x={x} y={-6}>
          <Part shape={roundRect(90, 50, 22)} color={shadeHex(color, 0.12)} shade={0.25} />
          <Part shape={ellipse(10, 70)} color="#b8b6ae" flat outline={0} opacity={0.35 * spin} x={50} z={0.001} />
        </X>
      ))}
    </X>
    {insignia === "us" ? (
      <X x={-170} y={8} z={0.03}>
        <Part shape={circle(30)} color="#2f3f7a" flat outline={3} />
        <Part shape={poly(Array.from({ length: 10 }, (_, i) => {
          const a = Math.PI / 2 + (i * Math.PI) / 5;
          const r = i % 2 ? 11 : 26;
          return [Math.cos(a) * r, Math.sin(a) * r] as [number, number];
        }))} color="#ffffff" flat outline={0} z={0.001} />
      </X>
    ) : (
      <X x={-170} y={8} z={0.03}>
        <Part shape={circle(32)} color="#2f3f7a" flat outline={3} />
        <Part shape={circle(22)} color="#f4f1ea" flat outline={0} z={0.001} />
        <Part shape={circle(12)} color="#c8262f" flat outline={0} z={0.002} />
      </X>
    )}
  </X>
);

/** Arched airfield hangar. Origin = ground centre. */
export const Hangar: React.FC<XProps & { w?: number; h?: number; color?: string }> = ({ w = 560, h = 300, color = "#8a8a7a", ...xf }) => (
  <X {...xf}>
    <Part shape={roundPoly([[-w / 2, 0], [w / 2, 0], [w / 2, h * 0.55], [w * 0.3, h * 0.92], [0, h], [-w * 0.3, h * 0.92], [-w / 2, h * 0.55]], [4, 4, 20, 40, 60, 40, 20])} color={color} shade={0.22}>
      {[-0.35, -0.15, 0.05, 0.25].map((k) => (
        <Line key={k} pts={[[k * w, h * 0.2], [k * w + w * 0.02, h * 0.95]]} width={3} color={shadeHex(color, 0.3)} z={0.001} />
      ))}
    </Part>
    <Part shape={roundRect(w * 0.6, h * 0.6, 6)} color="#2c2a2e" flat outline={5} y={h * 0.3} z={0.01} />
  </X>
);

/** Windsock on a pole. Origin = pole base. */
export const Windsock: React.FC<XProps & { h?: number; wind?: number }> = ({ h = 260, wind = 1, ...xf }) => {
  const frame = useCurrentFrame();
  const flap = Math.sin(frame * 0.3) * 0.08;
  return (
    <X {...xf}>
      <Line pts={[[0, 0], [0, h]]} width={8} color="#6e6a62" />
      <X y={h - 10} rot={-0.15 * (1 - wind) - flap} z={0.01}>
        {[0, 1, 2, 3].map((i) => (
          <Part key={i} shape={poly([[i * 30, 22 - i * 3], [i * 30 + 30, 19 - i * 3], [i * 30 + 30, -19 + i * 3], [i * 30, -22 + i * 3]])} color={i % 2 ? "#f4f1ea" : "#e05a2a"} flat outline={3} />
        ))}
      </X>
    </X>
  );
};

/** Cherry tree in bloom. Origin = ground centre of the trunk. */
export const SakuraTree: React.FC<XProps & { h?: number; seed?: number; bloom?: string }> = ({ h = 420, seed = 2, bloom = "#f6c1d1", ...xf }) => {
  const r = rng(seed);
  const clumps = Array.from({ length: 5 }, (_, i) => [(i - 2) * h * 0.2 + (r() - 0.5) * 30, h * (0.66 + (i % 2) * 0.14) + r() * 20, h * (0.2 + r() * 0.06)]);
  return (
    <X {...xf}>
      <Part shape={blob([[-24, 0], [24, 0], [18, h * 0.45], [70, h * 0.66], [56, h * 0.7], [8, h * 0.56], [-10, h * 0.72], [-26, h * 0.7], [-14, h * 0.48]], 6)} color="#5a3a2e" shade={0.25} />
      {clumps.map(([x, y, rr], i) => (
        <Part key={i} shape={cloudShape(rr * 2.6, rr * 1.8, 5, seed * 7 + i)} color={i % 2 ? bloom : mixHex(bloom, "#ffffff", 0.22)} shade={0.24} x={x} y={y - rr * 0.6} z={0.01 + i * 0.001} />
      ))}
      {Array.from({ length: 22 }, (_, i) => (
        <Part key={`d${i}`} shape={circle(4 + r() * 3)} color={i % 3 ? "#ffffff" : "#e88aa8"} flat outline={0} opacity={0.9} x={(r() - 0.5) * h * 1.0} y={h * (0.55 + r() * 0.4)} z={0.02} />
      ))}
    </X>
  );
};

/** Falling cherry petals across an area (frame-driven). Origin = centre. */
export const Petals: React.FC<XProps & { w?: number; h?: number; n?: number; seed?: number; speed?: number }> = ({ w = 2000, h = 1200, n = 30, seed = 4, speed = 1, ...xf }) => {
  const frame = useCurrentFrame();
  const r = rng(seed);
  const items = Array.from({ length: n }, () => [r() * w, r() * h, 0.6 + r() * 0.8, r() * 6]);
  return (
    <X {...xf}>
      {items.map(([x0, y0, sp, ph], i) => {
        const t = frame * speed;
        const y = h / 2 - ((y0 + t * 1.6 * sp) % h);
        const x = -w / 2 + ((x0 + t * 1.1 * sp + Math.sin(t * 0.05 + ph) * 30) % w);
        return <Part key={i} shape={ellipse(9, 5)} color={i % 3 ? "#f6c1d1" : "#fbe0e8"} flat outline={2} x={x} y={y} rot={t * 0.05 + ph} />;
      })}
    </X>
  );
};

/** The imperial chrysanthemum crest (16 petals). Origin = centre. */
export const Kikumon: React.FC<XProps & { r?: number; color?: string }> = ({ r = 100, color = palette.gold, ...xf }) => (
  <X {...xf}>
    {Array.from({ length: 16 }, (_, i) => {
      const a = (i / 16) * Math.PI * 2;
      return (
        <X key={i} rot={a} z={i * 0.0001}>
          <Part shape={roundPoly([[r * 0.3, -r * 0.085], [r * 0.95, -r * 0.16], [r, 0], [r * 0.95, r * 0.16], [r * 0.3, r * 0.085]], [4, r * 0.12, r * 0.12, r * 0.12, 4])} color={color} shade={0.18} />
        </X>
      );
    })}
    <Part shape={circle(r * 0.36)} color={color} shade={0.2} z={0.01} />
    <Part shape={circle(r * 0.26)} color={shadeHex(color, 0.12)} flat outline={3} z={0.011} />
  </X>
);

/** Burned-out city block (ruined walls, chimneys, rubble). Origin = ground centre. */
export const Ruins: React.FC<XProps & { w?: number; seed?: number; smoke?: boolean }> = ({ w = 1600, seed = 3, smoke = true, ...xf }) => {
  const r = rng(seed);
  const walls = Array.from({ length: 7 }, (_, i) => [-w / 2 + (i + 0.5) * (w / 7) + (r() - 0.5) * 60, 120 + r() * 160, 90 + r() * 80, r()]);
  return (
    <X {...xf}>
      {walls.map(([x, h, ww, k], i) =>
        k < 0.3 ? (
          <Part key={i} shape={roundRect(34, h * 1.6, 4)} color="#7a5a4a" shade={0.25} x={x} y={h * 0.8} z={i * 0.001} />
        ) : (
          <Part
            key={i}
            shape={poly([[x - ww / 2, 0], [x + ww / 2, 0], [x + ww / 2, h * 0.6], [x + ww * 0.2, h], [x, h * 0.7], [x - ww * 0.3, h * 0.9], [x - ww / 2, h * 0.5]])}
            color={mixHex("#8a8078", "#3a3230", r() * 0.4)}
            shade={0.22}
            z={i * 0.001}
          />
        ),
      )}
      {Array.from({ length: 9 }, (_, i) => (
        <Part key={`r${i}`} shape={blob([[-50, 0], [50, 0], [30, 30], [-20, 36]], 6)} color={i % 2 ? "#6a5a50" : "#5a4a42"} shade={0.2} x={-w / 2 + r() * w} y={6} z={0.01 + i * 0.001} />
      ))}
      {[-0.3, 0.1, 0.35].map((k, i) => (
        <Line key={`b${i}`} pts={[[k * w, 0], [k * w + 60, 140 + i * 30]]} width={12} color="#2a2220" z={0.02} />
      ))}
      {smoke ? <Smoke x={-w * 0.2} y={200} w={160} h={1100} alpha={0.35} seed={seed} z={0.03} /> : null}
    </X>
  );
};

/** Black-market stall: wooden frame, tarp roof, a table of goods. Origin = ground centre. */
export const MarketStall: React.FC<XProps & { w?: number; tarp?: string }> = ({ w = 420, tarp = "#6a6a52", ...xf }) => (
  <X {...xf}>
    {[-1, 1].map((k) => (
      <Line key={k} pts={[[k * w * 0.45, 0], [k * w * 0.45, 300]]} width={10} color="#6e4a2c" />
    ))}
    <Part shape={roundPoly([[-w * 0.56, 280], [w * 0.56, 280], [w * 0.5, 340], [-w * 0.5, 340]], 8)} color={tarp} shade={0.22} z={0.01}>
      {[-0.3, 0, 0.3].map((k) => (
        <Line key={k} pts={[[k * w, 284], [k * w, 336]]} width={3} color={shadeHex(tarp, 0.3)} z={0.001} />
      ))}
    </Part>
    <Part shape={roundRect(w * 0.9, 24, 6)} color="#8a5a32" shade={0.2} y={110} z={0.02} />
    <Part shape={roundRect(w * 0.84, 100, 6)} color="#6e4a2c" shade={0.22} y={50} z={0.015} />
  </X>
);

/** Showa-era pharmacy front with a noren curtain. Origin = ground centre. Write the sign with a Label. */
export const ShopFront: React.FC<XProps & { w?: number; h?: number; wall?: string; noren?: string }> = ({ w = 640, h = 480, wall = "#b98a5a", noren = "#2f3f6a", ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(w, h, 6)} color={wall} shade={0.2} y={h / 2} />
    <Part shape={roundPoly([[-w * 0.58, h - 10], [w * 0.58, h - 10], [w * 0.5, h + 70], [-w * 0.5, h + 70]], 8)} color="#4a4a52" shade={0.2} z={0.01} />
    <Part shape={roundRect(w * 0.6, 70, 8)} color="#2a1e18" shade={0.15} y={h * 0.82} z={0.012} />
    <Part shape={roundRect(w * 0.42, h * 0.5, 4)} color="#2c2a2e" flat outline={5} x={-w * 0.18} y={h * 0.25} z={0.011} />
    {[-2, -1, 0, 1].map((i) => (
      <Part key={i} shape={roundRect(w * 0.1, h * 0.26, 3)} color={noren} shade={0.2} x={-w * 0.18 + (i + 0.5) * w * 0.104} y={h * 0.38} z={0.013} />
    ))}
    <Part shape={roundRect(w * 0.3, h * 0.36, 4)} color="#cfe6ee" flat outline={5} opacity={0.85} x={w * 0.26} y={h * 0.3} z={0.011} />
    {[-0.08, 0, 0.08].map((k, i) => (
      <Part key={k} shape={roundRect(18, 44, 6)} color={["#7a3a1a", "#2f6f6a", "#c9963f"][i]} shade={0.25} x={w * 0.26 + k * w} y={h * 0.22} z={0.012} />
    ))}
  </X>
);

/** Long two-storey wooden school building. Origin = ground centre. */
export const WoodenSchool: React.FC<XProps & { w?: number; h?: number }> = ({ w = 1400, h = 360, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(w, h, 6)} color="#a87b52" shade={0.2} y={h / 2} />
    <Part shape={roundPoly([[-w * 0.53, h - 6], [w * 0.53, h - 6], [w * 0.46, h + 110], [-w * 0.46, h + 110]], 8)} color="#4a4a54" shade={0.2} z={0.01} />
    {[0.22, 0.68].map((ky) =>
      Array.from({ length: 9 }, (_, i) => (
        <Part key={`${ky}${i}`} shape={roundRect(w * 0.07, h * 0.24, 3)} color="#d9eef4" flat outline={4} x={-w * 0.43 + i * w * 0.107} y={h * ky} z={0.011}>
          <Line pts={[[0, -h * 0.12], [0, h * 0.12]]} width={3} color="#5a3a26" z={0.001} />
        </Part>
      )),
    )}
    <Line pts={[[-w / 2, h * 0.46], [w / 2, h * 0.46]]} width={6} color="#6e4a2c" z={0.012} />
  </X>
);

/** Wooden watchtower with a searchlight. Origin = ground centre. */
export const WatchTower: React.FC<XProps & { h?: number }> = ({ h = 520, ...xf }) => (
  <X {...xf}>
    {[-1, 1].map((k) => (
      <Line key={k} pts={[[k * 70, 0], [k * 50, h]]} width={14} color="#5a3a26" />
    ))}
    {[0.25, 0.5, 0.75].map((k) => (
      <Line key={k} pts={[[-70 + 20 * k, h * k], [70 - 20 * k, h * k]]} width={8} color="#5a3a26" z={0.001} />
    ))}
    <Part shape={roundRect(180, 26, 6)} color="#6e4a2c" shade={0.2} y={h} z={0.01} />
    <Part shape={roundRect(170, 60, 6)} color="#7a5232" shade={0.2} y={h + 40} z={0.005} />
    <Part shape={roundPoly([[-110, h + 150], [110, h + 150], [0, h + 210]], 8)} color="#4a4a54" shade={0.2} y={0} z={0.012} />
    <Line pts={[[-90, h + 70], [-90, h + 150]]} width={6} color="#5a3a26" z={0.011} />
    <Line pts={[[90, h + 70], [90, h + 150]]} width={6} color="#5a3a26" z={0.011} />
  </X>
);

/** Cartoon explosion burst, t 0..1 over its life. Origin = centre. */
export const Burst: React.FC<XProps & { t: number; size?: number; seed?: number }> = ({ t, size = 1, seed = 2, ...xf }) => {
  if (t <= 0 || t >= 1) return null;
  const k = Math.sin(Math.min(1, t * 1.6) * Math.PI * 0.5);
  const fade = 1 - Math.max(0, (t - 0.6) / 0.4);
  const spikes = (r: number) =>
    Array.from({ length: 18 }, (_, i) => {
      const a = (i / 18) * Math.PI * 2 + seed;
      const rr = i % 2 ? r * 0.62 : r;
      return [Math.cos(a) * rr, Math.sin(a) * rr] as [number, number];
    });
  return (
    <X {...xf} s={(xf.s ?? 1) * size * k}>
      <Glow rx={360} color="#ffb04a" alpha={0.6 * fade} additive />
      <Part shape={poly(spikes(200))} color="#f2a33a" flat outline={6} opacity={fade} />
      <Part shape={poly(spikes(130))} color="#ffe27a" flat outline={0} opacity={fade} z={0.01} />
      <Smoke y={60} w={160} h={700} alpha={0.5 * fade} seed={seed} z={-0.01} />
    </X>
  );
};

/** Dark anti-aircraft flak puffs scattered over an area. */
export const Flak: React.FC<XProps & { w?: number; h?: number; n?: number; seed?: number }> = ({ w = 1600, h = 500, n = 10, seed = 6, ...xf }) => {
  const frame = useCurrentFrame();
  const r = rng(seed);
  const items = Array.from({ length: n }, () => [(r() - 0.5) * w, (r() - 0.5) * h, r() * 40, 30 + r() * 30]);
  return (
    <X {...xf}>
      {items.map(([x, y, ph, rr], i) => {
        const life = ((frame + ph * 3) % 50) / 50;
        const s = 0.4 + life * 0.8;
        return (
          <Part key={i} shape={circle(rr)} color="#3a3a42" flat outline={4} opacity={Math.max(0, 0.9 - life)} x={x + noise1(frame / 30, i) * 8} y={y} s={s} z={i * 0.001} />
        );
      })}
    </X>
  );
};

/** Paper sliding-door wall (shoji). Origin = bottom centre. */
export const ShojiWall: React.FC<XProps & { w?: number; h?: number; paper?: string }> = ({ w = 1200, h = 520, paper = "#f6efd9", ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(w, h, 4)} color={paper} shade={0.12} y={h / 2} />
    {Array.from({ length: Math.round(w / 80) + 1 }, (_, i) => (
      <Line key={`v${i}`} pts={[[-w / 2 + i * 80, 0], [-w / 2 + i * 80, h]]} width={i % 3 === 0 ? 10 : 4} color="#7a5a3a" z={0.001} />
    ))}
    {Array.from({ length: Math.round(h / 90) + 1 }, (_, i) => (
      <Line key={`h${i}`} pts={[[-w / 2, i * 90], [w / 2, i * 90]]} width={4} color="#7a5a3a" z={0.001} />
    ))}
  </X>
);

/** Tatami floor (straw mats). Origin = top-centre edge of the floor. */
export const Tatami: React.FC<XProps & { w?: number; h?: number }> = ({ w = 2400, h = 600, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(w, h, 0)} color="#c9b97a" flat outline={0} y={-h / 2} />
    {Array.from({ length: Math.round(w / 300) + 1 }, (_, i) => (
      <Line key={i} pts={[[-w / 2 + i * 300, 0], [-w / 2 + i * 300 - 80, -h]]} width={6} color="#5a4a2a" z={0.001} />
    ))}
    <Line pts={[[-w / 2, -h * 0.45], [w / 2, -h * 0.45]]} width={6} color="#5a4a2a" z={0.001} />
  </X>
);

/** Low Japanese table (chabudai / zataku). Origin = floor centre. */
export const LowTable: React.FC<XProps & { w?: number }> = ({ w = 520, ...xf }) => (
  <X {...xf}>
    {[-1, 1].map((k) => (
      <Part key={k} shape={roundRect(26, 90, 6)} color="#4a2e22" shade={0.25} x={k * (w / 2 - 50)} y={45} />
    ))}
    <Part shape={roundRect(w, 30, 10)} color="#6e3e2a" shade={0.2} y={100} z={0.01} />
  </X>
);
