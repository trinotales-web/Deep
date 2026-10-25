import React from "react";
import { C, FONT_HAND, FONT_TITLE, INK, ip, rand } from "../theme";
import {
  Bang,
  Camera,
  camAt,
  Cam,
  DrawOn,
  ellipseD,
  Heart,
  Ink,
  Label,
  Pencil,
  pop,
  Pop,
  Pt,
  Puff,
  Question,
  Shade,
  shakeAt,
  Sparkle,
  Bubble,
  smooth,
} from "../draw";
import { SceneSvg } from "../Stage";
import { HONSHU, MapArt, proj } from "../MapArt";
import { Person } from "../Person";
import { Banner, Lanterns, PowerMeter, Scroll } from "../Props2";
import { Frame, Moon, Rain, Stamp } from "../Props3";
import { Bulb, Flames, SmokeColumn, Townhouse } from "../Props4";
import { FoodStall, Footprints, Maku, OdaCrest, SearchBox, Shoji, TempleHall, Troop, Warning } from "../Props6";
import { TitleScene } from "../scenes/Opening";
import { JapanChar } from "../scenes/Together";
import { FLAG_COLORS, FLAGS } from "../scenes4/Sengoku";
import { w6 } from "../part6cues";

type SceneProps = { f: number; from: number; to: number };

const ODA = C.yellow;
const IMAGAWA = C.indigo;
const AKECHI = "#3f7f86";
const NIGHT = "#2b3360";

const OWARI = proj(136.9, 35.15);
const KYOTO = proj(135.76, 35.01);
const SURUGA = proj(138.5, 35.05);

/** World point -> screen point for a camera. */
const scr = (cam: Cam, [x, y]: Pt): Pt => [960 + (x - cam.x) * cam.z, 540 + (y - cam.y) * cam.z];

/** A small pennant planted on the map. */
const Pennant: React.FC<{ x: number; y: number; s: number; color: string; h?: number }> = ({ x, y, s, color, h = 60 }) =>
  s <= 0.01 ? null : (
    <Pop s={s} x={x} y={y}>
      <Ink d={`M${x},${y} l0,${-h}`} sw={3.5} />
      <Pencil d={`M${x},${y - h} l40,9 l-40,11 Z`} fill={color} sw={3} />
    </Pop>
  );

export const Title6: React.FC<{ f: number }> = ({ f }) => {
  const pts: [number, number][] = new Array(14).fill(0).map((_, i) => [460 + i * 76, 800 - Math.sin(i * 0.7) * 16]);
  return (
    <TitleScene
      f={f}
      subtitle="part 6 · the fool of Owari"
      doodles={
        <g>
          <Footprints pts={pts} p={ip(f, [16, 60], [0, 1], (x) => x)} s={0.9} />
          <Pop s={pop(f, 50)} x={1500} y={760}>
            <OdaCrest x={1500} y={760} r={46} />
          </Pop>
        </g>
      }
    />
  );
};

/** "The first man to try it was Oda Nobunaga." */
export const FirstMan: React.FC<SceneProps> = ({ f, from, to }) => {
  const first = w6(1, "first");
  const oda = w6(7, "oda");
  const nob = w6(8, "nobunaga");
  const slide = ip(f, [oda - 8, oda + 8], [0, 1]);
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 1060, y: 700, z: 1.0 }], [to, { x: 1040, y: 710, z: 1.05 }]])}>
        <MapArt f={f} />
        {FLAGS.map(([x, y], i) => (
          <g key={i}>
            <Ink d={`M${x},${y} l0,-80`} sw={5} />
            <Pencil d={`M${x},${y - 80} l52,12 l-52,14 Z`} fill={FLAG_COLORS[i % FLAG_COLORS.length]} sw={3.5} />
          </g>
        ))}
      </Camera>
      <Label x={1340} y={140} text="who will unite Japan?" size={72} font={FONT_TITLE} color={C.red} p={ip(f, [from + 2, from + 16], [0, 1], (x) => x)} rot={-3} />
      <g opacity={slide}>
        <Pencil d={ellipseD(420 - (1 - slide) * 300, 590, 300, 350)} fill={C.white} sw={5} fillOpacity={0.92} />
      </g>
      <Person x={420 - (1 - slide) * 600} y={880} s={1.6} tribe="nobunaga" f={f} expr="grin" aR={f > nob ? 150 : 20} seed={1} />
      <Pop s={pop(f, first)} x={420} y={180} rot={-6}>
        <Pencil d="M270,120 h300 v110 h-300 Z" fill={C.white} sw={5} />
        <Label x={420} y={200} text="try #1" size={72} font={FONT_TITLE} color={INK} halo={false} />
      </Pop>
      <Pop s={pop(f, nob)} x={830} y={800} rot={-3}>
        <Pencil d="M570,740 h520 v110 h-520 Z" fill={ODA} sw={5} />
        <Label x={830} y={818} text="ODA NOBUNAGA" size={70} font={FONT_TITLE} color={INK} halo={false} />
      </Pop>
    </SceneSvg>
  );
};

/** "As a young man, he walked around barefoot and ate wherever he liked.
 *  People called him the Fool of Owari," */
export const Fool: React.FC<SceneProps> = ({ f, from, to }) => {
  const young = w6(11, "young");
  const barefoot = w6(16, "barefoot");
  const ate = w6(18, "ate");
  const liked = w6(21, "liked");
  const people = w6(22, "people");
  const fool = w6(26, "fool");
  const walkTo = ip(f, [from, ate - 4], [0, 1], (x) => x);
  const x = 260 + walkTo * 1090;
  const moving = walkTo > 0 && walkTo < 1;
  const steps: [number, number][] = new Array(26).fill(0).map((_, i) => [200 + i * 44, 910]);
  const cam = camAt(f, [
    [from, { x: 760, y: 640, z: 1.3 }],
    [ate, { x: 1300, y: 640, z: 1.3 }],
    [people + 6, { x: 1640, y: 630, z: 1.22 }],
    [to, { x: 1660, y: 620, z: 1.2 }],
  ]);
  const munch = f > ate + 4 && f < people ? Math.sin(f / 2) : 0;
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <Shade d="M-600,-400 H3200 V1500 H-600 Z" fill={C.sky} opacity={0.25} />
        {[-60, 220, 520, 1060, 1900, 2200, 2500].map((tx, i) => (
          <Townhouse key={tx} x={tx} y={860} s={0.9} seed={i + 1} />
        ))}
        <Pencil d="M-600,860 H3200 V1500 H-600 Z" fill="#cdb98f" />
        <Footprints pts={steps} p={(x - 200) / (26 * 44)} s={0.8} />
        <FoodStall x={1560} y={880} s={0.95} taken={f > ate ? 1 : 0} />
        <Person x={1690} y={900} s={1.0} tribe="yayoi" f={f} flip expr={f > ate + 4 ? "shock" : "smile"} look={[-1, 0]} seed={3} />
        <Person
          x={x}
          y={900}
          s={1.25}
          tribe="fool"
          f={f}
          walk={moving ? f * 0.5 : undefined}
          hold={f > ate ? "onigiri" : "none"}
          aR={f > ate ? 100 + munch * 12 : 10}
          expr={f > ate ? "happy" : "grin"}
          seed={1}
        />
        <Label x={x + 150} y={880} text="barefoot!" size={50} font={FONT_HAND} p={ip(f, [barefoot, barefoot + 8], [0, 1], (x2) => x2) * ip(f, [ate, ate + 6], [1, 0])} />
        <Label x={1330} y={540} text="nom nom" size={52} font={FONT_HAND} p={ip(f, [ate + 6, ate + 14], [0, 1], (x2) => x2) * ip(f, [people, people + 6], [1, 0])} rot={-8} />
        <Bang x={1700} y={640} s={pop(f, ate + 6) * ip(f, [liked + 10, liked + 16], [1, 0])} n={2} />
        {/* the townsfolk talk */}
        <Person x={2000} y={900} s={1.05 * pop(f, people - 10)} tribe="noble" f={f} flip expr="worry" look={[-1, 0]} seed={5} />
        <Person x={2140} y={910} s={1.0 * pop(f, people - 6)} tribe="priest" f={f} flip expr="nervous" look={[-1, 0]} seed={6} />
        <Bubble x={2060} y={500} w={330} h={110} text="what a fool..." s={pop(f, people + 4)} tail={[2020, 610]} size={48} />
      </Camera>
      <Pop s={pop(f, fool - 2, 190, 10)} x={960} y={190} rot={-3}>
        <Pencil d="M520,110 h880 v150 h-880 Z" fill={C.white} sw={6} />
        <Label x={960} y={222} text="THE FOOL OF OWARI" size={96} font={FONT_TITLE} color="#8a2a2e" halo={false} />
      </Pop>
    </SceneSvg>
  );
};

/** "...after the province where he lived." */
export const Owari: React.FC<SceneProps> = ({ f, from, to }) => {
  const province = w6(31, "province");
  const lived = w6(34, "lived");
  const cam = camAt(f, [[from, { x: 1320, y: 790, z: 2.1 }], [to, { x: 1325, y: 795, z: 2.35 }]]);
  const [ox, oy] = scr(cam, OWARI);
  const [kx, ky] = scr(cam, KYOTO);
  const pulse = 1 + 0.08 * Math.sin(f / 4);
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <MapArt f={f} />
        <Pop s={pop(f, province - 4) * pulse} x={OWARI[0]} y={OWARI[1]}>
          <Pencil d={ellipseD(OWARI[0], OWARI[1] - 4, 22, 16)} fill={C.orange} sw={2.5} fillOpacity={0.8} />
        </Pop>
        <path d={ellipseD(KYOTO[0], KYOTO[1], 4)} fill={INK} />
      </Camera>
      <Label x={kx - 20} y={ky + 70} text="Kyoto" size={44} font={FONT_HAND} anchor="end" p={ip(f, [from + 6, from + 14], [0, 1], (x) => x)} />
      <DrawOn d={`M${ox + 200},${oy - 230} Q${ox + 120},${oy - 160} ${ox + 30},${oy - 40}`} p={ip(f, [province, province + 10], [0, 1])} sw={6} />
      <Label x={ox + 230} y={oy - 260} text="OWARI" size={92} font={FONT_TITLE} color={C.red} p={ip(f, [province, province + 10], [0, 1], (x) => x)} rot={-4} anchor="start" />
      <Label x={ox + 240} y={oy - 180} text="(his home province)" size={48} font={FONT_HAND} p={ip(f, [lived - 6, lived + 8], [0, 1], (x) => x)} anchor="start" />
      <Person x={ox - 60} y={oy + 220} s={0.9 * pop(f, province + 4)} tribe="fool" f={f} expr="grin" aR={140} seed={2} />
    </SceneSvg>
  );
};

/** "But this fool was smarter than anyone knew." */
export const Smarter: React.FC<SceneProps> = ({ f, from, to }) => {
  const smarter = w6(39, "smarter");
  const anyone = w6(41, "anyone");
  const plan = ip(f, [from + 4, smarter + 10], [0, 1]);
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 540, z: 1.0 }], [to, { x: 940, y: 540, z: 1.06 }]])}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#e9d7b0" opacity={0.45} />
        <Pencil d="M-600,880 H2700 V1500 H-600 Z" fill="#b89f7a" />
        <Scroll x={1180} y={430} w={620} h={400} p={ip(f, [from, from + 14], [0, 1])}>
          <g>
            <Pencil d={ellipseD(1000, 520, 50, 30)} fill={ODA} sw={3} />
            <Pencil d="M1260,330 h170 v90 h-170 Z" fill={IMAGAWA} sw={3} />
            <DrawOn d="M1040,500 C1120,420 1160,330 1250,360" p={plan} sw={6} color={C.red} />
            <DrawOn d="M1040,540 C1180,600 1360,560 1370,430" p={ip(f, [smarter - 6, smarter + 14], [0, 1])} sw={6} color={C.red} dotted />
            <Label x={1330} y={530} text="sneak!" size={40} font={FONT_HAND} color={C.red} halo={false} p={ip(f, [smarter + 6, smarter + 14], [0, 1], (x) => x)} />
          </g>
        </Scroll>
        <Person x={540} y={930} s={1.5} tribe="fool" f={f} expr="grin" aR={f > smarter ? 160 : 60} look={[1, -0.4]} seed={1} />
        <Bulb x={540} y={360} s={pop(f, smarter)} glow={ip(f, [smarter + 4, smarter + 10], [0, 1])} />
        <Person x={1640} y={940} s={1.0} tribe="noble" f={f} flip expr={f > anyone ? "shock" : "nervous"} look={[-1, 0]} seed={5} />
        <Person x={1790} y={950} s={0.95} tribe="priest" f={f} flip expr={f > anyone ? "shock" : "worry"} look={[-1, 0]} seed={6} />
        <Bang x={1720} y={600} s={pop(f, anyone + 4)} n={2} />
        <Question x={1840} y={610} s={pop(f, anyone + 8)} size={90} rot={12} />
        <Label x={960} y={150} text="smarter than anyone knew!" size={76} font={FONT_TITLE} color={C.indigo} p={ip(f, [smarter, smarter + 16], [0, 1], (x) => x)} rot={-3} />
      </Camera>
    </SceneSvg>
  );
};

/** "One day, a powerful warlord marched into Owari with 25,000 soldiers." */
export const March: React.FC<SceneProps> = ({ f, from, to }) => {
  const day = w6(44, "day");
  const warlord = w6(47, "warlord");
  const marched = w6(48, "marched");
  const twenty = w6(52, "twenty");
  const soldiers = w6(55, "soldiers");
  const cam = camAt(f, [[from, { x: 1370, y: 795, z: 2.1 }], [to, { x: 1355, y: 800, z: 2.25 }]]);
  const go = ip(f, [marched, soldiers + 10], [0, 1]);
  const ax = SURUGA[0] + (OWARI[0] + 22 - SURUGA[0]) * go;
  const ay = SURUGA[1] + (OWARI[1] + 6 - SURUGA[1]) * go;
  const count = Math.round(ip(f, [twenty, twenty + 18], [0, 25000], (x) => x) / 100) * 100;
  const [sx, sy] = scr(cam, [ax, ay]);
  const [ox, oy] = scr(cam, OWARI);
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <MapArt f={f} />
        <Pencil d={ellipseD(OWARI[0], OWARI[1] - 4, 22, 16)} fill={C.orange} sw={2.5} fillOpacity={0.6} />
        <Pennant x={OWARI[0] - 6} y={OWARI[1] - 2} s={pop(f, from + 2) * 0.55} color={ODA} />
        <DrawOn d={`M${SURUGA[0] + 10},${SURUGA[1] - 22} Q${(SURUGA[0] + OWARI[0]) / 2},${SURUGA[1] - 60} ${OWARI[0] + 30},${OWARI[1] - 18}`} p={ip(f, [marched, marched + 20], [0, 1])} sw={3.5} color={C.red} />
        {pop(f, warlord - 6) > 0.01
          ? new Array(36).fill(0).map((_, i) => {
              const r = Math.floor(i / 9);
              const c = i % 9;
              const bob = go > 0 && go < 1 ? Math.abs(Math.sin(f / 3 + i)) * 2 : 0;
              return <Troop key={i} x={ax - 50 + c * 12 + (r % 2) * 6} y={ay - 8 + r * 10 - bob} s={0.28 * pop(f, warlord - 6 + (i % 9))} color={IMAGAWA} flip />;
            })
          : null}
        <Pennant x={ax + 62} y={ay - 6} s={pop(f, warlord) * 0.6} color={IMAGAWA} h={70} />
      </Camera>
      <Label x={sx + 40} y={sy - 130} text="a powerful warlord" size={56} font={FONT_HAND} p={ip(f, [warlord - 4, warlord + 10], [0, 1], (x) => x)} rot={-3} />
      <Label x={ox - 120} y={oy + 190} text="Owari" size={60} font={FONT_TITLE} color={C.red} p={ip(f, [from + 4, from + 12], [0, 1], (x) => x)} anchor="end" />
      <Pop s={pop(f, twenty - 2, 190, 10)} x={1560} y={160} rot={-3}>
        <Pencil d="M1270,70 h580 v170 h-580 Z" fill={C.white} sw={6} />
        <Label x={1560} y={170} text={count.toLocaleString("en-US")} size={104} font={FONT_TITLE} color={IMAGAWA} halo={false} />
        <Label x={1560} y={222} text="soldiers" size={40} font={FONT_HAND} halo={false} p={ip(f, [soldiers - 4, soldiers + 4], [0, 1], (x) => x)} />
      </Pop>
      <Label x={420} y={170} text="one day..." size={64} font={FONT_HAND} p={ip(f, [day - 6, day + 6], [0, 1], (x) => x)} rot={-4} />
    </SceneSvg>
  );
};

/** "Nobunaga's army was much smaller, and everyone thought he would be crushed." */
export const Odds: React.FC<SceneProps> = ({ f, from, to }) => {
  const army = w6(57, "army");
  const smaller = w6(60, "smaller");
  const thought = w6(63, "thought");
  const crushed = w6(67, "crushed");
  const cam = camAt(f, [
    [from, { x: 1100, y: 560, z: 0.9 }],
    [smaller, { x: 1100, y: 560, z: 0.9 }],
    [crushed - 4, { x: 1040, y: 560, z: 0.96 }],
    [to, { x: 1040, y: 560, z: 1.0 }],
  ]);
  const shake = shakeAt(f, ip(f, [crushed, crushed + 4], [0, 1]) * ip(f, [crushed + 4, crushed + 20], [1, 0]) * 0.6);
  const loom = ip(f, [crushed - 6, crushed + 6], [0, 1]);
  return (
    <SceneSvg f={f}>
      <Camera cam={cam} shake={shake}>
        <Shade d="M-800,-400 H3000 V1500 H-800 Z" fill={C.sky} opacity={0.25} />
        <Pencil d="M-800,880 H3000 V1500 H-800 Z" fill={C.moss} />
        {/* the huge army */}
        {[0, 1, 2].map((b) => (
          <Banner key={b} x={1300 + b * 380} y={760 - (b % 2) * 20} color={IMAGAWA} s={0.8} />
        ))}
        {new Array(70).fill(0).map((_, i) => {
          const r = Math.floor(i / 14);
          const c = i % 14;
          return <Troop key={i} x={1120 + c * 90 + (r % 2) * 45} y={760 + r * 40} s={1.1 + r * 0.08} color={IMAGAWA} flip />;
        })}
        {/* Nobunaga's few */}
        <Banner x={150} y={900} color={ODA} s={0.75} crest={false} />
        <OdaCrest x={185} y={680} r={22} color={C.white} />
        {[0, 1, 2, 3].map((i) => (
          <Troop key={i} x={230 + i * 70} y={900 + (i % 2) * 14} s={1.3} color={ODA} hat={C.darkBrown} />
        ))}
        <Person x={560} y={940} s={1.3} tribe="fool" f={f} hold="katana" aR={120} expr={f > crushed ? "nervous" : "grin"} seed={1} />
        {[0, 1].map((i) => (
          <Person key={i} x={790 + i * 120} y={930 + i * 10} s={0.95 * pop(f, thought - 8 + i * 3)} tribe={i ? "priest" : "noble"} f={f} expr={f > crushed ? "shock" : "worry"} look={[1, 0]} seed={i + 5} />
        ))}
        <Label x={400} y={470} text="Nobunaga's army" size={58} font={FONT_HAND} p={ip(f, [army - 6, army + 8], [0, 1], (x) => x)} rot={-3} />
        <Label x={400} y={550} text="(much smaller)" size={52} font={FONT_HAND} color={C.red} p={ip(f, [smaller - 4, smaller + 10], [0, 1], (x) => x)} rot={-3} />
        {/* a looming shadow */}
        <Shade d={ellipseD(420, 960, 360 * loom, 60 * loom)} fill="#2b2b35" opacity={0.35 * loom} />
      </Camera>
      <Bubble x={830} y={250} w={420} h={130} text="he's doomed!" s={pop(f, thought)} tail={[790, 480]} size={56} thought fill={C.white} />
      <Label x={1380} y={220} text="CRUSHED?" size={120} font={FONT_TITLE} color={C.red} p={ip(f, [crushed, crushed + 6], [0, 1], (x) => x)} rot={-6} />
    </SceneSvg>
  );
};

/** "But he made a surprise attack, and he won." */
export const Surprise: React.FC<SceneProps> = ({ f, from, to }) => {
  const surprise = w6(72, "surprise");
  const attack = w6(73, "attack");
  const won = w6(76, "won");
  const charge = ip(f, [surprise - 6, attack + 6], [0, 1]);
  const cam = camAt(f, [
    [from, { x: 1100, y: 560, z: 1.0 }],
    [attack, { x: 980, y: 560, z: 1.05 }],
    [to, { x: 960, y: 540, z: 1.0 }],
  ]);
  const shake = shakeAt(f, ip(f, [attack, attack + 4], [0, 1]) * ip(f, [attack + 4, attack + 18], [1, 0]) * 0.5);
  const panic = f > surprise + 2;
  return (
    <SceneSvg f={f}>
      <Camera cam={cam} shake={shake}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#7f8a9a" opacity={0.35} />
        <Pencil d="M-600,880 H2700 V1500 H-600 Z" fill={C.darkGreen} />
        <Maku x0={900} x1={2100} y={820} h={200} color={C.white} crest={IMAGAWA} />
        {/* the warlord's camp, relaxing */}
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} transform={panic ? `rotate(${(i % 2 ? 1 : -1) * (12 + 60 * ip(f, [attack, attack + 8], [0, 1]))},${1060 + i * 190},900)` : undefined}>
            <Troop x={1060 + i * 190} y={900 + (i % 2) * 16} s={1.4} color={IMAGAWA} flip />
          </g>
        ))}
        <Person x={1700} y={950} s={1.2} tribe="daimyo" cloth={IMAGAWA} f={f} flip sit hold="fan" aR={f > surprise ? 150 : 60} expr={panic ? "shock" : "happy"} seed={4} />
        {/* Nobunaga's men burst out of the trees */}
        {[0, 1, 2, 3].map((i) => (
          <Troop key={i} x={-260 + charge * (900 + i * 100)} y={910 + (i % 2) * 18} s={1.4} color={ODA} hat={C.darkBrown} />
        ))}
        <Person x={-120 + charge * 1060} y={950} s={1.3} tribe="fool" f={f} hold="katana" aR={charge > 0 && charge < 1 ? 160 : 130} walk={charge > 0 && charge < 1 ? f * 0.8 : undefined} expr="angry" seed={1} />
        {new Array(5).fill(0).map((_, i) => (
          <Pencil key={i} d={ellipseD(-140 + i * 130, 880, 110, 140)} fill={C.darkGreen} sw={4} />
        ))}
        <Rain f={f} n={70} />
        <Bang x={1300} y={640} s={pop(f, surprise + 2)} n={3} />
        <Puff x={1150} y={900} p={ip(f, [attack, attack + 18], [0, 1], (x) => x)} size={120} fill={C.tan} seed={2} />
        <Pop s={pop(f, won)} x={1000} y={880}>
          <Banner x={1000} y={880} color={ODA} s={1.0} crest={false} />
          <OdaCrest x={1046} y={610} r={28} color={C.white} />
        </Pop>
      </Camera>
      <Label x={560} y={200} text="SURPRISE ATTACK!" size={96} font={FONT_TITLE} color={C.red} p={ip(f, [surprise, surprise + 10], [0, 1], (x) => x) * ip(f, [won - 4, won + 2], [1, 0])} rot={-5} />
      <Label x={1300} y={220} text="HE WON!" size={130} font={FONT_TITLE} color="#8a6a10" p={ip(f, [won, won + 6], [0, 1], (x) => x)} rot={-4} />
    </SceneSvg>
  );
};

/** "Suddenly, the Fool of Owari was one of the most powerful men in Japan." */
export const Powerful: React.FC<SceneProps> = ({ f, from, to }) => {
  const suddenly = w6(77, "suddenly");
  const fool = w6(79, "fool");
  const powerful = w6(87, "powerful");
  const japan = w6(90, "japan");
  const changed = f > suddenly + 6;
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 560, z: 1.0 }], [to, { x: 960, y: 540, z: 1.08 }]])}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#f2cf8a" opacity={0.35} />
        <Pencil d="M-600,900 H2700 V1500 H-600 Z" fill={C.straw} />
        {changed
          ? [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
              const a = (i / 8) * Math.PI * 2 + f / 40;
              return <Ink key={i} d={`M${760 + Math.cos(a) * 260},${560 + Math.sin(a) * 260} L${760 + Math.cos(a) * 340},${560 + Math.sin(a) * 340}`} sw={6} color={C.sun} />;
            })
          : null}
        {changed ? (
          <Person x={760} y={950} s={1.7 * pop(f, suddenly + 6, 200, 12)} tribe="nobunaga" f={f} expr="grin" aR={f > powerful ? 150 : 40} seed={1} />
        ) : (
          <Person x={760} y={950} s={1.7} tribe="fool" f={f} expr="grin" seed={1} />
        )}
        <Puff x={760} y={720} p={ip(f, [suddenly, suddenly + 20], [0, 1], (x) => x)} size={160} fill={C.white} seed={4} />
        {[0, 1].map((i) => (
          <Person key={i} x={360 + i * 840} y={960} s={1.0 * pop(f, powerful - 6 + i * 3)} tribe="samurai" f={f} flip={i === 1} lean={24} expr="happy" seed={i + 7} />
        ))}
        <PowerMeter x={1540} y={880} level={ip(f, [fool, powerful + 12], [0.1, 1])} w={90} h={460} />
        <Label x={1540} y={340} text="POWER" size={60} font={FONT_TITLE} p={ip(f, [fool, fool + 8], [0, 1], (x) => x)} />
        <Sparkle x={1600} y={380} s={pop(f, powerful + 12) * (0.8 + 0.2 * Math.sin(f / 4))} />
      </Camera>
      <Label x={760} y={150} text="the Fool of Owari" size={66} font={FONT_HAND} p={ip(f, [fool - 4, fool + 8], [0, 1], (x) => x)} rot={-3} />
      <DrawOn d="M500,140 L1020,120" p={ip(f, [powerful - 10, powerful - 2], [0, 1])} sw={10} color={C.red} />
      <Label x={760} y={250} text="one of the most POWERFUL men in Japan" size={62} font={FONT_TITLE} color={C.red} p={ip(f, [powerful - 4, japan + 6], [0, 1], (x) => x)} rot={-3} />
    </SceneSvg>
  );
};

/** "By 1582, he controlled all of central Japan." */
export const Central: React.FC<SceneProps> = ({ f, from, to }) => {
  const year = w6(92, "fifteen");
  const controlled = w6(96, "controlled");
  const central = w6(99, "central");
  const cam = camAt(f, [[from, { x: 1290, y: 780, z: 1.9 }], [to, { x: 1290, y: 785, z: 2.05 }]]);
  const grow = ip(f, [controlled - 4, central + 16], [0, 1]);
  const c = proj(136.5, 35.4);
  const inRegion = ([x, y]: Pt) => ((x - c[0]) / 120) ** 2 + ((y - c[1]) / 90) ** 2 < 1;
  const [kx, ky] = scr(cam, KYOTO);
  return (
    <SceneSvg f={f}>
      <defs>
        <clipPath id="honshu6">
          <path d={smooth(HONSHU)} />
        </clipPath>
      </defs>
      <Camera cam={cam}>
        <MapArt f={f} />
        <g clipPath="url(#honshu6)">
          <Pencil d={ellipseD(c[0], c[1], 125 * grow, 95 * grow)} fill={ODA} ink={false} fillOpacity={0.85} />
        </g>
        {FLAGS.map((p, i) => {
          const mine = inRegion(p);
          const s = mine ? 1 - ip(f, [controlled + i * 2, controlled + 6 + i * 2], [0, 1]) : 1;
          return (
            <g key={i}>
              {s > 0.02 ? <Pennant x={p[0]} y={p[1]} s={s * 0.8} color={FLAG_COLORS[i % FLAG_COLORS.length]} /> : null}
              {mine ? <Pennant x={p[0]} y={p[1]} s={pop(f, controlled + 6 + i * 2) * 0.8} color={ODA} /> : null}
            </g>
          );
        })}
        <path d={ellipseD(KYOTO[0], KYOTO[1], 4)} fill={INK} />
      </Camera>
      <Label x={kx - 30} y={ky + 60} text="Kyoto" size={44} font={FONT_HAND} anchor="end" />
      <Label x={1260} y={200} text="CENTRAL JAPAN" size={90} font={FONT_TITLE} color="#8a6a10" p={ip(f, [central, central + 12], [0, 1], (x) => x)} rot={-3} />
      <Pop s={pop(f, year, 200, 10)} x={330} y={220} rot={-8}>
        <Pencil d={ellipseD(330, 220, 150, 96)} fill={C.white} sw={5} />
        <Label x={330} y={256} text="1582" size={110} font={FONT_TITLE} color={C.red} halo={false} />
      </Pop>
      <Person x={300} y={900} s={1.25 * pop(f, from + 4)} tribe="nobunaga" f={f} expr="grin" aR={f > controlled ? 150 : 30} seed={1} />
    </SceneSvg>
  );
};

/** Night sky with a few stars. */
const NightSky: React.FC<{ f: number; dark?: number }> = ({ f, dark = 1 }) => (
  <g>
    <Shade d="M-800,-600 H3000 V1500 H-800 Z" fill={NIGHT} opacity={0.55 * dark} />
    {new Array(16).fill(0).map((_, i) => (
      <path key={i} d={ellipseD(rand(i) * 2400 - 200, rand(i + 9) * 380 + 20, 3.5)} fill={C.white} opacity={(0.5 + 0.5 * Math.sin(f / 10 + i)) * dark} />
    ))}
  </g>
);

/** "In June 1582, Nobunaga was staying at a temple in Kyoto." */
export const Temple: React.FC<SceneProps> = ({ f, from, to }) => {
  const june = w6(102, "june");
  const staying = w6(108, "staying");
  const temple = w6(111, "temple");
  const kyoto = w6(113, "kyoto");
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 520, z: 0.95 }], [to, { x: 960, y: 600, z: 1.12 }]])}>
        <NightSky f={f} />
        <Moon x={1600} y={160} r={60} />
        <Pencil d="M-600,860 H2700 V1500 H-600 Z" fill="#7d7a6a" />
        <TempleHall
          x={960}
          y={880}
          s={1.15}
          open={ip(f, [staying - 10, staying + 6], [0, 1])}
          glow={1}
          inside={<Person x={0} y={-44} s={0.72} tribe="nobunaga" f={f} sit hold="teabowl" aR={110} expr="happy" seed={1} />}
        />
        <Lanterns x0={200} x1={680} y={560} f={f} n={4} />
        <Lanterns x0={1240} x1={1720} y={560} f={f} n={4} />
      </Camera>
      <Pop s={pop(f, june, 200, 10)} x={300} y={200} rot={-8}>
        <Pencil d={ellipseD(300, 200, 170, 100)} fill={C.white} sw={5} />
        <Label x={300} y={182} text="June" size={52} font={FONT_HAND} halo={false} />
        <Label x={300} y={262} text="1582" size={90} font={FONT_TITLE} color={C.red} halo={false} />
      </Pop>
      <Label x={1380} y={330} text="a temple in Kyoto" size={66} font={FONT_HAND} p={ip(f, [temple, kyoto + 8], [0, 1], (x) => x)} rot={-3} />
      <Label x={1380} y={400} text="(Honno-ji)" size={46} font={FONT_HAND} p={ip(f, [kyoto + 4, kyoto + 14], [0, 1], (x) => x)} rot={-3} />
    </SceneSvg>
  );
};

/** "One of his most trusted generals surrounded the temple with 13,000 soldiers. Then he set it on fire." */
export const Betrayal: React.FC<SceneProps> = ({ f, from, to }) => {
  const trusted = w6(118, "trusted");
  const surrounded = w6(120, "surrounded");
  const thirteen = w6(124, "thirteen");
  const then = w6(127, "then");
  const fire = w6(132, "fire");
  const glow = ip(f, [then + 4, fire + 20], [0, 1]);
  const cam = camAt(f, [
    [from, { x: 1500, y: 640, z: 1.45 }],
    [surrounded - 2, { x: 1480, y: 640, z: 1.45 }],
    [surrounded + 18, { x: 1060, y: 560, z: 0.82 }],
    [to, { x: 1040, y: 560, z: 0.86 }],
  ]);
  const count = Math.round(ip(f, [thirteen, thirteen + 18], [0, 13000], (x) => x) / 100) * 100;
  // a line of the general's soldiers across the front of the temple
  const ring: Pt[] = new Array(30).fill(0).map((_, i) => [240 + (i / 29) * 1440 + (rand(i) - 0.5) * 30, 930 + (i % 3) * 36]);
  const torch = (t0: number, x0: number, x1: number, y1: number) => {
    const t = ip(f, [t0 - 12, t0], [0, 1], (x) => x);
    if (t <= 0 || t >= 1) return null;
    return (
      <g transform={`translate(${x0 + (x1 - x0) * t},${940 - Math.sin(t * Math.PI) * 360 + (y1 - 940) * t}) rotate(${t * 540})`}>
        <Pencil d="M-5,0 L5,0 L5,60 L-5,60 Z" fill={C.brown} sw={2.5} />
        <Pencil d="M0,4 C-14,-10 -8,-30 0,-40 C8,-30 14,-10 0,4 Z" fill={C.lava} sw={2.5} />
      </g>
    );
  };
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <NightSky f={f} dark={1 - glow * 0.6} />
        <Shade d="M-800,-600 H3000 V1500 H-800 Z" fill="#e9874a" opacity={0.45 * glow} />
        <Moon x={1700} y={140} r={60} />
        <Pencil d="M-800,860 H3000 V1500 H-800 Z" fill="#7d7a6a" />
        <TempleHall x={960} y={880} s={1.15} burnt={ip(f, [fire, to], [0, 0.8])} />
        <SmokeColumn x={760} y={420} f={f} seed={1} opacity={ip(f, [fire, fire + 16], [0, 1])} />
        <SmokeColumn x={1180} y={400} f={f} seed={2} opacity={ip(f, [fire + 4, fire + 20], [0, 1])} />
        <Flames x={700} y={560} s={0.9 * pop(f, fire - 2, 160, 12)} f={f} seed={1} />
        <Flames x={1230} y={540} s={1.0 * pop(f, fire + 2, 160, 12)} f={f} seed={2} />
        <Flames x={960} y={430} s={1.1 * pop(f, fire + 6, 160, 12)} f={f} seed={3} />
        {torch(then + 10, 300, 720, 560)}
        {torch(then + 16, 1700, 1220, 540)}
        {torch(fire - 2, 400, 960, 440)}
        {ring.map(([x, y], i) => (
          <Troop key={i} x={x} y={y} s={1.25 * pop(f, surrounded + 4 + i)} color={AKECHI} flip={x > 960} />
        ))}
        <Person
          x={1560}
          y={1000}
          s={1.5}
          tribe="general"
          f={f}
          flip
          expr={f < surrounded ? "smile" : "grin"}
          look={f < surrounded ? [1, 0] : [-1, 0]}
          aR={f > then ? 150 : 30}
          seed={3}
        />
        <Heart x={1560} y={560} s={pop(f, trusted - 4) * ip(f, [surrounded - 4, surrounded + 2], [1, 0]) * 2.4} color={C.pink} />
      </Camera>
      <Pop s={pop(f, trusted - 2) * ip(f, [surrounded - 4, surrounded + 4], [1, 0])} x={600} y={220} rot={-4}>
        <Pencil d="M260,140 h680 v160 h-680 Z" fill={C.white} sw={5} />
        <Label x={600} y={210} text="his MOST TRUSTED" size={62} font={FONT_TITLE} color={AKECHI} halo={false} />
        <Label x={600} y={270} text="general" size={50} font={FONT_HAND} halo={false} />
      </Pop>
      <Pop s={pop(f, thirteen - 2, 190, 10) * ip(f, [then + 4, then + 12], [1, 0])} x={1500} y={200} rot={-3}>
        <Pencil d="M1220,110 h560 v170 h-560 Z" fill={C.white} sw={6} />
        <Label x={1500} y={210} text={count.toLocaleString("en-US")} size={104} font={FONT_TITLE} color={AKECHI} halo={false} />
        <Label x={1500} y={262} text="soldiers" size={40} font={FONT_HAND} halo={false} />
      </Pop>
      <Label x={960} y={170} text="FIRE!" size={130} font={FONT_TITLE} color={C.red} p={ip(f, [fire, fire + 6], [0, 1], (x) => x)} rot={-5} />
    </SceneSvg>
  );
};

/** "Nobunaga saw there was no way out, so he committed seppuku." — the doors close on him. */
export const NoWayOut: React.FC<SceneProps> = ({ f, from, to }) => {
  const saw = w6(134, "saw");
  const no = w6(137, "no");
  const so = w6(140, "so");
  const seppuku = w6(143, "seppuku");
  const kneel = f > so + 4;
  const shut = ip(f, [seppuku - 4, seppuku + 16], [0, 1]);
  const look: [number, number] = f < saw + 8 ? [-1, 0] : f < no ? [1, 0] : [0, 0.3];
  const dim = ip(f, [seppuku, to], [0, 0.35]);
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 540, z: 1.0 }], [so, { x: 960, y: 560, z: 1.08 }], [to, { x: 960, y: 560, z: 1.14 }]])}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#e9874a" opacity={0.5} />
        {/* the hall inside */}
        <Pencil d="M-600,880 H2700 V1500 H-600 Z" fill="#d8c48a" />
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <Ink key={k} d={`M${-200 + k * 460},880 L${-500 + k * 560},1200`} sw={3} opacity={0.4} />
        ))}
        <Pencil d="M560,880 h800 v-560 h-800 Z" fill={C.white} />
        {[1, 2, 3].map((k) => (
          <Ink key={k} d={`M${560 + k * 200},880 v-560`} sw={3} opacity={0.6} />
        ))}
        {[1, 2, 3, 4].map((k) => (
          <Ink key={k} d={`M560,${880 - k * 112} h800`} sw={3} opacity={0.6} />
        ))}
        {[160, 1760].map((dx, i) => (
          <g key={dx}>
            <Pencil d={`M${dx - 150},880 h300 v-520 h-300 Z`} fill="#5a3a2e" />
            <Flames x={dx} y={880} s={1.5} f={f} seed={i + 4} />
            <Pop s={pop(f, no + i * 3)} x={dx} y={600}>
              <Ink d={`M${dx - 110},${490} L${dx + 110},${710} M${dx + 110},${490} L${dx - 110},${710}`} sw={18} color={C.red} />
            </Pop>
          </g>
        ))}
        {kneel ? (
          <Person x={960} y={960} s={1.5} tribe="nobunaga" f={f} sit expr="neutral" look={[0, 0.8]} blinkOff seed={1} />
        ) : (
          <Person x={960} y={960} s={1.5} tribe="nobunaga" f={f} expr="worry" look={look} seed={1} aR={30} aL={30} />
        )}
        <Shoji x={960} y={1000} w={900} h={760} p={shut} />
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#2b2b35" opacity={dim} />
      </Camera>
      <Label x={960} y={170} text="no way out" size={96} font={FONT_TITLE} color={C.red} p={ip(f, [no, no + 8], [0, 1], (x) => x) * ip(f, [so, so + 6], [1, 0])} rot={-3} />
      {/* a single petal drifting past the closed doors */}
      {shut > 0.9 ? (
        <g transform={`translate(${1100 - (f - seppuku) * 3},${240 + (f - seppuku) * 7}) rotate(${f * 4})`}>
          <Pencil d="M0,-14 C12,-14 16,4 0,14 C-16,4 -12,-14 0,-14 Z" fill={C.pink} sw={2.5} />
        </g>
      ) : null}
    </SceneSvg>
  );
};

/** "What is seppuku? Search it, but at your own risk." */
export const SearchIt: React.FC<SceneProps> = ({ f, from, to }) => {
  const what = w6(144, "what");
  const seppuku = w6(146, "seppuku");
  const search = w6(147, "search");
  const but = w6(149, "but");
  const risk = w6(153, "risk");
  const press = f > search + 6 && f < search + 12 ? 1 : 0;
  const cx = ip(f, [search - 10, search + 6], [1500, 1405]);
  const cy = ip(f, [search - 10, search + 6], [820, 500]);
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 540, z: 1.0 }], [to, { x: 1000, y: 560, z: 1.06 }]])}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill={C.lightIndigo} opacity={0.25} />
        <g opacity={ip(f, [from, from + 8], [0, 1])}>
          <SearchBox x={860} y={470} w={1200} text="seppuku" typed={ip(f, [what, seppuku + 18], [0, 1], (x) => x)} f={f} press={press} />
        </g>
        {f > search - 10 ? (
          <g transform={`translate(${cx},${cy})`}>
            <Pencil d="M0,0 L0,64 L16,50 L28,76 L40,70 L28,46 L48,44 Z" fill={C.white} sw={4} />
          </g>
        ) : null}
        <Warning x={1520} y={600} s={pop(f, but, 200, 10) * 0.8} f={f} />
        <Label x={1420} y={850} text="AT YOUR OWN RISK!" size={68} font={FONT_TITLE} color={C.red} p={ip(f, [but + 4, risk + 4], [0, 1], (x) => x)} rot={-3} />
        <g opacity={pop(f, but + 6)}>
          <JapanChar f={f} x={300} y={780} s={0.32} expr="worry" armR={150} armL={150} />
        </g>
      </Camera>
    </SceneSvg>
  );
};

/** A portrait in a frame. */
const Portrait: React.FC<{ x: number; y: number; s: number; children: React.ReactNode }> = ({ x, y, s, children }) =>
  s <= 0.01 ? null : (
    <Pop s={s} x={x} y={y}>
      <Frame x={x} y={y} w={360} h={440}>
        {children}
      </Frame>
    </Pop>
  );

/** "And why did his general turn against him? Even today, nobody knows for sure." + a quiet ending */
export const Mystery: React.FC<SceneProps> = ({ f, from, to }) => {
  const why = w6(155, "why");
  const turn = w6(159, "turn");
  const even = w6(162, "even");
  const nobody = w6(164, "nobody");
  const split = ip(f, [turn, turn + 10], [0, 1]);
  const fade = ip(f, [to - 30, to - 4], [1, 0]);
  return (
    <SceneSvg f={f}>
      <g opacity={fade}>
        <Camera cam={camAt(f, [[from, { x: 960, y: 540, z: 1.0 }], [to, { x: 960, y: 560, z: 1.08 }]])}>
          <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#9a8f80" opacity={0.3} />
          <Portrait x={520} y={460} s={pop(f, from + 2)}>
            <g>
              <Shade d="M350,240 h340 v440 h-340 Z" fill={C.sky} opacity={0.5} />
              <Person x={520} y={700} s={1.25} tribe="nobunaga" f={f} expr="neutral" seed={1} />
            </g>
          </Portrait>
          <Portrait x={1400} y={460} s={pop(f, from + 6)}>
            <g>
              <Shade d="M1230,240 h340 v440 h-340 Z" fill={C.lightIndigo} opacity={0.5} />
              <Person x={1400} y={700} s={1.25} tribe="general" f={f} flip expr={f > turn ? "angry" : "neutral"} seed={3} />
            </g>
          </Portrait>
          <Label x={520} y={760} text="Nobunaga" size={48} font={FONT_HAND} />
          <Label x={1400} y={760} text="his general" size={48} font={FONT_HAND} />
          {/* the bond between them breaks */}
          <g transform={`translate(${-split * 30},${split * 20}) rotate(${-split * 14},960,470)`}>
            <Pencil d="M960,540 C900,500 870,450 890,420 C910,392 950,400 960,430 L948,460 L966,480 L952,510 Z" fill={C.red} sw={4} opacity={pop(f, from + 10)} />
          </g>
          <g transform={`translate(${split * 30},${split * 20}) rotate(${split * 14},960,470)`}>
            <Pencil d="M960,540 C1020,500 1050,450 1030,420 C1010,392 970,400 960,430 L948,460 L966,480 L952,510 Z" fill={C.red} sw={4} opacity={pop(f, from + 10)} />
          </g>
          {[0, 1].map((i) => (
            <Person key={i} x={760 + i * 400} y={900} s={0.85 * pop(f, even + i * 4)} tribe="modern" f={f} flip={i === 1} hold="letter" aR={60} aL={160} expr="nervous" look={[i ? -1 : 1, -0.5]} seed={i + 9} />
          ))}
          <Question x={800} y={600} s={pop(f, even + 8)} size={100} rot={-10} />
          <Question x={1120} y={590} s={pop(f, even + 12)} size={110} rot={12} />
          <Stamp x={960} y={300} s={pop(f, nobody, 220, 12) * 0.9} text="???" font={FONT_TITLE} rot={-10} />
        </Camera>
        <Label x={960} y={130} text="WHY?" size={120} font={FONT_TITLE} color={C.red} p={ip(f, [why, why + 6], [0, 1], (x) => x)} rot={-3} />
      </g>
    </SceneSvg>
  );
};
