import React from "react";
import { C, FONT_HAND, FONT_TITLE, INK, ip, wf } from "../theme";
import {
  Bang,
  Birds,
  Bubble,
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
  smooth,
  Sparkle,
  Sun,
  Pt,
} from "../draw";
import { SceneSvg } from "../Stage";
import { Person } from "../Person";
import { Bush, Granary, PitHouse, RoundTree } from "../Props";
import { japanD } from "../MapArt";

const Backdrop: React.FC<{ f: number; groundY?: number; granary?: boolean; paddy?: boolean }> = ({
  f,
  groundY = 620,
  granary = true,
  paddy = true,
}) => (
  <g>
    <Shade d="M-600,-400 H2700 V760 H-600 Z" fill={C.sky} opacity={0.22} />
    <Sun x={1700} y={170} r={56} f={f} />
    <Cloud x={420} y={170} w={240} h={80} seed={3} />
    <Pencil
      d={smooth(
        [[-600, groundY - 40], [-200, groundY - 150], [300, groundY - 90], [800, groundY - 170], [1300, groundY - 100], [1800, groundY - 160], [2400, groundY - 60]],
        false,
      ) + ` L2400,${groundY + 300} L-600,${groundY + 300} Z`}
      fill={C.moss}
      sw={3.5}
    />
    <Pencil d={`M-600,${groundY} Q960,${groundY - 20} 2600,${groundY} L2600,${groundY + 700} L-600,${groundY + 700} Z`} fill={C.green} />
    {paddy ? (
      <g>
        <Pencil d={`M1180,${groundY + 10} L1900,${groundY + 10} L2000,${groundY + 90} L1120,${groundY + 90} Z`} fill="#a9c3cf" sw={3.5} />
        {new Array(12).fill(0).map((_, i) => (
          <Ink key={i} d={`M${1190 + i * 66},${groundY + 60} l-6,-14 M${1196 + i * 66},${groundY + 60} l0,-18 M${1202 + i * 66},${groundY + 60} l6,-14`} sw={2.5} color={C.darkGreen} />
        ))}
      </g>
    ) : null}
    {granary ? <Granary x={1600} y={groundY + 6} s={0.55} /> : null}
  </g>
);

/* ---------------------------------------------------------------- */
/** "So what happened to the Jomon?" */
export const Peek: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const what = wf(120, "what");
  const happened = wf(121, "happened");
  const jomon = wf(124, "jomon");
  const cam = camAt(f, [
    [from, { x: 960, y: 560, z: 0.98 }],
    [to, { x: 1060, y: 640, z: 1.2 }],
  ]);
  const rise = ip(f, [jomon - 6, jomon + 6], [0, 1]);
  const peekY = 1040 - rise * 250;
  const eyesOn = f > what && rise < 0.3;
  const blink = (f - what) % 40 < 3;
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <Backdrop f={f} />
        <PitHouse x={420} y={640} s={0.6} />
        <RoundTree x={260} y={660} s={0.9} seed={3} />
        <clipPath id="peekClip">
          <rect x={-600} y={-600} width={3000} height={1480} />
        </clipPath>
        {rise > 0 ? (
          <g clipPath="url(#peekClip)">
            <Person x={1100} y={peekY} s={1.1} tribe="jomon" f={f} expr="nervous" look={[-1, 0]} aL={10} aR={10} seed={2} />
          </g>
        ) : null}
        <Bush x={1100} y={900} w={560} h={300} seed={5} shake={rise > 0 && rise < 1 ? Math.sin(f) * 2 : 0} />
        {eyesOn ? (
          <g>
            {[1060, 1120].map((x) => (
              <g key={x}>
                <path d={ellipseD(x, 700, 16, blink ? 2 : 19)} fill={C.white} stroke={INK} strokeWidth={3.5} />
                {!blink ? <path d={ellipseD(x - 5, 703, 8, 9)} fill={INK} /> : null}
              </g>
            ))}
          </g>
        ) : null}
        <Question x={1240} y={540} s={pop(f, happened)} size={110} rot={10} />
        <Question x={1300} y={470} s={pop(f, happened + 8)} size={80} rot={-8} />
        <Question x={950} y={520} s={pop(f, jomon + 4)} size={90} rot={-12} />
      </Camera>
    </SceneSvg>
  );
};

/* ---------------------------------------------------------------- */
/** "The Yayoi did not destroy them." */
export const Meet: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const did = wf(127, "did");
  const destroy = wf(129, "destroy");
  const them = wf(130, "them");
  const offer = them + 6;
  const cam = camAt(f, [
    [from, { x: 960, y: 560, z: 1.0 }],
    [to, { x: 960, y: 580, z: 1.08 }],
  ]);
  const wave = f > did && f < offer ? Math.sin(f / 2) * 35 : 0;
  const calm = f > offer + 4;
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <Backdrop f={f} />
        <RoundTree x={200} y={640} s={1.0} seed={1} />
        <PitHouse x={1780} y={660} s={0.7} />
        <Person
          x={700}
          y={900}
          s={1.15}
          tribe="yayoi"
          f={f}
          expr={f < did ? "smile" : f < offer ? "worry" : "grin"}
          aL={f > did && f < offer ? 120 + wave : 14}
          aR={f > did && f < offer ? 120 - wave : f >= offer ? 72 : 14}
          hold={f >= offer ? "onigiri" : "rice"}
          seed={4}
          look={[1, 0]}
        />
        <Person
          x={1240}
          y={900}
          s={1.15}
          tribe="jomon"
          f={f}
          flip
          expr={calm ? "happy" : f > destroy ? "worry" : "shock"}
          hold={calm ? "none" : "spear"}
          aR={calm ? 30 : 40}
          aL={calm ? 60 : 10}
          seed={8}
          look={[1, 0]}
          lean={calm ? 0 : -6}
        />
        <Bang x={1250} y={560} s={pop(f, from + 2) * ip(f, [did, did + 6], [1, 0])} />
        {/* the crossed-out sword */}
        <Pop s={pop(f, destroy - 6)} x={960} y={380}>
          <g transform="rotate(-35,960,380)">
            <Pencil d="M954,250 L966,250 L970,420 L950,420 Z" fill={C.iron} sw={4} />
            <Pencil d="M926,420 L994,420 L994,436 L926,436 Z" fill={C.darkBrown} sw={3.5} />
            <Pencil d="M952,436 L968,436 L968,490 L952,490 Z" fill={C.brown} sw={3.5} />
          </g>
          <path d={ellipseD(960, 380, 140)} fill="none" stroke={C.red} strokeWidth={10} opacity={0.9} />
        </Pop>
        <DrawOn d="M860,480 L1060,280" p={ip(f, [them - 4, them + 4], [0, 1])} sw={12} color={C.red} />
        <Bubble x={560} y={330} w={300} h={110} text="hungry?" size={60} tail={[640, 430]} s={pop(f, offer)} />
        <Heart x={1240} y={560} s={pop(f, offer + 8) * (1 + 0.1 * Math.sin(f / 3))} />
      </Camera>
    </SceneSvg>
  );
};

/* ---------------------------------------------------------------- */
/** "Instead, the two groups mixed and slowly became one people." */
export const Mix: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const two = wf(133, "two");
  const mixed = wf(135, "mixed");
  const slowly = wf(137, "slowly");
  const one = wf(139, "one");
  const cam = camAt(f, [
    [from, { x: 960, y: 520, z: 0.9 }],
    [to, { x: 960, y: 560, z: 1.0 }],
  ]);
  const start = [250, 440, 630, 1290, 1480, 1670];
  const end = [420, 820, 1220, 620, 1020, 1420];
  const tribes: ("jomon" | "yayoi")[] = ["jomon", "jomon", "jomon", "yayoi", "yayoi", "yayoi"];
  const cheer = f > one - 4;
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <Backdrop f={f} />
        <PitHouse x={240} y={660} s={0.75} />
        <PitHouse x={520} y={630} s={0.55} />
        <Birds x={600} y={200} f={f} n={4} />
        {/* two coloured threads twist together */}
        {[C.terracotta, C.indigo].map((col, k) => {
          const dir = k === 0 ? 1 : -1;
          const pts: Pt[] = [];
          for (let i = 0; i <= 24; i++) {
            const t = i / 24;
            pts.push([960 - dir * (760 - t * 760), 330 + Math.sin(t * Math.PI * 3 + k * Math.PI) * 50 * (1 - t * 0.6)]);
          }
          return <DrawOn key={k} d={smooth(pts, false)} p={ip(f, [mixed - 6, slowly + 6], [0, 1])} sw={12} color={col} />;
        })}
        <Pop s={pop(f, slowly + 4)} x={960} y={330}>
          <Pencil d={ellipseD(960, 330, 30)} fill="#8a4f9e" sw={4} />
        </Pop>
        {start.map((sx, i) => {
          const p = ip(f, [mixed - 4 + (i % 3) * 3, slowly + 14 + (i % 3) * 3], [0, 1]);
          const x = sx + (end[i] - sx) * p;
          const moving = p > 0 && p < 1;
          return (
            <Person
              key={i}
              x={x}
              y={900 + (i % 2) * 20}
              s={1.08}
              tribe={tribes[i]}
              f={f}
              flip={end[i] < sx}
              walk={moving ? f * 0.45 + i : undefined}
              expr={cheer ? "grin" : moving ? "smile" : i % 2 ? "neutral" : "smile"}
              aL={cheer ? 150 + Math.sin(f / 3 + i) * 12 : 10}
              aR={cheer ? 150 + Math.cos(f / 3 + i) * 12 : 10}
              long={i === 1 || i === 4}
              seed={i * 3}
              bob={cheer ? Math.abs(Math.sin(f / 4 + i)) * 14 : 0}
            />
          );
        })}
        <Label x={480} y={560} text="Jomon" size={70} font={FONT_TITLE} color={C.terracotta} p={ip(f, [two - 2, two + 10], [0, 1], (x) => x) * ip(f, [mixed + 10, mixed + 20], [1, 0])} />
        <Label x={1440} y={560} text="Yayoi" size={70} font={FONT_TITLE} color={C.indigo} p={ip(f, [two + 4, two + 16], [0, 1], (x) => x) * ip(f, [mixed + 10, mixed + 20], [1, 0])} />
        <Label x={960} y={220} text="one people" size={96} font={FONT_TITLE} color="#8a4f9e" p={ip(f, [one - 2, one + 14], [0, 1], (x) => x)} rot={-3} />
        {new Array(7).fill(0).map((_, i) => {
          const at = one + 4 + i * 4;
          const t = (f - at) / 40;
          if (t < 0 || t > 1) return null;
          return <Heart key={i} x={420 + i * 170 + Math.sin(t * 6 + i) * 16} y={640 - t * 200} s={ip(t, [0, 0.2], [0, 1]) * ip(t, [0.7, 1], [1, 0])} />;
        })}
      </Camera>
    </SceneSvg>
  );
};

/* ---------------------------------------------------------------- */
const JAPAN_C: Pt = [1360, 592];

const GreenArm: React.FC<{ x: number; y: number; a: number; side: 1 | -1 }> = ({ x, y, a, side }) => (
  <g transform={`translate(${x},${y}) rotate(${side === 1 ? -a : a})`}>
    <Pencil d="M-10,-4 Q-13,46 -8,88 L8,88 Q13,46 10,-4 Z" fill={C.green} sw={4} />
    <Pencil d={ellipseD(0, 94, 15)} fill={C.green} sw={4} />
  </g>
);

/** Japan itself as a character, like the personified maps of the explainer reference. */
export type JapanMood = "smile" | "wink" | "grin" | "sleep" | "shock" | "worry";

export const JapanChar: React.FC<{ f: number; x: number; y: number; s: number; expr: JapanMood; armR: number; armL: number }> = ({
  f,
  x,
  y,
  s,
  expr,
  armR,
  armL,
}) => {
  const face: Pt = [1446, 700];
  const fx = (face[0] - JAPAN_C[0]) * s;
  const fy = (face[1] - JAPAN_C[1]) * s;
  return (
    <g transform={`translate(${x},${y + Math.sin(f / 9) * 6})`}>
      <g transform={`scale(${s}) translate(${-JAPAN_C[0]},${-JAPAN_C[1]})`}>
        {japanD.map((d, i) => (
          <Pencil key={i} d={d} fill={C.green} sw={4.5 / s} off={[3 / s, 2 / s]} />
        ))}
      </g>
      {/* arms sit on top of the islands so they read clearly */}
      <GreenArm x={fx - 58} y={fy + 34} a={armL} side={-1} />
      <GreenArm x={fx + 58} y={fy + 10} a={armR} side={1} />
      {/* face */}
      <g transform={`translate(${fx},${fy})`}>
        {expr === "sleep" ? (
          <Ink d="M-50,2 q16,12 32,0 M10,2 q16,12 32,0" sw={5} />
        ) : (
          <g>
            {expr === "wink" ? (
              <Ink d="M-50,2 q16,-14 32,0" sw={5} />
            ) : (
              <g>
                <path d={ellipseD(-34, 0, 18, 21)} fill={C.white} stroke={INK} strokeWidth={4} />
                <path d={ellipseD(-31, 3, expr === "shock" ? 5 : 9, expr === "shock" ? 6 : 10)} fill={INK} />
                <path d={ellipseD(-28, -1, 3)} fill={C.white} />
              </g>
            )}
            <path d={ellipseD(26, 0, 18, 21)} fill={C.white} stroke={INK} strokeWidth={4} />
            <path d={ellipseD(29, 3, expr === "shock" ? 5 : 9, expr === "shock" ? 6 : 10)} fill={INK} />
            <path d={ellipseD(32, -1, 3)} fill={C.white} />
          </g>
        )}
        {expr === "worry" || expr === "shock" ? <Ink d="M-56,-30 L-20,-38 M48,-30 L12,-38" sw={4.5} /> : null}
        <Shade d={ellipseD(-58, 30, 13, 8)} fill={C.pink} opacity={0.85} />
        <Shade d={ellipseD(52, 30, 13, 8)} fill={C.pink} opacity={0.85} />
        {expr === "grin" ? (
          <g>
            <path d="M-30,30 Q-4,26 22,30 Q18,58 -4,60 Q-26,58 -30,30 Z" fill={C.white} stroke={INK} strokeWidth={4} />
            <Ink d="M-26,42 Q-4,46 18,42" sw={2.5} />
          </g>
        ) : expr === "shock" ? (
          <path d={ellipseD(-4, 44, 10, 13)} fill={INK} />
        ) : expr === "worry" ? (
          <Ink d="M-22,44 Q-12,36 -4,44 Q4,52 14,44" sw={4.5} />
        ) : (
          <Ink d="M-22,34 Q-4,50 14,34" sw={5} />
        )}
      </g>
    </g>
  );
};

const RiceBowl: React.FC = () => (
  <g>
    <Pencil d="M-44,-40 C-30,-74 30,-74 44,-40 Z" fill={C.white} sw={4} />
    <Pencil d="M-56,-40 L56,-40 C52,0 30,14 0,14 C-30,14 -52,0 -56,-40 Z" fill={C.red} sw={4} />
    <Pencil d="M-20,14 L20,14 L18,24 L-18,24 Z" fill={C.darkBrown} sw={3} />
  </g>
);

const MysteryBox: React.FC = () => (
  <g>
    <Pencil d="M-48,-48 L48,-48 L48,48 L-48,48 Z" fill={C.tan} sw={4} />
    <Ink d="M-48,-8 L48,-8 M-8,-48 L-8,48" sw={3} opacity={0.5} />
    <Label x={0} y={30} text="?" size={86} font={FONT_TITLE} halo={false} />
  </g>
);

/** "Remember this, because Japan will do the same thing again and again." + outro */
export const Finale: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const remember = wf(141, "remember");
  const because = wf(143, "because");
  const japan = wf(144, "japan");
  const same = wf(148, "same");
  const again1 = wf(150, "again");
  const again2 = wf(152, "again");
  const outro = again2 + 18;
  const cam = camAt(f, [
    [from, { x: 960, y: 520, z: 0.95 }],
    [outro, { x: 960, y: 520, z: 1.0 }],
    [to, { x: 980, y: 510, z: 1.05 }],
  ]);
  const jx = 1230;
  // little hop when the narrator names Japan
  const hop = f > japan && f < japan + 14 ? Math.sin(((f - japan) / 14) * Math.PI) * 40 : 0;
  const jy = 430 - hop;
  const js = 0.78;
  const taps = f > remember && f < because + 6;
  // things arriving from across the sea, again and again
  const arrivals = [
    { at: same - 12, kind: "rice", from: [-80, 560] as Pt, label: "" },
    { at: again1 - 10, kind: "?", from: [-80, 380] as Pt, label: "again..." },
    { at: again2 - 10, kind: "?", from: [-80, 640] as Pt, label: "...and again!" },
  ];
  const land: Pt = [jx - 150, jy + 130];
  const absorbed = arrivals.filter((a) => f > a.at + 26).length;
  const expr = taps ? "wink" : absorbed > 0 && f < outro + 20 ? "grin" : "smile";
  const fade = ip(f, [to - 24, to], [1, 0]);
  return (
    <SceneSvg f={f}>
      <g opacity={fade}>
        <Camera cam={cam}>
          <Shade d="M-600,-400 H2700 V760 H-600 Z" fill={C.sky} opacity={0.2} />
          <Sun x={180} y={150} r={60} f={f} />
          <Birds x={900} y={150} f={f} n={3} />
          <Cloud x={1760} y={190} w={220} h={80} seed={9} />
          <Pencil d="M-600,780 Q960,760 2600,780 L2600,1500 L-600,1500 Z" fill={C.sea} />
          {new Array(10).fill(0).map((_, i) => (
            <Ink key={i} d={`M${-100 + i * 230 + Math.sin(f / 15 + i) * 12},${830 + (i % 3) * 36} q14,-11 28,0 q14,11 28,0`} sw={3} opacity={0.6} />
          ))}
          <JapanChar
            f={f}
            x={jx}
            y={jy}
            s={js}
            expr={expr}
            armR={taps ? 160 + Math.sin(f / 2) * 8 : f > outro ? 150 + Math.sin(f / 3) * 25 : 30 + absorbed * 8}
            armL={f > same - 14 && f < outro ? 75 : 25}
          />
          {/* the sticky note: what to remember */}
          <Pop s={pop(f, remember + 4) * ip(f, [same - 16, same - 6], [1, 0])} x={520} y={420} rot={-4}>
            <Pencil d="M300,250 L740,236 L752,560 L312,572 Z" fill={C.yellow} sw={4} />
            <Pencil d={ellipseD(526, 254, 14)} fill={C.red} sw={3.5} />
            <Label x={526} y={340} text="remember:" size={62} font={FONT_HAND} halo={false} />
            <Label x={418} y={430} text="Jomon" size={58} font={FONT_TITLE} color={C.terracotta} halo={false} />
            <Label x={520} y={430} text="+" size={58} font={FONT_TITLE} halo={false} />
            <Label x={624} y={430} text="Yayoi" size={58} font={FONT_TITLE} color={C.indigo} halo={false} />
            <Label x={530} y={520} text="= Japan" size={66} font={FONT_TITLE} color={C.red} halo={false} />
          </Pop>
          <Sparkle x={jx + 160} y={jy - 200} s={pop(f, remember + 2) * ip(f, [because, because + 8], [1, 0])} />
          {arrivals.map((a, i) => {
            const t = ip(f, [a.at, a.at + 26], [0, 1], (x) => x);
            const ctrl: Pt = [(a.from[0] + land[0]) / 2, Math.min(a.from[1], land[1]) - 260];
            const path = `M${a.from[0]},${a.from[1]} Q${ctrl[0]},${ctrl[1]} ${land[0]},${land[1]}`;
            const pos: Pt = [
              (1 - t) * (1 - t) * a.from[0] + 2 * (1 - t) * t * ctrl[0] + t * t * land[0],
              (1 - t) * (1 - t) * a.from[1] + 2 * (1 - t) * t * ctrl[1] + t * t * land[1],
            ];
            const trail = ip(f, [a.at + 26, a.at + 40], [1, 0]);
            return (
              <g key={i}>
                {t > 0 ? (
                  <g opacity={trail}>
                    <DrawOn d={path} p={t} sw={6} dotted />
                  </g>
                ) : null}
                {t > 0 && t < 1 ? (
                  <g transform={`translate(${pos[0]},${pos[1]}) rotate(${Math.sin(t * 6) * 14}) scale(${1.2 - t * 0.5})`}>
                    {a.kind === "rice" ? <RiceBowl /> : <MysteryBox />}
                  </g>
                ) : null}
                <Sparkle x={land[0] + 30 - i * 20} y={land[1] - 60 - i * 30} s={pop(f, a.at + 26) * ip(f, [a.at + 40, a.at + 50], [1, 0])} />
                {a.label ? (
                  <Label
                    x={330 + i * 40}
                    y={a.from[1] - 120 + i * 20}
                    text={a.label}
                    size={76}
                    font={FONT_HAND}
                    p={ip(f, [a.at + 8, a.at + 22], [0, 1], (x) => x) * ip(f, [outro + 8, outro + 22], [1, 0], (x) => x)}
                    rot={-6}
                  />
                ) : null}
              </g>
            );
          })}
        </Camera>
      </g>
    </SceneSvg>
  );
};
