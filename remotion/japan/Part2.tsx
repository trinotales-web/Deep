import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { useJapanAssets } from "./assets";
import { JapanPartProps, musicGain } from "./audioProps";
import { C, ip, NARRATION_OFFSET, sec } from "./theme";
import { CaptionStrip, Captions, GrainOverlay, PaperBg, Shot } from "./Stage";
import { WORDS_P2 } from "./words-part2";
import { BuddhismArrives, KeepsBoth, ShrineTemple, Title2, Today } from "./scenes2/Religion";
import { Balance, EmperorPower, Guards, Kyoto, Landowner, SamuraiReveal } from "./scenes2/Rise";
import { Bushido, Hierarchy, Swords, Victory, War } from "./scenes2/Shogun";

export const PART2_DURATION = sec(86);

// Scene boundaries in video seconds (narration starts at NARRATION_OFFSET).
export const T2 = {
  title: 0,
  buddhism: 3.0,
  both: 7.35,
  rites: 16.5,
  today: 20.95,
  kyoto: 25.6,
  emperor: 31.1,
  landowner: 34.05,
  guards: 38.2,
  samurai: 42.75,
  balance: 44.82,
  war: 48.95,
  victory: 54.4,
  hierarchy: 57.9,
  bushido: 74.7,
  swords: 77.9,
  out: 86.0,
};

// Caption phrases as [firstWord, lastWord] indices into WORDS_P2.
const PHRASES_P2: [number, number][] = [
  [0, 9], [10, 12], [13, 18], [19, 25], [26, 34], [35, 38], [39, 44], [45, 49], [50, 54], [55, 60], [61, 68],
  [69, 76], [77, 83], [84, 90], [91, 94], [95, 103], [104, 109], [110, 114], [115, 120], [121, 124], [125, 135],
  [136, 140], [141, 150], [151, 156], [157, 165], [166, 171], [172, 180], [181, 183], [184, 188], [189, 193],
  [194, 200], [201, 210], [211, 215], [216, 222],
];

const KEY_COLORS_P2: Record<string, string> = {
  buddhism: "#b0742a",
  shinto: "#d8573a",
  jomon: C.terracotta,
  japan: C.red,
  japanese: C.red,
  kyoto: C.indigo,
  emperor: "#b07a1f",
  samurai: "#33406b",
  minamoto: "#5d636e",
  taira: C.red,
  shogun: "#8a2a2e",
  daimyo: "#3f5f8f",
  bushido: C.red,
  katana: "#5d636e",
  wakizashi: "#5d636e",
};

const SCENES: [keyof typeof T2, React.FC<{ f: number; from: number; to: number }>][] = [
  ["buddhism", BuddhismArrives],
  ["both", KeepsBoth],
  ["rites", ShrineTemple],
  ["today", Today],
  ["kyoto", Kyoto],
  ["emperor", EmperorPower],
  ["landowner", Landowner],
  ["guards", Guards],
  ["samurai", SamuraiReveal],
  ["balance", Balance],
  ["war", War],
  ["victory", Victory],
  ["hierarchy", Hierarchy],
  ["bushido", Bushido],
  ["swords", Swords],
];

const KEYS = Object.keys(T2) as (keyof typeof T2)[];

export const JapanPart2: React.FC<JapanPartProps> = ({ musicVolume = 1, narrationVolume = 1, seamless = false, skipTitle = false, musicWindow, captionsClearBy }) => {
  useJapanAssets();
  const f = useCurrentFrame();
  const s = (x: number) => sec(x);
  return (
    <AbsoluteFill style={{ backgroundColor: "#f3ede0" }}>
      <PaperBg />
      {skipTitle ? null : (
        <Shot f={f} from={0} to={s(T2.buddhism)} xf={0}>
          <Title2 f={f} />
        </Shot>
      )}
      {SCENES.map(([key, Scene]) => {
        const from = s(T2[key]);
        const to = s(T2[KEYS[KEYS.indexOf(key) + 1]]);
        return (
          <Shot key={key} f={f} from={from} to={to}>
            <Scene f={f} from={from} to={to} />
          </Shot>
        );
      })}
      <CaptionStrip f={f} show={ip(f, [s(2.4), s(3.0)], [0, 1]) * (seamless ? 1 : ip(f, [s(83.0), s(83.8)], [1, 0]))} />
      <Captions f={f} words={WORDS_P2} phrases={PHRASES_P2} keyColors={KEY_COLORS_P2} clearBy={captionsClearBy} />
      <GrainOverlay />
      <Audio src={staticFile("japan/music_p2.m4a")} volume={(fr) => musicVolume * musicGain(fr, musicWindow)} />
      <Sequence from={s(NARRATION_OFFSET)} layout="none">
        <Audio src={staticFile("japan/narration_p2.m4a")} volume={narrationVolume} />
      </Sequence>
    </AbsoluteFill>
  );
};
