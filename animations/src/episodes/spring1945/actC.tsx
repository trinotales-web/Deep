import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import {
  Stage, X, Part, Line, InkLine, Glow, Wash, QuestionMark, Syringe, Ampoule, PillTube,
  roundRect, circle, blob, poly, ellipse, ramp, push, hitAt, absT, type ShotProps,
} from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  ZeroFighter, Warship, Bomber, Sunburst, Ground, Cloud, PlankWall, Flak, Burst, SpeedLines, Petals, LowTable, Hinomaru, HangingLamp, Desk, Flag, SakuraTree,
} from "../../kit/env";
import { Airfield, OkinawaSea, Backdrop, Barracks, ObjectBack, TatamiRoom } from "./sets";
import { PILOT, DOCTOR, DOCTOR_CIVIL, NAVY_OFFICER, GENERAL, GERMAN, AIRCREW, GIRL, SURVIVOR, WORKER } from "./cast";
import { sec, pop, CJK, scr, SpeechBubble } from "./common";
import { Forearm, HiroponBox } from "./actA";

// ───────────────────────── F · clue 2: the needle ─────────────────────────

// F1 163.95 "The second clue comes from the man holding the needle."
export const ClueTwoShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const s = 2.0;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ pos: [-500, 300] }} shadowMul={[0.55, 0.5, 0.62]} vignette={0.7}>
        <ObjectBack color="#24303e" glow="#9fd0ff">
          <Character
            {...DOCTOR}
            x={-200}
            y={-60 - 308 * s}
            s={s}
            z={1}
            look={0.4}
            expression={{ eyes: "open", mouth: "flat", brows: 0.1, gaze: [0.6, 0.4] }}
            pose={{ armF: [2.3, 0.6], armB: [-0.2, -0.1] }}
            holdF={<Syringe s={0.9} rot={-2.3 - 0.6 + Math.PI / 2} fill={0.8} />}
          />
          <X x={360} y={260} s={pop(t, 166.06)} z={3}>
            <Glow rx={160} color="#ffffff" alpha={0.6} additive />
          </X>
        </ObjectBack>
      </Stage>
      <Label text="CLUE #2" x={0.78} y={0.14} size={0.08} kind="stamp" rotate={-8} at={sec(start)(164.59)} />
    </AbsoluteFill>
  );
};

// F2 166.8 "His name is Kambara Hiroshi."
export const KambaraNameShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const s = 2.3;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ dir: [-0.6, 0.8] }} vignette={0.5}>
        <Sunburst r={2600} rays={20} color="#9fb4c8" alt="#94a9be" speed={0.4} z={-40} />
        <Character {...DOCTOR} x={-380} y={10 - 308 * s} s={s} z={2} look={0.45} expression={{ eyes: "open", mouth: "smile", brows: 0.1 }} pose={poses.idle(frame)} />
      </Stage>
      <Label text="KAMBARA HIROSHI" sub="NAVY DOCTOR" x={0.66} y={0.36} size={0.075} kind="title" at={sec(start)(167.52)} />
    </AbsoluteFill>
  );
};

/** Navy sick bay: barracks with a cot, a cabinet and a red-cross sign. */
const SickBay: React.FC<{ children?: React.ReactNode; light?: string }> = ({ children, light }) => (
  <Barracks floorY={-460} light={light}>
    <X x={-640} y={-460} z={-30}>
      <Part shape={roundRect(300, 420, 8)} color="#e9e4d8" shade={0.18} y={210} />
      {[110, 230, 350].map((y) => (
        <Line key={y} pts={[[-150, y], [150, y]]} width={5} z={0.001} />
      ))}
      {[-90, -30, 30, 90].map((x, i) => (
        <Ampoule key={x} x={x} y={238} s={0.5} label={false} z={0.002} />
      ))}
    </X>
    <X x={-80} y={300} z={-30}>
      <Part shape={roundRect(140, 140, 10)} color="#ffffff" shade={0.1} />
      <Part shape={roundRect(90, 28, 3)} color="#c8262f" flat outline={0} z={0.001} />
      <Part shape={roundRect(28, 90, 3)} color="#c8262f" flat outline={0} z={0.001} />
    </X>
    {children}
  </Barracks>
);

// F3 168.95 "In 1945, he's a 21-year-old navy doctor …"
export const YoungDoctorShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -20 }} light={{ pos: [420, 200] }}>
        <SickBay>
          <Character {...DOCTOR} x={160} y={-580} s={1.35} z={2} facing={-1} look={0.5} expression={{ eyes: "open", mouth: "smile", brows: 0.0 }} pose={poses.idle(frame)} />
        </SickBay>
      </Stage>
      <Label text="1945" x={0.14} y={0.12} size={0.07} kind="box" at={sec(start)(169.26)} />
      <Label text="21 YEARS OLD" x={0.76} y={0.2} size={0.065} kind="box" at={sec(start)(170.82)} />
      <Label text="IMPERIAL NAVY" x={0.76} y={0.31} size={0.05} at={sec(start)(171.61)} />
    </AbsoluteFill>
  );
};

// F4 172.3 "… at Kushira, an air base in Kagoshima."
export const KushiraShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02), y: 60 }} light={{ dir: [-0.7, 0.6] }}>
        <Airfield mood="day">
          {[0, 1].map((i) => (
            <Character key={i} {...PILOT(i)} x={-60 + i * 110 + frame * 1.4} y={-300 - i * 6} s={0.5} z={2 + i * 0.01} look={0.5} expression={{ eyes: "open", mouth: "flat" }} pose={poses.walk(frame + i * 7, 0.8)} />
          ))}
        </Airfield>
      </Stage>
      <Label text="KUSHIRA AIR BASE" sub="KAGOSHIMA · KYUSHU" x={0.5} y={0.16} size={0.085} kind="title" at={sec(start)(172.51)} />
    </AbsoluteFill>
  );
};

// F5 175.0 "When the battle of Okinawa begins,"
export const OkinawaBattleShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 60, shake: hitAt(t, 175.8, 0.4) * 6 }} light={{ dir: [-0.6, 0.8] }}>
        <OkinawaSea mood="dusk" horizon={-60}>
          <Flak w={1800} h={500} n={12} y={300} z={-10} />
          <Warship kind="destroyer" x={-620} y={-50} len={520} z={1} />
          <Warship x={160} y={-140} len={1100} z={2} />
          <Warship kind="destroyer" x={760} y={-60} len={460} z={1} />
          {[175.4, 175.9, 176.5].map((at, i) => {
            const k = (t - at) / 0.7;
            return k > 0 && k < 1.6 ? <Burst key={at} x={[-300, 420, -40][i]} y={[260, 340, 420][i]} t={k} size={0.6} seed={i + 2} z={3} /> : null;
          })}
        </OkinawaSea>
      </Stage>
      <Label text="BATTLE OF OKINAWA" sub="APRIL 1945" x={0.5} y={0.14} size={0.08} kind="title" at={sec(start)(175.79)} />
    </AbsoluteFill>
  );
};

// F6 176.85 "… his officers give him an order."
export const OrderShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.08, y: -40 }} light={{ pos: [420, 200] }}>
        <SickBay>
          <Character {...NAVY_OFFICER(0)} x={-330} y={-560} s={1.4} z={2} look={0.5} talking={t > 177.1} expression={{ eyes: "angry", mouth: "shout", brows: -0.7 }} pose={poses.point(frame)} />
          <Character {...DOCTOR} x={330} y={-580} s={1.25} z={2} facing={-1} look={0.5} expression={{ eyes: "wide", mouth: "flat", brows: 0.3 }} pose={t > 178.1 ? poses.salute : poses.idle(frame)} />
        </SickBay>
      </Stage>
      <Label text="ORDERS" x={0.5} y={0.14} size={0.08} kind="stamp" rotate={-6} at={sec(start)(178.09)} />
    </AbsoluteFill>
  );
};

// F7 178.65 "Before each mission, inject the pilots."
export const InjectPilotsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const jab = ramp(t, 180.0, 180.3);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -20 }} light={{ dir: [-0.7, 0.6] }}>
        <Airfield mood="dawn" planes>
          {[0, 1, 2, 3].map((i) => (
            <Character key={i} {...PILOT(i)} x={-120 - i * 210} y={-560 + i * 12} s={1.1 - i * 0.05} z={3 - i * 0.01} look={0.5} expression={{ eyes: "half", mouth: "flat", brows: 0.3 }} pose={i === 0 ? { armF: [1.35, 0.1], armB: [-0.2, -0.1] } : poses.idle(frame, i)} />
          ))}
          <Character
            {...DOCTOR}
            x={interpolate(jab, [0, 1], [380, 300])}
            y={-560}
            s={1.15}
            z={3.1}
            facing={-1}
            look={0.5}
            expression={{ eyes: "open", mouth: "flat", brows: 0.4 }}
            pose={{ armF: [1.5, 0.2], armB: [0.6, 0.6] }}
            holdF={<Syringe s={0.7} rot={-1.7 + Math.PI / 2} />}
          />
        </Airfield>
      </Stage>
      <Label text="BEFORE EACH MISSION" x={0.5} y={0.13} size={0.06} kind="box" at={sec(start)(178.83)} />
    </AbsoluteFill>
  );
};

// F8 181.5 "The medicine comes in small brown glass tubes."
export const BrownTubesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08) }} light={{ dir: [-0.6, 0.8] }} vignette={0.65}>
        <ObjectBack color="#3a2418" glow="#ff9a4a">
          <X y={-330} z={0}>
            <Part shape={roundRect(1000, 120, 10)} color="#6e4a2c" shade={0.2} y={-40} />
          </X>
          {[-360, -180, 0, 180, 360].map((x, i) => (
            <Ampoule key={x} x={x} y={-310} s={2.1 * pop(t, 182.6 + i * 0.12)} glow={t > 183.36 ? 0.8 : 0} z={1 + i * 0.01} />
          ))}
        </ObjectBack>
      </Stage>
      <Label text="BROWN GLASS" x={0.5} y={0.14} size={0.08} kind="title" at={sec(start)(183.36)} />
    </AbsoluteFill>
  );
};

// F9 184.8 '"It will wake them up," he's told.'
export const WakeThemShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const s = 2.1;
  const b = pop(t, 185.0);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 }} light={{ pos: [420, 200] }}>
        <SickBay>
          <Character {...NAVY_OFFICER(1)} x={-360} y={-30 - 308 * s} s={s} z={2} look={0.45} talking={t < 186.0} expression={{ eyes: "half", mouth: "smirk", brows: -0.4 }} pose={{ armF: [1.3, 0.6], armB: [-0.2, -0.1] }} />
          <SpeechBubble x={380} y={220} w={620} h={240} tx={80} ty={120} s={b} z={10} />
        </SickBay>
      </Stage>
      {b > 0 ? <Label text={"IT WILL\nWAKE THEM UP"} x={0.5 + 380 / 1920} y={0.5 - 220 / 1080} size={0.05} color="#211b20" at={0} /> : null}
    </AbsoluteFill>
  );
};

// F10 186.75 "So he does it."
export const DoesItShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const inn = ramp(t, 186.85, 187.2, Easing.out(Easing.cubic));
  const press = ramp(t, 187.3, 187.8);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0, shake: hitAt(t, 187.2, 0.3) * 3 }} light={{ dir: [-0.6, 0.8] }}>
        <Airfield mood="dawn" planes={false} petals={false} />
        <Wash width={4000} height={3000} color="#e9d2c4" alpha={0.5} z={-5} />
        <Forearm x={-160} y={-40} s={1.15} sleeve="#6e5a42" z={1} />
        <X x={interpolate(inn, [0, 1], [760, 330])} y={-20 + (1 - inn) * 30} rot={Math.PI - 0.22} s={2.0} z={3}>
          <Syringe fill={0.75} push={press} />
        </X>
      </Stage>
    </AbsoluteFill>
  );
};

// F11 187.95 "Again and again, until the war ends."
export const AgainShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const beat = Math.floor((t - 188.0) / 0.42);
  const ph = ((t - 188.0) / 0.42) % 1;
  const sleeves = ["#7a6044", "#6e5a42", "#806548", "#5e4c36", "#74513a"];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 + Math.max(0, beat) * 0.01, shake: (ph < 0.2 ? 1 : 0) * 2 }} light={{ dir: [-0.6, 0.8] }} vignette={0.6}>
        <Airfield mood="day" planes={false} petals={false} />
        <Wash width={4000} height={3000} color="#e9d2c4" alpha={0.5} z={-5} />
        <Forearm x={-160 + (ph < 0.15 ? (1 - ph / 0.15) * -500 : 0)} y={-40} s={1.15} sleeve={sleeves[Math.max(0, beat) % sleeves.length]} z={1} />
        <X x={330} y={-20} rot={Math.PI - 0.22} s={2.0} z={3}>
          <Syringe fill={0.75} push={interpolate(ph, [0.3, 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
        </X>
        <X x={620} y={330} z={4}>
          <Calendar2 page={Math.max(0, beat)} />
        </X>
      </Stage>
      <Label text={["APR", "MAY", "JUN", "JUL", "AUG", "AUG"][Math.min(5, Math.max(0, beat))] + " 1945"} x={0.5 + 620 / 1920} y={0.5 - (330 + 70) / 1080} size={0.04} color="#ffffff" at={0} />
    </AbsoluteFill>
  );
};

/** Small tear-off calendar block. */
const Calendar2: React.FC<{ page: number }> = ({ page }) => (
  <X>
    <Part shape={roundRect(240, 260, 10)} color="#f4f1ea" shade={0.12} />
    <Part shape={roundRect(240, 70, 10)} color="#c8262f" y={95} z={0.001} />
    {Array.from({ length: 12 }, (_, i) => (
      <Part key={i} shape={roundRect(34, 34, 4)} color={i < page * 2 ? "#f2c0b8" : "#ffffff"} flat outline={3} x={-75 + (i % 4) * 50} y={20 - Math.floor(i / 4) * 48} z={0.002} />
    ))}
  </X>
);

// F12 190.85 "By his own count, at least 200 young men."
export const TallyShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const n = Math.round(ramp(t, 191.1, 192.8, (x) => x) * 40);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), shake: hitAt(t, 192.79, 0.4) * 5 }} light={{ dir: [-0.6, 0.8] }} vignette={0.6}>
        <ObjectBack color="#3a3028" glow="#ffd27a">
          <X y={-20} rot={-0.03} z={0}>
            <Part shape={roundRect(1300, 760, 10)} color="#efe6cf" shade={0.12} />
            {Array.from({ length: 12 }, (_, r) => (
              <Line key={r} pts={[[-620, 300 - r * 56], [620, 300 - r * 56]]} width={3} color="#b9c8d8" z={0.001} />
            ))}
            {Array.from({ length: n }, (_, g) => {
              const gx = -540 + (g % 8) * 140;
              const gy = 240 - Math.floor(g / 8) * 130;
              return (
                <X key={g} x={gx} y={gy} z={0.01}>
                  {[0, 1, 2, 3].map((k) => (
                    <Line key={k} pts={[[k * 22, 46], [k * 22 + 3, -46]]} width={8} color="#2a2a3a" />
                  ))}
                  <Line pts={[[-12, -36], [80, 36]]} width={8} color="#2a2a3a" z={0.001} />
                </X>
              );
            })}
          </X>
        </ObjectBack>
      </Stage>
      <Label text="200" sub="YOUNG MEN" x={0.5} y={0.38} size={0.2} kind="title" at={sec(start)(192.79)} />
    </AbsoluteFill>
  );
};

// F13 194.3 "He remembers how quiet they are."
export const QuietShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40 }} light={{ pos: [420, 200] }} shadowMul={[0.55, 0.5, 0.62]} vignette={0.7}>
        <Barracks floorY={-460} light="#c8d8ff">
          {[0, 1, 2].map((i) => (
            <Character key={i} {...PILOT(i)} x={-560 + i * 400} y={-470} s={1.15} z={2 + i * 0.01} look={0.3} expression={{ eyes: "half", mouth: "flat", brows: 0.4, gaze: [0.2, -0.7] }} pose={{ ...poses.sit(frame), headTilt: -0.06 }} />
          ))}
        </Barracks>
      </Stage>
    </AbsoluteFill>
  );
};

// F14 196.05 "As if they've already said goodbye to life."
export const GoodbyeShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -40 }} light={{ pos: [0, 300] }} shadowMul={[0.55, 0.5, 0.62]} vignette={0.75}>
        <TatamiRoom floorY={-300} light={0.2}>
          <Character {...PILOT(2)} x={-80} y={-470} s={1.3} z={2} look={0.2} expression={{ eyes: "half", mouth: "flat", brows: 0.5, gaze: [0.3, -0.9] }} pose={{ ...poses.sit(frame), armF: [1.0, 1.0] }} />
          <LowTable x={140} y={-500} w={520} z={3} />
          <X x={180} y={-290} rot={0.06} z={3.1}>
            <Part shape={roundRect(240, 150, 4)} color="#f4f1ea" shade={0.08} />
            {[40, 0, -40].map((y) => (
              <Line key={y} pts={[[-90, y], [90, y]]} width={4} color="#5a5a6a" z={0.001} />
            ))}
          </X>
          <Petals w={2000} h={1200} n={14} seed={9} speed={0.6} z={20} />
        </TatamiRoom>
      </Stage>
    </AbsoluteFill>
  );
};

// F15 198.4 'One pilot looks at him and says, "You're lucky, doctor.'
export const LuckyShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.08, y: -40 }} light={{ dir: [0.6, 0.5] }} shadowMul={[0.6, 0.55, 0.65]}>
        <Airfield mood="dusk" planes trees>
          <Character {...PILOT(0)} x={-320} y={-580} s={1.4} z={2} look={0.6} talking={t > 200.3} expression={{ eyes: "half", mouth: "smile", brows: 0.4 }} pose={poses.idle(frame)} />
          <Character {...DOCTOR} x={340} y={-580} s={1.35} z={2} facing={-1} look={0.6} expression={{ eyes: "open", mouth: "flat", brows: 0.5 }} pose={poses.idle(frame, 2)} />
        </Airfield>
      </Stage>
    </AbsoluteFill>
  );
};

// F16 201.5 '"You don't have to die."'
export const DontHaveToShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const s = 2.4;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [0.6, 0.5] }} shadowMul={[0.6, 0.55, 0.65]} vignette={0.6}>
        <Airfield mood="dusk" planes={false} trees={false} petals>
          <Character {...PILOT(0)} x={-120} y={-10 - 308 * s} s={s} z={2} look={0.45} talking={t < 202.6} expression={{ eyes: "sad", mouth: "smile", brows: 0.6 }} pose={poses.idle(frame)} />
        </Airfield>
      </Stage>
    </AbsoluteFill>
  );
};

// F17 202.9 "He has no answer."
export const NoAnswerShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const s = 2.4;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ dir: [0.6, 0.5] }} shadowMul={[0.55, 0.5, 0.62]} vignette={0.75}>
        <Airfield mood="dusk" planes={false} trees={false} petals={false} />
        <Wash width={4000} height={3000} color="#2a2040" alpha={0.35} z={-5} />
        <Character {...DOCTOR} x={140} y={-10 - 308 * s} s={s} z={2} facing={-1} look={0.4} expression={{ eyes: "half", mouth: "flat", brows: 0.6, gaze: [0.2, -0.8] }} pose={poses.idle(frame)} />
      </Stage>
    </AbsoluteFill>
  );
};

// F18 204.15 "Only after the war does he understand what was in those brown tubes."
export const UnderstandShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const realize = t > 205.8;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.1), y: -40 }} light={{ pos: [0, 300] }} shadowMul={[0.55, 0.5, 0.62]} vignette={0.7}>
        <TatamiRoom floorY={-300} light={0.15}>
          <HangingLamp x={60} y={560} cord={180} color="#4a3a2a" cone={900} coneW={700} z={10} />
          <Character
            {...DOCTOR_CIVIL}
            x={-60}
            y={-470}
            s={1.4}
            z={2}
            look={0.5}
            expression={realize ? { eyes: "wide", mouth: "o", brows: 0.7, sweat: true } : { eyes: "open", mouth: "flat", brows: 0.3, gaze: [0.7, 0.2] }}
            pose={{ ...poses.sit(frame), armF: [1.9, 1.0] }}
            holdF={<Ampoule s={0.9} rot={-Math.PI / 2 + 0.3} glow={realize ? 0.6 : 0} />}
          />
        </TatamiRoom>
      </Stage>
      <Label text="AFTER THE WAR" x={0.2} y={0.12} size={0.06} kind="box" at={sec(start)(204.64)} />
    </AbsoluteFill>
  );
};

// F19 208.3 "Hiropon."
export const HiroponRevealShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const hit = hitAt(t, 208.45, 0.5);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 + hit * 0.06, shake: hit * 10 }} light={{ dir: [-0.6, 0.8] }} vignette={0.6}>
        <Sunburst r={2600} rays={22} color="#7a2a2a" alt="#6a2222" speed={0.8} z={-20} />
        <HiroponBox y={-360} s={1.8} z={1} />
      </Stage>
      <Label text="ヒロポン" x={0.5} y={0.5 - (-360 + 180 * 1.8) / 1080} size={0.07} color="#ffffff" at={0} font={CJK} />
      <Label text="HIROPON" x={0.5} y={0.16} size={0.12} kind="title" at={sec(start)(208.45)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── G · the myth ─────────────────────────

// G1 209.6 "So, were the kamikaze drugged into dying?"
export const DruggedIntoDyingShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const s = 1.9;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.8] }} vignette={0.6}>
        <Sunburst r={2600} rays={20} color="#4a4a6a" alt="#42425e" speed={0.5} z={-40} />
        <Character {...PILOT(1)} x={-260} y={-60 - 308 * s} s={s} z={1} look={0.4} expression={{ eyes: "open", mouth: "flat", brows: 0.3 }} pose={poses.idle(frame)} />
        <X x={330} y={-40} rot={0.5} s={2.6 * pop(t, 211.37)} z={2}>
          <Syringe fill={0.8} />
        </X>
        <QuestionMark x={420} y={260} s={1.0 * pop(t, 211.97)} rot={0.1} z={3} />
      </Stage>
    </AbsoluteFill>
  );
};

// G2 212.7 "Not the way the myth says."
export const MythShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const s = 1.7;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), shake: hitAt(t, 213.5, 0.35) * 8 }} light={{ dir: [-0.6, 0.8] }} vignette={0.6}>
        <Part shape={roundRect(4000, 3000, 0)} color="#3a2a30" flat outline={0} z={-40} />
        <X y={10} z={-10}>
          <Part shape={roundRect(980, 1000, 10)} color="#e8c070" shade={0.12} />
          <Part shape={roundRect(900, 680, 6)} color="#b8322a" flat outline={5} y={60} z={0.001} />
        </X>
        <Sunburst r={480} rays={16} color="#d24a3a" alt="#b8322a" speed={0.5} y={70} z={-9.9} />
        <Character {...PILOT(2)} x={0} y={-200 - 308 * s + 200} s={s} z={1} look={0.1} expression={{ eyes: "dead", mouth: "teeth", brows: -0.9 }} pose={poses.armsUp(frame)} />
      </Stage>
      <Label text="DRUGGED TO DIE?" x={0.5} y={0.1} size={0.065} color="#ffe6a0" at={0} />
      <Label text="MYTH" x={0.5} y={0.42} size={0.2} kind="stamp" rotate={-12} at={sec(start)(213.5)} />
    </AbsoluteFill>
  );
};

// G3 214.5 "Meth doesn't make you want to die."
export const NotWantDieShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ dir: [-0.6, 0.8] }} vignette={0.6}>
        <ObjectBack color="#2a2430" glow="#ffcf7a">
          <Ampoule x={-420} y={-260} s={3.0} glow={0.8} z={1} />
          <Line pts={[[-160, 40], [-40, 40]]} width={16} color="#ffffff" z={1} />
          <Line pts={[[-160, -20], [-40, -20]]} width={16} color="#ffffff" z={1} />
          <Line pts={[[-80, -80], [-120, 100]]} width={16} color="#fe5649" z={1.01} />
          {t > 216.1 ? <Line pts={[[0, 10], [820, 30]]} width={20} color="#fe5649" z={3} /> : null}
        </ObjectBack>
      </Stage>
      <Label text={"WANT\nTO DIE"} x={0.5 + 400 / 1920} y={0.47} size={0.1} color="#ffffff" at={sec(start)(215.74)} />
    </AbsoluteFill>
  );
};

// G4 216.7 "It doesn't control your mind."
export const PuppetShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const cut = ramp(t, 217.7, 218.1, Easing.in(Easing.quad));
  const s = 1.5;
  const fy = -560;
  const bar = 420 + cut * 400;
  const hands: [number, number][] = [[-170, fy + 520], [170, fy + 520], [0, fy + 660]];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -20 }} light={{ dir: [-0.6, 0.8] }} vignette={0.6}>
        <Sunburst r={2600} rays={20} color="#6a7a9a" alt="#62728f" speed={0.4} z={-40} />
        <X y={bar} rot={Math.sin(frame * 0.1) * 0.05 * (1 - cut)} z={5}>
          <Part shape={roundRect(520, 40, 10)} color="#9d6e3c" shade={0.2} />
          <Part shape={roundRect(40, 300, 10)} color="#9d6e3c" shade={0.2} z={-0.01} />
        </X>
        {cut < 1
          ? hands.map(([hx, hy], i) => (
              <Line key={i} pts={[[[-240, 240, 0][i], bar], [hx, hy + (bar - hy) * cut]]} width={4} color="#f4f1ea" z={4} />
            ))
          : null}
        <Character
          {...PILOT(0)}
          x={0}
          y={fy}
          s={s}
          z={2}
          look={0.1}
          expression={t > 217.9 ? { eyes: "open", mouth: "smile", brows: 0.1 } : { eyes: "half", mouth: "flat", brows: 0.4 }}
          pose={t > 217.9 ? poses.idle(frame) : { armF: [2.0 + Math.sin(frame * 0.1) * 0.2, 0.2], armB: [-2.0 - Math.sin(frame * 0.1) * 0.2, -0.2], armsOverHead: false }}
        />
      </Stage>
      <Label text="NO MIND CONTROL" x={0.5} y={0.12} size={0.065} kind="box" at={sec(start)(217.66)} />
    </AbsoluteFill>
  );
};

// G5 218.45 "It keeps you awake, alert and pumped up."
export const AwakeAlertShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const pumped = t > 220.57;
  const s = 1.6;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 + hitAt(t, 220.6, 0.4) * 0.05 }} light={{ dir: [-0.6, 0.8] }} vignette={0.5}>
        <Sunburst r={2600} rays={22} color={pumped ? "#f0a040" : "#e9c98a"} alt={pumped ? "#e6903a" : "#e1bd7a"} speed={pumped ? 2 : 0.6} z={-40} />
        <Character
          {...PILOT(1)}
          x={-320}
          y={-560}
          s={s}
          z={2}
          look={0.3}
          expression={pumped ? { eyes: "wide", mouth: "grin", brows: -0.4 } : { eyes: "wide", mouth: "flat", brows: 0.1 }}
          pose={pumped ? poses.armsUp(frame) : poses.idle(frame)}
        />
      </Stage>
      <Label text="AWAKE" x={0.7} y={0.24} size={0.08} kind="box" at={sec(start)(219.08)} />
      <Label text="ALERT" x={0.7} y={0.4} size={0.08} kind="box" at={sec(start)(219.76)} />
      <Label text="PUMPED UP" x={0.7} y={0.56} size={0.08} kind="box" at={sec(start)(220.57)} />
    </AbsoluteFill>
  );
};

// G6 221.3 "That's it."
export const ThatsItShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const s = 2.2;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 }} light={{ dir: [-0.6, 0.8] }} vignette={0.5}>
        <Sunburst r={2600} rays={20} color="#9fb4c8" alt="#94a9be" speed={0.3} z={-40} />
        <Character {...PILOT(1)} x={0} y={-20 - 308 * s} s={s} z={2} look={0.1} expression={{ eyes: "open", mouth: "flat", brows: 0.2 }} pose={poses.shrug(ramp(t, 221.4, 221.7))} />
      </Stage>
    </AbsoluteFill>
  );
};

/** Giant mitten hand (pushing). Origin = wrist, fingers toward +x. */
const BigHand: React.FC<{ x: number; y: number; s?: number; rot?: number; z?: number; color?: string }> = ({ x, y, s = 1, rot = 0, z = 0, color = "#3a3442" }) => (
  <X x={x} y={y} s={s} rot={rot} z={z}>
    <Part shape={roundRect(400, 150, 70)} color={color} shade={0.2} x={-200} />
    <Part shape={blob([[-20, -80], [120, -90], [190, -50], [200, 30], [150, 90], [40, 96], [-20, 80]], 8)} color="#f6f5f8" shade={0.2} z={0.01} />
    <Part shape={blob([[60, 80], [110, 150], [150, 140], [130, 70]], 6)} color="#f6f5f8" shade={0.2} z={0.005} />
  </X>
);

// G7 222.2 "These pilots were pushed long before anyone touched their arm."
export const PushedShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const shove = ramp(t, 223.1, 223.5, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -20, shake: hitAt(t, 223.3, 0.3) * 6 }} light={{ dir: [-0.6, 0.8] }}>
        <Airfield mood="dusk" planes trees>
          <Character
            {...PILOT(0)}
            x={-40 + shove * 140}
            y={-580}
            s={1.4}
            z={3}
            look={0.5}
            expression={{ eyes: "open", mouth: "flat", brows: 0.6, sweat: true }}
            pose={{ ...poses.idle(frame), lean: -0.15 * shove }}
          />
          <BigHand x={-480 + shove * 160} y={-180} s={1.4} rot={0.05} z={2} color="#23283a" />
          <BigHand x={-560 + shove * 140} y={60} s={1.2} rot={-0.15} z={1.9} color="#8f8a58" />
        </Airfield>
      </Stage>
    </AbsoluteFill>
  );
};

// G8 225.5 "By their officers."
export const ByOfficersShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.05, y: -20 }} light={{ dir: [-0.7, 0.6] }}>
        <Airfield mood="day" planes>
          <Character {...NAVY_OFFICER(0)} x={-420} y={-560} s={1.45} z={3} look={0.5} talking expression={{ eyes: "angry", mouth: "shout", brows: -0.9 }} pose={poses.point(frame)} />
          {[0, 1, 2].map((i) => (
            <Character key={i} {...PILOT(i)} x={160 + i * 250} y={-560 + i * 10} s={1.15} z={2 - i * 0.01} facing={-1} look={0.4} expression={{ eyes: "open", mouth: "flat", brows: 0.2 }} pose={poses.salute} />
          ))}
        </Airfield>
      </Stage>
      <Label text="OFFICERS" x={0.22} y={0.13} size={0.07} kind="box" at={sec(start)(225.95)} />
    </AbsoluteFill>
  );
};

// G9 226.55 "By their training."
export const ByTrainingShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0, y: 0 }} light={{ dir: [-0.7, 0.6] }}>
        <Airfield mood="day" planes={false}>
          {Array.from({ length: 8 }, (_, i) => (
            <Character
              key={i}
              {...PILOT(i)}
              x={-700 + (i % 4) * 300 + ((frame * 3) % 300) - 150}
              y={-430 - Math.floor(i / 4) * 130}
              s={0.75 - Math.floor(i / 4) * 0.08}
              z={2 - Math.floor(i / 4) * 0.1 + (i % 4) * 0.001}
              look={0.5}
              expression={{ eyes: "half", mouth: "teeth", brows: -0.3 }}
              pose={poses.run(frame + i * 3, i)}
            />
          ))}
          <Character {...SOLDIER_INSTRUCTOR} x={640} y={-560} s={1.2} z={3} facing={-1} look={0.5} talking expression={{ eyes: "angry", mouth: "shout", brows: -0.8 }} pose={poses.handsOnHips} />
        </Airfield>
      </Stage>
      <Label text="TRAINING" x={0.2} y={0.13} size={0.07} kind="box" at={sec(start)(227.12)} />
    </AbsoluteFill>
  );
};
const SOLDIER_INSTRUCTOR = GENERAL(1);

// G10 227.85 "By a whole country telling them that dying for the emperor was the greatest honor."
export const SendOffShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 0 }} light={{ dir: [-0.7, 0.6] }}>
        <Airfield mood="day" planes>
          {Array.from({ length: 7 }, (_, i) => {
            const cast = i % 3 === 0 ? GIRL(i) : i % 3 === 1 ? WORKER(i) : SURVIVOR(i);
            const wave = Math.sin(frame * 0.3 + i) * 0.25;
            return (
              <Character
                key={i}
                {...cast}
                x={-860 + i * 290}
                y={-470 - (i % 2) * 40}
                s={0.95}
                z={1 + (i % 2 ? -0.1 : 0) + i * 0.001}
                facing={i < 3 ? 1 : -1}
                look={0.5}
                expression={{ eyes: "happy", mouth: "grin" }}
                pose={{ armF: [2.6 + wave, 0.3], armB: [-0.2, -0.1], armsOverHead: true }}
                holdF={i % 3 === 0 ? <SakuraBranch /> : <HandFlag />}
              />
            );
          })}
          <Character {...PILOT(0)} x={0} y={-640} s={1.25} z={3} look={0.2} expression={{ eyes: "open", mouth: "flat", brows: 0.2 }} pose={poses.salute} />
        </Airfield>
      </Stage>
      <Label text="EMPEROR" x={0.2} y={0.13} size={0.07} kind="box" at={sec(start)(230.19)} />
      <Label text="GREATEST HONOR" x={0.7} y={0.13} size={0.07} kind="box" at={sec(start)(230.88)} />
    </AbsoluteFill>
  );
};

/** Hand-held rising-sun flag on a stick (held at the stick's base, pointing +y of the hand). */
const HandFlag: React.FC = () => (
  <X rot={-Math.PI / 2}>
    <Line pts={[[0, -20], [0, 150]]} width={6} />
    <X x={4} y={150} z={0.01}>
      <Part shape={roundRect(110, 72, 3)} color="#f6f2ea" shade={0.12} x={55} y={-36} />
      <Part shape={circle(20)} color="#c8262f" flat outline={0} x={55} y={-36} z={0.001} />
    </X>
  </X>
);

/** Cherry-blossom branch (schoolgirls waved these at the tokko send-offs). */
const SakuraBranch: React.FC = () => (
  <X rot={-Math.PI / 2}>
    <Line pts={[[0, -20], [10, 80], [-10, 160]]} width={8} color="#5a3a26" />
    {[[10, 80], [-10, 160], [30, 120], [-30, 110], [0, 190]].map(([x, y], i) => (
      <Part key={i} shape={circle(26)} color="#f6c1d1" shade={0.15} x={x} y={y} z={0.01 + i * 0.001} />
    ))}
  </X>
);

// G11 231.85 "The shot only made sure they didn't fall asleep on the way."
export const AwakeOnWayShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 40 }} light={{ dir: [-0.6, 0.8] }}>
        <OkinawaSea mood="day" horizon={-300}>
          <SpeedLines w={2400} h={900} n={12} speed={40} color="#ffffff" z={-10} />
          <ZeroFighter
            x={-80}
            y={-20 + Math.sin(frame * 0.06) * 10}
            s={1.7}
            gear={false}
            spin={1}
            z={1}
            pilot={<Character {...PILOT(1)} y={-78} s={0.38} shadow={false} look={0.5} expression={{ eyes: "wide", mouth: "flat", brows: -0.1 }} pose={{ armF: [0.6, 0.6], armB: [-0.2, -0.1] }} />}
          />
        </OkinawaSea>
      </Stage>
      <Label text="Zzz" x={0.8} y={0.22} size={0.08} at={sec(start)(232.6)} />
      {t > 233.55 ? <Label text="✕" x={0.8} y={0.22} size={0.16} color="#fe5649" at={0} /> : null}
    </AbsoluteFill>
  );
};

// G12 234.75 "And Japan wasn't the only one."
export const NotOnlyOneShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const inL = ramp(t, 235.8, 236.3, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 0.94), y: -20 }} light={{ dir: [-0.6, 0.8] }} vignette={0.6}>
        <Sunburst r={2600} rays={20} color="#5a6a7a" alt="#52626f" speed={0.4} z={-40} />
        <Character {...PILOT(0)} x={0} y={-560} s={1.35} z={2} look={0.1} expression={{ eyes: "open", mouth: "flat", brows: 0.2 }} pose={poses.idle(frame)} />
        <Character {...GERMAN(0)} x={interpolate(inL, [0, 1], [-1300, -520])} y={-560} s={1.3} z={1.9} look={0.4} expression={{ eyes: "open", mouth: "flat", brows: 0.0 }} pose={inL < 1 ? poses.walk(frame) : poses.idle(frame, 3)} />
        <Character {...AIRCREW(0)} x={interpolate(inL, [0, 1], [1300, 520])} y={-560} s={1.3} z={1.9} facing={-1} look={0.4} expression={{ eyes: "open", mouth: "smile", brows: 0.0 }} pose={inL < 1 ? poses.walk(frame) : poses.idle(frame, 5)} />
      </Stage>
    </AbsoluteFill>
  );
};

// G13 236.7 "German soldiers marched on pills called Pervitin."
export const PervitinShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: 20 }} light={{ dir: [-0.7, 0.6] }}>
        <Backdrop mood="day" horizon={-160} kaimon={false} />
        <X y={-160} z={-30}>
          <Ground w={5000} h={1600} color="#9aa86a" far="#a8b67a" pebbles={10} tufts={20} />
        </X>
        {[0, 1, 2, 3, 4].map((i) => (
          <Character key={i} {...GERMAN(i)} x={-900 + i * 230 + ((frame * 2.5) % 230)} y={-480 - (i % 2) * 20} s={0.95} z={2 - (i % 2) * 0.1 + i * 0.001} look={0.5} expression={{ eyes: "wide", mouth: "flat", brows: -0.3 }} pose={poses.walk(frame + i * 4, 1.2)} />
        ))}
        <X x={560} y={-200} s={1.8 * pop(t, 238.75)} rot={0.1} z={5}>
          <PillTube label="#c8262f" />
        </X>
      </Stage>
      <Label text="PERVITIN" sub="GERMANY" x={0.78} y={0.16} size={0.08} kind="title" at={sec(start)(238.75)} />
    </AbsoluteFill>
  );
};

// G14 239.6 "British and American bomber crews took Benzedrine."
export const BenzedrineShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: 20 }} light={{ dir: [-0.7, 0.6] }}>
        <Backdrop mood="dusk" horizon={-160} kaimon={false} />
        <X y={-160} z={-30}>
          <Ground w={5000} h={1600} color="#6a7a4a" far="#7a8a56" pebbles={0} tufts={10} />
        </X>
        <Bomber x={-80} y={-40} s={1.25} insignia={t > 240.4 ? "us" : "raf"} z={-5} />
        {[0, 1, 2].map((i) => (
          <Character key={i} {...AIRCREW(i)} x={-560 + i * 260} y={-560 + (i % 2) * 10} s={1.05} z={2 + i * 0.01} look={0.4} expression={{ eyes: "open", mouth: i === 1 ? "smile" : "flat", brows: 0.1 }} pose={poses.idle(frame, i)} />
        ))}
        <X x={560} y={-300} s={1.8 * pop(t, 241.53)} rot={-0.1} z={5}>
          <PillTube label="#2f4f9a" />
        </X>
      </Stage>
      <Label text="BENZEDRINE" sub="BRITAIN · USA" x={0.76} y={0.16} size={0.08} kind="title" at={sec(start)(241.53)} />
    </AbsoluteFill>
  );
};

// G15 242.4 "World War Two, it turns out, ran on speed."
export const RanOnSpeedShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.1), shake: hitAt(t, 244.89, 0.4) * 8 }} light={{ dir: [-0.6, 0.8] }} vignette={0.6}>
        <Sunburst r={2600} rays={24} color="#c84a3a" alt="#b8402f" speed={2.5} z={-40} />
        <SpeedLines w={2600} h={1200} n={20} speed={60} color="#ffd2b8" z={-30} />
        <Ampoule x={-420} y={-260} s={2.4} glow={0.6} z={1} />
        <X x={0} y={-300} s={2.0} z={1}>
          <PillTube label="#c8262f" />
        </X>
        <X x={420} y={-300} s={2.0} z={1}>
          <PillTube label="#2f4f9a" />
        </X>
      </Stage>
      <Label text="WWII" x={0.5} y={0.14} size={0.1} kind="title" at={sec(start)(242.76)} />
      <Label text="RAN ON SPEED" x={0.5} y={0.28} size={0.09} kind="stamp" rotate={-6} at={sec(start)(244.74)} />
    </AbsoluteFill>
  );
};

export { Calendar2 };
