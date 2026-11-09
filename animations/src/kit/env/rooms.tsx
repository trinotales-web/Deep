import React from "react";
import { useCurrentFrame } from "remotion";
import { Part, Line } from "../Part";
import { X, type XProps } from "../context";
import { Glow, Gradient, GroundShadow, LightCone } from "../effects";
import { blob, circle, ellipse, poly, roundPoly, roundRect } from "../shapes";
import { shadeHex, mixHex } from "../style";
import { rng } from "../random";
import { Monitor } from "./gadgets";

// Modern sets: interiors (room, office, stage, factory, mission control,
// courtroom, oval office), building fronts (skyline, campus, house, store) and
// places (tropical island, savanna, snowy Moscow). Origin = floor/ground line
// centre unless stated. Width ~4000 so close-ups never run out of set.

/** Plain interior: wall with a soft vertical gradient, skirting board, floor. */
export const Room: React.FC<XProps & { w?: number; h?: number; wall?: string; floor?: string; floorH?: number; boards?: boolean; children?: React.ReactNode }> = ({
  w = 4400,
  h = 2600,
  wall = "#d8c9a8",
  floor = "#9a7350",
  floorH = 900,
  boards = true,
  children,
  ...xf
}) => (
  <X {...xf}>
    <Gradient w={w} h={h} y={h / 2} stops={[[0, shadeHex(wall, 0.12)], [0.75, wall], [1, shadeHex(wall, -0.04)]]} z={-0.2} />
    <Gradient w={w} h={floorH} y={-floorH / 2} stops={[[0, shadeHex(floor, -0.06)], [1, shadeHex(floor, 0.22)]]} z={-0.19} />
    <Part shape={roundRect(w, 36, 0)} color={shadeHex(wall, 0.35)} flat outline={5} y={18} z={-0.18} />
    {boards
      ? Array.from({ length: 9 }, (_, i) => {
          const y = -40 - i * i * 11;
          return y > -floorH ? <Line key={i} pts={[[-w / 2, y], [w / 2, y]]} width={3} color={shadeHex(floor, 0.25)} z={-0.185} /> : null;
        })
      : null}
    {children}
  </X>
);

/** Window with a view (sky colour) and frame; `night` darkens the view. */
export const Window: React.FC<XProps & { w?: number; h?: number; sky?: string; night?: boolean }> = ({ w = 520, h = 600, sky = "#9fd2f0", night = false, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(w + 40, h + 40, 8)} color="#f2ece0" shade={0.15} />
    <Gradient w={w} h={h} stops={[[0, night ? "#1a2448" : shadeHex(sky, 0.1)], [1, night ? "#3a3a6a" : shadeHex(sky, -0.25)]]} z={0.001} />
    <Line pts={[[0, -h / 2], [0, h / 2]]} width={12} color="#f2ece0" z={0.002} />
    <Line pts={[[-w / 2, 0], [w / 2, 0]]} width={12} color="#f2ece0" z={0.002} />
    <Part shape={roundRect(w + 80, 26, 6)} color="#e6dccb" shade={0.2} y={-h / 2 - 26} z={0.003} />
  </X>
);

/** City skyline of rectangular towers with windows (`night` lights them). Origin = ground centre. */
export const Skyline: React.FC<XProps & { w?: number; n?: number; seed?: number; night?: boolean; color?: string; hmin?: number; hmax?: number }> = ({
  w = 4400,
  n = 16,
  seed = 5,
  night = false,
  color = "#7f93ac",
  hmin = 300,
  hmax = 1100,
  ...xf
}) => {
  const r = rng(seed);
  const blocks = Array.from({ length: n }, (_, i) => {
    const bw = 180 + r() * 200;
    const bh = hmin + r() * (hmax - hmin);
    const x = -w / 2 + (i + 0.5) * (w / n) + (r() - 0.5) * 60;
    return [x, bw, bh, r()] as [number, number, number, number];
  });
  return (
    <X {...xf}>
      {blocks.map(([x, bw, bh, q], i) => {
        const col = mixHex(color, i % 2 ? "#ffffff" : "#2a3242", 0.12);
        return (
          <X key={i} x={x} y={bh / 2} z={q * 0.01}>
            <Part shape={roundRect(bw, bh, 4)} color={col} shade={0.15} />
            {Array.from({ length: Math.floor(bh / 70) }, (_, j) =>
              [-1, 0, 1].map((c) => {
                const lit = night ? ((j * 7 + c * 3 + i) % 5 < 2 ? 1 : 0) : 0;
                return (
                  <Part
                    key={`${j}${c}`}
                    shape={roundRect(bw * 0.18, 28, 3)}
                    color={lit ? "#ffd98a" : shadeHex(col, night ? 0.45 : 0.18)}
                    flat
                    outline={0}
                    x={c * bw * 0.28}
                    y={bh / 2 - 50 - j * 70}
                    z={0.001}
                  />
                );
              }),
            )}
          </X>
        );
      })}
    </X>
  );
};

/** Stage with a curtain backdrop, wooden floor and spotlights (`spots` 0..1). Origin = stage floor centre. */
export const StageSet: React.FC<XProps & { curtain?: string; spots?: number; screen?: string | null; floor?: string; w?: number }> = ({
  curtain = "#7a1e2a",
  spots = 1,
  screen = null,
  floor = "#3a2a2a",
  w = 4400,
  ...xf
}) => (
  <X {...xf}>
    <Gradient w={w} h={2600} y={1300} stops={[[0, shadeHex(curtain, 0.55)], [1, shadeHex(curtain, 0.15)]]} z={-0.2} />
    {Array.from({ length: 22 }, (_, i) => (
      <Line key={i} pts={[[-w / 2 + i * (w / 21), 0], [-w / 2 + i * (w / 21) + 10, 2600]]} width={10} color={shadeHex(curtain, 0.35)} z={-0.19} />
    ))}
    {screen ? <Part shape={roundRect(1800, 900, 12)} color={screen} flat outline={8} y={900} z={-0.18} /> : null}
    <Gradient w={w} h={900} y={-450} stops={[[0, shadeHex(floor, -0.1)], [1, shadeHex(floor, 0.3)]]} z={-0.17} />
    <Part shape={roundRect(w, 40, 0)} color={shadeHex(floor, -0.2)} flat outline={5} y={-6} z={-0.16} />
    {spots > 0
      ? [-700, 0, 700].map((x, i) => <LightCone key={x} w={900} h={2200} x={x} y={1100} rot={(i - 1) * -0.12} alpha={0.16 * spots} z={-0.05} />)
      : null}
  </X>
);

/** Industrial robot arm (orange), base at the origin. Angles in radians. */
export const RobotArm: React.FC<XProps & { a1?: number; a2?: number; a3?: number; color?: string; spark?: number }> = ({ a1 = 0.3, a2 = -0.9, a3 = -0.5, color = "#e8902a", spark = 0, ...xf }) => {
  const frame = useCurrentFrame();
  return (
    <X {...xf}>
      <Part shape={roundRect(160, 60, 10)} color="#4a4a52" shade={0.2} y={30} />
      <X y={60} rot={a1} z={0.01}>
        <Part shape={roundRect(70, 320, 30)} color={color} shade={0.24} y={160} />
        <Part shape={circle(46)} color={shadeHex(color, 0.2)} shade={0.2} z={0.002} />
        <X y={320} rot={a2} z={0.01}>
          <Part shape={roundRect(60, 260, 26)} color={color} shade={0.24} y={130} />
          <Part shape={circle(38)} color={shadeHex(color, 0.2)} shade={0.2} z={0.002} />
          <X y={260} rot={a3} z={0.01}>
            <Part shape={roundRect(70, 50, 10)} color="#4a4a52" shade={0.2} y={20} />
            <Line pts={[[-24, 40], [-30, 90]]} width={10} color="#4a4a52" />
            <Line pts={[[24, 40], [30, 90]]} width={10} color="#4a4a52" />
            {spark > 0 ? <Glow rx={70} y={100} color="#fff2a0" alpha={(0.5 + 0.5 * Math.sin(frame * 1.7)) * spark} additive z={0.01} /> : null}
          </X>
        </X>
      </X>
    </X>
  );
};

/** Factory hall: tall grey wall with high windows, hanging lamps, concrete floor. */
export const FactorySet: React.FC<XProps & { w?: number; night?: boolean; children?: React.ReactNode }> = ({ w = 4600, night = false, children, ...xf }) => (
  <X {...xf}>
    <Gradient w={w} h={2600} y={1300} stops={[[0, night ? "#2a2e38" : "#9aa2ae"], [1, night ? "#4a4e58" : "#c9ced6"]]} z={-0.2} />
    {Array.from({ length: 7 }, (_, i) => (
      <Part key={i} shape={roundRect(420, 260, 6)} color={night ? "#1a2238" : "#dbeefa"} flat outline={6} x={-w / 2 + 360 + i * 660} y={1350} z={-0.19} />
    ))}
    {Array.from({ length: 8 }, (_, i) => (
      <Line key={`c${i}`} pts={[[-w / 2 + i * 640, 0], [-w / 2 + i * 640, 2600]]} width={24} color={night ? "#3a3e48" : "#8a929e"} z={-0.185} />
    ))}
    <Gradient w={w} h={900} y={-450} stops={[[0, "#8f9399"], [1, "#b8bcc2"]]} z={-0.18} />
    <Part shape={roundRect(w, 14, 0)} color="#e8c84a" flat outline={0} y={-120} z={-0.175} />
    {[-1300, -400, 500, 1400].map((x) => (
      <React.Fragment key={x}>
        <Line pts={[[x, 2600], [x, 1700]]} width={4} color="#3a3a42" z={-0.17} />
        <Part shape={roundPoly([[-70, 0], [70, 0], [40, 60], [-40, 60]], 8)} color="#4a4a52" shade={0.2} x={x} y={1640} z={-0.169} />
        <LightCone w={700} h={1600} x={x} y={860} alpha={night ? 0.2 : 0.1} z={-0.16} />
      </React.Fragment>
    ))}
    {children}
  </X>
);

/** Mission control: rows of consoles with glowing screens, a big wall screen. */
export const MissionControlSet: React.FC<XProps & { w?: number; wallScreen?: string; children?: React.ReactNode }> = ({ w = 4400, wallScreen = "#16304a", children, ...xf }) => {
  const frame = useCurrentFrame();
  return (
    <X {...xf}>
      <Gradient w={w} h={2600} y={1300} stops={[[0, "#1a1e28"], [1, "#2e3442"]]} z={-0.2} />
      <Part shape={roundRect(2200, 900, 14)} color={wallScreen} flat outline={8} y={1250} z={-0.19} />
      <Glow rx={1300} ry={600} y={1250} color="#4a9adf" alpha={0.12} additive z={-0.185} />
      {[-1600, 1600].map((x) => (
        <Part key={x} shape={roundRect(700, 500, 10)} color="#12263a" flat outline={7} x={x} y={1150} z={-0.19} />
      ))}
      <Gradient w={w} h={900} y={-450} stops={[[0, "#2a2e36"], [1, "#3e434e"]]} z={-0.18} />
      {[0, 1].map((row) =>
        Array.from({ length: 6 }, (_, i) => (
          <X key={`${row}${i}`} x={-1750 + i * 700 + row * 200} y={row ? 120 : 380} s={row ? 1 : 0.78} z={row ? -0.05 : -0.1}>
            <Part shape={roundRect(600, 170, 10)} color="#4a4e58" shade={0.2} y={85} />
            {[-160, 160].map((mx) => (
              <Monitor key={mx} w={240} h={150} x={mx} y={260} stand={false} screen={(i + mx + frame) % 3 ? "#1d4a6a" : "#24604a"} z={0.01} />
            ))}
          </X>
        )),
      )}
      {children}
    </X>
  );
};

/** Courtroom: wooden judge's bench with seal, jury box rail, panelled wall. */
export const CourtroomSet: React.FC<XProps & { w?: number; children?: React.ReactNode }> = ({ w = 4400, children, ...xf }) => (
  <X {...xf}>
    <Gradient w={w} h={2600} y={1300} stops={[[0, "#5a3a24"], [1, "#8a5a36"]]} z={-0.2} />
    {Array.from({ length: 12 }, (_, i) => (
      <Part key={i} shape={roundRect(300, 1300, 8)} color="#7a4e2e" shade={0.15} x={-w / 2 + 180 + i * 370} y={1000} z={-0.19} />
    ))}
    <Part shape={circle(170)} color="#e9ba41" shade={0.2} y={1700} z={-0.18} />
    <Part shape={circle(120)} color="#2f4f9a" flat outline={5} y={1700} z={-0.179} />
    <Gradient w={w} h={900} y={-450} stops={[[0, "#6a4a32"], [1, "#9a6a46"]]} z={-0.17} />
    <Part shape={roundRect(1400, 520, 12)} color="#6e4426" shade={0.2} y={520} z={-0.15}>
      {[-450, 0, 450].map((x) => (
        <Part key={x} shape={roundRect(360, 380, 8)} color="#5e3a20" flat outline={4} x={x} z={0.001} />
      ))}
    </Part>
    {children}
  </X>
);

/** Oval-office-like room: curved pale wall, tall windows with gold drapes, flags. */
export const OvalOfficeSet: React.FC<XProps & { w?: number; children?: React.ReactNode }> = ({ w = 4400, children, ...xf }) => (
  <X {...xf}>
    <Gradient w={w} h={2600} y={1300} stops={[[0, "#e9e2cc"], [1, "#f6f1e0"]]} z={-0.2} />
    {[-700, 0, 700].map((x) => (
      <X key={x} x={x} y={1000} z={-0.19}>
        <Part shape={roundRect(420, 1100, 30)} color="#cfe4f2" flat outline={7} />
        <Line pts={[[0, -550], [0, 550]]} width={10} color="#f6f1e0" z={0.001} />
        {[-1, 1].map((sd) => (
          <Part key={sd} shape={roundPoly([[sd * 210, 600], [sd * 330, 600], [sd * 300, -560], [sd * 220, -560]], 20)} color="#d8a832" shade={0.22} z={0.002} />
        ))}
      </X>
    ))}
    <Gradient w={w} h={900} y={-450} stops={[[0, "#2f4a7a"], [1, "#3f5f9a"]]} z={-0.17} />
    {children}
  </X>
);

/** Shop front with a big glass window (a car inside goes in `children`). Origin = pavement centre. */
export const StoreFront: React.FC<XProps & { w?: number; h?: number; wall?: string; glass?: string; children?: React.ReactNode }> = ({
  w = 2000,
  h = 1100,
  wall = "#e8e8ea",
  glass = "#bcd8ea",
  children,
  ...xf
}) => (
  <X {...xf}>
    <Part shape={roundRect(w + 300, h + 300, 6)} color={wall} shade={0.15} y={(h + 300) / 2} z={-0.12} />
    <Part shape={roundRect(w, h, 6)} color={glass} flat outline={8} y={h / 2 + 40} z={-0.11} />
    <X y={40} z={-0.1}>
      {children}
    </X>
    <Part shape={roundRect(w, h, 6)} color="#ffffff" flat outline={0} opacity={0.18} y={h / 2 + 40} z={-0.05} />
    {[-w / 4, w / 4].map((x) => (
      <Line key={x} pts={[[x, 40], [x, h + 40]]} width={10} color="#9aa0aa" z={-0.049} />
    ))}
    <Part shape={roundRect(w * 0.5, 120, 10)} color="#2a2a30" flat outline={6} y={h + 150} z={-0.048} />
  </X>
);

/** Campus building front: brick, grey stone or sandstone arches. Origin = ground centre. */
export const CampusBuilding: React.FC<XProps & { kind?: "brick" | "stone" | "sandstone"; w?: number; h?: number }> = ({ kind = "brick", w = 2600, h = 1300, ...xf }) => {
  const wall = kind === "brick" ? "#a8543a" : kind === "stone" ? "#a9a49a" : "#d9b47a";
  const roof = kind === "sandstone" ? "#b8502f" : "#5a5560";
  return (
    <X {...xf}>
      <Part shape={roundRect(w, h, 4)} color={wall} shade={0.18} y={h / 2}>
        {kind === "brick"
          ? Array.from({ length: Math.floor(h / 60) }, (_, i) => <Line key={i} pts={[[-w / 2 + 4, -h / 2 + 60 * i], [w / 2 - 4, -h / 2 + 60 * i]]} width={2.5} color={shadeHex(wall, 0.18)} z={0.001} />)
          : null}
      </Part>
      <Part shape={poly([[-w / 2 - 60, h], [w / 2 + 60, h], [w / 2 - 100, h + 260], [-w / 2 + 100, h + 260]])} color={roof} shade={0.2} z={0.002} />
      {Array.from({ length: 7 }, (_, i) => {
        const x = -w / 2 + w / 14 + i * (w / 7);
        return kind === "sandstone" ? (
          <X key={i} x={x} y={0} z={0.003}>
            <Part shape={roundPoly([[-110, 0], [110, 0], [110, 420], [0, 520], [-110, 420]], [0, 0, 60, 60, 60])} color="#5a3e2a" flat outline={5} y={0} />
          </X>
        ) : (
          <X key={i} x={x} y={h * 0.25} z={0.003}>
            {[0, 1].map((row) => (
              <Part key={row} shape={roundPoly([[-80, row * 420], [80, row * 420], [80, row * 420 + 240], [0, row * 420 + 300], [-80, row * 420 + 240]], [0, 0, 50, 50, 50])} color="#2f3a4c" flat outline={5} />
            ))}
          </X>
        );
      })}
      {kind === "stone" ? <Part shape={roundRect(260, 640, 20)} color={shadeHex(wall, 0.12)} shade={0.2} y={h + 300} z={0.001} /> : null}
    </X>
  );
};

/** 1970s South African family house: white walls, red tile roof, porch. Origin = ground centre. */
export const House: React.FC<XProps & { wall?: string; roof?: string; w?: number; lit?: boolean }> = ({ wall = "#f2ece0", roof = "#b8502f", w = 1400, lit = false, ...xf }) => (
  <X {...xf}>
    <GroundShadow w={w * 1.1} y={2} z={-0.05} />
    <Part shape={roundRect(w, 620, 6)} color={wall} shade={0.18} y={310} />
    <Part shape={poly([[-w / 2 - 90, 600], [w / 2 + 90, 600], [w / 4, 960], [-w / 4, 960]])} color={roof} shade={0.2} z={0.001}>
      {[680, 760, 840, 920].map((y) => (
        <Line key={y} pts={[[-w / 2, y - 0], [w / 2, y]]} width={3} color={shadeHex(roof, 0.25)} z={0.001} />
      ))}
    </Part>
    {[-w * 0.3, w * 0.3].map((x) => (
      <X key={x} x={x} y={330} z={0.002}>
        <Part shape={roundRect(240, 220, 6)} color={lit ? "#ffd98a" : "#6f9ac2"} flat outline={6} />
        <Line pts={[[0, -110], [0, 110]]} width={7} color={wall} z={0.001} />
        <Glow rx={lit ? 200 : 0.01} color="#ffd98a" alpha={lit ? 0.25 : 0} additive z={0.002} />
      </X>
    ))}
    <Part shape={roundRect(170, 330, 10)} color="#7a4a2a" shade={0.2} y={165} z={0.002} />
    <Part shape={circle(9)} color="#e9ba41" flat outline={3} x={50} y={160} z={0.003} />
  </X>
);

/** Small tropical island with palms, sand and a shallow-water ring. Origin = beach centre. */
export const TropicalIsland: React.FC<XProps & { w?: number; palms?: number; seed?: number; children?: React.ReactNode }> = ({ w = 2200, palms = 4, seed = 4, children, ...xf }) => {
  const frame = useCurrentFrame();
  const r = rng(seed);
  return (
    <X {...xf}>
      <Part shape={ellipse(w * 0.62, 120)} color="#7fd6d0" flat outline={0} opacity={0.75} y={-30} z={-0.03} />
      <Part shape={blob([[-w / 2, 0], [-w * 0.42, 60], [-w * 0.2, 96], [w * 0.2, 100], [w * 0.44, 56], [w / 2, 0], [0, -40]], 8)} color="#ead39a" shade={0.15} z={-0.02} />
      {Array.from({ length: palms }, (_, i) => {
        const x = -w * 0.38 + (i / Math.max(1, palms - 1)) * w * 0.76 + (r() - 0.5) * 80;
        const hh = 380 + r() * 200;
        const lean = (r() - 0.5) * 0.4 + Math.sin(frame * 0.03 + i) * 0.03;
        return (
          <X key={i} x={x} y={40 + r() * 30} rot={lean} z={-0.01 + i * 0.001}>
            <Line pts={[[0, 0], [12, hh * 0.5], [-6, hh]]} smooth width={26} color="#8a5a32" />
            {[0, 1, 2, 3, 4].map((k) => {
              const a = -0.4 + k * 0.85 + Math.sin(frame * 0.05 + i + k) * 0.04;
              return (
                <X key={k} x={-6} y={hh} rot={a}>
                  <Part shape={blob([[0, 0], [90, 26], [190, 6], [260, -40], [180, -10], [90, -8]], 6)} color={k % 2 ? "#3f8f3a" : "#4fa04a"} shade={0.2} />
                </X>
              );
            })}
          </X>
        );
      })}
      {children}
    </X>
  );
};

/** Open savanna: golden grass plain, distant blue hills, acacias go in `children`. */
export const SavannaSet: React.FC<XProps & { w?: number; children?: React.ReactNode }> = ({ w = 4400, children, ...xf }) => (
  <X {...xf}>
    <Gradient w={w} h={2400} y={1200} stops={[[0, "#f4c27a"], [1, "#fbe3b0"]]} z={-0.2} />
    <Part shape={blob([[-w / 2, 0], [-w * 0.3, 160], [-w * 0.1, 90], [w * 0.15, 200], [w * 0.4, 110], [w / 2, 140], [w / 2, 0]], 8)} color="#b9a0a8" flat outline={4} z={-0.19} />
    <Gradient w={w} h={900} y={-450} stops={[[0, "#d8b45a"], [1, "#b88a3a"]]} z={-0.18} />
    {children}
  </X>
);

/** Snowy Moscow street: onion-domed cathedral and blocks under a grey sky. */
export const MoscowSet: React.FC<XProps & { w?: number; snow?: number; children?: React.ReactNode }> = ({ w = 4400, snow = 1, children, ...xf }) => {
  const frame = useCurrentFrame();
  const r = rng(11);
  const flakes = Array.from({ length: 70 }, () => [(r() - 0.5) * w, r() * 2200, 4 + r() * 6, r()] as [number, number, number, number]);
  const domes: [number, number, number, string][] = [
    [-120, 900, 120, "#c8262f"],
    [140, 760, 90, "#2f8a5a"],
    [-340, 700, 80, "#e9ba41"],
    [320, 640, 70, "#2f6fa8"],
  ];
  return (
    <X {...xf}>
      <Gradient w={w} h={2600} y={1300} stops={[[0, "#9aa4b4"], [1, "#d8dde6"]]} z={-0.2} />
      <X x={600} z={-0.15}>
        {domes.map(([x, y, rr, c], i) => (
          <X key={i} x={x} y={0} z={i * 0.001}>
            <Part shape={roundRect(rr * 1.4, y, 4)} color="#e8e2d8" shade={0.18} y={y / 2} />
            <Part shape={blob([[-rr, 0], [-rr * 0.9, rr * 0.6], [-rr * 0.4, rr * 1.1], [0, rr * 1.6], [rr * 0.4, rr * 1.1], [rr * 0.9, rr * 0.6], [rr, 0]], 8)} color={c} shade={0.24} y={y} z={0.001} />
            <Line pts={[[0, y + rr * 1.6], [0, y + rr * 2.1]]} width={6} color="#c9a24a" z={0.002} />
          </X>
        ))}
      </X>
      <Part shape={roundRect(w, 340, 4)} color="#c9b8a4" shade={0.15} y={170} z={-0.14} />
      <Gradient w={w} h={900} y={-450} stops={[[0, "#e8edf4"], [1, "#ffffff"]]} z={-0.13} />
      {children}
      {snow > 0
        ? flakes.map(([x, y, s, q], i) => (
            <Part key={i} shape={circle(s)} color="#ffffff" flat outline={0} x={x + Math.sin(frame * 0.03 + i) * 30} y={((y - frame * (3 + q * 3)) % 2400 + 2400) % 2400 - 600} opacity={0.85 * snow} z={0.5} />
          ))
        : null}
    </X>
  );
};

/** Concrete outdoor stairs (school), steps going up to the left. Origin = foot of the stairs. */
export const ConcreteStairs: React.FC<XProps & { steps?: number; stepW?: number; stepH?: number }> = ({ steps = 9, stepW = 150, stepH = 70, ...xf }) => (
  <X {...xf}>
    <Part
      shape={poly([[0, 0], ...Array.from({ length: steps }, (_, i) => [[-i * stepW, (i + 1) * stepH], [-(i + 1) * stepW, (i + 1) * stepH]] as [number, number][]).flat(), [-steps * stepW - 400, steps * stepH], [-steps * stepW - 400, 0]])}
      color="#b9b6ae"
      shade={0.18}
    />
    {Array.from({ length: steps }, (_, i) => (
      <Line key={i} pts={[[-i * stepW, (i + 1) * stepH - 4], [-(i + 1) * stepW, (i + 1) * stepH - 4]]} width={5} color="#8f8c86" z={0.001} />
    ))}
    <Line pts={[[40, 90], [-steps * stepW + 40, steps * stepH + 90]]} width={10} color="#6a6e76" z={0.002} />
  </X>
);
