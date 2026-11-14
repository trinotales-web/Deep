import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Stage, X } from "../kit";
import {
  Sky, Sea, BlueWhale, ProtoWhale, Hippo, Dolphin, SpermWhale, Squid, Sauropod, Krill, KrillSwarm, WhaleTag, Underwater, WaterFront, SurfaceFoam, ResearchBoat, TagPole, WhaleCatcher,
  Harpoon, BaleenRow, WhaleSkull, DimArrow, WhaleHeart, HeartTrace, BalanceScale, Burger, PoopCloud, PhytoBloom, Gauge, Thermometer, CrownProp, Newspaper, Sieve, CourtSide, WhaleTally,
  PolarMap, PolarPin, polarXY, Mountains,
} from "../kit/env";
import { Character, poses } from "../kit/character";

/** Blue whale kit review sheets (dev only). */
export const WhaleKit: React.FC<{ page?: number }> = ({ page = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#cfe6f2" }}>
      <Stage camera={{ zoom: 1 }} light={{ dir: [-0.6, 0.8] }} vignette={0.1}>
        <Sky w={4000} h={3000} top="#7fc0e6" bottom="#dff0f8" z={-40} />
        {page === 0 ? (
          <>
            <BlueWhale x={-420} y={300} len={900} swim={frame} tag blow={0.5} />
            <BlueWhale x={480} y={300} len={900} mouth={0.5} swim={frame} eye="wide" />
            <BlueWhale x={-200} y={-200} len={1400} mouth={1} krill={1} />
            <BlueWhale x={700} y={-330} len={420} calf eye="happy" swim={frame} />
          </>
        ) : null}
        {page === 1 ? (
          <>
            <ProtoWhale x={-700} y={260} k={0} walk={frame} />
            <ProtoWhale x={-50} y={260} k={0.35} walk={frame} />
            <ProtoWhale x={650} y={260} k={0.6} swim={frame} />
            <ProtoWhale x={-500} y={-250} k={1} swim={frame} showNostril />
            <ProtoWhale x={420} y={-250} k={1} fat={1.9} eye="sad" />
          </>
        ) : null}
        {page === 2 ? (
          <>
            <Hippo x={-600} y={250} s={0.9} />
            <Dolphin x={300} y={330} s={1} swim={frame} />
            <SpermWhale x={-380} y={-220} len={800} mouth={0.4} swim={frame} />
            <Squid x={560} y={-80} s={0.9} swim={frame} />
            <Sauropod x={500} y={-260} s={0.3} />
          </>
        ) : null}
        {page === 3 ? (
          <>
            <Krill x={-600} y={250} s={3} swim={frame} />
            <Krill x={100} y={300} s={1.5} swim={frame} glow={1} />
            <KrillSwarm x={300} y={-200} w={1000} h={500} n={260} frame={frame} />
            <WhaleTag x={-600} y={-200} s={3} glow={0.6} />
          </>
        ) : null}
        {page === 4 ? (
          <>
            <Underwater surfaceY={420} depth={0.25} />
            <BlueWhale x={-200} y={0} len={1300} swim={frame} z={1} />
            <KrillSwarm x={650} y={-250} w={600} h={300} n={160} frame={frame} z={2} />
          </>
        ) : null}
        {page === 5 ? (
          <>
            <Sky w={4000} h={3000} y={900} top="#7fc0e6" bottom="#e8f4f8" z={-30} />
            <Mountains w={4000} y={-20} color="#9ab88a" outline={4} peaks={[[-1500, 200], [-700, 300], [100, 180], [900, 260]]} z={-25} />
            <Sea w={4000} h={1600} y={-20} z={-20} />
            <ResearchBoat x={-450} y={-150} bob={frame} z={-5}>
              <Character outfit={{ top: "#e2443a", bottom: "#2f3a52", boots: "#2a2228" }} hair="short" x={-120} y={60} s={0.7} pose={poses.idle(frame, 1)} expression={{ eyes: "open", mouth: "smile" }} />
              <Character outfit={{ top: "#f2c23a", bottom: "#2f3a52", boots: "#2a2228" }} hair="bob" hat="cap" x={170} y={60} s={0.7} pose={poses.point(frame)} holdF={<TagPole len={700} rot={0.5} />} expression={{ eyes: "open", mouth: "open" }} />
            </ResearchBoat>
            <BlueWhale x={500} y={-300} len={1200} z={-8} />
            <WaterFront y={-230} z={-6} />
            <SurfaceFoam x={500} y={-232} rx={400} z={-5.5} />
            <WhaleCatcher x={-1100} y={300} s={0.5} bob={frame} fire={0.2} z={-15} />
          </>
        ) : null}
        {page === 6 ? (
          <>
            <BaleenRow x={-650} y={420} w={500} h={160} sway={frame * 0.1} />
            <WhaleSkull x={0} y={360} w={460} measure={1} />
            <WhaleHeart x={620} y={300} size={0.55} beat={0.5} />
            <HeartTrace x={-600} y={60} w={600} h={120} bpm={37} t={frame / 30 + 3} />
            <BalanceScale x={0} y={-60} s={0.35} tilt={0.6} left={<Burger size={0.5} />} right={<CrownProp w={120} />} />
            <Burger x={450} y={20} size={0.7} />
            <PoopCloud x={780} y={-20} k={0.5} s={0.6} />
            <PhytoBloom x={-600} y={-250} w={600} h={200} k={0.8} />
            <Gauge x={-100} y={-350} r={110} level={0.25} />
            <Thermometer x={160} y={-330} h={260} level={0.7} />
            <Newspaper x={420} y={-330} w={220} />
            <Sieve x={-380} y={-430} r={90} />
            <WhaleTally x={760} y={-380} cols={8} rows={4} gap={40} alive={0.3} />
            <DimArrow x={-650} y={-430} len={300} />
            <Harpoon x={600} y={-200} />
          </>
        ) : null}
        {page === 7 ? (
          <>
            <PolarMap x={-480} pole="south" ppd={9} w={900} h={1080} seaIceLat={-62} circles={[-60]}>
              <PolarPin x={polarXY(-60, -62, "south", 9)[0]} y={polarXY(-60, -62, "south", 9)[1]} />
            </PolarMap>
            <PolarMap x={480} pole="north" ppd={7} w={900} h={1080} sheets={1} rot={0} />
          </>
        ) : null}
      </Stage>
    </AbsoluteFill>
  );
};
