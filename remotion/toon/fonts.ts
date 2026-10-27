import { useEffect, useState } from "react";
import { loadFont } from "@remotion/fonts";
import { staticFile, useDelayRender } from "remotion";

export const FONT = "Montserrat";

let ready: Promise<unknown> | null = null;
const loadFonts = () => {
  ready ??= Promise.all([
    loadFont({ family: FONT, url: staticFile("fonts/montserrat-latin-800-normal.woff2"), weight: "800" }),
    loadFont({ family: FONT, url: staticFile("fonts/montserrat-latin-900-normal.woff2"), weight: "900" }),
  ]);
  return ready;
};

/** Blocks rendering until the caption fonts are loaded; needed before painting text onto canvases. */
export const useFontsReady = () => {
  const [ok, setOk] = useState(false);
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender("Loading Montserrat"));
  useEffect(() => {
    loadFonts()
      .then(() => {
        setOk(true);
        continueRender(handle);
      })
      .catch((err) => cancelRender(err));
  }, [handle, continueRender, cancelRender]);
  return ok;
};
