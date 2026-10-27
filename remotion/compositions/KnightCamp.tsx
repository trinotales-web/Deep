import { useMemo } from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useGsapTimeline } from "../lib/useGsapTimeline";
import { Character, type Outfit } from "../toon/Character";
import { Bush, CameraRig, Campfire, Disc, Ground, Painted, Sky } from "../toon/Environment";
import { FilmLook } from "../toon/FilmLook";
import { setHaze } from "../toon/materials";
import { paintCloudBank, paintPath, paintTreeline } from "../toon/paint";
import { Banner, Barrel, PotTripod, Shield, Tent } from "../toon/props";

export const KNIGHT: Outfit = {
  top: "#b9bcc4",
  bottom: "#b3b6bf",
  boots: "#9a9ea8",
  hands: "#c4c7ce",
  belt: "#7a4f30",
  hat: "greathelm",
  hatColor: "#c3c6cd",
  tabard: { color: "#f0c43a", emblem: "lion" },
};

/** Style frame: knight in a medieval camp at sunset, matching the reference knights short. */
export const KnightCamp: React.FC = () => {
  const { width, height } = useVideoConfig();

  const tex = useMemo(
    () => ({
      clouds: paintCloudBank(2400, 700, 11, { fill: "#efb3ad", shade: "#dc949b" }, 4),
      far: paintTreeline(2400, 520, 8, { fill: "#bba3bf", shade: "rgba(150,115,160,0.45)" }, { ridge: 0.4, amp: 45, bump: 12, lw: 3 }),
      mid: paintTreeline(2400, 520, 3, { fill: "#93b46a", shade: "rgba(90,130,60,0.5)", dots: "rgba(90,125,60,0.35)" }, { ridge: 0.45, amp: 20, bump: 26, lw: 3.5 }),
      path: paintPath(512, 2048, 4),
    }),
    [],
  );

  const s = useGsapTimeline({ camX: -0.3, camZ: 9.6, flicker: 0, nod: 0 }, (tl, st) => {
    tl.to(st, { camX: 0.25, camZ: 8.8, duration: 4, ease: "sine.inOut" }, 0)
      .to(st, { flicker: 1, duration: 0.15, ease: "sine.inOut", repeat: 26, yoyo: true }, 0)
      .to(st, { nod: 1, duration: 0.6, ease: "sine.inOut", repeat: 5, yoyo: true }, 0);
  });

  setHaze("#f3c9ae", 12, 48, 0.5);

  return (
    <AbsoluteFill>
      <ThreeCanvas width={width} height={height} flat>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 6, 4]} intensity={1} />
        <CameraRig position={[s.camX, 1.75, s.camZ]} target={[0.3, 1.45, 0]} fov={30} />

        {/* Painted sunset backdrop */}
        <Sky top="#e9a196" bottom="#f7d5a8" horizon={0.4} />
        <Disc position={[3.5, 3.2, -58]} radius={2.4} color="#fbe6b0" glow="rgba(255,236,190,0.85)" />
        <Painted texture={tex.clouds} size={[64, 18.7]} position={[0, 14, -60]} />
        <Painted texture={tex.far} size={[100, 21.7]} position={[0, 3.2, -50]} />
        <Painted texture={tex.mid} size={[70, 15.2]} position={[0, 0.6, -30]} />
        <Ground seed={6} colors={{ base: "#97b85c", light: "#aecb70", dark: "#7c9c49", tuft: "#5d8a39" }} />
        <Painted texture={tex.path} size={[1.7, 34]} position={[1.1, 0.01, -14]} rotation={[-Math.PI / 2, 0, 0]} />

        {/* Distant camp */}
        <Tent position={[-1.6, 0, -13]} color="#f3efe4" stripe="#d24b3c" scale={0.7} flag="#d24b3c" />
        <Tent position={[2.6, 0, -16]} color="#f3efe4" stripe="#d24b3c" scale={0.6} />
        <Tent position={[6, 0, -11]} color="#f3efe4" stripe="#4f8f4a" scale={0.7} flag="#4f8f4a" />
        <Tent position={[-6.5, 0, -15]} color="#f2c443" stripe="#d24b3c" scale={0.7} />
        <Bush position={[-8, 0, -18]} scale={1.6} />
        <Bush position={[9, 0, -20]} scale={1.8} />

        {/* Foreground camp */}
        <Tent position={[-3.7, 0, -1.6]} color="#f2c443" stripe="#d24b3c" flag="#f2c443" rotationY={0.35} />
        <Tent position={[4.3, 0, -2.6]} color="#f3efe4" stripe="#4f8f4a" flag="#4f8f4a" rotationY={-0.4} />
        <Banner position={[-2.1, 0, -1.4]} kind="lion" />
        <Banner position={[2.9, 0, -3.4]} kind="fleur" height={2.8} />
        <Barrel position={[-1.85, 0, -0.5]} />
        <Barrel position={[-2.4, 0, -0.2]} scale={0.85} />
        <Shield position={[-1.25, 0.47, 0.35]} rotation={[-0.08, 0.3, -0.12]} />
        <Campfire position={[2.25, 0, 0.6]} flicker={s.flicker} glow={0.8} />
        <PotTripod position={[2.25, 0, 0.6]} />
        <Bush position={[-4.1, 0, 1.6]} scale={0.7} />
        <Bush position={[4.6, 0, 1.2]} scale={0.8} color="#679540" />

        <Character
          outfit={KNIGHT}
          face={{ expression: "suspicious", freckles: false, lookX: -0.3 }}
          position={[0.35, 0, 0.2]}
          pose={{
            turn: -0.12,
            headYaw: 0.1,
            headPitch: -0.04 + s.nod * 0.03,
            headRoll: 0.05,
            lArm: [0.15, 0.25, 0.5],
            rArm: [0.1, 0.2, 0.4],
          }}
        />
      </ThreeCanvas>
      <FilmLook tint="#f2b49c" tintAmount={0.08} vignette={0.4} dust={0} />
    </AbsoluteFill>
  );
};
