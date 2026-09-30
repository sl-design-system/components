---
topic: model-routing
applies_to: [sl-ds, sl-ds-setup, sl-ds-layout, sl-ds-tokens, sl-ds-plan, sl-ds-implement, sl-ds-verify, sl-ds-update, sl-ds-audit]
last_updated: 2026-06-09
---

# Model Routing — Haiku / Sonnet / Opus

> **Purpose:** Cost discipline. Most skills should NOT run on Opus by default — only orchestration and high-stakes design decisions do. This file is the matrix.

## 1. The tier model

| Tier | Model | Cost relative | Strength | Use for |
|---|---|---|---|---|
| Tier 1 — cheap | **Haiku** | ~$0.25 / 1M input | Fast, follows clear rules | Routing, dedup, simple Q&A, file existence checks, "which skill next?" decisions |
| Tier 2 — workhorse | **Sonnet** | ~$3 / 1M input | Code generation, careful sub-tasks with clean context | Token extraction, code generation, build/lint, audits, geometric verify |
| Tier 3 — premium | **Opus** | ~$15 / 1M input | Architectural reasoning, ambiguity handling, multi-step planning | Orchestration of full flow, architecture decisions, Figma-diff reconciliation |

## 2. Per-skill assignment

| Skill | Primary model | Sub-agents | Why |
|---|---|---|---|
| `sl-ds` (router) | **Haiku** | — | Reads state files, runs decision tree, asks ≤3 questions. No code, no reasoning beyond dispatch. |
| `sl-ds-help` | **Haiku** | — | Static catalog presentation. Possibly 1 question to narrow intent. |
| `sl-ds-setup` | **Sonnet** | — | Detection scripts + write `.sl-ds-config.yaml`. Mechanical but needs codebase grep + decisions. |
| `sl-ds-layout` | **Opus** | Sonnet (Figma metadata fetch) | Multi-screen analysis, shared-shell decisions — high-leverage architectural call. |
| `sl-ds-tokens` | **Sonnet** | — | Repeated `get_variable_defs` calls + verification. Mechanical, high-volume. |
| `sl-ds-plan` | **Opus** | Sonnet (codebase scan) | Component structure, data approach, DOM nesting — architectural. |
| `sl-ds-implement` | **Sonnet** | — | Code synthesis from verified inputs. Sonnet handles framework idiom well. |
| `sl-ds-verify` | **Sonnet** | Sonnet (build, geometric) | Build/lint/geometric — mechanical, repeatable. |
| `sl-ds-update` | **Opus** | Sonnet (diff compute) | Figma-vs-cache diff is architectural — what to overwrite vs preserve. |
| `sl-ds-audit` | **Sonnet** | — | Read-only check against rules. No synthesis needed. |

## 3. Why router on Haiku (specifically)

`/sl-ds` (the router) is the user's entry point when they don't know which skill they need. It must be cheap because it's invoked often, possibly multiple times per session. Haiku's job:

1. Read `.sl-ds-cache/sl-ds-impl/pipeline-state.json` (if exists)
2. Read `context/foundation/sl-ds-decisions/*.md` (if exist)
3. Read `git status` summary
4. Match user's natural-language intent against `description.USE_WHEN` of every `sl-ds-*` skill
5. Output: one of {dispatch to skill X, ask 1-3 clarifying questions, refuse with "/sl-ds-setup first"}

This is pattern-matching + state inspection. Opus is overkill; Sonnet is wasteful when invoked dozens of times per workflow.

## 4. Sub-agent spawning contract

When a skill spawns sub-agents (`Agent(subagent_type: ..., model: ...)`):

1. **Always pass `model:` AND `subagent_type:` explicitly** — never inherit. Both decisions matter independently:
   - **`model:`** — economic tier (haiku/sonnet/opus); answers "how smart"
   - **`subagent_type:`** — cognitive task type (`Explore` | `general-purpose`); answers "what kind of work"
2. **Sub-agents get clean context** — pass only the artifacts they need (paths, not full file contents), let the sub-agent read.
3. **Sub-agent returns minimal output** — the orchestrator parses and decides. Don't have sub-agents emit prose for the user; emit structured JSON.
4. **Parallel where independent** — if two sub-agents have no data dependency, spawn in parallel.

### 4.1 `subagent_type` as a separate decision from `model`

`subagent_type` was introduced in schema v1.1 (frontmatter required v1.2) — it splits the cognitive task type from the model tier:

| `subagent_type` | Use for | Why it matters |
|---|---|---|
| **`Explore`** | Fast file/grep search, "find files matching pattern", "list which files import X" | 3-5× cheaper than general-purpose for pure file discovery; optimized for read-only codebase exploration |
| **`general-purpose`** | Deep multi-step reasoning, calling external tools (Figma MCP), writing files, synthesizing decisions | Default; mandatory when sub-agent writes files or calls external APIs |

**Concrete examples from Sanoma Learning DS skills:**

| Sub-agent | `subagent_type` | `model` | Rationale |
|---|---|---|---|
| `sl-ds-setup/codebase-scanner` | **Explore** | sonnet | Pure grep across `<targetScope>/src/` for patterns — file discovery, no synthesis |
| `sl-ds-audit/code-scanner` | **Explore** | sonnet | Grep across code for fe-standards compliance — same shape |
| `sl-ds-tokens/token-extractor` | general-purpose | sonnet | Calls Figma MCP (`get_variable_defs`), writes JSON output |
| `sl-ds-plan/sl-ds-component-mapper` | general-purpose | sonnet | Calls `search_design_system` (API), produces decisions |
| `sl-ds-implement/file-generator` | general-purpose | sonnet | Writes code files (external mutation) |
| `sl-ds/state-detector` | general-purpose | **haiku** | Reads known files, light JSON aggregation — Haiku cost over Explore overhead |

**Anti-pattern:** declaring `general-purpose` for a sub-agent that just runs `grep` across files — wasting 3-5× the cost. The validator (`validate-skill.js`) warns when `subagent_type` is missing (will become error in v1.3).

Example (in `sl-ds-setup` SKILL.md frontmatter):

```yaml
sub_agents:
  - name: codebase-scanner
    subagent_type: Explore       # ← cognitive task: pure file/grep discovery
    model: sonnet                # ← economic tier: workhorse for code review
    purpose: Grep patterns across <targetScope>/src/ for state mgmt + DS usage + i18n + structure
```

### 4.2 Parallel sub-agent example

```
Spawn parallel:
  - Agent(subagent_type: Explore, model: sonnet) — find existing token files in codebase
  - Agent(subagent_type: general-purpose, model: sonnet) — call get_variable_defs across all node types

Both return JSON; orchestrator merges.
```

The two sub-agents differ in `subagent_type` because their tasks differ in nature (file search vs MCP API + reasoning), even though both run on the same model tier.

## 5. Cost guardrails

Each skill declares `token_budget` in frontmatter (e.g. `"5-15K"`). This is a soft budget — if a sub-agent exceeds, the orchestrator MUST:

1. Log the overrun
2. If overrun >50% over high bound → STOP and surface to user (likely a scope-creep bug)
3. If sub-agent loops (e.g. extract retried >3x) → hard gate, fail with diagnostic

`.agents/.sl-ds-config.yaml` → `pipeline.repair_token_budget: 30000` is the per-repair-loop cap.

## 6. When to escalate model mid-skill

A `sl-ds-*` skill MAY escalate from its primary model to Opus for a specific sub-task if:

- The sub-task is ambiguous in a way the primary model can't resolve
- AND the cost is bounded (one shot, not a loop)
- AND it's documented in the skill's `## Workflow` step

Example: `sl-ds-implement` runs on Sonnet, but for resolving a tricky component DOM nesting (when `architecture.json` says "ambiguous"), it may spawn one Opus sub-agent for that decision.

Never silently. Always documented in the skill spec.

## 7. Anti-patterns

- ❌ "Just use Opus for everything to be safe" — defeats the whole point
- ❌ Letting sub-agents inherit model from parent — explicit beats implicit
- ❌ Running `sl-ds-tokens` on Opus because "tokens matter" — they matter but the work is mechanical, Sonnet is correct
- ❌ Running `/sl-ds` router on Sonnet because "matching is important" — Haiku is calibrated for this; if it fails, the router design is wrong, not the model choice
- ❌ Spawning Opus sub-agents from within Haiku skills (cost inversion — Haiku orchestrator runs many short prompts, Opus sub-agents cost more than the rest of the run)

## 8. How users override

Edge cases come up. User can override per-invocation:

```
/sl-ds-implement --model=opus           ← force escalation
/sl-ds --model=sonnet                  ← force router precision (rarely needed)
```

This is a runtime override; skill files always declare their **default** model.

## 9. Pricing snapshot (for reference, may drift)

| Model | Input | Output |
|---|---|---|
| Haiku 4.5 | $0.25 / MTok | $1.25 / MTok |
| Sonnet 4.6 | $3 / MTok | $15 / MTok |
| Opus 4.7 | $15 / MTok | $75 / MTok |

Source: Anthropic public pricing as of 2026-06-09. The relative tier is what matters; exact numbers will move.
