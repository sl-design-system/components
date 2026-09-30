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

The theme per product is in the harness README and is recorded in each run's `progress.json`,
because it changes every measured pixel. MyPortal (A3, A7) has no resolved theme package and falls
back to `sanoma-learning` — any colour or type difference there may be the theme rather than the
run.

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

**One thing a resume must refuse.** If the pipeline commit has changed since the stage that
succeeded, the resumed run is half old and half new, and its numbers no longer describe either.
`progress.json` records the commit precisely so that a resume across a different one **fails
loudly** instead of quietly producing a mongrel baseline. Same discipline as the corpus freeze
stamp, for the same reason.

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
