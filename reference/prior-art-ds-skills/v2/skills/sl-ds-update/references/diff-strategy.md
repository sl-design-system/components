---
topic: diff-strategy
applies_to: [sl-ds-update]
last_updated: 2026-06-09
---

# Diff Strategy — Sub-Agent Contracts

> **Purpose:** Loaded by `/sl-ds-update` Step 2 (figma-snapshotter) and Step 3 (diff-engine). Defines what to fetch fresh from Figma, how to compute the diff against cached state, and how to categorize the result.

## 1. Fresh fetch (Step 2, figma-snapshotter sub-agent)

The snapshotter re-runs a SUBSET of what `/sl-ds-tokens` does — just enough to detect any change.

### 1.1 Decide whether to proceed

```
Call: get_metadata
With: { figmaUrl: <cached or input> }
```

If response `lastModified` equals the cached `figmaLastModified` → return early with `{ status: "unchanged" }`. Skill orchestrator will STOP with "Nothing to update."

### 1.2 Rebuild node tree

Same as `/sl-ds-tokens` Step 2 — full `get_metadata` on root with depth 5. Write into `figma-snapshot.json` under `nodeTree` field.

### 1.3 Re-extract tokens at SAME representative nodes

Read the cached `tokens-verified.json` and extract the union of `evidenceNodeIds` across all tokens. These are the nodes the original extractor used. Re-call `get_variable_defs` on each:

```
For each nodeId in cached evidenceNodeIds:
  Call: get_variable_defs
  With: { nodeId }
  Merge into snapshot.tokens, recording values
```

**Why same nodes:** if we re-extract from different nodes, the diff would mix "Figma changed" with "extractor picked different nodes," making the diff unreliable.

**Edge case:** if a cached evidence node was DELETED in Figma → tokens that ONLY came from that node show as `removed` in the diff. That's correct.

### 1.4 Snapshot icons

For each icon node in the fresh tree:
- If the Figma name matches a name in cached `icons.json` → record as `unchanged`
- If new (not in cached) → record as `added`
- If cached but not in fresh tree → record as `removed`

### 1.5 Output schema (figma-snapshot.json)

```json
{
  "schemaVersion": "1.0.0",
  "producedBy": "sl-ds-update/figma-snapshotter",
  "producedAt": "2026-06-15T...",
  "figmaUrl": "...",
  "lastModified": "2026-06-15T10:00:00Z",
  "cachedLastModified": "2026-06-08T10:00:00Z",
  "status": "changed",
  "nodeTree": { /* same shape as sl-ds-tokens node-tree.json */ },
  "tokens": { /* same shape as tokens-verified.json.tokens, fresh values */ },
  "icons": [ /* same shape as icons.json */ ]
}
```

## 2. Diff algorithms (Step 3, diff-engine sub-agent)

The diff-engine is independent of the snapshotter — clean context, only inputs and these algorithms.

### 2.1 Token diff

```python
def token_diff(cached_tokens, fresh_tokens):
  cached_paths = set(cached_tokens.keys())
  fresh_paths = set(fresh_tokens.keys())

  added   = [{ "path": p, "value": fresh_tokens[p].value }
             for p in fresh_paths - cached_paths]
  removed = [{ "path": p }
             for p in cached_paths - fresh_paths]
  changed = [{ "path": p, "from": cached_tokens[p].value, "to": fresh_tokens[p].value }
             for p in cached_paths & fresh_paths
             if cached_tokens[p].value != fresh_tokens[p].value]

  return { added, removed, changed, unchanged_count: len(...) }
```

Compare token values strictly — `"#0a6165"` vs `"#0A6165"` SHOULD be normalized to lowercase before compare.

### 2.2 Node diff

Match nodes across cached + fresh by `nodeId`. The Figma API generally preserves IDs unless the node was deleted and recreated.

```python
def node_diff(cached_tree, fresh_tree):
  cached_ids = { n.id: n for n in cached_tree.nodes }
  fresh_ids  = { n.id: n for n in fresh_tree.nodes }

  added   = [n for id, n in fresh_ids.items() if id not in cached_ids]
  removed = [n for id, n in cached_ids.items() if id not in fresh_ids]

  matched_pairs = [(cached_ids[id], fresh_ids[id])
                   for id in cached_ids if id in fresh_ids]

  moved   = [{ "id": c.id, "from_pos": c.pos, "to_pos": f.pos }
             for c, f in matched_pairs if c.x != f.x or c.y != f.y]
  resized = [{ "id": c.id, "from": (c.w, c.h), "to": (f.w, f.h) }
             for c, f in matched_pairs if c.w != f.w or c.h != f.h]
  renamed = [{ "id": c.id, "from": c.name, "to": f.name }
             for c, f in matched_pairs if c.name != f.name]

  return { added, removed, moved, resized, renamed }
```

### 2.3 Icon diff

Match by `keyword` (extracted from Figma name). New keyword = added; missing = removed; existing with different `dsName` resolution = changed.

### 2.4 Output schema (update-diff.json)

```json
{
  "schemaVersion": "1.0.0",
  "producedBy": "sl-ds-update/diff-engine",
  "producedAt": "2026-06-15T...",
  "figmaLastModifiedFrom": "2026-06-08T10:00:00Z",
  "figmaLastModifiedTo": "2026-06-15T10:00:00Z",
  "tokens": {
    "added": [...],
    "removed": [...],
    "changed": [...],
    "unchanged_count": 38
  },
  "nodes": {
    "added": [...],
    "removed": [...],
    "moved": [...],
    "resized": [...],
    "renamed": [...]
  },
  "icons": {
    "added": [...],
    "removed": [...],
    "changed": []
  },
  "category": "structural" | "layout-only" | "tokens-only" | "assets-only" | "mixed" | "none"
}
```

## 3. Categorization (Step 3, after diff)

The orchestrator uses `category` to pick which questions to ask. Decision rule:

```python
def categorize(diff):
  has_token_changes = diff.tokens.added or diff.tokens.removed or diff.tokens.changed
  has_node_structural = diff.nodes.added or diff.nodes.removed
  has_node_geometric = diff.nodes.moved or diff.nodes.resized
  has_icon_changes = diff.icons.added or diff.icons.removed
  has_renamed = diff.nodes.renamed

  if not any([has_token_changes, has_node_structural, has_node_geometric, has_icon_changes, has_renamed]):
    return "none"

  if has_node_structural:
    return "structural"  # most impactful — overrides others
  if has_node_geometric and not (has_token_changes or has_icon_changes):
    return "layout-only"
  if has_token_changes and not (has_node_geometric or has_icon_changes or has_node_structural):
    return "tokens-only"
  if has_icon_changes and not (has_node_structural or has_node_geometric or has_token_changes):
    return "assets-only"
  return "mixed"
```

**`mixed`** triggers per-category questioning in Step 5 — user picks an action for each non-empty category.

## 4. Renames are tricky

If `diff.nodes.renamed` is non-empty, the implication is **code naming** may need to change:
- A component named `max-promo-banner` based on Figma "Promo Banner" → if Figma renamed to "CTA Banner", the user MAY want `max-cta-banner`
- But the rename might be cosmetic — the user might prefer to keep the code name stable

**Strategy:** ALWAYS surface renames separately and ASK. Don't auto-rename code files — that's a refactor with import update implications.

```
> **Renamed in Figma (4 nodes):**
> - "Promo Banner" → "CTA Banner"  (would suggest: max-promo-banner → max-cta-banner)
> - "Hero" → "Hero Section"  (suggest: max-hero → max-hero-section)
>
> ⭐ **Keep code names stable** — only Figma name updates in cache; code untouched
> **Rename matched code files** — refactor with import updates (preview the diff first)
> **Decide per rename** — go through each one
```

## 5. Performance budget

| Operation | Tokens |
|---|---|
| `get_metadata` (depth 5 root) | ~3K |
| `get_variable_defs` per node | ~500 |
| Total fresh fetch | ~10-15K (similar to /sl-ds-tokens but lighter — no icons/assets re-download if names match) |
| Diff computation | <1K (mechanical) |

Diff sub-agent MUST complete in ≤2K tokens (it's just comparing two JSON structures). If exceeded → orchestrator escalates per model-routing.md §5 cost guardrails.

## 6. What NOT to do

- ❌ Don't run `get_variable_defs` on DIFFERENT nodes than the cached extraction — diff would be unreliable
- ❌ Don't re-download icons/images that haven't changed names — wastes budget
- ❌ Don't compare raw Figma JSON dumps — normalize to the cached schema first
- ❌ Don't auto-categorize `mixed` as `structural` — they need different handling
- ❌ Don't skip the snapshot archive (Step 1 of orchestrator) just because diff is small — the safety net costs nothing
