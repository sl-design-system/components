---
name: sl-ds-promote
description: |
  USE WHEN: sl-ds-lessons.md has accumulated 20+ lessons OR `/sl-ds-lesson` emitted a 50+-lessons WARN OR user says "promote lessons", "graduate this lesson to a standard", "clean up lessons", "lessons file getting big". Or when user explicitly wants to convert a project-specific rule into a team/org-wide standard.
  DOES: Reads `context/foundation/sl-ds-lessons.md`, identifies promotion-candidate lessons by criteria (active duration, scope breadth, citation frequency), proposes graduation to fe-standards as new rule IDs (typically SDS-* for SLDS-related or extension files for new prefixes). User picks per-lesson; promoted lessons are MOVED to fe-standards + marked expired in lessons.md with cross-reference.
  NEVER USE WHEN: lessons file is small (<10 active) — premature; the lesson hasn't proven recurrence yet. Or when a lesson is genuinely project-specific (won't generalize beyond this codebase).
version: 1.0.0
model: opus
tags: [sl-ds, promote, lessons, fe-standards, graduation, lifecycle]
next:
  on_success: [sl-ds, sl-ds-audit]
  on_failure: [sl-ds-help]
  related: [sl-ds-lesson]
requires:
  artifacts: [context/foundation/sl-ds-lessons.md]
  skills_completed: []
produces:
  artifacts: [.sl-ds-cache/sl-ds-promote/promotion-result.json]
  decisions:
    - context/foundation/sl-ds-lessons.md
    - .agents-v2/standards/fe/sanoma-ds.md
token_budget: "5-15K"
sub_agents:
  - name: promotion-candidate-finder
    subagent_type: general-purpose
    model: sonnet
    purpose: Parse sl-ds-lessons.md, rank lessons by promotion-criteria score, return ranked list
lessons_read: false
fe_standards_consulted:
  primary: [sanoma-ds.md]
  rule_ids: [SDS-1, SDS-2, SDS-3, SDS-4, SDS-5, SDS-6, SDS-7]
---

# DS Promote — Graduate Lessons to FE Standards

## Purpose

`/sl-ds-lesson` is the gentle entry point — anyone can write a lesson when they spot a recurring pattern. But lessons that have actually held up over time (months of active use, applied to multiple screens, never contradicted) deserve to graduate: become a stable rule ID in `.agents/standards/fe/`. This skill finds graduation candidates and walks the user through the promotion. Without it, the lessons file grows unboundedly and `/sl-ds-lesson` Step 8 WARNs at 50+ lessons with no actionable path.

## When to use

- `/sl-ds-lesson` emitted a 50+-lessons WARN ("at this scale, lessons aren't lessons — they're a process manual")
- Quarterly or semi-annual housekeeping pass on `sl-ds-lessons.md`
- A specific lesson has been in the file for 6+ months, applies to all screens, never had an exception → user wants to formalize it
- New team member onboarded and noticed an undocumented "we always X" — turns out it's a lesson that ought to be a rule

## When NOT to use

- Lessons file < 10 active entries — premature promotion before the lesson has proven recurrence
- A lesson is project/screen-specific (`scope: screen:X` or `scope: feature:Y` with a unique team context) — keep as lesson; doesn't generalize
- User wants to delete/expire a lesson without promoting → use `/sl-ds-lesson --expire <id>` instead (this skill is for ELEVATION, not deletion)

## Preconditions

| Required artifact | If missing |
|---|---|
| `context/foundation/sl-ds-lessons.md` | STOP per [`../_shared/refusal-protocol.md`](../_shared/refusal-protocol.md) §4.7. No lessons file = nothing to promote. Producer: `/sl-ds-lesson` writes this on first invocation. |

## Inputs

**`$ARGUMENTS` (all optional):**

| Field | Description |
|---|---|
| `<lesson-id>` | Specific lesson to consider for promotion (skip the candidate-finder; go directly to user-confirmation flow) |
| `--threshold=<N>` | Only show candidates that score above N on the promotion-criteria (default: top 5) |
| `--dry-run` | Show candidates + proposed rule IDs without writing |

## Workflow

### Step 1: Spawn promotion-candidate-finder

**Executor:** `Agent(subagent_type: "general-purpose", model: "sonnet")` — sub-agent, clean context

**Sub-agent inputs:** path to `context/foundation/sl-ds-lessons.md`, reference to [`references/promotion-criteria.md`](references/promotion-criteria.md).

**Sub-agent task:** parse lessons file, compute score per active lesson, return ranked top candidates.

**Sub-agent output schema** (inline contract):

```json
{
  "schemaVersion": "1.2.0",
  "producedBy": "sl-ds-promote/promotion-candidate-finder",
  "producedAt": "<iso>",
  "totalActiveLessons": <int>,
  "candidates": [
    {
      "lessonId": "signal-store-for-shop",
      "score": 0.85,
      "scoreBreakdown": {
        "ageMonths": 8,
        "scopeBreadth": "feature",
        "severity": "must-follow",
        "appliedCount": 12,
        "contradictionsFound": 0
      },
      "proposedRuleId": "SDS-8",
      "proposedTargetFile": "sanoma-ds.md",
      "rationale": "8 months active, must-follow severity, scope feature:shop applied across 12 invocations, no contradictions logged."
    }
  ],
  "rejectedCandidates": [
    {
      "lessonId": "max-form-validation-pattern",
      "score": 0.35,
      "reason": "scope:screen:checkout — too narrow to generalize. Stay as lesson."
    }
  ]
}
```

**Score formula** (from `references/promotion-criteria.md` §2):

```
score = 0.3 * ageScore       // 0=just-added, 1=12+ months active
      + 0.25 * scopeScore    // 0=screen, 0.5=feature, 1=project-wide
      + 0.2 * severityScore  // 0=info, 0.5=prefer, 1=must-follow
      + 0.15 * applicationScore  // 0=never matched, 1=10+ invocations
      + 0.1 * stabilityScore // 0=contradictions logged, 1=zero contradictions
```

Candidates with score ≥ 0.6 surfaced; below → kept as lesson.

### Step 2: Present candidates

**Executor:** orchestrator on **opus**

If `$ARGUMENTS` named a specific lesson → skip to Step 3 with that lesson loaded.

Otherwise, print top candidates from sub-agent output:

```text
> 📈 **Promotion candidates** (lessons that have earned graduation):
>
> | # | Lesson ID | Score | Age | Scope | Applied | Proposed |
> |---|---|---|---|---|---|---|
> | 1 | signal-store-for-shop | 0.85 | 8mo | feature:shop | 12× | sanoma-ds.md SDS-8 |
> | 2 | max-prefix-strict | 0.72 | 5mo | project-wide | 47× | sanoma-ds.md SDS-9 |
> | 3 | render-loading-skeleton | 0.65 | 6mo | project-wide | 8× | components.md COMP-11 (NEW) |
>
> Total active lessons: 28 (3 promotion candidates, 25 staying as lessons)
> Rejected as too narrow: 4 (scope screen:* or single-citation; see promotion-result.json for details)
```

### Step 3: Per-lesson promotion (interactive)

**Executor:** orchestrator on **opus**

For each candidate (in score order), ask via `AskUserQuestion`:

```text
> **Promote `signal-store-for-shop` to `sanoma-ds.md` SDS-8?**
>
> Current lesson:
>   rule: Always use Signal Store for any feature under shop/*; never Service+RxJS.
>   why: Incident 2025-Q3 — cart Service had race condition...
>   added: 2025-09-15 (8 months ago)
>   applied: 12 invocations across 4 shop/* screens
>   contradictions: 0
>
> Proposed promotion:
>   Target: .agents/standards/fe/sanoma-ds.md (SLDS specialization file)
>   New rule ID: SDS-8
>   Reformulated for fe-standards format: imperative + Why + Example + Exceptions
>
> ⭐ Promote — write SDS-8 to sanoma-ds.md, expire lesson with cross-ref
> Skip this one — keep as lesson; ask about next candidate
> Edit before promoting — refine wording first
> Re-target — promote to a different fe-standards file
> Abort the whole flow
```

If "Promote" → continue Step 4 for this lesson; loop to next candidate.
If "Skip" → mark `skipReason: <user-input>` and continue.
If "Edit" → ask for refined imperative + why; re-confirm.
If "Re-target" → ask which file (`sanoma-ds.md` / `angular.md` / `components.md` / new file).
If "Abort" → STOP; write `.sl-ds-cache/sl-ds-promote/promotion-result.json` with partial results.

### Step 4: Generate the new rule entry

**Executor:** orchestrator on **opus**

For each accepted promotion, construct the rule body per the canonical fe-standards rule format used in [`@.agents/standards/fe/sanoma-ds.md`](../../standards/fe/sanoma-ds.md): four sections — **Rule** (imperative), **Why** (incident/rationale + lesson promotion citation: "Promoted from lesson `<id>` (N months active; K invocations; 0 contradictions)"), **Example** (bad/good code pair), **Exceptions** (when not to apply + how to document).

Append to target file (preserving existing structure). Update the target file's frontmatter `last_updated`. If a `## Skrót decyzyjny` / `## TL;DR` table exists in the target, add a row.

### Step 5: Expire the lesson with cross-reference

**Executor:** orchestrator on **opus**

In `sl-ds-lessons.md`, MOVE the promoted lesson from `## Active Lessons` to `## Expired Lessons`. Add `expired_reason: "Promoted to <target-file> <RULE-ID> on <date>"`. Update frontmatter `total_lessons` count (decrement active; increment expired implicitly).

Skills consuming lessons via `lessons_read: true` will no longer match this lesson but will match the new SDS-* rule instead (via `fe_standards_consulted`). The team's accumulated knowledge migrates from one place to the other without losing audit history.

### Step 6: Summary

```text
> ✅ Promotions complete
>
> Promoted to fe-standards:
> - signal-store-for-shop → sanoma-ds.md SDS-8
> - max-prefix-strict → sanoma-ds.md SDS-9
>
> Stayed as lessons:
> - render-loading-skeleton — user picked Skip (wants more evidence before promoting)
>
> sl-ds-lessons.md: 28 → 26 active (2 expired with promotion cross-ref)
> sanoma-ds.md: SDS-7 → SDS-9 (2 new rules)
>
> Next:
> - Update `_shared/fe-standards-index.md` §2 if any rule ID range expanded
> - Commit the changes (sanoma-ds.md + sl-ds-lessons.md together)
> - Future `/sl-ds-plan` runs in shop/* will apply SDS-8 instead of the old lesson
```

Write `.sl-ds-cache/sl-ds-promote/promotion-result.json` per [`@_shared/cache-schema.md`](../_shared/cache-schema.md) §8.10 (envelope with `promoted[]` (lessonId, targetFile, newRuleId), `skipped[]` (lessonId, reason), `aborted` flag).

## Outputs

| Path | Purpose |
|---|---|
| `.sl-ds-cache/sl-ds-promote/promotion-result.json` | Machine-readable audit trail |
| `.agents/standards/fe/sanoma-ds.md` (or other target) | New rule(s) appended |
| `context/foundation/sl-ds-lessons.md` | Promoted lessons moved to Expired section with cross-ref |

## Hard gates

- Lessons file has < 10 active lessons → STOP. *"Promotion is premature. Build up at least 10 active lessons before housekeeping; the lessons file isn't full yet."*
- Sub-agent returns 0 candidates above threshold → STOP cleanly. *"No lessons meet the promotion criteria yet (top score: <X>). Re-run in a few months; lessons earn graduation through age + recurrence + stability."*
- Proposed rule ID collides with existing fe-standards rule → re-number with next available; warn user.
- Target file write fails (permission, malformed YAML after edit) → STOP, do NOT touch `sl-ds-lessons.md`. Atomicity: either both edits succeed or neither.
- User aborts mid-flow → write partial promotion-result.json; promoted lessons stay promoted (they're durable rule IDs now); subsequent candidates stay as lessons untouched.

## Resume

Resume per [`../_shared/resume-discipline.md`](../_shared/resume-discipline.md). Progress: `.sl-ds-cache/sl-ds-promote/progress.json`. Checkpointed steps: Step 3 (per-lesson promotion decision — most resumable; resume picks at next undecided candidate, preserving promoted/skipped lists). Manual fallback table (if `progress.json` missing or corrupt):

| State on disk | Resume hint |
|---|---|
| `.sl-ds-cache/sl-ds-promote/promotion-result.json` exists + matches lessons file checksum | Already done; print summary, EXIT |
| `promotion-result.json` exists but `aborted: true` | Step 2 — re-list candidates, user picks up where they left off |
| Nothing | Step 1 (fresh) |

## Next

After successful promotions:

- **Most likely next:** commit the changes (`sanoma-ds.md` + `sl-ds-lessons.md` together — they MUST be one commit so cross-refs stay consistent)
- **Then:** `/sl-ds-audit` to verify nothing depends on the now-expired lessons
- **Update:** `_shared/fe-standards-index.md` §2 if rule ID ranges expanded

## References

| File | Load when |
|---|---|
| [promotion-criteria.md](references/promotion-criteria.md) | Step 1 — sub-agent loads to compute scores |
| [../_shared/lessons-format.md](../_shared/lessons-format.md) | Steps 4-5 — lesson format spec (Active vs Expired sections) |
| [../../standards/fe/sanoma-ds.md](../../standards/fe/sanoma-ds.md) | Step 4 — example of target rule format |
| [../_shared/refusal-protocol.md](../_shared/refusal-protocol.md) | Preconditions + hard gates |
