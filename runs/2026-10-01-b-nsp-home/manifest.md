# Design Manifest — NS-fundaments / home

## Overview

Figma file **NS-fundaments** (team NSP), top-level node **`home`** (node ID `2095:44291`), frame size **1280 × 877 px**. The design is a teacher-facing dashboard/home screen: a top navigation bar, a "Classes" panel showing a grid of five class cards (media thumbnail, title, student-count badge, and a "no method added" status row), and a "Task list" panel with three blueprint placeholder blocks.

## Existing SLDS Components Used

| Node ID                                                          | Node Name               | Mapped Component                               | CC Snippet (excerpt)                                                                                                                                                                                                                                                                                                                       |
| ---------------------------------------------------------------- | ----------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2095:44300                                                       | sl-button-rectangular   | `<sl-button fill="outline" variant="primary">` | `<sl-button fill="outline" variant="primary"><sl-icon name="far-plus"></sl-icon>Create class</sl-button>`                                                                                                                                                                                                                                  |
| 2095:44448, 2095:44460, 2095:44472, 2095:44535, 2095:44557       | card-slot-header-badges | `<sl-badge>`                                   | (identified) — CC lookup on the wrapper timed out twice, but each wrapper's sole child is named `sl-badge` (`I<id>;5100:36510`, e.g. `I2095:44448;5100:36510`), containing an `sl-icon` ("users") + count text, matching the documented `sl-badge` component ("A badge is a non-interactive visual indicator used to communicate status.") |
| 2095:44451, 2095:44463 (card content rows)                       | sl-icon                 | `<sl-icon>`                                    | (identified) — node name is `sl-icon`; CC lookup timed out on this node and its peer, but the same instance also appears inside `sl-badge` and inside `Navigation`/`SlSearchField` where the Figma component description block confirms `sl-icon` (node 2003:3302 / 2034:4975) is a real, documented SLDS component                        |
| Nested in `Navigation` (2095:44292): `I2095:44292;2071:593` area | sl-search-field         | `<sl-search-field>`                            | (identified) — rendered as a distinct `SlSearchField` sub-component in design context, matching the documented `sl-search-field` component (node 2034:7194, doc: sanomalearning.design/.../search-field/)                                                                                                                                  |
| Nested in `Navigation`: `I2095:44292;2071:597;10:2841`           | sl-avatar               | `<sl-avatar>`                                  | (identified) — node name `sl-avatar`, matching documented component (node 2034:2165)                                                                                                                                                                                                                                                       |
| Nested in `Navigation`: `I2095:44292;2071:597;10:3939`           | sl-icon (chevron-down)  | `<sl-icon name="chevron-down">`                | (identified) — node name `sl-icon`                                                                                                                                                                                                                                                                                                         |

Notes on Code Connect: repeated full-subtree `get_code_connect_map` calls (top node `2095:44291`, and the `cards` subtree `2095:44296`) timed out consistently even after retries; per-node queries succeeded for simple single instances (`sl-button-rectangular`) but consistently timed out for `sl-icon` and `card-slot-header-badges` nodes specifically (tested on two peer instances each, still timed out). None of these are genuinely unidentifiable — all were resolved via the node-naming/child-naming heuristic (hint 1), confirmed further by the descriptions payload from `get_design_context`, which independently lists documented usage guidance for `sl-icon`, `sl-badge`, `sl-avatar`, `sl-search-field`, and `sl-button-rectangular` as real components in this design's library. No `BLOCKED_ON_CODE_CONNECT` was warranted.

## Composition Candidates

- **Top navigation bar** — node `2095:44292` (`Navigation`) and its descendants (Logo image, 4× `Link-nav` text links — "Home" [active/underlined], "Calendar", "Method catalogue", "Teaching materials" — `sl-search-field`, and a "profile" cluster of `sl-avatar` + `sl-icon` chevron-down). The wrapper instance itself returned a genuine (non-timeout) `null` Code Connect mapping, and no matching single nav-bar/topbar/app-shell component exists in `packages/components`. It visually and functionally reads as one persistent app-shell unit and should be composed from the identified primitives (`sl-search-field`, `sl-avatar`, `sl-icon`) plus plain nav-link markup, rather than treated as a single existing component.
- **Class card** — each of the five repeated card frames (`2095:44443` "5B English", `2095:44455` "5A English", `2095:44467` "5C English", `2095:44530` "6A English", `2095:44552` "6B English") consisting of: a `media/Responsive` image slot, a title, an `sl-badge` (student count), and (on the first two cards only) an icon + "No method added" status row. These are plain frames in Figma (not instances of a shared card component), and there is an existing `card` component in the codebase (`packages/components/card`) — this group is a strong candidate for a new composed "class card" built from `sl-card` (or an equivalent container) + `sl-badge` + `sl-icon`.
- **Task-list placeholder block** — node `2095:44306` ("Task list" heading + 3× `Content-block` instance). `Content-block` (`2095:40608`) is explicitly documented in Figma as "a blueprint — please detach it before using in any mockups" (keywords: Card, section), meaning it is scaffolding, not a shippable component — the implementer should build a plain styled container matching its visual spec (white bg, 1px grey-400 border, 8px radius, 20px padding) with a dashed-border "Placeholder" slot, not import an SLDS component instance for it.

## Net-New Primitive Candidates

- **`media/Responsive`** (nodes `2095:44444`, `2095:44456`, `2095:44468`, `2095:44531`, `2095:44553`) — a plain `<img class="object-cover">` fill/fit wrapper with no CC mapping (genuine `null`, not a timeout) and no `sl-*` naming on itself or its single `image` child. No equivalent `image`/`media` component exists in `packages/components`. Rough shape: image/media placeholder, fixed 224×101px in a card's media slot, object-fit: cover.

## Responsive Breakpoints

_Single breakpoint: 1280px._ Only one frame/size was present in the surveyed node; no alternate-width frames or layout-grid breakpoint annotations were found in the metadata.

## Designer Annotations

- Node `2095:40608` (`Content-block`): "Usage — This is a blueprint — please detach it before using in any mockups. Keywords — Card, section." (doc: https://styleguide.itsbuild.net/docs/styles/blocks/#content-block)
- Node `2045:9049` (`sl-button-rectangular`): "A button initiates an action when clicked, like redirecting to a new page or submitting a form. It's a key element for interaction and action. INVERTED BUTTONS are only to be used with `elevation.surface.raised.inverted` and `elevation.surface.raised.primary`."
- Node `2074:13006` (`sl-badge`): "A badge is a non-interactive visual indicator used to communicate status."
- Node `2034:7194` (`sl-search-field`): "A search field lets users specify a word or phrase to filter relevant content within a specific page section. For example, filter the content in a data grid or a list of content."
- Node `2034:2165` (`sl-avatar`): "An avatar is a visual representation of an entity, such as a user or an organization."
- Node `2003:3302` / `2034:4975` (`sl-icon`): "Icons communicate messages, enhance interactivity, and highlight critical information. Use them as visual representations of concepts, objects, or actions efficiently."
- Node `2034:6902` (`Type=Simple`) and `2034:5921` (`Icon only=false, Size=MD`): "Use for borders that highlight secondary actions."
- Node `2034:7164` (`Variant=Default, State=Idle`): "Use for borders of form UI elements, such as text fields, checkboxes and, radio buttons."
- Node `2074:13052` (`accent=yellow, emphasis=subtle, size=lg`): "A vibrant blue background option, applied purely for stylistic purposes without specific meaning." (description text as authored, despite the yellow-accent badge variant it's attached to)
- Node `2074:12694` (`Variant=text & icon`): "Use for headers and labels."

## Token Reference

All variables below come from `get_variable_defs` and were verified (by grepping `packages/themes/sanoma-pro/theme.css`) to have an exact, pre-existing `--sl-*` token via the `/` → `-` naming convention — none required flagging as unbound.

**Color:**

- `--sl-color-foreground-primary-onBold` (`#ffffff`)
- `--sl-color-background-primary-bold` (`#3366ff`)
- `--sl-color-palette-grey-800` (`#25292f`)
- `--sl-color-transparent`
- `--sl-color-foreground-plain` (`#25292f`)
- `--sl-color-foreground-subtlest` (`#59636e`)
- `--sl-color-background-input-interactive` (`#c8d1da`)
- `--sl-color-background-input-plain` (`#ffffff`)
- `--sl-color-border-input` (`#818b98`)
- `--sl-color-foreground-secondary-bold` (`#222222`)
- `--sl-color-background-neutral-bold` (`#e0e6ea`)
- `--sl-color-background-disabled` (`#f0f2f5`)
- `--sl-color-black` (`#000000`)
- `--sl-color-foreground-primary-bold` (`#1727b6`)
- `--sl-color-border-primary-bold` (`#1727b6`)
- `--sl-color-foreground-bold` (`#222222`)
- `--sl-color-foreground-accent-yellow-bold` (`#7c3a0b`)
- `--sl-color-background-accent-yellow-subtle` (`#ffae0033`)
- `--sl-color-foreground-info-bold` (`#1727b6`)
- `--sl-color-palette-grey-400` (`#c8d1da`)
- `--sl-color-palette-grey-100` (`#f0f2f5`)

**Size / Spacing:**

- `--sl-size-borderRadius-lg` (`8`)
- `--sl-size-borderRadius-default` (`4`)
- `--sl-size-borderRadius-md` (`4`)
- `--sl-size-borderRadius-full` (`800`)
- `--sl-size-borderWidth-none` (`0`)
- `--sl-size-borderWidth-action` (`1`)
- `--sl-size-borderWidth-default` (`1`)
- `--sl-space-new-sm` (`6`)
- `--sl-size-icon-font-xs` (`12`)
- `--sl-space-100` (`8`)
- `--sl-space-150` (`12`)
- `--sl-space-075` (`6`)
- `--sl-space-new-xs` (`4`)
- `--sl-space-new-md` (`8`)
- `--sl-space-new-2xs` (`2`)
- `--sl-space-200` (`16`)
- `--sl-space-050` (`4`)
- `--sl-space-025` (`2`)
- `--sl-size-icon-font-md` (`16`)
- `--sl-size-icon-font-lg` (`20`)
- `--sl-size-icon-font-2xl` (`32`)
- `--sl-size-icon-font-3xl` (`48`)
- `--sl-size-200` (`16`) / `--sl-size-150` (`12`) / `--sl-size-300` (`24`)
- `--sl-size-500` (`20`) — used as `Size/500` for the Content-block gap

**Typography:**

- `--sl-size-text-new-body-md` (`14`)
- `--sl-text-new-typeset-fontFamily-body` (`Roboto` in Figma source; resolved via theme to `'Open Sans'`)
- `--sl-size-lineHeight-250` (`20`)
- `--sl-text-new-typeset-fontWeight-regular` (`400`)
- `--sl-text-new-typeset-fontWeight-semiBold` (`500`)
- `--sl-size-text-new-heading-lg` (`24`)
- `--sl-text-new-typeset-fontFamily-heading` (`Roboto` → `'New Message'` via theme)
- `--sl-size-lineHeight-400` (`32`)
- `--sl-size-text-new-heading-md` (`16`)
- `--sl-size-text-new-body-sm` (`12`)
- `--sl-size-lineHeight-200` (`16`)
- `--sl-text-new-typeset-fontFamily-icon` (`Font Awesome 7 Pro`)
- `--sl-icon-typeset-fontWeight-icon-regular`, `--sl-icon-typeset-fontWeight-solid`
- `--sl-size-font-175` (`14`) — size/font/175, the yellow badge's count text

**Other:**

- `--sl-opacity-interactive-plain-idle` (`0`)
- `$text` (`#333333`) and `$card-background` (`#ffffff`) — local, component-scoped Figma variables defined only inside the `Content-block` blueprint node (2095:40608), not global design tokens. No exact `--sl-*` match exists for `#333333` (checked, not found in `packages/themes/sanoma-pro/` or `packages/themes/core/`) — but since this node is explicitly documented as a to-be-detached blueprint, the implementer should replace these with a real token (e.g. `--sl-color-foreground-plain` / a surface-background token) rather than hardcode, not add a new one.

---

# Decomposition (Stage 2)

Four new components, all under `examples/lit/src/_runs/b-nsp-home/`:

```
sl-nsp-home-page            (root, owns all data)      ./home-page.ts
  ├── sl-nsp-top-nav        (presentational)            ./top-nav/top-nav.ts
  ├── sl-nsp-class-card ×5  (presentational)            ./class-card/class-card.ts
  └── sl-nsp-placeholder-block ×3 (slot-only)           ./placeholder-block/placeholder-block.ts
shared demo data                                        ./demo-data.ts
shared icon registration                                ./icons.ts
```

Tag prefix is `sl-nsp-*` to avoid custom-element registry collisions with published SLDS
elements and with the other 17 runs sharing one Storybook harness.

## Shared Types / Contracts

- `ClassCardModel { id: string; name: string; studentCount: number; hasMethod: boolean; thumbnailUrl?: string }` — exported by `class-card`, consumed by `home-page`.
- `NavLinkId = 'home' | 'calendar' | 'method-catalogue' | 'teaching-materials'` — exported by `top-nav`.
- `NavUser { name: string; avatarUrl?: string }` — exported by `top-nav`.
- `TopNavModel { user: NavUser; activeLinkId: NavLinkId; searchTerm?: string }` — exported by `top-nav`, consumed by `home-page`.
- `NavNavigateDetail { id: NavLinkId; href: string }` — exported by `top-nav`.
- Events: `sl-nsp-nav-navigate`, `sl-nsp-nav-search`, `sl-nsp-profile-toggle` (top-nav); `sl-nsp-create-class` (home-page).

## Open questions and the default chosen (32)

Tree shape:

1. class-card as component vs styled `<li>` → **component** (conditional internals, media slot, ×5).
2. placeholder-block as component vs styled `<li>` → **component** (future injection seam, earns a slot).
3. Split the two columns into panel components → **no**; two `<section>`s in the root.
4. Is a class card interactive? → **non-interactive**; design shows no link/hover/focus state.
5. Nav links anchors or buttons? → **real `<a href>`** + `sl-nsp-nav-navigate` event so a host router can preventDefault.
6. Top nav inside page or host shell? → **inside the page**, so the story renders the whole design with no args.

Model fields: 7. `hasMethod: boolean` vs a key union → **boolean**; the design has exactly two visual states. 8. Meaning of the absent status row on 5C/6A/6B → **`hasMethod: true`**, assumption noted in the story. 9. Keep optional `thumbnailUrl`? → **yes, optional**; undefined for all five design records. 10. Pluralisation of the student count → **conditional `1 student` / `n students`** in render (i18n off, no ICU).

Tokens: 11. White surfaces had no surface token in the variable dump → **OVERRIDE of the decomposer's recommendation.** `--sl-elevation-surface-raised-default` exists in `packages/themes/sanoma-pro/theme.css` and resolves to `#ffffff` (via `--sl-brand-light-elevation-surface-raised-default` → `--sl-brand-light-color-palette-grey-000`). Use it for the nav bar, cards and placeholder blocks — NOT `--sl-color-background-input-plain`, which is semantically an input background. `get_variable_defs` never surfaced this token. 12. 48px gutters / 32px column gap / 56px nav height have no token → **compose from `--sl-space-200` (16) with `calc()`**; nav height 56px hardcoded with a comment. 13. Active nav underline reads ~2px, border-width tokens are all 1 → **`--sl-space-new-2xs` (2) used as a length**. 14. `--sl-size-500` (20) reused for the card-grid gutter → **yes**, exact value, note the reuse in a comment. 15. grey-400 vs background-input-interactive for borders (both `#c8d1da`) → **`--sl-color-palette-grey-400`**; these are surface borders, not input borders. 16. Section heading colour plain (`#25292f`) vs bold (`#222222`) → **plain for section headings, bold for card titles**. 17. Media placeholder grey → **use `--sl-color-background-neutral-bold`** rather than pixel-matching the screenshot.

Net-new primitive: 18. Create a `media/Responsive` primitive? → **NO.** ~10 lines of CSS inside class-card behind a `media` slot; one screen is not enough evidence to promote a generic `<sl-media>`.

Existing-component APIs (verified against source by the orchestrator, not guessed): 19. `<sl-avatar>` user shape → it has **no exported user type**; the props are `display-name`, `picture-url`, `image-only`, `size`. Keep the local `NavUser` and map at the call site. 20. `<sl-badge>` variant attributes → verified in `packages/components/badge/src/badge.ts`: the property is **`color`**, not `accent`. Use `<sl-badge color="yellow" emphasis="subtle" size="lg">`. (`BadgeColor` includes `yellow`; `BadgeEmphasis` = subtle|bold; `BadgeSize` = sm|md|lg.) 21. Icon names → **OVERRIDE.** `@fortawesome/*` is **not installed** in this checkout, so `Icon.register(faPlus)` cannot resolve and would break the build. Register an inline `IconLibrary` instead via the documented `Icon.register(icons: IconLibrary)` overload. Needed glyphs: `far-plus`, `far-users`, `far-circle-info`, `far-image`. `chevron-down` is already registered by the sanoma-pro theme. 22. Compose `<sl-card>`? → **no**; bespoke 224px media/title/badge layout, fighting `sl-card`'s padding/slots costs more than it saves.

Behaviour not shown in the design: 23. Search field behaviour → **emit `sl-nsp-nav-search` on input; the page does nothing with it.** 24. Profile pill a real menu trigger? → **keep `aria-haspopup="menu"` + emit `sl-nsp-profile-toggle`**, no menu implemented. 25. Empty state for zero classes → **not invented**; heading + button + empty `<ul>`. 26. Responsive behaviour below 1280 → **`repeat(auto-fill, 224px)`**; reproduces 3-across at the documented width without inventing a breakpoint.

Structure and conventions: 27. Tag prefix → **`sl-nsp-*`** (registry-collision safety across the shared harness). 28. Where demo data lives → **shared `./demo-data.ts`** exporting `DEFAULT_CLASSES` and `DEFAULT_NAV`. 29. Should the page fetch? → **no network**; initialise from demo constants, document the intended endpoint in a comment. 30. Heading levels → **`<h2>`** for `Classes`/`Task list`, `<h3>` for card titles; host supplies the `<h1>`. 31. Nav landmark → **`<nav aria-label="Main">`**, not `<header>`/`role="banner"`. 32. `task-list` slot on the page → **yes**, with the three placeholder blocks as fallback content.
