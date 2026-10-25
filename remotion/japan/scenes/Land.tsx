import React from "react";
import { C, FONT_HAND, INK, ip, ipm, rand, wf } from "../theme";
import {
  Bang,
  Birds,
  blobD,
  Bubble,
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
  Shade,
  shakeAt,
  smooth,
  Sparkle,
  Sun,
  Pt,
} from "../draw";
import { SceneSvg } from "../Stage";
import { Person } from "../Person";

const SEA_Y = 700;
const GROUND: Pt[] = [
  [380, 770], [450, 702], [560, 672], [700, 656], [900, 648], [1100, 645], [1300, 642], [1500, 646],
  [1700, 648], [1900, 652], [2100, 660], [2250, 690], [2350, 770],
];
const groundD = smooth(GROUND, false) + " L2350,820 L380,820 Z";

const mountainD = (cx: number, base: number, w: number, h: number) =>
  `M${cx - w / 2},${base} C${cx - w * 0.3},${base - h * 0.45} ${cx - w * 0.14},${base - h * 0.98} ${cx},${base - h} C${cx + w * 0.14},${base - h * 0.98} ${cx + w * 0.3},${base - h * 0.45} ${cx + w / 2},${base} Z`;

const volcanoD = (cx: number, base: number, w: number, top: number, h: number) =>
  `M${cx - w / 2},${base} C${cx - w * 0.3},${base - h * 0.12} ${cx - top / 2 - 14},${base - h * 0.62} ${cx - top / 2},${base - h} Q${cx},${base - h + 16} ${cx + top / 2},${base - h} C${cx + top / 2 + 14},${base - h * 0.62} ${cx + w * 0.3},${base - h * 0.12} ${cx + w / 2},${base} Z`;

const Tree: React.FC<{ x: number; y: number; s: number; tilt?: number; seed: number }> = ({ x, y, s, tilt = 0, seed }) =>
  s <= 0.01 ? null : (
    <g transform={`translate(${x},${y}) rotate(${tilt}) scale(${s})`}>
      <Pencil d="M-7,0 L-5,-46 L5,-46 L7,0 Z" fill={C.brown} sw={3.5} />
      <Pencil d={blobD(0, -78, 40, 38, seed, 5, 0.16)} fill={seed % 2 ? C.darkGreen : C.green} sw={3.5} />
    </g>
  );

const TREES: [number, number, number][] = [
  [600, 668, 0.9], [690, 660, 0.75], [1010, 650, 0.8], [1110, 648, 0.95], [1330, 646, 0.7], [1760, 650, 0.85],
  [1840, 652, 0.7], [2160, 668, 0.8],
];

/** Volcano's face – it's a character, like the personified maps of the explainer reference. */
const VolcanoFace: React.FC<{ x: number; y: number; mood: "sleep" | "awake" | "grin" | "calm"; f: number }> = ({
  x,
  y,
  mood,
  f,
}) => {
  if (mood === "sleep" || mood === "calm") {
    return (
      <g>
        <Ink d={`M${x - 52},${y} q14,${mood === "calm" ? -12 : 10} 28,0 M${x + 24},${y} q14,${mood === "calm" ? -12 : 10} 28,0`} sw={5} />
        {mood === "calm" ? <Ink d={`M${x - 16},${y + 40} Q${x},${y + 54} ${x + 16},${y + 40}`} sw={4.5} /> : null}
        {mood === "sleep" ? (
          <Label x={x + 90} y={y - 60 - ((f / 3) % 20)} text="z" size={44} font={FONT_HAND} halo={false} />
        ) : null}
        <Shade d={ellipseD(x - 62, y + 28, 15, 9)} fill={C.pink} opacity={0.7} />
        <Shade d={ellipseD(x + 62, y + 28, 15, 9)} fill={C.pink} opacity={0.7} />
      </g>
    );
  }
  const angry = mood === "grin";
  return (
    <g>
      {[-38, 38].map((dx) => (
        <g key={dx}>
          <path d={ellipseD(x + dx, y, 18, 21)} fill={C.white} stroke={INK} strokeWidth={4} />
          <path d={ellipseD(x + dx + (angry ? -3 : 0), y + 3, 9, 10)} fill={INK} />
          <path d={ellipseD(x + dx + 1, y - 2, 3)} fill={C.white} />
        </g>
      ))}
      {angry ? (
        <>
          <Ink d={`M${x - 66},${y - 34} L${x - 20},${y - 20} M${x + 66},${y - 34} L${x + 20},${y - 20}`} sw={6} />
          <path
            d={`M${x - 40},${y + 36} Q${x},${y + 30} ${x + 40},${y + 36} Q${x + 34},${y + 70} ${x},${y + 72} Q${x - 34},${y + 70} ${x - 40},${y + 36} Z`}
            fill={C.white}
            stroke={INK}
            strokeWidth={4}
          />
          <Ink d={`M${x - 36},${y + 50} Q${x},${y + 56} ${x + 36},${y + 50} M${x - 14},${y + 33} V${y + 70} M${x + 14},${y + 33} V${y + 70}`} sw={2.5} />
        </>
      ) : (
        <>
          <Ink d={`M${x - 56},${y - 30} L${x - 22},${y - 34} M${x + 56},${y - 30} L${x + 22},${y - 34}`} sw={5} />
          <Ink d={`M${x - 12},${y + 44} L${x + 12},${y + 44}`} sw={4.5} />
        </>
      )}
    </g>
  );
};

/** Big curling wave; front at x, sea level at y, height h. */
const Tsunami: React.FC<{ x: number; y: number; h: number; f: number }> = ({ x, y, h, f }) => {
  if (h <= 2) return null;
  const k = h / 400;
  const pts: Pt[] = [
    [-1300, 0], [-900, -60], [-600, -150], [-330, -300], [-150, -385], [10, -400], [120, -360], [150, -300],
    [110, -262], [56, -280], [36, -230], [52, -150], [86, -60], [120, 0],
  ];
  const body = smooth(pts.map(([px, py]) => [x + px * (0.7 + 0.3 * k), y + py * k]), false) + ` L${x - 1300},${y + 60} Z`;
  const claws = [];
  for (let i = 0; i < 9; i++) {
    const t = i / 8;
    const cx = x + (-230 + t * 330) * (0.7 + 0.3 * k);
    const cy = y + (-330 - Math.sin(t * Math.PI) * 70) * k;
    const wob = Math.sin(f / 4 + i) * 4;
    claws.push(<Pencil key={i} d={blobD(cx, cy + wob, 22 * k + 6, 15 * k + 4, i + 50, 4, 0.25)} fill={C.foam} sw={3} />);
  }
  return (
    <g>
      <Pencil d={body} fill={C.deepSea} sw={5} />
      <Shade
        d={smooth(
          [[-700, -40], [-420, -150], [-220, -280], [-60, -330], [30, -300], [40, -200], [60, -100], [80, -10]].map(([px, py]) => [
            x + px * (0.7 + 0.3 * k),
            y + py * k,
          ]) as Pt[],
          false,
        )}
        fill={C.sea}
        opacity={0.8}
      />
      {[0, 1, 2].map((i) => (
        <Ink
          key={i}
          d={`M${x - (500 + i * 180) * k},${y - (90 + i * 60) * k} q${60 * k},${-40 * k} ${130 * k},${-20 * k}`}
          sw={3.5}
          opacity={0.7}
        />
      ))}
      {claws}
    </g>
  );
};

const SeaBand: React.FC<{ f: number; tint?: number }> = ({ f }) => {
  const waves = [];
  for (let i = 0; i < 26; i++) {
    const x = -900 + (i % 13) * 300 + (i > 12 ? 150 : 0) + Math.sin(f / 20 + i) * 14;
    const y = SEA_Y + 60 + (i > 12 ? 130 : 30) + (i % 3) * 22;
    waves.push(<Ink key={i} d={`M${x},${y} q14,-11 28,0 q14,11 28,0`} sw={3} opacity={0.6} />);
  }
  const top: Pt[] = [];
  for (let x = -1200; x <= 3600; x += 120) top.push([x, SEA_Y + Math.sin(x * 0.02 + f / 12) * 5]);
  return (
    <g>
      <Pencil d={smooth(top, false) + ` L3600,1600 L-1200,1600 Z`} fill={C.sea} sw={4} off={[2, 3]} />
      {waves}
    </g>
  );
};

/** Lava bomb arcs out of the crater. */
const lavaBombs = (f: number, at: number, cx: number, cy: number) => {
  const out = [];
  for (let i = 0; i < 14; i++) {
    const t0 = at + (i % 7) * 4 + Math.floor(i / 7) * 16;
    const t = (f - t0) / 30;
    if (t < 0 || t > 1.6) continue;
    const vx = (rand(i + 3) - 0.5) * 700;
    const vy = -700 - rand(i + 9) * 400;
    const x = cx + vx * t;
    const y = cy + vy * t + 900 * t * t;
    const r = 12 + rand(i) * 12;
    out.push(<Pencil key={i} d={blobD(x, y, r, r * 0.9, i, 4, 0.2)} fill={i % 3 ? C.lava : C.red} sw={3} />);
  }
  return out;
};

/** Rising smoke column: `power` 0 = thin wisps, 1 = eruption plume. */
const Smoke: React.FC<{ f: number; x: number; y: number; power: number; seed?: number; dark?: number }> = ({
  f,
  x,
  y,
  power,
  seed = 0,
  dark = 0,
}) => {
  const puffs = [];
  const n = 9;
  for (let i = 0; i < n; i++) {
    const life = 70;
    const t = ((f + i * (life / n) + seed * 13) % life) / life;
    const size = (20 + 52 * power) * (0.55 + t * 1.5) * (0.8 + rand(i + seed) * 0.4);
    const px = x + t * (60 + 140 * power) + Math.sin(t * 5 + i * 2.1) * (16 + 30 * t);
    const py = y - t * (170 + 430 * power) + (rand(i * 3 + seed) - 0.5) * 30;
    const o = ip(t, [0, 0.1], [0, 1]) * ip(t, [0.6, 1], [1, 0]);
    puffs.push(
      <g key={i} opacity={o}>
        <Pencil d={blobD(px, py, size, size * 0.8, i + seed * 7, 7, 0.2)} fill={dark > 0.5 ? C.darkGray : C.gray} sw={3.5} />
      </g>,
    );
  }
  return <g>{puffs}</g>;
};

export const LandScene: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const mountainsAt = wf(19, "mountains");
  const volcanoesAt = wf(22, "volcanoes");
  const eruptAt = wf(25, "erupted");
  const tsunamiAt = wf(27, "huge");
  const coastAt = wf(31, "coast");
  const quakeAt = wf(33, "strong");
  const shookAt = wf(35, "shook");
  const nobodyAt = wf(38, "nobody");
  const imagineAt = wf(40, "imagine");
  const dangerAt = wf(46, "dangerous");
  const butAt = wf(48, "but");
  const civAt = wf(54, "civilization");
  const beganAt = wf(55, "began");

  const cam = camAt(f, [
    [from, { x: 1250, y: 520, z: 0.74 }],
    [volcanoesAt, { x: 1300, y: 520, z: 0.8 }],
    [eruptAt - 4, { x: 1420, y: 470, z: 0.92 }],
    [tsunamiAt - 8, { x: 1360, y: 470, z: 0.86 }],
    [tsunamiAt + 14, { x: 420, y: 520, z: 0.9 }],
    [coastAt + 14, { x: 470, y: 530, z: 0.95 }],
    [quakeAt + 4, { x: 1180, y: 520, z: 0.74 }],
    [nobodyAt - 2, { x: 1180, y: 520, z: 0.74 }],
    [nobodyAt + 20, { x: 330, y: 580, z: 1.05 }],
    [dangerAt + 30, { x: 300, y: 585, z: 1.1 }],
    [butAt + 8, { x: 1200, y: 480, z: 0.74 }],
    [to, { x: 1150, y: 520, z: 0.84 }],
  ]);

  const quake =
    ip(f, [quakeAt - 2, quakeAt + 6], [0, 1]) * ip(f, [shookAt + 20, nobodyAt - 4], [1, 0]) +
    ip(f, [eruptAt, eruptAt + 4], [0, 0.5]) * ip(f, [eruptAt + 6, eruptAt + 30], [1, 0]);
  const shake = shakeAt(f, quake);

  // sky mood: 0 calm, 1 dark eruption, sunrise warm after "But"
  const dark = ip(f, [eruptAt, eruptAt + 20], [0, 1]) * ip(f, [butAt - 10, butAt + 30], [1, 0]);
  const warm = ip(f, [butAt, butAt + 40], [0, 1]);

  const mountainPop = (i: number) => pop(f, mountainsAt - 6 + i * 5, 150, 10);
  const volcanoPop = (i: number) => pop(f, volcanoesAt - 4 + i * 7, 150, 10);
  const erupt = ip(f, [eruptAt, eruptAt + 6], [0, 1]);
  const smokePower = Math.max(
    0.15,
    ip(f, [eruptAt, eruptAt + 12], [0.15, 1]) * ip(f, [butAt, butAt + 45], [1, 0.25]),
  );
  // squash & stretch on eruption
  const squash = f >= eruptAt - 8 && f < eruptAt + 14 ? Math.sin(((f - eruptAt + 8) / 22) * Math.PI * 2) * 0.05 : 0;
  const quakeWob = quake > 0 ? Math.sin(f * 1.7) * 0.02 * quake : 0;

  const mood: "sleep" | "awake" | "grin" | "calm" =
    f < volcanoesAt + 4 ? "sleep" : f < eruptAt - 6 ? "awake" : f < butAt + 6 ? "grin" : "calm";

  // tsunami: travels from far left to the coast, crashes, recedes
  const waveX = ip(f, [tsunamiAt - 6, coastAt + 2], [-700, 380]);
  const waveH = ipm(f, [tsunamiAt - 6, tsunamiAt + 10, coastAt, coastAt + 10, coastAt + 30], [0, 300, 420, 160, 0]);
  const splash = ip(f, [coastAt, coastAt + 26], [0, 1], (x) => x);

  // boat
  const boatX = ipm(f, [nobodyAt - 10, imagineAt + 6, dangerAt + 18, dangerAt + 40], [-760, -90, -60, -900]);
  const boatFlip = f > dangerAt + 20;
  const boatExpr = f < imagineAt ? "smile" : f < dangerAt - 6 ? "shock" : "worry";

  // sunrise
  const sunY = ip(f, [butAt - 4, civAt + 10], [760, 230]);

  return (
    <SceneSvg f={f}>
      <Camera cam={cam} shake={shake}>
        {/* sky */}
        <Shade d="M-1600,-900 H3800 V760 H-1600 Z" fill={C.sky} opacity={0.22 * (1 - warm)} />
        <Shade d="M-1600,-900 H3800 V760 H-1600 Z" fill="#6b5560" opacity={0.42 * dark} />
        <Shade d="M-1600,-900 H3800 V760 H-1600 Z" fill="#f4b26a" opacity={0.3 * warm} />
        <g opacity={1 - dark}>
          <Cloud x={420} y={180} w={260} h={90} seed={2} />
          <Cloud x={2050} y={140} w={220} h={80} seed={5} />
        </g>
        {warm > 0 ? <Sun x={1840} y={sunY} r={78} f={f} /> : null}
        {warm > 0.5 ? <Birds x={700 + (f - butAt) * 1.5} y={230} f={f} n={3} /> : null}

        {/* eruption glow */}
        <g opacity={dark * (0.75 + 0.25 * Math.sin(f / 5))}>
          <path d={ellipseD(1500, 230, 330, 230)} fill="#f0843a" opacity={0.35} filter="url(#soft)" />
          <path d={ellipseD(1500, 230, 190, 140)} fill="#f6a24a" opacity={0.4} filter="url(#soft)" />
        </g>
        {/* back range */}
        <Pop s={mountainPop(2)} x={1930} y={650}>
          <Pencil d={mountainD(1930, 650, 420, 280)} fill={C.moss} />
          <Shade d={mountainD(1990, 650, 200, 250)} fill={C.darkGreen} opacity={0.35} />
        </Pop>
        <Pop s={volcanoPop(1)} x={2120} y={660}>
          <g transform={`translate(2120,660) scale(${1 - squash},${1 + squash}) translate(-2120,-660)`}>
            <Pencil d={volcanoD(2120, 660, 420, 80, 300)} fill={C.brown} />
            <Pencil d="M2080,360 Q2120,374 2160,360 Q2120,350 2080,360 Z" fill={C.red} sw={3} />
          </g>
        </Pop>
        {volcanoPop(1) > 0.5 ? <Smoke f={f} x={2120} y={350} power={smokePower * 0.6} seed={2} dark={dark} /> : null}

        {/* main volcano */}
        <Pop s={volcanoPop(0)} x={1500} y={650}>
          <g transform={`translate(1500,650) scale(${1 - squash + quakeWob},${1 + squash - quakeWob}) translate(-1500,-650)`}>
            <Pencil d={volcanoD(1500, 650, 640, 130, 440)} fill={C.brown} />
            <Shade d={volcanoD(1560, 650, 300, 60, 410)} fill={C.darkBrown} opacity={0.3} />
            <Pencil d="M1435,210 Q1500,232 1565,210 Q1500,196 1435,210 Z" fill={erupt > 0 ? C.lava : C.red} sw={3.5} />
            {/* lava streams */}
            <DrawOn d="M1462,214 C1450,280 1430,330 1418,400 S1380,540 1350,640" p={ip(f, [eruptAt + 4, eruptAt + 40], [0, 1])} sw={22} />
            <DrawOn d="M1462,214 C1450,280 1430,330 1418,400 S1380,540 1350,640" p={ip(f, [eruptAt + 4, eruptAt + 40], [0, 1])} sw={13} color={C.lava} />
            <DrawOn d="M1540,214 C1556,300 1580,380 1600,450 S1640,580 1660,644" p={ip(f, [eruptAt + 10, eruptAt + 48], [0, 1])} sw={22} />
            <DrawOn d="M1540,214 C1556,300 1580,380 1600,450 S1640,580 1660,644" p={ip(f, [eruptAt + 10, eruptAt + 48], [0, 1])} sw={13} color={C.red} />
            <VolcanoFace x={1500} y={420} mood={mood} f={f} />
          </g>
        </Pop>
        {volcanoPop(0) > 0.5 ? <Smoke f={f} x={1505} y={190} power={smokePower} dark={dark} /> : null}
        {lavaBombs(f, eruptAt + 2, 1500, 200)}
        <Bang x={1640} y={170} s={pop(f, eruptAt + 2) * ip(f, [eruptAt + 30, eruptAt + 40], [1, 0])} n={2} />

        {/* front mountains */}
        <Pop s={mountainPop(0)} x={900} y={655}>
          <Pencil d={mountainD(900, 655, 380, 270)} fill={C.green} />
          <Shade d={mountainD(950, 655, 180, 240)} fill={C.darkGreen} opacity={0.4} />
        </Pop>
        <Pop s={mountainPop(1)} x={1170} y={650}>
          <g transform={`translate(1170,650) scale(1,${1 + quakeWob * 2}) translate(-1170,-650)`}>
            <Pencil d={mountainD(1170, 650, 430, 340)} fill={C.moss} />
            <Shade d={mountainD(1230, 650, 210, 300)} fill={C.darkGreen} opacity={0.4} />
          </g>
        </Pop>

        {/* the island */}
        <Pencil d={groundD} fill={C.green} />
        <Shade d="M450,702 Q520,676 640,664 L660,690 Q540,700 470,730 Z" fill={C.straw} opacity={0.9} />
        {TREES.map(([x, y, s], i) => (
          <Tree
            key={i}
            x={x}
            y={y}
            s={s * pop(f, mountainsAt + 4 + i * 2, 160, 10)}
            seed={i}
            tilt={Math.sin(f * 0.9 + i) * 9 * quake + (f > coastAt - 6 && f < coastAt + 40 && x < 800 ? -16 * ip(f, [coastAt - 6, coastAt + 4], [0, 1]) * ip(f, [coastAt + 20, coastAt + 40], [1, 0]) : 0)}
          />
        ))}
        {/* earthquake cracks */}
        <DrawOn d="M760,660 l30,18 l-16,22 l34,16 l-10,24" p={ip(f, [quakeAt + 6, shookAt], [0, 1])} sw={5} />
        <DrawOn d="M1240,650 l-24,20 l28,14 l-20,26 l26,20" p={ip(f, [quakeAt + 14, shookAt + 6], [0, 1])} sw={5} />
        <DrawOn d="M1800,656 l26,16 l-22,18 l30,22" p={ip(f, [shookAt - 4, shookAt + 12], [0, 1])} sw={5} />
        <Bang x={1170} y={260} s={pop(f, quakeAt + 4) * ip(f, [nobodyAt - 10, nobodyAt], [1, 0])} n={2} />
        {/* civilization begins */}
        <Pop s={pop(f, civAt - 4, 140, 9) * 1.7} x={1000} y={648}>
          <Ink d="M1000,648 C1000,620 996,600 1004,575" sw={5} color={C.darkGreen} />
          <Pencil d="M1004,590 C980,570 960,575 955,585 C968,596 990,598 1004,590 Z" fill={C.green} sw={3.5} />
          <Pencil d="M1004,580 C1024,556 1046,560 1050,570 C1038,584 1018,586 1004,580 Z" fill={C.green} sw={3.5} />
        </Pop>
        <Sparkle x={930} y={520} s={pop(f, civAt + 2) * (0.8 + 0.2 * Math.sin(f / 4))} />
        <Sparkle x={1075} y={500} s={pop(f, civAt + 8) * (0.8 + 0.2 * Math.sin(f / 5 + 1))} />
        <Label
          x={1000}
          y={400}
          text="civilization starts here!"
          size={68}
          font={FONT_HAND}
          p={ip(f, [civAt - 2, beganAt + 6], [0, 1], (x) => x)}
          rot={-3}
        />
        <DrawOn d="M1000,420 C990,460 1010,490 1000,505" p={ip(f, [beganAt, beganAt + 10], [0, 1])} sw={4.5} />
        <DrawOn d="M984,490 L1000,510 L1016,490" p={ip(f, [beganAt + 8, beganAt + 14], [0, 1])} sw={4.5} />

        {/* the sea */}
        <SeaBand f={f} />
        <Tsunami x={waveX} y={SEA_Y + 10} h={waveH} f={f} />
        {splash > 0 && splash < 1 ? (
          <g opacity={ip(splash, [0.6, 1], [1, 0])}>
            {new Array(9).fill(0).map((_, i) => {
              const a = -Math.PI * (0.15 + 0.7 * (i / 8));
              const d = 60 + splash * 300 * (0.6 + rand(i) * 0.6);
              const r = 26 + rand(i + 4) * 24;
              return (
                <Pencil
                  key={i}
                  d={blobD(460 + Math.cos(a) * d, 680 + Math.sin(a) * d + splash * splash * 160, r, r * 0.8, i + 70, 4, 0.2)}
                  fill={i % 2 ? C.foam : C.sky}
                  sw={3}
                />
              );
            })}
          </g>
        ) : null}

        {/* the brave (and quickly not brave) traveller */}
        {f > nobodyAt - 12 && f < dangerAt + 44 ? (
          <g transform={`translate(${boatX},${SEA_Y + 32 + Math.sin(f / 8) * 5})`}>
            <g transform={boatFlip ? "scale(-1,1)" : undefined}>
              <Person
                x={0}
                y={-6}
                s={0.78}
                tribe="nomad"
                f={f}
                expr={boatExpr}
                look={[1, 0]}
                sit
                aR={boatFlip ? 40 + Math.sin(f / 2) * 50 : 30 + Math.sin(f / 5) * 25}
                hold="paddle"
                seed={4}
              />
              <Pencil d="M-160,-24 Q0,46 160,-24 L146,-42 L-146,-42 Z" fill={C.brown} sw={4} />
              <Ink d="M-120,-30 L120,-30" sw={2.5} opacity={0.6} />
              {boatFlip ? (
                <g opacity={0.8}>
                  <Ink d="M150,-60 L240,-60 M160,-30 L270,-30 M150,0 L230,0" sw={4} />
                </g>
              ) : null}
            </g>
          </g>
        ) : null}
      </Camera>
      {/* bubble lives in screen space so it stays readable */}
      <Bubble
        x={660}
        y={330}
        w={250}
        h={110}
        text="nope."
        size={66}
        tail={[594, 444]}
        s={pop(f, dangerAt + 2) * ip(f, [dangerAt + 34, dangerAt + 42], [1, 0])}
      />
      <Bubble
        x={690}
        y={320}
        w={220}
        h={100}
        text="hmm..."
        size={56}
        tail={[600, 440]}
        thought
        s={pop(f, imagineAt) * ip(f, [dangerAt - 6, dangerAt], [1, 0])}
      />
    </SceneSvg>
  );
};

