import React from "react";
import { useCurrentFrame } from "remotion";
import { Part, Line } from "../Part";
import { X, type XProps } from "../context";
import { Glow, Gradient, LightCone } from "../effects";
import { blob, circle, ellipse, poly, roundPoly, roundRect } from "../shapes";
import { shadeHex, mixHex } from "../style";
import { rng, noise1 } from "../random";
import { cloudShape } from "./nature";
import { Flame, Smoke } from "./fire";

// Maya world: temples, houses, the lake city, canoes, the Spanish galley, jungle,
// cenotes and the ball court. Side views, origin = ground centre unless noted.

type P = [number, number];
const STUCCO = "#efe4cc";
const LIME = "#e6dcc4";
const RED = "#b8432f";
const STONE = "#b9ae98";

// ───────────────────────── architecture ─────────────────────────

export type PyramidProps = XProps & {
  /** Base width and pyramid height (without the temple). */
  w?: number;
  h?: number;
  tiers?: number;
  /** Top platform width as a fraction of the base. */
  top?: number;
  color?: string;
  /** Darker moulding band on each tier. */
  band?: string;
  stair?: boolean;
  stairW?: number;
  /** Temple on top: width/height in px (0 = none). */
  templeW?: number;
  templeH?: number;
  templeColor?: string;
  doors?: number;
  /** Roof comb height (0 = none). */
  comb?: number;
  /** 0..1 jungle overgrowth. */
  overgrown?: number;
  /** Serpent heads at the base of the stair balustrades (El Castillo). */
  serpents?: boolean;
  /** 0..1 equinox: light triangles along the balustrade forming the serpent body. */
  equinox?: number;
  seed?: number;
};

/**
 * Stepped Maya pyramid with a central stairway and a temple on top (Tikal,
 * Palenque, El Castillo, La Danta). Each tier is a battered platform with a
 * moulding band; the temple has dark doorways, a sloped (mansard) roof and an
 * optional pierced roof comb.
 */
export const MayaPyramid: React.FC<PyramidProps> = ({
  w = 900,
  h = 600,
  tiers = 9,
  top = 0.34,
  color = STUCCO,
  band,
  stair = true,
  stairW = 0.2,
  templeW = 260,
  templeH = 170,
  templeColor,
  doors = 3,
  comb = 0,
  overgrown = 0,
  serpents = false,
  equinox = 0,
  seed = 3,
  ...xf
}) => {
  const r = rng(seed);
  const th = h / tiers;
  const wAt = (i: number) => w - (w - w * top) * (i / tiers);
  const bandC = band ?? shadeHex(color, 0.16);
  const sw = w * stairW;
  const tc = templeColor ?? color;
  const vines = overgrown > 0 ? Array.from({ length: Math.round(18 * overgrown) }, () => [(r() - 0.5) * w * 0.9, r() * h, 30 + r() * 90, r()] as [number, number, number, number]) : [];
  return (
    <X {...xf}>
      {Array.from({ length: tiers }, (_, i) => {
        const w0 = wAt(i);
        const w1 = wAt(i + 1) + (w / tiers) * 0.05;
        const y0 = i * th;
        return (
          <X key={i} z={i * 0.001}>
            <Part shape={poly([[-w0 / 2, y0], [w0 / 2, y0], [w1 / 2, y0 + th], [-w1 / 2, y0 + th]])} color={color} shade={0.24} />
            <Part shape={roundRect(w1 - 6, th * 0.22, 2)} color={bandC} flat outline={3} y={y0 + th * 0.86} z={0.0002} />
            <Line pts={[[-w0 / 2 + 6, y0 + 3], [w0 / 2 - 6, y0 + 3]]} width={3} color={shadeHex(color, 0.3)} z={0.0003} />
          </X>
        );
      })}
      {stair ? (
        <X z={0.02}>
          <Part shape={poly([[-sw / 2 - 18, 0], [sw / 2 + 18, 0], [sw * 0.42 + 10, h], [-sw * 0.42 - 10, h]])} color={shadeHex(color, 0.08)} shade={0.2} />
          <Part shape={poly([[-sw / 2, 0], [sw / 2, 0], [sw * 0.42, h], [-sw * 0.42, h]])} color={mixHex(color, "#ffffff", 0.12)} flat outline={3} z={0.0005} />
          {Array.from({ length: Math.round(h / 22) }, (_, k) => {
            const y = (k + 0.5) * (h / Math.round(h / 22));
            const half = sw / 2 - ((sw / 2 - sw * 0.42) * y) / h;
            return <Line key={k} pts={[[-half, y], [half, y]]} width={2.5} color={shadeHex(color, 0.28)} z={0.001} />;
          })}
          {serpents
            ? [-1, 1].map((k) => (
                <X key={k} x={k * (sw / 2 + 6)} y={10} z={0.003}>
                  <Part shape={blob([[-30, -10], [30, -10], [44, 20], [20, 46], [-20, 46], [-44, 20]], 7)} color={STONE} shade={0.25} />
                  <Part shape={circle(7)} color="#211b20" flat outline={0} x={k * 18} y={24} z={0.001} />
                  <Line pts={[[-24, 6], [-8, 14], [8, 6], [24, 14]]} width={4} z={0.001} />
                </X>
              ))
            : null}
          {serpents && equinox > 0
            ? Array.from({ length: 7 }, (_, k) => {
                const y0 = 46 + k * ((h - 60) / 7);
                const y1 = y0 + (h - 60) / 7 - 14;
                const xx = -(sw / 2 + 6) + ((sw / 2 - sw * 0.42) * y0) / h;
                return k < Math.round(7 * equinox) ? (
                  <Part key={k} shape={poly([[xx - 10, y0], [xx + 8, y0 + (y1 - y0) / 2], [xx - 10, y1]])} color="#fff2c6" flat outline={0} opacity={0.85} z={0.004} />
                ) : null;
              })
            : null}
        </X>
      ) : null}
      {templeW > 0 ? (
        <X y={h} z={0.03}>
          <Part shape={roundRect(templeW, templeH * 0.55, 3)} color={tc} shade={0.22} y={templeH * 0.275} />
          {Array.from({ length: doors }, (_, k) => (
            <Part key={k} shape={roundRect(Math.min(42, templeW / (doors * 2)), templeH * 0.38, 2)} color="#2a2026" flat outline={3} x={(k - (doors - 1) / 2) * (templeW / doors)} y={templeH * 0.19} z={0.001} />
          ))}
          <Part shape={poly([[-templeW / 2 - 8, templeH * 0.55], [templeW / 2 + 8, templeH * 0.55], [templeW / 2 - 18, templeH], [-templeW / 2 + 18, templeH]])} color={shadeHex(tc, 0.06)} shade={0.24} z={0.002} />
          <Line pts={[[-templeW / 2 + 4, templeH * 0.6], [templeW / 2 - 4, templeH * 0.6]]} width={3} color={shadeHex(tc, 0.3)} z={0.003} />
          {[0.4, 0.7].map((q) => (
            <Line key={q} pts={[[-templeW / 2 + 20 + 10 * q, templeH * (0.55 + 0.45 * q)], [templeW / 2 - 20 - 10 * q, templeH * (0.55 + 0.45 * q)]]} width={2.5} color={shadeHex(tc, 0.25)} z={0.003} />
          ))}
          {comb > 0 ? (
            <X y={templeH} z={-0.001}>
              <Part shape={poly([[-templeW * 0.34, 0], [templeW * 0.34, 0], [templeW * 0.24, comb], [-templeW * 0.24, comb]])} color={tc} shade={0.22} />
              {Array.from({ length: 3 }, (_, k) => (
                <Part key={k} shape={roundRect(templeW * 0.08, comb * 0.18, 3)} color="#2a2026" flat outline={2.5} x={(k - 1) * templeW * 0.16} y={comb * (0.3 + (k % 2) * 0.32)} z={0.001} />
              ))}
              <Part shape={circle(templeW * 0.07)} color={RED} flat outline={3} y={comb * 0.66} z={0.001} />
            </X>
          ) : null}
        </X>
      ) : null}
      {vines.map(([x, y, s, q], i) => (
        <X key={`v${i}`} x={x * (1 - (y / h) * (1 - top))} y={y} z={0.05 + i * 0.0001}>
          <Part shape={cloudShape(s * 1.2, s * 0.8, 4, i + seed)} color={q > 0.5 ? "#4f8a3e" : "#3f7a34"} shade={0.24} />
          {q > 0.6 ? <Line pts={[[0, 0], [8, -s * 0.9], [-4, -s * 1.5]]} smooth width={4} color="#2f6a2a" z={-0.0001} /> : null}
        </X>
      ))}
    </X>
  );
};

/** Tikal's Temple I (Temple of the Great Jaguar): nine steep tiers, tall roof comb. */
export const TikalTemple: React.FC<XProps & { s?: number; overgrown?: number; color?: string }> = ({ overgrown = 0, color = "#e6dcc4", ...xf }) => (
  <MayaPyramid {...xf} w={520} h={560} tiers={9} top={0.46} stairW={0.26} templeW={180} templeH={150} doors={1} comb={170} color={color} overgrown={overgrown} />
);

/** Chichén Itzá's El Castillo: nine wide tiers, serpent balustrades, flat-roofed temple. */
export const ElCastillo: React.FC<XProps & { equinox?: number }> = ({ equinox = 0, ...xf }) => (
  <MayaPyramid {...xf} w={1000} h={440} tiers={9} top={0.3} stairW={0.18} templeW={240} templeH={140} doors={3} comb={0} color="#e2d6bc" band="#cbbd9e" serpents equinox={equinox} />
);

/** Palenque's Temple of the Inscriptions: wide nine-tier pyramid, five-door temple with a mansard roof. */
export const InscriptionsTemple: React.FC<XProps & { overgrown?: number }> = ({ overgrown = 0, ...xf }) => (
  <MayaPyramid {...xf} w={1000} h={380} tiers={9} top={0.46} stairW={0.16} templeW={420} templeH={190} doors={5} comb={0} color="#e8dfc8" overgrown={overgrown} />
);

/** Plastered platform (Aguada Fénix / acropolis base). */
export const Platform: React.FC<XProps & { w?: number; h?: number; color?: string }> = ({ w = 1600, h = 80, color = LIME, ...xf }) => (
  <X {...xf}>
    <Part shape={poly([[-w / 2, 0], [w / 2, 0], [w / 2 - h * 0.6, h], [-w / 2 + h * 0.6, h]])} color={color} shade={0.22} />
    <Line pts={[[-w / 2 + h * 0.6, h - 3], [w / 2 - h * 0.6, h - 3]]} width={3} color={shadeHex(color, 0.3)} z={0.001} />
  </X>
);

/** Maya house: plastered stone base, white wattle-and-daub walls, steep palm-thatch roof. */
export const MayaHut: React.FC<XProps & { w?: number; wall?: string; thatch?: string; door?: boolean }> = ({ w = 260, wall = "#ece2cc", thatch = "#c8a25a", door = true, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(w + 30, 26, 4)} color={STONE} shade={0.22} y={13} />
    <Part shape={roundRect(w, w * 0.42, 22)} color={wall} shade={0.22} y={26 + w * 0.21} z={0.001} />
    {door ? <Part shape={roundRect(w * 0.2, w * 0.3, 6)} color="#3a2a26" flat outline={3} y={26 + w * 0.15} z={0.002} /> : null}
    <Part shape={blob([[-w * 0.62, 26 + w * 0.36], [w * 0.62, 26 + w * 0.36], [w * 0.34, 26 + w * 0.82], [0, 26 + w * 0.98], [-w * 0.34, 26 + w * 0.82]], 8)} color={thatch} shade={0.26} z={0.003} />
    {[0.2, 0.4, 0.6].map((q) => (
      <Line key={q} pts={[[-w * 0.6 + w * 0.26 * q, 26 + w * (0.38 + 0.42 * q)], [w * 0.6 - w * 0.26 * q, 26 + w * (0.38 + 0.42 * q)]]} smooth width={3} color={shadeHex(thatch, 0.28)} z={0.004} />
    ))}
    <Part shape={roundRect(w * 0.3, 14, 6)} color={shadeHex(thatch, 0.2)} shade={0.2} y={26 + w * 0.96} z={0.005} />
  </X>
);

/** Carved stone stela with a king and glyph columns. Origin = ground centre. */
export const Stela: React.FC<XProps & { h?: number; color?: string }> = ({ h = 360, color = "#bcb19a", ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(h * 0.42, h, 14)} color={color} shade={0.26} y={h / 2} />
    <Part shape={roundRect(h * 0.32, h * 0.62, 6)} color={shadeHex(color, 0.08)} flat outline={3} y={h * 0.6} z={0.001} />
    <Part shape={circle(h * 0.07)} color={shadeHex(color, 0.04)} flat outline={3} y={h * 0.78} z={0.002} />
    <Part shape={roundRect(h * 0.16, h * 0.26, 6)} color={shadeHex(color, 0.04)} flat outline={3} y={h * 0.56} z={0.002} />
    <Line pts={[[-h * 0.1, h * 0.86], [0, h * 0.94], [h * 0.12, h * 0.88]]} smooth width={4} color={shadeHex(color, 0.35)} z={0.002} />
    {[0, 1, 2].map((k) => (
      <Part key={k} shape={roundRect(h * 0.12, h * 0.07, 4)} color={shadeHex(color, 0.04)} flat outline={2.5} x={(k - 1) * h * 0.13} y={h * 0.16} z={0.002} />
    ))}
  </X>
);

// ───────────────────────── lake, island city, boats ─────────────────────────

/** Lake surface with soft reflections. Top edge (shoreline / horizon) at y=0. */
export const Lake: React.FC<XProps & { w?: number; h?: number; color?: string; mood?: "day" | "dawn" | "dusk" | "night" }> = ({ w = 5000, h = 1600, color, mood = "day", ...xf }) => {
  const frame = useCurrentFrame();
  const c = color ?? { day: "#4a9ab0", dawn: "#7aa0b8", dusk: "#5a6a9a", night: "#1e2a48" }[mood];
  const r = rng(6);
  const lines = Array.from({ length: 70 }, () => [r() * w - w / 2, -r() * h * 0.95 - 8, 24 + r() * 70, r() * 6.28]);
  return (
    <X {...xf}>
      <Gradient w={w} h={h} y={-h / 2} stops={[[0, mixHex(c, "#ffffff", 0.22)], [1, shadeHex(c, 0.3)]]} />
      <Line pts={[[-w / 2, 0], [w / 2, 0]]} width={5} z={0.01} />
      {lines.map(([x, y, len, ph], i) => {
        const a = 0.25 + 0.3 * Math.sin(frame * 0.07 + ph);
        const dx = Math.sin(frame * 0.025 + ph) * 10;
        return <Line key={i} pts={[[x + dx, y], [x + dx + len * (1 + -y / h), y]]} width={3.5} color="#ffffff" opacity={a} z={0.02} />;
      })}
    </X>
  );
};

/** Nojpetén, the Itza island capital: a hilly island ringed with houses, white and red temples rising over the water. Origin = waterline centre. */
export const IslandCity: React.FC<XProps & { w?: number; burn?: number; mood?: "day" | "dusk" | "night" }> = ({ w = 1300, burn = 0, mood = "day", ...xf }) => {
  const s = w / 1300;
  const temples: [number, number, number, number, string][] = [
    [-260, 120, 0.42, 120, "#efe4cc"],
    [60, 170, 0.55, 150, "#e8d2b0"],
    [330, 110, 0.38, 100, "#c96a4a"],
    [-40, 150, 0.32, 0, "#efe4cc"],
  ];
  const huts = [-560, -460, -360, -150, 200, 440, 540];
  return (
    <X {...xf}>
      <Part shape={blob([[-650 * s, 0], [-560 * s, 70 * s], [-300 * s, 150 * s], [0, 190 * s], [300 * s, 140 * s], [560 * s, 70 * s], [650 * s, 0]], 10)} color={mood === "night" ? "#4a5a3a" : "#7aa04a"} shade={0.24} />
      <Part shape={blob([[-660 * s, 0], [660 * s, 0], [600 * s, 24 * s], [-600 * s, 24 * s]], 6)} color="#d9c49a" shade={0.15} z={0.001} />
      {huts.map((x, i) => (
        <MayaHut key={i} x={x * s} y={(16 + (1 - Math.abs(x) / 650) * 90) * s} w={110 * s} s={1} z={0.002 + i * 0.0001} />
      ))}
      {temples.map(([x, y, sc, comb, col], i) => (
        <MayaPyramid key={`t${i}`} x={x * s} y={y * s} s={sc * s} w={520} h={460} tiers={7} top={0.44} templeW={200} templeH={150} doors={1} comb={comb} color={col} z={0.003 + i * 0.001} />
      ))}
      {[-600, -420, 470, 610].map((x, i) => (
        <X key={`p${i}`} x={x * s} y={20 * s} s={0.5 * s} z={0.009}>
          <Part shape={cloudShape(160, 140, 4, i + 3)} color="#4f8a3e" shade={0.24} y={180} />
          <Line pts={[[0, 0], [4, 140]]} width={10} color="#6e4a2c" z={-0.001} />
        </X>
      ))}
      {burn > 0
        ? temples.slice(0, 3).map(([x, y, sc], i) => (
            <X key={`f${i}`} x={x * s} y={(y + 460 * sc + 40) * s} z={0.02}>
              <Flame size={1.6 * burn * s} seed={i + 2} />
              <Glow rx={260 * s} color="#ff9a4a" alpha={0.45 * burn} additive />
              <Smoke y={60 * s} w={160 * s} h={600 * s} alpha={0.5 * burn} seed={i + 4} />
            </X>
          ))
        : null}
    </X>
  );
};

/** Dugout canoe, side view, facing +x. Origin = waterline centre. Characters sit at y≈20·s. */
export const Canoe: React.FC<XProps & { len?: number; color?: string; paint?: string }> = ({ len = 520, color = "#8a5a32", paint = "#c0392b", ...xf }) => (
  <X {...xf}>
    <Part shape={blob([[-len / 2 - 20, 46], [-len / 2 + 30, 6], [0, -10], [len / 2 - 30, 6], [len / 2 + 30, 50], [len / 2 - 10, 40], [0, 34], [-len / 2 + 10, 40]], 10)} color={color} shade={0.26} />
    <Line pts={[[-len / 2 + 20, 30], [0, 26], [len / 2 - 20, 30]]} smooth width={4} color={paint} z={0.001} />
    <Line pts={[[-len / 2 + 40, 16], [len / 2 - 40, 16]]} width={3} color={shadeHex(color, 0.3)} z={0.001} />
  </X>
);

/** Canoe paddle (held). Origin = the hand. */
export const Paddle: React.FC<XProps> = (xf) => (
  <X {...xf}>
    <Line pts={[[0, -60], [0, 200]]} width={8} color="#6e4a2c" />
    <Part shape={blob([[-18, -60], [18, -60], [14, -150], [0, -170], [-14, -150]], 6)} color="#8a5a32" shade={0.25} />
  </X>
);

/** Water splash ring around something sitting in the water. */
export const Ripples: React.FC<XProps & { r?: number; seed?: number }> = ({ r = 200, seed = 1, ...xf }) => {
  const frame = useCurrentFrame();
  return (
    <X {...xf}>
      {[0, 1, 2].map((k) => {
        const q = ((frame * 0.012 + k / 3 + seed * 0.13) % 1);
        return <Part key={k} shape={ellipse(r * (0.5 + q), r * (0.1 + q * 0.12))} color="#ffffff" flat outline={0} opacity={0.35 * (1 - q)} />;
      })}
    </X>
  );
};

/** Burgundy cross flag of the Spanish Empire. Origin = pole top. */
export const SpanishFlag: React.FC<XProps & { w?: number }> = ({ w = 120, ...xf }) => {
  const frame = useCurrentFrame();
  const wave = (k: number) => Math.sin(frame * 0.2 + k * 2) * 6 * k;
  const h = w * 0.66;
  return (
    <X {...xf}>
      <Part shape={poly([[0, 0], [w, wave(1)], [w, -h + wave(1)], [0, -h]])} color="#f4f1ea" shade={0.15} />
      <Line pts={[[w * 0.12, -h * 0.12], [w * 0.88, -h * 0.88 + wave(0.9)]]} width={w * 0.1} color="#b8322a" z={0.001} />
      <Line pts={[[w * 0.12, -h * 0.88], [w * 0.88, -h * 0.12 + wave(0.9)]]} width={w * 0.1} color="#b8322a" z={0.001} />
    </X>
  );
};

/** Bronze cannon on a carriage, facing +x. `fire` 0..1 flashes and smokes. Origin = carriage base. */
export const Cannon: React.FC<XProps & { fire?: number; len?: number }> = ({ fire = 0, len = 200, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(len * 0.8, 40, 10)} color="#6e4a2c" shade={0.25} y={20} />
    {[-1, 1].map((k) => (
      <Part key={k} shape={circle(26)} color="#5a3a26" shade={0.25} x={k * len * 0.28} y={20} z={0.001} />
    ))}
    <X y={60} rot={0.08} z={0.002}>
      <Part shape={poly([[-len * 0.45, -26], [len * 0.55, -16], [len * 0.55, 16], [-len * 0.45, 26]])} color="#a8823a" shade={0.3} />
      <Part shape={circle(28)} color="#a8823a" shade={0.3} x={-len * 0.45} />
      <Part shape={roundRect(20, 40, 4)} color="#8a6a2a" shade={0.25} x={len * 0.52} z={0.001} />
      {fire > 0 && fire < 1 ? (
        <X x={len * 0.6} z={0.01}>
          <Part shape={blob([[0, -30], [90, -50], [200, 0], [90, 50], [0, 30]], 8)} color="#ffd36a" flat outline={0} opacity={1 - fire} s={0.5 + fire} />
          <Glow rx={260} color="#ffb35a" alpha={0.6 * (1 - fire)} additive />
          <Smoke x={60 + fire * 120} w={180} h={200} alpha={0.6 * (1 - fire * 0.5)} color="#8a8790" seed={3} />
        </X>
      ) : null}
    </X>
  </X>
);

/**
 * The Spanish war galley (galeota) the Spanish built on Lake Petén Itzá in 1697:
 * long low hull, oars, a lateen sail with the burgundy cross, bow cannons.
 * Facing +x; origin = waterline centre. `row` animates the oars, `fire` the bow gun.
 */
export const SpanishGalley: React.FC<XProps & { len?: number; row?: number; fire?: number; soldiers?: number }> = ({ len = 1100, row = 1, fire = 0, soldiers = 6, ...xf }) => {
  const frame = useCurrentFrame();
  const ph = frame * 0.18 * row;
  const oars = 9;
  return (
    <X {...xf}>
      {Array.from({ length: oars }, (_, k) => (
        <X key={`o${k}`} x={-len * 0.34 + (k * len * 0.62) / (oars - 1)} y={40} rot={-0.5 + Math.sin(ph + k * 0.2) * 0.3 * row} z={-0.01}>
          <Line pts={[[0, 0], [0, -150]]} width={7} color="#5a3a26" />
          <Part shape={roundRect(20, 50, 6)} color="#6e4a2c" shade={0.2} y={-160} />
        </X>
      ))}
      <Part shape={blob([[-len / 2, 70], [-len / 2 + 40, 0], [len / 2 - 120, 0], [len / 2 + 40, 60], [len / 2 + 60, 100], [len / 2 - 60, 90], [-len / 2 + 20, 110]], 10)} color="#5a3a26" shade={0.28} />
      <Part shape={roundRect(len * 0.9, 18, 6)} color="#b8322a" flat outline={3.5} y={80} z={0.001} />
      <Line pts={[[-len / 2 + 30, 48], [len / 2 - 60, 48]]} width={4} color="#3a2418" z={0.001} />
      <Part shape={roundRect(220, 90, 8)} color="#6e4a2c" shade={0.25} x={-len / 2 + 140} y={140} z={0.002} />
      <Part shape={roundRect(220, 14, 6)} color="#d9b84e" flat outline={3} x={-len / 2 + 140} y={186} z={0.003} />
      <X x={-len * 0.04} y={100} z={-0.005}>
        <Line pts={[[0, 0], [0, 620]]} width={14} color="#4a3220" />
        <Line pts={[[-280, 300], [260, 640]]} width={9} color="#4a3220" z={0.001} />
        <Part shape={poly([[-260, 312], [244, 630], [200, 300]])} color="#efe6d0" shade={0.2} z={0.0005} />
        <Line pts={[[0, 380], [150, 520]]} width={22} color="#b8322a" z={0.0008} />
        <Line pts={[[0, 520], [150, 380]]} width={22} color="#b8322a" z={0.0008} />
        <SpanishFlag x={0} y={720} w={110} z={0.002} />
      </X>
      {Array.from({ length: soldiers }, (_, k) => (
        <X key={`s${k}`} x={-len * 0.3 + k * 110} y={110} s={0.32} z={0.004 + k * 0.0001}>
          <Part shape={roundRect(110, 150, 30)} color={["#8a2a2a", "#c8a24a", "#2f4f7a"][k % 3]} shade={0.2} y={75} />
          <Part shape={circle(60)} color="#f6f5f8" shade={0.24} y={210} z={0.001} />
          <Part shape={blob([[-90, 220], [-50, 270], [50, 270], [90, 220], [0, 240]], 6)} color="#b9bec8" shade={0.3} z={0.002} />
          <Line pts={[[70, 60], [110, 420]]} width={10} color="#6e4a2c" z={-0.001} />
        </X>
      ))}
      <Cannon x={len / 2 - 60} y={90} len={170} fire={fire} s={0.9} z={0.006} />
    </X>
  );
};

// ───────────────────────── jungle ─────────────────────────

/** Big broad leaf (banana / monstera style) for foreground framing. Origin = stem base. */
export const BigLeaf: React.FC<XProps & { len?: number; color?: string; seed?: number }> = ({ len = 420, color = "#3f8a3e", seed = 1, ...xf }) => {
  const frame = useCurrentFrame();
  const sway = noise1(frame / 50, seed) * 0.06;
  return (
    <X {...xf} rot={(xf.rot ?? 0) + sway}>
      <Line pts={[[0, 0], [0, len * 0.25]]} width={10} color={shadeHex(color, 0.25)} />
      <X y={len * 0.22}>
        <Part shape={blob([[0, 0], [-len * 0.3, len * 0.25], [-len * 0.26, len * 0.6], [0, len * 0.8], [len * 0.26, len * 0.6], [len * 0.3, len * 0.25]], 10)} color={color} shade={0.26} />
        <Line pts={[[0, 6], [0, len * 0.74]]} width={5} color={shadeHex(color, 0.25)} z={0.001} />
        {[0.2, 0.35, 0.5, 0.62].map((q) => (
          <React.Fragment key={q}>
            <Line pts={[[0, len * q], [-len * 0.2, len * (q + 0.08)]]} width={3} color={shadeHex(color, 0.22)} z={0.001} />
            <Line pts={[[0, len * q], [len * 0.2, len * (q + 0.08)]]} width={3} color={shadeHex(color, 0.22)} z={0.001} />
          </React.Fragment>
        ))}
      </X>
    </X>
  );
};

/** Dense jungle band: overlapping crowns, palms and big leaves. Origin = ground line centre. */
export const Jungle: React.FC<XProps & { w?: number; h?: number; seed?: number; dark?: number; color?: string }> = ({ w = 4000, h = 420, seed = 4, dark = 0, color = "#4f8a3e", ...xf }) => {
  const r = rng(seed);
  const n = Math.round(w / 170);
  const cols = [color, shadeHex(color, 0.1), mixHex(color, "#7ab04a", 0.3), shadeHex(color, 0.2)];
  return (
    <X {...xf}>
      <Part shape={roundRect(w, h * 0.55, 0)} color={shadeHex(color, 0.3 + dark * 0.3)} flat outline={0} y={h * 0.27} z={-0.01} />
      {Array.from({ length: n }, (_, i) => {
        const x = -w / 2 + (i + r()) * (w / n);
        const s = 0.7 + r() * 0.6;
        const tall = r() < 0.18;
        return (
          <X key={i} x={x} y={tall ? h * 0.5 : h * (0.25 + r() * 0.35)} z={i * 0.0001}>
            {tall ? <Line pts={[[0, -h * 0.5], [6, 0]]} width={12} color="#6e4a2c" z={-0.001} /> : null}
            <Part shape={cloudShape(220 * s, 170 * s, 5, seed * 13 + i)} color={mixHex(cols[i % 4], "#0e1a12", dark * 0.5)} shade={0.25} />
          </X>
        );
      })}
    </X>
  );
};

/** The ceiba, the Maya world tree: straight grey trunk, buttress roots, flat layered crown. Origin = base. */
export const Ceiba: React.FC<XProps & { h?: number; seed?: number }> = ({ h = 900, seed = 2, ...xf }) => {
  const frame = useCurrentFrame();
  const sway = noise1(frame / 60, seed) * 6;
  return (
    <X {...xf}>
      {[-1, 1].map((k) => (
        <Part key={k} shape={poly([[k * 20, 0], [k * 140, 0], [k * 30, h * 0.22]])} color="#9a948a" shade={0.24} z={0.001} />
      ))}
      <Part shape={poly([[-46, 0], [46, 0], [30, h * 0.8], [-30, h * 0.8]])} color="#a8a296" shade={0.26} />
      {[[-1, 0.62], [1, 0.7], [-1, 0.78], [1, 0.84]].map(([k, q], i) => (
        <Line key={i} pts={[[0, h * q], [k * h * 0.28, h * (q + 0.1)]]} width={18 - i * 2} color="#9a948a" z={0.002} />
      ))}
      {[[-0.3, 0.74, 0.34], [0.3, 0.8, 0.32], [0, 0.9, 0.42], [-0.18, 0.98, 0.3], [0.2, 1.0, 0.28]].map(([x, y, s], i) => (
        <Part key={`c${i}`} shape={cloudShape(h * s * 1.6, h * s * 0.55, 6, seed * 5 + i)} color={i % 2 ? "#4f8a3e" : "#5a9a46"} shade={0.26} x={h * x + sway} y={h * y} z={0.01 + i * 0.001} />
      ))}
    </X>
  );
};

/** Hanging lianas from the top edge (y = 0 down to −len). */
export const Vines: React.FC<XProps & { w?: number; n?: number; len?: number; seed?: number }> = ({ w = 1800, n = 12, len = 500, seed = 3, ...xf }) => {
  const frame = useCurrentFrame();
  const r = rng(seed);
  return (
    <X {...xf}>
      {Array.from({ length: n }, (_, i) => {
        const x = (r() - 0.5) * w;
        const l = len * (0.5 + r() * 0.7);
        const sw = Math.sin(frame * 0.04 + i) * 10;
        const pts: P[] = Array.from({ length: 8 }, (_, k) => [x + Math.sin(k * 0.9 + i) * 14 + sw * (k / 7), -l * (k / 7)]);
        return (
          <X key={i} z={i * 0.0001}>
            <Line pts={pts} smooth width={6} color="#3f6a2a" />
            {pts.filter((_, k) => k % 2 === 1).map(([px, py], k) => (
              <Part key={k} shape={blob([[0, 0], [22, 10], [44, 4], [52, -10], [30, -10], [12, -6]], 7)} color={k % 2 ? "#4f8a3e" : "#5a9a46"} shade={0.2} x={px} y={py} rot={k % 2 ? 0.3 : 2.8} z={0.001} />
            ))}
          </X>
        );
      })}
    </X>
  );
};

/** Cenote in cross-section: limestone ground with a round shaft, roots and vines, turquoise water, a light shaft. Origin = ground surface centre. */
export const Cenote: React.FC<XProps & { w?: number; depth?: number; beam?: number }> = ({ w = 900, depth = 700, beam = 1, ...xf }) => {
  const frame = useCurrentFrame();
  return (
    <X {...xf}>
      <Part shape={roundRect(w * 3, depth + 200, 0)} color="#cbbf9e" flat outline={0} y={-(depth + 200) / 2} />
      {[0.25, 0.5, 0.75].map((q) => (
        <Line key={q} pts={[[-w * 1.5, -depth * q], [w * 1.5, -depth * q]]} width={3} color="#b3a684" z={0.001} />
      ))}
      <Part shape={blob([[-w / 2, 0], [-w / 2 - 60, -depth * 0.3], [-w / 2 + 20, -depth * 0.75], [-w / 2 + 80, -depth], [w / 2 - 80, -depth], [w / 2 - 20, -depth * 0.75], [w / 2 + 60, -depth * 0.3], [w / 2, 0]], 10)} color="#2a3a44" flat outline={6} z={0.002} />
      <Part shape={roundRect(w - 150, depth * 0.32, 30)} color="#2ab0b8" shade={0.2} y={-depth + depth * 0.16} z={0.003} />
      <Line pts={[[-w / 2 + 80, -depth * 0.68], [w / 2 - 80, -depth * 0.68]]} width={5} color="#8ae0e4" z={0.004} />
      {[0, 1, 2, 3].map((k) => (
        <Line key={k} pts={[[-w / 2 + 120 + k * 60 + ((frame * 2) % 60), -depth * 0.78 - k * 18], [-w / 2 + 180 + k * 60 + ((frame * 2) % 60), -depth * 0.78 - k * 18]]} width={3} color="#ffffff" opacity={0.5} z={0.005} />
      ))}
      {beam > 0 ? <LightCone y={-10} w={w * 0.7} h={depth * 0.9} top={0.6} color="#fff2c6" alpha={0.28 * beam} z={0.006} /> : null}
      <X y={0} z={0.007}>
        <Vines w={w * 0.9} n={9} len={depth * 0.6} seed={5} />
      </X>
      {[-1, 1].map((k) => (
        <X key={k} x={k * (w / 2 + 120)} y={0} z={0.008}>
          <Part shape={cloudShape(420, 220, 5, k + 4)} color="#4f8a3e" shade={0.24} y={90} />
        </X>
      ))}
    </X>
  );
};

// ───────────────────────── the ball court ─────────────────────────

/** Ball court seen down the alley: sloped benches, high walls, a stone ring on each. Origin = alley floor centre. */
export const BallCourt: React.FC<XProps & { w?: number; h?: number; color?: string }> = ({ w = 1800, h = 520, color = "#d9ccb0", ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(w * 2, 60, 0)} color="#c9b48a" flat outline={0} y={-30} />
    {[-1, 1].map((k) => (
      <X key={k} x={k * w * 0.36} z={0.001}>
        <Part shape={poly([[k * -w * 0.06, 0], [k * w * 0.2, 0], [k * w * 0.2, h], [k * w * 0.06, h], [k * w * 0.02, h * 0.3]])} color={color} shade={0.24} />
        <Part shape={poly([[k * -w * 0.06, 0], [k * w * 0.02, h * 0.3], [k * w * 0.02, h * 0.36], [k * -w * 0.08, 0]])} color={shadeHex(color, 0.15)} flat outline={3} z={0.0005} />
        <Line pts={[[k * w * 0.04, h * 0.5], [k * w * 0.2, h * 0.5]]} width={3} color={shadeHex(color, 0.3)} z={0.001} />
        <X x={k * w * 0.02} y={h * 0.72} z={0.002}>
          <Part shape={ellipse(30, 80)} color="#bcb19a" shade={0.26} x={-k * 22} />
          <Part shape={ellipse(14, 46)} color="#2a2026" flat outline={3} x={-k * 30} z={0.001} />
          <Line pts={[[-k * 6, -60], [-k * 6, 60]]} width={3} color="#8a7e66" z={0.001} />
        </X>
      </X>
    ))}
  </X>
);

/** Solid rubber ball. */
export const RubberBall: React.FC<XProps & { r?: number }> = ({ r = 40, ...xf }) => (
  <X {...xf}>
    <Part shape={circle(r)} color="#3a2e28" shade={0.3} />
    <Part shape={ellipse(r * 0.35, r * 0.2)} color="#7a6a5a" flat outline={0} x={-r * 0.3} y={r * 0.38} z={0.001} />
  </X>
);

// ───────────────────────── sets ─────────────────────────

export type JungleMood = "day" | "dawn" | "dusk" | "night" | "storm";
const MOOD: Record<JungleMood, { top: string; mid?: string; bottom: string; hills: string }> = {
  day: { top: "#7cc0e4", bottom: "#e6f2ea", hills: "#6a9a72" },
  dawn: { top: "#8ab0d8", mid: "#f0c8b0", bottom: "#fde4c4", hills: "#7a9a8a" },
  dusk: { top: "#3e3a74", mid: "#d06a5a", bottom: "#f6b46a", hills: "#4a4a5a" },
  night: { top: "#0b1030", bottom: "#24305a", hills: "#1e2a3a" },
  storm: { top: "#4a5260", bottom: "#8a929a", hills: "#4a5a50" },
};
export const jungleMood = (m: JungleMood) => MOOD[m];

// ───────────────────────── ships of the contact period ─────────────────────────

/**
 * Spanish caravel / nao (Columbus 1502, the 1511 wreck, Cortés 1519): high stern
 * castle, three masts with square sails bearing a red cross, a lateen mizzen.
 * Facing +x; origin = waterline centre. `sails` 0 furled .. 1 full, `sink` 0..1
 * tilts the bow down and lowers the hull (draw sea in front of it), `broken`
 * snaps the main mast.
 */
export const Caravel: React.FC<XProps & { len?: number; sails?: number; sink?: number; broken?: boolean; hull?: string }> = ({
  len = 1000,
  sails = 1,
  sink = 0,
  broken = false,
  hull = "#6e4a2c",
  ...xf
}) => {
  const frame = useCurrentFrame();
  const L = len / 2;
  const sway = Math.sin(frame * 0.05) * 0.015;
  const sail = (w: number, h: number, y: number, cross: boolean, k: number) => {
    const sh = h * Math.max(0.12, sails);
    const belly = 26 * sails;
    return (
      <X y={y} z={0.002 + k * 0.0001}>
        <Part
          shape={blob([[-w / 2, 0], [-w / 2 - belly * 0.4, -sh / 2], [-w / 2, -sh], [0, -sh - belly * 0.3], [w / 2, -sh], [w / 2 + belly, -sh / 2], [w / 2, 0], [0, belly * 0.4]], 10)}
          color="#efe6d0"
          shade={0.22}
        />
        {cross && sails > 0.4 ? (
          <>
            <Line pts={[[0, -sh * 0.15], [0, -sh * 0.85]]} width={w * 0.12} color="#b8322a" z={0.001} />
            <Line pts={[[-w * 0.3, -sh * 0.45], [w * 0.3, -sh * 0.45]]} width={w * 0.12} color="#b8322a" z={0.001} />
          </>
        ) : null}
        <Line pts={[[-w / 2 - 14, 0], [w / 2 + 14, 0]]} width={8} color="#4a3220" z={0.002} />
      </X>
    );
  };
  return (
    <X {...xf}>
      <X rot={sway - sink * 0.42} y={-sink * 420} x={sink * 80}>
        {/* masts and rigging behind the hull */}
        <X z={-0.01}>
          {[
            [-L * 0.62, 260],
            [0, broken ? 0 : 640],
            [L * 0.42, 500],
          ].map(([x, h], i) => (
            <X key={i} x={x}>
              <Line pts={[[0, 60], [0, 60 + h]]} width={i === 1 ? 16 : 12} color="#4a3220" />
              {h > 0 ? <Line pts={[[0, 60 + h], [L * (i === 2 ? 0.55 : 0.3), 90]]} width={3} color="#4a3220" opacity={0.7} z={-0.001} /> : null}
            </X>
          ))}
          {broken ? (
            <X x={0} y={180} rot={-1.1} z={0.003}>
              <Line pts={[[0, 0], [0, 420]]} width={16} color="#4a3220" />
              {sail(300, 260, 380, true, 3)}
            </X>
          ) : null}
        </X>
        {/* sails */}
        <X z={-0.005}>
          {broken ? null : (
            <X x={0}>
              {sail(380, 280, 640, true, 0)}
              {sail(300, 170, 360 + 0 * 1, false, 1)}
            </X>
          )}
          <X x={L * 0.42}>{sail(280, 220, 500, true, 2)}</X>
          <X x={-L * 0.62} y={150} z={0.001}>
            <Line pts={[[-140, 0], [120, 230]]} width={7} color="#4a3220" />
            <Part shape={poly([[-130, 10], [110, 224], [40, 6]])} color="#efe6d0" shade={0.2} opacity={Math.max(0.2, sails)} />
          </X>
          {!broken ? <SpanishFlag x={0} y={700} w={90} z={0.002} /> : null}
          <SpanishFlag x={L * 0.42} y={560} w={70} z={0.002} />
        </X>
        {/* hull: high stern castle (−x), forecastle (+x) */}
        <Part
          shape={blob(
            [
              [-L, 300], [-L - 30, 230], [-L + 10, 120], [-L + 60, 30], [-L * 0.4, -14], [L * 0.4, -8], [L - 60, 30], [L + 40, 150], [L + 70, 200], [L - 40, 190],
              [L * 0.5, 140], [-L * 0.45, 150], [-L * 0.55, 300],
            ],
            10,
          )}
          color={hull}
          shade={0.28}
        />
        <Line pts={[[-L + 40, 120], [-L * 0.4, 96], [L * 0.4, 92], [L - 40, 120]]} smooth width={5} color={shadeHex(hull, 0.35)} z={0.001} />
        <Line pts={[[-L + 30, 70], [-L * 0.4, 50], [L * 0.4, 46], [L - 40, 70]]} smooth width={4} color={shadeHex(hull, 0.35)} z={0.001} />
        <Part shape={roundRect(L * 0.55, 18, 6)} color="#b8322a" flat outline={3} x={-L * 0.72} y={250} z={0.002} />
        {[0, 1, 2].map((k) => (
          <Part key={k} shape={roundRect(34, 30, 6)} color="#2a2026" flat outline={3} x={-L * 0.88 + k * 70} y={200} z={0.002} />
        ))}
        {[-0.25, 0, 0.25].map((q) => (
          <Part key={q} shape={circle(12)} color="#2a2026" flat outline={2.5} x={q * L * 1.4} y={75} z={0.002} />
        ))}
      </X>
    </X>
  );
};

/**
 * Big Maya trading canoe (the one Columbus met off Guanaja in 1502): a long dugout
 * with a palm-thatch shelter amidships and cargo (cotton cloth, copper axes,
 * cacao sacks, pots). `paddlers` simple rowers on each side of the shelter.
 * Facing +x; origin = waterline centre.
 */
export const TradeCanoe: React.FC<XProps & { len?: number; paddlers?: number; row?: number; cargo?: boolean }> = ({ len = 1500, paddlers = 8, row = 1, cargo = true, ...xf }) => {
  const frame = useCurrentFrame();
  const L = len / 2;
  const seats = Array.from({ length: paddlers }, (_, k) => {
    const half = Math.ceil(paddlers / 2);
    const side = k < half ? -1 : 1;
    const j = k < half ? k : k - half;
    return side * (L * 0.36 + j * ((L * 0.5) / Math.max(1, half - 1 || 1)));
  });
  return (
    <X {...xf}>
      {seats.map((x, k) => {
        const ph = frame * 0.18 * row + k * 0.35;
        return (
          <X key={`p${k}`} x={Math.max(-L + 90, Math.min(L - 90, x))} y={40} s={0.42} z={-0.004 + k * 0.0001}>
            <Part shape={roundRect(110, 130, 30)} color={["#f1ead8", "#e2d2b0", "#d8c8a8"][k % 3]} shade={0.2} y={70} />
            <Part shape={circle(64)} color="#f6f5f8" shade={0.24} y={200} z={0.001} />
            <Part shape={blob([[-60, 230], [0, 280], [60, 230], [20, 214]], 6)} color="#1e1a20" flat z={0.002} />
            <X x={30} y={110} rot={-0.6 + Math.sin(ph) * 0.4 * row} z={0.003}>
              <Line pts={[[0, 0], [0, -260]]} width={9} color="#6e4a2c" />
              <Part shape={blob([[-16, -230], [16, -230], [12, -320], [0, -340], [-12, -320]], 6)} color="#8a5a32" shade={0.25} />
            </X>
          </X>
        );
      })}
      <Part
        shape={blob([[-L - 40, 70], [-L + 40, 4], [0, -12], [L - 40, 4], [L + 50, 80], [L - 10, 62], [0, 52], [-L + 10, 62]], 10)}
        color="#7a4e2c"
        shade={0.26}
        z={0.001}
      />
      <Line pts={[[-L + 30, 42], [0, 36], [L - 30, 42]]} smooth width={5} color="#c0392b" z={0.002} />
      {/* shelter of palm thatch */}
      <X y={50} z={-0.002}>
        {[-150, 150].map((x) => (
          <Line key={x} pts={[[x, 0], [x, 230]]} width={8} color="#6e4a2c" />
        ))}
        <Part shape={blob([[-230, 210], [0, 290], [230, 210], [200, 190], [0, 214], [-200, 190]], 8)} color="#c8a25a" shade={0.24} z={0.001} />
        {[-160, -80, 0, 80, 160].map((x) => (
          <Line key={x} pts={[[x, 200 + (1 - Math.abs(x) / 230) * 18], [x * 1.05, 236 + (1 - Math.abs(x) / 230) * 40]]} width={3} color="#a88238" z={0.002} />
        ))}
      </X>
      {cargo ? (
        <X y={50} z={0.0005}>
          {[[-110, "#f1ead8", 70], [-30, "#3a9ac9", 60], [50, "#c0392b", 64], [120, "#d9a441", 56]].map(([x, c, h], i) => (
            <Part key={i} shape={roundRect(70, h as number, 14)} color={c as string} shade={0.22} x={x as number} y={(h as number) / 2} />
          ))}
          <Part shape={blob([[-40, 0], [40, 0], [56, 50], [30, 80], [-30, 80], [-56, 50]], 8)} color="#8a5a32" shade={0.24} x={10} y={70} z={0.001} />
          <Part shape={blob([[-30, 0], [30, 0], [44, 40], [0, 60], [-44, 40]], 7)} color="#d9864a" shade={0.24} x={-80} y={70} z={0.001} />
        </X>
      ) : null}
    </X>
  );
};
