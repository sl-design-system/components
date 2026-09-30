---
topic: build-checks
applies_to: [sl-ds-verify]
last_updated: 2026-06-09
---

# Build & Lint Checks — Sub-Agent Contract

> **Purpose:** Loaded by `/sl-ds-verify` Steps 1-2. Defines build/lint commands, common error classes with auto-repair recipes, and the pattern grep checks for framework-rule violations the compiler doesn't catch.

## 1. Build + lint commands

For Nx projects (default — detected by `.sl-ds-config.yaml` → `project.nx_enabled`):

```bash
npx nx build <project> --skip-nx-cache 2>&1 | tee .sl-ds-cache/sl-ds-impl/_build.log
npx nx lint <project> --quiet 2>&1 | tee .sl-ds-cache/sl-ds-impl/_lint.log
```

Notes:
- `--skip-nx-cache`: don't trust nx cache for verification (it could return a stale pass)
- `--quiet` on lint: only print errors, not warnings (warnings tracked separately)

Exit code 0 → pass. Non-zero → parse output for errors.

For non-Nx projects:

```bash
ng build && ng lint   # Angular
# or: npm run build && npm run lint
```

`.sl-ds-config.yaml` → `pipeline.build_command` and `lint_command` can override (TBD; not in MVP).

## 2. Error classification + auto-repair recipes

The sub-agent parses build/lint output and applies these recipes BEFORE escalating to the user.

### 2.1 TypeScript: "is not assignable to" or "does not exist on type"

```
Recipe: most often a stale model interface vs new field used in template.
1. Read the error line + file
2. If template uses `obj.someField` but model lacks it → propose adding field to model
3. If incompatible types → check tokens-verified.json for type drift, propose fix
4. Do NOT silence with `as any` — that's a real bug, surface to user
```

### 2.2 Missing import: "Cannot find name 'X'" or "X is not declared"

```
Recipe: usually a DS Angular wrapper not imported.
1. Find the unbound symbol (e.g. ButtonComponent used but not imported)
2. Look up DS import path from component-map.json (.dsImport)
3. Add to `imports: [...]` array AND ensure register.js side-effect import
4. Re-run build
```

### 2.3 "X is not a known element" (Angular template error)

```
Recipe: sl-* tag used but wrapper not in imports.
1. Identify the tag (e.g. sl-card)
2. Add CardComponent to imports
3. Add '@sl-design-system/card/register.js' as side-effect import
4. If still failing → user may need CUSTOM_ELEMENTS_SCHEMA (last resort — document in sl-ds-decisions)
```

**Do NOT** auto-add `CUSTOM_ELEMENTS_SCHEMA` as a shortcut. That hides future broken imports.

### 2.4 SCSS: "Undefined variable" or "Cannot find ...scss"

```
Recipe: token CSS custom property typo or styles.scss path.
1. Check the file's --color-* / --spacing-* names match styles.scss declarations
2. If template uses --color-foreground-primary-bold but styles.scss declares --color-fg-primary-bold → fix one side (canonical name is tokens-verified.json path with / → -)
```

### 2.5 Lint: "no-unused-vars" or "no-explicit-any"

```
Recipe: usually safe to remove the unused import / fix the type.
1. Confirm import is unused (not just used in template — lint should detect that)
2. Remove if truly unused
3. If `any` → infer correct type from usage context
```

### 2.6 Lint: "no-input-decorator" or analog rules

```
Recipe: the generator should not have emitted these. Re-write the file:
1. Replace @Input() with input() / input.required()
2. Replace @Output() with output()
3. Replace constructor injection with inject()
4. Replace *ngIf/*ngFor with @if/@for
```

If the lint rule isn't configured but the generator still produced old patterns → the issue is `.agents/standards/fe/angular.md` (NG-*) not being followed by `/sl-ds-implement`; flag in failure diagnostic.

## 3. Pattern grep checks (Step 2)

These catch what the build/lint might miss (especially when configs are loose).

```bash
TGT="<targetScope>/src/<screen>"

# 3.1 No @Input / @Output decorators
violations=$(grep -rE "@(Input|Output)\(" "$TGT" 2>/dev/null)
[ -n "$violations" ] && echo "FAIL: @Input/@Output decorators found: $violations"

# 3.2 No structural directives
violations=$(grep -rE "\*ng(If|For|Switch)" "$TGT" 2>/dev/null)
[ -n "$violations" ] && echo "FAIL: structural directives found: $violations"

# 3.3 No constructor injection
violations=$(grep -rE "constructor\s*\(\s*private|constructor\s*\(\s*public" "$TGT" 2>/dev/null)
[ -n "$violations" ] && echo "FAIL: constructor injection found: $violations"

# 3.4 Selector prefix (allow max- and app-)
violations=$(grep -rE "selector:\s*['\"][a-z]+-" "$TGT" 2>/dev/null \
  | grep -vE "selector:\s*['\"](max-|app-)")
[ -n "$violations" ] && echo "FAIL: non-max- selectors: $violations"

# 3.5 CUSTOM_ELEMENTS_SCHEMA documentation
schemas=$(grep -r "CUSTOM_ELEMENTS_SCHEMA" "$TGT" 2>/dev/null)
if [ -n "$schemas" ]; then
  test -f context/foundation/sl-ds-decisions/<screen>.md \
    && grep -q "CUSTOM_ELEMENTS_SCHEMA" context/foundation/sl-ds-decisions/<screen>.md \
    || echo "FAIL: CUSTOM_ELEMENTS_SCHEMA used but not documented in sl-ds-decisions"
fi

# 3.6 @for has track
violations=$(grep -rEn "@for\s*\(" "$TGT" 2>/dev/null | grep -v "track ")
[ -n "$violations" ] && echo "FAIL: @for without track: $violations"

# 3.6b data-figma-id emission (per sl-ds-implement/references/generation-rules.md §3.7)
# For each FRAME/TEXT/INSTANCE node in node-tree.json at level ≤ 2, verify the
# generated template contains a corresponding data-figma-id attribute.
node -e "
  const nodeTree = require('./.sl-ds-cache/sl-ds-impl/node-tree.json');
  const fs = require('fs'); const path = require('path');
  const requiredNodeIds = nodeTree.nodes
    .filter(n => n.level <= 2 && ['FRAME','TEXT','INSTANCE'].includes(n.type))
    .map(n => n.id);
  const componentFiles = require('child_process').execSync(
    'find \"$TGT\" -name \"*.ts\" -not -name \"*.spec.ts\"'
  ).toString().split('\n').filter(Boolean);
  const allHtml = componentFiles.map(f => fs.readFileSync(f,'utf8')).join('\n');
  const missing = requiredNodeIds.filter(id =>
    !allHtml.includes('data-figma-id=\"' + id + '\"')
  );
  if (missing.length) {
    console.log('FAIL: ' + missing.length + ' Figma nodes missing data-figma-id in templates: ' + missing.slice(0,5).join(', '));
    process.exit(1);
  }
"

# 3.7 Hardcoded hex colors (where token exists)
# Heuristic: any 6-char hex literal in .scss → check if token covers it
violations=$(grep -rEn "#[0-9a-fA-F]{6}" "$TGT" --include="*.scss" 2>/dev/null \
  | grep -v "//.*$")  # ignore in comments
# Compare against tokens-verified.json — if hex matches a token value, FAIL
if [ -n "$violations" ]; then
  node -e "
    const tokens = require('./.sl-ds-cache/sl-ds-impl/tokens-verified.json').tokens;
    const tokenColors = new Set(Object.values(tokens).map(t => t.value.toLowerCase()));
    // ... parse $violations against tokenColors
  "
fi

# 3.8 i18n: hardcoded user strings when i18n active
if grep -q '"active": true' .sl-ds-cache/sl-ds-impl/codebase-analysis.json; then
  # Look for likely user strings in templates (rough heuristic)
  violations=$(grep -rE ">[A-Z][a-z]+\s+[A-Za-z]" "$TGT/**/*.html" "$TGT/**/*.ts" 2>/dev/null \
    | grep -vE "(\| ?i18next|\| ?translate)" \
    | grep -vE "\\$\\{")  # ignore template literals
  # WARN, not FAIL — heuristic is noisy; user must review
fi

# 3.9 a11y: icon-only buttons missing aria-label
violations=$(grep -rA 2 "<sl-button" "$TGT" 2>/dev/null \
  | grep -B 1 "<sl-icon" | grep -v "aria-label")
# WARN if found
```

## 4. Auto-repair budget

Per `.sl-ds-config.yaml` → `pipeline.max_repair_cycles` (default 3).

The budget is per FAILURE TYPE, not per file:
- 3 attempts to fix build errors
- 3 attempts to fix lint errors
- 3 attempts to fix pattern violations
- Beyond budget → STOP and present to user

## 5. Output schema (build-result.json)

```json
{
  "schemaVersion": "1.0.0",
  "producedBy": "sl-ds-verify/build-runner",
  "producedAt": "2026-06-09T...",
  "build": {
    "ok": true,
    "exitCode": 0,
    "warnings": 0,
    "errors": []
  },
  "lint": {
    "ok": true,
    "exitCode": 0,
    "errors": []
  },
  "patternChecks": {
    "ok": true,
    "violations": []
  },
  "repairs": {
    "buildAttempts": 0,
    "lintAttempts": 0,
    "patternAttempts": 0,
    "appliedFixes": []
  }
}
```

## 6. What NOT to do

- ❌ Don't use `--no-verify` or `--ignore-errors` flags to make build pass — that defeats the gate
- ❌ Don't pass build with warnings ignored — warnings indicate real issues
- ❌ Don't auto-add `CUSTOM_ELEMENTS_SCHEMA` as a shortcut for "unknown element" errors — fix the import
- ❌ Don't silently overwrite user code with auto-repair — show what was changed
- ❌ Don't loop indefinitely — budget cap is sacred
