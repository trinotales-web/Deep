import React from "react";
import { C, FONT_HAND, FONT_TITLE, ip } from "../theme";
import {
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
  Shade,
  Sparkle,
  Sun,
} from "../draw";
import { SceneSvg } from "../Stage";
import { MapArt, proj } from "../MapArt";
import { Person } from "../Person";
import { quad, quadD } from "../Props";
import { Buddha, FestivalDrum, Incense, Lanterns, ModernCity, Pagoda, Shrine, Torii } from "../Props2";
import { JapanChar } from "../scenes/Together";
import { w2 } from "../part2cues";
import { TitleScene } from "../scenes/Opening";

export const Title2: React.FC<{ f: number }> = ({ f }) => (
  <TitleScene
    f={f}
    subtitle="part 2 · gods, emperors & samurai"
    doodles={
      <g>
        <DrawOn d="M440,770 L1480,770" p={ip(f, [18, 50], [0, 1])} sw={4} />
        <Pop s={pop(f, 36)} x={470} y={770}>
          <Torii x={470} y={770} s={0.34} />
        </Pop>
        <Pop s={pop(f, 44)} x={1460} y={770}>
          <Pagoda x={1460} y={770} s={0.26} />
        </Pop>
        <Pop s={pop(f, 52)} x={960} y={770}>
          <g transform="translate(960,742) rotate(-8)">
            <Pencil d="M-150,-6 L120,-14 L124,-2 L-148,6 Z" fill="#3a2226" sw={3} />
            <Pencil d="M-150,-8 L-210,-6 L-210,6 L-150,8 Z" fill="#2b2b35" sw={3} />
            <Pencil d={ellipseD(-150, 0, 6, 16)} fill={C.bronze} sw={2.5} />
          </g>
        </Pop>
      </g>
    }
  />
);

/** "In 538, a new religion arrived from Korea. It was Buddhism." */
export const BuddhismArrives: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const year = w2(1, "five");
  const arrived = w2(7, "arrived");
  const korea = w2(9, "korea");
  const buddhism = w2(12, "buddhism");
  const a = proj(126.7, 34.9);
  const c = proj(128.6, 33.2);
  const b = proj(130.4, 33.85);
  const p = ip(f, [arrived - 4, buddhism - 4], [0, 1]);
  const boat = quad(a, c, b, p);
  const reveal = pop(f, buddhism - 2, 120, 12);
  const cam = camAt(f, [
    [from, { x: 920, y: 700, z: 1.0 }],
    [buddhism - 6, { x: 960, y: 760, z: 1.1 }],
    [to, { x: 1000, y: 700, z: 1.2 }],
  ]);
  const [kx, ky] = proj(127.4, 37.6);
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <MapArt f={f} />
        <Label x={kx} y={ky} text="KOREA" size={80} font={FONT_TITLE} p={ip(f, [korea - 4, korea + 8], [0, 1], (x) => x)} rot={-12} />
        <DrawOn d={quadD(a, c, b)} p={p} sw={7} dotted color={C.bronze} />
        {p > 0 ? (
          <g transform={`translate(${boat[0]},${boat[1] + 6 + Math.sin(f / 7) * 3}) scale(0.72)`}>
            <Buddha x={40} y={-40} s={0.42} glow={0} />
            <Person x={-70} y={-12} s={0.62} tribe="monk" f={f} sit expr="smile" hold="beads" aR={30} seed={3} />
            <Pencil d="M-160,-24 Q0,44 160,-24 L146,-42 L-146,-42 Z" fill={C.brown} sw={4} />
          </g>
        ) : null}
        {/* the big reveal */}
        <Pop s={reveal * 0.9} x={b[0] + 80} y={b[1] - 40}>
          <Buddha x={b[0] + 80} y={b[1] - 40} s={0.9} glow={ip(f, [buddhism, buddhism + 12], [0, 1])} />
        </Pop>
        <Label x={b[0] + 80} y={b[1] + 60} text="BUDDHISM" size={86} font={FONT_TITLE} color="#b0742a" p={ip(f, [buddhism + 2, buddhism + 14], [0, 1], (x) => x)} />
      </Camera>
      {/* the year stamp sits on the frame, like a date in a storybook */}
      <Pop s={pop(f, year, 200, 10)} x={250} y={200} rot={-8}>
        <Pencil d={ellipseD(250, 200, 140, 92)} fill={C.white} sw={5} />
        <Label x={250} y={236} text="538" size={110} font={FONT_TITLE} color={C.red} halo={false} />
        <Label x={250} y={146} text="the year" size={36} font={FONT_HAND} halo={false} />
      </Pop>
    </SceneSvg>
  );
};

const MixingBowl: React.FC<{ x: number; y: number; s: number; f: number; stir: number }> = ({ x, y, s, f, stir }) =>
  s <= 0.01 ? null : (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <Pencil d="M-170,-40 Q-160,90 0,96 Q160,90 170,-40 Z" fill={C.brown} />
      <Pencil d={ellipseD(0, -40, 170, 34)} fill={C.tan} sw={4} />
      {stir > 0 ? (
        <g transform={`rotate(${Math.sin(f / 4) * 18 * stir},0,-40)`}>
          <Pencil d="M-8,-40 L8,-40 L22,-230 L10,-232 Z" fill={C.straw} sw={3.5} />
        </g>
      ) : null}
      <Ink d={`M-80,-44 q${20 + Math.sin(f / 3) * 10},-14 40,0 q20,14 40,0`} sw={3} opacity={0.6} />
    </g>
  );

/** "And just like with the Jomon, Japan mixed the new with the old. It did not
 * give up its own religion, Shinto. Instead, it kept both." */
export const KeepsBoth: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const jomon = w2(18, "jomon");
  const mixed = w2(20, "mixed");
  const neu = w2(22, "new");
  const old = w2(25, "old");
  const didNot = w2(27, "did");
  const own = w2(32, "own");
  const shinto = w2(34, "shinto");
  const kept = w2(37, "kept");
  const both = w2(38, "both");
  const cam = camAt(f, [
    [from, { x: 960, y: 520, z: 0.95 }],
    [to, { x: 960, y: 540, z: 1.02 }],
  ]);
  const bowl = pop(f, mixed - 6) * ip(f, [didNot - 6, didNot + 4], [1, 0]);
  // items drop into the bowl
  const drop = (at: number) => ip(f, [at, at + 14], [0, 1]);
  const toriiShow = pop(f, own - 4, 160, 10);
  const buddhaShow = pop(f, kept - 2, 160, 10);
  const hug = f > own && f < kept;
  const expr = f > kept ? "grin" : hug ? "smile" : f > mixed ? "grin" : "smile";
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <Shade d="M-600,-400 H2700 V760 H-600 Z" fill={C.sky} opacity={0.2} />
        <Sun x={250} y={170} r={56} f={f} />
        <Cloud x={1680} y={180} w={240} h={80} seed={5} />
        <Pencil d="M-600,800 Q960,780 2600,800 L2600,1500 L-600,1500 Z" fill={C.sea} />
        {new Array(9).fill(0).map((_, i) => (
          <Ink key={i} d={`M${-60 + i * 240 + Math.sin(f / 15 + i) * 12},${850 + (i % 3) * 30} q14,-11 28,0 q14,11 28,0`} sw={3} opacity={0.6} />
        ))}
        <Pop s={toriiShow} x={470} y={830}>
          <Torii x={470} y={830} s={0.95} />
        </Pop>
        <Pop s={buddhaShow} x={1480} y={820}>
          <Buddha x={1480} y={820} s={0.85} glow={0.6} />
        </Pop>
        <JapanChar
          f={f}
          x={990}
          y={410}
          s={0.72}
          expr={expr === "grin" ? "grin" : "smile"}
          armL={f > own ? 70 : f > mixed && f < didNot ? 30 + Math.sin(f / 4) * 10 : 25}
          armR={f > kept ? 70 : f > mixed && f < didNot ? 110 + Math.sin(f / 4) * 20 : 25}
        />
        <MixingBowl x={980} y={760} s={bowl} f={f} stir={f > mixed ? 1 : 0} />
        {bowl > 0.5 ? (
          <g>
            {[
              { at: neu - 6, x0: 1500, label: "new", el: <Buddha x={0} y={0} s={0.28} glow={0} /> },
              { at: old - 6, x0: 420, label: "old", el: <Torii x={0} y={0} s={0.3} /> },
            ].map((it, i) => {
              const t = drop(it.at);
              if (t <= 0 || t >= 1) return null;
              const x = it.x0 + (980 - it.x0) * t;
              const y = 520 - Math.sin(t * Math.PI) * 220 + t * 200;
              return (
                <g key={i} transform={`translate(${x},${y}) rotate(${t * 200 * (i ? -1 : 1)})`}>
                  {it.el}
                </g>
              );
            })}
            <Label x={1500} y={430} text="new" size={66} font={FONT_HAND} p={ip(f, [neu - 8, neu], [0, 1], (x) => x) * ip(f, [neu + 10, neu + 16], [1, 0])} />
            <Label x={420} y={430} text="old" size={66} font={FONT_HAND} p={ip(f, [old - 8, old], [0, 1], (x) => x) * ip(f, [old + 10, old + 16], [1, 0])} />
          </g>
        ) : null}
        {/* "just like with the Jomon" — a memory of Part 1 */}
        <Bubble x={560} y={240} w={330} h={150} text="" thought tail={[820, 360]} s={pop(f, jomon - 4) * ip(f, [mixed - 2, mixed + 6], [1, 0])} fill={C.white} />
        {f > jomon - 2 && f < mixed + 4 ? (
          <g opacity={ip(f, [jomon - 2, jomon + 4], [0, 1]) * ip(f, [mixed - 2, mixed + 4], [1, 0])}>
            <Person x={480} y={300} s={0.34} tribe="jomon" f={f} expr="grin" seed={1} />
            <Label x={560} y={262} text="+" size={60} font={FONT_TITLE} halo={false} />
            <Person x={640} y={300} s={0.34} tribe="yayoi" f={f} expr="grin" seed={2} />
          </g>
        ) : null}
        <Label x={470} y={470} text="SHINTO" size={88} font={FONT_TITLE} color="#d8573a" p={ip(f, [shinto - 2, shinto + 10], [0, 1], (x) => x)} rot={-4} />
        <Label x={470} y={540} text="(Japan's own)" size={44} font={FONT_HAND} p={ip(f, [shinto + 8, shinto + 22], [0, 1], (x) => x)} rot={-4} />
        {hug ? <Heart x={640} y={560} s={pop(f, own + 6) * (1 + 0.08 * Math.sin(f / 3))} color={C.red} /> : null}
        <Label x={980} y={150} text="both!" size={96} font={FONT_TITLE} color={C.red} p={ip(f, [both - 2, both + 8], [0, 1], (x) => x)} rot={-3} />
        {[0, 1, 2, 3].map((i) => (
          <Heart key={i} x={760 + i * 150} y={250 - (i % 2) * 40} s={pop(f, both + 4 + i * 3) * ip(f, [to - 10, to], [1, 0.6])} />
        ))}
        <Sparkle x={1600} y={420} s={pop(f, kept + 4) * (0.8 + 0.2 * Math.sin(f / 4))} />
        <Sparkle x={330} y={380} s={pop(f, shinto + 2) * (0.8 + 0.2 * Math.sin(f / 4))} />
      </Camera>
    </SceneSvg>
  );
};

/** "Shinto was for births and festivals, and Buddhism was for funerals." */
export const ShrineTemple: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const shinto = w2(39, "shinto");
  const births = w2(42, "births");
  const festivals = w2(44, "festivals");
  const buddhism = w2(46, "buddhism");
  const funerals = w2(49, "funerals");
  const cam = camAt(f, [
    [from, { x: 960, y: 540, z: 1.0 }],
    [to, { x: 960, y: 540, z: 1.04 }],
  ]);
  const hop = f > festivals ? Math.abs(Math.sin((f - festivals) / 5)) * 30 : 0;
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        {/* left: Shinto, bright */}
        <Shade d="M-200,-200 H960 V1300 H-200 Z" fill={C.sky} opacity={0.22} />
        <Pencil d="M-200,640 Q480,620 960,640 L960,1300 L-200,1300 Z" fill={C.green} />
        <Shrine x={560} y={650} s={0.95} />
        <Torii x={180} y={900} s={0.82} />
        <Label x={420} y={120} text="SHINTO" size={88} font={FONT_TITLE} color="#d8573a" p={ip(f, [shinto - 4, shinto + 8], [0, 1], (x) => x)} />
        <Pop s={pop(f, births - 4)} x={460} y={900}>
          <Person x={400} y={900} s={0.9} tribe="yayoi" long f={f} hold="baby" aR={60} expr="happy" seed={2} />
          <Person x={590} y={900} s={0.9} tribe="priest" f={f} hold="gohei" aR={110 + Math.sin(f / 3) * 25} expr="smile" seed={5} flip />
        </Pop>
        <Heart x={470} y={620} s={pop(f, births + 6) * (1 + 0.08 * Math.sin(f / 3))} />
        <Label x={300} y={560} text="births" size={60} font={FONT_HAND} p={ip(f, [births, births + 10], [0, 1], (x) => x)} rot={-4} />
        {f > festivals - 4 ? (
          <g>
            <Pop s={pop(f, festivals - 4)} x={480} y={260}>
              <Lanterns x0={60} x1={900} y={240} f={f} n={7} />
            </Pop>
            <Pop s={pop(f, festivals)} x={820} y={900}>
              <FestivalDrum x={830} y={900} s={0.8} hit={Math.abs(Math.sin(f / 3))} />
            </Pop>
            <Person x={720} y={930 - hop} s={0.75} tribe="yayoi" f={f} aL={150} aR={150} expr="grin" seed={7} />
            <Label x={760} y={560} text="festivals" size={60} font={FONT_HAND} p={ip(f, [festivals, festivals + 10], [0, 1], (x) => x)} rot={-4} />
          </g>
        ) : null}
        {/* right: Buddhism, quiet */}
        <Shade d="M960,-200 H2200 V1300 H960 Z" fill="#8f9bb0" opacity={0.25} />
        <Pencil d="M960,640 Q1440,620 2200,640 L2200,1300 L960,1300 Z" fill={C.moss} />
        <Pagoda x={1620} y={680} s={0.85} />
        <Label x={1460} y={120} text="BUDDHISM" size={88} font={FONT_TITLE} color="#b0742a" p={ip(f, [buddhism - 4, buddhism + 10], [0, 1], (x) => x)} />
        <Pop s={pop(f, funerals - 8)} x={1400} y={900}>
          <Pencil d="M1220,900 L1290,900 L1284,790 L1226,790 Z" fill={C.gray} />
          <Pencil d="M1214,790 L1296,790 L1280,770 L1230,770 Z" fill={C.darkGray} sw={3} />
          <Incense x={1360} y={900} f={f} s={0.8} />
          <Person x={1480} y={910} s={0.85} tribe="monk" f={f} hold="beads" aR={40} expr="neutral" seed={3} lean={-8} />
          <Person x={1660} y={910} s={0.8} tribe="noble" f={f} expr="worry" seed={6} lean={-14} />
          <Person x={1800} y={910} s={0.75} tribe="yayoi" long f={f} expr="worry" seed={8} lean={-14} />
        </Pop>
        <Label x={1560} y={560} text="funerals" size={60} font={FONT_HAND} p={ip(f, [funerals, funerals + 10], [0, 1], (x) => x)} rot={-3} />
        {/* the dividing line, drawn like a page fold */}
        <DrawOn d="M960,-40 C950,200 972,500 960,1100" p={ip(f, [from, from + 16], [0, 1])} sw={6} />
      </Camera>
    </SceneSvg>
  );
};

/** "Even today, many Japanese people follow both religions in this way." */
export const Today: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const today = w2(51, "today");
  const many = w2(52, "many");
  const follow = w2(55, "follow");
  const both = w2(56, "both");
  const way = w2(60, "way");
  const cam = camAt(f, [
    [from, { x: 960, y: 540, z: 1.0 }],
    [to, { x: 980, y: 560, z: 1.05 }],
  ]);
  const walkP = ip(f, [follow - 6, way + 10], [0, 1]);
  const family: { dx: number; s: number; cloth: string; long?: boolean }[] = [
    { dx: 0, s: 0.95, cloth: "#e07b5f" },
    { dx: 120, s: 0.9, cloth: "#6fa0c8", long: true },
    { dx: 220, s: 0.62, cloth: C.yellow },
  ];
  const extras: [number, number, string, boolean][] = [
    [330, 0.85, "#9bc27a", false],
    [1560, 0.88, "#c79ad6", true],
    [1690, 0.8, "#f0a35e", false],
    [1100, 0.82, "#7fb7b2", true],
  ];
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <Shade d="M-600,-400 H2700 V720 H-600 Z" fill={C.sky} opacity={0.25} />
        <ModernCity x={960} y={660} s={0.95} />
        <Birds x={260} y={140} f={f} n={3} />
        <Pencil d="M-600,660 Q960,640 2600,660 L2600,1500 L-600,1500 Z" fill={C.green} />
        <Pencil d="M-600,740 Q960,720 2600,740 L2600,840 Q960,820 -600,840 Z" fill={C.gray} sw={3.5} />
        <Torii x={300} y={760} s={0.85} />
        <Pagoda x={1650} y={760} s={0.62} />
        <Pop s={pop(f, today - 4, 200, 10)} x={960} y={160} rot={-4}>
          <Pencil d="M820,70 L1100,70 L1100,250 L820,250 Z" fill={C.white} sw={5} />
          <Pencil d="M820,70 L1100,70 L1100,120 L820,120 Z" fill={C.red} sw={5} />
          <Label x={960} y={220} text="TODAY" size={76} font={FONT_TITLE} halo={false} />
        </Pop>
        {extras.map(([x, s, cloth, long], i) => (
          <Person key={i} x={x} y={930} s={s * pop(f, many + i * 4)} tribe="modern" cloth={cloth} long={long} f={f} expr="smile" seed={i + 10} />
        ))}
        {family.map((m, i) => {
          const x = 420 + m.dx + walkP * 760;
          const moving = walkP > 0 && walkP < 1;
          return (
            <Person
              key={i}
              x={x}
              y={940}
              s={m.s * pop(f, from + 4 + i * 3)}
              tribe="modern"
              cloth={m.cloth}
              long={m.long}
              f={f}
              walk={moving ? f * 0.4 + i : undefined}
              expr="happy"
              seed={i * 5}
            />
          );
        })}
        {[
          [300, 380],
          [1650, 300],
        ].map(([x, y], i) => (
          <Pop key={i} s={pop(f, both + i * 6, 220, 10)} x={x} y={y}>
            <Pencil d={ellipseD(x, y, 44)} fill={C.green} sw={4} />
            <Ink d={`M${x - 20},${y} l14,16 l26,-30`} sw={7} color={C.white} />
          </Pop>
        ))}
        <Sparkle x={960} y={420} s={pop(f, way) * ip(f, [to - 8, to], [1, 0])} />
      </Camera>
    </SceneSvg>
  );
};

