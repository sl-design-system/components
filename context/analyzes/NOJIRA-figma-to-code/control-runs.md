# The control runs, and what they do to our numbers

Nineteen cases × two passes = **38 unassisted runs** of the unmodified skill, 2026-10-04. Reports
in [`runs/control/_reports-2026-10-04/`](../../../runs/control/_reports-2026-10-04/).

The only help supplied was the four Stage 0 answers. No hints, no harness, no override of the
Stage 1 halt, no supervisor settling anything. That is the difference between this and
[`batch-findings.md`](batch-findings.md), and the difference turns out to be most of the result.

---

## The headline: roughly one run in eight produces code

|        | Complete |                      Halted |
| ------ | -------: | --------------------------: |
| Pass 1 |   2 / 19 | 17 (14 Code Connect, 3 MCP) |
| Pass 2 |   3 / 19 | 16 (14 Code Connect, 2 MCP) |

**5 of 38.** Fourteen of nineteen cases halt in Stage 1 on `BLOCKED_ON_CODE_CONNECT`, in both
passes.

## What this does to our own batch

Our nineteen runs all completed. **That is not a measurement of the pipeline.** It is a
measurement of the pipeline plus a supervisor who removed its blockers — including, explicitly,
instructing runs not to halt on an empty Code Connect map. The control is the honest baseline;
ours is the assisted condition.

Both numbers are useful, and they mean different things:

|           | Condition                                 | Result             | Measures                                      |
| --------- | ----------------------------------------- | ------------------ | --------------------------------------------- |
| Control   | four Stage 0 answers                      | 5/38 produce code  | the skill as it ships                         |
| Our batch | plus hints, harness, rules, halt override | 19/19 produce code | the ceiling once a human removes the blockers |

So the gap between them — **1 in 8 against 19 in 19** — is the value of the supervision, and every
item in [`pipeline-defects.md`](pipeline-defects.md) is a candidate for turning some of that
supervision into something the skill does by itself. That reframing is worth more than either
number alone.

It also means a fidelity score computed over our nineteen runs describes assisted output. It is
still worth computing; it must be labelled.

## Variance: measured for the first time, and not where we were looking

`draft-next-steps.md` says we have no σ. We now have one at the **outcome** level, and it is large.

**Three of nineteen cases changed outcome between identical passes**, and in each the mechanism is
agent judgement rather than anything in the pipeline:

- **A7** halted in pass 1 and shipped **nine components** in pass 2 — same URL, same server, the
  same empty `{}` map both times. Pass 2's analyst declined to emit the halt token and recorded
  the empty map as data, writing that "a strict reading of the blocking rule would stop here."
- **A2** halted with a different token each pass. Pass 2's third spawn improvised per-node Code
  Connect queries — a workaround nowhere in the skill — and got data. **The diagnosis depends on
  how many times you retry.**
- **A8** reported four blocked nodes in pass 1 and one in pass 2, because pass 2's analyst fanned
  out per-node lookups instead of trusting the empty subtree result.

And where the verdict was stable, **the numbers still were not**: blocked-node counts moved 11→35,
~5 groups→35, 125→141, 24→23. The skill never fixes the granularity — instances or components,
nested or top-level — so the count a consumer sees is arbitrary.

**The structural finding underneath all three:** the coordinator has no independent check on what
the analyst found. It learned the map was empty only because the analyst mentioned it in prose.
**The pipeline's control flow depends on a subagent's wording**, which is exactly the surface where
two identical runs diverge.

## The central contradiction, found independently by thirty-odd runs

Stage 0 calls the remote server's `get_code_connect_map` "unreliable" and recommends
`figma-desktop`. Stage 1 then treats that same call's empty result as proof the **design** lacks
published mappings — a human action — and halts with **zero retries**, while `BLOCKED_ON_MCP`, the
rarer failure, gets two. The retry budget is backwards.

No branch distinguishes "genuinely unmapped" from "this server cannot read maps", and there is no
fallback to the server the skill itself recommends. The remedy it prints — publish mappings and
re-run — is **unactionable for most of this corpus**, because these designs are drawn in
itslearning's, Bingel's and Vuetify's own libraries. There is nothing to map.

We recorded this from one observed case and ranked it first in `pipeline-defects.md`. The control
shows it is not an edge case but **the dominant behaviour of the skill**.

## What the control confirms that we had already found

Independently, without our hints, across thirty-odd runs: `figma-metadata.json` holds XML
(universal); `figma-code-connect-map.json` is `{}` plus a prose sentence, invalid JSON under a
`.json` name; the Stage 3 `tsc` gate is unsatisfiable; there is no resume concept; the coordinator
has no instruction for waiting and it costs real time; Stage 4 is blind to whole defect classes;
the three-iteration cap fires while the loop is still converging.

Two of these arrive with better evidence than we had. **The `tsc` gate did not merely get routed
around** — forcing it "pressured two implementers into deleting conventions-mandated
`HTMLElementTagNameMap` blocks", so the unsatisfiable gate _induced_ a convention violation. And
`yarn start` is not a setup step but a **write** step: it rewrote ~600 lines across five tracked
`packages/locales/src/*.ts` files with i18n off, caught only by the skill's own stray-artifact
check. We saw the same contamination and attributed it to one run's `yarn extract-i18n`; the
control shows the dev server itself does it.

## What the control adds that we never saw

Our supervision hid these, which is its own argument for running an unassisted control.

- **The run folder is named after the Figma _file_, not the case.** Several cases from one file
  collapse into `<file>-1/-2/…` and **no node id is recorded anywhere**. We never hit it because
  I assigned case slugs by hand. It makes two runs on one file race for the same folder.
- **A retry destroyed a good artifact.** A3 pass 2: attempt 1 wrote a real 46 KB
  `figma-metadata.json`; attempt 3 overwrote it with the 12-byte string `PLACEHOLDER`. Re-spawns
  share one folder and write unconditionally — the folder exists for reproducibility and the
  retry loop defeats it.
- **`screenshot.png` is never cached on a halt.** The skill calls it "ground truth throughout",
  and the human sent off to publish mappings gets a node list and a 3-byte `{}`. The call is
  cheap, independent of Code Connect, and always uses the remote server — it is gated behind the
  one call that fails.
- **Story-id and custom-element namespaces are global while output paths are per-run.** A
  leftover sibling's story id took the whole Storybook down with `Duplicate stories with id`, and
  a stale folder injected `TS2717`. We saw the tag collision; we did not see that it can stop the
  server.
- **Nothing pins the brand theme**, and Storybook's default is wrong for the design. Two
  validators burned real time proving the tokens were right and the theme was wrong. Our
  `theme-match.mjs` answers this, and the control shows it is a missing **Stage 0 question**.
- **Parallel validators share one Playwright browser and hijack each other mid-measurement**;
  sequential was strictly faster. This independently validates building `shoot.mjs` so each
  capture launches its own Chromium.
- **The manifest silently dropped the design's longest content.** Three consent sentences appear
  in neither `get_design_context` — which emits a bare `<sl-checkbox checked>` — nor the manifest.
  They survived only because an implementer read them off the screenshot. **A schema that records
  component mappings but not their labels is one OCR failure away from inventing legal copy.**
  That is a direct requirement for the metadata contract.
- **Two accessibility defects invisible to both `tsc` and a screenshot diff**: `100vh` with
  `overflow: hidden` clipped the action buttons away below ~800px, unreachable by mouse _and_
  keyboard; and an unset `autocomplete` makes `sl-text-field` emit `autocomplete="off"`,
  suppressing autofill on a name and email form — a WCAG 2.1 AA 1.3.5 failure.

## Stage 0 is the one part that works

**Nineteen cases, both passes, zero questions asked.** Supplying the four answers up front
suppressed every interaction; no run issued an `AskUserQuestion`. Whatever else is wrong, the
front door is not.

## Caveats the control states about itself

Recorded here because they bound the numbers and because the experiment stating them is the
reason they can be trusted: pass isolation leaked (a pass 2 implementer copied pass 1's cached
assets, affecting the three completing cases); concurrent runs shared one tree and one injected a
`TS2717` into another's type-check; one run needed four manual restarts to get past its own
"waiting on X" stalls, and without that would have been recorded as incomplete; and guards were
added mid-experiment, so the 38 prompts were not identical — all about how the agent operates,
none changing the skill under test.
