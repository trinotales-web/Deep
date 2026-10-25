import { useEffect, useState } from "react";
import { cancelRender, continueRender, delayRender, staticFile } from "remotion";
import { FONT_HAND, FONT_LABEL, FONT_TITLE } from "./theme";

/** Loads fonts and textures before the first frame renders. */
export const useJapanAssets = () => {
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
