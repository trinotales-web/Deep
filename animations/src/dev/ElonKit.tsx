import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Stage, X } from "../kit";
import { Character, poses } from "../kit/character";
import {
  Sky, Falcon1, Falcon9, FalconHeavy, StarshipStack, SuperHeavy, LaunchTower, Dragon, SpaceStation, StarlinkSat, Planet, Fireball, Exhaust, LandingPad, LaunchPad, SpaceBack,
  Roadster, SedanEV, Cybertruck, Supercar, Robotaxi, Airliner, SmallPlane, Wheelchair,
  Phone, OldPhone, Monitor, HomeComputer, PostCard, LineChart, Bars, Pie, Banknote, Cash, MoneyBag, GoldCoin, Cheque, Trophy, Medal, Gavel, Sink, Chainsaw, Book, BookRow, Magazine, Mic,
  Bird, XMark, Brain, Implant, Humanoid, ChessBoard, Dish, BallotBox, Doc, Box, Bell, Lectern, HospitalBed, IVStand, HeartMonitor, BunkBed, Bookshelf, OfficeChair, Futon, BatteryCell,
  BatteryGrid, Greenhouse, XmasTree, Mosquito, DogeBadge, Acacia, Jacaranda, WorldMap, CITY, Room, Window, Skyline, StageSet, FactorySet, RobotArm, MissionControlSet, CourtroomSet,
  OvalOfficeSet, StoreFront, CampusBuilding, House, TropicalIsland, SavannaSet, MoscowSet, ConcreteStairs, Sea,
} from "../kit/env";
import * as C from "../episodes/elon/cast";

/** Elon kit review sheets (dev only). */
export const ElonKit: React.FC<{ page?: number }> = ({ page = 0 }) => {
  const frame = useCurrentFrame();
  const row = (list: React.ComponentProps<typeof Character>[], y: number, s: number) =>
    list.map((c, i) => (
      <Character key={i} {...c} x={-860 + i * (1720 / Math.max(1, list.length - 1))} y={y} s={s} look={0.5} expression={{ eyes: "open", mouth: "smile" }} pose={poses.idle(frame, i)} />
    ));
  const grid = (items: React.ReactNode[], cols: number, cw = 1800 / cols, rh = 330, y0 = 330) =>
    items.map((it, i) => (
      <X key={i} x={-900 + cw / 2 + (i % cols) * cw} y={y0 - Math.floor(i / cols) * rh}>
        {it}
      </X>
    ));
  return (
    <AbsoluteFill style={{ backgroundColor: "#cfe6f2" }}>
      <Stage camera={{ zoom: 1 }} light={{ dir: [-0.6, 0.8] }} vignette={0.1}>
        <Sky w={4000} h={3000} top="#8ec9ee" bottom="#e8f4f8" z={-40} />
        {page === 0 ? (
          <>
            {row([C.ELON_KID, C.ELON_SCHOOL, C.ELON_TEEN, C.ELON_YOUNG, C.ELON_ZIP2, C.ELON_SUIT, C.ELON_2008, C.ELON_TEE, C.ELON_X(false), C.ELON_X(true), C.ELON_FORMAL] as never, 40, 0.62)}
            {row([C.MAYE, C.ERROL, C.KIMBAL, C.THIEL, C.JUSTINE, C.SUIT(0), C.SUIT(1), C.SUIT(2), C.SUIT(3), C.EBERHARD, C.TARPENNING] as never, -500, 0.62)}
          </>
        ) : null}
        {page === 1 ? (
          <>
            {row([C.DESIGNER, C.NOLAND, C.TRUMP, C.MILEI, C.ENGINEER(0), C.ENGINEER(1), C.ENGINEER(2), C.WORKER(0), C.WORKER(1), C.STAFF(0), C.STAFF(1)] as never, 40, 0.62)}
            {row([C.PERSON(0), C.PERSON(1), C.PERSON(3), C.PERSON(5), C.BULLY(0), C.BULLY(1), C.DOCTOR, C.NURSE, C.RUSSIAN(0), C.ASTRONAUT(0), C.BACKPACKER(0)] as never, -500, 0.62)}
          </>
        ) : null}
        {page === 2 ? (
          <X y={-500}>
            <Falcon1 x={-850} h={800} thrust={1} />
            <Falcon9 x={-620} h={1000} />
            <Falcon9 x={-380} h={700} stage1 legs={1} fins={1} soot={0.8} />
            <FalconHeavy x={-80} h={1000} thrust={0.6} />
            <StarshipStack x={250} h={1000} />
            <LaunchTower x={760} h={1000} armY={620} close={0.6} armLen={300} />
            <SuperHeavy x={560} y={250} h={520} thrust={0.7} />
          </X>
        ) : null}
        {page === 3 ? (
          <>
            <SpaceBack />
            <SpaceStation x={-450} y={250} s={0.45} />
            <StarlinkSat x={420} y={380} s={0.8} />
            <Planet kind="mars" x={-700} y={-300} r={160} />
            <Planet kind="moon" x={-300} y={-300} r={140} />
            <Fireball t={0.35} x={150} y={-280} s={0.6} />
            <Dragon x={600} y={-150} s={0.6} trunk wings={1} />
            <LandingPad x={0} y={-460} r={300} />
            <LaunchPad x={650} y={-420} w={400} tower={300} />
            <Exhaust x={850} y={200} len={300} w={70} />
          </>
        ) : null}
        {page === 4 ? (
          <>
            {grid([
              <Roadster key="a" s={0.55} spin={frame * 0.2} />, <SedanEV key="b" s={0.5} />, <SedanEV key="c" s={0.5} small color="#c8262f" />,
              <Cybertruck key="d" s={0.5} crack={1} crack2={0.6} />, <Supercar key="e" s={0.5} wreck={0.8} />, <Robotaxi key="f" s={0.55} />,
              <Airliner key="g" s={0.35} y={100} />, <SmallPlane key="h" s={0.55} prop={frame} />, <X key="i"><Wheelchair s={0.9} /><Character {...C.NOLAND} x={-10} y={96 * 0.9} s={0.5} pose={poses.sit(frame)} /></X>,
            ], 3, 600, 360, 280)}
          </>
        ) : null}
        {page === 5 ? (
          <>
            {grid([
              <Phone key="a" w={120} y={-60}><PostCard w={100} h={70} s={1} /></Phone>, <OldPhone key="b" s={0.8} lit={1} />, <Monitor key="c" w={300} h={180} />, <HomeComputer key="d" s={0.45} y={-100} />,
              <PostCard key="e" w={380} h={150} lines={2} likes={1} />, <LineChart key="f" w={380} h={240} values={[0.1, 0.15, 0.12, 0.3, 0.45, 0.4, 0.7, 0.9]} k={0.8} />,
              <Bars key="g" w={300} h={200} values={[0.9, 0.5, 0.2]} y={-100} />, <Pie key="h" r={110} slices={[[0.03, "#fe5649"], [0.97, "#d8c9a8"]]} pop={0} />,
              <Banknote key="i" />, <Cash key="j" y={-60} />, <MoneyBag key="k" s={0.6} y={-120} />, <GoldCoin key="l" />, <Cheque key="m" w={380} />,
            ], 5, 360, 330, 330)}
          </>
        ) : null}
        {page === 6 ? (
          <>
            {grid([
              <Trophy key="a" s={0.5} y={-80} />, <Medal key="b" y={60} />, <Gavel key="c" />, <Sink key="d" s={0.8} />, <Chainsaw key="e" s={0.45} x={-60} />, <Book key="f" w={150} h={210} />,
              <BookRow key="g" x={-150} y={-100} h={160} n={7} gold />, <Magazine key="h" w={150} />, <Mic key="i" />, <Bird key="j" s={0.8} />, <XMark key="k" size={160} color="#2a2a30" />,
              <Brain key="l" s={0.7} />, <Implant key="m" glow={1} />, <Humanoid key="n" s={0.35} y={-130} armF={[2.4, 0.4]} />, <ChessBoard key="o" w={260} move={0.5} />, <Dish key="p" s={0.6} y={-100} signal={1} />,
              <BallotBox key="q" s={0.6} y={-100} drop={0.4} />, <Doc key="r" w={150} />, <Box key="s" s={0.7} y={-60} />, <Bell key="t" s={0.45} y={-100} ring={1} />, <Lectern key="u" s={0.45} y={-100} />,
            ], 7, 1800 / 7, 330, 330)}
          </>
        ) : null}
        {page === 7 ? (
          <>
            {grid([
              <HospitalBed key="a" s={0.3} y={-100} />, <IVStand key="b" s={0.35} y={-110} />, <HeartMonitor key="c" s={0.7} />, <BunkBed key="d" s={0.3} y={-100} />, <Bookshelf key="e" s={0.3} y={-110} />,
              <OfficeChair key="f" s={0.6} y={-100} />, <Futon key="g" s={0.4} y={-60} />, <BatteryCell key="h" s={0.7} y={-80} charge={1} />, <BatteryGrid key="i" s={0.4} />, <Greenhouse key="j" s={0.5} y={-80} />,
              <XmasTree key="k" s={0.35} y={-100} />, <Mosquito key="l" s={1.2} />, <DogeBadge key="m" r={100} />, <Acacia key="n" s={0.45} y={-100} />, <Jacaranda key="o" s={0.3} y={-110} />,
            ], 5, 360, 330, 330)}
          </>
        ) : null}
        {page === 8 ? (
          <WorldMap
            ppd={5.2}
            center={[0, 15]}
            w={2000}
            h={1200}
            tint={{ "South Africa": "#e2702a", Canada: "#c8262f", "United States of America": "#3a6ab0" }}
            routes={[{ from: CITY.pretoria, to: CITY.montreal, k: 0.8, plane: true }, { from: CITY.hawthorne, to: CITY.kwajalein, k: 1, arc: 0.1 }]}
            pins={[{ at: CITY.pretoria }, { at: CITY.kwajalein, glow: true }, { at: CITY.moscow, s: 0.8 }]}
          />
        ) : null}
        {page === 9 ? (
          <>
            <X x={-480} y={-300} s={0.42}>
              <Room wall="#d8c9a8"><Window x={300} y={1100} /></Room>
            </X>
            <X x={480} y={-300} s={0.42}>
              <Skyline night />
            </X>
            <X x={0} y={240} s={0.3}>
              <StageSet screen="#1a1a22" />
            </X>
          </>
        ) : null}
        {page === 10 ? (
          <>
            <X x={-480} y={-250} s={0.42}>
              <FactorySet><RobotArm x={-300} spark={1} /><SedanEV x={500} /></FactorySet>
            </X>
            <X x={480} y={-250} s={0.42}>
              <MissionControlSet />
            </X>
          </>
        ) : null}
        {page === 11 ? (
          <>
            <X x={-480} y={-250} s={0.42}>
              <CourtroomSet />
            </X>
            <X x={480} y={-250} s={0.42}>
              <OvalOfficeSet />
            </X>
          </>
        ) : null}
        {page === 12 ? (
          <>
            <StoreFront x={-600} y={-450} s={0.3}><SedanEV s={1} /></StoreFront>
            <CampusBuilding x={0} y={-450} s={0.18} kind="brick" />
            <CampusBuilding x={500} y={-450} s={0.18} kind="sandstone" />
            <CampusBuilding x={0} y={50} s={0.18} kind="stone" />
            <House x={550} y={50} s={0.3} />
          </>
        ) : null}
        {page === 13 ? (
          <>
            <X x={-480} y={-50} s={0.4}>
              <Sea w={2400} h={800} y={-400} />
              <TropicalIsland />
            </X>
            <X x={480} y={-300} s={0.42}>
              <SavannaSet><Acacia x={300} /></SavannaSet>
            </X>
            <X x={-480} y={-500} s={0.3}>
              <MoscowSet />
            </X>
            <ConcreteStairs x={600} y={150} s={0.5} />
          </>
        ) : null}
      </Stage>
    </AbsoluteFill>
  );
};
