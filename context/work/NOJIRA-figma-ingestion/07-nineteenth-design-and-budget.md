---
type: task
schema_version: 1
id: T-NOJIRA-figma-ingestion-07
title: The nineteenth design, and the budget the capture does not have
description: 'a5 was reported unidentifiable while its root node id sat in its own capture and a link in this repository named it'
jira: null
resource: null
status: done
independent: false
owner: marcin.ludwig
created: 2026-10-06T00:00:00Z
updated: 2026-10-06T07:00:00Z
tags: [figma, capture, provenance, defect]
source_plan: P-NOJIRA-figma-ingestion
depends_on: [T-NOJIRA-figma-ingestion-06]
commit: bcdc66436
---

# The nineteenth design, and the budget the capture does not have

## Objective

`T-NOJIRA-figma-ingestion-06` captured **18 of 19** designs and said so rather than quietly
being eighteen, which is what its acceptance criteria asked for. The criterion was met and the
conclusion drawn from it was wrong.

Its Result says a5 _"cannot be counted either way"_. **It can.** Both halves of its identity were
in this repository the whole time:

| Where                                                              | What                                                                                           |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `runs/2026-10-01-a5-etsl-metadata-usage-widget/figma-metadata.txt` | `<frame id="17214:103584" name="Metadata usage widget" width="1440" height="2032">` — the root |
| a link, already matched by `figmaLinks`                            | `figma.com/design/S5QgDy8X9eqhvECPANSZMM/Editorial-Suite-designs?node-id=17214-103584`         |

`matchTargets` pairs a run with a file **only** through the `rootNodeId` recorded in that run's
`captures/index.json`. a5 is the one run of nineteen where that field is `null`, so the pairing
never ran — against a link that names the exact node, in a file the token reaches with a **200**,
verified 2026-10-06.

**This is not the missing-identity finding it was written up as.** F10 says Figma does not
identify the design and the operator must; here the operator did, in the run's own capture, and
the reader did not look. The one real F10 case in the corpus turns out to be a reader defect.

### The second thing, named rather than left

Step 8 of 06 asked for _"a per-design call and byte budget, a checkpoint … and `complete: false`
with the reason whenever a budget, a cap or a `429` stopped it."_ The checkpoint, the resume and
the `complete: false` were delivered. **The budget was not.** So the criterion _"a design that
could not be captured whole says so, with which budget or cap stopped it"_ passes vacuously:
there is no budget that could bite. a2-nsp-class-overview pulled **28 MB in one call** with
nothing able to stop it.

### Why the escaped envelope matters here

a5's metadata capture is the JSON envelope form — `id=\"17214:103584\"` — so a reader that
greps `id="…"` finds nothing in it. `runs/harness/normalise-captures.mjs` already handles exactly
this shape. The fallback must go through it rather than become the third reader of Figma metadata
in this harness; two of them have already drifted apart once, in 06's own CLI.

## Steps

1. **Fall back to the run's own capture.** When `captures/index.json` records no `rootNodeId`,
   take the root element's id from that run's metadata capture, through `normalise-captures.mjs`
   so the escaped envelope is read rather than missed. Record that the identity came from the
   capture and not from the index, because the two are different strengths of evidence.
2. **Let the operator say.** `--file-key` and `--root` override the resolver for one run, so a
   design it cannot identify can still be captured instead of only reported. An override is
   recorded as such in the manifest.
3. **A per-design budget.** `--max-bytes` and `--max-calls`, defaulting to something a2's 28 MB
   does not silently exceed. When a budget stops a capture it is `complete: false` with the
   budget named — which is what makes 06's criterion mean something.
4. **Capture a5** and update `runs/captures/index.json` to nineteen.
5. **Correct the record.** 06's Result and its use case both say a5 cannot be counted. They are
   `done` and are not edited; this task's Result is where the correction lives, and the plan
   carries it in Amendment 3.

## Acceptance criteria

- a5 is captured, and `runs/captures/index.json` reports **19 designs, 0 unidentified**.
- A run whose index records no root is resolved from its own capture, and the manifest says the
  identity came from the capture.
- The escaped-envelope form is read, proved by a control that fails on a reader which only
  greps `id="…"`.
- An operator override captures a design the resolver cannot identify, and is marked as an
  override rather than as evidence.
- A budget that bites produces `complete: false` naming the budget — shown going red, not
  asserted.
- Every capture that already exists is still byte-identical: `--verify` reports **0 no longer
  verbatim** over all of them.

## Verification

`capture.mjs --verify` over the whole tree before and after: the count rises by a5's responses
and nothing already stored changes hash. Re-running a5 twice produces identical hashes, as the
other eighteen do.

The sharpest check: **`index.json` must say 19 and `unidentified: []`.** Nineteen was the number
the whole corpus was built on, and the capture has been reporting eighteen.

## Result

`runs/harness/capture.mjs`, modified in place. The harness gate is **476 tests** and
`tsc --noEmit` over seventeen files. **19 mutations, 0 survivors.**

**`runs/captures/index.json` says 19 designs, 0 unidentified, 28 323 nodes.** a5 is
`17214:103584` in `S5QgDy8X9eqhvECPANSZMM`, 1 857 nodes, complete — resolved from its own
capture, and the manifest records `rootSource: capture` so nobody mistakes that for the index
having said it.

### The six criteria

| Criterion                                                                 | How it is shown                                                                                                                                                   |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 19 designs, 0 unidentified                                                | asserted against the committed `index.json`, not against a run's output                                                                                           |
| A run with no recorded root is resolved from its own capture, and says so | `rootOfRun` returns `rootSource`, and a5's manifest carries `capture`                                                                                             |
| The escaped envelope is read                                              | the control asserts `/\bid="[^"]*"/` matches **nothing** in a5's metadata and that `metadataIds` returns zero, then that the fallback finds `17214:103584` anyway |
| An override captures what the resolver cannot, marked as an override      | `--file-key` + `--root` with `--only`; `source: override`, and a control shows an override for another run rescuing nothing                                       |
| A budget that bites names itself                                          | `budgetStop` names the flag and the number; `captureDesign` stops **before** the call that would exceed it, proved by counting the calls made                     |
| Everything already stored is still byte-identical                         | **108 stored responses, 0 no longer verbatim, 0 unattested**                                                                                                      |

### What this was really about

The task was written as "capture one more design". That took nine lines. What it actually
surfaced was **three ways a file came to sit on disk with nothing attesting to it** — the exact
property `T-NOJIRA-figma-ingestion-06` exists to guarantee.

| Defect                                                                                                                    | How it hid                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| A resumed run rebuilt its manifest from the calls it made, so **19 renders and 13 `nodes-named.json` lost their records** | `--verify` reported **0 failures over 27 fewer files**. The number went from 103 to 76 and nothing was red                           |
| `--verify` could not see that                                                                                             | it only checked records against files. It now checks both directions, and the missing direction is the one that hid for a whole task |
| A non-resuming run read `nodes-named.json` from an earlier run to satisfy its own reconciliation, then did not fetch it   | the reconciliation went green on data this run did not take                                                                          |

The first one is the fault this plan keeps finding in new clothes: **a check that examines less
has not found less.** It was caught by printing the count rather than the status — the status was
green throughout.

### A finding retracted

`T-NOJIRA-figma-ingestion-06`'s Result offers a5 as `A-NOJIRA-figma-metadata-contract` **F10**
arriving in operational form — _"the identity was the operator's to record and for one design
nobody did"_. **That is withdrawn.** The operator did record it, in the run's own metadata
capture; the reader did not look. F10's claim that no capture tree carries a file key or a
`lastModified` still stands as measured, but **the corpus has no design whose identity was
genuinely lost**, and 06's write-up said it had one.

Both 06's Result and its use case are `done` and are not edited. This is the correction, and the
plan carries it in Amendment 3.

### The budget, now that it exists

Off unless asked for, because turning it on by surprise would make eighteen complete captures
incomplete. The number worth knowing when setting one: **a2-nsp-class-overview pulls 28 MB in a
single call**, so any `--max-bytes` below that stops the largest design in the corpus at its
first response.

### Still true, and unchanged by this task

- The MCP half is not captured; a personal access token is refused by `mcp.figma.com`.
- The whole-file `GET /v1/files/:key` is not taken, not committed, and not needed.
- **The branch must not be pushed** until somebody decides whether this corpus belongs in a
  public repository. 70 MB over 19 designs now, against a `.git` already at 112 MB. The decision
  is about what the files are, not how large they are.
