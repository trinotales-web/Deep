import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, X, Part, Line, Glow, Wash, QuestionMark, CommentBubble, Shovel, roundRect, roundPoly, circle, blob, poly, ellipse, ramp, push, hitAt, absT, mixHex, rng, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  TerracottaPit, ClayHead, DigWell, PersimmonTree, BurialMound, MoundSection, MercuryRiver, StarCeiling, Horse, Wheel, Flame, Smoke, Sunburst,
  BambooSlips, TreasureChest, OilLamp, StoneGate, QinThrone,
} from "../../kit/env";
import { sec, pop, scr } from "../../kit/shot";
import { Plains, TombCorridor, PalaceVault, Farmland, ThroneHall } from "./sets";
import { EMPEROR, HUHAI, WORKER, FARMER, ARCH74, ARCHAEOLOGIST, SCIENTIST, SIMA_QIAN, REBEL, TOURIST, TERRACOTTA, CLAY } from "./cast";
import { upright, You } from "./p1a";

type Design = ReturnType<typeof TERRACOTTA>;

/** Terracotta warrior with the original paint faded in by `k` 0..1. */
export const terra = (i: number, k: number): Design => {
  const plain = TERRACOTTA(i, false);
  const paint = TERRACOTTA(i, true);
  const m = (a?: string | null, b?: string | null) => (a && b ? mixHex(a, b, k) : (b ?? a ?? undefined));
  return {
    ...plain,
    skin: m(plain.skin, paint.skin) as string,
    hairColor: m(plain.hairColor, paint.hairColor) as string,
    mustacheColor: m(plain.mustacheColor, paint.mustacheColor) as string,
    outfit: {
      ...plain.outfit,
      top: m(plain.outfit.top, paint.outfit.top) as string,
      bottom: m(plain.outfit.bottom, paint.outfit.bottom) as string,
      boots: m(plain.outfit.boots, paint.outfit.boots) as string,
      lamellar: m(plain.outfit.lamellar, paint.outfit.lamellar) as string,
    },
  };
};

/** Paint flakes peeling off (curl then fall). */
export const Flakes: React.FC<{ x: number; y: number; w: number; h: number; k: number; fall: number; seed?: number; z?: number }> = ({ x, y, w, h, k, fall, seed = 3, z = 0 }) => {
  const r = rng(seed);
  const items = Array.from({ length: 22 }, () => [(r() - 0.5) * w, r() * h, r(), ["#b8322a", "#3f8a5a", "#7a4a9a", "#2f5fa8", "#f2c9b8"][Math.floor(r() * 5)]] as [number, number, number, string]);
  return (
    <X x={x} y={y} z={z}>
      {items.map(([fx, fy, q, c], i) =>
        k > q * 0.6 ? (
          <X key={i} x={fx + fall * (q - 0.5) * 200} y={fy - fall * (200 + q * 400)} rot={(k - q) * 3 + fall * q * 6}>
            <Part shape={blob([[-10, -6], [12, -8], [10, 8], [-12, 6]], 4)} color={c} flat outline={2.5} s={0.8 + q} />
          </X>
        ) : null,
      )}
    </X>
  );
};

/** Earth cut-away under the surface with buried clay soldiers. */
const Underground: React.FC<{ y: number; w?: number; reveal?: number; z?: number }> = ({ y, w = 4000, reveal = 1, z = 0 }) => (
  <X y={y} z={z}>
    <Part shape={roundRect(w, 700, 0)} color="#8a6240" flat outline={0} y={-350} />
    <Line pts={[[-w / 2, 0], [w / 2, 0]]} width={6} z={0.001} />
    {Array.from({ length: 9 }, (_, i) => (
      <X key={i} x={-820 + i * 205} y={-430} s={0.6} z={0.01}>
        <Character {...TERRACOTTA(i)} look={0.2} shadow={false} expression={{ eyes: "half", mouth: "flat" }} pose={poses.idle(0, i)} />
      </X>
    ))}
    <Wash width={w} height={700} color="#4a3020" alpha={0.6 * (1 - reveal)} z={0.5} />
  </X>
);

// ───────────────────────── the discovery ─────────────────────────

// 85.5 "Over 2,000 years later, farmers digging a well find an army of clay soldiers guarding it."
export const FarmersWellShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const dig = Math.sin(frame * 0.3);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.0), y: interpolate(t, [85.5, 91], [120, -60]) }} light={{ dir: [-0.6, 0.8] }}>
        <Farmland horizon={60}>
          <DigWell x={-80} y={-60} s={0.6} z={1} />
          {[-320, 160].map((x, i) => (
            <Character key={x} {...FARMER(i)} x={x} y={-80} s={0.75} z={2} facing={i ? -1 : 1} look={0.5} expression={{ eyes: "half", mouth: "teeth", brows: -0.2 }} pose={{ armF: [1.4 + dig * 0.4, 0.6], armB: [1.1, 0.7], lean: -0.15 }} holdF={<Shovel rot={upright([1.4, 0.6]) + 2.6} />} />
          ))}
          <Underground y={-100} reveal={ramp(t, 88.8, 90.3)} z={3} />
        </Farmland>
      </Stage>
      <Label text="2,000+ YEARS LATER" x={0.5} y={0.12} size={0.06} kind="box" at={sec(start)(85.9)} />
    </AbsoluteFill>
  );
};

// 91.05 "It's 1974."
export const Year1974Shot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: 40 }} light={{ dir: [-0.6, 0.8] }}>
        <Farmland horizon={-120} />
      </Stage>
      <Label text="1974" x={0.5} y={0.3} size={0.16} kind="title" at={sec(start)(91.4)} />
    </AbsoluteFill>
  );
};

// 92.65 "A farmer named Yang Zhifa and his brothers are digging in a field."
export const YangZhifaShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -20 }} light={{ dir: [-0.6, 0.8] }}>
        <Farmland horizon={-80} mound={false}>
          {[0, 1, 2].map((i) => {
            const dig = Math.sin(frame * 0.28 + i * 1.3);
            return (
              <Character key={i} {...FARMER(i)} x={-480 + i * 420} y={-500} s={1.05} z={2 + i * 0.01} facing={i === 2 ? -1 : 1} look={0.5} expression={{ eyes: i === 0 ? "open" : "half", mouth: i === 0 ? "smile" : "teeth", brows: -0.2 }} pose={{ armF: [0.9 + dig * 0.25, 0.4], armB: [0.7 + dig * 0.2, 0.5], lean: -0.1 + dig * 0.05 }} holdF={<X rot={upright([0.9 + dig * 0.25, 0.4]) - Math.PI / 2 + 0.2} s={0.6}><Shovel x={-120} /></X>} />
            );
          })}
        </Farmland>
      </Stage>
      <Label text="YANG ZHIFA" sub="FARMER" x={0.26} y={0.14} size={0.075} kind="title" at={sec(start)(93.7)} />
      <Label text="+ BROTHERS" x={0.72} y={0.14} size={0.05} kind="box" at={sec(start)(95.1)} />
    </AbsoluteFill>
  );
};

// 97.05 "It's about one and a half kilometers from the hill."
export const DistanceShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = ramp(t, 97.6, 98.6);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.0), y: 60 }} light={{ dir: [0.6, 0.5] }}>
        <Plains mood="day" horizon={-140}>
          <BurialMound x={-560} y={-142} w={800} h={300} stage="done" z={-27} />
          <DigWell x={620} y={-300} s={0.5} z={1} />
          <X y={-60} z={4}>
            <Line pts={[[-180, 0], [-180 + 700 * k, 0]]} width={10} color="#fe5649" />
            <Line pts={[[-180, -30], [-180, 30]]} width={10} color="#fe5649" />
            {k >= 1 ? <Line pts={[[520, -30], [520, 30]]} width={10} color="#fe5649" /> : null}
          </X>
        </Plains>
      </Stage>
      <Label text="1.5 KM" x={0.5 + 170 / 1920} y={0.5 - (-60 + 80 - 60) / 1080} size={0.08} kind="title" at={sec(start)(98.1)} />
    </AbsoluteFill>
  );
};

// 99.45 "They find pieces of pottery."
export const PotteryShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const arm: [number, number] = [1.6, 0.5];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.1, 1.18), y: -80 }} light={{ dir: [-0.6, 0.8] }}>
        <Farmland horizon={-80} mound={false}>
          <Part shape={roundRect(4000, 600, 0)} color="#9a6e48" flat outline={0} y={-680} z={1} />
          {[[-200, -520, 0.3], [-60, -560, -0.6], [120, -530, 1.1], [260, -570, 0.2]].map(([x, y, r], i) => (
            <Part key={i} shape={poly([[-40, -20], [30, -30], [46, 10], [-10, 30], [-44, 10]])} color={CLAY} shade={0.2} x={x} y={y} rot={r} s={pop(t, 99.7 + i * 0.15)} z={2} />
          ))}
          <Character {...FARMER(0)} x={-560} y={-640} s={1.25} z={3} look={0.5} expression={{ eyes: "wide", mouth: "o", brows: 0.4, gaze: [0.6, -0.6] }} pose={{ armF: arm, armB: [-0.2, -0.1], lean: -0.2 }} holdF={<Part shape={poly([[-30, -14], [24, -22], [34, 8], [-8, 22], [-34, 8]])} color={CLAY} shade={0.2} rot={upright(arm)} />} />
        </Farmland>
      </Stage>
      <Label text="POTTERY" x={0.6} y={0.18} size={0.06} kind="box" at={sec(start)(100.4)} />
    </AbsoluteFill>
  );
};

// 101.25 "Then a clay head."
export const ClayHeadShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const up = ramp(t, 101.6, 102.2, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.15, y: -60, shake: hitAt(t, 102.2, 0.3) * 5 }} light={{ dir: [-0.6, 0.8] }}>
        <Farmland horizon={-60} mound>
          <DigWell x={0} y={-520} s={0.8} pull={0.9} z={1} />
          <ClayHead x={0} y={interpolate(up, [0, 1], [-560, -280])} s={1.4} rot={-0.2} z={2} />
          <Character {...FARMER(0)} x={-520} y={-620} s={1.2} z={3} look={0.5} expression={t > 102.2 ? { eyes: "wide", mouth: "shout", brows: 0.9, sweat: true } : { eyes: "open", mouth: "o", brows: 0.4 }} pose={t > 102.2 ? poses.scared(frame) : poses.idle(frame)} />
          <Character {...FARMER(1)} x={520} y={-620} s={1.2} z={3} facing={-1} look={0.5} expression={t > 102.2 ? { eyes: "wide", mouth: "o", brows: 0.9 } : { eyes: "open", mouth: "smile" }} pose={t > 102.2 ? poses.armsUp(frame) : poses.idle(frame, 2)} />
        </Farmland>
      </Stage>
    </AbsoluteFill>
  );
};

// 102.8 "Archaeologists rush in, and they can't believe what they see."
export const RushInShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const run = ramp(t, 102.9, 104.6, (x) => x);
  const awe = t > 104.7;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -20 }} light={{ dir: [-0.6, 0.8] }}>
        <Farmland horizon={-60} mound>
          {[0, 1, 2].map((i) => (
            <Character key={i} {...ARCH74(i)} x={interpolate(run, [0, 1], [-1200 - i * 220, -420 + i * 260])} y={-580 + (i % 2) * 10} s={1.1} z={2 + i * 0.01} look={0.5} expression={awe ? { eyes: "wide", mouth: "o", brows: 0.9 } : { eyes: "open", mouth: "shout", brows: 0.4 }} pose={awe ? poses.armsUp(frame + i * 7) : poses.run(frame + i * 5)} />
          ))}
        </Farmland>
      </Stage>
    </AbsoluteFill>
  );
};

// 106.3 "They think more than 8,000 soldiers are buried there."
export const EightThousandShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 80 }} light={{ dir: [-0.6, 0.8] }}>
        <TerracottaPit y={-440} w={2200} rows={5} cols={9} />
      </Stage>
      <Label text="8,000+" x={0.5} y={0.16} size={0.12} kind="title" at={sec(start)(107.1)} />
    </AbsoluteFill>
  );
};

/** Pit floor backdrop for close shots of the statues. */
export const PitFloor: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <>
    <Part shape={roundRect(5000, 3000, 0)} color="#b08458" flat outline={0} z={-41} />
    {[-300, 100].map((y, i) => (
      <Part key={y} shape={roundRect(5000, 70, 0)} color="#c99a68" shade={0.15} y={y} z={-40 + i * 0.01} />
    ))}
    {children}
  </>
);

// 109.25 "Archers, officers, …"
export const ArchersOfficersShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.05, y: -40 }} light={{ dir: [-0.6, 0.8] }}>
        <PitFloor>
          <Character {...TERRACOTTA(0)} x={-420} y={-470} s={1.25} z={2} look={0.3} expression={{ eyes: "half", mouth: "flat", brows: -0.2 }} pose={{ ...poses.sit(0), armF: [1.6, 0.3], armB: [1.4, 0.4] }} />
          <Character {...TERRACOTTA(1)} hat="guan" hatColor="#8a6440" hair={null} x={380} y={-600} s={1.5} z={2} look={0.3} expression={{ eyes: "half", mouth: "flat", brows: -0.4 }} pose={{ armF: [0.6, 1.4], armB: [0.6, 1.4] }} />
        </PitFloor>
      </Stage>
      <Label text="ARCHERS" x={0.28} y={0.18} size={0.06} kind="box" at={sec(start)(109.4)} />
      <Label text="OFFICERS" x={0.7} y={0.14} size={0.06} kind="box" at={sec(start)(109.9)} />
    </AbsoluteFill>
  );
};

// 110.55 "… horses and chariots, standing in rows, ready for battle."
export const HorsesChariotsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const g = -430;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -10 }} light={{ dir: [-0.6, 0.8] }}>
        <PitFloor>
          {/* four clay horses abreast, nearest lowest and on top */}
          {[3, 2, 1, 0].map((i) => (
            <Horse key={i} x={60 + i * 70} y={g + i * 46} s={0.95 - i * 0.03} color={mixHex(CLAY, "#6a4a30", i * 0.16)} clay z={2 - i * 0.1} />
          ))}
          {/* chariot: pole to the team, box, driver, wheel */}
          <X x={-330} y={g} z={2.5}>
            <Line pts={[[110, 150], [360, 190]]} width={12} color="#7a5232" z={-0.02} />
            <Character {...TERRACOTTA(4)} hat="guan" hatColor="#8a6440" hair={null} x={0} y={110} s={0.9} z={-0.01} look={0.4} expression={{ eyes: "half", mouth: "flat", brows: -0.3 }} pose={{ armF: [1.3, 0.6], armB: [1.2, 0.7] }} />
            <Part shape={roundRect(250, 130, 10)} color="#8a6440" shade={0.2} y={180}>
              <Line pts={[[-100, 0], [100, 0]]} width={4} color="#6a4a30" z={0.001} />
            </Part>
            <Wheel y={110} r={110} color="#7a5232" z={0.01} />
          </X>
          {[-740, -600].map((x, i) => (
            <Character key={x} {...TERRACOTTA(i + 2)} x={x} y={g - 40} s={1.0} z={3} look={0.3} expression={{ eyes: "half", mouth: "flat" }} pose={poses.idle(0, i)} />
          ))}
        </PitFloor>
      </Stage>
      <Label text="HORSES" x={0.62} y={0.16} size={0.06} kind="box" at={sec(start)(110.6)} />
      <Label text="CHARIOTS" x={0.3} y={0.16} size={0.06} kind="box" at={sec(start)(111.4)} />
    </AbsoluteFill>
  );
};

// 112.0 "… standing in rows, ready for battle."
export const RowsShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 60 }} light={{ dir: [-0.6, 0.8] }}>
        <PitFloor>
          {[2, 1, 0].map((r) =>
            Array.from({ length: 6 + r }, (_, i) => {
              const sc = 1 - r * 0.2;
              const n = 6 + r;
              return <Character key={`${r}-${i}`} {...TERRACOTTA(i + r)} x={(i - (n - 1) / 2) * 300 * sc} y={-560 + r * 200} s={0.95 * sc} z={3 - r} look={0.1} expression={{ eyes: "half", mouth: "flat", brows: -0.2 }} pose={poses.idle(0, i)} />;
            }),
          )}
        </PitFloor>
      </Stage>
    </AbsoluteFill>
  );
};

// 114.3 "Their faces look different, almost like real people."
export const FacesShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const s = 1.6;
  const faces = [
    { mustache: "walrus" as const, expression: { eyes: "half" as const, mouth: "flat" as const, brows: -0.2 } },
    { mustache: "thin" as const, beard: "goatee" as const, expression: { eyes: "open" as const, mouth: "smile" as const, brows: 0.1 } },
    { mustache: null, expression: { eyes: "half" as const, mouth: "smirk" as const, brows: -0.5 } },
    { mustache: "handlebar" as const, expression: { eyes: "open" as const, mouth: "frown" as const, brows: 0.4 } },
  ];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ dir: [-0.6, 0.8] }} vignette={0.5}>
        <PitFloor>
          {faces.map((f, i) => (
            <Character key={i} {...TERRACOTTA(i)} mustache={f.mustache} mustacheColor="#7a5a3a" beard={f.beard ?? null} beardColor="#7a5a3a" x={-690 + i * 460} y={-60 - 308 * s} s={s} z={2} look={0.3} facing={i < 2 ? 1 : -1} expression={f.expression} pose={poses.idle(0, i)} />
          ))}
        </PitFloor>
      </Stage>
    </AbsoluteFill>
  );
};

// ───────────────────────── the lost colours ─────────────────────────

// 117.2 "And here's the part most people don't know."
export const MostDontKnowShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const s = 2.2;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.8] }} vignette={0.5}>
        <Sunburst r={2600} rays={20} color="#c9a274" alt="#c09868" speed={0.4} z={-40} />
        <Character {...ARCHAEOLOGIST(1)} x={-120} y={-40 - 308 * s} s={s} z={2} look={0.3} talking expression={{ eyes: "half", mouth: "smirk", brows: -0.5 }} pose={{ armF: [2.6, 2.2], armB: [-0.2, -0.1] }} />
      </Stage>
    </AbsoluteFill>
  );
};

// 119.45 "They weren't brown."
export const NotBrownShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const s = 1.8;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 }} light={{ dir: [-0.6, 0.8] }} vignette={0.5}>
        <PitFloor>
          <Character {...TERRACOTTA(0)} x={-200} y={-40 - 308 * s} s={s} z={2} look={0.3} expression={{ eyes: "half", mouth: "flat" }} pose={poses.idle(frame)} />
        </PitFloor>
      </Stage>
      <Label text="BROWN" x={0.7} y={0.36} size={0.1} kind="title" at={sec(start)(119.6)} />
      <Label text="✕" x={0.7} y={0.36} size={0.2} color="#fe5649" at={sec(start)(119.95)} />
    </AbsoluteFill>
  );
};

// 120.7 "They were painted in bright colors."
export const PaintedShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = ramp(t, 121.0, 122.4);
  const s = 1.8;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 + k * 0.04 }} light={{ dir: [-0.6, 0.8] }} vignette={0.5}>
        <PitFloor>
          {k > 0 ? <Glow x={-200} y={0} rx={600 * k + 1} color="#fff3d6" alpha={0.4} additive z={1} /> : null}
          <Character {...terra(0, k)} x={-200} y={-40 - 308 * s} s={s} z={2} look={0.3} expression={{ eyes: "half", mouth: k > 0.5 ? "smile" : "flat" }} pose={poses.idle(frame)} />
        </PitFloor>
      </Stage>
      <Label text="BRIGHT COLORS" x={0.7} y={0.3} size={0.07} kind="box" at={sec(start)(121.7)} />
    </AbsoluteFill>
  );
};

// 122.8 "Red, green, purple and blue. Pink faces, black hair."
export const ColorsShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const sw: [string, string, number][] = [["RED", "#b8322a", 122.9], ["GREEN", "#3f8a5a", 123.1], ["PURPLE", "#7a4a9a", 123.5], ["BLUE", "#2f5fa8", 124.0], ["PINK FACES", "#f2c9b8", 124.5], ["BLACK HAIR", "#1e1a20", 125.3]];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 }} light={{ dir: [-0.6, 0.8] }} vignette={0.5}>
        <PitFloor>
          {[0, 1, 2].map((i) => (
            <Character key={i} {...terra(i, 1)} x={-760 + i * 280} y={-600} s={1.15} z={2 + i * 0.01} look={0.3} expression={{ eyes: "half", mouth: "smile" }} pose={poses.idle(frame, i)} />
          ))}
          {sw.map(([, c, at], i) => (
            <X key={i} x={240 + (i % 2) * 330} y={300 - Math.floor(i / 2) * 200} s={pop(t, at)} z={5}>
              <Part shape={roundRect(140, 110, 16)} color={c} shade={0.15} />
            </X>
          ))}
        </PitFloor>
      </Stage>
      {sw.map(([name, , at], i) => (
        <Label key={name} text={name} x={0.5 + (240 + (i % 2) * 330 + 90 + name.length * 11) / 1920} y={0.5 - (300 - Math.floor(i / 2) * 200) / 1080} size={0.032} at={sec(start)(at)} />
      ))}
    </AbsoluteFill>
  );
};

/** Big stopwatch. */
export const Stopwatch: React.FC<{ x: number; y: number; s?: number; k: number; z?: number }> = ({ x, y, s = 1, k, z = 0 }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={roundRect(40, 40, 8)} color="#8a8790" shade={0.2} y={120} />
    <Part shape={circle(110)} color="#f4f1ea" shade={0.15} />
    <Part shape={poly(Array.from({ length: 24 }, (_, i) => {
      const a = Math.PI / 2 - (i / 23) * Math.PI * 2 * k;
      return i === 0 ? [0, 0] : ([Math.cos(a) * 90, Math.sin(a) * 90] as [number, number]);
    }))} color="#fe5649" flat outline={0} opacity={0.6} z={0.001} />
    <Line pts={[[0, 0], [Math.cos(Math.PI / 2 - k * Math.PI * 2) * 90, Math.sin(Math.PI / 2 - k * Math.PI * 2) * 90]]} width={8} z={0.002} />
  </X>
);

// 126.2 "But once the dry air touches them, the paint starts to curl in 15 seconds."
export const CurlShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const curl = ramp(t, 128.4, 130.5);
  const s = 1.8;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.05 }} light={{ dir: [-0.6, 0.8] }} vignette={0.5}>
        <PitFloor>
          <Character {...terra(1, 1 - curl * 0.15)} x={-260} y={-40 - 308 * s} s={s} z={2} look={0.3} expression={{ eyes: "half", mouth: curl > 0.3 ? "wavy" : "smile", brows: curl * 0.6 }} pose={poses.idle(frame)} />
          <Flakes x={-260} y={-480} w={260} h={720} k={curl} fall={0} z={3} />
          <Stopwatch x={540} y={120} s={1.1} k={ramp(t, 127.0, 130.0)} z={4} />
        </PitFloor>
      </Stage>
      <Label text="15 SEC" x={0.5 + 540 / 1920} y={0.5 - (120 - 170) / 1080} size={0.07} kind="title" at={sec(start)(129.3)} />
    </AbsoluteFill>
  );
};

// 130.6 "In about four minutes, much of it falls off."
export const FallsOffShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const fall = ramp(t, 131.6, 133.4, Easing.in(Easing.quad));
  const s = 1.8;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.05 }} light={{ dir: [-0.6, 0.8] }} vignette={0.5}>
        <PitFloor>
          <Character {...terra(1, 0.85 - fall * 0.75)} x={-260} y={-40 - 308 * s} s={s} z={2} look={0.3} expression={{ eyes: "half", mouth: "frown", brows: 0.6 }} pose={poses.idle(frame)} />
          <Flakes x={-260} y={-480} w={260} h={720} k={1} fall={fall} z={3} />
          <Character {...ARCH74(0)} x={560} y={-600} s={1.2} z={2} facing={-1} look={0.5} expression={{ eyes: "wide", mouth: "shout", brows: 0.9, sweat: true }} pose={poses.scared(frame)} />
        </PitFloor>
      </Stage>
      <Label text="4 MIN" x={0.7} y={0.16} size={0.08} kind="title" at={sec(start)(131.1)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── fire and mercury ─────────────────────────

// 133.65 "Archaeologists also find burn marks, and many of the weapons are gone."
export const BurnMarksShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 80 }} light={{ dir: [-0.6, 0.8] }}>
        <TerracottaPit y={-440} w={2200} rows={5} cols={9} burn={1} />
      </Stage>
      <Label text="BURN MARKS" x={0.3} y={0.14} size={0.06} kind="box" at={sec(start)(135.3)} />
      <Label text="WEAPONS GONE" x={0.7} y={0.14} size={0.06} kind="box" at={sec(start)(137.1)} />
    </AbsoluteFill>
  );
};

// 137.8 "Who did it?"
export const WhoDidItShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.06, 1.12), y: 80 }} light={{ dir: [-0.6, 0.8] }}>
        <TerracottaPit y={-440} w={2200} rows={5} cols={9} burn={1} />
        <QuestionMark x={0} y={260} s={1.2 * pop(t, 138.1)} rot={0.1} z={20} />
      </Stage>
    </AbsoluteFill>
  );
};

/** A rebel's torch held upright. */
const TorchProp: React.FC<{ rot: number; seed?: number }> = ({ rot, seed = 1 }) => (
  <X rot={rot}>
    <Line pts={[[0, -20], [0, 170]]} width={12} color="#6e4a2c" />
    <Flame y={180} size={0.45} seed={seed} />
    <Glow y={190} rx={180} color="#ffb35a" alpha={0.4} additive />
  </X>
);

// 138.65 "Probably rebels."
export const RebelsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const arm: [number, number] = [2.6, 0.3];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -20 }} light={{ pos: [0, 200] }} vignette={0.7} vignetteColor="#04060c">
        <Plains mood="night" horizon={-60}>
          {[0, 1, 2].map((i) => (
            <Character key={i} {...REBEL(i)} x={-480 + i * 480} y={-580} s={1.2} z={2 + i * 0.01} facing={i === 2 ? -1 : 1} look={0.5} talking expression={{ eyes: "angry", mouth: "shout", brows: -0.8 }} pose={{ armF: [arm[0] + Math.sin(frame * 0.3 + i) * 0.2, arm[1]], armB: [-0.3, -0.1], armsOverHead: true }} holdF={<TorchProp rot={upright(arm)} seed={i} />} />
          ))}
        </Plains>
      </Stage>
      <Label text="REBELS" x={0.5} y={0.12} size={0.08} kind="stamp" rotate={-6} at={sec(start)(139.3)} />
    </AbsoluteFill>
  );
};

// 140.0 "A few years after the emperor died, they broke in and set the pits on fire."
export const SetFireShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const fire = ramp(t, 142.6, 144.0);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 80, shake: fire * 2 }} light={{ pos: [0, 200] }} vignette={0.7}>
        <TerracottaPit y={-440} w={2200} rows={5} cols={9} burn={fire} />
        {fire > 0
          ? [-700, -300, 100, 500, 800].map((x, i) => (
              <X key={x} x={x} y={-300 + (i % 2) * 140} s={fire} z={10}>
                <Flame size={1.2} seed={i + 2} />
                <Glow y={80} rx={300} color="#ff8a3a" alpha={0.5} additive />
              </X>
            ))
          : null}
        {fire > 0 ? <Smoke x={0} y={200} w={1400} h={900} alpha={0.45 * fire} seed={3} z={11} /> : null}
        <Wash width={4000} height={3000} color="#2a0e08" alpha={0.25 * fire} z={12} />
      </Stage>
    </AbsoluteFill>
  );
};

/** Danger sign for mercury. */
const HgSign: React.FC<{ x: number; y: number; s?: number; z?: number }> = ({ x, y, s = 1, z = 0 }) => (
  <X x={x} y={y} s={s} z={z}>
    <Line pts={[[0, 0], [0, 180]]} width={10} color="#5a5a64" />
    <Part shape={poly([[0, 330], [110, 150], [-110, 150]])} color="#f2c84a" shade={0.15} y={0} />
    <Part shape={circle(26)} color="#c4ced8" shade={0.2} y={210} z={0.01} />
  </X>
);

// 144.7 "But the tomb itself has never been opened, partly because of all that mercury."
export const NeverOpenedShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: 60 }} light={{ dir: [0.6, 0.5] }}>
        <Plains mood="day" horizon={-160} mound="done" moundS={1.2}>
          {Array.from({ length: 18 }, (_, i) => (
            <Line key={i} pts={[[-900 + i * 106, -260], [-900 + i * 106, -170]]} width={8} color="#5a5a64" z={2} />
          ))}
          <Line pts={[[-900, -190], [900, -190]]} width={6} color="#5a5a64" z={2.1} />
          <HgSign x={620} y={-300} s={0.9} z={3} />
        </Plains>
      </Stage>
      <Label text="NEVER OPENED" x={0.5} y={0.12} size={0.07} kind="stamp" rotate={-6} at={sec(start)(146.6)} />
      <Label text="Hg" x={0.5 + 620 / 1920} y={0.5 - (-300 + 0.9 * 210 + 60 * 0) / 1080 + 0.03} size={0.035} color="#211b20" at={sec(start)(148.3)} />
    </AbsoluteFill>
  );
};

/** Handheld mercury meter with a needle. */
export const Gauge: React.FC<{ x: number; y: number; s?: number; k: number; z?: number }> = ({ x, y, s = 1, k, z = 0 }) => {
  const a = Math.PI - k * Math.PI;
  return (
    <X x={x} y={y} s={s} z={z}>
      <Part shape={roundRect(360, 260, 30)} color="#f2c84a" shade={0.2} />
      <Part shape={roundRect(300, 170, 16)} color="#f4f1ea" flat outline={5} y={20} z={0.001} />
      {[0, 1, 2].map((i) => (
        <Line key={i} pts={Array.from({ length: 9 }, (_, j) => {
          const aa = Math.PI - (i / 3 + (j / 8) / 3) * Math.PI;
          return [Math.cos(aa) * 120, -40 + Math.sin(aa) * 120] as [number, number];
        })} width={14} color={["#5aa86a", "#e9c66a", "#fe5649"][i]} z={0.002} />
      ))}
      <Line pts={[[0, -40], [Math.cos(a) * 110, -40 + Math.sin(a) * 110]]} width={7} z={0.003} />
      <Part shape={circle(12)} color="#211b20" flat outline={0} y={-40} z={0.004} />
    </X>
  );
};

// 149.55 "Scientists have tested the soil on the hill."
export const SoilTestShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const arm: [number, number] = [1.5, 0.4];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -20 }} light={{ dir: [0.6, 0.5] }}>
        <Plains mood="day" horizon={-60} mound="done" moundX={300} moundS={0.9}>
          <Character {...SCIENTIST(0)} x={-480} y={-580} s={1.2} z={2} look={0.5} expression={{ eyes: "open", mouth: "flat", brows: 0.2, gaze: [0.4, -0.8] }} pose={{ ...poses.sit(frame), armF: [1.4, 0.8] }} />
          <Part shape={roundRect(120, 80, 8)} color="#e9e4d8" shade={0.2} x={-260} y={-540} z={2.1} />
          <Character {...SCIENTIST(1)} x={60} y={-580} s={1.2} z={2} facing={-1} look={0.5} expression={{ eyes: "open", mouth: "o", brows: 0.4 }} pose={{ armF: arm, armB: [-0.2, -0.1] }} holdF={<X rot={upright(arm)} s={0.35}><Gauge x={0} y={60} k={0.5} /></X>} />
        </Plains>
      </Stage>
    </AbsoluteFill>
  );
};

// 152.15 "The mercury levels are far higher than normal."
export const MercuryHighShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = 0.15 + ramp(t, 152.6, 153.9, Easing.out(Easing.back(2))) * 0.8 + Math.sin(frame * 0.6) * 0.01;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), shake: hitAt(t, 153.9, 0.4) * 4 }} light={{ dir: [-0.6, 0.8] }} vignette={0.5}>
        <Sunburst r={2600} rays={20} color="#5a6a7a" alt="#52626f" speed={0.5} z={-40} />
        <Gauge x={0} y={-40} s={1.8} k={k} z={2} />
      </Stage>
      <Label text="FAR HIGHER THAN NORMAL" x={0.5} y={0.12} size={0.06} kind="box" at={sec(start)(153.7)} />
    </AbsoluteFill>
  );
};

/** Mercury vapour wisps rising. */
export const Vapor: React.FC<{ x: number; y: number; h?: number; z?: number; seed?: number }> = ({ x, y, h = 600, z = 0, seed = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <X x={x} y={y} z={z}>
      {[0, 1, 2].map((i) => {
        const k = ((frame * 0.012 + i / 3 + seed * 0.17) % 1);
        return <Line key={i} pts={Array.from({ length: 10 }, (_, j) => [Math.sin(j * 0.9 + frame * 0.08 + i) * 24, k * h * 0.5 + j * (h / 18)] as [number, number])} smooth width={10} color="#dfe8f2" opacity={0.7 * (1 - k)} />;
      })}
    </X>
  );
};

// 154.8 "In 2020, a study found mercury vapor still leaking out through cracks."
export const VaporShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.05), y: -60 }} light={{ dir: [0.6, 0.5] }}>
        <Plains mood="day" horizon={200}>
          <MoundSection y={200} w={1900} depth={820} stage="done" z={-20} />
          {[[-420, -80], [-60, 0], [300, -60]].map(([x, y], i) => (
            <X key={i} z={5}>
              <Line pts={[[x, y - 120], [x + 30, y], [x - 20, y + 120], [x + 10, y + 260]]} width={6} color="#3a2a22" />
              {t > 156.4 ? <Vapor x={x} y={y} h={520} seed={i} /> : null}
            </X>
          ))}
        </Plains>
      </Stage>
      <Label text="2020" x={0.16} y={0.13} size={0.08} kind="box" at={sec(start)(155.1)} />
      <Label text="MERCURY VAPOR" x={0.62} y={0.13} size={0.06} kind="box" at={sec(start)(157.3)} />
    </AbsoluteFill>
  );
};

// 159.95 "So those rivers of mercury might be real."
export const MightBeRealShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.1), y: -60 }} light={{ pos: [0, 200] }} vignette={0.7} vignetteColor="#04060c">
        <PalaceVault floorY={-380}>
          <MercuryRiver y={-560} w={3200} h={110} speed={1.2} z={8} />
          <MercuryRiver y={-300} w={2600} h={50} speed={0.8} z={-5} />
        </PalaceVault>
      </Stage>
    </AbsoluteFill>
  );
};

// ───────────────────────── truth and waiting ─────────────────────────

// 162.75 "How much of Sima Qian's story is true?"
export const HowTrueShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -20 }} light={{ pos: [300, 100] }} vignette={0.6}>
        <ThroneHall floorY={-460} throne={false} dim={0.35}>
          <Character {...SIMA_QIAN} x={-300} y={-560} s={1.3} z={2} look={0.5} expression={{ eyes: "half", mouth: "smirk", brows: -0.2 }} pose={{ ...poses.sit(frame), armF: [1.4, 0.8] }} />
          <BambooSlips x={200} y={-280} n={12} s={0.85} z={3} />
          <QuestionMark x={560} y={220} s={0.9 * pop(t, 164.4)} rot={0.12} z={6} />
        </ThroneHall>
      </Stage>
    </AbsoluteFill>
  );
};

// 165.25 "Some archaeologists think he made parts of it up."
export const MadeUpShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -20 }} light={{ dir: [-0.6, 0.8] }}>
        <Plains mood="day" horizon={-60} mound="done" moundX={400} moundS={0.8}>
          <Character {...ARCHAEOLOGIST(0)} x={-320} y={-580} s={1.25} z={2} look={0.5} expression={{ eyes: "half", mouth: "smirk", brows: -0.6 }} pose={poses.think} />
          <Character {...ARCHAEOLOGIST(1)} x={160} y={-580} s={1.2} z={2} facing={-1} look={0.5} expression={{ eyes: "half", mouth: "flat", brows: 0.3 }} pose={poses.handsOnHips} />
        </Plains>
      </Stage>
      <Label text="MADE UP?" x={0.5} y={0.14} size={0.08} kind="stamp" rotate={-6} at={sec(start)(167.2)} />
    </AbsoluteFill>
  );
};

// 167.8 "But the mercury is hard to argue with."
export const HardToArgueShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -20 }} light={{ dir: [-0.6, 0.8] }}>
        <Plains mood="day" horizon={-60} mound="done" moundX={400} moundS={0.8}>
          <Character {...ARCHAEOLOGIST(0)} x={-420} y={-580} s={1.25} z={2} look={0.5} expression={{ eyes: "open", mouth: "wavy", brows: 0.5 }} pose={poses.shrug(ramp(t, 168.6, 169.0))} />
          <Gauge x={200} y={-120} s={1.1} k={0.92 + Math.sin(frame * 0.6) * 0.01} z={3} />
        </Plains>
      </Stage>
    </AbsoluteFill>
  );
};

// 170.05 "And there's another reason."
export const AnotherReasonShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const s = 2.2;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.0 }} light={{ dir: [-0.6, 0.8] }} vignette={0.5}>
        <Sunburst r={2600} rays={20} color="#c9a274" alt="#c09868" speed={0.4} z={-40} />
        <Character {...ARCHAEOLOGIST(1)} x={-160} y={-40 - 308 * s} s={s} z={2} look={0.3} talking expression={{ eyes: "open", mouth: "smile", brows: -0.2 }} pose={{ armF: [2.7, 0.4], armB: [-0.2, -0.1], armsOverHead: true }} />
      </Stage>
      <Label text="REASON #2" x={0.72} y={0.24} size={0.07} kind="box" at={sec(start)(170.8)} />
    </AbsoluteFill>
  );
};

// 171.35 "Remember the paint that disappeared in four minutes?"
export const PaintCallbackShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const fall = ramp(t, 172.0, 173.8);
  const s = 1.8;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.05 }} light={{ dir: [-0.6, 0.8] }} vignette={0.5}>
        <PitFloor>
          <Character {...terra(2, 1 - fall * 0.85)} x={-160} y={-40 - 308 * s} s={s} z={2} look={0.3} expression={{ eyes: "half", mouth: "frown" }} pose={poses.idle(frame)} />
          <Flakes x={-160} y={-480} w={260} h={720} k={1} fall={fall} seed={7} z={3} />
        </PitFloor>
      </Stage>
      <Label text="4 MIN" x={0.72} y={0.24} size={0.08} kind="title" at={sec(start)(173.0)} />
    </AbsoluteFill>
  );
};

// 173.95 "Now imagine opening a whole palace."
export const WholePalaceShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const crumble = ramp(t, 175.0, 176.4);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -20, shake: crumble > 0 && crumble < 1 ? 2 : 0 }} light={{ pos: [0, 200] }} vignette={0.7} vignetteColor="#04060c">
        <PalaceVault floorY={-380}>
          <MercuryRiver y={-560} w={3200} h={90} z={8} />
          <Flakes x={0} y={-400} w={1800} h={700} k={1} fall={crumble} seed={11} z={9} />
          <Wash width={4000} height={3000} color="#6a6a72" alpha={crumble * 0.45} z={10} />
        </PalaceVault>
      </Stage>
    </AbsoluteFill>
  );
};

// 176.45 "So China is waiting for better technology."
export const BetterTechShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -20 }} light={{ dir: [0.6, 0.5] }}>
        <Plains mood="day" horizon={-60} mound="done" moundX={380} moundS={0.85}>
          <Character {...SCIENTIST(0)} x={-500} y={-580} s={1.15} z={2} look={0.5} expression={{ eyes: "half", mouth: "flat", brows: 0.3 }} pose={{ ...poses.sit(frame), armF: [1.0, 1.4] }} />
          <Character {...SCIENTIST(1)} x={-180} y={-580} s={1.15} z={2} facing={-1} look={0.5} expression={{ eyes: "closed", mouth: "o" }} pose={{ ...poses.sit(frame + 9), headTilt: -0.2 }} />
          <X x={120} y={-420} z={3}>
            <Part shape={roundRect(200, 140, 14)} color="#5a5a64" shade={0.2} />
            <Part shape={roundRect(160, 100, 8)} color="#2a3a4a" flat outline={4} z={0.001} />
            <Line pts={[[-60, 0], [-20, 30], [20, -20], [60, 10]]} width={5} color="#5aff9a" z={0.002} />
          </X>
        </Plains>
      </Stage>
      <Label text="WAITING FOR BETTER TECH" x={0.5} y={0.12} size={0.06} kind="box" at={sec(start)(177.7)} />
    </AbsoluteFill>
  );
};

// 178.85 "Scientists think the main chamber has never been broken into."
export const UntouchedShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.15), y: interpolate(frame, [0, dur], [0, -260]) }} light={{ dir: [0.6, 0.5] }}>
        <Plains mood="day" horizon={200}>
          <MoundSection y={200} w={1900} depth={820} stage="done" z={-20} />
          <Glow x={0} y={200 - 820 * 0.55} rx={720} ry={300} color="#ffe9a8" alpha={0.25 * ramp(t, 180.0, 180.8)} additive z={5} />
        </Plains>
      </Stage>
      <Label text="UNTOUCHED" x={0.5} y={0.14} size={0.08} kind="stamp" rotate={-6} at={sec(start)(181.3)} />
    </AbsoluteFill>
  );
};

/** The emperor's sarcophagus. Origin = floor centre. */
const Coffin: React.FC<{ x?: number; y?: number; s?: number; z?: number }> = ({ x = 0, y = 0, s = 1, z = 0 }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={roundRect(620, 60, 8)} color="#3a2a26" shade={0.2} y={30} />
    <Part shape={roundRect(560, 200, 24)} color="#1e1a20" shade={0.22} y={160} z={0.01}>
      <Line pts={[[-250, 40], [250, 40]]} width={6} color="#b8322a" z={0.001} />
      <Line pts={Array.from({ length: 15 }, (_, i) => [-240 + i * 34, -40 + (i % 2 ? 12 : 0)] as [number, number])} width={5} color="#c9963f" z={0.001} />
    </Part>
  </X>
);

// 182.25 "Whatever is down there is still waiting."
export const StillWaitingShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.12), y: -60 }} light={{ pos: [0, 200] }} vignette={0.9} vignetteColor="#010203">
        <PalaceVault floorY={-380}>
          <Coffin y={-460} s={1.1} z={3} />
          <MercuryRiver y={-600} w={3200} h={80} z={8} />
          <Wash width={4000} height={3000} color="#04060c" alpha={0.45} z={9} />
          <Glow y={-200} rx={500} ry={300} color="#ffcf7a" alpha={0.25 + Math.sin(frame * 0.15) * 0.05} additive z={10} />
        </PalaceVault>
      </Stage>
    </AbsoluteFill>
  );
};

// ───────────────────────── ending ─────────────────────────

// 184.85 "The First Emperor wanted to live forever."
export const WantedForeverShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const s = 2.0;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ pos: [300, 200] }} vignette={0.6}>
        <ThroneHall floorY={-760} throne={false} dim={0.25} />
        <Character {...EMPEROR} x={-160} y={-20 - 308 * s} s={s} z={2} look={0.4} expression={{ eyes: "happy", mouth: "grin", brows: -0.2 }} pose={{ armF: [2.4, 1.4], armB: [-0.2, -0.1] }} />
      </Stage>
      <Label text="FOREVER" x={0.72} y={0.24} size={0.08} kind="title" at={sec(start)(186.0)} />
    </AbsoluteFill>
  );
};

// 187.15 "He died at 49."
export const DiedAt49Shot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ pos: [300, 100] }} vignette={0.7} vignetteColor="#04060c">
        <Part shape={roundRect(4000, 3000, 0)} color="#2a1a18" flat outline={0} z={-40} />
        <X s={1.1}>
          <Part shape={roundRect(420, 520, 10)} color="#3a2420" shade={0.2} />
          <Part shape={roundRect(360, 460, 4)} color="#e9dcc0" flat outline={4} z={0.001} />
          <Character {...EMPEROR} y={-380} s={0.82} z={0.01} look={0.2} expression={{ eyes: "half", mouth: "flat" }} pose={poses.idle(frame)} />
          <Part shape={roundRect(370, 150, 0)} color="#3a2420" flat outline={0} y={-310} z={0.05} />
        </X>
      </Stage>
      <Label text="49" x={0.78} y={0.4} size={0.16} kind="title" at={sec(start)(187.7)} />
    </AbsoluteFill>
  );
};

// 188.7 "He wanted his family to rule for ten thousand generations."
export const TenThousandShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const n = Math.min(9, 1 + Math.floor(Math.max(0, t - 189.0) / 0.3));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 0.94) }} light={{ pos: [0, 300] }}>
        <ThroneHall floorY={-460} throne={false}>
          {Array.from({ length: n }, (_, i) => {
            const k = Math.pow(0.78, i);
            return <Character key={i} {...(i === 0 ? EMPEROR : HUHAI)} x={-620 + (1 - k) * 1500} y={-560 + (1 - k) * 400} s={1.2 * k} z={10 - i} look={0.2} expression={{ eyes: "half", mouth: "smirk" }} pose={poses.handsOnHips} />;
          })}
        </ThroneHall>
      </Stage>
      <Label text="× 10,000" x={0.8} y={0.16} size={0.08} kind="title" at={sec(start)(190.5)} />
    </AbsoluteFill>
  );
};

// 192.0 "His empire lasted 15 years."
export const FifteenYearsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 0.95), shake: hitAt(t, 193.4, 0.4) * 6 }} light={{ pos: [0, 300] }}>
        <ThroneHall floorY={-460} throne={false} dim={0.3}>
          {Array.from({ length: 9 }, (_, i) => {
            const k = Math.pow(0.78, i);
            const fall = ramp(t, 193.0 + i * 0.07, 193.4 + i * 0.07, Easing.in(Easing.quad));
            return (
              <X key={i} x={-620 + (1 - k) * 1500} y={-560 + (1 - k) * 400} rot={-fall * 1.5} z={10 - i}>
                <Character {...(i === 0 ? EMPEROR : HUHAI)} s={1.2 * k} look={0.2} expression={fall > 0 ? { eyes: "dead", mouth: "o" } : { eyes: "half", mouth: "smirk" }} pose={poses.handsOnHips} />
              </X>
            );
          })}
        </ThroneHall>
      </Stage>
      <Label text="15 YEARS" x={0.5} y={0.16} size={0.1} kind="title" at={sec(start)(193.2)} />
    </AbsoluteFill>
  );
};

// 194.3 "Almost everything he planned fell apart."
export const FellApartShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = ramp(t, 195.4, 196.5);
  const fy = -460;
  // zigzag crack growing from (x, y) in direction d (-1 down, +1 up)
  const crack = (x: number, y: number, len: number, d: number, seed: number) => {
    const r = rng(seed);
    const n = 6;
    const pts = Array.from({ length: n + 1 }, (_, i) => [x + (i ? (r() - 0.5) * 70 : 0), y + d * (i / n) * len * k] as [number, number]);
    return <Line pts={pts} width={10} color="#140a0a" />;
  };
  const r = rng(21);
  const rocks = Array.from({ length: 14 }, (_, i) => ({ x: (r() - 0.5) * 1700, t0: 195.3 + r() * 1.1, sz: 28 + r() * 34, spin: (r() - 0.5) * 8, c: r() > 0.5 ? "#9a8478" : "#7a6a62", i }));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: 40, shake: k > 0 && k < 1 ? 6 : 0, rot: k * 0.01 }} light={{ pos: [0, 300] }}>
        <ThroneHall floorY={fy} dim={k * 0.2} throne={false}>
          {/* cracks run down the walls from the ceiling and up the throne */}
          <X z={-39.5}>
            {crack(-300, 380, 520, -1, 1)}
            {crack(300, 380, 420, -1, 2)}
            {crack(-900, 380, 380, -1, 3)}
            {crack(900, 380, 460, -1, 4)}
          </X>
          <X x={k * 20} y={-k * 50} rot={-k * 0.09} z={-15}>
            <QinThrone y={fy} s={0.9} />
            <X z={0.5}>{crack(10, fy + 150, 330, 1, 5)}</X>
          </X>
          {/* a lantern drops */}
          <X x={160} y={540 - Math.pow(ramp(t, 195.7, 196.3, Easing.in(Easing.quad)), 1) * 900} rot={ramp(t, 195.7, 196.3) * 0.8} z={-18}>
            <Part shape={roundRect(70, 90, 30)} color="#c8322a" shade={0.2} />
            <Part shape={roundRect(30, 12, 3)} color="#c9963f" flat outline={3} y={52} z={0.001} />
          </X>
          {/* falling chunks of ceiling */}
          {rocks.map((q) => {
            const u = Math.max(0, t - q.t0);
            const y = 620 - 900 * u * u;
            const land = y < fy + q.sz;
            return u > 0 ? (
              <X key={q.i} x={q.x} y={land ? fy + q.sz * 0.6 : y} rot={land ? q.spin * 0.2 : q.spin * u} z={20 + q.i * 0.01}>
                <Part shape={roundPoly([[-q.sz, -q.sz * 0.6], [q.sz * 0.8, -q.sz * 0.8], [q.sz, q.sz * 0.5], [-q.sz * 0.4, q.sz * 0.8]], 4)} color={q.c} shade={0.2} />
              </X>
            ) : null;
          })}
          <Smoke x={0} y={fy} w={1900} h={260} color="#8a7a72" alpha={0.22 * k} puffs={12} seed={4} z={25} />
        </ThroneHall>
      </Stage>
    </AbsoluteFill>
  );
};

// 196.75 "Except one thing."
export const ExceptOneShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.1), y: 60 }} light={{ dir: [0.6, 0.4] }} vignette={0.6}>
        <Plains mood="dusk" horizon={-160} mound="done" moundS={1.25} />
      </Stage>
    </AbsoluteFill>
  );
};

// 198.6 "So today, his secret is still safe …"
export const SecretSafeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.04), y: -30 }} light={{ dir: [0.6, 0.5] }}>
        <Plains mood="day" horizon={-60} mound="done" moundX={200} moundS={1.0}>
          {Array.from({ length: 18 }, (_, i) => (
            <Line key={i} pts={[[-900 + i * 106, -260], [-900 + i * 106, -170]]} width={8} color="#5a5a64" z={2} />
          ))}
          <Line pts={[[-900, -190], [900, -190]]} width={6} color="#5a5a64" z={2.1} />
          {[0, 1, 2, 3].map((i) => (
            <Character key={i} {...TOURIST(i)} x={-640 + i * 400} y={-470} s={0.95} z={3 + i * 0.01} facing={i % 2 ? -1 : 1} look={0.4} expression={{ eyes: "open", mouth: i % 2 ? "o" : "smile" }} pose={i === 1 ? poses.point(frame) : poses.idle(frame, i)} />
          ))}
        </Plains>
      </Stage>
      <Label text="SAFE" x={0.5} y={0.14} size={0.08} kind="stamp" rotate={-6} at={sec(start)(200.5)} />
    </AbsoluteFill>
  );
};

// 201.25 "… because the only people who knew it never got out."
export const NeverGotOutShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -60 }} light={{ pos: [0, 200] }} vignette={0.9} vignetteColor="#010203">
        <TombCorridor floorY={-460} torches={false} dark={0.55}>
          <TreasureChest x={-120} y={-480} w={240} z={2} />
          <You x={-560} y={-580} s={1.15} z={3} expression={{ eyes: "half", mouth: "smirk", brows: 0.4 }} />
          <Character {...WORKER(1)} x={400} y={-580} s={1.15} z={3} facing={-1} look={0.4} expression={{ eyes: "half", mouth: "flat", brows: 0.6 }} pose={{ ...poses.sit(frame), headTilt: -0.1 }} />
        </TombCorridor>
        <Wash width={4000} height={3000} color="#000000" alpha={ramp(t, 203.0, 203.9) * 0.7} z={60} />
      </Stage>
    </AbsoluteFill>
  );
};

// 203.95 "If you were in charge, would you open the tomb?"
export const WouldYouOpenShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -20 }} light={{ pos: [-300, 300] }} vignette={0.6}>
        <TombCorridor floorY={-460}>
          <StoneGate x={300} y={-460} w={520} h={640} drop={1 - ramp(t, 205.4, 206.4) * 0.08} z={1} />
          <Character {...ARCHAEOLOGIST(0)} x={-420} y={-580} s={1.2} z={3} look={0.5} expression={{ eyes: "open", mouth: "wavy", brows: 0.5, sweat: true }} pose={{ armF: [1.5, 0.2], armB: [1.3, 0.3], lean: -0.1 }} />
        </TombCorridor>
      </Stage>
      <Label text="OPEN IT?" x={0.5} y={0.14} size={0.08} kind="box" at={sec(start)(205.5)} />
    </AbsoluteFill>
  );
};

// 206.55 "Or leave the First Emperor in the dark?"
export const LeaveDarkShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const out = ramp(t, 207.8, 208.4);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -60 }} light={{ pos: [0, 200] }} vignette={0.9} vignetteColor="#010203">
        <PalaceVault floorY={-380}>
          <Coffin y={-460} s={1.1} z={3} />
          <X x={420} y={-460} z={4}>
            <OilLamp lit={out < 0.95} s={1.3} />
          </X>
        </PalaceVault>
        <Wash width={4000} height={3000} color="#000000" alpha={0.35 + out * 0.5} z={60} />
      </Stage>
    </AbsoluteFill>
  );
};

// 208.55 "Tell me in the comments."
export const CommentsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ dir: [-0.6, 0.8] }} vignette={0.5}>
        <Sunburst r={2600} rays={22} color="#e9c98a" alt="#e1bd7a" speed={0.6} z={-40} />
        {[[-560, 160, -0.1], [0, 260, 0.05], [560, 140, 0.12]].map(([x, y, r], i) => (
          <CommentBubble key={i} x={x} y={y + Math.sin(frame * 0.1 + i) * 10} rot={r} s={0.9 * pop(t, 208.8 + i * 0.2)} z={2 + i * 0.01} />
        ))}
        <Character {...EMPEROR} x={-320} y={-600} s={1.1} z={3} look={0.1} expression={{ eyes: "happy", mouth: "smile" }} pose={poses.idle(frame)} />
        <Character {...WORKER(0)} x={320} y={-600} s={1.1} z={3} facing={-1} look={0.1} expression={{ eyes: "happy", mouth: "grin" }} pose={poses.idle(frame, 3)} />
      </Stage>
      <Label text="TELL ME IN THE COMMENTS" x={0.5} y={0.12} size={0.07} kind="box" at={sec(start)(208.8)} />
    </AbsoluteFill>
  );
};

