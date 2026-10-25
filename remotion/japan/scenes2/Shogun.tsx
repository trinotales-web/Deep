import React from "react";
import { C, FONT_HAND, FONT_TITLE, INK, ip } from "../theme";
import {
  Bang,
  blobD,
  Camera,
  camAt,
  Cloud,
  DrawOn,
  ellipseD,
  Heart,
  Ink,
  Label,
  Pencil,
  pop,
  Pop,
  Question,
  Shade,
  shakeAt,
  Sparkle,
  Sun,
} from "../draw";
import { SceneSvg } from "../Stage";
import { japanD } from "../MapArt";
import { Person } from "../Person";
import { Banner, BigSword, CherryTree, Petals, PowerMeter, Scroll, Throne, WarBoat } from "../Props2";
import { w2 } from "../part2cues";

const WHITE_BANNER = C.white;
const RED_BANNER = C.red;

/** "In time, two big samurai families went to war for power, the Minamoto and the Taira." */
export const War: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const two = w2(127, "two");
  const went = w2(131, "went");
  const war = w2(133, "war");
  const minamoto = w2(137, "minamoto");
  const taira = w2(140, "taira");
  const charge = ip(f, [went - 4, war + 4], [0, 1]);
  const clash = f > war + 2;
  const shake = shakeAt(f, ip(f, [war + 2, war + 6], [0, 1]) * ip(f, [war + 10, war + 40], [1, 0.15]));
  const cam = camAt(f, [
    [from, { x: 960, y: 540, z: 0.95 }],
    [war, { x: 960, y: 560, z: 1.02 }],
    [to, { x: 960, y: 560, z: 1.08 }],
  ]);
  const left = [210, 360, 510];
  const right = [1410, 1560, 1710];
  return (
    <SceneSvg f={f}>
      <Camera cam={cam} shake={shake}>
        <Shade d="M-600,-400 H2700 V700 H-600 Z" fill="#c9a98a" opacity={0.3} />
        <Sun x={960} y={170} r={60} f={f} color={C.orange} />
        <Pencil d="M-600,600 Q300,470 960,560 T2600,540 L2600,1200 L-600,1200 Z" fill={C.moss} />
        <Pencil d="M-600,700 Q960,680 2600,700 L2600,1500 L-600,1500 Z" fill={C.green} />
        {/* banners behind each army */}
        {[90, 290, 470].map((x, i) => (
          <Pop key={i} s={pop(f, two - 4 + i * 3)} x={x + charge * 220} y={920}>
            <Banner x={x + charge * 220} y={920} color={WHITE_BANNER} wave={Math.sin(f / 5 + i) * 8} />
          </Pop>
        ))}
        {[1420, 1610, 1800].map((x, i) => (
          <Pop key={i} s={pop(f, two + 6 + i * 3)} x={x - charge * 220} y={920}>
            <Banner x={x - charge * 220} y={920} color={RED_BANNER} wave={Math.sin(f / 5 + i) * 8} />
          </Pop>
        ))}
        {left.map((x, i) => (
          <Person
            key={`m${i}`}
            x={x + charge * (560 - i * 40)}
            y={930 + (i % 2) * 16}
            s={0.95 * pop(f, two - 2 + i * 3)}
            tribe="samurai"
            f={f}
            hold="katana"
            aR={f > went - 4 ? 150 : 40}
            walk={charge > 0 && charge < 1 ? f * 0.7 + i : undefined}
            expr={clash ? "angry" : "grin"}
            seed={i}
          />
        ))}
        {right.map((x, i) => (
          <Person
            key={`t${i}`}
            x={x - charge * (560 - i * 40)}
            y={930 + (i % 2) * 16}
            s={0.95 * pop(f, two + 8 + i * 3)}
            tribe="samurai"
            cloth={C.red}
            flip
            f={f}
            hold="katana"
            aR={f > went - 4 ? 150 : 40}
            walk={charge > 0 && charge < 1 ? f * 0.7 + i : undefined}
            expr={clash ? "angry" : "grin"}
            seed={i + 5}
          />
        ))}
        {clash ? (
          <g>
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const t = ((f - war) / 30 + i * 0.17) % 1;
              return (
                <Pencil
                  key={i}
                  d={blobD(820 + i * 60 + Math.sin(f / 5 + i) * 20, 800 - t * 120, 90 + t * 40, 70 + t * 30, i + 3, 7, 0.2)}
                  fill={C.tan}
                  sw={3.5}
                  opacity={0.9 - t * 0.5}
                />
              );
            })}
            <Bang x={960} y={540} s={pop(f, war + 2)} n={3} />
          </g>
        ) : null}
        <Label x={420} y={330} text="MINAMOTO" size={96} font={FONT_TITLE} color={INK} p={ip(f, [minamoto - 2, minamoto + 10], [0, 1], (x) => x)} rot={-4} />
        <Pencil d="M250,370 h50 v34 h-50 Z" fill={WHITE_BANNER} sw={3} opacity={ip(f, [minamoto + 4, minamoto + 8], [0, 1])} />
        <Label x={1500} y={330} text="TAIRA" size={96} font={FONT_TITLE} color={C.red} p={ip(f, [taira - 2, taira + 8], [0, 1], (x) => x)} rot={4} />
        <Pencil d="M1610,370 h50 v34 h-50 Z" fill={RED_BANNER} sw={3} opacity={ip(f, [taira + 4, taira + 8], [0, 1])} />
      </Camera>
    </SceneSvg>
  );
};

/** "The Minamoto won, and Japan got a strange new system." */
export const Victory: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const won = w2(143, "won");
  const strange = w2(148, "strange");
  const system = w2(150, "system");
  const cam = camAt(f, [
    [from, { x: 960, y: 560, z: 1.0 }],
    [strange - 8, { x: 960, y: 520, z: 0.98 }],
    [to, { x: 960, y: 280, z: 0.95 }],
  ]);
  const flee = ip(f, [from, to], [0, 1]);
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <Shade d="M-600,-900 H2700 V760 H-600 Z" fill={C.sky} opacity={0.25} />
        <Cloud x={1500} y={140} w={260} h={80} seed={3} />
        <Pencil d="M-600,760 Q1200,740 2700,760 L2700,1500 L-600,1500 Z" fill={C.sea} />
        {[0, 1, 2].map((i) => (
          <WarBoat
            key={i}
            x={1250 + i * 230 + flee * 260}
            y={800 + (i % 2) * 40 + flee * 60 * (i === 1 ? 1 : 0)}
            s={0.55}
            color={RED_BANNER}
            tilt={i === 1 ? flee * 26 : Math.sin(f / 8 + i) * 3}
          />
        ))}
        <Pencil d="M-600,900 C-200,520 300,480 760,640 C900,700 940,800 960,1200 L-600,1200 Z" fill={C.green} />
        <Person x={420} y={600} s={1.05} tribe="samurai" f={f} expr={f > won ? "grin" : "smile"} hold="bannerWhite" aR={f > won ? 150 : 30} seed={2} />
        {[260, 560, 660].map((x, i) => (
          <Person key={i} x={x} y={700 + i * 30} s={0.8} tribe="samurai" f={f} expr="grin" aL={150} aR={150} seed={i + 4} bob={f > won ? Math.abs(Math.sin(f / 4 + i)) * 14 : 0} />
        ))}
        <Sparkle x={560} y={250} s={pop(f, won + 2)} />
        <Sparkle x={300} y={300} s={pop(f, won + 6)} />
        <Label x={500} y={160} text="the Minamoto win!" size={70} font={FONT_HAND} p={ip(f, [won, won + 14], [0, 1], (x) => x)} rot={-4} />
        {/* the outline of something new in the sky */}
        <g>
          <DrawOn d="M960,-420 L700,-80 L1220,-80 Z" p={ip(f, [strange - 4, system + 10], [0, 1])} sw={6} dotted />
          <DrawOn d="M800,-210 L1120,-210" p={ip(f, [strange + 6, system + 14], [0, 1])} sw={6} dotted />
          <Question x={960} y={-260} s={pop(f, system)} size={110} />
          <Label x={960} y={-480} text="a strange new system" size={64} font={FONT_HAND} p={ip(f, [strange, system + 8], [0, 1], (x) => x)} />
        </g>
      </Camera>
    </SceneSvg>
  );
};

const TIERS = [
  { top: 360, bot: 540, hw: 210, color: C.red, label: "SHOGUN" },
  { top: 540, bot: 720, hw: 420, color: "#7f99c4", label: "DAIMYO" },
  { top: 720, bot: 905, hw: 640, color: C.lightIndigo, label: "SAMURAI" },
];

const tierD = (i: number) => {
  const t = TIERS[i];
  const inset = 26;
  return `M${960 - t.hw + inset},${t.top} L${960 + t.hw - inset},${t.top} L${960 + t.hw},${t.bot} L${960 - t.hw},${t.bot} Z`;
};

/** Japan split into domains, for "lords who ruled smaller areas". */
const Domains: React.FC<{ x: number; y: number; s: number; p: number }> = ({ x, y, s, p }) => {
  if (p <= 0.01) return null;
  const cols = [C.yellow, C.pink, C.sky, C.green];
  return (
    <g transform={`translate(${x},${y}) scale(${s * p}) translate(-1360,-592)`}>
      {japanD.map((d, i) => (
        <Pencil key={i} d={d} fill={cols[i]} sw={6} />
      ))}
      <Ink d="M1230,860 L1290,700 M1360,760 L1440,600 M1480,560 L1560,420" sw={6} dash="4 16" />
      {[[1060, 900], [1180, 760], [1360, 660], [1520, 480], [1640, 220]].map(([fx, fy], i) => (
        <g key={i}>
          <Ink d={`M${fx},${fy} l0,-90`} sw={7} />
          <Pencil d={`M${fx},${fy - 90} l60,14 l-60,16 Z`} fill={[C.red, C.indigo, C.orange, C.darkGreen, C.terracotta][i]} sw={5} />
        </g>
      ))}
    </g>
  );
};

/** The emperor, the shogun, the daimyo and the samurai. */
export const Hierarchy: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const stayed = w2(153, "stayed");
  const people = w2(158, "people");
  const gods = w2(165, "gods");
  const but = w2(166, "but");
  const noPower = w2(171, "power");
  const real = w2(173, "real");
  const shogun = w2(183, "shogun");
  const under1 = w2(184, "under");
  const daimyo = w2(188, "daimyo");
  const ruled = w2(191, "ruled");
  const under2 = w2(195, "under");
  const samurai = w2(200, "samurai");
  const cam = camAt(f, [
    [from, { x: 960, y: 190, z: 2.3 }],
    [real - 2, { x: 960, y: 200, z: 2.2 }],
    [real + 26, { x: 960, y: 430, z: 1.25 }],
    [under1 - 2, { x: 960, y: 440, z: 1.2 }],
    [under1 + 20, { x: 1000, y: 500, z: 1.0 }],
    [under2 - 2, { x: 1000, y: 520, z: 1.0 }],
    [under2 + 20, { x: 1040, y: 520, z: 0.9 }],
    [to, { x: 1040, y: 520, z: 0.92 }],
  ]);
  const godRays = ip(f, [people, gods + 6], [0, 1]) * ip(f, [but, but + 12], [1, 0.25]);
  const shrug = f > but + 4 && f < real + 10;
  const tierP = (i: number, at: number) => pop(f, at, 160, 12) * (i >= 0 ? 1 : 0);
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <Shade d="M-800,-600 H2800 V1400 H-800 Z" fill={C.sky} opacity={0.18} />
        {/* the emperor, on his cloud */}
        <g opacity={1}>
          {godRays > 0 ? (
            <g opacity={godRays}>
              {new Array(14).fill(0).map((_, i) => {
                const a = Math.PI * (0.1 + 0.8 * (i / 13));
                return <Ink key={i} d={`M${960 + Math.cos(a) * 60},${-60 + Math.sin(a) * 60} L${960 + Math.cos(a) * 420},${-60 + Math.sin(a) * 420}`} sw={5} color={C.sun} opacity={0.7} />;
              })}
              <Sun x={960} y={-60} r={50} f={f} />
              <Label x={1180} y={60} text="from the gods!" size={40} font={FONT_HAND} p={ip(f, [gods - 4, gods + 10], [0, 1], (x) => x)} />
            </g>
          ) : null}
          <Pencil d={blobD(960, 262, 230, 50, 4, 8, 0.2)} fill={C.white} sw={4} />
          <Throne x={960} y={250} s={0.42} />
          <Person x={960} y={232} s={0.52} tribe="emperor" f={f} sit expr={shrug ? "worry" : "smile"} hold="shaku" aR={shrug ? 80 : 30} aL={shrug ? 80 : 10} seed={4} />
          {shrug ? <Question x={1060} y={110} s={pop(f, but + 6)} size={60} rot={12} /> : null}
          <PowerMeter x={1110} y={250} level={ip(f, [but, noPower + 6], [0.6, 0])} w={26} h={110} />
          <Label x={1110} y={124} text="power" size={20} font={FONT_HAND} />
          <Sparkle x={860} y={110} s={pop(f, stayed) * ip(f, [people, people + 8], [1, 0])} />
          {/* people bow */}
          {[820, 900, 1020, 1100].map((x, i) => (
            <Person
              key={i}
              x={x}
              y={330}
              s={0.26 * pop(f, people - 2 + i * 2) * ip(f, [real, real + 8], [1, 0])}
              tribe="yayoi"
              f={f}
              expr="happy"
              lean={-28}
              seed={i}
            />
          ))}
          <Label x={720} y={200} text="EMPEROR" size={40} font={FONT_TITLE} color="#b07a1f" p={ip(f, [from + 4, from + 16], [0, 1], (x) => x)} rot={-6} />
          <Label x={720} y={236} text="(no real power)" size={26} font={FONT_HAND} p={ip(f, [noPower, noPower + 12], [0, 1], (x) => x)} rot={-6} />
        </g>
        <DrawOn d="M960,300 L960,360" p={ip(f, [shogun - 4, shogun + 4], [0, 1])} sw={4} dotted />
        {/* the pyramid */}
        {[shogun - 6, daimyo - 6, samurai - 8].map((at, i) => (
          <Pop key={i} s={tierP(i, at)} x={960} y={TIERS[i].bot}>
            <Pencil d={tierD(i)} fill={TIERS[i].color} sw={4.5} fillOpacity={0.55} />
          </Pop>
        ))}
        <Person x={960} y={530} s={0.74 * pop(f, shogun - 2)} tribe="shogun" f={f} expr="grin" hold="fan" aR={60} seed={9} />
        <Pop s={pop(f, shogun + 2)} x={1130} y={520}>
          <PowerMeter x={1130} y={520} level={ip(f, [shogun + 4, shogun + 20], [0, 1])} w={30} h={140} />
        </Pop>
        {[780, 960, 1140].map((x, i) => (
          <Person key={i} x={x} y={712} s={0.62 * pop(f, daimyo + i * 4)} tribe="daimyo" f={f} expr={i === 1 ? "grin" : "smile"} seed={i + 3} />
        ))}
        {[520, 690, 860, 1060, 1230, 1400].map((x, i) => (
          <Person key={i} x={x} y={896} s={0.6 * pop(f, samurai - 4 + i * 2)} tribe="samurai" f={f} expr="smile" hold={i % 2 ? "bannerWhite" : "none"} aR={20} seed={i + 7} />
        ))}
        {TIERS.map((t, i) => (
          <Label
            key={i}
            x={960 - t.hw - 40}
            y={t.bot - 50}
            text={t.label}
            size={58}
            font={FONT_TITLE}
            anchor="end"
            color={i === 0 ? "#8a2a2e" : i === 1 ? "#3f5f8f" : "#33406b"}
            p={ip(f, [[shogun, daimyo, samurai][i] - 2, [shogun, daimyo, samurai][i] + 10], [0, 1], (x) => x)}
          />
        ))}
        <Label x={1080} y={340} text="the real ruler" size={36} font={FONT_HAND} p={ip(f, [shogun + 6, shogun + 20], [0, 1], (x) => x)} anchor="start" />
        <Domains x={1790} y={520} s={0.46} p={pop(f, ruled - 4)} />
        <Label x={1790} y={880} text="smaller areas" size={46} font={FONT_HAND} p={ip(f, [ruled + 4, ruled + 18], [0, 1], (x) => x)} />
      </Camera>
    </SceneSvg>
  );
};

/** "They lived by a strict code of honor called bushido." */
export const Bushido: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const strict = w2(205, "strict");
  const code = w2(206, "code");
  const honor = w2(208, "honor");
  const bushido = w2(210, "bushido");
  const unroll = ip(f, [from, from + 22], [0, 1]);
  const cam = camAt(f, [
    [from, { x: 960, y: 520, z: 1.0 }],
    [to, { x: 980, y: 520, z: 1.05 }],
  ]);
  const values: { at: number; text: string; icon: React.ReactNode }[] = [
    { at: strict, text: "loyalty", icon: <Heart x={0} y={0} s={1.6} color={C.red} /> },
    {
      at: code,
      text: "courage",
      icon: <Pencil d="M0,24 C-26,10 -20,-20 0,-40 C4,-20 20,-14 14,-30 C30,-10 26,14 0,24 Z" fill={C.lava} sw={3.5} />,
    },
    {
      at: honor,
      text: "honor",
      icon: <Pencil d="M0,-34 L9,-10 L34,-10 L14,5 L22,30 L0,15 L-22,30 L-14,5 L-34,-10 L-9,-10 Z" fill={C.yellow} sw={3.5} />,
    },
  ];
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <Shade d="M-600,-400 H2700 V1400 H-600 Z" fill="#e8d3b0" opacity={0.35} />
        <Person x={260} y={900} s={1.25} tribe="samurai" f={f} expr="neutral" lean={f > code ? -18 : 0} seed={3} />
        <Scroll x={1060} y={520} w={1120} h={560} p={unroll}>
          <Label x={1060} y={340} text="the code of honor" size={56} font={FONT_HAND} halo={false} />
          {values.map((v, i) => (
            <g key={i}>
              <Pop s={pop(f, v.at - 2)} x={760 + i * 300} y={520}>
                <g transform={`translate(${760 + i * 300},500)`}>{v.icon}</g>
              </Pop>
              <Label x={760 + i * 300} y={620} text={v.text} size={56} font={FONT_HAND} halo={false} p={ip(f, [v.at, v.at + 10], [0, 1], (x) => x)} />
            </g>
          ))}
        </Scroll>
        <Pop s={pop(f, bushido - 2, 200, 10)} x={1060} y={180} rot={-3}>
          <Label x={1060} y={210} text="BUSHIDO" size={140} font={FONT_TITLE} color={C.red} />
          <Pencil d="M1400,120 h80 v80 h-80 Z" fill={C.red} sw={4} />
          <Ink d="M1420,140 h40 M1440,140 v44 M1420,184 h40" sw={4} color={C.white} />
        </Pop>
        <Label x={1060} y={770} text="the way of the warrior" size={44} font={FONT_HAND} halo={false} p={ip(f, [bushido + 6, bushido + 22], [0, 1], (x) => x)} />
      </Camera>
    </SceneSvg>
  );
};

/** "Each samurai carried two swords, the long katana and the short wakizashi." + quiet ending */
export const Swords: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const samurai = w2(212, "samurai");
  const two = w2(214, "two");
  const long = w2(217, "long");
  const katana = w2(218, "katana");
  const short = w2(221, "short");
  const wakizashi = w2(222, "wakizashi");
  const outro = wakizashi + 26;
  const sunset = ip(f, [outro + 6, outro + 40], [0, 1]);
  const fade = ip(f, [to - 26, to], [1, 0]);
  const cam = camAt(f, [
    [from, { x: 960, y: 540, z: 1.0 }],
    [outro, { x: 960, y: 540, z: 1.0 }],
    [to, { x: 900, y: 560, z: 1.12 }],
  ]);
  const swordsOut = ip(f, [outro - 4, outro + 16], [1, 0]);
  return (
    <SceneSvg f={f}>
      <g opacity={fade}>
        <Camera cam={cam}>
          <Shade d="M-600,-400 H2700 V1400 H-600 Z" fill={C.sky} opacity={0.2 * (1 - sunset)} />
          <Shade d="M-600,-400 H2700 V1400 H-600 Z" fill="#f2a46a" opacity={0.42 * sunset} />
          {sunset > 0 ? <Sun x={1500} y={560 - sunset * 160} r={110} f={f} color="#f08a4b" /> : null}
          <Pencil d="M-600,880 Q960,860 2600,880 L2600,1500 L-600,1500 Z" fill={sunset > 0.5 ? "#9fae6a" : C.green} />
          <Pop s={pop(f, outro, 120, 12)} x={1700} y={890}>
            <CherryTree x={1700} y={890} s={1.4} />
          </Pop>
          <Person
            x={500}
            y={930}
            s={1.6 * pop(f, from + 2, 140, 12)}
            tribe="samurai"
            f={f}
            expr={f > outro ? "happy" : "smile"}
            lean={f > outro + 20 ? -12 : 0}
            seed={4}
          />
          <Pop s={pop(f, two - 2, 200, 10)} x={330} y={780}>
            <Pencil d={ellipseD(330, 780, 44)} fill={C.yellow} sw={4} />
            <Label x={330} y={800} text="2" size={64} font={FONT_TITLE} halo={false} />
          </Pop>
          <g opacity={swordsOut}>
            <Pop s={pop(f, long - 4, 160, 12)} x={1150} y={420}>
              <BigSword x={900} y={420} len={820} s={0.9} rot={-4} sheath={ip(f, [katana, katana + 18], [1, 0])} />
            </Pop>
            <Label x={1250} y={300} text="katana" size={88} font={FONT_TITLE} color="#5d636e" p={ip(f, [katana - 2, katana + 10], [0, 1], (x) => x)} rot={-4} />
            <Label x={1580} y={300} text="(long)" size={48} font={FONT_HAND} p={ip(f, [long, long + 10], [0, 1], (x) => x)} rot={-4} />
            <Pop s={pop(f, short - 4, 160, 12)} x={1080} y={680}>
              <BigSword x={980} y={680} len={430} s={0.9} rot={-4} sheath={ip(f, [wakizashi, wakizashi + 18], [1, 0])} />
            </Pop>
            <Label x={1180} y={590} text="wakizashi" size={78} font={FONT_TITLE} color="#5d636e" p={ip(f, [wakizashi - 2, wakizashi + 12], [0, 1], (x) => x)} rot={-4} />
            <Label x={1500} y={600} text="(short)" size={48} font={FONT_HAND} p={ip(f, [short, short + 10], [0, 1], (x) => x)} rot={-4} />
          </g>
          <Label x={560} y={300} text="samurai" size={60} font={FONT_HAND} p={ip(f, [samurai, samurai + 10], [0, 1], (x) => x) * swordsOut} />
          {f > outro - 10 ? <Petals f={f - outro} n={22} /> : null}
          <Cloud x={300} y={160} w={220} h={70} seed={6} opacity={1 - sunset * 0.4} />
        </Camera>
      </g>
    </SceneSvg>
  );
};

