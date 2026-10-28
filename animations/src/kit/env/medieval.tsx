import React from "react";
import { useCurrentFrame } from "remotion";
import { Part, Line } from "../Part";
import { X, type XProps } from "../context";
import { Glow } from "../effects";
import { blob, circle, ellipse, poly, roundPoly, roundRect } from "../shapes";
import { palette, shadeHex, mixHex } from "../style";
import { rng, noise1 } from "../random";
import { Flame, FireLine, Smoke } from "./fire";

const STONE = "#9c958e";

/** Stone parapet with merlons, seen from the front. Origin = bottom center; top of merlons at y = h. */
export const Battlement: React.FC<XProps & { w?: number; h?: number; color?: string; merlon?: number; seed?: number }> = ({
  w = 1800,
  h = 300,
  color = STONE,
  merlon = 130,
  seed = 2,
  ...xf
}) => {
  const r = rng(seed);
  const n = Math.ceil(w / (merlon * 2));
  const wallH = h - 90;
  return (
    <X {...xf}>
      <Part shape={roundRect(w, wallH, 4)} color={color} shade={0.12} y={wallH / 2} />
      {Array.from({ length: n }, (_, i) => (
        <Part key={i} shape={roundRect(merlon, 100, 6)} color={mixHex(color, "#ffffff", r() * 0.08)} shade={0.25} x={-w / 2 + merlon / 2 + i * merlon * 2} y={wallH + 40} z={0.001} />
      ))}
      {Array.from({ length: Math.round((w * wallH) / 26000) }, (_, i) => {
        const x = -w / 2 + r() * w;
        const y = 20 + r() * (wallH - 40);
        return <Part key={`b${i}`} shape={roundRect(70 + r() * 50, 34, 6)} color={shadeHex(color, 0.08 + r() * 0.08)} flat outline={3.5} x={x} y={y} z={0.0005} />;
      })}
    </X>
  );
};

/** Round tower with crenellations. Origin = bottom center. */
export const Tower: React.FC<XProps & { w?: number; h?: number; color?: string; window?: boolean }> = ({ w = 260, h = 700, color = STONE, window: win = true, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(w, h, 8)} color={color} shade={0.22} y={h / 2} />
    {[-1, 0, 1].map((k) => (
      <Part key={k} shape={roundRect(w * 0.26, 70, 4)} color={color} shade={0.25} x={k * w * 0.37} y={h + 30} z={0.001} />
    ))}
    <Part shape={roundRect(w + 24, 28, 6)} color={shadeHex(color, 0.08)} y={h - 4} z={0.002} />
    {win ? <Part shape={roundRect(30, 80, 15)} color="#1d1519" flat y={h * 0.62} z={0.003} /> : null}
  </X>
);

/** Distant castle silhouette (walls + towers). Origin = ground center. */
export const CastleFar: React.FC<XProps & { w?: number; color?: string }> = ({ w = 900, color = "#6e6a78", ...xf }) => (
  <X {...xf}>
    <Battlement w={w} h={260} color={color} merlon={60} seed={7} />
    <Tower x={-w / 2} w={180} h={420} color={shadeHex(color, -0.05)} z={0.01} />
    <Tower x={w / 2} w={180} h={420} color={shadeHex(color, -0.05)} z={0.01} />
    <Tower x={0} w={220} h={560} color={shadeHex(color, -0.08)} z={0.02} />
  </X>
);

/** Night army: rows of dark silhouettes with torches, marching (frame-driven). */
export const TorchArmy: React.FC<XProps & { w?: number; rows?: number; n?: number; speed?: number; seed?: number }> = ({
  w = 2400,
  rows = 3,
  n = 18,
  speed = 0.6,
  seed = 3,
  ...xf
}) => {
  const frame = useCurrentFrame();
  const r = rng(seed);
  const items = Array.from({ length: rows * n }, (_, i) => ({ row: Math.floor(i / n), x: -w / 2 + (i % n) * (w / n) + r() * 40, torch: r() > 0.6, ph: r() * 6 }));
  return (
    <X {...xf}>
      {items.map((it, i) => {
        const s = 0.6 + it.row * 0.2;
        const y = -it.row * 70;
        const bob = Math.abs(Math.sin(frame * 0.25 + it.ph)) * 4;
        return (
          <X key={i} x={it.x + frame * speed * s} y={y + bob} s={s} z={it.row * 0.1 + i * 0.0001}>
            <Part shape={roundPoly([[-26, 0], [26, 0], [20, 70], [-20, 70]], 10)} color="#1c1a26" flat outline={4} />
            <Part shape={circle(22)} color="#1c1a26" flat outline={4} y={92} />
            <Line pts={[[18, 40], [36, 120]]} width={6} color="#3a2e2a" />
            {it.torch ? (
              <X x={36} y={124}>
                <Glow rx={120} color="#ff9a3c" alpha={0.35} additive z={-0.01} />
                <Flame size={0.22} seed={i} />
              </X>
            ) : null}
          </X>
        );
      })}
    </X>
  );
};

/** Iron pot of glowing coals with a bail handle. Origin = pot bottom. */
export const CoalPot: React.FC<XProps & { glow?: number; seed?: number }> = ({ glow = 1, seed = 2, ...xf }) => {
  const frame = useCurrentFrame();
  const flick = 1 + noise1(frame / 3, seed) * 0.15;
  return (
    <X {...xf}>
      <Glow rx={260 * flick} color="#ff7a2a" alpha={0.45 * glow} y={70} additive z={-0.05} />
      <Line pts={[[-70, 60], [-40, 150], [40, 150], [70, 60]]} smooth width={7} color="#3a3a42" />
      <Part shape={blob([[-80, 70], [80, 70], [60, 10], [0, 0], [-60, 10]], 6)} color="#3d3a44" shade={0.3} z={0.01} />
      {[-40, -12, 18, 44, -24, 6, 32].map((x, i) => (
        <Part
          key={i}
          shape={circle(14 + (i % 3) * 3)}
          color={mixHex("#ff4a1a", "#ffd06a", 0.5 + 0.5 * Math.sin(frame * 0.3 + i))}
          flat
          outline={3}
          x={x}
          y={i < 4 ? 70 : 82}
          z={0.02 + i * 0.001}
        />
      ))}
      <Flame size={0.18} y={84} x={-10} seed={seed} z={0.03} />
    </X>
  );
};

/** Straw-roofed hut. Origin = ground center. `burn` adds fire on the roof. */
export const StrawHut: React.FC<XProps & { w?: number; burn?: number; seed?: number }> = ({ w = 360, burn = 0, seed = 4, ...xf }) => {
  const h = w * 0.55;
  const straw = mixHex("#e0b85a", "#3a2a22", burn * 0.4);
  return (
    <X {...xf}>
      <Part shape={roundRect(w, h, 6)} color="#c9a274" shade={0.2} y={h / 2} />
      <Part shape={roundRect(w * 0.22, h * 0.6, 6)} color="#5a3a26" flat x={-w * 0.15} y={h * 0.3} z={0.001} />
      <Part shape={roundPoly([[-w * 0.62, h - 10], [w * 0.62, h - 10], [w * 0.12, h + w * 0.42], [-w * 0.12, h + w * 0.42]], [6, 6, 16, 16])} color={straw} shade={0.2} z={0.002}>
        {Array.from({ length: 7 }, (_, i) => {
          const x = -w * 0.5 + (i / 6) * w;
          return <Line key={i} pts={[[x, h + 4], [x * 0.25, h + w * 0.38]]} width={3.5} color={shadeHex(straw, 0.3)} z={0.001} />;
        })}
      </Part>
      {burn > 0 ? (
        <>
          <FireLine w={w * 1.0} y={h + w * 0.2} intensity={burn * 1.2} seed={seed} z={0.05} />
          <Smoke y={h + w * 0.42} w={w * 0.4} h={1100} alpha={0.55 * burn} seed={seed + 1} z={0.06} />
        </>
      ) : null}
    </X>
  );
};

/** Haystack. Origin = ground center. */
export const HayStack: React.FC<XProps & { w?: number; burn?: number; seed?: number }> = ({ w = 300, burn = 0, seed = 6, ...xf }) => {
  const c = mixHex("#e8c35a", "#3a2a22", burn * 0.4);
  return (
    <X {...xf}>
      <Part shape={blob([[-w / 2, 0], [w / 2, 0], [w * 0.42, w * 0.35], [w * 0.2, w * 0.62], [0, w * 0.7], [-w * 0.2, w * 0.62], [-w * 0.42, w * 0.35]], 8)} color={c} shade={0.24}>
        {Array.from({ length: 6 }, (_, i) => (
          <Line key={i} pts={[[-w * 0.35 + i * w * 0.14, 10], [-w * 0.25 + i * w * 0.1, w * 0.45]]} width={3.5} color={shadeHex(c, 0.3)} z={0.001} />
        ))}
      </Part>
      {burn > 0 ? <FireLine w={w * 0.8} y={w * 0.3} intensity={burn} seed={seed} z={0.05} /> : null}
    </X>
  );
};

/** Medieval town rooftops (row of houses with straw/tiled roofs). Origin = ground center. */
export const Town: React.FC<XProps & { w?: number; seed?: number; burn?: number }> = ({ w = 1800, seed = 5, burn = 0, ...xf }) => {
  const r = rng(seed);
  const n = Math.round(w / 260);
  return (
    <X {...xf}>
      {Array.from({ length: n }, (_, i) => {
        const x = -w / 2 + (i + 0.5) * (w / n) + (r() - 0.5) * 40;
        const s = 0.7 + r() * 0.4;
        const lit = burn > 0 && r() > 0.45;
        return <StrawHut key={i} x={x} s={s} w={300} burn={lit ? burn : 0} seed={i + seed} z={i * 0.01} />;
      })}
    </X>
  );
};

/** Animal hide (draped). Origin = top center. */
export const Hide: React.FC<XProps & { w?: number; h?: number; color?: string; seed?: number }> = ({ w = 160, h = 200, color = "#8a5a3a", seed = 2, ...xf }) => {
  const r = rng(seed);
  return (
    <X {...xf}>
      <Part
        shape={blob([[-w / 2, 0], [w / 2, 0], [w * 0.55, -h * 0.4], [w * 0.4, -h * 0.75], [w * 0.15, -h], [-w * 0.1, -h * 0.85], [-w * 0.45, -h * 0.95], [-w * 0.55, -h * 0.5]], 6)}
        color={color}
        shade={0.25}
      >
        {Array.from({ length: 4 }, (_, i) => (
          <Part key={i} shape={ellipse(14 + r() * 10, 8 + r() * 6)} color={shadeHex(color, -0.15)} flat outline={0} x={(r() - 0.5) * w * 0.6} y={-h * (0.2 + r() * 0.6)} z={0.001} />
        ))}
      </Part>
    </X>
  );
};

/** Wheeled siege tower. Origin = ground center. */
export const SiegeTower: React.FC<XProps & { h?: number; hides?: boolean; burn?: number }> = ({ h = 700, hides = false, burn = 0, ...xf }) => {
  const w = h * 0.42;
  const wood = mixHex("#a5764a", "#2e2420", burn * 0.6);
  return (
    <X {...xf}>
      <Part shape={roundPoly([[-w / 2, 40], [w / 2, 40], [w * 0.42, h], [-w * 0.42, h]], 6)} color={wood} shade={0.2} />
      {Array.from({ length: 7 }, (_, i) => (
        <Line key={i} pts={[[-w * 0.48, 60 + i * (h / 7.5)], [w * 0.48, 60 + i * (h / 7.5)]]} width={4} color={shadeHex(wood, 0.35)} z={0.001} />
      ))}
      <Part shape={roundRect(w * 1.1, 40, 6)} color={shadeHex(wood, 0.1)} y={h} z={0.002} />
      {[-1, 1].map((k) => (
        <Part key={k} shape={circle(46)} color="#6e4a2c" shade={0.3} x={k * w * 0.32} y={42} z={0.003}>
          <Part shape={circle(10)} color="#3a3a42" flat outline={3} z={0.001} />
        </Part>
      ))}
      {hides
        ? Array.from({ length: 6 }, (_, i) => (
            <Hide key={`h${i}`} x={(i % 2 ? 0.2 : -0.2) * w} y={h - (Math.floor(i / 2) * h) / 3.4} w={w * 0.6} h={h / 3.2} seed={i} z={0.004 + i * 0.001} />
          ))
        : null}
      {burn > 0 ? <FireLine w={w} y={h * 0.6} intensity={burn} seed={5} z={0.05} /> : null}
    </X>
  );
};

/** Roofed battering ram on wheels. Origin = ground center; ram points +x. */
export const BatteringRam: React.FC<XProps & { hides?: boolean; swing?: number; burn?: number }> = ({ hides = false, swing = 0, burn = 0, ...xf }) => {
  const wood = mixHex("#a5764a", "#2e2420", burn * 0.6);
  return (
    <X {...xf}>
      <X x={60 + swing * 60} y={110} z={0.001}>
        <Part shape={roundRect(520, 52, 26)} color="#7a5232" shade={0.25} />
        <Part shape={roundPoly([[250, 30], [310, 0], [250, -30]], 8)} color="#5a5a64" shade={0.3} z={0.001} />
      </X>
      <Part shape={roundPoly([[-230, 60], [230, 60], [180, 260], [-180, 260]], [6, 6, 14, 14])} color={wood} shade={0.18} z={0.002} />
      <Part shape={roundPoly([[-270, 240], [270, 240], [0, 380]], 12)} color={hides ? "#8a5a3a" : wood} shade={0.2} z={0.003} />
      {hides
        ? [-140, 0, 140].map((x, i) => <Hide key={x} x={x} y={320 - Math.abs(x) * 0.4} w={150} h={140} seed={i + 3} z={0.004 + i * 0.001} />)
        : null}
      {[-1, 1].map((k) => (
        <Part key={k} shape={circle(48)} color="#6e4a2c" shade={0.3} x={k * 150} y={48} z={0.005}>
          <Part shape={circle(10)} color="#3a3a42" flat outline={3} z={0.001} />
        </Part>
      ))}
      {burn > 0 ? <FireLine w={420} y={260} intensity={burn} seed={8} z={0.05} /> : null}
    </X>
  );
};

/** Viking longship facing +x. Origin = waterline center. `onLand` adds logs under it. */
export const Longship: React.FC<XProps & { len?: number; sail?: boolean; burn?: number; onLand?: boolean; seed?: number }> = ({
  len = 1000,
  sail = true,
  burn = 0,
  onLand = false,
  seed = 2,
  ...xf
}) => {
  const L = len / 2;
  const hh = len * 0.1;
  const wood = mixHex("#8a5a32", "#2e2420", burn * 0.5);
  return (
    <X {...xf}>
      {onLand
        ? [-0.6, -0.2, 0.2, 0.6].map((k, i) => <Part key={i} shape={roundRect(60, 60, 30)} color="#7a5232" shade={0.3} x={k * L} y={-hh * 0.75} z={-0.02} />)
        : null}
      {sail ? (
        <X z={-0.01}>
          <Part shape={roundRect(14, hh * 4, 6)} color="#6e4a2c" y={hh * 2} />
          <Part shape={roundPoly([[-L * 0.34, hh * 3.6], [L * 0.34, hh * 3.6], [L * 0.3, hh * 1.4], [-L * 0.3, hh * 1.4]], 8)} color="#efe2c4" shade={0.2} z={0.001}>
            {[-0.2, 0, 0.2].map((k, i) => (
              <Part key={i} shape={poly([[k * L - L * 0.05, hh * 3.55], [k * L + L * 0.05, hh * 3.55], [k * L + L * 0.045, hh * 1.45], [k * L - L * 0.045, hh * 1.45]])} color="#c0362c" flat outline={0} z={0.001} />
            ))}
          </Part>
        </X>
      ) : null}
      <Part
        shape={blob([[-L * 1.05, hh * 2.4], [-L * 0.92, hh * 1.0], [-L * 0.6, hh * 0.85], [L * 0.6, hh * 0.85], [L * 0.92, hh * 1.0], [L * 1.05, hh * 2.4], [L * 0.96, hh * 0.2], [L * 0.6, -hh * 0.6], [-L * 0.6, -hh * 0.6], [-L * 0.96, hh * 0.2]], 8)}
        color={wood}
        shade={0.22}
        light={{ dir: [-0.4, 1] }}
      />
      {[-0.4, 0.4].map((k) => (
        <Line key={k} pts={[[-L * 0.8, hh * (0.2 + k)], [L * 0.8, hh * (0.2 + k)]]} width={4} color={shadeHex(wood, 0.35)} z={0.001} />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <Part
          key={i}
          shape={circle(hh * 0.38)}
          color={["#c0362c", "#e9ba41", "#2f5f9a"][i % 3]}
          shade={0.25}
          x={-L * 0.66 + i * L * 0.165}
          y={hh * 0.78}
          z={0.002 + i * 0.0001}
        >
          <Part shape={circle(hh * 0.1)} color="#8a8790" flat outline={3} z={0.001} />
        </Part>
      ))}
      {/* dragon head prow */}
      <Part shape={blob([[L * 1.0, hh * 2.2], [L * 1.08, hh * 2.6], [L * 1.2, hh * 2.55], [L * 1.16, hh * 2.35], [L * 1.06, hh * 2.15]], 6)} color={wood} shade={0.2} z={0.003} />
      {burn > 0 ? (
        <>
          <FireLine w={len * 0.9} y={hh * 1.0} intensity={burn * 1.3} seed={seed} z={0.05} />
          <Smoke y={hh * 2.5} w={len * 0.25} h={1400} alpha={0.55 * burn} seed={seed + 2} z={0.06} />
        </>
      ) : null}
    </X>
  );
};

/** Korean hwacha cart with a rack of rocket arrows. Origin = ground center, aims up-right. */
export const Hwacha: React.FC<XProps & { loaded?: number; tilt?: number }> = ({ loaded = 1, tilt = 0.45, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(360, 40, 10)} color="#8a5a32" shade={0.25} y={90} />
    <Line pts={[[-170, 90], [-300, 30]]} width={14} color="#7a5232" />
    <Line pts={[[-170, 110], [-300, 50]]} width={14} color="#7a5232" />
    <X x={40} y={110} rot={-tilt} z={0.01}>
      <Part shape={roundRect(300, 220, 8)} color="#a5764a" shade={0.22} y={110} />
      {Array.from({ length: 30 }, (_, i) => {
        const c = i % 10;
        const rr = Math.floor(i / 10);
        return (
          <X key={i} x={-120 + c * 27} y={40 + rr * 66} z={0.001}>
            <Part shape={circle(9)} color="#2a1e1a" flat outline={0} />
            {i / 30 < loaded ? <Line pts={[[0, 0], [0, 40]]} width={5} color="#c9a274" z={0.001} /> : null}
          </X>
        );
      })}
    </X>
    {[-1, 1].map((k) => (
      <Part key={k} shape={circle(70)} color="#6e4a2c" shade={0.3} x={k * 120} y={70} z={0.02}>
        {[0, 1, 2, 3].map((i) => (
          <Line key={i} pts={[[0, 0], [Math.cos((i * Math.PI) / 4) * 60, Math.sin((i * Math.PI) / 4) * 60]]} width={5} z={0.001} />
        ))}
        <Line pts={[[-60, 0], [60, 0]]} width={5} z={0.001} />
      </Part>
    ))}
  </X>
);
