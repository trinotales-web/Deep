import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// Three.js needs WebGL during headless rendering.
Config.setChromiumOpenGlRenderer("angle");
