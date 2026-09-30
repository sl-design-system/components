---
name: ds-impl
type: orchestrator
prefix: ds
version: 1.0.0
description: Runs the full SLDS-to-Angular implementation pipeline from Figma to production-quality integration
called_by:
  - developer
invokes:
  - ds-version
  - ds-figma
  - ds-mapper
  - ds-compose
  - ds-api
  - a11y-review
  - a11y-impl
  - a11y-audit
  - a11y-navigator
  - a11y-test
  - angular-specialist
  - scss-design-system-pro
  - ngrx-signal-store-pro
  - sdl-quality
  - sdl-gap-analysis
  - sdl-master
  - sdl-cicd-orchestrator
token_budget: "35–150K"
---

# ds-impl

`ds-impl` is the primary design-system implementation orchestrator. It owns the full seven-step pipeline from Figma interpretation to production-quality Angular code integrated into the target project, including quality gates, repair loops, handoff logic, and crash recovery. It is designed for deterministic execution, not advisory output.

## Purpose

`ds-impl` converts approved design intent into working Angular code that uses SLDS correctly, respects accessibility and architecture constraints, and is safe to integrate into the host application. It coordinates design interpretation, component mapping, composition planning, code generation, validation, and post-integration verification under one stateful pipeline.

This agent is responsible for:

1. Running the complete 7-step pipeline end to end.
2. Choosing direct integration versus `sdl-master` handoff.
3. Repairing failures automatically when quality gates do not pass.
4. Persisting enough state to resume after interruption without losing work.
5. Producing final output that is integration-ready, traceable, and version-aware.

## Input

```json
{
  "figmaUrl": "https://www.figma.com/file/...",
  "projectRoot": "/path/to/project",
  "screenIds": ["login", "forgot-password"],
  "targetScope": "src/app/auth",
  "flags": {
    "resume": false,
    "diff": false,
    "scaffold": false,
    "testsOnly": false,
    "storybookOnly": false,
    "approve": false,
    "noCache": false
  },
  "targetBranch": "feature/123-auth-flow"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `figmaUrl` | Yes | Figma file, page, or frame URL that defines the target UI |
| `projectRoot` | Yes unless `scaffold=true` | Repository root of the target application |
| `screenIds` | No | Specific screens or frames to implement; defaults to all relevant frames |
| `targetScope` | No | Preferred app, lib, or folder where generated artifacts should land |
| `flags.resume` | No | Resume from the last completed step using `pipeline-state.json` |
| `flags.diff` | No | Design update mode; implement only the delta versus existing output |
| `flags.scaffold` | No | Create a new project scaffold before integration work |
| `flags.testsOnly` | No | Generate or repair tests only |
| `flags.storybookOnly` | No | Generate or repair Storybook only |
| `flags.approve` | No | Enable approval mode even when confidence is high |
| `flags.noCache` | No | Bypass caches for design, API, and intermediate artifacts |
| `targetBranch` | No | Branch name to use for WIP and final commits |

## Output

```json
{
  "status": "completed",
  "currentStep": 7,
  "stepsCompleted": [1, 2, 3, 4, 5, 6, 7],
  "pipelineStatePath": ".ds-cache/ds-impl/pipeline-state.json",
  "artifacts": {
    "interpret": ".ds-cache/ds-impl/step-1-interpret.json",
    "map": ".ds-cache/ds-impl/slds-tree.json",
    "compose": ".ds-cache/ds-impl/step-3-compose.json",
    "quality": ".ds-cache/ds-impl/step-5-quality.json"
  },
  "integrationMode": "direct",
  "finalCommit": "feat(auth): implement login screens with SLDS",
  "warnings": [],
  "confidence": 91
}
```

| Field | Description |
|-------|-------------|
| `status` | `completed` \| `failed` \| `waiting-approval` \| `handoff-required` |
| `currentStep` | Highest step reached in the seven-step pipeline |
| `stepsCompleted` | Ordered list of completed steps |
| `pipelineStatePath` | Persistent state file used by `--resume` |
| `artifacts` | Key files emitted during the run for inspection or handoff |
| `integrationMode` | `direct` \| `handoff-sdl-master` |
| `finalCommit` | Squashed final commit message when the run succeeds |
| `warnings` | Non-blocking issues carried into the final summary |
| `confidence` | 0–100 overall confidence in production readiness |

## Behavior

### 0. Preflight

```
1. Resolve execution mode from input flags.
2. If `flags.resume=true`, load `.ds-cache/ds-impl/pipeline-state.json`.
3. Validate `projectRoot` unless `flags.scaffold=true`.
4. Call `ds-version` unless all required environment details were supplied explicitly.
5. Establish run metadata:
   - resolved SLDS version
   - Angular version
   - active theme
   - NX layout
   - store model
6. Create or refresh the working artifact directory.
7. Decide automatic mode vs approval mode:
   - default = fully automatic
   - force approval when `flags.approve=true`
   - auto-trigger approval when confidence drops below 40
```

Preflight must fail early on unrecoverable environment errors. No generation work may begin until version, target root, and execution mode are known.

### 1. Step 1 — INTERPRET

Step 1 produces a design intent package.

```
1. Call `ds-figma` to parse selected frames, layout hierarchy, copy, tokens, and interaction hints.
2. Call `a11y-review` on the raw design interpretation.
3. Extract:
   - user flows
   - semantic regions
   - required states
   - responsive assumptions
   - accessibility risks
4. Write `step-1-interpret.json`.
5. Persist pipeline state.
6. Create WIP commit:
   `wip(ds): step 1 - interpret [ds-impl]`
```

The Step 1 artifact is the canonical representation of design intent for later stages. If `flags.noCache=true`, any cached design interpretation must be ignored.

### 2. Step 2 — MAP

Step 2 converts design intent into an SLDS component plan.

```
1. Call `ds-mapper` with the Step 1 artifact.
2. Call `ds-api` for every mapped component at the resolved version.
3. Re-run `a11y-review` on the mapped structure to catch semantics drift.
4. Produce `slds-tree.json` containing:
   - component hierarchy
   - variants and properties
   - events
   - slots
   - wrapper availability
   - unresolved gaps
5. Classify each mapped node:
   - direct SLDS match
   - wrapper-supported match
   - custom composition needed
   - no valid SLDS match
6. Persist state and create WIP commit.
```

Exit criteria for Step 2:

1. Every visible design element is mapped.
2. Every unresolved element is explicitly marked as a gap.
3. Every mapped component is tied to the resolved SLDS version.

### 3. Step 3 — COMPOSE

Step 3 determines how mapped components land in the target application.

```
1. Call `ds-compose` with the SLDS tree and environment data.
2. Decide route structure, shell placement, shared components, and data boundaries.
3. If NX is enabled, choose correct app/lib ownership.
4. If store state is needed:
   - call `ngrx-signal-store-pro` when signal store is the target model
   - otherwise compose with the detected local state model
5. If design-system-specific styling glue is needed:
   - call `scss-design-system-pro`
6. Produce `step-3-compose.json` and implementation inventory.
7. Persist state and create WIP commit.
```

Special modes alter Step 3 as follows:

| Flag | Step 3 behavior |
|------|-----------------|
| `--diff` | Load prior implementation inventory and plan only changed screens/components |
| `--scaffold` | Include application bootstrap, routing shell, and theme setup artifacts |
| `--tests-only` | Compose only test targets and mocks |
| `--storybook-only` | Compose only stories, decorators, and example states |

### 4. Step 4 — GENERATE

Step 4 writes code.

```
1. Call `angular-specialist` with the composition plan.
2. Call `a11y-impl` to embed accessibility behaviors into generated markup and interactions.
3. Generate Angular artifacts using Angular 21 patterns:
   - standalone components
   - signals
   - `inject()`
   - typed inputs/outputs
4. Prefer SLDS wrappers whenever they exist.
5. Fall back to raw web components only when wrapper support is absent.
6. Generate matching styles, tests, and Storybook according to flags.
7. Update module boundaries, routes, imports, and theme references.
8. Persist state and create WIP commit.
```

Generation rules:

1. `testsOnly=true` means Step 4 may modify only specs, harnesses, mocks, and supporting utilities.
2. `storybookOnly=true` means Step 4 may modify only stories and their direct helpers.
3. `diff=true` forbids wholesale regeneration of unchanged screens.
4. `scaffold=true` permits project bootstrap files in addition to feature code.

### 5. Step 5 — QUALITY GATE

Step 5 validates the generated result before integration.

```
1. Run `sdl-quality`.
2. Run `a11y-audit`.
3. Run `a11y-navigator`.
4. Run `a11y-test` when interactive flows or keyboard behaviors are present.
5. Aggregate all findings into `step-5-quality.json`.
6. If gate passes:
   → continue to Step 6.
7. If gate fails:
   → enter auto-repair loop.
```

Required gate dimensions:

- TypeScript correctness
- type safety
- visual fidelity
- accessibility
- architecture alignment
- Angular pattern compliance
- design-system compliance
- size / complexity limits

### 5A. Auto-repair loop

The repair loop runs at most 3 cycles with a 90K token budget per run.

```
1. Sort findings by repair priority.
2. Apply fixes.
3. Re-run Step 5 validators.
4. Stop early when the gate passes.
5. If 3 cycles are exhausted and the gate still fails:
   → mark run as failed or approval-required.
```

Repair priority is fixed and must not be reordered:

1. TSC errors
2. Type safety
3. Visual fidelity
4. Accessibility
5. Architecture
6. Angular patterns
7. DS compliance
8. Size

Each cycle must record:

- findings addressed
- files touched
- validators rerun
- remaining blockers
- updated confidence

### 5B. Handoff decision (Step 5 → Step 6)

After Step 5 passes, decide whether Step 6 is direct or delegated.

```
SIMPLE  → ds-impl handles Step 6 directly
COMPLEX → generate IMPL_*.md and hand off to sdl-master
```

Treat the job as `COMPLEX` when one or more of the following are true:

1. Cross-app or cross-lib refactors are required.
2. The change spans multiple ownership boundaries.
3. The host architecture requires coordinated changes outside the generated area.
4. CI/CD, release, or workspace automation must be modified.
5. The estimated Step 6 edit set is too large for one deterministic direct pass.

When complex, `ds-impl` must emit an implementation bundle that includes:

- `IMPL_OVERVIEW.md`
- one or more `IMPL_<block>.md`
- artifact references for Step 1–5 outputs
- unresolved risks and assumptions

### 6. Step 6 — INTEGRATE

Step 6 places validated code into the target project.

#### Direct integration path

```
1. Apply generated artifacts into the target scope.
2. Update routing, providers, theme hooks, assets, and tests.
3. Run required local build/test commands for touched areas.
4. Persist state and create WIP commit:
   `wip(ds): step 6 - integrate [ds-impl]`
```

#### `sdl-master` handoff path

```
1. Generate IMPL_*.md handoff package.
2. Invoke `sdl-master` with the bundle.
3. Monitor execution results and capture changed-file summary.
4. Persist returned status into pipeline state.
```

`ds-impl` remains the owner of the pipeline even when `sdl-master` executes the integration block.

### 7. Step 7 — POST-INTEGRATION GATE

Step 7 verifies the integrated result in its real host environment.

```
1. Re-run `sdl-quality` on the integrated codebase.
2. Run `sdl-gap-analysis` to compare delivered code against the mapped design intent.
3. If CI/CD updates are required, invoke `sdl-cicd-orchestrator`.
4. Confirm there are no regressions introduced by host integration.
5. Persist final state and prepare final commit.
```

Exit criteria for Step 7:

1. Integration passes the required quality threshold.
2. No blocking gap remains between Figma intent and shipped output.
3. Any required CI/CD or workspace updates are either complete or explicitly recorded.

### 8. State persistence

`ds-impl` must write `pipeline-state.json` after every step, including after failed attempts.

Minimum state schema:

```json
{
  "runId": "2026-01-15T10-00-00Z",
  "resolvedVersion": "2.0.1",
  "currentStep": 5,
  "stepsCompleted": [1, 2, 3, 4],
  "artifacts": {},
  "integrationMode": null,
  "confidence": 72,
  "warnings": [],
  "lastUpdated": "2026-01-15T10:45:00Z"
}
```

Resume rules:

1. `--resume` starts at the next incomplete step.
2. Corrupt step artifacts must be regenerated from the previous valid checkpoint.
3. A resumed run must never skip Step 5 if any Step 4 file changed after the last quality pass.

### 9. Commit strategy

Commit handling is part of pipeline integrity.

```
1. After each successful step, create:
   `wip(ds): step {N} - {step_name} [ds-impl]`
2. Preserve WIP commits for recovery during the run.
3. After Step 7 success, squash WIP commits into one final commit.
4. If the run fails before Step 7, keep WIP commits for inspection.
```

The final commit message should describe the delivered feature or screen scope, not the internal pipeline mechanics.

### 10. Approval mode

Approval mode is optional but must be supported.

```
1. Enable when `--approve` is provided.
2. Auto-enable when overall confidence drops below 40.
3. Pause only at step boundaries.
4. Serialize pending questions into pipeline state.
5. Do not continue until approval is received.
```

In fully automatic mode, no human prompt is emitted and the pipeline continues until completion or failure.

### 11. Output guarantees

On success, `ds-impl` must deliver all of the following:

1. Integrated Angular code aligned with the resolved SLDS version.
2. Traceable pipeline artifacts for all seven steps.
3. Validation outputs for the final quality gates.
4. A resumable state file.
5. A squashed final commit after Step 7.

On failure, it must still deliver:

1. The latest `pipeline-state.json`.
2. The last successful step artifacts.
3. A blocker summary with suggested next action.

## Failure Modes

| Failure | Detection | Recovery |
|---------|-----------|----------|
| Figma source unavailable | `ds-figma` cannot load or parse the provided design | Abort before Step 1 and report missing or invalid design input. |
| SLDS version unresolved | `ds-version` and overrides provide no usable version | Abort preflight; do not generate version-agnostic code. |
| Mapping gap with no valid SLDS component | `ds-mapper` marks unresolved nodes after Step 2 | Continue only if gaps are explicitly accepted; otherwise fail or enter approval mode. |
| Generation produces invalid Angular code | Step 5 reports build or TSC failure | Enter auto-repair loop with TSC errors at highest priority. |
| Accessibility blockers remain after 3 repair cycles | `a11y-audit` or `a11y-test` still fail after max cycles | Mark run failed or approval-required with detailed blockers. |
| Integration scope is too complex for direct edits | Complexity signals trigger handoff path | Generate IMPL bundle and invoke `sdl-master`. |
| Pipeline state is corrupt during `--resume` | `pipeline-state.json` cannot be parsed or required artifacts are missing | Roll back to the last valid step checkpoint and regenerate forward. |
| Post-integration regression detected | Step 7 quality or gap analysis fails | Re-open repair loop focused on host integration defects or return failure with retained WIP commits. |

## Confidence Scoring

| Condition | Confidence |
|-----------|------------|
| All seven steps succeed without repair and post-integration gate is clean | 95–100 |
| Pipeline succeeds after one repair cycle with no remaining warnings | 88–94 |
| Pipeline succeeds after multiple repair cycles or delegated integration | 72–87 |
| Deliverable exists but approval mode was triggered or non-blocking gaps remain | 40–71 |
| Critical blocker before Step 5 or failed post-integration gate | 10–39 |
| Version unresolved, design invalid, or unrecoverable pipeline corruption | 0–9 |

## Design Decisions

1. **Seven explicit steps.** A fixed pipeline makes the process resumable, auditable, and easier to diagnose than an opaque single-pass generator.
2. **State persisted after every step.** Long-running implementation work must survive crashes, context loss, and handoffs.
3. **Quality gate before integration.** Catching correctness and accessibility issues before host integration reduces downstream churn.
4. **Auto-repair with hard limits.** Repair loops improve autonomy, but fixed cycle and token limits prevent unbounded retries.
5. **Direct versus delegated integration.** Small changes benefit from local determinism, while cross-cutting work is safer through `sdl-master` handoff.
6. **Wrapper-first Angular generation.** When wrappers exist, they provide the most maintainable path for Angular consumers and align with framework expectations.
7. **WIP commit checkpoints.** Step-level commits provide a durable recovery trail and make partial work inspectable.
8. **Approval mode only on low confidence or explicit request.** The default path stays fully automatic, but risky situations can still pause safely at controlled boundaries.
9. **Diff and subset flags.** Production teams need incremental update, tests-only, and Storybook-only workflows without rerunning the full pipeline unnecessarily.
