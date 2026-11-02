import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Stage } from "../kit";
import { Character, poses } from "../kit/character";
import {
  Sky, RedPillar, Lantern, QinThrone, TombWall, StoneFloor, WallTorch, OilLamp, CrossbowTrap, TreasureChest, JadeDisc, Ding, Jar, Coin, MercuryRiver,
  StarCeiling, ChineseHall, StoneGate, BurialMound, MoundSection, Horse, ImperialCarriage, FishCart, AncientShip, TerracottaPit, ClaySoldier, Dagger, Jian,
  BambooSlips, MapScroll, MedicineBag, MercuryBowl, ClayHead, DigWell, PersimmonTree, ChinaMap, RoundTree, Ground,
} from "../kit/env";
import {
  EMPEROR, BOY_KING, HUHAI, FUSU, WORKER, OFFICIAL, ZHAO_GAO, GUARD, JING_KE, COURT_DOCTOR, XU_FU, CHILD, SIMA_QIAN, WIFE, VILLAGER, REBEL, FARMER,
  ARCHAEOLOGIST, SCIENTIST, TOURIST, TERRACOTTA,
} from "../episodes/qintomb/cast";

/** Qin tomb kit review sheets (dev only). */
export const QinKit: React.FC<{ page?: number }> = ({ page = 0 }) => {
  const frame = useCurrentFrame();
  const row = (list: React.ComponentProps<typeof Character>[], y: number, s: number) =>
    list.map((c, i) => <Character key={i} {...c} x={-860 + i * (1720 / Math.max(1, list.length - 1))} y={y} s={s} look={0.5} expression={{ eyes: "open", mouth: "smile" }} pose={poses.idle(frame, i)} />);
  return (
    <AbsoluteFill style={{ backgroundColor: "#cfe6f2" }}>
      <Stage camera={{ zoom: 1 }} light={{ dir: [-0.6, 0.8] }} vignette={0.1}>
        <Sky w={4000} h={3000} top="#8ec9ee" bottom="#e8f4f8" z={-40} />
        {page === 0 ? (
          <>
            {row([EMPEROR, BOY_KING, HUHAI, FUSU, WORKER(0), WORKER(1), WORKER(2), OFFICIAL(0), OFFICIAL(1), ZHAO_GAO, GUARD(0)] as never, 60, 0.62)}
            {row([JING_KE, COURT_DOCTOR, XU_FU, CHILD(0), SIMA_QIAN, WIFE(0), WIFE(1), VILLAGER(0), REBEL(0), FARMER(0), FARMER(1)] as never, -500, 0.62)}
          </>
        ) : null}
        {page === 1 ? (
          <>
            {row([ARCHAEOLOGIST(0), ARCHAEOLOGIST(1), SCIENTIST(0), TOURIST(0), TOURIST(1), TERRACOTTA(0), TERRACOTTA(1, true)] as never, 40, 0.75)}
            <TerracottaPit y={-520} w={1800} rows={3} cols={8} paint={0} s={0.6} />
          </>
        ) : null}
        {page === 2 ? (
          <>
            <TombWall y={-200} w={1000} h={700} x={-460} z={-10} />
            <StoneFloor y={-200} w={1000} h={340} x={-460} z={-9} />
            <WallTorch x={-800} y={200} z={-5} />
            <CrossbowTrap x={-700} y={-260} fire={0.3} />
            <TreasureChest x={-300} y={-300} />
            <JadeDisc x={-150} y={-200} />
            <Ding x={-60} y={-320} />
            <Jar x={-850} y={-480} />
            <Coin x={-500} y={-450} />
            <RedPillar x={160} y={-520} h={700} />
            <Lantern x={300} y={540} />
            <QinThrone x={620} y={-520} s={0.7} />
            <MercuryRiver x={-460} y={400} w={800} />
            <StarCeiling x={420} y={400} w={800} h={240} />
            <OilLamp x={300} y={-80} />
            <StoneGate x={-300} y={70} s={0.4} drop={0.5} />
          </>
        ) : null}
        {page === 3 ? (
          <>
            <Ground w={4000} h={1200} y={-80} color="#b9a27a" z={-30} />
            <BurialMound x={-560} y={-80} w={700} h={300} stage="build" />
            <BurialMound x={260} y={-80} w={700} h={320} stage="done" />
            <RoundTree x={760} y={-80} />
            <MoundSection x={-400} y={540} w={800} depth={420} s={0.8} />
            <ChineseHall x={600} y={240} tiers={2} />
          </>
        ) : null}
        {page === 4 ? (
          <>
            <Ground w={4000} h={1200} y={-160} color="#b9a27a" z={-30} />
            <ImperialCarriage x={-700} y={-160} s={0.7} horses={2} walk={1} />
            <Horse x={500} y={-160} s={0.7} walk={1} />
            <FishCart x={-420} y={-520} smell={1} />
            <AncientShip x={300} y={280} len={500} />
            <DigWell x={500} y={-520} s={0.6} pull={0.5} />
            <PersimmonTree x={850} y={-540} h={400} />
            <ClayHead x={0} y={-380} />
            <Dagger x={-150} y={200} />
            <Jian x={-80} y={100} />
            <BambooSlips x={-860} y={300} open={0.8} n={8} s={0.8} />
            <MapScroll x={-560} y={350} open={1} dagger s={0.6} />
            <MedicineBag x={60} y={350} />
            <MercuryBowl x={-300} y={150} />
            <MercuryBowl x={-300} y={20} pills />
            <ClaySoldier x={160} y={-500} paint={1} s={0.8} />
          </>
        ) : null}
        {page === 5 ? <ChinaMap ppd={44} center={[113, 34]} kingdoms conquered={["han"]} route={[[108.7, 34.35], [115.2, 37.4], [119.6, 35.6]]} routeK={0.7} dots={[[109.27, 34.38]]} /> : null}
      </Stage>
    </AbsoluteFill>
  );
};
