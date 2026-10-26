import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { useJapanAssets } from "../japan/assets";
import { Defs, ellipseD, Ink, Pencil, Pt, Shade, smooth } from "../japan/draw";
import { C, INK } from "../japan/theme";

const S = 800;

/**
 * The mascot is drawn with the same parts, proportions and line weights as the
 * series' Person cast (head radius 46, those eyes, cheeks and brows), in
 * head-centred units, so it can be framed as a close-up.
 */
export type Mood = "wow" | "smirk" | "grin";

const EYE = { rx: 11.5, ry: 13.5 };

const Eye: React.FC<{ x: number; y: number; look?: Pt; k?: number }> = ({ x, y, look = [0, 0], k = 1 }) => (
  <g>
    <path d={ellipseD(x, y, EYE.rx * k, EYE.ry * k)} fill={C.white} stroke={INK} strokeWidth={3.5} />
    <path d={ellipseD(x + look[0] * 4 * k, y + 2 + look[1] * 4 * k, 7.5 * k, 8.2 * k)} fill={INK} />
    <path d={ellipseD(x + look[0] * 4 * k + 2.5 * k, y - 1 + look[1] * 4 * k, 2.4 * k)} fill={C.white} />
  </g>
);

const Mouth: React.FC<{ mood: Mood }> = ({ mood }) => {
  const y = 22;
  if (mood === "wow") return <Pencil d={ellipseD(-2, y + 5, 8, 10)} fill="#7a2f2a" sw={3.5} off={[1, 1]} />;
  if (mood === "grin")
    return (
      <g>
        <path d={`M-20,${y - 4} Q0,${y - 8} 20,${y - 4} Q16,${y + 18} 0,${y + 19} Q-16,${y + 18} -20,${y - 4} Z`} fill={C.white} stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
        <Ink d={`M-18,${y + 3} Q0,${y + 6} 18,${y + 3} M-7,${y - 6} V${y + 16} M7,${y - 6} V${y + 16}`} sw={2} />
      </g>
    );
  return <Ink d={`M-14,${y + 2} Q-2,${y + 10} 14,${y - 4}`} sw={4} />;
};

/** The explorer's hat, sitting a little back so the brows show. */
const Hat: React.FC = () => (
  <g transform="rotate(7 0 -54)">
    <Pencil d={ellipseD(0, -54, 80, 9)} fill="#b98a52" sw={4} />
    <Pencil d="M-42,-56 C-46,-86 -34,-108 -12,-104 Q0,-94 12,-104 C34,-108 46,-86 42,-56 Q0,-63 -42,-56 Z" fill="#c99a5e" sw={4} />
    <Pencil d="M-43,-70 Q0,-77 43,-70 L42,-58 Q0,-65 -42,-58 Z" fill={C.darkBrown} sw={3} />
    <Ink d="M-6,-98 Q0,-76 4,-64" sw={2} opacity={0.45} />
  </g>
);

/** A curious history-explorer peering through a magnifying glass. */
const Mascot: React.FC<{ mood: Mood }> = ({ mood }) => {
  const lens = { x: 22, y: -2, r: 23 };
  const hand: Pt = [59, 80];
  const shoulder: Pt = [30, 52];
  const armA = Math.atan2(hand[1] - shoulder[1], hand[0] - shoulder[0]) * (180 / Math.PI) - 90;
  const armLen = Math.hypot(hand[0] - shoulder[0], hand[1] - shoulder[1]);
  const face = (
    <g>
      <Pencil d={ellipseD(0, 0, 46, 45)} fill={C.skin} sw={4} />
      <Shade d={ellipseD(27, 18, 9, 6)} fill={C.pink} opacity={0.75} />
      <Shade d={ellipseD(-27, 18, 9, 6)} fill={C.pink} opacity={0.75} />
    </g>
  );
  return (
    <g>
      {/* body: the Person tunic with an explorer's neckerchief */}
      <Pencil d="M-30,42 Q0,36 30,42 L44,128 Q0,136 -44,128 Z" fill="#5f8f6a" sw={4} />
      <Ink d="M-16,46 L0,70 L16,46" sw={3} />
      <Pencil d="M-22,40 Q0,52 22,40 L12,58 Q0,64 -12,58 Z" fill={C.red} sw={3} />
      <Pencil d="M-4,56 L-14,84 L-2,80 L4,88 L8,58 Z" fill={C.red} sw={2.5} />
      {/* back arm */}
      <g transform="translate(-30,52) rotate(14)">
        <Pencil d="M-9,-4 Q-11,29 -7,54 L7,54 Q11,29 9,-4 Z" fill="#5f8f6a" sw={3.5} />
      </g>
      {/* ears, head, hair */}
      <Pencil d={ellipseD(-48, 6, 9, 12)} fill={C.skin} sw={3.5} />
      <Pencil d={ellipseD(48, 6, 9, 12)} fill={C.skin} sw={3.5} />
      {face}
      <Pencil d="M-47,2 C-50,-44 -20,-52 0,-51 C20,-52 50,-44 47,2 C44,-18 30,-28 2,-30 C-30,-28 -44,-18 -47,2 Z" fill={C.hair} sw={3.5} />
      <Hat />
      {/* the bare eye, its brow raised: "wait... really?" */}
      <Eye x={-17} y={-2} look={[0.2, 0.05]} />
      <Ink d="M-31,-23 Q-20,-38 -6,-29" sw={4.5} />
      <Mouth mood={mood} />
      {/* magnifying glass: the eye behind it, drawn 1.6x */}
      <g transform={`rotate(-24 ${lens.x} ${lens.y})`}>
        <Pencil d={`M${lens.x - 6},${lens.y + lens.r + 2} L${lens.x + 6},${lens.y + lens.r + 2} L${lens.x + 7},${lens.y + lens.r + 80} L${lens.x - 7},${lens.y + lens.r + 80} Z`} fill={C.darkBrown} sw={3.5} />
      </g>
      <clipPath id="lensClip">
        <path d={ellipseD(lens.x, lens.y, lens.r)} />
      </clipPath>
      <g clipPath="url(#lensClip)">
        <g transform={`translate(${lens.x},${lens.y}) scale(1.6) translate(${-lens.x},${-lens.y})`}>
          {face}
          <Eye x={17} y={-2} look={[-0.15, 0.05]} />
          <Ink d="M9,-27 Q19,-34 29,-27" sw={4.5} />
        </g>
        <path d={ellipseD(lens.x, lens.y, lens.r)} fill={C.sky} opacity={0.18} />
        <Ink d={`M${lens.x - 15},${lens.y - 9} Q${lens.x - 11},${lens.y - 17} ${lens.x - 2},${lens.y - 19}`} sw={3.5} color={C.white} opacity={0.9} />
      </g>
      <Ink d={ellipseD(lens.x, lens.y, lens.r + 3)} sw={10} color={INK} />
      <Ink d={ellipseD(lens.x, lens.y, lens.r + 3)} sw={5} color={C.bronze} />
      {/* front arm, hand on the handle */}
      <g transform={`translate(${shoulder[0]},${shoulder[1]}) rotate(${armA})`}>
        <Pencil d={`M-9,-4 Q-11,${armLen * 0.5} -7,${armLen - 4} L7,${armLen - 4} Q11,${armLen * 0.5} 9,-4 Z`} fill="#5f8f6a" sw={3.5} />
      </g>
      <Pencil d={ellipseD(hand[0], hand[1], 11, 11)} fill={C.skin} sw={3.5} />
    </g>
  );
};

/** Americas on the left, Europe and Africa on the right; the mascot covers the middle. */
const CONTINENTS: Pt[][] = [
  [[-0.92, -0.58], [-0.66, -0.8], [-0.38, -0.76], [-0.3, -0.58], [-0.4, -0.44], [-0.32, -0.3], [-0.44, -0.16], [-0.56, -0.06], [-0.64, -0.2], [-0.82, -0.24], [-0.96, -0.36]],
  [[-0.46, 0.04], [-0.26, 0.1], [-0.13, 0.24], [-0.19, 0.42], [-0.31, 0.62], [-0.39, 0.84], [-0.47, 0.64], [-0.54, 0.36], [-0.57, 0.16]],
  [[0.16, -0.74], [0.36, -0.82], [0.58, -0.72], [0.66, -0.56], [0.48, -0.46], [0.32, -0.42], [0.2, -0.52]],
  [[0.12, -0.32], [0.42, -0.38], [0.62, -0.24], [0.74, -0.06], [0.62, 0.16], [0.52, 0.42], [0.4, 0.62], [0.31, 0.46], [0.26, 0.16], [0.08, 0.02], [0.05, -0.16]],
  [[0.72, 0.3], [0.8, 0.22], [0.84, 0.36], [0.76, 0.48]],
];

const Globe: React.FC<{ x: number; y: number; r: number; u: number }> = ({ x, y, r, u }) => {
  const at = ([gx, gy]: Pt): Pt => [x + gx * r, y + gy * r];
  return (
    <g>
      <Pencil d={ellipseD(x, y, r)} fill={C.sea} sw={6 * u} off={[1, 1]} />
      {[0.35, 0.75].map((k) => (
        <Ink key={k} d={ellipseD(x, y, r * k, r)} sw={2.5 * u} color={C.white} opacity={0.35} />
      ))}
      {[-0.5, 0, 0.5].map((k) => (
        <Ink key={k} d={ellipseD(x, y + k * r, r * Math.sqrt(1 - k * k), r * 0.08)} sw={2.5 * u} color={C.white} opacity={0.35} />
      ))}
      {CONTINENTS.map((pts, i) => (
        <Pencil key={i} d={smooth(pts.map(at), true, 0.8)} fill={C.green} sw={4 * u} off={[1, 1]} />
      ))}
    </g>
  );
};

/** YouTube channel picture, no text: the channel's mascot in close-up, in the series' colored-pencil style. */
export const ChannelLogo: React.FC<{ mood: Mood; zoom: number; background: string }> = ({ mood, zoom, background }) => {
  useJapanAssets();
  const u = 1 / zoom; // everything is drawn zoomed, so the pencil grain stays as fine as in the videos
  const head = { x: 392, y: 414 };
  return (
    <AbsoluteFill style={{ backgroundColor: "#f3ede0" }}>
      <Img src={staticFile("japan/paper.jpg")} style={{ width: S, height: S, objectFit: "cover" }} />
      <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} style={{ position: "absolute", inset: 0 }}>
        <Defs frame={0} texScale={u} />
        <g filter="url(#wobble)">
          <g transform={`scale(${zoom})`}>
            <Shade d={`M0,0 H${S * u} V${S * u} H0 Z`} fill={background} opacity={0.8} />
            <Globe x={400 * u} y={400 * u} r={352 * u} u={u} />
          </g>
          <g transform={`translate(${head.x},${head.y}) scale(${zoom})`}>
            <Mascot mood={mood} />
          </g>
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

export const channelLogoDefaults = { mood: "grin" as Mood, zoom: 3.6, background: C.yellow };
