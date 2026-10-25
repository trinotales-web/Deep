import React from "react";
import { C, INK } from "./theme";
import { DrawOn, Ink, Pencil, Pt, Shade, smooth } from "./draw";

// Hand-drawn East Asia, roughly lon 112-148E, lat 29-47N.
export const MAP_W = 1920;
export const MAP_H = 1219;
export const proj = (lon: number, lat: number): Pt => [(lon - 112) * 53.33, (47 - lat) * 67.7];

const P = (ll: [number, number][]) => ll.map(([lo, la]) => proj(lo, la));

const MAINLAND = P([
  [105, 48.5], [139.6, 48.5], [138.6, 46.8], [137.4, 45.4], [135.6, 43.9], [133.6, 42.8], [132.2, 43.25],
  [131.6, 42.7], [130.7, 42.3], [129.8, 41.7], [129.6, 40.9], [128.6, 40.2], [127.5, 39.75], [127.4, 39.2],
  [128.3, 38.5], [128.9, 37.7], [129.4, 36.8], [129.5, 36.0], [129.3, 35.4], [129.0, 35.1], [128.2, 34.85],
  [127.5, 34.6], [126.6, 34.4], [126.3, 34.85], [126.5, 35.6], [126.75, 36.3], [126.5, 36.8], [126.7, 37.4],
  [126.2, 37.8], [125.3, 37.7], [125.1, 38.6], [125.3, 39.5], [124.3, 39.9], [123.3, 39.7], [122.2, 39.3],
  [121.3, 38.8], [121.6, 39.6], [122.2, 40.4], [121.5, 40.9], [120.5, 40.3], [119.5, 39.8], [118.5, 39.2],
  [117.7, 38.9], [118.0, 38.1], [118.8, 37.4], [119.9, 37.2], [120.8, 37.8], [121.4, 37.6], [122.5, 37.4],
  [122.4, 36.9], [121.0, 36.6], [120.3, 36.1], [119.5, 35.4], [119.2, 34.6], [120.3, 34.2], [120.8, 33.0],
  [121.0, 32.2], [121.9, 31.7], [121.9, 30.9], [121.0, 30.4], [121.9, 29.9], [121.6, 28.6], [105, 28.6],
]);

export const HONSHU = P([
  [130.9, 34.0], [131.4, 34.45], [132.1, 34.9], [132.7, 35.45], [133.3, 35.6], [134.2, 35.55], [135.2, 35.6],
  [136.05, 35.7], [135.95, 36.2], [136.6, 36.6], [136.75, 36.95], [136.8, 37.3], [137.3, 37.5], [137.0, 36.95],
  [137.3, 36.75], [138.2, 37.15], [138.85, 37.75], [139.5, 38.4], [139.85, 39.0], [139.75, 39.9], [140.05, 40.6],
  [140.35, 41.2], [140.9, 40.9], [141.2, 41.2], [141.45, 41.45], [141.45, 40.6], [141.95, 39.65], [141.6, 38.6],
  [141.05, 38.25], [141.0, 37.2], [140.65, 36.4], [140.85, 35.7], [140.35, 35.15], [139.85, 34.95], [139.8, 35.4],
  [139.65, 35.3], [139.15, 35.25], [138.85, 34.6], [138.75, 35.1], [138.2, 34.65], [137.3, 34.65], [136.9, 35.0],
  [136.6, 34.55], [136.85, 34.3], [136.2, 33.95], [135.75, 33.45], [135.15, 33.8], [135.15, 34.3], [135.4, 34.65],
  [134.6, 34.75], [133.9, 34.6], [133.2, 34.4], [132.45, 34.3], [131.85, 33.95], [131.0, 33.95],
]);

export const KYUSHU = P([
  [130.9, 33.95], [131.15, 33.6], [131.7, 33.55], [131.7, 33.2], [131.95, 32.75], [131.75, 32.3], [131.45, 31.6],
  [131.1, 31.35], [130.7, 31.0], [130.55, 31.3], [130.2, 31.2], [130.15, 31.75], [130.4, 32.15], [130.2, 32.5],
  [129.8, 32.7], [129.75, 33.1], [129.6, 33.35], [130.1, 33.55], [130.45, 33.85],
]);

export const SHIKOKU = P([
  [132.0, 33.38], [132.5, 32.95], [132.95, 32.72], [133.3, 33.35], [133.65, 33.5], [134.15, 33.25],
  [134.35, 33.5], [134.7, 33.85], [134.65, 34.2], [134.05, 34.35], [133.55, 34.2], [132.95, 34.05],
  [132.7, 33.85], [132.25, 33.75],
]);

export const HOKKAIDO = P([
  [139.95, 41.45], [140.75, 41.75], [141.15, 41.95], [140.6, 42.15], [140.9, 42.45], [141.6, 42.6],
  [142.4, 42.2], [143.25, 41.92], [143.6, 42.6], [144.4, 42.95], [145.1, 43.0], [145.75, 43.35], [145.2, 43.6],
  [145.3, 44.3], [144.4, 44.0], [143.3, 44.3], [142.5, 45.0], [141.95, 45.5], [141.65, 45.2], [141.65, 44.4],
  [141.65, 43.95], [141.3, 43.3], [140.95, 43.2], [140.35, 43.3], [140.45, 42.85], [139.85, 42.6], [140.05, 42.0],
]);

const SAKHALIN = P([[141.75, 48.5], [141.85, 46.6], [142.05, 45.95], [142.4, 46.6], [142.8, 46.7], [143.4, 46.2], [143.6, 46.6], [143.3, 48.5]]);
const SMALL: Pt[][] = [
  P([[129.2, 34.15], [129.45, 34.25], [129.4, 34.7], [129.2, 34.55]]), // Tsushima
  P([[138.2, 37.85], [138.5, 37.8], [138.55, 38.25], [138.3, 38.3]]), // Sado
  P([[126.15, 33.35], [126.6, 33.2], [126.95, 33.45], [126.5, 33.55]]), // Jeju
  P([[133.1, 36.1], [133.35, 36.15], [133.3, 36.35]]), // Oki
];

export const JAPAN_ISLANDS = [HONSHU, KYUSHU, SHIKOKU, HOKKAIDO];
export const japanD = JAPAN_ISLANDS.map((pts) => smooth(pts));

const mountainDoodles: Pt[] = P([
  [114, 40.5], [116, 42], [118.5, 43], [121.5, 44.2], [125, 43.3], [127.5, 42], [128.5, 44.5], [132.5, 45.5],
  [115, 37], [113.5, 34], [117, 31], [124, 41.6], [127, 38.6], [128, 36.4], [114.5, 44.6],
]);
const japanPeaks: Pt[] = P([
  [138.6, 35.4], [137.6, 36.2], [139.8, 37.6], [140.6, 39.6], [131.0, 32.9], [130.7, 31.6], [142.8, 43.5],
  [133.5, 33.8], [135.8, 35.0], [140.3, 38.5],
]);

const Peak: React.FC<{ x: number; y: number; s?: number; volcano?: boolean }> = ({ x, y, s = 1, volcano }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <Shade d="M-16,8 L-2,-18 L2,-18 L16,8 Z" fill={volcano ? C.brown : C.darkGreen} opacity={0.55} />
    <Ink d={volcano ? "M-16,8 L-4,-16 L4,-16 L16,8" : "M-16,8 L0,-18 L16,8"} sw={3} />
    {volcano ? <Ink d="M-2,-22 q-6,-8 0,-14 q6,-6 0,-12" sw={2.5} /> : null}
  </g>
);

export type MapStyle = {
  draw?: number; // coastline draw-on progress (0-1); fill fades in after
  landFill?: number;
  japanGlow?: number;
  islandScale?: number[]; // per-island bounce (Honshu, Kyushu, Shikoku, Hokkaido)
  f: number;
};

const centroid = (pts: Pt[]): Pt => [
  pts.reduce((a, p) => a + p[0], 0) / pts.length,
  pts.reduce((a, p) => a + p[1], 0) / pts.length,
];
export const ISLAND_CENTERS = JAPAN_ISLANDS.map(centroid);
const around = (i: number, s: number | undefined) =>
  s === undefined || s === 1
    ? undefined
    : `translate(${ISLAND_CENTERS[i][0]},${ISLAND_CENTERS[i][1]}) scale(${s}) translate(${-ISLAND_CENTERS[i][0]},${-ISLAND_CENTERS[i][1]})`;

/** The pencil map. Everything in map coordinates. */
export const MapArt: React.FC<MapStyle> = ({ draw = 1, landFill = 1, japanGlow = 0, islandScale = [], f }) => {
  const wave = (x: number, y: number, k: number) => {
    const o = Math.sin(f / 18 + k) * 6;
    return <Ink key={k} d={`M${x + o},${y} q12,-10 24,0 q12,10 24,0`} sw={3} opacity={0.55} />;
  };
  const seaWaves: Pt[] = P([
    [134, 40], [136.5, 41.8], [133, 38.5], [145, 40], [146, 37], [143.5, 33.5], [137, 32], [133, 31.2], [125, 31],
    [124, 35.5], [120.6, 35], [131.5, 37.7], [139.5, 44.5], [123, 32.8], [145.5, 34.6],
  ]);
  return (
    <g>
      {/* sea */}
      <Shade d={`M-400,-300 H${MAP_W + 400} V${MAP_H + 300} H-400 Z`} fill={C.sky} opacity={0.75} />
      {seaWaves.map(([x, y], i) => wave(x, y, i))}
      {/* land */}
      <g opacity={landFill}>
        <Pencil d={smooth(MAINLAND, true, 0.6)} fill={C.moss} ink={false} />
        <Pencil d={smooth(SAKHALIN, true, 0.6)} fill={C.moss} ink={false} />
        {SMALL.map((pts, i) => (
          <Pencil key={i} d={smooth(pts)} fill={C.moss} ink={false} />
        ))}
        {japanD.map((d, i) => (
          <g key={i} transform={around(i, islandScale[i])}>
            <Pencil d={d} fill={C.green} ink={false} />
          </g>
        ))}
        {japanGlow > 0
          ? japanD.map((d, i) => (
              <path key={i} d={d} fill="none" stroke={C.yellow} strokeWidth={28 * japanGlow} strokeLinejoin="round" opacity={0.55} />
            ))
          : null}
        {mountainDoodles.map(([x, y], i) => (
          <Peak key={i} x={x} y={y} s={1.1} />
        ))}
        {japanPeaks.map(([x, y], i) => (
          <Peak key={i} x={x} y={y} s={0.75} volcano={i % 3 === 0} />
        ))}
      </g>
      {/* coastlines */}
      <DrawOn d={smooth(MAINLAND, true, 0.6)} p={draw} sw={4} color={INK} />
      <DrawOn d={smooth(SAKHALIN, true, 0.6)} p={draw} sw={3.5} />
      {SMALL.map((pts, i) => (
        <DrawOn key={i} d={smooth(pts)} p={draw} sw={3} />
      ))}
      {japanD.map((d, i) => (
        <g key={i} transform={around(i, islandScale[i])}>
          <DrawOn d={d} p={draw} sw={4} />
        </g>
      ))}
    </g>
  );
};
