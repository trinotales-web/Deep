import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Player, PlayerRef } from "@remotion/player";
import { prefetch } from "remotion";
import { FULL_DURATION, JapanFull } from "../japan/Full";
import { PART1_DURATION } from "../japan/Part1";
import { PART2_DURATION } from "../japan/Part2";
import { PART3_DURATION } from "../japan/Part3";
import { PART4_DURATION } from "../japan/Part4";
import { PART5_DURATION } from "../japan/Part5";
import { PART6_DURATION } from "../japan/Part6";
import { PART7_DURATION } from "../japan/Part7";
import { PART8_DURATION } from "../japan/Part8";

// The audio, fonts and textures are published next to this page, so point
// Remotion's staticFile() at them by their real URLs. The .m4a audio is served
// under .mp4 names (the same container), which static hosts serve more widely.
const assetUrl = (name: string) => new URL(name.replace(/\.m4a$/, ".mp4"), document.baseURI).href;
const ASSETS = [
  ...[1, 2, 3, 4, 5, 6, 7, 8].flatMap((n) => [`japan/music_p${n}.m4a`, `japan/narration_p${n}.m4a`]),
  "japan/fonts/PatrickHand.woff2",
  "japan/fonts/GochiHand.woff2",
  "japan/fonts/KalamBold.woff2",
  "japan/pencil.png",
  "japan/paper.jpg",
  "japan/grain.jpg",
];
window.remotion_staticFiles = ASSETS.map((name) => ({
  name,
  src: assetUrl(name),
  sizeInBytes: 0,
  lastModified: 0,
}));

// Load each part's audio into the browser so jumping around always works,
// even where the host can't serve byte ranges. Parts load in order; a part
// you jump to goes first.
const loading = new Map<number, Promise<void>>();
const loadPart = (n: number) => {
  if (!loading.has(n)) {
    const files = [`japan/narration_p${n}.m4a`, `japan/music_p${n}.m4a`].map(assetUrl);
    loading.set(
      n,
      Promise.all(files.map((src) => prefetch(src, { method: "blob-url", contentType: "audio/mp4" }).waitUntilDone())).then(() => undefined),
    );
  }
  return loading.get(n)!;
};

const FPS = 30;
const PARTS = [
  { title: "Where it all began", frames: PART1_DURATION },
  { title: "Gods, emperors & samurai", frames: PART2_DURATION },
  { title: "Ninjas, Mongols & a divine wind", frames: PART3_DURATION },
  { title: "Kyoto burns & the warring states", frames: PART4_DURATION },
  { title: "Guns change everything", frames: PART5_DURATION },
  { title: "The fool of Owari", frames: PART6_DURATION },
  { title: "The bird that would not sing", frames: PART7_DURATION },
  { title: "250 years of peace", frames: PART8_DURATION },
].reduce<{ title: string; frames: number; start: number }[]>((acc, p) => {
  const start = acc.length ? acc[acc.length - 1].start + acc[acc.length - 1].frames : 0;
  return [...acc, { ...p, start }];
}, []);

const clock = (frames: number) => {
  const s = Math.round(frames / FPS);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

const dB = (v: number) => (v <= 0 ? "off" : `${v >= 1 ? "+" : ""}${(20 * Math.log10(v)).toFixed(1)} dB`.replace("+0.0", "0.0"));

const Channel: React.FC<{
  id: string;
  label: string;
  hint: string;
  value: number;
  muted: boolean;
  onChange: (v: number) => void;
  onMute: () => void;
}> = ({ id, label, hint, value, muted, onChange, onMute }) => (
  <div className="channel">
    <div className="channel-head">
      <label htmlFor={id}>{label}</label>
      <span className="readout">{muted ? "muted" : `${Math.round(value * 100)}% · ${dB(value)}`}</span>
    </div>
    <div className="channel-row">
      <input
        id={id}
        type="range"
        min={0}
        max={200}
        step={5}
        value={Math.round(value * 100)}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
        aria-describedby={`${id}-hint`}
      />
      <button type="button" className={muted ? "mute on" : "mute"} onClick={onMute} aria-pressed={muted}>
        {muted ? "Unmute" : "Mute"}
      </button>
    </div>
    <p className="hint" id={`${id}-hint`}>
      {hint}
    </p>
  </div>
);

const App: React.FC = () => {
  const player = useRef<PlayerRef>(null);
  const [voice, setVoice] = useState(1);
  const [music, setMusic] = useState(1);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [musicMuted, setMusicMuted] = useState(false);
  const [frame, setFrame] = useState(0);
  const [copied, setCopied] = useState(false);
  const [ready, setReady] = useState<boolean[]>(() => new Array(8).fill(false));

  const markReady = useCallback((i: number) => setReady((r) => r.map((v, k) => (k === i ? true : v))), []);
  const fetchPart = useCallback((i: number) => loadPart(i + 1).then(() => markReady(i)).catch(() => undefined), [markReady]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (let i = 0; i < 8 && !cancelled; i++) await fetchPart(i);
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchPart]);

  const inputProps = useMemo(
    () => ({ narrationVolume: voiceMuted ? 0 : voice, musicVolume: musicMuted ? 0 : music }),
    [voice, music, voiceMuted, musicMuted],
  );

  useEffect(() => {
    const p = player.current;
    if (!p) return;
    const onFrame = (e: { detail: { frame: number } }) => setFrame(e.detail.frame);
    p.addEventListener("frameupdate", onFrame);
    p.addEventListener("seeked", onFrame);
    return () => {
      p.removeEventListener("frameupdate", onFrame);
      p.removeEventListener("seeked", onFrame);
    };
  }, []);

  const current = PARTS.findIndex((p) => frame >= p.start && frame < p.start + p.frames);
  const jump = useCallback(
    (i: number) => {
      fetchPart(i);
      player.current?.seekTo(PARTS[i].start);
      player.current?.play();
    },
    [fetchPart],
  );
  const readyCount = ready.filter(Boolean).length;

  const command = `npx remotion render JapanFull out/japan_full.mp4 --props='{"musicVolume":${inputProps.musicVolume},"narrationVolume":${inputProps.narrationVolume}}'`;
  const copy = () => {
    navigator.clipboard
      ?.writeText(command)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      })
      .catch(() => {
        const el = document.getElementById("render-cmd");
        if (el) window.getSelection()?.selectAllChildren(el);
      });
  };

  return (
    <div className="page">
      <header className="masthead">
        <h1>History of Japan</h1>
        <p>
          8 parts · {clock(FULL_DURATION)} · your voice-over and the original score on separate faders
        </p>
      </header>

      <div className="sheet">
        <Player
          ref={player}
          component={JapanFull}
          inputProps={inputProps}
          durationInFrames={FULL_DURATION}
          fps={FPS}
          compositionWidth={1920}
          compositionHeight={1080}
          style={{ width: "100%", aspectRatio: "16 / 9" }}
          controls
          clickToPlay
          allowFullscreen
          spaceKeyToPlayOrPause
          showVolumeControls
          acknowledgeRemotionLicense
        />
      </div>

      <div className="desk">
        <section className="panel mixer" aria-labelledby="mixer-title">
          <h2 id="mixer-title">Mixer</h2>
          <Channel
            id="voice"
            label="Voice-over"
            hint="Your narration, all eight parts."
            value={voice}
            muted={voiceMuted}
            onChange={setVoice}
            onMute={() => setVoiceMuted((m) => !m)}
          />
          <Channel
            id="music"
            label="Background music"
            hint="The score, already ducked under the voice. 100% is the mix as delivered."
            value={music}
            muted={musicMuted}
            onChange={setMusic}
            onMute={() => setMusicMuted((m) => !m)}
          />
          <div className="actions">
            <button
              type="button"
              onClick={() => {
                setVoice(1);
                setMusic(1);
                setVoiceMuted(false);
                setMusicMuted(false);
              }}
            >
              Reset levels
            </button>
          </div>
          <div className="render">
            <p>Render the full video with these levels:</p>
            <code id="render-cmd">{command}</code>
            <button type="button" onClick={copy}>
              {copied ? "Copied" : "Copy command"}
            </button>
          </div>
        </section>

        <section className="panel parts" aria-labelledby="parts-title">
          <h2 id="parts-title">Parts</h2>
          <p className="status" aria-live="polite">
            {readyCount === 8 ? "All audio loaded." : `Loading audio: ${readyCount} of 8 parts ready.`}
          </p>
          <ol>
            {PARTS.map((p, i) => (
              <li key={i}>
                <button type="button" className={i === current ? "part active" : "part"} onClick={() => jump(i)} aria-current={i === current}>
                  <span className="num">Part {i + 1}</span>
                  <span className="name">{p.title}</span>
                  <span className="time">
                    {clock(p.start)} <span className="len">· {clock(p.frames)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
};

createRoot(document.getElementById("app")!).render(<App />);
