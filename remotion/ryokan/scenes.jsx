import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import tl from "./timeline.json";
import { C, Layer, circle, ellipse, cloudPad, clamp, prog, pop, onTwos, easeOut } from "./style";
import {
  MonkSeiza, MonkStand, MonkBack, RobeCloth, Thief, Hut, Pine, Sun, Moon, Ground, Birds, Sparkle,
  Bowl, Mat, Temari, Petal, Butterfly, Susuki, Spider, Desk, MotionLines, Puff, InkText,
} from "./characters";

const Q = tl.cues;
const BEAT = 60 / tl.bpm;

// Absolute story time (seconds) inside a <Sequence>.
export const useStoryTime = (start) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return start + frame / fps;
};

const Frame = ({ children, camera = "" }) => (
  <AbsoluteFill>
    <svg viewBox="0 0 1080 1080" width="100%" height="100%">
      <rect width="1080" height="1080" fill={C.paper} />
      <g transform={camera}>{children}</g>
    </svg>
  </AbsoluteFill>
);

const zoomTo = (s, cx, cy) => `translate(540 540) scale(${s}) translate(${-cx} ${-cy})`;

const FarRange = ({ y = 0, snow = true }) => (
  <g transform={`translate(0 ${y})`}>
    <Layer parts={[
      { d: "M -40 780 L -40 520 C 60 470 140 380 230 330 C 300 380 340 420 400 430 C 480 360 560 262 680 222 C 780 280 860 360 960 400 C 1020 384 1080 366 1120 380 L 1120 780 L -40 780 Z", fill: C.haze, alpha: 0.75 },
      ...(snow ? [{ d: "M 626 254 C 648 238 664 226 680 222 C 698 230 716 244 736 260 Q 714 272 702 260 Q 686 276 668 260 Q 648 272 626 254 Z", fill: "#FFFFFF" }] : []),
    ]} />
  </g>
);

// ---------------------------------------------------------------- 1. the mountain hut

export const SceneMountain = ({ start }) => {
  const t = useStoryTime(start);
  const z = prog(t, 1.75, 3.7);
  const cam = zoomTo(1 + 0.6 * z, 540 + 60 * z, 540 + 36 * z);
  const waving = t > Q.ryokanWave - 0.1 && t < Q.ryokanWave + 1.1;
  return (
    <Frame camera={cam}>
      <Sun x={860} y={168} t={t} />
      <Birds x={130} y={150} t={t} />
      <FarRange />
      <Layer parts={[
        { d: "M -40 770 L -40 700 C 120 690 260 624 400 594 L 820 590 C 920 602 1020 640 1120 662 L 1120 770 Z", fill: "#A9C686" },
        { d: "M 300 770 C 380 700 520 640 596 596 L 650 596 C 590 650 470 710 410 770 Z", fill: C.dirt, line: false },
        { d: "M 300 770 C 380 700 520 640 596 596 M 650 596 C 590 650 470 710 410 770", w: 2.4, inkAlpha: 0.6 },
      ]} />
      <Pine x={420} y={600} s={0.82} sway={Math.sin(t * 1.4) * 3} />
      <Hut x={640} y={594} s={0.72} />
      <MonkSeiza x={560} y={606} s={0.42} breath={Math.sin(t * 2.4)} wave={waving ? t * 14 : null} eyes="closed" />
      <Ground y={770} tufts={[90, 230, 520, 700, 880, 1010]} flowers={[[160, C.petal], [610, C.sunCore], [960, "#C9A6E0"]]} />
    </Frame>
  );
};

// ---------------------------------------------------------------- shared interior

const Room = ({ night, t, id }) => {
  const wx = 330;
  const wy = 400;
  const r = 118;
  return (
    <>
      <Layer base={false} parts={[{ d: "M -20 -20 L 1100 -20 L 1100 772 L -20 772 Z", fill: night ? "#D9D2C2" : "#EADCB9", alpha: 0.7, line: false }]} />
      <Layer parts={[
        { d: "M -20 64 L 1100 64 L 1100 112 L -20 112 Z", fill: C.wood },
        { d: "M 92 112 L 134 112 L 134 772 L 92 772 Z", fill: C.wood },
        { d: "M 946 112 L 988 112 L 988 772 L 946 772 Z", fill: C.wood },
        { d: circle(wx, wy, r + 18), fill: C.wood },
        { d: circle(wx, wy, r), fill: night ? C.night : "#C7DDE5" },
        { d: "M 134 160 Q 170 150 196 112 M 134 136 L 160 112 M 134 186 Q 190 170 220 112", w: 1.6, inkAlpha: 0.45 },
      ]} />
      <clipPath id={`win-${id}`}><circle cx={wx} cy={wy} r={r - 2} /></clipPath>
      <g clipPath={`url(#win-${id})`}>
        {night ? (
          <>
            <Moon x={wx + 40} y={wy - 30 - prog(t, 6.2, 12.4) * 16} r={42} />
            <Sparkle x={wx - 60} y={wy - 50} r={6} k={0.7 + 0.3 * Math.sin(t * 5)} />
            <Sparkle x={wx - 20} y={wy + 50} r={5} k={0.7 + 0.3 * Math.sin(t * 4 + 2)} />
          </>
        ) : (
          <>
            <Layer parts={[{ d: cloudPad(wx - 20 + t * 6, wy + 4, 120, 30, 3), fill: "#FFFFFF" }]} />
            <Layer parts={[{ d: cloudPad(wx + 60, wy + 120, 220, 50, 5), fill: C.pine }]} />
          </>
        )}
      </g>
      <Ground y={772} color={night ? "#A9886A" : C.wood} depth={44} />
    </>
  );
};

// ---------------------------------------------------------------- 2. he owned almost nothing

export const SceneNothing = ({ start }) => {
  const t = useStoryTime(start);
  const spider = interpolate(t, [Q.spiderDrop, Q.spiderDrop + 0.45, Q.spiderDrop + 0.7, Q.spiderDrop + 0.9], [0, 230, 200, 214], clamp);
  return (
    <Frame camera={zoomTo(1 + prog(t, 3.8, 6.4) * 0.04, 560, 560)}>
      <Room t={t} id="day" />
      <g transform={`translate(600 772) scale(${pop(t, Q.matPop)}) translate(-600 -772)`}>
        <Mat x={600} y={772} w={300} />
      </g>
      <MonkSeiza x={588} y={764} s={1.05} breath={Math.sin(t * 2.4)} eyes={t > 5.2 && t < 5.5 ? "open" : "closed"} />
      <g transform={`translate(790 772) scale(${pop(t, Q.bowlPop)}) translate(-790 -772)`}>
        <Bowl x={790} y={770} />
      </g>
      <Spider x={862} y={112} len={spider} />
      {t > Q.bowlPop + 0.3 && <Sparkle x={830} y={700} r={9} k={pop(t, Q.bowlPop + 0.3)} />}
    </Frame>
  );
};

// ---------------------------------------------------------------- 3+4. the thief, and the gift

export const SceneNight = ({ start }) => {
  const t = useStoryTime(start);
  const gift = t >= Q.robeOffer;
  const pt = onTwos(t);
  const MX = 430;
  const GY = 772;

  // ---- thief
  let thief;
  let bowlWorld = { x: 700, y: GY - 2, rot: 0, show: true };
  if (!gift) {
    const walk = prog(t, Q.thiefEnter, Q.thiefStop, (x) => x);
    const x = interpolate(walk, [0, 1], [1190, 820]);
    const walking = t < Q.thiefStop;
    let lean = 18;
    let handF;
    let handB;
    let child = null;
    let headTilt = walking ? 0 : Math.sin((t - Q.thiefStop) * 16) * 10 * (t < Q.bowlLift ? 1 : 0);
    let eyes = "normal";
    if (t >= Q.bowlLift) {
      // bowl in thief-local coordinates (thief faces left, so local x points left)
      const lift = prog(t, Q.bowlLift, Q.bowlShake);
      const up = prog(t, Q.bowlShake, Q.bowlShake + 0.2);
      const down = prog(t, Q.eyeOpen + 0.1, Q.eyeOpen + 0.45);
      const bx = interpolate(lift, [0, 1], [(x - 700) / 1.05, 80]) + interpolate(up, [0, 1], [0, -36]) + interpolate(down, [0, 1], [0, (x - 700) / 1.05 - 44]);
      const shake = t > Q.bowlShake + 0.2 && t < Q.question ? Math.sin(t * 60) * 12 : 0;
      const by = interpolate(lift, [0, 1], [0, -120]) + interpolate(up, [0, 1], [0, -130]) + interpolate(down, [0, 1], [0, 250]) + shake * 0.3;
      const rot = interpolate(up, [0, 1], [0, 180]) - interpolate(down, [0, 1], [0, 180]) + shake;
      lean = interpolate(lift, [0, 0.5, 1], [18, 46, 10]) - up * 14 + interpolate(down, [0, 0.6, 1], [0, 40, 22]);
      handF = [bx + 30, by - 18];
      handB = [bx - 26, by - 22];
      bowlWorld.show = false;
      child = <Bowl x={bx} y={by} rot={rot} s={0.95} />;
      headTilt = t > Q.question ? -14 + Math.sin(t * 3) * 3 : 0;
      if (t > Q.eyeOpen + 0.45) { bowlWorld = { x: 700, y: GY - 2, rot: 0, show: true }; child = null; handF = undefined; handB = undefined; }
    }
    thief = (
      <Thief x={x} y={GY} s={1.05} dir={-1} lean={lean} phase={walking ? (pt - Q.thiefEnter) / (BEAT * 2) : 0.25} stride={walking ? 1 : 0} crouch={1} handF={handF} handB={handB} headTilt={headTilt} eyes={eyes}>
        {child}
      </Thief>
    );
  } else {
    const taken = prog(t, Q.robeTaken, Q.robeTaken + 0.25);
    const running = t >= Q.thiefRun;
    if (!running) {
      const bow = prog(t, Q.thiefBow, Q.thiefBow + 0.15) - prog(t, Q.thiefRun - 0.12, Q.thiefRun);
      thief = (
        <Thief x={760 - taken * 30} y={GY} s={1.05} dir={-1} lean={-6 + bow * 46 + taken * 6} stride={0} phase={0.25} crouch={0.6}
          handF={taken > 0 ? [46, -120 + bow * 40] : [20, -210 + Math.sin(t * 30) * 4]}
          handB={taken > 0 ? [20, -128 + bow * 40] : [-14, -206]}
          eyes="wide" />
      );
    } else {
      const rx = interpolate(t, [Q.thiefRun, Q.thiefRun + 0.9], [730, 1260], { ...clamp, easing: (x) => x * x * 0.6 + x * 0.4 });
      thief = (
        <>
          {[0, 0.18, 0.36].map((o) => {
            const k = (t - Q.thiefRun - o) / 0.5;
            return k > 0 && k < 1 ? <Puff key={o} x={730 + o * 380} y={GY - 10} k={k} /> : null;
          })}
          <MotionLines x={rx - 30} y={GY - 120} k={prog(t, Q.thiefRun, Q.thiefRun + 0.2)} />
          <Thief x={rx} y={GY} s={1.05} dir={1} lean={24} run phase={(pt - Q.thiefRun) / 0.36} stride={1} handF={[40, -236]} handB={[10, -240]} eyes="wide">
            <RobeCloth a={[48, -244]} b={[4, -248]} len={70} sway={-34 + Math.sin(t * 30) * 8} />
          </Thief>
        </>
      );
    }
  }

  // ---- Ryōkan
  let monk;
  if (!gift) {
    const peek = t > Q.eyeOpen;
    monk = <MonkSeiza x={MX} y={GY - 6} s={1.05} breath={Math.sin(t * 2)} eyes={peek ? ["closed", "open"] : "closed"} look={peek ? 2 : 0} headTilt={peek ? 4 : 0} />;
  } else {
    const taken = t >= Q.robeTaken + 0.12;
    const waving = t >= Q.goodbyeWave;
    const front = waving ? [52 + Math.sin(t * 14) * 12, -262] : taken ? [40, -112] : [128, -150];
    const back = taken ? [26, -116] : [62, -158];
    monk = (
      <MonkStand x={MX} y={GY} s={1.05} dress="under" front={front} back={back} eyes={waving ? "closed" : "open"} look={2} headTilt={waving ? 6 : 0} />
    );
  }

  // the robe passing from Ryōkan's hands to the thief's
  let robe = null;
  if (gift && t < Q.thiefRun) {
    const k = prog(t, Q.robeTaken, Q.robeTaken + 0.25);
    const bow = prog(t, Q.thiefBow, Q.thiefBow + 0.15) - prog(t, Q.thiefRun - 0.12, Q.thiefRun);
    const tx = 760 - k * 30;
    const a = [interpolate(k, [0, 1], [MX + 128 * 1.05, tx - 20 * 1.05]), interpolate(k, [0, 1], [GY - 150 * 1.05, GY - (128 - bow * 40) * 1.05])];
    const b = [interpolate(k, [0, 1], [MX + 62 * 1.05, tx - 46 * 1.05]), interpolate(k, [0, 1], [GY - 158 * 1.05, GY - (120 - bow * 40) * 1.05])];
    robe = <RobeCloth a={a[0] > b[0] ? a : b} b={a[0] > b[0] ? b : a} len={118 - bow * 40} sway={Math.sin(t * 6) * 3} />;
  }

  const q = pop(t, Q.question);
  const bang = pop(t, Q.robeOffer + 0.05);
  const heart = prog(t, Q.robeOffer + 0.25, Q.robeOffer + 1.6, easeOut);

  return (
    <Frame camera={zoomTo(1.02 + prog(t, 6.2, 12.6) * 0.04, 560, 560)}>
      <Room night t={t} id="night" />
      <Mat x={MX + 10} y={GY} w={300} />
      {bowlWorld.show && <Bowl x={bowlWorld.x} y={bowlWorld.y} />}
      {monk}
      {robe}
      {thief}
      {t > Q.question && !gift && (
        <g transform={`translate(800 470) scale(${q})`}>
          <InkText x={0} y={0} size={96} rotate={10}>?</InkText>
        </g>
      )}
      {gift && t < Q.robeTaken && (
        <g transform={`translate(800 470) scale(${bang})`}>
          <InkText x={0} y={0} size={96} rotate={-8}>!</InkText>
          <Layer parts={[{ d: "M 40 30 Q 52 50 40 58 Q 28 50 40 30 Z", fill: "#9FC8E8", w: 2.4 }]} />
        </g>
      )}
      {gift && heart > 0 && heart < 1 && (
        <g transform={`translate(${MX + 70 + Math.sin(heart * 9) * 10} ${GY - 300 - heart * 120})`} opacity={1 - heart}>
          <Layer parts={[{ d: "M 0 12 C -22 -4 -14 -22 0 -10 C 14 -22 22 -4 0 12 Z", fill: C.pink, w: 2.4 }]} />
        </g>
      )}
      {/* moonlight through the round window */}
      <path d="M 250 470 L 400 320 L 800 772 L 430 772 Z" fill="#FFF3C6" opacity={0.2} style={{ mixBlendMode: "screen" }} />
      <rect width="1080" height="772" fill="#A9B3DD" style={{ mixBlendMode: "multiply" }} opacity={0.6} />
    </Frame>
  );
};

// ---------------------------------------------------------------- 5. the moon in my window

const Haiku = ({ t }) => {
  const H = tl.haiku;
  const cols = [1004, 934, 864];
  const chars = [];
  H.columns.forEach((col, ci) => {
    [...col].forEach((ch, i) => {
      const at = Q.haikuColumns[ci] + i * Q.haikuCharStep;
      const k = prog(t, at, at + 0.3, easeOut);
      chars.push(
        <text key={`${ci}-${i}`} x={cols[ci]} y={250 + i * 66} fontFamily="Klee One" fontWeight={600} fontSize={56} fill={C.ink} textAnchor="middle" opacity={k} transform={`translate(0 ${(1 - k) * -10})`}>
          {ch}
        </text>,
      );
    });
  });
  const sealAt = Q.haikuColumns[2] + 0.55;
  const seal = pop(t, sealAt);
  const romaji = prog(t, Q.romaji, Q.romaji + 0.5);
  const typed = Math.max(0, Math.floor((t - Q.translation) * 34));
  const offsets = H.translation.map((_, li) => H.translation.slice(0, li).join("").length);
  return (
    <>
      {chars}
      {t > sealAt && (
        <g transform={`translate(864 470) scale(${seal}) rotate(-4)`}>
          <Layer parts={[{ d: "M -24 -34 Q -26 -36 -22 -36 L 22 -36 Q 26 -36 24 -32 L 24 32 Q 24 36 20 36 L -22 36 Q -26 36 -24 32 Z", fill: "#D04A3C", w: 2.2, stroke: "#9E3026" }]} />
          <text x={0} y={-6} fontFamily="Klee One" fontWeight={600} fontSize={26} fill="#FFF4E6" textAnchor="middle">良</text>
          <text x={0} y={24} fontFamily="Klee One" fontWeight={600} fontSize={26} fill="#FFF4E6" textAnchor="middle">寛</text>
        </g>
      )}
      <text x={540} y={918} fontFamily="Patrick Hand" fontSize={32} fill={C.inkSoft} textAnchor="middle" opacity={romaji} letterSpacing={1}>
        {H.romaji}
      </text>
      {H.translation.map((line, li) => (
        <text key={li} x={540} y={972 + li * 50} fontFamily="Patrick Hand" fontSize={44} fill={C.ink} textAnchor="middle">
          {[...line].map((ch, i) => (
            <tspan key={i} opacity={offsets[li] + i < typed ? 1 : 0}>{ch}</tspan>
          ))}
        </text>
      ))}
    </>
  );
};

export const SceneMoon = ({ start }) => {
  const t = useStoryTime(start);
  const WX = 500;
  const WY = 400;
  const R = 290;
  const stars = [[330, 230], [420, 160], [760, 420], [300, 420], [700, 160], [560, 520]];
  return (
    <Frame camera={zoomTo(1 + prog(t, 12.4, 17.2) * 0.06, 540, 520)}>
      <Layer base={false} parts={[{ d: "M -20 -20 L 1100 -20 L 1100 852 L -20 852 Z", fill: "#E6DABD", alpha: 0.75, line: false }]} />
      <Layer parts={[{ d: circle(WX, WY, R + 22), fill: C.wood }, { d: circle(WX, WY, R), fill: C.night }]} />
      <clipPath id="moonwin"><circle cx={WX} cy={WY} r={R - 2} /></clipPath>
      <g clipPath="url(#moonwin)">
        <Layer base={false} parts={[{ d: circle(WX, WY + 40, R + 30), fill: C.nightDeep, alpha: 0.5, line: false }]} />
        <Moon x={590} y={interpolate(t, [12.4, 17], [330, 270])} r={88} glow={0.8 + 0.2 * Math.sin(t * 2)} />
        {stars.map(([sx, sy], i) => (
          <Sparkle key={i} x={sx} y={sy} r={8} k={0.55 + 0.45 * Math.abs(Math.sin(t * 2.2 + i * 1.7))} />
        ))}
        <Layer base={false} parts={[{ d: cloudPad(360 + (t - 12.4) * 22, 486, 190, 30, 3), fill: "#8A94C6", alpha: 0.9 }]} />
        <Layer parts={[{ d: "M 180 690 C 260 600 340 590 420 620 C 500 560 600 560 700 600 C 760 590 820 610 860 640 L 860 720 L 180 720 Z", fill: "#3E4A86" }]} />
        {[260, 330, 640, 700, 760].map((sx, i) => (
          <Susuki key={sx} x={sx} y={700} h={150 + (i % 2) * 40} lean={14 + i * 3} sway={Math.sin(t * 1.8 + i) * 6} />
        ))}
      </g>
      <Ground y={852} color={C.wood} depth={30} />
      <Desk x={470} y={852} />
      <MonkBack x={300} y={852} s={1.1} brush={t > 12.8 && t < 14.4 ? t * 9 : 0} />
      <Haiku t={t} />
    </Frame>
  );
};

// ---------------------------------------------------------------- 6. lightness

const petals = new Array(16).fill(0).map((_, i) => ({
  x: random(`px${i}`) * 1080,
  y: 300 + random(`py${i}`) * 700,
  v: 40 + random(`pv${i}`) * 60,
  ph: random(`pp${i}`) * 6,
  c: i % 3 === 0 ? "#F7D27A" : C.petal,
}));

export const SceneLightness = ({ start }) => {
  const t = useStoryTime(start);
  const GY = 770;
  const MX = 560;
  const lt = t - 17;
  // temari bounce: hits the ground on each beat, returns to the hand on the off-beat
  const bouncing = t >= Q.ballFirstBounce - BEAT / 2 && t < Q.finale;
  const tau = ((t - Q.ballFirstBounce) / BEAT) % 1;
  const hand = [MX + 88, GY - 120];
  let ball = [hand[0] + 4, hand[1] + 30];
  if (bouncing) {
    const k = Math.abs(Math.sin(Math.PI * (tau < 0 ? tau + 1 : tau)));
    ball = [hand[0] + 4, GY - 22 - k * 70];
  } else if (t >= Q.finale) {
    const up = prog(t, Q.finale, Q.finale + 0.3, easeOut);
    ball = [hand[0] + 4 - up * 20, GY - 92 - up * 120];
  }
  const handY = t >= Q.finale ? ball[1] - 28 : Math.min(hand[1] + 10, ball[1] - 30);
  const sparkle = pop(t, Q.finale + 0.1);
  return (
    <Frame camera={zoomTo(1.1 - prog(t, 17, 21.5) * 0.1, 540, 540)}>
      <Sun x={860} y={168} t={t} />
      <Birds x={60} y={190} t={lt + 3} />
      <FarRange y={60} />
      <Pine x={930} y={GY} s={1.05} sway={Math.sin(t * 1.4) * 4} />
      <Hut x={230} y={GY} s={0.95} />
      <MonkStand x={MX} y={GY} s={1.05} dress="under" eyes="closed" front={[ (hand[0] - MX) / 1.05, (handY - GY) / 1.05 ]} back={[-30, -104]} bob={bouncing ? -Math.abs(Math.sin(Math.PI * tau)) * 4 : 0} headTilt={Math.sin(t * 3) * 4} />
      <Temari x={ball[0]} y={ball[1]} spin={t * 200} />
      <Ground y={GY} tufts={[60, 380, 470, 700, 820, 1040]} flowers={[[120, C.petal], [420, C.sunCore], [760, "#C9A6E0"], [1010, C.petal]]} />
      <Butterfly x={720 + Math.sin(lt * 1.3) * 90} y={430 + Math.sin(lt * 2.1) * 40 - lt * 10} t={t} s={0.9} />
      {petals.map((p, i) => {
        const y = p.y - p.v * lt;
        const x = p.x + Math.sin(lt * 1.5 + p.ph) * 30 + lt * 12;
        return y > -30 ? <Petal key={i} x={x} y={y} r={lt * 60 + p.ph * 50} color={p.c} s={0.9} /> : null;
      })}
      {t > Q.finale && [[MX - 120, GY - 330], [MX + 150, GY - 340], [MX + 60, GY - 420], [MX - 40, GY - 420]].map(([sx, sy], i) => (
        <Sparkle key={i} x={sx} y={sy} r={12} k={sparkle * (0.7 + 0.3 * Math.sin(t * 6 + i))} />
      ))}
    </Frame>
  );
};
