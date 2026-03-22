import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  AbsoluteFill,
} from "remotion";
import { COLORS } from "../constants";
import { FONTS } from "../fonts";

type PetalData = {
  id: number;
  startX: number;
  startY: number;
  driftX: number;
  size: number;
  speed: number;
  delay: number;
  startRotation: number;
  rotationSpeed: number;
  opacity: number;
};

// Deterministic petal generation using golden-angle seeding
const generatePetals = (count: number): PetalData[] =>
  Array.from({ length: count }, (_, i) => {
    const s = i * 137.508;
    const sin = (x: number) => Math.sin(s * x) * 0.5 + 0.5;
    const cos = (x: number) => Math.cos(s * x) * 0.5 + 0.5;
    return {
      id: i,
      startX: sin(1) * 1920,
      startY: -40 - cos(2) * 180,
      driftX: sin(3) * 300 - 150,
      size: 7 + sin(5) * 14,
      speed: 0.35 + cos(7) * 0.55,
      delay: sin(11) * 340,
      startRotation: sin(13) * 360,
      rotationSpeed: cos(17) * 200 - 100,
      opacity: 0.25 + cos(19) * 0.55,
    };
  });

const PETALS = generatePetals(40);

const Petal: React.FC<{
  x: number;
  y: number;
  rx: number;
  rotation: number;
  opacity: number;
}> = ({ x, y, rx, rotation, opacity }) => (
  <ellipse
    cx={x}
    cy={y}
    rx={rx}
    ry={rx * 0.62}
    fill={COLORS.cherry}
    opacity={opacity}
    transform={`rotate(${rotation}, ${x}, ${y})`}
  />
);

export const Impermanence: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Kanji 無常 (Mujo) appears at 0.5s
  const kanjiOpacity = interpolate(frame, [0.5 * fps, 2 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const kanjiY = interpolate(frame, [0.5 * fps, 2 * fps], [28, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // "MUJO · IMPERMANENCE" label at 2s
  const labelOpacity = interpolate(frame, [2 * fps, 3.5 * fps], [0, 0.65], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Haiku lines appear one by one
  const line1Opacity = interpolate(frame, [4 * fps, 5.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const line2Opacity = interpolate(frame, [6 * fps, 7.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const line3Opacity = interpolate(frame, [8 * fps, 9.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* Falling cherry petals */}
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        {PETALS.map((p) => {
          const pf = Math.max(0, frame - p.delay);
          const totalFrames = 450 / p.speed;
          const progress = interpolate(pf, [0, totalFrames], [0, 1], {
            extrapolateRight: "clamp",
          });
          const x = p.startX + p.driftX * progress;
          const y = p.startY + 1280 * progress;
          const rotation = p.startRotation + p.rotationSpeed * progress;
          const fadeOpacity =
            progress < 0.06
              ? (progress / 0.06) * p.opacity
              : progress > 0.88
              ? ((1 - progress) / 0.12) * p.opacity
              : p.opacity;
          return (
            <Petal
              key={p.id}
              x={x}
              y={y}
              rx={p.size}
              rotation={rotation}
              opacity={fadeOpacity}
            />
          );
        })}
      </svg>

      {/* Kanji 無常 */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONTS.jp,
          fontSize: 104,
          fontWeight: "400",
          color: COLORS.paper,
          letterSpacing: "0.2em",
          opacity: kanjiOpacity,
          transform: `translateY(${kanjiY}px)`,
        }}
      >
        無常
      </div>

      {/* Romanization */}
      <div
        style={{
          position: "absolute",
          top: "37%",
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONTS.en,
          fontSize: 20,
          fontWeight: "400",
          color: COLORS.mist,
          letterSpacing: "0.55em",
          opacity: labelOpacity,
        }}
      >
        MUJO · IMPERMANENCE
      </div>

      {/* Haiku */}
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 640,
          textAlign: "center",
        }}
      >
        {[
          { text: "The cherry blossoms", opacity: line1Opacity },
          { text: "Fall without regret or haste", opacity: line2Opacity },
          { text: "Beauty in release", opacity: line3Opacity },
        ].map(({ text, opacity }, i) => (
          <div
            key={i}
            style={{
              fontFamily: FONTS.en,
              fontSize: 32,
              fontWeight: "400",
              fontStyle: "italic",
              color: COLORS.mist,
              letterSpacing: "0.04em",
              lineHeight: 1.9,
              opacity,
            }}
          >
            {text}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
