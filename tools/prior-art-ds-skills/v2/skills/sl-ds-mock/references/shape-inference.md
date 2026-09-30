---
topic: shape-inference
applies_to: [sl-ds-mock]
last_updated: 2026-06-10
---

# Shape Inference — Sub-Agent Contract

> **Purpose:** Loaded by `/sl-ds-mock` Step 2 (shape-inferrer sub-agent). Defines how to scan node-tree.json text nodes, group them into collections, infer field shapes, and apply locale-aware generation.

## 1. Inputs

- `node-tree.json` path (full tree)
- `component-map.json` path (element classifications)
- Model interface text (from service/store file)
- `--locale` value (default detected from `.sl-ds-config.yaml`)

## 2. Collection grouping algorithm

A "collection" is a set of sibling/structurally-similar Figma nodes that the UI iterates over (e.g. group cards in a list). Detect by:

### 2.1 Sibling-name pattern

Look for parent nodes whose children have names matching a pattern like `<base>-card-<N>`, `<base>-item-<N>`, `<base>-row-<N>`:

```text
parent: "groups-list" (FRAME)
  children:
    - "group-card-1" (FRAME)
    - "group-card-2" (FRAME)
    - "group-card-3" (FRAME)
```

→ collection name = "groups", model field = `DashboardGroup[]` (read from model interface).

### 2.2 Repeated structure (without numeric suffix)

Sibling FRAMES with identical descendant counts and same TEXT-node positions → likely a collection where the designer didn't use numeric suffixes.

Threshold: ≥ 3 siblings with similar internal structure → treat as collection.

### 2.3 Single-row case

If only 1 representative item visible in Figma (designer showed just one card), still treat as collection. Generate `--rows` items based on the single template.

## 3. Field type inference per text node

For each TEXT node inside a collection item, infer field type:

| Figma text content | Inferred kind | TypeScript shape |
|---|---|---|
| Personal-name-shape (`First Last`) | `string` (name) | `string` |
| Single word, often used as label (`Active`, `Pending`) | `enum` (string union) | `'Active' \| 'Pending' \| ...` |
| Integer in clearly-countable context ("24 students") | `number` (count, range derived from sample) | `number` |
| Percentage ("75%") | `percentage` (0.0-1.0 OR 0-100 — match source) | `number` |
| Currency ("$1,234.56", "1234.56 PLN") | `currency` (number + currency code) | `{ amount: number; currency: string }` |
| ISO-like date ("2026-06-10", "10 Jun 2026") | `date` | `Date \| string (ISO)` |
| Relative date ("2 days ago", "Yesterday") | `date-recent` | `Date` |
| URL-shape ("https://...") | `url` | `string` |
| Email-shape | `email` | `string` |
| Free text (description, paragraph) | `text` | `string` |
| Numeric ID, hex string | `id` (uuid by default) | `string` |
| Unknown | `string` (fallback) | `string` |

If a model interface field already has a TypeScript type → respect it (don't override based on Figma); just use Figma to populate values.

## 4. Per-field value generation

Once kind is decided, generate values:

| Kind | Generation rule (locale-aware) |
|---|---|
| `id` (uuid) | `crypto.randomUUID()` |
| `name` (person) | Locale-specific name list (PL: ["Marcin Nowak", "Kasia Wiśniewska", ...]; EN: ["John Smith", ...]) |
| `name` (class/group) | Pattern from sample (`Class <N><L>` → `Class 3A`, `Class 3B`, ...) |
| `string` (label) | Use Figma sample values verbatim (first 3); generate variations after |
| `enum` | Use Figma samples as the union members |
| `number` (count) | Uniform random in `[min(sample), max(sample) ± 20%]`, integer |
| `percentage` | Uniform random in `[0.0, 1.0]` (or `[0, 100]` matching source format) |
| `currency` | Random amount in plausible range (e.g. 10-10000), code from locale |
| `date` | Random within ±30 days of today |
| `date-recent` | Random within last 30 days, weighted toward recent |
| `url` | Placeholder URLs (e.g. `https://example.com/<id>`) |
| `email` | `<name>@example.com` (no real emails) |
| `text` (description) | Locale-aware lorem-ipsum-style 1-3 sentences |

**Important:** mock data NEVER includes real PII, real URLs to non-example domains, real emails of actual people, real currency amounts from production. The mock generator's outputs are explicitly seed-data, not production fixtures.

## 5. Sub-agent output schema (Step 2)

```json
{
  "schemaVersion": "1.2.0",
  "producedBy": "sl-ds-mock/shape-inferrer",
  "producedAt": "<iso>",
  "collections": [
    {
      "modelName": "<from model interface>",
      "inferredFrom": ["<list of source Figma nodeIds>"],
      "fieldShapes": {
        "<fieldName>": {
          "kind": "<one-of-§3>",
          "examples": ["<first 3 values from Figma>"],
          "range": [min, max],  // for numeric kinds
          "pattern": "<regex-like string for predictable patterns>"  // optional
        }
      },
      "rowCount": <int from sample, fall back to --rows>,
      "confidence": "high" | "medium" | "low"
    }
  ],
  "unmappedTextNodes": [
    { "nodeId": "<id>", "text": "<content>", "reason": "<not-a-collection-item rationale>" }
  ],
  "appliedRules": ["DATA-1", "DATA-3", ...]
}
```

`confidence` levels:
- `high`: sample has ≥ 3 collection items with consistent structure
- `medium`: 1-2 items visible; shape is plausible but rows must be generated speculatively
- `low`: model interface has a field the sub-agent couldn't shape-infer from Figma (Figma didn't show data; e.g. an empty list state was rendered)

Per `cache-schema.md` §2.1, `confidence: low` items get surfaced in `/sl-ds-mock` Step 5 summary and the user can opt to fill manually.

## 6. Idempotent merge (Step 3 in orchestrator)

When existing mocks have non-trivial values, preserve them. Algorithm:

```python
for item in existingMockArray:
  for fieldName in modelInterface:
    if fieldName in item AND value is "non-trivial" (not null, [], '', 0):
      preserve item[fieldName]
    else:
      item[fieldName] = generate(fieldShapes[fieldName])

# If existing array length < --rows, append new items fully generated
for i in range(len(existing), --rows):
  existingMockArray.append(generate-full-item(fieldShapes))
```

"Non-trivial" means a real value the user might have hand-edited. Empty defaults are eligible for fill.

## 7. Performance budget

- node-tree.json read: up to 30K
- Collection grouping: in-memory, ~1K tokens
- Field inference per collection: ~500 tokens
- Total sub-agent: 3-8K typical

If node-tree.json is huge (>100K) → sub-agent should sample (don't read the whole tree); focus on first 3 collection items per parent.

## 8. What NOT to do

- ❌ Don't generate real personal data — always synthetic
- ❌ Don't infer types that contradict the model interface (model wins)
- ❌ Don't overwrite hand-edited mocks without `--force` (idempotency is the safety net)
- ❌ Don't generate locale-mixed data (Polish names + English class labels) — match `--locale` consistently
- ❌ Don't infer collections from < 3 similar siblings unless explicit single-row case (heuristic gets noisy at low counts)
