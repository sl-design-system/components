# Spec — `<sl-etsl-reused-content-widget>`

Files: `reused-content-widget/etsl-reused-content-widget.ts`, `.css`, `.stories.ts`, `etsl-reused-content-widget.mock.ts`
Class `EtslReusedContentWidget`. **Does NOT register globally.**
Story title: `Runs/A5 ETSL Metadata usage widget/Reused content widget`

## Purpose

The BODY of the Reused content widget: a 2-tab strip above a 3-column × 5-row table.
The card shell and its header belong to the root.

## API

- `@property({ attribute: false }) model?: ReusedContentWidgetModel`
- `@property({ attribute: 'active-tab', reflect: true }) activeTab: ReusedContentTabId = 'source-items'`
- event `sl-etsl-reused-outline-select` → `CustomEvent<string>` (the entry id)
- **No tab-change event** — the widget owns its own tab state; the root does not need it.

## Composes

`sl-tab-group` + `sl-tab` — **strip only, NO `<sl-tab-panel>`** — plus a plain `<table>` (OQ3).
Do NOT re-declare `sl-tab-change` in `GlobalEventHandlersEventMap`; `sl-tab-group` already does.
Listen for the tab group's own change event to flip `activeTab`.

## Structural constants

Tab labels `Outlines with source items` / `Outlines with linked items`.
Column headers `Source outline` / `Project name` / `Linked items in current outline`.

## Content — source-items tab, verbatim

| id        | outlineName | projectName                                       | linkedItemCount |
| --------- | ----------- | ------------------------------------------------- | --------------- |
| outline-1 | Outline 1   | `FyKe 7−9 Fysiikka VII Maailmankaikkeuden suuret` | 15              |
| outline-2 | Outline 2   | Taalblokken Engels                                | 2               |
| outline-3 | Outline 3   | Taalblokken Engels                                | 1               |
| outline-4 | Outline 4   | Taalblokken Engels                                | 1               |
| outline-5 | Outline 5   | Taalblokken Engels                                | 1               |

**Note the EN-DASH in `7−9`** (U+2212 minus / en-dash as authored) — copy the string exactly.
Row 1 is 88px tall because the project name wraps to three lines at the column width; rows 2–5
are 48px. Do not force the heights — let the wrap produce them.
Outline names render as `<a href="#">` (teal link).

## The second tab has no design content (OQ6)

`linkedItems: []`. When `activeTab === 'linked-items'` render a single full-width empty-state row
reading `No outlines with linked items`. The default story selects tab 1, so the visual diff is
unaffected.

## A11y

`sl-tab-group` provides the tab semantics. The table sits outside the tab group and is
re-rendered on tab change, so give the table wrapper `role="region"` + an `aria-label` naming the
active tab. `<table>` + visually-hidden `<caption>`; `<th scope="col">`.

## Tokens

Tab strip bottom border `--sl-color-palette-grey-300`; selected indicator
`--sl-color-palette-blue-500`; tab label `--sl-text-new-body-md-*` in
`var(--etsl-color-chrome, #02242e)`. Table tokens identical to the recently-edited spec.
