import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { rng } from "./paint";

/**
 * 2D finishing pass over the 3D render: color wash, vignette, film grain and
 * floating dust, matching the textured look of the reference shorts.
 */
export const FilmLook: React.FC<{
  tint?: string;
  tintAmount?: number;
  vignette?: number;
  dust?: number;
}> = ({ tint = "#f0c98a", tintAmount = 0.12, vignette = 0.5, dust = 18 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const rand = rng(99);
  const motes = Array.from({ length: dust }, () => ({
    x: rand() * width,
    y: rand() * height,
    r: 2 + rand() * 4,
    speed: 0.4 + rand() * 0.8,
    phase: rand() * Math.PI * 2,
  }));
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: tint, mixBlendMode: "multiply", opacity: tintAmount }} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 75% 60% at 50% 45%, rgba(0,0,0,0) 55%, rgba(38,24,14,${vignette}) 100%)`,
        }}
      />
      <svg width={width} height={height} style={{ position: "absolute", opacity: 0.16, mixBlendMode: "multiply" }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.45" numOctaves={2} seed={Math.floor(frame / 2)} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={width / 2} height={height / 2} filter="url(#grain)" transform="scale(2)" />
      </svg>
      <svg width={width} height={height} style={{ position: "absolute" }}>
        {motes.map((m, i) => (
          <circle
            key={i}
            cx={m.x + Math.sin(frame * 0.03 + m.phase) * 24}
            cy={(((m.y - frame * m.speed) % height) + height) % height}
            r={m.r}
            fill="rgba(255,244,214,0.55)"
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
