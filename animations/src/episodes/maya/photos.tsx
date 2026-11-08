import { photoShot } from "../../kit/photo";

// Real photographs and artworks supplied by the user (kept out of git in
// public/photos/maya). Times are narration seconds on maya-1 / maya-2.

const REAL = "REAL PHOTO";
const ART = "ANCIENT ART";
const P = (f: string) => `photos/maya/${f}`;

// ── first video ──
export const DuranFall = photoShot({
  src: P("duran.jpg"), w: 1600, h: 1210, mode: "full", from: [1.0, 0.55, 0.45], to: [1.22, 0.7, 0.5],
  tag: "16TH-CENTURY PAINTING", label: "FELL IN 2 YEARS", sub: "TENOCHTITLAN", labelAt: 34.5,
});
export const Teosinte = photoShot({ src: P("teosinte.jpg"), w: 706, h: 435, mode: "card", rot: -1.2, tag: REAL, label: "TEOSINTE", sub: "THE WILD GRASS", labelAt: 100.0 });
export const Corn = photoShot({ src: P("corn.jpg"), w: 678, h: 452, mode: "card", rot: 1.0, tag: REAL, label: "CORN", labelAt: 103.5 });
export const PopolVuhBook = photoShot({ src: P("popol-vuh.jpg"), w: 451, h: 680, mode: "card", rot: -1.5, maxScale: 1.15, tag: "THE BOOK TODAY", label: "THE POPOL VUH", sub: "THE MAYA HOLY BOOK", labelAt: 108.4 });
export const AguadaAerial = photoShot({ src: P("aguada-aerial.jpg"), w: 960, h: 360, mode: "card", rot: 0.8, tag: REAL, label: "AGUADA FÉNIX", sub: "TABASCO, MEXICO", labelAt: 146.95 });
export const AguadaLidar = photoShot({
  src: P("aguada-lidar.jpg"), w: 2127, h: 1185, crop: [450, 0, 2127, 1185], mode: "full", from: [1.0, 0.5, 0.5], to: [1.25, 0.7, 0.45],
  tag: "LIDAR SCAN", label: "1.4 KM LONG", labelAt: 150.3,
});
export const Bonampak = photoShot({ src: P("bonampak.jpg"), w: 666, h: 461, mode: "card", rot: -1.0, tag: "MURAL (COPY)", label: "EACH WITH ITS OWN HOLY KING", sub: "BONAMPAK MURAL", labelAt: 228.0 });
export const VaseCourt = photoShot({ src: P("vase-court.jpg"), w: 873, h: 351, mode: "card", rot: 1.0, tag: ART, label: "HOLY LORD", sub: "PAINTED MAYA VASE", labelAt: 243.9 });
export const VaseSerpent = photoShot({ src: P("vase-serpent.jpg"), w: 500, h: 204, mode: "card", rot: -1.0, maxScale: 2.6, tag: ART, label: "THE VISION SERPENT", sub: "PAINTED MAYA VASE", labelAt: 249.6 });
export const GlyphPanel = photoShot({ src: P("glyph-panel.jpg"), w: 600, h: 402, mode: "card", rot: -0.8, tag: REAL, label: "MAYA HIEROGLYPHS", labelAt: 270.8 });
export const GlyphWords = photoShot({ src: P("glyph-words.jpg"), w: 480, h: 380, mode: "card", rot: 0.8, maxScale: 1.9, tag: "MAYA SIGNS", label: "SIGNS FOR WHOLE WORDS", labelAt: 274.6 });
export const PalenqueGlyphs = photoShot({ src: P("palenque-glyphs.jpg"), w: 896, h: 624, mode: "card", rot: -0.8, tag: REAL, label: "SIGNS FOR SOUNDS", sub: "PALENQUE", labelAt: 276.2 });
export const StelaStone = photoShot({ src: P("stela.jpg"), w: 500, h: 966, mode: "card", rot: -1.0, maxScale: 0.8, tag: REAL, label: "ON STONE", sub: "A MAYA STELA", labelAt: 278.5 });
export const DresdenBooks = photoShot({ src: P("dresden.jpg"), w: 900, h: 506, mode: "card", rot: 1.0, tag: REAL, label: "FOLDING BOOKS", sub: "THE DRESDEN CODEX", labelAt: 280.3 });
export const CalendarCarving = photoShot({ src: P("calendar-carving.jpg"), w: 678, h: 452, mode: "card", rot: -1.0, tag: "CARVING", label: "OBSESSED WITH TIME", labelAt: 296.2 });
export const CalendarWheels = photoShot({ src: P("calendar-wheels.jpg"), w: 730, h: 420, mode: "card", rot: 1.0, tag: "ILLUSTRATION", label: "260 + 365 DAYS", labelAt: 302.0 });
export const SunStone = photoShot({ src: P("sun-stone.jpg"), w: 553, h: 554, mode: "card", rot: -1.0, maxScale: 1.25, tag: REAL, label: "THE AZTEC SUN STONE", sub: "OFTEN MISTAKEN FOR A MAYA CALENDAR", labelAt: 311.0 });
export const XibalbaArt = photoShot({ src: P("codex-art.jpg"), w: 548, h: 343, mode: "card", rot: 1.0, tag: "MODERN ART", label: "XIBALBA", sub: "THE UNDERWORLD", labelAt: 356.3 });
export const TikalPhoto = photoShot({ src: P("tikal.jpg"), w: 1170, h: 780, mode: "card", rot: -0.8, maxScale: 1.3, tag: REAL, label: "TIKAL", sub: "GUATEMALA", labelAt: 402.1 });
export const CalakmulPhoto = photoShot({ src: P("calakmul.jpg"), w: 960, h: 636, mode: "card", rot: 0.8, tag: REAL, label: "CALAKMUL", sub: "MEXICO", labelAt: 404.9 });
export const SnakeGlyph = photoShot({ src: P("snake-glyph.jpg"), w: 300, h: 343, mode: "card", rot: -1.0, maxScale: 1.9, tag: "EMBLEM GLYPH", label: "THE SNAKE KINGDOM", labelAt: 405.95 });
export const PharaohCoffins = photoShot({
  src: P("egypt-coffin.jpg"), w: 554, h: 554, cardsAt: 464.9, label: "BURIED LIKE A PHARAOH?", labelAt: 465.3, tag: "EGYPTIAN COFFINS",
  cards: [
    { src: P("egypt-coffin.jpg"), w: 554, h: 554, crop: [130, 0, 424, 554], rot: -1.5 },
    { src: P("egypt-coffin-painted.jpg"), w: 2592, h: 3888, crop: [300, 200, 2300, 3888], rot: 1.0 },
    { src: P("egypt-coffin-inside.jpg"), w: 391, h: 783, rot: -1.0 },
  ],
});

// ── second video ──
export const DuranFall2 = photoShot({
  src: P("duran.jpg"), w: 1600, h: 1210, mode: "full", from: [1.0, 0.55, 0.45], to: [1.22, 0.7, 0.5],
  tag: "16TH-CENTURY PAINTING", label: "THE WHOLE EMPIRE FALLS", sub: "TENOCHTITLAN, 1521", labelAt: 196.4,
});
export const ManiConvent = photoShot({ src: P("mani.jpg"), w: 1280, h: 960, mode: "card", rot: -0.8, maxScale: 1.4, tag: REAL, label: "MANÍ, YUCATÁN", sub: "THE CONVENT TODAY", labelAt: 276.6 });
export const Figurines = photoShot({
  src: P("figurines.jpg"), w: 569, h: 539, cardsAt: 277.7, tag: REAL, label: "THOUSANDS OF IDOLS", sub: "MAYA CLAY FIGURES", labelAt: 278.2,
  cards: [
    { src: P("figurine.jpg"), w: 341, h: 600, rot: -1.5 },
    { src: P("figurines.jpg"), w: 569, h: 539, rot: 1.2 },
  ],
});
export const FourCodices = photoShot({
  src: P("dresden.jpg"), w: 900, h: 506, cardsAt: 289.6, tag: REAL, label: "ONLY 4 MAYA BOOKS SURVIVE", labelAt: 290.3,
  cards: [
    { src: P("dresden.jpg"), w: 900, h: 506, rot: -1.2, caption: "DRESDEN CODEX" },
    { src: P("madrid.jpg"), w: 1289, h: 957, crop: [180, 0, 1110, 957], rot: 1.0, caption: "MADRID CODEX" },
  ],
});
export const GlyphWords2 = photoShot({ src: P("glyph-words.jpg"), w: 480, h: 380, mode: "card", rot: 0.8, maxScale: 1.9, tag: "MAYA SIGNS", label: "MAYA WRITING UNLOCKED", labelAt: 314.3 });
export const Protest = photoShot({ src: P("protest.jpg"), w: 580, h: 390, mode: "card", rot: -1.0, tag: REAL, label: "GUATEMALA'S CIVIL WAR", sub: "1960 – 1996", labelAt: 372.5 });
export const Reburial = photoShot({
  src: P("civil-war.jpg"), w: 2246, h: 3418, crop: [0, 0, 2246, 1480], mode: "full", from: [1.0, 0.5, 0.6], to: [1.15, 0.45, 0.62],
  tag: REAL, label: "HUNDREDS OF MAYA VILLAGES ATTACKED", labelAt: 374.3,
});
export const MemoryOfSilence = photoShot({ src: P("memory-of-silence.jpg"), w: 667, h: 1000, mode: "card", rot: -1.2, maxScale: 0.8, tag: "THE REPORT", label: "TRUTH COMMISSION", sub: "1999", labelAt: 376.3 });
export const Memorial = photoShot({ src: P("memorial.jpg"), w: 500, h: 375, mode: "card", rot: 1.0, tag: REAL, label: "“ACTS OF GENOCIDE”", sub: "AGAINST MAYA PEOPLE", labelAt: 378.5 });
export const TikalSecrets = photoShot({ src: P("tikal.jpg"), w: 1170, h: 780, mode: "card", rot: 0.8, maxScale: 1.3, tag: REAL, label: "STILL HIDING SECRETS", labelAt: 382.5 });
export const Bonampak2 = photoShot({ src: P("bonampak.jpg"), w: 666, h: 461, mode: "card", rot: -1.0, tag: "MURAL (COPY)", label: "NEVER ONE KING", labelAt: 410.8 });
export const CalendarWheels2 = photoShot({ src: P("calendar-wheels.jpg"), w: 730, h: 420, mode: "card", rot: 1.0, tag: "ILLUSTRATION", label: "THE 260-DAY CALENDAR", labelAt: 437.8 });
