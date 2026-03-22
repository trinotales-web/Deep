import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  AbsoluteFill,
} from "remotion";
import { COLORS } from "../constants";
import { FONTS } from "../fonts";

const BOWL_PATH =
  "M 760 280 Q 720 380 700 520 Q 685 640 730 700 L 1190 700 Q 1235 640 1220 520 Q 1200 380 1160 280 Z";

const CRACKS: { path: string; length: number }[] = [
  { path: "M 860 340 Q 840 420 835 500 Q 830 560 845 640", length: 320 },
  { path: "M 860 340 Q 930 370 980 390 Q 1020 415 1060 460", length: 240 },
  { path: "M 835 500 Q 790 530 765 580 Q 748 620 755 665", length: 200 },
  { path: "M 980 390 Q 990 460 985 530 Q 978 600 975 660", length: 280 },
  { path: "M 1060 460 Q 1080 520 1070 590 Q 1060 645 1030 685", length: 240 },
];

export const Imperfection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bowlOpacity = interpolate(frame, [0, 2 * fps], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const crackProgress = (i: number) =>
    interpolate(
      frame,
      [(2.5 + i * 0.9) * fps, (4 + i * 0.9) * fps],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.quad),
      }
    );

  const kanjiOpacity = interpolate(frame, [7 * fps, 8.5 * fps], [0, 1], {
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
        <path
          d={BOWL_PATH}
          fill={COLORS.stone}
          fillOpacity={0.08}
          opacity={bowlOpacity}
        />
        <path
          d={BOWL_PATH}
          fill="none"
          stroke={COLORS.stone}
          strokeWidth={1.5}
          opacity={bowlOpacity * 0.5}
        />

        {CRACKS.map((crack, i) => {
          const progress = crackProgress(i);
          return (
            <path
              key={i}
              d={crack.path}
              fill="none"
              stroke={COLORS.gold}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeDasharray={crack.length}
              strokeDashoffset={crack.length * (1 - progress)}
              opacity={0.88}
            />
          );
        })}

        {crackProgress(0) > 0.15 && (
          <circle
            cx={860}
            cy={340}
            r={5}
            fill={COLORS.gold}
            opacity={Math.min(crackProgress(0) * 2, 0.9)}
          />
        )}
      </svg>

      {/* Kanji 金継ぎ */}
      <div
        style={{
          position: "absolute",
          top: "12%",
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONTS.jp,
          fontSize: 78,
          fontWeight: "400",
          color: COLORS.paper,
          letterSpacing: "0.32em",
          opacity: kanjiOpacity,
        }}
      >
        金継ぎ
      </div>

      <div
        style={{
          position: "absolute",
          top: "23%",
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONTS.en,
          fontSize: 19,
          fontWeight: "400",
          color: COLORS.gold,
          letterSpacing: "0.52em",
          opacity: kanjiOpacity * 0.75,
        }}
      >
        KINTSUGI · GOLDEN REPAIR
      </div>

      {/* Quote */}
      <div
        style={{
          position: "absolute",
          bottom: "14%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 720,
          textAlign: "center",
          opacity: quoteOpacity,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.en,
            fontSize: 30,
            fontWeight: "400",
            fontStyle: "italic",
            color: COLORS.mist,
            lineHeight: 1.75,
            letterSpacing: "0.02em",
          }}
        >
          "Where you are broken, there you are golden.
          <br />
          Our scars become our most beautiful places."
        </div>
      </div>
    </AbsoluteFill>
  );
};
