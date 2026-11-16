import React from "react";
import { useCurrentFrame } from "remotion";
import { Part, Line } from "../Part";
import { X, type XProps } from "../context";
import { Gradient, Glow } from "../effects";
import { roundRect } from "../shapes";
import { rng } from "../random";
import { Puffs } from "./whales";

// Launch pad kit: a dark lattice service tower with access arms, billowing
// exhaust clouds with cartoon swirls, and a teal-sky launch set.

const ri = (v: number) => Math.round(v);
const STEEL_D = "#34353e";

/** Lattice service tower: two rails, X bracing per bay, access arms toward +x. Origin = foot centre. */
export const LatticeTower: React.FC<XProps & { h?: number; w?: number; bay?: number; arms?: number[]; arm?: number; color?: string }> = ({ h = 1600, w = 260, bay = 150, arms = [0.55, 0.82], arm = 340, color = STEEL_D, ...xf }) => {
  const n = Math.floor(h / bay);
  const hw = w / 2;
  return (
    <X {...xf}>
      {[-1, 1].map((sd) => (
        <Part key={sd} shape={roundRect(26, h, 4)} color={color} flat outline={4} x={sd * hw} y={h / 2} />
      ))}
      {Array.from({ length: n }, (_, i) => {
        const y0 = i * bay;
        const y1 = y0 + bay;
        return (
          <React.Fragment key={i}>
            <Line pts={[[-hw, y0], [hw, y0]]} width={10} color={color} z={-0.002} />
            <Line pts={[[-hw, y0], [hw, y1]]} width={8} color={color} z={-0.003} />
            <Line pts={[[hw, y0], [-hw, y1]]} width={8} color={color} z={-0.003} />
            <Line pts={[[-hw + 10, y0 + 14], [hw - 30, y1 - 8]]} width={2.5} color="#e8e8f0" opacity={0.75} z={-0.001} />
          </React.Fragment>
        );
      })}
      {arms.map((k, i) => {
        const y = ri(h * k);
        return (
          <X key={`a${i}`} x={hw} y={y} z={0.002}>
            <Line pts={[[0, 0], [arm, 0]]} width={10} color={color} />
            <Line pts={[[0, 70], [arm, 70]]} width={10} color={color} />
            {Array.from({ length: Math.floor(arm / 70) }, (_, j) => (
              <Line key={j} pts={[[j * 70, 0], [(j + 1) * 70, 70]]} width={6} color={color} z={-0.001} />
            ))}
            {Array.from({ length: Math.floor(arm / 70) + 1 }, (_, j) => (
              <Line key={`v${j}`} pts={[[j * 70, 0], [j * 70, 70]]} width={6} color={color} z={-0.001} />
            ))}
          </X>
        );
      })}
      <Part shape={roundRect(w + 80, 40, 6)} color="#5a5c66" flat outline={4} y={h + 20} z={0.001} />
    </X>
  );
};

/**
 * Billowing exhaust cloud: dark slate puffs that roll outward along the ground
 * and climb (k 0..1), with lighter tops and cartoon swirl lines. `dir` = side it
 * rolls toward. Origin = ground at the cloud's root.
 */
export const SmokeBillow: React.FC<XProps & { k: number; dir?: 1 | -1; w?: number; h?: number; seed?: number; color?: string; light?: string }> = ({ k, dir = 1, w = 900, h = 900, seed = 3, color = "#3d5566", light = "#5d7a8c", ...xf }) => {
  const frame = useCurrentFrame();
  const r = rng(seed);
  const g = Math.min(1, Math.max(0, k));
  if (g <= 0.01) return null;
  const puffs: [number, number, number][] = Array.from({ length: 22 }, (_, i) => {
    const u = i / 21;
    const x = dir * (u * w * (0.35 + 0.65 * g) + (r() - 0.5) * 60);
    const y = (1 - u) * h * 0.55 * g + r() * h * 0.45 * g * (1 - u * 0.6);
    const rad = (110 + r() * 120) * (0.45 + 0.55 * g) * (1 - u * 0.35);
    const wob = Math.sin(frame * 0.05 + i) * 6;
    return [ri(x + wob), ri(y), ri(rad)];
  });
  const swirls = puffs.filter((_, i) => i % 4 === 1).map(([x, y, rad]) => {
    const pts: [number, number][] = Array.from({ length: 14 }, (_, j) => {
      const a = (j / 13) * Math.PI * 1.7 + frame * 0.02;
      const rr = rad * 0.55 * (1 - j / 18);
      return [ri(x + Math.cos(a) * rr), ri(y + Math.sin(a) * rr)];
    });
    return pts;
  });
  return (
    <X {...xf}>
      <Puffs puffs={puffs} color={color} shadow={light} outline={5} />
      {swirls.map((pts, i) => (
        <Line key={i} pts={pts} smooth width={7} color="#2a3a48" opacity={0.85} z={0.004} />
      ))}
    </X>
  );
};

/**
 * Launch set: teal sky with soft clouds, the lattice tower at `towerX`, a pad,
 * and billowing smoke on both sides (`smoke` 0..1). Children (the rocket) are
 * drawn between the tower and the front smoke. Ground at y = `floor`.
 */
export const LaunchPadSet: React.FC<{ floor?: number; towerX?: number; towerH?: number; smoke?: number; glow?: number; children?: React.ReactNode }> = ({ floor = -300, towerX = -480, towerH = 2000, smoke = 0, glow = 0, children }) => {
  const frame = useCurrentFrame();
  const r = rng(9);
  const clouds = Array.from({ length: 4 }, (_, i) => [-1500 + i * 950 + r() * 200, 300 + r() * 300, 0.6 + r() * 0.5] as [number, number, number]);
  return (
    <>
      <Gradient w={6000} h={4000} y={floor + 2000} stops={[[0, "#1e7aa8"], [0.6, "#4ab4d0"], [1, "#9ae0e8"]]} z={-41} />
      {clouds.map(([x, y, s], i) => (
        <Puffs key={i} x={x + ((frame * 0.3) % 200)} y={y} s={s} puffs={[[-120, 0, 70], [-40, 30, 90], [60, 20, 80], [140, 0, 60], [10, -10, 70]]} color="#eef8fa" shadow="#cfe8ee" outline={4} opacity={0.85} z={-40.5 + i * 0.01} />
      ))}
      <Part shape={roundRect(6000, 300, 0)} color="#6a9a6a" flat outline={5} y={floor - 60} z={-40} />
      <LatticeTower x={towerX} y={floor} h={towerH} z={-30} />
      <Part shape={roundRect(1100, 90, 8)} color="#8a8c96" flat outline={5} y={floor - 10} z={-29} />
      <Part shape={roundRect(1060, 18, 4)} color="#b9bcc4" flat outline={0} y={floor + 26} z={-28.9} />
      {children}
      {glow > 0 ? <Glow rx={700} ry={380} y={floor + 40} color="#ffb04a" alpha={0.5 * glow * (0.85 + 0.15 * Math.sin(frame * 0.6))} additive z={-1} /> : null}
      <SmokeBillow k={smoke} dir={-1} x={-160} y={floor - 40} w={1300} h={900} seed={3} z={-0.5} />
      <SmokeBillow k={smoke} dir={1} x={160} y={floor - 40} w={1300} h={900} seed={7} z={-0.49} />
    </>
  );
};
