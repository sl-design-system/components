---
type: task
schema_version: 1
id: T-NOJIRA-figma-to-code-02
title: Deterministic Figma node-tree extraction
description: Normalise the Figma calls into one stable node-tree artifact shared by the coverage metric and the intake report
jira: null
resource: null
status: blocked
independent: false
owner: marcin.ludwig
created: 2026-09-30T08:20:00Z
updated: 2026-10-05T00:00:00Z
tags: [figma, ingest, determinism]
source_plan: P-NOJIRA-figma-to-code
depends_on: [T-NOJIRA-figma-to-code-01]
---

> **Reviewed 2026-10-05 — blocked.** Acceptance "every node in the source tree appears exactly once" assumes an enumerable universe, which Amendment 6 falsified. Needs redefinition against the closure census before it can be claimed.

# Deterministic Figma node-tree extraction

> From [P-NOJIRA-figma-to-code](../../plan/NOJIRA-figma-to-code/plan.md).

## Objective

Produce the one structured artifact both measurement paths read. The analysis found that geometry
returned by Figma is currently written to disk and then not carried into any specification — this
task makes it a first-class, stable, machine-readable input instead.

Extraction must be fully deterministic: same node in, byte-identical artifact out. No model is
involved at any point.

## Two things the first real run proved must live here, in code

The smoke run had to be told both of these in its prompt. That is exactly what this task exists to
prevent: **anything an agent has to be told every time is a thing the extraction should have
decided once.**

**Node classification.** A screen with 318 instance nodes has six components; the rest are their
internals. The run only got this right because the prompt said so. The extraction must apply the
emission boundary itself (see
[`ARCH-fidelity-scoring`](../../architecture/NOJIRA-figma-to-code/fidelity-scoring.md)) and label
every node **emitted**, **passed-through** or **absorbed** in the artifact. Downstream then reads a
label instead of re-deriving a rule — and the bench and the generator read the _same_ label, which
is what makes coverage and generation agree by construction.

**Token name resolution.** Figma returns variable names (`color/foreground/primary/bold`); the code
needs custom properties (`--sl-color-foreground-primary-bold`). The run translated these by
inference, in two separate agents, each verifying names against the theme by hand. That is a
deterministic lookup wearing a reasoning task's clothes. Resolve it at extraction, against the
theme CSS, and record both names plus whether the target exists.

The same pass settles a distinction the run showed the manifest gets wrong: of five values flagged
`(unbound — needs a token)`, **all five had exact tokens already**. Flagging "unbound" is not
enough — the artifact must say **raw value, token exists** (a design defect: report it upstream)
or **raw value, no token exists** (a library gap: roadmap input). They are different findings with
different owners, and the current single flag is wrong more often than right.

## Steps

- [ ] Read the structural tree, the Code Connect map and the bound variable definitions — from the pipeline run folder when present, fetching only what is missing
- [ ] Normalise into one `node-tree.json`: per node its id, name, type, absolute bounding box, component id, bound variables, resolved Code Connect snippet or null, and whether the instance is detached
- [ ] Apply the existing plugin resolution heuristic for null-mapped nodes that are identifiable design system components, so an identifiable node is not miscounted as unmapped
- [ ] Classify every node as emitted / passed-through / absorbed by applying the emission boundary, and record the label — do not leave the rule to be re-derived downstream
- [ ] Resolve every Figma variable name to its CSS custom property against the theme, recording both names and whether the target exists; never leave the translation to an agent
- [ ] For each raw value with no bound variable, search the theme for an exact match and record **raw-value-token-exists** or **raw-value-no-token** — never a bare "unbound"
- [ ] Guarantee stable ordering and stable serialisation so two extractions of an unchanged node produce identical bytes
- [ ] Record in the artifact which Figma server answered each call and when

## Acceptance criteria

- [ ] Two extractions of the same unchanged node produce byte-identical `node-tree.json`
- [ ] Every node in the source tree appears exactly once in the artifact
- [ ] Every node carries an emission label, and the bench and the generator read the same one
- [ ] Every token reference carries its resolved custom property and an existence flag
- [ ] A raw value that has an exact token is reported differently from one that has none
- [ ] A detached instance is distinguishable from a mapped one and from a plain frame

## Verification

Extract twice and diff the artifacts — the diff must be empty. Extract a node containing a
deliberately detached instance and confirm it is classified as detached.

- Use case: `UC-NOJIRA-figma-to-code-02` — `../../tests/NOJIRA-figma-to-code/UC-NOJIRA-figma-to-code-02-extraction-is-byte-stable.md`
