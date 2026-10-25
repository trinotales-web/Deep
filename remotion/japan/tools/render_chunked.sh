#!/bin/bash
# Render a long composition in chunks (with retries), render its audio once,
# then join everything. Usage:
#   remotion/japan/tools/render_chunked.sh <CompositionId> <totalFrames> <out.mp4> [chunkFrames] [workDir]
set -e
COMP=$1; TOTAL=$2; OUT=$3; CHUNK=${4:-1020}; WORK=${5:-out/chunks_$COMP}
BROWSER=${REMOTION_BROWSER:+--browser-executable=$REMOTION_BROWSER}
OPTS="--concurrency=3 --timeout=120000 $BROWSER --crf=17 --log=error --muted"
mkdir -p "$WORK"
: > "$WORK/list.txt"
for ((a = 0; a < TOTAL; a += CHUNK)); do
  b=$((a + CHUNK - 1)); ((b >= TOTAL)) && b=$((TOTAL - 1))
  part="$WORK/${COMP}_${a}-${b}.mp4"
  if [ ! -s "$part" ]; then
    for attempt in 1 2 3; do
      if npx remotion render "$COMP" "$part" --frames=$a-$b $OPTS; then break; fi
      echo "chunk $a-$b failed (attempt $attempt)"; rm -f "$part"
    done
  fi
  [ -s "$part" ] || { echo "CHUNK_FAILED $a-$b"; exit 1; }
  echo "file '$(basename "$part")'" >> "$WORK/list.txt"
  echo "chunk $a-$b done"
done
npx remotion render "$COMP" "$WORK/audio.wav" --codec=wav $BROWSER --log=error
ffmpeg -v error -y -f concat -safe 0 -i "$WORK/list.txt" -i "$WORK/audio.wav" -map 0:v -map 1:a \
  -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart "$OUT"
echo "RENDER_OK $OUT"
