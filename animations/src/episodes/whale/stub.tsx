import React from "react";
import { AbsoluteFill } from "remotion";
import { Stage, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Paper } from "./sets";

/** Placeholder for a shot that isn't drawn yet. */
export const StubShot: React.FC<ShotProps & { name: string }> = ({ name }) => (
  <AbsoluteFill>
    <Stage camera={{ zoom: 1 }} vignette={0.4}>
      <Paper />
    </Stage>
    <Label text={name} x={0.5} y={0.5} size={0.05} kind="box" />
  </AbsoluteFill>
);
