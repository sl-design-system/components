# Control runs — the skill exactly as it ships

Commands to run `implement-design` **unassisted**, so that there is a baseline to measure a next
version against. The nineteen batch runs cannot serve as that baseline: they carried five hints
supplied by hand, three rules invented mid-batch, and several stages the orchestrator executed
itself rather than the plugin's agents. See
[`batch-findings.md`](../../context/analyzes/NOJIRA-figma-to-code/batch-findings.md), "What the
batch actually measured".

**The point is to change nothing.** No hints, no corrections, no stepping in when a stage goes
wrong. A run that halts is a result, and in two cases below it is the expected one.

---

## Before the first run — one command, once

```sh
node runs/harness/link-workspaces.mjs
```

This links the local workspaces into `node_modules/`, which a complete `yarn install` would have
done and this checkout never did. It is environment repair, not pipeline assistance — without it
_nothing_ in the repository resolves, including the skill's own Stage 4.

**Stage 4 will still halt** on the missing `FONT_AWESOME_AUTH_TOKEN`: `yarn start` loads 33 stories
that import Font Awesome Pro from a private registry. That is a known environment fact, already
measured, and not worth re-measuring nineteen times. **Stages 1–3 are the controlled measurement
that matters**, because those are the stages the plugin's own agents actually ran during the batch.

Do not start the batch harness for these runs. It would be a change.

## Stage 0 — the four answers, the same every time

The skill asks these and they are legitimately the operator's to give; answering them is not
assistance.

| Question             | Answer                                                                                    |
| -------------------- | ----------------------------------------------------------------------------------------- |
| Figma MCP server     | **`figma`** (remote)                                                                      |
| Framework            | **`lit`**                                                                                 |
| Internationalization | **no**                                                                                    |
| Output location      | **`examples/lit/src/_runs/control-<case>-r<N>/`** — the per-run path from the table below |

## Nothing is overwritten — checked

| Path                               | Risk | Why not                                                                                                                                                                                                                                                                                |
| ---------------------------------- | ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.implement-design/<file-slug>-N/` | none | The skill derives the folder from the **Figma file name** and takes the next free integer. Existing folders are named by case slug, so they cannot collide; a second run on the same file becomes `-2`.                                                                                |
| `examples/lit/src/_runs/control-…` | none | Distinct per run. **This is the one real risk and the reason the output path is specified**: left to the default, the skill derives the folder from the root component's name, so two runs of the same design would both write `login-page/` and the second would overwrite the first. |
| `runs/`                            | none | Nothing writes there automatically.                                                                                                                                                                                                                                                    |

Both `.implement-design/` and `examples/lit/src/_runs/` are gitignored, so a control run cannot
disturb the committed corpus.

## Afterwards

Do not commit anything. Tell me the run finished and which stage it reached; I will promote it to
`runs/control/<case>-r<N>/` with its `progress.json` and artifacts, so that the control set is
comparable to the batch set.

---

# The runs, most valuable first

## Tier 1 — the three strata, and the ones to repeat

These three span what the corpus actually contains, measured from the runs' own artifacts rather
than guessed from team labels. **Repeat these before running anything in tier 2**: a second run of
the same design is worth more than a first run of a new one, because nothing in the corpus has ever
been run twice and there is therefore no variance figure at all.

### 1. B-Itsl-Course `course files` — zero Code Connect

```
/implement-design https://www.figma.com/design/mONnHPTYNNaBwV3cFUHIYv/Course-files?node-id=4007-3161
```

Output location: `examples/lit/src/_runs/control-b-itsl-course-r1/`

**Expect it to halt at Stage 1 with `BLOCKED_ON_CODE_CONNECT`.** That is the measurement. This
design is drawn entirely against itslearning's own library — sixteen probes returned `{}` — and the
block's remedy, "publish mappings and re-run", can never apply. The batch only got past it because
a coordinator overrode the rule by hand. A clean halt here turns "the pipeline refuses the designs
that need it most" from an argument into a reproducible fact, and it costs almost nothing.

### 2. A9 SANNA `Login 1` — Code Connect resolves, cheapest in the corpus

```
/implement-design https://www.figma.com/design/Mzc8BuOvMxOJGAQtv0h64M/SANNA-Ready-for-Development?node-id=71-13345
```

Output location: `examples/lit/src/_runs/control-a9-sanna-login-r1/`

894 nodes, six resolved mappings, ~370k tokens and 27 minutes in the batch. The workhorse for
repetition: cheap enough to run three times, and the one design where the pipeline's central
premise actually holds.

### 3. A7 Bingel `Materials / Overviews` — detached and overridden

```
/implement-design https://www.figma.com/design/1yroCKkROktqhRCP2wwlzB/MyPortal-Designs-2025?node-id=15878-180439
```

Output location: `examples/lit/src/_runs/control-a7-bingel-materials-r1/`

The highest override rate measured, 64%, with a detached `sl-select` container, four of eleven nav
icons hand-built, and 21 badge wrappers for 20 badges. The batch found that the override rate
changed nothing because no mapping resolved — worth seeing whether an unassisted run reaches the
same conclusion.

### Then repeat

Same three commands, `-r2` in the output path, then `-r3`. **Three runs of one design give the
first σ this effort has ever had**, and without it no change to the skill can be told from noise.

---

## Tier 2 — where the pipeline's premise holds

Code Connect resolves on these, so they exercise the path the skill was designed for.

### 4. B-SANNA `Account creation` — richest Code Connect, 13 resolved

```
/implement-design https://www.figma.com/design/Mzc8BuOvMxOJGAQtv0h64M/SANNA-Ready-for-Development?node-id=174-232051
```

`examples/lit/src/_runs/control-b-sanna-account-r1/`

### 5. A8 NSP `Group list` — 5 resolved, and a mapping known to be valid-but-wrong

```
/implement-design https://www.figma.com/design/4TdMrcnIVOn3Hrfj2OpVZU/New-Secondary?node-id=334-20573
```

`examples/lit/src/_runs/control-a8-nsp-group-list-r1/`

Carries the `display-name="7 students already joined"` snippet — the Figma layer caption leaking
into an instance property. Worth seeing whether an unassisted run reproduces it faithfully.

### 6. A2 NSP `class overview` — 10,936 nodes, the scale case

```
/implement-design https://www.figma.com/design/sSrpLCZm302ces3khoBGls/NS-fundaments?node-id=2422-87039
```

`examples/lit/src/_runs/control-a2-nsp-class-overview-r1/`

The batch found the pipeline does not break here — it succeeds with almost nothing, because Code
Connect collapses nine tenths of the design into one empty `<sl-grid>`.

### 7. A10 ETSL `FAM - Users` — 7 resolved

```
/implement-design https://www.figma.com/design/S5QgDy8X9eqhvECPANSZMM/Editorial-Suite-designs?node-id=17264-29098
```

`examples/lit/src/_runs/control-a10-etsl-fam-users-r1/`

### 8. B-NSP `home`

```
/implement-design https://www.figma.com/design/sSrpLCZm302ces3khoBGls/NS-fundaments?node-id=2095-44291
```

`examples/lit/src/_runs/control-b-nsp-home-r1/`

---

## Tier 3 — the porting path, where no mapping exists

Ten of nineteen designs are here. Each should halt the way B-Itsl-Course does; running more than
one or two is confirmation rather than new information, so they sit below tier 2 despite being the
majority.

### 9. A11 Sesame `Learning materials` — the only mobile case, 360px

```
/implement-design https://www.figma.com/design/UBr399hnydpNF9P5Jb2vfx/MySesame-Redesign?node-id=116-19049
```

`examples/lit/src/_runs/control-a11-sesame-learning-r1/`

Raised above its tier because it is the only design in the corpus below desktop width, and the
decomposer's responsive default — "fixed at the single breakpoint the manifest states" — is
untested anywhere else.

### 10. A6 Itsl-Collab `Shared folder` — 71 component types

```
/implement-design https://www.figma.com/design/Q3gzx1pCseyKnFNDUOOjCw/Collaboration-folder?node-id=4200-13792
```

`examples/lit/src/_runs/control-a6-itsl-collab-shared-r1/`

### 11. A1 Kampus `Subchapter feed` — 83 component types, the richest design

```
/implement-design https://www.figma.com/design/73YHtIYl0UHXH8ST4J7VKI/New-content-view?node-id=5311-37116
```

`examples/lit/src/_runs/control-a1-kampus-subchapter-r1/`

### 12. B-Sesame `Group details`

```
/implement-design https://www.figma.com/design/UBr399hnydpNF9P5Jb2vfx/MySesame-Redesign?node-id=2142-48093
```

`examples/lit/src/_runs/control-b-sesame-group-details-r1/`

### 13. A3 Bingel `Chapter / Digital Exercises`

```
/implement-design https://www.figma.com/design/1yroCKkROktqhRCP2wwlzB/MyPortal-Designs-2025?node-id=25124-56828
```

`examples/lit/src/_runs/control-a3-bingel-exercises-r1/`

### 14. B-Itsl-Bookmk `Deleted course - content`

```
/implement-design https://www.figma.com/design/ya00uFyX1rjxYWF0dlOsoT/Bookmarks?node-id=4549-8339
```

`examples/lit/src/_runs/control-b-itsl-bookmk-deleted-r1/`

### 15. B-Itsl-Collab `Add element`

```
/implement-design https://www.figma.com/design/Q3gzx1pCseyKnFNDUOOjCw/Collaboration-folder?node-id=5006-43051
```

`examples/lit/src/_runs/control-b-itsl-collab-add-r1/`

### 16. B-Itsl-Bookmk `course files`

```
/implement-design https://www.figma.com/design/ya00uFyX1rjxYWF0dlOsoT/Bookmarks?node-id=4886-12955
```

`examples/lit/src/_runs/control-b-itsl-bookmk-course-r1/`

---

## Tier 4 — ambiguous Code Connect, least informative

Their artifacts do not clearly record whether mappings resolved, so an unassisted run settles that
as a by-product — useful, but it is the smallest question on the list.

### 17. A4 Sesame `My Groups`

```
/implement-design https://www.figma.com/design/UBr399hnydpNF9P5Jb2vfx/MySesame-Redesign?node-id=2847-14994
```

`examples/lit/src/_runs/control-a4-sesame-my-groups-r1/`

### 18. A5 ETSL `Metadata usage widget`

```
/implement-design https://www.figma.com/design/S5QgDy8X9eqhvECPANSZMM/Editorial-Suite-designs?node-id=17214-103584
```

`examples/lit/src/_runs/control-a5-etsl-metadata-r1/`

### 19. B-Kampus `Notes panel`

```
/implement-design https://www.figma.com/design/73YHtIYl0UHXH8ST4J7VKI/New-content-view?node-id=5308-32158
```

`examples/lit/src/_runs/control-b-kampus-notes-r1/`

---

## What to record, per run

The skill produces its own final report; what matters beyond it is small:

- **which stage it reached**, and if it halted, on what
- **whether Stage 0 asked anything beyond the four questions**
- **anything you had to decide that the four answers did not cover** — each of those is a gap in
  the skill, and in the batch they were exactly the things supplied by hand
- **wall clock**

Resist correcting it mid-run. If it goes somewhere wrong, that is the finding — the batch's most
useful results all came from watching something fail rather than from helping it succeed.
