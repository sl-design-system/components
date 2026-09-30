---
name: sl-ds-version
type: sub-agent
prefix: sl-ds
version: 1.0.0
description: Detects SLDS version, Angular version, theme, NX structure, and store model
called_by:
  - sl-ds-impl
  - sl-ds-proto
  - sl-ds-migrate
  - sl-ds-docs
invokes: []
token_budget: "1–2K"
---

# sl-ds-version

Detects the **project environment** — SLDS version, Angular version, NX workspace layout,
active theme, and state management model — so that downstream agents generate code appropriate
for the specific project.

## Purpose

Every pipeline run starts with environment detection. Without it, agents would guess versions
and generate incompatible code. `sl-ds-version` provides deterministic answers by reading project
manifests and lockfiles.

## Input

```json
{
  "projectRoot": "/path/to/repo"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `projectRoot` | Yes | Absolute path to the repository or project root to inspect |

## Output

```json
{
  "sldsVersion": "2.0.1",
  "angularVersion": "21.0.0",
  "nxEnabled": true,
  "theme": "sanoma-learning",
  "storeModel": "ngrx-signal-store",
  "nxLayout": {
    "apps": ["max"],
    "libs": ["feature-*", "ui-*", "data-access-*", "util-*"]
  },
  "multiVersion": false,
  "confidence": 95
}
```

| Field | Description |
|-------|-------------|
| `sldsVersion` | Exact resolved SLDS version from lockfile |
| `angularVersion` | Exact Angular version from lockfile |
| `nxEnabled` | Whether NX workspace is detected |
| `theme` | Active SLDS theme name (e.g., `sanoma-learning`, `itslearning`) |
| `storeModel` | Detected store: `ngrx-signal-store` \| `ngrx-store` \| `local-signals` \| `none` |
| `nxLayout` | NX apps and library patterns (when `nxEnabled=true`) |
| `multiVersion` | Whether multiple SLDS versions coexist |
| `confidence` | 0–100 confidence in detection accuracy |

## Detection Heuristics

### SLDS Version

```
1. Scan root package.json for @sl-design-system/* dependencies
2. If NX: also scan each project's package.json (libs/*/package.json)
3. Read lockfile (yarn.lock / package-lock.json / pnpm-lock.yaml)
   → Extract exact resolved version
4. If multiple versions found:
   → Set multiVersion=true
   → In auto mode: choose version with highest usage count
   → In approval mode: pause and ask user
```

### Angular Version

```
1. Read @angular/core version from lockfile
2. Verify @angular/cli version matches (warn if mismatch)
3. Detect Angular compiler options from tsconfig.json
```

### NX Workspace

```
1. Check for nx.json at project root → NX detected
2. Read project.json files to map apps and libs
3. Detect layer model from directory naming:
   - libs/feature-* → feature layer
   - libs/ui-* → UI/presentation layer
   - libs/data-access-* → data-access layer
   - libs/util-* → utilities layer
4. Check for enforce-module-boundaries in .eslintrc or eslint config
```

### Theme

```
1. Check angular.json / project.json for style imports
2. Scan styles.css / styles.scss for @sl-design-system/{theme} imports
3. Detect theme variant (light/dark) from import path
4. If no theme found: lower confidence, default to "sanoma-learning"
```

### Store Model

```
1. Check package.json for @ngrx/* dependencies
2. If @ngrx/signals found → "ngrx-signal-store"
3. If @ngrx/store found (without signals) → "ngrx-store"
4. Scan src/ for signal() usage patterns → "local-signals"
5. If none detected → "none"
```

## CLI Overrides

Any detection result can be overridden via CLI flags:

```
--ds-version 2.0.1      # Skip SLDS version detection
--angular-version 21    # Skip Angular detection
--theme itslearning     # Force specific theme
--no-nx                 # Treat as non-NX project
--store-model none      # Skip store detection
```

Overrides always produce confidence=100 for the overridden field.

## Failure Modes

| Failure | Detection | Recovery |
|---------|-----------|----------|
| No package.json found | File read returns ENOENT at project root | Abort — cannot detect versions without manifest. |
| No lockfile found | Neither yarn.lock nor package-lock.json exists | Use declared ranges from package.json (lower confidence). |
| No SLDS packages installed | No `@sl-design-system/*` in dependencies | Return `sldsVersion: null`. Let caller decide (scaffold flow or error). |
| Multiple SLDS versions | >1 distinct resolved version in lockfile | Set `multiVersion=true`, pick highest-usage, lower confidence to 70. |
| Unrecognized theme | Import path doesn't match known theme names | Return raw import path as theme name, confidence 60. |
| NX config corrupt | `nx.json` exists but is invalid JSON | Treat as non-NX, lower confidence to 50. |

## Confidence Scoring

| Condition | Score |
|-----------|-------|
| All signals clear and unambiguous | 95–100 |
| Lockfile exact match + single version | 90–100 |
| No lockfile (ranges only) | 60–75 |
| Multiple SLDS versions | 65–80 |
| No theme detected | −15 penalty |
| CLI override applied | 100 (for overridden fields) |

## Design Decisions

1. **Why read lockfile, not just package.json?** Package.json has ranges (`^2.0.0`).
   Only the lockfile has the exact installed version. Agents need exact versions for
   CEM cache lookup.

2. **Why detect store model?** `sl-ds-compose` needs to know whether to generate
   SignalStore, NgRx Store, or simple signal-based patterns. Detection avoids asking
   the user every time.

3. **Why detect NX layout?** File placement (which lib, which layer) is critical
   for architecture quality scoring. Without NX detection, `sl-ds-compose` cannot make
   correct placement decisions.
