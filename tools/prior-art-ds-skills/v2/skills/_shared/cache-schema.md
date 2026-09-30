---
topic: cache-schema
applies_to: [sl-ds, sl-ds-setup, sl-ds-layout, sl-ds-tokens, sl-ds-plan, sl-ds-implement, sl-ds-verify, sl-ds-update, sl-ds-audit]
last_updated: 2026-06-09
---

# Cache & Artifact Schema

> **Purpose:** Single contract for every file written under `.sl-ds-cache/` and `context/foundation/sl-ds-decisions/`. Every skill that reads or writes cache MUST conform. Drift here means false cache hits, stale decisions, broken `/sl-ds` routing.

## 1. Directory layout

```
<workspace-root>/
 ├─ .sl-ds-cache/                          ← machine-readable, gitignored
 │   └─ sl-ds-impl/
 │       ├─ pipeline-state.json         ← who-did-what + last-run timestamps
 │       ├─ codebase-analysis.json      ← from sl-ds-setup
 │       ├─ layout-analysis.json        ← from sl-ds-layout
 │       ├─ node-tree.json              ← from sl-ds-tokens (Figma metadata)
 │       ├─ tokens-raw.json             ← from sl-ds-tokens (pre-verify)
 │       ├─ tokens-verified.json        ← from sl-ds-tokens (post-verify, source of truth)
 │       ├─ icons.json                  ← from sl-ds-tokens (icon mapping)
 │       ├─ assets.json                 ← from sl-ds-tokens (image downloads)
 │       ├─ scope.json                  ← from sl-ds-tokens (size assessment)
 │       ├─ architecture.json           ← from sl-ds-plan
 │       ├─ component-map.json          ← from sl-ds-plan (DS component mapping)
 │       ├─ build-result.json           ← from sl-ds-verify
 │       ├─ geometry-result.json        ← from sl-ds-verify
 │       ├─ figma-snapshot.json         ← from sl-ds-update (last-known design state)
 │       └─ audit-report.json           ← from sl-ds-audit
 │
 └─ context/foundation/sl-ds-decisions/    ← human-readable, committed to git
     ├─ layout.md                       ← from sl-ds-layout (shared shell decisions)
     └─ <screen-id>.md                  ← per-screen finalize doc
```

**Rules:**
- `.sl-ds-cache/` is **gitignored** (machine state, regeneratable). Add `.sl-ds-cache/` to `.gitignore` if not present (sl-ds-setup ensures this).
- `context/foundation/sl-ds-decisions/` IS committed — these are auditable decisions.
- Skills NEVER write outside these two directories (except generated code itself, which is the skill's product).

## 2. Cache invalidation signals

Every cached artifact carries an envelope. Skills check the envelope before reusing:

```json
{
  "schemaVersion": "1.2.0",
  "producedBy": "sl-ds-tokens",
  "producedAt": "2026-06-09T14:32:11Z",
  "inputs": {
    "figmaUrl": "https://...",
    "figmaLastModified": "2026-06-08T10:00:00Z",
    "nodeTreeHash": "sha256:8f3a2b...",
    "dsConfigHash": "sha256:abc123...",
    "packageJsonHash": "sha256:def456..."
  },
  "confidence": {
    "level": "high",
    "rationale": "5+ get_variable_defs calls passed all 5 verification gates; cross-node consistent",
    "uncertainAreas": []
  },
  "data": { ... }
}
```

### 2.1 The `confidence` field (v1.1, required for skills that synthesize)

Skills that **synthesize** decisions (`sl-ds-layout`, `sl-ds-plan`, `sl-ds-tokens` after verify, `sl-ds-update` after diff) MUST emit a confidence grade in their cached artifacts. Mechanical skills (`sl-ds-setup` detection, `sl-ds-help`) MAY omit.

| Field | Type | Description |
|---|---|---|
| `confidence.level` | enum | `high` \| `medium` \| `low` |
| `confidence.rationale` | string | One sentence — WHY this grade. Cite evidence. |
| `confidence.uncertainAreas` | string[] | Specific aspects that downstream skills should treat as soft (e.g. `["DOM nesting in hero section", "data-shape of insights API"]`). Empty if all-high. |

**Grading guidance:**

| Level | Meaning | Downstream consequence |
|---|---|---|
| `high` | All gates passed, strong evidence, codebase patterns match | Downstream skills proceed without re-asking |
| `medium` | Most checks pass, one or two uncertain (e.g. icon mapping returned medium confidence from search_design_system) | Downstream MAY surface these in their own confirmations |
| `low` | Significant uncertainty (e.g. < 5 codebase patterns found, ambiguous DOM nesting, malformed Figma data salvaged with heuristics) | Downstream MUST ASK before acting on this artifact's data |

**Example — `sl-ds-plan` writing low-confidence architecture.json:**

```json
{
  "confidence": {
    "level": "low",
    "rationale": "Codebase has only 1 example of Signal Store pattern (libs/auth/), data approach defaulting from single sample",
    "uncertainAreas": ["data-approach choice", "DS component variant for atypical 'tabs' element"]
  }
}
```

`sl-ds-implement` reading this would (per its workflow) detect `confidence.level === "low"` and ASK user to confirm before writing code, instead of trusting the architecture silently.

### Invalidation matrix

| Signal | Affected artifacts | Action |
|---|---|---|
| `figmaLastModified` newer than cached | `node-tree.json`, `tokens-raw.json`, `tokens-verified.json`, `icons.json`, `assets.json` | Trigger `/sl-ds-update`; user decides overwrite/update/redo |
| `nodeTreeHash` differs from cached (even when `figmaLastModified` matches) | All Figma-derived artifacts | Trigger `/sl-ds-update`; defends against Figma metadata lying about lastModified |
| `.sl-ds-config.yaml` changed (hash diff) | `codebase-analysis.json`, framework-rule outputs | Re-run `/sl-ds-setup` |
| `package.json` framework deps changed | `codebase-analysis.json` | Force re-run of `/sl-ds-setup` (Angular major version bump etc.) |
| `tokens-verified.json` failed gates | itself | Re-run `/sl-ds-tokens` from scratch |
| Schema version mismatch (`schemaVersion`) | all artifacts | Re-run all producers (breaking schema change, rare) |

### 2.2 `nodeTreeHash` — secondary cache key (v1.2)

`figmaLastModified` is the primary cache key but it has a real failure mode: Figma MCP can return null or stale lastModified after node-only copy-paste operations that do not bump file-level metadata. Without a secondary key, the pipeline misclassifies stale-as-fresh and ships incorrect output.

**The contract:**

- When `/sl-ds-tokens` Step 2 builds `node-tree.json`, the producing skill MUST also compute `nodeTreeHash = sha256(canonical-JSON(nodeTree))` and store it in the envelope's `inputs.nodeTreeHash`.
- When ANY cache-aware skill (`/sl-ds-tokens` Step 1, `/sl-ds-update` Step 1, `/sl-ds-plan` Step 1) reads cached artifacts, it MUST compare BOTH `figmaLastModified` AND `nodeTreeHash` to current Figma:
  - `lastModified` matches AND hash matches → **CACHE HIT** (safe to skip).
  - `lastModified` matches BUT hash differs → Figma metadata lied; treat as **CACHE MISS** and trigger `/sl-ds-update`.
  - `lastModified` differs → standard stale-cache path (regardless of hash).
- Canonical JSON for hashing: sorted keys, no whitespace, ISO timestamps stringified, omit fields known to be non-deterministic (`producedAt`).

Cost: one SHA-256 over a ~5-20K JSON blob, ~1ms. Benefit: closes the single biggest cache fragility in the suite.

## 3. `pipeline-state.json` — the master state file

This is what `/sl-ds` router reads first to decide next-skill.

```json
{
  "schemaVersion": "1.0.0",
  "screen": "teacher-dashboard",
  "figmaUrl": "https://www.figma.com/design/.../?node-id=...",
  "figmaLastModified": "2026-06-08T10:00:00Z",
  "lastModifiedCheckedAt": "2026-06-09T14:00:00Z",
  "framework": "angular",
  "dsMode": "slds",
  "completed": {
    "sl-ds-setup": { "at": "2026-06-09T13:00:00Z", "outcome": "pass" },
    "sl-ds-layout": { "at": "2026-06-09T13:15:00Z", "outcome": "pass" },
    "sl-ds-tokens": { "at": "2026-06-09T13:30:00Z", "outcome": "pass" }
  },
  "pending": ["sl-ds-plan", "sl-ds-implement", "sl-ds-verify"],
  "failed": [],
  "lastInvocation": {
    "skill": "sl-ds-tokens",
    "at": "2026-06-09T13:30:00Z",
    "commitSha": "abc123"
  }
}
```

**Update protocol:** every skill that completes successfully appends to `completed`, removes itself from `pending`, sets `lastInvocation`. On hard-gate failure: appends to `failed` with `{ at, reason }`.

## 4. Decision documents (`sl-ds-decisions/*.md`)

Human-readable Markdown with frontmatter:

```markdown
---
screen: teacher-dashboard
figma_url: https://...
target: apps/teacher-dashboard
created: 2026-06-09
updated: 2026-06-09
pipeline_version: "1.0"
status: in-progress | completed | failed
---

# DS Decisions — Teacher Dashboard

## Layout
- strategy: reuse-existing | new-shell | standalone
- shell: <path or "none">

## Architecture
- structure: per-feature | per-type | flat
- data_approach: service-mock | signal-store | static
- routing: lazy | eager | none
- i18n: enabled | disabled

## DS Components Used
| Figma Element | DS Component | Import | Props |
|---|---|---|---|

## Token Summary
- count: N
- theme_overrides: N

## Geometric Verification
- status: pass | fail | skipped
- elements_tested: N
- max_delta_px: N

## Progress
- [x] sl-ds-setup
- [x] sl-ds-layout
- [ ] sl-ds-tokens
- [ ] sl-ds-plan
- [ ] sl-ds-implement
- [ ] sl-ds-verify

## Architectural exceptions
_None._
```

**Rules:**
- `status: completed` requires ALL Progress items checked
- `updated:` MUST be set on every modification
- `## Architectural exceptions` is the ONLY place where rule deviations (e.g. `CUSTOM_ELEMENTS_SCHEMA` use) are recorded — `sl-ds-audit` reads this to suppress flagged exceptions

## 5. Hash computation conventions

For cache invalidation:

- File hashes: `sha256` of file contents, stripped of trailing whitespace
- Token hashes: `sha256` of canonical JSON serialization (sorted keys, no whitespace)
- Always prefix with algorithm: `"sha256:..."`

`sl-ds-setup` computes initial hashes; subsequent skills validate.

## 6. Schema versioning

This file declares `schemaVersion: "1.0.0"`. Every cache artifact must carry the same value. On reading:

- Same version → proceed
- Older version → migrate if forward-compatible, else invalidate
- Newer version → ABORT — older skill can't safely read newer cache

Bump rules:
- PATCH (1.0.x) — add field, fully backward-compatible
- MINOR (1.x.0) — add required field; provide migration
- MAJOR (x.0.0) — incompatible change; old caches are invalid

## 7. Read/write helper conventions

Skills implementing cache I/O MUST:

1. Check existence: `test -f <path>`
2. Parse envelope: read `schemaVersion`, `inputs`
3. Validate freshness: compare `inputs.*` against current environment
4. On hit: log `Cache HIT: <skill> reusing <artifact> from <producedAt>`
5. On miss: log `Cache MISS: <reason>` and proceed to recompute

Logging format is consumed by `sl-ds-audit` reports.

## 8. Per-skill envelope schemas (v1.4 — canonical home)

Every artifact written by a Sanoma Learning DS skill carries the envelope from §2 (`schemaVersion`, `producedBy`, `producedAt`, `inputs`, `confidence`, `data`). Per-skill `data` payloads differ. Per the workflow-section discipline (SCHEMA.md §4 v1.4), skills MUST NOT inline full envelope examples — they cite this section.

The shape below is the canonical contract. When the SKILL.md says *"see `@_shared/cache-schema.md §8 — <producer>`"*, this is the destination.

### 8.1 `sl-ds-setup` → `.sl-ds-cache/sl-ds-impl/codebase-analysis.json`

```json
{
  "schemaVersion": "1.4.0",
  "producedBy": "sl-ds-setup/codebase-scanner",
  "producedAt": "<iso>",
  "inputs": { "packageJsonHash": "sha256:...", "dsConfigHash": "sha256:..." },
  "confidence": { "level": "high|medium|low", "rationale": "<one-line>", "uncertainAreas": [] },
  "data": {
    "stateManagement": { "pattern": "signal-store|service-rxjs|static|unknown", "evidence": ["<file:line>", ...] },
    "directoryStructure": { "pattern": "per-feature|per-type|flat|unknown", "exampleDirs": [...] },
    "dsUsage": { "active": true, "componentsFound": ["sl-button", ...], "importedFrom": "@sl-design-system/angular" },
    "i18nUsage": { "active": true, "library": "angular-i18next", "pipeName": "I18NextPipe" }
  }
}
```

### 8.2 `sl-ds-tokens` → `.sl-ds-cache/sl-ds-impl/node-tree.json` + `tokens-raw.json` + `tokens-verified.json` + `icons.json`

`node-tree.json`:

```json
{
  "schemaVersion": "1.4.0",
  "producedBy": "sl-ds-tokens/token-extractor",
  "producedAt": "<iso>",
  "inputs": { "figmaUrl": "...", "figmaLastModified": "<iso>", "nodeTreeHash": "sha256:..." },
  "data": { "rootNodeId": "1:185", "nodes": [{ "id": "1:185", "name": "...", "type": "FRAME", "x": 0, "y": 0, "w": 1440, "h": 1100, "parent": null }, ...] }
}
```

`tokens-verified.json`:

```json
{
  "schemaVersion": "1.4.0",
  "producedBy": "sl-ds-tokens/token-verifier",
  "producedAt": "<iso>",
  "inputs": { "figmaUrl": "...", "figmaLastModified": "<iso>", "nodeTreeHash": "sha256:..." },
  "confidence": { "level": "high", "rationale": "5+ get_variable_defs calls passed all 5 verification gates", "uncertainAreas": [] },
  "data": {
    "summary": { "total": 41, "byCategory": { "color": 18, "spacing": 8, "typography": 9, "border": 6 }, "themeOverrides": 11 },
    "tokens": { "<path>": { "value": "#0a6165", "fallback": "#1727b6", "themeOverride": true, "evidenceNodeIds": [...] } }
  }
}
```

`icons.json`:

```json
{
  "schemaVersion": "1.4.0",
  "producedBy": "sl-ds-tokens/token-extractor",
  "data": { "icons": [{ "figmaNodeId": "...", "figmaName": "icon/graduation-cap", "keyword": "graduation-cap", "resolved": true, "dsName": "fas-graduation-cap", "svgPath": null }, ...] }
}
```

### 8.3 `sl-ds-layout` → `.sl-ds-cache/sl-ds-impl/layout-analysis.json`

```json
{
  "schemaVersion": "1.4.0",
  "producedBy": "sl-ds-layout/figma-multi-screen",
  "producedAt": "<iso>",
  "inputs": { "figmaUrl": "...", "figmaLastModified": "<iso>", "nodeTreeHash": "sha256:..." },
  "confidence": { "level": "high", "rationale": "...", "uncertainAreas": [] },
  "data": {
    "fileId": "abc", "fileName": "...", "lastModified": "<iso>",
    "pagesAnalyzed": [{ "name": "...", "nodeId": "...", "topElements": [{ "type": "topbar", "nodeId": "...", "x": 0, "y": 0, "h": 64, "w": 1440 }] }],
    "sharedElements": [{ "type": "topbar", "appearsOn": [...], "consistency": "exact|variant|unique", "evidenceNodeIds": [...] }]
  }
}
```

### 8.4 `sl-ds-plan` → `.sl-ds-cache/sl-ds-impl/architecture.json` + `component-map.json`

`architecture.json`:

```json
{
  "schemaVersion": "1.4.0",
  "producedBy": "sl-ds-plan",
  "producedAt": "<iso>",
  "inputs": { "figmaLastModified": "<iso>", "codebaseAnalysisHash": "sha256:..." },
  "confidence": { "level": "high|medium|low", "rationale": "...", "uncertainAreas": [] },
  "data": {
    "structure": "per-feature|per-type|flat",
    "dataApproach": "signal-store|service-mock|static",
    "selectorPrefix": "max-",
    "routing": "lazy|eager",
    "componentTree": [{ "selector": "...", "path": "...", "kind": "page|component|service|store|model", "figmaNodeId": "1:185", "children": [...] }],
    "appliedRules": ["ARCH-1", "COMP-3", "NG-1", ...],
    "appliedLessons": ["<lesson-id>", ...]
  }
}
```

`component-map.json`:

```json
{
  "schemaVersion": "1.4.0",
  "producedBy": "sl-ds-plan/sl-ds-component-mapper",
  "data": {
    "elements": [{ "figmaNodeId": "...", "figmaName": "...", "classification": "sl-ds-component|plain-div|sl-ds-icon|custom-svg|html-text|asset-image", "dsComponent": "sl-button|null", "dsImport": "@sl-design-system/angular/button|null", "variant": "primary|null", "props": {}, "confidence": "high|medium|low", "rationale": "..." }],
    "summary": { "total": 47, "byClassification": { "sl-ds-component": 18, "plain-div": 22, "sl-ds-icon": 5, "custom-svg": 0, "html-text": 2, "asset-image": 0 }, "lowConfidenceCount": 1 },
    "appliedRules": ["COMP-1", "COMP-3", "SDS-1", "SDS-3"]
  }
}
```

### 8.5 `sl-ds-implement` → `.sl-ds-cache/sl-ds-impl/generation-result.json`

```json
{
  "schemaVersion": "1.4.0",
  "producedBy": "sl-ds-implement",
  "producedAt": "<iso>",
  "data": {
    "filesGenerated": [{ "path": "...", "lines": 87, "kind": "component", "figmaNodeIdsEmitted": ["1:185", ...], "appliedRules": [...] }],
    "tokensUsed": { "total": 32, "byCategory": { "color": 14, "spacing": 6, ... } },
    "dsImportsTotal": ["sl-button", "sl-card", ...],
    "wipCommits": ["abc1234", "def5678", ...],
    "acknowledgedLowConfidence": false
  }
}
```

Per-file sub-agent return shape:

```json
{
  "schemaVersion": "1.4.0",
  "file": "<path>",
  "kind": "component|page|service|store|model|routes|styles",
  "linesWritten": <int>,
  "dsImports": [...],
  "tokensUsed": [...],
  "iconsUsed": [...],
  "figmaNodeIdsEmitted": [...],
  "appliedRules": [...],
  "violations": [],
  "acknowledgedLowConfidence": false
}
```

### 8.6 `sl-ds-verify` → `.sl-ds-cache/sl-ds-impl/build-result.json` + `geometry-result.json`

`build-result.json`:

```json
{
  "schemaVersion": "1.4.0",
  "producedBy": "sl-ds-verify/build-runner",
  "data": {
    "build": { "ok": true, "exitCode": 0, "warnings": 0, "errors": [] },
    "lint": { "ok": true, "exitCode": 0, "errors": [] },
    "patternChecks": { "ok": true, "violations": [] },
    "repairs": { "buildAttempts": 0, "lintAttempts": 0, "patternAttempts": 0, "appliedFixes": [] }
  }
}
```

`geometry-result.json`:

```json
{
  "schemaVersion": "1.4.0",
  "producedBy": "sl-ds-verify/geometric-checker",
  "data": {
    "viewport": { "w": 1440, "h": 1100 },
    "elementsTested": 7, "elementsPassed": 7, "elementsFailed": 0,
    "maxDelta": { "x": 0, "y": 2, "w": 0, "h": 2 },
    "perElement": [{ "nodeId": "1:186", "name": "Topbar", "kind": "FRAME", "figma": {...}, "dom": {...}, "delta": {...}, "tolerance": 2, "ok": true, "repairs": [] }],
    "errors": []
  }
}
```

### 8.7 `sl-ds-update` → `figma-snapshot.json` + `update-diff.json` + `update-result.json` + `manual-edit-scan.json`

`figma-snapshot.json`:

```json
{ "schemaVersion": "1.4.0", "producedBy": "sl-ds-update/figma-snapshotter", "status": "changed|unchanged", "figmaUrl": "...", "lastModified": "<iso>", "cachedLastModified": "<iso>", "data": { "nodeTree": {...}, "tokens": {...}, "icons": [...] } }
```

`update-diff.json`:

```json
{
  "schemaVersion": "1.4.0",
  "producedBy": "sl-ds-update/diff-engine",
  "data": {
    "figmaLastModifiedFrom": "<iso>", "figmaLastModifiedTo": "<iso>",
    "tokens": { "added": [...], "removed": [...], "changed": [...], "unchanged_count": 38 },
    "nodes": { "added": [...], "removed": [...], "moved": [...], "resized": [...], "renamed": [...] },
    "icons": { "added": [...], "removed": [...], "changed": [] },
    "category": "tokens-only|layout-only|structural|assets-only|mixed|none"
  }
}
```

`update-result.json`:

```json
{
  "schemaVersion": "1.4.0",
  "producedBy": "sl-ds-update",
  "data": {
    "archiveDir": ".sl-ds-cache/sl-ds-impl/_archive/<ts>",
    "diff": { /* summary of update-diff.json */ },
    "actionsApplied": [{ "category": "tokens-only", "action": "update|overwrite|redo|skip", "files": [...], "commits": [...] }],
    "rollback": "/sl-ds-rebase <ts>"
  }
}
```

`manual-edit-scan.json`:

```json
{
  "schemaVersion": "1.4.0",
  "producedBy": "sl-ds-update/manual-edit-detector",
  "data": {
    "lastDsRunCommit": "abc...", "lastDsRunTimestamp": "<iso>",
    "filesAtRisk": [...],
    "manualEditsDetected": { "<file>": [{ "hash": "...", "msg": "..." }] },
    "userDecision": "show-diff|skip-files|branch-first|proceed",
    "skippedFiles": [], "acknowledgedManualEditOverwrite": []
  }
}
```

### 8.8 `sl-ds-audit` → `.sl-ds-cache/sl-ds-impl/audit-report.json`

```json
{
  "schemaVersion": "1.4.0",
  "producedBy": "sl-ds-audit",
  "data": {
    "screen": "...", "scope": "...",
    "checks": { "tokenCompliance": "checked", "feStandards": "checked", "dsImports": "checked", "accessibility": "checked", "figmaStaleness": "checked|skipped", "geometric": "checked|skipped" },
    "summary": { "critical": 0, "major": 2, "minor": 5, "info": 3, "suppressed": 4 },
    "findings": [{ "severity": "critical|major|minor|info", "category": "tokens|fe-standards|sl-ds-imports|drift|accessibility|documentation", "rule": "...", "file": "<path>", "line": <int>, "message": "...", "suggestion": "...", "fixable": true, "suppressedBy": "<exception-bullet>", "originalSeverity": "..." }],
    "suggestedSkills": [...]
  }
}
```

### 8.9 `sl-ds-rebase` → `.sl-ds-cache/sl-ds-impl/rebase-result.json`

```json
{
  "schemaVersion": "1.4.0",
  "producedBy": "sl-ds-rebase",
  "data": { "restoredFromArchive": "_archive/<ts>", "restoredCacheFiles": [...], "revertedCommits": [...], "skippedCommits": [], "conflicts": [] }
}
```

### 8.10 `sl-ds-promote` → `.sl-ds-cache/sl-ds-promote/promotion-result.json`

```json
{
  "schemaVersion": "1.4.0",
  "producedBy": "sl-ds-promote",
  "data": {
    "promoted": [{ "lessonId": "...", "targetFile": "sanoma-ds.md", "newRuleId": "SDS-8" }],
    "skipped": [{ "lessonId": "...", "reason": "..." }],
    "aborted": false
  }
}
```

### 8.11 `sl-ds-mock` → `.sl-ds-cache/sl-ds-impl/mock-result.json`

```json
{
  "schemaVersion": "1.4.0",
  "producedBy": "sl-ds-mock",
  "data": {
    "inferredShapes": [{ "modelName": "...", "fieldShapes": {...}, "rowCount": 10, "confidence": "high|medium|low" }],
    "filesModified": [{ "path": "...", "rowsAdded": <int>, "fieldsAdded": <int>, "preservedExisting": <int> }],
    "fixtureFiles": [...]
  }
}
```

### 8.12 `sl-ds-i18n` → `.sl-ds-cache/sl-ds-impl/i18n-result.json`

```json
{
  "schemaVersion": "1.4.0",
  "producedBy": "sl-ds-i18n",
  "data": {
    "pipeName": "I18NextPipe|TranslatePipe",
    "localesProcessed": ["pl", "en"],
    "addedKeys": { "pl": 12, "en": 12 },
    "preservedKeys": { "pl": 47, "en": 47 },
    "orphanedKeys": [...],
    "appliedRules": ["I18N-1", "I18N-3"]
  }
}
```

### 8.13 `sl-ds` router → `.sl-ds-cache/sl-ds-router/state.json` + `intent.json` + `last-decision.json`

`state.json`: per `sl-ds/references/state-detection.md` §4 (canonical there — that's the sub-agent contract).

`intent.json`:

```json
{ "schemaVersion": "1.4.0", "topMatches": [{ "skill": "...", "confidence": 0.85, "matched_phrase": "..." }], "explicitMention": null }
```

`last-decision.json`:

```json
{ "schemaVersion": "1.4.0", "at": "<iso>", "userInput": "...", "detectedState": "...", "dispatchedTo": "...", "confidence": 0.85, "rationale": "..." }
```

### 8.14 `sl-ds-lesson` → none (writes to `context/foundation/sl-ds-lessons.md` directly per `_shared/lessons-format.md §3`)

No machine cache envelope. The lessons file IS the artifact, formatted per the lessons-format spec.
