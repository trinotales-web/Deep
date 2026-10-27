import { useMemo } from "react";
import * as THREE from "three";
import { geo } from "./geometries";
import { paintBanner, paintHeaterShield, paintTentDoor } from "./heraldry";
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

const tentGeometry = () =>
  new THREE.LatheGeometry(
    [
      [0.001, 0],
      [1.28, 0],
      [1.3, 0.12],
      [1.0, 0.75],
      [0.45, 1.65],
      [0.1, 2.25],
      [0.001, 2.35],
    ].map(([x, y]) => new THREE.Vector2(x, y)),
    48,
  );

/** Round striped pavilion tent with a dark doorway and a pennant on top. */
export const Tent: React.FC<{
  position: Vec3;
  color: string;
  stripe: string;
  scale?: number;
  flag?: string;
  rotationY?: number;
}> = ({ position, color, stripe, scale = 1, flag, rotationY = 0 }) => {
  const g = useMemo(tentGeometry, []);
  const door = useMemo(paintTentDoor, []);
  return (
    <group position={position} scale={scale} rotation={[0, rotationY, 0]}>
      <Part geometry={g} color={color} stripe={stripe} stripes={12} grain={0.06} />
      <mesh position={[0, 0.5, 1.06]} rotation={[-0.38, 0, 0]}>
        <planeGeometry args={[0.95, 1.05]} />
        <meshBasicMaterial map={door} transparent toneMapped={false} />
      </mesh>
      <Part geometry={geo.capsule(0.03, 0.5)} color="#6b4a33" position={[0, 2.55, 0]} outline={0.014} />
      {flag ? (
        <Part
          geometry={geo.sphere()}
          color={flag}
          scale={[0.22, 0.09, 0.02]}
          position={[0.22, 2.7, 0]}
          outline={0.014}
        />
      ) : null}
    </group>
  );
};

/** Banner on a pole (painted cloth on a 3D pole). */
export const Banner: React.FC<{ position: Vec3; kind: "lion" | "fleur"; height?: number }> = ({
  position,
  kind,
  height = 2.6,
}) => {
  const tex = useMemo(() => paintBanner(kind), [kind]);
  return (
    <group position={position}>
      <Part geometry={geo.capsule(0.035, height)} color="#6b4a33" position={[0, height / 2, 0]} />
      <Part geometry={geo.capsule(0.025, 0.6)} color="#6b4a33" position={[0.3, height - 0.05, 0]} rotation={[0, 0, Math.PI / 2]} outline={0.014} />
      <mesh position={[0.3, height - 0.5, 0.02]}>
        <planeGeometry args={[0.62, 0.78]} />
        <meshBasicMaterial map={tex} transparent toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

/** Painted heater shield standing in the scene. */
export const Shield: React.FC<{ position: Vec3; rotation?: Vec3; scale?: number }> = ({
  position,
  rotation,
  scale = 1,
}) => {
  const tex = useMemo(() => paintHeaterShield(), []);
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[0.8, 0.97]} />
      <meshBasicMaterial map={tex} transparent toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  );
};

export const Barrel: React.FC<{ position: Vec3; scale?: number }> = ({ position, scale = 1 }) => (
  <group position={position} scale={scale}>
    <Part geometry={geo.capsule(0.3, 0.32)} color="#9a6a40" grain={0.12} position={[0, 0.42, 0]} scale={[1, 1, 1]} />
    {[0.22, 0.62].map((y) => (
      <Part key={y} geometry={geo.torus(0.29, 0.03)} color="#4f4a4a" rotation={[Math.PI / 2, 0, 0]} position={[0, y, 0]} outline={0.012} />
    ))}
  </group>
);

/** Cooking pot hanging from a tripod over a fire. */
export const PotTripod: React.FC<{ position: Vec3 }> = ({ position }) => (
  <group position={position}>
    {[0, 2.1, 4.2].map((a) => (
      <Part
        key={a}
        geometry={geo.capsule(0.03, 1.7)}
        color="#6b4a33"
        position={[Math.sin(a) * 0.36, 0.8, Math.cos(a) * 0.36]}
        rotation={[Math.cos(a) * -0.28, 0, Math.sin(a) * 0.28]}
        outline={0.014}
      />
    ))}
    <Part geometry={geo.sphere()} color="#3f3b3d" scale={[0.24, 0.2, 0.24]} position={[0, 0.98, 0]} />
  </group>
);
