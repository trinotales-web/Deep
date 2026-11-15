import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Stage } from "../kit";
import {
  SpaceBack, MoonGlobe, LunarPoleMap, LunarSurface, CraterSection, SpaceRock, Comet, WaterMolecule, SnowPeak, Typhoon, IceFlake, MetalLump,
  Vikram, Luna25, NovaC, GrailProbe, Chandrayaan1, CentaurStage, ApolloLM, ChangELander, YutuRover, Hopper, Orion, SLS, PSLV, NationFlag,
  MoonBase, FuelPump, Tokamak, QuantumFridge, GasCanister, Harvester, Bullet, ImpactPlume, SolarMast, Planet,
} from "../kit/env";

/** Moon kit review sheets (dev only). */
export const MoonKit: React.FC<{ page?: number }> = ({ page = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0e22" }}>
      <Stage camera={{ zoom: 1 }} light={{ dir: [-0.6, 0.8] }} vignette={0.1}>
        {page < 2 || page === 5 ? <SpaceBack z={-1} /> : null}
        {page === 0 ? (
          <>
            <MoonGlobe r={240} x={-640} y={220} />
            <MoonGlobe r={240} x={-100} y={220} view={{ lon: 180, lat: -20 }} basin={1} basinTint={1} />
            <MoonGlobe r={240} x={440} y={220} view={{ lon: 0, lat: -90 }} ice={1} />
            <MoonGlobe r={200} x={-640} y={-300} gravity={1} />
            <MoonGlobe r={200} x={-140} y={-300} view={{ lon: 180, lat: -30 }} xray={1} mass={1} grid={1} />
            <MoonGlobe r={200} x={340} y={-300} view={{ lon: frame * 2, lat: 0 }} />
            <Planet kind="earth" r={140} x={760} y={-300} />
          </>
        ) : null}
        {page === 1 ? (
          <>
            <LunarPoleMap x={-480} y={0} ppd={22} w={900} h={1000} psr={1} ice={1} circles={[85, 80]} glowPeaks={1} />
            <LunarPoleMap x={480} y={0} pole="north" ppd={30} w={900} h={1000} iceCraters={1} circles={[85]} />
          </>
        ) : null}
        {page === 2 ? <LunarSurface horizon={60} earth={[700, 380, 90]} sun={[-1000, 120]} /> : null}
        {page === 3 ? (
          <>
            <CraterSection s={0.5} y={120} sun={[-1500, 60]} rays={1} ice={1} peaks={1} />
            <CraterSection s={0.35} y={-330} x={-420} sun={null} mass={1} dip={80} />
            <SnowPeak s={0.3} x={500} y={-480} />
            <SpaceRock x={780} y={-200} size={80} />
          </>
        ) : null}
        {page === 4 ? (
          <>
            <LunarSurface horizon={-200} sun={null} rocks={0} craters={0} ridges={0} />
            <Vikram x={-760} y={-480} s={0.6} thrust={0.6} dust={0.5} />
            <Luna25 x={-370} y={-480} s={0.6} />
            <NovaC x={0} y={-480} s={0.6} />
            <NovaC x={260} y={-480} s={0.6} variant="athena" rot={1.3} />
            <ApolloLM x={620} y={-480} s={0.6} />
            <ChangELander x={-620} y={0} s={0.55} ascender lift={40} thrust={0.6} />
            <YutuRover x={-260} y={0} s={0.7} />
            <Hopper x={-60} y={0} s={0.8} thrust={0.5} />
            <MoonBase x={480} y={0} s={0.35} flag="china" />
            <NationFlag kind="india" x={-860} y={160} w={120} pole={220} />
            <NationFlag kind="china" x={-560} y={240} w={120} pole={160} />
            <NationFlag kind="russia" x={-260} y={240} w={120} pole={160} />
            <NationFlag kind="usa" x={0} y={240} w={120} pole={160} />
          </>
        ) : null}
        {page === 5 ? (
          <>
            <GrailProbe x={-700} y={330} s={0.8} />
            <Chandrayaan1 x={-300} y={260} s={0.6} beam={1} />
            <CentaurStage x={180} y={150} s={0.45} sep={60} />
            <Orion x={560} y={250} s={0.6} />
            <SLS x={-820} y={-520} h={800} thrust={0.5} />
            <PSLV x={-560} y={-520} h={700} thrust={0.5} />
            <Comet x={0} y={-250} size={50} tail={400} rot={0.3} />
            <WaterMolecule x={-260} y={-250} size={40} />
            <IceFlake x={-120} y={-250} size={30} />
            <MetalLump x={280} y={-280} w={200} h={110} />
            <Typhoon x={600} y={-250} size={160} />
            <ImpactPlume x={-320} y={-520} t={0.4} size={0.4} water={1} />
          </>
        ) : null}
        {page === 6 ? (
          <>
            <FuelPump x={-760} y={-300} s={0.8} />
            <Tokamak x={-200} y={100} s={0.6} />
            <QuantumFridge x={420} y={420} s={0.6} cold={1} />
            <GasCanister x={760} y={-300} s={0.8} />
            <Harvester x={-200} y={-420} s={0.6} heat={1} />
            <Bullet x={300} y={-380} s={0.8} />
            <SolarMast x={-860} y={100} s={0.5} />
          </>
        ) : null}
      </Stage>
    </AbsoluteFill>
  );
};
