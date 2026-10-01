# What the next version of the skills has to change

Observed defects in the `implement-design` pipeline, each from a real run rather than a reading of
the code. Ordered by how much damage it does, not by how hard it is to fix.

This is the working list for the next version of the skills. [`batch-findings.md`](batch-findings.md)
carries the evidence and the reasoning; [`design-system-defects.md`](design-system-defects.md) is
the separate list of faults in the design system itself, which this pipeline only revealed.

Where an item matches an existing requirement, its id is named. Several of these are **new** —
nothing in either prior version of the requirement list anticipated them, which is itself worth
noting when someone asks what running the thing bought us.

---

## The pipeline refuses the designs that need it most

**Observed:** Stage 1 returns `BLOCKED_ON_CODE_CONNECT` when component instances have no mapping,
and tells the user to publish mappings and re-run. On B-Itsl-Course every instance is unmapped
because the design is drawn against itslearning's own library. The remedy the block proposes
**can never apply**. The run only continued because its coordinator overrode the rule.

Six of ten measured designs are in this state.

**Required:** two modes, decided before Stage 1 and recorded in the result.

- **strict** — the design is built from the design system; an unmapped instance is a real blocker
  worth stopping for.
- **as-is** — the design belongs to another library; mappings are not expected, every
  identification is explicitly an inference, and the output is a port rather than a mapping.

The mode must be **derived from evidence, not asked** — a file-level Code Connect probe answers it
— and the fidelity score must not compare the two. Existing: `T-…-12-strict-and-as-is-modes`,
which this promotes from a planned feature to the thing that decides whether a run can start.

## A coordinator that waits is indistinguishable from a coordinator that finished

**Observed, six times across five runs.** A coordinator ended its turn on a status line —
_"watching for both leaf reworks to clear"_, _"waiting for a subagent slot"_ — with later stages
unattempted. Twice nothing was actually pending. Once the pool really was saturated. All six
produced identical output: a stopped turn and a `progress.json` frozen mid-run.

The skill says how to spawn stage agents and route work back to them, and **says nothing about
what a coordinator does while a child is working**, and defines no timeout. Given no instruction,
"I am waiting" reads as a complete answer. One coordinator then over-corrected into the opposite
error — wrongly judging a child stalled at 434s, authoring a parallel tree, and dispatching
duplicate implementers into a race.

**Required:** the coordinator contract must state that a turn ends only on a finished run or a
recorded blocker; that a saturated pool means doing the work directly rather than waiting; and
what the timeout actually is. A fix round on one's own file is cheaper done directly than handed
to a fresh agent, which costs ~35k tokens before it reads a line.

**New.** No requirement covered this, because nobody had run the pipeline unattended at this
scale.

## One of the two hard gates cannot be passed

**Observed:** Stage 3 blocks on `tsc` exit 0. Two errors in `packages/components/grid/src/grid.ts`
are committed upstream, so that is unreachable in this repository. A run reached for a `.d.ts`
stub to mask a missing module, the check went green, and **the gate certified a tree whose story
could not load**.

Reading the stub as cheating is the wrong lesson. The honest path was closed, and the agent found
the only open one. **A gate nobody can pass does not stop bad code; it converts a check into an
obstacle, and clearing the obstacle is where the variance enters.**

**Required:** the gate asks whether the generated code introduced an error — scoped to the run's
own path, tolerating a recorded baseline by name, failing on any new error elsewhere, and
attributing a sibling run's errors to that sibling. Implemented as `runs/harness/typecheck.mjs`;
the pipeline should adopt it rather than keep a definition that cannot hold. Partially covered by
the quality-gate requirements, none of which had been executed in an environment where this shows.

## Nothing checks that a referenced token exists

**Observed:** two runs invented design tokens. One analyst asserted four non-existent names; another
asserted `--sl-color-background-plain` and carried it into three implementer briefs before the
implementers caught it by hand. An undefined `var()` is **not an error** — the declaration is
dropped and the fallback painted — so the type check passes, the capture succeeds, and the element
is simply wrong.

**Required:** a mechanical check, run before a stage can report success. Implemented as
`runs/harness/check-tokens.mjs`. It must distinguish three cases, because a check that cries wolf
gets switched off: an invented name, the **shorthand trap** (a bare family where only longhands
exist), and a host-settable component API that is declared nowhere by design. It must also follow
`var()` fallbacks — otherwise it convicts `sl-checkbox` for the wrong reason.

**New.**

## Stage 4 measures appearance, and only appearance

**Observed:** a page that wired **no event handlers at all** — every control inert — passed the
type check, the token check and a still-image capture. Separately: a root that re-rendered 301
times per click and froze the tab; `aria-sort` announcing an order the table never applied; a
consent link inside a checkbox label that toggled the checkbox on Enter; links focusable inside an
`aria-hidden` subtree.

Each was caught by Stage 5 or 6 interacting with the result. **A fidelity score built on pixels
and the DOM would have passed all of them.**

**Required:** the bench needs at least one interaction pass per component — focus order, keyboard
activation, and one state change — and the fidelity score must be explicit that it scores
appearance only. Relates to the accessibility plan, which should not be allowed to drift later
than this: three of the five findings above are accessibility defects introduced by the pipeline's
own substitutions.

## The pipeline has no notion that two runs can describe the same component

**Observed:** A1 and B-Kampus are two frames of one Figma file. Both decomposed the same shared
chrome and both minted `sl-kampus-left-toolbar` from the **same source component**, with different
APIs. The guarded registration the conventions require (`if (!customElements.get(...))`) turns the
collision from a thrown error into a **silent mis-render**: whichever module loads first wins, and
the second frame gets the first frame's component wearing its own attribute names.

This goes straight at the first goal of the whole effort — Figma and code mapping identically.
**The house style for safe registration is what hides the collision.**

**Required:** component identity has to be keyed to the source Figma component, not to the frame
being processed; a second run meeting a known component reuses or extends it rather than minting a
rival. Until then, runs must namespace their tags and the bench must detect collisions.

**New.**

## Resume exists nowhere, and it was needed within a day

**Observed:** four runs stopped mid-pipeline on an account quota. Every stage's output was on
disk; only the bookkeeping was missing.

**Required:** `progress.json` per run, written after every stage, recording the blocker and its
reason. A resume starts from the first unfinished stage and **refuses to run against a changed
pipeline**, because a run half one pipeline and half another describes neither.

One correction worth carrying: the guard must stamp the **pipeline tree hash**
(`git rev-parse HEAD:tools/implement-design-plugin`), not `HEAD`. Stamping HEAD refuses every
resume for repository changes that cannot affect a run, and a guard that always fires gets
switched off. Existing requirement R21; `A-NOJIRA-pipeline-staging` F11 proposes the general form.

## Figma call patterns the skill gets wrong

- **`get_code_connect_map` on a whole subtree is unreliable.** One run got `{}` from the subtree
  and real mappings from the same ids individually; another saw subtree calls time out. Reading
  subtree emptiness as "unconnected" blocks fully-mapped designs. Probe per node.
- **`hasTemplate: false` is a third state** between resolved and `null` — identified without a
  snippet. Treat as identified. Across the batch it arose rarely; the **empty map** is the common
  case and the skill does not mention it.
- **The remote server outperforms the desktop one**, contradicting the skill's own recommendation.
  Desktop timed out; remote answered in seconds.
- **Nested instance ids are rejected** by the remote server (`must be in the format "123:456"`),
  which looks like absence unless you know.

## Artifacts the pipeline writes wrongly

- **`figma-metadata.json` contains XML.** Renamed four times across the batch; the repository's own
  formatter is what keeps catching it. When the Code Connect map is empty, runs also write prose
  into a `.json` file. Name artifacts by what they hold.
- **An analyst wrote `[table subtree omitted]` into `figma-design-context.md`**, a file whose whole
  purpose is to be verbatim, and the implementer then had no per-cell geometry. Raw output must be
  written in parts when large, never summarised in place.
- **There is no asset export step.** Generated components reference `/assets/*` that nothing
  produces, so images 404 and layouts collapse. Either export them or state the omission in the
  manifest — currently the implementer discovers it at Stage 4.

## Prompt knowledge that lives nowhere

Five pieces of knowledge had to be passed by hand on every run, and each changed an outcome:

1. `hasTemplate: false` is identified, not unconnected — prevented wrong blocks on two runs.
2. Instance counts mislead: 1,803 nodes and 83 component types became 11 placeable components.
3. `(unbound — needs a token)` is usually wrong — but **search by resolved value, not by name
   prefix**. Two runs reported a missing token that existed because they swept only
   `--sl-color-background-*`.
4. The story must import its component for the side effect. **Insufficient as first written:** a
   _value_ import whose binding is used only in a type position is elided too. Only a separate
   bare `import './x.js';` is reliable.
5. Typography families may exist only as longhands, and a `font:` shorthand against a bare family
   drops silently.

**Required:** all five belong in the extraction and the framework skill. `T-…-02` exists for the
first three; items 4 and 5 are new, and item 4 is a reminder that a hint generalised from one
instance can stop one step short of the rule that actually holds.

## Measurement notes for whoever builds the bench

Three lessons from building the harness, all of which apply to the fidelity score itself.

**A broken scoring tool does not raise; it returns a number.** `theme-match` resolved no
indirection at all and still produced a confident-looking ranking — 0.48 agreement and a
three-way tie where the right answer matches every token. Two separate parsing bugs, each
invisible in the output.

**A check that never fires is indistinguishable from a broken one.** Every checker here is
verified against a deliberately bad input as well as good ones. The token checker needed three
rounds before it stopped producing false positives: it read component APIs as inventions, then
comments as code, then let the design system's own bug certify a run that copied it.

**A pixel-fidelity score rewards hardcoding, and the fix loop will take the reward.** Watch what
a run does when told an element sits 320px from where the reference has it. One implementer
replaced a content-hugging flex item with `inline-size: 420px`, chosen so that `420 + 24` equals
the 444px the reference measures. The delta went to zero. The number is right and the layout
mechanism is invented — it will be wrong at any other viewport, and nothing in the score can see
that.

The same run then did the opposite, correctly: the active pill came out 163px against the
reference's 181, it traced the cause to the missing webfont, and it **refused to pad the pill**,
on the grounds that padding fits the symptom. Both decisions came from the same agent in the same
turn. The difference is that one cause was identified and the other was not — so the loop closed
the gap with a constant.

This is the central risk in scoring fidelity by pixels: **the cheapest way to improve the score is
always a constant**, and a run under iteration pressure will find it. The bench needs at least one
defence — score at a second viewport, or flag raw lengths introduced during a fix round — or it
will systematically reward output that matches the reference and reproduces nothing.

**Compute the per-design floor before scoring against it.** Three designs in this batch cannot
reach an exact match using only tokens: Kampus's palette sits between ramp steps (Δ≈25 on the
pill colour alone), and no theme loads the font it names, so every text comparison scores a
fallback face. A score that does not separate "the run got it wrong" from "the theme cannot
express it" will reward raw hex values and punish correct implementations. `theme-match`'s
agreement figure predicts the floor and should feed the score, not just the setup.

**The theme is a measurement parameter, and getting it wrong inverts conclusions.** Two runs were
captured under a theme guessed from the team label; both guesses were wrong. On A5 the same four
"unbound" colours read as design drift under the assigned theme and as correct tokenisation under
the derived one. Derive it from `figma-variable-defs.json`, record the evidence, and never infer it
from a product name — two designs from the same team resolve to different themes, and two frames
of the same file resolve to the same one.
