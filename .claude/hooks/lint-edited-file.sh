#!/usr/bin/env bash
# PostToolUse hook (Edit|Write): ESLint the component file Claude just changed.
# Runs in the background (asyncRewake); exit 2 wakes Claude with the lint output.
# CSS is left out until packages/components/stylelint.config.mjs passes on the
# existing stylesheets (its custom-property-pattern rejects the camelCase tokens).
set -uo pipefail

root="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel)}"
file="$(jq -r '.tool_input.file_path // .tool_response.filePath // empty')"
[ -n "$file" ] || exit 0

rel="${file#"$root"/}"
cd "$root" || exit 0
[ -f "$rel" ] || exit 0

case "$rel" in
  packages/components/*.ts) ;;
  *) exit 0 ;;
esac

if ! out="$(node_modules/.bin/eslint --config packages/components/eslint.config.mjs "$rel" 2>&1)"; then
  printf 'ESLint failed for %s:\n%s\n' "$rel" "$out" >&2
  exit 2
fi
exit 0
