import { Composition, Still } from "remotion";
import { ChannelLogo, channelLogoDefaults } from "./brand/ChannelLogo";
import { ChannelBanner } from "./brand/ChannelBanner";
import { JapanThumbnail, japanThumbnailDefaults } from "./brand/Thumbnail";
import { JapanThumbnailNinja, JapanThumbnailShips, JapanThumbnailSlash } from "./brand/ThumbnailVariants";
import { ONIN_DURATION, OninShort } from "./shorts/OninShort";
import { HelloWorld } from "./HelloWorld";
import { JapanPart1, PART1_DURATION } from "./japan/Part1";
import { CastSheet } from "./japan/dev/CastSheet";
import { JapanPart2, PART2_DURATION } from "./japan/Part2";
import { JapanPart3, PART3_DURATION } from "./japan/Part3";
import { JapanPart4, PART4_DURATION } from "./japan/Part4";
import { JapanPart5, PART5_DURATION } from "./japan/Part5";
import { JapanPart6, PART6_DURATION } from "./japan/Part6";
import { JapanPart7, PART7_DURATION } from "./japan/Part7";
import { JapanPart8, PART8_DURATION } from "./japan/Part8";
import { FULL_DURATION, JapanFull } from "./japan/Full";
import { JapanStory, STORY_DURATION } from "./japan/Story";
import { defaultAudioProps, japanAudioSchema, storyAudioProps } from "./japan/audioProps";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="JapanPart1"
        component={JapanPart1}
        durationInFrames={PART1_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={japanAudioSchema}
        defaultProps={defaultAudioProps}
      />
      <Composition
        id="JapanPart2"
        component={JapanPart2}
        durationInFrames={PART2_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={japanAudioSchema}
        defaultProps={defaultAudioProps}
      />
      <Composition
        id="JapanPart3"
        component={JapanPart3}
        durationInFrames={PART3_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={japanAudioSchema}
        defaultProps={defaultAudioProps}
      />
      <Composition
        id="JapanPart4"
        component={JapanPart4}
        durationInFrames={PART4_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={japanAudioSchema}
        defaultProps={defaultAudioProps}
      />
      <Composition
        id="JapanPart5"
        component={JapanPart5}
        durationInFrames={PART5_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={japanAudioSchema}
        defaultProps={defaultAudioProps}
      />
      <Composition
        id="JapanPart6"
        component={JapanPart6}
        durationInFrames={PART6_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={japanAudioSchema}
        defaultProps={defaultAudioProps}
      />
      <Composition
        id="JapanPart7"
        component={JapanPart7}
        durationInFrames={PART7_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={japanAudioSchema}
        defaultProps={defaultAudioProps}
      />
      <Composition
        id="JapanPart8"
        component={JapanPart8}
        durationInFrames={PART8_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={japanAudioSchema}
        defaultProps={defaultAudioProps}
      />
      <Composition
        id="JapanFull"
        component={JapanFull}
        durationInFrames={FULL_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={japanAudioSchema}
        defaultProps={defaultAudioProps}
      />
      <Composition
        id="JapanStory"
        component={JapanStory}
        durationInFrames={STORY_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={japanAudioSchema}
        defaultProps={storyAudioProps}
      />
      <Still id="ChannelLogo" component={ChannelLogo} width={800} height={800} defaultProps={channelLogoDefaults} />
      <Still id="ChannelBanner" component={ChannelBanner} width={2560} height={1440} />
      <Still id="JapanThumbnail" component={JapanThumbnail} width={1280} height={720} defaultProps={japanThumbnailDefaults} />
      <Still id="JapanThumbnailShips" component={JapanThumbnailShips} width={1280} height={720} defaultProps={japanThumbnailDefaults} />
      <Still id="JapanThumbnailSlash" component={JapanThumbnailSlash} width={1280} height={720} defaultProps={japanThumbnailDefaults} />
      <Still id="JapanThumbnailNinja" component={JapanThumbnailNinja} width={1280} height={720} defaultProps={japanThumbnailDefaults} />
      <Composition id="ShortOninWar" component={OninShort} durationInFrames={ONIN_DURATION} fps={30} width={1080} height={1920} />
      <Composition id="JapanCast" component={CastSheet} durationInFrames={30} fps={30} width={1920} height={1080} />
    </>
  );
};
