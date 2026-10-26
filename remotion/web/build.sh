#!/bin/bash
# Build the web player page for the Japan series into one folder:
#   remotion/web/build.sh <outDir>
# The folder holds index.html, player.js and the japan/ assets (audio renamed
# from .m4a to .mp4), ready to serve or publish as a static page.
set -e
OUT=${1:?usage: build.sh <outDir>}
ROOT=$(cd "$(dirname "$0")/../.." && pwd)
mkdir -p "$OUT/japan/fonts"
"$ROOT/node_modules/.bin/esbuild" "$ROOT/remotion/web/main.tsx" --bundle --minify --format=iife --target=es2019 \
  --jsx=automatic --define:process.env.NODE_ENV='"production"' --log-level=warning --outfile="$OUT/player.js"
cp "$ROOT/remotion/web/index.html" "$OUT/index.html"
for f in "$ROOT"/public/japan/*.m4a; do cp "$f" "$OUT/japan/$(basename "${f%.m4a}").mp4"; done
cp "$ROOT"/public/japan/*.png "$ROOT"/public/japan/*.jpg "$OUT/japan/"
cp "$ROOT"/public/japan/fonts/*.woff2 "$OUT/japan/fonts/"
echo "built $OUT"
