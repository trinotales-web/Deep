import React from "react";
import { C, FONT_HAND, FONT_TITLE, INK, ip, sec, wf } from "../theme";
import { Camera, camAt, DrawOn, ellipseD, Ink, Label, Pencil, pop, Pop, Puff, Sparkle } from "../draw";
import { SceneSvg } from "../Stage";
import { MapArt, ISLAND_CENTERS, proj } from "../MapArt";

const TITLE = "Japan";

export const TitleScene: React.FC<{ f: number; subtitle?: string; doodles?: React.ReactNode }> = ({
  f,
  subtitle = "part 1 · where it all began",
  doodles,
}) => {
  const zoom = ip(f, [0, sec(3.3)], [1, 1.08]);
  return (
    <SceneSvg f={f}>
      <Camera cam={{ x: 960, y: 500, z: zoom }}>
        <Pop s={pop(f, 3, 120, 12)} x={960} y={420}>
          <Pencil d={ellipseD(960, 420, 190)} fill="#e66a43" sw={4.5} />
        </Pop>
        {TITLE.split("").map((ch, i) => {
          const s = pop(f, 10 + i * 4, 200, 10);
          const x = 760 + i * 102;
          return (
            <Pop key={i} s={s} x={x} y={500} rot={(i % 2 ? 3 : -3) * (1 - s)}>
              <text x={x} y={500} fontFamily={FONT_TITLE} fontSize={230} textAnchor="middle" fill={C.white} stroke={INK} strokeWidth={9} paintOrder="stroke" strokeLinejoin="round">
                {ch}
              </text>
            </Pop>
          );
        })}
        <Label x={960} y={650} text={subtitle} size={70} font={FONT_HAND} p={ip(f, [34, 62], [0, 1], (x) => x)} />
        {doodles ?? (
          <DefaultDoodles f={f} />
        )}
      </Camera>
    </SceneSvg>
  );
};

/** Part 1 title doodles: sea, a little sailboat and a smoking volcano. */
const DefaultDoodles: React.FC<{ f: number }> = ({ f }) => {
  return (
    <g>
        <DrawOn d="M470,760 q30,-22 60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0" p={ip(f, [18, 58], [0, 1])} sw={4} />
        <Pop s={pop(f, 40)} x={1400} y={752}>
          <Pencil d="M1330,752 C1360,740 1374,700 1380,680 L1420,680 C1426,700 1440,740 1470,752 Z" fill={C.brown} />
          <Pencil d="M1380,680 Q1400,690 1420,680" fill={C.red} sw={3} />
        </Pop>
        <Puff x={1400} y={660} p={ip(f, [46, 92], [0, 1], (x) => x)} size={30} />
        <Puff x={1408} y={640} p={ip(f, [62, 110], [0, 1], (x) => x)} size={26} seed={9} />
        <Pop s={pop(f, 46)} x={600} y={720}>
          <Pencil d="M560,724 Q600,744 640,724 L632,712 L568,712 Z" fill={C.brown} sw={3.5} />
          <Ink d="M600,712 L600,660" sw={3.5} />
          <Pencil d="M603,662 L636,700 L603,700 Z" fill={C.white} sw={3} />
        </Pop>
    </g>
  );
};

/** "Long ago, before there were any countries, Japan was just a chain of islands." */
export const MapIntro: React.FC<{ f: number; from: number }> = ({ f, from }) => {
  const japanAt = wf(7, "japan");
  const chainAt = wf(10, "a");
  const cam = camAt(f, [
    [from, { x: 880, y: 640, z: 0.8 }],
    [japanAt - 6, { x: 900, y: 630, z: 0.83 }],
    [japanAt + 32, { x: 1290, y: 668, z: 0.93 }],
    [sec(8.2), { x: 1300, y: 662, z: 0.97 }],
  ]);
  const order = [3, 0, 2, 1];
  const islandScale = [0, 1, 2, 3].map((i) => {
    const k = order.indexOf(i);
    const at = chainAt + k * 5;
    const t = f - at;
    return t < 0 || t > 18 ? 1 : 1 + 0.13 * Math.sin((t / 18) * Math.PI);
  });
  const [lx, ly] = proj(119, 42.2);
  const [jx, jy] = proj(144.2, 38.6);
  const glow = f < japanAt ? 0 : 0.5 + 0.5 * Math.sin((f - japanAt) / 6);
  return (
    <SceneSvg f={f}>
      <Camera cam={cam}>
        <MapArt
          f={f}
          draw={ip(f, [from, from + 48], [0, 1])}
          landFill={ip(f, [from + 18, from + 56], [0, 1])}
          japanGlow={glow * ip(f, [japanAt, japanAt + 10], [0, 1])}
          islandScale={islandScale}
        />
        <Label x={lx} y={ly} text="no countries yet..." size={64} font={FONT_HAND} p={ip(f, [wf(6, "countries") - 4, wf(6, "countries") + 14], [0, 1], (x) => x)} rot={-4} />
        <Pop s={pop(f, wf(6, "countries") + 6)} x={lx + 290} y={ly - 20}>
          <Ink d={`M${lx + 262},${ly - 56} l40,40 M${lx + 302},${ly - 56} l-40,40`} sw={5} color={C.red} />
        </Pop>
        <Label x={jx} y={jy} text="JAPAN" size={104} font={FONT_TITLE} color={C.red} p={ip(f, [japanAt + 6, japanAt + 20], [0, 1], (x) => x)} rot={-10} />
        {ISLAND_CENTERS.map(([x, y], i) => (
          <Sparkle key={i} x={x + 70} y={y - 60} s={ip(f, [chainAt + order.indexOf(i) * 5, chainAt + order.indexOf(i) * 5 + 8], [0, 1]) * ip(f, [chainAt + 40, chainAt + 52], [1, 0])} />
        ))}
      </Camera>
    </SceneSvg>
  );
};
