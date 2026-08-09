#!/usr/bin/env bash
# Build the image, push it to Docker Hub, then redeploy the docker compose stack.
#
#   ./scripts/release.sh             # build + push + restart compose
#   ./scripts/release.sh --no-push   # build + restart only (skip Docker Hub push)
#   ./scripts/release.sh --no-restart# build + push only (no compose restart)
#
# Requires a working `docker` or `podman` with compose support and, unless
# --no-push is given, a Docker Hub login: `docker login` / `podman login`.

set -euo pipefail

cd "$(dirname "$0")/.."

if command -v docker >/dev/null 2>&1; then
  DOCKER="${DOCKER:-docker}"
elif command -v podman >/dev/null 2>&1; then
  DOCKER="${DOCKER:-podman}"
else
  echo "Error: neither docker nor podman found" >&2
  exit 1
fi
IMAGE="${IMAGE:-docker.io/mauroferra/homeschool:latest}"

PUSH=true
RESTART=true
for arg in "$@"; do
  case "$arg" in
    --no-push) PUSH=false ;;
    --no-restart) RESTART=false ;;
    --help|-h)
      echo "Usage: $0 [--no-push] [--no-restart]"
      exit 0
      ;;
    *)
      echo "Unknown argument: $arg" >&2
      exit 1
      ;;
  esac
done

echo "==> Building $IMAGE"
"$DOCKER" build -t "$IMAGE" .

if [ "$PUSH" = true ]; then
  echo "==> Pushing $IMAGE"
  "$DOCKER" push "$IMAGE"
fi

if [ "$RESTART" = true ]; then
  if "$DOCKER" compose ps -q >/dev/null 2>&1 && [ -n "$("$DOCKER" compose ps -q 2>/dev/null)" ]; then
    echo "==> Stopping running compose stack"
    "$DOCKER" compose down
  else
    echo "==> Compose stack is not running"
  fi

  echo "==> Pulling $IMAGE"
  "$DOCKER" compose pull

  echo "==> Starting compose stack"
  "$DOCKER" compose up -d
fi

echo "==> Done."
