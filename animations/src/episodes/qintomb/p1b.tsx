import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, X, Part, Line, Glow, Wash, QuestionMark, Shovel, roundRect, circle, blob, poly, ramp, push, hitAt, absT, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  ChinaMap, chinaXY, KINGDOM_LABEL, Ribbon, Sunburst, RedPillar, QinThrone, MapScroll, Dagger, Jian, MedicineBag, TreasureChest, SpeedLines,
} from "../../kit/env";
import { sec, pop, scr, RibbonText, SpeechBubble, CJK } from "../../kit/shot";
import { Plains, ThroneHall } from "./sets";
import { EMPEROR, BOY_KING, WORKER, OFFICIAL, ZHAO_GAO, GUARD, JING_KE, COURT_DOCTOR } from "./cast";
import { upright } from "./p1a";

const KINGDOMS = ["qin", "han", "zhao", "wei", "chu", "yan", "qi"];
const MAP_PPD = 46;
const MAP_C: [number, number] = [113.5, 34.5];

/** Kingdom name tags on the map (Label overlay). */
const KingdomTags: React.FC<{ names: string[]; zoom?: number; cy?: number; at?: number }> = ({ names, zoom = 1, cy = 0, at = 0 }) => (
  <>
    {names.map((n) => {
      const [lon, lat] = KINGDOM_LABEL[n];
      const [x, y] = chinaXY(lon, lat, MAP_PPD, MAP_C);
      return <Label key={n} text={n.toUpperCase()} {...scr(x, y, zoom, 0, cy)} size={0.03} color="#fdf3dc" at={at} />;
    })}
  </>
);

// ───────────────────────── the boy king ─────────────────────────

// 55.15 "His name is Ying Zheng, and he becomes king of Qin at 13."
export const YingZhengShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 60 }} light={{ pos: [0, 300] }}>
        <ThroneHall floorY={-460} throne={false}>
          <QinThrone x={0} y={-460} s={1.15} z={1} />
          <Character {...BOY_KING} x={0} y={-218} s={0.78} z={2} look={0.1} expression={{ eyes: "open", mouth: "smile", brows: 0.2 }} pose={{ ...poses.sit(frame), bob: Math.sin(frame * 0.2) * 3 }} />
          {[-620, 620].map((x, i) => (
            <Character key={x} {...OFFICIAL(i)} x={x} y={-560} s={1.0} z={3} facing={i ? -1 : 1} look={0.5} expression={{ eyes: "half", mouth: "flat" }} pose={{ ...poses.idle(frame, i), headTilt: -0.1 }} />
          ))}
        </ThroneHall>
      </Stage>
      <Label text="YING ZHENG" sub="KING OF QIN" x={0.5} y={0.13} size={0.08} kind="title" at={sec(start)(55.9)} />
      <Label text="AGE 13" x={0.8} y={0.32} size={0.06} kind="box" at={sec(start)(58.2)} />
    </AbsoluteFill>
  );
};

// 59.05 "Back then, China isn't one country."
export const NotOneCountryShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.96) }} light={{ dir: [-0.6, 0.8] }}>
        <ChinaMap ppd={MAP_PPD} center={MAP_C} />
        <QuestionMark x={60} y={60} s={0.9 * pop(t, 60.6)} rot={0.1} z={5} />
      </Stage>
      <Label text="NOT ONE COUNTRY" x={0.5} y={0.12} size={0.065} kind="box" at={sec(start)(60.7)} />
    </AbsoluteFill>
  );
};

// 61.45 "It's seven kingdoms, always at war,"
export const SevenKingdomsShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const shown = KINGDOMS.filter((_, i) => t > 61.85 + i * 0.12);
  const clash = (i: number) => Math.max(0, Math.sin(frame * 0.4 + i * 1.7));
  const pairs: [string, string][] = [["qin", "zhao"], ["wei", "chu"], ["qi", "yan"], ["han", "chu"]];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 0.96 }} light={{ dir: [-0.6, 0.8] }}>
        <ChinaMap ppd={MAP_PPD} center={MAP_C} kingdoms only={shown} />
        {t > 62.8
          ? pairs.map(([a, b], i) => {
              const pa = chinaXY(...KINGDOM_LABEL[a], MAP_PPD, MAP_C);
              const pb = chinaXY(...KINGDOM_LABEL[b], MAP_PPD, MAP_C);
              return (
                <X key={i} x={(pa[0] + pb[0]) / 2} y={(pa[1] + pb[1]) / 2} s={0.6 + clash(i) * 0.25} z={5}>
                  <Line pts={[[-40, -40], [40, 40]]} width={12} color="#e9e2cf" />
                  <Line pts={[[-40, 40], [40, -40]]} width={12} color="#e9e2cf" />
                  <Part shape={circle(10)} color="#fe5649" flat outline={3} z={0.01} />
                </X>
              );
            })
          : null}
      </Stage>
      <KingdomTags names={shown} zoom={0.96} />
      <Label text="7 KINGDOMS" x={0.5} y={0.1} size={0.065} kind="box" at={sec(start)(61.9)} />
    </AbsoluteFill>
  );
};

// 63.85 "… and Qin is one of them."
export const QinOneShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const zoom = push(frame, dur, 1.0, 1.15);
  const [qx, qy] = chinaXY(...KINGDOM_LABEL.qin, MAP_PPD, MAP_C);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, x: qx * 0.5, y: qy * 0.5 }} light={{ dir: [-0.6, 0.8] }}>
        <ChinaMap ppd={MAP_PPD} center={MAP_C} kingdoms />
        <Glow x={qx} y={qy} rx={300} color="#fff3d6" alpha={0.25 + Math.sin(frame * 0.3) * 0.1} additive z={4} />
        <Ribbon x={qx} y={qy + 150} w={240} h={66} z={5} />
      </Stage>
      <RibbonText text="QIN" x={qx} y={qy + 150} zoom={zoom} cx={qx * 0.5} cy={qy * 0.5} size={0.05} at={sec(start)(64.2)} />
    </AbsoluteFill>
  );
};

/** Excavation pit with stepped walls (the tomb being dug). Origin = ground centre. */
const DigPit: React.FC<{ w?: number; d?: number; z?: number }> = ({ w = 1500, d = 360, z = 0 }) => (
  <X z={z}>
    <Part shape={poly([[-w / 2, 0], [w / 2, 0], [w / 2 - 120, -d], [-w / 2 + 120, -d]])} color="#a87a50" shade={0.18} />
    {[0.33, 0.66].map((k) => (
      <Line key={k} pts={[[-w / 2 + 120 * k, -d * k], [w / 2 - 120 * k, -d * k]]} width={4} color="#8a6240" z={0.001} />
    ))}
    <Part shape={roundRect(w - 240, 40, 4)} color="#9a6e48" flat outline={4} y={-d + 20} z={0.002} />
  </X>
);

// 65.5 "Soon after he takes the throne, workers start digging his tomb."
export const DiggingStartsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: 0 }} light={{ dir: [-0.6, 0.8] }}>
        <Plains mood="day" horizon={-80}>
          <X y={-120}>
            <DigPit w={1700} d={360} z={-5} />
          </X>
          {[-480, -160, 160, 480].map((x, i) => {
            const dig = Math.sin(frame * 0.25 + i);
            return (
              <Character
                key={x}
                {...WORKER(i)}
                x={x}
                y={-440}
                s={0.95}
                z={2 + i * 0.01}
                facing={i % 2 ? -1 : 1}
                look={0.5}
                expression={{ eyes: "half", mouth: "teeth", brows: -0.3, sweat: i === 2 }}
                pose={{ armF: [1.4 + dig * 0.4, 0.6], armB: [1.1 + dig * 0.3, 0.7], lean: -0.15 }}
                holdF={<Shovel rot={upright([1.4, 0.6]) + 2.6} s={1.0} />}
              />
            );
          })}
        </Plains>
      </Stage>
      <Label text="THE TOMB · YEAR 1" x={0.5} y={0.12} size={0.06} kind="box" at={sec(start)(68.2)} />
    </AbsoluteFill>
  );
};

// 69.15 "Chinese kings like to start their graves early."
export const GravesEarlyShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.1), y: -20 }} light={{ dir: [-0.6, 0.8] }}>
        <Plains mood="day" horizon={-60}>
          <X y={-140}>
            <DigPit w={1200} d={260} z={-5} />
          </X>
          <Character {...BOY_KING} x={-360} y={-560} s={0.95} z={2} look={0.6} expression={{ eyes: "open", mouth: "smile", brows: -0.1 }} pose={poses.handsOnHips} />
          <Character {...OFFICIAL(0)} x={260} y={-560} s={1.2} z={2.1} facing={-1} look={0.5} talking={t < 71.4} expression={{ eyes: "happy", mouth: "grin" }} pose={poses.point(frame)} />
        </Plains>
      </Stage>
    </AbsoluteFill>
  );
};

// 72.0 "One by one, his armies conquer the other six kingdoms."
export const ConquerShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const order = ["han", "zhao", "wei", "chu", "yan", "qi"];
  const conquered = order.filter((_, i) => t > 72.6 + i * 0.5);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 0.96, shake: order.some((_, i) => Math.abs(t - (72.6 + i * 0.5)) < 0.08) ? 4 : 0 }} light={{ dir: [-0.6, 0.8] }}>
        <ChinaMap ppd={MAP_PPD} center={MAP_C} kingdoms conquered={conquered} />
      </Stage>
      <KingdomTags names={order.filter((n) => !conquered.includes(n))} zoom={0.96} />
      <KingdomTags names={["qin"]} zoom={0.96} />
    </AbsoluteFill>
  );
};

// 75.45 "By 221 BC, all of China is his."
export const AllChinaShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const zoom = push(frame, dur, 0.96, 1.02);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom }} light={{ dir: [-0.6, 0.8] }}>
        <ChinaMap ppd={MAP_PPD} center={MAP_C} kingdoms conquered={KINGDOMS} />
        <Ribbon x={0} y={360} w={420} z={5} />
      </Stage>
      <Label text="221 BC" x={0.2} y={0.14} size={0.08} kind="box" at={sec(start)(75.7)} />
      <RibbonText text="QIN EMPIRE" x={0} y={360} zoom={zoom} at={sec(start)(77.3)} />
    </AbsoluteFill>
  );
};

// 78.85 "So he gives himself a new title."
export const NewTitleShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 40 }} light={{ pos: [0, 300] }}>
        <ThroneHall floorY={-460}>
          <Character {...EMPEROR} x={0} y={-220} s={1.0} z={2} look={0.1} expression={{ eyes: "half", mouth: "smirk", brows: -0.3 }} pose={poses.handsOnHips} />
          {[-760, -520, 520, 760].map((x, i) => (
            <Character key={x} {...OFFICIAL(i)} x={x} y={-560} s={0.95} z={3 + i * 0.01} facing={x < 0 ? 1 : -1} look={0.4} expression={{ eyes: "closed", mouth: "flat" }} pose={{ ...poses.sit(frame), headTilt: -0.25, armF: [1.0, 1.6], armB: [0.8, 1.6] }} />
          ))}
        </ThroneHall>
      </Stage>
    </AbsoluteFill>
  );
};

// 81.25 "Qin Shi Huang, the First Emperor."
export const QinShiHuangShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const s = 2.1;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ dir: [-0.6, 0.8] }} vignette={0.5}>
        <Sunburst r={2600} rays={22} color="#8a2a24" alt="#7a221e" speed={0.6} z={-40} />
        <Character {...EMPEROR} x={-420} y={-20 - 308 * s} s={s} z={2} look={0.3} expression={{ eyes: "half", mouth: "smirk", brows: -0.4 }} pose={poses.handsOnHips} />
      </Stage>
      <Label text="秦始皇" x={0.66} y={0.28} size={0.12} color="#ffffff" at={sec(start)(81.4)} font={CJK} />
      <Label text="QIN SHI HUANG" x={0.66} y={0.44} size={0.075} kind="title" at={sec(start)(81.9)} />
      <Label text="THE FIRST EMPEROR" x={0.66} y={0.56} size={0.05} kind="box" at={sec(start)(83.0)} />
    </AbsoluteFill>
  );
};

// 83.95 "His sons will be the Second Emperor, then the Third, and so on, for ten thousand generations."
export const GenerationsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const n = 9;
  const shown = Math.min(n, 1 + Math.floor(Math.max(0, t - 84.6) / 0.42));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 0.92), y: 0 }} light={{ pos: [0, 300] }}>
        <ThroneHall floorY={-460} throne={false}>
          {Array.from({ length: shown }, (_, i) => {
            const k = Math.pow(0.78, i);
            return (
              <Character
                key={i}
                {...EMPEROR}
                beard={i === 0 ? "goatee" : null}
                x={-620 + (1 - k) * 1500}
                y={-560 + (1 - k) * 400}
                s={1.2 * k}
                z={10 - i}
                look={0.2}
                expression={{ eyes: "half", mouth: "smirk", brows: -0.2 }}
                pose={poses.handsOnHips}
              />
            );
          })}
        </ThroneHall>
      </Stage>
      {["I", "II", "III"].map((r, i) => (
        <Label key={r} text={r} x={0.5 + (-620 + (1 - Math.pow(0.78, i)) * 1500) / 1920} y={0.62 - (1 - Math.pow(0.78, i)) * 0.3} size={0.05 * Math.pow(0.85, i)} kind="box" at={sec(start)([84.3, 85.0, 86.4][i])} />
      ))}
      <Label text="× 10,000" x={0.8} y={0.16} size={0.08} kind="title" at={sec(start)(88.0)} />
    </AbsoluteFill>
  );
};

// 89.7 'The word "China" may even come from his kingdom's name, Qin.'
export const ChinaNameShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05) }} light={{ dir: [-0.6, 0.8] }}>
        <ChinaMap ppd={MAP_PPD} center={MAP_C} kingdoms conquered={KINGDOMS} />
        <Wash width={4000} height={3000} color="#1a1420" alpha={0.35} z={4} />
      </Stage>
      <Label text="QIN" x={0.32} y={0.42} size={0.13} kind="title" at={sec(start)(90.2)} />
      <Label text="→" x={0.5} y={0.42} size={0.1} color="#ffffff" at={sec(start)(91.3)} />
      <Label text="CHINA" x={0.7} y={0.42} size={0.13} kind="title" at={sec(start)(91.6)} />
      <Label text="CHIN · QIN" x={0.5} y={0.6} size={0.05} kind="box" at={sec(start)(93.0)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── Jing Ke ─────────────────────────

/** Dark silhouettes with glowing eyes peeking around pillars. */
const Lurker: React.FC<{ x: number; y: number; s?: number; z?: number; t: number; at: number }> = ({ x, y, s = 1, z = 0, t, at }) => {
  const k = ramp(t, at, at + 0.4);
  return k <= 0 ? null : (
    <X x={x} y={y} s={s} z={z}>
      <Part shape={blob([[-60, 0], [-50, 160], [-30, 260], [30, 260], [50, 160], [60, 0]], 8)} color="#120c10" flat outline={0} opacity={k} />
      <Part shape={circle(70)} color="#120c10" flat outline={0} opacity={k} y={300} />
      {[-24, 24].map((ex) => (
        <Part key={ex} shape={blob([[-14, 0], [0, 8], [14, 0], [0, -6]], 4)} color="#ffcf4a" flat outline={0} opacity={k} x={ex} y={310} z={0.01} />
      ))}
    </X>
  );
};

// 93.75 "But a man with that much power makes a lot of enemies."
export const EnemiesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 40 }} light={{ pos: [0, 300] }}>
        <ThroneHall floorY={-460} dim={0.3}>
          <Character {...EMPEROR} x={0} y={-292} s={1.0} z={2} look={0.1} expression={{ eyes: "half", mouth: "smirk", brows: -0.3 }} pose={poses.sit(frame)} />
          <Lurker x={-860} y={-460} s={1.1} z={-19} t={t} at={95.2} />
          <Lurker x={860} y={-460} s={1.1} z={-19} t={t} at={95.5} />
          <Lurker x={-660} y={-460} s={0.9} z={-19.5} t={t} at={95.8} />
        </ThroneHall>
      </Stage>
    </AbsoluteFill>
  );
};

/** Tray with the two gifts: lacquer box and rolled map. Origin = tray centre. */
const GiftTray: React.FC<{ map?: boolean; box?: boolean }> = ({ map = true, box = true }) => (
  <X>
    <Part shape={roundRect(260, 22, 8)} color="#5a3a26" shade={0.2} />
    {box ? <TreasureChest x={-60} y={10} w={110} /> : null}
    {map ? (
      <X x={70} y={34} z={0.01}>
        <Part shape={roundRect(110, 34, 16)} color="#efe2c4" shade={0.15} />
        <Part shape={roundRect(18, 44, 6)} color="#7a5232" shade={0.2} x={-58} z={0.001} />
        <Part shape={roundRect(18, 44, 6)} color="#7a5232" shade={0.2} x={58} z={0.001} />
      </X>
    ) : null}
  </X>
);

// 96.35 "Years before he becomes emperor, a man named Jing Ke comes to his palace with two gifts."
export const JingKeArrivesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const walk = ramp(t, 96.4, 100.6, (x) => x);
  const kneel = t > 100.7;
  const arm: [number, number] = [1.5, 0.3];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: 20 }} light={{ pos: [0, 300] }}>
        <ThroneHall floorY={-460} throneX={420}>
          <Character {...EMPEROR} beard={null} x={420} y={-292 + 0} s={0.9} z={2} facing={-1} look={0.5} expression={{ eyes: "open", mouth: "flat", brows: 0 }} pose={poses.sit(frame)} />
          <Character
            {...JING_KE}
            x={interpolate(walk, [0, 1], [-1000, -260])}
            y={-560}
            s={1.15}
            z={4}
            look={0.5}
            expression={kneel ? { eyes: "half", mouth: "smile", brows: -0.2 } : { eyes: "open", mouth: "flat", brows: -0.2 }}
            pose={kneel ? { ...poses.sit(frame), armF: arm, armB: arm, headTilt: -0.1 } : { ...poses.walk(frame, 0.8), armF: arm, armB: arm }}
            holdF={<X rot={upright(arm)} y={10}><GiftTray /></X>}
          />
        </ThroneHall>
      </Stage>
      <Label text="JING KE" x={0.22} y={0.13} size={0.075} kind="title" at={sec(start)(99.1)} />
      <Label text="2 GIFTS" x={0.5} y={0.13} size={0.055} kind="box" at={sec(start)(101.0)} />
    </AbsoluteFill>
  );
};

// 101.9 "A box with the head of a traitor."
export const TraitorBoxShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.1, 1.2), y: -40 }} light={{ pos: [0, 300] }}>
        <ThroneHall floorY={-460} throne={false}>
          <TreasureChest x={0} y={-360} w={380} z={3} />
          <Part shape={roundRect(440, 30, 8)} color="#5a3a26" shade={0.2} y={-370} z={2.9} />
          <Character {...OFFICIAL(1)} x={-460} y={-560} s={1.1} z={2} look={0.5} expression={{ eyes: "wide", mouth: "wavy", brows: 0.8, sweat: true }} pose={poses.scared(frame)} />
          <Character {...OFFICIAL(2)} x={460} y={-560} s={1.1} z={2} facing={-1} look={0.5} expression={{ eyes: "closed", mouth: "frown", brows: 0.7 }} pose={{ armF: [2.2, 2.0], armB: [-0.2, -0.1] }} />
        </ThroneHall>
      </Stage>
      <Label text="TRAITOR" x={0.5} y={0.6} size={0.06} kind="stamp" rotate={-8} at={sec(start)(103.0)} />
    </AbsoluteFill>
  );
};

// 103.65 "And a map, rolled up like a scroll."
export const RolledMapShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08) }} light={{ dir: [-0.6, 0.8] }} vignette={0.6}>
        <Sunburst r={2600} rays={20} color="#6a2420" alt="#5e201c" speed={0.4} z={-40} />
        <X y={-80} rot={-0.08} s={2.4} z={1}>
          <Part shape={roundRect(260, 70, 30)} color="#efe2c4" shade={0.15} />
          <Part shape={roundRect(30, 90, 10)} color="#7a5232" shade={0.2} x={-138} z={0.001} />
          <Part shape={roundRect(30, 90, 10)} color="#7a5232" shade={0.2} x={138} z={0.001} />
          <Line pts={[[-30, 35], [-30, -35]]} width={6} color="#b8322a" z={0.002} />
        </X>
      </Stage>
      <Label text="A MAP" x={0.5} y={0.16} size={0.07} kind="box" at={sec(start)(104.0)} />
    </AbsoluteFill>
  );
};

// 106.0 "The king opens the map."
export const OpensMapShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const open = ramp(t, 106.2, 107.5);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.1, 1.18), y: -60 }} light={{ pos: [0, 300] }}>
        <ThroneHall floorY={-460} throne={false}>
          <Character {...EMPEROR} beard={null} x={-420} y={-560} s={1.2} z={2} look={0.5} expression={{ eyes: "open", mouth: "o", brows: 0.3, gaze: [0.6, -0.6] }} pose={{ armF: [1.3, 0.4], armB: [0.9, 0.6] }} />
          <Character {...JING_KE} x={480} y={-560} s={1.15} z={2} facing={-1} look={0.5} expression={{ eyes: "half", mouth: "smirk", brows: -0.5 }} pose={{ ...poses.sit(frame), armF: [1.3, 0.4] }} />
          <MapScroll x={-260} y={-180} w={560} open={open} s={0.9} z={3} />
        </ThroneHall>
      </Stage>
    </AbsoluteFill>
  );
};

// 107.55 "And rolled up inside it is a dagger."
export const DaggerRevealShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const hit = hitAt(t, 109.2, 0.5);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.2, 1.3) + hit * 0.06, x: 200, shake: hit * 8 }} light={{ dir: [-0.6, 0.8] }} vignette={0.65}>
        <Sunburst r={2600} rays={22} color="#3a1614" alt="#321210" speed={0.6} z={-40} />
        <MapScroll x={-420} y={0} w={560} open={1} dagger={t > 109.1} s={1.3} z={1} />
        {t > 109.1 ? <Glow x={420} y={-80} rx={240} color="#ffffff" alpha={0.5 * (1 - ramp(t, 109.2, 109.8))} additive z={2} /> : null}
      </Stage>
      <Label text="DAGGER!" x={0.72} y={0.2} size={0.08} kind="stamp" rotate={-8} at={sec(start)(109.2)} />
    </AbsoluteFill>
  );
};

/** King + Jing Ke action layout in the throne hall. */
const Fight: React.FC<{ kingX: number; kingPose: React.ComponentProps<typeof Character>["pose"]; kingFace: React.ComponentProps<typeof Character>["expression"]; jkX: number; jkPose: React.ComponentProps<typeof Character>["pose"]; jkHold?: React.ReactNode; kingHold?: React.ReactNode; kingFacing?: 1 | -1; jkRot?: number; jkFacing?: 1 | -1; children?: React.ReactNode }> = ({
  kingX, kingPose, kingFace, jkX, jkPose, jkHold, kingHold, kingFacing = -1, jkRot = 0, jkFacing = 1, children,
}) => (
  <ThroneHall floorY={-460} throne={false}>
    <Character {...EMPEROR} beard={null} x={kingX} y={-560} s={1.2} z={2} facing={kingFacing} look={0.5} expression={kingFace} pose={kingPose} holdF={kingHold} />
    <X x={jkX} y={-560} rot={jkRot} z={2.1}>
      <Character {...JING_KE} s={1.2} facing={jkFacing} look={0.5} expression={{ eyes: "angry", mouth: "teeth", brows: -0.8 }} pose={jkPose} holdF={jkHold} />
    </X>
    {children}
  </ThroneHall>
);

// 109.95 "Jing Ke grabs the king's sleeve and stabs."
export const StabShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const lunge = ramp(t, 110.5, 110.9, Easing.out(Easing.cubic));
  const stab = ramp(t, 111.75, 111.95);
  const jkArm: [number, number] = [2.6 - stab * 1.2, 0.2];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.12, y: -60, shake: hitAt(t, 111.9, 0.3) * 8 }} light={{ pos: [0, 300] }}>
        <Fight
          kingX={260}
          kingPose={{ armF: [1.4, 0.2], armB: [-0.3, -0.1], lean: 0.1 }}
          kingFace={{ eyes: "wide", mouth: "shout", brows: 0.8, sweat: true }}
          jkX={interpolate(lunge, [0, 1], [-420, -60])}
          jkPose={{ armF: jkArm, armB: [1.5, 0.1], lean: -0.15 }}
          jkHold={<Dagger rot={upright(jkArm) + Math.PI} s={1.1} />}
        />
      </Stage>
    </AbsoluteFill>
  );
};

// 112.6 "The sleeve rips, and the king jumps back."
export const SleeveRipShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const rip = ramp(t, 113.1, 113.5);
  const jump = ramp(t, 114.0, 114.4, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.1, y: -60, shake: hitAt(t, 113.2, 0.3) * 6 }} light={{ pos: [0, 300] }}>
        <Fight
          kingX={interpolate(jump, [0, 1], [220, 640])}
          kingPose={{ armF: [1.2, 0.4], armB: [-0.4, -0.1], lean: 0.25 * jump, bob: Math.sin(jump * Math.PI) * 80 }}
          kingFace={{ eyes: "wide", mouth: "shout", brows: 0.9, sweat: true }}
          jkX={-120}
          jkPose={{ armF: [1.5, 0.1], armB: [2.4, 0.3], lean: -0.1 }}
          jkHold={<Dagger rot={upright([2.4, 0.3]) + Math.PI} s={1.1} />}
        >
          {rip > 0 ? (
            <X x={interpolate(rip, [0, 1], [80, -40])} y={-260 + rip * 120} rot={rip * 3} z={5}>
              <Part shape={poly([[-40, -30], [50, -20], [30, 40], [-30, 30]])} color="#1e1a20" shade={0.2} />
              <Line pts={[[-30, 30], [30, 40]]} width={6} color="#b8322a" z={0.001} />
            </X>
          ) : null}
        </Fight>
      </Stage>
      <Label text="RIIIP!" x={0.46} y={0.3} size={0.07} kind="stamp" rotate={-10} at={sec(start)(113.2)} />
    </AbsoluteFill>
  );
};

// 115.0 "He tries to pull out his sword, but it's too long."
export const TooLongShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const tug = Math.sin(frame * 0.6) * 0.15;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.15, 1.2), y: -60 }} light={{ pos: [0, 300] }}>
        <ThroneHall floorY={-460} throne={false}>
          <Character {...EMPEROR} beard={null} x={-60} y={-560} s={1.3} z={2} look={0.4} expression={{ eyes: "wide", mouth: "teeth", brows: 0.7, sweat: true }} pose={{ armF: [0.9 + tug, 1.4], armB: [0.5, 0.4], lean: -0.1 }} />
          <X x={-20 + Math.sin(frame * 0.6) * 10} y={-400} rot={2.55} z={2.5}>
            <Jian drawn={false} len={720} s={1.0} />
          </X>
        </ThroneHall>
      </Stage>
      <Label text="TOO LONG!" x={0.74} y={0.24} size={0.07} kind="stamp" rotate={-8} at={sec(start)(117.0)} />
    </AbsoluteFill>
  );
};

// 117.7 "His guards are waiting below the hall, and they can't come up without an order."
export const GuardsWaitShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: 20 }} light={{ pos: [0, 300] }}>
        <ThroneHall floorY={-460} throne={false}>
          {[0, 1, 2, 3].map((i) => (
            <Part key={i} shape={roundRect(2400 - i * 200, 60, 4)} color={i % 2 ? "#3a2a26" : "#2e2224"} shade={0.2} y={-430 + i * 60} z={-5 + i * 0.01} />
          ))}
          {[-560, -280, 280, 560].map((x, i) => (
            <Character key={x} {...GUARD(i)} x={x} y={-520} s={1.0} z={3 + i * 0.01} facing={x < 0 ? 1 : -1} look={0.5} expression={{ eyes: "wide", mouth: "wavy", brows: 0.7, sweat: i % 2 === 0, gaze: [0, 1] }} pose={i % 2 ? poses.shrug(1) : poses.idle(frame, i)} />
          ))}
          <X x={0} y={-180} z={2}>
            <Character {...EMPEROR} beard={null} x={-80 + Math.sin(frame * 0.3) * 80} y={0} s={0.55} look={0.6} expression={{ eyes: "wide", mouth: "shout", brows: 0.8 }} pose={poses.run(frame)} />
          </X>
        </ThroneHall>
      </Stage>
      <Label text="NO ORDER = NO ENTRY" x={0.5} y={0.12} size={0.06} kind="box" at={sec(start)(120.4)} />
    </AbsoluteFill>
  );
};

// 121.5 "So the most powerful man in China runs around a pillar, with a killer right behind him."
export const PillarChaseShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const a = frame * 0.13;
  const orbit = (ph: number) => ({ x: Math.cos(a + ph) * 360, front: Math.sin(a + ph) < 0, fac: (Math.sin(a + ph) > 0 ? -1 : 1) as 1 | -1 });
  const k = orbit(0);
  const j = orbit(-1.0);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -20 }} light={{ pos: [0, 300] }}>
        <ThroneHall floorY={-460} throne={false}>
          <SpeedLines w={2400} h={900} n={10} speed={40} color="#f4d0a8" z={-18} />
          <RedPillar x={0} y={-460} h={1100} w={130} z={1} />
          <Character {...EMPEROR} beard={null} x={k.x} y={-520} s={1.05} z={k.front ? 2 : 0.5} facing={k.fac} look={0.6} expression={{ eyes: "wide", mouth: "shout", brows: 0.9, sweat: true }} pose={poses.run(frame)} />
          <Character {...JING_KE} x={j.x} y={-520} s={1.05} z={j.front ? 2.1 : 0.4} facing={j.fac} look={0.6} expression={{ eyes: "angry", mouth: "teeth", brows: -0.8 }} pose={{ ...poses.run(frame + 7), armF: [2.4, 0.4] }} holdF={<Dagger rot={upright([2.4, 0.4]) + Math.PI} />} />
        </ThroneHall>
      </Stage>
    </AbsoluteFill>
  );
};

// 126.25 "His doctor throws a medicine bag at the attacker."
export const DoctorThrowsShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const fly = ramp(t, 127.4, 128.4, (x) => x);
  const hit = t > 128.4;
  const throwArm: [number, number] = t < 127.4 ? [2.6, 0.6] : [1.3, 0.1];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.05, y: -40, shake: hitAt(t, 128.45, 0.3) * 6 }} light={{ pos: [0, 300] }}>
        <ThroneHall floorY={-460} throne={false}>
          <Character {...COURT_DOCTOR} x={-620} y={-560} s={1.15} z={2} look={0.5} expression={{ eyes: "angry", mouth: "shout", brows: -0.6 }} pose={{ armF: throwArm, armB: [-0.4, -0.2], lean: -0.1 }} holdF={t < 127.4 ? <MedicineBag rot={upright(throwArm)} /> : null} />
          {t >= 127.4 && !hit ? <MedicineBag x={interpolate(fly, [0, 1], [-520, 360])} y={-160 + Math.sin(fly * Math.PI) * 220} rot={fly * 8} s={1.2} z={4} /> : null}
          <Character {...JING_KE} x={460} y={-560} s={1.15} z={2} facing={-1} look={0.5} expression={hit ? { eyes: "dead", mouth: "o", brows: 0.5 } : { eyes: "angry", mouth: "teeth", brows: -0.8 }} pose={hit ? { ...poses.scared(frame), headTilt: 0.2 } : poses.run(frame)} />
          {hit ? (
            <X x={460} y={-120} z={5}>
              {[0, 1, 2].map((i) => (
                <Part key={i} shape={poly(Array.from({ length: 10 }, (_, k) => [Math.cos(Math.PI / 2 + (k * Math.PI) / 5) * (k % 2 ? 8 : 18), Math.sin(Math.PI / 2 + (k * Math.PI) / 5) * (k % 2 ? 8 : 18)] as [number, number]))} color="#f2c84a" flat outline={3} x={Math.cos(frame * 0.3 + i * 2.1) * 90} y={Math.sin(frame * 0.3 + i * 2.1) * 30} />
              ))}
            </X>
          ) : null}
        </ThroneHall>
      </Stage>
      <Label text="BONK!" x={0.74} y={0.28} size={0.07} kind="stamp" rotate={-8} at={sec(start)(128.45)} />
    </AbsoluteFill>
  );
};

// 129.35 'Then someone shouts, "Put your sword on your back!"'
export const ShoutShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const b = pop(t, 130.5);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.08, y: -40 }} light={{ pos: [0, 300] }}>
        <ThroneHall floorY={-460} throne={false}>
          <Character {...OFFICIAL(0)} x={-480} y={-560} s={1.25} z={2} look={0.5} talking={t > 130.0} expression={{ eyes: "wide", mouth: "shout", brows: 0.4 }} pose={{ armF: [2.4, 0.6], armB: [1.6, 2.2] }} />
          <SpeechBubble x={200} y={160} w={760} h={280} tx={-300} ty={40} s={b} z={10} />
        </ThroneHall>
      </Stage>
      {b > 0 ? <Label text={"PUT YOUR SWORD\nON YOUR BACK!"} x={0.5 + 200 * 1.08 / 1920} y={0.5 - (160 + 40) * 1.08 / 1080} size={0.055} color="#211b20" at={0} /> : null}
    </AbsoluteFill>
  );
};

// 132.2 "The king pulls it out over his shoulder and cuts Jing Ke down."
export const CutDownShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const draw = ramp(t, 132.7, 133.6);
  const slash = ramp(t, 134.15, 134.4);
  const fall = ramp(t, 134.5, 135.0, Easing.in(Easing.quad));
  const arm: [number, number] = slash > 0 ? [interpolate(slash, [0, 1], [3.0, 1.2]), 0.1] : [interpolate(draw, [0, 1], [1.4, 3.0]), 0.4];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 1.1, y: -60, shake: hitAt(t, 134.3, 0.4) * 10 }} light={{ pos: [0, 300] }}>
        <Fight
          kingX={-260}
          kingFacing={1}
          kingPose={{ armF: arm, armB: [-0.3, -0.1], lean: -0.1 * slash }}
          kingFace={{ eyes: "angry", mouth: "teeth", brows: -0.8 }}
          kingHold={<Jian drawn len={420} rot={upright(arm) + (slash > 0 ? Math.PI * 0.5 : Math.PI)} />}
          jkX={360}
          jkFacing={-1}
          jkRot={fall * 1.4}
          jkPose={{ armF: [2.2, 0.4], armB: [1.0, 0.3] }}
          jkHold={<Dagger rot={Math.PI} />}
        >
          {slash > 0 && slash < 1 ? <Line pts={Array.from({ length: 10 }, (_, k) => [-60 + Math.cos(2.4 - k * 0.2) * 420, -120 + Math.sin(2.4 - k * 0.2) * 420] as [number, number])} smooth width={18} color="#ffffff" opacity={0.85} z={6} /> : null}
        </Fight>
      </Stage>
    </AbsoluteFill>
  );
};
