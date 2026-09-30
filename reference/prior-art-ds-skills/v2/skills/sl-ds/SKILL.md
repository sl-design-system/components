---
name: sl-ds
description: |
  USE WHEN: user says "sl-ds", "design system", "co dalej z designem", "zacznij od designu", "jakiego skilla użyć", or invokes /sl-ds without specifying a sub-skill, or provides a Figma URL with intent to do anything DS-related but unsure which step.
  DOES: Detect current DS pipeline state, match user intent, dispatch to the right sl-ds-* skill or ask 1-3 structured questions if ambiguous.
  NEVER USE WHEN: user explicitly invokes a specific sub-skill (e.g. /sl-ds-tokens, /sl-ds-implement) — they already know what they want.
version: 1.1.0
model: haiku
tags: [sl-ds, router, dispatch, state-detection]
next:
  on_success: [sl-ds-setup, sl-ds-layout, sl-ds-tokens, sl-ds-plan, sl-ds-implement, sl-ds-verify, sl-ds-update, sl-ds-audit, sl-ds-help]
  on_failure: [sl-ds-help]
  related: [sl-ds-help]
requires:
  artifacts: []
  skills_completed: []
produces:
  artifacts: [.sl-ds-cache/sl-ds-router/last-decision.json]
  decisions: []
cache:
  invalidate_on: [figma_lastModified, .sl-ds-config.yaml, package.json]
  reuse_if: []
token_budget: "1-5K"
sub_agents:
  - name: state-detector
    subagent_type: general-purpose
    model: haiku
    purpose: Read filesystem state, parse pipeline-state.json, return JSON state summary
  - name: intent-matcher
    subagent_type: general-purpose
    model: haiku
    purpose: Match user's $ARGUMENTS against sl-ds-* skill tags + description.USE_WHEN
fe_standards_consulted:
  primary: []
  rule_ids: []
---

# DS Router — Auto-dispatch to the Right Skill

## Purpose

Cheap Haiku entry point that reads filesystem state, matches user intent against the skill catalog, and dispatches. The whole skill is one decision tree; details below are operational, not deliberative.

## When to use

- User invokes `/sl-ds` with no clear sub-skill — needs guidance
- User pastes a Figma URL but doesn't say what to do with it
- Resume scenario: pipeline-state.json shows incomplete work
- After one skill finishes and the user asks "what now?"

## When NOT to use

See `description.NEVER USE WHEN` — same content, not restated here.

## Preconditions

None. `/sl-ds` is the entry point; it MUST work on a virgin project. First action may be a STOP+redirect to `/sl-ds-setup`, but that happens after state detection, not before.

## Inputs

**`$ARGUMENTS`:** free-text intent + optional Figma URL + optional screen name. All optional.

**Auto-detected:** `.sl-ds-config.yaml`, `.sl-ds-cache/sl-ds-impl/pipeline-state.json`, `context/foundation/sl-ds-decisions/*.md`, `package.json` framework deps, `git status --porcelain`.

## Workflow

### Step 1 — Spawn state-detector (parallel with Step 2)

`Agent(subagent_type: "general-purpose", model: "haiku")` — see [`references/state-detection.md`](references/state-detection.md) for bash commands + JSON schema.

**Sub-agent inputs:** workspace root path; reference to state-detection.md.

**Sub-agent output schema** (inline contract; full spec in state-detection.md §4):

```json
{
  "schemaVersion": "1.0.0",
  "configExists": true|false,
  "configFramework": "angular"|"react"|"vue"|null,
  "frameworkUnsupported": true|false,
  "pipelineState": "virgin"|"configured"|"in-progress"|"completed-fresh"|"completed-stale"|"failed",
  "currentScreen": "<screen-id>"|null,
  "completed": ["sl-ds-setup", ...],
  "pending": ["sl-ds-tokens", ...],
  "failed": [],
  "figmaUrl": "..."|null,
  "figmaLastModified": "..."|null,
  "figmaChangedSinceCache": true|false|"unknown",
  "uncommittedDsWork": true|false,
  "errors": []
}
```

**Output file:** `.sl-ds-cache/sl-ds-router/state.json`.

### Step 2 — Spawn intent-matcher (parallel with Step 1)

`Agent(subagent_type: "general-purpose", model: "haiku")` — clean context.

**Sub-agent inputs:** raw `$ARGUMENTS`, list of all `.agents/skills/sl-ds-*/SKILL.md` frontmatters (just `name`, `description.USE_WHEN`, `tags`).

**Sub-agent task:** rank skills by intent-match confidence (0.0-1.0). Use trigger phrases from `description.USE_WHEN` and `tags` array.

**Sub-agent output schema:**

```json
{
  "topMatches": [
    { "skill": "sl-ds-update", "confidence": 0.85, "matched_phrase": "Figma changed" },
    { "skill": "sl-ds-tokens", "confidence": 0.40, "matched_phrase": "tokens" }
  ],
  "explicitMention": "sl-ds-tokens"|null
}
```

**Output file:** `.sl-ds-cache/sl-ds-router/intent.json`.

### Step 3 — Decide

#### Component scope detection (before table)

Before applying the decision table, determine if the user wants single-component scope:

1. **Explicit flag:** `$ARGUMENTS` contains `--scope=component` or `--scope=single` → `scope: "component"`
2. **Auto-detect:** if a Figma URL is provided and `get_metadata(nodeId)` returns `type: "COMPONENT"` or `type: "COMPONENT_SET"` (not `"FRAME"` or `"CANVAS"`) → `scope: "component"`
3. **Default:** `scope: "screen"`

If `scope: "component"` → **skip the main decision table** and use the [Component Scope Flow](#component-scope-flow) at the bottom of this step.

#### Main decision table

Read both sub-agent outputs. Apply this table strictly:

| `pipelineState` | Intent match | Decision |
|---|---|---|
| `virgin` | any | → `/sl-ds-setup` (forced; refuse anything else) |
| `configured` | matches setup/layout | → `/sl-ds-layout` |
| `configured` | matches downstream (tokens/generate/etc.) | → `/sl-ds-layout` first (prereq refusal) |
| `in-progress` | matches a `pending` skill | → that skill |
| `in-progress` | matches a `completed` skill | Ask: re-run or move to next pending? |
| `in-progress` | no clear match | → first item in `pending` |
| `completed-fresh` | matches `sl-ds-audit` | → `/sl-ds-audit` |
| `completed-fresh` (`figmaChangedSinceCache: "unknown"`) | any | Treat as `completed-fresh` (conservative); **WARN**: "Could not verify Figma lastModified — proceeding as if design unchanged. Re-run /sl-ds-tokens to force refresh." Then apply `completed-fresh` rows above. |
| `completed-fresh` | matches any other | Ask: re-do, audit, or new screen? |
| `completed-stale` (Figma changed) | any | → `/sl-ds-update` |
| `failed` | any | → recovery skill from `failed[0].skill` |
| `frameworkUnsupported: true` | any | Apply [`../_shared/refusal-protocol.md`](../_shared/refusal-protocol.md) §4.4 — STOP |

#### Component Scope Flow

For `scope: "component"`, bypass the main table and dispatch this 4-step sequence:

| Step | Skill | Notes |
|---|---|---|
| 1 | `sl-ds-tokens` | Only for the target `nodeId` and its children |
| 2 | `sl-ds-plan --scope=component` | SMALL scope; single component SPEC only (skips cluster detection + data layer) |
| 3 | `sl-ds-implement` | Phase 1 only — single component generation |
| 4 | `sl-ds-verify` | Single component visual verification |

Announce the 4-step sequence to the user and confirm before starting step 1.

### Step 4 — Dispatch or clarify

**If decision is unambiguous AND top intent-match confidence > 0.7:**

```text
> 🎯 **Recommendation: `/<skill-id>`**
>
> State detected: <pipelineState>
> Why this skill: <one-line rationale>
> Next after this: <suggested follow-up>
>
> ⭐ Proceed with `/<skill-id>`
> Pick a different skill — show me the menu (`/sl-ds-help`)
> Tell me more about the state — show full detection output
```

User confirms → invoke that skill via Skill tool.

**If ambiguous** (multiple matches > 0.5 OR state requires a choice):

Use `AskUserQuestion` per [`../_shared/questions-format.md`](../_shared/questions-format.md). Max 1-3 questions. Each option's `description` MUST cite the state evidence from `state.json`.

**If no match at all** (intent unclear, low confidence everywhere):

Fall through to `/sl-ds-help` with a brief apology: *"I couldn't figure out what you need — here's the catalog."*

### Step 5 — Record the decision

Write `.sl-ds-cache/sl-ds-router/last-decision.json`:

```json
{
  "schemaVersion": "1.1.0",
  "at": "<iso-timestamp>",
  "userInput": "<$ARGUMENTS>",
  "detectedState": "<pipelineState>",
  "dispatchedTo": "<skill-id>",
  "confidence": 0.85,
  "rationale": "<one-line>"
}
```

Used by `/sl-ds-audit` retrospectives and by subsequent `/sl-ds` invocations.

## Outputs

| Path | Purpose |
|---|---|
| `.sl-ds-cache/sl-ds-router/state.json` | Project state snapshot at this routing |
| `.sl-ds-cache/sl-ds-router/intent.json` | Intent-match result |
| `.sl-ds-cache/sl-ds-router/last-decision.json` | Dispatch decision + rationale |

## Hard gates

- state-detector returns malformed JSON → retry once with prompt: *"Return JSON only. Use the exact schema from state-detection.md §4. No prose."* If still malformed → fall through to `/sl-ds-help`.
- Decision tree returns a skill that doesn't exist in `.agents/skills/` → FAIL with diagnostic (validator should have caught this — it's a bug, not a runtime condition).
- User picks "Other" in a clarifying question and the free-form input maps to no skill → fall through to `/sl-ds-help`.

The router NEVER:
- Modifies code or `sl-ds-decisions/*.md`
- Runs the chosen skill silently — always confirms for non-`virgin` dispatch (`virgin` is the one auto-chain case)
- Inherits Opus when Haiku sub-agents suffice

## Resume

_N/A — stateless. Each invocation reads fresh state. `last-decision.json` is informational only._

## Next

After successful dispatch, the chosen skill is now running. Each downstream skill prints its own `## Next` on completion, chaining naturally.

If the router falls through to `/sl-ds-help`, that skill takes over.

## References

| File | Load when |
|---|---|
| [state-detection.md](references/state-detection.md) | Step 1 — sub-agent contract (bash commands + full JSON schema §4) |
| [../_shared/questions-format.md](../_shared/questions-format.md) | Step 4 — clarifying questions |
| [../_shared/refusal-protocol.md](../_shared/refusal-protocol.md) | Step 4 — refusal scenarios §4.1 (virgin state), §4.4 (unsupported framework) |
| [../_shared/model-routing.md](../_shared/model-routing.md) | Steps 1+2 — Haiku sub-agent contract |
| [../_shared/cache-schema.md](../_shared/cache-schema.md) | Step 5 — last-decision.json envelope |
