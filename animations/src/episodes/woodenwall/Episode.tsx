import React from "react";
import { AbsoluteFill, staticFile, type CalculateMetadataFunction } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import type { Caption } from "@remotion/captions";
import { Audio } from "@remotion/media";
import { StyledCaptions } from "../../kit/captions";
import { shotTimeline, TRANSITION, markHighlights } from "./script";
import type { ShotProps } from "./common";
import * as A1 from "./act1";
import * as A2 from "./act2";
import * as A3 from "./act3";
import * as A4 from "./act4";
import * as A5 from "./act5";
import { WoodenWallSound } from "./sound";

const SHOTS: Record<string, React.FC<ShotProps>> = {
  hook: A1.HookShot,
  killed: A1.KilledShot,
  army: A1.ArmyShot,
  xerxes: A1.XerxesShot,
  delphi: A1.DelphiShot,
  strange: A1.StrangeShot,
  prophecy: A1.ProphecyShot,
  question: A1.QuestionShot,
  ships: A2.ShipsShot,
  boarding: A2.BoardingShot,
  empty: A2.EmptyShot,
  stay: A2.StayShot,
  literal: A2.LiteralShot,
  climb: A2.ClimbShot,
  build: A2.BuildShot,
  areopagus: A2.AreopagusShot,
  now: A3.NowShot,
  physics: A3.PhysicsShot,
  drywall: A3.DryWallShot,
  wrap: A3.WrapShot,
  light: A3.LightShot,
  shoot: A3.ShootShot,
  burns: A3.BurnsShot,
  giveup: A3.GiveUpShot,
  rocks: A3.RocksShot,
  cliff: A4.CliffShot,
  unguarded: A4.UnguardedShot,
  see: A4.SeeShot,
  jump: A4.JumpShot,
  temple: A4.TempleRunShot,
  fallen: A4.FallenShot,
  remember: A5.RememberShot,
  map: A5.MapShot,
  ram: A5.RamShot,
  watch: A5.WatchShot,
  right: A5.RightShot,
  saved: A5.SavedShot,
  theirs: A5.TheirsShot,
};

const Missing: React.FC<ShotProps> = () => <AbsoluteFill style={{ backgroundColor: "#222" }} />;

export const WoodenWallVisuals: React.FC = () => {
  const timeline = shotTimeline();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <TransitionSeries>
        {timeline.flatMap((shot, i) => {
          const C = SHOTS[shot.id] ?? Missing;
          const seq = (
            <TransitionSeries.Sequence key={shot.id} durationInFrames={shot.dur} premountFor={20} name={shot.id}>
              <C dur={shot.dur} start={shot.from} />
            </TransitionSeries.Sequence>
          );
          if (i === 0 || shot.into === "cut") return [seq];
          const presentation =
            shot.into === "fade" ? fade() : slide({ direction: shot.into === "slide-up" ? "from-bottom" : "from-right" });
          return [
            <TransitionSeries.Transition key={`t${i}`} presentation={presentation} timing={linearTiming({ durationInFrames: TRANSITION })} />,
            seq,
          ];
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};

export type WoodenWallProps = {
  voiceover: string;
  captionsFile: string;
  captions?: Caption[] | null;
};

export const calculateWoodenWallMetadata: CalculateMetadataFunction<WoodenWallProps> = async ({ props }) => {
  const res = await fetch(staticFile(props.captionsFile));
  const captions = markHighlights((await res.json()) as Caption[]);
  return { props: { ...props, captions } };
};

export const WoodenWall: React.FC<WoodenWallProps> = ({ voiceover, captions }) => {
  const words = captions ?? [];
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <WoodenWallVisuals />
      <StyledCaptions captions={words} maxWords={3} />
      <WoodenWallSound captions={words} />
      <Audio src={staticFile(voiceover)} />
    </AbsoluteFill>
  );
};

/** Sound only (voiceover + mix), for quick mix checks. */
export const WoodenWallAudio: React.FC<WoodenWallProps & { withVoice?: boolean }> = ({ voiceover, captions, withVoice = true }) => (
  <AbsoluteFill>
    <WoodenWallSound captions={captions ?? []} />
    {withVoice ? <Audio src={staticFile(voiceover)} /> : null}
  </AbsoluteFill>
);
