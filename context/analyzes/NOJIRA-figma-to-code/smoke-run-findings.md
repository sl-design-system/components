# Smoke run — findings

First run of the existing `implement-design` pipeline, 2026-10-01, on corpus case **A9 SANNA
Login 1** — the simplest case in the corpus, chosen deliberately so that a failure would mean
something.

Reconnaissance, not measurement: the question is whether a run completes and what it hits, not how
good the output is. Findings are recorded as they are observed, so a run that halts still leaves
evidence.

**Setup:** remote `figma` server (against the pipeline's own recommendation — see below), Lit, no
i18n, output to a gitignored `examples/lit/src/_runs/` subtree.

---

## Stage 1 — design ingestion: completed, no blocking

### The remote-server hypothesis holds

The pipeline's analyst agent instructs that `get_code_connect_map` must use `figma-desktop` because
the remote server is unreliable. Run on the **remote** server, Stage 1 completed cleanly: the map
resolved every placement-level instance with applied property values, the screenshot cached, all
four raw call outputs persisted.

That is one successful run, not a proof — but combined with the desktop server timing out on the
same call, it is enough to make switching the data calls to remote the leading candidate for the
first measured increment.

### First real cost and duration numbers

**Stage 1 alone, on the simplest case in the corpus: 78,410 tokens, 266 seconds, 16 tool calls.**

Worth holding onto, because it is a floor rather than a typical value. The corpus contains cases
with 83 distinct component types against this one's handful, and this is one of six stages. Any
target for R8 (generation speed, "1–2 minutes per screen") has to be set against measurements like
this rather than against intuition.

### The reference screenshot does not correspond to the frame

The Figma frame is **1512 × 982**; the cached reference PNG is **1024 × 715**. Those are not the
same aspect ratio — 1.540 against 1.432 — so the screenshot is **not** a scaled rendering of the
frame bounds. It is cropped to something else, most likely rendered content extent.

This would have silently corrupted every pixel comparison. A bench that assumes the reference maps
onto the frame would compare misaligned images and attribute the mismatch to the pipeline. **The
correspondence between reference image and frame has to be established explicitly, not assumed** —
either by recording the image's own bounds alongside it, or by rendering the reference at a known
scale of known bounds.

### Judgement calls the agent got right, and one it was told

Three nodes could have blocked the run and did not:

- `logo-wordmark` and `Image login` have **no Code Connect mapping**. The agent inspected their
  internals, found an `<img>`/SVG and a photo fill, and classified them as static brand assets
  rather than unconnected components. Correct, and it required looking rather than rule-following.
- `0:101` returned `hasTemplate: false` with only a source path — the third state between resolved
  and `null`. The agent handled it correctly **because it was told to**; that state is not covered
  by its own instructions, and on a different design it would plausibly have blocked.
- `71:13346` is `hidden="true"` and was excluded entirely. Right for generation — and it means
  hidden nodes need a documented skip rule in the coverage metric, or they will count as
  unaccounted and depress coverage for no reason.

### Two token problems, both the kind the measurement exists to catch

**Token names are Figma variable names, not CSS custom properties.** The manifest carries
`color/foreground/primary/bold`; the implementer must translate that to
`--sl-color-foreground-primary-bold`. The translation is mechanical but **unstated**, which makes
it a place where drift enters silently.

**The same variable resolved to two different values.** `color/palette/purple/900` came back as
`#32005a` from the variable definitions and `#29076e` from the design context. The agent flagged it
and attributed it to a different mode. Whatever the cause, it means **theme resolution is ambiguous
at the source**, which is R6 territory and is exactly the defect the prior attempt named as its
number one issue.

**Four raw values are unbound** — 80px, 40px, 24px and 32px gaps, and a 24px corner radius — and
the agent marked each `(unbound — needs a token)`. That is the token-compliance dimension having
something real to measure on the very first case.

---

## Stage 2 — decomposition: completed, and it is the most important observation so far

**9,369 tokens, 90 seconds, no tool calls.** Cheap, and the output is good: two components, a clean
smart-root/presentational-child split, globally unique event names, a model object rather than
scattered props, and correct restraint — the footer bar stayed a styled list rather than becoming a
component, and the static assets stayed assets.

### Nine open questions, nine defaults picked with nobody watching

The decomposer raised **nine genuine forks** on the simplest screen in the corpus. Several change
the generated output materially:

- are the locations fetched or a static constant — _"the single biggest API fork"_, in its own words
- should the footer bar be a component
- what to do about five unbound raw values
- which of two conflicting values the brand purple resolves to
- slots or properties for the heading copy
- whether the footer links navigate or open dialogs
- whether the root performs authentication
- what happens below 1512px

And the pipeline's instruction at this stage is explicit: _no approval checkpoint; for each open
question, pick a sensible default and proceed._

**This is the variance mechanism, observed directly rather than inferred.** Nine decisions, each
changing the output, each made by whatever the orchestrator judged sensible at that moment, none
recorded anywhere a reviewer would see before code exists. Run it again and a different set of
defaults is entirely plausible — which is precisely why the same design does not produce the same
result twice.

It is worth being fair about what this does _not_ show: the decomposition itself is good, and the
defaults chosen were reasonable. The problem is not judgement quality. It is that nine judgements
were made silently at the point where the pipeline's own vision document originally specified a
human checkpoint, and that the design with the _fewest_ components in the corpus produced nine of
them.

The defaults chosen are recorded in the run's `manifest.md` so this run at least remains
reproducible — which is the minimum the stage should do for itself.

---

## Stage 3 — implementation: both components built, type-check clean

Two components, leaves-first: `sl-login-form` then `sl-login-page`. Six files, and the consolidated
`tsc` gate passes — the only error left in the tree is a pre-existing, unrelated one in someone
else's spec file.

**135,025 tokens / 10.5 minutes for the leaf. 150,040 / 11 minutes for the root.**

### The Code Connect mapping points at the wrong component

The sharpest finding of the run. The map resolves the four footer legal links to
`<sl-button fill="link" shape="pill" size="sm" variant="primary">`. The implementer went to build
them and found that **`sl-button` always renders a native `<button>` and has no `href` at all** — it
cannot be a link. It substituted `<sl-link>`, the component documented for exactly this.

Every existing check passes on that mapping. `fill`, `shape`, `size` and `variant` are all valid
`sl-button` attributes, so the snippet validator is satisfied; the Figma property names correspond
to the attributes they feed, so the mapping-name validator is satisfied. The mapping is **valid and
wrong**: in Figma the designer used a button-styled-as-link, and in code that is a different
component.

This is a category the verification chain does not have. Checks 1, 3 and 3c all ask _is this
attribute legal on this component_; none asks _is this the right component_. It is a third sibling
to the two failure modes already recorded — the overridden instance (structure right, appearance
wrong) and the drifted component (appearance wrong, structure right). Here both the structure and
the attributes are right and the **semantics** are wrong, and only a human building it noticed.

### All five "unbound" values had tokens; the flag was wrong every time

The manifest marked five raw values `(unbound — needs a token)`. Both implementers checked before
approximating, and the result is unanimous:

| Raw value                        | Reality                                                      |
| -------------------------------- | ------------------------------------------------------------ |
| 40px headline → subhead          | exact match `--sl-space-500`                                 |
| 80px heading block → input block | exact match `--sl-space-1000`                                |
| 24px select → button             | not needed — `sl-form`'s own default gap already produces it |
| 32px footer link gap             | exact match `--sl-space-400`                                 |
| 24px photo corner radius         | exact match `--sl-size-300`                                  |

**Zero of five were genuine token gaps.** Every one was a designer using a raw value where the
token existed. That is a completely different finding from "the design system is missing a token",
and it needs a completely different response — a message to the designer rather than an addition to
the library.

The measurement must therefore distinguish **raw value, token exists** (a design defect, cheap to
fix, report upstream) from **raw value, no token exists** (a library gap, roadmap input). The
manifest currently collapses both into one flag, and on this evidence the flag is wrong far more
often than it is right.

One genuine gap did surface, by contrast: the multi-layer `Large` drop-shadow has **no** matching
elevation token — only single- and two-layer shadows exist. That one is real.

### A slot-forwarding trap that duplicates code

Once the page assigns anything to a child's named slot — including a forwarding `<slot>` — the
child's own fallback content stops rendering. To keep the no-args story matching the design, the
page had to **duplicate the heading and subhead text and their CSS** from the child. Two copies of
the same content and styling, which will drift.

Not a pipeline defect; a real Lit subtlety the conventions do not mention. It is the kind of thing
that belongs in `component-conventions.md`.

---

## Stage 4 — blocked, on the environment rather than on the pipeline

Storybook will not start. Twice:

1. `yarn start` fails immediately — `Environment variable not found (FONT_AWESOME_AUTH_TOKEN)`, required by `.yarnrc.yml` to reach the private `@fortawesome` registry.
2. With a dummy token it gets further and then fails on `Cannot find package '@sl-design-system/eslint-config'` — dependencies are only partially installed, because the only install that succeeded was a `yarn workspaces focus` over a subset.

So the run halts at Stage 4 **for want of a credential**, not because of anything in the pipeline's
design. Stages 5 and 6 depend on Stage 4 and were not reached.

This is R14 — design system installation, the Nexus/registry token — which both prior attempts
scored as _not addressed_. It has now blocked a real run. A fresh environment cannot execute this
pipeline end to end without that credential, and no document said so before today.

---

## What the smoke run answered

**Does a run complete?** Stages 1 through 3 yes, cleanly, with a passing type-check gate. Stage 4
no — blocked on credentials.

**Does it halt on Code Connect?** No. The map resolved everything at the placement level on a real
product design.

**How long, how much?** **372,844 tokens and about 27 minutes** to produce two components on the
simplest screen in the corpus, before any visual validation. The R8 target was 1–2 minutes per
screen with 10 as the ceiling.

**What does the output look like?** Not assessed — that needs Stage 4, and Stage 4 did not run.

### Blockers to clear before the next attempt

1. A valid `FONT_AWESOME_AUTH_TOKEN`, then a **full** `yarn install`.
2. The reference-screenshot correspondence problem — the bench cannot compare against an image
   whose bounds do not match the frame.

### Where this leaves the plan

Nothing here invalidates the measurement slice; three things sharpen it. The bench must distinguish
unbound-with-token from unbound-without-token. The verification chain needs a semantic-mapping
check it does not have. And R14 moves from a deferred item to a precondition for running anything
at all.
