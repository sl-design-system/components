# How the whole thing would run, and how we find out whether it works

A walkthrough in order: what is called, when, what it decides, and the four experiments that
would show the idea is right or wrong. Every call named here was probed on 2026-10-05 against two
real files — results in [`code-connect-explained.md`](code-connect-explained.md).

This is a proposal. Nothing below is built.

---

## Phase 0 — once per file, cached: decide the mode

**Call:** `list_file_components_for_code_connect(fileKey)` → **write to disk, never into context.**
Probed: 13 components returned comfortably, 153 returned 2.18 MB. Grep the file for what you need.

**Decides:** does this file's component set depend on `sl-*` externals, or on another library's?
Probed: SANNA's components depend on 24 distinct `sl-*`; Course-files' depend on `Cell` and
`.Main menu`, with zero `sl-*`.

| Depends on       | Mode       | Means                                                        |
| ---------------- | ---------- | ------------------------------------------------------------ |
| `sl-*` externals | **strict** | built from the design system; an unmapped node is a real gap |
| another library  | **as-is**  | a port, not a mapping; unmapped is expected, not a fault     |

**Also free here:** `instanceCount` per component, which is the demand ranking — what to map next,
counted from real designs.

Cached per `(fileKey, fileVersion)`. Nineteen designs sit in twelve files, so this is twelve calls
for the whole corpus, not nineteen, and zero on a re-run.

## Phase 1 — traversal, with Code Connect as the stopping rule

Not "metadata then Code Connect". Interleaved, top-down, because **a resolved mapping prunes the
subtree** — that is where the token saving actually comes from.

1. **`get_metadata(root)`** — shallow. It stops at instance boundaries by itself: A2's root
   returned 27 nodes in 9 seconds for a design of 10,936.
2. **`get_code_connect_map(nodeId)` per top-level instance** — per node, never the subtree. Probed:
   per-node on SANNA's select returned a full snippet plus a `hasTemplate: false` entry; the
   subtree form is what times out and returns `{}`.
3. **Branch on the answer:**
   - `hasTemplate: true` → take the snippet. **Do not descend.**
   - `hasTemplate: false` → identified, no snippet. Record the identity, descend for content only.
   - `{}` → descend fully, and **record why you descended** (see below).
4. **`get_design_context` / `get_metadata` on the interiors that need it**, then repeat from 2.

**The fallback rule, and only one direction is safe:** unknown → descend. Failing open costs
tokens; failing closed silently drops content.

**And the mark must distinguish the two reasons for descending.** Probed: per-node on the
itslearning Banner still returns `{}`, so that node is genuinely unmapped — cause C. If instead
the call had errored, the node might have been mapped and unreadable — cause A. _Same markup,
opposite meaning._ The retry is both the fix and the test.

## Phase 1b — one call that replaces the halt

**Call:** `get_code_connect_suggestions(rootNodeId, fileKey, excludeMappingPrompt: true)`

Probed: on the node where the map returned `{}`, this returned **27 named components** with both
`mainComponentNodeId` and `instanceNodeId`. Lightweight on a large file too — 10 entries on SANNA.

Two things it fixes: it gives the halt something to say beyond a node count, and it ends the
granularity instability the control measured (11→35, 125→141, 24→23 between identical passes),
because it states component identity and placement separately.

**One local filter is needed**, because it over-reports: drop anything that is a descendant of a
resolved instance — SANNA's list includes `Button-Variants` and `Button-Base`, the internals
`button.figma.batch.ts` itself descends into — and drop pure assets. Resolved set comes from
step 2, parentage from step 1.

**Then classify** what survives into the five causes, which is a lookup, not a judgement:

| Cause                          | Test                                                                                                | Owner              |
| ------------------------------ | --------------------------------------------------------------------------------------------------- | ------------------ |
| A retrieval failed             | per-node retry returns data                                                                         | pipeline           |
| B nested id rejected           | id contains `;`                                                                                     | pipeline           |
| C another library              | Phase 0 said as-is                                                                                  | nobody             |
| D SLDS component, no mapping   | name is in `packages/components/`, absent from our 54 mapping files — **local lookup, no API call** | design system team |
| E mapping stale or unpublished | in our 54, still returns nothing                                                                    | design system team |

**Nothing halts.** Strict mode may still stop, but it stops with a named, classified, owner-tagged
list and a cached screenshot — not a node count and a 3-byte `{}`.

## Phase 2 — emit, carrying the provenance

Every emitted element carries the node it came from and the basis of its content:

```html
<sl-select data-figma-node="71:13441" data-basis="mapped">
  <div data-figma-node="4007:3169" data-basis="inferred" data-why="unmapped"></div
></sl-select>
```

And every styled decision records source value, what was emitted, and why — the rule from
[`two-goals.md`](two-goals.md): **if the node binds a design system variable, emit the token** and
treat a visible difference as a Figma-code sync defect; if it binds another library's variable or
nothing, emit the raw value marked `as-is`.

That is what lets one artifact answer both stakeholders without either score distorting the other.

## Phase 3 — render and measure

The harness already does this. What changes is that correspondence becomes exact: `data-figma-node`
tells the measurement which DOM element is which Figma node, instead of matching by geometry.

Two readings of the same run:

- **conformance** — share of decisions with basis `mapped` or `token`, plus run-to-run agreement.
  Deterministic; does not move with a font or a screenshot.
- **fidelity** — aggregate delta against the reference, bounded by the per-design floor (the best
  achievable using only tokens, which for one corpus design is nowhere near 100%).

---

# How we find out whether this works

Four experiments, cheapest first, each with a stated way to be wrong.

## T1 — does the diagnosis actually classify? (no code generated)

Run Phase 0 and Phase 1b over all nineteen designs. Twelve file-level calls plus one suggestions
call per design. No implementation, no rendering, no Stage 3 onward.

**Produces:** a mode per file, and every unresolved component tagged with a cause and an owner.

**Falsified if:** a meaningful share lands in "cannot classify", or the filter cannot reliably
drop internals, or two runs of the same design classify differently. The last one matters most —
if the classification is itself unstable, it has not replaced a judgement with a lookup.

**Cost:** hours. This is the one to do first, and it answers the question the halted runs never
recorded.

## T2 — does it change outcomes? The A/B against the control

The control is the baseline: **5 of 38 runs produced code**, 14 of 19 cases halting on this one
branch, in both passes. Re-run the same 19 × 2 with the branch replaced.

**The success test is not "more runs produce code."** Fourteen low-fidelity ports with invented
content would satisfy that and be worse than halting. The test is **more runs produce code whose
conformance is recorded** — mapped, inferred and invented, counted, attached to the output.

**Falsified if:** completions rise but conformance figures are empty, absent, or disagree between
passes.

## T3 — does marking earn its cost?

Marks are a change to the pipeline, and the plan says the bench does not change the pipeline (see
the tension noted in `two-goals.md`). So test whether they are doing work: on a marked run,
compute node-to-element correspondence twice — once from `data-figma-node`, once by geometry
matching alone — and compare.

**Falsified if:** the two agree. Then geometry is enough, marks are ceremony, and the bench stays
independent of the pipeline, which is the better outcome. I expect them to disagree on repeated
and nested elements, but expecting is not knowing.

## T4 — does variance drop? The measurement the bench exists for

The control gives the first real baseline: **three of nineteen cases flipped outcome between
identical passes**, and blocked-node counts moved up to threefold where the verdict held. The
mechanism was named: one analyst declined to emit the halt token another emitted, on identical
input, and the coordinator learned the map was empty only from the analyst's prose.

This proposal replaces that judgement with a lookup, so variance should fall **measurably, at a
located point**. Run two passes of the fixed pipeline over the same nineteen and diff the
decisions.

**Falsified if:** outcomes still flip. Then the variance was never in that branch and we have
mis-diagnosed the whole thing.

---

## Order, and what it costs to be wrong

T1 → T2 → T4, with T3 any time after marks exist. T1 is hours and answers whether the idea is
coherent. T2 is the expensive one — 38 runs — and should not start until T1 says the
classification is stable, because an unstable classification would make T2 unreadable.

The cheapest useful failure is T1 saying the causes cannot be told apart. That costs a day and
saves the rest.
