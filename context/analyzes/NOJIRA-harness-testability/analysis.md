---
type: analysis
schema_version: 1
id: A-NOJIRA-harness-testability
title: What the harness scripts need before anything is measured with them again
description: 'Six of eight scripts have no tests and no exported functions; the two that have tests shipped two boundary defects behind them. What typing, validation and scenarios would actually have caught'
jira: null
resource: null
status: draft
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-05T00:00:00Z
tags: [technology-evaluation, harness, testing, quality, zod, typescript]
---

# What the harness scripts need before anything is measured with them again

## Context & background

`runs/harness/` holds the instruments the whole Figma-to-code effort is judged by.
`render-design.mjs` produces the headline figure — **9 of 19 runs render** — and
`P-NOJIRA-figma-ingestion` is about to be assessed with it. The scripts were written as
one-off probes and have outlived that framing.

Two events on 2026-10-05 forced the question. `T-NOJIRA-corpus-census-01` repaired a splitter
bug that had silently discarded 116 advisory blocks. Then `T-NOJIRA-figma-ingestion-01` shipped
**two defects behind twenty-three passing tests**, both found only when a real Figma response
was fed in — one of which returned **zero externals on 60 KB of real data**, which reads as
"this file has no dependencies" rather than as a failure.

## Key questions

1. How much of the harness is testable at all, and how much is tested?
2. Would static typing have caught the defects we actually shipped?
3. Would runtime validation have caught them, and what does it cost on a streamed response?
4. What scenario layer should the tests be written from, and does it need new tooling?
5. Which scripts are worth this, given some may not outlive the next plan?

## Findings

### F1 — Six of eight scripts cannot be tested in isolation

Measured 2026-10-05:

| script                   | lines | exported functions | tests |
| ------------------------ | ----: | -----------------: | ----- |
| `render-design.mjs`      |   546 |                  0 | none  |
| `theme-match.mjs`        |   266 |                  0 | none  |
| `check-tokens.mjs`       |   174 |                  0 | none  |
| `typecheck.mjs`          |   149 |                  0 | none  |
| `shoot.mjs`              |   146 |                  0 | none  |
| `link-workspaces.mjs`    |    50 |                  0 | none  |
| `normalise-captures.mjs` |   357 |                  3 | 10    |
| `mode-decision.mjs`      |   290 |                  7 | 12    |

Zero exports means there is nothing to import, so the gap is not "tests were not written" but
"the code shape forbids them". The two that have tests were reshaped as part of the tasks that
touched them.

**The worst case is the most load-bearing one.** `render-design.mjs` is 546 lines with no
tests, and every survivorship number in the effort comes out of it.

### F2 — Static typing would have caught neither defect

Both were boundary defects — the bytes that arrived had a shape the code did not expect:

- the discriminator is `external: true`, not a `name`/`assetKey` pair, so the first pattern
  matched nothing;
- a response arrives wrapped in the MCP content envelope with the payload as an **escaped
  string**, so a reader expecting bare JSON found nothing in it.

A type annotation states what we assumed. Both bugs _were_ the assumption. Typing would have
helped the refactor, not the correctness.

### F3 — Node 24 runs `.ts` natively but does not type-check it

Verified: `node file.ts` executes, no build step, no `tsx`. Also verified:

```ts
const n: number = 'this is not a number'; // runs, prints the string
```

Node **strips** types; it does not check them. So converting the harness to TypeScript buys
nothing on its own — the types rot silently unless `tsc --noEmit` runs somewhere that fails a
build. The conversion is cheap; the checking is the part that has to be arranged.

### F4 — zod rejects the exact payload the hand-written reader accepted

Tested against both stored fixtures with a schema of four lines:

| input                                           | hand-written reader       | zod                                                 |
| ----------------------------------------------- | ------------------------- | --------------------------------------------------- |
| `course-files-components.json` (bare)           | 4 externals               | **valid**                                           |
| `nsp-group-list-components.mcp.json` (envelope) | **0 externals, no error** | **invalid — `expected string, received undefined`** |

This is the whole argument in one row. The failure mode that cost us a day converts from a
plausible number into a loud rejection.

zod 4.4.3 is in `yarn.lock` and `P-NOJIRA-html-contract` already decided it — _"JSON Schema
normative, `zod` derived"_ — so neither the dependency nor the convention is new. In the harness
there is no cross-language contract, so zod alone is enough and no JSON Schema is needed.

### F5 — The scenario layer exists and is unused

`context/_templates/use-case.md` is already `## Preconditions` / `## Scenario` (a Step / Action /
Expected result table) / `## Edge cases` / `## Result`, with `status: draft → ready → passing →
failing` and a `tests_task` link. That is BDD without new tooling.

**There are zero use cases in the context.** This is the same gap recorded across several
sessions as "no use case names a corpus case", which leaves a plan acceptance item unmet across
all sixteen plans.

### F6 — A fixture built from a description tests the description

Both F2 defects survived unit tests that were atomic, isolated and green, because the fixtures
were written from the probe's prose rather than from a stored response. The probe's prose was
accurate about _which fields exist_ and silent about their order and their envelope — and that
is precisely where both bugs lived.

### F7 — Validation can be loud without reading the whole response

The streaming constraint is real: `mode-decision` streams because one response was 2.18 MB.
A whole-object `zod.parse` would defeat that.

It does not have to. The shape is decidable from the first window: whether it is an envelope or
bare JSON, and whether the first component carries `dependencies[].external`. Validating the
first 64 KiB and streaming the rest gives a loud boundary failure at constant memory. The two
goals do not actually conflict.

### F8 — Not every script deserves this

`link-workspaces.mjs` is 50 lines of local symlinking with no measurement in it.
`shoot.mjs` drives a browser and is checked by whether a screenshot appears. Spending scenario
and fixture effort on those is cost without a named consumer.

The ones with a named future consumer are `render-design.mjs` (the regression gauge),
`normalise-captures.mjs` (the format boundary), `mode-decision.mjs` (in the ingestion pipeline)
and `theme-match.mjs` (decides the theme every colour measurement is taken under).

## What would change our mind

**If the harness is about to be replaced, testing it is waste.** This is the strongest
objection. `P-NOJIRA-html-artifacts` builds an adapter and three generators, and a reader could
assume they supersede the harness. They do not: `render-design.mjs` describes itself as _"a
completeness probe, not a fidelity target"_ and the artifacts plan produces the deliverable, not
the gauge. The two coexist. But if that plan absorbs the probe, F1's priority collapses and only
`normalise-captures` and `mode-decision` remain worth the effort.

**Strict validation can turn a tolerable variation into an outage.** If Figma adds a field or
reorders one, a strict schema halts a pipeline that would otherwise have worked. The mitigation
is to validate what is _depended on_ and ignore the rest — zod's default non-strict object
behaviour does this — and to separate "reject, because a wrong answer is worse than none" for
measurement tools from "warn and continue" elsewhere.

**Negative controls rot.** A bad-input case written once and never revisited passes trivially
forever. Keeping it inside the use case, where the scenario is maintained, is the only defence
proposed here, and it is a weak one.

## Conclusion / recommendation

**Do both typing and validation, but they answer different questions and only one of them
answers ours.**

1. **zod at every boundary** — the responses, the capture indexes, the CLI arguments. This is the
   measure that would have caught both shipped defects. Validate the first window and stream the
   rest where size demands it (F7). Reject loudly in measurement tools; warn elsewhere.
2. **TypeScript, but only with `tsc --noEmit` wired into CI.** Native execution makes the
   conversion free (F3); without the check it is decoration. If the check cannot be arranged,
   prefer JSDoc types over a conversion that pretends to a guarantee it does not have.
3. **Scenarios as use cases before tests** (F5), each one naming a real captured fixture in its
   preconditions (F6), and each measurement tool carrying a **negative control** — a known-bad
   input it must report rather than score.
4. **Scope it to the four scripts with a named consumer** (F8), `render-design.mjs` first,
   because it is the instrument that will judge whether `P-NOJIRA-figma-ingestion` worked.
   Calibrate before the experiment, not after.

The standing rule this produces, which outlives the harness: **a script and its tests are one
deliverable, the tests are written against bytes we actually captured, and a measurement tool
must be able to fail.**

## Open questions

- Can `tsc --noEmit` cover `runs/harness/` without pulling it into the monorepo's TypeScript
  project, which currently excludes it? `eslint` already refuses these files for that reason.
- Does `P-NOJIRA-html-artifacts` absorb the completeness probe, or does the probe stay? The
  answer moves `render-design.mjs` between first priority and out of scope.
- Is a negative control per tool enough, or does each published figure need to state which
  controls passed when it was produced?
