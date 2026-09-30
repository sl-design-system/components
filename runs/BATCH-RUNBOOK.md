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

## The Stage 4 blocker and how to get past it without a licence

`yarn start` boots the repository-wide Storybook, which loads every component story; 33 of them
import Font Awesome Pro packages from a private registry, and no token is available. Nothing is
cached locally, so a full install cannot succeed either.

**It is avoidable.** Verified: `sl-button`, `sl-form`, `sl-select`, `sl-icon` and `sl-link` import
Font Awesome in **no** non-test file and declare it in **no** `package.json`. The example workspace
(`@sl-design-system/lit-examples`) does not depend on it at all. Only stories, specs and the emoji
browser do.

So build a **minimal render harness** that loads only the case under test:

1. `FONT_AWESOME_AUTH_TOKEN=dummy yarn workspaces focus @sl-design-system/lit-examples` plus the
   component workspaces used. The dummy satisfies yarn's variable expansion; nothing actually
   resolves from the private registry for these workspaces.
2. A minimal Vite (or Storybook) config whose story glob covers **only** `examples/lit/src/_runs/**`.
3. Point the visual validator at that, not at `yarn start`.

This is not a workaround to be undone later — it is the bench's own decision, recorded in
[`ARCH-fidelity-scoring`](../context/architecture/NOJIRA-figma-to-code/fidelity-scoring.md): a
measurement an unrelated story's dependency can block is not a measurement.

**Validate the harness on the SANNA code that already exists** before starting the batch. If it
does not work, the fallback is explicit: runs complete Stages 1–3, record the Stage 4 blocker, and
Stage 4 onward waits for a real token.

## Per-run procedure

One orchestrator subagent per design, each running its own six stages, so the supervising context
holds 18 results rather than a hundred. For each:

1. Create `.implement-design/<file-slug>-N/` and run the pipeline per
   `tools/implement-design-plugin/skills/implement-design/SKILL.md`.
2. Carry the four Stage 0 answers above; **do not ask the user anything**.
3. Record every decomposer open question **with the default chosen** — the first run produced nine
   on the simplest screen, and they are the main variance source.
4. On a blocker, record it and stop that run. **One run failing must not stop the batch.**
5. Promote the finished run to `runs/<date>-<case-id>-<slug>/`, including a `generated/` snapshot
   of the code, and commit. Commits need `FONT_AWESOME_AUTH_TOKEN=dummy` because the pre-commit
   hook expands the variable.

## Three prompt hints the first run needed — and what they really mean

These were passed by hand and made the difference. Pass them again, **and note that needing to is
itself the finding**: `T-NOJIRA-figma-to-code-02` exists to move all three into the extraction so
no future run depends on somebody remembering.

- **`hasTemplate: false`** is a third state between resolved and `null` — a mapping identifying a
  component without emitting a snippet. Treat it as identified, not as unconnected. Without this
  the analyst may block.
- **Instance counts mislead.** A screen with 318 instance nodes has six components; the rest are
  their internals. Count what a developer would place.
- **`(unbound — needs a token)` is usually wrong.** On the first run all five flagged values had
  exact tokens already. Search the theme for an exact match before approximating.

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
