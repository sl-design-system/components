---
topic: multi-screen-analysis
applies_to: [sl-ds-layout]
last_updated: 2026-06-09
---

# Multi-Screen Layout Analysis

> **Purpose:** Loaded by `/sl-ds-layout` Step 2 (existing-layout grep) and Step 3 (Figma multi-screen sub-agent). Contains the exact patterns and Figma MCP call sequences.

## 1. Existing layout grep patterns (Step 2, orchestrator)

```bash
TGT="<targetScope>"  # from .sl-ds-config.yaml

# 1.1 Routing config
find "${TGT}/src" -name "*.routes.ts" -o -name "app.routes.ts" 2>/dev/null

# 1.2 Shell/layout components
find "${TGT}/src" -type f \( -name "*shell*" -o -name "*layout*" -o -name "*navigation*" -o -name "*topbar*" -o -name "*sidebar*" \) 2>/dev/null | grep -v ".spec.ts"

# 1.3 Component selectors that look like shells
grep -rE "selector: ['\"](max-)?(app-)?(shell|layout|topbar|sidebar|navigation)" "${TGT}/src" 2>/dev/null
```

For each found file, read it (max 100 lines) to capture:
- Component selector
- Template structure (does it have `<router-outlet>`? `<ng-content>`? named slots?)
- Imports (already uses `sl-navigation`? `sl-button`?)

**Heuristic for "this looks like a shell":**
- Has `<router-outlet>` OR
- Used in `app.component.html` as the root component OR
- Selector matches `*-shell`, `*-layout`, or `app-root`

## 2. Figma multi-screen sub-agent contract (Step 3)

The sub-agent runs on Sonnet with clean context. It has Figma MCP tools available.

### 2.1 Get file structure

```
Call: get_metadata
With: { figmaUrl: <fileRootUrl> } — no nodeId, gets file-level metadata
```

Parse: list of pages, each with `name`, `id`, `childFrames` (top-level frames per page).

### 2.2 Identify pages to analyze

From the page list, pick top **3-5 pages** by these signals (don't pull all if 10+):

1. Top frame has a name matching DS keywords: `dashboard`, `home`, `index`, `main`, `<feature>-page`
2. Frame size is large (> 800px tall, > 1000px wide → likely a real screen, not a component spec)
3. Skip pages named `Components`, `Tokens`, `Icons`, `Styleguide`, `WIP`, `Old`, `Archive`

If 3 or fewer pages → analyze all. If 10+ pages → analyze top 5 by these signals + ask user.

### 2.3 Per-page metadata

For each chosen page:

```
Call: get_metadata
With: { nodeId: <frameId>, depth: 2 }
```

Parse top-level children with:
- Position (`y`, `height`)
- Name (look for keywords: `topbar`, `nav`, `header`, `sidebar`, `footer`, `hero`, `content`, `main`)
- Size

### 2.4 Identify shared elements

For each element type (`topbar`, `sidebar`, `footer`), check across pages:

**Exact match** — same nodeId on multiple pages → it's a Figma component instance, definitely shared
**Variant match** — different nodeId, same name/size pattern → likely shared with variations
**Unique** — appears only on one page

Build:

```json
{
  "sharedElements": [
    {
      "type": "topbar",
      "appearsOn": ["Teacher Dashboard", "Student View"],
      "consistency": "exact",
      "evidenceNodeIds": ["1:186", "2:301"]
    }
  ]
}
```

### 2.5 Important: budget discipline

**Hard limit:** sub-agent MUST make at most **6 Figma calls** total (1 for file root + 5 for pages). Beyond 6 calls → STOP early and return what was gathered with `errors: [{ reason: "budget exceeded", pagesNotAnalyzed: [...] }]`.

If after 6 calls the picture is incomplete:
- Return what was gathered
- Add `errors: [{ reason: "budget exceeded", pagesNotAnalyzed: [...] }]` to output

The orchestrator will decide whether to spawn a second sub-agent for the missing pages or proceed with what was found.

### 2.6 Output schema

```json
{
  "schemaVersion": "1.0.0",
  "producedBy": "sl-ds-layout/figma-multi-screen",
  "producedAt": "2026-06-09T...",
  "fileId": "abc123",
  "fileName": "Sanoma Learning — Teacher 2026",
  "lastModified": "2026-06-08T10:00:00Z",
  "pagesAnalyzed": [
    {
      "name": "Teacher Dashboard",
      "nodeId": "1:185",
      "topElements": [
        { "type": "topbar", "nodeId": "1:186", "x": 0, "y": 0, "h": 64, "w": 1440 },
        { "type": "content", "nodeId": "1:200", "x": 0, "y": 64, "h": 987, "w": 1440 }
      ]
    }
  ],
  "pagesSkipped": [
    { "name": "Components", "reason": "non-screen page" }
  ],
  "sharedElements": [
    { "type": "topbar", "appearsOn": [...], "consistency": "exact", "evidenceNodeIds": [...] }
  ],
  "errors": []
}
```

## 3. Element classification heuristics

When inspecting a top-level child of a screen frame, classify by:

| Hint | Type |
|---|---|
| `y === 0` AND `h < 100` AND name contains `topbar`/`header`/`nav` | `topbar` |
| `x === 0` AND `h > 400` AND `w < 300` AND name contains `sidebar`/`nav` | `sidebar` |
| `y + h ≈ screen_h` AND `h < 100` | `footer` |
| Largest by area, centered | `content` (main slot) |
| `h < 100` AND name contains `hero` | `hero` (part of content, not shared) |

Confidence is low — if Figma node has a clearer name (e.g. literally called "Topbar"), use that.

## 4. Strategy decision matrix (Step 5, orchestrator)

Used to compute the `⭐ Recommended` strategy in the Step 5 question:

| Existing code shell | Figma shared elements | Recommended strategy | Rationale |
|---|---|---|---|
| None | 0-1 | `standalone` | No leverage to gain from a shell |
| None | 2+ | `new-variant` (build now) | Future screens will need it; pay cost once |
| Exists | 0-1 | `standalone` (but ask) | Existing shell may be unused for this work |
| Exists, matches | 2+, all exact match | `reuse-extend` | Pure reuse, just add per-screen slots |
| Exists, partial match | 2+, with differences | `reuse-extend` (with slot for differences) | Better than fork |
| Exists, doesn't match | 2+, exact match | `new-variant` (with refactor note) | Old shell stays; new shell for this Figma file |

The orchestrator MUST present the rationale alongside the recommendation, not just the label.

## 5. What NOT to do

- ❌ Don't call `get_design_context` or `get_variable_defs` — those are token tools, run by `/sl-ds-tokens`
- ❌ Don't try to extract precise pixel positions in this skill — `±10px` is fine for layout analysis
- ❌ Don't write any code files — only `.sl-ds-cache/` and `sl-ds-decisions/`
- ❌ Don't analyze MORE than 5-6 pages even if budget allows — overkill, return early
- ❌ Don't pre-pick the strategy without showing the user the comparison — they MUST confirm
