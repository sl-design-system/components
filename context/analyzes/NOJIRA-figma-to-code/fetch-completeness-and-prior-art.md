# Completeness of the fetch, and what v1 and v2 already did

Two questions that turned out to be one: can a script verify that everything came out of Figma
and came out correctly — and had we already built this?

**We had. Most of it is in v2.** That changes what is worth saying.

---

## 1. Verifying the fetch is a script, because metadata declares the universe

The question "did we get everything" is answerable because Figma tells us what exists before we
ask for it. `get_metadata` returns the placement tree; every `get_design_context` response carries
`data-node-id` on its elements. So:

```
declared  = node ids in the metadata tree
covered   = node ids appearing in any response
missing   = declared − covered
```

and every id in `missing` must sit in a named bucket, or it is a gap:

| Bucket                | Mechanical test                              |
| --------------------- | -------------------------------------------- |
| fetched               | appears in a response                        |
| mapped, so not needed | Code Connect resolved it — the stopping rule |
| hidden                | `hidden="true"` in the metadata              |
| explicitly excluded   | a recorded decision, with its reason         |

This is the capture protocol's counting, closed into an accounting. It already half-exists: the
protocol knows 3,004 ids were stored and a reader could read 2,114.

**And the known limit, again:** `get_metadata` stops at instance boundaries — A2's 10,936-node
design returned 27 — so the universe is the placement tree, not the file. That is the right
universe, and a completeness figure must say which tree it counted.

### "Correctly" — eight checks, all mechanical

| #   | Check                                                                                      | Catches                                                |
| --- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| 1   | the response parses; structure balanced                                                    | a truncated response                                   |
| 2   | it matches its expected shape (the schema boundary)                                        | Figma changed something                                |
| 3   | **`rawImages` or `svgAssets` returned exactly 20**                                         | the cap — there are probably more, re-query deeper     |
| 4   | screenshot dimensions against the frame's declared size, **and some channel reaching 255** | the four distortions, including halved colour channels |
| 5   | **no fallback values** — resolved tokens, not fallback CSS                                 | v2's check; Figma silently substitutes                 |
| 6   | cross-source agreement — `get_variable_defs` against design-context inline values          | one source wrong; caught `#29076e` vs `#32005a`        |
| 7   | asset integrity — bytes greater than zero, magic bytes match the declared `format`         | a download that returned an error page                 |
| 8   | `{}` with a clean 200 versus `{}` with prose appended                                      | data versus a timeout, which is causes C and A         |

None needs an agent. And the API-change worry answers itself: these run **at the boundary**, so
when Figma changes shape, these are what notices. That is their job, not a risk to them.

## 2. v1 and v2 already did much of this

Checked rather than assumed, in `reference/prior-art-ds-skills/`.

### v1 — `ds-figma.md`

More structured than the plugin that replaced it:

- **three-pass extraction** (structure, components, layout) explicitly so that "token use stays
  proportional to ambiguity" — the same reasoning as Code Connect pruning the tree;
- a **failure-mode table** with detection _and_ recovery: rate limit → backoff → stale cache;
  depth over 10 → cap, emit truncated children, **and lower confidence**;
- **cache keyed on `lastModified`**, because "revision-aware caching prevents stale snapshots from
  silently contaminating" downstream;
- **diff mode inside the same agent**, so baseline and current use identical extraction rules;
- **confidence scoring**, 0–100, dropping explicitly on truncation or stale-cache fallback.

That last one is the shape our whole "success-shaped output" problem asks for: degrade, say so,
carry the uncertainty forward. Its weakness is that the bands are qualitative — an agent's
judgement, not a measurement — which is exactly where a coverage _figure_ improves on it.

### v2 — `sl-ds-tokens`

And here is the uncomfortable part. v2 already has:

- **exhaustive extraction** — "ALL design tokens from ALL visual node types… NOT 2-3 samples",
  5+ calls, one per visual node type;
- an **independent verifier sub-agent** doing "cross-check via `get_design_context` fallback
  comparison + consistency gates";
- **hard gates that fail the run**, with `tokens-verified.json` written _only if all gates pass_;
- the **no-fallback-values** check and the **cross-node consistency** check;
- **cache discipline** keyed on `figmaLastModified`, making re-runs near-free.

Read that list against what I have been proposing across this conversation — validate at the
boundary, an independent check, gates that stop the run, cross-source agreement, a cache keyed on
the file version. **I have largely been re-proposing v2.**

## 3. So why did v2 come out worse than v1, and what is actually different now

The handover names ten unresolved issues. Five of them are not design flaws:

> **#4** router "not tested in practice" · **#5** setup and layout skills "have never been run
> against a real project" · **#7** resume "written per skill but only works at phase boundaries"
> · **#3** "auto-verification missing" · **#6** standards files so large they fill the context

That is the signature of a **fifteen-skill ecosystem built before being run**. The ideas were not
wrong; they were all introduced at once, so when the output came out worse than v1 — wrong
colours, no RWD — **nothing could be attributed**. Which part helped, which hurt, and which never
executed were all the same unknown.

So the lesson is not "v2's ideas were bad". It is:

> **v2's ideas were unmeasured, and I am proposing the same ideas. The difference has to be in how
> they are introduced, not in what they are.**

### What is genuinely new this time

Four things, and only one of them is a technique:

1. **A measured baseline.** 38 unassisted control runs: **5 produced code**. v2 had no number to
   regress from, which is why "worse than v1" could only ever be an impression.
2. **A frozen corpus of nineteen designs** with their artifacts on disk, so a change is tested
   against the same inputs twice.
3. **Code Connect as the stopping rule** rather than as a data source, with the five-cause
   classification of `{}` — this one is a technique v1 and v2 did not have.
4. **An explicit script-versus-agent line**, so the deterministic parts cannot drift.

The first two are not improvements to the design. They are what makes it possible to find out
whether the design works — which is the thing v2 lacked and the reason its good ideas could not
be told from its bad ones.

### Which means the introduction order is the deliverable

One change, measured against 5/38, before the next. The plan already says this —
_one requirement, one test case, one measured delta_ — and v2 is the evidence for why. Carrying
v2's verifier and gates forward is right; carrying them forward **all at once** is how v2
happened.
