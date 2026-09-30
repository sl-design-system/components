---
type: architecture
schema_version: 1
id: ARCH-prior-art-ds-skills
title: Prior art — the ds-*/sdl-* and sl-ds-* skill sets
description: Frozen snapshot of the two earlier Figma-to-code automation attempts, vendored into this repo as read-only evidence
jira: null
resource: https://github.com/sl-design-system/components/tree/main/tools/prior-art-ds-skills
status: current
owner: marcin.ludwig
created: 2026-09-30T09:40:00Z
updated: 2026-09-30T09:40:00Z
tags: [prior-art, design-to-code, foundation, snapshot]
location: external
---

# Prior art — the `ds-*`/`sdl-*` and `sl-ds-*` skill sets

> **External material.** The snapshot itself lives at `tools/prior-art-ds-skills/` in this same
> repository — outside the context root, because the validator checks every markdown file beneath
> the context and 193 skill files written to a different contract would fail it on every run. This
> stub exists so the context still registers the material and it stays greppable from here.

## Summary

Two earlier attempts at automating Figma-to-code generation for this design system, frozen as they
were when each stopped, and vendored from the `sanoma-agents` repository on 2026-09-30 so that this
repository is self-sufficient.

`HANDOVER-2026-06-15.md` is the entry point and the most valuable single document: 31 unified
requirements, a matrix scoring both versions against every one of them, and ten unresolved problems
in the newer version with their root causes. Its own numbers — 10 requirements unmet and 11 partial
— are the primary evidence behind
[`A-NOJIRA-figma-to-code`](../analyzes/NOJIRA-figma-to-code/analysis.md)'s finding that
implementing a requirement set together makes outcomes unattributable.

`v1/` is the two-layer `ds-*` plus `sdl-*` system, specification-heavy and never run end to end.
`v2/` is the single-layer `sl-ds-*` skill set, run against two real designs; its
`skills/sl-ds-verify/references/composite-fidelity-method.md` is the most directly reusable artifact
in the snapshot and is carried forward by the measurement plan.

Read-only. It is evidence of what was tried and what it cost, and its value depends on staying
exactly as it was — a correction to a conclusion drawn from it belongs in an analysis that cites it,
never in a patch to the snapshot. Nothing in this repository imports or executes any of it.
