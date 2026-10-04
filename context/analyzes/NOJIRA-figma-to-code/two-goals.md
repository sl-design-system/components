# Two goals, one pipeline

Two stakeholders want different things from the same output, and the conflict is real — the batch
measured it three times before anyone named it.

**The design system team** wants the most faithful possible reproduction of a design _that uses
the design system_, repeatably. Ideally exact, always identical between runs.

**The competence owner** wants something useful in real projects: output as close to the Figma as
possible, for designs that may not use the design system at all.

Both have to be satisfied. This is how.

---

## The conflict is measured, not theoretical

Three times, from three directions, the batch found the score and the correct behaviour pointing
opposite ways:

| Case                                                               | Design system goal says       | Product goal says                               |
| ------------------------------------------------------------------ | ----------------------------- | ----------------------------------------------- |
| Themes name `'Open Sans'` where the provider registers `open-sans` | use the token → renders serif | write the family from Figma → renders correctly |
| Kampus's pill is `#7C51A9`, between `purple-600` and `purple-500`  | nearest token, Δ≈25           | the exact hex                                   |
| A 32px offset with an unidentified cause                           | fix the mechanism             | `inline-size: 420px` zeroes the delta           |

A pixel score prefers the right-hand column every time. A conformance score prefers the left. One
output cannot be top of both.

## The resolution: stop choosing, and record which was chosen

The two goals are not two scores on one output. They are **two different questions about the same
output**, and one artifact answers both — provided every decision records where its value came
from.

For each visual or structural decision, three facts:

1. **source** — the Figma node id and the raw value it carries
2. **chosen** — what was emitted, and its basis: `mapped` (Code Connect), `token`, `inferred`, or
   `invented`
3. **delta** — the measured difference between chosen and source, where measurable

From that one record:

- **The design system score** is the share of decisions whose basis is `mapped` or `token`, plus
  run-to-run agreement on those decisions. It is about provenance, so it is deterministic and
  does not move with a font or a screenshot.
- **The product score** is the aggregate delta against Figma. It is about appearance and says
  nothing about provenance.
- Neither blocks the run. Both are computed afterwards, from the same data.

**The disagreement between them is the most valuable output, not the problem.** A decision whose
basis is `token` and whose delta is large is a design system gap discovered by a real product
design — Kampus's palette sitting between ramp steps is a ramp gap, and it is only visible
because both values were kept.

## The rule that removes the judgement

The hard cases look like a judgement call and are not. Whether the token or the raw value is
correct depends on something the design already states: **what the node is bound to.**

| Figma binding                             | Emit                              | Mismatch means                                         |
| ----------------------------------------- | --------------------------------- | ------------------------------------------------------ |
| a design system variable                  | the **token**                     | Figma and code have drifted — a sync defect, DS team's |
| another library's variable, or a raw fill | the **raw value**, marked `as-is` | a token gap candidate — DS roadmap input               |

If the node binds an SLDS variable, the designer intended the design system, so the token is right
and any visible difference is a bug in the pairing. If it binds `$gray--900` or nothing, the
designer intended their own value, and reproducing it is correct.

That converts the conflict from a decision into a lookup, which is what the determinism goal
needs. We already read `figma-variable-defs.json` on every run; the binding is in it.

## Marking is the mechanism, and it solves a third problem too

Recording a basis per decision needs somewhere to put it. Marking the generated DOM — a
`data-*` attribute carrying the source node id and the basis — is the right place, for a reason
beyond this question.

[`A-NOJIRA-figma-metadata-contract`](../NOJIRA-figma-metadata-contract/analysis.md) concluded that
the registry **cannot be written first**, because without a node-to-element link every key in it
is a heuristic. A mark carrying the node id _is_ that link. So one mechanism closes three things:

1. the correspondence problem, which blocks the registry;
2. provenance per decision, which lets one artifact answer both goals;
3. verification without a human, because a machine can read a mark and a human cannot read intent.

One discipline, or the marks become the next thing nobody consumes: **mark only what a
measurement reads.** The decomposer already produces twenty to thirty open questions per screen
and nothing consumes them, which is how they became invisible variance.

## Determinism: make the judgement visible before trying to remove it

The design system goal includes "always identical", and the control measured how far that is
from true: three of nineteen cases flipped outcome between identical passes, and the mechanism
was an agent's judgement, not the pipeline.

You cannot remove judgement you cannot see. The order is:

1. **Emit every decision as data** — question, options, chosen, basis. The decomposer already
   makes these; it writes them as prose.
2. **Diff two runs of one design.** Any decision answered differently is the variance, located
   exactly.
3. **Promote a basis to a rule.** A decision with a recorded basis can be made mechanical later;
   the binding rule above is the first example.

Step 2 is also the σ the bench has never had, and it costs one re-run rather than a new corpus.

## Where the human goes, since it cannot be in the run

Not per element, and not per run. **Per pattern, across the corpus.**

A human should never be asked "what should this element be?" — nineteen designs times thirty
decisions is a blocking queue nobody clears. A human should be asked, once: "across nineteen
designs, these nine tokens never reach the values their designs ask for; which do you want?"

That is the same information, aggregated to the altitude where one answer fixes many runs. It
turns the halt from a stop into a backlog.

## One thing the design system team needs told plainly

**"100%, always" is not reachable today, and the pipeline is not what is stopping it.** The batch
measured the ceiling: of fourteen distinct colours in one design, five had an exact token and
nine had none, with a largest unavoidable delta of 31.8. Six shipped components reference a
typography token no theme declares. No theme loads the font it names. There is no 40px control
size and no 18px or 26px type step.

A token-only reproduction of those designs cannot be exact, however good the pipeline becomes.

That is worth saying as a service rather than a complaint, because the same machinery that scores
a run computes the bound: **per design, the best achievable fidelity using only tokens.** If a
design's floor is 87%, the remaining 13% is a design system backlog item with a number attached —
not a pipeline defect, and not a run's fault. That number is the most useful thing this effort
can hand the design system team, and it falls out of the work either way.
