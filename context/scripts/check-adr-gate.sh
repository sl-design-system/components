#!/usr/bin/env bash
# ADR gate (CONVENTIONS § 18):
#   1. Every ADR (frontmatter `type: decision`) lives under architecture/decisions/:
#      ticket-tied ADRs in the ticket's subfolder architecture/decisions/<JIRA>/ (so all
#      decisions of a ticket are found in one place); repo-wide ADRs (jira: null) flat at
#      the decisions/ root. Nowhere else in the context.
#   2. An ADR may only exist once its driving analysis is APPROVED (`status: done`).
#      Without an approved analysis, architecture/ may hold only general system overviews
#      and draft proposals (`type: architecture`) — not decisions.
#
# Usage: check-adr-gate.sh [CONTEXT_ROOT]
#   CONTEXT_ROOT defaults to "." — pass the context directory in embedded mode.
#
# Exemptions from rule 2 (never from rule 1):
#   - `jira: null` context-wide governance ADRs (no ticket => no analysis to gate on)
#   - `source: confluence` generated mirrors (upstream owns them)
set -euo pipefail

cd "${1:-.}"

fm_field() { # fm_field <file> <field> — first frontmatter occurrence, trimmed
  awk -v f="$2" 'NR==1&&$0!="---"{exit} NR>1&&$0=="---"{exit}
                 $1==f":"{sub(/^[^:]*:[[:space:]]*/,""); print; exit}' "$1"
}

errors=0
say() { echo "$1"; errors=1; }

for file in $(git ls-files '*.md' | grep -v '^_templates/'); do
  [ "$(fm_field "$file" type)" = "decision" ] || continue
  jira=$(fm_field "$file" jira)

  # Rule 1 — location (ticket ADRs in decisions/<JIRA>/, repo-wide ADRs flat in decisions/)
  dir=$(dirname "$file")
  if [ -z "$jira" ] || [ "$jira" = "null" ]; then
    [ "$dir" = "architecture/decisions" ] || \
      say "FAIL [location] $file — context-wide ADRs (jira: null) live flat in architecture/decisions/."
  else
    [ "$dir" = "architecture/decisions/${jira}" ] || \
      say "FAIL [location] $file — ticket ADRs live in architecture/decisions/${jira}/ (per-ticket folder)."
  fi

  # Rule 2 — approved-analysis gate
  [ "$(fm_field "$file" source)" = "confluence" ] && continue
  { [ -z "$jira" ] || [ "$jira" = "null" ]; } && continue

  analysis=$(ls "analyzes/${jira}"-*/analysis.md "analyzes/${jira}"-*.md 2>/dev/null | head -1 || true)
  if [ -z "$analysis" ]; then
    say "FAIL [gate] $file — no analysis found for ${jira} (analyzes/${jira}-*/)."
  else
    status=$(fm_field "$analysis" status)
    if [ "$status" != "done" ]; then
      say "FAIL [gate] $file — analysis ${analysis} has status '${status}', not 'done'."
    fi
  fi
done

if [ "$errors" -ne 0 ]; then
  cat <<'MSG'

ADR gate (CONVENTIONS § 18): a decision record may only be created once its
driving analysis is approved (frontmatter `status: done`).

Until the analysis is approved you may add to architecture/ only:
  - a general overview of the system (`type: architecture`, e.g. ARCH-<slug>.md), or
  - a draft proposal (`type: architecture`, `status: draft`)
— not a `type: decision` document.

When the analysis reaches `status: done`, create the ADR from
_templates/decision.md in architecture/decisions/<JIRA>/ (ticket-tied) or
architecture/decisions/ (context-wide, jira: null) — the only ADR locations.
MSG
  exit 1
fi

echo "OK — ADR gate respected (locations + approved analyses)."
