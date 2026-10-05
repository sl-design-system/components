# What `connect-figma-components` actually is, and what it buys

Written from the source, because the question has come up three times and a vague answer is worse
than none. Everything below is checkable in `scripts/connect-figma-components/`.

---

## What it is

A private workspace, `@sl-design-system/connect-figma-components`, holding **54 mapping files**
under `src/` — 28 plain, 12 batch, and **14 scaffolds that are not real mappings yet**. Each is
TypeScript using `@figma/code-connect` v2, configured in `figma.config.json` with
`"parser": "html"` and `"label": "SL Design System"`.

A mapping is **a hand-written translation function from a Figma component's properties to an HTML
snippet.** Not a lookup table — code. `src/button.figma.batch.ts` is the clearest example:

```ts
const instance = figma.selectedInstance;
const buttonVariants = checkInstance(instance.findInstance('Button-Variants'), 'Button-Variants');
const variant = checkEnum(buttonVariants.getEnum('Variant', {
  Primary: 'primary', Positive: 'success', Negative: 'danger', …
}) || 'secondary');                       // "The default variant is secondary."
const buttonBase = checkInstance(buttonVariants.findInstance('Button-Base'), 'Button-Base');
const label = checkStringProperty(buttonBase.getString('𝐓 - Label'), '𝐓 - Label');

return figma.code`<sl-button ${…} >${label}</sl-button>`;
```

It descends through nested Figma instances, reads named component properties, maps Figma's
vocabulary onto ours (`Positive` → `success`, `Caution` → `warning`), applies documented defaults,
and emits markup.

`yarn connect:publish` pushes these to Figma. From then on `get_code_connect_map` returns, for a
mapped node, the snippet this code produced. That is the whole mechanism.

## What it buys

**Not calls.** `get_code_connect_map` is one call whether mappings exist or not. There is no
request saving, and I have said otherwise before — it was wrong.

**Tokens and time, sometimes enormously.** A resolved snippet is `<sl-button variant="primary">Sign
in</sl-button>`. The alternative is `get_design_context` emitting the component's entire visual
subtree. A2 measured the extreme: Code Connect represented a ten-thousand-node grid as
`<sl-grid></sl-grid>`, where expanding the same node cost ~932 KB ≈ **233k tokens — a 163×
difference**.

**Authority and determinism — the actual point.** A mapped node yields the same snippet on every
run, written by a person who knows what the component is. An unmapped node yields whatever the
model inferred from a picture _this time_. The variance the control measured lives almost entirely
on the unmapped side: one analyst emitted a halt token where another, on identical input, did not.

That is the honest ranking: **determinism first, token cost second, call cost not at all.**

## What it costs and where it bites

Six risks, each observed rather than imagined.

**1 — Coverage is the binding constraint.** Fifty-four files against a corpus largely drawn in
itslearning's, Bingel's and Vuetify's libraries. Six of ten measured designs returned a literal
`{}`. Mappings help only where the design uses SLDS components _and_ those components are
published. Fourteen of the fifty-four are still scaffolds.

**2 — A wrong mapping is worse than no mapping**, because it arrives with authority and nothing
downstream questions it. Measured: `<sl-avatar display-name="7 students already joined">` — a
Figma layer caption leaking into an instance property; `placeholder="[object Object]"` on three
text fields; `<sl-icon name="far-arrow-left">` where the theme registers the bare `arrow-left`.

**3 — Mappings read Figma property names as strings and drift silently.** `'𝐓 - Label'`,
`'↕️ - Size'`, `'Icon Start'`. Rename a property in Figma and the mapping returns undefined. The
`checkEnum` / `checkInstance` / `checkStringProperty` helpers exist precisely because this breaks,
which is evidence that it breaks.

**4 — It collapses detail, deliberately, and that is a problem for measurement.** `<sl-grid>` with
nothing inside is the correct _mapping_ and a useless _reference_. `forceCode: true` returns a
byte-identical payload — this is substitution, not a size guard. **Authority or detail, never
both**, and a fidelity bench cannot measure what the snippet hides.

**5 — Retrieval is flaky in a way the pipeline misreads.** Subtree calls return `{}` or time out
while per-node calls on the same ids return real mappings. Stage 1 treats emptiness as proof the
design is unmapped and halts with zero retries. That single misreading is 14 of 19 halts.

**6 — It is a publishing dependency.** The repository holds the source; Figma holds what is
live. Unpublished or stale mappings are invisible to every run, and nothing in a run says which
it saw.

## What `{}` actually means — five causes wearing one symptom

This is the question worth answering precisely, because the pipeline prints **one** remedy for all
of them and it is the right remedy for two.

| #   | Cause                                                                                        | How to tell                                                                           | Remedy                     | Whose              |
| --- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | -------------------------- | ------------------ |
| A   | **Retrieval failed** — subtree call timed out or was scoped wrongly                          | per-node calls on the same ids return real mappings                                   | retry per node             | pipeline           |
| B   | **Nested instance id rejected** — `I123:456;789:012` fails the server's format check         | the id contains `;`                                                                   | probe the parent instance  | pipeline           |
| C   | **The design uses another library** — itslearning, Kampus legacy, Bingel, Vuetify            | no `<sl-*>` anywhere in `get_design_context`; variables are `$gray--900`, `Size/300`  | as-is mode                 | nobody — expected  |
| D   | **An SLDS component with no published mapping** — 14 of 54 files are scaffolds               | the component name matches a shipped SLDS component absent from our mapping inventory | write the mapping          | design system team |
| E   | **A mapping exists but is stale or unpublished** — property renamed in Figma, label mismatch | in our inventory, still returns nothing                                               | republish or fix the drift | design system team |

**A and B are our bugs.** The map was readable and we failed to read it. A8 pass 2 rescued three
of four "blocked" nodes by fanning out per-node lookups; A2 pass 2 got data the same way after two
identical timeouts. Nothing needs publishing.

**C is not a fault at all.** Six of ten measured designs are in this state, permanently. The
printed remedy — publish mappings and re-run — cannot be carried out, because there is nothing to
map.

**Only D and E are what the halt message describes.**

So `{}` is not one thing. It is a symptom shared by a transport failure, an id-format limitation,
an expected property of the corpus, and two genuine gaps — and the pipeline answers all five by
stopping and asking a human to fix the last two.

### The diagnosis is cheap and mostly local

- **C** is already computed: `theme-match.mjs` reports `method: hex-value-fallback` exactly when a
  design binds no design-system token names. That is the same discrimination.
- **D** needs no API call at all. The mapping inventory is in this repository —
  `scripts/connect-figma-components/src/*.figma.ts`. Comparing a component name against it is a
  local lookup.
- **A** and **B** are detectable by retrying, which is the fix as well as the test.

## Coverage today, and where it is worth growing

**40 real mappings, 14 scaffolds, against 59 shipped components** — roughly two thirds covered.

Which scaffolds matter is not a matter of taste. Counting how often each appears in the nineteen
run manifests gives the demand ranking `T-03` is meant to produce, in one command:

| Scaffolded component | Designs that needed it |
| -------------------- | ---------------------: |
| `sl-tool-bar`        |                      6 |
| `sl-form`            |                      6 |
| `sl-tag`             |                      5 |
| `sl-paginator`       |                      5 |
| `sl-tabs`            |                      3 |
| `sl-skeleton`        |                      2 |
| `sl-tree`            |                      1 |
| the other seven      |                      0 |

Four scaffolds account for almost all the demand, and they are the same components the runs
visibly struggled with — three runs rejected `sl-paginator` and hand-built pagination, several
substituted `sl-tag` for status pills, and A1 rejected `sl-tool-bar` and then lost its keyboard
semantics twice doing it by hand.

**Finishing four mappings would address most of the measured gap.** The other seven can wait, and
knowing that is worth more than the ranking being sophisticated.

## How it fits the marking proposal

**Centrally, and with no change to the mappings themselves.** Code Connect is the `mapped` basis
— the only one that is authoritative rather than inferred. The proposal does not replace it; it
describes what to do for the nodes it does not cover.

Two consumer-side changes would make the pairing work, neither in this workspace:

- **Carry the node id into the emitted markup.** The map is already node → snippet. If the
  implementer writes that id as a `data-*` attribute, the `mapped` basis becomes self-evidencing
  and the node-to-element link comes for free on every mapped node. Nothing in the mappings
  changes.
- **Distinguish `{}` from `null`.** An empty map is "this server returned nothing"; a null entry
  is "this node has no mapping". The pipeline currently treats both as the design's fault.

## What this effort can give back

`T-NOJIRA-figma-to-code-03` — the intake report — produces an **unmapped-component demand
ranking**: which unmapped components appear most often across the corpus. That is exactly the
backlog for this workspace, and it answers "which of the fourteen scaffolds first?" with a count
from real product designs rather than intuition.

The traffic runs both ways: better coverage here makes runs more deterministic, and the bench
tells this workspace where coverage is worth adding.

---

## Do the missing mappings cause the halts? Mostly no

The recollection is right — **14 scaffolds**, components with no real mapping. But they are not
what stops the runs, and the distinction matters because it points the effort somewhere else.

Six of ten measured designs returned `{}` for the whole file with **zero `<sl-*>` anywhere**.
Those are cause C: drawn in another library. **Finishing all fourteen scaffolds would change
nothing for them.** The halts are dominated by C, plus the retrieval failures A and B.

Where the missing mappings do bite is the opposite end — **the designs that already complete**.
Three runs rejected `sl-paginator` and hand-built pagination; several substituted for `sl-tag`;
A1 rejected `sl-tool-bar` and lost its keyboard semantics twice doing it by hand. So the scaffolds
are a **fidelity and quality problem on working runs**, not a halt problem on broken ones.

**One honest limit.** The 14-of-19 halts cannot be attributed cause by cause from the data,
because a halted run records neither which nodes blocked nor why. The evidence above is from the
runs that kept going. That the data was never collected is itself one of the findings.

## We do not control `{}` — but there are two calls that answer the question properly

`get_code_connect_map` is Figma's MCP tool. Its return value is not ours to change, and on a
timeout the server appends an English sentence to the `{}`, which breaks JSON parsing — so the
distinction exists upstream and is delivered unusably.

What we control is the consumer. But the better news is that **two other calls in the same toolset
return the structure we were going to reconstruct, and the pipeline uses neither**:

| Call                                                                        | What its contract says                                                                                   | Which cause it settles                                                                      |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `list_file_components_for_code_connect(fileKey)`                            | every component **published to the file's library**, with the dependency graph; unpublished ones omitted | **C** — is this file built from our library or someone else's? One call per file, cacheable |
| `get_code_connect_suggestions(nodeId, fileKey, excludeMappingPrompt: true)` | "a lightweight list of unmapped components"                                                              | **D** — which components here have no mapping                                               |

That is close to the diagnosis table built by hand, available from the API, and cheaper: a
file-level question answered once per file rather than per node. It also turns the demand ranking
from a grep over our manifests into a direct query.

**Untested.** This is read from the tool contracts, not from a run. One probe on a known file —
an SLDS-based one and an itslearning one — confirms or kills it, and it is the cheapest next
experiment available.

## Where Code Connect belongs in the order — it is the stopping rule, not a step

The skill already calls `get_metadata` first and Code Connect second, and that order is right:
you cannot ask about nodes before you have node ids. Literally earlier is impossible.

But the instinct behind the question is correct, and sharper than "earlier". **Code Connect should
shape the traversal rather than follow it.** A2 measured why: `get_design_context` on a mapped node
returned `<sl-grid></sl-grid>` — ten thousand nodes represented by an empty element. The Code
Connect answer decides **how deep you need to go**.

So the shape is interleaved and top-down, with Code Connect as the stopping rule:

1. `get_metadata` at the root — shallow. A2's root returned **27 nodes in 9 seconds** because it
   stops at instance boundaries.
2. Code Connect on those top-level instances.
3. **Mapped** → take the snippet, do not descend.
4. **Unmapped** → descend, gather the interior, repeat.

This is the real reason Code Connect saves tokens. Not that the call is cheaper — it is one call
either way — but that **a resolved mapping prunes the tree**.

### And this is why a Code Connect failure costs more than a missing snippet

If the call fails, you do not merely lose a template. **You lose the stopping rule**, and must
descend into a subtree you might not have needed — which on a node like A2's grid is a 163×
difference.

The fallback has to be defined, and only one direction is safe:

> **Unknown → descend.** Failing open costs tokens. Failing closed — treating an unresolved node
> as mapped — silently drops content, which is the failure mode this whole effort keeps finding.

And the mark must record _which_ it was: descended because the node is genuinely unmapped, or
descended because the map could not be read. Those produce the same markup and mean opposite
things.
