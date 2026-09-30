---
topic: framing-discipline
applies_to: [sl-ds-layout, sl-ds-plan, sl-ds-update]
last_updated: 2026-06-09
---

# Framing Discipline — Surface the Skill's Reasoning Before Acting

> **Purpose:** When a DS skill makes a non-trivial decision (layout split, component decomposition, diff interpretation), the user only sees the skill's PROPOSAL as the final output. If the underlying observation is wrong, or the interpretation is wrong, but the proposal looks reasonable — the user has no way to catch it. This pattern surfaces the reasoning in three explicit layers, each independently challengeable.

## 1. Why three layers, not "here's a recommendation"

The naive shape is:

```
> Recommended: Signal Store (matches your codebase). Proceed?
```

That's a black-box recommendation. The user has two choices: accept or reject. If they reject they have no way to tell the skill WHICH part was wrong — was the codebase scan incomplete? Was Signal Store the wrong inference from a correct scan? Is Signal Store right but the user wants something else for migration reasons?

The three-layer shape decomposes the reasoning so disagreement is precise:

```
> Observation:    4 Signal Store instances in libs/shop/data/
> Interpretation: project follows Signal Store pattern; matching it preserves consistency
> Proposed:       Signal Store with withState/withComputed/withMethods, mirroring cart.store.ts
> 
> Where do you disagree?
> ⭐ All three are right
> The OBSERVATION misses something — let me correct
> The INTERPRETATION is off — facts are right but conclusion wrong
> The PROPOSAL needs adjustment — analysis right, action should differ
```

The user now points at the specific layer to challenge. The skill knows whether to re-scan, re-reason, or re-propose. **Re-questioning is scoped, not "explain everything again."**

## 2. The three layers — strict definitions

### 2.1 Observation — what the skill SEES

Raw facts derived from inputs. NO interpretation, NO inference.

**Rules:**
- Must be verifiable — user can check the same source
- Must cite source: file path + line number, Figma node ID, `.sl-ds-cache/` artifact
- Must be exhaustive within scope — don't omit signals that would change interpretation
- NO words like "appears", "seems", "likely", "probably" — those belong in Interpretation
- One bullet per fact

**Good examples:**
- `Figma file has 5 pages: Login, Teacher Dashboard, Student View, Settings, Profile.`
- `3 pages contain a frame named "Topbar" at (0, 0, w=1440, h=64): Teacher Dashboard (1:186), Student View (2:301), Settings (3:412).`
- `codebase-analysis.json reports stateManagement.pattern: "signal-store" with 4 evidence files in libs/shop/data/.`
- `Diff: 2 nodes added (2:300 "New CTA Banner", 2:350 "Notification toast"); 1 removed (1:250 "Old Promo"); 3 token values changed.`

**Bad examples (these are interpretation, not observation):**
- ❌ "Figma has a shared topbar." (interpretation — "shared" is inferred from "3 pages have same dimensions")
- ❌ "The codebase uses Signal Store." (inference — observation is "4 instances found"; "uses" is the interpretation)
- ❌ "Structural change detected." (inference — observation is "nodes added/removed"; "structural" is a category we assign)

### 2.2 Interpretation — what it MEANS from a DS engineering perspective

What the skill READS into the observations. This is where DS expertise applies.

**Rules:**
- One sentence per interpretation
- Each interpretation must trace to specific observations ("Because 3 pages have identical topbar dimensions at 0,0 → shared shell candidate")
- Be explicit when something is INFERRED vs OBSERVED ("Inferred from <observation>, the topbar is shared across these 3 pages")
- If multiple interpretations are plausible — list them, don't pick silently. Example: "→ Either: a shared shell + per-screen slot; OR: cosmetic duplication that happens to look similar. Without checking instance-vs-component status, can't distinguish; treating as shared-shell candidate."

**The role of interpretation:** it bridges raw data to actionable code structure. "3 pages with same topbar" (obs) → "shared shell candidate" (interp) → "extend existing shell with slot" (proposal).

### 2.3 Proposed direction — what the skill WANTS TO DO

The recommended action given observation + interpretation.

**Rules:**
- ONE concrete recommendation (no "either A or B")
- Must cite back to interpretation ("Therefore...")
- Honest about consequences (cost, blast radius, risk)
- The starred option in the subsequent structured question MUST match this proposal

**Example:**
- `→ Proposed: reuse-extend strategy. Add named slot to <max-app-shell> for searchbar; render searchbar HTML only inside teacher-dashboard-page.ts. Other 2 pages remain unchanged. Cost: ~30 lines change in shell. Blast radius: any other page consuming <max-app-shell> (currently 0).`

## 3. The reframe question — three axes of disagreement

Immediately after the three-layer block, present ONE structured question:

```
> **Where do you disagree (if anywhere)?**
>
> ⭐ **All three layers are right — proceed with the proposal**
> **OBSERVATION is incomplete or wrong** — I'll tell you what you missed or got wrong
> **INTERPRETATION is off** — observations are right but the conclusion drawn is wrong
> **PROPOSAL needs adjustment** — analysis is right but I want a different action
```

Use `AskUserQuestion` with these four options. The four options are universal — same shape across every framing block.

**What happens after each answer:**

| User picks | Skill next action |
|---|---|
| "All three are right" | Proceed with proposed action; record decision in `sl-ds-decisions/<screen>.md` |
| "Observation incomplete/wrong" | Sub-question: "What did I miss or get wrong?" (free-form). Re-run observation with user's correction, redo interpretation + proposal. Loop until correct. |
| "Interpretation off" | Sub-question: "What's the right interpretation?" Re-do proposal from user's interpretation. Skip observation re-run. |
| "Proposal needs adjustment" | Sub-question: structured alternatives (original options A, B, C from the underlying question). Accept user's pick. Observation + interpretation stand. |

The orchestrator's job is to route the user into the right re-loop — not to assume "user disagrees" means start over.

## 4. When to use framing

USE framing for decisions that:
- Involve **interpretation of multi-source data** (Figma + codebase + cached decisions)
- Could go **multiple defensible ways** (genuine architectural choice)
- Have **downstream consequences** (code structure, regenerate cost, blast radius)

DON'T USE framing for:
- Mechanical checks (cache hit/miss, build pass/fail, file existence)
- Single-defensible-option flows (e.g. STOP+redirect on missing precondition — there IS no other path)
- Sub-agent internal logic (framing is for user-facing decision points only)
- Trivial confirmations ("Found 3 files. Proceed?" — no interpretation needed)

The litmus test: **if the user could reasonably disagree with the skill's reasoning at one of three levels, use framing.** If the only disagreement is binary (proceed vs abort), use a plain confirm.

## 5. Confidence integration

If the producing skill has emitted `confidence: low` in its inputs (per `cache-schema.md` §2.1), the framing block MUST highlight:

```
> **Confidence: LOW** — see `<artifact>.confidence.rationale`
> Specifically uncertain: <comma-separated list from confidence.uncertainAreas>
>
> Reframe especially welcomed on these aspects.
```

This is the explicit "I'm guessing here, push back" signal. Low confidence + user passing without challenge = on user's head; framing made the uncertainty visible.

## 6. The canonical skeleton

Copy-paste shape, fill specifics:

```markdown
> ## <Decision name> — Framing
>
> **Observation:**
> - <fact 1 with source>
> - <fact 2 with source>
> - <fact 3 with source>
>
> **Interpretation:**
> - → <inference 1, traced to obs>
> - → <inference 2, traced to obs>
> - → <multi-option inference if applicable, listed not picked>
>
> **Proposed direction:**
> - → <single concrete recommendation, citing interpretation>
> - Cost: <token/effort estimate>
> - Blast radius: <what else this touches>
>
> **Confidence:** <HIGH | MEDIUM | LOW + rationale if not HIGH>
```

Then the four-option reframe question. The structured question's `⭐ All three are right` option carries the same `description` text as the Proposed direction's first sentence.

## 7. Anti-patterns

- ❌ **Merged Observation + Interpretation.** "Figma has a shared topbar across 3 pages" hides that "shared" is inferred from dimensions. User can't challenge separately.
- ❌ **Skipped Observation because "obvious."** What's obvious to the skill may not be to the user. The cost of writing 3 bullets is low; the cost of an unexamined assumption is high.
- ❌ **Two proposals as "Proposed direction."** That's deferral, not a proposal. Pick one; if the choice is genuinely 50/50, that's an honest "Interpretation is ambiguous" signal in the Interpretation block instead.
- ❌ **Framing for every micro-decision.** Overuse trains the user to skip past it. Reserve for actual architectural calls.
- ❌ **Interpretation that's pure restatement of Observation.** "Codebase has 4 Signal Stores → the codebase uses Signal Store" is filler. Interpretation should ADD something: "Therefore matching that pattern preserves cross-codebase consistency."
- ❌ **Proposal without consequence disclosure.** "Use Signal Store" is incomplete; "Use Signal Store, ~80 lines new code, depends on `@ngrx/signals` already installed" lets user weigh.

## 8. Relationship to `_shared/questions-format.md`

Framing produces the block that PRECEDES a structured question. The question itself follows `questions-format.md` rules (one ⭐ recommendation, evidence-based, max 4 options).

The four-option reframe question is a SPECIAL CASE of the structured-question contract — the four options are fixed across all skills (universal reframe axes), not derived per-decision. Skills using framing **bypass** the "2-4 options per question" guidance because the four-axis split is the value.
