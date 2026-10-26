import React from "react";
import { AbsoluteFill, Audio, Img, spring, staticFile, useCurrentFrame } from "remotion";
import { useJapanAssets } from "../japan/assets";
import { Bang, DrawOn, ellipseD, Heart, Ink, Label, Pencil, pop, Pt, Question, Shade, Sparkle, Defs } from "../japan/draw";
import { Person } from "../japan/Person";
import { Banner, Pagoda, Shrine, Throne } from "../japan/Props2";
import { Cradle, InkPainting, Onion, TeaSet } from "../japan/Props3";
import { Flames, Grave, SmokeColumn, Townhouse } from "../japan/Props4";
import { Embers } from "../japan/Props6";
import { C, FONT_HAND, INK, ip } from "../japan/theme";
import { MarkerText } from "../brand/MarkerText";
import timeline from "./onin.json";

/**
 * "The 10-year war nobody won": a 9:16 Short cut from the film's Onin War
 * story. The voice is the narrator's own takes (make_onin.py lays them out
 * and writes onin.json); every shot is redrawn as a close-up of the cast.
 */
export const W = 1080;
export const H = 1920;
const FPS = timeline.fps;
export const ONIN_DURATION = timeline.duration;

const YOSHIMASA = "#b39ad1";
const BROTHER = "#7fb1d8";
const WIFE = "#e8a3b5";
const RED_SKIN = "#e58a7a";
const DARK = "#15161d";

type Cam = { x: number; y: number; z: number };
type ShotProps = { f: number; lf: number; dur: number; cue: (word: string, k?: number) => number };

const norm = (w: string) => w.toLowerCase().replace(/[^a-z-]/g, "");

/* ------------------------------------------------------------------ helpers */

/** Ease between camera keyframes [local frame, cam]. */
const camAt = (lf: number, keys: [number, Cam][]): Cam => {
  if (lf <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [f0, a] = keys[i];
    const [f1, b] = keys[i + 1];
    if (lf <= f1) {
      const t = ip(lf, [f0, f1], [0, 1]);
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: a.z * Math.pow(b.z / a.z, t) };
    }
  }
  return keys[keys.length - 1][1];
};

/** A punchy little zoom on every cut. */
const punch = (lf: number) => 1 + 0.07 * (1 - ip(lf, [0, 7], [0, 1]));

/**
 * One shot: the world (in the cast's units, feet on y = 0) seen through a
 * camera, with the pencil grain and the line boil kept at the film's size
 * however close the camera gets.
 */
const World: React.FC<{ f: number; lf: number; cam: Cam; shake?: Pt; children: React.ReactNode }> = ({ f, lf, cam, shake = [0, 0], children }) => {
  const z = cam.z * punch(lf);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <Defs frame={f} texScale={1 / cam.z} />
      <g filter="url(#wobble)">
        <g transform={`translate(${W / 2 + shake[0]},${H / 2 + shake[1]}) scale(${z}) translate(${-cam.x},${-cam.y})`}>{children}</g>
      </g>
    </svg>
  );
};

const shakeAt = (lf: number, at: number, strength = 1): Pt => {
  const k = strength * Math.max(0, 1 - (lf - at) / 12);
  if (lf < at || k <= 0) return [0, 0];
  return [Math.sin(lf * 2.7) * 22 * k, Math.cos(lf * 3.3) * 16 * k];
};

/** Marker lettering in screen space, outlined, popping in at `at`. */
const Shout: React.FC<{
  lf: number;
  at: number;
  text: string;
  y: number;
  cap: number;
  fill?: string;
  x?: number;
  rot?: number;
  seed?: number;
  maxWidth?: number;
}> = ({ lf, at, text, y, cap, fill = "#fffaf0", x = W / 2, rot = 0, seed = 3, maxWidth = 900 }) => {
  if (lf < at) return null;
  const s = spring({ frame: lf - at, fps: FPS, config: { damping: 11, stiffness: 190, mass: 0.6 } });
  const cy = y + cap / 2;
  return (
    <g transform={`translate(${x},${cy}) rotate(${rot}) scale(${s}) translate(${-x},${-cy})`}>
      <MarkerText text={text} x={x + 5} y={y + 7} cap={cap} seed={seed} color={DARK} weight={36} maxWidth={maxWidth} />
      <MarkerText text={text} x={x} y={y} cap={cap} seed={seed} color={DARK} weight={36} maxWidth={maxWidth} />
      <MarkerText text={text} x={x} y={y} cap={cap} seed={seed} color={fill} maxWidth={maxWidth} />
    </g>
  );
};

const Overlay: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
    <g filter="url(#wobble)">{children}</g>
  </svg>
);

const Sky: React.FC<{ color: string; opacity?: number }> = ({ color, opacity = 1 }) => (
  <Shade d="M-1500,-2500 H1500 V1500 H-1500 Z" fill={color} opacity={opacity} />
);

const Room: React.FC = () => (
  <g>
    <Pencil d="M-1500,-2500 H1500 V0 H-1500 Z" fill={C.tan} fillOpacity={0.7} ink={false} />
    {[-250, 250].map((x) => (
      <Pencil key={x} d={`M${x - 16},-1200 h32 v1200 h-32 Z`} fill={C.darkBrown} />
    ))}
    <Pencil d="M-1500,0 H1500 V1500 H-1500 Z" fill={C.straw} />
  </g>
);

const Ground: React.FC<{ y?: number; color?: string }> = ({ y = 0, color = "#c9b99a" }) => <Pencil d={`M-1500,${y} H1500 V1500 H-1500 Z`} fill={color} />;

const Scroll: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <Pencil d="M-40,-12 h80 v24 h-80 Z" fill="#f4e7c4" sw={3} />
    <Pencil d={ellipseD(-41, 0, 5, 13)} fill={C.darkBrown} sw={2.5} />
    <Pencil d={ellipseD(41, 0, 5, 13)} fill={C.darkBrown} sw={2.5} />
  </g>
);

/** Tears running down from the eyes of a figure whose feet are at (x, y), scale s. */
const Tears: React.FC<{ x: number; y: number; s: number; lf: number }> = ({ x, y, s, lf }) => (
  <g>
    {[-17, 17].map((ex, i) => {
      const ox = x + ex * s;
      const oy = y + (-178 + 10) * s;
      return (
        <g key={ex}>
          <Ink d={`M${ox},${oy} q${-3 * s},${18 * s} ${-1 * s},${34 * s}`} sw={5} color="#7fc4ef" />
          {[0, 1].map((k) => {
            const t = ((lf + k * 11 + i * 6) % 22) / 22;
            return <Pencil key={k} d={ellipseD(ox - s, oy + (34 + t * 40) * s, 4 * s, 6 * s)} fill="#a9d9f7" sw={2} />;
          })}
        </g>
      );
    })}
  </g>
);

/* ------------------------------------------------------------------ shots */

/** "It lasted ten whole years... and nobody won." over burning Kyoto. */
const Hook: React.FC<ShotProps> = ({ f, lf, cue }) => {
  const ten = cue("ten");
  const nobody = cue("nobody");
  const cam = camAt(lf, [
    [0, { x: 0, y: -24, z: 2.05 }],
    [nobody, { x: 0, y: -24, z: 2.2 }],
    [nobody + 30, { x: 0, y: -10, z: 2.4 }],
  ]);
  return (
    <>
      <World f={f} lf={lf} cam={cam} shake={shakeAt(lf, nobody, 1.2)}>
        <Sky color="#e9874a" opacity={0.6} />
        <Shade d="M-1500,-2500 H1500 V-600 H-1500 Z" fill="#b3452e" opacity={0.35} />
        <Townhouse x={-185} y={-40} s={1.0} seed={2} />
        <Pagoda x={140} y={-40} s={1.25} />
        <SmokeColumn x={-185} y={-300} f={f} seed={1} />
        <SmokeColumn x={140} y={-560} f={f} seed={2} />
        <Flames x={-185} y={-120} s={1.15} f={f} seed={1} />
        <Flames x={140} y={-280} s={1.0} f={f} seed={2} />
        <Ground y={-40} />
        <Embers f={f} x={-260} y={-60} w={520} n={18} />
        <Person x={-20} y={430} s={2.3} tribe="samurai" expr="shock" f={f} blinkOff look={[0.5, -0.9]} aL={10} aR={10} />
      </World>
      <Overlay>
        <Shout lf={lf} at={ten - 3} text="10 YEARS OF WAR" y={150} cap={118} seed={4} />
        <Shout lf={lf} at={nobody - 2} text="...AND NOBODY WON" y={290} cap={112} fill="#ff5a3c" rot={-4} seed={8} />
      </Overlay>
    </>
  );
};

/** "Then came a shogun named Yoshimasa." */
const Yoshimasa: React.FC<ShotProps> = ({ f, lf, dur, cue }) => {
  const name = cue("yoshimasa");
  const cam = camAt(lf, [
    [0, { x: 0, y: -158, z: 5.2 }],
    [dur, { x: 0, y: -160, z: 5.6 }],
  ]);
  return (
    <>
      <World f={f} lf={lf} cam={cam}>
        <Room />
        <InkPainting x={-98} y={-215} s={0.32} />
        <TeaSet x={95} y={0} s={0.55} f={f} />
        <Person x={0} y={0} tribe="noble" cloth={YOSHIMASA} f={f} expr="happy" hold="teabowl" aR={70} blinkOff seed={4} />
        {[0, 1, 2].map((i) => (
          <Heart key={i} x={50 + i * 20} y={-240 - i * 12} s={0.32 * pop(lf, 10 + i * 5)} />
        ))}
      </World>
      <Overlay>
        <Shout lf={lf} at={name - 4} text="SHOGUN YOSHIMASA" y={150} cap={100} fill="#c6a8f0" seed={5} />
      </Overlay>
    </>
  );
};

/** "He had no son, so he promised the title of shogun to his younger brother." */
const Promised: React.FC<ShotProps> = ({ f, lf, cue }) => {
  const son = cue("son");
  const promised = cue("promised");
  const brother = cue("brother");
  const cam = camAt(lf, [
    [0, { x: -75, y: -158, z: 5.0 }],
    [promised - 2, { x: -75, y: -158, z: 5.3 }],
    [promised + 12, { x: 32, y: -165, z: 3.8 }],
    [brother + 30, { x: 32, y: -165, z: 4.0 }],
  ]);
  const pass = ip(lf, [promised + 6, brother + 2], [0, 1]);
  const hasScroll = pass >= 1;
  return (
    <>
      <World f={f} lf={lf} cam={cam}>
        <Room />
        {/* a thought bubble: the empty cradle */}
        <g opacity={lf < promised + 6 ? 1 : 0}>
          <g transform={`translate(-128,-268) scale(${pop(lf, son - 4)}) translate(128,268)`}>
            <Pencil d={ellipseD(-128, -268, 40, 30)} fill={C.white} sw={3} />
            <Pencil d={ellipseD(-92, -226, 7, 6)} fill={C.white} sw={2.5} />
            <Pencil d={ellipseD(-80, -210, 4.5, 4)} fill={C.white} sw={2} />
            <Cradle x={-130} y={-252} s={0.3} />
          </g>
          <Question x={-170} y={-300} s={0.45 * pop(lf, son + 2)} size={90} />
        </g>
        <Person x={-60} y={0} tribe="noble" cloth={YOSHIMASA} f={f} expr={lf < promised ? "nervous" : "smile"} look={lf < promised ? [-1, 0.3] : [1, 0]} aR={lf > promised - 4 && !hasScroll ? 80 : 15} blinkOff seed={4} />
        <Person x={125} y={0} s={pop(lf, promised + 4)} tribe="noble" cloth={BROTHER} f={f} flip expr="grin" aR={hasScroll ? 80 : 20} blinkOff seed={7} />
        {pass > 0 && !hasScroll ? <Scroll x={10 + pass * 70} y={-150 - Math.sin(pass * Math.PI) * 70} /> : null}
        {hasScroll ? <Scroll x={80} y={-150} /> : null}
      </World>
      <Overlay>
        {lf < promised ? <Shout lf={lf} at={son - 3} text="NO SON?" y={150} cap={120} seed={6} /> : null}
        <Shout lf={lf} at={promised + 2} text="NEXT SHOGUN: YOU!" y={150} cap={100} fill="#9fd2f7" seed={7} />
      </Overlay>
    </>
  );
};

/** "Then, soon after, his wife gave birth to a baby boy." */
const Baby: React.FC<ShotProps> = ({ f, lf, dur, cue }) => {
  const baby = cue("baby");
  const boy = cue("boy");
  const reveal = Math.min(boy + 14, dur - 26);
  const cam = camAt(lf, [
    [0, { x: 25, y: -150, z: 5.0 }],
    [reveal, { x: 25, y: -150, z: 5.3 }],
    [reveal + 12, { x: -62, y: -165, z: 3.8 }],
  ]);
  return (
    <>
      <World f={f} lf={lf} cam={cam}>
        <Room />
        <Person x={-150} y={0} tribe="noble" cloth={BROTHER} f={f} expr={lf > reveal ? "shock" : "grin"} aR={80} blinkOff seed={7} />
        <Scroll x={-85} y={-150} />
        <Person x={25} y={0} tribe="noble" long cloth={WIFE} f={f} flip expr="happy" hold={lf > baby - 6 ? "baby" : "none"} aR={lf > baby - 6 ? 60 : 15} blinkOff seed={9} />
        {[0, 1, 2].map((i) => (
          <Heart key={i} x={-20 + i * 36} y={-262 - (i % 2) * 14} s={0.5 * pop(lf, baby + i * 4) * (1 + 0.08 * Math.sin(lf / 3 + i))} />
        ))}
        <Sparkle x={95} y={-215} s={0.7 * pop(lf, boy)} />
      </World>
      <Overlay>
        {lf < reveal ? <Shout lf={lf} at={boy - 2} text="A BABY BOY!" y={150} cap={120} fill="#f7b6cf" seed={9} /> : null}
        <Shout lf={lf} at={reveal + 6} text="UH-OH..." y={150} cap={120} seed={10} />
      </Overlay>
    </>
  );
};

/** "Now two people wanted the same seat, the shogun's brother and the shogun's son." */
const Seat: React.FC<ShotProps> = ({ f, lf, dur, cue }) => {
  const two = cue("two");
  const seat = cue("seat");
  const son = cue("son");
  const tug = lf > seat ? Math.sin(lf / 3) * 10 : 0;
  const cam = camAt(lf, [
    [0, { x: 0, y: -170, z: 3.4 }],
    [dur, { x: 0, y: -168, z: 3.8 }],
  ]);
  return (
    <>
      <World f={f} lf={lf} cam={cam} shake={shakeAt(lf, son + 6, 0.8)}>
        <Room />
        <Throne x={0} y={0} s={0.5 * pop(lf, 2)} />
        <Person x={-112 + tug} y={0} tribe="noble" cloth={BROTHER} f={f} expr="angry" aR={lf > seat ? 80 : 20} lean={lf > seat ? 10 : 0} blinkOff seed={7} />
        <Person x={112 - tug} y={0} tribe="noble" long cloth={WIFE} f={f} flip expr="angry" hold="baby" aR={60} lean={lf > seat ? 10 : 0} blinkOff seed={9} />
        <DrawOn d="M-70,-150 Q-45,-190 -20,-140" p={ip(lf, [seat, seat + 8], [0, 1])} sw={5} dotted color={C.red} />
        <DrawOn d="M70,-150 Q45,-190 20,-140" p={ip(lf, [seat + 3, seat + 11], [0, 1])} sw={5} dotted color={C.red} />
        <Bang x={0} y={-215} s={0.9 * pop(lf, son + 4)} n={3} />
      </World>
      <Overlay>
        <Shout lf={lf} at={two - 2} text="2 PEOPLE" y={150} cap={120} fill="#ff5a3c" seed={11} />
        <Shout lf={lf} at={seat - 2} text="1 SEAT" y={305} cap={120} seed={12} />
      </Overlay>
    </>
  );
};

/** "This started the Onin War. That's Onin, not onion." */
const Onin: React.FC<ShotProps> = ({ f, lf, cue }) => {
  const onin = cue("onin");
  const thats = cue("thats");
  const onion = cue("onion");
  const glow = ip(lf, [0, onin + 12], [0.35, 1]);
  const cross = ip(lf, [onion + 3, onion + 12], [0, 1]);
  const cam = camAt(lf, [
    [0, { x: 0, y: -260, z: 2.0 }],
    [thats, { x: 0, y: -250, z: 2.1 }],
    [thats + 12, { x: 0, y: -190, z: 2.35 }],
  ]);
  return (
    <>
      <World f={f} lf={lf} cam={cam} shake={shakeAt(lf, onin, 1)}>
        <Sky color={C.sky} opacity={0.25 * (1 - glow)} />
        <Sky color="#e9874a" opacity={0.5 * glow} />
        {[-240, -80, 80, 240].map((x, i) => (
          <Townhouse key={x} x={x} y={0} s={0.9} seed={i + 1} />
        ))}
        {[-160, 0, 160].map((x, i) => <SmokeColumn key={x} x={x} y={-200} f={f} seed={i + 3} opacity={glow} />)}
        <Flames x={-240} y={-60} s={0.8 * pop(lf, 2, 160, 12)} f={f} seed={4} />
        <Flames x={240} y={-60} s={0.8 * pop(lf, 8, 160, 12)} f={f} seed={5} />
        <Flames x={80} y={-60} s={0.7 * pop(lf, onin, 160, 12)} f={f} seed={6} />
        <Ground y={0} />
        <g transform={`translate(0,${-120}) scale(${1.55 * pop(lf, thats - 4)}) translate(0,0)`}>
          <Onion x={0} y={0} f={f} />
          <DrawOn d="M-110,-210 L110,30" p={cross} sw={22} color="#e0352b" />
          <DrawOn d="M110,-210 L-110,30" p={ip(lf, [onion + 7, onion + 15], [0, 1])} sw={22} color="#e0352b" />
        </g>
      </World>
      <Overlay>
        <Shout lf={lf} at={onin - 3} text="THE ONIN WAR" y={150} cap={140} fill="#ff5a3c" seed={13} />
        <Shout lf={lf} at={thats + 2} text="(SAY: OH-NEEN)" y={330} cap={70} seed={14} />
      </Overlay>
    </>
  );
};

/** "The war was fought right in the streets of Kyoto." */
const Streets: React.FC<ShotProps> = ({ f, lf, dur, cue }) => {
  const streets = cue("streets");
  const charge = ip(lf, [0, dur - 8], [0, 1]);
  const cam = camAt(lf, [
    [0, { x: 0, y: -185, z: 2.9 }],
    [dur, { x: 0, y: -190, z: 3.7 }],
  ]);
  return (
    <>
      <World f={f} lf={lf} cam={cam} shake={shakeAt(lf, dur - 14, 0.7)}>
        <Sky color={C.sky} opacity={0.25} />
        {[-270, -90, 90, 270].map((x, i) => (
          <Townhouse key={x} x={x} y={-30} s={0.85} seed={i + 2} />
        ))}
        <Ground y={-30} />
        <Banner x={-230 + charge * 40} y={-10} color={C.red} s={0.6} wave={Math.sin(lf / 4) * 6} crest={false} />
        <Banner x={175 - charge * 40} y={-10} color={C.indigo} s={0.6} wave={Math.sin(lf / 4 + 1) * 6} crest={false} />
        <Person x={-150 + charge * 55} y={0} s={1.1} tribe="samurai" cloth={C.red} f={f} walk={lf * 0.7} hold="katana" aR={150} expr="angry" blinkOff seed={1} />
        <Person x={150 - charge * 55} y={0} s={1.1} tribe="samurai" f={f} flip walk={lf * 0.7 + 1} hold="katana" aR={150} expr="angry" blinkOff seed={5} />
        <Bang x={0} y={-250} s={pop(lf, dur - 14)} n={3} />
      </World>
      <Overlay>
        <Shout lf={lf} at={streets - 4} text="IN THE STREETS" y={150} cap={110} seed={15} />
        <Shout lf={lf} at={streets + 4} text="OF KYOTO" y={290} cap={110} fill="#9fb0dd" seed={16} />
      </Overlay>
    </>
  );
};

/** "One side was led by a scary warlord called the Red Monk. The other side was led by his own son-in-law." */
const Leaders: React.FC<ShotProps> = ({ f, lf, dur, cue }) => {
  const scary = cue("scary");
  const red = cue("red");
  const other = cue("other") - 4;
  const son = cue("son-in-law");
  const monk = lf < other;
  const cam = monk
    ? camAt(lf, [
        [0, { x: 0, y: -158, z: 5.2 }],
        [other, { x: 0, y: -160, z: 5.6 }],
      ])
    : camAt(lf, [
        [other, { x: 0, y: -158, z: 5.2 }],
        [dur, { x: 0, y: -160, z: 5.5 }],
      ]);
  const sub = monk ? lf : lf - other;
  return (
    <>
      <World f={f} lf={sub} cam={cam} shake={monk ? shakeAt(lf, red, 0.8) : [0, 0]}>
        {monk ? (
          <g>
            <Sky color={C.red} opacity={0.32} />
            <Ground y={0} color={C.straw} />
            <Banner x={-100} y={-40} color={C.red} s={0.8} wave={Math.sin(lf / 5) * 6} crest={false} />
            <Person x={0} y={0} tribe="monk" cloth={C.red} skin={RED_SKIN} f={f} expr="angry" hold="naginata" aR={30} blinkOff seed={2} />
          </g>
        ) : (
          <g>
            <Sky color={C.indigo} opacity={0.26} />
            <Ground y={0} color={C.straw} />
            <Banner x={55} y={-40} color={C.indigo} s={0.8} wave={Math.sin(lf / 5 + 1) * 6} crest={false} />
            <Person x={0} y={0} tribe="daimyo" cloth={C.indigo} f={f} flip expr={lf > son + 8 ? "nervous" : "angry"} look={lf > son + 8 ? [-1, 0] : [0, 0]} blinkOff seed={6} />
          </g>
        )}
      </World>
      <Overlay>
        {monk ? (
          <>
            <Shout lf={lf} at={red - 3} text="THE RED MONK" y={150} cap={130} fill="#ff5a3c" seed={17} />
            <Shout lf={lf} at={scary} text="(SCARY WARLORD)" y={305} cap={64} seed={18} />
          </>
        ) : (
          <>
            <Shout lf={lf} at={son - 6} text="HIS SON-IN-LAW!" y={150} cap={110} fill="#9fb0dd" seed={19} />
            <Shout lf={lf} at={son + 14} text="AWKWARD..." y={295} cap={70} seed={20} />
          </>
        )}
      </Overlay>
    </>
  );
};

/** "They set fire to each other's houses, temples and palaces." */
const Fire: React.FC<ShotProps> = ({ f, lf, dur, cue }) => {
  const fire = cue("fire");
  const houses = cue("houses");
  const temples = cue("temples");
  const palaces = cue("palaces");
  const glow = ip(lf, [fire, palaces + 16], [0, 1]);
  const cam = camAt(lf, [
    [0, { x: 0, y: -270, z: 2.0 }],
    [dur, { x: 0, y: -260, z: 2.2 }],
  ]);
  const torch = (at: number, x0: number, x1: number, y1: number) => {
    const t = ip(lf, [at - 12, at], [0, 1], (x) => x);
    if (t <= 0 || t >= 1) return null;
    return (
      <g transform={`translate(${x0 + (x1 - x0) * t},${-60 - Math.sin(t * Math.PI) * 260 + (y1 + 60) * t}) rotate(${t * 540})`}>
        <Pencil d="M-5,0 L5,0 L5,60 L-5,60 Z" fill={C.brown} sw={2.5} />
        <Pencil d="M0,4 C-14,-10 -8,-30 0,-40 C8,-30 14,-10 0,4 Z" fill={C.lava} sw={2.5} />
      </g>
    );
  };
  return (
    <World f={f} lf={lf} cam={cam}>
      <Sky color={C.sky} opacity={0.2 * (1 - glow)} />
      <Sky color="#e9874a" opacity={0.55 * glow} />
      <Townhouse x={-190} y={-20} s={0.95} seed={1} />
      <Pagoda x={10} y={-10} s={1.3} />
      <Shrine x={200} y={-20} s={0.8} />
      {torch(houses, -320, -190, -150)}
      {torch(temples, 330, 10, -330)}
      {torch(palaces, -320, 200, -160)}
      <SmokeColumn x={-190} y={-330} f={f} seed={1} opacity={ip(lf, [houses, houses + 16], [0, 1])} />
      <SmokeColumn x={10} y={-560} f={f} seed={2} opacity={ip(lf, [temples, temples + 16], [0, 1])} />
      <SmokeColumn x={200} y={-330} f={f} seed={3} opacity={ip(lf, [palaces, palaces + 16], [0, 1])} />
      <Flames x={-190} y={-90} s={1.1 * pop(lf, houses, 160, 12)} f={f} seed={1} />
      <Flames x={10} y={-300} s={1.0 * pop(lf, temples, 160, 12)} f={f} seed={2} />
      <Flames x={200} y={-110} s={1.1 * pop(lf, palaces, 160, 12)} f={f} seed={3} />
      <Ground y={-20} />
      <Embers f={f} x={-270} y={-40} w={540} n={16} opacity={glow} />
    </World>
  );
};

/** "Slowly, the beautiful old city of Kyoto was destroyed." */
const Destroyed: React.FC<ShotProps> = ({ f, lf, dur, cue }) => {
  const destroyed = cue("destroyed");
  const decay = ip(lf, [8, destroyed + 6], [0, 1], (x) => x);
  const cam = camAt(lf, [
    [0, { x: 0, y: -70, z: 2.25 }],
    [dur, { x: 0, y: -60, z: 2.5 }],
  ]);
  return (
    <>
      <World f={f} lf={lf} cam={cam}>
        <Sky color={C.sky} opacity={0.25 * (1 - decay)} />
        <Sky color="#7a7480" opacity={0.5 * decay} />
        {[-260, -90, 90, 260].map((x, i) => (
          <Townhouse key={x} x={x} y={-70} s={0.85} seed={i + 3} burnt={ip(decay, [i * 0.12, i * 0.12 + 0.4], [0, 1])} />
        ))}
        <g opacity={1 - ip(decay, [0.4, 0.95], [0, 1])}>
          <Pagoda x={150} y={-70} s={0.75} />
        </g>
        {[-200, 0, 200].map((x, i) => (
          <SmokeColumn key={x} x={x} y={-330} f={f} seed={i + 4} opacity={ip(decay, [0.15, 0.5], [0, 1]) * 0.9} />
        ))}
        <Ground y={-70} color={decay > 0.6 ? "#8f8478" : "#c9b99a"} />
        <Person x={-10} y={380} s={2.2} tribe="merchant" f={f} expr="worry" look={[0.4, -0.6]} blinkOff seed={3} />
        <Tears x={-10} y={380} s={2.2} lf={lf} />
      </World>
      <Overlay>
        <Shout lf={lf} at={destroyed - 3} text="...DESTROYED" y={150} cap={130} fill="#c9c3cf" seed={21} />
      </Overlay>
    </>
  );
};

/** "It lasted ten whole years." (He has grown a beard.) */
const TenYears: React.FC<ShotProps> = ({ f, lf, dur, cue }) => {
  const ten = cue("ten");
  const cam = camAt(lf, [
    [0, { x: 0, y: -158, z: 5.0 }],
    [dur, { x: 0, y: -160, z: 5.4 }],
  ]);
  return (
    <>
      <World f={f} lf={lf} cam={cam} shake={shakeAt(lf, ten, 0.6)}>
        <Sky color="#f2cf8a" opacity={0.35} />
        <Ground y={0} color={C.straw} />
        <Person x={0} y={0} tribe="samurai" f={f} expr="tired" beard blinkOff aR={8} aL={8} seed={3} />
        {/* cobwebs on the helmet */}
        <Ink d="M38,-246 L64,-262 M38,-246 L58,-226 M38,-246 L70,-244 M48,-256 Q56,-244 50,-232 M56,-260 Q66,-246 60,-230" sw={1.6} color="#ffffff" opacity={0.8} />
      </World>
      <Overlay>
        <g transform={`translate(${W / 2},${250}) scale(${spring({ frame: Math.max(0, lf - ten + 2), fps: FPS, config: { damping: 9, stiffness: 220, mass: 0.6 } }) * (lf >= ten - 2 ? 1 : 0)}) rotate(-4) translate(${-W / 2},${-250})`}>
          <Pencil d="M110,150 h860 v200 h-860 Z" fill={C.yellow} sw={7} />
          <MarkerText text="10 WHOLE YEARS!" x={W / 2} y={195} cap={110} seed={22} color="#d3302a" maxWidth={800} />
        </g>
      </Overlay>
    </>
  );
};

/** "And in the end, both leaders were dead, and nobody won." */
const Nobody: React.FC<ShotProps> = ({ f, lf, dur, cue }) => {
  const both = cue("both");
  const nobody = cue("nobody");
  const cam = camAt(lf, [
    [0, { x: 0, y: -130, z: 3.0 }],
    [dur, { x: 0, y: -135, z: 3.3 }],
  ]);
  return (
    <>
      <World f={f} lf={lf} cam={cam}>
        <Sky color="#7a7480" opacity={0.4} />
        {[-240, -60, 120, 300].map((x, i) => (
          <Townhouse key={x} x={x} y={-60} s={0.7} seed={i} burnt={1} />
        ))}
        <Ground y={-60} color="#8f8478" />
        <Grave x={-95} y={0} s={0.85 * pop(lf, 2)} hat="monk" />
        <Grave x={95} y={0} s={0.85 * pop(lf, 7)} hat="lord" />
        <Label x={-92} y={-262} text="Red Monk" size={24} font={FONT_HAND} p={ip(lf, [both, both + 10], [0, 1], (x) => x)} />
        <Label x={92} y={-300} text="son-in-law" size={24} font={FONT_HAND} p={ip(lf, [both + 6, both + 16], [0, 1], (x) => x)} />
        <g transform={`translate(0,-60) scale(${0.6 * pop(lf, nobody - 4)}) translate(-960,-660)`}>
          <Pencil d="M880,500 Q880,640 960,660 Q1040,640 1040,500 Z" fill={C.yellow} />
          <Pencil d="M880,520 Q830,520 840,570 Q850,600 890,600 M1040,520 Q1090,520 1080,570 Q1070,600 1030,600" sw={6} />
          <Pencil d="M940,660 h40 v40 h-40 Z M900,700 h120 v30 h-120 Z" fill={C.bronze} sw={4} />
        </g>
        <Question x={0} y={-215} s={0.75 * pop(lf, nobody + 4)} size={100} />
      </World>
      <Overlay>
        <Shout lf={lf} at={nobody - 2} text="NOBODY WON" y={150} cap={140} fill="#c9c3cf" seed={23} />
      </Overlay>
    </>
  );
};

/** The end card: what came next was even worse... watch the full video, link below. */
const Cta: React.FC<{ f: number; lf: number }> = ({ f, lf }) => {
  const bounce = Math.abs(Math.sin(lf / 5)) * 18;
  const card = spring({ frame: Math.max(0, lf - 12), fps: FPS, config: { damping: 12, stiffness: 160, mass: 0.7 } }) * (lf >= 12 ? 1 : 0);
  const arrow = ip(lf, [26, 40], [0, 1]);
  return (
    <>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <Defs frame={f} />
        <g filter="url(#wobble)">
          <Shade d={`M0,0 H${W} V${H} H0 Z`} fill="#f2c896" opacity={0.6} />
          {new Array(18).fill(0).map((_, i) => {
            const a = (i / 18) * Math.PI * 2 + lf * 0.006;
            return <Ink key={i} d={`M${540 + Math.cos(a) * 380},${830 + Math.sin(a) * 380} L${540 + Math.cos(a) * 1600},${830 + Math.sin(a) * 1600}`} sw={6} color="#e9a35c" opacity={0.35} />;
          })}
        </g>
      </svg>
      {card > 0.01 ? (
        <div
          style={{
            position: "absolute",
            left: 90,
            top: 620,
            width: 900,
            height: 506,
            transform: `rotate(-2deg) scale(${card})`,
            border: "10px solid #fffaf0",
            outline: `5px solid ${INK}`,
            boxShadow: "12px 14px 0 rgba(31,42,85,0.35)",
            overflow: "hidden",
          }}
        >
          <Img src={staticFile("shorts/full_video_thumb.jpg")} style={{ width: "100%", height: "100%" }} />
        </div>
      ) : null}
      <Overlay>
        <Shout lf={lf} at={0} text="BUT WHAT CAME NEXT" y={200} cap={96} seed={24} />
        <Shout lf={lf} at={6} text="WAS EVEN WORSE..." y={340} cap={110} fill="#ff5a3c" seed={25} />
        <Shout lf={lf} at={20} text="WATCH THE FULL VIDEO" y={1180} cap={82} seed={26} />
        <Shout lf={lf} at={28} text="LINK BELOW" y={1295} cap={84} fill={C.yellow} seed={27} />
        {arrow > 0 ? (
          <g transform={`translate(0,${bounce})`}>
            <DrawOn d="M600,1410 C600,1480 500,1525 345,1548" p={arrow} sw={30} color={DARK} />
            <DrawOn d="M600,1410 C600,1480 500,1525 345,1548" p={arrow} sw={16} color={C.yellow} />
            {arrow >= 1 ? <Pencil d="M300,1552 L370,1508 L374,1592 Z" fill={C.yellow} sw={7} ink={DARK} /> : null}
          </g>
        ) : null}
      </Overlay>
    </>
  );
};

/* ------------------------------------------------------------------ captions */

type Word = { w: string; s: number; e: number; shot: string };
const KEY = new Set(["yoshimasa", "shogun", "son", "brother", "baby", "boy", "seat", "onin", "onion", "kyoto", "red", "monk", "son-in-law", "fire", "destroyed", "ten", "years", "nobody", "dead", "war"]);

/** Short-video captions: two or three words at a time, big marker capitals. */
const chunks = (() => {
  const out: { text: string; s: number; e: number; key: boolean }[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (!cur.length) return;
    out.push({ text: cur.map((x) => x.w.replace(/[.,]$/, "")).join(" "), s: cur[0].s - 0.05, e: cur[cur.length - 1].e, key: cur.some((x) => KEY.has(norm(x.w))) });
    cur = [];
  };
  for (const word of timeline.words as Word[]) {
    if (word.shot === "hook") continue;
    if (cur.length && (cur.length >= 3 || cur.map((x) => x.w).join(" ").length + word.w.length > 15 || /[.,?!]$/.test(cur[cur.length - 1].w) || cur[0].shot !== word.shot)) flush();
    cur.push(word);
  }
  flush();
  return out.map((c, i) => ({ ...c, e: Math.min(i + 1 < out.length ? out[i + 1].s : Infinity, c.e + 0.35) }));
})();

const Captions: React.FC<{ t: number }> = ({ t }) => {
  const c = chunks.find((x) => t >= x.s && t < x.e);
  if (!c) return null;
  const lf = Math.round((t - c.s) * FPS);
  const s = 0.85 + 0.15 * spring({ frame: lf, fps: FPS, config: { damping: 12, stiffness: 260, mass: 0.5 } });
  const x = 520;
  const y = 1300;
  const cap = 84;
  return (
    <Overlay>
      <g transform={`translate(${x},${y + cap / 2}) scale(${s}) translate(${-x},${-(y + cap / 2)})`}>
        <MarkerText text={c.text} x={x + 5} y={y + 7} cap={cap} seed={31} color={DARK} weight={38} maxWidth={860} jitter={0.6} />
        <MarkerText text={c.text} x={x} y={y} cap={cap} seed={31} color={DARK} weight={38} maxWidth={860} jitter={0.6} />
        <MarkerText text={c.text} x={x} y={y} cap={cap} seed={31} color={c.key ? "#ffd23f" : "#ffffff"} maxWidth={860} jitter={0.6} />
      </g>
    </Overlay>
  );
};

/* ------------------------------------------------------------------ the Short */

const SHOTS: Record<string, React.FC<ShotProps>> = {
  hook: Hook,
  yoshimasa: Yoshimasa,
  promise: Promised,
  baby: Baby,
  seat: Seat,
  onin: Onin,
  streets: Streets,
  leaders: Leaders,
  fire: Fire,
  destroyed: Destroyed,
  tenyears: TenYears,
  nobody: Nobody,
};

export const OninShort: React.FC = () => {
  useJapanAssets();
  const f = useCurrentFrame();
  const t = f / FPS;
  const shot = timeline.shots.find((s) => t >= s.start && t < s.end) ?? timeline.shots[timeline.shots.length - 1];
  const start = Math.round(shot.start * FPS);
  const lf = f - start;
  const dur = Math.round(shot.end * FPS) - start;
  const cue = (word: string, k = 0) => {
    const hits = (timeline.words as Word[]).filter((x) => x.shot === shot.id && norm(x.w) === word);
    if (!hits[k]) throw new Error(`no "${word}" #${k} in shot ${shot.id}`);
    return Math.round(hits[k].s * FPS) - start;
  };
  const Shot = SHOTS[shot.id];
  return (
    <AbsoluteFill style={{ backgroundColor: "#f3ede0" }}>
      <Img src={staticFile("japan/paper.jpg")} style={{ width: W, height: H, objectFit: "cover" }} />
      {Shot ? <Shot f={f} lf={lf} dur={dur} cue={cue} /> : <Cta f={f} lf={lf} />}
      <Captions t={t} />
      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile("japan/grain.jpg")})`,
          backgroundSize: "768px 768px",
          mixBlendMode: "multiply",
          opacity: 0.45,
        }}
      />
      <Audio src={staticFile("shorts/onin_mix.m4a")} />
    </AbsoluteFill>
  );
};
