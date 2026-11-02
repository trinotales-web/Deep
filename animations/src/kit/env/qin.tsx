import React from "react";
import { useCurrentFrame } from "remotion";
import { Part, Line } from "../Part";
import { X, type XProps } from "../context";
import { Glow } from "../effects";
import { blob, circle, ellipse, limb, poly, roundPoly, roundRect } from "../shapes";
import { palette, shadeHex, mixHex } from "../style";
import { rng } from "../random";
import { Flame } from "./fire";
import { cloudShape } from "./nature";
import { geoXY } from "./pacific";
import geoEA from "./geo/eastAsia.json";
import geoWS from "./geo/warringStates.json";

// Ancient China (Qin dynasty, 3rd century BC) set pieces, drawn to match the
// reference "First Emperor's tomb" short: palace, tomb interior, traps,
// treasure, the burial mound (building, finished, cross-section), carriage and
// horses, ships, terracotta army, and a Warring States map on real coastlines.

type P = [number, number];
const RED = "#b8322a";
const LACQUER = "#1e1a20";
const GOLD = palette.gold;
const CLAY = "#b88a62";
const STONE = "#5f7a7c";

// ───────────────────────── palace ─────────────────────────

/** Red lacquered column with gold bands, stone base and bracket capital. Origin = floor. */
export const RedPillar: React.FC<XProps & { h?: number; w?: number }> = ({ h = 900, w = 70, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(w + 40, 40, 8)} color="#8a8790" shade={0.22} y={20} />
    <Part shape={roundRect(w, h, 6)} color={RED} shade={0.22} y={40 + h / 2} z={0.001}>
      {[80, h - 60].map((y) => (
        <Part key={y} shape={roundRect(w + 6, 20, 4)} color={GOLD} flat outline={3} y={40 + y - h / 2} z={0.001} />
      ))}
    </Part>
    <Part shape={roundPoly([[-w / 2 - 30, h + 40], [w / 2 + 30, h + 40], [w / 2 + 14, h + 80], [-w / 2 - 14, h + 80]], 6)} color="#3a2a26" shade={0.2} z={0.002} />
  </X>
);

/** Hanging paper lantern. Origin = hanging point. */
export const Lantern: React.FC<XProps & { color?: string; cord?: number; glow?: number }> = ({ color = "#d9433a", cord = 120, glow = 0.4, ...xf }) => {
  const frame = useCurrentFrame();
  return (
    <X {...xf} rot={(xf.rot ?? 0) + Math.sin(frame * 0.05) * 0.03}>
      <Line pts={[[0, 0], [0, -cord]]} width={4} />
      <X y={-cord - 70}>
        {glow > 0 ? <Glow rx={160} color="#ffcf7a" alpha={glow} additive z={-0.01} /> : null}
        <Part shape={roundRect(26, 14, 3)} color={LACQUER} flat outline={3} y={68} />
        <Part shape={ellipse(54, 66)} color={color} shade={0.2} z={0.001}>
          {[-30, 0, 30].map((x) => (
            <Line key={x} pts={[[x, -60], [x * 1.2, 0], [x, 60]]} smooth width={3} color={shadeHex(color, 0.35)} z={0.001} />
          ))}
        </Part>
        <Part shape={roundRect(26, 14, 3)} color={LACQUER} flat outline={3} y={-68} z={0.002} />
        <Line pts={[[0, -75], [0, -120]]} width={5} color={GOLD} z={0.002} />
      </X>
    </X>
  );
};

/** The emperor's throne on a stepped dais. Origin = floor centre. */
export const QinThrone: React.FC<XProps & { w?: number }> = ({ w = 520, ...xf }) => (
  <X {...xf}>
    {[0, 1, 2].map((i) => (
      <Part key={i} shape={roundRect(w + 260 - i * 80, 40, 4)} color={i % 2 ? "#3a2a26" : LACQUER} shade={0.2} y={20 + i * 40} z={i * 0.001}>
        <Line pts={[[-(w + 200 - i * 80) / 2, 20 + i * 40], [(w + 200 - i * 80) / 2, 20 + i * 40]]} width={3} color={GOLD} z={0.001} />
      </Part>
    ))}
    <X y={120} z={0.01}>
      <Part shape={roundRect(w, 520, 14)} color={LACQUER} shade={0.2} y={300} />
      <Part shape={roundRect(w - 70, 440, 8)} color={RED} shade={0.15} y={320} z={0.001} />
      {[-1, 1].map((k) => (
        <Line
          key={k}
          pts={Array.from({ length: 26 }, (_, i) => {
            const a = i * 0.45;
            const r = 70 - i * 2.4;
            return [k * 80 + Math.cos(a) * r * k, 380 + Math.sin(a) * r] as P;
          })}
          smooth
          width={7}
          color={GOLD}
          z={0.002}
        />
      ))}
      <Part shape={roundRect(w + 40, 70, 10)} color={LACQUER} shade={0.2} y={40} z={0.01} />
      <Part shape={roundRect(w - 40, 34, 8)} color="#7a2a2a" shade={0.2} y={86} z={0.011} />
      {[-1, 1].map((k) => (
        <Part key={k} shape={roundRect(50, 170, 12)} color={LACQUER} shade={0.22} x={k * (w / 2 + 10)} y={120} z={0.012} />
      ))}
    </X>
  </X>
);

// ───────────────────────── tomb interior ─────────────────────────

/** Stone-brick tomb wall with a dark frieze of gold diamond tiles. Origin = floor centre. */
export const TombWall: React.FC<XProps & { w?: number; h?: number; color?: string; frieze?: boolean }> = ({ w = 4000, h = 1400, color = STONE, frieze = true, ...xf }) => {
  const rows = Math.ceil(h / 70);
  return (
    <X {...xf}>
      <Part shape={roundRect(w, h, 0)} color={color} flat outline={0} y={h / 2} />
      {Array.from({ length: rows }, (_, r) => (
        <X key={r} y={r * 70} z={0.001}>
          <Line pts={[[-w / 2, 0], [w / 2, 0]]} width={3} color={shadeHex(color, 0.28)} />
          {Array.from({ length: Math.ceil(w / 160) + 1 }, (_, i) => {
            const x = -w / 2 + i * 160 + (r % 2) * 80;
            return <Line key={i} pts={[[x, 0], [x, 70]]} width={3} color={shadeHex(color, 0.28)} />;
          })}
        </X>
      ))}
      {frieze ? (
        <X y={h * 0.62} z={0.002}>
          <Part shape={roundRect(w, 90, 0)} color="#1e1c22" flat outline={4} />
          {Array.from({ length: Math.ceil(w / 150) }, (_, i) => (
            <X key={i} x={-w / 2 + 75 + i * 150} z={0.001}>
              <Part shape={roundRect(120, 64, 4)} color="#2a2830" flat outline={3} />
              <Part shape={poly([[0, 24], [24, 0], [0, -24], [-24, 0]])} color="#c9963f" shade={0.2} z={0.001} />
            </X>
          ))}
        </X>
      ) : null}
    </X>
  );
};

/** Dark flagstone floor with scattered stones. Origin = top edge (the wall foot). */
export const StoneFloor: React.FC<XProps & { w?: number; h?: number; color?: string; seed?: number }> = ({ w = 4000, h = 900, color = "#46585c", seed = 3, ...xf }) => {
  const r = rng(seed);
  return (
    <X {...xf}>
      <Part shape={roundRect(w, h, 0)} color={color} flat outline={0} y={-h / 2} />
      <Line pts={[[-w / 2, 0], [w / 2, 0]]} width={6} z={0.001} />
      {Array.from({ length: 5 }, (_, i) => (
        <Line key={i} pts={[[-w / 2, -60 - i * i * 30], [w / 2, -60 - i * i * 30]]} width={3} color={shadeHex(color, 0.3)} z={0.001} />
      ))}
      {Array.from({ length: 10 }, (_, i) => (
        <Part key={`s${i}`} shape={blob([[-40, 0], [40, 0], [30, 16], [-24, 18]], 6)} color={shadeHex(color, 0.15)} shade={0.2} x={(r() - 0.5) * w * 0.6} y={-90 - r() * 300} s={0.6 + r() * 0.8} z={0.002} />
      ))}
    </X>
  );
};

/** Wall torch on an iron bracket. Origin = bracket. */
export const WallTorch: React.FC<XProps & { seed?: number }> = ({ seed = 1, ...xf }) => (
  <X {...xf}>
    <Glow rx={260} y={110} color="#ffb35a" alpha={0.32} additive z={-0.01} />
    <Line pts={[[0, 0], [0, 40]]} width={8} color="#2a2622" />
    <X rot={-0.15}>
      <Part shape={roundPoly([[-10, 0], [10, 0], [16, 90], [-16, 90]], 4)} color="#7a5232" shade={0.2} y={10} />
      <Part shape={roundRect(40, 22, 6)} color="#3a3230" flat outline={3} y={100} z={0.001} />
      <Flame y={108} size={0.45} seed={seed} z={0.002} />
    </X>
  </X>
);

/** Small bronze oil lamp held by hand (flame on top). Origin = grip. */
export const OilLamp: React.FC<XProps & { lit?: boolean; seed?: number }> = ({ lit = true, seed = 2, ...xf }) => (
  <X {...xf}>
    {lit ? <Glow rx={300} y={70} color="#ffcf7a" alpha={0.45} additive z={-0.01} /> : null}
    <Part shape={roundRect(16, 60, 6)} color="#8a6a3a" shade={0.22} y={20} />
    <Part shape={blob([[-46, 50], [46, 50], [34, 70], [-34, 70]], 6)} color="#a8823a" shade={0.22} z={0.001} />
    {lit ? <Flame y={72} size={0.32} seed={seed} z={0.002} /> : null}
  </X>
);

/** Self-firing repeating crossbow on a wooden stand, aimed toward +x. `fire` 0..1 sends the bolt. Origin = floor. */
export const CrossbowTrap: React.FC<XProps & { fire?: number; range?: number }> = ({ fire = 0, range = 900, ...xf }) => (
  <X {...xf}>
    {[-1, 1].map((k) => (
      <Line key={k} pts={[[0, 120], [k * 60, 0]]} width={10} color="#5a3a26" />
    ))}
    <X y={130} z={0.01}>
      <Part shape={roundRect(240, 26, 8)} color="#7a5232" shade={0.22} x={20} />
      <Part shape={roundRect(70, 50, 6)} color="#5a3a26" shade={0.22} x={-30} y={34} z={0.001} />
      <Line pts={[[120, 0], [106, 70], [86, 104]]} smooth width={12} color="#5a3a26" z={0.002} />
      <Line pts={[[120, 0], [106, -70], [86, -104]]} smooth width={12} color="#5a3a26" z={0.002} />
      <Line pts={[[86, 104], [fire > 0 ? 120 : 40, 0], [86, -104]]} width={3} color="#e9e2cf" z={0.003} />
      <X x={40 + fire * range} z={0.004}>
        <Line pts={[[0, 0], [110, 0]]} width={6} color="#3a2a20" />
        <Part shape={poly([[110, 10], [138, 0], [110, -10]])} color="#8a8790" flat outline={3} />
        <Part shape={poly([[0, 0], [-18, 12], [-10, 0], [-18, -12]])} color="#c8262f" flat outline={2.5} />
      </X>
    </X>
  </X>
);

/** Red-and-black lacquer treasure chest with gold meander trim. Origin = floor. */
export const TreasureChest: React.FC<XProps & { w?: number }> = ({ w = 260, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(w, w * 0.55, 10)} color={LACQUER} shade={0.22} y={w * 0.275} />
    <Part shape={roundRect(w - 24, w * 0.2, 6)} color={RED} shade={0.15} y={w * 0.42} z={0.001} />
    <Line
      pts={Array.from({ length: 13 }, (_, i) => [-w / 2 + 20 + i * ((w - 40) / 12), w * 0.14 + (i % 2 ? 12 : 0)] as P)}
      width={5}
      color={GOLD}
      z={0.001}
    />
    <Part shape={roundRect(w + 14, w * 0.14, 6)} color={LACQUER} shade={0.2} y={w * 0.6} z={0.002} />
    {[-1, 1].map((k) => (
      <Part key={k} shape={circle(14)} color={GOLD} flat outline={3.5} x={k * (w / 2 + 4)} y={w * 0.3} z={0.003} />
    ))}
  </X>
);

/** Jade "bi" disc. */
export const JadeDisc: React.FC<XProps & { r?: number }> = ({ r = 40, ...xf }) => (
  <X {...xf}>
    <Part shape={circle(r)} color="#4fa07a" shade={0.2} />
    <Part shape={circle(r * 0.35)} color="#2a3a32" flat outline={3} z={0.001} />
  </X>
);

/** Bronze ding cauldron (three legs, two handles). Origin = floor. */
export const Ding: React.FC<XProps & { w?: number }> = ({ w = 160, ...xf }) => (
  <X {...xf}>
    {[-0.35, 0, 0.35].map((k) => (
      <Part key={k} shape={roundRect(18, 60, 6)} color="#3f7a64" shade={0.2} x={k * w} y={30} z={-0.001} />
    ))}
    <Part shape={blob([[-w / 2, 120], [w / 2, 120], [w * 0.42, 70], [0, 54], [-w * 0.42, 70]], 8)} color="#4f8a72" shade={0.22} />
    {[-1, 1].map((k) => (
      <Part key={k} shape={roundRect(22, 46, 8)} color="#3f7a64" shade={0.2} x={k * w * 0.36} y={140} z={-0.001} />
    ))}
    <Line pts={[[-w * 0.4, 100], [w * 0.4, 100]]} width={4} color="#2a5a48" z={0.001} />
  </X>
);

/** Pottery storage jar. Origin = floor. */
export const Jar: React.FC<XProps & { h?: number; color?: string }> = ({ h = 160, color = "#b86a3a", ...xf }) => (
  <X {...xf}>
    <Part shape={blob([[-h * 0.22, 0], [h * 0.22, 0], [h * 0.36, h * 0.5], [h * 0.2, h * 0.86], [-h * 0.2, h * 0.86], [-h * 0.36, h * 0.5]], 8)} color={color} shade={0.24} y={0} />
    <Part shape={roundRect(h * 0.36, h * 0.12, 4)} color={shadeHex(color, 0.15)} shade={0.2} y={h * 0.9} z={0.001} />
  </X>
);

/** Round Qin coin (ban liang) with a square hole. */
export const Coin: React.FC<XProps & { r?: number }> = ({ r = 16, ...xf }) => (
  <X {...xf}>
    <Part shape={circle(r)} color="#d9a441" shade={0.2} />
    <Part shape={roundRect(r * 0.6, r * 0.6, 1)} color="#2a2420" flat outline={2} z={0.001} />
  </X>
);

/** Flowing river of liquid mercury (silver band with moving highlights). Origin = centre. */
export const MercuryRiver: React.FC<XProps & { w?: number; h?: number; speed?: number }> = ({ w = 1600, h = 60, speed = 1, ...xf }) => {
  const frame = useCurrentFrame();
  return (
    <X {...xf}>
      <Glow rx={w * 0.55} ry={h * 2} color="#dfe8f2" alpha={0.25} additive z={-0.01} />
      <Part shape={roundRect(w, h, h / 2)} color="#b8c4d0" shade={0.18} />
      {Array.from({ length: Math.round(w / 90) }, (_, i) => {
        const x = ((i * 90 + frame * 3 * speed) % w) - w / 2;
        return <Line key={i} pts={[[x, h * 0.1], [x + 40, h * 0.1]]} width={5} color="#ffffff" opacity={0.85} z={0.001} />;
      })}
      <Line pts={[[-w / 2 + 20, -h * 0.25], [w / 2 - 20, -h * 0.25]]} width={4} color="#8a96a4" z={0.001} />
    </X>
  );
};

/** Night ceiling of stars with constellation lines. Origin = centre. */
export const StarCeiling: React.FC<XProps & { w?: number; h?: number; seed?: number; color?: string }> = ({ w = 1600, h = 500, seed = 4, color = "#141a33", ...xf }) => {
  const frame = useCurrentFrame();
  const r = rng(seed);
  const stars = Array.from({ length: Math.round((w * h) / 9000) }, () => [(r() - 0.5) * w, (r() - 0.5) * h, r()]);
  const groups = Array.from({ length: 4 }, (_, g) => Array.from({ length: 4 }, () => [(-0.35 + g * 0.23 + (r() - 0.5) * 0.14) * w, (r() - 0.3) * h * 0.6] as P));
  return (
    <X {...xf}>
      <Part shape={roundRect(w, h, 0)} color={color} flat outline={0} />
      {stars.map(([x, y, k], i) => (
        <Part key={i} shape={circle(2 + k * 3)} color="#f4f1ea" flat outline={0} x={x} y={y} opacity={0.6 + 0.4 * Math.sin(frame * 0.1 + i)} z={0.001} />
      ))}
      {groups.map((g, i) => (
        <X key={`g${i}`} z={0.002}>
          <Line pts={g} width={2} color="#c9d2f0" opacity={0.6} />
          {g.map(([x, y], j) => (
            <Part key={j} shape={circle(5)} color="#ffffff" flat outline={0} x={x} y={y} />
          ))}
        </X>
      ))}
    </X>
  );
};

/** Chinese palace hall with an upturned tiled roof. Origin = ground centre. */
export const ChineseHall: React.FC<XProps & { w?: number; h?: number; wall?: string; roof?: string; tiers?: number }> = ({ w = 360, h = 160, wall = RED, roof = "#2a3a3e", tiers = 1, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(w + 40, 30, 4)} color="#a8a49a" shade={0.2} y={15} />
    <Part shape={roundRect(w - 40, h, 4)} color={wall} shade={0.2} y={30 + h / 2} z={0.001}>
      {Array.from({ length: 5 }, (_, i) => (
        <Line key={i} pts={[[-w / 2 + 40 + (i * (w - 80)) / 4, 30], [-w / 2 + 40 + (i * (w - 80)) / 4, 30 + h]]} width={4} color={shadeHex(wall, 0.35)} z={0.001} />
      ))}
      <Part shape={roundRect(w * 0.18, h * 0.6, 3)} color="#3a2420" flat outline={3} y={30 + h * 0.3} z={0.002} />
    </Part>
    {Array.from({ length: tiers }, (_, t) => {
      const y = 30 + h + t * h * 0.7;
      const ww = w * (1 - t * 0.25);
      return (
        <X key={t} y={y} z={0.01 + t * 0.01}>
          <Part
            shape={blob([[-ww / 2 - 70, 30], [-ww / 2 - 40, 10], [-ww / 2, 0], [ww / 2, 0], [ww / 2 + 40, 10], [ww / 2 + 70, 30], [ww / 2 + 20, 50], [ww * 0.3, 90], [-ww * 0.3, 90], [-ww / 2 - 20, 50]], 8)}
            color={roof}
            shade={0.22}
          />
          <Part shape={roundRect(ww * 0.64, 14, 5)} color={shadeHex(roof, 0.2)} flat outline={3} y={92} z={0.001} />
          {t < tiers - 1 ? <Part shape={roundRect(ww * 0.62, h * 0.5, 3)} color={wall} shade={0.2} y={90 + h * 0.2} z={-0.001} /> : null}
        </X>
      );
    })}
  </X>
);

/** Heavy stone gate that drops (`drop` 0..1) to seal a passage. Origin = floor centre of the doorway. */
export const StoneGate: React.FC<XProps & { w?: number; h?: number; drop?: number }> = ({ w = 520, h = 620, drop = 1, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(w + 120, h + 90, 6)} color="#3a4648" shade={0.2} y={(h + 90) / 2} z={-0.02} />
    <Part shape={roundRect(w, h, 4)} color="#0e1214" flat outline={5} y={h / 2} z={-0.01} />
    <X y={h * (1 - drop)} z={0.01}>
      <Part shape={roundRect(w - 10, h, 6)} color="#6e7c7e" shade={0.24} y={h / 2}>
        {[0.3, 0.62].map((k) => (
          <Line key={k} pts={[[-w / 2 + 20, h * k], [w / 2 - 20, h * k + 8]]} width={4} color="#4a5658" z={0.001} />
        ))}
        {[-1, 1].map((k) => (
          <Part key={k} shape={circle(22)} color="#3a4648" flat outline={4} x={k * w * 0.18} y={h * 0.45} z={0.002} />
        ))}
      </Part>
    </X>
    <Part shape={roundRect(w + 140, 60, 6)} color="#4a5658" shade={0.2} y={h + 40} z={0.02} />
  </X>
);

// ───────────────────────── the burial mound ─────────────────────────

/** Leafy tree for the planted mound (round crown). Origin = ground. */
export const RoundTree: React.FC<XProps & { h?: number; color?: string; seed?: number }> = ({ h = 180, color = "#4f8a3e", seed = 1, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(18, h * 0.5, 6)} color="#6e4a2c" shade={0.2} y={h * 0.25} />
    <Part shape={cloudShape(h * 0.9, h * 0.75, seed)} color={color} shade={0.22} y={h * 0.62} z={0.001} />
  </X>
);

/**
 * The emperor's burial mound, side view. `stage` "build" = stepped earth
 * pyramid with ramps, ladders and scaffolds; "done" = rounded hill planted
 * with trees. Origin = ground centre.
 */
export const BurialMound: React.FC<XProps & { w?: number; h?: number; stage?: "build" | "done"; seed?: number }> = ({ w = 1400, h = 520, stage = "done", seed = 3, ...xf }) => {
  if (stage === "build") {
    const tiers = 5;
    return (
      <X {...xf}>
        {Array.from({ length: tiers }, (_, i) => {
          const tw = w * (1 - i * 0.17);
          const y = (i * h) / tiers;
          return (
            <Part
              key={i}
              shape={roundPoly([[-tw / 2, y], [tw / 2, y], [tw / 2 - 40, y + h / tiers], [-tw / 2 + 40, y + h / tiers]], 6)}
              color={i % 2 ? "#d9b27a" : "#cfa56c"}
              shade={0.2}
              z={i * 0.001}
            >
              <Line pts={[[-tw / 2 + 30, y + h / tiers / 2], [tw / 2 - 30, y + h / tiers / 2]]} width={3} color="#a8824e" z={0.001} />
            </Part>
          );
        })}
        {[[-0.3, 0, 0.45], [0.15, 1, 0.38], [-0.05, 2, 0.3]].map(([k, t, len], i) => (
          <Line key={i} pts={[[k * w, (t * h) / tiers + 8], [k * w + len * w * 0.5, ((t + 1) * h) / tiers - 4]]} width={12} color="#8a6a3e" z={0.01} />
        ))}
        {[[0.32, 0], [-0.2, 2]].map(([k, t], i) => (
          <X key={`l${i}`} x={k * w} y={(t * h) / tiers} z={0.012}>
            <Line pts={[[-14, 0], [-14, h / tiers + 10]]} width={6} color="#6e4a2c" />
            <Line pts={[[14, 0], [14, h / tiers + 10]]} width={6} color="#6e4a2c" />
            {[0.2, 0.45, 0.7, 0.95].map((q) => (
              <Line key={q} pts={[[-14, (h / tiers) * q], [14, (h / tiers) * q]]} width={5} color="#6e4a2c" />
            ))}
          </X>
        ))}
        <X y={h} z={0.02}>
          {[-1, 1].map((k) => (
            <Line key={k} pts={[[k * 60, 0], [0, 140]]} width={7} color="#6e4a2c" />
          ))}
          <Line pts={[[0, 140], [40, 60]]} width={3} />
          <Part shape={roundRect(30, 26, 6)} color="#a8823a" shade={0.2} x={40} y={50} />
        </X>
      </X>
    );
  }
  const r = rng(seed);
  const dome = (t: number) => Math.sqrt(Math.max(0, 1 - t * t));
  const crowns: [number, number, number, number][] = [];
  const rowsN = 6;
  for (let row = 0; row < rowsN; row++) {
    const yk = (row + 0.5) / rowsN;
    const halfW = (w / 2) * Math.sqrt(Math.max(0, 1 - yk * yk)) * 0.9;
    const n = Math.max(1, Math.round((halfW * 2) / 120));
    for (let i = 0; i < n; i++) {
      const x = -halfW + ((i + 0.5) / n) * halfW * 2 + (r() - 0.5) * 30;
      crowns.push([x, yk * h * 0.92 + (r() - 0.5) * 16, 110 + r() * 30, crowns.length]);
    }
  }
  return (
    <X {...xf}>
      <Part
        shape={blob(Array.from({ length: 13 }, (_, i) => {
          const t = -1 + (i / 12) * 2;
          return [t * (w / 2), Math.max(4, dome(t) * h)] as P;
        }).concat([[w / 2, 0], [-w / 2, 0]]), 6)}
        color="#4f8a3e"
        shade={0.22}
      />
      {crowns.map(([x, y, s, i]) => (
        <Part key={i} shape={cloudShape(s, s * 0.72, seed + i)} color={["#5a9a46", "#4f8a3e", "#66a850"][i % 3]} shade={0.22} x={x} y={y} z={0.001 + (h - y) * 0.000001} />
      ))}
    </X>
  );
};

/**
 * Cross-section of the mound: earth layers above an underground palace
 * (star ceiling, halls, mountains and rivers of mercury). `stage` shows the
 * mound on top. Origin = ground centre (the palace lies below y = 0).
 */
export const MoundSection: React.FC<XProps & { w?: number; depth?: number; stage?: "build" | "done" | "none" }> = ({ w = 1700, depth = 760, stage = "done", ...xf }) => (
  <X {...xf}>
    {[0, 1, 2, 3].map((i) => (
      <Part key={i} shape={roundRect(w * 3, depth / 4 + 4, 0)} color={["#b8875a", "#a87a50", "#9a6e48", "#8a6240"][i]} flat outline={0} y={-(i + 0.5) * (depth / 4)} z={-0.02 + i * 0.001} />
    ))}
    <Line pts={[[-w * 1.5, 0], [w * 1.5, 0]]} width={6} z={-0.01} />
    <X y={-depth * 0.55} z={0.01}>
      <Part shape={roundRect(w * 0.82, depth * 0.62, 60)} color="#141a33" flat outline={7} />
      <StarCeiling w={w * 0.78} h={depth * 0.3} y={depth * 0.14} color="#141a33" z={0.001} />
      {[-0.28, 0.02, 0.3].map((k, i) => (
        <ChineseHall key={i} x={k * w} y={-depth * 0.12} w={150} h={70} tiers={i === 1 ? 2 : 1} s={0.85} z={0.01} />
      ))}
      {[-0.4, -0.14, 0.17, 0.42].map((k, i) => (
        <Part key={`m${i}`} shape={roundPoly([[-50, 0], [0, 80], [50, 0]], [6, 14, 6])} color="#3f8a7a" shade={0.2} x={k * w * 0.95} y={-depth * 0.12} z={0.005} />
      ))}
      <MercuryRiver w={w * 0.76} h={34} y={-depth * 0.2} z={0.02} />
    </X>
    {stage === "none" ? null : <BurialMound w={w * 0.75} h={300} stage={stage} z={0.03} />}
  </X>
);

// ───────────────────────── travel ─────────────────────────

/** Horse, side view facing +x, origin = ground under the body. `walk` animates the legs. */
export const Horse: React.FC<XProps & { color?: string; mane?: string; walk?: number; seed?: number; clay?: boolean }> = ({ color = "#8a5a3a", mane = "#2a2220", walk = 0, seed = 0, clay = false, ...xf }) => {
  const frame = useCurrentFrame();
  const ph = frame * 0.32 * walk + seed;
  const leg = (x: number, k: number, far: boolean) => (
    <X x={x} y={190} rot={Math.sin(ph + k) * 0.35 * walk} z={far ? -0.02 : 0.02}>
      <Part shape={limb(170, 46, 30)} color={far ? shadeHex(color, 0.15) : color} shade={0.22} />
      <Part shape={roundRect(30, 22, 6)} color="#2a2220" flat outline={3} y={-174} z={0.001} />
    </X>
  );
  return (
    <X {...xf}>
      {leg(-110, 0, true)}
      {leg(100, Math.PI, true)}
      <Part shape={blob([[-170, 230], [-140, 290], [0, 300], [120, 290], [170, 250], [150, 190], [0, 175], [-150, 185]], 10)} color={color} shade={0.22} />
      <Part shape={blob([[110, 270], [150, 330], [200, 400], [236, 400], [250, 372], [190, 300], [170, 240]], 8)} color={color} shade={0.22} z={0.005} />
      <X x={240} y={386} rot={-0.75} z={0.01}>
        <Part shape={blob([[-20, 30], [70, 26], [96, 0], [80, -24], [-10, -22], [-30, 0]], 8)} color={color} shade={0.22} />
        <Part shape={circle(6)} color="#211b20" flat outline={0} x={8} y={6} z={0.001} />
        <Part shape={poly([[-26, 20], [-14, 52], [-4, 22]])} color={color} shade={0.2} z={-0.001} />
      </X>
      {!clay ? (
        <Part shape={blob([[120, 300], [160, 350], [206, 420], [216, 400], [180, 330], [150, 290]], 6)} color={mane} flat z={0.012} />
      ) : (
        <Part shape={roundPoly([[150, 300], [196, 384], [214, 372], [168, 290]], 4)} color={shadeHex(color, 0.15)} flat z={0.012} />
      )}
      <Part shape={blob([[-166, 270], [-200, 230], [-214, 150], [-196, 140], [-176, 220]], 6)} color={clay ? shadeHex(color, 0.15) : mane} shade={0.2} z={-0.01} />
      {leg(-120, Math.PI, false)}
      {leg(110, 0, false)}
    </X>
  );
};

/** Spoked cart wheel. */
export const Wheel: React.FC<XProps & { r?: number; spin?: number; color?: string }> = ({ r = 90, spin = 0, color = "#5a3a26", ...xf }) => (
  <X {...xf} rot={(xf.rot ?? 0) + spin}>
    <Part shape={circle(r)} color={color} shade={0.2} />
    <Part shape={circle(r * 0.8)} color={shadeHex(color, -0.25)} flat outline={4} z={0.001} />
    {Array.from({ length: 8 }, (_, i) => (
      <Line key={i} pts={[[0, 0], [Math.cos((i * Math.PI) / 4) * r * 0.8, Math.sin((i * Math.PI) / 4) * r * 0.8]]} width={7} color={color} z={0.002} />
    ))}
    <Part shape={circle(r * 0.16)} color="#2a2220" flat outline={3} z={0.003} />
  </X>
);

/** The emperor's covered carriage pulled by horses (facing +x). Origin = ground under the box. */
export const ImperialCarriage: React.FC<XProps & { horses?: number; walk?: number }> = ({ horses = 2, walk = 0, ...xf }) => {
  const frame = useCurrentFrame();
  return (
    <X {...xf}>
      <Line pts={[[120, 120], [520, 170]]} width={12} color="#3a2a20" z={-0.03} />
      {Array.from({ length: horses }, (_, i) => (
        <Horse key={i} x={560 + i * 30} y={i * 10} s={0.9} walk={walk} seed={i * 1.3} color={i % 2 ? "#6e4a32" : "#8a5a3a"} z={-0.02 + i * 0.01} />
      ))}
      <Part shape={roundRect(360, 200, 14)} color={LACQUER} shade={0.22} y={230} z={0.01}>
        <Part shape={roundRect(110, 70, 6)} color="#2a2026" flat outline={4} x={70} y={240} z={0.001} />
        <Line
          pts={Array.from({ length: 15 }, (_, i) => [-160 + i * 23, 150 + (i % 2 ? 10 : 0)] as P)}
          width={5}
          color={GOLD}
          z={0.001}
        />
        <Line pts={[[-180, 300], [180, 300]]} width={6} color={RED} z={0.001} />
      </Part>
      <Part shape={blob([[-240, 330], [-180, 380], [0, 410], [180, 380], [240, 330], [0, 350]], 10)} color="#2a3a3e" shade={0.22} z={0.02} />
      <Wheel x={-30} y={100} r={100} spin={-frame * 0.08 * walk} z={0.03} />
    </X>
  );
};

/** Two-wheeled handcart piled with salted fish (`smell` adds wavy stink lines). Origin = ground. */
export const FishCart: React.FC<XProps & { smell?: number; seed?: number }> = ({ smell = 0, seed = 2, ...xf }) => {
  const frame = useCurrentFrame();
  const r = rng(seed);
  const fish = Array.from({ length: 14 }, () => [(r() - 0.5) * 300, 150 + r() * 90, (r() - 0.5) * 0.8]);
  return (
    <X {...xf}>
      <Line pts={[[150, 130], [330, 70]]} width={10} color="#6e4a2c" z={-0.01} />
      <Part shape={roundRect(340, 80, 8)} color="#8a6440" shade={0.22} y={130} />
      {fish.map(([x, y, rot], i) => (
        <X key={i} x={x} y={y} rot={rot} z={0.01 + i * 0.001}>
          <Part shape={blob([[-50, 0], [-10, 16], [40, 8], [56, 0], [40, -8], [-10, -16]], 6)} color={i % 2 ? "#a8b4bc" : "#98a4ae"} shade={0.22} />
          <Part shape={poly([[-48, 0], [-72, 16], [-66, 0], [-72, -16]])} color="#8a96a0" flat outline={3} />
          <Part shape={circle(3.5)} color="#211b20" flat outline={0} x={38} y={3} z={0.001} />
        </X>
      ))}
      <Wheel y={70} r={70} z={0.05} />
      {smell > 0
        ? [-80, 20, 110].map((x, i) => {
            const k = ((frame * 0.02 + i / 3) % 1);
            return (
              <Line
                key={i}
                pts={Array.from({ length: 8 }, (_, j) => [x + Math.sin(j * 1.2 + frame * 0.1) * 14, 260 + k * 160 + j * 22] as P)}
                smooth
                width={7}
                color="#7aa64a"
                opacity={smell * (1 - k)}
                z={0.1}
              />
            );
          })
        : null}
    </X>
  );
};

/** Ancient Chinese sailing ship (Xu Fu's fleet), facing +x. Origin = waterline centre. */
export const AncientShip: React.FC<XProps & { len?: number; sail?: string; heads?: number }> = ({ len = 600, sail = "#c9a274", heads = 4, ...xf }) => {
  const frame = useCurrentFrame();
  const L = len / 2;
  return (
    <X {...xf} rot={(xf.rot ?? 0) + Math.sin(frame * 0.06) * 0.02}>
      {[0.12, -0.18].map((k, i) => (
        <X key={i} x={k * L} y={len * 0.12} z={-0.01 + i * 0.001}>
          <Line pts={[[0, 0], [0, len * 0.55]]} width={8} color="#5a3a26" />
          <Part shape={roundPoly([[-len * 0.16, len * 0.1], [len * 0.14, len * 0.1], [len * 0.12, len * 0.5], [-len * 0.13, len * 0.52]], 6)} color={sail} shade={0.2} z={0.001}>
            {[0.2, 0.3, 0.4].map((q) => (
              <Line key={q} pts={[[-len * 0.15, len * q], [len * 0.13, len * q]]} width={4} color={shadeHex(sail, 0.35)} z={0.001} />
            ))}
          </Part>
        </X>
      ))}
      {Array.from({ length: heads }, (_, i) => (
        <Part key={`h${i}`} shape={circle(len * 0.03)} color="#f6f5f8" shade={0.22} x={-L * 0.5 + i * len * 0.12} y={len * 0.16} z={0.005} />
      ))}
      <Part shape={roundPoly([[-L * 1.05, len * 0.2], [-L * 0.8, len * 0.12], [L * 0.8, len * 0.12], [L * 1.08, len * 0.22], [L * 0.86, -len * 0.04], [-L * 0.86, -len * 0.04]], [8, 4, 4, 8, 14, 14])} color="#7a5232" shade={0.22} z={0.01}>
        <Line pts={[[-L * 0.9, len * 0.06], [L * 0.9, len * 0.06]]} width={4} color="#5a3a26" z={0.001} />
      </Part>
    </X>
  );
};

// ───────────────────────── terracotta army ─────────────────────────

const PAINT = ["#b8322a", "#3f8a5a", "#7a4a9a", "#2f5fa8"];

/** One simplified terracotta statue for crowds (front view). `paint` 0..1 shows the original colours. */
export const ClaySoldier: React.FC<XProps & { paint?: number; seed?: number }> = ({ paint = 0, seed = 0, ...xf }) => {
  const robe = mixHex(CLAY, PAINT[seed % 4], paint);
  const face = mixHex(CLAY, "#f2c9b8", paint);
  const hair = mixHex(shadeHex(CLAY, 0.18), "#1e1a20", paint);
  return (
    <X {...xf}>
      <Part shape={roundRect(70, 120, 12)} color={mixHex(shadeHex(CLAY, 0.06), "#3a3438", paint)} shade={0.22} y={60} />
      <Part shape={roundPoly([[-56, 110], [56, 110], [46, 240], [-46, 240]], [10, 10, 24, 24])} color={robe} shade={0.22} y={0} z={0.001}>
        {[150, 180, 210].map((y) => (
          <Line key={y} pts={[[-44, y], [44, y]]} width={3} color={shadeHex(robe, 0.35)} z={0.001} />
        ))}
      </Part>
      <Part shape={circle(46)} color={face} shade={0.22} y={286} z={0.002} />
      <Part shape={blob([[-46, 290], [-40, 320], [0, 334], [40, 320], [46, 290], [20, 306], [-20, 306]], 6)} color={hair} shade={0.22} z={0.003} />
      <Part shape={circle(16)} color={hair} shade={0.22} x={22} y={334} z={0.003} />
      {[-12, 12].map((x) => (
        <Part key={x} shape={circle(4)} color="#211b20" flat outline={0} x={x} y={290} z={0.004} />
      ))}
      <Line pts={[[-12, 270], [0, 266], [12, 270]]} width={3} z={0.004} />
    </X>
  );
};

/**
 * Pit of the terracotta army: earthen corridors with rows of statues receding
 * into the distance. `paint` 0..1, `burn` 0..1 adds scorch marks and gaps.
 * Origin = front edge centre.
 */
export const TerracottaPit: React.FC<XProps & { w?: number; rows?: number; cols?: number; paint?: number; burn?: number }> = ({ w = 1900, rows = 5, cols = 9, paint = 0, burn = 0, ...xf }) => {
  const r = rng(11);
  return (
    <X {...xf}>
      <Part shape={roundRect(w * 1.4, 900, 0)} color="#b08458" flat outline={0} y={450} z={-0.1} />
      {Array.from({ length: rows }, (_, i) => {
        const ri = rows - 1 - i;
        const sc = 1 - ri * 0.14;
        const y = ri * 120;
        return (
          <X key={ri} y={y} z={i * 0.1}>
            <Part shape={roundRect(w * 1.4, 60 * sc, 0)} color="#c99a68" shade={0.15} y={-20} />
            <Line pts={[[-w * 0.7, 10 * sc], [w * 0.7, 10 * sc]]} width={4} color="#8a6440" z={0.001} />
            {Array.from({ length: Math.round(cols / sc) }, (_, j) => {
              const n = Math.round(cols / sc);
              const x = (j - (n - 1) / 2) * (w / n);
              const gone = burn > 0 && r() < burn * 0.18;
              return gone ? null : <ClaySoldier key={j} x={x} y={-10} s={0.62 * sc} paint={paint} seed={j + ri} z={0.01 + j * 0.0001} />;
            })}
          </X>
        );
      })}
      {burn > 0
        ? Array.from({ length: 6 }, (_, i) => (
            <Part key={`b${i}`} shape={blob([[-90, 0], [80, 10], [110, 40], [-60, 50]], 6)} color="#3a2a22" flat outline={0} opacity={0.5 * burn} x={(r() - 0.5) * w} y={r() * 400} z={1} />
          ))
        : null}
    </X>
  );
};

// ───────────────────────── hand props ─────────────────────────

/** Bronze dagger (blade toward +y). Origin = grip. */
export const Dagger: React.FC<XProps> = (xf) => (
  <X {...xf}>
    <Part shape={roundRect(16, 50, 6)} color="#5a3a26" shade={0.2} y={-10} />
    <Part shape={roundRect(44, 10, 4)} color={GOLD} flat outline={3} y={18} z={0.001} />
    <Part shape={poly([[-11, 22], [11, 22], [0, 130]])} color="#c8ccd2" shade={0.15} z={0.002} />
  </X>
);

/** Long straight sword (jian) in its scabbard or drawn. Blade toward +y. Origin = grip. */
export const Jian: React.FC<XProps & { drawn?: boolean; len?: number }> = ({ drawn = true, len = 360, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(18, 70, 6)} color="#2a2026" shade={0.2} y={-16} />
    <Part shape={roundRect(54, 12, 4)} color={GOLD} flat outline={3} y={24} z={0.001} />
    {drawn ? (
      <Part shape={roundPoly([[-10, 30], [10, 30], [8, len], [0, len + 22], [-8, len]], 3)} color="#d6dade" shade={0.15} z={0.002}>
        <Line pts={[[0, 34], [0, len]]} width={2.5} color="#9aa0a8" z={0.001} />
      </Part>
    ) : (
      <Part shape={roundRect(26, len, 10)} color={LACQUER} shade={0.2} y={30 + len / 2} z={0.002} />
    )}
  </X>
);

/** Bundle of bamboo writing slips, unrolled `open` 0..1. Origin = centre. */
export const BambooSlips: React.FC<XProps & { open?: number; n?: number }> = ({ open = 1, n = 12, ...xf }) => {
  const shown = Math.max(2, Math.round(n * open));
  return (
    <X {...xf}>
      {Array.from({ length: shown }, (_, i) => (
        <X key={i} x={(i - (shown - 1) / 2) * 30} z={i * 0.001}>
          <Part shape={roundRect(26, 240, 4)} color="#d9c08a" shade={0.15} />
          {Array.from({ length: 7 }, (_, k) => (
            <Line key={k} pts={[[-6, 90 - k * 28], [6, 84 - k * 28]]} width={4} color="#3a2a22" z={0.001} />
          ))}
        </X>
      ))}
      <Line pts={[[-(shown * 15), 70], [shown * 15, 70]]} width={3} color="#7a5232" z={0.02} />
      <Line pts={[[-(shown * 15), -70], [shown * 15, -70]]} width={3} color="#7a5232" z={0.02} />
    </X>
  );
};

/** Silk map scroll unrolling horizontally (`open` 0..1); `dagger` reveals the hidden blade at the end. Origin = left roller. */
export const MapScroll: React.FC<XProps & { open?: number; w?: number; dagger?: boolean }> = ({ open = 1, w = 520, dagger = false, ...xf }) => {
  const ww = Math.max(10, w * open);
  return (
    <X {...xf}>
      <Part shape={roundRect(ww, 220, 4)} color="#efe2c4" shade={0.12} x={ww / 2} />
      {open > 0.3 ? (
        <X x={ww / 2} z={0.001}>
          <Line pts={[[-ww / 2 + 30, 40], [-ww / 4, 70], [0, 20], [ww / 4, 60], [ww / 2 - 30, 30]]} smooth width={4} color="#5a8aa8" />
          <Line pts={[[-ww / 2 + 40, -40], [-ww / 6, -10], [ww / 6, -50], [ww / 2 - 40, -20]]} smooth width={4} color="#7a5a3a" />
          {[-0.3, 0.05, 0.3].map((k) => (
            <Part key={k} shape={roundPoly([[-22, 0], [0, 30], [22, 0]], 4)} color="#9a8a6a" flat outline={3} x={k * ww} y={-70} />
          ))}
        </X>
      ) : null}
      <Part shape={roundRect(26, 250, 10)} color="#7a5232" shade={0.2} />
      <Part shape={roundRect(26, 250, 10)} color="#7a5232" shade={0.2} x={ww} z={0.002} />
      {dagger && open > 0.95 ? <Dagger x={ww + 60} y={-60} rot={-Math.PI / 2} z={0.01} /> : null}
    </X>
  );
};

/** Cloth medicine bag with a drawstring. Origin = centre. */
export const MedicineBag: React.FC<XProps> = (xf) => (
  <X {...xf}>
    <Part shape={blob([[-40, -40], [40, -40], [50, 10], [24, 40], [-24, 40], [-50, 10]], 8)} color="#8a6a3e" shade={0.22} />
    <Line pts={[[-22, 38], [0, 56], [22, 38]]} width={5} color="#5a3a26" z={0.001} />
    <Part shape={roundRect(30, 30, 4)} color="#f4f1ea" flat outline={3} z={0.002}>
      <Part shape={roundRect(18, 6, 1)} color="#c8262f" flat outline={0} z={0.001} />
      <Part shape={roundRect(6, 18, 1)} color="#c8262f" flat outline={0} z={0.001} />
    </Part>
  </X>
);

/** Shallow bowl of shiny liquid mercury (or pills with `pills`). Origin = bottom. */
export const MercuryBowl: React.FC<XProps & { pills?: boolean }> = ({ pills = false, ...xf }) => {
  const frame = useCurrentFrame();
  return (
    <X {...xf}>
      <Part shape={blob([[-90, 50], [90, 50], [60, 0], [-60, 0]], 8)} color="#8a6a3a" shade={0.22} />
      {pills ? (
        [-40, -14, 12, 38, -26, 0, 26].map((x, i) => (
          <Part key={i} shape={circle(13)} color="#4a3a32" shade={0.25} x={x} y={i < 4 ? 58 : 76} z={0.001} />
        ))
      ) : (
        <>
          <Part shape={ellipse(80, 14)} color="#c9d2dc" shade={0.15} y={52} z={0.001} />
          <Part shape={ellipse(22, 5)} color="#ffffff" flat outline={0} x={-20 + Math.sin(frame * 0.1) * 16} y={56} z={0.002} />
        </>
      )}
    </X>
  );
};

/** Clay head of a terracotta warrior, broken at the neck. */
export const ClayHead: React.FC<XProps & { dirt?: number }> = ({ dirt = 0.5, ...xf }) => (
  <X {...xf}>
    <Part shape={circle(70)} color={CLAY} shade={0.24} />
    <Part shape={blob([[-70, 10], [-60, 50], [0, 72], [60, 50], [70, 10], [30, 34], [-30, 34]], 6)} color={shadeHex(CLAY, 0.18)} shade={0.2} z={0.001} />
    <Part shape={circle(22)} color={shadeHex(CLAY, 0.18)} shade={0.2} x={30} y={70} z={0.0005} />
    {[-22, 22].map((x) => (
      <Line key={x} pts={[[x - 10, 4], [x + 10, 4]]} width={5} z={0.002} />
    ))}
    <Line pts={[[-24, -24], [0, -18], [24, -24]]} width={5} z={0.002} />
    <Part shape={poly([[-50, -60], [-20, -74], [10, -66], [40, -76], [56, -56], [0, -50]])} color={shadeHex(CLAY, 0.3)} flat outline={3} z={0.002} />
    {dirt > 0
      ? [[-40, 30], [36, -30], [10, 50]].map(([x, y], i) => <Part key={i} shape={circle(10 + i * 3)} color="#6e5034" flat outline={0} opacity={dirt} x={x} y={y} z={0.003} />)
      : null}
  </X>
);

/** Village well with a wooden tripod, pulley, rope and bucket. Origin = ground centre of the hole. */
export const DigWell: React.FC<XProps & { pull?: number }> = ({ pull = 0, ...xf }) => (
  <X {...xf}>
    <Part shape={ellipse(150, 40)} color="#2a2018" flat outline={5} />
    {[-1, 1].map((k) => (
      <Line key={k} pts={[[k * 170, -10], [0, 330]]} width={12} color="#7a5232" />
    ))}
    <Line pts={[[0, 330], [-20, 0]]} width={10} color="#6e4a2c" z={-0.01} />
    <Part shape={circle(22)} color="#5a3a26" shade={0.2} y={316} z={0.01} />
    <Line pts={[[0, 316], [0, 40 + pull * 150]]} width={4} color="#c9a274" z={0.005} />
    <Part shape={roundPoly([[-30, 0], [30, 0], [24, 50], [-24, 50]], 6)} color="#8a6a3e" shade={0.2} y={pull * 150} z={0.006} />
    <Part shape={blob([[180, 0], [380, 0], [330, 80], [230, 90]], 8)} color="#9a6e48" shade={0.2} z={-0.02} />
  </X>
);

/** Bare autumn tree with orange persimmons. Origin = ground. */
export const PersimmonTree: React.FC<XProps & { h?: number; seed?: number }> = ({ h = 520, seed = 3, ...xf }) => {
  const r = rng(seed);
  const branches: [P, P][] = [
    [[0, h * 0.45], [-h * 0.35, h * 0.85]],
    [[0, h * 0.55], [h * 0.3, h * 0.95]],
    [[0, h * 0.7], [-h * 0.12, h * 1.05]],
    [[-h * 0.2, h * 0.68], [-h * 0.45, h * 0.72]],
    [[h * 0.15, h * 0.75], [h * 0.42, h * 0.78]],
  ];
  return (
    <X {...xf}>
      <Line pts={[[0, 0], [0, h * 0.75]]} width={22} color="#4a3428" />
      {branches.map(([a, b], i) => (
        <Line key={i} pts={[a, b]} width={10} color="#4a3428" />
      ))}
      {branches.map(([, b], i) => (
        <X key={`f${i}`} z={0.01}>
          {[0, 1].map((k) => (
            <Part key={k} shape={circle(18)} color="#f08a2a" shade={0.22} x={b[0] + (r() - 0.5) * 60} y={b[1] - r() * 50} />
          ))}
        </X>
      ))}
    </X>
  );
};

// ───────────────────────── map ─────────────────────────

type Geo = { japan: P[][]; land: P[][] };
type WS = { kingdoms: Record<string, P[][]>; china: P[][]; places: Record<string, P> };
const EA = geoEA as unknown as Geo;
const KS = geoWS as unknown as WS;

export const KINGDOM_COLORS: Record<string, string> = {
  qin: "#3e3a46",
  zhao: "#d9a441",
  yan: "#7aa6c8",
  qi: "#8fbf6e",
  wei: "#c88ab8",
  han: "#e7a88a",
  chu: "#d0684e",
};
export const KINGDOM_LABEL: Record<string, P> = {
  qin: [106.4, 33.8], zhao: [113.6, 38.6], yan: [119.5, 40.6], qi: [118.6, 36.4], wei: [113.4, 35.2], han: [112.8, 33.7], chu: [113.5, 29.6],
};
/** Lon/lat of a named ancient place. */
export const PLACES: Record<string, P> = {
  xianyang: [108.7, 34.35], lishan: [109.27, 34.38], langya: [119.6, 35.6], shaqiu: [115.2, 37.4],
};

/**
 * Map of China and its neighbours on real coastlines (reference map style).
 * `center` = [lon, lat] placed at the origin; `kingdoms` draws the seven
 * Warring States; `conquered` lists kingdoms already painted in Qin black;
 * `route` = lon/lat polyline drawn dashed up to `routeK`; `dots` = lon/lat.
 */
export const ChinaMap: React.FC<
  XProps & {
    ppd?: number; center?: P; kingdoms?: boolean; conquered?: string[]; sea?: string; land?: string; china?: string; waves?: boolean;
    route?: P[]; routeK?: number; routeColor?: string; dots?: P[]; w?: number; h?: number;
  }
> = ({ ppd = 40, center = [112, 34], kingdoms = false, conquered = [], sea = "#93c3c4", land = "#ddcca2", china = "#efd39b", waves = true, route, routeK = 1, routeColor = "#c8262f", dots = [], w = 5000, h = 3600, ...xf }) => {
  const r = rng(9);
  const [cx, cy] = geoXY(center[0], center[1], ppd);
  const sc = (ring: P[]) => ring.map(([x, y]) => [x * ppd - cx, y * ppd - cy] as P);
  const at = (lon: number, lat: number): P => {
    const [x, y] = geoXY(lon, lat, ppd);
    return [x - cx, y - cy];
  };
  let routePts: P[] = [];
  if (route && route.length > 1) {
    const pts = route.map(([lo, la]) => at(lo, la));
    const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
    const total = seg.reduce((a, b) => a + b, 0);
    const dash = 26;
    for (let d = 0; d < total * routeK; d += dash) {
      let acc = 0;
      for (let i = 0; i < seg.length; i++) {
        if (d <= acc + seg[i]) {
          const q = (d - acc) / seg[i];
          routePts.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * q, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * q]);
          break;
        }
        acc += seg[i];
      }
    }
  }
  return (
    <X {...xf}>
      <Part shape={roundRect(w, h, 0)} color={sea} flat outline={0} z={-0.1} />
      {waves
        ? Array.from({ length: 80 }, () => [(r() - 0.5) * w, (r() - 0.5) * h]).map(([x, y], i) => (
            <Line key={`w${i}`} pts={[[x - 26, y], [x - 13, y + 7], [x, y], [x + 13, y - 7], [x + 26, y]]} smooth width={3.5} color={shadeHex(sea, 0.14)} z={-0.09} />
          ))
        : null}
      {EA.land.map((ring, i) => (
        <Part key={`l${i}`} shape={poly(sc(ring))} color={land} flat outline={5} z={i * 0.0001} />
      ))}
      {EA.japan.map((ring, i) => (
        <Part key={`j${i}`} shape={poly(sc(ring))} color={land} flat outline={5} z={0.01 + i * 0.0001} />
      ))}
      {KS.china.map((ring, i) => (
        <Part key={`c${i}`} shape={poly(sc(ring))} color={china} flat outline={5} z={0.02 + i * 0.0001} />
      ))}
      {kingdoms
        ? Object.entries(KS.kingdoms).map(([name, rings]) =>
            rings.map((ring, i) => (
              <Part
                key={`${name}${i}`}
                shape={poly(sc(ring))}
                color={conquered.includes(name) ? KINGDOM_COLORS.qin : KINGDOM_COLORS[name]}
                flat
                outline={4}
                z={0.03 + i * 0.0001}
              />
            )),
          )
        : null}
      {routePts.length > 1
        ? routePts.slice(0, -1).map((p, i) => (i % 2 === 0 ? <Line key={`r${i}`} pts={[p, routePts[i + 1]]} width={9} color={routeColor} z={0.05} /> : null))
        : null}
      {dots.map(([lo, la], i) => {
        const [x, y] = at(lo, la);
        return <Part key={`d${i}`} shape={circle(9)} color="#c8262f" flat outline={3.5} x={x} y={y} z={0.06} />;
      })}
    </X>
  );
};

/** Lon/lat → ChinaMap pixels for a map with the same `ppd` and `center`. */
export const chinaXY = (lon: number, lat: number, ppd = 40, center: P = [112, 34]): P => {
  const [cx, cy] = geoXY(center[0], center[1], ppd);
  const [x, y] = geoXY(lon, lat, ppd);
  return [x - cx, y - cy];
};

