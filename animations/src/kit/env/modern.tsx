import React from "react";
import { useCurrentFrame } from "remotion";
import { Part, Line } from "../Part";
import { X, type XProps } from "../context";
import { Glow, Gradient } from "../effects";
import { blob, circle, ellipse, poly, roundPoly, roundRect } from "../shapes";
import { palette, shadeHex, mixHex } from "../style";
import { rng } from "../random";
import { Flame, Smoke } from "./fire";

/** Cartoon car (side view) facing +x. Origin = ground center. Wheels spin with `speed`. */
export const Car: React.FC<XProps & { color?: string; speed?: number; driver?: boolean }> = ({ color = "#c0362c", speed = 1, driver = true, ...xf }) => {
  const frame = useCurrentFrame();
  return (
    <X {...xf}>
      <Part shape={roundPoly([[-260, 50], [270, 50], [280, 140], [140, 160], [80, 250], [-140, 250], [-210, 160], [-270, 150]], [20, 20, 30, 20, 30, 30, 20, 20])} color={color} shade={0.2} />
      <Part shape={roundPoly([[-120, 165], [-10, 165], [-10, 232], [-110, 232]], 10)} color="#bfe6ff" flat z={0.001} />
      <Part shape={roundPoly([[10, 165], [120, 165], [70, 232], [10, 232]], 10)} color="#bfe6ff" flat z={0.001} />
      {driver ? <Part shape={circle(36)} color="#f6f5f8" shade={0.24} x={50} y={198} z={0.0005} /> : null}
      <Part shape={roundRect(30, 12, 5)} color="#fff3b0" flat outline={4} x={262} y={110} z={0.002} />
      {[-160, 170].map((x) => (
        <X key={x} x={x} y={52} rot={-frame * 0.5 * speed} z={0.003}>
          <Part shape={circle(52)} color="#2a2a32" shade={0.2} />
          <Part shape={circle(22)} color="#b8b8c0" flat outline={4} z={0.001} />
          <Line pts={[[-18, 0], [18, 0]]} width={5} z={0.002} />
        </X>
      ))}
    </X>
  );
};

/** Highway strip with moving lane marks. Origin = road center line; extends h below/above. */
export const Road: React.FC<XProps & { w?: number; h?: number; speed?: number }> = ({ w = 4000, h = 260, speed = 30, ...xf }) => {
  const frame = useCurrentFrame();
  const off = (frame * speed) % 300;
  return (
    <X {...xf}>
      <Part shape={roundRect(w, h, 0)} color="#5a5a64" flat />
      <Line pts={[[-w / 2, h / 2], [w / 2, h / 2]]} width={8} z={0.001} />
      <Line pts={[[-w / 2, -h / 2], [w / 2, -h / 2]]} width={8} z={0.001} />
      {Array.from({ length: Math.ceil(w / 300) + 1 }, (_, i) => {
        const x = -w / 2 + i * 300 - off;
        return <Part key={i} shape={roundRect(140, 16, 6)} color="#f3e9c8" flat outline={0} x={x} z={0.002} />;
      })}
    </X>
  );
};

/** Horizontal speed lines (wind). */
export const SpeedLines: React.FC<XProps & { w?: number; h?: number; n?: number; speed?: number; color?: string; seed?: number }> = ({
  w = 2200,
  h = 900,
  n = 14,
  speed = 60,
  color = "#ffffff",
  seed = 3,
  ...xf
}) => {
  const frame = useCurrentFrame();
  const r = rng(seed);
  const items = Array.from({ length: n }, () => [r() * w, (r() - 0.5) * h, 120 + r() * 260, 0.25 + r() * 0.5]);
  return (
    <X {...xf}>
      {items.map(([x0, y, len, a], i) => {
        const x = w / 2 - ((x0 + frame * speed) % (w + len));
        return <Line key={i} pts={[[x, y], [x + len, y]]} width={6} color={color} opacity={a} />;
      })}
    </X>
  );
};

/** Candle with a flame that bends with `wind` (0..1); `out` 0..1 shrinks it. Origin = bottom. */
export const Candle: React.FC<XProps & { wind?: number; out?: number; seed?: number }> = ({ wind = 0, out = 0, seed = 1, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(60, 180, 12)} color="#f4ead2" shade={0.2} y={90} />
    <Line pts={[[0, 180], [0, 200]]} width={5} />
    {out < 1 ? (
      <X y={200} rot={-wind * 1.2} sx={1 + wind * 0.3} sy={(1 - wind * 0.4) * (1 - out)} z={0.01}>
        <Glow rx={120} color="#ffd27a" alpha={0.4 * (1 - out)} y={30} additive z={-0.01} />
        <Flame size={0.3} seed={seed} />
      </X>
    ) : null}
  </X>
);

/** Matchstick with a small flame. Origin = bottom of the stick. */
export const Match: React.FC<XProps & { lit?: boolean }> = ({ lit = true, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(16, 180, 6)} color="#e2c38a" shade={0.2} y={90} />
    <Part shape={ellipse(14, 20)} color="#c0362c" shade={0.25} y={186} z={0.001} />
    {lit ? <Flame size={0.2} y={190} z={0.002} /> : null}
  </X>
);

/** Thick log lying on its side. Origin = ground center. `mark` 0..1 adds a black scorch. */
export const Log: React.FC<XProps & { w?: number; r?: number; mark?: number }> = ({ w = 600, r = 90, mark = 0, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(w, r * 2, r)} color="#8a5a32" shade={0.25} y={r} />
    {[0.3, 0.55].map((k, i) => (
      <Line key={i} pts={[[-w * 0.4, r * (0.6 + i * 0.6)], [w * (0.1 + k * 0.4), r * (0.55 + i * 0.6)]]} width={4} color="#5a3a26" z={0.001} />
    ))}
    <Part shape={ellipse(r * 0.55, r * 0.95)} color="#d9b47a" shade={0.15} x={w / 2 - r * 0.45} y={r} z={0.002}>
      <Part shape={ellipse(r * 0.3, r * 0.55)} color="#c49a5a" flat outline={4} z={0.001} />
    </Part>
    {mark > 0 ? <Part shape={ellipse(60 * mark, 34 * mark)} color="#2a2020" flat outline={0} opacity={0.85} x={-40} y={r * 1.3} z={0.003} /> : null}
  </X>
);

/** Kindling: dry grass and small sticks. Origin = ground center. `burn` 0..1. */
export const Kindling: React.FC<XProps & { burn?: number }> = ({ burn = 0, ...xf }) => (
  <X {...xf}>
    {[-0.6, -0.3, 0, 0.3, 0.6].map((k, i) => (
      <Line key={i} pts={[[k * 100, 0], [k * 60, 120 - Math.abs(k) * 40]]} width={9} color={i % 2 ? "#8a5a32" : "#a5764a"} />
    ))}
    <Part shape={blob([[-120, 0], [120, 0], [80, 50], [0, 70], [-80, 50]], 6)} color={mixHex("#e0c06a", "#3a2a22", burn * 0.5)} shade={0.25} z={0.01} />
    {burn > 0 ? <Flame size={0.75 * burn} y={10} z={0.02} /> : null}
    {burn > 0 ? <Glow rx={300 * burn} color="#ff9a3c" alpha={0.4} y={80} additive z={-0.01} /> : null}
  </X>
);

/** Rain streaks over an area (frame-driven). */
export const Rain: React.FC<XProps & { w?: number; h?: number; n?: number; seed?: number; color?: string }> = ({
  w = 2200,
  h = 1400,
  n = 90,
  seed = 7,
  color = "#cfe2f6",
  ...xf
}) => {
  const frame = useCurrentFrame();
  const r = rng(seed);
  const drops = Array.from({ length: n }, () => [r() * w - w / 2, r() * h, 40 + r() * 40]);
  return (
    <X {...xf}>
      {drops.map(([x, y0, len], i) => {
        const y = h / 2 - ((y0 + frame * 38) % h);
        return <Line key={i} pts={[[x, y], [x - 12, y - len]]} width={4} color={color} opacity={0.6} />;
      })}
    </X>
  );
};

/** Modern space rocket. Origin = base center. `thrust` 0..1 shows flame + smoke. */
export const Rocket: React.FC<XProps & { h?: number; thrust?: number; seed?: number }> = ({ h = 900, thrust = 0, seed = 2, ...xf }) => {
  const w = h * 0.16;
  return (
    <X {...xf}>
      {thrust > 0 ? (
        <>
          <Smoke y={-40} w={w * 2.5} h={-600} alpha={0.6 * thrust} seed={seed} z={-0.05} />
          <X y={10} sy={-1} z={-0.02}>
            <Flame size={(w / 120) * 1.4 * thrust} seed={seed} />
          </X>
          <Glow rx={w * 3} color="#ffb04a" alpha={0.5 * thrust} y={-60} additive z={-0.03} />
        </>
      ) : null}
      {[-1, 1].map((k) => (
        <Part key={k} shape={poly([[k * w * 0.5, 30], [k * w * 0.95, -10], [k * w * 0.95, 60], [k * w * 0.5, h * 0.22]])} color="#c0362c" shade={0.2} />
      ))}
      <Part shape={roundRect(w, h * 0.8, w * 0.2)} color="#f4f1ea" shade={0.24} y={h * 0.4} z={0.01}>
        <Part shape={roundRect(w, h * 0.06, 2)} color="#c0362c" flat outline={4} y={h * 0.1} z={0.001} />
        <Part shape={circle(w * 0.18)} color="#2f5f9a" flat outline={4} y={h * 0.25} z={0.001} />
      </Part>
      <Part shape={blob([[-w / 2, h * 0.78], [w / 2, h * 0.78], [w * 0.3, h * 0.92], [0, h], [-w * 0.3, h * 0.92]], 6)} color="#c0362c" shade={0.25} z={0.02} />
    </X>
  );
};

/** Planet Earth (for space shots). */
export const Earth: React.FC<XProps & { r?: number }> = ({ r = 600, ...xf }) => (
  <X {...xf}>
    <Glow rx={r * 1.25} color="#7fbfff" alpha={0.3} additive />
    <Part shape={circle(r)} color="#2f7fd0" shade={0.28} light={{ dir: [-0.8, 0.6] }}>
      <Part shape={blob([[-r * 0.5, r * 0.2], [-r * 0.1, r * 0.5], [r * 0.2, r * 0.3], [0, -r * 0.1], [-r * 0.35, -r * 0.2]], 6)} color="#5fae4a" flat outline={5} z={0.001} />
      <Part shape={blob([[r * 0.3, -r * 0.3], [r * 0.6, -r * 0.1], [r * 0.65, -r * 0.45], [r * 0.4, -r * 0.6]], 6)} color="#5fae4a" flat outline={5} z={0.001} />
    </Part>
  </X>
);

/** Movie theater: dark room, glowing screen (children render inside the screen
 *  area — keep them within ±screenW/2 × ±screenH/2), seat rows and audience. */
export const Theater: React.FC<{ screenW?: number; screenH?: number; screenY?: number; audience?: number; children?: React.ReactNode }> = ({
  screenW = 1300,
  screenH = 560,
  screenY = 180,
  audience = 7,
  children,
}) => {
  const frame = useCurrentFrame();
  const r = rng(4);
  return (
    <>
      <Gradient w={4000} h={3000} stops={[[0, "#120c18"], [1, "#2a1a24"]]} z={-30} />
      <Glow y={screenY} rx={screenW * 0.9} ry={screenH * 0.9} color="#8fb8ff" alpha={0.2} additive z={-29} />
      <X y={screenY} z={-28}>
        <Part shape={roundRect(screenW + 70, screenH + 70, 10)} color="#2a1e24" flat />
        {[-1, 1].map((k) => (
          <Part key={k} shape={roundPoly([[k * screenW * 0.5, screenH * 0.6], [k * screenW * 0.72, screenH * 0.6], [k * screenW * 0.68, -screenH * 0.75], [k * screenW * 0.52, -screenH * 0.75]], 8)} color="#8a1e2a" shade={0.3} z={0.01} />
        ))}
      </X>
      <X y={screenY} z={-27}>
        {children}
      </X>
      {Array.from({ length: audience }, (_, i) => {
        const x = -900 + (i / (audience - 1)) * 1800 + (r() - 0.5) * 60;
        const bob = Math.sin(frame * 0.05 + i) * 2;
        return (
          <X key={i} x={x} y={-540 + bob} z={1 + i * 0.001}>
            <Part shape={roundRect(250, 300, 40)} color="#1d1420" flat outline={0} y={60} />
            <Part shape={circle(78)} color="#251c2a" flat outline={0} y={260} />
          </X>
        );
      })}
    </>
  );
};

/** Popcorn bucket. Origin = bottom center. */
export const Popcorn: React.FC<XProps> = (xf) => (
  <X {...xf}>
    <Part shape={roundPoly([[-50, 0], [50, 0], [64, 130], [-64, 130]], 6)} color="#f4f1ea" shade={0.2} y={0}>
      {[-30, 0, 30].map((x) => (
        <Part key={x} shape={poly([[x - 8, 4], [x + 8, 4], [x + 11, 126], [x - 11, 126]])} color="#c0362c" flat outline={0} z={0.001} />
      ))}
    </Part>
    {[-40, -14, 12, 38, -26, 0, 26].map((x, i) => (
      <Part key={i} shape={circle(18)} color="#fff3c9" shade={0.25} x={x} y={i < 4 ? 140 : 162} z={0.01 + i * 0.001} />
    ))}
  </X>
);



/** Siamese cat sitting (Knorozov's Asya): cream body, dark points, blue eyes. Facing +x; origin = ground centre. */
export const Cat: React.FC<XProps & { color?: string; points?: string; look?: number }> = ({ color = "#efe2c8", points = "#4a3428", look = 0, ...xf }) => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame * 0.07) * 0.25;
  return (
    <X {...xf}>
      <X x={-70} y={20} rot={sway} z={-0.002}>
        <Line pts={[[0, 0], [-60, 20], [-90, 80], [-70, 140]]} smooth width={26} color={points} />
      </X>
      <Part shape={blob([[-90, 10], [-100, 90], [-60, 170], [0, 200], [50, 160], [70, 80], [60, 10]], 10)} color={color} shade={0.24} />
      {[[-20, 0], [40, 0]].map(([x, y], i) => (
        <Part key={i} shape={ellipse(26, 16)} color={points} shade={0.2} x={x} y={y + 10} z={0.002} />
      ))}
      <X x={20 + look * 10} y={230} z={0.004}>
        <Part shape={poly([[-62, 20], [-56, 96], [-16, 44]])} color={points} shade={0.2} z={-0.001} />
        <Part shape={poly([[62, 20], [56, 96], [16, 44]])} color={points} shade={0.2} z={-0.001} />
        <Part shape={blob([[-70, 0], [-60, 50], [0, 72], [60, 50], [70, 0], [40, -50], [0, -60], [-40, -50]], 10)} color={color} shade={0.22} />
        <Part shape={blob([[-30, 10], [30, 10], [24, -34], [0, -50], [-24, -34]], 8)} color={points} flat outline={0} opacity={0.75} z={0.001} />
        {[-24, 24].map((x) => (
          <X key={x} x={x + look * 8} y={10} z={0.002}>
            <Part shape={ellipse(13, 15)} color="#6ab0e0" flat outline={3} />
            <Part shape={ellipse(4, 11)} color="#211b20" flat outline={0} z={0.001} />
          </X>
        ))}
        <Part shape={poly([[-8, -16], [8, -16], [0, -26]])} color="#d88a8a" flat outline={2} z={0.003} />
        {[-1, 1].map((k) => (
          <Line key={k} pts={[[k * 20, -24], [k * 80, -14]]} width={2.5} color="#211b20" opacity={0.6} z={0.003} />
        ))}
      </X>
    </X>
  );
};

/** Open laptop, front view. Children draw on the screen (screen centre = origin of children). Origin = base centre. */
export const Laptop: React.FC<XProps & { w?: number; glow?: number; children?: React.ReactNode }> = ({ w = 620, glow = 0.6, children, ...xf }) => {
  const h = w * 0.62;
  return (
    <X {...xf}>
      <Part shape={poly([[-w * 0.6, 0], [w * 0.6, 0], [w * 0.52, 40], [-w * 0.52, 40]])} color="#a8acb4" shade={0.22} />
      <Part shape={roundRect(w * 0.3, 10, 4)} color="#7a7e88" flat outline={0} y={10} z={0.001} />
      <X y={40 + h / 2} z={0.002}>
        <Part shape={roundRect(w, h, 18)} color="#3a3e48" shade={0.18} />
        <Part shape={roundRect(w - 40, h - 44, 6)} color="#e8eef4" flat outline={3} y={4} z={0.001} />
        {glow > 0 ? <Glow rx={w * 0.9} ry={h * 0.8} color="#cfe6ff" alpha={0.25 * glow} additive z={-0.01} /> : null}
        <X y={4} z={0.002}>{children}</X>
      </X>
    </X>
  );
};

/** DNA double helix, vertical, turning with the frame. Origin = centre. */
export const DnaHelix: React.FC<XProps & { h?: number; r?: number; turns?: number; colors?: [string, string] }> = ({ h = 700, r = 90, turns = 2.5, colors = ["#3a9ac9", "#fe5649"], ...xf }) => {
  const frame = useCurrentFrame();
  const ph = frame * 0.06;
  const n = 60;
  const strand = (off: number) => Array.from({ length: n + 1 }, (_, i) => [Math.sin((i / n) * turns * 6.283 + ph + off) * r, -h / 2 + (i / n) * h] as [number, number]);
  const rungs = Array.from({ length: Math.round(turns * 8) }, (_, k) => {
    const q = (k + 0.5) / Math.round(turns * 8);
    const a = q * turns * 6.283 + ph;
    return { y: -h / 2 + q * h, x1: Math.sin(a) * r, x2: Math.sin(a + Math.PI) * r, front: Math.cos(a) };
  });
  return (
    <X {...xf}>
      {rungs.map((g, k) => (
        <Line key={k} pts={[[g.x1, g.y], [g.x2, g.y]]} width={8} color={["#f2c84a", "#3fa07a"][k % 2]} z={0.0005} />
      ))}
      <Line pts={strand(0)} smooth width={16} color={colors[0]} z={0.001} />
      <Line pts={strand(Math.PI)} smooth width={16} color={colors[1]} z={0.0012} />
    </X>
  );
};
