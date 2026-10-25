import React from "react";
import { C, INK, rand } from "./theme";
import { ellipseD, Ink, Pencil, Shade } from "./draw";

const ROOF = "#4b4f5c";

/** Oda family crest (mokko): five rounded lobes around a small flower. */
export const OdaCrest: React.FC<{ x: number; y: number; r: number; color?: string; ink?: string }> = ({ x, y, r, color = C.yellow, ink = INK }) => (
  <g>
    {[0, 1, 2, 3, 4].map((k) => {
      const a = (k / 5) * Math.PI * 2 - Math.PI / 2;
      return <Pencil key={k} d={ellipseD(x + Math.cos(a) * r * 0.52, y + Math.sin(a) * r * 0.52, r * 0.46, r * 0.46)} fill={color} sw={Math.max(2, r * 0.08)} />;
    })}
    <path d={ellipseD(x, y, r * 0.22)} fill={ink} />
  </g>
);

/** A temple hall (Honno-ji): big tiled roof, pillars, shoji panels.
 *  `inside` is drawn in the open middle bay; `burnt` darkens the wood. */
export const TempleHall: React.FC<{ x: number; y: number; s?: number; burnt?: number; open?: number; inside?: React.ReactNode; glow?: number }> = ({
  x,
  y,
  s = 1,
  burnt = 0,
  open = 0,
  inside,
  glow = 0,
}) => {
  const wood = C.tan;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {/* stone base and steps */}
      <Pencil d="M-330,0 h660 v-40 h-660 Z" fill={C.gray} />
      <Pencil d="M-70,0 h140 v-20 h-140 Z M-50,-20 h100 v-20 h-100 Z" fill={C.darkGray} sw={3} />
      {/* wall */}
      <Pencil d="M-290,-40 h580 v-230 h-580 Z" fill={wood} />
      {/* the open middle bay */}
      <Pencil d="M-90,-40 h180 v-200 h-180 Z" fill={glow > 0 ? "#f6dc9a" : "#5a4a3e"} sw={3} />
      {glow > 0 ? <path d={ellipseD(0, -140, 90, 90)} fill="#fbe7a8" opacity={0.6 * glow} filter="url(#soft)" /> : null}
      {inside}
      {/* sliding shoji in the side bays */}
      {[-1, 1].map((sd) => (
        <g key={sd}>
          <Pencil d={`M${sd > 0 ? 100 : -280},-40 h180 v-200 h-180 Z`} fill={C.white} sw={3} />
          {[0, 1, 2].map((k) => (
            <Ink key={k} d={`M${(sd > 0 ? 100 : -280) + 45 * (k + 1)},-40 v-200`} sw={2} opacity={0.6} />
          ))}
          {[0, 1, 2, 3].map((k) => (
            <Ink key={k} d={`M${sd > 0 ? 100 : -280},${-80 - k * 40} h180`} sw={2} opacity={0.6} />
          ))}
        </g>
      ))}
      {/* sliding doors over the middle bay */}
      {open < 1
        ? [-1, 1].map((sd) => (
            <g key={sd} transform={`translate(${sd * 90 * open},0)`}>
              <Pencil d={`M${sd > 0 ? 0 : -90},-40 h90 v-200 h-90 Z`} fill={C.white} sw={3} />
              {[1, 2].map((k) => (
                <Ink key={k} d={`M${(sd > 0 ? 0 : -90) + 30 * k},-40 v-200`} sw={2} opacity={0.6} />
              ))}
            </g>
          ))
        : null}
      {/* pillars */}
      {[-290, -100, 100, 290].map((px) => (
        <Pencil key={px} d={`M${px - 10},-40 h20 v-236 h-20 Z`} fill={C.darkBrown} sw={3} />
      ))}
      <Pencil d="M-300,-262 h600 v-22 h-600 Z" fill={C.darkBrown} sw={3.5} />
      {/* the great roof */}
      <Pencil d="M-420,-276 Q-300,-290 -250,-330 L250,-330 Q300,-290 420,-276 Q300,-262 0,-266 Q-300,-262 -420,-276 Z" fill={ROOF} />
      <Pencil d="M-260,-326 L-170,-420 L170,-420 L260,-326 Z" fill={ROOF} />
      <Pencil d="M-190,-414 h380 v-16 h-380 Z" fill="#3a3d48" sw={3.5} />
      {[-1, 1].map((sd) => (
        <Pencil key={sd} d={`M${sd * 186},-424 q${sd * 24},-10 ${sd * 30},-34 q${sd * 4},20 ${sd * -16},40 Z`} fill="#3a3d48" sw={3} />
      ))}
      {new Array(9).fill(0).map((_, i) => (
        <Ink key={i} d={`M${-220 + i * 55},-330 L${-150 + i * 37},-414`} sw={2} opacity={0.35} color={C.white} />
      ))}
      {burnt > 0 ? (
        <g>
          <Shade d="M-290,-40 h580 v-230 h-580 Z" fill="#2b2b35" opacity={burnt * 0.55} />
          <Shade d="M-420,-276 Q-300,-290 -250,-330 L-170,-420 L170,-420 L250,-330 Q300,-290 420,-276 Q300,-262 0,-266 Q-300,-262 -420,-276 Z" fill="#2b2b35" opacity={burnt * 0.5} />
        </g>
      ) : null}
    </g>
  );
};

/** A pair of shoji screens sliding shut over a w x h opening centred on x; p: 0 open, 1 shut. */
export const Shoji: React.FC<{ x: number; y: number; w: number; h: number; p: number }> = ({ x, y, w, h, p }) =>
  p <= 0 ? null : (
    <g>
      {[-1, 1].map((sd) => {
        const pw = w / 2;
        const x0 = sd < 0 ? x - w / 2 - pw + pw * p : x + w / 2 - pw * p;
        return (
          <g key={sd}>
            <Pencil d={`M${x0},${y - h} h${pw} v${h} h${-pw} Z`} fill={C.white} sw={4} />
            {[1, 2, 3].map((k) => (
              <Ink key={k} d={`M${x0 + (pw / 4) * k},${y - h} v${h}`} sw={2.5} opacity={0.6} />
            ))}
            {[1, 2, 3, 4, 5].map((k) => (
              <Ink key={k} d={`M${x0},${y - (h / 6) * k} h${pw}`} sw={2.5} opacity={0.6} />
            ))}
            <Pencil d={`M${x0},${y - h} h${pw} v${h} h${-pw} Z`} sw={6} ink={C.darkBrown} />
          </g>
        );
      })}
    </g>
  );

/** Street food stall with a noren curtain and dango skewers on the counter. */
export const FoodStall: React.FC<{ x: number; y: number; s?: number; taken?: number }> = ({ x, y, s = 1, taken = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <Pencil d="M-150,0 h300 v-120 h-300 Z" fill={C.brown} />
    <Pencil d="M-170,-120 h340 v-22 h-340 Z" fill={C.darkBrown} sw={3.5} />
    {[-140, 140].map((px) => (
      <Pencil key={px} d={`M${px - 6},-142 h12 v-160 h-12 Z`} fill={C.darkBrown} sw={3} />
    ))}
    <Pencil d="M-180,-300 L180,-300 L160,-340 L-160,-340 Z" fill={C.straw} />
    {[-120, -60, 0, 60].map((nx, i) => (
      <Pencil key={nx} d={`M${nx},-300 h56 v70 h-56 Z`} fill={i % 2 ? C.indigo : "#5a6fb0"} sw={3} />
    ))}
    {[0, 1, 2, 3].map((k) =>
      k < 4 - taken ? (
        <g key={k} transform={`translate(${-100 + k * 60},-140) rotate(-20)`}>
          <Ink d="M0,0 L0,-70" sw={3} color={C.darkBrown} />
          {[0, 1, 2].map((b) => (
            <Pencil key={b} d={ellipseD(0, -24 - b * 18, 10, 9)} fill={[C.pink, C.white, C.green][b]} sw={2.5} />
          ))}
        </g>
      ) : null,
    )}
  </g>
);

/** Bare footprints along a path of points, revealed up to p (0-1). */
export const Footprints: React.FC<{ pts: [number, number][]; p: number; s?: number }> = ({ pts, p, s = 1 }) => (
  <g>
    {pts.slice(0, Math.round(pts.length * Math.max(0, Math.min(1, p)))).map(([fx, fy], i) => (
      <g key={i} transform={`translate(${fx},${fy + (i % 2 ? 10 : -10)}) scale(${s})`} opacity={0.7}>
        <Shade d={ellipseD(0, 0, 18, 9)} fill={C.darkBrown} opacity={0.5} />
        {[0, 1, 2, 3].map((t) => (
          <Shade key={t} d={ellipseD(20 + t * 2, -8 + t * 5, 3.5, 3)} fill={C.darkBrown} opacity={0.5} />
        ))}
      </g>
    ))}
  </g>
);

/** A little foot soldier with a spear, in any colour. */
export const Troop: React.FC<{ x: number; y: number; s?: number; color: string; hat?: string; flip?: boolean }> = ({ x, y, s = 1, color, hat = color, flip }) => (
  <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
    <Ink d="M10,8 L22,-62" sw={2.5} color={C.darkBrown} />
    <Pencil d="M20,-70 l6,-10 l2,12 Z" fill={C.gray} sw={2} />
    <Pencil d="M-10,0 L10,0 L8,-26 L-8,-26 Z" fill={color} sw={2} />
    <Pencil d={ellipseD(0, -34, 9)} fill={C.skin} sw={2} />
    <Pencil d="M-12,-36 Q0,-52 12,-36 Z" fill={hat} sw={2} />
  </g>
);

/** Camp curtain (maku) with a big crest, hung between poles. */
export const Maku: React.FC<{ x0: number; x1: number; y: number; h: number; color?: string; crest?: string }> = ({ x0, x1, y, h, color = C.white, crest = INK }) => (
  <g>
    <Pencil d={`M${x0},${y - h} L${x1},${y - h} L${x1},${y} L${x0},${y} Z`} fill={color} />
    {[0.33, 0.66].map((k) => (
      <Ink key={k} d={`M${x0},${y - h * k} L${x1},${y - h * k}`} sw={2.5} opacity={0.5} />
    ))}
    {new Array(Math.max(1, Math.floor((x1 - x0) / 300))).fill(0).map((_, i, arr) => {
      const cx = x0 + ((i + 0.5) * (x1 - x0)) / arr.length;
      return <Pencil key={i} d={ellipseD(cx, y - h / 2, h * 0.24)} fill={crest} sw={3} />;
    })}
    {[x0, x1].map((px) => (
      <Pencil key={px} d={`M${px - 5},${y + 6} h10 v${-h - 40} h-10 Z`} fill={C.darkBrown} sw={3} />
    ))}
  </g>
);

/** A pencil browser window with a search box; `typed` letters of `text` shown. */
export const SearchBox: React.FC<{ x: number; y: number; w: number; text: string; typed: number; f: number; press?: number }> = ({
  x,
  y,
  w,
  text,
  typed,
  f,
  press = 0,
}) => {
  const n = Math.round(text.length * Math.max(0, Math.min(1, typed)));
  return (
    <g>
      <Pencil d={`M${x - w / 2},${y - 170} h${w} v380 h${-w} Z`} fill={C.white} sw={5} />
      <Pencil d={`M${x - w / 2},${y - 170} h${w} v54 h${-w} Z`} fill={C.lightIndigo} sw={5} />
      {[0, 1, 2].map((k) => (
        <Pencil key={k} d={ellipseD(x - w / 2 + 34 + k * 34, y - 143, 10)} fill={[C.red, C.yellow, C.green][k]} sw={2.5} />
      ))}
      <Pencil d={`M${x - w / 2 + 60},${y - 30} h${w - 220} v84 h${-(w - 220)} Z`} fill="#fffdf6" sw={4} />
      <text x={x - w / 2 + 84} y={y + 30} fontFamily="PatrickHand" fontSize={58} fill={INK}>
        {text.slice(0, n)}
        {n < text.length && Math.floor(f / 8) % 2 === 0 ? "|" : ""}
      </text>
      <g transform={`translate(${x + w / 2 - 100},${y + 12}) scale(${1 - 0.12 * press})`}>
        <Pencil d="M-56,-42 h112 v84 h-112 Z" fill={press > 0 ? C.indigo : C.lightIndigo} sw={4} />
        <Ink d="M-12,-12 m-18,0 a18,18 0 1,0 36,0 a18,18 0 1,0 -36,0 M2,2 L20,20" sw={5} color={C.white} />
      </g>
      {[0, 1, 2].map((k) => (
        <Shade key={k} d={`M${x - w / 2 + 60},${y + 100 + k * 34} h${(w - 200) * (0.9 - k * 0.2)} v14 h${-(w - 200) * (0.9 - k * 0.2)} Z`} fill={C.gray} opacity={0.35} />
      ))}
    </g>
  );
};

/** Yellow warning triangle. */
export const Warning: React.FC<{ x: number; y: number; s: number; f: number }> = ({ x, y, s, f }) =>
  s <= 0.01 ? null : (
    <g transform={`translate(${x},${y}) scale(${s}) rotate(${Math.sin(f / 3) * 3})`}>
      <Pencil d="M0,-150 L150,110 L-150,110 Z" fill={C.yellow} sw={7} />
      <Pencil d="M-12,-70 L12,-70 L8,40 L-8,40 Z" fill={INK} sw={2} />
      <path d={ellipseD(0, 74, 13)} fill={INK} />
    </g>
  );

/** Glowing embers drifting up (for the end of the fire). */
export const Embers: React.FC<{ f: number; x: number; y: number; w: number; n?: number; opacity?: number }> = ({ f, x, y, w, n = 14, opacity = 1 }) => (
  <g opacity={opacity}>
    {new Array(n).fill(0).map((_, i) => {
      const t = ((f * 0.6 + rand(i) * 200) % 200) / 200;
      const ex = x + (rand(i + 3) - 0.5) * w + Math.sin(t * 9 + i) * 20;
      const ey = y - t * 420;
      return <path key={i} d={ellipseD(ex, ey, 4, 4)} fill={i % 2 ? C.lava : C.yellow} opacity={1 - t} />;
    })}
  </g>
);
