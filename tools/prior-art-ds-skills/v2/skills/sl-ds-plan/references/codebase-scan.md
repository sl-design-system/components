---
topic: codebase-scan
applies_to: [sl-ds-plan]
last_updated: 2026-06-09
---

# Codebase Scan — Decision Matrices

> **Purpose:** Loaded by `/sl-ds-plan` Steps 3-5. Provides the exact matrices for structure, data approach, DS component classification, and the JSON schema for `component-map.json`.

## 1. Inputs (already on disk)

- `.sl-ds-cache/sl-ds-impl/codebase-analysis.json` — produced by `/sl-ds-setup`
- `.sl-ds-cache/sl-ds-impl/tokens-verified.json` — produced by `/sl-ds-tokens`
- `.sl-ds-cache/sl-ds-impl/node-tree.json` — produced by `/sl-ds-tokens`
- `.sl-ds-cache/sl-ds-impl/icons.json` — produced by `/sl-ds-tokens`

## 2. Structure decision matrix (Step 3)

| `codebase-analysis.directoryStructure.pattern` | Action | Recommended option in question |
|---|---|---|
| `per-feature` (strong evidence: 2+ feature dirs) | Use without asking; log choice | — (skipped) |
| `per-type` (strong evidence: 3+ type dirs) | Use without asking; log choice | — (skipped) |
| `flat` (>15 items, no subdirs) | ASK — flat won't scale | ⭐ Per-feature split |
| `unknown` | ASK — no evidence either way | ⭐ Per-feature split (default for new code) |

**Strong evidence** = at least 2 example directories of that pattern from codebase-analysis.json.

## 3. Data approach decision matrix (Step 4)

| Codebase signal | Recommended | Rationale |
|---|---|---|
| `stateManagement.pattern: signal-store` with 2+ stores | ⭐ Signal Store | matches existing convention |
| `stateManagement.pattern: service-rxjs` | ⭐ Service with mock data (HTTP-ready) | matches existing |
| `stateManagement.pattern: static`/`none` | ⭐ Service with mock | smallest production-ready footprint |
| User explicitly says "prototype" or "throwaway" | Static inline | speed over reusability |
| `dsMode: custom` (no SLDS) | ⭐ Service with mock | same as above; DS choice is orthogonal |

**Always ask** — even when recommendation is strong — because data approach affects every future file. Confidence is in the rationale, not in the absence of options.

## 4. DS component classification (Step 5)

For each unique element type detected in `node-tree.json` (by `name` keyword + `type`), classify:

### 4.1 Classification rules

| Figma signal | Classification | Resolution |
|---|---|---|
| Name contains `button`/`btn` + `type: INSTANCE` | `sl-ds-component` | `search_design_system("button")` → sl-button + variant |
| Name contains `card` + `type: INSTANCE` | `sl-ds-component` | sl-card + variant. **BUT** if it has child layout grid → reclassify as `plain-div` with `card-like` CSS |
| Name contains `divider`/`separator` | `sl-ds-component` | sl-divider |
| Name contains `avatar` + `type: INSTANCE` | `sl-ds-component` | sl-avatar |
| Name contains `nav`/`navigation` + has children | `sl-ds-component` | sl-navigation / sl-nav-item |
| Name contains `badge`/`chip` | `sl-ds-component` | sl-badge |
| Name contains `input`/`field`/`textbox` | `sl-ds-component` | sl-input / sl-text-field |
| `type: FRAME` with children + grid/flex behavior | `plain-div` | Custom CSS (NEVER `sl-card` as layout) |
| `type: TEXT` | `html-text` | `<h1>`/`<h2>`/`<p>`/`<span>` per font size mapping |
| Icon (`type: VECTOR` or name matches icon patterns) | resolves via `icons.json` to `sl-ds-icon` or `custom-svg` | — |
| Decorative image (large `RECTANGLE` with fill, or named `bg-*`/`hero-image`) | `asset-image` | `<img src="...">` from `assets.json` |

### 4.2 The layout-vs-DS rule (critical)

**A Figma node named `Card` with child elements positioned via grid/flex** is NOT an `<sl-card>` — it's a layout container that happens to look card-shaped. Use `<div class="card-like">` with custom CSS.

`<sl-card>` is for INDIVIDUAL items (one product, one notification, one piece of content) that have their own padding rendered inside Shadow DOM. Treating it as a layout container fails geometric verification (Shadow DOM padding can't be overridden from outside).

When in doubt: count children. 1 piece of content = `sl-card`. 3+ grid-arranged children = `plain-div`.

### 4.3 Search confidence threshold

`search_design_system` returns matches with confidence scores. Apply:

| Score | Action |
|---|---|
| > 0.8 | Use the match |
| 0.5-0.8 | Use the match BUT flag in component-map.json as `confidence: medium` for `/sl-ds-audit` to verify visually |
| < 0.5 | Treat as `plain-div` or `html-text`; don't pretend it's a DS component |

## 5. `component-map.json` schema

```json
{
  "schemaVersion": "1.0.0",
  "producedBy": "sl-ds-plan/sl-ds-component-mapper",
  "producedAt": "2026-06-09T...",
  "inputs": {
    "nodeTreeHash": "sha256:...",
    "tokensVerifiedHash": "sha256:..."
  },
  "elements": [
    {
      "figmaNodeId": "1:186",
      "figmaName": "Topbar/Container",
      "classification": "sl-ds-component",
      "dsComponent": "sl-navigation",
      "dsImport": "@sl-design-system/angular/navigation",
      "dsRegister": "@sl-design-system/navigation/register.js",
      "variant": null,
      "props": {},
      "confidence": "high"
    },
    {
      "figmaNodeId": "1:200",
      "figmaName": "Hero/Container",
      "classification": "plain-div",
      "cssClass": "max-hero-section",
      "rationale": "Has child grid layout — sl-card shadow DOM would block geometric override"
    },
    {
      "figmaNodeId": "I1:687;3:23",
      "figmaName": "icon/graduation-cap",
      "classification": "sl-ds-icon",
      "dsIconName": "fas-graduation-cap",
      "dsImport": "@sl-design-system/angular/icon"
    }
  ],
  "summary": {
    "total": 47,
    "dsComponent": 18,
    "plainDiv": 22,
    "dsIcon": 5,
    "customSvg": 0,
    "htmlText": 2,
    "assetImage": 0,
    "lowConfidence": 1
  }
}
```

## 6. Sub-agent budget

`sl-ds-component-mapper` (sub-agent on Sonnet):
- One `search_design_system` call per unique element TYPE (not per element instance)
- For MEDIUM scope: ~7-10 unique types → ~7-10 calls
- Budget cap: 12 calls. Beyond that, stop and use heuristic classification.

## 7. Output verification

Before writing `component-map.json`, sanity check:

| Check | Action on failure |
|---|---|
| At least 1 `sl-ds-component` in elements | If 0 and `dsMode: slds` → FAIL ("Mapping found no DS matches — likely wrong SLDS version") |
| `dsImport` strings start with `@sl-design-system/angular/` | FAIL if any other prefix — typo or wrong package |
| Every `sl-ds-icon` has a `dsIconName` from `icons.json` | FAIL if missing — icon mapping out of sync |
| Total elements > 0 | FAIL — node-tree.json was empty |

## 8. What NOT to do

- ❌ Don't recommend a structure or data approach that contradicts codebase evidence without flagging it clearly
- ❌ Don't classify a layout container as `sl-card` because it "looks card-shaped" in Figma
- ❌ Don't use search_design_system for every individual instance — only per unique TYPE
- ❌ Don't make up DS component names (`sl-special-card`) — only what `search_design_system` returns
- ❌ Don't skip the DOM confirmation question for MEDIUM/LARGE scope just because the architecture seems obvious — Figma hierarchy often has surprises
