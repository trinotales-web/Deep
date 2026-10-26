import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { useJapanAssets } from "./assets";
import { JapanPartProps, musicGain } from "./audioProps";
import { C, ip, NARRATION_OFFSET, sec } from "./theme";
import { CaptionStrip, Captions, GrainOverlay, PaperBg, Shot } from "./Stage";
import { WORDS_P6 } from "./words-part6";
import {
  Betrayal,
  Central,
  FirstMan,
  Fool,
  March,
  Mystery,
  NoWayOut,
  Odds,
  Owari,
  Powerful,
  SearchIt,
  Smarter,
  Surprise,
  Temple,
  Title6,
} from "./scenes6/Nobunaga";

export const PART6_DURATION = sec(63.5);

// Scene boundaries in video seconds (narration starts at NARRATION_OFFSET).
export const T6 = {
  title: 0,
  firstman: 3.0,
  fool: 6.3,
  owari: 13.45,
  smarter: 15.55,
  march: 18.0,
  odds: 23.5,
  surprise: 28.0,
  powerful: 30.85,
  central: 34.8,
  temple: 38.4,
  betrayal: 42.9,
  noway: 49.3,
  search: 53.05,
  mystery: 56.6,
  out: 63.5,
};

// Caption phrases as [firstWord, lastWord] indices into WORDS_P6.
const PHRASES_P6: [number, number][] = [
  [0, 8], [9, 16], [17, 21], [22, 28], [29, 34], [35, 42], [43, 50], [51, 55], [56, 60], [61, 67], [68, 76], [77, 81],
  [82, 90], [91, 100], [101, 106], [107, 113], [114, 119], [120, 126], [127, 132], [133, 139], [140, 143], [144, 146],
  [147, 153], [154, 161], [162, 167],
];

const KEY_COLORS_P6: Record<string, string> = {
  oda: "#a8780a",
  nobunaga: "#a8780a",
  nobunagas: "#a8780a",
  fool: "#8a2a2e",
  owari: C.red,
  barefoot: C.brown,
  warlord: C.indigo,
  soldiers: C.indigo,
  surprise: C.red,
  won: "#a8780a",
  powerful: C.red,
  japan: C.red,
  central: "#a8780a",
  kyoto: C.indigo,
  temple: C.brown,
  trusted: "#3f7f86",
  generals: "#3f7f86",
  general: "#3f7f86",
  fire: C.lava,
  seppuku: "#5a4a8a",
  risk: C.red,
  nobody: "#8a2a2e",
};

const SCENES: [keyof typeof T6, React.FC<{ f: number; from: number; to: number }>][] = [
  ["firstman", FirstMan],
  ["fool", Fool],
  ["owari", Owari],
  ["smarter", Smarter],
  ["march", March],
  ["odds", Odds],
  ["surprise", Surprise],
  ["powerful", Powerful],
  ["central", Central],
  ["temple", Temple],
  ["betrayal", Betrayal],
  ["noway", NoWayOut],
  ["search", SearchIt],
  ["mystery", Mystery],
];

const KEYS = Object.keys(T6) as (keyof typeof T6)[];

export const JapanPart6: React.FC<JapanPartProps> = ({ musicVolume = 1, narrationVolume = 1, seamless = false, skipTitle = false, musicWindow, captionsClearBy }) => {
  useJapanAssets();
  const f = useCurrentFrame();
  const s = (x: number) => sec(x);
  return (
    <AbsoluteFill style={{ backgroundColor: "#f3ede0" }}>
      <PaperBg />
      {skipTitle ? null : (
        <Shot f={f} from={0} to={s(T6.firstman)} xf={0}>
          <Title6 f={f} />
        </Shot>
      )}
      {SCENES.map(([key, Scene]) => {
        const from = s(T6[key]);
        const to = s(T6[KEYS[KEYS.indexOf(key) + 1]]);
        return (
          <Shot key={key} f={f} from={from} to={to}>
            <Scene f={f} from={from} to={to} />
          </Shot>
        );
      })}
      <CaptionStrip f={f} show={ip(f, [s(2.4), s(3.0)], [0, 1]) * (seamless ? 1 : ip(f, [s(61.6), s(62.4)], [1, 0]))} />
      <Captions f={f} words={WORDS_P6} phrases={PHRASES_P6} keyColors={KEY_COLORS_P6} clearBy={captionsClearBy} />
      <GrainOverlay />
      <Audio src={staticFile("japan/music_p6.m4a")} volume={(fr) => musicVolume * musicGain(fr, musicWindow)} />
      <Sequence from={s(NARRATION_OFFSET)} layout="none">
        <Audio src={staticFile("japan/narration_p6.m4a")} volume={narrationVolume} />
      </Sequence>
    </AbsoluteFill>
  );
};
