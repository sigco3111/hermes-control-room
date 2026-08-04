#!/usr/bin/env bash
# post-build.sh — 빌드 후 sprite/room path prefix 박기
# vite `base` 설정이 정적 HTML엔 적용되지만 JS 내부 절대경로엔 미적용 → sed로 강제 변환
set -euo pipefail

cd "$(dirname "$0")/.."

JS_FILE=$(ls dist/assets/index-*.js | head -1)
if [ -z "$JS_FILE" ]; then
  echo "[post-build] no index-*.js found in dist/assets/"
  exit 1
fi

echo "[post-build] patching $JS_FILE"
sed -i.bak 's|"/sprites/|"/hermes-control-room/sprites/|g' "$JS_FILE"
sed -i.bak 's|"/rooms/|"/hermes-control-room/rooms/|g' "$JS_FILE"
rm -f "$JS_FILE.bak"

echo "[post-build] done"
