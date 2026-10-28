import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

// Shape specs describe a closed outline in local units (1 unit = 1 px, y up).
// They are turned into cached geometry: a fill (ShapeGeometry) plus an outline
// ring (stroke geometry). Every spec has a stable `key` so geometry is shared.

export type ShapeSpec = {
  key: string;
  build: () => { shapes: THREE.Shape[]; contours: THREE.Vector2[][] };
};

const fromPoints = (key: string, pts: THREE.Vector2[]): ShapeSpec => ({
  key,
  build: () => ({ shapes: [new THREE.Shape(pts)], contours: [pts] }),
});

const SEG = 72;

export const circle = (r: number): ShapeSpec => ellipse(r, r);

export const ellipse = (rx: number, ry: number): ShapeSpec => {
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i < SEG; i++) {
    const a = (i / SEG) * Math.PI * 2;
    pts.push(new THREE.Vector2(Math.cos(a) * rx, Math.sin(a) * ry));
  }
  return fromPoints(`ell:${rx}:${ry}`, pts);
};

/** Rounded rectangle centered on the origin. */
export const roundRect = (w: number, h: number, r: number): ShapeSpec => {
  const rr = Math.min(r, w / 2, h / 2);
  const pts: THREE.Vector2[] = [];
  const corner = (cx: number, cy: number, a0: number) => {
    for (let i = 0; i <= 8; i++) {
      const a = a0 + (i / 8) * (Math.PI / 2);
      pts.push(new THREE.Vector2(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr));
    }
  };
  corner(w / 2 - rr, h / 2 - rr, 0);
  corner(-w / 2 + rr, h / 2 - rr, Math.PI / 2);
  corner(-w / 2 + rr, -h / 2 + rr, Math.PI);
  corner(w / 2 - rr, -h / 2 + rr, (3 * Math.PI) / 2);
  return fromPoints(`rr:${w}:${h}:${r}`, pts);
};

/**
 * A limb hanging from the origin (the joint) down the -y axis.
 * Width tapers from w1 at the joint to w2 at the end; ends are round.
 */
export const limb = (len: number, w1: number, w2 = w1): ShapeSpec => {
  const r1 = w1 / 2;
  const r2 = w2 / 2;
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 12; i++) {
    const a = (i / 12) * Math.PI;
    pts.push(new THREE.Vector2(Math.cos(a) * r1, Math.sin(a) * r1 * 0.6));
  }
  for (let i = 0; i <= 12; i++) {
    const a = Math.PI + (i / 12) * Math.PI;
    pts.push(new THREE.Vector2(Math.cos(a) * r2, -len + Math.sin(a) * r2 * 0.8));
  }
  return fromPoints(`limb:${len}:${w1}:${w2}`, pts);
};

/** Closed polygon from [x, y] pairs. */
export const poly = (points: [number, number][]): ShapeSpec =>
  fromPoints(
    `poly:${points.map((p) => p.join(",")).join(";")}`,
    points.map(([x, y]) => new THREE.Vector2(x, y)),
  );

/** Smooth closed curve (Catmull-Rom) through [x, y] control points. */
export const blob = (points: [number, number][], samples = 10): ShapeSpec =>
  fromPoints(`blob:${samples}:${points.map((p) => p.join(",")).join(";")}`, smoothClosed(points, samples));

export const smoothClosed = (points: [number, number][], samples = 10) => {
  const n = points.length;
  const out: THREE.Vector2[] = [];
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];
    for (let s = 0; s < samples; s++) {
      const t = s / samples;
      out.push(catmull(p0, p1, p2, p3, t));
    }
  }
  return out;
};

export const smoothOpen = (points: [number, number][], samples = 10) => {
  const n = points.length;
  if (n < 3) return points.map(([x, y]) => new THREE.Vector2(x, y));
  const out: THREE.Vector2[] = [];
  for (let i = 0; i < n - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(n - 1, i + 2)];
    for (let s = 0; s < samples; s++) out.push(catmull(p0, p1, p2, p3, s / samples));
  }
  out.push(new THREE.Vector2(...points[n - 1]));
  return out;
};

const catmull = (
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  p3: [number, number],
  t: number,
) => {
  const t2 = t * t;
  const t3 = t2 * t;
  const f = (a: number, b: number, c: number, d: number) =>
    0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
  return new THREE.Vector2(f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1]));
};

/**
 * SVG path data. Written in SVG convention (y down) and flipped to y up,
 * so you can sketch in any vector tool and paste the `d` attribute.
 */
export const path = (d: string): ShapeSpec => ({
  key: `path:${d}`,
  build: () => {
    const data = new SVGLoader().parse(
      `<svg xmlns="http://www.w3.org/2000/svg"><path d="${d}"/></svg>`,
    );
    const shapes: THREE.Shape[] = [];
    const contours: THREE.Vector2[][] = [];
    for (const p of data.paths) {
      for (const s of SVGLoader.createShapes(p)) {
        const flip = (v: THREE.Vector2) => new THREE.Vector2(v.x, -v.y);
        const outer = s.getPoints(12).map(flip);
        const shape = new THREE.Shape(outer);
        for (const h of s.holes) {
          const hp = h.getPoints(12).map(flip);
          shape.holes.push(new THREE.Path(hp));
          contours.push(hp);
        }
        shapes.push(shape);
        contours.push(outer);
      }
    }
    return { shapes, contours };
  },
});

// ---------------------------------------------------------------------------
// Geometry cache

export type BuiltGeo = {
  geometry: THREE.BufferGeometry;
  fillCount: number;
  outlineStart: number;
  outlineCount: number;
  size: number;
};

const cache = new Map<string, BuiltGeo>();

const strokeStyle = (w: number, cap = "round") =>
  SVGLoader.getStrokeStyle(w, "#000", "round", cap, 4);

const closeLoop = (pts: THREE.Vector2[]) => {
  const c = pts.slice();
  if (!c[0].equals(c[c.length - 1])) c.push(c[0].clone());
  return c;
};

const toIndexed = (g: THREE.BufferGeometry) => {
  if (g.index) return g;
  const n = g.getAttribute("position").count;
  g.setIndex(Array.from({ length: n }, (_, i) => i));
  return g;
};

/** Fill + outline in one indexed geometry (outline indices after fill). */
export const buildGeo = (spec: ShapeSpec, line: number): BuiltGeo => {
  const key = `${spec.key}|${line}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const { shapes, contours } = spec.build();
  const fill = toIndexed(new THREE.ShapeGeometry(shapes, 12));
  const strokes = line > 0
    ? contours.map((c) => toIndexed(SVGLoader.pointsToStroke(closeLoop(c), strokeStyle(line), 8, 0.05)))
    : [];
  const positions: number[] = [];
  const indices: number[] = [];
  const append = (g: THREE.BufferGeometry) => {
    const base = positions.length / 3;
    const pos = g.getAttribute("position");
    for (let i = 0; i < pos.count; i++) positions.push(pos.getX(i), pos.getY(i), 0);
    const idx = g.index!;
    for (let i = 0; i < idx.count; i++) indices.push(idx.getX(i) + base);
  };
  append(fill);
  const fillCount = indices.length;
  strokes.forEach(append);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  const bb = new THREE.Box3();
  fill.computeBoundingBox();
  bb.copy(fill.boundingBox!);
  const size = Math.max(1, Math.min(bb.max.x - bb.min.x, bb.max.y - bb.min.y));
  const built = { geometry, fillCount, outlineStart: fillCount, outlineCount: indices.length - fillCount, size };
  cache.set(key, built);
  return built;
};

/** Open stroke (a drawn line) through points, round caps. */
export const buildLine = (pts: THREE.Vector2[], width: number, key: string) => {
  const k = `line:${key}|${width}`;
  const hit = cache.get(k);
  if (hit) return hit.geometry;
  const geometry = SVGLoader.pointsToStroke(pts, strokeStyle(width), 8, 0.05);
  geometry.computeBoundingSphere();
  cache.set(k, { geometry, fillCount: 0, outlineStart: 0, outlineCount: 0, size: width });
  return geometry;
};

/** Polygon with rounded corners (radius per corner or one for all). */
export const roundPoly = (points: [number, number][], r: number | number[]): ShapeSpec => ({
  key: `rpoly:${JSON.stringify(points)}:${JSON.stringify(r)}`,
  build: () => {
    const pts = roundCorners(points, r);
    return { shapes: [new THREE.Shape(pts)], contours: [pts] };
  },
});

export const roundCorners = (points: [number, number][], r: number | number[]) => {
  const n = points.length;
  const out: THREE.Vector2[] = [];
  for (let i = 0; i < n; i++) {
    const prev = new THREE.Vector2(...points[(i - 1 + n) % n]);
    const cur = new THREE.Vector2(...points[i]);
    const next = new THREE.Vector2(...points[(i + 1) % n]);
    const rad = Array.isArray(r) ? r[i] ?? 0 : r;
    const d1 = prev.clone().sub(cur);
    const d2 = next.clone().sub(cur);
    const rr = Math.min(rad, d1.length() / 2, d2.length() / 2);
    if (rr <= 0.01) {
      out.push(cur);
      continue;
    }
    const a = cur.clone().add(d1.normalize().multiplyScalar(rr));
    const b = cur.clone().add(d2.normalize().multiplyScalar(rr));
    for (let s = 0; s <= 6; s++) {
      const t = s / 6;
      const u = 1 - t;
      out.push(
        new THREE.Vector2(
          u * u * a.x + 2 * u * t * cur.x + t * t * b.x,
          u * u * a.y + 2 * u * t * cur.y + t * t * b.y,
        ),
      );
    }
  }
  return out;
};
