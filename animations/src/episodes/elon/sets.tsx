import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { X, Part, Line, Glow, Gradient, Wash, roundRect, circle, ellipse, poly, blob } from "../../kit";
import {
  Sky, Cloud, Mountains, Ground, Stars, Moon, Sun, Sea, Hill, Bush, TropicalIsland, LaunchPad, Falcon1, SpaceBack, Planet, Room, Window, Desk, Monitor, HomeComputer,
  Bookshelf, Jacaranda, House, CampusBuilding, ConcreteStairs, Skyline, MissionControlSet, Rain,
} from "../../kit/env";

// Locations for the Elon Musk story. Each set takes `children`, drawn between
// its background and any foreground. Ground / water line at `horizon`.

export type Mood = "day" | "dusk" | "night" | "storm" | "dawn";

const MOODS: Record<Mood, { top: string; mid: string; bottom: string; sea: string; hills: string; wash?: [string, number] }> = {
  day: { top: "#4f9fd9", mid: "#8ec9ee", bottom: "#d9f0f8", sea: "#2f8fc4", hills: "#8fb0c8" },
  dawn: { top: "#6a7ab8", mid: "#e8a8a0", bottom: "#ffd8a0", sea: "#4a7aa8", hills: "#9a8aa8" },
  dusk: { top: "#3a3a7a", mid: "#c86a6a", bottom: "#f4b06a", sea: "#3a5a8a", hills: "#6a5a7a", wash: ["#3a1a40", 0.12] },
  night: { top: "#0c1128", mid: "#18203d", bottom: "#2a3462", sea: "#16284a", hills: "#2a3050", wash: ["#0a1030", 0.25] },
  storm: { top: "#3a4250", mid: "#5a6474", bottom: "#8a94a2", sea: "#3a5266", hills: "#4a5260", wash: ["#1a1e28", 0.2] },
};

/** Sky gradient with sun / moon / stars / clouds for a mood. */
export const SkyBack: React.FC<{ mood?: Mood; horizon?: number; clouds?: boolean; sunX?: number }> = ({ mood = "day", horizon = 0, clouds = true, sunX = 600 }) => {
  const m = MOODS[mood];
  return (
    <X z={-41}>
      <Sky w={6000} h={3600} y={horizon + 1700} top={m.top} mid={m.mid} bottom={m.bottom} />
      {mood === "night" ? <Stars w={5000} h={1800} y={horizon + 900} count={120} /> : null}
      {mood === "night" ? <Moon x={sunX} y={horizon + 700} r={56} /> : null}
      {mood === "dusk" || mood === "dawn" ? <Sun x={sunX} y={horizon + 120} r={120} glow={0.9} /> : null}
      {clouds && mood !== "night" ? (
        <>
          <Cloud x={-760} y={horizon + 620} w={460} seed={3} color={mood === "storm" ? "#7a8290" : undefined} />
          <Cloud x={700} y={horizon + 760} w={400} seed={8} color={mood === "storm" ? "#6a7280" : undefined} />
          {mood === "storm" ? <Cloud x={-60} y={horizon + 900} w={700} seed={5} color="#5a626e" /> : null}
        </>
      ) : null}
    </X>
  );
};

/** Open Pacific: sky and sea to the horizon. */
export const SeaSet: React.FC<{ mood?: Mood; horizon?: number; children?: React.ReactNode }> = ({ mood = "day", horizon = -100, children }) => (
  <>
    <SkyBack mood={mood} horizon={horizon} />
    <Sea w={4600} h={2200} y={horizon} color={MOODS[mood].sea} z={-30} />
    {children}
    {MOODS[mood].wash ? <Wash width={6000} height={4000} color={MOODS[mood].wash![0]} alpha={MOODS[mood].wash![1]} z={39} /> : null}
  </>
);

/** Omelek: the tiny island launch site with Falcon 1 on its pad. */
export const IslandSet: React.FC<{
  mood?: Mood;
  horizon?: number;
  islandW?: number;
  rocket?: boolean;
  rocketH?: number;
  rocketX?: number;
  rocketY?: number;
  thrust?: number;
  children?: React.ReactNode;
}> = ({ mood = "day", horizon = -100, islandW = 2400, rocket = true, rocketH = 620, rocketX = 120, rocketY = 0, thrust = 0, children }) => (
  <SeaSet mood={mood} horizon={horizon}>
    <X y={horizon - 120} z={-20}>
      <TropicalIsland w={islandW} palms={5} seed={7}>
        <LaunchPad x={rocketX} y={70} w={500} tower={rocket ? rocketH * 0.75 : 0} towerX={140} z={0.02} />
        {rocket ? <Falcon1 x={rocketX} y={70 + rocketY} h={rocketH} thrust={thrust} z={0.03} /> : null}
      </TropicalIsland>
    </X>
    {children}
  </SeaSet>
);

/** High sky with clouds below (rocket climbing). `alt` 0..1 darkens toward space. */
export const HighSky: React.FC<{ alt?: number; children?: React.ReactNode; mood?: Mood }> = ({ alt = 0, children, mood = "day" }) => {
  const m = MOODS[mood];
  return (
    <>
      <X z={-41}>
        <Sky w={6000} h={4000} top={interpolate(alt, [0, 1], [0, 1]) > 0.5 ? "#0c1128" : m.top} mid={alt > 0.5 ? "#2a3a7a" : m.mid} bottom={alt > 0.5 ? "#6a8ac8" : m.bottom} />
        {alt > 0.6 ? <Stars w={5000} h={3000} count={80} /> : null}
      </X>
      <Cloud x={-600} y={-420} w={700} seed={2} z={-30} />
      <Cloud x={500} y={-520} w={800} seed={6} z={-30} />
      <Cloud x={-100} y={-700} w={1100} seed={9} z={-29} />
      {children}
    </>
  );
};

/** Starry space with an optional Earth limb below. */
export const SpaceSet: React.FC<{ earth?: boolean; earthY?: number; earthR?: number; children?: React.ReactNode }> = ({ earth = true, earthY = -1700, earthR = 1500, children }) => (
  <>
    <SpaceBack z={-41} />
    {earth ? (
      <X y={earthY} z={-35}>
        <Glow rx={earthR * 1.18} color="#7fbfff" alpha={0.35} additive />
        <Part shape={circle(earthR)} color="#2f7fd0" shade={0.3} light={{ dir: [-0.6, 0.7] }}>
          <Part shape={blob([[-900, 1200], [-500, 1350], [-200, 1250], [100, 1380], [300, 1200], [-100, 1050], [-600, 1000]], 8)} color="#6aa84a" flat outline={4} z={0.001} />
          <Part shape={blob([[400, 1100], [700, 1250], [1000, 1050], [800, 900], [500, 950]], 8)} color="#7ab04a" flat outline={4} z={0.001} />
          <Part shape={ellipse(520, 90)} color="#ffffff" flat outline={0} opacity={0.6} x={-300} y={1280} z={0.002} />
        </Part>
      </X>
    ) : null}
    {children}
  </>
);

/** Warm diagram paper. */
export const Paper: React.FC<{ color?: string; children?: React.ReactNode }> = ({ color = "#e9dcbc", children }) => (
  <>
    <Gradient w={4400} h={2600} stops={[[0, "#f1e6c8"], [1, color]]} z={-41} />
    {Array.from({ length: 14 }, (_, i) => (
      <Line key={i} pts={[[-2200, -1200 + i * 190], [2200, -1200 + i * 190]]} width={2} color="#d8c8a4" z={-40} opacity={0.5} />
    ))}
    {children}
  </>
);

/** Office interior by era, with a window (night → dark sky) and desk. */
export const Office: React.FC<{ era?: "1995" | "2000" | "2008" | "2020"; night?: boolean; wall?: string; desk?: boolean; deskX?: number; children?: React.ReactNode }> = ({
  era = "2008",
  night = false,
  wall,
  desk = true,
  deskX = 260,
  children,
}) => {
  const w = wall ?? (era === "1995" ? "#d8d0b8" : era === "2000" ? "#c9d4dc" : era === "2008" ? "#bfc6cc" : "#d4d6da");
  return (
    <>
      <Room wall={w} floor={era === "1995" ? "#8a7a6a" : "#7f8288"} y={-420} z={-40} boards={era === "1995"}>
        <Window x={-760} y={960} w={560} h={520} night={night} />
        {era !== "1995" ? <Skyline x={-760} y={720} w={560} n={4} night={night} hmin={120} hmax={360} z={0.0015} s={1} /> : null}
      </Room>
      {desk ? (
        <X x={deskX} y={-420} z={-10}>
          <Desk w={900} h={300} color={era === "1995" ? "#a0703f" : "#5a5e66"} />
          {era === "1995" ? <HomeComputer x={120} y={300} s={0.55} /> : <Monitor x={120} y={460} w={420} h={260} screen={night ? "#1e3a5a" : "#24405e"} />}
        </X>
      ) : null}
      {children}
      {night ? <Wash width={6000} height={4000} color="#0a1030" alpha={0.28} z={39} /> : null}
    </>
  );
};

/** The 1970s family home: warm wallpaper, window to a jacaranda, bookshelf. */
export const HomeRoom: React.FC<{ night?: boolean; shelf?: boolean; children?: React.ReactNode }> = ({ night = false, shelf = true, children }) => (
  <>
    <Room wall="#e2c79a" floor="#9a6a42" y={-420} z={-40}>
      {Array.from({ length: 16 }, (_, i) => (
        <Line key={i} pts={[[-2200 + i * 280, 40], [-2200 + i * 280, 2600]]} width={6} color="#d6b886" z={0.001} />
      ))}
      <Window x={700} y={1000} w={520} h={540} night={night} />
      <Jacaranda x={700} y={760} h={380} z={0.0015} />
    </Room>
    {shelf ? <Bookshelf x={-760} y={-420} w={560} h={820} z={-20} /> : null}
    {children}
    {night ? <Wash width={6000} height={4000} color="#0a1030" alpha={0.3} z={39} /> : null}
  </>
);

/** Pretoria street: jacarandas in bloom, a family house, lawn. */
export const PretoriaStreet: React.FC<{ mood?: Mood; horizon?: number; children?: React.ReactNode }> = ({ mood = "day", horizon = -300, children }) => (
  <>
    <SkyBack mood={mood} horizon={horizon} />
    <Mountains w={6000} y={horizon + 10} color="#b9a0c0" outline={3} peaks={[[-2000, 160], [-900, 240], [200, 150], [1300, 220]]} z={-39} />
    <House x={-200} y={horizon} w={1300} z={-30} lit={mood === "dusk" || mood === "night"} />
    <Jacaranda x={-1200} y={horizon - 40} h={720} z={-25} seed={2} />
    <Jacaranda x={900} y={horizon - 60} h={800} z={-25} seed={5} />
    <Ground w={6000} h={2000} y={horizon} color="#8fb05a" far="#9abd62" pebbles={6} tufts={14} tuftColor="#6a8a3a" seed={2} z={-28} />
    {children}
    {MOODS[mood].wash ? <Wash width={6000} height={4000} color={MOODS[mood].wash![0]} alpha={MOODS[mood].wash![1]} z={39} /> : null}
  </>
);

/** School grounds: brick block, concrete stairs. */
export const SchoolSet: React.FC<{ horizon?: number; stairs?: boolean; children?: React.ReactNode }> = ({ horizon = -360, stairs = true, children }) => (
  <>
    <SkyBack mood="day" horizon={horizon} />
    <CampusBuilding kind="brick" w={3400} h={1100} y={horizon} z={-38} />
    <Ground w={6000} h={2000} y={horizon} color="#b8b4aa" far="#c4c0b6" pebbles={4} tufts={0} seed={6} z={-30} />
    {stairs ? <ConcreteStairs x={600} y={horizon} steps={8} stepW={140} stepH={64} z={-20} /> : null}
    {children}
  </>
);

/** University campus: lawn in front of a building of the given kind. */
export const CampusSet: React.FC<{ kind?: "brick" | "stone" | "sandstone"; horizon?: number; palms?: boolean; snow?: boolean; children?: React.ReactNode }> = ({ kind = "stone", horizon = -320, children }) => (
  <>
    <SkyBack mood="day" horizon={horizon} />
    <CampusBuilding kind={kind} w={3600} h={1200} y={horizon} z={-38} />
    <Ground w={6000} h={2000} y={horizon} color="#7fa84a" far="#8ab452" pebbles={4} tufts={16} tuftColor="#5a8a3a" seed={8} z={-30} />
    {[-1500, -700, 700, 1500].map((x, i) => (
      <Bush key={x} x={x} y={horizon - 10} w={260} seed={i + 3} z={-29} />
    ))}
    {children}
  </>
);

/** Road through green hills (California drive). */
export const RoadSet: React.FC<{ horizon?: number; mood?: Mood; children?: React.ReactNode }> = ({ horizon = -220, mood = "day", children }) => (
  <>
    <SkyBack mood={mood} horizon={horizon} />
    <Hill w={3200} h={420} x={-900} y={horizon} color="#8ab45a" seed={2} z={-38} />
    <Hill w={3000} h={360} x={1100} y={horizon} color="#7aa84a" seed={5} z={-37} />
    <Ground w={6000} h={2000} y={horizon} color="#9ac062" far="#a6c86a" pebbles={4} tufts={12} tuftColor="#6a8a3a" seed={3} z={-30} />
    <Part shape={roundRect(6000, 260, 0)} color="#5a5a62" flat outline={5} y={horizon - 300} z={-25} />
    {Array.from({ length: 16 }, (_, i) => (
      <Part key={i} shape={roundRect(140, 12, 4)} color="#f2ece0" flat outline={0} x={-3000 + i * 400} y={horizon - 300} z={-24} />
    ))}
    {children}
  </>
);

/** Casino table for the "all in" bets: chip stacks slide to the middle with `push` 0..1. Table top at `y`. */
export const ChipsTable: React.FC<{ push?: number; y?: number; n?: number; children?: React.ReactNode; front?: React.ReactNode }> = ({ push = 0, y = -420, n = 8, children, front }) => (
  <>
    <Gradient w={4400} h={2600} stops={[[0, "#1a2a22"], [1, "#0e1a14"]]} z={-41} />
    <Glow rx={1300} ry={700} y={200} color="#ffd98a" alpha={0.18} additive z={-40} />
    {children}
    <X y={y} z={20}>
      <Part shape={ellipse(1800, 300)} color="#6e4a2c" shade={0.15} y={-40} />
      <Part shape={ellipse(1740, 270)} color="#3a8a55" flat outline={5} z={0.001} />
      <Part shape={ellipse(1600, 230)} color="#2f7a4a" flat outline={0} z={0.0015} />
      {front}
      {Array.from({ length: n }, (_, i) => {
        const x0 = -900 + (i % 4) * 110;
        const y0 = -60 + Math.floor(i / 4) * 60;
        const k = Math.max(0, Math.min(1, push * 1.4 - i * 0.05));
        const x = x0 + (-40 + (i % 4) * 70 - x0) * k;
        const yy = y0 + (Math.floor(i / 4) * 40 - y0) * k;
        return (
          <X key={i} x={x} y={yy} z={0.01 + (Math.floor(i / 4) ? -0.001 : 0.001)}>
            {Array.from({ length: 6 }, (_, j) => (
              <Part key={j} shape={ellipse(46, 15)} color={["#c8262f", "#2f4f9a", "#e9ba41", "#2a2a30"][i % 4]} shade={0.2} outline={3.5} y={j * 13} z={j * 0.0001} />
            ))}
          </X>
        );
      })}
    </X>
  </>
);

/** Mission control wrapper (dim, blue screens). */
export const MCRoom: React.FC<{ y?: number; children?: React.ReactNode }> = ({ y = -400, children }) => (
  <>
    <MissionControlSet y={y} z={-40} />
    {children}
  </>
);

/** Full-frame white flash (0..1). */
export const Flash: React.FC<{ k: number; color?: string }> = ({ k, color = "#ffffff" }) =>
  k > 0.001 ? <AbsoluteFill style={{ backgroundColor: color, opacity: Math.min(1, k) }} /> : null;

/** A dashed red arrow between two points on paper. */
export const DashArrow: React.FC<{ from: [number, number]; to: [number, number]; k?: number; color?: string; width?: number; z?: number }> = ({ from, to, k = 1, color = "#c8262f", width = 10, z = 0 }) => {
  const kk = Math.max(0, Math.min(1, k));
  if (kk <= 0.01) return null;
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const len = Math.hypot(dx, dy) * kk;
  const ang = Math.atan2(dy, dx);
  const n = Math.max(1, Math.floor(len / 40));
  return (
    <X x={from[0]} y={from[1]} rot={ang} z={z}>
      {Array.from({ length: n }, (_, i) => (
        <Line key={i} pts={[[i * 40, 0], [i * 40 + 24, 0]]} width={width} color={color} />
      ))}
      <Part shape={poly([[len + 30, 0], [len - 10, 22], [len - 10, -22]])} color={color} flat outline={3.5} />
    </X>
  );
};

/** Money formatting for counters. */
export const usd = (v: number) => {
  if (v >= 1e12) return `$${(v / 1e12).toFixed(v >= 1e13 ? 0 : 1).replace(/\.0$/, "")} TRILLION`;
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1).replace(/\.0$/, "")} BILLION`;
  if (v >= 1e6) return `$${Math.round(v / 1e6)} MILLION`;
  return `$${Math.round(v).toLocaleString("en-US")}`;
};

/** Rain overlay helper for stormy shots. */
export const StormRain: React.FC<{ on?: boolean }> = ({ on = true }) => (on ? <Rain w={4000} h={2400} n={110} z={30} /> : null);

/** Simple house-less horizon with hills and a lawn (generic outdoors). */
export const Outdoors: React.FC<{ mood?: Mood; horizon?: number; ground?: string; children?: React.ReactNode }> = ({ mood = "day", horizon = -300, ground = "#8fb05a", children }) => (
  <>
    <SkyBack mood={mood} horizon={horizon} />
    <Hill w={3400} h={380} x={-800} y={horizon} color="#8ab45a" seed={3} z={-38} />
    <Ground w={6000} h={2000} y={horizon} color={ground} far={ground} pebbles={6} tufts={12} tuftColor="#6a8a3a" seed={5} z={-30} />
    {children}
    {MOODS[mood].wash ? <Wash width={6000} height={4000} color={MOODS[mood].wash![0]} alpha={MOODS[mood].wash![1]} z={39} /> : null}
  </>
);

export { MOODS };
export const planetBack = (kind: "mars" | "moon") => <Planet kind={kind} r={400} />;
