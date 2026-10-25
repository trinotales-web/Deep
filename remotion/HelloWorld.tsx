import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const HelloWorld: React.FC<{ title: string }> = ({ title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, fps], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0b0f", justifyContent: "center", alignItems: "center" }}>
      <h1 style={{ color: "white", fontSize: 140, fontFamily: "sans-serif", opacity }}>{title}</h1>
    </AbsoluteFill>
  );
};
