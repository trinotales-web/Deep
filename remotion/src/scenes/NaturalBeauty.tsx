import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  AbsoluteFill,
} from "remotion";
import { COLORS } from "../constants";
import { FONTS } from "../fonts";

const STONES = [
  { cx: 700, cy: 680, rx: 125, ry: 78, rot: 12 },
  { cx: 960, cy: 710, rx: 92, ry: 60, rot: -6 },
  { cx: 1220, cy: 672, rx: 115, ry: 72, rot: 22 },
  { cx: 820, cy: 742, rx: 68, ry: 48, rot: 8 },
  { cx: 1090, cy: 750, rx: 78, ry: 52, rot: -18 },
  { cx: 570, cy: 740, rx: 55, ry: 40, rot: 30 },
  { cx: 1350, cy: 730, rx: 62, ry: 44, rot: -8 },
];

const MOSS = Array.from({ length: 28 }, (_, i) => {
  const s = i * 97.3;
  return {
    cx: 480 + (Math.sin(s) * 0.5 + 0.5) * 960,
    cy: 620 + (Math.cos(s * 2) * 0.5 + 0.5) * 180,
    r: 4 + (Math.sin(s * 5) * 0.5 + 0.5) * 9,
  };
});

export const NaturalBeauty: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const horizonProgress = interpolate(frame, [0.5 * fps, 3 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const stonesOpacity = interpolate(frame, [0, 3 * fps], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const stonesY = interpolate(frame, [0, 3 * fps], [20, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const mossOpacity = interpolate(frame, [2 * fps, 5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rakeLine = (i: number) =>
    interpolate(frame, [(1.5 + i * 0.25) * fps, (3.5 + i * 0.25) * fps], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const kanjiOpacity = interpolate(frame, [5 * fps, 7 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const kanjiY = interpolate(frame, [5 * fps, 7 * fps], [22, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const quoteOpacity = interpolate(frame, [8 * fps, 10 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        {/* Horizon ground line */}
        <line
          x1={280}
          y1={790}
          x2={280 + horizonProgress * 1360}
          y2={790}
          stroke={COLORS.stone}
          strokeWidth={0.8}
          opacity={0.35}
        />

        {/* Zen garden rake lines */}
        {Array.from({ length: 9 }).map((_, i) => {
          const progress = rakeLine(i);
          const y = 800 + i * 18;
          return (
            <path
              key={i}
              d={`M 300 ${y} Q 960 ${y + 14} 1620 ${y}`}
              fill="none"
              stroke={COLORS.stone}
              strokeWidth={0.6}
              opacity={0.18 * progress}
              strokeDasharray={`${progress * 1400} 1400`}
            />
          );
        })}

        {/* Stones */}
        <g opacity={stonesOpacity} transform={`translate(0, ${stonesY})`}>
          {STONES.map((s, i) => (
            <ellipse
              key={i}
              cx={s.cx}
              cy={s.cy}
              rx={s.rx}
              ry={s.ry}
              fill={COLORS.stone}
              fillOpacity={0.22}
              stroke={COLORS.stone}
              strokeWidth={1}
              opacity={0.7}
              transform={`rotate(${s.rot}, ${s.cx}, ${s.cy})`}
            />
          ))}
        </g>

        {/* Moss (sage green organic dots) */}
        {MOSS.map((m, i) => (
          <circle
            key={i}
            cx={m.cx}
            cy={m.cy}
            r={m.r}
            fill={COLORS.sage}
            opacity={mossOpacity * 0.28}
          />
        ))}

        {/* Hanging branch */}
        <path
          d="M 1500 0 Q 1420 120 1340 180 Q 1280 220 1250 300"
          fill="none"
          stroke={COLORS.stone}
          strokeWidth={1.5}
          opacity={stonesOpacity * 0.3}
          strokeLinecap="round"
        />
      </svg>

      {/* Kanji 自然 (Shizen) */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONTS.jp,
          fontSize: 90,
          fontWeight: "400",
          color: COLORS.paper,
          letterSpacing: "0.3em",
          opacity: kanjiOpacity,
          transform: `translateY(${kanjiY}px)`,
        }}
      >
        自然
      </div>

      <div
        style={{
          position: "absolute",
          top: "22%",
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONTS.en,
          fontSize: 19,
          fontWeight: "400",
          color: COLORS.sage,
          letterSpacing: "0.52em",
          opacity: kanjiOpacity * 0.7,
        }}
      >
        SHIZEN · NATURAL
      </div>

      {/* Lao Tzu quote */}
      <div
        style={{
          position: "absolute",
          top: "32%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 760,
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
            lineHeight: 1.8,
          }}
        >
          "Nature does not hurry,
          <br />
          yet everything is accomplished."
        </div>
        <div
          style={{
            fontFamily: FONTS.en,
            fontSize: 18,
            fontWeight: "400",
            color: COLORS.stone,
            letterSpacing: "0.22em",
            marginTop: 22,
          }}
        >
          — Lao Tzu
        </div>
      </div>
    </AbsoluteFill>
  );
};
