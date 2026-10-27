import { AbsoluteFill, staticFile, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Audio } from "@remotion/media";
import { useGsapTimeline } from "../lib/useGsapTimeline";
import { Captions } from "../components/Captions";

export type HeroSceneProps = {
  captionsSrc: string;
  /** Path inside `public/`, e.g. "animations/voiceover.mp3". Empty = silent. */
  audioSrc: string;
};

const Knot: React.FC = () => {
  // GSAP drives the motion; Remotion's frame clock drives GSAP.
  const s = useGsapTimeline(
    { scale: 0, rotY: 0, rotX: 0, y: -2, hue: 0.55 },
    (tl, state) => {
      tl.to(state, { scale: 1, y: 0, duration: 1.2, ease: "back.out(1.7)" })
        .to(state, { rotY: Math.PI * 2, duration: 3, ease: "power2.inOut" }, 0.4)
        .to(state, { rotX: Math.PI / 3, hue: 0.8, duration: 1.5, ease: "sine.inOut" }, 2)
        .to(state, { scale: 0.6, y: 0.4, duration: 1, ease: "expo.inOut" }, 4.5);
    },
  );

  return (
    <mesh position={[0, s.y, 0]} rotation={[s.rotX, s.rotY, 0]} scale={s.scale}>
      <torusKnotGeometry args={[1, 0.32, 200, 32]} />
      <meshStandardMaterial
        color={`hsl(${Math.round(s.hue * 360)}, 80%, 60%)`}
        metalness={0.4}
        roughness={0.25}
      />
    </mesh>
  );
};

export const HeroScene: React.FC<HeroSceneProps> = ({ captionsSrc, audioSrc }) => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle, #1e293b, #020617)" }}>
      <ThreeCanvas width={width} height={height} camera={{ position: [0, 0, 7.5], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <pointLight position={[-4, -2, 3]} intensity={20} color="#a78bfa" />
        <Knot />
      </ThreeCanvas>
      <Captions src={captionsSrc} />
      {audioSrc ? <Audio src={staticFile(audioSrc)} /> : null}
    </AbsoluteFill>
  );
};
