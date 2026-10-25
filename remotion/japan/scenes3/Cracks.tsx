import React from "react";
import { C, FONT_HAND, FONT_TITLE, INK, ip } from "../theme";
import {
  Bang,
  blobD,
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
  shakeAt,
  Sparkle,
  Sun,
} from "../draw";
import { SceneSvg } from "../Stage";
import { Person } from "../Person";
import { RoundTree } from "../Props";
import { Throne } from "../Props2";
import { Cradle, InkPainting, Onion, SilverPavilion, TeaSet } from "../Props3";
import { JapanChar } from "../scenes/Together";
import { w3 } from "../part3cues";

const YOSHIMASA = "#b39ad1";
const BROTHER = "#7fb1d8";
const WIFE = "#e8a3b5";

const Room: React.FC<{ tint?: string }> = ({ tint = C.tan }) => (
  <g>
    <Shade d="M-800,-600 H3200 V1500 H-800 Z" fill={tint} opacity={0.4} />
    <Pencil d="M-800,860 H3200 V1600 H-800 Z" fill={C.straw} />
    {[0, 1, 2, 3].map((i) => (
      <Ink key={i} d={`M-800,${920 + i * 60} H3200`} sw={2.5} opacity={0.45} />
    ))}
  </g>
);

/** "But this win created a new problem. Samurai were usually rewarded with land taken from the enemy." */
export const Reward: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const win = w3(241, "win");
  const problem = w3(245, "problem");
  const rewarded = w3(249, "rewarded");
  const land = w3(251, "land");
  const enemy = w3(255, "enemy");
  const panel = pop(f, rewarded - 10, 150, 12);
  const move = ip(f, [land, enemy + 10], [0, 1]);
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 540, z: 1.0 }], [to, { x: 980, y: 540, z: 1.04 }]])}>
        <Room />
        <Person x={420} y={930} s={1.3} tribe="shogun" f={f} expr={f > problem - 4 ? "worry" : "grin"} aL={f < problem ? 150 : 20} aR={f < problem ? 150 : 40} hold="fan" seed={5} />
        {f > win - 4 && f < problem + 10
          ? new Array(14).fill(0).map((_, i) => {
              const t = (f - win + i * 3) / 40;
              return (
                <Pencil
                  key={i}
                  d={`M${200 + i * 36 + Math.sin(t * 6 + i) * 20},${200 + t * 500} l12,4 l-4,12 l-12,-4 Z`}
                  fill={[C.red, C.yellow, C.sky, C.green][i % 4]}
                  sw={1.5}
                />
              );
            })
          : null}
        <Label x={420} y={300} text="we won!" size={70} font={FONT_HAND} p={ip(f, [win, win + 10], [0, 1], (x) => x) * ip(f, [problem - 4, problem + 2], [1, 0])} />
        <Question x={420} y={340} s={pop(f, problem)} size={140} />
        <Label x={420} y={210} text="uh-oh..." size={66} font={FONT_HAND} p={ip(f, [problem + 2, problem + 12], [0, 1], (x) => x)} />
        {/* the usual deal, as a little picture on the wall */}
        <Pop s={panel} x={1340} y={520}>
          <Pencil d="M880,170 L1800,170 L1800,880 L880,880 Z" fill="#efe1c0" sw={5} />
          <Label x={1340} y={250} text="the usual deal:" size={58} font={FONT_HAND} halo={false} />
          <Person x={1660} y={800} s={0.8} tribe="samurai" f={f} cloth={C.red} flip expr="worry" seed={8} />
          <Pencil d="M1690,560 L1690,420 M1690,420 l60,14 l-60,16" fill={C.red} sw={4} />
          <Person x={1020} y={800} s={0.8} tribe="samurai" f={f} expr={move > 0.8 ? "grin" : "smile"} aR={move > 0.8 ? 70 : 20} seed={2} />
          <g transform={`translate(${1560 - move * 440},${640 - Math.sin(move * Math.PI) * 160})`}>
            <Pencil d={blobD(0, 0, 70, 44, 7, 6, 0.18)} fill={C.green} sw={3.5} />
            <RoundTree x={10} y={10} s={0.3} seed={3} />
          </g>
          <Label x={1340} y={850} text="land from the enemy" size={44} font={FONT_HAND} halo={false} p={ip(f, [land, enemy + 6], [0, 1], (x) => x)} />
        </Pop>
      </Camera>
    </SceneSvg>
  );
};

/** "This war was fought only to defend Japan, so there was no land to give." */
export const NoLand: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const defend = w3(262, "defend");
  const no = w3(267, "no");
  const give = w3(270, "give");
  const lid = ip(f, [no - 6, no + 4], [0, 1]);
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 540, z: 1.0 }], [no - 8, { x: 960, y: 540, z: 1.0 }], [to, { x: 1150, y: 600, z: 1.1 }]])}>
        <Shade d="M-600,-400 H900 V1500 H-600 Z" fill={C.sky} opacity={0.3} />
        <Pencil d="M-600,760 Q300,740 900,760 L900,1500 L-600,1500 Z" fill={C.sea} />
        <JapanChar f={f} x={420} y={420} s={0.45} expr="grin" armL={70} armR={70} />
        <DrawOn d="M420,110 a300,320 0 1,0 1,0" p={ip(f, [defend - 6, defend + 16], [0, 1])} sw={8} color={C.indigo} />
        <Label x={420} y={90} text="just defending" size={54} font={FONT_HAND} p={ip(f, [defend, defend + 14], [0, 1], (x) => x)} />
        <Ink d="M900,-200 L900,1300" sw={5} />
        <Room />
        <Pencil d="M1080,860 L1380,860 L1380,700 L1080,700 Z" fill={C.brown} />
        <g transform={`rotate(${-lid * 70},1080,700)`}>
          <Pencil d="M1070,700 L1390,700 L1390,640 Q1230,600 1070,640 Z" fill={C.darkBrown} />
        </g>
        <Ink d="M1080,780 L1380,780" sw={3} color={C.bronze} />
        <Puff x={1230} y={660} p={ip(f, [no, no + 26], [0, 1], (x) => x)} size={60} fill={C.gray} seed={2} />
        <Label x={1230} y={560} text="no land!" size={80} font={FONT_TITLE} color={C.red} p={ip(f, [give - 6, give + 6], [0, 1], (x) => x)} rot={-4} />
        <Person x={1530} y={930} s={1.05} tribe="shogun" f={f} flip expr={f > no ? "worry" : "neutral"} aL={f > no ? 70 : 20} aR={f > no ? 70 : 20} seed={5} />
        {[1700, 1820].map((x, i) => (
          <Person key={i} x={x} y={940} s={0.85} tribe="samurai" f={f} flip aR={60} expr={f > give ? "worry" : "smile"} seed={i + 2} />
        ))}
      </Camera>
    </SceneSvg>
  );
};

const MiniPyramid: React.FC<{ x: number; y: number; s: number; crack: number; f: number; wobble: number }> = ({ x, y, s, crack, f, wobble }) => (
  <g transform={`translate(${x},${y}) scale(${s}) rotate(${Math.sin(f / 3) * 2 * wobble})`}>
    <Pencil d="M-110,-360 L110,-360 L160,-220 L-160,-220 Z" fill={C.red} fillOpacity={0.55} sw={4.5} />
    <Pencil d="M-160,-220 L160,-220 L230,-80 L-230,-80 Z" fill="#7f99c4" fillOpacity={0.55} sw={4.5} />
    <Pencil d="M-230,-80 L230,-80 L300,60 L-300,60 Z" fill={C.lightIndigo} fillOpacity={0.55} sw={4.5} />
    <Person x={0} y={-230} s={0.55} tribe="shogun" f={f} expr={crack > 0.3 ? "shock" : "neutral"} seed={5} />
    <DrawOn d="M-20,-360 l20,40 l-26,30 l24,40 l-16,30 l30,44 l-24,40 l20,46 l-14,50 l24,40 l-20,40" p={crack} sw={7} />
    <DrawOn d="M60,-220 l-30,36 l24,30 l-20,40" p={crack} sw={5} />
  </g>
);

/** "The samurai felt they had fought for nothing, and the shogun's power began to crack." */
export const Crack: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const felt = w3(273, "felt");
  const nothing = w3(278, "nothing");
  const power = w3(282, "power");
  const crack = w3(285, "crack");
  const c = ip(f, [crack - 6, crack + 10], [0, 1]);
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 540, z: 1.0 }], [power - 6, { x: 980, y: 540, z: 1.0 }], [to, { x: 1300, y: 560, z: 1.12 }]])} shake={shakeAt(f, ip(f, [crack, crack + 3], [0, 1]) * ip(f, [crack + 3, crack + 18], [1, 0]) * 0.6)}>
        <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#c9c3b5" opacity={0.35} />
        <Pencil d="M-600,880 H2700 V1500 H-600 Z" fill={C.moss} />
        <Pop s={pop(f, felt)} x={420} y={250}>
          <Cloud x={420} y={250} w={460} h={140} seed={6} fill={C.gray} />
        </Pop>
        {f > felt ? <g opacity={0.7}>{new Array(12).fill(0).map((_, i) => <Ink key={i} d={`M${230 + i * 34},${320 + ((f * 6 + i * 40) % 160)} l-4,24`} sw={2.5} color={C.sky} />)}</g> : null}
        {[260, 420, 580].map((x, i) => (
          <Person key={i} x={x} y={940} s={1.0} tribe="samurai" f={f} expr={f > felt ? "angry" : "neutral"} aL={40} aR={40} seed={i + 2} />
        ))}
        <Label x={420} y={480} text="for nothing?!" size={74} font={FONT_HAND} p={ip(f, [nothing - 6, nothing + 8], [0, 1], (x) => x)} rot={-4} />
        <MiniPyramid x={1350} y={830} s={1.15} crack={c} f={f} wobble={c} />
        <Label x={1350} y={300} text="the shogun's power..." size={56} font={FONT_HAND} p={ip(f, [power - 4, power + 12], [0, 1], (x) => x)} />
        <Label x={1650} y={420} text="CRACK!" size={110} font={FONT_TITLE} color={C.red} p={ip(f, [crack, crack + 6], [0, 1], (x) => x)} rot={8} />
      </Camera>
    </SceneSvg>
  );
};

/** "Local lords grew stronger, and they stopped listening to the shogun." */
export const Lords: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const lords = w3(287, "lords");
  const stronger = w3(289, "stronger");
  const stopped = w3(292, "stopped");
  const grow = ip(f, [stronger - 4, stronger + 12], [0, 1]);
  const turned = f > stopped;
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 540, z: 1.0 }], [to, { x: 960, y: 560, z: 1.04 }]])}>
        <Room tint={C.sky} />
        <Person x={300} y={940} s={1.05} tribe="shogun" f={f} expr={turned ? "worry" : "angry"} aR={turned ? 140 + Math.sin(f / 3) * 15 : 40} hold="fan" seed={5} />
        <Bubble x={420} y={330} w={360} h={120} text={turned ? "hello?!" : "listen to me!"} size={52} tail={[360, 470]} s={pop(f, from + 6)} fill={C.white} />
        {[1000, 1300, 1600].map((x, i) => (
          <Person
            key={i}
            x={x}
            y={940}
            s={(0.95 + grow * 0.35) * pop(f, lords - 6 + i * 3)}
            tribe="daimyo"
            f={f}
            flip={turned}
            expr={turned ? "happy" : grow > 0.3 ? "grin" : "smile"}
            aL={turned ? 170 : grow > 0.3 ? 150 : 10}
            aR={turned ? 170 : grow > 0.3 ? 150 : 10}
            seed={i + 3}
          />
        ))}
        <Label x={1300} y={300} text="local lords" size={60} font={FONT_HAND} p={ip(f, [lords, lords + 12], [0, 1], (x) => x) * (1 - grow)} />
        <Label x={1300} y={220} text="STRONGER" size={96} font={FONT_TITLE} color="#3f5f8f" p={ip(f, [stronger, stronger + 10], [0, 1], (x) => x) * ip(f, [stopped - 4, stopped + 2], [1, 0])} />
        <Label x={1300} y={240} text="la la la ~" size={74} font={FONT_HAND} p={ip(f, [stopped + 2, stopped + 16], [0, 1], (x) => x)} rot={-4} />
        {turned
          ? [0, 1, 2].map((i) => (
              <g key={i} transform={`translate(${1060 + i * 300 + Math.sin(f / 6 + i) * 10},${420 - ((f * 2 + i * 40) % 120)})`}>
                <path d={ellipseD(0, 0, 13, 10)} fill={INK} />
                <Ink d="M12,0 L12,-50 Q24,-40 34,-46" sw={4} />
              </g>
            ))
          : null}
      </Camera>
    </SceneSvg>
  );
};

/** "Then came a shogun named Yoshimasa. He loved art and tea ceremonies, and he later built the famous Silver Pavilion in Kyoto." */
export const Yoshimasa: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const yoshimasa = w3(302, "yoshimasa");
  const art = w3(305, "art");
  const tea = w3(307, "tea");
  const built = w3(312, "built");
  const silver = w3(315, "silver");
  const kyoto = w3(318, "kyoto");
  const cam = camAt(f, [
    [from, { x: 900, y: 540, z: 1.0 }],
    [built - 6, { x: 960, y: 560, z: 1.06 }],
    [silver + 4, { x: 2350, y: 540, z: 0.95 }],
    [to, { x: 2380, y: 540, z: 1.0 }],
  ]);
  const hold = f > tea - 2 ? "teabowl" : f > art - 2 ? "brush" : "none";
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        {/* the tea room */}
        <Pencil d="M-800,-600 H1600 V860 H-800 Z" fill={C.tan} fillOpacity={0.7} />
        {[100, 1500].map((x) => (
          <Pencil key={x} d={`M${x - 24},-600 h48 v1460 h-48 Z`} fill={C.darkBrown} />
        ))}
        <Pop s={pop(f, art - 4)} x={500} y={260}>
          <InkPainting x={500} y={130} s={1.1} />
        </Pop>
        {/* the garden and the pavilion */}
        <Shade d="M1600,-600 H3600 V860 H1600 Z" fill={C.sky} opacity={0.3} />
        <Sun x={3000} y={150} r={56} f={f} />
        {[1800, 2900, 3150].map((x, i) => (
          <RoundTree key={i} x={x} y={800} s={1.1} seed={i + 4} />
        ))}
        <Pencil d="M-800,860 H3600 V1600 H-800 Z" fill={C.straw} />
        <Pencil d="M1650,860 H3600 V1600 H1650 Z" fill={C.green} />
        <Pencil d={blobD(2350, 940, 520, 70, 4, 7, 0.1)} fill={C.sky} sw={3.5} />
        <Pop s={pop(f, built - 2, 140, 12)} x={2350} y={860}>
          <SilverPavilion x={2350} y={860} s={1.2} />
        </Pop>
        <Sparkle x={2050} y={380} s={pop(f, silver + 4) * (0.8 + 0.2 * Math.sin(f / 4))} />
        <Sparkle x={2680} y={320} s={pop(f, silver + 8) * (0.8 + 0.2 * Math.sin(f / 5))} />
        <Label x={2350} y={240} text="Silver Pavilion" size={84} font={FONT_TITLE} color="#6f737c" p={ip(f, [silver - 2, silver + 12], [0, 1], (x) => x)} rot={-3} />
        <Label x={2350} y={1010} text="Kyoto" size={56} font={FONT_HAND} p={ip(f, [kyoto, kyoto + 10], [0, 1], (x) => x)} />
        {/* Yoshimasa */}
        <Person x={900} y={940} s={1.25 * pop(f, from + 4)} tribe="noble" cloth={YOSHIMASA} f={f} expr={f > tea ? "happy" : "smile"} hold={hold} aR={hold === "teabowl" ? 70 : hold === "brush" ? 60 : 15} seed={4} />
        <Pop s={pop(f, tea - 4)} x={1200} y={930}>
          <TeaSet x={1200} y={930} s={0.9} f={f} />
        </Pop>
        <Label x={900} y={480} text="Shogun Yoshimasa" size={66} font={FONT_TITLE} color="#7a5aa0" p={ip(f, [yoshimasa - 2, yoshimasa + 14], [0, 1], (x) => x)} />
        <Label x={500} y={520} text="art" size={56} font={FONT_HAND} p={ip(f, [art, art + 8], [0, 1], (x) => x)} />
        <Label x={1240} y={640} text="tea!" size={56} font={FONT_HAND} p={ip(f, [tea, tea + 8], [0, 1], (x) => x)} />
        {[0, 1, 2].map((i) => (
          <Heart key={i} x={980 + i * 70} y={560 - i * 30} s={pop(f, tea + 6 + i * 4) * ip(f, [built - 6, built], [1, 0])} />
        ))}
      </Camera>
    </SceneSvg>
  );
};

/** "But when it came to politics, he was hopeless." */
export const Hopeless: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const politics = w3(324, "politics");
  const hopeless = w3(327, "hopeless");
  const pile = ip(f, [politics - 8, hopeless + 6], [0, 1]);
  const n = Math.floor(pile * 9);
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 540, z: 1.0 }], [to, { x: 960, y: 600, z: 1.12 }]])}>
        <Room />
        <Person x={900} y={940} s={1.2} tribe="noble" cloth={YOSHIMASA} f={f} expr={f > politics ? "nervous" : "happy"} hold="teabowl" aR={70} seed={4} />
        <Pencil d="M1000,940 L1300,940 L1300,860 L1000,860 Z" fill={C.brown} />
        {new Array(9).fill(0).map((_, i) => {
          if (i >= n) return null;
          const drop = ip(f, [politics - 8 + i * 3, politics + i * 3], [0, 1]);
          return (
            <g key={i} transform={`translate(${1150 + Math.sin(i * 2.3) * 40},${860 - i * 34 - (1 - drop) * 600}) rotate(${Math.sin(i * 1.7) * 10})`}>
              <Pencil d="M-110,-16 h220 v32 h-220 Z" fill="#f4e7c4" sw={3} />
              <Pencil d={ellipseD(-112, 0, 8, 18)} fill={C.darkBrown} sw={2.5} />
              <Pencil d={ellipseD(112, 0, 8, 18)} fill={C.darkBrown} sw={2.5} />
            </g>
          );
        })}
        <Label x={1150} y={460} text="politics" size={60} font={FONT_HAND} p={ip(f, [politics, politics + 12], [0, 1], (x) => x)} />
        <Pop s={pop(f, hopeless)} x={600} y={320}>
          <Cloud x={600} y={320} w={300} h={100} seed={7} fill={C.gray} />
        </Pop>
        <Label x={600} y={470} text="hopeless..." size={80} font={FONT_HAND} p={ip(f, [hopeless, hopeless + 12], [0, 1], (x) => x)} rot={-4} />
      </Camera>
    </SceneSvg>
  );
};

const NextShogunScroll: React.FC = () => (
  <g>
    <Pencil d="M-80,-24 h160 v48 h-160 Z" fill="#f4e7c4" sw={3} />
    <Pencil d={ellipseD(-82, 0, 9, 26)} fill={C.darkBrown} sw={2.5} />
    <Pencil d={ellipseD(82, 0, 9, 26)} fill={C.darkBrown} sw={2.5} />
  </g>
);

/** "He had no son, so he promised the title of shogun to his younger brother." */
export const Promised: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const son = w3(331, "son");
  const promised = w3(334, "promised");
  const younger = w3(341, "younger");
  const pass = ip(f, [promised + 2, younger + 4], [0, 1]);
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 540, z: 1.0 }], [to, { x: 960, y: 560, z: 1.05 }]])}>
        <Room />
        <Cradle x={360} y={900} s={1.1} />
        <Question x={360} y={620} s={pop(f, son)} size={110} />
        <Label x={360} y={500} text="no son" size={58} font={FONT_HAND} p={ip(f, [son, son + 10], [0, 1], (x) => x)} />
        <Person x={820} y={940} s={1.2} tribe="noble" cloth={YOSHIMASA} f={f} expr="smile" aR={f > promised - 4 && pass < 1 ? 80 : 15} seed={4} />
        <Person x={1450} y={940} s={1.1 * pop(f, younger - 6)} tribe="noble" cloth={BROTHER} f={f} flip expr="grin" aR={pass >= 1 ? 80 : 20} seed={7} />
        {pass > 0 && pass < 1 ? (
          <g transform={`translate(${900 + pass * 450},${760 - Math.sin(pass * Math.PI) * 120})`}>
            <NextShogunScroll />
          </g>
        ) : null}
        {pass >= 1 ? (
          <g transform="translate(1370,760)">
            <NextShogunScroll />
          </g>
        ) : null}
        <Label x={1150} y={520} text="next shogun: you!" size={64} font={FONT_HAND} p={ip(f, [promised, promised + 16], [0, 1], (x) => x)} rot={-3} />
        <Label x={1450} y={1010} text="younger brother" size={50} font={FONT_HAND} p={ip(f, [younger, younger + 12], [0, 1], (x) => x)} />
      </Camera>
    </SceneSvg>
  );
};

/** "Then, soon after, his wife gave birth to a baby boy." */
export const Baby: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const wife = w3(347, "wife");
  const baby = w3(352, "baby");
  const boy = w3(353, "boy");
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 540, z: 1.0 }], [to, { x: 1000, y: 560, z: 1.05 }]])}>
        <Room />
        <Person x={260} y={940} s={1.0} tribe="noble" cloth={BROTHER} f={f} expr={f > baby + 4 ? "shock" : "grin"} aR={80} seed={7} />
        <g transform="translate(330,760)">
          <NextShogunScroll />
        </g>
        <Person x={760} y={940} s={1.2} tribe="noble" cloth={YOSHIMASA} f={f} expr={f > baby + 4 ? "nervous" : "happy"} look={f > baby + 8 ? [-1, 0] : [0, 0]} seed={4} />
        <Person x={1360} y={940} s={1.15 * pop(f, wife - 6)} tribe="noble" long cloth={WIFE} f={f} flip expr="happy" hold={f > baby - 4 ? "baby" : "none"} aR={f > baby - 4 ? 60 : 15} seed={9} />
        {[0, 1, 2].map((i) => (
          <Heart key={i} x={1300 + i * 70} y={560 - i * 30} s={pop(f, baby + i * 4) * (1 + 0.08 * Math.sin(f / 3 + i))} />
        ))}
        <Sparkle x={1500} y={600} s={pop(f, boy + 2)} />
        <Label x={1360} y={440} text="a baby boy!" size={72} font={FONT_TITLE} color="#7a5aa0" p={ip(f, [boy - 2, boy + 10], [0, 1], (x) => x)} rot={-4} />
        <Label x={760} y={480} text="uh-oh..." size={60} font={FONT_HAND} p={ip(f, [boy + 10, boy + 22], [0, 1], (x) => x)} />
      </Camera>
    </SceneSvg>
  );
};

/** "Now two people wanted the same seat, the shogun's brother and the shogun's son." */
export const Seat: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const two = w3(355, "two");
  const seat = w3(360, "seat");
  const brother = w3(363, "brother");
  const son = w3(367, "son");
  const tug = f > seat ? Math.sin(f / 3) * 14 : 0;
  return (
    <SceneSvg f={f}>
      <Camera cam={camAt(f, [[from, { x: 960, y: 540, z: 1.0 }], [to, { x: 960, y: 560, z: 1.05 }]])}>
        <Room />
        <Pop s={pop(f, from + 2)} x={960} y={900}>
          <Throne x={960} y={900} s={0.8} />
        </Pop>
        <Label x={960} y={500} text="the shogun's seat" size={54} font={FONT_HAND} p={ip(f, [seat - 2, seat + 12], [0, 1], (x) => x)} />
        <Label x={960} y={200} text="2 people, 1 seat" size={90} font={FONT_TITLE} color={C.red} p={ip(f, [two, seat + 6], [0, 1], (x) => x)} />
        <Person x={420 + tug} y={940} s={1.15} tribe="noble" cloth={BROTHER} f={f} expr="angry" aR={f > seat ? 80 : 20} lean={f > seat ? 10 : 0} seed={7} />
        <Label x={420} y={1010} text="brother" size={52} font={FONT_HAND} p={ip(f, [brother, brother + 10], [0, 1], (x) => x)} />
        <Person x={1500 - tug} y={940} s={1.15} tribe="noble" long cloth={WIFE} f={f} flip expr="angry" hold="baby" aR={60} lean={f > seat ? 10 : 0} seed={9} />
        <Label x={1500} y={1010} text="son" size={52} font={FONT_HAND} p={ip(f, [son, son + 10], [0, 1], (x) => x)} />
        <DrawOn d="M560,700 Q760,620 860,700" p={ip(f, [seat, seat + 10], [0, 1])} sw={6} dotted color={C.red} />
        <DrawOn d="M1360,700 Q1160,620 1060,700" p={ip(f, [seat + 4, seat + 14], [0, 1])} sw={6} dotted color={C.red} />
        <Bang x={960} y={360} s={pop(f, son + 4)} n={3} />
      </Camera>
    </SceneSvg>
  );
};

/** "This started the Onin War. That's Onin, not onion." + a quiet ending */
export const OninWar: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const onin = w3(371, "onin");
  const thats = w3(373, "that's");
  const onion = w3(376, "onion");
  const glow = ip(f, [onin - 6, onin + 20], [0, 1]);
  const fade = ip(f, [to - 26, to], [1, 0]);
  const onionIn = pop(f, onion - 10, 170, 10);
  const xOut = ip(f, [onion + 4, onion + 12], [0, 1]);
  const leave = ip(f, [onion + 30, onion + 60], [0, 1]);
  return (
    <SceneSvg f={f}>
      <g opacity={fade}>
        <Camera cam={camAt(f, [[from, { x: 960, y: 540, z: 1.0 }], [to, { x: 960, y: 520, z: 1.08 }]])}>
          <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill="#e9874a" opacity={0.35 * glow} />
          <Shade d="M-600,-400 H2700 V1500 H-600 Z" fill={C.sky} opacity={0.2 * (1 - glow)} />
          {/* Kyoto's rooftops with smoke rising */}
          {new Array(8).fill(0).map((_, i) => {
            const x = 80 + i * 250;
            const h = 120 + (i % 3) * 40;
            return (
              <g key={i}>
                <Pencil d={`M${x - 90},880 h180 v${-h} h-180 Z`} fill={C.tan} sw={3.5} />
                <Pencil d={`M${x - 120},${880 - h + 10} Q${x},${880 - h - 70} ${x + 120},${880 - h + 10} Z`} fill="#4b4f5c" sw={3.5} />
              </g>
            );
          })}
          {glow > 0
            ? [300, 900, 1500].map((x, i) => {
                const items = [];
                for (let k = 0; k < 5; k++) {
                  const t = ((f + k * 16 + i * 9) % 80) / 80;
                  items.push(
                    <Pencil
                      key={k}
                      d={blobD(x + t * 80 + Math.sin(t * 5 + k) * 20, 700 - t * 420, 34 + t * 60, 28 + t * 50, k + i * 7, 6, 0.18)}
                      fill={C.darkGray}
                      sw={3}
                      opacity={(1 - t) * glow * 0.9}
                    />,
                  );
                }
                return <g key={i}>{items}</g>;
              })
            : null}
          <Pencil d="M-600,880 H2700 V1500 H-600 Z" fill="#8a7a5a" />
          <Pop s={pop(f, onin - 4, 200, 9)} x={960} y={330} rot={-4}>
            <Label x={960} y={380} text="THE ONIN WAR" size={150} font={FONT_TITLE} color={C.red} />
          </Pop>
          <Label x={960} y={480} text="(say: oh-neen)" size={52} font={FONT_HAND} p={ip(f, [thats, thats + 14], [0, 1], (x) => x)} />
          {/* ...not onion */}
          {onionIn > 0.01 ? (
            <g transform={`translate(${leave * 700},0)`}>
              <Pop s={onionIn} x={1500} y={860}>
                <Onion x={1500} y={860} s={1.2} f={f} />
              </Pop>
              <DrawOn d="M1380,560 L1620,860" p={xOut} sw={14} color={C.red} />
              <DrawOn d="M1620,560 L1380,860" p={xOut} sw={14} color={C.red} />
              <Label x={1500} y={480} text="not onion!" size={66} font={FONT_HAND} p={ip(f, [onion + 6, onion + 18], [0, 1], (x) => x)} rot={6} />
            </g>
          ) : null}
          <Sun x={1750} y={140} r={50} f={f} color="#f08a4b" />
        </Camera>
      </g>
    </SceneSvg>
  );
};

