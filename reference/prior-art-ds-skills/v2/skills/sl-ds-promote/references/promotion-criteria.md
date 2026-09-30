---
topic: promotion-criteria
applies_to: [sl-ds-promote]
last_updated: 2026-06-10
---

# Promotion Criteria — Scoring Lessons for Graduation

> **Purpose:** Loaded by `/sl-ds-promote` Step 1 (promotion-candidate-finder sub-agent). Defines the score formula and per-dimension rubric.

## 1. Inputs

- `context/foundation/sl-ds-lessons.md` — full file, parsed
- Optionally: `.sl-ds-cache/sl-ds-router/last-decision.json` and per-skill artifacts that show lesson application counts (best-effort; may not exist)

## 2. Score formula

For each ACTIVE lesson (skip `## Expired Lessons` section):

```
score = 0.30 * ageScore
      + 0.25 * scopeScore
      + 0.20 * severityScore
      + 0.15 * applicationScore
      + 0.10 * stabilityScore

Range: [0.0, 1.0]
Promotion threshold (default): 0.60
```

The threshold is intentionally moderate — promotion shouldn't require unanimity, but a lesson with score 0.4 across three weak dimensions isn't ready.

## 3. Per-dimension rubric

### 3.1 `ageScore` — How long has the lesson been active?

Based on `added` field in lesson frontmatter, compared to today.

| Age | Score |
|---|---|
| < 1 month | 0.0 (new lesson; needs time to prove itself) |
| 1-3 months | 0.3 |
| 3-6 months | 0.6 |
| 6-12 months | 0.85 |
| 12+ months | 1.0 |

Rationale: a lesson that's lasted a year through team churn, codebase evolution, and review pressure has earned graduation.

### 3.2 `scopeScore` — How broadly does the rule apply?

Based on `scope` field.

| Scope | Score |
|---|---|
| `screen:<name>` | 0.0 (too narrow; stays as lesson) |
| `figma-file:<id>` | 0.1 (too narrow) |
| `feature:<name>` | 0.5 (medium; project-wide promotion possible if feature represents a broad pattern) |
| `project-wide` | 1.0 (full breadth — applies everywhere the team works) |

Rationale: a rule with scope `screen:checkout` is by definition not a generalization; it's screen-specific. Don't promote.

### 3.3 `severityScore` — How strong is the rule?

Based on `severity` field.

| Severity | Score |
|---|---|
| `info` | 0.0 (informational; not a rule) |
| `prefer` | 0.5 (soft tilt; promote only if other dimensions are very strong) |
| `must-follow` | 1.0 (hard rule — first-class candidate for fe-standards) |

Rationale: fe-standards rules are mandatory (NG-* / SDS-* / etc. have `MUST` semantics). A `prefer` lesson would diluteu the fe-standards file's authority.

### 3.4 `applicationScore` — How often has the lesson actually been applied?

Best-effort count from `pipeline-state.json` history, `architecture.json.appliedLessons`, and other artifacts that record `appliedLessons` or `appliedRules`. If no application data available (skill artifacts pre-date the lesson) → estimate from age × scope.

| Applications | Score |
|---|---|
| 0 (never matched any invocation) | 0.0 (untested rule; might be over-engineered) |
| 1-3 | 0.3 |
| 4-9 | 0.6 |
| 10+ | 1.0 |

Rationale: a lesson that's been applied 10+ times across distinct invocations has been STRESS-TESTED in real work. A lesson sitting in the file but never matched is theoretical.

### 3.5 `stabilityScore` — Has the lesson been contradicted?

Look for instances in the artifact history where the lesson was overridden (user picked "Override the lesson for this decision" in a Step 5 conflict resolution). Each override = soft contradiction.

| Contradictions | Score |
|---|---|
| 0 | 1.0 |
| 1 | 0.5 |
| 2+ | 0.0 (lesson is being routinely ignored — promoting would just create a rule that's also ignored) |

Rationale: a lesson that the team REPEATEDLY overrides isn't a rule; it's a wish. Don't promote contested lessons.

## 4. Worked example — "signal-store-for-shop"

From the seed example in `/sl-ds-lesson/SKILL.md`:

```yaml
applies_to: [sl-ds-plan]
scope: feature:shop
severity: must-follow
rule: Always use Signal Store for any feature under shop/*; never Service+RxJS.
why: Incident 2025-Q3 — cart Service had race condition...
added: 2025-09-15
```

Suppose today is 2026-06-10 (8 months active).

| Dimension | Value | Score | Weighted |
|---|---|---|---|
| Age | 8 months | 0.85 | 0.255 |
| Scope | feature | 0.5 | 0.125 |
| Severity | must-follow | 1.0 | 0.20 |
| Applications | 12 (from artifact history) | 1.0 | 0.15 |
| Stability | 0 contradictions | 1.0 | 0.10 |
| **Total** | | | **0.83** |

**Verdict: PROMOTE.** Score 0.83 well above 0.60 threshold. Proposed target: `sanoma-ds.md` SDS-8 (the lesson scopes to SLDS-using shop features; SDS-* prefix is right). Score breakdown surfaced in Step 2 candidates table.

## 5. Target file selection heuristic

Once a lesson is approved for promotion, decide which fe-standards file gets the new rule:

| Lesson signals | Target file | New rule prefix |
|---|---|---|
| `applies_to` includes `sl-ds-implement` AND rule mentions `sl-*` / SLDS / SLDS-related | `sanoma-ds.md` | `SDS-*` (next available) |
| Rule mentions `signals`, `inject()`, Angular control flow, lazy loading | `angular.md` | `NG-*` (next available — append, don't renumber) |
| Rule about component decomposition, layout patterns | `components.md` | `COMP-*` |
| Rule about data layer, state, API | `data-and-state.md` | `STATE-*` or `DATA-*` |
| Rule about tokens, styling | `styling.md` | `STYLE-*` |
| Rule about forms, validation, error handling | `forms.md` or `errors.md` | `FORM-*` or `ERR-*` |
| Rule about testing, refactoring, process | `testing.md` / `refactoring.md` / `checklist.md` | corresponding prefix |
| Generic anti-pattern catalog entry | `antipatterns.md` | `AP-*` |
| Doesn't fit any existing file | Ask user — create new file or pick closest |

Default: most lessons captured via `/sl-ds-lesson` are SLDS-flavored (since DS skills are the writers). Default target = `sanoma-ds.md` unless rule clearly belongs elsewhere.

## 6. What NOT to do

- ❌ Don't promote a lesson that's < 6 months old (`ageScore < 0.6`) even if other dimensions are strong — recurrence needs time to prove itself
- ❌ Don't promote lessons with `severity: info` regardless of other scores — info-level isn't rule material
- ❌ Don't promote with contradictions > 1 — the team is voting against this rule
- ❌ Don't auto-promote without user confirmation — graduation is a content-design decision, not a mechanical one
- ❌ Don't promote lessons with `scope: screen:X` — by definition they don't generalize; offer to delete instead if stale
- ❌ Don't reuse a recently-expired rule ID for a new promotion — pick the next available number to preserve historical references
