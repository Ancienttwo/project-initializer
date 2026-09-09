#!/usr/bin/env bash
set -euo pipefail
# Pack through the release artifact boundary; do not install the checkout globally.
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
context="$(mktemp -d "${TMPDIR:-/tmp}/campaign-image.XXXXXX")"
trap 'rm -rf "$context"' EXIT
cd "$root"
bun pm pack --destination "$context" >&2
archive="$context/repo-harness-$(bun -e 'console.log(JSON.parse(require("fs").readFileSync("package.json","utf8")).version)').tgz"
test -f "$archive"
mv "$archive" "$context/repo-harness.tgz"
cp bun.lock deploy/campaign-container/Dockerfile deploy/campaign-container/campaign-init.c "$context/"
shasum -a 256 "$context/repo-harness.tgz" "$context/bun.lock" >&2
docker build --iidfile "$context/image-id" "$context" >&2
printf '%s\n' "$(cat "$context/image-id")"
