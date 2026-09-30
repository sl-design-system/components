#!/usr/bin/env bash
# Starts the minimal render harness used by Stage 4 of the reference batch.
#
# Run it once; every generated run under `examples/lit/src/_runs/` is picked up by the same
# server, including folders created after it started. Do not start a second one — the batch's
# run agents share this instance.
set -euo pipefail

cd "$(dirname "$0")/../.."

node runs/harness/link-workspaces.mjs

# The token is never used to fetch anything: it only satisfies yarn's variable expansion in
# `.yarnrc.yml`. See `runs/BATCH-RUNBOOK.md` for why Font Awesome is out of the picture entirely.
exec env FONT_AWESOME_AUTH_TOKEN=dummy \
  npx storybook dev -c .storybook-runs -p 6010 --no-open --quiet
