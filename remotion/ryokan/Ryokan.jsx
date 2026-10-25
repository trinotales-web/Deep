import React from "react";
import tl from "./timeline.json";
import { Story } from "../storybook/Story";
import { SceneMountain, SceneNothing, SceneNight, SceneMoon, SceneLightness } from "./scenes";

const SCENES = [
  ["mountain", SceneMountain],
  ["nothing", SceneNothing],
  ["night", SceneNight],
  ["moon", SceneMoon],
  ["lightness", SceneLightness],
];

export const RyokanStory = () => <Story timeline={tl} scenes={SCENES} music="ryokan/music.m4a" />;
