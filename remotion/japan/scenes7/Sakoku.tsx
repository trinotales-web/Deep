import React from "react";
import { C, FONT_HAND, FONT_TITLE, ip } from "../theme";
import { Bang, Bubble, Camera, camAt, Cloud, DrawOn, ellipseD, Ink, Label, Pencil, pop, Pop, Question, Shade, shakeAt, Sun } from "../draw";
import { SceneSvg } from "../Stage";
import { MapArt } from "../MapArt";
import { Person } from "../Person";
import { RiceBales } from "../Props2";
import { Castle, Candle, Rain, Stamp } from "../Props3";
import { AnswerCard, Flames, SmokeColumn } from "../Props4";
import { Carrack, GunSmoke } from "../Props5";
import { Troop } from "../Props6";
import { BigDoors, Crate, Cross, Dejima, PeopleGrid, RectStamp, TokugawaCrest, Vignette } from "../Props7";
import { JapanChar } from "../scenes/Together";
import { w7 } from "../part7cues";
import { CalendarCard, NAGASAKI, NameCard, Pennant, SceneProps, Sea, SHIMABARA, TOKU } from "./common";

/** "Now, remember those Portuguese traders? They had also brought Christianity,
 *  and thousands of Japanese had become Christians." */
export const Christians: React.FC<SceneProps> = ({ f, from, to }) => {
  const remember = w7(303, "remember");
  const christianity = w7(311, "christianity");
  const thousands = w7(313, "thousands");
  const christians = w7(318, "christians");
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 760, y: 560, z: 1.1 }], [christianity, { x: 860, y: 560, z: 1.05 }], [to, { x: 1060, y: 560, z: 0.98 }]])}>
        <Shade d="M-800,-400 H3000 V1500 H-800 Z" fill={C.sky} opacity={0.25} />
        <Sun x={1900} y={150} r={56} f={f} />
        <Sea f={f} y={760} />
        <Pencil d="M700,1100 L760,780 Q1200,720 3000,740 L3000,1100 Z" fill={C.straw} />
        <Carrack x={260} y={820} s={0.7} tilt={Math.sin(f / 9) * 2} />
        <Person x={720} y={920} s={1.15} tribe="portuguese" beard skin="#f6d6c0" f={f} expr="grin" aR={f > remember ? 160 : 20} seed={2} />
        <Bubble x={640} y={420} w={360} h={110} text="remember me?" s={pop(f, remember)} tail={[700, 560]} size={46} />
        <Person x={980} y={920} s={1.2 * pop(f, christianity - 6)} tribe="jesuit" skin="#f6d6c0" f={f} hold="cross" aR={140} expr="smile" seed={3} />
        <PeopleGrid x={1560} y={560} cols={12} rows={7} shown={ip(f, [thousands - 4, christians + 10], [0, 1])} gap={42} />
        {new Array(12).fill(0).map((_, i) =>
          f > thousands + i * 3 ? <Cross key={i} x={1330 + (i % 6) * 92} y={480 + Math.floor(i / 6) * 260} s={0.4} /> : null,
        )}
      </Camera>
      <Label x={960} y={170} text="CHRISTIANITY" size={96} font={FONT_TITLE} color={C.bronze} p={ip(f, [christianity - 2, christianity + 12], [0, 1], (t) => t)} rot={-3} />
      <Label x={1460} y={280} text="thousands of Japanese Christians" size={52} font={FONT_HAND} p={ip(f, [thousands, christians + 10], [0, 1], (t) => t)} />
    </SceneSvg>
  );
};

/** "The Tokugawa feared these Christians would obey the Pope instead of the shogun." */
export const Pope: React.FC<SceneProps> = ({ f, from, to }) => {
  const feared = w7(321, "feared");
  const obey = w7(325, "obey");
  const pope = w7(327, "pope");
  const shogun = w7(331, "shogun");
  const look: [number, number] = f > pope ? [1, -0.3] : [-1, -0.3];
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 560, z: 1.0 }], [to, { x: 960, y: 560, z: 1.05 }]])}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#e9d7b0" opacity={0.4} />
        <Pencil d="M-600,880 H2700 V1500 H-600 Z" fill="#b89f7a" />
        <Person x={420} y={930} s={1.45} tribe="ieyasu" f={f} expr={f > feared ? "nervous" : "neutral"} look={[1, 0]} seed={1} />
        <TokugawaCrest x={420} y={420} r={50 * pop(f, from + 4)} />
        <Person x={960} y={930} s={1.2} tribe="yayoi" f={f} hold="cross" aR={110} expr="smile" look={look} seed={4} />
        <g opacity={pop(f, pope - 2)}>
          <path d={ellipseD(1500, 640, 220, 300)} fill="#fbe7a8" opacity={0.5} filter="url(#soft)" />
          <Person x={1500} y={930} s={1.45} tribe="pope" skin="#f6d6c0" f={f} flip expr="smile" aR={150} seed={5} />
        </g>
        <DrawOn d="M1040,640 C1180,560 1300,560 1400,620" p={ip(f, [obey, pope + 6], [0, 1])} sw={6} dotted color={C.red} />
      </Camera>
      <Label x={420} y={250} text="the shogun" size={58} font={FONT_HAND} p={ip(f, [shogun - 4, shogun + 8], [0, 1], (t) => t)} />
      <Label x={1500} y={250} text="the Pope" size={70} font={FONT_TITLE} color="#8a6a10" p={ip(f, [pope - 2, pope + 8], [0, 1], (t) => t)} />
      <Label x={960} y={150} text="obey whom?" size={84} font={FONT_TITLE} color={C.red} p={ip(f, [obey - 4, obey + 10], [0, 1], (t) => t)} rot={-3} />
    </SceneSvg>
  );
};

/** "So Christianity was banned, and foreign priests were thrown out." */
export const Banned: React.FC<SceneProps> = ({ f, from, to }) => {
  const banned = w7(335, "banned");
  const priests = w7(338, "priests");
  const thrown = w7(340, "thrown");
  const sail = ip(f, [thrown + 6, to + 8], [0, 1], (x) => x * x);
  const walk = ip(f, [priests - 4, thrown + 6], [0, 1]);
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 560, z: 1.0 }], [to, { x: 900, y: 560, z: 1.02 }]])}>
        <Shade d="M-800,-400 H3000 V1500 H-800 Z" fill={C.sky} opacity={0.25} />
        <Sea f={f} y={760} />
        <Pencil d="M900,1100 L940,760 Q1500,720 3000,740 L3000,1100 Z" fill={C.straw} />
        <Carrack x={420 - sail * 900} y={820} s={0.7} tilt={Math.sin(f / 9) * 2} />
        {[0, 1].map((i) => (
          <Person key={i} x={1300 - walk * (560 + i * 40) + i * 140} y={900 + i * 12} s={1.1} tribe="jesuit" skin="#f6d6c0" f={f} flip walk={walk > 0 && walk < 1 ? f * 0.5 + i : undefined} hold="cross" aR={30} expr="worry" seed={i + 3} />
        ))}
        <Person x={1640} y={920} s={1.3} tribe="samurai" cloth={TOKU} f={f} flip expr="angry" aR={f > thrown ? 120 : 20} seed={2} />
        {/* a sign with a cross, stamped */}
        <g transform="translate(1300,460)">
          <Pencil d="M-8,0 h16 v400 h-16 Z" fill={C.darkBrown} sw={3} />
          <Pencil d="M-160,-140 h320 v200 h-320 Z" fill="#f4e7c4" sw={5} />
          <Cross x={0} y={-40} s={1.1} />
        </g>
        <RectStamp x={1300} y={420} s={pop(f, banned, 220, 12)} text="BANNED" w={520} />
      </Camera>
      <Label x={600} y={180} text="priests out!" size={84} font={FONT_TITLE} color={C.red} p={ip(f, [thrown - 2, thrown + 10], [0, 1], (t) => t)} rot={-4} />
    </SceneSvg>
  );
};

/** "In a place called Shimabara, Christian farmers suffered from huge taxes and cruel punishments." */
export const Shimabara: React.FC<SceneProps> = ({ f, from, to }) => {
  const shima = w7(346, "shimabara");
  const farmers = w7(348, "farmers");
  const taxes = w7(352, "taxes");
  const cruel = w7(354, "cruel");
  const heavy = ip(f, [farmers, taxes + 10], [0, 1]);
  const dark = ip(f, [cruel - 6, cruel + 14], [0, 1]);
  const mapCam = { x: SHIMABARA[0] + 10, y: SHIMABARA[1] - 20, z: 2.6 };
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 1000, y: 560, z: 1.0 }], [to, { x: 1000, y: 580, z: 1.06 }]])}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill={C.sky} opacity={0.2 * (1 - dark)} />
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#4a4a5a" opacity={0.45 * dark} />
        {dark > 0 ? [0, 1, 2].map((k) => <Cloud key={k} x={700 + k * 420} y={140 + (k % 2) * 40} w={340} h={110} seed={k + 3} fill="#7d7f8a" opacity={dark} />) : null}
        {dark > 0.3 ? <Rain f={f} n={50} /> : null}
        <Pencil d="M-600,880 H2700 V1500 H-600 Z" fill="#a89a7a" />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`rotate(${heavy * 14},${900 + i * 260},930)`}>
            <Person x={900 + i * 260} y={930} s={1.1} tribe="yayoi" f={f} hold="cross" aR={30} expr={f > cruel ? "tired" : "worry"} seed={i + 4} />
            <RiceBales x={837 + i * 260} y={688} n={Math.round(1 + heavy * 3)} s={0.7} />
          </g>
        ))}
        <Person x={1720} y={930} s={1.3} tribe="daimyo" f={f} flip expr="angry" hold="letter" aR={f > taxes ? 110 : 30} seed={6} />
        <Label x={1720} y={520} text="TAX!" size={84} font={FONT_TITLE} color={C.red} p={ip(f, [taxes - 4, taxes + 6], [0, 1], (t) => t)} rot={8} />
      </Camera>
      {/* where Shimabara is */}
      <Pop s={pop(f, shima - 4)} x={290} y={330}>
        <Pencil d="M60,110 h460 v440 h-460 Z" fill={C.white} sw={5} />
        <svg x={66} y={116} width={448} height={428} viewBox={`${mapCam.x - 448 / 2 / mapCam.z} ${mapCam.y - 428 / 2 / mapCam.z} ${448 / mapCam.z} ${428 / mapCam.z}`}>
          <MapArt f={f} />
          <Pennant x={SHIMABARA[0]} y={SHIMABARA[1]} s={0.5} color={C.red} h={40} />
        </svg>
        <Label x={290} y={530} text="Shimabara" size={48} font={FONT_TITLE} color={C.red} />
      </Pop>
      <Label x={1100} y={180} text="huge taxes, cruel punishments" size={62} font={FONT_HAND} p={ip(f, [taxes - 6, cruel + 20], [0, 1], (t) => t)} rot={-3} />
    </SceneSvg>
  );
};

/** "Finally, they fought back, led by a 16-year-old boy named Amakusa Shiro." */
export const Shiro: React.FC<SceneProps> = ({ f, from, to }) => {
  const fought = w7(358, "fought");
  const sixteen = w7(363, "sixteen");
  const shiro = w7(369, "shiro");
  const rise = f > fought;
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 580, z: 1.0 }], [to, { x: 900, y: 600, z: 1.1 }]])}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#f2cf8a" opacity={0.3} />
        <Sun x={1700} y={150} r={60} f={f} color={C.orange} />
        <Pencil d="M-600,880 H2700 V1500 H-600 Z" fill="#a89a7a" />
        {[0, 1, 2, 3].map((i) => (
          <Person
            key={i}
            x={1060 + i * 190}
            y={930 + (i % 2) * 14}
            s={1.05}
            tribe="yayoi"
            f={f}
            hold={i % 2 ? "sickle" : "spear"}
            aR={i % 2 ? (rise ? 150 : 30) : rise ? 45 : 15}
            expr={rise ? "angry" : "worry"}
            seed={i + 4}
          />
        ))}
        <Person x={640} y={940} s={1.3 * pop(f, sixteen - 10)} tribe="shiro" f={f} hold="crossBanner" aR={rise ? 40 : 20} expr="angry" seed={2} />
      </Camera>
      <Label x={1300} y={200} text="they fought back!" size={86} font={FONT_TITLE} color={C.red} p={ip(f, [fought - 2, fought + 10], [0, 1], (t) => t) * ip(f, [shiro - 12, shiro - 6], [1, 0])} rot={-4} />
      <Pop s={pop(f, sixteen + 4)} x={300} y={330}>
        <Pencil d={ellipseD(300, 330, 110, 80)} fill={C.white} sw={5} />
        <Label x={300} y={322} text="age" size={40} font={FONT_HAND} halo={false} />
        <Label x={300} y={384} text="16" size={80} font={FONT_TITLE} color={C.red} halo={false} />
      </Pop>
      <NameCard x={760} y={190} s={pop(f, shiro - 6)} text="AMAKUSA SHIRO" fill="#f4e7c4" w={620} />
    </SceneSvg>
  );
};

/** "The shogun sent more than one lakh soldiers, and he even asked Dutch ships for help." */
export const Siege: React.FC<SceneProps> = ({ f, from, to }) => {
  const sent = w7(372, "sent");
  const lakh = w7(376, "lakh");
  const dutch = w7(382, "dutch");
  const help = w7(385, "help");
  const ship = ip(f, [dutch - 20, help], [0, 1]);
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 1100, y: 560, z: 0.92 }], [to, { x: 900, y: 560, z: 0.98 }]])}>
        <Shade d="M-800,-400 H3000 V1500 H-800 Z" fill={C.sky} opacity={0.25} />
        <Sea f={f} y={820} />
        <Pencil d="M500,1100 L520,640 Q900,560 1200,640 L1260,880 Q2000,840 3000,860 L3000,1100 Z" fill={C.moss} />
        <Castle x={860} y={640} s={0.85} />
        {[0, 1].map((i) => (
          <g key={i} transform={`translate(${740 + i * 260},420)`}>
            <Ink d="M0,0 L0,-120" sw={5} />
            <Pencil d="M0,-120 h70 v50 h-70 Z" fill={C.white} sw={3} />
            <Ink d="M35,-112 v34 M24,-98 h22" sw={5} color={C.red} />
          </g>
        ))}
        {new Array(48).fill(0).map((_, i) => {
          const r = Math.floor(i / 12);
          const c = i % 12;
          return <Troop key={i} x={1320 + c * 85 + (r % 2) * 42} y={860 + r * 40} s={1.15 * pop(f, sent - 6 + (c % 12))} color={TOKU} flip />;
        })}
        <Carrack x={-500 + ship * 820} y={900} s={0.75} dutch tilt={Math.sin(f / 9) * 2} />
        {[0, 1, 2].map((i) => (
          <GunSmoke key={i} x={480 + i * 40} y={760} p={ip(f, [help + 4 + i * 8, help + 28 + i * 8], [0, 1], (t) => t)} />
        ))}
        <Bang x={760} y={520} s={pop(f, help + 10) * ip(f, [to - 4, to], [1, 0])} n={2} />
      </Camera>
      <Pop s={pop(f, lakh - 2, 190, 10)} x={1500} y={200} rot={-3}>
        <Pencil d="M1180,110 h640 v170 h-640 Z" fill={C.white} sw={6} />
        <Label x={1500} y={210} text="1,00,000+" size={100} font={FONT_TITLE} color={TOKU} halo={false} />
        <Label x={1500} y={262} text="soldiers (one lakh!)" size={38} font={FONT_HAND} halo={false} />
      </Pop>
      <Label x={420} y={190} text="Dutch ships" size={74} font={FONT_TITLE} color="#2f4f9f" p={ip(f, [dutch - 2, dutch + 10], [0, 1], (t) => t)} rot={-4} />
    </SceneSvg>
  );
};

/** "After three months, their castle fell." */
export const Fell: React.FC<SceneProps> = ({ f, from, to }) => {
  const three = w7(387, "three");
  const fell = w7(391, "fell");
  const down = ip(f, [fell - 2, fell + 14], [0, 1], (x) => x * x);
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 900, y: 560, z: 1.0 }], [to, { x: 900, y: 580, z: 1.06 }]])} shake={shakeAt(f, ip(f, [fell, fell + 4], [0, 1]) * ip(f, [fell + 4, fell + 20], [1, 0]) * 0.6)}>
        <Shade d="M-800,-400 H3000 V1500 H-800 Z" fill="#c9b0a0" opacity={0.35} />
        <Sea f={f} y={820} />
        <Pencil d="M300,1100 L320,640 Q700,560 1000,640 L1060,880 Q1800,840 3000,860 L3000,1100 Z" fill={C.moss} />
        <g transform={`translate(0,${down * 160}) rotate(${down * 8},660,640)`}>
          <Castle x={660} y={640} s={0.85} />
        </g>
        <SmokeColumn x={600} y={380} f={f} seed={1} opacity={down} />
        <SmokeColumn x={760} y={400} f={f} seed={2} opacity={down} />
        <Flames x={660} y={640} s={0.8 * down} f={f} seed={3} />
      </Camera>
      <CalendarCard x={1500} y={420} s={pop(f, three)} big="3" small="months" />
      <Label x={1500} y={160} text="the castle fell" size={80} font={FONT_TITLE} color={C.red} p={ip(f, [fell - 2, fell + 10], [0, 1], (t) => t)} rot={-3} />
    </SceneSvg>
  );
};

/** "There were about 37,000 people inside. Guess how many were killed? Almost every single one." */
export const Inside: React.FC<SceneProps> = ({ f, from, to }) => {
  const thirty = w7(395, "thirty");
  const guess = w7(400, "guess");
  const killed = w7(404, "killed");
  const almost = w7(405, "almost");
  const gone = ip(f, [almost, to - 10], [0, 0.96]);
  const quiz = ip(f, [guess - 4, guess + 4], [0, 1]) * ip(f, [almost - 4, almost + 4], [1, 0]);
  return (
    <SceneSvg f={f}>
      <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#d9cfc0" opacity={0.45} />
      <Camera cam={camAt(f, [[from, { x: 960, y: 540, z: 1.0 }], [to, { x: 960, y: 560, z: 1.06 }]])}>
        <PeopleGrid x={960} y={330} cols={28} rows={11} shown={ip(f, [from + 2, thirty + 20], [0, 1])} gone={gone} gap={44} />
        {[0, 1, 2].map((i) => (
          <AnswerCard key={i} x={520 + i * 440} y={560} s={quiz * pop(f, guess + i * 4)} text={["100?", "1,000?", "10,000?"][i]} font={FONT_TITLE} crossed={0} />
        ))}
        <Candle x={960} y={880} lit={ip(f, [almost + 10, almost + 20], [0, 1])} f={f} />
      </Camera>
      <Vignette opacity={0.5 * gone} />
      <Pop s={pop(f, thirty - 2)} x={960} y={150} rot={-2}>
        <Pencil d="M600,70 h720 v150 h-720 Z" fill={C.white} sw={5} />
        <Label x={960} y={170} text="37,000 people" size={90} font={FONT_TITLE} halo={false} />
      </Pop>
      <Label x={960} y={810} text="almost every single one" size={70} font={FONT_TITLE} color={C.red} p={ip(f, [almost, almost + 20], [0, 1], (t) => t)} />
      <Question x={1600} y={300} s={pop(f, guess) * ip(f, [killed + 10, killed + 16], [1, 0])} size={140} rot={10} />
    </SceneSvg>
  );
};

/** "After this, Japan shut its doors to the world. This was called sakoku." */
export const Sakoku: React.FC<SceneProps> = ({ f, from, to }) => {
  const shut = w7(412, "shut");
  const world = w7(417, "world");
  const sakoku = w7(421, "sakoku");
  const close = ip(f, [shut - 4, world + 4], [0, 1], (x) => x * x);
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 560, z: 1.0 }], [to, { x: 960, y: 560, z: 1.03 }]])}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill={C.sky} opacity={0.5} />
        <JapanChar f={f} x={960} y={560} s={0.55} expr={close > 0.5 ? "shock" : "smile"} armR={60} armL={60} />
        {[0, 1, 2].map((i) => (
          <Carrack key={i} x={300 + i * 680 - close * 120 * (i - 1)} y={980} s={0.35} dutch={i === 1} tilt={Math.sin(f / 9 + i) * 2} />
        ))}
      </Camera>
      <BigDoors p={close} />
      <Pop s={pop(f, sakoku - 2, 190, 10)} x={960} y={420} rot={-3}>
        <Pencil d="M560,300 h800 v260 h-800 Z" fill="#f4e7c4" sw={6} />
        <Label x={960} y={430} text="SAKOKU" size={130} font={FONT_TITLE} color={C.red} halo={false} />
        <Label x={960} y={520} text="(the closed country)" size={50} font={FONT_HAND} halo={false} />
      </Pop>
    </SceneSvg>
  );
};

/** "Almost every foreigner was thrown out, except the Dutch, because they only cared about trade." */
export const ExceptDutch: React.FC<SceneProps> = ({ f, from, to }) => {
  const foreigner = w7(424, "foreigner");
  const thrown = w7(426, "thrown");
  const except = w7(428, "except");
  const dutch = w7(430, "dutch");
  const trade = w7(436, "trade");
  const away = ip(f, [thrown, except + 10], [0, 1], (x) => x * x);
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 560, z: 1.0 }], [except, { x: 960, y: 560, z: 1.0 }], [trade, { x: 1160, y: 600, z: 1.15 }], [to, { x: 1180, y: 600, z: 1.16 }]])}>
        <Shade d="M-800,-400 H3000 V1500 H-800 Z" fill={C.sky} opacity={0.25} />
        <Sea f={f} y={760} />
        <Pencil d="M700,1100 L760,780 Q1200,720 3000,740 L3000,1100 Z" fill={C.straw} />
        <Carrack x={420 - away * 900} y={820} s={0.6} tilt={Math.sin(f / 9) * 2} />
        {[0, 1, 2].map((i) => (
          <Person
            key={i}
            x={900 + i * 150 - away * 1200}
            y={920 + (i % 2) * 12}
            s={1.0}
            tribe={i === 1 ? "jesuit" : "portuguese"}
            skin="#f6d6c0"
            beard={i !== 1}
            f={f}
            flip
            walk={away > 0 && away < 1 ? f * 0.6 + i : undefined}
            expr="worry"
            seed={i + 3}
          />
        ))}
        <Person x={1420} y={930} s={1.25 * pop(f, dutch - 6)} tribe="dutch" skin="#f6d6c0" f={f} hold="coins" aR={f > trade ? 150 : 60} expr="grin" seed={5} />
        {[0, 1, 2].map((i) => (
          <Crate key={i} x={1640 + i * 110} y={900 - (i === 1 ? 0 : 0)} s={pop(f, trade - 6 + i * 4)} />
        ))}
        <Person x={1980} y={930} s={1.2} tribe="samurai" cloth={TOKU} f={f} flip expr={f > trade ? "smile" : "angry"} aR={f > foreigner ? 150 : 20} seed={2} />
      </Camera>
      <Label x={560} y={180} text="foreigners OUT!" size={84} font={FONT_TITLE} color={C.red} p={ip(f, [foreigner - 2, foreigner + 10], [0, 1], (t) => t) * ip(f, [except - 4, except + 2], [1, 0])} rot={-4} />
      <Label x={1200} y={180} text="...except the Dutch" size={80} font={FONT_TITLE} color="#2f4f9f" p={ip(f, [except, dutch + 10], [0, 1], (t) => t)} rot={-3} />
      <Label x={1300} y={280} text="(only here for TRADE)" size={54} font={FONT_HAND} p={ip(f, [trade - 8, trade + 8], [0, 1], (t) => t)} />
    </SceneSvg>
  );
};

/** "But the Dutch, too, had to stay on a tiny man-made island near Nagasaki, called Dejima." */
export const DejimaScene: React.FC<SceneProps> = ({ f, from, to }) => {
  const tiny = w7(446, "tiny");
  const island = w7(449, "island");
  const nagasaki = w7(451, "nagasaki");
  const dejima = w7(453, "dejima");
  const mapCam = { x: NAGASAKI[0] - 10, y: NAGASAKI[1] - 30, z: 2.4 };
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 560, z: 1.0 }], [to, { x: 960, y: 580, z: 1.08 }]])}>
        <Shade d="M-800,-400 H3000 V1500 H-800 Z" fill={C.sky} opacity={0.3} />
        <Sea f={f} y={520} />
        <Pencil d="M-800,1100 L-800,820 Q200,760 1000,880 Q1600,960 3000,900 L3000,1100 Z" fill={C.green} />
        {[0, 1, 2, 3].map((i) => (
          <Pencil key={i} d={`M${-300 + i * 300},${860 - (i % 2) * 20} l60,-90 l60,90 Z`} fill={C.darkGreen} sw={3} />
        ))}
        <Dejima x={960} y={560} s={1.0} f={f} />
        <Person x={1120} y={600} s={0.6} tribe="dutch" skin="#f6d6c0" f={f} expr="smile" seed={5} />
      </Camera>
      <Label x={400} y={200} text="tiny!" size={80} font={FONT_TITLE} color={C.red} p={ip(f, [tiny - 2, tiny + 6], [0, 1], (t) => t)} rot={-6} />
      <Label x={420} y={290} text="and man-made" size={56} font={FONT_HAND} p={ip(f, [tiny + 10, island + 6], [0, 1], (t) => t)} rot={-4} />
      <Pop s={pop(f, nagasaki - 4)} x={1600} y={260}>
        <Pencil d="M1400,90 h400 v340 h-400 Z" fill={C.white} sw={5} />
        <svg x={1406} y={96} width={388} height={328} viewBox={`${mapCam.x - 388 / 2 / mapCam.z} ${mapCam.y - 328 / 2 / mapCam.z} ${388 / mapCam.z} ${328 / mapCam.z}`}>
          <MapArt f={f} />
          <Pennant x={NAGASAKI[0]} y={NAGASAKI[1]} s={0.5} color="#2f4f9f" h={40} />
        </svg>
        <Label x={1600} y={410} text="Nagasaki" size={44} font={FONT_TITLE} color="#2f4f9f" />
      </Pop>
      <Pop s={pop(f, dejima, 190, 10)} x={960} y={150} rot={-3}>
        <Pencil d="M680,70 h560 v150 h-560 Z" fill="#f4e7c4" sw={6} />
        <Label x={960} y={176} text="DEJIMA" size={110} font={FONT_TITLE} color="#2f4f9f" halo={false} />
      </Pop>
    </SceneSvg>
  );
};

/** "They were not allowed to step onto Japanese land at all." + a quiet ending */
export const NoStep: React.FC<SceneProps> = ({ f, from, to }) => {
  const not = w7(456, "not");
  const step = w7(459, "step");
  const land = w7(462, "land");
  const all = w7(464, "all");
  const tiptoe = ip(f, [from, step], [0, 1]);
  const back = ip(f, [all + 10, all + 40], [0, 1]);
  const fade = ip(f, [to - 30, to - 4], [1, 0]);
  const dx = 760 + tiptoe * 320 - back * 360;
  return (
    <SceneSvg f={f}>
      <g opacity={fade}>
        <Camera cam={camAt(f, [[from, { x: 960, y: 560, z: 1.0 }], [all + 10, { x: 960, y: 560, z: 1.0 }], [to, { x: 960, y: 520, z: 0.92 }]])}>
          <Shade d="M-800,-400 H3000 V1500 H-800 Z" fill="#f2cf8a" opacity={0.35 * ip(f, [all, to], [0, 1])} />
          <Shade d="M-800,-400 H3000 V1500 H-800 Z" fill={C.sky} opacity={0.3} />
          <Sea f={f} y={760} />
          {/* Dejima on the left, the bridge, Japan on the right */}
          <Pencil d="M-800,1100 L-800,800 L560,800 L600,1100 Z" fill="#c9b48a" />
          <Pencil d="M560,830 h760 v30 h-760 Z" fill={C.brown} sw={4} />
          {[620, 740, 860, 980, 1100, 1220].map((px) => (
            <Pencil key={px} d={`M${px},860 h14 v120 h-14 Z`} fill={C.darkBrown} sw={3} />
          ))}
          <Pencil d="M1320,1100 L1340,800 L3000,800 L3000,1100 Z" fill={C.green} />
          <Pencil d="M1340,800 h40 v-200 h-40 Z M1540,800 h40 v-200 h-40 Z M1320,620 h280 v-30 h-280 Z" fill={C.darkBrown} sw={3.5} />
          <Person x={dx} y={840} s={1.15} tribe="dutch" skin="#f6d6c0" f={f} walk={tiptoe > 0 && tiptoe < 1 ? f * 0.25 : back > 0 && back < 1 ? f * 0.4 : undefined} flip={back > 0} expr={f > not ? "nervous" : "grin"} seed={5} />
          <Person x={1480} y={840} s={1.25} tribe="samurai" cloth={TOKU} f={f} flip expr={f > not ? "angry" : "neutral"} aR={f > not ? 160 : 20} aL={f > land ? 160 : 10} seed={2} />
          <Stamp x={1170} y={330} s={pop(f, not, 220, 12) * ip(f, [all + 20, all + 30], [1, 0])} text="NO!" font={FONT_TITLE} />
          <Label x={1700} y={560} text="Japan" size={60} font={FONT_TITLE} color={C.darkGreen} />
          <Label x={240} y={560} text="Dejima" size={60} font={FONT_TITLE} color="#2f4f9f" />
        </Camera>
        <Label x={960} y={170} text="not one step onto Japanese land!" size={66} font={FONT_TITLE} color={C.red} p={ip(f, [step, all + 6], [0, 1], (t) => t)} rot={-3} />
      </g>
    </SceneSvg>
  );
};

