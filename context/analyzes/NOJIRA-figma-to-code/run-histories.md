# Run histories

One record per reference run. [`batch-findings.md`](batch-findings.md) carries what generalises
across runs; this file carries **what each run individually showed**, so a finding can be traced to
its source and a run can be re-read without reconstructing it from a conversation.

The authoritative artifacts are in `runs/2026-10-01-<slug>/` — manifest, every raw Figma call,
reference screenshot, build captures with their JSON reports, `progress.json`, and a `generated/`
snapshot. **These summaries are a distillation of each run's own report; where detail is thin it is
because the run's notification carried less, not because less happened.** The transcripts hold the
full reports and are not in the repository.

Ordered as run, not alphabetically — the order matters, because later runs knew things earlier ones
discovered.

---

## A9 SANNA `Login 1` — the smoke run

**894 nodes · `teacher-assistant` · 372,844 tokens · ~27 min · Stages 1–3**

The reconnaissance run, executed before any rule existed. Code Connect resolved; `hasTemplate:
false` appeared and had to be explained by hand. Stage 4 blocked on the environment, not the
pipeline — no Font Awesome credential, and a partial install.

**Only this run showed:** that nine decomposer open questions is _not_ a floor. Every later run
produced 11–32, and A9 is the sole run that executed without the hints. It asked fewer questions
because it noticed less, which is why its nine is the outlier of the whole corpus rather than its
baseline.

It also shipped the defect that defined the batch's main theme: a story importing its component
with `import { type LoginPage }`, erased at transform time, so `customElements.define` never ran
and the page rendered an unregistered element. Type check clean, nothing on screen.

## A8 NSP `Group list`

**620 nodes · derived `max`, captured under `sanoma-pro` · ~572k · ~48 min · all six stages**

**Only this run showed:** that a Code Connect snippet can be valid and wrong with authority. Node
`334:20593` mapped correctly to `sl-avatar` and carried `display-name="7 students already joined"`
— the Figma **layer caption** leaking into an instance property. Reproduced faithfully, every
avatar on the screen wears the roster text.

It also produced the batch's first `{}`-versus-per-node discrepancy: the whole-subtree map returned
nothing while the same ids returned real mappings individually. And it is the run whose implementer
wrote a `.d.ts` stub to make the type check pass — which, read correctly, is a finding about a gate
that could not be satisfied honestly rather than about the run.

Captured under a theme guessed from the team label. Its colour measurements describe `sanoma-pro`;
the design is `max` at 17/17. Recorded in its `progress.json` rather than left standing.

## B-NSP `home`

**464 nodes · `sanoma-learning` 21/21 · ~277k reported · ~61 min · all six stages**

**Only this run showed:** that `ScopedElementsMixin` on a root turns globally-registered children
inert. The page painted, reported a healthy box, and its navigation and every card were unknown
elements inside the root's private registry — 120px tall, `tsc` clean, capture verdict `rendered`.
That observation is what forced the render verdict to descend into shadow roots.

It also disagreed with its sibling A8 on the theme and was right to: two NSP designs, two themes,
which killed the per-team mapping.

## A1 Kampus `Subchapter feed`

**1,803 nodes, 83 component types · `kampus` · ~2.02M, 21 spawns · ~122 min · 5 of 6 stages**

The most expensive run in the batch and the richest design. Nine components. Stage 4 reached the
three-iteration cap with a handoff note and nine unfixed critical items, all accessibility.

**Only this run showed:** that the Code Connect map can be **completely empty** — not `null`, not
`hasTemplate: false`, nothing — for the root and all ten distinct instances, so every component
identification was an unverified inference. The implementers then rejected `sl-card`, `sl-tag`,
`sl-tree`, `sl-tool-bar`, `sl-breadcrumbs` and `sl-toggle-group` on inspection, each with a concrete
API reason, and rejecting `sl-toggle-group` cost the run its keyboard semantics twice.

It ran before the icon rule existed and **hand-drew five toolbar glyphs**, which makes its toolbar
not comparable with any other run — the clearest cost of starting a batch before its rules are
known.

## A4 Sesame `My Groups`

**822 nodes · ran under `itslearning`; later evidence says `my-digital-book` · ~287k · ~164 min**

**Only this run showed:** a root re-rendering **301 times per click**, freezing the tab — a new model
object literal per render plus identity-based selection. Static capture passed, `tsc` passed, Stage
4 said `MATCH`. Only Stage 5's interaction attempt caught it.

Its analyst **invented four token names that do not exist**, broadcast mid-Stage-3 and corrected. It
also found `--sl-elevation-shadow-sm` malformed in `itslearning` (two offsets, no blur, painting a
hard slab) and `sl-avatar` cutting a clip-path hole for a badge that does not paint.

Fifteen open questions — the lowest of any run after A9.

## A11 Sesame `Learning materials`

**395 nodes, 360px wide — the only mobile case · 11 open questions · all six stages**

**Only this run showed:** what the pipeline does at phone width. The answer is that it treats 360px
as a narrow desktop; the decomposer's responsive default is "fixed at the single breakpoint the
manifest states", and nothing in the output adapts.

Its recorded theme, `itslearning`, **was never derived** — `theme-match` returned `best: bingel-dc`
on a ranking where every theme scored zero, i.e. alphabetical first. That is the run that exposed
the tool returning a name on no evidence.

## B-Itsl-Collab `Add element [3rd implementation]`

**458 nodes · `itslearning` · ~828k · ~56 min · all six stages · 22 open questions**

**Only this run showed:** that a theme can name a font it never loads — `--sl-text-new-*-fontFamily`
resolving to `'Open Sans'` while the Typekit serves only Lato, with `sl-panel` rendering correctly
beside it through the older namespace. That is the observation that eventually became the
corrected D2, after a second run measured the font family rather than inferring it.

It also caught a sibling run leaking `TS4114` errors into its own shared-tsconfig gate — runs
failing each other — and reported that `_runs/` being gitignored means **no lint or format gate ran
for any run in the batch**.

## B-Itsl-Bookmk `course files`

**478 nodes · `itslearning` · ~1.0M · ~88 min · all six stages · 19 open questions**

**Only this run showed:** two defects that no image could catch. `Intl.DateTimeFormat` with no
`timeZone` over a date-only ISO string rendered **04/04/2024 in `America/New_York`** — the exact
off-by-one the decomposer chose ISO + `en-GB` to avoid, reintroduced at the formatting end. And
`aria-sort` announcing an order the component never applied, in the one capability the
`sl-grid` → `<table>` substitution existed to hand-reproduce.

Its analyst wrote a truncation comment into `figma-design-context.md` — a file whose purpose is to
be verbatim — and the implementer was left with no per-cell geometry until the run re-fetched it.

## B-SANNA `Account creation`

**506 nodes · `teacher-assistant` 16/16 · ~235k · ~100 min · all six stages · 20 open questions**

**Only this run showed:** that hint 4 was insufficient as written. The implementer used a **value**
import, not a type-only one, and the story still rendered nothing — the binding was used only in a
type position (`Pick<Page, …>`) so the compiler elided it anyway. Only a separate bare
`import './x.js';` is reliable.

Three Code Connect snippets arrived valid and wrong: `placeholder="[object Object]"` on three text
fields, a `checked` checkbox with its entire rich label dropped, and `far-arrow-left` where the
theme registers `arrow-left`.

Stage 4 found **zero** layout, spacing or colour defects — every coordinate and gap exact. The only
real defect was upstream: three `teacher-assistant` tokens hardcoding an unshipped `'Open Sans'`.

## B-Itsl-Course `course files`

**519 nodes · `itslearning` 0.941 by hex · 280k · all six stages · 31 open questions**

The case that reframed the whole effort. **Zero Code Connect mappings**, proven rather than
inferred: sixteen calls covering the subtree, every top-level instance and every main-component
definition, plus a `get_design_context` response with no `<sl-*>` element in 1,217 lines. The design
is drawn against itslearning's own library and its variables are a different vocabulary entirely.

**Only this run showed:** that Stage 1 **halts permanently** on such a design. `BLOCKED_ON_CODE_CONNECT`
was returned correctly and its remedy — "publish mappings and re-run" — can never apply. The run
continued only because its coordinator overrode the rule.

It also asserted `--sl-color-background-plain`, a token that does not exist, and carried it into
three implementer briefs before the implementers caught it by hand. And it shipped a page that
wired **no event handlers at all** — every control inert, with `tsc`, tokens and a still capture all
passing.

## B-Kampus `Notes panel`

**1,038 nodes · `kampus`, agreement 0.42, `confident: false` · ~722k · all six stages**

**Only this run showed:** the first real palette-reachability number. Of **14 distinct colours, 5
have an exact token and 9 have none**; the largest unavoidable delta is 31.8 RGB. Exact colour
fidelity is unreachable for this design by construction, and the residual belongs to the
design-theme pairing rather than to the run.

It is also the run that demonstrated both sides of the hardcoding problem in a single turn:
`inline-size: 420px` fitted to a measurement, and a refusal to pad a pill whose 18px deficit it had
traced to the missing webfont. The difference was whether the cause had been identified.

Its decomposition overlaps A1's — the same Figma file — and both minted `sl-kampus-left-toolbar`
from the same source component with different APIs.

## A2 NSP `class overview` — the scale case

**10,936 nodes · `sanoma-learning` 21/21 · ~1.24M · 54 min · all six stages · 32 open questions**

**Only this run showed:** that the pipeline does not break at scale — **it succeeds with almost
nothing**. `get_metadata` on the root returned **27 nodes in 9 seconds** because it stops at instance
boundaries, and `get_design_context` on the grid holding ~10,000 of them returned 5.7 KB whose
entire body is `<sl-grid></sl-grid>`. Code Connect collapsed 91% of the design into one empty
element.

`forceCode: true` returned a **byte-identical** payload — it is substitution, not a size guard.
Expanding costs ~233k tokens for that one node and **loses every mapping**. Authority or detail,
never both.

It produced a new `nothing-rendered` variant: two components whose stories carried the correct bare
side-effect import still failed, because the module contained no `customElements.define` at all.

It is also the run that caught `check-tokens.mjs` reporting `tokensReferenced: 0, clean` on a tree
using 32 tokens.

## B-Itsl-Bookmk `Deleted course - content`

**885 nodes · `itslearning` 0.941 · 312k · all six stages · 20 open questions**

Stopped by the account quota at Stage 3 with all four leaf implementers dying in the same minute,
then resumed from its own transcript and completed — the resume design's first real test.

**Only this run showed:** that the decomposer **reads component sources and rejects them on
evidence**. It rejected `sl-breadcrumbs` (renders no trailing chevron after a single crumb), the
`sl-paginator` trio (wrong status string, an unwanted visible label) and `sl-grid` (virtualised,
needs a `ListDataSource`) — all valid-but-wrong identifications from the manifest, caught only
because the prompt required source verification.

It also negative-controlled `check-tokens.mjs` by injecting a fake token, rather than trusting a
clean verdict.

## A6 Itsl-Collab `Shared folder - teacher view`

**859 nodes · `itslearning` 0.875, margin 13.9 · ~875k · ~57 min · all six stages · 31 open questions**

All seven leaf implementers died on a quota in parallel, costing **≥245,000 tokens for nothing**;
the run completed Stages 3–6 directly rather than waiting.

**Only this run showed:** the clearest answer to the overlap question. Keyed on **source component
ids**, 15 of its 32 are shared with `b-itsl-collab-add-element` and 15 of that run's 16. Both frames
hold the _same_ `Navigation` component. `NavLink`, `NavUser`, `TopNavModel` and `CourseTab` are
**field-for-field identical** and could share one implementation today; `PageHeader` genuinely
disagrees but **reconcilably** — one baked two named buttons, the other exposes `slot="actions"`,
which is what Figma itself models.

It is the run that found `typecheck.mjs` certifying 125 real errors as clean.

## B-Sesame `Group details`

**950 nodes · `my-digital-book`, `confident: false` · ~58 min · all six stages · 17 open questions**

**Only this run showed:** that A4's and A11's `itslearning` was never derived, by finding which of
the file's hexes actually discriminate — `#bfbfbf`, `#323232`, `#9d9f9f` are declared by
`my-digital-book` and no other theme, and on the four hexes carrying signal the score is
**4/4 against 0/4**. One of them is named `Neutrals/$kampus-color-gray-1`: a Kampus token pasted
into a Sesame file.

Its reference came back **934×1280 for a 1280×2392 frame** — a 53.5% downscale plus 249px of canvas,
which is what revealed that `get_screenshot` does more than bleed a few pixels.

It disclosed that it had **fabricated** a cost figure and replaced it with a measured one. And it
found `sl-tab::part(wrapper)` naming a part that does not exist — dead CSS that the type check, the
token check and the capture all pass.

Three frames of one file now exist, and all three `AppHeader` implementations are mutually
incompatible **with no symptom**, because their namespaces differ — worse than the Kampus pair,
which at least collided detectably.

## A3 Bingel `Chapter / Digital Exercises`

**2,147 nodes · `bingel-int`, tie broken on size tokens · 521,378 measurable · ~72 min · 21 open questions**

**Only this run showed:** that colour is not always the deciding evidence for a theme. Its 10 colour
tokens tied `bingel-dc` and `bingel-int` exactly; three size tokens separated them 3:0. It also
identified the product: the frame carries the Bingel wordmark and "Uitgeverij VAN IN", so the
corpus's "MyPortal" is Bingel.

Its reference came back at **exactly half brightness** — per-channel max 128, dominant colour
`(128,128,128)` doubling to white. The fourth and most dangerous `get_screenshot` distortion,
because the image still looks like a page.

Three Stage 4 deltas traced to **one cause**: shadow roots do not inherit a border-box reset, giving
`56+12+12=80`, `1440+24+24=1488` and `240+24+24=288`. Fixed at the cause, all exact afterwards.

Its root wired **zero** listeners — the second instance of a page inert while every leaf works.

## A10 ETSL `FAM - Users`

**1,512 nodes · `editorial-suite` 6/6 · ≥473,755 · ~14 min · all six stages · 14 open questions**

**Only this run showed:** that theme derivation is **per frame, not per file**. Its result
contradicted A5 from the same file, and rather than report a contradiction it probed the mechanism
and confirmed **Figma variable modes**: node `17264:29099`, the same top-nav component present in
both frames, resolves `color/background/primary/bold` to `#137271` inside A10's frame and `#3366ff`
inside A5's, with ten of twelve shared tokens byte-identical and only the two discriminating ones
differing.

It established the `::part()` specificity hazard reproducibly — an outer declaration beating the
component's own `:disabled` rule, so both paginator arrows would have painted the enabled grey.

It corrected the font claim: `editorial-suite`'s Typekit genuinely serves Raleway and Roboto and the
legacy tokens name them correctly, so only the new namespace is broken. That is why it could not
blame a 0.86px text overflow on a missing webfont — and refused to close it with a padding tweak.

Its implementer **corrected its own brief four times** and was right four times.

## A7 Bingel `Materials / Overviews`

**974 nodes, 64% override — the highest measured · `bingel-int` inherited · 464,798 · all six stages**

**Only this run showed:** that the override rate measures nothing here. **Zero of 21 Code Connect
probes resolved**, so the mapping layer expressed nothing about any of 57 live instances, and a 64%
and a 0% override rate would have produced an identical run.

The structural evidence it did find came from metadata: a detached `sl-select` tree container, 4 of
11 nav icons hand-built, **21 badge wrappers for 20 badges** with the extra one on the only active
row, and one icon concept rendered three ways — 12 `sl-icon`, 7 `<img>`, 37 bare glyph nodes.

It recorded its theme as having 34 icons where it has **54** — the same quoted-key grep error
another run made — and that wrong inventory propagated from a Stage 1 artifact into five components
and survived to Stage 6.

It **retracted both of its own original arguments** for `bingel-dc` on examination.

## A5 ETSL `Metadata usage widget`

**1,856 nodes · captured `editorial-suite`; derived `sanoma-learning` 14/14 · 297k · all six stages · 16 open questions**

Stage 4 reached `MATCH` with body height corrected from 2227 to **2032, exactly the design**.

**Only this run showed:** that the same evidence supports opposite conclusions depending on the
theme. Four colours it flagged as genuinely unbound read as design drift under the assigned theme
and as correct tokenisation measured against the wrong one. A10 later proved both readings right
for their own frames.

It found `sl-panel` growing its header instead of its body — `[part=header]` has `flex: 1` with no
grow on the body, producing a 354px grey header — and `sl-progress-bar` shipping a `font:` shorthand
against a token this theme lacks.

Its Stage 4 rework round was blocked indefinitely on the subagent pool until redirected; doing it
directly took minutes.
