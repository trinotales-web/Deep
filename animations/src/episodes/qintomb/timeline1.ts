import type { Cut } from "./script";
import * as A from "./p1a";
import * as B from "./p1b";

// Part 1 cut list (seconds on public/vo/qin-tomb-1.voice.m4a), in the breaths
// between phrases (see public/captions/qin-tomb-1.json).
export const CUTS1: Cut[] = [
  { id: "a01", at: 0, into: "cut", C: A.AutumnShot },
  { id: "a02", at: 2.75, into: "cut", C: A.UnderHillShot },
  { id: "a03", at: 6.15, into: "cut", C: A.SilverRiversShot },
  { id: "a04", at: 9.45, into: "cut", C: A.StarsShot },
  { id: "a05", at: 12.25, into: "cut", C: A.CrossbowsShot },
  { id: "a06", at: 16.45, into: "cut", C: A.TrapPlanShot },
  { id: "a07", at: 18.05, into: "cut", C: A.BuildTrapShot },
  { id: "a08", at: 19.45, into: "cut", C: A.FuneralShot },
  { id: "a09", at: 22.55, into: "cut", C: A.SecretProblemShot },
  { id: "a10", at: 25.5, into: "cut", C: A.DecidingShot },
  { id: "b01", at: 29.05, into: "slide-left", C: A.WhyWorldShot },
  { id: "b02", at: 32.65, into: "cut", C: A.StayForeverShot },
  { id: "b03", at: 35.55, into: "slide-left", C: A.TeaserPillarShot },
  { id: "b04", at: 38.95, into: "slide-left", C: A.TeaserIslandShot },
  { id: "b05", at: 42.6, into: "slide-left", C: A.TeaserFishShot },
  { id: "b06", at: 45.9, into: "slide-left", C: A.TeaserArmyShot },
  { id: "b07", at: 50.65, into: "cut", C: A.MeetManShot },
  { id: "b08", at: 53.25, into: "cut", C: A.TerrifiedShot },
  // the boy king, the seven kingdoms, the First Emperor
  { id: "c01", at: 55.15, into: "slide-left", C: B.YingZhengShot },
  { id: "c02", at: 59.05, into: "cut", C: B.NotOneCountryShot },
  { id: "c03", at: 61.45, into: "cut", C: B.SevenKingdomsShot },
  { id: "c04", at: 63.85, into: "cut", C: B.QinOneShot },
  { id: "c05", at: 65.5, into: "cut", C: B.DiggingStartsShot },
  { id: "c06", at: 69.15, into: "cut", C: B.GravesEarlyShot },
  { id: "c07", at: 72.0, into: "slide-left", C: B.ConquerShot },
  { id: "c08", at: 75.45, into: "cut", C: B.AllChinaShot },
  { id: "c09", at: 78.85, into: "cut", C: B.NewTitleShot },
  { id: "c10", at: 81.25, into: "cut", C: B.QinShiHuangShot },
  { id: "c11", at: 83.95, into: "cut", C: B.GenerationsShot },
  { id: "c12", at: 89.7, into: "cut", C: B.ChinaNameShot },
  // Jing Ke
  { id: "d01", at: 93.75, into: "slide-left", C: B.EnemiesShot },
  { id: "d02", at: 96.35, into: "fade", C: B.JingKeArrivesShot },
  { id: "d03", at: 101.9, into: "cut", C: B.TraitorBoxShot },
  { id: "d04", at: 103.65, into: "cut", C: B.RolledMapShot },
  { id: "d05", at: 106.0, into: "cut", C: B.OpensMapShot },
  { id: "d06", at: 107.55, into: "cut", C: B.DaggerRevealShot },
  { id: "d07", at: 109.95, into: "cut", C: B.StabShot },
  { id: "d08", at: 112.6, into: "cut", C: B.SleeveRipShot },
  { id: "d09", at: 115.0, into: "cut", C: B.TooLongShot },
  { id: "d10", at: 117.7, into: "cut", C: B.GuardsWaitShot },
  { id: "d11", at: 121.5, into: "cut", C: B.PillarChaseShot },
  { id: "d12", at: 126.25, into: "cut", C: B.DoctorThrowsShot },
  { id: "d13", at: 129.35, into: "cut", C: B.ShoutShot },
  { id: "d14", at: 132.2, into: "cut", C: B.CutDownShot },
];
