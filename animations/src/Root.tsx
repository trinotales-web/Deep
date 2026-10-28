import { Composition, Folder } from "remotion";
import { OnodaEpisode, OnodaVisuals, calculateOnodaMetadata, type OnodaProps } from "./episodes/onoda/Episode";
import { TOTAL_FRAMES } from "./episodes/onoda/script";
import { KitTest } from "./dev/KitTest";
import { WoodenWall, WoodenWallAudio, WoodenWallVisuals, calculateWoodenWallMetadata, type WoodenWallProps } from "./episodes/woodenwall/Episode";
import { TOTAL_FRAMES as WW_FRAMES } from "./episodes/woodenwall/script";
import { AncientTest } from "./dev/AncientTest";

// When the voiceover is ready: put it in public/vo/, run
// `node scripts/transcribe.mjs public/vo/onoda.mp3`, then set
// voiceover: "vo/onoda.mp3", captionsFile: "captions/onoda.json".
const onodaDefaults: OnodaProps = {
  voiceover: null,
  captionsFile: null,
  highlights: ["order", "never", "surrender", "ends", "tells", "him", "fighting", "29", "twenty-nine", "years"],
};

export const RemotionRoot = () => {
  return (
    <>
      <Folder name="WoodenWall">
        <Composition
          id="WoodenWallShort"
          component={WoodenWall}
          durationInFrames={WW_FRAMES}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ voiceover: "vo/wooden-wall.mp3", captionsFile: "captions/wooden-wall.json" } satisfies WoodenWallProps}
          calculateMetadata={calculateWoodenWallMetadata}
        />
        <Composition
          id="WoodenWallAudioOnly"
          component={WoodenWallAudio}
          durationInFrames={WW_FRAMES}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ voiceover: "vo/wooden-wall.mp3", captionsFile: "captions/wooden-wall.json" } satisfies WoodenWallProps}
          calculateMetadata={calculateWoodenWallMetadata}
        />
        <Composition id="WoodenWallVisualsOnly" component={WoodenWallVisuals} durationInFrames={WW_FRAMES} fps={30} width={1080} height={1920} />
      </Folder>
      <Folder name="Onoda">
        <Composition
          id="OnodaShort"
          component={OnodaEpisode}
          durationInFrames={TOTAL_FRAMES}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={onodaDefaults}
          calculateMetadata={calculateOnodaMetadata}
        />
        <Composition
          id="OnodaVideo"
          component={OnodaEpisode}
          durationInFrames={TOTAL_FRAMES}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={onodaDefaults}
          calculateMetadata={calculateOnodaMetadata}
        />
        <Composition id="OnodaVisualsOnly" component={OnodaVisuals} durationInFrames={TOTAL_FRAMES} fps={30} width={1080} height={1920} />
      </Folder>
      <Folder name="Dev">
        <Composition id="KitTest" component={KitTest} durationInFrames={90} fps={30} width={1080} height={1920} />
        <Composition id="AncientTest" component={AncientTest} durationInFrames={90} fps={30} width={1080} height={1920} />
      </Folder>
    </>
  );
};
