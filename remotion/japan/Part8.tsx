import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { useJapanAssets } from "./assets";
import { JapanAudioProps } from "./audioProps";
import { C, ip, NARRATION_OFFSET, sec } from "./theme";
import { CaptionStrip, Captions, GrainOverlay, PaperBg, Shot } from "./Stage";
import { WORDS_P8 } from "./words-part8";
import {
  Art,
  BlackShips,
  Choice,
  Cities,
  Control,
  Cost,
  Danger,
  EdoPeriod,
  Europe,
  Hostages,
  Knock,
  Peace,
  RacedAhead,
  SamuraiVsCannon,
  TeaTime,
  Title8,
  ToEdo,
  Warned,
  Warship,
  WhatNow,
} from "./scenes8/Edo";

export const PART8_DURATION = sec(88.5);

// Scene boundaries in video seconds (narration starts at NARRATION_OFFSET).
export const T8 = {
  title: 0,
  control: 3.0,
  toedo: 5.9,
  hostages: 9.2,
  danger: 12.6,
  cost: 17.3,
  peace: 21.6,
  edoperiod: 26.7,
  cities: 29.0,
  art: 31.6,
  raced: 36.8,
  europe: 40.4,
  tea: 46.3,
  warned: 53.7,
  warship: 58.0,
  samurai: 62.7,
  knock: 66.7,
  blackships: 71.2,
  choice: 77.0,
  whatnow: 82.0,
  out: 88.5,
};

// Caption phrases as [firstWord, lastWord] indices into WORDS_P8.
const PHRASES_P8: [number, number][] = [
  [0, 5], [6, 10], [11, 13], [14, 21], [22, 29], [30, 34], [35, 42], [43, 48], [49, 56], [57, 63], [64, 72], [73, 77], [78, 86], [87, 92], [93, 96], [97, 104], [105, 109], [110, 116], [117, 120], [121, 125], [126, 129], [130, 134], [135, 137], [138, 143], [144, 151], [152, 158], [159, 163], [164, 171], [172, 174], [175, 180], [181, 185], [186, 189], [190, 197], [198, 208], [209, 212], [213, 218], [219, 225], [226, 229], [230, 236],
];

const KEY_COLORS_P8: Record<string, string> = {
  shogun: C.darkGreen,
  daimyo: "#3f5f8f",
  edo: C.red,
  wives: "#b0506a",
  children: "#b0506a",
  danger: C.red,
  money: "#a8780a",
  war: C.red,
  peace: C.darkGreen,
  period: C.red,
  traders: "#a8780a",
  rich: "#a8780a",
  kabuki: "#d9673c",
  ukiyoe: "#2f4f8f",
  closed: "#8a5a3a",
  europe: C.indigo,
  revolutions: C.indigo,
  steam: "#5d636e",
  railways: "#5d636e",
  rifles: "#5d636e",
  tea: C.darkGreen,
  dutch: "#2f4f9f",
  warship: "#2b2b35",
  warships: "#2b2b35",
  samurai: "#33406b",
  cannons: C.red,
  door: "#8a5a3a",
  american: "#22305a",
  guns: C.red,
  choice: C.red,
};

const SCENES: [keyof typeof T8, React.FC<{ f: number; from: number; to: number }>][] = [
  ["control", Control],
  ["toedo", ToEdo],
  ["hostages", Hostages],
  ["danger", Danger],
  ["cost", Cost],
  ["peace", Peace],
  ["edoperiod", EdoPeriod],
  ["cities", Cities],
  ["art", Art],
  ["raced", RacedAhead],
  ["europe", Europe],
  ["tea", TeaTime],
  ["warned", Warned],
  ["warship", Warship],
  ["samurai", SamuraiVsCannon],
  ["knock", Knock],
  ["blackships", BlackShips],
  ["choice", Choice],
  ["whatnow", WhatNow],
];

const KEYS = Object.keys(T8) as (keyof typeof T8)[];

export const JapanPart8: React.FC<JapanAudioProps> = ({ musicVolume = 1, narrationVolume = 1 }) => {
  useJapanAssets();
  const f = useCurrentFrame();
  const s = (x: number) => sec(x);
  return (
    <AbsoluteFill style={{ backgroundColor: "#f3ede0" }}>
      <PaperBg />
      <Shot f={f} from={0} to={s(T8.control)} xf={0}>
        <Title8 f={f} />
      </Shot>
      {SCENES.map(([key, Scene]) => {
        const from = s(T8[key]);
        const to = s(T8[KEYS[KEYS.indexOf(key) + 1]]);
        return (
          <Shot key={key} f={f} from={from} to={to}>
            <Scene f={f} from={from} to={to} />
          </Shot>
        );
      })}
      <CaptionStrip f={f} show={ip(f, [s(2.4), s(3.0)], [0, 1]) * ip(f, [s(86.6), s(87.4)], [1, 0])} />
      <Captions f={f} words={WORDS_P8} phrases={PHRASES_P8} keyColors={KEY_COLORS_P8} />
      <GrainOverlay />
      <Audio src={staticFile("japan/music_p8.m4a")} volume={musicVolume} />
      <Sequence from={s(NARRATION_OFFSET)} layout="none">
        <Audio src={staticFile("japan/narration_p8.m4a")} volume={narrationVolume} />
      </Sequence>
    </AbsoluteFill>
  );
};
