import React from "react";
import { interpolate } from "remotion";
import tl from "./timeline.json";
import { C, Layer, limb, clamp, prog, pop, onTwos, easeOut } from "../storybook/style";
import { Frame, useStoryTime, zoomTo } from "../storybook/Story";
import { Sun, Ground, Birds, Puff, InkText } from "../storybook/characters";
import { K, Person, KimonoStand, Tape, Check, DustBunny, Broom, Wrench, Coin, Car, TOWER, TowerItem, Thought, House, Heart, SweatDrop } from "./characters";

const Q = tl.cues;
const GY = 780;
const FLASHY = { color: "#E9B949", flowerColor: "#D9534A" };

// ---------------------------------------------------------------- backdrops

const ShojiRoom = () => {
  const lattice = [];
  for (let i = 1; i < 6; i++) lattice.push({ d: `M ${134 + i * 135} 112 L ${134 + i * 135} ${GY}`, w: 5, stroke: C.wood, inkAlpha: 0.75 });
  for (const ly of [290, 460, 630]) lattice.push({ d: `M 134 ${ly} L 946 ${ly}`, w: 5, stroke: C.wood, inkAlpha: 0.75 });
  return (
    <>
      <Layer base={false} parts={[{ d: `M 134 112 L 946 112 L 946 ${GY} L 134 ${GY} Z`, fill: K.shoji, alpha: 0.85, line: false }, ...lattice]} />
      <Layer parts={[
        { d: "M -200 64 L 1280 64 L 1280 112 L -200 112 Z", fill: C.wood },
        { d: `M 92 112 L 134 112 L 134 ${GY} L 92 ${GY} Z`, fill: C.wood },
        { d: `M 946 112 L 988 112 L 988 ${GY} L 946 ${GY} Z`, fill: C.wood },
      ]} />
      <Ground y={GY} color={K.tatami} depth={44} x0={-200} x1={1280} />
    </>
  );
};

const Outdoors = ({ t }) => (
  <>
    <Sun x={860} y={170} t={t} />
    <Birds x={120} y={150} t={t - 10} />
    <Layer parts={[{ d: `M -40 ${GY} L -40 610 C 160 560 300 570 470 610 C 640 556 820 536 1120 600 L 1120 ${GY} Z`, fill: C.haze, alpha: 0.7 }]} />
    <Ground y={GY} tufts={[60, 200, 470, 720, 900, 1040]} flowers={[[140, C.petal], [960, C.sunCore]]} />
  </>
);

// ---------------------------------------------------------------- 1. a traditional kimono

export const SceneDisplay = ({ start }) => {
  const t = useStoryTime(start);
  const drop = prog(t, Q.kimonoDrop, Q.kimonoDrop + 0.6, easeOut);
  return (
    <Frame camera={zoomTo(1 + prog(t, 0, 2.3) * 0.04, 540, 560)}>
      <ShojiRoom />
      <KimonoStand x={540} y={GY} s={0.92} drop={drop} sway={Math.sin(t * 2.6) * 1.2 * drop} />
    </Frame>
  );
};

// ---------------------------------------------------------------- 2. made to the wearer's height

export const SceneFit = ({ start }) => {
  const t = useStoryTime(start);
  const h = interpolate(t, [Q.tapeStart, Q.tapeTop], [0, 262], { ...clamp, easing: easeOut });
  const done = t >= Q.tapeTop;
  const S = 1.35;
  return (
    <Frame camera={zoomTo(1 + prog(t, 2, 4.3) * 0.04, 560, 560)}>
      <ShojiRoom />
      <Person x={470} y={GY} s={S} eyes={done ? "closed" : "open"} look={done ? 0 : 2} bob={done ? -Math.abs(Math.sin((t - Q.tapeTop) * 9)) * 6 * (t < Q.tapeTop + 0.7 ? 1 : 0) : 0} />
      <Tape x={660} y={GY} h={h} s={S} />
      {done && (
        <>
          <Check x={740} y={GY - 262 * S - 6} s={pop(t, Q.tapeTop + 0.05) * 1.5} />
        </>
      )}
    </Frame>
  );
};

// ---------------------------------------------------------------- 3. too long

export const SceneLong = ({ start }) => {
  const t = useStoryTime(start);
  const walk = prog(t, 4.0, Q.trip, (x) => x);
  const x = interpolate(walk, [0, 1], [360, 520]);
  const tripped = t >= Q.trip;
  const fall = prog(t, Q.trip, Q.trip + 0.18, easeOut);
  const recover = prog(t, Q.trip + 0.45, Q.trip + 0.9);
  const lean = fall * 30 - recover * 18;
  const flail = Math.sin(t * 24) * 10 * (tripped ? 1 : 0);
  const pt = onTwos(t);
  return (
    <Frame camera={zoomTo(1.02, 540, 560)}>
      <ShojiRoom />
      <Person x={x} y={GY} s={1.35} fit="long" lean={lean}
        bob={tripped ? 0 : -Math.abs(Math.sin(pt * 9)) * 6}
        eyes={tripped ? "wide" : "open"} mouth={tripped ? "o" : "smile"}
        front={tripped ? [74, -214 + flail] : [32, -112]} back={tripped ? [-40, -206 - flail] : [22, -116]} />
      {tripped && (
        <g transform={`translate(${x + 120} ${GY - 410}) scale(${pop(t, Q.trip + 0.05)})`}>
          <InkText x={0} y={0} size={96} rotate={10}>!</InkText>
        </g>
      )}
    </Frame>
  );
};

// ---------------------------------------------------------------- 4. too short

export const SceneShort = ({ start }) => {
  const t = useStoryTime(start);
  const tug = t >= Q.tug;
  const jerk = tug ? Math.max(0, Math.sin((t - Q.tug) * 14)) * 8 : 0;
  return (
    <Frame camera={zoomTo(1.02 + prog(t, 6, 8.3) * 0.04, 540, 560)}>
      <ShojiRoom />
      <Person x={520} y={GY} s={1.35} fit="short"
        eyes={tug ? "worried" : "open"} mouth={tug ? "wavy" : "smile"} blush={tug ? 1.6 : 1} headTilt={tug ? 8 : 0}
        front={tug ? [30, -80 + jerk] : [32, -112]} back={tug ? [-22, -82 + jerk] : [22, -116]} />
      {t >= Q.sweat && <SweatDrop x={590} y={GY - 340} s={pop(t, Q.sweat)} />}
    </Frame>
  );
};

// ---------------------------------------------------------------- 5. everything bigger than you

const Duster = () => (
  <Layer parts={[
    { d: limb([[0, 0], [0, -70]], 6, 5), fill: "#B98A4F" },
    { d: "M 0 -66 C -26 -86 -22 -120 0 -126 C 22 -120 26 -86 0 -66 Z", fill: "#F4F1E6" },
    { d: "M 0 -70 L -8 -116 M 0 -70 L 8 -116 M 0 -70 L 0 -122", w: 1.6, inkAlpha: 0.6 },
  ]} />
);

export const SceneBigger = ({ start }) => {
  const t = useStoryTime(start);
  const z = prog(t, 8.0, Q.reveal + 0.9);
  const cam = zoomTo(interpolate(z, [0, 1], [2.1, 1]), interpolate(z, [0, 1], [330, 540]), interpolate(z, [0, 1], [640, 540]));
  const swish = Math.sin(t * 16) * 14;
  const hand = [60 + swish * 0.4, -232];
  return (
    <Frame camera={cam}>
      <ShojiRoom />
      <KimonoStand x={580} y={GY} s={1.75} sway={Math.sin(t * 2) * 0.6} {...FLASHY} />
      <Person x={300} y={GY} s={0.82} eyes="open" look={1} headTilt={-10} front={hand} back={[20, -120]}
        holdFront={<g transform={`translate(${hand[0]} ${hand[1]}) rotate(${20 + swish})`}><Duster /></g>} />
      {Q.dust.map((d) => {
        const k = (t - d) / 0.6;
        return k > 0 && k < 1 ? <Puff key={d} x={380 + (d - 9) * 60} y={640 - k * 40} k={k} /> : null;
      })}
    </Frame>
  );
};

// ---------------------------------------------------------------- 6. a house with empty rooms

export const SceneHouse = ({ start }) => {
  const t = useStoryTime(start);
  const S = 0.95;
  const floorY = GY - 14 * S;
  const x = interpolate(t, [10.05, 12.4], [300, 800], clamp);
  const ang = -16 + Math.sin(t * 13) * 14;
  const r = (ang * Math.PI) / 180;
  const along = (d) => [30 - Math.sin(r) * d, -150 + Math.cos(r) * d];
  const bunnies = [[299, 577], [781, 577], [299, floorY], [540, 577]];
  return (
    <Frame camera={zoomTo(1.0, 540, 540)}>
      <Outdoors t={t} />
      <House x={540} y={GY} s={S} />
      {Q.dustBunnies.map((at, i) => (t >= at ? <DustBunny key={i} x={bunnies[i][0]} y={bunnies[i][1] - 4} k={pop(t, at) * 1.15} /> : null))}
      {[0, 0.4, 0.8, 1.2, 1.6, 2.0].map((o) => {
        const k = (t - 10.2 - o) / 0.5;
        const px = interpolate(10.2 + o, [10.05, 12.4], [300, 800], clamp) + 40;
        return k > 0 && k < 1 ? <Puff key={o} x={px} y={floorY - 12} k={k} /> : null;
      })}
      <Person x={x} y={floorY} s={0.6} front={along(62)} back={along(22)} eyes={t > 11.8 ? "worried" : "open"} mouth={t > 11.8 ? "wavy" : "smile"}
        bob={-Math.abs(Math.sin(onTwos(t) * 7)) * 4}
        holdFront={<g transform="translate(30 -150)"><Broom angle={ang} /></g>}>
        {t > 11.9 && <SweatDrop x={52} y={-258} s={pop(t, 11.9) * 1.4} />}
      </Person>
    </Frame>
  );
};

// ---------------------------------------------------------------- 7. a car you can barely afford

export const SceneCar = ({ start }) => {
  const t = useStoryTime(start);
  const clank = Q.clank.reduce((acc, c) => acc + Math.max(0, 1 - Math.abs(t - c) / 0.12), 0);
  const hit = Math.min(1, clank);
  const shake = Q.clank.reduce((acc, c) => acc + (t > c && t < c + 0.2 ? Math.sin((t - c) * 80) * 4 * (1 - (t - c) / 0.2) : 0), 0);
  const hand = [72 + hit * 20, -168 + hit * 34];
  const coinsOut = t >= Q.coins;
  return (
    <Frame camera={zoomTo(1.0, 540, 540)}>
      <Outdoors t={t} />
      {[0, 0.35, 0.7, 1.05, 1.4, 1.75, 2.1].map((o) => {
        const k = ((t - 12.5 - o) % 2.1) / 1.2;
        return k > 0 && k < 1 ? <g key={o} opacity={0.85}><Puff x={440 + Math.sin(o * 5) * 12} y={640 - k * 170} k={k * 1.3} /></g> : null;
      })}
      <Car x={650} y={772} s={1.2} hood={1} shake={shake} />
      <Person x={250} y={GY} s={1.15} front={hand} back={[30, -120]}
        eyes={coinsOut ? "wide" : "worried"} mouth={coinsOut ? "o" : "wavy"}
        holdFront={<g transform={`translate(${hand[0]} ${hand[1]})`}><Wrench angle={-120 + hit * 40} /></g>}>
        <SweatDrop x={52} y={-262} />
      </Person>
      {coinsOut && [0, 1, 2, 3].map((i) => {
        const k = prog(t, Q.coins + i * 0.1, Q.coins + 0.8 + i * 0.1, (x) => x);
        if (k <= 0) return null;
        return <Coin key={i} x={250 + 40 + k * (180 + i * 90)} y={GY - 160 - k * (260 + i * 50) + Math.sin(k * 9 + i) * 14} flap={t * 22 + i} s={1.1} />;
      })}
    </Frame>
  );
};

// ---------------------------------------------------------------- 8. a lifestyle built to impress

export const SceneLifestyle = ({ start }) => {
  const t = useStoryTime(start);
  const TX = 600;
  const shown = 2 + Q.feed.filter((f) => t >= f).length;
  const feeding = t < Q.stopFeeding;
  const wob = t > Q.wobble ? Math.sin((t - Q.wobble) * 16) * interpolate(t, [Q.wobble, Q.slip], [1, 5], clamp) : 0;
  const slipK = prog(t, Q.slip, Q.crash, (x) => x * x);
  const crashed = t >= Q.crash;
  let base = 0;
  const items = TOWER.map((item, i) => {
    const y0 = base;
    base += item.h;
    if (i >= shown) return null;
    const flying = Q.feed[i - 2];
    let tx = 0;
    let ty = -y0;
    let rot = wob * (i / TOWER.length);
    let sc = 1;
    if (flying !== undefined && t < flying + 0.25) {
      const k = prog(t, flying, flying + 0.25, (x) => x);
      tx = interpolate(k, [0, 1], [-250, 0]);
      ty = interpolate(k, [0, 1], [-260, -y0]) - Math.sin(k * Math.PI) * 120;
      rot = (1 - k) * -30;
    } else if (flying !== undefined) {
      sc = pop(t, flying + 0.25, 0.25);
    }
    if (i >= 3 && t >= Q.slip) {
      const fallTo = [[200, -10], [290, 30], [370, -20]][i - 3];
      tx = interpolate(slipK, [0, 1], [0, fallTo[0]]);
      ty = interpolate(slipK, [0, 1], [-y0, 0]);
      rot = interpolate(slipK, [0, 1], [wob, 80 + fallTo[1]]);
      if (crashed) rot = 80 + fallTo[1];
    }
    return (
      <g key={i} transform={`translate(${TX + tx} ${GY + ty}) rotate(${rot}) scale(${sc} ${2 - sc})`}>
        <TowerItem item={item} />
      </g>
    );
  });
  const tossing = Q.feed.some((f) => t >= f - 0.15 && t < f + 0.1);
  const clap = Math.abs(Math.sin(t * 14)) * 14;
  const fans = t < Q.slip;
  return (
    <Frame camera={zoomTo(1.0, 540, 540)}>
      <Outdoors t={t} />
      {items}
      <Person x={330} y={GY} s={1.1}
        front={feeding ? (tossing ? [70, -250] : [44, -150]) : [30, -100]} back={feeding ? (tossing ? [30, -246] : [26, -150]) : [20, -104]}
        eyes={crashed ? "wide" : feeding ? "open" : "closed"} mouth={crashed ? "o" : feeding ? "smile" : "wavy"} look={2}>
        {!feeding && <SweatDrop x={50} y={-262} s={pop(t, Q.stopFeeding)} />}
      </Person>
      {[[940, "#5FB3B0"], [1030, "#C98F6A"]].map(([ox, col], i) => (
        <Person key={ox} x={ox + (fans ? 0 : prog(t, Q.slip, Q.slip + 0.8) * 200)} y={GY} s={0.72} dir={fans ? -1 : 1} pattern={false}
          colors={{ kimono: col, obi: "#F4F1E6" }} eyes={fans ? "open" : "closed"}
          front={fans && feeding ? [40, -150 + (i ? clap : -clap) * 0.3] : [32, -112]} back={fans && feeding ? [36, -152] : [22, -116]} />
      ))}
    </Frame>
  );
};

// ---------------------------------------------------------------- 9. is this my size?

export const SceneChoice = ({ start }) => {
  const t = useStoryTime(start);
  const turned = t >= Q.turn;
  const picked = t >= Q.pick;
  const z = prog(t, Q.pick, Q.pick + 1.6);
  return (
    <Frame camera={zoomTo(1 + z * 0.06, 540 + z * 70, 560)}>
      <ShojiRoom />
      <KimonoStand x={280} y={GY} s={0.95} {...FLASHY} />
      <g transform={`translate(905 ${GY}) scale(${picked ? pop(t, Q.pick, 0.4) : 1}) translate(-905 ${-GY})`}>
        <KimonoStand x={905} y={GY} s={0.6} />
      </g>
      <Person x={650} y={GY} s={0.95} dir={turned ? 1 : -1}
        eyes={picked ? "closed" : "open"} headTilt={turned ? 0 : -12} look={turned ? 2 : 1}
        front={picked ? [46, -130] : [32, -112]} />
      {t >= Q.wonder && !turned && (
        <Thought x={560} y={GY - 360} s={pop(t, Q.wonder)}>
          <InkText x={0} y={22} size={64}>?</InkText>
        </Thought>
      )}
      {picked && <Heart x={905} y={GY - 300 - prog(t, Q.pick, Q.pick + 1.2, easeOut) * 40} s={pop(t, Q.pick + 0.1) * 1.3} />}
    </Frame>
  );
};
