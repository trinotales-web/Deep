import React from "react";
import { C, FONT_HAND, FONT_TITLE, ip } from "../theme";
import {
  Bang,
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
  Puff,
  Question,
  Shade,
  Sun,
} from "../draw";
import { SceneSvg } from "../Stage";
import { MapArt, mainlandD, proj } from "../MapArt";
import { Person } from "../Person";
import { RoundTree } from "../Props";
import { Banner, Throne } from "../Props2";
import { Candle, Castle, Frame, Moon, Stamp } from "../Props3";
import { JapanChar } from "../scenes/Together";
import { TitleScene } from "../scenes/Opening";
import { w3 } from "../part3cues";

export const Title3: React.FC<{ f: number }> = ({ f }) => (
  <TitleScene
    f={f}
    subtitle="part 3 · ninjas, Mongols & a divine wind"
    doodles={
      <g>
        <DrawOn d="M420,780 q40,-24 80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0" p={ip(f, [18, 52], [0, 1])} sw={4} />
        <Pop s={pop(f, 36)} x={520} y={740}>
          <g transform={`translate(520,730) rotate(${f * 6})`}>
            <Pencil d="M0,-44 L10,-10 L44,0 L10,10 L0,44 L-10,10 L-44,0 L-10,-10 Z" fill={C.gray} sw={3.5} />
            <Pencil d={ellipseD(0, 0, 8)} fill={C.white} sw={2.5} />
          </g>
        </Pop>
        <Pop s={pop(f, 46)} x={1430} y={740}>
          <g transform={`translate(1430,700) rotate(${-f * 5})`}>
            <Ink d="M-40,0 A40,40 0 0,1 0,-40 M0,-40 A30,30 0 0,1 30,0 M30,0 A20,20 0 0,1 0,20" sw={6} color={C.darkGray} />
          </g>
        </Pop>
      </g>
    }
  />
);

/** "So if the samurai were the army, who were the ninjas? Think of them as secret agents." */
export const Ninjas: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const samurai = w3(3, "samurai");
  const army = w3(6, "army");
  const ninjas = w3(10, "ninjas");
  const secret = w3(15, "secret");
  const drop = ip(f, [ninjas - 8, ninjas + 4], [0, 1]);
  const cam = camAt(f, [
    [from, { x: 820, y: 540, z: 1.0 }],
    [ninjas - 6, { x: 820, y: 540, z: 1.0 }],
    [ninjas + 8, { x: 1080, y: 560, z: 1.08 }],
    [to, { x: 1120, y: 560, z: 1.12 }],
  ]);
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <Shade d="M-600,-400 H2700 V760 H-600 Z" fill={C.sky} opacity={0.22} />
        <Sun x={1650} y={150} r={54} f={f} />
        <Pencil d="M-600,760 Q960,740 2600,760 L2600,1500 L-600,1500 Z" fill={C.green} />
        {[180, 330, 480].map((x, i) => (
          <g key={i}>
            <Pop s={pop(f, army - 6 + i * 3)} x={x - 60} y={920}>
              <Banner x={x - 60} y={920} color={C.white} s={0.75} wave={Math.sin(f / 5 + i) * 6} />
            </Pop>
            <Person x={x} y={930} s={0.95 * pop(f, samurai - 4 + i * 3)} tribe="samurai" f={f} hold="katana" aR={40} expr="grin" seed={i} />
          </g>
        ))}
        <Label x={330} y={460} text="the army" size={64} font={FONT_HAND} p={ip(f, [army, army + 12], [0, 1], (x) => x)} rot={-4} />
        {/* a ninja drops in on a rope */}
        {drop > 0 ? <Ink d={`M1150,-200 L1150,${-200 + drop * 900}`} sw={3} /> : null}
        <Person x={1150} y={-200 + drop * 1130} s={1.15} tribe="ninja" f={f} expr="smile" aL={150} aR={f > secret ? 30 : 150} hold={f > secret ? "spyglass" : "none"} seed={4} />
        <Question x={1330} y={340} s={pop(f, ninjas + 4)} size={120} rot={10} />
        <Pop s={pop(f, secret + 2, 190, 10)} x={1560} y={520} rot={-6}>
          <Pencil d="M1400,400 L1720,400 L1720,640 L1400,640 Z" fill={C.tan} sw={4} />
          <Pencil d="M1400,400 L1520,400 L1540,376 L1400,376 Z" fill={C.tan} sw={4} />
          <Label x={1560} y={560} text="TOP SECRET" size={54} font={FONT_TITLE} color={C.red} halo={false} rot={-8} />
        </Pop>
        <Label x={1150} y={300} text="secret agents!" size={70} font={FONT_HAND} p={ip(f, [secret, secret + 14], [0, 1], (x) => x)} rot={-4} />
      </Camera>
    </SceneSvg>
  );
};

/** "By day, they looked like normal farmers or monks." */
export const ByDay: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const day = w3(18, "day");
  const farmers = w3(23, "farmers");
  const monks = w3(25, "monks");
  const cam = camAt(f, [
    [from, { x: 960, y: 540, z: 1.0 }],
    [to, { x: 960, y: 560, z: 1.06 }],
  ]);
  const secretBubble = (x: number, y: number, at: number) => (
    <g>
      <Bubble x={x} y={y} w={190} h={130} text="" thought fill={C.white} tail={[x - 60, y + 130]} s={pop(f, at + 8)} />
      {f > at + 10 ? (
        <g opacity={ip(f, [at + 10, at + 16], [0, 1])}>
          <Person x={x} y={y + 100} s={0.4} tribe="ninja" f={f} expr="happy" seed={9} />
        </g>
      ) : null}
    </g>
  );
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <Shade d="M-600,-400 H2700 V720 H-600 Z" fill={C.sky} opacity={0.25} />
        <Sun x={960} y={170} r={70} f={f} />
        <Label x={960} y={330} text="by day..." size={76} font={FONT_HAND} p={ip(f, [day - 2, day + 10], [0, 1], (x) => x)} />
        <Pencil d="M-600,700 Q960,680 2600,700 L2600,1500 L-600,1500 Z" fill={C.green} />
        <Pencil d="M100,720 L760,720 L840,860 L40,860 Z" fill="#a9c3cf" sw={3.5} />
        {new Array(8).fill(0).map((_, i) => (
          <Ink key={i} d={`M${140 + i * 80},${810} l-6,-18 M${146 + i * 80},${810} l0,-24 M${152 + i * 80},${810} l6,-18`} sw={2.5} color={C.darkGreen} />
        ))}
        <RoundTree x={1720} y={720} s={0.9} seed={2} />
        <Person x={520} y={930} s={1.15 * pop(f, farmers - 6)} tribe="yayoi" f={f} hold="sickle" aR={30} expr="happy" seed={3} />
        <Label x={520} y={1010} text="farmer" size={50} font={FONT_HAND} p={ip(f, [farmers, farmers + 10], [0, 1], (x) => x)} />
        <Person x={1360} y={930} s={1.15 * pop(f, monks - 6)} tribe="monk" f={f} hold="beads" aR={30} expr="happy" seed={6} />
        <Label x={1360} y={1010} text="monk" size={50} font={FONT_HAND} p={ip(f, [monks, monks + 10], [0, 1], (x) => x)} />
        {secretBubble(720, 500, farmers)}
        {secretBubble(1560, 500, monks)}
      </Camera>
    </SceneSvg>
  );
};

/** "But at night, they sneaked into enemy castles to spy, or to kill someone quietly." */
export const ByNight: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const night = w3(28, "night");
  const sneaked = w3(30, "sneaked");
  const castles = w3(33, "castles");
  const spy = w3(35, "spy");
  const kill = w3(38, "kill");
  const quietly = w3(40, "quietly");
  const swap = night + 8;
  // hop-hop-hop to the castle roof
  const t = ip(f, [sneaked - 4, castles + 4], [0, 1], (x) => x);
  const nx = 360 + t * 880;
  const hop = Math.abs(Math.sin(t * Math.PI * 3)) * 220;
  const ny = 900 - hop - t * 310;
  const atWindow = f > spy - 6;
  const inside = ip(f, [kill - 8, kill + 4], [0, 1]);
  const dark = ip(f, [quietly + 6, quietly + 16], [0, 1]);
  const cam = camAt(f, [
    [from, { x: 960, y: 540, z: 1.0 }],
    [spy - 8, { x: 1080, y: 520, z: 1.05 }],
    [spy + 6, { x: 1220, y: 460, z: 1.4 }],
    [to, { x: 1220, y: 460, z: 1.4 }],
  ]);
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#26335e" opacity={0.55} />
        <Moon x={360} y={190} r={64} />
        {[[200, 360], [700, 120], [1500, 90], [1800, 260], [1100, 220]].map(([x, y], i) => (
          <Ink key={i} d={`M${x - 8},${y} h16 M${x},${y - 8} v16`} sw={3} color="#f4e6a6" opacity={0.6 + 0.4 * Math.sin(f / 6 + i)} />
        ))}
        <Pencil d="M-600,880 Q960,860 2600,880 L2600,1500 L-600,1500 Z" fill="#4c6b4a" />
        <Castle x={1300} y={900} s={0.9} lit />
        {/* farmer by day, ninja by night */}
        {f < swap ? (
          <Person x={360} y={930} s={1.05} tribe="yayoi" f={f} hold="sickle" aR={30} expr="smile" seed={3} />
        ) : (
          <Person
            x={atWindow ? 1240 : nx}
            y={atWindow ? 560 : ny + 30}
            s={atWindow ? 0.8 : 1.0}
            tribe="ninja"
            f={f}
            walk={!atWindow && t > 0 && t < 1 ? f * 0.6 : undefined}
            hold={atWindow ? "spyglass" : "none"}
            aR={atWindow ? 40 : 20}
            expr="smile"
            look={[1, -0.3]}
            seed={4}
          />
        )}
        <Puff x={360} y={760} p={ip(f, [swap - 6, swap + 12], [0, 1], (x) => x)} size={150} fill={C.darkGray} seed={4} />
        <Label x={480} y={420} text="...by night" size={72} font={FONT_HAND} color={C.white} p={ip(f, [night, night + 12], [0, 1], (x) => x)} halo={false} />
        <Label x={1300} y={300} text="spy!" size={60} font={FONT_HAND} color={C.white} halo={false} p={ip(f, [spy, spy + 8], [0, 1], (x) => x) * (1 - inside)} />
      </Camera>
      {/* "...or to kill someone quietly": a candle goes out */}
      {inside > 0 ? (
        <g opacity={inside}>
          <path d="M0,0 H1920 V1080 H0 Z" fill="#1d2440" opacity={0.92} />
          <Candle x={960} y={760} lit={1 - ip(f, [quietly + 2, quietly + 6], [0, 1])} f={f} />
          <Person x={760} y={900} s={1.0} tribe="ninja" f={f} expr="smile" aR={140} seed={4} />
          <Label x={1180} y={460} text="shhh..." size={72} font={FONT_HAND} color={C.white} halo={false} p={ip(f, [quietly - 4, quietly + 8], [0, 1], (x) => x)} />
          <path d="M0,0 H1920 V1080 H0 Z" fill="#0d1020" opacity={dark * 0.72} />
        </g>
      ) : null}
    </SceneSvg>
  );
};

/** "For a long time, no enemy came from outside Japan. But in 1274, that changed. The Mongols were coming." */
export const Peace: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const enemy = w3(46, "enemy");
  const outside = w3(49, "outside");
  const year = w3(53, "twelve");
  const changed = w3(57, "changed");
  const mongols = w3(59, "mongols");
  const coming = w3(61, "coming");
  const awake = f > changed - 2;
  const horde = ip(f, [mongols - 6, to], [0, 1]);
  const gloom = ip(f, [mongols - 6, mongols + 20], [0, 1]);
  const cam = camAt(f, [
    [from, { x: 1100, y: 520, z: 1.0 }],
    [changed - 4, { x: 1120, y: 520, z: 1.05 }],
    [mongols + 6, { x: 900, y: 520, z: 0.92 }],
    [to, { x: 880, y: 520, z: 0.9 }],
  ]);
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <Shade d="M-800,-600 H2900 V820 H-800 Z" fill={C.sky} opacity={0.22 * (1 - gloom)} />
        <Shade d="M-800,-600 H2900 V820 H-800 Z" fill="#5b4f63" opacity={0.4 * gloom} />
        <Sun x={1700} y={150} r={56} f={f} />
        <Cloud x={600} y={190} w={240} h={80} seed={4} opacity={1 - gloom} />
        <Pencil d="M-800,800 Q960,780 2800,800 L2800,1500 L-800,1500 Z" fill={C.sea} />
        {new Array(10).fill(0).map((_, i) => (
          <Ink key={i} d={`M${-300 + i * 260 + Math.sin(f / 15 + i) * 12},${860 + (i % 3) * 34} q14,-11 28,0 q14,11 28,0`} sw={3} opacity={0.6} />
        ))}
        {/* a protective bubble around Japan while it naps */}
        <DrawOn d="M1230,180 a400,380 0 1,0 1,0" p={ip(f, [enemy - 6, outside + 10], [0, 1]) * (awake ? ip(f, [changed, changed + 8], [1, 0]) : 1)} sw={5} dotted />
        <JapanChar
          f={f}
          x={1230}
          y={460}
          s={0.62}
          expr={awake ? (f > mongols ? "shock" : "worry") : "sleep"}
          armL={awake ? 80 : 20}
          armR={awake ? 80 : 20}
        />
        {!awake ? <Label x={1480} y={260 - ((f / 3) % 30)} text="z z z" size={52} font={FONT_HAND} halo={false} /> : null}
        <Label x={1230} y={140} text="no enemies from outside" size={56} font={FONT_HAND} p={ip(f, [enemy, outside + 12], [0, 1], (x) => x) * ip(f, [changed - 4, changed + 4], [1, 0])} />
        <Bang x={1440} y={250} s={pop(f, changed + 2)} n={2} />
        {/* the horde on the horizon */}
        {horde > 0 ? (
          <g transform={`translate(${-560 + horde * 640},0)`}>
            <Pencil d="M-640,830 Q-60,660 520,830 Z" fill="#6d4b3c" sw={3} />
            {new Array(14).fill(0).map((_, i) => (
              <g key={i} transform={`translate(${(i % 7) * 120 - 520 + Math.floor(i / 7) * 60},${770 + Math.floor(i / 7) * 46}) scale(0.72)`}>
                <Person x={0} y={0} s={1} tribe="mongol" f={f} walk={f * 0.6 + i} expr="grin" seed={i} hold={i % 4 === 0 ? "bannerRed" : "spear"} aR={20} />
              </g>
            ))}
          </g>
        ) : null}
        <Label x={400} y={420} text="MONGOLS!" size={120} font={FONT_TITLE} color="#9a4a3a" p={ip(f, [mongols, mongols + 12], [0, 1], (x) => x)} rot={-5} />
        <Label x={420} y={500} text="...are coming" size={56} font={FONT_HAND} p={ip(f, [coming, coming + 10], [0, 1], (x) => x)} rot={-5} />
      </Camera>
      <Pop s={pop(f, year, 200, 10)} x={250} y={200} rot={-8}>
        <Pencil d={ellipseD(250, 200, 140, 92)} fill={C.white} sw={5} />
        <Label x={250} y={236} text="1274" size={104} font={FONT_TITLE} color={C.red} halo={false} />
        <Label x={250} y={146} text="the year" size={36} font={FONT_HAND} halo={false} />
      </Pop>
    </SceneSvg>
  );
};

/** "Kublai Khan, the grandson of Genghis Khan, had already taken over China. Now he wanted Japan too." */
export const Kublai: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const kublai = w3(62, "kublai");
  const grandson = w3(65, "grandson");
  const genghis = w3(67, "genghis");
  const taken = w3(71, "taken");
  const china = w3(73, "china");
  const wanted = w3(76, "wanted");
  const japan = w3(77, "japan");
  const swap = ip(f, [taken - 14, taken - 2], [0, 1]);
  const spread = ip(f, [taken - 2, china + 14], [0, 1]);
  const [mx, my] = proj(108, 49);
  const [jx, jy] = proj(138, 36.5);
  const cam = camAt(f, [
    [taken - 2, { x: 760, y: 600, z: 0.86 }],
    [wanted - 4, { x: 820, y: 620, z: 0.9 }],
    [japan + 8, { x: 1050, y: 640, z: 1.0 }],
    [to, { x: 1080, y: 640, z: 1.04 }],
  ]);
  return (
    <SceneSvg f={f}>
      {swap < 1 ? (
        <g opacity={1 - swap}>
          <Camera cam={camAt(f, [[from, { x: 960, y: 540, z: 1.0 }], [taken, { x: 960, y: 540, z: 1.06 }]])}>
            <Pencil d="M-300,-200 H2200 V760 H-300 Z" fill="#b9573f" />
            {new Array(9).fill(0).map((_, i) => (
              <Ink key={i} d={`M${-200 + i * 260},-200 L${-200 + i * 260},760`} sw={3} color={C.yellow} opacity={0.5} />
            ))}
            <Pencil d="M-300,760 H2200 V1400 H-300 Z" fill="#7a3a2a" />
            <Throne x={760} y={900} s={1.15} />
            <Person x={760} y={850} s={1.45 * pop(f, kublai - 4)} tribe="khan" beard f={f} sit expr={f > wanted ? "grin" : "smile"} aR={30} seed={3} />
            <Label x={760} y={180} text="KUBLAI KHAN" size={96} font={FONT_TITLE} color={C.yellow} p={ip(f, [kublai, kublai + 12], [0, 1], (x) => x)} />
            <Pop s={pop(f, genghis - 6, 180, 11)} x={1450} y={430}>
              <Frame x={1450} y={430} w={300} h={360}>
                <Person x={1450} y={660} s={1.1} tribe="khan" beard f={f} expr="angry" seed={8} blinkOff />
              </Frame>
              <Label x={1450} y={680} text="Genghis Khan" size={46} font={FONT_HAND} />
              <Label x={1450} y={724} text="(grandpa)" size={38} font={FONT_HAND} />
            </Pop>
            <DrawOn d="M1290,520 C1120,580 980,560 900,520" p={ip(f, [grandson, grandson + 14], [0, 1])} sw={5} dotted />
            <Label x={1080} y={500} text="grandson" size={46} font={FONT_HAND} p={ip(f, [grandson + 4, grandson + 14], [0, 1], (x) => x)} rot={-6} />
          </Camera>
        </g>
      ) : null}
      {swap > 0 ? (
        <g opacity={swap}>
          <Camera cam={cam}>
            <MapArt f={f} />
            {/* the Mongol empire spreads over China */}
            <clipPath id="mongolSpread">
              <circle cx={mx} cy={my} r={spread * 1500} />
            </clipPath>
            <g clipPath="url(#mongolSpread)">
              <Pencil d={mainlandD()} fill="#b9573f" ink={false} fillOpacity={0.7} />
            </g>
            <Label x={proj(116, 35)[0]} y={proj(116, 35)[1]} text="CHINA" size={90} font={FONT_TITLE} p={ip(f, [china - 2, china + 10], [0, 1], (x) => x)} />
            <Label x={proj(116, 31.5)[0]} y={proj(116, 31.5)[1]} text="(taken!)" size={50} font={FONT_HAND} p={ip(f, [china + 6, china + 18], [0, 1], (x) => x)} />
            <g transform={`translate(${proj(120, 41)[0]},${proj(120, 41)[1] + 120})`}>
              <Person x={0} y={0} s={0.7} tribe="khan" beard f={f} expr={f > wanted ? "grin" : "smile"} look={[1, 0]} seed={3} aR={f > japan ? 100 : 20} />
            </g>
            <DrawOn d={`M${proj(124, 40)[0]},${proj(124, 40)[1]} Q${proj(131, 44)[0]},${proj(131, 44)[1]} ${jx - 40},${jy - 30}`} p={ip(f, [wanted, japan + 10], [0, 1])} sw={7} dotted color={C.red} />
            {[0, 1, 2].map((i) => (
              <Heart key={i} x={jx + 60 + i * 60} y={jy - 140 - i * 30} s={pop(f, japan + 4 + i * 4) * (1 + 0.1 * Math.sin(f / 3 + i))} color={C.red} />
            ))}
            <Label x={jx + 180} y={jy + 40} text="Japan too!" size={72} font={FONT_TITLE} color={C.red} p={ip(f, [japan + 2, japan + 14], [0, 1], (x) => x)} rot={-6} />
          </Camera>
        </g>
      ) : null}
    </SceneSvg>
  );
};

/** "He told Japan to accept him as its ruler, but Japan refused." */
export const Letter: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const told = w3(80, "told");
  const accept = w3(83, "accept");
  const refused = w3(90, "refused");
  const fly = ip(f, [told - 6, accept - 2], [0, 1]);
  const open = ip(f, [accept - 4, accept + 10], [0, 1]);
  const cam = camAt(f, [
    [from, { x: 960, y: 540, z: 1.0 }],
    [to, { x: 980, y: 540, z: 1.05 }],
  ]);
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <Shade d="M-600,-400 H960 V1500 H-600 Z" fill="#b9573f" opacity={0.35} />
        <Shade d="M960,-400 H2700 V1500 H960 Z" fill={C.tan} opacity={0.45} />
        <Pencil d="M-600,880 H2700 V1500 H-600 Z" fill={C.straw} />
        <Person x={260} y={930} s={1.15} tribe="khan" beard f={f} expr={f > refused + 4 ? "angry" : "grin"} aR={f < accept ? 90 : 20} seed={3} />
        <Person x={1680} y={930} s={1.2} tribe="shogun" f={f} expr={f > refused - 4 ? "angry" : "neutral"} aR={f > refused - 4 ? 140 : 20} seed={5} flip />
        {/* the demand */}
        <g transform={`translate(${380 + fly * 580},${720 - Math.sin(fly * Math.PI) * 280 - fly * 320}) rotate(${(1 - fly) * 360})`}>
          {open < 0.05 ? (
            <g>
              <Pencil d="M-60,-16 h120 v32 h-120 Z" fill="#f4e7c4" sw={3.5} />
              <Pencil d={ellipseD(-62, 0, 9, 20)} fill={C.darkBrown} sw={3} />
              <Pencil d={ellipseD(62, 0, 9, 20)} fill={C.darkBrown} sw={3} />
            </g>
          ) : (
            <g transform={`scale(${0.2 + open * 0.8})`}>
              <Pencil d="M-300,-180 h600 v360 h-600 Z" fill="#f4e7c4" />
              {[-1, 1].map((sd) => (
                <Pencil key={sd} d={`M${sd * 300 - 14},-200 h28 v400 h-28 Z`} fill={C.darkBrown} sw={3.5} />
              ))}
              <Label x={0} y={-80} text="To Japan:" size={52} font={FONT_HAND} halo={false} />
              <Label x={0} y={0} text="Accept me as" size={60} font={FONT_HAND} halo={false} />
              <Label x={0} y={70} text="your ruler!" size={60} font={FONT_HAND} halo={false} />
              <Label x={140} y={150} text="— Kublai" size={44} font={FONT_HAND} halo={false} />
            </g>
          )}
        </g>
        <Stamp x={1000} y={430} s={pop(f, refused, 220, 9)} text="NO!" font={FONT_TITLE} />
        <Bang x={1760} y={560} s={pop(f, refused + 2)} n={2} />
      </Camera>
    </SceneSvg>
  );
};

