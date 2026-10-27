import { useMemo } from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useGsapTimeline } from "../../lib/useGsapTimeline";
import { Character } from "../../toon/Character";
import { Bush, CameraRig, Ground, Painted, Palm, Rock, Sky } from "../../toon/Environment";
import { FilmLook } from "../../toon/FilmLook";
import { setHaze } from "../../toon/materials";
import { paintCloudBank, paintForegroundLeaves, paintTreeline } from "../../toon/paint";
import { Rifle } from "../../toon/props";
import { SOLDIER } from "../ToonLab";

/** Shot 1: push in through the jungle to a soldier peeking out of a bush. */
export const SceneJungle: React.FC = () => {
  const { width, height } = useVideoConfig();

  const tex = useMemo(
    () => ({
      clouds: paintCloudBank(2048, 640, 7, { fill: "#fbf1dc", shade: "#ead3ae" }, 4),
      far: paintTreeline(2400, 520, 2, { fill: "#a2b895", shade: "rgba(120,150,120,0.5)" }, { ridge: 0.35, amp: 40, bump: 26, lw: 3 }),
      mid: paintTreeline(2400, 520, 5, { fill: "#7fa066", shade: "rgba(60,90,50,0.55)", dots: "rgba(70,100,50,0.35)" }, { ridge: 0.3, amp: 55, bump: 40, lw: 4 }),
      leavesL: paintForegroundLeaves(768, 1024, 21, 9),
      leavesR: paintForegroundLeaves(768, 1024, 34, 9),
    }),
    [],
  );

  const s = useGsapTimeline(
    { camZ: 21, camY: 6.2, tgtY: 2.6, camX: -0.6, headYaw: -0.55, look: -1, sway: 0, rise: -0.35, expr: 0 },
    (tl, st) => {
      tl.to(st, { camZ: 7.6, camY: 1.95, tgtY: 1.5, camX: 0.15, duration: 3.2, ease: "power3.inOut" }, 0)
        .to(st, { rise: 0, duration: 0.45, ease: "back.out(2)" }, 1.35)
        .to(st, { headYaw: 0.5, look: 1, duration: 0.4, ease: "power2.inOut" }, 1.9)
        .to(st, { headYaw: 0.05, look: 0, duration: 0.3, ease: "power2.out" }, 2.75)
        .to(st, { expr: 1, duration: 0.01 }, 2.8)
        .to(st, { camZ: 7.1, duration: 0.8, ease: "sine.out" }, 3.2)
        .to(st, { sway: 1, duration: 1, ease: "sine.inOut", repeat: 3, yoyo: true }, 0);
    },
  );

  setHaze("#f1dcae", 16, 60, 0.45);

  return (
    <AbsoluteFill>
      <ThreeCanvas width={width} height={height} flat>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 6, 4]} intensity={1} />
        <CameraRig position={[s.camX, s.camY, s.camZ]} target={[0, s.tgtY, 0]} fov={30} />
        <Sky top="#e6a96f" bottom="#f7e3b4" horizon={0.42} />
        <Painted texture={tex.clouds} size={[54, 17]} position={[-3, 12.5, -60]} />
        <Painted texture={tex.far} size={[110, 24]} position={[0, 1.2, -48]} />
        <Painted texture={tex.mid} size={[80, 17]} position={[0, -0.6, -30]} />
        <Ground />

        {/* Jungle */}
        <Palm position={[-3.2, 0, -4]} height={5.4} lean={-1.0} seed={1} sway={s.sway * 0.04} />
        <Palm position={[3.4, 0, -6]} height={6.2} lean={1.1} seed={2.3} sway={-s.sway * 0.04} />
        <Palm position={[-6.5, 0, -12]} height={6.5} lean={0.7} seed={4} />
        <Palm position={[6.5, 0, -14]} height={7} lean={-0.9} seed={5.5} />
        <Palm position={[0.8, 0, -18]} height={7.5} lean={0.6} seed={3} />
        <Palm position={[-11, 0, -22]} height={7} lean={1.2} seed={6} />
        <Palm position={[11, 0, -24]} height={8} lean={-0.5} seed={7} />
        <Bush position={[-2.3, 0, -1.5]} scale={1.4} />
        <Bush position={[2.6, 0, -2.5]} scale={1.6} color="#668f41" />
        <Bush position={[-4.5, 0, -7]} scale={2} color="#72984a" />
        <Bush position={[4.8, 0, -9]} scale={2.2} />
        <Bush position={[1.6, 0, 1.2]} scale={0.9} color="#73a04b" />
        <Rock position={[-1.2, 0.05, 1.6]} />
        <Rock position={[2.4, 0.04, 3]} scale={[0.3, 0.18, 0.26]} />

        {/* The soldier, crouched behind the hiding bush */}
        <Character
          outfit={SOLDIER}
          face={{ expression: s.expr > 0.5 ? "suspicious" : "determined", lookX: s.look }}
          position={[0, s.rise - 0.25, -0.35]}
          pose={{ headYaw: s.headYaw, headRoll: s.headYaw * -0.08, lArm: [0.85, 0.15, 1.1], rArm: [0.7, 0.1, 1.25] }}
          chest={<Rifle position={[0.05, 0.5, 0.33]} rotation={[0, 0, 0.85]} scale={0.9} />}
        />
        <Bush position={[0, -0.05, 0.45]} scale={[1.45, 1.05, 1]} color="#6a9a42" />

        {/* Out-of-focus foreground leaves the camera pushes through */}
        <Painted texture={tex.leavesL} size={[2.6, 3.5]} position={[-1.7, 1.2, 10]} rotation={[0, 0, 0.2]} />
        <Painted texture={tex.leavesR} size={[2.6, 3.5]} position={[1.8, 1.6, 12.5]} rotation={[0, 0, -0.3]} />
        <Painted texture={tex.leavesL} size={[2.2, 3]} position={[1.25, 0.2, 8.2]} rotation={[0, Math.PI, -0.1]} />
      </ThreeCanvas>
      <FilmLook tint="#f0c98a" tintAmount={0.1} vignette={0.45} dust={22} />
    </AbsoluteFill>
  );
};
