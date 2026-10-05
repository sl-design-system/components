# What to measure, and how to make the numbers trustworthy

Two questions: can the completeness mechanism be a script, and what should we collect so that
iteration on the toolkit is driven by data rather than impression.

The second has a documented failure behind it.
[`cost-and-duration.md`](cost-and-duration.md) records that nineteen runs self-reported cost,
disagreed **by two orders of magnitude**, three said plainly which parts they could not measure,
and **one fabricated a figure** and later disclosed it. That is the thing to fix, and it is fixed
by where the number comes from, not by asking more carefully.

---

## 1. The completeness check is a script, and the adapter is what protects it from Figma

**It never touches Figma.** It runs over the common format, so an API change cannot reach it. If
Figma changes shape, the adapter fails its schema and ingestion stops loudly — the check does not
silently measure something else. That is the layering earning its keep on its first real question.

Everything in it is mechanical:

| Part                     | Script?                     | Why                                                                   |
| ------------------------ | --------------------------- | --------------------------------------------------------------------- |
| geometry coverage        | yes                         | positions and sizes compared within a tolerance, which is a parameter |
| text coverage            | yes                         | normalisation is a parameter                                          |
| asset coverage           | yes                         | a lookup in the index                                                 |
| **hidden** exemption     | yes                         | `hidden="true"` is in the metadata                                    |
| **decorative** exemption | **no — and it must not be** | this is the one judgement                                             |

That last row matters. "Decorative" must **not** be decided at check time, by anything. It is a
decision taken once during decomposition and **written into the run record**; the check only reads
it. Otherwise the check acquires a judgement, and a check that judges is a check that two runs
can disagree about — which is what we are trying to remove.

## 2. What to collect

One rule first, because "the more the better" has already failed here once: the decomposer emits
twenty to thirty open questions per screen and **nothing consumes them**, which is how they became
invisible variance. So — **every field names a question it answers**, and collection is automatic
rather than asked for. Under those two conditions, more really is better.

### Per Figma call — the ingestion ledger

Append-only, one line per call.

| Field                                                       | Answers                                                                                                  |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `call`, `nodeId`, `fileKey`                                 | what was asked                                                                                           |
| `startedAt`, `durationMs`                                   | where the time goes                                                                                      |
| `bytes`                                                     | which calls are expensive — one returned 2.18 MB                                                         |
| `status`: ok / empty / timeout / error, plus the error text | **which calls are actually flaky**, versus which the skill _believes_ are flaky                          |
| `attempt`, `rescuedByRetry`                                 | whether the per-node fallback pays. A8 rescued three of four blocked nodes this way, and it was anecdote |
| `cacheHit`                                                  | what the file-level cache actually saves                                                                 |

This ledger alone would have answered the question the whole Code Connect argument turned on:
Stage 0 calls the remote server unreliable and Stage 1 treats its empty result as proof about the
design. Nobody could say which, because nobody counted.

### Per run

- **tokens and wall clock per phase**, emitted by the harness
- the **mode** and its evidence — which externals, how many `sl-*`
- **counts**: nodes in the placement tree, nodes captured, resolved / `hasTemplate:false` / `{}`,
  and the classification into the five causes
- **coverage**: geometry, text, asset — the three figures above
- **gate outcomes**: scoped type check, token existence, render verdict
- **agent spawns** and **fix iterations** — A1 had 21 spawns and was the most expensive run in the
  batch; that relationship is worth being able to check rather than assert
- **guards**: pipeline tree hash, Figma file version, variable mode

### Per decision — `decisions.jsonl`

Node, source value, emitted value, basis, delta. This is the conformance and fidelity input, and
it is also the variance input: two runs of one design, diffed line by line.

### Per artifact — the determinism proof

**Bytes and a checksum of every generated file.** For the script-generated HTML this is not
bookkeeping, it is _the test_: two runs of the same design must produce the **same hash**. One
line of output proves the deliverable is deterministic, which is the design system team's goal
stated as something a machine can check.

## 3. Can we actually collect it, and how

Mostly yes, and the honest limits are worth stating.

**The ledger needs every Figma call to go through one wrapper.** If an agent calls the MCP tool
directly, that call is invisible and the ledger quietly under-reports — the same failure shape as
self-reported cost. Discouraging it is not enough.

> **Take the Figma tools away from the implementation agents.** Only the ingestion script holds
> them. Then the ledger is complete _by construction_ rather than by compliance.

That is the same principle as the agent reading from disk, applied to the other side, and it
costs nothing because the traversal is a script anyway.

**Tokens:** the orchestration layer already reports subagent usage per agent — the batch's
notifications carried it. So per-agent and per-phase totals are available without asking an agent
anything. What is _not_ visible to the harness is the supervising session's own consumption; that
has to be marked unmeasured rather than estimated.

**Wall clock, bytes, counts, coverage, checksums:** all trivial, all local.

**Format:** one `ledger.jsonl` per run, append-only, plus a derived `metrics.json` written at the
end. Append-only so a crash leaves a valid prefix; derived at the end so analysis reads one small
file. Across runs it is then a `jq` away — _which design cost most, which call is slowest, does
the retry pay, is coverage correlated with fidelity_ — without re-running anything.

## What this makes answerable that currently is not

- which Figma call is flaky, with a rate rather than an impression
- whether per-node retry is worth its extra calls
- what the file-level cache saves
- whether cost tracks components, nodes, or fix iterations — the batch suggested components and
  could not show it
- whether two runs of one design produce the same artifact, as a hash comparison
- whether coverage predicts fidelity, which is the assumption the whole completeness argument
  rests on and which nothing has tested

Every one of those is currently either unknown or an anecdote from a single run.
