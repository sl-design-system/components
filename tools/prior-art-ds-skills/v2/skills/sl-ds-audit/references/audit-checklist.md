---
topic: audit-checklist
applies_to: [sl-ds-audit]
last_updated: 2026-06-09
---

# Audit Checklist — Sub-Agent Contract

> **Purpose:** Loaded by `/sl-ds-audit` Step 2 (code-scanner sub-agent). Contains the full list of checks with their severity assignments, grep patterns, and finding format. Self-contained for a Sonnet sub-agent in clean context.

## 1. Inputs

- `AUDIT_PATH` — directory to scan (e.g. `apps/teacher-dashboard/src/app/features/teacher-dashboard`)
- Path to `.sl-ds-cache/sl-ds-impl/tokens-verified.json`
- Path to `.sl-ds-cache/sl-ds-impl/component-map.json` (optional — may not exist)
- Path to `.sl-ds-cache/sl-ds-impl/icons.json` (optional)
- Path to `.sl-ds-cache/sl-ds-impl/architecture.json` (optional)
- Active framework (from `.sl-ds-config.yaml`)

## 2. Output schema (findings array)

```json
[
  {
    "severity": "critical|major|minor|info",
    "category": "tokens|fe-standards|sl-ds-imports|drift|accessibility|documentation",
    "rule": "<short-rule-id>",
    "file": "<relative path>",
    "line": <number or null>,
    "message": "<one-line description>",
    "suggestion": "<actionable fix, optional>",
    "fixable": true|false
  }
]
```

## 3. Check catalog — Tokens (category: `tokens`)

### 3.1 Hardcoded hex where token exists (severity: major)

For each `.scss` / `.css` / `.ts` file:

```bash
# Find all 6-digit hex literals (excluding comments)
grep -nE "#[0-9a-fA-F]{6}" <file> | grep -vE "^\s*//"
```

For each match, normalize to lowercase and check if any token in `tokens-verified.json` has that value:

```python
token_values = { t.value.lower(): t.path for t in tokens_verified.tokens.values() }
for match in hex_matches:
  if match.value.lower() in token_values:
    finding = {
      severity: "major", category: "tokens", rule: "no-hardcoded-tokens",
      file, line, message: f"Hardcoded color {match.value} — matches token {token_values[match.value.lower()]}.",
      suggestion: f"Replace with var(--{token_values[match.value.lower()].replace('/', '-')})",
      fixable: True
    }
```

### 3.2 Hardcoded spacing where token exists (severity: minor)

Same idea for px values matching spacing tokens. Lower severity because px values often have legitimate reasons (1px borders, 0.5px decorations).

```bash
grep -nE "(margin|padding|gap|top|left|right|bottom)\s*:\s*[0-9]+px" <file>
```

### 3.3 Unused tokens (severity: info)

For each token in `tokens-verified.json`, grep the codebase for its CSS var name. If 0 matches:

```
finding = {
  severity: "info", category: "tokens", rule: "unused-token",
  message: f"Token {token.path} defined but not used in code.",
  fixable: False
}
```

## 4. Check catalog — FE Standards (category: `fe-standards`)

Loaded from `.agents/standards/fe/angular.md` (NG-* Angular idioms), `.agents/standards/fe/sanoma-ds.md` (SDS-* SLDS-specific), and `.agents/standards/fe/antipatterns.md` (AP-* forbidden patterns):

### 4.1 `*ngIf` / `*ngFor` / `*ngSwitch` (severity: critical)

```bash
grep -rnE "\*ng(If|For|Switch)" "$AUDIT_PATH"
```

Critical because these silently work but mark the code as pre-Angular-17 idiom; future maintainers may add NEW `*ngIf` thinking it's the convention.

### 4.2 `@Input()` / `@Output()` decorators (severity: critical)

```bash
grep -rnE "@(Input|Output)\(" "$AUDIT_PATH"
```

Same reasoning — silent works, signals are the standard.

### 4.3 Constructor injection (severity: critical)

```bash
grep -rnE "constructor\s*\(\s*(private|public)\s+\w+\s*:" "$AUDIT_PATH"
```

### 4.4 `track $index` without justification (severity: minor)

```bash
grep -rnE "@for[^)]+track\s+\\\$index" "$AUDIT_PATH"
```

Minor because $index is sometimes correct (e.g. truly index-based loops). Suggest using a stable key.

### 4.5 Missing `track` in `@for` (severity: critical)

```bash
grep -rnE "@for\s*\(" "$AUDIT_PATH" | grep -v "track "
```

### 4.6 `selector` without prefix (severity: major)

```bash
grep -rnE "selector:\s*['\"][a-z]+-" "$AUDIT_PATH" | grep -vE "selector:\s*['\"](max-|app-)"
```

`app-` allowed for legacy/root components; `max-` is the Sanoma convention.

## 5. Check catalog — DS imports (category: `sl-ds-imports`)

### 5.1 `sl-*` tag used without Angular wrapper imported (severity: critical)

For each Angular component file:

```bash
# Extract sl-* tags used in template (inline or styleUrl)
sl_tags=$(grep -oE "<sl-[a-z]+" <file> | sort -u | sed 's/<//')

# Extract imports array
imports_section=$(awk '/imports:\s*\[/,/\]/' <file>)

# For each sl-tag, check if corresponding wrapper is imported
for tag in $sl_tags; do
  wrapper="${tag^}Component"  # capitalize, append Component
  if ! echo "$imports_section" | grep -q "$wrapper"; then
    finding(critical, "sl-ds-imports", file, line=?, "Tag <$tag> used but $wrapper not in imports[].")
  fi
done
```

(Simplification — actual logic needs to walk the AST or be more careful with naming.)

### 5.2 `register.js` side-effect import missing (severity: major)

For each `sl-*` Angular wrapper imported, the matching `register.js` should be imported somewhere in the app (typically once in `main.ts` or per-component for granularity):

```bash
# If ButtonComponent is imported, check for '@sl-design-system/button/register.js'
grep -r "@sl-design-system/button/register" <appRoot>/src
# If missing → finding(major)
```

In practice, bundlers like Vite/webpack dedupe side-effect imports — repeating per-component is safe. But missing it everywhere causes runtime errors.

### 5.3 `CUSTOM_ELEMENTS_SCHEMA` used (severity: major if undocumented, info if documented)

```bash
schemas=$(grep -rn "CUSTOM_ELEMENTS_SCHEMA" "$AUDIT_PATH")
for use in $schemas; do
  # Check sl-ds-decisions/<screen>.md → ## Architectural exceptions
  if grep -q "CUSTOM_ELEMENTS_SCHEMA" context/foundation/sl-ds-decisions/<screen>.md; then
    severity = "info"  # documented exception
  else
    severity = "major"  # silent suppression of import errors
  fi
done
```

### 5.4 `<sl-card>` as layout container (severity: major)

Per `.agents/standards/fe/sanoma-ds.md` SDS-3: `<sl-card>` Shadow DOM blocks layout override.

Heuristic: if a `<sl-card>` has 3+ direct children that look like grid items, flag.

```bash
# Approximation — find sl-card with multiple child blocks
grep -A 20 "<sl-card" <file> | head -30
# Count direct children — if > 2 and they have grid-like classes → finding
```

False positives possible. Lower confidence findings get `info` severity, not `major`.

## 6. Check catalog — Accessibility (category: `accessibility`)

### 6.1 Icon-only button missing aria-label (severity: minor)

```bash
# Find <sl-button> with only <sl-icon> inside, no aria-label
grep -B 1 -A 3 "<sl-button" <file> | grep -A 3 "<sl-icon" | grep -B 3 "</sl-button>"
# Check if aria-label exists on the button
```

### 6.2 `<img>` without alt (severity: major)

```bash
grep -rnE "<img\s+[^>]*src" <file> | grep -v "alt="
```

### 6.3 Heading hierarchy skip (severity: minor)

Parse template, extract heading levels in order. If skips (h1 → h3 without h2) → finding.

### 6.4 `outline: none` without focus replacement (severity: critical)

```bash
grep -rnE "outline:\s*none" <file>
```

Critical because it breaks keyboard navigation. Suggest using `:focus-visible` with explicit ring.

## 7. Check catalog — Documentation (category: `documentation`)

### 7.1 `sl-ds-decisions/<screen>.md` has `status: in-progress` but pipeline-state shows completed (severity: minor)

```bash
# Parse both files; flag mismatch
```

### 7.2 `## Architectural exceptions` references a rule that was fixed (severity: info)

E.g. exception says "CUSTOM_ELEMENTS_SCHEMA used for sl-foo (no Angular wrapper yet)" but `@sl-design-system/angular/foo` now exists. Suggest the user re-evaluate the exception.

Best-effort detection; lower-priority check.

## 8. Check catalog — Drift (category: `drift`)

These are populated by Step 3 (figma-staleness-checker) if `--check-figma`:

### 8.1 Figma drifted (severity: major)

If `figma-staleness-checker` returns `drifted: true`:

```
finding(major, "drift", null, null,
  f"Figma file modified {daysSinceCache} days ago; cache last refreshed {cachedLastModified}.",
  suggestion: "Run /sl-ds-update to reconcile."
)
```

### 8.2 Cache older than 30 days (severity: info)

Even if not drifted, very old caches deserve a refresh check.

## 8.5 Architectural exceptions suppression

Before any finding is added to the report, the code-scanner MUST consult `context/foundation/sl-ds-decisions/<screen>.md` and check the `## Architectural exceptions` section. Findings matching a documented exception are SUPPRESSED to severity `info` and tagged with the exception that suppressed them.

### Exception document format

The `## Architectural exceptions` section of `sl-ds-decisions/<screen>.md` is expected to contain a bullet list. Each bullet has one of these shapes (parsed in priority order):

1. **Rule-ID + file scope:** `<RULE-ID>: <file-pattern> — <rationale>`
   Example: `CUSTOM_ELEMENTS_SCHEMA: features/checkout/checkout.ts — SLDS doesn't wrap <sl-experimental-X>; ticket SLDS-1234; remove after SLDS 2.2.`
2. **Rule-ID, all files:** `<RULE-ID>: <rationale>`
   Example: `AP-7: Migration from legacy state-mgmt; planned removal by 2027-01.`
3. **Free-form (no rule-ID):** any other bullet — ignored by the parser (humans-only commentary).

The rule-ID is matched against the finding's `rule` field. The file-pattern (if present) is matched against the finding's `file` field as a glob.

### Suppression algorithm

```
for each finding F in the raw findings list:
  for each exception E in sl-ds-decisions/<screen>.md § Architectural exceptions:
    if F.rule == E.rule-id AND (E.file-pattern is absent OR F.file matches E.file-pattern):
      F.severity = "info"
      F.suppressedBy = E (full bullet text)
      F.originalSeverity = <previous level>
      break
```

A suppressed finding still appears in the report, but in the `info` section with its original severity recorded for audit (`originalSeverity` field). The report summary counts suppressions distinctly:

```text
| Severity | Count |
|---|---|
| Critical | 0 |
| Major | 2 |
| Minor | 5 |
| Info | 3 (+ 4 suppressed) |
```

### Why suppression matters

Audits become noise when the same documented exception keeps firing every run. Without suppression, the team learns to ignore the report — which then misses real findings. With suppression, intentional exceptions stay visible (in `info`) but don't crowd out actionable items.

### Anti-patterns

- ❌ Don't add a rule to `## Architectural exceptions` just to silence a finding. The exception must have a real rationale (incident, ticket, planned removal date).
- ❌ Don't suppress a `critical` finding without explicit user confirmation. The audit may downgrade to `info` per the algorithm, but the report's executive summary MUST still highlight that a critical was suppressed: *"1 critical finding suppressed by exception — review the rationale annually."*
- ❌ Don't write exceptions broader than they need to be. `CUSTOM_ELEMENTS_SCHEMA: all files` is almost certainly wrong; `CUSTOM_ELEMENTS_SCHEMA: features/checkout/*` is probably what was meant.

## 9. Severity assignment rules

| Severity | Use when |
|---|---|
| `critical` | Code will fail or has hidden bug (missing import for used tag; outline: none without alternative) |
| `major` | Visible bug or significant divergence (hardcoded token where one exists; CUSTOM_ELEMENTS_SCHEMA undocumented; Figma drifted) |
| `minor` | Best-practice violation; non-breaking (missing aria-label on icon-only button; heading skip; track $index) |
| `info` | Observation, no action required (unused token; old cache; documented exception present) |

When in doubt, assign LOWER severity. Reports with too many critical/major findings get ignored ("crying wolf").

## 10. Performance budget

| Operation | Cost |
|---|---|
| Grep across 50 files | <2K tokens |
| Per-file detail read (e.g. AST-ish parse) | <1K each, limit 10 files |
| Total sub-agent budget | 5-10K |

If audit needs more — split into multiple sub-agent runs (one per file kind: components, services, styles).

## 11. What NOT to do

- ❌ Don't fix findings — `/sl-ds-audit` is READ-ONLY
- ❌ Don't write to any file except `audit-report.json`
- ❌ Don't run `nx build` or start dev server — that's `/sl-ds-verify`'s job
- ❌ Don't call Figma MCP unless `--check-figma` was explicitly requested
- ❌ Don't lower severity to make the report look better — surface findings honestly
- ❌ Don't blow up on missing optional inputs (component-map.json absent) — degrade gracefully, just skip those checks
