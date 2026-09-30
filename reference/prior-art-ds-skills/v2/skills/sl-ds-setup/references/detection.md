---
topic: detection
applies_to: [sl-ds-setup]
last_updated: 2026-06-09
---

# Detection — Stack & Codebase Patterns

> **Purpose:** Exact bash commands + grep patterns used by `/sl-ds-setup` to detect framework, libraries, and code conventions. Loaded in Step 1 (orchestrator) and Step 2 (codebase-scanner sub-agent).

## 1. Framework detection (Step 1)

```bash
# Primary detection — package.json deps
detect_framework() {
  if grep -q '"@angular/core"' package.json 2>/dev/null; then
    echo "angular"
  elif grep -q '"react"' package.json 2>/dev/null && ! grep -q '"@angular/core"' package.json; then
    echo "react"
  elif grep -q '"vue"' package.json 2>/dev/null; then
    echo "vue"
  else
    echo "unknown"
  fi
}
```

**Conflict resolution:**
- Both Angular AND React present → assume monorepo, ask user which project is the DS target
- Vue + Angular → same as above

## 2. Version detection (Step 1)

```bash
# Versions — read package.json of installed package, NOT package.json spec
get_version() {
  local pkg="$1"
  test -f "node_modules/${pkg}/package.json" \
    && node -e "console.log(require('./node_modules/${pkg}/package.json').version)" \
    || echo "not-installed"
}

# Examples
ANGULAR_V=$(get_version "@angular/core")
SLDS_V=$(get_version "@sl-design-system/button")
SLDS_ANGULAR_V=$(get_version "@sl-design-system/angular")
I18NEXT_V=$(get_version "angular-i18next")
NGX_TRANSLATE_V=$(get_version "@ngx-translate/core")
NX_V=$(get_version "nx")
```

**Why read installed `node_modules/` not `package.json` deps:** caret ranges (`^17.0.0`) tell us what's allowed, not what's actually installed.

## 3. Codebase scan grep patterns (Step 2)

These patterns are run by the codebase-scanner sub-agent against `<targetScope>/src/`.

### 3.1 State management

```bash
STATE_PATTERN=""

# Signal Store
grep -r "signalStore\|withState\|withComputed\|withMethods" <targetScope>/src/ 2>/dev/null | head -3
# Found → STATE_PATTERN="signal-store"

# Service + RxJS
grep -r "Injectable\|HttpClient\|BehaviorSubject\|Subject<" <targetScope>/src/ 2>/dev/null | head -3
# Found → STATE_PATTERN="service-rxjs"

# Static (no patterns above) → STATE_PATTERN="none"
```

**Evidence required:** at least 2 matches in different files for the pattern to win. One match could be a leftover; two is intentional.

### 3.2 Directory structure

```bash
# Per-feature (preferred)
test -d <targetScope>/src/app/features && echo "per-feature evidence"
test -d <targetScope>/src/app/pages && echo "per-feature evidence"

# Per-type (containers + components + models)
test -d <targetScope>/src/app/containers && echo "per-type evidence"
test -d <targetScope>/src/app/models && echo "per-type evidence"
test -d <targetScope>/src/app/services && echo "per-type evidence"

# Flat — everything directly under src/app
ls -1 <targetScope>/src/app/ | wc -l
# > 15 with no subdirs → "flat"
```

Decision:
- 2+ per-feature dirs → `per-feature`
- 3+ per-type dirs (containers + components + services + models) → `per-type`
- Flat with >15 items → `flat`
- Otherwise: report `unknown`, ask in `/sl-ds-plan`

### 3.3 DS usage

```bash
# Active DS imports
grep -rE "from '@sl-design-system/" <targetScope>/src/ 2>/dev/null | head -5

# DS tags in templates
grep -rE "<sl-[a-z]+" <targetScope>/src/ 2>/dev/null | grep -oE "<sl-[a-z]+" | sort -u | head -10

# CUSTOM_ELEMENTS_SCHEMA usage (red flag — should be rare)
grep -r "CUSTOM_ELEMENTS_SCHEMA" <targetScope>/src/ 2>/dev/null
```

Report:
- Imported packages list
- Tags used list
- Count of `CUSTOM_ELEMENTS_SCHEMA` occurrences (flag in summary if > 0)

### 3.4 i18n active usage

```bash
# angular-i18next pipe
grep -rE "I18NextPipe|\| ?i18next" <targetScope>/src/ 2>/dev/null | head -3

# ngx-translate pipe
grep -rE "TranslatePipe|\| ?translate" <targetScope>/src/ 2>/dev/null | head -3

# Loose check — i18n imports anywhere
grep -rE "from 'angular-i18next'|from '@ngx-translate/core'" <targetScope>/src/ 2>/dev/null | head -3
```

Output:
- `library: "angular-i18next" | "@ngx-translate/core" | "none"`
- `pipeName: "I18NextPipe" | "TranslatePipe" | null`
- `active: true | false` — `true` only if pipe is found being USED, not just imported

### 3.5 Selector prefix convention

```bash
# Sanoma default: max- prefix
grep -rE "selector: ['\"]max-" <targetScope>/src/ 2>/dev/null | head -3

# Other prefixes detected?
grep -rE "selector: ['\"][a-z]+-" <targetScope>/src/ 2>/dev/null \
  | grep -oE "['\"][a-z]+-" | sort -u | head -10
```

If `max-` dominates → `prefix: "max-"`. Otherwise → report all prefixes found, default to `max-` with a note.

## 4. Sub-agent output schema (Step 2)

```json
{
  "schemaVersion": "1.0.0",
  "producedBy": "sl-ds-setup/codebase-scanner",
  "producedAt": "2026-06-09T...",
  "targetScope": "apps/teacher-dashboard",
  "stateManagement": {
    "pattern": "signal-store" | "service-rxjs" | "static" | "unknown",
    "evidence": ["<file>:<line>", ...]
  },
  "directoryStructure": {
    "pattern": "per-feature" | "per-type" | "flat" | "unknown",
    "exampleDirs": ["<path>", ...]
  },
  "dsUsage": {
    "active": true | false,
    "componentsFound": ["sl-button", ...],
    "packagesImported": ["@sl-design-system/angular/button", ...],
    "customElementsSchemaUsage": 0
  },
  "i18nUsage": {
    "active": true | false,
    "library": "angular-i18next" | "@ngx-translate/core" | "none",
    "pipeName": "I18NextPipe" | null
  },
  "selectorPrefix": "max-",
  "errors": []
}
```

## 5. What NOT to do

- ❌ Don't read entire source files — grep with head -N
- ❌ Don't call any tool besides Read/Bash/Glob/Grep
- ❌ Don't infer state management from `.spec.ts` files (test scaffolding)
- ❌ Don't run `npm install` or modify lockfile
- ❌ Don't access network
