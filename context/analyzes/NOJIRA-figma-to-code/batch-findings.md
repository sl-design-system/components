# Batch reference run — findings across designs

Companion to [`smoke-run-findings.md`](smoke-run-findings.md), which covers the single first run.
This file collects what only shows up **across** runs: what generalises from the simplest screen,
what turned out to be specific to it, and what no single run could have revealed.

Each entry names the evidence it rests on.

**Three documents, three audiences.** This one is the evidence and the reasoning — read it when
you want to know why something is believed. Two companions turn it into work:

| Document                                               | Audience                                      | Contains                                                                |
| ------------------------------------------------------ | --------------------------------------------- | ----------------------------------------------------------------------- |
| [`design-system-defects.md`](design-system-defects.md) | design system team, designers                 | faults in the components and themes themselves, with how to verify each |
| [`pipeline-defects.md`](pipeline-defects.md)           | whoever writes the next version of the skills | what the pipeline must change, and which requirement each maps to       |

Nothing in those two depends on this one; they are written to be handed over on their own.

---

## A design with no design system in it

**Case B-Itsl-Course `course files`** has **zero** Code Connect mappings. Not "some unmapped
nodes" — none, anywhere. It is drawn against itslearning's own internal component library.

The evidence is unusually complete, because the analyst was told to prove it rather than infer it:

- `get_code_connect_map` returned `{}` on the whole subtree, on all **7** top-level instances, and
  on **8** underlying main-component definitions queried by id (Button, Avatar, Select, Status Tag,
  Cell, Pagination, Banner, PageHeader);
- `get_design_context` renders the frame as plain `<div>`/`<p>`/`<img>` with **zero** `<sl-*>`
  elements;
- no instance is named `sl-*`;
- the design's own variables are a different vocabulary entirely — `$gray--700`, `$brand--700`,
  `$pigeongrey--100`, `Size/500`, `Lato` — with no `--sl-` namespace anywhere.

### Why this matters more than one case

**The pipeline halts on it.** Stage 1's contract says unmapped component instances mean
`BLOCKED_ON_CODE_CONNECT`: stop, report the node list, ask a human to publish mappings. On this
design every instance is unmapped, so the correct behaviour under the current rules is to refuse
the design outright. It only proceeded here because the run's coordinator overrode the rule
deliberately. **A design that uses none of the design system is not a blocked run — it is the
second audience**, the one that needs its existing design ported as it stands.

That distinction has no representation in the pipeline. There is one path, and it assumes the
design is made of our components.

### It also validates a caveat, the expensive way

The corpus survey recorded `libraryPct: 96` for this design, and the caveat attached to that number
said: _"libraryPct means a published library, not necessarily ours."_ Here is the hard case. **96%
of this screen comes from a published library, and 0% of it is ours.**

So the metric the corpus was partly selected on cannot distinguish the two audiences, and the
sibling itslearning designs carry the same reading — `B-Itsl-Bookmk` at 100%, `B-Itsl-Collab` at
96%. Whether those are also entirely non-SLDS is being measured by the runs now in flight; if they
are, a substantial part of the "fidelity corpus" is measuring porting rather than mapping, and the
two must be scored separately.

### What it costs to find out

Sixteen `get_code_connect_map` calls to establish a negative. That is the honest price of the
distinction today, against a daily Figma limit of 600 calls — and it is a strong argument for
`T-NOJIRA-ds-conformance` producing this verdict **once per file, cached**, rather than every run
rediscovering it node by node.

---

## Success-shaped output that is not success

Four instances, in four different layers, in one night. None was caught by a gate; each was found
only because something rendered, measured or re-read the result.

| Layer                | What happened                                                                | What it looked like         |
| -------------------- | ---------------------------------------------------------------------------- | --------------------------- |
| Generated TypeScript | `import { type Thing }` is erased, so `customElements.define` never runs     | type check clean            |
| Generated CSS        | `font: var(--undefined)` — the browser drops the **whole** declaration       | no error anywhere           |
| Measurement tool     | `theme-match.mjs` resolved no indirection and still returned a ranking       | a confident-looking `0.48`  |
| Orchestration        | three coordinators ended a turn on a status line with Stages 4–6 unattempted | a plausible `progress.json` |

The common shape: **the failure mode of these things is a plausible value, not an exception.** That
is the argument for the verification chain being adversarial rather than confirmatory, and it
applies directly to the fidelity score, which is another artifact whose broken state is a number.

The orchestration case is a gap in the skill rather than in the model: it says how a coordinator
spawns stage agents and routes work back, and nothing about what a coordinator does while a child
is working. Given no instruction, "I am waiting" reads as a complete answer.

---

## Decomposer open questions: nine was the outlier, not the floor

An earlier version of this section claimed the count scales with screen size. **It does not**, and
the fuller data says something more useful.

| Case                            | Nodes | Component types | Open questions |
| ------------------------------- | ----: | --------------: | -------------: |
| A11 Sesame `Learning materials` |   395 |              13 |             11 |
| B-Itsl-Collab `Add element`     |   458 |              40 |             22 |
| B-NSP `home`                    |   464 |              32 |             32 |
| B-Itsl-Bookmk `course files`    |   478 |              43 |             19 |
| B-SANNA `Account creation`      |   506 |              23 |             20 |
| A8 NSP `Group list`             |   620 |              34 |             30 |
| A4 Sesame `My Groups`           |   822 |              39 |             15 |
| B-Itsl-Bookmk `Deleted course`  |   885 |              58 |             20 |
| **A9 SANNA `Login 1`**          |   894 |              32 |          **9** |
| A1 Kampus `Subchapter feed`     |  1803 |              83 |             30 |

Sort by nodes and the question count does not follow: the largest screen (1803 nodes, 83 component
types) and a screen a quarter its size both produced 30. The smallest produced 11. **Screen size
does not predict how many decisions the pipeline makes unsupervised.**

What stands out instead is **A9 at nine** — the lowest count in the corpus, on the ninth-largest
screen. It is also the only run that executed before the four hints existed. The reading that fits
is uncomfortable: the first run did not ask fewer questions because its screen was simpler, but
because it **noticed fewer things worth asking about**. Nine was never a floor to extrapolate from.

For the variance budget this is worse than a clean scaling law would have been. A rule like
"questions grow with complexity" could be planned around. **Twenty to thirty silent decisions per
screen regardless of size, with no predictor**, cannot — which makes recording each question with
its chosen default a requirement of the method rather than a nicety.

## Themes cannot be mapped per team

Two NSP designs in this corpus resolve to two different themes — `max` (17/17 tokens) and
`sanoma-learning` (21/21). Both exact, both unambiguous, and a per-team mapping would have got one
of them wrong whichever way it was written. The theme belongs to the file, and it is derivable:
see [`runs/harness/README.md`](../../../runs/harness/README.md).

Two runs were captured before this was known, under themes guessed from the team label, and both
guesses were wrong:

| Run                             | Captured under    | Derived               | Evidence                                         |
| ------------------------------- | ----------------- | --------------------- | ------------------------------------------------ |
| A8 NSP `Group list`             | `sanoma-pro`      | **`max`**             | 17/17 colour tokens                              |
| A5 ETSL `Metadata usage widget` | `editorial-suite` | **`sanoma-learning`** | 14/14; `editorial-suite` ranks joint 4th at 5/14 |

Both `progress.json` files record it rather than letting the numbers stand. Neither run switched
theme mid-flight, which was right: the theme is a recorded parameter of a run, not something to
change once captures exist.

The A5 case also explains something the run had already reported independently. Four colours it
flagged as genuinely unbound — `#006666`, `#02242E`, `#CA6F2A`, `#003D3D` — have no token in any
theme, and two more exist **only** in `sanoma-learning`. Under the assigned theme that reads as a
design drifting from the system; under the derived one it reads as a correctly-tokenised design
measured against the wrong theme. **The same evidence supports opposite conclusions depending on
a parameter nobody had checked**, which is the strongest argument in the batch for deriving it.

---

## Gates that do not apply to the thing they are gating

Three, and each looked like a passing gate rather than an absent one.

**The type check is shared, so parallel runs fail each other.** Every run compiles through one
`examples/lit/tsconfig.json`. A sibling's half-written component surfaced as `TS4114` errors inside
another run's gate and failed it on code that run never touched. The gate now attributes an error
to whichever run's directory it lives in, reports it, and charges it to nobody else. Worth stating
plainly: **the first version of this gate, written to stop runs routing around it, was itself a
mechanism for one run to break another.**

**Lint and format never ran at all.** Generated code lands in `examples/lit/src/_runs/`, which is
gitignored, so the pre-commit hook that formats and lints every other file in the repository skips
it entirely. `eslint-plugin-lit` and `stylelint-config-standard` are not installed either. Every
convention the reviewer checks by reading, the toolchain could have checked mechanically — and did
not, for any run.

**The theme ships a font it never loads.** In `itslearning`, `--sl-text-new-*-fontFamily` resolves
to `'Open Sans'`, while the theme's Typekit delivers only `lato`. Token-correct markup therefore
renders in the browser's default serif, beside `sl-panel`, which uses the older
`--sl-text-fontFamily: Lato` and renders correctly. The Figma design's own font is Lato.

That last one deserves care, because it inverts the usual advice: **following the token guidance
produces worse fidelity than using the raw value from Figma.** The same fault appeared
independently in `sanoma-pro`. A bench that scores "uses the right token" and a bench that scores
"looks like the design" disagree here, and the disagreement is the theme's fault rather than the
run's.

### A corollary about token searches

Two runs independently reported a missing token that existed: `--sl-elevation-surface-raised-default`
(`#ffffff`), missed because both swept only `--sl-color-background-*`. **A namespace-scoped search
manufactures phantom gaps** — the token was in a different namespace because it carries a different
meaning, which is exactly when a search by prefix fails. Hint 3 told runs to search before
declaring a value unbound; it now has to say search _by value_, not by name.

---

## What the batch covered, and what stopped it

Fourteen of nineteen designs were attempted. **Nine completed all six stages**; four stopped on the
account's weekly usage limit, not on anything in the pipeline; five were never launched when the
limit arrived.

| Outcome                     | Cases                                                                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Six stages complete         | A1 Kampus · A4 Sesame · A8 NSP · A9 SANNA · A11 Sesame · B-Itsl-Bookmk `course files` · B-Itsl-Collab · B-NSP `home` · B-SANNA |
| Stopped on quota, resumable | A5 ETSL (Stage 4) · B-Itsl-Bookmk `Deleted course` (Stage 3) · B-Itsl-Course (Stage 3) · B-Kampus `Notes panel` (Stage 3)      |
| Never launched              | A2 NSP `class overview` · A3 + A7 MyPortal · A6 Itsl-Collab · A10 ETSL · B-Sesame `Group details`                              |

Every stopped run is promoted with its partial output, its blocker recorded in `progress.json`,
and a resume guard that fails if `HEAD` has moved. That design was written the night before the
batch on the argument that a stopped run must not have to repeat what already succeeded. It was
not a hypothetical twelve hours later.

**The one case the corpus most needed is among the missing.** A2 `class overview` has 10,936 nodes
— six times the largest design that did run — and it was scheduled last precisely because it was
expected to be the most expensive. Nothing here says what the pipeline does at that size.

---

## The pipeline's central premise holds for a minority of the corpus

Stage 1 is built on Code Connect: resolve the map, emit the snippets, treat unmapped instances as
a blocker. Across ten measured designs the map resolved **four** times.

| Code Connect result                          | Designs                                                              |
| -------------------------------------------- | -------------------------------------------------------------------- |
| Mappings resolved                            | A9 SANNA, B-SANNA, A8 NSP, B-NSP `home`                              |
| Literal `{}` everywhere, probed node by node | A1 Kampus, A4 Sesame, B-Itsl-Collab, B-Itsl-Bookmk ×2, B-Itsl-Course |

The empty cases are not a lookup failure. Those designs are drawn against **other** libraries —
itslearning's own Web UI kit, Kampus's legacy Figma library — and `get_design_context` returns
pages of markup with no `<sl-*>` element anywhere. For six of ten designs, **every component
identification the pipeline made was an unverified inference by a language model reading a
picture.** The authority the whole design rests on was absent.

Two further qualifications on the four that did resolve:

- **Subtree calls are unreliable where per-node calls work.** A8 got `{}` from the whole subtree
  and real mappings from the same ids individually; B-NSP saw subtree calls time out outright.
  Reading subtree emptiness as "unconnected" would have blocked two runs that were fully mapped.
- **Resolved does not mean correct.** B-SANNA received `placeholder="[object Object]"` on three
  text fields and a `checked` checkbox with its entire rich label dropped; A8 received an
  `sl-avatar` whose `display-name` was the Figma layer caption, _"7 students already joined"_.
  Reproduced faithfully, each is a defect delivered with authority.

---

## No theme loads the font it names

Checked in four themes, wrong in four.

| Theme               | Fault                                                                  |
| ------------------- | ---------------------------------------------------------------------- |
| `kampus`            | `--sl-typography-*-fontFamily` is `'Open Sans'`; no `fonts.css` at all |
| `itslearning`       | `--sl-text-new-*` is `'Open Sans'`; the Typekit ships only Lato        |
| `teacher-assistant` | three tokens hardcode `'Open Sans'`; `fonts.css` never loads it        |
| `sanoma-pro`        | names `'Open Sans'`, which is not shipped                              |

So **every text pixel the batch captured was rendered in a fallback face**, usually the browser's
default serif. Three designs name Lato as their own font, and two themes have a working Lato token
in the older `--sl-text-*` namespace, beside the broken new one.

Two consequences, and the second is the awkward one.

First, typography fidelity is not measurable today in any theme examined. Any text comparison
scores the fallback.

Second — **following the token guidance produces worse fidelity than ignoring it.** A run that
writes `font-family: Lato` from the Figma value renders correctly; a run that uses the semantic
token renders serif. A bench that scores "used the right token" and a bench that scores "looks
like the design" return opposite verdicts here, and the design system, not the run, is why. The
fidelity score has to be able to say _this run is correct and the output is wrong_, or it will
train runs away from tokens.

---

## Two frames from one file produced a colliding component

A1 `Subchapter feed` and B-Kampus `Notes panel` are different frames of the same Figma file. Both
decomposed the same shared chrome, and both minted `sl-kampus-left-toolbar` from the **same source
component** — with different APIs.

The conventions require a guarded registration (`if (!customElements.get(...))`). That guard turns
a duplicate definition from a thrown error into a **silent mis-render**: whichever file loads first
wins, and the second frame gets the first frame's component wearing its own attribute names.

This goes straight to the first goal — the design system team needing Figma and code to map
identically. **The pipeline has no notion that two runs might describe the same component**, and
the house style for safe registration is what hides the collision. One Figma component, two runs,
two incompatible implementations, no error.

---

## What only ran once, and only Stage 5 caught

Every static gate passed on all of these. They were found by interacting with the result.

- **A4's root re-rendered 301 times per click** and froze the tab — a new model object literal per
  render plus identity-based selection. `tsc` clean, capture clean, Stage 4 `MATCH`.
- **A date rendered 04/04/2024 in `America/New_York`** from an ISO date-only string — the exact
  off-by-one the decomposer chose ISO + `en-GB` to avoid, reintroduced at the formatting end.
- **`aria-sort` announced a sort order the component never applied**, in the one capability the
  `sl-grid` → `<table>` substitution existed to hand-reproduce.
- **A consent link inside a checkbox label toggled the checkbox** on Enter, and sat focusable
  inside an `aria-hidden` subtree.

A still screenshot cannot see any of them. Whatever the bench becomes, **a fidelity score built
only on pixels and the DOM would have passed all four**.

---

## Hint 4 was not sufficient as written

The rule said the story must import its component rather than type-importing it. B-SANNA followed
it with a **value** import and still got `nothing-rendered`: the binding was used only in a type
position (`Pick<Page, …>`), so the compiler elided it anyway.

Only a separate bare `import './x.js';` is reliable. Worth stating because it is the second time
the same defect survived its own fix — the hint was written from one instance and generalised one
step short of the rule that actually holds.

---

## Six shipped components have dead typography, in every theme

Found by building the token checker, not by any run — and verified by hand before being believed,
because the first version of the checker was wrong three times over.

`sl-checkbox`, `sl-emoji`, `sl-popover`, `sl-progress-bar`, `sl-radio-group` and `sl-tag` each
write a `font:` shorthand against a bare `--sl-text-new-*` family that **no theme declares**. Only
the longhands exist. An undefined `var()` in a shorthand makes the browser drop the whole
declaration, so each of these renders with no font family, size or line height of its own.

Identical in all five themes checked — `editorial-suite`, `itslearning`, `kampus`,
`sanoma-learning`, `teacher-assistant`. It is not a theme gap; it is six components written
against a token that was never there.

Two of them, `sl-checkbox` and `sl-radio-group`, guard the reference with an older namespace:

```css
font: var(--sl-text-new-body-md, var(--sl-text-body-md-normal));
```

The guard does not help. `--sl-text-body-md-normal` is declared zero times in any theme, so both
names are undefined and the declaration drops anyway. **Defensive code written against a second
token that also does not exist** reads as more careful than the unguarded version and behaves
identically.

This is why the checker had to learn about fallbacks before the finding could be stated. A
checker that ignored them would have convicted these two for the wrong reason, and a checker that
trusted them would have acquitted them for the wrong reason. Neither error is visible in the
output; both produce a confident-looking verdict.

### Why the batch found it and the design system did not

Nothing in the repository checks that a referenced custom property exists. Stylelint does not
resolve custom properties, TypeScript never reads CSS, and the rendered result is wrong in a way
that looks like a design decision rather than a fault. The bug is visible only to someone
comparing a component against a specification — which is exactly what a fidelity bench does, and
exactly what nobody was doing before.

---

## The largest design in the corpus: the pipeline did not break, it succeeded with almost nothing

A2 NSP `class overview`, **10,936 nodes** — six times the next largest — completed all six stages
in **54 minutes for ~1.24M tokens**. That is roughly three times A9's cost on a screen twelve
times the size, so cost does not scale with nodes either.

It does not scale because **the nodes never reach the pipeline**. `get_metadata` on the root
returned **27 nodes in 9 seconds**: it stops at instance boundaries. Around ten thousand of the
10,936 live inside a single `sl-grid-quick-grid`, and `get_design_context` on that grid returned
5.7 KB whose entire body is:

```html
<sl-grid></sl-grid>
```

**Code Connect collapsed 91% of the design into one empty element.** Three things sharpen it:

- `forceCode: true` produced a **byte-identical** payload — this is Code Connect substitution, not
  a size guard, and `forceCode` cannot override it. The lever would be `disableCodeConnect`.
- Expanding is the only alternative and costs ~932 KB ≈ **233k tokens** for that one node, a 163×
  inflation.
- Expanding **loses the mapping**: the expanded rows contain zero `<sl-*>` elements.

So the scale question has an answer, and it is not the one the batch was set up to find.
**Authority or detail, never both** — and at this size the pipeline takes authority and produces a
page with an empty grid in it, reporting success throughout.

That is the sixth instance of success-shaped output, and the largest in scope: not a dropped
declaration or an unregistered element, but nine tenths of a design.

A2 also produced a **new `nothing-rendered` variant**: two components whose stories carried the
correct bare side-effect import still failed, because the module contained no
`customElements.define` at all. Hint 4 covers the story side; nothing checks that the module
registers anything, and `tsc` is clean either way.

**32 open questions** — joint highest in the batch, tied with `b-nsp-home`, which is the sibling
frame of the same file and **24× smaller**. Whatever drives the count, it is not the design.

---

## A token can exist and still resolve to the wrong value

`check-tokens.mjs` asks whether a name is declared. Kampus shows that is not sufficient.

`--sl-label-md-fontSize` resolves through `--sl-label-md-fontSize-userGroup`, which is declared
four times under `[data-user-group='early' | 'developing' | 'advanced']` and once on bare `body`
for `superuser`. The theme implements a **reading-level font-scaling system**. Nothing in a
generated run sets that attribute, so the value lands on whichever unconditional declaration wins
the cascade — ~12px where the design expects 18.

The same file declares **914 of 1,655 properties with more than one distinct value**, mostly
mobile/tablet/desktop variants inside media queries.

So a token's resolved value is **not a property of the theme alone**; it depends on ancestor
attributes and viewport. A bench that resolves tokens statically — as both of this harness's
tools do — will be right about existence and wrong about value, and it will be wrong silently.
Worth stating before anyone builds a token-fidelity metric on top of a static resolver.

The same trap on the weight axis: `--sl-text-new-typeset-fontWeight-semiBold` resolves to **600**
where Figma says **500**. More dangerous than a size error, because the result merely looks
slightly heavy.

---

## The checker that proved it had not looked

A2 reported that `check-tokens.mjs` returned `tokensReferenced: 0, verdict: clean` for a tree
using 32 tokens. **The run was right and the tool was mine.**

The cause was a field that had stopped meaning what it said. A later patch made the collection
hold only _unresolvable_ references, so the count read zero whenever nothing was wrong — and
"zero referenced, clean" is indistinguishable from "scanned nothing". A nonexistent `--scope` also
threw rather than failing cleanly.

It now reports `filesScanned` and `referencesSeen` alongside `unresolvedReferences`, and has
verdicts for `nothing-scanned` and `no-tokens-referenced`. On A2: 19 files, 95 references, 0
unresolved. The code was always clean; the report could not prove it had looked.

This is the fourth measurement tool in this batch to fail by returning a plausible number, and
the first one caught by a run rather than by me. **A check must be able to prove it looked** — the
count of what it examined belongs in its output, not just the count of what it found.

---

## A design can sit between the ramp steps, which bounds what any score can mean

B-Kampus's active nav pill is `#7C51A9`. The nearest token, `purple-600`, is `#743CB4` (Δ≈25);
the next step up, `purple-500`, is `#8a4fce`, further away. **The design's colour lies between two
steps of the ramp, so no token hits it.** The highlight yellow does the same — `#FFEF99` in the
design against a `#FFF7C5` token — and so do several greys.

The run took the nearest token and recorded the delta rather than reaching for a raw hex. That is
the right call, and it has a consequence the bench has to absorb:

> For this design, **exact colour fidelity is unreachable by construction**. A correct
> implementation and a high-scoring one are different things, and a pixel score prefers the
> second.

It is also the measured consequence of something already flagged: `theme-match` gave Kampus
**0.42** agreement, the lowest in the corpus, and declined to call it confident. That number was
not noise about a weak tool — it was the design and the theme genuinely disagreeing, and the
pixel deltas later put a size on the disagreement.

This is the same structural problem as the font fault and the hardcoding incentive, arriving a
third time from a third direction: **the score and the correct behaviour can point in opposite
directions, and only the score is automatic.** Three independent instances is enough to treat it
as a property of pixel-based fidelity rather than as three bugs.

What follows for the bench:

- a delta attributable to an absent token must be **separable** from a delta caused by the run,
  or the score punishes implementations for the theme's gaps;
- the per-design floor is worth computing up front — the best score achievable using only tokens
  — so a run can be measured against what was possible rather than against zero;
- `theme-match`'s agreement number predicts that floor, which makes it a useful input to the
  score rather than only a setup step.
