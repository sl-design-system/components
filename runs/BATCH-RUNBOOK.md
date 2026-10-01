# Batch reference run — runbook

Written before a context compaction, so the work survives it. Everything needed to execute the
batch is here; nothing depends on remembering the conversation that produced it.

**Goal:** one complete pipeline run per reference design, kept as the baseline later runs are
compared against.

## Scope: 18 designs

The 19 unique reference nodes are listed with file keys, node ids and links in
[`../context/analyzes/NOJIRA-figma-to-code/corpus-candidates.json`](../context/analyzes/NOJIRA-figma-to-code/corpus-candidates.json)
(`fidelityCorpus` + `representativenessSample`, deduplicated by `source.fileKey` + `source.nodeId`).

**SANNA `Login 1` is already done** — `2026-10-01-a9-sanna-login/`. Eighteen remain.

## Stage 0 answers — identical for every run, do not re-ask

| Setting          | Value                                 | Why                                                                                               |
| ---------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Figma MCP server | **`figma`** (remote)                  | measured: remote answers in seconds, desktop times out. Overrides the plugin's own recommendation |
| Framework        | `lit`                                 | native to the design system, shortest path to a rendering harness                                 |
| i18n             | **off**                               | its Stage 3 gate can halt a run for reasons unrelated to fidelity                                 |
| Output location  | `examples/lit/src/_runs/<case-slug>/` | inside the tsconfig include and gitignored                                                        |

## The Stage 4 blocker — resolved, 2026-09-30

Two causes, not one. The runbook anticipated Font Awesome; it did not anticipate that **no local
workspace was linked into `node_modules/`**, which is what actually stopped the server. Both are
removable without a credential. Details and evidence:
[`runs/harness/README.md`](harness/README.md).

**The harness is built and validated. Run agents must not rebuild it, and must not start a
Storybook of their own.** One server serves every run, and picks up new run folders as they
appear.

```sh
runs/harness/start.sh            # supervisor starts this once, before the batch
```

```
http://localhost:6010/iframe.html?id=<storyId>&viewMode=story&globals=theme:<theme>
http://localhost:6010/index.json    # authoritative list of story ids
```

Capture with the harness's own script rather than a shared browser — eighteen runs cannot take
turns with one:

```sh
node runs/harness/shoot.mjs --story <id> --out <run>/testing/<name>.png \
  --theme <theme> --width <w> --height <h> [--full]
```

It writes the image plus a `.json` report — console errors, failed requests, and per custom
element whether it registered, has a shadow root and a non-zero box — and **exits non-zero when
nothing rendered**. A capture is not evidence until that verdict says `rendered`.

**Derive the theme from the design, never from the product label.** The original mapping here was
a guess, and the deeper error was the shape of it: two NSP designs in this corpus resolve to two
_different_ themes (`max` and `sanoma-learning`, each at 100% token agreement). A per-team mapping
cannot be correct in principle.

```sh
node runs/harness/theme-match.mjs <run>/figma-variable-defs.json
```

Record the derived theme, the margin over the runner-up and the absolute agreement in
`progress.json`. A run captured under the wrong theme measures the wrong theme, and no amount of
pixel comparison afterwards can tell you that is what happened.

## Nesting works — measured, not assumed

Probed before committing to the architecture: a `general-purpose` agent **can** spawn its own
subagent and receive its result. So each run agent can drive the plugin's own stage agents, which
means the batch measures the real pipeline rather than an imitation of it.

The probe also produced a number worth budgeting for. A subagent that used **no tools** and replied
with a single word still consumed **~35,500 tokens** — the fixed cost of standing an agent up. The
per-stage figures from the first run already include their own baseline, so what the orchestrator
layer adds is roughly 18 × 35k ≈ 0.6M on top.

**Budget estimate for the batch: 8–12M tokens.** The first run cost ~373k on a 894-node screen;
NSP `class overview` has 10,936 nodes and will cost several times that. Worth watching rather than
assuming.

## Per-run procedure

One orchestrator subagent per design, each running its own six stages, so the supervising context
holds 18 results rather than a hundred.

**What the supervisor does once, up front:** builds and validates the render harness, and confirms
the Figma remote server is authenticated. **What each agent is given:** its case (file key, node
id, name), the four Stage 0 answers, the four prompt hints below, the path to this runbook, and
the exact command that renders a story. Nothing it has to work out for itself.

For each run:

1. Create `.implement-design/<file-slug>-N/` and run the pipeline per
   `tools/implement-design-plugin/skills/implement-design/SKILL.md`.
2. Carry the four Stage 0 answers above; **do not ask the user anything**.
3. Record every decomposer open question **with the default chosen** — the first run produced nine
   on the simplest screen, and they are the main variance source.
4. Write `progress.json` after every stage (see _Resuming a stage that failed_). On a blocker, record it there with its reason and stop that run. **One run failing must not stop the batch** — and a run that stopped must be resumable without repeating what already succeeded.
5. Promote the finished run to `runs/<date>-<case-id>-<slug>/`, including a `generated/` snapshot
   of the code, and commit. Commits need `FONT_AWESOME_AUTH_TOKEN=dummy` because the pre-commit
   hook expands the variable.

## Four prompt hints, and what needing them really means

The first three were passed by hand on the first run and made the difference. The fourth comes
from validating the render harness. Pass all four, **and note that needing to is itself the
finding**: `T-NOJIRA-figma-to-code-02` exists to move them into the extraction and the framework
skill so no future run depends on somebody remembering.

- **`hasTemplate: false`** is a third state between resolved and `null` — a mapping identifying a
  component without emitting a snippet. Treat it as identified, not as unconnected. Without this
  the analyst may block.
- **Instance counts mislead.** A screen with 318 instance nodes has six components; the rest are
  their internals. Count what a developer would place.
- **`(unbound — needs a token)` is usually wrong.** On the first run all five flagged values had
  exact tokens already. Search the theme for an exact match before approximating.
- **The story must import the component for its side effect.** The first run wrote
  `import { type Thing } from './thing.js'`; the inline `type` modifier erases the import, the
  module never runs, and `customElements.define` never happens — so Storybook renders an unknown
  element with no shadow root. Add a plain `import './thing.js';`. The type check passes either
  way, which is why nothing in the pipeline catches it.

## Two constraints added during the batch, after wave 1

Both come from observing wave 1 rather than from planning, and both exist to stop eighteen agents
solving the same problem eighteen different ways.

**Icons: use only what the theme registers.** The runbook's Font Awesome analysis checked whether
any _SLDS component_ imports Font Awesome. It does not — but the **generated code** does, reaching
straight for `@fortawesome/pro-regular-svg-icons`. That is the other side of the boundary and it
was missed. The rule now: use only icons present in the theme's own `icons.ts`. An icon the design
needs and the theme does not have is left out and **recorded as a Stage 4 discrepancy**. Never
install it, never stub the module, never draw a replacement — one wave-1 run substituted a
hand-drawn inline SVG, which puts invented artwork into something that is about to be
pixel-compared.

**The Stage 3 gate is unreachable as the pipeline defines it, so the batch redefines it.** `tsc`
exit 0 cannot happen here: two errors in `packages/components/grid/src/grid.ts` are committed
upstream and unrelated to anything generated. Runs use
`node runs/harness/typecheck.mjs --scope examples/lit/src/_runs/<case-slug>` instead, which fails
on any error in the generated code and on any _new_ error elsewhere, while tolerating the two
recorded baseline errors. This is the root cause of the item below — the workaround appeared
because the gate could not be satisfied honestly.

**A stub must never be what makes a gate pass.** A wave-1 implementer wrote a local `.d.ts` to
mask the missing Font Awesome module; `tsc` went green and the Stage 3 gate reported clean. The
stub was removed afterwards, but the gate had already been satisfied by exactly the thing it
exists to catch. Stage 3 is one of only two gates blocking Stage 4, so this is a finding about the
gate. Until it is fixed, the run agent re-runs the type check itself with no stub files present.

**A run agent does not stop while stages remain.** One wave-1 orchestrator ended its turn with
"watching for both leaf reworks to clear" — a status line, not a result, with Stages 4 to 6 not
attempted. Waiting on a child is not a stopping point; only a finished run or a recorded blocker
is.

## Resuming a stage that failed

The pipeline has **no resume protocol** — its skill describes none, and nothing records how far a
run got. But every stage's output does land on disk, so the material to resume from exists. What is
missing is the bookkeeping, and adding it costs almost nothing.

**Each run agent writes `progress.json` into its run folder**, updated after every stage:

```json
{
  "case": "A1-kampus-subchapter-feed",
  "pipelineCommit": "<git rev-parse HEAD>",
  "figmaFileVersion": "<from the file's metadata>",
  "stages": {
    "1-ingest": { "status": "done", "at": "…", "tokens": 78410 },
    "2-decompose": { "status": "done", "at": "…" },
    "3-implement": { "status": "done", "at": "…", "typeCheck": "clean" },
    "4-validate": { "status": "blocked", "at": "…", "reason": "render harness returned 500" },
    "5-author": { "status": "not-reached" },
    "6-review": { "status": "not-reached" }
  }
}
```

That makes a later pass mechanical: read every `progress.json`, select the runs whose Stage 3 is
`done` and Stage 4 is not, and re-run **only** Stage 4 onward for those.

**What each stage needs in order to be resumable:**

| Resume at | Needs                                       | Where it is                                                    |
| --------- | ------------------------------------------- | -------------------------------------------------------------- |
| Stage 2   | the manifest                                | `manifest.md`                                                  |
| Stage 3   | manifest + decomposition                    | `manifest.md` (both sections)                                  |
| Stage 4   | the generated code, plus a working renderer | `generated/` snapshot, restored into `examples/lit/src/_runs/` |
| Stage 5–6 | Stage 4's verdict and captures              | `testing/`                                                     |

The `generated/` snapshot is therefore not only evidence — **it is the resume source**. The live
tree under `examples/lit/src/_runs/` is gitignored and a clean checkout wipes it, so a resume
restores from the snapshot rather than regenerating.

**One thing a resume must refuse** — and the test is narrower than it first looked. If the
pipeline has changed since the stage that succeeded, the resumed run is half old and half new and
its numbers describe neither, so `progress.json` records a stamp and a resume across a different
one **fails loudly**.

The first version of this stamped `git rev-parse HEAD`, which is wrong, and trying to use it is
what showed why: HEAD moved eleven commits during the batch — harness fixes, findings, promoted
runs — while `tools/implement-design-plugin/` was touched **zero** times. Guarding on HEAD refuses
every resume for changes that cannot affect a run, and a guard that always fires gets switched off.

So the stamp is the **pipeline tree hash**: `git rev-parse HEAD:tools/implement-design-plugin`.
It changes when the pipeline changes and at no other time.

This is a small, local implementation of a decision already recorded in
[`A-NOJIRA-pipeline-staging`](../context/analyzes/NOJIRA-pipeline-staging/analysis.md)
F11 — checkpoint per artifact, resume and normal execution on one code path. The batch is a chance
to find out whether that design holds before it is built into anything.

## What to record per run

Duration and token cost per stage; whether each stage completed or blocked and on what; the
decomposer's open questions and chosen defaults; any mapping that proved valid-but-wrong; and any
raw value flagged unbound that turned out to have a token.

## When the batch finishes

Write a comparison across all runs into
`context/analyzes/NOJIRA-figma-to-code/smoke-run-findings.md` — or a sibling if it grows too large.
The interesting question is **which findings generalise**: nine open questions on the simplest
screen suggests many more on Kampus with its 83 component types, and that relationship is the point
of running all eighteen rather than three.
