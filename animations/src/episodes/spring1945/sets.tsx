import React from "react";
import { X, Part, Line, Glow, Gradient, roundRect, roundPoly, poly, blob, circle } from "../../kit";
import { Face, Hat } from "../../kit/character";
import {
  Sky, Cloud, Mountains, Ground, Sea, Stars, Moon, Hangar, Windsock, SakuraTree, Petals, ZeroFighter, PlankWall, Floorboards, ShojiWall, Tatami,
  JapanMap, HangingLamp, Desk, Flag, Flame, Smoke,
} from "../../kit/env";

// Locations for "Spring 1945". Everything takes `children` drawn between the
// background and any foreground layer.

export type Mood = "dawn" | "day" | "dusk" | "night";

const SKY: Record<Mood, { top: string; mid?: string; bottom: string; hills: string; grass: string; far: string }> = {
  dawn: { top: "#7fa6d6", mid: "#e9c3b4", bottom: "#fbe1c4", hills: "#9aa6b6", grass: "#8fae62", far: "#a7c07a" },
  day: { top: "#5aa8de", bottom: "#d8eef6", hills: "#a6b8cc", grass: "#8db35e", far: "#a3c473" },
  dusk: { top: "#3f4a86", mid: "#c9708a", bottom: "#f3b07a", hills: "#6c5c7c", grass: "#6a7a4a", far: "#7a8a56" },
  night: { top: "#0b1030", bottom: "#2b3a63", hills: "#2a3150", grass: "#2e3a26", far: "#34422c" },
};

/** Sky + distant hills (Mount Kaimon's cone on the left). */
export const Backdrop: React.FC<{ mood?: Mood; horizon?: number; kaimon?: boolean; clouds?: boolean }> = ({ mood = "day", horizon = -120, kaimon = true, clouds = true }) => {
  const c = SKY[mood];
  return (
    <X z={-40}>
      <Sky w={5000} h={3000} y={horizon + 1400} top={c.top} mid={c.mid} bottom={c.bottom} />
      {mood === "night" ? (
        <>
          <Stars w={4200} h={1400} y={horizon + 700} count={90} />
          <Moon x={620} y={horizon + 520} r={50} />
        </>
      ) : null}
      {clouds && mood !== "night" ? (
        <>
          <Cloud x={-620} y={horizon + 520} w={420} seed={3} color={mood === "dusk" ? "#e8a8a8" : undefined} />
          <Cloud x={560} y={horizon + 600} w={360} seed={7} color={mood === "dusk" ? "#e8a8a8" : undefined} />
        </>
      ) : null}
      <Mountains
        w={5000}
        y={horizon}
        color={c.hills}
        peaks={kaimon ? [[-1500, 120], [-700, 330], [-300, 110], [300, 150], [900, 110], [1500, 140]] : [[-1500, 120], [-600, 160], [0, 110], [600, 150], [1300, 120]]}
      />
    </X>
  );
};

/** Grass airfield in southern Kyushu: runway strip, hangar, cherry trees, windsock. */
export const Airfield: React.FC<{ mood?: Mood; horizon?: number; planes?: boolean; trees?: boolean; petals?: boolean; children?: React.ReactNode }> = ({
  mood = "dawn",
  horizon = -120,
  planes = true,
  trees = true,
  petals = true,
  children,
}) => {
  const c = SKY[mood];
  return (
    <>
      <Backdrop mood={mood} horizon={horizon} />
      <X y={horizon} z={-30}>
        <Ground w={5000} h={1800} color={c.grass} far={c.far} pebbles={6} tufts={30} tuftColor="#5f7a3a" seed={5} />
      </X>
      <Part shape={roundRect(5000, 120, 0)} color={mood === "night" ? "#4a4436" : "#b9a27a"} flat outline={0} y={horizon - 110} z={-29} />
      <Hangar x={-760} y={horizon + 10} w={420} h={220} z={-27} />
      <Windsock x={420} y={horizon + 4} h={200} z={-26} />
      {planes
        ? [-260, 120, 760].map((x, i) => <ZeroFighter key={x} x={x} y={horizon + 90 - i * 4} s={0.32} z={-25 + i * 0.01} />)
        : null}
      {trees ? (
        <>
          <SakuraTree x={-1080} y={horizon - 40} h={420} seed={2} z={-24} />
          <SakuraTree x={1060} y={horizon - 60} h={460} seed={5} z={-24} />
        </>
      ) : null}
      {children}
      {petals && mood !== "night" ? <Petals w={2400} h={1400} n={26} z={40} /> : null}
    </>
  );
};

/** Open sea off Okinawa. */
export const OkinawaSea: React.FC<{ mood?: Mood; horizon?: number; children?: React.ReactNode }> = ({ mood = "day", horizon = 40, children }) => {
  const c = SKY[mood];
  return (
    <>
      <X z={-40}>
        <Sky w={5000} h={3000} y={horizon + 1400} top={c.top} mid={c.mid} bottom={c.bottom} />
        <Cloud x={-560} y={horizon + 380} w={460} seed={4} />
        <Cloud x={620} y={horizon + 470} w={380} seed={9} />
      </X>
      <Sea w={5000} h={2400} y={horizon} color={mood === "dusk" ? "#4a6a9a" : "#3f86b8"} z={-30} />
      {children}
    </>
  );
};

/** Wooden barracks room (navy base): plank walls, floorboards, a window glow. */
export const Barracks: React.FC<{ floorY?: number; light?: string; children?: React.ReactNode }> = ({ floorY = -420, light = "#ffd99a", children }) => (
  <>
    <PlankWall w={4000} h={2400} y={floorY + 1200} color="#9a7048" z={-40} />
    <X x={420} y={floorY + 620} z={-39}>
      <Part shape={roundRect(360, 300, 6)} color="#cfe6ee" flat outline={8} />
      <Line pts={[[0, -150], [0, 150]]} width={8} z={0.001} />
      <Line pts={[[-180, 0], [180, 0]]} width={8} z={0.001} />
    </X>
    <Glow x={420} y={floorY + 300} rx={900} ry={700} color={light} alpha={0.25} additive z={-38} />
    <Floorboards w={4000} h={1400} y={floorY} color="#7a5232" z={-36} />
    {children}
  </>
);

/** Imperial HQ war room: dark panelling, framed map, hanging lamp, a long table in front of `children`. */
export const WarRoom: React.FC<{ floorY?: number; table?: boolean; lampX?: number; swing?: number; children?: React.ReactNode }> = ({
  floorY = -460,
  table = true,
  lampX = 0,
  swing = 0,
  children,
}) => (
  <>
    <PlankWall w={4000} h={2400} y={floorY + 1200} color="#5e4a3a" z={-40} />
    <X x={-80} y={floorY + 780} z={-38}>
      <Part shape={roundRect(700, 440, 8)} color="#3a2a20" shade={0.15} />
      <X x={-30} y={-40} z={0.01}>
        <JapanMap ppd={15} w={660} h={400} only="japan" waves={false} x={60} y={60} />
      </X>
    </X>
    <Flag x={620} y={floorY} pole={820} z={-37} />
    <Floorboards w={4000} h={1400} y={floorY} color="#4e3424" z={-36} />
    <Glow y={floorY + 300} rx={900} ry={600} color="#ffcf7a" alpha={0.16} additive z={-35} />
    {children}
    {table ? <Desk w={1500} h={250} y={floorY - 40} color="#6e4a2c" z={10} /> : null}
    <HangingLamp x={lampX} y={560} cord={200} color="#2f3a2f" cone={1000} coneW={900} rot={swing} z={12} />
  </>
);

/** Traditional Japanese room: shoji wall, tatami floor. */
export const TatamiRoom: React.FC<{ floorY?: number; light?: number; children?: React.ReactNode }> = ({ floorY = -380, light = 0.3, children }) => (
  <>
    <Part shape={roundRect(5000, 3000, 0)} color="#5a4636" flat outline={0} z={-41} />
    <ShojiWall w={2600} h={760} y={floorY} paper="#f6efd9" z={-40} />
    <Glow y={floorY + 380} rx={1100} ry={500} color="#fff3d6" alpha={light} additive z={-39} />
    <Tatami w={4000} h={800} y={floorY} z={-36} />
    {children}
  </>
);

/** Dark, warm studio background for objects (gradient + glow). */
export const ObjectBack: React.FC<{ color?: string; glow?: string; children?: React.ReactNode }> = ({ color = "#2a2430", glow = "#ffcf7a", children }) => (
  <>
    <Gradient w={4000} h={3000} stops={[[0, color], [1, "#120e14"]]} z={-40} />
    <Glow rx={700} ry={500} color={glow} alpha={0.18} additive z={-39} />
    {children}
  </>
);

const COCKPIT_GREEN = "#566b3e";

/**
 * Inside the cockpit of a Zero: the world outside (sky, sea, ships) rolls with
 * `tilt` and drops away with `dive` 0..1; the pilot (children) sits behind the
 * green windscreen frame and the cockpit sill. Put a Character with its head
 * at about (−40, 150), s≈2.2 (feet y ≈ −528).
 */
export const CockpitView: React.FC<{ tilt?: number; dive?: number; mood?: Mood; outside?: React.ReactNode; children?: React.ReactNode }> = ({
  tilt = 0,
  dive = 0,
  mood = "day",
  outside,
  children,
}) => {
  const c = SKY[mood];
  const horizon = 60 + dive * 900;
  return (
    <>
      <X rot={tilt} y={0} z={-40}>
        <Sky w={6000} h={4000} y={horizon + 2000} top={c.top} mid={c.mid} bottom={c.bottom} />
        <Cloud x={-700} y={horizon + 420} w={460} seed={4} />
        <Cloud x={680} y={horizon + 300} w={380} seed={9} />
        <Sea w={6000} h={4000} y={horizon} color={mood === "dusk" ? "#4a6a9a" : mood === "dawn" ? "#5a8ab8" : "#3f86b8"} z={0.5} />
        <X y={horizon} z={1}>
          {outside}
        </X>
      </X>
      {children}
      {/* windscreen glass + frame */}
      <Part shape={roundRect(1240, 820, 30)} color="#d6f1fb" flat outline={0} opacity={0.1} y={150} z={20} />
      <Part shape={poly([[-420, 560], [-300, 560], [-520, -200], [-640, -200]])} color="#ffffff" flat outline={0} opacity={0.12} z={20.1} />
      <Part shape={poly([[240, 560], [300, 560], [80, -200], [20, -200]])} color="#ffffff" flat outline={0} opacity={0.1} z={20.1} />
      <Part shape={poly([[-720, -260], [-650, -260], [-560, 600], [-630, 600]])} color={COCKPIT_GREEN} shade={0.22} z={21} />
      <Part shape={poly([[650, -260], [720, -260], [630, 600], [560, 600]])} color={COCKPIT_GREEN} shade={0.22} z={21} />
      <Part shape={blob([[-640, 560], [-300, 590], [300, 590], [640, 560], [640, 640], [-640, 640]], 6)} color={COCKPIT_GREEN} shade={0.22} z={21.1} />
      {/* cockpit sill */}
      <Part shape={blob([[-1100, -620], [1100, -620], [1100, -280], [700, -250], [0, -232], [-700, -250], [-1100, -280]], 8)} color={COCKPIT_GREEN} shade={0.24} z={22}>
        <Line pts={[[-1000, -276], [-700, -262], [0, -246], [700, -262], [1000, -276]]} smooth width={5} color="#3e4c2c" z={0.001} />
        {Array.from({ length: 22 }, (_, i) => (
          <Part key={i} shape={circle(5)} color="#6f8256" flat outline={2.5} x={-1000 + i * 95} y={-300 + Math.abs(i - 10.5) * 2} z={0.002} />
        ))}
      </Part>
    </>
  );
};

/** A small portrait head (for framed photos): skin, face and headwear. */
export const PortraitHead: React.FC<{ hat?: Parameters<typeof Hat>[0]["kind"]; hatColor?: string; hatAccent?: string; smile?: boolean; s?: number; x?: number; y?: number; z?: number }> = ({
  hat = "aviator",
  hatColor = "#7a4e2c",
  hatAccent,
  smile = true,
  s = 1,
  x = 0,
  y = 0,
  z = 0,
}) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={roundPoly4(150, 110)} color="#a07a4e" shade={0.2} y={-140} z={-0.01} />
    <Part shape={roundRect(110, 34, 16)} color="#f4f1ea" shade={0.2} y={-96} z={-0.005} />
    <Part shape={circle(100)} color="#f6f5f8" shade={0.24} />
    <X z={0.01}>
      <Face expression={{ eyes: "open", mouth: smile ? "smile" : "flat" }} look={0} blink={0} talk={0} />
    </X>
    <X z={0.12}>
      <Hat kind={hat} color={hatColor} accent={hatAccent} />
    </X>
  </X>
);
const roundPoly4 = (w: number, h: number) => roundRect(w, h, 40);

/** Framed memorial portrait with black mourning ribbons. Origin = frame centre. */
export const MemorialPortrait: React.FC<{ x?: number; y?: number; s?: number; z?: number; seed?: number }> = ({ x = 0, y = 0, s = 1, z = 0, seed = 0 }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={roundRect(230, 290, 8)} color="#3a2a20" shade={0.2} />
    <Part shape={roundRect(190, 250, 4)} color={["#e9e0c8", "#e4dcc6", "#ebe3cc"][seed % 3]} flat outline={4} z={0.001} />
    <PortraitHead s={0.62} y={-6} z={0.01} hatColor={["#7a4e2c", "#6e4628", "#83552f"][seed % 3]} hatAccent={seed % 2 ? "#c8262f" : undefined} />
    <Part shape={roundRect(194, 70, 0)} color="#3a2a20" flat outline={0} y={-112} z={0.03} />
    {[-1, 1].map((k) => (
      <Part key={k} shape={poly([[k * 115, 145], [k * 60, 145], [k * 115, 90]])} color="#1a1618" flat outline={3} z={0.04} />
    ))}
  </X>
);

/** Spray of white chrysanthemums in a vase (funeral flowers). Origin = vase bottom. */
const FuneralFlowers: React.FC<{ x: number; y: number; s?: number; z?: number }> = ({ x, y, s = 1, z = 0 }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={roundPoly([[-40, 0], [40, 0], [30, 110], [-30, 110]], 10)} color="#6a6e78" shade={0.22} y={0} />
    {[[-50, 220], [0, 250], [50, 220], [-24, 180], [28, 186]].map(([fx, fy], i) => (
      <X key={i} x={fx} y={fy} z={0.01 + i * 0.001}>
        <Line pts={[[0, 0], [-fx * 0.6, -fy + 110]]} width={6} color="#4a7a32" z={-0.01} />
        <Part shape={circle(34)} color="#f6f4ee" shade={0.2} />
        <Part shape={circle(14)} color="#efe6b0" flat outline={3} z={0.001} />
      </X>
    ))}
  </X>
);

/**
 * Family Buddhist altar (butsudan) with the pilot's memorial portrait,
 * white chrysanthemums, candles and incense. Origin = floor centre of the altar.
 */
export const MemorialAltar: React.FC<{ x?: number; y?: number; s?: number; z?: number; seed?: number }> = ({ x = 0, y = 0, s = 1, z = 0, seed = 0 }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={roundRect(760, 760, 10)} color="#4a2e20" shade={0.2} y={380} />
    <Part shape={roundRect(640, 560, 6)} color="#c9963f" shade={0.15} y={430} z={0.001} />
    <Part shape={roundRect(600, 520, 4)} color="#3a2418" flat outline={4} y={430} z={0.002} />
    <Glow y={430} rx={360} ry={300} color="#ffcf7a" alpha={0.25} additive z={0.003} />
    <MemorialPortrait y={470} s={0.95} z={0.01} seed={seed} />
    <Part shape={roundRect(820, 40, 8)} color="#5a3a26" shade={0.2} y={200} z={0.02} />
    <FuneralFlowers x={-250} y={220} s={0.7} z={0.03} />
    <FuneralFlowers x={250} y={220} s={0.7} z={0.03} />
    {[-140, 140].map((cx) => (
      <X key={cx} x={cx} y={220} z={0.04}>
        <Part shape={roundRect(22, 90, 6)} color="#f4f1ea" shade={0.15} y={45} />
        <Flame y={92} size={0.18} seed={cx > 0 ? 3 : 5} z={0.01} />
      </X>
    ))}
    <X y={220} z={0.05}>
      <Part shape={roundPoly([[-50, 0], [50, 0], [40, 46], [-40, 46]], 10)} color="#8a8790" shade={0.22} />
      {[-12, 0, 12].map((ix) => (
        <Line key={ix} pts={[[ix, 46], [ix * 1.2, 110]]} width={4} color="#7a3a2a" z={0.001} />
      ))}
      <Smoke y={110} w={60} h={500} alpha={0.35} seed={7} z={0.002} />
    </X>
  </X>
);

/**
 * Framed wall map (red-and-gold frame, as in the reference map shots). The
 * children are drawn in board coordinates; anything outside the board is
 * hidden behind the wall.
 */
export const MapBoard: React.FC<{ w?: number; h?: number; wall?: string; frame?: string; children?: React.ReactNode }> = ({
  w = 1500,
  h = 860,
  wall = "#7a3a2c",
  frame = "#8e2f26",
  children,
}) => {
  const W = 6000;
  return (
    <>
      <X z={-30}>{children}</X>
      <X z={-10}>
        <Part shape={roundRect(W, W, 0)} color={wall} flat outline={0} y={h / 2 + W / 2} />
        <Part shape={roundRect(W, W, 0)} color={wall} flat outline={0} y={-h / 2 - W / 2} />
        <Part shape={roundRect(W, h, 0)} color={wall} flat outline={0} x={-w / 2 - W / 2} />
        <Part shape={roundRect(W, h, 0)} color={wall} flat outline={0} x={w / 2 + W / 2} />
      </X>
      <X z={-9}>
        {[
          [0, h / 2 + 22, w + 88, 44],
          [0, -h / 2 - 22, w + 88, 44],
          [-w / 2 - 22, 0, 44, h],
          [w / 2 + 22, 0, 44, h],
        ].map(([x, y, bw, bh], i) => (
          <Part key={i} shape={roundRect(bw, bh, 6)} color={frame} shade={0.18} x={x} y={y} />
        ))}
        <Line pts={[[-w / 2 - 6, -h / 2 - 6], [w / 2 + 6, -h / 2 - 6], [w / 2 + 6, h / 2 + 6], [-w / 2 - 6, h / 2 + 6], [-w / 2 - 6, -h / 2 - 6]]} width={9} color="#d9a441" z={0.002} />
      </X>
    </>
  );
};
