import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { X, Part, Line, Glow, Gradient, Wash, roundRect, circle, ellipse, poly, blob, mixHex } from "../../kit";
import {
  Sky, Cloud, Mountains, Ground, Stars, Moon, Sun, Sea, Hill, Bush, TropicalIsland, LaunchPad, Falcon1, SpaceBack, Planet, Room, Window, Desk, Monitor, HomeComputer,
  Bookshelf, Jacaranda, House, CampusBuilding, ConcreteStairs, Skyline, MissionControlSet, Rain,
  Wainscot, Blinds, WallFrame, PottedPlant, Mug, DeskClutter, WallLights, DustMotes, WallClock, ParkTree, type ArtKind,
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
  const frame = useCurrentFrame();
  const drift = frame * 0.35;
  return (
    <X z={-41}>
      <Sky w={6000} h={3600} y={horizon + 1700} top={m.top} mid={m.mid} bottom={m.bottom} />
      {mood === "night" ? <Stars w={5000} h={1800} y={horizon + 900} count={120} /> : null}
      {mood === "night" ? <Moon x={sunX} y={horizon + 700} r={56} /> : null}
      {mood === "dusk" || mood === "dawn" ? <Sun x={sunX} y={horizon + 120} r={120} glow={0.9} /> : null}
      {clouds && mood !== "night" ? (
        <>
          <Cloud x={-1500 + drift * 0.6} y={horizon + 520} w={300} seed={11} color={mood === "storm" ? "#7a8290" : undefined} />
          <Cloud x={-760 + drift} y={horizon + 620} w={460} seed={3} color={mood === "storm" ? "#7a8290" : undefined} />
          <Cloud x={700 + drift * 0.8} y={horizon + 760} w={400} seed={8} color={mood === "storm" ? "#6a7280" : undefined} />
          {mood === "storm" ? <Cloud x={-60 + drift * 0.5} y={horizon + 900} w={700} seed={5} color="#5a626e" /> : null}
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

/** Big soft blotches that give diagram paper a painted, tactile surface. */
const PAPER_BLOTCHES: [number, number, number, number, number][] = [
  [-1500, 700, 520, 300, 0.09], [-600, 900, 380, 220, 0.06], [400, 760, 600, 260, 0.07], [1400, 500, 460, 320, 0.08],
  [-1200, -200, 420, 260, 0.06], [-100, -60, 700, 300, 0.05], [1100, -380, 520, 280, 0.07], [-700, -800, 600, 260, 0.08],
  [700, -900, 480, 240, 0.06], [1700, 1000, 400, 260, 0.06],
];

/** Warm diagram paper. */
export const Paper: React.FC<{ color?: string; children?: React.ReactNode }> = ({ color = "#e9dcbc", children }) => (
  <>
    <Gradient w={4400} h={2600} stops={[[0, "#f1e6c8"], [1, color]]} z={-41} />
    {PAPER_BLOTCHES.map(([x, y, rx, ry, a], i) => (
      <Part key={i} shape={ellipse(rx, ry)} color="#c9b48a" flat outline={0} opacity={a} x={x} y={y} z={-40.9} />
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
  const art: ArtKind = era === "1995" ? "map" : era === "2000" ? "chart" : era === "2008" ? "rocket" : "mars";
  const rug = era === "1995" ? "#8a4a3a" : era === "2000" ? "#4a6a8a" : "#5a5f6a";
  return (
    <>
      <Room wall={w} floor={era === "1995" ? "#8a7a6a" : "#6c727b"} y={-420} z={-40} boards={era === "1995"}>
        <Wainscot wall={w} h={290} z={0.0005} />
        <WallLights xs={[-1150, 0, 1150]} y={780} alpha={night ? 0.1 : 0.2} z={0.0006} />
        <Window x={-760} y={960} w={560} h={520} night={night} />
        {era !== "1995" ? <Skyline x={-760} y={720} w={560} n={4} night={night} hmin={120} hmax={360} z={0.0015} s={1} /> : null}
        {era !== "1995" ? <Blinds x={-760} y={960} w={560} h={520} open={0.55} z={0.0016} /> : null}
        <WallFrame x={160} y={790} w={330} h={235} art={art} wall={w} recede={0.2} z={0.0012} />
        <WallFrame x={-1480} y={760} w={250} h={320} art="abstract" wall={w} recede={0.25} seed={3} z={0.0012} />
        <WallClock x={760} y={830} r={78} z={0.0012} />
        <Part shape={ellipse(980, 80)} color={rug} flat outline={5} y={-150} z={0.0007} />
        {!night ? <DustMotes x={-760} y={420} w={520} h={760} n={10} z={0.002} /> : null}
      </Room>
      <PottedPlant x={-1000} y={-600} h={500} seed={2} z={-14} />
      <PottedPlant x={1040} y={-600} h={430} pot="#5a6a7a" leaf="#3f7a3a" seed={5} z={-14} />
      {desk ? (
        <X x={deskX} y={-420} z={-10}>
          <Desk w={900} h={300} color={era === "1995" ? "#a0703f" : "#5a5e66"} />
          {era === "1995" ? <HomeComputer x={120} y={300} s={0.55} /> : <Monitor x={120} y={460} w={420} h={260} screen={night ? "#1e3a5a" : "#24405e"} />}
          <DeskClutter x={-330} y={246} z={0.01} />
          <Mug x={390} y={246} color={era === "2020" ? "#2a2a30" : "#d8322f"} z={0.01} />
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
      {/* striped 1970s wallpaper with a small diamond motif, wood panelling below */}
      {Array.from({ length: 16 }, (_, i) => (
        <Part key={i} shape={roundRect(120, 2600, 0)} color="#d9ba86" flat outline={0} x={-2200 + i * 280} y={1300} z={0.0004} />
      ))}
      {Array.from({ length: 16 }, (_, i) =>
        [0, 1, 2, 3].map((j) => <Part key={`${i}${j}`} shape={poly([[0, 16], [12, 0], [0, -16], [-12, 0]])} color="#c9a46c" flat outline={0} x={-2060 + i * 280} y={420 + j * 260} z={0.00045} />),
      )}
      <Wainscot wall="#a8763e" h={280} step={300} z={0.0005} />
      <WallLights xs={[-700, 600]} y={760} color="#ffe2a8" alpha={night ? 0.16 : 0.18} z={0.0006} />
      <Window x={700} y={1000} w={520} h={540} night={night} />
      <Jacaranda x={700} y={760} h={380} z={0.0015} />
      <WallFrame x={-60} y={800} w={250} h={200} art="family" frame="#7a4a2a" wall="#e2c79a" recede={0.15} z={0.0012} />
      <WallFrame x={-1300} y={820} w={220} h={280} art="landscape" frame="#7a4a2a" wall="#e2c79a" recede={0.2} seed={4} z={0.0012} />
      <Part shape={ellipse(1000, 90)} color="#b5493a" flat outline={5} y={-160} z={0.0007} />
      <Part shape={ellipse(860, 66)} color="#d8a24a" flat outline={0} y={-160} z={0.0008} />
    </Room>
    {shelf ? <Bookshelf x={-760} y={-420} w={560} h={820} z={-20} /> : null}
    <PottedPlant x={1180} y={-600} h={460} pot="#b07a4a" seed={7} z={-14} />
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
    {[-1700, -1050].map((x, i) => (
      <Bush key={x} x={x} y={horizon - 6} w={300} seed={i + 30} z={-29} />
    ))}
    <ParkTree x={-1420} y={horizon - 20} h={760} seed={31} z={-28} />
    <ParkTree x={1650} y={horizon - 20} h={700} seed={32} z={-28} />
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
    <Part shape={roundRect(6000, 120, 0)} color="#d8cdb4" flat outline={5} y={horizon - 120} z={-29.5} />
    {[-1500, -700, 700, 1500].map((x, i) => (
      <Bush key={x} x={x} y={horizon - 10} w={260} seed={i + 3} z={-29} />
    ))}
    <ParkTree x={-1150} y={horizon - 40} h={820} seed={41} z={-28} />
    <ParkTree x={1200} y={horizon - 40} h={760} seed={42} z={-28} />
    {children}
  </>
);

/** Road through green hills (California drive). */
export const RoadSet: React.FC<{ horizon?: number; mood?: Mood; children?: React.ReactNode }> = ({ horizon = -220, mood = "day", children }) => (
  <>
    <SkyBack mood={mood} horizon={horizon} />
    <Mountains w={6000} y={horizon + 6} color={mixHex(MOODS[mood].hills, MOODS[mood].bottom, 0.45)} outline={3} peaks={[[-2300, 260], [-1500, 380], [-600, 250], [300, 340], [1200, 230], [2100, 360]]} z={-39.5} />
    {[-2000, -1640, -1300, -380, -60, 260, 980, 1320, 1700, 2100].map((x, i) => (
      <ParkTree key={x} x={x} y={horizon + 4} h={170 + (i % 3) * 40} seed={i + 20} recede={0.45} toward={MOODS[mood].bottom} z={-38.5} />
    ))}
    <Hill w={3200} h={420} x={-900} y={horizon} color="#8ab45a" seed={2} z={-38} />
    <Hill w={3000} h={360} x={1100} y={horizon} color="#7aa84a" seed={5} z={-37} />
    {[-1600, -700, 500, 1500].map((x, i) => (
      <ParkTree key={x} x={x} y={horizon - 30} h={330 + (i % 2) * 70} seed={i + 50} z={-33} />
    ))}
    <Ground w={6000} h={2000} y={horizon} color="#9ac062" far="#a6c86a" pebbles={4} tufts={12} tuftColor="#6a8a3a" seed={3} z={-30} />
    <Part shape={roundRect(6000, 300, 0)} color="#c9b98f" flat outline={5} y={horizon - 300} z={-25.5} />
    <Part shape={roundRect(6000, 260, 0)} color="#5a5a62" flat outline={5} y={horizon - 300} z={-25} />
    {[-1, 1].map((sd) => (
      <Part key={sd} shape={roundRect(6000, 10, 0)} color="#e8e2d2" flat outline={0} y={horizon - 300 + sd * 112} z={-24.5} />
    ))}
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
export const DashArrow: React.FC<{ from: [number, number]; to: [number, number]; k?: number; color?: string; width?: number; z?: number }> = ({ from, to, k = 1, color = "#d8322f", width = 18, z = 0 }) => {
  const kk = Math.max(0, Math.min(1, k));
  if (kk <= 0.01) return null;
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const len = Math.hypot(dx, dy) * kk;
  const ang = Math.atan2(dy, dx);
  // bold outlined dashes and head (thin dashes read as scratches on screen)
  const step = 72;
  const dash = 46;
  const n = Math.max(1, Math.floor((len - 30) / step));
  return (
    <X x={from[0]} y={from[1]} rot={ang} z={z}>
      {Array.from({ length: n }, (_, i) => (
        <Part key={i} shape={roundRect(dash, width, width / 2)} color={color} flat outline={5} x={i * step + dash / 2} />
      ))}
      <Part shape={poly([[len + 44, 0], [len - 14, 36], [len - 14, -36]])} color={color} flat outline={6} z={0.001} />
    </X>
  );
};

/** Full-digit money for market screens: $2,100,000,000,000. */
export const usdFull = (v: number) => `$${Math.round(v).toLocaleString("en-US")}`;

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
    <Mountains w={6000} y={horizon + 6} color={mixHex(MOODS[mood].hills, MOODS[mood].bottom, 0.45)} outline={3} peaks={[[-2300, 260], [-1500, 380], [-600, 250], [300, 340], [1200, 230], [2100, 360]]} z={-39.5} />
    {[-2000, -1640, -1300, -380, -60, 260, 980, 1320, 1700, 2100].map((x, i) => (
      <ParkTree key={x} x={x} y={horizon + 4} h={170 + (i % 3) * 40} seed={i + 20} recede={0.45} toward={MOODS[mood].bottom} z={-38.5} />
    ))}
    <Hill w={3400} h={380} x={-800} y={horizon} color="#8ab45a" seed={3} z={-38} />
    {[-1700, 1550].map((x, i) => (
      <ParkTree key={x} x={x} y={horizon - 30} h={420} seed={i + 60} z={-33} />
    ))}
    <Ground w={6000} h={2000} y={horizon} color={ground} far={ground} pebbles={6} tufts={12} tuftColor="#6a8a3a" seed={5} z={-30} />
    {children}
    {MOODS[mood].wash ? <Wash width={6000} height={4000} color={MOODS[mood].wash![0]} alpha={MOODS[mood].wash![1]} z={39} /> : null}
  </>
);

export { MOODS };
export const planetBack = (kind: "mars" | "moon") => <Planet kind={kind} r={400} />;
