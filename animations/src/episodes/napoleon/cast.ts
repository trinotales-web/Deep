import type { CharacterProps } from "../../kit/character";

// Characters for the Napoleon story (1769–1821). House style: big white heads,
// white mitten gloves. Uniforms follow the period: French imperial blue with
// white lapels and red cuffs, British red, Austrian white, Russian green,
// Prussian dark blue.
type Design = Omit<CharacterProps, "pose" | "expression">;

const GLOVES = "#f6f5f8";
const DARK_TONES = ["#6e4630", "#5a3826", "#7a4e34", "#4a2e20"];
const dark = (i: number) => ({ skin: DARK_TONES[((i % 4) + 4) % 4], gloves: GLOVES });
const HAIRS = ["#3a2a22", "#2a2226", "#6a4a30", "#8a6a3a", "#c8a05a", "#4a3a30"];

export const FR_BLUE = "#2c4486";
export const FR_WHITE = "#f2efe6";
export const FR_RED = "#c8262f";
export const GOLD = "#e2b23c";

/** Napoleon as general / First Consul / emperor in the field: blue coat, white lapels, gold epaulettes, white breeches, riding boots, bicorne. */
export const NAPOLEON: Design = {
  outfit: { top: FR_BLUE, lapels: FR_WHITE, cuffs: FR_RED, epaulettes: GOLD, tails: FR_BLUE, bottom: FR_WHITE, boots: "#1f1a1e", tallBoots: true, collar: "high", collarColor: FR_RED, sash: null, belt: null },
  hat: "bicorne",
  hair: "short",
  hairColor: "#3a2a22",
  seed: 1,
};

/** Napoleon in his famous grey greatcoat (Grenoble 1815, Russia, Waterloo). */
export const NAPOLEON_GREY: Design = {
  outfit: { top: "#8e8c96", hem: 22, buttons: "#d6d4dc", collar: "high", collarColor: "#7a7882", cuffs: "#7a7882", bottom: FR_WHITE, boots: "#1f1a1e", tallBoots: true },
  hat: "bicorne",
  hair: "short",
  hairColor: "#3a2a22",
  seed: 1,
};

/** Young Napoleon: artillery officer (16–26), lank long hair, plain blue coat with red trim. */
export const NAPOLEON_YOUNG = (hat = false): Design => ({
  outfit: { top: FR_BLUE, lapels: FR_BLUE, cuffs: FR_RED, collar: "high", collarColor: FR_RED, epaulettes: hat ? GOLD : null, tails: FR_BLUE, bottom: FR_WHITE, boots: "#1f1a1e", tallBoots: true, buttons: null },
  hat: hat ? "bicorne" : null,
  hair: "long",
  hairColor: "#3a2a22",
  seed: 2,
});

/** Napoleon at nine: cadet at Brienne school. */
export const NAPOLEON_BOY: Design = {
  outfit: { top: "#3a5a9a", buttons: GOLD, collar: "high", collarColor: FR_RED, bottom: "#2a3358", boots: "#2a2228" },
  hair: "bob",
  hairColor: "#3a2a22",
  seed: 3,
};

/** Baby Napoleon is drawn as a swaddled bundle in the shots (no rig). */

/** Napoleon crowned: crimson velvet robe with ermine trim and a gold laurel wreath. */
export const NAPOLEON_CROWNED: Design = {
  outfit: { top: "#9a1f35", robe: true, trim: "#f4f1ea", cravat: "#f4f1ea", buttons: GOLD, collar: "high", collarColor: "#f4f1ea", boots: "#e2b23c", cape: "#9a1f35", capeWind: 0.05 },
  hat: null,
  hair: "short",
  hairColor: "#3a2a22",
  seed: 4,
};

/** Napoleon in exile on Saint Helena: older, open shirt, dressing gown. */
export const NAPOLEON_OLD: Design = {
  outfit: { top: "#e8e2d4", vest: null, collar: "v", bottom: FR_WHITE, boots: "#3a2a22", cravat: null, hem: 30 },
  hair: "sides",
  hairColor: "#4a3a30",
  seed: 5,
};

/** French line infantryman (1815): shako, blue coat with white lapels, red cuffs, white crossbelts. `i` varies the face. */
export const SOLDIER = (i = 0): Design => ({
  outfit: { top: FR_BLUE, lapels: FR_WHITE, cuffs: FR_RED, crossbelts: FR_WHITE, tails: FR_BLUE, bottom: FR_WHITE, boots: "#2a2228", collar: "high", collarColor: FR_RED, epaulettes: i % 4 === 3 ? FR_RED : null },
  hat: "shako",
  hatAccent: ["#c8262f", "#2f8a4a", "#e2b23c", "#c8262f"][i % 4],
  hair: (["short", "sides", "short", "curly"] as const)[i % 4],
  hairColor: HAIRS[i % HAIRS.length],
  mustache: i % 3 === 1 ? "walrus" : i % 3 === 2 ? "thin" : null,
  mustacheColor: HAIRS[(i + 1) % HAIRS.length],
  seed: 10 + i,
});

/** "You": the young soldier on the road near Grenoble. */
export const YOU: Design = { ...SOLDIER(0), freckles: true, seed: 7 };

/** French officer: bicorne, gold epaulettes, red sash. */
export const OFFICER = (i = 0): Design => ({
  outfit: { top: FR_BLUE, lapels: FR_BLUE, cuffs: FR_RED, epaulettes: GOLD, tails: FR_BLUE, bottom: FR_WHITE, boots: "#1f1a1e", tallBoots: true, collar: "high", collarColor: FR_RED, sash: i % 2 ? null : "#c8262f" },
  hat: "bicorne",
  hair: (["short", "sides"] as const)[i % 2],
  hairColor: HAIRS[(i + 2) % HAIRS.length],
  mustache: i % 2 ? "handlebar" : "walrus",
  mustacheColor: HAIRS[(i + 2) % HAIRS.length],
  seed: 20 + i,
});

/** Imperial Guard grenadier: towering bearskin, red epaulettes. */
export const GRENADIER = (i = 0): Design => ({
  outfit: { top: FR_BLUE, lapels: FR_WHITE, cuffs: FR_RED, crossbelts: FR_WHITE, epaulettes: FR_RED, tails: FR_BLUE, bottom: FR_WHITE, boots: "#2a2228", collar: "high", collarColor: FR_BLUE },
  hat: "bearskin",
  hair: "short",
  hairColor: HAIRS[i % 3],
  mustache: "handlebar",
  mustacheColor: HAIRS[i % 3],
  seed: 30 + i,
});

/** British redcoat. */
export const REDCOAT = (i = 0): Design => ({
  outfit: { top: "#c8262f", crossbelts: FR_WHITE, cuffs: "#2a3a6a", tails: "#c8262f", bottom: "#8a8a92", boots: "#2a2228", collar: "high", collarColor: "#2a3a6a", buttons: GOLD },
  hat: "shako",
  hatColor: "#211d24",
  hatAccent: FR_WHITE,
  hair: (["short", "sides"] as const)[i % 2],
  hairColor: HAIRS[(i + 3) % HAIRS.length],
  mustache: i % 3 === 2 ? "thin" : null,
  seed: 40 + i,
});

/** British admiral (Nelson): fore-and-aft bicorne, navy coat, gold epaulettes, medals. */
export const NELSON: Design = {
  outfit: { top: "#1f2a4a", lapels: "#1f2a4a", epaulettes: GOLD, cuffs: GOLD, tails: "#1f2a4a", bottom: FR_WHITE, boots: "#1f1a1e", medals: true, collar: "high", collarColor: "#1f2a4a", cravat: FR_WHITE },
  hat: "foreaft",
  hair: "sides",
  hairColor: "#cfc9cf",
  seed: 45,
};

/** The Duke of Wellington: plain dark frock coat, cloak, fore-and-aft bicorne, white cravat. */
export const WELLINGTON: Design = {
  outfit: { top: "#2a2e3a", buttons: GOLD, cravat: FR_WHITE, bottom: FR_WHITE, boots: "#1f1a1e", tallBoots: true, cape: "#1f222c", capeWind: 0.15, collar: "high", collarColor: "#2a2e3a" },
  hat: "foreaft",
  hatAccent: "#2a2228",
  hair: "sides",
  hairColor: "#6a6a72",
  seed: 46,
};

/** British royal-navy sailor / officer at Toulon. */
export const BRIT_NAVY = (i = 0): Design => ({
  outfit: { top: "#1f2a4a", buttons: GOLD, bottom: FR_WHITE, boots: "#1f1a1e", collar: "high", collarColor: "#1f2a4a", epaulettes: i === 0 ? GOLD : null },
  hat: i === 0 ? "foreaft" : "tricorne",
  hair: "sides",
  hairColor: HAIRS[(i + 1) % HAIRS.length],
  seed: 47 + i,
});

/** Austrian infantry: white coats. */
export const AUSTRIAN = (i = 0): Design => ({
  outfit: { top: "#f0ece2", cuffs: "#c8262f", crossbelts: "#d8d2c4", tails: "#f0ece2", bottom: "#f0ece2", boots: "#2a2228", collar: "high", collarColor: "#c8262f", buttons: GOLD },
  hat: i % 3 === 0 ? "bicorne" : "shako",
  hatColor: "#2a2228",
  hatAccent: GOLD,
  hair: "short",
  hairColor: HAIRS[(i + 4) % HAIRS.length],
  mustache: i % 2 ? "walrus" : null,
  seed: 50 + i,
});

/** Russian infantry: dark green coats. */
export const RUSSIAN = (i = 0): Design => ({
  outfit: { top: "#2f4a3a", cuffs: "#c8262f", crossbelts: FR_WHITE, tails: "#2f4a3a", bottom: FR_WHITE, boots: "#2a2228", collar: "high", collarColor: "#c8262f" },
  hat: "shako",
  hatAccent: "#2a2228",
  hair: "short",
  hairColor: HAIRS[(i + 2) % HAIRS.length],
  mustache: i % 2 ? "walrus" : "thin",
  mustacheColor: HAIRS[(i + 2) % HAIRS.length],
  seed: 60 + i,
});

/** Cossack: tall fur papakha, long blue coat, beard. */
export const COSSACK = (i = 0): Design => ({
  outfit: { top: "#2a3a6a", hem: 24, belt: "#c8262f", bottom: "#2a3a6a", boots: "#2a2228", collar: "high", collarColor: "#c8262f" },
  hat: "papakha",
  hair: "short",
  hairColor: HAIRS[i % 3],
  beard: "full",
  beardColor: HAIRS[i % 3],
  seed: 65 + i,
});

/** Tsar Alexander I: dark green uniform, gold epaulettes, sideburns. */
export const TSAR: Design = {
  outfit: { top: "#2f4a3a", lapels: "#2f4a3a", epaulettes: GOLD, cuffs: "#c8262f", sash: "#4a7ad0", tails: "#2f4a3a", bottom: FR_WHITE, boots: "#1f1a1e", tallBoots: true, collar: "high", collarColor: "#c8262f", medals: true },
  hat: null,
  hair: "sides",
  hairColor: "#c8a05a",
  mustache: null,
  seed: 68,
};

/** Prussian infantry: dark blue, red collars. */
export const PRUSSIAN = (i = 0): Design => ({
  outfit: { top: "#1f2a4a", cuffs: "#c8262f", crossbelts: FR_WHITE, tails: "#1f2a4a", bottom: "#4a4a52", boots: "#2a2228", collar: "high", collarColor: "#c8262f" },
  hat: "shako",
  hatAccent: FR_WHITE,
  hair: "short",
  hairColor: HAIRS[(i + 1) % HAIRS.length],
  mustache: i % 2 ? "walrus" : null,
  seed: 70 + i,
});

/** Mamluk cavalryman: turban, bright robe, sash, beard. */
export const MAMLUK = (i = 0): Design => ({
  outfit: { top: ["#c8462f", "#2f8a6a", "#d8a93a", "#6a3a8a"][i % 4], robe: true, sash: FR_WHITE, belt: GOLD, collar: "wrap", collarColor: "#f2e4c4", boots: "#c8262f" },
  hat: "turban",
  hatColor: FR_WHITE,
  hair: "short",
  hairColor: "#2a2226",
  beard: "full",
  beardColor: "#2a2226",
  skin: ["#d39c6e", "#c98e62"][i % 2],
  gloves: GLOVES,
  seed: 75 + i,
});

/** Scholars on the Egypt expedition (savants): civilian coats, round glasses. */
export const SAVANT = (i = 0): Design => ({
  outfit: { top: ["#6a4a30", "#4a5a3a", "#5a4a6a"][i % 3], buttons: GOLD, cravat: FR_WHITE, bottom: "#d8ccb0", boots: "#2a2228", tails: ["#6a4a30", "#4a5a3a", "#5a4a6a"][i % 3] },
  hat: i % 2 ? "tricorne" : null,
  hair: (["sides", "long", "curly"] as const)[i % 3],
  hairColor: ["#cfc9cf", "#6a4a30", "#2a2226"][i % 3],
  glasses: i % 2 === 0 ? "#2a2228" : null,
  seed: 80 + i,
});

/** King Louis XVI: blue royal robe with gold lilies (trim), crown, white wig. */
export const KING: Design = {
  outfit: { top: "#2a3a8a", robe: true, trim: GOLD, cravat: FR_WHITE, collar: "high", collarColor: "#f4f1ea", boots: "#c8262f", cape: "#2a3a8a", capeWind: 0.1, buttons: GOLD },
  hat: "crown",
  hair: "curly",
  hairColor: "#ecebf0",
  seed: 85,
};

/** Louis XVIII (1815): stout old king in blue coat with the Garter sash. */
export const KING_OLD: Design = {
  outfit: { top: "#2a3a6a", sash: "#4a7ad0", epaulettes: GOLD, bottom: FR_WHITE, boots: "#2a2228", medals: true, collar: "high", collarColor: "#2a3a6a" },
  hair: "sides",
  hairColor: "#ecebf0",
  seed: 86,
};

/** Revolutionaries (sans-culottes): red Phrygian cap, striped trousers. */
export const REVOLUTIONARY = (i = 0): Design => ({
  outfit: { top: ["#6a4a30", "#4a5a6a", "#8a6a3a"][i % 3], bottom: ["#e8e2d4", "#2a3a6a"][i % 2], boots: "#4a3020", belt: FR_RED, collar: "v", patches: i % 2 ? "#8a7a5a" : null },
  hat: i % 3 === 2 ? null : "phrygian",
  hair: (["sides", "long", "curly", "wild"] as const)[i % 4],
  hairColor: HAIRS[i % HAIRS.length],
  mustache: i % 2 ? "walrus" : null,
  mustacheColor: HAIRS[i % HAIRS.length],
  seed: 90 + i,
});

/** Royalist rebels (1795): civilians with muskets and white cockades. */
export const ROYALIST = (i = 0): Design => ({
  outfit: { top: ["#3a4a3a", "#5a3a2a", "#3a3a4a", "#6a5a3a"][i % 4], buttons: GOLD, cravat: FR_WHITE, bottom: "#d8ccb0", boots: "#2a2228", tails: ["#3a4a3a", "#5a3a2a", "#3a3a4a", "#6a5a3a"][i % 4] },
  hat: i % 2 ? "tricorne" : "bicorne",
  hatColor: "#2a2228",
  hatAccent: FR_WHITE,
  hair: (["sides", "long"] as const)[i % 2],
  hairColor: HAIRS[(i + 2) % HAIRS.length],
  seed: 95 + i,
});

/** Deputies of the Council of Five Hundred: red togas. */
export const DEPUTY = (i = 0): Design => ({
  outfit: { top: "#b8262f", robe: true, sash: FR_BLUE, collar: "wrap", collarColor: FR_WHITE, boots: "#2a2228" },
  hat: "foreaft",
  hatColor: "#2a2228",
  hatAccent: FR_RED,
  hair: (["sides", "curly", "long"] as const)[i % 3],
  hairColor: HAIRS[(i + 1) % HAIRS.length],
  seed: 100 + i,
});

/** Carlo Buonaparte: 1770s coat, tricorne, cravat. */
export const CARLO: Design = {
  outfit: { top: "#5a3a5a", buttons: GOLD, cravat: FR_WHITE, tails: "#5a3a5a", bottom: "#d8ccb0", boots: "#2a2228", cuffs: GOLD },
  hat: "tricorne",
  hair: "long",
  hairColor: "#3a2a22",
  seed: 110,
};

/** Carlo as a Corsican rebel (1768): rough jacket, musket. */
export const CARLO_REBEL: Design = {
  outfit: { top: "#6a4a30", belt: "#3a2a22", buckle: GOLD, strap: "#3a2a22", bottom: "#4a3a30", boots: "#2a2228" },
  hat: "tricorne",
  hatAccent: "#3a2a22",
  hair: "long",
  hairColor: "#3a2a22",
  seed: 111,
};

/** Letizia: long dress, shawl, cap. */
export const LETIZIA: Design = {
  outfit: { top: "#3a5a7a", robe: true, sash: "#c86a4a", collar: "round", boots: "#2a2228", trim: "#f2e4c4" },
  hat: null,
  hair: "bun",
  hairColor: "#2a2226",
  seed: 112,
};

/** Schoolboys at Brienne. */
export const SCHOOLBOY = (i = 0): Design => ({
  outfit: { top: "#3a5a9a", buttons: GOLD, collar: "high", collarColor: FR_RED, bottom: "#2a3358", boots: "#2a2228" },
  hair: (["swoop", "curly", "parted", "spiky", "short"] as const)[i % 5],
  hairColor: ["#c8a05a", "#6a4a30", "#2a2226", "#8a6a3a", "#c87a3a"][i % 5],
  freckles: i % 2 === 0,
  seed: 120 + i,
});

/** The Pope (Pius VII): white cassock, red cape, white skullcap. */
export const POPE: Design = {
  outfit: { top: "#f6f4ee", robe: true, trim: GOLD, cape: "#b8262f", capeWind: 0.05, collar: "round", boots: "#b8262f" },
  hat: "zucchetto",
  hair: "sides",
  hairColor: "#ecebf0",
  seed: 125,
};

/** Spanish guerrilla: wide hat, brown coat, red sash. */
export const GUERRILLA = (i = 0): Design => ({
  outfit: { top: ["#6a4a30", "#5a5a3a", "#4a3a30"][i % 3], sash: "#c8262f", bottom: "#3a2a22", boots: "#2a2228", strap: "#3a2a22" },
  hat: "fedora",
  hatColor: "#3a2a22",
  hair: "short",
  hairColor: "#2a2226",
  mustache: "walrus",
  mustacheColor: "#2a2226",
  beard: i % 2 ? "stubble" : null,
  seed: 130 + i,
});

/** Haitian revolutionary soldiers. */
export const HAITIAN = (i = 0): Design => ({
  outfit: { top: "#2a3a8a", cuffs: FR_RED, crossbelts: FR_WHITE, tails: "#2a3a8a", bottom: FR_WHITE, boots: "#2a2228", collar: "high", collarColor: FR_RED, epaulettes: i === 0 ? GOLD : null },
  hat: i === 0 ? "bicorne" : "shako",
  hair: "short",
  hairColor: "#1f1a1e",
  ...dark(i),
  seed: 135 + i,
});

/** American diplomat (Louisiana Purchase). */
export const DIPLOMAT = (i = 0): Design => ({
  outfit: { top: ["#2a2a32", "#3a2a22"][i % 2], buttons: GOLD, cravat: FR_WHITE, tails: ["#2a2a32", "#3a2a22"][i % 2], bottom: "#2a2a32", boots: "#1f1a1e" },
  hair: (["curly", "sides"] as const)[i % 2],
  hairColor: "#ecebf0",
  seed: 140 + i,
});

/** British cartoonist (1800s): working coat, glasses. */
export const CARTOONIST: Design = {
  outfit: { top: "#4a5a3a", buttons: GOLD, cravat: FR_WHITE, bottom: "#d8ccb0", boots: "#2a2228" },
  hair: "wild",
  hairColor: "#8a6a3a",
  glasses: "#2a2228",
  seed: 145,
};

/** Modern scientists (DNA study, hair test). */
export const SCIENTIST = (i = 0): Design => ({
  outfit: { top: "#f4f4f2", bottom: ["#2f3a52", "#5a4a3a", "#3a3e48"][i % 3], boots: "#2a2228", collar: "v", pockets: true, buttons: "#c8ccd2", shirt: ["#cfe0f0", "#f2d0d0", "#d8ecd0"][i % 3] },
  hair: (["parted", "bun", "short", "curly"] as const)[i % 4],
  hairColor: ["#3a2a22", "#7a4a2a", "#c8a05a", "#2a2226"][i % 4],
  glasses: i % 2 === 0 ? "#2a2228" : null,
  ...(i % 3 === 1 ? dark(i + 2) : {}),
  seed: 150 + i,
});

/** Doctor on Saint Helena. */
export const DOCTOR: Design = {
  outfit: { top: "#2a2a32", cravat: FR_WHITE, buttons: GOLD, bottom: "#2a2a32", boots: "#1f1a1e" },
  hair: "sides",
  hairColor: "#6a6a72",
  glasses: "#2a2228",
  seed: 160,
};

/** Modern historian / viewer for the ending. */
export const VIEWER: Design = {
  outfit: { top: "#8a5ab0", bottom: "#2f3a52", boots: "#f2f2f2", collar: "round" },
  hair: "swoop",
  hairColor: "#3a2a22",
  seed: 170,
};
