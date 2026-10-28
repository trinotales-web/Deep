import type React from "react";
import type { ShotProps } from "../../kit";
import * as A from "./actA";
import * as B from "./actB";

export type Into = "cut" | "slide-left" | "slide-up" | "fade";
export type Cut = { id: string; at: number; into: Into; C: React.FC<ShotProps> };

// Cut times (seconds) on the edited narration (public/vo/fire-arrows.voice.m4a),
// placed in the breaths between phrases (see public/captions/fire-arrows.json).
export const CUTS: Cut[] = [
  // cold open
  { id: "a01", at: 0, into: "cut", C: A.NightOpenShot },
  { id: "a02", at: 2.75, into: "cut", C: A.ArmyBelowShot },
  { id: "a03", at: 5.12, into: "cut", C: A.CaptainWalkShot },
  { id: "a04", at: 8.2, into: "cut", C: A.ShoutShot },
  { id: "a05", at: 10.5, into: "cut", C: A.DipShot },
  { id: "a06", at: 13.7, into: "cut", C: A.DrawShot },
  { id: "a07", at: 17.65, into: "cut", C: A.ReleaseShot },
  { id: "a08", at: 18.75, into: "cut", C: A.CometShot },
  { id: "a09", at: 22.05, into: "cut", C: A.GoesOutShot },
  { id: "a10", at: 24.3, into: "cut", C: A.DropShot },
  // movies vs history
  { id: "b01", at: 28.85, into: "fade", C: A.MovieShot },
  { id: "b02", at: 33.0, into: "cut", C: A.MovieSiegeShot },
  { id: "b03", at: 34.1, into: "cut", C: A.MovieBattleShot },
  { id: "b04", at: 35.3, into: "slide-left", C: A.RealHistoryShot },
  { id: "b05", at: 39.2, into: "cut", C: A.SoWhyShot },
  { id: "b06", at: 40.7, into: "cut", C: A.HundredMetersShot },
  { id: "b07", at: 44.2, into: "cut", C: A.EveryTimeShot },
  // teaser
  { id: "c01", at: 46.05, into: "slide-left", C: A.TeaserRomanShot },
  { id: "c02", at: 50.0, into: "cut", C: A.TeaserWaterShot },
  { id: "c03", at: 52.6, into: "cut", C: A.TeaserVikingShot },
  { id: "c04", at: 54.7, into: "cut", C: A.TeaserAliveShot },
  { id: "c05", at: 56.8, into: "cut", C: A.TeaserSpaceShot },
  // problem 1: the fire hates flying
  { id: "d01", at: 59.15, into: "slide-left", C: B.P1TitleShot },
  { id: "d02", at: 62.55, into: "cut", C: B.CarRaceShot },
  { id: "d03", at: 66.05, into: "cut", C: B.CandleWindowShot },
  { id: "d04", at: 69.85, into: "cut", C: B.BentFlameShot },
  { id: "d05", at: 71.45, into: "cut", C: B.BlowOutShot },
  { id: "d06", at: 73.25, into: "cut", C: B.RomansKnewShot },
  { id: "d07", at: 74.65, into: "cut", C: B.AmmianusShot },
  { id: "d08", at: 81.6, into: "cut", C: B.DescribeShot },
  { id: "d09", at: 83.85, into: "cut", C: B.HeadDiagramShot },
  { id: "d10", at: 88.25, into: "cut", C: B.OneRuleShot },
  { id: "d11", at: 89.7, into: "cut", C: B.SlowShotShot },
  { id: "d12", at: 92.65, into: "cut", C: B.HardShotShot },
  { id: "d13", at: 95.45, into: "cut", C: B.ThinkShot },
  { id: "d14", at: 96.9, into: "cut", C: B.RangeShot },
  { id: "d15", at: 101.8, into: "cut", C: B.WalkCloserShot },
  { id: "d16", at: 106.6, into: "cut", C: B.WobbleShot },
  // problem 2: lighting the thing
  { id: "e01", at: 111.4, into: "slide-left", C: B.P2TitleShot },
  { id: "e02", at: 113.95, into: "cut", C: B.FireNextToYouShot },
  { id: "e03", at: 115.75, into: "cut", C: B.ArcherLineShot },
  { id: "e04", at: 120.55, into: "cut", C: B.FlammablesShot },
  { id: "e05", at: 124.65, into: "cut", C: B.WindShot },
  { id: "e06", at: 125.6, into: "cut", C: B.SafeRightShot },
  { id: "e07", at: 127.3, into: "cut", C: B.SlowShot },
  { id: "e08", at: 128.75, into: "cut", C: B.TenPerMinuteShot },
  { id: "e09", at: 131.55, into: "cut", C: B.DipWaitShot },
  { id: "e10", at: 135.25, into: "cut", C: B.HandFlameShot },
  { id: "e11", at: 138.65, into: "cut", C: B.TradeoffShot },
  { id: "e12", at: 142.6, into: "cut", C: B.RainShot },
  // problem 3: what are you shooting at?
  { id: "f01", at: 144.55, into: "slide-left", C: B.P3TitleShot },
  { id: "f02", at: 148.9, into: "cut", C: B.MovieBurnShot },
  { id: "f03", at: 151.35, into: "cut", C: B.RagFallsShot },
  { id: "f04", at: 156.65, into: "cut", C: B.RagPointShot },
  { id: "f05", at: 158.8, into: "cut", C: B.PointVsRagShot },
  { id: "f06", at: 163.7, into: "cut", C: B.WorseArrowShot },
  { id: "f07", at: 167.6, into: "cut", C: B.WoodenWallsShot },
  { id: "f08", at: 169.6, into: "cut", C: B.CampfireShot },
  { id: "f09", at: 171.6, into: "cut", C: B.MatchLogShot },
  { id: "f10", at: 173.75, into: "cut", C: B.KindlingShot },
  { id: "f11", at: 176.4, into: "cut", C: B.BigFireShot },
  { id: "f12", at: 179.5, into: "cut", C: B.BlackMarkShot },
  { id: "f13", at: 183.5, into: "cut", C: B.DryThinShot },
  { id: "f14", at: 189.4, into: "cut", C: B.RoofShot },
  { id: "f15", at: 190.6, into: "cut", C: B.TentShot },
  { id: "f16", at: 191.4, into: "cut", C: B.SailShot },
  { id: "f17", at: 192.3, into: "cut", C: B.HayShot },
  { id: "f18", at: 193.65, into: "cut", C: B.SiegesShot },
];
