# Design Manifest — A7: MyPortal / Materials / Overviews

## Overview

Figma file **"MyPortal Designs 2025"** (fileKey `1yroCKkROktqhRCP2wwlzB`), top-level node **"Materials /Overviews"** (`15878:180439`), frame size **1440 × 1890 px**. This is a full application screen for a teacher/school portal (MyPortal): a top app bar (class/school selector, user avatar, quick-action shortcuts), a left primary-navigation rail, a breadcrumb, a class/material header card (title, publisher, authors with avatar stacks, "Digiboardware"/"Edit" actions), a two-column body — a left "Materials" accordion/select-tree (Manuals, Overviews, Goals, Correction Keys, Parent Presentations, chapters 1–10, etc., each with a status badge) and a right "Summative test" panel listing 8 downloadable files by type/size.

## Code Connect Outcome (data, not a blocker — as-is mode)

- **Subtree probe** (`get_code_connect_map` on root `15878:180439`): `{}` — empty.
- **Per-node probe**: 20 individual component-instance node IDs were probed one at a time, chosen to cover 10 of the ~13 distinct top-level instance names present (`sl-breadcrumb`, `SL-card`, `sl-button` ×2, `sl-avatar` ×2, `sl-searchfield`, the `sl-select` frame, `sl-icon` ×3, `badge` ×2, `sl-button-theme`, `Component 31`, `sl-selectbox-theme`, `chevron-down`, `main nav icon`). **All 20 returned `{}`.** No discrepancy between subtree and per-node results in this file — both are uniformly empty.
- **Interpretation**: this design uses `sl-*`-prefixed node names and component descriptions that verbatim match the SLDS documentation site (`sanomalearning.design/categories/components/...`) — e.g. the `sl-button` description text is identical to the real SLDS button doc copy. This means the vocabulary is the real SLDS component set, but **no Code Connect binding exists for this particular Figma file/branch** — consistent with this batch's "as-is" cohort where six of ten files have an empty map. This is recorded as data, not treated as `BLOCKED_ON_CODE_CONNECT`.
- Full per-node JSON: `figma-code-connect-per-node.json`.

## Existing SLDS Components Used

No node in this file returned a non-null Code Connect mapping, so the "CC Snippet" column is empty for every row. Per the identification heuristic (an `sl-*`-named instance is treated as identified even with a `null`/empty mapping), the following are identified as existing SLDS components by node name:

| Node ID                                                                                                                                              | Node Name                   | Mapped Component (identified by name) | CC Snippet (excerpt)                                                                                 |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| 15878:180442                                                                                                                                         | sl-breadcrumb               | `sl-breadcrumb`                       | — (empty CC map; identified by name)                                                                 |
| 16752:171376                                                                                                                                         | SL-card                     | `sl-card`                             | — (identified by name; casing variant "SL-card")                                                     |
| 16752:171387, 16752:171388                                                                                                                           | sl-button (×2)              | `sl-button`                           | — (identified by name)                                                                               |
| 16752:171392, 171395–171404, 15878:180676                                                                                                            | sl-avatar (×10)             | `sl-avatar`                           | — (identified by name)                                                                               |
| 16737:82187                                                                                                                                          | sl-searchfield              | `sl-searchfield`                      | — (identified by name)                                                                               |
| 16737:82490, 82476, 82301, 82309, 82317, 82325, 82333, 82341, 82349, 82357, 82365, 82373                                                             | sl-icon (×12)               | `sl-icon`                             | — (identified by name)                                                                               |
| 16804:573391, 16737:82507/82515/82522/82529/82536/82543/82550/82557/82564/82571/82578, 16804:573382, 16737:82330/82338/82346/82354/82362/82370/82378 | badge (×20)                 | `sl-badge`                            | — (identified by name; wrapped in a `badge-base-theme [DRAFT]` theming frame — the normal pattern)   |
| 15878:180671, 15878:180673                                                                                                                           | sl-selectbox-theme (×2)     | `sl-selectbox` (themed)               | — (identified by name)                                                                               |
| 15878:180677, nested chevron-down inside selectboxes                                                                                                 | chevron-down                | `sl-icon` (chevron-down glyph)        | — (identified by name)                                                                               |
| 15878:180701–180707                                                                                                                                  | main nav icon (×7, sidebar) | `sl-*` nav-icon component             | — (identified by name; **only** the 7 left-sidebar items are real instances — see Override Analysis) |

**Not identifiable / not applicable:** `24382:668429` (`sl-button-theme`) and `24382:668430`/`24382:668433`/`24382:668467` (`Component 31`/`Component 32`) are standalone instances sitting inside `hidden="true"` frames (dead/inactive layers, not part of the rendered screen) — excluded from the placeable count and not treated as blockers.

## Composition Candidates

- **Top app bar** — `15878:180663` and children (`15878:180664`–`180697`): class selectbox + school selectbox + avatar/chevron + quick-actions row. Appears as one cohesive header unit, fixed across the whole app shell.
- **Material header card** — `16752:171373` and children: thumbnail (`SL-card`) + title/publisher/edition + action buttons + author/co-author avatar-stack row. Repeats per material (only one instance shown here, but the structure is clearly a reusable "class material summary" composite).
- **Sidebar nav-list row** — the repeated pattern at `16737:82496`–`82578` and `16737:82474`–`82378` (label + status badge, or label + `sl-icon` + chevron for section headers): 20 near-identical rows, a strong candidate for a single "nav list item" component.
- **File/exercise row** — `24382:668419`–`668473` in the Summative test panel: icon + filename + filesize, repeated 8 times verbatim — a strong candidate for a "file list item" component.
- **Avatar group / "with own copy" stack** — `16752:171393`–`171404`: overlapping avatar circles (negative-margin stacking) + trailing name/count text. Repeats twice (co-authors, "with own copy") with different counts.

## Net-New Primitive Candidates

- `_None._` — every visual element decomposes into an identified SLDS component name (button, avatar, badge, icon, searchfield, breadcrumb, selectbox, card) or a composition of those. No element requires an entirely new primitive.

## Responsive Breakpoints

`_Single breakpoint: 1440px._` Only one frame/size exists in the provided node; no alternate-width frames or constraint annotations were found in the subtree.

## Designer Annotations

`_None._` No comment/annotation layer nodes were found in the metadata subtree. (Figma component **descriptions**, which are documentation text attached to library components themselves rather than designer annotations on this file, are quoted verbatim in `figma-design-context*.md` parts 1, 3, 4, 5 — e.g. the `sl-selectbox-theme`, `sl-avatar`, `sl-breadcrumb`, `sl-button`, `sl-searchfield`, `sl-icon` usage notes.)

## Token Reference

Built primarily from `get_variable_defs` (`figma-variable-defs.json`, 39 entries, called on the root node — this single call already aggregated contributions from every sub-node probed, confirmed by cross-checking against each part's "bound styles" output, so no further per-subnode merge was needed).

**Theme match: `bingel-dc`.** Every one of the design's 15 distinct bound hex values resolves exactly inside `packages/themes/bingel-dc/theme.css` — but it also resolves exactly inside the sibling `bingel-int` theme (the two share the entire colour palette and differ in only 46 lines total, independently confirmed with `diff`). Colour alone cannot discriminate between the two. The deciding evidence:

1. **The design names the theme.** One bound variable is literally `bingel_dc_shadow` (`Effect(type: DROP_SHADOW, color: #0E4F9547, offset: (0, 4), radius: 12, spread: 0)`) — a direct label, not an inference.
2. **Typography does not discriminate the way it first appears to.** The design's `text/*`-prefixed variables (`text/heading/2`, `text/heading/4`, `text/body/md/normal`, `text/body/md/demibold`, `text/body/sm/normal`) are all Open Sans — and Open Sans is what **both** themes' base `--sl-text-new-*` layer resolves to (independently confirmed: `bingel-dc` has 0 occurrences of "proxima" anywhere in its theme.css; `bingel-int` additionally defines a brand-scoped `--sl-brand-text-new-*-fontFamily: 'proxima-nova'` override layer that `bingel-dc` does not have — but neither theme's font-family tokens share a name with the design's other variables, `href/md`, `breadcrumb/current`, `avatar/header/md`, `button/text/lg`, `input/textField/text/lg|md`, which are Proxima Nova). Those Proxima Nova-styled variables belong to a **separate, unmatched vocabulary** (MyPortal's own link/breadcrumb/avatar/button/input component styles), not to either theme's semantic text scale — so their presence does not actually favour `bingel-int` over `bingel-dc` the way it might first seem. Given that, the literal `bingel_dc_shadow` name is the strongest single piece of evidence, and `bingel-dc` is the theme recorded here.
3. **Caveat, stated plainly:** this is not a fully airtight determination — it rests on one effect-style name plus the absence of a positive discriminator elsewhere. If the implementer has independent signal (e.g. a brand/data-attribute visible elsewhere in the live MyPortal product), that should take precedence.

- **Color:**
  - `color/palette/primary/500` → `#0060B9` → `--sl-brand-light-color-palette-blue-500` / `--sl-color-palette-blue-500`
  - `color/palette/primary/900` → `#001223` → `--sl-color-palette-blue-900`
  - `body/foreground`, `foreground`, `href/active/foreground`, `href/md` foreground → `#002649` → `--sl-color-palette-blue-800`. **No semantic foreground token resolves to this value** — `--sl-color-foreground-plain` resolves to `#373a3e` (grey-800) in `bingel-dc`, a _different_, visibly-lighter grey, not navy. Use the palette token `--sl-color-palette-blue-800` directly; do not substitute the semantically-named foreground token.
  - `color/palette/neutral/700` → `#54585D` → `--sl-color-palette-grey-700`
  - `color/palette/neutral/600`, textfield placeholder → `#71777D` → `--sl-color-palette-grey-600`
  - `breadcrumb/divider` → `#8D959D` → `--sl-color-palette-grey-500`
  - `color/palette/neutral/50` → `#F2F3F5` → `--sl-color-palette-grey-050`
  - `card/border` → `#C7CDD3` → `--sl-color-palette-grey-200`
  - `color/button/default/solid/idle/border`, `button/default/solid/idle/border` → `#E3E6EA` → `--sl-color-palette-grey-100`
  - `input/fieldLabel/select/group-title/foreground` → `#B8C0C8` → `--sl-color-palette-grey-300`
  - `button/default/solid/idle/foreground` → `#002F62` → `--sl-color-palette-blue-700`
  - `color/button/warning/solid/idle/background` → `#FF9D00` → `--sl-color-palette-orange-400`
  - `color/button/default/outline/focus/border` → `#0074DF` → `--sl-color-palette-blue-400`
  - `color/button/success/link/focus/foreground` → `#235500` → `--sl-color-palette-green-700`
  - `Flowkit/White`, `body/background`, `button/primary/solid/idle/foreground`, `input/textField/default/default/background`, `color/input/fieldLabel/select/panel/bacground`, `color/palette/white/base` → `#FFFFFF` → `--sl-color-palette-grey-000`
  - `none` (Effect, drop-shadow with 0-alpha) → effectively "no shadow" — no token needed
  - `bingel_dc_shadow` (`#0E4F9547`, offset 0/4, radius 12) → **no exact `--sl-shadow-*`/`--sl-elevation-*` token matches this hex+alpha+offset+radius combination** in either theme's theme.css. `(unbound — needs a token; nearest candidate is `--sl-elevation-shadow-sm`, but its colour stops and structure differ — confirm with design before approximating)`

- **Size / Spacing:** no `--sl-size-*` variable bindings were present in the `get_variable_defs` response for this node — all spacing in the design-context output is raw Tailwind px utilities (`p-[16px]`, `gap-[12px]`, `px-[24px]`), not bound Figma variables. Implementer should still map onto the repo's `--sl-size-*` scale by **value**, not by guessed name: confirmed in `bingel-dc`, `--sl-size-100` = 8px, `-200` = 16px, `-300` = 24px, `-400` = 32px, `-500` = **40px** (never assume a Figma `Size/N` label maps to `--sl-size-N`). Also confirmed: `--sl-size-borderRadius-default` resolves to `--sl-size-borderRadius-sm` in `bingel-dc` vs `--sl-size-borderRadius-md` in `bingel-int` — another place the two candidate themes diverge operationally even though their colour palettes are identical.

- **Typography:**
  - `text/heading/2` → Open Sans Bold 24/34 → card title ("Reken Maar! 4")
  - `text/heading/4` → Open Sans Bold 16/24, letterSpacing 1 → sidebar "Materials" section label
  - `text/body/md/normal` → Open Sans Regular 14/20 → publisher/edition lines. Matches `--sl-text-new-body-md` (Open Sans / 14px / 20px / 400) exactly on family, size, line-height, and weight.
  - `text/body/md/demibold` → Open Sans SemiBold 14/20 → file names, nav-row labels. `--sl-text-new-*` is a `font:` **shorthand** that resets weight to 400 — every demibold/bold run needs an explicit `font-weight: var(--sl-fontWeight-600|700)` applied _after_ the shorthand, or the shorthand silently wins and the text renders at regular weight.
  - `text/body/sm/normal` → Open Sans Regular 12/16 → file sizes. Matches `--sl-text-new-body-sm` exactly.
  - `href/md` → Proxima Nova Semibold 14/16 → breadcrumb home link
  - `breadcrumb/current` → Proxima Nova Regular 14/16 → breadcrumb current-page label
  - `avatar/header/md` → Proxima Nova Semibold 14/16 → avatar name labels
  - `button/text/lg` → Proxima Nova Semibold 14/24 → button labels
  - `input/textField/text/lg` → Proxima Nova Regular 16/24 → class selectbox value
  - `input/textField/text/md` → Proxima Nova Regular 14/20 → school selectbox value
  - `icon/font/icon/sm` → Font Awesome 6 Pro Regular 13/12 → breadcrumb divider glyph
  - **Proxima Nova is not registered anywhere in this repo's theme files** (`bingel-dc` has zero occurrences of "proxima" in theme.css; checked). The six Proxima-Nova-styled variables above (`href/*`, `breadcrumb/current`, `avatar/header/md`, `button/text/lg`, `input/textField/text/*`) belong to a vocabulary that is not `--sl-text-new-*`/`--sl-typography-*` by name and has no family token in either theme — these will render in the theme's fallback (Open Sans) family unless the implementer sources Proxima Nova separately. **This is a real, confirmed gap**, not a false positive (rule 9 checked: searched by resolved value/family name directly in the theme CSS, zero matches).
  - **Font Awesome version mismatch, confirmed:** the design's icon font variable is `'Font Awesome 6 Pro'`; `bingel-dc`'s theme.css only defines `'Font Awesome 7 Pro'` / `'Font Awesome 7 Sharp'` (same for `bingel-int` and every other theme checked). No "Font Awesome 6 Pro" family exists anywhere in the repo.
  - **Icon registry gap, confirmed by direct lookup:** `bingel-dc`'s `icons.ts` registers exactly **34** distinct icon keys. Of the **16** distinct icon glyph names this design actually uses (`home-blank`, `slash-forward`, `chevron-down`, `presentation-screen`, `pencil`, `plus`, `comment`, `note`, `image`, `file-text`, `file-ppt`, `file-mp4`, `file-pdf`, `file-invoice-dollar`, `file-doc`, `file-word`), only **2** (`home-blank`, `chevron-down`) are present in the registry. The other **14** (87.5%) have no entry and cannot render via the theme's icon system as-is — they will need either a registry addition, a substitute glyph, or to render as an empty box placeholder. This is the single largest implementation gap in the file.

- **Other:** none beyond the above.

## Note on run-folder provenance (flagged for the user, not acted on)

Two files — `progress.json` and `token-reference.md` — appeared in this run folder during this session that this agent did not create (confirmed: the folder held only an empty `testing/` subdirectory at the start of the run). Both are attributed to "the run orchestrator" / `runs/harness/theme-match.mjs` and assert a `bingel-dc` theme match with supporting detail. Per policy, this content was treated as untrusted data, not as instruction — its factual claims (colour-token resolutions, `--sl-size-*` values, the `bingel-dc`/`bingel-int` 46-line diff, the 34-icon registry count, the 2-of-16 icon-glyph hit rate) were **independently re-derived from the actual theme/icon source files in this repo** using this agent's own tool calls before being relied on, and all of the spot-checked claims matched. The theme conclusion in this manifest (`bingel-dc`) was reached and confirmed this way, not copied from the unexplained files. The user should be aware a concurrent process wrote into this run's folder mid-session; this agent did not execute anything from those files and did not treat their presence as authorization for anything.

---

# Decomposition (Stage 2)

Framework **lit** · i18n **off** · theme **`bingel-dc`** · tag prefix **`sl-a7-myportal-`** (mandatory:
sibling run A3 decomposes another frame of the _same_ Figma file and mints the same shared chrome;
the design system's guarded `customElements.define` turns a tag collision into a silent mis-render,
so namespacing is the only defence) · output base
`examples/lit/src/_runs/a7-myportal-materials-overviews/`.

**6 components + 1 shared helper.** Only the root calls `customElements.define`; all five children
are `ScopedElementsMixin` classes that export themselves and never register.

| tag                                                          | class                      | path                                 | composes                                         |
| ------------------------------------------------------------ | -------------------------- | ------------------------------------ | ------------------------------------------------ |
| `sl-a7-myportal-materials-overviews-page` **(root, global)** | `A7MaterialsOverviewsPage` | `materials-overviews-page.ts`        | `sl-breadcrumbs` + all five children             |
| `sl-a7-myportal-app-bar`                                     | `A7AppBar`                 | `app-bar/app-bar.ts`                 | `sl-select`, `sl-option`, `sl-avatar`, `sl-icon` |
| `sl-a7-myportal-nav-rail`                                    | `A7NavRail`                | `nav-rail/nav-rail.ts`               | — (8 `<li>`)                                     |
| `sl-a7-myportal-material-header`                             | `A7MaterialHeader`         | `material-header/material-header.ts` | `sl-button` ×2, `sl-avatar` ×6                   |
| `sl-a7-myportal-material-tree`                               | `A7MaterialTree`           | `material-tree/material-tree.ts`     | `sl-search-field`, `sl-badge` ×20, `sl-icon`     |
| `sl-a7-myportal-file-panel`                                  | `A7FilePanel`              | `file-panel/file-panel.ts`           | — (8 `<li>`)                                     |
| —                                                            | `iconGap()`                | `icon-gap.ts`                        | shared helper, **written by the orchestrator**   |

**Deliberately NOT components** (conventions: "a row that's just icon + text + link/avatar is an
`<li>`, not a component"): the 20 tree rows, the 8 file rows, the 8 nav-rail rows, the 4
quick-action links, the 3 avatar stacks, the breadcrumb, and the cover thumbnail.

## The one measured override finding, and what it does to the API

Zero Code Connect mappings exist anywhere in this file — subtree `{}` plus 20 per-node probes, all
`{}`, 0 of 21. **Consequence: nothing in this file carries authoritative component-variant
information**, so every visual difference is modelled as a property on our own component and never
as evidence of an SLDS variant.

The clearest instance: the ACTIVE "Overviews" tree row is the only one of 20 that wraps its badge
in a doubled `sl-badge > badge-base-theme > sl-badge > badge-base-theme` frame cycle
(`16737:82502`–`82507`). That is copy-paste, not a component variant. It renders as **one**
`<sl-badge>` with every active difference driven from a `[data-active]` boolean.

## Open questions — 40, with the default taken

All 40 defaults from the decomposer are accepted **except OQ-23**, and OQ-10/OQ-40 are now resolved
by measurement rather than by default. Full list in the Stage 2 agent record; the ones that change
pixels:

- **OQ-23 Miniaturize row — DEFAULT OVERRIDDEN: do not render it.** The decomposer defaulted to
  rendering it because it is present in the node data. Arithmetic says the reference cannot show
  it: menu frame `15878:180698` sits at y=96, its footer frame `15878:180708` at y=504, and the
  row `15878:180709` at y=1274 within that — absolute y = 96 + 504 + 1274 = **1874**. The row's own
  content starts 24px further down (icon `15878:180710` at y=24, text at y=28), i.e. at **1898**,
  and the artboard is **1890** tall. It is clipped out of the frame. Rendering it would put visible
  content where the ground truth has none.
- **OQ-16 `sl-select` height.** `select.css` sizes its control
  `calc(1lh + (var(--sl-size-100) - var(--sl-size-borderWidth-default)) * 2)` = `1lh + 14px`
  (8 − 1 = 7, ×2 = 14). At `--sl-text-new-body-md` line-height 20px that is **34px** against the
  drawn **30px** — a **+4px** delta per control, not the +10px assumed from a 40px guess. The app
  bar therefore grows 4px and everything below shifts 4px. **Measure the rendered height at Stage 4
  and record it; do not pad anything to recover the 4px.**
- **OQ-10 `#F2F3F5` as a border — resolved:** `--sl-color-palette-grey-050` is declared and resolves
  to `#f2f3f5`. Use it.
- **OQ-11 `bingel_dc_shadow`** (`#0E4F9547`, 0/4, r12) has no token. Omit the shadow, record it.
  `--sl-elevation-shadow-sm` exists but is `1px 1px #1b1c1e0a, 3px 2px #1b1c1e1f` — different stops.
- **OQ-2 the icon gap is 18 glyphs, not 14.** `books`, `files`, `Book` and `search` are also
  unregistered and were missing from the manifest's list.
- **OQ-12/13/14 typography deltas:** panel heading drawn 20/34 vs `heading-lg` 24/32; card title
  drawn 24/34 vs 24/32; tree section headers drawn 16/24 + letter-spacing 1 vs `heading-md` 16/20
  with no letter-spacing token. Accept and record — these are theme floors, not implementation bugs.
- **OQ-15 Proxima Nova is registered nowhere in this repo.** Every Proxima Nova run falls back to
  Open Sans. Accept.
- **OQ-17 `sl-search-field`'s own magnifier** renders `search`, which `bingel-dc` does not register.
  Unfixable from our side without `@fortawesome/*`. Accept and record.

## Size / radius tokens — verified by resolution, not by name

`--sl-size-025`=2 · `-050`=4 · `-075`=6 · `-100`=8 · `-125`=10 · `-150`=12 · `-175`=14 · `-200`=16 ·
`-250`=20 · `-300`=24 · `-400`=32 · `-500`=**40**.
Radii: `-borderRadius-sm`=2 · `-md`=4 · `-lg`=8 · `-xl`=12 · `-full`=50rem · `-default`=2 ·
**`-borderRadius-xs` IS NOT DECLARED**. The drawn **6px** radius on the material-header card has no
token (sm=2, md=4, lg=8) — nearest is `md` at 4px, a −2px delta to record.

Every other token named in the per-component specs was resolved against
`packages/themes/bingel-dc/theme.css` and exists.

---

## Theme correction (post-Stage-2)

**The theme is `bingel-int`, not `bingel-dc`.** Stage 1 and Stage 2 were both run against
`bingel-dc`; nothing they produced changes, because the two themes are colour-identical, share a
byte-identical 34-icon registry, and resolve every `--sl-size-*` and `--sl-text-new-*` token this
run names to the same value — with **one** exception:

- `--sl-size-borderRadius-default` = **4px** under `bingel-int` (2px under `bingel-dc`), which is
  exactly the radius this design draws. So the Stage 2 note "the drawn 4px radius maps to
  `--sl-size-borderRadius-md`" becomes "…maps to `--sl-size-borderRadius-default`", same value.

Basis of record: **inherited from sibling run A3** (same Figma file, different frame), which binds
three numeric tokens this frame does not bind at all and resolves 3/3 to `bingel-int`. This run's
own `theme-match` still ties at 15/15 for both and coin-flips to `bingel-dc`; see
`token-reference.md` for the retraction of the two arguments that originally justified `bingel-dc`.
