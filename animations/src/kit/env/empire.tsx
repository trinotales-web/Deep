import React from "react";
import { useCurrentFrame } from "remotion";
import { Part, Line } from "../Part";
import { X, type XProps } from "../context";
import { Glow } from "../effects";
import { blob, circle, ellipse, limb, poly, roundPoly, roundRect } from "../shapes";
import { palette, shadeHex, mixHex } from "../style";
import { rng, noise1 } from "../random";
import { Smoke, Flame } from "./fire";
import { Fireball } from "./space";
import { Wheel } from "./qin";
import { NationFlag, type FlagKind } from "./landers";
import { Puffs } from "./whales";

// The Napoleonic era (1769–1821): muskets and field guns, horses and mules,
// ships of the line, the guillotine, the Rosetta Stone, ornate painting
// frames, snow, fog, and a few lab icons for the modern science bits.

type P = [number, number];
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** A straight bar from a to b (rounded ends). */
const Bar: React.FC<{ a: P; b: P; w: number; color: string; z?: number; flat?: boolean; outline?: number }> = ({ a, b, w, color, z = 0, flat = false, outline }) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  return (
    <X x={(a[0] + b[0]) / 2} y={(a[1] + b[1]) / 2} rot={Math.atan2(dy, dx)} z={z}>
      <Part shape={roundRect(len + w, w, w / 2)} color={color} shade={flat ? undefined : 0.2} flat={flat} outline={outline} />
    </X>
  );
};

// ───────────────────────── weapons ─────────────────────────

/**
 * Charleville flintlock musket with bayonet, pointing +x. Origin = trigger.
 * `fire` 0..1: pan flash, muzzle flash and a puff of white smoke.
 */
export const Musket: React.FC<XProps & { fire?: number; bayonet?: boolean; len?: number }> = ({ fire = 0, bayonet = true, len = 560, ...xf }) => {
  const wood = "#8a5532";
  const steel = "#b9bcc6";
  const brass = "#d6a640";
  const f = clamp01(fire);
  const on = f > 0 && f < 1;
  return (
    <X {...xf}>
      {/* stock: butt, wrist, fore-stock */}
      <Part shape={roundPoly([[-210, -34], [-120, -10], [-40, -6], [len * 0.62, 4], [len * 0.62, 18], [-40, 14], [-120, 20], [-214, 30]], [10, 8, 6, 4, 4, 6, 8, 10])} color={wood} shade={0.22} />
      <Line pts={[[-196, 18], [-130, 10], [-60, 6]]} smooth width={3.5} color={shadeHex(wood, 0.3)} z={0.001} />
      {/* barrel with brass bands */}
      <Part shape={roundRect(len + 30, 14, 6)} color={steel} shade={0.25} x={len * 0.5 - 40} y={24} z={0.002} />
      {[len * 0.18, len * 0.4, len * 0.6].map((bx) => (
        <Part key={bx} shape={roundRect(12, 30, 3)} color={brass} flat outline={3} x={bx} y={16} z={0.003} />
      ))}
      {/* lock: plate, hammer, frizzen */}
      <Part shape={roundRect(70, 20, 6)} color={steel} shade={0.2} x={-18} y={8} z={0.003} />
      <Part shape={roundPoly([[-40, 12], [-34, 44], [-22, 46], [-26, 14]], 4)} color={shadeHex(steel, 0.15)} flat outline={3} z={0.004} />
      <Part shape={roundRect(10, 26, 3)} color={shadeHex(steel, 0.1)} flat outline={3} x={2} y={26} z={0.004} />
      {/* trigger guard */}
      <Line pts={[[-30, -8], [-18, -26], [8, -26], [16, -8]]} smooth width={5} color={brass} z={0.003} />
      <Line pts={[[-6, -6], [-4, -20]]} width={4} color={steel} z={0.003} />
      {bayonet ? (
        <X x={len + 4} y={24} z={0.001}>
          <Part shape={roundRect(30, 18, 5)} color={steel} flat outline={3} y={-12} />
          <Part shape={poly([[0, -12], [170, -4], [0, 4]])} color={shadeHex(steel, -0.15)} shade={0.25} outline={3.5} y={-12} />
        </X>
      ) : null}
      {on ? (
        <>
          <X x={-6} y={30} z={0.01}>
            <Part shape={blob([[0, 0], [16, 30], [0, 44], [-16, 30]], 6)} color="#ffe27a" flat outline={0} opacity={1 - f} s={0.6 + f} />
          </X>
          <X x={len + 20} y={24} z={0.01}>
            <Part shape={blob([[0, -26], [70, -40], [160, 0], [70, 40], [0, 26]], 8)} color="#ffd36a" flat outline={0} opacity={Math.max(0, 1 - f * 2)} s={0.5 + f} />
            <Glow rx={220} color="#ffb35a" alpha={0.55 * (1 - f)} additive />
            <Puffs puffs={[[60 + f * 140, 10, 40 + f * 60], [130 + f * 220, 30, 34 + f * 70], [40 + f * 90, -24, 28 + f * 50]]} color="#e9e6ee" opacity={0.9 * (1 - f * 0.6)} />
          </X>
        </>
      ) : null}
    </X>
  );
};

/** Gribeauval field gun: olive carriage, bronze barrel, spoked wheel; facing +x. Origin = ground under the wheel. */
export const FieldGun: React.FC<XProps & { fire?: number; elev?: number; color?: string }> = ({ fire = 0, elev = 0.06, color = "#5f6b3c", ...xf }) => {
  const f = clamp01(fire);
  const recoil = f > 0 && f < 0.35 ? -Math.sin((f / 0.35) * Math.PI) * 30 : 0;
  const bronze = "#b8893c";
  return (
    <X {...xf}>
      <X x={recoil}>
        {/* trail to the ground at the back */}
        <Part shape={roundPoly([[-330, 10], [-300, 30], [30, 150], [50, 120], [-290, -4]], 8)} color={color} shade={0.22} z={-0.01} />
        {[-240, -150, -60].map((bx) => (
          <Part key={bx} shape={roundRect(14, 36, 4)} color="#3a3a3a" flat outline={3} x={bx} y={40 + (bx + 330) * 0.33} rot={0.42} z={-0.009} />
        ))}
        {/* barrel */}
        <X x={20} y={150} rot={elev} z={0.01}>
          <Part shape={roundPoly([[-150, -34], [250, -22], [250, 22], [-150, 34]], [12, 6, 6, 12])} color={bronze} shade={0.28} />
          <Part shape={circle(30)} color={bronze} shade={0.25} x={-156} />
          <Part shape={circle(14)} color={shadeHex(bronze, 0.15)} flat outline={3} x={-186} z={0.001} />
          {[-80, 60, 200].map((bx) => (
            <Part key={bx} shape={roundRect(14, 56 - (bx + 80) * 0.04, 4)} color={shadeHex(bronze, 0.12)} flat outline={3} x={bx} z={0.001} />
          ))}
          <Part shape={roundRect(22, 50, 6)} color={shadeHex(bronze, 0.1)} shade={0.2} x={252} z={0.002} />
          <Part shape={ellipse(8, 20)} color="#211b20" flat outline={0} x={262} z={0.003} />
          {f > 0 && f < 1 ? (
            <X x={280} z={0.01}>
              <Part shape={blob([[0, -40], [120, -70], [300, 0], [120, 70], [0, 40]], 8)} color="#ffd36a" flat outline={0} opacity={Math.max(0, 1 - f * 2.2)} s={0.5 + f} />
              <Glow rx={380} color="#ffb35a" alpha={0.6 * (1 - f)} additive />
              <Puffs puffs={[[100 + f * 200, 10, 46 + f * 60], [200 + f * 280, 40, 40 + f * 66], [70 + f * 120, -34, 34 + f * 50], [260 + f * 220, -14, 34 + f * 50]]} color="#e4e1ea" opacity={0.92 * (1 - f * 0.7)} />
            </X>
          ) : null}
        </X>
        <Wheel r={96} x={0} y={96} color="#4f5a30" z={0.02} />
        <Part shape={circle(18)} color="#3a3a3a" flat outline={3} y={96} z={0.03} />
      </X>
    </X>
  );
};

/** A small pile of cannonballs. */
export const Cannonballs: React.FC<XProps & { n?: number }> = ({ n = 6, ...xf }) => (
  <X {...xf}>
    {Array.from({ length: n }, (_, i) => {
      const row = i < 3 ? 0 : i < 5 ? 1 : 2;
      const col = row === 0 ? i : row === 1 ? i - 3 : 0;
      return <Part key={i} shape={circle(26)} color="#3a3840" shade={0.3} x={(col - (row === 0 ? 1 : row === 1 ? 0.5 : 0)) * 52} y={26 + row * 44} z={row * 0.001} />;
    })}
  </X>
);

/** Curved cavalry sabre, blade toward +y (local). */
export const Sabre: React.FC<XProps & { color?: string }> = ({ color = "#c9ccd3", ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(16, 54, 6)} color="#3a2a22" shade={0.2} y={-10} />
    <Part shape={blob([[-24, 20], [24, 20], [18, 30], [-18, 30]], 4)} color={palette.gold} flat outline={3} z={0.001} />
    <Part shape={blob([[-8, 28], [8, 28], [26, 160], [40, 250], [20, 252], [-2, 160]], 8)} color={color} shade={0.25} z={0.002} />
  </X>
);

/** Crossed sabres icon (battle tally). `lost` paints it red and greys it. */
export const BattleIcon: React.FC<XProps & { lost?: boolean }> = ({ lost = false, ...xf }) => (
  <X {...xf}>
    <Part shape={circle(64)} color={lost ? "#e2574a" : "#f4e2b0"} shade={0.15} outline={5} />
    <X rot={0.75} z={0.01} s={0.36} y={-28} x={-26}>
      <Sabre color={lost ? "#7a6a6a" : "#c9ccd3"} />
    </X>
    <X rot={-0.75} z={0.02} s={0.36} y={-28} x={26} sx={-1}>
      <Sabre color={lost ? "#7a6a6a" : "#c9ccd3"} />
    </X>
  </X>
);

// ───────────────────────── horses ─────────────────────────

/**
 * Horse or mule, side view facing +x, origin = ground under the body.
 * `walk` animates two-joint legs; `rear` 0..1 rears up on the hind legs
 * (pivot at the hip, front legs folded); `mule` gives long ears, a brush mane
 * and a tufted tail; `cloth`/`trim` add a saddle cloth with a saddle; children
 * sit on the saddle (rider origin = seat).
 */
export const Steed: React.FC<
  XProps & { color?: string; mane?: string; walk?: number; rear?: number; mule?: boolean; cloth?: string | null; trim?: string; seed?: number; children?: React.ReactNode; muzzle?: string }
> = ({ color = "#8a5a3a", mane = "#2a2220", walk = 0, rear = 0, mule = false, cloth = null, trim = palette.gold, seed = 0, muzzle, children, ...xf }) => {
  const frame = useCurrentFrame();
  const ph = frame * 0.3 * walk + seed;
  const r = clamp01(rear);
  const far = shadeHex(color, 0.16);
  const hoof = "#2a2220";
  const leg = (hip: P, k: number, isFar: boolean, front: boolean, inRear: boolean) => {
    let up = Math.sin(ph + k) * 0.38 * walk;
    let low = (front ? -1 : 1) * Math.max(0, Math.sin(ph + k + (front ? 1.2 : -0.8))) * 0.75 * walk;
    if (inRear && front) {
      up = up * (1 - r) + (isFar ? 1.15 : 0.9) * r;
      low = low * (1 - r) - (isFar ? 1.7 : 1.45) * r;
    } else if (!front) {
      up = up * (1 - r) + (isFar ? 0.42 : 0.3) * r;
      low = low * (1 - r) - 0.25 * r;
    }
    const c = isFar ? far : color;
    return (
      <X x={hip[0]} y={hip[1]} rot={up} z={isFar ? -0.03 : 0.03}>
        <Part shape={limb(100, front ? 46 : 58, 30)} color={c} shade={0.22} />
        <X y={-100} rot={low} z={0.002}>
          <Part shape={circle(15)} color={c} shade={0.2} />
          <Part shape={limb(86, 26, 22)} color={c} shade={0.22} z={0.001} />
          <Part shape={roundPoly([[-16, -78], [18, -78], [22, -100], [-18, -100]], 5)} color={hoof} flat outline={3.5} z={0.002} />
        </X>
      </X>
    );
  };
  const bodyCol = color;
  const pivot: P = [-125, 205];
  return (
    <X {...xf}>
      {/* hind legs stay planted at the pivot */}
      {leg([-125, 205], 0, true, false, false)}
      <X x={pivot[0]} y={pivot[1]} rot={r * 0.62}>
        <X x={-pivot[0]} y={-pivot[1]}>
          {leg([110, 210], Math.PI, true, true, true)}
          {/* tail */}
          {mule ? (
            <X x={-168} y={268} z={-0.02}>
              <Line pts={[[0, 0], [-26, -40], [-34, -110]]} smooth width={14} color={shadeHex(bodyCol, 0.1)} />
              <Part shape={blob([[-34, -100], [-14, -150], [-36, -186], [-58, -150]], 6)} color={mane} shade={0.2} z={0.001} />
            </X>
          ) : (
            <X x={-166} y={272} rot={Math.sin(frame * 0.1 + seed) * 0.06} z={-0.02}>
              <Part shape={blob([[0, 0], [-46, -30], [-62, -110], [-50, -190], [-20, -150], [-14, -80], [10, -20]], 8)} color={mane} shade={0.22} />
              <Line pts={[[-30, -40], [-44, -120]]} smooth width={3.5} color={shadeHex(mane, 0.5)} z={0.001} />
            </X>
          )}
          {/* body */}
          <Part shape={blob([[-172, 232], [-150, 296], [-20, 306], [110, 300], [176, 262], [160, 196], [10, 176], [-150, 186]], 10)} color={bodyCol} shade={0.22} />
          <Line pts={[[-120, 214], [-40, 200], [40, 202]]} smooth width={3.5} color={shadeHex(bodyCol, 0.3)} z={0.001} />
          {/* neck + head (arch forward when rearing) */}
          <X x={140} y={270} rot={-r * 0.5}>
          <X x={-140} y={-270}>
          <Part shape={blob([[100, 278], [148, 342], [196, 412], [236, 410], [252, 380], [196, 304], [172, 236]], 8)} color={bodyCol} shade={0.22} z={0.005} />
          <X x={240} y={392} rot={-0.78 - r * 0.25} z={0.01}>
            <Part shape={blob(mule ? [[-24, 30], [64, 28], [96, 6], [84, -24], [-12, -24], [-34, 0]] : [[-20, 30], [70, 26], [98, 2], [82, -24], [-10, -22], [-30, 0]], 8)} color={bodyCol} shade={0.22} />
            <Part shape={blob([[60, 22], [92, 6], [84, -22], [56, -18]], 6)} color={muzzle ?? (mule ? "#cfc5b8" : shadeHex(bodyCol, 0.12))} shade={0.2} z={0.001} />
            <Part shape={circle(8)} color="#211b20" flat outline={0} x={6} y={6} z={0.002} />
            <Part shape={circle(3)} color="#ffffff" flat outline={0} x={8} y={9} z={0.003} />
            <Part shape={ellipse(5, 3)} color="#211b20" flat outline={0} x={84} y={-4} z={0.002} />
            {mule ? (
              <>
                <X x={-20} y={22} rot={0.35} z={-0.002}>
                  <Part shape={ellipse(14, 52)} color={bodyCol} shade={0.2} y={44} />
                  <Part shape={ellipse(6, 34)} color="#e8c8c0" flat outline={0} y={46} z={0.001} />
                </X>
                <X x={-30} y={18} rot={0.6} z={-0.004}>
                  <Part shape={ellipse(13, 48)} color={far} shade={0.2} y={42} />
                </X>
              </>
            ) : (
              <Part shape={poly([[-26, 20], [-12, 56], [-2, 22]])} color={bodyCol} shade={0.2} z={-0.001} />
            )}
            {/* bridle */}
            <Line pts={[[-16, 24], [40, 6], [76, -18]]} width={4} color="#3a2420" z={0.003} />
            <Line pts={[[40, 26], [40, -20]]} width={4} color="#3a2420" z={0.003} />
          </X>
          {/* mane */}
          {mule ? (
            <Part shape={blob([[124, 304], [170, 368], [206, 422], [218, 410], [184, 352], [146, 298]], 6)} color={mane} flat z={0.012} />
          ) : (
            <X z={0.012}>
              <Part shape={blob([[116, 296], [150, 352], [204, 428], [222, 408], [186, 336], [150, 284], [120, 270]], 6)} color={mane} shade={0.2} />
              <Line pts={[[140, 300], [176, 360], [200, 400]]} smooth width={3.5} color={shadeHex(mane, 0.45)} z={0.001} />
            </X>
          )}
          </X>
          </X>
          {cloth ? (
            <X z={0.02}>
              <Part shape={roundPoly([[-96, 312], [62, 314], [56, 220], [10, 206], [-80, 212], [-104, 236]], [12, 12, 20, 10, 10, 18])} color={cloth} shade={0.2} />
              <Line pts={[[-98, 238], [-80, 216], [10, 210], [52, 222]]} smooth width={8} color={trim} z={0.001} />
              <Part shape={roundPoly([[-62, 300], [44, 300], [52, 332], [30, 318], [-46, 318], [-70, 334]], 8)} color="#5a3422" shade={0.22} z={0.002} />
              <Line pts={[[-4, 300], [-4, 210]]} width={5} color="#3a2420" z={0.003} />
            </X>
          ) : null}
          {children ? <X x={-10} y={316} z={0.05}>{children}</X> : null}
          {leg([118, 212], 0, false, true, true)}
        </X>
      </X>
      {leg([-118, 207], Math.PI, false, false, false)}
    </X>
  );
};

// ───────────────────────── ships ─────────────────────────

/**
 * Ship of the line (two gun decks), side view facing +x. Origin = waterline
 * centre. `navy` sets the paint and ensign; `sail` 0..1 sets the canvas;
 * `fire` 0..1 runs a broadside along the ports; `burn` 0..1 sets her alight;
 * `explode` 0..1 blows her up (L'Orient at the Nile); `sink` lowers her.
 */
export const ShipOfLine: React.FC<
  XProps & { len?: number; navy?: "uk" | "fr"; sail?: number; fire?: number; burn?: number; explode?: number; sink?: number; list?: number; seed?: number; flag?: boolean }
> = ({ len = 1400, navy = "uk", sail = 1, fire = 0, burn = 0, explode = 0, sink = 0, list = 0, seed = 0, flag = true, ...xf }) => {
  const frame = useCurrentFrame();
  const L = len;
  const hullC = navy === "uk" ? "#2a2226" : "#3a2a24";
  const band = navy === "uk" ? "#e2b84a" : "#b8392f";
  const bob = Math.sin(frame * 0.05 + seed) * 6;
  const roll = Math.sin(frame * 0.04 + seed) * 0.008;
  const b = clamp01(burn);
  const ex = clamp01(explode);
  const gone = ex > 0.35;
  const canvas = mixHex("#f3ead6", "#3a3236", b * 0.85);
  const masts: { x: number; h: number }[] = [
    { x: -0.3 * L, h: 760 },
    { x: 0.02 * L, h: 860 },
    { x: 0.3 * L, h: 720 },
  ];
  const ports = Math.floor((L * 0.72) / 70);
  const portX = (i: number) => -L * 0.36 + i * 70;
  const xs = 300 / 1400;
  return (
    <X {...xf} y={(xf.y ?? 0) + bob - sink * 520} rot={(xf.rot ?? 0) + roll + list}>
      {!gone ? (
        <>
          {/* masts, yards, sails */}
          {masts.map((m, mi) => {
            const deck = 214;
            return (
              <X key={mi} x={m.x} z={-0.05 + mi * 0.001}>
                <Part shape={roundRect(22, m.h, 8)} color="#6a4a30" shade={0.2} y={deck + m.h / 2} />
                {[0.36, 0.64, 0.86].map((k, j) => {
                  const yw = (j === 0 ? 360 : j === 1 ? 270 : 190) * (L / 1400 > 0.8 ? 1 : 0.9);
                  const yy = deck + m.h * k;
                  const sh = (j === 0 ? 210 : j === 1 ? 170 : 110) * clamp01(sail);
                  const bil = Math.sin(frame * 0.07 + mi + j) * 6;
                  return (
                    <X key={j} y={yy}>
                      <Part shape={roundRect(yw + 30, 12, 6)} color="#5a3a24" flat outline={3.5} z={0.004} />
                      {sail > 0.05 ? (
                        <X z={0.002}>
                          <Part
                            shape={blob([[-yw / 2, 0], [yw / 2, 0], [yw / 2 + 14 + bil, -sh * 0.5], [yw / 2 - 6, -sh], [-yw / 2 + 6, -sh], [-yw / 2 - 14 - bil, -sh * 0.5]], 8)}
                            color={canvas}
                            shade={0.24}
                          />
                          <Line pts={[[-yw * 0.2, -6], [-yw * 0.24, -sh + 8]]} smooth width={3} color={shadeHex(canvas, 0.25)} z={0.001} />
                          <Line pts={[[yw * 0.2, -6], [yw * 0.24, -sh + 8]]} smooth width={3} color={shadeHex(canvas, 0.25)} z={0.001} />
                          {b > 0.3 && (j + mi) % 2 === 0 ? <Part shape={blob([[-30, -sh * 0.3], [40, -sh * 0.4], [20, -sh * 0.8], [-40, -sh * 0.7]], 6)} color="#211b20" flat outline={0} opacity={0.8} z={0.002} /> : null}
                        </X>
                      ) : null}
                    </X>
                  );
                })}
                {/* pennant */}
                <X y={deck + m.h - 10} z={0.005}>
                  <Part shape={poly([[0, 0], [150 + Math.sin(frame * 0.2 + mi) * 12, -10], [0, -22]])} color={navy === "uk" ? "#c8262f" : "#2f4f9a"} flat outline={3} />
                </X>
              </X>
            );
          })}
          {/* rigging lines */}
          {masts.map((m, mi) => (
            <X key={`rg${mi}`} z={-0.06}>
              <Line pts={[[m.x, 214 + m.h], [m.x - 200, 220]]} width={3} color="#3a2a22" />
              <Line pts={[[m.x, 214 + m.h], [m.x + 200, 220]]} width={3} color="#3a2a22" />
            </X>
          ))}
          {/* bowsprit */}
          <Bar a={[L / 2 - 60, 210]} b={[L / 2 + xs * L, 330]} w={18} color="#6a4a30" z={-0.04} />
          <Line pts={[[L / 2 + xs * L, 330], [masts[2].x, 214 + masts[2].h * 0.86]]} width={3} color="#3a2a22" z={-0.06} />
          {sail > 0.05 ? (
            <Part shape={poly([[L / 2 + 20, 240], [L / 2 + xs * L - 20, 322], [L / 2 + 40, 520]])} color={canvas} shade={0.2} z={-0.03} />
          ) : null}
          {/* hull */}
          <Part
            shape={roundPoly(
              [
                [-L / 2 + 30, -36],
                [L / 2 - 170, -44],
                [L / 2 - 40, 50],
                [L / 2 + 20, 170],
                [L / 2 - 50, 226],
                [0.1 * L, 210],
                [-0.3 * L, 226],
                [-L / 2 + 40, 300],
                [-L / 2 - 14, 312],
                [-L / 2 - 30, 160],
              ],
              [30, 40, 60, 20, 20, 30, 30, 10, 10, 30],
            )}
            color={hullC}
            shade={0.22}
          />
          {[78, 150].map((by) => (
            <Part key={by} shape={roundPoly([[-L / 2 + 10, by - 18], [L / 2 - 40 - (by < 100 ? 90 : 10), by - 18], [L / 2 - 30 - (by < 100 ? 90 : 10), by + 18], [-L / 2 + 6, by + 18]], 6)} color={band} shade={0.15} z={0.002} />
          ))}
          {[78, 150].flatMap((by, row) =>
            Array.from({ length: ports - row }, (_, i) => (
              <X key={`p${row}${i}`} x={portX(i) + row * 35} y={by} z={0.004}>
                <Part shape={roundRect(30, 26, 4)} color="#1a1418" flat outline={3} />
                <Part shape={roundRect(18, 10, 3)} color="#3a3840" flat outline={2.5} x={14} z={0.001} />
              </X>
            )),
          )}
          {/* stern gallery */}
          <X x={-L / 2 + 30} y={250} z={0.005}>
            <Part shape={roundRect(70, 90, 10)} color={band} shade={0.2} />
            {[-14, 14].map((wx) => (
              <Part key={wx} shape={roundRect(18, 26, 4)} color="#ffe9a8" flat outline={3} x={wx} y={14} z={0.001} />
            ))}
          </X>
          {/* figurehead */}
          <Part shape={blob([[L / 2 - 10, 150], [L / 2 + 34, 196], [L / 2 + 22, 236], [L / 2 - 20, 214]], 6)} color={palette.gold} shade={0.25} z={0.003} />
          {flag ? <NationFlag kind={(navy === "uk" ? "uk" : "france") as FlagKind} w={170} pole={150} x={-L / 2 - 20} y={290} rot={-0.1} z={0.006} /> : null}
          {/* broadside */}
          {fire > 0 && fire < 1
            ? Array.from({ length: ports }, (_, i) => {
                const lt = fire * 1.6 - (i / ports) * 0.9;
                if (lt < 0 || lt > 0.7) return null;
                const k = lt / 0.7;
                return (
                  <X key={`f${i}`} x={portX(i) + 10} y={78} z={0.02}>
                    <Part shape={blob([[0, -18], [30, -10], [60, -40], [44, 0], [70, 30], [24, 14], [0, 18]], 6)} color="#ffd36a" flat outline={0} opacity={Math.max(0, 1 - k * 2.5)} y={-30} rot={-Math.PI / 2} />
                    <Puffs puffs={[[0, -60 - k * 90, 30 + k * 70], [24, -40 - k * 140, 24 + k * 60]]} color="#e9e6ee" opacity={0.85 * (1 - k * 0.4)} />
                  </X>
                );
              })
            : null}
          {/* fire */}
          {b > 0.02 ? (
            <X z={0.03}>
              {[-0.34, -0.18, 0.0, 0.16, 0.32].map((fx, i) => (
                <X key={i} x={fx * L} y={226} s={(0.6 + 0.6 * noise1(i * 3.1 + seed)) * clamp01(b * 1.6 - i * 0.12) * 1.6}>
                  <Flame size={1.6} seed={seed + i} />
                </X>
              ))}
              <Smoke x={0} y={500} w={L * 0.5} h={1100} alpha={0.55 * b} color="#3a3236" seed={seed + 2} />
            </X>
          ) : null}
        </>
      ) : null}
      {ex > 0 && ex < 1 ? (
        <X y={200} z={0.1}>
          <Fireball t={ex} size={L / 520} seed={seed} />
          {Array.from({ length: 10 }, (_, i) => {
            const rr = rng(seed + i * 7);
            const a = rr() * Math.PI;
            const d = ex * (500 + rr() * 700);
            return <Part key={i} shape={roundRect(60 + rr() * 80, 18, 4)} color="#4a3426" shade={0.2} x={Math.cos(a) * d} y={Math.sin(a) * d - ex * ex * 400} rot={ex * (4 + i)} z={0.01} />;
          })}
        </X>
      ) : null}
    </X>
  );
};

/** Small one-masted sloop (Napoleon's escape boats). Facing +x, origin waterline. */
export const Sloop: React.FC<XProps & { sail?: number; seed?: number; flag?: FlagKind | null }> = ({ sail = 1, seed = 0, flag = "france", ...xf }) => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame * 0.07 + seed) * 6;
  return (
    <X {...xf} y={(xf.y ?? 0) + bob} rot={(xf.rot ?? 0) + Math.sin(frame * 0.05 + seed) * 0.02}>
      <Part shape={roundRect(16, 560, 6)} color="#6a4a30" shade={0.2} x={-20} y={330} z={-0.02} />
      <Part shape={blob([[-10, 110], [-10, 560], [240 * sail + 20, 160], [200 * sail, 110]], 8)} color="#f3ead6" shade={0.24} z={-0.01} />
      <Part shape={blob([[-30, 130], [-30, 480], [-250 * sail - 30, 140]], 8)} color="#efe4cc" shade={0.24} z={-0.015} />
      <Part shape={roundPoly([[-300, 110], [300, 120], [250, -30], [-240, -36]], [20, 30, 50, 40])} color="#6a4430" shade={0.22} />
      <Part shape={roundRect(560, 18, 6)} color="#e2b84a" flat outline={3} y={80} z={0.001} />
      {flag ? <NationFlag kind={flag} w={110} pole={90} x={-300} y={110} z={0.002} /> : null}
    </X>
  );
};

// ───────────────────────── art & objects ─────────────────────────

/** Ornate gilded frame around a canvas; children draw on the canvas (origin = canvas centre). */
export const Painting: React.FC<XProps & { w?: number; h?: number; canvas?: string; plate?: boolean; children?: React.ReactNode }> = ({ w = 900, h = 640, canvas = "#e8dcc0", plate = true, children, ...xf }) => {
  const gold = "#d8a93a";
  return (
    <X {...xf}>
      <Part shape={roundRect(w + 140, h + 140, 14)} color={gold} shade={0.25} z={-0.02} />
      <Part shape={roundRect(w + 70, h + 70, 8)} color={shadeHex(gold, 0.18)} shade={0.2} z={-0.015} />
      <Part shape={roundRect(w + 26, h + 26, 4)} color={shadeHex(gold, -0.15)} flat outline={4} z={-0.012} />
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sy) => (
          <X key={`${sx}${sy}`} x={sx * (w / 2 + 52)} y={sy * (h / 2 + 52)} z={-0.01}>
            <Part shape={circle(34)} color={shadeHex(gold, -0.12)} shade={0.25} />
            <Part shape={circle(14)} color={shadeHex(gold, 0.25)} flat outline={3} z={0.001} />
          </X>
        )),
      )}
      {[-1, 1].map((sx) => (
        <Part key={`m${sx}`} shape={ellipse(26, 60)} color={shadeHex(gold, -0.12)} shade={0.25} x={sx * (w / 2 + 52)} z={-0.01} />
      ))}
      <Part shape={roundRect(w, h, 2)} color={canvas} flat outline={4} z={-0.008} />
      <X z={0}>{children}</X>
      {plate ? <Part shape={roundRect(260, 46, 8)} color={shadeHex(gold, 0.1)} shade={0.2} y={-h / 2 - 110} z={-0.01} /> : null}
    </X>
  );
};

/** Guillotine on its scaffold. `blade` 0 = up, 1 = down. Origin = ground centre. */
export const Guillotine: React.FC<XProps & { blade?: number }> = ({ blade = 0, ...xf }) => {
  const wood = "#7a3a2a";
  const top = 980;
  const by = top - 140 - clamp01(blade) * 470;
  return (
    <X {...xf}>
      <Part shape={roundRect(640, 150, 8)} color={shadeHex(wood, 0.1)} shade={0.22} y={75} />
      {[-200, -60, 80, 220].map((px) => (
        <Line key={px} pts={[[px, 10], [px, 140]]} width={4} color={shadeHex(wood, 0.4)} z={0.001} />
      ))}
      {[-1, 1].map((k) => (
        <Part key={k} shape={roundRect(44, top - 150, 6)} color={wood} shade={0.22} x={k * 110} y={150 + (top - 150) / 2} z={0.01} />
      ))}
      <Part shape={roundRect(300, 50, 8)} color={wood} shade={0.22} y={top} z={0.02} />
      <X y={by} z={0.015}>
        <Part shape={poly([[-90, 60], [90, 60], [90, -30], [-90, 30]])} color="#c9ccd3" shade={0.25} />
        <Part shape={roundRect(190, 40, 6)} color="#5a4a40" shade={0.2} y={78} z={0.001} />
      </X>
      <X y={300} z={0.016}>
        <Part shape={roundRect(180, 70, 8)} color={wood} shade={0.22} />
        <Part shape={circle(26)} color="#211b20" flat outline={3} z={0.001} />
      </X>
      <Part shape={roundRect(70, 120, 10)} color="#b8a07a" shade={0.2} x={-220} y={210} z={0.02} />
    </X>
  );
};

/**
 * The Rosetta Stone: dark granodiorite with three bands of writing —
 * hieroglyphs (top, broken), Demotic (middle), Greek (bottom). `hi` 0..2
 * highlights one band. Origin = base centre; ~420 wide, 520 tall.
 */
export const RosettaStone: React.FC<XProps & { hi?: number | null; glow?: number }> = ({ hi = null, glow = 0, ...xf }) => {
  const stone = "#45424d";
  const ink = "#a9a5b4";
  const r = rng(11);
  const glyph = (x: number, y: number, k: number) => {
    const t = Math.floor(k * 6);
    if (t === 0) return <Part key={`${x}${y}`} shape={circle(7)} color={ink} flat outline={0} x={x} y={y} />;
    if (t === 1) return <Part key={`${x}${y}`} shape={ellipse(10, 6)} color={ink} flat outline={0} x={x} y={y} rot={0.4} />;
    if (t === 2) return <Part key={`${x}${y}`} shape={roundRect(4, 18, 2)} color={ink} flat outline={0} x={x} y={y} />;
    if (t === 3) return <Line key={`${x}${y}`} pts={[[x - 8, y - 6], [x - 3, y + 6], [x + 2, y - 6], [x + 8, y + 6]]} width={3} color={ink} />;
    if (t === 4) return <Part key={`${x}${y}`} shape={poly([[x - 8, y - 7], [x + 8, y - 7], [x, y + 8]])} color={ink} flat outline={0} />;
    return <Part key={`${x}${y}`} shape={roundRect(16, 5, 2)} color={ink} flat outline={0} x={x} y={y} />;
  };
  const bands: [number, number][] = [
    [338, 470],
    [196, 326],
    [24, 184],
  ];
  return (
    <X {...xf}>
      <Part shape={roundPoly([[-210, 0], [210, 0], [214, 380], [170, 440], [80, 520], [-100, 506], [-170, 470], [-206, 420]], 10)} color={stone} shade={0.26} />
      {hi !== null && hi >= 0 && glow > 0 ? (
        <Part shape={roundRect(400, bands[hi][1] - bands[hi][0] + 10, 8)} color="#ffe27a" flat outline={0} opacity={0.35 * glow} y={(bands[hi][0] + bands[hi][1]) / 2} z={0.001} />
      ) : null}
      <X z={0.002}>
        {Array.from({ length: 5 }, (_, row) =>
          Array.from({ length: 13 }, (_, i) => {
            const x = -168 + i * 28;
            const y = 350 + row * 26;
            if (y > 470 - Math.max(0, x - 40) * 0.5 || (x < -150 && y > 440)) return null;
            return glyph(x, y, r());
          }),
        )}
        {Array.from({ length: 6 }, (_, row) => {
          const y = 210 + row * 22;
          const segs: React.ReactNode[] = [];
          let x = -186;
          let i = 0;
          while (x < 180) {
            const wl = 18 + r() * 30;
            segs.push(<Line key={`d${row}${i}`} pts={[[x, y], [x + wl * 0.3, y + 5], [x + wl * 0.6, y - 4], [x + wl, y + 2]]} smooth width={3} color={ink} />);
            x += wl + 10;
            i++;
          }
          return segs;
        })}
        {Array.from({ length: 7 }, (_, row) => {
          const y = 36 + row * 22;
          const segs: React.ReactNode[] = [];
          let x = -190;
          let i = 0;
          while (x < 186) {
            const wl = 10 + r() * 26;
            segs.push(<Part key={`g${row}${i}`} shape={roundRect(wl, 5, 2)} color={ink} flat outline={0} x={x + wl / 2} y={y} />);
            x += wl + 8;
            i++;
          }
          return segs;
        })}
      </X>
    </X>
  );
};

/** Gold laurel crown (Napoleon's coronation wreath) seen at a slight angle. */
export const LaurelCrown: React.FC<XProps & { r?: number }> = ({ r = 120, ...xf }) => (
  <X {...xf}>
    {Array.from({ length: 22 }, (_, i) => {
      const a = (i / 22) * Math.PI * 2;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r * 0.32;
      const front = Math.sin(a) < 0;
      return <Part key={i} shape={ellipse(26, 11)} color={i % 2 ? "#e2b23c" : "#f2cc5a"} shade={0.25} outline={4} x={x} y={y} rot={a + Math.PI / 2 + (i % 2 ? 0.5 : -0.5)} z={front ? 0.01 + i * 0.0001 : -0.01} />;
    })}
  </X>
);

/** Cartoon louse (for disease), facing +x. */
export const Louse: React.FC<XProps & { color?: string; walk?: number }> = ({ color = "#c99a6a", walk = 0, ...xf }) => {
  const frame = useCurrentFrame();
  return (
    <X {...xf}>
      {[-30, 0, 30].map((lx, i) =>
        [-1, 1].map((k) => (
          <Line
            key={`${lx}${k}`}
            pts={[[lx, k * 20], [lx + 14 + Math.sin(frame * 0.6 * walk + i + k) * 8, k * 50], [lx + 30, k * 64]]}
            smooth
            width={6}
            color={shadeHex(color, 0.35)}
            z={-0.01}
          />
        )),
      )}
      <Part shape={ellipse(70, 46)} color={color} shade={0.24} x={-20} />
      {[-50, -24, 2].map((bx) => (
        <Line key={bx} pts={[[bx, -38], [bx + 4, 38]]} smooth width={3.5} color={shadeHex(color, 0.3)} z={0.001} />
      ))}
      <Part shape={ellipse(34, 30)} color={shadeHex(color, 0.08)} shade={0.2} x={58} z={0.002} />
      <Part shape={circle(9)} color="#ffffff" flat outline={3} x={70} y={10} z={0.003} />
      <Part shape={circle(4)} color="#211b20" flat outline={0} x={73} y={10} z={0.004} />
      <Line pts={[[84, 20], [110, 44]]} width={4} color={shadeHex(color, 0.4)} z={0.001} />
      <Line pts={[[84, -10], [112, -30]]} width={4} color={shadeHex(color, 0.4)} z={0.001} />
    </X>
  );
};

/** Lab microscope, side view (eyepiece up-left). Origin = base centre. */
export const Microscope: React.FC<XProps> = (xf) => (
  <X {...xf}>
    <Part shape={roundRect(260, 40, 14)} color="#3a3e4a" shade={0.22} y={20} />
    <Part shape={roundPoly([[60, 40], [110, 40], [110, 300], [60, 360], [10, 360], [60, 290]], 12)} color="#e8eaf0" shade={0.22} z={0.001} />
    <Part shape={roundRect(170, 22, 6)} color="#3a3e4a" shade={0.2} x={-20} y={160} z={0.002} />
    <X x={-10} y={330} rot={-0.35} z={0.003}>
      <Part shape={roundRect(54, 200, 14)} color="#e8eaf0" shade={0.22} y={20} />
      <Part shape={roundRect(40, 50, 8)} color="#3a3e4a" shade={0.2} y={140} z={0.001} />
      <Part shape={roundRect(30, 60, 6)} color="#c9ccd3" shade={0.2} y={-100} z={0.001} />
    </X>
    <Part shape={circle(30)} color="#3a3e4a" shade={0.25} x={86} y={200} z={0.004} />
  </X>
);

// ───────────────────────── weather ─────────────────────────

/** Falling snow over a w×h area centred on the origin (frame-driven, seeded). */
export const Snowfall: React.FC<XProps & { w?: number; h?: number; n?: number; seed?: number; wind?: number; speed?: number; size?: number; alpha?: number }> = ({ w = 2400, h = 1400, n = 140, seed = 3, wind = 0.6, speed = 1, size = 1, alpha = 1, ...xf }) => {
  const frame = useCurrentFrame();
  const r = rng(seed);
  const flakes = Array.from({ length: n }, () => ({ x: r(), y: r(), s: 0.5 + r(), v: 0.6 + r() * 0.8, p: r() * 6 }));
  return (
    <X {...xf}>
      {flakes.map((f, i) => {
        const fall = (f.y + (frame * 0.004 * f.v * speed)) % 1;
        const x = ((f.x + frame * 0.0012 * wind * f.v + Math.sin(frame * 0.05 + f.p) * 0.006 + 2) % 1) * w - w / 2;
        const y = h / 2 - fall * h;
        return <Part key={i} shape={circle(5 + f.s * 5 * size)} color="#ffffff" flat outline={0} opacity={0.9 * alpha} x={x} y={y} z={f.s > 1.1 ? 0.01 : 0} />;
      })}
    </X>
  );
};

/** Low morning fog: drifting translucent banks. `k` 0..1 density. */
export const FogBank: React.FC<XProps & { w?: number; h?: number; k?: number; seed?: number; color?: string }> = ({ w = 3000, h = 500, k = 1, seed = 5, color = "#eef0f4", ...xf }) => {
  const frame = useCurrentFrame();
  const r = rng(seed);
  const banks = Array.from({ length: 14 }, () => ({ x: r(), y: r(), rx: 0.18 + r() * 0.2, ry: 0.25 + r() * 0.3, v: (r() - 0.5) * 0.6 }));
  return (
    <X {...xf}>
      {banks.map((b, i) => (
        <Part
          key={i}
          shape={ellipse(b.rx * w, b.ry * h)}
          color={color}
          flat
          outline={0}
          opacity={clamp01(k) * (0.32 + (i % 3) * 0.08)}
          x={(((b.x + frame * 0.0006 * b.v + 1) % 1) - 0.5) * w}
          y={(b.y - 0.5) * h * 0.6}
          z={i * 0.001}
        />
      ))}
    </X>
  );
};
