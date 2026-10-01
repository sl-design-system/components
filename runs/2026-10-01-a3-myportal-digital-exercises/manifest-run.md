# Run manifest — A3 · MyPortal / Bingel · Chapter / Digital Exercises / Exercises

|                         |                                                                                                                                                     |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Case                    | `A3`, team MyPortal                                                                                                                                 |
| Figma                   | `1yroCKkROktqhRCP2wwlzB` node `25124:56828` — [open](https://www.figma.com/design/1yroCKkROktqhRCP2wwlzB/MyPortal-Designs-2025?node-id=25124-56828) |
| Observed                | 1440 × 1024, 2,147 nodes, 75 component types                                                                                                        |
| Theme                   | **`bingel-int`** — recorded as a **tie-break**, not a derivation (see `progress.json` → `theme`)                                                    |
| Framework / i18n / mode | lit · i18n off · **as-is** (no Code Connect expected)                                                                                               |
| Output                  | `examples/lit/src/_runs/a3-myportal-digital-exercises/`                                                                                             |
| Pipeline commit         | `c7f6a370357b902315f9a016e2108274cb24bb76`                                                                                                          |
| Pipeline tree           | `2176d63902204219ed29b22e775e902747248deb`                                                                                                          |
| Stages                  | 1–6 all **done**                                                                                                                                    |

## Files

- `screenshot.png` — raw Figma reference, **50% darkened** (max channel 128). Do not measure against it.
- `reference-normalised.png` — the usable ground truth.
- `figma-metadata.txt` — XML, named `.txt` deliberately.
- `figma-variable-defs.json`, `figma-code-connect-map.json` — both real JSON.
- `figma-design-context.md` + `-part2…-part6.md` — 164 KB verbatim, nothing summarised in place.
- `manifest.md` — the analyst's design manifest (its theme section concludes `bingel-dc`; overridden, see below).
- `token-map.md`, `slds-api.md`, `IMPL-BRIEF.md` — the orchestrator's briefs; `IMPL-BRIEF.md` overrides the manifest.
- `generated/` — the 10 components, demo data and story. **This is the resume source.**
- `testing/` — 5 captures with their `.json` verdicts, plus the measurement and interaction scripts that produced the numbers in this report.

## The 10 components

`sl-a3mp-digital-exercises-page` (root, data owner) · `sl-a3mp-app-bar` · `sl-a3mp-quick-actions-bar` ·
`sl-a3mp-side-nav` · `sl-a3mp-chapter-header` → `sl-a3mp-avatar-cluster` ·
`sl-a3mp-chapter-nav` → `sl-a3mp-chapter-nav-item` · `sl-a3mp-exercises-panel` → `sl-a3mp-exercise-list-item`

Every tag, class and event is `a3mp`-prefixed; the sibling A7 run processes another frame of the same file.

## Two harness defects this run found

1. **`typecheck.mjs` matched nothing.** `tsc` colourises even when piped, so the pretty format
   `file:line:col - error TS…` never matched a parser written for `file(line,col): error TS…`. The
   gate returned an empty error list, which reads as clean — **for every run in the batch**. Two of
   this run's own files shipped syntactically unparseable and the gate passed them. Fixed centrally
   mid-run; re-verified here.
2. **The reference raster is 50% darkened** — max channel 128 across all 1,474,560 pixels. Distinct
   from the documented ~8px canvas bleed, which did **not** occur on this node.

## And one language trap

Backticks inside an HTML comment within a lit ` html` `` template terminate the literal. It broke
4 files here, 5 in A6. There is no readable escape; keep backticks out of template comments.
