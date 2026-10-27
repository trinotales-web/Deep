import { Composition } from "remotion";
import { HeroScene, type HeroSceneProps } from "./compositions/HeroScene";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="HeroScene"
      component={HeroScene}
      durationInFrames={180}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={
        {
          captionsSrc: "animations/hero-captions.json",
          audioSrc: "",
        } satisfies HeroSceneProps
      }
    />
  );
};
