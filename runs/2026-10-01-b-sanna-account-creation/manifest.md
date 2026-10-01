# Design Manifest — Account creation (SANNA Ready for Development)

Run: `b-sanna-account-creation` · node `174:232051` · fileKey `Mzc8BuOvMxOJGAQtv0h64M`
Server: `figma` (remote) · Framework: `lit` · i18n: **off** · Output: `examples/lit/src/_runs/b-sanna-account-creation/`
Derived theme: **`teacher-assistant`** (16/16 colour tokens, absoluteAgreement 1.0, marginOverSecond 8×)

## Overview

Figma file "SANNA-Ready-for-Development", top-level node "Account creation" (`174:232051`), frame
1512 × 982 px. An account-creation/signup screen for the same "AI Teacher Assistant" product as the
`Login 1` frame (reference run `a9-sanna-login`): a centred form column on the left (headline,
First/Last name row, email field, three consent checkboxes, a primary "Continue" and a secondary
"Go back" button, and an "Already have an account? Sign in" row), a full-height decorative photo on
the right, a footer row of four legal links, and the brand wordmark top-left.

**Instance count vs. placed components.** The survey reports 506 nodes and 23 component types. What
a developer actually places is **13 SLDS instances**: 3 `sl-text-field` (each inside an
`sl-form-field`), 3 `sl-checkbox`, 3 `sl-button` in the form body, and 4 `sl-button` in the footer.
Everything else is component internals.

## Existing SLDS Components Used

A single `get_code_connect_map` call over the whole frame returned a full, non-empty result — no
per-node fallback was needed.

| Node ID                                   | Node Name         | Mapped Component                                                      | CC Snippet (excerpt)                                                                       |
| ----------------------------------------- | ----------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| 174:231588                                | sl-text-field     | `<sl-form-field label="First name"><sl-text-field>`                   | `placeholder="[object Object]" value="[object Object]"` — see "valid-but-wrong" note below |
| 174:231589                                | sl-text-field     | `<sl-form-field label="Last name"><sl-text-field>`                    | same `[object Object]` defect                                                              |
| 174:231470                                | sl-text-field     | `<sl-form-field label="Email address"><sl-text-field required>`       | same `[object Object]` defect; `required` is real                                          |
| 174:232025                                | sl-button-pill    | `<sl-button shape="pill" size="lg" variant="primary">`                | `Continue`                                                                                 |
| 174:232026                                | sl-button-pill    | `<sl-button fill="outline" shape="pill" size="lg" variant="primary">` | `<sl-icon name="far-arrow-left"></sl-icon> Go back` — see icon note below                  |
| 174:231475                                | sl-button-pill    | `<sl-button fill="link" shape="pill" variant="primary">`              | `Sign in`                                                                                  |
| 174:231967 / 231968 / 231969              | sl-checkbox       | `<sl-checkbox checked>`                                               | empty — label text dropped, see note below                                                 |
| I174:231478;173:3541 (canonical `0:213`)  | sl-button-pill    | `<sl-button fill="link" shape="pill" size="sm" variant="primary">`    | `Privacy Notice`                                                                           |
| I174:231478;173:3542 (canonical `0:230`)  | sl-button-pill    | `<sl-button fill="link" shape="pill" size="sm" variant="primary">`    | `Cookie Notice`                                                                            |
| I174:231478;173:3543 (canonical `0:247`)  | sl-button-pill    | `<sl-button fill="link" shape="pill" size="sm" variant="primary">`    | `Terms of User`                                                                            |
| I174:231478;216:81142 (canonical `0:264`) | sl-button-pill    | `<sl-button fill="link" shape="pill" size="sm" variant="primary">`    | `AI Transparency Statement`                                                                |
| 0:3 / 0:34 / 0:53                         | (label, internal) | `form/src/label.ts`                                                   | **`hasTemplate: false`** — identified, no snippet. Backs the three `sl-form-field` labels. |

### Code Connect mappings that are valid but wrong

1. **`placeholder="[object Object]"` / `value="[object Object]"`** on all three text fields. The
   mapping resolves and emits a syntactically valid snippet; the property value it serialises is a
   stringified object. Copying the snippet verbatim would ship `[object Object]` into the UI. The
   real placeholders come from the screenshot: `Your first name`, `Your last name`,
   `Enter your password` (see the design defect below).
2. **`<sl-icon name="far-arrow-left">`** on the "Go back" button. The `far-` prefix means
   `@fortawesome/pro-regular-svg-icons`, which is not installed here. The `teacher-assistant` theme
   registers the same glyph under the bare name **`arrow-left`**, which works with no import. Use
   `name="arrow-left"`.
3. **`<sl-checkbox checked></sl-checkbox>`** — the snippet is correct as far as it goes but drops the
   entire label, which on this screen is rich text with embedded links. It must be authored from the
   screenshot, not from the snippet.

### Design defect observed in the reference

The **Email address** field's placeholder reads **"Enter your password"** in the Figma frame. This is
a designer error, not an implementation choice. Implemented verbatim (fidelity is the target) and
recorded here.

### Nodes reviewed but excluded

- `174:231461` ("sl-button-pill") is `hidden="true"` — not rendered, excluded. (Same pattern as
  Login 1's `71:13346`.)
- `174:231476` ("logo-wordmark") and `174:231477` ("Image login") have no Code Connect mapping but
  wrap only an SVG and a rounded photo fill. Static assets, not components; not blocking.

## Composition Candidates

- **Account creation form** — `174:231462` wrapper; headline `174:231463`/`174:231464`; "content
  inputs" `174:231465`. Directly analogous to Login 1's "Login form".
- **Name row** — `174:231587` with `174:231588` / `174:231589`.
- **Consent checkbox group** — `174:231965`/`174:231966` with `174:231967`–`174:231969`.
- **Action pair** — `174:232024` with Continue `174:232025` and Go back `174:232026`.
- **Footer link bar** — `174:231478`, four link-fill pills. Structurally identical to Login 1's
  footer (`72:10150`, same `173:3541/3542/3543` + `216:81142` suffixes) with different labels.

## Net-New Primitive Candidates

_None._ Only `logo-wordmark` and `Image login` are unmapped, and both are static assets. Same
conclusion as the Login 1 run.

## Responsive Breakpoints

_Single breakpoint: 1512 px._ One artboard, no width variants, no layout-grid annotations.

## Designer Annotations

_None._

## Token Reference

From `get_variable_defs` on `174:232051`, supplemented by `get_design_context`. **Every raw value in
this design resolves to an exact `teacher-assistant` token** — the orchestrator checked each against
the theme's resolved values rather than its names. Nothing here is genuinely unbound.

**Colour** (all 16 match `teacher-assistant` exactly — this is the theme derivation evidence)

| Figma variable                               | Value     | Theme custom property                                |
| -------------------------------------------- | --------- | ---------------------------------------------------- |
| `background/canvas`                          | `#fbfaf7` | `--sl-elevation-surface-base-default`                |
| `color/palette/purple/900`                   | `#32005a` | headline — bind `--sl-color-foreground-primary-bold` |
| `color/foreground/bold`                      | `#191418` | `--sl-color-foreground-bold`                         |
| `color/foreground/plain`                     | `#2d292a` | `--sl-color-foreground-plain`                        |
| `color/foreground/primary/bold`              | `#32005a` | `--sl-color-foreground-primary-bold`                 |
| `color/foreground/secondary/bold`            | `#32005a` | `--sl-color-foreground-secondary-bold`               |
| `color/foreground/primary/onBold`            | `#e2d9fc` | `--sl-color-foreground-primary-onBold`               |
| `color/background/primary/bold`              | `#32005a` | `--sl-color-background-primary-bold`                 |
| `color/background/input/plain`               | `#ffffff` | `--sl-color-background-input-plain`                  |
| `color/background/input/interactive`         | `#b4b1ad` | `--sl-color-background-input-interactive`            |
| `color/background/selected/bold`             | `#32005a` | `--sl-color-background-selected-bold`                |
| `color/background/selected/interactive/bold` | `#b4a3f4` | `--sl-color-background-selected-interactive-bold`    |
| `color/border/bold`                          | `#908d89` | `--sl-color-border-bold`                             |
| `color/border/input`                         | `#908d89` | `--sl-color-border-input`                            |
| `color/border/selected`                      | `#32005a` | `--sl-color-border-selected`                         |
| `color/border/primary/bold`                  | `#32005a` | `--sl-color-border-primary-bold`                     |

Also present: `teacher-assistant/color/foreground/disabled` = `#908d89` — a **product-scoped**
variable namespace absent from the Login 1 token list, and itself corroborating evidence for the
derived theme.

Mode divergence, as in Login 1: `get_design_context` shows fallbacks `#29076e` for
`color/palette/purple/900` and `#222` for `color/foreground/secondary/bold`, while
`get_variable_defs` resolves both to `#32005a`. **Bind the variable; never write either hex.**

**Spacing / size — every raw value resolved against the theme**

| Raw in design   | Where                                                       | Exact theme token                                                                                         |
| --------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `56px` gap      | headline ↔ content-inputs (`174:231462`)                    | `--sl-space-700`                                                                                          |
| `64px` gap      | field group ↔ checkbox group (`174:231466`)                 | `--sl-space-new-3xl` (= `--sl-space-800`)                                                                 |
| `24px` gap (×3) | `174:231468`, `174:231465`, `174:231966`                    | `--sl-space-new-xl` (= `--sl-space-300`)                                                                  |
| `16px` gap      | name row (`174:231587`)                                     | `--sl-space-new-lg` (= `--sl-space-200`)                                                                  |
| `16px` gap      | action pair (`174:232024`, `var(--space-new/lg)` in source) | `--sl-space-new-lg`                                                                                       |
| `4px` gap       | "Already have an account?" row (`174:231473`)               | `--sl-space-new-xs` (= `--sl-space-050`)                                                                  |
| `32px` gap      | footer links (`I174:231478;173:3540`)                       | `--sl-space-new-2xl` (= `--sl-space-400`)                                                                 |
| `10px` padding  | footer wrapper (`174:231478`)                               | `--sl-space-125`                                                                                          |
| `12px` radius   | outer frame (bound to `size/icon/font/xs`)                  | `--sl-size-borderRadius-xl` (12px)                                                                        |
| `24px` radius   | photo mask (`176:38387`)                                    | `--sl-size-300` (24px) — no 24px `borderRadius` token exists; the numeric `size` token is the exact match |

**Note on `size/icon/font/xs`.** Figma binds it to the frame's _corner radius_. The name says icon
font size; the value is 12. `--sl-size-borderRadius-xl` is also 12. Match on the **resolved value**,
never the name — `--sl-size-500` is 40px while Figma's `Size/500` is 20.

**Typography**

| Figma variable                         | Value | Theme                                                                           |
| -------------------------------------- | ----- | ------------------------------------------------------------------------------- |
| `size/text-new/heading/xl`             | `32`  | `--sl-text-new-heading-xl-fontSize` = 32px                                      |
| `size/lineHeight/500`                  | `40`  | `--sl-text-new-heading-xl-lineHeight` = 40px                                    |
| `text-new/typeset/fontWeight/semiBold` | `600` | `--sl-text-new-typeset-fontWeight-semiBold`                                     |
| `size/text-new/body/md`                | `14`  | `--sl-text-new-body-md-fontSize` = 14px                                         |
| `size/lineHeight/250`                  | `20`  | `--sl-text-new-body-md-lineHeight` = 20px                                       |
| `text-new/typeset/fontWeight/regular`  | `400` | `--sl-text-new-typeset-fontWeight-regular`                                      |
| `fontWeight/500`                       | `500` | `--sl-fontWeight-500` — backs "Already have an account?" (`New_Message:Medium`) |

**Diverges from Login 1:** that frame's headline used `heading/2xl` = 48; this one uses
`heading/xl` = 32 — one step down the scale.

> **`font:` shorthand is forbidden in this theme.** `--sl-text-new-heading-xl` and
> `--sl-text-new-body-md` **do not exist** as shorthand custom properties — only the
> `-fontFamily` / `-fontSize` / `-lineHeight` (and sometimes `-fontWeight`) longhands do. Writing
> `font: var(--sl-text-new-heading-xl)` makes the browser drop the whole declaration silently, so
> family, size and line-height are all wrong at once with no error anywhere. The Login 1 run shipped
> exactly this bug in `login-page.css` (three declarations). Use the longhands.
> The `heading-*` scale has **no** `-fontWeight` longhand; set weight from
> `--sl-text-new-typeset-fontWeight-semiBold`.

**Icons.** Two icon font families are bound on this frame — `text-new/typeset/fontFamily/icon` =
`Font Awesome 7 Pro` and `icon/typeset/fontFamily/classic` = `Font Awesome 6 Pro` (the latter absent
from Login 1). Neither is installable here. The only icon the design actually places is
`far-arrow-left`; the `teacher-assistant` theme registers **`arrow-left`** (one of 54 icons its
`icons.ts` provides, registered by `setup()`), so it renders bare. **No icon this design needs is
missing from the theme.**

**Other**

- `Large` drop shadow — five stacked `#3E5598` layers at 5/20/45/80/125 px offsets. Identical string
  to the Login 1 frame; a shared effect style. No matching `--sl-elevation-shadow-*` token exists
  (`overflow`, `overlay`, `sm` only).
- `opacity/interactive/plain/idle` = `0`, `opacity/interactive/bold/idle` = `0`.

---

# Component Decomposition (Stage 2)

## Component Tree

```
<sl-account-creation-page>              root — owns data + page chrome; registers itself (guarded)
  │  scopedElements = { 'sl-account-creation-form': AccountCreationForm, 'sl-button': Button }
  │  renders: 2 <img> (wordmark, photo) + <nav><ul> of 4 <sl-button fill="link" size="sm">
  └── <sl-account-creation-form>        presentational; owns the single <sl-form> + FormController
         scopedElements = { sl-button, sl-checkbox, sl-form, sl-form-field, sl-icon, sl-text-field }
         renders: 3 sl-form-field>sl-text-field, 3 sl-checkbox (as <li>), 3 sl-button, 1 sl-icon
```

Deliberately not components: the four footer links (`<ul>`/`<li>` from a root-internal constant),
the three consent rows (`<ul>`/`<li>` from a form-internal constant), the wordmark and photo
(static `<img>` in slots), the name row and action pair (CSS, not wrappers).

**Placement of the 13 SLDS instances:** 9 in the form (3 text fields inside 3 `sl-form-field`s,
3 checkboxes, 3 buttons), 4 in the page (footer links). `174:231461` is hidden and rendered by
neither.

## Shared Types / Contracts

```
AccountCreationFormValue   exported by sl-account-creation-form, consumed by the page
  { firstName?, lastName?, email?, acceptTerms?, acceptPrivacy?, acceptCookies? }
  All optional — matches FormController's partial value. Data + stable keys only.

LegalLinkId  = 'privacy-notice' | 'cookie-notice' | 'terms-of-user' | 'ai-transparency-statement'
             exported by sl-account-creation-page

SlAccountCreationFormSubmitEvent    = CustomEvent<AccountCreationFormValue>   form
SlAccountCreationFormCancelEvent    = CustomEvent<void>                       form
SlAccountCreationFormSignInEvent    = CustomEvent<void>                       form
SlAccountCreationPageSubmitEvent    = CustomEvent<AccountCreationFormValue>   page
SlAccountCreationPageCancelEvent    = CustomEvent<void>                       page
SlAccountCreationPageSignInEvent    = CustomEvent<void>                       page
SlAccountCreationPageLegalLinkEvent = CustomEvent<{ id: LegalLinkId }>        page
```

Root-internal, not contracts: `LegalLinkItem` + `LEGAL_LINKS` (page); `ConsentItem` +
`CONSENT_ITEMS` + `FIELDS` (form).

## Open questions and the defaults chosen by the orchestrator

The pipeline has no approval gate at this stage. **Twenty** open questions were raised — against
nine on the simpler Login 1 frame. Each default below was chosen by the orchestrator, not a human.

| #   | Question                                      | Default chosen                                                                                                                                                                                                                                                    |
| --- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Net-new primitives empty — expected?          | Confirmed; nothing to approve (same as Login 1 q1)                                                                                                                                                                                                                |
| 2   | Two components or one?                        | **Two.** Keeps the shape comparable with Login 1 and leaves exactly one scoped-registry edge — the thing this batch exists to measure. Counter-argument ("prefer the smaller tree") recorded.                                                                     |
| 3   | Consents pre-checked?                         | **Checked, verbatim.** Fidelity is the target and the pixel comparison needs the checked state. The legal objection is real but is a design question, not an implementation one.                                                                                  |
| 4   | Are the consents required to submit?          | **Not required.** Nothing in the design says so, and adding `required` would render `(required)` markers the design does not show. Continue does not gate on them.                                                                                                |
| 5   | Email placeholder reads "Enter your password" | **Verbatim.** A designer defect; reproducing the design is the measured objective. Recorded in the manifest.                                                                                                                                                      |
| 6   | Footer says "Terms of User"                   | **Verbatim.** Same reasoning as q5.                                                                                                                                                                                                                               |
| 7   | Footer link semantics: button or anchor?      | **`<sl-button fill="link" shape="pill" size="sm" variant="primary">` per Code Connect**, click emits `…-legal-link`. Diverges from Login 1's `<sl-link><a href="#">`; Login 1's anchors were fake navigation anyway. The a11y tradeoff goes to Stage 6 as a note. |
| 8   | Links inside the consent labels               | `<a href="#">` inside the label, with the click handler calling `stopPropagation()` so it does not toggle the checkbox. Targets are unknown, so `#`.                                                                                                              |
| 9   | Heading level                                 | `<h1>` — the component is the whole screen.                                                                                                                                                                                                                       |
| 10  | Consent group semantics                       | Plain `<ul>`; each `sl-checkbox` self-labels. No `aria-label` invented, because the design shows no group label.                                                                                                                                                  |
| 11  | Heading: slot or property?                    | **Slot with default content** matching the design — same answer as Login 1 q6, so the two runs stay comparable.                                                                                                                                                   |
| 12  | Re-emit the form's events at page level?      | **Re-emit.** Matches Login 1's root-re-emits pattern and gives a stable page API, at the cost of 7 event names.                                                                                                                                                   |
| 13  | What does "Go back" do?                       | Emit only; the host routes. (Login 1's answer for "Sign in".)                                                                                                                                                                                                     |
| 14  | Asset paths                                   | `./assets/wordmark.svg` and `./assets/hero.jpg` — Login 1's exact names, so both runs 404 identically and stay comparable.                                                                                                                                        |
| 15  | The `Large` drop shadow has no token          | Approximate with `--sl-elevation-shadow-overlay` + a comment naming the raw five-layer effect. Same default Login 1 chose. Never hardcode the layers.                                                                                                             |
| 16  | Photo mask radius (24px, no radius token)     | `--sl-size-300` — the exact value match. Same as Login 1. Using `borderRadius-xl` (12px) would halve a visible radius.                                                                                                                                            |
| 17  | Does the root mock empty or prefilled data?   | **Empty strings.** The screenshot shows empty fields with their placeholders visible; prefilling would hide the placeholders and break the pixel comparison. Consents still checked.                                                                              |
| 18  | Submit wiring                                 | Continue is `type="submit"` inside `<sl-form>`; validate with `reportValidity()`, then emit.                                                                                                                                                                      |
| 19  | Who paints the elevated frame?                | The root. Story uses `layout: 'fullscreen'`. Same as Login 1.                                                                                                                                                                                                     |
| 20  | `AccountCreationFormValue` optionality        | All-optional, matching `FormController`'s partial value. No separate submit type.                                                                                                                                                                                 |

## Divergence from the Login 1 reference run

**Agrees:** two-level page/form shape; footer links as a list not a component; wordmark and photo
as static assets (both 404, no export step); no net-new primitives; namespaced globally-unique
events with the root re-emitting; `heading` forwarded via `<slot name="heading" slot="heading">`;
single 1512px breakpoint; hidden node excluded.

**Diverges, deliberately:**

1. **Scoped registry.** Login 1's root declared only `'sl-link'` while rendering `<sl-login-form>`,
   and the child called `customElements.define` itself — so the child never upgraded inside the
   scoped shadow root. Here the root's map lists the child, and the child does not self-register.
2. **Footer uses `sl-button`, not `sl-link` + anchor** (Code Connect is explicit here).
3. **An action pair** (Continue + Go back) plus a Sign-in link row — three form events, not one.
4. **A consent group** with rich link-bearing labels, which Login 1 had no analogue for.
5. **Typography one step down** — `heading/xl` 32/40 vs Login 1's `heading/2xl` 48/48.
6. **No token approximation needed.** Login 1 logged five unbound values and adopted a
   "nearest token + TODO" policy; here every raw value resolved exactly. Only the drop shadow
   genuinely lacks a token.
7. **`font:` shorthand banned outright** — Login 1's `login-page.css` shipped three silently
   dropped `font: var(--sl-text-new-*)` declarations.
8. **Icons inverted vs. the conventions** — `arrow-left` bare, no `Icon.register`, no
   `@fortawesome/*`; the theme's `setup()` already registered it.
