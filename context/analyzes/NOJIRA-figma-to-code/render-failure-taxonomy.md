# Why each of the nineteen runs renders or does not

Measured 2026-10-05, immediately after [`T-NOJIRA-corpus-census-01`](../../work/NOJIRA-corpus-census/01-advisory-split.md)
repaired the advisory split, against `captures-v2/`. Every row is a parser error read off
`render-design.mjs`, not an impression.

It exists because the effort's stated goal is **all nineteen runs producing HTML**, and until now
the only number anyone had was how many fail — never _why_, run by run. The distinction decides
which plan owns the remaining work, and the answer turns out to be: **almost none of it is the
harness's.**

## The count

**9 of 19 render** — every region transforming. 11 produce at least one region. 59 regions of 71.

Before the advisory repair, on the same regenerated input: 6, 9 and 49.

## The five causes

|     | cause                                          | runs  | fixable by                             |
| --- | ---------------------------------------------- | ----- | -------------------------------------- |
| 1   | ~~advisory blocks concatenated onto the code~~ | ~~4~~ | **done** — `T-NOJIRA-corpus-census-01` |
| 2   | agent prose wearing JSX                        | 4     | re-capture only                        |
| 3   | no capture the script can produce              | 3     | re-capture only                        |
| 4   | truncation at the MCP output cap               | 2     | re-capture, chunked                    |
| 5   | an emoji in a Code Connect property name       | 1     | design system team                     |

Causes 2–5 overlap on one run (`a6` is both truncated and continuation-split), which is why the
rows total more than the ten non-rendering runs.

### 2 — agent prose wearing JSX

The capture is not Figma's bytes. Something read the response and wrote a summary of it, and the
summary is stored where the code should be. No parser repair reaches these.

| run                             | what is actually in the file                                                                                 |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `a1-kampus-subchapter-feed`     | `function IconButton({ ... })` — `{ ... }` is an ellipsis, not a parameter. Also `{lorem-ipsum description}` |
| `a11-sesame-learning-materials` | `(See conversation transcript / metadata file for the full JSX tree; truncated here for brevity`             |
| `a9-sanna-login`                | `<!-- Insert options here -->` standing in for the options of an `sl-select`                                 |
| `b-itsl-bookmk-course-files`    | `<!-- 6 row instances (1 header … 5 body …) -->` standing in for a table                                     |

`a1` is the worst case because it renders **7 of its 10 regions**: the run looks healthy and three
of its regions are fiction.

### 3 — no capture the script can produce

Three runs hold design-context captures that **no version of `normalise-captures.mjs` generates**.
Their `figma-design-context.md` is prose — `a8` says outright _"See conversation transcript for
the exact code payload"_ — and the `captures/design-context/*.txt` files beside it were written by
a backfill agent, by hand.

`a8-nsp-group-list` · `b-itsl-course-course-files` · `b-kampus-notes-panel`

They render today and will keep rendering, because their committed `captures/` is real. But
**they vanish the moment anyone re-normalises**, which is why the task 01 count has two framings.
They are a provenance class of their own and `T-NOJIRA-corpus-census-02` must name them.

### 4 — truncation at the MCP output cap

| run                            | error                                                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `b-nsp-home`                   | `The character "}" is not valid inside a JSX element` — an element opened and never closed                   |
| `a6-itsl-collab-shared-folder` | `Unexpected end of file before a closing "div" tag`, plus two continuation fragments that cannot parse alone |

`a8`'s own markdown states the mechanism: _"The MCP response was truncated by the tool at its
25000-token output cap."_ This is the single defect that most directly argues for the per-node
traversal in `P-NOJIRA-figma-ingestion`.

### 5 — an emoji in a Code Connect property name

`a5-etsl-metadata-usage-widget`, two regions:

```
<CodeConnectSnippet …><SlIcon ↕️Size="16160:33988" /></CodeConnectSnippet>
```

A Figma variant property is literally named `↕️Size`, and Code Connect emits it as a JSX attribute
name, which no parser accepts. **Not our bug and not a capture bug** — a design-file naming
problem with a one-line fix on the Figma side, or an adapter that sanitises identifiers.

## What this means for the goal of nineteen

**Nine of the ten remaining failures cannot be fixed by parsing.** Seven runs hold captures that
are not Figma's output at all, two are truncated, and one carries a malformed identifier from
Code Connect. Repairing `render-design.mjs` further buys nothing.

So the route from 9 to 19 is:

| step                                                    | gets | owner                                          |
| ------------------------------------------------------- | ---- | ---------------------------------------------- |
| re-capture the seven prose/backfilled runs              | +7   | `P-NOJIRA-figma-ingestion`                     |
| per-node traversal so nothing hits the 25k cap          | +2   | `P-NOJIRA-figma-ingestion`                     |
| rename `↕️Size`, or sanitise identifiers in the adapter | +1   | design system team / `P-NOJIRA-html-artifacts` |

**All nineteen is reachable, and `P-NOJIRA-figma-ingestion` owns nine of the ten.** That is a
stronger argument for running it next than the halt-rate argument
[`what-to-do-next.md`](what-to-do-next.md) makes for it, and it was not available before this
measurement.

One caveat the re-capture must respect: the nineteen are a **measured baseline of 5 of 38 under
the unassisted control**. Re-capturing changes the artifacts, so the baseline stays a kept
artifact and is never re-run under new code — Amendment 6's rule, and this is the first work that
depends on it holding.

## Reproducing it

```
node runs/harness/render-design.mjs --run runs/2026-10-01-<slug> --index captures-v2
```

A run renders when every region in its summary has no `error`.
