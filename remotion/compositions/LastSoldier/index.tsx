import { AbsoluteFill } from "remotion";
import { ShortsCaptions } from "../../components/ShortsCaptions";
import { useFontsReady } from "../../toon/fonts";
import { SceneJungle } from "./SceneJungle";

/** 4-second style test: vertical history short in the reference cartoon style. */
export const LastSoldier: React.FC = () => {
  const fontsReady = useFontsReady();
  return (
    <AbsoluteFill style={{ background: "#f3dcae" }}>
      <SceneJungle />
      {fontsReady ? <ShortsCaptions src="animations/last-soldier/captions.json" /> : null}
    </AbsoluteFill>
  );
};
