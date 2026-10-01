# Spec — `<sl-etsl-recently-published-widget>`

Files: `recently-published-widget/etsl-recently-published-widget.ts`, `.css`, `.stories.ts`, `etsl-recently-published-widget.mock.ts`
Class `EtslRecentlyPublishedWidget`. **Does NOT register globally.**
Story title: `Runs/A5 ETSL Metadata usage widget/Recently published widget`

## Purpose

The BODY of the Recently published widget: a 4-column × 3-row table. The card shell and its
header belong to the root. Header cells wrap to 2 lines ("Publication date", "Publication
status") — header row 64px, body rows 88px.

## API

- `@property({ attribute: false }) model?: RecentlyPublishedWidgetModel`
- No events.

## Markup

Plain semantic `<table>` (OQ3), not `sl-grid`. Columns are a component-internal constant.

## Structural constants

Headers `Name` / `Environment` / `Publication date` / `Publication status`.

```ts
const STATUS_META = {
  success: { label: 'Success', badgeColor: 'green', icon: 'circle-check-solid' },
  failure: { label: 'Failure', badgeColor: 'red', icon: 'triangle-exclamation-solid' }
} as const;
```

**`statusLabel` is deliberately NOT a model field** — the model carries `status` only.

## Content — verbatim

| id    | name                           | environment                      | publishedAt         | status  |
| ----- | ------------------------------ | -------------------------------- | ------------------- | ------- |
| pub-1 | Publication 1                  | SPKampus publication-kampus      | 23-10-2024 at 14:30 | success |
| pub-2 | Publication 2_test publication | SPKampus publication-kampus-2    | 23-10-2024 at 12:30 | success |
| pub-3 | Publication 3_test publication | SPKampus publication-kampus-dev3 | 12-09-2024 at 14:45 | failure |

The `name` and `environment` cells wrap to two lines at the design's column width — let them.
Names are plain text here, **not** links.

## Icons — a valid Code Connect mapping pointing at the WRONG glyph (OQ5)

The returned CC snippets name `<sl-icon name="fas-backpack">` for **both** Success and Failure.
That glyph is unregistered **and** contradicts the screenshot, which shows a check and an
exclamation. Treat it as Code Connect placeholder data.
→ Render `circle-check-solid` (Success) and `triangle-exclamation-solid` (Failure) — both
registered, both match the render. **Report `fas-backpack` as a bad Code Connect mapping.**
Badge icon `aria-hidden="true"`.

## Composes

`sl-badge` (`color="green"` / `color="red"`, `size="lg"`), `sl-icon` — both via `scopedElements`.
Do **not** override the badge's own internal colours; ETSL resolves
`--sl-color-foreground-accent-{green,red}-bold` to different hexes than Figma, which is a
name-level match and is expected.

## A11y

`<table>` + visually-hidden `<caption>Recently published</caption>`; `<th scope="col">`.

## Tokens

Same table set as the recently-edited spec: `th` `--sl-color-palette-grey-700` +
`--sl-text-new-body-lg-fontSize`/`-lineHeight` + `var(--sl-fontWeight-600)`;
`td` `--sl-color-palette-grey-900` + `--sl-text-new-body-md-*`;
row rule `inset 0 -1px 0 var(--etsl-color-row-divider, rgb(0 0 0 / 12%))`;
cell inline padding `--sl-size-200`.
