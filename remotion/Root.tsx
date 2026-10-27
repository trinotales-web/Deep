import { Composition } from "remotion";
import { HeroScene, type HeroSceneProps } from "./compositions/HeroScene";
import { ToonLab } from "./compositions/ToonLab";
import { LastSoldier } from "./compositions/LastSoldier";

export const RemotionRoot: React.FC = () => {
  return (
    <>
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
    <Composition id="LastSoldier" component={LastSoldier} durationInFrames={120} fps={30} width={1080} height={1920} />
    <Composition id="ToonLab" component={ToonLab} durationInFrames={30} fps={30} width={1080} height={1920} />
    </>
  );
};
