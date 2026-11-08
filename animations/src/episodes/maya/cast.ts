import type { CharacterProps } from "../../kit/character";

// Character designs for the Maya story (Preclassic to the Spanish conquest, plus
// modern scientists and Maya families). Classic Maya colors: white cotton,
// Maya blue, cochineal red, ochre, jade green; long black hair tied up.
type Design = Omit<CharacterProps, "pose" | "expression">;

export const JADE = "#3fa07a";
export const MAYA_BLUE = "#3a9ac9";
export const MAYA_RED = "#c0392b";
export const OCHRE = "#d9a441";
export const COTTON = "#f1ead8";
export const HAIR = "#1e1a20";
export const STUCCO = "#efe4cc";

/** The narrator's "you": an Itza warrior in quilted cotton armor with a red feather band. */
export const ITZA_WARRIOR = (i = 0): Design => ({
  outfit: { top: COTTON, quilt: "#c9bb98", bottom: ["#7a4a2a", MAYA_BLUE, "#8a3a2a"][i % 3], boots: "#6e4a2c", belt: MAYA_RED, loin: [MAYA_RED, MAYA_BLUE, OCHRE][i % 3], collar: "round" },
  hat: "plume",
  hatColor: [MAYA_RED, MAYA_BLUE, OCHRE][i % 3],
  hatAccent: JADE,
  hair: "topknot",
  hairColor: HAIR,
  earspool: JADE,
  marks: i === 0 ? null : "paint",
  seed: 600 + i,
});

/** Classic-period holy lord (k'uhul ajaw): jaguar-pelt tunic, jade collar, royal plumed headdress. */
export const MAYA_KING = (i = 0): Design => ({
  outfit: { top: OCHRE, spots: "#3a2a20", bottom: MAYA_RED, boots: "#6e4a2c", belt: JADE, beads: JADE, loin: MAYA_RED, collar: "round" },
  hat: "mayaking",
  hatColor: ["#2f8a5a", "#2f6fa8", "#8a3a8a"][i % 3],
  hair: "long",
  hairColor: HAIR,
  earspool: JADE,
  seed: 610 + i,
});

/** Royal woman in an embroidered huipil (Lady Xook). */
export const MAYA_QUEEN = (i = 0): Design => ({
  outfit: { top: COTTON, robe: true, trim: [MAYA_RED, MAYA_BLUE][i % 2], belt: MAYA_RED, beads: JADE, collar: "wrap", collarColor: MAYA_RED },
  hat: "plume",
  hatColor: MAYA_BLUE,
  hatAccent: JADE,
  hair: "long",
  hairColor: HAIR,
  earspool: JADE,
  seed: 620 + i,
});

/** Priest / day-keeper / scribe: plain mantle, feather band. */
export const MAYA_PRIEST = (i = 0): Design => ({
  outfit: { top: ["#e8dcc0", "#5a4a6a", "#2f5f6a"][i % 3], robe: true, trim: OCHRE, belt: MAYA_RED, beads: "#e8d8b0", collar: "wrap", collarColor: OCHRE },
  hat: "headband",
  hatColor: MAYA_BLUE,
  hatAccent: JADE,
  hair: "topknot",
  hairColor: HAIR,
  earspool: "#e8d8b0",
  seed: 630 + i,
});

/** Farmer / builder / commoner: plain cotton, cloth headband. */
export const MAYA_COMMONER = (i = 0): Design => ({
  outfit: { top: [COTTON, "#e2d2b0", "#d8c8a8", "#efe0c8"][i % 4], bottom: "#8a6a4a", boots: "#6e4a2c", belt: ["#8a5a3a", MAYA_RED, MAYA_BLUE][i % 3], loin: ["#c8a878", MAYA_RED, MAYA_BLUE][i % 3], collar: "round" },
  hat: i % 2 ? "headband" : null,
  hatColor: ["#c8a878", MAYA_RED, MAYA_BLUE, OCHRE][i % 4],
  hair: i % 3 === 2 ? "long" : "topknot",
  hairColor: HAIR,
  seed: 640 + i,
});

/** Woman in a simple huipil (commoner). */
export const MAYA_WOMAN = (i = 0): Design => ({
  outfit: { top: COTTON, robe: true, trim: [MAYA_RED, MAYA_BLUE, OCHRE][i % 3], belt: [MAYA_BLUE, MAYA_RED, "#5a8a3a"][i % 3], collar: "round" },
  hair: "long",
  hairColor: HAIR,
  seed: 650 + i,
});

/** Ballplayer: thick hip yoke, knee guard, feather band. */
export const BALLPLAYER = (i = 0): Design => ({
  outfit: { top: [COTTON, "#e8d8b8"][i % 2], bottom: "#7a4a2a", boots: "#6e4a2c", yoke: ["#8a5a3a", "#5a4a3a"][i % 2], loin: [MAYA_RED, MAYA_BLUE][i % 2], collar: "round" },
  hat: "plume",
  hatColor: [MAYA_RED, MAYA_BLUE][i % 2],
  hatAccent: JADE,
  hair: "topknot",
  hairColor: HAIR,
  earspool: JADE,
  seed: 660 + i,
});

/** Jaguar warrior (Classic armies). */
export const JAGUAR_WARRIOR = (i = 0): Design => ({
  outfit: { top: "#e0a83a", spots: "#2a2228", bottom: "#7a4a2a", boots: "#6e4a2c", belt: MAYA_RED, loin: MAYA_RED, collar: "round" },
  hat: "jaguar",
  hair: "topknot",
  hairColor: HAIR,
  marks: "paint",
  seed: 670 + i,
});

/** Hero Twins of the Popol Vuh: Hunahpu (black spots), Xbalanque (jaguar patches). */
export const HUNAHPU: Design = {
  outfit: { top: COTTON, yoke: "#8a5a3a", bottom: "#7a4a2a", boots: "#6e4a2c", loin: MAYA_RED, collar: "round" },
  hat: "headband",
  hatColor: MAYA_RED,
  hatAccent: JADE,
  hair: "topknot",
  hairColor: HAIR,
  marks: "spots",
  earspool: JADE,
  seed: 680,
};
export const XBALANQUE: Design = {
  outfit: { top: "#e0a83a", spots: "#2a2228", yoke: "#8a5a3a", bottom: "#7a4a2a", boots: "#6e4a2c", loin: MAYA_BLUE, collar: "round" },
  hat: "headband",
  hatColor: MAYA_BLUE,
  hatAccent: JADE,
  hair: "topknot",
  hairColor: HAIR,
  earspool: JADE,
  seed: 681,
};

/** Lords of Xibalba: grey-green skin, skull headdress, dark robes. */
export const XIBALBA_LORD = (i = 0): Design => ({
  outfit: { top: ["#2a2430", "#3a2a3a", "#232a2a"][i % 3], robe: true, trim: "#5a3a5a", belt: "#6a5a40", beads: "#ece4cf", collar: "wrap", collarColor: "#5a3a5a" },
  hat: "skull",
  skin: "#b8c4b0",
  hair: "long",
  hairColor: "#2a2228",
  seed: 690 + i,
});

/** Maize god / people of corn. */
export const MAIZE_GOD: Design = {
  outfit: { top: OCHRE, bottom: "#5a8a3a", boots: "#6e4a2c", belt: JADE, beads: JADE, loin: "#5a8a3a", collar: "round" },
  hat: "maize",
  hair: null,
  earspool: JADE,
  seed: 700,
};

/** Spanish soldier: morion, steel breastplate over a doublet, beard. */
export const SPANISH_SOLDIER = (i = 0): Design => ({
  outfit: { top: ["#8a2a2a", "#c8a24a", "#2f4f7a", "#6a3a6a"][i % 4], armor: "#b9bec8", bottom: ["#3a3a44", "#5a3a2a"][i % 2], boots: "#2a2220", belt: "#5a3a26", buckle: "#d9b84e", collar: "high", collarColor: "#f4f1ea" },
  hat: "morion",
  hatAccent: i % 2 ? "#c8322a" : undefined,
  mustache: i % 2 ? "handlebar" : "walrus",
  mustacheColor: "#3a2a20",
  beard: i % 3 === 0 ? "full" : "goatee",
  beardColor: "#3a2a20",
  seed: 710 + i,
});

/** Spanish captain (Cortés): black doublet, breastplate, plumed morion. */
export const CORTES: Design = {
  outfit: { top: "#2a2228", armor: "#c9ced6", bottom: "#2a2228", boots: "#2a2220", belt: "#8a2a2a", buckle: "#d9b84e", sash: "#8a2a2a", collar: "high", collarColor: "#f4f1ea" },
  hat: "morion",
  hatAccent: "#c8322a",
  mustache: "handlebar",
  mustacheColor: "#2a1e1a",
  beard: "full",
  beardColor: "#2a1e1a",
  seed: 720,
};

/** Pedro de Alvarado: red-gold beard and hair ("Tonatiuh", the sun). */
export const ALVARADO: Design = {
  outfit: { top: "#8a2a2a", armor: "#c9ced6", bottom: "#3a3a44", boots: "#2a2220", belt: "#5a3a26", buckle: "#d9b84e", collar: "high", collarColor: "#f4f1ea" },
  hat: "morion",
  hatAccent: "#f2c84a",
  mustache: "walrus",
  mustacheColor: "#d98a3a",
  beard: "full",
  beardColor: "#d98a3a",
  seed: 721,
};

/** Franciscan friar (Diego de Landa, the friars of 1618): grey habit, rope belt. */
export const FRIAR = (i = 0): Design => ({
  outfit: { top: ["#7a7680", "#6a5a4a"][i % 2], robe: true, rope: "#e8dcc0", collar: "round" },
  hat: i % 2 ? "hood" : null,
  hatColor: "#6a5a4a",
  hair: "short",
  hairColor: "#5a4a3a",
  beard: null,
  seed: 730 + i,
});

/** Columbus: dark doublet, soft bonnet. */
export const COLUMBUS: Design = {
  outfit: { top: "#2f3f5a", bottom: "#3a3a44", boots: "#2a2220", belt: "#5a3a26", collar: "high", collarColor: "#f4f1ea" },
  hat: "cap16",
  hatColor: "#5a1e22",
  hair: "bob",
  hairColor: "#e8e2d4",
  seed: 740,
};

/** Gonzalo Guerrero after he became Maya: tattooed face, ear spools, Maya war gear, Spanish beard. */
export const GUERRERO: Design = {
  outfit: { top: COTTON, quilt: "#c9bb98", bottom: "#7a4a2a", boots: "#6e4a2c", belt: MAYA_RED, loin: MAYA_RED, collar: "round" },
  hat: "plume",
  hatColor: MAYA_RED,
  hatAccent: JADE,
  hair: "long",
  hairColor: "#3a2a20",
  beard: "stubble",
  beardColor: "#3a2a20",
  earspool: JADE,
  marks: "tattoo",
  seed: 750,
};

/** Gerónimo de Aguilar: ragged Spanish priest's clothes. */
export const AGUILAR: Design = {
  outfit: { top: "#4a4a50", robe: true, patches: "#6a6a70", rope: "#c8b890", collar: "round" },
  hair: "short",
  hairColor: "#3a2a20",
  beard: "full",
  beardColor: "#3a2a20",
  seed: 751,
};

/** Modern scientist / archaeologist. */
export const SCIENTIST = (i = 0): Design => ({
  outfit: { top: ["#f2efe8", "#3a6a9a", "#5a7a5a", "#e8dcc0"][i % 4], bottom: "#3a3a44", boots: "#2a2226", collar: "v", collarColor: "#3a5a7a", pockets: true, belt: null, vest: i % 2 ? "#f08a2a" : null },
  hair: ["short", "bob", "short", "long"][i % 4] as Design["hair"],
  hairColor: ["#3a2a20", "#1e1a1c", "#8a6a3a", "#1e1a1c"][i % 4],
  glasses: i % 2 ? "#2a2226" : null,
  seed: 760 + i,
});

/** Alberto Ruz (1949–52): khaki field clothes, hat. */
export const RUZ: Design = {
  outfit: { top: "#c8b890", bottom: "#8a7a5a", boots: "#4a3a2e", belt: "#5a3a26", collar: "high", collarColor: "#c8b890", pockets: true, buttons: "#5a4a3a" },
  hat: "explorer",
  hatColor: "#d8c8a0",
  mustache: "thin",
  mustacheColor: "#2a1e1a",
  seed: 770,
};

/** 1960s writer in a turtleneck and blazer (the "ancient astronaut" claim). */
export const WRITER: Design = {
  outfit: { top: "#5a4a3a", bottom: "#3a3a44", boots: "#2a2226", collar: "high", collarColor: "#2a2226", buttons: "#d9b84e" },
  hair: "short",
  hairColor: "#8a6a3a",
  glasses: "#2a2226",
  seed: 771,
};

/** Popol Vuh creator gods (Tepeu, Q'ukumatz, Heart of Sky): glowing sky-blue skin, royal plumes. */
export const CREATOR_GOD = (i = 0): Design => ({
  outfit: { top: ["#3a9ac9", "#3fa07a", "#d9a441"][i % 3], robe: true, trim: "#f2c84a", belt: "#f2c84a", beads: JADE, collar: "wrap", collarColor: "#f2c84a" },
  hat: "mayaking",
  hatColor: ["#2f6fa8", "#2f8a5a", "#c0392b"][i % 3],
  skin: ["#bfe6f2", "#c8f0d8", "#f8e6b0"][i % 3],
  hair: "long",
  hairColor: "#2a2a40",
  earspool: JADE,
  seed: 800 + i,
});

/** Mud person (first try): brown, lumpy. */
export const MUD_PERSON = (i = 0): Design => ({
  outfit: { top: "#7a5232", bottom: "#6a4428", boots: "#5a3a22", collar: null },
  skin: ["#8a5a3a", "#7a4e30"][i % 2],
  seed: 810 + i,
});

/** Wooden person (second try): carved wood, no heart. */
export const WOOD_PERSON = (i = 0): Design => ({
  outfit: { top: "#b07a4a", bottom: "#9a6a3e", boots: "#7a5232", belt: "#7a5232", collar: "round" },
  skin: ["#d0a06a", "#c8945e"][i % 2],
  hair: "short",
  hairColor: "#8a5a32",
  seed: 820 + i,
});

/** Corn person (third try): golden skin, green leaf garments. */
export const CORN_PERSON = (i = 0): Design => ({
  outfit: { top: ["#6aaa4a", "#f1ead8", "#5a9a3a"][i % 3], bottom: "#7a4a2a", boots: "#6e4a2c", belt: "#f2c84a", loin: "#5a9a3a", collar: "round" },
  skin: "#f6e6b0",
  hair: i % 2 ? "long" : "topknot",
  hairColor: HAIR,
  seed: 830 + i,
});

/** Early farmer of ~7000 BC (simple hide/cotton wrap). */
export const EARLY_FARMER = (i = 0): Design => ({
  outfit: { top: ["#c8a878", "#b8986a"][i % 2], bottom: "#8a6a4a", boots: "#6e4a2c", belt: "#6e4a2c", collar: "round" },
  hair: "long",
  hairColor: HAIR,
  seed: 840 + i,
});
