# Counting what cannot be counted, and the order to build in

Four things: why the node-count accounting I proposed does not work, what replaces it, the order
to build in, and what that does to the approved plans.

---

## 1. The count will not match, and the accounting has to stop depending on one

**The objection is correct and it breaks what I wrote.** I proposed `declared − covered`, as
though the universe were known up front. It is not.

`get_metadata` **also** stops at instance boundaries — A2's 10,936-node design returned 27. So
the tree is a placement-level view of _one level_. When Code Connect fails to resolve a node and
we descend, the call on that child returns **its** children, and the universe grows. Every
descent enlarges the denominator. There is no fixed `declared` to subtract from.

And comparing against the true total is worse than useless: the 10,936 figure includes the
interiors of mapped components, which we **deliberately** do not fetch. Measured against it, a
perfectly captured well-mapped design scores terribly — the same trap as reading the
reconstruction probe naively.

### What replaces it: a closure check, not a ratio

Treat it as a worklist. Every node that enters the frontier must leave it in a terminal state:

| Terminal state | Meaning                                                    |
| -------------- | ---------------------------------------------------------- |
| **resolved**   | Code Connect mapped it — complete, do not descend          |
| **captured**   | its own `get_design_context` was stored                    |
| **descended**  | not captured itself, but its children entered the frontier |
| **hidden**     | `hidden="true"`                                            |
| **excluded**   | a recorded decision, with its reason                       |

**The run is complete when the frontier is empty and every visited node holds one of those five.**
A node still in the frontier, or in none of the states, is the gap — named, with its id.

That needs no denominator, terminates by construction, and is a script. The reported figure is
not a percentage of some total but a census: _visited N, resolved R, captured C, descended D,
hidden H, excluded E, frontier empty_. A percentage can be derived if someone wants one, but the
**verdict is the closure**, not the ratio.

This is a better design than the one it replaces, and it only appeared because the count was
questioned.

## 2. The fifth thing, and it is really the first

To the four differences from v2 — a measured baseline, a frozen corpus, Code Connect as the
stopping rule, an explicit script/agent line — add:

> **5. Incremental measurement as the working method: one change, then measure, before the next.**

The other four are preconditions for this one. A baseline and a corpus are worth nothing if three
changes land between measurements, which is precisely how v2's good ideas became
indistinguishable from its bad ones. It belongs on the list as the method rather than as a
consequence, because it is the thing that will be skipped under time pressure.

## 3. The order — and the proposed one is better than mine

My ordering put T0 (render one run, measure the gap) first. The better argument is the one that
notices **we cannot compare the nineteen runs we already have**, and that the apparatus for
comparing them is the same apparatus we need anyway.

So: **build the measuring apparatus over data already on disk, before touching Figma again.**

### Step 1 — adapter and schema, over existing captures. No Figma calls.

Write the common format and its `zod` schema from the **requirements** the contract analysis
enumerated, then an adapter that reads the nineteen runs' captures into it.

What it answers immediately, for free:

- **which runs' captures are sufficient** — a run that cannot be adapted is an incomplete capture,
  and that is the completeness question answered empirically rather than argued;
- whether the schema designed from requirements survives contact with real data.

**One discipline, or this step corrupts everything after it:** design the schema from what is
needed, and let the adapter _report_ what is missing. **Do not shrink the schema to fit the data
we happen to hold** — the captures were made before the protocol existed, with improvised depth,
and eleven of nineteen failed the reconstruction probe. Fitting the schema to them would bake
their gaps into the contract.

### Step 2 — the HTML generator, from the format. Still no Figma.

Produces 2.1 for every adaptable run. Three things fall out at once:

- the **first comparable numbers** across runs, comparable precisely because one generator made
  them all;
- the **determinism proof** — generate twice, compare checksums;
- **T0 answered as a by-product**: rendering an existing run and measuring the gap to its
  reference is now just running step 2 and comparing.

### Step 3 — the overlay.

Needs per-decision data. The nineteen runs have manifests and open questions in prose, not
structured decisions, so the overlay over historical runs will be **partial** — and knowing how
partial is itself a finding about what the run record must carry.

### Step 4 — only now touch Figma.

The improved ingestion: Code Connect as the stopping rule, the five-cause classification, asset
download at capture time, the boundary checks, the ledger. Measured against step 2's numbers and
the control's 5 of 38.

**Why this order is right:** steps 1 to 3 cost no API calls, extract value from data already paid
for, and produce the apparatus. Step 4 is then the first change whose effect **can** be measured —
which is the whole method, applied to itself.

## 4. What this does to the plans

**No rewrites. One new plan, one amendment, and the drafts should stop being drafts.**

### `P-NOJIRA-figma-to-code` — amend, do not replace

Its sixteen tasks survive; what changed is their order and two assumptions.

| Change                                                                   | Why                                                                                                                                                                                           |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **T-12 strict/as-is moves to the front**                                 | the control shows it is 14 of 19 halts, not a late refinement                                                                                                                                 |
| **T-03 intake report gets cheaper**                                      | `list_file_components_for_code_connect` answers library membership in one call per file; the demand ranking falls out of `instanceCount`                                                      |
| **T-06 coverage gets an algorithm**                                      | the closure check above, replacing an unspecified "node accounting"                                                                                                                           |
| **the "bench does not change the pipeline" assumption needs a decision** | marking and the adapter touch the pipeline. Proposed resolution: marks are precision, not precondition — the bench degrades gracefully without them, so the unmarked control stays comparable |

### New plan — the HTML deliverable and the common format

Not in any existing plan, and now the first thing to build: adapter, schema, the three
generators, and the closure check. Steps 1 to 3 above are its work breakdown.

### Analyses that stand

`A-NOJIRA-ds-conformance` F6 — the halt becomes a mode plus a five-category classification —
is confirmed by the control and needs no change. `A-NOJIRA-figma-metadata-contract`'s sequence
(run record and capture index, then `data-figma-node`, then the registry) still holds, with the
adapter now sitting between the captures and everything downstream.

### The drafts

`draft-next-steps`, `draft-discrepancy-registry` and `draft-measurement-method` have been carrying
decisions that are now made. They should be folded into the new plan and deleted, or they will
keep being read as current thinking after they stop being it.
