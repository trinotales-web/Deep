import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, X, Part, Glow, Gradient, Spear, QuestionMark, roundRect, palette } from "../../kit";
import { Character, poses } from "../../kit/character";
import { Sunburst, Ground, RockHill, GreekTemple, Barricade, Banner, City, Tripod, MysticSmoke, Throne } from "../../kit/env";
import { AcropolisTop, Backdrop, TempleInterior } from "./sets";
import { DEFENDERS, TEMPLE_KEEPER, PERSIAN, XERXES, PYTHIA, ENVOY, CITIZEN } from "./cast";
import { ramp, push, hitAt, absT, type ShotProps } from "./common";

/** The few defenders lined up (4 poor men + temple keeper). */
export const Defenders: React.FC<{
  y: number;
  s?: number;
  t: number;
  frame: number;
  mood: "proud" | "shocked" | "angry" | "nervous" | "scared";
  spread?: number;
  facingCenter?: boolean;
}> = ({ y, s = 1, frame, mood, spread = 220, facingCenter = true }) => {
  const xs = [-2, -1, 0, 1, 2].map((k) => k * spread);
  const exprs = {
    proud: { eyes: "half", mouth: "smirk", brows: -0.2 },
    shocked: { eyes: "wide", mouth: "o", brows: 0.8, sweat: true },
    angry: { eyes: "angry", mouth: "teeth", brows: -0.8 },
    nervous: { eyes: "open", mouth: "wavy", brows: 0.6, sweat: true, gaze: [0.2, 0.4] as [number, number] },
    scared: { eyes: "wide", mouth: "shout", brows: 0.9 },
  } as const;
  const pose = (i: number) =>
    mood === "proud"
      ? i % 2
        ? poses.handsOnHips
        : poses.idle(frame, i)
      : mood === "shocked" || mood === "scared"
        ? poses.scared(frame + i * 7)
        : mood === "angry"
          ? {
              armF: [2.95 + Math.sin(frame * 0.5 + i) * 0.12, 0.15] as [number, number],
              armB: [-0.35, -0.3] as [number, number],
              armsOverHead: true,
              bob: Math.abs(Math.sin(frame * 0.5 + i)) * 6,
            }
          : poses.idle(frame, i);
  const cast = [DEFENDERS[0], DEFENDERS[1], TEMPLE_KEEPER, DEFENDERS[2], DEFENDERS[3]];
  return (
    <>
      {cast.map((d, i) => (
        <Character
          key={i}
          {...d}
          x={xs[i]}
          y={y - Math.abs(i - 2) * 14}
          z={i === 2 ? 0.5 : 0.1 * (2 - Math.abs(i - 2))}
          s={s * (i === 2 ? 1.05 : 1)}
          facing={facingCenter ? (i < 2 ? 1 : i > 2 ? -1 : 1) : 1}
          look={i === 2 ? 0.1 : 0.45}
          expression={exprs[mood] as never}
          pose={pose(i)}
        />
      ))}
    </>
  );
};

// 0.00 "A prophecy says a wooden wall will save these men."
export const HookShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const puff = ramp(t, 2.4, 2.7);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -120 }} light={{ dir: [-0.8, 0.6] }}>
        <AcropolisTop mood="warm" wallY={-420}>
          <X y={-620} z={2}>
            <Defenders y={0} s={1.2} spread={235} t={t} frame={frame} mood="proud" />
          </X>
          <Glow y={-200} rx={900} ry={500} color="#fff2c6" alpha={0.12 + puff * 0.1} additive z={3} />
        </AcropolisTop>
      </Stage>
    </AbsoluteFill>
  );
};

// 3.10 "It's going to get them killed."
export const KilledShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const shake = hitAt(t, 3.99, 0.5);
  return (
    <AbsoluteFill>
      <Stage
        camera={{ zoom: push(frame, dur, 1.1, 1.2) + shake * 0.03, y: -160, shake: shake * 16 }}
        light={{ pos: [0, -200] }}
        shadowMul={[0.62, 0.5, 0.55]}
        vignette={0.7}
        vignetteColor="#1a0606"
      >
        <AcropolisTop mood="fire" burn={1} wallY={-420}>
          <X y={-620} z={2}>
            <Defenders y={0} s={1.2} spread={235} t={t} frame={frame} mood="shocked" />
          </X>
        </AcropolisTop>
      </Stage>
    </AbsoluteFill>
  );
};

// 4.85 "It's 484 BC, and a huge Persian army is marching on Athens,"
export const ArmyShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const camX = interpolate(t, [4.85, 8.6, 9.45], [520, 120, -620], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const groundY = -380;
  const rows = [
    { y: groundY + 260, s: 0.5, n: 9, z: 1 },
    { y: groundY + 130, s: 0.62, n: 8, z: 2 },
    { y: groundY - 20, s: 0.78, n: 7, z: 3 },
  ];
  return (
    <AbsoluteFill>
      <Stage camera={{ x: camX, zoom: 1.0 }} light={{ dir: [-0.8, 0.6] }}>
        <Backdrop mood="warm" horizon={groundY + 330} />
        <Ground w={6000} h={1600} y={groundY + 330} color="#d6b986" far="#e3c999" pebbles={30} tufts={20} tuftColor="#8a8a52" z={-20} />
        {/* Athens far away on the left */}
        <X x={-1250} y={groundY + 330} s={0.42} z={-19}>
          <RockHill w={1100} h={560} />
          <GreekTemple w={420} colH={170} cols={6} y={560} z={1} />
          <City w={1800} y={-10} scale={0.6} seed={5} z={2} />
        </X>
        <Glow x={500} y={groundY + 200} rx={1400} ry={260} color="#e8cf9a" alpha={0.4} z={-5} />
        {rows.map((r, ri) => (
          <X key={ri} z={r.z}>
            {Array.from({ length: r.n }, (_, i) => {
              const x = -60 + i * 170 * (r.s / 0.6) + ri * 60 - frame * 2.2 * r.s;
              return (
                <Character
                  key={i}
                  {...PERSIAN(i + ri)}
                  x={x}
                  y={r.y}
                  s={r.s}
                  z={i * 0.001}
                  facing={-1}
                  look={0.6}
                  shadow={ri === 2}
                  expression={{ eyes: i % 3 === 0 ? "angry" : "half", mouth: "flat", brows: -0.5 }}
                  pose={poses.walk(frame + i * 3 + ri * 11, 1.2)}
                  holdF={<Spear rot={-0.1} length={460} />}
                />
              );
            })}
            {ri === 1
              ? [180, 760, 1300].map((x, k) => <Banner key={k} x={x - frame * 1.3} y={r.y + 20} pole={420} seed={k} z={0.5} />)
              : null}
          </X>
        ))}
      </Stage>
    </AbsoluteFill>
  );
};

// 9.45 "led by King Xerxes."
export const XerxesShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const hit = hitAt(t, 10.16, 0.5);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.1) + hit * 0.04, y: -40, shake: hit * 8 }} light={{ dir: [-0.6, 0.7] }} vignette={0.6}>
        <Sunburst r={2600} rays={22} color="#5a2a6a" alt="#4a2058" z={-20} />
        <Glow rx={900} color="#e9ba41" alpha={0.2} additive y={200} z={-19} />
        {[-430, 430].map((x, i) => (
          <Banner key={x} x={x} y={-960} pole={1500} color="#6b2f7a" seed={i} s={1.2} z={-10} />
        ))}
        <Throne y={-900} s={2.4} z={-5} />
        <Character
          {...XERXES}
          y={-700}
          s={2.1}
          look={0.2}
          z={1}
          talking={false}
          expression={{ eyes: "half", mouth: "smirk", brows: -0.3, gaze: [0.1, -0.2] }}
          pose={{ armF: [0.9, -1.9], armB: [-0.9, 1.9], sit: false }}
          shadow={false}
        />
      </Stage>
    </AbsoluteFill>
  );
};

// 11.00 "The Athenians ask the oracle at Delphi what to do,"
export const DelphiShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const floorY = -560;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.07), y: -60 }} light={{ pos: [140, -60] }} shadowMul={[0.6, 0.55, 0.7]} vignette={0.7} vignetteColor="#0d0610">
        <TempleInterior floorY={floorY}>
          <MysticSmoke x={140} y={floorY + 260} w={340} h={1100} z={1} />
          <Tripod x={140} y={floorY} h={260} s={1.1} z={2} />
          <Character
            {...PYTHIA}
            x={150}
            y={floorY + 230}
            s={1.15}
            facing={-1}
            look={0.35}
            z={3}
            expression={{ eyes: "closed", mouth: "flat" }}
            pose={poses.sit(frame)}
            shadow={false}
          />
          <Glow x={140} y={floorY + 380} rx={600} color="#b98cff" alpha={0.25} additive z={4} />
          {[0, 1].map((i) => (
            <Character
              key={i}
              {...ENVOY(i)}
              x={-230 - i * 170}
              y={floorY - 60 - i * 30}
              s={1.05}
              z={5 + i * 0.1}
              look={0.6}
              talking={i === 0 && t > 11.2 && t < 13.6}
              expression={{ eyes: "open", mouth: "flat", brows: 0.5, gaze: [0.8, 0.4] }}
              pose={i === 0 ? poses.holdOut : poses.think}
            />
          ))}
        </TempleInterior>
      </Stage>
    </AbsoluteFill>
  );
};

// 13.85 "and the answer is strange."
export const StrangeShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const open = ramp(t, 14.2, 14.35);
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.4);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.12), y: 80 }} light={{ dir: [0, 1] }} shadowMul={[0.55, 0.5, 0.72]} vignette={0.75} vignetteColor="#0d0610">
        <Gradient w={3000} h={3000} stops={[[0, "#1a1028"], [1, "#4a2a5a"]]} z={-30} />
        <MysticSmoke y={-1200} w={900} h={2600} z={-5} />
        <Character
          {...PYTHIA}
          y={-680}
          s={2.6}
          look={0.05}
          z={1}
          expression={{ eyes: open > 0.5 ? "wide" : "closed", mouth: open > 0.5 ? "o" : "flat", gaze: [0, 0] }}
          pose={{ armF: [2.15 + Math.sin(frame * 0.3) * 0.08, -0.5], armB: [-2.15 - Math.sin(frame * 0.3 + 1) * 0.08, 0.5], armsOverHead: false }}
          shadow={false}
        />
        {open > 0.5
          ? [-1, 1].map((k) => (
              <Glow key={k} x={k * 80} y={-680 + 308 * 2.6 + 2 * 2.6} rx={90 + pulse * 30} color="#d9b8ff" alpha={0.9} additive z={2} />
            ))
          : null}
      </Stage>
    </AbsoluteFill>
  );
};

// 15.65 "Only a wooden wall will not fall."
export const ProphecyShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const unroll = ramp(t, 15.7, 16.1, Easing.out(Easing.cubic));
  const wall = ramp(t, 16.1, 16.4, Easing.out(Easing.back(2)));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 60 }} light={{ dir: [-0.6, 0.8] }} vignette={0.6}>
        <Sunburst r={2600} rays={20} color="#4a2a5a" alt="#3a1f48" z={-20} />
        <MysticSmoke y={-900} w={900} h={2200} colors={["#b98cff", "#e9ba41"]} z={-10} />
        <X y={-20} z={1}>
          <Part shape={roundRect(820, 140 + unroll * 820, 16)} color={palette.paper} shade={0.12} />
          <Part shape={roundRect(880, 60, 30)} color="#e2d3ae" shade={0.25} y={(140 + unroll * 820) / 2} z={0.01} />
          <Part shape={roundRect(880, 60, 30)} color="#e2d3ae" shade={0.25} y={-(140 + unroll * 820) / 2} z={0.01} />
          {wall > 0.01 ? (
            <X y={-200} s={wall * 0.62} z={0.02}>
              <Barricade w={1000} h={420} seed={9} />
            </X>
          ) : null}
        </X>
      </Stage>
    </AbsoluteFill>
  );
};

// 17.85 "So what's the wooden wall?"
export const QuestionShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const q = ramp(t, 18.8, 19.05, Easing.out(Easing.back(2.5)));
  const groundY = -620;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -60 }} light={{ dir: [-0.8, 0.6] }}>
        <Backdrop mood="day" horizon={groundY + 300} />
        <City w={2400} y={groundY + 300} scale={0.9} rows={1} seed={11} z={-18} />
        <Ground w={4000} h={1600} y={groundY + 300} color="#dcc79e" pebbles={14} tufts={4} z={-15} />
        {[0, 1, 2].map((i) => (
          <Character
            key={i}
            {...(i === 1 ? ENVOY(0) : CITIZEN(i * 3))}
            x={(i - 1) * 300}
            y={groundY - (i === 1 ? 60 : 0)}
            s={1.05}
            z={i === 1 ? 2 : 1}
            facing={i === 2 ? -1 : 1}
            look={0.3}
            expression={{ eyes: i === 1 ? "squint" : "open", mouth: i === 0 ? "wavy" : "flat", brows: 0.7, gaze: [0, 0.7] }}
            pose={poses.think}
          />
        ))}
        {q > 0.01 ? <QuestionMark y={420} s={q * 2.2} rot={Math.sin(frame * 0.15) * 0.08} z={5} /> : null}
      </Stage>
    </AbsoluteFill>
  );
};

