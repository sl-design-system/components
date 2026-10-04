# Control runs — pass 1 summary (9 cases, 2026-10-04)

All nine agents completed their assignment. "Completed" below means the agent finished and
reported; it does not mean the pipeline succeeded.

| Case                  | Stage reached | Outcome                                   | Wall clock | Pipeline time | Agents spawned (of 6) |
| --------------------- | ------------- | ----------------------------------------- | ---------- | ------------- | --------------------- |
| A9 SANNA Login        | 6 of 6        | **COMPLETE — verdict MATCH**              | ~75 min    | ~75 min       | 13 spawns             |
| A2 NSP class overview | 1             | HALT `BLOCKED_ON_MCP` (3 attempts)        | 5:56       | 5:56          | 3 (analyst ×3)        |
| A6 Itsl-Collab Shared | 1             | HALT `BLOCKED_ON_CODE_CONNECT` — 25 nodes | 2:17       | 2:17          | 1                     |
| A10 ETSL FAM Users    | 1             | HALT `BLOCKED_ON_CODE_CONNECT`            | 3:06       | 3:06          | 1                     |
| B-Itsl-Bookmk Deleted | 1             | HALT `BLOCKED_ON_CODE_CONNECT` — 55 nodes | 3:10       | 3:10          | 1                     |
| A7 Bingel Materials   | 1             | HALT `BLOCKED_ON_CODE_CONNECT` — 8 nodes  | 4:17       | 4:17          | 1                     |
| A8 NSP Group list     | 1             | HALT `BLOCKED_ON_CODE_CONNECT` — 4 nodes  | ~8 min     | ~3:25         | 1                     |
| A11 Sesame Learning   | 1             | HALT `BLOCKED_ON_CODE_CONNECT` — 19 nodes | 10:32      | ~2 min        | 1                     |
| A1 Kampus Subchapter  | 1             | HALT `BLOCKED_ON_CODE_CONNECT` — 24 nodes | 11:07      | ~1:30         | 1                     |

Score: **1 of 9 completed the pipeline. 8 of 9 halted in Stage 1.**

## Questions asked of the operator

**Zero, in all nine runs.** Supplying the four Stage 0 answers up front suppressed every
question. No `AskUserQuestion` was issued by any run.

## Gaps — things the four answers did not cover

Counted across the nine reports; the number is how many runs independently hit it.

| #   | Gap                                                                                                                                                                                                                                    | Runs        |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| 1   | Run-folder slug derives from the **Figma file name**, contradicting the 23 case-named folders already in `.implement-design/`. Multiple cases from one file collapse into `<file>-1/-2/…` with no node id recorded anywhere.           | 9/9         |
| 2   | `screenshot.png` — which the skill calls "ground truth throughout" — is **never cached on a halt**. The human asked to go publish mappings gets a node list and a 3-byte `{}`.                                                         | 8/8 blocked |
| 3   | Retry budget is backwards: `BLOCKED_ON_MCP` gets 2 re-spawns, `BLOCKED_ON_CODE_CONNECT` gets 0 — the opposite of which call is actually flaky.                                                                                         | 8/9         |
| 4   | Stage 0 warns that remote `figma`'s `get_code_connect_map` is "unreliable", then Stage 1 treats that same call's empty result as a **human-action** blocker. No branch distinguishes "no mappings" from "this server can't read them". | 8/9         |
| 5   | Output location: is the supplied path the root component's folder, or its parent? Step 9 read literally nests one level deeper than every sibling example.                                                                             | 7/9         |
| 6   | Stage 3's gate hardcodes `npx tsc -p <package>/tsconfig.json`; `<package>` is undefined for an `examples/` path.                                                                                                                       | 5/9         |
| 7   | Nobody owns creating `testing/` — listed as run-folder content, assigned to visual-validator.                                                                                                                                          | 4/9         |
| 8   | Whether generated examples get exported from `examples/lit/src/index.ts` (no prior `_runs/*` is).                                                                                                                                      | 4/9         |
| 9   | Which MCP namespace "figma (remote)" means — three Figma surfaces exist here.                                                                                                                                                          | 3/9         |
| 10  | No guidance on how the coordinator **waits** for a subagent. Inflated A1 and A11 wall clock by ~9 and ~8 minutes.                                                                                                                      | 2/9         |
| 11  | Stage 4's breakpoints are never defined by any stage, and Stage 0 never asks.                                                                                                                                                          | 1/9         |
| 12  | Storybook port/URL for Stage 4 never stated.                                                                                                                                                                                           | 1/9         |

## Defects in artifacts the pipeline writes

- `figma-metadata.json` **contains XML, not JSON** — `json.load()` fails on it. (A8; the format is
  identical in all nine runs, so this is universal.)
- `figma-code-connect-map.json` was written as `{}` plus a prose sentence appended by the MCP
  server — **invalid JSON in a `.json` file**. The analyst spec says "preserve verbatim", which
  conflicts with the extension. (A2)
- A halted run leaves 2 of 6 expected files and **no record of why it stopped**. The next
  invocation takes a fresh `-N`, orphaning it. No resume concept.

## The one run that finished (A9)

Six stages, 13 agent spawns, final verdict MATCH. Its three most useful findings:

1. **"Unbound in Figma" was systematically misread as "no SLDS token exists"** — four hardcoded
   px values (40/80/32) had exact tokens in all 16 themes. The visual validator _structurally
   cannot_ catch this: the pixels are identical. Only the source-reading reviewer did.
2. **Stage 4's 3-iteration cap fired while the loop was still converging.** Each pass found real,
   _different_ defects. Stage 6 then finished Stage 4's job. A convergence test beats a fixed count.
3. **`screenshot.png` is the least precise ground truth in the run folder**, yet it is the one the
   skill names. Each validator independently drifted toward `figma-metadata.json`, and the later
   pass overturned the earlier one's measurements once it got there.

Also from A9, environment rather than skill: `yarn start` does not work in this checkout
(missing `FONT_AWESOME_AUTH_TOKEN`, then missing `node_modules` in the wireit prebuild). The failed
attempt **silently rewrote ~600 lines across five `packages/locales/src/*.ts`**, caught only by the
skill's own step-19 stray-artifact check and reverted. The skill has no fallback for "the dev
server won't start".

## Tree state

Clean. `git status` shows only the four untracked entries that pre-dated the session. Nothing
committed, no PR, no stray artifacts outside the gitignored run folders.
