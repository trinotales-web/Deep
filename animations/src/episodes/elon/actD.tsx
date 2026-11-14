import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, DepthStage, X, Part, Line, Glow, Wash, roundRect, circle, ellipse, poly, blob, push, hitAt, absT, ramp, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  Monitor, XMark, WorldMap, CITY, Calendar, HospitalBed, HeartMonitor, IVStand, Cheque, MoneyBag, Mosquito, Acacia, SavannaSet, Candle, Planet, Greenhouse, MoscowSet,
  Pie, Falcon1, Falcon9, Laptop, Gavel, Roadster, BatteryGrid, BatteryCell, Room, Window, Skyline, Sea, PalmTree, Stars, SpaceBack, Mic, SedanEV, Hangar, Doc, Banknote,
} from "../../kit/env";
import { sec, pop, useScr } from "../../kit/shot";
import { Office, ChipsTable, Paper, SkyBack, SeaSet, SpaceSet, DashArrow, Outdoors, RoadSet } from "./sets";
import { ELON_SUIT, ELON_2008, ELON_ZIP2, JUSTINE, SUIT, STAFF, RUSSIAN, EBERHARD, TARPENNING, THIEL, PERSON } from "./cast";
import { upright } from "./actA";

// X.com and PayPal (1999–2002), malaria, the PayPal Mafia, the Mars dream,
// Russia and first principles, SpaceX (2002) and Tesla (2004).

/** 1999-style web page in a monitor: title bar, logo block, buttons. */
const WebPage: React.FC<{ w?: number; h?: number; logo?: React.ReactNode }> = ({ w = 700, h = 440, logo }) => (
  <X>
    <Part shape={roundRect(w, h, 4)} color="#d8d8d0" flat outline={0} />
    <Part shape={roundRect(w, 40, 0)} color="#2a4a9a" flat outline={0} y={h / 2 - 20} z={0.001} />
    <X y={60} z={0.002}>{logo}</X>
    {[-1, 0, 1].map((i) => (
      <Part key={i} shape={roundRect(160, 44, 8)} color={["#e9ba41", "#3fa07a", "#c8462f"][i + 1]} flat outline={3} x={i * 200} y={-h / 2 + 70} z={0.002} />
    ))}
  </X>
);

/** Sydney Opera House silhouette (sails). Origin = base centre. */
const OperaHouse: React.FC<{ x?: number; y?: number; s?: number; z?: number }> = ({ x = 0, y = 0, s = 1, z = 0 }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={roundRect(900, 70, 4)} color="#c8b8a0" shade={0.15} y={35} />
    {[[-300, 260], [-120, 320], [60, 280], [230, 220]].map(([sx, h], i) => (
      <Part key={i} shape={poly([[sx - 120, 70], [sx + 110, 70], [sx + 40, 70 + h]])} color="#f2efe8" shade={0.2} z={0.001 + i * 0.001} />
    ))}
  </X>
);

/** Teddy bear (sitting). */
const Teddy: React.FC<{ x?: number; y?: number; s?: number; z?: number }> = ({ x = 0, y = 0, s = 1, z = 0 }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={ellipse(70, 80)} color="#b98a5a" shade={0.24} y={70} />
    <Part shape={circle(56)} color="#b98a5a" shade={0.24} y={170} z={0.001} />
    {[-1, 1].map((k) => (
      <Part key={k} shape={circle(22)} color="#b98a5a" shade={0.24} x={k * 44} y={214} z={0.0005} />
    ))}
    <Part shape={ellipse(22, 16)} color="#e8d0a8" flat outline={3} y={156} z={0.002} />
    {[-1, 1].map((k) => (
      <Part key={`e${k}`} shape={circle(5)} color="#211b20" flat outline={0} x={k * 18} y={180} z={0.002} />
    ))}
  </X>
);

/** Baby crib (side view). */
const Crib: React.FC<{ x?: number; y?: number; s?: number; z?: number }> = ({ x = 0, y = 0, s = 1, z = 0 }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={roundRect(700, 40, 8)} color="#e8e2d8" shade={0.2} y={200} />
    <Part shape={roundRect(660, 60, 20)} color="#cfe4f2" shade={0.15} y={240} z={-0.001} />
    {Array.from({ length: 12 }, (_, i) => (
      <Line key={i} pts={[[-330 + i * 60, 0], [-330 + i * 60, 420]]} width={8} color="#e8e2d8" z={0.001} />
    ))}
    <Part shape={roundRect(720, 30, 8)} color="#e8e2d8" shade={0.2} y={420} z={0.002} />
  </X>
);

/** A rocket drawn as separate parts that fly apart (`k` 0..1) and come back. */
const ExplodedRocket: React.FC<{ k: number }> = ({ k }) => {
  const parts: { el: React.ReactNode; dx: number; dy: number; rot: number }[] = [
    { el: <Part shape={poly([[-70, 0], [70, 0], [0, 220]])} color="#eef0f3" shade={0.22} />, dx: 0, dy: 160, rot: 0.3 },
    { el: <Part shape={roundRect(140, 300, 8)} color="#eef0f3" shade={0.2} y={-150} />, dx: -480, dy: 40, rot: -0.2 },
    { el: <Part shape={roundRect(140, 360, 8)} color="#d8dde4" shade={0.2} y={-180} />, dx: 480, dy: -20, rot: 0.25 },
    { el: <Part shape={poly([[-60, 0], [60, 0], [90, -120], [-90, -120]])} color="#4a4a52" shade={0.2} />, dx: 0, dy: -160, rot: -0.3 },
  ];
  const ys = [660, 640, 340, -20];
  return (
    <X y={-250} s={0.75}>
      {parts.map((p, i) => (
        <X key={i} x={p.dx * k} y={ys[i] + p.dy * k} rot={p.rot * k} z={i * 0.01}>
          {p.el}
        </X>
      ))}
    </X>
  );
};

// ───────────────────────── X.com and PayPal ─────────────────────────

// 261.79 "The new company is an online bank called X.com."
export const XcomShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -20 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Office era="2000" desk={false}>
          <X x={300} y={-40} z={1}>
            <Monitor w={900} h={560} screen="#d8d8d0">
              <WebPage w={860} h={520} logo={<XMark size={200 * pop(t, 263.9)} color="#2a4a9a" />} />
            </Monitor>
          </X>
          <Character {...ELON_SUIT} x={-640} y={-640} s={1.7} look={0.6} expression={{ eyes: "open", mouth: "smile" }} pose={poses.point(frame)} z={3} />
        </Office>
      </Stage>
      <Label text="X.COM" sub="AN ONLINE BANK" x={0.1} y={0.1} size={0.065} kind="box" at={at(263.94)} />
    </AbsoluteFill>
  );
};

// 265.48 "Yes, X. Remember that letter. It keeps coming back."
export const YesXShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.12) }} light={{ dir: [-0.6, 0.6] }} vignette={0.75} vignetteColor="#05070e">
        <Part shape={roundRect(4000, 3000, 0)} color="#0e1220" flat outline={0} z={-41} />
        <Glow rx={700} color="#4a6adf" alpha={0.35} additive z={-40} />
        <X rot={Math.sin(frame * 0.04) * 0.08}>
          <XMark size={620 * pop(t, 266.1)} color="#f4f4f6" />
        </X>
      </Stage>
      <Label text="REMEMBER THIS LETTER" x={0.5} y={0.86} size={0.065} kind="stamp" at={at(267.2)} />
    </AbsoluteFill>
  );
};

// 269.67 "X.com joins with a rival company, and together they become PayPal."
export const PayPalShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const k = ramp(t, 270.4, 272.1, Easing.inOut(Easing.cubic));
  const merged = t > 272.1;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.6] }} vignette={0.5}>
        <Paper>
          {!merged ? (
            <>
              <X x={interpolate(k, [0, 1], [-560, -10])} z={1}>
                <Part shape={roundRect(480, 380, 30)} color="#2a4a9a" shade={0.2} />
                <XMark size={180} color="#f4f4f6" z={0.01} />
              </X>
              <X x={interpolate(k, [0, 1], [560, 10])} z={1}>
                <Part shape={roundRect(480, 380, 30)} color="#3f8a5a" shade={0.2} />
                <Part shape={circle(90)} color="#f4f4f6" flat outline={5} z={0.01} />
              </X>
            </>
          ) : (
            <X s={pop(t, 272.1)} z={1}>
              <Part shape={roundRect(880, 420, 40)} color="#1f5fb0" shade={0.2} />
              <Glow rx={700} color="#9fd2f0" alpha={0.3} additive z={-0.01} />
            </X>
          )}
        </Paper>
      </Stage>
      {!merged ? <Label text="X.COM" x={0.5 + interpolate(k, [0, 1], [-560, -10]) / 1920} y={0.75} size={0.05} kind="box" pin at={0} /> : null}
      {!merged ? <Label text="CONFINITY" sub="THE RIVAL" x={0.5 + interpolate(k, [0, 1], [560, 10]) / 1920} y={0.75} size={0.05} kind="box" pin at={at(271.0)} /> : null}
      <Label text="PAYPAL" x={0.5} y={0.5} size={0.075} pin at={at(272.3)} />
    </AbsoluteFill>
  );
};

// 274.11 "Elon is the boss."
export const BossShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Office era="2000" desk={false}>
          {[-560, -200, 200, 560].map((x, i) => (
            <Character key={x} {...STAFF(i)} x={x} y={-560} s={1.0} facing={x < 0 ? 1 : -1} look={0.5} expression={{ eyes: "open", mouth: "smile" }} pose={poses.idle(frame, i)} z={-1} />
          ))}
          <Part shape={roundRect(1700, 60, 12)} color="#6e4a2c" shade={0.2} y={-330} z={1} />
          <Part shape={roundRect(1600, 260, 12)} color="#5a3a20" shade={0.2} y={-480} z={0.9} />
          <Character {...ELON_SUIT} x={0} y={-500} s={1.35} look={0.1} expression={{ eyes: "open", mouth: "smile", brows: -0.2 }} pose={poses.talk(frame, 3)} talking z={0.5} />
        </Office>
      </Stage>
      <Label text="THE BOSS" sub="CEO" x={0.9} y={0.1} size={0.055} kind="box" at={at(274.6)} />
    </AbsoluteFill>
  );
};

// 275.62 "Then, in September 2000, he finally goes on his honeymoon."
export const HoneymoonShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const ppd = interpolate(frame, [0, dur], [4.6, 5.2]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <WorldMap
          ppd={ppd}
          center={[170, 0]}
          w={2600}
          h={1600}
          wrap
          tint={{ Australia: "#e2a04a" }}
          tintK={ramp(t, 278.6, 279.2)}
          routes={[{ from: CITY.sanfrancisco, to: CITY.sydney, k: ramp(t, 276.4, 279.3), plane: true, arc: 0.15 }]}
          pins={[{ at: CITY.sanfrancisco, s: 1 }, { at: CITY.sydney, s: pop(t, 279.2), glow: true }]}
        />
      </Stage>
      <Label text="SEPTEMBER 2000" x={0.1} y={0.1} size={0.06} kind="box" at={at(276.4)} />
      <Label text="THE HONEYMOON" x={0.9} y={0.86} size={0.055} kind="box" at={at(279.2)} />
    </AbsoluteFill>
  );
};

// 280.17 "He's already put it off for months because of work."
export const PutOffShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Office era="2000" deskX={420}>
          <Calendar x={-200} y={420} s={1.2} flip={Math.max(0, t - 280.4) * 2.2} z={-5} />
          <Character {...JUSTINE} x={-700} y={-600} s={1.5} look={0.6} expression={{ eyes: "half", mouth: "frown", brows: 0.4 }} pose={{ ...poses.handsOnHips, bob: Math.abs(Math.sin(frame * 0.4)) * 4 }} z={2} />
          <Character {...ELON_SUIT} x={160} y={-560} s={1.4} look={0.7} expression={{ eyes: "open", mouth: "flat", gaze: [0.7, 0], brows: -0.3 }} pose={{ ...poses.idle(frame, 3), armF: [1.25, 0.4 + Math.sin(frame * 1.2) * 0.08], armB: [1.1, 0.5] }} z={1} />
        </Office>
      </Stage>
      <Label text="PUT OFF FOR MONTHS" x={0.9} y={0.1} size={0.05} kind="box" at={at(281.4)} />
    </AbsoluteFill>
  );
};

// 282.94 "While he's away in Australia,"
export const AustraliaShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <SeaSet mood="day" horizon={-120}>
          <OperaHouse x={700} y={-120} s={0.8} z={-25} />
          <Part shape={roundRect(6000, 900, 0)} color="#ead39a" flat outline={5} y={-600} z={-20} />
          <Character {...ELON_ZIP2} x={-300} y={-640} s={1.5} look={0.6} expression={{ eyes: "happy", mouth: "smile" }} pose={poses.idle(frame, 2)} z={2} />
          <Character {...JUSTINE} x={60} y={-640} s={1.45} facing={-1} look={0.6} expression={{ eyes: "happy", mouth: "smile" }} pose={poses.idle(frame, 5)} z={2} />
        </SeaSet>
      </Stage>
      <Label text="AUSTRALIA" x={0.1} y={0.1} size={0.06} kind="box" at={at(283.6)} />
    </AbsoluteFill>
  );
};

// 284.61 "…the board fires him."
export const BoardFiresShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.65}>
        <Office era="2000" desk={false}>
          {[-640, -220, 220, 640].map((x, i) => (
            <Character
              key={x}
              {...SUIT(i)}
              x={x}
              y={-600}
              s={1.3}
              facing={x < 0 ? 1 : -1}
              look={0.5}
              expression={{ eyes: "open", mouth: "flat", brows: -0.4 }}
              pose={poses.blendAt(t, 284.75 + i * 0.08, poses.idle(frame, i), { armF: [2.4, 0.4], armB: [-0.2, -0.2], armsOverHead: false })}
              z={1}
            />
          ))}
          <Part shape={roundRect(1900, 60, 12)} color="#6e4a2c" shade={0.2} y={-430} z={2} />
          <Part shape={roundRect(1800, 260, 12)} color="#5a3a20" shade={0.2} y={-580} z={1.9} />
        </Office>
      </Stage>
      <Label text="THE BOARD VOTES" x={0.1} y={0.1} size={0.05} kind="box" at={at(284.7)} />
      <Label text="FIRED" x={0.5} y={0.86} size={0.09} kind="stamp" at={at(285.05)} />
    </AbsoluteFill>
  );
};

// 286.12 "He rushes back, but it's too late."
export const RushBackShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const shut = ramp(t, 287.1, 287.35);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02), y: -40, shake: hitAt(t, 287.35, 0.35) * 8 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Room wall="#c9d4dc" floor="#8f969e" y={-420} boards={false} z={-40} />
        <X x={560} y={-420} z={-5}>
          <Part shape={roundRect(600, 900, 10)} color="#5a3a20" shade={0.2} y={450} />
          <Part shape={roundRect(520, 840, 6)} color="#2a1e18" flat outline={0} y={440} z={0.001} />
          <X x={-260} y={440} sx={1 - shut * 0.98 + 0.02} z={0.002}>
            <Part shape={roundRect(520, 840, 6)} color="#8a5a32" shade={0.22} x={260} />
          </X>
        </X>
        <Character {...ELON_SUIT} x={interpolate(t, [286.1, 287.6], [-900, -40])} y={-600} s={1.5} look={0.6} expression={{ eyes: t > 287.4 ? "wide" : "open", mouth: t > 287.4 ? "o" : "open", sweat: true }} pose={t < 287.5 ? poses.run(frame) : poses.scared(frame)} z={2} />
      </Stage>
      <Label text="TOO LATE" x={0.5} y={0.86} size={0.08} kind="stamp" at={at(287.45)} />
    </AbsoluteFill>
  );
};

// 288.59 "A few months later, on a safari in South Africa, he catches malaria."
export const SafariShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const fly = ramp(t, 290.6, 291.7);
  const mx = interpolate(fly, [0, 1], [800, -60]) + Math.sin(frame * 0.6) * 20;
  const my = interpolate(fly, [0, 1], [400, 120]) + Math.cos(frame * 0.8) * 20;
  return (
    <AbsoluteFill>
      <DepthStage
        camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 40 }}
        light={{ dir: [-0.6, 0.6] }}
        vignette={0.6}
        bgBlur={5}
        bg={
          <SavannaSet y={-300}>
            <Acacia x={-900} y={-300} h={520} />
            <Acacia x={1000} y={-320} h={460} seed={4} />
          </SavannaSet>
        }
      >
        <Character {...ELON_ZIP2} x={-260} y={-700} s={2.1} look={0.6} hat="explorer" hatColor="#c8a978" expression={{ eyes: t > 291.6 ? "wide" : "happy", mouth: t > 291.6 ? "o" : "smile", gaze: t > 291.0 ? [0.8, 0.2] : [0.3, 0] }} pose={poses.idle(frame, 2)} />
        <Mosquito x={mx} y={my} s={1.3} flap={Math.sin(frame * 2.5)} z={3} />
      </DepthStage>
      <Label text="SAFARI, SOUTH AFRICA" x={0.1} y={0.1} size={0.05} kind="box" at={at(289.9)} />
      <Label text="MALARIA" x={0.9} y={0.86} size={0.08} kind="stamp" at={at(292.06)} />
    </AbsoluteFill>
  );
};

// 293.03 "He comes within hours of dying. He spends 10 days in intensive care,"
export const ICUShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.1, 1.2), y: -80, x: -40 }} light={{ dir: [0.6, 0.6] }} vignette={0.75} vignetteColor="#0a1018">
        <Room wall="#a8c4cc" floor="#7f949a" y={-420} boards={false} z={-40} />
        <IVStand x={-600} y={-420} z={-5} />
        <HeartMonitor x={600} y={-40} s={0.95} z={-5} />
        <HospitalBed x={0} y={-460} w={940} blanket="#8ab0c8" z={1} />
        <X x={-300} y={-150} rot={-1.5} z={1.002}>
          <Character {...ELON_ZIP2} x={0} y={-60} s={0.9} look={0.4} expression={{ eyes: "closed", mouth: "frown", eyebags: true, sweat: true }} pose={poses.idle(frame, 1)} shadow={false} />
        </X>
        <Part shape={roundRect(640, 84, 30)} color="#8ab0c8" shade={0.2} x={150} y={-180} z={1.02} />
      </Stage>
      <Label text="WITHIN HOURS OF DYING" x={0.1} y={0.1} size={0.05} kind="box" at={at(293.6)} />
      <Label text="10 DAYS IN INTENSIVE CARE" x={0.9} y={0.86} size={0.05} kind="box" at={at(295.8)} />
    </AbsoluteFill>
  );
};

// 297.60 "…and it takes him about five months to recover."
export const RecoverShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.6] }} vignette={0.5}>
        <Paper>
          <Calendar x={-360} y={-60} s={2.2} flip={Math.max(0, t - 298.1) * 3} />
          <Character {...ELON_ZIP2} x={460} y={-560} s={1.6} facing={-1} look={0.5} expression={{ eyes: "half", mouth: "flat", eyebags: true }} pose={poses.walk(frame, 0.5)} />
        </Paper>
      </Stage>
      <Label text="5 MONTHS TO RECOVER" x={0.5} y={0.86} size={0.06} kind="stamp" at={sec(start)(298.6)} />
    </AbsoluteFill>
  );
};

// 300.24 "He learns a lesson. In his words, 'Vacations will kill you.'"
export const VacationQuoteShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6} bgBlur={7} bg={<Office era="2000" />}>
        <Character {...ELON_SUIT} x={-300} y={-720} s={2.4} look={0.55} talking={t > 302.5 && t < 303.9} expression={{ eyes: "open", mouth: "smirk", brows: -0.3 }} pose={poses.talk(frame, 4)} />
      </DepthStage>
      <Label text="HIS LESSON" x={0.9} y={0.1} size={0.05} kind="box" at={at(300.6)} />
      <Label text="“VACATIONS WILL KILL YOU.”" x={0.85} y={0.86} size={0.06} kind="box" at={at(302.53)} />
    </AbsoluteFill>
  );
};

// 304.50 "In 2002, eBay buys PayPal for 1.5 billion dollars."
export const EbayShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const zoom = push(frame, dur, 1.0, 1.06);
  const cp = sc(-60, 262, zoom, 0, 0);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Office era="2000" desk={false}>
          <X x={0} y={260} s={pop(t, 306.7) * 0.75} z={-5}>
            <Cheque w={1100} />
          </X>
          <Character {...ELON_SUIT} x={-420} y={-660} s={1.6} look={0.6} expression={{ eyes: "happy", mouth: "grin" }} pose={{ ...poses.idle(frame, 1), armF: [1.3, 0.25] }} z={2} />
          <Character {...SUIT(2)} x={420} y={-660} s={1.6} facing={-1} look={0.6} expression={{ eyes: "open", mouth: "smile" }} pose={{ ...poses.idle(frame, 3), armF: [1.3, 0.25] }} z={2} />
        </Office>
      </Stage>
      <Label text="2002" x={0.1} y={0.1} size={0.06} kind="box" at={at(304.6)} />
      <Label text="EBAY BUYS PAYPAL" x={0.9} y={0.1} size={0.05} kind="box" at={at(305.6)} />
      <Label text="$1.5 BILLION" x={cp.x} y={cp.y} size={0.06} pin kind="ink" at={at(306.9)} />
    </AbsoluteFill>
  );
};

// 308.95 "Elon walks away with more than 150 million."
export const WalksAwayShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const arm: [number, number] = [0.15, 0.1];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.92, 0.98), y: -200 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Outdoors mood="day" horizon={-300} ground="#a8b0a0" />
        <Skyline y={-300} z={-35} />
        <Character {...ELON_SUIT} x={interpolate(frame, [0, dur], [-420, 120])} y={-640} s={1.6} look={0.6} expression={{ eyes: "happy", mouth: "grin" }} pose={{ ...poses.walk(frame, 0.9), armF: arm, armB: arm }} holdF={<MoneyBag s={0.6} y={-185} rot={upright(arm)} />} holdB={<MoneyBag s={0.55} y={-170} rot={upright(arm)} />} z={2} />
      </Stage>
      <Label text="$150+ MILLION" x={0.9} y={0.1} size={0.07} kind="box" at={at(310.4)} />
    </AbsoluteFill>
  );
};

// 311.71 "And other early PayPal people? They go on to start YouTube, LinkedIn and Yelp. People call them the PayPal Mafia."
export const MafiaShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const xs = [-760, -380, 0, 380, 760];
  const labels: [number, string, number][] = [
    [1, "YOUTUBE", 314.35],
    [2, "LINKEDIN", 315.03],
    [3, "YELP", 315.79],
  ];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02), y: 20 }} light={{ dir: [-0.6, 0.6] }} vignette={0.7} vignetteColor="#0a0a10">
        <Part shape={roundRect(4000, 3000, 0)} color="#2a2228" flat outline={0} z={-41} />
        <Glow y={200} rx={1300} ry={800} color="#e9c88a" alpha={0.25} additive z={-40} />
        {xs.map((x, i) => (
          <Character
            key={x}
            {...SUIT(i)}
            outfit={{ top: "#1f1f25", shirt: "#f4f4f2", tie: i % 2 ? "#8a2a3a" : "#2a2a30", bottom: "#1f1f25", boots: "#18181c" }}
            hat="fedora"
            hatColor="#26242a"
            x={x}
            y={-640 + (i % 2) * 30}
            s={1.35}
            facing={x < 0 ? 1 : -1}
            look={0.45}
            expression={{ eyes: "half", mouth: "smirk", brows: -0.5 }}
            pose={{ ...poses.idle(frame, i), armF: [0.95, 1.6], armB: [0.65, 1.75] }}
            z={1 + (i % 2) * -0.5}
          />
        ))}
      </Stage>
      <Label text="EARLY PAYPAL PEOPLE" x={0.1} y={0.1} size={0.05} kind="box" at={at(311.8)} until={at(316.2)} />
      {labels.map(([i, txt, a]) => (
        <Label key={txt} text={txt} x={0.5 + xs[i] / 1920} y={0.86} size={0.05} kind="box" pin at={at(a)} until={at(316.2)} />
      ))}
      <Label text="THE PAYPAL MAFIA" x={0.5} y={0.14} size={0.085} kind="title" at={at(317.3)} />
    </AbsoluteFill>
  );
};

// 318.65 "That same year, tragedy strikes. His first son, Nevada, dies at just ten weeks old."
export const TragedyShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.12), y: -60 }} light={{ dir: [0.6, 0.5] }} vignette={0.85} vignetteColor="#05060a">
        <Room wall="#3a3440" floor="#2a2428" y={-420} z={-40} />
        <Glow x={420} y={-80} rx={600} ry={500} color="#ffcf8a" alpha={0.3} additive z={-30} />
        <Crib x={-300} y={-440} s={1.0} z={1} />
        <Teddy x={-300} y={-150} s={0.9} z={0.5} />
        <X x={420} y={-430} z={2}>
          <Part shape={roundRect(300, 40, 8)} color="#5a3a20" shade={0.2} y={20} />
          <Candle x={0} y={40} s={0.8} />
        </X>
      </Stage>
      <Label text="NEVADA MUSK" sub="2002" x={0.9} y={0.1} size={0.055} kind="box" at={at(321.85)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── Mars, Russia, first principles ─────────────────────────

// 324.84 "So what does he do with all that money? Remember the rule? He goes all in."
export const AllThatMoneyShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const k = ramp(t, 327.7, 328.6);
  const pushArm: [number, number] = [0.55 + k * 0.55, 0.5 - k * 0.35];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -150 }} light={{ dir: [-0.4, 0.8] }} vignette={0.7}>
        <ChipsTable push={k} y={-640}>
          <Character {...ELON_2008} x={-420} y={-520} s={1.7} look={0.6} expression={{ eyes: "open", mouth: "smirk", brows: -0.4, gaze: [0.6, -0.5] }} pose={{ ...poses.idle(frame, 2), armF: pushArm, armB: [pushArm[0] - 0.2, pushArm[1] + 0.1] }} />
        </ChipsTable>
      </Stage>
      <Label text="REMEMBER THE RULE?" x={0.1} y={0.1} size={0.055} kind="box" at={at(326.6)} />
      <Label text="ALL IN" x={0.5} y={0.86} size={0.09} kind="stamp" at={at(328.1)} />
    </AbsoluteFill>
  );
};

/** A dome city on Mars (for the dream). */
const MarsCity: React.FC = () => (
  <X>
    <Part shape={blob([[-420, 0], [-300, 60], [0, 80], [300, 60], [420, 0]], 6)} color="#c8643a" shade={0.2} />
    {[-220, 0, 230].map((x, i) => (
      <X key={x} x={x} y={40} z={0.01}>
        <Part
          shape={poly(Array.from({ length: 17 }, (_, j) => [Math.cos((j / 16) * Math.PI) * (110 - i * 20), Math.sin((j / 16) * Math.PI) * (100 - i * 20)] as [number, number]))}
          color="#bfe6ff"
          flat
          outline={5}
          opacity={0.6}
        />
        <Part shape={roundRect(30, 60, 4)} color="#f4f4f6" shade={0.2} y={30} z={-0.001} />
      </X>
    ))}
  </X>
);

// 329.02 "Elon has a dream. He wants humans to live on Mars."
export const DreamShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 40 }} light={{ dir: [0.6, 0.4] }} vignette={0.7}>
        <SkyBack mood="night" horizon={-360} sunX={-700} />
        <Planet kind="mars" r={110} x={520} y={300} glow={1} z={-30} />
        <Outdoors mood="night" horizon={-360} ground="#3a4a3a" />
        <Character {...ELON_2008} x={-420} y={-700} s={1.9} look={0.6} expression={{ eyes: "open", mouth: "smile", gaze: [0.6, 0.8] }} pose={poses.idle(frame, 3)} z={2} />
        <X x={520} y={-40} s={pop(t, 330.9) * 0.9} z={3}>
          <Part shape={ellipse(470, 220)} color="#ffffff" flat outline={7} opacity={0.92} />
          <X y={-60} s={0.9}>
            <MarsCity />
          </X>
        </X>
      </Stage>
      <Label text="A DREAM" x={0.1} y={0.1} size={0.055} kind="box" at={at(329.4)} />
      <Label text="HUMANS ON MARS" x={0.9} y={0.86} size={0.06} kind="stamp" at={at(331.6)} />
    </AbsoluteFill>
  );
};

// 332.55 "He says humans need to become a multi-planet species, in case something terrible ever happens to Earth."
export const MultiPlanetShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const rock = ramp(t, 336.4, 338.4, Easing.out(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.6] }} vignette={0.65}>
        <SpaceBack />
        <Planet kind="earth" r={260} x={-560} y={-60} />
        <Planet kind="mars" r={170} x={600} y={120} />
        <DashArrow from={[-260, 40]} to={[400, 120]} k={ramp(t, 333.2, 334.5)} color="#e9ba41" z={1} />
        {t > 336.4 ? (
          <X x={interpolate(rock, [0, 1], [-1150, -640])} y={interpolate(rock, [0, 1], [620, 230])} rot={frame * 0.05} z={2}>
            <Part shape={blob([[-80, 0], [-40, 70], [40, 80], [90, 10], [50, -70], [-50, -60]], 8)} color="#7a6a5a" shade={0.25} />
            <Glow rx={200} color="#ff8a4a" alpha={0.3} additive x={-60} y={60} z={-0.01} />
          </X>
        ) : null}
      </Stage>
      <Label text="MULTI-PLANET SPECIES" x={0.5} y={0.1} size={0.06} kind="box" at={at(334.3)} />
      <Label text="IN CASE SOMETHING TERRIBLE HAPPENS" x={0.1} y={0.86} size={0.045} kind="box" at={at(336.8)} />
    </AbsoluteFill>
  );
};

// 338.87 "He even jokes, 'I'd like to die on Mars. Just not on impact.'"
export const MarsJokeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6} bgBlur={7} bg={<Office era="2008" />}>
        <Character {...ELON_2008} x={-280} y={-720} s={2.4} look={0.55} talking={t > 340 && t < 343.6} expression={{ eyes: t > 342 ? "happy" : "open", mouth: "smirk" }} pose={poses.talk(frame, 2)} />
      </DepthStage>
      <Label text="“I'D LIKE TO DIE ON MARS…”" x={0.85} y={0.83} size={0.055} kind="box" at={at(340.02)} until={at(341.9)} />
      <Label text="“…JUST NOT ON IMPACT.”" x={0.85} y={0.83} size={0.06} kind="box" at={at(341.93)} />
    </AbsoluteFill>
  );
};

// 343.90 "First, he wants to send a small greenhouse there, to get people excited about space again."
export const GreenhouseShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <X z={-41}>
          <Part shape={roundRect(4000, 3000, 0)} color="#e8a888" flat outline={0} />
        </X>
        <Part shape={blob([[-2200, -200], [-1200, -120], [-300, -220], [600, -140], [1500, -230], [2200, -160], [2200, -1500], [-2200, -1500]], 8)} color="#c8643a" shade={0.12} z={-30} />
        {[[-900, -380, 60], [700, -420, 80], [-200, -600, 40]].map(([x, y, r], i) => (
          <Part key={i} shape={ellipse(r, r * 0.35)} color="#a24e2c" flat outline={4} x={x} y={y} z={-29} />
        ))}
        <Greenhouse x={0} y={-460} r={420} grow={ramp(t, 345.3, 347.5)} z={1} />
      </Stage>
      <Label text="A GREENHOUSE ON MARS" x={0.5} y={0.1} size={0.06} kind="box" at={at(345.74)} />
      <Label text="TO EXCITE PEOPLE ABOUT SPACE" x={0.9} y={0.86} size={0.045} kind="box" at={at(347.6)} />
    </AbsoluteFill>
  );
};

/** Briefcase (held by the handle). */
const Briefcase: React.FC<{ rot?: number; s?: number }> = ({ rot = 0, s = 1 }) => (
  <X rot={rot} s={s}>
    <Line pts={[[-30, 0], [-30, -18], [30, -18], [30, 0]]} width={8} color="#2a1e18" />
    <Part shape={roundRect(200, 140, 12)} color="#5a3a20" shade={0.22} y={-90} z={0.001} />
    <Part shape={roundRect(30, 16, 4)} color="#c9a24a" flat outline={2.5} y={-36} z={0.002} />
  </X>
);

// 349.26 "So he flies to Russia to buy old missiles to use as rockets."
export const RussiaShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const arm: [number, number] = [0.1, 0.05];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.85, 0.92), y: 60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <MoscowSet y={-300}>
          <Character {...ELON_2008} x={interpolate(frame, [0, dur], [-700, -200])} y={-420} s={1.6} look={0.6} expression={{ eyes: "open", mouth: "flat", brows: -0.2 }} pose={{ ...poses.walk(frame, 0.9), armB: arm }} holdB={<Briefcase rot={upright(arm)} s={1.1} />} z={2} />
        </MoscowSet>
      </Stage>
      <Label text="RUSSIA" x={0.1} y={0.1} size={0.06} kind="box" at={at(350.3)} />
      <Label text="TO BUY OLD MISSILES" x={0.9} y={0.86} size={0.05} kind="box" at={at(351.4)} />
    </AbsoluteFill>
  );
};

// 353.74 "The Russians want 8 million dollars or more for each one."
export const RussiansPriceShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.7}>
        <Room wall="#8a7a6a" floor="#5a4a3a" y={-420} z={-40} />
        <X x={0} y={-140} rot={-0.5} z={-10}>
          <Falcon1 h={300} />
        </X>
        {[-640, -260].map((x, i) => (
          <Character key={x} {...RUSSIAN(i)} x={x} y={-560} s={1.35} look={0.5} expression={{ eyes: "half", mouth: "flat", brows: -0.5 }} pose={i === 1 ? poses.talk(frame, 1) : poses.idle(frame, i)} talking={i === 1} z={1} />
        ))}
        <Character {...ELON_2008} x={600} y={-560} s={1.35} facing={-1} look={0.5} expression={{ eyes: "wide", mouth: "o", brows: 0.6 }} pose={poses.idle(frame, 4)} z={1} />
        <Part shape={roundRect(1900, 60, 12)} color="#6e4a2c" shade={0.2} y={-400} z={2} />
        <Part shape={roundRect(1800, 240, 12)} color="#5a3a20" shade={0.2} y={-540} z={1.9} />
      </Stage>
      <Label text="$8 MILLION+ EACH" x={0.5} y={0.1} size={0.07} kind="box" at={at(354.7)} />
    </AbsoluteFill>
  );
};

/** Airliner cabin: curved wall with windows showing clouds. */
const Cabin: React.FC<{ frame: number }> = ({ frame }) => (
  <>
    <Part shape={roundRect(4000, 3000, 0)} color="#d8d4cc" flat outline={0} z={-41} />
    {[-700, 0, 700].map((x) => (
      <X key={x} x={x} y={260} z={-40}>
        <Part shape={roundRect(260, 340, 120)} color="#e8e4dc" shade={0.15} />
        <Part shape={roundRect(200, 280, 100)} color="#9fd2f0" flat outline={6} z={0.001} />
        <Part shape={ellipse(80, 30)} color="#ffffff" flat outline={0} x={-40 + ((frame * 4) % 300) - 150} y={-40} z={0.002} opacity={0.9} />
      </X>
    ))}
    <Part shape={roundRect(4000, 800, 0)} color="#7a8aa0" flat outline={6} y={-700} z={-35} />
  </>
);

// 357.74 "On the flight home, he does the math."
export const FlightMathShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -20 }} light={{ dir: [0.6, 0.6] }} vignette={0.6}>
        <Cabin frame={frame} />
        <Character {...ELON_2008} x={-380} y={-620} s={1.6} look={0.6} expression={{ eyes: "open", mouth: "flat", brows: -0.4, gaze: [0.6, -0.6] }} pose={{ ...poses.sit(frame), armF: [1.2, 0.5 + Math.sin(frame * 1.1) * 0.06], armB: [1.1, 0.6] }} z={2} />
        <Laptop x={220} y={-360} w={520} z={3}>
          <Part shape={roundRect(400, 40, 6)} color="#3a7ac9" flat outline={0} y={105} z={0.001} />
          {[0, 1, 2, 3].map((r) =>
            [0, 1, 2].map((c) => (
              <Part key={`${r}${c}`} shape={roundRect(118, 34, 5)} color={c === 2 ? (r === 3 ? "#d8322f" : "#e9ba41") : "#d7dbe2"} flat outline={0} x={-130 + c * 130} y={50 - r * 50} z={0.001} />
            )),
          )}
        </Laptop>
      </Stage>
      <Label text="THE FLIGHT HOME" x={0.1} y={0.1} size={0.05} kind="box" at={at(357.9)} />
      <Label text="HE DOES THE MATH" x={0.9} y={0.86} size={0.05} kind="box" at={at(359.0)} />
    </AbsoluteFill>
  );
};

// 359.92 "The raw materials in a rocket cost only about 2 to 3 percent of its price."
export const TwoPercentShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.6] }} vignette={0.5}>
        <Paper>
          <Falcon1 x={-560} y={-420} h={820} />
          <Pie x={360} y={-20} r={330} slices={[[0.03, "#fe5649"], [0.97, "#cbb894"]]} k={ramp(t, 360.4, 361.6)} pop={t > 362.0 ? 0 : -1} />
        </Paper>
      </Stage>
      <Label text="A ROCKET'S PRICE" x={0.1} y={0.1} size={0.05} kind="box" at={at(360.3)} />
      <Label text="RAW MATERIALS: 2–3%" x={0.9} y={0.86} size={0.065} kind="stamp" at={at(362.1)} />
    </AbsoluteFill>
  );
};

/** Light bulb idea above a head. */
const IdeaBulb: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) =>
  s > 0.01 ? (
    <X x={x} y={y} s={s}>
      <Glow rx={160} color="#fff2a0" alpha={0.55} additive z={-0.01} />
      <Part shape={circle(60)} color="#fff4b0" shade={0.15} y={30} />
      <Part shape={roundRect(54, 40, 8)} color="#b9bec6" shade={0.2} y={-40} z={0.001} />
    </X>
  ) : null;

// 364.00 "So he thinks, why not build rockets myself?"
export const BuildMyselfShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 60 }} light={{ dir: [0.6, 0.6] }} vignette={0.6} bgBlur={7} bg={<Cabin frame={frame} />}>
        <Character {...ELON_2008} x={-300} y={-720} s={2.4} look={0.55} expression={{ eyes: "wide", mouth: "smile", gaze: [0.5, 0.8] }} pose={poses.think} />
        <IdeaBulb x={420} y={300} s={pop(t, 364.9) * 1.1} />
      </DepthStage>
      <Label text="“WHY NOT BUILD ROCKETS MYSELF?”" x={0.85} y={0.86} size={0.055} kind="box" at={at(364.93)} />
    </AbsoluteFill>
  );
};

// 366.72 "He calls this thinking from first principles. Break a problem down to its basic parts, then build it back up."
export const FirstPrinciplesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const k = t < 371.3 ? ramp(t, 369.2, 370.4, Easing.out(Easing.cubic)) : 1 - ramp(t, 371.3, 372.3, Easing.inOut(Easing.cubic));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.96) }} light={{ dir: [-0.6, 0.6] }} vignette={0.5}>
        <Paper>
          <ExplodedRocket k={k} />
        </Paper>
      </Stage>
      <Label text="FIRST PRINCIPLES" x={0.5} y={0.1} size={0.07} kind="box" at={at(367.8)} />
      <Label text="BREAK IT DOWN" x={0.1} y={0.86} size={0.05} kind="box" at={at(369.3)} until={at(371.3)} />
      <Label text="BUILD IT BACK UP" x={0.9} y={0.86} size={0.05} kind="box" at={at(371.4)} />
    </AbsoluteFill>
  );
};

// 372.55 "In 2002, he starts SpaceX."
export const SpaceXFoundedShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const zoom = push(frame, dur, 0.8, 0.86);
  const sp = sc(0, 780 - 420, zoom, 0, 60);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, y: 60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <SkyBack mood="day" horizon={-420} />
        <X y={-420} z={-30}>
          <Part shape={roundRect(2600, 1000, 6)} color="#e8eaee" shade={0.15} y={500} />
          <Part shape={roundRect(1000, 160, 10)} color="#1f1f25" flat outline={6} y={780} z={0.001} />
          <Part shape={roundRect(700, 560, 8)} color="#4a4e56" shade={0.1} y={280} z={0.001} />
          <X x={-175} y={280} sx={1 - ramp(t, 373.9, 374.7) * 0.85} z={0.002}>
            <Part shape={roundRect(350, 560, 4)} color="#9aa0aa" shade={0.2} x={-0} />
          </X>
          <X x={175} y={280} sx={1 - ramp(t, 373.9, 374.7) * 0.85} z={0.002}>
            <Part shape={roundRect(350, 560, 4)} color="#9aa0aa" shade={0.2} />
          </X>
        </X>
        <Part shape={roundRect(6000, 1200, 0)} color="#9a9a96" flat outline={5} y={-1020} z={-25} />
        <Character {...ELON_2008} x={-520} y={-640} s={1.5} look={0.6} expression={{ eyes: "open", mouth: "smile" }} pose={poses.point(frame)} z={2} />
      </Stage>
      <Label text="SPACEX" x={sp.x} y={sp.y} size={0.075} pin at={at(373.95)} />
      <Label text="2002" x={0.1} y={0.1} size={0.06} kind="box" at={at(372.68)} />
    </AbsoluteFill>
  );
};

// 375.82 "Two years later, he puts money into a small electric car company called Tesla."
export const TeslaInvestShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const k = ramp(t, 377.2, 378.3);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02), y: -20 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Room wall="#bfc6cc" floor="#7f8288" y={-420} boards={false} z={-40} />
        <Roadster x={420} y={-470} s={1.2} color="#9aa0aa" z={1} />
        <Character {...EBERHARD} x={960} y={-560} s={1.3} facing={-1} look={0.5} expression={{ eyes: "happy", mouth: "smile" }} pose={poses.idle(frame, 3)} z={0.5} />
        <X x={interpolate(k, [0, 1], [-420, 40])} y={interpolate(k, [0, 0.5, 1], [-200, -60, -200])} z={3}>
          <Banknote rot={-0.1} s={0.8} />
        </X>
        <Character {...ELON_2008} x={-640} y={-600} s={1.5} look={0.6} expression={{ eyes: "open", mouth: "smile" }} pose={poses.holdOut} z={2} />
      </Stage>
      <Label text="2004" x={0.1} y={0.1} size={0.06} kind="box" at={at(375.95)} />
      <Label text="TESLA" sub="A SMALL ELECTRIC CAR COMPANY" x={0.9} y={0.1} size={0.065} kind="box" at={at(379.59)} />
    </AbsoluteFill>
  );
};

/** Little name badge on a lanyard / pin. */
const NameBadge: React.FC<{ x?: number; y?: number; s?: number; z?: number; rot?: number; color?: string }> = ({ x = 0, y = 0, s = 1, z = 0, rot = 0, color = "#e9ba41" }) => (
  <X x={x} y={y} s={s} z={z} rot={rot}>
    <Part shape={roundRect(260, 90, 14)} color={color} shade={0.2} outline={5} />
  </X>
);

// 380.46 "And here's a myth. You might have heard that Elon founded Tesla. He didn't."
export const MythTeslaShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const zoom = push(frame, dur, 1.0, 1.06);
  const fall = ramp(t, 384.0, 384.6, Easing.in(Easing.quad));
  const bp = sc(240, 60 - fall * 500, zoom, 0, 40);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom, y: 40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6} bgBlur={7} bg={<Room wall="#bfc6cc" floor="#7f8288" y={-420} boards={false} />}>
        <Character {...ELON_2008} x={-300} y={-700} s={2.3} look={0.55} expression={{ eyes: t > 384.0 ? "half" : "happy", mouth: t > 384.0 ? "wavy" : "grin" }} pose={poses.idle(frame, 2)} />
        <NameBadge x={240} y={60 - fall * 500} s={1.4 * pop(t, 382.6)} rot={fall * 0.8} z={3} />
      </DepthStage>
      <Label text="A MYTH" x={0.1} y={0.1} size={0.06} kind="box" at={at(380.8)} />
      <Label text="FOUNDER" x={bp.x} y={bp.y} size={0.05} pin kind="ink" at={at(382.7)} until={at(384.6)} />
      <Label text="HE DIDN'T" x={0.85} y={0.86} size={0.08} kind="stamp" at={at(384.0)} />
    </AbsoluteFill>
  );
};

// 384.94 "Two engineers, Martin Eberhard and Marc Tarpenning, started it in 2003."
export const FoundersShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -20 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Room wall="#cfd6dc" floor="#8f969e" y={-420} boards={false} z={-40}>
          <Window x={0} y={1000} w={700} h={520} />
        </Room>
        <Character {...EBERHARD} x={-420} y={-640} s={1.7} look={0.6} expression={{ eyes: "happy", mouth: "smile" }} pose={poses.idle(frame, 1)} z={1} />
        <Character {...TARPENNING} x={420} y={-640} s={1.7} facing={-1} look={0.6} expression={{ eyes: "happy", mouth: "smile" }} pose={poses.idle(frame, 4)} z={1} />
      </Stage>
      <Label text="MARTIN EBERHARD" x={0.1} y={0.86} size={0.05} kind="box" at={at(386.1)} />
      <Label text="MARC TARPENNING" x={0.9} y={0.86} size={0.05} kind="box" at={at(387.16)} />
      <Label text="TESLA'S FOUNDERS, 2003" x={0.5} y={0.1} size={0.06} kind="box" at={at(389.02)} />
    </AbsoluteFill>
  );
};

// 390.40 "Elon was its biggest early investor and became its chairman."
export const ChairmanShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Office era="2008" desk={false}>
          {[-560, -200, 200, 560].map((x, i) => (
            <Character key={x} {...SUIT(i)} x={x} y={-560} s={1.0} facing={x < 0 ? 1 : -1} look={0.5} expression={{ eyes: "open", mouth: "smile" }} pose={poses.idle(frame, i)} z={-1} />
          ))}
          <Part shape={roundRect(1700, 60, 12)} color="#6e4a2c" shade={0.2} y={-330} z={1} />
          <Part shape={roundRect(1600, 260, 12)} color="#5a3a20" shade={0.2} y={-480} z={0.9} />
          <Character {...ELON_2008} x={0} y={-500} s={1.35} look={0.1} expression={{ eyes: "open", mouth: "smile", brows: -0.2 }} pose={poses.talk(frame, 3)} talking z={0.5} />
        </Office>
      </Stage>
      <Label text="BIGGEST EARLY INVESTOR" x={0.1} y={0.1} size={0.05} kind="box" at={at(391.06)} />
      <Label text="CHAIRMAN" x={0.9} y={0.86} size={0.065} kind="stamp" at={at(393.03)} />
    </AbsoluteFill>
  );
};

// 394.01 "Later, after a legal fight, he's allowed to call himself a co-founder."
export const CofounderShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const zoom = push(frame, dur, 1.0, 1.06);
  const np = sc(460, -40, zoom, 0, 0);
  const swing = -Math.max(0, Math.sin(Math.min(1, Math.max(0, (t - 394.7) / 0.35)) * Math.PI)) * 0.9;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, shake: hitAt(t, 395.0, 0.3) * 8 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Paper color="#d8c8a8">
          <Gavel x={-420} y={-160} s={1.6} swing={swing} />
          <X x={460} y={-80} s={pop(t, 396.5)}>
            <Part shape={roundPoly3()} color="#5a3a20" shade={0.2} />
            <Part shape={roundRect(560, 120, 10)} color="#e9ba41" shade={0.15} y={40} z={0.001} />
          </X>
        </Paper>
      </Stage>
      <Label text="A LEGAL FIGHT" x={0.1} y={0.1} size={0.05} kind="box" at={at(394.6)} />
      <Label text="CO-FOUNDER" x={np.x} y={np.y} size={0.05} pin kind="ink" at={at(396.7)} />
    </AbsoluteFill>
  );
};
const roundPoly3 = () => poly([[-320, -40], [320, -40], [280, 110], [-280, 110]]);

// 397.77 "Tesla's first car, the Roadster, is a sports car."
export const RoadsterShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 0 }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <X x={-((frame * 40) % 400)}>
          <RoadSet horizon={-160} />
        </X>
        <Roadster x={0} y={-470} s={1.55} spin={frame * 0.6} lights={0.4} z={5} />
      </Stage>
      <Label text="TESLA ROADSTER" x={0.1} y={0.1} size={0.06} kind="box" at={at(398.89)} />
      <Label text="A SPORTS CAR" x={0.9} y={0.86} size={0.05} kind="box" at={at(400.0)} />
    </AbsoluteFill>
  );
};

// 401.08 "It runs on thousands of small batteries, like the ones in laptops."
export const BatteriesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.6] }} vignette={0.55}>
        <Paper>
          <BatteryGrid x={-300} y={0} cols={16} rows={10} r={22} k={ramp(t, 401.5, 403.0, Easing.linear)} />
          <Laptop x={620} y={-200} w={420} z={1} />
          <BatteryCell x={620} y={-140} s={0.9} charge={1} z={2} />
        </Paper>
      </Stage>
      <Label text="THOUSANDS OF SMALL BATTERIES" x={0.1} y={0.1} size={0.05} kind="box" at={at(401.64)} />
      <Label text="LIKE IN LAPTOPS" x={0.9} y={0.86} size={0.05} kind="box" at={at(403.6)} />
    </AbsoluteFill>
  );
};

export const _unusedD = { Wash, Falcon9, Line, Sea, PalmTree, Stars, SpaceSet, SedanEV, Hangar, Doc, THIEL, PERSON };
