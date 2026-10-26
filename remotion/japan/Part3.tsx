import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { useJapanAssets } from "./assets";
import { JapanPartProps, musicGain } from "./audioProps";
import { C, ip, NARRATION_OFFSET, sec } from "./theme";
import { CaptionStrip, Captions, GrainOverlay, PaperBg, Shot } from "./Stage";
import { WORDS_P3 } from "./words-part3";
import { ByDay, ByNight, Kublai, Letter, Ninjas, Peace, Title3 } from "./scenes3/Ninja";
import { Attack, Envoys, Fleet, Guess, Hold, Kamikaze, Typhoon1, Typhoon2, Walls } from "./scenes3/Mongols";
import { Baby, Crack, Hopeless, Lords, NoLand, OninWar, Promised, Reward, Seat, Yoshimasa } from "./scenes3/Cracks";

export const PART3_DURATION = sec(136);

// Scene boundaries in video seconds (narration starts at NARRATION_OFFSET).
export const T3 = {
  title: 0,
  ninjas: 3.0,
  byday: 7.5,
  bynight: 10.45,
  peace: 15.95,
  kublai: 23.4,
  letter: 30.05,
  attack: 33.95,
  typhoon1: 39.9,
  envoys: 45.95,
  walls: 51.95,
  fleet: 57.25,
  hold: 66.05,
  guess: 70.4,
  typhoon2: 72.45,
  kamikaze: 79.35,
  reward: 84.05,
  noland: 89.8,
  crack: 94.65,
  lords: 99.45,
  yoshimasa: 103.5,
  hopeless: 111.45,
  promise: 114.3,
  baby: 118.5,
  seat: 122.9,
  onin: 128.0,
  out: 136.0,
};

// Caption phrases as [firstWord, lastWord] indices into WORDS_P3.
const PHRASES_P3: [number, number][] = [
  [0, 10], [11, 16], [17, 25], [26, 35], [36, 40], [41, 50], [51, 57], [58, 61], [62, 68], [69, 73], [74, 78],
  [79, 87], [88, 90], [91, 94], [95, 100], [101, 106], [107, 110], [111, 118], [119, 125], [126, 131], [132, 136],
  [137, 144], [145, 150], [151, 160], [161, 170], [171, 176], [177, 183], [184, 190], [191, 198], [199, 203],
  [204, 206], [207, 214], [215, 225], [226, 231], [232, 238], [239, 245], [246, 255], [256, 263], [264, 270],
  [271, 278], [279, 285], [286, 289], [290, 296], [297, 302], [303, 308], [309, 318], [319, 327], [328, 331],
  [332, 342], [343, 345], [346, 353], [354, 360], [361, 367], [368, 372], [373, 376],
];

const KEY_COLORS_P3: Record<string, string> = {
  samurai: "#33406b",
  ninjas: "#2f3346",
  japan: C.red,
  japanese: C.red,
  mongols: "#9a4a3a",
  mongol: "#9a4a3a",
  kublai: "#9a4a3a",
  khan: "#9a4a3a",
  genghis: "#9a4a3a",
  china: C.indigo,
  gunpowder: "#5d636e",
  typhoon: C.deepSea,
  kamikaze: C.deepSea,
  shogun: "#8a2a2e",
  shoguns: "#8a2a2e",
  land: "#5f8f4d",
  yoshimasa: "#7a5aa0",
  silver: "#6f737c",
  pavilion: "#6f737c",
  kyoto: C.indigo,
  onin: C.red,
  onion: "#b58b1f",
};

const SCENES: [keyof typeof T3, React.FC<{ f: number; from: number; to: number }>][] = [
  ["ninjas", Ninjas],
  ["byday", ByDay],
  ["bynight", ByNight],
  ["peace", Peace],
  ["kublai", Kublai],
  ["letter", Letter],
  ["attack", Attack],
  ["typhoon1", Typhoon1],
  ["envoys", Envoys],
  ["walls", Walls],
  ["fleet", Fleet],
  ["hold", Hold],
  ["guess", Guess],
  ["typhoon2", Typhoon2],
  ["kamikaze", Kamikaze],
  ["reward", Reward],
  ["noland", NoLand],
  ["crack", Crack],
  ["lords", Lords],
  ["yoshimasa", Yoshimasa],
  ["hopeless", Hopeless],
  ["promise", Promised],
  ["baby", Baby],
  ["seat", Seat],
  ["onin", OninWar],
];

const KEYS = Object.keys(T3) as (keyof typeof T3)[];

export const JapanPart3: React.FC<JapanPartProps> = ({ musicVolume = 1, narrationVolume = 1, seamless = false, skipTitle = false, musicWindow, captionsClearBy }) => {
  useJapanAssets();
  const f = useCurrentFrame();
  const s = (x: number) => sec(x);
  return (
    <AbsoluteFill style={{ backgroundColor: "#f3ede0" }}>
      <PaperBg />
      {skipTitle ? null : (
        <Shot f={f} from={0} to={s(T3.ninjas)} xf={0}>
          <Title3 f={f} />
        </Shot>
      )}
      {SCENES.map(([key, Scene]) => {
        const from = s(T3[key]);
        const to = s(T3[KEYS[KEYS.indexOf(key) + 1]]);
        return (
          <Shot key={key} f={f} from={from} to={to}>
            <Scene f={f} from={from} to={to} />
          </Shot>
        );
      })}
      <CaptionStrip f={f} show={ip(f, [s(2.4), s(3.0)], [0, 1]) * (seamless ? 1 : ip(f, [s(133.2), s(134)], [1, 0]))} />
      <Captions f={f} words={WORDS_P3} phrases={PHRASES_P3} keyColors={KEY_COLORS_P3} clearBy={captionsClearBy} />
      <GrainOverlay />
      <Audio src={staticFile("japan/music_p3.m4a")} volume={(fr) => musicVolume * musicGain(fr, musicWindow)} />
      <Sequence from={s(NARRATION_OFFSET)} layout="none">
        <Audio src={staticFile("japan/narration_p3.m4a")} volume={narrationVolume} />
      </Sequence>
    </AbsoluteFill>
  );
};
