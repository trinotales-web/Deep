import React from "react";
import { useCurrentFrame } from "remotion";
import { X, Part, Line, Glow, Gradient, LightCone, roundRect, circle, ellipse, poly, rng } from "../../kit";
import { Monitor, SpaceBack, NebulaBack, type NebulaHue, MoonGlobe, Vikram, Globe, Floorboards, PottedPlant, Desk, Calendar, PerspectiveRoom, ROOM_LAB, ROOM_MISSION, roomQuad, roomPt, FramedPoster, ClockRow, CodeScreen, SideWindow, IsroEmblem } from "../../kit/env";

export { Flash, Paper, RuleBoard, TimeBar, LabSet, PressSet, PressLectern, spark } from "../whale/sets";

// Shared sets for the Moon south pole story.

/** Deep space backdrop: violet nebula, bokeh, twinkling stars and sparkles. */
export const SpaceSet: React.FC<{ children?: React.ReactNode; seed?: number; hue?: NebulaHue; plain?: boolean }> = ({ children, seed = 6, hue = "violet", plain = false }) => (
  <>
    {plain ? <SpaceBack w={6000} h={3600} seed={seed} z={-40} /> : <NebulaBack w={6000} h={3600} seed={seed} hue={hue} z={-40} />}
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
 * ISRO mission control in perspective: navy walls with a tricolour band,
 * ceiling light panels, tiled floor, the big wall screen (children are drawn
 * in screen coordinates, centre = origin, 1560×690), a code screen, a
 * telemetry screen, wall clocks, a gauge panel and rows of consoles.
 * Characters stand on the floor at y = floor.
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
  const geo = { bw: 3000, floor: floor + 260, ceil: floor + 1500, vy: floor + 700 };
  return (
    <PerspectiveRoom geo={geo} colors={ROOM_MISSION} lights={2}>
      {(["#ff9933", "#f4f4f2", "#138808"] as const).map((c, i) => (
        <Part key={c} shape={roundRect(geo.bw, 16, 0)} color={c} flat outline={0} y={geo.ceil - 40 - i * 16} z={-39.4} />
      ))}
      <X y={screenY} z={-39}>
        <Part shape={roundRect(1680, 800, 22)} color="#3a4252" shade={0.15} />
        <Part shape={roundRect(1560, 690, 10)} color={tint} flat outline={5} z={0.001} />
        <Glow rx={900} ry={420} color="#3a8adf" alpha={0.12} additive z={0.002} />
        <X z={0.01}>{screen}</X>
        <Part shape={roundRect(1680, 40, 10)} color="#2a303c" flat outline={5} y={-410} z={0.02} />
        {[-600, -560, -520].map((x, i) => (
          <Part key={x} shape={circle(8)} color={["#ff5a4a", "#ffd84a", "#4ad28a"][i]} flat outline={2} x={x} y={-410} opacity={0.6 + 0.4 * Math.round((Math.sin(frame * 0.2 + i * 2) + 1) / 2)} z={0.021} />
        ))}
      </X>
      <CodeScreen x={-1110} y={screenY - 140} w={440} h={300} seed={3} z={-39} />
      <IsroEmblem plate s={0.48} x={-1022} y={screenY + 220} z={-39} />
      <X x={1160} y={screenY - 20} z={-39}>
        <Part shape={roundRect(520, 380, 10)} color="#2a2c34" flat outline={6} />
        <Part shape={roundRect(490, 350, 6)} color="#0f2236" flat outline={0} z={0.001} />
        {bars.map((b, i) => {
          const hb = Math.round(250 * b * (0.85 + 0.15 * Math.sin(frame * 0.15 + i)));
          return <Part key={i} shape={roundRect(44, hb, 6)} color={i % 3 === 0 ? "#4ad28a" : "#3a9adf"} flat outline={0} x={-195 + i * 65} y={-140 + hb / 2} z={0.002} />;
        })}
      </X>
      <ClockRow x={1160} y={screenY + 380} n={2} gap={200} r={66} z={-39} />
      <X z={-39.2}>
        <Part shape={poly(roomQuad(geo, "right", 1.12, 1.5, floor + 520, floor + 1060))} color="#4a5468" flat outline={5} />
      </X>
      {consoles
        ? Array.from({ length: 6 }, (_, i) => <Console key={i} x={-1750 + i * 700} y={floor + 120} s={0.7} z={-30} frameOff={i * 7} screens={i % 2 ? ["#1d4a6a", "#24604a"] : ["#24604a", "#1d4a6a"]} />)
        : null}
      {children}
    </PerspectiveRoom>
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

/**
 * Lab / office in perspective (reference look): pale back wall with a blue
 * band, framed posters, wall clocks, desks with monitors, a night window on
 * the left wall with the Moon, a gauge panel on the right wall, ceiling light
 * panels and a tiled floor. Characters stand on the floor at y = floor.
 */
export const Office: React.FC<{ floor?: number; wall?: string; night?: boolean; posters?: boolean; children?: React.ReactNode }> = ({ floor = -420, night = true, posters = true, children }) => {
  const geo = { bw: 2600, floor: floor + 250, ceil: floor + 1500, vy: floor + 650 };
  const bf = geo.floor;
  return (
    <PerspectiveRoom geo={geo} colors={ROOM_LAB} lights={2}>
      <SideWindow geo={geo} side="left" t0={1.08} t1={1.75} h0={bf + 330} h1={bf + 1050} day={!night} />
      <X z={-39.2}>
        <Part shape={poly(roomQuad(geo, "left", 2.0, 2.5, bf + 380, bf + 900))} color="#f2efe6" flat outline={5} />
      </X>
      <X z={-39.2}>
        <Part shape={poly(roomQuad(geo, "right", 1.1, 1.55, bf + 380, bf + 900))} color="#5a6070" flat outline={5} />
        {[0.25, 0.6].map((k, i) => {
          const p = roomPt(geo, "right", 1.1 + 0.45 * k + 0.08, bf + 760);
          return <Part key={i} shape={ellipse(26, 34)} color="#f2f2f4" flat outline={4} x={p[0]} y={p[1]} z={0.001} />;
        })}
        {[0, 1, 2].map((i) => {
          const p = roomPt(geo, "right", 1.16 + i * 0.12, bf + 520);
          return <Part key={`b${i}`} shape={ellipse(10, 14)} color={["#4ad28a", "#ffd84a", "#ff5a4a"][i]} flat outline={3} x={p[0]} y={p[1]} z={0.001} />;
        })}
      </X>
      {posters ? (
        <>
          <FramedPoster kind="rocket" x={-700} y={bf + 690} w={460} h={330} z={-39.3} />
          <FramedPoster kind="blueprint" x={700} y={bf + 690} w={460} h={330} z={-39.3} />
          <FramedPoster kind="moon" x={0} y={bf + 640} w={380} h={260} frame="#8a6a3a" z={-39.3} />
          <ClockRow x={0} y={bf + 960} n={3} gap={200} r={70} z={-39.3} />
        </>
      ) : null}
      {[-760, 760].map((x, i) => (
        <X key={x} x={x} y={bf} z={-39}>
          <Part shape={roundRect(560, 230, 8)} color="#2e323c" flat outline={5} y={115} />
          {[-140, 0, 140].map((dx) => (
            <Line key={dx} pts={[[dx, 10], [dx, 220]]} width={4} color="#1e2128" z={0.001} />
          ))}
          <Part shape={roundRect(600, 30, 8)} color="#4a505c" flat outline={5} y={240} z={0.001} />
          <Monitor w={200} h={130} x={i ? -120 : 120} y={350} stand screen={i ? "#24604a" : "#1d4a6a"} z={0.002} />
          <Part shape={roundRect(90, 70, 8)} color="#3a6ab0" flat outline={4} x={i ? 140 : -140} y={290} z={0.002} />
        </X>
      ))}
      <PottedPlant x={-1150} y={floor + 40} h={440} z={-34} />
      {children}
    </PerspectiveRoom>
  );
};

export { Desk, Calendar };

/**
 * Press stage (reference look): deep blue-violet set with arched ceiling
 * ribs and light dots, light beams, a glowing Moon emblem on the backdrop,
 * a curved desk front and a glossy floor. Floor at y=floor.
 */
export const MoonPressSet: React.FC<{ floor?: number; children?: React.ReactNode }> = ({ floor = -440, children }) => {
  const frame = useCurrentFrame();
  const arc = (rx: number, ry: number, cy: number): [number, number][] =>
    Array.from({ length: 31 }, (_, i) => {
      const a = Math.PI * (i / 30);
      return [Math.round(Math.cos(a) * rx), Math.round(cy - Math.sin(a) * ry)] as [number, number];
    });
  return (
    <>
      <Gradient w={6000} h={3600} y={floor + 1500} stops={[[0, "#120e4a"], [0.55, "#2a2a9a"], [1, "#4a3ac0"]]} z={-41} />
      {/* arched ceiling ribs with light dots */}
      {[0, 1, 2, 3].map((k) => {
        const cy = floor + 1450 + k * 170;
        const rx = 1700 + k * 520;
        const ry = 450 + k * 150;
        const pt = (a: number): [number, number] => [Math.round(Math.cos(a) * rx), Math.round(cy - Math.sin(a) * ry)];
        return (
          <X key={k} z={-40.8 + k * 0.01}>
            <Line pts={Array.from({ length: 31 }, (_, i) => pt(Math.PI + Math.PI * (i / 30)))} width={26 - k * 4} color="#6a5ae0" opacity={0.85} />
            {Array.from({ length: 11 }, (_, d) => {
              const p = pt(Math.PI + Math.PI * ((d + 0.5) / 11));
              return <Part key={d} shape={circle(9)} color="#dfe8ff" flat outline={0} x={p[0]} y={p[1]} opacity={0.6 + 0.4 * Math.sin(frame * 0.1 + d + k)} z={0.001} />;
            })}
          </X>
        );
      })}
      {/* beams */}
      {[-1300, -650, 0, 650, 1300].map((x, i) => (
        <LightCone key={x} x={x} y={floor + 2100} w={420} h={2300} top={0.12} color="#bcd4ff" alpha={0.1 + 0.03 * Math.sin(frame * 0.05 + i)} z={-40.6} />
      ))}
      {/* backdrop panel with the Moon emblem */}
      <X y={floor + 760} z={-40.5}>
        <Part shape={roundRect(2600, 860, 60)} color="#2a2a8a" flat outline={7} />
        {[-1, 1].map((sd) => (
          <Part key={sd} shape={roundRect(560, 860, 40)} color="#22227a" flat outline={5} x={sd * 1020} z={0.001} />
        ))}
        <Glow rx={620} ry={480} x={-640} color="#8a9aff" alpha={0.35} additive z={0.002} />
        <MoonGlobe r={280} x={-640} craters={40} glow={0.6} z={0.003} />
        <Line pts={Array.from({ length: 41 }, (_, i) => {
          const a = (i / 40) * Math.PI * 2;
          const x = Math.cos(a) * 480;
          const y = Math.sin(a) * 110;
          return [Math.round(x * Math.cos(-0.25) - y * Math.sin(-0.25)) - 640, Math.round(x * Math.sin(-0.25) + y * Math.cos(-0.25))] as [number, number];
        })} width={10} color="#ffd84a" opacity={0.85} z={0.004} />
      </X>
      {/* glossy floor */}
      <Gradient w={6000} h={1400} y={floor - 700} stops={[[0, "#3a3ab0"], [1, "#1a1a6a"]]} z={-39} />
      <Line pts={[[-3000, floor], [3000, floor]]} width={6} color="#211b20" z={-38.9} />
      <Part shape={ellipse(1100, 120)} color="#8a9aff" flat outline={0} opacity={0.18} y={floor - 160} z={-38.8} />
      {children}
    </>
  );
};

/** Modern press desk front (curved, glossy, Moon emblem) with a mic cluster on top; mics sit at chest height. Origin = floor centre. */
export const PressDesk: React.FC<{ x?: number; y?: number; z?: number; s?: number; w?: number }> = ({ x = 0, y = 0, z = 0, s = 1, w = 1300 }) => (
  <X x={x} y={y} z={z} s={s}>
    <Part shape={poly([[-w / 2, 0], [w / 2, 0], [w / 2 + 60, 360], [-w / 2 - 60, 360]])} color="#5a6ae0" shade={0.25} />
    <Part shape={roundRect(w + 160, 50, 20)} color="#8a9aff" flat outline={6} y={380} z={0.001} />
    <Part shape={roundRect(w * 0.6, 20, 6)} color="#c8d0ff" flat outline={0} opacity={0.5} y={300} z={0.002} />
    <Part shape={ellipse(w * 0.45, 30)} color="#ffffff" flat outline={0} opacity={0.15} y={200} z={0.002} />
    {[[-520, -0.4, "#4ad28a"], [-410, -0.28, "#ff5a4a"], [-300, -0.16, "#ffb04a"]].map(([mx, rot, c], i) => (
      <X key={i} x={mx as number} y={400} rot={rot as number} z={0.003}>
        <Line pts={[[0, 0], [0, 90]]} width={12} color="#2a2a30" />
        <Part shape={roundRect(80, 56, 10)} color="#eef0f3" flat outline={5} y={90} z={0.001} />
        <Part shape={ellipse(42, 48)} color={c as string} shade={0.3} y={150} z={0.002} />
      </X>
    ))}
  </X>
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
