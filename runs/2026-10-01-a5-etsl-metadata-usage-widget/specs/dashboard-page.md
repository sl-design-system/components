# Spec — `<sl-etsl-dashboard-page>` (ROOT, level 1)

Files: `etsl-dashboard-page.ts`, `etsl-dashboard-page.css`, `etsl-dashboard-page.stories.ts`, `mock-data.ts`
Class `EtslDashboardPage`. **This is the ONLY component that registers globally.**
Story title: `Runs/A5 ETSL Metadata usage widget/Dashboard page`
→ story id `runs-a5-etsl-metadata-usage-widget-dashboard-page--basic`

```ts
if (!customElements.get('sl-etsl-dashboard-page')) {
  customElements.define('sl-etsl-dashboard-page', EtslDashboardPage);
}
```

And the story must carry a **plain side-effect import** of the module so that runs:
`import './etsl-dashboard-page.js';` — a `import { type X } from` is erased at transform time
and the element never registers (the element then sits in the DOM at 0×0 with no shadow root).

## The seven children already exist — read them, do not rewrite them

`app-header/`, `assets-widget/`, `content-items-widget/`, `recently-edited-widget/`,
`metadata-usage-widget/`, `recently-published-widget/`, `reused-content-widget/`.
Each exports its class, its model interface(s), and a `*.mock.ts` fixture. Read each file's
actual exports before importing — use the real names, do not assume.
They do NOT self-register: declare all seven in `static get scopedElements()` alongside the
SLDS elements you render (`sl-panel`, `sl-button`, `sl-icon`), and use `ScopedElementsMixin`.

## Purpose

Owns the page data, the 1200px content column with 120px gutters on a 1440px frame, all eight
`sl-panel` widget shells with their headings and header actions, the right rail, and the two
sidebar card bodies.

## API

- `@property({ attribute: false }) data: EtslDashboardData` — **defaults to the mock**, so the
  story renders the whole design from `<sl-etsl-dashboard-page></sl-etsl-dashboard-page>` with
  no args. That is the acceptance bar.
- `@state() private removedWidgets = new Set<EtslWidgetId>()` — "Remove widget" hides that card
  (OQ15). The default story shows all eight.
- No slots, no emitted events (it is the page root).

## `mock-data.ts`

Imports the seven child fixtures and assembles `EtslDashboardData`, adding only the
root-rendered content. Put a `// TODO: replace with fetch('/api/etsl/functional-management/dashboard')`
comment where a real app would load it.
Root-only content: `assetsTotal: 39`, `assetRequestCount: 4`, `contentItemsTotal: 164`,
`productIds: ['5678976','5678976','5678976','5678976','5678976','5678976']`, and

```ts
descriptiveMetadata: {
  created: '24-10-2024',
  author: 'ETSLTeam PM',
  lastUpdated: '6-11-20244',           // design typo — keep verbatim
  lastUpdatedBy: 'Xavier Mitchell',
  outlineTemplateLastUpdated: '24-10-2024',
  language: 'English'
}
```

## Layout (from the screenshot — open it)

Full-bleed `<sl-etsl-app-header>` at the top. Then a 1200px centred column, 120px gutters,
24px top padding, laid out as:

- **Top band** (792px tall), three columns side by side with 24px gaps:
  `Assets` panel (282px) · `Content items` panel (~588px) · right rail (~282px)
- **Right rail**, stacked: three full-width buttons (Add widget / Outline editor /
  Advanced search), then the `Descriptive metadata` panel, then the `Product IDs` panel.
- **Lower band**, a 2-column grid, 24px gap, two rows:
  `Recently edited` | `Metadata Usage` , then `Recently published` | `Reused content`.

## The eight `sl-panel` shells

Read `packages/components/panel/src/panel.ts` for its real slot names and parts before writing.
Per OQ12: use `slot="aside"` for a single header action (NOT `slot="actions"`, which wraps
children in an `sl-tool-bar align="end"` that force-sets `fill` on slotted buttons), and a rich
`slot="heading"` for the Assets and Content items headers.

| Widget id            | Heading                               | Header action                                                |
| -------------------- | ------------------------------------- | ------------------------------------------------------------ |
| assets               | `Assets` + big `39` + a vertical rule | `4` (red) + `sl-button` "asset requests"                     |
| content-items        | `Content items` + big `164`           | —                                                            |
| descriptive-metadata | `Descriptive metadata`                | —                                                            |
| product-ids          | `Product IDs`                         | icon-only `xmark` button, `aria-label="Dismiss Product IDs"` |
| recently-edited      | `Recently edited`                     | ghost `xmark` + "Remove widget"                              |
| metadata-usage       | `Metadata Usage`                      | ghost `xmark` + "Remove widget"                              |
| recently-published   | `Recently published`                  | ghost `xmark` + "Remove widget"                              |
| reused-content       | `Reused content`                      | ghost `xmark` + "Remove widget"                              |

The four "Remove widget" labels are identical, so each needs a distinguishing
`aria-label="Remove Metadata Usage widget"` etc.

## The two sidebar card bodies (rendered inline here, not components)

- **Descriptive metadata** — a `<dl>` of six rows, label SemiBold then value Regular on one
  line, 14/20 in `--sl-color-palette-grey-800`:
  `Created:` `Author:` `Last updated:` `Last updated by:` `Outline template last updated:`
  `Language:`. The "Outline template last updated:" row wraps onto two lines.
- **Product IDs** — six `5678976` links in two columns of three.

## The three right-rail buttons

| Label                                                                                           | Fill            | Icons                                                                                   |
| ----------------------------------------------------------------------------------------------- | --------------- | --------------------------------------------------------------------------------------- |
| Add widget                                                                                      | solid (primary) | leading `plus` ✔ registered                                                             |
| Outline editor                                                                                  | outline         | leading `edit`/`pen-to-square` **NOT REGISTERED → left out**; trailing `arrow-right` ✔  |
| Advanced search                                                                                 | outline         | leading `magnifying-glass-plus` **NOT REGISTERED → left out**; trailing `arrow-right` ✔ |
| Record both omissions as Stage 4 discrepancies. Do not substitute the generic `search` icon for |
| `magnifying-glass-plus` and do not hand-draw anything.                                          |

## Icons available to you

`plus`, `arrow-right`, `xmark` — all three registered. Nothing else here.

## A11y

Outer wrapper is a plain `<div class="page">` — **no `<main>`, no `role="main"`**.
Each `sl-panel` gets `role="region"` + `aria-label` = its title.

## Tokens — declare the run-local palette ONCE, here, on `:host`

```css
:host {
  /* unbound in editorial-suite — each needs a real theme token; see manifest Token Reference */
  --etsl-color-brand: #006666;
  --etsl-color-brand-active: #003d3d;
  --etsl-color-chrome: #02242e;
  --etsl-color-bar-indicator: #ca6f2a;
  --etsl-color-metric-used: #0d8e4c;
  --etsl-color-metric-used-surface: #d3f8de;
  --etsl-color-row-divider: rgb(0 0 0 / 12%);
  --etsl-shadow-widget: 0 8px 16px #3232470f, 0 2px 4px #32324714;
}
```

Custom properties inherit through shadow boundaries, so the seven children pick these up.
Everything else must be a real `--sl-*` token:

- page bg `--sl-color-palette-grey-000`; panel header strip `--sl-color-palette-grey-050`
- panel radius `--sl-size-borderRadius-md`; panel border `--sl-color-palette-grey-300`
- panel shadow `var(--etsl-shadow-widget)`
- panel title: `font-family: var(--sl-heading-fontFamily)`,
  `font-size: var(--sl-text-new-heading-md-fontSize)` (16 ✔),
  `line-height: var(--sl-text-new-heading-md-lineHeight)` (20 — design is 24, record the delta),
  `font-weight: var(--sl-fontWeight-bold)`.
  **Never** `font: var(--sl-text-new-heading-md)` — the bare token does not exist in this theme
  and the browser drops the whole declaration silently.
- sidebar rows `--sl-color-palette-grey-800`; body text `--sl-text-new-body-md-*` longhands
- the "4" beside "asset requests" `--sl-color-palette-red-600`
- spacing `--sl-space-050`, `--sl-space-100`, `--sl-size-150`, `--sl-size-200`, `--sl-size-300`
- icon size `--sl-size-icon-font-md`
  The 1200px column / 120px gutter / per-widget widths have no token namespace — hardcode them as
  dimensions (permitted) and note it.
