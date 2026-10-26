import React from "react";
import { Series } from "remotion";
import { JapanAudioProps } from "./audioProps";
import { JapanPart1, PART1_DURATION } from "./Part1";
import { JapanPart2, PART2_DURATION } from "./Part2";
import { JapanPart3, PART3_DURATION } from "./Part3";
import { JapanPart4, PART4_DURATION } from "./Part4";
import { JapanPart5, PART5_DURATION } from "./Part5";
import { JapanPart6, PART6_DURATION } from "./Part6";
import { JapanPart7, PART7_DURATION } from "./Part7";
import { JapanPart8, PART8_DURATION } from "./Part8";

const PARTS: [React.FC<JapanAudioProps>, number][] = [
  [JapanPart1, PART1_DURATION],
  [JapanPart2, PART2_DURATION],
  [JapanPart3, PART3_DURATION],
  [JapanPart4, PART4_DURATION],
  [JapanPart5, PART5_DURATION],
  [JapanPart6, PART6_DURATION],
  [JapanPart7, PART7_DURATION],
  [JapanPart8, PART8_DURATION],
];

export const FULL_DURATION = PARTS.reduce((sum, [, d]) => sum + d, 0);

/** All the parts back to back, as one video. */
export const JapanFull: React.FC<JapanAudioProps> = (props) => (
  <Series>
    {PARTS.map(([Part, duration], i) => (
      <Series.Sequence key={i} durationInFrames={duration}>
        <Part {...props} />
      </Series.Sequence>
    ))}
  </Series>
);
