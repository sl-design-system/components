---
type: analysis
schema_version: 1
id: A-NOJIRA-figma-metadata-contract
title: What the Figma-to-code metadata contract must satisfy, before a line of schema is written
description:
  Requirements for the versioned metadata contract, each anchored in an observation from the
  nineteen-run batch — what a record must identify, what Figma withholds, how absence and
  uncertainty must be represented, what is versioned and who enforces it, and the smallest v1 the
  existing corpus can be retrofitted into
jira: null
resource: null
status: draft
owner: marcin.ludwig
created: 2026-10-01T17:54:20Z
updated: 2026-10-01T17:54:20Z
tags:
  [figma, design-to-code, metadata, schema, contract, versioning, provenance, measurement, tooling]
---

# What the Figma-to-code metadata contract must satisfy

## Key questions

1. **What must a record identify**, so that it can be refreshed from Figma, checked against Figma,
   and compared with a later record of the same design?
2. **What does Figma not give us** that such a record needs, and what must the contract store in
   its place?
3. **What do the nineteen runs actually contain** — and which of it is a schema rather than an
   accident that nineteen agents happened to converge on?
4. **How must the contract represent absence, failure and uncertainty**, so that a tool's
   limitation is never again recorded as a property of the thing it measured?
5. **What is versioned**, under what policy, and what enforces it?
6. **What is the smallest v1** that the existing corpus can be retrofitted into and that an agent
   can actually be held to?

Out of scope here, deliberately: the choice of validation library, the discrepancy viewer, the
weights of a fidelity score, and the tolerance values themselves. Each is a decision this analysis
feeds rather than makes.

## Hypotheses

Stated before the research, so that the findings can contradict them in public.

| #      | What we believed going in                                                         | Verdict                                                                                                         |
| ------ | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **H1** | The discrepancy registry is the centre of the system and should be designed first | **Contradicted** — it has an unbuilt prerequisite (F15); it is one of three parts, and not the first            |
| **H2** | The contract will be written in zod                                               | **Unsettled** — zod is not a dependency of this repo, and the readers are not all JavaScript (F20)              |
| **H3** | The main job is recording intended vs applied values                              | **Supported but insufficient** — both sides are needed, and so is the resolution context and reachability (F14) |
| **H4** | The capture index is roughly right and needs extending                            | **Contradicted** — it disagrees with its own written specification in eleven places (F1)                        |
| **H5** | A Figma node id is the natural key                                                | **Contradicted** — it is absent, ambiguous or non-durable often enough to disqualify it as a sole key (F6)      |

## Context & background

Companion to [A-NOJIRA-figma-to-code](../NOJIRA-figma-to-code/analysis.md), which established that
the pipeline's output is not repeatable and that nothing in the corpus supports "this run was
better than that one". This analysis takes the next step that document named: before anything can
be measured twice, there has to be an agreed shape for what is written down.

Evidence base: the nineteen runs under `runs/2026-10-01-*`, their 164 capture entries and 5.1 MB of
raw Figma output; the harness under `runs/harness/`; the written protocol in
[`CAPTURE-PROTOCOL.md`](../../../runs/harness/CAPTURE-PROTOCOL.md); and the batch's own findings in
[`batch-findings.md`](../NOJIRA-figma-to-code/batch-findings.md),
[`pipeline-defects.md`](../NOJIRA-figma-to-code/pipeline-defects.md),
[`design-system-defects.md`](../NOJIRA-figma-to-code/design-system-defects.md) and the two drafts,
[`draft-discrepancy-registry.md`](../NOJIRA-figma-to-code/draft-discrepancy-registry.md) and
[`draft-measurement-method.md`](../NOJIRA-figma-to-code/draft-measurement-method.md).

**One limitation governs everything below.** No run in the corpus executed the `implement-design`
plugin unmodified: a supervisor fixed eight parameters centrally and injected five hints and three
rules mid-batch. The corpus is therefore evidence about _designs and about Figma_, and only
provisional evidence about _the pipeline_. Requirements derived from the first kind are marked
`[corpus]`; those derived from the second are marked `[provisional]` and must be re-checked against
the control runs when they exist.

## Findings

### A. The schemas we already have

**F1 — The only artifact with a declared schema disagrees with its own specification, in eleven
places.** `captures/index.json` carries `schemaVersion: 1` in 19/19 runs and is the right anchor.
But `CAPTURE-PROTOCOL.md` specifies `figma.fileKey` and `figma.fileName`, and the writer
(`normalise-captures.mjs`) emits neither — `fileKey` appears in 3/19 indexes, hand-added, and a file
name appears in **none**. The protocol's own example writes `design-context/x.jsx`, violating both
its `.txt` rule and its own path base. Three fields are written and undocumented
(`normalisedFrom`, `continuationOf`, `note`). The rule _"`nodeId` is the node that was queried,
never the markup root"_ is stated in the document, and the writer derives `nodeId` **from the markup
root** — the document forbids what the code does. `captures/assets/`, the asset mapping and the
hidden-node record are specified and unimplemented. `[corpus]`

**F2 — `part` is documented, implemented, and present in zero of nineteen indexes.** It was added to
replace the `advisoryFile` workaround; the data still uses the workaround, in exactly one run. The
reader's `(capture.part ?? 'code')` default is the only reason nobody noticed. A field that exists
in the spec and the writer but not the data is not a contract — it is an intention. `[corpus]`

**F3 — `schemaVersion` is written nineteen times and read zero times.** The one consumer parses the
index and goes straight to `.captures`. This is the corpus's own proof that **a version field
without an enforcing reader is decoration** — worse than absent, because it implies a guarantee it
does not give. `[corpus]`

**F4 — Three fields cost bytes and carry no bits, and one of them is false.** `truncated` is written
164/164 times and is `false` every single time — while three runs demonstrably did truncate, which
is why `.part2`/`.part3` files and `continuationOf` exist. `verdict` in the 187 screenshot sidecars
is `"rendered"` 187/187. `normalisedFrom` is the same sentence in all nineteen. A field whose value
never varies is not recording anything; a field that says `false` where the truth is `true` is
worse. `[corpus]`

**F5 — `capturedAt` records the wrong event.** All 164 values cluster within 70 milliseconds of each
other (`2026-10-01T16:18:26.096Z…166Z`) because the writer stamps `statSync(run).mtime` — the time of
the normalisation pass, not of the capture. Only 22 distinct values exist across 164 entries, and
one run uses the placeholder `2026-10-01T00:00:00Z`. Real execution times live in
`progress.json → stages[].at`, which is naive — no timezone — and absent from one run. `[corpus]`

**F6 — `bytes` disagrees with disk in 21% of entries, and the array permits duplicates.** 35 of 164
entries mismatch; most by a trailing newline, two substantively (one records 489 bytes for a 3-byte
file). Three runs reference the same file path twice. Neither the byte count nor path uniqueness can
be assumed by a reader. `[corpus]`

**F7 — `progress.json` is a stable six-stage spine inside 115 keys that nothing reads.** Across 18
files: `case`, `pipelineCommit` and `stages` are universal, and `stages` has **exactly** the six
keys `1-ingest … 6-review` in all 18, with `status` on 108/108 stage objects. Around that spine,
115 distinct top-level keys, 60+ appearing in exactly one run, and types that shift between runs —
`theme` is a string 12× and an object 5×; `figmaFileVersion` is present 8× and `null` all eight
times. The same concept appears as both `note` (26) and `notes` (19). `[corpus]`

**F8 — The best schema in the corpus was never designed.** `testing/*.png.json`: 187 files, ten keys
present in 187/187, written by one script. It is what consistency looks like when a single
non-negotiating producer writes the file — and its one constant field (`verdict`) proves the other
half of the rule. The lesson is not "copy its fields"; it is **"a shape is only as consistent as its
narrowest producer."** `[corpus]`

**F9 — `figma-code-connect-map.json` has six mutually incompatible shapes across 16 runs,** plus
three runs that wrote `.txt` instead, plus two runs that invented sidecar files
(`figma-code-connect-status.json`, `figma-code-connect-per-node.json`). This is where a schema buys
the most, because agents given no shape invent one each. `manifest.md` tells the same story against
a _prose_ schema: seven sections specified, 115 distinct headings produced, **100 of them appearing
in exactly one run**, and `Component Tree` / `Component tree` / `Component tree — 6 components…`
being three spellings of one section. A prose schema did not hold. `[corpus]`

### B. What Figma gives, and what it withholds

**F10 — Figma does not identify the design. The operator does.** Across all nineteen raw capture
trees there is **no file key, no file name, no page name, no file version and no last-modified
timestamp** — `grep -ro "lastModified"` returns zero. The only file keys in the corpus come from the
human-supplied URL, recorded outside the captures, and 4 of 19 runs record it nowhere as a field.
Two consequences: the file key and URL must be stored out-of-band as run parameters, and **there is
no cheap "has it changed?" check** — a refresh must re-fetch and diff. `[corpus]`

**F11 — A node id is not a key.** Of 84 `get_design_context` captures, **16 (19%) are rooted at a
different node than the one queried** — the pagination case `4007:3183 → 6145:12462`, instance
resolving to main component — and **6 (8%) never mention the queried id at all**. Of 4,786 elements
across all captures, **1,296 (27.1%) carry no `data-node-id`**. And ids come in two forms: 1,435
plain (`2422:87039`) and 1,983 composite instance paths (`I5308:32162;5308:29281`), the latter
invalidated by detaching or re-instancing. A record must store the **queried** id and the
**resolved markup root** id as separate fields, and needs a structural fallback — name plus ancestor
path plus geometry — for the quarter of elements with no id at all. `[corpus]`

**F12 — Variable modes are invisible, and they change values.** The variable payload is a flat
`name → resolved string` map with no node id, no variable id, no collection and no mode:
`grep -i "mode\|collection"` over all nineteen variable captures returns **zero hits**. Yet node
`17264:29099` — the same top-nav instance — resolves `color/background/primary/bold` to `#137271`
in one ETSL frame and `#3366ff` in another, and `fontFamily/heading` to `Raleway` versus `Roboto`.
Corpus-wide this is not exotic: of 399 distinct token names, **37 resolve to more than one value**.
A later re-fetch therefore **cannot distinguish "the design changed" from "a different mode
resolved"** — so a value-only diff on such a token must be typed `ambiguous`, never `changed`, and
`mode` must be present as `unknown` with a reason rather than silently omitted. `[corpus]`

**F13 — Code Connect has three states with three different key sets, and no version.** 31 entries
`hasTemplate: true`, 5 `hasTemplate: false`, 67 per-node `{}`, and six whole responses empty;
**13 of 19 runs produced zero mappings**. The shapes are asymmetric — the `true` variant carries
`label` and `snippet` with `source: ""`, the `false` variant carries a GitHub `source` and
`componentName: null` with no snippet. All 36 entries report `"version": "unknown"`, so **a re-mapped
component is indistinguishable from an unchanged one**. The probe scope must also be recorded: one
run got `{}` from a subtree call over the very ids that returned real snippets individually.
`[corpus]`

**F14 — The reference raster has four distortion behaviours and no record of what it shows.** All
nineteen index entries record the screenshot with `nodeId: null`; nothing on disk says which node
was shot. Measured against the frame dimensions: 11 exact, 3 with canvas bleed (+1px, +7px, −9px),
3 uniform downscales, **2 non-uniform — a 7.5% aspect error** (1512×982 frame → 1024×715), 1 with
every channel halved (per-channel maximum exactly 128), and 2 unresolvable, one of which is probably
a shot of a different node entirely. A record must store the node shot, pixel dimensions, frame
dimensions at capture time, per-axis scale, a channel-maximum check, and a distortion
classification — recorded, never corrected. `[corpus]`

**F15 — Nothing links a rendered element to a design node. Still zero, after the backfill.**
Re-verified for this analysis: `data-figma-node`, `data-node-id` and `figmaNode` across all nineteen
`generated/` trees and `examples/lit/src/_runs/` — **0 hits**. The design side carries 2,701
placeable node ids; the code side carries none. Until an implementer emits that attribute, every
`codeTarget` in a registry is a structural-matching heuristic, and the per-element comparison, the
viewer's hotspot anchors and the registry key all rest on it. **This is the cheapest high-leverage
item in the whole design and it is a prerequisite, not a feature.** `[corpus]`

**F16 — 275 asset references, 214 distinct files, 0 bytes saved, 18 of 19 runs affected.** Every
reference goes through `assetPathPrefix = "https://www.figma.com/api/mcp/asset/<uuid>"`, 55 prefixes
in all. No run has a `captures/assets/` directory. The capture's own advisory claims seven-day
expiry; testing established the URLs return `404` immediately, including five minutes after capture.
This is the one gap that cannot be closed later — metadata, context and mappings can be re-fetched
from the file at any time, and an asset URL embedded in a capture is dead on arrival. (The figure
in `CAPTURE-PROTOCOL.md` — 194 files across 53 prefixes — predates the backfill and is now stale.)
`[corpus]`

**F17 — 213 hidden nodes vanish without trace; one run records it.** `hidden="true"` nodes appear in
`get_metadata` and are simply absent from `get_design_context`. Only `b-kampus-notes-panel` carries a
`notCaptured` array, and only because a human added the field. Without a documented skip rule these
count as unaccounted and silently depress any coverage metric. `[corpus]`

### C. How absence, failure and uncertainty must be represented

**F18 — The recurring fault now has eleven instances, and the eleventh was committed today, by the
harness written to measure it.** `render-design.mjs` computed its undefined-component list, used it
to inject the stubs, and never attached it to the region it reported — so the summary said
`undefinedComponents: []` for every run, and a `?? []` on the way out made "none" indistinguishable
from "never looked". Fixed in `56af4ec81`; A8 now reports `Mask`, the symbol that cost that run 140
nodes. The previous ten: a theme ranking with a winner over zero evidence; a token checker reporting
`clean` having scanned nothing; a type gate certifying 125 real errors as clean for an entire batch;
"eleven runs captured nothing" when six held unreadable data; one undefined component silently
reducing a region from 179 nodes to 39; an icon inventory of 34 where the theme has 54; Code Connect
collapsing 91% of a design into `<sl-grid></sl-grid>` and reporting success; a subtree `{}` read as
"unconnected"; a 64% override rate over a denominator of zero; and `libraryPct: 96` for a design with
0% SLDS.

The pattern is one shape every time: **silence and success share a representation.** The contract's
single most important obligation follows directly — every measurement carries what it _examined_,
not only what it _found_, and a ratio carries its denominator and is `null`, never `0`, when the
denominator is zero. `[corpus]`

**F19 — The most common outcome of a run is a halt, and nothing models it.** Six of ten measured
designs are not drawn against the design system, and Stage 1 halts permanently on them. Six
coordinators across five runs ended a turn on a status line with later stages unattempted, leaving a
plausible-looking `progress.json` behind. A contract that models only the complete run cannot record
the majority case — so the terminal state must be an enum where a run ends on `completed` or
`blocked{reason}`, and **never on an absent field**. `[provisional]`

### D. What a discrepancy entry needs beyond both values

**F20 — Both sides, with their provenance, and then three things more.** Recording `intended` and
`applied` each with a `source` enum (`design-token` / `palette-token` / `hex` / `figma-variable` /
`inherited` / `computed`) is what turns a list of differences into statistics. The batch adds three
requirements the drafts did not fully state:

- **Name equality never implies value equality.** `--sl-size-500` is 40px; Figma's `Size/500` is 20.
  A run mapped by name and shipped a 2× padding defect. Every numeric value needs an explicit unit
  and scale namespace.
- **A resolved value is not a property of the theme alone.** `--sl-label-md-fontSize` resolves
  through a `-userGroup` variable declared under `[data-user-group=…]` that nothing sets, so ~12px
  lands where the design expects 18; one theme declares 914 of 1,655 properties with more than one
  distinct value. The applied side must record its **resolution context** — ancestor attributes,
  viewport — and whether the value actually resolved at render time. `'Open Sans'` written 29 times
  does not resolve; `open-sans` written 18 times does, and the same string measures 218.5px against
  247.4px.
- **Reachability is a field, not a judgement.** Of 14 distinct colours in one design, 5 have an exact
  token and **9 have none**, with a largest unavoidable delta of 31.8. A score that cannot separate
  "the run got it wrong" from "the theme cannot express it" rewards raw hex values and punishes
  correct implementations. `reachable` also turns the threshold into a parameter: recompute at a
  tolerance of 3 and of 10 without re-running anything. `[corpus]`

**F21 — Aggregation needs a source-component key, not a frame key.** Two runs minted
`sl-kampus-left-toolbar` from the same source component with different APIs, and a guarded
registration turns that into a silent mis-render; another produced three mutually incompatible
`AppHeader`s with no symptom, because their namespaces differ. Keyed on source component ids, two
runs of one file shared 15 of 32 components, four of them field-for-field identical. **Component
identity must key to the source Figma component**, and a contract must be derivable from every frame
that uses it, recording which frames contributed. The same applies to the design-system bucket: one
missing icon across four runs is one item for the design system team, not four. `[corpus]`

**F22 — Only one half of a registry can drift, and it is the small half.** Measurements are
regenerated wholly every run and nothing about them is stored, so there is nothing to keep in sync;
only human verdicts need durable identity, there are few of them, and they change slowly. A verdict
must carry the value it was issued against, so that a designer changing `#7C51A9` **expires** the old
acceptance instead of silently covering a new state; and when its anchor vanishes it becomes
`stale`, which is not the same as `fixed`. `[corpus]`

### E. The mechanism

**F23 — zod is not a dependency of this repo; ajv is.** zod appears in `yarn.lock` only
transitively, in **three versions at once** (3.25.58, 4.4.3, 4.3.6), and does not resolve from the
root. `ajv` 8 is installed and resolves today. Meanwhile the writers of these records are LLM agents
emitting JSON and markdown, and the readers are `.mjs` harness scripts _and_ a Python toolkit
(`sl-aipdlc` runs under `uvx`). A TypeScript-first schema serves the agent not at all and the Python
reader not at all unless JSON Schema is generated from it. **The normative artifact must be
language-neutral; the authoring surface is a separate, smaller decision.** `[corpus]`

**F24 — A prose schema does not hold against an agent, and neither does an unenforced one.** F9 is
the direct evidence: seven sections specified in prose, 100 one-off headings produced. F3 is the
other half: a version written nineteen times and never checked. The conclusion is not "write a
stricter document" — it is that **the schema must be a gate the producing agent cannot pass by
writing prose**, and that the gate must run inside the pipeline, not in a later audit. `[corpus]`

## What would change our mind

- **The control runs produce artifacts materially different in shape from the nineteen supervised
  ones.** Section A is an inventory of a supervised corpus; if the unmodified skill writes a
  different set of files, every `[provisional]` requirement and much of A must be redone against the
  control corpus. This is the single largest threat to this analysis and it is already testable —
  the prompts exist in `runs/control/PROMPTS.md`.
- **A faithful raster turns out to be obtainable** (for instance via the REST `images` endpoint with
  an explicit scale). Then appearance becomes measurable, and the contract needs a real image
  comparison block rather than a distortion record.
- **Figma exposes variable-mode names** through a call not yet tried. Then F12's `mode: unknown`
  collapses into an ordinary field and the `ambiguous` diff state can be dropped.
- **`data-figma-node` proves impossible to emit reliably** — for instance because a component absorbs
  several nodes with no principled owner. Then correspondence stays heuristic, and the per-element
  entry shape in F15 and F21 changes substantially.
- **Someone demonstrates a consumer that needs the full registry taxonomy now.** The sequencing in
  the recommendation rests on there being no such consumer today; one query that genuinely needs
  six dimensions × six sources × three owners would reorder the work.

## Conclusion / recommendation

### The contract is three artifacts with three different lifecycles, not one file

Treating them as one is what makes the design feel intractable. Separated, each has an obvious
owner and an obvious versioning policy.

| Artifact                 | Written by                                            | Lifecycle               | Can drift             | Status             |
| ------------------------ | ----------------------------------------------------- | ----------------------- | --------------------- | ------------------ |
| **Run record**           | the pipeline, per run                                 | append-only, immutable  | no                    | **v1 now**         |
| **Capture index**        | the ingestion step                                    | rewritten on re-capture | no                    | **v1 now**, exists |
| **Discrepancy registry** | measured half: regenerated; decided half: human, once | split                   | only the decided half | **blocked on F15** |

The recommendation that follows is the one this analysis did not expect to reach: **do not write the
registry schema first.** It is the centre of the system, and it has an unbuilt prerequisite. Without
the node-to-element link, every key in it is a heuristic, and a key chosen now would be the thing
we cannot change later. Build the attribute, then the registry.

### Requirements

Each is anchored to a finding. `[corpus]` requirements rest on evidence about designs and Figma;
`[provisional]` ones rest on a supervised pipeline and must be re-checked.

**Identity and provenance**

- **R1** Store the file key and the operator-supplied URL as run parameters. Figma returns neither.
  (F10) `[corpus]`
- **R2** Store the **queried** node id and the **resolved markup root** node id as two distinct
  fields; never conflate them. (F11, F1) `[corpus]`
- **R3** Store a structural fallback anchor — node name, ancestor-name path, geometry — alongside
  every node id, because 27% of elements have no id and a recreated layer gets a new one. (F11) `[corpus]`
- **R4** Record node-id form (`plain` vs `composite instance path`); composite ids do not survive
  detaching. (F11) `[corpus]`
- **R5** Record theme as `assigned` and `derived` separately, with the derivation evidence
  (matched/total, method) — never a single `theme` field, and never an object in some runs and a
  string in others. (F7, D) `[corpus]`
- **R6** Record `variableMode` with an explicit `unknown` + reason; it is not exposed by any call.
  (F12) `[corpus]`
- **R7** Record the MCP server identity per call — behaviour differs between remote and desktop.
  (F10) `[provisional]`
- **R8** Pin the **pipeline subtree** hash, not repo HEAD, plus the ruleset in force. Five hints and
  three rules were added mid-batch; records produced under different rulesets are not comparable.
  (F19) `[provisional]`
- **R9** Record, per stage, whether it was executed by its stage agent, the orchestrator, or a human.
  Ten of eighteen runs record stage agents and all eighteen also record orchestrator work. (F19) `[provisional]`
- **R10** Separate `capturedAt` from `indexedAt`. Keeping one name for both inherits the current lie.
  (F5) `[corpus]`
- **R11** All timestamps carry a timezone. (F5, F7) `[corpus]`

**Absence, failure and uncertainty**

- **R12** Every measurement carries what it **examined**, not only what it found: files scanned,
  references seen, nodes probed. (F18) `[corpus]`
- **R13** Silence and success must not share a representation. A verdict enum must include
  `nothing-examined` distinctly from `clean`. (F18) `[corpus]`
- **R14** A ratio carries its denominator and is `null`, never `0`, when the denominator is zero.
  (F18) `[corpus]`
- **R15** A run terminates on `completed` or `blocked{reason}` — never on an absent field. The halt
  is the majority outcome and is data, not failure. (F19) `[provisional]`
- **R16** Distinguish `not-captured` from `captured-but-unreadable`, and `not-probed` from
  `probed-and-absent`. One `{}` meant both and blocked a fully-mapped design. (F13, F18) `[corpus]`
- **R17** Record hidden/skipped nodes explicitly, so a coverage metric is not depressed by nodes
  nobody missed. 213 of them, one run recording it. (F17) `[corpus]`
- **R18** Every claim carries its producer and evidence type: `harness` / `agent` / `human`. A number
  an agent writes about its own run is not a measurement — one cost figure in the batch was
  fabricated, and the bases differed by two orders of magnitude. (F18, D) `[provisional]`

**Values and measurement**

- **R19** Record `intended` and `applied` as a pair, each with `value`, `source` (enum), `token` and
  the **call it came from** — one run saw `#32005a` and `#29076e` for the same token from two calls.
  (F20) `[corpus]`
- **R20** Every numeric value carries an explicit unit and scale namespace; name equality must never
  imply value equality. (F20) `[corpus]`
- **R21** The applied value records its resolution context and whether it actually resolved at render
  time, including the full `var()` fallback chain. (F20) `[corpus]`
- **R22** `reachable` is a stored per-entry field, and thresholds are **not** stored — they are
  inputs to a view, so the corpus can be re-scored at any tolerance without re-running. (F20) `[corpus]`
- **R23** Every box carries its coordinate space; every delta names its metric. (F14, D) `[corpus]`
- **R24** The reference raster record carries: node shot, pixel dimensions, frame dimensions at
  capture, per-axis scale, channel-maximum check, distortion class. Recorded, never corrected.
  (F14) `[corpus]`
- **R25** Comparison type is a field — `build-vs-design` and `build-vs-build` have different
  validity, because only the design side is distorted. (F14) `[corpus]`

**Aggregation and change**

- **R26** Component identity keys to the **source Figma component**, not the frame being processed,
  and records which frames contributed. (F21) `[corpus]`
- **R27** Design-system findings aggregate on a cross-run key; one missing icon in four runs is one
  item. (F21) `[corpus]`
- **R28** Only verdicts are stored durably; measurements are derived and regenerated wholly. A
  verdict carries the value it was issued against and **expires** when that value changes; a vanished
  anchor becomes `stale`, which is not `fixed`. (F22) `[corpus]`
- **R29** Records support N runs of the same (design, pipeline version) pair, so that variance can
  finally be measured. Every run so far is a sample of one. (F22) `[provisional]`
- **R30** `mode` partitions any aggregate: strict and as-is runs must never be averaged together.
  (F19) `[provisional]`

**Versioning and enforcement**

- **R31** The normative artifact is **language-neutral** (JSON Schema), whatever authoring surface
  produces it. Readers include `.mjs` scripts and a Python toolkit. (F23) `[corpus]`
- **R32** Every reader **validates and rejects** an unknown or unsupported version. A version field
  without an enforcing reader is decoration — proven nineteen times over. (F3) `[corpus]`
- **R33** Every output records the **script name and version that produced it**, not only the schema
  version. No harness script declares a version today and no output names its producer, so a number
  from a broken checker is indistinguishable from one from a fixed checker — which is exactly what
  happened when a theme matcher returned a confident wrong answer before its fix and a correct one
  after. (F18, B) `[corpus]`
- **R34** The schema is a **gate inside the pipeline**, not a later audit, and one an agent cannot
  pass by writing prose. A prose schema produced 100 one-off headings. (F24, F9) `[corpus]`
- **R35** No field may be added that no named question needs. The current draft taxonomy is roughly
  six dimensions × six sources × three owners × four statuses and zero queries have ever been run
  against it. (anti-bias pass) `[provisional]`
- **R36** Drop fields that carry no bits — `truncated` as currently written, the constant `verdict`,
  `normalisedFrom` — or make them true. (F4) `[corpus]`

### The acceptance test

Taken from [`draft-next-steps.md`](../NOJIRA-figma-to-code/draft-next-steps.md) and adopted here as
the gate: **v1 is wrong unless it can record, from the data already on disk,**

1. B-Kampus's unreachable palette — 9 of 14 colours with no token, largest unavoidable delta 31.8;
2. A10's variable modes — one node resolving two ways in two frames, with the mode unknowable;
3. the `::part()` specificity hazard;
4. A3's `24 + 8 = 32` decomposition, as a cause rather than a constant.

To which this analysis adds two more, from findings the drafts predate:

5. **a blocked run** — Stage 1 halt on a design with zero mappings, which is the majority case;
6. **a measurement that examined nothing** — distinguishable, in the record, from one that found
   nothing.

The test costs no new building: it is a retrofit over nineteen runs, and it fails the same day if
the shape is wrong.

### Sequence

1. **Run record + capture index, v1** — small, language-neutral, enforced by a validating reader,
   retrofitted to all nineteen runs. This is where the versioning discipline is established.
2. **`data-figma-node`** — one attribute emitted by the implementer. Prerequisite for 3.
3. **Discrepancy registry, v1** — measured half derived, decided half durable, keyed on something
   that now exists.

Steps 1 and 2 are independent and can run in parallel.

## Open questions

Carried forward deliberately, not resolved here. The first four the contract must decide; the rest
belong to other owners.

1. **What counts as one element**, given that one design node can become five rendered elements and
   one component can absorb three nodes. The unsettled question from
   [`draft-measurement-method.md`](../NOJIRA-figma-to-code/draft-measurement-method.md), and the one
   that most shapes the registry's row granularity.
2. **How an entry is keyed when no Code Connect mapping exists** — the majority of this corpus.
3. **Whether the registry is one file per run or per component**, and whether `accepted` entries
   leave a score's denominator or are reported separately.
4. **What produces entries** — a measuring pass, the implementer declaring them as it works, or both.
5. **Normalise the reference, or never.** Two documents in the context state opposite requirements:
   [`pipeline-defects.md`](../NOJIRA-figma-to-code/pipeline-defects.md) says normalisation must
   happen once in the harness so runs stay comparable;
   [`draft-measurement-method.md`](../NOJIRA-figma-to-code/draft-measurement-method.md) says never
   scale a reference and then score against it. The later document and
   [`draft-next-steps.md`](../NOJIRA-figma-to-code/draft-next-steps.md) take the second side, so it
   supersedes in practice — but the contradiction is unretracted and should be settled explicitly.
6. **Whether a theme may be inherited from a sibling frame.** Theme derivation was established as
   per-frame, yet one run's theme was resolved by inheriting a sibling's. Both cannot be right, and
   the contract needs to know whether `inherited-from-sibling` is a legitimate provenance value.
7. **One score or two.** A single fidelity score is contradicted by the finding that the same design
   scores badly under one definition and perfectly under the other; the registry draft claims both
   audiences produce the same registry with different distributions. Compatible only if `mode`
   partitions the score but not the schema — which nothing yet states.
8. **Tolerances per dimension, and who owns them.** Stated to belong to the design system, not the
   harness; nobody has accepted them.
9. **Whether a faithful raster is obtainable at all**, which decides whether the appearance term is
   worth anything.
10. **Who owns the frozen corpus Figma file** and how it is protected from edits. Without that
    guarantee, results are not comparable across runs and the method degrades silently.

## Leads to

- Decision: `AD-NOJIRA-figma-metadata-contract` — the authoring surface and validation mechanism
  (JSON Schema directly, or zod with generated JSON Schema, given F23), the versioning policy, and
  the file layout. Blocked on this analysis reaching `status: done`.
- Plan: `P-NOJIRA-figma-metadata-contract` — v1 schemas, the validating reader, the retrofit over
  nineteen runs, and the `data-figma-node` change in the implementer.
