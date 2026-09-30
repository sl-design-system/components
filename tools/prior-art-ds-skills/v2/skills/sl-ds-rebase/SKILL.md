---
name: sl-ds-rebase
description: |
  USE WHEN: user says "rollback sl-ds-update", "undo last update", "restore from archive", "sl-ds-update poszedł źle", or wants to revert a `/sl-ds-update` invocation back to the pre-update state.
  DOES: Lists `_archive/<timestamp>/` snapshots from `/sl-ds-update` runs, restores cache + (optionally) reverts WIP commits the update created, prints summary. Single-shot recovery — no diff, no decisions, just restore.
  NEVER USE WHEN: there are no archives (`/sl-ds-update` was never run). Or when user wants to selectively undo SOME changes from an update — that's not what archive captures (it's all-or-nothing per timestamp).
version: 1.0.0
model: sonnet
tags: [sl-ds, rebase, restore, archive, rollback, recovery]
next:
  on_success: [sl-ds-verify, sl-ds-audit]
  on_failure: [sl-ds-help]
  related: [sl-ds-update]
requires:
  artifacts: []
  skills_completed: []
produces:
  artifacts: [.sl-ds-cache/sl-ds-impl/rebase-result.json]
  decisions: []
token_budget: "2-5K"
sub_agents: []
lessons_read: false
fe_standards_consulted:
  primary: []
  rule_ids: []
---

# DS Rebase — Restore From `/sl-ds-update` Archive

## Purpose

`/sl-ds-update` archives `.sl-ds-cache/` state to `_archive/<timestamp>/` before applying any changes (its Step 1). The text instruction *"To rollback: cp .sl-ds-cache/sl-ds-impl/_archive/<ts>/*.json .sl-ds-cache/sl-ds-impl/"* puts the burden on the user to know the timestamp, pick the right files, and separately `git revert` the WIP commits. This skill automates that recovery — single command, picks the archive, restores cache, optionally reverts commits.

## When to use

- Last `/sl-ds-update` produced bad output (wrong category interpretation, wrong action picked) and you want to start over
- A team member ran `/sl-ds-update --force` overnight, broke production, and you need the pre-update state back
- `/sl-ds-audit` reports drift that traces back to a recent `/sl-ds-update`; rollback then investigate

## When NOT to use

- No archives exist — `/sl-ds-update` was never run on this screen. Refusal with redirect to `/sl-ds-help`.
- You want to restore an OLDER state (before two updates back) — possible but the skill explicitly asks for the timestamp; doesn't browse history beyond listing.
- You want to keep SOME changes from the update — archive is all-or-nothing per timestamp. Use git directly for selective revert.

## Preconditions

| Required artifact | If missing |
|---|---|
| At least one directory under `.sl-ds-cache/sl-ds-impl/_archive/` | STOP per [`../_shared/refusal-protocol.md`](../_shared/refusal-protocol.md) §4.7. No archives = nothing to rebase to. Producer: `/sl-ds-update`. |

## Inputs

**`$ARGUMENTS` (all optional):**

| Field | Description |
|---|---|
| Timestamp (e.g. `20260615T143200Z`) | Specific archive to restore. If omitted, skill lists all and asks user to pick. |
| `--revert-commits` flag | Also `git revert` the WIP commits the update created (default: ask user) |
| `--dry-run` flag | Show what would be restored without doing it |

## Workflow

### Step 1: List archives

**Executor:** orchestrator on **sonnet**

```bash
ls -1t .sl-ds-cache/sl-ds-impl/_archive/ | head -10
```

For each archive directory, read its contents + the corresponding `update-result.json` if present to summarize what the update did:

```text
> Available archives (most recent first):
>
> | Timestamp | Created | Update categorized as | Files touched |
> |---|---|---|---|
> | 20260615T143200Z | 4 hours ago | structural (redo) | 7 files in features/teacher-dashboard/ |
> | 20260612T091000Z | 3 days ago | tokens-only (update) | styles.scss only |
> | 20260605T180500Z | 10 days ago | layout-only (update) | 3 .scss files |
```

If `$ARGUMENTS` provided a timestamp → skip the table, go directly to Step 2. If `--dry-run` → continue but don't actually restore.

### Step 2: Confirm target

**Executor:** orchestrator on **sonnet**

If timestamp not provided, ask via `AskUserQuestion`:

```text
> Which archive do you want to restore from?
>
> ⭐ Most recent (20260615T143200Z, 4 hours ago — structural redo)
> Older (20260612T091000Z, 3 days ago — tokens-only)
> Older still (20260605T180500Z, 10 days ago — layout-only)
> Show me what each would restore — print contents before deciding
```

Once chosen, read `_archive/<chosen-ts>/` contents AND the corresponding `update-result.json.actionsApplied` to identify which WIP commits this update created.

### Step 3: Identify WIP commits to revert

**Executor:** orchestrator on **sonnet**

The archive captures cache state. Code changes live in git as WIP commits with the `[sl-ds-update]` or `[sl-ds-implement]` tag (per merge-modes.md). For each `actionsApplied` entry in `update-result.json`, collect its `commits: [<sha>...]` list.

```bash
# For each commit in update-result.json.actionsApplied[].commits:
git log -1 --pretty=format:"%H %s" <sha>
```

Build `commitsToRevert: [<sha>...]` ordered newest-first (so `git revert` produces clean conflict-free history).

### Step 4: Present restore plan

**Executor:** orchestrator on **sonnet**

```text
> 🔁 **Rebase plan — restore to 20260615T143200Z:**
>
> Cache restore:
> - tokens-verified.json (from archive)
> - node-tree.json (from archive)
> - architecture.json (from archive)
> - component-map.json (from archive)
> - pipeline-state.json (from archive)
>
> Code revert (WIP commits this update created):
> - abc1234 "wip(sl-ds): regenerate styles.scss [sl-ds-update]" — will revert
> - def5678 "wip(sl-ds): regenerate max-hero-section.ts [sl-ds-update]" — will revert
> - 9abcdef "wip(sl-ds): regenerate max-insights-panel.ts [sl-ds-update]" — will revert
>
> WARNING: 3 commits will be reverted. Each revert creates a new commit on top of HEAD; original commits stay in git history.
>
> ⭐ Apply full restore (cache + revert all 3 commits)
> Cache only — skip git revert (code stays at current state; .sl-ds-cache will drift from code)
> Show me the diff per file before applying
> Abort
```

If `--dry-run` → print this plan and STOP without restoring.

### Step 5: Apply

**Executor:** orchestrator on **sonnet**

Based on user choice:

**Cache restore:**

```bash
cp .sl-ds-cache/sl-ds-impl/_archive/<ts>/*.json .sl-ds-cache/sl-ds-impl/
```

**Git revert (if chosen):**

```bash
for sha in <commitsToRevert reversed>; do
  git revert --no-edit "$sha"
done
```

If a revert fails with merge conflict → STOP, present conflict to user with options:
- ⭐ Drop me into the conflict — manual resolution
- Abort revert (already-reverted commits stay reverted; remaining ones skipped)

### Step 6: Write rebase-result.json + summary

Write per [`@_shared/cache-schema.md`](../_shared/cache-schema.md) §8.9 (envelope with `restoredFromArchive`, `restoredCacheFiles[]`, `revertedCommits[]`, `skippedCommits[]`, `conflicts[]`).

Print:

```text
> ✅ Rebased to 20260615T143200Z
>
> Cache files restored: 5
> Commits reverted: 3 (new revert commits on top of HEAD)
>
> Next: `/sl-ds-verify` to confirm restored cache + code match
> If you want to re-apply the update with different choices: `/sl-ds-update` (the archive stays — this rebase doesn't delete it)
```

## Outputs

| Path | Purpose |
|---|---|
| `.sl-ds-cache/sl-ds-impl/rebase-result.json` | Audit trail of what was restored / reverted |
| Restored `.sl-ds-cache/sl-ds-impl/*.json` files (from archive) | Replaces current cache |
| New `git revert` commits | Code returned to pre-update state |

## Hard gates

- No archives present → STOP per §4.7 (precondition).
- Chosen archive's `update-result.json` references commits that no longer exist in git history (e.g. force-pushed) → STOP. *"Cannot identify the commits this archive corresponds to. Manual recovery only — use `git log` to find the pre-update commit and `git reset --hard <sha>` if you accept the destructive consequences."*
- Git revert conflict → STOP with the conflict surfaced. Do not auto-abort.
- `_archive/<ts>` directory missing the expected `.json` files (partial archive) → WARN: list what IS present, ask user whether to proceed with partial restore.

## Resume

| State on disk | Resume at step |
|---|---|
| `.sl-ds-cache/sl-ds-impl/rebase-result.json` present + matches chosen archive | Already finished; nothing to do. |
| Mid-revert (git status shows reverts in progress / unfinished merge) | STOP — surface the conflict; user finishes by hand. |
| Nothing | Step 1 (fresh) |

## Next

After successful rebase:

- **Most likely next:** `/sl-ds-verify` — confirm restored cache + code match (build + geometric)
- **If you want to re-run the update with different choices:** `/sl-ds-update` (the archive stays after rebase; rebase doesn't delete it, so you can rebase again if needed)

## References

| File | Load when |
|---|---|
| [../_shared/refusal-protocol.md](../_shared/refusal-protocol.md) | Preconditions §4.7 + hard-gate refusals |
| [../_shared/cache-schema.md](../_shared/cache-schema.md) | Step 6 — rebase-result.json envelope |
| [../sl-ds-update/references/merge-modes.md](../sl-ds-update/references/merge-modes.md) | Background: §5 rollback mechanics that this skill automates |
