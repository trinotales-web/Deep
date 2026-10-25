import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PaperBg, SceneSvg } from "../Stage";
import { Person, Tribe, Hold } from "../Person";
import { Label } from "../draw";
import { FONT_HAND } from "../theme";
import { useJapanAssets } from "../assets";
import { Castle, MongolShip, Onion, SilverPavilion, StoneWall, TeaSet, Typhoon, Boom, Moon } from "../Props3";

// Dev-only lineup of every character type, for checking the drawings.
const CAST: [Tribe, Hold][] = [
  ["jomon", "spear"], ["yayoi", "rice"], ["monk", "beads"], ["emperor", "shaku"], ["noble", "coins"],
  ["priest", "gohei"], ["guard", "bow"], ["samurai", "katana"], ["shogun", "fan"], ["daimyo", "none"],
  ["modern", "lantern"], ["bandit", "naginata"], ["ninja", "spyglass"], ["mongol", "bomb"], ["khan", "letter"],
];

export const CastSheet: React.FC = () => {
  useJapanAssets();
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <PaperBg />
      {f >= 15 ? (
        <SceneSvg f={f}>
          <Castle x={260} y={500} s={0.6} />
          <Moon x={560} y={120} />
          <MongolShip x={700} y={460} s={0.7} />
          <Typhoon x={1200} y={260} s={0.7} f={f} />
          <SilverPavilion x={1650} y={480} s={0.75} />
          <StoneWall x0={80} x1={700} y={1000} h={180} p={1} />
          <TeaSet x={1000} y={1000} f={f} />
          <Onion x={1400} y={1000} s={0.9} f={f} />
          <Boom x={1750} y={850} p={0.4} />
        </SceneSvg>
      ) : null}
      <SceneSvg f={f}>
        {(f >= 15 ? [] : CAST).map(([t, h], i) => {
          const x = 120 + (i % 8) * 240;
          const y = i < 8 ? 470 : 960;
          return (
            <g key={t}>
              <Person x={x} y={y} s={0.85} tribe={t} f={f} hold={h} aR={h === "none" ? 10 : 30} expr={i % 3 === 0 ? "grin" : "smile"} beard={t === "khan"} />
              <Label x={x} y={y + 50} text={t} size={36} font={FONT_HAND} />
            </g>
          );
        })}
      </SceneSvg>
    </AbsoluteFill>
  );
};
