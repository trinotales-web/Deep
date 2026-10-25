import React from "react";
import { C, FONT_HAND, FONT_TITLE, ip } from "../theme";
import { Bang, Bubble, Camera, camAt, DrawOn, ellipseD, Ink, Label, Pencil, pop, Pop, Puff, Shade, shakeAt, Sparkle, Sun } from "../draw";
import { SceneSvg } from "../Stage";
import { MapArt } from "../MapArt";
import { Person } from "../Person";
import { Banner, Scroll, Throne } from "../Props2";
import { Candle, Frame } from "../Props3";
import { ClashIcon, Flames } from "../Props4";
import { Troop } from "../Props6";
import { Branch, Fog, Hourglass, Notes, Songbird, TokugawaCrest } from "../Props7";
import { w7 } from "../part7cues";
import { ClockFace, EDO, NameCard, OSAKA, Pennant, scr, SceneProps, SEKI, Tear, TOKU, WEST } from "./common";

/** "Hideyoshi's son was still a small child. So the most powerful man in Japan was now Tokugawa Ieyasu." */
export const Child: React.FC<SceneProps> = ({ f, from, to }) => {
  const son = w7(143, "son");
  const child = w7(148, "child");
  const powerful = w7(152, "powerful");
  const toku = w7(158, "tokugawa");
  const enter = ip(f, [powerful - 10, toku], [0, 1]);
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 820, y: 600, z: 1.2 }], [powerful - 6, { x: 820, y: 600, z: 1.2 }], [toku, { x: 1000, y: 560, z: 1.0 }], [to, { x: 1020, y: 560, z: 1.02 }]])}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#f2cf8a" opacity={0.3} />
        <Pencil d="M-600,880 H2700 V1500 H-600 Z" fill="#b89f7a" />
        <Throne x={820} y={880} s={1.1} />
        {/* a little boy in his father's huge helmet */}
        <Person x={820} y={800} s={0.62} tribe="hideyoshi" f={f} sit expr="happy" hold="fan" aR={110 + Math.sin(f / 4) * 20} seed={5} />
        <Pencil d={ellipseD(640, 870, 22)} fill={C.red} sw={3} />
        <Ink d="M626,860 Q640,850 654,860" sw={2} color={C.white} />
        <Person x={1800 - enter * 380} y={930} s={1.45} tribe="ieyasu" f={f} flip walk={enter > 0 && enter < 1 ? f * 0.4 : undefined} expr="smile" aR={20} seed={1} />
        {enter >= 1 ? (
          <g>
            <Banner x={1650} y={900} color={C.white} s={0.9} crest={false} />
            <TokugawaCrest x={1690} y={660} r={30} />
          </g>
        ) : null}
        <Sparkle x={1500} y={520} s={pop(f, toku + 10) * (0.8 + 0.2 * Math.sin(f / 4))} />
      </Camera>
      <Label x={560} y={170} text="Hideyoshi's son..." size={62} font={FONT_HAND} p={ip(f, [son - 4, son + 10], [0, 1], (t) => t) * ip(f, [powerful - 8, powerful], [1, 0])} />
      <Label x={560} y={250} text="a small child!" size={74} font={FONT_TITLE} color={C.red} p={ip(f, [child - 2, child + 10], [0, 1], (t) => t) * ip(f, [powerful - 8, powerful], [1, 0])} rot={-3} />
      <Label x={960} y={160} text="the most powerful man in Japan:" size={56} font={FONT_HAND} p={ip(f, [powerful - 4, powerful + 16], [0, 1], (t) => t)} />
      <NameCard x={1330} y={300} s={pop(f, toku)} text="TOKUGAWA IEYASU" fill="#cfe0c4" w={720} />
    </SceneSvg>
  );
};

/** "Ieyasu was the opposite of Nobunaga. Nobunaga was wild, but Ieyasu was patient." */
export const Opposite: React.FC<SceneProps> = ({ f, from, to }) => {
  const opposite = w7(163, "opposite");
  const wild = w7(168, "wild");
  const patient = w7(172, "patient");
  const rage = f > wild - 4;
  return (
    <SceneSvg f={f}>
      <Shade d="M0,0 H960 V1080 H0 Z" fill={C.red} opacity={0.18 + (rage ? 0.12 : 0)} />
      <Shade d="M960,0 H1920 V1080 H960 Z" fill={C.sky} opacity={0.35} />
      <Camera cam={{ x: 960, y: 540, z: 1.0 }} shake={rage && f < patient - 6 ? shakeAt(f, 0.25) : [0, 0]}>
        {rage ? <Flames x={220} y={880} s={0.8} f={f} seed={2} /> : null}
        {rage ? <Flames x={740} y={880} s={0.8} f={f} seed={5} /> : null}
        <Person x={480} y={900} s={1.6} tribe="nobunaga" f={f} expr={rage ? "angry" : "neutral"} hold="katana" aR={rage ? 160 + Math.sin(f / 2) * 12 : 30} seed={1} />
      </Camera>
      <Pencil d="M0,880 H960 V1100 H0 Z" fill="#b89f7a" />
      <Pencil d="M960,880 H1920 V1100 H960 Z" fill={C.moss} />
      <Person x={1440} y={900} s={1.6} tribe="ieyasu" f={f} sit expr={f > patient ? "happy" : "smile"} hold="teabowl" aR={100} seed={2} />
      <DrawOn d="M960,0 L960,1080" p={ip(f, [opposite - 6, opposite + 10], [0, 1])} sw={8} />
      <Label x={480} y={190} text="Nobunaga" size={60} font={FONT_HAND} />
      <Label x={1440} y={190} text="Ieyasu" size={60} font={FONT_HAND} />
      <Label x={480} y={300} text="WILD!" size={120} font={FONT_TITLE} color={C.red} p={ip(f, [wild, wild + 6], [0, 1], (t) => t)} rot={-8} />
      <Label x={1440} y={300} text="patient..." size={96} font={FONT_TITLE} color={C.indigo} p={ip(f, [patient, patient + 12], [0, 1], (t) => t)} rot={-3} />
      <Pop s={pop(f, opposite)} x={960} y={540}>
        <Pencil d={ellipseD(960, 540, 70)} fill={C.white} sw={5} />
        <Label x={960} y={566} text="vs" size={72} font={FONT_TITLE} halo={false} />
      </Pop>
    </SceneSvg>
  );
};

/** "Nobunaga had once ordered the death of Ieyasu's son, and still Ieyasu stayed loyal and waited." */
export const Loyal: React.FC<SceneProps> = ({ f, from, to }) => {
  const ordered = w7(176, "ordered");
  const son = w7(181, "son");
  const still = w7(183, "still");
  const loyal = w7(186, "loyal");
  const waited = w7(188, "waited");
  const bow = ip(f, [still, loyal], [0, 30]);
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 560, z: 1.0 }], [to, { x: 960, y: 580, z: 1.08 }]])}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#9aa0b8" opacity={0.3} />
        <Pencil d="M-600,880 H2700 V1500 H-600 Z" fill="#b8ab8f" />
        <Person x={520} y={930} s={1.45} tribe="nobunaga" f={f} expr="angry" hold="letter" aR={f > ordered ? 95 : 20} look={[1, 0]} seed={1} />
        <Pop s={pop(f, ordered)} x={800} y={600}>
          <Pencil d="M690,520 h220 v160 h-220 Z" fill="#f4e7c4" sw={4} />
          {[0, 1, 2].map((k) => (
            <Ink key={k} d={`M715,${560 + k * 30} h${170 - k * 30}`} sw={3} opacity={0.6} />
          ))}
          <Pencil d={ellipseD(870, 650, 20)} fill={C.red} sw={3} />
        </Pop>
        <g transform={`rotate(${-bow},1320,930)`}>
          <Person x={1320} y={930} s={1.45} tribe="ieyasu" f={f} flip expr={f > still ? "tired" : "worry"} look={[-1, 0.4]} seed={2} />
        </g>
        <Tear x={1320} y={930} s={1.45} t={ip(f, [son, son + 30], [0, 1], (t) => t)} />
        <Hourglass x={1640} y={560} s={0.9 * pop(f, waited - 4)} p={ip(f, [waited, to], [0, 0.6], (t) => t)} />
      </Camera>
      <Label x={1100} y={190} text="his own son..." size={64} font={FONT_HAND} p={ip(f, [son - 6, son + 8], [0, 1], (t) => t) * ip(f, [still, still + 6], [1, 0])} />
      <Label x={1100} y={190} text="still LOYAL" size={96} font={FONT_TITLE} color={C.darkGreen} p={ip(f, [loyal - 4, loyal + 8], [0, 1], (t) => t)} rot={-3} />
      <Label x={1640} y={330} text="...and waited" size={56} font={FONT_HAND} p={ip(f, [waited, waited + 10], [0, 1], (t) => t)} />
    </SceneSvg>
  );
};

/** "That's why Japan has a famous saying about these three men." */
export const Saying: React.FC<SceneProps> = ({ f, from, to }) => {
  const famous = w7(194, "famous");
  const three = w7(198, "three");
  const who: [string, "nobunaga" | "hideyoshi" | "ieyasu"][] = [
    ["Nobunaga", "nobunaga"],
    ["Hideyoshi", "hideyoshi"],
    ["Ieyasu", "ieyasu"],
  ];
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 560, z: 1.0 }], [to, { x: 960, y: 560, z: 1.04 }]])}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#e9d7b0" opacity={0.4} />
        <Scroll x={960} y={200} w={900} h={130} p={ip(f, [famous - 6, famous + 8], [0, 1])}>
          <Label x={960} y={226} text="a famous saying..." size={70} font={FONT_TITLE} color={C.red} halo={false} />
        </Scroll>
        {who.map(([name, tribe], i) => (
          <Pop key={tribe} s={pop(f, three - 10 + i * 5)} x={420 + i * 540} y={600}>
            <Frame x={420 + i * 540} y={600} w={360} h={420}>
              <Person x={420 + i * 540} y={790} s={1.2} tribe={tribe} f={f} flip={i === 2} expr="smile" seed={i + 1} />
            </Frame>
            <Label x={420 + i * 540} y={880} text={name} size={52} font={FONT_HAND} />
          </Pop>
        ))}
      </Camera>
    </SceneSvg>
  );
};

/** One panel of the saying: a man, a bird on a branch, a line. */
const BirdPanel: React.FC<{ f: number; x: number; s: number; children: React.ReactNode; line: string; lineP: number; color: string }> = ({ f, x, s, children, line, lineP, color }) =>
  s <= 0.01 ? null : (
    <Pop s={s} x={x} y={560}>
      <Pencil d={`M${x - 290},230 h580 v600 h-580 Z`} fill={C.white} sw={6} />
      {children}
      <Label x={x} y={900} text={line} size={64} font={FONT_TITLE} color={color} p={lineP} rot={-3} />
    </Pop>
  );

/** "If the bird won't sing, Nobunaga kills it. Hideyoshi convinces it to sing. And Ieyasu waits until it sings." */
export const Bird: React.FC<SceneProps> = ({ f, from, to }) => {
  const won = w7(203, "won't");
  const nob = w7(205, "nobunaga");
  const kills = w7(206, "kills");
  const hide = w7(208, "hideyoshi");
  const convinces = w7(209, "convinces");
  const sing2 = w7(212, "sing");
  const iey = w7(214, "ieyasu");
  const waits = w7(215, "waits");
  const sings = w7(218, "sings");
  const intro = ip(f, [nob - 8, nob], [1, 0]);
  return (
    <SceneSvg f={f}>
      <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#e9d7b0" opacity={0.35} />
      {intro > 0 ? (
        <g opacity={intro}>
          <Branch x0={700} x1={1260} y={560} />
          <Songbird x={980} y={556} s={1.6} f={f} />
          <Bubble x={1180} y={330} w={200} h={100} text="..." s={pop(f, won)} tail={[1060, 440]} size={70} fill={C.white} />
          <Label x={960} y={190} text="if the bird won't sing..." size={76} font={FONT_TITLE} color={C.indigo} p={ip(f, [from + 4, won + 10], [0, 1], (t) => t)} rot={-3} />
        </g>
      ) : null}
      <BirdPanel f={f} x={340} s={pop(f, nob)} line="kills it!" lineP={ip(f, [kills, kills + 8], [0, 1], (t) => t)} color={C.red}>
        <Branch x0={380} x1={600} y={360} />
        <Songbird x={480} y={356} s={0.9} f={f} scared={f > kills} />
        <Puff x={480} y={320} p={ip(f, [kills + 2, kills + 22], [0, 1], (t) => t)} size={60} fill={C.white} seed={5} />
        <Person x={290} y={800} s={1.2} tribe="nobunaga" f={f} expr="angry" hold="katana" aR={f > kills ? 160 : 60} look={[1, -1]} seed={1} />
      </BirdPanel>
      <BirdPanel f={f} x={960} s={pop(f, hide)} line="convinces it" lineP={ip(f, [convinces, convinces + 12], [0, 1], (t) => t)} color="#8a6a10">
        <Branch x0={1000} x1={1220} y={360} />
        <Songbird x={1100} y={356} s={0.9} f={f} sing={f > sing2} />
        <Notes x={1150} y={300} f={f} on={f > sing2} />
        <Person x={900} y={800} s={1.2} tribe="hideyoshi" f={f} expr="grin" aR={100} look={[1, -1]} seed={2} />
        <Bubble x={800} y={320} w={250} h={90} text="please?" s={pop(f, convinces + 4)} tail={[870, 430]} size={46} />
      </BirdPanel>
      <BirdPanel f={f} x={1580} s={pop(f, iey)} line="waits..." lineP={ip(f, [waits, waits + 12], [0, 1], (t) => t)} color={C.darkGreen}>
        <Branch x0={1620} x1={1840} y={360} />
        <Songbird x={1720} y={356} s={0.9} f={f} sing={f > sings} />
        <Notes x={1770} y={300} f={f} on={f > sings} />
        <Person x={1500} y={800} s={1.2} tribe="ieyasu" f={f} sit expr={f > sings ? "happy" : "smile"} seed={3} />
        <Hourglass x={1720} y={640} s={0.55} p={ip(f, [waits, sings], [0, 1], (t) => t)} />
      </BirdPanel>
    </SceneSvg>
  );
};

/** "In 1600, Ieyasu faced his biggest enemy at a place called Sekigahara." */
export const Sekigahara: React.FC<SceneProps> = ({ f, from, to }) => {
  const year = w7(220, "sixteen");
  const faced = w7(223, "faced");
  const enemy = w7(226, "enemy");
  const seki = w7(231, "sekigahara");
  const cam = camAt(f, [[from, { x: 1350, y: 790, z: 1.9 }], [to, { x: 1320, y: 790, z: 2.15 }]]);
  const go = ip(f, [faced - 6, seki], [0, 1]);
  const ex = EDO[0] + (SEKI[0] + 16 - EDO[0]) * go;
  const ey = EDO[1] + (SEKI[1] - EDO[1]) * go;
  const wx = OSAKA[0] + (SEKI[0] - 16 - OSAKA[0]) * go;
  const wy = OSAKA[1] + (SEKI[1] + 6 - OSAKA[1]) * go;
  const [sx, sy] = scr(cam, SEKI);
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <MapArt f={f} />
        <Pennant x={ex} y={ey} s={pop(f, faced - 6) * 0.7} color={TOKU} />
        <Pennant x={wx} y={wy} s={pop(f, enemy - 6) * 0.7} color={WEST} />
        <ClashIcon x={SEKI[0]} y={SEKI[1] - 20} s={pop(f, seki) * 0.6} />
      </Camera>
      <Label x={sx} y={sy - 150} text="SEKIGAHARA" size={90} font={FONT_TITLE} color={C.red} p={ip(f, [seki, seki + 12], [0, 1], (t) => t)} rot={-3} />
      <Pop s={pop(f, year, 200, 10)} x={300} y={200} rot={-8}>
        <Pencil d={ellipseD(300, 200, 150, 96)} fill={C.white} sw={5} />
        <Label x={300} y={236} text="1600" size={110} font={FONT_TITLE} color={C.red} halo={false} />
      </Pop>
      <Person x={1680} y={900} s={1.3 * pop(f, faced - 6)} tribe="ieyasu" f={f} flip expr="angry" aR={30} seed={1} />
      <Label x={scr(cam, [wx, wy])[0] - 40} y={scr(cam, [wx, wy])[1] + 90} text="his biggest enemy" size={56} font={FONT_HAND} color={WEST} p={ip(f, [enemy - 10, enemy + 6], [0, 1], (t) => t)} rot={-3} />
    </SceneSvg>
  );
};

/** Two armies facing each other across a field. */
const Armies: React.FC<{ f: number; push?: number; westFlip?: number; westColor?: (i: number) => string }> = ({ f, push = 0, westFlip = 0, westColor }) => (
  <g>
    {[0, 1, 2].map((b) => (
      <Banner key={b} x={140 + b * 220 + push} y={780 - (b % 2) * 20} color={TOKU} s={0.7} crest={false} />
    ))}
    {new Array(36).fill(0).map((_, i) => {
      const r = Math.floor(i / 9);
      const c = i % 9;
      return <Troop key={i} x={120 + c * 80 + (r % 2) * 40 + push} y={800 + r * 40 + Math.abs(Math.sin(f / 3 + i)) * 2} s={1.1 + r * 0.08} color={TOKU} />;
    })}
    {new Array(36).fill(0).map((_, i) => {
      const r = Math.floor(i / 9);
      const c = i % 9;
      const x = 1140 + c * 80 + (r % 2) * 40 + push;
      const col = westColor ? westColor(i) : WEST;
      const turned = westFlip > 0 && col === TOKU;
      return <Troop key={i} x={x} y={800 + r * 40 + Math.abs(Math.sin(f / 3 + i)) * 2} s={1.1 + r * 0.08} color={col} flip={!turned} />;
    })}
    {[0, 1, 2].map((b) => (
      <Banner key={b} x={1260 + b * 240 + push} y={780 - (b % 2) * 20} color={b === 2 && westFlip > 0 ? TOKU : WEST} s={0.7} crest={false} />
    ))}
  </g>
);

/** "The battle began in thick fog, and each side had around 80,000 soldiers." */
export const FogBattle: React.FC<SceneProps> = ({ f, from, to }) => {
  const fog = w7(237, "fog");
  const each = w7(239, "each");
  const eighty = w7(243, "eighty");
  const thick = ip(f, [from, fog], [0.5, 1]) * ip(f, [each + 10, to], [1, 0.45]);
  const n = Math.round(ip(f, [eighty - 2, eighty + 16], [0, 80000], (x) => x) / 1000) * 1000;
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 600, z: 1.0 }], [to, { x: 960, y: 620, z: 1.06 }]])}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#c9cdd2" opacity={0.5} />
        <Pencil d="M-600,880 H2700 V1500 H-600 Z" fill={C.moss} />
        <Armies f={f} />
        <Fog f={f} opacity={thick} y={760} n={12} />
      </Camera>
      <Label x={960} y={170} text="THICK FOG" size={110} font={FONT_TITLE} color="#5d636e" p={ip(f, [fog - 6, fog + 8], [0, 1], (t) => t)} rot={-3} />
      {[0, 1].map((k) => (
        <Pop key={k} s={pop(f, eighty - 2 + k * 3)} x={440 + k * 1040} y={360}>
          <Pencil d={`M${240 + k * 1040},290 h400 v150 h-400 Z`} fill={C.white} sw={5} />
          <Label x={440 + k * 1040} y={378} text={n.toLocaleString("en-US")} size={84} font={FONT_TITLE} color={k ? WEST : TOKU} halo={false} />
          <Label x={440 + k * 1040} y={426} text="soldiers" size={36} font={FONT_HAND} halo={false} />
        </Pop>
      ))}
    </SceneSvg>
  );
};

/** "For hours, nobody was winning." */
export const NobodyWinning: React.FC<SceneProps> = ({ f, from, to }) => {
  const hours = w7(247, "hours");
  const nobody = w7(248, "nobody");
  const push = Math.sin((f - from) / 7) * 90;
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 600, z: 1.0 }], [to, { x: 960, y: 600, z: 1.04 }]])}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#c9cdd2" opacity={0.35} />
        <Pencil d="M-600,880 H2700 V1500 H-600 Z" fill={C.moss} />
        <Armies f={f} push={push} />
        <Fog f={f} opacity={0.3} y={760} n={8} />
        <ClockFace x={960} y={360} r={130 * pop(f, hours - 4)} f={f} speed={0.6} />
      </Camera>
      <Label x={960} y={170} text="for HOURS..." size={86} font={FONT_TITLE} p={ip(f, [hours, hours + 8], [0, 1], (t) => t)} rot={-3} />
      <Label x={960} y={600} text="nobody winning" size={66} font={FONT_HAND} color={C.red} p={ip(f, [nobody, nobody + 12], [0, 1], (t) => t)} />
    </SceneSvg>
  );
};

/** "But Ieyasu had made a secret deal with one of the enemy's commanders." */
export const SecretDeal: React.FC<SceneProps> = ({ f, from, to }) => {
  const secret = w7(256, "secret");
  const deal = w7(257, "deal");
  const commanders = w7(263, "commanders");
  const pass = ip(f, [deal, deal + 16], [0, 1]);
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 580, z: 1.05 }], [to, { x: 960, y: 600, z: 1.14 }]])}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#2b3360" opacity={0.55} />
        <Pencil d="M-600,880 H2700 V1500 H-600 Z" fill="#5a5048" />
        <path d={ellipseD(960, 700, 520, 360)} fill="#f8d48a" opacity={0.3} filter="url(#soft)" />
        <Candle x={960} y={880} lit={1} f={f} />
        <Person x={620} y={940} s={1.4} tribe="ieyasu" f={f} expr="grin" aR={f > deal ? 95 : 30} look={[1, 0]} seed={1} />
        <Person x={1300} y={940} s={1.4} tribe="daimyo" cloth={WEST} f={f} flip expr={f > deal + 10 ? "grin" : "nervous"} aR={f > deal + 10 ? 95 : 20} look={[-1, 0]} seed={4} />
        <g transform={`translate(${780 + pass * 300},${740 - Math.sin(pass * Math.PI) * 60})`} opacity={pop(f, deal)}>
          <Pencil d="M-50,-30 h100 v60 h-100 Z" fill="#f4e7c4" sw={3.5} />
          <Pencil d={ellipseD(28, 18, 11)} fill={TOKU} sw={2.5} />
        </g>
        <Banner x={1500} y={880} color={WEST} s={0.8} crest={false} />
      </Camera>
      <Label x={960} y={170} text="a SECRET deal" size={96} font={FONT_TITLE} color={C.red} p={ip(f, [secret - 2, secret + 10], [0, 1], (t) => t)} rot={-3} />
      <Label x={1300} y={300} text="an enemy commander" size={52} font={FONT_HAND} p={ip(f, [commanders - 8, commanders + 8], [0, 1], (t) => t)} />
      <Bubble x={460} y={360} w={200} h={100} text="shh!" s={pop(f, deal + 20)} tail={[560, 470]} size={56} fill={C.white} />
    </SceneSvg>
  );
};

/** "In the middle of the battle, that commander switched sides." */
export const Switch: React.FC<SceneProps> = ({ f, from, to }) => {
  const middle = w7(266, "middle");
  const switched = w7(272, "switched");
  const flipped = f > switched;
  const westColor = (i: number) => (i % 9 >= 6 && flipped ? TOKU : WEST);
  return (
    <SceneSvg f={f}>
      <Camera
        cam={camAt(f, [[from, { x: 960, y: 620, z: 1.0 }], [switched - 4, { x: 1400, y: 680, z: 1.25 }], [to, { x: 1300, y: 660, z: 1.15 }]])}
        shake={shakeAt(f, ip(f, [switched, switched + 4], [0, 1]) * ip(f, [switched + 4, switched + 18], [1, 0]) * 0.5)}
      >
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#c9cdd2" opacity={0.3} />
        <Pencil d="M-600,880 H2700 V1500 H-600 Z" fill={C.moss} />
        <Armies f={f} westFlip={flipped ? 1 : 0} westColor={westColor} />
        <Bang x={1500} y={700} s={pop(f, switched + 2)} n={3} />
        <DrawOn d="M1820,760 C1740,700 1660,700 1580,760" p={ip(f, [switched + 2, switched + 14], [0, 1])} sw={8} color={TOKU} />
      </Camera>
      <Label x={960} y={170} text="in the middle of the battle..." size={62} font={FONT_HAND} p={ip(f, [middle - 6, middle + 12], [0, 1], (t) => t) * ip(f, [switched - 4, switched], [1, 0])} />
      <Label x={960} y={190} text="SWITCHED SIDES!" size={110} font={FONT_TITLE} color={TOKU} p={ip(f, [switched, switched + 8], [0, 1], (t) => t)} rot={-4} />
    </SceneSvg>
  );
};

/** "By the afternoon, Ieyasu had won, and soon he became the shogun of Japan." */
export const Shogun: React.FC<SceneProps> = ({ f, from, to }) => {
  const afternoon = w7(276, "afternoon");
  const won = w7(279, "won");
  const became = w7(283, "became");
  const shogun = w7(285, "shogun");
  const sunA = ip(f, [from, afternoon + 10], [0, 1]);
  const throne = f > became - 10;
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 560, z: 1.0 }], [to, { x: 960, y: 560, z: 1.06 }]])}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill={throne ? "#f2cf8a" : C.sky} opacity={0.3} />
        <Sun x={600 + sunA * 900} y={300 - Math.sin(sunA * Math.PI) * 140 + sunA * 60} r={60} f={f} color={throne ? C.sun : C.orange} />
        <Pencil d="M-600,880 H2700 V1500 H-600 Z" fill={throne ? "#b89f7a" : C.moss} />
        {throne ? (
          <g>
            <Throne x={960} y={880} s={1.2} />
            <Person x={960} y={800} s={1.35} tribe="ieyasu" f={f} sit expr="happy" hold="fan" aR={100} seed={1} />
            {[0, 1].map((i) => (
              <Person key={i} x={500 + i * 920} y={940} s={1.05} tribe="samurai" cloth={TOKU} f={f} flip={i === 1} lean={24} expr="happy" seed={i + 6} />
            ))}
            <Sparkle x={1180} y={420} s={pop(f, shogun + 6) * (0.8 + 0.2 * Math.sin(f / 4))} />
          </g>
        ) : (
          <g>
            <Banner x={760} y={900} color={TOKU} s={1.0} crest={false} />
            <TokugawaCrest x={806} y={620} r={34} />
            <Person x={960} y={940} s={1.45} tribe="ieyasu" f={f} expr={f > won ? "grin" : "smile"} aR={f > won ? 160 : 40} seed={1} />
          </g>
        )}
      </Camera>
      <Label x={560} y={170} text="by the afternoon" size={56} font={FONT_HAND} p={ip(f, [afternoon - 4, afternoon + 10], [0, 1], (t) => t) * ip(f, [became - 12, became - 6], [1, 0])} />
      <Label x={1300} y={190} text="IEYASU WON!" size={96} font={FONT_TITLE} color={TOKU} p={ip(f, [won, won + 8], [0, 1], (t) => t) * ip(f, [became - 12, became - 6], [1, 0])} rot={-4} />
      <NameCard x={960} y={180} s={pop(f, shogun)} text="SHOGUN OF JAPAN" fill="#cfe0c4" w={700} />
    </SceneSvg>
  );
};

/** "He made sure that only his own family, the Tokugawa, could rule after him." */
export const Family: React.FC<SceneProps> = ({ f, from, to }) => {
  const only = w7(292, "only");
  const family = w7(295, "family");
  const toku = w7(297, "tokugawa");
  const rule = w7(299, "rule");
  const gen = [
    { x: 960, y: 420, s: 0.95, at: from + 2 },
    { x: 620, y: 700, s: 0.8, at: family },
    { x: 1300, y: 700, s: 0.8, at: family + 4 },
    { x: 400, y: 950, s: 0.7, at: rule - 4 },
    { x: 840, y: 950, s: 0.7, at: rule },
    { x: 1080, y: 950, s: 0.7, at: rule + 4 },
    { x: 1520, y: 950, s: 0.7, at: rule + 8 },
  ];
  const links: [number, number][] = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]];
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 520, z: 1.0 }], [to, { x: 960, y: 600, z: 0.92 }]])}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#dfe8d0" opacity={0.45} />
        {links.map(([a, b], i) => (
          <DrawOn key={i} d={`M${gen[a].x},${gen[a].y - 40} C${gen[a].x},${gen[a].y + 60} ${gen[b].x},${gen[b].y - 260} ${gen[b].x},${gen[b].y - 220}`} p={ip(f, [gen[b].at - 6, gen[b].at + 6], [0, 1])} sw={5} color={TOKU} />
        ))}
        {gen.map((g, i) => (
          <Pop key={i} s={pop(f, g.at)} x={g.x} y={g.y}>
            <Person x={g.x} y={g.y} s={g.s} tribe={i === 0 ? "ieyasu" : "daimyo"} cloth={TOKU} f={f} expr="smile" seed={i + 1} />
            <TokugawaCrest x={g.x + 60 * g.s} y={g.y - 240 * g.s} r={20} />
          </Pop>
        ))}
      </Camera>
      <Label x={960} y={130} text="only the TOKUGAWA" size={86} font={FONT_TITLE} color={TOKU} p={ip(f, [only, toku + 10], [0, 1], (t) => t)} rot={-3} />
      <Label x={1560} y={300} text="family rule!" size={56} font={FONT_HAND} p={ip(f, [rule - 4, rule + 10], [0, 1], (t) => t)} rot={-4} />
    </SceneSvg>
  );
};

