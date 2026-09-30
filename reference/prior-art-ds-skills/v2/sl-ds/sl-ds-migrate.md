---
name: sl-ds-migrate
type: orchestrator
prefix: sl-ds
version: 1.0.0
description: Plans and orchestrates SLDS version migrations by detecting and fixing breaking changes
called_by:
  - developer
invokes:
  - sl-ds-version
  - sl-ds-api
  - angular-specialist
  - sdl-master
token_budget: "10–60K"
---

# sl-ds-migrate

`sl-ds-migrate` upgrades a project from one SLDS version to another by comparing both API surfaces, generating a migration plan, and orchestrating the required code changes. It focuses on breaking-change automation so version upgrades are repeatable instead of manual. It is the migration control plane, not just a diff viewer.

## Purpose

`sl-ds-migrate` exists to make SLDS upgrades predictable. It resolves the current installed version, fetches both old and new component APIs, computes a breaking-changes diff, turns that diff into an execution-ready migration plan, and hands the plan to the implementation engine.

The agent must cover both metadata updates and source-level changes across templates, TypeScript, styles, tests, and wrappers.

## Input

```json
{
  "fromVersion": "1.4.2",
  "toVersion": "2.0.1",
  "project": "/path/to/project",
  "dryRun": false
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `fromVersion` | No | Starting SLDS version; detected via `sl-ds-version` when omitted |
| `toVersion` | Yes | Target SLDS version to migrate to |
| `project` | Yes | Project root to update |
| `dryRun` | No | When `true`, generate diff and plan only without executing changes |

## Output

```json
{
  "fromVersion": "1.4.2",
  "toVersion": "2.0.1",
  "breakingChangesPath": ".sl-ds-cache/sl-ds-api/_breaking-changes/1.4.2-to-2.0.1.json",
  "migrationPlan": [
    "IMPL_MIGRATE_BLOK_0.md",
    "IMPL_MIGRATE_BLOK_1.md",
    "IMPL_MIGRATE_BLOK_Q.md"
  ],
  "executionOwner": "sdl-master",
  "dryRun": false,
  "verification": "pending",
  "confidence": 89
}
```

| Field | Description |
|-------|-------------|
| `fromVersion` | Detected or explicit starting version |
| `toVersion` | Target version |
| `breakingChangesPath` | Cached diff artifact comparing the two SLDS versions |
| `migrationPlan` | Ordered IMPL files that define the migration work |
| `executionOwner` | Agent responsible for executing the generated migration plan |
| `dryRun` | Whether this run stopped before applying changes |
| `verification` | `pending` \| `passed` \| `failed` status of post-migration regression |
| `confidence` | 0–100 confidence in migration completeness |

## Behavior

### 1. Determine the source version

```
1. If `fromVersion` is provided:
   → use it.
2. Else call `sl-ds-version` against `project`.
3. Read the currently installed SLDS version from detection output.
4. If no current version can be determined:
   → abort migration planning.
```

`toVersion` must always be explicit. `sl-ds-migrate` must never guess the destination release.

### 2. Fetch both API surfaces

```
1. Call `sl-ds-api` for `fromVersion`.
2. Call `sl-ds-api` for `toVersion`.
3. Ensure both caches contain comparable component metadata.
4. Record missing or newly introduced components.
```

Both versions must be normalized before diffing so that renamed or removed fields can be detected consistently.

### 3. Generate the breaking-changes diff

```
1. Compare old and new component APIs.
2. Detect:
   - property renames
   - removed properties
   - slot renames
   - event renames
   - component removals
   - CSS token renames
3. Merge in CHANGELOG-driven migration hints where available.
4. Write `.sl-ds-cache/sl-ds-api/_breaking-changes/{from}-to-{to}.json`.
```

The diff must be actionable, not just descriptive. Every breaking change entry should include the affected component, change type, old value, new value, and suggested migration strategy.

### 4. Generate migration IMPL files

`sl-ds-migrate` must create an execution-ready migration plan using the following structure:

1. **BLOK 0** — Update `package.json` and lockfile versions.
2. **BLOK 1..N** — Fix breaking changes grouped by component or feature area.
3. **BLOK Q** — Update tests, rerun tests, and verify completion.

Each block must include:

- scope
- search patterns
- required edits
- validation command
- rollback notes

Example plan sequence:

```
IMPL_MIGRATE_BLOK_0.md
IMPL_MIGRATE_BLOK_1.md
IMPL_MIGRATE_BLOK_2.md
IMPL_MIGRATE_BLOK_Q.md
```

### 5. Migration strategies by change type

Apply these strategies exactly:

| Change type | Strategy |
|-------------|----------|
| Property renamed | Find all usages and replace with the new property name |
| Property removed | Remove usage and add the documented alternative |
| Slot renamed | Update template slot assignments |
| Event renamed | Update event bindings and handler names where needed |
| Component removed | Replace with successor from CHANGELOG or migration hint |
| CSS token renamed | Update all SCSS and style references |

When the change affects Angular wrappers as well as raw elements, the plan must include both template and wrapper-layer edits.

### 6. Execute the plan

```
1. If `dryRun=true`:
   → stop after generating diff and IMPL files.
2. Else call `angular-specialist` for component-aware transformation guidance where structural Angular edits are required.
3. Hand the ordered IMPL plan to `sdl-master` for execution.
4. Track applied blocks and changed files.
```

`sdl-master` is the execution owner. `sl-ds-migrate` owns the planning, sequencing, and result interpretation.

### 7. Verification

After execution, full regression must run as the last phase of the migration workflow.

```
1. Reinstall dependencies if package versions changed.
2. Re-run project tests and required validation commands.
3. Mark verification as passed or failed.
4. If verification fails:
   → return the failed block and remaining regressions.
```

This verification stage may be executed by the downstream implementation environment as part of the `sdl-master` handoff, but `sl-ds-migrate` must require it in the plan.

### 8. Batching and safety rules

1. Large applications should batch migrations by feature area or library.
2. Blocks should be ordered so that package updates happen before source transformations.
3. Template and style migrations must be kept in the same block when they address the same component family.
4. If a breaking change cannot be migrated automatically, generate an explicit manual-action item instead of guessing.

## Failure Modes

| Failure | Detection | Recovery |
|---------|-----------|----------|
| Current version cannot be detected | `fromVersion` omitted and `sl-ds-version` returns null | Abort and require an explicit `fromVersion`. |
| Target version unavailable | `sl-ds-api` cannot fetch `toVersion` metadata | Abort and report invalid or unpublished target version. |
| Breaking diff incomplete | One or more components missing in either API cache | Generate partial plan, mark uncovered components, and lower confidence. |
| Structural Angular migration needed beyond simple replacements | Diff includes wrapper or template topology changes | Use `angular-specialist` guidance and create a dedicated IMPL block. |
| Execution fails mid-plan | `sdl-master` reports failed block | Return failed block index, partial changes, and resume instructions. |
| Regression suite fails after migration | Verification phase reports test/build errors | Mark migration incomplete and attach failing validation results. |

## Confidence Scoring

| Condition | Confidence |
|-----------|------------|
| Both versions resolved, full diff generated, plan executed, regression passed | 92–100 |
| Diff and plan complete, execution pending or dry run only | 78–91 |
| Partial API coverage but major breaking changes still classified | 60–77 |
| Some components missing from comparison or verification failed | 35–59 |
| Source or target version unresolved | 0–34 |

## Design Decisions

1. **Compare both APIs, not just changelogs.** API diffs catch real surface changes even when release notes are incomplete.
2. **Plan before execution.** Explicit IMPL blocks make large migrations resumable, reviewable, and safer to hand off.
3. **Package update first.** Dependency state must match the target version before source-level migration is validated.
4. **Change-type strategies are fixed.** Deterministic handling for renamed props, slots, events, and tokens avoids inconsistent migrations.
5. **Dry-run support.** Teams often need to review the blast radius before allowing automated changes.
6. **Verification is mandatory.** A migration is not complete until the upgraded project passes its regression checks.
