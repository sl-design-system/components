# Prior art — the `ds-*`/`sdl-*` and `sl-ds-*` skill sets

A **frozen, read-only snapshot**, taken 2026-09-30, of the two earlier attempts at automating
Figma-to-code generation for this design system. It was vendored here so this repository is
self-sufficient: everything needed to understand why the current approach looks the way it does is
in the repository, not on one person's machine.

It sits under `tools/` rather than inside `context/` for a mechanical reason: the sl-aipdlc
validator checks every markdown file under the context root and has no exclusion mechanism, so 193
skill and agent files written to a different contract would fail it on every run. The context
registers this snapshot as an external stub at
`context/foundation/prior-art-ds-skills.md`.

Source: `sanoma-agents`, directory `agents/`. The two version folders were hidden there
(`.agents-v1`, `.agents-v2`) and are un-hidden here as `v1/` and `v2/` so they are discoverable.
Nothing else was changed, and the original `README.md` is preserved verbatim as
`HANDOVER-2026-06-15.md`.

## What is here

| Path | What it is |
|---|---|
| `HANDOVER-2026-06-15.md` | **Start here.** The handover document: 31 unified requirements, a coverage matrix scoring both versions against each of them, ten unresolved problems in v2 with their root causes, and the architecture of both systems. |
| `v1/` | The two-layer system — `ds-*` agents for Figma interpretation and planning, `sdl-*` workers for generation, quality and CI. Specification-heavy; the full pipeline was never run end to end. |
| `v2/` | The single-layer `sl-ds-*` skills driven by a router. Run against two real Figma designs. `v2/skills/sl-ds-verify/references/composite-fidelity-method.md` is the most directly reusable artifact in this snapshot. |
| `generate-npm-token.sh` | Referenced by requirement R14 (design system installation), which both versions left unaddressed. |

## How to treat it

**Read-only.** Do not edit, extend, or fix anything under `v1/` or `v2/`. This is evidence of what
was tried and what it cost, and its value depends on it staying exactly as it was when the attempt
stopped. A correction to a conclusion drawn from it belongs in an analysis that cites it, not in a
patch to the snapshot.

**Not a dependency.** Nothing in this repository imports, executes, or is generated from these
files. They are input to reasoning.

**Superseded, not deleted.** Both versions are ancestors of the current effort, not competitors to
it. The handover document states plainly that there is no migration path between v1 and v2 and that
a future version would be designed from scratch drawing on lessons from both — which is what
[`A-NOJIRA-figma-to-code`](../../context/analyzes/NOJIRA-figma-to-code/analysis.md) does.

## What was carried forward, and what was deliberately not

Named in the analysis, repeated here so a reader of the snapshot is not misled into adopting it
wholesale:

**Carried forward** — the composite fidelity method with its tolerances tiered by element class; a
persistent, reviewable plan artifact that freezes the decomposition decision; exhaustive verified
token extraction; and the lessons-to-standards ratchet.

**Deliberately not carried forward** — the five-group weighting scheme and its pass thresholds, the
framework-specific code quality metrics, and the automatic repair loop. All three were calibrated
before anything had been measured, and the repair loop in particular hides exactly the run-to-run
variance the current effort needs to see.

## Consequence for this repository

The copy of v1 that sits at the repository root in `agents/` is fully contained in `v1/` here —
verified file-for-file, with the four top-level documents byte-identical. It can be removed.
