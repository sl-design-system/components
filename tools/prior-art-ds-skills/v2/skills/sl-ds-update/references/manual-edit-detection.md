---
topic: manual-edit-detection
applies_to: [sl-ds-update]
last_updated: 2026-06-10
---

# Manual-Edit Detection — Defensive Gate Before Overwrite

> **Purpose:** Loaded by `/sl-ds-update` Step 4.5. Scans git for non-DS commits to files that proposed update actions would touch, prevents the skill from silently destroying manual code fixes. Single highest-leverage safety mechanism in the skill — without it, archive at Step 1 protects `.sl-ds-cache/` but NOT the user's hand-edited code.

## 1. When this step runs

Between Step 4 (diff interpretation framing) and Step 5 (per-category action). Skipped only if no DS commits exist for this screen yet (fresh screen; no manual-edit risk by definition).

## 2. Sub-step 2a — Identify `filesAtRisk`

From the diff (`update-diff.json`) + the framing's proposed per-category actions, compute the set of files those modes would touch:

| Category × mode | Files touched |
|---|---|
| `tokens-only update` | `<targetScope>/src/<screen>/styles.scss` + per-component .scss files referencing changed CSS vars (grep for `var(--<changed-token-name>)`) |
| `tokens-only overwrite` | All `<targetScope>/src/<screen>/**/*.scss` |
| `layout-only update` | Per-component `.scss` files for resized/moved nodes (lookup via `component-map.json`) |
| `layout-only overwrite` | All `.scss` files in screen |
| `structural redo` | All files under `<targetScope>/src/<screen>/` (full regeneration) |
| `structural update` | Per-decision-tree files (added components → new .ts files; removed → delete; renamed → file rename) |
| `assets-only update` | Files referencing affected icons (grep `component-map.json` → template files) |
| `assets-only overwrite` | All template files referencing icons |

Build the `filesAtRisk: [<path>...]` array. De-duplicate.

## 3. Sub-step 2b — Compute `lastDsRunCommit` + `lastDsRunTimestamp`

Find the most recent commit by this skill suite touching the screen's directory:

```bash
git log -1 --pretty=format:"%H %ct" \
  --grep='\[sl-ds-(generate|update)\]' \
  -- "<targetScope>/src/<screen>/"
```

If no such commit exists → skip Step 4.5 entirely (fresh screen; no manual edits possible by definition).

Otherwise record:
- `lastDsRunCommit` — the SHA
- `lastDsRunTimestamp` — Unix timestamp (the `%ct` output)

## 4. Sub-step 2c — Scan for non-DS commits since `lastDsRunCommit`

For each file in `filesAtRisk`:

```bash
git log --since="@$lastDsRunTimestamp" \
  --pretty=format:"%H %s" \
  -- "<file>" \
  | grep -vE '\[sl-ds-(generate|update|verify)\]'
```

Remaining lines = non-DS commits = MANUAL EDITS the proposed action would destroy.

Build `manualEditsDetected: { "<file>": [{ "hash": "<sha>", "msg": "<commit message>" }, ...] }`.

Edge case: a commit message starting with `[sl-ds-*]` from another skill counts as DS. A commit by the user that happens to contain "[sl-ds-update]" in body but not in subject — treat by subject only (the regex matches `--pretty=format:"%H %s"` which is `<sha> <subject>`).

## 5. Sub-step 2d — Defensive gate (if manual edits detected)

If `manualEditsDetected` is empty → proceed to Step 5 silently. The path of least friction.

If non-empty, present BEFORE Step 5's per-category questions:

```text
> ⚠️ **Manual code edits detected since last DS run (<lastDsRunTimestamp>).**
>
> The proposed actions would overwrite these files:
>
> | File | Non-DS commits | First commit |
> |---|---|---|
> | features/.../max-hero-section.scss | 2 | abc1234 "fix margin in hero" |
> | features/.../max-insights-panel.ts  | 1 | def5678 "add error boundary" |
>
> Without intervention, `<chosen-mode>` will destroy these edits. The archive at `_archive/<ts>/*.json` only covers .sl-ds-cache/ — NOT your code.
```

Options (structured `AskUserQuestion` per `@_shared/questions-format.md`):

- ⭐ **Show me a diff per file** — print `git diff <lastDsRunCommit>..HEAD -- <file>` for each affected file; user reviews; then re-ask the same question
- **Skip the affected files in this update** — keep manual edits; cache will be partially stale (record `skippedFiles: [...]` in `update-result.json`; later runs of `/sl-ds-update` will pick them up again)
- **Stage manual changes into a feature branch first** — print git commands the user can run to extract the manual commits into a separate branch; then proceed with overwrite
- **Proceed with overwrite** — destroy the manual edits; user explicitly accepts; record `acknowledgedManualEditOverwrite: true` per file in `update-result.json`

The default action when user picks nothing (e.g. timeout) MUST NOT silently proceed. Treat as "Skip the affected files" — preserve manual work by default.

## 6. Sub-step 2e — Output

Write `.sl-ds-cache/sl-ds-impl/manual-edit-scan.json` per [`@_shared/cache-schema.md`](../../_shared/cache-schema.md) §8.7. Envelope contains: `lastDsRunCommit`, `lastDsRunTimestamp`, `filesAtRisk`, `manualEditsDetected`, `userDecision`, `skippedFiles`, `acknowledgedManualEditOverwrite`.

Per-file decisions feed into Step 5 (e.g. "skip files" excludes them from the action's target set).

## 7. Why this is the highest-leverage safety mechanism in /sl-ds-update

- Archive (Step 1) protects `.sl-ds-cache/` only — automated rollback via `/sl-ds-rebase`.
- This step (4.5) protects user's hand-edited code — without it, archive can't roll back code that's already been destroyed.
- Most user-reported regressions on automated codegen tools come from this exact scenario: tool overwrites a hand-fix without warning.
- Cost: ~1-2K tokens per invocation (git log scans are cheap). Benefit: catches the most consequential destructive action class.

## 8. Anti-patterns

- ❌ Don't skip the scan because "the user knows they have local changes." They might forget.
- ❌ Don't auto-proceed without user confirmation when manual edits are detected. The gate exists precisely for the interactive decision.
- ❌ Don't treat `lastDsRunTimestamp` from `update-result.json.producedAt` as authoritative — use git history (`git log`) since file edits may pre-date or post-date the artifact.
- ❌ Don't write to `manual-edit-scan.json` if the scan was skipped (no DS commits yet). Write only when the scan actually ran.
