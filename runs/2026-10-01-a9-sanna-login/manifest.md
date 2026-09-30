# Design Manifest — Login 1 (SANNA Ready for Development)

## Overview

Figma file "SANNA-Ready-for-Development", top-level node "Login 1" (`71:13345`), frame size 1512 × 982 px. The design is a login/landing screen for an "AI Teacher Assistant" product: a left-aligned content column with a brand wordmark, a headline and subhead, a country/location select field, a primary "Sign in" button, and a footer row of legal links, paired with a full-height decorative photo on the right half of the frame.

## Existing SLDS Components Used

| Node ID             | Node Name                    | Mapped Component                                                   | CC Snippet (excerpt)                                                                                                                                                                                                                     |
| ------------------- | ---------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 71:13441            | sl-select (simple-prototype) | `<sl-form-field label="Select location"><sl-select>`               | `<sl-form-field label="Select location"><sl-select placeholder="Placeholder" value="Belgium">`                                                                                                                                           |
| 71:13442            | sl-button-pill               | `<sl-button shape="pill" variant="primary">`                       | `<sl-button shape="pill" variant="primary">Sign in</sl-button>`                                                                                                                                                                          |
| I72:10150;173:3541  | sl-button-pill               | `<sl-button fill="link" shape="pill" size="sm" variant="primary">` | `<sl-button fill="link" shape="pill" size="sm" variant="primary">Privacy Notice</sl-button>`                                                                                                                                             |
| I72:10150;173:3542  | sl-button-pill               | `<sl-button fill="link" shape="pill" size="sm" variant="primary">` | `<sl-button fill="link" shape="pill" size="sm" variant="primary">Terms and conditions</sl-button>`                                                                                                                                       |
| I72:10150;173:3543  | sl-button-pill               | `<sl-button fill="link" shape="pill" size="sm" variant="primary">` | `<sl-button fill="link" shape="pill" size="sm" variant="primary">Other link</sl-button>`                                                                                                                                                 |
| I72:10150;216:81142 | sl-button-pill               | `<sl-button fill="link" shape="pill" size="sm" variant="primary">` | `<sl-button fill="link" shape="pill" size="sm" variant="primary">AI Transparency Statement</sl-button>`                                                                                                                                  |
| 0:101               | (label, internal)            | `form/src/label.ts`                                                | (identified) — `hasTemplate: false`, source-only mapping to `packages/components/form/src/label.ts`; no snippet emitted. Backs the label rendering inside `sl-form-field`/`sl-select` above; not a separately placed node in this frame. |

Notes on nodes reviewed but excluded from the table above:

- `71:13346` ("sl-button-pill") is `hidden="true"` in the source file — it is not rendered in the visible design and is excluded entirely.
- `71:13361` ("logo-wordmark") and `71:13362` ("Image login") are component instances with no Code Connect mapping, but on inspection they wrap only an `<img>`/SVG (logo-wordmark) and a rounded-rectangle photo fill (Image login pexels-mary-taylor-5896521) — i.e. static brand/content assets, not interactive or structural SLDS components. They are not blocking and are not candidates for new component development; they should be implemented directly as an image/logo asset.

## Composition Candidates

- **Login form** — Node IDs `71:13433` (wrapper), `71:13434` (headline + subhead text stack), `71:13437`/`71:13438`/`71:13439`/`71:13440` (input content wrapper), `71:13441` (select), `71:13442` (sign-in button). Appears as a single vertically-centered unit (headline, subhead, location select, sign-in button) — the core login card content, likely worth a single composed component.
- **Footer link bar** — Node ID `72:10150` (footer) containing `I72:10150;173:3541`, `I72:10150;173:3542`, `I72:10150;173:3543`, `I72:10150;216:81142` (four `sl-button` link-style pills: Privacy Notice, Terms and conditions, Other link, AI Transparency Statement). Repeats as a horizontal row of legal/footer links and appears as a single reusable unit.

## Net-New Primitive Candidates

_None._ The only non-mapped instances (`logo-wordmark`, `Image login`) are static image/logo assets, not UI primitives requiring new component development (see notes under Existing Components above).

## Responsive Breakpoints

_Single breakpoint: 1512px._ (Only one frame/artboard exists at this node; no other width variants or layout-grid breakpoint annotations were present in the metadata.)

## Designer Annotations

_None._ No annotation/comment layer nodes were present in the metadata tree for this frame.

## Token Reference

Built primarily from `get_variable_defs` on node `71:13345`.

**Color**

- `color/palette/purple/900` = `#32005a` (headline/subhead text color; design-context fallback showed `#29076e` for this same variable, likely a different mode — implementer should resolve via the bound variable, not the raw fallback)
- `color/foreground/bold` = `#191418`
- `color/foreground/plain` = `#2d292a`
- `color/foreground/primary/bold` = `#32005a`
- `color/foreground/primary/onBold` = `#e2d9fc`
- `color/background/primary/bold` = `#32005a`
- `color/background/input/plain` = `#ffffff`
- `color/background/input/interactive` = `#b4b1ad`
- `color/border/input` = `#908d89`
- `color/transparent` = `#00000000`
- `background/canvas` = `#fbfaf7` (screen background)

**Size / Spacing**

- `size/010` = `1`
- `size/200` = `16`
- `size/250` = `20`
- `size/300` = `24`
- `size/icon/font/xs` = `12` (bound to the frame's corner radius)
- `size/icon/font/md` = `16`
- `size/borderRadius/default` = `8`
- `size/borderRadius/full` = `800`
- `size/borderWidth/none` = `0`
- `size/borderWidth/default` = `1`
- `size/borderWidth/action` = `1`
- `space/025` = `2`
- `space/075` = `6`
- `space/100` = `8`
- `space/150` = `12`
- `space/200` = `16`
- `space-new/none` = `0`
- `space-new/2xs` = `2`
- `space-new/xs` = `4`
- `space-new/sm` = `6`
- `80px` (gap between headline/subhead stack and the input content block, node `71:13433`) `(unbound — needs a token)`
- `40px` (gap between headline and subhead, node `71:13434`) `(unbound — needs a token)`
- `24px` (gap between the select field and sign-in button, node `71:13440`) `(unbound — needs a token)`
- `32px` (gap between footer link items, node `I72:10150;173:3540`) `(unbound — needs a token)`
- `24px` corner radius on the login photo (`71:13362` mask) `(unbound — needs a token)`

**Typography**

- `size/text-new/heading/2xl` = `48` (headline font size)
- `size/lineHeight/600` = `48` (headline line height)
- `size/text-new/heading/md` = `16` (subhead font size)
- `size/lineHeight/250` = `20` (subhead line height)
- `size/text-new/body/md` = `14`
- `text-new/typeset/fontWeight/semiBold` = `600` (headline/subhead weight — generated code shows font family `New_Message:SemiBold`)
- `text-new/typeset/fontWeight/regular` = `400`
- `text-new/typeset/fontFamily/icon` = `Font Awesome 7 Pro`
- `icon/typeset/fontWeight/icon-regular` = `regular`

**Other**

- `Large` = `Effect(type: DROP_SHADOW, color: #3E55980D, offset: (0, 5), radius: 11, spread: 0); Effect(type: DROP_SHADOW, color: #3E55980A, offset: (0, 20), radius: 20, spread: 0); Effect(type: DROP_SHADOW, color: #3E559808, offset: (0, 45), radius: 27, spread: 0); Effect(type: DROP_SHADOW, color: #3E559803, offset: (0, 80), radius: 32, spread: 0); Effect(type: DROP_SHADOW, color: #3E559800, offset: (0, 125), radius: 35, spread: 0)` — elevation/shadow style applied to the frame container.
- `opacity/interactive/plain/idle` = `0`
- `opacity/interactive/bold/idle` = `0`

---

# Component Decomposition (Stage 2)

## Component Tree

```
<sl-login-page>                    root — owns data + page layout
  └── new child: <sl-login-form>   presentational, owns the single <sl-form>
```

Deliberately not components: footer legal links (a `<nav><ul>` from a constant array in the root),
the wordmark and the photo (static assets), the headline/subhead stack (slot content).

## Shared Types / Contracts

```
LocationOption          { id: string; name: string }                  exported by sl-login-form
LoginFormModel          { locations: LocationOption[]; selectedLocationId: string | null }
LoginFormSubmitDetail   { locationId: string }
SlLoginFormSubmitEvent          = SlEvent<LoginFormSubmitDetail>       sl-login-form
SlLoginFormLocationChangeEvent  = SlEvent<{ locationId: string }>      sl-login-form
SlLoginPageSignInEvent          = SlEvent<{ locationId: string }>      sl-login-page
```

Root-internal, not a contract: `LegalLinkItem { id; label; href }` + `LEGAL_LINKS` constant.

## Open questions and the defaults chosen by the orchestrator

The pipeline has no approval gate at this stage; it instructs the orchestrator to pick a sensible
default for each open question and proceed. Nine were raised on this design. Each default below was
chosen by the orchestrator, not by a human.

| #   | Question                                   | Default chosen                                                                                             |
| --- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| 1   | Net-new primitives empty — expected?       | Confirmed, nothing to approve                                                                              |
| 2   | Are locations fetched or static?           | Root owns the data with a typed mock and a "fetch goes here" comment, per the conventions                  |
| 3   | Footer bar as its own component?           | No — a styled `<ul>` in the root, per the list heuristic                                                   |
| 4   | Five unbound raw values                    | Approximate with the nearest existing token and leave a TODO naming the raw value; never hardcode silently |
| 5   | Purple resolves to two values              | Bind the variable (`color/*/primary/bold`); never write either hex                                         |
| 6   | heading/subheading as slots or properties? | Slots, with default content matching the design                                                            |
| 7   | Do footer links navigate?                  | Anchors with `href`                                                                                        |
| 8   | What does Sign in do?                      | Emit the event; the host app owns auth                                                                     |
| 9   | Responsive behaviour                       | Fixed desktop at the single 1512px breakpoint the manifest states                                          |
