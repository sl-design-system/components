---
topic: state-detection
applies_to: [sl-ds]
last_updated: 2026-06-09
---

# State Detection — Sub-Agent Contract

> **Purpose:** Loaded by `/sl-ds` Step 1 Haiku sub-agent. Defines exact bash commands to run, what to parse from each output, and the JSON schema the sub-agent must return. Self-contained: this file alone is enough for a Haiku sub-agent in clean context to do the job.

## 1. Inputs

- Workspace root: current working directory
- No other inputs needed

## 2. Bash commands to run (in order, capture stdout)

### 2.1 Config presence + framework

```bash
if [ -f .sl-ds-config.yaml ]; then
  echo "CONFIG=yes"
  grep -E '^\s*framework:' .sl-ds-config.yaml | head -1 | sed 's/.*framework:\s*//;s/[" ]//g'
else
  echo "CONFIG=no"
fi
```

### 2.2 Package.json framework deps (cross-check)

```bash
if [ -f package.json ]; then
  if grep -q '"@angular/core"' package.json; then echo "PKG=angular"
  elif grep -q '"react"' package.json; then echo "PKG=react"
  elif grep -q '"vue"' package.json; then echo "PKG=vue"
  else echo "PKG=unknown"
  fi
else
  echo "PKG=no-package-json"
fi
```

### 2.3 Pipeline state files

```bash
ls -1 .sl-ds-cache/sl-ds-impl/pipeline-state.json 2>/dev/null
ls -1 .sl-ds-cache/sl-ds-impl/*.json 2>/dev/null | wc -l
```

If `pipeline-state.json` exists, read it FULLY and parse:

```bash
cat .sl-ds-cache/sl-ds-impl/pipeline-state.json
```

Extract:
- `screen` (e.g. `teacher-dashboard`)
- `figmaUrl`
- `figmaLastModified`
- `lastModifiedCheckedAt`
- `completed` (object — keys are skill IDs)
- `pending` (array)
- `failed` (array)

### 2.4 Decision documents

```bash
ls -1 context/foundation/sl-ds-decisions/*.md 2>/dev/null
```

For each, read frontmatter only:

```bash
head -15 context/foundation/sl-ds-decisions/<file>.md
```

Extract: `screen`, `status`, `updated`, `figma_url`.

### 2.5 Git uncommitted DS work

```bash
git status --porcelain 2>/dev/null | grep -E '(\.agents-v2/skills/sl-ds|sl-ds-cache|sl-ds-decisions|teacher-dashboard|max-)' || echo "CLEAN"
```

### 2.6 Figma URL freshness (if pipeline-state has a URL)

This requires a Figma tool call — but the sub-agent is Haiku and doesn't have Figma access in clean context. **Do NOT call Figma here.** Instead, compare cached `figmaLastModified` against `lastModifiedCheckedAt`:

- If `lastModifiedCheckedAt` is < 1 hour old → trust `figmaChangedSinceCache: false`
- If older → set `figmaChangedSinceCache: "unknown"` (the actual `/sl-ds-update` skill will check Figma)

This keeps the router cheap. Figma API calls happen in the dispatched skill, not in routing.

## 3. State categorization

After collecting all data, classify the project state:

| Condition | `pipelineState` value |
|---|---|
| No `.sl-ds-config.yaml` | `virgin` |
| Config exists, no `pipeline-state.json` | `configured` |
| `pipeline-state.json` exists, `pending` is non-empty, `failed` is empty | `in-progress` |
| `pending` empty, `failed` empty, `figmaChangedSinceCache: false` | `completed-fresh` |
| `pending` empty, `failed` empty, `figmaChangedSinceCache: true` | `completed-stale` |
| `failed` is non-empty | `failed` |
| Multiple `sl-ds-decisions/*.md` with different screens | `multi-screen` (treat as `in-progress` for the most recently-updated screen) |

If config exists but says `framework: <anything-other-than-angular>` → add flag `frameworkUnsupported: true` and surface the v1-Angular-only scope (fe-standards live at `.agents/standards/fe/`, only `angular.md` (NG-*) + `sanoma-ds.md` (SDS-*) are framework-specific). Router redirects to refusal flow rather than dispatching to skills that would fail downstream.

## 4. Output JSON schema

The sub-agent MUST write this exact structure to `.sl-ds-cache/sl-ds-router/state.json`:

```json
{
  "schemaVersion": "1.0.0",
  "producedBy": "sl-ds-router/state-detector",
  "producedAt": "2026-06-09T15:00:00Z",

  "configExists": true,
  "configFramework": "angular",
  "packageFramework": "angular",
  "frameworkMismatch": false,
  "frameworkStub": false,

  "pipelineState": "in-progress",
  "currentScreen": "teacher-dashboard",

  "completed": ["sl-ds-setup", "sl-ds-layout"],
  "pending": ["sl-ds-tokens", "sl-ds-plan", "sl-ds-implement", "sl-ds-verify"],
  "failed": [],

  "figmaUrl": "https://www.figma.com/design/abc/Project?node-id=1-185",
  "figmaLastModified": "2026-06-08T10:00:00Z",
  "lastModifiedCheckedAt": "2026-06-09T13:00:00Z",
  "figmaChangedSinceCache": false,

  "decisionDocs": [
    { "screen": "teacher-dashboard", "status": "in-progress", "updated": "2026-06-09" }
  ],

  "uncommittedDsWork": false,
  "uncommittedFiles": []
}
```

**Required vs optional:**
- `schemaVersion`, `producedBy`, `producedAt`, `pipelineState` — always present
- `configExists`, `completed`, `pending`, `failed`, `uncommittedDsWork` — always present (empty arrays/false if N/A)
- `currentScreen`, `figmaUrl`, `figmaLastModified` — null if not detected
- `decisionDocs` — empty array if none

## 5. Error handling

If any bash command errors out or returns unexpected output:

1. **Don't abort** — collect what you can
2. Set the unknown fields to `null` or empty array
3. Add an `errors` field:

```json
{
  ...,
  "errors": [
    { "step": "2.3", "reason": "pipeline-state.json malformed JSON" }
  ]
}
```

4. Set `pipelineState: "unknown"` only if BOTH config AND pipeline-state are unreadable

## 6. Performance budget

Total bash work: ~10-15 file reads + 1 git command. Should complete in <2s on any reasonable repo. Sub-agent output: <3 KB.

If sub-agent finds itself reading more than 5 files from `.sl-ds-cache/`, that's a sign of bug — STOP and return what you have with `errors[]` populated.

## 7. What NOT to do

- ❌ Don't call Figma MCP — that's the dispatched skill's job
- ❌ Don't run `npx nx`, build, or any long-running command
- ❌ Don't modify any file outside `.sl-ds-cache/sl-ds-router/`
- ❌ Don't try to infer "what skill to run next" — that's the orchestrator's decision tree (Step 3 of /sl-ds), not yours
- ❌ Don't fetch from network
- ❌ Don't read large files (`figma-to-slds-mapping.json` is 30K — skip)
