// Shape strings with HarfBuzz and export their outlines as SVG path data
// (y-down, em = 1000, baseline at y = 0) for in-canvas text (src/kit/env/geo/textpaths.json).
// Needs packages outside this project: in a scratch dir run
//   npm install harfbuzzjs @fontsource/montserrat @fontsource/noto-sans-devanagari
// copy this script there and run it from that dir:
//   node textpaths.mjs '[["key","mont900","TEXT"], ...]' <repo>/animations/src/kit/env/geo/textpaths.json
// (keys must include every existing entry: the file is rewritten).
import fs from "node:fs";
import zlib from "node:zlib";
import * as hb from "harfbuzzjs";

const DIR = process.env.FONT_DIR ?? new URL("./node_modules/@fontsource/", import.meta.url).pathname;
const FONTS = {
  mont900: DIR + "montserrat/files/montserrat-latin-900-normal.woff",
  mont800: DIR + "montserrat/files/montserrat-latin-800-normal.woff",
  deva700: DIR + "noto-sans-devanagari/files/noto-sans-devanagari-devanagari-700-normal.woff",
};

// WOFF1 -> sfnt
function woffToSfnt(buf) {
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const flavor = dv.getUint32(4);
  const numTables = dv.getUint16(12);
  const tables = [];
  for (let i = 0; i < numTables; i++) {
    const o = 44 + i * 20;
    const tag = buf.subarray(o, o + 4);
    const off = dv.getUint32(o + 4), comp = dv.getUint32(o + 8), orig = dv.getUint32(o + 12), csum = dv.getUint32(o + 16);
    let data = buf.subarray(off, off + comp);
    if (comp < orig) data = zlib.inflateSync(data);
    tables.push({ tag, csum, data });
  }
  let size = 12 + 16 * numTables;
  for (const t of tables) size += (t.data.length + 3) & ~3;
  const out = Buffer.alloc(size);
  out.writeUInt32BE(flavor, 0);
  out.writeUInt16BE(numTables, 4);
  let es = 0; while ((1 << (es + 1)) <= numTables) es++;
  out.writeUInt16BE((1 << es) * 16, 6); out.writeUInt16BE(es, 8); out.writeUInt16BE(numTables * 16 - (1 << es) * 16, 10);
  let off = 12 + 16 * numTables;
  tables.forEach((t, i) => {
    const o = 12 + i * 16;
    Buffer.from(t.tag).copy(out, o);
    out.writeUInt32BE(t.csum, o + 4); out.writeUInt32BE(off, o + 8); out.writeUInt32BE(t.data.length, o + 12);
    Buffer.from(t.data).copy(out, off);
    off += (t.data.length + 3) & ~3;
  });
  return out;
}

const fonts = {};
for (const [k, f] of Object.entries(FONTS)) {
  const sf = woffToSfnt(fs.readFileSync(f));
  const blob = new hb.Blob(sf.buffer.slice(sf.byteOffset, sf.byteOffset + sf.byteLength));
  const face = new hb.Face(blob);
  const font = new hb.Font(face);
  fonts[k] = { font, upem: face.upem };
}

const r1 = (v) => Math.round(v * 10) / 10;
function shapeText(fk, text) {
  const { font, upem } = fonts[fk];
  const k = 1000 / upem;
  const buf = new hb.Buffer();
  buf.addText(text);
  buf.guessSegmentProperties();
  hb.shape(font, buf);
  const infos = buf.getGlyphInfos();
  const pos = buf.getGlyphPositions();
  let pen = 0;
  let d = "";
  infos.forEach((g, i) => {
    const p = pos[i];
    const ox = pen + p.xOffset, oy = p.yOffset;
    for (const c of font.glyphToJson(g.codepoint)) {
      const v = c.values.map((n, j) => (j % 2 === 0 ? r1((ox + n) * k) : r1(-(oy + n) * k)));
      d += c.type + v.join(" ");
    }
    pen += p.xAdvance;
  });
  return { d, w: Math.round(pen * k) };
}

const WANT = JSON.parse(process.argv[2]);
const out = {};
for (const [key, fk, text] of WANT) out[key] = shapeText(fk, text);
fs.writeFileSync(process.argv[3], JSON.stringify(out));
console.log(Object.entries(out).map(([k, v]) => `${k}: w=${v.w} len=${v.d.length}`).join("\n"));
