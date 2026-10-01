# Spec — `<sl-etsl-app-header>`

Files: `app-header/etsl-app-header.ts`, `.css`, `.stories.ts`, `etsl-app-header.mock.ts`
Class `EtslAppHeader`. **Does NOT register globally** (class export only).
Story title: `Runs/A5 ETSL Metadata usage widget/App header`

## Purpose

Dark top bar (wordmark, Projects control, avatar) + the light title band with `<h1>` and the
7-tab navigation strip. Full-bleed 1440px wide; bar 50px tall, band 148px tall.

## API

- `@property({ attribute: false }) model?: AppHeaderModel`
- `@property({ attribute: 'active-tab', reflect: true }) activeTab: EtslNavTabId = 'dashboard'`
- event `sl-etsl-nav-tab-select` → `SlEtslNavTabSelectEvent = CustomEvent<EtslNavTabId>`
  (use the `@event` decorator + `EventEmitter` from `@sl-design-system/shared`, never a raw
  `new CustomEvent`). Add the type to `GlobalEventHandlersEventMap`.
- No slots.

## Composes

`sl-avatar` (`display-name="Jesse Vermeer"`, initials `JV`, `size="md"`), `sl-icon`,
`sl-tab-group` + `sl-tab` — **tab strip only, NO `<sl-tab-panel>`** (OQ4: these are routes).
Do NOT re-declare `sl-tab-change` in `GlobalEventHandlersEventMap` — `sl-tab-group` already does.

## Structural constants (inside the component, not model fields)

```ts
const NAV_TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'publications', label: 'Publications' },
  { id: 'export', label: 'Export' },
  { id: 'asset-request', label: 'Asset request' },
  { id: 'metadata-imports', label: 'Metadata imports' },
  { id: 'metadata-exports', label: 'Metadata exports' },
  { id: 'connected-outlines', label: 'Connected outlines' }
] as const;
```

Wordmark text: `Editorial Suite`.

## Content

H1 = `Functional management` (centred, Raleway Bold 28/38). Dashboard tab is selected.

## Icons

- `chevron-down` ✔ registered — the Projects control's trailing chevron.
- **LEFT OUT**: `book-circle-arrow-up` (the Projects leading glyph) — not in the 54.
- The wordmark is a Figma CDN PNG with a 7-day URL. **Do not fetch it, do not emit `<img>`.**
  Render the text `Editorial Suite` styled white instead.
  Record both as Stage 4 discrepancies in your report.

## A11y

Plain `<div>`s — **no `<nav>`, no `role="banner"`, no `<main>`**; the host app owns landmarks.
`<h1>` is fine. `sl-tab-group` supplies tablist/tab roles. Projects control is
`<button aria-label="Projects">`.

## Tokens

- top bar bg: `var(--etsl-color-chrome)` (run-local, inherited from the root; in the STORY only,
  declare it on `:host` of the story wrapper OR add a `:host` fallback block in this component's
  CSS guarded with a comment — see note below)
- title band bg `--sl-color-palette-grey-050`; band bottom border 1px `--sl-color-palette-grey-300`
- H1: `font-family: var(--sl-heading-fontFamily)`; `font-size: var(--sl-text-new-heading-xl-fontSize)`;
  `line-height: var(--sl-text-new-heading-xl-lineHeight)`; `font-weight: var(--sl-fontWeight-bold)`.
  (Design is 28/38 ls −1; no exact size token — record the delta.)
- tab label: `--sl-text-new-body-md-fontFamily/-fontSize/-lineHeight/-fontWeight`,
  colour `var(--etsl-color-chrome)`; selected indicator `--sl-color-palette-blue-500`
- avatar bg `--sl-color-background-primary-bold`, initials `--sl-color-foreground-primary-onBold`
  (camelCase `onBold` — not `-on-bold`)

**Run-local custom-property note**: the ROOT declares the `--etsl-color-*` palette on its
`:host`, and custom properties inherit through shadow boundaries. So that your own standalone
story still renders correctly, use the `var(name, fallback)` form at each use site:
`background: var(--etsl-color-chrome, #02242e); /* unbound in editorial-suite */`.
That fallback hex is the only hardcoded colour permitted, and every occurrence must carry the
comment. Do NOT declare `--etsl-color-*` on your own `:host` — that would shadow the root.
