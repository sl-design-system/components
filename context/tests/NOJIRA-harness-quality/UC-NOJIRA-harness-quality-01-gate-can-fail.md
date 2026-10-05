---
type: use-case
schema_version: 1
id: UC-NOJIRA-harness-quality-01
title: The harness gate goes red for a type error and for a failing test
description: 'A gate nobody can fail is not a gate — this proves both halves of the command independently'
jira: null
resource: null
status: passing
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-05T00:00:00Z
tags: [harness, tooling, negative-control]
tests_task: T-NOJIRA-harness-quality-01
---

# The harness gate goes red for a type error and for a failing test

> Verifies [T-NOJIRA-harness-quality-01](../../work/NOJIRA-harness-quality/01-typecheck-and-test-harness.md).

## Preconditions

A clean tree on `feature/figma-to-code-quality-harness`. `runs/harness/tsconfig.json` lists
`mode-decision.mjs`, `mode-decision.test.mjs`, `normalise-captures.mjs` and
`normalise-captures.test.mjs`. `@types/node`, `undici-types` and `zod` resolve.

## Scenario

| Step | Action                                                                         | Expected result                   |
| ---- | ------------------------------------------------------------------------------ | --------------------------------- |
| 1    | `yarn check-harness` on a clean tree                                           | exit `0`                          |
| 2    | Append `const broken: number = "not a number";` to `mode-decision.mjs`, re-run | non-zero exit, from `tsc`         |
| 3    | Restore the file, re-run                                                       | exit `0`                          |
| 4    | Invert one assertion in `mode-decision.test.mjs`, re-run                       | non-zero exit, from `node --test` |
| 5    | Restore the file, re-run                                                       | exit `0`                          |

Steps 2 and 4 are the point. A command that has only ever been seen passing is not known to be
a check at all — six tools in this harness returned a number while broken.

## Edge cases

- **A file outside the register.** `tsconfig.json` lists files rather than globbing, so breaking
  a type in `render-design.mjs` does **not** turn the gate red today. That is deliberate — a glob
  puts 185 errors behind the gate on day one — and it means the register is itself a thing to
  review when a task claims to have cleaned a file.
- **A missing transitive type package.** `@types/node` resolves `fetch` through `undici-types`;
  with it absent every `Response` property reads as an error rather than as a missing dependency.

## Result

Run 2026-10-05: step 1 `0`, step 2 `2`, step 3 `0`, step 4 `1`, step 5 `0`. Passing.
