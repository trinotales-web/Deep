import React from "react";
import { Part, Line } from "../Part";
import { X, type XProps } from "../context";
import { Glow } from "../effects";
import { blob, circle, poly, roundRect } from "../shapes";
import { shadeHex, mixHex } from "../style";
import { rng } from "../random";
import geoPolar from "./geo/polar.json";

// Polar map (azimuthal equidistant) on real Natural Earth 1:50m coastlines:
// the Southern Ocean around Antarctica, or the Arctic with the Ice Age ice
// sheets. Same parchment-and-teal look as WorldMap. 1 unit of the data = 1°
// of arc from the pole; `ppd` = pixels per degree.

type P = [number, number];
const PG = geoPolar as unknown as { south: P[][]; north: P[][] };
const rad = Math.PI / 180;

/** Lon/lat → PolarMap pixels (same `pole`, `ppd`, `rot` as the map). */
export const polarXY = (lon: number, lat: number, pole: "south" | "north" = "south", ppd = 10, rot = 0): P => {
  const r = pole === "south" ? 90 + lat : 90 - lat;
  const x = r * Math.sin(lon * rad);
  const y = pole === "south" ? r * Math.cos(lon * rad) : -r * Math.cos(lon * rad);
  const c = Math.cos(rot);
  const s = Math.sin(rot);
  return [(x * c - y * s) * ppd, (x * s + y * c) * ppd];
};

/** Approximate Last Glacial Maximum ice sheets (lon, lat), for the Ice Age map. */
export const ICE_SHEETS: P[][] = [
  // Laurentide + Cordilleran (North America)
  [[-165, 62], [-150, 59], [-136, 54], [-125, 47], [-110, 46], [-96, 41], [-86, 38], [-76, 40], [-70, 42], [-60, 45], [-54, 51], [-60, 59], [-68, 64], [-78, 70], [-94, 77], [-115, 78], [-132, 72], [-148, 69], [-160, 66]],
  // Greenland
  [[-52, 60], [-43, 59.5], [-34, 64], [-21, 70], [-17, 80], [-34, 83.5], [-60, 82], [-70, 77], [-58, 69]],
  // Fennoscandian + British-Irish
  [[-11, 54], [-6, 50.5], [4, 52], [11, 52.5], [21, 51.5], [31, 54], [41, 60], [52, 66], [62, 70], [56, 76], [32, 79], [15, 76], [5, 70], [-5, 62], [-12, 58]],
];

export const PolarMap: React.FC<
  XProps & {
    pole?: "south" | "north";
    ppd?: number;
    /** Map rotation (radians). */
    rot?: number;
    w?: number;
    h?: number;
    sea?: string;
    land?: string;
    /** Antarctica's ice colour (south). */
    ice?: string;
    /** Sea ice band around Antarctica: outer edge latitude (e.g. -60), or null. */
    seaIceLat?: number | null;
    /** Dashed latitude circles. */
    circles?: number[];
    /** Ice Age ice sheets (north), 0..1 growth. */
    sheets?: number;
    waves?: boolean;
    seed?: number;
    children?: React.ReactNode;
  }
> = ({
  pole = "south",
  ppd = 10,
  rot = 0,
  w = 4000,
  h = 3000,
  sea = "#8fc2c0",
  land = "#e2cf9f",
  ice = "#f4f8fb",
  seaIceLat = null,
  circles = [],
  sheets = 0,
  waves = true,
  seed = 7,
  children,
  ...xf
}) => {
  const r = rng(seed);
  const c = Math.cos(rot);
  const s = Math.sin(rot);
  const tf = ([x, y]: P): P => [(x * c - y * s) * ppd, (x * s + y * c) * ppd];
  const rings = PG[pole]
    .map((ring) => ring.map(tf))
    .filter((ring) => ring.some(([x, y]) => Math.abs(x) < w / 2 + 100 && Math.abs(y) < h / 2 + 100));
  const isAntarctica = (ring: P[]) => pole === "south" && ring.every(([x, y]) => Math.hypot(x, y) < 38 * ppd);
  const halo = shadeHex(sea, -0.22);
  const lw = Math.max(3, Math.min(5, ppd * 0.35));
  return (
    <X {...xf}>
      <Part shape={roundRect(w, h, 0)} color={sea} flat outline={0} z={-0.1} />
      {waves
        ? Array.from({ length: 80 }, () => [(r() - 0.5) * w, (r() - 0.5) * h]).map(([x, y], i) => (
            <Line key={`w${i}`} pts={[[x - 22, y], [x - 11, y + 6], [x, y], [x + 11, y - 6], [x + 22, y]]} smooth width={3} color={shadeHex(sea, 0.14)} z={-0.09} />
          ))
        : null}
      {circles.map((lat, i) => {
        const R = (pole === "south" ? 90 + lat : 90 - lat) * ppd;
        const n = 72;
        return Array.from({ length: n / 2 }, (_, j) => {
          const a0 = ((2 * j) / n) * Math.PI * 2;
          const a1 = ((2 * j + 1) / n) * Math.PI * 2;
          return <Line key={`c${i}-${j}`} pts={[[Math.cos(a0) * R, Math.sin(a0) * R], [Math.cos((a0 + a1) / 2) * R, Math.sin((a0 + a1) / 2) * R], [Math.cos(a1) * R, Math.sin(a1) * R]]} width={6} color="#ffffff" opacity={0.55} z={-0.06} />;
        });
      })}
      {seaIceLat !== null && pole === "south" ? (
        <Part
          shape={blob(Array.from({ length: 24 }, (_, i) => {
            const a = (i / 24) * Math.PI * 2;
            const R = (90 + seaIceLat) * ppd * (1 + 0.05 * Math.sin(i * 2.3 + seed));
            return [Math.cos(a) * R, Math.sin(a) * R] as P;
          }), 6)}
          color="#eaf4f8"
          flat
          outline={4}
          opacity={0.85}
          z={-0.04}
        />
      ) : null}
      {rings.map((ring, i) => (
        <Line key={`h${i}`} pts={[...ring, ring[0]]} width={Math.max(8, ppd * 0.9)} color={halo} z={-0.05} />
      ))}
      {rings.map((ring, i) => (
        <Part key={`l${i}`} shape={poly(ring)} color={isAntarctica(ring) ? ice : land} flat outline={lw} z={i * 0.00001} />
      ))}
      {sheets > 0 && pole === "north"
        ? ICE_SHEETS.map((sheet, i) => {
            const pts = sheet.map(([lon, lat]) => polarXY(lon, lat, "north", ppd, rot));
            const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length;
            const cy = pts.reduce((a, p) => a + p[1], 0) / pts.length;
            const k = Math.max(0, Math.min(1, sheets * 1.15 - i * 0.08));
            if (k <= 0.01) return null;
            const g = pts.map(([x, y]) => [cx + (x - cx) * k, cy + (y - cy) * k] as P);
            return (
              <X key={`s${i}`} z={0.05 + i * 0.001}>
                <Glow rx={260 * k * (ppd / 10)} color="#ffffff" alpha={0.35} x={cx} y={cy} />
                <Part shape={blob(g, 6)} color={mixHex(ice, "#dcecf6", 0.3)} shade={0.12} opacity={0.88} outline={4} />
              </X>
            );
          })
        : null}
      <X z={0.1}>{children}</X>
    </X>
  );
};

/** Pin + soft glow at a polar map point (for labels drawn with useScr). */
export const PolarPin: React.FC<XProps & { size?: number; color?: string; glow?: boolean }> = ({ size = 1, color = "#e2443a", glow = true, ...xf }) => (
  <X {...xf} s={(xf.s ?? 1) * size}>
    {glow ? <Glow rx={70} color={color} alpha={0.45} additive z={-0.01} /> : null}
    <Part shape={circle(22)} color={color} shade={0.2} />
    <Part shape={circle(8)} color="#ffffff" flat outline={0} z={0.001} />
  </X>
);
