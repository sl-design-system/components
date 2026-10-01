# Spec — `<sl-etsl-content-items-widget>`

Files: `content-items-widget/etsl-content-items-widget.ts`, `.css`, `.stories.ts`, `etsl-content-items-widget.mock.ts`
Class `EtslContentItemsWidget`. **Does NOT register globally.**
Story title: `Runs/A5 ETSL Metadata usage widget/Content items widget`

## Purpose

The BODY of the Content items widget: 26 labelled determinate bars in two columns of 13.
The card shell and the "Content items 164" header belong to the root. Body width ~588px.

## API

- `@property({ attribute: false }) model?: ContentItemsWidgetModel`
- event `sl-etsl-content-item-select` → `CustomEvent<string>` (the metric label)

## Markup

Two `<ul>`s (or one `<ul>` with CSS `columns: 2`) of `<li>`. Each `<li>`:
a label `<a href="#">Text (40)</a>` then a track `<div>` containing an indicator `<div>` with
`role="progressbar" aria-valuenow aria-valuemin="0" aria-valuemax="100" aria-labelledby`.
The 13/13 column split is component structure, NOT a model field.

## Do NOT use `sl-progress-bar` (OQ2 — three measured blockers)

(a) `ProgressBar.updated()` calls `announce(..., 'assertive')` on every `value` change — 26 bars
would fire 26 assertive live-region announcements on first render;
(b) the design's indicator colour is only reachable through the **private** `--_fill-color`;
public `color="orange"` maps to a different hue;
(c) `packages/components/progress-bar/src/progress-bar.css` line 66 uses
`font: var(--sl-text-new-heading-sm)` — a **bare** token that does not exist in editorial-suite,
so its label typography silently drops. **Mention (c) in your report as an SLDS bug** regardless.
Hand-roll the track + indicator as two `<div>`s with full ARIA.

## Content — 26 rows, verbatim including the design's own typos

`{ label, count, percent }`:

1. Text, 40, 30.3 · 2. Choice, 31, 24.8 · 3. Arrange, 15, 14.5
2. `Fill in - Open question model asnwer`, 14, 13.7 ← keep the typo **asnwer**
3. Fill in - Open question short response, 9, 11.5
4. Fill in - Open question long response, 9, 11.5
5. Fill in - Drop, 9, 11.8 · 8. Fill in - Write text on image, 8, 10.7
6. Fill in - Correct the text, 6, 9.2 · 10. Match - Single response, 3, 5.0
7. `Match - Multiple  response`, 3, 4.6 ← keep the **double space**
8. Match - Matrix, 2, 3.1 · 13. Match - Cloze combi, 2, 3.4
9. Match - Gap match, 2, 3.1 · 15. Match - Drag image, 2, 3.1
10. Match - Match in categories, 1, 1.5 · 17. Select - Select in categories, 1, 1.5
11. Select - Right option, 1, 1.5 · 19. Select - Words, 1, 1.5
12. Select - Hotspot, 1, 1.5 · 21. Select - Click on image, 1, 1.5
13. Flash card, 1, 1.5 · 23. External - External interaction, 1, 1.5
14. External - External text, 1, 1.5 · 25. Generic, 1, 1.5 · 26. Folio, 1, 1.5

Rows 1–13 fill the left column, 14–26 the right. The rendered label is `${label} (${count})`.
`percent` is measured from Figma and is deliberately NOT a function of count (OQ9).

## Tokens

track `--sl-color-palette-grey-100`; indicator `var(--etsl-color-bar-indicator, #ca6f2a)`
(`/* unbound in editorial-suite */`); label `var(--etsl-color-brand, #006666)` with
`--sl-text-new-body-md-*`; row gap `--sl-space-050`.
Bar height is 6px and no token equals 6px (`--sl-size-050` is 4px) — hardcode `6px` as a
**dimension**, which is permitted, and note it.
