import React from "react";
import { useCurrentFrame } from "remotion";
import { Part, Line } from "../Part";
import { X, type XProps } from "../context";
import { Glow, Gradient, LightCone } from "../effects";
import { blob, circle, ellipse, poly, roundRect, limb } from "../shapes";
import { shadeHex, mixHex } from "../style";
import { rng } from "../random";
import { InkLine } from "../props";
import { WhaleTag, Puffs } from "./whales";

// Ocean sets and props for the blue whale story: underwater and surface sets,
// a research boat with a tagging pole, a steam whale catcher with a harpoon
// cannon, baleen, a fossil skull, the heart, an ECG trace, a balance scale,
// burgers, whale poop, plankton blooms, gauges and bold dimension arrows.

const INKC = "#211b20";
type P = [number, number];
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ───────────────────────── sets ─────────────────────────

/**
 * Underwater backdrop: water gradient (depth 0 near the surface … 1 deep),
 * the bright surface seen from below, swaying light rays, drifting marine snow
 * and an optional sandy seabed. Origin = frame centre; surface at `surfaceY`.
 */
export const Underwater: React.FC<
  XProps & { w?: number; h?: number; depth?: number; surfaceY?: number | null; rays?: number; snow?: number; seabedY?: number | null; seed?: number; tint?: string }
> = ({ w = 7000, h = 5000, depth = 0.3, surfaceY = null, rays = 1, snow = 60, seabedY = null, seed = 5, tint, ...xf }) => {
  const frame = useCurrentFrame();
  const r = rng(seed);
  const top = mixHex(tint ?? "#3fa6c4", "#0e2f55", depth);
  const bottom = mixHex(tint ? shadeHex(tint, 0.45) : "#16507e", "#040d22", depth);
  const flakes = Array.from({ length: snow }, () => [(r() - 0.5) * w * 0.6, (r() - 0.5) * h * 0.5, 2 + r() * 4, r() * 6.28] as [number, number, number, number]);
  const sy = surfaceY ?? h / 2;
  return (
    <X {...xf}>
      <Gradient w={w} h={h} stops={[[0, top], [1, bottom]]} z={-0.5} />
      {surfaceY !== null ? (
        <X y={surfaceY} z={-0.45}>
          <Part shape={roundRect(w, 2000, 0)} color={mixHex(top, "#e6fbff", 0.55)} flat outline={0} y={1000} />
          <Line
            pts={Array.from({ length: 60 }, (_, i) => [-w / 2 + (i / 59) * w, Math.sin(i * 0.9 + frame * 0.06) * 10] as P)}
            smooth
            width={18}
            color={mixHex(top, "#ffffff", 0.75)}
            z={0.01}
          />
          {Array.from({ length: 16 }, (_, i) => {
            const x = -w * 0.3 + i * (w * 0.6 / 16) + Math.sin(frame * 0.03 + i) * 30;
            return <Part key={i} shape={ellipse(60 + (i % 3) * 30, 9)} color="#ffffff" flat outline={0} opacity={0.35 + 0.25 * Math.sin(frame * 0.09 + i * 1.7)} x={x} y={-34 - (i % 4) * 16} z={0.02} />;
          })}
        </X>
      ) : null}
      {rays > 0
        ? [-1400, -700, -120, 520, 1200].map((x, i) => (
            <LightCone
              key={i}
              x={x + Math.sin(frame * 0.012 + i * 1.3) * 80}
              y={sy}
              rot={-0.18 + i * 0.06 + Math.sin(frame * 0.01 + i) * 0.03}
              w={260 + (i % 2) * 140}
              h={2600}
              top={0.35}
              color="#d8fbff"
              alpha={0.12 * rays * (1 - depth * 0.7)}
              z={-0.4 + i * 0.001}
            />
          ))
        : null}
      {flakes.map(([x, y, rr, ph], i) => (
        <Part
          key={i}
          shape={circle(rr)}
          color="#e8f6ff"
          flat
          outline={0}
          opacity={0.25 + 0.2 * Math.sin(ph + frame * 0.05)}
          x={x + Math.sin(frame * 0.02 + ph) * 20}
          y={((y + frame * (0.4 + (i % 3) * 0.2) + h * 0.25) % (h * 0.5)) - h * 0.25}
          z={-0.3}
        />
      ))}
      {seabedY !== null ? (
        <X y={seabedY} z={-0.2}>
          <Part shape={blob([[-w / 2, 0], [-w * 0.3, 40], [-w * 0.1, 10], [w * 0.1, 50], [w * 0.3, 20], [w / 2, 30], [w / 2, -800], [-w / 2, -800]], 6)} color={mixHex("#c9b48a", "#2a3a5a", depth * 0.8)} shade={0.15} />
          {[-1300, -900, -500, 300, 800, 1400].map((x, i) => (
            <Part key={i} shape={blob([[-60, 0], [-40, 50], [20, 60], [60, 10]], 5)} color={mixHex("#8a8a92", "#2a3048", depth * 0.8)} shade={0.25} x={x} y={10 + (i % 2) * 12} z={0.01} />
          ))}
        </X>
      ) : null}
    </X>
  );
};

/** Front water layer for things that break the surface (whale backs, boats): top edge at y=0. */
export const WaterFront: React.FC<XProps & { w?: number; h?: number; color?: string; deep?: string; foam?: boolean; seed?: number }> = ({
  w = 6000,
  h = 1600,
  color = "#3f8fb8",
  deep,
  foam = true,
  seed = 2,
  ...xf
}) => {
  const frame = useCurrentFrame();
  const n = 48;
  const edge: P[] = Array.from({ length: n + 1 }, (_, i) => [-w / 2 + (i / n) * w, Math.sin(i * 1.1 + frame * 0.07 + seed) * 9 + Math.sin(i * 0.37 + frame * 0.04) * 6] as P);
  return (
    <X {...xf}>
      <Part shape={poly([...edge, [w / 2, -h], [-w / 2, -h]])} color={color} flat outline={6} />
      <Gradient w={w} h={h - 40} y={-h / 2 - 20} stops={[[0, color], [1, deep ?? shadeHex(color, 0.3)]]} z={0.001} />
      {foam
        ? Array.from({ length: 22 }, (_, i) => {
            const x = -w / 2 + ((i * 397 + seed * 131) % w);
            const y = -30 - ((i * 61) % 260);
            const a = 0.35 + 0.3 * Math.sin(frame * 0.08 + i);
            return <Line key={i} pts={[[x - 30, y], [x - 10, y + 6], [x + 10, y], [x + 30, y - 6]]} smooth width={5} color="#ffffff" opacity={a} z={0.002} />;
          })
        : null}
    </X>
  );
};

/** Ring of foam / splash around something breaking the surface (rx wide). */
export const SurfaceFoam: React.FC<XProps & { rx?: number; k?: number; seed?: number }> = ({ rx = 300, k = 1, seed = 3, ...xf }) => {
  const frame = useCurrentFrame();
  if (k <= 0.02) return null;
  const n = Math.max(6, Math.round(rx / 34));
  const puffs: [number, number, number][] = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    return [(t - 0.5) * 2 * rx, Math.sin(frame * 0.15 + i * 1.3 + seed) * 4, (18 + ((i * 7 + seed) % 5) * 5) * k];
  });
  return (
    <X {...xf}>
      <X sy={0.45}>
        <Puffs puffs={puffs} outline={4} />
      </X>
    </X>
  );
};

// ───────────────────────── boats ─────────────────────────

/**
 * Research RHIB (rigid inflatable), side view facing right, ~760 px long.
 * Crew go in `children` (stand them at y≈60): drawn between the hull and the
 * front tube, so the tube hides their legs. `bob` = frame for gentle rocking.
 */
export const ResearchBoat: React.FC<XProps & { bob?: number; tube?: string; children?: React.ReactNode }> = ({ bob, tube = "#ef7d32", children, ...xf }) => {
  const rot = bob === undefined ? 0 : Math.sin(bob * 0.05) * 0.025;
  const dy = bob === undefined ? 0 : Math.sin(bob * 0.07) * 6;
  return (
    <X {...xf}>
      <X rot={rot} y={dy}>
        {/* hull + console + engine (behind the crew) */}
        <Part shape={poly([[-360, 40], [330, 40], [400, 70], [300, -40], [-330, -30]])} color="#e8ecef" shade={0.2} z={0} />
        <Part shape={roundRect(140, 150, 14)} color="#f2f4f6" shade={0.2} x={60} y={110} z={0.01}>
          <Part shape={poly([[-56, 66], [50, 66], [30, 116], [-60, 116]])} color="#9fd0e6" flat outline={5} z={0.001} />
        </Part>
        <X x={-380} y={60} z={0.005}>
          <Part shape={roundRect(70, 120, 16)} color="#2a2c34" shade={0.2} />
          <Part shape={roundRect(18, 140, 6)} color="#3a3c44" shade={0.2} y={-100} z={-0.01} />
          <Part shape={roundRect(60, 22, 6)} color="#c8ccd2" flat outline={4} y={34} z={0.001} />
        </X>
        <Part shape={roundRect(30, 120, 8)} color="#c8ccd2" shade={0.2} x={-200} y={130} z={0.01} />
        <X z={0.5}>{children}</X>
        {/* front tube */}
        <Part shape={roundRect(790, 74, 37)} color={tube} shade={0.22} y={52} x={10} z={2}>
          <Line pts={[[-300, 0], [300, 0]]} width={6} color={shadeHex(tube, 0.25)} z={0.001} />
          <Part shape={roundRect(120, 30, 8)} color="#f4f4f6" flat outline={4} x={-120} y={4} z={0.002} />
        </Part>
      </X>
    </X>
  );
};

/** Long carbon tagging pole with the suction-cup tag at the tip (along +x from the hands). */
export const TagPole: React.FC<XProps & { len?: number; tag?: boolean }> = ({ len = 900, tag = true, ...xf }) => (
  <X {...xf}>
    <X rot={Math.PI / 2}>
      <Part shape={limb(len, 18, 14)} color="#3a3c44" shade={0.2} />
    </X>
    {tag ? <WhaleTag x={len + 26} y={0} rot={Math.PI / 2} s={0.8} z={0.01} /> : null}
  </X>
);

/**
 * Steam whale catcher (1900s–1960s), side view facing right, ~1300 px long:
 * high bow with a harpoon cannon, mast with a crow's nest, bridge, tall
 * funnel. `fire` 0..1 = muzzle flash; `smoke` puffs from the funnel; `bob` rocks.
 */
export const WhaleCatcher: React.FC<XProps & { bob?: number; fire?: number; smoke?: boolean; hull?: string; children?: React.ReactNode }> = ({
  bob,
  fire = 0,
  smoke = true,
  hull = "#2c2a30",
  children,
  ...xf
}) => {
  const frame = useCurrentFrame();
  const rot = bob === undefined ? 0 : Math.sin(bob * 0.045) * 0.03;
  const dy = bob === undefined ? 0 : Math.sin(bob * 0.06) * 8;
  return (
    <X {...xf}>
      <X rot={rot} y={dy}>
        {smoke
          ? Array.from({ length: 7 }, (_, i) => {
              const t = ((frame * 0.012 + i / 7) % 1);
              return <Part key={i} shape={circle(40 + t * 90)} color="#5a565e" shade={0.2} opacity={0.85 * (1 - t)} x={-120 - t * 520} y={560 + t * 260} z={-0.05 + i * 0.001} />;
            })
          : null}
        {/* mast + crow's nest */}
        <Part shape={roundRect(22, 620, 6)} color="#6a4a2c" shade={0.2} x={330} y={330} z={-0.03} />
        <Part shape={roundRect(70, 60, 10)} color="#8a6038" shade={0.2} x={330} y={600} z={-0.02} />
        <Line pts={[[330, 640], [620, 60]]} width={4} color={INKC} z={-0.04} />
        <Line pts={[[330, 640], [-560, 90]]} width={4} color={INKC} z={-0.04} />
        {/* funnel */}
        <Part shape={roundRect(110, 300, 10)} color="#2a2a30" shade={0.2} x={-120} y={330} z={-0.01}>
          <Part shape={roundRect(110, 50, 0)} color="#c8362f" flat outline={4} y={90} z={0.001} />
        </Part>
        {/* bridge house */}
        <Part shape={roundRect(360, 170, 12)} color="#f2ece0" shade={0.2} x={30} y={200} z={0}>
          {[-120, -40, 40, 120].map((x) => (
            <Part key={x} shape={roundRect(46, 40, 6)} color="#4a6a8a" flat outline={4} x={x} y={30} z={0.001} />
          ))}
        </Part>
        <Part shape={roundRect(240, 90, 10)} color="#f2ece0" shade={0.2} x={60} y={320} z={0.005} />
        {/* hull */}
        <Part shape={poly([[-640, 130], [480, 130], [600, 190], [660, 210], [560, 0], [420, -120], [-560, -120], [-660, 30]])} color={hull} shade={0.2} z={0.01}>
          <Part shape={poly([[-600, -30], [500, -30], [420, -116], [-552, -116]])} color="#a8322c" flat outline={0} z={0.001} />
          <Line pts={[[-640, 112], [560, 112]]} width={6} color="#f2ece0" z={0.002} />
        </Part>
        {/* gun platform + harpoon cannon */}
        <Part shape={roundRect(120, 60, 8)} color="#4a4850" shade={0.2} x={540} y={220} z={0.02} />
        <X x={550} y={270} z={0.03}>
          <Part shape={roundRect(44, 60, 8)} color="#3a3840" shade={0.2} y={-10} />
          <X rot={0.12}>
            <Part shape={roundRect(200, 40, 12)} color="#2a2830" shade={0.2} x={90} y={14} z={0.001} />
            {fire < 0.98 ? <Part shape={poly([[190, 14], [250, 22], [262, 14], [250, 6]])} color="#c8ccd2" flat outline={4} z={0.002} /> : null}
            {fire > 0 && fire < 0.6 ? (
              <X x={210} y={14} z={0.01}>
                <Glow rx={160} color="#ffcc66" alpha={0.8 * (1 - fire / 0.6)} additive />
                <Part shape={poly([[0, 0], [120, 50], [90, 10], [160, 0], [90, -10], [120, -50]])} color="#ffd45a" flat outline={4} s={1 - fire} />
              </X>
            ) : null}
          </X>
        </X>
        <X z={0.04}>{children}</X>
      </X>
    </X>
  );
};

/** Explosive harpoon with barbs and a trailing rope (rope from -len). Points +x. */
export const Harpoon: React.FC<XProps & { len?: number; rope?: number }> = ({ len = 300, rope = 600, ...xf }) => (
  <X {...xf}>
    {rope > 0 ? <Line pts={[[-len / 2, 0], [-len / 2 - rope * 0.5, -30], [-len / 2 - rope, -10]]} smooth width={5} color="#c8b48a" z={-0.01} /> : null}
    <Part shape={roundRect(len, 14, 6)} color="#5a5a62" shade={0.2} />
    <Part shape={poly([[len / 2, 14], [len / 2 + 70, 0], [len / 2, -14]])} color="#8a8a92" shade={0.2} z={0.001} />
    <Part shape={poly([[len / 2 - 10, 8], [len / 2 - 50, 40], [len / 2 - 40, 8]])} color="#8a8a92" flat outline={4} z={0.002} />
    <Part shape={poly([[len / 2 - 10, -8], [len / 2 - 50, -40], [len / 2 - 40, -8]])} color="#8a8a92" flat outline={4} z={0.002} />
  </X>
);

// ───────────────────────── anatomy & science props ─────────────────────────

/** Row of baleen plates hanging from a jaw (fringed inner edges). Top edge at y=0. */
export const BaleenRow: React.FC<XProps & { n?: number; w?: number; h?: number; color?: string; sway?: number }> = ({ n = 18, w = 900, h = 260, color = "#4a4248", sway = 0, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(w + 60, 60, 24)} color="#c86a76" shade={0.2} y={20} z={0.01} />
    {Array.from({ length: n }, (_, i) => {
      const x = -w / 2 + (i + 0.5) * (w / n);
      const hh = h * (0.75 + 0.25 * Math.sin((i / (n - 1)) * Math.PI));
      const pw = (w / n) * 0.8;
      const sw = Math.sin(sway + i * 0.5) * 6;
      return (
        <X key={i} x={x}>
          <Part shape={poly([[-pw / 2, 0], [pw / 2, 0], [pw * 0.3 + sw, -hh], [-pw * 0.3 + sw, -hh * 0.92]])} color={i % 2 ? color : shadeHex(color, -0.08)} shade={0.15} />
          {Array.from({ length: 5 }, (_, j) => (
            <Line key={j} pts={[[-pw * 0.3 + sw + j * (pw * 0.15), -hh * 0.9], [-pw * 0.32 + sw * 1.6 + j * (pw * 0.15) + 3, -hh - 34]]} width={3} color="#d8ccb8" z={0.001} />
          ))}
        </X>
      );
    })}
  </X>
);

/** Fossil whale skull, top view (rostrum toward +x). `measure` shows the width bar. */
export const WhaleSkull: React.FC<XProps & { w?: number; color?: string; measure?: number }> = ({ w = 700, color = "#e6d6b2", measure = 0, ...xf }) => {
  const s = w / 700;
  return (
    <X {...xf}>
      <X s={s}>
        <Part shape={blob([[350, 0], [200, 50], [40, 110], [-120, 160], [-250, 150], [-330, 80], [-340, 0], [-330, -80], [-250, -150], [-120, -160], [40, -110], [200, -50]], 8)} color={color} shade={0.2}>
          {[-1, 1].map((sd) => (
            <Part key={sd} shape={ellipse(40, 24)} color="#5a4a3a" flat outline={4} x={-150} y={sd * 112} rot={sd * 0.3} z={0.001} />
          ))}
          <Part shape={ellipse(30, 16)} color="#5a4a3a" flat outline={4} x={-30} y={0} z={0.001} />
          <Line pts={[[300, 0], [-20, 0]]} width={5} color={shadeHex(color, 0.25)} z={0.001} />
          {[[-220, 60], [-260, -40], [-80, 90], [120, 40], [180, -30]].map(([x, y], i) => (
            <Part key={i} shape={ellipse(14, 8)} color={shadeHex(color, 0.15)} flat outline={0} x={x} y={y} rot={i} z={0.001} />
          ))}
        </Part>
        {measure > 0 ? <DimArrow x={-160} y={0} rot={Math.PI / 2} len={340 * Math.min(1, measure * 1.4)} color="#fe5649" z={0.02} /> : null}
      </X>
    </X>
  );
};

/** Bold double-headed dimension arrow with end ticks, centred at the origin along +x. */
export const DimArrow: React.FC<XProps & { len: number; color?: string; width?: number; ticks?: boolean }> = ({ len, color = "#fe5649", width = 16, ticks = true, ...xf }) => {
  if (len < 4) return null;
  const hw = width * 1.6;
  return (
    <X {...xf}>
      <Part shape={roundRect(Math.max(4, len - hw * 2), width, width / 2)} color={color} shade={0.12} />
      <Part shape={poly([[len / 2, 0], [len / 2 - hw * 1.6, hw], [len / 2 - hw * 1.6, -hw]])} color={color} shade={0.12} z={0.001} />
      <Part shape={poly([[-len / 2, 0], [-len / 2 + hw * 1.6, hw], [-len / 2 + hw * 1.6, -hw]])} color={color} shade={0.12} z={0.001} />
      {ticks
        ? [-1, 1].map((sd) => <Part key={sd} shape={roundRect(width * 0.7, hw * 3, width * 0.3)} color={color} shade={0.12} x={sd * (len / 2 + width * 0.4)} z={0.002} />)
        : null}
    </X>
  );
};

/** Big cartoon heart (whale heart: chambers, aorta arch, vessels). `beat` 0..1 squeezes it. */
export const WhaleHeart: React.FC<XProps & { size?: number; beat?: number; color?: string }> = ({ size = 1, beat = 0, color = "#b8323a", ...xf }) => {
  const sq = 1 - 0.08 * beat;
  return (
    <X {...xf} s={(xf.s ?? 1) * size}>
      {/* vessels behind */}
      <InkLine pts={[[-40, 150], [-60, 280], [-150, 330], [-220, 300]]} smooth width={70} color="#c8505a" outline={6} z={-0.02} />
      <InkLine pts={[[60, 150], [80, 300], [200, 330], [260, 260], [250, 180]]} smooth width={84} color="#d06a4a" outline={6} z={-0.01} />
      <InkLine pts={[[150, 120], [240, 170], [300, 150]]} smooth width={44} color="#5a6ab0" outline={6} z={-0.015} />
      <X sx={sq} sy={1 / sq}>
        <Part shape={blob([[0, 170], [140, 150], [230, 40], [200, -120], [60, -260], [-20, -300], [-120, -220], [-230, -80], [-230, 70], [-140, 160]], 10)} color={color} shade={0.24}>
          <Line pts={[[-30, 140], [10, 20], [-20, -140], [20, -260]]} smooth width={8} color={shadeHex(color, 0.28)} z={0.001} />
          {[[-140, 60], [100, -40], [-60, -120]].map(([x, y], i) => (
            <Part key={i} shape={ellipse(40, 18)} color={mixHex(color, "#ffffff", 0.25)} flat outline={0} opacity={0.5} x={x} y={y} rot={0.6} z={0.001} />
          ))}
        </Part>
      </X>
    </X>
  );
};

/**
 * ECG / heart-rate trace: a glowing line that scrolls with time `t` (seconds),
 * one spike per beat at `bpm`. Centred, width w, height h (spike height).
 */
export const HeartTrace: React.FC<XProps & { w?: number; h?: number; bpm: number; t: number; window?: number; color?: string; width?: number }> = ({
  w = 900,
  h = 220,
  bpm,
  t,
  window = 6,
  color = "#5af07a",
  width = 8,
  ...xf
}) => {
  const n = 220;
  const pts: P[] = [];
  for (let i = 0; i <= n; i++) {
    const tau = t - window + (i / n) * window;
    const ph = ((tau * bpm) / 60) % 1;
    const p = ph < 0 ? ph + 1 : ph;
    const span = Math.min(0.16, 30 / Math.max(bpm, 1) / window);
    let v = 0;
    if (p < span) {
      const q = p / span;
      v = q < 0.25 ? -0.18 * (q / 0.25) : q < 0.5 ? -0.18 + 1.18 * ((q - 0.25) / 0.25) : q < 0.75 ? 1 - 1.35 * ((q - 0.5) / 0.25) : -0.35 + 0.35 * ((q - 0.75) / 0.25);
    }
    pts.push([-w / 2 + (i / n) * w, v * h]);
  }
  const tip = pts[pts.length - 1];
  return (
    <X {...xf}>
      <Line pts={pts} width={width * 3} color={color} opacity={0.22} />
      <Line pts={pts} width={width} color={color} z={0.001} />
      <Glow rx={50} color={color} alpha={0.7} additive x={tip[0]} y={tip[1]} z={0.002} />
      <Part shape={circle(width * 1.1)} color="#ffffff" flat outline={0} x={tip[0]} y={tip[1]} z={0.003} />
    </X>
  );
};

/** Balance scale; `tilt` -1 (left down) … 1 (right down). Put loads in `left` / `right` (they stay upright). */
export const BalanceScale: React.FC<XProps & { tilt?: number; w?: number; left?: React.ReactNode; right?: React.ReactNode; color?: string }> = ({
  tilt = 0,
  w = 1100,
  left,
  right,
  color = "#c9963f",
  ...xf
}) => {
  const a = -tilt * 0.22;
  const arm = w / 2;
  const end = (sd: number): P => [sd * arm * Math.cos(a), sd * arm * Math.sin(a)];
  const pan = (sd: number, load: React.ReactNode) => {
    const [ex, ey] = end(sd);
    return (
      <X key={sd} x={ex} y={360 + ey}>
        <Line pts={[[0, 0], [-120, -260]]} width={5} color={INKC} z={-0.01} />
        <Line pts={[[0, 0], [120, -260]]} width={5} color={INKC} z={-0.01} />
        <Part shape={blob([[-190, -250], [190, -250], [150, -300], [-150, -300]], 4)} color={shadeHex(color, 0.05)} shade={0.25} z={0.02} />
        <X y={-252} z={0.01}>{load}</X>
      </X>
    );
  };
  return (
    <X {...xf}>
      <Part shape={roundRect(360, 60, 18)} color={shadeHex(color, 0.12)} shade={0.2} y={-330} />
      <Part shape={roundRect(60, 700, 20)} color={color} shade={0.2} y={20} z={0.001} />
      <X y={360} rot={a} z={0.01}>
        <Part shape={roundRect(w + 40, 40, 20)} color={color} shade={0.2} />
        <Part shape={circle(34)} color={shadeHex(color, 0.15)} shade={0.2} z={0.001} />
      </X>
      {pan(-1, left)}
      {pan(1, right)}
    </X>
  );
};

/** Cheeseburger. */
export const Burger: React.FC<XProps & { size?: number }> = ({ size = 1, ...xf }) => (
  <X {...xf} s={(xf.s ?? 1) * size}>
    <Part shape={roundRect(200, 40, 20)} color="#d8a058" shade={0.2} y={-50} />
    <Part shape={roundRect(210, 46, 22)} color="#6a3a22" shade={0.2} y={-14} z={0.001} />
    <Part shape={poly([[-100, 14], [100, 14], [70, -16], [10, -6], [-40, -20]])} color="#f2c23a" flat outline={4} y={0} z={0.002} />
    <Part shape={blob([[-110, 20], [-60, 6], [0, 18], [60, 4], [110, 20], [90, 34], [-90, 34]], 4)} color="#6ab84a" shade={0.15} y={6} z={0.003} />
    <Part shape={blob([[-100, 0], [-80, 60], [0, 84], [80, 60], [100, 0]], 8)} color="#e0a85a" shade={0.22} y={30} z={0.004}>
      {[[-50, 50], [-10, 66], [30, 54], [60, 34], [-70, 24], [10, 34]].map(([x, y], i) => (
        <Part key={i} shape={ellipse(7, 4)} color="#fbf3dc" flat outline={2} x={x} y={y} rot={i} z={0.001} />
      ))}
    </Part>
  </X>
);

/** Whale poop cloud (iron-rich, reddish-brown), spreading with k 0..1. */
export const PoopCloud: React.FC<XProps & { k?: number; seed?: number; sparkle?: boolean }> = ({ k = 1, seed = 6, sparkle = true, ...xf }) => {
  const frame = useCurrentFrame();
  const r = rng(seed);
  const blobs = Array.from({ length: 14 }, () => [(r() - 0.5) * 2, (r() - 0.5) * 2, 0.5 + r() * 0.6] as [number, number, number]);
  const R = 60 + 260 * k;
  return (
    <X {...xf}>
      <Glow rx={R * 1.3} color="#a8502a" alpha={0.25 * Math.min(1, k * 2)} />
      {blobs.map(([u, v, s], i) => (
        <Part key={i} shape={circle(R * 0.32 * s)} color={i % 2 ? "#a65a32" : "#8e4a2a"} flat outline={4} opacity={0.85 - k * 0.25} x={u * R * 0.7} y={v * R * 0.5 + Math.sin(frame * 0.05 + i) * 6} z={i * 0.001} />
      ))}
      {sparkle
        ? Array.from({ length: 10 }, (_, i) => (
            <Part key={`s${i}`} shape={circle(5)} color="#ff9a3a" flat outline={0} x={Math.cos(i * 2.4) * R * 0.8} y={Math.sin(i * 2.4) * R * 0.55} opacity={0.5 + 0.5 * Math.sin(frame * 0.2 + i)} z={0.02} />
          ))
        : null}
    </X>
  );
};

/** Phytoplankton bloom (tiny green cells), density k 0..1 over a w×h band. */
export const PhytoBloom: React.FC<XProps & { w?: number; h?: number; k?: number; n?: number; seed?: number }> = ({ w = 1600, h = 400, k = 1, n = 140, seed = 3, ...xf }) => {
  const frame = useCurrentFrame();
  const r = rng(seed);
  const cells = Array.from({ length: n }, () => ({ x: (r() - 0.5) * w, y: (r() - 0.5) * h, c: r(), kind: r(), ph: r() * 6.28 }));
  return (
    <X {...xf}>
      <Glow rx={w * 0.6 * Math.max(0.3, k)} ry={h * 0.7} color="#7ad85a" alpha={0.25 * k} />
      {cells.map((c, i) =>
        c.c > k ? null : (
          <X key={i} x={c.x + Math.sin(frame * 0.03 + c.ph) * 8} y={c.y + Math.cos(frame * 0.025 + c.ph) * 6} rot={c.ph} z={i * 0.00001}>
            {c.kind < 0.5 ? (
              <Part shape={circle(9)} color={c.kind < 0.25 ? "#6cc04a" : "#9ad85a"} flat outline={3} />
            ) : (
              <Part shape={roundRect(30, 10, 5)} color="#58a84a" flat outline={3} />
            )}
          </X>
        ),
      )}
    </X>
  );
};

/** Round gauge (fuel / energy) from E (left) to F (right); `level` 0..1. */
export const Gauge: React.FC<XProps & { r?: number; level?: number; color?: string; low?: string; high?: string }> = ({ r = 200, level = 0.5, color = "#f6f1e6", low = "#e2584a", high = "#4fd17c", ...xf }) => {
  const a = Math.PI * (1 - Math.max(0, Math.min(1, level)));
  return (
    <X {...xf}>
      <Part shape={circle(r)} color="#2a2c34" shade={0.2} />
      <Part shape={circle(r * 0.86)} color={color} flat outline={4} z={0.001} />
      {Array.from({ length: 9 }, (_, i) => {
        const t = Math.PI * (1 - i / 8);
        return <Line key={i} pts={[[Math.cos(t) * r * 0.66, Math.sin(t) * r * 0.66], [Math.cos(t) * r * 0.8, Math.sin(t) * r * 0.8]]} width={6} color={i < 2 ? low : i > 6 ? high : INKC} z={0.002} />;
      })}
      <X rot={a} z={0.003}>
        <Part shape={poly([[0, 10], [r * 0.7, 0], [0, -10]])} color="#c8362f" flat outline={4} />
      </X>
      <Part shape={circle(r * 0.1)} color={INKC} flat outline={0} z={0.004} />
    </X>
  );
};

/** Thermometer with a rising red column; `level` 0..1. */
export const Thermometer: React.FC<XProps & { h?: number; level?: number }> = ({ h = 500, level = 0.5, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(90, h, 45)} color="#f4f4f6" shade={0.15} />
    <Part shape={circle(80)} color="#f4f4f6" shade={0.15} y={-h / 2} z={-0.001} />
    <Part shape={circle(56)} color="#e2443a" shade={0.2} y={-h / 2} z={0.002} />
    <Part shape={roundRect(40, Math.max(10, (h - 80) * level + 40), 20)} color="#e2443a" flat outline={0} y={-h / 2 + ((h - 80) * level + 40) / 2} z={0.001} />
    {Array.from({ length: 6 }, (_, i) => (
      <Line key={i} pts={[[22, -h / 2 + 90 + i * ((h - 140) / 5)], [42, -h / 2 + 90 + i * ((h - 140) / 5)]]} width={5} color={INKC} z={0.003} />
    ))}
  </X>
);

/** Gold crown prop. */
export const CrownProp: React.FC<XProps & { w?: number }> = ({ w = 260, ...xf }) => {
  const s = w / 260;
  return (
    <X {...xf} s={(xf.s ?? 1) * s}>
      <Part shape={poly([[-130, -60], [130, -60], [140, 70], [70, 10], [0, 90], [-70, 10], [-140, 70]])} color="#f2c23a" shade={0.22} />
      <Part shape={roundRect(270, 40, 10)} color="#e0a82a" shade={0.2} y={-60} z={0.001} />
      {[-90, 0, 90].map((x, i) => (
        <Part key={x} shape={circle(16)} color={["#e2443a", "#3a7ae2", "#4fc06a"][i]} flat outline={4} x={x} y={-60} z={0.002} />
      ))}
      {[[-140, 70], [0, 90], [140, 70]].map(([x, y]) => (
        <Part key={x} shape={circle(14)} color="#f2c23a" shade={0.2} x={x} y={y} z={0.002} />
      ))}
    </X>
  );
};

/** Newspaper (front page): masthead band, photo box, text columns. Write the headline with a pinned Label. */
export const Newspaper: React.FC<XProps & { w?: number; photo?: React.ReactNode }> = ({ w = 520, photo, ...xf }) => {
  const h = w * 1.3;
  return (
    <X {...xf}>
      <Part shape={roundRect(w, h, 8)} color="#f4f0e4" shade={0.12} />
      <Part shape={roundRect(w - 40, 54, 4)} color="#2a2a30" flat outline={0} y={h / 2 - 50} z={0.001} />
      <Part shape={roundRect(w - 40, 6, 3)} color="#2a2a30" flat outline={0} y={h / 2 - 90} z={0.001} />
      <Part shape={roundRect(w * 0.5, w * 0.36, 6)} color="#cfd8de" flat outline={4} x={-w * 0.2} y={-w * 0.05} z={0.001} />
      <X x={-w * 0.2} y={-w * 0.05} z={0.002}>{photo}</X>
      {Array.from({ length: 9 }, (_, i) => (
        <Part key={i} shape={roundRect(w * 0.34, 10, 5)} color="#b8b2a4" flat outline={0} x={w * 0.24} y={w * 0.12 - i * 28} z={0.001} />
      ))}
      {Array.from({ length: 5 }, (_, i) => (
        <Part key={`b${i}`} shape={roundRect(w * 0.84, 10, 5)} color="#b8b2a4" flat outline={0} y={-w * 0.32 - i * 28} z={0.001} />
      ))}
    </X>
  );
};

/** Kitchen sieve (side view): bowl with a mesh and a long handle. */
export const Sieve: React.FC<XProps & { r?: number }> = ({ r = 220, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(r * 1.6, 24, 12)} color="#8a8e96" shade={0.2} x={r * 1.6} y={10} />
    <Part shape={blob([[-r, 0], [r, 0], [r * 0.8, -r * 0.6], [0, -r * 0.8], [-r * 0.8, -r * 0.6]], 8)} color="#c8ccd2" shade={0.22} z={0.001}>
      {Array.from({ length: 7 }, (_, i) => (
        <Line key={i} pts={[[-r * 0.9 + i * r * 0.3, -2], [-r * 0.6 + i * r * 0.2, -r * 0.7]]} width={3} color="#8a8e96" z={0.001} />
      ))}
      {Array.from({ length: 4 }, (_, i) => (
        <Line key={`h${i}`} pts={[[-r * 0.9 + i * 0.05 * r, -r * 0.15 * (i + 1)], [r * 0.9 - i * 0.05 * r, -r * 0.15 * (i + 1)]]} width={3} color="#8a8e96" z={0.001} />
      ))}
    </Part>
    <Part shape={roundRect(r * 2.1, 26, 13)} color="#9a9ea6" shade={0.2} z={0.002} />
  </X>
);

/** Water drops falling (for "pushes the water out"). k = time 0..1 loop. */
export const Drops: React.FC<XProps & { n?: number; w?: number; fall?: number; k: number; color?: string }> = ({ n = 8, w = 300, fall = 300, k, color = "#7ac8f0", ...xf }) => (
  <X {...xf}>
    {Array.from({ length: n }, (_, i) => {
      const t = (k + i / n) % 1;
      return <Part key={i} shape={blob([[0, 18], [10, 0], [0, -10], [-10, 0]], 4)} color={color} flat outline={3} opacity={1 - t} x={-w / 2 + ((i * 37) % 100) / 100 * w} y={-t * fall} z={i * 0.001} />;
    })}
  </X>
);

/** Iron atom badge ("Fe" written with a Label on top). */
export const IronBadge: React.FC<XProps & { r?: number }> = ({ r = 70, ...xf }) => (
  <X {...xf}>
    <Glow rx={r * 1.8} color="#ff9a3a" alpha={0.4} additive z={-0.01} />
    <Part shape={roundRect(r * 2, r * 2, r * 0.4)} color="#e07a3a" shade={0.22} />
  </X>
);

/** Basketball court, side view: wooden floor, hoops at both ends. Floor top at y=0, length `len`. */
export const CourtSide: React.FC<XProps & { len?: number }> = ({ len = 2800, ...xf }) => {
  const hs = len / 2800;
  return (
    <X {...xf}>
      <Part shape={roundRect(len + 200, 60, 6)} color="#d8a868" shade={0.15} y={-30} />
      {Array.from({ length: 10 }, (_, i) => (
        <Line key={i} pts={[[-len / 2 + (i + 0.5) * (len / 10), -2], [-len / 2 + (i + 0.5) * (len / 10), -58]]} width={3} color="#b88848" z={0.001} />
      ))}
      <Part shape={roundRect(10, 60, 3)} color="#f4f4f6" flat outline={0} y={-30} z={0.002} />
      {[-1, 1].map((sd) => (
        <X key={sd} x={sd * len / 2} sx={sd} s={hs}>
          <Part shape={roundRect(40, 900, 10)} color="#5a5e66" shade={0.2} x={60} y={450} />
          <Part shape={roundRect(20, 360, 4)} color="#f4f4f6" shade={0.15} x={20} y={820} z={0.01} />
          <Part shape={roundRect(110, 14, 7)} color="#f07a2a" flat outline={4} x={-40} y={720} z={0.02} />
          {[-80, -60, -40, -20, 0].map((x, i) => (
            <Line key={i} pts={[[x, 714], [x * 0.7 - 10, 620]]} width={3} color="#f4f4f6" z={0.015} />
          ))}
        </X>
      ))}
    </X>
  );
};

/** Grid of small whale icons (population): the first `alive` fraction drawn in colour, the rest faded out. */
export const WhaleTally: React.FC<XProps & { cols?: number; rows?: number; gap?: number; alive?: number; color?: string }> = ({ cols = 20, rows = 8, gap = 90, alive = 1, color = "#5b84ad", ...xf }) => {
  const n = cols * rows;
  const keep = Math.round(n * alive);
  return (
    <X {...xf}>
      {Array.from({ length: n }, (_, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const on = i < keep;
        return (
          <X key={i} x={(c - (cols - 1) / 2) * gap} y={((rows - 1) / 2 - r) * gap * 0.62} z={i * 0.00001}>
            <Part shape={blob([[36, 0], [20, 12], [-20, 10], [-34, 2], [-34, -2], [-10, -10], [24, -10]], 4)} color={on ? color : "#c8ccd2"} flat outline={3} opacity={on ? 1 : 0.35} />
            <Part shape={poly([[-32, 0], [-46, 12], [-44, -12]])} color={on ? color : "#c8ccd2"} flat outline={3} opacity={on ? 1 : 0.35} z={-0.001} />
          </X>
        );
      })}
    </X>
  );
};

export { lerp as oceanLerp };
