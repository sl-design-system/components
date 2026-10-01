# Cost and duration across the batch

What each of the nineteen reference runs consumed, so that optimisation has a starting point.
Optimisation itself belongs in its own plan — this document only establishes the numbers and,
more importantly, **what is wrong with them**.

## Read this before using any figure below

**The runs did not report the same quantity.** Some counted the tokens the harness attributed to
their subagents, some added their own orchestrator context, one summed input + output + cache
reads from transcripts and came out two orders of magnitude higher. Three said plainly which parts
they could not measure. One **fabricated a figure** and later disclosed it:

> _"I earlier wrote 261,092 for Stage 1 into `progress.json` with no source. It was fabricated."_

So the column below is not a ledger. It is an order of magnitude with its basis named per row, and
the inability to produce a ledger is the first finding: **`T-NOJIRA-figma-to-code-09` must have the
harness emit one quantity, counted one way. A number an agent reports about its own run is not a
measurement.**

## What each run reported

| Run                             |  Nodes | Reported cost | Basis                                                                          | Wall clock |
| ------------------------------- | -----: | ------------: | ------------------------------------------------------------------------------ | ---------: |
| A9 SANNA `Login 1`              |    894 |       372,844 | total, stages 1–3 only                                                         |    ~27 min |
| A1 Kampus `Subchapter feed`     |  1,803 |        ~2.02M | subagent tokens, 21 spawns                                                     |   ~122 min |
| A2 NSP `class overview`         | 10,936 |        ~1.24M | 909,791 subagent + ~332k orchestrator                                          |     54 min |
| B-Itsl-Bookmk `course files`    |    478 |         ~1.0M | total                                                                          |    ~88 min |
| A6 Itsl-Collab `Shared folder`  |    859 |         ~875k | agents + measured orchestrator delta + 7 aborted spawns                        |    ~57 min |
| B-Itsl-Collab `Add element`     |    458 |         ~828k | subagent tokens                                                                |    ~56 min |
| B-Kampus `Notes panel`          |  1,038 |         ~722k | implementers only                                                              |    ~59 min |
| A8 NSP `Group list`             |    620 |         ~572k | subagent tokens                                                                |    ~48 min |
| A3 Bingel `Digital Exercises`   |  2,147 |       521,378 | 4 stage agents; 7 components written by the orchestrator at no agent cost      |    ~72 min |
| A10 ETSL `FAM - Users`          |  1,512 |      ≥473,755 | **floor** — 5 agents that reported; one never did, orchestrator uninstrumented |    ~14 min |
| A7 Bingel `Materials`           |    974 |       464,798 | 3 stage agents; stages 3–5 by the orchestrator, uninstrumented                 |    ~27 min |
| B-Itsl-Bookmk `Deleted course`  |    885 |          312k | agent tokens                                                                   |          — |
| A11 Sesame `Learning materials` |    395 |          292k | agent tokens                                                                   |          — |
| B-Itsl-Course `course files`    |    519 |          280k | agent tokens                                                                   |          — |
| A5 ETSL `Metadata widget`       |  1,856 |          297k | agent tokens                                                                   |          — |
| A4 Sesame `My Groups`           |    822 |          287k | agent tokens                                                                   |   ~164 min |
| B-NSP `home`                    |    464 |          277k | agent tokens (per-stage sums to ~730k)                                         |    ~61 min |
| B-SANNA `Account creation`      |    506 |          235k | agent tokens                                                                   |   ~100 min |
| B-Sesame `Group details`        |    950 |    **15.24M** | input + output + **13.1M cache reads** — not comparable to any row above       |    ~58 min |

## Per-stage, where a run broke it down

| Run                     |  Ingest | Decompose |        Implement |   Validate | Author |  Review |
| ----------------------- | ------: | --------: | ---------------: | ---------: | -----: | ------: |
| A2 NSP `class overview` | 305,813 |    19,096 |          378,817 |          — | 63,456 | 142,609 |
| B-NSP `home`            |    102k |       18k |             257k | 119k + 48k |    77k |    109k |
| A6 Itsl-Collab          | 124,375 |   152,994 |                — |          — |      — |       — |
| A10 ETSL                |  89,301 |    80,772 | 303,682 (3 of 4) |          — |      — |       — |
| A3 Bingel               | 239,857 |    89,002 |  48,760 (1 of 3) |          — |      — | 143,759 |
| A7 Bingel               | 226,656 |   128,003 |                — |          — |      — | 110,139 |
| A5 ETSL                 |    139k |      107k |                — |       130k |      — |       — |

**Implementation is the largest stage wherever it was measured**, and it scales with the number of
components, not with the size of the design.

## What the numbers do and do not say

**Cost does not track node count.** The largest design in the corpus — 10,936 nodes — cost less
than one a sixth its size. A2's nodes never reached the pipeline: `get_metadata` stops at instance
boundaries and returned 27 of them, because nine tenths of the design is a single `sl-grid` that
Code Connect collapses to an empty element.

**Cost tracks components generated and repair rounds.** A1 produced nine components across 21
agent spawns and was the most expensive run by a factor of four.

**The fixed cost of an agent is ~35,500 tokens** — measured with a probe that used no tools and
answered in one word. Three consequences the batch demonstrated:

- A6 lost **≥245,000 tokens** to seven implementers that died on a quota before producing anything.
- A run that spawns an agent to fix its own file pays that before the agent reads a line. Several
  runs did the work directly instead, on instruction, and finished faster.
- Orchestration overhead across nineteen runs is roughly 0.7M on standup alone.

**Wall clock is dominated by waiting, not by work.** A4 took 164 minutes and reported 287k tokens;
A10 took 14 minutes for a comparable figure. The difference is subagent-pool contention — at ten
concurrent orchestrators the pool saturated and runs queued. Six to eight is the practical ceiling.

## A planning figure, stated with its uncertainty

**A few hundred thousand tokens for a simple screen; one to two million for a rich one**, with the
number of components and repair rounds as the variable. Nineteen runs cost somewhere between
**9M and 12M** in total on the comparable basis — a range rather than a number, for the reasons at
the top of this document.

## Where to look first, when optimisation gets its own plan

Not recommendations to act on now; the places the data points at.

1. **Ingestion is 25–45% of a run** and is largely re-fetchable. Nothing is cached between runs,
   and two runs of the same file re-fetch everything.
2. **Dead spawns are pure loss.** A6's ≥245k bought nothing. A cheaper failure mode — or doing
   small work in the caller — recovers it.
3. **The repair loop is unbounded in principle** and capped at three iterations in practice. A1
   spent most of its 2M there.
4. **A2's 233k-token estimate for expanding one `sl-grid`** is the clearest single example of a
   call whose cost must be known before it is made.
5. **Measure first.** None of the above can be confirmed until one quantity is counted one way,
   which is why that comes before any optimisation.
