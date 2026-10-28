import React from "react";
import { useCurrentFrame } from "remotion";
import { X, Part, Glow, Gradient, roundRect, palette, Spear } from "../../kit";
import { Character, poses } from "../../kit/character";
import { PERSIAN } from "./cast";
import {
  Sky,
  Cloud,
  Mountains,
  Ground,
  GreekTemple,
  RockHill,
  Barricade,
  City,
  OliveTree,
  Sea,
  Tent,
  Banner,
  Smoke,
  Stars,
  Moon,
} from "../../kit/env";

export type SkyMood = "day" | "warm" | "dusk" | "fire" | "night";

export const SKIES: Record<SkyMood, { top: string; bottom: string; mid?: string; mountains: string; ground: string }> = {
  day: { top: "#4f9fd9", bottom: "#d8eef6", mountains: "#a6b8cc", ground: "#d4bb8e" },
  warm: { top: "#6fa9d6", mid: "#e8d9b0", bottom: "#f6d79c", mountains: "#b4b2bb", ground: "#d6b986" },
  dusk: { top: "#3f4a86", mid: "#c9708a", bottom: "#f3b07a", mountains: "#7c6c8c", ground: "#b8936a" },
  fire: { top: "#2a1a2a", mid: "#7a2a22", bottom: "#e86a2a", mountains: "#5a2e34", ground: "#8a5a3a" },
  night: { top: "#0b1030", bottom: "#2b3a63", mountains: "#2a3150", ground: "#4a4a3c" },
};

export const Backdrop: React.FC<{ mood: SkyMood; horizon?: number; clouds?: boolean; mountains?: boolean }> = ({
  mood,
  horizon = 0,
  clouds = true,
  mountains = true,
}) => {
  const s = SKIES[mood];
  return (
    <X z={-30}>
      <Sky w={4000} h={3600} y={horizon + 1500} top={s.top} bottom={s.bottom} mid={s.mid} />
      {mood === "night" ? (
        <>
          <Stars w={2400} h={1400} y={horizon + 900} count={70} />
          <Moon x={-320} y={horizon + 900} />
        </>
      ) : null}
      {clouds && mood !== "night" && mood !== "fire" ? (
        <>
          <Cloud x={-360} y={horizon + 760} w={380} seed={2} />
          <Cloud x={300} y={horizon + 980} w={460} seed={6} />
          <Cloud x={620} y={horizon + 560} w={300} seed={9} />
        </>
      ) : null}
      {mood === "fire" ? <Glow y={horizon + 200} rx={1600} ry={700} color="#ff6a2a" alpha={0.35} additive /> : null}
      {mountains ? (
        <Mountains
          w={3600}
          y={horizon}
          color={s.mountains}
          peaks={[[-1200, 160], [-700, 260], [-380, 170], [0, 230], [420, 150], [800, 250], [1300, 180]]}
          z={1}
        />
      ) : null}
    </X>
  );
};

/** Top of the Acropolis: temple behind, the plank-and-door barricade at the gate. */
export const AcropolisTop: React.FC<{
  mood?: SkyMood;
  burn?: number;
  templeBurn?: number;
  wallY?: number;
  wallW?: number;
  wallH?: number;
  wall?: boolean;
  floorY?: number;
  children?: React.ReactNode;
}> = ({ mood = "warm", burn = 0, templeBurn = 0, wallY = -380, wallW = 1150, wallH = 320, wall = true, floorY = -330, children }) => {
  const s = SKIES[mood];
  return (
    <>
      <Backdrop mood={mood} horizon={floorY + 260} />
      <GreekTemple w={980} colH={430} cols={7} y={floorY + 20} burn={templeBurn} z={-20} />
      <Ground w={4000} h={1800} y={floorY + 20} color={s.ground} far={s.ground} pebbles={16} tufts={8} tuftColor="#8a8a52" z={-15} />
      {wall ? <Barricade w={wallW} h={wallH} y={wallY} burn={burn} z={-5} /> : null}
      {children}
    </>
  );
};

/** Wide view of Athens: the Acropolis rock over the city, optional Areopagus with Persians. */
export const AthensWide: React.FC<{
  mood?: SkyMood;
  burn?: number;
  persians?: boolean;
  rockX?: number;
  groundY?: number;
  wall?: boolean;
  children?: React.ReactNode;
}> = ({ mood = "warm", burn = 0, persians = false, rockX = 0, groundY = -420, wall = true, children }) => {
  const s = SKIES[mood];
  const frame = useCurrentFrame();
  return (
    <>
      <Backdrop mood={mood} horizon={groundY + 240} />
      <Ground w={5000} h={1600} y={groundY + 240} color={s.ground} far={s.ground} pebbles={0} tufts={0} z={-25} />
      <X x={rockX} z={-20}>
        <RockHill w={1100} h={560} y={groundY + 200} steep="right" seed={3} />
        <GreekTemple w={420} colH={170} cols={6} y={groundY + 750} burn={burn} s={1} z={1} />
        {wall ? <Barricade w={160} h={70} x={-330} y={groundY + 744} burn={burn > 0 ? 1 : 0} char={burn} s={1} z={2} /> : null}
        {burn > 0 ? <Smoke x={-120} y={groundY + 900} w={300} h={1600} alpha={0.6 * burn} seed={12} z={3} /> : null}
      </X>
      {persians ? (
        <X x={rockX + 1050} z={-19}>
          <RockHill w={900} h={360} y={groundY + 200} steep="left" seed={7} path={false} />
          {[-260, -60, 140].map((x, i) => (
            <Tent key={x} x={x} y={groundY + 548} w={170} h={130} s={1} z={1 + i * 0.01} />
          ))}
          {[-330, -160, 40, 230].map((x, i) => (
            <Banner key={x} x={x} y={groundY + 548} pole={220} seed={i} s={0.8} z={2 + i * 0.01} />
          ))}
          {Array.from({ length: 7 }, (_, i) => (
            <Character
              key={i}
              {...PERSIAN(i)}
              x={-330 + i * 95}
              y={groundY + 552}
              s={0.26}
              z={3 + i * 0.01}
              facing={-1}
              shadow={false}
              expression={{ eyes: "dot", mouth: "flat" }}
              pose={i % 3 === 0 ? poses.point(frame) : poses.idle(frame, i)}
              holdF={i % 3 ? <Spear rot={-0.15} /> : undefined}
            />
          ))}
        </X>
      ) : null}
      <City w={2600} y={groundY + 120} scale={0.6} rows={2} seed={4} z={-10} />
      <OliveTree x={-480} y={groundY - 40} h={280} z={-8} />
      <OliveTree x={560} y={groundY - 60} h={240} seed={5} z={-8} />
      {children}
    </>
  );
};

/** Gradient + floor for interiors (Delphi temple). */
export const TempleInterior: React.FC<{ floorY?: number; children?: React.ReactNode }> = ({ floorY = -520, children }) => (
  <>
    <Gradient w={3000} h={3000} y={floorY + 1500} stops={[[0, "#2a1e2e"], [0.6, "#4a3446"], [1, "#5a3e44"]]} z={-30} />
    {[-470, 470].map((x) => (
      <X key={x} x={x} z={-25}>
        <Part shape={roundRect(130, 2000, 6)} color="#8a7a8a" shade={0.3} y={floorY + 1000} />
        <Part shape={roundRect(180, 40, 6)} color="#8a7a8a" y={floorY + 40} z={0.01} />
      </X>
    ))}
    <Gradient w={3000} h={900} y={floorY - 450} stops={[[0, "#6a4a42"], [1, "#3a2620"]]} z={-20} />
    {children}
  </>
);

/** Harbor / open sea backdrop. */
export const SeaSet: React.FC<{ mood?: SkyMood; horizon?: number; children?: React.ReactNode }> = ({ mood = "day", horizon = 200, children }) => (
  <>
    <Backdrop mood={mood} horizon={horizon} />
    <Sea w={4000} h={2400} y={horizon} color={mood === "dusk" ? "#4a6a9a" : mood === "fire" ? "#5a3a4a" : palette.sea} z={-20} />
    {children}
  </>
);
