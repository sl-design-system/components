---
topic: resume-discipline
applies_to: [sl-ds, sl-ds-setup, sl-ds-layout, sl-ds-tokens, sl-ds-plan, sl-ds-implement, sl-ds-verify, sl-ds-update, sl-ds-audit, sl-ds-lesson, sl-ds-rebase, sl-ds-promote, sl-ds-mock, sl-ds-i18n]
last_updated: 2026-06-10
---

# Resume Discipline — Active Progress Writes + Checkpoint Recovery

> **Purpose:** When a skill is interrupted (context exhausted, machine restart, process killed, user abort), re-invocation MUST resume from the last completed step without redoing work. This file defines the active progress-write protocol all skills follow.

## 1. The problem this solves

Previously, `## Resume` in each skill described how to *infer* where work stopped by inspecting on-disk artifacts. That works for cleanly-completed steps but fails for interrupted ones:

- `/sl-ds-tokens` makes 5+ Figma API calls (~15K tokens). If interrupted after call 3, the artifact (`tokens-raw.json`) was never written → re-invocation re-does all 5 calls.
- `/sl-ds-implement` writes 6+ files in sequence. If interrupted after file 4, no envelope tells the orchestrator that files 1-4 are done.
- `/sl-ds-update` archives + diff + per-category action. If interrupted mid-action, the archive exists but the user has no clean recovery path.

The fix: skills write **progress** as they execute, not just **artifacts** at the end.

## 2. The contract

Every skill that performs more than one step MUST:

1. Write `.sl-ds-cache/<skill-id>/progress.json` at start (status: `in-progress`)
2. Update `progress.json` at each step boundary (completed steps list, current step)
3. For long-running steps (multiple API calls or file writes), write **checkpoints** within the step
4. Update `progress.json` to `status: completed` at end
5. On re-invocation, read `progress.json` FIRST; if `in-progress` exists, surface the resume option

Skills with a single mechanical step (`/sl-ds-help`, `/sl-ds-rebase` — already single-shot) may declare `_N/A — atomic skill_` in their Resume section and skip this discipline.

## 3. `progress.json` schema

```json
{
  "schemaVersion": "1.3.0",
  "skill": "sl-ds-tokens",
  "invocationId": "<uuid-v4>",
  "startedAt": "<iso>",
  "lastUpdatedAt": "<iso>",
  "status": "in-progress" | "completed" | "failed" | "aborted",
  "currentStep": 3,
  "currentStepStartedAt": "<iso>",
  "completedSteps": [1, 2],
  "stepArtifacts": {
    "1": ".sl-ds-cache/<skill>/_step1.json",
    "2": ".sl-ds-cache/sl-ds-impl/node-tree.json"
  },
  "checkpoints": {
    "step3": {
      "totalUnits": 5,
      "completedUnits": 2,
      "completedUnitIds": ["1:185", "1:186"],
      "nextUnit": "1:187",
      "partialOutput": {}
    }
  },
  "userContext": {
    "$ARGUMENTS": "<original args>",
    "figmaUrl": "https://...",
    "screenName": "teacher-dashboard",
    "flags": ["--force"]
  },
  "failureContext": {
    "lastError": "<message>",
    "lastErrorAt": "<iso>",
    "retryCount": 0
  }
}
```

### 3.1 Field semantics

| Field | When to write | What it represents |
|---|---|---|
| `schemaVersion` | At every write | The discipline contract version (this file). Mismatch → invalidate old progress. |
| `skill` | At start | Self-identifying. Mismatch on read → wrong file. |
| `invocationId` | At start | UUID. Distinguishes between concurrent invocations and history. |
| `startedAt` | At start | Used by stale-detection (>24h → ask user "stale, restart?"). |
| `lastUpdatedAt` | At every write | Liveness indicator. |
| `status` | At start, end, on abort | Drives the resume decision (only `in-progress` is resumable). |
| `currentStep` | When entering a step | Where to resume to. |
| `currentStepStartedAt` | When entering a step | For per-step timeout detection. |
| `completedSteps` | After step finishes (artifact written) | Skip on resume. |
| `stepArtifacts` | After step finishes | The on-disk evidence (cross-check before trusting). |
| `checkpoints` | Within a step, after each unit of work | Per-step sub-progress (see §4). |
| `userContext` | At start | Original `$ARGUMENTS` etc. — sub-agents on resume need them. |
| `failureContext` | On error | Last error for diagnostic; not always present. |

### 3.2 Atomicity

Writes MUST be atomic. Use temp-file-then-rename:

```bash
PROG_FILE=".sl-ds-cache/<skill>/progress.json"
echo "<new json>" > "${PROG_FILE}.tmp"
mv "${PROG_FILE}.tmp" "${PROG_FILE}"
```

`mv` is atomic on POSIX filesystems. Half-written `progress.json` would break resume; this prevents it.

## 4. Checkpoints for multi-call steps

Some steps make N independent operations (Figma calls, file writes, node measurements). Checkpoint after each unit so resume skips done work.

### 4.1 Per-skill checkpoint mapping

| Skill | Step | Unit | Checkpoint field |
|---|---|---|---|
| `sl-ds-tokens` | Step 3 (get_variable_defs across 5+ nodes) | Per-node call | `completedUnitIds: [<nodeId>]`, partial `tokens-raw.json` accumulating |
| `sl-ds-tokens` | Step 4 (icon extraction) | Per-icon | `completedUnitIds: [<icon-keyword>]`, partial `icons.json` |
| `sl-ds-plan` | Step 3 (search_design_system × N element types) | Per-element-type | `completedUnitIds: [<element-type>]`, partial `component-map.json` |
| `sl-ds-implement` | Step 4 (file-generator per file) | Per-file | `completedUnitIds: [<file-path>]`, files exist on disk |
| `sl-ds-verify` | Step 3 (geometric measurement per node) | Per-node | `completedUnitIds: [<nodeId>]`, partial measurements |
| `sl-ds-update` | Step 2 (figma-snapshotter calls) | Per-call | `completedUnitIds: [<nodeId>]`, partial snapshot |

### 4.2 Checkpoint write protocol

After EACH unit completes (e.g. one Figma call returned):

1. Append unit identifier to `checkpoints.step<N>.completedUnitIds`
2. Increment `completedUnits` counter
3. Update `nextUnit` to the next id from the work queue
4. Write the partial accumulated output (e.g. partial `tokens-raw.json` with just the tokens collected so far)
5. Atomically save `progress.json`

Cost: one extra ~1KB write per unit, negligible vs the 1-3K tokens of the Figma call itself.

### 4.3 Resume from checkpoint

When skill re-invoked with `progress.json` showing `currentStep: 3` and `checkpoints.step3` populated:

1. Read `completedUnitIds` — these are DONE units
2. Compute remaining work: full work queue MINUS completed ids
3. Resume Step 3 starting from `nextUnit`, processing the remainder
4. Partial output already on disk; new results append/merge

## 5. The resume protocol — every skill's Step 0

Skills with more than one step MUST include implicitly (or explicitly in `## Workflow`) a **Step 0: Resume check**:

```text
### Step 0: Resume check

Read `.sl-ds-cache/<skill-id>/progress.json` if it exists.

Decision:
| State | Action |
|---|---|
| File missing | Fresh start (Step 1). Write initial progress.json with status: in-progress, completedSteps: []. |
| `status: completed` | This invocation is idempotent. Print summary from progress.json, ask user: re-run fresh? |
| `status: in-progress` AND `lastUpdatedAt` < 24h ago | Resumable. Ask user (see §5.1). |
| `status: in-progress` AND `lastUpdatedAt` > 24h ago | Stale. Ask user: resume anyway or archive + fresh? |
| `status: failed` | Read failureContext. Surface error; ask retry or fresh. |
| `status: aborted` | User explicitly aborted last time. Ask: resume from where left off or fresh? |
```

### 5.1 Resume confirmation question

```text
> 🔁 **Resumable invocation detected for `/<skill>`**
>
> Last run: <skill> started at <startedAt> (<duration> ago)
> Last update: <lastUpdatedAt> (<duration> ago)
> Progress: step <currentStep>/<total>, <completedSteps.length> step(s) completed
> Original args: <userContext.$ARGUMENTS>
> Status: in-progress (interrupted, not failed)

[If checkpoints exist for currentStep:]
> Sub-progress in step <currentStep>: <completedUnits>/<totalUnits> units done
> Last unit completed: <last entry in completedUnitIds>

> ⭐ Resume — continue from step <currentStep>, unit <nextUnit>
> Start fresh — archive current progress to _archive/<ts>/ and start over
> Show me what was done — print the step-by-step trace before deciding
> Abort — exit; progress preserved as-is (resumable later)
```

## 6. `pipeline-state.json` — the master index

The per-skill `progress.json` is local to one skill's run. The MASTER state file `pipeline-state.json` (per `cache-schema.md` §3) is the cross-skill index. Each skill maintains it:

- **At skill start**: append entry `lastInvocation: { skill, at, progressFile }` (overwrites previous)
- **At step boundary**: optional — for long-running skills, update `lastInvocation.lastStepCompleted`
- **At skill completion**: append to `completed: { <skill>: { at, outcome } }`, remove from `pending: []`
- **At skill abort/fail**: append to `failed: [{ at, skill, reason }]`; keep in `pending`

The `/sl-ds` router reads `pipeline-state.json` first to know which skill was last invoked; if its `progress.json` shows `in-progress`, the router can route directly to that skill for resume (instead of going through the full state-detection flow).

## 7. Archive on fresh start

When user picks "Start fresh", DO NOT overwrite or delete the existing `progress.json` silently. Archive first:

```bash
TS=$(date -u +"%Y%m%dT%H%M%SZ")
mkdir -p .sl-ds-cache/<skill>/_archive/${TS}
mv .sl-ds-cache/<skill>/progress.json .sl-ds-cache/<skill>/_archive/${TS}/progress.json
# Optionally archive partial step artifacts too
```

User can inspect the archive later to understand what was in progress. `/sl-ds-rebase` can use it for recovery in the same way it uses `/sl-ds-update`'s archive.

## 8. Compatibility with existing `## Resume` sections

Each skill currently has a `## Resume` section that describes how to infer state from artifacts. After this discipline lands, that section becomes:

```markdown
## Resume

Active progress write per [`../_shared/resume-discipline.md`](../_shared/resume-discipline.md):
- Progress file: `.sl-ds-cache/<skill-id>/progress.json`
- Checkpoints: <list per-step checkpoint units OR "_atomic step, no checkpoints_">

On re-invocation, Step 0 reads `progress.json` and applies the resume protocol from resume-discipline.md §5. Manual fallback (if `progress.json` is missing or corrupt — the discipline is robust but not infallible):

| Artifact present | Resume hint |
|---|---|
| <as before — the artifact-to-step mapping table> |
```

The artifact table stays as a backup for when `progress.json` is unavailable (e.g. older skill version pre-dating discipline, or manual deletion).

## 9. Anti-patterns

- ❌ **Don't write `progress.json` only at skill end.** That's not progress, that's a result file. Updates must happen at step boundaries.
- ❌ **Don't trust `progress.json` blindly.** Always cross-check that `stepArtifacts[N]` actually exists on disk before considering step N done.
- ❌ **Don't skip atomicity.** Direct `echo > progress.json` can corrupt the file on a crash mid-write.
- ❌ **Don't resume across schema version mismatches.** If `progress.json.schemaVersion !== current` → archive + fresh start.
- ❌ **Don't checkpoint inside operations that are themselves transactional.** E.g. don't checkpoint mid-way through writing a single file; the file write IS the unit.
- ❌ **Don't make resume mandatory without user confirmation.** Always ask. Resuming a stale or wrong-context run silently is worse than starting fresh.

## 10. Validator additions (v1.3)

The validator (`_template/validate-skill.js`) gains these checks for v1.3:

- **WARN**: skill has multi-step `## Workflow` (>2 numbered steps) but `## Resume` doesn't reference `progress.json`
- **WARN**: skill has a step that spawns sub-agents in a loop (multi-unit work) but no checkpoint discipline declared in `## Resume`
- **PASS** (no warning): skill explicitly declares `_atomic — no resume needed_` in `## Resume` (single-shot skills like `/sl-ds-help`, `/sl-ds-rebase`, `/sl-ds-lesson`)

These are warnings during transition (v1.3) and become errors in v1.4.
