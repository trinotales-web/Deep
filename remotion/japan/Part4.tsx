import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { useJapanAssets } from "./assets";
import { JapanAudioProps } from "./audioProps";
import { C, ip, NARRATION_OFFSET, sec } from "./theme";
import { CaptionStrip, Captions, GrainOverlay, PaperBg, Shot } from "./Stage";
import { WORDS_P4 } from "./words-part4";
import {
  CivilWars,
  Destroyed,
  FamilyName,
  Fire,
  Gekokujo,
  HowLong,
  Leaders,
  LordsMap,
  NobodyWon,
  PushOut,
  Streets,
  Title4,
} from "./scenes4/Sengoku";

export const PART4_DURATION = sec(54);

// Scene boundaries in video seconds (narration starts at NARRATION_OFFSET).
export const T4 = {
  title: 0,
  streets: 3.0,
  leaders: 5.6,
  fire: 11.35,
  destroyed: 15.25,
  howlong: 19.1,
  nobody: 25.85,
  lords: 29.75,
  civil: 34.4,
  gekokujo: 38.4,
  family: 44.4,
  push: 46.75,
  out: 54.0,
};

// Caption phrases as [firstWord, lastWord] indices into WORDS_P4.
const PHRASES_P4: [number, number][] = [
  [0, 9], [10, 21], [22, 32], [33, 42], [43, 51], [52, 58], [59, 62], [63, 67], [68, 75], [76, 78], [79, 88],
  [89, 93], [94, 98], [99, 105], [106, 114], [115, 121], [122, 127], [128, 132], [133, 142],
];

const KEY_COLORS_P4: Record<string, string> = {
  kyoto: C.indigo,
  red: C.red,
  monk: C.red,
  soninlaw: C.indigo,
  fire: C.lava,
  destroyed: "#6f6f6c",
  ten: C.red,
  nobody: "#6f6f6c",
  japan: C.red,
  sengoku: "#8a2a2e",
  gekokujo: "#7a5aa0",
  low: "#7a5aa0",
  high: "#7a5aa0",
  master: "#3f5f8f",
};

const SCENES: [keyof typeof T4, React.FC<{ f: number; from: number; to: number }>][] = [
  ["streets", Streets],
  ["leaders", Leaders],
  ["fire", Fire],
  ["destroyed", Destroyed],
  ["howlong", HowLong],
  ["nobody", NobodyWon],
  ["lords", LordsMap],
  ["civil", CivilWars],
  ["gekokujo", Gekokujo],
  ["family", FamilyName],
  ["push", PushOut],
];

const KEYS = Object.keys(T4) as (keyof typeof T4)[];

export const JapanPart4: React.FC<JapanAudioProps> = ({ musicVolume = 1, narrationVolume = 1 }) => {
  useJapanAssets();
  const f = useCurrentFrame();
  const s = (x: number) => sec(x);
  return (
    <AbsoluteFill style={{ backgroundColor: "#f3ede0" }}>
      <PaperBg />
      <Shot f={f} from={0} to={s(T4.streets)} xf={0}>
        <Title4 f={f} />
      </Shot>
      {SCENES.map(([key, Scene]) => {
        const from = s(T4[key]);
        const to = s(T4[KEYS[KEYS.indexOf(key) + 1]]);
        return (
          <Shot key={key} f={f} from={from} to={to}>
            <Scene f={f} from={from} to={to} />
          </Shot>
        );
      })}
      <CaptionStrip f={f} show={ip(f, [s(2.4), s(3.0)], [0, 1]) * ip(f, [s(51.4), s(52.2)], [1, 0])} />
      <Captions f={f} words={WORDS_P4} phrases={PHRASES_P4} keyColors={KEY_COLORS_P4} />
      <GrainOverlay />
      <Audio src={staticFile("japan/music_p4.m4a")} volume={musicVolume} />
      <Sequence from={s(NARRATION_OFFSET)} layout="none">
        <Audio src={staticFile("japan/narration_p4.m4a")} volume={narrationVolume} />
      </Sequence>
    </AbsoluteFill>
  );
};
