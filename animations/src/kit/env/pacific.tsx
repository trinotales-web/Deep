import React from "react";
import { useCurrentFrame } from "remotion";
import { Part, Line } from "../Part";
import { X, type XProps } from "../context";
import { Glow } from "../effects";
import { blob, circle, ellipse, poly, roundPoly, roundRect } from "../shapes";
import { shadeHex } from "../style";
import { rng, noise1 } from "../random";
import { Smoke, Flame } from "./fire";
import geo from "./geo/eastAsia.json";

// Pacific War set pieces drawn to match the reference shorts: detailed Zero
// fighter (side and top views), US warships (destroyer, battleship, carrier;
// side and top views), anti-aircraft tracers and flak, splash columns, and a
// real-coastline map of Japan (Natural Earth 1:50m, public domain).

const IJN_GREEN = "#566b3e";
const IJN_BELLY = "#c8c4b0";
const COWL = "#2a2a30";
const SHIP = "#9aa3ad";
const SHIP_DARK = "#7c8692";

type P = [number, number];

// ───────────────────────── small helpers ─────────────────────────

/** Stars-and-stripes flag, top-left at the origin, flying toward +x. */
export const USFlag: React.FC<XProps & { w?: number }> = ({ w = 80, ...xf }) => {
  const h = w * 0.6;
  return (
    <X {...xf}>
      <Part shape={roundRect(w, h, 2)} color="#f4f1ea" flat outline={3} x={w / 2} y={-h / 2} />
      {[0, 2, 4, 6].map((i) => (
        <Part key={i} shape={roundRect(w, h / 7, 0)} color="#c8262f" flat outline={0} x={w / 2} y={-h / 14 - (i * h) / 7} z={0.001} />
      ))}
      <Part shape={roundRect(w * 0.42, h * 0.55, 0)} color="#2f3f7a" flat outline={0} x={w * 0.21} y={-h * 0.275} z={0.002} />
      {Array.from({ length: 6 }, (_, i) => (
        <Part key={`s${i}`} shape={circle(w * 0.022)} color="#ffffff" flat outline={0} x={w * (0.07 + (i % 3) * 0.13)} y={-h * (0.12 + Math.floor(i / 3) * 0.22)} z={0.003} />
      ))}
    </X>
  );
};

// 7-segment digits for hull numbers: segments a..g as line endpoints in a 1×2 box
const SEG: Record<string, [P, P]> = {
  a: [[0, 2], [1, 2]], b: [[1, 2], [1, 1]], c: [[1, 1], [1, 0]], d: [[0, 0], [1, 0]], e: [[0, 0], [0, 1]], f: [[0, 1], [0, 2]], g: [[0, 1], [1, 1]],
};
const DIGIT: Record<string, string> = {
  "0": "abcdef", "1": "bc", "2": "abged", "3": "abgcd", "4": "fgbc", "5": "afgcd", "6": "afgedc", "7": "abc", "8": "abcdefg", "9": "abcdfg",
};

/** White painted hull number. Origin = bottom-left of the first digit; h = digit height. */
export const HullNumber: React.FC<XProps & { n: string | number; h?: number; color?: string }> = ({ n, h = 40, color = "#f4f1ea", ...xf }) => {
  const w = h * 0.5;
  return (
    <X {...xf}>
      {String(n)
        .split("")
        .map((ch, i) =>
          (DIGIT[ch] ?? "").split("").map((sg) => {
            const [[x0, y0], [x1, y1]] = SEG[sg];
            return <Line key={`${i}${sg}`} pts={[[i * w * 1.5 + x0 * w, (y0 * h) / 2], [i * w * 1.5 + x1 * w, (y1 * h) / 2]]} width={h * 0.16} color={color} />;
          }),
        )}
    </X>
  );
};

/** Label ribbon (red banner with folded tails), as on the reference maps. Write on it with a Label. Origin = centre. */
export const Ribbon: React.FC<XProps & { w?: number; h?: number; color?: string }> = ({ w = 420, h = 74, color = "#c8402f", ...xf }) => {
  const dark = shadeHex(color, 0.3);
  return (
    <X {...xf}>
      {[-1, 1].map((k) => (
        <Part
          key={k}
          shape={poly([[k * (w / 2 - 20), h * 0.36], [k * (w / 2 + 50), h * 0.36], [k * (w / 2 + 28), -h * 0.14], [k * (w / 2 + 50), -h * 0.64], [k * (w / 2 - 20), -h * 0.64]])}
          color={dark}
          shade={0.15}
          z={-0.01}
        />
      ))}
      <Part shape={roundRect(w, h, 4)} color={color} shade={0.18} />
      <Line pts={[[-w / 2 + 14, h / 2 - 10], [w / 2 - 14, h / 2 - 10]]} width={3.5} color="#f2c35a" z={0.001} />
      <Line pts={[[-w / 2 + 14, -h / 2 + 10], [w / 2 - 14, -h / 2 + 10]]} width={3.5} color="#f2c35a" z={0.001} />
    </X>
  );
};

// ───────────────────────── Zero fighter ─────────────────────────

const ZERO_TOP: P[] = [[-334, 12], [-300, 20], [-220, 30], [-100, 44], [-30, 52], [60, 55], [150, 57], [205, 58]];
const ZERO_BOTTOM: P[] = [[205, -56], [100, -58], [0, -54], [-120, -36], [-240, -14], [-334, 2]];

/**
 * Mitsubishi A6M Zero, side view facing +x. Origin = centre of the fuselage.
 * `spin` 0..1 blurs the 3-blade propeller; `bomb` hangs a 250 kg bomb;
 * `gear` shows the landing gear; `pilot` is drawn inside the canopy (a
 * Character at y≈-78, s≈0.38 puts the head in the glass); `trail` 0..1 adds a
 * smoke trail; `fire` 0..1 sets the engine on fire.
 */
export const ZeroFighter: React.FC<
  XProps & { spin?: number; bomb?: boolean; gear?: boolean; canopy?: boolean; pilot?: React.ReactNode; trail?: number; fire?: number; seed?: number }
> = ({ spin = 0, bomb = false, gear = true, canopy = true, pilot, trail = 0, fire = 0, seed = 1, ...xf }) => {
  const frame = useCurrentFrame();
  const a = frame * (0.25 + spin * 1.6);
  return (
    <X {...xf}>
      {trail > 0
        ? Array.from({ length: 9 }, (_, i) => {
            const k = ((frame * 0.08 + i / 9) % 1);
            const r = (22 + k * 70) * trail;
            return (
              <Part
                key={`t${i}`}
                shape={circle(r)}
                color={i % 2 ? "#4a4850" : "#3a383e"}
                flat
                outline={4}
                opacity={0.85 * (1 - k)}
                x={-340 - k * 900}
                y={10 + noise1(k * 4 + i, seed) * 40}
                z={-0.2 + i * 0.001}
              />
            );
          })
        : null}
      {/* tailplane (far side) + fin */}
      <Part shape={blob([[-230, 12], [-250, 18], [-322, 16], [-336, 9], [-322, 3], [-250, 4]], 6)} color={shadeHex(IJN_GREEN, 0.12)} shade={0.2} z={-0.02} />
      <Part shape={blob([[-246, 26], [-266, 88], [-288, 122], [-314, 122], [-332, 98], [-338, 14]], 8)} color={IJN_GREEN} shade={0.22} z={-0.01}>
        <Line pts={[[-300, 120], [-308, 16]]} width={3} color="#2b2a28" z={0.001} />
      </Part>
      {/* fuselage: grey belly, green top */}
      <Part shape={blob([...ZERO_TOP, ...ZERO_BOTTOM], 10)} color={IJN_BELLY} shade={0.22}>
        <Part
          shape={blob([...ZERO_TOP, [205, -14], [100, -18], [0, -16], [-120, -8], [-240, 0], [-334, 6]], 10)}
          color={IJN_GREEN}
          flat
          outline={0}
          z={0.001}
        />
        {[-200, -40, 140].map((x) => (
          <Line key={x} pts={[[x, x < -100 ? -22 : -52], [x + 2, x < -100 ? 32 : 54]]} width={2.5} color="#2b2a28" z={0.002} />
        ))}
        {Array.from({ length: 16 }, (_, i) => (
          <Part key={`r${i}`} shape={circle(2.4)} color="#3a3a32" flat outline={0} x={-200 + i * 22} y={-28 + i * 0.4} z={0.002} />
        ))}
      </Part>
      <X x={-150} y={10} z={0.03}>
        <Part shape={circle(31)} color="#f4f1ea" flat outline={3.5} />
        <Part shape={circle(24)} color="#c8262f" flat outline={0} z={0.001} />
      </X>
      {/* cowling, exhausts, spinner, propeller */}
      <Part shape={blob([[205, 58], [262, 54], [292, 40], [303, 10], [303, -14], [292, -38], [262, -50], [205, -56]], 8)} color={COWL} shade={0.22} z={0.03}>
        <Line pts={[[242, 54], [242, -52]]} width={2.5} color="#55555e" z={0.001} />
        {[-26, -8, 10].map((y) => (
          <Part key={y} shape={roundRect(24, 9, 3)} color="#6a5a4e" flat outline={2.5} x={214} y={y} z={0.002} />
        ))}
      </Part>
      <Part shape={roundRect(12, 84, 6)} color="#4a4a54" shade={0.2} x={300} y={-2} z={0.035} />
      <Part shape={blob([[302, 22], [326, 13], [340, 0], [326, -13], [302, -22]], 8)} color="#8a8270" shade={0.25} z={0.05} />
      {spin > 0.2 ? (
        <Part shape={ellipse(13, 152)} color="#cfccc2" flat outline={0} opacity={0.3 * spin} x={318} z={0.045} />
      ) : null}
      {[0, 1, 2].map((k) => {
        const len = 148 * Math.cos(a + (k * Math.PI * 2) / 3);
        if (Math.abs(len) < 6) return null;
        return (
          <X key={k} x={318} z={0.046}>
            <Part shape={roundRect(15, Math.abs(len), 7)} color="#3a3834" flat outline={3} y={len / 2} opacity={spin > 0.2 ? 0.35 : 1} />
            <Part shape={roundRect(15, Math.min(18, Math.abs(len) * 0.2), 4)} color="#e9b23a" flat outline={0} y={len - Math.sign(len) * 10} opacity={spin > 0.2 ? 0.35 : 1} z={0.001} />
          </X>
        );
      })}
      {/* wing (edge-on) with the yellow ID leading edge */}
      <Part shape={blob([[182, -38], [160, -27], [40, -26], [-64, -40], [40, -54], [160, -54]], 8)} color={IJN_GREEN} shade={0.2} z={0.06}>
        <Line pts={[[170, -30], [182, -40]]} width={7} color="#e9b23a" z={0.001} />
        <Line pts={[[-50, -44], [150, -50]]} width={3} color={IJN_BELLY} z={0.001} />
      </Part>
      {/* antenna mast + wire */}
      <Line pts={[[-56, 50], [-74, 118]]} width={6} color="#3a3834" z={-0.004} />
      <Line pts={[[-74, 116], [-300, 118]]} width={2} color="#3a3834" z={-0.004} />
      {canopy ? (
        <X x={55} y={52} z={-0.004}>
          <Part shape={roundRect(150, 50, 10)} color="#2a2a30" flat outline={0} x={20} y={20} z={-0.03} />
          <X y={-24} z={-0.02}>{pilot}</X>
          <Part shape={blob([[-82, 0], [-64, 40], [-12, 60], [60, 62], [110, 44], [130, 0]], 8)} color="#bfe6f6" flat outline={6} opacity={0.5} z={0.01} />
          {[-40, 10, 60, 102].map((x) => (
            <Line key={x} pts={[[x, 0], [x - 4, x > 90 ? 40 : 58]]} width={4.5} color="#3a3834" z={0.02} />
          ))}
          <Line pts={[[-64, 32], [118, 32]]} width={4} color="#3a3834" z={0.02} />
          <Part shape={ellipse(8, 18)} color="#ffffff" flat outline={0} opacity={0.6} x={86} y={36} rot={-0.6} z={0.03} />
        </X>
      ) : null}
      {gear ? (
        <X z={-0.03}>
          <Line pts={[[66, -48], [70, -150]]} width={10} color="#3a3834" />
          <Part shape={circle(26)} color="#26242a" shade={0.2} x={70} y={-160} z={-0.01} />
          <Line pts={[[96, -48], [100, -150]]} width={11} color="#3a3834" z={0.01} />
          <Part shape={roundRect(28, 80, 6)} color={shadeHex(IJN_BELLY, 0.1)} shade={0.2} x={112} y={-98} rot={0.04} z={0.012} />
          <Part shape={circle(29)} color="#26242a" shade={0.2} x={100} y={-162} z={0.02}>
            <Part shape={circle(11)} color="#8a8790" flat outline={3} z={0.001} />
          </Part>
          <Line pts={[[-296, 0], [-300, -20]]} width={6} color="#3a3834" />
          <Part shape={circle(11)} color="#26242a" flat outline={3.5} x={-300} y={-26} z={0.01} />
        </X>
      ) : null}
      {bomb ? (
        <X x={40} y={-96} z={0.07}>
          <Part shape={blob([[-88, 0], [-40, 25], [70, 23], [108, 0], [70, -23], [-40, -25]], 10)} color="#3e3d40" shade={0.25} />
          <Line pts={[[30, 23], [30, -23]]} width={3} color="#c9a24a" z={0.001} />
          <Part shape={poly([[-84, 0], [-128, 32], [-112, 0], [-128, -32]])} color="#34333a" shade={0.2} z={-0.001} />
          <Line pts={[[0, 24], [0, 44]]} width={6} color="#2a2a30" z={0.001} />
        </X>
      ) : null}
      {fire > 0 ? (
        <X x={250} y={40} z={0.1}>
          <Flame size={0.9 * fire} seed={seed + 3} />
          <Glow rx={160 * fire} color="#ffb04a" alpha={0.5} additive />
        </X>
      ) : null}
    </X>
  );
};

/** Zero seen from above, nose toward +x. Origin = fuselage centre. */
export const ZeroTop: React.FC<XProps & { spin?: number; trail?: number; seed?: number }> = ({ spin = 1, trail = 0, seed = 2, ...xf }) => {
  const frame = useCurrentFrame();
  const a = frame * (0.25 + spin * 1.6);
  return (
    <X {...xf}>
      {trail > 0
        ? Array.from({ length: 9 }, (_, i) => {
            const k = ((frame * 0.08 + i / 9) % 1);
            return (
              <Part key={i} shape={circle((20 + k * 64) * trail)} color={i % 2 ? "#4a4850" : "#3a383e"} flat outline={4} opacity={0.85 * (1 - k)} x={-340 - k * 900} y={noise1(k * 4 + i, seed) * 40} z={-0.2 + i * 0.001} />
            );
          })
        : null}
      {[-1, 1].map((k) => (
        <X key={k} sy={k}>
          <Part shape={roundPoly([[152, 36], [104, 326], [74, 350], [38, 336], [-12, 36]], [6, 20, 30, 20, 6])} color={IJN_GREEN} shade={0.2} />
          <Line pts={[[150, 44], [132, 150]]} width={8} color="#e9b23a" z={0.001} />
          <Part shape={circle(33)} color="#c8262f" flat outline={3} x={72} y={226} z={0.002} />
          <Line pts={[[30, 230], [-4, 236]]} width={3} color="#2b2a28" z={0.002} />
          <Part shape={roundPoly([[-238, 10], [-266, 120], [-296, 122], [-312, 10]], [4, 16, 16, 4])} color={IJN_GREEN} shade={0.2} z={-0.01} />
        </X>
      ))}
      <Part shape={blob([[300, 32], [312, 0], [300, -32], [200, -44], [60, -42], [-120, -28], [-300, -12], [-336, 0], [-300, 12], [-120, 28], [60, 42], [200, 44]], 10)} color={IJN_GREEN} shade={0.2} z={0.01}>
        <Part shape={blob([[300, 34], [314, 0], [300, -34], [232, -43], [232, 43]], 8)} color={COWL} flat outline={0} z={0.001} />
        <Line pts={[[-336, 0], [-246, 0]]} width={9} color={shadeHex(IJN_GREEN, 0.2)} z={0.001} />
        <Part shape={circle(22)} color="#f4f1ea" flat outline={3} x={-160} y={0} z={0.001}>
          <Part shape={circle(16)} color="#c8262f" flat outline={0} z={0.001} />
        </Part>
      </Part>
      <X x={70} z={0.02}>
        <Part shape={ellipse(78, 22)} color="#bfe6f6" flat outline={5} opacity={0.6} />
        {[-36, 0, 36].map((x) => (
          <Line key={x} pts={[[x, -20], [x, 20]]} width={4} color="#3a3834" z={0.001} />
        ))}
      </X>
      <Part shape={circle(15)} color="#8a8270" shade={0.25} x={322} z={0.03} />
      {spin > 0.2 ? <Part shape={ellipse(9, 168)} color="#cfccc2" flat outline={0} opacity={0.3 * spin} x={326} z={0.025} /> : null}
      {[0, 1, 2].map((k) => {
        const len = 160 * Math.cos(a + (k * Math.PI * 2) / 3);
        return Math.abs(len) < 6 ? null : (
          <Part key={k} shape={roundRect(12, Math.abs(len), 6)} color="#3a3834" flat outline={3} x={326} y={len / 2} opacity={spin > 0.2 ? 0.35 : 1} z={0.026} />
        );
      })}
    </X>
  );
};

// ───────────────────────── US warships ─────────────────────────

/** Naval gun house/turret, barrels toward +x (mirror with sx=-1). Origin = deck. */
const Turret: React.FC<XProps & { w: number; h: number; barrels?: number; len?: number }> = ({ w, h, barrels = 1, len = 1.6, ...xf }) => (
  <X {...xf}>
    {Array.from({ length: barrels }, (_, i) => (
      <Line key={i} pts={[[w * 0.2, h * (0.45 + i * 0.12)], [w * (0.2 + len), h * (0.52 + i * 0.12)]]} width={Math.max(5, h * 0.13)} color="#5a636e" z={-0.001} />
    ))}
    <Part shape={roundPoly([[-w / 2, 0], [w / 2, 0], [w * 0.42, h], [-w * 0.38, h]], [3, 3, h * 0.3, h * 0.3])} color={shadeHex(SHIP, 0.06)} shade={0.24} />
  </X>
);

/** Small anti-aircraft mount (twin barrels up). Origin = deck. */
const AAGun: React.FC<XProps & { s?: number }> = (xf) => (
  <X {...xf}>
    <Line pts={[[0, 14], [26, 46]]} width={5} color="#4a525c" />
    <Line pts={[[6, 14], [32, 44]]} width={5} color="#4a525c" />
    <Part shape={roundRect(30, 18, 6)} color={SHIP_DARK} shade={0.2} y={9} z={0.001} />
  </X>
);

/**
 * US Navy warship, side view facing +x. Origin = waterline centre.
 * kind "destroyer" | "battleship" | "carrier"; `number` is the hull number;
 * `hit` 0..1 adds fire + smoke amidships; `list` tilts it (sinking).
 */
export const Warship: React.FC<
  XProps & { kind?: "carrier" | "destroyer" | "battleship"; len?: number; flag?: boolean; hit?: number; number?: string | number; list?: number }
> = ({ kind = "carrier", len = 1400, flag = true, hit = 0, number, list = 0, ...xf }) => {
  const L = len / 2;
  const H = len * (kind === "carrier" ? 0.085 : kind === "battleship" ? 0.08 : 0.075);
  const num = number ?? (kind === "carrier" ? 17 : kind === "battleship" ? 57 : 445);
  const hullPts: P[] = [[-L * 0.98, 0], [-L * 1.02, H * 0.55], [-L, H * 0.95], [-L * 0.4, H * 0.9], [L * 0.45, H * 1.0], [L * 1.04, H * 1.38], [L * 0.94, 0]];
  const deckY = (x: number) => (x < L * 0.45 ? H * (0.9 + ((x + L) / (1.45 * L)) * 0.1) : H * (1.0 + ((x - L * 0.45) / (0.59 * L)) * 0.38));
  return (
    <X {...xf} rot={(xf.rot ?? 0) + list}>
      {/* hull */}
      <Part shape={roundPoly(hullPts, [6, 14, 6, 6, 6, 6, 6])} color={SHIP} shade={0.22}>
        <Part shape={poly([[-L * 0.98, 0], [-L * 1.01, H * 0.14], [L * 0.955, H * 0.14], [L * 0.94, 0]])} color="#8a3a32" flat outline={0} z={0.001} />
        <Line pts={[[-L * 0.99, H * 0.15], [L * 0.955, H * 0.15]]} width={3} z={0.002} />
        {Array.from({ length: Math.floor(len / 70) }, (_, i) => -L * 0.85 + i * 70).filter((x) => x < L * 0.7).map((x) => (
          <Part key={x} shape={circle(Math.max(3, H * 0.045))} color="#3a404a" flat outline={0} x={x} y={H * 0.62} z={0.002} />
        ))}
        <Line pts={[[-L, H * 0.92], [-L * 0.4, H * 0.87], [L * 0.45, H * 0.97], [L * 1.03, H * 1.34]]} smooth width={4} color={SHIP_DARK} z={0.002} />
      </Part>
      <HullNumber n={num} h={H * 0.42} x={L * 0.68} y={H * 0.36} z={0.01} />
      {kind === "carrier" ? (
        <>
          {/* gallery + flight deck */}
          <Part shape={roundRect(len * 1.92 * 0.5, H * 0.32, 4)} color={SHIP_DARK} shade={0.2} x={-L * 0.02} y={H * 1.12} z={0.005} />
          <Part shape={roundPoly([[-L * 1.04, H * 1.26], [L * 1.0, H * 1.26], [L * 1.06, H * 1.42], [-L * 1.0, H * 1.42]], 4)} color="#7a7064" shade={0.2} z={0.01}>
            {Array.from({ length: 12 }, (_, i) => (
              <Line key={i} pts={[[-L * 0.95 + i * L * 0.16, H * 1.34], [-L * 0.95 + i * L * 0.16 + L * 0.07, H * 1.34]]} width={3} color="#f4f1ea" z={0.001} />
            ))}
          </Part>
          {/* island */}
          <X x={L * 0.3} y={H * 1.42} z={0.02}>
            <Part shape={roundPoly([[-L * 0.1, 0], [L * 0.12, 0], [L * 0.1, H * 0.9], [-L * 0.08, H * 0.9]], 4)} color={SHIP} shade={0.22} />
            <Part shape={roundRect(L * 0.16, H * 0.45, 4)} color={shadeHex(SHIP, 0.05)} shade={0.22} y={H * 1.1} z={0.001} />
            {[-1, 0, 1].map((k) => (
              <Part key={k} shape={roundRect(L * 0.03, H * 0.1, 2)} color="#2a3038" flat outline={2} x={k * L * 0.045} y={H * 1.18} z={0.002} />
            ))}
            <Part shape={roundPoly([[-L * 0.12, H * 0.5], [-L * 0.03, H * 0.5], [-L * 0.04, H * 1.6], [-L * 0.13, H * 1.6]], 6)} color={SHIP_DARK} shade={0.22} z={-0.001}>
              <Part shape={roundRect(L * 0.1, H * 0.12, 3)} color="#2a2a30" flat outline={0} x={-L * 0.085} y={H * 1.55} z={0.001} />
            </Part>
            <Line pts={[[0, H * 1.3], [0, H * 2.6]]} width={6} color="#4a525c" z={0.003} />
            <Line pts={[[-L * 0.06, H * 2.2], [L * 0.06, H * 2.2]]} width={5} color="#4a525c" z={0.003} />
            <Part shape={roundRect(L * 0.06, H * 0.14, 3)} color="#4a525c" flat outline={2.5} y={H * 2.45} z={0.004} />
            {flag ? <USFlag x={0} y={H * 2.62} w={H * 0.9} z={0.005} /> : null}
          </X>
          {/* parked planes */}
          {[-0.9, -0.72, -0.54, -0.36, -0.15].map((k, i) => (
            <X key={i} x={k * L} y={H * 1.42} s={H / 260} z={0.03}>
              <Part shape={blob([[-110, 20], [-60, 34], [60, 40], [110, 30], [116, 6], [60, 6], [-60, 10], [-110, 8]], 6)} color="#3a4f6e" shade={0.2} y={20} />
              <Part shape={blob([[-110, 22], [-120, 70], [-96, 70], [-84, 30]], 4)} color="#3a4f6e" shade={0.2} y={20} z={-0.001} />
              <Part shape={circle(14)} color="#26242a" flat outline={3} x={40} y={10} z={-0.002} />
            </X>
          ))}
          {[0.75, -0.8].map((k, i) => (
            <AAGun key={i} x={k * L} y={H * 1.42} s={H / 120} z={0.04} />
          ))}
        </>
      ) : (
        <>
          {/* low deckhouse */}
          <Part shape={roundRect(len * 0.5, H * 0.38, 4)} color={shadeHex(SHIP, 0.03)} shade={0.22} x={-L * 0.12} y={H * 1.12} z={0.01} />
          {/* bridge / tower */}
          <X x={kind === "battleship" ? L * 0.12 : L * 0.2} y={H * 1.3} z={0.02}>
            <Part shape={roundPoly([[-L * 0.12, 0], [L * 0.12, 0], [L * 0.1, H * 0.8], [-L * 0.1, H * 0.8]], 4)} color={SHIP} shade={0.22} />
            <Part shape={roundPoly([[-L * 0.08, H * 0.8], [L * 0.09, H * 0.8], [L * 0.07, H * (kind === "battleship" ? 1.8 : 1.4)], [-L * 0.07, H * (kind === "battleship" ? 1.8 : 1.4)]], 4)} color={shadeHex(SHIP, 0.05)} shade={0.22} z={0.001} />
            {[-1, 0, 1, 2].map((k) => (
              <Part key={k} shape={roundRect(L * 0.025, H * 0.12, 2)} color="#2a3038" flat outline={2} x={k * L * 0.035 - L * 0.02} y={H * (kind === "battleship" ? 1.55 : 1.18)} z={0.002} />
            ))}
            <Part shape={roundRect(L * 0.07, H * 0.32, 4)} color={SHIP_DARK} shade={0.22} y={H * (kind === "battleship" ? 1.98 : 1.56)} z={0.003} />
            <Line pts={[[-L * 0.02, H * 1.6], [-L * 0.03, H * (kind === "battleship" ? 3.4 : 2.9)]]} width={6} color="#4a525c" z={-0.001} />
            <Line pts={[[-L * 0.07, H * (kind === "battleship" ? 3.0 : 2.5)], [L * 0.04, H * (kind === "battleship" ? 3.0 : 2.5)]]} width={5} color="#4a525c" z={-0.001} />
            {flag ? <USFlag x={-L * 0.03} y={H * (kind === "battleship" ? 3.42 : 2.92)} w={H * 0.8} z={0.004} /> : null}
          </X>
          {/* funnels */}
          {(kind === "battleship" ? [-L * 0.1] : [-L * 0.05, -L * 0.24]).map((x, i) => (
            <X key={i} x={x} y={H * 1.3} z={0.015}>
              <Part shape={roundPoly([[-L * 0.05, 0], [L * 0.05, 0], [L * 0.035, H * (kind === "battleship" ? 1.3 : 1.05)], [-L * 0.065, H * (kind === "battleship" ? 1.3 : 1.05)]], 6)} color={shadeHex(SHIP, 0.08)} shade={0.24} />
              <Part shape={roundRect(L * 0.1, H * 0.12, 3)} color="#2a2a30" flat outline={3} x={-L * 0.015} y={H * (kind === "battleship" ? 1.3 : 1.05)} z={0.001} />
            </X>
          ))}
          {/* main guns */}
          {(kind === "battleship"
            ? [[L * 0.62, 1, 3, 0.2], [L * 0.4, 1, 3, 0.55], [-L * 0.55, -1, 3, 0.2]]
            : [[L * 0.66, 1, 1, 0], [L * 0.46, 1, 1, 0.35], [-L * 0.55, -1, 1, 0.1], [-L * 0.75, -1, 1, 0]]
          ).map(([x, dir, n, up], i) => (
            <Turret key={i} x={x} y={deckY(x) + H * up} sx={dir} w={L * (kind === "battleship" ? 0.18 : 0.11)} h={H * (kind === "battleship" ? 0.6 : 0.5)} barrels={n} len={kind === "battleship" ? 1.3 : 1.2} z={0.03 + i * 0.001} />
          ))}
          {[-0.36, 0.02, -0.66].map((k, i) => (
            <AAGun key={i} x={k * L} y={H * 1.3} s={H / 110} z={0.04} />
          ))}
        </>
      )}
      {hit > 0 ? (
        <X x={L * 0.05} y={H * 1.4} z={0.1}>
          <Glow rx={L * 0.6 * hit} color="#ffb04a" alpha={0.55} additive />
          <Flame size={(len / 700) * hit} seed={3} />
          <Flame x={-L * 0.25} size={(len / 1100) * hit} seed={8} />
          <Smoke y={60} w={L * 0.3} h={1600} alpha={0.65 * hit} color="#2e2c30" seed={5} />
        </X>
      ) : null}
    </X>
  );
};

/** Warship from above, bow toward +x, with a foaming wake. Origin = centre. */
export const ShipTop: React.FC<XProps & { kind?: "carrier" | "destroyer" | "battleship"; len?: number; wake?: number; hit?: number }> = ({
  kind = "destroyer",
  len = 600,
  wake = 1,
  hit = 0,
  ...xf
}) => {
  const L = len / 2;
  const W = len * (kind === "carrier" ? 0.13 : kind === "battleship" ? 0.12 : 0.09);
  return (
    <X {...xf}>
      {wake > 0 ? (
        <X z={-0.05}>
          <Line pts={[[L * 0.85, W * 0.7], [L * 0.1, W * 1.6], [-L - len * 0.9 * wake, W * 3.2 * wake]]} smooth width={Math.max(4, W * 0.18)} color="#e9f6f8" opacity={0.7} />
          <Line pts={[[L * 0.85, -W * 0.7], [L * 0.1, -W * 1.6], [-L - len * 0.9 * wake, -W * 3.2 * wake]]} smooth width={Math.max(4, W * 0.18)} color="#e9f6f8" opacity={0.7} />
          <Line pts={[[-L, 0], [-L - len * 0.7 * wake, 0]]} width={Math.max(6, W * 0.6)} color="#e9f6f8" opacity={0.45} />
        </X>
      ) : null}
      {kind === "carrier" ? (
        <>
          <Part shape={roundPoly([[L * 1.02, 0], [L * 0.8, W], [-L, W * 1.05], [-L, -W * 1.05], [L * 0.8, -W]], 8)} color={SHIP} shade={0.2} />
          <Part shape={roundRect(len * 0.98, W * 1.7, 6)} color="#7a7064" flat outline={5} x={-L * 0.02} z={0.001}>
            <Line pts={[[-L * 0.9, 0], [L * 0.9, 0]]} width={4} color="#f4f1ea" z={0.001} />
          </Part>
          <Part shape={roundRect(L * 0.22, W * 0.35, 4)} color={SHIP_DARK} shade={0.2} x={L * 0.2} y={-W * 0.95} z={0.002} />
        </>
      ) : (
        <>
          <Part shape={roundPoly([[L * 1.02, 0], [L * 0.55, W], [-L * 0.88, W], [-L, W * 0.55], [-L, -W * 0.55], [-L * 0.88, -W], [L * 0.55, -W]], [4, 20, 10, 10, 10, 10, 20])} color={SHIP} shade={0.2} />
          <Part shape={roundRect(L * 0.5, W * 1.1, 6)} color={shadeHex(SHIP, 0.06)} shade={0.2} x={-L * 0.08} z={0.001} />
          <Part shape={roundRect(L * 0.18, W * 0.9, 4)} color={shadeHex(SHIP, 0.1)} shade={0.2} x={L * 0.22} z={0.002} />
          {(kind === "battleship" ? [-L * 0.12] : [-L * 0.02, -L * 0.2]).map((x) => (
            <Part key={x} shape={ellipse(L * 0.05, W * 0.32)} color="#2a2a30" flat outline={3} x={x} z={0.003} />
          ))}
          {[L * 0.6, L * 0.42, -L * 0.55, -L * 0.74].slice(0, kind === "battleship" ? 3 : 4).map((x, i) => (
            <X key={i} x={x} z={0.004} rot={x > 0 ? 0 : Math.PI}>
              <Line pts={[[0, 0], [L * 0.16, 0]]} width={W * 0.16} color="#5a636e" />
              <Part shape={circle(W * (kind === "battleship" ? 0.42 : 0.3))} color={shadeHex(SHIP, 0.08)} shade={0.24} z={0.001} />
            </X>
          ))}
        </>
      )}
      {hit > 0 ? (
        <X z={0.1}>
          <Glow rx={L * 0.6 * hit} color="#ffb04a" alpha={0.55} additive />
          <Flame size={(len / 500) * hit} seed={4} />
          <Smoke y={30} w={L * 0.4} h={900} alpha={0.6 * hit} color="#2e2c30" seed={6} />
        </X>
      ) : null}
    </X>
  );
};

// ───────────────────────── anti-aircraft fire, splashes ─────────────────────────

/** Streams of anti-aircraft tracers fired from the origin toward `angle` (radians). */
export const Tracers: React.FC<XProps & { angle?: number; spread?: number; range?: number; n?: number; speed?: number; seed?: number; color?: string }> = ({
  angle = Math.PI / 3,
  spread = 0.35,
  range = 900,
  n = 6,
  speed = 40,
  seed = 3,
  color = "#ffc94a",
  ...xf
}) => {
  const frame = useCurrentFrame();
  const r = rng(seed);
  const rays = Array.from({ length: n }, () => [angle + (r() - 0.5) * spread, r() * range]);
  return (
    <X {...xf}>
      {rays.map(([a, ph], i) => {
        const d = (frame * speed + ph) % range;
        const cx = Math.cos(a);
        const cy = Math.sin(a);
        return (
          <Line
            key={i}
            pts={[[cx * d, cy * d], [cx * (d + 46), cy * (d + 46)]]}
            width={7}
            color={color}
            opacity={1 - d / range}
            z={i * 0.001}
          />
        );
      })}
    </X>
  );
};

/** One flak burst: orange flash, then a dark puff that drifts and fades. t 0..1. */
export const FlakBurst: React.FC<XProps & { t: number; size?: number; seed?: number }> = ({ t, size = 1, seed = 1, ...xf }) => {
  if (t <= 0 || t >= 1) return null;
  const k = Math.min(1, t * 4);
  const fade = 1 - Math.max(0, (t - 0.55) / 0.45);
  const r = rng(seed);
  const blobs = Array.from({ length: 4 }, () => [(r() - 0.5) * 50, (r() - 0.5) * 40, 26 + r() * 18]);
  return (
    <X {...xf} s={(xf.s ?? 1) * size * (0.6 + k * 0.5)}>
      {t < 0.18 ? (
        <Part
          shape={poly(Array.from({ length: 16 }, (_, i) => {
            const a = (i / 16) * Math.PI * 2;
            const rr = i % 2 ? 26 : 60;
            return [Math.cos(a) * rr, Math.sin(a) * rr] as P;
          }))}
          color="#ffb04a"
          flat
          outline={4}
          z={0.01}
        />
      ) : null}
      {blobs.map(([x, y, rr], i) => (
        <X key={i} x={x} y={y + t * 20} z={i * 0.001}>
          <Part shape={circle(rr)} color="#2e2c30" flat outline={4} opacity={fade} />
          <Part shape={circle(rr * 0.4)} color="#55535a" flat outline={0} opacity={fade} x={-rr * 0.25} y={rr * 0.2} z={0.0005} />
        </X>
      ))}
    </X>
  );
};

/** Repeating flak bursts scattered over an area (w × h). */
export const FlakField: React.FC<XProps & { w?: number; h?: number; n?: number; period?: number; seed?: number }> = ({ w = 1600, h = 600, n = 8, period = 40, seed = 5, ...xf }) => {
  const frame = useCurrentFrame();
  const r = rng(seed);
  const items = Array.from({ length: n }, () => [(r() - 0.5) * w, (r() - 0.5) * h, r() * period]);
  return (
    <X {...xf}>
      {items.map(([x, y, ph], i) => (
        <FlakBurst key={i} x={x} y={y} t={((frame + ph) % period) / period} size={0.9} seed={seed + i} z={i * 0.01} />
      ))}
    </X>
  );
};

/** Tall water column from a near miss (or a plane hitting the sea). t 0..1. Origin = water surface. */
export const SplashColumn: React.FC<XProps & { t: number; h?: number; seed?: number }> = ({ t, h = 700, seed = 3, ...xf }) => {
  if (t <= 0 || t >= 1) return null;
  const rise = Math.sin(Math.min(1, t * 1.4) * Math.PI * 0.5);
  const fall = Math.max(0, (t - 0.6) / 0.4);
  const r = rng(seed);
  const hh = h * rise * (1 - fall * 0.5);
  return (
    <X {...xf}>
      <Part shape={blob([[-60, 0], [-40, hh * 0.5], [-26, hh], [26, hh], [40, hh * 0.5], [60, 0]], 10)} color="#f4fbfd" shade={0.12} opacity={1 - fall} />
      {Array.from({ length: 9 }, (_, i) => {
        const a = Math.PI / 2 + (i - 4) * 0.2 + (r() - 0.5) * 0.08;
        const l = hh * (0.5 + r() * 0.5);
        return (
          <Line key={i} pts={[[0, 20], [Math.cos(a) * l, 20 + Math.sin(a) * l]]} width={14} color="#f4fbfd" opacity={1 - fall} z={0.001 + i * 0.0001} />
        );
      })}
      <Part shape={ellipse(120 * rise, 18)} color="#e8f6fa" flat outline={3} opacity={1 - fall} z={0.01} />
    </X>
  );
};

// ───────────────────────── map ─────────────────────────

type Geo = { japan: P[][]; land: P[][]; city: Record<string, P> };
const G = geo as unknown as Geo;
const LAT0 = 33;
const C0 = Math.cos((LAT0 * Math.PI) / 180);

/** Longitude/latitude → JapanMap pixels for a map drawn at `ppd` pixels per degree of latitude. */
export const geoXY = (lon: number, lat: number, ppd = 48): P => [(lon - 133) * C0 * ppd, (lat - LAT0) * ppd];
export const cityXY = (name: keyof typeof G.city | string, ppd = 48): P => {
  const c = G.city[name] ?? [0, 0];
  return [c[0] * ppd, c[1] * ppd];
};

/** Point on the Kushira → Okinawa flight route at k 0..1 (map pixels) and its heading. */
export const japanRouteAt = (k: number, ppd = 48): [number, number, number] => {
  const a = cityXY("kushira", ppd);
  const b = cityXY("okinawa", ppd);
  const bulge = 1.2 * ppd;
  const p = (q: number): P => [a[0] + (b[0] - a[0]) * q + Math.sin(q * Math.PI) * bulge * 0.4, a[1] + (b[1] - a[1]) * q + Math.sin(q * Math.PI) * bulge * 0.2];
  const [x, y] = p(k);
  const [x2, y2] = p(Math.min(1, k + 0.01));
  return [x, y, Math.atan2(y2 - y, x2 - x)];
};

/**
 * Map of Japan and its neighbours with real coastlines, in the reference map
 * style (beige land, teal sea with wave marks, dark outlines). Origin = 133°E
 * 33°N; `ppd` = pixels per degree. `route` 0..1 draws the dashed Kushira →
 * Okinawa flight path; `dots` marks cities.
 */
export const JapanMap: React.FC<
  XProps & {
    ppd?: number; route?: number; land?: string; japan?: string; sea?: string; waves?: boolean; dots?: string[]; routeColor?: string;
    /** Sea rectangle size in px (default 60° × 40°). */ w?: number; h?: number;
    /** Draw only Japan (compact, for small framed maps). */ only?: "japan";
  }
> = ({ ppd = 48, route = 0, land = "#ddcca2", japan = "#efd39b", sea = "#93c3c4", waves = true, dots = [], routeColor = "#c8262f", w, h, only, ...xf }) => {
  const r = rng(7);
  const sc = (ring: P[]) => ring.map(([x, y]) => [x * ppd, y * ppd] as P);
  const routePts = Array.from({ length: 41 }, (_, i) => i / 40)
    .filter((k) => k <= route)
    .map((k) => japanRouteAt(k, ppd).slice(0, 2) as P);
  return (
    <X {...xf}>
      <Part shape={roundRect(w ?? 60 * ppd, h ?? 40 * ppd, 0)} color={sea} flat outline={0} z={-0.1} />
      {waves
        ? Array.from({ length: 70 }, () => [((r() - 0.5) * (w ?? 34 * ppd)) / ppd, ((r() - 0.5) * (h ?? 30 * ppd)) / ppd]).map(([gx, gy], i) => (
            <Line
              key={`w${i}`}
              pts={[[gx * ppd - 26, gy * ppd], [gx * ppd - 13, gy * ppd + 7], [gx * ppd, gy * ppd], [gx * ppd + 13, gy * ppd - 7], [gx * ppd + 26, gy * ppd]]}
              smooth
              width={3.5}
              color={shadeHex(sea, 0.14)}
              z={-0.09}
            />
          ))
        : null}
      {(only ? [] : G.land).map((ring, i) => (
        <Part key={`l${i}`} shape={poly(sc(ring))} color={land} flat outline={5} z={i * 0.0001} />
      ))}
      {G.japan.map((ring, i) => (
        <Part key={`j${i}`} shape={poly(sc(ring))} color={japan} flat outline={5} z={0.01 + i * 0.0001} />
      ))}
      {routePts.length > 1
        ? routePts.slice(0, -1).map((p, i) =>
            i % 2 === 0 ? <Line key={`r${i}`} pts={[p, routePts[i + 1]]} width={9} color={routeColor} z={0.05} /> : null,
          )
        : null}
      {dots.map((d) => {
        const [x, y] = cityXY(d, ppd);
        return <Part key={d} shape={circle(7)} color="#c8262f" flat outline={3.5} x={x} y={y} z={0.06} />;
      })}
    </X>
  );
};
