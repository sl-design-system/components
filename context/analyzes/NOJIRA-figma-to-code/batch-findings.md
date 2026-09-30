# Batch reference run — findings across designs

Companion to [`smoke-run-findings.md`](smoke-run-findings.md), which covers the single first run.
This file collects what only shows up **across** runs: what generalises from the simplest screen,
what turned out to be specific to it, and what no single run could have revealed.

Written while the batch is still executing, so entries are added as runs report. Each names the
evidence it rests on.

---

## A design with no design system in it

**Case B-Itsl-Course `course files`** has **zero** Code Connect mappings. Not "some unmapped
nodes" — none, anywhere. It is drawn against itslearning's own internal component library.

The evidence is unusually complete, because the analyst was told to prove it rather than infer it:

- `get_code_connect_map` returned `{}` on the whole subtree, on all **7** top-level instances, and
  on **8** underlying main-component definitions queried by id (Button, Avatar, Select, Status Tag,
  Cell, Pagination, Banner, PageHeader);
- `get_design_context` renders the frame as plain `<div>`/`<p>`/`<img>` with **zero** `<sl-*>`
  elements;
- no instance is named `sl-*`;
- the design's own variables are a different vocabulary entirely — `$gray--700`, `$brand--700`,
  `$pigeongrey--100`, `Size/500`, `Lato` — with no `--sl-` namespace anywhere.

### Why this matters more than one case

**The pipeline halts on it.** Stage 1's contract says unmapped component instances mean
`BLOCKED_ON_CODE_CONNECT`: stop, report the node list, ask a human to publish mappings. On this
design every instance is unmapped, so the correct behaviour under the current rules is to refuse
the design outright. It only proceeded here because the run's coordinator overrode the rule
deliberately. **A design that uses none of the design system is not a blocked run — it is the
second audience**, the one that needs its existing design ported as it stands.

That distinction has no representation in the pipeline. There is one path, and it assumes the
design is made of our components.

### It also validates a caveat, the expensive way

The corpus survey recorded `libraryPct: 96` for this design, and the caveat attached to that number
said: _"libraryPct means a published library, not necessarily ours."_ Here is the hard case. **96%
of this screen comes from a published library, and 0% of it is ours.**

So the metric the corpus was partly selected on cannot distinguish the two audiences, and the
sibling itslearning designs carry the same reading — `B-Itsl-Bookmk` at 100%, `B-Itsl-Collab` at
96%. Whether those are also entirely non-SLDS is being measured by the runs now in flight; if they
are, a substantial part of the "fidelity corpus" is measuring porting rather than mapping, and the
two must be scored separately.

### What it costs to find out

Sixteen `get_code_connect_map` calls to establish a negative. That is the honest price of the
distinction today, against a daily Figma limit of 600 calls — and it is a strong argument for
`T-NOJIRA-ds-conformance` producing this verdict **once per file, cached**, rather than every run
rediscovering it node by node.

---

## Success-shaped output that is not success

Four instances, in four different layers, in one night. None was caught by a gate; each was found
only because something rendered, measured or re-read the result.

| Layer                | What happened                                                                | What it looked like         |
| -------------------- | ---------------------------------------------------------------------------- | --------------------------- |
| Generated TypeScript | `import { type Thing }` is erased, so `customElements.define` never runs     | type check clean            |
| Generated CSS        | `font: var(--undefined)` — the browser drops the **whole** declaration       | no error anywhere           |
| Measurement tool     | `theme-match.mjs` resolved no indirection and still returned a ranking       | a confident-looking `0.48`  |
| Orchestration        | three coordinators ended a turn on a status line with Stages 4–6 unattempted | a plausible `progress.json` |

The common shape: **the failure mode of these things is a plausible value, not an exception.** That
is the argument for the verification chain being adversarial rather than confirmatory, and it
applies directly to the fidelity score, which is another artifact whose broken state is a number.

The orchestration case is a gap in the skill rather than in the model: it says how a coordinator
spawns stage agents and routes work back, and nothing about what a coordinator does while a child
is working. Given no instruction, "I am waiting" reads as a complete answer.

---

## Decomposer open questions scale with the screen

| Case                | Nodes | Component types | Open questions |
| ------------------- | ----: | --------------: | -------------: |
| A9 SANNA `Login 1`  |   894 |              32 |              9 |
| A8 NSP `Group list` |   620 |              34 |             30 |
| B-NSP `home`        |   464 |              32 |             32 |

Nine on the first screen was not a floor for screens of that size — it was the low end of a wide
spread. Two designs _smaller_ than the login page produced more than three times as many
questions, each answered by a default nobody reviewed.

This is the batch's central number. Each question is a decision the pipeline makes silently, and
each is a place two runs of the same design can diverge. The variance budget has to be built
against thirty per screen, not nine.

---

## Themes cannot be mapped per team

Two NSP designs in this corpus resolve to two different themes — `max` (17/17 tokens) and
`sanoma-learning` (21/21). Both exact, both unambiguous, and a per-team mapping would have got one
of them wrong whichever way it was written. The theme belongs to the file, and it is derivable:
see [`runs/harness/README.md`](../../../runs/harness/README.md).

A8 was captured before this was known, under a theme guessed from the team label, so its colour
measurements describe the wrong theme. Its `progress.json` records that rather than letting the
numbers stand.
