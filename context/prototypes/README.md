# prototypes/

One folder per prototype, named for its ticket: `<JIRA>-<slug>/`. It holds the record of a
prototype that was **built** — `PT-<JIRA>-NN-<slug>.md`, copied from `_templates/prototype.md`.

## It is also the folder you point the design tool at

A prototyping session runs across two surfaces — a design canvas that generates screens, and an
agent session that keeps the record. This folder is where they meet: **point the canvas at it and it
can read everything the session established** — what the prototype is, what varies, what must not
change, and what previous variants already decided.

That is the whole of the integration. There is no export step, no mirrored working directory, and
nothing to keep in sync: one folder, named after the ticket, readable from both sides.

**So write the session's working notes here too**, alongside the record — the brief, the constraints,
the axis a set of variants varies along, the decisions that would otherwise have to be re-explained
next time. A prototype folder that carries only the finished description makes the next session start
from nothing, which is the cost this layer exists to remove.

## The record itself

**Verbatim, not summarised.** Every string a viewer can read goes in exactly as it appears. A
paraphrase reads perfectly well and quietly destroys the record's value: nobody can later tell what a
research participant actually saw, and two variants cannot be meaningfully compared.

**Variants are siblings**, not nested folders. A variant sets `variant_of` and `change`; the schema
rejects one without the other, because a variant that cannot say what it changed cannot be compared
against its source.

**Descriptions live here; built bundles do not.** A prototype bundle is runnable code and the code
boundary (CONVENTIONS § 17) rejects it. The `artifact` field holds the URL to wherever it is served.

**`Components used: none` is a real answer**, and often the right one. A design system can be
attached to a canvas and still not be *used* — measured on a live project: the token stylesheets were
linked, not one token was referenced, and half the screen's colours came from outside the palette.
Record what is there, not what was intended.
