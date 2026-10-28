import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// Three.js needs WebGL during headless rendering.
Config.setChromiumOpenGlRenderer("angle");
// Big crowd shots can take a while to mount on software GL (cloud containers).
Config.setDelayRenderTimeoutInMilliseconds(240000);
