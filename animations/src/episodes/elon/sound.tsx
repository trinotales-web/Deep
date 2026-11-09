import React, { useMemo } from "react";
import { useVideoConfig } from "remotion";
import type { Caption } from "@remotion/captions";
import { Ambience, Bed, Sfx, SoundAt, licensedSrc, duckFromCaptions, type AmbName, type SfxName } from "../../kit/audio";

// Sound design for the Elon Musk story. Voice-first: no music, no musical
// stingers, no whooshes on cuts, no birdsong. One quiet ambience bed per
// location; licensed one-shots (Essential Sound Effects Bundle) only for
// things you can see happen, plus a few impacts on key words. Everything ducks
// under the narration; times are seconds on the tightened VO.

const E = (name: string) => licensedSrc("essential", name);

const AMB = 0.55;
const FX = 0.9;
const FX_DUCK = 0.55; // ≈ -5 dB under speech
const AMB_DUCK = 0.5; // ≈ -6 dB under speech

type BedRow = [AmbName, number, number, number];
// synthesized beds: [bed, from, to, gain]
const BEDS: BedRow[] = [
  ["waves", 0, 11.25, 0.32],
  ["room_tone", 11.25, 13.5, 0.3],
  ["wind", 13.5, 22.25, 0.32],
  ["room_tone", 22.25, 25.55, 0.3],
  ["rain", 25.55, 27.6, 0.3],
  ["room_tone", 27.6, 35.35, 0.3],
  ["waves", 35.35, 39.4, 0.3],
  ["wind", 39.4, 42.85, 0.18],
  ["waves", 42.85, 45.2, 0.3],
  ["room_tone", 45.2, 53.15, 0.3],
  ["wind", 53.15, 55.95, 0.3],
  ["waves", 55.95, 57.85, 0.3],
  ["room_tone", 57.85, 73.3, 0.25],
  ["wind", 73.3, 74.4, 0.2],
  ["room_tone", 74.4, 97.0, 0.28],
  ["wind", 97.0, 106.75, 0.18],
  ["room_tone", 106.75, 110.55, 0.25],
  ["rain", 110.55, 112.95, 0.45],
  ["wind", 112.95, 114.95, 0.25],
  ["room_tone", 114.95, 154.4, 0.28],
  ["wind", 154.4, 167.95, 0.24],
  ["room_tone", 167.95, 180.7, 0.28],
  ["fire", 180.7, 182.0, 0.3],
  ["wind", 182.0, 195.4, 0.2],
  ["room_tone", 195.4, 228.6, 0.28],
  ["wind", 228.6, 246.4, 0.3],
  ["waves", 246.4, 251.0, 0.3],
  ["room_tone", 251.0, 275.5, 0.28],
  ["room_tone", 275.5, 282.8, 0.25],
  ["waves", 282.8, 284.5, 0.3],
  ["room_tone", 284.5, 288.45, 0.28],
  ["wind", 288.45, 292.9, 0.25],
  ["room_tone", 292.9, 328.85, 0.26],
  ["wind", 328.85, 332.4, 0.16],
  ["room_tone", 332.4, 349.1, 0.22],
  ["wind", 349.1, 353.6, 0.35],
  ["room_tone", 353.6, 404.75, 0.27],
  ["rain", 404.75, 409.2, 0.4],
  ["room_tone", 409.2, 413.75, 0.27],
  ["wind", 413.75, 415.65, 0.28],
  ["room_tone", 415.65, 427.3, 0.27],
  ["waves", 427.3, 432.65, 0.3],
  ["wind", 432.65, 433.6, 0.3],
  ["room_tone", 433.6, 442.3, 0.25],
  ["waves", 442.3, 445.9, 0.28],
  ["room_tone", 445.9, 462.65, 0.26],
  ["waves", 462.65, 466.9, 0.25],
  ["room_tone", 466.9, 499.6, 0.26],
  ["waves", 499.6, 502.9, 0.3],
  ["wind", 502.9, 505.75, 0.2],
  ["waves", 505.75, 508.9, 0.3],
  ["wind", 508.9, 515.15, 0.18],
  ["waves", 515.15, 519.15, 0.25],
  ["room_tone", 519.15, 540.3, 0.18],
  ["waves", 540.3, 546.15, 0.25],
  ["room_tone", 546.15, 561.45, 0.22],
  ["wind", 561.45, 562.85, 0.3],
  ["room_tone", 562.85, 628.1, 0.27],
  ["wind", 628.1, 629.95, 0.2],
  ["room_tone", 629.95, 700.85, 0.27],
  ["wind", 700.85, 704.85, 0.22],
  ["room_tone", 704.85, 741.75, 0.24],
  ["wind", 741.75, 754.25, 0.2],
  ["room_tone", 754.25, 783.3, 0.24],
  ["waves", 783.3, 788.0, 0.25],
  ["wind", 788.0, 802.45, 0.3],
  ["room_tone", 802.45, 804.6, 0.24],
  ["waves", 804.6, 810.6, 0.25],
  ["wind", 810.6, 816.8, 0.24],
  ["room_tone", 816.8, 865.2, 0.25],
  ["room_tone", 865.2, 878.4, 0.16],
  ["room_tone", 878.4, 907.25, 0.25],
  ["waves", 907.25, 918.75, 0.3],
  ["room_tone", 918.75, 922.4, 0.22],
];

// licensed beds: [file, from, to, gain]
const LBEDS: [string, number, number, number][] = [
  ["ambient-background-people-in-an-open-room", 22.25, 25.55, 0.14],
  ["ambient-crowd-murmur-indoors-1", 31.55, 35.35, 0.12],
  ["ambient-crowd-murmur-1", 39.4, 42.85, 0.12],
  ["ambient-crowd-murmur-indoors-2", 60.85, 65.5, 0.12],
  ["ambient-crowd-murmur-1", 97.0, 103.0, 0.12],
  ["thunderstorm-1", 110.55, 112.95, 0.2],
  ["machinery-1", 122.6, 131.6, 0.08],
  ["ambient-crowd-murmur-indoors-2", 167.95, 172.85, 0.12],
  ["ambient-city-street-1", 209.1, 211.35, 0.14],
  ["ambient-crowd-murmur-indoors-1", 254.1, 261.6, 0.1],
  ["ambient-background-people-in-an-open-room", 274.0, 275.5, 0.12],
  ["ambient-crowd-murmur-indoors-1", 324.75, 328.85, 0.1],
  ["air-blowing", 357.6, 366.55, 0.08],
  ["thunderstorm-2", 404.75, 409.2, 0.2],
  ["ambient-city-street-2", 413.75, 415.65, 0.12],
  ["ambient-background-people-in-an-open-room", 433.6, 442.3, 0.12],
  ["ambient-crowd-murmur-indoors-2", 466.9, 471.2, 0.1],
  ["ambient-crowd-murmur-indoors-1", 479.65, 488.45, 0.1],
  ["ambient-crowd-murmur-1", 494.75, 499.6, 0.1],
  ["machinery-2", 562.85, 570.8, 0.08],
  ["ambient-crowd-murmur-indoors-2", 585.15, 599.3, 0.12],
  ["ambient-crowd-murmur-indoors-1", 601.95, 606.4, 0.1],
  ["ambient-crowd-murmur-indoors-2", 613.15, 626.3, 0.12],
  ["ambient-city-street-3", 628.1, 629.95, 0.1],
  ["ambient-crowd-murmur-indoors-1", 653.6, 664.1, 0.1],
  ["ambient-background-people-in-an-open-room", 674.8, 685.1, 0.12],
  ["ambient-crowd-murmur-1", 704.85, 709.5, 0.16],
  ["ambient-crowd-murmur-indoors-2", 735.3, 741.75, 0.14],
  ["ambient-crowd-murmur-1", 745.4, 750.95, 0.14],
  ["ambient-crowd-murmur-1", 769.55, 772.0, 0.14],
  ["ambient-crowd-murmur-indoors-1", 816.8, 820.7, 0.1],
  ["ambient-crowd-murmur-indoors-2", 837.1, 845.45, 0.12],
  ["ambient-crowd-murmur-indoors-1", 851.6, 863.2, 0.08],
  ["ambient-crowd-murmur-1", 898.8, 902.9, 0.1],
];

// one-shots: [time (s), bundle file, gain]
const CUES: [number, string, number][] = [
  // cold open
  [11.95, "stamp", 0.22],
  [12.36, "stamp", 0.22],
  [12.76, "stamp", 0.24],
  [13.6, "rumble-soft", 0.14300000667572021],
  [14.35, "sizzle", 0.06300000101327896],
  [15.1, "explosion-distant-1", 0.03200000151991844],
  [15.12, "water-impact-echo", 0.03],
  [15.9, "rumble-soft", 0.21299999952316284],
  [17.5, "shutdown-2", 0.0430000014603138],
  [18.8, "rumble-soft", 0.26],
  [20.9, "explosion-2", 0.32199999690055847],
  [20.92, "impact-hit-2", 0.2409999966621399],
  [24.5, "impact-hit-1", 0.14100000262260437],
  [28.3, "paper-rattling", 0.14],
  [30.8, "glass-breaking-1", 0.26],
  [32.3, "rattle", 0.2],
  [37.85, "impact-hit-3", 0.3],
  // the hook
  [41.0, "laughter-kid", 0.12],
  [48.1, "impact-hit-1", 0.1509999930858612],
  [50.9, "alert-positive-retro-game", 0.12],
  [53.5, "crash-3", 0.3],
  [56.55, "stamp", 0.26],
  [61.0, "pop-2", 0.16],
  [61.15, "stamp", 0.22],
  [63.6, "machinery-2", 0.12],
  [67.0, "pop-1", 0.12],
  // childhood
  [74.9, "camera-1", 0.2],
  [75.6, "camera-2", 0.18],
  [76.2, "camera-3", 0.2],
  [85.9, "page-turning", 0.16],
  [104.5, "grunt", 0.1],
  [105.3, "thump", 0.22],
  [106.05, "screech-thud", 0.2],
  [109.9, "heartbeat-single-lub-dub", 0.12],
  [116.5, "page-turning-2", 0.15],
  [127.62, "alert-two-tone-dot-matrix", 0.14],
  [129.6, "pop-3", 0.1],
  [134.3, "alert-idea", 0.08299999684095383],
  [140.3, "typing-1", 0.14],
  [143.2, "alert-positive-retro-game", 0.0560000017285347],
  [146.85, "pop-2", 0.14],
  [148.6, "notification-two-tone", 0.12],
  [152.4, "mouse-click", 0.12],
  // emigration, university
  [160.85, "stamp", 0.24],
  [165.0, "pop-1", 0.1],
  [171.26, "stamp", 0.1809999942779541],
  [175.2, "pop-1", 0.12],
  [181.0, "thud", 0.0],
  [194.6, "stamp", 0.2],
  [196.0, "pop-4", 0.12],
  // Zip2, the McLaren
  [203.2, "mouse-click-double", 0.12],
  [216.4, "pop-2", 0.14],
  [219.62, "stamp", 0.22],
  [219.7, "paper-rattling", 0.14],
  [222.9, "pop-3", 0.1],
  [236.75, "car-engine-starting-2", 0.32],
  [238.65, "crash-1", 0.32499998807907104],
  [241.3, "crash-2", 0.10999999940395355],
  [241.35, "glass-breaking-4", 0.04800000041723251],
  [245.4, "stamp", 0.22],
  [252.0, "paper-rattling", 0.12],
  [257.1, "rattle", 0.2],
  // X.com, PayPal, malaria, the sale
  [263.9, "pop-2", 0.12],
  [266.1, "impact-hit-1", 0.050999999046325684],
  [272.1, "pop-3", 0.12],
  [285.05, "stamp", 0.24],
  [287.35, "door-slam-2", 0.3],
  [290.6, "fly-by-wobbly", 0.08],
  [291.7, "slap-single", 0.12],
  [306.7, "pop-2", 0.12],
  [314.35, "pop-4", 0.08],
  [315.03, "pop-4", 0.08],
  [315.79, "pop-4", 0.08],
  [327.7, "rattle", 0.2],
  [328.1, "stamp", 0.24],
  // Mars, Russia, first principles, SpaceX, Tesla
  [330.9, "pop-1", 0.1],
  [336.6, "rumble-soft", 0.18],
  [354.7, "stamp", 0.16],
  [358.0, "typing-2", 0.12],
  [364.9, "alert-idea", 0.12],
  [369.3, "clap-single-2", 0.12],
  [371.4, "snap", 0.14],
  [373.9, "door-opening-1", 0.22],
  [377.3, "paper-rattling", 0.1],
  [384.0, "stamp", 0.22],
  [395.0, "hit-dull", 0.3],
  [396.6, "pop-2", 0.12],
  [401.6, "electrified", 0.1],
  // 2008, the fourth launch
  [408.2, "thunderstorm-3", 0.14],
  [410.3, "stamp", 0.18],
  [410.55, "stamp", 0.18],
  [410.8, "stamp", 0.18],
  [412.3, "fire", 0.0],
  [414.9, "impact-hit-1", 0.15399999916553497],
  [416.6, "crumple", 0.14],
  [421.6, "paper-rattling", 0.1],
  [431.25, "rumble-soft", 0.32600000500679016],
  [431.4, "explosion-distant-3", 0.32],
  [432.7, "rumble-soft", 0.31299999356269836],
  [433.75, "crowd-cheering-large-1", 0.07100000232458115],
  [439.6, "applause-small-group-1", 0.22],
  [449.9, "alert-digital", 0.2],
  [450.55, "alert-digital", 0.0560000017285347],
  [461.6, "pop-3", 0.08699999749660492],
  [462.0, "pop-3", 0.1],
  [465.2, "stamp", 0.2],
  [471.6, "car-door-open-close", 0.12],
  [476.0, "impact-hit-3", 0.24],
  // things move fast
  [481.0, "bell-boxing-triple", 0.06700000166893005],
  [481.2, "applause-small-group-2", 0.04800000041723251],
  [487.2, "applause-small-group-3", 0.2],
  [496.6, "laughter-male", 0.12],
  [497.4, "laughter-female-1", 0.1],
  [501.7, "water-impact-echo", 0.29899999499320984],
  [504.9, "crash-4", 0.32],
  [506.0, "rumble-soft", 0.28999999165534973],
  [507.9, "explosion-4", 0.10599999874830246],
  [509.5, "rumble-soft", 0.32],
  [514.15, "thump", 0.32],
  [515.3, "rumble-soft", 0.45],
  [515.5, "explosion-distant-4", 0.3],
  [520.3, "creak-short", 0.12],
  [531.1, "ding-single-bright", 0.08],
  [543.2, "applause-small-group-1", 0.14],
  [559.0, "pop-1", 0.12],
  // not all smooth
  [561.9, "thump", 0.16],
  [562.4, "thump", 0.14],
  [572.0, "notification-two-tone", 0.12],
  [577.6, "stamp", 0.2],
  [581.3, "pop-2", 0.1],
  [581.6, "pop-2", 0.1],
  [584.0, "hit-dull", 0.16],
  [586.6, "applause-large-crowd-1", 0.18],
  [594.6, "swish-1", 0.0],
  [595.6, "glass-breaking-2", 0.36],
  [595.9, "crowd-disappointed-groans", 0.10700000077486038],
  [598.15, "glass-breaking-3", 0.1459999978542328],
  [598.4, "gasp-male-1", 0.12],
  [604.6, "applause-large-crowd-2", 0.16],
  [612.36, "impact-hit-1", 0.09700000286102295],
  [613.6, "applause-large-crowd-1", 0.16],
  [625.9, "laughter-male-3", 0.16],
  [626.1, "laughter-female-2", 0.14],
  [632.4, "electrified", 0.1],
  [638.9, "click-single", 0.12],
  [648.44, "impact-hit-1", 0.18700000643730164],
  [650.3, "pop-2", 0.12],
  [658.3, "laughter-male-2", 0.14],
  // Twitter → X
  [663.3, "rattle", 0.18],
  [664.8, "stamp", 0.2],
  [669.4, "digital-glitch-2", 0.08],
  [672.0, "hit-dull", 0.32],
  [679.5, "notification-two-tone-2", 0.12],
  [683.3, "pop-5", 0.1],
  [683.5, "pop-5", 0.08],
  [686.9, "mouse-click", 0.12],
  [693.35, "impact-hit-2", 0.08699999749660492],
  [694.9, "pop-2", 0.12],
  // politics
  [703.75, "stamp", 0.22],
  [705.0, "crowd-noise-applause-whistle-outdoors", 0.14],
  [709.6, "notification-two-tone", 0.12],
  [724.05, "pop-1", 0.14],
  [729.0, "snap", 0.12399999797344208],
  [729.3, "snap", 0.12],
  [734.2, "deflating", 0.12],
  [738.0, "machinery-2", 0.12],
  [738.3, "crowd-cheering-large-2", 0.2],
  [742.4, "stamp", 0.14],
  [742.6, "stamp", 0.12],
  [742.8, "stamp", 0.12],
  [745.5, "crowd-cheering-large-1", 0.08399999886751175],
  [747.0, "crowd-unhappy", 0.16],
  [753.2, "door-closing-2", 0.16],
  [756.6, "notification-two-tone", 0.1],
  [757.2, "notification-two-tone-2", 0.1],
  [768.5, "deflating", 0.14],
  [771.1, "crowd-cheering-large-2", 0.10400000214576721],
  [779.0, "applause-small-group-2", 0.18],
  // Starship and the catch
  [781.0, "pop-1", 0.1],
  [781.5, "pop-1", 0.1],
  [782.0, "pop-1", 0.1],
  [782.5, "pop-2", 0.12],
  [788.1, "rumble-soft", 0.2809999883174896],
  [791.3, "explosion-6", 0.08100000023841858],
  [793.0, "explosion-distant-2", 0.18],
  [799.5, "rumble-soft", 0.4],
  [803.2, "pop-1", 0.1],
  [805.0, "rumble-soft", 0.32],
  [807.15, "door-slam-large-metal", 0.38],
  [809.1, "crowd-cheering-large-1", 0.05999999865889549],
  // the trillion-dollar year
  [819.4, "applause-small-group-3", 0.16],
  [830.8, "impact-hit-1", 0.08799999952316284],
  [840.1, "bell-boxing-triple", 0.13699999451637268],
  [843.3, "crowd-cheering-large-2", 0.1940000057220459],
  [846.3, "paper-rattling", 0.12],
  [856.0, "applause-large-crowd-2", 0.16],
  // the jury, Mars, the Moon
  [859.0, "hit-dull", 0.22],
  [867.0, "rumble-soft", 0.16],
  // the ending
  [884.3, "rattle", 0.2],
  [884.6, "stamp", 0.24],
  [885.7, "pop-2", 0.1],
  [888.1, "pop-2", 0.1],
  [890.95, "pop-2", 0.1],
  [893.3, "pop-2", 0.1],
  [895.4, "explosion-distant-2", 0.11100000143051147],
  [897.0, "rumble-soft", 0.28],
  [898.3, "thump", 0.26],
  [899.9, "crowd-cheering-large-1", 0.09799999743700027],
  [902.0, "crowd-unhappy", 0.14],
  [905.5, "impact-hit-3", 0.14800000190734863],
  [919.1, "pop-1", 0.14],
  [920.1, "pop-1", 0.14],
];

const steps = (from: number, to: number, rate: number) => {
  const out: number[] = [];
  for (let t = from; t < to; t += 1 / rate) out.push(t);
  return out;
};
const FOOT: SfxName[] = ["footstep", "footstep2", "footstep3", "footstep4"];
// [from, to, rate]: visible walking / running
const WALK: [number, number, number][] = [
  [97.1, 98.8, 2.0],
  [113.3, 114.9, 1.6],
  [182.1, 184.4, 2.0],
  [193.7, 195.3, 2.2],
  [209.2, 211.3, 1.8],
  [228.7, 232.3, 0.0],
  [286.2, 287.5, 4.2],
  [308.9, 311.5, 1.8],
  [349.2, 353.5, 1.8],
  [644.0, 646.0, 2.0],
  [674.9, 679.3, 1.8],
  [701.0, 704.8, 1.8],
  [741.9, 745.3, 1.6],
  [751.1, 754.2, 1.8],
];
// [from, to, file]: visible typing
const TYPE: [number, number, string][] = [
  [50.0, 53.1, "typing-3"],
  [139.9, 141.7, "typing-1"],
  [280.2, 282.7, "typing-4"],
  [357.7, 359.8, "typing-2"],
];

export const ElonSound: React.FC<{ captions: Caption[] }> = ({ captions }) => {
  const { fps } = useVideoConfig();
  const fxDuck = useMemo(() => duckFromCaptions(captions, fps, FX_DUCK, 0.12), [captions, fps]);
  const ambDuck = useMemo(() => duckFromCaptions(captions, fps, AMB_DUCK, 0.2), [captions, fps]);
  const onsets = useMemo(() => captions.map((c) => c.startMs / 1000), [captions]);
  const nearOnset = (t: number, before = 0.08, after = 0.12) => onsets.some((o) => t > o - before && t < o + after);
  return (
    <>
      {BEDS.map(([name, from, to, g], i) => (
        <Ambience key={`bed${i}`} name={name} from={from} to={to} volume={g * AMB} gainAt={ambDuck} fadeIn={0.25} fadeOut={0.3} />
      ))}
      {LBEDS.map(([f, from, to, g], i) => (
        <Bed key={`lb${i}`} src={E(f)} from={from} to={to} volume={g * AMB} gainAt={ambDuck} name={`amb:${f}`} />
      ))}
      {WALK.filter(([, , r]) => r > 0).flatMap(([a, b, r], k) =>
        steps(a, b, r)
          .filter((t) => !nearOnset(t))
          .map((t, i) => <Sfx key={`w${k}-${i}`} name={FOOT[i % 4]} at={t} volume={(r > 3 ? 0.12 : 0.09) * FX} duck={fxDuck} />),
      )}
      {TYPE.map(([a, b, f], i) => (
        <Bed key={`ty${i}`} src={E(f)} from={a} to={b} volume={0.1 * FX} gainAt={fxDuck} fadeIn={0.1} fadeOut={0.2} name={`type:${f}`} />
      ))}
      {CUES.filter(([, , g]) => g > 0).map(([t, f, g], i) => (
        <SoundAt key={`${i}-${f}`} src={E(f)} at={t} volume={g * FX} duck={fxDuck} name={f} />
      ))}
    </>
  );
};
