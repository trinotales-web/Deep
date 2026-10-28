import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Stage, Gradient, palette } from "../kit";
import { Character, poses, type EyeKind, type MouthKind, type HatKind, type HairKind } from "../kit/character";

// Style sheet: every eye / mouth / hat / hair option on one page (1080x1920).
const EXPR: [EyeKind, MouthKind, number][] = [
  ["open", "smile", 0],
  ["wide", "o", 0.6],
  ["half", "flat", 0],
  ["angry", "teeth", -0.8],
  ["sad", "wavy", 0.6],
  ["happy", "grin", 0],
  ["closed", "smirk", 0],
  ["dot", "smile", 0],
  ["squint", "shout", -0.6],
];
const HATS: [HatKind, HairKind, string][] = [
  ["helmet", null, "#5f7a3a"],
  ["fieldcap", null, "#8f8a58"],
  ["sidecap", "sides", palette.olive],
  ["officer", null, palette.navy],
  ["headband", "short", "#c8a978"],
  ["hardhat", null, "#e05a2a"],
  [null, "bob", "#7a3a6a"],
  [null, "bun", "#3a5a8a"],
  [null, "spiky", "#c0362c"],
];

export const KitTest: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage vignette={0.35}>
        <Gradient w={1080} h={1920} stops={[[0, "#d9c7a4"], [1, "#b89a6e"]]} />
        {EXPR.map(([eyes, mouth, brows], i) => (
          <Character
            key={`e${i}`}
            x={-340 + (i % 3) * 340}
            y={560 - Math.floor(i / 3) * 300}
            s={0.5}
            outfit={{ top: "#c8a978", buttons: "#f6f5f8", collar: "v" }}
            freckles={i % 2 === 0}
            expression={{ eyes, mouth, brows, blush: eyes === "happy" }}
            pose={poses.idle(frame, i)}
            seed={i}
          />
        ))}
        {HATS.map(([hat, hair, top], i) => (
          <Character
            key={`h${i}`}
            x={-340 + (i % 3) * 340}
            y={-330 - Math.floor(i / 3) * 250}
            s={0.42}
            facing={i % 2 ? -1 : 1}
            outfit={{ top, belt: "#5a3a26", buckle: "#c9a24a", pockets: hat === "helmet", buttons: hat === "officer" ? palette.gold : null }}
            hat={hat}
            camo={hat === "helmet"}
            hair={hair}
            hairColor={hair === "sides" ? "#d8d2cc" : palette.hairBrown}
            mustache={hat === "officer" || hat === "sidecap" ? "walrus" : null}
            expression={{ eyes: "open", mouth: "smile" }}
            pose={i === 3 ? poses.salute : poses.idle(frame, i)}
            seed={i + 20}
          />
        ))}
      </Stage>
    </AbsoluteFill>
  );
};
