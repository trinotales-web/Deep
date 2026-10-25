import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, cancelRender, continueRender, delayRender, Sequence, staticFile, useCurrentFrame } from "remotion";
import { FONT_HAND, FONT_LABEL, FONT_TITLE, ip, NARRATION_OFFSET, sec } from "./theme";
import { CaptionStrip, Captions, GrainOverlay, PaperBg, Shot } from "./Stage";
import { MapIntro, TitleScene } from "./scenes/Opening";
import { LandScene } from "./scenes/Land";
import { MapJomon, MapYayoi, Rice, Village, Walk } from "./scenes/Peoples";
import { Finale, Meet, Mix, Peek } from "./scenes/Together";

export const PART1_DURATION = sec(60);

// Scene boundaries in video seconds (narration starts at NARRATION_OFFSET).
export const T = {
  title: 0,
  map1: 3.05,
  land: 8.05,
  map2: 24.95,
  walk: 29.5,
  village: 32.5,
  map3: 35.95,
  rice: 40.5,
  peek: 44.9,
  meet: 46.75,
  mix: 48.95,
  end: 53.05,
  out: 60,
};

const useAssets = () => {
  const [handle] = useState(() => delayRender("Loading fonts and textures"));
  useEffect(() => {
    const fonts = [
      new FontFace(FONT_HAND, `url(${staticFile("japan/fonts/PatrickHand.woff2")})`),
      new FontFace(FONT_LABEL, `url(${staticFile("japan/fonts/GochiHand.woff2")})`),
      new FontFace(FONT_TITLE, `url(${staticFile("japan/fonts/KalamBold.woff2")})`),
    ];
    const images = ["japan/pencil.png", "japan/paper.jpg", "japan/grain.jpg"].map((src) => {
      const img = new Image();
      img.src = staticFile(src);
      return img.decode();
    });
    Promise.all([
      ...fonts.map((ff) =>
        ff.load().then((loaded) => {
          document.fonts.add(loaded);
        }),
      ),
      ...images,
    ])
      .then(() => continueRender(handle))
      .catch((err) => cancelRender(err));
  }, [handle]);
};

export const JapanPart1: React.FC = () => {
  useAssets();
  const f = useCurrentFrame();
  const s = (x: number) => sec(x);
  return (
    <AbsoluteFill style={{ backgroundColor: "#f3ede0" }}>
      <PaperBg />
      <Shot f={f} from={s(T.title)} to={s(T.map1)} xf={0}>
        <TitleScene f={f} />
      </Shot>
      <Shot f={f} from={s(T.map1)} to={s(T.land)}>
        <MapIntro f={f} from={s(T.map1)} />
      </Shot>
      <Shot f={f} from={s(T.land)} to={s(T.map2)}>
        <LandScene f={f} from={s(T.land)} to={s(T.map2)} />
      </Shot>
      <Shot f={f} from={s(T.map2)} to={s(T.walk)}>
        <MapJomon f={f} from={s(T.map2)} to={s(T.walk)} />
      </Shot>
      <Shot f={f} from={s(T.walk)} to={s(T.village)}>
        <Walk f={f} from={s(T.walk)} to={s(T.village)} />
      </Shot>
      <Shot f={f} from={s(T.village)} to={s(T.map3)}>
        <Village f={f} from={s(T.village)} to={s(T.map3)} />
      </Shot>
      <Shot f={f} from={s(T.map3)} to={s(T.rice)}>
        <MapYayoi f={f} from={s(T.map3)} to={s(T.rice)} />
      </Shot>
      <Shot f={f} from={s(T.rice)} to={s(T.peek)}>
        <Rice f={f} from={s(T.rice)} to={s(T.peek)} />
      </Shot>
      <Shot f={f} from={s(T.peek)} to={s(T.meet)}>
        <Peek f={f} from={s(T.peek)} to={s(T.meet)} />
      </Shot>
      <Shot f={f} from={s(T.meet)} to={s(T.mix)}>
        <Meet f={f} from={s(T.meet)} to={s(T.mix)} />
      </Shot>
      <Shot f={f} from={s(T.mix)} to={s(T.end)}>
        <Mix f={f} from={s(T.mix)} to={s(T.end)} />
      </Shot>
      <Shot f={f} from={s(T.end)} to={s(T.out)}>
        <Finale f={f} from={s(T.end)} to={s(T.out)} />
      </Shot>
      <CaptionStrip f={f} show={ip(f, [s(2.4), s(3.0)], [0, 1]) * ip(f, [s(57.2), s(58)], [1, 0])} />
      <Captions f={f} />
      <GrainOverlay />
      <Audio src={staticFile("japan/music_p1.m4a")} />
      <Sequence from={s(NARRATION_OFFSET)} layout="none">
        <Audio src={staticFile("japan/narration_p1.m4a")} />
      </Sequence>
    </AbsoluteFill>
  );
};
