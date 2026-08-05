#!/usr/bin/env bash
# post-build.sh — conditionally prefix asset paths for /hermes-control-room/ subpath.
# When VITE_BASE=/, paths are already root-relative and NO prefix is needed.
set -euo pipefail

DIST="${1:-dist}"
PREFIX="/hermes-control-room"

# Detect whether the bundle uses /hermes-control-room/ already.
# If VITE_BASE is set to /, skip the prefix rewrite entirely.
if [ "${VITE_BASE:-}" = "/" ]; then
  echo "post-build: VITE_BASE=/, skipping prefix rewrite"
  exit 0
fi

# Skip if no /sprites/ or /rooms/ paths exist
if ! grep -rqE '"(/sprites/|/rooms/)' "$DIST/assets/" 2>/dev/null; then
  echo "post-build: no unprefixed paths found, nothing to do"
  exit 0
fi

python3 - "$DIST/assets" "$PREFIX" << 'PYEOF'
import os, re, sys
target_dir, prefix = sys.argv[1], sys.argv[2]
js_quoted_re   = re.compile(r"([\`'\"])(/sprites/[^\`'\"]*)\1")
js_rooms_re    = re.compile(r"([\`'\"])(/rooms/[^\`'\"]*)\1")
css_sprites_re = re.compile(r"url\(/(sprites/[^)]*)\)")
css_rooms_re   = re.compile(r"url\(/(rooms/[^)]*)\)")

for fname in os.listdir(target_dir):
    fpath = os.path.join(target_dir, fname)
    if not os.path.isfile(fpath): continue
    with open(fpath) as f: text = f.read()
    if fname.endswith('.js'):
        new = js_quoted_re.sub(rf"\1{prefix}\2\1", text)
        new = js_rooms_re.sub(rf"\1{prefix}\2\1", new)
    elif fname.endswith('.css'):
        new = css_sprites_re.sub(rf"url({prefix}/\1)", text)
        new = css_rooms_re.sub(rf"url({prefix}/\1)", new)
    else: continue
    if new != text:
        with open(fpath, 'w') as f: f.write(new)
        print(f"  {fname}: prefixed")
PYEOF

echo "post-build: asset paths prefixed with ${PREFIX}"
