import React from "react";
import { X } from "../../kit";
import { Sky, Stars, Moon, Hill, Ground, Battlement, Torch, CastleFar, Cloud, Mountains } from "../../kit/env";

/** Night sky + distant hills. */
export const NightSky: React.FC<{ horizon?: number; moonX?: number; moonY?: number }> = ({ horizon = -100, moonX = -620, moonY = 360 }) => (
  <X z={-40}>
    <Sky w={5000} h={3000} y={horizon + 1400} top="#080c24" bottom="#26335a" />
    <Stars w={4200} h={1400} y={horizon + 700} count={90} />
    <Moon x={moonX} y={moonY} r={52} />
    <Hill x={-700} y={horizon} w={2400} h={220} color="#1a2438" seed={3} />
    <Hill x={900} y={horizon} w={2200} h={180} color="#1c283c" seed={7} />
  </X>
);

/** Castle wall-walk at night: the parapet is in the foreground (characters stand behind it). */
export const NightWall: React.FC<{ parapetTop?: number; torches?: number[]; children?: React.ReactNode }> = ({
  parapetTop = -230,
  torches = [-640, 640],
  children,
}) => (
  <>
    <NightSky horizon={-60} />
    <X y={-60} z={-30}>
      <Ground w={5000} h={600} color="#26301f" far="#1e2a1c" pebbles={0} tufts={0} />
    </X>
    {children}
    <Battlement y={parapetTop - 290} w={3000} h={380} color="#7e7884" merlon={150} z={10} />
    {torches.map((x, i) => (
      <Torch key={x} x={x} y={parapetTop - 10} seed={i + 2} z={11} />
    ))}
  </>
);

/** Night field below the walls, for the approaching army. */
export const NightField: React.FC<{ horizon?: number; children?: React.ReactNode }> = ({ horizon = 120, children }) => (
  <>
    <NightSky horizon={horizon} moonX={700} moonY={420} />
    <X y={horizon} z={-30}>
      <Ground w={5000} h={1800} color="#2a3a24" far="#1e2a1c" pebbles={0} tufts={30} tuftColor="#1a2416" seed={4} />
    </X>
    {children}
  </>
);

/** Daylight battlefield / open country. */
export const DayField: React.FC<{ horizon?: number; castle?: boolean; children?: React.ReactNode; mood?: "day" | "warm" }> = ({
  horizon = -60,
  castle = false,
  children,
  mood = "day",
}) => (
  <>
    <X z={-40}>
      <Sky w={5000} h={3000} y={horizon + 1400} top={mood === "day" ? "#4f9fd9" : "#6fa9d6"} bottom={mood === "day" ? "#d8eef6" : "#f6d79c"} />
      <Cloud x={-600} y={horizon + 420} w={420} seed={2} />
      <Cloud x={500} y={horizon + 520} w={520} seed={6} />
      <Mountains w={5000} y={horizon} color="#a6b8cc" peaks={[[-1600, 160], [-900, 250], [-300, 170], [300, 230], [900, 150], [1500, 240]]} />
    </X>
    {castle ? <CastleFar x={700} y={horizon} s={0.55} z={-35} /> : null}
    <X y={horizon} z={-30}>
      <Ground w={5000} h={1800} color="#8aa65a" far="#9ab86a" pebbles={14} tufts={24} tuftColor="#5f7a3a" seed={9} />
    </X>
    {children}
  </>
);


