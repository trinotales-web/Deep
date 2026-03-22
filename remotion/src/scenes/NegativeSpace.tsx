import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  AbsoluteFill,
} from "remotion";
import { COLORS } from "../constants";
import { FONTS } from "../fonts";

const NUM_RINGS = 6;

export const NegativeSpace: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const dotOpacity = interpolate(frame, [1 * fps, 2.5 * fps], [0, 0.75], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const ringProgress = (i: number) =>
    interpolate(
      frame,
      [(1.5 + i * 1.2) * fps, (4.5 + i * 1.2) * fps],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.quad),
      }
    );

  const kanjiOpacity = interpolate(frame, [5 * fps, 7 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const kanjiY = interpolate(frame, [5 * fps, 7 * fps], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const labelOpacity = interpolate(frame, [7 * fps, 8.5 * fps], [0, 0.65], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const quoteOpacity = interpolate(frame, [9 * fps, 11 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        {Array.from({ length: NUM_RINGS }).map((_, i) => {
          const progress = ringProgress(i);
          const maxR = 70 + i * 90;
          const r = progress * maxR;
          const ringOpacity = progress * (1 - progress * 0.72) * 0.45;
          return (
            <circle
              key={i}
              cx={960}
              cy={540}
              r={r}
              fill="none"
              stroke={COLORS.stone}
              strokeWidth={1}
              opacity={ringOpacity}
            />
          );
        })}
        <circle cx={960} cy={540} r={4} fill={COLORS.mist} opacity={dotOpacity} />
      </svg>

      {/* Kanji 余白 (Yohaku) */}
      <div
        style={{
          position: "absolute",
          top: "17%",
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONTS.jp,
          fontSize: 92,
          fontWeight: "400",
          color: COLORS.paper,
          letterSpacing: "0.3em",
          opacity: kanjiOpacity,
          transform: `translateY(${kanjiY}px)`,
        }}
      >
        余白
      </div>

      <div
        style={{
          position: "absolute",
          top: "30%",
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONTS.en,
          fontSize: 19,
          fontWeight: "400",
          color: COLORS.sage,
          letterSpacing: "0.52em",
          opacity: labelOpacity,
        }}
      >
        YOHAKU · NEGATIVE SPACE
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "18%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 680,
          textAlign: "center",
          opacity: quoteOpacity,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.en,
            fontSize: 31,
            fontStyle: "italic",
            fontWeight: "400",
            color: COLORS.mist,
            letterSpacing: "0.04em",
            lineHeight: 1.8,
          }}
        >
          "In emptiness, we find form.
          <br />
          In silence, we hear everything."
        </div>
      </div>
    </AbsoluteFill>
  );
};
