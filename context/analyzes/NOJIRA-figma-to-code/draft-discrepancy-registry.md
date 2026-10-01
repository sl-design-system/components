# Draft — the discrepancy registry and the view over it

**Status: draft.** Captures what the batch established about recording disagreements between a
design and its implementation, so it is not lost before the real analysis is written. Not settled.

Companion: [`draft-measurement-method.md`](draft-measurement-method.md), which decides what a
discrepancy is measured from. Read that first — it changes what this file has to store.

---

## Why this is the centre of the system, not an output of it

Every part reads or writes it. Ingestion records what the design intends; implementation records
what it applied and why; the gates append what they caught; Stage 4 appends what it measured; the
view renders it; the score is computed from it; a designer or developer resolves from it. **Get the
shape wrong and everything downstream is rework.**

It is also what makes the two audiences one pipeline. A run against a design built on the design
system and a run against a design built on another library produce the same registry; what differs
is the distribution of entries inside it.

## Two halves, and only one of them can drift

The sync problem — "a line number will rot" — dissolves if the registry is split by how its parts
are produced.

|             | Measured                         | Decided                                       |
| ----------- | -------------------------------- | --------------------------------------------- |
| Example     | this box is 70px, design says 68 | "accept — the theme has no 40px control size" |
| Produced by | the harness, every run           | a human, once                                 |
| Regenerated | **wholly, every run**            | never                                         |
| Can drift   | **no — nothing is stored**       | yes, and must be anchored                     |

The measured half is thrown away and recomputed. There is nothing to keep in sync. Only the
verdicts need durable identity, there are few of them, and they change slowly.

## Identity of a verdict

Not a location. **A location is a pointer, recomputed every run, never stored as truth.**

A discrepancy is identified by **(design node, code target, dimension)**:

```
key = hash(caseSlug, figmaNodeId, codeTarget, property)
      e.g. (b-kampus, 5308:32190, sl-bknp-header-nav .pill, background-color)
```

`codeTarget` is semantic — component tag plus role — not a file path, so it survives a file move,
a reordering, and a refactor. It describes _what_, not _where_.

Three consequences to design for:

- **The anchor can vanish.** The element no longer exists. The entry becomes `stale` rather than
  disappearing — somebody either fixed it or deleted it, and the difference matters.
- **The design can move.** `figmaNodeId` is reasonably stable but a recreated layer gets a new one.
  Store the layer path as a secondary anchor and the Figma file version, so churn is expected
  rather than mysterious.
- **The value can change deliberately.** A verdict records the value it was about. If the designer
  changes `#7C51A9` to something else, the old acceptance **expires** instead of silently covering
  a new state.

## What an entry holds

Both values, always, with their provenance — this is the shape the design discussion converged on
and it is better than recording only the delta:

```jsonc
{
  "key": "…",
  "case": "b-kampus-notes-panel",
  "dimension": "colour", // colour | geometry | typography | icon | behaviour | component
  "figma": { "nodeId": "5308:32190", "path": "Chapter/Header/Nav/pill", "fileVersion": "…" },
  "code": { "target": "sl-bknp-header-nav .pill", "property": "background-color" },

  "intended": { "value": "#7C51A9", "source": "figma-variable", "token": "$brand--700" },
  "applied": {
    "value": "#743CB4",
    "source": "design-token",
    "token": "--sl-color-palette-purple-600"
  },

  "delta": { "metric": "deltaE", "value": 19.1, "alt": { "rgb": 25.0 } },
  "cause": "design value lies between purple-500 and purple-600; no token matches",
  "owner": "designer", // designer | design-system | developer
  "status": "open", // open | accepted | fixed | stale
  "reachable": false // was an exact token available at all
}
```

**`source` is the field that makes statistics possible**, and it was the missing piece in the first
version of this draft. `design-token` / `palette-token` / `hex` / `figma-variable` / `inherited` /
`computed`. Without it the registry is a list of differences; with it you can ask how much of a
screen departs from the design system, in which dimensions, and whether the departure was the
design's or the implementation's.

**`reachable` turns the threshold into a parameter.** Recompute the registry at a tolerance of 3 and
of 10 and see how the count moves, without re-running anything. It also yields the per-design floor
directly: the entries where `reachable: false` are what no implementation could have fixed.

## Owner is the field that gets the list read

The registry is really three lists and must present as three:

- **design-system** — "the theme has no 40px control size", "`sl-select` documents a part that
  cannot match". These aggregate **across runs**: the missing `bell` icon appeared in four runs and
  is one item for the design system team, not four.
- **designer** — "this colour sits between two ramp steps", "this frame uses a different variable
  mode from its sibling".
- **developer** — "the root wires no listeners", "`aria-sort` announces an order never applied".

One unsorted list of ninety entries will not be read by anyone.

## The view

**Generated from the registry, never alongside it.** A viewer that computes anything itself becomes
a third source of truth.

Shape, in order of usefulness as the batch suggests it:

1. **Per run**: reference and build side by side, discrepancy regions as hotspots over the image,
   click for the entry, filters by owner, dimension and status.
2. **Across runs**: every `design-system` entry aggregated — the real deliverable for the DS team.
3. **A trend**: how many entries, of which kinds, per run over time. This is where the batch's own
   numbers would have shown that the gate was passing everything.

The hotspot requirement imposes something on the schema: a **rectangle in a named coordinate
system**. References come back at varying scale, so an entry must say which space its box is in and
the viewer must map explicitly. This is why the view belongs in the schema analysis rather than in
its own plan — it discovers requirements the schema would otherwise miss.

### On the generated output

The thing being measured is itself HTML, rendered today only inside Storybook. A **self-contained
HTML per run** — the component plus its theme, no dev server — would make a run openable and
diffable on its own, and removes the harness from the comparison path. Worth deciding in the
analysis; it changes what "the build" means in every entry.

## What this draft does not settle

- Whether the registry is one file per run or per component.
- How an entry is keyed when **no Code Connect mapping exists**, which is the majority of this
  corpus — the node-to-element correspondence problem from the measurement draft.
- Whether `accepted` entries leave the score's denominator entirely or are reported separately.
- What produces entries: a measuring pass, the implementer declaring them as it works, or both.
- Tolerances per dimension, and who owns them.
