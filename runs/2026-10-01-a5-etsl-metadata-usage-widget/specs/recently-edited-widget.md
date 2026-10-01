# Spec — `<sl-etsl-recently-edited-widget>`

Files: `recently-edited-widget/etsl-recently-edited-widget.ts`, `.css`, `.stories.ts`, `etsl-recently-edited-widget.mock.ts`
Class `EtslRecentlyEditedWidget`. **Does NOT register globally.**
Story title: `Runs/A5 ETSL Metadata usage widget/Recently edited widget`

## Purpose

The BODY of the Recently edited widget: a 3-column × 6-row table. The card shell and the
"Recently edited | Remove widget" header belong to the root. Body width ~464px.

## API

- `@property({ attribute: false }) model?: RecentlyEditedWidgetModel`
- event `sl-etsl-recently-edited-select` → `CustomEvent<string>` (the entry id)

## Markup — plain semantic `<table>`, NOT `sl-grid` (OQ3)

`sl-grid` is a virtualizing data grid configured through column child components; this is a
static 3-column table with a row rule and link cells. Columns are a component-internal constant.
`sl-paginator` is NOT used — the Figma `mat-data-footer` node is `hidden="true"`.

## Structural constants

Column headers `Title` / `Outline part` / `Edit date`.
`OUTLINE_PART_LABELS = { 'content-item': 'Content item', section: 'Section' }`.

## Content — verbatim

| id           | title                           | outlinePart  | editedAt            |
| ------------ | ------------------------------- | ------------ | ------------------- |
| choice       | Choice                          | content-item | 23-10-2024 at 14:30 |
| teacher-talk | Teacher talk                    | content-item | 23-10-2024 at 12:30 |
| fill-in      | Fill in                         | content-item | 12-09-2024 at 14:56 |
| kuuntele     | `Kuuntele ja harjoittele: BA..` | section      | 12-09-2024 at 14:45 |
| footprint    | Footprint                       | section      | 12-09-2024 at 11:20 |
| fit-life     | Fit life                        | section      | 12-09-2024 at 11:20 |

Titles render as `<a href="#">` (teal link). The trailing `..` in the Kuuntele title is the
design's own truncation — keep it verbatim.

## Omissions to record

The Figma `sl-button` at `17214:103969` (100×32, table footer, not `hidden`) does **not** appear
in the rendered screenshot and has no readable label. **Omit it**; record as a discrepancy (OQ8).

## A11y

`<table>` + a visually-hidden `<caption>Recently edited</caption>`; `<th scope="col">`.

## Tokens

`th`: `--sl-color-palette-grey-700`, `--sl-text-new-body-lg-fontSize` (16px),
`--sl-text-new-body-lg-lineHeight` (24px), `font-weight: var(--sl-fontWeight-600)`
(the theme's `body-lg-fontWeight` is 400, the design is 600 — use the explicit weight token).
`td`: `--sl-color-palette-grey-900`, `--sl-text-new-body-md-*`.
Row rule: `box-shadow: inset 0 -1px 0 var(--etsl-color-row-divider, rgb(0 0 0 / 12%));`
Link colour `var(--etsl-color-brand, #006666)`. Cell inline padding `--sl-size-200`.
