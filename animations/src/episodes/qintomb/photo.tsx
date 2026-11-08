import { photoShot } from "../../kit/photo";

const REAL = "REAL PHOTO";

export const CarriagePhoto = photoShot({
  src: "photos/qin/bronze-carriage.jpg", w: 2560, h: 1610, mode: "full",
  from: [1.0, 0.5, 0.5], to: [1.35, 0.42, 0.24], tag: REAL, label: "THE EMPEROR'S CARRIAGE", sub: "BRONZE MODEL FROM THE TOMB", labelAt: 27.9,
});
export const CrossbowPhoto = photoShot({
  src: "photos/qin/crossbows-illustration.jpg", w: 575, h: 533, mode: "card", rot: 1.2,
  from: [1.0, 0.5, 0.5], to: [1.08, 0.5, 0.5], tag: "ARTIST'S IMPRESSION",
});
export const AerialPhoto = photoShot({
  src: "photos/qin/mausoleum-collage.jpg", w: 400, h: 304, crop: [0, 0, 400, 150], mode: "card",
  tag: REAL, label: "76 M", sub: "THE MOUND TODAY", labelAt: 221.6,
});
export const ExcavationPhoto = photoShot({
  src: "photos/qin/excavation-1974.png", w: 945, h: 747, mode: "card", rot: -1.5,
  tag: REAL, label: "1974", labelAt: 103.2,
});
export const PitPhoto = photoShot({
  src: "photos/qin/pit-1.jpg", w: 1600, h: 1274, mode: "full",
  from: [1.0, 0.5, 0.4], to: [1.28, 0.5, 0.62], tag: REAL, label: "8,000+", sub: "PIT 1", labelAt: 107.1,
});
export const ArchersPhoto = photoShot({
  src: "photos/qin/kneeling-archers.jpg", w: 700, h: 467, mode: "card", rot: 1.0,
  tag: REAL, label: "ARCHERS", labelAt: 109.4,
});
export const FacesPhoto = photoShot({
  src: "photos/qin/warriors-horses.jpg", w: 1024, h: 824, mode: "card", rot: -1.0,
  tag: REAL, label: "EVERY FACE IS DIFFERENT", labelAt: 114.6,
});
export const BrokenPhoto = photoShot({
  src: "photos/qin/broken-warrior.jpg", w: 1500, h: 1000, mode: "full",
  from: [1.0, 0.5, 0.5], to: [1.22, 0.7, 0.62], tag: REAL, label: "SMASHED AND BURNED", labelAt: 135.3,
});
export const MoundPhoto = photoShot({
  src: "photos/qin/mound-today.jpg", w: 768, h: 413, mode: "card", rot: -0.8,
  tag: REAL, label: "NEVER OPENED", labelKind: "stamp", labelAt: 146.3,
});
export const ReconstructionPhoto = photoShot({
  src: "photos/qin/mound-reconstruction.jpg", w: 480, h: 270, mode: "card", rot: 0.8, maxScale: 2.7,
  from: [1.0, 0.5, 0.5], to: [1.1, 0.5, 0.5], tag: "3D RECONSTRUCTION", label: "A HUGE MAN-MADE HILL", labelAt: 209.5,
});
