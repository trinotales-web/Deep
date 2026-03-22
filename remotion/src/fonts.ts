import { loadFont } from "@remotion/fonts";
import { staticFile, continueRender, delayRender } from "remotion";

let fontsLoaded = false;
let handle: ReturnType<typeof delayRender> | null = null;

export const loadFonts = () => {
  if (fontsLoaded) return;
  handle = delayRender("Loading fonts");

  Promise.all([
    loadFont({
      family: "IPAGothic",
      url: staticFile("fonts/IPAGothic.ttf"),
      weight: "400",
    }),
    loadFont({
      family: "WabiSerif",
      url: staticFile("fonts/LiberationSerif-Regular.ttf"),
      weight: "400",
      style: "normal",
    }),
    loadFont({
      family: "WabiSerif",
      url: staticFile("fonts/LiberationSerif-Italic.ttf"),
      weight: "400",
      style: "italic",
    }),
  ])
    .then(() => {
      fontsLoaded = true;
      if (handle !== null) {
        continueRender(handle);
        handle = null;
      }
    })
    .catch((err) => {
      console.error("Font loading failed:", err);
      if (handle !== null) {
        continueRender(handle);
        handle = null;
      }
    });
};

export const FONTS = {
  jp: "IPAGothic, sans-serif",
  en: "WabiSerif, serif",
};
