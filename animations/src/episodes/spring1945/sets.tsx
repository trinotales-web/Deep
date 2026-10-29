import React from "react";
import { X, Part, Line, Glow, Gradient, roundRect } from "../../kit";
import {
  Sky, Cloud, Mountains, Ground, Sea, Stars, Moon, Hangar, Windsock, SakuraTree, Petals, ZeroFighter, PlankWall, Floorboards, ShojiWall, Tatami,
  JapanMap, HangingLamp, Desk, Flag,
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
      <X s={0.26} y={0} z={0.01}>
        <JapanMap />
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
