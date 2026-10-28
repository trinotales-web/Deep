import React from "react";
import { Part, Line } from "../Part";
import { X } from "../context";
import { blob, circle, ellipse, roundRect, poly } from "../shapes";
import { palette, shadeHex } from "../style";

// Authored for a head of radius 100, origin at the head center, facing +x.

export type HatKind =
  | "helmet" | "fieldcap" | "sidecap" | "officer" | "headband" | "bandana" | "hardhat"
  | "persian" | "crown" | "veil" | "wreath" | "corinthian" | "hood"
  | null;
export type HairKind = "short" | "bob" | "bun" | "sides" | "long" | "spiky" | null;

export const Hat: React.FC<{ kind: HatKind; color?: string; accent?: string; camo?: boolean }> = ({
  kind,
  color,
  accent,
  camo = false,
}) => {
  switch (kind) {
    case "helmet": {
      const c = color ?? "#5c7a3a";
      return (
        <X y={44}>
          <Part
            shape={blob([[-122, -6], [-114, 42], [-84, 94], [-34, 120], [34, 120], [84, 94], [114, 42], [122, -6], [64, -14], [0, -16], [-64, -14]], 8)}
            color={c}
            shade={0.28}
          />
          {camo
            ? [
                [[-60, 70], 24, 15, "#8d7a4c"],
                [[10, 92], 26, 13, "#3f5a2a"],
                [[60, 52], 20, 15, "#8d7a4c"],
                [[-20, 36], 22, 14, "#3f5a2a"],
                [[-86, 24], 16, 12, "#6f8a4a"],
                [[84, 14], 14, 10, "#3f5a2a"],
                [[30, 24], 15, 10, "#7a8c56"],
              ].map(([p, rx, ry, col], i) => (
                <Part
                  key={i}
                  shape={ellipse(rx as number, ry as number)}
                  color={col as string}
                  flat
                  outline={0}
                  x={(p as number[])[0]}
                  y={(p as number[])[1]}
                  rot={i * 0.7}
                  z={0.001}
                />
              ))
            : null}
          <Line pts={[[-116, 6], [-60, -2], [0, -4], [60, -2], [116, 6]]} smooth width={4} color={shadeHex(c, 0.45)} z={0.002} />
        </X>
      );
    }
    case "fieldcap": {
      const c = color ?? "#8a8455";
      return (
        <X y={44}>
          <Part shape={blob([[-104, 18], [-100, 70], [-62, 100], [0, 108], [62, 100], [100, 70], [104, 18], [0, 10]], 8)} color={c} shade={0.25} />
          <Part shape={roundRect(214, 30, 12)} color={shadeHex(c, 0.12)} y={22} z={0.001} />
          <Part shape={blob([[30, 14], [126, 2], [134, -8], [90, -6], [30, 2]], 6)} color={shadeHex(c, 0.3)} z={0.002} />
          <Part
            shape={poly(Array.from({ length: 10 }, (_, i) => {
              const a = Math.PI / 2 + (i * Math.PI) / 5;
              const r = i % 2 ? 6 : 14;
              return [Math.cos(a) * r, Math.sin(a) * r] as [number, number];
            }))}
            color={accent ?? palette.gold}
            flat
            outline={3.5}
            x={40}
            y={24}
            z={0.003}
          />
        </X>
      );
    }
    case "sidecap": {
      const c = color ?? palette.oliveLight;
      return (
        <X y={36}>
          <Part shape={blob([[-112, 20], [-108, 76], [-70, 100], [0, 112], [70, 100], [108, 76], [112, 20], [0, 14]], 8)} color={c} shade={0.25} />
          <Part shape={roundRect(222, 34, 14)} color={shadeHex(c, 0.08)} y={30} z={0.001} />
          <Part shape={circle(11)} color="#ffffff" flat outline={3.5} x={52} y={34} z={0.002}>
            <Part shape={circle(7)} color="#2f4f9a" flat outline={0} z={0.001} />
            <Part shape={circle(3.5)} color={palette.red} flat outline={0} z={0.002} />
          </Part>
        </X>
      );
    }
    case "officer": {
      const c = color ?? "#f2efe8";
      const band = accent ?? palette.navy;
      return (
        <X y={42}>
          <Part shape={blob([[-126, 70], [-104, 112], [0, 126], [116, 114], [140, 80], [104, 58], [0, 52], [-104, 58]], 8)} color={c} shade={0.25} />
          <Part shape={roundRect(208, 42, 12)} color={band} y={42} z={0.001} />
          <Line pts={[[-100, 32], [100, 32]]} width={4} color={palette.gold} z={0.002} />
          <Part shape={blob([[10, 26], [80, 20], [138, 6], [140, -6], [70, 0], [10, 8]], 6)} color="#1d1d26" z={0.003} />
          <Part shape={circle(12)} color={palette.gold} flat outline={4} x={30} y={70} z={0.004} />
        </X>
      );
    }
    case "headband":
    case "bandana": {
      const c = color ?? "#d9652b";
      return (
        <X y={14}>
          <Part shape={blob([[-104, 28], [0, 38], [104, 28], [100, 66], [0, 76], [-100, 66]], 8)} color={c} shade={0.25} />
          {kind === "bandana" ? (
            <Part shape={blob([[-100, 60], [-90, 96], [-40, 114], [40, 114], [90, 96], [100, 60], [0, 70]], 8)} color={c} shade={0.25} z={-0.001} />
          ) : null}
          <Part shape={blob([[-100, 48], [-132, 30], [-142, 8], [-118, 22], [-104, 36]], 6)} color={shadeHex(c, 0.1)} z={-0.002} />
          <Part shape={blob([[-100, 48], [-128, 64], [-150, 58], [-122, 46]], 6)} color={shadeHex(c, 0.1)} z={-0.002} />
        </X>
      );
    }
    case "hardhat": {
      const c = color ?? "#f4f1ea";
      return (
        <>
          <Part shape={blob([[-104, 20], [-96, 72], [-56, 108], [0, 118], [56, 108], [96, 72], [104, 20]], 8)} color={c} shade={0.25} />
          <Part shape={roundRect(240, 18, 9)} color={c} y={18} z={0.001} />
          <Part shape={roundRect(22, 70, 10)} color={shadeHex(c, 0.06)} y={78} z={0.002} />
        </>
      );
    }
    case "persian": {
      // tall rounded felt cap of the Persian infantry
      const c = color ?? "#e6d3a3";
      return (
        <X y={38}>
          <Part
            shape={blob([[-106, 6], [-104, 70], [-84, 128], [-40, 160], [20, 166], [70, 146], [100, 96], [106, 6], [0, -2]], 8)}
            color={c}
            shade={0.26}
          />
          <Part shape={roundRect(220, 30, 12)} color={accent ?? shadeHex(c, 0.18)} y={10} z={0.001} />
          {[-60, -20, 20, 60].map((x) => (
            <Line key={x} pts={[[x, 30], [x * 0.8, 140]]} width={3.5} color={shadeHex(c, 0.3)} z={0.0005} />
          ))}
        </X>
      );
    }
    case "crown": {
      // Achaemenid royal crown: tall crenellated gold cylinder
      const c = color ?? palette.gold;
      const top = 150;
      const pts: [number, number][] = [[-84, 20], [84, 20], [92, top - 30]];
      for (let i = 4; i >= 0; i--) {
        const x = -92 + (i + 0.5) * 36.8;
        pts.push([x + 14, top - 30], [x + 10, top], [x - 10, top], [x - 14, top - 30]);
      }
      pts.push([-92, top - 30]);
      return (
        <X y={44}>
          <Part shape={poly(pts)} color={c} shade={0.22} />
          <Part shape={roundRect(190, 24, 8)} color={shadeHex(c, 0.15)} y={30} z={0.001} />
          {[-50, 0, 50].map((x, i) => (
            <Part key={x} shape={circle(i === 1 ? 12 : 9)} color={i === 1 ? "#c0362c" : "#2f6fb0"} flat outline={4} x={x} y={80} z={0.002} />
          ))}
        </X>
      );
    }
    case "wreath": {
      const c = color ?? "#5f8f3a";
      return (
        <X y={58}>
          {Array.from({ length: 11 }, (_, i) => {
            const a = Math.PI * (0.08 + (i / 10) * 0.84);
            const x = Math.cos(a) * 104;
            const y = Math.sin(a) * 26;
            return <Part key={i} shape={ellipse(20, 9)} color={i % 2 ? c : shadeHex(c, 0.15)} x={x} y={y} rot={a - Math.PI / 2 + (x > 0 ? -0.6 : 0.6)} outline={4} shade={0.3} />;
          })}
        </X>
      );
    }
    case "veil":
    case "hood": {
      const c = color ?? (kind === "veil" ? "#7a4b8f" : "#6b5a44");
      return (
        <X y={0}>
          <Part
            shape={blob([[-112, -20], [-108, 50], [-80, 104], [-30, 124], [30, 124], [80, 104], [108, 50], [112, -20], [92, 10], [60, 58], [0, 70], [-60, 58], [-92, 10]], 8)}
            color={c}
            shade={0.24}
          />
          {accent ? <Line pts={[[-92, 10], [-60, 58], [0, 70], [60, 58], [92, 10]]} smooth width={6} color={accent} z={0.001} /> : null}
        </X>
      );
    }
    case "corinthian": {
      const c = color ?? "#c9963f";
      const crest = accent ?? "#c0362c";
      return (
        <X y={28}>
          <Part shape={blob([[-110, -40], [-112, 40], [-86, 100], [-30, 124], [30, 124], [86, 100], [112, 40], [110, -40], [84, -30], [80, 26], [0, 34], [-80, 26], [-84, -30]], 8)} color={c} shade={0.26} />
          <Part shape={blob([[-80, 120], [-50, 168], [0, 186], [50, 168], [90, 120], [40, 140], [-30, 138]], 8)} color={crest} shade={0.25} z={-0.001} />
          <Line pts={[[-96, 50], [-40, 60], [40, 60], [96, 50]]} smooth width={4} color={shadeHex(c, 0.45)} z={0.001} />
        </X>
      );
    }
    default:
      return null;
  }
};

/** Parts of headwear drawn behind the head (veils, hood backs). */
export const HatBack: React.FC<{ kind: HatKind; color?: string }> = ({ kind, color }) => {
  if (kind === "veil" || kind === "hood") {
    const c = color ?? (kind === "veil" ? "#7a4b8f" : "#6b5a44");
    return (
      <Part
        shape={blob([[-118, 40], [-128, -60], [-120, -170], [-60, -190], [60, -190], [120, -170], [128, -60], [118, 40], [60, 110], [-60, 110]], 8)}
        color={shadeHex(c, 0.12)}
        shade={0.2}
      />
    );
  }
  if (kind === "persian") {
    // cloth flap covering the neck
    const c = color ?? "#e6d3a3";
    return <Part shape={blob([[-104, 30], [-112, -60], [-90, -120], [90, -120], [112, -60], [104, 30]], 8)} color={shadeHex(c, 0.1)} shade={0.2} />;
  }
  return null;
};

/** Hair drawn behind the head (back) — long hair, buns. */
export const HairBack: React.FC<{ kind: HairKind; color: string }> = ({ kind, color }) => {
  if (kind === "bob" || kind === "long") {
    const low = kind === "long" ? -140 : -70;
    return (
      <Part
        shape={blob([[-112, 10], [-104, 80], [-50, 116], [50, 116], [104, 80], [112, 10], [110, low], [70, low - 6], [-70, low - 6], [-110, low]], 8)}
        color={color}
        shade={0.25}
      />
    );
  }
  if (kind === "bun") {
    return <Part shape={circle(38)} color={color} shade={0.3} x={-6} y={118} />;
  }
  return null;
};

/** Hair drawn on top of the head (front) — fringe, cap of hair, side tufts. */
export const HairFront: React.FC<{ kind: HairKind; color: string }> = ({ kind, color }) => {
  switch (kind) {
    case "short":
      return (
        <Part
          shape={blob([[-104, 22], [-98, 70], [-60, 100], [0, 108], [62, 100], [100, 68], [104, 24], [84, 48], [40, 62], [-12, 56], [-58, 46], [-86, 28]], 8)}
          color={color}
          shade={0.25}
        >
          <Line pts={[[-70, 60], [-30, 84], [20, 92]]} smooth width={3.5} color={shadeHex(color, 0.35)} z={0.001} />
          <Line pts={[[-40, 66], [0, 78], [44, 80]]} smooth width={3.5} color={shadeHex(color, 0.35)} z={0.001} />
        </Part>
      );
    case "spiky":
      return (
        <Part
          shape={poly([[-104, 30], [-100, 76], [-80, 96], [-64, 124], [-34, 106], [-10, 132], [14, 106], [44, 126], [60, 98], [92, 96], [104, 30], [60, 54], [0, 60], [-60, 52]])}
          color={color}
          shade={0.25}
        />
      );
    case "bob":
    case "long":
    case "bun":
      return (
        <Part
          shape={blob([[-104, 10], [-98, 66], [-60, 100], [0, 110], [62, 100], [100, 66], [106, 14], [80, 46], [30, 60], [-20, 52], [-70, 40]], 8)}
          color={color}
          shade={0.25}
        />
      );
    case "sides":
      return (
        <>
          <Part shape={blob([[-104, 40], [-112, 10], [-104, -24], [-90, -8], [-88, 30]], 6)} color={color} flat />
          <Part shape={blob([[104, 40], [112, 10], [104, -24], [90, -8], [88, 30]], 6)} color={color} flat />
        </>
      );
    default:
      return null;
  }
};
