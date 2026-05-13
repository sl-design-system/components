# Design Manifest Schema

Contract between the `design-analyst` and `component-decomposer` agents in the `/implement-design` pipeline. The analyst writes this; the decomposer reads it. Do not add or rename sections without updating both agents.

The manifest is a single markdown document with the sections below, in this order.

---

## Overview

One paragraph. Must include:

- Figma file name
- Top-level node name and ID
- Viewport / frame size in pixels
- One sentence describing what the design is (e.g. "a checkout summary card with editable line items")

## Existing SLDS Components Used

A markdown table sourced from the `get_code_connect_map` response. One row per connected node:

| Node ID | Node Name     | Mapped Component                | CC Snippet (excerpt)                               |
| ------- | ------------- | ------------------------------- | -------------------------------------------------- |
| 12:34   | PrimaryButton | `<sl-button variant="primary">` | `<sl-button variant="primary">{label}</sl-button>` |

Only include nodes that have a non-`null` mapping. Snippet excerpts may be truncated to one line.

## Composition Candidates

Bulleted list of groupings — sets of existing components that visually cluster and look like they should become a single new component. Each bullet:

- A short name for the group (e.g. "Card header")
- The node IDs included
- A one-sentence rationale ("appears as a unit, repeats per row")

If no compositions stand out, write `_None._`

## Net-New Primitive Candidates

Bulleted list of visual elements with no plausible existing-component match (no CC mapping AND not reasonably composable from existing primitives). Each bullet:

- Node ID + name
- Why it doesn't map to anything existing
- Rough shape (atom-level: button-like, input-like, indicator, etc.)

If none, write `_None._` Net-new primitives are expensive — keep this section honest.

## Responsive Breakpoints

List of breakpoints visible in the design. One bullet per breakpoint:

- Width in pixels
- Source (separate frame at that width / constraint annotation / inferred from layout grid)

If only one frame exists, write `_Single breakpoint: <width>px._`

## Designer Annotations

Verbatim quotes from any annotation/comment layer in the design, attributed by node ID. If none, write `_None._`

## Token Reference

Flat deduplicated list of every design token referenced in the `get_design_context` response, grouped:

- **Color**: `--sl-color-*` tokens, one per line
- **Size / Spacing**: `--sl-size-*` tokens
- **Typography**: `--sl-font-*`, `--sl-text-*` tokens
- **Other**: anything else

Token names must be quoted verbatim from `get_design_context`. Do not paraphrase, normalize, or guess.
