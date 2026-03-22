import { Composition } from "remotion";
import { WabiSabi } from "./WabiSabi";
import { TOTAL_FRAMES, FPS } from "./constants";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="WabiSabi"
      component={WabiSabi}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
