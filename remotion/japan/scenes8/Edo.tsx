import React from "react";
import { C, FONT_HAND, FONT_TITLE, ip } from "../theme";
import { Bang, Birds, Bubble, Camera, camAt, Cloud, DrawOn, ellipseD, Heart, Ink, Label, Pencil, pop, Pop, Puff, Question, Shade, shakeAt, Sparkle, Sun } from "../draw";
import { SceneSvg } from "../Stage";
import { MapArt, proj } from "../MapArt";
import { Person } from "../Person";
import { CherryTree, Manor, Petals, Scroll } from "../Props2";
import { Castle, Frame } from "../Props3";
import { Bulb, Flames, SmokeColumn, Townhouse } from "../Props4";
import { GunSmoke } from "../Props5";
import { BigDoors, Dejima, TokugawaCrest } from "../Props7";
import { Cannon, Coins, KabukiCurtain, Locomotive, MoneyBag, Procession, PuppetBar, Rifle, Steamship, Tracks, TricolorFlag, WavePrint } from "../Props8";
import { TitleScene } from "../scenes/Opening";
import { JapanChar } from "../scenes/Together";
import { Pennant, scr, SceneProps, Sea, TOKU } from "../scenes7/common";
import { w8 } from "../part8cues";

const EDO8 = proj(139.69, 35.69);

export const Title8: React.FC<{ f: number }> = ({ f }) => (
  <TitleScene
    f={f}
    subtitle="part 8 · 250 years of peace"
    doodles={
      <g>
        <Pop s={pop(f, 34)} x={1460} y={770}>
          <Steamship x={1460} y={770} s={0.22} f={f} />
        </Pop>
        <Pop s={pop(f, 44)} x={470} y={760}>
          <Pencil d="M420,780 h100 v-60 h-100 Z" fill={C.white} sw={3} />
          <Pencil d="M410,724 L470,690 L530,724 Z" fill="#4b4f5c" sw={3} />
        </Pop>
      </g>
    }
  />
);

/** "The shogun also had a clever way to control the daimyo." */
export const Control: React.FC<SceneProps> = ({ f, from, to }) => {
  const clever = w8(5, "clever");
  const control = w8(8, "control");
  const daimyo = w8(10, "daimyo");
  const sway = Math.sin(f / 9) * 24;
  const puppets: [number, number][] = [
    [1000, 940],
    [1300, 960],
    [1600, 940],
  ];
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 560, z: 1.0 }], [to, { x: 980, y: 560, z: 1.05 }]])}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#e9d7b0" opacity={0.4} />
        <Pencil d="M-600,940 H2700 V1500 H-600 Z" fill="#b89f7a" />
        <Pencil d="M240,940 h400 v-120 h-400 Z" fill={C.darkBrown} />
        <Person x={440} y={820} s={1.35} tribe="shogun" cloth={TOKU} f={f} expr="grin" aR={f > control ? 160 : 40} look={[1, -0.6]} seed={1} />
        <TokugawaCrest x={440} y={300} r={40 * pop(f, from + 4)} />
        {f > control - 4 ? (
          <g opacity={ip(f, [control - 4, control + 6], [0, 1])}>
            <PuppetBar x={1300} y={240} to={puppets.map(([x, y]) => [x, y - 310] as [number, number])} sway={sway} />
            <Ink d={`M560,${560} Q900,180 1180,240`} sw={2.5} dash="6 10" opacity={0.6} />
          </g>
        ) : null}
        {puppets.map(([x, y], i) => (
          <g key={i} transform={`rotate(${Math.sin(f / 9 + i) * 6},${x + sway},${y - 300})`}>
            <Person x={x + sway * 0.6} y={y - Math.abs(Math.sin(f / 6 + i)) * 20} s={1.0 * pop(f, daimyo - 8 + i * 3)} tribe="daimyo" f={f} aR={60 + Math.sin(f / 5 + i) * 40} aL={60 - Math.sin(f / 5 + i) * 40} expr="nervous" seed={i + 4} />
          </g>
        ))}
        <Bulb x={600} y={360} s={pop(f, clever) * ip(f, [control + 6, control + 12], [1, 0])} glow={1} />
      </Camera>
      <Label x={560} y={170} text="a clever way to control..." size={64} font={FONT_TITLE} color={TOKU} p={ip(f, [clever - 4, control + 8], [0, 1], (t) => t)} rot={-3} />
      <Label x={1340} y={330} text="the daimyo" size={60} font={FONT_HAND} p={ip(f, [daimyo, daimyo + 10], [0, 1], (t) => t)} />
    </SceneSvg>
  );
};

/** "Every other year, they had to live in the capital, Edo." */
export const ToEdo: React.FC<SceneProps> = ({ f, from, to }) => {
  const every = w8(11, "every");
  const capital = w8(20, "capital");
  const edo = w8(21, "edo");
  const cam = camAt(f, [[from, { x: 1250, y: 820, z: 1.55 }], [to, { x: 1280, y: 800, z: 1.65 }]]);
  const starts = [proj(130.6, 33.6), proj(132.5, 34.4), proj(134.2, 35.0), proj(135.8, 35.3), proj(136.9, 36.4), proj(140.3, 38.6), proj(140.9, 40.4)];
  const go = ip(f, [every - 4, edo], [0, 1]);
  const [ex, ey] = scr(cam, EDO8);
  const home = Math.floor((f - from) / 22) % 2 === 0;
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <MapArt f={f} />
        {starts.map(([x, y], i) => {
          const mx = (x + EDO8[0]) / 2;
          const my = Math.min(y, EDO8[1]) - 40;
          const t = Math.max(0, Math.min(1, go * 1.3 - i * 0.05));
          const px = (1 - t) * (1 - t) * x + 2 * (1 - t) * t * mx + t * t * EDO8[0];
          const py = (1 - t) * (1 - t) * y + 2 * (1 - t) * t * my + t * t * EDO8[1];
          return (
            <g key={i}>
              <DrawOn d={`M${x},${y} Q${mx},${my} ${EDO8[0]},${EDO8[1]}`} p={t} sw={3} color={C.red} dotted />
              <path d={ellipseD(x, y, 4)} fill="#2b2b35" />
              {t > 0 && t < 1 ? <path d={ellipseD(px, py, 6)} fill={C.yellow} stroke="#1f2a55" strokeWidth={2} /> : null}
            </g>
          );
        })}
        <Pop s={pop(f, capital) * 1.2} x={EDO8[0]} y={EDO8[1]}>
          <path d={`M${EDO8[0]},${EDO8[1] - 18} l5,12 l13,1 l-10,8 l4,13 l-12,-7 l-12,7 l4,-13 l-10,-8 l13,-1 Z`} fill={C.red} stroke="#1f2a55" strokeWidth={2} />
        </Pop>
      </Camera>
      <Label x={ex + 40} y={ey - 60} text="EDO" size={92} font={FONT_TITLE} color={C.red} anchor="start" p={ip(f, [edo - 4, edo + 6], [0, 1], (t) => t)} />
      <Label x={ex + 44} y={ey + 6} text="(the capital)" size={44} font={FONT_HAND} anchor="start" p={ip(f, [capital, capital + 10], [0, 1], (t) => t)} />
      <Pop s={pop(f, every)} x={330} y={240} rot={-4}>
        <Pencil d="M110,130 h440 v220 h-440 Z" fill={C.white} sw={5} />
        <Label x={330} y={200} text="every other year:" size={42} font={FONT_HAND} halo={false} />
        <Label x={220} y={290} text="home" size={58} font={FONT_TITLE} color={home ? C.darkGreen : "#c9c2b0"} halo={false} />
        <Ink d="M290,262 h80 l-14,-10 M370,282 h-80 l14,10" sw={4} />
        <Label x={445} y={290} text="Edo" size={58} font={FONT_TITLE} color={home ? "#c9c2b0" : C.red} halo={false} />
      </Pop>
    </SceneSvg>
  );
};

/** "And their wives and children had to stay in Edo all the time." */
export const Hostages: React.FC<SceneProps> = ({ f, from, to }) => {
  const wives = w8(24, "wives");
  const children = w8(26, "children");
  const all = w8(32, "all");
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 580, z: 1.0 }], [to, { x: 960, y: 600, z: 1.06 }]])}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill={C.sky} opacity={0.25} />
        <Pencil d="M-600,900 H2700 V1500 H-600 Z" fill="#cdb98f" />
        <Manor x={900} y={900} s={1.6} />
        <Person x={760} y={940} s={1.2 * pop(f, wives - 4)} tribe="lady" f={f} expr="smile" aR={f > all ? 150 : 20} seed={3} />
        <Person x={920} y={950} s={0.7 * pop(f, children - 4)} tribe="lady" f={f} expr="happy" aR={150} seed={5} />
        <Person x={1040} y={950} s={0.7 * pop(f, children)} tribe="merchant" cloth={C.lightIndigo} f={f} expr="grin" aR={140} seed={6} />
        <Person x={1500} y={950} s={1.25} tribe="samurai" cloth={TOKU} f={f} flip hold="spear" aR={20} expr="neutral" seed={2} />
      </Camera>
      <Label x={960} y={170} text="wives & children" size={74} font={FONT_TITLE} color="#b0506a" p={ip(f, [wives - 2, children + 10], [0, 1], (t) => t)} rot={-3} />
      <Label x={960} y={260} text="in Edo ALL the time" size={62} font={FONT_HAND} p={ip(f, [all - 10, all + 8], [0, 1], (t) => t)} rot={-3} />
    </SceneSvg>
  );
};

/** "So if a daimyo turned against the shogun, his family would be in danger." */
export const Danger: React.FC<SceneProps> = ({ f, from, to }) => {
  const turned = w8(39, "turned");
  const shogun = w8(42, "shogun");
  const family = w8(44, "family");
  const danger = w8(48, "danger");
  const angry = f > turned && f < family + 6;
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 560, z: 1.0 }], [to, { x: 960, y: 580, z: 1.06 }]])}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill={f > danger ? "#d9a0a0" : C.sky} opacity={0.3} />
        <Pencil d="M-600,900 H2700 V1500 H-600 Z" fill={C.moss} />
        <Castle x={1500} y={900} s={0.75} />
        <Pennant x={1500} y={430} s={pop(f, shogun) * 1.6} color={TOKU} />
        <Person x={520} y={950} s={1.45} tribe="daimyo" f={f} hold="katana" aR={angry ? 160 : 40} expr={f > family + 6 ? "nervous" : angry ? "angry" : "neutral"} look={f > family + 6 ? [-1, 0] : [1, 0]} seed={4} />
        <Pop s={pop(f, family)} x={420} y={380}>
          <Frame x={300} y={380} w={300} h={260}>
            <Person x={250} y={500} s={0.7} tribe="lady" f={f} expr="worry" seed={3} />
            <Person x={350} y={500} s={0.45} tribe="lady" f={f} expr="worry" seed={5} />
          </Frame>
        </Pop>
      </Camera>
      <Label x={1000} y={200} text="turned against the shogun?" size={60} font={FONT_HAND} p={ip(f, [turned - 2, shogun + 10], [0, 1], (t) => t) * ip(f, [danger - 6, danger], [1, 0])} />
      <Label x={1000} y={210} text="DANGER!" size={130} font={FONT_TITLE} color={C.red} p={ip(f, [danger, danger + 6], [0, 1], (t) => t)} rot={-5} />
    </SceneSvg>
  );
};

/** "And all that traveling cost so much money that no daimyo could afford a war." */
export const Cost: React.FC<SceneProps> = ({ f, from, to }) => {
  const traveling = w8(52, "traveling");
  const money = w8(56, "money");
  const no = w8(58, "no");
  const war = w8(63, "war");
  const walk = ip(f, [from, to], [0, 1], (x) => x);
  const full = ip(f, [traveling, no + 6], [1, 0]);
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 560, z: 1.0 }], [to, { x: 960, y: 560, z: 1.04 }]])}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill={C.sky} opacity={0.25} />
        <Pencil d="M-600,760 Q300,700 1000,740 T2700,720 L2700,1500 L-600,1500 Z" fill={C.moss} />
        <Pencil d="M-600,860 H2700 V1500 H-600 Z" fill="#cdb98f" />
        <Procession x={2300 - walk * 500} y={930} n={12} s={1.5} f={f} />
        <MoneyBag x={700} y={950} s={1.5 * pop(f, traveling - 6)} full={full} />
        <Coins x={700} y={760} f={f} on={f > money - 6 && f < no + 10} />
        <Person x={420} y={940} s={1.35} tribe="daimyo" f={f} expr={f > no ? "tired" : "worry"} aR={f > no ? 100 : 30} aL={f > no ? 100 : 20} seed={4} />
        <Pop s={pop(f, war - 4)} x={420} y={420}>
          <Pencil d={ellipseD(420, 420, 110)} fill={C.white} sw={5} />
          <g transform="translate(420,420) rotate(-40)">
            <Pencil d="M-80,-6 L80,-8 Q90,0 80,6 L-80,6 Z" fill="#dfe3e8" sw={3} />
          </g>
          <Ink d="M340,340 L500,500" sw={12} color={C.red} />
        </Pop>
      </Camera>
      <Label x={1300} y={260} text="so much money!" size={70} font={FONT_TITLE} color="#8a6a10" p={ip(f, [money - 6, money + 8], [0, 1], (t) => t)} rot={-3} />
      <Label x={560} y={170} text="no money for war" size={74} font={FONT_TITLE} color={C.red} p={ip(f, [no, war + 8], [0, 1], (t) => t)} rot={-3} />
    </SceneSvg>
  );
};

/** "The result was about 250 years of peace, from 1600 to 1868." */
export const Peace: React.FC<SceneProps> = ({ f, from, to }) => {
  const result = w8(65, "result");
  const two = w8(68, "two");
  const peace = w8(72, "peace");
  const sixteen = w8(74, "sixteen");
  const eighteen = w8(77, "eighteen");
  const fill = ip(f, [sixteen, eighteen + 16], [0, 1]);
  const year = Math.round(1600 + fill * 268);
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 560, z: 1.0 }], [to, { x: 960, y: 580, z: 1.05 }]])}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#f6dfe0" opacity={0.4} />
        <Sun x={1700} y={160} r={56} f={f} />
        <Pencil d="M-600,880 H2700 V1500 H-600 Z" fill={C.green} />
        <CherryTree x={300} y={880} s={1.1} />
        <CherryTree x={1650} y={880} s={1.0} />
        <Petals f={f} n={20} />
        <Birds x={900} y={260} f={f} n={4} />
        <Person x={800} y={930} s={1.1} tribe="yayoi" f={f} expr="happy" hold="rice" aR={30} seed={3} />
        <Person x={1000} y={930} s={1.1} tribe="lady" f={f} expr="happy" aR={20} seed={4} />
        <Person x={1180} y={940} s={0.7} tribe="merchant" cloth={C.lightIndigo} f={f} expr="grin" aR={150} seed={5} walk={f * 0.4} />
      </Camera>
      {/* the timeline */}
      <g opacity={ip(f, [result - 4, result + 6], [0, 1])}>
        <Pencil d="M360,380 h1200 v50 h-1200 Z" fill={C.white} sw={5} />
        <Pencil d={`M366,386 h${1188 * fill} v38 h${-1188 * fill} Z`} fill={C.green} ink={false} />
        <Label x={360} y={490} text="1600" size={54} font={FONT_TITLE} p={ip(f, [sixteen - 2, sixteen + 6], [0, 1], (t) => t)} />
        <Label x={1560} y={490} text="1868" size={54} font={FONT_TITLE} p={ip(f, [eighteen - 2, eighteen + 6], [0, 1], (t) => t)} />
        {fill > 0 && fill < 1 ? <Label x={366 + 1188 * fill} y={360} text={`${year}`} size={40} font={FONT_HAND} /> : null}
      </g>
      <Label x={960} y={190} text="250 years of PEACE" size={96} font={FONT_TITLE} color={C.darkGreen} p={ip(f, [two - 2, peace + 8], [0, 1], (t) => t)} rot={-2} />
    </SceneSvg>
  );
};

/** "This time is called the Edo period." */
export const EdoPeriod: React.FC<SceneProps> = ({ f, from, to }) => {
  const called = w8(83, "called");
  const edo = w8(85, "edo");
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 560, z: 1.05 }], [to, { x: 960, y: 560, z: 1.0 }]])}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill={C.sky} opacity={0.3} />
        <Pencil d="M1100,700 L1450,300 L1800,700 Z" fill={C.lightIndigo} sw={4} />
        <Pencil d="M1380,380 L1450,300 L1520,380 L1490,370 L1470,390 L1450,370 L1420,392 Z" fill={C.white} sw={3} />
        <Pencil d="M-600,820 H2700 V1500 H-600 Z" fill="#cdb98f" />
        {new Array(9).fill(0).map((_, i) => (
          <Townhouse key={i} x={60 + i * 230} y={860} s={0.85} seed={i + 1} />
        ))}
        <Castle x={1500} y={700} s={0.5} />
      </Camera>
      <Scroll x={960} y={300} w={1000} h={190} p={ip(f, [called - 4, edo + 8], [0, 1])}>
        <g>
          <Label x={960} y={300} text="THE EDO PERIOD" size={110} font={FONT_TITLE} color={C.red} halo={false} />
          <Label x={960} y={370} text="1600 - 1868" size={50} font={FONT_HAND} halo={false} />
        </g>
      </Scroll>
    </SceneSvg>
  );
};

/** "Cities grew, and traders got rich." */
export const Cities: React.FC<SceneProps> = ({ f, from, to }) => {
  const cities = w8(87, "cities");
  const traders = w8(90, "traders");
  const rich = w8(92, "rich");
  const n = Math.round(ip(f, [cities - 4, traders], [3, 11], (x) => x));
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 560, z: 1.0 }], [to, { x: 960, y: 560, z: 0.95 }]])}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#f2cf8a" opacity={0.3} />
        <Pencil d="M-600,760 H2700 V1500 H-600 Z" fill="#cdb98f" />
        {new Array(n).fill(0).map((_, i) => (
          <Pop key={i} s={pop(f, cities - 4 + i * 2)} x={-60 + i * 210} y={760}>
            <Townhouse x={-60 + i * 210} y={760} s={0.75 - (i % 2) * 0.08} seed={i + 2} />
          </Pop>
        ))}
        {[0, 1, 2, 3].map((i) => (
          <Person key={i} x={300 + i * 330} y={930 + (i % 2) * 14} s={0.9} tribe={i % 2 ? "lady" : "yayoi"} f={f} walk={f * 0.4 + i} flip={i % 2 === 1} expr="happy" seed={i + 3} />
        ))}
        <Person x={1560} y={940} s={1.3 * pop(f, traders - 6)} tribe="merchant" f={f} expr="grin" hold="coins" aR={f > rich ? 150 : 60} seed={6} />
        <MoneyBag x={1760} y={940} s={1.1 * pop(f, rich - 2)} />
        <Sparkle x={1700} y={600} s={pop(f, rich + 4) * (0.8 + 0.2 * Math.sin(f / 4))} />
      </Camera>
      <Label x={560} y={180} text="cities grew" size={86} font={FONT_TITLE} p={ip(f, [cities - 2, cities + 10], [0, 1], (t) => t)} rot={-3} />
      <Label x={1420} y={260} text="traders got rich!" size={70} font={FONT_TITLE} color="#8a6a10" p={ip(f, [traders, rich + 8], [0, 1], (t) => t)} rot={-3} />
    </SceneSvg>
  );
};

/** "New kinds of art, like kabuki theatre and ukiyo-e prints, became popular." */
export const Art: React.FC<SceneProps> = ({ f, from, to }) => {
  const art = w8(96, "art");
  const kabuki = w8(98, "kabuki");
  const ukiyoe = w8(101, "ukiyoe");
  const popular = w8(104, "popular");
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 560, z: 1.0 }], [to, { x: 960, y: 580, z: 1.05 }]])}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#e9d7b0" opacity={0.4} />
        {/* kabuki stage */}
        <Pencil d="M120,820 h760 v-520 h-760 Z" fill="#c9a272" />
        <Person x={500} y={820} s={1.5} tribe="kabuki" f={f} aR={f > kabuki + 10 ? 160 : 120} aL={50} expr="angry" look={[0.6, 0]} seed={3} />
        <KabukiCurtain x0={120} x1={880} y0={300} y1={820} open={ip(f, [kabuki - 6, kabuki + 14], [0, 1])} />
        <Pencil d="M100,300 h800 v-50 h-800 Z" fill={C.darkBrown} sw={4} />
        <Pencil d="M80,820 h840 v40 h-840 Z" fill={C.darkBrown} sw={4} />
        {/* ukiyo-e print */}
        <Pop s={pop(f, ukiyoe)} x={1420} y={520} rot={3}>
          <WavePrint x={1420} y={520} s={1.25} />
        </Pop>
        {/* the audience */}
        {new Array(8).fill(0).map((_, i) => (
          <Pencil key={i} d={ellipseD(160 + i * 230, 920 + (i % 2) * 14, 48, 44)} fill={i % 3 ? C.hair : "#5a4636"} sw={3} />
        ))}
        {f > popular
          ? [0, 1, 2, 3, 4].map((i) => <Heart key={i} x={300 + i * 330} y={880 - ((f - popular + i * 7) % 30) * 6} s={0.9} color={C.pink} />)
          : null}
      </Camera>
      <Label x={500} y={200} text="kabuki" size={84} font={FONT_TITLE} color="#d9673c" p={ip(f, [kabuki, kabuki + 8], [0, 1], (t) => t)} rot={-3} />
      <Label x={1420} y={180} text="ukiyo-e prints" size={70} font={FONT_TITLE} color="#2f4f8f" p={ip(f, [ukiyoe, ukiyoe + 10], [0, 1], (t) => t)} rot={-3} />
      <Label x={960} y={120} text="new kinds of art" size={56} font={FONT_HAND} p={ip(f, [art - 6, art + 8], [0, 1], (t) => t) * ip(f, [kabuki - 6, kabuki], [1, 0])} />
    </SceneSvg>
  );
};

/** "But while Japan stayed closed, the rest of the world raced ahead." */
export const RacedAhead: React.FC<SceneProps> = ({ f, from, to }) => {
  const closed = w8(109, "closed");
  const world = w8(114, "world");
  const raced = w8(115, "raced");
  const run = ip(f, [raced - 6, to], [0, 1], (x) => x * x);
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 560, z: 1.0 }], [to, { x: 1060, y: 560, z: 1.0 }]])}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill={C.sky} opacity={0.25} />
        <Pencil d="M-600,880 H2700 V1500 H-600 Z" fill="#c98f5a" />
        <Ink d="M-600,960 H2700 M-600,1040 H2700" sw={3} color={C.white} opacity={0.8} />
        <Ink d="M560,880 L560,1100" sw={6} color={C.white} />
        <Label x={560} y={860} text="START" size={40} font={FONT_TITLE} />
        {/* Japan, behind its door, having tea */}
        <Pencil d="M120,880 h340 v-420 h-340 Z" fill="#8a5a3a" sw={5} />
        <Ink d="M290,880 L290,460" sw={4} />
        <JapanChar f={f} x={290} y={420} s={0.2} expr={f > raced ? "shock" : "sleep"} armR={20} armL={20} />
        <Label x={290} y={380} text={f > closed ? "zzz" : ""} size={44} font={FONT_HAND} p={1} />
        {/* the world runs off */}
        <Person x={700 + run * 1500} y={940} s={1.3} tribe="european" skin="#f6d6c0" f={f} walk={f > raced - 6 ? f * 0.9 : undefined} lean={f > raced - 6 ? 14 : 0} expr="grin" seed={2} />
        {run > 0 ? <Ink d={`M${560 + run * 1500},860 h-160 M${540 + run * 1500},900 h-200 M${560 + run * 1500},820 h-120`} sw={5} opacity={0.5} /> : null}
        {run > 0 ? <Puff x={600 + run * 1500} y={930} p={((f % 14) / 14)} size={50} fill={C.tan} seed={2} /> : null}
      </Camera>
      <Label x={330} y={190} text="Japan: closed" size={64} font={FONT_TITLE} color="#8a5a3a" p={ip(f, [closed - 4, closed + 8], [0, 1], (t) => t)} rot={-3} />
      <Label x={1340} y={230} text="the world raced ahead!" size={70} font={FONT_TITLE} color={C.indigo} p={ip(f, [world, raced + 10], [0, 1], (t) => t)} rot={-3} />
    </SceneSvg>
  );
};

/** "Europe went through revolutions, and it built steam engines, railways and modern rifles." */
export const Europe: React.FC<SceneProps> = ({ f, from, to }) => {
  const europe = w8(117, "europe");
  const revolutions = w8(120, "revolutions");
  const steam = w8(124, "steam");
  const railways = w8(126, "railways");
  const rifles = w8(129, "rifles");
  const train = ip(f, [steam - 10, to], [0, 1], (x) => x);
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 560, z: 1.0 }], [to, { x: 960, y: 560, z: 1.03 }]])}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#c9c2b0" opacity={0.4} />
        {[1300, 1460, 1620].map((cx, i) => (
          <g key={cx}>
            <Pencil d={`M${cx},700 h60 v-${300 + i * 40} h-60 Z`} fill="#8a4a3a" sw={3} />
            <SmokeColumn x={cx + 30} y={400 - i * 40} f={f + i * 10} s={0.6} seed={i} opacity={0.8} />
          </g>
        ))}
        <Pencil d="M1200,700 h560 v-200 h-560 Z" fill="#a0604a" />
        <Pencil d="M-600,840 H2700 V1500 H-600 Z" fill="#a89a7a" />
        <Tracks x0={-600} x1={2700} y={900} />
        <Pop s={pop(f, revolutions - 4)} x={300} y={760}>
          <TricolorFlag x={260} y={800} s={1.1} f={f} />
          {[0, 1, 2].map((i) => (
            <Person key={i} x={160 + i * 140} y={850} s={0.75} tribe="european" skin="#f6d6c0" f={f} aR={150} expr="grin" seed={i + 4} />
          ))}
        </Pop>
        <Locomotive x={-500 + train * 1500} y={900} s={0.95} f={f} />
        <Pop s={pop(f, rifles)} x={1500} y={560}>
          <Rifle x={1500} y={520} s={1.4} rot={-10} />
          <Rifle x={1520} y={600} s={1.4} rot={-10} />
        </Pop>
      </Camera>
      <Label x={960} y={150} text="EUROPE" size={110} font={FONT_TITLE} color={C.indigo} p={ip(f, [europe - 2, europe + 8], [0, 1], (t) => t)} rot={-2} />
      <Label x={330} y={300} text="revolutions" size={56} font={FONT_HAND} p={ip(f, [revolutions, revolutions + 10], [0, 1], (t) => t)} />
      <Label x={760} y={560} text="steam engines & railways" size={56} font={FONT_HAND} p={ip(f, [steam, railways + 10], [0, 1], (t) => t)} rot={-3} />
      <Label x={1500} y={330} text="modern rifles" size={56} font={FONT_HAND} p={ip(f, [rifles - 4, rifles + 8], [0, 1], (t) => t)} />
    </SceneSvg>
  );
};

/** "And what was Japan doing? Holding tea ceremonies. 'Is this how we make tea? No, no, this is how we make tea!'" */
export const TeaTime: React.FC<SceneProps> = ({ f, from, to }) => {
  const what = w8(131, "what");
  const holding = w8(135, "holding");
  const is = w8(138, "is");
  const no1 = w8(144, "no");
  const this2 = w8(146, "this");
  const whisking = f > this2;
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 560, z: 1.0 }], [to, { x: 960, y: 600, z: 1.1 }]])}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#e9d7b0" opacity={0.5} />
        <Pencil d="M-600,880 H2700 V1500 H-600 Z" fill="#cdbb7a" />
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <Ink key={k} d={`M${-200 + k * 460},880 L${-500 + k * 560},1200`} sw={3} opacity={0.35} />
        ))}
        <Pencil d="M300,860 h1320 v-560 h-1320 Z" fill={C.white} />
        {[1, 2, 3, 4, 5].map((k) => (
          <Ink key={k} d={`M${300 + k * 220},860 v-560`} sw={3} opacity={0.5} />
        ))}
        <Pencil d={ellipseD(1500, 420, 70)} fill={C.white} sw={4} />
        <Ink d={`M1500,420 L${1500 + Math.sin(f * 0.3) * 50},${420 - Math.cos(f * 0.3) * 50} M1500,420 L1500,380`} sw={4} />
        <Person x={620} y={950} s={1.3} tribe="daimyo" f={f} sit hold="teabowl" aR={100} expr={f > no1 ? "worry" : "smile"} look={[1, 0]} seed={4} />
        <Person x={1260} y={950} s={1.3} tribe="daimyo" cloth="#7a5aa0" f={f} sit flip hold="whisk" aR={whisking ? 100 + Math.sin(f * 1.4) * 25 : 60} expr={f > no1 ? "angry" : "smile"} look={[-1, 0]} seed={5} />
        <Pencil d={ellipseD(940, 870, 46, 22)} fill={C.darkGreen} sw={3} />
      </Camera>
      <Label x={960} y={150} text="and Japan?" size={80} font={FONT_TITLE} p={ip(f, [what, what + 10], [0, 1], (t) => t) * ip(f, [holding - 6, holding], [1, 0])} />
      <Label x={960} y={150} text="TEA CEREMONIES" size={96} font={FONT_TITLE} color={C.darkGreen} p={ip(f, [holding, holding + 12], [0, 1], (t) => t)} rot={-2} />
      <Bubble x={560} y={330} w={520} h={110} text="Is this how we make tea?" s={pop(f, is) * ip(f, [this2 + 20, this2 + 26], [1, 1])} tail={[620, 500]} size={46} fill={C.white} />
      <Bubble x={1340} y={330} w={520} h={140} text={f > this2 ? "THIS is how\nwe make tea!" : "No, no!"} s={pop(f, no1)} tail={[1280, 500]} size={48} />
    </SceneSvg>
  );
};

/** "The Dutch warned Japan again and again, but Japan did not listen." */
export const Warned: React.FC<SceneProps> = ({ f, from, to }) => {
  const warned = w8(154, "warned");
  const again1 = w8(156, "again");
  const again2 = w8(158, "again");
  const not = w8(162, "not");
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 560, z: 1.0 }], [to, { x: 960, y: 560, z: 1.04 }]])}>
        <Shade d="M-800,-400 H3000 V1500 H-800 Z" fill={C.sky} opacity={0.3} />
        <Sea f={f} y={700} />
        <Dejima x={420} y={760} s={0.7} f={f} />
        <Person x={520} y={700} s={1.0} tribe="dutch" skin="#f6d6c0" f={f} hold="megaphone" aR={95} expr="shock" seed={5} />
        <Pencil d="M1100,1100 L1140,760 L3000,760 L3000,1100 Z" fill={C.green} />
        <Person x={1500} y={850} s={1.4} tribe="daimyo" f={f} flip sit hold="teabowl" aR={f > not ? 160 : 100} aL={f > not ? 160 : 10} expr={f > not ? "tired" : "smile"} seed={4} />
      </Camera>
      <Bubble x={620} y={250} w={460} h={110} text="Warships are coming!" s={pop(f, warned)} tail={[560, 380]} size={46} />
      <Bubble x={1040} y={420} w={300} h={100} text="Get ready!" s={pop(f, again1)} tail={[760, 520]} size={46} />
      <Bubble x={980} y={150} w={320} h={100} text="PLEASE!!" s={pop(f, again2)} tail={[800, 300]} size={52} />
      <Label x={1520} y={420} text="la la la..." size={60} font={FONT_HAND} p={ip(f, [not - 4, not + 10], [0, 1], (t) => t)} rot={6} />
    </SceneSvg>
  );
};

/** "Soon, a single Western warship could destroy towns along Japan's coast." */
export const Warship: React.FC<SceneProps> = ({ f, from, to }) => {
  const single = w8(166, "single");
  const destroy = w8(170, "destroy");
  const coast = w8(174, "coast");
  const burn = ip(f, [destroy + 6, coast], [0, 1]);
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 1000, y: 560, z: 1.0 }], [to, { x: 940, y: 560, z: 0.96 }]])} shake={shakeAt(f, ip(f, [destroy, destroy + 4], [0, 1]) * ip(f, [destroy + 4, destroy + 20], [1, 0]) * 0.5)}>
        <Shade d="M-800,-400 H3000 V1500 H-800 Z" fill={burn > 0 ? "#e9a07a" : C.sky} opacity={0.3} />
        <Sea f={f} y={760} />
        <Pencil d="M-800,1100 L-800,740 L760,740 Q840,760 860,1100 Z" fill={C.straw} />
        {[0, 1, 2, 3].map((i) => (
          <Townhouse key={i} x={60 + i * 200} y={750} s={0.7} seed={i + 1} burnt={burn > 0.4 + i * 0.12 ? 1 : burn * 0.8} />
        ))}
        {[0, 1, 2].map((i) => (
          <Flames key={i} x={120 + i * 240} y={740} s={0.7 * pop(f, destroy + 10 + i * 6)} f={f} seed={i + 2} />
        ))}
        <Steamship x={1480} y={830} s={1.0} f={f} guns={ip(f, [single, destroy], [0, 1])} flag="uk" tilt={Math.sin(f / 10) * 1.5} />
        {[0, 1, 2].map((i) => (
          <GunSmoke key={i} x={1150 - i * 60} y={800} p={ip(f, [destroy + i * 5, destroy + 20 + i * 5], [0, 1], (t) => t)} />
        ))}
        <Bang x={420} y={460} s={pop(f, destroy + 8)} n={3} />
      </Camera>
      <Label x={1360} y={190} text="ONE warship" size={96} font={FONT_TITLE} color="#2b2b35" p={ip(f, [single - 2, single + 10], [0, 1], (t) => t)} rot={-3} />
    </SceneSvg>
  );
};

/** "And a samurai with a sword could do nothing against cannons." */
export const SamuraiVsCannon: React.FC<SceneProps> = ({ f, from, to }) => {
  const samurai = w8(177, "samurai");
  const nothing = w8(183, "nothing");
  const cannons = w8(185, "cannons");
  const blast = ip(f, [nothing, nothing + 26], [0, 1], (x) => x);
  const blown = f > nothing + 2;
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 560, z: 1.05 }], [to, { x: 960, y: 560, z: 1.0 }]])} shake={shakeAt(f, ip(f, [nothing, nothing + 3], [0, 1]) * ip(f, [nothing + 3, nothing + 18], [1, 0]) * 0.6)}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill={C.sky} opacity={0.25} />
        <Pencil d="M-600,880 H2700 V1500 H-600 Z" fill={C.moss} />
        <Person x={blown ? 600 - Math.min(1, blast * 3) * 140 : 600} y={940} s={1.45} tribe="samurai" f={f} hold="katana" aR={blown ? 60 : 150} lean={blown ? -12 : 0} expr={blown ? "shock" : "angry"} seed={2} />
        <Cannon x={1420} y={940} s={1.5} flip fire={blast} />
        {blown ? (
          <g opacity={ip(f, [nothing + 4, nothing + 10], [0, 1])}>
            {[0, 1, 2, 3].map((i) => (
              <Ink key={i} d={`M${520 + i * 30},${640 + (i % 2) * 20} q-20,-10 -40,0`} sw={4} color={C.darkGray} />
            ))}
          </g>
        ) : null}
        <Puff x={560} y={760} p={ip(f, [nothing + 4, nothing + 24], [0, 1], (t) => t)} size={120} fill={C.gray} seed={4} />
      </Camera>
      <Label x={560} y={240} text="a samurai with a sword..." size={60} font={FONT_HAND} p={ip(f, [samurai - 4, samurai + 16], [0, 1], (t) => t)} rot={-3} />
      <Label x={1360} y={220} text="vs CANNONS" size={96} font={FONT_TITLE} color={C.red} p={ip(f, [cannons - 6, cannons + 6], [0, 1], (t) => t)} rot={-3} />
    </SceneSvg>
  );
};

/** "The door was closed. But someone was about to break it open." */
export const Knock: React.FC<SceneProps> = ({ f, from, to }) => {
  const closed = w8(189, "closed");
  const someone = w8(191, "someone");
  const brk = w8(195, "break");
  const open = w8(197, "open");
  const knocks = [someone + 6, someone + 18, brk - 6, brk + 2, open];
  const k = knocks.filter((t) => f > t).length;
  const lastKnock = knocks.filter((t) => f > t).pop() ?? -100;
  const jolt = ip(f, [lastKnock, lastKnock + 6], [1, 0]);
  return (
    <SceneSvg f={f}>
      <Camera cam={{ x: 960, y: 540, z: 1.0 }} shake={shakeAt(f, jolt * 0.35 * Math.min(1, k / 2))}>
        <BigDoors p={1} />
        <Pop s={pop(f, closed - 4)} x={960} y={420}>
          <Pencil d="M760,360 h400 v120 h-400 Z" fill="#f4e7c4" sw={5} />
          <Label x={960} y={440} text="CLOSED" size={80} font={FONT_TITLE} color={C.red} halo={false} />
        </Pop>
        {k >= 3 ? <DrawOn d="M960,0 L930,160 L990,260 L940,380" p={ip(f, [knocks[2], knocks[2] + 8], [0, 1])} sw={6} color="#2b2b35" /> : null}
        {k >= 4 ? <DrawOn d="M960,1080 L1000,900 L940,800 L980,680" p={ip(f, [knocks[3], knocks[3] + 8], [0, 1])} sw={6} color="#2b2b35" /> : null}
        {k >= 5 ? <DrawOn d="M960,540 L700,420 M960,540 L1240,640 M960,540 L760,760 M960,540 L1180,330" p={ip(f, [knocks[4], knocks[4] + 8], [0, 1])} sw={6} color="#2b2b35" /> : null}
      </Camera>
      {knocks.map((t, i) => (
        <Label key={i} x={[1500, 1600, 1450, 1580, 1500][i]} y={[260, 420, 600, 760, 900][i]} text="KNOCK!" size={64 + i * 8} font={FONT_TITLE} color={C.red} p={ip(f, [t, t + 3], [0, 1], (x) => x)} rot={[-8, 6, -4, 8, -6][i]} />
      ))}
      <Label x={420} y={300} text="someone..." size={70} font={FONT_HAND} p={ip(f, [someone, someone + 10], [0, 1], (t) => t)} />
    </SceneSvg>
  );
};

/** "In 1853, American warships sailed up to Japan's coast. They had big guns," */
export const BlackShips: React.FC<SceneProps> = ({ f, from, to }) => {
  const year = w8(199, "eighteen");
  const american = w8(202, "american");
  const sailed = w8(204, "sailed");
  const big = w8(211, "big");
  const sail = ip(f, [american - 10, big], [0, 1]);
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 560, z: 1.0 }], [to, { x: 900, y: 580, z: 1.06 }]])}>
        <Shade d="M-800,-400 H3000 V1500 H-800 Z" fill="#c9cdd2" opacity={0.4} />
        <Cloud x={600} y={180} w={300} h={90} seed={2} fill="#9a9aa4" />
        <Cloud x={1400} y={140} w={260} h={80} seed={5} fill="#9a9aa4" />
        <Sea f={f} y={720} color={C.deepSea} />
        <Pencil d="M-800,1100 L-800,760 L380,760 Q460,780 480,1100 Z" fill={C.straw} />
        {[0, 1, 2].map((i) => (
          <Person key={i} x={80 + i * 140} y={880} s={1.0} tribe={i === 1 ? "samurai" : "yayoi"} f={f} expr={f > sailed ? "shock" : "neutral"} aR={f > sailed && i !== 1 ? 110 : 20} look={[1, 0]} seed={i + 3} />
        ))}
        {[0, 1, 2].map((i) => (
          <Steamship key={i} x={2400 - sail * (1200 - i * 320) + i * 120} y={820 - i * 60} s={0.6 - i * 0.12} f={f + i * 9} guns={ip(f, [big - 4, big + 8], [0, 1])} tilt={Math.sin(f / 10 + i) * 1.5} />
        ))}
      </Camera>
      <Pop s={pop(f, year, 200, 10)} x={300} y={200} rot={-8}>
        <Pencil d={ellipseD(300, 200, 150, 96)} fill={C.white} sw={5} />
        <Label x={300} y={236} text="1853" size={110} font={FONT_TITLE} color={C.red} halo={false} />
      </Pop>
      <Label x={1200} y={190} text="AMERICAN WARSHIPS" size={84} font={FONT_TITLE} color="#22305a" p={ip(f, [american - 2, american + 12], [0, 1], (t) => t)} rot={-3} />
      <Label x={1200} y={270} text="(Japan called them the black ships)" size={44} font={FONT_HAND} p={ip(f, [sailed, sailed + 16], [0, 1], (t) => t)} />
      <Label x={1360} y={420} text="BIG GUNS" size={90} font={FONT_TITLE} color={C.red} p={ip(f, [big, big + 6], [0, 1], (t) => t)} rot={-6} />
    </SceneSvg>
  );
};

/** "...and they gave Japan a choice. Open your doors, or face the cannons." */
export const Choice: React.FC<SceneProps> = ({ f, from, to }) => {
  const choice = w8(218, "choice");
  const openW = w8(219, "open");
  const face = w8(223, "face");
  return (
    <SceneSvg f={f}>
      <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#e9d7b0" opacity={0.4} />
      <Pop s={pop(f, choice - 4)} x={420} y={520}>
        <Pencil d="M170,250 h500 v540 h-500 Z" fill={f > openW && f < face ? "#dff0d0" : C.white} sw={6} />
        <Pencil d="M260,720 h150 v-360 h-150 Z" fill="#8a5a3a" sw={4} />
        <Pencil d="M410,720 l110,-60 v-240 l-110,-60 Z" fill="#b07a4a" sw={4} />
        <Label x={420} y={300} text="OPEN YOUR DOORS" size={46} font={FONT_TITLE} color={C.darkGreen} halo={false} />
      </Pop>
      <Pop s={pop(f, choice)} x={1500} y={520}>
        <Pencil d="M1250,250 h500 v540 h-500 Z" fill={f > face ? "#f4d0c8" : C.white} sw={6} />
        <Cannon x={1480} y={700} s={0.9} flip />
        <Label x={1500} y={300} text="FACE THE CANNONS" size={46} font={FONT_TITLE} color={C.red} halo={false} />
      </Pop>
      <JapanChar f={f} x={960} y={600} s={0.32} expr={f > face ? "shock" : "worry"} armR={60} armL={60} />
      <Label x={960} y={150} text="a choice:" size={90} font={FONT_TITLE} p={ip(f, [choice - 4, choice + 8], [0, 1], (t) => t)} rot={-3} />
      <Label x={960} y={880} text="or" size={70} font={FONT_HAND} p={ip(f, [face - 10, face], [0, 1], (t) => t)} />
    </SceneSvg>
  );
};

/** "What did Japan do? We'll find out in the next part." — a quiet, open ending */
export const WhatNow: React.FC<SceneProps> = ({ f, from, to }) => {
  const what = w8(226, "what");
  const find = w8(231, "find");
  const fade = ip(f, [to - 30, to - 4], [1, 0]);
  return (
    <SceneSvg f={f}>
      <g opacity={fade}>
        <Camera cam={camAt(f, [[from, { x: 960, y: 560, z: 1.0 }], [find, { x: 960, y: 560, z: 1.0 }], [to, { x: 960, y: 520, z: 0.9 }]])}>
          <Shade d="M-800,-400 H3000 V1500 H-800 Z" fill="#c9cdd2" opacity={0.35} />
          <Sea f={f} y={780} color={C.deepSea} />
          {[0, 1, 2].map((i) => (
            <Steamship key={i} x={1300 + i * 260} y={800 - i * 30} s={0.32 - i * 0.05} f={f + i * 9} guns={1} />
          ))}
          <JapanChar f={f} x={700} y={560} s={0.45} expr="worry" armR={40} armL={40} />
          <Question x={1040} y={260} s={pop(f, what) * 1.4} size={160} rot={10} />
          <Question x={430} y={300} s={pop(f, what + 8)} size={110} rot={-12} />
        </Camera>
        <Label x={960} y={150} text="what did Japan do?" size={84} font={FONT_TITLE} color={C.red} p={ip(f, [what, what + 14], [0, 1], (t) => t)} rot={-3} />
      </g>
    </SceneSvg>
  );
};

