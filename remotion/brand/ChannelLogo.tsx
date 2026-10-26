import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { useJapanAssets } from "../japan/assets";
import { Defs, ellipseD, Ink, Pencil, Shade, Sparkle } from "../japan/draw";
import { C, FONT_TITLE, INK } from "../japan/theme";

const S = 800;
const MID = S / 2;
const SUN = { x: MID, y: 318, r: 205 };

/** A storybook open book, the channel's "history told as a story" mark. */
const Book: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const left = `M${x},${y - 30} Q${x - 50},${y - 52} ${x - 112},${y - 40} L${x - 112},${y + 30} Q${x - 50},${y + 18} ${x},${y + 40} Z`;
  const right = `M${x},${y - 30} Q${x + 50},${y - 52} ${x + 112},${y - 40} L${x + 112},${y + 30} Q${x + 50},${y + 18} ${x},${y + 40} Z`;
  const lines = [-18, -2, 14].map((dy) => [
    `M${x - 92},${y + dy - 8} Q${x - 52},${y + dy - 18} ${x - 18},${y + dy - 2}`,
    `M${x + 18},${y + dy - 2} Q${x + 52},${y + dy - 18} ${x + 92},${y + dy - 8}`,
  ]);
  return (
    <g>
      <Pencil d={`M${x - 120},${y + 36} Q${x - 50},${y + 26} ${x},${y + 50} Q${x + 50},${y + 26} ${x + 120},${y + 36} L${x + 120},${y - 30} L${x - 120},${y - 30} Z`} fill={C.terracotta} sw={4} />
      <Pencil d={left} fill={C.white} sw={4} />
      <Pencil d={right} fill={C.white} sw={4} />
      {lines.flat().map((d, i) => (
        <Ink key={i} d={d} sw={2.5} opacity={0.55} />
      ))}
    </g>
  );
};

/** YouTube channel picture: the series' red sun, the name in its title lettering, a ribbon and a storybook. */
export const ChannelLogo: React.FC<{ name: string; tagline: string }> = ({ name, tagline }) => {
  useJapanAssets();
  const tilt = name.split("").map((_, i) => (i % 2 ? 4 : -4));
  const bounce = name.split("").map((_, i) => (i === 0 ? 0 : i % 2 ? 7 : -7));
  return (
    <AbsoluteFill style={{ backgroundColor: "#f3ede0" }}>
      <Img src={staticFile("japan/paper.jpg")} style={{ width: S, height: S, objectFit: "cover" }} />
      <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} style={{ position: "absolute", inset: 0 }}>
        <Defs frame={0} boil={1.4} />
        <defs>
          <path id="ribbonText" d={`M165,566 Q${MID},612 635,566`} />
        </defs>
        <g filter="url(#wobble)">
          {/* badge rings, so the round crop has an edge on light and dark pages */}
          <Pencil d={ellipseD(MID, MID, 374)} sw={8} />
          <Ink d={ellipseD(MID, MID, 352)} sw={3.5} dash="3 13" />

          <Sparkle x={128} y={228} s={1.15} />
          <Sparkle x={676} y={176} s={0.9} />
          <Sparkle x={690} y={402} s={0.6} />
          <Sparkle x={112} y={430} s={0.55} />

          <Pencil d={ellipseD(SUN.x, SUN.y, SUN.r)} fill="#e66a43" sw={6} />
          <Shade d={ellipseD(SUN.x + 34, SUN.y + 36, SUN.r * 0.68)} fill={C.lava} opacity={0.3} />

          {/* the name, lettered like the "Japan" title */}
          <g transform={`rotate(-5 ${MID} 360)`}>
            {[
              { dx: 5, dy: 7, fill: INK, stroke: INK },
              { dx: 0, dy: 0, fill: C.white, stroke: INK },
            ].map((l, k) => (
              <text
                key={k}
                x={MID + l.dx}
                y={392 + l.dy}
                fontFamily={FONT_TITLE}
                fontSize={166}
                textAnchor="middle"
                fill={l.fill}
                stroke={l.stroke}
                strokeWidth={13}
                paintOrder="stroke"
                strokeLinejoin="round"
                rotate={tilt.join(" ")}
                dy={bounce.join(" ")}
                letterSpacing={-2}
              >
                {name}
              </text>
            ))}
          </g>

          {/* ribbon */}
          <Pencil d="M162,540 L100,548 L126,588 L100,628 L170,626 Z" fill="#17204a" sw={5} />
          <Pencil d="M638,540 L700,548 L674,588 L700,628 L630,626 Z" fill="#17204a" sw={5} />
          <Pencil d={`M150,510 Q${MID},564 650,510 L650,610 Q${MID},664 150,610 Z`} fill="#26336d" sw={6} />
          <text fontFamily={FONT_TITLE} fontSize={84} fill={C.white} letterSpacing={10} dy={28}>
            <textPath href="#ribbonText" startOffset="50%" textAnchor="middle">
              {tagline}
            </textPath>
          </text>

          <Book x={MID} y={698} />
        </g>
      </svg>
      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile("japan/grain.jpg")})`,
          backgroundSize: "768px 768px",
          mixBlendMode: "multiply",
          opacity: 0.55,
        }}
      />
    </AbsoluteFill>
  );
};
