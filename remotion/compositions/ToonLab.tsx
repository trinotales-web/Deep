import { AbsoluteFill, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Character, type Outfit } from "../toon/Character";
import { Rifle } from "../toon/props";

export const SOLDIER: Outfit = {
  top: "#a39a62",
  topPattern: "#8c8452",
  bottom: "#948c5a",
  boots: "#6b4a33",
  belt: "#6b4a33",
  hat: "fieldcap",
  hatColor: "#a8a067",
};

export const COMMANDER: Outfit = {
  top: "#7b766d",
  bottom: "#6a655d",
  boots: "#3d302a",
  tie: "#8c3b32",
  hat: "fedora",
  hatColor: "#8a6f52",
};

/** Turnaround sheet for checking the toon look of characters and props. */
export const ToonLab: React.FC = () => {
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#e9d9b5" }}>
      <ThreeCanvas width={width} height={height} flat camera={{ position: [0, 1.5, 9], fov: 30 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 6, 5]} intensity={1} />
        <Character
          outfit={SOLDIER}
          face={{ expression: "suspicious" }}
          position={[-0.85, 0, 0]}
          pose={{ headYaw: 0.25, lArm: [0.9, 0.2, 1.0], rArm: [0.6, 0.1, 1.2] }}
          chest={<Rifle position={[0, 0.45, 0.33]} rotation={[0, 0, 0.85]} scale={0.9} />}
        />
        <Character
          outfit={COMMANDER}
          face={{ expression: "neutral", mustache: "#4a3a30", glasses: true, freckles: false }}
          position={[0.85, 0, 0]}
          pose={{ headYaw: -0.25, rArm: [0.35, 2.0, 0, -1.35] }}
        />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
