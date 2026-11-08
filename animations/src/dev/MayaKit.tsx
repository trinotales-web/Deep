import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Stage } from "../kit";
import { Character, poses } from "../kit/character";
import {
  Sky, Ground, MayaPyramid, TikalTemple, ElCastillo, InscriptionsTemple, MayaHut, Stela, Lake, IslandCity, Canoe, SpanishGalley, Cannon, BigLeaf, Jungle, Ceiba,
  Vines, Cenote, BallCourt, RubberBall, Glyph, GlyphPanel, MayaNumber, Codex, CalendarGear, LongCount, StingraySpine, ThornRope, MayaBowl, JadeMask, PakalLid,
  Sarcophagus, CornCob, CornPlant, Tortilla, Asteroid, Dinosaur, LidarReveal, SurveyPlane, LimeKiln, Stump, WarGodLitter, Quetzal, MesoMap, Globe, SpaceStars,
} from "../kit/env";
import {
  ITZA_WARRIOR, MAYA_KING, MAYA_QUEEN, MAYA_PRIEST, MAYA_COMMONER, MAYA_WOMAN, BALLPLAYER, JAGUAR_WARRIOR, HUNAHPU, XBALANQUE, XIBALBA_LORD,
  MAIZE_GOD, SPANISH_SOLDIER, CORTES, ALVARADO, FRIAR, COLUMBUS, GUERRERO, AGUILAR, SCIENTIST, RUZ, WRITER,
} from "../episodes/maya/cast";

/** Maya kit review sheets (dev only). */
export const MayaKit: React.FC<{ page?: number }> = ({ page = 0 }) => {
  const frame = useCurrentFrame();
  const row = (list: React.ComponentProps<typeof Character>[], y: number, s: number) =>
    list.map((c, i) => (
      <Character key={i} {...c} x={-860 + i * (1720 / Math.max(1, list.length - 1))} y={y} s={s} look={0.5} expression={{ eyes: "open", mouth: "smile" }} pose={poses.idle(frame, i)} />
    ));
  return (
    <AbsoluteFill style={{ backgroundColor: "#cfe6f2" }}>
      <Stage camera={{ zoom: 1 }} light={{ dir: [-0.6, 0.8] }} vignette={0.1}>
        <Sky w={4000} h={3000} top="#8ec9ee" bottom="#e8f4f8" z={-40} />
        {page === 0 ? (
          <>
            {row([ITZA_WARRIOR(0), ITZA_WARRIOR(1), MAYA_KING(0), MAYA_QUEEN(0), MAYA_PRIEST(0), MAYA_COMMONER(0), MAYA_COMMONER(1), MAYA_WOMAN(0), BALLPLAYER(0), JAGUAR_WARRIOR(0), HUNAHPU] as never, 40, 0.66)}
            {row([XBALANQUE, XIBALBA_LORD(0), MAIZE_GOD, SPANISH_SOLDIER(0), SPANISH_SOLDIER(1), CORTES, ALVARADO, FRIAR(0), FRIAR(1), COLUMBUS, GUERRERO] as never, -500, 0.66)}
          </>
        ) : null}
        {page === 1 ? <>{row([AGUILAR, SCIENTIST(0), SCIENTIST(1), RUZ, WRITER, MAYA_KING(1), MAYA_KING(2), MAYA_PRIEST(1), MAYA_PRIEST(2)] as never, -300, 0.9)}</> : null}
        {page === 2 ? (
          <>
            <TikalTemple x={-700} y={-560} s={0.9} />
            <ElCastillo x={60} y={-560} s={0.7} equinox={1} />
            <InscriptionsTemple x={700} y={-200} s={0.5} overgrown={0.6} />
            <MayaHut x={500} y={-560} w={240} z={2} />
            <Stela x={880} y={-560} h={300} z={2} />
          </>
        ) : null}
        {page === 3 ? (
          <>
            <Lake y={-80} w={4000} h={1200} z={-20} />
            <IslandCity x={-300} y={-80} w={1200} z={-10} />
            <SpanishGalley x={400} y={-420} s={0.7} fire={(frame % 30) / 30} z={2} />
            <Canoe x={-500} y={-480} len={520} z={3} />
          </>
        ) : null}
        {page === 4 ? (
          <>
            <Jungle y={-560} w={4000} h={500} z={-10} />
            <Ceiba x={-600} y={-560} h={900} z={-5} />
            <Cenote x={350} y={100} w={700} depth={600} z={1} />
            <BigLeaf x={-900} y={-560} len={500} rot={-0.5} z={5} />
            <Vines y={540} w={1800} z={6} />
          </>
        ) : null}
        {page === 5 ? (
          <>
            <BallCourt y={-400} w={1600} h={480} z={-5} />
            <RubberBall x={0} y={-200} r={50} z={2} />
            <GlyphPanel x={-560} y={240} cols={4} rows={3} size={90} z={3} />
            {[0, 1, 5, 7, 13, 19].map((n, i) => (
              <MayaNumber key={n} n={n} size={0.5} x={160 + i * 130} y={330} z={3} />
            ))}
            <Codex x={420} y={20} pages={5} z={3} />
          </>
        ) : null}
        {page === 6 ? (
          <>
            <CalendarGear x={-560} y={150} r={260} teeth={20} label="numbers" rot={frame * 0.01} z={1} />
            <CalendarGear x={-120} y={150} r={180} teeth={20} rot={-frame * 0.014} color="#c8a878" z={1} />
            <LongCount x={420} y={300} value={[13, 0, 0, 0, 0]} s={0.6} z={2} />
            <JadeMask x={300} y={-200} size={0.9} z={2} />
            <MayaBowl x={680} y={-460} papers z={2} />
            <StingraySpine x={-860} y={-460} z={2} />
            <ThornRope x={-700} y={-60} len={400} z={2} />
          </>
        ) : null}
        {page === 7 ? (
          <>
            <PakalLid x={-560} y={0} w={560} h={860} rocket={0.6} highlight={0.4} z={1} />
            <Sarcophagus x={200} y={-500} w={600} lid={0.3} glow={1} z={1} />
            <CornPlant x={620} y={-500} h={480} z={2} />
            <CornCob x={820} y={-480} len={160} z={2} />
            <CornCob x={900} y={-480} kind="teosinte" s={1.5} z={2} />
            <Tortilla x={300} y={200} z={2} />
            <WarGodLitter x={300} y={-100} s={0.5} z={2} />
          </>
        ) : null}
        {page === 8 ? (
          <>
            <SpaceStars z={-30} />
            <Globe x={-400} y={0} r={360} lon0={-80} lat0={15} highlight={[-89.5, 21.3]} z={1} />
            <Asteroid x={300} y={300} r={70} z={2} />
            <Dinosaur x={300} y={-500} s={0.6} z={2} />
            <Dinosaur x={700} y={-500} s={0.5} kind="neck" scared z={2} />
            <SurveyPlane x={-500} y={400} s={0.8} z={3} />
          </>
        ) : null}
        {page === 9 ? <MesoMap ppd={70} center={[-90, 18]} maya={1} countries crater={1} cenotes={1} pins={["tikal", "calakmul", "palenque", "copan", "caracol", "mirador", "chichen", "nojpeten"]} highlight={["nojpeten"]} /> : null}
        {page === 10 ? (
          <>
            <LidarReveal x={-380} y={0} w={900} h={620} k={0.7} platform z={1} />
            <LimeKiln x={420} y={-400} z={1} />
            <Stump x={700} y={-460} z={1} />
            <Quetzal x={500} y={200} s={1} z={2} />
          </>
        ) : null}
        {page < 8 ? <Ground w={4000} h={800} y={-560} color="#9ac07a" far="#a8cc88" z={-30} /> : null}
      </Stage>
    </AbsoluteFill>
  );
};
