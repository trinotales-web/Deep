import React from "react";
import { Part, Line } from "../Part";
import { X, type XProps } from "../context";
import { Glow } from "../effects";
import { circle, poly, roundRect, smoothOpen } from "../shapes";
import { shadeHex, mixHex } from "../style";
import { rng } from "../random";
import geoEurope from "./geo/europe.json";
import { MapPin } from "./qin";

// Europe on real Natural Earth coastlines (1:50m countries, world-atlas,
// public domain), same parchment-and-teal look as WorldMap. Only coastlines
// are outlined (no modern borders); countries can be tinted to show realms.
// Projection: equirectangular with x scaled by cos(48°), `ppd` = px per
// degree of latitude. Close-up islands (Corsica, Elba, Saint Helena,
// Sardinia) come from 1:10m data in `EUROPE_ISLANDS`.

type P = [number, number];
type Geo = { box: number[]; countries: Record<string, P[][]>; islands: Record<string, P[]> };
const EG = geoEurope as unknown as Geo;
const KX = Math.cos((48 * Math.PI) / 180);

export const EUROPE_ISLANDS = EG.islands;

/** Lon/lat → EuropeMap pixels for a map with the same `ppd` and `center`. */
export const euroXY = (lon: number, lat: number, ppd = 40, center: P = [10, 48]): P => [(lon - center[0]) * KX * ppd, (lat - center[1]) * ppd];

/** Places used in the Napoleon shots (lon, lat). */
export const EURO: Record<string, P> = {
  ajaccio: [8.74, 41.93],
  paris: [2.35, 48.86],
  brienne: [4.53, 48.39],
  toulon: [5.93, 43.12],
  milan: [9.19, 45.46],
  vienna: [16.37, 48.21],
  austerlitz: [16.76, 49.15],
  berlin: [13.4, 52.52],
  madrid: [-3.7, 40.42],
  lisbon: [-9.14, 38.72],
  london: [-0.13, 51.51],
  moscow: [37.62, 55.75],
  borodino: [35.82, 55.52],
  kaunas: [23.9, 54.9],
  smolensk: [32.05, 54.78],
  berezina: [28.5, 54.3],
  leipzig: [12.37, 51.34],
  cairo: [31.24, 30.04],
  alexandria: [29.92, 31.2],
  aboukir: [30.06, 31.32],
  pyramids: [31.13, 29.98],
  elba: [10.3, 42.78],
  portoferraio: [10.33, 42.81],
  cannes: [7.02, 43.55],
  grenoble: [5.72, 45.19],
  waterloo: [4.4, 50.68],
  brussels: [4.35, 50.85],
  trafalgar: [-6.03, 36.18],
  stpetersburg: [30.31, 59.94],
  rome: [12.5, 41.9],
  amsterdam: [4.9, 52.37],
  warsaw: [21.01, 52.23],
  stockholm: [18.07, 59.33],
};

/** Napoleon's empire with its satellite states at the height of 1811–12 (approximated by modern countries). */
export const EMPIRE_1812 = ["France", "Belgium", "Netherlands", "Luxembourg", "Germany", "Italy", "Switzerland", "Poland", "Slovenia", "Croatia", "Spain"];

export type ArmyRoute = {
  /** Waypoints (lon, lat). */
  pts: P[];
  /** 0..1 how much of the route is drawn. */
  k: number;
  color?: string;
  width?: number;
  /** Width multiplier along the route (end), for a shrinking army band. */
  taper?: number;
};

export type EuroPin = { at: P; s?: number; color?: string; glow?: boolean; dot?: boolean };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Smooth polyline through waypoints, resampled to `step` px; returns points up to fraction k. */
const routePts = (pts: P[], k: number, step = 16): P[] => {
  if (pts.length < 2) return pts;
  const sm: P[] = pts.length > 2 ? smoothOpen(pts, 14).map((v) => [v.x, v.y] as P) : pts;
  const seg = sm.slice(1).map((p, i) => Math.hypot(p[0] - sm[i][0], p[1] - sm[i][1]));
  const total = seg.reduce((s, v) => s + v, 0);
  const out: P[] = [];
  const end = total * Math.max(0, Math.min(1, k));
  let acc = 0;
  let i = 0;
  for (let d = 0; d <= end + 0.01; d += step) {
    const dd = Math.min(d, end);
    while (i < seg.length - 1 && acc + seg[i] < dd) acc += seg[i++];
    const q = seg[i] ? (dd - acc) / seg[i] : 0;
    out.push([lerp(sm[i][0], sm[i + 1][0], q), lerp(sm[i][1], sm[i + 1][1], q)]);
    if (dd === end) break;
  }
  if (out.length && end > 0) {
    // make sure the tip sits exactly at the end
    const last = out[out.length - 1];
    let a2 = 0;
    let j = 0;
    while (j < seg.length - 1 && a2 + seg[j] < end) a2 += seg[j++];
    const q = seg[j] ? (end - a2) / seg[j] : 0;
    const tip: P = [lerp(sm[j][0], sm[j + 1][0], q), lerp(sm[j][1], sm[j + 1][1], q)];
    if (Math.hypot(tip[0] - last[0], tip[1] - last[1]) > 1) out.push(tip);
  }
  return out;
};

/** Bold army arrow: dark-outlined band with an outlined arrowhead. Points in px. */
export const ArmyArrow: React.FC<XProps & { pts: P[]; k: number; color?: string; width?: number; taper?: number }> = ({ pts, k, color = "#c8262f", width = 26, taper = 1, ...xf }) => {
  const rp = routePts(pts, k);
  if (rp.length < 2 || k <= 0.005) return null;
  const n = rp.length;
  // split into short runs so a taper can narrow the band
  const runs: { a: number; b: number; w: number }[] = [];
  const chunk = taper === 1 ? n : 6;
  for (let i = 0; i < n - 1; i += chunk) runs.push({ a: i, b: Math.min(n - 1, i + chunk), w: width * lerp(1, taper, (i / Math.max(1, n - 1)) * k) });
  const tip = rp[n - 1];
  const prev = rp[Math.max(0, n - 3)];
  const ang = Math.atan2(tip[1] - prev[1], tip[0] - prev[0]);
  const wEnd = runs.length ? runs[runs.length - 1].w : width;
  return (
    <X {...xf}>
      {runs.map((r, i) => (
        <Line key={`o${i}`} pts={rp.slice(r.a, r.b + 1)} width={r.w + 12} color="#211b20" z={0} />
      ))}
      {runs.map((r, i) => (
        <Line key={`f${i}`} pts={rp.slice(r.a, r.b + 1)} width={r.w} color={color} z={0.002} />
      ))}
      <X x={tip[0]} y={tip[1]} rot={ang} z={0.004}>
        <Part shape={poly([[-wEnd * 0.4, wEnd * 1.25], [wEnd * 1.5, 0], [-wEnd * 0.4, -wEnd * 1.25]])} color={color} flat outline={6} />
      </X>
    </X>
  );
};

export const EuropeMap: React.FC<
  XProps & {
    ppd?: number;
    center?: P;
    w?: number;
    h?: number;
    sea?: string;
    land?: string;
    /** Country name → fill colour (e.g. { France: "#3b62b8" }). */
    tint?: Record<string, string>;
    tintK?: number;
    /** Whiten Russia and the north-east (0..1) for the winter retreat. */
    snow?: number;
    routes?: ArmyRoute[];
    pins?: EuroPin[];
    waves?: boolean;
    seed?: number;
    /** Show the close-up 1:10m outline for these islands instead of nothing (they are already in the countries data at map scale). */
    islands?: string[];
  }
> = ({ ppd = 40, center = [10, 48], w = 6000, h = 3600, sea = "#8fc2c0", land = "#e2cf9f", tint = {}, tintK = 1, snow = 0, routes = [], pins = [], waves = true, seed = 7, islands = [], ...xf }) => {
  const r = rng(seed);
  const halo = shadeHex(sea, -0.22);
  const sc = (ring: P[]) => ring.map(([lon, lat]) => euroXY(lon, lat, ppd, center));
  const vis = (ring: P[]) => {
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (const [lon, lat] of ring) {
      const [px, py] = euroXY(lon, lat, ppd, center);
      if (px < x0) x0 = px;
      if (px > x1) x1 = px;
      if (py < y0) y0 = py;
      if (py > y1) y1 = py;
    }
    const big = Math.max(x1 - x0, y1 - y0);
    return big > 6 && x1 > -w / 2 - 60 && x0 < w / 2 + 60 && y1 > -h / 2 - 60 && y0 < h / 2 + 60;
  };
  const rings: { name: string; ring: P[] }[] = [];
  for (const [name, rs] of Object.entries(EG.countries)) for (const ring of rs) if (vis(ring)) rings.push({ name, ring });
  for (const k of islands) if (EG.islands[k] && vis(EG.islands[k])) rings.push({ name: `island:${k}`, ring: EG.islands[k] });
  const lw = Math.max(3.5, Math.min(6, ppd * 0.12));
  const SNOWY = new Set(["Russia", "Belarus", "Lithuania", "Latvia", "Estonia", "Finland", "Ukraine"]);
  const fill = (name: string) => {
    const t = tint[name];
    let c = t ? mixHex(land, t, Math.max(0, Math.min(1, tintK))) : land;
    if (snow > 0 && SNOWY.has(name)) c = mixHex(c, "#f2f4fa", snow * 0.85);
    return c;
  };
  return (
    <X {...xf}>
      <Part shape={roundRect(w, h, 0)} color={sea} flat outline={0} z={-0.1} />
      {waves
        ? Array.from({ length: 90 }, () => [(r() - 0.5) * w, (r() - 0.5) * h]).map(([x, y], i) => (
            <Line key={`w${i}`} pts={[[x - 22, y], [x - 11, y + 6], [x, y], [x + 11, y - 6], [x + 22, y]]} smooth width={3} color={shadeHex(sea, 0.14)} z={-0.09} />
          ))
        : null}
      {rings.map(({ ring }, i) => (
        <Line key={`h${i}`} pts={[...sc(ring), sc(ring)[0]]} width={Math.max(10, ppd * 0.5)} color={halo} z={-0.05} />
      ))}
      {/* coast pass: outlined shapes; the fill pass on top hides the inland borders */}
      {rings.map(({ ring }, i) => (
        <Part key={`c${i}`} shape={poly(sc(ring))} color={land} flat outline={lw * 2} z={0} />
      ))}
      {rings.map(({ name, ring }, i) => (
        <Part key={`l${i}`} shape={poly(sc(ring))} color={fill(name)} flat outline={0} z={0.01 + (tint[name] ? 0.001 : 0)} />
      ))}
      {routes.map((rt, j) => (
        <ArmyArrow key={`r${j}`} pts={rt.pts.map(([lon, lat]) => euroXY(lon, lat, ppd, center))} k={rt.k} color={rt.color} width={rt.width} taper={rt.taper} z={0.05 + j * 0.005} />
      ))}
      {pins.map((p, i) => {
        const [x, y] = euroXY(p.at[0], p.at[1], ppd, center);
        const s = p.s ?? 1;
        if (s <= 0.001) return null;
        return (
          <X key={`p${i}`} x={x} y={y} z={0.08 + i * 0.001}>
            {p.glow ? <Glow rx={90 * s} color="#fff2c6" alpha={0.5} additive z={-0.001} /> : null}
            {p.dot ? (
              <X s={s}>
                <Part shape={circle(16)} color={p.color ?? "#d8322f"} flat outline={4.5} />
                <Part shape={circle(6)} color="#ffffff" flat outline={0} z={0.001} />
              </X>
            ) : (
              <MapPin s={s} color={p.color ?? "#d8322f"} />
            )}
          </X>
        );
      })}
    </X>
  );
};
