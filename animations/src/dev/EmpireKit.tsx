import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Stage, X, Part, roundRect } from "../kit";
import { Character, poses } from "../kit/character";
import {
  Musket, FieldGun, Steed, ShipOfLine, Sloop, Painting, Guillotine, RosettaStone, LaurelCrown, Louse, Microscope, BattleIcon, Cannonballs,
  ParisHouse, ChurchFacade, Palace, HillFort, OnionChurch, KremlinWall, GothicNave, IslandRock, LogHut, DeadTree, StoneHouse,
  Snowfall, FogBank, EuropeMap, EURO, EMPIRE_1812, Sky, Sea, Ground, NationFlag,
} from "../kit/env";
import * as C from "../episodes/napoleon/cast";

/** Napoleonic kit review sheets (dev only). */
export const EmpireKit: React.FC<{ page?: number }> = ({ page = 0 }) => {
  const frame = useCurrentFrame();
  const row = (list: React.ComponentProps<typeof Character>[], y: number, s = 0.62) =>
    list.map((p, i) => <Character key={i} {...p} x={-820 + i * (1640 / Math.max(1, list.length - 1))} y={y} s={s} look={0.4} facing={1} expression={{ eyes: "open", mouth: "smile" }} pose={poses.idle(frame, i)} />);
  return (
    <AbsoluteFill style={{ backgroundColor: "#cfd6de" }}>
      <Stage camera={{ zoom: 1 }} light={{ dir: [-0.6, 0.8] }} vignette={0.1}>
        {page <= 2 ? <Part shape={roundRect(4000, 3000, 0)} color="#dfe4ea" flat outline={0} z={-5} /> : null}
        {page === 0 ? (
          <>
            {row([C.NAPOLEON, C.NAPOLEON_GREY, C.NAPOLEON_YOUNG(false), C.NAPOLEON_YOUNG(true), C.NAPOLEON_BOY, C.NAPOLEON_CROWNED, C.NAPOLEON_OLD] as never, 40)}
            {row([C.YOU, C.SOLDIER(1), C.SOLDIER(2), C.SOLDIER(3), C.OFFICER(0), C.OFFICER(1), C.GRENADIER(0)] as never, -480)}
          </>
        ) : null}
        {page === 1 ? (
          <>
            {row([C.REDCOAT(0), C.NELSON, C.WELLINGTON, C.BRIT_NAVY(1), C.AUSTRIAN(0), C.AUSTRIAN(1), C.RUSSIAN(0)] as never, 40)}
            {row([C.COSSACK(0), C.TSAR, C.PRUSSIAN(0), C.MAMLUK(0), C.MAMLUK(1), C.SAVANT(0), C.SAVANT(1)] as never, -480)}
          </>
        ) : null}
        {page === 2 ? (
          <>
            {row([C.KING, C.KING_OLD, C.REVOLUTIONARY(0), C.REVOLUTIONARY(1), C.ROYALIST(0), C.DEPUTY(0), C.CARLO] as never, 40)}
            {row([C.CARLO_REBEL, C.LETIZIA, C.SCHOOLBOY(0), C.POPE, C.GUERRILLA(0), C.HAITIAN(0), C.DIPLOMAT(0)] as never, -480)}
          </>
        ) : null}
        {page === 3 ? (
          <>
            <Sky w={4000} h={3000} z={-5} />
            <Musket x={-700} y={380} fire={(frame % 30) / 30} />
            <Musket x={150} y={380} />
            <FieldGun x={-560} y={-120} s={0.8} fire={(frame % 40) / 40} />
            <Cannonballs x={-180} y={-120} s={0.8} />
            <Steed x={240} y={-460} s={0.8} cloth="#2c4486" walk={1}>
              <Character {...C.NAPOLEON} s={0.62} pose={poses.sit(frame)} expression={{ eyes: "open", mouth: "flat" }} look={0.5} />
            </Steed>
            <Steed x={660} y={-460} s={0.6} color="#f2efe9" mane="#c9c4cc" rear={1} cloth="#9a1f35" />
            <Steed x={60} y={60} s={0.5} mule color="#8c7f72" mane="#3a3230" />
          </>
        ) : null}
        {page === 4 ? (
          <>
            <Sky w={4000} h={3000} z={-5} />
            <Sea w={4000} h={700} y={-700} z={-4} />
            <ShipOfLine x={-480} y={0} s={0.5} navy="uk" fire={(frame % 60) / 60} />
            <ShipOfLine x={500} y={0} s={0.5} navy="fr" burn={0.7} />
            <ShipOfLine x={-460} y={-420} s={0.35} navy="fr" explode={0.4} />
            <Sloop x={500} y={-420} s={0.5} />
          </>
        ) : null}
        {page === 5 ? (
          <>
            <Painting x={-560} y={180} s={0.45} />
            <Guillotine x={140} y={-120} s={0.5} blade={0.3} />
            <RosettaStone x={620} y={-60} s={0.8} hi={1} glow={1} />
            <LaurelCrown x={-620} y={-300} />
            <Louse x={-160} y={-360} s={0.8} walk={1} />
            <Microscope x={240} y={-460} s={0.6} />
            <BattleIcon x={700} y={-420} />
            <BattleIcon x={840} y={-420} lost />
          </>
        ) : null}
        {page === 6 ? (
          <>
            <Sky w={4000} h={3000} z={-5} />
            <Ground w={4000} h={600} y={-300} z={-4} />
            <Palace x={0} y={40} s={0.5} />
            {[0, 1, 2, 3].map((i) => (
              <ParisHouse key={i} x={-820 + i * 230} y={-500} s={0.6} floors={3 + (i % 2)} wall={["#efe2c4", "#e8d8b8", "#f2e8d0", "#e2d2b0"][i]} shop={i === 1 ? "#4f6f8a" : null} />
            ))}
            <ChurchFacade x={500} y={-500} s={0.5} />
          </>
        ) : null}
        {page === 7 ? (
          <>
            <Sky w={4000} h={3000} z={-5} top="#9fb4cf" bottom="#e6ecf4" />
            <Ground w={4000} h={600} y={-300} z={-4} color="#eef2f8" />
            <HillFort x={-560} y={0} s={0.5} fire={(frame % 50) / 50} />
            <OnionChurch x={360} y={0} s={0.6} />
            <KremlinWall x={300} y={-520} s={0.3} />
            <LogHut x={-700} y={-520} s={0.6} snow />
            <DeadTree x={-360} y={-520} s={0.6} snow />
            <StoneHouse x={-60} y={-520} s={0.6} />
            <Snowfall w={2000} h={1100} />
          </>
        ) : null}
        {page === 8 ? <GothicNave /> : null}
        {page === 9 ? (
          <EuropeMap
            ppd={26}
            center={[15, 47]}
            w={1920}
            h={1080}
            tint={Object.fromEntries(EMPIRE_1812.map((c) => [c, c === "France" ? "#3b62b8" : "#8aa8de"]))}
            tintK={0.75}
            routes={[{ pts: [EURO.kaunas, EURO.smolensk, EURO.borodino, EURO.moscow], k: Math.min(1, frame / 60), width: 40, color: "#d8a85a" }, { pts: [EURO.moscow, EURO.smolensk, EURO.berezina, EURO.kaunas], k: Math.min(1, frame / 60), width: 10, color: "#211b20" }]}
            pins={[{ at: EURO.paris }, { at: EURO.moscow, color: "#2f4f9a" }, { at: EURO.ajaccio, dot: true }, { at: EURO.elba, dot: true }]}
            islands={["corsica", "elba"]}
          />
        ) : null}
        {page === 11 ? (
          <>
            <Sky w={4000} h={3000} z={-5} />
            <Steed x={-560} y={-300} s={1.0} cloth="#2c4486" walk={0} />
            <Steed x={300} y={-300} s={1.0} color="#f2efe9" mane="#c9c4cc" rear={1} cloth="#9a1f35" />
            <Steed x={-560} y={-520} s={0.5} mule color="#8c7f72" mane="#3a3230" walk={1} />
          </>
        ) : null}
        {page === 10 ? (
          <>
            <Sky w={4000} h={3000} z={-5} />
            <Sea w={4000} h={900} y={-600} z={-4} />
            <IslandRock kind="helena" x={-480} y={-150} s={0.6} />
            <IslandRock kind="elba" x={480} y={-150} s={0.6} />
            <FogBank y={-200} />
            <NationFlag kind="uk" x={-800} y={200} w={160} />
            <NationFlag kind="france" x={-500} y={200} w={160} />
            <NationFlag kind="haiti" x={-200} y={200} w={160} />
            <NationFlag kind="royal" x={100} y={200} w={160} />
            <NationFlag kind="prussia" x={400} y={200} w={160} />
            <NationFlag kind="austria" x={700} y={200} w={160} />
          </>
        ) : null}
      </Stage>
    </AbsoluteFill>
  );
};

/** Dummy to keep X referenced for quick experiments. */
export const _EmpireX = X;
