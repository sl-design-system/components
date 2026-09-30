---
topic: questions-format
applies_to: [sl-ds, sl-ds-setup, sl-ds-layout, sl-ds-plan, sl-ds-update]
last_updated: 2026-06-09
---

# Structured Questions — Format Contract

> **Purpose:** Every user question asked by a skill MUST follow this format. Consistency is what makes the suite feel like one tool, not ten. Inspired by 10xdevs but tightened: recommendation MUST be grounded in evidence (cache/codebase scan), not assumption.

## 1. The mandatory shape

```
> **{Single, specific question ending with "?"}**
>
> What I found: {1-2 lines of concrete evidence — file paths, version numbers, counts}
>
> ⭐ **{Recommended option label}** — {what this does}. Strength: {key advantage}. Tradeoff: {key cost or risk}. {Why recommended given evidence above.}
> **{Option 2 label}** — {what this does}. Strength: {X}. Tradeoff: {Y}.
> **{Option 3 label}** — {what this does}. Strength: {X}. Tradeoff: {Y}.
```

When using the `AskUserQuestion` tool, transform this into the tool's schema:
- `question` = the line in bold
- `header` = ≤ 12 chars (e.g. "Layout", "Data", "Conflicts")
- For each option: `label` carries the recommendation star + name, `description` carries the rest

## 2. Hard rules

1. **One recommendation per question**, marked with `⭐` in the label. Exactly one — not zero, not two.
2. **Recommendation must be evidence-based.** "Recommended because..." must reference something concrete: a file path, a count, a detected dependency. No "best-practice" or "industry-standard" hand-waving.
3. **Every option has Strength AND Tradeoff.** No free lunch options. If you can't name a tradeoff, you haven't thought about it enough.
4. **2-4 options.** Fewer than 2 isn't a question (just do it). More than 4 → split the decision.
5. **Mutually exclusive options.** If user might want two — use `multiSelect: true` in the tool call.
6. **No leading question.** Don't ask "Do you want me to do X?" when the answer is binary. Ask the *structural* question instead.

## 3. When to ask vs not ask

**Ask when:**
- Genuine architectural choice with real tradeoff
- Codebase evidence is mixed or absent (no default fits)
- Affects multiple downstream skills

**Don't ask when:**
- Codebase clearly establishes a pattern (just follow it, log the choice)
- The "right" answer is dictated by `.sl-ds-config.yaml`
- It's a yes/no that the user already implicitly chose by invoking the skill

## 4. Question count scales with context

| Skill complexity & prior context | Questions |
|---|---|
| `sl-ds-help`, `sl-ds` (routing) | 0-2 |
| `sl-ds-setup` first run, no `.sl-ds-config.yaml` | 3-5 |
| `sl-ds-setup` re-run, config exists | 0-1 |
| `sl-ds-layout` no prior layout decision | 2-3 |
| `sl-ds-layout` decisions exist + Figma unchanged | 0 |
| `sl-ds-plan` new screen | 2-3 |
| `sl-ds-update` Figma changed | 1-3 (depends on diff scope) |
| `sl-ds-tokens`, `sl-ds-implement`, `sl-ds-verify`, `sl-ds-audit` | 0 (mechanical, no user input needed mid-flow) |

**Principle:** every artifact already on disk is a previously-answered question. Re-asking erodes trust.

## 4.1 Per-invocation scaling by existing DS artifacts (v1.1)

The §4 table is **per-skill baseline**. This sub-section refines it per-invocation: the more of OUR cached state already exists, the fewer questions to ask. Skills check artifacts at start (Step 1) and scale.

**Scaling matrix** — applied to skills that ask questions (`sl-ds-layout`, `sl-ds-plan`, `sl-ds-update`):

| Existing on disk (in our paths only) | Effect on question budget |
|---|---|
| Only `$ARGUMENTS` | Baseline from §4 table |
| `+ .sl-ds-config.yaml` | Skip framework/i18n/state-mgmt confirmation (already settled in setup) |
| `+ .sl-ds-cache/sl-ds-router/last-decision.json` | Skip "what did you mean by /sl-ds?" — intent already matched |
| `+ context/foundation/sl-ds-decisions/<screen>.md` (in-progress) | Read prior decisions; ask ONLY about open items (don't re-ask architecture if already in doc) |
| `+ context/foundation/sl-ds-decisions/layout.md` covers requested screen | sl-ds-layout: 0 questions (idempotent skip per its `## Resume` recipe) |
| `+ .sl-ds-cache/sl-ds-impl/tokens-verified.json` fresh | sl-ds-tokens: 0 questions (cache-hit per its Step 1) |
| `+ .sl-ds-cache/sl-ds-impl/architecture.json` + `component-map.json` | sl-ds-plan: skip if `--force` not passed |
| `+ pipeline-state.json` with `pending` non-empty | Resume from first pending; skip already-completed steps' questions |
| `+ .sl-ds-cache/sl-ds-impl/_archive/<ts>/` | After a recent /sl-ds-update; surface "want to roll back?" as 1 confirm rather than re-questioning |

**Each artifact is a previously-answered question.** Reading them counts as listening to the user. Never re-ask what's already on disk.

**Edge case — confidence: low in an artifact:** if an artifact exists but its `confidence.level === "low"` (see `cache-schema.md` §2.1), it counts as "partial answer" — ask only about its `uncertainAreas`, not the whole topic. Example: `architecture.json` exists with `low` confidence on data-approach → skip structure question (high confidence) but DO ask about data-approach (uncertain).

**Implementation pattern in each skill:**

```markdown
### Step 1: Scale by existing artifacts

Read what's on disk:
- `.sl-ds-config.yaml`: <found / missing>
- `sl-ds-decisions/<screen>.md`: <found / missing>
- `architecture.json` confidence: <high / medium / low / N/A>

Apply scaling matrix → question budget for this invocation: <N>
```

The orchestrator MUST log the budget calculation so users see it ("Asking 1 question (skipped 2 — already in decisions doc)").

## 5. Codebase-informed defaults — the evidence pattern

Before any question, scan and present:

```
> **What I found in your codebase:**
> - State: 4 Signal Stores in `libs/shop/` → recommending Signal Store pattern
> - Structure: flat `components/` directory → recommending per-feature to organize
> - i18n: `angular-i18next` active → will use I18NextPipe
> - DS: SLDS 2.1.0 installed → using `@sl-design-system/angular/*`
```

Then the recommendation is justified by what was found — not by author preference.

## 6. Confirmation questions (when to use)

A "confirmation question" surfaces the skill's interpretation before it acts. Use one when the skill made a **non-mechanical inference** the user could disagree with — specifically, any of these triggers:

- The skill **categorized** something (e.g. classified a Figma node as a shared element, picked a data approach, mapped a node to a DS component variant)
- The skill **chose between defensible alternatives** without clear winner from inputs alone
- The skill's `confidence.level` for the relevant artifact is `medium` or `low`
- The skill's analysis depends on a heuristic that has known false-positive cases (e.g. "name contains 'topbar' → shared shell candidate")

Do NOT use a confirmation question for mechanical outputs (cache hit/miss, build pass/fail, file exists/missing). Mechanical results don't have alternatives the user could pick differently.

Example pattern:

```
> **DOM structure confirmation:**
>
> Figma node 1:185 (hero, h=987px) CONTAINS:
>   - Text, Insights, Lower-grid, Background-pattern
>
> → lower-grid MUST be inside hero-section via ng-content.
>
> ⭐ **Confirm — proceed with this nesting**
> **I see it differently — explain why**
```

These are 2-option, single-select. Used to surface skill's interpretation before doing irreversible work.

## 7. Recovery / failure questions

When a step fails after auto-repair attempts:

```
> **Build failed after 3 repair attempts:**
>
> Error: TypeScript error in max-hero-section.ts:24
> What I tried: added ButtonComponent to imports (no effect), updated tsconfig paths (no effect)
>
> ⭐ **Show me the full error context** — paste output and propose a fix together
> **Skip this gate, proceed to next step** — note as exception in sl-ds-decisions
> **Abort pipeline** — preserve artifacts, resume later
```

These ALWAYS have an "abort with artifacts preserved" option. Never trap the user.

## 8. Anti-patterns to avoid

- ❌ "Do you want to continue?" without an alternative — that's not a question
- ❌ Options without trade-offs ("Option A: do X. Option B: do Y.") — give the user something to weigh
- ❌ Recommended option that's "the safe default" without evidence — feels like CYA
- ❌ Yes/no questions where No has no path forward
- ❌ Re-asking something already in `pipeline-state.json` or `sl-ds-decisions/*.md` — read first, ask only what's actually unknown
- ❌ Five-option questions — split the decision

## 9. Polish/English language switching

User writes in PL → respond in PL, but keep `header` short EN-ish (e.g. "Layout", "Data", "Konflikty" both OK). Trigger phrases in `description.USE_WHEN` always include both languages. Code identifiers and tool labels stay English.
