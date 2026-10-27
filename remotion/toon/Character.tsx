import { geo } from "./geometries";
import { faceTexture, type FaceSpec } from "./face";
import { faceMaterial } from "./materials";
import { Part, type Vec3 } from "./Part";

export const SKIN = "#f3f1ec";
export const SKIN_SHADE = "#c7c5cb";

export type Outfit = {
  top: string;
  /** Blotchy dirt / patches on the top. */
  topPattern?: string;
  bottom: string;
  boots: string;
  belt?: string;
  tie?: string;
  hat: "fieldcap" | "fedora" | "none";
  hatColor?: string;
  hatBand?: string;
};

/** Arm: [forward raise, outward raise, elbow bend forward, elbow bend sideways] in radians. */
export type Arm = [number, number, number, number?];

export type Pose = {
  headYaw?: number;
  headPitch?: number;
  headRoll?: number;
  lean?: number;
  turn?: number;
  bob?: number;
  /** 0..1, sits down with legs forward. */
  sit?: number;
  lArm?: Arm;
  rArm?: Arm;
  lLeg?: number;
  rLeg?: number;
};

export type CharacterProps = {
  outfit: Outfit;
  face: FaceSpec;
  pose?: Pose;
  position?: Vec3;
  scale?: number;
  /** Rendered in the right / left hand (hand-local space, fingers point down -y). */
  rightHand?: React.ReactNode;
  leftHand?: React.ReactNode;
  /** Rendered in front of the torso (e.g. a slung rifle). */
  chest?: React.ReactNode;
};

const HEAD_R = 0.55;

const ArmRig: React.FC<{
  side: 1 | -1;
  arm: Arm;
  color: string;
  children?: React.ReactNode;
}> = ({ side, arm, color, children }) => {
  const [fwd, out, elbow, elbowSide = 0] = arm;
  return (
    <group position={[side * 0.27, 0.74, 0]} rotation={[-fwd, 0, side * out]}>
      <Part geometry={geo.capsule(0.085, 0.2)} color={color} position={[0, -0.15, 0]} />
      <group position={[0, -0.3, 0]} rotation={[-elbow, 0, side * elbowSide]}>
        <Part geometry={geo.capsule(0.08, 0.18)} color={color} position={[0, -0.13, 0]} />
        <group position={[0, -0.3, 0]}>
          <Part geometry={geo.sphere()} color={SKIN} shade={SKIN_SHADE} scale={[0.11, 0.12, 0.1]} />
          {children}
        </group>
      </group>
    </group>
  );
};

const Hat: React.FC<{ outfit: Outfit }> = ({ outfit }) => {
  const c = outfit.hatColor ?? outfit.top;
  if (outfit.hat === "fieldcap") {
    return (
      <group rotation={[-0.12, 0, 0]}>
        <Part geometry={geo.dome(1.25)} color={c} grain={0.1} scale={[0.6, 0.5, 0.6]} position={[0, 0.06, 0]} />
        <Part
          geometry={geo.torus(0.57, 0.05)}
          color={outfit.hatBand ?? c}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 0.2, 0]}
        />
        <Part
          geometry={geo.sphere()}
          color={c}
          scale={[0.3, 0.035, 0.2]}
          position={[0, 0.17, 0.52]}
          rotation={[0.25, 0, 0]}
        />
        <Part geometry={geo.sphere()} color="#e9c446" flat scale={0.045} position={[0, 0.34, 0.5]} outline={0.012} />
      </group>
    );
  }
  if (outfit.hat === "fedora") {
    return (
      <group rotation={[-0.08, 0, 0.05]}>
        <Part geometry={geo.sphere()} color={c} scale={[0.85, 0.05, 0.78]} position={[0, 0.33, 0.02]} />
        <Part geometry={geo.sphere()} color={c} scale={[0.47, 0.34, 0.45]} position={[0, 0.5, 0]} />
        <Part
          geometry={geo.torus(0.46, 0.05)}
          color={outfit.hatBand ?? "#3a2c25"}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 0.4, 0]}
          scale={[1, 0.98, 1]}
        />
      </group>
    );
  }
  return null;
};

/**
 * Egg-head cartoon character in the style of the reference shorts: big white head,
 * dot eyes, freckles, small body, mitten hands, thick ink outlines.
 * Faces +z. Feet at y = 0.
 */
export const Character: React.FC<CharacterProps> = ({
  outfit,
  face,
  pose = {},
  position,
  scale = 1,
  rightHand,
  leftHand,
  chest,
}) => {
  const sit = pose.sit ?? 0;
  const lArm = pose.lArm ?? [0.05, 0.12, 0.15];
  const rArm = pose.rArm ?? [0.05, 0.12, 0.15];
  const headMat = faceMaterial({ color: SKIN, shade: SKIN_SHADE, grain: 0.05 }, faceTexture(face));

  return (
    <group position={position} rotation={[0, pose.turn ?? 0, 0]} scale={scale}>
      <group position={[0, 0.55 - sit * 0.3 + (pose.bob ?? 0), 0]}>
        {/* Legs */}
        {([1, -1] as const).map((side) => (
          <group
            key={side}
            position={[side * 0.14, 0.02, 0]}
            rotation={[-(side === 1 ? (pose.lLeg ?? 0) : (pose.rLeg ?? 0)) - sit * 1.45, 0, 0]}
          >
            <Part geometry={geo.capsule(0.1, 0.28)} color={outfit.bottom} position={[0, -0.22, 0]} />
            <Part
              geometry={geo.sphere()}
              color={outfit.boots}
              scale={[0.13, 0.1, 0.19]}
              position={[0, -0.47, 0.06]}
            />
          </group>
        ))}

        <group rotation={[0, 0, pose.lean ?? 0]}>
          {/* Torso */}
          <Part
            geometry={geo.capsule(0.3, 0.32)}
            color={outfit.top}
            pattern={outfit.topPattern}
            patternAmt={0.45}
            patternScale={4}
            grain={0.09}
            position={[0, 0.42, 0]}
            scale={[1, 1, 0.85]}
          />
          {outfit.belt ? (
            <Part
              geometry={geo.torus(0.29, 0.045)}
              color={outfit.belt}
              rotation={[Math.PI / 2, 0, 0]}
              scale={[1.02, 0.86, 1]}
              position={[0, 0.16, 0]}
            />
          ) : null}
          {[0.32, 0.47, 0.62].map((y) => (
            <Part
              key={y}
              geometry={geo.sphereLo()}
              color="#3b302a"
              flat
              outline={0}
              scale={0.022}
              position={[0, y, 0.255]}
            />
          ))}
          {outfit.tie ? (
            <Part
              geometry={geo.box(0.09, 0.3, 0.04, 0.02)}
              color={outfit.tie}
              position={[0, 0.58, 0.25]}
              rotation={[-0.15, 0, 0]}
              outline={0.012}
            />
          ) : null}
          {chest}

          <ArmRig side={1} arm={lArm} color={outfit.top}>
            {leftHand}
          </ArmRig>
          <ArmRig side={-1} arm={rArm} color={outfit.top}>
            {rightHand}
          </ArmRig>

          {/* Head */}
          <group
            position={[0, 0.92, 0]}
            rotation={[pose.headPitch ?? 0, pose.headYaw ?? 0, pose.headRoll ?? 0]}
          >
            <group position={[0, 0.4, 0]}>
              <Part geometry={geo.sphere()} material={headMat} scale={[HEAD_R * 1.04, HEAD_R * 0.97, HEAD_R]} />
              {([1, -1] as const).map((side) => (
                <Part
                  key={side}
                  geometry={geo.sphere()}
                  color={SKIN}
                  shade={SKIN_SHADE}
                  scale={[0.07, 0.12, 0.1]}
                  position={[side * 0.56, -0.02, -0.02]}
                />
              ))}
              <Hat outfit={outfit} />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};
