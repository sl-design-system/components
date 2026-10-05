---
type: task
schema_version: 1
id: T-NOJIRA-figma-ingestion-02
title: Traversal with Code Connect as the stopping rule
description: 'A resolved mapping prunes its subtree; an unreadable map must descend and say that it did'
jira: null
resource: null
status: todo
independent: false
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-05T00:00:00Z
tags: [figma, traversal, code-connect]
source_plan: P-NOJIRA-figma-ingestion
depends_on: [T-NOJIRA-figma-ingestion-01]
---

# Traversal with Code Connect as the stopping rule

## Objective

Code Connect is not a verification step after capture — it decides **how deep to go**.
`get_design_context` on a mapped node returned `<sl-grid></sl-grid>` for ten thousand nodes,
against ~233k tokens to expand the same node.

So a failed call does not lose a snippet. **It loses the stopping rule.**

**The dependency on task 01 is soft, and worth naming as such.** The stopping rule is identical in
both modes — nothing halts during traversal — so the traversal is not blocked on the mode being
known. What the mode buys is a cost expectation: on a file known to be drawn in another library,
per-node probing will resolve nothing, and knowing that in advance is the difference between a
deliberate cost and a surprised one. Start 01 first if doing them in sequence; do not wait on it
if someone else is already on 02.

## Steps

1. `get_metadata` at the root — shallow. It stops at instance boundaries by itself: a
   10,936-node design returned 27.
2. `get_code_connect_map` **per node**, never over the subtree. Probed: per-node returns a full
   snippet where the subtree form times out and returns `{{}}`.
3. Branch — `hasTemplate: true` take the snippet and **do not descend**; `hasTemplate: false`
   identified without a snippet, descend for content only; `{{}}` descend fully.
4. **Fail open**: unknown means descend. Failing closed silently drops content.
5. **Record why it descended** — genuinely unmapped, or map unreadable. Probed: per-node on the
   itslearning Banner still returns `{{}}`, so the two are distinguishable by exactly this
   retry.

## Acceptance criteria

- A mapped node's subtree is not fetched.
- Every descent records its reason, and the two reasons are distinguishable in the output.
- A nested instance id containing `;` is handled rather than reported as unmapped — the server
  rejects that format, which has been misread as absence.

## Verification

On a known-mapped design, the token cost of a mapped region is the snippet rather than its expansion; on the itslearning design, every descent is labelled `genuinely-unmapped`.
