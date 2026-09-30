---
topic: composite-fidelity-method
applies_to: [sl-ds-verify]
last_updated: 2026-06-12
---

# Composite Design Fidelity — Method

> **Purpose:** Loaded by `/sl-ds-verify` Step 3 (fidelity-checker sub-agent). Defines the five-dimension composite fidelity score: §2 DOM position, §3 per-component pixelmatch, §4 token compliance, §5 Code Connect compliance, §6 RWD breakpoints, §7 output schema. Self-contained: this file alone is enough for a sub-agent in clean context.

## 1. Dependencies

**npm packages required (devDependencies):**

```bash
npm install --save-dev pixelmatch pngjs playwright
```

- **pixelmatch** (v5.x) — pixel-level diff, Node-native, zero LLM cost (~50ms per component)
- **pngjs** (v7.x) — PNG decode/encode for pixelmatch input/output
- **playwright** (v1.x) — headless browser for taking rendered screenshots

**Verify installation:**

```bash
node -e "console.log(require('pixelmatch'), require('pngjs').PNG)" 
```

If `Cannot find module 'pixelmatch'` → STOP, request user to install.

## 2. DOM position accuracy (weight: 0.35)

For each component, read `absoluteBoundingBox` from `node-tree.json` (keyed by figmaNodeId). Use Playwright `element.boundingBox()` to get DOM rect. Compute:

```
Δx = |dom.x - figma.x|
Δy = |dom.y - figma.y|
Δw = |dom.width - figma.width|
Δh = |dom.height - figma.height|
```

Pass condition: all four deltas ≤ 2px. Score = (elements passing / total elements) * 100. Feed into composite as `0.35 * score`.

## 3. Per-component visual pixelmatch (weight: 0.30)

### Tiered tolerance specification

Per element classification (from PLAN.md component SPEC):

| Element type | Pixel threshold | Position tolerance | Color tolerance | Notes |
|---|---|---|---|---|
| **Layout container** (frame, grid, divider) | 0% diff (exact) | ±0px | – | Wrapper divs, dividers — must be pixel-perfect |
| **DS component instance** (sl-card, sl-button) | <0.5% diff | ±0px | exact hex via token | SLDS rendering deterministic |
| **Icon** | <1% diff | ±0px position, ±1px size | – | Font Awesome rendering varies slightly |
| **Text** | <5% diff | ±0px | exact hex | Font hinting / sub-pixel varies across OS |
| **Shadow / blur** | **excluded zone** | – | – | Browser shadow rendering inherently variable |
| **Decorative bg pattern** | <2% diff | ±2px | – | PNG compression artifacts acceptable |

**Overall component threshold:** `0.005` (0.5% pixels different) for default. Per-component override via `PLAN.md component.visualVerification.pixelmatch_threshold`. Score for composite = avg passing rate across components * 100. Feed into composite as `0.30 * score`.

### Implementation pattern

#### Setup (once per /sl-ds-verify run)

```bash
mkdir -p /tmp/rendered /tmp/figma-ref /tmp/diff

# Start dev server (only once, all components verified against same instance)
npx nx serve <project> --port=<port> > /tmp/serve.log 2>&1 &
echo $! > /tmp/serve.pid

# Wait for ready (max 90s)
for i in {1..45}; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:<port> 2>/dev/null)
  [ "$STATUS" = "200" ] && break
  sleep 2
done
```

#### Per-component verification

For each component in PLAN.md (current phase or all):

```javascript
const { chromium } = require('playwright');
const pixelmatch = require('pixelmatch');
const { PNG } = require('pngjs');
const fs = require('fs');

async function verifyComponent(component, port, figmaScreenshotPath) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Match Figma viewport
  await page.setViewportSize({ 
    width: component.figmaViewportWidth || 1440, 
    height: component.figmaViewportHeight || 900 
  });
  
  // Navigate to route that renders this component
  const route = component.testRoute || '/';
  await page.goto(`http://localhost:${port}${route}`, { 
    waitUntil: 'networkidle',
    timeout: 30000 
  });
  
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000); // fonts + icons
  
  // Locate the component instance via CSS selector
  const element = await page.locator(component.cssSelector).first();
  await element.waitFor({ state: 'visible', timeout: 5000 });
  
  // Take screenshot of just the component
  const renderedPng = await element.screenshot({ type: 'png', omitBackground: false });
  
  await browser.close();
  
  // Compare via pixelmatch
  const renderedImg = PNG.sync.read(renderedPng);
  const figmaImg = PNG.sync.read(fs.readFileSync(figmaScreenshotPath));
  
  // Dimensions must match
  if (renderedImg.width !== figmaImg.width || renderedImg.height !== figmaImg.height) {
    return {
      component: component.name,
      status: 'DIMENSION_MISMATCH',
      rendered: { w: renderedImg.width, h: renderedImg.height },
      figma: { w: figmaImg.width, h: figmaImg.height }
    };
  }
  
  const { width, height } = renderedImg;
  const diffImg = new PNG({ width, height });
  
  const diffCount = pixelmatch(
    renderedImg.data, figmaImg.data, diffImg.data,
    width, height,
    {
      threshold: 0.1,       // YIQ color diff threshold
      includeAA: false,     // ignore anti-aliasing
      alpha: 0.3,
      aaColor: [255, 255, 0],
      diffColor: [255, 0, 0]
    }
  );
  
  const totalPixels = width * height;
  const diffPercent = diffCount / totalPixels;
  
  // Write diff PNG for human review
  const diffPath = `/tmp/diff/${component.name}-diff.png`;
  fs.writeFileSync(diffPath, PNG.sync.write(diffImg));
  
  const threshold = component.visualVerification?.pixelmatch_threshold || 0.005;
  
  return {
    component: component.name,
    figmaNodeId: component.figmaNodeId,
    diffCount,
    diffPercent,
    threshold,
    status: diffPercent <= threshold ? 'PASS' : 'FAIL',
    diffImage: diffPath,
    pixelsTotal: totalPixels
  };
}
```

#### Cleanup (mandatory)

```bash
trap 'kill $(cat /tmp/serve.pid 2>/dev/null) 2>/dev/null; rm -f /tmp/serve.pid' EXIT
```

## 4. Token compliance (weight: 0.15)

Grep generated CSS/SCSS in the target scope for hardcoded hex literals where DS tokens exist:

```bash
grep -rE "#[0-9a-fA-F]{3,6}\b" <targetScope>/src/<screen>/ \
  --include="*.css" --include="*.scss" > /tmp/hex-literals.txt
```

Count `totalCss` (all CSS declarations) and `hexLiterals` (lines matching hex). Score = `(1 - hexLiterals / totalCss) * 100`. Known exceptions (e.g. `#000000` in black-only contexts) may be documented in sl-ds-decisions and excluded. Feed into composite as `0.15 * score`.

## 5. Code Connect compliance (weight: 0.15)

Call `get_code_connect_map` for each `sl-*` component used in templates. For each, compare actual generated template structure against the official Code Connect snippet (prop names, slot usage, event bindings). Pass if template matches snippet structure. Score = (matched / totalSl) * 100. Feed into composite as `0.15 * score`.

Mismatch >30% → hard gate (STOP) — see SKILL.md § Hard gates.

## 6. RWD breakpoint pass (weight: 0.05)

Re-run DOM position check (§2) at viewports: 1440, 1024, 768, 375px width. At each viewport: pass if no layout overflow (`scrollWidth > clientWidth`) AND position_accuracy ≥50%. Score = (passing viewports / 4) * 100. Feed into composite as `0.05 * score`.

## 7. Output schema

Write `.sl-ds-cache/sl-ds-impl/fidelity-result.json`:

```json
{
  "schemaVersion": "3.0.0",
  "producedBy": "sl-ds-verify/fidelity-checker",
  "producedAt": "<iso>",
  "compositeScore": 87.5,
  "breakdown": {
    "position_accuracy": { "passed": 2, "total": 7, "score": 28.6, "perElement": [] },
    "visual_match": { "avgDiff": 0.012, "score": 98.8, "perComponent": [] },
    "token_compliance": { "totalCss": 145, "hexLiterals": 3, "score": 97.9 },
    "code_connect_compliance": { "totalSl": 18, "matched": 16, "score": 88.9 },
    "rwd_breakpoint_pass": { "passed": 4, "total": 4, "score": 100.0 }
  },
  "verdict": "GOOD (87.5/100, target: 95)",
  "actionableIssues": [
    { "element": "max-book-card", "issue": "Δx=+48, Δy=+54", "fix": "remove outer 24px padding from app-shell" }
  ]
}
```

## 8. Auto-repair workflow

If any dimension FAILS:

### Identify diff regions

Read diff PNG. Red pixels = where rendered differs from Figma. Group consecutive red pixels into bounding boxes.

### Spawn small repair sub-agent (Haiku, ~3K tokens)

Pass:
- Rendered screenshot
- Figma reference screenshot  
- Diff PNG with regions highlighted
- Component code (ts + html + css)
- Component SPEC from PLAN.md

Sub-agent task: identify root cause + propose specific code change.

### Apply + re-verify

Edit code → wait HMR (~3s) → re-run pixelmatch.

### After 2 attempts → STOP

Surface via `AskUserQuestion`:
- ⭐ Show me diff image
- Accept current state (record exception)
- Abort verify

## 9. Common failure modes + heuristics

| Diff pattern | Likely cause | Fix |
|---|---|---|
| Different colors | Wrong CSS var token | Update token reference |
| Different padding | Hardcoded value vs token | Replace with `var(--space-N)` |
| Different font | Roboto vs Open Sans | Verify `--text-new-typeset-fontfamily-*` |
| Different font size | Wrong size token | Match `var(--size-text-new-heading-X)` |
| Missing element | Sub-agent skipped DOM node | Add element per SPEC |
| Icon broken (X shown) | Icon name not in SLDS library | Check icons.json + sanoma-learning setup() |
| Card empty content | sl-card slot misuse | Verify default slot vs named slots |
| Different layout | Wrong grid columns | Match grid-template-columns in CSS |

## 10. Caching reference screenshots

Figma reference screenshots fetched in `/sl-ds-plan` Step 6 (when generating SPEC). Cached at:

```
.sl-ds-cache/sl-ds-impl/figma-screenshots/<nodeId>.png
```

`/sl-ds-verify` reuses these — no fresh Figma fetch unless cache missing or `figma_lastModified` changed.

## 11. Why composite score vs single metric

| Metric | What it catches | What it misses |
|---|---|---|
| ±2px DOM only | Position drift | Color drift, broken icons, wrong theme |
| Full-page pixelmatch | Visual diff | Position of individual elements, token usage |
| Token compliance | Hardcoded values | Visual rendering errors |
| Code Connect compliance | Wrong DS API usage | Visual drift, position |
| **Composite (v3)** | All of the above | — |

Full-page pixelmatch is misleading: a component can look 99.9% similar pixel-wise but be positioned 50px off-screen or use hardcoded colors instead of tokens. The composite score surfaces each failure dimension independently with targeted repair hints.
