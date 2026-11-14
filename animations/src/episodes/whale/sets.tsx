import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { X, Part, Line, Glow, Gradient, Wash, InkLine, roundRect, circle, ellipse, poly, blob, mixHex, shadeHex, rng } from "../../kit";
import {
  Sky, Cloud, Mountains, Hill, Sea, Ground, Bush, PalmTree, Sun, Underwater, CourtSide, WallLights, Wainscot, DustMotes, PottedPlant, Window, Floorboards, Lectern, Mic,
  BlueWhale, HangingLamp, Bookshelf, Desk,
} from "../../kit/env";

// Shared sets for the blue whale story.

export const Flash: React.FC<{ k: number; color?: string }> = ({ k, color = "#ffffff" }) =>
  k > 0.001 ? <AbsoluteFill style={{ backgroundColor: color, opacity: Math.min(1, k) }} /> : null;

type Mood = "day" | "dawn" | "dusk" | "storm" | "grey";
const SKIES: Record<Mood, { top: string; mid?: string; bottom: string; sea: string; hills: string; wash?: [string, number] }> = {
  day: { top: "#6fb6e6", mid: "#a9d6f0", bottom: "#e6f3f8", sea: "#3f8fb8", hills: "#b9a466" },
  dawn: { top: "#6a86c0", mid: "#e8a8a0", bottom: "#ffd8a0", sea: "#4a7fa8", hills: "#a08a6a" },
  dusk: { top: "#3a3a6a", mid: "#b05a5a", bottom: "#f0a060", sea: "#3a5a7a", hills: "#6a5a5a", wash: ["#3a1a2a", 0.12] },
  storm: { top: "#4a5260", mid: "#6a7280", bottom: "#9aa2ae", sea: "#3a5a6e", hills: "#5a6a6a" },
  grey: { top: "#8a96a4", mid: "#b4bec8", bottom: "#d8dee4", sea: "#4a6e86", hills: "#7a8a7a" },
};

/** Sky + far hills + open sea (Monterey Bay style coast when `coast`). Horizon at y=horizon. */
export const CoastSet: React.FC<{ horizon?: number; mood?: Mood; coast?: boolean; children?: React.ReactNode }> = ({ horizon = -120, mood = "day", coast = true, children }) => {
  const m = SKIES[mood];
  const frame = useCurrentFrame();
  const drift = frame * 0.3;
  return (
    <>
      <X z={-41}>
        <Sky w={6000} h={3600} y={horizon + 1700} top={m.top} mid={m.mid} bottom={m.bottom} />
        {mood === "dusk" || mood === "dawn" ? <Sun x={700} y={horizon + 160} r={120} glow={0.9} /> : null}
        <Cloud x={-1300 + drift * 0.6} y={horizon + 620} w={420} seed={11} color={mood === "storm" ? "#7a8290" : undefined} />
        <Cloud x={500 + drift} y={horizon + 780} w={520} seed={3} color={mood === "storm" ? "#7a8290" : undefined} />
        <Cloud x={1500 + drift * 0.8} y={horizon + 560} w={300} seed={8} color={mood === "storm" ? "#6a7280" : undefined} />
      </X>
      {coast ? (
        <>
          <Mountains w={6000} y={horizon + 4} color={mixHex(m.hills, m.bottom, 0.4)} outline={4} peaks={[[-2400, 230], [-1500, 330], [-700, 210], [-100, 280], [700, 190], [1500, 300], [2300, 220]]} z={-39} />
          <Hill w={3600} h={180} x={-1300} y={horizon} color={m.hills} seed={4} z={-38} />
          <Hill w={3000} h={140} x={1500} y={horizon} color={shadeHex(m.hills, 0.06)} seed={9} z={-37.5} />
        </>
      ) : null}
      <Sea w={6000} h={2600} y={horizon} color={m.sea} z={-30} />
      {children}
      {m.wash ? <Wash width={6000} height={4000} color={m.wash[0]} alpha={m.wash[1]} z={39} /> : null}
    </>
  );
};

/** Underwater set with sensible defaults. */
export const DeepSet: React.FC<{ depth?: number; surfaceY?: number | null; rays?: number; seabedY?: number | null; tint?: string; children?: React.ReactNode }> = ({
  depth = 0.3,
  surfaceY = null,
  rays = 1,
  seabedY = null,
  tint,
  children,
}) => (
  <>
    <Underwater depth={depth} surfaceY={surfaceY} rays={rays} seabedY={seabedY} tint={tint} z={-40} />
    {children}
  </>
);

/** Warm Eocene riverbank (Pakistan, 50 million years ago): palms, ferns, a slow river. */
export const Riverbank: React.FC<{ horizon?: number; river?: boolean; children?: React.ReactNode }> = ({ horizon = -160, river = true, children }) => {
  const frame = useCurrentFrame();
  return (
    <>
      <X z={-41}>
        <Sky w={6000} h={3600} y={horizon + 1700} top="#7ab8d8" mid="#cfe2c8" bottom="#f4e2b0" />
        <Sun x={-800} y={horizon + 700} r={90} glow={0.7} />
        <Cloud x={-200 + frame * 0.25} y={horizon + 650} w={460} seed={5} />
      </X>
      <Mountains w={6000} y={horizon + 4} color="#a8b88a" outline={4} peaks={[[-2200, 200], [-1300, 280], [-400, 180], [500, 260], [1500, 200]]} z={-39} />
      {[-1700, -1250, 1300, 1750].map((x, i) => (
        <PalmTree key={x} x={x} y={horizon - 10} h={520 + (i % 2) * 120} lean={i < 2 ? 0.12 : -0.1} seed={i + 3} z={-36} />
      ))}
      <Ground w={6000} h={2200} y={horizon} color="#9aa65a" far="#b0b468" pebbles={6} tufts={18} tuftColor="#6a7a3a" seed={7} z={-32} />
      {river ? (
        <X y={horizon - 330} z={-31}>
          <Part shape={blob([[-3000, 120], [-1200, 150], [0, 110], [1400, 160], [3000, 120], [3000, -200], [1200, -170], [0, -210], [-1500, -180], [-3000, -200]], 6)} color="#5a9ec0" shade={0.15} />
          {Array.from({ length: 16 }, (_, i) => {
            const x = -2600 + i * 340 + ((frame * 1.2) % 340);
            return <Line key={i} pts={[[x, -40 + (i % 3) * 50], [x + 90, -40 + (i % 3) * 50]]} width={6} color="#cfeaf4" opacity={0.6} z={0.01} />;
          })}
          <Part shape={roundRect(6000, 40, 0)} color="#7a8a4a" flat outline={5} y={140} z={0.02} />
        </X>
      ) : null}
      {[-1500, -900, 900, 1450].map((x, i) => (
        <Bush key={x} x={x} y={horizon - 20} w={300} color={i % 2 ? "#5a8a3a" : "#6a9a3a"} seed={i + 9} z={-30} />
      ))}
      {children}
    </>
  );
};

/** Indoor basketball gym (side view): wall, bleachers, ceiling lights, the court. Floor at y=floor. */
export const GymSet: React.FC<{ floor?: number; len?: number; children?: React.ReactNode }> = ({ floor = -380, len = 2800, children }) => (
  <>
    <Gradient w={6000} h={3600} stops={[[0, "#c8d0d8"], [1, "#e8e2d4"]]} z={-41} />
    <Part shape={roundRect(6000, 300, 0)} color="#3a6ab0" flat outline={6} y={floor + 150} z={-40} />
    {[0, 1, 2].map((r) => (
      <Part key={r} shape={roundRect(6000, 70, 0)} color={["#8a96a4", "#9aa6b4", "#aab4c0"][r]} shade={0.12} y={floor + 330 + r * 70} z={-39.9 + r * 0.01} />
    ))}
    <WallLights xs={[-1400, -500, 400, 1300]} color="#fff6dc" alpha={0.18} ry={420} y={floor + 1200} z={-39} />
    <Floorboards w={6000} h={900} y={floor} color="#c89858" z={-35} />
    <CourtSide y={floor} len={len} z={-34} />
    {children}
  </>
);

/** A hanging whale skeleton (museum display), facing right, ~1600 wide. */
export const WhaleSkeleton: React.FC<{ x?: number; y?: number; z?: number; s?: number }> = ({ x = 0, y = 0, z = 0, s = 1 }) => (
  <X x={x} y={y} z={z} s={s}>
    <InkLine pts={[[-700, 0], [-300, 40], [100, 50], [500, 30], [700, 0]]} smooth width={24} color="#f6eed8" outline={6} />
    {Array.from({ length: 13 }, (_, i) => {
      const xx = -250 + i * 55;
      const hh = 90 + Math.sin((i / 12) * Math.PI) * 70;
      return <InkLine key={i} pts={[[xx, 44], [xx + 20, -hh * 0.5], [xx - 10, -hh]]} smooth width={12} color="#f6eed8" outline={5} z={-0.001} />;
    })}
    <Part shape={blob([[700, 0], [960, 30], [1040, 10], [960, -20], [720, -40]], 6)} color="#efe4c8" shade={0.15} z={0.002} />
    <Part shape={blob([[-700, 0], [-820, 60], [-860, 40], [-820, -50], [-860, -70]], 4)} color="#efe4c8" shade={0.15} z={0.002} />
    {[-400, 200, 600].map((xx) => (
      <Line key={xx} pts={[[xx, 40], [xx, 900]]} width={4} color="#5a5458" z={-0.01} />
    ))}
  </X>
);

/** Natural history museum hall: warm walls, arches, skeleton overhead, wooden floor. Floor at y=floor. */
export const MuseumSet: React.FC<{ floor?: number; skeleton?: boolean; children?: React.ReactNode }> = ({ floor = -420, skeleton = true, children }) => (
  <>
    <Gradient w={6000} h={3600} stops={[[0, "#e8d6b4"], [1, "#d4bc92"]]} z={-41} />
    {[-1500, -500, 500, 1500].map((x) => (
      <X key={x} x={x} y={floor} z={-40}>
        <Part shape={roundRect(140, 1500, 10)} color="#efe2c4" shade={0.18} y={750} />
        <Part shape={roundRect(200, 60, 8)} color="#e2d2b0" shade={0.15} y={1490} z={0.001} />
      </X>
    ))}
    {[-1000, 0, 1000].map((x) => (
      <X key={x} x={x} y={floor + 500} z={-40.5}>
        <Part shape={roundRect(640, 820, 300)} color="#c8b08a" flat outline={6} y={260} />
        <Gradient w={560} h={700} y={250} stops={[[0, "#9fc8e0"], [1, "#e8f2f6"]]} z={0.001} />
      </X>
    ))}
    <Wainscot w={6000} h={260} wall="#d4bc92" y={floor + 130} z={-39} />
    <WallLights xs={[-1000, 0, 1000]} color="#fff1c8" alpha={0.2} ry={500} y={floor + 1100} z={-38.8} />
    {skeleton ? <WhaleSkeleton x={0} y={floor + 1250} s={1.1} z={-38} /> : null}
    <Floorboards w={6000} h={900} y={floor} color="#8a5a32" z={-35} />
    <DustMotes x={-400} y={floor + 800} w={1400} h={700} n={18} z={-20} />
    {children}
  </>
);

/** Lab / office with a window, shelves and a desk. Floor at y=floor. */
export const LabSet: React.FC<{ floor?: number; night?: boolean; desk?: boolean; children?: React.ReactNode }> = ({ floor = -420, night = false, desk = true, children }) => (
  <>
    <Gradient w={6000} h={3600} stops={[[0, "#d8e2e4"], [1, "#c4d0d4"]]} z={-41} />
    <Window x={-700} y={floor + 820} w={620} h={560} night={night} z={-40} />
    <Bookshelf x={800} y={floor + 380} z={-40} />
    <HangingLamp x={60} y={floor + 1300} cord={200} z={-39} />
    <Wainscot w={6000} h={240} wall="#c4d0d4" y={floor + 120} z={-39.5} />
    <Floorboards w={6000} h={900} y={floor} color="#7a5a3c" z={-35} />
    <PottedPlant x={-1250} y={floor} h={460} z={-34} />
    {desk ? <Desk x={60} y={floor} w={900} z={-20} /> : null}
    {children}
  </>
);

/** Press conference (2023): blue backdrop with whale emblems, lectern with mics, camera flashes. */
export const PressSet: React.FC<{ floor?: number; children?: React.ReactNode }> = ({ floor = -440, children }) => (
  <>
    <Gradient w={6000} h={3600} stops={[[0, "#2a4a7a"], [1, "#1a2e52"]]} z={-41} />
    {Array.from({ length: 30 }, (_, i) => (
      <X key={i} x={-2100 + (i % 10) * 460} y={floor + 300 + Math.floor(i / 10) * 330} z={-40}>
        <BlueWhale len={180} color="#4a6a9a" eye="closed" />
      </X>
    ))}
    <Floorboards w={6000} h={900} y={floor} color="#5a4030" z={-35} />
    {children}
  </>
);

/** Lectern with microphones (for press shots). Origin = floor. */
export const PressLectern: React.FC<{ x?: number; y?: number; z?: number; s?: number }> = ({ x = 0, y = 0, z = 0, s = 1 }) => (
  <X x={x} y={y} z={z} s={s}>
    <Lectern y={0} />
    <Mic x={-40} y={420} rot={0.3} z={0.01} />
    <Mic x={40} y={420} rot={-0.3} z={0.01} />
  </X>
);

/** Rocky Newfoundland beach under a grey sky. Shore line at y=shore. */
export const BeachSet: React.FC<{ shore?: number; children?: React.ReactNode }> = ({ shore = -200, children }) => {
  const r = rng(8);
  return (
    <>
      <X z={-41}>
        <Sky w={6000} h={3600} y={shore + 1900} top="#8a96a4" mid="#b4bec8" bottom="#d8dee4" />
        <Cloud x={-900} y={shore + 900} w={600} seed={2} color="#b8c0ca" />
        <Cloud x={800} y={shore + 1000} w={520} seed={6} color="#aab2bc" />
      </X>
      <Mountains w={6000} y={shore + 200} color="#6a7a6a" outline={4} peaks={[[-2400, 520], [-1700, 640], [-1100, 400], [-600, 260]]} z={-39} />
      <Sea w={6000} h={2400} y={shore + 200} color="#4a6e86" z={-38} />
      <Part shape={blob([[-3000, 120], [-1000, 60], [500, 100], [3000, 40], [3000, -2000], [-3000, -2000]], 6)} color="#a8a094" shade={0.1} y={shore} z={-30} />
      {Array.from({ length: 60 }, (_, i) => (
        <Part key={i} shape={ellipse(14 + r() * 22, 9 + r() * 12)} color={["#8a8478", "#9a9488", "#b8b2a6", "#78726a"][i % 4]} flat outline={3} x={(r() - 0.5) * 4400} y={shore - 40 - r() * 900} z={-29.9 + i * 0.0001} />
      ))}
      {children}
    </>
  );
};

/** Diagram paper (soft blue-grey with painted blotches). */
const BLOTCHES: [number, number, number, number, number][] = [
  [-1500, 700, 520, 300, 0.08], [-600, 900, 380, 220, 0.06], [400, 760, 600, 260, 0.07], [1400, 500, 460, 320, 0.07],
  [-1200, -200, 420, 260, 0.06], [-100, -60, 700, 300, 0.05], [1100, -380, 520, 280, 0.07], [-700, -800, 600, 260, 0.07],
];
export const Paper: React.FC<{ color?: string; blotch?: string; children?: React.ReactNode }> = ({ color = "#dfe8ea", blotch = "#a8bcc4", children }) => (
  <>
    <Gradient w={4400} h={2600} stops={[[0, mixHex(color, "#ffffff", 0.35)], [1, color]]} z={-41} />
    {BLOTCHES.map(([x, y, rx, ry, a], i) => (
      <Part key={i} shape={ellipse(rx, ry)} color={blotch} flat outline={0} opacity={a} x={x} y={y} z={-40.9} />
    ))}
    {children}
  </>
);

/** Wooden-framed rule board (write on it with pinned Labels). Origin = centre. */
export const RuleBoard: React.FC<{ x?: number; y?: number; z?: number; w?: number; h?: number; s?: number; glow?: number }> = ({ x = 0, y = 0, z = 0, w = 1300, h = 760, s = 1, glow = 0 }) => (
  <X x={x} y={y} z={z} s={s}>
    {glow > 0 ? <Glow rx={w * 0.7} ry={h * 0.7} color="#fff1a8" alpha={0.35 * glow} additive z={-0.02} /> : null}
    <Part shape={roundRect(w + 70, h + 70, 26)} color="#8a5a32" shade={0.2} />
    <Part shape={roundRect(w, h, 14)} color="#f6f0de" flat outline={5} z={0.001} />
    {[-1, 1].map((sd) => (
      <Part key={sd} shape={circle(16)} color="#c8362f" shade={0.2} x={sd * (w / 2 - 40)} y={h / 2 - 40} z={0.002} />
    ))}
  </X>
);

/** Bold timeline bar with an arrow head (time runs left → right), drawn to k. Ticks at fractions. */
export const TimeBar: React.FC<{ x?: number; y?: number; z?: number; w?: number; k?: number; ticks?: number[]; color?: string }> = ({ x = 0, y = 0, z = 0, w = 1600, k = 1, ticks = [], color = "#2f5f9a" }) => {
  const L = w * Math.max(0.02, Math.min(1, k));
  return (
    <X x={x} y={y} z={z}>
      <Part shape={roundRect(L, 30, 15)} color={color} shade={0.15} x={-w / 2 + L / 2} />
      <Part shape={poly([[-w / 2 + L + 50, 0], [-w / 2 + L - 6, 44], [-w / 2 + L - 6, -44]])} color={color} shade={0.15} z={0.001} />
      {ticks
        .filter((t) => t <= k)
        .map((t, i) => (
          <Part key={i} shape={roundRect(18, 80, 9)} color={color} shade={0.15} x={-w / 2 + t * w} z={0.002} />
        ))}
    </X>
  );
};

/** First-place podium block. Top at y=0 + h. */
export const Podium: React.FC<{ x?: number; y?: number; z?: number; w?: number; h?: number; color?: string }> = ({ x = 0, y = 0, z = 0, w = 700, h = 300, color = "#e9ba41" }) => (
  <X x={x} y={y} z={z}>
    <Part shape={roundRect(w, h, 16)} color={color} shade={0.2} y={h / 2} />
    <Part shape={circle(70)} color="#f6f0de" flat outline={5} y={h / 2} z={0.001} />
  </X>
);

/** Stack of poker chips. */
export const Chips: React.FC<{ x?: number; y?: number; z?: number; n?: number; color?: string; s?: number }> = ({ x = 0, y = 0, z = 0, n = 6, color = "#c8362f", s = 1 }) => (
  <X x={x} y={y} z={z} s={s}>
    {Array.from({ length: n }, (_, i) => (
      <Part key={i} shape={roundRect(160, 34, 14)} color={i % 2 ? color : shadeHex(color, -0.08)} shade={0.18} y={i * 30} z={i * 0.001}>
        {[-50, 0, 50].map((xx) => (
          <Part key={xx} shape={roundRect(18, 20, 4)} color="#f6f0de" flat outline={0} x={xx} z={0.001} />
        ))}
      </Part>
    ))}
  </X>
);

/** Big pointing finger with a fingernail (white glove-skin), pointing +x. */
export const Finger: React.FC<{ x?: number; y?: number; z?: number; s?: number; rot?: number; nailGlow?: number }> = ({ x = 0, y = 0, z = 0, s = 1, rot = 0, nailGlow = 0 }) => (
  <X x={x} y={y} z={z} s={s} rot={rot}>
    <Part shape={roundRect(520, 150, 75)} color="#f6f5f8" shade={0.22} />
    <Line pts={[[-60, -40], [-40, 0], [-60, 40]]} smooth width={6} color="#bdb6c4" z={0.001} />
    <Line pts={[[90, -50], [110, 0], [90, 50]]} smooth width={6} color="#bdb6c4" z={0.001} />
    {nailGlow > 0 ? <Glow rx={150} color="#ffd84a" alpha={0.5 * nailGlow} additive x={200} y={20} z={0.002} /> : null}
    <Part shape={roundRect(120, 90, 40)} color="#f4c8c8" shade={0.15} x={200} y={18} z={0.003} />
  </X>
);

export const spark = (frame: number, at: number) => Math.max(0, 1 - Math.abs(frame - at) / 6);
