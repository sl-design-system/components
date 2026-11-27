#!/usr/bin/env bash
# Stop hook: run the unit tests related to uncommitted changes in packages/components.
# Exit 2 keeps Claude working with the failures; a second stop in a row is let through.
set -uo pipefail

input="$(cat)"
[ "$(jq -r '.stop_hook_active // false' <<<"$input")" = "true" ] && exit 0

root="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel)}"
cd "$root" || exit 0

# Nothing to test unless component code changed (staged, unstaged or untracked).
[ -n "$(git status --porcelain -- packages/components)" ] || exit 0

if ! out="$(node_modules/.bin/vitest run --project=unit --changed --passWithNoTests 2>&1)"; then
  # A missing browser is a setup problem, not a test failure: tell the user, don't block.
  if grep -q "browserType.launch: Executable doesn't exist" <<<"$out"; then
    echo '{"systemMessage": "Changed-tests hook skipped: Playwright Chromium is not installed. Run: yarn playwright install chromium"}'
    exit 0
  fi
  printf 'Unit tests related to your changes failed:\n%s\n' "$(tail -n 60 <<<"$out")" >&2
  exit 2
fi
exit 0
