import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, X, Part, Line, Glow, Wash, QuestionMark, ChocolateStick, roundRect, circle, ramp, push, hitAt, absT, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  ZeroFighter, ZeroTop, Warship, ShipTop, Tracers, FlakField, SplashColumn, JapanMap, Ribbon, geoXY, cityXY, japanRouteAt, Burst, Sea, Sky, Sun, Clock,
  Hinomaru, USFlag, PlankWall, Smoke,
} from "../../kit/env";
import { Airfield, OkinawaSea, CockpitView, MapBoard, MemorialAltar, MemorialPortrait, TatamiRoom } from "./sets";
import { PILOT, DOCTOR, FATHER, MOTHER } from "./cast";
import { sec, pop, scr, GrowArrow } from "./common";

// Spring 1945, v2 shots: the kamikaze attacks themselves (dives through flak,
// impacts, burning ships), cockpit views, real-coastline maps with ribbon
// labels, and the memorials.

/** Ribbon label text (pairs with a <Ribbon> drawn at the same world point). */
const RibbonText: React.FC<{ text: string; x: number; y: number; zoom?: number; cx?: number; cy?: number; size?: number; at?: number }> = ({ text, x, y, zoom = 1, cx = 0, cy = 0, size = 0.042, at = 0 }) => {
  const p = scr(x, y + 4, zoom, cx, cy);
  return <Label text={text} x={p.x} y={p.y} size={size} color="#fdf3dc" at={at} />;
};

/** Gritted-teeth pilot used in the cockpit close-ups. */
const DivingPilot: React.FC<{ i?: number; face?: "grit" | "wide" | "sleepy" | "calm"; nod?: number; holdF?: React.ReactNode; armF?: [number, number] }> = ({ i = 0, face = "grit", nod = 0, holdF, armF }) => {
  const frame = useCurrentFrame();
  const shake = face === "grit" ? Math.sin(frame * 1.7) * 2 : 0;
  const expression =
    face === "grit"
      ? { eyes: "wide" as const, mouth: "teeth" as const, brows: -0.7, sweat: true }
      : face === "wide"
        ? { eyes: "wide" as const, mouth: "flat" as const, brows: -0.2 }
        : face === "sleepy"
          ? { eyes: nod > 0.6 ? ("closed" as const) : ("half" as const), mouth: nod > 0.3 ? ("o" as const) : ("flat" as const), brows: 0.4, eyebags: true }
          : { eyes: "half" as const, mouth: "flat" as const, brows: 0.4 };
  return (
    <Character
      {...PILOT(i)}
      x={-40 + shake}
      y={-528}
      s={2.2}
      z={5}
      look={0.15}
      shadow={false}
      expression={expression}
      pose={{ armF: armF ?? [0.35, 0.5], armB: [0.3, 0.5], headTilt: -nod * 0.3 }}
      holdF={holdF}
    />
  );
};

// ───────────────────────── A · the attack ─────────────────────────

// A4 9.2 "… into an American warship."
export const AttackShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const impact = 10.25;
  const k = ramp(t, 9.2, impact, (x) => x);
  const px = interpolate(k, [0, 1], [-1150, 330]);
  const py = interpolate(k, [0, 1], [600, -50]);
  const after = t > impact;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0, y: 40, shake: hitAt(t, impact, 0.6) * 16 }} light={{ dir: [-0.6, 0.8] }}>
        <OkinawaSea mood="day" horizon={-40}>
          <Warship kind="battleship" x={-560} y={-60} len={620} z={1} />
          <Warship kind="destroyer" x={330} y={-230} len={1150} hit={after ? ramp(t, impact, impact + 0.3) : 0} z={2} />
          <Tracers x={150} y={-110} angle={2.35} spread={0.5} range={1200} n={9} seed={4} z={3} />
          <Tracers x={-500} y={-10} angle={1.9} spread={0.4} range={900} n={5} seed={7} z={1.5} />
          <FlakField x={-200} y={330} w={1500} h={420} n={9} period={36} seed={3} z={2.5} />
          {!after ? (
            <ZeroFighter
              x={px}
              y={py}
              rot={-0.42}
              s={0.62}
              bomb
              gear={false}
              spin={1}
              trail={0.7}
              z={4}
              pilot={<Character {...PILOT(1)} y={-78} s={0.38} shadow={false} look={0.5} expression={{ eyes: "wide", mouth: "teeth", brows: -0.6 }} pose={{ armF: [0.6, 0.6], armB: [-0.2, -0.1] }} />}
            />
          ) : null}
          {after ? <Burst x={330} y={-60} t={(t - impact) / 0.9} size={1.7} z={5} /> : null}
        </OkinawaSea>
        <Wash width={4000} height={3000} color="#fff6e0" alpha={hitAt(t, impact, 0.3) * 0.7} z={40} />
      </Stage>
    </AbsoluteFill>
  );
};

// A5 10.8 "There's no plan to come back."
export const OneWayMapShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const ppd = 60;
  const mx = 180;
  const my = 250;
  const route = ramp(t, 10.95, 11.9);
  const [rx, ry, ra] = japanRouteAt(Math.max(0.02, route), ppd);
  const zoom = push(frame, dur, 1.0, 1.06);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom }} light={{ dir: [-0.6, 0.8] }}>
        <JapanMap x={mx} y={my} ppd={ppd} route={route} dots={["kushira", "okinawa"]} />
        <ZeroTop x={mx + rx} y={my + ry} rot={ra} s={0.12} z={2} />
        <Ribbon x={330} y={300} w={300} h={64} z={3} />
        <Ribbon x={-380} y={-150} w={330} h={64} z={3} />
      </Stage>
      <RibbonText text="KYUSHU" x={330} y={300} zoom={zoom} />
      <RibbonText text="OKINAWA" x={-380} y={-150} zoom={zoom} />
      <Label text="ONE WAY" x={0.74} y={0.42} size={0.09} kind="stamp" rotate={-10} at={sec(start)(11.82)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── B · cockpit ─────────────────────────

/** The US fleet as seen from a diving plane, drawn at the horizon (y = 0). */
const FleetAhead: React.FC<{ near?: number; hit?: number }> = ({ near = 0, hit = 0 }) => (
  <X s={1 + near * 1.6}>
    <Warship kind="destroyer" x={-420} y={-40} len={300} z={1} />
    <Warship kind="carrier" x={120} y={-70} len={460} hit={hit} z={2} />
    <Warship kind="battleship" x={560} y={-30} len={340} z={1} />
    <Tracers x={-420} y={-10} angle={1.75} spread={0.6} range={700} n={6} seed={2} z={3} />
    <Tracers x={120} y={-10} angle={1.5} spread={0.6} range={800} n={7} seed={5} z={3} />
    <Tracers x={560} y={0} angle={1.35} spread={0.6} range={700} n={6} seed={8} z={3} />
    <FlakField y={330} w={1600} h={500} n={8} period={34} seed={6} z={3.5} />
  </X>
);

// B1 21.2 "So were Japan's kamikaze pilots drugged to make them brave enough to die?"
export const CockpitDiveShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const dive = ramp(t, 21.4, 25.4) * 0.55;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), shake: 3 + dive * 6 }} light={{ dir: [-0.6, 0.8] }}>
        <CockpitView tilt={0.04 + dive * 0.25 + Math.sin(frame * 0.07) * 0.01} dive={dive} outside={<FleetAhead near={dive} />}>
          <DivingPilot i={0} face="grit" />
        </CockpitView>
        <QuestionMark x={640} y={300} s={1.0 * pop(t, 24.9)} rot={0.15} z={30} />
      </Stage>
    </AbsoluteFill>
  );
};

// B7 37.0 "Because it starts in Japan."
export const JapanBoardShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const zoom = push(frame, dur, 0.98, 1.05);
  const ppd = 42;
  const [jx, jy] = geoXY(136.5, 36.5, ppd);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom }} light={{ dir: [-0.6, 0.8] }}>
        <MapBoard>
          <JapanMap x={-jx - 120} y={-jy - 20} ppd={ppd} w={4000} h={3000} />
        </MapBoard>
        <Ribbon x={330} y={250} w={340} z={5} />
      </Stage>
      <RibbonText text="JAPAN" x={330} y={250} zoom={zoom} size={0.05} at={sec(start)(38.2)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── D · the tokko ─────────────────────────

// D2 77.55 "Japan is losing the war."
export const LosingMapShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const zoom = push(frame, dur, 1.0, 1.05);
  const ppd = 21;
  const [ox, oy] = geoXY(134, 24, ppd);
  const mx = -ox + 60;
  const my = -oy + 30;
  const at = (lon: number, lat: number): [number, number] => {
    const [x, y] = geoXY(lon, lat, ppd);
    return [mx + x, my + y];
  };
  const isles: [number, number][] = [at(125, 11), at(145.7, 15.2), at(141.3, 24.8)];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom }} light={{ dir: [-0.6, 0.8] }}>
        <MapBoard>
          <JapanMap x={mx} y={my} ppd={ppd} w={4000} h={3000} />
        </MapBoard>
        {isles.map(([x, y], i) => {
          const fall = ramp(t, 78.2 + i * 0.25, 78.5 + i * 0.25, Easing.in(Easing.quad));
          return (
            <X key={i} x={x} y={y} z={2}>
              <X rot={-fall * 1.5}>
                <Line pts={[[0, 0], [0, 80]]} width={6} />
                <X x={4} y={78} z={0.01}>
                  <Part shape={roundRect(62, 40, 3)} color="#ffffff" flat outline={4} x={31} y={-20} />
                  <Hinomaru x={31} y={-20} r={11} rim={false} z={0.001} />
                </X>
              </X>
              {fall >= 1 ? <USFlag x={4} y={110} w={56} s={pop(t, 78.6 + i * 0.25)} z={0.1} /> : null}
              {fall >= 1 ? <Line pts={[[0, 0], [0, 112]]} width={6} z={0.09} /> : null}
            </X>
          );
        })}
        <GrowArrow pts={[at(146, 13), at(144, 20), at(141.5, 25.5), at(137, 31.5)]} k={ramp(t, 77.8, 79.0)} width={22} z={3} />
        <GrowArrow pts={[at(126, 9.5), at(124.5, 17), at(127, 24.5)]} k={ramp(t, 78.1, 79.2)} width={22} z={3} />
        <Ribbon x={0} y={360} w={560} z={5} />
      </Stage>
      <RibbonText text="PACIFIC · 1944" x={0} y={360} zoom={zoom} />
      <Label text="LOSING" x={0.8} y={0.62} size={0.08} kind="stamp" rotate={-8} at={sec(start)(78.43)} />
    </AbsoluteFill>
  );
};

// D4b 84.05 "… and crash them into enemy ships."
export const TopDiveShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const impact = 85.3;
  const k = ramp(t, 84.0, impact, Easing.in(Easing.quad));
  const tx = 240;
  const ty = -60;
  const x = interpolate(k, [0, 1], [-760, tx]);
  const y = interpolate(k, [0, 1], [460, ty]);
  const s = interpolate(k, [0, 1], [1.0, 0.22]);
  const after = t > impact;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0, shake: hitAt(t, impact, 0.6) * 14 }} light={{ dir: [-0.6, 0.8] }}>
        <Part shape={roundRect(5000, 3000, 0)} color="#3f86b8" flat outline={0} z={-40} />
        {Array.from({ length: 40 }, (_, i) => {
          const wx = ((i * 263) % 2200) - 1100;
          const wy = ((i * 167) % 1300) - 650;
          return <Line key={i} pts={[[wx - 30, wy], [wx, wy + 8], [wx + 30, wy]]} smooth width={4} color="#6aa6cc" z={-39} />;
        })}
        <ShipTop kind="carrier" x={tx} y={ty} len={760} rot={0.12} hit={after ? ramp(t, impact, impact + 0.3) : 0} z={1} />
        <ShipTop kind="destroyer" x={-560} y={220} len={360} rot={0.12} z={1} />
        <ShipTop kind="battleship" x={700} y={300} len={420} rot={0.12} z={1} />
        <Tracers x={-560} y={220} angle={2.6} spread={0.8} range={700} n={6} seed={3} z={2} />
        <Tracers x={tx} y={ty} angle={2.4} spread={0.8} range={800} n={8} seed={6} z={2} />
        <FlakField y={200} w={1800} h={700} n={7} period={32} seed={9} z={3} />
        {!after ? <ZeroTop x={x} y={y} s={s} rot={Math.atan2(ty - 460, tx + 760)} trail={0.8} z={4} /> : null}
        {after ? <Burst x={tx} y={ty} t={(t - impact) / 0.8} size={1.4} z={5} /> : null}
      </Stage>
    </AbsoluteFill>
  );
};

// D9 99.9 "And the flight to Okinawa, where the American fleet is waiting, takes two hours or more."
export const FlightMapShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const ppd = 60;
  const mx = 180;
  const my = 250;
  const route = ramp(t, 100.3, 103.3, (x) => x);
  const [rx, ry, ra] = japanRouteAt(Math.max(0.02, route), ppd);
  const [okx, oky] = cityXY("okinawa", ppd);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 }} light={{ dir: [-0.6, 0.8] }}>
        <JapanMap x={mx} y={my} ppd={ppd} route={route} dots={["kushira"]} />
        {[[90, 30, 0], [150, -40, 1], [60, -90, 2], [190, 40, 3]].map(([fx, fy, i]) => (
          <ShipTop key={i} kind={i === 1 ? "carrier" : "destroyer"} x={mx + okx + fx} y={my + oky + fy} len={i === 1 ? 90 : 60} rot={2.6} wake={0.6} s={pop(t, 101.68 + i * 0.1)} z={1.5} />
        ))}
        <ZeroTop x={mx + rx} y={my + ry} rot={ra} s={0.12} z={2} />
        <Clock x={600} y={150} r={110} speed={6} s={pop(t, 103.33)} z={2} />
        <Ribbon x={-420} y={-150} w={330} h={64} z={3} />
      </Stage>
      <RibbonText text="OKINAWA" x={-420} y={-150} at={sec(start)(100.6)} />
      <Label text="2+ HOURS" x={0.5 + 600 / 1920} y={0.5 - (150 - 190) / 1080} size={0.065} kind="box" at={sec(start)(103.6)} />
    </AbsoluteFill>
  );
};

// D10 104.7 "For the generals, a sleepy pilot means a wasted plane."
export const SleepyCockpitShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const nod = ramp(t, 105.9, 106.8);
  const fall = ramp(t, 107.1, 108.6, Easing.in(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), shake: fall * 5 }} light={{ dir: [-0.6, 0.8] }}>
        <CockpitView tilt={Math.sin(frame * 0.04) * 0.03 + fall * 0.5} dive={fall * 0.8}>
          <DivingPilot i={2} face="sleepy" nod={nod} />
        </CockpitView>
        <Wash width={4000} height={3000} color="#4a4a54" alpha={ramp(t, 107.4, 107.9) * 0.35} z={40} />
      </Stage>
      {nod > 0.5 ? <Label text="Zzz" x={0.62} y={0.24} size={0.08} rotate={-12} at={0} /> : null}
      <Label text="WASTED" x={0.74} y={0.5} size={0.12} kind="stamp" rotate={-10} at={sec(start)(107.39)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── E · before they die ─────────────────────────

// E14 150.72 "It's for the special attack pilots, to eat …"
export const ChocolateCockpitShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const bite = t > 152.6;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [0.6, 0.5] }}>
        <CockpitView mood="dawn" tilt={Math.sin(frame * 0.04) * 0.02}>
          <DivingPilot i={1} face="calm" armF={[1.6, 0.9]} holdF={<ChocolateStick s={0.45} rot={Math.PI / 2} crest bite={bite} />} />
        </CockpitView>
      </Stage>
    </AbsoluteFill>
  );
};

// E14b 153.1 "… before they die."
export const FarDiveShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = ramp(t, 153.1, 153.85, Easing.in(Easing.quad));
  const boom = t > 153.85 ? (t - 153.85) / 1.2 : 0;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.04), y: 40 }} light={{ dir: [0.6, 0.4] }} vignette={0.6}>
        <Sky w={5000} h={3000} y={1300} top="#3f4a86" mid="#c9708a" bottom="#f3b07a" z={-40} />
        <Sun x={-420} y={-60} r={140} color="#ffd9a0" z={-35} />
        <Sea w={5000} h={1400} y={-100} color="#4a5a8a" z={-30} />
        <X y={-100} z={1}>
          <Warship kind="carrier" x={200} y={-10} len={420} hit={boom > 0 ? Math.min(1, boom * 2) : 0} />
          <Warship kind="destroyer" x={-260} y={-4} len={240} />
        </X>
        {k < 1 ? (
          <ZeroFighter x={interpolate(k, [0, 1], [-700, 260])} y={interpolate(k, [0, 1], [380, -60])} rot={-0.6} s={interpolate(k, [0, 1], [0.35, 0.08])} gear={false} spin={1} trail={0.6} z={2} />
        ) : null}
        {boom > 0 && boom < 1 ? <Burst x={260} y={-70} t={boom} size={0.6} z={3} /> : null}
      </Stage>
    </AbsoluteFill>
  );
};

// ───────────────────────── F · the needle ─────────────────────────

// F4 172.3 "… at Kushira, an air base in Kagoshima."
export const KushiraMapShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const zoom = push(frame, dur, 1.0, 1.08);
  const ppd = 150;
  const [cx, cy] = geoXY(130.8, 32.1, ppd);
  const mx = -cx;
  const my = -cy + 60;
  const [kx, ky] = cityXY("kushira", ppd);
  const [gx, gy] = cityXY("kagoshima", ppd);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom }} light={{ dir: [-0.6, 0.8] }}>
        <JapanMap x={mx} y={my} ppd={ppd} dots={["kushira", "kagoshima"]} />
        <X x={mx + kx} y={my + ky} z={2}>
          <Part shape={circle(24 + Math.sin(frame * 0.2) * 4)} color="#c8262f" flat outline={4} opacity={0.35} />
          <ZeroTop x={40} y={20} s={0.1} rot={-0.4} z={0.1} />
        </X>
        <Line pts={[[mx + kx + 10, my + ky + 14], [mx + kx + 230, my + ky + 120]]} width={5} z={2.5} />
        <Ribbon x={mx + kx + 430} y={my + ky + 120} w={420} h={66} z={3} />
      </Stage>
      <RibbonText text="KUSHIRA AIR BASE" x={mx + kx + 430} y={my + ky + 120} zoom={zoom} at={sec(start)(172.51)} />
      <Label text="KAGOSHIMA" {...scr(mx + gx - 150, my + gy + 50, zoom)} size={0.036} at={sec(start)(174.1)} />
    </AbsoluteFill>
  );
};

// F5 175.0 "When the battle of Okinawa begins,"
export const BattleShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const down = ramp(t, 175.0, 175.85, Easing.in(Easing.quad));
  const dive = ramp(t, 175.2, 176.35, Easing.in(Easing.quad));
  const hitT = 176.35;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: 60, shake: hitAt(t, hitT, 0.5) * 12 + hitAt(t, 175.85, 0.3) * 4 }} light={{ dir: [-0.6, 0.8] }}>
        <OkinawaSea mood="dusk" horizon={-40}>
          <Warship kind="carrier" x={40} y={-40} len={520} z={1} />
          <Warship kind="battleship" x={-480} y={-200} len={880} z={2} />
          <Warship kind="destroyer" x={560} y={-150} len={700} hit={t > hitT ? ramp(t, hitT, hitT + 0.3) : 0} z={2} />
          <Tracers x={-400} y={-100} angle={1.9} spread={0.6} range={1100} n={9} seed={11} z={3} />
          <Tracers x={500} y={-60} angle={1.4} spread={0.6} range={1000} n={8} seed={12} z={3} />
          <FlakField y={360} w={1800} h={420} n={10} period={30} seed={13} z={2.5} />
          {down < 1 ? (
            <ZeroFighter x={interpolate(down, [0, 1], [-900, -140])} y={interpolate(down, [0, 1], [480, -60])} rot={-0.8} s={0.4} gear={false} spin={1} trail={1} fire={1} z={4} />
          ) : null}
          <SplashColumn x={-140} y={-60} t={(t - 175.85) / 1.2} h={420} z={4.5} />
          {dive < 1 ? (
            <ZeroFighter x={interpolate(dive, [0, 1], [1150, 560])} y={interpolate(dive, [0, 1], [540, -70])} sx={-1} rot={0.75} s={0.45} gear={false} bomb spin={1} trail={0.6} z={4} />
          ) : null}
          {t > hitT ? <Burst x={560} y={-60} t={(t - hitT) / 0.9} size={1.5} z={5} /> : null}
        </OkinawaSea>
      </Stage>
      <Label text="BATTLE OF OKINAWA" sub="APRIL 1945" x={0.5} y={0.14} size={0.08} kind="title" at={sec(start)(175.79)} />
    </AbsoluteFill>
  );
};

// F12b 192.6 "… at least 200 young men."
export const PortraitWallShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.12, 0.98), y: 40 }} light={{ pos: [0, 400] }} vignette={0.65}>
        <PlankWall w={4000} h={2400} y={300} color="#4e3828" z={-40} />
        <Glow y={200} rx={1100} ry={600} color="#ffcf7a" alpha={0.18} additive z={-39} />
        {Array.from({ length: 27 }, (_, i) => {
          const col = i % 9;
          const row = Math.floor(i / 9);
          return <MemorialPortrait key={i} x={-880 + col * 220} y={430 - row * 230} s={0.62} seed={i} z={1 + i * 0.01} />;
        })}
        <Smoke x={-600} y={-320} w={120} h={700} alpha={0.3} seed={4} z={3} />
        <Smoke x={620} y={-320} w={120} h={700} alpha={0.3} seed={8} z={3} />
      </Stage>
      <Label text="200" sub="YOUNG MEN" x={0.5} y={0.42} size={0.18} kind="title" at={sec(start)(192.79)} />
    </AbsoluteFill>
  );
};

// F17 202.9 "He has no answer."
export const TakeoffShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = ramp(t, 202.9, 204.2, Easing.in(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -20 }} light={{ dir: [0.6, 0.5] }} shadowMul={[0.6, 0.55, 0.65]} vignette={0.6}>
        <Airfield mood="dusk" planes={false} trees>
          <ZeroFighter x={interpolate(k, [0, 1], [-200, 900])} y={interpolate(k, [0, 1], [-60, 260])} rot={k * 0.25} s={0.55} gear={k < 0.5} spin={1} z={1} />
          <Character {...DOCTOR} x={-520} y={-620} s={1.5} z={3} look={0.6} expression={{ eyes: "half", mouth: "flat", brows: 0.7, gaze: [0.8, 0.3] }} pose={poses.idle(frame)} />
        </Airfield>
      </Stage>
    </AbsoluteFill>
  );
};

// ───────────────────────── G · the honour ─────────────────────────

// G10b 229.5 "… dying for the emperor was the greatest honor."
export const AltarShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -20 }} light={{ pos: [0, 300] }} shadowMul={[0.55, 0.5, 0.62]} vignette={0.7}>
        <TatamiRoom floorY={-300} light={0.15}>
          <MemorialAltar x={160} y={-300} s={0.85} seed={2} z={1} />
          <Character {...MOTHER} x={-560} y={-470} s={1.2} z={3} look={0.4} expression={{ eyes: "closed", mouth: "frown", brows: 0.8 }} pose={{ ...poses.sit(frame), headTilt: -0.15, armF: [0.9, 1.6], armB: [0.7, 1.6] }} />
          <Character {...FATHER} x={-300} y={-470} s={1.3} z={2.9} look={0.4} expression={{ eyes: "closed", mouth: "flat", brows: 0.6 }} pose={{ ...poses.sit(frame), headTilt: -0.1 }} />
        </TatamiRoom>
      </Stage>
      <Label text="GREATEST HONOR" x={0.68} y={0.12} size={0.065} kind="box" at={sec(start)(230.88)} />
    </AbsoluteFill>
  );
};

// G11 231.85 "The shot only made sure they didn't fall asleep on the way."
export const AwakeCockpitShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const dive = ramp(t, 233.6, 234.8) * 0.5;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), shake: 2 + dive * 6 }} light={{ dir: [-0.6, 0.8] }}>
        <CockpitView tilt={Math.sin(frame * 0.05) * 0.02 + dive * 0.2} dive={dive} outside={<FleetAhead near={dive} />}>
          <DivingPilot i={1} face="wide" />
        </CockpitView>
      </Stage>
      <Label text="Zzz" x={0.8} y={0.22} size={0.08} at={sec(start)(232.6)} />
      {t > 233.55 ? <Label text="✕" x={0.8} y={0.22} size={0.16} color="#fe5649" at={0} /> : null}
    </AbsoluteFill>
  );
};

