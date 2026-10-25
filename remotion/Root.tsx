import { Composition } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { JapanPart1, PART1_DURATION } from "./japan/Part1";
import { CastSheet } from "./japan/dev/CastSheet";
import { JapanPart2, PART2_DURATION } from "./japan/Part2";

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
      />
      <Composition
        id="JapanPart2"
        component={JapanPart2}
        durationInFrames={PART2_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition id="JapanCast" component={CastSheet} durationInFrames={30} fps={30} width={1920} height={1080} />
    </>
  );
};
