import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { useJapanAssets } from "../japan/assets";
import { Defs, ellipseD, Ink, Pencil, Shade } from "../japan/draw";
import { Person } from "../japan/Person";
import { Steamship } from "../japan/Props8";
import { C, FONT_TITLE, INK } from "../japan/theme";

const W = 1280;
const H = 720;

/** Thumbnail lettering: big hand-lettered words with a navy outline and a white halo. */
const Words: React.FC<{ x: number; y: number; size: number; fill: string; text: string; rot?: number }> = ({ x, y, size, fill, text, rot = 0 }) => (
  <g transform={`rotate(${rot} ${x} ${y})`}>
    {[
      { stroke: C.white, sw: size * 0.3, fill: C.white, dx: 0, dy: 0 },
      { stroke: INK, sw: size * 0.13, fill: INK, dx: size * 0.04, dy: size * 0.05 },
      { stroke: INK, sw: size * 0.13, fill, dx: 0, dy: 0 },
    ].map((l, i) => (
      <text
        key={i}
        x={x + l.dx}
        y={y + l.dy}
        fontFamily={FONT_TITLE}
        fontSize={size}
        fill={l.fill}
        stroke={l.stroke}
        strokeWidth={l.sw}
        strokeLinejoin="round"
        paintOrder="stroke"
        letterSpacing={size * 0.02}
      >
        {text}
      </text>
    ))}
  </g>
);

/**
 * Video thumbnail (1280x720) in the series' pencil style: a short, huge title
 * on the left and a close-up of one of the cast reacting on the right.
 * This one is for "The Entire History of Japan": a samurai catching sight of
 * the black ships of 1853.
 */
export const JapanThumbnail: React.FC = () => {
  useJapanAssets();
  const zoom = 3.05;
  const head = { x: 945, y: 410 };
  return (
    <AbsoluteFill style={{ backgroundColor: "#f3ede0" }}>
      <Img src={staticFile("japan/paper.jpg")} style={{ width: W, height: H, objectFit: "cover" }} />
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <Defs frame={0} texScale={1 / zoom} />
        <g filter="url(#wobble)">
          {/* warm sky, a little Fuji, the sea with the black ships coming in */}
          <Shade d={`M0,0 H${W} V${H} H0 Z`} fill="#f2c79a" opacity={0.55} />
          <Pencil d={ellipseD(head.x - 20, head.y - 60, 300)} fill="#e66a43" ink={false} off={[0, 0]} />
          <Pencil d="M300,560 L470,400 Q490,384 510,400 L690,560 Z" fill="#8a9ab8" sw={4} />
          <Pencil d="M440,428 L470,400 Q490,384 510,400 L540,428 Q522,442 506,430 Q490,446 474,430 Q458,442 440,428 Z" fill={C.white} sw={3} />
          <Pencil d={`M-20,560 Q320,548 640,560 T${W + 20},556 L${W + 20},${H + 20} L-20,${H + 20} Z`} fill={C.sea} sw={4} />
          {[600, 640, 690].map((y, i) => (
            <Ink key={y} d={`M${60 + i * 90},${y} q20,-12 40,0 t40,0 M${300 + i * 120},${y + 14} q20,-12 40,0 t40,0`} sw={3} color={C.white} opacity={0.7} />
          ))}
          <Steamship x={300} y={600} s={0.62} f={8} />
          <Steamship x={140} y={590} s={0.4} f={20} />

          {/* the samurai, close up */}
          <g transform={`translate(${head.x},${head.y + 178 * zoom}) scale(${zoom})`}>
            <Person x={0} y={0} tribe="samurai" expr="shock" f={0} blinkOff look={[-0.9, 0.2]} aR={40} aL={8} />
            {/* sweat drops */}
            <Pencil d="M-66,-226 Q-58,-206 -64,-198 Q-74,-202 -66,-226 Z" fill={C.sky} sw={2.5} off={[1, 1]} />
            <Pencil d="M-78,-196 Q-72,-182 -76,-176 Q-84,-180 -78,-196 Z" fill={C.sky} sw={2.5} off={[1, 1]} />
          </g>

          <Words x={36} y={128} size={60} fill={C.white} text="THE ENTIRE" rot={-3} />
          <Words x={36} y={202} size={60} fill={C.white} text="HISTORY OF" rot={-3} />
          <Words x={28} y={378} size={190} fill={C.red} text="JAPAN" rot={-4} />
        </g>
      </svg>
      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile("japan/grain.jpg")})`,
          backgroundSize: "768px 768px",
          mixBlendMode: "multiply",
          opacity: 0.5,
        }}
      />
    </AbsoluteFill>
  );
};
