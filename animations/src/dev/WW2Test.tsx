import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Stage, X, Syringe, Ampoule, ChocolateStick, PillTube, LabFlask, Ephedra, Rifle, CoffeeCup } from "../kit";
import { Character, poses } from "../kit/character";
import {
  ZeroFighter, Warship, Bomber, Hangar, Windsock, SakuraTree, Petals, Kikumon, JapanMap, Ruins, MarketStall, ShopFront, WoodenSchool,
  WatchTower, Burst, Flak, ShojiWall, Tatami, LowTable, Sky, Ground,
} from "../kit/env";
import { PILOT, DOCTOR, UMEDA, GERMAN, KAMBARA_OLD, GENERAL, NAVY_OFFICER, GIRL, FATHER, CHEMIST, AIRCREW, SURVIVOR, DEALER, TEACHER, RESEARCHER } from "../episodes/spring1945/cast";

/** Contact sheet of the WWII Japan kit pieces (dev only). */
export const WW2Test: React.FC<{ page?: number }> = ({ page = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#cfe6f2" }}>
      <Stage camera={{ zoom: 1 }} light={{ dir: [-0.6, 0.8] }} vignette={0.1}>
        <Sky w={4000} h={3000} top="#8ec9ee" bottom="#e8f4f8" z={-40} />
        {page === 0 ? (
          <>
            <ZeroFighter x={-560} y={300} s={0.55} bomb />
            <Warship x={260} y={260} len={900} s={0.6} />
            <Warship x={760} y={100} len={600} kind="destroyer" s={0.6} hit={0.6} />
            <Bomber x={-600} y={40} s={0.5} />
            <Hangar x={-140} y={-80} s={0.6} />
            <Windsock x={180} y={-80} s={0.7} />
            <SakuraTree x={420} y={-500} h={420} s={0.8} />
            <Kikumon x={760} y={-300} r={110} />
            <Burst x={-760} y={-330} t={0.4} size={0.6} />
            <Flak x={0} y={-330} w={600} h={200} />
            <Petals w={1900} h={1000} n={20} z={20} />
            <WatchTower x={-380} y={-540} s={0.5} />
          </>
        ) : null}
        {page === 1 ? (
          <>
            <JapanMap x={-620} y={160} s={0.45} route={0.8} />
            <Ruins x={300} y={160} w={900} s={0.6} />
            <MarketStall x={-600} y={-480} s={0.7} />
            <ShopFront x={-150} y={-480} s={0.6} />
            <WoodenSchool x={500} y={-480} s={0.45} />
            <ShojiWall x={500} y={-60} w={600} h={300} s={0.8} z={-5} />
            <Tatami x={500} y={-60} w={700} h={200} s={0.8} z={-4} />
            <LowTable x={500} y={-200} s={0.6} />
            <Syringe x={-800} y={-100} s={1.2} fill={0.6} />
            <Ampoule x={-560} y={-200} s={1.2} glow={0.5} />
            <ChocolateStick x={-300} y={-120} s={0.8} wrap={0.5} />
            <PillTube x={-50} y={-200} />
            <LabFlask x={140} y={-220} />
            <Ephedra x={300} y={-220} s={0.6} />
            <Rifle x={-700} y={-300} s={0.7} bayonet />
            <CoffeeCup x={-60} y={-460} s={0.8} />
          </>
        ) : null}
        {page === 2 ? (
          <>
            <Ground w={4000} h={800} y={-150} color="#8db35e" z={-30} />
            {[PILOT(0), DOCTOR, UMEDA, GERMAN(0), KAMBARA_OLD, GENERAL(0), NAVY_OFFICER(0), GIRL(0), FATHER, CHEMIST, AIRCREW(0), SURVIVOR(1), DEALER, TEACHER, RESEARCHER].map((d, i) => (
              <Character key={i} {...d} x={-840 + (i % 8) * 240} y={i < 8 ? -40 : -470} s={0.7} look={0.5} expression={{ eyes: "open", mouth: "smile" }} pose={poses.idle(frame, i)} />
            ))}
          </>
        ) : null}
      </Stage>
    </AbsoluteFill>
  );
};
