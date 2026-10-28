import { ThreeCanvas } from "@remotion/three";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// 2D in Three.js: an orthographic camera with zoom 1 maps 1 world unit to 1 pixel,
// with (0, 0) at the center of the frame. `flat` disables tone mapping so hex colors render exactly.
// All motion MUST be derived from useCurrentFrame() - never use R3F's useFrame().
export const Scene2D: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14 } });
  const rotation = frame * 0.03;
  const orbitX = Math.cos(frame / 20) * 320;
  const orbitY = Math.sin(frame / 20) * 180;
  const pulse = interpolate(Math.sin(frame / 8), [-1, 1], [0.85, 1.15]);

  return (
    <ThreeCanvas
      width={width}
      height={height}
      orthographic
      flat
      camera={{ position: [0, 0, 100], zoom: 1, near: 0.1, far: 1000 }}
    >
      <mesh scale={enter * 220} rotation={[0, 0, rotation]}>
        <circleGeometry args={[1, 6]} />
        <meshBasicMaterial color="#4a9eff" />
      </mesh>
      <mesh position={[orbitX, orbitY, 1]} scale={60 * pulse * enter}>
        <circleGeometry args={[1, 64]} />
        <meshBasicMaterial color="#ffb547" />
      </mesh>
    </ThreeCanvas>
  );
};
