import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, X, Part, Glow, roundRect, circle, ellipse, push, absT, ramp, QuestionMark, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  MoonGlobe, LunarSurface, LunarPoleMap, CraterSection, Vikram, ChangELander, NovaC, Starship, MoonBase, NationFlag, SpaceRock, MetalLump, Clock, Monitor, BalanceScale, Ring,
} from "../../kit/env";
import { sec, pop } from "../../kit/shot";
import { SpaceSet, Office, RuleBoard, WaterDrop, GoldBars } from "./sets";
import { SCIENTIST, VIEWER } from "./cast";
import { atHead } from "./frame";

// The answer (water + light, side by side), Vikram's first landing, the
// mystery mass still waiting, and the question for the viewer.

// 563.78 "So why is everyone racing to the Moon's south pole?"
export const WhyRaceShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = ramp(t, 563.5, 566.6, Easing.out(Easing.quad));
  const craft: [number, React.ReactNode][] = [
    [-2.3, <Vikram key="v" s={0.32} />],
    [-0.8, <ChangELander key="c" s={0.3} />],
    [0.8, <NovaC key="n" s={0.3} />],
    [2.3, <Starship key="s" h={480} tiles={false} />],
  ];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 1.0) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <MoonGlobe r={360} view={{ lon: 0, lat: -90 }} ice={1} pins={[{ lon: 0, lat: -89.9, r: 22 }]} z={-10} />
          {craft.map(([a, node], i) => {
            const d = interpolate(k, [0, 1], [1050, 520]);
            return (
              <X key={i} x={Math.cos(a) * d} y={Math.sin(a) * d - 80} rot={a + Math.PI / 2} z={-5}>
                {node}
              </X>
            );
          })}
        </SpaceSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 567.12 "Remember the rule? In space, water is worth more than gold."
export const RuleFinalShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.66, 0.7), y: -40 }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <SpaceSet>
          <RuleBoard x={-560} y={60} w={1100} h={640} glow={0.5} />
          <BalanceScale x={760} y={-380} tilt={-ramp(t, 569.2, 570.0, Easing.out(Easing.back(1.5)))} w={900} left={<WaterDrop y={100} s={0.9} />} right={<GoldBars s={0.75} />} z={-5} />
        </SpaceSet>
      </Stage>
      <Label text="IN SPACE," x={0.3} y={0.34} size={0.055} kind="ink" pin at={at(568.3)} />
      <Label text="WATER > GOLD" x={0.3} y={0.5} size={0.075} kind="ink" color="#2f6fd0" pin at={at(569.1)} />
    </AbsoluteFill>
  );
};

// 571.1 "And the south pole has ice that built up over billions of years."
export const IceBuiltShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.55, 0.6), y: -60 }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <SpaceSet>
          <CraterSection y={-120} sun={[-1750, 40]} ice={ramp(t, 571.4, 574.4)} z={-10} />
          <X x={760} y={500} z={-5}>
            <Clock r={120} speed={40} />
          </X>
        </SpaceSet>
      </Stage>
      <Label text="BILLIONS OF YEARS" x={0.08} y={0.1} size={0.045} kind="box" at={at(573.3)} />
    </AbsoluteFill>
  );
};

// 574.76 "It sits in craters where the Sun never shines,"
export const SideBySideShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.62, 0.68), y: -200 }} light={{ dir: [-0.6, 0.7] }} vignette={0.65}>
        <SpaceSet>
          <CraterSection y={-120} sun={[-1750, 40]} ice={1} z={-10} />
        </SpaceSet>
      </Stage>
      <Label text="SUN NEVER SHINES" x={0.5} y={0.1} size={0.055} kind="title" color="#8fe3ff" at={at(575.8)} />
    </AbsoluteFill>
  );
};

// 577.17 "right next to peaks where it almost never sets."
export const PeaksNextShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.5, 0.54), y: 0 }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <SpaceSet>
          <CraterSection y={-120} sun={[-1750, 40]} rays={1} ice={1} peaks={ramp(t, 577.4, 578.2)} z={-10} />
        </SpaceSet>
      </Stage>
      <Label text="SUN ALMOST NEVER SETS" x={0.5} y={0.86} size={0.05} kind="title" color="#ffd84a" at={at(578.4)} />
    </AbsoluteFill>
  );
};

// 580.39 "Remember Vikram, landing upright in 2023?"
export const RememberVikramShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.92), y: -160 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <LunarSurface horizon={-40} sun={[-1500, 60]} seed={13} rocks={8} craters={4} earth={[900, 380, 80]}>
          <Vikram x={0} y={-420} s={1.05} z={-6} />
          <NationFlag kind="india" x={-560} y={-440} w={200} pole={420} z={-6.5} />
        </LunarSurface>
      </Stage>
      <Label text="VIKRAM · 2023" x={0.08} y={0.1} size={0.045} kind="box" at={at(580.8)} />
    </AbsoluteFill>
  );
};

// 583.69 "It was the first to land near the south pole."
export const FirstShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.03) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <MoonGlobe r={400} view={{ lon: 20, lat: -70 }} pins={[{ lon: 32.3, lat: -69.4, color: "#ff9933", r: 22 }]} z={-10} />
          <X x={420} y={260} s={pop(t, 584.1)} z={-5}>
            <Glow rx={180} color="#ffd84a" alpha={0.5} additive />
            <Part shape={circle(110)} color="#f2c23a" shade={0.3} />
          </X>
        </SpaceSet>
      </Stage>
      <Label text="1ST" x={0.72} y={0.26} size={0.08} kind="ink" pin at={at(584.2)} />
    </AbsoluteFill>
  );
};

// 586.33 "It won't be the last."
export const NotLastShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.6, 0.64), y: -260 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <LunarSurface horizon={-120} sun={[-1900, 0]} seed={191} rocks={3} craters={2} w={6000}>
          <Vikram x={-200} y={-720} s={0.8} z={-6} />
          <X x={-1400} y={-700} s={0.75 * pop(t, 586.4)} z={-6}>
            <ChangELander />
          </X>
          <X x={700} y={-700} s={0.8 * pop(t, 586.6)} z={-6}>
            <NovaC />
          </X>
          <X x={1600} y={-720} s={pop(t, 586.8)} z={-7}>
            <Starship h={1100} tiles={false} />
          </X>
          <X x={-2300} y={-720} s={0.55 * pop(t, 587.0)} z={-7}>
            <MoonBase lights={0.8} masts={2} flag="china" />
          </X>
        </LunarSurface>
      </Stage>
    </AbsoluteFill>
  );
};

// 587.9 "And deep under that giant crater, the mystery mass is still waiting."
export const MassWaitsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.12) }} light={{ dir: [-0.6, 0.7] }} vignette={0.65}>
        <SpaceSet>
          <MoonGlobe r={420} view={{ lon: -169, lat: -53 }} basinTint={1} basin={1} xray={ramp(t, 589.6, 590.4)} grid={ramp(t, 589.6, 590.4) * 0.6} mass={ramp(t, 590.2, 590.9)} z={-10} />
        </SpaceSet>
      </Stage>
      <Label text="STILL WAITING" x={0.5} y={0.88} size={0.06} kind="title" at={at(591.2)} />
    </AbsoluteFill>
  );
};

// 592.48 "Metal from an ancient space rock?"
export const MetalOptionShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.03) }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <SpaceSet seed={9}>
          <SpaceRock x={-260} y={0} size={280} seed={3} rot={frame * 0.01} z={-6} />
          <X x={300} y={0} z={-5}>
            <Glow rx={300} color="#ffb04a" alpha={0.35} additive />
            <MetalLump w={420} h={260} z={0.001} />
          </X>
        </SpaceSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 594.38 "Or something else?"
export const SomethingElseShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <SpaceSet seed={9}>
          <X z={-6}>
            <Glow rx={420} color="#b48aff" alpha={0.35} additive />
            <Part shape={circle(160)} color="#3a3456" flat outline={6} />
          </X>
          <QuestionMark x={0} y={-40} s={1.3 * pop(t, 594.5)} z={-5} />
        </SpaceSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 595.61 "We still don't know."
export const DontKnowShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const cam = { zoom: 1.0, y: 150 };
  const a = atHead(cam, 0.14, 0.5, 1.75);
  const b = atHead(cam, 0.86, 0.5, 1.75);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.98, 1.04), y: cam.y }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <Office floor={-420}>
          <X x={0} y={-262} z={-24}>
            <Part shape={roundRect(1380, 40, 10)} color="#8a6a4a" shade={0.2} />
            <Part shape={roundRect(1320, 400, 10)} color="#6e5236" shade={0.2} y={-220} z={-0.001} />
          </X>
          <X x={0} y={120} z={-22}>
            <Monitor w={900} h={540} screen="#0e1a2c">
              <MoonGlobe r={225} view={{ lon: -169, lat: -53 }} xray={1} mass={1} glow={0} craters={20} />
            </Monitor>
          </X>
          <Character {...SCIENTIST(0)} x={a.x} y={a.y} s={1.75} facing={1} look={0.5} expression={{ eyes: "half", mouth: "wavy", brows: 0.4 }} pose={poses.shrug(t - 595.6)} z={-10} />
          <Character {...SCIENTIST(1)} x={b.x} y={b.y} s={1.75} facing={-1} look={0.5} expression={{ eyes: "half", mouth: "wavy", brows: 0.4 }} pose={poses.shrug(t - 595.8)} z={-10} />
        </Office>
      </Stage>
    </AbsoluteFill>
  );
};

// 597.39 "So, if you could build the first base on the Moon, where would you put it?"
export const BuildFirstShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.82, 0.9), y: 40 }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <SpaceSet>
          <MoonGlobe r={380} x={380} y={-20} view={{ lon: (t - 597) * 12, lat: -30 }} z={-10} />
          <X x={380} y={356} s={0.2 * pop(t, 598.6)} z={-9}>
            <MoonBase lights={1} masts={2} />
          </X>
          <Character {...VIEWER} x={-600} y={-560} s={1.85} facing={1} look={0.5} expression={{ eyes: "open", mouth: "smile", gaze: [0.7, 0.3], brows: 0.15 }} pose={t > 599.9 ? poses.think : poses.point(frame)} z={-5} />
        </SpaceSet>
      </Stage>
      <Label text="WHERE WOULD YOU BUILD?" x={0.5} y={0.1} size={0.055} kind="title" at={at(600.1)} />
    </AbsoluteFill>
  );
};

// 601.2 "At the south pole, or somewhere else?"
export const ChooseShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.0) }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <SpaceSet>
          <MoonGlobe r={330} x={-470} y={20} view={{ lon: 0, lat: -90 }} ice={1} pins={[{ lon: 0, lat: -89.9, r: 20 }]} z={-10} />
          <MoonGlobe r={330} x={470} y={20} view={{ lon: 0, lat: 0 }} pins={t > 602.3 ? [{ lon: -20, lat: 10, color: "#ffd84a", r: 20 }] : []} z={-10} />
          <Part shape={roundRect(10, 800, 5)} color="#ffffff" flat outline={0} opacity={0.3} z={-11} />
        </SpaceSet>
      </Stage>
      <Label text="SOUTH POLE" x={0.26} y={0.88} size={0.05} kind="box" at={at(601.4)} />
      <Label text="SOMEWHERE ELSE?" x={0.74} y={0.88} size={0.05} kind="box" color="#ffd84a" at={at(602.4)} />
    </AbsoluteFill>
  );
};

// 603.55 "Tell me in the comments."
export const CommentsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.96), y: 40 }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <SpaceSet>
          <MoonGlobe r={260} x={760} y={340} craters={30} z={-12} />
          <X x={260} y={160} s={pop(t, 603.7)} z={-6}>
            <Part shape={roundRect(860, 320, 60)} color="#f6f5f8" shade={0.2} />
            <Part shape={ellipse(70, 60)} color="#f6f5f8" flat outline={0} x={-300} y={-150} rot={0.6} z={-0.001} />
          </X>
          <Character {...VIEWER} x={-600} y={-640} s={1.85} facing={1} look={0.4} expression={{ eyes: "happy", mouth: "grin", blush: true }} pose={poses.armsUp(frame)} z={-5} />
        </SpaceSet>
      </Stage>
      <Label text="TELL ME IN THE COMMENTS" x={0.63} y={0.35} size={0.045} kind="ink" pin at={at(603.8)} />
    </AbsoluteFill>
  );
};

export { LunarPoleMap, Ring };
