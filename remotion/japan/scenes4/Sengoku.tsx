import React from "react";
import { C, FONT_HAND, FONT_TITLE, INK, ip, rand } from "../theme";
import {
  Bang,
  Camera,
  camAt,
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
  Sun,
} from "../draw";
import { SceneSvg } from "../Stage";
import { MapArt, japanD, proj } from "../MapArt";
import { Person } from "../Person";
import { Banner, CherryTree, Pagoda, Shrine, Throne } from "../Props2";
import { AnswerCard, Bulb, ClashIcon, Flames, Grave, Pedestal, SmokeColumn, Townhouse } from "../Props4";
import { TitleScene } from "../scenes/Opening";
import { w4 } from "../part4cues";

const RED_SKIN = "#e58a7a";
const WEST = C.red;
const EAST = C.indigo;

export const Title4: React.FC<{ f: number }> = ({ f }) => (
  <TitleScene
    f={f}
    subtitle="part 4 · Kyoto burns & the warring states"
    doodles={
      <g>
        <DrawOn d="M420,780 L1500,780" p={ip(f, [18, 50], [0, 1])} sw={4} />
        <Pop s={pop(f, 36)} x={540} y={780}>
          <Townhouse x={540} y={780} s={0.42} seed={2} />
          <Flames x={540} y={700} s={0.32} f={f} />
        </Pop>
        <Pop s={pop(f, 46)} x={1400} y={780}>
          <Banner x={1370} y={780} color={WEST} s={0.45} crest={false} />
          <Banner x={1430} y={780} color={EAST} s={0.45} crest={false} />
        </Pop>
      </g>
    }
  />
);

const Street: React.FC<{ burnt?: (i: number) => number }> = ({ burnt }) => (
  <g>
    <Shade d="M-800,-600 H3000 V760 H-800 Z" fill={C.sky} opacity={0.2} />
    {new Array(10).fill(0).map((_, i) => (
      <Townhouse key={i} x={-300 + i * 260} y={760} s={1.0} seed={i} burnt={burnt ? burnt(i) : 0} />
    ))}
    <Pencil d="M-800,760 H3000 V1500 H-800 Z" fill="#c9b99a" />
    {new Array(8).fill(0).map((_, i) => (
      <Ink key={i} d={`M${-600 + i * 400 + Math.sin(i) * 40},${830 + (i % 3) * 40} l60,0`} sw={2.5} opacity={0.4} />
    ))}
  </g>
);

/** "The war was fought right in the streets of Kyoto." */
export const Streets: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const streets = w4(7, "streets");
  const charge = ip(f, [from + 4, to + 4], [0, 1]);
  const clash = charge > 0.85;
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 560, z: 1.0 }], [to, { x: 960, y: 580, z: 1.06 }]])} shake={shakeAt(f, clash ? 0.3 : 0)}>
        <Street />
        {[0, 1, 2].map((i) => (
          <g key={`w${i}`}>
            <Banner x={100 + i * 130 + charge * 420} y={1000} color={WEST} s={0.7} wave={Math.sin(f / 4 + i) * 6} crest={false} />
            <Person x={150 + i * 130 + charge * 420} y={1010 + (i % 2) * 14} s={0.95} tribe="samurai" cloth={C.red} f={f} walk={f * 0.7 + i} hold="katana" aR={150} expr="angry" seed={i} />
          </g>
        ))}
        {[0, 1, 2].map((i) => (
          <g key={`e${i}`}>
            <Banner x={1820 - i * 130 - charge * 420} y={1000} color={EAST} s={0.7} wave={Math.sin(f / 4 + i) * 6} crest={false} />
            <Person x={1770 - i * 130 - charge * 420} y={1010 + (i % 2) * 14} s={0.95} tribe="samurai" f={f} flip walk={f * 0.7 + i} hold="katana" aR={150} expr="angry" seed={i + 4} />
          </g>
        ))}
        {clash ? <Bang x={960} y={620} s={pop(f, to - 10)} n={3} /> : null}
        <Label x={960} y={300} text="the streets of Kyoto" size={80} font={FONT_TITLE} color={C.indigo} p={ip(f, [streets, streets + 14], [0, 1], (x) => x)} rot={-3} />
      </Camera>
    </SceneSvg>
  );
};

/** "One side was led by a scary warlord called the Red Monk. The other side was led by his own son-in-law." */
export const Leaders: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const scary = w4(16, "scary");
  const red = w4(20, "red");
  const other = w4(22, "the");
  const son = w4(30, "son");
  const cam = camAt(f, [
    [from, { x: 620, y: 560, z: 1.25 }],
    [other - 4, { x: 640, y: 560, z: 1.25 }],
    [other + 16, { x: 960, y: 560, z: 1.0 }],
    [to, { x: 960, y: 560, z: 1.04 }],
  ]);
  const crackP = ip(f, [son + 6, son + 16], [0, 1]);
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <Shade d="M-600,-400 H960 V1500 H-600 Z" fill={WEST} opacity={0.22} />
        <Shade d="M960,-400 H2700 V1500 H960 Z" fill={EAST} opacity={0.18} />
        <Pencil d="M-600,880 H2700 V1500 H-600 Z" fill={C.straw} />
        <Banner x={330} y={900} color={WEST} s={0.9} wave={Math.sin(f / 5) * 6} crest={false} />
        <Banner x={1600} y={900} color={EAST} s={0.9} wave={Math.sin(f / 5 + 1) * 6} crest={false} />
        <Person x={560} y={940} s={1.35 * pop(f, scary - 6)} tribe="monk" cloth={C.red} skin={RED_SKIN} f={f} expr="angry" hold="naginata" aR={30} seed={2} />
        <Label x={560} y={300} text="the RED MONK" size={96} font={FONT_TITLE} color={C.red} p={ip(f, [red - 2, red + 12], [0, 1], (x) => x)} rot={-4} />
        <Label x={560} y={380} text="(scary warlord)" size={46} font={FONT_HAND} p={ip(f, [scary, scary + 14], [0, 1], (x) => x)} rot={-4} />
        <Person x={1360} y={940} s={1.25 * pop(f, other + 2)} tribe="daimyo" cloth={EAST} f={f} flip expr={f > son + 10 ? "nervous" : "angry"} seed={6} />
        <Label x={1360} y={340} text="his son-in-law!" size={72} font={FONT_TITLE} color={EAST} p={ip(f, [son, son + 14], [0, 1], (x) => x)} rot={3} />
        {/* the wedding portrait between them */}
        <Pop s={pop(f, son - 4, 170, 11)} x={960} y={520}>
          <Pencil d="M820,400 h280 v240 h-280 Z" fill={C.bronze} />
          <Pencil d="M840,420 h240 v200 h-240 Z" fill="#efe1c0" sw={3} />
          <Person x={910} y={610} s={0.48} tribe="monk" cloth={C.red} skin={RED_SKIN} f={f} expr="grin" blinkOff seed={3} />
          <Person x={1010} y={610} s={0.48} tribe="daimyo" cloth={EAST} f={f} expr="grin" blinkOff seed={7} />
          <Heart x={960} y={450} s={0.8} />
          <DrawOn d="M940,400 l20,40 l-16,30 l24,40 l-14,40 l16,50" p={crackP} sw={5} />
        </Pop>
        <Label x={960} y={720} text="awkward..." size={50} font={FONT_HAND} p={ip(f, [son + 18, son + 30], [0, 1], (x) => x)} />
      </Camera>
    </SceneSvg>
  );
};

/** "They set fire to each other's houses, temples and palaces." */
export const Fire: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const fire = w4(35, "fire");
  const houses = w4(39, "houses");
  const temples = w4(40, "temples");
  const palaces = w4(42, "palaces");
  const glow = ip(f, [fire, palaces + 20], [0, 1]);
  const torch = (t0: number, x0: number, x1: number, y1: number) => {
    const t = ip(f, [t0 - 12, t0], [0, 1], (x) => x);
    if (t <= 0 || t >= 1) return null;
    return (
      <g transform={`translate(${x0 + (x1 - x0) * t},${900 - Math.sin(t * Math.PI) * 360 + (y1 - 900) * t}) rotate(${t * 540})`}>
        <Pencil d="M-5,0 L5,0 L5,60 L-5,60 Z" fill={C.brown} sw={2.5} />
        <Pencil d="M0,4 C-14,-10 -8,-30 0,-40 C8,-30 14,-10 0,4 Z" fill={C.lava} sw={2.5} />
      </g>
    );
  };
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 540, z: 1.0 }], [to, { x: 960, y: 520, z: 0.96 }]])}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill={C.sky} opacity={0.2 * (1 - glow)} />
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#e9874a" opacity={0.45 * glow} />
        <Pencil d="M-600,820 H2700 V1500 H-600 Z" fill="#c9b99a" />
        <Townhouse x={220} y={820} s={1.05} seed={1} />
        <Townhouse x={470} y={820} s={0.95} seed={2} />
        <Pagoda x={960} y={830} s={0.95} />
        <Shrine x={1560} y={820} s={1.15} />
        {torch(houses, 100, 340, 720)}
        {torch(temples, 1900, 960, 560)}
        {torch(palaces, 100, 1560, 620)}
        <SmokeColumn x={340} y={560} f={f} seed={1} opacity={ip(f, [houses, houses + 20], [0, 1])} />
        <SmokeColumn x={960} y={330} f={f} seed={2} opacity={ip(f, [temples, temples + 20], [0, 1])} />
        <SmokeColumn x={1560} y={560} f={f} seed={3} opacity={ip(f, [palaces, palaces + 20], [0, 1])} />
        <Flames x={340} y={760} s={1.1 * pop(f, houses, 160, 12)} f={f} seed={1} />
        <Flames x={960} y={560} s={0.9 * pop(f, temples, 160, 12)} f={f} seed={2} />
        <Flames x={1560} y={700} s={1.2 * pop(f, palaces, 160, 12)} f={f} seed={3} />
        <Label x={340} y={300} text="houses" size={60} font={FONT_HAND} p={ip(f, [houses, houses + 10], [0, 1], (x) => x)} />
        <Label x={960} y={120} text="temples" size={60} font={FONT_HAND} p={ip(f, [temples, temples + 10], [0, 1], (x) => x)} />
        <Label x={1560} y={300} text="palaces" size={60} font={FONT_HAND} p={ip(f, [palaces, palaces + 10], [0, 1], (x) => x)} />
      </Camera>
    </SceneSvg>
  );
};

/** "Slowly, the beautiful old city of Kyoto was destroyed." */
export const Destroyed: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const beautiful = w4(45, "beautiful");
  const destroyed = w4(51, "destroyed");
  const decay = ip(f, [beautiful + 10, destroyed + 10], [0, 1], (x) => x);
  const burnt = (i: number) => ip(decay, [i * 0.08, i * 0.08 + 0.35], [0, 1], (x) => x);
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 540, z: 1.12 }], [to, { x: 960, y: 520, z: 0.95 }]])}>
        <Shade d="M-800,-600 H3000 V1500 H-800 Z" fill={C.sky} opacity={0.25 * (1 - decay)} />
        <Shade d="M-800,-600 H3000 V1500 H-800 Z" fill="#7a7480" opacity={0.45 * decay} />
        {decay < 0.5 ? <Sun x={1600} y={160} r={56} f={f} /> : null}
        <g opacity={1 - decay}>
          <CherryTree x={140} y={800} s={1.0} />
          <CherryTree x={1820} y={800} s={1.0} />
        </g>
        {new Array(9).fill(0).map((_, i) => (
          <Townhouse key={i} x={-200 + i * 280} y={820} s={1.0} seed={i + 3} burnt={burnt(i)} />
        ))}
        <g opacity={1 - ip(decay, [0.4, 0.9], [0, 1])}>
          <Pagoda x={960} y={700} s={0.6} />
        </g>
        {decay > 0.2
          ? [200, 760, 1300, 1700].map((x, i) => <SmokeColumn key={i} x={x} y={640} f={f} seed={i + 4} opacity={ip(decay, [0.2, 0.5], [0, 1]) * 0.9} />)
          : null}
        <Pencil d="M-800,820 H3000 V1500 H-800 Z" fill={decay > 0.6 ? "#8f8478" : "#c9b99a"} />
        <Label x={960} y={260} text="beautiful old Kyoto..." size={74} font={FONT_HAND} p={ip(f, [beautiful, beautiful + 16], [0, 1], (x) => x) * ip(f, [destroyed - 6, destroyed], [1, 0])} />
        <Label x={960} y={260} text="...destroyed" size={96} font={FONT_TITLE} color="#5d5960" p={ip(f, [destroyed, destroyed + 12], [0, 1], (x) => x)} />
      </Camera>
    </SceneSvg>
  );
};

/** "Now guess how long this war lasted. One year? Two? Five? It lasted ten whole years." */
export const HowLong: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const guess = w4(53, "guess");
  const one = w4(59, "one");
  const two = w4(61, "two");
  const five = w4(62, "five");
  const it = w4(63, "it");
  const ten = w4(65, "ten");
  const years = w4(67, "years");
  const cross = (k: number) => ip(f, [it + k * 4, it + k * 4 + 8], [0, 1], (x) => x);
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 540, z: 1.0 }], [to, { x: 960, y: 540, z: 1.04 }]])}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#f2cf8a" opacity={0.3} />
        {new Array(16).fill(0).map((_, i) => {
          const a = (i / 16) * Math.PI * 2 + f * 0.01;
          return <Ink key={i} d={`M${960 + Math.cos(a) * 300},${460 + Math.sin(a) * 300} L${960 + Math.cos(a) * 1200},${460 + Math.sin(a) * 1200}`} sw={4} color={C.sun} opacity={0.3} />;
        })}
        <Pencil d="M-600,900 H2700 V1500 H-600 Z" fill={C.straw} />
        <Label x={960} y={170} text="How long did the war last?" size={76} font={FONT_TITLE} p={ip(f, [guess - 2, guess + 18], [0, 1], (x) => x)} />
        <AnswerCard x={520} y={420} s={pop(f, one - 2)} text="1 year?" font={FONT_HAND} crossed={cross(0)} />
        <AnswerCard x={960} y={420} s={pop(f, two - 2)} text="2?" font={FONT_HAND} crossed={cross(1)} />
        <AnswerCard x={1400} y={420} s={pop(f, five - 2)} text="5?" font={FONT_HAND} crossed={cross(2)} />
        <Person x={240} y={960} s={1.0} tribe="samurai" f={f} expr={f > ten ? "shock" : "worry"} aR={f < ten ? 150 : 60} aL={f > ten ? 60 : 10} seed={3} />
        <Pop s={pop(f, ten - 2, 220, 9)} x={960} y={700} rot={-4}>
          <Pencil d="M470,600 h980 v200 h-980 Z" fill={C.yellow} sw={6} />
          <Label x={960} y={732} text="10 WHOLE YEARS!" size={90} font={FONT_TITLE} color={C.red} halo={false} />
        </Pop>
        {new Array(10).fill(0).map((_, i) => (
          <DrawOn
            key={i}
            d={i % 5 === 4 ? `M${1340 + Math.floor(i / 5) * 150 - 70},${880} L${1340 + Math.floor(i / 5) * 150 + 6},${820}` : `M${1300 + Math.floor(i / 5) * 150 + (i % 5) * 18},${820} l0,70`}
            p={ip(f, [years + i * 1.5, years + i * 1.5 + 3], [0, 1])}
            sw={6}
          />
        ))}
      </Camera>
    </SceneSvg>
  );
};

/** "And in the end, both leaders were dead, and nobody won." */
export const NobodyWon: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const both = w4(72, "both");
  const nobody = w4(77, "nobody");
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 540, z: 1.0 }], [to, { x: 960, y: 560, z: 1.06 }]])}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#7a7480" opacity={0.35} />
        {new Array(8).fill(0).map((_, i) => (
          <Townhouse key={i} x={-100 + i * 300} y={760} s={0.85} seed={i} burnt={1} />
        ))}
        <Pencil d="M-600,760 H2700 V1500 H-600 Z" fill="#8f8478" />
        <Pop s={pop(f, both - 2)} x={520} y={940}>
          <Grave x={520} y={940} s={1.1} hat="monk" />
        </Pop>
        <Pop s={pop(f, both + 6)} x={1400} y={940}>
          <Grave x={1400} y={940} s={1.1} hat="lord" />
        </Pop>
        <Label x={520} y={1010} text="Red Monk" size={42} font={FONT_HAND} p={ip(f, [both + 2, both + 12], [0, 1], (x) => x)} />
        <Label x={1400} y={1010} text="son-in-law" size={42} font={FONT_HAND} p={ip(f, [both + 10, both + 20], [0, 1], (x) => x)} />
        <Pop s={pop(f, nobody - 6)} x={960} y={760}>
          <Pencil d="M880,500 Q880,640 960,660 Q1040,640 1040,500 Z" fill={C.yellow} />
          <Pencil d="M880,520 Q830,520 840,570 Q850,600 890,600 M1040,520 Q1090,520 1080,570 Q1070,600 1030,600" sw={6} />
          <Pencil d="M940,660 h40 v40 h-40 Z M900,700 h120 v30 h-120 Z" fill={C.bronze} sw={4} />
        </Pop>
        <Question x={960} y={440} s={pop(f, nobody + 4)} size={110} />
        <Label x={960} y={250} text="nobody won" size={100} font={FONT_TITLE} color="#5d5960" p={ip(f, [nobody, nobody + 14], [0, 1], (x) => x)} />
      </Camera>
    </SceneSvg>
  );
};

const FLAGS: Pt[] = [
  proj(130.5, 32.8), proj(131.3, 33.6), proj(133.3, 34.6), proj(132.5, 33.6), proj(134.2, 35.2), proj(135.9, 35.4),
  proj(136.9, 36.3), proj(137.9, 35.6), proj(139.0, 36.4), proj(139.9, 35.9), proj(140.3, 38.3), proj(140.8, 39.8),
  proj(141.1, 40.6), proj(138.6, 37.3),
];
const FLAG_COLORS = [C.red, C.indigo, C.orange, C.darkGreen, C.terracotta, "#7a5aa0", C.yellow];

/** "The real power went to local lords all over Japan, and the Sengoku period began." */
export const LordsMap: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const power = w4(81, "power");
  const local = w4(84, "local");
  const japan = w4(88, "japan");
  const sengoku = w4(91, "sengoku");
  const began = w4(93, "began");
  const [kx, ky] = proj(135.76, 35.01);
  const scatter = ip(f, [local - 4, japan + 8], [0, 1]);
  const cam = camAt(f, [
    [from, { x: 1300, y: 680, z: 1.05 }],
    [sengoku - 6, { x: 1290, y: 680, z: 1.0 }],
    [to, { x: 1290, y: 640, z: 0.96 }],
  ]);
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <MapArt f={f} />
        {/* the power, as a crown, splits from Kyoto to the lords */}
        {scatter < 1 ? (
          <Pop s={pop(f, power - 4)} x={kx} y={ky - 60}>
            <g transform={`translate(${kx},${ky - 60})`}>
              <Pencil d="M-40,20 L-48,-24 L-22,0 L0,-34 L22,0 L48,-24 L40,20 Z" fill={C.yellow} sw={4} />
            </g>
          </Pop>
        ) : null}
        {FLAGS.map(([x, y], i) => {
          const at = local - 4 + i * 2.5;
          const t = ip(f, [at, at + 10], [0, 1]);
          const s = pop(f, at + 8);
          return (
            <g key={i}>
              {t > 0 && t < 1 ? (
                <g transform={`translate(${kx + (x - kx) * t},${ky - 60 + (y - 40 - (ky - 60)) * t - Math.sin(t * Math.PI) * 80})`}>
                  <Pencil d={ellipseD(0, 0, 9)} fill={C.yellow} sw={2.5} />
                </g>
              ) : null}
              <Pop s={s} x={x} y={y}>
                <Ink d={`M${x},${y} l0,-80`} sw={5} />
                <Pencil d={`M${x},${y - 80} l52,12 l-52,14 Z`} fill={FLAG_COLORS[i % FLAG_COLORS.length]} sw={3.5} />
              </Pop>
            </g>
          );
        })}
        <Label x={1700} y={420} text="local lords!" size={64} font={FONT_HAND} p={ip(f, [local, japan], [0, 1], (x) => x) * ip(f, [sengoku - 6, sengoku], [1, 0])} rot={-6} />
        <Pop s={pop(f, sengoku - 2, 190, 10)} x={1290} y={420} rot={-3}>
          <Pencil d="M820,330 h940 v170 h-940 Z" fill={C.white} sw={6} />
          <Label x={1290} y={455} text="SENGOKU PERIOD" size={104} font={FONT_TITLE} color="#8a2a2e" halo={false} />
        </Pop>
        <Label x={1290} y={570} text="(the age of warring states)" size={52} font={FONT_HAND} p={ip(f, [began, began + 16], [0, 1], (x) => x)} rot={-3} />
      </Camera>
    </SceneSvg>
  );
};

/** "For about 150 years, civil wars broke out again and again." */
export const CivilWars: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const n150 = w4(96, "one");
  const civil = w4(99, "civil");
  const again1 = w4(103, "again");
  const again2 = w4(105, "again");
  const year = Math.round(ip(f, [n150 - 4, to], [1467, 1615], (x) => x));
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 1290, y: 640, z: 0.96 }], [to, { x: 1290, y: 660, z: 1.0 }]])} shake={shakeAt(f, f > civil ? 0.12 : 0)}>
        <MapArt f={f} />
        {FLAGS.map(([x, y], i) => (
          <g key={i}>
            <Ink d={`M${x},${y} l0,-80`} sw={5} />
            <Pencil d={`M${x},${y - 80} l52,12 l-52,14 Z`} fill={FLAG_COLORS[i % FLAG_COLORS.length]} sw={3.5} />
          </g>
        ))}
        {f > civil - 4
          ? new Array(18).fill(0).map((_, k) => {
              const at = civil - 4 + k * 5;
              const life = f - at;
              if (life < 0 || life > 26) return null;
              const [a, b] = [FLAGS[(k * 5) % FLAGS.length], FLAGS[(k * 5 + 3) % FLAGS.length]];
              const x = (a[0] + b[0]) / 2 + (rand(k) - 0.5) * 60;
              const y = (a[1] + b[1]) / 2 + (rand(k + 9) - 0.5) * 60;
              return <ClashIcon key={k} x={x} y={y} s={pop(f, at) * ip(life, [18, 26], [1, 0])} />;
            })
          : null}
        <Label x={1700} y={440} text="again..." size={70} font={FONT_HAND} p={ip(f, [again1, again1 + 10], [0, 1], (x) => x)} rot={-6} />
        <Label x={1720} y={540} text="...and again!" size={70} font={FONT_HAND} p={ip(f, [again2, again2 + 12], [0, 1], (x) => x)} rot={-6} />
      </Camera>
      <Pop s={pop(f, n150 - 2, 200, 10)} x={300} y={210} rot={-6}>
        <Pencil d="M120,110 h360 v200 h-360 Z" fill={C.white} sw={5} />
        <Pencil d="M120,110 h360 v60 h-360 Z" fill={C.red} sw={5} />
        <Label x={300} y={160} text="~150 years" size={46} font={FONT_TITLE} color={C.white} halo={false} />
        <Label x={300} y={280} text={String(year)} size={100} font={FONT_TITLE} halo={false} />
      </Pop>
    </SceneSvg>
  );
};

/** "A new idea spread across the country, called gekokujo. It means 'the low defeat the high.'" */
export const Gekokujo: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const idea = w4(108, "idea");
  const spread = w4(109, "spread");
  const geko = w4(114, "gekokujo");
  const means = w4(116, "means");
  const low = w4(118, "low");
  const defeat = w4(119, "defeat");
  const high = w4(121, "high");
  const swap = ip(f, [means - 8, means + 2], [0, 1]);
  const topple = ip(f, [defeat + 2, high + 10], [0, 1], (x) => x * x);
  return (
    <SceneSvg f={f}>
      {swap < 1 ? (
        <g opacity={1 - swap}>
          <Camera cam={camAt(f, [[from, { x: 960, y: 540, z: 1.0 }], [means, { x: 960, y: 520, z: 1.05 }]])}>
            <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#d9c8e8" opacity={0.3} />
            <g transform="translate(960,560) scale(0.55) translate(-1360,-592)" opacity={0.35}>
              {japanD.map((d, i) => (
                <Pencil key={i} d={d} fill={C.green} sw={7} />
              ))}
            </g>
            {[0, 1, 2, 3].map((k) => {
              const t = ip(f, [spread - 4 + k * 8, spread + 34 + k * 8], [0, 1], (x) => x);
              if (t <= 0 || t >= 1) return null;
              return <DrawOn key={k} d={`M${960 - 120 - t * 700},400 a${120 + t * 700},${120 + t * 700} 0 1,0 ${2 * (120 + t * 700)},0 a${120 + t * 700},${120 + t * 700} 0 1,0 ${-2 * (120 + t * 700)},0`} p={1} sw={5} dotted color="#7a5aa0" />;
            })}
            <Bulb x={960} y={420} s={pop(f, idea - 4)} glow={ip(f, [idea, idea + 10], [0, 1])} />
            <Label x={960} y={760} text="GEKOKUJO" size={150} font={FONT_TITLE} color="#7a5aa0" p={ip(f, [geko - 2, geko + 14], [0, 1], (x) => x)} rot={-3} />
            <Label x={960} y={850} text="(say: geh-koh-koo-joh)" size={48} font={FONT_HAND} p={ip(f, [geko + 10, geko + 26], [0, 1], (x) => x)} rot={-3} />
          </Camera>
        </g>
      ) : null}
      {swap > 0 ? (
        <g opacity={swap}>
          <Camera cam={camAt(f, [[means, { x: 960, y: 560, z: 1.0 }], [to, { x: 980, y: 560, z: 1.05 }]])}>
            <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#d9c8e8" opacity={0.25} />
            <Pencil d="M-600,900 H2700 V1500 H-600 Z" fill={C.moss} />
            <Pedestal x={1250} y={900} h={300} tilt={topple * 30} />
            <g transform={`rotate(${topple * 70},1350,${600})`}>
              <Person x={1250 + topple * 160} y={576 + topple * 260} s={1.0} tribe="daimyo" f={f} expr={topple > 0.1 ? "shock" : "angry"} aL={topple > 0.1 ? 150 : 10} aR={topple > 0.1 ? 150 : 10} seed={6} flip />
            </g>
            <Person x={760 + ip(f, [low, defeat], [0, 220])} y={940} s={0.85} tribe="yayoi" f={f} expr="grin" hold="spear" aR={f > defeat - 4 && f < defeat + 6 ? 100 : 30} lean={f > defeat - 4 && f < defeat + 6 ? 18 : 0} walk={f > low && f < defeat ? f * 0.6 : undefined} seed={3} />
            <Label x={760} y={600} text="low" size={64} font={FONT_HAND} p={ip(f, [low, low + 8], [0, 1], (x) => x)} />
            <Label x={1250} y={200} text="high" size={64} font={FONT_HAND} p={ip(f, [high - 4, high + 6], [0, 1], (x) => x)} />
            <Bang x={1150} y={460} s={pop(f, defeat + 4)} n={2} />
            <Label x={960} y={120} text="the low defeat the high" size={72} font={FONT_TITLE} color="#7a5aa0" p={ip(f, [means, high + 12], [0, 1], (x) => x)} />
          </Camera>
        </g>
      ) : null}
    </SceneSvg>
  );
};

/** "Your family name no longer mattered." */
export const FamilyName: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const family = w4(123, "family");
  const mattered = w4(127, "mattered");
  const x = ip(f, [mattered - 10, mattered + 2], [0, 1]);
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 540, z: 1.0 }], [to, { x: 960, y: 540, z: 1.05 }]])}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill={C.tan} opacity={0.35} />
        <Pop s={pop(f, family - 4, 170, 11)} x={960} y={480}>
          <Pencil d="M600,300 h720 v360 h-720 Z" fill={C.straw} sw={6} />
          <Pencil d={ellipseD(760, 480, 80)} fill={C.white} sw={5} />
          <Pencil d="M760,420 l18,40 l44,4 l-34,28 l12,44 l-40,-24 l-40,24 l12,-44 l-34,-28 l44,-4 Z" fill={C.red} sw={3} />
          <Label x={1080} y={450} text="The Very" size={56} font={FONT_TITLE} halo={false} />
          <Label x={1080} y={530} text="Noble Clan" size={56} font={FONT_TITLE} halo={false} />
        </Pop>
        <DrawOn d="M580,280 L1340,680" p={x} sw={18} color={C.red} />
        <DrawOn d="M1340,280 L580,680" p={ip(f, [mattered - 4, mattered + 6], [0, 1])} sw={18} color={C.red} />
        <Label x={960} y={840} text="family name? doesn't matter!" size={64} font={FONT_HAND} p={ip(f, [mattered, mattered + 16], [0, 1], (x) => x)} />
      </Camera>
    </SceneSvg>
  );
};

/** "If you were strong enough, you could push out your master and take his place." + a quiet ending */
export const PushOut: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const strong = w4(131, "strong");
  const push = w4(135, "push");
  const master = w4(138, "master");
  const take = w4(140, "take");
  const place = w4(142, "place");
  const walk = ip(f, [strong + 14, push], [0, 1]);
  const shove = ip(f, [push, master + 8], [0, 1], (x) => x * x);
  const sitting = f > take;
  const fade = ip(f, [to - 24, to], [1, 0]);
  return (
    <SceneSvg f={f}>
      <g opacity={fade}>
        <Camera cam={camAt(f, [[from, { x: 960, y: 540, z: 1.0 }], [place + 10, { x: 1100, y: 560, z: 1.06 }], [to, { x: 1150, y: 580, z: 1.12 }]])}>
          <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill={C.tan} opacity={0.4} />
          <Pencil d="M-600,880 H2700 V1500 H-600 Z" fill={C.straw} />
          {[0, 1, 2, 3].map((i) => (
            <Ink key={i} d={`M-600,${940 + i * 60} H2700`} sw={2.5} opacity={0.45} />
          ))}
          <Throne x={1300} y={900} s={0.9} />
          <Pencil d="M1120,160 h360 v100 h-360 Z" fill={C.white} sw={5} />
          <Label x={1300} y={232} text={sitting ? "NEW BOSS" : "BOSS"} size={66} font={FONT_TITLE} color={sitting ? C.red : INK} halo={false} />
          {/* the master, until he isn't */}
          <g transform={shove > 0 ? `translate(${shove * 900},${-Math.sin(shove * Math.PI) * 120}) rotate(${shove * 120},1300,780)` : undefined} opacity={1 - ip(shove, [0.7, 1], [0, 1])}>
            <Person x={1300} y={850} s={1.1} tribe="daimyo" f={f} sit expr={shove > 0 ? "shock" : "smile"} aL={shove > 0 ? 150 : 10} aR={shove > 0 ? 150 : 30} hold="fan" seed={6} flip />
          </g>
          {shove > 0.05 && shove < 0.9 ? <Ink d={`M${1300 + shove * 900 - 200},700 h-120 M${1300 + shove * 900 - 220},760 h-150 M${1300 + shove * 900 - 200},820 h-100`} sw={6} /> : null}
          {/* the strong servant */}
          {sitting ? (
            <Person x={1300} y={850} s={1.05} tribe="samurai" f={f} sit expr="grin" aR={140 + Math.sin(f / 4) * 10} hold="fan" seed={3} />
          ) : (
            <Person
              x={420 + walk * 640}
              y={940}
              s={1.0 + ip(f, [strong, strong + 10], [0, 0.12])}
              tribe="samurai"
              f={f}
              walk={walk > 0 && walk < 1 ? f * 0.6 : undefined}
              expr={f > strong ? "grin" : "smile"}
              aL={f > strong && f < strong + 14 ? 150 : 10}
              aR={f > strong && f < strong + 14 ? 150 : f > push - 4 ? 90 : 10}
              lean={f > push - 4 ? 16 : 0}
              seed={3}
            />
          )}
          <Label x={420} y={480} text="strong enough!" size={60} font={FONT_HAND} p={ip(f, [strong, strong + 12], [0, 1], (x) => x) * ip(f, [push - 6, push], [1, 0])} />
          <Bang x={1300} y={480} s={pop(f, push + 4) * (1 - ip(shove, [0.8, 1], [0, 1]))} n={2} />
          <Puff x={1300} y={820} p={ip(f, [take - 6, take + 12], [0, 1], (x) => x)} size={90} fill={C.tan} seed={3} />
          {sitting ? <Sparkle x={1480} y={420} s={pop(f, take + 4) * (0.8 + 0.2 * Math.sin(f / 4))} /> : null}
          {[300, 480].map((x, i) => (
            <Person key={i} x={x} y={950} s={0.8 * pop(f, place + 6 + i * 4)} tribe="guard" f={f} expr="nervous" lean={-14} seed={i + 8} />
          ))}
        </Camera>
      </g>
    </SceneSvg>
  );
};

