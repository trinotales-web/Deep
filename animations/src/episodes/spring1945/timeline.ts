import type React from "react";
import type { ShotProps } from "../../kit";
import * as A from "./actA";
import * as B from "./actB";

export type Into = "cut" | "slide-left" | "slide-up" | "fade";
export type Cut = { id: string; at: number; into: Into; C: React.FC<ShotProps> };

// Cut times (seconds) on the edited narration (public/vo/spring-1945.voice.m4a),
// placed in the breaths between phrases (see public/captions/spring-1945.json).
export const CUTS: Cut[] = [
  // A · cold open
  { id: "a01", at: 0, into: "cut", C: A.SpringShot },
  { id: "a02", at: 2.15, into: "cut", C: A.PilotStandShot },
  { id: "a03", at: 6.1, into: "cut", C: A.BombLoadShot },
  { id: "a04", at: 9.2, into: "cut", C: A.WarshipShot },
  { id: "a05", at: 10.8, into: "cut", C: A.OneWayShot },
  { id: "a06", at: 12.55, into: "cut", C: A.DoctorArrivesShot },
  { id: "a07", at: 14.4, into: "cut", C: A.InjectionCloseShot },
  { id: "a08", at: 16.0, into: "cut", C: A.WakeUpShot },
  { id: "a09", at: 18.0, into: "cut", C: A.NeitherKnowsShot },
  { id: "a10", at: 19.95, into: "cut", C: A.ItsMethShot },
  // B · the question + teasers
  { id: "b01", at: 21.2, into: "slide-left", C: A.DruggedShot },
  { id: "b02", at: 25.5, into: "cut", C: A.StrangerShot },
  { id: "b03", at: 27.55, into: "slide-left", C: A.TeaserChocolateShot },
  { id: "b04", at: 30.7, into: "slide-left", C: A.TeaserDoctorShot },
  { id: "b05", at: 32.9, into: "slide-left", C: A.TeaserOutlivedShot },
  { id: "b06", at: 34.9, into: "cut", C: A.DrugItselfShot },
  { id: "b07", at: 37.0, into: "cut", C: A.StartsInJapanShot },
  // C · the drug
  { id: "c01", at: 38.95, into: "fade", C: A.ChemistShot },
  { id: "c02", at: 42.05, into: "cut", C: A.EphedraShot },
  { id: "c03", at: 43.95, into: "cut", C: A.NewChemicalShot },
  { id: "c04", at: 45.25, into: "cut", C: A.NobodyCaresShot },
  { id: "c05", at: 46.9, into: "fade", C: A.PharmacyShot },
  { id: "c06", at: 51.8, into: "cut", C: A.HiroponShot },
  { id: "c07", at: 53.5, into: "cut", C: A.GreekShot },
  { id: "c08", at: 56.55, into: "slide-left", C: A.AdPosterShot },
  { id: "c09", at: 59.75, into: "cut", C: A.NotStreetDrugShot },
  { id: "c10", at: 63.45, into: "cut", C: A.CoffeeShot },
  { id: "c11", at: 66.75, into: "slide-left", C: A.ArmyNavyShot },
  { id: "c12", at: 68.7, into: "cut", C: A.PilotsNightShot },
  { id: "c13", at: 70.5, into: "cut", C: A.GuardShot },
  { id: "c14", at: 72.1, into: "cut", C: A.FactoryShot },
  // D · the tokko
  { id: "d01", at: 74.85, into: "fade", C: B.EndOf1944Shot },
  { id: "d02", at: 77.55, into: "cut", C: B.LosingShot },
  { id: "d03", at: 79.45, into: "cut", C: B.DesperateShot },
  { id: "d04", at: 82.2, into: "slide-left", C: B.PlanDiagramShot },
  { id: "d05", at: 86.1, into: "cut", C: B.KamikazeShot },
  { id: "d06", at: 90.45, into: "cut", C: B.TokkoShot },
  { id: "d07", at: 94.45, into: "cut", C: B.TeenagersShot },
  { id: "d08", at: 97.8, into: "cut", C: B.BarelyFlyShot },
  { id: "d09", at: 99.9, into: "slide-left", C: B.FlightTimeShot },
  { id: "d10", at: 104.7, into: "cut", C: B.SleepyPilotShot },
  { id: "d11", at: 108.65, into: "cut", C: B.KeepSharpShot },
  // E · clue 1: the chocolate
  { id: "e01", at: 110.25, into: "slide-left", C: B.ClueOneShot },
  { id: "e02", at: 113.75, into: "cut", C: B.UmedaNameShot },
  { id: "e03", at: 115.8, into: "cut", C: B.SchoolShot },
  { id: "e04", at: 121.35, into: "cut", C: B.NoLessonsShot },
  { id: "e05", at: 123.55, into: "cut", C: B.FoodFactoryShot },
  { id: "e06", at: 126.5, into: "cut", C: B.WrapChocolateShot },
  { id: "e07", at: 128.25, into: "cut", C: B.FifteenCmShot },
  { id: "e08", at: 131.62, into: "cut", C: B.StampShot },
  { id: "e09", at: 135.5, into: "slide-left", C: B.OlderGirlsShot },
  { id: "e10", at: 138.62, into: "cut", C: B.HotRushShot },
  { id: "e11", at: 142.1, into: "slide-left", C: B.FatherShot },
  { id: "e12", at: 145.92, into: "cut", C: B.TeachersShot },
  { id: "e13", at: 148.62, into: "cut", C: B.DarkerShot },
  { id: "e14", at: 150.72, into: "fade", C: B.BeforeTheyDieShot },
  { id: "e15", at: 154.6, into: "cut", C: B.StrangePartShot },
  { id: "e16", at: 156.2, into: "cut", C: B.NoRecordShot },
  { id: "e17", at: 158.85, into: "cut", C: B.ResearcherShot },
  { id: "e18", at: 161.15, into: "cut", C: B.SilenceShot },
];
