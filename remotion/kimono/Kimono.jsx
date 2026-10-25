import React from "react";
import tl from "./timeline.json";
import { Story } from "../storybook/Story";
import { SceneDisplay, SceneFit, SceneLong, SceneShort, SceneBigger, SceneHouse, SceneCar, SceneLifestyle, SceneChoice } from "./scenes";

const SCENES = [
  ["display", SceneDisplay],
  ["fit", SceneFit],
  ["long", SceneLong],
  ["short", SceneShort],
  ["bigger", SceneBigger],
  ["house", SceneHouse],
  ["car", SceneCar],
  ["lifestyle", SceneLifestyle],
  ["choice", SceneChoice],
];

export const KimonoStory = () => <Story timeline={tl} scenes={SCENES} music="kimono/music.m4a" />;
