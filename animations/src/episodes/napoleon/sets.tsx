import React from "react";
import { useCurrentFrame } from "remotion";
import { X, Part, Line, Glow, Gradient, roundRect, roundPoly, circle, ellipse, blob, poly } from "../../kit";
import {
  Sky, Mountains, Hill, Sea, Ground, Bush, Tree, PalmTree, Sun, Moon, Stars, Cloud, Rain, Smoke, Flame,
  PerspectiveRoom, roomQuad, roomPt, type RoomGeo, type RoomColors, Pyramid, NationFlag, type FlagKind,
  ParisHouse, ChurchFacade, Palace, HillFort, OnionChurch, KremlinWall, IslandRock, LogHut, DeadTree, StoneHouse, ShipOfLine,
  Snowfall, FogBank, EuropeMap, Painting, Calendar, Clock, Desk, Candle, Window,
} from "../../kit/env";
import { shadeHex, mixHex } from "../../kit/style";
import { rng } from "../../kit/random";

// Sets for the Napoleon story. Every outdoor set takes `floor` (ground line,
// default −420) and draws its backdrop at z ≤ −30; put characters at z −20…0.

type SetProps = { floor?: number; children?: React.ReactNode };

const pts = (a: [number, number][]) => a;

// ───────────────────────── outdoor ─────────────────────────

/** Mountain road near Grenoble, March 1815: snowy Alps, meadow with snow patches, a road into the distance. */
export const AlpsRoad: React.FC<SetProps & { road?: boolean; dusk?: boolean }> = ({ floor = -420, road = true, dusk = false, children }) => {
  const frame = useCurrentFrame();
  const hz = floor + 460;
  return (
    <>
      <Sky w={7000} h={4000} y={hz + 600} top={dusk ? "#6a6a9a" : "#86aed8"} bottom={dusk ? "#f2b08a" : "#f3e2c8"} z={-60} />
      <Cloud w={700} x={-900 + frame * 0.3} y={hz + 900} seed={2} z={-58} />
      <Cloud w={520} x={700 + frame * 0.25} y={hz + 1050} seed={5} z={-58} />
      <Mountains w={7000} y={hz - 40} peaks={pts([[-2900, 380], [-2200, 600], [-1500, 430], [-900, 640], [-200, 470], [500, 680], [1200, 450], [1900, 610], [2700, 400]])} color="#8fa2c4" snow="#f4f6fb" z={-56} />
      <Mountains w={7000} y={hz - 80} peaks={pts([[-2600, 200], [-1700, 300], [-800, 220], [0, 320], [900, 210], [1800, 290], [2600, 190]])} color="#6f8a7a" z={-54} />
      <Hill w={7000} h={260} y={hz - 120} color="#7f9a5a" seed={3} z={-52} />
      <Part shape={roundRect(9000, 3000, 0)} color="#93ad62" flat outline={0} y={hz - 1600} z={-50} />
      {[[-1700, hz - 260, 260], [1500, hz - 300, 300], [-600, hz - 520, 200], [900, hz - 640, 240]].map(([x, y, w], i) => (
        <Part key={i} shape={blob([[-w, 0], [-w * 0.5, 40], [w * 0.4, 46], [w, 0], [w * 0.3, -30], [-w * 0.4, -26]], 8)} color="#f2f5fa" shade={0.12} x={x} y={y} z={-49} />
      ))}
      {road ? (
        <>
          <Part shape={poly([[-60, hz - 110], [60, hz - 110], [1200, floor - 900], [-1200, floor - 900]])} color="#cdb88e" flat outline={6} z={-48} />
          <Line pts={[[-30, hz - 110], [-700, floor - 900]]} width={4} color="#b39a6e" z={-47.9} />
          <Line pts={[[30, hz - 110], [700, floor - 900]]} width={4} color="#b39a6e" z={-47.9} />
        </>
      ) : null}
      {[-2200, -1500, 1500, 2300].map((x, i) => (
        <Tree key={i} kind="green" x={x} y={hz - 150 - (i % 2) * 120} h={420 + (i % 2) * 120} seed={i + 3} z={-47 + i * 0.01} />
      ))}
      {[-1100, 1100].map((x, i) => (
        <Bush key={`b${i}`} w={300} x={x} y={floor + 40} seed={i} color="#6f8a4a" z={-46} />
      ))}
      {children}
    </>
  );
};

/** Europe map backdrop (fixed geometry: animate the camera, not the map). */
export const MapBack: React.FC<React.ComponentProps<typeof EuropeMap>> = (p) => <EuropeMap ppd={40} center={[12, 47]} w={5200} h={3400} z={-30} {...p} />;

/** Corsica: rocky hills with maquis, sea, a stone village. */
export const CorsicaSet: React.FC<SetProps & { village?: boolean; night?: boolean }> = ({ floor = -420, village = true, night = false, children }) => {
  const hz = floor + 420;
  return (
    <>
      <Sky w={7000} h={4000} y={hz + 600} top={night ? "#1a2244" : "#5fa2d8"} bottom={night ? "#3a4a7a" : "#e8f2f6"} z={-60} />
      {night ? <Stars w={6000} h={2000} y={hz + 900} z={-59} /> : <Sun x={1300} y={hz + 900} r={110} z={-59} />}
      {night ? <Moon x={-1100} y={hz + 1000} r={80} z={-58.5} /> : null}
      <Sea w={7000} h={500} y={hz - 60} color={night ? "#2a4a7a" : "#3f8fc0"} z={-57} />
      <Mountains w={7000} y={hz - 30} peaks={pts([[-2800, 200], [-2000, 420], [-1300, 300], [-600, 480], [100, 340], [800, 500], [1500, 320], [2400, 400]])} color={night ? "#3a4a5a" : "#8a8a7a"} z={-55} />
      <Hill w={7000} h={340} y={hz - 140} color={night ? "#2f4a3a" : "#6f8a4a"} seed={7} z={-53} />
      <Part shape={roundRect(9000, 3000, 0)} color={night ? "#3a5a3a" : "#8a9a5a"} flat outline={0} y={hz - 1650} z={-50} />
      {Array.from({ length: 7 }, (_, i) => (
        <Bush key={i} w={220 + (i % 3) * 60} x={-2100 + i * 700} y={floor + 60 + (i % 2) * 80} seed={i} color={night ? "#2f4a2a" : "#5f7a3a"} z={-46 + i * 0.01} />
      ))}
      {[[-1500, hz - 160, 1.2], [1700, hz - 120, 1.0]].map(([x, y, s], i) => (
        <Part key={`r${i}`} shape={blob([[-260, 0], [-200, 160], [-40, 230], [120, 180], [260, 0]], 8)} color={night ? "#5a5a62" : "#a8a49a"} shade={0.25} x={x} y={y} s={s} z={-48} />
      ))}
      {village
        ? [-900, -420, 40, 520].map((x, i) => (
            <StoneHouse key={`h${i}`} x={x} y={hz - 230 + (i % 2) * 40} s={0.8} lit={night} wall={["#d9c7a4", "#cdb894", "#e2d2b0", "#d4c09a"][i]} z={-47 - i * 0.01} />
          ))
        : null}
      {children}
    </>
  );
};

/** Paris street: townhouses, cobbles, lamp posts; optional church front at the end. */
export const ParisStreet: React.FC<SetProps & { church?: boolean; night?: boolean; palace?: boolean; smoke?: number }> = ({ floor = -420, church = false, night = false, palace = false, smoke = 0, children }) => {
  const hz = floor + 260;
  const walls = ["#efe2c4", "#e8d8b8", "#f2e8d0", "#e2d2b0", "#ecdcbc", "#e6d4b2"];
  return (
    <>
      <Sky w={7000} h={4000} y={hz + 900} top={night ? "#1a2244" : "#9cc0e0"} bottom={night ? "#4a4a7a" : "#f0ecdf"} z={-60} />
      {palace ? <Palace x={0} y={hz} s={0.9} z={-56} lit={night} /> : null}
      {!palace
        ? Array.from({ length: 9 }, (_, i) => (
            <ParisHouse key={i} x={-2400 + i * 600} y={hz} s={1.0} floors={3 + (i % 2)} wall={walls[i % walls.length]} shop={i % 3 === 1 ? ["#6a3a3a", "#3a5a4a", "#4f6f8a"][i % 3] : null} lit={night} z={-55 + (i % 2) * 0.01} />
          ))
        : null}
      {church ? <ChurchFacade x={0} y={hz} s={1.05} z={-54} /> : null}
      <Part shape={roundRect(9000, 2000, 0)} color={night ? "#5a5a62" : "#a8a49c"} flat outline={0} y={hz - 1000} z={-50} />
      {Array.from({ length: 30 }, (_, i) => {
        const r = rng(i + 3);
        return <Part key={`c${i}`} shape={ellipse(40 + r() * 20, 14)} color={night ? "#6a6a72" : "#bcb8b0"} flat outline={3} x={-2600 + r() * 5200} y={hz - 80 - r() * 900} z={-49.9} />;
      })}
      {[-1500, -500, 500, 1500].map((x, i) => (
        <X key={`lp${i}`} x={x} y={hz - 40} z={-49}>
          <Part shape={roundRect(16, 420, 6)} color="#2a2a30" flat outline={4} y={210} />
          <Part shape={roundPoly([[-34, 400], [34, 400], [44, 470], [-44, 470]], 6)} color={night ? "#ffd98a" : "#f4ecd0"} flat outline={4} />
          {night ? <Glow rx={160} color="#ffd98a" alpha={0.5} additive y={440} /> : null}
        </X>
      ))}
      {smoke > 0 ? <Smoke x={0} y={hz + 200} w={2400} h={1200} alpha={0.5 * smoke} color="#9a96a0" seed={3} z={-20} /> : null}
      {children}
    </>
  );
};

/** Toulon, 1793: harbour with the British fleet, red-roofed town, hills with a fort. */
export const HarborSet: React.FC<SetProps & { ships?: number; fort?: boolean; fire?: number; leaving?: number }> = ({ floor = -420, ships = 3, fort = true, fire = 0, leaving = 0, children }) => {
  const hz = floor + 300;
  return (
    <>
      <Sky w={8000} h={4000} y={hz + 600} top="#6aa8d8" bottom="#f2ead8" z={-60} />
      <Mountains w={8000} y={hz + 120} peaks={pts([[-3000, 240], [-2000, 400], [-1000, 300], [0, 430], [1100, 300], [2200, 390], [3200, 250]])} color="#9a9a8a" z={-58} />
      {fort ? <HillFort x={-1800} y={hz + 100} s={0.9} flag="uk" fire={fire} z={-56} /> : null}
      <Sea w={8000} h={600} y={hz + 60} color="#3f8fc0" z={-55} />
      {Array.from({ length: ships }, (_, i) => (
        <ShipOfLine key={i} navy="uk" x={-300 + i * 900 + leaving * (900 + i * 300)} y={hz + 20 - (i % 2) * 40} s={0.45 - (i % 2) * 0.05} seed={i * 3} sail={0.3 + leaving * 0.7} z={-54 + i * 0.01} />
      ))}
      <Part shape={roundRect(9000, 2600, 0)} color="#c9b894" flat outline={0} y={hz - 1340} z={-50} />
      {Array.from({ length: 6 }, (_, i) => (
        <StoneHouse key={`t${i}`} x={-2400 + i * 520} y={hz - 140 + (i % 2) * 20} s={0.7} wall={["#efe2c4", "#e8d4b0", "#f2e2c8"][i % 3]} roof="#c4653f" z={-49 + i * 0.01} />
      ))}
      {children}
    </>
  );
};

/** Egyptian desert: dunes, pyramids, palms, hot sun. */
export const DesertSet: React.FC<SetProps & { pyramids?: boolean; nile?: boolean; sun?: boolean }> = ({ floor = -420, pyramids = true, nile = false, sun = true, children }) => {
  const hz = floor + 380;
  return (
    <>
      <Sky w={8000} h={4000} y={hz + 600} top="#e0a860" bottom="#f8e2b0" z={-60} />
      {sun ? <Sun x={1200} y={hz + 700} r={150} color="#fff0b0" z={-59} /> : null}
      {pyramids ? (
        <>
          <Pyramid x={-900} y={hz - 20} w={1300} h={800} z={-56} />
          <Pyramid x={300} y={hz - 20} w={900} h={560} z={-56.1} />
          <Pyramid x={1100} y={hz - 20} w={560} h={340} z={-56.2} />
        </>
      ) : null}
      {nile ? <Part shape={roundRect(9000, 90, 0)} color="#3f8fc0" flat outline={4} y={hz - 40} z={-55} /> : null}
      <Hill w={8000} h={200} y={hz - 80} color="#e6c27a" seed={4} z={-54} />
      <Part shape={roundRect(9000, 2600, 0)} color="#e9cc8a" flat outline={0} y={hz - 1380} z={-50} />
      {[-2100, 1900, 2500].map((x, i) => (
        <PalmTree key={i} x={x} y={hz - 140} h={560 + i * 60} seed={i} z={-48 + i * 0.01} />
      ))}
      {children}
    </>
  );
};

/** High Alps in snow: peaks, steep path, falling snow. */
export const AlpsSnow: React.FC<SetProps & { snow?: number }> = ({ floor = -420, snow = 0.6, children }) => {
  const hz = floor + 500;
  return (
    <>
      <Sky w={8000} h={4000} y={hz + 600} top="#7a98c0" bottom="#e8eef6" z={-60} />
      <Mountains w={8000} y={hz - 200} peaks={pts([[-3000, 560], [-2000, 900], [-1000, 640], [0, 1000], [1100, 700], [2200, 920], [3200, 560]])} color="#a8b8d0" snow="#ffffff" z={-56} />
      <Mountains w={8000} y={hz - 260} peaks={pts([[-2600, 300], [-1500, 460], [-500, 340], [600, 500], [1700, 360], [2700, 440]])} color="#dfe6f0" outline={4} z={-54} />
      <Part shape={roundRect(9000, 3000, 0)} color="#f2f5fa" flat outline={0} y={hz - 1760} z={-50} />
      <Part shape={poly([[-2600, floor - 300], [2600, floor + 260], [2600, floor + 120], [-2600, floor - 460]])} color="#d8dee8" flat outline={5} z={-49} />
      {[-1800, 1600].map((x, i) => (
        <Part key={i} shape={blob([[-260, 0], [-180, 260], [40, 360], [240, 0]], 8)} color="#6a6a78" shade={0.25} x={x} y={floor + 40} z={-48} />
      ))}
      {snow > 0 ? <Snowfall w={5000} h={3000} y={hz} n={160} alpha={snow} z={-5} /> : null}
      {children}
    </>
  );
};

/** Rolling battlefield (Austerlitz / Italy): hills, low sun, optional fog. */
export const BattlefieldSet: React.FC<SetProps & { fog?: number; sun?: number; grass?: string; dusk?: boolean }> = ({ floor = -420, fog = 0, sun = 1, grass = "#8aa05a", dusk = false, children }) => {
  const hz = floor + 400;
  return (
    <>
      <Sky w={8000} h={4000} y={hz + 600} top={dusk ? "#5a5a8a" : "#9cc0e0"} bottom={dusk ? "#f2a070" : "#fbe8c8"} z={-60} />
      {sun > 0 ? <Sun x={-1000} y={hz + 300 + sun * 400} r={140} color="#fff0b0" z={-59} /> : null}
      <Hill w={8000} h={420} y={hz - 40} color={shadeHex(grass, 0.12)} seed={12} z={-56} />
      <Hill w={8000} h={300} y={hz - 200} color={grass} seed={13} z={-54} />
      <Part shape={roundRect(9000, 3000, 0)} color={mixHex(grass, "#c9b88a", 0.2)} flat outline={0} y={hz - 1700} z={-50} />
      {[-2300, -900, 1400, 2400].map((x, i) => (
        <Tree key={i} kind="green" x={x} y={hz - 260 - (i % 2) * 60} h={360} seed={i + 11} z={-53} />
      ))}
      {fog > 0 ? <FogBank w={8000} h={1000} y={hz - 300} k={fog} z={-30} /> : null}
      {children}
      {fog > 0 ? <FogBank w={8000} h={900} y={floor + 160} k={fog * 0.8} seed={9} z={2} /> : null}
    </>
  );
};

/** Russian winter: grey sky, endless snow, bare trees, snowfall. */
export const SnowField: React.FC<SetProps & { snow?: number; trees?: boolean }> = ({ floor = -420, snow = 1, trees = true, children }) => {
  const hz = floor + 380;
  return (
    <>
      <Sky w={8000} h={4000} y={hz + 600} top="#8a94a8" bottom="#dfe4ec" z={-60} />
      <Hill w={8000} h={220} y={hz - 60} color="#e6eaf2" seed={21} z={-55} />
      <Part shape={roundRect(9000, 3000, 0)} color="#f2f5fa" flat outline={0} y={hz - 1600} z={-50} />
      {trees
        ? [-2200, -1500, -800, 900, 1600, 2300].map((x, i) => <DeadTree key={i} x={x} y={hz - 120 - (i % 3) * 60} h={360 + (i % 2) * 120} seed={i} snow z={-52} />)
        : null}
      {snow > 0 ? <Snowfall w={5000} h={3000} y={hz} n={200} wind={1.6} speed={1.4} alpha={snow} z={-4} /> : null}
      {children}
      {snow > 0 ? <Snowfall w={5000} h={3000} y={hz} n={60} wind={2} speed={2} size={1.8} alpha={snow} seed={8} z={3} /> : null}
    </>
  );
};

/** Moscow 1812: Kremlin wall, onion domes; `fire` 0..1 sets the city alight. */
export const MoscowSet: React.FC<SetProps & { fire?: number; night?: boolean }> = ({ floor = -420, fire = 0, night = false, children }) => {
  const hz = floor + 300;
  return (
    <>
      <Sky w={8000} h={4000} y={hz + 600} top={fire > 0.3 || night ? "#3a2a3a" : "#9cb8d8"} bottom={fire > 0.3 ? "#f08a4a" : "#f0e8dc"} z={-60} />
      {fire > 0 ? <Glow rx={3000} ry={900} color="#ff7a3a" alpha={0.55 * fire} additive y={hz + 300} z={-59} /> : null}
      {[-1700, -500, 700, 1800].map((x, i) => (
        <OnionChurch key={i} x={x} y={hz + 180} s={0.9 - (i % 2) * 0.15} dome={["#e2b23c", "#3f7ac0", "#e2b23c", "#4f9a7a"][i]} z={-57 + i * 0.01} />
      ))}
      {fire > 0
        ? [-2000, -1200, -300, 400, 1200, 2100].map((x, i) => (
            <X key={`f${i}`} x={x} y={hz + 300 + (i % 2) * 120} s={(2.2 + (i % 3) * 0.6) * Math.min(1, fire * 1.4)} z={-56}>
              <Flame size={2} seed={i} />
            </X>
          ))
        : null}
      {fire > 0 ? <Smoke x={0} y={hz + 1400} w={4000} h={1800} alpha={0.6 * fire} color="#3a3236" seed={4} z={-55.5} /> : null}
      <KremlinWall x={0} y={hz - 60} w={6000} towers={5} z={-54} />
      <Part shape={roundRect(9000, 3000, 0)} color={night || fire > 0.3 ? "#8a8494" : "#e6e2da"} flat outline={0} y={hz - 1560} z={-50} />
      {children}
    </>
  );
};

/** Waterloo: low ridge, mud, rain, the Hougoumont farm. */
export const MudField: React.FC<SetProps & { rain?: number; dusk?: boolean }> = ({ floor = -420, rain = 1, dusk = false, children }) => {
  const hz = floor + 380;
  return (
    <>
      <Sky w={8000} h={4000} y={hz + 600} top={dusk ? "#4a3a4a" : "#6a7484"} bottom={dusk ? "#d88a5a" : "#b8bcc4"} z={-60} />
      <Cloud w={1400} x={-800} y={hz + 900} seed={4} color="#8a8e98" shadow="#6a6e78" z={-59} />
      <Cloud w={1200} x={900} y={hz + 1000} seed={7} color="#8a8e98" shadow="#6a6e78" z={-59} />
      <Hill w={8000} h={260} y={hz - 60} color="#6f7a4a" seed={31} z={-55} />
      <X x={1300} y={hz - 40} s={0.8} z={-54}>
        <StoneHouse w={520} h={300} wall="#e2d8c4" roof="#8a4a3a" />
      </X>
      <Part shape={roundRect(9000, 3000, 0)} color="#6a5a42" flat outline={0} y={hz - 1600} z={-50} />
      {Array.from({ length: 22 }, (_, i) => {
        const r = rng(i * 5 + 1);
        return <Part key={i} shape={ellipse(80 + r() * 140, 18 + r() * 14)} color={r() > 0.5 ? "#5a4a36" : "#7a8a9a"} flat outline={3} x={-2600 + r() * 5200} y={hz - 140 - r() * 1200} z={-49.9} />;
      })}
      {rain > 0 ? <Rain w={5000} h={3000} y={hz} n={160} z={-2} /> : null}
      {children}
    </>
  );
};

/** Open sea with an island on the horizon. */
export const IslandSea: React.FC<SetProps & { kind?: "helena" | "elba" | "corsica"; night?: boolean; islandX?: number; islandS?: number }> = ({ floor = -420, kind = "elba", night = false, islandX = 300, islandS = 1, children }) => {
  const hz = floor + 420;
  return (
    <>
      <Sky w={8000} h={4000} y={hz + 600} top={night ? "#141c38" : "#6aa8d8"} bottom={night ? "#3a4a7a" : "#f0f2ea"} z={-60} />
      {night ? <Stars w={6000} h={2000} y={hz + 900} z={-59} /> : <Cloud w={800} x={-900} y={hz + 700} seed={3} z={-59} />}
      {night ? <Moon x={1000} y={hz + 800} r={90} z={-58.5} /> : null}
      <IslandRock kind={kind} x={islandX} y={hz} s={islandS} z={-56} />
      <Sea w={8000} h={3000} y={hz - 1500} color={night ? "#1f3a6a" : "#2f7ab0"} z={-55} />
      {children}
    </>
  );
};

/** Caribbean (Haiti): palms, green mountains, sea. */
export const CaribbeanSet: React.FC<SetProps & { smoke?: number }> = ({ floor = -420, smoke = 0, children }) => {
  const hz = floor + 380;
  return (
    <>
      <Sky w={8000} h={4000} y={hz + 600} top="#4f9ad8" bottom="#f2f0dc" z={-60} />
      <Mountains w={8000} y={hz - 20} peaks={pts([[-2800, 260], [-1800, 460], [-800, 330], [200, 480], [1300, 340], [2400, 440]])} color="#3f7a4a" z={-56} />
      <Sea w={8000} h={200} y={hz - 80} color="#2fa0c0" z={-55} />
      <Part shape={roundRect(9000, 3000, 0)} color="#d8c690" flat outline={0} y={hz - 1680} z={-50} />
      {[-2000, -1300, 1400, 2100].map((x, i) => (
        <PalmTree key={i} x={x} y={hz - 200 - (i % 2) * 100} h={700} seed={i + 4} lean={i < 2 ? 0.1 : -0.1} z={-48} />
      ))}
      {smoke > 0 ? <Smoke x={-600} y={hz + 300} w={1600} h={1400} alpha={0.45 * smoke} color="#8a8690" seed={6} z={-40} /> : null}
      {children}
    </>
  );
};

/** Spain: dry rocky sierra under a hot sky. */
export const SpainSet: React.FC<SetProps> = ({ floor = -420, children }) => {
  const hz = floor + 420;
  return (
    <>
      <Sky w={8000} h={4000} y={hz + 600} top="#7ab0d8" bottom="#f6e6c4" z={-60} />
      <Mountains w={8000} y={hz - 40} peaks={pts([[-2800, 280], [-1800, 460], [-900, 330], [100, 500], [1100, 320], [2200, 450], [3000, 260]])} color="#c4946a" z={-56} />
      <Part shape={roundRect(9000, 3000, 0)} color="#d8b47a" flat outline={0} y={hz - 1640} z={-50} />
      {[[-1500, hz - 200, 1.3], [1600, hz - 160, 1.1], [-300, hz - 120, 0.8]].map(([x, y, s], i) => (
        <Part key={i} shape={blob([[-300, 0], [-240, 220], [-60, 320], [140, 260], [300, 0]], 8)} color="#b08a62" shade={0.28} x={x} y={y} s={s} z={-48 + i * 0.01} />
      ))}
      {[-2200, 2300].map((x, i) => (
        <Bush key={`b${i}`} w={240} x={x} y={floor + 120} color="#7a8a4a" seed={i + 9} z={-47} />
      ))}
      {children}
    </>
  );
};

// ───────────────────────── interiors ─────────────────────────

const EMPIRE: RoomColors = { wall: "#3f6a5a", wallLow: "#355a4c", side: "#2c4c40", ceiling: "#e8dcc0", floor: "#a06a3e", tile: "#7e5030", light: "#fff4d8" };
const PLASTER: RoomColors = { wall: "#e8dcc0", wallLow: "#d8c8a6", side: "#b8a07a", ceiling: "#f2ead8", floor: "#a87a4a", tile: "#87603a", light: "#fff4d8" };
const ROYAL: RoomColors = { wall: "#8a2a35", wallLow: "#74222c", side: "#5e1a24", ceiling: "#f0e2c0", floor: "#b08050", tile: "#8a6038", light: "#fff4d8" };
const PLAIN: RoomColors = { wall: "#c8c4b0", wallLow: "#b8b49e", side: "#9a967e", ceiling: "#e2ded0", floor: "#8a6a4a", tile: "#6e5238", light: "#fff4d8" };
const LAB: RoomColors = { wall: "#e2e6ee", wallLow: "#cfd6e2", band: "#5a6c8e", side: "#6a7a9a", ceiling: "#c6ccd8", floor: "#e6eaf0", tile: "#b6bccb", light: "#ffffff" };
const GALLERY: RoomColors = { wall: "#b8433a", wallLow: "#9a382f", side: "#7e2c26", ceiling: "#efe6d4", floor: "#a87a50", tile: "#8a6040", light: "#fff4e0" };

/** Gold-framed window with drapes, on the back wall (x, y = centre). */
const DrapedWindow: React.FC<{ x: number; y: number; w?: number; h?: number; sky?: string; drape?: string; glow?: string | null; children?: React.ReactNode }> = ({ x, y, w = 300, h = 440, sky = "#a8c8e8", drape = "#b8262f", glow = null, children }) => (
  <X x={x} y={y} z={-39}>
    <Part shape={roundRect(w + 40, h + 40, 8)} color="#d8a93a" shade={0.2} />
    <Part shape={roundRect(w, h, 4)} color={sky} flat outline={4} z={0.001} />
    {glow ? <Glow rx={w * 0.8} color={glow} alpha={0.5} additive z={0.002} /> : null}
    <X z={0.003}>{children}</X>
    <Line pts={[[0, -h / 2], [0, h / 2]]} width={6} color="#d8a93a" z={0.004} />
    <Line pts={[[-w / 2, 0], [w / 2, 0]]} width={6} color="#d8a93a" z={0.004} />
    {[-1, 1].map((k) => (
      <Part key={k} shape={blob([[0, h / 2 + 40], [k * 90, h / 2 + 40], [k * 70, 0], [k * 110, -h / 2 - 30], [0, -h / 2 - 30]], 8)} color={drape} shade={0.25} x={k * (w / 2 + 20)} z={0.005} />
    ))}
    <Part shape={roundRect(w + 260, 30, 10)} color="#d8a93a" shade={0.2} y={h / 2 + 50} z={0.006} />
  </X>
);

/** Chandelier hanging from the ceiling. */
const Chandelier: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <X x={x} y={y} s={s} z={-38}>
      <Line pts={[[0, 0], [0, 200]]} width={5} color="#d8a93a" />
      <Part shape={ellipse(120, 26)} color="#d8a93a" shade={0.25} />
      {[-90, -45, 0, 45, 90].map((cx, i) => (
        <X key={i} x={cx} y={20}>
          <Part shape={roundRect(12, 40, 3)} color="#f4efe4" flat outline={3} y={20} />
          <Part shape={blob([[0, 0], [8, 12], [0, 30 + Math.sin(frame * 0.4 + i) * 3], [-8, 12]], 6)} color="#ffd36a" flat outline={0} y={44} />
        </X>
      ))}
      <Glow rx={300} color="#ffe2a0" alpha={0.35} additive y={60} />
    </X>
  );
};

/** Empire study / office (Napoleon's): green walls, gilded window, map, desk, candles. */
export const StudySet: React.FC<SetProps & { night?: boolean; map?: boolean }> = ({ floor = -420, night = false, map = true, children }) => {
  const geo: RoomGeo = { bw: 1900, floor: floor + 160, ceil: floor + 1240, vy: floor + 560 };
  return (
    <>
      <PerspectiveRoom geo={geo} colors={EMPIRE} lights={0} />
      <Part shape={roundRect(1900, 26, 4)} color="#d8a93a" flat outline={4} y={floor + 520} z={-39.3} />
      <DrapedWindow x={-520} y={floor + 700} sky={night ? "#1a2244" : "#a8c8e8"} drape="#b8262f" glow={night ? null : "#fff4d8"}>
        {night ? <Moon x={60} y={100} r={36} /> : null}
      </DrapedWindow>
      {map ? (
        <X x={420} y={floor + 720} z={-39}>
          <Part shape={roundRect(560, 380, 6)} color="#d8a93a" shade={0.2} />
          <X z={0.002}>
            <EuropeMap ppd={9} center={[14, 48]} w={520} h={340} waves={false} />
          </X>
        </X>
      ) : null}
      <Chandelier x={0} y={floor + 1000} s={0.9} />
      {children}
    </>
  );
};

/** Brienne military school classroom (1779): plaster walls, wooden benches, blackboard. */
export const ClassroomSet: React.FC<SetProps> = ({ floor = -420, children }) => {
  const geo: RoomGeo = { bw: 2000, floor: floor + 160, ceil: floor + 1280, vy: floor + 560 };
  return (
    <>
      <PerspectiveRoom geo={geo} colors={PLASTER} lights={0} />
      <Part shape={roundRect(2000, 300, 4)} color="#8a5a36" shade={0.15} y={floor + 310} z={-39.4} />
      <X x={-200} y={floor + 760} z={-39}>
        <Part shape={roundRect(900, 420, 8)} color="#6a4a2a" shade={0.2} />
        <Part shape={roundRect(840, 360, 4)} color="#2f4a3a" flat outline={4} z={0.001} />
        <Line pts={[[-360, 100], [-120, 100]]} width={5} color="#e8ece4" z={0.002} />
        <Line pts={[[-360, 40], [40, 40]]} width={5} color="#e8ece4" z={0.002} />
        <Line pts={[[-360, -20], [-60, -20]]} width={5} color="#e8ece4" z={0.002} />
        <Part shape={circle(60)} color="#2f4a3a" flat outline={5} x={220} y={30} z={0.002} />
        <Line pts={[[160, 30], [280, 30]]} width={4} color="#e8ece4" z={0.003} />
      </X>
      <DrapedWindow x={640} y={floor + 760} w={260} h={400} drape="#3a5a8a" />
      {children}
    </>
  );
};

/** Government hall (Council of Five Hundred / Directory): plaster, red drapes, tricolour banners, rostrum. */
export const CouncilHall: React.FC<SetProps> = ({ floor = -420, children }) => {
  const geo: RoomGeo = { bw: 2200, floor: floor + 160, ceil: floor + 1300, vy: floor + 600 };
  return (
    <>
      <PerspectiveRoom geo={geo} colors={PLASTER} lights={0} />
      {[-700, 0, 700].map((x, i) => (
        <X key={i} x={x} y={floor + 720} z={-39}>
          {[-1, 0, 1].map((k) => (
            <Part key={k} shape={roundRect(90, 520, 4)} color={["#2c4486", "#f2efe6", "#c8262f"][k + 1]} flat outline={4} x={k * 90} />
          ))}
        </X>
      ))}
      <X x={0} y={floor + 200} z={-30}>
        <Part shape={roundRect(600, 260, 10)} color="#8a5a36" shade={0.2} y={130} />
        <Part shape={roundRect(640, 30, 6)} color="#d8a93a" flat outline={4} y={260} z={0.001} />
      </X>
      <Chandelier x={-500} y={floor + 1060} s={0.8} />
      <Chandelier x={500} y={floor + 1060} s={0.8} />
      {children}
    </>
  );
};

/** Palace room (Tuileries throne room, Louvre-red walls), optional throne. */
export const PalaceRoom: React.FC<SetProps & { throne?: boolean }> = ({ floor = -420, throne = true, children }) => {
  const geo: RoomGeo = { bw: 2000, floor: floor + 160, ceil: floor + 1300, vy: floor + 600 };
  return (
    <>
      <PerspectiveRoom geo={geo} colors={ROYAL} lights={0} />
      {[-640, 640].map((x, i) => (
        <DrapedWindow key={i} x={x} y={floor + 760} w={240} h={420} drape="#d8a93a" />
      ))}
      {throne ? (
        <X x={0} y={floor + 160} z={-35}>
          <Part shape={roundRect(420, 60, 8)} color="#d8a93a" shade={0.2} y={30} />
          <Part shape={roundPoly([[-160, 60], [160, 60], [150, 640], [0, 720], [-150, 640]], 30)} color="#d8a93a" shade={0.25} z={0.001} />
          <Part shape={roundPoly([[-110, 200], [110, 200], [100, 600], [0, 650], [-100, 600]], 26)} color="#2c4486" shade={0.2} z={0.002} />
          <Part shape={roundRect(300, 80, 20)} color="#2c4486" shade={0.2} y={180} z={0.003} />
          {[[-50, 420], [50, 420], [0, 520], [-50, 300], [50, 300]].map(([bx, by], i) => (
            <Part key={i} shape={circle(12)} color="#e2b23c" flat outline={3} x={bx} y={by} z={0.004} />
          ))}
        </X>
      ) : null}
      <Chandelier x={0} y={floor + 1080} />
      {children}
    </>
  );
};

/** Kremlin room, autumn 1812: red walls, window onto the burning city, calendar. */
export const KremlinRoom: React.FC<SetProps & { fire?: number }> = ({ floor = -420, fire = 0.6, children }) => {
  const frame = useCurrentFrame();
  const geo: RoomGeo = { bw: 1900, floor: floor + 160, ceil: floor + 1240, vy: floor + 560 };
  return (
    <>
      <PerspectiveRoom geo={geo} colors={ROYAL} lights={0} />
      <DrapedWindow x={420} y={floor + 720} w={360} h={460} sky={fire > 0 ? "#f08a4a" : "#9cb8d8"} drape="#d8a93a" glow={fire > 0 ? "#ff8a3a" : null}>
        {[-100, 20, 120].map((x, i) => (
          <X key={i} x={x} y={-120} s={0.35}>
            <OnionChurch w={300} />
          </X>
        ))}
        {fire > 0 ? (
          <X y={-180} s={0.5 + fire * 0.3}>
            <Flame size={1.5} seed={3} />
          </X>
        ) : null}
      </DrapedWindow>
      <X x={-520} y={floor + 760} z={-39}>
        <Calendar flip={(frame % 90) / 90} />
      </X>
      {children}
    </>
  );
};

/** Longwood House bedroom (Saint Helena): plain walls, small window to the sea, narrow bed. */
export const LongwoodRoom: React.FC<SetProps & { bed?: boolean }> = ({ floor = -420, bed = true, children }) => {
  const geo: RoomGeo = { bw: 1800, floor: floor + 160, ceil: floor + 1180, vy: floor + 540 };
  return (
    <>
      <PerspectiveRoom geo={geo} colors={PLAIN} lights={0} />
      <X x={-420} y={floor + 720} z={-39}>
        <Part shape={roundRect(300, 360, 6)} color="#6a5a4a" shade={0.2} />
        <Part shape={roundRect(260, 320, 4)} color="#8fc2e0" flat outline={4} z={0.001} />
        <Part shape={roundRect(260, 110, 0)} color="#2f7ab0" flat outline={0} y={-104} z={0.002} />
        <Line pts={[[0, -160], [0, 160]]} width={6} color="#6a5a4a" z={0.003} />
        <Line pts={[[-130, 0], [130, 0]]} width={6} color="#6a5a4a" z={0.003} />
      </X>
      {bed ? (
        <X x={380} y={floor + 160} z={-30}>
          <Part shape={roundRect(760, 160, 12)} color="#e8e2d4" shade={0.2} y={190} />
          <Part shape={roundRect(780, 40, 8)} color="#6a4a30" shade={0.2} y={100} z={-0.001} />
          <Part shape={roundRect(40, 420, 8)} color="#6a4a30" shade={0.2} x={-370} y={210} z={0.001} />
          <Part shape={roundRect(40, 300, 8)} color="#6a4a30" shade={0.2} x={370} y={150} z={0.001} />
          <Part shape={roundRect(200, 90, 30)} color="#f6f2ea" shade={0.2} x={-260} y={290} z={0.002} />
        </X>
      ) : null}
      {children}
    </>
  );
};

/** Modern lab (DNA, hair tests). */
export const LabSet: React.FC<SetProps> = ({ floor = -420, children }) => {
  const geo: RoomGeo = { bw: 2000, floor: floor + 160, ceil: floor + 1280, vy: floor + 560 };
  return (
    <>
      <PerspectiveRoom geo={geo} colors={LAB} lights={2} />
      <X x={-520} y={floor + 760} z={-39}>
        <Part shape={roundRect(520, 320, 10)} color="#2a2e3a" shade={0.2} />
        <Part shape={roundRect(480, 280, 6)} color="#1f3a5a" flat outline={4} z={0.001} />
        {[0, 1, 2, 3, 4].map((i) => (
          <Part key={i} shape={roundRect(30, 40 + i * 30, 4)} color="#4fd0a0" flat outline={0} x={-160 + i * 80} y={-100 + (40 + i * 30) / 2} z={0.002} />
        ))}
      </X>
      <Window x={560} y={floor + 760} w={360} h={360} z={-39} />
      {children}
    </>
  );
};

/** Museum gallery (Louvre red) with framed paintings. */
export const GallerySet: React.FC<SetProps> = ({ floor = -420, children }) => {
  const geo: RoomGeo = { bw: 2200, floor: floor + 160, ceil: floor + 1300, vy: floor + 600 };
  return (
    <>
      <PerspectiveRoom geo={geo} colors={GALLERY} lights={0} />
      {[-800, 800].map((x, i) => (
        <Painting key={i} x={x} y={floor + 720} w={300} h={380} s={0.8} canvas={["#4a6a8a", "#8a6a3a"][i]} plate={false} z={-39} />
      ))}
      <Chandelier x={0} y={floor + 1100} s={0.9} />
      {children}
    </>
  );
};

/** Chalkboard on an easel with the episode's rule (text is drawn by Labels over it). Origin = board centre. */
export const RuleBoard: React.FC<{ x?: number; y?: number; s?: number; z?: number; crack?: number; children?: React.ReactNode }> = ({ x = 0, y = 0, s = 1, z = 0, crack = 0, children }) => (
  <X x={x} y={y} s={s} z={z}>
    {[-1, 1].map((k) => (
      <Line key={k} pts={[[k * 300, -560], [k * 240, 340]]} width={30} color="#7a4e2a" z={-0.02} />
    ))}
    <Line pts={[[0, 300], [0, -520]]} width={26} color="#6a4424" z={-0.03} />
    <Part shape={roundRect(980, 640, 18)} color="#8a5a32" shade={0.22} />
    <Part shape={roundRect(900, 560, 8)} color="#2f4a3a" flat outline={5} z={0.001} />
    <Part shape={roundRect(860, 520, 6)} color="#365444" flat outline={0} z={0.0015} />
    {crack > 0 ? <Line pts={([[-80, 280], [-20, 120], [-90, 20], [10, -110], [-40, -280]] as [number, number][]).slice(0, Math.max(2, Math.round(crack * 5)))} width={7} color="#1a2a22" z={0.003} /> : null}
    <X z={0.004}>{children}</X>
  </X>
);
