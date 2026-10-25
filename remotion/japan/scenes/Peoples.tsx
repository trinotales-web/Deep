import React from "react";
import { C, FONT_HAND, FONT_TITLE, INK, ip, wf } from "../theme";
import {
  Birds,
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
  Pt,
  Puff,
  Shade,
  smooth,
  Sparkle,
  Sun,
} from "../draw";
import { SceneSvg } from "../Stage";
import { MapArt, proj } from "../MapArt";
import { Person } from "../Person";
import {
  Arrowhead,
  Campfire,
  Dotaku,
  Granary,
  IronAxe,
  IronSickle,
  JomonPot,
  Mirror,
  PitHouse,
  quad,
  quadD,
  RoundTree,
} from "../Props";

const Hills: React.FC<{ y: number; shift?: number; color?: string }> = ({ y, shift = 0, color = C.moss }) => {
  const pts: Pt[] = [];
  for (let x = -600; x <= 2600; x += 200) pts.push([x - (shift % 800), y - 60 - Math.abs(Math.sin(x * 0.004)) * 120]);
  return <Pencil d={smooth(pts, false) + ` L2600,${y + 400} L-600,${y + 400} Z`} fill={color} sw={3.5} />;
};

const Ground: React.FC<{ y: number; color?: string }> = ({ y, color = C.green }) => (
  <Pencil d={`M-800,${y} Q960,${y - 18} 2700,${y} L2700,${y + 600} L-800,${y + 600} Z`} fill={color} />
);

const Grass: React.FC<{ y: number; n?: number; seed?: number; x0?: number; x1?: number }> = ({ y, n = 18, seed = 1, x0 = 0, x1 = 1920 }) => (
  <g>
    {new Array(n).fill(0).map((_, i) => {
      const x = x0 + ((i * 397 + seed * 131) % (x1 - x0));
      const yy = y + ((i * 53) % 160);
      return <Ink key={i} d={`M${x - 8},${yy} l4,-14 M${x},${yy} l0,-18 M${x + 8},${yy} l-4,-14`} sw={2.5} opacity={0.65} />;
    })}
  </g>
);

/** Little sailing dugout. */
const Boat: React.FC<{ x: number; y: number; s: number; f: number; people?: "yayoi" | "jomon"; flip?: boolean }> = ({
  x,
  y,
  s,
  f,
  people = "yayoi",
  flip,
}) => (
  <g transform={`translate(${x},${y + Math.sin(f / 7) * 4}) scale(${flip ? -s : s},${s})`}>
    <Ink d="M0,-40 L0,-250" sw={5} />
    <Pencil d="M6,-240 Q90,-170 70,-60 L6,-60 Z" fill={C.white} sw={4} />
    <Person x={-50} y={-10} s={0.62} tribe={people} f={f} sit expr="smile" seed={2} aR={30} hold="none" />
    <Person x={60} y={-10} s={0.62} tribe={people} f={f} sit expr="grin" seed={5} aR={60} hold="rice" />
    <Pencil d="M-150,-24 Q0,44 150,-24 L136,-42 L-136,-42 Z" fill={C.brown} sw={4} />
  </g>
);

/* ---------------------------------------------------------------- */
/** "The first people to settle here were the Jomon, who came from other parts of Asia." */
export const MapJomon: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const settle = wf(60, "settle");
  const here = wf(61, "here");
  const jomon = wf(64, "jomon");
  const came = wf(66, "came");
  const asia = wf(71, "asia");
  const cam = camAt(f, [
    [from, { x: 1110, y: 640, z: 0.86 }],
    [to, { x: 1170, y: 640, z: 0.92 }],
  ]);
  const routes: [Pt, Pt, Pt][] = [
    [[1250, 70], [1640, 0], [1625, 250]],
    [proj(127.3, 35.6), [900, 820], proj(130.6, 33.1)],
    [proj(122.6, 31.4), [780, 1080], proj(129.9, 31.7)],
  ];
  const [hx, hy] = proj(138.3, 36.3);
  const [ax, ay] = proj(118, 42.8);
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <MapArt f={f} />
        {routes.map(([a, c, b], i) => {
          const p = ip(f, [came - 6 + i * 6, asia + 4 + i * 4], [0, 1]);
          const walker = quad(a, c, b, Math.min(1, p * 1.05));
          return (
            <g key={i}>
              <DrawOn d={quadD(a, c, b)} p={p} sw={9} dotted color={C.terracotta} />
              <Arrowhead at={b} from={c} s={ip(p, [0.92, 1], [0, 1])} color={C.terracotta} />
              {p > 0.02 && p < 1 ? (
                <Person x={walker[0]} y={walker[1] + 10} s={0.34} tribe="jomon" f={f} walk={f * 0.5} expr="smile" seed={i} flip={b[0] < a[0]} />
              ) : null}
            </g>
          );
        })}
        {/* the settlers' pin */}
        <Pop s={pop(f, settle + 4, 180, 9)} x={hx} y={hy}>
          <Ink d={`M${hx},${hy} L${hx},${hy - 110}`} sw={6} />
          <Pencil d={`M${hx + 3},${hy - 110} L${hx + 76},${hy - 92} L${hx + 3},${hy - 70} Z`} fill={C.terracotta} sw={4} />
        </Pop>
        <Person
          x={hx - 70}
          y={hy + 20}
          s={0.62 * pop(f, jomon - 2, 180, 10)}
          tribe="jomon"
          f={f}
          expr="grin"
          aR={150 + Math.sin(f / 3) * 20}
          aL={20}
          seed={7}
        />
        <Label x={proj(144.6, 36.4)[0]} y={proj(144.6, 36.4)[1]} text="JOMON" size={104} font={FONT_TITLE} color={C.terracotta} p={ip(f, [jomon, jomon + 14], [0, 1], (x) => x)} rot={-8} />
        <Label x={proj(141.5, 33.7)[0]} y={proj(141.5, 33.7)[1]} text="(say: joe-mon)" size={46} font={FONT_HAND} p={ip(f, [jomon + 10, jomon + 26], [0, 1], (x) => x)} rot={-8} />
        <Label x={ax} y={ay} text="ASIA" size={120} font={FONT_TITLE} p={ip(f, [asia - 4, asia + 10], [0, 1], (x) => x)} rot={-4} />
        <Sparkle x={hx + 110} y={hy - 140} s={pop(f, here + 2) * ip(f, [here + 30, here + 40], [1, 0])} />
      </Camera>
    </SceneSvg>
  );
};

/* ---------------------------------------------------------------- */
/** "Most early humans kept moving from place to place." */
export const Walk: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const t = f - from;
  const scroll = t * 14;
  const place1 = wf(78, "place");
  const tiredAt = wf(79, "to");
  const dayP = ip(f, [from, to], [0, 1], (x) => x);
  const sunA = Math.PI * (1.05 + dayP * 0.9);
  const sunX = 960 + Math.cos(sunA) * 760;
  const sunY = 620 + Math.sin(sunA) * 470;
  const night = ip(f, [to - 34, to - 6], [0, 1]);
  const signs = [
    { x: 1500, text: "camp 1" },
    { x: 2250, text: "camp 2" },
    { x: 3000, text: "camp 3" },
  ];
  const ground = 790;
  return (
    <SceneSvg f={f}>
      <Shade d="M-100,-100 H2100 V800 H-100 Z" fill={C.sky} opacity={0.25} />
      <Shade d="M-100,-100 H2100 V800 H-100 Z" fill="#3c4a78" opacity={0.45 * night} />
      {night < 0.6 ? <Sun x={sunX} y={sunY} r={62} f={f} /> : null}
      {night > 0.3 ? (
        <g opacity={ip(night, [0.3, 0.8], [0, 1])}>
          <Pencil d={`M${sunX - 40},${sunY - 50} A62,62 0 1,0 ${sunX + 40},${sunY + 50} A48,48 0 1,1 ${sunX - 40},${sunY - 50} Z`} fill={C.yellow} />
        </g>
      ) : null}
      <Cloud x={600 - scroll * 0.2} y={200} w={240} h={80} seed={4} />
      <Cloud x={1500 - scroll * 0.2} y={150} w={200} h={70} seed={8} />
      <Hills y={640} shift={scroll * 0.35} color={C.moss} />
      <Pencil d={`M-200,${ground - 30} Q960,${ground - 46} 2200,${ground - 30} L2200,1200 L-200,1200 Z`} fill={C.green} />
      <Pencil d={`M-200,${ground - 4} Q960,${ground - 14} 2200,${ground - 4} L2200,${ground + 60} Q960,${ground + 50} -200,${ground + 60} Z`} fill={C.tan} sw={3.5} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const x = ((i * 420 - scroll) % 2520) + (i * 420 - scroll < 0 ? 2520 : 0) - 300;
        return <RoundTree key={i} x={x} y={ground - 34} s={0.75 + (i % 3) * 0.1} seed={i} />;
      })}
      {signs.map((sg, i) => {
        const x = sg.x - scroll;
        if (x < -200 || x > 2200) return null;
        return (
          <g key={i}>
            <Pencil d={`M${x - 6},${ground + 10} L${x - 5},${ground - 130} L${x + 5},${ground - 130} L${x + 6},${ground + 10} Z`} fill={C.brown} sw={3.5} />
            <Pencil d={`M${x - 90},${ground - 200} L${x + 90},${ground - 200} L${x + 110},${ground - 165} L${x + 90},${ground - 130} L${x - 90},${ground - 130} Z`} fill={C.tan} sw={4} />
            <Label x={x + 6} y={ground - 150} text={sg.text} size={44} font={FONT_HAND} halo={false} />
            {i < 2 && x < 700 ? (
              <Ink d={`M${x - 80},${ground - 190} L${x + 96},${ground - 140}`} sw={5} color={C.red} />
            ) : null}
          </g>
        );
      })}
      {/* footprints trail */}
      {new Array(16).fill(0).map((_, i) => {
        const x = 640 - i * 46 + ((scroll * 1) % 46);
        return <path key={i} d={ellipseD(x, ground + 30 + (i % 2) * 14, 8, 5)} fill={INK} opacity={0.35} />;
      })}
      {[
        { x: 700, s: 1.15, hold: "spear" as const, seed: 1, long: false },
        { x: 960, s: 0.95, hold: "none" as const, seed: 4, long: true },
        { x: 1210, s: 1.2, hold: "bundle" as const, seed: 7, long: false },
      ].map((p, i) => (
        <Person
          key={i}
          x={p.x}
          y={ground + 22}
          s={p.s}
          tribe="nomad"
          f={f}
          walk={f * 0.42 + i * 1.7}
          expr={f > tiredAt ? "tired" : "smile"}
          hold={p.hold}
          long={p.long}
          seed={p.seed}
          look={[1, 0]}
          lean={f > tiredAt ? 6 : 0}
        />
      ))}
      <Label x={1400} y={300} text="again..." size={64} font={FONT_HAND} p={ip(f, [place1, place1 + 12], [0, 1], (x) => x)} rot={-6} />
      <Label x={1560} y={380} text="and again..." size={64} font={FONT_HAND} p={ip(f, [tiredAt + 4, tiredAt + 18], [0, 1], (x) => x)} rot={-6} />
    </SceneSvg>
  );
};

/* ---------------------------------------------------------------- */
/** "But the Jomon built villages and stayed in one place." */
export const Village: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const built = wf(84, "built");
  const villages = wf(85, "villages");
  const stayed = wf(87, "stayed");
  const one = wf(89, "one");
  const cam = camAt(f, [
    [from, { x: 960, y: 540, z: 0.98 }],
    [to, { x: 990, y: 560, z: 1.08 }],
  ]);
  const walkX = ip(f, [from - 4, built - 4], [430, 900]);
  const walking = f < built - 4;
  const houses = [
    { x: 1360, y: 640, s: 0.72, at: built - 6 },
    { x: 560, y: 690, s: 0.95, at: built + 2 },
    { x: 1640, y: 720, s: 1.05, at: villages + 2 },
    { x: 280, y: 760, s: 0.8, at: villages + 10 },
  ];
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <Shade d="M-400,-300 H2400 V700 H-400 Z" fill={C.sky} opacity={0.22} />
        <Sun x={1650} y={170} r={58} f={f} />
        <Birds x={400} y={170} f={f} n={3} />
        <Hills y={600} color={C.moss} />
        {[120, 340, 760, 1020, 1200, 1820, 1980].map((x, i) => (
          <RoundTree key={i} x={x} y={600} s={0.8 + (i % 3) * 0.12} seed={i + 2} />
        ))}
        <Ground y={620} />
        <Grass y={760} n={22} seed={2} />
        {houses.map((h, i) => (
          <g key={i}>
            <Pop s={pop(f, h.at, 170, 10)} x={h.x} y={h.y}>
              <PitHouse x={h.x} y={h.y} s={h.s} />
            </Pop>
            <Puff x={h.x} y={h.y} p={ip(f, [h.at, h.at + 22], [0, 1], (x) => x)} size={70 * h.s} fill={C.tan} seed={i + 4} />
            {f > h.at + 20 ? (
              <g opacity={0.8}>
                {[0, 1, 2].map((k) => {
                  const tt = ((f + k * 14 + i * 9) % 42) / 42;
                  return (
                    <Pencil
                      key={k}
                      d={blobD(h.x + Math.sin(tt * 5) * 8 + tt * 30, h.y - 230 * h.s - tt * 110, 12 + tt * 18, 10 + tt * 14, k + i, 5, 0.15)}
                      fill={C.gray}
                      sw={3}
                      opacity={ip(tt, [0, 0.15], [0, 1]) * ip(tt, [0.6, 1], [1, 0])}
                    />
                  );
                })}
              </g>
            ) : null}
          </g>
        ))}
        <Campfire x={1110} y={840} f={f} s={1.1} />
        <JomonPot x={1250} y={860} s={0.8} />
        <Person x={1430} y={880} s={0.9} tribe="jomon" f={f} expr="smile" long hold="fish" aR={20} seed={9} flip />
        {walking ? (
          <Person x={walkX} y={880} s={1.0} tribe="jomon" f={f} walk={f * 0.45} expr="smile" hold="spear" seed={3} />
        ) : (
          <Person
            x={900}
            y={880}
            s={1.0}
            tribe="jomon"
            f={f}
            expr={f > stayed ? "happy" : "smile"}
            sit={f > stayed}
            hold="spear"
            aL={f > stayed ? 40 : 8}
            aR={f > stayed ? 24 : 8}
            seed={3}
          />
        )}
        <Heart x={960} y={600} s={pop(f, stayed + 6) * (1 + 0.08 * Math.sin(f / 4))} />
        <Label x={1060} y={560} text="ahh..." size={56} font={FONT_HAND} p={ip(f, [stayed + 4, stayed + 16], [0, 1], (x) => x)} />
        {/* "home" sign stakes this one place */}
        <Pop s={pop(f, one - 2, 190, 9)} x={700} y={900}>
          <Pencil d="M694,900 L695,780 L705,780 L706,900 Z" fill={C.brown} sw={3.5} />
          <Pencil d="M630,720 L770,720 L770,790 L630,790 Z" fill={C.tan} sw={4} />
          <Label x={700} y={770} text="home" size={50} font={FONT_HAND} halo={false} />
        </Pop>
        <Sparkle x={800} y={700} s={pop(f, one + 4) * (0.8 + 0.2 * Math.sin(f / 3))} />
      </Camera>
    </SceneSvg>
  );
};

/* ---------------------------------------------------------------- */
/** "After them came the Yayoi, from the area around China and Korea." */
export const MapYayoi: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const came = wf(93, "came");
  const yayoi = wf(95, "yayoi");
  const area = wf(98, "area");
  const china = wf(100, "china");
  const korea = wf(102, "korea");
  const cam = camAt(f, [
    [from, { x: 840, y: 720, z: 0.92 }],
    [to, { x: 880, y: 740, z: 0.98 }],
  ]);
  const a = proj(127.7, 34.9);
  const c: Pt = [912, 836];
  const b = proj(130.3, 33.75);
  const [cx, cy] = proj(121.6, 37.1);
  const huts: Pt[] = [proj(131.0, 32.6), proj(133.6, 34.9), proj(137.0, 35.6), proj(139.7, 36.3), proj(140.8, 39.3)];
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <MapArt f={f} />
        {huts.map(([x, y], i) => (
          <PitHouse key={i} x={x} y={y + 10} s={0.2} />
        ))}
        <Label x={proj(138.6, 38.5)[0]} y={proj(138.6, 38.5)[1]} text="Jomon" size={72} font={FONT_TITLE} color={C.terracotta} rot={-30} />
        <DrawOn d={quadD(a, c, b)} p={ip(f, [came - 4, came + 40], [0, 1])} sw={6} dotted color={C.indigo} />
        <Arrowhead at={b} from={c} s={ip(f, [came + 34, came + 42], [0, 1])} color={C.indigo} />
        {[0, 1].map((i) => {
          const p = ip(f, [came - 2 + i * 14, came + 48 + i * 14], [0, 1]);
          if (p <= 0) return null;
          const [x, y] = quad(a, c, b, p);
          return <Boat key={i} x={x + i * -40} y={y + 14 + i * 36} s={0.46} f={f + i * 10} />;
        })}
        <Label x={proj(125.2, 32.8)[0]} y={proj(125.2, 32.8)[1]} text="YAYOI" size={104} font={FONT_TITLE} color={C.indigo} p={ip(f, [yayoi - 2, yayoi + 12], [0, 1], (x) => x)} rot={-6} />
        <Label x={proj(125.2, 31.6)[0]} y={proj(125.2, 31.6)[1]} text="(say: yah-yoy)" size={44} font={FONT_HAND} p={ip(f, [yayoi + 10, yayoi + 26], [0, 1], (x) => x)} rot={-6} />
        <DrawOn d={`M${cx - 420},${cy} a420,280 0 1,0 840,0 a420,280 0 1,0 -840,0`} p={ip(f, [area - 4, area + 26], [0, 1])} sw={6} dotted color={C.indigo} />
        <Label x={proj(116.3, 35.6)[0]} y={proj(116.3, 35.6)[1]} text="CHINA" size={100} font={FONT_TITLE} p={ip(f, [china - 2, china + 10], [0, 1], (x) => x)} rot={-4} />
        <Label x={proj(127.6, 38.3)[0]} y={proj(127.6, 38.3)[1]} text="KOREA" size={76} font={FONT_TITLE} p={ip(f, [korea - 2, korea + 10], [0, 1], (x) => x)} rot={-12} />
      </Camera>
    </SceneSvg>
  );
};

/* ---------------------------------------------------------------- */
/** "The Yayoi knew how to grow rice and how to make tools from iron and bronze." */
export const Rice: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const knew = wf(105, "knew");
  const grow = wf(108, "grow");
  const rice = wf(109, "rice");
  const tools = wf(114, "tools");
  const iron = wf(116, "iron");
  const bronze = wf(118, "bronze");
  const cam = camAt(f, [
    [from, { x: 700, y: 560, z: 1.0 }],
    [tools - 10, { x: 760, y: 560, z: 1.03 }],
    [tools + 14, { x: 1180, y: 540, z: 0.86 }],
    [to, { x: 1200, y: 540, z: 0.9 }],
  ]);
  const farY = 560;
  const nearY = 920;
  const sprouts = [];
  for (let j = 0; j < 6; j++) {
    const d = (j + 0.5) / 6;
    const y = farY + (nearY - farY) * Math.pow(d, 1.25);
    const xl = 150 + (-120 - 150) * d;
    const xr = 1120 + (1330 - 1120) * d;
    for (let i = 0; i < 9; i++) {
      const x = xl + ((i + 0.5) / 9) * (xr - xl);
      const at = grow - 6 + (i + (5 - j)) * 1.5;
      const s = pop(f, at, 220, 12) * (0.5 + 0.7 * d);
      if (s <= 0.01) continue;
      const tall = ip(f, [rice, rice + 18], [1, 1.7]);
      const gold = ip(f, [rice + 4, rice + 20], [0, 1]);
      sprouts.push(
        <g key={`${i}-${j}`} transform={`translate(${x},${y}) scale(${s})`}>
          <Ink d={`M0,0 Q-14,${-26 * tall} -22,${-40 * tall} M0,0 L0,${-48 * tall} M0,0 Q14,${-26 * tall} 22,${-40 * tall}`} sw={4} color={C.darkGreen} />
          {gold > 0 ? (
            <g opacity={gold}>
              <Pencil d={blobD(-20, -44 * tall, 7, 14, i + j, 3, 0.1)} fill={C.rice} sw={2.5} />
              <Pencil d={blobD(2, -54 * tall, 7, 15, i + j + 3, 3, 0.1)} fill={C.rice} sw={2.5} />
              <Pencil d={blobD(22, -44 * tall, 7, 14, i + j + 6, 3, 0.1)} fill={C.rice} sw={2.5} />
            </g>
          ) : null}
        </g>,
      );
    }
  }
  const items = [
    { at: tools, x: 1430, y: 560, el: <IronSickle x={1430} y={560} s={1.2} /> },
    { at: iron - 4, x: 1600, y: 560, el: <IronAxe x={1600} y={560} s={1.1} /> },
    { at: bronze - 6, x: 1820, y: 560, el: <Dotaku x={1820} y={560} s={1.15} /> },
    { at: bronze + 2, x: 2010, y: 560, el: <Mirror x={2010} y={560} s={1.15} /> },
  ];
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <Shade d="M-600,-400 H2700 V700 H-600 Z" fill={C.sky} opacity={0.22} />
        <Sun x={300} y={180} r={58} f={f} />
        <Hills y={560} color={C.moss} />
        <Granary x={1240} y={560} s={0.62} />
        <Ground y={550} color={C.green} />
        {/* the paddy */}
        <Pencil d={`M150,${farY} L1120,${farY} L1330,${nearY + 60} L-120,${nearY + 60} Z`} fill="#a9c3cf" />
        <Shade d={`M260,${farY + 30} L600,${farY + 30} L540,${farY + 90} L180,${farY + 90} Z`} fill={C.white} opacity={0.45} />
        <Ink d={`M630,${farY} L600,${nearY + 60} M150,${farY + 150} L1190,${farY + 150}`} sw={6} color={C.tan} />
        <Ink d={`M630,${farY} L600,${nearY + 60} M150,${farY + 150} L1190,${farY + 150}`} sw={2} opacity={0.5} />
        {sprouts}
        <Person
          x={430}
          y={830}
          s={1.0}
          tribe="yayoi"
          f={f}
          expr={f > rice ? "grin" : "smile"}
          lean={f < knew ? 0 : f < rice ? 18 + Math.sin(f / 4) * 6 : 0}
          hold="rice"
          aR={f > rice ? 150 : 50}
          seed={6}
        />
        <Ink d="M360,840 q30,-10 60,0 q30,10 60,0" sw={3} opacity={0.6} />
        {/* the new tools */}
        <Pencil d="M1340,700 L2110,700 L2110,730 L1340,730 Z" fill={C.brown} sw={4} />
        <Pencil d="M1370,730 L1385,860 L1400,730 Z M2050,730 L2065,860 L2080,730 Z" fill={C.darkBrown} sw={3.5} />
        {items.map((it, i) => (
          <g key={i}>
            <Pop s={pop(f, it.at, 200, 10)} x={it.x} y={it.y + 120}>
              {it.el}
            </Pop>
            <Sparkle x={it.x + 70} y={it.y - 90} s={pop(f, it.at + 4) * ip(f, [it.at + 26, it.at + 36], [1, 0])} />
          </g>
        ))}
        <Label x={1515} y={810} text="iron" size={72} font={FONT_TITLE} color="#5d636e" p={ip(f, [iron - 2, iron + 8], [0, 1], (x) => x)} />
        <Label x={1915} y={810} text="bronze" size={72} font={FONT_TITLE} color="#b0742a" p={ip(f, [bronze - 2, bronze + 10], [0, 1], (x) => x)} />
        <Label x={700} y={470} text="rice!" size={84} font={FONT_TITLE} color="#b58b1f" p={ip(f, [rice, rice + 8], [0, 1], (x) => x)} rot={-6} />
      </Camera>
    </SceneSvg>
  );
};

