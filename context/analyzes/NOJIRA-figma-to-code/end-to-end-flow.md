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

---

# Disk, resume, and knowing the metadata is right

## 1. What is written, when, and why

**Most of this is already specified** in [`runs/harness/CAPTURE-PROTOCOL.md`](../../../runs/harness/CAPTURE-PROTOCOL.md),
written from nineteen runs' mistakes: one directory, one `index.json`, one call per file, named by
node, **every capture `.txt` whatever it holds**, and `truncated` recorded when a caller knowingly
stored less. That protocol stands; what follows is what it does not yet cover.

**Write before you read.** Anything that cost an API call is persisted the moment it returns,
before any agent interprets it. If the agent dies mid-interpretation the call is not repeated —
and the bytes an interpretation was derived from stay available to check it against.

**Never overwrite; a retry writes beside, not over.** A3 pass 2 wrote a real 46 KB
`figma-metadata.json` on attempt 1 and a 12-byte `PLACEHOLDER` over it on attempt 3, because
re-spawns share a folder and write unconditionally. The rule: write to a temp name, rename
atomically, and if the target exists write `<name>.attempt-N` and record the divergence in
`index.json`. **The folder exists for reproducibility and the retry loop defeated it.**

**New artifacts this flow adds:**

| File                         | When                     | Why                                                                                                                                      |
| ---------------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `captures/library-graph.txt` | Phase 0, per file        | the 2.18 MB answer. Cached by `(fileKey, fileVersion)`, grepped never read                                                               |
| `mode.json`                  | Phase 0                  | the verdict plus its evidence — which externals, how many `sl-*`. Tiny, and it is what a reader checks first                             |
| `captures/suggestions.txt`   | Phase 1b                 | the named unmapped list, raw                                                                                                             |
| `unresolved.json`            | after the filter         | classified into the five causes, each with an owner                                                                                      |
| `decisions.jsonl`            | Phase 2, **append-only** | one line per decision: node, source value, emitted value, basis. Append-only so a crash leaves a valid prefix rather than a corrupt file |
| `progress.json`              | after every phase        | stage states, guards, and the terminal record                                                                                            |

## 2. When an agent dies

**Resume is re-running the same procedure.** Because every call writes one file named by node, the
procedure can ask "does `captures/code-connect/4007-3169.txt` exist?" and skip what is already
answered. Idempotence by construction beats a progress file that has to be kept in sync with
reality — the batch had both, and only the files were ever right.

`progress.json` then carries what the filesystem cannot:

- **the guards.** The pipeline tree hash — `git rev-parse HEAD:tools/implement-design-plugin`, not
  `HEAD`, which moved a dozen commits that could not affect a run and would have refused every
  resume. Plus `figmaFileVersion`, and now **the variable mode**, because A10 showed two frames of
  one file resolve the same token names to different values and the mode's name is not readable
  through any call we have — only its effect.
- **a terminal record, written last.** This is the one that matters most, and it comes from the
  worst failure mode in the batch: eight runs ended a turn on a status line — _"waiting on X"_ —
  which looks exactly like finishing. **Absence of a terminal record must mean "died", not
  "finished".** Without that rule, partial output is indistinguishable from complete output, and
  the batch showed that is not hypothetical.

What a resume must refuse: a changed pipeline tree, a changed file version, or a changed variable
mode. A run that is half one thing and half another describes neither.

## 3. The metadata: from what, when, and how we know it is right

**Built from** `get_metadata` (structure, ids, geometry), `get_code_connect_map` per node
(identity), `get_design_context` (CSS, tokens, content), `get_variable_defs` (token name to value)
and `get_screenshot` (reference). **When:** Phase 1, interleaved, pruned wherever a mapping
resolves.

### Do we have everything? — the reconstruction probe, with one trap

`node runs/harness/render-design.mjs --run <run>` rebuilds the screen from the capture alone. If
it shows the screen, the capture was deep enough. **Eleven of nineteen runs failed this before
anybody looked.**

**The trap, and it will mislead somebody:** where Code Connect resolves, Figma substitutes the
reference for the markup, so **a well-mapped design reconstructs emptier than an unmapped one**.
Read naively, the best-captured designs score worst. Completeness has to be judged per region —
a mapped region is complete _by virtue of its mapping_, and only unmapped regions are expected to
reconstruct.

The protocol's depth rule says the same thing from the other side: capture is sufficient when
every region a developer would place has its own `get_design_context`, and a `CodeConnectSnippet`
reference is a stopping point rather than a gap.

### Is it correct? — four checks, each from a real failure

1. **Round trip.** The reconstruction against the reference. Catches missing regions. Already
   built.
2. **Cross-source agreement.** `get_design_context` reports a fallback hex and `get_variable_defs`
   reports the variable's resolved value; on SANNA these disagreed — `#29076e` against `#32005a`.
   Two sources for one fact, and a disagreement is a detectable defect rather than a judgement
   call.
3. **Text coverage — the check that would have caught the worst near-miss.** B-SANNA's three
   consent sentences appear in **neither** `get_design_context` (which emits a bare
   `<sl-checkbox checked>`) nor the manifest. They survived only because an implementer read them
   off the screenshot. Diffing text visible in the reference against text present in the capture
   makes that gap mechanical. **A schema that records component mappings but not their labels is
   one OCR failure away from inventing legal copy.**
4. **Node accounting.** Every node in the tree is emitted, absorbed into a parent's emission, or
   explicitly excluded as hidden or decorative. A node in none of the three is an unaccounted gap.
   This is `T-NOJIRA-figma-to-code-06`, and it is the only one of the four that is a true
   completeness proof rather than a sampling check.

The honest ordering: 1 and 3 are cheap and catch the failures that actually happened; 2 is nearly
free; 4 is the rigorous one and the most work. Doing 1 and 3 first is not a compromise — it is
where the measured defects are.
