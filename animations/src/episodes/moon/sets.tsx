import React from "react";
import { useCurrentFrame } from "remotion";
import { X, Part, Line, Glow, Gradient, roundRect, circle, ellipse, poly, rng } from "../../kit";
import { Monitor, SpaceBack, MoonGlobe, Vikram, Globe, Floorboards, Wainscot, Window, Bookshelf, HangingLamp, PottedPlant, Desk, Calendar } from "../../kit/env";

export { Flash, Paper, RuleBoard, TimeBar, LabSet, PressSet, PressLectern, spark } from "../whale/sets";

// Shared sets for the Moon south pole story.

/** Deep space backdrop (stars, soft milky band). */
export const SpaceSet: React.FC<{ children?: React.ReactNode; seed?: number }> = ({ children, seed = 6 }) => (
  <>
    <SpaceBack w={6000} h={3600} seed={seed} z={-40} />
    {children}
  </>
);

/** A desk console with two glowing monitors (facing the viewer's left/right). Origin = floor centre. */
export const Console: React.FC<{ x?: number; y?: number; z?: number; s?: number; w?: number; screens?: string[]; frameOff?: number }> = ({ x = 0, y = 0, z = 0, s = 1, w = 640, screens = ["#1d4a6a", "#24604a"], frameOff = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <X x={x} y={y} z={z} s={s}>
      <Part shape={roundRect(w, 230, 14)} color="#4a4e5a" shade={0.2} y={115} />
      <Part shape={roundRect(w + 40, 36, 10)} color="#6a6e7a" flat outline={5} y={238} z={0.001} />
      {screens.map((c, i) => (
        <X key={i} x={(i - (screens.length - 1) / 2) * (w / screens.length)} y={256} z={0.002}>
          <Monitor w={210} h={140} stand screen={c} />
          <Glow rx={150} ry={90} y={90} color="#7fd0ff" alpha={0.12 + 0.05 * Math.sin((frame + frameOff + i * 9) * 0.2)} additive z={0.01} />
        </X>
      ))}
    </X>
  );
};

/**
 * ISRO mission control: dark blue room, a big wall screen (children are
 * drawn in screen coordinates, centre of the screen = origin, 1500×680), side
 * telemetry screens and rows of consoles. Floor at y=floor.
 */
export const ControlRoom: React.FC<{ floor?: number; screenY?: number; consoles?: boolean; children?: React.ReactNode; screen?: React.ReactNode; tint?: string }> = ({
  floor = -420,
  screenY = 520,
  consoles = true,
  children,
  screen,
  tint = "#0e1a2c",
}) => {
  const frame = useCurrentFrame();
  const r = rng(4);
  const bars = Array.from({ length: 7 }, () => 0.3 + r() * 0.6);
  return (
    <>
      <Gradient w={6000} h={3600} y={600} stops={[[0, "#141b2a"], [0.6, "#1e2840"], [1, "#2a3450"]]} z={-41} />
      {/* ceiling lights */}
      {[-1500, -500, 500, 1500].map((x) => (
        <X key={x} x={x} y={floor + 1700} z={-40.8}>
          <Part shape={roundRect(520, 40, 12)} color="#e8f0ff" flat outline={5} />
          <Glow rx={420} ry={160} y={-40} color="#bfe0ff" alpha={0.2} additive z={0.01} />
        </X>
      ))}
      {/* tricolor strip along the wall */}
      {(["#ff9933", "#f4f4f2", "#138808"] as const).map((c, i) => (
        <Part key={c} shape={roundRect(6000, 16, 0)} color={c} flat outline={0} y={floor + 1500 - i * 16} z={-40.7} />
      ))}
      <X y={screenY} z={-40}>
        <Part shape={roundRect(1640, 760, 18)} color="#3a4252" flat outline={8} />
        <Part shape={roundRect(1560, 690, 10)} color={tint} flat outline={5} z={0.001} />
        <Glow rx={900} ry={420} color="#3a8adf" alpha={0.12} additive z={0.002} />
        <X z={0.01}>{screen}</X>
      </X>
      {[-1, 1].map((sd) => (
        <X key={sd} x={sd * 1300} y={screenY + 20} z={-40}>
          <Part shape={roundRect(640, 480, 14)} color="#3a4252" flat outline={7} />
          <Part shape={roundRect(580, 420, 8)} color="#0f2236" flat outline={4} z={0.001} />
          {bars.map((b, i) => (
            <Part
              key={i}
              shape={roundRect(54, Math.round(300 * b * (0.85 + 0.15 * Math.sin(frame * 0.15 + i + sd))), 6)}
              color={i % 3 === 0 ? "#4ad28a" : "#3a9adf"}
              flat
              outline={0}
              x={-230 + i * 76}
              y={-170 + (300 * b * (0.85 + 0.15 * Math.sin(frame * 0.15 + i + sd))) / 2}
              z={0.002}
            />
          ))}
        </X>
      ))}
      <Gradient w={6000} h={1400} y={floor - 700} stops={[[0, "#2e3446"], [1, "#3c4458"]]} z={-39} />
      <Line pts={[[-3000, floor], [3000, floor]]} width={6} color="#211b20" z={-38.9} />
      {consoles
        ? Array.from({ length: 6 }, (_, i) => <Console key={i} x={-1750 + i * 700} y={floor + 120} s={0.7} z={-30} frameOff={i * 7} screens={i % 2 ? ["#1d4a6a", "#24604a"] : ["#24604a", "#1d4a6a"]} />)
        : null}
      {children}
    </>
  );
};

/** Wall-screen graphic: the Moon's limb at the bottom with Vikram's descent path, k 0..1 along it. */
export const DescentScreen: React.FC<{ k: number; upright?: number; label?: boolean; done?: number }> = ({ k, upright = 0, done = 0 }) => {
  const frame = useCurrentFrame();
  const path: [number, number][] = Array.from({ length: 30 }, (_, i) => {
    const u = i / 29;
    return [-640 + u * 1080, 260 - 420 * u ** 1.6];
  });
  const idx = Math.min(29, Math.max(0, k * 29));
  const i0 = Math.floor(idx);
  const f = idx - i0;
  const p0 = path[i0];
  const p1 = path[Math.min(29, i0 + 1)];
  const pos: [number, number] = [p0[0] + (p1[0] - p0[0]) * f, p0[1] + (p1[1] - p0[1]) * f];
  // the Moon's limb as a cap of a big circle, kept inside the screen (1560×690)
  const limb: [number, number][] = [[-770, -335]];
  for (let i = 0; i <= 24; i++) {
    const x = -770 + (1540 * i) / 24;
    limb.push([Math.round(x), Math.round(Math.max(-335, -2200 + Math.sqrt(2000 * 2000 - x * x)))]);
  }
  limb.push([770, -335]);
  return (
    <X>
      <Part shape={poly(limb)} color="#6a7a8a" flat outline={6} />
      {[-0.6, -0.2, 0.25, 0.55].map((u, i) => (
        <Part key={i} shape={ellipse(50 + i * 12, 12)} color="#4a5a6a" flat outline={3} x={u * 900} y={-262 - (i % 2) * 18 - Math.abs(u) * 40} z={0.002} />
      ))}
      <Line pts={path} width={10} color="#4ad2ff" opacity={0.45} z={0.003} />
      <Line pts={path.slice(0, i0 + 1).concat([pos])} width={12} color="#ffd84a" z={0.004} />
      <X x={pos[0]} y={pos[1]} rot={(1 - upright) * -1.4} s={0.22} z={0.005}>
        <Vikram y={-200} thrust={k > 0.05 && k < 0.99 ? 0.6 : 0} flag={false} />
      </X>
      {done > 0 ? <Glow rx={260} color="#4ad28a" alpha={0.5 * done * (0.8 + 0.2 * Math.sin(frame * 0.3))} additive x={pos[0]} y={pos[1]} z={0.006} /> : null}
      {[-1, 1].map((sd) => (
        <Line key={sd} pts={[[sd * 760, 330], [sd * 760, -330]]} width={3} color="#2a5a7a" opacity={0.6} z={0.001} />
      ))}
    </X>
  );
};

/** Pluto: beige dwarf planet with its pale heart. */
export const Pluto: React.FC<{ x?: number; y?: number; z?: number; r?: number }> = ({ x = 0, y = 0, z = 0, r = 200 }) => (
  <X x={x} y={y} z={z}>
    <Glow rx={r * 1.3} color="#f0d8b8" alpha={0.25} additive z={-0.01} />
    <Part shape={circle(r)} color="#c9a888" shade={0.32}>
      <Part
        shape={poly([[r * 0.05, -r * 0.55], [r * 0.55, -r * 0.05], [r * 0.55, r * 0.25], [r * 0.38, r * 0.42], [r * 0.18, r * 0.38], [r * 0.05, r * 0.22], [-r * 0.08, r * 0.38], [-r * 0.28, r * 0.42], [-r * 0.45, r * 0.25], [-r * 0.45, -r * 0.05]].map(([a, b]) => [Math.round(a), Math.round(b)] as [number, number]))}
        color="#f2e6d6"
        flat
        outline={0}
        x={r * 0.1}
        y={-r * 0.1}
        z={0.001}
      />
      <Part shape={ellipse(r * 0.4, r * 0.2)} color="#7a5a4a" flat outline={0} x={-r * 0.45} y={r * 0.45} rot={0.4} opacity={0.6} z={0.001} />
    </Part>
  </X>
);

/** Planet with a tilted spin axis and an angle arc. `tilt` in radians. */
export const AxisLine: React.FC<{ x?: number; y?: number; z?: number; len?: number; tilt: number; color?: string; arc?: number }> = ({ x = 0, y = 0, z = 0, len = 600, tilt, color = "#fe5649", arc = 1 }) => (
  <X x={x} y={y} z={z}>
    <Line pts={[[0, -len * 0.5], [0, len * 0.5]]} width={6} color="#ffffff" opacity={0.5} />
    {Array.from({ length: 10 }, (_, i) =>
      i % 2 ? null : (
        <Line
          key={i}
          pts={[
            [Math.sin(tilt) * (-len / 2 + (i * len) / 10), Math.cos(tilt) * (-len / 2 + (i * len) / 10)],
            [Math.sin(tilt) * (-len / 2 + ((i + 1) * len) / 10), Math.cos(tilt) * (-len / 2 + ((i + 1) * len) / 10)],
          ]}
          width={12}
          color={color}
          z={0.001}
        />
      ),
    )}
    {arc > 0 ? (
      <Line
        pts={Array.from({ length: 16 }, (_, i) => {
          const a = (tilt * i) / 15;
          const R = len * 0.42;
          return [Math.sin(a) * R, Math.cos(a) * R] as [number, number];
        })}
        width={8}
        color="#ffd84a"
        opacity={arc}
        z={0.002}
      />
    ) : null}
  </X>
);

/** Earth globe turned to India. */
export const EarthIndia: React.FC<{ x?: number; y?: number; z?: number; r?: number; s?: number; highlight?: boolean }> = ({ x = 0, y = 0, z = 0, r = 380, s = 1, highlight = true }) => (
  <X x={x} y={y} z={z} s={s}>
    <Globe r={r} lon0={78} lat0={18} highlight={highlight ? [77.59, 12.97] : null} />
  </X>
);

/** Small Moon in the sky / on a screen. */
export const MiniMoon: React.FC<{ x?: number; y?: number; z?: number; r?: number; view?: { lon: number; lat: number } }> = ({ x = 0, y = 0, z = 0, r = 120, view }) => (
  <MoonGlobe x={x} y={y} z={z} r={r} craters={30} view={view} glow={0.4} />
);

/** Office/lab with a window, bookshelf and desk (floor at y=floor). */
export const Office: React.FC<{ floor?: number; wall?: string; night?: boolean; children?: React.ReactNode }> = ({ floor = -420, wall = "#d6dde6", night = false, children }) => (
  <>
    <Gradient w={6000} h={3600} stops={[[0, wall], [1, "#c2ccd8"]]} z={-41} />
    <Window x={-760} y={floor + 820} w={600} h={540} night={night} z={-40} />
    <Bookshelf x={820} y={floor + 380} z={-40} />
    <HangingLamp x={40} y={floor + 1300} cord={200} z={-39} />
    <Wainscot w={6000} h={240} wall="#c2ccd8" y={floor + 120} z={-39.5} />
    <Floorboards w={6000} h={900} y={floor} color="#7a5a3c" z={-35} />
    <PottedPlant x={-1300} y={floor} h={440} z={-34} />
    {children}
  </>
);

export { Desk, Calendar };

/** Press-conference backdrop: blue wall with small Moon emblems, wooden floor. */
export const MoonPressSet: React.FC<{ floor?: number; children?: React.ReactNode }> = ({ floor = -440, children }) => (
  <>
    <Gradient w={6000} h={3600} stops={[[0, "#2a4a7a"], [1, "#1a2e52"]]} z={-41} />
    {Array.from({ length: 30 }, (_, i) => (
      <X key={i} x={-2100 + (i % 10) * 460 + (Math.floor(i / 10) % 2) * 230} y={floor + 300 + Math.floor(i / 10) * 330} z={-40}>
        <Part shape={circle(70)} color="#9ab0d0" flat outline={4} />
        <Part shape={circle(18)} color="#7a90b4" flat outline={0} x={-20} y={14} z={0.001} />
        <Part shape={circle(12)} color="#7a90b4" flat outline={0} x={24} y={-18} z={0.001} />
      </X>
    ))}
    <Floorboards w={6000} h={900} y={floor} color="#5a4030" z={-35} />
    {children}
  </>
);

/** Big water drop. Origin = centre. */
export const WaterDrop: React.FC<{ x?: number; y?: number; z?: number; s?: number }> = ({ x = 0, y = 0, z = 0, s = 1 }) => (
  <X x={x} y={y} z={z} s={s}>
    <Part shape={poly(Array.from({ length: 33 }, (_, i) => {
      const a = (i / 32) * Math.PI * 2;
      const r = 100 * (1 - 0.55 * Math.max(0, Math.sin(a)) ** 6);
      const yy = Math.sin(a) * 100 + Math.max(0, Math.sin(a)) ** 3 * 90;
      return [Math.round(Math.cos(a) * r), Math.round(yy)] as [number, number];
    }))} color="#4ab0ff" shade={0.3} />
    <Part shape={ellipse(20, 34)} color="#d8f2ff" flat outline={0} x={-40} y={20} rot={0.3} z={0.001} />
  </X>
);

/** Stack of gold bars. Origin = bottom centre. */
export const GoldBars: React.FC<{ x?: number; y?: number; z?: number; s?: number; n?: number }> = ({ x = 0, y = 0, z = 0, s = 1, n = 3 }) => {
  const rows = n === 3 ? [[-70, 0], [70, 0], [0, 1]] : [[-140, 0], [0, 0], [140, 0], [-70, 1], [70, 1], [0, 2]];
  return (
    <X x={x} y={y} z={z} s={s}>
      {rows.map(([bx, row], i) => (
        <Part key={i} shape={poly([[bx - 66, row * 56], [bx + 66, row * 56], [bx + 50, row * 56 + 54], [bx - 50, row * 56 + 54]])} color="#f2c23a" shade={0.3} z={i * 0.001} />
      ))}
    </X>
  );
};

/** Pile of ice blocks. Origin = bottom centre. */
export const IceBlocks: React.FC<{ x?: number; y?: number; z?: number; s?: number }> = ({ x = 0, y = 0, z = 0, s = 1 }) => {
  const r = rng(21);
  const blocks: [number, number, number][] = [];
  [7, 6, 5, 4, 3, 2, 1].forEach((n, row) => {
    for (let i = 0; i < n; i++) blocks.push([(i - (n - 1) / 2) * 150 + (r() - 0.5) * 20, row * 120, (r() - 0.5) * 0.2]);
  });
  return (
    <X x={x} y={y} z={z} s={s}>
      {blocks.map(([bx, by, rot], i) => (
        <X key={i} x={bx} y={by + 60} rot={rot} z={i * 0.001}>
          <Part shape={roundRect(140, 116, 16)} color="#bfefff" shade={0.3} />
          <Part shape={roundRect(40, 14, 7)} color="#ffffff" flat outline={0} x={-30} y={30} rot={-0.3} opacity={0.8} z={0.0005} />
        </X>
      ))}
    </X>
  );
};
