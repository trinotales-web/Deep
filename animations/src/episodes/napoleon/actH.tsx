import React from "react";
import { AbsoluteFill, useCurrentFrame, Easing } from "remotion";
import { Stage, DepthStage, X, Part, Line, Glow, roundRect, roundPoly, circle, ellipse, blob, push, absT, ramp, QuestionMark, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import { EURO, EMPIRE_1812, BattleIcon, Painting, Steed, ShipOfLine, FieldGun, DeadTree, Lightbulb, Sabre, Candle, Microscope, Sea, Sky, IslandRock } from "../../kit/env";
import { sec, pop, SpeechBubble } from "../../kit/shot";
import { LabSet, StudySet, CorsicaSet, MapBack, RuleBoard, AlpsRoad, BattlefieldSet, IslandSea, LongwoodRoom } from "./sets";
import { NAPOLEON, NAPOLEON_GREY, NAPOLEON_OLD, NAPOLEON_BOY, YOU, CARLO, SCIENTIST, DOCTOR, ROYALIST, VIEWER } from "./cast";
import { atHead } from "../moon/frame";
import { HeldMusket, SHOULDER_ARMS, AIM, aimPose, shoulderPose, openArms, Pulse, eu } from "./util";
import { SoldierLine } from "./actA";

// Act H: the arsenic theory and the 2008 hair tests, stomach cancer (like his
// father), the rule one last time, 60 battles / 7 lost, and the question.

const L = { dir: [-0.6, 0.7] as [number, number] };

/** Glass bottle with a skull label (poison). */
const PoisonBottle: React.FC<{ x?: number; y?: number; s?: number; z?: number }> = ({ x = 0, y = 0, s = 1, z = 0 }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={roundPoly([[-110, 0], [110, 0], [110, 260], [50, 330], [50, 420], [-50, 420], [-50, 330], [-110, 260]], [30, 30, 40, 10, 6, 6, 10, 40])} color="#4f9a6a" shade={0.25} />
    <Part shape={roundRect(120, 60, 12)} color="#8a5a32" shade={0.2} y={440} z={0.001} />
    <X y={140} z={0.002}>
      <Part shape={roundRect(170, 150, 14)} color="#f2ead8" flat outline={4} />
      <Part shape={circle(40)} color="#f6f5f8" flat outline={4} y={14} z={0.001} />
      <Part shape={circle(10)} color="#211b20" flat outline={0} x={-14} y={18} z={0.002} />
      <Part shape={circle(10)} color="#211b20" flat outline={0} x={14} y={18} z={0.002} />
      <Line pts={[[-40, -46], [40, -30]]} width={8} z={0.001} />
      <Line pts={[[-40, -30], [40, -46]]} width={8} z={0.001} />
    </X>
  </X>
);

// 565.97 "For years, people said he was poisoned with arsenic."
export const PoisonShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const cam = { zoom: 1, y: 40 };
  const a = atHead(cam, 0.22, 0.46, 1.5);
  const b = atHead(cam, 0.78, 0.46, 1.5);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: cam.y }} light={L} vignette={0.55}>
        <StudySet floor={-560} night map={false}>
          <Character {...ROYALIST(0)} hat={null} x={a.x} y={a.y} s={1.5} facing={1} look={0.6} expression={{ eyes: "squint", mouth: "smirk" }} pose={poses.talk(frame, 1)} talking z={-12} />
          <Character {...ROYALIST(3)} hat={null} x={b.x} y={b.y} s={1.5} facing={-1} look={0.6} expression={{ eyes: "wide", mouth: "o" }} pose={poses.idle(frame, 2)} z={-12} />
          <PoisonBottle x={0} y={-380} s={1.1 * pop(t, 567.6)} z={-10} />
        </StudySet>
      </Stage>
      <Label text="POISONED?" x={0.5} y={0.1} size={0.08} kind="title" at={at(567.7)} />
      <Label text="ARSENIC" x={0.5} y={0.86} size={0.06} kind="stamp" at={at(568.4)} />
    </AbsoluteFill>
  );
};

/** Test tube rack with hair strands. `labels` appear in order. */
const HairTube: React.FC<{ x: number; y?: number; s?: number; z?: number; level?: number; color?: string }> = ({ x, y = 0, s = 1, z = 0, level = 0, color = "#3a2a22" }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={roundRect(110, 420, 54)} color="#dfeef6" shade={0.15} opacity={0.85} y={210} />
    <Part shape={roundRect(90, Math.max(20, 360 * level), 44)} color="#9ad070" flat outline={0} opacity={0.7} y={20 + (360 * level) / 2} z={0.001} />
    {[-14, 0, 14].map((hx, i) => (
      <Line key={i} pts={[[hx, 120], [hx + 10, 220], [hx - 6, 320]]} smooth width={5} color={color} z={0.002} />
    ))}
    <Part shape={roundRect(130, 30, 10)} color="#9aa0aa" shade={0.2} y={420} z={0.003} />
  </X>
);

// 569.38 "In 2008, scientists in Italy tested his hair from childhood,"
export const HairLabShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const cam = { zoom: 1, y: 40 };
  const a = atHead(cam, 0.24, 0.42, 1.5);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02), y: cam.y }} light={L} vignette={0.5}>
        <LabSet floor={-560}>
          <Character {...SCIENTIST(2)} x={a.x} y={a.y} s={1.5} facing={1} look={0.6} expression={{ eyes: "open", mouth: "smile", gaze: [0.6, -0.3] }} pose={poses.point(frame)} z={-12} />
          <Microscope x={260} y={-560} s={1.0} z={-11} />
          <HairTube x={640} y={-560} s={0.9 * pop(t, 572.7)} z={-10} color="#3a2a22" />
        </LabSet>
      </Stage>
      <Label text="2008 · ITALY" x={0.5} y={0.1} size={0.08} kind="title" at={at(569.5)} />
      <Label text="CHILDHOOD" x={0.83} y={0.85} size={0.042} kind="box" at={at(572.7)} pin />
    </AbsoluteFill>
  );
};

// 573.62 "from exile, and from the day he died."
export const HairSamplesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={L} vignette={0.5}>
        <Part shape={roundRect(4000, 3000, 0)} color="#24304a" flat outline={0} z={-30} />
        <Part shape={roundRect(1600, 60, 14)} color="#8a5a32" shade={0.2} y={-330} z={-12} />
        <HairTube x={-500} y={-330} z={-10} />
        <HairTube x={0} y={-330} s={pop(t, 573.8)} z={-10} />
        <HairTube x={500} y={-330} s={pop(t, 575.2)} z={-10} />
      </Stage>
      <Label text="CHILDHOOD" x={0.24} y={0.86} size={0.042} kind="box" at={at(573.6)} pin />
      <Label text="EXILE" x={0.5} y={0.86} size={0.042} kind="box" at={at(573.8)} pin />
      <Label text="DAY HE DIED" x={0.76} y={0.86} size={0.042} kind="box" at={at(575.2)} pin />
    </AbsoluteFill>
  );
};

/** Bold vertical bar with an outline (grows with k). */
const BigBar: React.FC<{ x: number; y: number; h: number; k: number; color: string; z?: number }> = ({ x, y, h, k, color, z = 0 }) => {
  const hh = Math.max(14, h * Math.max(0, Math.min(1, k)));
  return (
    <X x={x} y={y} z={z}>
      <Part shape={roundRect(220, hh, 16)} color={color} shade={0.2} y={hh / 2} />
    </X>
  );
};

// 576.11 "The arsenic levels were about 100 times higher than in people today."
export const HundredTimesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.04) }} light={L} vignette={0.45}>
        <Part shape={roundRect(4000, 3000, 0)} color="#24304a" flat outline={0} z={-30} />
        <Part shape={roundRect(1400, 24, 8)} color="#e8e6ee" flat outline={4} y={-380} z={-12} />
        <BigBar x={-300} y={-370} h={760} k={ramp(t, 576.6, 577.9, Easing.out(Easing.cubic))} color="#9ad070" z={-10} />
        <BigBar x={300} y={-370} h={8} k={ramp(t, 578.5, 578.9)} color="#7ab0d8" z={-10} />
      </Stage>
      <Label text="NAPOLEON" x={0.34} y={0.86} size={0.045} kind="box" at={at(576.6)} pin />
      <Label text="PEOPLE TODAY" x={0.66} y={0.86} size={0.045} kind="box" at={at(578.7)} pin />
      <Label text="×100" x={0.7} y={0.3} size={0.13} kind="stamp" rotate={-6} at={at(577.4)} pin />
    </AbsoluteFill>
  );
};

// 579.75 "But they were high his whole life."
export const WholeLifeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.04) }} light={L} vignette={0.45}>
        <Part shape={roundRect(4000, 3000, 0)} color="#24304a" flat outline={0} z={-30} />
        <Part shape={roundRect(1600, 24, 8)} color="#e8e6ee" flat outline={4} y={-380} z={-12} />
        {[-500, 0, 500].map((x, i) => (
          <BigBar key={i} x={x} y={-370} h={700 + i * 20} k={ramp(t, 579.8 + i * 0.25, 580.6 + i * 0.25)} color="#9ad070" z={-10} />
        ))}
        <Line pts={[[-700, 360], [700, 380]]} width={10} color="#ffe27a" z={-9} opacity={ramp(t, 580.4, 580.9)} />
      </Stage>
      <Label text="CHILDHOOD" x={0.24} y={0.86} size={0.042} kind="box" at={at(579.8)} pin />
      <Label text="EXILE" x={0.5} y={0.86} size={0.042} kind="box" at={at(580.0)} pin />
      <Label text="DEATH" x={0.76} y={0.86} size={0.042} kind="box" at={at(580.3)} pin />
      <Label text="HIGH HIS WHOLE LIFE" x={0.5} y={0.1} size={0.065} kind="title" at={at(580.5)} />
    </AbsoluteFill>
  );
};

// 581.63 "Back then, arsenic was all around."
export const ArsenicAroundShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02), y: 40 }} light={L} vignette={0.5}>
        <Part shape={roundRect(4000, 3000, 0)} color="#3f9a6a" flat outline={0} z={-30} />
        {Array.from({ length: 40 }, (_, i) => (
          <Part key={i} shape={blob([[0, 40], [24, 0], [0, -40], [-24, 0]], 6)} color="#5ab07a" flat outline={0} x={-1000 + (i % 8) * 280 + (Math.floor(i / 8) % 2) * 140} y={-560 + Math.floor(i / 8) * 260} z={-29} />
        ))}
        <Part shape={roundRect(4000, 500, 0)} color="#8a5a36" flat outline={0} y={-700} z={-28} />
        <Part shape={roundRect(1300, 50, 10)} color="#6a4424" shade={0.2} y={-420} z={-12} />
        {[-420, -160, 120, 380].map((x, i) => (
          <X key={i} x={x} y={-400} s={0.42 + (i % 2) * 0.08} z={-10}>
            <PoisonBottle />
          </X>
        ))}
        <Candle x={600} y={-400} s={1.3} z={-10} />
      </Stage>
      <Label text="GREEN WALLPAPER" x={0.06} y={0.09} size={0.042} kind="box" at={at(582.4)} />
      <Label text="MEDICINES" x={0.94} y={0.09} size={0.042} kind="box" at={at(582.9)} />
      <Label text="ARSENIC WAS ALL AROUND" x={0.5} y={0.88} size={0.05} kind="box" at={at(583.1)} />
    </AbsoluteFill>
  );
};

/** Simple stomach diagram on a card. */
const StomachCard: React.FC<{ x?: number; y?: number; s?: number; z?: number; mark?: number }> = ({ x = 0, y = 0, s = 1, z = 0, mark = 1 }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={roundRect(520, 620, 20)} color="#f2ead8" shade={0.12} />
    <Part shape={blob([[-60, 220], [20, 200], [40, 100], [140, 40], [170, -80], [80, -200], [-80, -160], [-120, -40], [-90, 100], [-110, 200]], 10)} color="#e89a9a" shade={0.24} z={0.001} />
    <Line pts={[[-90, 220], [-80, 300]]} width={22} color="#e89a9a" z={0.0005} />
    <Part shape={circle(46)} color="#8a2a35" flat outline={4} x={70} y={-60} opacity={mark} z={0.002} />
  </X>
);

// 584.08 "Most experts think he died of stomach cancer."
export const CancerShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const cam = { zoom: 1 };
  const a = atHead(cam, 0.28, 0.44, 1.6);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={L} vignette={0.5} bgBlur={3} bg={<StudySet floor={-700} map={false} />}>
        <Character {...DOCTOR} x={a.x} y={a.y} s={1.6} facing={1} look={0.6} expression={{ eyes: "open", mouth: "flat" }} pose={poses.point(frame)} talking z={-6} />
        <StomachCard x={420} y={60} s={pop(t, 584.4)} mark={ramp(t, 585.4, 585.9)} z={-5} />
      </DepthStage>
      <Label text="STOMACH CANCER" x={0.5} y={0.1} size={0.07} kind="title" at={at(585.6)} />
    </AbsoluteFill>
  );
};

/** Portrait in a gold frame with a character bust. */
const Portrait: React.FC<{ x: number; y?: number; s?: number; z?: number; who: React.ComponentProps<typeof Character>; canvas?: string }> = ({ x, y = 0, s = 1, z = 0, who, canvas = "#cfd8e0" }) => (
  <Painting x={x} y={y} w={420} h={540} s={s} canvas={canvas} plate={false} z={z}>
    <Character {...who} y={-330} s={0.95} look={0.3} shadow={false} />
  </Painting>
);

// 586.70 "Remember his father?"
export const FatherAgainShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.1) }} light={L} vignette={0.6}>
        <Part shape={roundRect(4000, 3000, 0)} color="#5a2a35" flat outline={0} z={-30} />
        <Portrait x={0} y={20} s={1.2} who={{ ...CARLO, expression: { eyes: "open", mouth: "smile" }, pose: poses.idle(frame, 1) }} z={-10} />
      </Stage>
    </AbsoluteFill>
  );
};

// 588.02 "The same disease."
export const SameDiseaseShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.96) }} light={L} vignette={0.6}>
        <Part shape={roundRect(4000, 3000, 0)} color="#5a2a35" flat outline={0} z={-30} />
        <Portrait x={-560} y={40} who={{ ...CARLO, expression: { eyes: "half", mouth: "flat" }, pose: poses.idle(frame, 1) }} z={-10} />
        <Portrait x={560} y={40} who={{ ...NAPOLEON_OLD, expression: { eyes: "half", mouth: "flat" }, pose: poses.idle(frame, 2) }} z={-10} />
        <StomachCard x={0} y={40} s={0.55 * pop(t, 588.4)} z={-9} />
      </Stage>
      <Label text="FATHER · 1785" x={0.21} y={0.86} size={0.042} kind="box" at={at(588.0)} pin />
      <Label text="NAPOLEON · 1821" x={0.79} y={0.86} size={0.042} kind="box" at={at(588.0)} pin />
      <Label text="THE SAME DISEASE" x={0.5} y={0.1} size={0.07} kind="title" at={at(588.5)} />
    </AbsoluteFill>
  );
};

// 589.92 "So how did a lonely boy from Corsica conquer most of Europe?"
export const LonelyBoyShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = ramp(t, 592.3, 593.4);
  const tint = Object.fromEntries(EMPIRE_1812.map((c) => [c, c === "France" ? "#3b62b8" : "#8aa8de"]));
  const corsica = eu([9.1, 42.2]);
  const zoom = 0.9 + 0.8 * (1 - ramp(t, 589.8, 592.4));
  const c = eu([12, 48]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, x: corsica[0] + (c[0] - corsica[0]) * (1 - (zoom - 0.9) / 0.8), y: corsica[1] + (c[1] - corsica[1]) * (1 - (zoom - 0.9) / 0.8) }} light={L} vignette={0.45}>
        <MapBack islands={["corsica"]} tint={tint} tintK={k * 0.85} />
        <X x={corsica[0]} y={corsica[1] - 40} z={0.3}>
          <Character {...NAPOLEON_BOY} s={0.35} facing={1} look={0.5} expression={{ eyes: "sad", mouth: "flat", gaze: [0.6, 0.6] }} pose={poses.idle(frame, 1)} />
        </X>
      </Stage>
    </AbsoluteFill>
  );
};

// 593.96 "Remember the rule?"
export const RuleFinalShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.25, 1.35), y: 120 }} light={L} vignette={0.5}>
        <StudySet floor={-600} map={false}>
          <RuleBoard x={0} y={120} s={1} z={-20} />
        </StudySet>
      </Stage>
      <Label text="BE FASTER" x={0.5} y={0.4} size={0.1} kind="hand" color="#ffe27a" at={at(594.0)} pin />
    </AbsoluteFill>
  );
};

// 595.10 "He was faster than everyone else."
export const FasterFinalShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const x = -900 + (t - 594.9) * 900;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.9), x: x * 0.6, y: 120 }} light={L} vignette={0.5}>
        <BattlefieldSet floor={-460} sun={0.6}>
          {[0, 1, 2].map((i) => (
            <Line key={i} pts={[[x - 380 - i * 40, -140 + i * 80], [x - 760 - i * 80, -140 + i * 80]]} width={10} color="#ffffff" opacity={0.8} z={-11} />
          ))}
          <Steed x={x} y={-470} s={0.9} walk={2.2} color="#f2efe9" mane="#c9c4cc" cloth="#2c4486">
            <Character {...NAPOLEON} outfit={{ ...NAPOLEON.outfit, cape: "#8e8c96", capeWind: 0.8 }} s={0.62} facing={1} look={0.6} expression={{ eyes: "happy", mouth: "grin" }} pose={{ ...poses.sit(frame), armF: [1.4, 0.2], handF: "point" }} />
          </Steed>
        </BattlefieldSet>
      </Stage>
    </AbsoluteFill>
  );
};

/** White icon card with a coloured rim. */
const Card: React.FC<{ x?: number; y?: number; s?: number; z?: number; color?: string; children?: React.ReactNode }> = ({ x = 0, y = 0, s = 1, z = 0, color = "#2c4486", children }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={roundRect(420, 460, 40)} color={color} shade={0.2} />
    <Part shape={roundRect(370, 410, 30)} color="#f6f2ea" flat outline={4} z={0.001} />
    <X z={0.002}>{children}</X>
  </X>
);

/** Big cartoon eye icon. */
const EyeIcon: React.FC<{ y?: number; s?: number }> = ({ y = 0, s = 1 }) => (
  <X y={y} s={s}>
    <Part shape={blob([[-150, 0], [-70, 70], [0, 86], [70, 70], [150, 0], [70, -70], [0, -86], [-70, -70]], 8)} color="#ffffff" shade={0.12} />
    <Part shape={circle(56)} color="#3f7ac0" flat outline={4} z={0.001} />
    <Part shape={circle(26)} color="#211b20" flat outline={0} z={0.002} />
    <Part shape={circle(10)} color="#ffffff" flat outline={0} x={14} y={14} z={0.003} />
  </X>
);

/** Boot icon. */
const BootIcon: React.FC<{ y?: number; s?: number }> = ({ y = 0, s = 1 }) => (
  <X y={y} s={s}>
    <Part shape={roundPoly([[-50, 160], [30, 160], [30, 40], [110, 30], [120, -10], [-60, -10]], [10, 10, 20, 20, 10, 10])} color="#2a2228" shade={0.25} />
  </X>
);

// 596.99 "Faster to see a chance, faster to march, faster to strike."
export const SeeMarchStrikeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.04) }} light={L} vignette={0.45}>
        <Part shape={roundRect(4000, 3000, 0)} color="#2c3a5e" flat outline={0} z={-30} />
        <Card x={-560} y={40} s={pop(t, 597.5)} color="#e2b23c" z={-10}>
          <EyeIcon y={0} s={1.2} />
        </Card>
        <Card x={0} y={40} s={pop(t, 598.95)} color="#3f8a5a" z={-10}>
          <BootIcon y={-90} />
        </Card>
        <Card x={560} y={40} s={pop(t, 600.1)} color="#c8262f" z={-10}>
          <X rot={-0.6} y={-150} x={-40} s={0.8}>
            <Sabre />
          </X>
        </Card>
      </Stage>
      <Label text="SEE A CHANCE" x={0.21} y={0.78} size={0.045} kind="box" at={at(597.5)} pin />
      <Label text="MARCH" x={0.5} y={0.78} size={0.045} kind="box" at={at(599.0)} pin />
      <Label text="STRIKE" x={0.79} y={0.78} size={0.045} kind="box" at={at(600.15)} pin />
    </AbsoluteFill>
  );
};

/** Grid of 60 battle icons, 7 of them marked lost. */
const Tally: React.FC<{ t: number; t0: number; lostAt: number }> = ({ t, t0, lostAt }) => {
  const LOST = new Set([7, 18, 26, 33, 44, 51, 59]);
  return (
    <>
      {Array.from({ length: 60 }, (_, i) => {
        const col = i % 12;
        const row = Math.floor(i / 12);
        const lost = LOST.has(i) && t > lostAt + [...LOST].indexOf(i) * 0.08;
        return (
          <X key={i} x={-880 + col * 160} y={300 - row * 150} s={0.9 * pop(t, t0 + i * 0.022)} z={-10}>
            <BattleIcon lost={lost} />
          </X>
        );
      })}
    </>
  );
};

// 601.12 "One historian counts about 60 battles in his career."
export const BattlesTallyShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.94), y: -40 }} light={L} vignette={0.45}>
        <Part shape={roundRect(4000, 3000, 0)} color="#2c3a5e" flat outline={0} z={-30} />
        <Tally t={t} t0={601.3} lostAt={999} />
      </Stage>
      <Label text="~60 BATTLES" x={0.5} y={0.88} size={0.07} kind="title" at={at(602.5)} />
    </AbsoluteFill>
  );
};

// 604.34 "He lost only seven."
export const LostSevenShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.94, 0.98), y: -40 }} light={L} vignette={0.45}>
        <Part shape={roundRect(4000, 3000, 0)} color="#2c3a5e" flat outline={0} z={-30} />
        <Tally t={t + 10} t0={0} lostAt={604.7 + 10} />
      </Stage>
      <Label text="LOST ONLY 7" x={0.5} y={0.88} size={0.07} kind="stamp" at={at(605.0)} />
    </AbsoluteFill>
  );
};

/** Framed vignette with a mini scene (children in canvas space). */
const Vignette: React.FC<{ x: number; s?: number; z?: number; bg: string; children?: React.ReactNode }> = ({ x, s = 1, z = 0, bg, children }) => (
  <Painting x={x} y={40} w={460} h={560} s={s} canvas={bg} plate={false} z={z}>
    {children}
  </Painting>
);

// 606.02 "But when the sea, the mud, or the endless Russian land slowed him down,"
export const SeaMudLandShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.92, 0.96) }} light={L} vignette={0.5}>
        <Part shape={roundRect(4000, 3000, 0)} color="#5a2a35" flat outline={0} z={-30} />
        <X s={pop(t, 606.37)} x={-620} z={-10}>
          <Vignette x={0} bg="#8fc2e0">
            <Part shape={roundRect(460, 220, 0)} color="#2f7ab0" flat outline={0} y={-170} z={0.001} />
            <ShipOfLine navy="fr" x={0} y={-100} s={0.22} burn={0.8} seed={2} z={0.01} />
          </Vignette>
        </X>
        <X s={pop(t, 607.08)} x={0} z={-10}>
          <Vignette x={0} bg="#9aa0aa">
            <Part shape={roundRect(460, 260, 0)} color="#6a5a42" flat outline={0} y={-150} z={0.001} />
            <FieldGun x={-20} y={-180} s={0.45} rot={0.12} z={0.01} />
          </Vignette>
        </X>
        <X s={pop(t, 608.3)} x={620} z={-10}>
          <Vignette x={0} bg="#c8d0dc">
            <Part shape={roundRect(460, 260, 0)} color="#f2f5fa" flat outline={0} y={-150} z={0.001} />
            <DeadTree x={-80} y={-200} h={300} snow z={0.01} />
            <DeadTree x={110} y={-180} h={220} seed={3} snow z={0.01} />
          </Vignette>
        </X>
      </Stage>
      <Label text="THE SEA" x={0.18} y={0.86} size={0.045} kind="box" at={at(606.4)} pin />
      <Label text="THE MUD" x={0.5} y={0.86} size={0.045} kind="box" at={at(607.1)} pin />
      <Label text="RUSSIA" x={0.82} y={0.86} size={0.045} kind="box" at={at(608.3)} pin />
    </AbsoluteFill>
  );
};

// 609.94 "he lost everything."
export const LostEverythingShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.8, 0.86), y: 120 }} light={L} vignette={0.65}>
        <Sky w={6000} h={4000} y={900} top="#4a3a5a" bottom="#f29a6a" z={-60} />
        <Sea w={6000} h={2000} y={-700} color="#3a5a8a" z={-55} />
        <Part shape={blob([[-2400, -200], [-1000, -160], [-300, -300], [-200, -1400], [-2400, -1400]], 10)} color="#5a4a4a" shade={0.25} z={-30} />
        <Character {...NAPOLEON_GREY} x={-520} y={-250} s={0.9} facing={1} look={0.7} expression={{ eyes: "sad", mouth: "flat", gaze: [0.8, 0], eyebags: true }} pose={poses.idle(frame, 3)} z={-20} />
      </Stage>
    </AbsoluteFill>
  );
};

// 611.73 "So imagine you're that soldier on the road near Grenoble."
export const ImagineAgainShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.86, 0.92), x: 60, y: 60 }} light={L} vignette={0.5}>
        <AlpsRoad floor={-460}>
          <SoldierLine n={3} x0={260} dx={250} y={-380} s={0.86} z={-14} aim={1} />
          <Character {...YOU} x={-520} y={-500} s={1.3} facing={1} look={0.55} expression={{ eyes: "wide", mouth: "flat", brows: 0.4 }} pose={aimPose(frame, 1)} holdF={<HeldMusket arm={AIM} dir={0.02} />} z={-6} />
          <Character {...NAPOLEON_GREY} x={1300} y={-300} s={0.7} facing={-1} look={0.5} expression={{ eyes: "open", mouth: "flat" }} pose={openArms(1, frame)} z={-20} />
        </AlpsRoad>
      </Stage>
      <Label text="MARCH 7, 1815" x={0.06} y={0.09} size={0.045} kind="box" at={at(612.0)} />
    </AbsoluteFill>
  );
};

// 614.95 "Do you follow your orders?"
export const FollowOrdersShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const cam = { zoom: 1 };
  const a = atHead(cam, 0.4, 0.5, 1.8);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.08) }} light={L} vignette={0.65} bgBlur={3} bg={<AlpsRoad floor={-800} />}>
        <Character {...YOU} x={a.x} y={a.y} s={1.8} facing={1} look={0.5 + Math.sin(frame * 0.3) * 0.2} expression={{ eyes: "wide", mouth: "wavy", brows: 0.8, sweat: true }} pose={aimPose(frame, 1)} holdF={<HeldMusket arm={AIM} dir={0.02} />} z={-6} />
        <Pulse t={t} bpm={150} />
      </DepthStage>
    </AbsoluteFill>
  );
};

// 616.40 "Or do you join him?"
export const JoinHimShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const cam = { zoom: 1 };
  const a = atHead(cam, 0.55, 0.46, 1.9);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={L} vignette={0.55} bgBlur={3} bg={<AlpsRoad floor={-800} />}>
        <Character {...NAPOLEON_GREY} outfit={{ ...NAPOLEON_GREY.outfit, shirt: "#2c4486", buttons: null }} x={a.x} y={a.y} s={1.9} facing={-1} look={0.2} expression={{ eyes: "happy", mouth: "smile" }} pose={openArms(1, frame)} z={-6} />
      </DepthStage>
    </AbsoluteFill>
  );
};

// 617.61 "Tell me in the comments."
export const CommentsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const cam = { zoom: 1 };
  const a = atHead(cam, 0.5, 0.5, 1.6);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.04) }} light={L} vignette={0.45}>
        <Part shape={roundRect(4000, 3000, 0)} color="#2c3a5e" flat outline={0} z={-30} />
        <Character {...YOU} x={a.x} y={a.y} s={1.6} facing={1} look={0.1} expression={{ eyes: "open", mouth: "wavy", brows: 0.5 }} pose={poses.shrug(t - 617.6)} z={-10} />
        <X x={-600} y={260} s={pop(t, 617.8)} z={-9}>
          <SpeechBubble x={0} y={0} w={520} h={220} tx={300} ty={-180} />
        </X>
        <X x={600} y={260} s={pop(t, 618.1)} z={-9}>
          <SpeechBubble x={0} y={0} w={520} h={220} tx={-300} ty={-180} />
        </X>
      </Stage>
      <Label text="FOLLOW ORDERS" x={0.19} y={0.26} size={0.045} kind="ink" at={at(617.9)} pin />
      <Label text="JOIN HIM" x={0.81} y={0.26} size={0.045} kind="ink" at={at(618.2)} pin />
      <Label text="TELL ME IN THE COMMENTS" x={0.5} y={0.88} size={0.055} kind="box" at={at(617.7)} />
    </AbsoluteFill>
  );
};

export const _h = { EURO, Glow, ellipse, QuestionMark, Lightbulb, Steed, IslandSea, IslandRock, LongwoodRoom, CorsicaSet, SHOULDER_ARMS, shoulderPose, VIEWER, NAPOLEON_BOY };
