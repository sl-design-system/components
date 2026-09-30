---
name: sl-ds-verify
description: |
  USE WHEN: code was just implemented (or modified) and needs verification, user says "verify", "sprawdź", "build it", "pixel-perfect", "pixelmatch", or follows /sl-ds-implement.
  DOES: Runs nx build + nx lint (zero errors required), checks fe-standards patterns (NG-* Angular idioms; SDS-* SLDS imports; AP-* antipatterns), then runs Design Fidelity Verification — composite score from DOM position accuracy, per-component visual pixelmatch, token compliance, Code Connect compliance, and RWD breakpoint passes. Target ≥95/100. Auto-repair up to 2 attempts per failing element. Cleans up server on exit.
  NEVER USE WHEN: code hasn't been generated yet — there's nothing to verify. Or for static analysis without dev server — that's /sl-ds-audit.
version: 3.0.0
model: sonnet
tags: [sl-ds, verify, build, lint, fidelity-score, pixel-perfect, dev-server, code-connect, rwd]
next:
  on_success: [sl-ds-update, sl-ds-audit]
  on_failure: [sl-ds-help, sl-ds-implement]
  related: [sl-ds-audit, sl-ds-implement]
requires:
  artifacts:
    - .sl-ds-config.yaml
    - .sl-ds-cache/sl-ds-impl/node-tree.json
    - .sl-ds-cache/sl-ds-impl/tokens-verified.json
    - .sl-ds-cache/sl-ds-impl/architecture.json
  skills_completed: [sl-ds-setup, sl-ds-tokens, sl-ds-plan, sl-ds-implement]
produces:
  artifacts:
    - .sl-ds-cache/sl-ds-impl/build-result.json
    - .sl-ds-cache/sl-ds-impl/fidelity-result.json
  decisions: [context/foundation/sl-ds-decisions/<screen>.md]
cache:
  invalidate_on: [figma_lastModified]
  reuse_if: []
token_budget: "5-30K"
sub_agents:
  - name: build-runner
    subagent_type: general-purpose
    model: sonnet
    purpose: Runs nx build + nx lint, parses output, attempts auto-repair on common errors
  - name: fidelity-checker
    subagent_type: general-purpose
    model: sonnet
    purpose: Starts dev server, measures DOM positions, per-component pixelmatch, token/Code Connect compliance, RWD checks, computes composite fidelity score
fe_standards_consulted:
  primary: [testing.md, checklist.md, angular.md, sanoma-ds.md, antipatterns.md]
  rule_ids: [TEST-1, TEST-2, TEST-3, TEST-4, TEST-5, TEST-6, TEST-7, CHK-3, NG-1, NG-7, NG-8, SDS-1, SDS-2, SDS-3, SDS-4, AP-1, AP-2, AP-3]
---

# DS Verify — Build, Lint, Design Fidelity

## Purpose

Catches three categories of failure in generated code:
1. **Compile-time + lint errors** — nx build/lint
2. **Framework-rule violations** — pattern checks (no @Input, no *ngFor, register.js for SLDS, etc.)
3. **Design fidelity drift** — composite score across five dimensions (see formula below)

**Composite Design Fidelity Score (v3.0):**

```
fidelity_score =
  0.35 * position_accuracy   (% elements within ±2px Δx/Δy/Δw/Δh vs Figma)
+ 0.30 * visual_match        (avg per-component pixelmatch passing >99%)
+ 0.15 * token_compliance    (% CSS values via tokens, not hardcoded hex)
+ 0.15 * code_connect_compliance (% sl-* components matching official snippet)
+ 0.05 * rwd_breakpoint_pass (passes at 1440/1024/768/375)
= 0..100
```

Target: **≥95 = pixel-perfect (or close)**. Each dimension reported separately so failing components get targeted repairs.

## When to use

- `/sl-ds-implement` just completed
- User edited generated code manually and wants to re-verify
- `/sl-ds` router routed here because pipeline-state shows generate complete, verify pending
- Re-run after `/sl-ds-update` patched code

## When NOT to use

- Code hasn't been generated yet → run `/sl-ds-implement` first
- User wants static analysis only (no dev server, no Figma) → `/sl-ds-audit`
- Production deployment verification → out of scope; this skill is dev-loop

## Preconditions

| Required artifact | If missing |
|---|---|
| `.sl-ds-config.yaml` | STOP per [`../_shared/refusal-protocol.md`](../_shared/refusal-protocol.md) §4.7 (producer: `/sl-ds-setup`) |
| `.sl-ds-cache/sl-ds-impl/architecture.json` | STOP per §4.7 (producer: `/sl-ds-plan`; if architecture exists but no code → `/sl-ds-implement`) |
| Every file in `architecture.componentTree[].path` exists on disk | STOP per §4.7, redirect to `/sl-ds-implement` |

Existence check:

```bash
node -e "
  const arch = require('./.sl-ds-cache/sl-ds-impl/architecture.json');
  const fs = require('fs');
  for (const c of arch.componentTree) {
    if (!fs.existsSync(c.path)) { console.error('MISSING:', c.path); process.exit(1); }
  }
"
```

## Inputs

**`$ARGUMENTS` (user-provided):**

| Field | Required | Description |
|---|---|---|
| `--skip-fidelity` | no | Build + lint + pattern checks only; skip dev server + fidelity verification |
| `--port=<N>` | no | Override default dev server port (default 4201) |

**Auto-detected:**

- Project name — from `.sl-ds-config.yaml` → `project.target_scope`
- Figma viewport width — from `node-tree.json` root node `width`

## Workflow

Pre-flight: scope fe-standards per [`../_shared/fe-standards-index.md`](../_shared/fe-standards-index.md) §3 per frontmatter `fe_standards_consulted`. Record `appliedRules` in build/fidelity results per [`@_shared/cache-schema.md`](../_shared/cache-schema.md) §8.6.

### Step 1: Build + Lint

**Executor:** `Agent(subagent_type: "general-purpose", model: "sonnet")` — build-runner sub-agent

Pass: project name, reference to [`references/build-checks.md`](references/build-checks.md).

```bash
npx nx build <project> 2>&1 | tee .sl-ds-cache/sl-ds-impl/_build.log
npx nx lint <project> 2>&1 | tee .sl-ds-cache/sl-ds-impl/_lint.log
```

Zero errors required for both. Auto-repair loop: max 3 attempts per [`references/build-checks.md`](references/build-checks.md) §2. After 3 failures → STOP per [`../_shared/refusal-protocol.md`](../_shared/refusal-protocol.md) §3.

### Step 2: Pattern checks

**Executor:** orchestrator on **sonnet**

Framework-rule pattern grep per [`references/build-checks.md`](references/build-checks.md) §3 (no @Input/@Output, no *ngFor, sl-* imports, max-/app- selector prefix, CUSTOM_ELEMENTS_SCHEMA documented). Failures → attempt one-shot auto-repair, otherwise STOP.

### Step 3: Design Fidelity Verification (if not `--skip-fidelity`)

**Executor:** `Agent(subagent_type: "general-purpose", model: "sonnet")` — fidelity-checker sub-agent

Pass: project name, port, viewport width, PLAN.md path, node-tree.json path, reference to [`references/composite-fidelity-method.md`](references/composite-fidelity-method.md).

**Prerequisites:** `pixelmatch` + `pngjs` npm packages installed; Playwright available.

#### 3a. Start dev server

```bash
npx nx serve <project> --port=<port> > /tmp/serve.log 2>&1 &
echo $! > /tmp/serve.pid
```

Poll until HTTP 200 (max 90s, 2s intervals). On timeout → STOP, port conflict or missing build artifact.

#### 3b. Read component list + Figma absolute positions

Read PLAN.md for component list. For each component read `absoluteBoundingBox` from `node-tree.json` keyed by nodeId — this is the Figma ground truth for position checks.

#### 3c. Per-component DOM position measurement

For each component: `element.boundingBox()` via Playwright. Compare Δx, Δy, Δw, Δh against Figma `absoluteBoundingBox`. Tolerance: ±2px per dimension. Record `pass/fail` per element. Position detail method: [`references/composite-fidelity-method.md`](references/composite-fidelity-method.md) §2.

#### 3d. Per-component visual pixelmatch

`element.screenshot()` per component → pixelmatch against Figma reference screenshot (cached from `/sl-ds-plan` or fetched fresh via nodeId). Tiered tolerance per element type — layout/color zones: 0%, text zones: <5%, shadow zones: ignored. Visual detail method: [`references/composite-fidelity-method.md`](references/composite-fidelity-method.md) §3.

#### 3e. Token compliance scan

Grep generated CSS for hardcoded hex literals where DS tokens exist. Count `totalCss` declarations vs `hexLiterals`. Compliance method: [`references/composite-fidelity-method.md`](references/composite-fidelity-method.md) §4.

#### 3f. Code Connect compliance

Call `get_code_connect_map` for each sl-* component used in templates. Compare generated template structure against official snippet. Compliance method: [`references/composite-fidelity-method.md`](references/composite-fidelity-method.md) §5.

#### 3g. RWD check at 4 viewports

Re-run DOM position check at 1440, 1024, 768, 375px width. Pass = no layout overflow and position_accuracy ≥50% at each viewport. Method: [`references/composite-fidelity-method.md`](references/composite-fidelity-method.md) §6.

#### 3h. Compute composite fidelity score

Apply formula from Purpose section. Write `.sl-ds-cache/sl-ds-impl/fidelity-result.json` per output schema in [`references/composite-fidelity-method.md`](references/composite-fidelity-method.md) §7. Include `actionableIssues[]` listing element, issue type, and suggested fix.

#### 3i. Auto-repair per failing dimension (max 2 attempts per element)

For each FAIL: spawn small sub-agent (haiku, ~3K tokens) with rendered screenshot, Figma reference, diff PNG (if visual), component code, and SPEC from PLAN.md. Sub-agent proposes targeted code change. Apply, wait for HMR (2-3s), re-measure. After 2 failures → STOP, surface issue with options (show side-by-side, accept-as-is with exception, abort).

#### 3j. Cleanup

```bash
trap 'kill $(cat /tmp/serve.pid 2>/dev/null) 2>/dev/null' EXIT
```

ALWAYS runs, even on failure or interruption.

### Step 4: Present results

**Executor:** orchestrator on **sonnet**

```
> **Verification results — fidelity score: 87.5/100**
>
> | Check | Status |
> |---|---|
> | nx build | ✅ pass |
> | nx lint | ✅ pass |
> | Patterns (signals, control flow, imports) | ✅ pass |
> | Position accuracy (0.35×) | ⚠️ 2/7 elements ±2px — score 28.6 |
> | Visual match (0.30×) | ✅ avg 98.8% match — score 98.8 |
> | Token compliance (0.15×) | ✅ 97.9% — score 97.9 |
> | Code Connect (0.15×) | ⚠️ 16/18 matched — score 88.9 |
> | RWD breakpoints (0.05×) | ✅ 4/4 — score 100 |
> | **Composite fidelity** | ⚠️ 87.5/100 (target: 95) |
>
> ⭐ **Approve and continue** — mark sl-ds-decisions as completed
> **Show actionable issues** — see per-element breakdown
> **Re-run repairs** — attempt another auto-repair cycle
```

If user approves → update `sl-ds-decisions/<screen>.md` → `status: completed`, fill `## Design Fidelity Verification` section.

### Step 5: Write artifacts + update pipeline state

**Executor:** orchestrator on **sonnet**

Write `.sl-ds-cache/sl-ds-impl/build-result.json` and `.sl-ds-cache/sl-ds-impl/fidelity-result.json` per [`@_shared/cache-schema.md`](../_shared/cache-schema.md) §8.6.

Update `.sl-ds-cache/sl-ds-impl/pipeline-state.json`:

```json
{
  "completed": { "sl-ds-verify": { "at": "<iso>", "outcome": "pass" } },
  "pending": []
}
```

### Step 6: Final commit (optional, on user approval)

If user approved AND `.sl-ds-config.yaml` → `pipeline.wip_commits: true`:

```bash
git add <targetScope>/src/<screen>/ context/foundation/sl-ds-decisions/<screen>.md
git commit -m "feat(<scope>): implement <screen> from Figma [sl-ds-impl]"
```

Suggest to user — never auto-execute without their nod.

## Outputs

| Path | Purpose |
|---|---|
| `.sl-ds-cache/sl-ds-impl/build-result.json` | Build + lint + pattern check summary |
| `.sl-ds-cache/sl-ds-impl/fidelity-result.json` | Composite fidelity score + per-dimension breakdown |
| `context/foundation/sl-ds-decisions/<screen>.md` | Updated with fidelity results + final status |

Output schema for `fidelity-result.json` — see [`references/composite-fidelity-method.md`](references/composite-fidelity-method.md) §7.

## Hard gates

- `nx build` fails after 3 repair attempts → STOP, surface error
- `nx lint` fails after 3 repair attempts → STOP, surface error
- Pattern check fails AND auto-repair would mask the bug (e.g. undocumented `CUSTOM_ELEMENTS_SCHEMA`) → STOP, never silently suppress
- `position_accuracy < 50%` → STOP — most elements out of place, fundamental layout error
- Dev server doesn't reach 200 in 90s → STOP, port conflict or missing build artifact
- Code Connect snippet mismatch >30% of sl-* components → STOP — likely wrong DS usage, re-check with `/sl-ds-tokens`
- Visual match fails after 2 repair attempts per element → STOP, surface diff with options (show side-by-side / accept-as-is / abort)

Server cleanup (kill PID) MUST run even when STOP triggered — `trap` ensures this.

## Resume

Resume per [`../_shared/resume-discipline.md`](../_shared/resume-discipline.md). Progress: `.sl-ds-cache/sl-ds-verify/progress.json`. Checkpointed steps: Step 1 (per repair attempt), Step 3 (per measured node). **Live-process check:** verify `_serve.pid` process alive via `kill -0 $(cat _serve.pid)` before assuming dev server is up.

| State on disk | Resume hint |
|---|---|
| `build-result.json` (`ok: true`) + `fidelity-result.json` (score ≥95) fresh | EXIT with summary |
| `build-result.json` ok, `fidelity-result.json` missing | Step 3 only |
| `build-result.json` ok: false | Step 1 — re-run build |
| `_serve.pid` exists + process dead | Cleanup stale PID, then Step 1 |
| `_serve.pid` exists + process alive | Re-use running server, Step 3 |
| Nothing | Step 1 (full flow) |

## Next

After successful completion:

- **Most likely:** pipeline complete for this screen. User can move on.
- **Alternative:** `/sl-ds-update` if Figma is expected to change soon
- **Audit later:** `/sl-ds-audit` for periodic re-check

After hard-gate failure:

- `/sl-ds-implement` (fix in the file), `/sl-ds-tokens --force` (stale tokens), `/sl-ds-help` for guidance

## References

| File | Load when |
|---|---|
| [build-checks.md](references/build-checks.md) | Steps 1-2 — build/lint commands, error classification, pattern grep |
| [composite-fidelity-method.md](references/composite-fidelity-method.md) | Step 3 — position measurement, pixelmatch, token/code-connect compliance, RWD, output schema |
| [../../standards/fe/angular.md](../../standards/fe/angular.md) | Step 2 — NG-* Angular pattern compliance |
| [../../standards/fe/sanoma-ds.md](../../standards/fe/sanoma-ds.md) | Step 2 — SDS-* SLDS gates |
| [../../standards/fe/antipatterns.md](../../standards/fe/antipatterns.md) | Step 2 — AP-* forbidden patterns |
| [../../standards/fe/testing.md](../../standards/fe/testing.md) | Step 3 — TEST-* test idioms |
| [../_shared/fe-standards-index.md](../_shared/fe-standards-index.md) | Workflow start — index of fe-standards consultation |
| [../_shared/refusal-protocol.md](../_shared/refusal-protocol.md) | Hard gates — failure format |
