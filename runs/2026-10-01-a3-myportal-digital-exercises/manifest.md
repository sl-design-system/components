# Design Manifest — A3: MyPortal Digital Exercises

## Overview

Figma file **"MyPortal Designs 2025"** (team: MyPortal), top-level node **"Chapter / Digital Exercises / Exercises"** (`25124:56828`), frame size **1440 × 1024px** (declared) — the cached screenshot rendered at exactly 1440×1024px with no canvas bleed. The design is a learning-platform "digital exercises" screen for a school chapter: a top app chrome (brand selector, school selector, user avatar, quick actions), a left primary-navigation sidebar, a breadcrumb, a book/chapter header card with authorship avatars, a left accordion tree of chapters/lesson-types (Materials, Tests, Chapter 1–10, with "Chapter 2" expanded to show Lessons/Digital Exercises/Print Exercises/Tests), and a main panel listing the chapter's digital exercises as a vertical stack of "Exercise block" rows (title, type, time, exercise count, view/add actions) with an "Exercises level" filter select above it.

**Scale note (rule 4):** the raw metadata reports **2,147 nodes across 75 distinct component types**, but a developer building this screen would place roughly **11 distinct reusable components/composites** (see Component Inventory below) — the overwhelming majority of the 2,147 nodes are repeated structural sublayers (10 near-identical chapter accordion rows, 4 near-identical exercise-block rows, and a 4×3 grid of purely-structural "Aspect Ratio Lock" crop-guide sublayers inside the single book-cover image) rather than distinct things to implement.

## Existing SLDS Components Used

**Code Connect outcome (as-is mode):** this file is not drawn against the published SLDS Code Connect library (it's a MyPortal/Bingel product design), so `get_code_connect_map` returned `{}` for every node probed (top-level frame + 13 individual component instances, including one retry each on two nodes that reported a timeout). This is the expected, non-blocking outcome for this batch — see `figma-code-connect-map.json` for the full probe log.

**One exception was found via `get_design_context` rather than the map tool**: node `25124:57006` / `25124:57135` ("sl-select (simple-prototype)") resolved to a real `CodeConnectSnippet` even though the direct `get_code_connect_map` probe on the same node timed out and returned `{}` both times. This is recorded as CONNECTED below; all other rows are **identified by Figma instance-naming convention only** (the `sl-*` / theme-suffixed layer names), not by a verified Code Connect snippet — flagged accordingly.

| Node ID                                               | Node Name                             | Mapped Component                                     | CC Snippet (excerpt)                                                                                                                                       |
| ----------------------------------------------------- | ------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 25124:57006, 25124:57135                              | sl-select (simple-prototype)          | `<sl-form-field label="Exercises level"><sl-select>` | `<sl-form-field label="Exercises level"><sl-select placeholder="Placeholder" value="Show all"><sl-option>label</sl-option>...</sl-select></sl-form-field>` |
| 25124:56831                                           | sl-breadcrumb                         | `<sl-breadcrumb>`                                    | (identified by name only — no CC snippet; descr.: "Breadcrumbs are a navigation element used to show a user's location.")                                  |
| 25124:56836                                           | SL-card                               | `<sl-card>`                                          | (identified by name only — book-cover media card, no CC snippet)                                                                                           |
| 25124:56847, 25124:56848                              | sl-button / sl-button-theme           | `<sl-button>`                                        | (identified by name only; descr.: "A button initiates an action... " — doc: sanomalearning.design/.../button/usage/)                                       |
| 25124:56852, 56855–56864, 57151                       | sl-avatar                             | `<sl-avatar>`                                        | (identified by name only; descr. notes "A subheader on a small horizontal avatar is not allowed and is turned off by default.")                            |
| 25124:56872                                           | sl-searchfield                        | `<sl-searchfield>`                                   | (identified by name only; descr. + doc link: sanomalearning.design/.../search-field/usage/)                                                                |
| 25124:56880, 56887, 56894, 56901, etc.                | sl-icon                               | `<sl-icon>`                                          | (identified by name only; doc link: sanomalearning.design/.../icon/usage/)                                                                                 |
| 25124:56912, 56924, 56932, 56939, I...57050           | badge / sl-badge [DRAFT]              | `<sl-badge>`                                         | (identified by name only — note the "[DRAFT]" suffix on several wrapper layers, flagging in-progress design)                                               |
| 25124:57023, 57054, 57084, 57114 (eye icon)           | sl-button-theme (icon-only, pill)     | `<sl-button icon-only>`                              | (identified by name only — circular/pill icon buttons)                                                                                                     |
| 8300:30422 / 12220:175344 (via Component22/AddButton) | sl-button-theme (icon-only, pill)     | `<sl-button icon-only>`                              | (identified by name only — "check"/"plus" circular add-toggle buttons)                                                                                     |
| 25124:57146, 57148                                    | sl-selectbox-theme                    | `<sl-select>` (simple)                               | (identified by name only; descr.: "Only edit the properties below... colors are fixed, adjust width to fit your design.")                                  |
| 25124:57176–57182                                     | main nav icon                         | `<sl-nav-item>` or similar                           | (identified by name only — sidebar primary nav items: Home/Planner/Class/Tasks/Evaluation/Analytics/Administration)                                        |
| 25124:57157, 57161, 57165, 57169                      | main nav icon (quick actions variant) | `<sl-button icon-only>` or nav-item variant          | (identified by name only — top-bar "New task / Give Feedback / New care note / View island")                                                               |

## Composition Candidates

- **Exercise block (list row)** — node IDs `25124:57013, 57043, 57074, 57104` (4 repeated instances). Rationale: each is a self-contained cluster of (badge-optional title metadata + name) + (eye button + add/added toggle button) + divider + (Type / Time / Exercises metadata row); repeats per row in a vertical list and should become a single new composite component (e.g. `sl-exercise-list-item`) wrapping existing `sl-badge`, `sl-icon`, and `sl-button` (icon-only) primitives.
- **Chapter accordion item** — node IDs `25124:56878, 56885, 56892, 56899 (expanded), 56940, 56947, 56954, 56961, 56968, 56975, 56982, 56989` (12 repeated instances, one expanded). Rationale: each row is (icon + title + chevron), and the expanded one additionally nests 4 "sub-item" rows (Lessons/Digital Exercises/Print Exercises/Tests) each with a count badge; this repeating accordion-row pattern should become a composite (e.g. `sl-nav-accordion-item`) wrapping `sl-icon` + `sl-badge`.
- **Card header (book + title + authorship)** — node IDs `25124:56833` through `56864`. Rationale: the book cover card, title/publisher block, action buttons, and three avatar/avatar-group clusters (owner, co-authors, "with own copy") visually form one unbroken header unit at the top of the content area and repeat this shape wherever a chapter/book is shown; candidate for an `sl-content-header` composite wrapping `sl-card`, `sl-button`, and `sl-avatar` (including an avatar-group variant).
- **Top app chrome row** — node IDs `25124:57138` through `57172`. Rationale: brand/class selector + school selector + user avatar + quick-action icon row form the persistent top bar unit, repeating structurally across all MyPortal screens (only content, not structure, changes per screen).

## Net-New Primitive Candidates

- **Avatar-group / stacked-avatars cluster** (node IDs `25124:56853–56864`, and again `25124:56854–56863` nested) — a horizontal row of `sl-avatar` circles rendered with `mr-[-12px]` overlap plus a trailing "+2" overflow avatar and a two-line name/role text block to the right. If SLDS does not already ship a dedicated `sl-avatar-group` component (only single `sl-avatar` was identified above), this overlap-and-overflow-count behavior has no 1:1 existing-primitive match and is a genuine candidate for a new `sl-avatar-group` primitive. Rough shape: indicator/cluster, not a button or input.
- **Badge-with-icon variant ("MAX" badge)** — node ID `25124:57050` and its descendants (`I25124:57050;931:392128;7294:4490` etc.), a pill badge combining a small star `sl-icon` (10px) + uppercase "MAX" label on a `#e0eaff` background with `#2351db` text — visually and chromatically distinct from the plain count-only badges used elsewhere (grey `#e3e6ea`/`#acd2f5` backgrounds, no icon). Flag as a possible icon+label badge variant if the existing `sl-badge` does not support an inline icon slot. Rough shape: indicator.
- **Chevron-rotation expand/collapse affordance** — node `25124:56904` (`rotate-180` wrapper around a plain `chevron-down` Font Awesome glyph used as the accordion's open/close indicator, no icon button wrapper). This is a bare rotated icon glyph, not wrapped in any button/icon component instance — likely fine to implement with an existing `sl-icon` plus a CSS rotation state, but flagged since it appears as a standalone glyph rather than a known component instance.

## Responsive Breakpoints

_Single breakpoint: 1440px._ Only one frame/artboard exists at this node; no alternate-width frames or constraint annotations were found in the metadata tree.

## Designer Annotations

No annotation/comment layer was found attached to this frame. However, several component-instance layers carry an informal **"[DRAFT]"** suffix in their own names, which functions as an in-progress/WIP marker worth surfacing to the implementer:

- `25124:56911` "badge-base-theme [DRAFT]" (Lessons count badge)
- `25124:56918`–`56924` "sl-badge [DRAFT]" / "badge-base-theme [DRAFT]" (Digital Exercises count badge, doubly-nested draft wrapper)
- `25124:56931` "badge-base-theme [DRAFT]" (Print Exercises count badge)
- `25124:56938` "badge-base-theme [DRAFT]" (Tests count badge)
- `25124:57050` "sl-badge [DRAFT]" (MAX badge on first exercise-block row)

## Token Reference

Built primarily from `get_variable_defs` (verbatim Figma variable names, quoted) and cross-checked against this repo's actual theme exports in `scripts/themes/export/core-css/` by **resolved value**, not by name-prefix guessing (rule 8). Most values match the **`bingel-dc`** brand theme (`scripts/themes/export/core-css/brand/bingel-dc.css`) — consistent with the Figma variable literally named `bingel_dc_shadow`. A handful of values (the generic/opacity/shadow-overlay/background-input cluster) did **not** match `bingel-dc`'s own shadow-overlay hex and instead match the grey-900 `#222222` pattern seen in the `sanoma-learning` brand file — consistent with the Figma variable literally named `sanoma-learning/opacity/interactive/plain/idle`. Where a confirmed `--sl-*` token exists for the resolved hex, it is given; where no match was found anywhere under `scripts/themes/export/`, it is flagged unbound.

### Color

- `foreground`: `#002649` → confirmed `--sl-brand-light-color-palette-blue-800` (bingel-dc)
- `href/active/foreground`: `#002649` → confirmed `--sl-brand-light-color-palette-blue-800` (bingel-dc)
- `body/foreground`: `#002649` → confirmed `--sl-brand-light-color-palette-blue-800` (bingel-dc)
- `breadcrumb/divider`: `#8D959D` → confirmed `--sl-brand-light-color-palette-grey-500` (bingel-dc); also = `color/border/input` below
- `card/border`: `#C7CDD3` → confirmed `--sl-brand-light-color-palette-grey-200` (bingel-dc); also = `color/background/input/interactive` below
- `color/palette/neutral/700`: `#54585D` → confirmed `--sl-brand-light-color-palette-grey-700` (bingel-dc) — exact numeric-step match
- `color/palette/neutral/600` (used in `input/textField/default/default/placeholder`): `#71777D` → confirmed `--sl-brand-light-color-palette-grey-600` (bingel-dc)
- `color/palette/neutral/50`: `#F2F3F5` → confirmed `--sl-brand-light-color-palette-grey-050` (bingel-dc) — exact numeric-step match
- `button/primary/solid/idle/foreground`, `Flowkit/White`, `color/palette/white/base`, `button/default/solid/idle/background`, `input/textField/default/default/background`, `color/background/input/plain`, `elevation/surface/base/default`: `#FFFFFF` → confirmed `--sl-brand-light-color-palette-grey-000` (bingel-dc); `elevation/surface/base/default` also confirmed as the semantic alias `--sl-brand-light-elevation-surface-base-default`
- `button/default/solid/idle/foreground`: `#002F62` → confirmed `--sl-brand-light-color-palette-blue-700` (bingel-dc)
- `button/default/solid/idle/border`, `color/button/default/solid/idle/border`: `#E3E6EA` → confirmed `--sl-brand-light-color-palette-grey-100` (bingel-dc)
- `color/button/success/link/focus/foreground`: `#235500` → confirmed `--sl-brand-light-color-palette-green-700` (bingel-dc)
- `color/button/warning/solid/idle/background`: `#FF9D00` → confirmed `--sl-brand-light-color-palette-orange-400` (bingel-dc)
- `color/button/default/outline/focus/border`: `#0074DF` → confirmed `--sl-brand-light-color-palette-blue-400` (bingel-dc); same value as `color/background/primary/interactive/plain` below
- `input/fieldLabel/select/group-title/foreground`: `#B8C0C8` → confirmed `--sl-brand-light-color-palette-grey-300` (bingel-dc); same value as `color/foreground/disabled` below
- `color/palette/primary/900`: `#001223` → confirmed `--sl-brand-light-color-palette-blue-900` (bingel-dc)
- `color/palette/primary/500`: `#0060B9` → confirmed `--sl-brand-light-color-palette-blue-500` (bingel-dc) — this is the header bar / primary-nav-highlight blue
- `color/foreground/bold`: `#1b1c1e` → confirmed `--sl-brand-light-color-palette-grey-900` (bingel-dc); core semantic alias `--sl-color-foreground-bold` exists and chains to `--sl-brand-light-color-foreground-bold` → `--sl-brand-light-color-foreground-accent-grey-bold`
- `color/foreground/plain`: `#373a3e` → confirmed `--sl-brand-light-color-palette-grey-800` (bingel-dc); core semantic alias `--sl-color-foreground-plain` exists
- `color/foreground/disabled`: `#b8c0c8` → confirmed `--sl-brand-light-color-palette-grey-300` (bingel-dc); core semantic alias `--sl-color-foreground-disabled` exists
- `color/border/plain`: `#d5d9de` → confirmed `--sl-brand-light-color-palette-grey-150` (bingel-dc); core semantic alias `--sl-color-border-plain` exists
- `color/border/input`: `#8d959d` → confirmed `--sl-brand-light-color-palette-grey-500` (bingel-dc) — same value as `breadcrumb/divider` above
- `color/background/input/interactive`: `#c7cdd3` → confirmed `--sl-brand-light-color-palette-grey-200` (bingel-dc) — same value as `card/border` above
- `color/background/primary/interactive/plain`: `#0074df` → confirmed `--sl-brand-light-color-palette-blue-400` (bingel-dc)
- `color/shadow/overlay1`: `#2222220a`, `color/shadow/overlay2`: `#2222221f` → **(unbound — needs a token)** against `bingel-dc` (its own `--sl-brand-light-color-shadow-overlay1/2` resolve to `#1b1c1e0a` / `#1b1c1e1f`, i.e. grey-900-based on _that_ brand's `#1b1c1e`, not `#222222`); the `#222222`-based grey-900 value instead matches the `sanoma-learning` brand file, consistent with the sibling variable `sanoma-learning/opacity/interactive/plain/idle` — implementer should confirm which brand theme this screen is meant to render under before hardcoding
- `badge` fill colors (not in variable defs, read from `get_design_context` raw values): `#E3E6EA`/`#54585D` text (plain count badge), `#ACD2F5` bg / `#004d94` text (Digital Exercises "6" badge — active/highlighted state), `#E0EAFF` bg / `#2351DB` text (MAX badge) — the `#2351DB`/`#E0EAFF` pair did **not** match `bingel-dc`; found instead in the `tig` and `sanoma-learning` legacy theme exports (`scripts/themes/export/slds-legacy/{tig,sanoma-learning}/base.json`), consistent with "MAX" being a distinct sub-brand/badge style — exact token name not resolved, flag `(unbound — needs a token)` pending confirmation

### Size / Spacing

- `space-new/md`: `8` → confirmed `--sl-space-new-md` (core, `scripts/themes/export/core-css/system/default.css`), itself aliased to `--sl-space-100`
- `space-new/none`: `0` → **(unbound — needs a token)**, no `--sl-space-new-none` found in system/default.css in this search pass
- `space-new/sm`: `6`, `space-new/xs`: `4` → **(unbound — needs a token)**, not located in this search pass (likely exist as `--sl-space-new-sm` / `--sl-space-new-xs` siblings of the confirmed `--sl-space-new-md`, but not directly verified)
- `space/100`: `8`, `space/150`: `12`, `space/075`: `6` → core `--sl-space-100` / `--sl-space-150` / `--sl-space-075` referenced as aliasing targets above; present in `system/default.css`
- `size/borderRadius/default`: `4` → confirmed as the brand-level alias `--sl-brand-size-borderRadius-default`, which on `bingel-dc` resolves to `--sl-size-borderRadius-sm` (not `-md`, unlike several other brands, e.g. `sanoma-learning`/`magister`/`my-digital-book` use `-md`) — implementer should use the brand-correct variant
- `size/borderRadius/child`: `2` → confirmed as `--sl-brand-size-borderRadius-child`, computed as `calc(var(--sl-size-borderRadius-sm) / 2)` (bingel-dc)
- `size/borderWidth/action`: `1` → confirmed as `--sl-brand-size-borderWidth-action`, aliased to `--sl-size-borderWidth-bold`
- `size/icon/font/md`: `16`, `size/200`: `16` → confirmed `--sl-brand-size-icon-font-md` → `--sl-size-new-icon-md` (core icon-size scale)
- `size/icon/font/xs`, `size-new/icon/xs`: `12` → confirmed `--sl-brand-size-icon-font-xs` → `--sl-size-new-icon-xs`
- `size/150`: `12` → core `--sl-size-150` (used as a spacing/size primitive elsewhere in the sizing scale)

### Typography

- `text/heading/2`: Open Sans Bold 24/34/0 → candidate `--sl-text-heading-2*` family (font/size/weight/line-height split tokens); not individually re-verified against a single combined var in this pass
- `text/heading/4`: Open Sans Bold 16/24, letter-spacing 1 → candidate `--sl-text-heading-4*` family
- `text/body/md/normal`: Open Sans Regular 14/20 → candidate `--sl-text-body-md-normal*` family; confirmed sibling values present in `bingel-dc.css` as `--sl-brand-text-new-body-md-fontFamily: 'Open Sans'`, `-fontSize: 14px`, `-fontWeight: 400`, `-lineHeight: 20px` (exact match on all four facets)
- `text/body/md/demibold`: Open Sans SemiBold 14/20 → candidate `--sl-text-body-md-demibold*` family (sibling of the above `body-md` scale at a different weight)
- `text/body/sm/normal`: Open Sans Regular 12/16 → confirmed sibling `--sl-brand-text-new-body-sm-fontFamily: 'Open Sans'`, `-fontSize: 12px`, `-fontWeight: 400` (bingel-dc; line-height not individually re-verified at 16px but consistent with the scale)
- `href/md`, `button/text/lg`, `avatar/header/md`: Proxima Nova Semibold 14, line-heights 16/24/16 respectively → candidate `--sl-text-*` entries in the Proxima Nova (non-"new") legacy typography namespace; not located under the `text-new` scale searched, flag for confirmation
- `breadcrumb/current`, `input/textField/text/md`: Proxima Nova Regular 14/16 and 14/20 respectively → as above, legacy Proxima Nova namespace, not individually re-verified
- `input/textField/text/lg`: Proxima Nova Regular 16/24 → as above
- `icon/font/icon/sm`: Font Awesome 6 Pro Regular 13/12 → icon-font metadata; `text-new/typeset/fontFamily/icon` separately reports **Font Awesome 7 Pro** (not 6 Pro) — note the version mismatch between these two variables, worth flagging to the implementer since the icon font version differs between what's named here and the newer `text-new` namespace
- `text-new/typeset/fontFamily/body`: `Proxima Nova` → confirmed sibling `--sl-brand-text-new-body-*-fontFamily` values are actually `'Open Sans'` in bingel-dc (see above) — i.e. this generic "body" variable's stated family (Proxima Nova) does **not** match what bingel-dc's own `text-new-body-*` tokens resolve to (Open Sans); flag for confirmation, don't assume which is authoritative
- `text-new/typeset/fontWeight/semiBold`: `600` → consistent with Open Sans SemiBold weight used throughout
- `text-new/typeset/fontWeight/regular`: `400` → consistent with Open Sans/Proxima Nova Regular weight used throughout
- `icon/typeset/fontWeight/icon-regular`: `Regular` → confirmed alias `--sl-brand-icon-typeset-fontWeight-regular` → `--sl-icon-typeset-fontWeight-icon-regular` (core)
- Note per schema: the `--sl-text-new-*` namespace exists alongside `--sl-text-*` (confirmed both namespaces present in `bingel-dc.css`) — do not assume a single unified `--sl-text-typeset-*` name.

### Other

- `none`: `Effect(DROP_SHADOW, color #00000000, offset 0 0, radius 0, spread 0)` → a zero/no-op shadow, i.e. "no elevation" state; no token needed, represents the absence of a shadow
- `bingel_dc_shadow`: `Effect(DROP_SHADOW, color #0E4F9547, offset 0 4, radius 12, spread 0)` → literal Figma-side name confirms this design's primary brand context is **bingel-dc**; this specific shadow (used on the active/selected "Digital Exercises" accordion row, node `25124:56913`) was not matched to an exact existing `--sl-*` shadow token in this search pass — flag `(unbound — needs a token)`, closest candidate is the brand's `--sl-elevation-*` family
- `shadow.overlay`: two-layer composite shadow referencing `color/shadow/overlay1` and `color/shadow/overlay2` → confirmed structural match to the core `--sl-elevation-shadow-overlay` composite definition in `scripts/themes/export/core-css/system/default.css` (same two-layer 0/6/18/0 + 0/6/12/-3 structure), though the underlying overlay1/2 _color_ values are the unconfirmed-brand ones noted above
- `opacity/interactive/plain/idle`, `sanoma-learning/opacity/interactive/plain/idle`: `0` → both named "idle" opacity of `0`, i.e. a hidden/transparent idle state for some interactive affordance (likely the focus-ring overlay seen wrapping buttons in the design-context output, e.g. node `I8300:30422;2603:4611;2121:28942` "Focus ring"); not individually re-verified against a specific `--sl-opacity-*` var in this pass
