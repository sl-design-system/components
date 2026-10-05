---
type: task
schema_version: 1
id: T-NOJIRA-harness-quality-01
title: One command that type-checks and tests the harness
description: 'A local tsconfig, the node types it needs, and a single command — because Node runs .ts without checking it and nothing checks the harness today'
jira: null
resource: null
status: todo
independent: true
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-05T00:00:00Z
tags: [harness, typescript, tooling]
source_plan: P-NOJIRA-harness-quality
depends_on: []
---

# One command that type-checks and tests the harness

## Objective

Node 24 runs `.ts` natively and **strips types without checking them** — a file declaring
`const n: number = 'text'` executes and prints the string. So typing the harness buys nothing
until something fails a build on it.

`eslint` also refuses these files: they are outside the monorepo's TypeScript project. There is
no root `tsconfig.json`, only `tsconfig.base.json` and per-package ones, so the harness can take
its own without touching anything else.

## Steps

1. Add `runs/harness/tsconfig.json` with `strict`, `noEmit`, `allowJs`, `checkJs`,
   `moduleResolution: NodeNext`, scoped to the directory.
2. Add `@types/node` where the harness can resolve it. It was absent until pulled from the yarn
   cache; a full `yarn install` currently fails on the private `@fortawesome` packages, so record
   what the proper fix is rather than leaving the workaround undocumented.
3. Add one command that runs `tsc --noEmit` and `node --test "runs/harness/*.test.mjs"` and fails
   if either does.
4. Write the convention into `runs/harness/README.md`: a script and its tests are one
   deliverable, fixtures come from captured bytes, a measurement tool must be able to fail.

## Acceptance criteria

- One command runs both checks and its exit code is non-zero when either fails — **shown
  failing**, not only passing.
- `tsc --noEmit` reports on the harness without the monorepo project changing.
- The two already-reshaped scripts type-check clean, or their remaining errors are listed with a
  named task that will clear them.
- The convention is written where the next author will meet it.

## Verification

Run the command on a clean tree; then break one type and one test deliberately and confirm each
turns the command red on its own.
