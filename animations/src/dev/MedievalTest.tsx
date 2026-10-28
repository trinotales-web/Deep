import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Stage, X, Bow, RomanFireHead, RocketArrow, Falarica, RagBall, HandTorch } from "../kit";
import { Character, poses } from "../kit/character";
import {
  Sky, Moon, Stars, Battlement, Tower, TorchArmy, CoalPot, Car, Road, Candle, Longship, Hwacha, Rocket, StrawHut, HayStack,
  SiegeTower, BatteringRam, Ground, Sea,
} from "../kit/env";

// 16:9 asset check sheet for the Fire Arrows episode.
export const MedievalTest: React.FC = () => {
  const frame = useCurrentFrame();
  const hats = ["kettle", "viking", "turban", "kabuto", "song", "joseon", "astronaut"] as const;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 0.5 }} light={{ dir: [-0.8, 0.6] }}>
        <Sky w={4000} h={1100} y={550} top="#0b1030" bottom="#2b3a63" />
        <Stars w={3800} h={1000} y={600} count={60} />
        <Moon x={-1500} y={850} />
        <TorchArmy y={-60} x={-1000} w={1400} rows={2} n={10} s={0.6} />
        <Character x={-1300} y={-60} s={1} outfit={{ top: "#7a6a52", quilt: "#5a4a3a", hem: 30 }} hat="kettle" expression={{ eyes: "wide", mouth: "o" }} pose={{ armF: [1.5, 0.05], armB: [1.45, 0.9] }} holdF={<Bow rot={-1.57} draw={1} arrow fire s={1.1} />} />
        <Battlement x={-1100} y={-200} w={1000} h={330} z={2} />
        <Tower x={-300} y={-200} h={620} z={1} />
        <Character x={-500} y={60} s={0.9} outfit={{ top: "#7a2a2a", quilt: "#5a1a1a", hem: 30 }} hat="kettle" hatAccent="#c0362c" expression={{ eyes: "angry", mouth: "shout" }} pose={poses.holdOut} holdF={<CoalPot s={0.6} y={-20} />} z={3} />
        <Ground w={4000} h={1200} y={-200} color="#7a8a52" z={-5} />
        <Road y={-700} w={4000} h={200} z={4} />
        <Car x={-600} y={-760} s={0.8} z={5} />
        <Candle x={-200} y={-560} s={0.8} wind={0.6} z={6} />
        <RomanFireHead x={300} y={-300} s={0.6} lit={1} z={6} />
        <Falarica x={900} y={-300} s={0.6} lit={1} z={6} />
        <RagBall x={1500} y={-300} z={6} />
        <RocketArrow x={1300} y={-500} burning={1} z={6} />
        <Sea w={4000} h={600} y={-760} z={7} />
        <Longship x={300} y={-820} len={900} burn={0.5} z={8} />
        <Hwacha x={1300} y={-1000} s={0.9} z={9} />
        <Rocket x={1800} y={-1000} h={700} thrust={1} z={9} />
        <StrawHut x={600} y={0} burn={0.7} z={2} />
        <HayStack x={1000} y={0} burn={0} z={2} />
        <SiegeTower x={1500} y={0} h={600} hides z={2} />
        <BatteringRam x={200} y={300} hides s={0.7} z={1} />
        {hats.map((h, i) => (
          <Character key={h} x={-1700 + i * 260} y={-1000} s={0.7} outfit={{ top: "#8a7a5a", hem: 30 }} hat={h} beard={h === "viking" ? "full" : null} expression={{ eyes: "open", mouth: "smile" }} pose={poses.idle(frame, i)} z={10} holdF={h === "turban" ? <HandTorch s={0.8} /> : undefined} />
        ))}
      </Stage>
    </AbsoluteFill>
  );
};
