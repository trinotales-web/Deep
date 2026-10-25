import React from "react";
import { C, FONT_HAND, FONT_TITLE, INK, ip, ipm, rand } from "../theme";
import {
  Bang,
  Birds,
  Camera,
  camAt,
  Cloud,
  DrawOn,
  ellipseD,
  Ink,
  Label,
  Pencil,
  pop,
  Pop,
  Puff,
  Question,
  Shade,
  Sparkle,
  Sun,
} from "../draw";
import { SceneSvg } from "../Stage";
import { MapArt, proj } from "../MapArt";
import { Person } from "../Person";
import { Bush, RoundTree } from "../Props";
import { CityGrid, Coin, Manor, PowerMeter, RiceBales, Signpost, Throne } from "../Props2";
import { w2 } from "../part2cues";

const YearStamp: React.FC<{ f: number; at: number; year: string }> = ({ f, at, year }) => (
  <Pop s={pop(f, at, 200, 10)} x={250} y={200} rot={-8}>
    <Pencil d={ellipseD(250, 200, 140, 92)} fill={C.white} sw={5} />
    <Label x={250} y={236} text={year} size={110} font={FONT_TITLE} color={C.red} halo={false} />
    <Label x={250} y={146} text="the year" size={36} font={FONT_HAND} halo={false} />
  </Pop>
);

/** "In 794, Kyoto became the capital, and this is where the story gets interesting." */
export const Kyoto: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const year = w2(62, "seven");
  const kyoto = w2(65, "kyoto");
  const capital = w2(68, "capital");
  const story = w2(74, "story");
  const interesting = w2(76, "interesting");
  const [kx, ky] = proj(135.76, 35.01);
  const swap = ip(f, [capital - 14, capital + 2], [0, 1]);
  const cam = camAt(f, [
    [from, { x: kx - 120, y: ky - 60, z: 1.25 }],
    [kyoto + 6, { x: kx, y: ky - 30, z: 1.6 }],
    [capital - 12, { x: kx, y: ky - 20, z: 1.9 }],
    [capital + 2, { x: kx, y: ky - 10, z: 4.5 }],
  ]);
  const drama = ip(f, [story - 6, interesting + 8], [0, 1]);
  const gridZoom = 1 + drama * 0.9;
  return (
    <SceneSvg f={f}>
      {swap < 1 ? (
        <g opacity={1 - swap}>
          <Camera cam={cam}>
            <MapArt f={f} />
            <Pop s={pop(f, kyoto - 2, 200, 9)} x={kx} y={ky}>
              <Ink d={`M${kx},${ky} L${kx},${ky - 100}`} sw={6} />
              <Pencil d={ellipseD(kx, ky - 118, 26)} fill={C.red} sw={4.5} />
            </Pop>
            <Label x={kx + 20} y={ky - 120} text="KYOTO" size={70} font={FONT_TITLE} color={C.indigo} p={ip(f, [kyoto, kyoto + 10], [0, 1], (x) => x)} rot={-6} />
          </Camera>
        </g>
      ) : null}
      {swap > 0 ? (
        <g opacity={swap}>
          <g transform={`translate(960,240) scale(${gridZoom}) translate(-960,-240)`}>
            <Shade d="M-200,-200 H2200 V1300 H-200 Z" fill={C.moss} opacity={0.35} />
            {[[300, 200], [1640, 260], [260, 760], [1680, 800], [400, 480], [1560, 560]].map(([x, y], i) => (
              <RoundTree key={i} x={x} y={y} s={0.7} seed={i} />
            ))}
            <CityGrid x={560} y={130} w={800} h={760} p={ip(f, [capital - 12, capital + 26], [0, 1])} />
            <Label x={960} y={112} text="palace" size={44} font={FONT_HAND} p={ip(f, [capital + 14, capital + 24], [0, 1], (x) => x)} />
          </g>
          <Label x={300} y={420} text="KYOTO" size={110} font={FONT_TITLE} color={C.indigo} rot={-6} p={ip(f, [capital - 4, capital + 8], [0, 1], (x) => x) * (1 - drama)} />
          <Label x={300} y={500} text="the new capital!" size={52} font={FONT_HAND} rot={-6} p={ip(f, [capital + 4, capital + 18], [0, 1], (x) => x) * (1 - drama)} />
          {/* "...and this is where the story gets interesting" */}
          <path d="M0,0 H1920 V1080 H0 Z" fill="#1f2a55" opacity={drama * 0.28} />
          <Bang x={700} y={300} s={pop(f, interesting) * (1 - ip(f, [to - 6, to], [0, 1]))} n={2} />
          <Question x={1250} y={300} s={pop(f, interesting + 4)} size={130} rot={12} />
          <Label x={960} y={880} text="ooh..." size={86} font={FONT_HAND} color={C.white} p={ip(f, [interesting, interesting + 10], [0, 1], (x) => x)} halo={false} />
        </g>
      ) : null}
      <YearStamp f={f} at={year} year="794" />
    </SceneSvg>
  );
};

/** "Over time, the emperor started losing power." */
export const EmperorPower: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const over = w2(77, "over");
  const losing = w2(82, "losing");
  const power = w2(83, "power");
  const level = ip(f, [losing - 6, power + 18], [1, 0.12]);
  const years = ["800", "900", "1000", "1100"];
  const flip = Math.min(years.length - 1, Math.max(0, Math.floor((f - over) / 6)));
  const expr = f > power ? "shock" : f > losing ? "worry" : "smile";
  const cam = camAt(f, [
    [from, { x: 960, y: 540, z: 1.0 }],
    [to, { x: 1000, y: 580, z: 1.1 }],
  ]);
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <Pencil d="M-300,-200 H2200 V700 H-300 Z" fill={C.tan} />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <Ink key={i} d={`M-300,${60 + i * 90} H2200`} sw={2} opacity={0.35} />
        ))}
        {/* blinds */}
        <Pencil d="M420,20 H1500 V330 H420 Z" fill={C.straw} />
        {new Array(14).fill(0).map((_, i) => (
          <Ink key={i} d={`M420,${40 + i * 21} H1500`} sw={2} opacity={0.55} />
        ))}
        <Ink d="M420,330 Q960,350 1500,330" sw={5} color={C.red} />
        {[260, 1660].map((x) => (
          <Pencil key={x} d={`M${x - 26},-200 h52 v900 h-52 Z`} fill={C.darkBrown} />
        ))}
        <Pencil d="M-300,700 H2200 V1400 H-300 Z" fill={C.straw} />
        {[0, 1, 2, 3].map((i) => (
          <Ink key={i} d={`M-300,${760 + i * 70} H2200`} sw={2.5} opacity={0.5} />
        ))}
        {/* calendar flips: time passing */}
        <Pop s={pop(f, over - 6)} x={480} y={420}>
          <Pencil d="M370,330 h220 v230 h-220 Z" fill={C.white} sw={4} />
          <Pencil d="M370,330 h220 v54 h-220 Z" fill={C.red} sw={4} />
          <Label x={480} y={510} text={years[flip]} size={76} font={FONT_TITLE} halo={false} />
          <Ink d="M414,314 v30 M546,314 v30" sw={6} />
        </Pop>
        <Throne x={960} y={930} s={1.25} />
        <Person x={960} y={872} s={1.5 - (1 - level) * 0.2} tribe="emperor" f={f} sit expr={expr} hold="shaku" aR={30} seed={4} />
        <PowerMeter x={1460} y={900} level={level} h={360} />
        <Label x={1460} y={500} text="power" size={56} font={FONT_HAND} />
        <DrawOn d="M1560,590 L1560,830" p={ip(f, [losing, losing + 12], [0, 1])} sw={6} color={C.red} />
        <DrawOn d="M1536,800 L1560,836 L1584,800" p={ip(f, [losing + 10, losing + 16], [0, 1])} sw={6} color={C.red} />
      </Camera>
    </SceneSvg>
  );
};

/** "Landowners who lived far from the capital no longer felt safe." */
export const Landowner: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const owners = w2(84, "landowners");
  const far = w2(87, "far");
  const no = w2(91, "no");
  const safe = w2(94, "safe");
  const cam = camAt(f, [
    [from, { x: 960, y: 540, z: 0.98 }],
    [no - 4, { x: 960, y: 560, z: 1.0 }],
    [to, { x: 900, y: 600, z: 1.12 }],
  ]);
  const scared = f > no;
  const eyes = (x: number, y: number, at: number) =>
    f > at ? (
      <g>
        {[-18, 18].map((dx) => (
          <g key={dx}>
            <path d={ellipseD(x + dx, y, 12, (f - at) % 46 < 3 ? 2 : 14)} fill={C.white} stroke={INK} strokeWidth={3} />
            <path d={ellipseD(x + dx - 4, y + 2, 6, 7)} fill={INK} />
          </g>
        ))}
        <Ink d={`M${x - 34},${y - 20} L${x - 8},${y - 12} M${x + 34},${y - 20} L${x + 8},${y - 12}`} sw={4} />
      </g>
    ) : null;
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <Shade d="M-600,-400 H2700 V700 H-600 Z" fill={C.sky} opacity={0.22} />
        <Sun x={1700} y={170} r={54} f={f} />
        <Cloud x={500} y={170} w={260} h={80} seed={2} />
        <Pencil d="M-600,560 Q300,430 900,520 T2600,500 L2600,1200 L-600,1200 Z" fill={C.moss} />
        <Pencil d="M-600,660 Q960,640 2600,660 L2600,1500 L-600,1500 Z" fill={C.green} />
        <Manor x={1320} y={660} s={0.7} />
        <Pencil d="M1560,700 L2300,700 L2400,860 L1500,860 Z" fill="#a9c3cf" sw={3.5} />
        {new Array(10).fill(0).map((_, i) => (
          <Ink key={i} d={`M${1590 + i * 75},${800} l-6,-16 M${1596 + i * 75},${800} l0,-20 M${1602 + i * 75},${800} l6,-16`} sw={2.5} color={C.darkGreen} />
        ))}
        <Pop s={pop(f, far - 2, 180, 10)} x={330} y={900}>
          <Signpost x={330} y={900} text="← Kyoto: very far" font={FONT_HAND} s={1.05} />
        </Pop>
        <Bush x={260} y={700} w={260} h={150} seed={4} />
        <clipPath id="banditClip">
          <rect x={1100} y={-200} width={800} height={1120} />
        </clipPath>
        {f > safe - 6 ? (
          <g clipPath="url(#banditClip)">
            <Person
              x={1500}
              y={860 + (1 - ip(f, [safe - 4, safe + 8], [0, 1])) * 380}
              s={1.05}
              tribe="bandit"
              f={f}
              expr="grin"
              flip
              seed={5}
              hold="naginata"
              aR={20}
              look={[-1, 0]}
            />
          </g>
        ) : null}
        <Bush x={1480} y={940} w={340} h={190} seed={9} />
        {eyes(240, 640, no - 2)}
        {f < safe - 4 ? eyes(1460, 860, no + 6) : null}
        <Person
          x={820}
          y={910}
          s={1.12 * pop(f, owners - 6)}
          tribe="noble"
          f={f}
          expr={scared ? "shock" : "smile"}
          look={scared ? [1, 0] : [0, 0]}
          aL={scared ? 40 : 10}
          aR={scared ? 40 : 10}
          seed={2}
          bob={scared ? Math.abs(Math.sin(f)) * 4 : 0}
        />
        <Bang x={860} y={560} s={pop(f, safe)} n={2} />
        {scared ? <Pencil d="M900,620 Q912,644 902,654 Q890,646 900,620 Z" fill={C.sky} sw={2.5} /> : null}
        <Label x={760} y={380} text="landowner" size={58} font={FONT_HAND} p={ip(f, [owners, owners + 12], [0, 1], (x) => x) * ip(f, [no - 4, no + 4], [1, 0])} />
      </Camera>
    </SceneSvg>
  );
};

/** "So they paid armed men to guard their land, protect their crops and collect taxes." */
export const Guards: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const paid = w2(97, "paid");
  const armed = w2(98, "armed");
  const guard = w2(101, "guard");
  const protect = w2(104, "protect");
  const collect = w2(108, "collect");
  const taxes = w2(109, "taxes");
  const cam = camAt(f, [
    [from, { x: 880, y: 560, z: 0.95 }],
    [protect - 8, { x: 900, y: 560, z: 0.95 }],
    [protect + 8, { x: 1700, y: 560, z: 0.95 }],
    [collect - 6, { x: 1720, y: 560, z: 0.95 }],
    [collect + 8, { x: 1300, y: 560, z: 0.92 }],
    [to, { x: 1300, y: 560, z: 0.96 }],
  ]);
  const guards = [
    { x: 980, hold: "bow" as const, seed: 1 },
    { x: 1150, hold: "naginata" as const, seed: 4 },
    { x: 1320, hold: "none" as const, seed: 7 },
  ];
  const stern = f > guard - 2;
  // the bandit dashes for the crops, then flees from the guard
  const banditX = ipm(f, [protect - 10, protect + 8, protect + 14, protect + 34], [2700, 2050, 2050, 2900]);
  const chaseX = ipm(f, [protect + 2, protect + 14, protect + 34], [1320, 1880, 2300]);
  const fleeing = f > protect + 12;
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <Shade d="M-600,-400 H3200 V700 H-600 Z" fill={C.sky} opacity={0.22} />
        <Sun x={600} y={150} r={54} f={f} />
        <Birds x={1500} y={170} f={f} n={3} />
        <Pencil d="M-600,560 Q300,440 1000,520 T3200,500 L3200,1200 L-600,1200 Z" fill={C.moss} />
        <Pencil d="M-600,660 Q1300,640 3200,660 L3200,1500 L-600,1500 Z" fill={C.green} />
        <Manor x={300} y={660} s={0.6} />
        <Pencil d="M1820,690 L2600,690 L2700,860 L1760,860 Z" fill="#a9c3cf" sw={3.5} />
        {new Array(11).fill(0).map((_, i) => (
          <g key={i}>
            <Ink d={`M${1850 + i * 72},${800} l-6,-22 M${1856 + i * 72},${800} l0,-28 M${1862 + i * 72},${800} l6,-22`} sw={3} color={C.darkGreen} />
            <Pencil d={ellipseD(1856 + i * 72, 768, 6, 10)} fill={C.rice} sw={2} />
          </g>
        ))}
        <Label x={2240} y={600} text="crops" size={56} font={FONT_HAND} p={ip(f, [protect + 4, protect + 14], [0, 1], (x) => x)} />
        {/* the landowner pays */}
        <Person x={560} y={910} s={1.05} tribe="noble" f={f} expr={f > armed ? "smile" : "worry"} hold="coins" aR={f > paid - 4 && f < guard ? 70 : 20} seed={2} />
        {guards.map((g, i) => {
          const at = paid + 4 + i * 4;
          const t = ip(f, [at, at + 14], [0, 1], (x) => x);
          if (t <= 0 || t >= 1) return null;
          return <Coin key={i} x={640 + (g.x - 640) * t} y={760 - Math.sin(t * Math.PI) * 200 + t * 20} s={1.2} />;
        })}
        {guards.map((g, i) => {
          const chaser = i === 1 && f > protect;
          return (
            <Person
              key={i}
              x={chaser ? chaseX : g.x}
              y={910}
              s={1.05 * pop(f, armed - 2 + i * 4)}
              tribe="guard"
              f={f}
              hold={g.hold}
              aR={g.hold === "none" ? 10 : 20}
              walk={chaser && f < protect + 34 ? f * 0.6 : undefined}
              expr={stern ? "angry" : "grin"}
              seed={g.seed}
            />
          );
        })}
        <Label x={1150} y={430} text="armed men" size={60} font={FONT_HAND} p={ip(f, [armed + 4, armed + 16], [0, 1], (x) => x) * ip(f, [protect - 6, protect], [1, 0])} />
        {f > protect - 12 && f < protect + 36 ? (
          <g>
            <Person x={banditX} y={910} s={1.0} tribe="bandit" f={f} walk={f * 0.7} flip={!fleeing} expr={fleeing ? "shock" : "grin"} seed={9} hold="none" />
            {fleeing ? <Ink d={`M${banditX - 120},820 h-90 M${banditX - 110},860 h-120 M${banditX - 120},780 h-70`} sw={5} /> : null}
            <Bang x={banditX} y={620} s={fleeing ? 1 : 0} />
          </g>
        ) : null}
        {/* taxes: rice bales pile up */}
        <Person x={1600} y={910} s={0.95 * pop(f, collect - 8)} tribe="yayoi" f={f} hold="ricebale" aR={150} expr="worry" seed={6} />
        <RiceBales x={1250} y={900} n={Math.max(0, Math.min(6, Math.floor((f - collect) / 4)))} s={0.9} />
        <Label x={1350} y={640} text="taxes" size={64} font={FONT_TITLE} color="#b58b1f" p={ip(f, [taxes, taxes + 10], [0, 1], (x) => x)} rot={-4} />
      </Camera>
    </SceneSvg>
  );
};

/** "These guards became the samurai." */
export const SamuraiReveal: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const became = w2(112, "became");
  const samurai = w2(114, "samurai");
  const swap = became + 6;
  const burst = ip(f, [became - 4, became + 10], [0, 1]);
  const cam = camAt(f, [
    [from, { x: 960, y: 560, z: 1.0 }],
    [to, { x: 960, y: 560, z: 1.08 }],
  ]);
  const crew = [
    { x: 560, s: 1.0, seed: 3, hold: "bow" as const },
    { x: 960, s: 1.3, seed: 1, hold: "naginata" as const },
    { x: 1360, s: 1.0, seed: 7, hold: "none" as const },
  ];
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <g opacity={burst}>
          <path d={ellipseD(960, 560, 900, 700)} fill={C.yellow} opacity={0.25} />
          {new Array(36).fill(0).map((_, i) => {
            const a = (i / 36) * Math.PI * 2 + rand(i) * 0.08;
            const r1 = 360 + rand(i + 3) * 120;
            return <Ink key={i} d={`M${960 + Math.cos(a) * r1},${560 + Math.sin(a) * r1} L${960 + Math.cos(a) * 1300},${560 + Math.sin(a) * 1300}`} sw={3 + (i % 3)} opacity={0.35} />;
          })}
        </g>
        <Pencil d="M-600,880 Q960,860 2600,880 L2600,1500 L-600,1500 Z" fill={C.green} />
        {crew.map((c, i) => {
          const done = f > swap + i * 3;
          return (
            <g key={i}>
              <Person
                x={c.x}
                y={940}
                s={c.s}
                tribe={done ? "samurai" : "guard"}
                f={f}
                hold={done ? "katana" : c.hold}
                aR={done ? 150 : 15}
                expr={done ? "grin" : "smile"}
                seed={c.seed}
              />
              <Puff x={c.x} y={940 - 150 * c.s} p={ip(f, [swap - 5 + i * 3, swap + 9 + i * 3], [0, 1], (x) => x)} size={100 * c.s} fill={C.white} seed={i + 2} />
            </g>
          );
        })}
        <Label x={960} y={220} text="SAMURAI" size={170} font={FONT_TITLE} color="#33406b" p={ip(f, [samurai - 4, samurai + 8], [0, 1], (x) => x)} rot={-3} />
        <DrawOn d="M620,260 Q960,236 1300,250" p={ip(f, [samurai + 6, samurai + 16], [0, 1])} sw={14} color={C.red} />
        <Sparkle x={420} y={360} s={pop(f, samurai + 4)} />
        <Sparkle x={1500} y={330} s={pop(f, samurai + 8)} />
      </Camera>
    </SceneSvg>
  );
};

/** "And as the emperor grew weaker, the samurai grew stronger." */
export const Balance: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const emperor = w2(118, "emperor");
  const weaker = w2(120, "weaker");
  const samurai = w2(122, "samurai");
  const stronger = w2(124, "stronger");
  const shrink = ip(f, [weaker - 6, weaker + 14], [0, 1]);
  const grow = ip(f, [stronger - 6, stronger + 14], [0, 1]);
  const cam = camAt(f, [
    [from, { x: 960, y: 540, z: 1.0 }],
    [to, { x: 960, y: 560, z: 1.04 }],
  ]);
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <Shade d="M-200,-200 H960 V1300 H-200 Z" fill="#c9b8a0" opacity={0.3} />
        <Shade d="M960,-200 H2200 V1300 H960 Z" fill={C.sky} opacity={0.25} />
        <Pencil d="M-200,880 Q960,870 2200,880 L2200,1400 L-200,1400 Z" fill={C.green} />
        <DrawOn d="M960,-20 C950,300 970,700 960,1100" p={ip(f, [from, from + 14], [0, 1])} sw={5} />
        <Person
          x={600}
          y={930}
          s={1.6 * (1 - shrink * 0.45) * pop(f, from + 2)}
          tribe="emperor"
          f={f}
          expr={shrink > 0.3 ? "tired" : "smile"}
          hold="shaku"
          aR={20}
          seed={4}
        />
        <PowerMeter x={240} y={900} level={0.55 - shrink * 0.45} h={360} />
        <Label x={240} y={500} text="power" size={48} font={FONT_HAND} />
        <Label x={600} y={420} text="emperor" size={56} font={FONT_TITLE} color="#b07a1f" p={ip(f, [emperor, emperor + 10], [0, 1], (x) => x)} />
        <Label x={1330} y={330} text="samurai" size={56} font={FONT_TITLE} color="#33406b" p={ip(f, [samurai, samurai + 10], [0, 1], (x) => x) * ip(f, [stronger - 4, stronger + 2], [1, 0])} />
        <Label x={560} y={300} text="weaker..." size={70 - shrink * 20} font={FONT_HAND} p={ip(f, [weaker, weaker + 10], [0, 1], (x) => x)} />
        <DrawOn d="M760,420 L760,640" p={ip(f, [weaker + 2, weaker + 12], [0, 1])} sw={8} color={C.red} />
        <DrawOn d="M730,606 L760,646 L790,606" p={ip(f, [weaker + 10, weaker + 16], [0, 1])} sw={8} color={C.red} />
        <Person
          x={1330}
          y={930}
          s={1.4 * (1 + grow * 0.4) * pop(f, from + 8)}
          tribe="samurai"
          f={f}
          expr={grow > 0.2 ? "grin" : "smile"}
          aL={grow > 0.2 ? 150 + Math.sin(f / 3) * 10 : 10}
          aR={grow > 0.2 ? 150 + Math.cos(f / 3) * 10 : 10}
          seed={6}
        />
        <PowerMeter x={1700} y={900} level={0.5 + grow * 0.5} h={360} />
        <Label x={1700} y={500} text="power" size={48} font={FONT_HAND} />
        <Label x={1340} y={170} text="STRONGER!" size={110} font={FONT_TITLE} color="#33406b" p={ip(f, [stronger, stronger + 10], [0, 1], (x) => x)} rot={-4} />
        <DrawOn d="M1620,700 L1620,460" p={ip(f, [stronger + 2, stronger + 12], [0, 1])} sw={8} color={C.darkGreen} />
        <DrawOn d="M1590,494 L1620,454 L1650,494" p={ip(f, [stronger + 10, stronger + 16], [0, 1])} sw={8} color={C.darkGreen} />
      </Camera>
    </SceneSvg>
  );
};

