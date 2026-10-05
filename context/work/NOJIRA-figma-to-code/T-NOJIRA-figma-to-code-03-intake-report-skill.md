---
type: task
schema_version: 1
id: T-NOJIRA-figma-to-code-03
title: Design intake report as a skill
description: Read-only report on how much of a Figma design uses the design system, what is detached, and which unmapped components recur across teams
jira: null
resource: null
status: blocked
independent: true
owner: marcin.ludwig
created: 2026-09-30T08:20:00Z
updated: 2026-10-05T00:00:00Z
tags: [intake, adoption, skill, design-system]
source_plan: P-NOJIRA-figma-to-code
depends_on: [T-NOJIRA-figma-to-code-02]
---

> **Reviewed 2026-10-05 — blocked.** States the Figma MCP server here is the **desktop** one taking no file key. Measured false: the remote server answers in seconds and takes a `fileKey`, and `list_file_components_for_code_connect` now settles library membership in one call per file. Cheaper than written, and the stated method is wrong.

# Design intake report as a skill

> From [P-NOJIRA-figma-to-code](../../plan/NOJIRA-figma-to-code/plan.md).

## Objective

Give both audiences the number they currently lack. A product developer learns, before generating
anything, how much of their design the pipeline can map and how much will be reproduced as-is. The
design system team learns which unmapped components are actually in demand across eleven teams, so
the mapping backlog is ranked by evidence instead of alphabetically.

Read-only by construction: this skill never generates code and never writes into the pipeline.

## Constraint measured before this was planned

The Figma MCP server available here is the **desktop** one: it reads the file currently open in the
Figma application, and takes no file key. Two observations from probing it:

- Calling `get_metadata` with **no node id** lists the document's top-level pages and is very cheap.
  That is the right first probe for any file, and it is how a screen gets chosen without guessing.
- Calling it on a page that is not loaded in the application returned an **empty canvas** — most
  likely because Figma loads pages lazily. Content appears to require the page to be open.

So a survey across many files **cannot run unattended from here**. Either each file is opened in the
desktop application in turn, or the remote Figma server is authenticated and used instead, since
that one addresses a file by URL. Confirm which before assuming this skill can be pointed at a list
of links.

## Steps

- [ ] Implement the three filters a trial run proved necessary, because structure alone selects fragments and duplicates: **frame width must match a real viewport** (±8px) with height ≥600, which removes widgets, boards and thumbnails; **at least ten distinct component types** with instance density 0.08–0.6, which removes covers, annotation frames and component variants; and **deduplication by component histogram** (cosine >0.85 within a team), which collapses variants differing only by a colour, a note or one element
- [ ] Treat the classification as a shortlist, never a verdict — a trial run's top candidates included a wireframe with placeholder boxes, a page of designer guidance with no instances, and a thumbnail. Only looking at them caught it, so the report should render what it proposes
- [ ] Use exactly two calls per design — structure and the Code Connect map — and never `get_design_context`, which is the expensive one and answers a question the report does not ask
- [ ] Cache every response to disk on first fetch, keyed by file and node, so re-running a survey costs nothing
- [ ] Build the report on the shared node-tree artifact — the same traversal as coverage, counting different things
- [ ] Report per design: the fraction of instances resolving to a design system component, the detached-instance count, the ratio of bound variables to local styles, and the unmapped components by name
- [ ] Aggregate across designs into a ranking of unmapped components by how many distinct files and teams they appear in
- [ ] Package it as a skill so a developer can point it at their own Figma URL without knowing anything about the harness
- [ ] Count **top-level instances separately from nested ones**, and never report one figure as though it were the other. A trial measurement got this wrong: a screen reported as having 318 instances has **six** — the other 312 are the internals of those six. The two answer different questions (how many components a developer places, versus how much of the tree is component-derived) and conflating them makes the number unreadable
- [ ] Report the proportion of instances that Code Connect resolves as a distinct figure, and label it for what it also is: a forecast of what a run of that design will cost and how much it will vary, since every unresolved instance moves a decision from lookup to inference
- [ ] Present the output so a non-developer can read it — the design system team is an audience for this report, not only engineers

## Acceptance criteria

- [ ] The skill runs against a Figma URL and produces the report without generating or modifying any code
- [ ] Run against at least five of the eleven team files, it produces per-file adoption figures and one cross-file ranking
- [ ] The report proposes candidates with a rendered image, not only numbers
- [ ] The Code Connect resolution rate appears as its own figure, not folded into a general adoption number
- [ ] The ranking distinguishes a component appearing many times in one file from one appearing across many teams — demand is breadth, not volume

## Verification

Run against five team files from the analysis inventory. Verify by hand, on one file, that the
detached-instance count matches what Figma itself reports.

- Use case: `UC-NOJIRA-figma-to-code-03` — `../../tests/NOJIRA-figma-to-code/UC-NOJIRA-figma-to-code-03-adoption-report-is-actionable.md`
