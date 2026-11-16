import React from "react";
import { useCurrentFrame } from "remotion";
import { Part, Line } from "../Part";
import { X, type XProps } from "../context";
import { Glow, Gradient } from "../effects";
import { blob, circle, ellipse, poly, roundPoly, roundRect } from "../shapes";
import { palette, shadeHex } from "../style";
import { rng } from "../random";
import { NationFlag, type FlagKind } from "./landers";
import { FieldGun } from "./empire";

// Buildings and places of Europe around 1800: Paris townhouses with mansard
// roofs, a church front, the Tuileries palace, a hill fort, Moscow's onion
// domes and Kremlin wall, a Gothic nave (Notre-Dame), island profiles
// (Elba, Saint Helena), a Russian log hut and bare winter trees.

/** Paris townhouse: stone front, tall shuttered windows, iron balconies, slate mansard with dormers. Origin = ground centre. */
export const ParisHouse: React.FC<XProps & { w?: number; floors?: number; wall?: string; roof?: string; shutters?: string; lit?: boolean; shop?: string | null }> = ({
  w = 320,
  floors = 3,
  wall = "#efe2c4",
  roof = "#5f6a80",
  shutters = "#4f6f8a",
  lit = false,
  shop = null,
  ...xf
}) => {
  const fh = 150;
  const H = floors * fh + 40;
  const cols = Math.max(2, Math.round(w / 110));
  const cw = w / cols;
  const glass = lit ? "#ffd98a" : "#8fb0c8";
  return (
    <X {...xf}>
      <Part shape={roundRect(w, H, 4)} color={wall} shade={0.18} y={H / 2} />
      <Part shape={roundRect(w + 16, 18, 4)} color={shadeHex(wall, 0.12)} flat outline={4} y={H} z={0.002} />
      <Part shape={roundRect(w + 4, 14, 3)} color={shadeHex(wall, 0.12)} flat outline={3.5} y={fh + 20} z={0.002} />
      {/* mansard roof with dormers */}
      <Part shape={roundPoly([[-w / 2 - 6, H + 8], [w / 2 + 6, H + 8], [w / 2 - 30, H + 150], [-w / 2 + 30, H + 150]], [4, 4, 10, 10])} color={roof} shade={0.22} z={-0.001} />
      {Array.from({ length: cols }, (_, i) => (
        <X key={`d${i}`} x={-w / 2 + cw * (i + 0.5)} y={H + 70} z={0.001}>
          <Part shape={roundPoly([[-24, -30], [24, -30], [24, 30], [0, 52], [-24, 30]], 4)} color={shadeHex(wall, 0.05)} shade={0.2} />
          <Part shape={roundRect(26, 40, 3)} color={glass} flat outline={3} y={-2} z={0.001} />
        </X>
      ))}
      {Array.from({ length: 2 }, (_, i) => (
        <Part key={`c${i}`} shape={roundRect(26, 70, 4)} color="#b86a4a" shade={0.2} x={(i ? 1 : -1) * w * 0.32} y={H + 170} z={-0.002} />
      ))}
      {/* windows per floor */}
      {Array.from({ length: floors }, (_, f) =>
        Array.from({ length: cols }, (_, i) => {
          const x = -w / 2 + cw * (i + 0.5);
          const y = 40 + f * fh + fh / 2;
          if (f === 0 && shop && i === Math.floor(cols / 2)) return null;
          return (
            <X key={`w${f}${i}`} x={x} y={y} z={0.003}>
              <Part shape={roundRect(44, 92, 4)} color={glass} flat outline={4} />
              <Line pts={[[0, -46], [0, 46]]} width={3} z={0.001} />
              <Line pts={[[-22, 12], [22, 12]]} width={3} z={0.001} />
              {[-1, 1].map((k) => (
                <Part key={k} shape={roundRect(18, 92, 3)} color={shutters} flat outline={3.5} x={k * 33} z={0.001} />
              ))}
              <Part shape={roundRect(58, 10, 3)} color={shadeHex(wall, 0.15)} flat outline={3} y={52} z={0.002} />
              {f === 1 ? (
                <X y={-44} z={0.004}>
                  <Part shape={roundRect(70, 8, 3)} color="#2a2a30" flat outline={0} />
                  {[-28, -14, 0, 14, 28].map((bx) => (
                    <Line key={bx} pts={[[bx, 0], [bx, 26]]} width={3} color="#2a2a30" />
                  ))}
                  <Part shape={roundRect(70, 6, 3)} color="#2a2a30" flat outline={0} y={26} />
                </X>
              ) : null}
            </X>
          );
        }),
      )}
      {/* door or shop front */}
      {shop ? (
        <X x={-w / 2 + cw * (Math.floor(cols / 2) + 0.5)} y={86} z={0.004}>
          <Part shape={roundRect(cw * 0.9, 120, 6)} color={shop} shade={0.2} />
          <Part shape={roundRect(cw * 0.7, 70, 4)} color={glass} flat outline={3.5} y={-10} z={0.001} />
        </X>
      ) : (
        <X x={0} y={60} z={0.004}>
          <Part shape={roundPoly([[-34, -60], [34, -60], [34, 40], [0, 60], [-34, 40]], 6)} color="#5a3a2a" shade={0.2} />
          <Line pts={[[0, -58], [0, 50]]} width={3} z={0.001} />
        </X>
      )}
    </X>
  );
};

/** Classical church front (Saint-Roch, Paris): steps, paired columns, pediment, upper order, cross. Origin = ground centre. */
export const ChurchFacade: React.FC<XProps & { w?: number; stone?: string }> = ({ w = 760, stone = "#e9dcbc", ...xf }) => {
  const dark = shadeHex(stone, 0.18);
  return (
    <X {...xf}>
      {[0, 1, 2].map((i) => (
        <Part key={`s${i}`} shape={roundRect(w + 120 - i * 40, 28, 3)} color={shadeHex(stone, 0.08 * i)} shade={0.15} y={14 + i * 26} z={0.01 * i} />
      ))}
      <Part shape={roundRect(w, 520, 4)} color={stone} shade={0.18} y={78 + 260} z={-0.01} />
      {[-0.42, -0.3, 0.3, 0.42, -0.12, 0.12].map((fx, i) => (
        <X key={`c${i}`} x={fx * w} y={78} z={0.02}>
          <Part shape={roundRect(44, 420, 8)} color={shadeHex(stone, -0.05)} shade={0.22} y={210} />
          <Part shape={roundRect(64, 26, 4)} color={dark} flat outline={3.5} y={430} z={0.001} />
          <Part shape={roundRect(60, 20, 4)} color={dark} flat outline={3.5} y={8} z={0.001} />
        </X>
      ))}
      <Part shape={roundRect(w + 20, 40, 4)} color={dark} shade={0.18} y={78 + 450} z={0.03} />
      <Part shape={poly([[-w / 2 - 10, 78 + 470], [w / 2 + 10, 78 + 470], [0, 78 + 640]])} color={stone} shade={0.2} z={0.02} />
      <Line pts={[[-w / 2 + 40, 78 + 490], [w / 2 - 40, 78 + 490], [0, 78 + 610], [-w / 2 + 40, 78 + 490]]} width={4} color={dark} z={0.025} />
      <X y={78 + 140} z={0.015}>
        <Part shape={roundPoly([[-70, -140], [70, -140], [70, 80], [0, 130], [-70, 80]], 10)} color="#5a3a2a" shade={0.2} />
        <Line pts={[[0, -138], [0, 110]]} width={4} z={0.001} />
      </X>
      <X y={78 + 680} z={0.03}>
        <Part shape={roundRect(16, 110, 4)} color={palette.gold} flat outline={3.5} y={50} />
        <Part shape={roundRect(70, 16, 4)} color={palette.gold} flat outline={3.5} y={70} z={0.001} />
      </X>
    </X>
  );
};

/** The Tuileries palace: long classical front, domed central pavilion, flag. Origin = ground centre. */
export const Palace: React.FC<XProps & { w?: number; stone?: string; roof?: string; flag?: FlagKind | null; lit?: boolean }> = ({ w = 2600, stone = "#efe4c8", roof = "#5f6a80", flag = "france", lit = false, ...xf }) => {
  const H = 420;
  const n = Math.floor(w / 120);
  const glass = lit ? "#ffd98a" : "#8fb0c8";
  return (
    <X {...xf}>
      <Part shape={roundRect(w, H, 4)} color={stone} shade={0.18} y={H / 2} />
      <Part shape={roundPoly([[-w / 2, H], [w / 2, H], [w / 2 - 60, H + 120], [-w / 2 + 60, H + 120]], 8)} color={roof} shade={0.22} z={-0.001} />
      <Part shape={roundRect(w + 20, 20, 4)} color={shadeHex(stone, 0.14)} flat outline={4} y={H} z={0.002} />
      {Array.from({ length: n }, (_, i) =>
        [0, 1].map((f) => (
          <X key={`w${i}${f}`} x={-w / 2 + (i + 0.5) * (w / n)} y={110 + f * 180} z={0.003}>
            <Part shape={roundPoly([[-26, -60], [26, -60], [26, 50], [0, 66], [-26, 50]], 4)} color={glass} flat outline={4} />
            <Line pts={[[0, -58], [0, 56]]} width={3} z={0.001} />
          </X>
        )),
      )}
      {/* central pavilion with dome */}
      <X z={0.01}>
        <Part shape={roundRect(420, H + 120, 4)} color={shadeHex(stone, -0.04)} shade={0.2} y={(H + 120) / 2} />
        {[-150, -75, 75, 150].map((cx) => (
          <Part key={cx} shape={roundRect(34, H, 8)} color={shadeHex(stone, -0.08)} shade={0.22} x={cx} y={H / 2 + 20} z={0.002} />
        ))}
        <Part shape={blob([[-200, H + 120], [-170, H + 300], [-60, H + 400], [60, H + 400], [170, H + 300], [200, H + 120]], 10)} color={roof} shade={0.25} z={-0.001} />
        <Part shape={roundRect(60, 80, 6)} color={roof} shade={0.2} y={H + 430} z={-0.002} />
        <X y={H + 140} z={0.004}>
          <Part shape={circle(56)} color="#f6f2ea" flat outline={5} />
          <Line pts={[[0, 0], [0, 36]]} width={5} />
          <Line pts={[[0, 0], [26, 0]]} width={5} />
        </X>
        {flag ? <NationFlag kind={flag} w={180} pole={220} y={H + 460} z={0.005} /> : null}
      </X>
    </X>
  );
};

/** Earthwork-and-stone fort on a hill with gun embrasures, guns and a flag. Origin = ground centre. */
export const HillFort: React.FC<XProps & { w?: number; h?: number; flag?: FlagKind | null; guns?: number; fire?: number; hill?: string }> = ({ w = 1400, h = 420, flag = "uk", guns = 2, fire = 0, hill = "#8a9a5a", ...xf }) => (
  <X {...xf}>
    <Part shape={blob([[-w * 0.75, 0], [-w * 0.5, h * 0.55], [-w * 0.2, h * 0.92], [w * 0.2, h * 0.95], [w * 0.5, h * 0.6], [w * 0.75, 0]], 10)} color={hill} shade={0.22} z={-0.02} />
    <Part shape={roundPoly([[-w * 0.32, h * 0.85], [w * 0.32, h * 0.88], [w * 0.28, h * 1.25], [-w * 0.28, h * 1.22]], 10)} color="#c9b894" shade={0.22} />
    {Array.from({ length: 7 }, (_, i) => (
      <Part key={i} shape={roundRect(w * 0.06, 50, 6)} color="#c9b894" shade={0.2} x={-w * 0.27 + i * w * 0.09} y={h * 1.27} z={0.002} />
    ))}
    {Array.from({ length: 4 }, (_, i) => (
      <Line key={`l${i}`} pts={[[-w * 0.3, h * (0.95 + i * 0.08)], [w * 0.3, h * (0.97 + i * 0.08)]]} width={3} color={shadeHex("#c9b894", 0.25)} z={0.001} />
    ))}
    {Array.from({ length: guns }, (_, i) => (
      <FieldGun key={`g${i}`} x={-w * 0.12 + i * w * 0.2} y={h * 1.18} s={0.45} rot={-0.06} fire={fire > 0 ? (fire + i * 0.2) % 1 : 0} z={0.003} />
    ))}
    {flag ? <NationFlag kind={flag} w={170} pole={300} x={w * 0.24} y={h * 1.25} z={0.004} /> : null}
  </X>
);

/** Moscow church: white walls, onion domes with crosses. Origin = ground centre. */
export const OnionChurch: React.FC<XProps & { w?: number; dome?: string; dome2?: string; burn?: number }> = ({ w = 520, dome = "#e2b23c", dome2 = "#4f9a7a", ...xf }) => {
  const wall = "#f2ede4";
  const onion = (x: number, y: number, r: number, c: string, i: number) => (
    <X key={i} x={x} y={y}>
      <Part shape={roundRect(r * 1.1, r * 1.3, 6)} color={wall} shade={0.2} y={-r * 0.2} />
      <Part shape={blob([[-r * 0.6, r * 0.4], [-r * 0.75, r * 1.0], [-r * 0.3, r * 1.6], [0, r * 2.05], [r * 0.3, r * 1.6], [r * 0.75, r * 1.0], [r * 0.6, r * 0.4]], 10)} color={c} shade={0.28} z={0.001} />
      <X y={r * 2.1} z={0.002}>
        <Part shape={roundRect(8, 60, 3)} color={palette.gold} flat outline={3} y={30} />
        <Part shape={roundRect(34, 7, 3)} color={palette.gold} flat outline={2.5} y={42} z={0.001} />
      </X>
    </X>
  );
  return (
    <X {...xf}>
      <Part shape={roundRect(w, 360, 6)} color={wall} shade={0.2} y={180} />
      {[-0.3, 0, 0.3].map((fx, i) => (
        <Part key={`a${i}`} shape={roundPoly([[-34, 0], [34, 0], [34, 120], [0, 160], [-34, 120]], 8)} color="#7a8aa8" flat outline={4} x={fx * w} y={90} z={0.002} />
      ))}
      <Part shape={roundRect(w + 20, 22, 4)} color={shadeHex(wall, 0.15)} flat outline={4} y={360} z={0.002} />
      {onion(0, 470, 110, dome, 0)}
      {onion(-w * 0.36, 400, 64, dome2, 1)}
      {onion(w * 0.36, 400, 64, dome2, 2)}
    </X>
  );
};

/** Kremlin wall: red brick, swallow-tail merlons, towers with green tent roofs. Origin = ground centre. */
export const KremlinWall: React.FC<XProps & { w?: number; towers?: number }> = ({ w = 2400, towers = 3, ...xf }) => {
  const brick = "#b5402f";
  const H = 300;
  const n = Math.floor(w / 70);
  return (
    <X {...xf}>
      <Part shape={roundRect(w, H, 4)} color={brick} shade={0.2} y={H / 2} />
      {Array.from({ length: n }, (_, i) => (
        <Part key={i} shape={poly([[-22, 0], [22, 0], [22, 46], [8, 30], [0, 46], [-8, 30], [-22, 46]])} color={brick} shade={0.2} x={-w / 2 + 35 + i * 70} y={H} z={0.001} />
      ))}
      {Array.from({ length: 6 }, (_, r) => (
        <Line key={`b${r}`} pts={[[-w / 2, 40 + r * 44], [w / 2, 40 + r * 44]]} width={3} color={shadeHex(brick, 0.25)} z={0.0005} />
      ))}
      {Array.from({ length: towers }, (_, i) => {
        const x = -w / 2 + ((i + 0.5) / towers) * w;
        return (
          <X key={`t${i}`} x={x} z={0.01}>
            <Part shape={roundRect(200, 560, 6)} color={shadeHex(brick, -0.04)} shade={0.22} y={280} />
            <Part shape={roundRect(150, 140, 6)} color={brick} shade={0.22} y={630} z={0.001} />
            <Part shape={poly([[-90, 700], [90, 700], [0, 960]])} color="#3f8a5a" shade={0.25} z={0.002} />
            <Part shape={circle(16)} color={palette.gold} flat outline={3.5} y={980} z={0.003} />
            <Part shape={roundPoly([[-30, 140], [30, 140], [30, 260], [0, 290], [-30, 260]], 6)} color="#3a2a2a" flat outline={4} y={0} z={0.002} />
            <Part shape={roundRect(40, 60, 4)} color="#3a2a2a" flat outline={3.5} y={500} z={0.002} />
          </X>
        );
      })}
    </X>
  );
};

/** Gothic nave (Notre-Dame): pointed arches, rose window, columns, altar steps, red carpet, candles. Fills w×h around the origin. */
export const GothicNave: React.FC<XProps & { w?: number; h?: number; floor?: number; glow?: number }> = ({ w = 2600, h = 1500, floor = -420, glow = 1, ...xf }) => {
  const frame = useCurrentFrame();
  const stone = "#c9c0b0";
  const deep = "#8a8090";
  return (
    <X {...xf}>
      <Gradient w={w} h={h} stops={[[0, "#5a5068"], [0.5, "#8a7f86"], [1, "#b8aa9a"]]} z={-1} />
      {/* back wall arches */}
      {[-1, 0, 1].map((k) => (
        <X key={`a${k}`} x={k * 620} y={floor} z={-0.9}>
          <Part shape={roundPoly([[-230, 0], [230, 0], [230, 700], [0, 1050], [-230, 700]], [6, 6, 40, 6, 40])} color={deep} shade={0.2} />
          <Part shape={roundPoly([[-170, 40], [170, 40], [170, 680], [0, 960], [-170, 680]], [6, 6, 40, 6, 40])} color={k === 0 ? "#2f3f7a" : "#3a3a5a"} flat outline={5} z={0.001} />
          {k === 0 ? (
            <X y={720} z={0.002}>
              <Part shape={circle(150)} color="#2f3f7a" flat outline={6} />
              {Array.from({ length: 12 }, (_, i) => {
                const a = (i / 12) * Math.PI * 2;
                return <Part key={i} shape={ellipse(26, 60)} color={["#e2574a", "#3f8fd6", "#e2b23c", "#4fb07a"][i % 4]} flat outline={3.5} x={Math.cos(a) * 92} y={Math.sin(a) * 92} rot={a + Math.PI / 2} z={0.001} />;
              })}
              <Part shape={circle(40)} color="#e2b23c" flat outline={4} z={0.002} />
              <Glow rx={360} color="#ffe2a0" alpha={0.25 * glow} additive z={0.003} />
            </X>
          ) : (
            <X y={380} z={0.002}>
              {[0, 1, 2, 3].map((r) => (
                <Part key={r} shape={roundRect(260, 120, 4)} color={["#c84a5a", "#3f6fb6", "#d8a93a", "#4f9a6a"][(r + k + 2) % 4]} flat outline={4} y={-220 + r * 140} />
              ))}
            </X>
          )}
        </X>
      ))}
      {/* columns in front */}
      {[-1, 1].map((k) => (
        <X key={`c${k}`} x={k * (w / 2 - 160)} y={floor} z={0.5}>
          <Part shape={roundRect(170, 1600, 10)} color={stone} shade={0.24} y={800} />
          {[-50, 0, 50].map((lx) => (
            <Line key={lx} pts={[[lx, 40], [lx, 1500]]} width={4} color={shadeHex(stone, 0.25)} z={0.001} />
          ))}
          <Part shape={roundRect(220, 60, 8)} color={shadeHex(stone, 0.1)} shade={0.2} y={30} z={0.002} />
        </X>
      ))}
      {/* floor, carpet, altar steps */}
      <Part shape={roundRect(w, 600, 0)} color="#9a8a78" flat outline={0} y={floor - 300} z={-0.5} />
      <Part shape={poly([[-170, floor + 4], [170, floor + 4], [460, floor - 620], [-460, floor - 620]])} color="#b8262f" flat outline={5} z={-0.45} />
      {[0, 1, 2].map((i) => (
        <Part key={`st${i}`} shape={roundRect(1200 - i * 200, 40, 4)} color={shadeHex(stone, 0.06 * i)} shade={0.15} y={floor + 20 + i * 36} z={-0.4 + i * 0.01} />
      ))}
      {/* candles */}
      {[-560, -440, 440, 560].map((cx, i) => (
        <X key={`cd${i}`} x={cx} y={floor + 120} z={-0.3}>
          <Part shape={roundRect(16, 140, 4)} color={palette.gold} flat outline={3.5} y={70} />
          <Part shape={roundRect(18, 60, 5)} color="#f4efe4" shade={0.15} y={170} z={0.001} />
          <Part shape={blob([[0, 0], [10, 18], [0, 40 + Math.sin(frame * 0.5 + i) * 4], [-10, 18]], 6)} color="#ffd36a" flat outline={0} y={202} z={0.002} />
          <Glow rx={90} color="#ffd98a" alpha={0.5} additive y={220} z={0.003} />
        </X>
      ))}
    </X>
  );
};

/** Island seen from the sea. `kind` "helena": tall dark volcanic cliffs; "elba": green hills with a little town. Origin = waterline centre. */
export const IslandRock: React.FC<XProps & { kind?: "helena" | "elba" | "corsica"; w?: number }> = ({ kind = "helena", w = 1400, ...xf }) => {
  if (kind === "helena") {
    return (
      <X {...xf}>
        <Part shape={blob([[-w / 2, 0], [-w * 0.44, 260], [-w * 0.3, 420], [-w * 0.1, 470], [w * 0.12, 520], [w * 0.32, 430], [w * 0.45, 250], [w / 2, 0]], 10)} color="#5a4a4a" shade={0.28} />
        <Part shape={blob([[-w * 0.26, 400], [-w * 0.1, 466], [w * 0.12, 512], [w * 0.28, 440], [w * 0.1, 420], [-w * 0.1, 410]], 8)} color="#6a9a4a" shade={0.22} z={0.001} />
        {[-0.3, -0.1, 0.12, 0.3].map((fx, i) => (
          <Line key={i} pts={[[fx * w, 40], [fx * w + 20, 300 - i * 20]]} width={4} color="#3a2e30" z={0.002} />
        ))}
        <X x={w * 0.06} y={470} s={0.5} z={0.003}>
          <Part shape={roundRect(160, 70, 6)} color="#efe2c4" shade={0.18} y={35} />
          <Part shape={poly([[-96, 70], [96, 70], [0, 130]])} color="#8a4a3a" shade={0.2} z={0.001} />
        </X>
      </X>
    );
  }
  const green = kind === "elba" ? "#7aa65a" : "#6f9a52";
  return (
    <X {...xf}>
      <Part shape={blob([[-w / 2, 0], [-w * 0.36, 160], [-w * 0.18, 280], [0, 330], [w * 0.2, 250], [w * 0.36, 300], [w / 2, 0]], 10)} color={green} shade={0.24} />
      <Part shape={blob([[-w / 2, 0], [-w * 0.42, 60], [w * 0.42, 60], [w / 2, 0]], 6)} color="#d8c89a" shade={0.15} z={0.001} />
      {kind === "elba"
        ? [-0.2, -0.12, -0.04, 0.04].map((fx, i) => (
            <X key={i} x={fx * w} y={70 + (i % 2) * 18} s={0.42} z={0.002 + i * 0.001}>
              <Part shape={roundRect(140, 90, 6)} color={["#f2e4c4", "#efd8b0", "#f6ead0", "#ecdcb8"][i]} shade={0.18} y={45} />
              <Part shape={poly([[-84, 90], [84, 90], [0, 150]])} color="#c4653f" shade={0.2} z={0.001} />
              <Part shape={roundRect(30, 40, 4)} color="#5a7a9a" flat outline={3} y={50} z={0.002} />
            </X>
          ))
        : null}
    </X>
  );
};

/** Russian log hut (izba). Origin = ground centre. */
export const LogHut: React.FC<XProps & { w?: number; snow?: boolean; burnt?: number }> = ({ w = 360, snow = false, burnt = 0, ...xf }) => {
  const log = burnt > 0.5 ? "#3a2a26" : "#8a5a36";
  return (
    <X {...xf}>
      <Part shape={roundRect(w, 220, 6)} color={log} shade={0.22} y={110} />
      {Array.from({ length: 6 }, (_, i) => (
        <Line key={i} pts={[[-w / 2, 20 + i * 36], [w / 2, 20 + i * 36]]} width={4} color={shadeHex(log, 0.3)} z={0.001} />
      ))}
      <Part shape={poly([[-w / 2 - 30, 220], [w / 2 + 30, 220], [0, 420]])} color={burnt > 0.5 ? "#2a2226" : "#6a4a30"} shade={0.24} z={0.002} />
      {snow ? <Part shape={poly([[-w / 2 - 34, 226], [w / 2 + 34, 226], [w / 2 + 10, 250], [0, 430], [-w / 2 - 10, 250]])} color="#f4f6fb" shade={0.15} z={0.003} /> : null}
      <Part shape={roundRect(70, 70, 6)} color={burnt > 0.3 ? "#ff9a3a" : "#ffe2a0"} flat outline={4} x={-w * 0.22} y={120} z={0.004} />
      <Part shape={roundRect(70, 130, 6)} color="#4a3020" flat outline={4} x={w * 0.22} y={65} z={0.004} />
    </X>
  );
};

/** Bare winter tree. Origin = ground. */
export const DeadTree: React.FC<XProps & { h?: number; seed?: number; color?: string; snow?: boolean }> = ({ h = 520, seed = 1, color = "#4a3a34", snow = false, ...xf }) => {
  const r = rng(seed);
  const branches = Array.from({ length: 5 }, (_, i) => {
    const y = h * (0.45 + i * 0.11);
    const side = i % 2 ? 1 : -1;
    const len = h * (0.32 - i * 0.04) * (0.8 + r() * 0.4);
    return { y, side, len };
  });
  return (
    <X {...xf}>
      <Line pts={[[0, 0], [6, h * 0.5], [-4, h]]} smooth width={26} color={color} />
      {branches.map((b, i) => (
        <X key={i}>
          <Line pts={[[0, b.y], [b.side * b.len * 0.6, b.y + b.len * 0.35], [b.side * b.len, b.y + b.len * 0.6]]} smooth width={12 - i} color={color} />
          <Line pts={[[b.side * b.len * 0.6, b.y + b.len * 0.35], [b.side * b.len * 0.5, b.y + b.len * 0.75]]} width={7} color={color} />
          {snow ? <Line pts={[[b.side * b.len * 0.2, b.y + b.len * 0.14], [b.side * b.len * 0.7, b.y + b.len * 0.45]]} width={7} color="#f4f6fb" z={0.001} /> : null}
        </X>
      ))}
    </X>
  );
};

/** Corsican stone house with a tiled roof. Origin = ground centre. */
export const StoneHouse: React.FC<XProps & { w?: number; h?: number; wall?: string; roof?: string; lit?: boolean }> = ({ w = 300, h = 260, wall = "#d9c7a4", roof = "#c4653f", lit = false, ...xf }) => (
  <X {...xf}>
    <Part shape={roundRect(w, h, 6)} color={wall} shade={0.2} y={h / 2} />
    {Array.from({ length: 6 }, (_, i) => (
      <Part key={i} shape={ellipse(18 + (i % 3) * 6, 10)} color={shadeHex(wall, 0.15)} flat outline={2.5} x={-w * 0.36 + (i * 47) % (w * 0.7)} y={30 + ((i * 53) % (h - 60))} z={0.001} />
    ))}
    <Part shape={roundPoly([[-w / 2 - 24, h], [w / 2 + 24, h], [w / 2 - 10, h + 90], [-w / 2 + 10, h + 90]], 6)} color={roof} shade={0.22} z={0.002} />
    {Array.from({ length: Math.floor(w / 36) }, (_, i) => (
      <Line key={`t${i}`} pts={[[-w / 2 + 6 + i * 36, h + 6], [-w / 2 + 16 + i * 36, h + 84]]} width={3} color={shadeHex(roof, 0.3)} z={0.003} />
    ))}
    <Part shape={roundRect(54, 64, 4)} color={lit ? "#ffd98a" : "#6a8aa8"} flat outline={4} x={-w * 0.22} y={h * 0.62} z={0.004} />
    <Part shape={roundPoly([[-30, 0], [30, 0], [30, 100], [0, 116], [-30, 100]], 6)} color="#6a4430" shade={0.2} x={w * 0.2} z={0.004} />
  </X>
);
