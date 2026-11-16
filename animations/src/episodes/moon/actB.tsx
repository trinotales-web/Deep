import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, DepthStage, X, Part, Line, Glow, roundRect, circle, ellipse, blob, push, hitAt, absT, ramp, QuestionMark, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  Lectern, MoonGlobe, LunarSurface, CraterSection, SpaceRock, GrailProbe, DashLink, MetalLump, SnowPeak, Globe, WorldMap, worldXY, DimArrow, Monitor, Fireball, ImpactPlume, Ring,
} from "../../kit/env";
import { sec, pop, useScr } from "../../kit/shot";
import { SpaceSet, Office, MoonPressSet, PressDesk, Flash } from "./sets";
import { atHead } from "./frame";
import { SCIENTIST } from "./cast";

// The impact that made the South Pole-Aitken basin, GRAIL's gravity map, the
// 2019 Baylor study of the buried mass and the two ideas about what it is.

const SPA_VIEW = { lon: -169, lat: -53 };

// 66.32 "A giant space rock, maybe around 160 kilometers wide,"
export const RockShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const sc = useScr();
  const zoom = push(frame, dur, 0.95, 1.03);
  const x = interpolate(t, [65.8, 70], [380, -120]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <SpaceSet seed={9}>
          <MoonGlobe r={900} x={-1000} y={-760} view={{ lon: 175, lat: -25 }} craters={25} z={-20} />
          <SpaceRock x={x} y={120} size={300} rot={t * 0.25} seed={3} z={-5} />
        </SpaceSet>
      </Stage>
      <Label text="~160 KM WIDE" x={sc(x, -260, zoom).x} y={sc(x, -260, zoom).y} size={0.05} kind="tag" pin at={at(68.2)} />
    </AbsoluteFill>
  );
};

// 69.95 "slams into the Moon's far side."
export const ImpactShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const hit = 70.4;
  const k = ramp(t, 69.8, hit, Easing.in(Easing.quad));
  const boom = ramp(t, hit, hit + 1.6);
  const target: [number, number] = [0, -150];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.0), shake: hitAt(t, hit, 0.8) * 26 }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <SpaceSet seed={9}>
          <MoonGlobe r={430} view={{ lon: -169, lat: -20 }} craters={25} basinTint={boom * 0.8} z={-10} />
          {boom < 0.02 ? <SpaceRock x={interpolate(k, [0, 1], [700, target[0]])} y={interpolate(k, [0, 1], [520, target[1]])} size={interpolate(k, [0, 1], [110, 60])} seed={3} z={-5} /> : null}
          <Fireball t={boom} x={target[0]} y={target[1]} size={0.9} seed={5} z={-4} />
          {[0, 1, 2].map((i) => {
            const r = Math.max(0, boom - i * 0.1) * 900;
            return r > 1 ? <Ring key={i} r={r} width={10 - i * 2} color="#fff2c6" opacity={Math.max(0, 1 - boom * 1.3)} x={target[0]} y={target[1]} sy={0.5} z={-4.5} /> : null;
          })}
        </SpaceSet>
      </Stage>
      <Flash k={Math.max(0, 1 - Math.abs(t - hit) / 0.15) * 0.9} />
      <Label text="FAR SIDE" x={0.08} y={0.1} size={0.045} kind="box" at={at(71.2)} />
    </AbsoluteFill>
  );
};

// 72.38 "It leaves behind one of the biggest craters in the whole solar system."
export const BasinRevealShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.92, 1.02) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet seed={9}>
          <MoonGlobe r={430} view={{ lon: -169 + (t - 72) * 3, lat: -35 }} basinTint={1} basin={ramp(t, 72.6, 74.6)} z={-10} />
        </SpaceSet>
      </Stage>
      <Label text="ONE OF THE BIGGEST IN THE SOLAR SYSTEM" x={0.5} y={0.9} size={0.04} kind="title" at={at(73.6)} />
    </AbsoluteFill>
  );
};

// 76.06 "Today, we call it the South Pole-Aitken basin."
export const BasinNameShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.15), y: -60 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet seed={9}>
          <MoonGlobe r={430} view={SPA_VIEW} basinTint={1} basin={1} z={-10} />
        </SpaceSet>
      </Stage>
      <Label text="SOUTH POLE–AITKEN BASIN" x={0.5} y={0.1} size={0.06} kind="title" at={at(77.2)} />
    </AbsoluteFill>
  );
};

// 79.11 "It's about 2,500 kilometers wide."
export const BasinWidthShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const R = 430;
  const half = R * Math.sin((41 * Math.PI) / 180);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet seed={9}>
          <MoonGlobe r={R} view={SPA_VIEW} basinTint={1} basin={1} z={-10} />
          <DimArrow len={2 * half * ramp(t, 79.2, 80.4)} color="#ffd84a" width={18} z={-5} />
        </SpaceSet>
      </Stage>
      <Label text="2,500 KM" x={0.5} y={0.62} size={0.07} kind="title" at={at(79.5)} />
    </AbsoluteFill>
  );
};

// 81.88 "That's big enough to cover all of India."
export const IndiaCoverShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const ppd = 24;
  const c: [number, number] = [80, 22];
  const [cx, cy] = worldXY(80, 22.5, ppd, c);
  const k = ramp(t, 82.2, 83.0, Easing.out(Easing.back(1.3)));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ dir: [-0.6, 0.7] }} vignette={0.45}>
        <WorldMap ppd={ppd} center={c} w={4400} h={2600} tint={{ India: "#e2a04a" }} z={-20} />
        <X x={cx} y={cy} s={k} z={-5}>
          <Part shape={ellipse(Math.round((1250 / 103) * ppd), Math.round((1025 / 111) * ppd * 1.08))} color="#6a5a8a" flat outline={0} opacity={0.45} />
        </X>
        <X x={cx} y={cy} z={-4.9}>
          <Line
            pts={Array.from({ length: 65 }, (_, i) => [Math.cos((i / 64) * Math.PI * 2) * (1250 / 103) * ppd * k, Math.sin((i / 64) * Math.PI * 2) * (1025 / 111) * ppd * 1.08 * k] as [number, number])}
            width={12}
            color="#fe5649"
          />
        </X>
      </Stage>
      <Label text="SPA BASIN vs INDIA" x={0.08} y={0.1} size={0.045} kind="box" at={at(82.2)} />
    </AbsoluteFill>
  );
};

/** Wide, shallow basin cross-section used by the depth shots. */
const BasinSection: React.FC<{ y?: number; mass?: number; dip?: number; sun?: [number, number] | null }> = ({ y = -100, mass = 0, dip = 0, sun = null }) => (
  <CraterSection y={y} w={4200} craterW={2600} depth={520} blockH={1500} sun={sun} mass={mass} dip={dip} z={-10} />
);

// 84.11 "And in places, it's about 8 kilometers deep."
export const DepthShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const k = ramp(t, 85.3, 86.2);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.62, 0.66), y: -200 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet seed={9}>
          <BasinSection />
          <X x={0} y={-100 + 114} z={-5}>
            <DimArrow len={634 * k} rot={-Math.PI / 2} x={0} y={-317 * k} color="#ffd84a" width={18} />
          </X>
        </SpaceSet>
      </Stage>
      <Label text="8 KM DEEP" x={0.62} y={0.55} size={0.06} kind="title" at={at(85.6)} />
    </AbsoluteFill>
  );
};

// 86.88 "Almost as deep as Mount Everest is tall."
export const EverestShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const rise = ramp(t, 87.6, 88.6, Easing.out(Easing.back(1.2)));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.62, 0.66), y: -200 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet seed={9}>
          <BasinSection />
          <X x={0} y={-620} z={-6} sy={rise}>
            <SnowPeak h={690} w={900} />
          </X>
        </SpaceSet>
      </Stage>
      <Label text="MOUNT EVEREST · 8.8 KM" x={0.5} y={0.12} size={0.05} kind="title" at={at(88.1)} />
    </AbsoluteFill>
  );
};

/** Two scientists at a desk with a Moon globe. */
const MD_CAM = { zoom: 1.0, y: 150 };
const MoonDesk: React.FC<{ frame: number; t: number; react?: "shrug" | "wide" | "idle" | "think"; screen?: React.ReactNode }> = ({ frame, t, react = "idle", screen }) => {
  const pose = (i: number) => (react === "shrug" ? poses.shrug((t % 100) - Math.floor(t % 100) + 0.6) : react === "think" ? poses.think : poses.idle(frame, i));
  const exp = react === "wide" ? { eyes: "wide" as const, mouth: "o" as const, brows: 0.6, sweat: true } : react === "shrug" ? { eyes: "half" as const, mouth: "wavy" as const, brows: 0.4 } : react === "think" ? { eyes: "open" as const, mouth: "flat" as const, brows: -0.2 } : { eyes: "open" as const, mouth: "flat" as const, brows: 0.15 };
  const a = atHead(MD_CAM, 0.14, 0.5, 1.75);
  const b = atHead(MD_CAM, 0.86, 0.5, 1.75);
  return (
    <Office floor={-420}>
      <X x={0} y={-262} z={-24}>
        <Part shape={roundRect(1380, 40, 10)} color="#8a6a4a" shade={0.2} />
        <Part shape={roundRect(1320, 400, 10)} color="#6e5236" shade={0.2} y={-220} z={-0.001} />
        <Part shape={roundRect(260, 70, 10)} color="#3a3e48" flat outline={4} x={-420} y={56} z={0.001} />
        <Part shape={roundRect(120, 26, 6)} color="#d6d8de" flat outline={3} x={-420} y={100} z={0.002} />
        <Part shape={roundRect(70, 90, 10)} color="#f2f2f4" shade={0.2} x={430} y={65} z={0.001} />
      </X>
      <X x={0} y={120} z={-22}>
        <Monitor w={900} h={540} screen="#0e1a2c">
          <X s={1.18}>{screen}</X>
        </Monitor>
      </X>
      <Character {...SCIENTIST(0)} x={a.x} y={a.y} s={1.75} facing={1} look={0.5} expression={{ ...exp, gaze: [0.6, 0.3] }} pose={pose(0)} z={-10} />
      <Character {...SCIENTIST(1)} x={b.x} y={b.y} s={1.75} facing={-1} look={0.5} expression={{ ...exp, gaze: [-0.6, 0.3] }} pose={pose(1)} z={-10} />
    </Office>
  );
};

// 90.22 "For a long time, that was all we knew about it."
export const AllWeKnewShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.98, 1.04), y: MD_CAM.y }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <MoonDesk frame={frame} t={t} react={t > 91.3 ? "shrug" : "idle"} screen={<MoonGlobe r={190} view={SPA_VIEW} basinTint={1} basin={1} glow={0} craters={30} />} />
      </Stage>
    </AbsoluteFill>
  );
};

// 92.95 "Then, in 2011, NASA sends two small spacecraft to the Moon,"
export const GrailLaunchShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const k = ramp(t, 93.6, 97.2, Easing.inOut(Easing.quad));
  const path = (u: number): [number, number] => [-560 + u * 1100, -40 + Math.sin(u * Math.PI) * 300];
  const p = path(k);
  const p2 = path(Math.max(0, k - 0.05));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.92, 1.0) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <Globe r={300} x={-760} y={-120} lon0={-80} lat0={20} z={-12} />
          <MoonGlobe r={200} x={720} y={-60} craters={30} z={-12} />
          <Line pts={Array.from({ length: 30 }, (_, i) => path((i / 29) * k))} width={6} color="#9ad8ff" opacity={0.5} z={-8} />
          <GrailProbe x={p[0]} y={p[1]} s={0.5} z={-5} />
          <GrailProbe x={p2[0]} y={p2[1]} s={0.5} z={-5.1} />
        </SpaceSet>
      </Stage>
      <Label text="2011" x={0.5} y={0.1} size={0.08} kind="title" at={at(93.7)} />
      <Label text="NASA" x={0.08} y={0.84} size={0.045} kind="box" at={at(94.7)} />
    </AbsoluteFill>
  );
};

// 97.38 "named Ebb and Flow."
export const EbbFlowShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <GrailProbe x={-420} y={40 + Math.sin(frame * 0.06) * 14} s={1.4} rot={0.05} z={-5} />
          <GrailProbe x={420} y={-20 + Math.sin(frame * 0.06 + 1) * 14} s={1.4} rot={-0.05} z={-5} />
        </SpaceSet>
      </Stage>
      <Label text="EBB" x={0.28} y={0.72} size={0.07} kind="title" at={at(97.7)} />
      <Label text="FLOW" x={0.72} y={0.72} size={0.07} kind="title" at={at(98.4)} />
    </AbsoluteFill>
  );
};

/** Lunar horizon seen from orbit (a big Moon below). */
const OrbitView: React.FC<{ children?: React.ReactNode; lon?: number }> = ({ children, lon = 20 }) => (
  <SpaceSet>
    <MoonGlobe r={2600} y={-2860} view={{ lon, lat: 10 }} craters={160} glow={0.4} z={-20} />
    {children}
  </SpaceSet>
);

// 99.19 "They fly one behind the other."
export const OneBehindShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const x = interpolate(t, [99.0, 100.9], [-160, 120]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.95) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <OrbitView lon={20 + (t - 99) * 2}>
          <DashLink a={[x - 480, 60]} b={[x + 180, 90]} z={-6} />
          <GrailProbe x={x - 560} y={60} s={0.95} z={-5} />
          <GrailProbe x={x + 260} y={90} s={0.95} z={-5} />
        </OrbitView>
      </Stage>
    </AbsoluteFill>
  );
};

// 101.0 "As they pass over heavier parts of the Moon, the front one gets pulled a tiny bit faster."
export const PulledShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const sc = useScr();
  const zoom = push(frame, dur, 0.75, 0.79);
  const base = interpolate(t, [100.8, 105.6], [-900, 500]);
  const pull = ramp(t, 103.0, 105.0, Easing.out(Easing.quad)) * 260;
  const front = base + 350 + pull;
  const back = base - 350;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, y: -200 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <CraterSection y={-260} w={5200} craterW={900} depth={160} blockH={1200} sun={null} z={-12} />
          <X x={400} y={-760} z={-11}>
            <Glow rx={380} ry={220} color="#ff6a3a" alpha={0.45 + 0.1 * Math.sin(frame * 0.2)} additive />
            <MetalLump w={520} h={240} color="#b0563a" z={0.001} />
          </X>
          <DashLink a={[back + 90, 260]} b={[front - 90, 260]} z={-6} />
          <GrailProbe x={back} y={260} s={1.05} z={-5} />
          <GrailProbe x={front} y={260} s={1.05} z={-5} />
          {pull > 20 ? <Line pts={[[front - 200, 420], [front + 40, 420]]} width={16} color="#ffd84a" z={-4} /> : null}
        </SpaceSet>
      </Stage>
      <Label text="HEAVIER" x={sc(400, -480, zoom, 0, -200).x} y={sc(400, -480, zoom, 0, -200).y} size={0.045} kind="tag" pin at={at(101.8)} />
      <Label text="PULLED FASTER" x={0.5} y={0.1} size={0.05} kind="title" at={at(103.8)} />
    </AbsoluteFill>
  );
};

// 105.72 "By measuring the gap between them,"
export const GapShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const gap = 220.42 + Math.sin(t * 3) * 0.004 + (t - 105.6) * 0.003;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.05) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <OrbitView lon={40}>
          <DashLink a={[-480, 60]} b={[480, 60]} color="#ffd84a" width={10} z={-6} />
          <GrailProbe x={-600} y={60} s={0.75} z={-5} />
          <GrailProbe x={600} y={60} s={0.75} z={-5} />
        </OrbitView>
      </Stage>
      <Label text={`GAP: ${gap.toFixed(4)} KM`} x={0.5} y={0.32} size={0.05} kind="box" at={at(106.2)} />
    </AbsoluteFill>
  );
};

// 107.3 "scientists can map the Moon's gravity."
export const GravityMapShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.03) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <MoonGlobe r={420} view={{ lon: -20 + (t - 107) * 8, lat: 0 }} gravity={ramp(t, 107.4, 108.4)} z={-10} />
        </SpaceSet>
      </Stage>
      <Label text="GRAVITY MAP" x={0.5} y={0.1} size={0.06} kind="title" at={at(107.9)} />
    </AbsoluteFill>
  );
};

// 109.36 "It's like an X-ray of the whole Moon."
export const XrayShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.98, 1.06) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <MoonGlobe r={420} view={{ lon: 0 + (t - 109) * 8, lat: 0 }} xray={ramp(t, 109.5, 110.2)} grid={ramp(t, 109.6, 110.4)} z={-10} />
        </SpaceSet>
      </Stage>
      <Label text="X-RAY" x={0.66} y={0.2} size={0.08} kind="stamp" at={at(109.8)} />
    </AbsoluteFill>
  );
};

// 111.45 "And when the mission ends, the two spacecraft are crashed into a mountain on purpose."
export const GrailCrashShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const hits = [114.4, 114.85];
  const pos = (i: number): [number, number] => {
    const k = ramp(t, 112.6 + i * 0.45, hits[i], Easing.in(Easing.quad));
    return [interpolate(k, [0, 1], [-1300 - i * 260, 120 + i * 140]), interpolate(k, [0, 1], [640, 220 - i * 30])];
  };
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.66, 0.7), y: 160, shake: (hitAt(t, hits[0], 0.5) + hitAt(t, hits[1], 0.5)) * 12 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <LunarSurface horizon={-200} sun={[-1500, -100]} seed={51} ridges={2.2} rocks={4} craters={3}>
          {[0, 1].map((i) => {
            const [x, y] = pos(i);
            const boom = ramp(t, hits[i], hits[i] + 1.4);
            return (
              <React.Fragment key={i}>
                {boom < 0.02 ? <GrailProbe x={x} y={y} s={0.75} rot={-0.4} z={-5} /> : null}
                <ImpactPlume t={boom} x={120 + i * 140} y={200 - i * 30} size={0.6} seed={i + 2} z={-4} />
              </React.Fragment>
            );
          })}
        </LunarSurface>
      </Stage>
      <Label text="ON PURPOSE" x={0.62} y={0.8} size={0.07} kind="stamp" at={at(115.1)} />
    </AbsoluteFill>
  );
};

// 116.52 "In 2019, scientists at Baylor University in Texas"
export const BaylorShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const c: [number, number] = [-97, 35];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08) }} light={{ dir: [-0.6, 0.7] }} vignette={0.45}>
        <WorldMap ppd={34} center={c} w={4400} h={2600} tint={{ "United States of America": "#e2c27a" }} pins={t > 118.4 ? [{ at: [-97.15, 31.55], color: "#fe5649", glow: true }] : []} z={-20} />
      </Stage>
      <Label text="2019" x={0.5} y={0.1} size={0.08} kind="title" at={at(116.6)} />
      <Label text="BAYLOR UNIVERSITY, TEXAS" x={0.5} y={0.8} size={0.05} kind="box" at={at(118.5)} />
    </AbsoluteFill>
  );
};

// 120.44 "study that gravity map."
export const StudyMapShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.98, 1.04), y: MD_CAM.y }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <MoonDesk frame={frame} t={t} react="think" screen={<MoonGlobe r={190} view={{ lon: -100 + t * 6, lat: -20 }} gravity={1} glow={0} craters={20} />} />
      </Stage>
    </AbsoluteFill>
  );
};

// 122.11 "And under the South Pole-Aitken basin,"
export const UnderBasinShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.12), y: -60 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <MoonGlobe r={430} view={SPA_VIEW} gravity={0.8} basin={ramp(t, 122.3, 123.8)} z={-10} />
        </SpaceSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 124.47 "they find something strange."
export const StrangeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.98, 1.04), y: MD_CAM.y }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <MoonDesk frame={frame} t={t} react="wide" screen={<MoonGlobe r={190} view={SPA_VIEW} gravity={0.6} mass={ramp(t, 124.6, 125.4)} glow={0} craters={20} />} />
        <QuestionMark x={0} y={380} s={0.8 * pop(t, 125.2)} z={-5} />
      </Stage>
    </AbsoluteFill>
  );
};

// 126.41 "A huge, heavy mass, hidden deep below the surface."
export const MassShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.55, 0.6), y: -520 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <BasinSection mass={ramp(t, 126.4, 127.6, Easing.out(Easing.back(1.4)))} />
        </SpaceSet>
      </Stage>
      <Label text="HUGE, HEAVY MASS" x={0.5} y={0.86} size={0.05} kind="title" at={at(127.0)} />
    </AbsoluteFill>
  );
};

// 130.06 "It's so heavy that it pulls the crater floor down by almost a kilometer."
export const PullsFloorShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const dip = ramp(t, 131.1, 132.9, Easing.inOut(Easing.cubic)) * 90;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.6, 0.64), y: -480 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <BasinSection mass={1} dip={dip} />
          <X x={-420} y={-100 - 520 - dip * 0.6 + 120} z={-5}>
            {[-1, 0, 1].map((i) => (
              <X key={i} x={i * 300} rot={-Math.PI / 2}>
                <Line pts={[[-60, 0], [40, 0]]} width={14} color="#ffd84a" />
                <Part shape={blob([[40, -24], [80, 0], [40, 24]], 4)} color="#ffd84a" flat outline={0} />
              </X>
            ))}
          </X>
        </SpaceSet>
      </Stage>
      <Label text="FLOOR PULLED DOWN ~1 KM" x={0.5} y={0.1} size={0.05} kind="title" at={at(132.6)} />
    </AbsoluteFill>
  );
};

// 134.16 "One scientist described it like this."
export const QuoteShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const cam = { zoom: 1.0, y: 150 };
  const p = atHead(cam, 0.6, 0.42, 1.9);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.97, 1.04), y: cam.y }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <MoonPressSet floor={-560}>
          <Character {...SCIENTIST(3)} x={p.x} y={p.y} s={1.9} facing={1} look={0.15} talking expression={{ eyes: "open", mouth: "smile", brows: 0.2 }} pose={poses.talk(frame, 2)} z={-6} />
          <PressDesk x={p.x + 60} y={p.y + 150 * 1.9 - 380} z={-4} />
        </MoonPressSet>
      </Stage>
    </AbsoluteFill>
  );
};

/** Stylized Big Island of Hawaii (green, volcano peaks). Origin = centre, ~360 px wide. */
const BigIsland: React.FC<{ x?: number; y?: number; z?: number; s?: number }> = ({ x = 0, y = 0, z = 0, s = 1 }) => (
  <X x={x} y={y} z={z} s={s}>
    <Part shape={blob([[-120, 170], [10, 190], [150, 110], [190, -20], [110, -130], [20, -190], [-60, -110], [-170, -40], [-180, 60]], 8)} color="#6ab04a" shade={0.3} />
    <Part shape={circle(34)} color="#8a6a4a" flat outline={4} x={0} y={30} z={0.001} />
    <Part shape={circle(28)} color="#8a6a4a" flat outline={4} x={70} y={-60} z={0.001} />
  </X>
);

// 136.32 "Imagine a pile of metal five times bigger than the Big Island of Hawaii,"
export const HawaiiShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const g = ramp(t, 137.4, 138.6, Easing.out(Easing.back(1.3)));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.9) }} light={{ dir: [-0.6, 0.7] }} vignette={0.45}>
        <Part shape={roundRect(6000, 3600, 0)} color="#3f8fb8" flat outline={0} z={-20} />
        {Array.from({ length: 14 }, (_, i) => (
          <Line key={i} pts={[[-900 + (i % 5) * 420, -400 + Math.floor(i / 5) * 360], [-820 + (i % 5) * 420, -400 + Math.floor(i / 5) * 360 + 10], [-740 + (i % 5) * 420, -400 + Math.floor(i / 5) * 360]]} smooth width={6} color="#8ac8e0" opacity={0.6} z={-19} />
        ))}
        <BigIsland x={-560} y={-60} s={0.8} z={-10} />
        <X x={360} y={-40} s={Math.max(0.01, g)} z={-8}>
          <Glow rx={560} ry={360} color="#ffb04a" alpha={0.25} additive />
          <MetalLump w={1000} h={640} z={0.001} />
        </X>
      </Stage>
      <Label text="BIG ISLAND, HAWAII" x={0.21} y={0.82} size={0.04} kind="box" at={at(139.1)} />
      <Label text="×5" x={0.69} y={0.5} size={0.12} kind="title" at={at(137.7)} />
    </AbsoluteFill>
  );
};

// 140.24 "buried underground."
export const BuriedShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = ramp(t, 140.2, 141.3, Easing.inOut(Easing.cubic));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.6, 0.64), y: -520 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <BasinSection />
          <X x={0} y={interpolate(k, [0, 1], [260, -1020])} z={-9.99}>
            <Glow rx={420} ry={260} color="#ff9a3a" alpha={0.45} additive />
            <MetalLump w={560} h={290} z={0.001} />
          </X>
        </SpaceSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 141.97 "So what is it?"
export const WhatIsItShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.6, 0.66), y: -360 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <BasinSection mass={1} />
          <QuestionMark x={560} y={-560} s={1.6 * pop(t, 142.1)} z={-5} />
        </SpaceSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 143.13 "Maybe it's the iron and nickel core of the space rock that made the crater."
export const CoreShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const t = absT(start, frame);
  const open = ramp(t, 143.5, 144.5, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02) }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet seed={9}>
          <X x={-open * 140} rot={-open * 0.25} z={-6}>
            <SpaceRock size={300} seed={3} />
          </X>
          <X x={open * 140} rot={open * 0.25} z={-5.9} sx={1}>
            <Part shape={ellipse(220, 250)} color="#7a6a5a" shade={0.3} />
            <Part shape={ellipse(190, 220)} color="#5a4e44" flat outline={4} z={0.001} />
          </X>
          <X x={open * 40} z={-5}>
            <Glow rx={260} color="#ffb04a" alpha={0.35 * open} additive />
            <MetalLump w={260 * open + 1} h={200 * open + 1} color="#9a9ca6" z={0.001} />
          </X>
        </SpaceSet>
      </Stage>
      <Label text="IRON + NICKEL CORE" x={0.5} y={0.88} size={0.05} kind="title" at={at(144.4)} />
    </AbsoluteFill>
  );
};

/** Moon cut in half: crust, mantle, core; SPA as a dent with a lump under it. */
const MoonCutaway: React.FC<{ lump?: number; magma?: number }> = ({ lump = 1, magma = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <X>
      <Glow rx={560} color="#e8eef8" alpha={0.2} additive z={-0.01} />
      <Part shape={circle(440)} color="#b9b4ac" shade={0.3} />
      <Part shape={circle(400)} color={magma > 0 ? "#e0702a" : "#c0784a"} flat outline={4} z={0.001} />
      <Part shape={circle(150)} color="#e8a43a" flat outline={4} z={0.002} />
      <Glow rx={190} color="#ffd27a" alpha={0.35} additive z={0.003} />
      <Line pts={Array.from({ length: 13 }, (_, i) => {
        const a = -Math.PI / 2 - 0.62 + (1.24 * i) / 12;
        return [Math.round(Math.cos(a) * 452) , Math.round(Math.sin(a) * 452)] as [number, number];
      })} width={12} color="#fe5649" opacity={0.9} z={0.004} />
      {lump > 0 ? (
        <X x={-110} y={-330} rot={0.27} s={lump} z={0.005}>
          <Glow rx={160} ry={90} color="#ffb04a" alpha={0.5 + 0.1 * Math.sin(frame * 0.2)} additive />
          <MetalLump w={190} h={80} z={0.001} />
        </X>
      ) : null}
    </X>
  );
};

// 146.68 "And it's still stuck inside the Moon."
export const StuckShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.04), y: -60 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet seed={9}>
          <MoonCutaway />
        </SpaceSet>
      </Stage>
      <Label text="STILL INSIDE" x={0.66} y={0.82} size={0.05} kind="box" at={at(147.4)} />
    </AbsoluteFill>
  );
};

// 148.75 "Or maybe it's heavy material from long ago,"
export const MagmaShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const sink = ramp(t, 149.0, 150.9, Easing.inOut(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.6, 0.64), y: -300 }} light={{ dir: [-0.6, 0.7] }} vignette={0.55}>
        <SpaceSet>
          <BasinSection />
          {[-340, -120, 140, 360].map((x, i) => (
            <X key={i} x={x} y={-760 - sink * (220 + i * 40)} z={-9.99}>
              <Part shape={blob([[-70, 0], [-30, 50], [40, 40], [80, 0], [30, -50], [-40, -40]], 6)} color="#3a3440" shade={0.3} />
            </X>
          ))}
        </SpaceSet>
      </Stage>
    </AbsoluteFill>
  );
};

/** The young Moon under an ocean of molten rock. */
const MagmaMoon: React.FC<{ r?: number }> = ({ r = 400 }) => {
  const frame = useCurrentFrame();
  return (
    <X>
      <Glow rx={r * 1.5} color="#ff7a2a" alpha={0.45} additive z={-0.01} />
      <Part shape={circle(r)} color="#e8662a" shade={0.3} />
      {Array.from({ length: 9 }, (_, i) => {
        const a = i * 2.1;
        const d = r * (0.2 + (i % 4) * 0.18);
        return <Part key={i} shape={blob([[-60, 0], [-20, 40], [50, 30], [70, -10], [10, -40]], 6)} color="#5a2a1a" flat outline={4} x={Math.cos(a) * d} y={Math.sin(a) * d} rot={a} s={0.7 + (i % 3) * 0.3} z={0.001} />;
      })}
      {Array.from({ length: 6 }, (_, i) => (
        <Part key={`g${i}`} shape={circle(18)} color="#ffd27a" flat outline={0} opacity={0.5 + 0.5 * Math.sin(frame * 0.2 + i)} x={Math.cos(i * 1.7) * r * 0.6} y={Math.sin(i * 1.7) * r * 0.6} z={0.002} />
      ))}
    </X>
  );
};

// 151.06 "when the young Moon was covered in an ocean of melted rock."
export const YoungMoonShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.05) }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <SpaceSet seed={9}>
          <MagmaMoon r={400} />
        </SpaceSet>
      </Stage>
      <Label text="MAGMA OCEAN" x={0.5} y={0.88} size={0.05} kind="title" at={at(152.5)} />
    </AbsoluteFill>
  );
};

// 154.04 "Nobody knows for sure."
export const NobodyKnowsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.98, 1.04), y: MD_CAM.y }} light={{ dir: [-0.6, 0.7] }} vignette={0.5}>
        <MoonDesk frame={frame} t={t - 153.9 + 100} react="shrug" screen={<X s={0.42} y={20}><MoonCutaway /></X>} />
      </Stage>
    </AbsoluteFill>
  );
};

// 155.46 "Remember this mystery. We'll come back to it."
export const RememberMysteryShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.98, 1.08) }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <SpaceSet seed={9}>
          <MoonGlobe r={420} view={SPA_VIEW} xray={1} grid={0.6} mass={1} basin={1} z={-10} />
        </SpaceSet>
      </Stage>
      <Label text="MYSTERY MASS" x={0.5} y={0.1} size={0.06} kind="title" at={at(155.6)} />
      <Label text="REMEMBER" x={0.66} y={0.78} size={0.07} kind="stamp" at={at(156.0)} />
    </AbsoluteFill>
  );
};

export { DepthStage, Fireball };
