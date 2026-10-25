import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PaperBg, SceneSvg } from "../Stage";
import { Person, Tribe, Hold } from "../Person";
import { Label } from "../draw";
import { FONT_HAND } from "../theme";
import { useJapanAssets } from "../assets";

// Dev-only lineup of every character type, for checking the drawings.
const CAST: [Tribe, Hold][] = [
  ["jomon", "spear"], ["yayoi", "rice"], ["monk", "beads"], ["emperor", "shaku"], ["noble", "coins"],
  ["priest", "gohei"], ["guard", "bow"], ["samurai", "katana"], ["shogun", "fan"], ["daimyo", "none"],
  ["modern", "lantern"], ["bandit", "naginata"],
];

export const CastSheet: React.FC = () => {
  useJapanAssets();
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <PaperBg />
      <SceneSvg f={f}>
        {CAST.map(([t, h], i) => {
          const x = 140 + (i % 6) * 300;
          const y = i < 6 ? 470 : 960;
          return (
            <g key={t}>
              <Person x={x} y={y} s={0.95} tribe={t} f={f} hold={h} aR={h === "none" ? 10 : 30} expr={i % 3 === 0 ? "grin" : "smile"} />
              <Label x={x} y={y + 50} text={t} size={36} font={FONT_HAND} />
            </g>
          );
        })}
      </SceneSvg>
    </AbsoluteFill>
  );
};
