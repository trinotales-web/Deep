import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, X, Part, Glow, Line, Plank, Hammer, Scroll, Staff, roundRect, circle, shadeHex } from "../../kit";
import { Character, poses } from "../../kit/character";
import { Ground, City, GreekHouse, Trireme, RockHill, GreekTemple } from "../../kit/env";
import { AcropolisTop, AthensWide, Backdrop, SeaSet } from "./sets";
import { DEFENDERS, TEMPLE_KEEPER, GENERAL, CITIZEN } from "./cast";
import { ramp, push, absT, type ShotProps } from "./common";

/** Wooden pier in the foreground. Origin = deck top center. */
const Pier: React.FC<{ w?: number; y?: number; x?: number; z?: number }> = ({ w = 1400, y = 0, x = 0, z = 0 }) => (
  <X x={x} y={y} z={z}>
    {Array.from({ length: Math.ceil(w / 220) }, (_, i) => (
      <Part key={`p${i}`} shape={roundRect(34, 420, 6)} color="#6e4a2c" shade={0.3} x={-w / 2 + 60 + i * 220} y={-200} />
    ))}
    <Part shape={roundRect(w, 70, 6)} color="#a5764a" shade={0.25} y={-35} z={0.01} />
    {Array.from({ length: Math.ceil(w / 110) }, (_, i) => (
      <Line key={`l${i}`} pts={[[-w / 2 + i * 110, -2], [-w / 2 + i * 110, -68]]} width={3.5} color="#6e4a2c" z={0.02} />
    ))}
  </X>
);

// 19.55 "Most Athenians decide it means their ships."
export const ShipsShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const idea = t > 21.05;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.07), y: -40 }} light={{ dir: [-0.8, 0.6] }}>
        <SeaSet mood="day" horizon={260}>
          <Trireme x={-260} y={250} len={420} sail seed={3} crew={0} z={1} row={0} />
          <Trireme x={330} y={240} len={380} sail seed={4} crew={0} z={1.1} row={0} />
          <Trireme x={120} y={-90} len={1050} sail seed={1} crew={6} z={3} row={0.3} />
          <Pier y={-430} z={5} />
          <Character
            {...GENERAL}
            x={-250}
            y={-430}
            s={1.25}
            z={6}
            look={0.5}
            talking={t > 19.7 && t < 22.0}
            expression={idea ? { eyes: "happy", mouth: "grin", blush: true } : { eyes: "open", mouth: "flat", brows: 0.3, gaze: [0.8, 0.3] }}
            pose={idea ? poses.point(frame) : poses.think}
          />
          {idea ? <Glow x={-250} y={-430 + 420 * 1.25} rx={260} color="#fff3b0" alpha={0.35 * ramp(t, 21.05, 21.3)} additive z={7} /> : null}
        </SeaSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 22.25 "They put their families on boats and"
export const BoardingShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const camX = interpolate(frame, [0, dur], [-80, 120]);
  return (
    <AbsoluteFill>
      <Stage camera={{ x: camX, zoom: 1.0, y: -40 }} light={{ dir: [-0.8, 0.6] }}>
        <SeaSet mood="day" horizon={300}>
          <Trireme x={420} y={-60} len={1300} sail seed={2} crew={7} z={2} row={0} />
          <X x={-40} y={-430} rot={0.42} z={3}>
            <Plank w={560} h={40} x={280} />
          </X>
          <Pier y={-430} x={-500} w={1200} z={4} />
          {[0, 1, 2, 3, 4].map((i) => {
            const p = ((frame * 3.2 + i * 150) % 760) - 520;
            const onPlank = p > -40;
            const y = onPlank ? -430 + (p + 40) * Math.tan(0.42) * 0.92 : -430;
            const kid = i % 3 === 2;
            return (
              <Character
                key={i}
                {...CITIZEN(i)}
                x={p}
                y={y}
                s={kid ? 0.72 : 0.98}
                z={5 + i * 0.01}
                look={0.6}
                expression={{ eyes: "open", mouth: i % 2 ? "wavy" : "flat", brows: 0.5, gaze: [0.8, 0] }}
                pose={poses.walk(frame + i * 7, 1.3)}
              />
            );
          })}
        </SeaSet>
      </Stage>
    </AbsoluteFill>
  );
};

// 24.10 "leave the city empty."
export const EmptyShot: React.FC<ShotProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const groundY = -520;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: -80 }} light={{ dir: [-0.8, 0.6] }} vignette={0.6}>
        <Backdrop mood="warm" horizon={groundY + 300} />
        <City w={2600} y={groundY + 300} scale={1.0} rows={1} seed={21} z={-12} />
        <Ground w={4000} h={1600} y={groundY + 300} color="#dcc79e" pebbles={18} tufts={10} tuftColor="#8a8a52" z={-10} />
        {[-380, 60, 360].map((x, i) => (
          <GreekHouse key={x} x={x} y={groundY + 20} w={320} h={230} z={-5 + i * 0.01} window={i !== 1} />
        ))}
        {Array.from({ length: 4 }, (_, i) => {
          const p = ((frame * 9 + i * 260) % 1400) - 700;
          return <Glow key={i} x={p} y={groundY - 120 + Math.sin(p / 90) * 30 + i * 30} rx={70} ry={30} color="#e8d4a6" alpha={0.5} z={2} />;
        })}
        <X x={((frame * 11) % 1400) - 700} y={groundY - 60 + Math.abs(Math.sin(frame * 0.3)) * 40} rot={frame * 0.4} z={3}>
          <Part shape={circle(14)} color="#8a9a5a" shade={0.3} />
        </X>
      </Stage>
    </AbsoluteFill>
  );
};

// 25.10 "But a few men stay behind, poor men and temple keepers."
export const StayShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const groundY = -640;
  const keeperUp = ramp(t, 27.7, 28.0, Easing.out(Easing.back(2)));
  const cast = [DEFENDERS[0], DEFENDERS[1], DEFENDERS[2], DEFENDERS[3]];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -60 }} light={{ dir: [-0.8, 0.6] }}>
        <Backdrop mood="warm" horizon={groundY + 420} />
        <X x={60} y={groundY + 420} s={0.7} z={-14}>
          <RockHill w={1100} h={560} />
          <GreekTemple w={420} colH={170} cols={6} y={560} z={1} />
        </X>
        <City w={2600} y={groundY + 410} scale={0.75} rows={1} seed={31} z={-12} />
        <Ground w={4000} h={1600} y={groundY + 420} color="#dcc79e" pebbles={14} tufts={6} z={-10} />
        {cast.map((d, i) => (
          <Character
            key={i}
            {...d}
            x={[-390, -175, 175, 390][i]}
            y={groundY + (i === 1 || i === 2 ? 30 : 0)}
            s={1.1}
            z={1 + i * 0.01}
            facing={i < 2 ? 1 : -1}
            look={0.25}
            expression={{ eyes: "angry", mouth: "flat", brows: -0.6 }}
            pose={i % 2 ? poses.handsOnHips : poses.idle(frame, i)}
          />
        ))}
        <Character
          {...TEMPLE_KEEPER}
          x={0}
          y={groundY - 30}
          s={1.18}
          z={2}
          look={0.1}
          expression={{ eyes: keeperUp > 0.5 ? "angry" : "half", mouth: "flat", brows: -0.5 }}
          pose={{ armF: [0.4 + keeperUp * 1.2, 0.2], armB: [-0.15, -0.1] }}
          holdF={<Staff rot={-0.4 - keeperUp * 1.2} />}
        />
      </Stage>
    </AbsoluteFill>
  );
};

// 28.95 "They take the prophecy word for word."
export const LiteralShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const look = t > 30.1;
  const nod = look ? Math.max(0, Math.sin((t - 30.1) * 9)) * 0.08 : 0;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.1), y: 0 }} light={{ dir: [-0.8, 0.6] }} vignette={0.6}>
        <Backdrop mood="warm" horizon={-200} mountains={false} />
        <City w={2600} y={-260} scale={1.3} rows={1} seed={41} z={-12} />
        <Ground w={4000} h={1600} y={-250} color="#dcc79e" pebbles={6} tufts={2} z={-10} />
        <Character
          {...DEFENDERS[1]}
          x={300}
          y={-560}
          s={1.25}
          z={1}
          facing={-1}
          look={0.4}
          expression={{ eyes: look ? "angry" : "open", mouth: look ? "smirk" : "flat", brows: -0.4, gaze: [0.6, 0] }}
          pose={{ armF: [0.25, 0.1], armB: [-0.3, -0.2], headTilt: -nod }}
          holdF={<Plank w={360} rot={0.1} y={-10} />}
        />
        <Character
          {...TEMPLE_KEEPER}
          x={-170}
          y={-620}
          s={1.55}
          z={2}
          look={0.35}
          expression={look ? { eyes: "angry", mouth: "smirk", brows: -0.6, gaze: [0.3, 0] } : { eyes: "half", mouth: "flat", gaze: [0.5, -0.8] }}
          pose={{ armF: [1.05, 0.55], armB: [-1.05, -0.55], headTilt: look ? -nod : 0.08 }}
        />
        <X x={-110} y={-620 + 190 * 1.55} z={3} rot={0.05}>
          <Scroll s={1.25} open={ramp(t, 29.0, 29.5)} />
        </X>
      </Stage>
    </AbsoluteFill>
  );
};

/** Point on a polyline at fraction f (0..1). */
const along = (pts: [number, number][], f: number): [number, number, number] => {
  const lens = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const total = lens.reduce((a, b) => a + b, 0);
  let d = Math.min(Math.max(f, 0), 1) * total;
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i]) {
      const k = d / lens[i];
      const dir = Math.sign(pts[i + 1][0] - pts[i][0]) || 1;
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k, dir];
    }
    d -= lens[i];
  }
  return [...pts[pts.length - 1], 1];
};

// 31.25 "They climb the Acropolis, the rocky hill above the city."
export const ClimbShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const groundY = -420;
  const camY = interpolate(t, [31.25, 34.8], [-260, 180], { easing: Easing.inOut(Easing.cubic), extrapolateRight: "clamp" });
  const zoom = interpolate(t, [31.25, 34.8], [1.0, 1.35], { easing: Easing.inOut(Easing.quad), extrapolateRight: "clamp" });
  const w = 1100;
  const h = 560;
  const base = groundY + 200;
  const path: [number, number][] = [
    [-w * 0.38, base + 10],
    [-w * 0.1, base + h * 0.22],
    [-w * 0.32, base + h * 0.45],
    [-w * 0.08, base + h * 0.68],
    [-w * 0.24, base + h * 0.95],
  ];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, y: camY, x: -120 }} light={{ dir: [-0.8, 0.6] }}>
        <AthensWide mood="warm" groundY={groundY} wall={false}>
          {[0, 1, 2, 3, 4].map((i) => {
            const f = interpolate(t, [31.25, 34.8], [0.05 + i * 0.09, 0.5 + i * 0.1]);
            const [x, y, dir] = along(path, f);
            return (
              <Character
                key={i}
                {...(i === 2 ? TEMPLE_KEEPER : DEFENDERS[i % 4])}
                x={x}
                y={y}
                s={0.2}
                z={5 + i * 0.01}
                facing={dir > 0 ? 1 : -1}
                shadow={false}
                expression={{ eyes: "dot", mouth: "flat" }}
                pose={{ ...poses.walk(frame + i * 9, 1.4), armF: [2.6, 0.4], armB: [-2.6, -0.4], armsOverHead: true }}
                holdF={<Plank w={300} h={36} rot={-1.57} />}
              />
            );
          })}
        </AthensWide>
      </Stage>
    </AbsoluteFill>
  );
};

// 34.80 "And they block the way up with planks and old doors."
export const BuildShot: React.FC<ShotProps> = ({ dur, start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const wallH = interpolate(t, [34.8, 37.6], [120, 320], { extrapolateRight: "clamp" });
  const hammer = (tt: number) => {
    // hits at fixed times (match the pounding SFX)
    const hits = [35.25, 35.6, 35.95, 36.9, 37.25, 37.6];
    let a = 2.6;
    for (const h of hits) {
      const d = tt - h;
      if (d > -0.18 && d < 0.12) a = d < 0 ? 2.6 - (1 + d / 0.18) * 1.1 : 1.5 + (d / 0.12) * 1.1;
    }
    return a;
  };
  const doorX = interpolate(t, [34.8, 37.8], [520, 120], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -120 }} light={{ dir: [-0.8, 0.6] }}>
        <AcropolisTop mood="warm" wallY={-360} wallH={Math.round(wallH / 20) * 20} wallW={900}>
          <Character
            {...DEFENDERS[0]}
            x={-420}
            y={-560}
            s={1.1}
            z={2}
            look={0.5}
            expression={{ eyes: "angry", mouth: "teeth", brows: -0.6 }}
            pose={{ armF: [hammer(t), 0.5], armB: [0.4, 0.8], armsOverHead: true }}
            holdF={<Hammer rot={-0.4} s={0.9} />}
          />
          {[0, 1].map((i) => (
            <Character
              key={i}
              {...DEFENDERS[i + 1]}
              x={doorX + i * 300}
              y={-650 - i * 10}
              s={1.05}
              z={3 + i * 0.01}
              facing={-1}
              look={0.5}
              expression={{ eyes: "open", mouth: "teeth", brows: 0.3, sweat: i === 1 }}
              pose={{ ...poses.walk(frame + i * 10, 1.0), armF: [1.4, 0.2], armB: [-1.0, 0.3] }}
            />
          ))}
          <X x={doorX + 150} y={-650 + 330} rot={0.04} z={2.9}>
            <Part shape={roundRect(330, 170, 6)} color="#8a5a3a" shade={0.22}>
              <Part shape={roundRect(130, 120, 4)} color={shadeHex("#8a5a3a", -0.08)} flat outline={4} x={-75} z={0.001} />
              <Part shape={roundRect(130, 120, 4)} color={shadeHex("#8a5a3a", -0.08)} flat outline={4} x={75} z={0.001} />
            </Part>
          </X>
          <Character
            {...TEMPLE_KEEPER}
            x={60}
            y={-700}
            s={1.15}
            z={4}
            look={0.4}
            facing={-1}
            talking={t > 35.0 && t < 36.5}
            expression={{ eyes: "angry", mouth: "flat", brows: -0.4 }}
            pose={poses.point(frame)}
            holdF={<Plank w={260} rot={-1.4} />}
          />
        </AcropolisTop>
      </Stage>
    </AbsoluteFill>
  );
};

// 38.05 "The Persians take the hill right across from them."
export const AreopagusShot: React.FC<ShotProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const camX = interpolate(t, [38.05, 39.7], [-60, 760], { easing: Easing.inOut(Easing.cubic), extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: 0.92, x: camX, y: 40 }} light={{ dir: [-0.8, 0.6] }}>
        <AthensWide mood="warm" persians groundY={-420} />
      </Stage>
    </AbsoluteFill>
  );
};

