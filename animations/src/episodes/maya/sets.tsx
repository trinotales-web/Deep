import React from "react";
import { X, Part, Line, Glow, Gradient, Wash, roundRect, poly, circle, blob } from "../../kit";
import {
  Sky, Cloud, Mountains, Ground, Stars, Moon, Sun, Jungle, Lake, IslandCity, TikalTemple, MayaPyramid, MayaHut, Ceiba, jungleMood, type JungleMood,
} from "../../kit/env";

// Locations for the Maya story. Every set takes `children`, drawn between its
// background and any foreground layer. Ground/water line at `horizon`.

/** Sky, distant hills and a jungle band, with ground below. */
export const JungleSet: React.FC<{ mood?: JungleMood; horizon?: number; ground?: string; clouds?: boolean; jungle?: boolean; children?: React.ReactNode }> = ({
  mood = "day",
  horizon = -160,
  ground = "#a8b86a",
  clouds = true,
  jungle = true,
  children,
}) => {
  const m = jungleMood(mood);
  return (
    <>
      <X z={-41}>
        <Sky w={6000} h={3600} y={horizon + 1700} top={m.top} mid={m.mid} bottom={m.bottom} />
        {mood === "night" ? <Stars w={5000} h={1600} y={horizon + 900} count={110} /> : null}
        {mood === "night" ? <Moon x={680} y={horizon + 620} r={52} /> : null}
        {clouds && mood !== "night" ? (
          <>
            <Cloud x={-700} y={horizon + 640} w={460} seed={3} />
            <Cloud x={640} y={horizon + 720} w={400} seed={8} />
          </>
        ) : null}
      </X>
      <Mountains w={6000} y={horizon + 30} color={m.hills} outline={3} peaks={[[-2200, 240], [-1300, 380], [-500, 220], [300, 330], [1100, 230], [1900, 300]]} z={-40} />
      {jungle ? <Jungle y={horizon} w={6000} h={300} seed={5} dark={mood === "night" ? 0.6 : mood === "dusk" ? 0.25 : 0} z={-35} /> : null}
      <Ground w={6000} h={2000} y={horizon} color={ground} far={ground} pebbles={8} tufts={14} tuftColor="#6a8a3a" seed={4} z={-30} />
      {children}
      {mood === "night" ? <Wash width={6000} height={4000} color="#0a1030" alpha={0.25} z={39} /> : null}
    </>
  );
};

/** The lake of Petén Itzá with jungle shores and, optionally, the island city of Nojpetén. */
export const LakeSet: React.FC<{ mood?: JungleMood; horizon?: number; island?: boolean; islandX?: number; islandW?: number; burn?: number; children?: React.ReactNode }> = ({
  mood = "day",
  horizon = 0,
  island = true,
  islandX = 0,
  islandW = 1300,
  burn = 0,
  children,
}) => {
  const m = jungleMood(mood);
  const lake = mood === "night" ? "night" : mood === "dusk" ? "dusk" : mood === "dawn" ? "dawn" : "day";
  return (
    <>
      <X z={-41}>
        <Sky w={6000} h={3600} y={horizon + 1700} top={m.top} mid={m.mid} bottom={m.bottom} />
        {mood === "dawn" ? <Sun x={-520} y={horizon + 160} r={110} glow={0.9} /> : null}
        {mood !== "night" ? (
          <>
            <Cloud x={-760} y={horizon + 560} w={440} seed={4} />
            <Cloud x={720} y={horizon + 640} w={380} seed={9} />
          </>
        ) : (
          <Stars w={5000} h={1600} y={horizon + 900} count={100} />
        )}
      </X>
      <Mountains w={6000} y={horizon + 20} color={m.hills} outline={3} peaks={[[-2400, 160], [-1500, 260], [-600, 150], [400, 230], [1300, 170], [2200, 210]]} z={-40} />
      <Jungle y={horizon} w={6000} h={150} seed={9} dark={mood === "night" ? 0.6 : 0.1} z={-36} />
      <Lake y={horizon} w={6000} h={2400} mood={lake} z={-30} />
      {island ? <IslandCity x={islandX} y={horizon - 40} w={islandW} burn={burn} mood={mood === "night" ? "night" : "day"} z={-25} /> : null}
      {children}
      {mood === "dawn" ? <Glow x={-520} y={horizon + 160} rx={1200} ry={500} color="#ffd8a0" alpha={0.25} additive z={38} /> : null}
    </>
  );
};

/** A Classic Maya city plaza: plastered floor, temples and houses behind, stelae. */
export const PlazaSet: React.FC<{ mood?: JungleMood; horizon?: number; overgrown?: number; empty?: boolean; children?: React.ReactNode }> = ({
  mood = "day",
  horizon = -200,
  overgrown = 0,
  children,
}) => (
  <JungleSet mood={mood} horizon={horizon + 140} ground="#e6dcc4" clouds jungle>
    <X z={-28}>
      <TikalTemple x={-420} y={horizon + 140} s={0.95} overgrown={overgrown} />
      <MayaPyramid x={560} y={horizon + 140} s={0.7} w={700} h={420} tiers={7} top={0.42} templeW={220} templeH={150} doors={3} comb={110} color="#e8d2b0" overgrown={overgrown} />
      <MayaHut x={-1000} y={horizon + 140} w={240} />
      <MayaHut x={1050} y={horizon + 140} w={220} />
    </X>
    <Part shape={roundRect(6000, 30, 0)} color="#d8ccb0" flat outline={0} y={horizon + 125} z={-27} />
    <Line pts={[[-3000, horizon + 140], [3000, horizon + 140]]} width={5} z={-26.9} />
    {children}
  </JungleSet>
);

/** Interior of a Maya palace: plastered walls with a red band, a corbel-arch doorway, a painted mural, a stone bench throne. */
export const PalaceRoom: React.FC<{ floorY?: number; dim?: number; throne?: boolean; children?: React.ReactNode }> = ({ floorY = -460, dim = 0, throne = true, children }) => (
  <>
    <Gradient w={6000} h={4000} y={floorY + 2000} stops={[[0, "#e8dcc0"], [1, "#d2c2a0"]]} z={-41} />
    <Part shape={roundRect(6000, 70, 0)} color="#b8432f" flat outline={0} y={floorY + 760} z={-40} />
    <Line pts={[[-3000, floorY + 725], [3000, floorY + 725]]} width={4} z={-39.9} />
    <Line pts={[[-3000, floorY + 795], [3000, floorY + 795]]} width={4} z={-39.9} />
    {/* corbel-arch doorways to the jungle */}
    {[-900, 900].map((x) => (
      <X key={x} x={x} y={floorY} z={-39}>
        <Part shape={poly([[-160, 0], [160, 0], [160, 380], [40, 620], [-40, 620], [-160, 380]])} color="#3f7a4a" flat outline={6} />
        <Part shape={blob([[-150, 0], [150, 0], [130, 200], [0, 260], [-130, 200]], 7)} color="#2f6a3a" flat outline={0} z={0.001} />
      </X>
    ))}
    {/* mural: a procession of figures and glyphs in Maya blue and red */}
    <X y={floorY + 400} z={-39}>
      <Part shape={roundRect(1100, 300, 8)} color="#e9dcc0" flat outline={4} />
      {[-420, -260, -100, 60, 220, 380].map((x, i) => (
        <X key={x} x={x} z={0.001}>
          <Part shape={roundRect(60, 120, 18)} color={["#3a9ac9", "#c0392b", "#d9a441"][i % 3]} flat outline={3} y={-30} />
          <Part shape={circle(32)} color="#c88a6a" flat outline={3} y={60} />
          <Part shape={blob([[-30, 80], [0, 140], [40, 100]], 5)} color="#3fa07a" flat outline={2.5} y={0} />
        </X>
      ))}
    </X>
    {throne ? (
      <X y={floorY} z={-20}>
        <Part shape={roundRect(520, 150, 10)} color="#cbbf9e" shade={0.22} y={75} />
        <Part shape={roundRect(470, 40, 14)} color="#e0a83a" shade={0.2} y={165} z={0.001} />
        {[-150, -60, 40, 130].map((x) => (
          <Part key={x} shape={circle(12)} color="#2a2228" flat outline={0} x={x} y={165} z={0.002} />
        ))}
        {[-200, 200].map((x) => (
          <Part key={x} shape={roundRect(40, 110, 8)} color="#b9ae98" shade={0.22} x={x} y={55} z={0.002} />
        ))}
      </X>
    ) : null}
    <Part shape={roundRect(6000, 1400, 0)} color="#c9b994" flat outline={0} y={floorY - 700} z={-35} />
    <Line pts={[[-3000, floorY], [3000, floorY]]} width={6} z={-34.9} />
    {children}
    {dim > 0 ? <Wash width={6000} height={4000} color="#140a10" alpha={dim} z={40} /> : null}
  </>
);

/** Xibalba, the underworld: dark cave, blue-grey rocks, a river, skull niches, red glow. */
export const Underworld: React.FC<{ floorY?: number; children?: React.ReactNode }> = ({ floorY = -460, children }) => (
  <>
    <Gradient w={6000} h={4000} y={floorY + 2000} stops={[[0, "#3a2030"], [1, "#0e0a14"]]} z={-41} />
    {[-1400, -700, 0, 700, 1400].map((x, i) => (
      <Part key={x} shape={blob([[x - 300, floorY + 1400], [x - 200, floorY + 700 + (i % 2) * 120], [x, floorY + 560], [x + 200, floorY + 720], [x + 300, floorY + 1400]], 8)} color="#2a2232" shade={0.2} z={-40 + i * 0.01} />
    ))}
    {[-1100, -400, 300, 1000].map((x, i) => (
      <Part key={x} shape={poly([[x - 60, floorY + 1200], [x + 60, floorY + 1200], [x, floorY + 820 - (i % 2) * 80]])} color="#3a3040" shade={0.2} z={-39} />
    ))}
    {[-800, -200, 500, 1100].map((x, i) => (
      <X key={x} x={x} y={floorY + 380 + (i % 2) * 90} z={-38}>
        <Part shape={roundRect(110, 120, 20)} color="#1a1420" flat outline={4} />
        <Part shape={circle(30)} color="#e8e0c8" shade={0.2} y={-6} z={0.001} />
        <Part shape={circle(7)} color="#211b20" flat outline={0} x={-10} y={-2} z={0.002} />
        <Part shape={circle(7)} color="#211b20" flat outline={0} x={10} y={-2} z={0.002} />
      </X>
    ))}
    <Glow x={0} y={floorY + 80} rx={1600} ry={300} color="#c0392b" alpha={0.25} additive z={-37} />
    <Part shape={roundRect(6000, 1400, 0)} color="#2a1e28" flat outline={0} y={floorY - 700} z={-35} />
    <Line pts={[[-3000, floorY], [3000, floorY]]} width={6} z={-34.9} />
    {children}
  </>
);

/** Plain warm paper backdrop for diagrams (numbers, calendars, comparisons). */
export const Paper: React.FC<{ color?: string; children?: React.ReactNode }> = ({ color = "#e9dcbc", children }) => (
  <>
    <Gradient w={6000} h={4000} stops={[[0, color], [1, "#d4c49c"]]} z={-41} />
    {Array.from({ length: 30 }, (_, i) => (
      <Part key={i} shape={circle(3 + (i % 4))} color="#c8b48a" flat outline={0} x={((i * 397) % 3600) - 1800} y={((i * 211) % 2000) - 1000} z={-40} />
    ))}
    {children}
  </>
);

/** Ceiba trees and huts for village shots. */
export const Village: React.FC<{ horizon?: number; mood?: JungleMood; children?: React.ReactNode }> = ({ horizon = -160, mood = "day", children }) => (
  <JungleSet mood={mood} horizon={horizon}>
    <X z={-28}>
      <Ceiba x={-900} y={horizon} h={760} />
      <MayaHut x={-420} y={horizon} w={260} />
      <MayaHut x={620} y={horizon} w={240} />
    </X>
    {children}
  </JungleSet>
);
