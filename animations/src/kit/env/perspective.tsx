import React from "react";
import { useCurrentFrame } from "remotion";
import { Part, Line } from "../Part";
import { X, type XProps } from "../context";
import { Glow, Gradient } from "../effects";
import { circle, ellipse, poly, roundRect } from "../shapes";
import { shadeHex } from "../style";
import { rng } from "../random";
import { Clock } from "./interior";

// One-point-perspective interiors (reference look: a back wall facing the
// camera, side walls, ceiling light panels and a tiled floor running toward
// the viewer), plus wall dressing: framed posters, clocks, gauge panels, code
// screens, windows on the side walls and a foreground control console.

const ri = (v: number) => Math.round(v);
type P2 = [number, number];
const ring = (rx: number, ry: number, rot = 0, n = 40): P2[] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const x = Math.cos(a) * rx;
    const y = Math.sin(a) * ry;
    return [ri(x * Math.cos(rot) - y * Math.sin(rot)), ri(x * Math.sin(rot) + y * Math.cos(rot))] as P2;
  });

export type RoomGeo = { bw: number; floor: number; ceil: number; vy: number };

/** Point on a room plane. side: "left"/"right" wall at depth t (1 = back wall corner) and height h (back-wall y); "floor"/"ceil" at lateral u (back-wall x) and depth t. */
export const roomPt = (g: RoomGeo, plane: "left" | "right" | "floor" | "ceil", t: number, v: number): P2 => {
  if (plane === "left" || plane === "right") {
    const sx = plane === "left" ? -1 : 1;
    return [ri(sx * (g.bw / 2) * t), ri(g.vy + t * (v - g.vy))];
  }
  const y0 = plane === "floor" ? g.floor : g.ceil;
  return [ri(v * t), ri(g.vy + t * (y0 - g.vy))];
};

/** Quad on a room plane spanning depth t0..t1 and v0..v1 (height for walls, lateral x for floor/ceiling). */
export const roomQuad = (g: RoomGeo, plane: "left" | "right" | "floor" | "ceil", t0: number, t1: number, v0: number, v1: number): P2[] => [
  roomPt(g, plane, t0, v0),
  roomPt(g, plane, t1, v0),
  roomPt(g, plane, t1, v1),
  roomPt(g, plane, t0, v1),
];

export type RoomColors = { wall: string; wallLow: string; band?: string; side: string; ceiling: string; floor: string; tile: string; light: string };

export const ROOM_LAB: RoomColors = { wall: "#e2e6ee", wallLow: "#cfd6e2", band: "#5a6c8e", side: "#6a7a9a", ceiling: "#c6ccd8", floor: "#e6eaf0", tile: "#b6bccb", light: "#ffffff" };
export const ROOM_MISSION: RoomColors = { wall: "#24345a", wallLow: "#1a2644", side: "#1c2846", ceiling: "#2e3c5e", floor: "#3a4660", tile: "#2a3450", light: "#dff0ff" };

/**
 * Perspective room shell. Back wall bw wide between y=floor and y=ceil, the
 * vanishing point at (0, vy); walls, ceiling and floor run out to ±3200.
 * Ceiling light panels (`lights` rows), floor tiles, baseboards. Draws at
 * z −41…−39.5; dress the walls at z ≥ −39.4.
 */
export const PerspectiveRoom: React.FC<{ geo: RoomGeo; colors?: RoomColors; lights?: number; tiles?: boolean; children?: React.ReactNode }> = ({ geo, colors = ROOM_LAB, lights = 2, tiles = true, children }) => {
  const frame = useCurrentFrame();
  const g = geo;
  const T = 3200 / (g.bw / 2);
  const bl: P2 = [-g.bw / 2, g.floor];
  const br: P2 = [g.bw / 2, g.floor];
  const tl: P2 = [-g.bw / 2, g.ceil];
  const tr: P2 = [g.bw / 2, g.ceil];
  const far = (p: P2): P2 => [ri(p[0] * T), ri(g.vy + T * (p[1] - g.vy))];
  const C = colors;
  const tileXs = Array.from({ length: 13 }, (_, i) => -g.bw / 2 + (g.bw * i) / 12);
  const tileTs = [1.18, 1.42, 1.75, 2.2, 2.85, 3.8, 5.2];
  return (
    <>
      {/* back wall */}
      <X x={0} y={(g.floor + g.ceil) / 2} z={-41}>
        <Gradient w={g.bw} h={g.ceil - g.floor} stops={[[0, C.wall], [1, C.wallLow]]} />
      </X>
      {C.band ? <Part shape={roundRect(g.bw, 26, 0)} color={C.band} flat outline={0} y={g.floor + 150} z={-40.99} /> : null}
      {/* side walls, ceiling, floor */}
      <Part shape={poly([bl, tl, far(tl), far(bl)])} color={C.side} flat outline={6} z={-40.9} />
      <Part shape={poly([br, far(br), far(tr), tr])} color={C.side} flat outline={6} z={-40.9} />
      <Part shape={poly([tl, tr, far(tr), far(tl)])} color={C.ceiling} flat outline={6} z={-40.8} />
      <Part shape={poly([bl, far(bl), far(br), br])} color={C.floor} flat outline={6} z={-40.8} />
      {/* wall shading toward the viewer */}
      {(["left", "right"] as const).map((sd) => (
        <Part key={sd} shape={poly(roomQuad(g, sd, 2.2, T, g.floor, g.ceil))} color="#000000" flat outline={0} opacity={0.12} z={-40.85} />
      ))}
      {/* baseboards */}
      {(["left", "right"] as const).map((sd) => (
        <Part key={`bb${sd}`} shape={poly(roomQuad(g, sd, 1, T, g.floor, g.floor + 60))} color={shadeHex(C.side, 0.35)} flat outline={0} z={-40.7} />
      ))}
      <Part shape={roundRect(g.bw, 60, 0)} color={shadeHex(C.wallLow, 0.3)} flat outline={0} y={g.floor + 30} z={-40.7} />
      {/* floor tiles */}
      {tiles ? (
        <>
          {tileXs.map((u, i) => (
            <Line key={`tx${i}`} pts={[roomPt(g, "floor", 1, u), roomPt(g, "floor", T, u)]} width={4} color={C.tile} z={-40.75} />
          ))}
          {tileTs.map((t, i) => (
            <Line key={`ty${i}`} pts={[roomPt(g, "floor", t, -g.bw * 2), roomPt(g, "floor", t, g.bw * 2)]} width={4} color={C.tile} z={-40.75} />
          ))}
          <Part shape={poly(roomQuad(g, "floor", 1.25, 2.4, -g.bw * 0.22, g.bw * 0.22))} color="#ffffff" flat outline={0} opacity={0.18} z={-40.74} />
        </>
      ) : null}
      {/* ceiling light panels */}
      {Array.from({ length: lights }, (_, row) =>
        [-1, 1].map((sd) => {
          const t0 = 1.15 + row * 0.75;
          const q = roomQuad(g, "ceil", t0, t0 + 0.45, sd * g.bw * 0.08, sd * g.bw * 0.3);
          const cx = (q[0][0] + q[2][0]) / 2;
          const cy = (q[0][1] + q[2][1]) / 2;
          return (
            <React.Fragment key={`l${row}${sd}`}>
              <Part shape={poly(q)} color={C.light} flat outline={5} z={-40.6} />
              <Glow rx={Math.abs(q[1][0] - q[0][0]) * 0.9 + 200} ry={160} x={cx} y={cy - 80} color="#eaf4ff" alpha={0.22 * (0.95 + 0.05 * Math.sin(frame * 0.2 + row))} additive z={-40.55} />
            </React.Fragment>
          );
        }),
      )}
      {children}
    </>
  );
};

/** Framed poster: rocket launch, Moon, blueprint, Earth or a chart. Origin = centre. */
export const FramedPoster: React.FC<XProps & { w?: number; h?: number; kind?: "rocket" | "moon" | "blueprint" | "earth" | "chart" | "mission"; frame?: string }> = ({ w = 420, h = 300, kind = "rocket", frame: fc = "#2a2c36", ...xf }) => {
  const iw = w - 36;
  const ih = h - 36;
  return (
    <X {...xf}>
      <Part shape={roundRect(w, h, 6)} color={fc} flat outline={6} />
      {kind === "blueprint" ? (
        <X z={0.001}>
          <Part shape={roundRect(iw, ih, 2)} color="#2a68c8" flat outline={0} />
          {Array.from({ length: 6 }, (_, i) => (
            <Line key={`g${i}`} pts={[[-iw / 2 + 8, -ih / 2 + ((i + 1) * ih) / 7], [iw / 2 - 8, -ih / 2 + ((i + 1) * ih) / 7]]} width={1.5} color="#8ab8ff" opacity={0.5} z={0.001} />
          ))}
          <Part shape={circle(ri(ih * 0.28))} color="#2a68c8" flat outline={4} outlineColor="#e8f2ff" x={ri(-iw * 0.12)} z={0.002} />
          <X x={ri(-iw * 0.12)} z={0.0021}>
            <Line pts={ring(iw * 0.36, ih * 0.18, 0.3)} width={3} color="#e8f2ff" />
          </X>
          <Line pts={[[ri(-iw * 0.45), ri(-ih * 0.05)], [ri(iw * 0.2), ri(ih * 0.25)]]} width={3} color="#e8f2ff" z={0.003} />
          <Part shape={roundRect(ri(iw * 0.18), ri(ih * 0.4), 4)} color="#2a68c8" flat outline={3} outlineColor="#e8f2ff" x={ri(iw * 0.32)} y={ri(-ih * 0.1)} z={0.003} />
        </X>
      ) : kind === "chart" ? (
        <X z={0.001}>
          <Part shape={roundRect(iw, ih, 2)} color="#f4f6fa" flat outline={0} />
          {[0.3, 0.55, 0.42, 0.75, 0.62].map((k, i) => (
            <Part key={i} shape={roundRect(ri(iw * 0.12), ri(ih * 0.8 * k), 2)} color={i % 2 ? "#3a8adf" : "#4ad28a"} flat outline={3} x={ri(-iw * 0.36 + i * iw * 0.18)} y={ri(-ih * 0.42 + (ih * 0.8 * k) / 2)} z={0.001} />
          ))}
        </X>
      ) : (
        <X z={0.001}>
          <Gradient w={iw} h={ih} stops={kind === "earth" ? [[0, "#0e1438"], [1, "#24306a"]] : [[0, "#14123a"], [1, "#3a2a7a"]]} />
          {kind === "rocket" ? (
            <>
              <Part shape={circle(ri(ih * 0.3))} color="#cdd0d8" shade={0.3} x={ri(iw * 0.22)} y={ri(ih * 0.12)} z={0.001} />
              <Part shape={circle(ri(ih * 0.05))} color="#9aa0aa" flat outline={2} x={ri(iw * 0.18)} y={ri(ih * 0.2)} z={0.002} />
              <X x={ri(-iw * 0.14)} y={ri(-ih * 0.02)} rot={-0.35} s={ih / 300} z={0.003}>
                <Part shape={ellipse(16, 40)} color="#ffb04a" flat outline={3} y={-92} />
                <Part shape={ellipse(8, 22)} color="#fff2c6" flat outline={0} y={-84} z={0.001} />
                <Part shape={poly([[-22, -50], [-44, -84], [-22, -72]])} color="#e0503a" flat outline={3} z={0.002} />
                <Part shape={poly([[22, -50], [44, -84], [22, -72]])} color="#e0503a" flat outline={3} z={0.002} />
                <Part shape={roundRect(46, 150, 12)} color="#f2f2f4" shade={0.3} y={0} z={0.003} />
                <Part shape={poly([[-23, 70], [23, 70], [0, 118]])} color="#e0503a" flat outline={3} z={0.004} />
                <Part shape={circle(12)} color="#6ab8ff" flat outline={3} y={22} z={0.005} />
                <Part shape={roundRect(46, 10, 2)} color="#e0503a" flat outline={0} y={-40} z={0.005} />
              </X>
              <Part shape={ellipse(ri(iw * 0.5), ri(ih * 0.16))} color="#4a8a5a" flat outline={0} y={ri(-ih * 0.5)} z={0.0005} />
            </>
          ) : kind === "moon" || kind === "mission" ? (
            <>
              <Part shape={circle(ri(ih * 0.34))} color="#d8d6dc" shade={0.3} z={0.001} />
              {[[-0.1, 0.08, 0.07], [0.12, -0.1, 0.05], [0.05, 0.15, 0.04]].map(([a, b, c], i) => (
                <Part key={i} shape={circle(ri(ih * c))} color="#aeb0b8" flat outline={2} x={ri(ih * a)} y={ri(ih * b)} z={0.002} />
              ))}
              <Line pts={ring(iw * 0.4, ih * 0.12, -0.25)} width={3} color="#ffd84a" z={0.003} />
              {kind === "mission" ? <Part shape={roundRect(ri(ih * 0.12), ri(ih * 0.1), 2)} color="#f6c232" flat outline={2} x={ri(iw * 0.33)} y={ri(ih * 0.07)} z={0.004} /> : null}
            </>
          ) : (
            <>
              <Part shape={circle(ri(ih * 0.34))} color="#2f7fd0" shade={0.3} z={0.001} />
              <Part shape={ellipse(ri(ih * 0.14), ri(ih * 0.2))} color="#5fa84a" flat outline={2} x={ri(-ih * 0.08)} y={ri(ih * 0.02)} rot={0.3} z={0.002} />
              <Part shape={ellipse(ri(ih * 0.1), ri(ih * 0.08))} color="#6ab04a" flat outline={2} x={ri(ih * 0.14)} y={ri(ih * 0.12)} z={0.002} />
            </>
          )}
          {Array.from({ length: 10 }, (_, i) => {
            const r = rng(i + 3);
            return <Part key={`st${i}`} shape={circle(2)} color="#ffffff" flat outline={0} x={ri((r() - 0.5) * iw * 0.9)} y={ri((r() - 0.5) * ih * 0.9)} z={0.0008} />;
          })}
        </X>
      )}
      <Part shape={poly([[ri(-iw / 2), ri(ih / 2)], [ri(-iw / 2 + iw * 0.3), ri(ih / 2)], [ri(-iw / 2), ri(ih / 2 - ih * 0.5)]])} color="#ffffff" flat outline={0} opacity={0.12} z={0.01} />
    </X>
  );
};

/** Row of wall clocks. Origin = centre of the row. */
export const ClockRow: React.FC<XProps & { n?: number; gap?: number; r?: number }> = ({ n = 3, gap = 220, r = 80, ...xf }) => (
  <X {...xf}>
    {Array.from({ length: n }, (_, i) => (
      <Clock key={i} r={r} speed={1 + i * 0.4} x={(i - (n - 1) / 2) * gap} />
    ))}
  </X>
);

/** Wall panel with round gauges, a lever and indicator lights. Origin = centre. */
export const GaugePanel: React.FC<XProps & { w?: number; h?: number; color?: string }> = ({ w = 300, h = 420, color = "#5a6070", ...xf }) => {
  const frame = useCurrentFrame();
  return (
    <X {...xf}>
      <Part shape={roundRect(w, h, 10)} color={color} shade={0.2} />
      {[[-0.22, 0.28], [0.22, 0.28], [0, -0.02]].map(([a, b], i) => (
        <X key={i} x={ri(a * w)} y={ri(b * h)} z={0.002}>
          <Part shape={circle(ri(w * 0.15))} color="#f2f2f4" flat outline={5} />
          <Line pts={[[0, 0], [ri(Math.cos(1.2 + Math.sin(frame * 0.05 + i) * 0.6) * w * 0.11), ri(Math.sin(1.2 + Math.sin(frame * 0.05 + i) * 0.6) * w * 0.11)]]} width={4} color="#d9473a" z={0.001} />
          <Part shape={circle(5)} color="#2a2a30" flat outline={0} z={0.002} />
        </X>
      ))}
      <Part shape={roundRect(ri(w * 0.5), ri(h * 0.16), 6)} color="#3a3e48" flat outline={4} y={ri(-h * 0.3)} z={0.002} />
      <Part shape={poly([[-10, ri(-h * 0.3)], [10, ri(-h * 0.3)], [6, ri(-h * 0.22)], [-6, ri(-h * 0.22)]])} color="#d9473a" flat outline={3} y={-6} z={0.003} />
      {[0, 1, 2].map((i) => (
        <Part key={`l${i}`} shape={circle(9)} color={["#4ad28a", "#ffd84a", "#ff5a4a"][i]} flat outline={3} x={ri(-w * 0.3 + i * 22)} y={ri(-h * 0.42)} opacity={0.5 + 0.5 * Math.round((Math.sin(frame * 0.2 + i * 2) + 1) / 2)} z={0.003} />
      ))}
    </X>
  );
};

/** Monitor face with scrolling green code columns. Origin = centre. */
export const CodeScreen: React.FC<XProps & { w?: number; h?: number; seed?: number }> = ({ w = 300, h = 220, seed = 1, ...xf }) => {
  const frame = useCurrentFrame();
  const r = rng(seed);
  const cols = Math.floor((w - 30) / 26);
  const rows = Math.floor((h - 30) / 26);
  const off = Math.floor(frame / 4);
  return (
    <X {...xf}>
      <Part shape={roundRect(w, h, 8)} color="#2a2c34" flat outline={6} />
      <Part shape={roundRect(w - 24, h - 24, 4)} color="#0c1a14" flat outline={0} z={0.001} />
      {Array.from({ length: cols * rows }, (_, i) => {
        const c = i % cols;
        const rr = Math.floor(i / cols);
        const v = (r() + (off * 0.37 + c * 0.13) % 1) % 1;
        if (v < 0.35) return null;
        return v > 0.7 ? (
          <Part key={i} shape={roundRect(6, 16, 2)} color="#5aff9a" flat outline={0} x={ri(-w / 2 + 26 + c * 26)} y={ri(h / 2 - 26 - rr * 26)} opacity={0.85} z={0.002} />
        ) : (
          <Part key={i} shape={ellipse(6, 8)} color="#5aff9a" flat outline={0} x={ri(-w / 2 + 26 + c * 26)} y={ri(h / 2 - 26 - rr * 26)} opacity={0.6} z={0.002} />
        );
      })}
      <Glow rx={w * 0.6} ry={h * 0.6} color="#5aff9a" alpha={0.08} additive z={0.003} />
    </X>
  );
};

/** Window set into a side wall (perspective quad) with a night sky and the Moon. */
export const SideWindow: React.FC<{ geo: RoomGeo; side: "left" | "right"; t0: number; t1: number; h0: number; h1: number; moon?: boolean; day?: boolean; z?: number }> = ({ geo, side, t0, t1, h0, h1, moon = true, day = false, z = -39.3 }) => {
  const q = roomQuad(geo, side, t0, t1, h0, h1);
  const mid = (a: P2, b: P2): P2 => [ri((a[0] + b[0]) / 2), ri((a[1] + b[1]) / 2)];
  const inset = (k: number): P2[] => {
    const c: P2 = [(q[0][0] + q[1][0] + q[2][0] + q[3][0]) / 4, (q[0][1] + q[1][1] + q[2][1] + q[3][1]) / 4];
    return q.map(([x, y]) => [ri(c[0] + (x - c[0]) * k), ri(c[1] + (y - c[1]) * k)] as P2);
  };
  const g = inset(0.86);
  const c: P2 = [(g[0][0] + g[2][0]) / 2, (g[0][1] + g[2][1]) / 2];
  const span = Math.abs(g[1][0] - g[0][0]);
  return (
    <X z={z}>
      <Part shape={poly(q)} color="#e8ecf2" flat outline={6} />
      <Part shape={poly(g)} color={day ? "#8ad0f0" : "#1c2250"} flat outline={4} z={0.001} />
      {!day ? <Part shape={poly([g[0], g[1], mid(g[1], g[2]), mid(g[0], g[3])])} color="#3a3a7a" flat outline={0} opacity={0.6} z={0.0015} /> : null}
      {moon && !day ? (
        <>
          <Glow rx={span * 0.3} color="#ffffff" alpha={0.45} additive x={c[0]} y={c[1] + 30} z={0.002} />
          <Part shape={circle(ri(span * 0.13))} color="#f4f4f8" flat outline={0} x={c[0]} y={c[1] + 30} z={0.003} />
        </>
      ) : null}
      {[0.33, 0.66].map((k) => (
        <Line key={k} pts={[[ri(g[0][0] + (g[1][0] - g[0][0]) * k), ri(g[0][1] + (g[1][1] - g[0][1]) * k)], [ri(g[3][0] + (g[2][0] - g[3][0]) * k), ri(g[3][1] + (g[2][1] - g[3][1]) * k)]]} width={8} color="#e8ecf2" z={0.004} />
      ))}
      <Line pts={[mid(g[0], g[3]), mid(g[1], g[2])]} width={8} color="#e8ecf2" z={0.004} />
      <Part shape={poly([g[0], [ri(g[0][0] + (g[1][0] - g[0][0]) * 0.25), ri(g[0][1] + (g[1][1] - g[0][1]) * 0.25)], [ri(g[3][0] + (g[2][0] - g[3][0]) * 0.1), ri(g[3][1] + (g[2][1] - g[3][1]) * 0.1)], g[3]])} color="#ffffff" flat outline={0} opacity={0.12} z={0.005} />
    </X>
  );
};

/**
 * Foreground control console (reference look): a long desk edge seen from
 * behind/above, with button clusters, small gauges, sliders, a red light strip
 * and small screens. Origin = top edge centre; it hangs down from there.
 */
export const ControlConsoleFront: React.FC<XProps & { w?: number; h?: number; color?: string; seed?: number }> = ({ w = 2400, h = 260, color = "#4a5268", seed = 2, ...xf }) => {
  const frame = useCurrentFrame();
  const r = rng(seed);
  const n = Math.floor(w / 300);
  return (
    <X {...xf}>
      <Part shape={roundRect(w, h, 16)} color={color} shade={0.2} y={-h / 2} />
      <Part shape={roundRect(w + 30, 34, 12)} color={shadeHex(color, -0.25)} flat outline={5} y={-8} z={0.001} />
      {Array.from({ length: n }, (_, i) => {
        const x = -w / 2 + 150 + i * 300;
        const kind = i % 4;
        return (
          <X key={i} x={x} y={-h * 0.48} z={0.002}>
            {kind === 0 ? (
              <>
                <Part shape={roundRect(220, 120, 10)} color="#3a4050" flat outline={5} />
                {Array.from({ length: 8 }, (_, k) => (
                  <Part key={k} shape={roundRect(34, 24, 5)} color={["#ff5a4a", "#4ad28a", "#ffd84a", "#4ab0ff"][(k + i) % 4]} flat outline={3} x={-75 + (k % 4) * 50} y={k < 4 ? 24 : -18} opacity={0.6 + 0.4 * Math.round((Math.sin(frame * 0.15 + k * 1.7 + i) + 1) / 2)} z={0.001} />
                ))}
              </>
            ) : kind === 1 ? (
              <>
                <Part shape={roundRect(230, 130, 10)} color="#3a4050" flat outline={5} />
                {[-60, 0, 60].map((gx, k) => (
                  <X key={k} x={gx} y={6} z={0.001}>
                    <Part shape={circle(26)} color="#f2f2f4" flat outline={4} />
                    <Line pts={[[0, 0], [ri(Math.cos(1 + Math.sin(frame * 0.07 + k + i) * 0.7) * 18), ri(Math.sin(1 + Math.sin(frame * 0.07 + k + i) * 0.7) * 18)]]} width={3} color="#d9473a" z={0.001} />
                  </X>
                ))}
              </>
            ) : kind === 2 ? (
              <>
                <Part shape={roundRect(230, 130, 10)} color="#2a2e38" flat outline={5} />
                <Part shape={roundRect(200, 100, 6)} color="#12324a" flat outline={0} z={0.001} />
                <Line pts={Array.from({ length: 12 }, (_, k) => [-90 + k * 16, ri(Math.sin(k * 0.9 + frame * 0.2) * 26)] as P2)} width={4} color="#4ad2ff" z={0.002} />
              </>
            ) : (
              <>
                <Part shape={roundRect(220, 120, 10)} color="#3a4050" flat outline={5} />
                {[-60, -20, 20, 60].map((sx, k) => (
                  <React.Fragment key={k}>
                    <Line pts={[[sx, -40], [sx, 40]]} width={6} color="#22252e" z={0.001} />
                    <Part shape={roundRect(26, 14, 4)} color="#d6d8de" flat outline={3} x={sx} y={ri(-30 + ((r() * 60 + frame * (0.3 + k * 0.1)) % 60))} z={0.002} />
                  </React.Fragment>
                ))}
              </>
            )}
          </X>
        );
      })}
      {Array.from({ length: Math.floor(w / 90) }, (_, i) => (
        <Part key={`rs${i}`} shape={roundRect(60, 16, 4)} color="#ff4a3a" flat outline={0} x={-w / 2 + 60 + i * 90} y={-h * 0.9} opacity={0.55 + 0.45 * Math.round((Math.sin(frame * 0.12 + i * 0.6) + 1) / 2)} z={0.002} />
      ))}
    </X>
  );
};
