// Builds src/kit/env/geo/europe.json for EuropeMap from world-atlas (run from a scratch dir with world-atlas, topojson-client and polygon-clipping installed):
//   node scripts/europe-geo.mjs src/kit/env/geo/europe.json
// Natural Earth (world-atlas) → Europe geo for the kit's EuropeMap.
// countries: name → rings [lon, lat] clipped to the box (1:50m, simplified);
// islands: close-up 1:10m outlines of Corsica, Elba and Saint Helena.
import fs from "node:fs";
import { feature } from "topojson-client";
import pc from "polygon-clipping";

const BOX = [-32, 8, 78, 74]; // lon0, lat0, lon1, lat1
const box = [[[BOX[0], BOX[1]], [BOX[2], BOX[1]], [BOX[2], BOX[3]], [BOX[0], BOX[3]], [BOX[0], BOX[1]]]];

const dp = (pts, tol) => {
  if (pts.length < 4) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    let best = -1, bi = -1;
    const [ax, ay] = pts[a], [bx, by] = pts[b];
    const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1e-9;
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs((pts[i][0] - ax) * dy - (pts[i][1] - ay) * dx) / L;
      if (d > best) { best = d; bi = i; }
    }
    if (best > tol) { keep[bi] = 1; stack.push([a, bi], [bi, b]); }
  }
  return pts.filter((_, i) => keep[i]);
};
const r3 = (v) => Math.round(v * 1000) / 1000;
const simp = (ring, tol) => {
  const mid = ring.length >> 1;
  return [...dp(ring.slice(0, mid + 1), tol).slice(0, -1), ...dp(ring.slice(mid), tol)].map(([x, y]) => [r3(x), r3(y)]);
};
const area = (ring) => { let a = 0; for (let i = 0; i < ring.length - 1; i++) a += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1]; return Math.abs(a / 2); };

const topo = JSON.parse(fs.readFileSync("node_modules/world-atlas/countries-50m.json"));
const fc = feature(topo, topo.objects.countries);
const countries = {};
let npts = 0;
for (const f of fc.features) {
  if (!f.geometry || f.properties.name === "Greenland") continue;
  const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
  let clipped;
  try { clipped = pc.intersection(polys, box); } catch (e) { continue; }
  const rings = [];
  for (const p of clipped) {
    const ring = p[0];
    if (area(ring) < 0.02) continue; // drop specks (< ~150 km²)
    const s = simp(ring.slice(0, -1), 0.025);
    if (s.length >= 4) { rings.push(s); npts += s.length; }
  }
  if (rings.length) countries[f.properties.name] = (countries[f.properties.name] || []).concat(rings);
}
// close-up islands from 1:10m land
const land = feature(JSON.parse(fs.readFileSync("node_modules/world-atlas/land-10m.json")), JSON.parse(fs.readFileSync("node_modules/world-atlas/land-10m.json")).objects.land);
const want = { corsica: [9.1, 42.1], elba: [10.25, 42.78], helena: [-5.71, -15.96], sardinia: [9.0, 40.1] };
const islands = {};
for (const f of land.features) {
  const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
  for (const p of polys) {
    const ring = p[0];
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (const [x, y] of ring) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    for (const [k, [lx, ly]] of Object.entries(want)) {
      if (lx > x0 && lx < x1 && ly > y0 && ly < y1 && (x1 - x0) < 6) islands[k] = simp(ring.slice(0, -1), k === "helena" || k === "elba" ? 0.002 : 0.006);
    }
  }
}
fs.writeFileSync(process.argv[2], JSON.stringify({ box: BOX, countries, islands }));
console.log(Object.keys(countries).length, "countries,", npts, "pts; islands", Object.fromEntries(Object.entries(islands).map(([k, v]) => [k, v.length])));
console.log(Object.keys(countries).join(", "));
