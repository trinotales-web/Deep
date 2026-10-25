import React from "react";
import { C, FONT_HAND, FONT_TITLE, ip } from "../theme";
import {
  Bang,
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
  shakeAt,
  Sparkle,
  Sun,
} from "../draw";
import { SceneSvg } from "../Stage";
import { MapArt, proj } from "../MapArt";
import { Person } from "../Person";
import { BigSword } from "../Props2";
import { Carrack, Dizzy, Forge, GunPile, GunSmoke } from "../Props5";
import { TitleScene } from "../scenes/Opening";
import { FLAG_COLORS, FLAGS } from "../scenes4/Sengoku";
import { w5 } from "../part5cues";

const SEA_Y = 760;

export const Title5: React.FC<{ f: number }> = ({ f }) => (
  <TitleScene
    f={f}
    subtitle="part 5 · guns change everything"
    doodles={
      <g>
        <DrawOn d="M420,780 q40,-24 80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0" p={ip(f, [18, 52], [0, 1])} sw={4} />
        <Pop s={pop(f, 36)} x={540} y={770}>
          <Carrack x={540} y={770} s={0.28} />
        </Pop>
        <Pop s={pop(f, 46)} x={1400} y={740}>
          <g transform="translate(1400,740) rotate(-12)">
            <Pencil d="M-130,-6 L60,-6 L60,6 L-130,6 Z" fill="#3d3d44" sw={3} />
            <Pencil d="M40,-12 L120,-18 L128,10 L40,12 Z" fill={C.brown} sw={3} />
          </g>
        </Pop>
      </g>
    }
  />
);

/** "In 1543, traders from Portugal landed in Japan, and they brought guns." */
export const Portugal: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const year = w5(1, "fifteen");
  const portugal = w5(6, "portugal");
  const landed = w5(7, "landed");
  const guns = w5(13, "guns");
  const sail = ip(f, [from, landed + 6], [0, 1]);
  const ashore = ip(f, [landed + 4, landed + 22], [0, 1]);
  const cam = camAt(f, [
    [from, { x: 860, y: 540, z: 0.95 }],
    [guns - 10, { x: 960, y: 560, z: 1.0 }],
    [guns + 8, { x: 1120, y: 600, z: 1.18 }],
    [to, { x: 1130, y: 600, z: 1.2 }],
  ]);
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <Shade d="M-800,-600 H3000 V900 H-800 Z" fill={C.sky} opacity={0.25} />
        <Sun x={1700} y={150} r={56} f={f} />
        <Cloud x={500} y={170} w={260} h={80} seed={3} />
        <Pencil d={`M-800,${SEA_Y} Q960,${SEA_Y - 20} 3000,${SEA_Y} L3000,1600 L-800,1600 Z`} fill={C.sea} />
        {new Array(8).fill(0).map((_, i) => (
          <Ink key={i} d={`M${-300 + i * 260 + Math.sin(f / 14 + i) * 12},${SEA_Y + 50 + (i % 3) * 36} q14,-11 28,0 q14,11 28,0`} sw={3} opacity={0.6} />
        ))}
        <Pencil d={`M900,${SEA_Y + 30} C1100,${SEA_Y - 30} 1300,${SEA_Y - 60} 3000,${SEA_Y - 70} L3000,1600 L700,1600 Z`} fill={C.straw} />
        <Carrack x={-400 + sail * 920} y={SEA_Y + 50} s={0.75} tilt={Math.sin(f / 9) * 2} />
        {/* the traders step ashore */}
        {[0, 1].map((i) => (
          <Person
            key={i}
            x={880 + ashore * (260 + i * 150)}
            y={SEA_Y + 140 + i * 16}
            s={1.0 * pop(f, landed + 4 + i * 4)}
            tribe="portuguese"
            beard
            f={f}
            walk={ashore > 0 && ashore < 1 ? f * 0.5 + i : undefined}
            hold={i === 0 && f > guns - 6 ? "gun" : "none"}
            aR={i === 0 && f > guns - 6 ? 150 : 15}
            expr="grin"
            skin="#f6d6c0"
            seed={i + 2}
          />
        ))}
        {[1600, 1760].map((x, i) => (
          <Person key={i} x={x} y={SEA_Y + 130 + i * 14} s={1.0} tribe="samurai" f={f} flip expr={f > guns ? "shock" : "neutral"} look={[-1, 0]} seed={i + 5} />
        ))}
        <Question x={1700} y={400} s={pop(f, guns + 4)} size={110} rot={10} />
        <Bang x={1800} y={420} s={pop(f, guns + 8)} n={2} />
        <Label x={760} y={300} text="traders from PORTUGAL" size={70} font={FONT_TITLE} color="#7a2a3a" p={ip(f, [portugal - 4, portugal + 14], [0, 1], (x) => x)} rot={-3} />
        <Label x={1260} y={380} text="guns!" size={90} font={FONT_TITLE} color="#3d3d44" p={ip(f, [guns, guns + 8], [0, 1], (x) => x)} rot={-6} />
      </Camera>
      <Pop s={pop(f, year, 200, 10) * ip(f, [guns - 16, guns - 6], [1, 0])} x={250} y={200} rot={-8}>
        <Pencil d={ellipseD(250, 200, 140, 92)} fill={C.white} sw={5} />
        <Label x={250} y={236} text="1543" size={104} font={FONT_TITLE} color={C.red} halo={false} />
        <Label x={250} y={146} text="the year" size={36} font={FONT_HAND} halo={false} />
      </Pop>
    </SceneSvg>
  );
};

/** "Japanese blacksmiths copied them with the same skill they used to make samurai swords." */
export const Smiths: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const smiths = w5(15, "blacksmiths");
  const copied = w5(16, "copied");
  const same = w5(20, "same");
  const swords = w5(27, "swords");
  // hammer cycle, one strike per beat of the score (96 bpm): strike, lift, strike again
  const ph = f > smiths + 4 ? (((f - smiths - 4) / 30) % 0.625) / 0.625 : -1;
  const arm = ph < 0 ? 20 : ph < 0.15 ? 80 : ph < 0.7 ? ip(ph, [0.15, 0.7], [80, 165]) : ip(ph, [0.7, 1], [165, 80], (x) => x * x);
  const sparks = ph >= 0 && ph < 0.4 ? ph / 0.4 : -1;
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 940, y: 540, z: 1.0 }], [to, { x: 960, y: 560, z: 1.06 }]])}>
        {/* workshop wall */}
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#c9a98a" opacity={0.45} />
        {new Array(22).fill(0).map((_, i) => (
          <Ink key={i} d={`M${-500 + i * 150},-300 L${-500 + i * 150 + (i % 3) - 1},880`} sw={2.5} opacity={0.3} />
        ))}
        <Pencil d="M-600,250 H2700 V284 H-600 Z" fill={C.darkBrown} sw={3.5} />
        <Pencil d="M1340,60 h260 v170 h-260 Z" fill="#f6e9b8" sw={4} />
        <Ink d="M1470,60 v170 M1340,145 h260" sw={4} />
        <Pencil d="M-600,880 H2700 V1500 H-600 Z" fill="#8f8478" />
        {/* the Portuguese gun they copied, hung on the wall */}
        <Ink d="M210,410 v-26 M420,410 v-26" sw={5} color={C.darkBrown} />
        <g transform="translate(320,404)">
          <Pencil d="M-130,-6 L60,-6 L60,6 L-130,6 Z" fill="#3d3d44" sw={3} />
          <Pencil d="M40,-12 L120,-18 L128,10 L40,12 Z" fill={C.brown} sw={3} />
        </g>
        <Label x={320} y={360} text="the original" size={42} font={FONT_HAND} p={ip(f, [copied - 8, copied + 4], [0, 1], (x) => x)} />
        <Forge x={605} y={915} f={f} s={1.1} />
        {/* the copy, taking shape on the anvil */}
        <g transform="translate(720,782)" opacity={ip(f, [copied, copied + 10], [0, 1])}>
          <Pencil d="M-130,-6 L60,-6 L60,6 L-130,6 Z" fill="#3d3d44" sw={3} />
          <Pencil d="M40,-12 L120,-18 L128,10 L40,12 Z" fill={C.brown} sw={3} />
        </g>
        <DrawOn d="M440,430 C560,470 640,560 690,700" p={ip(f, [copied, copied + 14], [0, 1])} sw={6} dotted />
        <Label x={660} y={560} text="copy!" size={56} font={FONT_TITLE} color={C.red} p={ip(f, [copied + 4, copied + 12], [0, 1], (x) => x)} rot={-6} />
        <Person x={520} y={890} s={1.15 * pop(f, smiths - 6)} tribe="smith" f={f} hold="hammer" aR={arm} expr="grin" seed={4} />
        {sparks >= 0
          ? new Array(7).fill(0).map((_, i) => {
              const a = -Math.PI * (0.1 + 0.8 * (i / 6));
              const d = 20 + sparks * 70;
              return <Ink key={i} d={`M${704 + Math.cos(a) * d},${790 + Math.sin(a) * d} l${Math.cos(a) * 16},${Math.sin(a) * 16}`} sw={4} color={C.sun} opacity={1 - sparks * 0.6} />;
            })
          : null}
        {/* the sword on its stand */}
        <Pop s={pop(f, same - 4)} x={1450} y={680}>
          <Pencil d="M1240,700 h420 v24 h-420 Z M1270,724 h24 v156 h-24 Z M1606,724 h24 v156 h-24 Z" fill={C.darkBrown} sw={3.5} />
          <BigSword x={1300} y={660} len={420} s={0.8} />
          <Sparkle x={1640} y={600} s={pop(f, swords) * (0.8 + 0.2 * Math.sin(f / 4))} />
        </Pop>
        <DrawOn d="M880,700 C1000,600 1120,600 1230,660" p={ip(f, [same, same + 12], [0, 1])} sw={6} dotted />
        <Label x={1060} y={560} text="same skill" size={64} font={FONT_TITLE} color={C.indigo} p={ip(f, [same, same + 12], [0, 1], (x) => x)} rot={-4} />
        <Label x={760} y={170} text="Japanese blacksmiths" size={62} font={FONT_HAND} p={ip(f, [smiths - 6, smiths + 12], [0, 1], (x) => x)} />
        <Label x={1450} y={460} text="samurai swords" size={58} font={FONT_HAND} p={ip(f, [swords - 6, swords + 10], [0, 1], (x) => x)} />
      </Camera>
    </SceneSvg>
  );
};

/** "Some say Japan was soon making more guns than any country in Europe." */
export const MoreGuns: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const some = w5(28, "some");
  const making = w5(33, "making");
  const europe = w5(40, "europe");
  const n = Math.round(ip(f, [making - 6, to - 10], [0, 40], (x) => x));
  const eu = Math.round(ip(f, [europe - 8, to - 10], [0, 12], (x) => x));
  const top = 860 - Math.ceil(n / 4) * 39;
  const shocked = n > 28;
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 540, z: 1.0 }], [to, { x: 960, y: 560, z: 1.05 }]])}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#f2cf8a" opacity={0.3} />
        <Pencil d="M-600,860 H2700 V1500 H-600 Z" fill={C.straw} />
        <Label x={960} y={140} text={"\u201Csome say...\u201D"} size={64} font={FONT_HAND} p={ip(f, [some, some + 10], [0, 1], (x) => x)} />
        {/* Japan's pile keeps growing */}
        <GunPile x={600} y={860} n={n} s={1.5} />
        {n > 4 ? (
          <g>
            <Ink d={`M610,${top + 20} l0,-150`} sw={6} />
            <Pencil d={`M610,${top - 130} h120 v80 h-120 Z`} fill={C.white} sw={4} />
            <Pencil d={ellipseD(670, top - 90, 24)} fill={C.red} sw={3} />
          </g>
        ) : null}
        <Person x={250} y={900} s={1.1 * pop(f, from + 4)} tribe="smith" f={f} hold="hammer" aR={f > making + 20 ? 150 : 40} expr="grin" seed={3} />
        <Label x={560} y={250} text="Japan" size={92} font={FONT_TITLE} color={C.red} p={ip(f, [making - 4, making + 8], [0, 1], (x) => x)} />
        {n > 6 ? (
          <g opacity={ip(f, [making + 6, making + 14], [0, 1])}>
            <Ink d={`M920,840 L920,${Math.max(top, 480) + 10}`} sw={7} color={C.red} />
            <Ink d={`M896,${Math.max(top, 480) + 36} L920,${Math.max(top, 480) + 6} L944,${Math.max(top, 480) + 36}`} sw={7} color={C.red} />
          </g>
        ) : null}
        <Label x={1000} y={Math.max(top, 480) + 30} text="more!" size={56} font={FONT_TITLE} color={C.red} anchor="start" p={ip(f, [making + 10, making + 18], [0, 1], (x) => x)} />
        {/* ...than any one country in Europe */}
        <GunPile x={1400} y={860} n={eu} s={1.5} />
        <Person x={1720} y={900} s={1.05 * pop(f, from + 10)} tribe="portuguese" beard skin="#f6d6c0" f={f} flip expr={shocked ? "shock" : "neutral"} look={[-1, 0]} seed={2} />
        <Label x={1400} y={560} text="any country" size={56} font={FONT_HAND} p={ip(f, [europe - 8, europe + 4], [0, 1], (x) => x)} />
        <Label x={1400} y={640} text="in Europe" size={74} font={FONT_TITLE} color={C.indigo} p={ip(f, [europe, europe + 10], [0, 1], (x) => x)} />
        <Question x={1790} y={520} s={pop(f, europe + 14)} size={90} rot={12} />
        <Sparkle x={820} y={Math.max(top, 480) - 40} s={pop(f, to - 16) * (0.8 + 0.2 * Math.sin(f / 4))} />
      </Camera>
    </SceneSvg>
  );
};

/** "War in Japan would never be the same." */
export const NeverSame: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const never = w5(45, "never");
  const smoke = ip(f, [from + 4, to], [0, 1], (x) => x);
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 540, z: 1.0 }], [to, { x: 960, y: 520, z: 1.1 }]])} shake={shakeAt(f, ip(f, [never, never + 4], [0, 1]) * ip(f, [never + 4, never + 20], [1, 0]) * 0.5)}>
        <Shade d="M-600,-400 H960 V1500 H-600 Z" fill="#d9c7a0" opacity={0.5} />
        <Shade d="M960,-400 H2700 V1500 H960 Z" fill="#6f6f78" opacity={0.4} />
        <Pencil d="M-600,880 H2700 V1500 H-600 Z" fill={C.moss} />
        <Person x={520} y={930} s={1.2} tribe="samurai" f={f} hold="katana" aR={150} expr="smile" seed={2} />
        <Label x={520} y={300} text="the old way" size={56} font={FONT_HAND} />
        {[0, 1, 2].map((i) => (
          <Person key={i} x={1250 + i * 150} y={930 + (i % 2) * 14} s={0.95} tribe="yayoi" f={f} flip hold="gun" aR={90} expr="angry" seed={i + 4} />
        ))}
        {[0, 1, 2].map((i) => (
          <GunSmoke key={i} x={1030 + i * 150} y={790} p={ip(f, [never - 6 + i * 3, never + 24 + i * 3], [0, 1], (x) => x)} />
        ))}
        <Shade d="M960,-400 H2700 V1500 H960 Z" fill={C.white} opacity={0.3 * smoke} />
        <Label x={1400} y={300} text="the new way" size={56} font={FONT_HAND} />
        <Ink d="M960,-200 L960,1200" sw={5} />
        <Label x={960} y={170} text="never the same!" size={96} font={FONT_TITLE} color={C.red} p={ip(f, [never, never + 12], [0, 1], (x) => x)} rot={-3} />
      </Camera>
    </SceneSvg>
  );
};

/** "A samurai trained his whole life to fight with a sword. Now, a farmer with a few days of training could shoot him dead." */
export const Duel: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const trained = w5(51, "trained");
  const life = w5(54, "life");
  const now = w5(60, "now");
  const farmer = w5(62, "farmer");
  const days = w5(66, "days");
  const shoot = w5(70, "shoot");
  const age = ip(f, [trained, now - 4], [0, 1]);
  const years = Math.round(age * 40);
  const fall = ip(f, [shoot + 4, shoot + 16], [0, 1], (x) => x * x);
  const swing = f > trained && f < now ? Math.sin(f / 2.2) * 50 : 0;
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 820, y: 560, z: 1.08 }], [now - 6, { x: 820, y: 560, z: 1.08 }], [now + 12, { x: 960, y: 560, z: 1.0 }], [to, { x: 980, y: 560, z: 1.04 }]])}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill={C.sky} opacity={0.22} />
        <Sun x={1300} y={130} r={54} f={f} />
        <Pencil d="M-600,880 H2700 V1500 H-600 Z" fill={C.green} />
        {/* the samurai: a lifetime of practice */}
        <g transform={fall > 0 ? `rotate(${-fall * 85},560,930)` : undefined}>
          <Person
            x={560}
            y={930}
            s={1.25}
            tribe="samurai"
            f={f}
            hold="katana"
            aR={f < now ? 110 + swing : 140}
            expr={fall > 0 ? "shock" : f > farmer + 10 ? "worry" : "angry"}
            beard={age > 0.6}
            seed={2}
          />
        </g>
        {fall > 0.8 ? <Dizzy x={360} y={840} f={f} s={1.0} /> : null}
        <Pop s={pop(f, trained - 2) * ip(f, [now, now + 8], [1, 0])} x={220} y={300}>
          <Pencil d="M110,200 h220 v220 h-220 Z" fill={C.white} sw={4} />
          <Pencil d="M110,200 h220 v54 h-220 Z" fill={C.red} sw={4} />
          <Label x={220} y={340} text={`${years}`} size={76} font={FONT_TITLE} halo={false} />
          <Label x={220} y={396} text="years" size={36} font={FONT_HAND} halo={false} />
        </Pop>
        <Label x={560} y={320} text="a WHOLE LIFE of training" size={56} font={FONT_HAND} p={ip(f, [life - 6, life + 10], [0, 1], (x) => x) * ip(f, [now, now + 8], [1, 0])} />
        {/* the farmer: a few days */}
        <Person x={1420} y={930} s={1.2 * pop(f, farmer - 4)} tribe="yayoi" f={f} flip hold="gun" aR={f > days ? 90 : 20} expr={f > shoot ? "grin" : "smile"} seed={6} />
        <Pop s={pop(f, days - 2) * ip(f, [shoot, shoot + 8], [1, 0])} x={1620} y={300}>
          <Pencil d="M1510,200 h220 v220 h-220 Z" fill={C.white} sw={4} />
          <Pencil d="M1510,200 h220 v54 h-220 Z" fill={C.red} sw={4} />
          <Label x={1620} y={340} text="3" size={76} font={FONT_TITLE} halo={false} />
          <Label x={1620} y={396} text="days" size={36} font={FONT_HAND} halo={false} />
        </Pop>
        <Label x={1420} y={600} text="farmer" size={52} font={FONT_HAND} p={ip(f, [farmer, farmer + 10], [0, 1], (x) => x)} />
        <GunSmoke x={1250} y={760} p={ip(f, [shoot, shoot + 24], [0, 1], (x) => x)} />
        <Label x={960} y={220} text="BANG!" size={120} font={FONT_TITLE} color={C.red} p={ip(f, [shoot, shoot + 4], [0, 1], (x) => x) * ip(f, [shoot + 26, shoot + 36], [1, 0])} rot={-8} />
        <Puff x={560} y={900} p={ip(f, [shoot + 14, shoot + 34], [0, 1], (x) => x)} size={80} fill={C.tan} seed={3} />
      </Camera>
    </SceneSvg>
  );
};

/** "And with this new weapon, the time had come to unite Japan." + a quiet ending */
export const Unite: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const weapon = w5(77, "weapon");
  const unite = w5(83, "unite");
  const merge = ip(f, [unite - 6, unite + 30], [0, 1]);
  const [cx, cy] = proj(137.5, 36.0);
  const fade = ip(f, [to - 24, to], [1, 0]);
  return (
    <SceneSvg f={f}>
      <g opacity={fade}>
        <Camera cam={camAt(f, [[from, { x: 1290, y: 660, z: 0.98 }], [to, { x: 1300, y: 640, z: 1.08 }]])}>
          <MapArt f={f} japanGlow={ip(f, [unite + 10, unite + 30], [0, 1]) * (0.6 + 0.4 * Math.sin(f / 6))} />
          {FLAGS.map(([x, y], i) => {
            const mx = x + (cx - x) * merge;
            const my = y + (cy - y) * merge;
            return (
              <g key={i} opacity={1 - ip(merge, [0.85, 1], [0, 1])}>
                <Ink d={`M${mx},${my} l0,-80`} sw={5} />
                <Pencil d={`M${mx},${my - 80} l52,12 l-52,14 Z`} fill={FLAG_COLORS[i % FLAG_COLORS.length]} sw={3.5} />
              </g>
            );
          })}
          <Pop s={pop(f, unite + 24, 160, 10)} x={cx} y={cy}>
            <Ink d={`M${cx},${cy} l0,-220`} sw={8} />
            <Pencil d={`M${cx},${cy - 220} l150,30 l-150,34 Z`} fill={C.red} sw={5} />
          </Pop>
          <Pop s={pop(f, weapon - 4) * ip(f, [unite - 6, unite + 4], [1, 0])} x={1700} y={860}>
            <g transform="translate(1700,860) rotate(-10)">
              <Pencil d="M-170,-8 L80,-8 L80,8 L-170,8 Z" fill="#3d3d44" sw={3.5} />
              <Pencil d="M60,-16 L160,-24 L170,12 L60,14 Z" fill={C.brown} sw={3.5} />
            </g>
          </Pop>
          <Label x={1680} y={1000} text="UNITE JAPAN" size={110} font={FONT_TITLE} color={C.red} p={ip(f, [unite, unite + 14], [0, 1], (x) => x)} rot={-4} />
          <Sparkle x={cx + 180} y={cy - 260} s={pop(f, unite + 30) * (0.8 + 0.2 * Math.sin(f / 4))} />
        </Camera>
      </g>
    </SceneSvg>
  );
};
