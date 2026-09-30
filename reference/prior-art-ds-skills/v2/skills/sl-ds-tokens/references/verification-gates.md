---
topic: verification-gates
applies_to: [sl-ds-tokens]
last_updated: 2026-06-09
---

# Token Verification — Hard Gates

> **Purpose:** Loaded by `/sl-ds-tokens` Step 7 (verifier sub-agent). Independent of the extractor — uses DIFFERENT clean context so an extractor bug can't slip through verification. Defines the exact gates and what happens on failure.

## 1. Inputs

- `tokens-raw.json` produced by Step 3
- `figmaUrl` (same as extractor used)

## 2. Cross-reference pass

### 2.1 Get the fallback CSS

```
Call: get_design_context
With: { nodeId: <rootNodeId> }
Returns: { css: "...full CSS with var(--name, fallback) values..." }
```

### 2.2 For each token in tokens-raw.json

Parse `css` to find the same token. If present:

```
Resolved (from extractor): #0a6165
Fallback (from this call):  #1727b6
Match: false
```

Record per-token:

```json
{
  "tokenPath": "color/foreground/primary/bold",
  "resolved": "#0a6165",
  "fallback": "#1727b6",
  "match": false,
  "sourceCount": 2
}
```

`match: false` is EXPECTED in themed projects (resolved differs from fallback). `match: true` for ALL tokens → suspicious (see Gate 2 below).

## 3. Hard gates — the entire point of this step

Apply in order; FAIL the first gate that trips.

### Gate 1: Sufficient extraction

```
if (Object.keys(tokens).length < 5) FAIL("Too few tokens — extraction was shallow")
```

**Why this gate:** an empty or near-empty token set means the extractor called `get_variable_defs` on a node with no variables (e.g. a raw shape), or the Figma file has no defined variables. Either way, downstream skills will hardcode hex values. Catch it here.

### Gate 2: Not all fallback

```
let matchCount = tokens.filter(t => t.match === true).length
let total = tokens.length
if (matchCount === total) FAIL("All resolved values equal fallback — extractor returned defaults, not theme overrides")
```

**Why this gate:** if EVERY token's resolved value equals the CSS fallback, the extractor didn't actually use the active theme — it returned defaults. This produces a "looks right in browser, wrong in code with theme switching" failure. Caught here.

### Gate 3: Cross-node consistency

For each token path that has `evidence.length > 1` in tokens-raw.json:
- The `value` field must be a single string (not an array of conflicting values)
- The extractor pre-flagged conflicts in `tokens-raw.json` → `conflicts` array

```
if (tokensRaw.conflicts.length > 0) {
  FAIL("Cross-node inconsistency: " + JSON.stringify(tokensRaw.conflicts.slice(0,3)))
}
```

**Why this gate:** if the same token path returned `#0a6165` from one node and `#1727b6` from another, the extractor logic has a bug, the Figma file is broken, or there are unmapped theme overrides. Code generated from inconsistent tokens is non-deterministic.

### Gate 4: DS vocabulary

For each token, check format:

| Token type | Expected pattern |
|---|---|
| Color | `color/<category>/<variant>/<state>?` (e.g. `color/foreground/primary/bold`) |
| Spacing | `spacing/<size>` or `space/<size>` (e.g. `spacing/lg`) |
| Typography font-family | Plain font name (e.g. `"Open Sans"`) — NOT `"Open Sans:Regular"` (Figma raw format) |
| Typography weight | Numeric (e.g. `700`) — NOT `"Bold"` |
| Typography size | Numeric pixel count or rem (e.g. `16`) |
| Border radius | `radius/<size>` or `border-radius/<size>` |

```
for (token of tokens) {
  if (token.path.startsWith("typography/font-family") && token.value.includes(":")) {
    FAIL(`Font format raw Figma — got "${token.value}", expected "Open Sans" not "Open Sans:Regular"`)
  }
  if (token.path.startsWith("typography/font-weight") && typeof token.value === "string") {
    FAIL(`Font weight should be numeric — got "${token.value}"`)
  }
}
```

### Gate 5: Color gamut

```
for (token of tokens) {
  if (token.path.startsWith("color/")) {
    if (!/^#[0-9a-fA-F]{6}$/.test(token.value) && !token.value.startsWith("rgb")) {
      FAIL(`Invalid color format: "${token.value}" — must be #RRGGBB or rgb()`)
    }
    if (/^#[0-9a-fA-F]{3}$/.test(token.value)) {
      FAIL(`Color uses 3-digit shorthand: "${token.value}" — must be 6-digit`)
    }
  }
}
```

Named colors like `"red"` or `"transparent"` → FAIL (use explicit values; `transparent` is fine as a special case if needed but flag).

## 4. Output on success

Write `.sl-ds-cache/sl-ds-impl/tokens-verified.json`:

```json
{
  "schemaVersion": "1.0.0",
  "producedBy": "sl-ds-tokens/token-verifier",
  "producedAt": "2026-06-09T...",
  "inputs": {
    "figmaUrl": "https://...",
    "figmaLastModified": "2026-06-08T10:00:00Z",
    "tokensRawHash": "sha256:..."
  },
  "summary": {
    "total": 41,
    "byCategory": {
      "color": 18,
      "spacing": 8,
      "typography": 9,
      "border": 6
    },
    "themeOverrides": 11
  },
  "tokens": {
    "color/foreground/primary/bold": {
      "value": "#0a6165",
      "fallback": "#1727b6",
      "themeOverride": true,
      "evidenceNodeIds": ["1:186", "1:200"]
    }
  }
}
```

**This is the source of truth.** `/sl-ds-implement` reads ONLY this file for token values.

## 5. Output on failure

If ANY gate fails, write `.sl-ds-cache/sl-ds-impl/failure-tokens.json`:

```json
{
  "schemaVersion": "1.0.0",
  "skill": "sl-ds-tokens",
  "step": "7 — verify tokens",
  "at": "2026-06-09T...",
  "kind": "hard-gate",
  "gate": 2,
  "gateName": "Not all fallback",
  "expected": "Some tokens differ from CSS fallbacks (theme overrides present)",
  "found": "All 18 tokens equal their fallback values",
  "diagnostic": {
    "sampleTokens": [
      { "path": "color/foreground/primary/bold", "resolved": "#1727b6", "fallback": "#1727b6" }
    ]
  }
}
```

Do **NOT** write `tokens-verified.json` on failure — that would let downstream skills proceed with bad data.

## 6. What NOT to do

- ❌ Don't try to auto-fix tokens — if the extractor produced bad data, surface it; the user (or `/sl-ds-update`) decides
- ❌ Don't read tokens-raw.json on a cache check — read it inside the verifier sub-agent's clean context
- ❌ Don't call `get_variable_defs` again — that's the extractor's job; the verifier uses `get_design_context` ONCE for cross-reference, plus internal consistency checks
- ❌ Don't downgrade FAIL to WARN — the gates exist because each one catches a real bug class. Suppressing one means the bug ships
