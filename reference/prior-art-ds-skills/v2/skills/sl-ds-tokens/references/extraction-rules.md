---
topic: extraction-rules
applies_to: [sl-ds-tokens]
last_updated: 2026-06-09
---

# Token Extraction Rules — Sub-Agent Contract

> **Purpose:** Loaded by `/sl-ds-tokens` Steps 2-5 (extractor sub-agent). Defines the EXACT Figma MCP call patterns, the "5 nodes minimum" rule, icon mapping algorithm, and asset download conventions. Self-contained for a clean-context sub-agent.

## 1. Node tree construction (Step 2)

```
Call: get_metadata
With: { figmaUrl: <input>, depth: 5 }
```

Capture every descendant with:
- `nodeId`
- `name`
- `type` (FRAME, TEXT, INSTANCE, RECTANGLE, ELLIPSE, COMPONENT, GROUP, VECTOR)
- `x`, `y`, `width`, `height` (absolute positions — sum parent offsets)
- `fills` (if present)
- `componentId` (if INSTANCE — identifies which library component)

Output `.sl-ds-cache/sl-ds-impl/node-tree.json`:

```json
{
  "schemaVersion": "1.0.0",
  "producedBy": "sl-ds-tokens/token-extractor",
  "rootNodeId": "1:185",
  "nodes": [
    { "id": "1:185", "name": "Teacher Dashboard", "type": "FRAME", "x": 0, "y": 0, "w": 1440, "h": 1100, "parent": null },
    { "id": "1:186", "name": "Topbar", "type": "FRAME", "x": 24, "y": 24, "w": 1392, "h": 40, "parent": "1:185" }
  ]
}
```

## 2. Exhaustive token extraction (Step 3) — THE critical step

### 2.1 Why exhaustive is required

Calling `get_variable_defs` on ONE node returns ONLY the tokens used by THAT node. Different node types (text vs frame vs button) reference different token namespaces. Sampling 1-2 nodes silently misses 30-50% of the design's tokens, which causes:
- Hardcoded hex values in generated code (no token to use)
- Theme switching breaks
- "Visual works in Figma, wrong in code" bugs that take hours to debug

### 2.2 The "5 nodes minimum" rule

Identify representatives across these visual categories from `node-tree.json`:

| Category | How to pick a representative |
|---|---|
| Root frame | The screen-level FRAME — gives layout/spacing tokens |
| Text node | Any TEXT — gives typography tokens (font-family, size, weight, line-height, color) |
| Colored frame | A FRAME with non-null `fills` — gives background/foreground tokens |
| Button instance | An INSTANCE whose name contains "button" / "btn" / similar — gives interactive tokens |
| Card/bordered frame | A FRAME with stroke or shadow — gives border/elevation tokens |

If the design has MORE distinct categories (e.g. inputs, badges, dividers, icons), add representatives. **Minimum 5, no upper limit** — but each call costs tokens.

**Pragmatic cap:** 10 calls. Beyond that, returns are diminishing.

### 2.3 The call

For each representative:

```
Call: get_variable_defs
With: { nodeId: <representativeId> }
Returns: { variables: { "<path>": "<value>", ... } }
```

Example return:

```json
{
  "variables": {
    "color/foreground/primary/bold": "#0a6165",
    "color/background/surface/default": "#ffffff",
    "spacing/lg": "24",
    "typography/font-family/display": "Open Sans",
    "typography/font-weight/bold": 700
  }
}
```

### 2.4 Merge + deduplicate

Build a single map keyed by token path. If two calls return the SAME path:
- Same value → keep one copy (expected for shared tokens)
- Different value → record both with `evidence` (which node returned which); flag for the verifier to fail on

```json
{
  "schemaVersion": "1.0.0",
  "producedBy": "sl-ds-tokens/token-extractor",
  "tokensCalled": 6,
  "tokens": {
    "color/foreground/primary/bold": {
      "value": "#0a6165",
      "evidence": [
        { "nodeId": "1:186", "context": "topbar fill" },
        { "nodeId": "1:200", "context": "hero text" }
      ]
    }
  },
  "conflicts": []
}
```

### 2.5 NEVER trust fallback values

The CSS that comes from `get_design_context` looks like:

```css
color: var(--color/foreground/primary/bold, #1727b6);
/*                                          ^^^^^^^ FALLBACK — may be wrong theme */
```

The fallback `#1727b6` is the DEFAULT theme's value. The active theme overrides it to `#0a6165`. **Always use `get_variable_defs` (resolved values), never fallbacks.**

This is the #1 cause of "looks wrong in code, looks right in Figma" — verified by `/sl-ds-verify` geometric/visual diff.

## 3. Icon extraction (Step 4)

For each node in `node-tree.json` matching:
- `type: VECTOR` OR
- `name` contains `icon`/`ic-`/`fa-`/`mdi-` OR
- `componentId` resolves to a known icon library

### 3.1 Map to DS icon

```
keyword = extract_keyword(figma_name)
  // "icon/graduation-cap" → "graduation-cap"
  // "fa-regular/users" → "users"
  // "mdi-home-outline" → "home-outline"

Call: search_design_system("icon " + keyword)
```

If hits with high confidence → map to `sl-icon name="<sl-ds-name>"`.

### 3.2 If no match → download SVG

```
Call: get_screenshot
With: { nodeId: <iconNodeId>, format: "svg" }
```

Save to `<targetScope>/public/icons/<keyword>.svg`. Reference as `<img src="icons/<keyword>.svg">` later.

### 3.3 Output schema

```json
{
  "schemaVersion": "1.0.0",
  "producedBy": "sl-ds-tokens/token-extractor",
  "icons": [
    {
      "figmaNodeId": "I1:687;3:23",
      "figmaName": "icon/graduation-cap",
      "keyword": "graduation-cap",
      "resolved": true,
      "dsName": "fas-graduation-cap",
      "svgPath": null
    },
    {
      "figmaNodeId": "I1:688;3:24",
      "figmaName": "custom/widget-doodle",
      "keyword": "widget-doodle",
      "resolved": false,
      "dsName": null,
      "svgPath": "public/icons/widget-doodle.svg"
    }
  ]
}
```

## 4. Image asset extraction (Step 5)

For nodes that are decorative images (large RECTANGLE with image fill, or named like `bg-*`, `hero-image`, `pattern-*`):

```
Call: get_screenshot
With: { nodeId: <imageNodeId>, format: "png" }  // or jpg/webp if available
```

Save to `<targetScope>/public/images/<derived-name>.<ext>`. Track in `assets.json`:

```json
{
  "schemaVersion": "1.0.0",
  "assets": [
    {
      "figmaNodeId": "1:300",
      "figmaName": "hero-pattern-bg",
      "path": "public/images/hero-pattern-bg.png",
      "width": 1392,
      "height": 800
    }
  ]
}
```

## 5. Performance discipline

| Call | Cost |
|---|---|
| `get_metadata` (depth 5) | ~3K tokens |
| `get_variable_defs` per node | ~500 tokens |
| `search_design_system` per icon | ~1K tokens |
| `get_screenshot` per asset | ~1K tokens (metadata response; binary doesn't count) |

Budget: 15-25K total for MEDIUM scope. If running over → STOP early, return what you have with `errors: [{ reason: "budget exceeded" }]`.

## 6. What NOT to do

- ❌ Don't call `get_variable_defs` on just 1-2 nodes (defeats the whole skill)
- ❌ Don't sample randomly — pick one per visual category systematically
- ❌ Don't trust `get_design_context` fallback values for actual token values (only for cross-checks in verifier)
- ❌ Don't try to deduce tokens from raw CSS — that's what the fallbacks ARE; use `get_variable_defs`
- ❌ Don't download icons that already have DS matches (saves tokens + disk + future drift)
- ❌ Don't modify any code file — write only `.sl-ds-cache/sl-ds-impl/*.json` and `<targetScope>/public/{icons,images}/*`
