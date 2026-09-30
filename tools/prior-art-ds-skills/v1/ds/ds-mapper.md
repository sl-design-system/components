---
name: ds-mapper
type: sub-agent
prefix: ds
version: 1.0.0
description: Maps normalized Figma component trees onto SLDS components, props, and tokens
called_by:
  - ds-impl
  - ds-proto
invokes:
  - ds-api
token_budget: "2–3K"
---

# ds-mapper

Transforms a **design-centric component tree into an SLDS-centric implementation tree** by resolving tags, properties, tokens, and composition constraints. It prefers deterministic mappings first, falls back to curated and heuristic strategies second, and never leaves ambiguity unmarked. The result is a compact `slds-tree.json` artifact that downstream code generators can use directly.

## Purpose

`ds-mapper` exists to bridge the gap between abstract design structure and concrete SL Design System components. It converts Figma-derived nodes into valid `sl-*` tags, aligns variant properties with the Custom Elements Manifest, validates parent/child composition, and annotates gaps or uncertainty before implementation starts.

## Input

```json
{
  "componentTree": ".ds-cache/figma/abc123--456:789@2026-05-20T10:00:00Z-component-tree.json",
  "cemVersion": "2.0.1"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `componentTree` | Yes | Path to a previously generated `component-tree.json` artifact from `ds-figma` |
| `cemVersion` | Yes | Exact SLDS API version that `ds-api` must query for valid component names, props, enums, and composition rules |

## Output

```json
{
  "version": "2.0.1",
  "mappingStats": { "direct": 12, "curated": 3, "heuristic": 1, "unmapped": 0 },
  "pages": [
    {
      "name": "login",
      "components": [
        {
          "sldsTag": "sl-button",
          "props": { "variant": "primary", "fill": "solid" },
          "tokens": { "margin-top": "var(--sl-size-200)" },
          "children": [],
          "mappingSource": "direct",
          "confidence": 98
        }
      ]
    }
  ],
  "unmapped": [],
  "warnings": []
}
```

| Field | Description |
|-------|-------------|
| `version` | CEM or SLDS version used during mapping |
| `mappingStats` | Counts of direct, curated, heuristic, and unmapped resolution paths |
| `pages` | Page-by-page SLDS component tree ready for composition and code generation |
| `pages[].components[].sldsTag` | Final SLDS custom element tag or placeholder element |
| `pages[].components[].props` | Validated SLDS properties derived from Figma variants and naming |
| `pages[].components[].tokens` | Design token assignments normalized to `var(--sl-*)` references |
| `unmapped` | Components that could not be resolved to SLDS and require human review |
| `warnings` | Non-fatal issues such as invalid props, composition breaks, or fallback guesses |

## Behavior

### Overview
`ds-mapper` runs locally and should not inspect design tools directly. Its only external knowledge source is `ds-api`.

```
1. Read `componentTree` from disk.
2. Ensure CEM knowledge for `cemVersion` is available through `ds-api`.
3. Load the curated mapping table from `knowledge/figma-to-slds-mapping.json`.
4. Walk each page and each component node.
5. Resolve component tag, map props, map tokens, and validate composition.
6. Emit `slds-tree.json` with stats, warnings, and explicit unmapped entries.
```

### Component resolution pipeline
Each abstract component is resolved in descending order of certainty.

```
for each component node:
  a. try direct name match
  b. try curated mapping table
  c. try fuzzy matching against CEM component names
  d. if no match, mark UNMAPPED_COMPONENT and emit <div> placeholder
```

### Step 1: direct name match
Use direct mapping when the Figma name already clearly implies an SLDS component.

```
1. Normalize the Figma name:
   - lowercase
   - strip variant suffixes where necessary
   - convert spaces, slashes, and underscores into comparison tokens
2. Compare normalized forms against known SLDS tags and package names.
3. Examples:
   - `Button` → `sl-button`
   - `Card` → `sl-card`
   - `Form Field` → `sl-form-field`
4. If exactly one strong match exists:
   - assign `mappingSource = "direct"`
   - set high confidence
   - proceed to prop mapping
```

### Step 2: curated mapping table
Use the project-maintained lookup when design naming differs from implementation naming.

```
1. Read `knowledge/figma-to-slds-mapping.json`.
2. Match by exact key, alias, or declared pattern.
3. Apply table-provided defaults:
   - target `sldsTag`
   - prop overrides
   - token overrides
   - child handling notes
4. Set `mappingSource = "curated"`.
```

### Step 3: fuzzy CEM matching
When no deterministic lookup exists, infer the best available SLDS component from the manifest.

```
1. Query `ds-api` for the full component list for `cemVersion`.
2. Score candidates using:
   - token overlap between Figma name and tag name
   - known aliases from package names
   - nearby prop hints (example: `variant`, `size`, `disabled`)
   - child shape similarity if available
3. Select the highest-confidence candidate only if it clears the acceptance threshold.
4. Set `mappingSource = "heuristic"` and record the score.
```

### Step 4: unmapped fallback
If the component still cannot be resolved, preserve structure without pretending certainty.

```
1. Emit `sldsTag = "div"`.
2. Add `mappingSource = "unmapped"`.
3. Push a record into `unmapped` with:
   - original Figma name
   - page name
   - node path
   - reason for failure
4. Preserve children so downstream composition still has usable hierarchy.
```

### Property mapping
Figma variants must be translated into valid SLDS properties.

```
1. Read the resolved component API from `ds-api`.
2. Inspect valid property names and enum values from the CEM.
3. Map Figma variant labels onto SLDS props:
   - `Primary` → `variant: "primary"`
   - `Large` → `size: "lg"` or project-specific valid value
   - state flags like `Disabled` → `disabled: true`
4. If a Figma value is not a valid enum member:
   - choose the closest valid match
   - add a warning explaining the substitution
5. Do not invent props that are absent from the CEM.
```

### Composition validation
Resolved nodes must obey SLDS composition rules before code generation.

```
1. Query each resolved component's composition data from `ds-api`.
2. Validate parent/child combinations.
3. If the child is valid:
   - keep the relationship
4. If the child is invalid but flattening is safe:
   - lift the child to the nearest valid ancestor
   - add a warning
5. If a circular composition is detected:
   - break the cycle at the lowest-confidence edge
   - record a warning
```

### Token mapping
Design values should land on design tokens, not hard-coded styles.

```
1. Map Figma fills to semantic color tokens:
   - solid brand fill → `var(--sl-color-*)`
   - border or neutral fills → nearest semantic token
2. Map typography to text tokens:
   - font role, size, line-height → `var(--sl-text-*)`
3. Map spacing to size tokens when a stable equivalent exists.
4. Keep raw values out of the final tree unless no token match exists.
5. If no safe token exists, add a warning for downstream review.
```

### Finalization
```
1. Aggregate mapping stats.
2. Compute per-node confidence from mapping source and warning count.
3. Lower overall confidence sharply if unmapped ratio exceeds 30%.
4. Write `slds-tree.json`.
5. Return the full artifact path and warnings to the caller.
```

## Failure Modes

| Failure | Detection | Recovery |
|---------|-----------|----------|
| CEM not available | `ds-api` query fails or version cache missing | Abort and ask `ds-api` to fetch the requested version first. |
| >30% unmapped components | `unmapped / totalComponents > 0.30` | Lower confidence dramatically and emit a prominent warning to the caller. |
| Invalid prop value (not in CEM enum) | Prop candidate not found in allowed values | Use the closest valid match and add a warning documenting the substitution. |
| Circular composition | Parent/child validation revisits the same node path | Break the cycle, preserve the highest-confidence branch, and flag the issue in `warnings`. |

## Confidence Scoring

| Condition | Score |
|-----------|-------|
| Mostly direct matches with valid props and no composition issues | 92–100 |
| Mix of direct and curated matches with minor warnings | 80–91 |
| Several heuristic matches but low unmapped count | 65–79 |
| Unmapped ratio above 30% or multiple invalid-prop substitutions | 30–64 |
| CEM missing or mapping cannot proceed | 0 |

## Design Decisions

1. **Deterministic mappings run before heuristics.** Direct and curated matches are cheaper, more explainable, and easier to audit than fuzzy inference.
2. **`ds-api` is the only source of SLDS truth.** Property names, enum values, and composition rules must come from versioned API data, not handwritten assumptions.
3. **Unmapped components remain visible.** Emitting placeholders preserves page structure while making gaps explicit instead of hiding them in failed generation.
4. **Token mapping is semantic first.** The goal is SLDS-consistent output, so colors and typography should resolve to `var(--sl-*)` tokens whenever possible.
5. **Composition validation happens during mapping, not later.** Catching invalid parent/child combinations early prevents downstream planners from building on impossible trees.
6. **Confidence follows mapping provenance.** Direct matches should score highest, curated mappings slightly lower, heuristics lower still, and unmapped nodes should never appear certain.
