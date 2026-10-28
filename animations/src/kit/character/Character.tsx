import React from "react";
import { useCurrentFrame } from "remotion";
import { Part, Line } from "../Part";
import { X } from "../context";
import { GroundShadow } from "../effects";
import { blob, circle, limb, roundPoly, roundRect } from "../shapes";
import { GLOVE, SKIN, palette, shadeHex } from "../style";
import { Face, type Expression } from "./Face";
import { Hat, HatBack, HairBack, HairFront, type HatKind, type HairKind } from "./Headwear";

// Proportions authored for head radius 100. Origin = ground point between the feet.
// Total height ≈ 410 units (~2 head heights), like the reference characters.

const HIP_Y = 78;
const TORSO_BOTTOM = 52;
const TORSO_TOP = 226;
const NECK_Y = 222;
const HEAD_Y = 86; // head center above the neck point
const SHOULDER: [number, number] = [50, 206];
const UPPER = 60;
const FORE = 56;

export type Outfit = {
  top: string;
  bottom?: string;
  boots?: string;
  sleeves?: string;
  belt?: string | null;
  buckle?: string | null;
  buttons?: string | null;
  pockets?: boolean;
  collar?: "v" | "round" | "high" | "wrap" | null;
  collarColor?: string;
  /** Long tunic/robe that covers the legs. */
  robe?: boolean;
  /** Knee-length tunic: torso bottom edge (default 52; ~28 = knee). */
  hem?: number;
  /** Diagonal strap (bandolier / satchel). */
  strap?: string | null;
  /** Sleeve chevrons / cuffs color. */
  cuffs?: string | null;
  /** Medals/ribbons on chest. */
  medals?: boolean;
  /** Patch color for worn/ragged clothes. */
  patches?: string | null;
  /** Decorative band at hems and cuffs (Persian robes). */
  trim?: string | null;
  /** Wide diagonal cloth over one shoulder (Greek himation). */
  sash?: string | null;
  /** Rope belt (thin) instead of a leather belt. */
  rope?: string | null;
  /** Bronze breastplate overlay. */
  armor?: string | null;
  /** Quilted gambeson stitching color. */
  quilt?: string | null;
};

export type Pose = {
  /** Front arm (facing side): [shoulder, elbow] in radians, CCW. 0 = hanging. */
  armF?: [number, number];
  /** Back arm: [shoulder, elbow]. */
  armB?: [number, number];
  legF?: number;
  legB?: number;
  /** Body lean around the hips (radians, + = lean back for facing right). */
  lean?: number;
  headTilt?: number;
  /** Vertical body offset (bounce). */
  bob?: number;
  /** Draw arms above the head layer (e.g. hands on head / salute). */
  armsOverHead?: boolean;
  /** Draw the back arm behind the torso. */
  backArmBehind?: boolean;
  sit?: boolean;
};

export type CharacterProps = {
  x?: number;
  y?: number;
  z?: number;
  /** Scale. 1 = head radius 100 px. */
  s?: number;
  facing?: 1 | -1;
  /** 0..1 how much the face turns to the facing direction. */
  look?: number;
  outfit: Outfit;
  expression?: Expression;
  pose?: Pose;
  hat?: HatKind;
  hatColor?: string;
  hatAccent?: string;
  camo?: boolean;
  hair?: HairKind;
  hairColor?: string;
  mustache?: "walrus" | "thin" | "handlebar" | null;
  mustacheColor?: string;
  beard?: "goatee" | "full" | "stubble" | "royal" | null;
  beardColor?: string;
  freckles?: boolean;
  /** Mouth flaps while true. */
  talking?: boolean;
  /** Per-character offset for blinks / talk so crowds don't sync. */
  seed?: number;
  shadow?: boolean;
  /** Hand-held prop rendered in the front hand (local hand space). */
  holdF?: React.ReactNode;
  holdB?: React.ReactNode;
  children?: React.ReactNode;
};

const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Blink closure 0..1 for this frame (deterministic). */
export const blinkAt = (frame: number, seed = 0) => {
  const period = 84 + Math.floor(hash(seed) * 50);
  const t = (frame + Math.floor(hash(seed + 1) * period)) % period;
  const curve = [0, 0.55, 1, 1, 0.55, 0.15];
  return t < curve.length ? curve[t] : 0;
};

/** Mouth openness 0..1 while talking: syllable-like flaps. */
export const talkAt = (frame: number, seed = 0) => {
  const syll = Math.floor((frame + seed * 7) / 3);
  const v = hash(syll + seed * 13);
  return v < 0.18 ? 0 : 0.35 + v * 0.65;
};

const Hand: React.FC<{ color: string; children?: React.ReactNode }> = ({ color, children }) => (
  <X y={-6}>
    <Part shape={blob([[2, -2], [14, -8], [18, -20], [8, -24], [0, -14]], 6)} color={color} z={-0.001} />
    <Part shape={blob([[-15, 0], [13, 0], [17, -16], [15, -32], [4, -40], [-8, -39], [-17, -30], [-18, -14]], 6)} color={color} shade={0.2} />
    <Line pts={[[-12, -4], [12, -4]]} width={3.5} color={shadeHex(color, 0.35)} z={0.001} />
    {children ? <X y={-24} z={0.002}>{children}</X> : null}
  </X>
);

const Arm: React.FC<{ angles: [number, number]; side: 1 | -1; sleeve: string; cuffs?: string | null; hold?: React.ReactNode }> = ({
  angles,
  side,
  sleeve,
  cuffs,
  hold,
}) => (
  <X x={SHOULDER[0] * side} y={SHOULDER[1]} rot={angles[0]}>
    <Part shape={limb(UPPER, 36, 32)} color={sleeve} shade={0.24} />
    <Line pts={[[-9, -UPPER + 22], [2, -UPPER + 16], [9, -UPPER + 19]]} smooth width={3.5} color={shadeHex(sleeve, 0.4)} z={0.001} />
    <X y={-UPPER} rot={angles[1]} z={0.01}>
      <Part shape={limb(FORE, 33, 30)} color={sleeve} shade={0.24} />
      <Line pts={[[-8, -14], [3, -19], [8, -16]]} smooth width={3.5} color={shadeHex(sleeve, 0.4)} z={0.001} />
      {cuffs ? <Part shape={roundRect(34, 10, 4)} color={cuffs} flat y={-FORE + 10} z={0.001} /> : null}
      <X y={-FORE + 2} z={0.02}>
        <Hand color={GLOVE}>{hold}</Hand>
      </X>
    </X>
  </X>
);

const Leg: React.FC<{ angle: number; side: 1 | -1; pants: string; boots: string; showLeg: boolean }> = ({
  angle,
  side,
  pants,
  boots,
  showLeg,
}) => (
  <X x={side * 24} y={HIP_Y} rot={angle}>
    {showLeg ? <Part shape={limb(70, 40, 36)} color={pants} shade={0.24} /> : null}
    <X y={-68} z={0.01}>
      <Part shape={blob([[-19, 6], [17, 6], [20, -6], [36, -10], [42, -18], [36, -24], [-18, -24], [-22, -10]], 6)} color={boots} shade={0.26} />
    </X>
  </X>
);

const Torso: React.FC<{ outfit: Outfit; breathe: number }> = ({ outfit, breathe }) => {
  const top = outfit.top;
  const bottomY = outfit.hem ?? (outfit.robe ? 10 : TORSO_BOTTOM);
  const halfBottom = outfit.robe ? 78 : bottomY < TORSO_BOTTOM ? 72 : 66;
  return (
    <X sy={breathe}>
      <Part
        shape={roundPoly(
          [
            [-halfBottom, bottomY],
            [halfBottom, bottomY],
            [58, TORSO_TOP],
            [-58, TORSO_TOP],
          ],
          [16, 16, 34, 34],
        )}
        color={top}
        shade={0.2}
      />
      {outfit.collar === "v" ? (
        <Line pts={[[-30, TORSO_TOP - 4], [0, TORSO_TOP - 36], [30, TORSO_TOP - 4]]} width={5} z={0.001} />
      ) : null}
      {outfit.collar === "wrap" ? (
        <>
          <Part
            shape={roundPoly([[-30, TORSO_TOP - 2], [-16, TORSO_TOP - 2], [30, TORSO_TOP - 90], [18, TORSO_TOP - 98]], 4)}
            color={outfit.collarColor ?? shadeHex(top, 0.2)}
            flat
            z={0.001}
          />
        </>
      ) : null}
      {outfit.collar === "high" ? (
        <Part shape={roundRect(86, 20, 8)} color={outfit.collarColor ?? shadeHex(top, 0.1)} y={TORSO_TOP - 6} z={0.001} />
      ) : null}
      {outfit.collar === "round" ? (
        <Line pts={[[-28, TORSO_TOP - 2], [0, TORSO_TOP - 16], [28, TORSO_TOP - 2]]} smooth width={5} z={0.001} />
      ) : null}
      {outfit.pockets
        ? [-1, 1].map((s) => (
            <X key={s} x={s * 30} y={168} z={0.002}>
              <Part shape={roundRect(34, 28, 5)} color={top} flat outline={4.5} />
              <Line pts={[[-17, 6], [17, 6]]} width={4} />
            </X>
          ))
        : null}
      {outfit.buttons
        ? [196, 160, 124, 90].map((y) => (
            <Part key={y} shape={circle(5.5)} color={outfit.buttons!} flat outline={3.5} y={y} x={2} z={0.003} />
          ))
        : null}
      {outfit.medals
        ? [-46, -32, -18].map((x, i) => (
            <X key={x} x={x} y={176} z={0.004}>
              <Part shape={roundRect(12, 10, 2)} color={[palette.red, "#2f4f9a", palette.gold][i]} flat outline={3} />
              <Part shape={circle(6)} color={palette.gold} flat outline={3} y={-14} />
            </X>
          ))
        : null}
      {outfit.strap ? (
        <Part
          shape={roundPoly([[-52, 214], [-38, 222], [62, 84], [48, 76]], 4)}
          color={outfit.strap}
          flat
          z={0.005}
        />
      ) : null}
      {outfit.quilt
        ? [
            ...[-30, 0, 30].map((x) => [[x, TORSO_TOP - 12], [x * 1.12, (outfit.hem ?? TORSO_BOTTOM) + 8]] as [number, number][]),
            ...[90, 130, 170].map((y) => [[-60, y], [60, y]] as [number, number][]),
          ].map((pts, i) => <Line key={`q${i}`} pts={pts} width={3.5} color={outfit.quilt!} z={0.0015} />)
        : null}
      {outfit.armor ? (
        <Part
          shape={roundPoly([[-60, 96], [60, 96], [52, TORSO_TOP - 6], [-52, TORSO_TOP - 6]], [10, 10, 26, 26])}
          color={outfit.armor}
          shade={0.24}
          z={0.0035}
        >
          <Line pts={[[-30, 190], [0, 176], [30, 190]]} smooth width={4} color={shadeHex(outfit.armor, 0.4)} z={0.001} />
          <Line pts={[[-24, 140], [0, 132], [24, 140]]} smooth width={4} color={shadeHex(outfit.armor, 0.4)} z={0.001} />
        </Part>
      ) : null}
      {outfit.sash ? (
        <Part
          shape={roundPoly([[-58, 222], [-20, 226], [70, 70], [40, 56]], 10)}
          color={outfit.sash}
          shade={0.2}
          z={0.0055}
        />
      ) : null}
      {outfit.patches
        ? [
            [-34, 120, 0.2],
            [30, 172, -0.15],
            [22, 70, 0.1],
          ].map(([x, y, r], i) => (
            <X key={i} x={x} y={y} rot={r} z={0.004}>
              <Part shape={roundRect(26, 22, 3)} color={outfit.patches!} flat outline={3.5} />
              <Line pts={[[-9, 7], [-5, 3]]} width={2.5} />
              <Line pts={[[5, -3], [9, -7]]} width={2.5} />
            </X>
          ))
        : null}
      {outfit.trim ? (
        <Part
          shape={roundRect(outfit.robe ? 150 : (outfit.hem ?? TORSO_BOTTOM) < TORSO_BOTTOM ? 140 : 128, 16, 6)}
          color={outfit.trim}
          flat
          y={(outfit.hem ?? (outfit.robe ? 10 : TORSO_BOTTOM)) + 10}
          z={0.0045}
        />
      ) : null}
      {outfit.rope ? (
        <X y={outfit.robe ? 104 : 74} z={0.006}>
          <Part shape={roundRect(outfit.robe ? 142 : 130, 10, 5)} color={outfit.rope} flat outline={3.5} />
          <Line pts={[[18, -4], [24, -30], [20, -44]]} smooth width={5} color={outfit.rope} />
        </X>
      ) : null}
      {outfit.belt ? (
        <X y={outfit.robe ? 104 : 74} z={0.006}>
          <Part shape={roundRect(outfit.robe ? 142 : 136, 20, 6)} color={outfit.belt} flat />
          {outfit.buckle ? <Part shape={roundRect(22, 22, 4)} color={outfit.buckle} flat outline={4} x={4} /> : null}
        </X>
      ) : null}
    </X>
  );
};

/**
 * The reference character: big round white head with a crescent shadow,
 * small body, sleeve arms with white mitten gloves, short legs with boots.
 */
export const Character: React.FC<CharacterProps> = ({
  x = 0,
  y = 0,
  z = 0,
  s = 1,
  facing = 1,
  look = 0.45,
  outfit,
  expression = {},
  pose = {},
  hat = null,
  hatColor,
  hatAccent,
  camo = false,
  hair = null,
  hairColor = palette.hairBrown,
  mustache = null,
  mustacheColor,
  beard = null,
  beardColor,
  freckles = false,
  talking = false,
  seed = 0,
  shadow = true,
  holdF,
  holdB,
  children,
}) => {
  const frame = useCurrentFrame();
  const {
    armF = [0.14, 0.1],
    armB = [-0.14, -0.1],
    legF = 0,
    legB = 0,
    lean = 0,
    headTilt = 0,
    bob = 0,
    armsOverHead = false,
    backArmBehind = false,
    sit = false,
  } = pose;
  const breathe = 1 + Math.sin(frame * 0.09 + seed) * 0.012;
  const headBob = Math.sin(frame * 0.09 + seed) * 1.6;
  const blink = blinkAt(frame, seed);
  const talk = talking ? talkAt(frame, seed) : 0;
  const pants = outfit.bottom ?? shadeHex(outfit.top, 0.15);
  const boots = outfit.boots ?? palette.boot;
  const sleeve = outfit.sleeves ?? outfit.top;
  const armZ = armsOverHead ? 0.5 : 0.25;

  const legs = sit
    ? { f: 1.45 + legF, b: 1.35 + legB }
    : { f: legF, b: legB };
  const bodyY = (sit ? -46 : 0) + bob;

  return (
    <X x={x} y={y} z={z} s={s} sx={facing}>
      {shadow ? <GroundShadow w={sit ? 230 : 190} y={2} z={-0.05} /> : null}
      <X y={bodyY}>
        <X z={0.02}>
          <Leg angle={legs.b} side={-1} pants={pants} boots={boots} showLeg={!outfit.robe || sit} />
        </X>
        <X z={0.03}>
          <Leg angle={legs.f} side={1} pants={pants} boots={boots} showLeg={!outfit.robe || sit} />
        </X>
        <X y={HIP_Y} rot={lean}>
          <X y={-HIP_Y}>
            {backArmBehind ? (
              <X z={0.05}>
                <Arm angles={armB} side={-1} sleeve={shadeHex(sleeve, 0.12)} cuffs={outfit.cuffs} hold={holdB} />
              </X>
            ) : null}
            <X z={0.1}>
              <Torso outfit={outfit} breathe={breathe} />
            </X>
            {!backArmBehind ? (
              <X z={armZ}>
                <Arm angles={armB} side={-1} sleeve={sleeve} cuffs={outfit.cuffs} hold={holdB} />
              </X>
            ) : null}
            <X z={armZ + 0.02}>
              <Arm angles={armF} side={1} sleeve={sleeve} cuffs={outfit.cuffs} hold={holdF} />
            </X>
            <X y={NECK_Y + headBob * 0.5} rot={headTilt} z={0.3}>
              <X y={HEAD_Y}>
                <X z={-0.02}>
                  <HairBack kind={hair} color={hairColor} />
                </X>
                <X z={-0.03}>
                  <HatBack kind={hat} color={hatColor} />
                </X>
                {/* ear on the far side (opposite the look direction) */}
                <X x={look > 0.15 ? -96 : -98} y={-4} z={-0.01}>
                  <Part shape={circle(22)} color={SKIN} shade={0.25} />
                  <Line pts={[[4, 10], [-6, 6], [-8, -4], [2, -10]]} smooth width={4} z={0.001} />
                </X>
                {look < 0.15 ? (
                  <X x={98} y={-4} z={-0.01}>
                    <Part shape={circle(22)} color={SKIN} shade={0.25} />
                    <Line pts={[[-4, 10], [6, 6], [8, -4], [-2, -10]]} smooth width={4} z={0.001} />
                  </X>
                ) : null}
                <Part shape={circle(100)} color={SKIN} shade={0.24} />
                <X z={0.01}>
                  <Face
                    expression={expression}
                    look={look}
                    blink={blink}
                    talk={talk}
                    freckles={freckles}
                    mustache={mustache}
                    mustacheColor={mustacheColor}
                    beard={beard}
                    beardColor={beardColor}
                  />
                </X>
                <X z={0.1}>
                  <HairFront kind={hair} color={hairColor} />
                </X>
                <X z={0.12}>
                  <Hat kind={hat} color={hatColor} accent={hatAccent} camo={camo} />
                </X>
              </X>
            </X>
            {children}
          </X>
        </X>
      </X>
    </X>
  );
};
