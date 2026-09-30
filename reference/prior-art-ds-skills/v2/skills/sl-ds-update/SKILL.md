---
name: sl-ds-update
description: |
  USE WHEN: user says "Figma changed", "design się zmienił", "update from figma", "zaktualizuj design", "sl-ds update", or when /sl-ds router detects figmaChangedSinceCache=true, or pipeline-state completed but figma_lastModified is newer than cache.
  DOES: Fetches current Figma state, diffs against cached tokens-verified.json + node-tree.json + component-map.json. Categorizes changes (tokens-only / layout-only / structural / mixed). For each category asks user: overwrite (replace cache + regenerate), update (incremental patch), redo (clear cache, full pipeline re-run). Preserves a snapshot of pre-update state for rollback.
  NEVER USE WHEN: cache doesn't exist yet — there's nothing to diff, run /sl-ds-tokens fresh. Or when project hasn't completed /sl-ds-implement — there's no code to reconcile, just re-run the pipeline.
version: 1.0.0
model: opus
tags: [sl-ds, update, figma, diff, reconcile, maintenance, overwrite, regenerate]
next:
  on_success: [sl-ds-verify, sl-ds-audit]
  on_failure: [sl-ds-help]
  related: [sl-ds-tokens, sl-ds-implement, sl-ds-verify, sl-ds-audit]
requires:
  artifacts:
    - .sl-ds-config.yaml
    - .sl-ds-cache/sl-ds-impl/tokens-verified.json
    - .sl-ds-cache/sl-ds-impl/node-tree.json
  skills_completed: [sl-ds-setup, sl-ds-tokens]
produces:
  artifacts:
    - .sl-ds-cache/sl-ds-impl/figma-snapshot.json
    - .sl-ds-cache/sl-ds-impl/update-diff.json
    - .sl-ds-cache/sl-ds-impl/update-result.json
    - .sl-ds-cache/sl-ds-impl/_archive/<timestamp>/
  decisions: [context/foundation/sl-ds-decisions/<screen>.md]
cache:
  invalidate_on: []
  reuse_if: []
token_budget: "10-30K"
sub_agents:
  - name: figma-snapshotter
    subagent_type: general-purpose
    model: sonnet
    purpose: Re-fetches current Figma state (get_metadata + get_variable_defs across same node types as cached extraction); writes figma-snapshot.json
  - name: diff-engine
    subagent_type: general-purpose
    model: sonnet
    purpose: Compares figma-snapshot.json against cached tokens-verified.json + node-tree.json + component-map.json; produces categorized diff
lessons_read: true
fe_standards_consulted:
  primary: [refactoring.md, testing.md]
  rule_ids: [REF-1, REF-2, REF-3, REF-4, REF-5, REF-6, REF-7, REF-8, REF-9, REF-10, TEST-7]
---

# DS Update — Reconcile Code with Figma Changes

## Purpose

The hardest problem in DS automation: when Figma changes after code shipped, what do we do? Naive answer ("re-run the pipeline") destroys manual fixes the dev made. Naive opposite ("just patch tokens") misses structural changes that need code edits. `/sl-ds-update` instead **diffs Figma vs cache**, **categorizes the changes**, and **asks the user per category** what to do. A snapshot is preserved so any action is reversible.

## When to use

- User explicitly says Figma changed and wants to sync
- `/sl-ds` router detected `figmaChangedSinceCache: true` and routed here
- `pipeline-state.json` shows completed pipeline but `figma_lastModified` advanced
- After a Figma file got renamed/reorganized and downstream skills now fail

## When NOT to use

- No cache exists yet (`tokens-verified.json` missing) — there's nothing to diff, run `/sl-ds-tokens` fresh
- No code generated yet — there's nothing to reconcile, run `/sl-ds-implement`
- Just want a passive check, no modifications — `/sl-ds-audit` (read-only)
- Tokens haven't changed but you want to regenerate (e.g. refactoring code) — `/sl-ds-implement --force`

## Preconditions

| Required artifact | If missing |
|---|---|
| `.sl-ds-config.yaml` | STOP per [`../_shared/refusal-protocol.md`](../_shared/refusal-protocol.md) §4.7 (producer: `/sl-ds-setup`) |
| `.sl-ds-cache/sl-ds-impl/tokens-verified.json` | STOP per §4.7. No cache to diff against — run `/sl-ds-tokens` fresh first. |
| `.sl-ds-cache/sl-ds-impl/node-tree.json` | STOP per §4.7 (producer: `/sl-ds-tokens`) |

**Optional but tracked** (their presence enables structural/component-level diff modes; absence degrades the skill to tokens-only reconciliation):

- `.sl-ds-cache/sl-ds-impl/component-map.json` → if present, set `HAS_MAP = true`
- `.sl-ds-cache/sl-ds-impl/architecture.json` → if present, set `HAS_ARCH = true`

If component-map or architecture missing → user is updating after only `/sl-ds-tokens` ran. That's fine — we just won't propose code-level changes.

## Inputs

**`$ARGUMENTS` (user-provided):**

| Field | Required | Description |
|---|---|---|
| `figmaUrl` | no | Override URL from cache (e.g. file was renamed). Default: read from `tokens-verified.json.inputs.figmaUrl` |
| `--dry-run` | no | Compute the diff but DO NOT apply any action — just show what would change |

**Auto-detected:**

- `screenName` — from `pipeline-state.json`
- All cached artifacts (the things we'll diff against)

## Workflow

**Pre-flight:** read applicable lessons per [`../_shared/lessons-format.md`](../_shared/lessons-format.md) §5.1; scope fe-standards per [`../_shared/fe-standards-index.md`](../_shared/fe-standards-index.md) §3 (per frontmatter `fe_standards_consulted` — `refactoring.md` REF-1..10 + `testing.md` TEST-7). Update IS a refactor: REF-1 aligns with Step 1 archive, REF-2 (state inventory) supports the Step 4 framing block, REF-5 (net-negative diff) shapes Step 5 action selection. Record `appliedLessons` in `update-result.json` per `@_shared/cache-schema.md §8.7`.

### Step 1: Pre-update snapshot (archive current cache)

**Executor:** orchestrator on **opus**

Before any modification, archive the current state for rollback:

```bash
TS=$(date -u +"%Y%m%dT%H%M%SZ")
ARCHIVE_DIR=".sl-ds-cache/sl-ds-impl/_archive/${TS}"
mkdir -p "$ARCHIVE_DIR"
cp .sl-ds-cache/sl-ds-impl/{tokens-verified,node-tree,component-map,architecture,pipeline-state}.json "$ARCHIVE_DIR/" 2>/dev/null || true
echo "Archived pre-update state to $ARCHIVE_DIR"
```

This is sacred: any catastrophic outcome can be rolled back with `cp _archive/<ts>/* ./`.

### Step 2: Fetch current Figma state

**Executor:** `Agent(subagent_type: "general-purpose", model: "sonnet")` — figma-snapshotter sub-agent, clean context

Pass: `figmaUrl`, reference to [`references/diff-strategy.md`](references/diff-strategy.md) §1.

Sub-agent:
1. `get_metadata` on root → check `lastModified`. Then ALSO rebuild a fresh node-tree and compute `nodeTreeHash`. Compare BOTH to cached values per [`../_shared/cache-schema.md`](../_shared/cache-schema.md) §2.2. If BOTH match → STOP with "Nothing to update" message. If `lastModified` matches but `nodeTreeHash` differs → proceed (Figma metadata lied; treat as changed). If `lastModified` differs → proceed normally.
2. Build a fresh `node-tree.json` (same as `/sl-ds-tokens` Step 2)
3. Run `get_variable_defs` across the SAME representative node types as cached (read from `tokens-verified.json.evidenceNodeIds`)
4. Check icons (`search_design_system` for any new icon nodes)
5. Write `.sl-ds-cache/sl-ds-impl/figma-snapshot.json` with the fresh data

**Budget cap:** 12 Figma calls max (similar to `/sl-ds-tokens` budget).

### Step 3: Compute diff

**Executor:** `Agent(subagent_type: "general-purpose", model: "sonnet")` — diff-engine sub-agent, clean context

Pass:
- Paths to cached files + fresh snapshot
- Reference to [`references/diff-strategy.md`](references/diff-strategy.md) §2 (diff algorithms) + §3 (categorization)

Sub-agent computes:

#### 3.1 Token diff (tokens-verified.json vs figma-snapshot.tokens)

```json
{
  "added": [{ "path": "color/foreground/accent", "value": "#ff6600" }],
  "removed": [{ "path": "spacing/xxl" }],
  "changed": [
    { "path": "color/foreground/primary/bold", "from": "#0a6165", "to": "#0b7273" }
  ],
  "unchanged_count": 38
}
```

#### 3.2 Node tree diff

```json
{
  "added_nodes": [{ "id": "2:300", "name": "New CTA Banner", "parent": "1:185" }],
  "removed_nodes": [{ "id": "1:250", "name": "Old Promo" }],
  "moved_nodes": [{ "id": "1:200", "from_y": 88, "to_y": 120 }],
  "resized_nodes": [{ "id": "1:300", "from": { "w": 800, "h": 400 }, "to": { "w": 800, "h": 480 } }],
  "renamed_nodes": []
}
```

#### 3.3 Icon diff

```json
{
  "added_icons": [{ "figmaName": "icon/star", "keyword": "star" }],
  "removed_icons": [{ "figmaName": "icon/old-bell" }]
}
```

#### 3.4 Categorize

Per [`references/diff-strategy.md`](references/diff-strategy.md) §3 matrix:

| Category | Definition | Implications |
|---|---|---|
| `tokens-only` | Only token values changed; nodes identical | Patch `tokens-verified.json` + regenerate `styles.scss` |
| `assets-only` | Only icons/images changed | Patch `icons.json`/`assets.json` + update `<sl-icon name>` refs |
| `layout-only` | Nodes moved/resized but no added/removed | Update CSS only; HTML structure stays |
| `structural` | Nodes added/removed, OR composition changed | Need code edits — propose specific files |
| `mixed` | Combination of above | Per-category action |

Write `.sl-ds-cache/sl-ds-impl/update-diff.json`.

### Step 4: Diff interpretation — Framing (uses framing discipline)

**Executor:** orchestrator on **opus**

Categorization (`tokens-only` / `layout-only` / `structural` / `mixed`) IS interpretation, not raw fact. The user must be able to challenge it: "you flagged this `structural` but I just renamed a node, no new component needed."

Apply the canonical skeleton from [`../_shared/framing-discipline.md`](../_shared/framing-discipline.md) §6, filled with these specifics for diff interpretation:

- **Observation bullets:** raw diff facts from `update-diff.json` — figma `lastModified` from/to + gap; token diff counts + specific changed values; node diff counts (added/removed/moved/resized/renamed) with nodeIds; icon diff counts.
- **Interpretation bullets:** token-change semantic (pure-recolor / semantic-shift / mixed) with rationale; node adds/removes (NEW components / minor decorative / text restructuring); resize pattern (height-only / both dims / aspect ratio); rename type (cosmetic / semantic — propagate to code); overall category with decisive evidence.
- **Proposed direction:** per-category recommended action per `@references/merge-modes.md §4` (tokens-only → update; layout-only → update; structural → redo; assets-only → update; renames → stable). Plus total cost estimate + blast radius (files affected).
- **Confidence:** HIGH / MEDIUM / LOW per `@_shared/cache-schema.md §2.1` — uncertainAreas if not HIGH (e.g. "renames could be cosmetic or semantic; need user confirm").

Then the universal four-axis reframe question per `framing-discipline.md §3`. Common reframes here:
- **Observation**: "you missed a token in the diff" — rare; diff-engine is mechanical
- **Interpretation**: COMMON — "you called it structural but it's cosmetic", "renames are actually semantic, propagate to code"
- **Proposal**: COMMON — "analysis is right but I prefer overwrite over update for tokens"

If user picks `Interpretation off`: re-derive proposal from corrected interpretation. The diff facts in `update-diff.json` are PRESERVED — only the categorization is overridden.

### Step 4.5: Manual-edit detection (defensive gate)

**Executor:** orchestrator on **opus**

Scan git for non-DS commits to files that proposed actions would touch, before Step 5 destroys them. Single highest-leverage safety mechanism in this skill — archive (Step 1) protects `.sl-ds-cache/`, but THIS step protects user's hand-edited code.

Full sub-step protocol (2a identify filesAtRisk → 2b compute lastDsRun → 2c scan non-DS commits → 2d defensive gate with 4 options → 2e write manual-edit-scan.json) in [`references/manual-edit-detection.md`](references/manual-edit-detection.md).

Skip entirely if no `[sl-ds-(generate|update)]` commits exist for this screen (fresh screen, no manual-edit risk).

If `manualEditsDetected` non-empty → present gate per `references/manual-edit-detection.md` §5. Default-on-timeout: **skip affected files** (preserve manual work). Per-file decisions feed into Step 5.

### Step 5: Per-category action (the critical interactive step)

**Executor:** orchestrator on **opus**

For each non-empty diff category, ask user the canonical 4-option question (update / overwrite / redo / skip). The recommended (⭐) option per category and the per-mode action mechanics are defined in [`references/merge-modes.md`](references/merge-modes.md) §4 (action matrix) and §5 (per-mode mechanics).

Per-category question template (filled with that category's specifics — what changed + recommended mode + tradeoffs):

```text
> **<N> <category-units> changed. Action?**
>
> What I found: <category-specific summary from update-diff.json>
>
> ⭐ **<Recommended mode for this category>** — <description>. Strength: <X>. Tradeoff: <Y>.
> **<Alt mode 1>** — <description>. Strength: <X>. Tradeoff: <Y>.
> **<Alt mode 2>** — <description>. Strength: <X>. Tradeoff: <Y>.
> **Skip this category** — <description>.
```

Recommended (⭐) per category per `merge-modes.md` §4:
- `tokens-only` → **update** (incremental patch)
- `layout-only` → **update** (per-component SCSS patches)
- `structural` → **redo** (full pipeline: `/sl-ds-plan --force` + `/sl-ds-implement --force`)
- `assets-only` → **update**
- `renames` → **stable** (keep code names; cache mapping only)

If user picked non-⭐ option → record in `update-result.json.actionsApplied[].action` and trigger passive lesson capture in Step 7.5 (the override IS lesson material).

### Step 6: Apply chosen actions

**Executor:** orchestrator on **opus**, delegating to sub-skills

Per action chosen, dispatch to the right downstream skill:

| Action | What happens |
|---|---|
| Update tokens-only | Patch `tokens-verified.json` + edit `styles.scss` directly + WIP commit |
| Overwrite tokens-only | Replace `tokens-verified.json` + delete `styles.scss` + invoke `/sl-ds-implement` (will recreate it) |
| Redo tokens-only | Delete tokens-verified.json + invoke `/sl-ds-tokens --force` |
| Update layout | Edit `.scss` files per-component; WIP commit |
| Overwrite layout | Invoke `/sl-ds-implement` (regenerates all SCSS) |
| Update structural | Per-file plan: new files via `/sl-ds-implement <component>`, deleted files removed with confirmation, edited files patched manually with user review |
| Overwrite structural | Invoke `/sl-ds-plan --force` then `/sl-ds-implement --force` |
| Redo structural | Invoke `/sl-ds-plan --force` then `/sl-ds-implement --force` then `/sl-ds-verify` |
| Skip <category> | No action; log to update-result.json |

Apply WIP commits per change with prefix from `.sl-ds-config.yaml`.

**If `--dry-run`:** skip Step 6 entirely; just print the action plan.

### Step 7: Write update-result.json + summary

**Executor:** orchestrator on **opus**

Write `.sl-ds-cache/sl-ds-impl/update-result.json` per [`@_shared/cache-schema.md`](../_shared/cache-schema.md) §8.7 (envelope with `archiveDir`, `diff` summary, `actionsApplied[]` per category, `rollback` command). Recovery is automated via `/sl-ds-rebase <ts>` (no longer manual cp + git revert).

Print:

```
> ✅ Update applied
>
> Actions:
> - tokens-only: updated (3 values changed in styles.scss)
> - structural: redo dispatched (/sl-ds-plan + /sl-ds-implement in progress)
>
> Archive: .sl-ds-cache/sl-ds-impl/_archive/20260615T143200Z (rollback available)
> Next: `/sl-ds-verify` to confirm the update doesn't break geometric tolerance
```

Update `sl-ds-decisions/<screen>.md` → `updated:` field + add line to `## Update history` table.

### Step 7.5: Passive lesson capture (only on non-default reframes)

When the user overrode the skill's default categorization or per-category action in Step 4 or Step 5, capture the override as potential lesson material. Without this prompt the team's institutional learning leaks invocation-by-invocation.

Triggers — surface the prompt only if at least one of these is true:

- User picked "INTERPRETATION off" in Step 4 reframe (categorization was wrong)
- User picked a non-⭐ option in any Step 5 per-category question (e.g. picked `overwrite` when default was `update`)
- User picked "Override the lesson for this decision" in a Step 5 conflict resolution (existing lesson was violated)

```text
> 💡 **Capture this update decision as a team lesson?**
>
> You overrode: <one-line — e.g. "categorized as `tokens-only` (skill said `structural`)" or "picked `redo` for layout-only (default was `update`)">
> Reason given: <user's free-form text>
>
> Capturing this means future `/sl-ds-update` runs in matching scope will apply the same heuristic.
>
> ⭐ Yes, capture — invoke `/sl-ds-lesson` with rule + reason pre-filled
> Skip — this was a one-off decision
> Edit the rule text before capturing
```

If "Yes, capture" → emit `Skill(skill: "sl-ds-lesson", args: "<pre-filled>")`. Skip silently if user accepted all defaults (no override = no lesson).

## Outputs

| Path | Purpose |
|---|---|
| `.sl-ds-cache/sl-ds-impl/figma-snapshot.json` | Fresh Figma state used for diff |
| `.sl-ds-cache/sl-ds-impl/update-diff.json` | Categorized diff vs cached state |
| `.sl-ds-cache/sl-ds-impl/update-result.json` | What was decided + applied |
| `.sl-ds-cache/sl-ds-impl/_archive/<ts>/` | Pre-update cache snapshot for rollback |
| Updated `tokens-verified.json` / `styles.scss` / code files | Only if user chose update/overwrite/redo |
| `context/foundation/sl-ds-decisions/<screen>.md` | Update history appended |

## Hard gates

- Figma lastModified UNCHANGED AND `nodeTreeHash` UNCHANGED → STOP with "Nothing to update" (no need to ask). If only one matches → NOT a hard gate; proceed with the differing signal as the trigger.
- Figma URL in cache differs from input → apply refusal §4.3 (URL mismatch), user picks how to reconcile
- Diff engine sub-agent returns malformed JSON → retry once, then STOP, preserve archive
- User picks action that depends on a missing skill (e.g. "structural redo" but `component-map.json` is absent) → STOP, propose fallback
- Any file modification fails (write permission, lock) → STOP, leave cache + code untouched, surface error

The archive (Step 1) is the safety net. If anything goes wrong after Step 1, the user can roll back.

## Resume

Resume per [`../_shared/resume-discipline.md`](../_shared/resume-discipline.md). Progress: `.sl-ds-cache/sl-ds-update/progress.json`. Checkpointed steps: Step 2 (per-node figma-snapshotter), Step 6 (per-category action). **Safety net:** the Step 1 archive means `/sl-ds-rebase <ts>` is always available for clean recovery, regardless of `progress.json` state. Manual fallback table (if `progress.json` missing or corrupt):

| State on disk | Resume hint |
|---|---|
| `_archive/<ts>/` exists + `update-result.json` written | Already finished. Suggest `/sl-ds-verify` if not run after. |
| `_archive/<ts>/` exists, no `update-result.json` | Update interrupted mid-action. If `update-diff.json` exists → resume Step 5 with category-by-category questioning OR offer `/sl-ds-rebase <ts>` for clean rollback |
| `figma-snapshot.json` exists, no `update-diff.json` | Step 3 (compute diff) — Figma already re-fetched |
| Nothing | Step 1 (archive + fresh fetch) |

**Rollback is always available** post-archive via `/sl-ds-rebase <ts>` — automated cp + git revert (no longer manual).

## Next

After successful completion:

- **Most likely next:** `/sl-ds-verify` — confirm the update didn't break the build or geometric tolerance
- **Alternative:** `/sl-ds-audit` — passive re-check after the update

After hard-gate failure:

- **Recovery:** archive at `.sl-ds-cache/sl-ds-impl/_archive/<ts>/` — rollback command printed in failure message
- **Fallback:** `/sl-ds-help`

## References

| File | Load when |
|---|---|
| [diff-strategy.md](references/diff-strategy.md) | Step 2 (fetch contract) + Step 3 (diff algorithms + categorization) |
| [manual-edit-detection.md](references/manual-edit-detection.md) | Step 4.5 — full sub-step protocol (filesAtRisk → lastDsRun → non-DS commit scan → defensive gate → output) |
| [merge-modes.md](references/merge-modes.md) | Step 5 (action options per category) + Step 6 (apply logic) |
| [../_shared/framing-discipline.md](../_shared/framing-discipline.md) | Step 4 — diff interpretation framing (observation = mechanical diff, interpretation = categorization which user can challenge) |
| [../_shared/lessons-format.md](../_shared/lessons-format.md) | Workflow pre-flight — rename interpretation rules, per-category action overrides, etc. |
| [../_shared/questions-format.md](../_shared/questions-format.md) | Step 4 (four-axis reframe) + Step 5 (per-category questions) |
| [../_shared/refusal-protocol.md](../_shared/refusal-protocol.md) | Hard gates — URL mismatch, malformed diff |
| [../_shared/cache-schema.md](../_shared/cache-schema.md) | Step 1 (archive structure) + Step 7 (update-result envelope) |
