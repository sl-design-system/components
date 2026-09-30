---
name: <skill-id-kebab>
description: |
  USE WHEN: <user says: "..." | "..." (PL: "...") | provides <input type> with intent to <action>>
  DOES: <one-sentence what this skill produces>
  NEVER USE WHEN: <anti-trigger phrases, redirect cases — list 1-3>
version: 1.0.0
model: haiku | sonnet | opus
tags: [sl-ds, <topic>, <topic>]
next:
  on_success: [<next-skill-id>]
  on_failure: [<fallback-skill-id>]
  related: [<related-skill-id>]
requires:
  artifacts: []
  skills_completed: []
produces:
  artifacts: []
  decisions: []
cache:
  invalidate_on: [figma_lastModified, .sl-ds-config.yaml]
  reuse_if: []
token_budget: "<low>-<high>K"
sub_agents:
  - name: <id>
    subagent_type: Explore | general-purpose   # Explore = fast file/grep search; general-purpose = deep reasoning
    model: haiku | sonnet | opus
    purpose: <one-liner>
lessons_read: true | false   # v1.1 — true for architectural-decision skills (layout/architecture/update/generate); false/omit otherwise
fe_standards_consulted:      # v1.2 — declares which fe-standards rules this skill applies; validator checks files exist
  primary: [<filename.md>, <filename.md>]   # filenames in .agents-v2/standards/fe/ — empty [] for stateless skills
  rule_ids: [<RULE-ID>, <RULE-ID>]           # specific IDs (NG-1, SDS-3, COMP-2, AP-7, …); orchestrator scopes per-decision
---

# <Title — Human-Readable> — <Tagline>

> **Template usage:** Copy this file to `.agents/skills/<skill-id>/SKILL.md` and fill in every `<placeholder>`. Run `node .agents/skills/_template/validate-skill.js <skill-id>` before committing. The schema in [`SCHEMA.md`](SCHEMA.md) is authoritative — if this template drifts from it, the schema wins.

## Purpose

<One paragraph, max 4 sentences. State what this skill produces and why it exists as a standalone step. Avoid restating what the title already says.>

## When to use

- <Concrete trigger scenario 1 — what the user is doing/asking>
- <Trigger 2>
- <Trigger 3>

## When NOT to use

- <Anti-trigger 1 — redirect to <other-skill>>
- <Anti-trigger 2 — redirect to <other-skill>>

## Preconditions

Before running, verify:

```bash
# Example checks — adapt per skill
test -f .sl-ds-cache/sl-ds-impl/<required-artifact>.json || REDIRECT_TO="<prerequisite-skill>"
test -f context/foundation/sl-ds-decisions/<screen>.md || REDIRECT_TO="<prerequisite-skill>"
```

**If precondition not met:** apply STOP+redirect protocol from [`../_shared/refusal-protocol.md`](../_shared/refusal-protocol.md). Print the redirect message verbatim and STOP. Do NOT fall back to inferring missing inputs from chat history.

## Inputs

**`$ARGUMENTS` (user-provided):**

| Field | Required | Description |
|---|---|---|
| `<field>` | yes/no | <what it is> |

**Auto-detected (from filesystem / config):**

- `targetScope` — from `<source>` (e.g. `.sl-ds-config.yaml`)
- `framework` — from `<source>` (e.g. `package.json`)
- `<other>` — from `<source>`

## Workflow

**Pre-flight:** read applicable lessons per [`../_shared/lessons-format.md`](../_shared/lessons-format.md) §5.1 (if `lessons_read: true`); scope fe-standards per [`../_shared/fe-standards-index.md`](../_shared/fe-standards-index.md) §3 (per frontmatter `fe_standards_consulted`). Per-decision rule-ID subsets for this skill: <list of subsets if any>. Record `appliedRules` + `appliedLessons` in produced artifacts per `@_shared/cache-schema.md §8.<n>`.

If skill doesn't consult fe-standards (e.g. pure routing/help) → replace this block with `_N/A — fe_standards_consulted: { primary: [], rule_ids: [] }._`

### Step 1: <Step name>

**Executor:** <orchestrator | sub-agent> on **<haiku | sonnet | opus>**

<What this step does. Reference specific tools/commands.>

```bash
# Concrete commands or pseudocode
```

**Cache check:** <If applicable, describe when to skip this step based on cached artifacts>

**Output:** `.sl-ds-cache/<path>/<artifact>.json`

### Step 2: <Step name>

**Executor:** <as above>

<...>

---

## Outputs

| Path | Purpose |
|---|---|
| `.sl-ds-cache/<skill-id>/<artifact>.json` | <what this contains> |
| `context/foundation/sl-ds-decisions/<topic>.md` | <decisions persisted> |

These MUST match `produces.artifacts` and `produces.decisions` in frontmatter.

## Hard gates

The skill MUST refuse to complete (FAIL with explicit message) if:

- <Condition 1 — e.g. "tokens count < 5 → bad extraction">
- <Condition 2 — e.g. "all values matched fallbacks → not real theme">
- <Condition 3>

On gate failure: write `.sl-ds-cache/<skill-id>/failure.json` with diagnostic, STOP, surface to user via [`../_shared/refusal-protocol.md`](../_shared/refusal-protocol.md) error format.

## Resume

If interrupted (crash, abort, user re-invocation), determine where to pick up by inspecting on-disk artifacts:

| Artifact present | Resume at step |
|---|---|
| None of this skill's `produces.artifacts` exist | Step 1 (fresh start) |
| `.sl-ds-cache/<skill-id>/_step<N>.json` exists, `_step<N+1>.json` does not | Step N+1 |
| All `produces.artifacts` exist + envelope `figmaLastModified` matches current | Already finished; print summary + Next, EXIT |
| `.sl-ds-cache/<skill-id>/failure.json` exists | Read `kind` field; apply corresponding recovery from `## Hard gates` |

For stateless / cheap skills (e.g. routing, help) use `_N/A — stateless skill._`

## Next

After successful completion:

- **Most likely next:** `/<next-skill-id>` — <why>
- **Alternative:** `/<alternate-skill-id>` — <when this branch fits>
- **If you spot drift:** `/<recovery-skill-id>` — <when to use>

After hard-gate failure:

- **Recovery:** `/<recovery-skill-id>` — <how to unblock>

If user invoked via `/sl-ds` router, return control with `next` hint. If invoked directly, print the "Next" block at end of execution.

## References

| File | Load when |
|---|---|
| [<topic>.md](references/<topic>.md) | <Step N or condition that requires this content> |
| [../_shared/<shared-file>.md](../_shared/<shared-file>.md) | <when to consult> |

---

<!--
Template checklist before committing:
[ ] Filename matches: .agents-v2/skills/<skill-id>/SKILL.md
[ ] name: matches directory name
[ ] All <placeholders> replaced
[ ] model: chosen with justification (see _shared/model-routing.md §2)
[ ] sub_agents[].subagent_type: explicitly Explore (file/grep) or general-purpose (reasoning)
[ ] lessons_read: true for architectural decision skills; false/omit for mechanical
[ ] fe_standards_consulted: declared (empty [] for stateless; rule_ids reflect actual consultations)
[ ] requires.* and produces.* are concrete paths
[ ] All [[skill-id]] references resolve to existing dirs
[ ] No prose outside the canonical sections
[ ] ## Resume section present (v1.1+) — recipe for crash/interrupt recovery
[ ] Pre-flight block in Workflow if skill consults lessons and/or fe-standards
[ ] Validator passes: node .agents-v2/skills/_template/validate-skill.js <skill-id>
-->
