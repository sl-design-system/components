# Draft — how to compare output against design

**Status: draft.** Written to capture what the batch established before it is lost, not as a
settled design. Everything here is testable against the nineteen runs already on disk.

---

## The question that changed this draft

> _Why do we have to normalise? Isn't normalisation a falsification? How would we know we
> normalised correctly? And if we need it for future runs too, aren't we doing something wrong?_

All three parts are right, and the third is the one that matters.

**Normalisation is a guess about a transformation we never observed.** We know `get_screenshot`
returned 934×1280 for a 1280×2392 frame. We do **not** know whether the 7px on another frame was
added at the top, the bottom, or split. We do not know whether the halved brightness was an exact
integer halving or something else. Undoing a transformation you inferred from its output is not
measurement — it is reconstruction, and it fails silently in exactly the way everything else in
this batch failed silently.

And upscaling a 27%-downscaled raster back to design size **cannot** recover what was thrown away.
Any pixel comparison afterwards measures the interpolator.

So normalisation is the wrong answer. It was my answer, and the question is what exposed it.

---

## The raster is the wrong primary source

The deeper problem is that we were about to build a measurement on an image when **the two things
we actually want to compare are both available as numbers**.

| What we want to know           | From the design                | From the build            | Exact?         |
| ------------------------------ | ------------------------------ | ------------------------- | -------------- |
| Where is this element, how big | Figma node `x/y/width/height`  | `getBoundingClientRect()` | **yes**        |
| What colour is this surface    | node fill / resolved variable  | `getComputedStyle()`      | **yes**        |
| What type is this text         | node style / resolved variable | `getComputedStyle()`      | **yes**        |
| Which component is this        | Code Connect / node name       | the tag that rendered     | **yes**        |
| Does it _look_ right           | the image                      | the capture               | no — judgement |

Only the last row needs a raster, and the last row is the one a human should answer.

**Geometry compared numerically is immune to every distortion `get_screenshot` applies.** No scale
factor, no canvas bleed, no brightness, no antialiasing, no webfont race. A 1280×2392 frame whose
image came back at 934×1280 still reports its node boxes in design pixels, and the browser still
reports CSS pixels. The comparison is arithmetic.

This also disposes of a problem the batch kept hitting: text regions produce enormous pixel deltas
from font hinting alone — one run measured 3,124 differing pixels at `maxChannelDelta 217` on
**identical** text. Compared numerically, that is `font-size: 16px` against `font-size: 16px`, and
it is equal.

## What the raster is still for

Three things, none of them scoring:

1. **A human looking at it.** Side by side in the viewer, which is what a designer will actually do.
2. **Catching what the numbers cannot describe** — an element present, correctly sized, and
   visually wrong for a reason nobody enumerated.
3. **A regression tripwire between runs of the same design** — build-against-build, where both
   sides come from the same capture path and the distortion cancels.

Note what 3 implies: **comparing two builds is sound where comparing build against design is not**,
because the design side is the distorted one.

## What to do about the distorted reference

Not normalise it. In order of preference:

1. **Ask for an undistorted one.** The REST `images` endpoint takes an explicit scale; `get_screenshot`
   appears not to expose it. Worth establishing whether a faithful raster is obtainable at all.
2. **Verify and reject.** Assert the returned raster matches the frame's dimensions and reaches 255
   somewhere; refuse the capture otherwise. A missing reference is an honest blocker. A silently
   halved one is a measurement that reads fine and is wrong by a factor of two.
3. **Record the distortion as metadata** and let the viewer show the reference with a warning
   rather than a correction — "this reference is 0.73 scale and half brightness" is useful to a
   human and dangerous to a score.

**Never scale a reference and then score against it.** If the raster is unusable the geometry
comparison still works, which is the point of making geometry primary.

## Where this leaves the fidelity score

The composite becomes mostly numeric and mostly exact:

- **presence** — is every component the design names actually in the tree, and upgraded
- **geometry** — per element, design box against rendered box, in design pixels
- **colour** — per element and property, resolved design value against computed value, ΔE not RGB
- **typography** — family, size, weight, line height, compared as values
- **tokens** — did the applied value come from a token, and which
- **behaviour** — events fire and mutate state
- **appearance** — the only raster term, and the only subjective one

Six of seven need no image. And the per-design floor becomes computable from the same data: a
colour with no token in the theme cannot be scored against the run.

## Open questions this draft does not settle

- **Node-to-element correspondence.** Comparing boxes requires knowing which rendered element is
  which design node. Code Connect gives it where mappings exist — a minority of this corpus. Where
  it does not, matching is by structure and name, and that is a research question, not a detail.
- **What counts as one element.** A design node and a rendered element are not one-to-one: one node
  can become a component with five internal elements, and a component can absorb three nodes.
- **Tolerance.** 1px off is not a defect; 8px is. The threshold belongs to the design system, not
  to the harness.
- **Whether a faithful raster is obtainable**, which decides whether the appearance term is worth
  anything at all.
