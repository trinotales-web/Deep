import React from "react";
import { C } from "./theme";
import { blobD, ellipseD, Ink, Pencil, Shade } from "./draw";

/** Portuguese carrack ("black ship") with crossed sails. */
export const Carrack: React.FC<{ x: number; y: number; s?: number; tilt?: number }> = ({ x, y, s = 1, tilt = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${tilt}) scale(${s})`}>
    {[-120, 20, 150].map((mx, i) => {
      const top = [300, 380, 260][i];
      const w = [70, 95, 60][i];
      return (
        <g key={mx}>
          <Pencil d={`M${mx - 5},-70 L${mx - 5},-${top} L${mx + 5},-${top} L${mx + 5},-70 Z`} fill={C.darkBrown} sw={3} />
          {i === 2 ? (
            <Pencil d={`M${mx + 4},-${top - 10} L${mx + 70},-110 L${mx + 4},-110 Z`} fill={C.white} />
          ) : (
            [0, 1].map((k) => {
              const sy = top - 40 - k * 130;
              return (
                <g key={k}>
                  <Pencil d={`M${mx - w},-${sy} Q${mx},-${sy + 14} ${mx + w},-${sy} Q${mx + w + 10},-${sy - 60} ${mx + w - 6},-${sy - 110} Q${mx},-${sy - 96} ${mx - w + 6},-${sy - 110} Q${mx - w - 10},-${sy - 60} ${mx - w},-${sy} Z`} fill={C.white} />
                  <Ink d={`M${mx},-${sy - 12} L${mx},-${sy - 92} M${mx - 30},-${sy - 52} L${mx + 30},-${sy - 52}`} sw={9} color={C.red} />
                </g>
              );
            })
          )}
        </g>
      );
    })}
    <Pencil d="M-260,-80 L230,-80 L200,10 Q0,40 -200,10 Z" fill="#3d3434" />
    <Pencil d="M-260,-80 L-300,-150 L-200,-150 L-190,-80 Z M160,-80 L170,-140 L260,-140 L230,-80 Z" fill="#3d3434" sw={4} />
    <Ink d="M-220,-40 L200,-40" sw={3} color={C.bronze} />
    {[-160, -100, -40, 20, 80, 140].map((px) => (
      <Pencil key={px} d={ellipseD(px, -58, 9, 7)} fill={C.bronze} sw={2} />
    ))}
  </g>
);

/** Forge: anvil and glowing hearth. */
export const Forge: React.FC<{ x: number; y: number; f: number; s?: number }> = ({ x, y, f, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <Pencil d="M-260,0 L-60,0 L-70,-150 L-250,-150 Z" fill={C.gray} />
    <Pencil d="M-240,-150 L-80,-150 L-120,-320 L-200,-320 Z" fill={C.darkGray} />
    <path d={ellipseD(-160, -90, 70, 46)} fill="#f8a24a" opacity={0.6 + 0.2 * Math.sin(f / 3)} filter="url(#soft)" />
    <Pencil d={`M-200,-60 C-206,-90 -180,-110 ${-160 + Math.sin(f / 2) * 4},-130 C-140,-110 -114,-90 -120,-60 Z`} fill={C.lava} sw={3} />
    <Pencil d="M40,0 L120,0 L110,-70 L50,-70 Z" fill={C.darkBrown} />
    <Pencil d="M-20,-70 L200,-70 Q220,-100 180,-110 L20,-110 Q-10,-100 -20,-70 Z" fill={C.iron} />
    <Shade d="M20,-108 L180,-108 L170,-96 L30,-96 Z" fill={C.white} opacity={0.5} />
  </g>
);

/** A neat stack of matchlock guns, `n` of them. */
export const GunPile: React.FC<{ x: number; y: number; n: number; s?: number }> = ({ x, y, n, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {new Array(n).fill(0).map((_, i) => {
      const row = Math.floor(i / 4);
      const col = i % 4;
      return (
        <g key={i} transform={`translate(${col * 18 - 30 + (row % 2) * 9},${-row * 26}) rotate(-8)`}>
          <Pencil d="M-120,-6 L60,-6 L60,6 L-120,6 Z" fill="#3d3d44" sw={2.5} />
          <Pencil d="M40,-10 L110,-16 L118,8 L40,10 Z" fill={C.brown} sw={2.5} />
        </g>
      );
    })}
  </g>
);

/** Smoke puff from a musket shot. */
export const GunSmoke: React.FC<{ x: number; y: number; p: number }> = ({ x, y, p }) => {
  if (p <= 0 || p >= 1) return null;
  const o = p < 0.5 ? 1 : 1 - (p - 0.5) / 0.5;
  return (
    <g opacity={o}>
      {[0, 1, 2].map((i) => (
        <Pencil key={i} d={blobD(x + i * 40 * p + 20, y - i * 14 * p, 30 + p * 40, 24 + p * 30, i + 3, 6, 0.18)} fill={C.white} sw={3} />
      ))}
      {p < 0.25 ? <Pencil d={`M${x - 10},${y} l30,-16 l4,12 l26,-4 l-14,14 l20,12 l-30,0 Z`} fill={C.yellow} sw={2.5} /> : null}
    </g>
  );
};

/** Dizzy stars circling a knocked-out head. */
export const Dizzy: React.FC<{ x: number; y: number; f: number; s?: number }> = ({ x, y, f, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {[0, 1, 2].map((i) => {
      const a = f / 6 + (i * Math.PI * 2) / 3;
      return (
        <Pencil
          key={i}
          d={`M${Math.cos(a) * 60},${Math.sin(a) * 18 - 14} l6,12 l14,2 l-10,9 l3,14 l-13,-7 l-13,7 l3,-14 l-10,-9 l14,-2 Z`}
          fill={C.yellow}
          sw={2}
        />
      );
    })}
  </g>
);

