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

---

## Step 0 — one week of measurement, before any plan resumes

Costs less than writing the task files would. Needs no Figma call, no schema, no new plan.

|     | Work                                                                                                                                    | Size      | Why it is first                                                                                   |
| --- | --------------------------------------------------------------------------------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------- |
| 0.1 | Fix the advisory-block split in `normalise-captures.mjs` (`extractBlocks`)                                                              | **hours** | six of ten non-rendering runs fail for this reason alone — survivorship goes from 9 to roughly 15 |
| 0.2 | Write `census.json` — per run: provenance class, renders or not, reference exact / downscaled / undeclared                              | **hours** | nobody knows which runs can be measured; both plans assumed nineteen                              |
| 0.3 | Build the geometry comparator — metadata's declared `x/y/w/h` against `getBoundingClientRect` in the browser `shoot.mjs` already drives | **days**  | the first real fidelity number, and it needs no reference image                                   |
| 0.4 | Run it on `a3` and `a7`, where ~330 node ids overlap                                                                                    | hours     | two numbers, and a named reason for every run that has none                                       |

**What it decides.** Whether `P-NOJIRA-html-contract` runs at full scope or narrows to tasks
00–04; whether the independent-comparison population is really N ≈ 4 or larger once 0.1 lands;
and which of the nineteen runs are evidence at all.

---

## Step 1 — the cheapest externally visible win

**Ingestion tasks 03, 04, 05 — the mode decision, the traversal with Code Connect as the stopping
rule, and the five-cause classification.** Without the ledger, without the boundary checks.

- Priced in our own analysis as _a few dozen lines, not a subsystem_.
- `theme-match.mjs` already discriminates the other-library case; the mapping inventory is a local
  grep; the per-node retry is what three runs improvised by accident.
- Both enabling API calls were probed on 2026-10-05 and work.
- **It does not wait for Step 0** — the 14-case halt probe needs no fidelity figure.

**Then ingestion task 09, narrowed**: re-run only the fourteen cases that halted. A third of the
cost of the full control, and **it can falsify the whole diagnosis on its own**. If none of the
fourteen converts, stop and rethink rather than spending the other twenty-four runs.

**Measured against:** 5 of 38. This is the only number in the effort that moves something
externally visible.

---

## Step 2 — the contract, anchored this time

`T-NOJIRA-html-contract-00`, with the corrections the reviews forced:

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

Adapter, schema, generators, closure check — `P-NOJIRA-html-contract` tasks 01 onward, at
whatever scope the census justified.

---

## Not yet, and why

| Deferred                               | Reason                                                                                                                                           |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **the raster track** — T-10, T-11, 07a | demoted before it was started; scoreable on a minority; it rewards absolute positioning, which a script with no model in the loop cannot consume |
| **the progress view**                  | a third generator with no named consumer                                                                                                         |
| **T-13, T-16**                         | comparison cadence and rerun automation for a cadence that has run zero experiments                                                              |
| **slice 5, caching**                   | already deferred; stop re-litigating it                                                                                                          |
| **moving the toolkit to aipdlc**       | a decision to take once there is something worth moving                                                                                          |

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
