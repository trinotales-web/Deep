import { AbsoluteFill } from "remotion";
import { Audio } from "@remotion/media";
import { Scene2D } from "./Scene2D";
import { Captions } from "./Captions";

export type Animation2DProps = {
  captionsSrc: string | null;
  audioSrc: string | null;
};

// Layering: Three.js visuals (bottom) -> Remotion captions (top) + Remotion audio.
export const Animation2D: React.FC<Animation2DProps> = ({
  captionsSrc,
  audioSrc,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b1020" }}>
      <Scene2D />
      {captionsSrc ? <Captions src={captionsSrc} /> : null}
      {audioSrc ? <Audio src={audioSrc} /> : null}
    </AbsoluteFill>
  );
};
