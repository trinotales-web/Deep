#!/usr/bin/env node
// Procedural sound-design library for the 2D animation stack.
// Generates SFX, seamless ambience loops and music beds as 48 kHz stereo WAVs.
// No dependencies:  node scripts/synth-audio.mjs [outDir]   (default public/audio/lib)
//
// Levels: SFX peak -1 dBFS (set volume in Remotion), ambiences ~-24 dBFS RMS,
// music beds ~-18 dBFS RMS. Everything is deterministic (seeded).

import fs from "node:fs";
import path from "node:path";

const SR = 48000;
const OUT = path.resolve(process.argv.slice(2).find((a) => !a.startsWith("--")) ?? "public/audio/lib");
const TAU = Math.PI * 2;

// ---------------------------------------------------------------------------
// utils

const rng = (seed) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
const N = (sec) => Math.max(1, Math.round(sec * SR));
const stereo = (sec) => [new Float32Array(N(sec)), new Float32Array(N(sec))];
const dbToGain = (db) => Math.pow(10, db / 20);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const NOTE = { C: 0, "C#": 1, Db: 1, D: 2, "D#": 3, Eb: 3, E: 4, F: 5, "F#": 6, Gb: 6, G: 7, "G#": 8, Ab: 8, A: 9, "A#": 10, Bb: 10, B: 11 };
const note = (s) => {
  const m = /^([A-G][#b]?)(-?\d)$/.exec(s);
  return mtof(NOTE[m[1]] + (Number(m[2]) + 1) * 12);
};

const writeWav = (file, L, R) => {
  const n = L.length;
  const buf = Buffer.alloc(44 + n * 4);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + n * 4, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(2, 22);
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 4, 28);
  buf.writeUInt16LE(4, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i++) {
    buf.writeInt16LE(Math.round(clamp(L[i], -1, 1) * 32767), 44 + i * 4);
    buf.writeInt16LE(Math.round(clamp(R[i], -1, 1) * 32767), 46 + i * 4);
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, buf);
};

const peak = ([L, R]) => {
  let p = 0;
  for (let i = 0; i < L.length; i++) p = Math.max(p, Math.abs(L[i]), Math.abs(R[i]));
  return p;
};
const rms = ([L, R]) => {
  let s = 0;
  for (let i = 0; i < L.length; i++) s += L[i] * L[i] + R[i] * R[i];
  return Math.sqrt(s / (2 * L.length));
};
const gain = ([L, R], g) => {
  for (let i = 0; i < L.length; i++) {
    L[i] *= g;
    R[i] *= g;
  }
  return [L, R];
};
const normPeak = (s, db = -1) => gain(s, dbToGain(db) / (peak(s) || 1));
const normRms = (s, db) => {
  gain(s, dbToGain(db) / (rms(s) || 1));
  // keep peaks safe with a soft clip
  const [L, R] = s;
  for (let i = 0; i < L.length; i++) {
    L[i] = softClip(L[i]);
    R[i] = softClip(R[i]);
  }
  return s;
};
const softClip = (x) => (Math.abs(x) < 0.7 ? x : Math.sign(x) * (0.7 + 0.3 * Math.tanh((Math.abs(x) - 0.7) / 0.3)));
const fade = ([L, R], inSec, outSec) => {
  const a = N(inSec);
  const b = N(outSec);
  const n = L.length;
  for (let i = 0; i < a && i < n; i++) {
    const g = i / a;
    L[i] *= g;
    R[i] *= g;
  }
  for (let i = 0; i < b && i < n; i++) {
    const g = i / b;
    L[n - 1 - i] *= g;
    R[n - 1 - i] *= g;
  }
  return [L, R];
};
/** Add mono buffer into stereo with equal-power pan (-1..1) at offset seconds. */
const addMono = ([L, R], m, at = 0, g = 1, pan = 0) => {
  const o = Math.round(at * SR);
  const lp = Math.cos(((pan + 1) * Math.PI) / 4) * g;
  const rp = Math.sin(((pan + 1) * Math.PI) / 4) * g;
  for (let i = 0; i < m.length; i++) {
    const j = o + i;
    if (j < 0 || j >= L.length) continue;
    L[j] += m[i] * lp;
    R[j] += m[i] * rp;
  }
};
const addStereo = ([L, R], [l, r], at = 0, g = 1) => {
  const o = Math.round(at * SR);
  for (let i = 0; i < l.length; i++) {
    const j = o + i;
    if (j < 0 || j >= L.length) continue;
    L[j] += l[i] * g;
    R[j] += r[i] * g;
  }
};

// ---------------------------------------------------------------------------
// filters

class Biquad {
  constructor(type, f, q = 0.707, db = 0) {
    this.type = type;
    this.x1 = this.x2 = this.y1 = this.y2 = 0;
    this.set(f, q, db);
  }
  set(f, q = this.q, db = this.db) {
    this.q = q;
    this.db = db;
    const w = (TAU * clamp(f, 10, SR * 0.45)) / SR;
    const cs = Math.cos(w);
    const sn = Math.sin(w);
    const al = sn / (2 * q);
    const A = Math.pow(10, db / 40);
    let b0, b1, b2, a0, a1, a2;
    switch (this.type) {
      case "lp":
        b0 = (1 - cs) / 2; b1 = 1 - cs; b2 = (1 - cs) / 2; a0 = 1 + al; a1 = -2 * cs; a2 = 1 - al;
        break;
      case "hp":
        b0 = (1 + cs) / 2; b1 = -(1 + cs); b2 = (1 + cs) / 2; a0 = 1 + al; a1 = -2 * cs; a2 = 1 - al;
        break;
      case "bp":
        b0 = al; b1 = 0; b2 = -al; a0 = 1 + al; a1 = -2 * cs; a2 = 1 - al;
        break;
      case "peak":
        b0 = 1 + al * A; b1 = -2 * cs; b2 = 1 - al * A; a0 = 1 + al / A; a1 = -2 * cs; a2 = 1 - al / A;
        break;
      case "lowshelf": {
        const s = 2 * Math.sqrt(A) * al;
        b0 = A * (A + 1 - (A - 1) * cs + s); b1 = 2 * A * (A - 1 - (A + 1) * cs); b2 = A * (A + 1 - (A - 1) * cs - s);
        a0 = A + 1 + (A - 1) * cs + s; a1 = -2 * (A - 1 + (A + 1) * cs); a2 = A + 1 + (A - 1) * cs - s;
        break;
      }
      default:
        throw new Error(this.type);
    }
    this.b0 = b0 / a0; this.b1 = b1 / a0; this.b2 = b2 / a0; this.a1 = a1 / a0; this.a2 = a2 / a0;
    return this;
  }
  p(x) {
    const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2;
    this.x2 = this.x1; this.x1 = x; this.y2 = this.y1; this.y1 = y;
    return y;
  }
}

/** Run a mono buffer through a filter whose cutoff follows fn(t). */
const sweep = (m, type, fn, q = 0.707, step = 32) => {
  const f = new Biquad(type, fn(0), q);
  for (let i = 0; i < m.length; i++) {
    if (i % step === 0) f.set(fn(i / SR), q);
    m[i] = f.p(m[i]);
  }
  return m;
};
const filt = (m, type, f, q = 0.707, db = 0) => {
  const b = new Biquad(type, f, q, db);
  for (let i = 0; i < m.length; i++) m[i] = b.p(m[i]);
  return m;
};

// Freeverb (Jezar) — stereo
class Comb {
  constructor(n) { this.b = new Float32Array(n); this.i = 0; this.s = 0; }
  p(x, fb, damp) {
    const y = this.b[this.i];
    this.s = y * (1 - damp) + this.s * damp;
    this.b[this.i] = x + this.s * fb;
    this.i = (this.i + 1) % this.b.length;
    return y;
  }
}
class Allpass {
  constructor(n) { this.b = new Float32Array(n); this.i = 0; }
  p(x) {
    const bo = this.b[this.i];
    const y = -x + bo;
    this.b[this.i] = x + bo * 0.5;
    this.i = (this.i + 1) % this.b.length;
    return y;
  }
}
const reverb = ([L, R], { room = 0.82, damp = 0.35, wet = 0.25, dry = 1, width = 1, pre = 0.01 } = {}) => {
  const k = SR / 44100;
  const cl = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617].map((n) => new Comb(Math.round(n * k)));
  const cr = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617].map((n) => new Comb(Math.round((n + 23) * k)));
  const al = [556, 441, 341, 225].map((n) => new Allpass(Math.round(n * k)));
  const ar = [556, 441, 341, 225].map((n) => new Allpass(Math.round((n + 23) * k)));
  const preN = Math.round(pre * SR);
  const pb = new Float32Array(preN + 1);
  let pi = 0;
  const fb = room * 0.28 + 0.7;
  const w1 = wet * (width / 2 + 0.5);
  const w2 = wet * ((1 - width) / 2);
  for (let i = 0; i < L.length; i++) {
    const inp = (L[i] + R[i]) * 0.015;
    pb[pi] = inp;
    pi = (pi + 1) % pb.length;
    const x = pb[pi];
    let ol = 0;
    let or = 0;
    for (let c = 0; c < 8; c++) {
      ol += cl[c].p(x, fb, damp);
      or += cr[c].p(x, fb, damp);
    }
    for (let a = 0; a < 4; a++) {
      ol = al[a].p(ol);
      or = ar[a].p(or);
    }
    const l = L[i];
    const r = R[i];
    L[i] = l * dry + ol * w1 + or * w2;
    R[i] = r * dry + or * w1 + ol * w2;
  }
  return [L, R];
};

// ---------------------------------------------------------------------------
// sources

const white = (sec, seed) => {
  const r = rng(seed);
  const m = new Float32Array(N(sec));
  for (let i = 0; i < m.length; i++) m[i] = r() * 2 - 1;
  return m;
};
const pink = (sec, seed) => {
  const r = rng(seed);
  const m = new Float32Array(N(sec));
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < m.length; i++) {
    const w = r() * 2 - 1;
    b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.969 * b2 + w * 0.153852;
    b3 = 0.8665 * b3 + w * 0.3104856; b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898;
    m[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
    b6 = w * 0.115926;
  }
  return m;
};
const brown = (sec, seed) => {
  const r = rng(seed);
  const m = new Float32Array(N(sec));
  let v = 0;
  for (let i = 0; i < m.length; i++) {
    v = (v + (r() * 2 - 1) * 0.02) * 0.998;
    m[i] = v * 3.5;
  }
  return m;
};
/** Oscillator with frequency function f(t) and amplitude env a(t). */
const osc = (sec, f, a, shape = "sine") => {
  const m = new Float32Array(N(sec));
  let ph = 0;
  for (let i = 0; i < m.length; i++) {
    const t = i / SR;
    const fr = f(t);
    const dt = fr / SR;
    ph += dt;
    ph -= Math.floor(ph);
    let v;
    if (shape === "sine") v = Math.sin(ph * TAU);
    else if (shape === "tri") v = 1 - 4 * Math.abs(ph - 0.5);
    else {
      // polyBLEP saw
      v = 2 * ph - 1;
      if (ph < dt) {
        const x = ph / dt;
        v -= x + x - x * x - 1;
      } else if (ph > 1 - dt) {
        const x = (ph - 1) / dt;
        v -= x * x + x + x + 1;
      }
      if (shape === "square") v = Math.sign(Math.sin(ph * TAU));
    }
    m[i] = v * a(t);
  }
  return m;
};
const env = {
  exp: (tau, attack = 0.002) => (t) => (t < attack ? t / attack : Math.exp(-(t - attack) / tau)),
  adsr: (a, d, s, r, len) => (t) => {
    if (t < a) return t / a;
    if (t < a + d) return 1 - (1 - s) * ((t - a) / d);
    if (t < len) return s;
    return Math.max(0, s * (1 - (t - len) / r));
  },
  bell: (dur, peakAt = 0.5, pw = 2) => (t) => {
    const x = t / dur;
    if (x < 0 || x > 1) return 0;
    return x < peakAt ? Math.pow(Math.sin((x / peakAt) * Math.PI * 0.5), pw) : Math.pow(Math.cos(((x - peakAt) / (1 - peakAt)) * Math.PI * 0.5), pw);
  },
};
const mulEnv = (m, a) => {
  for (let i = 0; i < m.length; i++) m[i] *= a(i / SR);
  return m;
};
const mix = (...parts) => {
  const n = Math.max(...parts.map(([m]) => m.length));
  const o = new Float32Array(n);
  for (const [m, g = 1] of parts) for (let i = 0; i < m.length; i++) o[i] += m[i] * g;
  return o;
};
const sat = (m, drive = 1.5) => {
  const k = Math.tanh(drive);
  for (let i = 0; i < m.length; i++) m[i] = Math.tanh(m[i] * drive) / k;
  return m;
};

/** Karplus-Strong plucked string. */
const pluck = (f, sec, { decay = 0.996, bright = 0.5, seed = 1 } = {}) => {
  const r = rng(seed);
  const n = Math.max(2, Math.round(SR / f));
  const buf = new Float32Array(n);
  for (let i = 0; i < n; i++) buf[i] = r() * 2 - 1;
  const out = new Float32Array(N(sec));
  let idx = 0;
  let last = 0;
  for (let i = 0; i < out.length; i++) {
    const cur = buf[idx];
    const nxt = buf[(idx + 1) % n];
    const avg = (cur * (1 - bright) + nxt * bright) * 0.5 + (cur + nxt) * 0.25;
    buf[idx] = avg * decay;
    out[i] = cur;
    last = cur;
    idx = (idx + 1) % n;
  }
  return filt(out, "lp", Math.min(9000, f * 8));
};

/** Additive piano-ish tone with inharmonic partials and hammer noise. */
const piano = (f, sec, vel = 1, seed = 1) => {
  const parts = [];
  const B = 0.00035;
  for (let n = 1; n <= 10; n++) {
    const fn = n * f * Math.sqrt(1 + B * n * n);
    if (fn > 12000) break;
    const tau = 2.4 / (1 + 0.55 * n) * (f < 200 ? 1.6 : 1);
    parts.push([osc(sec, () => fn, env.exp(tau, 0.003)), (1 / Math.pow(n, 1.25)) * (n === 1 ? 1 : 0.8)]);
  }
  const hammer = filt(mulEnv(white(0.03, seed), env.exp(0.006, 0.0005)), "bp", 2400, 1.2);
  const tone = mix(...parts, [hammer, 0.15]);
  return mulEnv(tone, (t) => vel * (t > sec - 0.05 ? (sec - t) / 0.05 : 1));
};

/** Supersaw pad voice. */
const padVoice = (f, sec, { cutoff = 1100, attack = 0.7, release = 0.9, detune = 9, seed = 1 } = {}) => {
  const r = rng(seed);
  const cents = [0, detune, -detune, detune * 1.9, -detune * 1.9];
  const voices = cents.map((c) => {
    const ff = f * Math.pow(2, c / 1200);
    const ph = r() * 0.3;
    return [osc(sec, (t) => ff * (1 + 0.002 * Math.sin(TAU * (4.5 + ph) * t)), () => 1, "saw"), 0.2];
  });
  const m = mix(...voices);
  filt(m, "lp", cutoff, 0.6);
  return mulEnv(m, env.adsr(attack, 0.3, 0.85, release, sec - release));
};

const sine = (sec, f, a) => osc(sec, typeof f === "function" ? f : () => f, a);

// ---------------------------------------------------------------------------
// SFX

const SFX = {};

SFX.whoosh = (seed = 1, dur = 0.5, lo = 250, hi = 3200) => {
  const s = stereo(dur + 0.4);
  const body = sweep(white(dur, seed), "bp", (t) => lo + (hi - lo) * env.bell(dur, 0.55, 1.2)(t), 1.4);
  mulEnv(body, env.bell(dur, 0.55, 1.6));
  const low = sweep(white(dur, seed + 7), "lp", (t) => 120 + 700 * env.bell(dur, 0.5, 1)(t), 0.9);
  mulEnv(low, env.bell(dur, 0.5, 2));
  const m = mix([body, 1], [low, 0.8]);
  // pan sweep left → right
  const [L, R] = s;
  for (let i = 0; i < m.length; i++) {
    const p = clamp((i / m.length) * 1.6 - 0.8, -1, 1);
    L[i] += m[i] * Math.cos(((p + 1) * Math.PI) / 4);
    R[i] += m[i] * Math.sin(((p + 1) * Math.PI) / 4);
  }
  return normPeak(reverb(s, { room: 0.5, wet: 0.12 }));
};

SFX.swish = (seed = 3) => SFX.whoosh(seed, 0.2, 900, 6000);

SFX.pop = (seed = 1, f0 = 900, f1 = 220) => {
  const s = stereo(0.4);
  const body = sine(0.12, (t) => f1 + (f0 - f1) * Math.exp(-t / 0.018), env.exp(0.035, 0.001));
  const click = filt(mulEnv(white(0.01, seed), env.exp(0.0015, 0.0002)), "hp", 2500);
  addMono(s, mix([body, 1], [click, 0.35]));
  return normPeak(reverb(s, { room: 0.3, wet: 0.08 }));
};

SFX.pop_high = (seed = 2) => SFX.pop(seed, 1800, 520);

SFX.boing = () => {
  const s = stereo(0.9);
  const m = sine(0.8, (t) => 210 * (1 + 0.45 * Math.exp(-t * 5) * Math.sin(TAU * 13 * t)) * (1 + t * 0.3), env.exp(0.25, 0.004));
  addMono(s, m);
  return normPeak(s);
};

SFX.impact = (seed = 1) => {
  const dur = 3.2;
  const s = stereo(dur);
  const sub = sine(dur, (t) => 36 + 44 * Math.exp(-t / 0.09), env.exp(0.7, 0.002));
  const punch = filt(mulEnv(white(0.5, seed), env.exp(0.07, 0.001)), "lp", 500);
  const crack = filt(mulEnv(white(0.08, seed + 1), env.exp(0.012, 0.0005)), "hp", 2200);
  const m = sat(mix([sub, 1], [punch, 0.9], [crack, 0.5]), 1.8);
  addMono(s, m);
  return normPeak(reverb(s, { room: 0.88, damp: 0.5, wet: 0.35, width: 1 }));
};

SFX.braam = (seed = 2) => {
  const dur = 3.4;
  const s = stereo(dur);
  const freqs = [note("D1"), note("D2") * 1.003, note("A1") * 0.998, note("D2") * 0.997];
  const voices = freqs.map((f, i) => [osc(dur, () => f, () => 1, "saw"), i === 0 ? 0.5 : 0.35]);
  const m = mix(...voices);
  sweep(m, "lp", (t) => 160 + 1500 * Math.exp(-Math.pow((t - 0.25) / 0.6, 2)), 1.1);
  mulEnv(m, env.adsr(0.03, 0.6, 0.55, 1.6, 1.4));
  sat(m, 2.2);
  const sub = sine(dur, (t) => 32 + 30 * Math.exp(-t / 0.1), env.exp(0.9, 0.002));
  addMono(s, mix([m, 0.8], [sub, 0.9]), 0, 1, -0.15);
  addMono(s, m, 0.012, 0.5, 0.4);
  return normPeak(reverb(s, { room: 0.9, damp: 0.45, wet: 0.3 }));
};

SFX.riser = (seed = 3, dur = 2.2) => {
  const s = stereo(dur);
  const nz = sweep(white(dur, seed), "bp", (t) => 300 * Math.pow(30, t / dur), 2.5);
  mulEnv(nz, (t) => Math.pow(t / dur, 2.2));
  const tone = osc(dur, (t) => 110 * Math.pow(8, t / dur), (t) => Math.pow(t / dur, 2.5) * (0.6 + 0.4 * Math.sin(TAU * (4 + 18 * (t / dur)) * t)), "saw");
  filt(tone, "lp", 3000);
  const m = mix([nz, 1.2], [tone, 0.35]);
  // end with a tiny fade so it lands cleanly on the hit
  mulEnv(m, (t) => (t > dur - 0.01 ? (dur - t) / 0.01 : 1));
  addMono(s, m, 0, 1, -0.2);
  addMono(s, m, 0.009, 0.8, 0.3);
  return normPeak(reverb(s, { room: 0.7, wet: 0.2 }));
};

SFX.swell = (seed = 4, dur = 1.6) => {
  const s = stereo(dur);
  const m = filt(white(dur, seed), "hp", 3500);
  mulEnv(m, (t) => Math.pow(t / dur, 3) * (t > dur - 0.008 ? (dur - t) / 0.008 : 1));
  addMono(s, m, 0, 1, -0.3);
  addMono(s, filt(white(dur, seed + 1), "hp", 3500).map((v, i) => v * Math.pow(i / SR / dur, 3)), 0, 1, 0.3);
  return normPeak(reverb(s, { room: 0.6, wet: 0.15 }));
};

SFX.tick = (seed = 1, f = 2600) => {
  const s = stereo(0.15);
  const c = filt(mulEnv(white(0.03, seed), env.exp(0.003, 0.0002)), "bp", f, 3);
  const ping = sine(0.05, f * 0.62, env.exp(0.008, 0.0005));
  addMono(s, mix([c, 1], [ping, 0.3]));
  return normPeak(reverb(s, { room: 0.2, wet: 0.05 }));
};
SFX.tock = (seed = 2) => SFX.tick(seed, 1500);

SFX.page_flip = (seed = 1) => {
  const dur = 0.35;
  const s = stereo(dur);
  const m = filt(white(dur, seed), "bp", 3200, 0.8);
  const r = rng(seed);
  const bumps = [0, 0.05, 0.1, 0.16].map((t) => [t + r() * 0.01, 0.4 + r() * 0.6]);
  mulEnv(m, (t) => bumps.reduce((a, [b, g]) => a + g * Math.exp(-Math.pow((t - b) / 0.018, 2)), 0));
  const flap = filt(mulEnv(white(0.15, seed + 3), env.bell(0.15, 0.3, 1)), "lp", 700);
  addMono(s, mix([m, 1], [flap, 0.8]), 0, 1, 0.1);
  return normPeak(reverb(s, { room: 0.3, wet: 0.08 }));
};

SFX.paper = (seed = 5) => {
  const dur = 0.9;
  const s = stereo(dur);
  const r = rng(seed);
  const m = filt(white(dur, seed), "bp", 2800, 0.6);
  const grains = Array.from({ length: 26 }, () => [r() * dur * 0.85, 0.2 + r() * 0.8]);
  mulEnv(m, (t) => grains.reduce((a, [b, g]) => a + g * Math.exp(-Math.pow((t - b) / 0.012, 2)), 0) * env.bell(dur, 0.4, 0.6)(t));
  addMono(s, m, 0, 1, -0.1);
  return normPeak(s);
};

SFX.thud = (seed = 1) => {
  const s = stereo(0.8);
  const body = sine(0.5, (t) => 60 + 90 * Math.exp(-t / 0.03), env.exp(0.12, 0.001));
  const n = filt(mulEnv(white(0.2, seed), env.exp(0.03, 0.0005)), "lp", 900);
  addMono(s, sat(mix([body, 1], [n, 0.6]), 1.4));
  return normPeak(reverb(s, { room: 0.4, wet: 0.1 }));
};
SFX.stamp = (seed = 2) => {
  const s = SFX.thud(seed);
  addMono(s, filt(mulEnv(white(0.04, seed + 9), env.exp(0.006, 0.0003)), "hp", 1500), 0, 0.4);
  return normPeak(s);
};

SFX.ding = () => {
  const dur = 3.5;
  const s = stereo(dur);
  const f = 1046.5;
  const parts = [[1, 1, 2.6], [2.0, 0.45, 1.6], [2.76, 0.38, 1.2], [4.07, 0.22, 0.8], [5.4, 0.12, 0.5]].map(([k, a, tau]) => [
    sine(dur, f * k, env.exp(tau, 0.002)),
    a,
  ]);
  addMono(s, mix(...parts));
  return normPeak(reverb(s, { room: 0.85, wet: 0.3 }));
};

SFX.sting = (seed = 1) => {
  // low piano cluster + sub hit + reverb: a dark "realization" sting
  const dur = 4.5;
  const s = stereo(dur);
  addMono(s, piano(note("D2"), dur, 1, seed), 0, 0.9, -0.2);
  addMono(s, piano(note("A2"), dur, 0.7, seed + 1), 0.005, 0.7, 0.1);
  addMono(s, piano(note("D3"), dur, 0.6, seed + 2), 0.01, 0.6, 0.25);
  addMono(s, piano(note("Eb3"), dur, 0.35, seed + 3), 0.012, 0.5, 0.35);
  addMono(s, sine(dur, (t) => 40 + 25 * Math.exp(-t / 0.1), env.exp(1.0, 0.003)), 0, 0.7);
  return normPeak(reverb(s, { room: 0.92, damp: 0.4, wet: 0.4 }));
};

SFX.whack = (seed = 1) => {
  const s = stereo(0.5);
  const body = sine(0.25, (t) => 100 + 180 * Math.exp(-t / 0.02), env.exp(0.06, 0.0005));
  const n = filt(mulEnv(white(0.15, seed), env.exp(0.025, 0.0003)), "bp", 1200, 0.7);
  addMono(s, sat(mix([body, 1], [n, 1.1]), 2));
  return normPeak(reverb(s, { room: 0.35, wet: 0.08 }));
};

SFX.explosion = (seed = 1) => {
  const dur = 5;
  const s = stereo(dur);
  const nz = sweep(white(dur, seed), "lp", (t) => 150 + 3500 * Math.exp(-t / 0.35), 0.8);
  mulEnv(nz, env.exp(0.9, 0.003));
  const sub = sine(dur, (t) => 30 + 50 * Math.exp(-t / 0.12), env.exp(1.1, 0.003));
  const rumble = mulEnv(filt(brown(dur, seed + 2), "lp", 120), env.exp(1.6, 0.05));
  const m = sat(mix([nz, 1], [sub, 1.1], [rumble, 0.8]), 2.2);
  const r = rng(seed);
  for (let k = 0; k < 40; k++) {
    const t = 0.05 + r() * 1.6;
    addMono(s, filt(mulEnv(white(0.02, seed + 10 + k), env.exp(0.003, 0.0002)), "bp", 1500 + r() * 3000, 2), t, 0.15 * Math.exp(-t), r() * 2 - 1);
  }
  addMono(s, m, 0, 1, -0.1);
  addMono(s, m, 0.011, 0.7, 0.3);
  return normPeak(reverb(s, { room: 0.9, damp: 0.5, wet: 0.3 }));
};

SFX.gunshot = (seed = 1) => {
  const dur = 2.2;
  const s = stereo(dur);
  const crack = filt(mulEnv(white(0.03, seed), env.exp(0.004, 0.0002)), "hp", 1800);
  const body = filt(mulEnv(white(0.25, seed + 1), env.exp(0.05, 0.0005)), "lp", 1400);
  const thump = sine(0.3, (t) => 70 + 100 * Math.exp(-t / 0.015), env.exp(0.05, 0.0005));
  addMono(s, sat(mix([crack, 1], [body, 1], [thump, 0.8]), 2.5));
  return normPeak(reverb(s, { room: 0.93, damp: 0.6, wet: 0.35 }));
};

SFX.clang = () => {
  const dur = 2;
  const s = stereo(dur);
  const f = 620;
  const parts = [1, 2.41, 3.93, 5.21, 6.78, 8.1].map((k, i) => [sine(dur, f * k * (1 + i * 0.001), env.exp(0.9 / (1 + i * 0.6), 0.0005)), 1 / (1 + i * 0.5)]);
  const hit = filt(mulEnv(white(0.02, 4), env.exp(0.003, 0.0002)), "hp", 3000);
  addMono(s, mix(...parts, [hit, 0.6]));
  return normPeak(reverb(s, { room: 0.6, wet: 0.18 }));
};

SFX.footstep = (seed = 1) => {
  const s = stereo(0.3);
  const r = rng(seed);
  const crunch = filt(white(0.14, seed), "bp", 700 + r() * 500, 0.7);
  const grains = Array.from({ length: 10 }, () => [r() * 0.09, 0.3 + r() * 0.7]);
  mulEnv(crunch, (t) => grains.reduce((a, [b, g]) => a + g * Math.exp(-Math.pow((t - b) / 0.006, 2)), 0) * Math.exp(-t / 0.06));
  const thump = sine(0.12, (t) => 80 + 40 * Math.exp(-t / 0.02), env.exp(0.03, 0.001));
  addMono(s, mix([crunch, 1], [thump, 0.5]), 0, 1, r() * 0.4 - 0.2);
  return normPeak(s);
};

SFX.heartbeat = () => {
  const s = stereo(1.0);
  const beat = () => sine(0.25, (t) => 48 + 30 * Math.exp(-t / 0.03), env.exp(0.06, 0.004));
  addMono(s, beat(), 0, 1);
  addMono(s, beat(), 0.22, 0.75);
  return normPeak(s);
};

SFX.scribble = (seed = 1) => {
  const dur = 1.2;
  const s = stereo(dur);
  const r = rng(seed);
  const m = filt(white(dur, seed), "bp", 3500, 1.2);
  const strokes = Array.from({ length: 9 }, (_, i) => [i * 0.12 + r() * 0.04, 0.05 + r() * 0.07]);
  mulEnv(m, (t) => strokes.reduce((a, [b, d]) => a + (t > b && t < b + d ? Math.sin(((t - b) / d) * Math.PI) : 0), 0));
  addMono(s, m, 0, 1, 0.15);
  return normPeak(s);
};

SFX.camera_flash = () => {
  const s = stereo(1.2);
  const charge = sine(0.6, (t) => 2000 + 6000 * t, (t) => 0.15 * (t / 0.6));
  const snap = filt(mulEnv(white(0.05, 3), env.exp(0.008, 0.0003)), "hp", 2000);
  addMono(s, charge, 0, 0.5);
  addMono(s, snap, 0.6, 1);
  return normPeak(reverb(s, { room: 0.4, wet: 0.1 }));
};

// ---------------------------------------------------------------------------
// Ambience loops (seamless)

const loopify = (s, loopSec, xf = 1.5) => {
  const n = N(loopSec);
  const x = N(xf);
  const [L, R] = s;
  const oL = new Float32Array(n);
  const oR = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    oL[i] = L[i];
    oR[i] = R[i];
  }
  for (let i = 0; i < x; i++) {
    const a = Math.sin(((i / x) * Math.PI) / 2);
    const b = Math.cos(((i / x) * Math.PI) / 2);
    oL[i] = L[i] * a + (L[n + i] ?? 0) * b;
    oR[i] = R[i] * a + (R[n + i] ?? 0) * b;
  }
  return [oL, oR];
};

const AMB = {};

AMB.room_tone = (loop = 20) => {
  const dur = loop + 2;
  const s = stereo(dur);
  addMono(s, filt(brown(dur, 1), "lp", 260), 0, 0.9, -0.3);
  addMono(s, filt(brown(dur, 2), "lp", 260), 0, 0.9, 0.3);
  addMono(s, filt(pink(dur, 3), "lp", 1800), 0, 0.12);
  addMono(s, sine(dur, 50, () => 0.01), 0, 1);
  return normRms(loopify(s, loop), -30);
};

AMB.clock = (loop = 20) => {
  const dur = loop + 2;
  const s = AMB.room_tone(dur);
  const tick = SFX.tick(1)[0];
  const tock = SFX.tock(2)[0];
  for (let t = 0.2, k = 0; t < dur; t += 1, k++) addMono(s, k % 2 ? tock : tick, t, 0.12, 0.25);
  return normRms(loopify(s, loop), -28);
};

AMB.waves = (loop = 24) => {
  const dur = loop + 3;
  const s = stereo(dur);
  const r = rng(11);
  const wash = filt(pink(dur, 12), "lp", 700);
  addMono(s, wash, 0, 0.35, -0.2);
  addMono(s, filt(pink(dur, 13), "lp", 700), 0, 0.35, 0.2);
  for (let t = 0; t < dur; t += 4.5 + r() * 2.5) {
    const wd = 4 + r() * 1.5;
    const w = sweep(white(wd, Math.floor(t * 100)), "lp", (x) => 250 + 2600 * env.bell(wd, 0.45, 1.5)(x), 0.7);
    mulEnv(w, env.bell(wd, 0.4, 1.8));
    addMono(s, w, t, 0.6, r() * 1.2 - 0.6);
  }
  // occasional tropical birds
  for (let t = 1 + r() * 3; t < dur - 1; t += 3 + r() * 4) {
    const pan = r() * 1.6 - 0.8;
    const base = 2400 + r() * 1800;
    for (let k = 0; k < 2 + Math.floor(r() * 3); k++) {
      const cd = 0.07 + r() * 0.06;
      const chirp = sine(cd, (x) => base * (1 + 0.35 * Math.sin((x / cd) * Math.PI)) , env.bell(cd, 0.3, 1));
      addMono(s, chirp, t + k * (0.11 + r() * 0.05), 0.05, pan);
    }
  }
  return normRms(reverb(loopify(s, loop), { room: 0.5, wet: 0.08 }), -24);
};

AMB.jungle_night = (loop = 24) => {
  const dur = loop + 2;
  const s = stereo(dur);
  const r = rng(21);
  addMono(s, filt(pink(dur, 22), "lp", 500), 0, 0.25, -0.3);
  addMono(s, filt(pink(dur, 23), "lp", 500), 0, 0.25, 0.3);
  // crickets: pulsed high sines in chirp trains
  for (let c = 0; c < 5; c++) {
    const f = 4200 + r() * 1400;
    const rate = 22 + r() * 14;
    const period = 0.6 + r() * 0.6;
    const len = 0.18 + r() * 0.2;
    const ph = r() * period;
    const pan = r() * 1.8 - 0.9;
    const g = 0.02 + r() * 0.02;
    const m = sine(dur, f, (t) => {
      const local = (t + ph) % period;
      return local < len ? Math.pow(Math.max(0, Math.sin(TAU * rate * t)), 6) : 0;
    });
    addMono(s, m, 0, g, pan);
  }
  // frogs
  for (let t = 0.5 + r() * 2; t < dur - 1; t += 2 + r() * 3) {
    const n = 2 + Math.floor(r() * 3);
    const pan = r() * 1.6 - 0.8;
    for (let k = 0; k < n; k++) {
      const cd = 0.12;
      const croak = filt(osc(cd, () => 95 + r() * 30, (x) => env.bell(cd, 0.3, 1)(x) * (0.6 + 0.4 * Math.sin(TAU * 45 * x)), "saw"), "bp", 450, 1.5);
      addMono(s, croak, t + k * 0.18, 0.25, pan);
    }
  }
  return normRms(reverb(loopify(s, loop), { room: 0.7, wet: 0.12 }), -25);
};

AMB.fire = (loop = 20) => {
  const dur = loop + 2;
  const s = stereo(dur);
  const r = rng(31);
  const rumble = filt(brown(dur, 32), "lp", 220);
  addMono(s, rumble, 0, 0.7);
  const hiss = filt(pink(dur, 33), "bp", 900, 0.5);
  mulEnv(hiss, (t) => 0.6 + 0.4 * Math.sin(TAU * 0.3 * t) * Math.sin(TAU * 0.13 * t + 1));
  addMono(s, hiss, 0, 0.12);
  for (let t = 0; t < dur; t += -Math.log(1 - r()) / 14) {
    const big = r() < 0.12;
    const cd = big ? 0.02 : 0.005;
    const c = filt(mulEnv(white(cd, Math.floor(t * 1000)), env.exp(cd / 3, 0.0002)), "bp", big ? 900 + r() * 600 : 2000 + r() * 4000, 1.5);
    addMono(s, c, t, (big ? 0.5 : 0.18) * (0.3 + r()), r() * 1.2 - 0.6);
  }
  return normRms(loopify(s, loop), -24);
};

AMB.wind = (loop = 24) => {
  const dur = loop + 2;
  const s = stereo(dur);
  for (const [seed, pan] of [[41, -0.4], [42, 0.4]]) {
    const m = sweep(pink(dur, seed), "bp", (t) => 380 + 260 * Math.sin(TAU * 0.07 * t + seed) + 120 * Math.sin(TAU * 0.19 * t), 1.2);
    mulEnv(m, (t) => 0.55 + 0.45 * Math.sin(TAU * 0.05 * t + seed * 2));
    addMono(s, m, 0, 1, pan);
  }
  return normRms(loopify(s, loop), -25);
};

AMB.rain = (loop = 20) => {
  const dur = loop + 2;
  const s = stereo(dur);
  const r = rng(51);
  addMono(s, filt(white(dur, 52), "hp", 1200), 0, 0.12, -0.3);
  addMono(s, filt(white(dur, 53), "hp", 1200), 0, 0.12, 0.3);
  addMono(s, filt(brown(dur, 54), "lp", 300), 0, 0.5);
  for (let t = 0; t < dur; t += -Math.log(1 - r()) / 40) {
    const d = filt(mulEnv(white(0.006, Math.floor(t * 997)), env.exp(0.0015, 0.0002)), "bp", 3000 + r() * 4000, 2);
    addMono(s, d, t, 0.08 * r(), r() * 2 - 1);
  }
  return normRms(loopify(s, loop), -24);
};

AMB.battle_distant = (loop = 24) => {
  const dur = loop + 3;
  const s = stereo(dur);
  const r = rng(61);
  addMono(s, filt(brown(dur, 62), "lp", 160), 0, 1);
  for (let t = 0.5; t < dur - 2; t += 0.8 + r() * 2.2) {
    const b = filt(SFX.impact(Math.floor(t * 10))[0].slice(0, N(2)), "lp", 300);
    addMono(s, b, t, 0.25 + r() * 0.2, r() * 1.6 - 0.8);
  }
  for (let t = 0.2; t < dur - 1; t += 0.15 + r() * 1.2) {
    const g = filt(SFX.gunshot(Math.floor(t * 31))[0].slice(0, N(0.6)), "lp", 1800);
    addMono(s, g, t, 0.05 + r() * 0.05, r() * 1.8 - 0.9);
  }
  return normRms(reverb(loopify(s, loop), { room: 0.8, wet: 0.2 }), -24);
};

// ---------------------------------------------------------------------------
// Music beds (seamless loops)

const chordNotes = {
  Dm: ["D3", "F3", "A3"], Bb: ["Bb2", "D3", "F3"], Gm: ["G2", "Bb2", "D3"], A: ["A2", "C#3", "E3"],
  C: ["C3", "E3", "G3"], F: ["F2", "A2", "C3"], Am: ["A2", "C3", "E3"], G: ["G2", "B2", "D3"],
  Fmaj7: ["F2", "A2", "C3", "E3"], Em: ["E2", "G2", "B2"],
};
const up = (n, oct) => n.replace(/-?\d$/, (d) => String(Number(d) + oct));

const taiko = (seed, big = false) => {
  const d = big ? 1.2 : 0.7;
  const body = sine(d, (t) => (big ? 48 : 70) + (big ? 70 : 90) * Math.exp(-t / 0.03), env.exp(big ? 0.35 : 0.18, 0.001));
  const skin = filt(mulEnv(white(0.1, seed), env.exp(0.02, 0.0005)), "lp", 1100);
  return sat(mix([body, 1], [skin, 0.5]), 1.3);
};
const shaker = (seed) => filt(mulEnv(white(0.06, seed), env.bell(0.06, 0.3, 1)), "hp", 6000);
const woodblock = (f = 1100) => mix([sine(0.08, f, env.exp(0.012, 0.0005)), 1], [sine(0.08, f * 2.7, env.exp(0.006, 0.0005)), 0.4]);
const marimba = (f, sec = 1.2) => mix([sine(sec, f, env.exp(0.35, 0.002)), 1], [sine(sec, f * 4, env.exp(0.06, 0.001)), 0.25], [sine(sec, f * 9.9, env.exp(0.015, 0.0005)), 0.08]);
const stab = (f, sec, seed) => {
  const m = mix(...[0, 7, -7].map((c, i) => [osc(sec, () => f * Math.pow(2, c / 1200), () => 1, "saw"), 0.33]));
  sweep(m, "lp", (t) => 300 + 1600 * Math.exp(-t / 0.08), 0.9);
  return mulEnv(m, env.adsr(0.008, 0.12, 0.4, 0.06, sec - 0.06));
};
const brass = (f, sec) => {
  const m = mix(...[0, 5, -5].map((c) => [osc(sec, () => f * Math.pow(2, c / 1200), () => 1, "saw"), 0.33]));
  sweep(m, "lp", (t) => 250 + 1500 * Math.min(1, t / (sec * 0.5)), 0.8);
  return sat(mulEnv(m, env.adsr(sec * 0.35, 0.2, 0.9, 0.5, sec - 0.5)), 1.5);
};

const MUSIC = {};

MUSIC.tension = () => {
  const bpm = 100;
  const beat = 60 / bpm;
  const bars = 8;
  const loop = bars * 4 * beat;
  const s = stereo(loop + 4);
  const prog = ["Dm", "Dm", "Bb", "Bb", "Gm", "Gm", "A", "A"];
  prog.forEach((ch, b) => {
    const t0 = b * 4 * beat;
    if (b % 2 === 0) chordNotes[ch].forEach((n, i) => addMono(s, padVoice(note(n), 8 * beat + 0.8, { cutoff: 900, seed: b * 7 + i }), t0, 0.16, i * 0.4 - 0.4));
    const root = chordNotes[ch][0];
    // staccato string ostinato on 8ths
    const acc = [1, 0.5, 0.8, 0.5, 1, 0.8, 0.5, 0.7];
    for (let k = 0; k < 8; k++) {
      addMono(s, stab(note(up(root, -1)), beat * 0.42, b * 8 + k), t0 + k * beat * 0.5, 0.22 * acc[k], -0.25);
      addMono(s, stab(note(root), beat * 0.4, b * 8 + k + 100), t0 + k * beat * 0.5, 0.1 * acc[k], 0.3);
    }
    // pizz arpeggio
    const ar = [0, 1, 2, 1, 0, 2, 1, 2];
    for (let k = 0; k < 8; k++) addMono(s, pluck(note(up(chordNotes[ch][ar[k]], 1)), 1.2, { seed: b * 9 + k, decay: 0.994 }), t0 + k * beat * 0.5 + beat * 0.25, 0.1, 0.5);
    // percussion
    addMono(s, taiko(b * 3, true), t0, 0.5);
    addMono(s, taiko(b * 3 + 1), t0 + 1.5 * beat, 0.35, -0.1);
    if (b % 2 === 1) addMono(s, taiko(b * 3 + 2), t0 + 3.5 * beat, 0.3, 0.1);
    for (let k = 0; k < 16; k++) addMono(s, shaker(b * 16 + k), t0 + k * beat * 0.25, k % 4 === 2 ? 0.05 : 0.025, 0.4);
    for (let k = 0; k < 4; k++) addMono(s, woodblock(k % 2 ? 950 : 1250), t0 + k * beat, 0.05, -0.5);
  });
  const out = loopify(reverb(s, { room: 0.8, wet: 0.22, damp: 0.4 }), loop, 0.05);
  return normRms(out, -18);
};

MUSIC.curious = () => {
  const bpm = 112;
  const beat = 60 / bpm;
  const bars = 8;
  const loop = bars * 4 * beat;
  const s = stereo(loop + 4);
  const prog = ["C", "Fmaj7", "Am", "G", "C", "Fmaj7", "Em", "G"];
  prog.forEach((ch, b) => {
    const t0 = b * 4 * beat;
    const cn = chordNotes[ch];
    chordNotes[ch].slice(0, 3).forEach((n, i) => addMono(s, padVoice(note(up(n, 1)), 4 * beat + 0.6, { cutoff: 1400, attack: 0.3, seed: b * 5 + i }), t0, 0.06, i * 0.5 - 0.5));
    // marimba arpeggio 8ths
    const pat = [0, 2, 1, 2, 3 % cn.length, 2, 1, 2];
    for (let k = 0; k < 8; k++) addMono(s, marimba(note(up(cn[pat[k] % cn.length], 2))), t0 + k * beat * 0.5, 0.18, 0.35);
    // pizzicato bass on beats 1 and 3, pickup on 4&
    addMono(s, pluck(note(up(cn[0], -1)), 1.5, { seed: b, decay: 0.993, bright: 0.2 }), t0, 0.5, -0.2);
    addMono(s, pluck(note(up(cn[2] ?? cn[0], -1)), 1.5, { seed: b + 50, decay: 0.993, bright: 0.2 }), t0 + 2 * beat, 0.45, -0.2);
    addMono(s, pluck(note(up(cn[0], -1)), 0.8, { seed: b + 90, decay: 0.99, bright: 0.2 }), t0 + 3.5 * beat, 0.3, -0.2);
    // snaps on 2 and 4, shaker
    for (const k of [1, 3]) addMono(s, filt(mulEnv(white(0.05, b * 4 + k), env.exp(0.01, 0.0005)), "bp", 2200, 1.2), t0 + k * beat, 0.25, 0.2);
    for (let k = 0; k < 8; k++) addMono(s, shaker(b * 30 + k), t0 + k * beat * 0.5 + beat * 0.25, 0.03, -0.4);
  });
  return normRms(loopify(reverb(s, { room: 0.6, wet: 0.18 }), loop, 0.05), -18);
};

MUSIC.somber = () => {
  const bpm = 72;
  const beat = 60 / bpm;
  const bars = 8;
  const loop = bars * 4 * beat;
  const s = stereo(loop + 6);
  const prog = ["Am", "F", "C", "G", "Am", "F", "Em", "Am"];
  prog.forEach((ch, b) => {
    const t0 = b * 4 * beat;
    const cn = chordNotes[ch];
    cn.forEach((n, i) => addMono(s, padVoice(note(n), 4 * beat + 1.2, { cutoff: 700, attack: 1.0, release: 1.2, seed: b * 3 + i }), t0, 0.12, i * 0.5 - 0.5));
    addMono(s, piano(note(up(cn[0], -1)), 4 * beat + 1, 0.8, b), t0, 0.5, -0.2);
    const arp = [0, 1, 2, 1, 2, 1, 0, 1];
    for (let k = 0; k < 8; k++) addMono(s, piano(note(up(cn[arp[k]], 1)), 2.5, 0.5 + (k === 0 ? 0.2 : 0), b * 10 + k), t0 + k * beat * 0.5, 0.32, 0.3 - (k % 3) * 0.2);
  });
  return normRms(loopify(reverb(s, { room: 0.9, wet: 0.35, damp: 0.3 }), loop, 0.05), -19);
};

MUSIC.epic = () => {
  const bpm = 90;
  const beat = 60 / bpm;
  const bars = 8;
  const loop = bars * 4 * beat;
  const s = stereo(loop + 4);
  const prog = ["Dm", "Dm", "Bb", "Bb", "Gm", "Gm", "A", "A"];
  prog.forEach((ch, b) => {
    const t0 = b * 4 * beat;
    const cn = chordNotes[ch];
    if (b % 2 === 0) {
      cn.forEach((n, i) => addMono(s, padVoice(note(n), 8 * beat + 0.8, { cutoff: 1200, seed: b * 7 + i }), t0, 0.14, i * 0.4 - 0.4));
      addMono(s, brass(note(up(cn[0], -1)), 8 * beat), t0, 0.22, -0.2);
      addMono(s, brass(note(up(cn[2], -1)), 8 * beat), t0, 0.14, 0.2);
    }
    for (let k = 0; k < 16; k++) addMono(s, stab(note(cn[k % 2 ? 2 : 0]), beat * 0.22, b * 16 + k), t0 + k * beat * 0.25, 0.09 * (k % 4 === 0 ? 1.3 : 1), k % 2 ? 0.35 : -0.35);
    const hits = [[0, true], [0.75, false], [1.5, false], [2, true], [2.5, false], [3, false], [3.5, false]];
    for (const [k, big] of hits) addMono(s, taiko(b * 10 + k * 4, big), t0 + k * beat, big ? 0.6 : 0.35, big ? 0 : (k * 0.3) % 0.6 - 0.3);
  });
  return normRms(loopify(reverb(s, { room: 0.88, wet: 0.25 }), loop, 0.05), -17);
};

// ---------------------------------------------------------------------------

// one-shots get a short tail fade so nothing clicks at the end
for (const k of Object.keys(SFX)) {
  const fn = SFX[k];
  SFX[k] = (...a) => fade(fn(...a), 0.0005, k === "riser" || k === "swell" ? 0.01 : 0.06);
}

const jobs = [
  ...Object.entries(SFX).map(([k, fn]) => [`sfx/${k}.wav`, () => fn()]),
  ["sfx/whoosh_soft.wav", () => SFX.whoosh(9, 0.8, 180, 1800)],
  ["sfx/whoosh_fast.wav", () => SFX.whoosh(5, 0.32, 400, 4800)],
  ["sfx/footstep2.wav", () => SFX.footstep(2)],
  ["sfx/footstep3.wav", () => SFX.footstep(3)],
  ["sfx/footstep4.wav", () => SFX.footstep(4)],
  ["sfx/page_flip2.wav", () => SFX.page_flip(7)],
  ["sfx/impact2.wav", () => SFX.impact(9)],
  ...Object.entries(AMB).map(([k, fn]) => [`amb/${k}.wav`, () => fn()]),
  ...Object.entries(MUSIC).map(([k, fn]) => [`music/${k}.wav`, () => fn()]),
];

const only = process.env.ONLY ? new RegExp(process.env.ONLY) : null;
const ifMissing = process.argv.includes("--if-missing");
for (const [file, fn] of jobs) {
  if (only && !only.test(file)) continue;
  if (ifMissing && fs.existsSync(path.join(OUT, file))) continue;
  const t = Date.now();
  const [L, R] = fn();
  writeWav(path.join(OUT, file), L, R);
  console.log(`${file.padEnd(28)} ${(L.length / SR).toFixed(2)}s  ${Date.now() - t}ms`);
}
