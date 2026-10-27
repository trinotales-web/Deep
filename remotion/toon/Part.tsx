import type * as THREE from "three";
import { OUTLINE, outlineMaterial, toonMaterial, type ToonOpts } from "./materials";

export type Vec3 = [number, number, number];

export type PartProps = Omit<ToonOpts, "color"> & {
  color?: string;
  geometry: THREE.BufferGeometry;
  position?: Vec3;
  rotation?: Vec3;
  scale?: Vec3 | number;
  /** Outline thickness in world units; 0 disables it. */
  outline?: number;
  /** Override the shading material (e.g. a face material). */
  material?: THREE.Material;
  children?: React.ReactNode;
};

/** A cel-shaded mesh with an ink outline: the basic building block of every toon model. */
export const Part: React.FC<PartProps> = ({
  geometry,
  position,
  rotation,
  scale,
  outline = OUTLINE,
  material,
  children,
  ...toon
}) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh
        geometry={geometry}
        material={material ?? toonMaterial({ ...toon, color: toon.color ?? "#ff00ff" })}
      />
      {outline > 0 ? <mesh geometry={geometry} material={outlineMaterial(outline)} /> : null}
      {children}
    </group>
  );
};
