import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, X, Part, Line, Glow, Wash, QuestionMark, Shovel, roundRect, roundPoly, circle, ellipse, blob, poly, ramp, push, hitAt, absT, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  ChinaMap, chinaXY, PLACES, Ribbon, Sunburst, OilLamp, MercuryBowl, MercuryRiver, StarCeiling, CrossbowTrap, BurialMound, MoundSection, AncientShip,
  BambooSlips, DigWell, TreasureChest, JadeDisc, Ding, Jar, Coin, Flame, Smoke, RoundTree,
} from "../../kit/env";
import { sec, pop, scr, RibbonText, SpeechBubble, GrowArrow } from "../../kit/shot";
import { Plains, ThroneHall, TombCorridor, PalaceVault, Seascape } from "./sets";
import { EMPEROR, WORKER, OFFICIAL, GUARD, XU_FU, CHILD, VILLAGER, ARCHAEOLOGIST, SCIENTIST, SIMA_QIAN, COURT_DOCTOR } from "./cast";
import { upright, You, MagicIsland } from "./p1a";

// ───────────────────────── small props for this act ─────────────────────────

const Hourglass: React.FC<{ x: number; y: number; s?: number; z?: number; k: number }> = ({ x, y, s = 1, z = 0, k }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={roundRect(160, 24, 6)} color="#7a5232" shade={0.2} y={120} />
    <Part shape={roundRect(160, 24, 6)} color="#7a5232" shade={0.2} y={-120} />
    <Part shape={poly([[-60, 108], [60, 108], [8, 0], [60, -108], [-60, -108], [-8, 0]])} color="#dff2fa" flat outline={5} opacity={0.8} z={-0.01} />
    <Part shape={poly([[-50 * (1 - k), 100 - k * 90], [50 * (1 - k), 100 - k * 90], [6, 8], [-6, 8]])} color="#e9c66a" flat outline={0} z={0.001} />
    <Part shape={poly([[-56, -102], [56, -102], [56 * k, -102 + k * 80], [-56 * k, -102 + k * 80]])} color="#e9c66a" flat outline={0} z={0.001} />
    <Line pts={[[0, 6], [0, -100 + k * 70]]} width={4} color="#e9c66a" z={0.002} />
  </X>
);

/** Thought cloud. */
const Thought: React.FC<{ x: number; y: number; w?: number; h?: number; s?: number; tx: number; ty: number; z?: number }> = ({ x, y, w = 380, h = 260, s = 1, tx, ty, z = 0 }) =>
  s <= 0.001 ? null : (
    <X x={x} y={y} s={s} z={z}>
      <Part shape={blob(Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const r = i % 2 ? 0.92 : 1.06;
        return [Math.cos(a) * (w / 2) * r, Math.sin(a) * (h / 2) * r] as [number, number];
      }), 6)} color="#ffffff" flat outline={7} />
      {[0.55, 0.8].map((q, i) => (
        <Part key={q} shape={circle(18 - i * 7)} color="#ffffff" flat outline={5} x={((tx - x) / s) * q} y={((ty - y) / s) * q} />
      ))}
    </X>
  );

/** Shoulder pole with two baskets of earth. Origin = middle of the pole. */
const PoleBaskets: React.FC<{ x?: number; y?: number; rot?: number; s?: number; z?: number }> = ({ x = 0, y = 0, rot = 0, s = 1, z = 0 }) => (
  <X x={x} y={y} rot={rot} s={s} z={z}>
    <Line pts={[[-170, 0], [170, 0]]} width={10} color="#7a5232" />
    {[-1, 1].map((k) => (
      <X key={k} x={k * 150}>
        <Line pts={[[-30, -90], [0, 0], [30, -90]]} width={3} color="#5a3a26" />
        <Part shape={roundPoly([[-44, -150], [44, -150], [36, -90], [-36, -90]], 8)} color="#c9a274" shade={0.2} />
        <Part shape={ellipse(40, 16)} color="#8a6240" shade={0.2} y={-90} z={0.001} />
      </X>
    ))}
  </X>
);

/** Bone-white skeleton lying on its back (head toward -x). */
export const Bones: React.FC<{ x: number; y: number; s?: number; rot?: number; z?: number }> = ({ x, y, s = 1, rot = 0, z = 0 }) => {
  const B = "#efe6cf";
  return (
    <X x={x} y={y} s={s} rot={rot} z={z}>
      <Part shape={circle(26)} color={B} shade={0.15} x={-84} />
      {[-10, 10].map((ey) => (
        <Part key={ey} shape={circle(6)} color="#3a2a22" flat outline={0} x={-90} y={ey} z={0.001} />
      ))}
      <Line pts={[[-58, 0], [40, 0]]} width={7} color={B} />
      {[-40, -26, -12].map((rx) => (
        <Line key={rx} pts={[[rx - 6, -22], [rx + 4, 0], [rx - 6, 22]]} smooth width={5} color={B} />
      ))}
      <Line pts={[[-40, -24], [0, -44], [30, -38]]} width={5} color={B} />
      <Line pts={[[-40, 24], [0, 44], [30, 38]]} width={5} color={B} />
      <Part shape={roundRect(26, 40, 10)} color={B} shade={0.15} x={44} />
      <Line pts={[[50, -12], [110, -20], [150, -18]]} width={6} color={B} />
      <Line pts={[[50, 12], [110, 20], [150, 18]]} width={6} color={B} />
    </X>
  );
};

/** Water-driven machine (gear wheel). */
const Gear: React.FC<{ x: number; y: number; r?: number; rot: number; z?: number }> = ({ x, y, r = 90, rot, z = 0 }) => (
  <X x={x} y={y} rot={rot} z={z}>
    <Part shape={poly(Array.from({ length: 24 }, (_, i) => {
      const a = (i / 24) * Math.PI * 2;
      const rr = i % 2 ? r : r * 0.82;
      return [Math.cos(a) * rr, Math.sin(a) * rr] as [number, number];
    }))} color="#8a6a3e" shade={0.2} />
    <Part shape={circle(r * 0.3)} color="#5a3a26" flat outline={4} z={0.001} />
  </X>
);

/** The mysterious "man-fish" (a fish with a human face). */
const ManFish: React.FC<{ x: number; y: number; s?: number; z?: number }> = ({ x, y, s = 1, z = 0 }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={blob([[-180, 0], [-60, 70], [100, 60], [180, 0], [100, -60], [-60, -70]], 8)} color="#8aa8b8" shade={0.22} />
    <Part shape={poly([[-170, 0], [-260, 70], [-240, 0], [-260, -70]])} color="#7a98a8" shade={0.2} z={-0.01} />
    <Part shape={circle(46)} color="#f6f5f8" shade={0.2} x={110} y={6} z={0.01} />
    {[-14, 14].map((ex) => (
      <Part key={ex} shape={circle(7)} color="#211b20" flat outline={0} x={110 + ex} y={14} z={0.02} />
    ))}
    <Line pts={[[96, -12], [110, -16], [124, -12]]} width={4} z={0.02} />
  </X>
);

/** Cartoon whale (side view, facing +x). */
const Whale: React.FC<{ x: number; y: number; s?: number; z?: number }> = ({ x, y, s = 1, z = 0 }) => (
  <X x={x} y={y} s={s} z={z}>
    <Part shape={blob([[-260, 20], [-120, 110], [140, 100], [260, 20], [200, -60], [-100, -70]], 10)} color="#4a6a8a" shade={0.22} />
    <Part shape={blob([[-120, -40], [140, -40], [200, -50], [-80, -66]], 8)} color="#c9d8e2" flat outline={0} z={0.001} />
    <Part shape={poly([[-250, 20], [-360, 110], [-330, 20], [-360, -60]])} color="#3f5a78" shade={0.2} z={-0.01} />
    <Part shape={circle(9)} color="#211b20" flat outline={0} x={170} y={36} z={0.01} />
    <Line pts={[[60, 110], [50, 190]]} width={6} color="#bfe6f6" z={0.01} />
    <Line pts={[[60, 110], [90, 180]]} width={6} color="#bfe6f6" z={0.01} />
  </X>
);

// ───────────────────────── chasing immortality ─────────────────────────

// 135.75 "He survives. But from now on, he can't stop thinking about death."
export const ThinkingDeathShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 0 }} light={{ pos: [300, 0] }} shadowMul={[0.5, 0.45, 0.6]} vignette={0.75} vignetteColor="#04060c">
        <ThroneHall floorY={-460} throne={false} dim={0.4}>
          <Character {...EMPEROR} x={-280} y={-560} s={1.3} z={2} look={0.5} expression={t > 137 ? { eyes: "wide", mouth: "wavy", brows: 0.8, sweat: true } : { eyes: "open", mouth: "smile", brows: 0 }} pose={poses.think} />
          <Thought x={300} y={260} w={360} h={300} tx={-120} ty={60} s={pop(t, 138.2)} z={8} />
          {t > 138.3 ? <Hourglass x={300} y={260} s={0.8} k={ramp(t, 138.3, 139.6)} z={9} /> : null}
        </ThroneHall>
      </Stage>
    </AbsoluteFill>
  );
};

// 139.65 "So he goes looking for a way to never die."
export const NeverDieShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: 20 }} light={{ pos: [0, 300] }}>
        <ThroneHall floorY={-460}>
          <Character {...EMPEROR} x={-200} y={-560} s={1.25} z={2} look={0.5} talking expression={{ eyes: "angry", mouth: "shout", brows: -0.6 }} pose={poses.point(frame)} />
          {[260, 560].map((x, i) => (
            <Character key={x} {...OFFICIAL(i + 1)} x={x} y={-560} s={1.05} z={2} facing={-1} look={0.5} expression={{ eyes: "wide", mouth: "o", brows: 0.6 }} pose={poses.idle(frame, i)} />
          ))}
        </ThroneHall>
      </Stage>
      <Label text="LIVE FOREVER?" x={0.66} y={0.16} size={0.07} kind="box" at={sec(start)(141.2)} />
    </AbsoluteFill>
  );
};

// 142.15 "He hears about magic islands in the eastern sea, where people live forever."
export const MagicIslandsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 60 }} light={{ dir: [0.6, 0.5] }}>
        <Seascape mood="dawn" horizon={-60}>
          <MagicIsland x={-320} y={-60} s={1.1} z={-20} />
          <MagicIsland x={460} y={-60} s={0.7} z={-21} />
          {[0, 1, 2].map((i) => (
            <X key={i} x={-600 + ((frame * 3 + i * 300) % 1400)} y={260 + i * 40 + Math.sin(frame * 0.1 + i) * 10} s={0.5} z={2}>
              <Line pts={[[-60, 0], [0, 20], [60, 0]]} smooth width={10} color="#f4f1ea" />
            </X>
          ))}
        </Seascape>
      </Stage>
      <Label text="ISLANDS OF THE IMMORTALS" x={0.5} y={0.12} size={0.06} kind="box" at={sec(start)(143.3)} />
    </AbsoluteFill>
  );
};

// 146.45 "So he sends a man named Xu Fu to find them."
export const XuFuShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: 20 }} light={{ pos: [0, 300] }}>
        <ThroneHall floorY={-460}>
          <Character {...EMPEROR} x={0} y={-292} s={1.0} z={2} look={0.3} expression={{ eyes: "half", mouth: "smile", brows: -0.2 }} pose={poses.sit(frame)} />
          <Character {...XU_FU} x={-480} y={-560} s={1.2} z={3} look={0.5} expression={{ eyes: "closed", mouth: "smile", brows: 0.1 }} pose={{ ...poses.idle(frame), lean: -0.25, armF: [1.2, 1.6], armB: [1.0, 1.6] }} />
        </ThroneHall>
      </Stage>
      <Label text="XU FU" x={0.24} y={0.14} size={0.08} kind="title" at={sec(start)(147.7)} />
    </AbsoluteFill>
  );
};

// 149.05 "Thousands of young boys and girls sail with him."
export const ChildrenSailShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: 40 }} light={{ dir: [0.6, 0.5] }}>
        <Seascape mood="day" horizon={-60}>
          {[0, 1, 2, 3].map((i) => (
            <AncientShip key={i} x={-760 + i * 420 + frame * 2} y={-150 - (i % 2) * 70} len={560 - (i % 2) * 120} heads={6} z={2 - (i % 2) * 0.2} />
          ))}
          <Part shape={poly([[-1400, -600], [-200, -600], [-420, -330], [-1400, -300]])} color="#d9c08a" shade={0.12} z={3} />
          {[0, 1, 2].map((i) => (
            <Character key={i} {...CHILD(i)} x={-820 + i * 130} y={-470} s={0.8} z={4} look={0.5} expression={{ eyes: "happy", mouth: "grin" }} pose={{ armF: [2.6 + Math.sin(frame * 0.3 + i) * 0.3, 0.3], armB: [-0.2, -0.1], armsOverHead: true }} />
          ))}
        </Seascape>
      </Stage>
    </AbsoluteFill>
  );
};

// 151.55 "They never come back."
export const NeverBackShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.04), y: 40 }} light={{ dir: [0.6, 0.4] }} vignette={0.6}>
        <Seascape mood="dusk" horizon={-60}>
          <AncientShip x={300 + frame * 0.6} y={-60} len={160} heads={2} s={1 - ramp(t, 151.6, 152.9) * 0.6} z={1} />
          <Wash width={4000} height={900} color="#d8d4e2" alpha={0.35 + ramp(t, 151.6, 152.9) * 0.4} z={3} />
        </Seascape>
      </Stage>
    </AbsoluteFill>
  );
};

// 152.95 "In Japan, there's a legend that they landed there and stayed."
export const JapanLegendShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const zoom = push(frame, dur, 1.0, 1.06);
  const ppd = 52;
  const center: [number, number] = [126.5, 34];
  const route: [number, number][] = [PLACES.langya, [122.5, 35], [126, 33.4], [129.3, 33.6], [132.5, 33.3], [135.4, 33.6]];
  const k = ramp(t, 153.2, 155.6);
  const [jx, jy] = chinaXY(136, 35.5, ppd, center);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom }} light={{ dir: [-0.6, 0.8] }}>
        <ChinaMap ppd={ppd} center={center} route={route} routeK={k} dots={[PLACES.langya]} />
        <Ribbon x={jx} y={jy + 120} w={260} h={64} z={5} />
      </Stage>
      <RibbonText text="JAPAN" x={jx} y={jy + 120} zoom={zoom} at={sec(start)(153.2)} />
      <Label text="LEGEND" x={0.82} y={0.62} size={0.06} kind="stamp" rotate={-8} at={sec(start)(154.2)} />
    </AbsoluteFill>
  );
};

// 156.65 "He also sends an order to every corner of his empire."
export const EveryCornerShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const ppd = 42;
  const center: [number, number] = [112, 33];
  const from = chinaXY(...PLACES.xianyang, ppd, center);
  const targets: [number, number][] = [[103, 30], [111, 39.5], [118.5, 39.8], [120.5, 36.5], [119.5, 30.5], [113, 25.8]];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.0) }} light={{ dir: [-0.6, 0.8] }}>
        <ChinaMap ppd={ppd} center={center} kingdoms conquered={["qin", "han", "zhao", "wei", "chu", "yan", "qi"]} dots={[PLACES.xianyang]} />
        {targets.map((tg, i) => {
          const to = chinaXY(tg[0], tg[1], ppd, center);
          return <GrowArrow key={i} pts={[from, to]} k={ramp(t, 157.0 + i * 0.25, 157.7 + i * 0.25)} color="#e9c66a" width={14} z={4} />;
        })}
      </Stage>
    </AbsoluteFill>
  );
};

/** Village square with simple houses. */
const Village: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <Plains mood="day" horizon={-60}>
    {[-720, 700].map((x) => (
      <X key={x} x={x} y={-64} z={-20}>
        <Part shape={roundRect(360, 200, 4)} color="#d9c49a" shade={0.2} y={100} />
        <Part shape={poly([[-220, 200], [220, 200], [170, 290], [-170, 290]])} color="#5a4a3e" shade={0.2} z={0.001} />
        <Part shape={roundRect(70, 120, 3)} color="#5a4030" flat outline={4} y={60} z={0.002} />
      </X>
    ))}
    {children}
  </Plains>
);

// 159.95 "Find the medicine that lets people live forever."
export const DecreeShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const arm: [number, number] = [1.6, 0.3];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -20 }} light={{ dir: [-0.6, 0.8] }}>
        <Village>
          <Character {...OFFICIAL(3)} x={-320} y={-560} s={1.2} z={3} look={0.5} talking expression={{ eyes: "half", mouth: "shout", brows: -0.3 }} pose={{ armF: arm, armB: arm }} holdF={<BambooSlips rot={upright(arm)} n={8} s={0.55} />} />
          {[0, 1, 2].map((i) => (
            <Character key={i} {...VILLAGER(i)} x={220 + i * 220} y={-560 - (i % 2) * 20} s={1.0} z={2 + i * 0.01} facing={-1} look={0.5} expression={{ eyes: "wide", mouth: "o", brows: 0.6 }} pose={poses.idle(frame, i)} />
          ))}
        </Village>
      </Stage>
      <Label text="FIND THE ELIXIR OF LIFE" x={0.5} y={0.12} size={0.06} kind="box" at={sec(start)(160.5)} />
    </AbsoluteFill>
  );
};

// 163.15 "In 2002, archaeologists found some of the answers in an old well."
export const OldWellShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const pull = ramp(t, 163.6, 166.6);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -20 }} light={{ dir: [-0.6, 0.8] }}>
        <Plains mood="day" horizon={-60}>
          <DigWell x={40} y={-460} s={0.85} pull={pull} z={1} />
          {pull > 0.6 ? <BambooSlips x={40} y={-460 + pull * 130 + 60} n={6} s={0.35} z={1.5} /> : null}
          <Character {...ARCHAEOLOGIST(0)} x={-420} y={-580} s={1.15} z={2} look={0.5} expression={{ eyes: "wide", mouth: "grin", brows: 0.4 }} pose={{ armF: [1.4, 0.6], armB: [1.2, 0.8] }} />
          <Character {...ARCHAEOLOGIST(1)} x={480} y={-580} s={1.15} z={2} facing={-1} look={0.5} expression={{ eyes: "wide", mouth: "o", brows: 0.6 }} pose={poses.idle(frame)} />
        </Plains>
      </Stage>
      <Label text="2002" x={0.2} y={0.14} size={0.08} kind="box" at={sec(start)(163.4)} />
    </AbsoluteFill>
  );
};

// 167.55 "One village wrote back that it hadn't found it yet, but it would keep looking."
export const NotFoundYetShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const b = pop(t, 169.4);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.08, y: -40 }} light={{ dir: [-0.6, 0.8] }}>
        <Village>
          <Character {...VILLAGER(1)} x={-300} y={-560} s={1.3} z={2} look={0.5} talking={t > 169.4} expression={{ eyes: "happy", mouth: "grin", brows: 0.4, sweat: true }} pose={{ armF: [1.5, 0.8], armB: [1.3, 0.9] }} holdF={<BambooSlips rot={upright([1.5, 0.8])} n={5} s={0.45} />} />
          <SpeechBubble x={360} y={200} w={720} h={260} tx={-120} ty={60} s={b} z={10} />
        </Village>
      </Stage>
      {b > 0 ? <Label text={"NOT FOUND YET...\nSTILL LOOKING!"} x={0.5 + 360 * 1.08 / 1920} y={0.5 - (200 + 40) * 1.08 / 1080} size={0.05} color="#211b20" at={0} /> : null}
    </AbsoluteFill>
  );
};

/** Basket of green herbs. Origin = bottom. */
const HerbBasket: React.FC<{ rot?: number; s?: number }> = ({ rot = 0, s = 1 }) => (
  <X rot={rot} s={s}>
    <Part shape={roundPoly([[-70, 0], [70, 0], [90, 80], [-90, 80]], 10)} color="#c9a274" shade={0.2} />
    {[-50, -16, 18, 52].map((x, i) => (
      <Part key={x} shape={blob([[x - 20, 70], [x, 150 + (i % 2) * 30], [x + 20, 70]], 6)} color={i % 2 ? "#5a9a46" : "#6aa852"} shade={0.2} z={-0.01} />
    ))}
  </X>
);

// 171.25 "Another sent herbs from a local mountain."
export const HerbsShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const arm: [number, number] = [1.5, 0.4];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -20 }} light={{ dir: [-0.6, 0.8] }}>
        <Plains mood="day" horizon={-120}>
          <Character {...VILLAGER(2)} x={-160} y={-560} s={1.3} z={2} look={0.5} expression={{ eyes: "happy", mouth: "grin", brows: 0.2 }} pose={{ armF: arm, armB: arm }} holdF={<HerbBasket rot={upright(arm)} s={0.9} />} />
        </Plains>
      </Stage>
    </AbsoluteFill>
  );
};

// 173.4 "And he takes pills that are supposed to keep him alive forever."
export const PillsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const k = ramp(t, 174.0, 174.8);
  const arm: [number, number] = [interpolate(k, [0, 1], [1.2, 2.6]), interpolate(k, [0, 1], [0.6, 1.8])];
  const s = 2.0;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ pos: [300, 200] }} vignette={0.6}>
        <ThroneHall floorY={-760} throne={false} dim={0.25} />
        <Character {...EMPEROR} x={-160} y={-20 - 308 * s} s={s} z={2} look={0.4} expression={k > 0.9 ? { eyes: "closed", mouth: "o", brows: 0.1 } : { eyes: "open", mouth: "smile", brows: 0 }} pose={{ armF: arm, armB: [-0.2, -0.1] }} holdF={k < 0.95 ? <Part shape={circle(16)} color="#4a3a32" shade={0.25} /> : null} />
        <MercuryBowl x={420} y={-420} s={1.6} pills z={3} />
      </Stage>
    </AbsoluteFill>
  );
};

// 176.45 "Some historians think those pills had mercury in them."
export const PillMercuryShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.8] }} vignette={0.5}>
        <Sunburst r={2600} rays={20} color="#5a5a6a" alt="#52525f" speed={0.4} z={-40} />
        <Character {...SCIENTIST(0)} x={-520} y={-600} s={1.3} z={2} look={0.5} expression={{ eyes: "open", mouth: "smile", brows: -0.2 }} pose={poses.point(frame)} />
        <MercuryBowl x={200} y={-300} s={2.6} pills z={2} />
        {[0, 1, 2].map((i) => (
          <Part key={i} shape={circle(14 - i * 3)} color="#d6dee6" shade={0.15} x={120 + i * 70} y={-80 - ((frame * 2 + i * 30) % 60)} z={3} />
        ))}
      </Stage>
      <Label text="MERCURY?" x={0.62} y={0.18} size={0.08} kind="stamp" rotate={-8} at={sec(start)(178.4)} />
    </AbsoluteFill>
  );
};

// 179.45 "In ancient China, people thought this shiny liquid metal could help you live forever."
export const LiquidMetalShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -20 }} light={{ pos: [0, 300] }} vignette={0.6}>
        <ThroneHall floorY={-460} throne={false} dim={0.3}>
          <Character {...COURT_DOCTOR} x={-360} y={-560} s={1.3} z={2} look={0.5} expression={{ eyes: "happy", mouth: "grin", brows: -0.2 }} pose={{ armF: [1.8, 0.4], armB: [1.4, 0.8] }} />
          <MercuryBowl x={240} y={-460} s={2.2} z={3} />
          <Glow x={240} y={-340} rx={300} color="#e9f2ff" alpha={0.35 + Math.sin(frame * 0.2) * 0.1} additive z={3.5} />
        </ThroneHall>
      </Stage>
      <Label text="LIQUID METAL" x={0.62} y={0.16} size={0.07} kind="box" at={sec(start)(182.2)} />
      <Label text="= LIVE FOREVER?" x={0.62} y={0.28} size={0.05} at={sec(start)(183.1)} />
    </AbsoluteFill>
  );
};

// 183.95 "The medicine meant to save him may have helped kill him."
export const KillHimShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const sick = ramp(t, 185.6, 186.5);
  const s = 2.1;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), shake: sick * 2 }} light={{ pos: [300, 100] }} shadowMul={[0.5, 0.45, 0.6]} vignette={0.75} vignetteColor="#04060c">
        <ThroneHall floorY={-760} throne={false} dim={0.4} />
        <Character {...EMPEROR} skin={sick > 0.5 ? "#d4e2c0" : undefined} x={-80} y={-20 - 308 * s} s={s} z={2} look={0.4} expression={sick > 0 ? { eyes: "half", mouth: "wavy", brows: 0.8, sweat: true, eyebags: true } : { eyes: "open", mouth: "flat", brows: 0.2 }} pose={{ armF: [0.6, 1.4], armB: [0.5, 1.2], headTilt: -sick * 0.15 }} />
      </Stage>
    </AbsoluteFill>
  );
};

// 186.85 "Remember that mercury. It's coming back."
export const RememberShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.15) }} light={{ dir: [-0.6, 0.8] }} vignette={0.7}>
        <Part shape={roundRect(4000, 3000, 0)} color="#1a1e2a" flat outline={0} z={-40} />
        <Glow rx={500} color="#dfe8f2" alpha={0.35} additive z={-30} />
        <X y={-40} s={3} z={1}>
          <Part shape={blob([[0, 120], [60, 20], [70, -40], [36, -80], [-36, -80], [-70, -40], [-60, 20]], 8)} color="#c4ced8" shade={0.2} />
          <Part shape={ellipse(14, 26)} color="#ffffff" flat outline={0} x={-30} y={-10} rot={0.4} z={0.01} />
        </X>
      </Stage>
      <Label text="REMEMBER THIS" x={0.5} y={0.14} size={0.07} kind="box" at={sec(start)(187.0)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── building the tomb ─────────────────────────

/** Crowd of tiny workers hauling earth (wide shots). */
const TinyCrew: React.FC<{ n: number; w: number; y: number; seed?: number; z?: number }> = ({ n, w, y, seed = 1, z = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <X y={y} z={z}>
      {Array.from({ length: n }, (_, i) => {
        const x = -w / 2 + ((i * 97 + seed * 31 + frame * (i % 2 ? 1.2 : -1.2)) % w + w) % w;
        return (
          <X key={i} x={x} y={(i % 3) * 30} s={0.32} z={i * 0.001}>
            <Part shape={roundRect(70, 100, 16)} color="#c9b28a" shade={0.2} y={60} />
            <Part shape={circle(36)} color="#f6f5f8" shade={0.2} y={140} z={0.001} />
            <Part shape={roundRect(76, 22, 10)} color={["#c8662f", "#8a8790", "#7a5a3e"][i % 3]} flat outline={4} y={168} z={0.002} />
            {i % 2 ? <PoleBaskets y={120} s={0.4} z={0.003} /> : null}
          </X>
        );
      })}
    </X>
  );
};

// 189.2 "Meanwhile, the work on his tomb never stops."
export const WorkNeverStopsShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 60 }} light={{ dir: [0.6, 0.5] }}>
        <Plains mood="day" horizon={-160} mound="build" moundS={1.2}>
          <TinyCrew n={24} w={1900} y={-420} z={2} />
        </Plains>
      </Stage>
    </AbsoluteFill>
  );
};

// 192.05 "So, 700,000 men dig for over 30 years."
export const SevenHundredKShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.0), y: 0 }} light={{ dir: [0.6, 0.5] }}>
        <Plains mood="day" horizon={140}>
          <Part shape={poly([[-1300, 140], [1300, 140], [1000, -500], [-1000, -500]])} color="#a87a50" shade={0.15} z={-10} />
          {[0, 1, 2, 3].map((r) => (
            <TinyCrew key={r} n={18 - r * 2} w={1700 - r * 220} y={-440 + r * 150} seed={r + 2} z={r * -0.1} />
          ))}
          <X x={-640} y={140} z={3}>
            <Line pts={[[0, 0], [0, 200]]} width={10} color="#6e4a2c" />
            <Part shape={roundRect(260, 90, 8)} color="#c9a274" shade={0.15} y={220} z={0.01} />
          </X>
        </Plains>
      </Stage>
      <Label text="700,000 MEN" x={0.26} y={0.14} size={0.075} kind="title" at={sec(start)(192.8)} />
      <Label text="30+ YEARS" x={0.78} y={0.14} size={0.07} kind="box" at={sec(start)(194.5)} />
    </AbsoluteFill>
  );
};

// 195.55 "Most of them aren't volunteers."
export const NotVolunteersShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const s = 1.3;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.1), y: -40 }} light={{ dir: [0.6, 0.5] }}>
        <Plains mood="dusk" horizon={-80} mound="build" moundX={300}>
          <X x={-180 + frame * 1.2} y={-580} z={3}>
            <Character {...WORKER(1)} s={s} look={0.5} expression={{ eyes: "half", mouth: "frown", brows: 0.7, sweat: true, eyebags: true }} pose={{ ...poses.walk(frame, 0.5), armF: [2.6, 0.4], armB: [2.6, 0.4], armsOverHead: true, lean: -0.1 }} />
            <PoleBaskets y={232 * s} rot={0.05} s={1.1} z={0.5} />
          </X>
          <Character {...GUARD(1)} x={560} y={-580} s={1.25} z={2} facing={-1} look={0.5} expression={{ eyes: "angry", mouth: "shout", brows: -0.8 }} pose={poses.point(frame)} />
        </Plains>
      </Stage>
    </AbsoluteFill>
  );
};

// 197.6 "They're prisoners and forced workers."
export const PrisonersShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -20 }} light={{ dir: [0.6, 0.5] }}>
        <Plains mood="dusk" horizon={-80}>
          {[0, 1, 2, 3].map((i) => (
            <Character key={i} {...WORKER(i + 1)} x={-760 + i * 300 + frame * 1.5} y={-560} s={1.0} z={2 + i * 0.01} look={0.5} expression={{ eyes: "half", mouth: "frown", brows: 0.7 }} pose={{ ...poses.walk(frame + i * 5, 0.5), armF: [0.9, 1.6], armB: [0.9, 1.6] }} />
          ))}
          <Line pts={Array.from({ length: 5 }, (_, i) => [-760 + i * 300 + frame * 1.5 + 40, -300] as [number, number])} width={6} color="#8a6a3e" z={2.5} />
          <Character {...GUARD(0)} x={560 + frame * 1.5} y={-560} s={1.15} z={2.2} look={0.5} expression={{ eyes: "angry", mouth: "flat", brows: -0.6 }} pose={poses.walk(frame, 0.5)} />
        </Plains>
      </Stage>
      <Label text="PRISONERS" x={0.3} y={0.13} size={0.065} kind="stamp" rotate={-8} at={sec(start)(198.0)} />
    </AbsoluteFill>
  );
};

// 200.0 "Many of them die on the job and get dumped in pits right next to it."
export const DumpedPitsShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -20 }} light={{ dir: [0.6, 0.4] }} shadowMul={[0.55, 0.5, 0.62]} vignette={0.7}>
        <Plains mood="dusk" horizon={-60} mound="build" moundX={500} moundS={0.8}>
          <Part shape={ellipse(380, 70)} color="#3a2a22" flat outline={5} x={440} y={-560} z={1} />
          <X x={-160 + frame * 1.2} y={-560} z={2}>
            {[-200, 200].map((cx, i) => (
              <Character key={cx} {...WORKER(i + 2)} x={cx} y={0} s={1.0} facing={1} look={0.4} expression={{ eyes: "half", mouth: "frown", brows: 0.8 }} pose={{ ...poses.walk(frame + i * 6, 0.4), armF: [1.6, 0.2], armB: [1.6, 0.2] }} />
            ))}
            <X y={230} z={0.5}>
              <Part shape={roundRect(520, 26, 6)} color="#7a5232" shade={0.2} />
              <Part shape={blob([[-180, 10], [-160, 50], [160, 50], [190, 10]], 8)} color="#d9cfb8" shade={0.2} z={0.01} />
            </X>
          </X>
        </Plains>
      </Stage>
    </AbsoluteFill>
  );
};

// 203.75 "Archaeologists have found some of those pits."
export const FoundPitsShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -20 }} light={{ dir: [-0.6, 0.8] }}>
        <Plains mood="day" horizon={-60}>
          <Part shape={roundRect(1200, 220, 20)} color="#8a6240" shade={0.15} y={-380} z={1} />
          <Character {...ARCHAEOLOGIST(0)} x={-300} y={-520} s={1.1} z={2} look={0.5} expression={{ eyes: "half", mouth: "flat", brows: 0.3, gaze: [0.5, -0.8] }} pose={{ ...poses.sit(frame), armF: [1.2, 0.8] }} />
          <Character {...ARCHAEOLOGIST(2)} x={320} y={-520} s={1.1} z={2} facing={-1} look={0.5} expression={{ eyes: "open", mouth: "o", brows: 0.5 }} pose={poses.think} />
        </Plains>
      </Stage>
    </AbsoluteFill>
  );
};

// 206.25 "One of them held 121 skeletons."
export const SkeletonsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const n = Math.round(ramp(t, 206.6, 207.9) * 40);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ dir: [-0.6, 0.8] }} vignette={0.6}>
        <Part shape={roundRect(4000, 3000, 0)} color="#7a5a40" flat outline={0} z={-40} />
        {Array.from({ length: n }, (_, i) => (
          <Bones key={i} x={-760 + (i % 8) * 210} y={300 - Math.floor(i / 8) * 150} s={0.9} rot={(i % 3) * 0.2 - 0.2} z={i * 0.01} />
        ))}
      </Stage>
      <Label text="121" x={0.5} y={0.2} size={0.14} kind="title" at={sec(start)(207.2)} />
    </AbsoluteFill>
  );
};

// 209.0 "Under a huge man-made hill, they build him a palace with rivers of mercury."
export const PalaceUnderHillShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, dur], [0.85, 1.25], { easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, y: interpolate(frame, [0, dur], [0, -260]) }} light={{ dir: [0.6, 0.5] }}>
        <Plains mood="day" horizon={200}>
          <MoundSection y={200} w={1900} depth={820} stage="build" z={-20} />
        </Plains>
      </Stage>
    </AbsoluteFill>
  );
};

// 213.55 "And they hide crossbows that fire by themselves at anyone who breaks in."
export const TrapTestShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const fire = ramp(t, 215.4, 215.7);
  const hit = t > 215.7;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.05, y: -40, shake: hitAt(t, 215.7, 0.3) * 6 }} light={{ pos: [-300, 300] }} vignette={0.6}>
        <TombCorridor floorY={-460}>
          <CrossbowTrap x={-600} y={-480} s={1.2} fire={hit ? 0 : fire} range={980} z={2} />
          <X x={460} y={-460} rot={hit ? -0.12 : 0} z={2}>
            <Line pts={[[0, 0], [0, 300]]} width={12} color="#6e4a2c" />
            <Part shape={roundRect(130, 220, 40)} color="#d9b866" shade={0.2} y={330} z={0.01}>
              {[260, 330, 400].map((y) => (
                <Line key={y} pts={[[-60, y], [60, y]]} width={4} color="#a8823a" z={0.001} />
              ))}
            </Part>
            <Part shape={circle(50)} color="#d9b866" shade={0.2} y={480} z={0.01} />
            {hit ? (
              <X x={-40} y={340} z={0.02}>
                <Line pts={[[0, 0], [-130, 0]]} width={6} color="#3a2a20" />
                <Part shape={poly([[-130, 0], [-148, 12], [-140, 0], [-148, -12]])} color="#c8262f" flat outline={2.5} />
              </X>
            ) : null}
          </X>
          <Character {...WORKER(0)} x={-60} y={-600} s={1.15} z={3} look={0.5} expression={hit ? { eyes: "happy", mouth: "grin" } : { eyes: "open", mouth: "smirk" }} pose={hit ? poses.armsUp(frame) : poses.point(frame)} />
        </TombCorridor>
      </Stage>
    </AbsoluteFill>
  );
};

/** Height arrow with end bars. */
const Measure: React.FC<{ x: number; y0: number; y1: number; k: number; z?: number }> = ({ x, y0, y1, k, z = 0 }) => (
  <X x={x} z={z}>
    <Line pts={[[0, y0], [0, y0 + (y1 - y0) * k]]} width={8} color="#fe5649" />
    <Line pts={[[-30, y0], [30, y0]]} width={8} color="#fe5649" />
    {k >= 1 ? <Line pts={[[-30, y1], [30, y1]]} width={8} color="#fe5649" /> : null}
  </X>
);

// 217.65 "Even today, after 2,000 years of rain, that hill is 76 meters tall."
export const SeventySixShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const rain = 1 - ramp(t, 220.5, 221.2);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.04), y: 60 }} light={{ dir: [0.6, 0.5] }}>
        <Plains mood="day" horizon={-200} mound="done" moundS={1.25}>
          <Measure x={760} y0={-200} y1={-200 + 420 * 1.25} k={ramp(t, 221.0, 221.6)} z={5} />
          {rain > 0
            ? Array.from({ length: 50 }, (_, i) => {
                const x = ((i * 137) % 2200) - 1100;
                const y = 600 - ((frame * 26 + i * 97) % 1300);
                return <Line key={i} pts={[[x, y], [x - 10, y - 40]]} width={4} color="#bcd6e8" opacity={0.7 * rain} z={20} />;
              })
            : null}
          {rain > 0 ? <Wash width={4000} height={3000} color="#3a4a5a" alpha={0.3 * rain} z={19} /> : null}
        </Plains>
      </Stage>
      <Label text="2,000 YEARS OF RAIN" x={0.26} y={0.14} size={0.055} kind="box" at={sec(start)(219.1)} />
      <Label text="76 M" x={0.5 + 640 / 1920} y={0.36} size={0.08} kind="title" at={sec(start)(221.6)} />
    </AbsoluteFill>
  );
};

// 223.35 "That's about as tall as a 25-story building."
export const TowerCompareShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const rise = ramp(t, 224.0, 225.0, Easing.out(Easing.cubic));
  const H = 520;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.04), y: 60 }} light={{ dir: [0.6, 0.5] }}>
        <Plains mood="day" horizon={-200} mound="done" moundX={-360} moundS={1.25}>
          <X x={520} y={-200} sy={Math.max(0.001, rise)} z={2}>
            <Part shape={roundRect(260, H, 6)} color="#8a96a8" shade={0.22} y={H / 2} />
            {Array.from({ length: 25 }, (_, i) => (
              <X key={i} y={10 + i * (H / 25)} z={0.001}>
                {[-80, -27, 27, 80].map((wx) => (
                  <Part key={wx} shape={roundRect(34, 10, 2)} color="#cfe6f2" flat outline={2} x={wx} y={8} />
                ))}
              </X>
            ))}
          </X>
        </Plains>
      </Stage>
      <Label text="25 FLOORS" x={0.5 + 520 / 1920} y={0.2} size={0.06} kind="box" at={sec(start)(224.6)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── Sima Qian ─────────────────────────

// 226.35 "So how do we know what's inside?"
export const HowKnowShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: 40 }} light={{ dir: [0.6, 0.5] }}>
        <Plains mood="day" horizon={-160} mound="done" moundS={1.2}>
          <QuestionMark x={0} y={420} s={1.2 * pop(t, 227.0)} rot={0.1} z={10} />
        </Plains>
      </Stage>
    </AbsoluteFill>
  );
};

// 228.05 "About a hundred years later, a historian named Sima Qian wrote it down."
export const SimaQianShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const write = Math.sin(frame * 0.5) * 0.1;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -20 }} light={{ pos: [300, 100] }} vignette={0.6}>
        <ThroneHall floorY={-460} throne={false} dim={0.35}>
          <Character {...SIMA_QIAN} x={-300} y={-560} s={1.3} z={2} look={0.5} expression={{ eyes: "half", mouth: "flat", brows: 0.1, gaze: [0.6, -0.8] }} pose={{ ...poses.sit(frame), armF: [1.4 + write, 0.8] }} />
          <BambooSlips x={160} y={-280} open={ramp(t, 228.2, 231.9)} n={12} s={0.85} z={3} />
          <X x={460} y={-420} z={3}>
            <OilLamp />
          </X>
        </ThroneHall>
      </Stage>
      <Label text="~100 YEARS LATER" x={0.24} y={0.12} size={0.05} kind="box" at={sec(start)(228.2)} />
      <Label text="SIMA QIAN" sub="HISTORIAN" x={0.7} y={0.14} size={0.075} kind="title" at={sec(start)(230.9)} />
    </AbsoluteFill>
  );
};

// 232.65 "He says the ceiling shows the stars."
export const CeilingStarsShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.1) }} light={{ dir: [-0.6, 0.8] }} vignette={0.6} vignetteColor="#04060c">
        <StarCeiling w={2600} h={1400} seed={12} z={-40} />
      </Stage>
    </AbsoluteFill>
  );
};

// 235.25 "The floor shows the whole empire, with rivers and seas of mercury, kept moving by machines."
export const MercuryEmpireShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const spin = t > 239.9 ? (t - 239.9) * 2 : 0;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 1.0) }} light={{ dir: [-0.6, 0.8] }} vignette={0.6} vignetteColor="#04060c">
        <ChinaMap ppd={40} center={[113, 33]} sea="#b8c4d0" land="#5a5048" china="#6a5e52" kingdoms={false} waves />
        {Array.from({ length: 30 }, (_, i) => {
          const x = ((i * 211 + frame * 4) % 2400) - 1200;
          const y = ((i * 137) % 1200) - 600;
          return <Line key={i} pts={[[x, y], [x + 40, y]]} width={5} color="#ffffff" opacity={0.6} z={3} />;
        })}
        {[[-760, -360], [760, -360], [-760, 360], [760, 360]].map(([x, y], i) => (
          <Gear key={i} x={x} y={y} r={110} rot={spin * (i % 2 ? -1 : 1)} z={5} />
        ))}
      </Stage>
      <Label text="SEAS OF MERCURY" x={0.5} y={0.12} size={0.06} kind="box" at={sec(start)(238.7)} />
      <Label text="MACHINES" x={0.5} y={0.62} size={0.06} kind="stamp" rotate={-6} at={sec(start)(240.4)} />
    </AbsoluteFill>
  );
};

// 241.25 'And the lamps burn the fat of a "man-fish," so they stay lit for a long time.'
export const ManFishLampShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -20 }} light={{ pos: [0, 300] }} vignette={0.7} vignetteColor="#04060c">
        <TombCorridor floorY={-460} torches={false} dark={0.3}>
          {[-600, -200, 200, 600].map((x, i) => (
            <X key={x} x={x} y={-460} z={2}>
              <Part shape={roundRect(30, 200, 8)} color="#8a6a3a" shade={0.2} y={100} />
              <X y={200}>
                <OilLamp s={1.4} seed={i} />
              </X>
            </X>
          ))}
          <ManFish x={0} y={260} s={pop(t, 243.3)} z={6} />
        </TombCorridor>
      </Stage>
      <Label text="MAN-FISH?" x={0.5} y={0.14} size={0.07} kind="box" at={sec(start)(243.4)} />
    </AbsoluteFill>
  );
};

// 246.4 "What's a man-fish? Nobody knows for sure."
export const WhatManFishShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ dir: [-0.6, 0.8] }} vignette={0.5}>
        <Sunburst r={2600} rays={20} color="#4a6a8a" alt="#42617e" speed={0.5} z={-40} />
        <ManFish x={0} y={-40} s={1.6} z={2} />
        {[[-520, 220, 247.0], [520, 260, 247.4], [-420, -260, 247.9], [460, -220, 248.3]].map(([x, y, at], i) => (
          <QuestionMark key={i} x={x} y={y} s={0.6 * pop(t, at)} rot={(i % 2 ? 1 : -1) * 0.15} z={3} />
        ))}
      </Stage>
    </AbsoluteFill>
  );
};

// 248.95 "Maybe a whale."
export const WhaleShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.04), y: 40 }} light={{ dir: [0.6, 0.5] }}>
        <Seascape mood="day" horizon={-60}>
          <Whale x={0} y={-180 + Math.sin(frame * 0.1) * 10} s={1.4 * pop(t, 249.3)} z={2} />
        </Seascape>
      </Stage>
    </AbsoluteFill>
  );
};

// 250.15 "That's the secret."
export const ThatsSecretShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const s = 2.3;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ pos: [300, 100] }} vignette={0.7} vignetteColor="#04060c">
        <TombCorridor floorY={-700} dark={0.35} torches={false} />
        <You x={-120} y={-40 - 308 * s} s={s} arm={[2.0, 0.9]} look={0.35} expression={{ eyes: "half", mouth: "smirk", brows: -0.5 }} />
      </Stage>
    </AbsoluteFill>
  );
};

// 251.45 "Only the workers know where every trap and every treasure is."
export const OnlyWorkersShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -20 }} light={{ pos: [0, 300] }} vignette={0.75} vignetteColor="#04060c">
        <TombCorridor floorY={-460} dark={0.25}>
          <TreasureChest x={0} y={-470} w={300} z={2} />
          <JadeDisc x={-120} y={-260} r={36} z={2.1} />
          <Ding x={180} y={-470} w={140} z={2.2} />
          {[0, 1, 2].map((k) => (
            <Coin key={k} x={-60 + k * 40} y={-470} r={14} z={2.3} />
          ))}
          <You x={-560} y={-580} s={1.2} z={3} expression={{ eyes: "half", mouth: "smirk", brows: -0.4 }} />
          <Character {...WORKER(1)} x={560} y={-580} s={1.2} z={3} facing={-1} look={0.5} expression={{ eyes: "happy", mouth: "smile" }} pose={{ armF: [2.6, 2.6], armB: [-0.2, -0.1] }} />
          <CrossbowTrap x={-900} y={-480} s={0.9} z={1} />
        </TombCorridor>
      </Stage>
      <Label text="TRAPS" x={0.18} y={0.24} size={0.05} kind="box" at={sec(start)(253.0)} />
      <Label text="TREASURE" x={0.5} y={0.2} size={0.06} kind="box" at={sec(start)(253.7)} />
    </AbsoluteFill>
  );
};

