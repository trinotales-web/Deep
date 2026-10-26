import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { useJapanAssets } from "./assets";
import { JapanAudioProps } from "./audioProps";
import { C, ip, NARRATION_OFFSET, sec } from "./theme";
import { CaptionStrip, Captions, GrainOverlay, PaperBg, Shot } from "./Stage";
import { WORDS_P7 } from "./words-part7";
import { Title7, Rush, Unify, SwordHunt, Melt, RealReason, WantedMore, Seoul, Turtle, Hungry, ChinaArmy, Home } from "./scenes7/Hideyoshi";
import { Child, Opposite, Loyal, Saying, Bird, Sekigahara, FogBattle, NobodyWinning, SecretDeal, Switch, Shogun, Family } from "./scenes7/Ieyasu";
import { Christians, Pope, Banned, Shimabara, Shiro, Siege, Fell, Inside, Sakoku, ExceptDutch, DejimaScene, NoStep } from "./scenes7/Sakoku";

export const PART7_DURATION = sec(174.5);

// Scene boundaries in video seconds (narration starts at NARRATION_OFFSET).
export const T7 = {
  title: 0,
  rush: 3.0,
  unify: 8.3,
  swordhunt: 13.0,
  melt: 15.75,
  reason: 19.4,
  wantedmore: 23.8,
  seoul: 29.1,
  turtle: 34.4,
  hungry: 40.6,
  chinaarmy: 43.4,
  home: 47.25,
  child: 52.3,
  opposite: 58.3,
  loyal: 64.1,
  saying: 70.0,
  bird: 73.1,
  sekigahara: 80.8,
  fog: 86.4,
  nobodywin: 91.5,
  secret: 93.8,
  switch: 97.7,
  shogun: 100.8,
  family: 106.0,
  christians: 110.7,
  pope: 119.0,
  banned: 123.2,
  shimabara: 127.3,
  shiro: 133.4,
  siege: 138.7,
  fell: 144.0,
  inside: 146.5,
  sakoku: 153.0,
  exceptdutch: 157.7,
  dejima: 163.2,
  nostep: 168.7,
  out: 174.5,
};

// Caption phrases as [firstWord, lastWord] indices into WORDS_P7.
const PHRASES_P7: [number, number][] = [
  [0, 4], [5, 12], [13, 19], [20, 27], [28, 36], [37, 45], [46, 51], [52, 57], [58, 63], [64, 67], [68, 77], [78, 86], [87, 91], [92, 98], [99, 103], [104, 108], [109, 116], [117, 120], [121, 128], [129, 133], [134, 141], [142, 148], [149, 155], [156, 159], [160, 165], [166, 172], [173, 181], [182, 188], [189, 195], [196, 199], [200, 204], [205, 207], [208, 212], [213, 218], [219, 226], [227, 231], [232, 237], [238, 245], [246, 250], [251, 257], [258, 263], [264, 269], [270, 273], [274, 279], [280, 287], [288, 295], [296, 301], [302, 306], [307, 311], [312, 318], [319, 323], [324, 331], [332, 335], [336, 341], [342, 346], [347, 352], [353, 355], [356, 359], [360, 369], [370, 377], [378, 385], [386, 391], [392, 399], [400, 404], [405, 408], [409, 417], [418, 421], [422, 427], [428, 436], [437, 440], [441, 449], [450, 453], [454, 459], [460, 464],
];

const KEY_COLORS_P7: Record<string, string> = {
  hideyoshi: "#a8780a",
  hideyoshis: "#a8780a",
  nobunaga: "#a8780a",
  nobunagas: "#a8780a",
  kyoto: C.indigo,
  traitor: C.red,
  weapons: "#5d636e",
  buddha: "#a8780a",
  china: "#c0392b",
  korea: "#2f4f9f",
  korean: "#2f4f9f",
  seoul: "#2f4f9f",
  yi: "#2f4f9f",
  sunsin: "#2f4f9f",
  turtle: C.darkGreen,
  tokugawa: C.darkGreen,
  ieyasu: C.darkGreen,
  ieyasus: C.darkGreen,
  wild: C.red,
  patient: C.indigo,
  loyal: C.darkGreen,
  bird: C.indigo,
  sekigahara: C.red,
  fog: "#5d636e",
  secret: C.red,
  shogun: C.darkGreen,
  christianity: C.bronze,
  christians: C.bronze,
  christian: C.bronze,
  pope: "#a8780a",
  banned: C.red,
  shimabara: C.red,
  amakusa: C.red,
  shiro: C.red,
  dutch: "#2f4f9f",
  sakoku: C.red,
  nagasaki: "#2f4f9f",
  dejima: "#2f4f9f",
};

const SCENES: [keyof typeof T7, React.FC<{ f: number; from: number; to: number }>][] = [
  ["rush", Rush],
  ["unify", Unify],
  ["swordhunt", SwordHunt],
  ["melt", Melt],
  ["reason", RealReason],
  ["wantedmore", WantedMore],
  ["seoul", Seoul],
  ["turtle", Turtle],
  ["hungry", Hungry],
  ["chinaarmy", ChinaArmy],
  ["home", Home],
  ["child", Child],
  ["opposite", Opposite],
  ["loyal", Loyal],
  ["saying", Saying],
  ["bird", Bird],
  ["sekigahara", Sekigahara],
  ["fog", FogBattle],
  ["nobodywin", NobodyWinning],
  ["secret", SecretDeal],
  ["switch", Switch],
  ["shogun", Shogun],
  ["family", Family],
  ["christians", Christians],
  ["pope", Pope],
  ["banned", Banned],
  ["shimabara", Shimabara],
  ["shiro", Shiro],
  ["siege", Siege],
  ["fell", Fell],
  ["inside", Inside],
  ["sakoku", Sakoku],
  ["exceptdutch", ExceptDutch],
  ["dejima", DejimaScene],
  ["nostep", NoStep],
];

const KEYS = Object.keys(T7) as (keyof typeof T7)[];

export const JapanPart7: React.FC<JapanAudioProps> = ({ musicVolume = 1, narrationVolume = 1 }) => {
  useJapanAssets();
  const f = useCurrentFrame();
  const s = (x: number) => sec(x);
  return (
    <AbsoluteFill style={{ backgroundColor: "#f3ede0" }}>
      <PaperBg />
      <Shot f={f} from={0} to={s(T7.rush)} xf={0}>
        <Title7 f={f} />
      </Shot>
      {SCENES.map(([key, Scene]) => {
        const from = s(T7[key]);
        const to = s(T7[KEYS[KEYS.indexOf(key) + 1]]);
        return (
          <Shot key={key} f={f} from={from} to={to}>
            <Scene f={f} from={from} to={to} />
          </Shot>
        );
      })}
      <CaptionStrip f={f} show={ip(f, [s(2.4), s(3.0)], [0, 1]) * ip(f, [s(172.6), s(173.4)], [1, 0])} />
      <Captions f={f} words={WORDS_P7} phrases={PHRASES_P7} keyColors={KEY_COLORS_P7} />
      <GrainOverlay />
      <Audio src={staticFile("japan/music_p7.m4a")} volume={musicVolume} />
      <Sequence from={s(NARRATION_OFFSET)} layout="none">
        <Audio src={staticFile("japan/narration_p7.m4a")} volume={narrationVolume} />
      </Sequence>
    </AbsoluteFill>
  );
};
