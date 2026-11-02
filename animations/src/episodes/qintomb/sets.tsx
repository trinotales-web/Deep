import React from "react";
import { X, Part, Line, Glow, Gradient, Wash, roundRect, poly } from "../../kit";
import {
  Sky, Cloud, Mountains, Ground, Sea, Stars, Moon, RedPillar, Lantern, QinThrone, TombWall, StoneFloor, WallTorch, BurialMound, Brazier, ChineseHall,
  PersimmonTree, Floorboards,
} from "../../kit/env";

// Locations for the First Emperor's tomb. Every set takes `children`, drawn
// between its background and any foreground layer.

export type Mood = "day" | "dusk" | "night" | "dawn" | "autumn";

const SKY: Record<Mood, { top: string; mid?: string; bottom: string; hills: string; ground: string; far: string }> = {
  day: { top: "#7fb8e0", bottom: "#e4eef0", hills: "#a7b4c4", ground: "#d4b27e", far: "#dcc08e" },
  autumn: { top: "#c9a878", mid: "#e8c890", bottom: "#f4dcae", hills: "#a8a0a8", ground: "#d4b27e", far: "#dcbf8a" },
  dusk: { top: "#3f4a86", mid: "#c9708a", bottom: "#f3b07a", hills: "#6c5c7c", ground: "#9a7a5a", far: "#a8886a" },
  night: { top: "#0b1030", bottom: "#2b3a63", hills: "#2a3150", ground: "#3a3428", far: "#423a2e" },
  dawn: { top: "#7fa6d6", mid: "#e9c3b4", bottom: "#fbe1c4", hills: "#9aa6b6", ground: "#c9a878", far: "#d4b48a" },
};

/** Loess plains of Qin: sky, blue mountains, yellow earth; optional mound behind. */
export const Plains: React.FC<{ mood?: Mood; horizon?: number; mound?: "build" | "done" | null; moundX?: number; moundS?: number; clouds?: boolean; children?: React.ReactNode }> = ({
  mood = "day",
  horizon = -120,
  mound = null,
  moundX = 0,
  moundS = 1,
  clouds = true,
  children,
}) => {
  const c = SKY[mood];
  return (
    <>
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
            <Cloud x={-640} y={horizon + 560} w={440} seed={3} />
            <Cloud x={600} y={horizon + 620} w={380} seed={7} />
          </>
        ) : null}
        <Mountains w={5000} y={horizon} color={c.hills} peaks={[[-1500, 160], [-800, 300], [-250, 180], [350, 260], [950, 170], [1500, 220]]} />
      </X>
      <X y={horizon} z={-30}>
        <Ground w={5000} h={1800} color={c.ground} far={c.far} pebbles={10} tufts={14} tuftColor="#8a7a4a" seed={5} />
      </X>
      {mound ? <BurialMound x={moundX} y={horizon - 2} w={1100 * moundS} h={420 * moundS} stage={mound} z={-28} /> : null}
      {children}
    </>
  );
};

/** Qin throne hall: dark red walls, red pillars, lanterns, braziers, throne on its dais. */
export const ThroneHall: React.FC<{ floorY?: number; throne?: boolean; throneX?: number; dim?: number; children?: React.ReactNode }> = ({
  floorY = -460,
  throne = true,
  throneX = 0,
  dim = 0,
  children,
}) => (
  <>
    <Part shape={roundRect(5000, 3000, 0)} color="#5a1e1c" flat outline={0} y={floorY + 1500} z={-41} />
    {[-900, -300, 300, 900].map((x) => (
      <X key={x} x={x} y={floorY + 520} z={-40}>
        <Part shape={roundRect(420, 640, 6)} color="#3a1614" shade={0.1} />
        <Part shape={roundRect(360, 580, 4)} color="#6a2420" flat outline={4} z={0.001} />
        {[-1, 1].map((k) => (
          <Line key={k} pts={[[-150, k * 240], [150, k * 240]]} width={4} color="#c9963f" z={0.002} />
        ))}
      </X>
    ))}
    <Glow y={floorY + 500} rx={1100} ry={600} color="#ffb35a" alpha={0.18} additive z={-39} />
    <Floorboards w={5000} h={1400} y={floorY} color="#2e2224" z={-36} />
    {[-760, 760].map((x) => (
      <RedPillar key={x} x={x} y={floorY} h={1100} w={80} z={-20} />
    ))}
    {[-480, 480].map((x) => (
      <Lantern key={x} x={x} y={560} cord={140} z={-19} />
    ))}
    {throne ? <QinThrone x={throneX} y={floorY} s={0.9} z={-15} /> : null}
    {[-560, 560].map((x) => (
      <Brazier key={x} x={x} y={floorY} s={0.8} z={-14} />
    ))}
    {children}
    {dim > 0 ? <Wash width={5000} height={3000} color="#0a0610" alpha={dim} z={40} /> : null}
  </>
);

/** Underground tomb corridor: stone walls, diamond frieze, torches, flagstones. `dark` dims it to lamp light. */
export const TombCorridor: React.FC<{ floorY?: number; torches?: boolean; dark?: number; children?: React.ReactNode }> = ({ floorY = -420, torches = true, dark = 0, children }) => (
  <>
    <TombWall y={floorY} w={5000} h={1600} z={-40} />
    <StoneFloor y={floorY} w={5000} h={900} z={-36} />
    {torches
      ? [-700, 700].map((x, i) => (
          <WallTorch key={x} x={x} y={floorY + 760} seed={i + 2} z={-35} />
        ))
      : null}
    {children}
    {dark > 0 ? <Wash width={5000} height={3000} color="#04060c" alpha={dark} z={40} /> : null}
  </>
);

/** The underground palace hall: star ceiling, model palaces, river of mercury across the floor. */
export const PalaceVault: React.FC<{ floorY?: number; children?: React.ReactNode }> = ({ floorY = -380, children }) => (
  <>
    <Gradient w={5000} h={3000} stops={[[0, "#0e1430"], [1, "#1c2448"]]} z={-41} />
    <X y={floorY + 700} z={-40}>
      <Part shape={roundRect(5000, 900, 0)} color="#141a33" flat outline={0} y={300} />
    </X>
    <X z={-39}>
      {[-640, 0, 640].map((x, i) => (
        <ChineseHall key={x} x={x} y={floorY + 40} w={300} h={130} tiers={i === 1 ? 2 : 1} s={0.9} />
      ))}
    </X>
    <Part shape={roundRect(5000, 900, 0)} color="#2a3038" flat outline={0} y={floorY - 450} z={-37} />
    {children}
  </>
);

/** Night sky, sea and coast for the voyage. */
export const Seascape: React.FC<{ mood?: Mood; horizon?: number; children?: React.ReactNode }> = ({ mood = "day", horizon = -60, children }) => {
  const c = SKY[mood];
  return (
    <>
      <X z={-40}>
        <Sky w={5000} h={3000} y={horizon + 1400} top={c.top} mid={c.mid} bottom={c.bottom} />
        {mood !== "night" ? (
          <>
            <Cloud x={-560} y={horizon + 400} w={460} seed={4} />
            <Cloud x={620} y={horizon + 480} w={380} seed={9} />
          </>
        ) : (
          <Stars w={4200} h={1400} y={horizon + 700} count={80} />
        )}
      </X>
      <Sea w={5000} h={2400} y={horizon} color={mood === "dusk" ? "#4a6a9a" : mood === "night" ? "#1e2a48" : "#3f86b8"} z={-30} />
      {children}
    </>
  );
};

/** Shaanxi farmland, autumn 1974: persimmon tree, farmhouses, the planted mound far behind. */
export const Farmland: React.FC<{ horizon?: number; mound?: boolean; children?: React.ReactNode }> = ({ horizon = -100, mound = true, children }) => (
  <Plains mood="day" horizon={horizon} mound={mound ? "done" : null} moundX={420} moundS={0.7}>
    {[-860, -560].map((x, i) => (
      <X key={x} x={x} y={horizon - 4} z={-27}>
        <Part shape={roundRect(260, 150, 4)} color="#d9c49a" shade={0.2} y={75} />
        <Part shape={poly([[-160, 150], [160, 150], [120, 220], [-120, 220]])} color="#7a6a5a" shade={0.2} z={0.001} />
        <Part shape={roundRect(50, 80, 3)} color="#5a4030" flat outline={4} x={i ? 40 : -40} y={40} z={0.002} />
      </X>
    ))}
    <PersimmonTree x={-120} y={horizon - 20} h={460} z={-26} />
    {children}
  </Plains>
);
