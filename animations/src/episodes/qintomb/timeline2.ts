import type { Cut } from "./script";
import * as H from "./p2a";

// Part 2 cut list (seconds on public/vo/qin-tomb-2.voice.m4a), in the breaths
// between phrases (see public/captions/qin-tomb-2.json).
export const CUTS2: Cut[] = [
  // the death and the cover-up
  { id: "h01", at: 0, into: "cut", C: H.EmperorDiesShot },
  { id: "h02", at: 2.2, into: "cut", C: H.MustCloseShot },
  { id: "h03", at: 4.45, into: "slide-left", C: H.LastTripShot },
  { id: "h04", at: 9.65, into: "cut", C: H.FortyNineShot },
  { id: "h05", at: 10.95, into: "cut", C: H.NotFiftyShot },
  { id: "h06", at: 14.35, into: "slide-left", C: H.AdvisersPanicShot },
  { id: "h07", at: 16.35, into: "cut", C: H.EmpireCracksShot },
  { id: "h08", at: 19.15, into: "cut", C: H.KeepSecretShot },
  { id: "h09", at: 20.55, into: "slide-left", C: H.MealsShot },
  { id: "h10", at: 25.45, into: "cut", C: H.ReportsShot },
  { id: "h11", at: 29.85, into: "cut", C: H.SummerSmellShot },
  { id: "h12", at: 32.95, into: "cut", C: H.FishCoverShot },
  { id: "h13", at: 36.75, into: "slide-left", C: H.FakeLetterShot },
  { id: "h14", at: 40.2, into: "cut", C: H.FusuReadsShot },
  { id: "h15", at: 42.95, into: "cut", C: H.HeDoesShot },
  { id: "h16", at: 44.55, into: "slide-left", C: H.HuhaiShot },
  // the funeral and the sealing
  { id: "i01", at: 48.55, into: "fade", C: H.FuneralBeginsShot },
  { id: "i02", at: 50.25, into: "cut", C: H.WivesOrderShot },
  { id: "i03", at: 54.75, into: "cut", C: H.ManyDieShot },
  { id: "i04", at: 57.7, into: "cut", C: H.WarnsShot },
  { id: "i05", at: 60.45, into: "cut", C: H.GraveRobbersShot },
  { id: "i06", at: 62.65, into: "slide-left", C: H.InnerGateShot },
  { id: "i07", at: 68.3, into: "cut", C: H.RememberYouShot },
  { id: "i08", at: 70.65, into: "cut", C: H.SoundYouHearShot },
  { id: "i09", at: 72.15, into: "cut", C: H.OuterGateShot },
  { id: "i10", at: 74.05, into: "cut", C: H.PlantTreesShot },
  { id: "i11", at: 77.45, into: "cut", C: H.NotOneShot },
  { id: "i12", at: 78.85, into: "fade", C: H.SupposedToLastShot },
  { id: "i13", at: 82.75, into: "cut", C: H.GoneShot },
];
