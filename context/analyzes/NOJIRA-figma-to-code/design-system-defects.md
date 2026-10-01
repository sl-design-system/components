# Design system defects found by the batch

Everything here is a fault in the **design system or its themes**, not in the pipeline that found
it. Separated out because the audience is different: this is the list to take to the design system
team and to designers, and none of it depends on caring about Figma-to-code automation.

Found while running fourteen reference designs through the `implement-design` pipeline on
2026-09-30/10-01. Each entry says how it was verified, because several of these look like design
decisions until you check.

Companion documents: [`batch-findings.md`](batch-findings.md) is the evidence and reasoning;
[`pipeline-defects.md`](pipeline-defects.md) is the separate list for the skills themselves.

---

## D1 — Six components have dead typography, in every theme

**`sl-checkbox`, `sl-emoji`, `sl-popover`, `sl-progress-bar`, `sl-radio-group`, `sl-tag`.**

Each writes a `font:` shorthand against a bare `--sl-text-new-*` family that **no theme declares**
— only the longhands (`-fontFamily`, `-fontSize`, `-lineHeight`, sometimes `-fontWeight`) exist.
An undefined `var()` inside a shorthand makes the browser drop the **entire declaration**, so each
renders with no font family, size or line height of its own.

Identical across all five themes checked (`editorial-suite`, `itslearning`, `kampus`,
`sanoma-learning`, `teacher-assistant`), so it is not a theme gap — it is six components written
against a token that was never there.

`sl-checkbox` and `sl-radio-group` guard the reference with an older namespace:

```css
font: var(--sl-text-new-body-md, var(--sl-text-body-md-normal));
```

**The guard does not help.** `--sl-text-body-md-normal` is declared zero times in any theme, so
both names are undefined and the declaration drops anyway. Defensive code written against a second
token that also does not exist reads as more careful than the unguarded version and behaves
identically.

Verify:

```sh
node runs/harness/check-tokens.mjs --scope packages/components/checkbox/src --theme sanoma-learning
grep -rE -- "--sl-text-new-body-md\s*:" packages/themes/*/theme.css   # zero hits
```

**Why nobody caught it:** stylelint does not resolve custom properties, TypeScript never reads
CSS, and the result looks like a styling choice rather than a fault.

## D2 — Themes name their font under a name the font provider does not register

**Corrected 2026-10-01.** An earlier version of this entry said the themes ship no `fonts.css` and
therefore load no font. That is the wrong diagnosis and would have sent someone to write a file
that is not needed. The font loads. **The theme asks for it by a name that does not exist.**

Typekit registers families under lowercase hyphenated names. `packages/themes/kampus/theme.css`
contains **both spellings**:

| Spelling      | Occurrences | Resolves |
| ------------- | ----------: | -------- |
| `'Open Sans'` |          29 | **no**   |
| `'open-sans'` |          18 | yes      |

Measured in the browser, not inferred: a string set in `'Open Sans'` renders **218.5px wide**,
identical to the same string in a deliberately nonexistent family; in `open-sans` it renders
**247.4px**. The twenty-nine are the broken ones, and they are the whole `--sl-text-new-*`
namespace — so **every element styled with the current token set renders in the fallback serif**,
while the older `--sl-*` namespace beside it works.

`itslearning` has the same shape: 29 × `'Open Sans'` against 18 × `Lato`, where the kit serves
Lato and the design's own font is Lato.

**The fix is a spelling change in the theme**, not a new asset. That is a much cheaper repair than
the one the earlier diagnosis implied, and it is worth checking every theme for the same pair —
the broken spelling sits in the newer namespace in both files examined, which suggests it entered
with the new token generation rather than being a one-off.

Until it is fixed, the corollary for guidance stands and is worth stating plainly to anyone
writing implementation rules:

> Following the current token guidance produces **worse** fidelity than ignoring it. A component
> that writes the family from the design renders correctly; one that uses the semantic token
> renders serif.

## D3 — The Figma size scale and the theme size scale disagree under the same names

`--sl-size-500` is **40px**. Figma's `Size/500` is **20**. A run mapped one to the other by name
and shipped a 2× padding defect; the type check and the linter had nothing to say about it.

This is the most dangerous kind of naming collision, because the names agree and only the values
differ, so the error survives review by anyone who knows both systems and assumes they align.

Either the scales should be reconciled, or the Figma scale should be renamed so that a by-name
mapping fails loudly instead of silently.

## D4 — Token semantics differ per theme under the same name

`--sl-size-borderWidth-default` is **2px** in `itslearning` and 1px elsewhere. Two implementers
discovered this independently, on different runs, both expecting a hairline.

Not necessarily wrong — a theme may legitimately want heavier borders — but it means
"`borderWidth-default`" cannot be used as shorthand for "a hairline" in any guidance or any
component, and the themes should be audited for other names whose meaning shifts.

## D5 — `sl-panel` grows its header instead of its body

`[part=header]` has `flex: 1` with no grow on the body, so a panel stretched to fill its container
grows the **header**. On A5 that produced a 354px grey header above a normal-sized body.

## D6 — `sl-avatar` cuts a hole for a badge that does not paint

The avatar cuts a `clip-path` hole sized for its badge regardless of whether the badge renders.
`size="sm"` badges are transparent by rule, so the circle came away with a white bite taken out of
it. Reproduced on A4.

## D7 — `--sl-elevation-shadow-sm` is malformed in `itslearning`

Two offsets and no blur radius, which paints a hard grey slab down the right edge of any card
using it, instead of a shadow.

## D8 — `sl-grid` cannot be matched to a design through its public API

Three separate runs rejected `sl-grid` and hand-built a `<table>` instead, each with a concrete
reason:

- no public hook for head-cell or selected-row background — **its own styling story reaches into
  private `--_` properties**, which is the clearest possible signal that the public API is short;
- it force-opens its own bulk-actions popover with no opt-out;
- `GridSelectionColumn` hard-codes its `aria-label`s, so they cannot be localised or corrected;
- it is virtualised and requires a `ListDataSource`, which is a large commitment for a static
  four-row table.

Every substitution then had to hand-reproduce accessibility the component would have provided, and
one of them got `aria-sort` wrong — announcing an order the table never applied. **The component's
API gap converted directly into an accessibility defect downstream.**

## D9 — `sl-badge` grey-bold is invisible in Kampus

It resolves to the exact colour of the pill it sits inside. Not broken, not visible.

## D10 — Code Connect snippets carry Figma authoring artefacts

Where Code Connect resolved, two runs received snippets that were valid and wrong:

- `<sl-avatar display-name="7 students already joined">` — the **Figma layer caption** leaking into
  an instance property. Reproduced faithfully, every avatar on the screen wears the roster text.
- `placeholder="[object Object]"` and `value="[object Object]"` on three text fields, and an
  `<sl-checkbox checked>` with its entire rich label dropped.
- `<sl-icon name="far-arrow-left">` where the theme registers the bare name `arrow-left`.

These are worth taking to whoever maintains the mappings: a wrong mapping is more expensive than a
missing one, because it is delivered with authority and nothing downstream questions it.

## D11a — A token's value depends on an ancestor attribute nobody sets

In `kampus`, `--sl-label-md-fontSize` resolves through a `-userGroup` indirection declared under
`[data-user-group='early' | 'developing' | 'advanced']`, with `superuser` on bare `body` — a
reading-level font-scaling system. A consumer that does not set the attribute gets whichever
unconditional declaration wins the cascade, ~12px where the design expects 18.

The same file declares **914 of 1,655 properties with more than one distinct value**. Most are
responsive variants, which is legitimate; the user-group axis is the one that silently depends on
markup outside the component.

Worth deciding deliberately: either the default is a documented reading level, or the tokens
should not resolve at all without the attribute. Today a consumer gets a value that looks
plausible and is not the one any design was drawn against.

## D11b — The older size namespace collapses without a `[data-user-group]` ancestor

Widening D11a: it is not one token. In `kampus` the **entire** older size namespace indirects
through a `-userGroup` layer declared only under `[data-user-group='early' | 'developing' |
'advanced']`, with `superuser` on bare `body`. A consumer that does not set the attribute gets the
unconditional declaration — measured at **12px where the design expects 18**, which shipped as
12px card titles until Stage 4 caught it.

## D11 — The toolchain cannot lint or format what it is supposed to

`eslint-plugin-lit` and `stylelint-config-standard` are **absent from `node_modules`**, so neither
linter runs in a fresh checkout. `tsc` is the only automated quality gate that actually executes.

Separately, `packages/components/grid/src/grid.ts` has **two type errors committed upstream**
(`TS2322`, `number` vs `Timeout`, lines 1180 and 1361), so `tsc -p examples/lit/tsconfig.json`
cannot exit 0 on a clean tree. Any process that defines a gate as "type check passes" is
unsatisfiable here until that is fixed.

---

## For designers, not for engineers

## D12 — Most of these designs are not built from the design system

Across ten measured designs, Code Connect resolved on **four**. The other six are drawn against
other libraries — itslearning's own Web UI kit, Kampus's legacy Figma library — and their Figma
variables use a different vocabulary entirely (`$gray--900`, `Size/300`, `$brand--700`, `Lato`).

One design, B-Itsl-Course `course files`, has **zero** mappings: proven by sixteen calls covering
the subtree, every top-level instance and every main-component definition, plus a
`get_design_context` response with no `<sl-*>` element in 1,217 lines.

This is not a criticism of those teams — it is the actual state of the estate, and it decides what
any automation can do for them. **A design that uses none of the design system cannot be
"mapped" to it; it can only be ported.** Those are different jobs with different success criteria,
and conflating them would produce tooling that serves neither.

## D13 — The library percentage in Figma does not mean what it looks like

The corpus survey recorded `libraryPct: 96` for a design with **zero** design-system components.
The metric counts instances from _a published library_, not from _ours_. Any conversation that
uses it as a proxy for design system adoption is measuring something else.
