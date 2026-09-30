---
name: sl-ds-setup
description: |
  USE WHEN: user says "sl-ds setup", "setup design system", "skonfiguruj sl-ds", "init sl-ds", or invokes any other /sl-ds-* skill without .sl-ds-config.yaml present, or framework changed (e.g. project upgraded Angular major version).
  DOES: Detect stack (framework, SLDS version, i18n library, state management, directory structure), write/update .sl-ds-config.yaml, ensure .gitignore covers .sl-ds-cache/, verify fe-standards exists at .agents/standards/fe/. Produces codebase-analysis.json that downstream skills read.
  NEVER USE WHEN: .sl-ds-config.yaml already exists AND user just wants to start a new screen — use /sl-ds-layout instead. Or when user wants to actually generate code — that's /sl-ds-implement (but it'll redirect here if config missing).
version: 1.0.0
model: sonnet
tags: [sl-ds, setup, config, detection, framework, slds, first-time]
next:
  on_success: [sl-ds-layout, sl-ds-audit]
  on_failure: [sl-ds-help]
  related: [sl-ds, sl-ds-help]
requires:
  artifacts: []
  skills_completed: []
produces:
  artifacts: [.sl-ds-config.yaml, .sl-ds-cache/sl-ds-impl/codebase-analysis.json]
  decisions: []
cache:
  invalidate_on: [package.json, .sl-ds-config.yaml]
  reuse_if: [.sl-ds-cache/sl-ds-impl/codebase-analysis.json]
token_budget: "3-8K"
sub_agents:
  - name: codebase-scanner
    subagent_type: Explore
    model: sonnet
    purpose: Grep patterns across <targetScope>/src/ for state mgmt + DS usage + i18n + structure
fe_standards_consulted:
  primary: [checklist.md, conventions-and-tooling.md, sanoma-ds.md]
  rule_ids: [CHK-1, TOOL-1, TOOL-2, TOOL-3, TOOL-4, TOOL-5, SDS-7]
---

# DS Setup — Project Detection & Configuration

## Purpose

First-time-in-a-project skill. Detects what the project actually uses (framework, SLDS version, i18n, state management, directory structure), writes `.sl-ds-config.yaml` with sensible defaults that match what's already there, and writes a `codebase-analysis.json` cache that every downstream skill reads to make codebase-informed proposals. Without this, `/sl-ds-plan` would have to guess; with it, defaults are evidence-based.

## When to use

- First time using `sl-ds-*` skills in this project (no `.sl-ds-config.yaml`)
- Project framework changed (e.g. Angular 17 → 19, SLDS major bump)
- User explicitly invokes `/sl-ds-setup` to re-detect
- `/sl-ds` router routed here because of `virgin` state

## When NOT to use

- `.sl-ds-config.yaml` exists AND framework hasn't changed AND user wants to start a screen → run `/sl-ds-layout` instead (this skill is idempotent but adds no value)
- User wants to actually write code → `/sl-ds-implement` (it'll redirect here if config missing, which is fine)

## Preconditions

None for DS cache. `/sl-ds-setup` is the bootstrap and does NOT require a Figma URL.

| Required artifact | If missing |
|---|---|
| `package.json` | STOP per [`../_shared/refusal-protocol.md`](../_shared/refusal-protocol.md) §4.7. Producer: out of scope — initialize your frontend project first (`nx new` / `ng new` / `npm init`). |

## Inputs

**`$ARGUMENTS` (user-provided, all optional):**

| Field | Description |
|---|---|
| `--reset` flag | Delete existing `.sl-ds-config.yaml` + `codebase-analysis.json` and re-detect from scratch (otherwise: merge with existing) |
| `targetScope` | Path under which to look for code (e.g. `apps/teacher-dashboard`). If absent: detect via Nx workspace or default to repo root |

**Auto-detected (from filesystem):**

- `framework` — from `package.json` deps
- `slds_version` — from `node_modules/@sl-design-system/button/package.json` (or `not-installed`)
- `angular_version` — from `node_modules/@angular/core/package.json`
- `i18n_library` — `angular-i18next` | `@ngx-translate/core` | `react-i18next` | `vue-i18n` | `none`
- `nx_enabled` — does `nx.json` exist
- `theme` — from any existing SLDS theme imports

## Workflow

**Pre-flight:** scope fe-standards per [`../_shared/fe-standards-index.md`](../_shared/fe-standards-index.md) §3 (per frontmatter `fe_standards_consulted` — `checklist.md` CHK-1 + `conventions-and-tooling.md` TOOL-1..5 + `sanoma-ds.md` SDS-7). Codebase-scanner sub-agent (Step 2) loads relevant subsets. Step 4 config-template follows SDS-7. Record `appliedRules` in `codebase-analysis.json` per `@_shared/cache-schema.md §8.1`.

### Step 1: Detect frontend stack

**Executor:** orchestrator on **sonnet**

Run detection commands (see [`references/detection.md`](references/detection.md) for the full list):

```bash
# Framework
grep -l '"@angular/core"' package.json && echo "angular"
grep -l '"react"' package.json && echo "react"
grep -l '"vue"' package.json && echo "vue"

# SLDS version
test -f node_modules/@sl-design-system/button/package.json \
  && node -e "console.log(require('./node_modules/@sl-design-system/button/package.json').version)"

# Angular version
test -f node_modules/@angular/core/package.json \
  && node -e "console.log(require('./node_modules/@angular/core/package.json').version)"

# i18n
grep -E '"(angular-i18next|@ngx-translate/core|react-i18next|vue-i18n)"' package.json | head -1
```

If detected framework is anything other than `angular` (e.g. `react`, `vue`, `svelte`, `unknown`) → apply [`../_shared/refusal-protocol.md`](../_shared/refusal-protocol.md) §4.4 refusal and STOP. Sanoma Learning DS v1 supports Angular only — fe-standards live in [`../../standards/fe/angular.md`](../../standards/fe/angular.md) (NG-*) and [`../../standards/fe/sanoma-ds.md`](../../standards/fe/sanoma-ds.md) (SDS-*).

Refusal message:

```
> ❌ Sanoma Learning DS v1 supports Angular only.
>
> Detected framework: <react | vue | svelte | unknown>
>
> Options:
>   • If this is an Angular project: check `package.json` for `@angular/core` — was it removed?
>   • If this is a multi-framework monorepo: invoke /sl-ds-setup from inside the Angular sub-project's directory
>   • If this is a react/vue/other project: Sanoma Learning DS v1 is not the right tool. fe-standards generic files (architecture.md, components.md, …) are framework-agnostic and may be useful as reference even outside this skill suite.
>
> No partial support, no stub. Honest scope: v1 = Angular full-depth.
```

STOP. Do NOT proceed to write `.sl-ds-config.yaml` for an unsupported framework.

### Step 2: Spawn codebase-scanner sub-agent

**Executor:** `Agent(subagent_type: "general-purpose", model: "sonnet")` — sub-agent, clean context

Pass to sub-agent:
- `targetScope` path
- Reference: [`references/detection.md`](references/detection.md) §3 (grep patterns)
- Task: scan `<targetScope>/src/` for state management, component structure, DS usage, i18n active calls — return JSON

**Sub-agent returns:**

```json
{
  "stateManagement": {
    "pattern": "signal-store" | "service-rxjs" | "static" | "none",
    "evidence": [".../shop/data/cart.store.ts:12", "..."]
  },
  "directoryStructure": {
    "pattern": "per-feature" | "per-type" | "flat",
    "exampleDirs": ["src/app/components/", "src/app/features/"]
  },
  "dsUsage": {
    "active": true,
    "componentsFound": ["sl-button", "sl-card", "sl-icon"],
    "importedFrom": "@sl-design-system/angular"
  },
  "i18nUsage": {
    "active": true,
    "library": "angular-i18next",
    "pipeName": "I18NextPipe"
  }
}
```

**Output:** `.sl-ds-cache/sl-ds-impl/codebase-analysis.json` (sub-agent writes this directly)

### Step 3: Library decision (SLDS install gate)

**Executor:** orchestrator on **sonnet**

If `slds_version` was detected → proceed in **DS mode** (default).

If `slds_version` is `not-installed`, ask user via structured format from [`../_shared/questions-format.md`](../_shared/questions-format.md):

```
> **SLDS not installed in this project.**
>
> What I found: no `@sl-design-system/*` in package.json or node_modules
>
> ⭐ **Install SLDS** — required for pixel-perfect DS implementation. I'll add @sl-design-system/{button,card,icon,divider}/register and @sl-design-system/angular/* packages. Strength: full DS coverage, theme support, accessibility built-in. Tradeoff: adds ~30 dependencies.
> **Custom mode** — no DS library, generate plain Angular components with CSS. Strength: zero new deps. Tradeoff: code won't match SLDS Figma components, no theme switching, manual a11y.
```

Record choice as `dsMode: "slds" | "custom"` in config.

### Step 4: Write `.sl-ds-config.yaml`

**Executor:** orchestrator on **sonnet**

If `.sl-ds-config.yaml` exists:
- Read it
- Merge detected values (don't overwrite user customizations like `pipeline.mode` or `quality.*`)
- Add/update only the `project.*` and `accessibility.*` and `framework` keys

If absent:
- Use the template from [`references/config-template.md`](references/config-template.md)
- Fill in detected values

Always update `sl-ds-agents.version: "1.0"` and `framework: <detected>` and `project.nx_enabled: <true|false>` and `project.root: <repo-root>`.

**WARNING:** Never delete or modify keys the user added manually. If unsure, ask:

```
> **Existing .sl-ds-config.yaml has custom key `<key>` not in our template.**
> Preserve as-is / Show me the diff
```

### Step 5: `.gitignore` discipline

**Executor:** orchestrator on **sonnet**

Ensure `.gitignore` contains `.sl-ds-cache/`. If missing, append:

```
# Sanoma Learning DS skills — machine-state cache (regeneratable)
.sl-ds-cache/
```

If `.gitignore` doesn't exist → create one with just that block + an apology in stdout.

### Step 6: Sanity check + summary

**Executor:** orchestrator on **sonnet**

Print:

```
> ✅ DS Setup complete
>
> | Detected | Value |
> |---|---|
> | Framework | Angular 19.2.1 |
> | SLDS | 2.1.0 (DS mode) |
> | i18n | angular-i18next (I18NextPipe) |
> | State | Signal Store (4 stores found in libs/shop/) |
> | Structure | per-feature (src/app/features/, src/app/components/) |
> | Nx | yes |
>
> Wrote: .sl-ds-config.yaml, .sl-ds-cache/sl-ds-impl/codebase-analysis.json
> Next: `/sl-ds-layout` (analyze Figma + design shared shell)
```

## Outputs

| Path | Purpose |
|---|---|
| `.sl-ds-config.yaml` | Human-editable project config — committed |
| `.sl-ds-cache/sl-ds-impl/codebase-analysis.json` | Machine cache of detection results — gitignored |

These MUST match `produces.artifacts` in frontmatter.

## Hard gates

- `package.json` absent → STOP (precondition, see above)
- Detected `framework` is anything other than `angular` → STOP with refusal §4.4 (Sanoma Learning DS v1 = Angular only; fe-standards live in `.agents/standards/fe/angular.md` + `sanoma-ds.md`)
- `.sl-ds-config.yaml` has invalid YAML after merge → STOP, do not overwrite the original; write to `.sl-ds-config.yaml.new` + show diff + ask user
- Sub-agent (codebase-scanner) returns malformed JSON → retry once, then STOP with diagnostic

## Resume

Resume per [`../_shared/resume-discipline.md`](../_shared/resume-discipline.md). Progress: `.sl-ds-cache/sl-ds-setup/progress.json`. Checkpointed steps: none (each step atomic). If `status: completed` AND `package.json` hash matches → print summary + EXIT (idempotent). Manual fallback table (if `progress.json` missing or corrupt):

| Artifact present | Resume hint |
|---|---|
| Nothing | Step 1 (fresh detect) |
| `.sl-ds-cache/sl-ds-impl/codebase-analysis.json` exists | Step 4 (config write) — detection cache reused if `package.json` hash unchanged |
| `.sl-ds-config.yaml` exists AND `codebase-analysis.json` exists AND `package.json` unchanged | Step 6 (summary only); print and EXIT |
| `--reset` flag in `$ARGUMENTS` | Step 1, ignoring all cache |

The skill is idempotent — re-running with the same input is safe and produces identical config (modulo merge of user customizations preserved in §4).

## Next

After successful completion:

- **Most likely next:** `/sl-ds-layout` — if user wants to start a new screen
- **Alternative:** `/sl-ds-audit` — if user has existing code and wants to check current health before doing more

After hard-gate failure:

- **Recovery:** depends on which gate tripped — the refusal message names it. `/sl-ds-help` for general guidance.

If invoked via `/sl-ds` router, return `{ status: "ok", nextSuggested: "sl-ds-layout" }` so router can chain.

## References

| File | Load when |
|---|---|
| [detection.md](references/detection.md) | Step 1 + Step 2 — exact bash commands + grep patterns + sub-agent contract |
| [config-template.md](references/config-template.md) | Step 4 — when writing a fresh `.sl-ds-config.yaml` |
| [../_shared/refusal-protocol.md](../_shared/refusal-protocol.md) | Step 1 — framework-stub refusal §4.4 |
| [../_shared/questions-format.md](../_shared/questions-format.md) | Step 3 — SLDS install question |
| [../_shared/cache-schema.md](../_shared/cache-schema.md) | Step 2 — codebase-analysis.json envelope |
