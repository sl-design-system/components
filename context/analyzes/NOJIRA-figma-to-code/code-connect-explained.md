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
