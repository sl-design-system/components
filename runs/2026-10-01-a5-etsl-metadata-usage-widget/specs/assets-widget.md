# Spec — `<sl-etsl-assets-widget>`

Files: `assets-widget/etsl-assets-widget.ts`, `.css`, `.stories.ts`, `etsl-assets-widget.mock.ts`
Class `EtslAssetsWidget`. **Does NOT register globally.**
Story title: `Runs/A5 ETSL Metadata usage widget/Assets widget`

## Purpose

The BODY of the Assets widget only — the 2-column × 6-row grid of 12 asset-type tiles.
The widget card shell and its "Assets 39 | 4 asset requests" header belong to the root; do not
render them. Widget body width 282px, tiles 117×104 with a 16px gutter.

## API

- `@property({ attribute: false }) model?: AssetsWidgetModel`
- event `sl-etsl-asset-type-select` → `CustomEvent<AssetTypeId>` (via `@event` + `EventEmitter`)

## Markup

`<ul class="tiles">` + 12 `<li class="tile">`. **No per-tile component** (OQ10: rejected).
Each tile: a 32px-high logo box, a `Name (n)` label, and a "See all" control.

## Composes

`sl-button fill="link" size="sm"` for "See all" (the CC-mapped control).
`disabled` when `count === 0` — that is 5 of the 12 (YouTube, GeoGebra, Sowiso, MathType, ChemType).

## Content — transcribe verbatim, row-major across 2 columns

| id                                                                                             | label       | count |
| ---------------------------------------------------------------------------------------------- | ----------- | ----- |
| document                                                                                       | Document    | 10    |
| picture                                                                                        | Picture     | 8     |
| audio                                                                                          | Audio       | 8     |
| video                                                                                          | Video       | 6     |
| streaming                                                                                      | Streaming   | 4     |
| explorit                                                                                       | Explorit    | 2     |
| three-ships                                                                                    | Three Ships | 1     |
| youtube                                                                                        | YouTube     | 0     |
| geogebra                                                                                       | GeoGebra    | 0     |
| sowiso                                                                                         | Sowiso      | 0     |
| mathtype                                                                                       | MathType    | 0     |
| chemtype                                                                                       | ChemType    | 0     |
| Reading order: Document, Picture / Audio, Video / Streaming, Explorit / Three Ships, YouTube / |
| GeoGebra, Sowiso / MathType, ChemType.                                                         |

## Icons — ALL TWELVE TILE LOGOS DEVIATE. Record as one Stage 4 discrepancy.

- **LEFT OUT** (not in the 54): `file` (Document), `image` (Picture), `volume` (Audio),
  `play` (Video), `signal-stream` (Streaming). Those five tiles render an **empty**
  `<span class="logo" aria-hidden="true">` that reserves the 32px height. No substitute icon.
- The seven brand tiles (Explorit, Three Ships, YouTube, GeoGebra, Sowiso, MathType, ChemType)
  show brand wordmark images in Figma with expiring CDN URLs. Render the **wordmark as plain text**
  in that same 32px box. No `<img>`, no hand-drawn vector.
- Define `ASSET_WORDMARKS: Partial<Record<AssetTypeId, string>>` as a component constant.

## A11y

`<ul>`/`<li>`. The 12 "See all" labels are identical, so each needs
`aria-label="See all Document assets"` etc.

## Tokens

tile border 1px `--sl-color-palette-grey-400`; radius `--sl-size-borderRadius-md`;
padding `--sl-space-100`; label `--sl-text-new-body-md-*` in `--sl-color-palette-grey-900`;
"See all" idle `var(--etsl-color-brand, #006666)`, active `var(--etsl-color-brand-active, #003d3d)`

- underline; disabled `--sl-color-palette-grey-500`.
