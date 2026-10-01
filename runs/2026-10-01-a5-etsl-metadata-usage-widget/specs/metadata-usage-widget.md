# Spec — `<sl-etsl-metadata-usage-widget>`

Files: `metadata-usage-widget/etsl-metadata-usage-widget.ts`, `.css`, `.stories.ts`, `etsl-metadata-usage-widget.mock.ts`
Class `EtslMetadataUsageWidget`. **Does NOT register globally.**
Story title: `Runs/A5 ETSL Metadata usage widget/Metadata usage widget`

This is the widget the run is named after — give it the most care.

## Purpose

The BODY of the Metadata Usage widget: three stat tiles (Total / Used / Unused) in a row above a
3-column × 6-row table. The card shell and the "Metadata Usage | Remove widget" header belong to
the root. Body width ~464px; the three tiles sit side by side, each ~144×76.

## API

- `@property({ attribute: false }) model?: MetadataUsageWidgetModel`
- No events — nothing here is interactive.

## Markup

`<ul class="stats">` with three `<li>` — **the "stat tile" net-new primitive is rejected** (OQ10),
it is not a component. Then a plain `<table>` (OQ3), not `sl-grid`.

## Structural constants

```ts
const STAT_TILES = [
  { key: 'total', caption: 'Total' },
  { key: 'used', caption: 'Used', icon: 'circle-check-solid' },
  { key: 'unused', caption: 'Unused', icon: 'triangle-exclamation-solid' }
] as const;
```

Column headers `Metadata category` / `Metadata field` / `Usage`.

## Content — verbatim

Totals: total **2916**, used **2409**, unused **507**.

| id                | category         | field             | usage |
| ----------------- | ---------------- | ----------------- | ----- |
| product-id        | General settings | Product ID        | 88    |
| demo-product      | General settings | Demo product      | 47    |
| subject           | General settings | Subject           | 12    |
| cover-image-slice | General settings | Cover image slice | 7     |
| combi-content     | Feed settings    | Combi content     | null  |
| hide-from-feed    | Feed settings    | Hide from feed    | null  |

`usage === null` renders `<sl-badge color="orange" size="lg">Unused</sl-badge>` — verbatim from
the Code Connect snippet. A number renders as plain text.

## Icons — both ARE registered, no discrepancy here

`circle-check-solid` (Used tile) ✔ and `triangle-exclamation-solid` (Unused tile) ✔ are both in
the theme's 54 and both match the screenshot. Compose `sl-icon` via `scopedElements`.
Icons are decorative — the caption carries the meaning — so `aria-hidden="true"`.

## A11y

`<ul>` for the tiles; `<table>` + visually-hidden `<caption>Metadata usage</caption>`;
`<th scope="col">`.

## Tokens

- Total tile: border 1px `--sl-color-palette-grey-400`, white bg, number
  `--sl-color-palette-grey-900` (design binds `#222222`; ETSL grey-900 is `#1d1f20` — accept the
  2-hex delta and note it).
- Used tile: border `--sl-color-palette-green-400`, surface
  `var(--etsl-color-metric-used-surface, #d3f8de)`, number `var(--etsl-color-metric-used, #0d8e4c)`.
  (Figma is a stacked white-50%-over-`#d3f8de` gradient; a flat fill is the honest approximation —
  record it.)
- Unused tile: bg `--sl-color-palette-orange-100`, border `--sl-color-palette-orange-500`,
  number `--sl-color-palette-orange-600`.
- Number type: `font-family: var(--sl-heading-fontFamily)`;
  `font-size: var(--sl-text-new-heading-lg-fontSize)` (24 ✔);
  `line-height: var(--sl-text-new-heading-lg-lineHeight)` (32 — design is 34, record the delta);
  `font-weight: var(--sl-fontWeight-500)`.
- Caption: `--sl-text-new-body-md-*`. Radius `--sl-size-borderRadius-md`. Gap `--sl-space-100`.
- Table: same token set as the recently-edited spec (row rule
  `var(--etsl-color-row-divider, rgb(0 0 0 / 12%))`, `th` 16/24 weight 600, `td` body-md).
