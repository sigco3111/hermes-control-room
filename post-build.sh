#!/usr/bin/env bash
set -euo pipefail

DIST="${1:-dist}"
PREFIX="/hermes-control-room"

python3 - "$DIST/assets" "$PREFIX" << 'PYEOF'
import os, re, sys
target_dir, prefix = sys.argv[1], sys.argv[2]

# Match absolute paths in JS: "/sprites/..." or "/rooms/..." inside any quote
js_sprites_quoted = re.compile(r"([\`'\"])(/sprites/[^\`'\"]*)\1")
js_rooms_quoted = re.compile(r"([\`'\"])(/rooms/[^\`'\"]*)\1")
# Match template literal paths like `${re}rooms/...` (no leading slash)
js_rooms_template = re.compile(r"([\`])(\$\{[^}]+\})rooms/([^\`]*)\1")
# Match CSS url() paths
css_sprites = re.compile(r"url\(/(sprites/[^)]*)\)")
css_rooms = re.compile(r"url\(/(rooms/[^)]*)\)")

for fname in os.listdir(target_dir):
    fpath = os.path.join(target_dir, fname)
    if not os.path.isfile(fpath):
        continue
    with open(fpath, 'r', encoding='utf-8') as f:
        text = f.read()
    original = text
    if fname.endswith('.js'):
        text = js_sprites_quoted.sub(rf"\1{prefix}\2\1", text)
        text = js_rooms_quoted.sub(rf"\1{prefix}\2\1", text)
        text = js_rooms_template.sub(rf"\1\2{prefix}/rooms/\3\1", text)
    elif fname.endswith('.css'):
        text = css_sprites.sub(rf"url({prefix}/\1)", text)
        text = css_rooms.sub(rf"url({prefix}/\1)", text)
    if text != original:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f"  {fname}: prefixed")
PYEOF

echo "post-build: asset paths prefixed with ${PREFIX}"
