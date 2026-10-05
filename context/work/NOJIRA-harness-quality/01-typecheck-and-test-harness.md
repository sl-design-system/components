---
type: task
schema_version: 1
id: T-NOJIRA-harness-quality-01
title: One command that type-checks and tests the harness
description: 'A local tsconfig, the node types it needs, and a single command — because Node runs .ts without checking it and nothing checks the harness today'
jira: null
resource: null
status: done
independent: true
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-05T00:00:00Z
tags: [harness, typescript, tooling]
source_plan: P-NOJIRA-harness-quality
depends_on: []
commit: pending
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

## Result

`yarn check-harness` runs `tsc --noEmit -p runs/harness` and `node --test
"runs/harness/*.test.mjs"` and fails if either does. **Shown failing in both directions**, which
is the criterion that mattered:

|                                   | exit |
| --------------------------------- | ---- |
| clean tree                        | `0`  |
| a deliberate type error           | `2`  |
| a deliberately inverted assertion | `1`  |
| restored                          | `0`  |

### What the register decided

`tsconfig.json` lists four files rather than globbing `*.mjs`. Globbing puts **185 errors**
behind the gate on day one, which is the same as having no gate. A file joins the list when a
task has made it clean — tasks 02, 03 and 04 are the remaining entrants — so the command is
green from the first day and stays green.

The scripts stay `.mjs` with JSDoc rather than becoming `.ts`. Native execution makes the rename
free, but it buys nothing `checkJs` does not already give and it would change every invocation
in every runbook.

### Three things the type-check found that the tests did not

The 70 errors over the two reshaped scripts were mostly missing annotations, but three were
signal:

- `block.kind` was read on a union where the code variant has no `kind`. Harmless at runtime
  today, unsound the moment a third variant appears.
- the `[pattern, dir, extension, call]` table inferred `string | RegExp` per element, so
  `pattern.test` was not provably callable — a reordering would have failed at runtime only.
- `@types/node` resolves `fetch` through `undici-types`, which was **absent**, so every
  `Response` property read as an error. Installing it is what made the `fetchComponentsTo`
  signatures checkable at all.

### Dependencies and the lockfile

`@types/node@^22.7.4` and `zod@^4.0.10` are now root `devDependencies`. Both descriptors already
existed in `yarn.lock`, so the change is **two lines in the root workspace's dependency list and
no new resolutions**.

This was nearly a regression: `yarn install --immutable` — what CI runs — refuses a
`package.json` whose dependencies the lockfile does not record, and it would have failed on the
declaration alone. Caught by running it. `yarn install --mode=update-lockfile` produced the
entry without fetching, and `--immutable` now clears the Resolution step and stops only at the
Fetch step on the private `@fortawesome` packages, which is the pre-existing condition of this
working copy and not something this task introduced.

### The convention

Written into `runs/harness/README.md` under _Writing a script here_, each rule attached to the
failure that produced it rather than stated as a preference.
