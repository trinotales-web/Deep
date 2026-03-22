import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  AbsoluteFill,
} from "remotion";
import { COLORS } from "../constants";
import { FONTS } from "../fonts";

const RADIUS = 220;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ensō circle draws in over 3.5 seconds
  const ensoProgress = interpolate(frame, [0, 3.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const strokeDashoffset = CIRCUMFERENCE * (1 - ensoProgress);
  const ensoOpacity = interpolate(frame, [0, 1 * fps], [0, 0.38], {
    extrapolateRight: "clamp",
  });

  // Japanese title 侘び寂び fades in at 2.5s
  const titleOpacity = interpolate(frame, [2.5 * fps, 4.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [2.5 * fps, 4.5 * fps], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // "WABI · SABI" at 4.5s
  const subtitleOpacity = interpolate(frame, [4.5 * fps, 6 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Gold divider line at 5.5s
  const lineWidth = interpolate(frame, [5.5 * fps, 7.5 * fps], [0, 140], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Tagline at 7s
  const taglineOpacity = interpolate(frame, [7 * fps, 9 * fps], [0, 0.65], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* Ensō (zen circle) drawing in */}
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <circle
          cx={960}
          cy={500}
          r={RADIUS}
          fill="none"
          stroke={COLORS.mist}
          strokeWidth={2.5}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90, 960, 500)"
          opacity={ensoOpacity}
        />
      </svg>

      {/* Japanese title: 侘び寂び */}
      <div
        style={{
          position: "absolute",
          top: "34%",
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONTS.jp,
          fontSize: 108,
          fontWeight: "400",
          color: COLORS.paper,
          letterSpacing: "0.35em",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        侘び寂び
      </div>

      {/* English: WABI · SABI */}
      <div
        style={{
          position: "absolute",
          top: "53%",
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONTS.en,
          fontSize: 56,
          fontWeight: "400",
          color: COLORS.mist,
          letterSpacing: "0.55em",
          opacity: subtitleOpacity,
        }}
      >
        WABI · SABI
      </div>

      {/* Gold divider */}
      <div
        style={{
          position: "absolute",
          top: "63.5%",
          left: "50%",
          transform: "translateX(-50%)",
          width: lineWidth,
          height: 1,
          backgroundColor: COLORS.gold,
          opacity: 0.65,
        }}
      />

      {/* Tagline */}
      <div
        style={{
          position: "absolute",
          top: "67%",
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONTS.en,
          fontSize: 22,
          fontStyle: "italic",
          fontWeight: "400",
          color: COLORS.mist,
          letterSpacing: "0.2em",
          opacity: taglineOpacity,
        }}
      >
        The Philosophy of Imperfect Beauty
      </div>
    </AbsoluteFill>
  );
};
