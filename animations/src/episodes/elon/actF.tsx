import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Stage, DepthStage, X, Part, Line, Glow, Wash, Magnifier, roundRect, circle, ellipse, poly, blob, push, hitAt, absT, ramp, type ShotProps } from "../../kit";
import { Label } from "../../kit/captions";
import { Character, poses } from "../../kit/character";
import {
  SedanEV, Cybertruck, Phone, PostCard, Monitor, LineChart, MoneyBag, Gavel, Brain, Implant, Wheelchair, ChessBoard, Laptop, Humanoid, Bird, XMark, Book, Room, Window,
  FactorySet, RobotArm, StageSet, Skyline, Desk, OfficeChair, Box, GoldCoin, Cash, Sea,
} from "../../kit/env";
import { CourtroomSet, ServerRack } from "../../kit/env";
import { sec, pop, useScr } from "../../kit/shot";
import { Office, ChipsTable, Paper, RoadSet, Outdoors, Flash, usdFull } from "./sets";
import { ELON_TEE, ELON_X, DESIGNER, NOLAND, SUIT, STAFF, PERSON, WORKER, JUDGE } from "./cast";
import { upright } from "./actA";
import { MarketWall, StockLine, MARKET_GREEN, MARKET_RED } from "../../kit/env/market";

// 2018–2023: production hell, "funding secured", the Cybertruck, the richest
// man, SNL, more companies (tunnels, Neuralink, OpenAI, xAI, the robot), Twitter → X.

/** A row of audience heads (dark silhouettes) for stage shots. */
const AudienceHeads: React.FC<{ y?: number; n?: number; laugh?: number; frame: number }> = ({ y = -620, n = 7, laugh = 0, frame }) => (
  <>
    {Array.from({ length: n }, (_, i) => (
      <Part key={i} shape={circle(150)} color="#141018" flat outline={0} x={-1050 + (i * 2100) / (n - 1)} y={y + (i % 2) * 30 + (laugh ? Math.abs(Math.sin(frame * 0.5 + i)) * 18 * laugh : 0)} />
    ))}
  </>
);

/** Chat window with message bubbles (screen space). */
const ChatWindow: React.FC<{ w?: number; h?: number; n?: number }> = ({ w = 600, h = 400, n = 3 }) => (
  <X>
    <Part shape={roundRect(w, h, 10)} color="#f4f6f8" flat outline={0} />
    {Array.from({ length: n }, (_, i) => (
      <Part key={i} shape={roundRect(w * (i % 2 ? 0.55 : 0.45), 56, 20)} color={i % 2 ? "#3a8adf" : "#d8dde4"} flat outline={3} x={(i % 2 ? 1 : -1) * w * 0.2} y={h / 2 - 70 - i * 90} z={0.001} />
    ))}
  </X>
);

/** Little robot-face icons (bots / fake accounts). */
const BotIcon: React.FC<{ x: number; y: number; s?: number; z?: number }> = ({ x, y, s = 1, z = 0 }) =>
  s > 0.01 ? (
    <X x={x} y={y} s={s} z={z}>
      <Part shape={roundRect(110, 90, 18)} color="#9aa0aa" shade={0.2} />
      <Part shape={circle(12)} color="#e2584a" flat outline={3} x={-24} y={6} z={0.001} />
      <Part shape={circle(12)} color="#e2584a" flat outline={3} x={24} y={6} z={0.001} />
      <Line pts={[[0, 45], [0, 70]]} width={5} color="#9aa0aa" />
      <Part shape={circle(9)} color="#e9ba41" flat outline={3} y={74} z={0.001} />
    </X>
  ) : null;

// ───────────────────────── production hell ─────────────────────────

// 561.57 "But it's not all smooth."
export const NotSmoothShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const bump = Math.abs(Math.sin(frame * 0.45)) * 30;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.05), y: 0, shake: 4 }} light={{ dir: [-0.6, 0.6] }} vignette={0.65}>
        <X x={-((frame * 30) % 400)}>
          <RoadSet horizon={-160} mood="storm" />
        </X>
        <SedanEV x={0} y={-470 + bump} s={1.4} small color="#e8e8ea" rot={Math.sin(frame * 0.45) * 0.04} spin={frame * 0.4} z={5} />
      </Stage>
      <Label text="NOT ALL SMOOTH" x={0.5} y={0.1} size={0.06} kind="box" at={sec(start)(561.9)} />
    </AbsoluteFill>
  );
};

// 562.99 "In 2018, Tesla struggles to build its Model 3 fast enough."
export const Model3Shot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.82, 0.88), y: 140 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <FactorySet y={-420}>
          <Part shape={roundRect(4400, 50, 6)} color="#5a5e66" shade={0.2} y={-30} z={0.01} />
          {[-1300, -200, 900].map((x, i) => (
            <SedanEV key={x} x={x + ((frame * 0.6) % 120)} y={0} s={1.0} small color={["#e8e8ea", "#c8262f", "#2a3a5a"][i]} z={0.02} />
          ))}
          <RobotArm x={-760} y={0} a1={0.4 + Math.sin(frame * 0.05) * 0.2} a2={-1.0} a3={-0.4} spark={0.6} z={0.03} />
          <RobotArm x={340} y={0} a1={-0.3 + Math.sin(frame * 0.05 + 1) * 0.2} a2={1.0} a3={0.4} z={0.03} />
          {[-1600, 1550].map((x, i) => (
            <Character key={x} {...WORKER(i)} x={x} y={-180} s={1.2} facing={x < 0 ? 1 : -1} look={0.5} expression={{ eyes: "half", mouth: "flat", brows: 0.4 }} pose={poses.idle(frame, i)} z={0.05} />
          ))}
        </FactorySet>
      </Stage>
      <Label text="2018" x={0.1} y={0.1} size={0.06} kind="box" at={at(563.1)} />
      <Label text="MODEL 3: NOT FAST ENOUGH" x={0.9} y={0.86} size={0.05} kind="box" at={at(565.6)} />
    </AbsoluteFill>
  );
};

// 567.24 "Elon calls it 'production hell' and sleeps on the factory floor."
export const ProductionHellShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const asleep = t > 569.1;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -160 }} light={{ dir: [0.6, 0.5] }} vignette={0.75} vignetteColor="#1a0505">
        <FactorySet y={-420} night>
          <SedanEV x={500} y={0} s={1.1} small color="#e8e8ea" z={0.02} />
          {asleep ? (
            <X x={-420} y={70} rot={-1.5} z={0.03}>
              <Character {...ELON_TEE} s={1.0} expression={{ eyes: "closed", mouth: "open", eyebags: true }} pose={poses.idle(frame, 1)} shadow={false} />
            </X>
          ) : (
            <Character {...ELON_TEE} x={-420} y={-80} s={1.4} look={0.6} expression={{ eyes: "half", mouth: "flat", eyebags: true, brows: 0.5 }} pose={poses.idle(frame, 2)} z={0.03} />
          )}
          {asleep ? <Part shape={roundRect(170, 70, 30)} color="#f4f1ea" shade={0.15} x={-420 - 310} y={40} z={0.025} /> : null}
        </FactorySet>
        <Wash width={6000} height={4000} color="#c8262f" alpha={0.18} z={30} />
      </Stage>
      <Label text="“PRODUCTION HELL”" x={0.1} y={0.1} size={0.06} kind="box" at={at(568.0)} />
      <Label text="SLEEPS ON THE FACTORY FLOOR" x={0.9} y={0.86} size={0.05} kind="box" at={at(569.6)} />
    </AbsoluteFill>
  );
};

// 570.95 "That same year, he tweets that he has 'funding secured' to buy out Tesla's shareholders."
export const FundingSecuredShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.6] }} vignette={0.65}>
        <Part shape={roundRect(4000, 3000, 0)} color="#2a3242" flat outline={0} z={-41} />
        <Glow rx={900} ry={600} color="#4a6a9a" alpha={0.3} additive z={-40} />
        <PostCard w={1300} h={420} avatar="#2a2a32" s={pop(t, 571.7)} />
      </Stage>
      <Label text="2018" x={0.1} y={0.1} size={0.06} kind="box" at={at(571.1)} />
      <Label text="“FUNDING SECURED”" x={0.5} y={0.52} size={0.07} pin kind="ink" at={at(572.77)} />
      <Label text="TO BUY OUT TESLA'S SHAREHOLDERS" x={0.5} y={0.86} size={0.05} kind="box" at={at(573.8)} />
    </AbsoluteFill>
  );
};

// 575.89 "US regulators say that wasn't true."
export const RegulatorsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const arm: [number, number] = [1.35, 0.15];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -20 }} light={{ dir: [-0.6, 0.6] }} vignette={0.65}>
        <Office era="2020" desk={false}>
          <X x={360} y={80} z={-2}>
            <Monitor w={900} h={520} screen="#f4f6f8" stand={false}>
              <PostCard w={760} h={260} avatar="#2a2a32" s={1} />
            </Monitor>
          </X>
          <Character {...SUIT(0)} x={-640} y={-620} s={1.55} look={0.6} expression={{ eyes: "open", mouth: "frown", brows: 0.2 }} pose={{ ...poses.idle(frame, 1), armF: arm }} holdF={<Magnifier r={60} rot={upright(arm) - 1.57} s={0.9} />} z={2} />
          <Character {...SUIT(2)} x={-1000} y={-660} s={1.5} look={0.6} expression={{ eyes: "half", mouth: "flat", brows: -0.4 }} pose={poses.handsOnHips} z={1.9} />
        </Office>
      </Stage>
      <Label text="US REGULATORS" x={0.1} y={0.1} size={0.055} kind="box" at={at(576.2)} />
      <Label text="“NOT TRUE”" x={0.9} y={0.86} size={0.075} kind="stamp" at={at(577.6)} />
    </AbsoluteFill>
  );
};

// 578.57 "Without admitting wrongdoing, he and Tesla each pay a 20-million-dollar fine, and he steps down as Tesla's chairman."
export const FineShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const zoom = push(frame, dur, 1.0, 1.06);
  const fall = ramp(t, 583.6, 584.4, Easing.in(Easing.quad));
  const bag = (x: number) => sc(x, -60, zoom, 0, -20);
  const plate = sc(620, -350, zoom, 0, -20);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, y: -20 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Office era="2020" desk={false}>
          <Character {...SUIT(0)} x={-680} y={-600} s={1.3} look={0.5} expression={{ eyes: "open", mouth: "flat", brows: -0.3 }} pose={poses.talk(frame, 1)} talking={t < 581} z={1} />
          <Character {...ELON_TEE} x={680} y={-600} s={1.3} facing={-1} look={0.5} expression={{ eyes: "open", mouth: "frown", brows: 0.2 }} pose={poses.idle(frame, 3)} z={1} />
          <Part shape={roundRect(2100, 60, 12)} color="#6e4a2c" shade={0.2} y={-430} z={2} />
          <Part shape={roundRect(2000, 260, 12)} color="#5a3a20" shade={0.2} y={-580} z={1.9} />
          <MoneyBag x={-180} y={-400} s={0.95 * pop(t, 581.2)} z={2.5} />
          <MoneyBag x={180} y={-400} s={0.95 * pop(t, 581.5)} z={2.5} />
          <X x={620} y={-380 - fall * 600} rot={fall * 0.9} s={0.45 * pop(t, 583.3)} z={2.6}>
            <Part shape={poly([[-300, -60], [300, -60], [260, 90], [-260, 90]])} color="#5a3a20" shade={0.2} />
            <Part shape={roundRect(520, 110, 10)} color="#e9ba41" shade={0.15} y={20} z={0.001} />
          </X>
        </Office>
      </Stage>
      <Label text="NO ADMISSION OF WRONGDOING" x={0.1} y={0.1} size={0.045} kind="box" at={at(578.9)} />
      <Label text="$20M" x={bag(-180).x} y={bag(-180).y} size={0.04} pin kind="ink" at={at(581.3)} />
      <Label text="$20M" x={bag(180).x} y={bag(180).y} size={0.04} pin kind="ink" at={at(581.6)} />
      <Label text="ELON" x={bag(-180).x} y={0.86} size={0.042} kind="box" pin at={at(581.3)} />
      <Label text="TESLA" x={bag(180).x} y={0.86} size={0.042} kind="box" pin at={at(581.6)} />
      {fall < 0.05 ? <Label text="CHAIRMAN" x={plate.x} y={plate.y} size={0.026} pin kind="ink" at={at(583.4)} /> : null}
      <Label text="STEPS DOWN AS CHAIRMAN" x={0.9} y={0.1} size={0.05} kind="box" at={at(583.6)} />
    </AbsoluteFill>
  );
};

// 585.29 "In 2019, he shows off the Cybertruck, a steel pickup truck with 'armor glass.'"
export const CybertruckRevealShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const lit = ramp(t, 586.6, 587.2);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02), y: -40 }} light={{ dir: [-0.5, 0.7] }} vignette={0.75} vignetteColor="#05070e">
        <StageSet curtain="#1a1a24" spots={lit} floor="#2a2a32" y={-420} />
        <Cybertruck x={220} y={-470} s={1.35} lights={lit} z={2} />
        <Character {...ELON_TEE} outfit={{ top: "#1f1f25", bottom: "#26262c", boots: "#1e1e22", collar: "round" }} x={-700} y={-560} s={1.45} look={0.6} expression={{ eyes: "happy", mouth: "grin" }} pose={poses.point(frame)} z={3} />
        <AudienceHeads frame={frame} />
      </Stage>
      <Label text="2019" x={0.1} y={0.1} size={0.06} kind="box" at={at(585.45)} />
      <Label text="CYBERTRUCK" x={0.9} y={0.1} size={0.065} kind="box" at={at(587.25)} />
      <Label text="“ARMOR GLASS”" x={0.9} y={0.86} size={0.06} kind="stamp" at={at(589.6)} />
    </AbsoluteFill>
  );
};

// 590.77 "On stage, his designer throws a metal ball at the window to show how strong it is."
export const BallThrowShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const wind = ramp(t, 593.6, 594.4);
  const fly = ramp(t, 594.6, 595.4, Easing.linear);
  const arm: [number, number] = t < 594.6 ? [1.0 - wind * 1.4, 0.6] : [2.2, 0.2];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02), y: -60 }} light={{ dir: [-0.5, 0.7] }} vignette={0.75} vignetteColor="#05070e">
        <StageSet curtain="#1a1a24" spots={1} floor="#2a2a32" y={-420} />
        <Cybertruck x={360} y={-470} s={1.3} lights={1} z={2} />
        <Character {...DESIGNER} x={-560} y={-580} s={1.5} look={0.6} expression={{ eyes: "open", mouth: "smirk", brows: -0.3 }} pose={{ ...poses.idle(frame, 1), armF: arm, lean: -0.08 * wind }} holdF={t < 594.6 ? <Part shape={circle(24)} color="#9aa0aa" shade={0.3} /> : null} z={3} />
        {t >= 594.6 ? <Part shape={circle(30)} color="#9aa0aa" shade={0.3} x={interpolate(fly, [0, 1], [-420, 380])} y={interpolate(fly, [0, 0.5, 1], [-80, 40, -170])} z={4} /> : null}
        <AudienceHeads frame={frame} />
      </Stage>
      <Label text="HIS DESIGNER" x={0.1} y={0.1} size={0.05} kind="box" at={at(591.8)} />
      <Label text="A METAL BALL" x={0.9} y={0.1} size={0.05} kind="box" at={at(593.0)} />
    </AbsoluteFill>
  );
};

// 595.52 "It cracks."
export const CrackShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 2.4, 2.5), x: 300, y: -260, shake: hitAt(t, 595.6, 0.35) * 10 }} light={{ dir: [-0.5, 0.7] }} vignette={0.75} vignetteColor="#05070e">
        <StageSet curtain="#1a1a24" spots={1} floor="#2a2a32" y={-420} />
        <Cybertruck x={360} y={-470} s={1.3} lights={1} crack={ramp(t, 595.6, 595.9)} z={2} />
      </Stage>
      <Label text="IT CRACKS" x={0.5} y={0.86} size={0.08} kind="stamp" at={at(595.65)} />
    </AbsoluteFill>
  );
};

// 596.68 "They try the back window. That cracks too."
export const BackWindowShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const fly = ramp(t, 597.5, 598.15, Easing.linear);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02), y: -60, shake: hitAt(t, 598.15, 0.3) * 8 }} light={{ dir: [-0.5, 0.7] }} vignette={0.75} vignetteColor="#05070e">
        <StageSet curtain="#1a1a24" spots={1} floor="#2a2a32" y={-420} />
        <Cybertruck x={360} y={-470} s={1.3} lights={1} crack={1} crack2={ramp(t, 598.15, 598.45)} z={2} />
        <Character {...DESIGNER} x={-560} y={-580} s={1.5} look={0.6} expression={{ eyes: "wide", mouth: "wavy", brows: 0.6 }} pose={{ ...poses.idle(frame, 1), armF: t < 597.5 ? [-0.4, 0.6] : [2.2, 0.2] }} z={3} />
        <Character {...ELON_TEE} x={-200} y={-600} s={1.45} look={0.5} expression={{ eyes: t > 598.2 ? "half" : "open", mouth: t > 598.2 ? "wavy" : "smile", brows: t > 598.2 ? 0.7 : 0, sweat: t > 598.2 }} pose={poses.idle(frame, 3)} z={3.1} />
        {t > 597.5 && t < 598.2 ? <Part shape={circle(30)} color="#9aa0aa" shade={0.3} x={interpolate(fly, [0, 1], [-420, 260])} y={interpolate(fly, [0, 0.5, 1], [-80, 30, -140])} z={4} /> : null}
        <AudienceHeads frame={frame} laugh={t > 598.3 ? 1 : 0} />
      </Stage>
      <Label text="THE BACK WINDOW" x={0.1} y={0.1} size={0.05} kind="box" at={at(597.1)} />
      <Label text="CRACKS TOO" x={0.9} y={0.86} size={0.07} kind="stamp" at={at(598.2)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── the richest ─────────────────────────

// 599.41 "Still, Tesla's stock keeps climbing."
export const StockClimbShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const zoom = push(frame, dur, 1.0, 1.06);
  const cx = 120;
  const cy = 110;
  const title = sc(230, 190 + 240, zoom, cx, cy);
  const sub = sc(230, 190 + 160, zoom, cx, cy);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, x: cx, y: cy }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <MarketWall rows={2}>
          <StockLine w={1180} h={400} y={-10} values={[0.05, 0.07, 0.06, 0.1, 0.18, 0.3, 0.55, 0.9]} k={ramp(t, 599.4, 601.9)} seed={8} />
        </MarketWall>
      </Stage>
      <Label text="TESLA" x={title.x} y={title.y} size={0.1} kind="hand" italic pin at={at(600.06)} />
      <Label text="STOCK PRICE" x={sub.x} y={sub.y} size={0.075} kind="hand" italic pin at={at(600.47)} />
    </AbsoluteFill>
  );
};

/** Winners' podium (1-2-3). Origin = floor centre. */
const Podium: React.FC = () => (
  <X>
    {[[-420, 260, "#c9ced6"], [0, 420, "#e9ba41"], [420, 180, "#c98a5a"]].map(([x, h, c], i) => (
      <Part key={i} shape={roundRect(400, h as number, 8)} color={c as string} shade={0.2} x={x as number} y={(h as number) / 2} />
    ))}
  </X>
);

// 602.11 "By January 2021, Elon Musk is the richest person in the world."
export const RichestShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.98), y: 100 }} light={{ dir: [-0.5, 0.7] }} vignette={0.65}>
        <StageSet curtain="#2a2a4a" spots={1} floor="#3a3a48" y={-420} />
        <X y={-420} z={1}>
          <Podium />
        </X>
        <Character {...SUIT(1)} x={-420} y={-160} s={1.15} look={0.6} expression={{ eyes: "open", mouth: "flat" }} pose={poses.idle(frame, 1)} z={2} />
        <Character {...SUIT(3)} x={420} y={-240} s={1.15} facing={-1} look={0.6} expression={{ eyes: "open", mouth: "flat" }} pose={poses.idle(frame, 2)} z={2} />
        <Character {...ELON_TEE} x={0} y={0} s={1.3} look={0.2} expression={{ eyes: "happy", mouth: "grin" }} pose={t > 604.6 ? poses.armsUp(frame) : poses.idle(frame, 3)} z={2.1} />
      </Stage>
      <Label text="JANUARY 2021" x={0.1} y={0.1} size={0.06} kind="box" at={at(602.3)} />
      <Label text="RICHEST PERSON IN THE WORLD" x={0.5} y={0.86} size={0.06} kind="stamp" at={at(604.75)} />
    </AbsoluteFill>
  );
};

// 606.52 "Later that year, Tesla is worth more than a trillion dollars."
export const TrillionTeslaShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const sc = useScr();
  const zoom = push(frame, dur, 1.1, 1.16);
  const cx = 200;
  const cy = 130;
  const k = ramp(t, 607.4, 608.9, Easing.out(Easing.cubic));
  const v = (0.62 + 0.38 * k) * 1e12;
  const title = sc(230, 190 + 240, zoom, cx, cy);
  const sub = sc(230, 190 + 160, zoom, cx, cy);
  const val = sc(470, 10, zoom, cx, cy);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom, x: cx, y: cy }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <MarketWall rows={2}>
          <StockLine w={1180} h={400} y={-10} values={[0.1, 0.15, 0.13, 0.25, 0.33, 0.45, 0.6, 0.72, 0.86, 0.95]} k={0.7 + ramp(t, 606.6, 609.0) * 0.3} seed={17} />
        </MarketWall>
      </Stage>
      <Label text="TESLA" x={title.x} y={title.y} size={0.1} kind="hand" italic pin at={at(606.6)} />
      <Label text="MARKET CAP" x={sub.x} y={sub.y} size={0.075} kind="hand" italic pin at={at(606.9)} />
      <Label text={k >= 0.999 ? "$1,000,000,000,000+" : usdFull(Math.round(v / 1e9) * 1e9)} x={val.x} y={val.y} size={0.095} kind="hand" color={MARKET_GREEN} pin at={at(607.4)} />
    </AbsoluteFill>
  );
};

/** Baby in a blanket (held). */
const BabyBundle: React.FC<{ s?: number; rot?: number }> = ({ s = 1, rot = 0 }) => (
  <X s={s} rot={rot}>
    <Part shape={blob([[-120, -30], [-90, 40], [10, 60], [110, 40], [130, -10], [80, -50], [-40, -60]], 8)} color="#c9d6e2" shade={0.2} />
    <Part shape={circle(46)} color="#f6f5f8" shade={0.22} x={-70} y={18} z={0.001} />
    <Line pts={[[-86, 22], [-78, 18]]} width={3.5} z={0.002} />
    <Line pts={[[-64, 24], [-56, 20]]} width={3.5} z={0.002} />
  </X>
);

// 610.05 "Along the way, he even names one of his sons X."
export const SonXShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const arm: [number, number] = [0.85, 1.25];
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6} bgBlur={7} bg={<Office era="2020" />}>
        <Character {...ELON_TEE} x={-260} y={-700} s={2.2} look={0.55} expression={{ eyes: "happy", mouth: "smile", gaze: [0.5, -0.5] }} pose={{ ...poses.idle(frame, 2), armF: arm, armB: [0.7, 1.4] }} />
        <X x={-130} y={-320} z={0.6}>
          <BabyBundle s={1.0} rot={0.08} />
        </X>
        <XMark x={460} y={180} size={340 * pop(t, 612.36)} color="#f4f4f6" z={3} />
        {t > 612.36 ? <Glow x={460} y={180} rx={320} color="#7fd0ff" alpha={0.35} additive z={2.9} /> : null}
      </DepthStage>
      <Label text="HIS SON'S NAME" x={0.9} y={0.86} size={0.05} kind="box" at={at(612.4)} />
    </AbsoluteFill>
  );
};

// 613.27 "And in 2021, he hosts the comedy show Saturday Night Live."
export const SNLShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.98), y: -60 }} light={{ dir: [-0.5, 0.7] }} vignette={0.7}>
        <StageSet curtain="#6a1e3a" spots={1} floor="#3a2a2a" y={-420} />
        <Character {...ELON_TEE} outfit={{ top: "#2a2a32", shirt: "#f4f4f2", bottom: "#2a2a32", boots: "#18181c" }} x={0} y={-520} s={1.5} look={0.2} talking expression={{ eyes: "open", mouth: "smile" }} pose={poses.talk(frame, 1)} z={2} />
        <AudienceHeads frame={frame} />
      </Stage>
      <Label text="2021" x={0.1} y={0.1} size={0.06} kind="box" at={at(613.6)} />
      <Label text="SATURDAY NIGHT LIVE" sub="HE HOSTS THE COMEDY SHOW" x={0.9} y={0.1} size={0.06} kind="box" at={at(616.36)} />
    </AbsoluteFill>
  );
};

// 617.81 "On stage, he says he has Asperger's syndrome."
export const AspergersShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <DepthStage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: 60 }} light={{ dir: [-0.5, 0.7] }} vignette={0.7} bgBlur={7} bg={<StageSet curtain="#6a1e3a" spots={1} floor="#3a2a2a" y={-420} />}>
        <Character {...ELON_TEE} outfit={{ top: "#2a2a32", shirt: "#f4f4f2", bottom: "#2a2a32", boots: "#18181c" }} x={-220} y={-720} s={2.4} look={0.4} talking expression={{ eyes: "open", mouth: "smile" }} pose={poses.talk(frame, 3)} />
      </DepthStage>
      <Label text="ASPERGER'S SYNDROME" x={0.85} y={0.86} size={0.06} kind="box" at={at(619.65)} />
    </AbsoluteFill>
  );
};

// 621.13 "He jokes that he's the first person with Asperger's to host the show. 'Or at least the first to admit it.'"
export const FirstToAdmitShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -60 }} light={{ dir: [-0.5, 0.7] }} vignette={0.7}>
        <StageSet curtain="#6a1e3a" spots={1} floor="#3a2a2a" y={-420} />
        <Character {...ELON_TEE} outfit={{ top: "#2a2a32", shirt: "#f4f4f2", bottom: "#2a2a32", boots: "#18181c" }} x={0} y={-500} s={1.6} look={0.2} talking={t < 625.8} expression={{ eyes: t > 625.8 ? "happy" : "open", mouth: t > 625.8 ? "grin" : "smile" }} pose={poses.talk(frame, 2)} z={2} />
        <AudienceHeads frame={frame} laugh={t > 625.8 ? 1 : 0} />
      </Stage>
      <Label text="THE FIRST HOST WITH ASPERGER'S" x={0.1} y={0.1} size={0.045} kind="box" at={at(622.0)} />
      <Label text="“…OR AT LEAST THE FIRST TO ADMIT IT.”" x={0.5} y={0.86} size={0.05} kind="box" at={at(624.52)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── more companies ─────────────────────────

// 626.44 "He keeps starting companies too."
export const StartingCompaniesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const badges: [string, React.ReactNode][] = [
    ["#3a7ac9", <Brain key="b" s={0.34} y={-10} />],
    ["#e9ba41", <Humanoid key="h" s={0.32} y={-150} />],
    ["#3fa07a", <X key="c"><ChatWindow w={210} h={150} n={2} /></X>],
    ["#8a5ac9", <X key="t"><Part shape={ellipse(110, 70)} color="#4a3a32" shade={0.2} /><Part shape={ellipse(80, 46)} color="#1e1a1e" flat outline={0} z={0.001} /></X>],
  ];
  const spots: [number, number][] = [[-640, 260], [640, 260], [-760, -120], [760, -120]];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 0 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Office era="2020" desk={false}>
          <Character {...ELON_TEE} x={0} y={-640} s={1.7} look={0.2} expression={{ eyes: "happy", mouth: "grin" }} pose={poses.armsUp(frame)} z={2} />
          {badges.map(([col, ic], i) => (
            <X key={i} x={spots[i][0]} y={spots[i][1]} s={pop(t, 626.6 + i * 0.25)} z={3}>
              <Part shape={circle(175)} color="#f4f1ea" shade={0.15} />
              <Part shape={circle(150)} color={col} flat outline={5} z={0.001} />
              <X z={0.002}>{ic}</X>
            </X>
          ))}
        </Office>
      </Stage>
      <Label text="MORE COMPANIES" x={0.5} y={0.1} size={0.06} kind="box" at={sec(start)(626.9)} />
    </AbsoluteFill>
  );
};

// 628.21 "One digs tunnels under cities."
export const TunnelsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.9, 0.95), y: -60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Part shape={roundRect(5000, 1600, 0)} color="#8ec9ee" flat outline={0} y={1000} z={-41} />
        <Skyline y={200} z={-30} hmin={200} hmax={700} />
        <Part shape={roundRect(5000, 110, 0)} color="#5a5a62" flat outline={5} y={150} z={-25} />
        <Part shape={roundRect(5000, 1800, 0)} color="#8a6a4a" shade={0.1} y={-800} z={-24} />
        {Array.from({ length: 30 }, (_, i) => (
          <Part key={i} shape={circle(10 + (i % 3) * 6)} color="#6e5238" flat outline={0} x={-2200 + i * 150} y={0 - (i % 4) * 160} z={-23} />
        ))}
        <Part shape={roundRect(5000, 320, 160)} color="#2a2a30" flat outline={7} y={-380} z={-20} />
        <Line pts={[[-2500, -310], [2500, -310]]} width={4} color="#e9ba41" opacity={0.5} z={-19} />
        <SedanEV x={-1300 + ((frame * 22) % 2800)} y={-520} s={0.85} color="#c8262f" lights={1} z={-18} />
      </Stage>
      <Label text="TUNNELS UNDER CITIES" x={0.1} y={0.1} size={0.055} kind="box" at={at(628.5)} />
    </AbsoluteFill>
  );
};

// 630.10 "Another, called Neuralink, puts chips in human brains."
export const NeuralinkShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08) }} light={{ dir: [-0.6, 0.6] }} vignette={0.65}>
        <Part shape={roundRect(4000, 3000, 0)} color="#1a2238" flat outline={0} z={-41} />
        <Glow rx={800} color="#4a6adf" alpha={0.3} additive z={-40} />
        <Brain x={0} y={-40} s={2.6} />
        <Implant x={120} y={260 + (1 - ramp(t, 631.9, 632.5)) * 400} s={1.4} glow={ramp(t, 632.4, 632.8)} z={1} />
      </Stage>
      <Label text="NEURALINK" x={0.1} y={0.1} size={0.065} kind="box" at={at(631.04)} />
      <Label text="CHIPS IN HUMAN BRAINS" x={0.9} y={0.86} size={0.055} kind="box" at={at(632.5)} />
    </AbsoluteFill>
  );
};

// 633.67 "In 2024, a paralyzed man named Noland Arbaugh plays chess on a computer just by thinking."
export const NolandShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -40 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Room wall="#d4dce2" floor="#9aa4aa" y={-420} boards={false} z={-40}>
          <Window x={-700} y={1000} w={480} h={480} />
        </Room>
        <X x={-420} y={-470} z={1}>
          <Wheelchair s={1.4} />
          <Character {...NOLAND} x={-14} y={96 * 1.4 - 20} s={1.3} look={0.6} expression={{ eyes: "open", mouth: "smile", gaze: [0.7, -0.1] }} pose={{ ...poses.sit(frame), armF: [0.4, 0.5], armB: [0.2, 0.6] }} z={-0.3} />
        </X>
        <X x={480} y={-420} z={0.5}>
          <Part shape={roundRect(700, 30, 6)} color="#8a6a4a" shade={0.2} y={300} />
          <Line pts={[[-300, 0], [-300, 300]]} width={14} color="#6e4a2c" />
          <Line pts={[[300, 0], [300, 300]]} width={14} color="#6e4a2c" />
          <Laptop x={0} y={315} w={560} glow={0.8}>
            <ChessBoard w={300} move={ramp(t, 638.3, 638.9)} y={-10} />
          </Laptop>
        </X>
        {[0, 1, 2].map((i) => {
          const ph = ((frame * 0.04 + i / 3) % 1);
          return <Line key={i} pts={Array.from({ length: 9 }, (_, j) => [-200 + ph * 360 + Math.cos(-0.8 + j * 0.2) * 70, 120 + Math.sin(-0.8 + j * 0.2) * 70] as [number, number])} smooth width={6} color="#7fd0ff" opacity={1 - ph} z={2} />;
        })}
      </Stage>
      <Label text="2024" x={0.1} y={0.1} size={0.06} kind="box" at={at(633.8)} />
      <Label text="NOLAND ARBAUGH" sub="PARALYZED" x={0.9} y={0.1} size={0.055} kind="box" at={at(636.24)} />
      <Label text="PLAYS CHESS JUST BY THINKING" x={0.5} y={0.86} size={0.055} kind="stamp" at={at(638.3)} />
    </AbsoluteFill>
  );
};

// 639.46 "Elon also helped start OpenAI, the company that later made ChatGPT."
export const OpenAIShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -20 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Office era="2020" desk={false}>
          <X x={360} y={60} z={-2}>
            <Monitor w={900} h={560} screen="#f4f6f8" stand={false}>
              <ChatWindow w={840} h={500} n={Math.min(4, 1 + Math.floor(Math.max(0, t - 641.5) * 2))} />
            </Monitor>
          </X>
          <Character {...ELON_TEE} x={-620} y={-640} s={1.6} look={0.6} expression={{ eyes: "open", mouth: "smile" }} pose={poses.point(frame)} z={2} />
        </Office>
      </Stage>
      <Label text="OPENAI" sub="HE HELPED START IT" x={0.1} y={0.1} size={0.06} kind="box" at={at(640.76)} />
      <Label text="LATER MADE CHATGPT" x={0.9} y={0.86} size={0.05} kind="box" at={at(642.86)} />
    </AbsoluteFill>
  );
};

// 644.10 "Then he left, and in 2023 he starts his own AI company, xAI."
export const XaiShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 0 }} light={{ dir: [-0.6, 0.6] }} vignette={0.7} vignetteColor="#05070e">
        <Part shape={roundRect(4000, 3000, 0)} color="#0e1220" flat outline={0} z={-41} />
        <Part shape={roundRect(5000, 1000, 0)} color="#161b28" flat outline={5} y={-920} z={-35} />
        {Array.from({ length: 11 }, (_, i) => (
          <ServerRack key={i} x={-1650 + i * 330} y={-420} h={1040} seed={i + 1} z={-30} />
        ))}
        <Glow x={0} y={-200} rx={1600} ry={500} color="#2a4a9a" alpha={0.25} additive z={-29} />
        <Glow x={360} y={120} rx={700} color="#4a6adf" alpha={0.35 * ramp(t, 647.8, 648.6)} additive z={-28} />
        <XMark x={360} y={140} size={420 * pop(t, 648.44)} color="#f4f4f6" z={-27} />
        <Character {...ELON_X(false)} x={interpolate(t, [644.0, 646.0], [-1100, -560], { extrapolateRight: "clamp" })} y={-640} s={1.6} look={0.6} expression={{ eyes: "open", mouth: "smirk" }} pose={t < 646.0 ? poses.walk(frame, 1.0) : poses.idle(frame, 2)} z={2} />
      </Stage>
      <Label text="2023" x={0.1} y={0.1} size={0.06} kind="box" at={at(645.3)} />
      <Label text="xAI" sub="HIS OWN AI COMPANY" x={0.9} y={0.86} size={0.07} kind="box" at={at(648.5)} />
    </AbsoluteFill>
  );
};

/** Old science-fiction paperback (generic cover). */
const SciFiPaperback: React.FC<{ s?: number; x?: number; y?: number; rot?: number }> = ({ s = 1, x = 0, y = 0, rot = 0 }) => (
  <X x={x} y={y} s={s} rot={rot}>
    <Part shape={roundRect(400, 600, 10)} color="#e8c46a" shade={0.15} />
    <Part shape={roundRect(340, 360, 8)} color="#1a2a5a" flat outline={5} y={-40} z={0.001} />
    <Part shape={circle(70)} color="#c8643a" shade={0.25} x={-60} y={10} z={0.002} />
    <X x={70} y={-80} rot={-0.6} z={0.003}>
      <Part shape={roundRect(26, 110, 12)} color="#eef0f3" shade={0.2} />
    </X>
    <Part shape={roundRect(300, 50, 6)} color="#c8262f" flat outline={4} y={230} z={0.001} />
  </X>
);

// 649.53 "Its chatbot is called Grok, a word from an old science fiction novel."
export const GrokShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Paper>
          <X x={-380} y={60} s={pop(t, 650.3)}>
            <Part shape={roundPoly8()} color="#1f1f25" shade={0.15} />
          </X>
          <SciFiPaperback x={520} y={-20} s={pop(t, 651.7) * 1.1} rot={0.08} />
        </Paper>
      </Stage>
      <Label text="GROK" x={0.5 - 380 / 1920} y={0.5 - 60 / 1080} size={0.075} pin at={at(650.75)} />
      <Label text="A WORD FROM AN OLD SCI-FI NOVEL" x={0.5} y={0.86} size={0.05} kind="box" at={at(652.0)} />
    </AbsoluteFill>
  );
};
const roundPoly8 = () => poly([[-360, -160], [360, -160], [360, 160], [-140, 160], [-260, 260], [-240, 160], [-360, 160]]);

// 653.74 "At Tesla, he announces a humanoid robot."
export const RobotShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -40 }} light={{ dir: [-0.5, 0.7] }} vignette={0.7}>
        <StageSet curtain="#1a1a24" spots={1} floor="#2a2a32" y={-420} />
        <Humanoid x={140} y={-460} s={1.15} armF={[0.3 + Math.sin(frame * 0.1) * 0.1, 0.3]} armB={[-0.2, -0.2]} headTilt={Math.sin(frame * 0.07) * 0.05} z={2} />
        <Character {...ELON_TEE} x={-640} y={-560} s={1.45} look={0.6} expression={{ eyes: "happy", mouth: "grin" }} pose={poses.point(frame)} z={3} />
        <AudienceHeads frame={frame} />
      </Stage>
      <Label text="A HUMANOID ROBOT" x={0.9} y={0.1} size={0.06} kind="box" at={at(655.4)} />
    </AbsoluteFill>
  );
};

// 656.90 "To show it off, a man in a robot costume dances on stage."
export const DancerShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const b = frame * 0.42;
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.05, 1.12), y: -20 }} light={{ dir: [-0.5, 0.7] }} vignette={0.7}>
        <StageSet curtain="#2a1a3a" spots={1} floor="#2a2a32" y={-420} />
        <Humanoid
          costume
          x={Math.sin(b * 0.5) * 120}
          y={-460}
          s={1.2}
          armF={[1.6 + Math.sin(b) * 0.9, 0.6 + Math.cos(b) * 0.5]}
          armB={[-1.6 - Math.sin(b + 1) * 0.9, -0.6]}
          legF={Math.sin(b) * 0.4}
          legB={-Math.sin(b) * 0.4}
          lean={Math.sin(b * 0.5) * 0.12}
          bob={Math.abs(Math.sin(b)) * 24}
          z={2}
        />
        <AudienceHeads frame={frame} laugh={1} />
      </Stage>
      <Label text="A MAN IN A ROBOT COSTUME" x={0.1} y={0.1} size={0.055} kind="box" at={at(658.5)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── Twitter → X ─────────────────────────

// 661.10 "In 2022, he makes his biggest bet yet."
export const BiggestBetShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const k = ramp(t, 662.6, 663.6);
  const pushArm: [number, number] = [0.55 + k * 0.55, 0.5 - k * 0.35];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.08), y: -150 }} light={{ dir: [-0.4, 0.8] }} vignette={0.7}>
        <ChipsTable push={k} y={-640} n={12}>
          <Character {...ELON_X(false)} x={-420} y={-520} s={1.7} look={0.6} expression={{ eyes: "open", mouth: "smirk", brows: -0.4, gaze: [0.6, -0.5] }} pose={{ ...poses.idle(frame, 2), armF: pushArm, armB: [pushArm[0] - 0.2, pushArm[1] + 0.1] }} />
        </ChipsTable>
      </Stage>
      <Label text="2022" x={0.1} y={0.1} size={0.06} kind="box" at={at(661.3)} />
      <Label text="HIS BIGGEST BET YET" x={0.5} y={0.86} size={0.07} kind="stamp" at={at(662.9)} />
    </AbsoluteFill>
  );
};

// 664.24 "He offers 44 billion dollars for Twitter."
export const OfferShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 20 }} light={{ dir: [-0.5, 0.7] }} vignette={0.7}>
        <StageSet curtain="#2a3a6a" spots={1} y={-420} />
        <Part shape={roundRect(420, 300, 12)} color="#e8e2d8" shade={0.2} x={300} y={-270} z={2} />
        <Bird x={290} y={40} s={1.5} flap={Math.max(0, Math.sin(frame * 0.5)) * 0.5} z={3} />
        <Character {...ELON_X(false)} x={-560} y={-560} s={1.6} look={0.6} expression={{ eyes: "open", mouth: "smirk" }} pose={poses.point(frame)} z={3} />
      </Stage>
      <Label text="TWITTER" x={0.1} y={0.1} size={0.06} kind="box" at={at(666.4)} />
      <Label text="$44 BILLION" x={0.85} y={0.86} size={0.08} kind="stamp" at={at(664.8)} />
    </AbsoluteFill>
  );
};

// 667.28 "Then he tries to back out, saying the site has too many fake accounts."
export const BackOutShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -20 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Office era="2020" desk={false}>
          <Monitor x={380} y={120} w={980} h={600} screen="#f4f6f8" stand={false} z={-5}>
            <Part shape={roundRect(940, 60, 6)} color="#3a8adf" flat outline={0} y={240} />
            <Bird s={0.9} y={20} z={0.001} />
          </Monitor>
          {Array.from({ length: 8 }, (_, i) => (
            <BotIcon key={i} x={380 + Math.cos(i * 0.785) * 600} y={120 + Math.sin(i * 0.785) * 420} s={pop(t, 669.4 + i * 0.12) * 1.25} z={-4} />
          ))}
          <Character {...ELON_X(false)} x={interpolate(t, [667.3, 668.6], [-420, -700], { extrapolateRight: "clamp" })} y={-640} s={1.6} look={0.6} expression={{ eyes: "open", mouth: "frown", brows: 0.4 }} pose={poses.scared(frame)} z={3} />
        </Office>
      </Stage>
      <Label text="HE TRIES TO BACK OUT" x={0.1} y={0.1} size={0.05} kind="box" at={at(667.6)} />
      <Label text="“TOO MANY FAKE ACCOUNTS”" x={0.9} y={0.86} size={0.055} kind="box" at={at(670.4)} />
    </AbsoluteFill>
  );
};

// 671.67 "Twitter sues him, and in the end, he buys it anyway."
export const SuesShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const swing = -Math.max(0, Math.sin(Math.min(1, Math.max(0, (t - 671.7) / 0.35)) * Math.PI)) * 0.9;
  const arm: [number, number] = [1.15, 0.6];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.01), y: 40, shake: hitAt(t, 672.0, 0.3) * 8 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <CourtroomSet y={-420}>
          <Character {...JUDGE} x={120} y={520} s={1.1} look={0.5} expression={{ eyes: "open", mouth: "flat", brows: -0.4 }} pose={poses.idle(frame, 3)} z={-0.12} />
          {/* bench front drawn over the judge so only head and shoulders show */}
          <Part shape={roundRect(1400, 520, 12)} color="#6e4426" shade={0.2} y={520} z={0.25}>
            {[-450, 0, 450].map((bx) => (
              <Part key={bx} shape={roundRect(360, 380, 8)} color="#5e3a20" flat outline={4} x={bx} z={0.001} />
            ))}
          </Part>
          <Gavel x={-260} y={800} s={1.1} swing={swing} z={0.32} />
          <Character
            {...SUIT(1)}
            x={560}
            facing={-1}
            y={-200}
            s={1.45}
            look={0.6}
            expression={{ eyes: "open", mouth: "smirk", brows: -0.3 }}
            pose={{ ...poses.idle(frame, 2), armF: arm }}
            holdF={
              <X rot={upright(arm)}>
                <Part shape={roundRect(170, 230, 8)} color="#e8eef6" shade={0.15} y={-40} />
                <Bird s={0.32} y={-30} z={0.001} />
              </X>
            }
            z={0.3}
          />
          <Character {...ELON_X(false)} x={-560} y={-200} s={1.45} look={0.6} expression={{ eyes: "open", mouth: "frown", brows: 0.3 }} pose={poses.idle(frame, 5)} z={0.3} />
          {[-560, 560].map((tx) => (
            <Part key={tx} shape={roundRect(760, 210, 12)} color="#6e4426" shade={0.2} x={tx} y={-165} z={0.5} />
          ))}
        </CourtroomSet>
      </Stage>
      <Label text="TWITTER SUES" x={0.1} y={0.1} size={0.06} kind="box" at={at(671.9)} />
      <Label text="HE BUYS IT ANYWAY" x={0.85} y={0.86} size={0.065} kind="stamp" at={at(673.8)} />
    </AbsoluteFill>
  );
};

/** Lobby of the social network's headquarters (bird on the wall). */
const HQLobby: React.FC<{ bird?: boolean }> = ({ bird = true }) => (
  <>
    <Office era="2020" desk={false} wall="#e8eef4" />
    {bird ? <Bird x={460} y={420} s={1.4} z={-30} /> : null}
  </>
);

// 674.95 "In October 2022, he walks into Twitter's headquarters carrying a bathroom sink,"
export const SinkWalkShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  const arm: [number, number] = [1.05, 0.85];
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.95, 1.02), y: -60 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <HQLobby />
        <Character
          {...ELON_X(false)}
          x={interpolate(frame, [0, dur], [-900, -60])}
          y={-640}
          s={1.6}
          look={0.6}
          expression={{ eyes: "happy", mouth: "grin" }}
          pose={{ ...poses.walk(frame, 0.9), armF: arm, armB: [arm[0] - 0.1, arm[1] + 0.05] }}
          holdF={<X rot={upright(arm)}><X x={30} y={-120}><SinkProp /></X></X>}
          z={2}
        />
      </Stage>
      <Label text="OCTOBER 2022" x={0.1} y={0.1} size={0.06} kind="box" at={at(675.1)} />
      <Label text="TWITTER HEADQUARTERS" x={0.9} y={0.1} size={0.05} kind="box" at={at(677.2)} />
      <Label text="A BATHROOM SINK" x={0.5} y={0.86} size={0.06} kind="stamp" at={at(678.6)} />
    </AbsoluteFill>
  );
};
/** Sink sized for the hands. */
const SinkProp: React.FC = () => (
  <X s={0.7}>
    <Part shape={blob([[-150, 120], [150, 120], [140, 70], [90, 10], [-90, 10], [-140, 70]], 8)} color="#f4f6f8" shade={0.24} />
    <Part shape={ellipse(120, 18)} color="#d8dde4" flat outline={4} y={118} z={0.001} />
    <Part shape={roundRect(24, 50, 8)} color="#b9bec6" shade={0.2} y={140} z={0.002} />
  </X>
);

// 679.41 "and posts, 'Let that sink in.'"
export const SinkPostShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06) }} light={{ dir: [-0.6, 0.6] }} vignette={0.65}>
        <Part shape={roundRect(4000, 3000, 0)} color="#2a3242" flat outline={0} z={-41} />
        <PostCard w={1300} h={420} avatar="#1f1f25" s={pop(t, 679.5)} />
      </Stage>
      <Label text="“LET THAT SINK IN.”" x={0.5} y={0.52} size={0.07} pin kind="ink" at={sec(start)(680.32)} />
    </AbsoluteFill>
  );
};

// 681.71 "Within months, he cuts about 80 percent of the staff."
export const CutsShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const keep = new Set([2, 7]);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 0.8, 0.86), y: 0 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <HQLobby bird={false} />
        {Array.from({ length: 10 }, (_, i) => {
          const row = Math.floor(i / 5);
          const x = -960 + (i % 5) * 480 + row * 240;
          const y = row ? -380 : -660;
          const gone = !keep.has(i) && t > 683.3 + (i % 5) * 0.08;
          const k = gone ? Math.max(0, 1 - (t - 683.3 - (i % 5) * 0.08) * 4) : 1;
          return k > 0.01 ? (
            <X key={i} x={x} y={y} s={k} z={row ? 0.5 : 1}>
              <Character {...STAFF(i)} x={0} y={0} s={1.0} look={0.5} expression={{ eyes: gone ? "wide" : "open", mouth: gone ? "o" : "flat" }} pose={poses.idle(frame, i)} />
            </X>
          ) : null;
        })}
      </Stage>
      <Label text="ABOUT 80% OF THE STAFF" x={0.5} y={0.86} size={0.065} kind="stamp" at={at(683.6)} />
    </AbsoluteFill>
  );
};

// 685.22 "He tells the ones who stay to be 'extremely hardcore,' or leave."
export const HardcoreShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: 0 }} light={{ dir: [-0.6, 0.6] }} vignette={0.65}>
        <Part shape={roundRect(4000, 3000, 0)} color="#20242e" flat outline={0} z={-41} />
        <Monitor w={1300} h={720} screen="#f4f6f8" stand={false}>
          <Part shape={roundRect(1240, 60, 0)} color="#d8dde4" flat outline={0} y={300} />
          {[180, 120, 60].map((y) => (
            <Part key={y} shape={roundRect(900, 16, 8)} color="#a8b0b8" flat outline={0} x={-150} y={y} z={0.001} />
          ))}
        </Monitor>
      </Stage>
      <Label text="“EXTREMELY HARDCORE”" x={0.5} y={0.55} size={0.075} pin kind="ink" at={at(686.86)} />
      <Label text="…OR LEAVE" x={0.85} y={0.86} size={0.07} kind="stamp" at={at(688.3)} />
    </AbsoluteFill>
  );
};

// 689.31 "And in 2023, Twitter gets a new name. Can you guess it? X."
export const NewNameShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  const flyAway = ramp(t, 692.4, 693.3, Easing.in(Easing.quad));
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), shake: hitAt(t, 693.35, 0.4) * 10 }} light={{ dir: [-0.6, 0.6] }} vignette={0.7} vignetteColor="#05070e">
        <Part shape={roundRect(4000, 3000, 0)} color={t > 693.33 ? "#0e1220" : "#2a3a6a"} flat outline={0} z={-41} />
        {t < 693.4 ? <Bird x={flyAway * 1400} y={60 + flyAway * 700} s={2.2} flap={flyAway > 0 ? Math.sin(frame * 1.2) : 0} rot={flyAway * 0.3} /> : null}
        <XMark x={0} y={40} size={560 * pop(t, 693.33)} color="#f4f4f6" />
      </Stage>
      <Label text="2023: A NEW NAME" x={0.1} y={0.1} size={0.055} kind="box" at={at(689.6)} />
      <Label text="CAN YOU GUESS IT?" x={0.5} y={0.86} size={0.06} kind="box" at={at(692.3)} until={at(693.3)} />
    </AbsoluteFill>
  );
};

/** The 1999 X.com page on an old monitor. */
const OldXcomPage: React.FC<{ t: number }> = ({ t }) => (
  <X>
    <Part shape={roundRect(860, 520, 4)} color="#d8d8d0" flat outline={0} />
    <Part shape={roundRect(860, 40, 0)} color="#2a4a9a" flat outline={0} y={240} z={0.001} />
    <XMark size={200 * pop(t, 694.9)} color="#2a4a9a" y={60} z={0.002} />
  </X>
);

// 694.32 "Remember X.com, his bank from 1999? He had already bought that web address back."
export const XcomCallbackShot: React.FC<ShotProps> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = absT(start, frame);
  const at = sec(start);
  return (
    <AbsoluteFill>
      <Stage camera={{ zoom: push(frame, dur, 1.0, 1.06), y: -20 }} light={{ dir: [-0.6, 0.6] }} vignette={0.6}>
        <Office era="2000" desk={false}>
          <X x={300} y={-40} z={1}>
            <Monitor w={900} h={560} screen="#d8d8d0">
              <OldXcomPage t={t} />
            </Monitor>
          </X>
          <Character {...ELON_X(false)} x={-640} y={-640} s={1.7} look={0.6} expression={{ eyes: "happy", mouth: "smirk" }} pose={poses.point(frame)} z={3} />
        </Office>
      </Stage>
      <Label text="REMEMBER X.COM?" sub="HIS BANK FROM 1999" x={0.1} y={0.1} size={0.06} kind="box" at={at(694.8)} />
      <Label text="HE HAD BOUGHT THE ADDRESS BACK" x={0.9} y={0.86} size={0.05} kind="box" at={at(698.9)} />
    </AbsoluteFill>
  );
};

export const _unusedF = { Wash, Line, Book, Window, Desk, OfficeChair, Box, GoldCoin, Sea, Outdoors, Flash, PERSON, NOLAND, useScr, Glow };
