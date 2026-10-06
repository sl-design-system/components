---
type: task
schema_version: 1
id: T-NOJIRA-figma-ingestion-07
title: The nineteenth design, and the budget the capture does not have
description: 'a5 was reported unidentifiable while its root node id sat in its own capture and a link in this repository named it'
jira: null
resource: null
status: todo
independent: false
owner: marcin.ludwig
created: 2026-10-06T00:00:00Z
updated: 2026-10-06T00:00:00Z
tags: [figma, capture, provenance, defect]
source_plan: P-NOJIRA-figma-ingestion
depends_on: [T-NOJIRA-figma-ingestion-06]
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
