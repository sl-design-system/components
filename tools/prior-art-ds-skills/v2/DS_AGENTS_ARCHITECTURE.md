# DS Agents — Final Architecture

> **Status:** CANONICAL — supersedes AGENT_ARCHITECTURE.md (v1), AGENT_ARCHITECTURE_V2.md (v2),
> AGENT_ARCHITECTURE_V3.md (v3), and ARCHITECTURE_REVIEW.md. Supplements QUALITY_METRICS.md,
> QUALITY_GROUPS.md, and QUALITY_EXCEPTIONS.md (those remain as reference detail; this document
> is the single source of truth for all decisions and structure).
>
> **Scope:** Angular 21 + NX monorepo. Framework extensibility beyond Angular is noted in
> Section 14 but not implemented here.
>
> **Version:** 1.1 — all review findings fixed (contradictions, technical accuracy, operational
> sections, per-agent contracts, artifact schemas, security, failure modes)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Agent Inventory](#2-agent-inventory)
3. [Pipeline — 7 Steps](#3-pipeline--7-steps)
4. [Figma Strategy](#4-figma-strategy)
5. [Quality System](#5-quality-system)
   - 5.1 [Scoring — 5 Groups, Formula, Floors](#51-scoring--5-groups-formula-floors)
   - 5.2 [Metrics per Group](#52-metrics-per-group)
   - 5.3 [Exceptions — Taxonomy, Annotation, Auto-Detect](#53-exceptions--taxonomy-annotation-auto-detect)
   - 5.4 [Auto-Repair Loop](#54-auto-repair-loop)
6. [Accessibility Agent Group](#6-accessibility-agent-group)
7. [Prototypes — Mode A and Mode B](#7-prototypes--mode-a-and-mode-b)
8. [SDL Integration](#8-sdl-integration)
9. [DS API Contract](#9-ds-api-contract)
10. [Execution Modes](#10-execution-modes)
11. [Scenario Matrix](#11-scenario-matrix)
12. [Naming Conventions & Agent Map](#12-naming-conventions--agent-map)
13. [Token Budget](#13-token-budget)
14. [Open Decisions](#14-open-decisions)
15. [State Persistence & Resume](#15-state-persistence--resume)
16. [Operational Specifications](#16-operational-specifications)
   - 16.1 [Failure-Mode Matrix](#161-failure-mode-matrix)
   - 16.2 [Concurrency Handling](#162-concurrency-handling)
   - 16.3 [Rollback Strategy](#163-rollback-strategy)
   - 16.4 [Logging & Telemetry](#164-logging--telemetry)
   - 16.5 [Resume Hardening (State Schema v2)](#165-resume-hardening-state-schema-v2)
   - 16.6 [Custom Quality Tool Contracts](#166-custom-quality-tool-contracts)
   - 16.7 [Security & Credential Handling](#167-security--credential-handling)
17. [Per-Agent Contracts (Appendix A)](#17-per-agent-contracts-appendix-a)
18. [Pipeline Artifact Schemas (Appendix B)](#18-pipeline-artifact-schemas-appendix-b)

---

## 1. Executive Summary

The DS Agents system adds a **design interpretation and quality enforcement layer** on top of the
existing SDL sprint delivery pipeline. It solves four problems that existed before:

1. **No Figma bridge** — developers translated Figma designs to code manually, introducing
   inconsistency and skipping component API knowledge.
2. **No DS API knowledge in agents** — existing SDL workers did not know which `sl-*` component
   to use, what its properties were, or which version was installed in the target project.
3. **No quality definition** — the SDL pipeline had review steps but no quantified, reproducible
   quality scoring system covering architecture, visual fidelity, and accessibility.
4. **No prototype path** — there was no fast path from design to clickable demo that bypassed
   the full sprint pipeline.

### What is being built

**15 new agents** in two groups:

- **10 `sl-ds-*` agents** — design interpretation, API knowledge, prototype generation, migration
- **5 `a11y-*` agents** — accessibility audit, implementation, testing, navigation analysis

These integrate with the **existing SDL pipeline** (10 `sdl-*` agents + 12 specialist workers)
without replacing any existing components. Two specialist workers and one SDL agent require
minor updates for SLDS version awareness, theme detection, or BLOK routing.

### Pipeline at a glance

A full production implementation runs 7 numbered steps:

```
Step 1  INTERPRET    Figma → abstract component tree (sl-ds-figma)
Step 2  MAP          Abstract tree → SLDS component tree (sl-ds-mapper + sl-ds-api)
Step 3  COMPOSE      Component structure analysis — smart/dumb split (sl-ds-compose)
Step 4  GENERATE     Angular code generation (sl-ds-impl → angular-specialist)
Step 5  QUALITY      Pre-integration gate (sdl-quality + a11y-audit)
Step 6  INTEGRATE    Place into target app, connect routing/state (sl-ds-impl / sdl-master)
Step 7  POST-GATE    Post-integration quality gate (sdl-quality + sdl-gap-analysis)
```

### Quality bar

| Group | Weight | Floor |
|-------|--------|-------|
| Visual Fidelity | 25% | ≥ 90 |
| Code Quality | 23% | ≥ 90 |
| Architecture & Decomposition | 22% | ≥ 90 |
| Accessibility | 18% | ≥ 90 |
| DS & Maintainability | 12% | ≥ 90 |
| **Composite** | **100%** | **≥ 95** |

Visual Fidelity target: **token-perfect — 0 hardcoded values, 100% CEM + token compliance**.

### Default execution mode

**Fully automatic.** No human approval prompts unless agent confidence drops below 40/100.

---

## 2. Agent Inventory

### 2.1 New DS Agents (10 total, `sl-ds-` prefix)

| # | Agent | Type | Role | Called by |
|---|-------|------|------|-----------|
| 1 | `sl-ds-docs` | Entry point (user-facing) | API Q&A, documentation, examples | Developer directly |
| 2 | `sl-ds-proto` | Orchestrator (user-facing) | Prototype generation — Mode A or B | Developer directly |
| 3 | `sl-ds-impl` | Orchestrator (user-facing) | Full pipeline — Steps 1–7 | Developer directly |
| 4 | `sl-ds-audit` | Entry point (user-facing) | Design compliance check (Figma vs code) | Developer directly |
| 5 | `sl-ds-migrate` | Orchestrator (user-facing) | SLDS version bump + migration | Developer directly |
| 6 | `sl-ds-figma` | Sub-agent (internal) | Figma API reading — 3-pass multi-screen | sl-ds-impl, sl-ds-proto, sl-ds-audit |
| 7 | `sl-ds-mapper` | Sub-agent (internal) | Abstract tree → SLDS component tree | sl-ds-impl, sl-ds-proto |
| 8 | `sl-ds-compose` | Sub-agent (internal) | Smart/dumb split, store analysis, route structure | sl-ds-impl |
| 9 | `sl-ds-api` | Sub-agent (internal) | CEM fetch / cache / query per SLDS version | sl-ds-mapper, sl-ds-docs, sl-ds-migrate |
| 10 | `sl-ds-version` | Sub-agent (internal) | Detect SLDS version, Angular version, theme, NX structure | sl-ds-impl, sl-ds-proto, sl-ds-migrate |

### 2.2 New Accessibility Agents (5 total, `a11y-` prefix)

| # | Agent | Type | Role | Called by |
|---|-------|------|------|-----------|
| 11 | `a11y-audit` | Entry point (user-facing) | Audit against configured WCAG standard | Developer directly; sl-ds-impl (Step 5) |
| 12 | `a11y-impl` | Sub-agent (internal/external) | Implement or fix accessibility in generated code | sl-ds-impl (Steps 4, 5); developer directly |
| 13 | `a11y-test` | Entry point (user-facing) | Generate automated + manual a11y test plans | sl-ds-impl (Step 6); developer directly |
| 14 | `a11y-navigator` | Sub-agent (internal) | Navigation flow and keyboard journey analysis | sl-ds-impl (Step 5); a11y-audit |
| 15 | `a11y-review` | Sub-agent (internal) | Review designs and code before implementation | sl-ds-impl (Steps 1, 2) |

### 2.3 Existing SDL Agents — Reused Unchanged

| Agent | Role in the DS pipeline |
|-------|------------------------|
| `sdl-master` | Executes full sprint — 7 phases (called by sl-ds-impl for complex integration) |
| `sdl-impl-orchestrator` | Dispatches BLOKs to specialist workers; now routes `figma-design` BLOKs |
| `sdl-plan-scorer` | Validates generated IMPL_*.md plans |
| `sdl-gap-analysis` | Verifies implementation completeness |
| `sdl-quality` | Code review + scoring (used in Steps 5 and 7) |
| `sdl-verification` | Test orchestration — unit, Storybook, e2e, regression |
| `sdl-cicd-orchestrator` | PR creation + CI monitoring |
| `sdl-retrospective` | Post-sprint analysis |
| `sdl-repair` | Auto-fix loop for SDL issues |
| `sdl-log-analyzer` | CI log parsing |

### 2.4 Existing Specialist Workers — Reused Unchanged

| Worker | Role |
|--------|------|
| `storybook-pro` | Interactive Storybook stories |
| `qa-automation` | Unit + e2e tests |
| `ngrx-signal-store-pro` | NgRx SignalStore state |
| `migration-analyzer` | Legacy → MAX analysis |
| `migration-executor` | Legacy → MAX execution |
| `typescript-pro` | TypeScript patterns |
| `context-manager` | Long-session, crash recovery |
| `ux-specialist` | Behavior specs |
| `e2e-scenario-writer` | E2E test scenarios |

### 2.5 Existing Workers — Requiring Minor Updates

| Worker | Update required |
|--------|----------------|
| `angular-specialist` | Add SLDS version awareness — v1.x vs v2.x API differences; `max-` prefix for NX monorepo |
| `scss-design-system-pro` | Add theme detection — which theme CSS file is loaded in target project |
| `sdl-impl-orchestrator` | Add routing rule for `figma-design` BLOK type (see Section 8) |

### 2.6 Legacy Workers — Retained for MAX-Specific Work

| Worker | Notes |
|--------|-------|
| `accessibility-specialist` | MAX-specific WCAG AA checks. The new `a11y-*` group is generic (any project, configurable). Both coexist; `a11y-*` is preferred for new work. |

### 2.7 `sl-ds-docs` Contract

`sl-ds-docs` is a standalone developer-facing agent. It does not generate application code or
sprint plans. Its job is to answer design-system questions with version-aware, reproducible
answers.

| Area | Canonical behavior |
|------|--------------------|
| Knowledge sources | 1) `sl-ds-api` cache for the resolved SLDS version, 2) curated composition patterns, 3) Angular wrapper coverage derived from `packages/angular/` at the same git tag, 4) Storybook stories/examples, 5) curated gotchas/FAQ |
| Required output | Short answer, import/registration instructions, usage example, property/event/slot summary, wrapper note, version note |
| Wrapper policy | If an Angular wrapper exists, show wrapper-first usage. If no wrapper exists, explicitly say so and fall back to raw web component usage with `CUSTOM_ELEMENTS_SCHEMA`. |
| Warning policy | Always warn about draft/preview components, missing Angular wrappers, breaking changes, and version-specific API differences |
| Output format | Terminal-friendly markdown with compact code blocks and tables; no prose-only answers |

`sl-ds-docs` must always tell the developer **which source the answer came from**: cached API,
source-parsed API, Storybook example, or curated guidance. This preserves traceability and
prevents wrapper assumptions from being presented as guaranteed API facts.

### 2.8 `sl-ds-version` Detection Heuristics

`sl-ds-version` is responsible for environment detection before any mapping or generation step.
The heuristics below are canonical for Angular 21 + NX targets:

| Signal | Detection heuristic | Output |
|--------|---------------------|--------|
| SLDS package versions | Scan root + project `package.json` files for `@sl-design-system/*` dependencies | Declared version range per package |
| Resolved SLDS version | Read `yarn.lock` / lockfile entries for exact installed version | Exact version used by `sl-ds-api` cache |
| Angular version | Read root `package.json` and verify via lockfile | Exact Angular version |
| NX workspace | Check `nx.json`, `project.json`, and `libs/` / `apps/` layout | NX enabled + layer model |
| Theme | Inspect `styles.css`, `styles.scss`, `angular.json`, `project.json`, and theme imports for `@sl-design-system/<theme>` | Theme name + variant |
| Store model | Detect `@ngrx/*`, SignalStore usage, or local store conventions from imports | Compose/generation strategy |
| Multi-version workspace | Count version occurrences across projects | In fully automatic mode choose highest-usage version; in approval mode pause for confirmation |

If detection is ambiguous, the agent may continue only when the confidence rule in Section 10
allows it. Explicit CLI overrides (for example `--ds-version` or `--theme`) always win.

---

## 3. Pipeline — 7 Steps

### 3.1 Full Pipeline — `sl-ds-impl` (production implementation)

```
+-------------------------------------------------------------------+
|  USER: "Implement this Figma design in our Angular app"           |
+-------------------------------------------------------------------+
         |
         v
+-------------------------------------------------------------------+
|  sl-ds-version                                                       |
|  Detects: SLDS 2.0.1, Angular 21, NX monorepo (Steyer layers),  |
|           theme: sanoma-learning/light, store: NgRx SignalStore  |
+-------------------------------------------------------------------+
         |
         v
+===================================================================+
|| STEP 1: INTERPRET                                               ||
||                                                                 ||
||  Agent:   sl-ds-figma                                              ||
||  Input:   Figma frame URL(s)                                    ||
||  Process: 3-pass multi-screen strategy (see Section 4)         ||
||  A11Y:    a11y-review flags design-level issues                 ||
||  Output:  .sl-ds-cache/figma/{file-id}--{frame-id}@{lastModified}--component-tree.json ||
||           .sl-ds-cache/figma/a11y-notes.json                      ||
||  Gate:    Confidence ≥ 40 → auto-proceed                       ||
||           Confidence < 40 → pause, show alternatives            ||
+===================================================================+
         |
         v
+===================================================================+
|| STEP 2: MAP                                                     ||
||                                                                 ||
||  Agents:  sl-ds-mapper + sl-ds-api                                    ||
||  Input:   component-tree.json + CEM for SLDS 2.0.1             ||
||  Process: Figma component names → sl-* elements + correct props ||
||  A11Y:    a11y-review validates SLDS component choices          ||
||  Output:  .sl-ds-cache/slds-tree.json                             ||
||           .sl-ds-cache/a11y-requirements.json                     ||
||  Gate:    All sl-* elements exist in CEM → auto-proceed        ||
||           Unknown component → log warning, propose alternative  ||
+===================================================================+
         |
         v
+===================================================================+
|| STEP 3: COMPOSE                                                 ||
||                                                                 ||
||  Agent:   sl-ds-compose                                            ||
||  Input:   slds-tree.json + project structure                    ||
||  Process: Smart/dumb split, store needs, route assignments,     ||
||           NX library layer placement (feature/ui/data-access)  ||
||  Output:  .sl-ds-cache/composition-plan.json                      ||
||  Gate:    Validates against project conventions → auto-proceed  ||
+===================================================================+
         |
         v
+===================================================================+
|| STEP 4: GENERATE                                               ||
||                                                                 ||
||  Agent:   sl-ds-impl → dispatches angular-specialist              ||
||           + scss-design-system-pro + (ngrx-signal-store-pro)   ||
||  Input:   composition-plan.json + slds-tree.json + CEM         ||
||  Process: Angular 21 components, stores, routes, basic tests   ||
||  A11Y:    a11y-impl ensures generated code is accessible       ||
||  Output:  Angular source files                                  ||
||  Gate:    tsc --noEmit + nx lint → auto-proceed               ||
+===================================================================+
         |
         v
+===================================================================+
|| STEP 5: QUALITY + A11Y AUDIT (pre-integration gate)            ||
||                                                                 ||
||  Agents:  sdl-quality + a11y-audit + a11y-navigator            ||
||  Checks:  Composite quality score ≥ 95, all group floors ≥ 90 ||
||           Visual Fidelity verified via token/CEM/layout checks ||
||           WCAG 2.2 AA — 0 critical/serious violations          ||
||           Navigation flow logic (a11y-navigator)               ||
||  Output:  quality-report.json, a11y-report.md                  ||
||  Repair:  Up to 3 auto-repair cycles (90K token budget)        ||
||  Gate:    All critical/blocker issues resolved OR escalated    ||
+===================================================================+
         |
         v
+===================================================================+
|| STEP 6: INTEGRATE                                              ||
||                                                                 ||
||  Agent:   sl-ds-impl (simple projects) or sdl-master (complex)    ||
||  Input:   Generated components + project context               ||
||  Process: Place files in correct NX layer, wire routing,       ||
||           connect to existing state, update module boundaries  ||
||  A11Y:    a11y-test generates test scenarios for new code      ||
||  Output:  Integrated code in correct location                  ||
||  Gate:    nx build + nx lint + nx test --affected             ||
+===================================================================+
         |
         v
+===================================================================+
|| STEP 7: POST-INTEGRATION QUALITY GATE                          ||
||                                                                 ||
||  Agents:  sdl-quality + sdl-gap-analysis                       ||
||  Checks:  Integration may introduce new issues — re-run gate   ||
||           Verify cross-boundary lint (NX module boundaries)    ||
||           Verify routing and lazy loading correct              ||
||           Verify no regression in existing tests               ||
||  Output:  Final quality report, PR-ready verdict               ||
||  Gate:    All gates pass → hand off to sdl-cicd-orchestrator   ||
||           Any new issues → targeted repair (max 1 cycle)       ||
+===================================================================+
         |
         v
+-------------------------------------------------------------------+
|  sdl-cicd-orchestrator → PR creation + CI monitoring            |
+-------------------------------------------------------------------+
```

### 3.2 Gate Summary Table

| After Step | Gate Type | Fail Action |
|-----------|-----------|-------------|
| Step 1 | Confidence check (≥40) | Pause if <40, show mapping alternatives |
| Step 2 | CEM component existence check | Log unknown components, suggest replacements |
| Step 3 | Project convention validation | Auto-correct layer assignment |
| Step 4 | `tsc --noEmit` + `nx lint` | Fail fast, do not proceed to Step 5 |
| Step 5 | Composite ≥95, all floors ≥90, token-based VF, 0 critical a11y | Auto-repair (max 3 cycles) then escalate |
| Step 6 | `nx build + lint + test --affected` | Repair integration issues |
| Step 7 | Full re-score + gap analysis | Targeted repair (max 1 cycle) then escalate |

### 3.3 Prototype Pipeline — `sl-ds-proto` (simplified)

```
Mode A (HTML):    Step 1 → Step 2 → GENERATE HTML → Done
Mode B (Angular): Step 1 → Step 2 → Step 3 (lite) → GENERATE Angular → Done

Skipped for prototypes:
  - Step 5 composite quality gate (not enforced for prototypes)
  - Step 6 integration (prototypes are standalone)
  - Step 7 post-integration gate

Prototype verification:
  - Mode A HTML: none (N/A — throwaway)
  - Mode B Angular: lint + build only; no score threshold
```

### 3.4 Comparison: v1/v2/v3 vs Final

| Area | v1/v2/v3 | Final (this document) |
|------|----------|----------------------|
| Pipeline steps | 4–6 | **7** (Step 7 is the post-integration gate — the critical missing step) |
| Step numbering | Inconsistent across versions | **Fixed**: Interpret→Map→Compose→Generate→Quality→Integrate→Post-Gate |
| Quality gate position | Only pre-integration (v3 Step 5) | **Both** pre-integration (Step 5) and post-integration (Step 7) |
| SDL handoff | Vague "sdl-master if complex" | **Fully defined** — see Section 8 |
| Accessibility | 1 existing agent | **5 new a11y-* agents** integrated at Steps 1, 2, 4, 5, 6 |

---

## 4. Figma Strategy

### 4.1 The Token Problem

Figma MCP calls are expensive. A naive "read all" approach for a multi-screen design
would consume 50K+ tokens on Figma data alone, leaving little room for code generation.
The solution is a **3-pass strategy with deduplication across screens**.

### 4.2 Three-Pass Strategy

```
+---------------------------------------------------------------+
| PASS 1: STRUCTURE (top-level frame scan)                      |
|   Figma API calls: 1–3 (get_file + get_frame per page)       |
|   Result:          List of all frames/pages with metadata     |
|   Token cost:      2–5K                                       |
|   Decision:        sl-ds-figma selects which frames to process  |
+---------------------------------------------------------------+
         |
         v
+---------------------------------------------------------------+
| PASS 2: COMPONENTS (drill into each component instance)       |
|   Figma API calls: 5–20 (depends on nesting depth)           |
|   Process:         For each UNIQUE component: get_component   |
|                    + get_styles                               |
|   Deduplication:   Same button in 3 screens → read ONCE      |
|   Result:          Component details — props, variants, slots |
|   Token cost:      5–15K                                      |
+---------------------------------------------------------------+
         |
         v
+---------------------------------------------------------------+
| PASS 3: LAYOUT (spacing, alignment, responsive frames)        |
|   Figma API calls: 3–10 (frame-level layout inspection)      |
|   Result:          Grid/flex rules, breakpoints, spacing      |
|   Token cost:      3–8K                                       |
+---------------------------------------------------------------+
```

**Total per design:** 9–33 API calls, 10–28K tokens (typical: ~15 calls, ~18K tokens).

### 4.3 Multi-Screen Handling

When the user provides multiple Figma frames (e.g., an auth flow: login + register +
forgot-password), the strategy is **batch + deduplicate**:

```
1. Run Pass 1 for ALL frames simultaneously
   → Discover shared components (same button appears in login AND register)

2. Read shared components ONCE (deduplication step)
   → button, form-field, header → fetched once, referenced everywhere

3. Read per-screen unique elements only
   → Unique content per page (error state on login, terms on register)

Output: multi-page component-tree.json structure:
{
  "shared_components": [ ... ],        // fetched once
  "pages": [
    {
      "name": "login",
      "components": [...],
      "uses_shared": ["sl-button", "sl-form-field", "app-header"]
    },
    {
      "name": "register",
      "components": [...],
      "uses_shared": ["sl-button", "sl-form-field", "app-header"]
    }
  ]
}
```

### 4.4 Token Budget by Screen Count

| Screens | API calls | Tokens (est.) | Processing time |
|---------|-----------|---------------|----------------|
| 1 | 9–15 | 10–18K | 30–60 s |
| 3 (related flow) | 15–25 | 15–25K (dedup) | 60–90 s |
| 5 (full feature) | 25–40 | 25–35K (heavy dedup) | 90–120 s |
| 10+ (full app) | 40–60 | 35–50K | 120–180 s |

For 10+ screens in fully automatic mode: `sl-ds-figma` batches screens into user flows
(grouped by Figma page or frame name pattern) and processes them sequentially.
If confidence drops below 40 on any batch, the agent pauses.

### 4.5 Caching

After reading Figma, the structured output is cached locally to avoid re-reading:

```
.sl-ds-cache/
  figma/
    {file-id}--{frame-id}@{lastModified}--component-tree.json
    {file-id}--shared-components.json
    {file-id}--{frame-id}@{lastModified}--raw-response.json
  slds-tree.json
  composition-plan.json
  sl-ds-api/
    {slds-version}/
      {component}.json
```

Cache is invalidated when:
- User explicitly passes `--no-cache`
- Figma file node `lastModified` timestamp changes (detected on Pass 1)
- DS version changes (triggers cache invalidation for `sl-ds-api/` subtree)

For full invalidation, partial invalidation, and resume behavior, see Section 15.4.

### 4.6 Direct Figma Mapping Optimization

If a Figma component name exactly matches SLDS naming convention (e.g., Figma layer
named `"Button/Primary/Large"`), Pass 3 detail inspection is **skipped** for that
component — the variant encoding in the name is sufficient for direct mapping.

This optimization reduces token usage by ~30% for well-named Figma files.

---

## 5. Quality System

### 5.1 Scoring — 5 Groups, Formula, Floors

#### Groups and Weights

```
COMPOSITE = (Arch×22 + CodeQ×23 + Visual×25 + A11y×18 + DS×12) / 100

Where each group score is 0–100.
```

| # | Group | Weight | Floor | Rationale |
|---|-------|--------|-------|-----------|
| 1 | Architecture & Decomposition | 22% | ≥ 90 | Smart/dumb, NX layers, circular deps — foundational correctness |
| 2 | Code Quality | 23% | ≥ 90 | Type safety, Angular 21 patterns, complexity, size — production reliability |
| 3 | Visual Fidelity | 25% | ≥ 90 | Core value proposition of AI Figma→code — token-perfect output through correct components, props, and tokens |
| 4 | Accessibility | 18% | ≥ 90 | Legal requirement (WCAG 2.2 AA, EN 301 549) — non-negotiable |
| 5 | DS & Maintainability | 12% | ≥ 90 | Correct token usage, stable components, coverage, zero duplication |
| **Composite** | | **100%** | **≥ 95** | |

#### Pass Criteria

```
PASS requires ALL of the following simultaneously:
  1. Composite score >= 95
  2. Architecture & Decomposition >= 90
  3. Code Quality >= 90
  4. Visual Fidelity >= 90
  5. Accessibility >= 90
  6. DS & Maintainability >= 90

FAIL examples:
  - Composite 97 but Accessibility 88 → FAIL (floor not met)
  - All floors met but composite 93 → FAIL (composite not met)
  - Composite 94 → auto-repair cycle triggered
```

#### Visual Fidelity Target

**Token-perfect: 0 hardcoded values, 100% CEM compliance, 100% DS token compliance.**

Why screenshots do **not** work as the primary gate:
- A model can replace `var(--sl-color-primary-500)` with hardcoded `#2563eb`; the screenshot looks identical, but the code is wrong.
- Light borders on light backgrounds are often invisible in image diffs.
- Font rendering varies between environments.
- Anti-aliasing differences create false positives.
- Screenshot comparison tells you *something* is different, but not *what* or *why*.

Correct approach: **structural + token verification**.
If the generated code uses the correct DS components, correct props, correct tokens, and correct layout structure, the output is visually correct by definition. Visual Fidelity is therefore 100% achievable as an objective check, not a subjective screenshot judgment. Optional screenshot tools may still be used as secondary diagnostics, but they are not part of the primary quality gate.

#### Scoring Formula — Example

```
Component: login-page (smart) + login-form (dumb)

Group scores:
  Architecture & Decomposition:  100   (clean smart/dumb, no circulars, NX compliant)
  Code Quality:                   97   (signals, OnPush, inject(), standalone, CC<=8)
  Visual Fidelity:                95   (correct components, props, tokens, and layout structure)
  Accessibility:                  92   (2 aria-label warnings, no critical violations)
  DS & Maintainability:           94   (all sl-* correct, no hardcoded values, 85% coverage)

COMPOSITE = (100×22 + 97×23 + 95×25 + 92×18 + 94×12) / 100
          = (2200 + 2231 + 2375 + 1656 + 1128) / 100
          = 9590 / 100
          = 95.9 → PASS
```

#### N/A Metric Weight Redistribution

When a metric is N/A (e.g., no store pattern exists for a simple component), its weight is
redistributed proportionally to remaining metrics in the same group.

> **Prototype quality rules** are defined in Section 7.4. The composite quality gate does
> NOT apply to prototypes — see Section 7.4 for the canonical prototype gating policy.

---

### 5.2 Metrics per Group

#### Group 1: Architecture & Decomposition (22%)

| # | Metric | Threshold | Tool |
|---|--------|-----------|------|
| A1 | Smart/Dumb compliance — no service injection in presentational components | 0 violations | Custom ESLint / static analysis |
| A2 | Store pattern compliance — smart components with state have `*.store.ts` | 100% | Custom script |
| A3 | Circular dependencies | 0 | `npx madge --circular src/` |
| A4 | NX layer boundary violations | 0 | `nx lint --all` (enforce-module-boundaries) |
| A5 | Dependency depth (max import chain depth) | ≤ 5 levels | `npx dependency-cruiser --max-depth 5` |
| A6 | Afferent/Efferent coupling (instability) | I ≤ 0.7 for shared components | `npx dependency-cruiser` |
| A7 | Separation of concerns — logic vs presentation vs state | 0 cross-concern leaks | Composition plan review |
| A8 | Component granularity — dumb component size | ≤ 150 LOC, ≤ 5 inputs | `wc -l` + custom script |
| A9 | Smart component nesting depth | Max 1 level smart-inside-smart | Custom static analysis |
| A10 | Reusability — shared component ratio | Same visual pattern ≥ 2× → extracted | Composition analysis |

#### Group 2: Code Quality (23%)

**Type Safety sub-group**

| # | Metric | Threshold | Tool |
|---|--------|-----------|------|
| T1 | `any` type usage | 0 in production code | `@typescript-eslint/no-explicit-any` (error) |
| T2 | `as` type assertions | 0 (except branded type constructors) | `@typescript-eslint/consistent-type-assertions` |
| T3 | TypeScript strict mode | `strict: true` enabled | `tsc --noEmit` |
| T4 | `strictTemplates` | `true` in tsconfig | Angular compiler check |

**Complexity sub-group**

| # | Metric | Threshold | Tool |
|---|--------|-----------|------|
| C1 | Cyclomatic complexity | ≤ 8 per method | `eslint: complexity: ["error", 8]` |
| C2 | Cognitive complexity | ≤ 12 per function | `sonarjs/cognitive-complexity` |
| C3 | Max nesting depth | ≤ 4 levels | `eslint: max-depth: ["error", 4]` |
| C4 | Template structural directive nesting | ≤ 5 per template | `@angular-eslint/template/cyclomatic-complexity` |
| C5 | Branch density | ≤ 3% of lines in any single file | Custom metric script |

**Size sub-group**

| # | Metric | Threshold | Tool |
|---|--------|-----------|------|
| S1 | Component LOC | ≤ 200 (smart), ≤ 150 (dumb) | `wc -l` + custom script |
| S2 | Method length | ≤ 30 lines per function | `eslint: max-lines-per-function` |
| S3 | File length | ≤ 300 lines per `.ts` file | `eslint: max-lines: ["error", 300]` |
| S4 | Template complexity score | ≤ 30 bindings per template | Custom `@angular-eslint` rule |
| S5 | Component input count | ≤ 5 per presentational component | Custom ESLint rule |
| S6 | Max parameters | ≤ 4 per function | `eslint: max-params: ["error", 4]` |

**Angular 21 Patterns sub-group**

| # | Metric | Threshold | Tool |
|---|--------|-----------|------|
| ANG1 | Standalone components | 0 NgModule-based in new code | `@angular-eslint/prefer-standalone` |
| ANG2 | `inject()` pattern | ≥ 95% use `inject()`, 0 constructor DI | Custom grep |
| ANG3 | Signal inputs — `input()` | 0 `@Input()` in new components | `grep -rn "@Input()"` |
| ANG4 | Signal outputs — `output()` | 0 `@Output()` + `EventEmitter` in new code | `grep -rn "@Output()"` |
| ANG5 | Observable handling | 0 unguarded `.subscribe()` | Custom ESLint rule |
| ANG6 | `@for` / `@if` control flow | 0 `*ngFor` / `*ngIf` structural directives | `grep -rn "\*ngFor\|\*ngIf"` |
| ANG7 | No `throw` in domain code | 0 throw in services (exceptions apply — §5.3) | `eslint: no-throw-literal` |
| ANG8 | OnPush change detection | 100% dumb, ≥ 90% smart | `@angular-eslint/prefer-on-push-component-change-detection` |
| ANG9 | `CUSTOM_ELEMENTS_SCHEMA` | Declared once in `app.config.ts` | `grep -rn "CUSTOM_ELEMENTS_SCHEMA"` |
| ANG10 | `takeUntilDestroyed()` | All Observable subscriptions in components guarded | Custom ESLint rule |

> **Wrapper compatibility note:** Rules ANG3–ANG4 apply to **newly generated code only**.
> When the project uses existing SLDS Angular wrappers (from `@sl-design-system/angular`),
> consuming those wrappers via their published API (which may internally use `@Input()` /
> `@Output()`) is correct and expected. The quality agent does NOT flag wrapper consumption
> as a violation — only new component code must use signal-based patterns.

**Error Handling sub-group**

| # | Metric | Threshold | Tool |
|---|--------|-----------|------|
| E1 | Result pattern | Domain services use `Result<T,E>` not `throw` | Code review |
| E2 | Dead code | 0 unused exports in production | `npx knip` |
| E3 | TODO/FIXME comments | 0 in production code | `no-warning-comments` ESLint rule |

#### Group 3: Visual Fidelity (25%)

| # | Metric | Threshold | Tool |
|---|--------|-----------|------|
| VF1 | Component Identity | 100% correct `sl-*` element used per Figma→CEM mapping | `sl-ds-mapper` validation + DOM query |
| VF2 | Property Fidelity | 100% correct props / variants / states from Figma metadata | DOM attribute/property inspection + CEM validation |
| VF3 | Token Compliance | 0 hardcoded visual values; all colors, spacing, and typography use `var(--sl-*)` | Static CSS/SCSS/template audit |
| VF4 | Layout Structure | Figma auto-layout mapped to flex/grid with correct direction, gap token, and alignment | Layout analyzer + computed style inspection |
| VF5 | Typography | 100% text styles mapped to `var(--sl-text-*)` tokens | CSS variable resolution + computed style check |
| VF6 | Color | 100% fills/strokes mapped to `var(--sl-color-*)`; 0 hex/rgb values | CSS token audit + resolved style check |
| VF7 | Spacing | 100% padding/gap/margins mapped to `var(--sl-size-*)` tokens and aligned to the 8px grid | Token resolver + numeric spacing check |
| VF8 | Responsive | Figma responsive variants expressed via breakpoint tokens or container queries | Multi-viewport DOM/CSS verification |
| VF9 | Interaction States | Hover/focus/active/disabled states mapped from Figma variants using DS tokens | Variant/state audit + Playwright state checks |

> **Primary gate:** token/structure verification. Playwright, Chromatic, pixelmatch, or BackstopJS screenshot comparison may be used as optional secondary diagnostics only; they do not decide pass/fail.

#### Group 4: Accessibility (18%)

| # | Metric | Threshold | Tool |
|---|--------|-----------|------|
| ACC1 | axe-core violations | 0 critical, 0 serious | `@axe-core/playwright` (WCAG 2.2 AA) |
| ACC2 | ARIA label coverage | 100% interactive elements with accessible name | Custom Playwright check |
| ACC3 | Semantic HTML structure | 0 heading hierarchy violations, 0 positive tabindex | axe-core + `@angular-eslint/template` |
| ACC4 | Keyboard navigation | 100% reachability via Tab; focus visible at all times | Playwright keyboard test |
| ACC5 | Focus management | Focus trapped in modals, restored on close | Playwright `document.activeElement` check |
| ACC6 | Color contrast | ≥ 4.5:1 normal text, ≥ 3:1 large text | Lighthouse + axe-core |
| ACC7 | Live regions | Dynamic content changes announced to screen readers | Custom Playwright test |
| ACC8 | Navigation flow logic | Logical journey for screen reader users | a11y-navigator analysis |

#### Group 5: DS & Maintainability (12%)

| # | Metric | Threshold | Tool |
|---|--------|-----------|------|
| DS1 | SLDS component usage | 0 custom re-implementations of available `sl-*` components | `sl-ds-audit` + CEM lookup |
| DS2 | No hardcoded colors | 0 `#hex` / `rgb()` / `rgba()` in SCSS/CSS | Custom ESLint rule |
| DS3 | No hardcoded spacing | 0 literal `px`/`rem` values (border/reset exceptions apply) | Custom ESLint rule |
| DS4 | Token validity | 0 references to non-existent `--sl-*` CSS variables | `scripts/validate-tokens.js` |
| DS5 | Correct component props | 0 unknown properties on `sl-*` elements | `sl-ds-api` CEM validation |
| DS6 | No draft components | 0 `draft`-status SLDS components in production | `scripts/check-component-status.js` |
| DS7 | No inline styles | 0 `style=""` attributes on SLDS components | ESLint `no-inline-styles` |
| DS8 | Typography tokens | 0 hardcoded `font-size` / `font-weight` / `line-height` | Custom ESLint rule |
| M1 | Code duplication | ≤ 2% ratio (exception system in §5.3) | `npx jscpd --min-lines 5 --min-tokens 50` |
| M2 | Code coverage | ≥ 80% statements, ≥ 70% branches | `nx test --code-coverage` + lcov |
| M3 | Dead code | 0 unused exports | `npx knip` |
| M4 | Naming consistency | 0 `kebab-case.component.ts` violations | `find` + regex check |

> **No JSDoc requirement.** JSDoc documentation is not part of the quality gate. The CEM
> (generated from TypeScript source) provides API documentation. In-code JSDoc is
> recommended but not scored.

---

### 5.3 Exceptions — Taxonomy, Annotation, Auto-Detect

#### Exception Classification System

Every quality exception has one of three valid origins:

```
EXCEPTION TAXONOMY:

  TYPE-1: STRUCTURAL
    The code structure or framework protocol forces the pattern.
    Examples: forwardRef() in Angular DI providers, generated code,
              Angular form directive provider blocks.
    Detection: Static analysis alone — no annotation required.
    Scoring:   EXCLUDED from metric calculation.
    Action:    Auto-suppress; note count in quality report.

  TYPE-2: ARCHITECTURAL
    A deliberate design decision forces the pattern.
    Examples: DDD bounded contexts, component variants with different
              permission models, config constants that must stay separate.
    Detection: File path analysis + annotation (annotation preferred).
    Scoring:   EXCLUDED from metric calculation.
    Action:    Suppress; include in architectural commentary section of report.

  TYPE-3: TEMPORAL
    A transient state during code evolution or migration.
    Examples: Old @Input() kept during signal-input migration sprint,
              parallel implementations during strangler-fig migration.
    Detection: Annotation + ticket reference REQUIRED.
    Scoring:   50% weight if EXPIRES date is in the future;
               100% weight if EXPIRES date has passed (stale migration).
    Action:    Suppress at 50%; flag stale at 100%; escalate to human if stale > 60 days.
```

#### Annotation Vocabulary

```typescript
// ─────────────────────────────────────────────────────────────────
// @quality-exception: EXCEPTION_TYPE
// REASON: Human-readable explanation of why this is deliberate.
// TRACKING: Issue or ticket reference (REQUIRED for TYPE-3 only)
// EXPIRES: Sprint name or ISO date (REQUIRED for TYPE-3 only)
// ─────────────────────────────────────────────────────────────────

// TYPE-1: Structural (no ticket or expiry required)
// @quality-exception: protocol-implementation
// REASON: forwardRef requires self-reference — cannot be extracted

// TYPE-2: Architectural (no expiry required)
// @quality-exception: bounded-context
// REASON: Admin and Profile contexts must evolve independently

// @quality-exception: component-variant
// REASON: AdminUserCard and PublicUserCard have different permission models

// @quality-exception: config-coupling-risk
// REASON: API_PAGE_SIZE is a backend contract; VISIBLE_PAGE_SIZE is UX decision

// @quality-exception: template-structural
// REASON: sl-form-field scaffold repeated 2× across features — abstraction needs >3 inputs

// TYPE-3: Temporal (ticket + expiry REQUIRED)
// @quality-exception: migration-parallel
// TRACKING: #4521 — Signal input migration sprint
// EXPIRES: Sprint 24.3

// @quality-exception: any-third-party-untyped
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// TRACKING: #vendor-types-4892
// EXPIRES: 2025-03-01
```

In HTML templates: `<!-- @quality-exception: template-structural -->`  
In SCSS: `/* @quality-exception: hardcoded-border */`

#### The 8 Valid Duplication Cases

The base M1 rule (≤ 2% duplication) is overridden for exactly these cases:

| Case | Annotation | Auto-Detected? | Description |
|------|-----------|---------------|-------------|
| 1 | `bounded-context` | Partial (NX boundary check) | Same-looking models/services in different DDD contexts |
| 2 | `component-variant` | Partial (different input types) | Structurally similar components with different permissions/models |
| 3 | `test-setup-damp` | Yes (*.spec.ts path) | Repeated `beforeEach` fixture setup (DAMP principle) |
| 4 | `template-structural` | Partial (SLDS tags, ≤3 repeats, different dirs) | Repeated DS component scaffolding across feature files |
| 5 | `migration-parallel` | No (annotation required) | Old + new API co-existing during migration (needs ticket) |
| 6 | `config-coupling-risk` | Partial (different layers) | Constants identical by coincidence, different semantic ownership |
| 7 | `protocol-implementation` | Yes (forwardRef/NG_VALUE_ACCESSOR patterns) | Framework-required structural identity (Angular DI protocols) |
| 8 | `declarative-config` | Yes (*.routes.ts, Routes[] arrays) | Route declarations, NgRx action/reducer/selector patterns |

#### Auto-Detection Heuristics (No Annotation Required)

| Rule | Auto-Suppress When |
|------|--------------------|
| M1 (Duplication) | All duplicated lines in `*.spec.ts` / `*.test.ts` |
| M1 (Duplication) | Duplicated block is `providers[]` with `NG_VALUE_ACCESSOR` or `NG_VALIDATORS` |
| M1 (Duplication) | Duplicated block contains `forwardRef(() => ClassName)` patterns |
| M1 (Duplication) | Duplicated block is `Routes[]` array entries (config objects in `*.routes.ts`) |
| M1 (Duplication) | Duplicated blocks are in different NX library boundary paths |
| S3 (File > 300 LOC) | File path contains `generated` or starts with generation comment |
| S3 (File > 300 LOC) | File is `*.constants.ts` / `*.map.ts` with `branch_density < 1%` |
| S3 (File > 300 LOC) | File is `*-mixin.ts` with `avg CC per method < 5` |
| C1 (CC > 8) | Method is exhaustive type narrowing (uses `instanceof`/`typeof`/`validity.*`) AND each branch ≤ 3 lines |
| C1 (CC > 8) | Method name matches `*onKey*` AND branches are keyboard key constants |
| C1 (CC > 8) | Method maps to external type with known cardinality (ValidityState → 10 props) |
| S5 (Inputs > 5) | Component name contains `Table`, `Grid`, `List`, `Tree`, `Chart` |
| S5 (Inputs > 5) | Component selector matches an `sl-*` element (Angular wrapper pattern) |
| A1 (Service in dumb) | Injected service name ends in `Pipe` or `Formatter` (pure transform) |
| A1 (Service in dumb) | Injected service is `Router` AND usage is only `navigate()` / `createUrlTree()` |
| A1 (Service in dumb) | Injected service name contains `Logger`, `Analytics`, `Telemetry`, `FeatureFlag`, `Config` |
| ANG7 (throw) | `throw` is inside an abstract getter (programmer-error guard) |
| ANG7 (throw) | `throw` message contains "must be", "should be", "not implemented", "abstract" |

#### Scoring Policy Summary

| Exception Type | Score Treatment |
|---------------|----------------|
| TYPE-1 (Structural) | EXCLUDED from metric |
| TYPE-2 (Architectural) | EXCLUDED from metric; noted in report |
| TYPE-3 (Temporal, active) | 50% weight |
| TYPE-3 (Temporal, stale — EXPIRES passed) | 100% weight + escalation flag |
| Auto-detected (matches heuristic, no annotation) | EXCLUDED; count noted in report |
| Unannotated, no heuristic match | 100% weight; added to repair loop |

#### Decision Tree for the AI Quality Agent

```
FOR EACH quality violation detected:

+------------------------------------------------------------------+
| 1. CHECK exceptions.json registry                                |
|    -> Found matching exception? -> Apply scoring policy by type  |
|    -> Not found? -> continue to step 2                          |
+------------------------------------------------------------------+
                        |
                        v
+------------------------------------------------------------------+
| 2. CHECK inline annotation (// @quality-exception: ...)         |
|    -> Found with valid type?                                     |
|       -> Register in exceptions.json                            |
|       -> Apply scoring policy by type                           |
|    -> Found with unknown type?                                   |
|       -> COUNT AS VIOLATION: "Unknown exception type"           |
|    -> Not found? -> continue to step 3                          |
+------------------------------------------------------------------+
                        |
                        v
+------------------------------------------------------------------+
| 3. RUN AUTO_DETECT_EXCEPTION heuristics (table above)           |
|    -> Match found?                                               |
|       -> EXCLUDE from score                                      |
|       -> ADD to report as "auto-suppressed (N lines)"           |
|    -> No match? -> continue to step 4                           |
+------------------------------------------------------------------+
                        |
                        v
+------------------------------------------------------------------+
| 4. APPLY FULL RULE AT 100% WEIGHT                               |
|    -> Add to repair loop with GENUINE_VIOLATION status          |
|    -> Report as: GENUINE_VIOLATION                              |
+------------------------------------------------------------------+
```

#### Exception Registry

The AI agent maintains `exceptions.json` at project root:

```json
{
  "schema": "1.0",
  "exceptions": [
    {
      "id": "exc-001",
      "type": "TYPE-2",
      "rule": "M1-duplication",
      "pattern": "bounded-context",
      "paths": ["libs/feature-admin/src/models/user.model.ts",
                "libs/feature-profile/src/models/user.model.ts"],
      "reason": "Admin and Profile bounded contexts must remain independent.",
      "registeredAt": "2024-11-01",
      "registeredBy": "ai-agent-v1",
      "approvedBy": null,
      "expiresAt": null
    },
    {
      "id": "exc-002",
      "type": "TYPE-3",
      "rule": "M1-duplication",
      "pattern": "migration-parallel",
      "paths": ["libs/shared/ui/src/components/user-card/user-card.component.ts"],
      "reason": "Signal input migration — legacy @Input() kept for compat.",
      "trackingIssue": "#4521",
      "registeredAt": "2024-11-15",
      "registeredBy": "ai-agent-v1",
      "expiresAt": "2025-01-31",
      "status": "active"
    }
  ]
}
```

Agent behaviour on load:
1. Mark TYPE-3 exceptions as `stale` if `expiresAt` < today
2. Stale exceptions → 100% weight + human escalation flag
3. Auto-register new TYPE-1 exceptions found by heuristics
4. TYPE-2 exceptions: agent auto-approves when pattern match confidence > 80%;
   escalates only if uncertain (rare — see OD-9)

---

### 5.4 Auto-Repair Loop

#### Algorithm

```
REPAIR_LOOP(issues, max_cycles=3, token_budget_per_cycle=30_000):
  cycle = 0
  total_tokens_used = 0

  while cycle < max_cycles AND issues.has_fixable():
    cycle++

    # Priority order (highest impact first):
    sorted_issues = sort_by_priority([
      1. TypeScript compilation errors       (blocks all other checks)
      2. Type safety BLOCKERs               (any, as type assertions)
      3. Visual fidelity critical failures   (token/CEM/layout mismatch)
      4. axe-core critical / serious a11y   (legal blocker)
      5. Architecture violations             (circulars, NX layer violations)
      6. Angular 21 pattern violations       (OnPush, signal inputs, @for)
      7. DS compliance violations            (hardcoded values, wrong components)
      8. Size and complexity warnings        (LOC, CC, nesting)
    ])

    for issue in sorted_issues:
      if issue.attempted_count >= issue.max_attempts:
        issue.status = "UNFIXABLE"
        continue

      fix = generate_fix(issue)
      apply_fix(fix)
      total_tokens_used += estimate_tokens(fix)

      if total_tokens_used > token_budget_per_cycle:
        # Stop cycle — token budget exceeded
        break

      result = run_verification(issue.verification_command)
      if result.exit_code != 0:
        revert_fix(fix)
        issue.status = "UNFIXABLE: caused regression"
      else:
        issue.status = "FIXED"
        log_to_repair_report(issue, fix, result)

    new_score = run_full_quality_check()
    if new_score.composite >= 95 AND new_score.all_floors_met:
      return "PASS — score {new_score.composite} after {cycle} cycle(s)"

  # Max cycles reached or nothing left to fix
  unfixable = issues.filter(status="UNFIXABLE")
  if unfixable.any():
    escalate_to_user(unfixable, quality_report)
    return "PARTIAL — {len(unfixable)} issues require human decision"

  return "FAIL — max cycles exceeded, score={new_score.composite}"
```

#### Infinite Loop Prevention Guards

```
GUARD 1: Issue fingerprint
  hash = sha256(file_path + ":" + line_number + ":" + issue_type)
  If same fingerprint seen twice in same repair session -> UNFIXABLE immediately

GUARD 2: File state hash
  state_hash = sha256(file_content) before applying each fix
  If state_hash unchanged after fix -> no-op detected -> skip + UNFIXABLE

GUARD 3: Hard cycle limit
  max_cycles = 3 (configurable via .sl-ds-config.yaml, minimum 1, maximum 5)

GUARD 4: Regression detector
  test_pass_count_before = run_tests()
  apply_fix()
  test_pass_count_after = run_tests()
  If test_pass_count_after < test_pass_count_before -> revert + UNFIXABLE

GUARD 5: Token budget
  Total repair budget per run: 90K tokens (3 cycles × 30K) — shared across all screens
  If cycle exceeds 30K tokens -> stop cycle early, log partial results
```

#### Auto-Repair vs. Escalation Matrix

| Issue Type | Severity | Auto-Fix? | Max Attempts |
|-----------|---------|-----------|-------------|
| TypeScript compilation error | BLOCKER | Yes | 2 |
| `any` type annotation | BLOCKER | Yes — infer from context | 2 |
| `as` type assertion | BLOCKER | Yes — type guard or proper cast | 2 |
| `throw` in domain code | BLOCKER | Yes — wrap in `Result<T,E>` | 2 |
| TODO/FIXME comment | BLOCKER | Yes — implement or remove | 1 |
| axe-core critical/serious | BLOCKER | Yes — apply a11y-impl | 2 |
| Missing `OnPush` | HIGH | Yes | 1 |
| `*ngFor` without `track` | HIGH | Yes | 1 |
| Missing `standalone: true` | HIGH | Yes | 1 |
| `@Input()` → `input()` | MEDIUM | Yes | 2 |
| Hardcoded color / spacing | MEDIUM | Yes — replace with nearest DS token | 2 |
| Circular dependency (simple) | BLOCKER | Attempt — introduce interface/token | 1 |
| Circular dependency (complex) | CRITICAL | No — escalate (architecture decision) | 0 |
| Visual token/CEM/layout mismatch | HIGH | Yes — re-map component, props, or tokens and re-generate styles | 3 |
| Widespread visual structure mismatch | CRITICAL | No — invalidate affected cache and re-run Step 1 interpretation | 0 |
| LOC > 300 | WARNING | Attempt — extract sub-component | 1 |
| CC > 8 | WARNING | Attempt — extract method | 1 |
| Bundle over budget | WARNING | Yes — add code splitting | 2 |
| Bundle 2× over budget | CRITICAL | No — escalate (architecture review) | 0 |

#### Token Cost per Repair Cycle Type

| Cycle Type | Operations | Estimated Tokens |
|-----------|-----------|-----------------|
| Lint-only | Read diff + apply ESLint fixes (any, OnPush, trackBy) | 3–8K |
| Template repair | Re-read template + fix bindings, ARIA, control flow | 5–12K |
| Architecture repair | Restructure component — extract store, split smart/dumb | 10–20K |
| Visual fidelity repair | Re-map Figma tokens + regenerate styles | 8–15K |
| Accessibility repair | Add ARIA, fix focus management, add live regions | 6–12K |
| Full mixed cycle | All types in one pass | 20–40K |
| Escalation report | Write UNFIXABLE report | 2–4K |

**Budget:** 3 cycles × 30K = **90K token repair budget per pipeline run** (shared across all screens in the run).

---

## 6. Accessibility Agent Group

### 6.1 Philosophy

Accessibility is not a final checklist — it is a design principle applied at every stage.
The `a11y-*` agent group runs in **parallel** with the generation pipeline, not after it.

```
Stage                  DS Pipeline Agent      A11Y Agent
-------                -----------------      ----------
Step 1: Interpret      sl-ds-figma               a11y-review (design audit)
Step 2: Map            sl-ds-mapper              a11y-review (component choice audit)
Step 3: Compose        sl-ds-compose             (no a11y step — structural only)
Step 4: Generate       angular-specialist     a11y-impl (code a11y injection)
Step 5: Quality gate   sdl-quality            a11y-audit + a11y-navigator
Step 6: Integrate      sl-ds-impl / sdl-master   a11y-test (generate test scenarios)
Step 7: Post-gate      sdl-quality            a11y-audit (re-check after integration)
```

### 6.2 Agent Responsibilities

#### `a11y-review` (internal sub-agent)

Runs at Steps 1 and 2. Checks design-level and component-choice-level accessibility:

- Low contrast text in Figma design → logged in `a11y-notes.json`
- No visible focus indicator → logged
- Touch targets below 44px → logged
- SLDS component choice validation (e.g., "sl-tab selected — ensure `aria-label` on tab-panel")

Output: `a11y-notes.json` (consumed by `a11y-impl` in Step 4) and
`a11y-requirements.json` (added to `slds-tree.json`).

#### `a11y-impl` (internal/external)

Runs at Step 4 (automatically inside sl-ds-impl) and can be invoked directly on existing code.

Implements:
- ARIA labels on all interactive SLDS components
- Focus management patterns (modal open/close, route navigation)
- Live regions for async state changes (loading, error, success)
- Skip links for long navigation sections
- Keyboard event handlers for custom interactions

#### `a11y-audit` (user-facing + pipeline Step 5)

Full audit against configured WCAG standard. Reports:
- Critical violations (BLOCKER for quality gate)
- Serious violations (BLOCKER for quality gate)
- Moderate violations (logged, not blocking)
- Minor violations (noted in report)

Uses `@axe-core/playwright` + Lighthouse accessibility category.

#### `a11y-navigator` (internal sub-agent, Step 5)

Analyzes the **cognitive experience** of the generated UI:

```
Checks performed by a11y-navigator:
  1. READING ORDER — DOM order matches visual reading order
  2. NAVIGATION JOURNEY — keyboard path achieves task in ≤ N Tab presses
  3. CONTEXT PRESERVATION — focus returns correctly after actions
  4. PROGRESSIVE DISCLOSURE — complex UI revealed in logical stages
  5. ERROR RECOVERY — errors announced, focus moved to error location
  6. COGNITIVE LOAD — live regions not competing, timing appropriate
  7. LANDMARKS — page regions have correct ARIA landmark roles
```

#### `a11y-test` (user-facing, Step 6)

Generates three categories of tests:

```
1. AUTOMATED (CI-ready):
   - axe-core Playwright tests per page
   - Color contrast assertions
   - ARIA validity checks (labels, roles, states)
   - Keyboard Tab-order verification

2. SEMI-AUTOMATED (developer-guided):
   - Keyboard journey walkthrough scripts
   - Screen reader announcement scripts (VoiceOver/NVDA)
   - 200% + 400% zoom check procedures
   Tools: Playwright with manual verification points marked

3. MANUAL TEST PLAN (for QA team, Markdown):
   - Screen reader scenarios: "As a screen reader user, I want to log in"
   - Expected announcements at each step
   - Edge cases: timeout, error state, back navigation
   - Device matrix: VoiceOver+Safari, NVDA+Chrome, TalkBack+Android
```

### 6.3 Configurable Standard

Configuration lives in `.sl-ds-config.yaml` at project root:

```yaml
accessibility:
  standard: "WCAG22-AA"       # default — required
  additional:
    - "EN-301-549"            # European ICT standard (adds HW/SW reqs)
  custom_rules:
    - "min-touch-target: 48px"  # stricter than WCAG AA (44px minimum)
    - "max-focus-trap-depth: 2"

  agents:
    a11y-audit:
      fail_on: "critical"      # critical | major | minor
      report_format: "markdown"
    a11y-impl:
      auto_fix: true
      patterns: "angular"      # angular | lit | react (extensibility)
    a11y-test:
      include_manual: true
      device_matrix:
        - "VoiceOver+Safari"
        - "NVDA+Chrome"
        - "TalkBack+Android"
```

### 6.4 Supported WCAG Configurations

| Config value | Standard | Key additions vs default |
|-------------|----------|--------------------------|
| `WCAG21-A` | WCAG 2.1 Level A | Basic keyboard, alt text, labels only |
| `WCAG21-AA` | WCAG 2.1 Level AA | Contrast 4.5:1, resize 200%, focus visible |
| `WCAG22-AA` | WCAG 2.2 Level AA | **Default** — adds focus appearance, dragging alt., target size 24×24px |
| `WCAG22-AAA` | WCAG 2.2 Level AAA | Contrast 7:1, sign language, extended audio description |
| `EN-301-549` | European ICT | Builds on WCAG 2.2 AA + hardware/software requirements |
| `SECTION-508` | US Federal | Equivalent to WCAG 2.1 AA with federal procurement rules |

### 6.5 Relationship with Legacy `accessibility-specialist`

The existing `accessibility-specialist` worker in SDL is **MAX-specific** — it knows the
education platform context, MAX component naming conventions, and WCAG AA as applied to
itslearning/Magister/Sanoma Learning UIs.

The new `a11y-*` agents are **generic** — configurable standard, any project type.

Both coexist:
- `accessibility-specialist` → used by `sdl-master` when executing sprint phases for MAX projects
- `a11y-*` → used by `sl-ds-impl` pipeline and available to any project via `.sl-ds-config.yaml`
- When both are in scope, `a11y-*` runs first; `accessibility-specialist` runs as a secondary
  review for MAX projects only

---

## 7. Prototypes — Mode A and Mode B

### 7.1 Decision Logic

```
User says "prototype" / "mockup" / "quick demo"    -> Mode A (HTML)
User says "prototype in Angular" / "scaffold"       -> Mode B (Angular)
User says "implement" / "add to our app"            -> NOT sl-ds-proto — use sl-ds-impl
Ambiguous?  -> Ask: "Quick HTML demo (opens in browser) or Angular component?"

Default when just "prototype" without qualifier: Mode A
```

### 7.2 Mode A: HTML/JS — Zero Build, Opens in Browser

**Use case:** Quick demo for stakeholders, design review, proof of concept.
**Generation time:** ~30–60 seconds.
**Status:** NOT production code — throwaway output, no quality gate.

```
prototype/
  index.html             <- entry point, loads SLDS from vendor/
  vendor/
    slds/
      theme.css          <- copied from node_modules/@sl-design-system/{theme}
      components.js      <- bundled register scripts for used sl-* components
  pages/
    login.html           <- individual pages (hash-routed)
    register.html
    dashboard.html
  js/
    router.js            <- hash-based SPA router (no build required)
    interactions.js      <- click handlers: form submit, dialog open, nav
    mock-data.js         <- fake data for lists, tables, user profiles
  styles/
    layout.css           <- grid/flex layout only (DS handles component styles)
```

`index.html` structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- SLDS assets bundled locally by sl-ds-proto from the project's node_modules -->
  <link rel="stylesheet" href="./vendor/slds/theme.css">
  <script type="module" src="./vendor/slds/components.js"></script>
</head>
<body>
  <!-- Generated component tree from sl-ds-mapper output -->
  <sl-form>...</sl-form>
</body>
</html>
```

**Vendor bundling strategy:** `sl-ds-proto` copies SLDS assets from the project's
`node_modules/` (or fetches them via `npm pack` if no project exists). This avoids
CDN dependency on private registries. The `vendor/slds/components.js` file is a
minimal ESM bundle containing only the `register.js` imports for components used
in the prototype.

If no project with SLDS installed exists, `sl-ds-proto` runs:
```
npm pack @sl-design-system/button@{version} --registry=https://npm.pkg.github.com
```
and extracts the needed files. This requires GitHub Packages authentication
(see Section 16.7 — Security).

**Interactivity — all Mode A prototypes include:**
- Page navigation (links between pages via hash router)
- Form submission (shows success state / navigates to next screen)
- Button clicks (open `sl-dialog`, show `sl-toast`, toggle state)
- List interactions (select, expand, filter — with `mock-data.js`)
- Loading states (simulated — spinner for 800ms then content)
- Error states (one error scenario per form)
- Dialog/overlay (at least one open + close flow)

### 7.3 Mode B: Angular — Realistic, Can Become Production

Two sub-modes depending on project context:

#### Mode B1: CDN-loaded Angular (no install required)

```
prototype-angular/
  index.html             <- bootstraps Angular via ESM CDN import map
  app/
    app.component.ts     <- root with router-outlet
    app.routes.ts        <- route configuration
    pages/
      login/
        login-page.component.ts
        login-page.component.html
      register/
        register-page.component.ts
  styles/
    theme.css            <- SLDS theme import
```

**Limitation:** Angular from CDN (esm.sh/@angular/core) has known limitations with
certain advanced features. Mode B1 is experimental. If it fails, Mode B2 is used.

#### Mode B2: Standard Angular project (requires `npm start`)

```
prototype-angular/
  package.json           <- dependencies: @angular/core, @sl-design-system/*
  angular.json
  tsconfig.json
  src/
    main.ts
    app/
      app.component.ts
      app.routes.ts
      pages/
        login/
          login-page.component.ts    <- standalone, OnPush, signal inputs
          login-page.component.html  <- uses <sl-button>, <sl-text-field>
          login-page.component.scss  <- DS tokens only
          login-page.component.spec.ts  <- basic render test
        register/
          ...
      shared/
        components/                   <- extracted dumb components
  README.md              <- "Run: npm install && npm start"
```

Mode B2 characteristics:
- Follows project conventions (Angular 21, standalone, signals, `inject()`)
- Uses SLDS Angular wrappers where available; falls back to raw web components
- HAS basic tests (render tests, no logic tests for prototype)
- CAN be promoted directly to sl-ds-impl Step 4 for production quality
- Generation time: ~2–4 minutes

**Decision: B1 vs B2**
- B1 if user says "no install", "quick preview", "lightweight"
- B2 if user says "realistic", "use as starter", or an Angular project already exists
- **Default: B2** (more reliable with Angular toolchain)

### 7.4 Prototype Quality Gates

| Mode | Quality Gate | Threshold |
|------|-------------|-----------|
| Mode A HTML | None | N/A — throwaway |
| Mode B Angular (prototype) | Lint + build only | No score threshold |
| Mode B Angular (promoted to production) | Full 7-step pipeline | ≥ 95 composite |

---

## 8. SDL Integration

> **SDL Glossary (quick reference):**
> - **SDL** — Sprint Delivery Loop: the existing automated sprint execution pipeline
> - **Phase 0–6** — SDL lifecycle: 0=Plan, 1=Implement, 2=Review, 3=Quality, 4=Test, 5=Deploy, 6=Retrospective
> - **BLOK** — atomic work unit within a sprint phase; has a single worker assignment, defined files, and exit criteria
> - **IMPL_*.md** — sprint implementation plan document consumed by `sdl-master`
> - **sdl-plan-scorer** — validates IMPL_*.md against SDL schema and scoring rubric
> - **Worker** — specialist agent that executes a single BLOK (e.g., `angular-specialist`)

### 8.1 Handoff Decision — Simple vs Complex

This architecture is scoped to **Angular 21 + NX monorepos**. The handoff decision therefore
operates *inside* that scope; it does not define a separate non-NX delivery model.

```
After Step 5 quality gate passes:

IF implementation is SIMPLE (criteria below) -> sl-ds-impl handles Step 6 directly
IF implementation is COMPLEX (criteria below) -> sl-ds-impl generates IMPL_*.md and hands off to sdl-master

SIMPLE criteria (all must be true):
  - One Angular 21 NX app is the only target
  - Change fits inside one feature area (at most one feature lib + one ui lib)
  - No existing NgRx/SignalStore state must be modified outside the new feature
  - Straightforward routing (standard lazy route, no federation, no feature flags)
  - No cross-app dependencies, migration steps, or shared library refactors

COMPLEX criteria (any one triggers SDL handoff):
  - Multiple NX libraries or bounded contexts must change together
  - Existing store/state contracts must be extended across feature boundaries
  - Route requires authentication guards, feature flags, A/B variants, or wizard integration
  - Shared libraries, generated SDKs, or cross-cutting utilities must be updated
  - Multiple BLOKs with sequencing dependencies are required
```

### 8.2 IMPL_*.md Plan Format

The plan document generated by `sl-ds-impl` (for SDL handoff) follows the SDL BLOK format:

```markdown
# IMPL_{SPRINT_ID}.md — Generated by sl-ds-impl v1.0

## Source
- Figma: https://figma.com/design/{file-id}?node-id={frame-id}
- SLDS version: 2.0.1
- Angular version: 21.0.0
- Generated: {ISO timestamp}

## Composition Plan Summary
{Paste of composition-plan.json summary — smart/dumb split, store decisions}

## BLOKs

### BLOK 0: Scaffold
**Worker:** angular-specialist
**Files:**
  - CREATE libs/feature-{name}/src/index.ts
  - UPDATE libs/feature-{name}/project.json (add to NX project graph)
  - UPDATE apps/max/src/app/app.routes.ts (add lazy route)
**EXIT CRITERION:**
  - nx build feature-{name} passes
  - nx lint feature-{name} passes
  - Route navigates without console errors

### BLOK 1: {Page Name} — Smart Component + Store
**Worker:** angular-specialist + ngrx-signal-store-pro
**Files:**
  - CREATE libs/feature-{name}/src/lib/{name}-page/{name}-page.component.ts
  - CREATE libs/feature-{name}/src/lib/{name}-page/{name}-page.store.ts
**EXIT CRITERION:**
  - Component renders (Storybook story passes visual check)
  - Store state transitions work (unit tests pass)
  - nx lint passes
  - A11Y: 0 axe-core critical violations

### BLOK 2: {Dumb Component Name} — Presentational Component
**Worker:** angular-specialist + scss-design-system-pro
**Files:**
  - CREATE libs/feature-{name}/src/lib/components/{name}/{name}.component.ts
  - CREATE libs/feature-{name}/src/lib/components/{name}/{name}.component.html
  - CREATE libs/feature-{name}/src/lib/components/{name}/{name}.component.scss
**EXIT CRITERION:**
  - Component renders at all responsive breakpoints
  - No hardcoded colors/spacing (DS tokens only)
  - Token-perfect: 0 hardcoded visual values, 100% correct `sl-*` components and props per CEM
  - Layout structure matches Figma auto-layout (flex/grid direction, gap token, alignment)

### BLOK Q: Tests
**Worker:** qa-automation
**Files:**
  - CREATE libs/feature-{name}/src/lib/{name}-page/{name}-page.component.spec.ts
  - CREATE libs/feature-{name}/src/lib/{name}-page/{name}-page.store.spec.ts
  - CREATE e2e/src/{name}/
**EXIT CRITERION:**
  - ≥ 80% statement coverage
  - ≥ 70% branch coverage
  - All e2e scenarios pass

### BLOK R: Storybook
**Worker:** storybook-pro
**Files:**
  - CREATE libs/feature-{name}/src/lib/components/{name}/{name}.stories.ts
**EXIT CRITERION:**
  - Stories render without errors
  - Optional secondary visual signal captured when available (e.g. Chromatic)

## EXIT CRITERION — SPRINT
  - All BLOKs complete
  - nx build affected passes
  - nx test affected passes (≥ 80% coverage)
  - Composite quality score ≥ 95
  - All group floors ≥ 90
  - 0 axe-core critical/serious violations
  - 0 design token violations (scripts/validate-tokens.js)
```

### 8.3 BLOK Type Routing Table

This extends `sdl-impl-orchestrator`'s routing logic with two new BLOK types:

| BLOK type | Primary worker | Support workers |
|-----------|---------------|----------------|
| `scaffold` | angular-specialist | — |
| `angular-component` | angular-specialist | scss-design-system-pro |
| `angular-component-store` | angular-specialist + ngrx-signal-store-pro | scss-design-system-pro |
| `scss-layout` | scss-design-system-pro | — |
| `tests` | qa-automation | — |
| `storybook` | storybook-pro | — |
| `figma-design` (**NEW**) | sl-ds-figma → sl-ds-mapper → angular-specialist | scss-design-system-pro |
| `figma-design-with-state` (**NEW**) | sl-ds-figma → sl-ds-mapper → sl-ds-compose → angular-specialist + ngrx-signal-store-pro | scss-design-system-pro |

When `sdl-impl-orchestrator` encounters a `figma-design` BLOK, it:
1. Calls `sl-ds-figma` + `sl-ds-mapper` to produce `slds-tree.json`
2. Passes `slds-tree.json` as the specification to `angular-specialist`
3. `angular-specialist` implements using the SLDS tree as its spec (not raw Figma)

### 8.4 Partial vs Full SDL Phase Trigger

| Scenario | SDL phases triggered |
|----------|---------------------|
| BLOK 0 only (scaffold) | Phase 1 (implement) |
| BLOKs 1–N only (implementation) | Phase 1 + Phase 3 (quality) |
| BLOK Q (tests) | Phase 4 (test) |
| BLOK R (storybook) | Phase 4 (storybook subset) |
| Full sprint with all BLOKs | All 7 phases (0–6) |
| Post-integration (Step 7) | sdl-gap-analysis + sdl-quality only |

### 8.5 IMPL_*.md File Location

```
docs/
  sprints/
    IMPL_{SPRINT_ID}.md        <- generated by sl-ds-impl, consumed by sdl-master
    IMPL_{SPRINT_ID}_v2.md     <- if plan is revised after sdl-plan-scorer feedback
```

---

## 9. DS API Contract

### 9.1 The Problem

The `custom-elements.json` (CEM) file — the authoritative source of component API — is
**not committed to the DS repository**. It is generated during `yarn dist` but not saved to
git. There is no guaranteed hosted API. Agents therefore cannot assume a ready-made CEM file
exists for the target version.

The **canonical contract** is:

```
SOURCE OF TRUTH CONTRACT:
  1. Source TypeScript @ git tag      <- authoritative input
  2. Lightweight parser               <- extracts public API deterministically
  3. Local versioned cache            <- runtime working store
  4. Optional hosted API              <- optimization only; must map to same schema
```

At runtime, lookup prefers the local cache first, but that cache is only valid because it was
created from the contract above. A hosted API, when available, may short-circuit steps 1–2,
but it must populate the same cache schema and never become a separate semantic source of truth.

### 9.2 Fetch Strategy — Source TypeScript → Lightweight Parser → Cache

```
SETUP FLOW (run once per project, on version detection or explicit --setup):

Step 1: sl-ds-version reads package.json
  -> finds "@sl-design-system/button": "^2.0.0"
  -> resolved version from yarn.lock: "2.0.1"

Step 2: sl-ds-api checks local cache
  -> .sl-ds-cache/sl-ds-api/2.0.1/button.json exists? -> USE IT
  -> miss? -> proceed to Step 3

Step 3: Fetch source TypeScript via GitHub API
  URL pattern:
    https://raw.githubusercontent.com/sl-design-system/components/
    @sl-design-system/button@{version}/packages/components/button/src/button.ts

  Files fetched per component:
    - src/{component}.ts           <- main class (properties, events, decorators)
    - package.json                 <- status (stable/preview/draft), version
    - CHANGELOG.md                 <- breaking changes

Step 4: Lightweight parser extracts public API
  Extracts (using ts-morph or tree-sitter — NOT full CEM analyzer):
    - @property decorators      -> properties table
    - export type / union types -> valid values
    - @event decorators         -> events table
    - JSDoc @slot annotations   -> slots
    - JSDoc @csspart annotations -> CSS parts
    - package.json["status"]    -> stable / preview / draft

  Accuracy: ~90% (sufficient for API knowledge)
  Speed: ~2s for all 53 components (vs ~30s for full CEM analyzer)

Step 5: Write to local cache
  -> .sl-ds-cache/sl-ds-api/2.0.1/button.json
  -> .sl-ds-cache/sl-ds-api/2.0.1/_index.json (component list + statuses)
```

### 9.3 Cache Structure

```
.sl-ds-cache/
  sl-ds-api/
    2.0.1/
      _index.json            <- {"components": ["sl-button", ...], "generated": "..."}
      sl-button.json         <- parsed API for sl-button v2.0.1
      sl-form.json
      sl-text-field.json
      ...
    1.4.2/
      _index.json
      sl-button.json         <- different API for v1.4.2 (for migration scenarios)
      ...
    _breaking-changes/
      1.4.2-to-2.0.1.json   <- breaking change diff (fetched from CHANGELOG.md)
```

### 9.4 Component API Object Format

```json
{
  "version": "2.0.1",
  "generated": "2026-01-15T10:00:00Z",
  "source": "github:sl-design-system/components@sl-design-system/button@2.0.1",
  "component": "sl-button",
  "status": "stable",
  "package": "@sl-design-system/button",
  "registerImport": "@sl-design-system/button/register.js",
  "properties": [
    { "name": "variant", "type": "'default'|'primary'|'success'|'warning'|'danger'", "default": "'default'" },
    { "name": "fill", "type": "'solid'|'outline'|'ghost'", "default": "'solid'" },
    { "name": "disabled", "type": "boolean", "default": "false" },
    { "name": "size", "type": "'sm'|'md'|'lg'", "default": "'md'" }
  ],
  "events": [
    { "name": "sl-focus", "type": "SlFocusEvent" },
    { "name": "sl-blur", "type": "SlBlurEvent" }
  ],
  "slots": [
    { "name": "", "description": "Button label text or icon content" }
  ],
  "cssParts": [],
  "cssProperties": [],
  "composition": {
    "validParents": ["sl-button-bar"],
    "validChildren": ["sl-icon"],
    "patterns": ["Use inside sl-button-bar for grouped actions"]
  }
}
```

### 9.5 Version Resolution

```
MULTI-VERSION SCENARIO (migration in progress):
  Team Gamma: feature-A uses SLDS 1.4.2, feature-B uses SLDS 2.0.1 in same monorepo

Resolution strategy:
  1. sl-ds-version scans all package.json files in NX libraries
  2. If multiple SLDS versions found:
     a. In FULLY AUTOMATIC mode: uses version with highest usage count
     b. In APPROVAL mode: lists detected versions, asks user to confirm target
  3. Cache is populated for BOTH versions (used in migration scenario C6)

Command override: --ds-version 2.0.1 (explicit version bypass)
```

### 9.6 Breaking Changes Detection

For migration scenario (C6), `sl-ds-api` compares two version caches and generates a diff:

```
BREAKING CHANGE DETECTION:
  Input:  2 version caches (old: 1.4.2, new: 2.0.1)
  Source: CHANGELOG.md per component @ each git tag
  Output: .sl-ds-cache/sl-ds-api/_breaking-changes/1.4.2-to-2.0.1.json

Format:
  {
    "from": "1.4.2",
    "to": "2.0.1",
    "changes": [
      {
        "component": "sl-button",
        "type": "removed-property",
        "name": "outline",
        "migration": "Use fill='outline' instead of outline attribute"
      },
      {
        "component": "sl-form-field",
        "type": "renamed-slot",
        "from": "default",
        "to": "control",
        "migration": "Rename slot usage: <sl-text-field> → <sl-text-field slot='control'>"
      }
    ]
  }
```

### 9.7 Optional Hosted API (Future State)

If the DS team adds a CI step to publish CEM artifacts per release:

```yaml
# In DS repo .github/workflows/release.yml
- name: Publish CEM to GitHub Pages
  run: |
    mkdir -p /api/${{ env.VERSION }}
    cp packages/components/*/custom-elements.json /api/${{ env.VERSION }}/
    # publish to https://sanomalearning.design/api/{version}/
```

When available, `sl-ds-api` switches to the hosted API as the **primary fetch path** and uses
GitHub source fetch as fallback. The semantic contract does not change: the hosted API is an
optimized transport for the same versioned schema, and the cache format and invalidation rules
remain identical.

---

## 10. Execution Modes

### 10.1 Default: Fully Automatic

All 7 pipeline steps execute without human prompts. Gates are automated checks
(lint, build, type-check, quality score) — not human approvals.

```
sl-ds-impl "Implement login from Figma frame X"
  -> Step 1: Interpret (auto)
  -> Step 2: Map (auto, validate against CEM)
  -> Step 3: Compose (auto, validate against project patterns)
  -> Step 4: Generate (auto)
  -> Step 5: Quality gate (auto, lint + scorer + a11y tests)
  -> If quality < 95: auto-repair (max 3 cycles, 90K tokens)
  -> Step 6: Integrate (auto, nx build + lint + test)
  -> Step 7: Post-integration gate (auto)
  -> DONE
```

### 10.2 Approval Mode (Explicit or Auto-Triggered)

Enabled by:
- User flag: `--approve` or `--interactive`
- Auto-triggered when agent confidence drops to < 40

When active, the pipeline pauses at the current step and shows the decision:

```
[sl-ds-impl] Step 2 complete. Low confidence mapping (3 ambiguous components):
  • "blue rounded card" → sl-card? sl-panel? (confidence: 60%)
  • "icon with badge" → sl-badge inside sl-icon? custom component? (confidence: 45%)
  • "stepper indicator" → no SLDS equivalent found (confidence: 0%)

Choose for each:
  [1] Accept best guess
  [2] See alternatives and pick
  [3] Skip this component (use a placeholder)
```

### 10.3 Confidence Scoring

Each step produces a confidence score (0–100):

| Score | Action |
|-------|--------|
| 80–100 | Auto-proceed, no notification |
| 60–79 | Auto-proceed, log warning in quality report for review |
| 40–59 | Auto-proceed with warning |
| 0–39 | **Always pause** — even in fully automatic mode; too risky to continue |

#### Confidence Factors

| Factor | High confidence | Low confidence |
|--------|----------------|---------------|
| Figma component name match | Exact CEM match (e.g., "Button/Primary") | No CEM match found |
| Layout pattern | Common pattern (card grid, form) | Unusual or custom pattern |
| Component nesting | Shallow (1–2 levels) | Deep (5+ levels) |
| SLDS version coverage | All components in target version | Some components missing in target version |
| Design ambiguity | Single clear interpretation | Multiple valid interpretations |

### 10.4 State Persistence / Resume

> See **Section 15** for the canonical state persistence specification including
> pipeline-state.json schema, commit strategy, context management, and cache invalidation.

---

## 11. Scenario Matrix

### 11.1 Supported Scenarios

| ID | Scenario | Entry agent | Key sub-agents | SDL handoff? | Output |
|----|----------|-------------|----------------|-------------|--------|
| C1 | **New design → full implementation** | sl-ds-impl | sl-ds-figma, sl-ds-mapper, sl-ds-compose, sl-ds-api, a11y-* | Yes (complex) or No (simple) | Angular components in NX layers + tests |
| C2 | **Design update (diff mode)** | sl-ds-impl | sl-ds-figma (diff), sl-ds-mapper (partial) | Partial (BLOKs for changed sections) | Updated Angular files + regression tests |
| C3 | **Angular wrapper for SLDS component** | sl-ds-impl | sl-ds-api, angular-specialist | No | Angular directive/wrapper component |
| C4 | **Tests only** | sl-ds-impl (--tests-only) | qa-automation | SDL Phase 4 only | Unit + e2e tests, Storybook stories |
| C5 | **Storybook only** | sl-ds-impl (--storybook-only) | storybook-pro | SDL Phase 4 (storybook) | Storybook stories |
| C6 | **SLDS version bump** | sl-ds-migrate | sl-ds-version, sl-ds-api (both versions), angular-specialist | Yes (migration BLOKs) | Updated imports, fixed breaking changes, updated tests |
| C7 | **Clickable prototype — HTML** | sl-ds-proto (Mode A) | sl-ds-figma, sl-ds-mapper | No | Single-folder HTML prototype |
| C7-B | **Clickable prototype — Angular** | sl-ds-proto (Mode B) | sl-ds-figma, sl-ds-mapper, sl-ds-compose (lite), sl-ds-version | No | Angular project with routing + basic tests |
| C8 | **New project scaffold** | sl-ds-impl (--scaffold) | sl-ds-version (detection disabled), angular-specialist | Yes (full sprint) | NX monorepo scaffold + DS integration + first page |
| C9 | **Design compliance check** | sl-ds-audit | sl-ds-figma, sl-ds-mapper, sl-ds-api | No | Compliance report (Figma vs current code diff) |

### 11.2 Flow Diagrams

#### C1 — New Design → Full Implementation

```
Developer -> sl-ds-impl
    |
    +-> sl-ds-version (detect SLDS, Angular, NX, theme)
    |
    +-> sl-ds-figma (Steps 1: Interpret) + a11y-review
    |
    +-> sl-ds-mapper + sl-ds-api (Step 2: Map) + a11y-review
    |
    +-> sl-ds-compose (Step 3: Compose)
    |
    +-> angular-specialist + scss-design-system-pro (Step 4: Generate) + a11y-impl
    |
    +-> sdl-quality + a11y-audit + a11y-navigator (Step 5: Quality gate)
    |     |
    |     +-> [if < 95] Repair loop (max 3 cycles, 90K tokens)
    |
    +-> [simple] sl-ds-impl integrates directly (Step 6)
    |   [complex] sdl-master (IMPL_*.md handoff) (Step 6)
    |
    +-> sdl-quality + sdl-gap-analysis (Step 7: Post-gate)
    |
    +-> sdl-cicd-orchestrator -> PR
```

#### C2 — Design Update (Diff Mode)

```
Developer -> sl-ds-impl --diff (with new Figma link)
    |
    +-> sl-ds-figma reads NEW Figma state
    |
    +-> sl-ds-figma reads OLD state from cache OR existing code
    |
    +-> diff algorithm: identifies changed components
    |
    +-> sl-ds-mapper (only for changed components)
    |
    +-> angular-specialist applies targeted changes (partial file updates)
    |
    +-> sdl-quality (Step 5) + regression check vs existing tests
    |
    +-> sdl-gap-analysis (Step 7)
```

#### C6 — SLDS Version Bump

```
Developer -> sl-ds-migrate --from=1.4.2 --to=2.0.1
    |
    +-> sl-ds-version (detect current version in package.json)
    |
    +-> sl-ds-api (fetch BOTH 1.4.2 AND 2.0.1 CEM)
    |
    +-> Generate breaking-changes diff (1.4.2-to-2.0.1.json)
    |
    +-> sl-ds-impl generates migration IMPL_*.md:
    |     BLOK 0: Update package.json versions
    |     BLOK 1..N: Fix breaking changes per component
    |     BLOK Q: Update + re-run tests
    |
    +-> sdl-master executes migration plan
    |
    +-> sdl-verification (full regression run)
```

#### C7 — Quick Prototype

```
Developer -> sl-ds-proto "Prototype this Figma"
    |
    +-> sl-ds-figma (Passes 1+2 only — skip detailed layout Pass 3)
    |
    +-> sl-ds-mapper (component tree only)
    |
    +-> sl-ds-proto generation stage:
    |     Mode A: write prototype/ HTML files (no build)
    |     Mode B: write prototype-angular/ project
    |
    Done — no quality gate, no integration step
```

#### C8 — New Project Scaffold

```
Developer -> sl-ds-impl --scaffold "Create new NX app with DS"
    |
    +-> (sl-ds-version skipped — no project to detect)
    |
    +-> angular-specialist scaffolds NX workspace:
    |     nx workspace, feature/ui/data-access/util layers
    |     @sl-design-system/* as dependencies
    |     theme configured in styles.css
    |     CUSTOM_ELEMENTS_SCHEMA in app.config.ts
    |
    +-> sl-ds-impl runs C1 flow for first page from Figma
    |
    +-> sdl-master full sprint
```

#### C9 — Design Compliance Check

```
Developer -> sl-ds-audit "Check our login page vs Figma"
    |
    +-> sl-ds-figma reads current Figma (fresh, no cache)
    |
    +-> sl-ds-mapper produces expected slds-tree.json
    |
    +-> Compare expected vs actual (code inspection + token/structure diff):
    |     - Missing components
    |     - Wrong variants / props
    |     - Hardcoded values / token violations
    |     - Layout structure mismatches
    |     - A11Y regressions
    |
    Output: compliance-report.md (no code changes made)
```

### 11.3 Edge Cases

| Edge case | Handling |
|-----------|---------|
| No SLDS equivalent for Figma component | Log as `UNMAPPED_COMPONENT`, generate placeholder `<div>` with comment, include in report for human decision |
| No Angular target project | Confidence < 40 → pause and ask user; otherwise trigger C8 scaffold flow automatically |
| Multiple SLDS versions in monorepo | Use highest-usage version in auto mode; ask user in approval mode |
| No Angular wrapper for SLDS component | Use raw web component with `CUSTOM_ELEMENTS_SCHEMA`; note in report |
| Figma API rate-limited | Exponential backoff (3 retries, max 60s wait); then pause + notify user |
| 10+ screens in auto mode | Batch by user flow (Figma page grouping); process sequentially |
| Confidence < 40 | **Always pause** — regardless of execution mode |
| Conflicting information (2+ valid interpretations) | Confidence < 40 → always pause and present options to user |

---

## 12. Naming Conventions & Agent Map

### 12.1 Canonical Names — Rename Table

Previous versions used inconsistent names for the same agents. This table shows
the single canonical name and what it replaces:

| Canonical Name | Replaced Names (from v1/v2/v3) | Notes |
|---------------|-------------------------------|-------|
| `sl-ds-figma` | `figma-interpreter`, `figma-reader` | Canonical: `sl-ds-figma` |
| `sl-ds-mapper` | `component-mapper` | Canonical: `sl-ds-mapper` |
| `sl-ds-compose` | (new in v3, had no prior name) | Canonical: `sl-ds-compose` |
| `sl-ds-api` | `sl-ds-api-resolver` | Canonical: `sl-ds-api` |
| `sl-ds-version` | `version-resolver`, `sl-ds-version-resolver` | Canonical: `sl-ds-version` |
| `sl-ds-impl` | `design-orchestrator` (v1) | Canonical: `sl-ds-impl` |
| `sl-ds-proto` | `prototype-generator` (v1) | Canonical: `sl-ds-proto` |
| `sl-ds-docs` | (v2 introduced, v3 retained) | Canonical: `sl-ds-docs` |
| `sl-ds-audit` | (new in v2; no prior name) | Canonical: `sl-ds-audit` |
| `sl-ds-migrate` | (new in v2; no prior name) | Canonical: `sl-ds-migrate` |
| `sl-ds-plan` | `design-plan-generator` (v1), `design-to-plan-translator` (req doc) | Canonical: merged into `sl-ds-impl`; IMPL_*.md generation is `sl-ds-impl`'s responsibility |

> **Note on `design-orchestrator`:** This role was described in v1 as a single top-level
> orchestrator. In v2 it was split into multiple entry points. The final architecture
> uses the v2/v3 model: no single `design-orchestrator` exists. The entry points
> `sl-ds-impl`, `sl-ds-proto`, `sl-ds-docs`, `sl-ds-audit`, `sl-ds-migrate` are the orchestrators.

### 12.2 Prefix Taxonomy

| Prefix | Group | Scope |
|--------|-------|-------|
| `sl-ds-` | Design System interpretation and generation | New agents — design-system layer |
| `a11y-` | Accessibility | New agents — accessibility layer |
| `sdl-` | Sprint Delivery Loop | Existing agents — unchanged |
| (none) | Specialist workers | Existing workers — unchanged or minor updates |

### 12.3 Complete Agent Map

```
+--------------------------------------------------------------------+
|  DS AGENTS (new)              |  A11Y AGENTS (new)                 |
|                               |                                    |
|  Entry points (user-facing):  |  Entry points (user-facing):       |
|    sl-ds-docs                    |    a11y-audit                      |
|    sl-ds-proto                   |    a11y-test                       |
|    sl-ds-impl                    |                                    |
|    sl-ds-audit                   |  Internal sub-agents:              |
|    sl-ds-migrate                 |    a11y-impl                       |
|                               |    a11y-navigator                  |
|  Internal sub-agents:         |    a11y-review                     |
|    sl-ds-figma                   |                                    |
|    sl-ds-mapper                  |                                    |
|    sl-ds-compose                 |                                    |
|    sl-ds-api                     |                                    |
|    sl-ds-version                 |                                    |
+--------------------------------------------------------------------+
|  SDL AGENTS (existing)        |  SPECIALIST WORKERS (existing)     |
|                               |                                    |
|    sdl-master                 |    angular-specialist (*)          |
|    sdl-impl-orchestrator (*)  |    scss-design-system-pro (*)      |
|    sdl-plan-scorer            |    storybook-pro                   |
|    sdl-gap-analysis           |    qa-automation                   |
|    sdl-quality                |    accessibility-specialist        |
|    sdl-verification           |    ngrx-signal-store-pro           |
|    sdl-cicd-orchestrator      |    migration-analyzer              |
|    sdl-retrospective          |    migration-executor              |
|    sdl-repair                 |    typescript-pro                  |
|    sdl-log-analyzer           |    context-manager                 |
|                               |    ux-specialist                   |
|                               |    e2e-scenario-writer             |
+--------------------------------------------------------------------+

(*) = minor update required (SLDS version awareness / theme detection / BLOK routing)
```

### 12.4 File Structure in Agent Repository

```
./
  agents/
    sl-ds/
      sl-ds-docs.md                      <- API Q&A entry point
      sl-ds-proto.md                     <- Prototype orchestrator
      sl-ds-impl.md                      <- Full implementation orchestrator
      sl-ds-audit.md                     <- Design compliance checker
      sl-ds-migrate.md                   <- Version migration orchestrator
      sl-ds-figma.md                     <- Figma sub-agent
      sl-ds-mapper.md                    <- SLDS mapper sub-agent
      sl-ds-compose.md                   <- Composition analysis sub-agent
      sl-ds-api.md                       <- CEM fetch/cache sub-agent
      sl-ds-version.md                   <- Version detection sub-agent
    a11y/
      a11y-audit.md
      a11y-impl.md
      a11y-test.md
      a11y-navigator.md
      a11y-review.md
    sdl/
      sdl-master.md                   <- unchanged
      sdl-impl-orchestrator.md        <- updated: figma-design BLOK routing
      ...
    workers/
      angular-specialist.md           <- updated: SLDS version awareness
      scss-design-system-pro.md       <- updated: theme detection
      ...
  knowledge/
    figma-to-slds-mapping.json        <- curated: Figma name -> sl-* component
    composition-patterns.json         <- curated: valid parent/child combos
    breaking-changes/
      1.x-to-2.x.json                 <- curated: migration rules (fallback)
    exceptions.json                   <- quality exception registry
  scripts/
    validate-tokens.js                <- DS3/DS4 token validation
    check-component-status.js         <- DS6 draft component detection
    validate-cem-usage.js             <- DS5 prop validation
    check-architecture.js             <- A1/A2 smart/dumb compliance
    check-modern-angular.js           <- ANG2-ANG8 signal migration check
    calculate-composite-score.js      <- quality composite calculation
  .sl-ds-cache/                          <- gitignored
    figma/
    state/
      pipeline-state.json
    slds-tree.json
    composition-plan.json
    sl-ds-api/
      {version}/
```

Cross-agent references MUST be relative to support relocation. Examples:
- `./sl-ds-api.md` from `./agents/sl-ds/sl-ds-mapper.md`
- `./sl-ds-figma.md` from `./agents/sl-ds/sl-ds-impl.md`
- `../sdl/sdl-master.md` from `./agents/sl-ds/sl-ds-impl.md`

---

## 13. Token Budget

### 13.1 Per-Scenario Budget

| Scenario | Agents involved | Tokens (estimated) |
|----------|----------------|--------------------|
| API Q&A (`sl-ds-docs`) | sl-ds-docs + sl-ds-api | 2–5K |
| HTML prototype — 1 screen | sl-ds-figma + sl-ds-mapper + sl-ds-proto | 15–25K |
| HTML prototype — 5 screens | sl-ds-figma + sl-ds-mapper + sl-ds-proto | 25–40K |
| Angular prototype — 1 screen | sl-ds-figma + sl-ds-mapper + sl-ds-compose (lite) + sl-ds-proto | 20–30K |
| Angular prototype — 5 screens | sl-ds-figma + sl-ds-mapper + sl-ds-compose (lite) + sl-ds-proto | 35–55K |
| Full implementation — 1 screen | All sl-ds-* + a11y-* + quality | 35–50K |
| Full implementation — 5 screens | All sl-ds-* + a11y-* + quality | 60–90K |
| Full implementation — 10 screens | All sl-ds-* + a11y-* + quality + repair | 100–150K |
| A11y audit — existing code | a11y-audit + a11y-navigator | 10–20K |
| A11y test generation | a11y-test | 5–15K |
| Design compliance check | sl-ds-figma + sl-ds-mapper + sl-ds-audit | 15–30K |
| Version migration — small app | sl-ds-migrate + sl-ds-api | 10–25K |
| Version migration — full NX monorepo | sl-ds-migrate + sl-ds-api + sdl-master | 30–60K |

### 13.2 Per-Agent Budget Allocation

| Agent | Typical consumption | Source of tokens |
|-------|--------------------|--------------------|
| `sl-ds-figma` | 10–28K (varies by screen count) | Figma MCP API calls |
| `sl-ds-api` | 2–5K first fetch; <500 from cache | GitHub API (source TS) |
| `sl-ds-mapper` | 2–3K | Local — no external calls |
| `sl-ds-compose` | 2–4K | Local — reads project structure |
| `sl-ds-impl` (orchestration) | 3–5K | Coordination logic |
| `angular-specialist` (per BLOK) | 5–15K | Code generation |
| `scss-design-system-pro` (per BLOK) | 3–8K | Style generation |
| `a11y-review` | 2–4K per step | Code/design analysis |
| `a11y-impl` | 6–12K | ARIA injection + focus management |
| `a11y-audit` | 5–10K | axe-core + Playwright run |
| `a11y-navigator` | 4–8K | Navigation flow analysis |
| `sdl-quality` (Step 5) | 5–10K | Quality report generation |
| Repair cycle (per cycle) | 5–40K | Fix application + verification |

### 13.3 Repair Budget Detail

```
REPAIR BUDGET (per pipeline run — shared across all screens):
  Cycle 1: up to 30K tokens
  Cycle 2: up to 30K tokens
  Cycle 3: up to 30K tokens
  ─────────────────────────
  TOTAL:   90K tokens maximum repair budget per run

  Multi-screen allocation: budget is spent on highest-impact issues first
  regardless of which screen they belong to. If budget is exhausted before
  all screens are repaired, remaining issues are escalated.

Per-cycle breakdown:
  Lint-only repair:           3–8K
  Template repair:            5–12K
  Architecture repair:        10–20K
  Visual fidelity repair:     8–15K
  Accessibility repair:       6–12K
  Full mixed cycle:           20–40K
  Escalation report:          2–4K
```

### 13.4 Comparison to Monolithic Approach

| Approach | Typical tokens | Result quality |
|----------|---------------|----------------|
| Monolithic (all in one agent, v1 mindset) | 100–200K | Poor (context overload) |
| Multi-agent (this architecture) | 15–90K | High (each agent has focused context) |

The key insight: each agent sees ONLY what it needs.
- `sl-ds-figma` sees only Figma (not project code, not CEM)
- `sl-ds-mapper` sees only CEM + abstract tree (not Figma, not project)
- `angular-specialist` sees only SLDS tree + project conventions (not Figma)
- This division prevents context overload that caused quality degradation in monolithic approaches.

---

## 14. Open Decisions

The following questions remain open or partially decided after architecture consolidation.
They do not block agent creation unless explicitly noted below.

| # | Decision | Current Status | Impact |
|---|----------|----------------|--------|
| OD-1 | **Agent repository location** | Current: `agents/` directory in this repo. Migration to separate repo planned but not yet scheduled. All inter-agent paths MUST be relative to enable zero-change relocation. | Non-blocking — relative paths ensure portability |
| OD-2 | **DS repo CI — commit CEM artifacts** | Deferred — requires discussion with DS team. Not blocking agent creation. | Future optimization for `sl-ds-api` sourcing |
| OD-3 | **`web-codegen-scorer` internal rubric** | Treat as optional secondary signal, not primary gate. | Low |
| OD-4 | **Chromatic / screenshot tooling** | Chromatic is optional. Primary visual fidelity is token-based (see Section 5). Screenshot comparison is secondary. | Secondary diagnostics only |
| OD-5 | **`strict: true` in tsconfig** | Generated code targets `strict: true`. Legacy projects may not have it — agent detects and adapts. Final goal: always strict. | Type-safety enforcement |
| OD-6 | **Custom ESLint rules ownership** | Not yet agreed. To be discussed separately. | Ownership only; not an architecture blocker |
| OD-7 | **Framework extensibility** | Angular primary. Svelte possible in future. System architecture is ready (`sl-ds-figma`, `sl-ds-mapper`, `sl-ds-compose` are framework-agnostic, only Step 4 GENERATE is Angular-specific). No other frameworks implemented now. | Future expansion path |
| OD-8 | **`sl-ds-docs` knowledge sources / wrapper coverage** | DS team manages all DS assets including Angular wrappers. Agent derives wrapper coverage by scanning `packages/angular/` at git tag. | `sl-ds-docs` accuracy |
| OD-9 | **Quality exception governance** | No human-in-the-loop required. Agent auto-approves exceptions when pattern match confidence is high (>80%). Only when agent is UNCERTAIN about whether something is a valid exception → escalate. This is rare. | Mostly automated governance |

---

## 15. State Persistence & Resume

### 15.1 State persistence / resume

Agents can be interrupted at any time: the user closes the terminal, a token limit is hit, or a process crashes. State must therefore be saveable and resumable.

After each successful step completion, `sl-ds-impl` writes canonical state to `.sl-ds-cache/state/pipeline-state.json`.

State includes:
- Current step
- All intermediate artifacts (`component-tree`, `slds-tree`, `composition-plan`)
- Quality scores
- Repair cycle count
- Confidence scores
- Latest commit SHA per step

Example shape:

```json
{
  "last_completed_step": 3,
  "artifacts": {
    "component_tree": ".sl-ds-cache/figma/{file-id}--{frame-id}@{lastModified}--component-tree.json",
    "slds_tree": ".sl-ds-cache/slds-tree.json",
    "composition_plan": ".sl-ds-cache/composition-plan.json"
  },
  "quality_scores": {
    "composite": 96
  },
  "repair_cycle_count": 1,
  "confidence_scores": {
    "step1": 92,
    "step2": 88,
    "step3": 95
  },
  "step_commits": {
    "1": "abc1234",
    "2": "def5678",
    "3": "fedcba9"
  }
}
```

Resume command: `sl-ds-impl --resume` picks up from the last completed step. If a valid Figma cache already exists, Step 1 is skipped on resume.

### 15.2 Frequent commits strategy

After each successful step — not just at the end — commit the current work-in-progress.

Commit message format:

```
wip(sl-ds): step {N} - {step_name} [sl-ds-impl]
```

Benefits:
- Crash recovery
- Reviewability
- `git bisect` support

After Step 7 passes, the WIP history is squashed or amended into the final commit with the proper message. The state file stores the latest commit SHA for each completed step.

### 15.3 Context management between agents

Each sub-agent receives only the context it needs. Intermediate artifacts are the communication medium, stored as JSON files in `.sl-ds-cache/`. No agent needs to "remember" what another agent did — it reads the artifact produced by the prior step.

If context grows too large (>100K tokens), the orchestrator (`sl-ds-impl`) splits the work into batches. Each batch processes a subset of components independently, writes its own artifacts, and is merged back into the main pipeline after verification.

### 15.4 Figma cache invalidation

Figma cache key: `{frame-id}@{lastModified}`.

On `sl-ds-impl` start:
1. Read cached frame metadata.
2. Fetch current `lastModified` from Figma.
3. If unchanged, reuse cache and skip Step 1.
4. If changed, invalidate the affected cache entries and re-run from Step 1.
5. If `--no-cache` is passed, bypass cache entirely.

Partial invalidation is supported for multi-screen designs: if only some frames changed, only those frames are re-read and re-processed.

After re-read, `sl-ds-figma` diffs the new `component-tree` against the previous one to identify what changed. That diff enables incremental update mode so Step 2+ only re-process affected components/screens.

---


---

## 16. Operational Specifications

This section closes the operational gaps in the main architecture document and defines the
runtime contracts required to make the design-to-code pipeline safe, resumable, observable,
and deterministic in shared Angular 21 + NX workspaces.

### 16.1 Failure-Mode Matrix

The pipeline treats external dependency failures as first-class operational states. Retries are
only used for transient conditions. Credential failures, permission failures, and deterministic
schema or compile failures are not retried beyond one normalization pass because repeating the
same failing input hides the real fault and wastes token budget.

| Dependency | Failure Mode | Detection Method | Retry Strategy | Fallback Behavior | Abort Condition | User Notification |
| --- | --- | --- | --- | --- | --- | --- |
| Figma API | Rate limiting | HTTP 429, `Retry-After` header, or Figma error payload with rate-limit code. | Honor `Retry-After` when present; otherwise exponential backoff with jitter: 2s, 4s, 8s, 16s, 32s (+0–250ms jitter), max 5 attempts. | Reuse cached structure from the same `file-id/node-id@lastModified` when valid; otherwise downgrade to `structure-only` mode so the run can still produce a partial report. | Abort after attempt 5 or when cumulative wait exceeds 75 seconds. | Warn immediately with affected frame IDs, show next retry time, and emit `WARN` then `ERROR` log entries tied to the run ID. |
| Figma API | Unavailable | HTTP 5xx for the Figma REST endpoint or DNS/connectivity failure before TLS handshake. | Linear-exponential hybrid backoff: 5s, 15s, 30s, max 3 attempts. | If prior structured cache exists, continue in cached mode and mark external freshness as degraded; otherwise stop Step 1. | Abort after 3 failed attempts or if Figma status page is still unreachable after 60 seconds. | Notify that Figma is unavailable, mark the run `blocked-external`, and advise retry or `--resume` later. |
| Figma API | Auth failure | HTTP 401 with invalid token response or missing bearer token. | Do not retry with the same credential. | No fallback other than prompting for a fresh token source. | Immediate abort. | Show masked token suffix, explain that `FIGMA_ACCESS_TOKEN` or `.env` must be refreshed, and suppress further API calls. |
| Figma API | Expired token | HTTP 401/403 with token-expired message from Figma. | Do not retry with the same token; one optional re-read of environment variables after 1 second if shell state changed. | If a valid cached artifact for the requested frame exists, allow read-only operations against cache but do not fetch fresh data. | Abort when no valid cache exists or the token remains expired after env refresh. | Prompt user to rotate the token and log a `FATAL` credential event. |
| Figma API | Network timeout | Client-side timeout exceeding 10 seconds per request or socket idle timeout. | Backoff: 3s, 10s, 30s, max 3 attempts; each retry raises timeout cap by 5 seconds. | Retry only the failed page/frame call; keep already completed pass results. | Abort after 3 timeouts for the same resource. | Warn with the exact Figma resource, timeout threshold, and whether partial results were preserved. |
| Figma API | Permission denied | HTTP 403 with access-denied message for the file or node. | No automatic retry. | If the same design was previously cached by the same user and checksum matches, allow audit-only or docs-only flows from cache; otherwise fail Step 1. | Immediate abort for implementation/prototype flows. | Explain which file or node lacks access and that the token needs read permission to the design. |
| GitHub API | Rate limiting | HTTP 403 with `x-ratelimit-remaining: 0` or GraphQL abuse-rate-limit response. | Backoff: wait until `x-ratelimit-reset`; if unavailable use 10s, 20s, 40s, 80s, max 4 attempts. | Use local `.sl-ds-cache/sl-ds-api/{version}` if complete; otherwise fall back to GitHub raw content for only the missing files. | Abort after 4 attempts or when reset time is more than 5 minutes away and no cache exists. | Notify that DS API hydration is delayed and whether cache fallback was used. |
| GitHub API | Tag not found | HTTP 404 for `refs/tags/{version}` or empty release/tag lookup. | No blind retry; one normalization retry after 1 second using `v{version}` and package tag aliases. | Fallback to the exact resolved version from lockfile if the requested semver range is not a tag. | Abort if no tag resolves to the installed version. | Tell the user which version could not be resolved and suggest `--ds-version` override. |
| GitHub API | Partial fetch failure | One or more required files (`src/*.ts`, `package.json`, `CHANGELOG.md`) missing after fetch batch. | Retry only missing files with backoff 2s, 6s, 18s, max 3 attempts. | If `CHANGELOG.md` is missing, continue without migration hints; if source TS is missing, try the package entrypoint file; if package metadata is missing, mark component status `unknown`. | Abort when main source file remains unavailable after 3 attempts. | Warn about degraded API completeness and list which files were missing. |
| GitHub API | Auth failure | HTTP 401/403 from `gh api` or raw request with invalid `GITHUB_TOKEN`. | Do not retry with the same token. | Try `gh auth token` once if `GITHUB_TOKEN` is absent; otherwise stop external fetches. | Immediate abort when both sources fail. | Prompt for `gh auth login` or `GITHUB_TOKEN` refresh and log masked credential suffix. |
| GitHub API | Schema extraction failure | Parser exception from `ts-morph`/tree-sitter or missing required exports in source file. | One re-fetch of source files, then one parser retry with the secondary parser implementation. | Fallback to cached previous version schema plus a `stale_schema=true` flag when the version checksum matches. | Abort if both parsers fail and no cache exists. | Report the component name, parser used, and whether stale schema fallback was applied. |
| npm / GitHub Packages | Authentication failure | `npm view` or install command returns 401/403 or package registry auth error. | Do not retry with the same token; one optional retry after reloading environment and `.npmrc`. | Fallback to already installed workspace dependency and lockfile metadata without contacting registry. | Abort if the requested package/version is absent locally. | Show registry URL, masked token suffix, and the required auth mechanism (`GITHUB_TOKEN`/`.npmrc`). |
| npm / GitHub Packages | Package not found | 404 from registry or `npm view` package name resolution failure. | No automatic retry other than one name normalization attempt for `@sl-design-system/<component>`. | Fallback to GitHub source fetch when package metadata is unavailable but repository source exists. | Abort if neither registry nor GitHub source can resolve the package. | Notify that the package name is invalid or unpublished and include the canonical name expected by the architecture. |
| npm / GitHub Packages | Version not found | Registry returns package exists but requested version does not. | One retry after semver normalization and lockfile lookup (exact version only). | Fallback to highest installed patch version within the same minor only when running `sl-ds-docs`; implementation and migration flows must not silently substitute versions. | Abort immediately for `sl-ds-impl`, `sl-ds-proto`, and `sl-ds-migrate` if exact version is unavailable. | Explain which version was requested, which versions were found, and whether downgrade/upgrade substitution was blocked. |
| Build tools | TypeScript compilation failure | `tsc --noEmit` exits non-zero or emits diagnostics with code severity `error`. | No blind retry; one rerun after regenerating affected files in the current step. | Fallback is to enter targeted repair cycle with the compiler diagnostics as input. | Abort the current step if the same diagnostics fingerprint appears twice. | Summarize the first 20 diagnostics, attach file paths only, and mark the step as failed-but-resumable. |
| Build tools | NX lint failure | `nx lint` exits non-zero or ESLint reports blocking rule violations. | No blind retry; one rerun after autofix-capable rules are applied. | Fallback is targeted lint repair using `@sl-ds-agents/eslint-config` and step-local file revert if fixes regress build state. | Abort after one failed autofix pass or on repeated identical rule fingerprint. | Notify with violating project names, rule IDs, and whether autofix changed files. |
| Build tools | NX build failure | `nx build` exits non-zero or build artifact verification fails. | One retry after clearing only the run-local build cache; backoff 5 seconds before rerun. | Fallback is to run the project-level build in isolation to narrow scope, then trigger repair. | Abort if isolated build still fails with the same fingerprint. | Notify which target failed, whether cache was invalidated, and whether the failure is integration-specific. |
| Build tools | NX test failure | `nx test --affected` exits non-zero, or coverage minimums are not met. | Rerun failed targets once with verbose output; no additional retries for deterministic failures. | Fallback is to execute only the failed suites, preserve reports, and mark Step 6/7 as blocked pending repair. | Abort when the same test suite fails twice or regression count increases after attempted repair. | Surface suite names, counts, and regression delta without logging test file contents. |
| File system | Disk full | `ENOSPC`, zero-byte artifact detection, or filesystem capacity check below 500 MB free before step start. | No retry until cleanup succeeds; after cleanup, one retry after 2 seconds. | Delete expired logs beyond retention and purge run-local raw caches before retrying the write. | Abort if free space remains below 500 MB or the write fails again. | Notify that disk pressure blocked artifact/log writes and list which cleanup actions were attempted. |
| File system | Permission denied | `EACCES`/`EPERM` on `.sl-ds-cache`, target project files, or git metadata. | No automatic retry. | Fallback only to read-only analysis commands when the failing path is not required for writes; otherwise stop. | Immediate abort for write-required steps. | Explain the exact path category that is not writable and recommend fixing ownership/ACLs. |
| File system | Corrupt cache | JSON parse failure, checksum mismatch, or artifact schema validation error in `.sl-ds-cache`. | One self-healing retry after deleting only the corrupt artifact and regenerating it from the producing step. | Fallback is to restart from the step that created the corrupt artifact while preserving unaffected artifacts. | Abort if regeneration produces the same checksum mismatch twice. | Warn that cache was discarded, identify the producing step, and describe the restart point selected. |

### 16.2 Concurrency Handling

Concurrency is controlled at three levels: the working tree, the run namespace, and the git
branch. The design goal is to allow independent runs in separate clones while preventing two
writers from mutating the same checkout at the same time.

#### Lock File Contract

- Repository-scoped lock path: `.sl-ds-cache/.lock`
- Lock owner fields: `pid`, `hostname`, `user`, `run_id`, `agent`, `target_project`, `branch`,
  `acquired_at`, `heartbeat_at`
- Heartbeat update interval: every 60 seconds while the orchestrator is active
- Stale lock rule: any lock whose `heartbeat_at` is older than 30 minutes is considered stale
- Stale lock recovery: the new process records the stale-lock snapshot to
  `.sl-ds-cache/logs/{run-id}/stale-lock.json`, deletes the stale lock, and acquires a fresh lock
- Active lock behavior: a second writer exits with code 16 and does not modify files

Example lock file:

```json
{
  "pid": 27141,
  "hostname": "dev-machine",
  "user": "marcin",
  "run_id": "sl-ds-run-abc123",
  "agent": "sl-ds-impl",
  "target_project": "apps/max",
  "branch": "sl-ds/sl-ds-run-abc123",
  "acquired_at": "2026-05-20T10:00:00Z",
  "heartbeat_at": "2026-05-20T10:12:00Z"
}
```

#### Run IDs and Namespaced Cache Directories

- Every entry-point invocation generates a run ID with `nanoid(10)` and prefixes it as
  `sl-ds-run-{id}` for state, logs, and branch naming.
- Shared, read-only caches remain version-scoped (`.sl-ds-cache/sl-ds-api/{version}`); mutable
  step artifacts are always namespaced per run under `.sl-ds-cache/runs/{run-id}/`.
- Canonical per-run layout:

```text
.sl-ds-cache/
  .lock
  sl-ds-api/
    {version}/
  runs/
    {run-id}/
      figma/
      state/pipeline-state.json
      logs/
      artifacts/
      reports/
```

- `pipeline-state.json` stores the run ID and all artifact paths relative to the run namespace.
- Resume always re-enters the same run namespace; restart creates a new run ID.

#### Branch Isolation Rules

- Each `sl-ds-impl`, `sl-ds-proto` Mode B2, and `sl-ds-migrate` run creates a dedicated branch named
  `sl-ds/{run-id}` from the currently checked-out source branch.
- The source branch is captured in state as `git_state.branch`; the execution branch SHOULD be
  captured as `git_state.run_branch` when branch isolation is enabled.
- `sl-ds-proto` Mode A and `a11y-*` audit-only flows do not create a branch unless they write into
  the target workspace.
- No run may commit directly to the source branch.

#### Scenario Handling Matrix

| Scenario | Default Handling | Lock Scope | Branch Behavior | Result |
| --- | --- | --- | --- | --- |
| Two developers run `sl-ds-impl` on the same project in separate clones | Allowed. Each clone acquires its own local `.sl-ds-cache/.lock` and creates its own run namespace. | Per clone / working tree | Each run creates its own `sl-ds/{run-id}` branch from the developer’s current branch. | Concurrent work is isolated; remote integration happens later via pull request or manual cherry-pick. |
| Two developers run `sl-ds-impl` in the same shared checkout | Second run is blocked unless the existing lock is stale. | Single shared checkout lock | Only the lock owner may write to `sl-ds/{run-id}` in that checkout. | Prevents competing file writes and overlapping WIP commits. |
| Same developer runs `sl-ds-proto` while `sl-ds-impl` is in progress | Mode A or read-only analysis is allowed only if it does not target the same workspace paths; Mode B2 is blocked by the active writer lock. | Writer lock plus optional read-only shared lock | Standalone prototype uses its own `sl-ds/{run-id}` branch if it writes files; Mode A stays branchless. | No mutation overlap; prototype artifacts remain separate from production implementation artifacts. |
| Multiple screens are being processed | Pass 1 and Pass 2 can process frames in parallel within a batch; Pass 3 layout normalization is sequential per batch; Steps 3–7 are sequential per route group. | No extra repo lock; coordination is internal to the run namespace | Single run branch for the whole batch. | Fast Figma acquisition with deterministic downstream commits and quality gates. |

#### Git Conflict Resolution Strategy

1. Before Step 6, `sl-ds-impl` fetches the source branch and compares `merge-base(source, run-branch)`.
2. If the source branch moved but the run branch is clean, the orchestrator attempts a single
   `git rebase <source-branch>`.
3. If rebase produces conflicts:
   - stop immediately,
   - preserve the conflict state on `sl-ds/{run-id}`,
   - write `.sl-ds-cache/runs/{run-id}/reports/git-conflicts.json`,
   - mark the run `blocked-conflict` in state.
4. Automatic conflict resolution is allowed only for generated files that are fully owned by the
   run and have not been user-edited outside the run branch.
5. Shared source files, route registries, and NX project manifests are never auto-resolved after
   a textual conflict; they require user review or a resumed run after manual merge.

### 16.3 Rollback Strategy

Rollback is step-aware. The pipeline commits a safe snapshot after every successful step, so a
rollback never removes validated prior-step work unless explicitly requested by the user.

| Scenario | Rollback Mechanism | Artifacts in `.sl-ds-cache/` | Generated Plans / Documents | State Update | Resume Behavior |
| --- | --- | --- | --- | --- | --- |
| Step failure during Steps 1–6 | Commit-based rollback to the last successful step commit using `git reset --hard <step-commit>` for tracked files, plus file-based deletion of untracked outputs created in the failing step. | Keep artifacts from completed steps; delete only artifacts whose producer step failed or whose checksum changed during the failed step. | Keep reports and partial diagnostics under `reports/failed-step-{n}/`; do not delete prior plan documents. | Set `status` to `failed`, set `active_step` to the failed step, and leave `last_completed_step` unchanged. | Resume starts from the failed step after artifact validation. |
| Post-gate failure in Step 7 finds regression | Option A: one targeted repair cycle on the run branch. Option B if repair fails: commit-based rollback of Step 6 integration to the Step 5 commit. Option C: keep the branch quarantined for manual review. | Preserve Step 5 quality artifacts; archive Step 7 reports and failing test/lint metadata. Do not delete successful Step 1–5 artifacts. | Keep final quality reports, gap analysis, and repair reports because they explain why Step 7 failed. | Set `status` to `post_gate_failed`; record `rollback_target_step: 5` when Step 6 is reverted. | Resume from Step 6 if integration was rolled back; otherwise resume Step 7 after manual fix. |
| Manual abort via `sl-ds-impl --abort` | File-based stop first (release lock, stop background tasks), then commit-based reset to the last successful step unless `--keep-worktree` is explicitly set. | Default behavior keeps run-local artifacts and logs for forensic resume; `--purge-cache` removes the run namespace after state export. | Keep plans, reports, and notes but stamp them `aborted` in metadata. | Set `status` to `aborted`, persist `aborted_at`, and release the lock. | Resume is allowed with `--resume` unless the user also purged the run namespace. |
| Quality threshold not met after max repair cycles | No further auto-repair. If integration has not occurred, keep the branch intact. If integration occurred, revert to the last passing quality commit (usually Step 5) or keep a quarantined branch per policy. | Preserve all artifacts, quality reports, and repair cycle outputs because they are required for human triage. | Keep generated plans/documents and add a terminal `manual-intervention-required` report. | Set `status` to `needs_manual_review`, record `repair_cycles.used == repair_cycles.max`, and retain the failing score snapshot. | Resume requires either `--force-resume` after human edits or `--restart` for a clean run. |

#### Rollback Semantics by Asset Type

- **Tracked source files:** restored by commit-based rollback to the last safe step commit.
- **Untracked generated files:** removed using the state file’s producer-step index so only files
  created by the failed step are deleted.
- **`.sl-ds-cache/runs/{run-id}/artifacts/*`:** preserved for completed steps, purged for failed or
  corrupt producer steps.
- **`.sl-ds-cache/runs/{run-id}/reports/*`:** never deleted automatically; reports are part of the
  audit trail.
- **`docs/sprints/IMPL_*.md`:** retained if already emitted, but their metadata is updated with the
  rollback status so SDL consumers do not mistake them for active execution plans.

A rollback must always write a new state snapshot after the worktree is restored. This guarantees
that `--resume` does not accidentally restart from a stale, pre-rollback state.

### 16.4 Logging & Telemetry

All runs emit structured logs into `.sl-ds-cache/logs/{run-id}/`. The log directory is created at
run start and survives both success and failure so post-mortem analysis can reconstruct exactly
what happened.

#### Directory Layout

```text
.sl-ds-cache/logs/{run-id}/
  run.jsonl               # all events, one JSON object per line
  step-1.jsonl            # optional step-specific stream
  step-5.jsonl            # quality/a11y focus stream
  telemetry.json          # final counters and durations
  stale-lock.json         # only when stale lock recovery happened
  git-conflicts.json      # only when merge/rebase conflicts occurred
```

#### JSONL Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "sl-ds-run-log-entry",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "timestamp",
    "level",
    "run_id",
    "correlation_id",
    "step",
    "agent",
    "event",
    "message",
    "metadata"
  ],
  "properties": {
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "description": "UTC timestamp for the event."
    },
    "level": {
      "type": "string",
      "enum": [
        "DEBUG",
        "INFO",
        "WARN",
        "ERROR",
        "FATAL"
      ],
      "description": "Severity level for filtering and retention."
    },
    "run_id": {
      "type": "string",
      "description": "Unique run identifier shared across all logs and state."
    },
    "correlation_id": {
      "type": "string",
      "description": "Structured correlation identifier in the form `{run-id}:{step}:{agent}:{timestamp}`."
    },
    "step": {
      "type": "integer",
      "minimum": 0,
      "maximum": 7,
      "description": "Pipeline step number; 0 is used for preflight and teardown events."
    },
    "agent": {
      "type": "string",
      "description": "Agent or tool emitting the event."
    },
    "event": {
      "type": "string",
      "description": "Machine-readable event name such as `external_call_started` or `quality_gate_failed`."
    },
    "message": {
      "type": "string",
      "description": "Human-readable summary without file contents or secrets."
    },
    "metadata": {
      "type": "object",
      "description": "Structured metadata such as file paths, durations, HTTP status codes, counts, and confidence values.",
      "additionalProperties": true
    }
  }
}
```

A log line MUST NOT contain source code, rendered HTML, Figma raw payloads, or credential values.
Only file paths, counts, hashes, status codes, and summarized messages are allowed.

#### Required Logging Behavior by Agent Family

| Agent / Tool | Mandatory Log Events |
| --- | --- |
| `sl-ds-impl` / `sl-ds-proto` / `sl-ds-migrate` | run start, config snapshot, lock acquisition, branch creation, step entry, step exit, step duration, rollback, resume validation, final verdict |
| `sl-ds-figma` | Figma pass start/end, frame selection decisions, external call metadata (URL class, status, duration), cache hit/miss, deduplication summary, confidence score |
| `sl-ds-mapper` | CEM version used, component match decisions, unmapped node list, fallback component selection, confidence score per page |
| `sl-ds-compose` | smart/dumb split decisions, store-model detection, route placement, NX library placement, architecture warnings, confidence score |
| `sl-ds-api` | cache hit/miss, source fetch metadata, parser chosen, parser fallback, schema extraction diagnostics, breaking-change diff summary |
| `sl-ds-version` | detected package versions, theme detection heuristics, NX detection result, store-model detection, ambiguity warnings, confidence score |
| `sl-ds-docs` / `sl-ds-audit` | resolved version, data sources used, mismatch counts, warnings emitted, confidence score |
| `a11y-review` / `a11y-impl` / `a11y-audit` / `a11y-test` / `a11y-navigator` | audit target list, ruleset used, fix decisions, blocker counts, journey metrics, manual test generation summary, confidence score |
| Build and quality tools | command invoked, project targets, exit code, duration, summary counts, artifact path, retry or repair trigger |

#### Telemetry Counters

| Counter | Type | Meaning |
| --- | --- | --- |
| `figma_api_calls_total` | integer | Total number of Figma API requests made during the run. |
| `figma_tokens_consumed` | integer | Estimated token consumption attributable to Figma interpretation. |
| `mapping_accuracy` | object | Object with `correct` and `total` counts used to compute mapping quality. |
| `repair_cycles_used` | integer | Number of repair cycles actually executed. |
| `repair_success_rate` | number | Ratio of repaired issues to attempted repairs in the run. |
| `quality_score_initial` | number | Composite quality score before the first repair cycle. |
| `quality_score_final` | number | Composite quality score at the terminal state of the run. |
| `false_positive_exceptions` | integer | Count of exceptions auto-approved because the issue matched an approved exception pattern. |
| `total_duration_seconds` | number | Wall-clock duration from run start to terminal state. |
| `step_duration_seconds[1-7]` | object | Per-step duration map keyed by pipeline step number. |

Telemetry is emitted to `.sl-ds-cache/logs/{run-id}/telemetry.json` at the end of the run and updated
incrementally after each completed step. Retention policy is fixed: keep the newest 10 run
folders by `started_at`; older run log folders are deleted automatically during run start, except
for runs marked `needs_manual_review`, which are retained until the user explicitly cleans them up.

### 16.5 Resume Hardening (State Schema v2)

State schema v2 strengthens resume safety by storing enough git, artifact, checksum, and lock
metadata to prove that a resumed run is still operating on the same logical workspace.

Minimum required shape:

```json
{
  "schema_version": "2.0",
  "run_id": "sl-ds-run-abc123",
  "started_at": "2026-05-20T10:00:00Z",
  "config_snapshot": {
    "ds_version": "2.0.1",
    "angular_version": "21.0.0",
    "theme": "sanoma-learning",
    "wcag_standard": "WCAG22-AA"
  },
  "git_state": {
    "branch": "feature/login-page",
    "head_sha": "abc1234def",
    "is_dirty": false,
    "base_branch": "main"
  },
  "last_completed_step": 3,
  "artifacts": {
    "component_tree": {
      "path": ".sl-ds-cache/figma/...",
      "checksum": "sha256:abc...",
      "generated_at": "2026-05-20T10:05:00Z"
    }
  },
  "quality_scores": {},
  "repair_cycles": { "used": 1, "max": 3 },
  "confidence_scores": {},
  "step_commits": {},
  "lock": {
    "pid": 12345,
    "hostname": "dev-machine",
    "acquired_at": "2026-05-20T10:00:00Z"
  }
}
```

#### Resume Validation Rules

| Validation Rule | How It Is Checked | Failure Handling |
| --- | --- | --- |
| Schema version must match the current supported state schema. | Exact string match against `2.0` before any artifact or git validation runs. | Warn user, refuse normal resume, allow only `--force-resume` or `--restart`. |
| Branch must match the stored branch context. | Compare current branch to stored `git_state.branch` and `git_state.run_branch` if present. | Abort resume because the workspace context changed. Offer `--restart` on the current branch or `--force-resume` for expert use. |
| Stored `head_sha` must be an ancestor of current `HEAD`. | Run `git merge-base --is-ancestor <stored-head> HEAD`. | Abort resume on rebase/force-push divergence. User may choose `--restart`; `--force-resume` is allowed only after explicit warning. |
| All referenced artifact files must exist. | Resolve every `artifacts.*.path` and verify the file is present before loading it. | Warn and restart from the producer step for the first missing artifact. |
| All artifact checksums must match. | Recompute SHA-256 and compare to stored `checksum`. | If mismatch: warn, delete the corrupt artifact, and restart from the step that produced it. |
| Lock ownership must be valid for the current process. | If the stored lock is active and not stale, the same run ID must own it; otherwise reacquire after stale-lock cleanup. | Abort if another active process owns the lock. |
| Config snapshot must still be compatible. | Compare detected DS version, Angular version, theme, and WCAG standard to `config_snapshot`. | Warn on drift; require `--force-resume` when drift changes mapping or quality semantics. |

#### Resume Failure Commands

- `--resume`: use only when all validations pass.
- `--force-resume`: allowed for branch drift or config drift after the user acknowledges that
  artifacts may no longer match the current workspace.
- `--restart`: create a new run ID, reacquire lock, and start from Step 1 with a fresh state file.

#### Producer-Step Restart Mapping

| Artifact | Producing Step | Restart Point When Missing or Corrupt |
| --- | --- | --- |
| `component_tree` | Step 1 (`sl-ds-figma`) | Restart at Step 1. |
| `slds_tree` | Step 2 (`sl-ds-mapper`) | Restart at Step 2 after validating Step 1 artifact. |
| `composition_plan` | Step 3 (`sl-ds-compose`) | Restart at Step 3 after validating Steps 1–2 artifacts. |
| `quality_report_step5` | Step 5 (`sdl-quality` + a11y agents) | Restart at Step 5 after validating generation outputs. |
| `quality_report_step7` | Step 7 (`sdl-quality` + `sdl-gap-analysis`) | Restart at Step 7 unless integration state diverged, in which case restart Step 6. |

### 16.6 Custom Quality Tool Contracts

The following tools are the machine-enforceable quality contracts referenced by the quality
system. All tools must write JSON to stdout, be callable independently, and be deterministic for
the same input workspace state.

#### Tool: scripts/validate-tokens.js

**Command:** `node scripts/validate-tokens.js --project <path> [--files <glob>] [--format json]`
**Arguments:** `--project <path>` target workspace root; `--files <glob>` narrow scan scope; `--allow-exceptions <file>` approved token exceptions registry.
**Input:** `--project <path>` or `--files <glob>`; reads compiled CSS/SCSS/HTML template references and DS token registry.
**Output:** stdout JSON:
```json
{
  "tool": "validate-tokens",
  "version": "1.0",
  "timestamp": "ISO",
  "summary": {
    "pass": 0,
    "fail": 0,
    "warn": 0,
    "skip": 0
  },
  "violations": [
    {
      "file": "packages/components/example/example.component.ts",
      "line": 42,
      "rule": "example-rule",
      "severity": "error",
      "message": "Human-readable explanation of the violation.",
      "fix_hint": "Concrete remediation guidance."
    }
  ],
  "details": {
    "hardcoded_colors": 0,
    "hardcoded_spacing": 0,
    "token_alias_mismatches": 0
  }
}
```
**Exit codes:** 0 = all pass, 1 = violations found, 2 = tool error
**Blocking:** Yes (blocks Step 5 and Step 7 quality gate).
**Ownership:** DS Agents team (until OD-6 resolved).

Validates DS3/DS4 token compliance against the active theme and rejects hardcoded values except approved exceptions.

#### Tool: scripts/check-component-status.js

**Command:** `node scripts/check-component-status.js --project <path> [--version <slds-version>] [--allow-preview]`
**Arguments:** `--project <path>` scans generated markup and imports; `--version <slds-version>` pins the DS API cache version; `--allow-preview` downgrades preview components to warnings.
**Input:** `--project <path>`; reads component usage inventory plus `.sl-ds-cache/sl-ds-api/{version}/_index.json`.
**Output:** stdout JSON:
```json
{
  "tool": "check-component-status",
  "version": "1.0",
  "timestamp": "ISO",
  "summary": {
    "pass": 0,
    "fail": 0,
    "warn": 0,
    "skip": 0
  },
  "violations": [
    {
      "file": "packages/components/example/example.component.ts",
      "line": 42,
      "rule": "example-rule",
      "severity": "error",
      "message": "Human-readable explanation of the violation.",
      "fix_hint": "Concrete remediation guidance."
    }
  ],
  "details": {
    "stable": 0,
    "preview": 0,
    "draft": 0
  }
}
```
**Exit codes:** 0 = only stable components used, 1 = preview/draft violations found, 2 = tool error
**Blocking:** Yes for draft components; preview components may be warning-only when explicitly allowed.
**Ownership:** DS Agents team (until OD-6 resolved).

Implements DS6 by detecting usage of draft or unpublished SLDS components before integration.

#### Tool: scripts/validate-cem-usage.js

**Command:** `node scripts/validate-cem-usage.js --project <path> [--version <slds-version>] [--files <glob>]`
**Arguments:** `--project <path>` target workspace; `--version <slds-version>` selects CEM cache; `--files <glob>` validates a subset of files.
**Input:** `--project <path>` or `--files <glob>`; reads templates, TS wrappers, and the versioned DS API cache.
**Output:** stdout JSON:
```json
{
  "tool": "validate-cem-usage",
  "version": "1.0",
  "timestamp": "ISO",
  "summary": {
    "pass": 0,
    "fail": 0,
    "warn": 0,
    "skip": 0
  },
  "violations": [
    {
      "file": "packages/components/example/example.component.ts",
      "line": 42,
      "rule": "example-rule",
      "severity": "error",
      "message": "Human-readable explanation of the violation.",
      "fix_hint": "Concrete remediation guidance."
    }
  ],
  "details": {
    "checked_components": 0,
    "unknown_props": 0,
    "invalid_events": 0,
    "invalid_slots": 0
  }
}
```
**Exit codes:** 0 = all pass, 1 = invalid component API usage found, 2 = tool error
**Blocking:** Yes (blocks quality gate and integration).
**Ownership:** DS Agents team (until OD-6 resolved).

Implements DS5 by validating component props, events, and slots against the resolved SLDS CEM/API cache.

#### Tool: scripts/check-architecture.js

**Command:** `node scripts/check-architecture.js --project <path> [--nx-project <name>] [--format json]`
**Arguments:** `--project <path>` root of NX workspace; `--nx-project <name>` limits checks; emits architecture violations and graph metrics.
**Input:** `--project <path>`; reads `project.json`, route files, imports, store files, and AST summaries.
**Output:** stdout JSON:
```json
{
  "tool": "check-architecture",
  "version": "1.0",
  "timestamp": "ISO",
  "summary": {
    "pass": 0,
    "fail": 0,
    "warn": 0,
    "skip": 0
  },
  "violations": [
    {
      "file": "packages/components/example/example.component.ts",
      "line": 42,
      "rule": "example-rule",
      "severity": "error",
      "message": "Human-readable explanation of the violation.",
      "fix_hint": "Concrete remediation guidance."
    }
  ],
  "details": {
    "smart_components": 0,
    "dumb_components": 0,
    "store_violations": 0,
    "circular_dependencies": 0
  }
}
```
**Exit codes:** 0 = compliant, 1 = violations found, 2 = tool error
**Blocking:** Yes (blocks Step 5 and Step 7 quality gate).
**Ownership:** DS Agents team (until OD-6 resolved).

Implements architecture metrics A1/A2 and validates smart/dumb split, layer placement, and circular dependency rules.

#### Tool: scripts/check-modern-angular.js

**Command:** `node scripts/check-modern-angular.js --project <path> [--files <glob>] [--strict]`
**Arguments:** `--project <path>` or `--files <glob>`; `--strict` upgrades warnings to errors for ANG2–ANG8 violations.
**Input:** `--project <path>` or `--files <glob>`; parses standalone components, routes, stores, and template syntax.
**Output:** stdout JSON:
```json
{
  "tool": "check-modern-angular",
  "version": "1.0",
  "timestamp": "ISO",
  "summary": {
    "pass": 0,
    "fail": 0,
    "warn": 0,
    "skip": 0
  },
  "violations": [
    {
      "file": "packages/components/example/example.component.ts",
      "line": 42,
      "rule": "example-rule",
      "severity": "error",
      "message": "Human-readable explanation of the violation.",
      "fix_hint": "Concrete remediation guidance."
    }
  ],
  "details": {
    "constructor_injection": 0,
    "legacy_inputs": 0,
    "legacy_outputs": 0,
    "legacy_control_flow": 0
  }
}
```
**Exit codes:** 0 = compliant, 1 = modern Angular violations found, 2 = tool error
**Blocking:** Yes for `sl-ds-impl`; warning-only for prototype Mode B unless promoted to production.
**Ownership:** DS Agents team (until OD-6 resolved).

Checks signal-based patterns, standalone components, `inject()`, control flow syntax, and modern Angular 21 idioms.

#### Tool: scripts/calculate-composite-score.js

**Command:** `node scripts/calculate-composite-score.js --report-dir <path> --output <path>`
**Arguments:** `--report-dir <path>` points to the directory containing all individual tool outputs; `--output <path>` writes the merged quality report.
**Input:** `--report-dir <path>`; consumes JSON outputs from lint, build, a11y, DS, and architecture checks.
**Output:** stdout JSON:
```json
{
  "tool": "calculate-composite-score",
  "version": "1.0",
  "timestamp": "ISO",
  "summary": {
    "pass": 0,
    "fail": 0,
    "warn": 0,
    "skip": 0
  },
  "violations": [
    {
      "file": "packages/components/example/example.component.ts",
      "line": 42,
      "rule": "example-rule",
      "severity": "error",
      "message": "Human-readable explanation of the violation.",
      "fix_hint": "Concrete remediation guidance."
    }
  ],
  "details": {
    "composite": 95,
    "group_scores": {
      "architecture": 95,
      "code_quality": 95,
      "visual_fidelity": 95,
      "accessibility": 95,
      "ds_maintainability": 95
    },
    "verdict": "pass"
  }
}
```
**Exit codes:** 0 = composite and all floors passed, 1 = score below threshold or blocking violations remain, 2 = tool error
**Blocking:** Yes (terminal gate calculator for Step 5 and Step 7).
**Ownership:** DS Agents team (until OD-6 resolved).

Applies the canonical weighted formula, floor checks, exception adjustments, and repair-cycle annotations.

#### Tool: @sl-ds-agents/eslint-config

**Command:** `eslint --config node_modules/@sl-ds-agents/eslint-config/index.mjs <files> -f json`
**Arguments:** `<files>` is a TS/HTML glob; package exports base config, Angular presets, and custom DS rules.
**Input:** `--project <path>` or `--files <glob>`; ESLint consumes source files plus tsconfig context.
**Output:** stdout JSON:
```json
{
  "tool": "@sl-ds-agents/eslint-config",
  "version": "1.0",
  "timestamp": "ISO",
  "summary": {
    "pass": 0,
    "fail": 0,
    "warn": 0,
    "skip": 0
  },
  "violations": [
    {
      "file": "packages/components/example/example.component.ts",
      "line": 42,
      "rule": "example-rule",
      "severity": "error",
      "message": "Human-readable explanation of the violation.",
      "fix_hint": "Concrete remediation guidance."
    }
  ],
  "details": {
    "rule_sets": [
      "angular",
      "design-system",
      "accessibility"
    ],
    "autofixable": 0
  }
}
```
**Exit codes:** 0 = lint clean, 1 = violations found, 2 = runtime/configuration error
**Blocking:** Yes for Step 5/7 production gates; non-blocking advisory for docs-only or audit-only flows.
**Ownership:** DS Agents team (until OD-6 resolved), with Frontend Platform as long-term steward.

Shared config package for custom rules referenced by the quality system, including token usage and smart/dumb architecture rules.

### 16.7 Security & Credential Handling

Credential handling is explicit and non-optional. The pipeline may read secrets, but it must never
persist them into code, artifacts, state files, logs, or git history.

#### Secret Sources

- **Figma token:** read from `FIGMA_ACCESS_TOKEN` or a gitignored `.env` file. It MUST never be
  checked into the repository or copied into generated config.
- **GitHub token:** resolved from `gh auth token` first when available, otherwise `GITHUB_TOKEN`.
- **npm / GitHub Packages auth:** `.npmrc` pattern:

```ini
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

#### Prohibited Secret Sinks

- No secrets in `.sl-ds-cache/` artifacts. Any token-like string appearing in a Figma response must
  be redacted before the structured artifact is written.
- No secrets in log files. Tokens are masked to the last 4 characters only.
- No secrets in generated code, test fixtures, prototype files, or Storybook stories.
- No secrets in git commits. A pre-commit scan of staged diffs must run before every step commit.
- No secrets in `pipeline-state.json`; only metadata and masked identifiers are allowed.

#### Least-Privilege Rules

- Figma tokens require **read-only** access to the relevant design files.
- GitHub tokens require **repo read** plus **`read:packages`** when package metadata is needed.
- Registry tokens must not have publish, delete, or admin scope for local generation runs.

#### Local vs CI

| Environment | Secret Source | Additional Rule |
|---|---|---|
| Local developer machine | Environment variables or gitignored `.env` | CLI prompts may explain how to refresh secrets but never echo values. |
| CI / GitHub Actions | GitHub Actions secrets, organization vault, or OIDC-backed secret broker | Secrets are injected at runtime only and must not be written to artifacts. |

#### Cache Hygiene

- `.sl-ds-cache/` is gitignored and treated as ephemeral operational state.
- Raw Figma responses are deleted immediately after normalization and redaction.
- Only structured artifacts needed for resume and audit are retained.
- Shared version caches under `.sl-ds-cache/sl-ds-api/{version}` store component API only, never auth
  metadata or raw HTTP headers.

#### Token Rotation Rule

If a token fails authentication, the system stops immediately. It MUST NOT retry with the same
credential. The user is prompted to refresh the token, and the run remains resumable once valid
credentials are available.

## 17. Per-Agent Contracts (Appendix A)

Each contract below is intentionally strict: inputs and outputs are JSON-first, every agent has a
bounded tool surface, and failure handling is explicit enough to be implemented in code.

#### A.1 — sl-ds-docs

**Type:** Entry point
**Called by:** Developer directly, IDE/CLI command, or `sl-ds-impl` for inline documentation hints.
**Invokes:** `sl-ds-version`, `sl-ds-api`, optional Storybook/source lookup, and local example scanners.

**Input Schema:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": [
    "query"
  ],
  "properties": {
    "query": {
      "type": "string",
      "description": "Natural-language design-system question to answer."
    },
    "version": {
      "type": "string",
      "description": "Optional SLDS version override."
    },
    "component": {
      "type": "string",
      "description": "Optional SLDS component tag or package name to narrow lookup."
    }
  },
  "additionalProperties": false
}
```

**Output Schema:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": [
    "query",
    "resolvedVersion",
    "answer",
    "sources",
    "warnings",
    "confidence"
  ],
  "properties": {
    "query": {
      "type": "string",
      "description": "Echo of the input query."
    },
    "resolvedVersion": {
      "type": "string",
      "description": "SLDS version used for the answer."
    },
    "answer": {
      "type": "string",
      "description": "Terminal-friendly markdown answer."
    },
    "sources": {
      "type": "array",
      "description": "Evidence used to build the answer.",
      "items": {
        "type": "string",
        "description": "Source descriptor such as cache, Storybook, or source file."
      }
    },
    "warnings": {
      "type": "array",
      "description": "Version or stability warnings.",
      "items": {
        "type": "string",
        "description": "Warning text."
      }
    },
    "confidence": {
      "type": "number",
      "minimum": 0,
      "maximum": 100,
      "description": "Confidence in answer completeness and version correctness."
    }
  },
  "additionalProperties": false
}
```

**Tools/Commands Used:**
- `sl-ds-api`: resolve component API and status
- `sl-ds-version`: infer target SLDS version when omitted
- `gh api` / raw GitHub fetch: source fallback
- File system scans: examples and wrapper presence
- Storybook story lookup: usage examples

**Failure Modes:**
| Failure | Detection | Recovery |
| --- | --- | --- |
| Unknown component | Component lookup returns no package or tag match. | Ask for narrower query or provide nearest matches from `_index.json`. |
| Version ambiguity | Multiple installed SLDS versions and no override. | Use `sl-ds-version` heuristic; warn and lower confidence if ambiguity remains. |
| Missing example source | No Storybook story or wrapper example found. | Answer from API only, flag examples as unavailable. |

**Token Budget:** 2–5K typical.
**Confidence Output:** Higher when version is explicit, API cache is fresh, and examples/wrapper coverage are available.

#### A.2 — sl-ds-proto

**Type:** Orchestrator
**Called by:** Developer directly.
**Invokes:** `sl-ds-version`, `sl-ds-figma`, `sl-ds-mapper`, optional `sl-ds-compose` (lite), Angular/static generators, and build verification commands.

**Input Schema:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": [
    "figmaUrl",
    "mode"
  ],
  "properties": {
    "figmaUrl": {
      "type": "string",
      "description": "Figma frame or file URL to prototype from."
    },
    "mode": {
      "type": "string",
      "enum": [
        "A",
        "B"
      ],
      "description": "Prototype mode: HTML throwaway (`A`) or Angular scaffold (`B`)."
    },
    "variant": {
      "type": "string",
      "enum": [
        "B1",
        "B2"
      ],
      "description": "Optional Angular sub-variant for CDN (`B1`) or full project (`B2`)."
    }
  },
  "additionalProperties": false
}
```

**Output Schema:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": [
    "runId",
    "mode",
    "status",
    "outputPath",
    "artifacts",
    "verification",
    "confidence"
  ],
  "properties": {
    "runId": {
      "type": "string",
      "description": "Unique run identifier for the prototype run."
    },
    "mode": {
      "type": "string",
      "description": "Resolved prototype mode."
    },
    "status": {
      "type": "string",
      "enum": [
        "completed",
        "failed",
        "partial"
      ],
      "description": "Terminal status."
    },
    "outputPath": {
      "type": "string",
      "description": "Directory containing generated prototype files."
    },
    "artifacts": {
      "type": "array",
      "description": "Prototype artifacts produced.",
      "items": {
        "type": "string",
        "description": "Artifact path."
      }
    },
    "verification": {
      "type": "object",
      "description": "Verification summary for the chosen mode.",
      "properties": {
        "lint": {
          "type": "string",
          "description": "Lint result or `skipped`."
        },
        "build": {
          "type": "string",
          "description": "Build result or `skipped`."
        }
      },
      "additionalProperties": false
    },
    "confidence": {
      "type": "number",
      "minimum": 0,
      "maximum": 100,
      "description": "Confidence in prototype fidelity and viability."
    }
  },
  "additionalProperties": false
}
```

**Tools/Commands Used:**
- `sl-ds-figma`: interpret the design
- `sl-ds-mapper`: map Figma nodes to SLDS components
- `sl-ds-compose` (lite): page and route decomposition for Mode B
- `npm` / `nx` / `tsc`: verification for Angular prototypes
- File system and git branch creation for isolated prototype output

**Failure Modes:**
| Failure | Detection | Recovery |
| --- | --- | --- |
| Invalid or inaccessible Figma URL | Step 1 fails or returns zero frames. | Abort early and preserve a minimal run report with the failing URL. |
| Prototype build failure | `npm start`/`tsc`/lint for Mode B exits non-zero. | Repair once for generated files; keep output branch for inspection if still failing. |
| Concurrent writer conflict | Active `.sl-ds-cache/.lock` owned by another writer in the same checkout. | Block Mode B2 and advise running in a separate clone or after the active run completes. |

**Token Budget:** 15–55K depending on mode and screen count.
**Confidence Output:** Driven by sl-ds-figma confidence, mapping coverage, and successful build/lint verification for Mode B.

#### A.3 — sl-ds-impl

**Type:** Orchestrator
**Called by:** Developer directly.
**Invokes:** `sl-ds-version`, `sl-ds-figma`, `sl-ds-mapper`, `sl-ds-compose`, `a11y-review`, `a11y-impl`, `a11y-audit`, `a11y-navigator`, `a11y-test`, `sdl-quality`, `sdl-gap-analysis`, build tools, and optionally `sdl-master`.

**Input Schema:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": [
    "figmaUrl",
    "targetProject",
    "mode",
    "resume"
  ],
  "properties": {
    "figmaUrl": {
      "type": "string",
      "description": "Figma frame or file URL used as the design source."
    },
    "targetProject": {
      "type": "string",
      "description": "NX app or library path to implement into."
    },
    "mode": {
      "type": "string",
      "enum": [
        "full",
        "simple"
      ],
      "description": "Full 7-step flow or simplified direct integration mode."
    },
    "resume": {
      "type": "boolean",
      "description": "Whether to resume a prior run from state instead of starting fresh."
    }
  },
  "additionalProperties": false
}
```

**Output Schema:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": [
    "runId",
    "status",
    "branch",
    "lastCompletedStep",
    "statePath",
    "finalVerdict",
    "artifacts",
    "reports"
  ],
  "properties": {
    "runId": {
      "type": "string",
      "description": "Run identifier."
    },
    "status": {
      "type": "string",
      "enum": [
        "completed",
        "failed",
        "blocked",
        "needs_manual_review",
        "aborted"
      ],
      "description": "Terminal run state."
    },
    "branch": {
      "type": "string",
      "description": "Execution branch name."
    },
    "lastCompletedStep": {
      "type": "integer",
      "minimum": 0,
      "maximum": 7,
      "description": "Highest fully completed pipeline step."
    },
    "statePath": {
      "type": "string",
      "description": "Path to pipeline-state.json for this run."
    },
    "finalVerdict": {
      "type": "string",
      "description": "Human-readable terminal verdict."
    },
    "artifacts": {
      "type": "array",
      "description": "Key artifact paths generated during the run.",
      "items": {
        "type": "string",
        "description": "Artifact path."
      }
    },
    "reports": {
      "type": "array",
      "description": "Quality, a11y, and repair reports.",
      "items": {
        "type": "string",
        "description": "Report path."
      }
    }
  },
  "additionalProperties": false
}
```

**Tools/Commands Used:**
- Git branch and lock management
- `sl-ds-version`: environment detection
- `sl-ds-figma`/`sl-ds-mapper`/`sl-ds-compose`: Steps 1–3
- `tsc`, `nx lint`, `nx build`, `nx test --affected`: gates
- `sdl-quality` and quality scripts: scoring
- `a11y-*` agents: accessibility review, fixes, and tests
- `sdl-master`: complex integration handoff

**Failure Modes:**
| Failure | Detection | Recovery |
| --- | --- | --- |
| Resume validation failure | State schema, branch, SHA, or checksum validation fails. | Abort normal resume and require `--force-resume` or `--restart`. |
| Quality gate failure | Composite score or group floors not met. | Run up to 3 repair cycles, then mark `needs_manual_review`. |
| Git conflict during integration | Rebase or merge conflict occurs before or during Step 6. | Stop, preserve conflict report, and keep the run branch for manual resolution. |

**Token Budget:** 35–150K depending on screen count, integration complexity, and repair cycles.
**Confidence Output:** Composite of per-step confidence, mapping coverage, successful gates, and absence of ambiguity/conflict states.

#### A.4 — sl-ds-audit

**Type:** Entry point
**Called by:** Developer directly.
**Invokes:** `sl-ds-version`, `sl-ds-figma`, `sl-ds-mapper`, local project scanners, quality scripts, and optional a11y review.

**Input Schema:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": [
    "figmaUrl",
    "targetProject"
  ],
  "properties": {
    "figmaUrl": {
      "type": "string",
      "description": "Figma design to compare against code."
    },
    "targetProject": {
      "type": "string",
      "description": "Workspace project path to audit."
    }
  },
  "additionalProperties": false
}
```

**Output Schema:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": [
    "reportPath",
    "summary",
    "mismatches",
    "confidence"
  ],
  "properties": {
    "reportPath": {
      "type": "string",
      "description": "Path to the generated audit report."
    },
    "summary": {
      "type": "object",
      "description": "High-level audit counts.",
      "properties": {
        "matched": {
          "type": "integer",
          "description": "Count of matching design/code elements."
        },
        "mismatched": {
          "type": "integer",
          "description": "Count of mismatched design/code elements."
        },
        "missing": {
          "type": "integer",
          "description": "Count of design elements missing in code."
        }
      },
      "additionalProperties": false
    },
    "mismatches": {
      "type": "array",
      "description": "Detailed mismatch list.",
      "items": {
        "type": "object",
        "description": "Single mismatch.",
        "properties": {
          "category": {
            "type": "string",
            "description": "Mismatch category."
          },
          "path": {
            "type": "string",
            "description": "File or design path."
          },
          "message": {
            "type": "string",
            "description": "Mismatch explanation."
          }
        },
        "additionalProperties": false
      }
    },
    "confidence": {
      "type": "number",
      "minimum": 0,
      "maximum": 100,
      "description": "Confidence in design-to-code comparison completeness."
    }
  },
  "additionalProperties": false
}
```

**Tools/Commands Used:**
- `sl-ds-figma`: design interpretation
- `sl-ds-mapper`: normalize to SLDS tree before comparison
- AST and template scanners: inspect implemented code
- `git diff`: restrict audit to changed paths when requested
- `scripts/validate-tokens.js` and `validate-cem-usage.js`: evidence for mismatch categories

**Failure Modes:**
| Failure | Detection | Recovery |
| --- | --- | --- |
| Target project cannot be scanned | Path missing or parser cannot load project files. | Abort and report invalid project path. |
| Low mapping confidence | Too many unmapped design nodes. | Return partial audit with explicit unknown areas and low confidence. |
| Version mismatch between design audit and codebase | Detected DS version differs from requested or cached version. | Warn, rerun mapping for the detected version, and annotate the report. |

**Token Budget:** 15–30K typical.
**Confidence Output:** Depends on design coverage, code scan completeness, and mapping certainty for compared nodes.

#### A.5 — sl-ds-migrate

**Type:** Orchestrator
**Called by:** Developer directly.
**Invokes:** `sl-ds-version`, `sl-ds-api`, package manager commands, migration analyzers/executors, quality tools, and build verification commands.

**Input Schema:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": [
    "fromVersion",
    "toVersion",
    "project"
  ],
  "properties": {
    "fromVersion": {
      "type": "string",
      "description": "Current SLDS version."
    },
    "toVersion": {
      "type": "string",
      "description": "Target SLDS version."
    },
    "project": {
      "type": "string",
      "description": "Workspace project or root to migrate."
    }
  },
  "additionalProperties": false
}
```

**Output Schema:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": [
    "runId",
    "status",
    "breakingChanges",
    "changedFiles",
    "reportPath",
    "confidence"
  ],
  "properties": {
    "runId": {
      "type": "string",
      "description": "Migration run identifier."
    },
    "status": {
      "type": "string",
      "enum": [
        "completed",
        "failed",
        "partial"
      ],
      "description": "Migration terminal state."
    },
    "breakingChanges": {
      "type": "array",
      "description": "Breaking changes that were detected.",
      "items": {
        "type": "object",
        "description": "Single breaking change entry.",
        "properties": {
          "component": {
            "type": "string",
            "description": "Affected component."
          },
          "type": {
            "type": "string",
            "description": "Change type."
          },
          "migration": {
            "type": "string",
            "description": "Recommended migration action."
          }
        },
        "additionalProperties": false
      }
    },
    "changedFiles": {
      "type": "array",
      "description": "Files modified by the migration.",
      "items": {
        "type": "string",
        "description": "Changed file path."
      }
    },
    "reportPath": {
      "type": "string",
      "description": "Path to the migration summary report."
    },
    "confidence": {
      "type": "number",
      "minimum": 0,
      "maximum": 100,
      "description": "Confidence that automated migration covered all required changes."
    }
  },
  "additionalProperties": false
}
```

**Tools/Commands Used:**
- `sl-ds-api`: fetch old/new version metadata and breaking-change diffs
- `npm`/`yarn`: update package versions
- Migration analyzer/executor workers: code transforms
- `nx lint`, `nx build`, `nx test`: verification
- Git branch isolation and commit checkpoints

**Failure Modes:**
| Failure | Detection | Recovery |
| --- | --- | --- |
| Version pair unsupported | No cache or changelog diff can be produced for the requested versions. | Abort and emit a manual migration report. |
| Package update failure | Package manager exits non-zero or lockfile cannot resolve. | Rollback package manifest changes and keep the report. |
| Codemod partial application | Expected AST matches are missing or only partially transformed. | Mark partial migration, keep branch, and require manual follow-up. |

**Token Budget:** 10–60K depending on workspace size and version distance.
**Confidence Output:** High when both version caches exist, changelog diffs are complete, and all verification commands pass after transforms.

#### A.6 — sl-ds-figma

**Type:** Sub-agent
**Called by:** `sl-ds-impl`, `sl-ds-proto`, and `sl-ds-audit`.
**Invokes:** Figma REST API, cache manager, deduplication logic, and `a11y-review` for design notes.

**Input Schema:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": [
    "figmaUrl",
    "mode",
    "cache"
  ],
  "properties": {
    "figmaUrl": {
      "type": "string",
      "description": "Figma file, page, or frame URL."
    },
    "mode": {
      "type": "string",
      "enum": [
        "full",
        "structure-only"
      ],
      "description": "Whether to fetch full component/layout detail or just top-level structure."
    },
    "cache": {
      "type": "boolean",
      "description": "Whether cached structured artifacts may be reused."
    }
  },
  "additionalProperties": false
}
```

**Output Schema:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": [
    "artifactPath",
    "pages",
    "sharedComponents",
    "summary",
    "confidence"
  ],
  "properties": {
    "artifactPath": {
      "type": "string",
      "description": "Path to `component-tree.json` generated by the run."
    },
    "pages": {
      "type": "integer",
      "description": "Number of pages or frames processed."
    },
    "sharedComponents": {
      "type": "integer",
      "description": "Number of deduplicated shared components."
    },
    "summary": {
      "type": "object",
      "description": "Operational summary of Figma interpretation.",
      "properties": {
        "apiCalls": {
          "type": "integer",
          "description": "Figma API calls used."
        },
        "tokensConsumed": {
          "type": "integer",
          "description": "Estimated token cost."
        },
        "cacheUsed": {
          "type": "boolean",
          "description": "Whether cache contributed to the result."
        }
      },
      "additionalProperties": false
    },
    "confidence": {
      "type": "number",
      "minimum": 0,
      "maximum": 100,
      "description": "Confidence in structural and semantic interpretation."
    }
  },
  "additionalProperties": false
}
```

**Tools/Commands Used:**
- Figma REST API: file/frame/style/component reads
- Run-local cache under `.sl-ds-cache/runs/{run-id}/figma/`
- Checksum and `lastModified` invalidation logic
- `a11y-review`: design-level accessibility notes

**Failure Modes:**
| Failure | Detection | Recovery |
| --- | --- | --- |
| Rate limit or timeout | HTTP 429/timeout during any pass. | Retry per Section 16.1 and reuse completed pass data. |
| Expired or invalid token | HTTP 401/403 from Figma. | Stop immediately and allow cache-only read paths if valid. |
| Ambiguous component structure | Multiple valid interpretations remain after 3-pass analysis. | Emit alternatives, lower confidence, and let orchestrator pause when confidence <= 40. |

**Token Budget:** 10–28K typical.
**Confidence Output:** Derived from naming matches, deduplication success, layout certainty, and unresolved ambiguous nodes.

#### A.7 — sl-ds-mapper

**Type:** Sub-agent
**Called by:** `sl-ds-impl` and `sl-ds-proto`.
**Invokes:** `sl-ds-api`, curated mapping knowledge, token rules, and optional `a11y-review` validation.

**Input Schema:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": [
    "componentTree",
    "cemVersion"
  ],
  "properties": {
    "componentTree": {
      "type": "string",
      "description": "Path to `component-tree.json`."
    },
    "cemVersion": {
      "type": "string",
      "description": "SLDS version or CEM cache version used for mapping."
    }
  },
  "additionalProperties": false
}
```

**Output Schema:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": [
    "artifactPath",
    "mappedComponents",
    "unmappedComponents",
    "confidence"
  ],
  "properties": {
    "artifactPath": {
      "type": "string",
      "description": "Path to `slds-tree.json`."
    },
    "mappedComponents": {
      "type": "integer",
      "description": "Number of nodes mapped to concrete SLDS components."
    },
    "unmappedComponents": {
      "type": "integer",
      "description": "Number of nodes left unmapped or placeholder-mapped."
    },
    "confidence": {
      "type": "number",
      "minimum": 0,
      "maximum": 100,
      "description": "Confidence in mapping fidelity."
    }
  },
  "additionalProperties": false
}
```

**Tools/Commands Used:**
- `sl-ds-api`: component API/status lookup
- Curated Figma-to-SLDS mapping registry
- Token and slot validators
- Optional `a11y-review`: component-choice validation

**Failure Modes:**
| Failure | Detection | Recovery |
| --- | --- | --- |
| CEM/API cache missing | Required DS version cache not found. | Ask `sl-ds-api` to fetch/populate it before mapping continues. |
| Unknown component | No SLDS component matches a Figma node with sufficient confidence. | Emit placeholder mapping plus alternatives and lower confidence. |
| Invalid property mapping | Mapped prop value not allowed by CEM schema. | Fallback to nearest valid default and record a warning. |

**Token Budget:** 2–3K typical.
**Confidence Output:** Computed from exact-name matches, valid property mappings, and proportion of placeholder mappings.

#### A.8 — sl-ds-compose

**Type:** Sub-agent
**Called by:** `sl-ds-impl`.
**Invokes:** Project structure analyzers, NX graph readers, store-model detectors, and architecture rule validators.

**Input Schema:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": [
    "sldsTree",
    "projectStructure"
  ],
  "properties": {
    "sldsTree": {
      "type": "string",
      "description": "Path to `slds-tree.json`."
    },
    "projectStructure": {
      "type": "object",
      "description": "Normalized workspace/project structure summary used for placement decisions."
    }
  },
  "additionalProperties": false
}
```

**Output Schema:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": [
    "artifactPath",
    "routeCount",
    "componentCount",
    "storeCount",
    "confidence"
  ],
  "properties": {
    "artifactPath": {
      "type": "string",
      "description": "Path to `composition-plan.json`."
    },
    "routeCount": {
      "type": "integer",
      "description": "Routes planned."
    },
    "componentCount": {
      "type": "integer",
      "description": "Components planned."
    },
    "storeCount": {
      "type": "integer",
      "description": "Stores planned."
    },
    "confidence": {
      "type": "number",
      "minimum": 0,
      "maximum": 100,
      "description": "Confidence in architecture and placement decisions."
    }
  },
  "additionalProperties": false
}
```

**Tools/Commands Used:**
- NX workspace graph inspection
- Route and feature library heuristics
- SignalStore / NgRx detection
- `scripts/check-architecture.js`: architecture rule preflight
- File system and manifest readers

**Failure Modes:**
| Failure | Detection | Recovery |
| --- | --- | --- |
| Workspace structure unsupported | Required project metadata or NX conventions cannot be determined. | Abort compose and request manual target selection. |
| Store model ambiguous | Signals, SignalStore, and local state heuristics disagree. | Choose the highest-confidence model, warn, and mark the decision in the plan. |
| Route placement conflict | Existing routes or module boundaries make the chosen location invalid. | Propose the nearest valid feature/ui/data-access placement and lower confidence. |

**Token Budget:** 2–4K typical.
**Confidence Output:** Based on clarity of project conventions, route placement certainty, and architecture rule compliance.

#### A.9 — sl-ds-api

**Type:** Sub-agent
**Called by:** `sl-ds-mapper`, `sl-ds-docs`, `sl-ds-migrate`, and `sl-ds-impl` preflight checks.
**Invokes:** GitHub API/raw source fetch, versioned cache, parser (`ts-morph` or tree-sitter), and changelog diff logic.

**Input Schema:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": [
    "version",
    "action"
  ],
  "properties": {
    "component": {
      "type": "string",
      "description": "Optional component tag/package when the action targets a specific component."
    },
    "version": {
      "type": "string",
      "description": "Resolved SLDS version."
    },
    "action": {
      "type": "string",
      "enum": [
        "fetch",
        "query",
        "list"
      ],
      "description": "Populate cache, query one component, or list available components."
    }
  },
  "additionalProperties": false
}
```

**Output Schema:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": [
    "version",
    "action",
    "source",
    "cachePath"
  ],
  "properties": {
    "version": {
      "type": "string",
      "description": "SLDS version used."
    },
    "action": {
      "type": "string",
      "description": "Action executed."
    },
    "source": {
      "type": "string",
      "description": "Where the data came from: cache, github-source, or hosted-api."
    },
    "cachePath": {
      "type": "string",
      "description": "Cache file or index path written/read."
    },
    "componentApi": {
      "type": "object",
      "description": "Component API object when querying a single component."
    },
    "components": {
      "type": "array",
      "description": "Component list when action=`list`.",
      "items": {
        "type": "string",
        "description": "Component tag."
      }
    }
  },
  "additionalProperties": false
}
```

**Tools/Commands Used:**
- `gh api` / raw content fetch: source retrieval
- Versioned `.sl-ds-cache/sl-ds-api/{version}` cache
- `ts-morph` and tree-sitter: lightweight API extraction
- CHANGELOG parsing: breaking-change diff generation

**Failure Modes:**
| Failure | Detection | Recovery |
| --- | --- | --- |
| GitHub rate limit/auth failure | External fetch returns 403/401. | Use local cache if complete; otherwise abort fetch per Section 16.1. |
| Version not found | Tag or package metadata cannot resolve the requested version. | Abort and ask for explicit version selection. |
| Parser failure | Source fetch succeeds but extraction fails. | Retry with secondary parser or stale cache fallback before aborting. |

**Token Budget:** <500 for cache hits; 2–5K on cache miss/fetch.
**Confidence Output:** Highest when data comes from a fresh cache generated from source and parser extraction completes without fallback.

#### A.10 — sl-ds-version

**Type:** Sub-agent
**Called by:** `sl-ds-impl`, `sl-ds-proto`, `sl-ds-migrate`, and `sl-ds-docs` when version is omitted.
**Invokes:** Package manifest readers, lockfile scanners, theme detectors, NX detectors, and store-model heuristics.

**Input Schema:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": [
    "projectRoot"
  ],
  "properties": {
    "projectRoot": {
      "type": "string",
      "description": "Repository root or specific project root to inspect."
    }
  },
  "additionalProperties": false
}
```

**Output Schema:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": [
    "sldsVersion",
    "angularVersion",
    "nxEnabled",
    "theme",
    "storeModel"
  ],
  "properties": {
    "sldsVersion": {
      "type": "string",
      "description": "Resolved installed SLDS version."
    },
    "angularVersion": {
      "type": "string",
      "description": "Resolved Angular version."
    },
    "nxEnabled": {
      "type": "boolean",
      "description": "Whether the workspace is NX-based."
    },
    "theme": {
      "type": "string",
      "description": "Detected active SLDS theme."
    },
    "storeModel": {
      "type": "string",
      "description": "Detected store model such as SignalStore, NgRx, or local signals."
    }
  },
  "additionalProperties": false
}
```

**Tools/Commands Used:**
- `package.json` and lockfile parsing
- `nx.json` / `project.json` detection
- Theme import scanning in styles and Angular configs
- Import analysis for NgRx/SignalStore/local signals

**Failure Modes:**
| Failure | Detection | Recovery |
| --- | --- | --- |
| Manifest missing or unreadable | Required package manifests are absent or invalid JSON. | Abort detection and require an explicit project root or manual override. |
| Multiple SLDS versions found | Workspace scan returns competing installed versions. | Choose highest-usage version in auto mode and warn; ask for override in approval flows. |
| Theme ambiguity | Multiple themes appear active or no theme import is found. | Return best guess, lower confidence, and allow CLI override. |

**Token Budget:** 1–2K typical.
**Confidence Output:** Confidence rises with exact lockfile matches, unambiguous theme detection, and consistent store signals across the target project.

#### A.11 — a11y-audit

**Type:** Entry point
**Called by:** Developer directly or `sl-ds-impl` at Step 5/7.
**Invokes:** Playwright, axe-core, Lighthouse, route enumerators, and `a11y-navigator` when journey analysis is enabled.

**Input Schema:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": [
    "target",
    "standard",
    "failOn"
  ],
  "properties": {
    "target": {
      "oneOf": [
        {
          "type": "string",
          "description": "Single URL, route, or file path to audit."
        },
        {
          "type": "array",
          "description": "Multiple targets to audit.",
          "items": {
            "type": "string",
            "description": "Audit target."
          }
        }
      ]
    },
    "standard": {
      "type": "string",
      "description": "Accessibility standard such as WCAG22-AA."
    },
    "failOn": {
      "type": "string",
      "enum": [
        "critical",
        "serious",
        "moderate"
      ],
      "description": "Lowest severity that should fail the audit."
    }
  },
  "additionalProperties": false
}
```

**Output Schema:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": [
    "reportPath",
    "standard",
    "summary",
    "confidence"
  ],
  "properties": {
    "reportPath": {
      "type": "string",
      "description": "Path to the audit report."
    },
    "standard": {
      "type": "string",
      "description": "Standard applied during the audit."
    },
    "summary": {
      "type": "object",
      "description": "Severity counts.",
      "properties": {
        "critical": {
          "type": "integer",
          "description": "Critical findings."
        },
        "serious": {
          "type": "integer",
          "description": "Serious findings."
        },
        "moderate": {
          "type": "integer",
          "description": "Moderate findings."
        },
        "minor": {
          "type": "integer",
          "description": "Minor findings."
        }
      },
      "additionalProperties": false
    },
    "confidence": {
      "type": "number",
      "minimum": 0,
      "maximum": 100,
      "description": "Confidence in audit coverage and reproducibility."
    }
  },
  "additionalProperties": false
}
```

**Tools/Commands Used:**
- Playwright browser automation
- `@axe-core/playwright`: automated WCAG checks
- Lighthouse accessibility category
- `a11y-navigator`: keyboard journey and reading-order analysis

**Failure Modes:**
| Failure | Detection | Recovery |
| --- | --- | --- |
| Audit target unreachable | Target URL cannot load or route cannot render. | Abort that target, continue others if multi-target, and report partial coverage. |
| Tooling failure | Playwright or axe initialization fails. | Retry once after browser reinitialization; abort if still failing. |
| Blocking violations found | Findings at or above `failOn` threshold exist. | Return failure report and optionally trigger `a11y-impl` when orchestrated. |

**Token Budget:** 10–20K typical.
**Confidence Output:** Depends on route coverage, successful browser runs, and availability of navigation/journey metadata.

#### A.12 — a11y-impl

**Type:** Sub-agent
**Called by:** `sl-ds-impl` during generation/repair or developer directly for remediation.
**Invokes:** AST/template editors, ARIA/focus pattern library, build verification, and optional `a11y-audit` re-check.

**Input Schema:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": [
    "files",
    "requirements",
    "autoFix"
  ],
  "properties": {
    "files": {
      "type": "array",
      "description": "Files to patch for accessibility.",
      "items": {
        "type": "string",
        "description": "File path."
      }
    },
    "requirements": {
      "type": "string",
      "description": "Path to `a11y-requirements.json` or another requirements artifact."
    },
    "autoFix": {
      "type": "boolean",
      "description": "Whether safe automatic fixes are allowed."
    }
  },
  "additionalProperties": false
}
```

**Output Schema:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": [
    "changedFiles",
    "fixesApplied",
    "remainingIssues",
    "confidence"
  ],
  "properties": {
    "changedFiles": {
      "type": "array",
      "description": "Files modified by the agent.",
      "items": {
        "type": "string",
        "description": "Changed file path."
      }
    },
    "fixesApplied": {
      "type": "integer",
      "description": "Number of fixes applied."
    },
    "remainingIssues": {
      "type": "integer",
      "description": "Number of unresolved issues left for manual follow-up."
    },
    "confidence": {
      "type": "number",
      "minimum": 0,
      "maximum": 100,
      "description": "Confidence that the applied fixes satisfy the stated requirements."
    }
  },
  "additionalProperties": false
}
```

**Tools/Commands Used:**
- Template/TS AST editing
- ARIA and focus-management patterns
- `tsc`/lint verification after edits
- Optional targeted Playwright/a11y rechecks

**Failure Modes:**
| Failure | Detection | Recovery |
| --- | --- | --- |
| Requirements artifact missing | Specified requirements path does not exist or is invalid JSON. | Abort and request regeneration from `a11y-review` or `a11y-audit`. |
| Fix causes regression | Build/lint/test fails after applying fixes. | Rollback the offending fix and mark it unresolved. |
| Unsupported interaction pattern | Requirement cannot be implemented safely with known patterns. | Leave a report entry and escalate for manual design/code review. |

**Token Budget:** 6–12K typical.
**Confidence Output:** Higher when fixes are pattern-based, compile cleanly, and pass targeted re-audit.

#### A.13 — a11y-test

**Type:** Entry point
**Called by:** Developer directly or `sl-ds-impl` at Step 6.
**Invokes:** Test template generators, Playwright/axe scaffolding, manual checklist generator, and route/component metadata scanners.

**Input Schema:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": [
    "components",
    "standard",
    "includeManual"
  ],
  "properties": {
    "components": {
      "type": "array",
      "description": "Components or pages to generate tests for.",
      "items": {
        "type": "string",
        "description": "Component or route identifier."
      }
    },
    "standard": {
      "type": "string",
      "description": "Accessibility standard to test against."
    },
    "includeManual": {
      "type": "boolean",
      "description": "Whether to generate manual QA plans alongside automated tests."
    }
  },
  "additionalProperties": false
}
```

**Output Schema:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": [
    "automatedTests",
    "manualPlan",
    "reportPath",
    "confidence"
  ],
  "properties": {
    "automatedTests": {
      "type": "array",
      "description": "Generated automated test files.",
      "items": {
        "type": "string",
        "description": "Test file path."
      }
    },
    "manualPlan": {
      "type": "string",
      "description": "Path to the manual test plan markdown or checklist artifact."
    },
    "reportPath": {
      "type": "string",
      "description": "Path to the generator summary report."
    },
    "confidence": {
      "type": "number",
      "minimum": 0,
      "maximum": 100,
      "description": "Confidence that the generated plan covers the requested journeys and rules."
    }
  },
  "additionalProperties": false
}
```

**Tools/Commands Used:**
- Playwright test template generation
- axe-core fixture generation
- Manual checklist writer
- Component and route metadata scanners

**Failure Modes:**
| Failure | Detection | Recovery |
| --- | --- | --- |
| Components not found | Requested components/routes cannot be resolved. | Generate partial output for resolvable targets and list missing ones. |
| Playwright template generation fails | Template writer or parser errors during spec generation. | Retry once with simplified templates, then emit manual-only plan. |
| Manual plan omitted unintentionally | `includeManual=true` but manual artifact path is missing. | Mark generation partial and regenerate only the manual plan. |

**Token Budget:** 5–15K typical.
**Confidence Output:** Influenced by component metadata completeness, route discovery quality, and whether manual + automated outputs were both generated.

#### A.14 — a11y-navigator

**Type:** Sub-agent
**Called by:** `a11y-audit` and `sl-ds-impl` Step 5.
**Invokes:** Route analyzers, keyboard journey heuristics, focus-order checks, and DOM/ARIA metadata readers.

**Input Schema:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": [
    "routes",
    "userFlows"
  ],
  "properties": {
    "routes": {
      "type": "array",
      "description": "Routes included in navigation analysis.",
      "items": {
        "type": "string",
        "description": "Route path."
      }
    },
    "userFlows": {
      "type": "array",
      "description": "User journey definitions to analyze.",
      "items": {
        "type": "object",
        "description": "Single user flow definition."
      }
    }
  },
  "additionalProperties": false
}
```

**Output Schema:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": [
    "reportPath",
    "journeys",
    "blockers",
    "confidence"
  ],
  "properties": {
    "reportPath": {
      "type": "string",
      "description": "Path to the navigation analysis report."
    },
    "journeys": {
      "type": "integer",
      "description": "Number of journeys analyzed."
    },
    "blockers": {
      "type": "integer",
      "description": "Number of journey blockers or focus traps found."
    },
    "confidence": {
      "type": "number",
      "minimum": 0,
      "maximum": 100,
      "description": "Confidence in route coverage and keyboard journey correctness."
    }
  },
  "additionalProperties": false
}
```

**Tools/Commands Used:**
- Route graph readers
- Keyboard tab-order heuristics
- DOM order vs visual order checks
- Focus trap and context restoration rules

**Failure Modes:**
| Failure | Detection | Recovery |
| --- | --- | --- |
| Route unreachable | Configured route cannot be loaded or resolved. | Skip the route, mark report partial, and lower confidence. |
| Incomplete user flow definition | Flow lacks start/end states or key actions. | Infer missing edges when possible; otherwise mark the flow incomplete. |
| Focus order ambiguous | DOM order and visual order disagree without a deterministic mapping. | Report the ambiguity and require manual review. |

**Token Budget:** 4–8K typical.
**Confidence Output:** Based on successful route discovery, determinable tab order, and complete user-flow definitions.

#### A.15 — a11y-review

**Type:** Sub-agent
**Called by:** `sl-ds-impl` at Steps 1 and 2, plus `sl-ds-figma`/`sl-ds-mapper` as needed.
**Invokes:** Design-note generators, component-choice heuristics, and contrast/touch-target checks.

**Input Schema:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": [
    "componentTree",
    "step"
  ],
  "properties": {
    "componentTree": {
      "type": "string",
      "description": "Path to `component-tree.json` or step-specific derivative input."
    },
    "step": {
      "type": "integer",
      "enum": [
        1,
        2
      ],
      "description": "Pipeline step being reviewed."
    }
  },
  "additionalProperties": false
}
```

**Output Schema:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": [
    "notesPath",
    "requirementsPath",
    "issues",
    "confidence"
  ],
  "properties": {
    "notesPath": {
      "type": "string",
      "description": "Path to design-level accessibility notes."
    },
    "requirementsPath": {
      "type": "string",
      "description": "Path to machine-readable accessibility requirements."
    },
    "issues": {
      "type": "integer",
      "description": "Number of issues or requirements captured."
    },
    "confidence": {
      "type": "number",
      "minimum": 0,
      "maximum": 100,
      "description": "Confidence in design/code preflight accessibility review."
    }
  },
  "additionalProperties": false
}
```

**Tools/Commands Used:**
- Contrast and touch-target heuristics
- SLDS component accessibility knowledge
- Design-note and requirements artifact writers

**Failure Modes:**
| Failure | Detection | Recovery |
| --- | --- | --- |
| Component tree missing | Input artifact path missing or invalid. | Abort review and require upstream artifact regeneration. |
| Step mismatch | Unsupported step number or wrong artifact type passed in. | Fail fast with a contract error. |
| Conflicting recommendations | Design review and component-choice review disagree on the best fix. | Emit both recommendations, lower confidence, and let the orchestrator choose conservatively. |

**Token Budget:** 2–4K per invocation.
**Confidence Output:** Determined by artifact completeness, clarity of design issues, and compatibility of recommended SLDS patterns.

## 18. Pipeline Artifact Schemas (Appendix B)

The schemas below are the implementation contracts for artifacts exchanged between agents. All
artifacts are JSON files stored in the run namespace unless explicitly marked as shared cache.

#### B.1 — component-tree.json

Output of `sl-ds-figma` (Step 1).

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://sl-design-system.dev/schemas/component-tree.schema.json",
  "title": "component-tree.json",
  "description": "Structured Figma interpretation artifact produced by `sl-ds-figma` in Step 1.",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "run_id",
    "generated_at",
    "mode",
    "source",
    "pages",
    "shared_components",
    "summary",
    "confidence"
  ],
  "properties": {
    "schema_version": {
      "type": "string",
      "const": "2.0",
      "description": "Artifact schema version."
    },
    "run_id": {
      "type": "string",
      "description": "Run that produced the artifact."
    },
    "generated_at": {
      "type": "string",
      "format": "date-time",
      "description": "UTC generation timestamp."
    },
    "mode": {
      "type": "string",
      "enum": [
        "full",
        "structure-only"
      ],
      "description": "Interpretation depth used by `sl-ds-figma`."
    },
    "source": {
      "type": "object",
      "description": "Figma source metadata used for cache identity and provenance.",
      "additionalProperties": false,
      "required": [
        "figma_url",
        "file_id",
        "node_ids",
        "last_modified",
        "cache_key"
      ],
      "properties": {
        "figma_url": {
          "type": "string",
          "description": "Original Figma URL provided to the run."
        },
        "file_id": {
          "type": "string",
          "description": "Resolved Figma file ID."
        },
        "node_ids": {
          "type": "array",
          "description": "Root node IDs processed in this run.",
          "items": {
            "type": "string",
            "description": "Figma node ID."
          }
        },
        "last_modified": {
          "type": "string",
          "format": "date-time",
          "description": "Figma `lastModified` timestamp used for cache validation."
        },
        "cache_key": {
          "type": "string",
          "description": "Stable cache key used in `.sl-ds-cache/figma/`."
        }
      }
    },
    "pages": {
      "type": "array",
      "description": "Screen-level interpretation results.",
      "items": {
        "type": "object",
        "description": "One interpreted screen or frame.",
        "additionalProperties": false,
        "required": [
          "id",
          "name",
          "frame_id",
          "layout",
          "nodes",
          "uses_shared"
        ],
        "properties": {
          "id": {
            "type": "string",
            "description": "Stable page identifier within the artifact."
          },
          "name": {
            "type": "string",
            "description": "Human-readable page or frame name."
          },
          "frame_id": {
            "type": "string",
            "description": "Figma frame node ID."
          },
          "layout": {
            "type": "object",
            "description": "Top-level frame layout metadata.",
            "additionalProperties": false,
            "required": [
              "width",
              "height",
              "layout_mode",
              "spacing_unit"
            ],
            "properties": {
              "width": {
                "type": "number",
                "description": "Frame width in pixels."
              },
              "height": {
                "type": "number",
                "description": "Frame height in pixels."
              },
              "layout_mode": {
                "type": "string",
                "description": "Primary Figma layout mode."
              },
              "spacing_unit": {
                "type": "number",
                "description": "Detected base spacing increment."
              }
            }
          },
          "nodes": {
            "type": "array",
            "description": "Interpreted component and layout nodes in reading order.",
            "items": {
              "type": "object",
              "description": "Single interpreted node.",
              "additionalProperties": false,
              "required": [
                "id",
                "name",
                "kind",
                "path",
                "bounds",
                "layout",
                "styles",
                "children",
                "confidence"
              ],
              "properties": {
                "id": {
                  "type": "string",
                  "description": "Node identifier from Figma."
                },
                "name": {
                  "type": "string",
                  "description": "Layer/component name from Figma."
                },
                "kind": {
                  "type": "string",
                  "description": "Normalized kind such as frame, instance, text, or vector."
                },
                "path": {
                  "type": "string",
                  "description": "Logical path from page root to this node."
                },
                "bounds": {
                  "type": "object",
                  "description": "Absolute position and size.",
                  "additionalProperties": false,
                  "required": [
                    "x",
                    "y",
                    "width",
                    "height"
                  ],
                  "properties": {
                    "x": {
                      "type": "number",
                      "description": "Left offset in pixels."
                    },
                    "y": {
                      "type": "number",
                      "description": "Top offset in pixels."
                    },
                    "width": {
                      "type": "number",
                      "description": "Width in pixels."
                    },
                    "height": {
                      "type": "number",
                      "description": "Height in pixels."
                    }
                  }
                },
                "layout": {
                  "type": "object",
                  "description": "Layout semantics detected for the node.",
                  "additionalProperties": false,
                  "required": [
                    "display",
                    "direction",
                    "gap",
                    "padding"
                  ],
                  "properties": {
                    "display": {
                      "type": "string",
                      "description": "Normalized display intent such as flex, grid, or block."
                    },
                    "direction": {
                      "type": "string",
                      "description": "Main layout direction."
                    },
                    "gap": {
                      "type": "number",
                      "description": "Primary gap between children."
                    },
                    "padding": {
                      "type": "array",
                      "description": "Padding as `[top,right,bottom,left]`.",
                      "items": {
                        "type": "number",
                        "description": "Padding value."
                      },
                      "minItems": 4,
                      "maxItems": 4
                    }
                  }
                },
                "styles": {
                  "type": "object",
                  "description": "High-level style metadata extracted without raw design payloads.",
                  "additionalProperties": false,
                  "required": [
                    "text_style",
                    "fills",
                    "strokes",
                    "effects"
                  ],
                  "properties": {
                    "text_style": {
                      "type": "string",
                      "description": "Named text style or inferred typography token."
                    },
                    "fills": {
                      "type": "array",
                      "description": "Fill color/style descriptors.",
                      "items": {
                        "type": "string",
                        "description": "Fill descriptor."
                      }
                    },
                    "strokes": {
                      "type": "array",
                      "description": "Stroke descriptors.",
                      "items": {
                        "type": "string",
                        "description": "Stroke descriptor."
                      }
                    },
                    "effects": {
                      "type": "array",
                      "description": "Effect descriptors such as shadows or blur.",
                      "items": {
                        "type": "string",
                        "description": "Effect descriptor."
                      }
                    }
                  }
                },
                "variant_hints": {
                  "type": "array",
                  "description": "Variant hints parsed from component naming conventions.",
                  "items": {
                    "type": "string",
                    "description": "Variant hint string."
                  }
                },
                "text_content": {
                  "type": "string",
                  "description": "Visible text content when the node is textual.",
                  "default": ""
                },
                "action_hint": {
                  "type": "string",
                  "description": "Interaction hint such as submit, dismiss, navigate, or expand.",
                  "default": ""
                },
                "children": {
                  "type": "array",
                  "description": "Child node IDs referenced by this node.",
                  "items": {
                    "type": "string",
                    "description": "Child node ID."
                  }
                },
                "confidence": {
                  "type": "number",
                  "minimum": 0,
                  "maximum": 100,
                  "description": "Confidence in the node interpretation."
                }
              }
            }
          },
          "uses_shared": {
            "type": "array",
            "description": "Shared component IDs referenced by this page.",
            "items": {
              "type": "string",
              "description": "Shared component identifier."
            }
          }
        }
      }
    },
    "shared_components": {
      "type": "array",
      "description": "Deduplicated reusable components discovered across pages.",
      "items": {
        "type": "object",
        "description": "Shared component definition.",
        "additionalProperties": false,
        "required": [
          "id",
          "name",
          "source_node_ids",
          "variant_hints",
          "confidence"
        ],
        "properties": {
          "id": {
            "type": "string",
            "description": "Stable shared-component identifier."
          },
          "name": {
            "type": "string",
            "description": "Shared component display name."
          },
          "source_node_ids": {
            "type": "array",
            "description": "Node IDs that collapsed into this shared component.",
            "items": {
              "type": "string",
              "description": "Figma node ID."
            }
          },
          "variant_hints": {
            "type": "array",
            "description": "Variant hints common across all instances.",
            "items": {
              "type": "string",
              "description": "Variant hint."
            }
          },
          "confidence": {
            "type": "number",
            "minimum": 0,
            "maximum": 100,
            "description": "Confidence that the deduplicated instances are semantically the same component."
          }
        }
      }
    },
    "summary": {
      "type": "object",
      "description": "Operational summary used by downstream agents and telemetry.",
      "additionalProperties": false,
      "required": [
        "screen_count",
        "shared_component_count",
        "node_count",
        "figma_api_calls",
        "figma_tokens_consumed"
      ],
      "properties": {
        "screen_count": {
          "type": "integer",
          "description": "Number of pages/frames processed."
        },
        "shared_component_count": {
          "type": "integer",
          "description": "Number of shared components identified."
        },
        "node_count": {
          "type": "integer",
          "description": "Total interpreted nodes across all pages."
        },
        "figma_api_calls": {
          "type": "integer",
          "description": "Number of Figma API calls used."
        },
        "figma_tokens_consumed": {
          "type": "integer",
          "description": "Estimated token cost attributable to Figma reads."
        }
      }
    },
    "accessibility_notes_path": {
      "type": "string",
      "description": "Optional path to the `a11y-review` notes created from the design.",
      "default": ""
    },
    "warnings": {
      "type": "array",
      "description": "Interpretation warnings.",
      "items": {
        "type": "string",
        "description": "Warning message."
      }
    },
    "confidence": {
      "type": "object",
      "description": "Aggregate confidence and rationale.",
      "additionalProperties": false,
      "required": [
        "score",
        "reasons"
      ],
      "properties": {
        "score": {
          "type": "number",
          "minimum": 0,
          "maximum": 100,
          "description": "Overall interpretation confidence."
        },
        "reasons": {
          "type": "array",
          "description": "Rationales supporting the aggregate confidence.",
          "items": {
            "type": "string",
            "description": "Confidence rationale."
          }
        }
      }
    }
  }
}
```

#### B.2 — slds-tree.json

Output of `sl-ds-mapper` (Step 2).

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://sl-design-system.dev/schemas/slds-tree.schema.json",
  "title": "slds-tree.json",
  "description": "Normalized SLDS component tree produced by `sl-ds-mapper` in Step 2.",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "run_id",
    "generated_at",
    "cem_version",
    "source_artifact",
    "pages",
    "unmapped_nodes",
    "summary",
    "confidence"
  ],
  "properties": {
    "schema_version": {
      "type": "string",
      "const": "2.0",
      "description": "Artifact schema version."
    },
    "run_id": {
      "type": "string",
      "description": "Run that produced the artifact."
    },
    "generated_at": {
      "type": "string",
      "format": "date-time",
      "description": "UTC generation timestamp."
    },
    "cem_version": {
      "type": "string",
      "description": "SLDS API/CEM version used for mapping."
    },
    "source_artifact": {
      "type": "string",
      "description": "Path to the `component-tree.json` input."
    },
    "pages": {
      "type": "array",
      "description": "Mapped pages/screens.",
      "items": {
        "type": "object",
        "description": "One mapped page.",
        "additionalProperties": false,
        "required": [
          "id",
          "name",
          "components"
        ],
        "properties": {
          "id": {
            "type": "string",
            "description": "Page identifier copied from the source artifact."
          },
          "name": {
            "type": "string",
            "description": "Page name."
          },
          "components": {
            "type": "array",
            "description": "Mapped SLDS component nodes in page order.",
            "items": {
              "type": "object",
              "description": "One SLDS-mapped node.",
              "additionalProperties": false,
              "required": [
                "source_node_id",
                "slds_tag",
                "package",
                "props",
                "slots",
                "children",
                "confidence"
              ],
              "properties": {
                "source_node_id": {
                  "type": "string",
                  "description": "Original Figma node ID."
                },
                "slds_tag": {
                  "type": "string",
                  "description": "Mapped custom element tag such as `sl-button`."
                },
                "package": {
                  "type": "string",
                  "description": "SLDS package name required for the component."
                },
                "wrapper": {
                  "type": "string",
                  "description": "Angular wrapper symbol when one exists.",
                  "default": ""
                },
                "status": {
                  "type": "string",
                  "description": "Stability status such as stable, preview, or draft."
                },
                "props": {
                  "type": "array",
                  "description": "Mapped property bindings.",
                  "items": {
                    "type": "object",
                    "description": "Single property binding.",
                    "additionalProperties": false,
                    "required": [
                      "name",
                      "value",
                      "source",
                      "valid"
                    ],
                    "properties": {
                      "name": {
                        "type": "string",
                        "description": "Property or attribute name."
                      },
                      "value": {
                        "description": "Mapped property value."
                      },
                      "source": {
                        "type": "string",
                        "description": "Why the value was chosen, such as variant hint or token match."
                      },
                      "valid": {
                        "type": "boolean",
                        "description": "Whether the property value is valid per the DS API contract."
                      }
                    }
                  }
                },
                "slots": {
                  "type": "array",
                  "description": "Mapped slot assignments.",
                  "items": {
                    "type": "object",
                    "description": "Single slot mapping.",
                    "additionalProperties": false,
                    "required": [
                      "name",
                      "content_type"
                    ],
                    "properties": {
                      "name": {
                        "type": "string",
                        "description": "Slot name; empty string denotes default slot."
                      },
                      "content_type": {
                        "type": "string",
                        "description": "Expected content type for the slot."
                      },
                      "source_node_ids": {
                        "type": "array",
                        "description": "Original Figma nodes contributing to this slot.",
                        "items": {
                          "type": "string",
                          "description": "Source node ID."
                        }
                      }
                    }
                  }
                },
                "tokens": {
                  "type": "array",
                  "description": "Design tokens required by the mapped node.",
                  "items": {
                    "type": "string",
                    "description": "Token name."
                  }
                },
                "children": {
                  "type": "array",
                  "description": "Child mapped component IDs or source node IDs.",
                  "items": {
                    "type": "string",
                    "description": "Child reference."
                  }
                },
                "a11y_requirements": {
                  "type": "array",
                  "description": "Accessibility requirements inherited from mapping or a11y review.",
                  "items": {
                    "type": "string",
                    "description": "Requirement summary."
                  }
                },
                "confidence": {
                  "type": "number",
                  "minimum": 0,
                  "maximum": 100,
                  "description": "Confidence in this specific node mapping."
                }
              }
            }
          }
        }
      }
    },
    "unmapped_nodes": {
      "type": "array",
      "description": "Nodes that could not be mapped confidently.",
      "items": {
        "type": "object",
        "description": "Unmapped node record.",
        "additionalProperties": false,
        "required": [
          "source_node_id",
          "name",
          "reason",
          "alternatives"
        ],
        "properties": {
          "source_node_id": {
            "type": "string",
            "description": "Original Figma node ID."
          },
          "name": {
            "type": "string",
            "description": "Original Figma node name."
          },
          "reason": {
            "type": "string",
            "description": "Why the node was not mapped."
          },
          "alternatives": {
            "type": "array",
            "description": "Candidate SLDS components considered.",
            "items": {
              "type": "string",
              "description": "Candidate component tag."
            }
          }
        }
      }
    },
    "summary": {
      "type": "object",
      "description": "Mapping summary and scoring inputs.",
      "additionalProperties": false,
      "required": [
        "total_nodes",
        "mapped_nodes",
        "unmapped_count",
        "draft_components_used"
      ],
      "properties": {
        "total_nodes": {
          "type": "integer",
          "description": "Total nodes considered for mapping."
        },
        "mapped_nodes": {
          "type": "integer",
          "description": "Nodes mapped to concrete SLDS components."
        },
        "unmapped_count": {
          "type": "integer",
          "description": "Nodes left unmapped."
        },
        "draft_components_used": {
          "type": "integer",
          "description": "Count of draft components referenced by the mapping."
        }
      }
    },
    "confidence": {
      "type": "object",
      "description": "Aggregate mapping confidence.",
      "additionalProperties": false,
      "required": [
        "score",
        "reasons"
      ],
      "properties": {
        "score": {
          "type": "number",
          "minimum": 0,
          "maximum": 100,
          "description": "Overall mapping confidence."
        },
        "reasons": {
          "type": "array",
          "description": "Rationales for the aggregate mapping score.",
          "items": {
            "type": "string",
            "description": "Confidence rationale."
          }
        }
      }
    }
  }
}
```

#### B.3 — composition-plan.json

Output of `sl-ds-compose` (Step 3).

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://sl-design-system.dev/schemas/composition-plan.schema.json",
  "title": "composition-plan.json",
  "description": "Architecture and integration plan produced by `sl-ds-compose` in Step 3.",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "run_id",
    "generated_at",
    "target_project",
    "source_artifact",
    "route_plan",
    "libraries",
    "components",
    "stores",
    "integration_steps",
    "test_plan",
    "confidence"
  ],
  "properties": {
    "schema_version": {
      "type": "string",
      "const": "2.0",
      "description": "Artifact schema version."
    },
    "run_id": {
      "type": "string",
      "description": "Run that produced the plan."
    },
    "generated_at": {
      "type": "string",
      "format": "date-time",
      "description": "UTC generation timestamp."
    },
    "target_project": {
      "type": "string",
      "description": "Primary NX project or app targeted by the implementation."
    },
    "source_artifact": {
      "type": "string",
      "description": "Path to the `slds-tree.json` input."
    },
    "route_plan": {
      "type": "array",
      "description": "Route entries to create or update.",
      "items": {
        "type": "object",
        "description": "Single route plan entry.",
        "additionalProperties": false,
        "required": [
          "path",
          "type",
          "component",
          "lazy",
          "library"
        ],
        "properties": {
          "path": {
            "type": "string",
            "description": "Route path segment."
          },
          "type": {
            "type": "string",
            "description": "Route type such as page, child-route, or dialog-route."
          },
          "component": {
            "type": "string",
            "description": "Component class intended for the route entry."
          },
          "lazy": {
            "type": "boolean",
            "description": "Whether the route should be lazy loaded."
          },
          "library": {
            "type": "string",
            "description": "NX library containing the route component."
          },
          "guards": {
            "type": "array",
            "description": "Guards required by the route.",
            "items": {
              "type": "string",
              "description": "Guard token or symbol."
            }
          }
        }
      }
    },
    "libraries": {
      "type": "array",
      "description": "Libraries or app areas affected by the implementation.",
      "items": {
        "type": "object",
        "description": "One library placement decision.",
        "additionalProperties": false,
        "required": [
          "name",
          "layer",
          "action"
        ],
        "properties": {
          "name": {
            "type": "string",
            "description": "NX project or library name."
          },
          "layer": {
            "type": "string",
            "description": "Architectural layer such as feature, ui, data-access, or shared."
          },
          "action": {
            "type": "string",
            "description": "Whether the library is created, updated, or reused."
          },
          "reason": {
            "type": "string",
            "description": "Why this placement was chosen."
          }
        }
      }
    },
    "components": {
      "type": "array",
      "description": "Component decomposition plan.",
      "items": {
        "type": "object",
        "description": "Single component implementation plan.",
        "additionalProperties": false,
        "required": [
          "name",
          "role",
          "library",
          "source_page",
          "inputs",
          "outputs"
        ],
        "properties": {
          "name": {
            "type": "string",
            "description": "Component class or file stem."
          },
          "role": {
            "type": "string",
            "description": "Component role such as smart, dumb, shared, or page."
          },
          "library": {
            "type": "string",
            "description": "Owning NX library."
          },
          "source_page": {
            "type": "string",
            "description": "Page/frame that motivated the component."
          },
          "inputs": {
            "type": "array",
            "description": "Public inputs planned for the component.",
            "items": {
              "type": "string",
              "description": "Input name."
            }
          },
          "outputs": {
            "type": "array",
            "description": "Public outputs/events planned for the component.",
            "items": {
              "type": "string",
              "description": "Output/event name."
            }
          },
          "dependencies": {
            "type": "array",
            "description": "Other components or services referenced by this component.",
            "items": {
              "type": "string",
              "description": "Dependency identifier."
            }
          }
        }
      }
    },
    "stores": {
      "type": "array",
      "description": "Store plan for stateful screens.",
      "items": {
        "type": "object",
        "description": "Single store plan entry.",
        "additionalProperties": false,
        "required": [
          "name",
          "model",
          "scope",
          "consumers"
        ],
        "properties": {
          "name": {
            "type": "string",
            "description": "Store class or file stem."
          },
          "model": {
            "type": "string",
            "description": "Store pattern such as SignalStore, local signals, or NgRx."
          },
          "scope": {
            "type": "string",
            "description": "Scope such as page, feature, or shared."
          },
          "consumers": {
            "type": "array",
            "description": "Components consuming the store.",
            "items": {
              "type": "string",
              "description": "Consumer component name."
            }
          },
          "state_shape": {
            "type": "array",
            "description": "Top-level state keys planned for the store.",
            "items": {
              "type": "string",
              "description": "State key name."
            }
          }
        }
      }
    },
    "integration_steps": {
      "type": "array",
      "description": "Ordered integration actions required after generation.",
      "items": {
        "type": "object",
        "description": "Single integration action.",
        "additionalProperties": false,
        "required": [
          "order",
          "action",
          "target",
          "blocking"
        ],
        "properties": {
          "order": {
            "type": "integer",
            "description": "Execution order of the action."
          },
          "action": {
            "type": "string",
            "description": "Action to perform, such as add-route or register-provider."
          },
          "target": {
            "type": "string",
            "description": "File or project target to modify."
          },
          "blocking": {
            "type": "boolean",
            "description": "Whether the action blocks progression to the next step."
          }
        }
      }
    },
    "test_plan": {
      "type": "object",
      "description": "Required automated and manual verification outputs.",
      "additionalProperties": false,
      "required": [
        "unit",
        "integration",
        "accessibility"
      ],
      "properties": {
        "unit": {
          "type": "array",
          "description": "Unit-test targets to generate.",
          "items": {
            "type": "string",
            "description": "Unit-test target."
          }
        },
        "integration": {
          "type": "array",
          "description": "Integration or route test targets.",
          "items": {
            "type": "string",
            "description": "Integration-test target."
          }
        },
        "accessibility": {
          "type": "array",
          "description": "Accessibility test targets or scenarios.",
          "items": {
            "type": "string",
            "description": "Accessibility test target."
          }
        }
      }
    },
    "warnings": {
      "type": "array",
      "description": "Composition warnings or assumptions.",
      "items": {
        "type": "string",
        "description": "Warning message."
      }
    },
    "confidence": {
      "type": "object",
      "description": "Aggregate composition confidence.",
      "additionalProperties": false,
      "required": [
        "score",
        "reasons"
      ],
      "properties": {
        "score": {
          "type": "number",
          "minimum": 0,
          "maximum": 100,
          "description": "Overall composition confidence."
        },
        "reasons": {
          "type": "array",
          "description": "Rationales behind the composition score.",
          "items": {
            "type": "string",
            "description": "Confidence rationale."
          }
        }
      }
    }
  }
}
```

#### B.4 — quality-report.json

Output of `sdl-quality` and related quality tools (Step 5/7).

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://sl-design-system.dev/schemas/quality-report.schema.json",
  "title": "quality-report.json",
  "description": "Quality gate artifact produced by `sdl-quality` and related tools in Step 5 or Step 7.",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "run_id",
    "generated_at",
    "step",
    "target_project",
    "verdict",
    "scores",
    "violations",
    "exceptions",
    "repair_cycles",
    "telemetry"
  ],
  "properties": {
    "schema_version": {
      "type": "string",
      "const": "2.0",
      "description": "Artifact schema version."
    },
    "run_id": {
      "type": "string",
      "description": "Run that produced the report."
    },
    "generated_at": {
      "type": "string",
      "format": "date-time",
      "description": "UTC generation timestamp."
    },
    "step": {
      "type": "integer",
      "enum": [
        5,
        7
      ],
      "description": "Pipeline gate step that produced the report."
    },
    "target_project": {
      "type": "string",
      "description": "Project or app evaluated by the gate."
    },
    "verdict": {
      "type": "string",
      "enum": [
        "pass",
        "fail",
        "partial",
        "needs_manual_review"
      ],
      "description": "Terminal verdict for the gate."
    },
    "scores": {
      "type": "object",
      "description": "Composite and group-level scoring outputs.",
      "additionalProperties": false,
      "required": [
        "composite",
        "architecture",
        "code_quality",
        "visual_fidelity",
        "accessibility",
        "ds_maintainability"
      ],
      "properties": {
        "composite": {
          "type": "number",
          "description": "Weighted composite score."
        },
        "architecture": {
          "type": "number",
          "description": "Architecture & decomposition score."
        },
        "code_quality": {
          "type": "number",
          "description": "Code quality score."
        },
        "visual_fidelity": {
          "type": "number",
          "description": "Visual fidelity score."
        },
        "accessibility": {
          "type": "number",
          "description": "Accessibility score."
        },
        "ds_maintainability": {
          "type": "number",
          "description": "Design-system and maintainability score."
        }
      }
    },
    "violations": {
      "type": "array",
      "description": "Blocking and non-blocking issues that influenced the score.",
      "items": {
        "type": "object",
        "description": "Single quality violation.",
        "additionalProperties": false,
        "required": [
          "tool",
          "rule",
          "severity",
          "message"
        ],
        "properties": {
          "tool": {
            "type": "string",
            "description": "Tool or agent that produced the violation."
          },
          "rule": {
            "type": "string",
            "description": "Rule identifier."
          },
          "severity": {
            "type": "string",
            "description": "Severity level."
          },
          "message": {
            "type": "string",
            "description": "Human-readable violation description."
          },
          "file": {
            "type": "string",
            "description": "Affected file path when applicable.",
            "default": ""
          },
          "line": {
            "type": "integer",
            "description": "Affected line number when applicable.",
            "default": 0
          },
          "fix_hint": {
            "type": "string",
            "description": "Preferred remediation hint.",
            "default": ""
          }
        }
      }
    },
    "exceptions": {
      "type": "array",
      "description": "Approved quality exceptions applied during scoring.",
      "items": {
        "type": "object",
        "description": "Single exception entry.",
        "additionalProperties": false,
        "required": [
          "type",
          "justification",
          "approved"
        ],
        "properties": {
          "type": {
            "type": "string",
            "description": "Exception taxonomy type."
          },
          "justification": {
            "type": "string",
            "description": "Why the exception was applied."
          },
          "approved": {
            "type": "boolean",
            "description": "Whether the exception was approved automatically."
          },
          "source": {
            "type": "string",
            "description": "Evidence used to approve the exception.",
            "default": ""
          }
        }
      }
    },
    "repair_cycles": {
      "type": "object",
      "description": "Repair-cycle accounting.",
      "additionalProperties": false,
      "required": [
        "used",
        "max",
        "successful_repairs"
      ],
      "properties": {
        "used": {
          "type": "integer",
          "description": "Repair cycles executed before this report."
        },
        "max": {
          "type": "integer",
          "description": "Configured maximum repair cycles."
        },
        "successful_repairs": {
          "type": "integer",
          "description": "Issues successfully fixed across executed cycles."
        }
      }
    },
    "telemetry": {
      "type": "object",
      "description": "Run-level metrics relevant to the quality gate.",
      "additionalProperties": false,
      "required": [
        "quality_score_initial",
        "quality_score_final",
        "repair_success_rate"
      ],
      "properties": {
        "quality_score_initial": {
          "type": "number",
          "description": "Composite score before repairs."
        },
        "quality_score_final": {
          "type": "number",
          "description": "Composite score at report generation."
        },
        "repair_success_rate": {
          "type": "number",
          "description": "Share of attempted repairs that succeeded."
        }
      }
    },
    "artifacts": {
      "type": "array",
      "description": "Supporting report artifact paths.",
      "items": {
        "type": "string",
        "description": "Artifact path."
      }
    }
  }
}
```

#### B.5 — pipeline-state.json

Run-state file used for resume and rollback hardening.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://sl-design-system.dev/schemas/pipeline-state.schema.json",
  "title": "pipeline-state.json",
  "description": "Resume and rollback state file for `sl-ds-impl` and other orchestrated runs.",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "run_id",
    "started_at",
    "config_snapshot",
    "git_state",
    "last_completed_step",
    "artifacts",
    "quality_scores",
    "repair_cycles",
    "confidence_scores",
    "step_commits",
    "lock"
  ],
  "properties": {
    "schema_version": {
      "type": "string",
      "const": "2.0",
      "description": "State schema version required for resume compatibility."
    },
    "run_id": {
      "type": "string",
      "description": "Run identifier."
    },
    "started_at": {
      "type": "string",
      "format": "date-time",
      "description": "UTC timestamp when the run started."
    },
    "updated_at": {
      "type": "string",
      "format": "date-time",
      "description": "UTC timestamp when the state file was last updated.",
      "default": "1970-01-01T00:00:00Z"
    },
    "status": {
      "type": "string",
      "description": "Current run status such as running, failed, completed, or aborted.",
      "default": "running"
    },
    "config_snapshot": {
      "type": "object",
      "description": "Configuration values that influence mapping, generation, and scoring.",
      "additionalProperties": false,
      "required": [
        "ds_version",
        "angular_version",
        "theme",
        "wcag_standard"
      ],
      "properties": {
        "ds_version": {
          "type": "string",
          "description": "Resolved SLDS version for this run."
        },
        "angular_version": {
          "type": "string",
          "description": "Resolved Angular version for this run."
        },
        "theme": {
          "type": "string",
          "description": "Resolved theme for token mapping and styling."
        },
        "wcag_standard": {
          "type": "string",
          "description": "Accessibility standard applied during the run."
        }
      }
    },
    "git_state": {
      "type": "object",
      "description": "Git metadata required for safe resume and rollback.",
      "additionalProperties": false,
      "required": [
        "branch",
        "head_sha",
        "is_dirty",
        "base_branch"
      ],
      "properties": {
        "branch": {
          "type": "string",
          "description": "Source branch from which the run started."
        },
        "run_branch": {
          "type": "string",
          "description": "Execution branch created for the run.",
          "default": ""
        },
        "head_sha": {
          "type": "string",
          "description": "HEAD SHA at the time the state snapshot was written."
        },
        "is_dirty": {
          "type": "boolean",
          "description": "Whether the worktree was dirty when the snapshot was taken."
        },
        "base_branch": {
          "type": "string",
          "description": "Base branch used for PR or rebase operations."
        }
      }
    },
    "active_step": {
      "type": "integer",
      "minimum": 0,
      "maximum": 7,
      "description": "Step currently running when the snapshot was written.",
      "default": 0
    },
    "last_completed_step": {
      "type": "integer",
      "minimum": 0,
      "maximum": 7,
      "description": "Highest fully completed step."
    },
    "artifacts": {
      "type": "object",
      "description": "Artifact registry keyed by logical artifact name.",
      "additionalProperties": {
        "type": "object",
        "description": "Single artifact registry entry.",
        "additionalProperties": false,
        "required": [
          "path",
          "checksum",
          "generated_at"
        ],
        "properties": {
          "path": {
            "type": "string",
            "description": "Artifact path."
          },
          "checksum": {
            "type": "string",
            "description": "SHA-256 checksum prefixed with `sha256:`."
          },
          "generated_at": {
            "type": "string",
            "format": "date-time",
            "description": "UTC timestamp when the artifact was produced."
          },
          "producer_step": {
            "type": "integer",
            "minimum": 1,
            "maximum": 7,
            "description": "Step that produced the artifact.",
            "default": 1
          }
        }
      }
    },
    "quality_scores": {
      "type": "object",
      "description": "Latest quality score snapshot.",
      "additionalProperties": {
        "type": "number",
        "description": "Named score value."
      }
    },
    "repair_cycles": {
      "type": "object",
      "description": "Repair-cycle usage tracking.",
      "additionalProperties": false,
      "required": [
        "used",
        "max"
      ],
      "properties": {
        "used": {
          "type": "integer",
          "description": "Repair cycles used so far."
        },
        "max": {
          "type": "integer",
          "description": "Maximum repair cycles allowed."
        }
      }
    },
    "confidence_scores": {
      "type": "object",
      "description": "Per-step or per-agent confidence snapshots.",
      "additionalProperties": {
        "type": "number",
        "description": "Confidence score between 0 and 100."
      }
    },
    "step_commits": {
      "type": "object",
      "description": "Git commit SHAs captured after each successful step.",
      "additionalProperties": {
        "type": "string",
        "description": "Git SHA for the step commit."
      }
    },
    "lock": {
      "type": "object",
      "description": "Lock ownership snapshot captured in state.",
      "additionalProperties": false,
      "required": [
        "pid",
        "hostname",
        "acquired_at"
      ],
      "properties": {
        "pid": {
          "type": "integer",
          "description": "Process ID that owns the lock."
        },
        "hostname": {
          "type": "string",
          "description": "Machine hostname that owns the lock."
        },
        "acquired_at": {
          "type": "string",
          "format": "date-time",
          "description": "UTC timestamp when the lock was acquired."
        },
        "heartbeat_at": {
          "type": "string",
          "format": "date-time",
          "description": "UTC timestamp of the last observed heartbeat.",
          "default": "1970-01-01T00:00:00Z"
        }
      }
    },
    "warnings": {
      "type": "array",
      "description": "Resume or runtime warnings attached to the run.",
      "items": {
        "type": "string",
        "description": "Warning message."
      }
    }
  }
}
```

---

*Document version: 1.1*  
*Supersedes: AGENT_ARCHITECTURE.md (v1), AGENT_ARCHITECTURE_V2.md (v2), AGENT_ARCHITECTURE_V3.md (v3), ARCHITECTURE_REVIEW.md*  
*Supplements: QUALITY_METRICS.md, QUALITY_GROUPS.md, QUALITY_EXCEPTIONS.md*  
*Next step: Write individual agent definition files using this document as specification*
