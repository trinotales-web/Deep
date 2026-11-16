import React from "react";
import { useCurrentFrame } from "remotion";
import { Part, Line } from "../Part";
import { X, type XProps } from "../context";
import { Glow, Gradient } from "../effects";
import { blob, circle, ellipse, poly, roundPoly, roundRect } from "../shapes";
import { INK, shadeHex } from "../style";
import { noise1, rng } from "../random";
import { Sparkle } from "./space";
import { Globe } from "./mayamap";

// The Moon kit (Moon south pole episode): an orthographic Moon globe with the
// real maria, big craters and the South Pole-Aitken basin (rotates to any
// view, including straight down on a pole), GRAIL-style gravity and "X-ray"
// overlays, illustrated polar maps with the named craters at their real
// coordinates, the low-sun polar landscape, and a crater cross-section
// diagram for shadows, cold traps, ice and the buried mass.

const D2R = Math.PI / 180;
const HIGHLAND = "#d8d6dc";
const MARE = "#9aa0b2";
const RIM = "#eceaf0";
const FLOOR = "#b2b0b8";
const SHADOW = "#262434";
const ICE = "#8fe3ff";
const STRATA = ["#7e7974", "#8f8a84", "#76716c", "#86817b", "#6c6762"];
const r5 = (v: number) => Math.round(v * 2) / 2;

export type MoonView = { lon: number; lat: number; roll?: number };
type V3 = [number, number, number];

/** Orthographic projection of (lon, lat) for a view centred on (view.lon, view.lat): unit x right, y up, z toward the viewer. */
export const moonProj = (lon: number, lat: number, v: MoonView): V3 => {
  const l = lon * D2R;
  const p = lat * D2R;
  const l0 = v.lon * D2R;
  const p0 = v.lat * D2R;
  const x = Math.cos(p) * Math.sin(l - l0);
  const y = Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l - l0);
  const z = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l - l0);
  const r = (v.roll ?? 0) * D2R;
  return [x * Math.cos(r) - y * Math.sin(r), x * Math.sin(r) + y * Math.cos(r), z];
};

/** Point at angular distance `dist` (deg) and bearing `brg` (rad) from (lon, lat). */
const dest = (lon: number, lat: number, brg: number, dist: number): [number, number] => {
  const p1 = lat * D2R;
  const d = dist * D2R;
  const p2 = Math.asin(Math.sin(p1) * Math.cos(d) + Math.cos(p1) * Math.sin(d) * Math.cos(brg));
  const l2 = lon * D2R + Math.atan2(Math.sin(brg) * Math.sin(d) * Math.cos(p1), Math.cos(d) - Math.sin(p1) * Math.sin(p2));
  return [l2 / D2R, p2 / D2R];
};

/** Wobbly small circle on the sphere (lon/lat points). */
const capRing = (lon: number, lat: number, rad: number, seed: number, wob = 0.18, n = 28, sx = 1): [number, number][] =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const w = 1 + noise1(i * 0.9, seed) * wob;
    const stretch = Math.sqrt(Math.cos(a) ** 2 + (Math.sin(a) * sx) ** 2);
    return dest(lon, lat, a, rad * w * stretch);
  });

/** Clip a closed polygon of unit-sphere points to the visible hemisphere (z > 0), following the limb. */
const clipHemi = (pts: V3[], R: number): [number, number][] | null => {
  const n = pts.length;
  const s = pts.findIndex((p) => p[2] > 0);
  if (s < 0) return null;
  const out: [number, number][] = [];
  let exitAng: number | null = null;
  for (let k = 0; k < n; k++) {
    const a = pts[(s + k) % n];
    const b = pts[(s + k + 1) % n];
    if (a[2] > 0) out.push([r5(a[0] * R), r5(a[1] * R)]);
    if (a[2] > 0 !== b[2] > 0) {
      const t = a[2] / (a[2] - b[2]);
      const ang = Math.atan2(a[1] + (b[1] - a[1]) * t, a[0] + (b[0] - a[0]) * t);
      if (a[2] > 0) {
        out.push([r5(Math.cos(ang) * R), r5(Math.sin(ang) * R)]);
        exitAng = ang;
      } else {
        if (exitAng !== null) {
          let d = ang - exitAng;
          while (d > Math.PI) d -= Math.PI * 2;
          while (d < -Math.PI) d += Math.PI * 2;
          const steps = Math.ceil(Math.abs(d) / 0.08);
          for (let i = 1; i < steps; i++) {
            const q = exitAng + (d * i) / steps;
            out.push([r5(Math.cos(q) * R), r5(Math.sin(q) * R)]);
          }
        }
        out.push([r5(Math.cos(ang) * R), r5(Math.sin(ang) * R)]);
        exitAng = null;
      }
    }
  }
  return out.length >= 3 ? out : null;
};

/** Crescent of a circle (radius r, at the origin) left uncovered by the same circle shifted by d toward angle `ang`. */
export const crescentPts = (r: number, d: number, ang: number, n = 22): [number, number][] => {
  const dd = Math.min(d, r * 1.98);
  const h = Math.sqrt(Math.max(0, r * r - (dd * dd) / 4));
  const ux = Math.cos(ang);
  const uy = Math.sin(ang);
  const base = Math.atan2(h, dd / 2); // angle of the intersection points from the shift axis (on the outer circle)
  const out: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const a = ang + base + ((Math.PI * 2 - 2 * base) * i) / n;
    out.push([r5(Math.cos(a) * r), r5(Math.sin(a) * r)]);
  }
  const ib = Math.atan2(h, -dd / 2); // same points seen from the shifted centre
  for (let i = n; i >= 0; i--) {
    const a = ang + ib + ((Math.PI * 2 - 2 * ib) * i) / n;
    out.push([r5(dd * ux + Math.cos(a) * r), r5(dd * uy + Math.sin(a) * r)]);
  }
  return out;
};

const ringPts = (r: number, n = 64): [number, number][] => Array.from({ length: n + 1 }, (_, i) => [Math.cos((i / n) * Math.PI * 2) * r, Math.sin((i / n) * Math.PI * 2) * r]);

// Maria: [lon, lat, angular radius (deg), stretch east-west, seed].
const MARIA: [number, number, number, number, number][] = [
  [-57, 18, 21, 0.75, 1], // Oceanus Procellarum (two lobes)
  [-48, -2, 13, 1, 2],
  [-62, 34, 10, 1, 3],
  [-16, 33, 17, 1, 4], // Imbrium
  [17, 28, 10.5, 1, 5], // Serenitatis
  [31, 8.5, 12.5, 1.2, 6], // Tranquillitatis
  [59, 17, 8, 1.15, 7], // Crisium
  [51, -8, 11, 0.8, 8], // Fecunditatis
  [35, -15, 5.5, 1, 9], // Nectaris
  [-17, -21, 11, 1.1, 10], // Nubium
  [-24, -9, 6, 1, 11], // Cognitum
  [-39, -24, 6.5, 1, 12], // Humorum
  [4, 13, 4, 1, 13], // Vaporum
  [-20, 56, 5.5, 3.2, 14], // Frigoris (long band)
  [15, 57, 4.5, 2.6, 15],
  [147, 27, 4.5, 1, 16], // Moscoviense (far side)
  [129, -21, 3, 1, 17], // Tsiolkovskiy
  [163, -34, 2.6, 1, 18], // Ingenii
  [-95, -20, 3.5, 1, 19], // Orientale centre
  [87, 2, 4, 1, 20], // Smythii
];

/** Named craters: [lon, lat, angular radius]. */
const BIG_CRATERS: [number, number, number][] = [
  [-11.4, -43.3, 1.6], // Tycho
  [-20, 9.6, 1.6], // Copernicus
  [-14.4, -58.6, 3.7], // Clavius
  [-9.3, 51.6, 1.7], // Plato
  [-38, 8, 1.1], // Kepler
  [-47.4, 23.7, 0.8], // Aristarchus
  [-151, -36, 8], // Apollo basin
  [133, -75, 5.2], // Schrödinger
  [130, -89.7, 0.4], // Shackleton
];

/** South Pole-Aitken basin: centre and angular radius (≈2,500 km across). */
export const SPA = { lon: -169, lat: -53, rad: 41 };

/** GRAIL mascons (centre, angular radius) for the gravity overlay. */
const MASCONS: [number, number, number][] = [
  [-16, 33, 9],
  [17, 28, 7],
  [59, 17, 6],
  [35, -15, 5],
  [-39, -24, 5],
  [-95, -20, 6],
  [87, 2, 4],
  [147, 27, 4],
];

export type MoonPin = { lon: number; lat: number; color?: string; r?: number };

/**
 * The Moon as a globe. `view` picks what faces the camera ({lon:0, lat:0} =
 * the near side; {lon:180} = the far side; {lat:-90} = straight down on the
 * south pole, near side up). Overlays: `basin` (SPA rim, dashed red),
 * `water` (faint water signs, denser toward the poles), `he3` (helium-3 in
 * the sunlit low-latitude soil of the near side),
 * `basinTint`, `gravity` (GRAIL-style map), `xray`, `mass` (the buried mass
 * under SPA), `ice` (polar ice dots), `grid`.
 */
export const MoonGlobe: React.FC<
  XProps & {
    r?: number;
    view?: MoonView;
    craters?: number;
    seed?: number;
    basin?: number;
    basinTint?: number;
    gravity?: number;
    xray?: number;
    mass?: number;
    ice?: number;
    water?: number;
    he3?: number;
    grid?: number;
    glow?: number;
    pins?: MoonPin[];
    sunDir?: [number, number];
    shadow?: number;
  }
> = ({ r = 400, view = { lon: 0, lat: 0 }, craters = 70, seed = 7, basin = 0, basinTint = 0, gravity = 0, xray = 0, mass = 0, ice = 0, water = 0, he3 = 0, grid = 0, glow = 0.5, pins = [], sunDir = [-0.7, 0.6], shadow = 1, ...xf }) => {
  const frame = useCurrentFrame();
  const P = (lon: number, lat: number) => moonProj(lon, lat, view);
  const ringOn = (lon: number, lat: number, rad: number, sd: number, wob = 0.18, sx = 1) => clipHemi(capRing(lon, lat, rad, sd, wob, 30, sx).map(([a, b]) => P(a, b)), r);

  const maria = MARIA.map(([lon, lat, rad, sx, sd]) => ringOn(lon, lat, rad, sd, 0.2, sx)).filter((m): m is [number, number][] => !!m);
  const rr = rng(seed);
  const field = Array.from({ length: craters }, () => {
    const lon = rr() * 360 - 180;
    const lat = Math.asin(rr() * 2 - 1) / D2R;
    const rad = 0.7 + rr() ** 3 * 5.5;
    return [lon, lat, rad] as [number, number, number];
  });
  const crs = [...BIG_CRATERS, ...field]
    .map(([lon, lat, rad]) => {
      const [x, y, z] = P(lon, lat);
      if (z < 0.12) return null;
      const a = r * Math.sin(rad * D2R);
      if (a < 3) return null;
      return { x: r5(x * r), y: r5(y * r), a: r5(a), b: r5(Math.max(1.5, a * z)), rot: Math.round(Math.atan2(y, x) * 100) / 100 };
    })
    .filter((c): c is { x: number; y: number; a: number; b: number; rot: number } => !!c);

  // shading crescent on the side away from the light
  const la = Math.atan2(sunDir[1], sunDir[0]);
  const shadeShape = crescentPts(r, r * 0.42, la);
  const shadeShape2 = crescentPts(r, r * 0.22, la);
  const litEdge = crescentPts(r, r * 0.06, la + Math.PI);

  // SPA rim: visible runs, dashed
  const rimRuns: [number, number][][] = [];
  if (basin > 0) {
    const pts = capRing(SPA.lon, SPA.lat, SPA.rad, 3, 0.04, 120).map(([a, b]) => P(a, b));
    let run: [number, number][] = [];
    const dashN = 4;
    pts.concat([pts[0]]).forEach((p, i) => {
      const on = p[2] > 0.02 && Math.floor(i / dashN) % 2 === 0 && i / pts.length <= basin;
      if (on) run.push([r5(p[0] * r), r5(p[1] * r)]);
      else {
        if (run.length > 1) rimRuns.push(run);
        run = [];
      }
    });
    if (run.length > 1) rimRuns.push(run);
  }
  const spaFill = basinTint > 0 ? ringOn(SPA.lon, SPA.lat, SPA.rad, 3, 0.04) : null;

  const massP = P(SPA.lon + 6, SPA.lat - 4);
  const ri = rng(seed + 9);
  const iceDots =
    ice > 0
      ? Array.from({ length: 70 }, (_, i) => {
          const south = i % 2 === 0;
          const lat = (south ? -1 : 1) * (79 + ri() * 10.5);
          const lon = ri() * 360 - 180;
          const [x, y, z] = P(lon, lat);
          return z > 0.05 ? [x * r, y * r, 5 + ri() * 7] : null;
        }).filter((d): d is number[] => !!d)
      : [];

  const rw = rng(seed + 17);
  const waterDots =
    water > 0
      ? Array.from({ length: 150 }, () => {
          const lat = (rw() < 0.5 ? -1 : 1) * (15 + 75 * Math.sqrt(rw()));
          const [x, y, z] = P(rw() * 360 - 180, lat);
          const sz = (4 + rw() * 6) * (r / 400) * (0.6 + Math.abs(lat) / 90);
          return z > 0.08 ? [x * r, y * r, sz] : null;
        }).filter((d): d is number[] => !!d)
      : [];
  const rh = rng(seed + 23);
  const he3Dots =
    he3 > 0
      ? Array.from({ length: 140 }, () => {
          const lat = (rh() - 0.5) * 100;
          const [x, y, z] = P(rh() * 120 - 60, lat);
          const sz = (5 + rh() * 7) * (r / 400);
          return z > 0.08 ? [x * r, y * r, sz] : null;
        }).filter((d): d is number[] => !!d)
      : [];
  const gridLines: [number, number][][] = [];
  if (grid > 0) {
    for (let lon = -180; lon < 180; lon += 30) {
      let run: [number, number][] = [];
      for (let lat = -90; lat <= 90; lat += 5) {
        const p = P(lon, lat);
        if (p[2] > 0) run.push([r5(p[0] * r), r5(p[1] * r)]);
        else {
          if (run.length > 1) gridLines.push(run);
          run = [];
        }
      }
      if (run.length > 1) gridLines.push(run);
    }
    for (let lat = -60; lat <= 60; lat += 30) {
      let run: [number, number][] = [];
      for (let lon = -180; lon <= 180; lon += 5) {
        const p = P(lon, lat);
        if (p[2] > 0) run.push([r5(p[0] * r), r5(p[1] * r)]);
        else {
          if (run.length > 1) gridLines.push(run);
          run = [];
        }
      }
      if (run.length > 1) gridLines.push(run);
    }
  }

  const rg = rng(seed + 31);
  const speckle =
    gravity > 0
      ? Array.from({ length: 46 }, () => {
          const [x, y, z] = P(rg() * 360 - 180, Math.asin(rg() * 2 - 1) / D2R);
          const sz = (14 + rg() * 30) * (r / 400);
          return z > 0.1 && Math.hypot(x, y) * r + sz < r * 0.97 ? { x: x * r, y: y * r, s: sz, c: ["#f2d24a", "#9ad25a", "#f29a3a", "#5ac2d2"][Math.floor(rg() * 4)] } : null;
        }).filter((d): d is { x: number; y: number; s: number; c: string } => !!d)
      : [];

  const xr = Math.min(1, xray);
  return (
    <X {...xf}>
      {glow > 0 ? (
        <>
          <Glow rx={r * 1.95} power={2.2} color={xr > 0.5 ? "#6ab8ff" : "#d8d2ff"} alpha={0.34 * glow} additive z={-0.011} />
          <Glow rx={r * 1.18} inner={0.8} power={1.3} color={xr > 0.5 ? "#8ad0ff" : "#f6f6ff"} alpha={0.62 * glow} additive z={-0.01} />
        </>
      ) : null}
      <Part shape={circle(r)} color={HIGHLAND} flat outline={0} />
      {/* maria: merged outline pass, then fills */}
      {maria.map((m, i) => (
        <Part key={`mo${i}`} shape={poly(m)} color={MARE} flat outline={4} outlineColor="#6a6f7d" z={0.001} />
      ))}
      {maria.map((m, i) => (
        <Part key={`mf${i}`} shape={poly(m)} color={MARE} flat outline={0} z={0.002} />
      ))}
      {spaFill ? <Part shape={poly(spaFill)} color="#6a5a8a" flat outline={0} opacity={0.45 * basinTint} z={0.0025} /> : null}
      {crs.map((c, i) => (
        <X key={`c${i}`} x={c.x} y={c.y} rot={c.rot} z={0.003 + i * 0.00001}>
          <Part shape={ellipse(c.b, c.a)} color={RIM} flat outline={c.a > 14 ? 3 : 0} outlineColor="#77747a" />
          <Part shape={ellipse(c.b * 0.74, c.a * 0.74)} color={FLOOR} flat outline={0} x={c.b * 0.1} z={0.0001} />
        </X>
      ))}
      {/* shading */}
      {shadow > 0 ? (
        <>
          <Part shape={poly(shadeShape2)} color="#4a4466" flat outline={0} opacity={0.16 * shadow} z={0.01} />
          <Part shape={poly(shadeShape)} color="#3a3456" flat outline={0} opacity={0.26 * shadow} z={0.011} />
          <Part shape={poly(litEdge)} color="#ffffff" flat outline={0} opacity={0.4 * shadow} z={0.012} />
        </>
      ) : null}
      {/* gravity map */}
      {gravity > 0 ? (
        <X z={0.02}>
          <Part shape={circle(r)} color="#d9cf4a" flat outline={0} opacity={0.55 * gravity} />
          {speckle.map((s, i) => (
            <Part key={`sp${i}`} shape={circle(s.s)} color={s.c} flat outline={0} opacity={0.7 * gravity} x={s.x} y={s.y} z={0.001} />
          ))}
          {MASCONS.map(([lon, lat, rad], i) => {
            const ring = ringOn(lon, lat, rad * 1.9, 40 + i, 0.1);
            const core = ringOn(lon, lat, rad, 50 + i, 0.12);
            return (
              <React.Fragment key={`g${i}`}>
                {ring ? <Part shape={poly(ring)} color="#3a6ad2" flat outline={0} opacity={0.85 * gravity} z={0.002} /> : null}
                {core ? <Part shape={poly(core)} color="#e2402a" flat outline={0} opacity={0.9 * gravity} z={0.003} /> : null}
              </React.Fragment>
            );
          })}
        </X>
      ) : null}
      {/* X-ray look */}
      {xr > 0 ? (
        <X z={0.03}>
          <Part shape={circle(r)} color="#10263e" flat outline={0} opacity={0.9 * xr} />
          {ringPts(r * 0.94).length ? <Line pts={ringPts(r * 0.94)} width={6} color="#8fd0ff" opacity={0.6 * xr} z={0.001} /> : null}
          <Part shape={circle(r * 0.62)} color="#1d3d5e" flat outline={0} opacity={0.8 * xr} z={0.001} />
          <Part shape={circle(r * 0.22)} color="#4a7aa8" flat outline={0} opacity={0.9 * xr} z={0.002} />
          <Glow rx={r * 0.3} color="#9ad8ff" alpha={0.5 * xr} additive z={0.003} />
        </X>
      ) : null}
      {grid > 0 ? gridLines.map((g, i) => <Line key={`gl${i}`} pts={g} width={3} color={xr > 0.5 ? "#9ad8ff" : "#ffffff"} opacity={0.45 * grid} z={0.035} />) : null}
      {rimRuns.map((run, i) => (
        <Line key={`rim${i}`} pts={run} width={12} color="#fe5649" z={0.04} />
      ))}
      {mass > 0 && massP[2] > 0 ? (
        <X x={massP[0] * r} y={massP[1] * r} z={0.05}>
          <Glow rx={r * 0.32} color="#ffb04a" alpha={0.55 * mass * (0.85 + 0.15 * Math.sin(frame * 0.15))} additive />
          <Part
            shape={blob([[-r * 0.16, 0], [-r * 0.08, r * 0.08], [r * 0.1, r * 0.07], [r * 0.18, -r * 0.01], [r * 0.07, -r * 0.09], [-r * 0.1, -r * 0.07]], 8)}
            color="#c98a3a"
            flat
            outline={6}
            opacity={Math.min(1, mass * 1.5)}
            s={0.4 + 0.6 * Math.min(1, mass)}
            z={0.001}
          />
        </X>
      ) : null}
      {waterDots.map(([x, y, s], i) => (
        <Part key={`w${i}`} shape={circle(s)} color="#5ac8ff" flat outline={0} opacity={Math.min(0.85, water)} x={x} y={y} z={0.055} />
      ))}
      {he3Dots.map(([x, y, s], i) => (
        <Part key={`h${i}`} shape={circle(s)} color="#ffd84a" flat outline={0} opacity={Math.min(0.9, he3)} x={x} y={y} z={0.056} />
      ))}
      {iceDots.map(([x, y, s], i) => (
        <Part key={`ice${i}`} shape={circle(s)} color={ICE} flat outline={2.5} opacity={Math.min(1, ice * 1.4)} x={x} y={y} s={Math.min(1, ice * 1.3)} z={0.06} />
      ))}
      {pins.map((p, i) => {
        const [x, y, z] = P(p.lon, p.lat);
        if (z < 0) return null;
        const pr = p.r ?? 16;
        return (
          <X key={`p${i}`} x={x * r} y={y * r} z={0.07}>
            <Part shape={circle(pr * (1.6 + 0.4 * Math.sin(frame * 0.2 + i)))} color={p.color ?? "#fe5649"} flat outline={0} opacity={0.35} />
            <Part shape={circle(pr)} color={p.color ?? "#fe5649"} flat outline={4} z={0.001} />
          </X>
        );
      })}
      <Line pts={ringPts(r)} width={8} color={INK} z={0.08} />
    </X>
  );
};

// ───────────────────────── polar maps ─────────────────────────

/** Polar map coordinates (azimuthal equidistant): south = near side (lon 0) up, east right; north = near side down. */
export const poleXY = (lon: number, lat: number, ppd = 40, pole: "south" | "north" = "south", rot = 0): [number, number] => {
  const r = (90 - Math.abs(lat)) * ppd;
  const a = lon * D2R;
  const x = r * Math.sin(a);
  const y = (pole === "south" ? 1 : -1) * r * Math.cos(a);
  return [x * Math.cos(rot) - y * Math.sin(rot), x * Math.sin(rot) + y * Math.cos(rot)];
};

/** Named places near the lunar poles: [lon, lat, diameter km]. */
export const LUNAR_SITES: Record<string, [number, number, number]> = {
  shackleton: [129.8, -89.67, 21],
  deGerlache: [-87.1, -88.5, 32],
  sverdrup: [-152, -88.3, 33],
  shoemaker: [44.9, -88.1, 51],
  faustini: [77, -87.3, 39],
  haworth: [-5.2, -87.45, 51],
  slater: [110.5, -88.1, 24],
  nobile: [53.5, -85.2, 73],
  cabeus: [-42.1, -85.33, 98],
  amundsen: [85.6, -84.4, 103],
  malapert: [12.9, -84.9, 69],
  wiechert: [165, -84.5, 41],
  scott: [48.3, -81.9, 103],
  idelson: [110.9, -81.5, 60],
  newton: [-16.9, -76.7, 79],
  moretus: [-5.8, -70.6, 111],
  boguslawsky: [43.3, -72.9, 95],
  manzinus: [26.8, -67.7, 98],
  simpelius: [15.2, -73, 70],
  schomberger: [24.9, -76.7, 85],
  demonax: [59, -78.2, 128],
  hale: [90.8, -74.2, 83],
  drygalski: [-84.9, -79.3, 163],
  schrodinger: [132.4, -75, 316],
  zeeman: [-133.6, -75.2, 190],
  // landing sites (diameter 0)
  vikram: [32.32, -69.37, 0],
  luna25: [43.5, -69.5, 0],
  luna25crash: [61.4, -57.9, 0],
  odysseus: [1.44, -80.13, 0],
  athena: [29.2, -84.7, 0],
  change7: [140, -89.2, 0],
  malapertPeak: [0, -86, 0],
  // north pole
  peary: [33, 88.6, 79],
  hermite: [-89.9, 86, 104],
  rozhdestvenskiy: [-155.4, 85.2, 177],
  plaskett: [174.3, 82.1, 109],
  byrd: [9.8, 85.3, 94],
  nansen: [95.3, 80.5, 104],
  whipple: [118.2, 89.1, 15],
  sylvester: [-79.6, 82.7, 58],
  lovelace: [-107.3, 82.1, 54],
  gioja: [2, 83.3, 41],
  hinshelwood: [-22.7, 89.3, 35],
};

type MapCrater = { x: number; y: number; r: number; lat: number };

/** Crater on a map (top view): rim, floor in shadow, a lit crescent on the side away from the Sun; `dark` 0..1 = permanently shadowed. */
const MapCraterView: React.FC<XProps & { r: number; sunAng: number; dark?: number; ice?: number; seed?: number }> = ({ r, sunAng, dark = 0, ice = 0, seed = 1, ...xf }) => {
  const lit = crescentPts(r * 0.86, r * 0.86 * (0.35 + 0.5 * (1 - dark)), sunAng);
  const rr = rng(seed);
  const n = Math.max(2, Math.round(r / 7));
  return (
    <X {...xf}>
      <Part shape={circle(r)} color={RIM} flat outline={r > 22 ? 4 : 3} />
      <Part shape={circle(r * 0.86)} color={dark > 0.5 ? "#1c2036" : "#3a3848"} flat outline={0} z={0.001} />
      {dark < 0.98 ? <Part shape={poly(lit)} color="#bcb7ae" flat outline={0} opacity={1 - dark} z={0.002} /> : null}
      {ice > 0
        ? Array.from({ length: n }, (_, i) => {
            const a = rr() * Math.PI * 2;
            const d = Math.sqrt(rr()) * r * 0.55;
            return <Part key={i} shape={circle(Math.max(2.5, r * 0.09))} color={ICE} flat outline={0} opacity={Math.min(1, ice * 1.5)} x={Math.cos(a) * d} y={Math.sin(a) * d} z={0.003} />;
          })
        : null}
    </X>
  );
};

/**
 * Illustrated polar map of the Moon (top view): terrain, the named craters at
 * their real coordinates (`LUNAR_SITES`) plus a seeded crater field, crater
 * shadows for a Sun at azimuth `sunAz` (rad, screen angle the light comes
 * from), `psr` (permanently shadowed floors near the pole go dark), `ice`
 * (cyan grains in them), dashed latitude `circles`, `glowPeaks` (sunlit
 * rims), `iceCraters` (north: highlighted small craters with ice). The map
 * draws at z −41…−39; children at z > −39 are on top.
 */
export const LunarPoleMap: React.FC<
  XProps & {
    pole?: "south" | "north";
    ppd?: number;
    rot?: number;
    w?: number;
    h?: number;
    sunAz?: number;
    psr?: number;
    ice?: number;
    circles?: number[];
    glowPeaks?: number;
    iceCraters?: number;
    seed?: number;
    field?: number;
    children?: React.ReactNode;
  }
> = ({ pole = "south", ppd = 40, rot = 0, w = 3000, h = 1800, sunAz = 2.6, psr = 0, ice = 0, circles = [], glowPeaks = 0, iceCraters = 0, seed = 5, field = 140, children, ...xf }) => {
  const frame = useCurrentFrame();
  const S = pole === "south" ? -1 : 1;
  const named: MapCrater[] = Object.values(LUNAR_SITES)
    .filter(([, lat, d]) => d > 0 && Math.sign(lat) === S)
    .map(([lon, lat, d]) => {
      const [x, y] = poleXY(lon, lat, ppd, pole, rot);
      return { x, y, r: (d / 30.33 / 2) * ppd, lat };
    })
    .filter((c) => Math.abs(c.x) < w / 2 + c.r && Math.abs(c.y) < h / 2 + c.r);
  const rr = rng(seed);
  const fieldC: MapCrater[] = [];
  for (let i = 0; i < field * 3 && fieldC.length < field; i++) {
    const x = (rr() - 0.5) * w;
    const y = (rr() - 0.5) * h;
    const r = (6 + rr() ** 2.6 * 70) * (ppd / 40);
    if (Math.abs(x) + r > w / 2 - 4 || Math.abs(y) + r > h / 2 - 4) continue;
    const all = [...named, ...fieldC];
    if (all.some((c) => Math.hypot(c.x - x, c.y - y) < (c.r + r) * 0.92)) continue;
    const lat = S * (90 - Math.hypot(x, y) / ppd);
    fieldC.push({ x, y, r, lat });
  }
  const darkOf = (c: MapCrater) => (Math.abs(c.lat) > 84.5 ? psr : Math.abs(c.lat) > 82 ? psr * 0.6 : 0);
  // north ice craters: the small craters nearest the pole
  const iceSet = new Set(
    fieldC
      .map((c, i) => [i, Math.abs(c.lat), c.r] as [number, number, number])
      .filter(([, lat, r]) => lat > 80.5 && r < 40 * (ppd / 40))
      .slice(0, 44)
      .map(([i]) => i),
  );
  const rt = rng(seed + 3);
  const ridges = Array.from({ length: 16 }, () => {
    const l = (80 + rt() * 160) * Math.min(1, w / 1600);
    return [(rt() - 0.5) * (w - 2 * l), (rt() - 0.5) * (h - 2 * l), l, rt() * Math.PI] as [number, number, number, number];
  });
  return (
    <X {...xf}>
      <Part shape={roundRect(w, h, 0)} color="#c3beb5" flat outline={0} z={-41} />
      {ridges.map(([x, y, l, a], i) => (
        <Part key={`rg${i}`} shape={blob([[-l, 0], [-l * 0.3, l * 0.22], [l * 0.4, l * 0.16], [l, 0], [l * 0.3, -l * 0.2], [-l * 0.4, -l * 0.18]], 8)} color="#b5b0a7" flat outline={0} x={x} y={y} rot={a} z={-40.9} />
      ))}
      {circles.map((lat) => {
        const R = (90 - lat) * ppd;
        return (
          <React.Fragment key={`lc${lat}`}>
            {Array.from({ length: 48 }, (_, i) =>
              i % 2 ? null : (
                <Line
                  key={i}
                  pts={[
                    [Math.cos((i / 48) * Math.PI * 2) * R, Math.sin((i / 48) * Math.PI * 2) * R],
                    [Math.cos(((i + 1) / 48) * Math.PI * 2) * R, Math.sin(((i + 1) / 48) * Math.PI * 2) * R],
                  ]}
                  width={5}
                  color="#5a5664"
                  opacity={0.7}
                  z={-39.4}
                />
              ),
            )}
          </React.Fragment>
        );
      })}
      {[...fieldC.map((c, i) => ({ ...c, k: `f${i}`, ice: pole === "north" ? (iceSet.has(i) ? iceCraters : 0) : ice * (darkOf(c) > 0.5 ? 1 : 0) })), ...named.map((c, i) => ({ ...c, k: `n${i}`, ice: pole === "south" ? ice * (darkOf(c) > 0.5 ? 1 : 0) : 0 }))]
        .sort((a, b) => b.r - a.r)
        .map((c, i) => (
          <React.Fragment key={c.k}>
            <MapCraterView x={r5(c.x)} y={r5(c.y)} r={r5(c.r)} sunAng={sunAz} dark={darkOf(c)} ice={c.ice} seed={i + 3} z={-40 + i * 0.0005} />
            {pole === "north" && c.ice > 0 ? (
              <Part shape={circle(c.r + 10)} color="#5ad2ff" flat outline={0} opacity={0.35 * c.ice * (0.8 + 0.2 * Math.sin(frame * 0.15 + i))} x={c.x} y={c.y} z={-40.0001 + i * 0.0005} />
            ) : null}
          </React.Fragment>
        ))}
      {glowPeaks > 0
        ? [LUNAR_SITES.shackleton, LUNAR_SITES.deGerlache, LUNAR_SITES.malapertPeak].map(([lon, lat, d], i) => {
            const [x, y] = poleXY(lon, lat, ppd, pole, rot);
            const R = Math.max(30, (d / 30.33 / 2) * ppd);
            return <Glow key={`pk${i}`} rx={R * 1.6} color="#ffe27a" alpha={0.55 * glowPeaks * (0.85 + 0.15 * Math.sin(frame * 0.12 + i))} additive x={x + Math.cos(sunAz) * R} y={y + Math.sin(sunAz) * R} z={-39.3} />;
          })
        : null}
      {children}
    </X>
  );
};

// ───────────────────────── landscape ─────────────────────────

/** Squashed crater on the ground in perspective: rim, shadowed bowl, lit far wall. `shadow` 0..1 fills the bowl. */
export const GroundCrater: React.FC<XProps & { r: number; sq?: number; sunLeft?: boolean; shadow?: number; ice?: number }> = ({ r, sq = 0.28, sunLeft = true, shadow = 0.6, ice = 0, ...xf }) => {
  const lit = crescentPts(r * 0.82, r * 0.82 * (0.2 + 1.6 * (1 - shadow)), sunLeft ? Math.PI : 0);
  return (
    <X {...xf}>
      <X sy={sq}>
        <Part shape={circle(r)} color={RIM} flat outline={0} />
        <Part shape={circle(r * 0.82)} color="#2e2c3a" flat outline={0} z={0.001} />
        {shadow < 0.99 ? <Part shape={poly(lit)} color="#b3aea6" flat outline={0} z={0.002} /> : null}
        {ice > 0
          ? [-0.4, -0.1, 0.2, 0.45, 0.05].map((k, i) => (
              <Part key={i} shape={circle(r * 0.07)} color={ICE} flat outline={0} opacity={Math.min(1, ice * 1.4)} x={k * r} y={((i % 3) - 1) * r * 0.25} z={0.003} />
            ))
          : null}
      </X>
      <Line pts={ringPts(r, 48).map(([x, y]) => [x, y * sq] as [number, number])} width={5} color={INK} z={0.004} />
    </X>
  );
};

/** A grey boulder with a long cast shadow (low Sun). */
export const MoonRock: React.FC<XProps & { size?: number; seed?: number; sunLeft?: boolean; shadowLen?: number }> = ({ size = 60, seed = 1, sunLeft = true, shadowLen = 4, ...xf }) => {
  const r = rng(seed);
  const pts: [number, number][] = Array.from({ length: 7 }, (_, i) => {
    const a = Math.PI * (i / 6);
    const d = size * (0.75 + r() * 0.45);
    return [Math.round(Math.cos(a) * d), Math.round(Math.sin(a) * d * 0.8)];
  });
  const L = size * shadowLen * (sunLeft ? 1 : -1);
  return (
    <X {...xf}>
      <Part shape={poly([[-size * 0.9, 0], [size * 0.9, 0], [size * 0.9 + L * 0.9, -size * 0.18], [size * 0.3 + L, -size * 0.3], [-size * 0.6 + L * 0.6, -size * 0.22]].map(([x, y]) => [Math.round(x), Math.round(y)] as [number, number]))} color="#1c1a26" flat outline={0} opacity={0.5} z={-0.001} />
      <Part shape={roundPoly(pts, size * 0.25)} color="#a29e98" shade={0.42} light={{ dir: [sunLeft ? -1 : 1, 0.25] }} />
    </X>
  );
};

/**
 * Raised crater (the classic cartoon Moon crater): a low cone with a flat
 * rim on top, a dark bowl, radial streaks down the slopes and a lit side.
 * Only the top profile is outlined so the base melts into the ground.
 * Origin = ground level at the centre; `r` = rim radius.
 */
export const CraterCone: React.FC<XProps & { r?: number; h?: number; sq?: number; seed?: number; sunLeft?: boolean; color?: string }> = ({ r = 140, h, sq = 0.26, seed = 1, sunLeft = true, color = "#b2aebb", ...xf }) => {
  const H = Math.round(h ?? r * 0.42);
  const R = r * 2.3;
  const prof: [number, number][] = [];
  for (let i = 0; i <= 20; i++) {
    const x = -R + (2 * R * i) / 20;
    const ax = Math.abs(x);
    const y = ax <= r ? H : H * ((R - ax) / (R - r)) ** 1.7;
    prof.push([Math.round(x), Math.round(y)]);
  }
  const body = poly([...prof, [Math.round(R), -2], [Math.round(-R), -2]]);
  const sd = sunLeft ? -1 : 1;
  const litPts: [number, number][] = prof.filter(([x]) => x * sd >= -r * 0.2).map(([x, y]) => [x, y] as [number, number]);
  const lit = poly([...litPts, [litPts[litPts.length - 1][0], -2], [litPts[0][0], -2]]);
  const rr = rng(seed);
  const streaks = Array.from({ length: 16 }, (_, i) => {
    const a = Math.PI + (Math.PI * (i + 0.5)) / 16 + (rr() - 0.5) * 0.12;
    const x0 = Math.cos(a) * r * 0.98;
    const y0 = H + Math.sin(a) * r * sq;
    const x1 = Math.cos(a) * (r + (R - r) * (0.55 + rr() * 0.4)) * 1.02;
    const y1 = Math.max(4, H * (1 - (Math.abs(x1) - r) / (R - r)) ** 1.7 * 0.5 + Math.sin(a) * r * sq * 0.3);
    return [[Math.round(x0), Math.round(y0)], [Math.round(x1), Math.round(y1)]] as [number, number][];
  });
  const inner = crescentPts(r * 0.8, r * 0.5, sunLeft ? 0 : Math.PI);
  return (
    <X {...xf}>
      <Part shape={ellipse(Math.round(R * 0.95), Math.round(R * 0.16))} color="#1c1a26" flat outline={0} opacity={0.22} x={Math.round(-sd * R * 0.25)} y={-6} z={-0.002} />
      <Part shape={body} color={shadeHex(color, 0.16)} flat outline={0} />
      <Part shape={lit} color={color} flat outline={0} z={0.0005} />
      {streaks.map((pts, i) => (
        <Line key={i} pts={pts} width={i % 3 ? 3 : 4} color={i % 4 === 1 ? "#e8e6ee" : shadeHex(color, 0.34)} opacity={0.75} z={0.001} />
      ))}
      <Line pts={prof.filter(([x]) => Math.abs(x) >= r * 0.98)} width={5} color={INK} opacity={0.85} z={0.0015} />
      <X y={H} sy={sq} z={0.002}>
        <Part shape={circle(r)} color="#d6d2dc" flat outline={5} />
        <Part shape={circle(Math.round(r * 0.8))} color="#4a4660" flat outline={0} z={0.001} />
        <Part shape={poly(inner)} color="#8a86a0" flat outline={0} z={0.002} />
      </X>
    </X>
  );
};

/**
 * Low-sun lunar landscape (south pole look): black sky with stars, an
 * optional Sun near the horizon and Earth, ridges with lit and shadowed
 * faces, grey ground with craters and boulders casting long shadows.
 * Ground starts at `horizon` (y) and runs down. The set draws at z −41…−36;
 * children at z > −36 are on top.
 */
export const LunarSurface: React.FC<
  XProps & {
    w?: number;
    horizon?: number;
    sun?: [number, number] | null;
    earth?: [number, number, number] | null;
    seed?: number;
    ridges?: number;
    rocks?: number;
    craters?: number;
    ground?: [string, string];
    stars?: number;
    /** Raised crater cones with radial streaks in the middle distance. */
    cones?: number;
    /** Sky look: violet-indigo night with soft nebula (default) or plain black. */
    sky?: "violet" | "black";
    children?: React.ReactNode;
  }
> = ({ w = 4400, horizon = 60, sun = [-1500, 140], earth = null, seed = 3, ridges = 1, rocks = 9, craters = 6, ground = ["#9a97a4", "#d4d1d8"], stars = 110, cones = 3, sky = "violet", children, ...xf }) => {
  const frame = useCurrentFrame();
  const sunLeft = !sun || sun[0] < 0;
  const r = rng(seed);
  const starPts = Array.from({ length: stars }, () => [(r() - 0.5) * w, horizon + 80 + r() * 1400, 1.5 + r() * 2.6, r() * 6] as [number, number, number, number]);
  const mounts = Array.from({ length: 9 }, (_, i) => {
    const x = -w / 2 + (i + 0.3 + r() * 0.4) * (w / 8.5);
    const hgt = (90 + r() * 200) * ridges;
    const half = 220 + r() * 260;
    return { x, hgt, half };
  });
  const rc = rng(seed + 5);
  const crs = Array.from({ length: craters }, () => {
    const depth = rc();
    const y = horizon - 60 - depth * 760;
    const rad = 70 + depth * 330 + rc() * 60;
    return { x: (rc() - 0.5) * (w * 0.8), y, rad, sq: 0.18 + depth * 0.16 };
  });
  const rocksA = Array.from({ length: rocks }, () => {
    const depth = rc();
    return { x: (rc() - 0.5) * w * 0.85, y: horizon - 40 - depth * 820, s: 14 + depth * 70 + rc() * 20, seed: Math.floor(rc() * 100) };
  });
  const rs = rng(seed + 11);
  const sparks = Array.from({ length: 6 }, () => [(rs() - 0.5) * 2600, horizon + 200 + rs() * 900, 14 + rs() * 18, rs() * 6.28] as [number, number, number, number]);
  const coneA = Array.from({ length: cones }, (_, i) => {
    const side = (i + seed) % 2 ? 1 : -1;
    const depth = 0.15 + rs() * 0.55;
    return { x: side * (420 + i * 380 + rs() * 420), y: horizon - 30 - depth * 300, r: 60 + depth * 150 + rs() * 30, seed: Math.floor(rs() * 100) };
  });
  const mottle = Array.from({ length: 10 }, () => [(rs() - 0.5) * w * 0.7, horizon - 80 - rs() * 900, 160 + rs() * 380, rs()] as [number, number, number, number]);
  return (
    <X {...xf}>
      <Gradient w={w} h={2400} y={horizon + 1200} stops={sky === "violet" ? [[0, "#080822"], [0.6, "#151548"], [1, "#2c2466"]] : [[0, "#03040a"], [0.75, "#0b0d18"], [1, "#171a2a"]]} z={-41} />
      {sky === "violet" ? (
        <>
          <Glow rx={1500} ry={420} x={sunLeft ? 700 : -700} y={horizon + 520} rot={sunLeft ? -0.2 : 0.2} color="#7a46d6" alpha={0.28} additive z={-40.95} />
          <Glow rx={900} ry={300} x={sunLeft ? 1100 : -1100} y={horizon + 760} rot={sunLeft ? -0.3 : 0.3} color="#c43aa6" alpha={0.16} additive z={-40.94} />
          {sparks.map(([x, y, s, ph], i) => (
            <Sparkle key={`sp${i}`} size={s * (0.75 + 0.25 * Math.sin(frame * 0.1 + ph))} alpha={0.7 + 0.3 * Math.sin(frame * 0.1 + ph)} x={x} y={y} z={-40.93} />
          ))}
        </>
      ) : null}
      {starPts.map(([x, y, s, ph], i) => (
        <Part key={`st${i}`} shape={circle(Math.round(s * 2) / 2)} color="#ffffff" flat outline={0} x={x} y={y} opacity={0.45 + 0.4 * Math.sin(frame * 0.06 + ph)} z={-40.9} />
      ))}
      {earth ? <Globe r={earth[2]} x={earth[0]} y={earth[1]} lon0={62} lat0={12} glow={1.4} z={-40.8} /> : null}
      {sun ? (
        <X x={sun[0]} y={sun[1]} z={-40.7}>
          <Glow rx={900} ry={520} color="#fff2c6" alpha={0.35} additive />
          <Glow rx={260} color="#ffffff" alpha={0.7} additive z={0.001} />
          <Part shape={circle(62)} color="#fffbea" flat outline={0} z={0.002} />
        </X>
      ) : null}
      {ridges > 0
        ? mounts.map((m, i) => {
            const pk = [m.x, horizon + m.hgt] as [number, number];
            const shape = roundPoly(
              [
                [m.x - m.half, horizon - 4],
                [m.x - m.half * 0.55, horizon + m.hgt * 0.42],
                [pk[0] - m.half * 0.2, pk[1] - m.hgt * 0.1],
                pk,
                [pk[0] + m.half * 0.24, pk[1] - m.hgt * 0.16],
                [m.x + m.half * 0.6, horizon + m.hgt * 0.36],
                [m.x + m.half, horizon - 4],
              ].map(([x, y]) => [Math.round(x), Math.round(y)] as [number, number]),
              [0, 60, 40, 34, 40, 60, 0],
            );
            const sideX = sunLeft ? -1 : 1;
            const litFace = poly([[m.x + sideX * m.half * 0.98, horizon - 2], [pk[0] + sideX * m.half * 0.18, pk[1] - m.hgt * 0.14], [pk[0], pk[1] - 6], [m.x + sideX * m.half * 0.12, horizon - 2]].map(([x, y]) => [Math.round(x), Math.round(y)] as [number, number]));
            return (
              <X key={`m${i}`} z={-40 + i * 0.01}>
                <Part shape={shape} color={sky === "violet" ? "#5e587a" : "#4e4b5a"} flat outline={6} />
                <Part shape={litFace} color={sky === "violet" ? "#dcd8e6" : "#d9d4ca"} flat outline={0} z={0.0005} />
              </X>
            );
          })
        : null}
      <Gradient w={w} h={1600} y={horizon - 800} stops={[[0, ground[0]], [1, ground[1]]]} z={-39} />
      <Line pts={[[-w / 2, horizon], [w / 2, horizon]]} width={6} color={INK} z={-38.9} />
      {mottle.map(([x, y, s, k], i) => (
        <Part key={`mo${i}`} shape={ellipse(Math.round(s), Math.round(s * 0.16))} color={k > 0.5 ? "#7e7a8c" : "#f0eef4"} flat outline={0} opacity={0.18} x={x} y={y} z={-38.95 + i * 0.001} />
      ))}
      {coneA
        .sort((a, b) => b.y - a.y)
        .map((c, i) => (
          <CraterCone key={`cc${i}`} r={c.r} seed={c.seed} x={c.x} y={c.y} sunLeft={sunLeft} z={-38.6 + i * 0.01} />
        ))}
      {crs
        .sort((a, b) => b.y - a.y)
        .map((c, i) => (
          <GroundCrater key={`c${i}`} r={c.rad} sq={c.sq} x={c.x} y={c.y} sunLeft={sunLeft} shadow={0.55} z={-38 + i * 0.01} />
        ))}
      {rocksA
        .sort((a, b) => b.y - a.y)
        .map((k, i) => (
          <MoonRock key={`r${i}`} size={k.s} seed={k.seed} x={k.x} y={k.y} sunLeft={sunLeft} z={-37 + i * 0.01} />
        ))}
      {children}
    </X>
  );
};

// ───────────────────────── cross-section diagram ─────────────────────────

/**
 * Crater cross-section: ground block with a regolith band and strata, a bowl
 * with raised rims, the Sun's grazing light (`sun` position, local coords),
 * the shadow it casts in the bowl, `ice` at the bottom, `peaks` glowing sunlit
 * rims, `rays` light lines, a buried `mass` that pulls the floor down by `dip`.
 * Origin = ground level at the crater centre.
 */
export const CraterSection: React.FC<
  XProps & {
    w?: number;
    craterW?: number;
    depth?: number;
    blockH?: number;
    sun?: [number, number] | null;
    shadowK?: number;
    ice?: number;
    peaks?: number;
    rays?: number;
    mass?: number;
    dip?: number;
    soil?: string;
  }
> = ({ w = 3000, craterW = 1300, depth = 420, blockH = 1400, sun = [-1700, 120], shadowK = 1, ice = 0, peaks = 0, rays = 0, mass = 0, dip = 0, soil = "#8a8580", ...xf }) => {
  const frame = useCurrentFrame();
  const half = craterW / 2;
  const rimH = depth * 0.22;
  const rimW = craterW * 0.22;
  const bowl: [number, number][] = Array.from({ length: 25 }, (_, i) => {
    const u = -1 + (2 * i) / 24;
    const y = rimH * u ** 6 - (depth + dip) * (1 - u * u);
    return [Math.round(u * half), Math.round(y)] as [number, number];
  });
  const outerL: [number, number][] = Array.from({ length: 6 }, (_, i) => {
    const k = i / 5;
    return [Math.round(-half - rimW * k), Math.round(rimH * (1 - k) ** 2 * (1 + 2 * k))] as [number, number];
  }).reverse();
  const outerR: [number, number][] = outerL.map(([x, y]) => [-x, y] as [number, number]).reverse();
  const surface: [number, number][] = [[-w / 2, 0], ...outerL, ...bowl.slice(1, -1), ...outerR, [w / 2, 0]];
  const body = poly([...surface, [w / 2, -blockH], [-w / 2, -blockH]]);
  const band = poly([...surface, ...surface.map(([x, y]) => [x, y - 46] as [number, number]).reverse()]);

  // shadow in the bowl from the left rim top
  let shadowPoly: [number, number][] | null = null;
  if (sun && shadowK > 0) {
    const P: [number, number] = [-half, rimH];
    const dx = P[0] - sun[0];
    const dy = P[1] - sun[1];
    const slope = dy / dx; // y change per x moving right
    let hit = -1;
    for (let i = 1; i < bowl.length; i++) {
      const [x, y] = bowl[i];
      const ray = P[1] + slope * (x - P[0]);
      if (y >= ray) {
        hit = i;
        break;
      }
    }
    if (hit < 0) shadowPoly = [...bowl];
    else {
      const [x0, y0] = bowl[hit - 1];
      const [x1, y1] = bowl[hit];
      const r0 = P[1] + slope * (x0 - P[0]);
      const r1 = P[1] + slope * (x1 - P[0]);
      const t = (r0 - y0) / (y1 - y0 - (r1 - r0));
      const q: [number, number] = [Math.round(x0 + (x1 - x0) * t), Math.round(y0 + (y1 - y0) * t)];
      shadowPoly = [...bowl.slice(0, hit), q];
    }
  }
  const iceLayer = ice > 0 ? poly([...bowl.slice(7, 18), ...bowl.slice(7, 18).map(([x, y]) => [x * 0.98, y + 26 * Math.min(1, ice * 1.3)] as [number, number]).reverse()].map(([x, y]) => [Math.round(x), Math.round(y)] as [number, number])) : null;
  const surfY = (x: number) => (Math.abs(x) < half ? rimH * (x / half) ** 6 - (depth + dip) * (1 - (x / half) ** 2) : 0);
  const bottom = -(depth + dip) - 70;
  const rs = rng(23);
  const layerYs = [bottom, bottom - 150, bottom - 330, bottom - 560, bottom - 820].filter((y) => y > -blockH + 60);
  const strata: [number, number][][] = layerYs.map((y0, i) => {
    const y1 = i + 1 < layerYs.length ? layerYs[i + 1] : -blockH;
    const top = Array.from({ length: 13 }, (_, k) => [Math.round(-w / 2 + (k * w) / 12), Math.round(y0 + Math.sin(k * 1.3 + i * 2) * 16)] as [number, number]);
    return [...top, [Math.round(w / 2), Math.round(y1)], [Math.round(-w / 2), Math.round(y1)]];
  });
  const pebbles = Array.from({ length: 34 }, () => {
    const x = (rs() - 0.5) * (w - 120);
    const y = surfY(x) - 90 - rs() * (blockH - 200);
    return [Math.round(x), Math.round(Math.max(-blockH + 50, y)), Math.round(12 + rs() * 26), rs() * 6] as [number, number, number, number];
  });
  const speck = Array.from({ length: 40 }, () => {
    const x = (rs() - 0.5) * (w - 60);
    return [Math.round(x), Math.round(surfY(x) - 12 - rs() * 26)] as [number, number];
  });
  const topRocks = Array.from({ length: 6 }, (_, i) => {
    const sd = i % 2 ? 1 : -1;
    return [Math.round(sd * (half + rimW + 80 + rs() * (w / 2 - half - rimW - 200))), Math.round(18 + rs() * 30), Math.floor(rs() * 50)] as [number, number, number];
  });
  const ri = rng(11);
  const flakes = Array.from({ length: 9 }, () => [(-0.5 + ri()) * half * 0.8, ri() * 30, 9 + ri() * 8] as [number, number, number]);
  return (
    <X {...xf}>
      <Part shape={body} color={soil} flat outline={7} />
      <Part shape={band} color="#b8b3ab" flat outline={0} z={0.001} />
      {strata.map((pts, i) => (
        <Part key={`sb${i}`} shape={poly(pts)} color={STRATA[i % STRATA.length]} flat outline={0} z={0.0012 + i * 0.00001} />
      ))}
      {strata.map((pts, i) => (
        <Line key={`sl${i}`} pts={pts.slice(0, 13)} smooth width={5} color="#5e5a56" z={0.0013} />
      ))}
      {pebbles.map(([x, y, r, k], i) => (
        <Part key={`pb${i}`} shape={roundPoly(Array.from({ length: 6 }, (_, j) => [Math.round(Math.cos(j * 1.05 + k) * r), Math.round(Math.sin(j * 1.05 + k) * r * 0.75)] as [number, number]), Math.round(r * 0.35))} color={k > 3 ? "#a39e98" : "#6a6560"} flat outline={3} x={x} y={y} z={0.0014} />
      ))}
      {speck.map(([x, y], i) => (
        <Part key={`sk${i}`} shape={circle(4)} color="#8a857f" flat outline={0} x={x} y={y} z={0.0016} />
      ))}
      {topRocks.map(([x, sz, sd], i) => (
        <MoonRock key={`tr${i}`} size={sz} seed={sd} x={x} y={0} sunLeft={!sun || sun[0] < 0} shadowLen={2.5} z={0.0017} />
      ))}
      {shadowPoly ? <Part shape={poly(shadowPoly)} color={SHADOW} flat outline={0} opacity={0.92 * shadowK} z={0.002} /> : null}
      {iceLayer ? <Part shape={iceLayer} color={ICE} flat outline={4} opacity={Math.min(1, ice * 1.5)} z={0.003} /> : null}
      {ice > 0
        ? flakes.map(([x, dy, s], i) => {
            const by = rimH * (x / half) ** 6 - (depth + dip) * (1 - (x / half) ** 2);
            return (
              <X key={i} x={x} y={by + 30 + dy} rot={i * 0.5 + frame * 0.01} s={Math.min(1, ice * 1.4)} z={0.004}>
                <IceFlake size={s} />
              </X>
            );
          })
        : null}
      {sun ? (
        <X x={sun[0]} y={sun[1]} z={0.01}>
          <Glow rx={520} ry={360} color="#fff2c6" alpha={0.45} additive />
          <Part shape={circle(70)} color="#fff6c8" flat outline={6} z={0.001} />
        </X>
      ) : null}
      {sun && rays > 0
        ? [-30, 0, 30].map((o, i) => {
            const P: [number, number] = [-half, rimH + 8 + o * 0.4];
            const dx = P[0] - sun[0];
            const dy = P[1] - sun[1];
            const len = Math.hypot(dx, dy);
            const L = (len + craterW * 1.3) * Math.min(1, rays);
            const ux = dx / len;
            const uy = dy / len;
            return <Line key={i} pts={[[sun[0] + ux * 90, sun[1] + uy * 90 + o], [sun[0] + ux * L, sun[1] + uy * L + o]]} width={8} color="#ffd84a" opacity={0.8} z={0.009} />;
          })
        : null}
      {peaks > 0
        ? [-1, 1].map((sd) => <Glow key={sd} rx={260} ry={150} color="#ffe27a" alpha={0.6 * peaks * (0.85 + 0.15 * Math.sin(frame * 0.12 + sd))} additive x={sd * half} y={rimH + 30} z={0.012} />)
        : null}
      {mass > 0 ? (
        <X y={-depth - dip - 300} z={0.005}>
          <Glow rx={420} ry={260} color="#ff9a3a" alpha={0.45 * mass} additive />
          <MetalLump w={520 * (0.5 + 0.5 * Math.min(1, mass))} h={260 * (0.5 + 0.5 * Math.min(1, mass))} z={0.001} />
        </X>
      ) : null}
    </X>
  );
};

/** Six-armed ice flake. */
export const IceFlake: React.FC<XProps & { size?: number; color?: string }> = ({ size = 20, color = ICE, ...xf }) => (
  <X {...xf}>
    {[0, 1, 2].map((i) => (
      <Part key={i} shape={roundRect(size * 2, size * 0.42, size * 0.2)} color={color} flat outline={3} rot={(i * Math.PI) / 3} z={i * 0.0001} />
    ))}
    <Part shape={circle(size * 0.35)} color="#e8fbff" flat outline={0} z={0.001} />
  </X>
);

/** Heavy metal mass (iron-nickel lump) with a steel sheen. Origin = centre. */
export const MetalLump: React.FC<XProps & { w?: number; h?: number; color?: string }> = ({ w = 500, h = 260, color = "#8e8f98", ...xf }) => (
  <X {...xf}>
    <Part
      shape={blob([[-w / 2, 0], [-w * 0.38, h * 0.38], [-w * 0.1, h / 2], [w * 0.22, h * 0.44], [w / 2, h * 0.08], [w * 0.36, -h * 0.4], [0, -h / 2], [-w * 0.32, -h * 0.4]].map(([x, y]) => [Math.round(x), Math.round(y)] as [number, number]), 8)}
      color={color}
      shade={0.35}
    />
    <Part shape={ellipse(w * 0.16, h * 0.08)} color="#e6e8ee" flat outline={0} x={-w * 0.12} y={h * 0.22} rot={0.2} opacity={0.85} z={0.001} />
    <Part shape={ellipse(w * 0.07, h * 0.04)} color="#e6e8ee" flat outline={0} x={w * 0.18} y={h * 0.18} opacity={0.7} z={0.001} />
  </X>
);

/** Lumpy space rock with craters. Origin = centre. */
export const SpaceRock: React.FC<XProps & { size?: number; seed?: number; color?: string }> = ({ size = 200, seed = 2, color = "#8a7a6a", ...xf }) => {
  const r = rng(seed);
  const pts: [number, number][] = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2;
    const d = size * (0.8 + r() * 0.35);
    return [Math.round(Math.cos(a) * d), Math.round(Math.sin(a) * d * 0.86)];
  });
  const pits = Array.from({ length: 5 }, () => [(r() - 0.5) * size, (r() - 0.5) * size * 0.8, size * (0.08 + r() * 0.12)] as [number, number, number]);
  return (
    <X {...xf}>
      <Part shape={blob(pts, 8)} color={color} shade={0.4}>
        {pits.map(([x, y, s], i) => (
          <X key={i} x={x} y={y} z={0.001}>
            <Part shape={circle(s)} color="#6a5c50" flat outline={3} />
            <Part shape={circle(s * 0.7)} color="#5a4e44" flat outline={0} x={s * 0.15} y={-s * 0.12} z={0.001} />
          </X>
        ))}
      </Part>
    </X>
  );
};

/** Comet: icy nucleus, bright coma and a long tail pointing away along +x (rotate with `rot`). */
export const Comet: React.FC<XProps & { size?: number; tail?: number; seed?: number }> = ({ size = 90, tail = 900, seed = 4, ...xf }) => {
  const frame = useCurrentFrame();
  const r = rng(seed);
  const streams = Array.from({ length: 5 }, (_, i) => [(-0.5 + i / 4) * size * 1.2, 0.6 + r() * 0.4] as [number, number]);
  return (
    <X {...xf}>
      <Glow rx={size * 3} color="#bfe8ff" alpha={0.5} additive />
      {streams.map(([o, k], i) => (
        <Line key={i} pts={[[size * 0.4, o * 0.3], [tail * 0.5 * k, o * 0.9 + Math.sin(frame * 0.05 + i) * 10], [tail * k, o * 1.6]]} smooth width={size * 0.35} color={i % 2 ? "#cfefff" : "#9ad8ff"} opacity={0.55} z={-0.001} />
      ))}
      <Part shape={blob([[-size, 0], [-size * 0.5, size * 0.7], [size * 0.4, size * 0.6], [size, 0], [size * 0.5, -size * 0.7], [-size * 0.6, -size * 0.6]], 8)} color="#7a8088" shade={0.35} z={0.001} />
      <Part shape={ellipse(size * 0.3, size * 0.16)} color="#eaf6ff" flat outline={0} x={-size * 0.2} y={size * 0.25} z={0.002} />
    </X>
  );
};

/** Water molecule: red O with two white H at 104.5°. Origin = O centre. */
export const WaterMolecule: React.FC<XProps & { size?: number }> = ({ size = 40, ...xf }) => (
  <X {...xf}>
    {[-1, 1].map((sd) => (
      <Part key={sd} shape={circle(size * 0.58)} color="#f4f6fa" shade={0.3} x={Math.sin(sd * 0.912) * size * 1.15} y={-Math.cos(0.912) * size * 1.15} z={-0.001} />
    ))}
    <Part shape={circle(size)} color="#e2453a" shade={0.3} />
    <Part shape={ellipse(size * 0.3, size * 0.18)} color="#ff9a8a" flat outline={0} x={-size * 0.32} y={size * 0.35} rot={0.4} z={0.001} />
  </X>
);

/** Snow-capped mountain (Everest) silhouette. Origin = base centre. */
export const SnowPeak: React.FC<XProps & { h?: number; w?: number }> = ({ h = 880, w = 1100, ...xf }) => (
  <X {...xf}>
    <Part shape={roundPoly([[-w / 2, 0], [-w * 0.12, h * 0.7], [0, h], [w * 0.1, h * 0.82], [w / 2, 0]], 16)} color="#7a6f86" shade={0.35} />
    <Part shape={roundPoly([[-w * 0.08, h * 0.76], [0, h * 0.995], [w * 0.09, h * 0.84], [w * 0.05, h * 0.74], [0, h * 0.8], [-w * 0.04, h * 0.72]], 8)} color="#f6f5f8" flat outline={5} z={0.001} />
  </X>
);

/** Typhoon seen from above: spiral cloud arms around a clear eye, turning with the frame. */
export const Typhoon: React.FC<XProps & { size?: number; spin?: number }> = ({ size = 400, spin = 1, ...xf }) => {
  const frame = useCurrentFrame();
  const arms = [0, 1, 2].map((a) =>
    Array.from({ length: 26 }, (_, i) => {
      const k = i / 25;
      const ang = a * ((Math.PI * 2) / 3) + k * 4.2 - frame * 0.03 * spin;
      const d = size * (0.2 + k * 0.85);
      return [Math.round(Math.cos(ang) * d), Math.round(Math.sin(ang) * d), Math.round(size * (0.26 - k * 0.15))] as [number, number, number];
    }),
  );
  return (
    <X {...xf}>
      {arms.flat().map(([x, y, r], i) => (
        <Part key={`o${i}`} shape={circle(r)} color="#f4f8fb" flat outline={5} x={x} y={y} z={i * 0.00001} />
      ))}
      {arms.flat().map(([x, y, r], i) => (
        <Part key={`f${i}`} shape={circle(r)} color="#f4f8fb" flat outline={0} x={x} y={y} z={0.01 + i * 0.00001} />
      ))}
      <Part shape={circle(size * 0.1)} color="#5a8ab8" flat outline={4} z={0.02} />
    </X>
  );
};
