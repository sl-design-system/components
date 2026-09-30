# Design Manifest — Group list (A8-nsp-group-list)

Figma: https://www.figma.com/design/4TdMrcnIVOn3Hrfj2OpVZU/New-Secondary?node-id=334-20573
fileKey `4TdMrcnIVOn3Hrfj2OpVZU`, nodeId `334:20573`. Theme: `sanoma-pro` (NSP). Framework: lit. i18n: off.
Output location: `examples/lit/src/_runs/a8-nsp-group-list/`.

## Overview

Figma file "New Secondary" (NSP team), top-level frame **"Group list"** (node `334:20573`), 1280x1024 px. It is a student-facing dashboard home screen: a "Welcome back, Sarah" header, a "Live now" highlighted lesson card with class info, a stacked avatar/join-count indicator and three action buttons, a "My groups" section rendered as a 2-column grid of actionable class cards, and a top app header bar (logo, notification bell, account/avatar control).

## Existing SLDS Components Used

| Node ID                    | Node Name          | Mapped Component                                                             | CC Snippet (excerpt)                                                                                                          |
| -------------------------- | ------------------ | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 334:22670                  | sl-badge           | `<sl-badge color="red" emphasis="bold" size="sm">`                           | `<sl-badge color="red" emphasis="bold" size="sm">Status</sl-badge>`                                                           |
| 334:20593                  | sl-avatar          | `<sl-avatar display-name="7 students already joined" display-initials="JV">` | `<sl-avatar color="primary" emphasis="bold" display-name="7 students already joined" display-initials="JV">Class</sl-avatar>` |
| 334:20668                  | Action 1           | `<sl-button variant="primary" shape="pill">`                                 | `<sl-button shape="pill" variant="primary">Join live lesson</sl-button>`                                                      |
| 334:20669                  | Action 3           | `<sl-button shape="pill">`                                                   | `<sl-button shape="pill">Use lesson code</sl-button>`                                                                         |
| 364:19522                  | Action 2           | `<sl-button fill="ghost" shape="pill">`                                      | `<sl-button fill="ghost" shape="pill">Open e-book</sl-button>`                                                                |
| 334:20678                  | sl-card Actionable | `<sl-card>` (Actionable variant)                                             | (identified — `null` CC map, node name is literal `sl-card Actionable`; CC component description node 4:7262 confirms)        |
| 334:20679                  | sl-card Actionable | `<sl-card>` (Actionable variant)                                             | (identified)                                                                                                                  |
| 334:20680                  | sl-card Actionable | `<sl-card>` (Actionable variant)                                             | (identified)                                                                                                                  |
| 334:20681                  | sl-card Actionable | `<sl-card>` (Actionable variant)                                             | (identified)                                                                                                                  |
| 334:20682                  | sl-card Actionable | `<sl-card>` (Actionable variant)                                             | (identified)                                                                                                                  |
| 334:20683                  | sl-card Actionable | `<sl-card>` (Actionable variant)                                             | (identified; `hidden=true` in Figma — NOT rendered, exclude)                                                                  |
| I334:20685;10:557          | sl-button-pill     | `<sl-button shape="pill">` icon-only (notification bell)                     | (identified by sub-node name; CC component description node 1:4411)                                                           |
| I334:20685;67:2159         | sl-badge           | `<sl-badge>` (notification dot over bell)                                    | (identified by sub-node name)                                                                                                 |
| I334:20685;10:4007;10:2841 | sl-avatar          | `<sl-avatar>` (header account avatar)                                        | (identified by sub-node name)                                                                                                 |
| I334:20685;10:4007;10:3939 | sl-icon            | `<sl-icon>` (chevron-down)                                                   | (identified by sub-node name; CC component description node 1:397)                                                            |

## Composition Candidates

- **Avatar-cluster / "N students joined" indicator** — `334:20593` (real `sl-avatar` instance) + `334:20594`, `334:20618`, `334:20642` (three detached frames still named "sl-avatar" rendering the stacked-circle imagery). They form one unit (overlapping avatar stack + trailing label) inside the live-lesson card. The three detached frames look like manually exploded avatar anatomy rather than separate placements.
- **Top header bar** — `334:20685` + children `I334:20685;111:12383` (Logo), `I334:20685;10:557` (bell icon button), `I334:20685;10:4007` (avatar + chevron-down account control), `I334:20685;67:2159` (notification badge). A fixed global app-bar unit.
- **Live-lesson hero card** — `334:20584`/`334:20585` (card frame), `334:20586` (image), `334:20588`–`334:20590` (title/subtitle), the avatar cluster, `334:20666`/`334:20667` (action button stack). One bordered card combining media, text, avatar summary and a vertical action-button stack.
- **Class grid / "My groups" section** — `334:20670`–`334:20673` (heading) + `334:20677` (grid of `sl-card Actionable` `334:20678`–`334:20682`). Heading + repeating card grid.

## Net-New Primitive Candidates

_None._ Every node either has a Code Connect mapping or is identifiable as an existing SLDS component by name / sub-node / documented CC component description. The "Logo" node (`I334:20685;111:12383`) is a brand image asset (SVG), not a UI primitive.

## Responsive Breakpoints

_Single breakpoint: 1280px._ Frame fixed at 1280x1024; no alternate-width frames or layout-grid breakpoint annotations in the metadata.

## Designer Annotations

_None._

## Token Reference

Built from `get_variable_defs`; every name below was grepped against `packages/themes/sanoma-pro/theme.css` and confirmed to exist verbatim as a `--sl-*` custom property.

**Color**

- `--sl-color-foreground-primary-bold` (#0a6165)
- `--sl-color-background-primary-bold` (#057c80)
- `--sl-color-foreground-accent-grey-subtlest` (#5a696f)
- `--sl-color-foreground-plain` (#49555a)
- `--sl-color-foreground-bold` (#253646)
- `--sl-color-foreground-primary-onBold` (#ffffff)
- `--sl-color-foreground-secondary-onBold` (#253646)
- `--sl-color-foreground-secondary-bold` (#253646)
- `--sl-color-background-secondary-bold` (#e7eced)
- `--sl-color-background-neutral-bold` (#e7eced)
- `--sl-color-background-neutral-subtlest` (#5a696f1a)
- `--sl-color-background-neutral-interactive-plain` (#49555a)
- `--sl-color-background-accent-red-bold` (#d32534)
- `--sl-color-foreground-accent-teal-bold` (#0a6165)
- `--sl-color-border-plain` (#d3dcdf)
- `--sl-color-border-primary-bold` (#0a6165)
- `--sl-color-transparent` (rgba(0,0,0,0))
- `--sl-elevation-surface-raised-default` (#ffffff)
- `--sl-elevation-surface-base-default` (#ffffff)

**Size / Spacing**

- `--sl-space-new-2xs` (2), `--sl-space-new-xs` (4), `--sl-space-new-sm` (6), `--sl-space-new-md` (8), `--sl-space-new-lg` (16), `--sl-space-new-xl` (24), `--sl-space-new-2xl` (32)
- `--sl-space-050` (4), `--sl-space-100` (8), `--sl-space-125` (10), `--sl-space-200` (16), `--sl-space-300` (24), `--sl-space-500` (40 — exact match for the 40px section gap)
- `--sl-size-borderRadius-default` (4), `--sl-size-borderRadius-lg` (8), `--sl-size-borderRadius-xl` (12), `--sl-size-borderRadius-full` (800)
- `--sl-size-borderWidth-none` (0), `--sl-size-borderWidth-default` (1), `--sl-size-borderWidth-action` (1)
- `--sl-size-icon-font-md` (16)

**Typography**

- `--sl-size-text-new-heading-xl` (32), `--sl-size-text-new-heading-lg` (24), `--sl-size-text-new-heading-md` (16), `--sl-size-text-new-body-lg` (16), `--sl-size-text-new-body-md` (14)
- `--sl-text-new-typeset-fontFamily-heading` / `--sl-text-new-typeset-fontFamily-body` (Open Sans)
- `--sl-text-new-typeset-fontWeight-semiBold` (600), `--sl-text-new-typeset-fontWeight-regular` (400)
- `--sl-size-lineHeight-250` (20), `--sl-size-lineHeight-300` (24), `--sl-size-lineHeight-400` (32), `--sl-size-lineHeight-500` (40)
- `--sl-text-new-typeset-fontFamily-icon` (Font Awesome 7 Pro), `--sl-icon-typeset-fontWeight-icon-regular` (Regular)
- Font shorthands used by the design: `Heading/xl`, `Heading/lg`, `Heading/md`, `Body/lg/regular`, `Body/md/regular`, `Body/md/bold` — i.e. the `--sl-text-new-heading-*` / `--sl-text-new-body-*` shorthand tokens. NOTE: a `--sl-text-new-*` shorthand resets `font-weight: normal`; add an explicit `font-weight: var(--sl-text-new-typeset-fontWeight-semiBold)` after it for any semibold text.

**Other**

- `--sl-opacity-interactive-bold-idle` (0), `--sl-opacity-interactive-plain-idle` (0)

No values were flagged `(unbound — needs a token)`.

## Design content (verbatim, read off the reference screenshot — this is ground truth)

Page is on a white canvas, content column inset from the left (~44px) and running to ~980px wide; the top header bar spans the full 1024px width.

- **Header bar** (full width, white, thin bottom hairline): teal rounded-square logo mark with a white "S" (left, ~44px from edge); on the right a circular teal-outlined icon button with a bell icon and a small red dot badge at its top-right, then a pill-shaped account control containing a photo avatar and a chevron-down icon.
- **Page heading**: "Welcome back, Sarah" — teal (`--sl-color-foreground-primary-bold`), Heading/xl (32/40, semiBold).
- **Page subtext**: "Select a group to view materials, follow your progress, and join today's lessons" — grey, Body/lg/regular (16/24).
- **Section label**: small red round dot + "Live now" — teal, Heading/lg (24/32, semiBold).
- **Live-lesson card**: white, 1px teal border (`--sl-color-border-primary-bold`), radius xl (12), padding ~20px. Inside, a row:
  - left: a photo thumbnail (~103x103, radius default) — a red London telephone box;
  - middle: "Class H4A" teal Heading/lg-ish semiBold, "English" grey Body/md/regular below it, then an overlapping stack of 3 small round avatars followed by "7 students already joined" (grey, Body/md);
  - right: a vertical stack of three pill buttons, right-aligned, all the same width (~166px): solid teal "Join live lesson" (primary), light grey "Use lesson code" (default), and text-only "Open e-book" (ghost).
- **Section label**: "My groups" — teal, Heading/lg (24/32, semiBold).
- **My groups grid**: 2 columns, ~16px gap, 5 visible cards (6th Figma card is `hidden=true` — do not render). Each card: white, 1px light-grey border (`--sl-color-border-plain`), radius default, and a row of a ~~64x~~86 book-cover thumbnail flush to the card's left/top/bottom edges, then a text block with the class name (dark, Body/md/bold) and the subtitle below it (grey, Body/md/regular).
  Row-major order:
  1. "Class H5A" / "Biologie voor jou - havo 5" (334:20678)
  2. "Class V5B" / "Biologie voor jou - vwo 5" (334:20679)
  3. "Class V6C" / "Biologie voor jou - vwo 6" (334:20680)
  4. "Class V4A" / "Biologie voor jou - vwo 4" (334:20681)
  5. "Class H4A" / "Biologie voor jou - havo 4" (334:20682)
     The fifth card sits alone in the left column of the third row.

**Images**: every `<img>` in this design (the lesson photo, the five book covers, the header account avatar, the three stacked student avatars, the logo) has no exported asset. The pipeline has no asset-export step, so these are expected to 404 at render time. That is a recorded Stage 4 discrepancy — do NOT substitute placeholder images to make the layout look right.

---

# Decomposition (Stage 2)

## Component Tree

```
<sl-group-list-page>                         examples/lit/src/_runs/a8-nsp-group-list/group-list-page.{ts,css,stories.ts}
│  ROOT — the ONLY globally defined element; owns all data; ScopedElementsMixin host
│  composes existing: <sl-card>, <sl-badge>
├── <sl-group-list-app-bar>                  .../a8-nsp-group-list/group-list-app-bar/group-list-app-bar.{ts,css}
│      composes existing: <sl-button>, <sl-icon>, <sl-badge>, <sl-avatar>
└── <sl-group-list-live-lesson>              .../a8-nsp-group-list/group-list-live-lesson/group-list-live-lesson.{ts,css}
       composes existing: <sl-avatar>, <sl-button>
```

Deliberately NOT separate components: the 5 "My groups" cards (a mapped `<ul>` of `<sl-card>` in the root),
the avatar cluster (a `<ul>` of `<sl-avatar>` inside the live-lesson), the greeting block and the two section labels.

## Shared Types / Contracts

```ts
// exported by group-list-app-bar.ts
export interface AccountModel {
  displayName: string;
  pictureUrl?: string;
  initials?: string;
}
export interface AppBarModel {
  account: AccountModel;
  unreadNotificationCount: number;
}
export type SlGroupListNotificationsClickEvent = CustomEvent<void>;
export type SlGroupListAccountClickEvent = CustomEvent<void>;

// exported by group-list-live-lesson.ts
export interface JoinedStudent {
  id: string;
  displayName: string;
  initials?: string;
  pictureUrl?: string;
}
export interface LiveLessonModel {
  id: string;
  groupName: string;
  subject: string;
  imageUrl: string;
  imageAlt: string;
  joinedStudents: JoinedStudent[]; // length 7; component caps display at 3
}
export type SlLiveLessonJoinEvent = CustomEvent<{ lessonId: string }>;
export type SlLiveLessonUseCodeEvent = CustomEvent<{ lessonId: string }>;
export type SlLiveLessonOpenEbookEvent = CustomEvent<{ lessonId: string }>;

// exported by group-list-page.ts
export interface GroupSummary {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  coverAlt: string;
  href: string;
}
export interface GroupListPageData {
  firstName: string; // 'Sarah'
  appBar: AppBarModel;
  liveLesson: LiveLessonModel | null;
  groups: GroupSummary[];
}
```

## Per-component specs — see the Stage 2 agent output, condensed

### `<sl-group-list-page>` (root)

Holds a realistic mock `GroupListPageData` as a class field with a comment marking where `GET /api/me/dashboard` would go.
Public API: one property `data: GroupListPageData` (defaults to the mock). No slots, no emitted events; listens to both children's events.
`static scopedElements = { 'sl-group-list-app-bar', 'sl-group-list-live-lesson', 'sl-card', 'sl-badge' }`.
Renders: app bar → `<h1>Welcome back, Sarah</h1>` → subtext → red dot badge + `<h2>Live now</h2>` → live-lesson child →
`<h2>My groups</h2>` → 2-column `<ul>` grid of 5 `<sl-card>`.
No `<main>` / `role="main"`. Sections are `<section aria-labelledby>`. Dot badge `aria-hidden="true"`.

### `<sl-group-list-app-bar>`

Presentational. One property `model: AppBarModel`. Emits `sl-group-list-notifications-click` and
`sl-group-list-account-click` via the `@event` decorator + `EventEmitter` from `@sl-design-system/shared`.
`Icon.register(faBell, faChevronDown)` at module load. Shadow wrapper is a neutral `<div>` (no `banner` landmark).

### `<sl-group-list-live-lesson>`

Presentational. One property `model: LiveLessonModel`. Emits `sl-live-lesson-join`, `sl-live-lesson-use-code`,
`sl-live-lesson-open-ebook`, each `CustomEvent<{ lessonId: string }>`.
Structural constants inside the component: the three action labels/variants, `MAX_VISIBLE_AVATARS = 3`,
and the "N students already joined" phrasing. Host wrapper `<article aria-labelledby>` on the `<h3>`.
The CC snippet's `display-name="7 students already joined"` on 334:20593 is Figma's label leaking into the
instance — do NOT reproduce it; each `<sl-avatar>` gets its own student's display name.

## Open questions and the DEFAULT the orchestrator chose

| #   | Question                                                                                  | Default chosen                                                                                                                                                                                                                     |
| --- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Group card subtitles: manifest list ("vwo 5") vs screenshot ("Biologie voor jou - vwo 5") | **Screenshot wins** — it is ground truth. All five read "Biologie voor jou - <level>".                                                                                                                                             |
| 2   | "Live now" dot colour: prose says teal, CC snippet + screenshot say red                   | **Red** (`color="red" emphasis="bold" size="sm"`).                                                                                                                                                                                 |
| 3   | Image assets unsourced (lesson photo, 5 book covers)                                      | **Reference `/assets/...` paths and let them 404.** No placeholders — recorded as a Stage 4 discrepancy per the batch runbook.                                                                                                     |
| 4   | Logo mark asset                                                                           | **Inline markup** — a teal rounded square with a white "S" glyph, built from tokens. No external asset.                                                                                                                            |
| 5   | Account avatar image                                                                      | **`<sl-avatar>` with a `pictureUrl` that 404s plus an `initials` fallback.**                                                                                                                                                       |
| 6   | Is the app bar in scope?                                                                  | **Yes, include it** — the Figma frame contains it and the story must match the frame.                                                                                                                                              |
| 7   | "My groups" as its own component?                                                         | **No** — inline in the root.                                                                                                                                                                                                       |
| 8   | Avatar cluster as its own component?                                                      | **No** — inline in the live-lesson. A real `sl-avatar-stack` belongs in a DS package, not an example run.                                                                                                                          |
| 9   | Live-lesson card as `<sl-card>`?                                                          | **No, custom markup.** The manifest does not map 334:20584/20585 to `sl-card`, and `sl-card` renders `actions` at the bottom while this design stacks them on the right.                                                           |
| 10  | `joinedStudents[]` (7) vs a separate `joinedCount`                                        | **Array only**; the count is `joinedStudents.length`.                                                                                                                                                                              |
| 11  | 3-avatar cap: constant or property?                                                       | **Constant** `MAX_VISIBLE_AVATARS = 3` (structural config lives in the component).                                                                                                                                                 |
| 12  | Three actions fixed or data-driven?                                                       | **Fixed in the component**, three distinct events. Data-driven would push UI copy into the model.                                                                                                                                  |
| 13  | Group card activation: `href` or event?                                                   | **Real `<a href="/groups/<id>">`** (also required for `sl-card` click delegation).                                                                                                                                                 |
| 14  | Keep the speculative `logo` / `actions` slots?                                            | **Drop both** — no evidence in the design; tighter API.                                                                                                                                                                            |
| 15  | Card title heading semantics vs `sl-card` click delegation                                | **Direct `<a role="heading" aria-level="3">`** in the default slot. `Card#setTitle` only inspects _direct_ assigned elements, so `<h3><a>` silently disables whole-card click — recorded as an `sl-card` limitation finding.       |
| 16  | `sl-card` slot for the subtitle: `header` or `body`?                                      | **`body`** — matches the screenshot's title→subtitle gap.                                                                                                                                                                          |
| 17  | App bar landmark                                                                          | **Neutral `<div>`** — `banner` is a page-level singleton the host owns.                                                                                                                                                            |
| 18  | Avatar cluster: decorative or named list?                                                 | **`aria-hidden="true"`**; "7 students already joined" carries the meaning (3 of 7 names would imply a full roster).                                                                                                                |
| 19  | Bell accessible name                                                                      | **"Notifications, unread"** when `unreadNotificationCount > 0`, else **"Notifications"**. No live region.                                                                                                                          |
| 20  | Account control: real `sl-menu` or event-only?                                            | **Event-only button** — this is a fidelity run, not a behaviour run.                                                                                                                                                               |
| 21  | Heading levels                                                                            | **`h1` for the greeting**, `h2` sections, `h3` card/lesson titles.                                                                                                                                                                 |
| 22  | Responsive behaviour                                                                      | **Pin to the 1280px design; no media queries.** Only one breakpoint exists in the design.                                                                                                                                          |
| 23  | Content max-width / inset                                                                 | **Page inline padding `var(--sl-space-700)` (56px)**, content fluid to the remaining width. (Screenshot is a 0.8-scaled 1024px render of the 1280px frame: 44px measured / 0.8 = 55px ≈ 56.)                                       |
| 24  | `--sl-space-new-*` vs `--sl-space-*`                                                      | **Prefer `--sl-space-new-*`** where `get_variable_defs` shows the design binds `space-new/*`; fall back to `--sl-space-*` for values the `new` family has no entry for (notably 40px → `--sl-space-500`, 56px → `--sl-space-700`). |
| 25  | Border radii                                                                              | **Live-lesson card `--sl-size-borderRadius-xl` (12); group cards `--sl-size-borderRadius-default` (4).** Stage 4 may correct.                                                                                                      |
| 26  | Bell outline colour                                                                       | **Use `<sl-button fill="outline" shape="pill">` and do not override the border colour** unless Stage 4 shows a mismatch.                                                                                                           |
| 27  | App bar bottom divider                                                                    | **No divider** — the screenshot shows none under the header.                                                                                                                                                                       |
| 28  | Folder-name redundancy (`a8-nsp-group-list/group-list-app-bar/`)                          | **Keep the convention** (folder == tag minus `sl-`).                                                                                                                                                                               |
| 29  | Per-child stories?                                                                        | **Root story only.** Stage 4 validates the page; Stage 5 may enrich.                                                                                                                                                               |
| 30  | Net-new primitives `_None._`                                                              | **Confirmed** — every node resolved to an existing SLDS component or a brand asset.                                                                                                                                                |
