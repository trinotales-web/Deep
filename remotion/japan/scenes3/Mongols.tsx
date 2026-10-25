import React from "react";
import { C, FONT_HAND, FONT_TITLE, INK, ip, rand } from "../theme";
import {
  Bang,
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
  Puff,
  Question,
  Shade,
  shakeAt,
  Sparkle,
  Sun,
} from "../draw";
import { SceneSvg } from "../Stage";
import { Person } from "../Person";
import { Boom, Gusts, MongolShip, Rain, ShipIcon, SoldierIcon, StoneWall, Typhoon } from "../Props3";
import { JapanChar } from "../scenes/Together";
import { w3 } from "../part3cues";

const SEA_Y = 760;

/** Sea on the left, a beach rising on the right. */
const Coast: React.FC<{ f: number; gloom?: number; night?: number; beachX?: number }> = ({ f, gloom = 0, night = 0, beachX = 1000 }) => (
  <g>
    <Shade d="M-800,-600 H3200 V900 H-800 Z" fill={C.sky} opacity={0.22 * (1 - gloom) * (1 - night)} />
    <Shade d="M-800,-600 H3200 V900 H-800 Z" fill="#4d4d5c" opacity={0.5 * gloom} />
    <Pencil d={`M-800,${SEA_Y} Q960,${SEA_Y - 20} 3200,${SEA_Y} L3200,1600 L-800,1600 Z`} fill={gloom > 0.5 ? C.deepSea : C.sea} />
    {new Array(12).fill(0).map((_, i) => (
      <Ink key={i} d={`M${-400 + i * 260 + Math.sin(f / (12 - gloom * 8) + i) * (12 + gloom * 30)},${SEA_Y + 50 + (i % 3) * 40} q14,-11 28,0 q14,11 28,0`} sw={3} opacity={0.6} />
    ))}
    <Pencil d={`M${beachX},${SEA_Y + 30} C${beachX + 200},${SEA_Y - 30} ${beachX + 400},${SEA_Y - 60} 3200,${SEA_Y - 70} L3200,1600 L${beachX - 200},1600 Z`} fill={C.straw} />
    <Pencil d={`M${beachX + 400},${SEA_Y - 40} C${beachX + 700},${SEA_Y - 90} ${beachX + 1000},${SEA_Y - 100} 3200,${SEA_Y - 110} L3200,1600 L${beachX + 300},1600 Z`} fill={C.green} />
    {night > 0 ? <Shade d="M-800,-600 H3200 V1600 H-800 Z" fill="#1d2a55" opacity={0.55 * night} /> : null}
  </g>
);

/** "So the Mongols attacked. They had bombs made with gunpowder, something Japan had never seen before." */
export const Attack: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const attacked = w3(94, "attacked");
  const bombs = w3(97, "bombs");
  const gunpowder = w3(100, "gunpowder");
  const never = w3(104, "never");
  const throw1 = bombs - 6;
  const boom1 = gunpowder;
  const throw2 = gunpowder - 2;
  const boom2 = gunpowder + 14;
  const bombAt = (t0: number, t1: number, x0: number, x1: number, y: number) => {
    const t = ip(f, [t0, t1], [0, 1], (x) => x);
    if (t <= 0 || t >= 1) return null;
    const x = x0 + (x1 - x0) * t;
    const yy = y - Math.sin(t * Math.PI) * 300;
    return (
      <g transform={`translate(${x},${yy}) rotate(${t * 400})`}>
        <Pencil d={ellipseD(0, 0, 24)} fill="#3d3d44" sw={3.5} />
        <Pencil d="M14,-26 l4,8 l9,1 l-7,6 l2,9 l-8,-5 l-8,5 l2,-9 l-7,-6 l9,-1 Z" fill={C.yellow} sw={2} />
      </g>
    );
  };
  const shocked = f > boom1;
  const cam = camAt(f, [
    [from, { x: 900, y: 560, z: 0.95 }],
    [never - 8, { x: 1050, y: 580, z: 1.0 }],
    [to, { x: 1350, y: 620, z: 1.15 }],
  ]);
  const shake = shakeAt(f, Math.max(ip(f, [boom1, boom1 + 3], [0, 1]) * ip(f, [boom1 + 3, boom1 + 16], [1, 0]), ip(f, [boom2, boom2 + 3], [0, 1]) * ip(f, [boom2 + 3, boom2 + 16], [1, 0])));
  return (
    <SceneSvg f={f}>
      <Camera cam={cam} shake={shake}>
        <Coast f={f} />
        <Sun x={1700} y={150} r={54} f={f} />
        {[0, 1].map((i) => (
          <MongolShip key={i} x={-300 + i * 420 + ip(f, [from, attacked], [-200, 0])} y={SEA_Y + 40 + i * 30} s={0.62} tilt={Math.sin(f / 9 + i) * 2} />
        ))}
        {[880, 1010, 1140].map((x, i) => (
          <Person
            key={i}
            x={x + ip(f, [attacked - 4, attacked + 20], [-260, 0])}
            y={SEA_Y + 140 + i * 10}
            s={0.95 * pop(f, attacked - 6 + i * 3)}
            tribe="mongol"
            f={f}
            walk={f < attacked + 20 ? f * 0.6 + i : undefined}
            hold={i === 1 ? "bomb" : "spear"}
            aR={i === 1 && f > throw1 - 4 && f < throw1 + 4 ? 160 : 30}
            expr="grin"
            seed={i}
          />
        ))}
        {[1500, 1660, 1820].map((x, i) => (
          <Person key={i} x={x} y={SEA_Y + 120 + i * 12} s={1.0} tribe="samurai" f={f} flip hold="katana" aR={shocked ? 150 : 40} expr={shocked ? "shock" : "angry"} seed={i + 4} />
        ))}
        {bombAt(throw1, boom1, 1010, 1560, SEA_Y + 40)}
        {bombAt(throw2, boom2, 1010, 1740, SEA_Y + 40)}
        <Boom x={1560} y={SEA_Y + 60} p={ip(f, [boom1, boom1 + 22], [0, 1], (x) => x)} size={160} seed={2} />
        <Boom x={1740} y={SEA_Y + 50} p={ip(f, [boom2, boom2 + 22], [0, 1], (x) => x)} size={140} seed={5} />
        <Label x={1000} y={360} text="gunpowder bombs!" size={70} font={FONT_TITLE} color="#5d636e" p={ip(f, [bombs, gunpowder + 6], [0, 1], (x) => x)} rot={-4} />
        <Question x={1600} y={420} s={pop(f, never)} size={110} rot={10} />
        <Bang x={1720} y={440} s={pop(f, never + 4)} n={2} />
        <Label x={1660} y={330} text="never seen before!" size={56} font={FONT_HAND} p={ip(f, [never + 2, never + 16], [0, 1], (x) => x)} rot={-4} />
      </Camera>
    </SceneSvg>
  );
};

/** "But nature saved Japan. A huge typhoon destroyed many of their ships, and the Mongols had to turn back." */
export const Typhoon1: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const nature = w3(108, "nature");
  const typhoon = w3(113, "typhoon");
  const destroyed = w3(114, "destroyed");
  const turn = w3(124, "turn");
  const gloom = ip(f, [nature - 6, nature + 20], [0, 1]);
  const storm = ip(f, [typhoon - 6, typhoon + 6], [0, 1]);
  const cam = camAt(f, [
    [from, { x: 960, y: 560, z: 1.0 }],
    [to, { x: 960, y: 540, z: 0.95 }],
  ]);
  const ships = [300, 760, 1220, 1680];
  return (
    <SceneSvg f={f}>
      <Camera cam={cam} shake={shakeAt(f, storm * 0.25)}>
        <Shade d="M-800,-600 H3200 V900 H-800 Z" fill={C.sky} opacity={0.22 * (1 - gloom)} />
        <Shade d="M-800,-600 H3200 V900 H-800 Z" fill="#4d4d5c" opacity={0.55 * gloom} />
        <Label x={960} y={150} text="nature to the rescue" size={58} font={FONT_HAND} p={ip(f, [nature, nature + 16], [0, 1], (x) => x) * (1 - storm)} />
        {ships.map((x, i) => {
          const sinks = i === 1 || i === 2;
          const sink = sinks ? ip(f, [destroyed + i * 4, destroyed + 40 + i * 4], [0, 1]) : 0;
          const leave = !sinks ? ip(f, [turn - 6, to], [0, 1]) : 0;
          return (
            <g key={i} transform={!sinks && f > turn - 6 ? `translate(${x - leave * 700},0) scale(-1,1) translate(${-x},0)` : undefined}>
              <MongolShip
                x={x}
                y={SEA_Y + 50 + sink * 220}
                s={0.6}
                tilt={Math.sin(f / 4 + i) * 9 * storm + sink * (i === 1 ? -40 : 35)}
                broken={sink > 0.05}
              />
            </g>
          );
        })}
        <Pencil d={`M-800,${SEA_Y + 60} Q960,${SEA_Y + 40} 3200,${SEA_Y + 60} L3200,1600 L-800,1600 Z`} fill={gloom > 0.5 ? C.deepSea : C.sea} />
        {new Array(12).fill(0).map((_, i) => (
          <Ink key={i} d={`M${-300 + i * 220 + Math.sin(f / 4 + i) * 30 * storm},${SEA_Y + 110 + (i % 3) * 40} q20,-22 40,0 q20,22 40,0`} sw={4} opacity={0.6} />
        ))}
        {storm > 0 ? <Rain f={f} n={70} slant={60} /> : null}
        <Pop s={pop(f, typhoon - 6, 120, 11)} x={960} y={260}>
          <Typhoon x={960} y={260} s={0.85} f={f} puff={1 + 0.15 * Math.sin(f / 3)} />
        </Pop>
        {storm > 0.5 ? <Gusts x={1100} y={560} f={f} n={7} dir={-1} spread={500} /> : null}
        <Label x={1500} y={150} text="TYPHOON!" size={100} font={FONT_TITLE} color={C.white} p={ip(f, [typhoon, typhoon + 10], [0, 1], (x) => x)} rot={-4} halo={false} />
        <Label x={420} y={520} text="turn back!" size={64} font={FONT_HAND} color={C.white} halo={false} p={ip(f, [turn, turn + 12], [0, 1], (x) => x)} rot={-4} />
      </Camera>
    </SceneSvg>
  );
};

/** "Kublai Khan did not give up. He sent his messengers again, and this time, the shogun had them killed." */
export const Envoys: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const give = w3(130, "give");
  const sent = w3(133, "sent");
  const again = w3(136, "again");
  const shogun = w3(141, "shogun");
  const killed = w3(144, "killed");
  const walk = ip(f, [sent - 4, again + 12], [0, 1]);
  const fall = ip(f, [killed - 2, killed + 10], [0, 1]);
  const flash = ip(f, [killed - 4, killed], [0, 1]) * ip(f, [killed + 2, killed + 10], [1, 0]);
  const cam = camAt(f, [
    [from, { x: 960, y: 540, z: 1.0 }],
    [to, { x: 1000, y: 560, z: 1.06 }],
  ]);
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill={C.tan} opacity={0.45} />
        <Pencil d="M-600,880 H2700 V1500 H-600 Z" fill={C.straw} />
        {[0, 1, 2, 3].map((i) => (
          <Ink key={i} d={`M-600,${940 + i * 60} H2700`} sw={2.5} opacity={0.45} />
        ))}
        {/* Kublai, stomping */}
        <g transform={`translate(260,${930 - (f > give - 6 && f < sent ? Math.abs(Math.sin(f / 2)) * 26 : 0)})`}>
          <Person x={0} y={0} s={1.05} tribe="khan" beard f={f} expr="angry" aL={60} aR={60} seed={3} />
        </g>
        <Puff x={230} y={520} p={ip(f, [give - 6, give + 18], [0, 1], (x) => x)} size={50} fill={C.white} seed={2} />
        <Puff x={300} y={510} p={ip(f, [give, give + 24], [0, 1], (x) => x)} size={44} fill={C.white} seed={5} />
        <Label x={300} y={400} text="not giving up!" size={58} font={FONT_HAND} p={ip(f, [give - 2, give + 12], [0, 1], (x) => x) * ip(f, [sent + 4, sent + 12], [1, 0])} rot={-4} />
        {/* the messengers */}
        {[0, 1].map((i) => {
          const x = 420 + walk * 660 + i * 170;
          const lying = fall > 0;
          return (
            <g key={i}>
              <g transform={lying ? `rotate(${-80 * fall},${x},930)` : undefined} opacity={1 - fall * 0.5}>
                <Person x={x} y={930} s={0.95} tribe="mongol" f={f} walk={walk > 0 && walk < 1 ? f * 0.5 + i : undefined} hold="letter" aR={60} expr={f > shogun ? "shock" : "smile"} seed={i + 2} />
              </g>
              {/* little departing souls, the cartoon way */}
              {fall > 0.3 ? (
                <g opacity={ip(fall, [0.3, 0.6], [0, 1]) * ip(f, [killed + 30, to], [1, 0.3])} transform={`translate(${x},${700 - (f - killed) * 4})`}>
                  <Pencil d="M0,-40 C26,-40 30,-6 18,6 C10,16 14,34 0,44 C-4,30 -18,20 -18,0 C-18,-24 -14,-40 0,-40 Z" fill={C.white} sw={3} />
                  <Ink d="M-8,-14 l0,4 M8,-14 l0,4" sw={3} />
                </g>
              ) : null}
            </g>
          );
        })}
        <Label x={720} y={500} text="messengers" size={56} font={FONT_HAND} p={ip(f, [sent + 4, sent + 18], [0, 1], (x) => x) * ip(f, [shogun - 4, shogun + 4], [1, 0])} />
        <Pencil d="M1440,930 L1840,930 L1820,880 L1460,880 Z" fill={C.darkBrown} />
        <Person x={1640} y={884} s={1.1} tribe="shogun" f={f} flip expr={f > shogun - 4 ? "angry" : "neutral"} aR={f > shogun - 2 ? 150 : 30} hold={f > shogun - 2 ? "katana" : "fan"} seed={5} />
        <Bang x={1640} y={520} s={pop(f, shogun)} n={2} />
      </Camera>
      <path d="M0,0 H1920 V1080 H0 Z" fill={C.red} opacity={flash * 0.35} />
    </SceneSvg>
  );
};

/** "Japan knew the Mongols would return, so the samurai built big stone walls along the coast." */
export const Walls: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const knew = w3(146, "knew");
  const built = w3(154, "built");
  const walls = w3(157, "walls");
  const coast = w3(160, "coast");
  const wallP = ip(f, [built - 4, coast + 20], [0, 1]);
  const cam = camAt(f, [
    [from, { x: 1260, y: 540, z: 1.0 }],
    [built - 6, { x: 1200, y: 560, z: 0.95 }],
    [coast - 2, { x: 1300, y: 560, z: 0.95 }],
    [to, { x: 1700, y: 560, z: 0.92 }],
  ]);
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <Coast f={f} beachX={500} />
        <Sun x={1800} y={150} r={54} f={f} />
        <StoneWall x0={760} x1={2700} y={SEA_Y + 10} h={200} p={wallP} />
        <Person x={1450} y={SEA_Y - 40} s={1.0} tribe="samurai" f={f} hold="spyglass" aR={120} look={[-1, -0.3]} seed={4} expr={f > knew ? "worry" : "neutral"} />
        <Bubble x={1150} y={300} w={300} h={180} text="" thought fill={C.white} tail={[1330, 470]} s={pop(f, knew)} />
        {f > knew + 2 ? (
          <g opacity={ip(f, [knew + 2, knew + 8], [0, 1])}>
            <MongolShip x={1150} y={360} s={0.32} />
          </g>
        ) : null}
        {[0, 1, 2, 3].map((i) => {
          const t = ((f - built) / 40 + i * 0.25) % 1;
          if (f < built) return null;
          return (
            <Person
              key={i}
              x={1900 + i * 260 - t * 120}
              y={SEA_Y + 150 + (i % 2) * 20}
              s={0.9}
              tribe="samurai"
              f={f}
              walk={f * 0.5 + i}
              hold="stone"
              aR={170}
              aL={150}
              expr="tired"
              seed={i + 6}
              flip
            />
          );
        })}
        <Label x={1500} y={330} text="BIG STONE WALLS" size={84} font={FONT_TITLE} color="#5d636e" p={ip(f, [walls - 2, walls + 12], [0, 1], (x) => x)} rot={-3} />
        <Label x={2000} y={420} text="all along the coast" size={54} font={FONT_HAND} p={ip(f, [coast, coast + 14], [0, 1], (x) => x)} rot={-3} />
      </Camera>
    </SceneSvg>
  );
};

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const fmtLakh = (n: number) => {
  const s = Math.round(n).toString();
  if (s.length <= 3) return s;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${rest},${last3}`;
};

/** "And in 1281, the Mongols did come back, with 4,400 ships and around 1,40,000 soldiers." */
export const Fleet: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const year = w3(163, "twelve");
  const mongols = w3(167, "mongols");
  const four = w3(172, "four");
  const ships = w3(176, "ships");
  const one = w3(179, "one");
  const soldiers = w3(183, "soldiers");
  const shipCount = ip(f, [four - 2, ships + 8], [0, 4400], (x) => x);
  const fillP = ip(f, [four - 4, ships + 16], [0, 1], (x) => x);
  const card = pop(f, one - 4, 140, 12);
  const soldierCount = ip(f, [one, soldiers + 10], [0, 140000], (x) => x);
  const icons = [];
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 26; c++) {
      const k = (r * 26 + c) / (6 * 26);
      if (k > fillP) continue;
      const depth = r / 5;
      icons.push(
        <ShipIcon key={`${r}-${c}`} x={-200 + c * 95 + (r % 2) * 45} y={SEA_Y - 40 + depth * 260} s={0.7 + depth * 0.7} />,
      );
    }
  }
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 540, z: 1.0 }], [to, { x: 960, y: 580, z: 1.08 }]])}>
        <Shade d="M-800,-600 H3200 V900 H-800 Z" fill="#c9a98a" opacity={0.3} />
        <Pencil d={`M-800,${SEA_Y - 80} Q960,${SEA_Y - 90} 3200,${SEA_Y - 80} L3200,1600 L-800,1600 Z`} fill={C.sea} />
        {[0, 1, 2].map((i) => (
          <MongolShip key={i} x={300 + i * 600 + ip(f, [mongols - 6, mongols + 30], [-500, 0])} y={SEA_Y + 30 + (i % 2) * 40} s={0.55 * pop(f, mongols - 6 + i * 4)} tilt={Math.sin(f / 9 + i) * 2} />
        ))}
        {icons}
        <Pop s={pop(f, ships - 4, 190, 11)} x={960} y={260}>
          <Pencil d="M640,170 L1280,170 L1280,330 L640,330 Z" fill={C.white} sw={5} />
          <Label x={960} y={290} text={`${fmt(shipCount)} ships`} size={100} font={FONT_TITLE} color="#9a4a3a" halo={false} />
        </Pop>
      </Camera>
      {card > 0.01 ? (
        <Pop s={card} x={1400} y={620}>
          <Pencil d="M980,320 L1840,320 L1840,940 L980,940 Z" fill="#f4e7c4" sw={5} />
          {new Array(10 * 14).fill(0).map((_, i) => {
            const k = i / 140;
            if (k > soldierCount / 140000) return null;
            return <SoldierIcon key={i} x={1030 + (i % 14) * 56} y={420 + Math.floor(i / 14) * 46} s={0.8} />;
          })}
          <Pencil d="M1000,860 L1820,860 L1820,930 L1000,930 Z" fill={C.white} sw={3} />
          <Label x={1410} y={914} text={`${fmtLakh(soldierCount)} soldiers`} size={64} font={FONT_TITLE} color="#9a4a3a" halo={false} />
        </Pop>
      ) : null}
      <Pop s={pop(f, year, 200, 10)} x={250} y={200} rot={-8}>
        <Pencil d={ellipseD(250, 200, 140, 92)} fill={C.white} sw={5} />
        <Label x={250} y={236} text="1281" size={104} font={FONT_TITLE} color={C.red} halo={false} />
        <Label x={250} y={146} text="the year" size={36} font={FONT_HAND} halo={false} />
      </Pop>
    </SceneSvg>
  );
};

/** "The walls held them back for weeks, and the samurai attacked their ships at night." */
export const Hold: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const held = w3(186, "held");
  const weeks = w3(190, "weeks");
  const attacked = w3(194, "attacked");
  const night = w3(198, "night");
  const dark = ip(f, [attacked - 10, attacked + 6], [0, 1]);
  const week = Math.min(6, Math.max(1, Math.floor((f - weeks + 6) / 5) + 1));
  const raid = ip(f, [attacked - 4, night + 6], [0, 1]);
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 540, z: 1.0 }], [attacked - 8, { x: 960, y: 540, z: 1.0 }], [to, { x: 760, y: 600, z: 1.1 }]])}>
        <Coast f={f} beachX={800} night={dark} />
        {dark > 0.5 ? <Sun x={1500} y={150} r={40} f={f} color="#f4e6a6" /> : <Sun x={1700} y={150} r={54} f={f} />}
        <StoneWall x0={950} x1={2400} y={SEA_Y + 20} h={220} p={1} />
        {[1150, 1350, 1550].map((x, i) => (
          <Person key={i} x={x} y={SEA_Y - 200} s={0.85} tribe="samurai" f={f} flip hold={i === 1 ? "bow" : "katana"} aR={40} expr="grin" seed={i + 3} />
        ))}
        {/* Mongols bounce off the wall */}
        {[560, 700, 840].map((x, i) => {
          const b = f > held - 6 ? Math.abs(Math.sin((f - held) / 6 + i)) : 0;
          return (
            <Person key={i} x={x - b * 60} y={SEA_Y + 180 - b * 20} s={0.85} tribe="mongol" f={f} hold="spear" aR={30} expr={b > 0.5 ? "shock" : "angry"} seed={i} />
          );
        })}
        <Label x={1350} y={300} text="the walls hold!" size={66} font={FONT_HAND} p={ip(f, [held, held + 12], [0, 1], (x) => x) * (1 - dark)} />
        <Pop s={pop(f, weeks - 4) * (1 - dark)} x={300} y={300}>
          <Pencil d="M190,200 h220 v220 h-220 Z" fill={C.white} sw={4} />
          <Pencil d="M190,200 h220 v54 h-220 Z" fill={C.red} sw={4} />
          <Label x={300} y={350} text={`week ${week}`} size={56} font={FONT_TITLE} halo={false} />
        </Pop>
        {/* night raid */}
        {raid > 0 ? (
          <g>
            <MongolShip x={200} y={SEA_Y + 60} s={0.6} />
            {[0, 1].map((i) => (
              <g key={i} transform={`translate(${900 - raid * 520 + i * 160},${SEA_Y + 120 + i * 30})`}>
                <Person x={-30} y={-14} s={0.5} tribe="samurai" f={f} sit hold="katana" aR={140} expr="angry" seed={i} />
                <Pencil d="M-90,-14 Q0,20 90,-14 L80,-26 L-80,-26 Z" fill={C.brown} sw={3} />
              </g>
            ))}
            <Boom x={240} y={SEA_Y - 80} p={ip(f, [night, night + 26], [0, 1], (x) => x)} size={120} seed={3} />
          </g>
        ) : null}
        <Label x={600} y={330} text="night raid!" size={70} font={FONT_HAND} color={C.white} halo={false} p={ip(f, [night - 4, night + 10], [0, 1], (x) => x)} rot={-4} />
      </Camera>
    </SceneSvg>
  );
};

/** "And then, guess what happened?" */
export const Guess: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const guess = w3(201, "guess");
  const peek = ip(f, [guess - 4, guess + 14], [0, 1]);
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 540, z: 1.0 }], [to, { x: 1080, y: 480, z: 1.1 }]])}>
        <Shade d="M-800,-600 H3200 V900 H-800 Z" fill={C.sky} opacity={0.22} />
        <Cloud x={500} y={200} w={260} h={80} seed={3} />
        <Pencil d={`M-800,${SEA_Y} Q960,${SEA_Y - 20} 3200,${SEA_Y} L3200,1600 L-800,1600 Z`} fill={C.sea} />
        {[200, 620, 1040].map((x, i) => (
          <MongolShip key={i} x={x} y={SEA_Y + 40 + (i % 2) * 30} s={0.5} tilt={Math.sin(f / 9 + i) * 2} />
        ))}
        <Typhoon x={2150 - peek * 520} y={160 + peek * 60} s={0.8} f={f} grin />
        <Question x={1280} y={420} s={pop(f, guess + 8)} size={130} rot={-10} />
        <Question x={1180} y={330} s={pop(f, guess + 14)} size={90} rot={8} />
      </Camera>
    </SceneSvg>
  );
};

/** "Another typhoon hit, and it was even worse than the first. More than half of the Mongol army was lost at sea." */
export const Typhoon2: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const typhoon = w3(205, "typhoon");
  const worse = w3(211, "worse");
  const first = w3(214, "first");
  const more = w3(215, "more");
  const half = w3(217, "half");
  const lost = w3(223, "lost");
  const swap = ip(f, [more - 10, more + 2], [0, 1]);
  const storm = ip(f, [typhoon - 6, typhoon + 8], [0, 1]);
  return (
    <SceneSvg f={f}>
      {swap < 1 ? (
        <g opacity={1 - swap}>
          <Camera cam={camAt(f, [[from, { x: 960, y: 540, z: 0.95 }], [more, { x: 960, y: 560, z: 1.02 }]])} shake={shakeAt(f, storm * 0.45)}>
            <Shade d="M-800,-600 H3200 V900 H-800 Z" fill="#3c3c4a" opacity={0.65} />
            {[200, 650, 1100, 1550].map((x, i) => (
              <MongolShip key={i} x={x} y={SEA_Y + 60} s={0.5} tilt={Math.sin(f / 3 + i * 1.7) * 16 * storm} broken={i % 2 === 1 && f > typhoon + 20} />
            ))}
            <Pencil d={`M-800,${SEA_Y + 50} Q960,${SEA_Y + 20} 3200,${SEA_Y + 50} L3200,1600 L-800,1600 Z`} fill={C.deepSea} />
            {new Array(9).fill(0).map((_, i) => {
              const x = -300 + i * 300 + Math.sin(f / 5 + i) * 60;
              return <Pencil key={i} d={`M${x},${SEA_Y + 90} q60,-${110 + 40 * Math.sin(f / 4 + i)} 160,-40 q-40,-10 -60,30 Z`} fill={C.foam} sw={3} />;
            })}
            <Rain f={f} n={110} slant={80} />
            <Pop s={pop(f, typhoon - 8, 110, 11)} x={960} y={250}>
              <Typhoon x={960} y={250} s={1.15} f={f * 1.6} puff={1.15 + 0.15 * Math.sin(f / 2)} />
            </Pop>
            <Gusts x={1300} y={600} f={f * 1.5} n={10} dir={-1} spread={700} />
            {/* storm-o-meter */}
            <Pop s={pop(f, worse - 6)} x={1650} y={700}>
              <Pencil d="M1440,420 L1860,420 L1860,900 L1440,900 Z" fill={C.white} sw={4} />
              <Pencil d={`M1500,860 h100 v${-60} h-100 Z`} fill={C.gray} sw={3} />
              <Pencil d={`M1680,860 h100 v${-ip(f, [worse, first + 12], [60, 380])} h-100 Z`} fill={C.red} sw={3} />
              <Label x={1550} y={890} text="1st" size={34} font={FONT_HAND} halo={false} />
              <Label x={1730} y={890} text="2nd" size={34} font={FONT_HAND} halo={false} />
              <Label x={1650} y={470} text="storm-o-meter" size={36} font={FONT_HAND} halo={false} />
            </Pop>
            <Label x={420} y={260} text="even WORSE!" size={84} font={FONT_TITLE} color={C.white} halo={false} p={ip(f, [worse, worse + 10], [0, 1], (x) => x)} rot={-5} />
          </Camera>
        </g>
      ) : null}
      {swap > 0 ? (
        <g opacity={swap}>
          <Shade d="M0,0 H1920 V1080 H0 Z" fill="#7d8fa6" opacity={0.4} />
          <Pencil d="M-40,560 Q960,540 1960,560 L1960,1200 L-40,1200 Z" fill={C.deepSea} />
          {new Array(12).fill(0).map((_, i) => {
            const col = i % 6;
            const row = Math.floor(i / 6);
            const sinks = rand(i * 3.1) < 0.62;
            const s = sinks ? ip(f, [half - 4 + (i % 4) * 4, lost + 10 + (i % 4) * 4], [0, 1]) : 0;
            const x = 260 + col * 280 + row * 140;
            const y = 520 + row * 180;
            return (
              <g key={i} opacity={1 - s * 0.85}>
                <g transform={`translate(${x},${y + s * 160}) rotate(${s * (i % 2 ? 50 : -50)})`}>
                  <ShipIcon x={0} y={0} s={2.2} />
                </g>
                {s > 0.2 ? <Pencil d={ellipseD(x + 20, y - 40 - s * 60, 8)} fill={C.white} sw={2} opacity={1 - s} /> : null}
              </g>
            );
          })}
          <Label x={960} y={220} text="more than HALF" size={110} font={FONT_TITLE} color="#9a4a3a" p={ip(f, [half - 2, half + 10], [0, 1], (x) => x)} rot={-3} />
          <Label x={960} y={330} text="lost at sea" size={70} font={FONT_HAND} p={ip(f, [lost, lost + 12], [0, 1], (x) => x)} rot={-3} />
        </g>
      ) : null}
    </SceneSvg>
  );
};

/** "The Japanese called this storm kamikaze, which means 'the wind of the gods.'" */
export const Kamikaze: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const called = w3(228, "called");
  const kamikaze = w3(231, "kamikaze");
  const means = w3(233, "means");
  const wind = w3(235, "wind");
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 540, z: 1.0 }], [to, { x: 960, y: 520, z: 1.05 }]])}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#f2cf8a" opacity={0.35} />
        {new Array(20).fill(0).map((_, i) => {
          const a = (i / 20) * Math.PI * 2 + f * 0.004;
          return <Ink key={i} d={`M${960 + Math.cos(a) * 260},${330 + Math.sin(a) * 260} L${960 + Math.cos(a) * 900},${330 + Math.sin(a) * 900}`} sw={4} color={C.sun} opacity={0.35} />;
        })}
        <Pop s={pop(f, from + 2, 120, 12)} x={960} y={330}>
          <Typhoon x={960} y={330} s={0.7} f={f} grin />
          <path d={ellipseD(960, 150, 110, 22)} fill="none" stroke={C.yellow} strokeWidth={10} />
        </Pop>
        <Gusts x={600} y={480} f={f} n={6} dir={1} spread={400} />
        <Gusts x={1320} y={480} f={f + 20} n={6} dir={-1} spread={400} />
        <Pencil d="M-600,880 Q960,860 2600,880 L2600,1500 L-600,1500 Z" fill={C.sea} />
        <JapanChar f={f} x={1500} y={640} s={0.42} expr="grin" armL={150 + Math.sin(f / 3) * 10} armR={150 + Math.cos(f / 3) * 10} />
        <Label x={760} y={660} text="KAMIKAZE" size={150} font={FONT_TITLE} color={C.red} p={ip(f, [kamikaze - 4, kamikaze + 12], [0, 1], (x) => x)} rot={-4} />
        <DrawOn d="M420,700 Q760,676 1100,690" p={ip(f, [kamikaze + 8, kamikaze + 18], [0, 1])} sw={12} color={INK} />
        <Label x={760} y={790} text="= the wind of the gods" size={64} font={FONT_HAND} p={ip(f, [means, wind + 16], [0, 1], (x) => x)} rot={-4} />
        <Label x={760} y={540} text="they called it..." size={52} font={FONT_HAND} p={ip(f, [called, called + 12], [0, 1], (x) => x) * ip(f, [kamikaze - 4, kamikaze + 2], [1, 0])} rot={-4} />
        <Sparkle x={1180} y={560} s={pop(f, kamikaze + 6) * (0.8 + 0.2 * Math.sin(f / 4))} />
        <Sparkle x={330} y={600} s={pop(f, kamikaze + 10) * (0.8 + 0.2 * Math.sin(f / 5))} />
      </Camera>
    </SceneSvg>
  );
};

