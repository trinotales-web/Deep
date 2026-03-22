import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Opening } from "./scenes/Opening";
import { Impermanence } from "./scenes/Impermanence";
import { Imperfection } from "./scenes/Imperfection";
import { NegativeSpace } from "./scenes/NegativeSpace";
import { NaturalBeauty } from "./scenes/NaturalBeauty";
import { Closing } from "./scenes/Closing";
import { SCENE_DURATION, TRANSITION_DURATION, COLORS } from "./constants";
import { loadFonts } from "./fonts";

// Load fonts once at module level
loadFonts();

export const WabiSabi: React.FC = () => {
  const t = linearTiming({ durationInFrames: TRANSITION_DURATION });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATION}>
          <Opening />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fade()} timing={t} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATION}>
          <Impermanence />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fade()} timing={t} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATION}>
          <Imperfection />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fade()} timing={t} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATION}>
          <NegativeSpace />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fade()} timing={t} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATION}>
          <NaturalBeauty />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fade()} timing={t} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATION}>
          <Closing />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
