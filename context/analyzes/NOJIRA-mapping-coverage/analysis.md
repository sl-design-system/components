---
type: analysis
schema_version: 1
id: A-NOJIRA-mapping-coverage
title: Why the mappings miss, and what a second mapping mode would be worth
description: 'The empty map is a Figma-side identity gap, not a parameter-name drift — and the properties are available for a tenth of the calls'
jira: null
resource: null
status: draft
owner: marcin.ludwig
created: 2026-10-06T00:00:00Z
updated: 2026-10-06T00:00:00Z
tags: [figma, code-connect, mappings, coverage, adapters]
---

# Why the mappings miss, and what a second mapping mode would be worth

## Key questions

1. **What actually makes `get_code_connect_map` return `{}` on a design that uses our
   components?** Specifically: is it designers using our components with renamed properties, as
   was suspected — which would be expensive, because only designers could fix it?
2. **Would mapping components more generally help** — binding to the component or its type and
   emitting a bare tag, rather than reading properties inside the template?
3. **Can the properties be fetched separately**, and is that cheaper than the per-node map call?
4. **What about properties nobody declared** — an overridden fill, a hidden layer, retyped text?

Out of scope: whether the design system team _should_ grow coverage, which is their call; the
similarity layer (`A-NOJIRA-ds-conformance` F4), rejected in `T-NOJIRA-figma-ingestion-03`.

## Hypotheses

**The one this analysis set out to test**, and the reason it was written: designers use our
components but rename the properties, the mapping cannot find them, and the design does not
resolve. If true, the remedy is designer time across many files and the effort is large.

**The competing one:** Code Connect resolves by node identity, so property names cannot prevent
resolution — they can only corrupt the snippet or throw while rendering it. If true, the remedy
is mapping work in this repository and no designer is involved.

A third, assumed rather than believed: that the coverage figure already on record — _40 real
mappings, 14 scaffolds, against 59 shipped components_ — measures the gap.

## Context & background

- [`code-connect-explained.md`](../NOJIRA-figma-to-code/code-connect-explained.md) — the five
  causes, the coverage figure, the six risks
- [A-NOJIRA-ds-conformance](../NOJIRA-ds-conformance/analysis.md) — F3b overridden instances, F4
  the similarity layer, F6 strict and as-is as modes
- `T-NOJIRA-figma-ingestion-01`, `-02`, `-03` — the mode decision, the traversal, and the
  five-cause classifier this analysis extends
- `scripts/connect-figma-components/` — the mapping inventory, 40 published templates over 70
  Figma node ids, plus 14 scaffolds

## Findings

### F1 — The suspected cause is not the cause

Code Connect binds a mapping to a **Figma node id** — `// url=…node-id=6013-90927` at the top of
every template. Resolution is by node identity. Property names are read only when the template
**executes**, which happens after an entry already exists, so a renamed property cannot produce
`{}`. It produces one of two other things: a wrong value behind a fallback
(`getString('accent') ?? 'grey'`), or a thrown error from the `checkInstance` /
`checkStringProperty` / `checkEnum` helpers.

**The corpus agrees, quantitatively.** Across all nineteen runs there are **five** entries with
`hasTemplate: false` — a mapping found, no template produced — and all five are the same
component, `sl-base-label`. Everything else that failed returned `{}`, which is no entry at all.
If property drift were the dominant cause, the `hasTemplate: false` population would be large.
It is five.

### F2 — The cause, probed to the bottom

`a8-nsp-group-list` (file `4TdMrcnIVOn3Hrfj2OpVZU`) was probed live on the **remote** Figma MCP
server on 2026-10-06, one node at a time.

| Node        | Name                 | Result                     |
| ----------- | -------------------- | -------------------------- |
| `334:22670` | `sl-badge`           | **resolved**, full snippet |
| `334:20678` | `sl-card Actionable` | **`{}`**                   |

Same file, same call, minutes apart — so it is not transport. Following `sl-card Actionable`
down:

1. `card.figma.ts` binds `6013:90927` in `CHpKrPIdXdbV2u7X8vizKI`. Asked directly, that node is
   `<symbol id="6013:90927" name="sl-card">`, containing one instance,
   `C/Vertical - Media percentage`. A plain component, not a variant set, and **not named
   Actionable**.
2. The design's card chain bottoms out in a different library variant,
   `AC/Horizontal - Media fixed width`.
3. `search_design_system` settles it. **Components 2.0 publishes two separate card assets:**

| Asset                | Type            | Mapped?                   |
| -------------------- | --------------- | ------------------------- |
| `sl-card`            | `component`     | **yes** — `card.figma.ts` |
| `sl-card Actionable` | `component_set` | **no**                    |

A third, `SL-card`, is a `component_set` in the **Magister Dark mode** library — which is where
the corpus name `SL-card` comes from.

**So the designers did nothing wrong.** They used a published design-system component. Nobody
wrote a mapping for it. That is cause **D** — no mapping written — and the remedy is in this
repository.

### F3 — The coverage figure on record measures the wrong denominator

_40 mappings against 59 shipped components_ counts **code** components. `sl-card` and
`sl-card Actionable` are one code component and **two Figma assets**, and Code Connect binds
Figma assets. The gap is Figma-side and is therefore larger than the recorded figure, by an
amount nobody has counted.

### F4 — Name matching cannot close that gap, and this analysis caught itself doing it

`classify-unresolved.mjs` matches a Figma name to a mapping by normalising it — among other
rules, cutting at the first space. Run over the corpus it reports `sl-card Actionable` →
`card.figma.ts`, tier **`exact`**, with full confidence.

**The probe proves that is wrong.** They are two different Figma components and only one is
mapped. The classifier would file cause E, _a mapping is published and did not resolve_, where
the truth is cause D, _no mapping exists for this component_ — the same team, a different job.

The sound key is the Figma asset identity, and it is already available in two calls already in
use: `assetKey` from `list_file_components_for_code_connect`, and
`componentKey` / `componentSetKey` from `search_design_system`.

### F5 — Nineteen percent, and nine designs where none of this matters

Counted over the metadata captures of all nineteen runs:

|                              |               |
| ---------------------------- | ------------- |
| component instances          | **723**       |
| of them `sl-*`               | **135 (19%)** |
| designs with **zero** `sl-*` | **9 of 19**   |

Nine designs — the itslearning set, Kampus, part of Sesame — contain no design-system component
at all. No mapping work of any kind changes them. That is cause **C**, and it bounds every
argument below.

Matching the 28 distinct `sl`-ish names in the corpus against the inventory gives **19 matched,
9 unmatched**, covering 113 of the 135 instances. Per F4 that 16%-uncovered figure is a
**floor**, not a measurement: `sl-card Actionable`, `SL-card` and the whole `-theme` family
(`sl-button-theme`, `sl-selectbox-theme`, `sl-label-theme`) are matched by name to mappings
nobody has confirmed they belong to.

### F6 — A general template helps a real problem, and it is the small one

Nothing requires a template to read properties; `return figma.code\`<sl-card></sl-card>\``is a
valid mapping. Doing that removes every`checkInstance` assertion and with it the whole class of
template-execution failures and silent property drift.

But the binding is unchanged: **Code Connect has no wildcard.** Every Figma node id must still be
enumerated, which is exactly what `components.figma.batch.json` does — 12 of the 40 templates
bind several nodes, `color-mask` binds 18. So a general template addresses the five
`hasTemplate: false` entries and leaves every `{}` where it was.

### F7 — The properties are available, in one call instead of N

Measured 2026-10-05 and 2026-10-06:

| Call                                        | Cost            | Returns                                       |
| ------------------------------------------- | --------------- | --------------------------------------------- |
| `get_code_connect_map`, per node            | **~31 s each**  | the snippet, for mapped nodes only            |
| `get_code_connect_suggestions`, per subtree | **32.5 s once** | **135 components with their property values** |

One node in that response carried 33 properties. So "which component is this" and "what is it
set to" can be separated, and the second half is roughly one call per design rather than one per
node.

Two caveats. The suggestions call returns Figma-side candidates and **asks the agent to find the
code match** — it is not a mapping source, and the matching would be ours, with F4's warning
attached. And the ~31 s plateau was measured against one machine's Dev Mode server; on the remote
server a lookup that exceeds its own limit returns `{}` **with an English sentence appended**
(`Note: the Code Connect lookup timed out…`), which the local server does not do.

### F8 — Undeclared properties are half-available

Probed for `A-NOJIRA-ds-conformance` F3b. A **declared component property** is visible — the
suggestions response carries a `Properties` object per node. An overridden fill, a hidden layer
or text retyped inside an instance is **not**, in any of the cheap calls. Those need
`get_design_context` or the pixel diff.

### F9 — The two servers are not the same tool

The remote `get_code_connect_suggestions` takes `fileKey` and `excludeMappingPrompt`; the Dev
Mode server's takes `nodeId` only. `T-NOJIRA-figma-ingestion-03` recorded the local shape as a
contradiction of its own task text; the task text was describing the remote tool. Both are true,
and anything written against one must say which.

## What would change our mind

- **A probe finds a design whose instances point at a mapped node and still return `{}`.** That
  would put property-name drift or publishing staleness back in contention, and F1's argument
  would have to be wrong about the server's internals.
- **The Figma-side asset count turns out to be close to 59.** Then F3 is wrong, the recorded
  coverage figure is roughly right, and the gap is small enough to close by hand without any of
  the machinery below.
- **The `-theme` family turns out to be our components.** Twenty-two instances across the corpus
  carry names like `sl-button-theme` and `sl-label-theme [DEPRECATED]`. If those are an old SLDS
  library rather than another product's, the uncovered share is a coverage problem and not a
  mode-C one.
- **`excludeMappingPrompt: true` turns out to drop the properties too.** F7's cost argument
  depends on the payload surviving without the prompt, which has not been probed.

## Conclusion / recommendation

**Three conclusions, in the order they change what anyone does.**

1. **Do not send this to the designers.** The suspected cause is not supported by any evidence
   collected, and the one case probed to the bottom is a design-system component nobody mapped.
2. **The mapping gap is Figma-side and is not currently measured.** Before any mapping work is
   scheduled, count the Figma assets Components 2.0 publishes against the 70 node ids the
   inventory binds, keyed on asset identity rather than name. That is a handful of calls and it
   replaces a figure that is measuring the wrong thing.
3. **A second mapping mode is worth building, as an adapter rather than a replacement.** Not
   because Code Connect is failing — where it resolves it is authoritative and nothing else is —
   but because nine of nineteen designs will never have a mapping, the properties are available
   for a tenth of the calls, and there is currently no way to compare the two sources because
   there is only one.

The last point is the plan: **put the mapping sources behind one interface and let them be
swapped, compared and measured against each other.** A second implementation is also the only
honest test of the first — today a Code Connect snippet is accepted because nothing can disagree
with it. The `A-NOJIRA-ds-conformance` risk that _a wrong mapping is worse than no mapping,
because it arrives with authority and nothing downstream questions it_ is answered by having
something that can.

## Open questions

- **How many Figma assets does Components 2.0 actually publish?** The one number this analysis
  most wants and did not collect, because it is a plan's first task rather than an analysis's.
- **Is `assetKey` stable across library publishes?** The whole identity-keyed approach rests on
  it, and nothing here tested it.
- **Who owns the generated mappings?** A mapping we infer is not the design system team's
  declaration, and the conformance report must not present the two as the same kind of fact.
- **Does a general template lose anything that is being used?** Five `hasTemplate: false` entries
  say the detailed templates mostly work; `<sl-grid>` with nothing inside says detail is already
  being collapsed. The trade is real and unmeasured.

## Leads to

- Plan: `P-NOJIRA-mapping-adapters` — [`../../plan/NOJIRA-mapping-adapters/plan.md`](../../plan/NOJIRA-mapping-adapters/plan.md)
