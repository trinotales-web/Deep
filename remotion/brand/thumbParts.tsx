import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { useJapanAssets } from "../japan/assets";
import { Defs, ellipseD, Ink, Pencil, Pt } from "../japan/draw";
import { C, INK } from "../japan/theme";
import { MarkerText, markerWidth } from "./MarkerText";

/** Pieces shared by the video thumbnails (1280x720). */
export const TW = 1280;
export const TH = 720;

const ThumbDefs: React.FC = () => (
  <defs>
    {/* white cut-out edges, so a figure lifts off the background like a sticker */}
    {[
      ["sticker", 8],
      ["stickerThin", 4],
    ].map(([id, r]) => (
      <filter key={String(id)} id={String(id)} x="-10%" y="-10%" width="120%" height="120%">
        <feMorphology in="SourceAlpha" operator="dilate" radius={Number(r)} result="grown" />
        <feFlood floodColor="#fffdf6" />
        <feComposite in2="grown" operator="in" result="edge" />
        <feMerge>
          <feMergeNode in="edge" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    ))}
    {/* soft halos behind lettering, light or dark */}
    {[
      ["halo", "#fffaf0"],
      ["haloDark", "#141a33"],
    ].map(([id, color]) => (
      <filter key={id} id={id} x="-5%" y="-20%" width="110%" height="140%">
        <feMorphology in="SourceAlpha" operator="dilate" radius={7} result="grown" />
        <feGaussianBlur in="grown" stdDeviation={3} result="soft" />
        <feFlood floodColor={color} />
        <feComposite in2="soft" operator="in" result="edge" />
        <feMerge>
          <feMergeNode in="edge" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    ))}
    <filter id="glow" x="-10%" y="-50%" width="120%" height="200%">
      <feGaussianBlur stdDeviation={6} />
    </filter>
    {[
      ["vignette", "#5a3a22", 0.34],
      ["vignetteDark", "#05070f", 0.55],
    ].map(([id, color, o]) => (
      <radialGradient key={String(id)} id={String(id)} cx="0.5" cy="0.5" r="0.75">
        <stop offset="0.62" stopColor={String(color)} stopOpacity={0} />
        <stop offset="1" stopColor={String(color)} stopOpacity={Number(o)} />
      </radialGradient>
    ))}
  </defs>
);

/** Paper, pencil texture, filters and grain. */
export const ThumbnailFrame: React.FC<{ children: React.ReactNode; vignette?: "warm" | "dark" }> = ({ children, vignette = "warm" }) => {
  useJapanAssets();
  return (
    <AbsoluteFill style={{ backgroundColor: "#f3ede0" }}>
      <Img src={staticFile("japan/paper.jpg")} style={{ width: TW, height: TH, objectFit: "cover" }} />
      <svg width={TW} height={TH} viewBox={`0 0 ${TW} ${TH}`} style={{ position: "absolute", inset: 0 }}>
        <Defs frame={0} texScale={1 / 2} />
        <ThumbDefs />
        {children}
        <rect x={0} y={0} width={TW} height={TH} fill={vignette === "dark" ? "url(#vignetteDark)" : "url(#vignette)"} />
      </svg>
      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile("japan/grain.jpg")})`,
          backgroundSize: "768px 768px",
          mixBlendMode: "multiply",
          opacity: 0.4,
        }}
      />
    </AbsoluteFill>
  );
};

type Ink2 = { fill: string; outline?: string };

/** Marker lettering, left-aligned at x, optionally with an outline round each stroke. */
export const MarkerLine: React.FC<{ text: string; x: number; y: number; cap: number; seed: number; ink: Ink2 }> = ({ text, x, y, cap, seed, ink }) => {
  const cx = x + (markerWidth(text.toUpperCase()) * cap) / 200;
  return (
    <g>
      {ink.outline ? <MarkerText text={text} x={cx} y={y} cap={cap} seed={seed} color={ink.outline} weight={34} /> : null}
      <MarkerText text={text} x={cx} y={y} cap={cap} seed={seed} color={ink.fill} />
    </g>
  );
};

/** A small kicker line over a big title word: "HISTORY OF" / "JAPAN". */
export const Title: React.FC<{
  kicker: string;
  title: string;
  x: number;
  y: number;
  kickerInk?: Ink2;
  titleInk?: Ink2;
  halo?: "light" | "dark" | "none";
  /** Replaces the title line, e.g. to draw it sliced. */
  renderTitle?: (props: { x: number; y: number; cap: number }) => React.ReactNode;
}> = ({ kicker, title, x, y, kickerInk = { fill: "#15161d" }, titleInk = { fill: "#d3302a" }, halo = "light", renderTitle }) => {
  const capK = 104;
  const capT = 196;
  const ty = y + capK + 30;
  return (
    <g filter={halo === "none" ? undefined : halo === "dark" ? "url(#haloDark)" : "url(#halo)"}>
      <MarkerLine text={kicker} x={x} y={y} cap={capK} seed={5} ink={kickerInk} />
      {renderTitle ? renderTitle({ x, y: ty, cap: capT }) : <MarkerLine text={title} x={x} y={ty} cap={capT} seed={9} ink={titleInk} />}
    </g>
  );
};

/** An arm from shoulder to hand, in the cast's style but any length. */
export const Limb: React.FC<{ from: Pt; to: Pt; color: string; hand?: boolean }> = ({ from, to, color, hand }) => {
  const a = (Math.atan2(to[1] - from[1], to[0] - from[0]) * 180) / Math.PI - 90;
  const len = Math.hypot(to[0] - from[0], to[1] - from[1]);
  return (
    <g>
      <g transform={`translate(${from[0]},${from[1]}) rotate(${a})`}>
        <Pencil d={`M-10,-4 Q-12,${len * 0.5} -8,${len} L8,${len} Q12,${len * 0.5} 10,-4 Z`} fill={color} sw={3.5} />
      </g>
      {hand ? <Pencil d={ellipseD(to[0], to[1], 11, 11)} fill={C.skin} sw={3.5} /> : null}
    </g>
  );
};

/**
 * A katana held in both hands, in cast units (from the feet). `low` is the
 * hand at the pommel end; `angle` points from there to the tip (degrees,
 * 0 = right, -90 = straight up). Arms run from the figure's shoulders.
 */
export const KatanaGrip: React.FC<{ low: Pt; angle: number; length?: number; arm: string }> = ({ low, angle, length = 260, arm }) => {
  const dir: Pt = [Math.cos((angle * Math.PI) / 180), Math.sin((angle * Math.PI) / 180)];
  const high: Pt = [low[0] + dir[0] * 30, low[1] + dir[1] * 30];
  const guard: Pt = [low[0] + dir[0] * 44, low[1] + dir[1] * 44];
  const tip: Pt = [guard[0] + dir[0] * length, guard[1] + dir[1] * length];
  const n: Pt = [-dir[1], dir[0]];
  const at = (p: Pt, d: number, w: number): Pt => [p[0] + dir[0] * d + n[0] * w, p[1] + dir[1] * d + n[1] * w];
  const poly = (pts: Pt[]) => `M${pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" L")} Z`;
  const handleStart = at(low, -16, 0);
  return (
    <g>
      <Limb from={[-30, -126]} to={low} color={arm} />
      <Limb from={[30, -126]} to={high} color={arm} />
      <Pencil d={poly([at(guard, 0, -6), at(guard, 0, 6), at(tip, -30, 4), at(tip, 0, -1), at(tip, -10, -6)])} fill="#e9edf2" sw={3} />
      <Ink d={`M${at(guard, 8, -2).join(",")} L${at(tip, -40, -2).join(",")}`} sw={2.5} color="#ffffff" opacity={0.9} />
      <Pencil d={poly([at(handleStart, 0, -6), at(handleStart, 0, 6), at(guard, -2, 6), at(guard, -2, -6)])} fill="#2b2b35" sw={3} />
      {[0.2, 0.45, 0.7].map((k) => (
        <Ink key={k} d={`M${at(handleStart, 60 * k, -6).join(",")} L${at(handleStart, 60 * k + 8, 6).join(",")}`} sw={1.6} color={C.white} />
      ))}
      <g transform={`translate(${guard[0]},${guard[1]}) rotate(${angle})`}>
        <Pencil d={ellipseD(0, 0, 5, 13)} fill={C.bronze} sw={2.5} />
      </g>
      <Pencil d={ellipseD(low[0], low[1], 11, 11)} fill={C.skin} sw={3.5} />
      <Pencil d={ellipseD(high[0], high[1], 11, 11)} fill={C.skin} sw={3.5} />
    </g>
  );
};

/** A sweat drop flying off a panicking face. */
export const Sweat: React.FC<{ x: number; y: number; s: number; rot: number }> = ({ x, y, s, rot }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <Pencil d="M0,-22 Q12,0 8,10 Q0,18 -8,10 Q-12,0 0,-22 Z" fill="#a9d4f2" sw={3} off={[1, 1]} />
    <path d="M-3,2 Q-4,8 0,10" stroke="#ffffff" strokeWidth={2.5} fill="none" strokeLinecap="round" />
  </g>
);

/** A cherry blossom petal, notched at the tip. */
export const Petal: React.FC<{ x: number; y: number; s: number; rot: number; fill?: string }> = ({ x, y, s, rot, fill = C.pink }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <path d="M0,10 Q-9,2 -7,-6 Q-4,-11 -1,-8 L0,-5 L1,-8 Q4,-11 7,-6 Q9,2 0,10 Z" fill={fill} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
  </g>
);
