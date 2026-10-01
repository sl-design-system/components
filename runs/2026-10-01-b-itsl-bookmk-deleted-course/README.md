# Run b-itsl-bookmk-deleted-course — COMPLETE

Case `B-Itsl-Bookmk-4549-8339` · Itslearning Bookmarks · frame `Deleted course - content`
(`ya00uFyX1rjxYWF0dlOsoT` / `4549:8339`) · pipeline tree `2176d639` · theme **itslearning**.

All six stages done. This run was blocked at Stage 3 by an account weekly usage limit on
2026-09-30 and resumed on 2026-10-01 against the same pipeline tree; the guard was verified before
resuming.

| Stage       | Status                                                                             |
| ----------- | ---------------------------------------------------------------------------------- |
| 1 ingest    | done                                                                               |
| 2 decompose | done — 5 components, 20 open questions, every default recorded                     |
| 3 implement | done — 11 files, typecheck **clean**, token check **clean**                        |
| 4 validate  | done — all 6 stories `rendered`, mean geometry delta **1.82px** over 16 dimensions |
| 5 author    | done — 5 variant stories (example path, so no spec/docs/changeset)                 |
| 6 review    | done — 3 CRITICAL found, 3 resolved, 1 accepted-and-disclosed                      |

## Theme

`theme-match.mjs` initially scored nothing (`colorTokensInDesign: 0`) because this frame binds
itslearning's **legacy** Figma variables (`$gray--900`, `Size/300`, `Body large`) rather than SLDS
semantic colour paths. Derived by hand at 16/17 hex agreement; the tool has since gained a hex
fallback and now reproduces it automatically: `itslearning`, `hex-value-fallback`, agreement
**0.941**, margin over second **15.9x**, `confident: true`.

## Code Connect

`{}` at subtree scope **and** for all 11 significant nodes queried individually, including a retry
with `codeConnectLabel: "SL Design System"`. Root cause: the frame comes from the itslearning
Figma library, not the SLDS library — `get_design_context` emits zero `<sl-*>` tags. This is an
absent-library condition, not the known scoping artifact, so `BLOCKED_ON_CODE_CONNECT` was
correctly **not** raised.

## Contents

- `manifest.md` — design manifest **and** the full decomposition (the Stage 3 resume input).
- `THEME-FACTS.md` — the run's hard constraints: the 54 registered icons, the typography-longhand
  rule, the verified design-colour → token map, border widths.
- `generated/` — the 11 source files, and the resume source (the live tree is gitignored).
- `testing/` — six captures plus their harness reports, and `measure.mjs`, the DOM measurement
  script behind the 1.82px figure.
- `progress.json` — per-stage status, theme evidence, every discrepancy, and the complete
  reach-through inventory.

## Reproducing the gates

```sh
node runs/harness/typecheck.mjs   --scope examples/lit/src/_runs/b-itsl-bookmk-deleted-course
node runs/harness/check-tokens.mjs --scope examples/lit/src/_runs/b-itsl-bookmk-deleted-course --theme itslearning
node runs/harness/shoot.mjs --story runs-b-itsl-bookmk-deleted-course-course-files-page--basic \
  --out /tmp/x.png --theme itslearning --width 1280 --height 1082 --full
```

Restore `generated/` into `examples/lit/src/_runs/b-itsl-bookmk-deleted-course/` first — that tree
is gitignored and a clean checkout wipes it.
