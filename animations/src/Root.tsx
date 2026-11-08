import { Composition, Folder } from "remotion";
import { OnodaEpisode, OnodaVisuals, calculateOnodaMetadata, type OnodaProps } from "./episodes/onoda/Episode";
import { TOTAL_FRAMES } from "./episodes/onoda/script";
import { KitTest } from "./dev/KitTest";
import { FireArrows, FireArrowsAudio, FireArrowsVisuals, calculateFireArrowsMetadata, type FireArrowsProps } from "./episodes/firearrows/Episode";
import { TOTAL_FRAMES as FA_FRAMES } from "./episodes/firearrows/script";
import { WoodenWall, WoodenWallAudio, WoodenWallVisuals, calculateWoodenWallMetadata, type WoodenWallProps } from "./episodes/woodenwall/Episode";
import { TOTAL_FRAMES as WW_FRAMES } from "./episodes/woodenwall/script";
import { AncientTest } from "./dev/AncientTest";
import { MedievalTest } from "./dev/MedievalTest";
import { WW2Test } from "./dev/WW2Test";
import { S45Kit } from "./dev/S45Kit";
import { QinKit } from "./dev/QinKit";
import { MayaKit } from "./dev/MayaKit";
import { QinTomb, QinTombAudio, QinTombVisuals, QinTombFull, FULL_FRAMES as QF, calculateQinTombMetadata, calculateQinTombFullMetadata, type QinTombProps, type QinTombFullProps } from "./episodes/qintomb/Episode";
import { END1 as QT1, END2 as QT2 } from "./episodes/qintomb/script";
import { ChannelBanner, ChannelLogo } from "./brand/Brand";
import { ThumbFireArrows } from "./thumbnails/FireArrowsThumb";
import { Spring1945, Spring1945Audio, Spring1945MusicAudio, Spring1945Visuals, calculateSpring1945Metadata, type Spring1945Props } from "./episodes/spring1945/Episode";
import { TOTAL_FRAMES as S45_FRAMES } from "./episodes/spring1945/script";

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
      <Folder name="QinTomb">
        <Composition
          id="QinTombFullVideo"
          component={QinTombFull}
          durationInFrames={QF.p1 + QF.p2}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{} satisfies QinTombFullProps}
          calculateMetadata={calculateQinTombFullMetadata}
        />
        <Composition
          id="QinTombFullAudioOnly"
          component={QinTombFull}
          durationInFrames={QF.p1 + QF.p2}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ visuals: false } satisfies QinTombFullProps}
          calculateMetadata={calculateQinTombFullMetadata}
        />
        <Composition
          id="QinTomb1Video"
          component={QinTomb}
          durationInFrames={Math.round(QT1 * 30)}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ part: 1, voiceover: "vo/qin-tomb-1.voice.m4a", captionsFile: "captions/qin-tomb-1.json" } satisfies QinTombProps}
          calculateMetadata={calculateQinTombMetadata}
        />
        <Composition
          id="QinTomb1AudioOnly"
          component={QinTombAudio}
          durationInFrames={Math.round(QT1 * 30)}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ part: 1, voiceover: "vo/qin-tomb-1.voice.m4a", captionsFile: "captions/qin-tomb-1.json" } satisfies QinTombProps}
          calculateMetadata={calculateQinTombMetadata}
        />
        <Composition id="QinTomb1VisualsOnly" component={QinTombVisuals} durationInFrames={Math.round(QT1 * 30)} fps={30} width={1920} height={1080} defaultProps={{ part: 1 as 1 | 2 }} />
        <Composition
          id="QinTomb2Video"
          component={QinTomb}
          durationInFrames={Math.round(QT2 * 30)}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ part: 2, voiceover: "vo/qin-tomb-2.voice.m4a", captionsFile: "captions/qin-tomb-2.json" } satisfies QinTombProps}
          calculateMetadata={calculateQinTombMetadata}
        />
        <Composition
          id="QinTomb2AudioOnly"
          component={QinTombAudio}
          durationInFrames={Math.round(QT2 * 30)}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ part: 2, voiceover: "vo/qin-tomb-2.voice.m4a", captionsFile: "captions/qin-tomb-2.json" } satisfies QinTombProps}
          calculateMetadata={calculateQinTombMetadata}
        />
        <Composition id="QinTomb2VisualsOnly" component={QinTombVisuals} durationInFrames={Math.round(QT2 * 30)} fps={30} width={1920} height={1080} defaultProps={{ part: 2 as 1 | 2 }} />
      </Folder>
      <Folder name="Spring1945">
        <Composition
          id="Spring1945Video"
          component={Spring1945}
          durationInFrames={S45_FRAMES}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ voiceover: "vo/spring-1945.voice.m4a", captionsFile: "captions/spring-1945.json" } satisfies Spring1945Props}
          calculateMetadata={calculateSpring1945Metadata}
        />
        <Composition
          id="Spring1945AudioOnly"
          component={Spring1945Audio}
          durationInFrames={S45_FRAMES}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ voiceover: "vo/spring-1945.voice.m4a", captionsFile: "captions/spring-1945.json" } satisfies Spring1945Props}
          calculateMetadata={calculateSpring1945Metadata}
        />
        <Composition
          id="Spring1945MusicOnly"
          component={Spring1945MusicAudio}
          durationInFrames={S45_FRAMES}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ voiceover: "vo/spring-1945.voice.m4a", captionsFile: "captions/spring-1945.json" } satisfies Spring1945Props}
          calculateMetadata={calculateSpring1945Metadata}
        />
        <Composition id="Spring1945VisualsOnly" component={Spring1945Visuals} durationInFrames={S45_FRAMES} fps={30} width={1920} height={1080} />
      </Folder>
      <Folder name="FireArrows">
        <Composition
          id="FireArrowsVideo"
          component={FireArrows}
          durationInFrames={FA_FRAMES}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ voiceover: "vo/fire-arrows.voice.m4a", captionsFile: "captions/fire-arrows.json" } satisfies FireArrowsProps}
          calculateMetadata={calculateFireArrowsMetadata}
        />
        <Composition
          id="FireArrowsAudioOnly"
          component={FireArrowsAudio}
          durationInFrames={FA_FRAMES}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ voiceover: "vo/fire-arrows.voice.m4a", captionsFile: "captions/fire-arrows.json" } satisfies FireArrowsProps}
          calculateMetadata={calculateFireArrowsMetadata}
        />
        <Composition id="FireArrowsVisualsOnly" component={FireArrowsVisuals} durationInFrames={FA_FRAMES} fps={30} width={1920} height={1080} />
      </Folder>
      <Folder name="WoodenWall">
        <Composition
          id="WoodenWallShort"
          component={WoodenWall}
          durationInFrames={WW_FRAMES}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ voiceover: "vo/wooden-wall.voice.m4a", captionsFile: "captions/wooden-wall.json" } satisfies WoodenWallProps}
          calculateMetadata={calculateWoodenWallMetadata}
        />
        <Composition
          id="WoodenWallAudioOnly"
          component={WoodenWallAudio}
          durationInFrames={WW_FRAMES}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ voiceover: "vo/wooden-wall.voice.m4a", captionsFile: "captions/wooden-wall.json" } satisfies WoodenWallProps}
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
      <Folder name="Brand">
        <Composition id="ChannelBanner" component={ChannelBanner} durationInFrames={30} fps={30} width={2560} height={1440} defaultProps={{ guides: false }} />
        <Composition id="ChannelLogo" component={ChannelLogo} durationInFrames={30} fps={30} width={800} height={800} />
      </Folder>
      <Folder name="Thumbnails">
        <Composition id="ThumbFireArrows" component={ThumbFireArrows} durationInFrames={1} fps={30} width={1280} height={720} />
      </Folder>
      <Folder name="Dev">
        <Composition id="KitTest" component={KitTest} durationInFrames={90} fps={30} width={1080} height={1920} />
        <Composition id="MedievalTest" component={MedievalTest} durationInFrames={90} fps={30} width={1920} height={1080} />
        <Composition id="QinKit" component={QinKit} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ page: 0 }} />
        <Composition id="MayaKit" component={MayaKit} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ page: 0 }} />
        <Composition id="S45Kit" component={S45Kit} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ page: 0 }} />
        <Composition id="WW2Test" component={WW2Test} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ page: 0 }} />
        <Composition id="AncientTest" component={AncientTest} durationInFrames={90} fps={30} width={1080} height={1920} />
      </Folder>
    </>
  );
};
