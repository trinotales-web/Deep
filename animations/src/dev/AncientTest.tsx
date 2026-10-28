import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Stage, Spear, Bow, Scroll, WickerShield } from "../kit";
import { Character, poses } from "../kit/character";
import { Sky, Cloud, Mountains, Sea, GreekTemple, RockHill, Barricade, Trireme, City, OliveTree } from "../kit/env";
import { DEFENDERS, TEMPLE_KEEPER, PERSIAN, XERXES, PYTHIA, GENERAL, CITIZEN } from "../episodes/woodenwall/cast";

// Asset check sheet for the ancient-world kit (1080x1920).
export const AncientTest: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage light={{ dir: [-0.8, 0.6] }}>
        <Sky w={1200} h={2000} top="#5fa8dc" bottom="#f3e3c0" />
        <Cloud x={-260} y={820} w={340} seed={3} />
        <Mountains w={1400} y={420} color="#a9b6c8" peaks={[[-500, 120], [-200, 200], [150, 140], [450, 210]]} />
        <City w={1300} y={420} scale={0.45} z={1} />
        <RockHill w={900} h={300} y={420} z={2} />
        <GreekTemple w={420} colH={150} cols={6} y={718} z={3} />
        <Barricade w={420} h={130} y={718} x={-60} s={0.6} burn={0.8} z={4} />
        <OliveTree x={430} y={420} h={220} z={5} />
        <Sea w={1200} h={600} y={-640} z={6} />
        <Trireme x={0} y={-760} len={700} z={7} />
        <Trireme x={300} y={-900} len={500} side="persian" sink={0.5} crack={1} sail={false} z={8} />
        {[
          { d: DEFENDERS[0], p: poses.idle(frame) },
          { d: DEFENDERS[1], p: poses.idle(frame, 1) },
          { d: TEMPLE_KEEPER, p: poses.idle(frame, 2), holdF: <Scroll s={0.5} /> },
          { d: GENERAL, p: poses.point(frame) },
        ].map(({ d, p, holdF }, i) => (
          <Character key={i} {...d} x={-390 + i * 260} y={-20} s={0.55} z={10 + i} pose={p} holdF={holdF} expression={{ eyes: "open", mouth: "smile" }} />
        ))}
        {[
          { d: PERSIAN(0), holdF: <Spear rot={-0.2} s={0.9} /> },
          { d: PERSIAN(1), holdF: <Bow rot={1.4} draw={0.6} arrow fire /> },
          { d: XERXES },
          { d: PYTHIA },
          { d: CITIZEN(1) },
        ].map(({ d, holdF }, i) => (
          <Character
            key={i}
            {...d}
            x={-420 + i * 210}
            y={-400}
            s={0.5}
            z={20 + i}
            facing={i < 2 ? -1 : 1}
            pose={i === 1 ? { armF: [1.45, 0], armB: [-1.2, 1.4] } : poses.idle(frame, i)}
            holdF={holdF}
            holdB={i === 0 ? <WickerShield s={0.7} /> : undefined}
            expression={{ eyes: i === 2 ? "half" : i === 3 ? "closed" : "angry", mouth: i === 2 ? "smirk" : "flat" }}
          />
        ))}
      </Stage>
    </AbsoluteFill>
  );
};
