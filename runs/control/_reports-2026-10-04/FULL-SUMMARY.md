# Control runs — 19 cases x 2 passes

Every agent completed its assignment. "Completed" below describes the PIPELINE, not the agent.

## Results

| #   | Case                       | Figma file       | Pass 1                                | Pass 2                          |
| --- | -------------------------- | ---------------- | ------------------------------------- | ------------------------------- |
| 1   | B-Itsl-Course course files | Course-files     | halt CC, 11 nodes, 4m                 | halt CC, 35 nodes, 1.5m         |
| 2   | A9 SANNA Login             | SANNA            | **COMPLETE** MATCH, 75m               | **COMPLETE** MATCH, 2h04        |
| 3   | A7 Bingel Materials        | MyPortal         | halt CC, 8 nodes, 4m                  | **COMPLETE** 9 components, 2h31 |
| 4   | B-SANNA Account creation   | SANNA            | **COMPLETE** MATCH, ~60m (4 restarts) | **COMPLETE** MATCH, 96m         |
| 5   | A8 NSP Group list          | New-Secondary    | halt CC, 4 nodes, 8m                  | halt CC, **1 node**, 3.5m       |
| 6   | A2 NSP class overview      | NS-fundaments    | **halt MCP**, 6m                      | **halt CC**, 8m                 |
| 7   | A10 ETSL FAM Users         | Editorial-Suite  | halt CC, 3m                           | halt CC, 35 nodes, 3m           |
| 8   | B-NSP home                 | NS-fundaments    | halt MCP, 6m                          | halt MCP, 6m                    |
| 9   | A11 Sesame Learning        | MySesame         | halt CC, 19 nodes, 2m                 | halt CC, 19 nodes, 2m           |
| 10  | A6 Itsl-Collab Shared      | Collaboration    | halt CC, 25 nodes, 2m                 | halt CC, 25 nodes, 2m           |
| 11  | A1 Kampus Subchapter       | New-content-view | halt CC, 24 nodes, 1.5m               | halt CC, 23 nodes, 2m           |
| 12  | B-Sesame Group details     | MySesame         | halt CC, 23 nodes, 3.5m               | halt CC, 23 nodes, 4m           |
| 13  | A3 Bingel Exercises        | MyPortal         | halt MCP, 7m                          | halt MCP, 8.5m                  |
| 14  | B-Itsl-Bookmk Deleted      | Bookmarks        | halt CC, 55 nodes, 3m                 | halt CC, 55 nodes, 3m           |
| 15  | B-Itsl-Collab Add          | Collaboration    | halt CC, 8 nodes, 2m                  | halt CC, 8 nodes, 3m            |
| 16  | B-Itsl-Bookmk course files | Bookmarks        | halt CC, 10 nodes, 2m                 | halt CC, ~25 comps, 5.5m        |
| 17  | A4 Sesame My Groups        | MySesame         | halt CC, ~125 nodes, 4m               | halt CC, ~141 nodes, 8.5m       |
| 18  | A5 ETSL Metadata widget    | Editorial-Suite  | halt CC, 132 nodes, 4.5m              | halt CC, 132 nodes, 4m          |
| 19  | B-Kampus Notes panel       | New-content-view | halt CC, 18 nodes, 2m                 | halt CC, 18 nodes, 2m           |

**Pass 1: 2 complete / 17 halted** (14 CODE_CONNECT, 3 MCP)
**Pass 2: 3 complete / 16 halted** (14 CODE_CONNECT, 2 MCP)

All 38 runs finished.

Overall roughly **1 run in 8 produces code.**

## Variance — the thing this experiment existed to measure

Three cases changed outcome between identical passes:

**A7 Bingel — halt vs. 9 components.** Same URL, same server, same empty `{}` Code Connect
map both times. Pass 1 halted at Stage 1. Pass 2 ran all six stages and shipped 9 components.
The difference is one agent's judgement: pass 2's analyst declined to emit the halt token and
recorded the empty map as data, writing "a strict reading of the blocking rule would stop here."
The coordinator has no independent check — it learned the map was empty only because the analyst
mentioned it in prose.

**A2 NSP — different halt token.** Pass 1 `BLOCKED_ON_MCP` after three identical timeouts.
Pass 2 `BLOCKED_ON_CODE_CONNECT`: the first two spawns timed out exactly as before, but the third
improvised a workaround nowhere in the skill (per-node Code Connect queries instead of whole-tree)
and got data. The diagnosis depends on how many times you retry.

**A8 NSP — 4 blocked nodes vs. 1.** Pass 2's analyst fanned out ~12 per-node lookups instead of
trusting the empty subtree result, and rescued three of the four.

Blocked-node counts are unstable even where the verdict is stable: case 1 reported 11 then 35,
A10 ~5 groups then 35, A4 125 then 141, A1 24 then 23. The skill never fixes the granularity
(instances vs. components, nested vs. top-level), so the number a consumer sees is arbitrary.

## Stage 0: the one thing that works

**19 of 19 cases, both passes: zero questions asked.** Supplying the four answers up front
suppressed all interaction. No run asked anything, in either pass.

## The central contradiction, found independently by 30+ runs

Stage 0 describes the remote `figma` server as the one where "`get_code_connect_map` is
unreliable" and recommends `figma-desktop`. Stage 1 then treats that same call's empty result as
proof the DESIGN lacks published mappings — a human action — and halts with **zero retries**,
while `BLOCKED_ON_MCP` (the rarer failure) gets two. There is no branch distinguishing "genuinely
unmapped" from "this server can't read maps", and no fallback to the server the skill itself
recommends. The remedy printed to the user ("publish mappings and re-run") is unactionable for
most of this corpus: these designs are drawn in itslearning's, Bingel's and Vuetify's own
libraries, not SLDS. Nothing to map.

## Defects in what the pipeline writes

- `figma-metadata.json` **contains XML, not JSON** — universal across all runs.
- `figma-code-connect-map.json` is repeatedly `{}` plus an English sentence appended — **invalid
  JSON in a .json file**. The analyst spec says "preserve verbatim"; the extension says otherwise.
- **A3 pass 2: a retry destroyed a good artifact.** Attempt 1 wrote a real 46 KB
  `figma-metadata.json`; attempt 3 overwrote it with the 12-byte string `PLACEHOLDER`. Re-spawns
  share one run folder and write unconditionally. The folder exists for reproducibility; the retry
  loop defeats it.
- A halted run leaves **no record of why it halted** and no `screenshot.png` — the artifact the
  skill calls "ground truth throughout". `get_screenshot` is cheap, independent of Code Connect,
  and always uses the remote server; it is gated behind the one call that fails. Reported by every
  halted run.

## From the four runs that produced code

- **Stage 4's ground truth is the weaker of two available sources.** B-SANNA's Stage 6 reviewer
  found the form block 61.5px out of position after Stage 4 had passed it **twice** with measured
  comparison tables. A 1024x715 PNG cannot resolve that in a 1512px frame that is internally
  self-consistent. Every validator independently drifted toward `figma-metadata.json`'s absolute
  coordinates; the skill never points them there. One-line fix to step 13.
- **Stage 4 is structurally blind to whole defect classes** — keyboard inoperability, an
  `aria-hidden` focus trap, a wrong-typed event payload, and four hardcoded px values that had
  exact tokens in all 16 themes. Pixels identical; only source review catches them.
- **The Stage 3 `tsc` gate is unsatisfiable in this repo.** Two pre-existing errors in
  `packages/components/grid/src/grid.ts` mean "exit 0" has never passed for any run. Every
  implementer independently invented the same tolerance rule. Worse, forcing the gate pressured
  two implementers into deleting conventions-mandated `HTMLElementTagNameMap` blocks — the gate
  induced a convention violation.
- **`yarn start` is a write step, not setup.** It rewrote ~600 lines across five tracked
  `packages/locales/src/*.ts` files with i18n OFF. Caught only by step 19 and reverted.
- **The output tree accumulates and the skill doesn't know.** A leftover sibling's story id took
  the entire Storybook down (`Duplicate stories with id` -> broken build, server exits). Stale
  folders inject `TS2717`. Output paths are unique per run; story-id and custom-element namespaces
  are not.
- **Stage 4's 3-iteration cap fired while the loop was still converging** — each pass found real,
  different defects, and Stage 6 finished Stage 4's job.

## How the coordinator waits — unspecified, and it bites

The skill says "spawn" and never says how to await a result. Three distinct failure modes:
polling loops that added 8-9 minutes of dead wall clock (A1, A11); dozens of duplicate completion
notifications (A9, A2); and ending the turn on a bare "waiting on X" line, which stops the run
dead (**B-SANNA pass 1 needed four manual restarts**).

## Tree state

Clean throughout. `git status` shows only the four untracked entries that pre-dated the session.
Nothing committed, no PRs, no strays outside the gitignored run folders.

## Added by the final run (B-SANNA pass 2)

- **The manifest silently dropped the design's longest content.** The three consent sentences
  appear in neither `get_design_context` (which emits a bare `<sl-checkbox checked>`) nor the
  manifest. They survived only because an implementer read them off the screenshot. A schema that
  captures component mappings but not their labels is one OCR failure away from inventing legal copy.
- **The parallelism the skill mandates actively hurts.** Step 13's parallel validators share one
  Playwright browser and hijacked each other mid-measurement; running them sequentially was
  strictly faster.
- **Nothing pins the brand theme, and the default is wrong.** Storybook defaults to blue
  `sanoma-learning`; this design is purple `teacher-assistant`. Both validators burned real time
  proving the tokens were right and the theme was wrong. Arguably a missing Stage 0 question.
- **Two [CRITICAL]s invisible to both `tsc` and a screenshot diff**: `100vh` + `overflow: hidden`
  clipped the action buttons away with no scrollbar below ~800px (unreachable by mouse AND
  keyboard); and unset `autocomplete` makes `sl-text-field` emit `autocomplete="off"`, actively
  suppressing autofill on a name/email form — a WCAG 2.1 AA 1.3.5 failure.
- **The predicted `TS2717` did occur** — a stale sibling run owned the global
  `sl-legal-link-select` key with a different payload. The implementer correctly refused to rename
  itself or touch the other run, and escalated.

## Measurement caveats — contamination I introduced

Stated plainly so the numbers are not over-read:

1. **Pass isolation leaked.** B-SANNA r2 reports that its page implementer copied pass 1's cached
   Figma assets and a validator cited pass 1 as precedent. My prompts told coordinators not to
   MODIFY other runs but not to avoid READING the previous pass, and that prohibition never
   reached the sub-agents. Affects the three completing cases, not the halting ones.
2. **Concurrent runs shared one tree.** A7 pass 2 reports implementers whose scratch measurement
   files were overwritten by siblings (symptom: a confidently wrong number, not a crash), and one
   run injected a `TS2717` into another's shared type-check. Later waves were given a
   scratch-location rule; earlier ones were not.
3. **One run needed four manual restarts** (B-SANNA pass 1) to get past its own "waiting on X"
   stalls. Without that intervention it would have been recorded as incomplete.
4. **Guards added mid-experiment**, so prompts were not identical across all 38 runs: the
   no-polling rule, the don't-touch-files-outside-the-run rule, the scratch-location rule, and a
   list of known environment facts. All concern how the AGENT operates, none change the skill
   being measured — but they are a difference between early and late runs.
