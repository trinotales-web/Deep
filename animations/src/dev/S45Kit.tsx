import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Stage, X } from "../kit";
import { Character, poses } from "../kit/character";
import { Sky, Sea, ZeroFighter, ZeroTop, Warship, ShipTop, Tracers, FlakBurst, SplashColumn, JapanMap, Ribbon } from "../kit/env";
import { PILOT, DOCTOR, UMEDA, GENERAL, NAVY_OFFICER } from "../episodes/spring1945/cast";

/** Spring 1945 kit review sheets (dev only). */
export const S45Kit: React.FC<{ page?: number }> = ({ page = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#cfe6f2" }}>
      <Stage camera={{ zoom: 1 }} light={{ dir: [-0.6, 0.8] }} vignette={0.1}>
        <Sky w={4000} h={3000} top="#8ec9ee" bottom="#e8f4f8" z={-40} />
        {page === 0 ? (
          <>
            <Character {...PILOT(0)} x={-700} y={-500} s={1.3} look={0.5} expression={{ eyes: "open", mouth: "flat" }} pose={poses.idle(frame)} />
            <Character {...GENERAL(0)} x={-300} y={-500} s={1.3} look={0.5} expression={{ eyes: "open", mouth: "flat" }} pose={poses.idle(frame)} />
            <Character {...NAVY_OFFICER(1)} x={100} y={-500} s={1.3} look={0.5} expression={{ eyes: "open", mouth: "flat" }} pose={poses.idle(frame)} />
            <Character {...DOCTOR} x={450} y={-500} s={1.3} facing={-1} look={0.5} expression={{ eyes: "open", mouth: "flat" }} pose={poses.idle(frame)} />
            <Character {...UMEDA} x={780} y={-500} s={1.3} facing={-1} look={0.5} expression={{ eyes: "open", mouth: "flat" }} pose={poses.idle(frame)} />
          </>
        ) : null}
        {page === 1 ? (
          <>
            <ZeroFighter x={-560} y={300} s={0.75} bomb gear spin={0} />
            <ZeroFighter x={-560} y={-10} s={0.75} bomb={false} gear={false} spin={1} trail={0.8} rot={-0.5} />
            <ZeroTop x={-560} y={-380} s={0.45} />
            <Sea w={2400} h={700} y={-60} x={500} color="#3f86b8" z={-30} />
            <Warship kind="destroyer" x={420} y={330} len={800} />
            <Warship kind="battleship" x={420} y={20} len={900} />
            <Warship kind="carrier" x={420} y={-330} len={900} hit={0.7} />
            <ShipTop x={0} y={200} len={400} />
            <Tracers x={800} y={-200} angle={2.0} n={8} />
            <FlakBurst x={0} y={420} t={0.4} />
            <FlakBurst x={150} y={420} t={0.1} seed={4} />
            <SplashColumn x={-120} y={-480} t={0.4} h={400} />
          </>
        ) : null}
        {page === 2 ? (
          <>
            <JapanMap x={-200} y={-80} ppd={44} route={1} dots={["kushira", "okinawa", "osaka", "tokyo"]} />
            <Ribbon x={420} y={300} w={480} />
          </>
        ) : null}
      </Stage>
    </AbsoluteFill>
  );
};
