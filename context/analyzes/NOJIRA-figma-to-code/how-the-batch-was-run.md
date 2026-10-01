# How the batch was run, and how its conclusions were reached

The other documents say what was found. This one says **how**, so that the next batch can be run
without rediscovering the method, and so that a conclusion can be re-derived rather than taken on
trust.

Written because the findings were saved and the reasoning that produced them was not. Several of
the most useful conclusions came from supervision decisions rather than from any run, and those
were living only in a conversation.

---

## The shape of the thing

One supervising session, one orchestrator subagent per design, each driving the pipeline's own
stage agents. Fourteen designs attempted over roughly a day. The supervisor never ran a stage
itself; it built the harness, settled anything that would otherwise be decided fourteen different
ways, read the reports, and committed.

**Agent nesting was probed before being relied on.** A `general-purpose` agent can spawn its own
subagent and receive its result, so the batch measures the real pipeline rather than an imitation.
The probe also produced the number that shaped everything else: **a subagent that used no tools
and replied with one word still cost ~35,500 tokens.** That is the price of standing an agent up,
and it is why a fix to one's own file should be made directly rather than delegated.

## What the supervisor settled once, and why that mattered more than it sounds

Anything a run would otherwise have to work out became a supervisor decision, fixed before the
batch and identical for every run: the Figma server, the framework, i18n off, the output location,
the render harness, and later the icon rule, the type-check command and the theme derivation.

The reasoning is the whole point of the exercise. **Fourteen agents improvising around one
credential is fourteen chances to improvise differently**, and that difference would land in the
measurements as if it were a property of the pipeline. Every time a run had to invent a workaround,
the batch lost a little of its ability to compare runs.

It was not applied early enough. Wave 1 ran before the icon rule existed, so A1 hand-drew five
toolbar glyphs and its toolbar is not comparable with anything. That is a real cost of starting
before the rules were known — and unavoidable, because the rules came from watching wave 1.

## Scheduling: what went wrong and the number behind it

Runs were launched in waves of four. By the time ten orchestrators were live, **the subagent pool
saturated**, and runs began queueing instead of working. Five coordinators ended turns on
"waiting for a subagent slot".

The mistake was mine, and the lesson is specific: **concurrency is bounded by the pool, not by the
token budget**. Ten orchestrators each wanting three or four stage agents is forty-odd concurrent
requests against a cap near sixteen. Six to eight orchestrators is the realistic ceiling, and a
coordinator that cannot get a slot should do the work itself rather than wait.

## Cost and duration, as measured — with a caveat about the numbers

Every run reported cost, but **not all reported the same quantity**. Some counted subagent tokens
only, some included the orchestrator, some gave per-stage figures that do not sum to their own
total. The figures below are what each run reported, labelled as such. Treat them as an order of
magnitude, not a ledger — and note that **the inability to compare them is itself a finding**:
`T-NOJIRA-figma-to-code-09` exists to make cost accounting uniform, and this batch shows why.

| Run                             |  Nodes | Reported cost                                        | Wall clock |
| ------------------------------- | -----: | ---------------------------------------------------- | ---------- |
| A9 SANNA `Login 1` (smoke)      |    894 | 372,844 total                                        | ~27 min    |
| A2 NSP `class overview`         | 10,936 | ~1.24M total (909,791 subagent + ~332k orchestrator) | 54 min     |
| A1 Kampus `Subchapter feed`     |  1,803 | ~2.02M subagent, 21 spawns                           | —          |
| B-Itsl-Bookmk `course files`    |    478 | ~1.0M total                                          | —          |
| B-Itsl-Collab `Add element`     |    458 | ~828k subagent                                       | —          |
| B-Kampus `Notes panel`          |  1,038 | ~722k implementers                                   | —          |
| A8 NSP `Group list`             |    620 | ~572k subagent                                       | —          |
| B-Itsl-Bookmk `Deleted course`  |    885 | 312k agent                                           | —          |
| A5 ETSL `Metadata widget`       |  1,856 | 297k agent                                           | —          |
| A4 Sesame `My Groups`           |    822 | 287k agent                                           | —          |
| B-Itsl-Course `course files`    |    519 | 280k agent                                           | —          |
| B-NSP `home`                    |    464 | 277k agent                                           | —          |
| B-SANNA `Account creation`      |    506 | 235k agent                                           | —          |
| A11 Sesame `Learning materials` |    395 | 292k agent                                           | —          |

**Cost does not track node count.** The largest design cost less than a design a sixth its size,
because the nodes never reached the pipeline (see `batch-findings.md`). What cost correlates with
is the **number of components generated and the number of repair rounds** — A1 produced nine
components and was the most expensive run in the batch.

A usable planning figure: **a few hundred thousand tokens for a simple screen, one to two million
for a rich one**, with repair rounds as the variable.

## How a conclusion was allowed to become a conclusion

Four rules, arrived at by breaking them first.

**Verify a claim before relaying it.** Agents reported findings confidently and were sometimes
wrong — and so was I. The theme mapping, the Font Awesome premise, the font diagnosis and four of
my own tools all passed casual inspection. Anything that changed a decision was re-checked
directly, usually in one command.

**Agreement across runs is evidence about a symptom, never about its cause.** Four runs
independently reported serif text; I turned that agreement into a confident wrong cause. One run
measured the font family and overturned it immediately. The corpus will keep producing agreement
of exactly this kind.

**A measurement tool fails by returning a plausible number.** Four of this harness's tools did it.
Each is now verified against a deliberately bad input as well as a good one, and each reports what
it examined — not only what it found. `check-tokens` reports `filesScanned` and `referencesSeen`
precisely because a clean verdict had once been indistinguishable from not having looked.

**Record the correction, not just the correct version.** Several entries in these documents say
what was believed first and why it was wrong. That is deliberate: the wrong version is usually the
one a reader will arrive at independently, and the cheapest way to stop them is to show where it
breaks.

## Supervision decisions worth repeating

**Resume a failed agent instead of replacing it.** A subagent marked `failed` still holds its full
transcript. Resuming it by message costs nothing and keeps everything it learned; a fresh agent
costs ~35k tokens before it reads a line and then re-derives the same context. All four
quota-stopped runs were recovered this way and all four completed.

**Never let the supervisor commit on behalf of fourteen writers.** Runs were forbidden from running
any git command that writes; the supervisor committed centrally. Without that, fourteen agents
would have contended for one index. One run still modified shared state — a `yarn extract-i18n`
touched `packages/locales/src/*.ts` for everybody — which is the same class of problem and argues
for forbidding commands that write **tracked files**, not merely git commands.

**Promote before committing, and keep the snapshot.** The live generated tree is gitignored, so a
run's `generated/` snapshot is both the evidence and the resume source.

**Write the runbook before the work, and keep editing it during.** `runs/BATCH-RUNBOOK.md` was
written to survive a context compaction and then amended seven times as the batch taught things.
Every amendment is a finding with a date on it.

## What I would do differently

- **Settle the rules on one run, not one wave.** Wave 1 produced three rules and one unusable
  toolbar. A single pilot run would have produced the same rules at a third of the cost.
- **Cap concurrency at six orchestrators**, and tell each that a saturated pool means doing the
  work itself.
- **Make cost accounting uniform before starting.** One number, defined once, reported by every
  run. The table above is the price of not doing this.
- **Normalise the reference screenshot in the harness.** `get_screenshot` returns 1280×727 for a
  1280×720 frame; some runs normalised and some did not, so their pixel numbers are not comparable.
- **Require a cause and its arithmetic for every fix.** The one defence against a pixel score that
  rewards constants, and it is a prompt change rather than a scoring change.
