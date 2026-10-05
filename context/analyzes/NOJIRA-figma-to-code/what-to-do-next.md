# What to do next, in order

The single ordered view, written after eight reviews. It supersedes
[`draft-next-steps.md`](draft-next-steps.md) and consolidates what
[`sequencing.md`](sequencing.md) accumulated across a day of appends — read that one for _why_,
this one for _what_.

Two settled facts shape everything below.

**The cost question is answered.** Per-screen token cost compared against one developer is the
wrong unit. The HTML is generated **once** and consumed by hundreds of developers, so the
comparison is one generation against N hand-builds. At that scale the per-screen figure stops
being an argument.

**The toolkit moves whole or not at all.** It is developed here and the skill belongs to the
design system team. If it goes to aipdlc, all of it goes — there is no interface between two
teams to design, only one relocation decision to take later.

**The target is all nineteen.** Every design in the corpus fetches cleanly from Figma and becomes
HTML. Early passes will land short of that and that is expected — 9 of 19 render today — but the
number to steer by is nineteen, not "better than last time". What stands between the two is now
measured run by run in [`render-failure-taxonomy.md`](render-failure-taxonomy.md), and **nine of
the ten remaining failures belong to `P-NOJIRA-figma-ingestion`, not to the harness**: seven runs
hold captures that are not Figma's output at all, two are truncated at the MCP output cap, and
one carries a Figma property literally named `↕️Size`.

---

## Step 0 — one week of measurement, before any plan resumes

Costs less than writing the task files would. Needs no Figma call, no schema, no new plan.

|     | Work                                                                                                                                    | Size      | Why it is first                                                                                            |
| --- | --------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------- |
| 0.1 | ~~Fix the advisory-block split in `normalise-captures.mjs` (`extractBlocks`)~~ **done, `cbe4455ef`**                                    | hours     | estimated at six runs and worth **three** — see [`render-failure-taxonomy.md`](render-failure-taxonomy.md) |
| 0.2 | Write `census.json` — per run: provenance class, renders or not, reference exact / downscaled / undeclared                              | **hours** | nobody knows which runs can be measured; both plans assumed nineteen                                       |
| 0.3 | Build the geometry comparator — metadata's declared `x/y/w/h` against `getBoundingClientRect` in the browser `shoot.mjs` already drives | **days**  | the first real fidelity number, and it needs no reference image                                            |
| 0.4 | Run it on `a3` and `a7`, where ~330 node ids overlap                                                                                    | hours     | two numbers, and a named reason for every run that has none                                                |

**What it decides.** Whether `P-NOJIRA-html-contract` runs at full scope or narrows to tasks
00–04; whether the independent-comparison population is really N ≈ 4 or larger once 0.1 lands;
and which of the nineteen runs are evidence at all.

**0.1 has landed, and it moved less than this table expected.** Measured 6 → 9 of nineteen on
regenerated input, not 9 → 15: four runs held a contaminated capture rather than six, and one of
those four is truncated as well and fails anyway. The estimate above is left as written, struck
through, because the gap between it and the measurement is the point.

---

## Step 1 — the cheapest externally visible win

**`P-NOJIRA-figma-ingestion`, the whole plan** — the mode decision, the traversal with Code
Connect as the stopping rule, the five-cause classification, and the fourteen-case probe. The
ledger, the boundary checks and the assets are a separate plan,
`P-NOJIRA-ingestion-hardening`, which is weeks where this is days.

- Priced in our own analysis as _a few dozen lines, not a subsystem_.
- `theme-match.mjs` already discriminates the other-library case; the mapping inventory is a local
  grep; the per-node retry is what three runs improvised by accident.
- Both enabling API calls were probed on 2026-10-05 and work.
- **It does not wait for Step 0** — the 14-case halt probe needs no fidelity figure.

Its last task is **the fourteen-case probe**: re-run only the cases that halt today. A third of
the cost of the full control, and **it can falsify the whole diagnosis on its own**. If none of
the fourteen converts, stop and rethink rather than spending the other twenty-four runs.

**Measured against:** 5 of 38. This is the only number in the effort that moves something
externally visible.

---

## Step 2 — the contract, anchored this time

`P-NOJIRA-html-contract` — two tasks, the contract and its schema — with the corrections the
reviews forced:

- **primary input is the 36 requirements** of `A-NOJIRA-figma-metadata-contract`, with a recorded
  disposition for every one — not a checklist re-derived from four consumers;
- **fold in `ARCH-handover-package`**, which specifies the same artifact under another name; what
  survives from it is **layout intent and bound variables**, which my checklist had dropped;
- all **six** acceptance cases, including a blocked run — the majority outcome;
- `provenance` and `asset` as required fields, and `capturedAt` refusing to populate on a
  reconstructed index.

Gated on human approval. Nothing downstream starts until it passes.

---

## Step 3 — build on what Step 0 proved

Adapter, generators, closure check, fidelity, overlay — `P-NOJIRA-html-artifacts`, at whatever
scope the census justified. Then `P-NOJIRA-ingestion-hardening`, which needs both the traversal
and the closure check to exist.

---

## Not yet, and why

| Deferred                                         | Reason                                                                                                                                           |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **the raster track** — the bench's T-10 and T-11 | demoted before it was started; scoreable on a minority; it rewards absolute positioning, which a script with no model in the loop cannot consume |
| **the progress view**                            | a third generator with no named consumer                                                                                                         |
| **T-13, T-16**                                   | comparison cadence and rerun automation for a cadence that has run zero experiments                                                              |
| **slice 5, caching**                             | already deferred; stop re-litigating it                                                                                                          |
| **moving the toolkit to aipdlc**                 | a decision to take once there is something worth moving                                                                                          |

## Owned by someone else, and worth starting in parallel

- **Four Code Connect mappings** — `sl-tool-bar` (6 designs), `sl-form` (6), `sl-tag` (5),
  `sl-paginator` (5). Design system team, days, no plan needed. **A fidelity fix on the runs that
  work, not a halt fix on the ones that do not** — worth doing, worth not confusing with Step 1.
- **The designer rehearsal** — `A-NOJIRA-designer-workflow` F8, its one immediately actionable
  recommendation, named in two documents and scheduled in none. One ticket, one designer, no
  build. **The only evidence here that money cannot buy.**
- **Accessibility** — roadmap slice 3b, research before plan. Detection must not defer even if
  remediation does.

## Hygiene, before anyone claims work

Nine task files are marked `blocked` or `cancelled` with the wrong line quoted; the use cases
still name no corpus case, so plan acceptance 7 is unmet across all sixteen; and the triage plan's
"nine already satisfied" is disproved by the control. None of these blocks Step 0, and all of them
block someone picking up a task file and trusting it.

---

## Why not write the adapter and the generator right now?

You could. Nothing blocks it. The question is what you would learn and what you would redo, and
there are three specific answers.

**Step 0 is not a detour — it is the first days of the adapter, reordered to produce a decision.**
The geometry comparator is load-bearing in the generator anyway; building it standalone means it
is tested in isolation against a fixture with known offsets rather than debugged inside a larger
pipeline.

**Without the census, the adapter gets designed against whatever it happens to meet.** There are
four provenance classes in the corpus — Figma's bytes, reconstructed, summarised, and agent prose
wearing JSX — and each needs a different recovery path. Discovered one crash at a time, that is a
parser with four accidental branches. Known up front, it is a parser with four designed ones.

**Without the census, a fidelity number cannot be interpreted.** Today nine of nineteen runs
render and the independent-comparison population is about four. If you build the generator first
and it produces a number, nobody can say whether that number describes the pipeline, the corpus,
or a splitter bug.

### What each step adds that we do not have

|            | Adds                                                                                   | It does not             |
| ---------- | -------------------------------------------------------------------------------------- | ----------------------- |
| **Step 0** | knowing **which runs are evidence**, and the first fidelity figure with an N beside it | improve the generator   |
| **Step 1** | **more runs that produce anything at all** — the halt rate is 14 of 19                 | improve the measurement |

They are orthogonal on purpose. Step 0 tells you what you have; Step 1 gets you more of it.
Neither makes the generator better, and both change what it is fed and judged on — which is why
doing them first stops the generator being tuned against a corpus nobody had characterised.

### Can they corrupt the judgement? Yes, in two specific ways

**Re-normalising changes the artifacts.** The nineteen captures were already rebuilt once from the
runs' own markdown — every `capturedAt` within 64 ms. Repairing the splitter and re-normalising
would add a **second** undisclosed layer. The rule, written into the census plan: a re-normalised
index is a **new versioned artifact, never an overwrite**, and the original run markdown stays the
source.

**Step 1 changes the pipeline, so later runs stop being comparable to 5 of 38.** That is the
intent — the number is meant to move — but it means the baseline must be **preserved and never
re-run under the new code**. That rule already exists as Amendment 6's "the unmarked control is a
kept artifact"; Step 1 is the first thing that depends on it holding.

Neither risk argues against the steps. Both argue for doing them deliberately rather than as a
side effect of building something else.

---

## Two documents found in the repository root, and what is in them

`analiza-projektu.md` and `analiza-agent-plugin.md` predate this effort and sat untracked in the
root all session. Read 2026-10-05, and since translated into
[`A-NOJIRA-design-system-architecture`](../NOJIRA-design-system-architecture/analysis.md) and
[`A-NOJIRA-plugin-packaging`](../NOJIRA-plugin-packaging/analysis.md) — **read those rather than
this summary**, which keeps only the three things that bear directly on the work.

### CEM is a declared source for what I built heuristics against

`custom-elements.json` — generated by `scripts/build-metadata.js` via
`@custom-elements-manifest/analyzer` — declares, **per component**: attributes with types,
members, events, **slots**, **cssParts** and **cssProperties**.

That is the authority for several things the runs guessed at and several checks I wrote by hand:

| What happened                                                                         | What CEM declares         |
| ------------------------------------------------------------------------------------- | ------------------------- |
| a run gave `sl-avatar` an `icon` slot it does not have — it is `fallback`             | `slots`                   |
| `sl-select` documents `::part(selected-option)` which cannot match                    | `cssParts`                |
| analysts invented four token names that do not exist                                  | `cssProperties`           |
| `check-tokens.mjs` scrapes component CSS for `--sl-*` to decide what is host-settable | `cssProperties`, declared |

**It is not on disk** — generated at build time — so using it means running the generator first.
Worth doing: a declared API beats a regex over CSS, and it would let the decomposer check a
component's real surface instead of inferring it from a picture. This belongs in
`P-NOJIRA-html-contract` task 00 as an input, and as a possible replacement for part of
`check-tokens.mjs`.

### Component status is a risk dimension nothing records

Measured from `packages/components/*/package.json`: **29 stable, 7 preview, 16 draft**, 2 with
none. A design mapped onto a `draft` component carries a different risk from one mapped onto
`stable`, and no run recorded which it used. Cheap to add to the decision record, and it is the
kind of thing a consumer of the HTML contract would want to see.

### The document predicted the typography fault a year early

Its risk **P3** reads: _the old token system still exists — `core.json` is deprecated but
`build-themes.js` handles both the legacy `core` and the new `*-new.json`; maintaining both may
lead to divergence._

That divergence is exactly what cost this batch: `--sl-text-*` works, `--sl-text-new-*` is
declared only as longhands and names a font the provider does not register, and six shipped
components reference the broken namespace. **The risk was written down before we met it**, which
is worth knowing about the value of these documents rather than about typography.

### The plugin study ends in a plan with three blockers

[`A-NOJIRA-plugin-packaging`](../NOJIRA-plugin-packaging/analysis.md) reads as a study of how
Spotify structures a Claude Code plugin — repository layout, the four component types, why
Markdown over code, **why not MCP** — but its last third is a concrete implementation plan for
packaging this design system, with three named blockers. **The first of them is the same gap the
architecture survey reached independently** (P12): `custom-elements.json` is generated by
`yarn dist` and committed nowhere, so nothing machine-readable is published. Two documents
arriving at it separately is the strongest argument either makes.

The packaging question itself is not needed now — it is the same question as the toolkit's
relocation to aipdlc, deferred until there is working code to move rather than a specification.
