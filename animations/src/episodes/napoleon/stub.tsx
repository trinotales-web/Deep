import React from "react";
import { AbsoluteFill } from "remotion";
import type { ShotProps } from "../../kit";

/** Placeholder for a shot not drawn yet. */
export const StubShot: React.FC<ShotProps & { name: string }> = ({ name }) => (
  <AbsoluteFill style={{ backgroundColor: "#2a2230", color: "#fff", fontSize: 60, fontFamily: "Montserrat", alignItems: "center", justifyContent: "center" }}>{name}</AbsoluteFill>
);
