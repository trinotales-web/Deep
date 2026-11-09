import React from "react";
import { Part, Line } from "../Part";
import { X, type XProps } from "../context";
import { Glow } from "../effects";
import { circle, ellipse, poly, roundRect } from "../shapes";
import { shadeHex, mixHex } from "../style";
import { rng } from "../random";
import geoWorld from "./geo/world.json";
import { MapPin } from "./qin";

// World map on real coastlines (Natural Earth 1:110m, public domain, via
// world-atlas) in a Miller cylindrical projection: parchment land, teal sea
// with a darker shallow halo and wave strokes, thin brown borders, highlighted
// countries, red pins and dashed flight routes with a plane.

type P = [number, number];
type World = { countries: Record<string, P[][]>; borders: P[][] };
const WG = geoWorld as unknown as World;

const miller = (lat: number) => (1.25 * Math.log(Math.tan(Math.PI / 4 + (0.4 * Math.max(-84, Math.min(84, lat)) * Math.PI) / 180)) * 180) / Math.PI;

/** Lon/lat → WorldMap pixels for a map with the same `ppd` and `center` (lon/lat). */
export const worldXY = (lon: number, lat: number, ppd = 8, center: P = [0, 20]): P => [(lon - center[0]) * ppd, (miller(lat) - miller(center[1])) * ppd];

/** Longitude shifted by ±360 to lie within 180° of `c`. */
export const near = (lon: number, c: number) => {
  let l = lon;
  while (l - c > 180) l -= 360;
  while (l - c < -180) l += 360;
  return l;
};

/** Places used in the shots (lon, lat). */
export const CITY: Record<string, P> = {
  pretoria: [28.19, -25.75],
  montreal: [-73.57, 45.5],
  kingston: [-76.49, 44.23],
  regina: [-104.6, 50.45],
  philadelphia: [-75.16, 39.95],
  stanford: [-122.17, 37.43],
  paloalto: [-122.14, 37.44],
  hawthorne: [-118.35, 33.92],
  kwajalein: [167.73, 9.18],
  moscow: [37.62, 55.75],
  sydney: [151.21, -33.87],
  kyiv: [30.52, 50.45],
  buenosaires: [-58.38, -34.6],
  austin: [-97.74, 30.27],
  washington: [-77.04, 38.9],
  butler: [-79.9, 40.86],
  starbase: [-97.15, 25.99],
  canaveral: [-80.6, 28.4],
  newyork: [-74.0, 40.71],
  sanfrancisco: [-122.42, 37.77],
  johannesburg: [28.05, -26.2],
};

export type MapRoute = { from: P; to: P; k: number; color?: string; arc?: number; plane?: boolean; width?: number };
export type MapPinSpec = { at: P; s?: number; color?: string; glow?: boolean };

const routeCurve = (a: P, b: P, arc: number): P[] => {
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const d = Math.hypot(dx, dy);
  // control point pushed "up" (perpendicular, toward +y) for a flight-path bulge
  let nx = -dy / (d || 1);
  let ny = dx / (d || 1);
  if (ny < 0) {
    nx = -nx;
    ny = -ny;
  }
  const c: P = [mx + nx * d * arc, my + ny * d * arc];
  return Array.from({ length: 41 }, (_, i) => {
    const t = i / 40;
    return [(1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]] as P;
  });
};

/** Simple airliner seen from above, nose along +x. */
export const PlaneIcon: React.FC<XProps & { color?: string }> = ({ color = "#f4f1ea", ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(120, 22, 11)} color={color} shade={0.15} outline={4} />
    <Part shape={poly([[10, 6], [-20, 70], [-38, 70], [-16, 6]])} color={shadeHex(color, 0.08)} flat outline={4} z={-0.001} />
    <Part shape={poly([[10, -6], [-20, -70], [-38, -70], [-16, -6]])} color={shadeHex(color, 0.08)} flat outline={4} z={-0.001} />
    <Part shape={poly([[-46, 4], [-60, 28], [-68, 28], [-58, 4]])} color={shadeHex(color, 0.08)} flat outline={3.5} z={-0.001} />
    <Part shape={poly([[-46, -4], [-60, -28], [-68, -28], [-58, -4]])} color={shadeHex(color, 0.08)} flat outline={3.5} z={-0.001} />
  </X>
);

export const WorldMap: React.FC<
  XProps & {
    ppd?: number;
    center?: P;
    w?: number;
    h?: number;
    sea?: string;
    land?: string;
    /** Country name → fill colour (e.g. { "South Africa": "#e2a04a" }). */
    tint?: Record<string, string>;
    /** 0..1 strength of the tint fills. */
    tintK?: number;
    borders?: boolean;
    pins?: MapPinSpec[];
    routes?: MapRoute[];
    waves?: boolean;
    /** Draw copies 360° east and west (for maps centred near the date line). */
    wrap?: boolean;
    seed?: number;
  }
> = ({
  ppd = 8,
  center = [0, 20],
  w = 6000,
  h = 3600,
  sea = "#8fc2c0",
  land = "#e2cf9f",
  tint = {},
  tintK = 1,
  borders = true,
  pins = [],
  routes = [],
  waves = true,
  wrap = false,
  seed = 7,
  ...xf
}) => {
  const r = rng(seed);
  const cy = miller(center[1]);
  const halo = shadeHex(sea, -0.22);
  const offs = wrap ? [-360, 0, 360] : [0];
  const sc = (ring: P[], o: number) => ring.map(([x, y]) => [(x + o - center[0]) * ppd, (y - cy) * ppd] as P);
  const visible = (ring: P[], o: number) => {
    // skip rings entirely outside the drawn sea rectangle
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (const [x, y] of ring) {
      const px = (x + o - center[0]) * ppd;
      const py = (y - cy) * ppd;
      if (px < x0) x0 = px;
      if (px > x1) x1 = px;
      if (py < y0) y0 = py;
      if (py > y1) y1 = py;
    }
    return x1 > -w / 2 - 50 && x0 < w / 2 + 50 && y1 > -h / 2 - 50 && y0 < h / 2 + 50;
  };
  const rings: { name: string; ring: P[]; o: number }[] = [];
  for (const o of offs)
    for (const [name, rs] of Object.entries(WG.countries)) for (const ring of rs) if (visible(ring, o)) rings.push({ name, ring, o });
  const lw = Math.max(3, Math.min(5, ppd * 0.35));
  return (
    <X {...xf}>
      <Part shape={roundRect(w, h, 0)} color={sea} flat outline={0} z={-0.1} />
      {waves
        ? Array.from({ length: 90 }, () => [(r() - 0.5) * w, (r() - 0.5) * h]).map(([x, y], i) => (
            <Line key={`w${i}`} pts={[[x - 22, y], [x - 11, y + 6], [x, y], [x + 11, y - 6], [x + 22, y]]} smooth width={3} color={shadeHex(sea, 0.14)} z={-0.09} />
          ))
        : null}
      {rings.map(({ ring, o }, i) => (
        <Line key={`h${i}`} pts={[...sc(ring, o), sc(ring, o)[0]]} width={Math.max(8, ppd * 0.9)} color={halo} z={-0.05} />
      ))}
      {rings.map(({ name, ring, o }, i) => {
        const t = tint[name];
        const col = t ? mixHex(land, t, Math.max(0, Math.min(1, tintK))) : land;
        return <Part key={`l${i}`} shape={poly(sc(ring, o))} color={col} flat outline={lw} z={(t ? 0.01 : 0) + i * 0.00001} />;
      })}
      {borders
        ? offs.flatMap((o) =>
            WG.borders.map((line, i) => <Line key={`b${o}${i}`} pts={sc(line, o)} width={Math.max(2, lw * 0.6)} color="#9a7a55" z={0.02} />),
          )
        : null}
      {routes.map((rt, j) => {
        // take the short way round (e.g. across the Pacific)
        const fromLon = near(rt.from[0], center[0]);
        let toLon = rt.to[0];
        while (toLon - fromLon > 180) toLon -= 360;
        while (toLon - fromLon < -180) toLon += 360;
        const a = worldXY(fromLon, rt.from[1], ppd, center);
        const b = worldXY(toLon, rt.to[1], ppd, center);
        const curve = routeCurve(a, b, rt.arc ?? 0.18);
        const seg = curve.slice(1).map((p, i) => Math.hypot(p[0] - curve[i][0], p[1] - curve[i][1]));
        const total = seg.reduce((s, v) => s + v, 0);
        const pts: P[] = [];
        const kk = Math.max(0, Math.min(1, rt.k));
        for (let d = 0; d <= total * kk; d += 22) {
          let acc = 0;
          for (let i = 0; i < seg.length; i++) {
            if (d <= acc + seg[i]) {
              const q = (d - acc) / seg[i];
              pts.push([curve[i][0] + (curve[i + 1][0] - curve[i][0]) * q, curve[i][1] + (curve[i + 1][1] - curve[i][1]) * q]);
              break;
            }
            acc += seg[i];
          }
        }
        const tip = pts.length > 1 ? pts[pts.length - 1] : null;
        const prev = pts.length > 1 ? pts[pts.length - 2] : null;
        const ang = tip && prev ? Math.atan2(tip[1] - prev[1], tip[0] - prev[0]) : 0;
        const col = rt.color ?? "#c8262f";
        return (
          <X key={`r${j}`} z={0.05 + j * 0.001}>
            {pts.slice(0, -1).map((p, i) => (i % 2 === 0 ? <Line key={i} pts={[p, pts[i + 1]]} width={rt.width ?? 8} color={col} /> : null))}
            {tip && kk > 0.02 ? (
              rt.plane ? (
                <PlaneIcon x={tip[0]} y={tip[1]} rot={ang} s={0.55} z={0.01} />
              ) : (
                <X x={tip[0]} y={tip[1]} rot={ang} z={0.01}>
                  <Part shape={poly([[-6, 16], [26, 0], [-6, -16]])} color={col} flat outline={3} />
                </X>
              )
            ) : null}
          </X>
        );
      })}
      {pins.map((p, i) => {
        const [x, y] = worldXY(near(p.at[0], center[0]), p.at[1], ppd, center);
        const s = p.s ?? 1;
        if (s <= 0.001) return null;
        return (
          <X key={`p${i}`} x={x} y={y} z={0.06 + i * 0.001}>
            {p.glow ? <Glow rx={90 * s} color="#fff2c6" alpha={0.5} additive z={-0.001} /> : null}
            <MapPin s={s} color={p.color ?? "#d8322f"} />
          </X>
        );
      })}
    </X>
  );
};

/** Small red map dot with a white ring (for cities on wide maps). */
export const MapDot: React.FC<XProps & { r?: number; color?: string }> = ({ r = 14, color = "#d8322f", ...xf }) => (
  <X {...xf}>
    <Part shape={circle(r)} color={color} flat outline={4} />
    <Part shape={ellipse(r * 0.4, r * 0.4)} color="#ffffff" flat outline={0} z={0.001} />
  </X>
);
