import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { useJapanAssets } from "./assets";
import { JapanAudioProps } from "./audioProps";
import { C, ip, NARRATION_OFFSET, sec } from "./theme";
import { CaptionStrip, Captions, GrainOverlay, PaperBg, Shot } from "./Stage";
import { WORDS_P5 } from "./words-part5";
import { Duel, MoreGuns, NeverSame, Portugal, Smiths, Title5, Unite } from "./scenes5/Guns";

export const PART5_DURATION = sec(31.5);

// Scene boundaries in video seconds (narration starts at NARRATION_OFFSET).
export const T5 = {
  title: 0,
  portugal: 3.0,
  smiths: 8.15,
  moreguns: 12.95,
  neversame: 16.6,
  duel: 18.55,
  unite: 24.85,
  out: 31.5,
};

// Caption phrases as [firstWord, lastWord] indices into WORDS_P5.
const PHRASES_P5: [number, number][] = [
  [0, 9], [10, 13], [14, 21], [22, 27], [28, 35], [36, 40], [41, 48], [49, 59], [60, 68], [69, 72], [73, 77], [78, 84],
];

const KEY_COLORS_P5: Record<string, string> = {
  portugal: "#7a2a3a",
  guns: "#3d3d44",
  japan: C.red,
  japanese: C.red,
  blacksmiths: "#9a6a45",
  samurai: "#33406b",
  swords: "#5d636e",
  europe: C.indigo,
  sword: "#5d636e",
  farmer: "#5f8f4d",
  weapon: "#3d3d44",
  unite: C.red,
};

const SCENES: [keyof typeof T5, React.FC<{ f: number; from: number; to: number }>][] = [
  ["portugal", Portugal],
  ["smiths", Smiths],
  ["moreguns", MoreGuns],
  ["neversame", NeverSame],
  ["duel", Duel],
  ["unite", Unite],
];

const KEYS = Object.keys(T5) as (keyof typeof T5)[];

export const JapanPart5: React.FC<JapanAudioProps> = ({ musicVolume = 1, narrationVolume = 1 }) => {
  useJapanAssets();
  const f = useCurrentFrame();
  const s = (x: number) => sec(x);
  return (
    <AbsoluteFill style={{ backgroundColor: "#f3ede0" }}>
      <PaperBg />
      <Shot f={f} from={0} to={s(T5.portugal)} xf={0}>
        <Title5 f={f} />
      </Shot>
      {SCENES.map(([key, Scene]) => {
        const from = s(T5[key]);
        const to = s(T5[KEYS[KEYS.indexOf(key) + 1]]);
        return (
          <Shot key={key} f={f} from={from} to={to}>
            <Scene f={f} from={from} to={to} />
          </Shot>
        );
      })}
      <CaptionStrip f={f} show={ip(f, [s(2.4), s(3.0)], [0, 1]) * ip(f, [s(29.0), s(29.8)], [1, 0])} />
      <Captions f={f} words={WORDS_P5} phrases={PHRASES_P5} keyColors={KEY_COLORS_P5} />
      <GrainOverlay />
      <Audio src={staticFile("japan/music_p5.m4a")} volume={musicVolume} />
      <Sequence from={s(NARRATION_OFFSET)} layout="none">
        <Audio src={staticFile("japan/narration_p5.m4a")} volume={narrationVolume} />
      </Sequence>
    </AbsoluteFill>
  );
};
