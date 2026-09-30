---
name: sl-ds-lesson
description: |
  USE WHEN: user says "sl-ds lesson", "add lesson", "remember this", "zapamiętaj że", "lesson learned", "zapisz regułę", or wants to capture a recurring rule / pattern / anti-pattern from a recent incident or design decision to inform future DS skill runs.
  DOES: Captures a team-specific rule into context/foundation/sl-ds-lessons.md with structured metadata (applies_to skills, scope, severity, rule, why). Future runs of /sl-ds-layout, /sl-ds-plan, /sl-ds-update, /sl-ds-implement read this file and apply applicable lessons in their framing blocks. Single writer for the lessons file — keeps format consistent. Also supports --expire to move stale lessons out of Active.
  NEVER USE WHEN: the rule is a framework-universal (signals over @Input, no *ngFor) — that belongs in .agents/standards/fe/ (NG-* / SDS-* / COMP-* etc.), not lessons. Or when the rule is vague ("write good code") — must be actionable.
version: 1.0.0
model: sonnet
tags: [sl-ds, lesson, capture, learning, ledger, rules]
next:
  on_success: [sl-ds, sl-ds-help]
  on_failure: [sl-ds-help]
  related: [sl-ds-layout, sl-ds-plan, sl-ds-update, sl-ds-implement]
requires:
  artifacts: []
  skills_completed: []
produces:
  artifacts: []
  decisions: [context/foundation/sl-ds-lessons.md]
token_budget: "2-5K"
sub_agents: []
lessons_read: false
fe_standards_consulted:
  primary: [antipatterns.md, README.md]
  rule_ids: [AP-1, AP-2, AP-3, AP-4, AP-5, AP-6, AP-7, AP-8, AP-9, AP-10, AP-11, AP-12, AP-13, AP-14, AP-15, AP-16, AP-17, AP-18]
---

# DS Lesson — Capture Team Rules

## Purpose

When a recurring pattern, incident, or design decision is worth surfacing for future DS runs, `/sl-ds-lesson` captures it as a structured entry in `context/foundation/sl-ds-lessons.md`. Architectural skills (`sl-ds-layout`, `sl-ds-plan`, `sl-ds-update`, `sl-ds-implement`) read that file at start and apply applicable lessons in their framing blocks — meaning the user's correction in one session influences the next without needing to re-explain. This is the ONLY skill that writes to the lessons file; keeping a single writer prevents format drift.

## When to use

- After a `/sl-ds-plan` decision where you had to override the skill's recommendation with a feature-specific rule ("for shop/* always Signal Store")
- After an incident where a generated component caused a bug that should never repeat ("never use sl-card for layout containers — caused +32px geometric drift in cart")
- After a design review where a convention was settled ("Polish strings for teacher-portal: 'Nauczyciel' not 'Nauczycielka'")
- After `/sl-ds-update` where the categorization needed reinterpretation that's likely to recur ("Promo→Cta rename pattern is always semantic, not cosmetic")

## When NOT to use

- The rule is a **framework universal** (signals over decorators, no `*ngFor`) — those live in `.agents/standards/fe/angular.md` (NG-*) or `sanoma-ds.md` (SDS-*). Lessons are team/project-specific overrides on top.
- The rule is **vague** ("write good code", "prefer simpler") — must be actionable per `_shared/lessons-format.md` §4
- The "lesson" is actually a **one-off architectural decision** for a single screen — record it in `sl-ds-decisions/<screen>.md` `## Architectural exceptions` section, not in lessons
- **Removing/correcting a lesson** that was added wrong — use `/sl-ds-lesson --expire <id>` (this skill handles expire too)

## Preconditions

None. `/sl-ds-lesson` works on any project — it creates `context/foundation/sl-ds-lessons.md` on first invocation if absent.

```bash
test -d context/foundation || mkdir -p context/foundation
# sl-ds-lessons.md gets created if needed in Step 4
```

## Inputs

**`$ARGUMENTS` (user-provided):**

| Field | Required | Description |
|---|---|---|
| Free-text rule + reason | usually yes | The user's lesson in their own words. Example: `"we always use Signal Store for shop/* features because the cart Service had a race condition in Q3"` |
| `--expire <lesson-id>` | alternative | Mark an existing lesson as expired (moves it to Expired section with reason) |
| `--edit <lesson-id>` | alternative | Update an existing lesson (severity change, scope change, etc.) |

If invoked with NO `$ARGUMENTS` → prompt user for the rule freeform.

## Workflow

**Pre-flight:** scope fe-standards per [`../_shared/fe-standards-index.md`](../_shared/fe-standards-index.md) §3 — this skill consults `antipatterns.md` (AP-1..18) **for duplicate detection only** (Step 4 check; see [`references/curation-workflow.md`](references/curation-workflow.md) §6.2). Does NOT apply rules during writing. Loaded on-demand at Step 4 only.

### Step 1: Determine mode

**Executor:** orchestrator on **sonnet**

Parse `$ARGUMENTS`:
- `--expire <id>` → Expire flow (Step 6)
- `--edit <id>` → Edit flow (Step 7)
- Otherwise → Add new lesson flow (Step 2)

### Step 2: Parse the freeform rule

**Executor:** orchestrator on **sonnet**

Read [`references/curation-workflow.md`](references/curation-workflow.md) §1 for the parsing heuristics. Extract from the user's free-form text:

- **Rule candidate** — the imperative action (often a "we always X" / "never Y" / "treat Z as W" sentence)
- **Why candidate** — the rationale (often after "because", "due to", or follows the rule sentence)
- **Scope hint** — mentions of features (`shop/*`), screens (`teacher-dashboard`), or Figma files

If parsing fails (text doesn't have clear imperative + reason) → ASK user to restate. Use [`../_shared/questions-format.md`](../_shared/questions-format.md):

```
> **Couldn't parse your lesson cleanly. Restate as:**
>
> Rule: <one imperative sentence — what should always/never happen>
> Why: <one or two sentences — incident, decision, or reason>
```

### Step 3: Structured metadata questions (1-3 questions)

**Executor:** orchestrator on **sonnet** — uses `AskUserQuestion`

Ask only what couldn't be inferred from $ARGUMENTS:

**Q1 (always asked) — Which skill(s) should consult this lesson?**

```
> ⭐ sl-ds-plan only — it's a structure or data-approach rule
> sl-ds-layout only — it's a layout/shell rule
> sl-ds-update only — it's a diff interpretation rule
> sl-ds-implement only — it's a code-writing rule
> Multiple skills — I'll list them
```

Multi-select: if `Multiple` picked, ask a follow-up with checkboxes for each of the 4 architectural skills.

**Q2 (asked if scope wasn't clear from text) — Scope?**

```
> ⭐ Project-wide — applies whenever applicable skills run
> Feature-specific — applies only when working in <feature-name> (you provide name)
> Screen-specific — applies only for a specific screen
> Figma-file-specific — applies only for a specific Figma file
```

**Q3 (always asked) — Severity?**

```
> ⭐ Prefer — tilts the skill's recommendation toward this rule, but doesn't block other choices
> Must-follow — skill cannot propose options that violate this rule; user must explicitly override
> Info — just surface in the skill's framing observation; no effect on recommendation
```

### Step 4: Generate lesson ID

**Executor:** orchestrator on **sonnet**

Per [`references/curation-workflow.md`](references/curation-workflow.md) §2:

1. Take the rule's first 3-5 meaningful words
2. Kebab-case them, drop stopwords (a, the, is, etc.)
3. Verify ID doesn't collide with existing lessons in `sl-ds-lessons.md`
4. If collision → append `-2`, `-3`, etc.

Example: rule "Always use Signal Store for shop/* features" → ID `signal-store-for-shop`.

### Step 5: Append to sl-ds-lessons.md

**Executor:** orchestrator on **sonnet**

Read `context/foundation/sl-ds-lessons.md`. If absent, create with header from [`../_shared/lessons-format.md`](../_shared/lessons-format.md) §3.

Append the new lesson block under `## Active Lessons` (preserving any existing lessons) using the lesson-block format from [`@_shared/lessons-format.md`](../_shared/lessons-format.md) §3 (`### <id>` + bullets for `applies_to / scope / severity / rule / why / added / valid_until`). Update frontmatter:
- `total_lessons` incremented by 1
- `last_updated` set to today (YYYY-MM-DD)

### Step 6: Expire flow (when `--expire <id>`)

**Executor:** orchestrator on **sonnet**

1. Read `sl-ds-lessons.md`, find lesson by ID
2. If not found → STOP with "Lesson `<id>` not found in Active section. Available IDs: <list>"
3. Ask user (single Q):

```
> **Expire lesson `<id>`?**
>   rule: <rule>
>   why: <why>
>
> ⭐ Yes — expire (moves to Expired Lessons section with today's date) — provide reason
> Cancel — leave it active
```

If Yes → ask follow-up for expire reason (free-form). Then:
- Remove the entry from `## Active Lessons`
- Append to `## Expired Lessons` using the expired-entry format from [`@_shared/lessons-format.md`](../_shared/lessons-format.md) §3 — header `### <id> _(expired YYYY-MM-DD: <reason>)_`, all original fields preserved, plus `valid_until: <today>` and `expired_reason: <user's reason>`.

### Step 7: Edit flow (when `--edit <id>`)

**Executor:** orchestrator on **sonnet**

1. Read lesson by ID
2. Show current state
3. Ask which field(s) to update (multi-select: applies_to / scope / severity / rule / why / valid_until)
4. For each selected, prompt new value (with the existing value pre-filled in the prompt for context)
5. Update the lesson block in-place
6. Update frontmatter `last_updated`

### Step 8: Confirm

**Executor:** orchestrator on **sonnet**

Print:

```
> ✅ Lesson recorded
>
> ID: <id>
> applies_to: <list>
> scope: <scope>
> severity: <severity>
> rule: <rule>
>
> File: context/foundation/sl-ds-lessons.md (total lessons: <N>)
> Next time `/sl-ds-<applicable-skill>` runs in matching scope, this rule will appear in its framing block.
```

## Outputs

| Path | Purpose |
|---|---|
| `context/foundation/sl-ds-lessons.md` | Updated ledger — committed to git for team sharing |

No `.sl-ds-cache/` writes — lessons are intentionally git-committed for cross-team visibility.

## Hard gates

- User provides a rule that's clearly a framework-universal (matches patterns in `.agents/standards/fe/angular.md` NG-* or `sanoma-ds.md` SDS-*) → WARN and ask "This looks like a fe-standards universal — those belong in `.agents/standards/fe/`, not lessons. Continue anyway? (Recommended: No, add to fe-standards instead)"
- Generated ID would collide AND user rejects auto-incremented variant → STOP, ask for explicit ID
- `--expire <id>` for nonexistent ID → STOP, list valid IDs
- `sl-ds-lessons.md` exists but YAML frontmatter is malformed → STOP, refuse to write (don't corrupt the file); ask user to fix manually OR run `--repair` (TBD, not MVP)
- More than 50 active lessons → WARN: "At 50+ active lessons, consider promoting recurring patterns to `.agents/standards/fe/` as new rule IDs; or splitting the lessons file by feature."

## Resume

_N/A — `/sl-ds-lesson` is single-shot. Each invocation is atomic (parse → ask → write → confirm). If interrupted mid-write, the file may have a half-written entry; the next `/sl-ds-lesson` invocation should detect and offer cleanup._

If `sl-ds-lessons.md` is corrupted (frontmatter mismatch, half-written entry) → STOP and surface to user via [`../_shared/refusal-protocol.md`](../_shared/refusal-protocol.md). Don't auto-repair.

## Next

After successful capture:

- **Most likely next:** the architectural skill that triggered the lesson (e.g. re-run `/sl-ds-plan` for the next screen — it'll now apply the rule)
- **Alternative:** `/sl-ds-help` to see what other lessons exist

After expire:

- The skill that consumed this lesson will no longer apply it on next run. No further action required.

## References

| File | Load when |
|---|---|
| [curation-workflow.md](references/curation-workflow.md) | Step 2 (parsing heuristics) + Step 4 (ID generation) + duplicate-detection patterns |
| [../_shared/lessons-format.md](../_shared/lessons-format.md) | Step 3 (severity semantics) + Step 5 (lesson block format) — canonical spec |
| [../_shared/questions-format.md](../_shared/questions-format.md) | Step 3 — structured questions |
| [../_shared/refusal-protocol.md](../_shared/refusal-protocol.md) | Hard gates — corrupted file, collision refusal |
