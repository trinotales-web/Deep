import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  AbsoluteFill,
} from "remotion";
import { COLORS } from "../constants";
import { FONTS } from "../fonts";

const RADIUS = 200;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ensō gently pulsing
  const ensoPulse = interpolate(
    frame,
    [0, 2 * fps, 4 * fps, 6 * fps, 8 * fps],
    [0.28, 0.45, 0.3, 0.48, 0.3],
    { extrapolateRight: "clamp" }
  );

  const goldRingOpacity = interpolate(frame, [0, 4 * fps], [0, 0.18], {
    extrapolateRight: "clamp",
  });

  const quoteOpacity = interpolate(frame, [1 * fps, 3.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const quoteY = interpolate(frame, [1 * fps, 3.5 * fps], [28, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const lineWidth = interpolate(frame, [5 * fps, 7 * fps], [0, 150], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const closingJpOpacity = interpolate(frame, [6.5 * fps, 8.5 * fps], [0, 0.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const labelOpacity = interpolate(frame, [8 * fps, 9.5 * fps], [0, 0.45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Final fade to black at 12s → 15s
  const fadeToBlack = interpolate(frame, [12 * fps, 15 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* Ensō — deliberately incomplete (wabi-sabi!) */}
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <circle
          cx={960}
          cy={510}
          r={RADIUS + 18}
          fill="none"
          stroke={COLORS.gold}
          strokeWidth={1}
          opacity={goldRingOpacity}
        />
        <circle
          cx={960}
          cy={510}
          r={RADIUS}
          fill="none"
          stroke={COLORS.mist}
          strokeWidth={2.5}
          strokeDasharray={`${CIRCUMFERENCE * 0.91} ${CIRCUMFERENCE * 0.09}`}
          strokeLinecap="round"
          transform="rotate(-90, 960, 510)"
          opacity={ensoPulse}
        />
      </svg>

      {/* Main closing quote */}
      <div
        style={{
          position: "absolute",
          top: "29%",
          left: "50%",
          transform: `translate(-50%, ${quoteY}px)`,
          width: 820,
          textAlign: "center",
          opacity: quoteOpacity,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.en,
            fontSize: 34,
            fontWeight: "400",
            fontStyle: "italic",
            color: COLORS.paper,
            lineHeight: 1.85,
            letterSpacing: "0.03em",
          }}
        >
          "Find beauty in the incomplete,
          <br />
          the impermanent,
          <br />
          the imperfect."
        </div>
      </div>

      {/* Gold divider line */}
      <div
        style={{
          position: "absolute",
          top: "57%",
          left: "50%",
          transform: "translateX(-50%)",
          width: lineWidth,
          height: 1,
          backgroundColor: COLORS.gold,
          opacity: 0.62,
        }}
      />

      {/* Japanese closing characters */}
      <div
        style={{
          position: "absolute",
          top: "62%",
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONTS.jp,
          fontSize: 58,
          fontWeight: "400",
          color: COLORS.mist,
          letterSpacing: "0.42em",
          opacity: closingJpOpacity,
        }}
      >
        侘び寂び
      </div>

      <div
        style={{
          position: "absolute",
          top: "74%",
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONTS.en,
          fontSize: 16,
          fontWeight: "400",
          color: COLORS.stone,
          letterSpacing: "0.52em",
          opacity: labelOpacity,
        }}
      >
        WABI-SABI
      </div>

      {/* Fade to black overlay */}
      <AbsoluteFill
        style={{ backgroundColor: COLORS.dark, opacity: fadeToBlack }}
      />
    </AbsoluteFill>
  );
};
