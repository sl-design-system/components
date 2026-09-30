---
name: ds-figma
type: sub-agent
prefix: ds
version: 1.0.0
description: Extracts a deduplicated Figma component tree and layout model for downstream SLDS mapping
called_by:
  - ds-impl
  - ds-proto
  - ds-audit
invokes:
  - Figma MCP API
token_budget: "10–28K"
---

# ds-figma

Builds a **normalized, reusable component-tree snapshot** from one or more Figma screens so downstream agents can reason about structure instead of raw design nodes. It minimizes token waste through staged inspection, aggressive deduplication, and cache reuse. In audit flows, it can also compare the latest design state against a cached snapshot to highlight meaningful change.

## Purpose

`ds-figma` exists to turn a Figma URL into a stable intermediate representation that other agents can consume without knowing Figma internals. It isolates all external Figma access, applies multi-screen deduplication, captures layout semantics, and emits a deterministic `component-tree.json` artifact for mapping, prototyping, or audit workflows.

## Input

```json
{
  "figmaUrl": "https://www.figma.com/design/abc123/Product?node-id=456-789",
  "mode": "full",
  "cache": true
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `figmaUrl` | Yes | Figma file or frame URL to inspect; must resolve to a readable file and target frame or page |
| `mode` | Yes | `full` = run all three passes and emit structure + components + layout; `structure-only` = only pass 1 with minimal node metadata |
| `cache` | Yes | Whether to read and write `.ds-cache/figma/` artifacts using the file/frame/lastModified cache key |

## Output

```json
{
  "fileId": "abc123",
  "frameId": "456:789",
  "lastModified": "2026-05-20T10:00:00Z",
  "shared_components": [
    {
      "figmaName": "Button/Primary/Large",
      "figmaId": "123:456",
      "type": "instance",
      "properties": { "variant": "primary", "size": "large" },
      "children": []
    }
  ],
  "pages": [
    {
      "name": "login",
      "frameId": "789:012",
      "components": [
        {
          "figmaName": "Form/Input",
          "figmaId": "222:333",
          "type": "instance",
          "properties": { "state": "default" },
          "children": []
        }
      ],
      "uses_shared": ["Button/Primary/Large"],
      "layout": { "type": "auto-layout", "direction": "vertical", "gap": 16 }
    }
  ]
}
```

| Field | Description |
|-------|-------------|
| `fileId` | Figma file identifier parsed from the URL |
| `frameId` | Root frame or node identifier normalized to Figma API format |
| `lastModified` | File modification timestamp used for cache validation |
| `shared_components` | Deduplicated component definitions fetched once and referenced from pages |
| `pages` | Per-screen or per-frame structure extracted from the requested scope |
| `pages[].components` | Abstract component nodes for that page after instance/group normalization |
| `pages[].uses_shared` | Names of shared components referenced by the page |
| `pages[].layout` | High-level layout description for the page container and responsive intent |

## Behavior

### Overview
`ds-figma` uses a three-pass strategy so it never spends tokens on details before confirming they are needed.
```
1. Parse `figmaUrl` into { fileId, frameId, pageId? }.
2. Read file metadata and `lastModified`.
3. Build cache key: {file-id}--{frame-id}@{lastModified}.
4. If cache enabled and valid artifact exists:
   → return cached `component-tree.json`
   → unless caller is in diff mode, where cached state becomes the comparison baseline
5. Run pass 1, then optionally pass 2 and pass 3 depending on `mode`.
6. Normalize output, write cache, and return the final tree.
```

### Pass 1: STRUCTURE
Pass 1 establishes the screen inventory and rough hierarchy using only top-level frame data.
```
API calls: 1–3
Token target: 2–5K

1. Fetch file metadata, top-level pages, and selected frame subtree shell.
2. Identify the requested scope:
   - single frame
   - sibling frames in one page
   - multiple target screens for audit/diff mode
3. For each screen, capture:
   - page/frame name
   - frameId
   - top-level children
   - node types (frame, group, instance, text, vector)
   - basic layout mode hints (auto-layout, freeform, constraints)
4. Collapse obvious decoration-only nodes when they do not affect hierarchy.
5. Emit an initial abstract tree with unresolved component references.
```

If `mode="structure-only"`, stop here and return the structure artifact with reduced confidence because component and layout detail were not verified.

### Pass 2: COMPONENTS
Pass 2 drills into unique component instances and resolves reusable building blocks.
```
API calls: 5–20
Token target: 5–15K

1. Walk the pass 1 tree and collect unique inspectable components by:
   - component id
   - component set id
   - normalized Figma name
2. Apply multi-screen deduplication:
   - if the same component appears in multiple screens, fetch it once
   - store one canonical definition in `shared_components`
   - replace duplicates with page references via `uses_shared`
3. Apply direct mapping optimization:
   - if a Figma component name clearly matches SLDS naming
     (example: `Button/Primary/Large`)
   - infer component role and variant properties from the name
   - skip deep child inspection unless overrides or ambiguous content exist
4. For components that still need inspection, fetch instance details and variant props.
5. Capture per-node metadata:
   - `figmaName`
   - `figmaId`
   - `type`
   - inferred properties
   - normalized children
6. Cap recursive descent at 10 nesting levels.
7. Mark components exceeding the depth cap with a warning and confidence penalty.
```

### Pass 3: LAYOUT
Pass 3 refines spatial behavior so downstream composition and mapping can preserve intent.
```
API calls: 3–10
Token target: 3–8K

1. Revisit containers that influence composition:
   - auto-layout frames
   - grids
   - responsive wrappers
   - repeated card/list shells
2. Extract layout semantics:
   - direction
   - gap
   - padding
   - alignment
   - wrap behavior
   - constraints and resize modes
3. Detect responsive groups by comparing sibling frames or breakpoint-like variants.
4. Normalize layout into compact JSON:
   { type, direction, gap, align, justify, padding, responsive? }
5. Attach page-level layout and nested container layout metadata.
```

### Cache and invalidation
Cache is keyed by the exact design revision the agent observed.
```
cacheKey = "{file-id}--{frame-id}@{lastModified}"
```

```
1. On start, fetch `lastModified` before reading cached content.
2. If `lastModified` matches the artifact key:
   → cache is fresh
3. If `lastModified` changed:
   → invalidate the root artifact
4. For multi-screen trees, perform partial invalidation:
   - preserve unchanged shared component payloads
   - re-fetch only affected pages or components whose source revision changed
5. Write the new `component-tree.json` after normalization completes.
```

### Diff mode
When called by `ds-audit`, `ds-figma` can compare the live design against the cached or previous snapshot.

```
1. Load baseline tree from cache or explicit previous artifact.
2. Run extraction against current Figma state.
3. Compare by page name, frameId, shared component key, and normalized properties.
4. Classify changes:
   - added component
   - removed component
   - renamed component
   - property delta
   - layout delta
5. Return the current tree plus diff metadata for downstream audit reporting.
```

### Normalization rules
```
1. Prefer component instances over raw vector/text fragments when both are available.
2. Preserve human-meaningful page names in kebab-case or original naming as provided.
3. Convert Figma property labels into plain JSON-friendly keys.
4. Do not embed pixel-perfect noise when it has no mapping value.
5. Keep shared components canonical and pages reference-only where possible.
```

## Failure Modes

| Failure | Detection | Recovery |
|---------|-----------|----------|
| Figma API rate limit | 429 response or explicit rate-limit headers | Apply exponential backoff, then fall back to cache if a matching or stale artifact exists. |
| Figma unavailable | Network failure, repeated 5xx, or MCP endpoint unavailable | Abort with `blocked-external` status and explain that Figma could not be reached. |
| Auth failure | 401/403 with missing or invalid auth context | Abort immediately and prompt for `FIGMA_ACCESS_TOKEN`. |
| Expired token | Auth succeeds structurally but Figma reports token expired/revoked | Abort and request token rotation before retry. |
| Deeply nested component (>10 levels) | Recursion depth counter exceeds 10 | Cap traversal at 10, emit truncated children, and lower confidence. |
| Permission denied on file | File metadata request returns access denied | Abort and explain that file or frame access must be granted. |

## Confidence Scoring

| Condition | Score |
|-----------|-------|
| Strong component-name matches, shallow hierarchy, clear auto-layout usage | 92–100 |
| Most components deduplicated with minor ambiguity in variants | 82–91 |
| Mixed naming quality or several manually inferred layouts | 65–81 |
| Deep nesting, weak naming, or heavy fallback to stale cache | 35–64 |
| File unreadable, auth blocked, or no usable cache | 0 |

## Design Decisions

1. **Three-pass extraction instead of one deep crawl.** This keeps token use proportional to ambiguity: easy screens stay cheap, while complex screens spend detail only where needed.
2. **Shared component deduplication is first-class.** Multi-screen files often repeat the same button, input, or card dozens of times; fetching once improves cost, consistency, and auditability.
3. **Direct naming optimization beats unnecessary inspection.** When Figma names already encode SLDS intent, trusting that signal is cheaper and usually more accurate than re-deriving the same answer from low-level nodes.
4. **Cache key includes `lastModified`.** Revision-aware caching prevents stale snapshots from silently contaminating mapping or audit flows.
5. **Layout is captured semantically, not pixel-perfect.** Downstream agents need composition intent and tokenizable spacing, not exhaustive rendering detail.
6. **Diff mode lives in the same agent.** Audits depend on identical extraction rules for both baseline and current state, so comparison belongs next to extraction rather than in a separate parser.
