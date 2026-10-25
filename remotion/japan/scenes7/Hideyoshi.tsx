import React from "react";
import { C, FONT_HAND, FONT_TITLE, ip } from "../theme";
import { Bang, Bubble, Camera, camAt, Cloud, DrawOn, ellipseD, Ink, Label, Pencil, pop, Pop, Puff, Question, Shade, shakeAt, Sun } from "../draw";
import { SceneSvg } from "../Stage";
import { japanD, MapArt, proj } from "../MapArt";
import { Person } from "../Person";
import { Buddha, Incense, Signpost, WarBoat } from "../Props2";
import { Grave } from "../Props4";
import { Dizzy } from "../Props5";
import { Troop } from "../Props6";
import { Cauldron, CityGate, Notes, Songbird, Branch, SupplyShip, TurtleShip, WeaponPile } from "../Props7";
import { TitleScene } from "../scenes/Opening";
import { FLAG_COLORS, FLAGS } from "../scenes4/Sengoku";
import { w7 } from "../part7cues";
import { BEIJING, BUSAN, CalendarCard, HIDE, HIZEN, KOREA, MING, NameCard, Pennant, scr, SceneProps, Sea, SEOUL } from "./common";

export const Title7: React.FC<{ f: number }> = ({ f }) => (
  <TitleScene
    f={f}
    subtitle="part 7 · the bird that would not sing"
    doodles={
      <g>
        <Pop s={pop(f, 30)} x={1440} y={760}>
          <Branch x0={1300} x1={1600} y={770} />
          <Songbird x={1450} y={766} s={0.8} f={f} sing={f > 50} />
          <Notes x={1500} y={680} f={f} on={f > 50} />
        </Pop>
      </g>
    }
  />
);

/** "Another of his generals, Hideyoshi, rushed back to Kyoto and destroyed the traitor." */
export const Rush: React.FC<SceneProps> = ({ f, from, to }) => {
  const hide = w7(4, "hideyoshi");
  const rushed = w7(5, "rushed");
  const destroyed = w7(10, "destroyed");
  const traitor = w7(12, "traitor");
  const run = ip(f, [rushed - 6, destroyed], [0, 1], (x) => x);
  const x = 420 + run * 880;
  const hit = f > destroyed;
  const fall = ip(f, [destroyed + 2, destroyed + 14], [0, 1], (t) => t * t);
  const cam = camAt(f, [
    [from, { x: 760, y: 560, z: 1.12 }],
    [destroyed - 6, { x: 1180, y: 560, z: 1.12 }],
    [to, { x: 1260, y: 560, z: 1.06 }],
  ]);
  return (
    <SceneSvg f={f}>
      <Camera cam={cam} shake={shakeAt(f, ip(f, [destroyed, destroyed + 3], [0, 1]) * ip(f, [destroyed + 3, destroyed + 16], [1, 0]) * 0.6)}>
        <Shade d="M-600,-400 H2800 V1500 H-600 Z" fill={C.sky} opacity={0.25} />
        <Sun x={1900} y={140} r={54} f={f} />
        <Cloud x={600} y={180} w={260} h={80} seed={2} />
        <Pencil d="M-600,760 Q200,640 900,720 T2800,700 L2800,1500 L-600,1500 Z" fill={C.moss} />
        <Pencil d="M-600,880 H2800 V1500 H-600 Z" fill="#cdb98f" />
        <Signpost x={1000} y={890} text="Kyoto" s={0.9} font={FONT_HAND} />
        {run > 0 && run < 1
          ? [0, 1, 2].map((k) => <Puff key={k} x={x - 120 - k * 70} y={900} p={((f + k * 5) % 15) / 15} size={40} fill={C.tan} seed={k} />)
          : null}
        {run > 0 && run < 1 ? <Ink d={`M${x - 220},800 h-140 M${x - 200},840 h-180 M${x - 230},760 h-110`} sw={4} opacity={0.5} /> : null}
        <g transform={fall > 0 ? `rotate(${fall * 80},1560,940)` : undefined}>
          <Person x={1560} y={940} s={1.25} tribe="general" f={f} flip expr={hit ? "shock" : "grin"} hold="katana" aR={hit ? 150 : 40} seed={3} />
        </g>
        {fall > 0.9 ? <Dizzy x={1720} y={900} f={f} s={1.0} /> : null}
        <Person x={x} y={940} s={1.3} tribe="hideyoshi" f={f} walk={run > 0 && run < 1 ? f * 0.9 : undefined} lean={run > 0 && run < 1 ? 10 : 0} hold="katana" aR={hit ? 150 : 70} expr={hit ? "grin" : "angry"} seed={1} />
        <Bang x={1460} y={640} s={pop(f, destroyed)} n={3} />
      </Camera>
      <NameCard x={560} y={180} s={pop(f, hide)} text="HIDEYOSHI" sub="another of Nobunaga's generals" fill={HIDE} w={620} />
      <Label x={1420} y={300} text="the traitor" size={70} font={FONT_TITLE} color={C.red} p={ip(f, [traitor - 4, traitor + 8], [0, 1], (t) => t)} rot={-4} />
    </SceneSvg>
  );
};

/** "He went on to finish Nobunaga's work and brought all of Japan under his control." */
export const Unify: React.FC<SceneProps> = ({ f, from, to }) => {
  const finish = w7(17, "finish");
  const brought = w7(21, "brought");
  const control = w7(27, "control");
  const gold = ip(f, [brought - 4, control + 4], [0, 1]);
  const c = proj(136.5, 35.4);
  return (
    <SceneSvg f={f}>
      <defs>
        <clipPath id="japan7">
          {japanD.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </clipPath>
      </defs>
      <Camera cam={camAt(f, [[from, { x: 1250, y: 700, z: 1.0 }], [to, { x: 1260, y: 690, z: 1.06 }]])}>
        <MapArt f={f} />
        <g clipPath="url(#japan7)">
          <Pencil d={ellipseD(c[0], c[1], 125, 95)} fill={C.yellow} ink={false} fillOpacity={0.6 * (1 - gold)} />
          <Pencil d={ellipseD(1300, 760, 900 * gold, 700 * gold)} fill={HIDE} ink={false} fillOpacity={0.75} />
        </g>
        {FLAGS.map(([x, y], i) => {
          const at = brought + i * 2;
          const mine = f > at;
          return (
            <g key={i}>
              {!mine ? (
                <g>
                  <Ink d={`M${x},${y} l0,-80`} sw={5} />
                  <Pencil d={`M${x},${y - 80} l52,12 l-52,14 Z`} fill={FLAG_COLORS[i % FLAG_COLORS.length]} sw={3.5} />
                </g>
              ) : (
                <Pennant x={x} y={y} s={pop(f, at) * 1.3} color={HIDE} />
              )}
            </g>
          );
        })}
      </Camera>
      <Pop s={pop(f, finish - 2)} x={420} y={230} rot={-4}>
        <Pencil d="M170,150 h500 v170 h-500 Z" fill={C.white} sw={5} />
        <Label x={420} y={215} text="Nobunaga's work:" size={44} font={FONT_HAND} halo={false} />
        <Label x={420} y={290} text={f > control ? "DONE!" : "unfinished..."} size={62} font={FONT_TITLE} color={f > control ? C.darkGreen : C.red} halo={false} />
      </Pop>
      <Person x={330} y={890} s={1.4} tribe="hideyoshi" f={f} hold="gourd" aR={40 + (f > control ? Math.abs(Math.sin(f / 4)) * 10 : 0)} expr="grin" seed={1} />
      <Label x={1300} y={160} text="ALL of Japan!" size={96} font={FONT_TITLE} color="#8a6a10" p={ip(f, [control - 6, control + 8], [0, 1], (t) => t)} rot={-3} />
    </SceneSvg>
  );
};

/** A weapon flying from (x0,y0) to (x1,y1) during [t0, t0+14]. */
const Flying: React.FC<{ f: number; t0: number; x0: number; y0: number; x1: number; y1: number; spear?: boolean }> = ({ f, t0, x0, y0, x1, y1, spear }) => {
  const t = ip(f, [t0, t0 + 14], [0, 1], (x) => x);
  if (t <= 0 || t >= 1) return null;
  return (
    <g transform={`translate(${x0 + (x1 - x0) * t},${y0 + (y1 - y0) * t - Math.sin(t * Math.PI) * 220}) rotate(${t * 400})`}>
      {spear ? <Pencil d="M-90,-3 L90,-3 L90,3 L-90,3 Z" fill={C.brown} sw={2.5} /> : <Pencil d="M-60,-4 L70,-6 Q80,0 70,4 L-60,4 Z" fill="#dfe3e8" sw={2.5} />}
    </g>
  );
};

/** "He also took weapons away from farmers and monks." */
export const SwordHunt: React.FC<SceneProps> = ({ f, from, to }) => {
  const took = w7(30, "took");
  const farmers = w7(34, "farmers");
  const monks = w7(36, "monks");
  const n = Math.round(ip(f, [took, to - 6], [3, 20], (x) => x));
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 560, z: 1.05 }], [to, { x: 980, y: 560, z: 1.1 }]])}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill={C.sky} opacity={0.2} />
        <Pencil d="M-600,880 H2700 V1500 H-600 Z" fill="#cdb98f" />
        <WeaponPile x={860} y={870} n={n} s={1.1} />
        <Person x={600} y={930} s={1.2} tribe="samurai" cloth={HIDE} f={f} aR={150} aL={150} expr="grin" seed={2} />
        {[0, 1].map((i) => (
          <Person key={i} x={1180 + i * 150} y={930 + i * 10} s={1.1} tribe="yayoi" f={f} flip hold={f < farmers + i * 4 ? "sickle" : "none"} aR={f < farmers + i * 4 ? 120 : 20} expr={f > farmers + i * 4 ? "worry" : "smile"} seed={i + 4} />
        ))}
        {[0, 1].map((i) => (
          <Person key={i} x={1530 + i * 150} y={930 + i * 12} s={1.1} tribe="monk" f={f} flip hold={f < monks + i * 4 ? "naginata" : "none"} aR={f < monks + i * 4 ? 100 : 20} expr={f > monks + i * 4 ? "worry" : "neutral"} seed={i + 6} />
        ))}
        <Flying f={f} t0={farmers} x0={1150} y0={760} x1={900} y1={820} />
        <Flying f={f} t0={farmers + 4} x0={1300} y0={760} x1={880} y1={830} />
        <Flying f={f} t0={monks} x0={1500} y0={720} x1={860} y1={820} spear />
        <Flying f={f} t0={monks + 4} x0={1650} y0={720} x1={840} y1={830} spear />
        <Label x={1250} y={560} text="farmers" size={52} font={FONT_HAND} p={ip(f, [farmers, farmers + 8], [0, 1], (t) => t)} />
        <Label x={1600} y={560} text="monks" size={52} font={FONT_HAND} p={ip(f, [monks, monks + 8], [0, 1], (t) => t)} />
      </Camera>
      <Label x={960} y={170} text="the great sword hunt" size={84} font={FONT_TITLE} color={C.red} p={ip(f, [took - 4, took + 12], [0, 1], (t) => t)} rot={-3} />
    </SceneSvg>
  );
};

/** "He told them he would melt the weapons down to build a giant Buddha statue." */
export const Melt: React.FC<SceneProps> = ({ f, from, to }) => {
  const told = w7(38, "told");
  const melt = w7(42, "melt");
  const build = w7(47, "build");
  const buddha = w7(50, "buddha");
  const rise = ip(f, [build - 2, buddha + 12], [0, 1]);
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 560, z: 1.0 }], [to, { x: 1000, y: 540, z: 1.04 }]])}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#e9d7b0" opacity={0.4} />
        <Pencil d="M-600,880 H2700 V1500 H-600 Z" fill="#b89f7a" />
        {/* the promised statue, rising as a dream */}
        <g opacity={0.25 + 0.75 * rise}>
          <g transform={`translate(0,${(1 - rise) * 160})`}>
            <Buddha x={1440} y={880} s={1.25} glow={rise} />
          </g>
        </g>
        <WeaponPile x={360} y={870} n={Math.round(ip(f, [melt, build], [16, 4], (x) => x))} s={0.9} />
        {[0, 1, 2, 3].map((k) => {
          const t = ip(f, [melt + k * 5, melt + k * 5 + 12], [0, 1], (x) => x);
          if (t <= 0 || t >= 1) return null;
          return (
            <g key={k} transform={`translate(${380 + 340 * t},${800 - Math.sin(t * Math.PI) * 200 - 40 * t}) rotate(${t * 300})`}>
              <Pencil d="M-60,-4 L70,-6 Q80,0 70,4 L-60,4 Z" fill="#dfe3e8" sw={2.5} />
            </g>
          );
        })}
        <Cauldron x={760} y={870} s={1.0} f={f} glow={ip(f, [melt, melt + 10], [0.3, 1])} />
        <Person x={1040} y={930} s={1.25} tribe="hideyoshi" f={f} expr="grin" aR={f > build ? 150 : 60} look={[1, -0.4]} seed={1} />
        <Bubble x={1060} y={380} w={420} h={120} text="for the Buddha!" s={pop(f, told + 4) * ip(f, [buddha + 20, buddha + 26], [1, 1])} tail={[1060, 520]} size={50} />
        <Label x={760} y={560} text="melt them down" size={58} font={FONT_HAND} p={ip(f, [melt, melt + 10], [0, 1], (t) => t)} rot={-3} />
      </Camera>
      <Label x={1440} y={170} text="a GIANT Buddha!" size={84} font={FONT_TITLE} color="#8a6a10" p={ip(f, [buddha - 4, buddha + 10], [0, 1], (t) => t)} rot={-3} />
    </SceneSvg>
  );
};

/** "But the real reason was simple. Without weapons, nobody could fight back." */
export const RealReason: React.FC<SceneProps> = ({ f, from, to }) => {
  const real = w7(54, "real");
  const simple = w7(57, "simple");
  const without = w7(58, "without");
  const nobody = w7(60, "nobody");
  const fight = w7(62, "fight");
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 560, z: 1.0 }], [to, { x: 980, y: 560, z: 1.06 }]])}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill={C.sky} opacity={0.2} />
        <Pencil d="M-600,880 H2700 V1500 H-600 Z" fill="#cdb98f" />
        <Person x={380} y={930} s={1.4} tribe="hideyoshi" f={f} expr={f > simple ? "grin" : "smile"} aR={f > simple ? 120 : 20} look={[1, 0]} seed={1} />
        <Bubble x={460} y={360} w={360} h={110} text="heh heh..." s={pop(f, simple)} tail={[420, 520]} size={50} thought fill={C.white} />
        {/* a farmer with nothing but a radish, and a samurai */}
        <Person x={1180} y={930} s={1.2} tribe="yayoi" f={f} hold={f > without ? "radish" : "none"} aR={f > fight ? 150 : 60} expr={f > nobody ? "nervous" : "worry"} look={[1, 0]} seed={4} />
        <Person x={1560} y={930} s={1.25} tribe="samurai" cloth={HIDE} f={f} flip hold="katana" aR={140} expr="grin" seed={2} />
        <Question x={1180} y={560} s={pop(f, fight + 6)} size={100} rot={-8} />
      </Camera>
      <Label x={960} y={160} text="the REAL reason:" size={80} font={FONT_TITLE} color={C.red} p={ip(f, [real, real + 10], [0, 1], (t) => t)} rot={-3} />
      <Label x={1240} y={270} text="no weapons = no fighting back" size={58} font={FONT_HAND} p={ip(f, [without, nobody + 10], [0, 1], (t) => t)} rot={-3} />
    </SceneSvg>
  );
};

/** "But Hideyoshi wanted more. He planned to take over China by going through Korea." */
export const WantedMore: React.FC<SceneProps> = ({ f, from, to }) => {
  const more = w7(67, "more");
  const planned = w7(69, "planned");
  const china = w7(73, "china");
  const korea = w7(77, "korea");
  const cam = camAt(f, [[from, { x: 820, y: 640, z: 0.92 }], [to, { x: 800, y: 620, z: 0.98 }]]);
  const [cx, cy] = scr(cam, proj(112.5, 37));
  const [kx, ky] = scr(cam, proj(127.6, 36.6));
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <MapArt f={f} />
        <Pencil d={ellipseD(BEIJING[0] + 120, BEIJING[1] + 140, 360 * pop(f, china), 240 * pop(f, china))} fill={MING} ink={false} fillOpacity={0.18} />
        <DrawOn d={`M${HIZEN[0]},${HIZEN[1]} Q${HIZEN[0] - 30},${HIZEN[1] - 80} ${BUSAN[0]},${BUSAN[1]}`} p={ip(f, [korea - 8, korea + 6], [0, 1])} sw={6} color={C.red} dotted />
        <DrawOn d={`M${BUSAN[0]},${BUSAN[1]} Q${SEOUL[0] + 60},${SEOUL[1] + 80} ${SEOUL[0]},${SEOUL[1]} Q${SEOUL[0] - 200},${SEOUL[1] - 200} ${BEIJING[0] + 40},${BEIJING[1] + 20}`} p={ip(f, [korea, korea + 18], [0, 1])} sw={6} color={C.red} dotted />
        <Pennant x={HIZEN[0]} y={HIZEN[1]} s={pop(f, planned) * 1.2} color={HIDE} />
      </Camera>
      <Label x={cx + 40} y={cy - 40} text="CHINA" size={96} font={FONT_TITLE} color={MING} p={ip(f, [china - 4, china + 8], [0, 1], (t) => t)} />
      <Label x={kx - 60} y={ky - 30} text="KOREA" size={64} font={FONT_TITLE} color={KOREA} p={ip(f, [korea - 4, korea + 8], [0, 1], (t) => t)} anchor="end" />
      <Person x={1640} y={900} s={1.4} tribe="hideyoshi" f={f} expr="grin" aR={f > planned ? 110 : 40} look={[-1, -0.3]} seed={1} />
      <Bubble x={1520} y={300} w={300} h={120} text="MORE!" s={pop(f, more)} tail={[1600, 470]} size={64} />
    </SceneSvg>
  );
};

/** "At first, his army moved fast and captured Seoul in just a few weeks." */
export const Seoul: React.FC<SceneProps> = ({ f, from, to }) => {
  const moved = w7(82, "moved");
  const captured = w7(85, "captured");
  const seoul = w7(86, "seoul");
  const few = w7(90, "few");
  const cam = camAt(f, [[from, { x: 860, y: 720, z: 1.6 }], [to, { x: 840, y: 680, z: 1.7 }]]);
  const go = ip(f, [moved - 4, captured + 4], [0, 1]);
  const ax = BUSAN[0] + (SEOUL[0] - BUSAN[0]) * go;
  const ay = BUSAN[1] + (SEOUL[1] - BUSAN[1]) * go;
  const [sx, sy] = scr(cam, SEOUL);
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <MapArt f={f} />
        <DrawOn d={`M${BUSAN[0]},${BUSAN[1]} L${SEOUL[0]},${SEOUL[1]}`} p={go} sw={7} color={C.red} />
        {new Array(12).fill(0).map((_, i) => (
          <Troop key={i} x={ax - 20 + (i % 4) * 12 + (Math.floor(i / 4) % 2) * 6} y={ay + 10 + Math.floor(i / 4) * 10 - Math.abs(Math.sin(f / 2 + i)) * 3} s={0.28} color={HIDE} />
        ))}
        <Pennant x={SEOUL[0]} y={SEOUL[1]} s={pop(f, seoul) * 0.9} color={HIDE} />
        <path d={ellipseD(SEOUL[0], SEOUL[1], 5)} fill="#2b2b35" />
      </Camera>
      <Label x={sx - 50} y={sy + 70} text="Seoul" size={56} font={FONT_TITLE} color={KOREA} anchor="end" />
      <Pop s={pop(f, seoul + 4)} x={360} y={330}>
        <Pencil d="M120,130 h480 v360 h-480 Z" fill="#f4e7c4" sw={5} />
        <CityGate x={360} y={440} s={0.75} />
        <Pennant x={470} y={170} s={1.2} color={HIDE} h={70} />
        <Label x={360} y={480} text="captured!" size={52} font={FONT_TITLE} color={C.red} halo={false} />
      </Pop>
      <Label x={1300} y={200} text="FAST!" size={110} font={FONT_TITLE} color={C.red} p={ip(f, [moved, moved + 6], [0, 1], (t) => t)} rot={-6} />
      <CalendarCard x={1560} y={720} s={pop(f, few)} big="weeks" small="just a few" w={300} />
    </SceneSvg>
  );
};

/** "But the Korean admiral Yi Sun-sin used his famous turtle ships to destroy Japan's supply ships." */
export const Turtle: React.FC<SceneProps> = ({ f, from, to }) => {
  const admiral = w7(95, "admiral");
  const yi = w7(96, "yi");
  const turtle = w7(102, "turtle");
  const destroy = w7(105, "destroy");
  const supply = w7(107, "supply");
  const come = ip(f, [turtle - 20, destroy], [0, 1]);
  const cam = camAt(f, [
    [from, { x: 640, y: 560, z: 1.15 }],
    [turtle - 6, { x: 820, y: 560, z: 1.0 }],
    [to, { x: 1000, y: 560, z: 0.95 }],
  ]);
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <Shade d="M-800,-400 H3000 V1500 H-800 Z" fill={C.sky} opacity={0.3} />
        <Cloud x={1500} y={170} w={300} h={90} seed={4} />
        <Sea f={f} y={720} />
        {/* the admiral on a rocky point */}
        <Pencil d="M-500,1100 L-500,760 Q0,700 200,740 Q360,770 420,1100 Z" fill={C.gray} />
        <Person x={150} y={760} s={1.3} tribe="korean" f={f} beard expr="angry" aR={f > turtle ? 110 : 30} look={[1, 0]} seed={2} />
        <TurtleShip x={-700 + come * 1700} y={800} s={0.85} f={f} fire={ip(f, [destroy, destroy + 20], [0, 1], (x) => x)} />
        {[0, 1, 2].map((i) => (
          <SupplyShip key={i} x={1300 + i * 330} y={790 + (i % 2) * 20} s={0.8} f={f + i * 7} sink={ip(f, [supply + i * 6, supply + i * 6 + 30], [0, 1])} />
        ))}
        {[0, 1, 2, 3].map((k) => (
          <Pencil key={k} d={ellipseD(1250 + k * 160 + Math.sin(f / 8 + k) * 10, 840 + (k % 2) * 30, 22, 14)} fill={C.straw} sw={2.5} opacity={ip(f, [supply + 20, supply + 30], [0, 1])} />
        ))}
        <Label x={1600} y={560} text="Japan's supply ships" size={52} font={FONT_HAND} p={ip(f, [supply - 6, supply + 8], [0, 1], (t) => t)} />
        <Bang x={1400} y={600} s={pop(f, destroy + 6)} n={2} />
      </Camera>
      <NameCard x={560} y={170} s={pop(f, yi)} text="ADMIRAL YI SUN-SIN" sub="Korea" fill="#d9e4f2" w={720} />
      <Label x={1360} y={170} text="TURTLE SHIPS" size={90} font={FONT_TITLE} color={C.darkGreen} p={ip(f, [turtle, turtle + 10], [0, 1], (t) => t)} rot={-3} />
      {f < yi ? <Label x={560} y={170} text="the Korean admiral..." size={56} font={FONT_HAND} p={ip(f, [admiral - 10, admiral + 4], [0, 1], (t) => t)} /> : null}
    </SceneSvg>
  );
};

/** "And without supplies, who would feed the soldiers?" */
export const Hungry: React.FC<SceneProps> = ({ f, from, to }) => {
  const supplies = w7(111, "supplies");
  const who = w7(112, "who");
  const feed = w7(114, "feed");
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 580, z: 1.05 }], [to, { x: 960, y: 600, z: 1.12 }]])}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#c9c2b0" opacity={0.4} />
        <Pencil d="M-600,880 H2700 V1500 H-600 Z" fill="#a89a7a" />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <Person x={560 + i * 400} y={940} s={1.2} tribe="samurai" cloth={HIDE} f={f} sit hold="bowl" aR={70} expr="tired" seed={i + 2} />
            <Label x={690 + i * 400} y={780} text="grrr..." size={40} font={FONT_HAND} p={ip(f, [supplies + i * 6, supplies + i * 6 + 8], [0, 1], (t) => t)} rot={i * 6 - 6} />
          </g>
        ))}
        <Question x={960} y={420} s={pop(f, who)} size={160} rot={-6} />
      </Camera>
      <Label x={960} y={170} text="no supplies, no food!" size={80} font={FONT_TITLE} color={C.red} p={ip(f, [supplies - 4, supplies + 10], [0, 1], (t) => t)} rot={-3} />
      <Label x={960} y={260} text="who would feed the soldiers?" size={54} font={FONT_HAND} p={ip(f, [who, feed + 16], [0, 1], (t) => t)} rot={-3} />
    </SceneSvg>
  );
};

/** "At the same time, China sent a huge army to help Korea." */
export const ChinaArmy: React.FC<SceneProps> = ({ f, from, to }) => {
  const china = w7(121, "china");
  const huge = w7(124, "huge");
  const help = w7(127, "help");
  const cam = camAt(f, [[from, { x: 640, y: 600, z: 1.2 }], [to, { x: 680, y: 620, z: 1.26 }]]);
  const go = ip(f, [china, help + 10], [0, 1]);
  const start = proj(121.5, 41.2);
  const end = proj(126.4, 38.6);
  const ax = start[0] + (end[0] - start[0]) * go;
  const ay = start[1] + (end[1] - start[1]) * go;
  const [hx, hy] = scr(cam, [ax, ay]);
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <MapArt f={f} />
        <DrawOn d={`M${start[0]},${start[1]} L${end[0]},${end[1]}`} p={go} sw={9} color={MING} />
        {new Array(30).fill(0).map((_, i) => (
          <Troop key={i} x={ax - 70 + (i % 6) * 16 + (Math.floor(i / 6) % 2) * 8} y={ay - 30 + Math.floor(i / 6) * 13 - Math.abs(Math.sin(f / 2 + i)) * 3} s={0.3 * pop(f, china - 4 + (i % 6))} color={MING} />
        ))}
        <Pennant x={SEOUL[0] + 30} y={SEOUL[1] + 10} s={pop(f, help) * 0.8} color={KOREA} />
        <Pennant x={SEOUL[0] - 10} y={SEOUL[1] + 40} s={pop(f, help + 4) * 0.8} color={MING} />
      </Camera>
      <Label x={hx} y={hy - 120} text="a HUGE army" size={70} font={FONT_TITLE} color={MING} p={ip(f, [huge - 4, huge + 10], [0, 1], (t) => t)} rot={-3} />
      <Label x={1460} y={200} text="China helps Korea" size={70} font={FONT_TITLE} color={KOREA} p={ip(f, [help - 4, help + 12], [0, 1], (t) => t)} rot={-3} />
      <Person x={1650} y={900} s={1.3 * pop(f, china)} tribe="ming" f={f} hold="spear" aR={30} expr="angry" seed={2} />
      <Person x={1440} y={910} s={1.25 * pop(f, help)} tribe="korean" f={f} expr="grin" aR={150} seed={3} />
    </SceneSvg>
  );
};

/** "After six years of fighting, Hideyoshi died, and Japan brought its army home." */
export const Home: React.FC<SceneProps> = ({ f, from, to }) => {
  const six = w7(130, "six");
  const died = w7(135, "died");
  const brought = w7(138, "brought");
  const home = w7(141, "home");
  const years = Math.max(1, Math.round(ip(f, [from, six + 8], [1, 6], (x) => x)));
  const cam = camAt(f, [
    [from, { x: 700, y: 560, z: 1.05 }],
    [brought - 10, { x: 760, y: 560, z: 1.05 }],
    [brought + 20, { x: 1500, y: 560, z: 1.0 }],
    [to, { x: 1540, y: 560, z: 1.0 }],
  ]);
  const sail = ip(f, [brought - 10, to], [0, 1], (x) => x);
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <Shade d="M-800,-400 H3200 V1500 H-800 Z" fill="#f2cf8a" opacity={0.3} />
        <Sun x={2100} y={260} r={70} f={f} color={C.orange} />
        <Sea f={f} y={760} />
        <Pencil d="M-800,1100 L-800,700 Q-200,640 300,690 Q500,720 560,1100 Z" fill={C.moss} />
        <Pencil d="M2000,1100 L2100,720 Q2400,660 3200,700 L3200,1100 Z" fill={C.green} />
        <Label x={2400} y={620} text="home" size={60} font={FONT_TITLE} color={C.darkGreen} p={ip(f, [home - 6, home + 6], [0, 1], (t) => t)} />
        {/* Hideyoshi's grave, his sunburst helmet on top */}
        <g opacity={pop(f, died - 4)}>
          <Grave x={200} y={740} s={1.0} />
          {new Array(9).fill(0).map((_, i) => {
            const a = Math.PI * (1.15 + (i / 8) * 0.7);
            return <Ink key={i} d={`M${200 + Math.cos(a) * 40},${520 + Math.sin(a) * 40} L${200 + Math.cos(a) * 80},${520 + Math.sin(a) * 80}`} sw={5} color={C.yellow} />;
          })}
          <Pencil d="M160,540 C158,500 180,486 200,486 C220,486 242,500 240,540 Q200,528 160,540 Z" fill="#5a2a20" sw={3} />
          <Incense x={330} y={740} f={f} s={0.8} />
        </g>
        {[0, 1, 2].map((i) => (
          <WarBoat key={i} x={700 + sail * 1300 + i * 200} y={800 + (i % 2) * 30} s={0.8} color={HIDE} tilt={Math.sin(f / 9 + i) * 2} />
        ))}
      </Camera>
      <CalendarCard x={1600} y={300} s={pop(f, from + 4) * ip(f, [died - 6, died], [1, 0])} big={`${years}`} small={years === 1 ? "year of war" : "years of war"} />
      <Label x={560} y={190} text="Hideyoshi died" size={70} font={FONT_HAND} p={ip(f, [died - 2, died + 12], [0, 1], (t) => t) * ip(f, [brought + 10, brought + 18], [1, 0])} />
    </SceneSvg>
  );
};

