import { geo } from "./geometries";
import { Part, type Vec3 } from "./Part";

export const Rifle: React.FC<{ position?: Vec3; rotation?: Vec3; scale?: number }> = ({
  position,
  rotation,
  scale = 1,
}) => (
  <group position={position} rotation={rotation} scale={scale}>
    <Part geometry={geo.box(0.08, 1.0, 0.07, 0.03)} color="#8a5634" grain={0.12} position={[0, 0, 0]} />
    <Part geometry={geo.box(0.13, 0.32, 0.08, 0.035)} color="#6f4329" grain={0.12} position={[0.02, -0.58, 0]} rotation={[0, 0, 0.12]} />
    <Part geometry={geo.capsule(0.024, 0.5)} color="#4d4b52" position={[0, 0.72, 0]} outline={0.014} />
    <Part geometry={geo.sphereLo()} color="#4d4b52" scale={0.04} position={[0.06, 0.1, 0]} outline={0.012} />
  </group>
);
