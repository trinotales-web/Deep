import { Composition } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { RyokanStory } from "./ryokan/Ryokan";
import timeline from "./ryokan/timeline.json";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ title: "AXUNE" }}
      />
      <Composition
        id="Ryokan"
        component={RyokanStory}
        durationInFrames={timeline.duration * timeline.fps}
        fps={timeline.fps}
        width={1080}
        height={1080}
      />
    </>
  );
};
