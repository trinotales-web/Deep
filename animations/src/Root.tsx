import { Composition, staticFile } from "remotion";
import { Animation2D, type Animation2DProps } from "./Animation2D";

export const RemotionRoot = () => {
  return (
    <Composition
      id="Animation2D"
      component={Animation2D}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={
        {
          captionsSrc: staticFile("captions/example.json"),
          // Drop an audio file in public/audio/ and point this at it, e.g. staticFile("audio/voice.mp3").
          audioSrc: null,
        } satisfies Animation2DProps
      }
    />
  );
};
