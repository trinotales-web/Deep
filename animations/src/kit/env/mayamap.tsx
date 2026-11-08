import React from "react";
import { useCurrentFrame } from "remotion";
import { Part, Line } from "../Part";
import { X, type XProps } from "../context";
import { Glow } from "../effects";
import { circle, ellipse, poly, roundRect, blob } from "../shapes";
import { shadeHex, mixHex } from "../style";
import { rng } from "../random";
import geoMeso from "./geo/mesoamerica.json";
import geoGlobe from "./geo/globe.json";
import { MapPin } from "./qin";

// Maps of the Maya world on real coastlines (Natural Earth 1:50m, public
// domain, via world-atlas) and an orthographic globe (1:110m).

type P = [number, number];
type Meso = { land: P[][]; countries: Record<string, P[][]>; borders: P[][]; sites: Record<string, P>; mayaArea: P[][] };
const MG = geoMeso as unknown as Meso;
const GG = geoGlobe as unknown as { land: P[][] };

const LON0 = -90;
const LAT0 = 17;
const C0 = Math.cos((LAT0 * Math.PI) / 180);
export type MayaSite = keyof typeof geoMeso.sites;

/** Lon/lat → MesoMap pixels for a map with the same `ppd` and `center` (lon/lat). */
export const mesoXY = (lon: number, lat: number, ppd = 60, center: P = [-90, 17]): P => {
  const x = (lon - LON0) * C0 * ppd;
  const y = (lat - LAT0) * ppd;
  const cx = (center[0] - LON0) * C0 * ppd;
  const cy = (center[1] - LAT0) * ppd;
  return [x - cx, y - cy];
};
/** A named site's MesoMap pixels. */
export const siteXY = (name: MayaSite | string, ppd = 60, center: P = [-90, 17]): P => {
  const s = MG.sites[name] ?? [0, 0];
  const cx = (center[0] - LON0) * C0 * ppd;
  const cy = (center[1] - LAT0) * ppd;
  return [s[0] * ppd - cx, s[1] * ppd - cy];
};

const MAYA_COUNTRIES = ["Mexico", "Guatemala", "Belize", "Honduras", "El Salvador"];

/**
 * Map of Mesoamerica (reference style: parchment land, teal sea with a shallow
 * halo, labelled pins in the shots). `maya` 0..1 tints the Maya area (Yucatán,
 * Chiapas/Tabasco, Guatemala, Belize, western Honduras & El Salvador) in green;
 * `countries` outlines modern borders; `crater` draws the Chicxulub ring and its
 * ring of cenotes; `pins` are site names; `route` a dashed lon/lat path to `routeK`.
 */
export const MesoMap: React.FC<
  XProps & {
    ppd?: number; center?: P; sea?: string; land?: string; maya?: number; countries?: boolean; crater?: number; cenotes?: number;
    pins?: (MayaSite | string)[]; route?: P[]; routeK?: number; routeColor?: string; w?: number; h?: number; waves?: boolean; highlight?: (MayaSite | string)[];
    kingdoms?: number;
  }
> = ({
  ppd = 60, center = [-90, 17], sea = "#8fc2c0", land = "#e2cf9f", maya = 0, countries = false, crater = 0, cenotes = 0, pins = [], route, routeK = 1,
  routeColor = "#c8262f", w = 6000, h = 4000, waves = true, highlight = [], kingdoms = 0, ...xf
}) => {
  const r = rng(12);
  const cx = (center[0] - LON0) * C0 * ppd;
  const cy = (center[1] - LAT0) * ppd;
  const sc = (ring: P[]) => ring.map(([x, y]) => [x * ppd - cx, y * ppd - cy] as P);
  const at = (lon: number, lat: number) => mesoXY(lon, lat, ppd, center);
  const halo = shadeHex(sea, -0.22);
  const mayaFill = mixHex(land, "#7ab04a", 0.55 * maya);
  let routePts: P[] = [];
  if (route && route.length > 1) {
    const pts = route.map(([lo, la]) => at(lo, la));
    const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
    const total = seg.reduce((a, b) => a + b, 0);
    for (let d = 0; d < total * routeK; d += 24) {
      let acc = 0;
      for (let i = 0; i < seg.length; i++) {
        if (d <= acc + seg[i]) {
          const q = (d - acc) / seg[i];
          routePts.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * q, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * q]);
          break;
        }
        acc += seg[i];
      }
    }
  }
  const tip = routePts.length > 1 ? routePts[routePts.length - 1] : null;
  const prev = routePts.length > 1 ? routePts[routePts.length - 2] : null;
  const ang = tip && prev ? Math.atan2(tip[1] - prev[1], tip[0] - prev[0]) : 0;
  const allRings = [...MG.land, ...Object.values(MG.countries).flat()];
  const [kx, ky] = at(-89.5, 21.3);
  return (
    <X {...xf}>
      <Part shape={roundRect(w, h, 0)} color={sea} flat outline={0} z={-0.1} />
      {waves
        ? Array.from({ length: 110 }, () => [(r() - 0.5) * w, (r() - 0.5) * h]).map(([x, y], i) => (
            <Line key={`w${i}`} pts={[[x - 26, y], [x - 13, y + 7], [x, y], [x + 13, y - 7], [x + 26, y]]} smooth width={3.5} color={shadeHex(sea, 0.14)} z={-0.09} />
          ))
        : null}
      {allRings.map((ring, i) => (
        <Line key={`h${i}`} pts={[...sc(ring), sc(ring)[0]]} width={Math.max(10, ppd * 0.36)} color={halo} z={-0.05} />
      ))}
      {MG.land.map((ring, i) => (
        <Part key={`l${i}`} shape={poly(sc(ring))} color={land} flat outline={4.5} z={i * 0.0001} />
      ))}
      {MAYA_COUNTRIES.map((name) =>
        (MG.countries[name] ?? []).map((ring, i) => (
          <Part key={`${name}${i}`} shape={poly(sc(ring))} color={mixHex(land, "#f0d8a0", 0.5)} flat outline={4.5} z={0.01 + i * 0.0001} />
        )),
      )}
      {maya > 0 ? (
        <X z={0.02}>
          {MG.mayaArea.map((ring, i) => (
            <Part key={i} shape={poly(sc(ring))} color={mayaFill} flat outline={0} opacity={0.9 * maya} z={i * 0.0001} />
          ))}
          {MG.mayaArea.map((ring, i) => (
            <Line key={`o${i}`} pts={[...sc(ring), sc(ring)[0]]} width={5} color="#3a7a3a" opacity={maya} z={0.001} />
          ))}
        </X>
      ) : null}
      {countries
        ? MG.borders.map((line, i) => (
            <Line key={`b${i}`} pts={sc(line)} width={3.5} color="#8a6a4a" z={0.03} />
          ))
        : null}
      {kingdoms > 0
        ? Array.from({ length: 22 }, (_, i) => {
            const lo = -91.8 + (i % 6) * 0.95 + (Math.floor(i / 6) % 2) * 0.4;
            const la = 15.6 + Math.floor(i / 6) * 1.25;
            const [x, y] = at(lo, la);
            return i / 22 < kingdoms ? <Part key={`k${i}`} shape={circle(ppd * 0.16)} color={["#c0392b", "#3a9ac9", "#d9a441", "#8a5aa8", "#3fa07a"][i % 5]} flat outline={3} x={x} y={y} z={0.035} /> : null;
          })
        : null}
      {crater > 0 ? (
        <X x={kx} y={ky} z={0.04}>
          <Part shape={ellipse(ppd * 0.9 * crater, ppd * 0.9 * crater)} color="#c8322a" flat outline={0} opacity={0} />
          <Line pts={Array.from({ length: 49 }, (_, i) => [Math.cos((i / 48) * 6.283) * ppd * 0.9 * crater, Math.sin((i / 48) * 6.283) * ppd * 0.9 * crater] as P)} width={6} color="#c8322a" />
          {cenotes > 0
            ? Array.from({ length: 18 }, (_, i) => {
                const a = (i / 18) * 6.283;
                return i / 18 < cenotes ? <Part key={i} shape={circle(ppd * 0.07)} color="#2ab0d8" flat outline={2.5} x={Math.cos(a) * ppd * 0.9} y={Math.sin(a) * ppd * 0.9} z={0.001} /> : null;
              })
            : null}
        </X>
      ) : null}
      {routePts.length > 1
        ? routePts.slice(0, -1).map((p, i) => (i % 2 === 0 ? <Line key={`r${i}`} pts={[p, routePts[i + 1]]} width={9} color={routeColor} z={0.05} /> : null))
        : null}
      {tip ? (
        <X x={tip[0]} y={tip[1]} rot={ang} z={0.051}>
          <Part shape={poly([[-6, 18], [30, 0], [-6, -18]])} color={routeColor} flat outline={3} />
        </X>
      ) : null}
      {pins.map((name, i) => {
        const [x, y] = siteXY(name, ppd, center);
        const hi = highlight.includes(name);
        return (
          <X key={`p${i}`} x={x} y={y} z={0.06 + i * 0.001}>
            {hi ? <Glow rx={ppd * 1.2} color="#fff2c6" alpha={0.5} additive z={-0.001} /> : null}
            <MapPin s={Math.max(0.6, ppd / 60) * (hi ? 1.25 : 1)} color={hi ? "#d8322f" : "#c8322a"} />
          </X>
        );
      })}
    </X>
  );
};

/**
 * Orthographic globe of the real continents (1:110m), turned to `lon0`/`lat0`
 * at its centre. Origin = globe centre; radius `r`.
 */
export const Globe: React.FC<XProps & { r?: number; lon0?: number; lat0?: number; ocean?: string; land?: string; glow?: number; highlight?: P | null }> = ({
  r = 400,
  lon0 = -90,
  lat0 = 20,
  ocean = "#2f6fa8",
  land = "#7ab04a",
  glow = 1,
  highlight = null,
  ...xf
}) => {
  const l0 = (lon0 * Math.PI) / 180;
  const p0 = (lat0 * Math.PI) / 180;
  const proj = (lon: number, lat: number): [number, number, number] => {
    const l = (lon * Math.PI) / 180;
    const p = (lat * Math.PI) / 180;
    const cosc = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l - l0);
    const x = r * Math.cos(p) * Math.sin(l - l0);
    const y = r * (Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l - l0));
    return [x, y, cosc];
  };
  const rings = GG.land
    .map((ring) => {
      const pts = ring.map(([lo, la]) => proj(lo, la));
      const vis = pts.filter((q) => q[2] > 0).length;
      if (vis < 3) return null;
      // clamp hidden points onto the limb so the polygon stays closed
      return pts.map(([x, y, c]) => {
        if (c > 0) return [x, y] as P;
        const k = r / Math.max(1e-6, Math.hypot(x, y));
        return [x * k, y * k] as P;
      });
    })
    .filter((x): x is P[] => !!x);
  const hl = highlight ? proj(highlight[0], highlight[1]) : null;
  return (
    <X {...xf}>
      {glow > 0 ? <Glow rx={r * 1.25} color="#8ad0ff" alpha={0.35 * glow} additive z={-0.01} /> : null}
      <Part shape={circle(r)} color={ocean} shade={0.3} />
      {rings.map((ring, i) => (
        <Part key={i} shape={poly(ring)} color={land} flat outline={3} z={0.001 + i * 0.00001} />
      ))}
      <Part shape={blob([[-r * 0.6, r * 0.5], [-r * 0.2, r * 0.75], [r * 0.2, r * 0.6], [-r * 0.1, r * 0.4]], 8)} color="#ffffff" flat outline={0} opacity={0.12} z={0.01} />
      {hl && hl[2] > 0 ? (
        <X x={hl[0]} y={hl[1]} z={0.02}>
          <Glow rx={r * 0.18} color="#ffb35a" alpha={0.7} additive />
          <Part shape={circle(r * 0.025)} color="#ff5a3a" flat outline={2} />
        </X>
      ) : null}
    </X>
  );
};

/** Lon/lat → the Globe's pixels (and whether it is on the visible side). */
export const globeXY = (lon: number, lat: number, r = 400, lon0 = -90, lat0 = 20): [number, number, boolean] => {
  const l0 = (lon0 * Math.PI) / 180;
  const p0 = (lat0 * Math.PI) / 180;
  const l = (lon * Math.PI) / 180;
  const p = (lat * Math.PI) / 180;
  const cosc = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l - l0);
  return [r * Math.cos(p) * Math.sin(l - l0), r * (Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l - l0)), cosc > 0];
};

/** Twinkling star field for space shots. */
export const SpaceStars: React.FC<XProps & { w?: number; h?: number; n?: number; seed?: number }> = ({ w = 4000, h = 2400, n = 160, seed = 3, ...xf }) => {
  const frame = useCurrentFrame();
  const r = rng(seed);
  const stars = Array.from({ length: n }, () => [(r() - 0.5) * w, (r() - 0.5) * h, 1.5 + r() * 3.5, r() * 6.28] as [number, number, number, number]);
  return (
    <X {...xf}>
      <Part shape={roundRect(w, h, 0)} color="#070a18" flat outline={0} />
      {stars.map(([x, y, s, ph], i) => (
        <Part key={i} shape={circle(s)} color="#ffffff" flat outline={0} opacity={0.5 + 0.5 * Math.sin(frame * 0.08 + ph)} x={x} y={y} z={0.001} />
      ))}
    </X>
  );
};
