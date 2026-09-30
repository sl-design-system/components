---
topic: generation-rules
applies_to: [sl-ds-implement]
last_updated: 2026-06-09
---

# Generation Rules — Sub-Agent Contract

> **Purpose:** Loaded by `/sl-ds-implement` Steps 3-4. Defines dependency sorting (the order to generate files), the per-file sub-agent contract, and concrete code skeletons for each file kind. FE standards (NG-* Angular, SDS-* SLDS, COMP-*, STYLE-*, ERR-*, FORM-*, AP-*) live in `.agents/standards/fe/` — sub-agents load relevant files in clean context per the lazy-loading discipline of `_shared/fe-standards-index.md`.

## 1. Generation order — dependency sorting (Step 3)

The orchestrator builds a generation queue from `architecture.componentTree`. Sort topologically: a file with no dependencies first, file depending on others last.

### 1.1 Kinds and their dependencies

| Kind | Depends on |
|---|---|
| `styles` (global CSS) | nothing — first |
| `model` (interfaces/types) | nothing — early |
| `service` / `store` | model |
| `component` (leaf — no DS children of its own beyond DS components) | model, service (if it consumes data) |
| `component` (composite — embeds other custom components) | leaf components, model, service |
| `page` (route entry) | composite components, store/service |
| `routes` | page |
| `layout/shell` (only if `architecture.layoutStrategy: new-variant`) | leaf components |

### 1.2 Topological sort

```
queue = []
for kind in [styles, model, service, leaf-components, composite-components, page, routes, barrel]:
  for component in componentTree where component.kind == kind:
    queue.push(component)
```

If a leaf depends on a composite (rare — usually composite depends on leaf), error: cycle detected.

### 1.3 Layout files

If `/sl-ds-layout` set `layoutStrategy: new-variant` AND no shell file exists yet → generate the shell BEFORE the page (page references the shell). Slot in after `service` / before `leaf-components`.

If `layoutStrategy: reuse-extend` → SKIP shell generation (it exists); page references the existing shell with slot projection.

If `layoutStrategy: standalone` → no shell file; page is self-contained.

## 2. Per-file sub-agent contract (Step 4)

Each file is generated in clean Sonnet sub-agent context. The sub-agent receives ONLY what's needed for THIS file.

### 2.0 Pre-generation: fetch Figma design context (MANDATORY for visual components)

**Before spawning a file-generator sub-agent for any `component`, `page`, or `layout/shell` file,** the orchestrator MUST call `mcp__claude_ai_Figma__get_design_context` on the corresponding Figma nodeId from `component-map.json`. This call returns a React+Tailwind reference snippet — the primary visual specification the sub-agent adapts to Angular+SLDS.

```
For each file in generation queue where kind in [component, page, layout]:
  figmaNodeId = component-map.json[this_component].nodeId
  figmaDesignContext = mcp__claude_ai_Figma__get_design_context(
    fileKey = <from .sl-ds-config.yaml>,
    nodeId  = figmaNodeId,
    clientFrameworks = "angular",
    clientLanguages  = "typescript,html,scss",
    excludeScreenshot = false  -- always include screenshot
  )
  pass figmaDesignContext.code + figmaDesignContext.screenshot to sub-agent
```

**What the sub-agent does with it:**
- Use the reference code as the visual SPEC (exact CSS token values, exact element structure, exact text labels)
- Convert React syntax → Angular syntax (JSX → template, className → class, style props → CSS vars)
- Replace Tailwind classes with equivalent CSS using the same token values already in `var(--token-name)` from `tokens-verified.json`
- Use SLDS Web Components (`<sl-button>`, `<sl-card>` etc.) where reference code shows SLDS instances
- **Do NOT invent layout from metadata alone**

**What if design context is too large / sub-agent token limit?**
- Use `excludeScreenshot: true` on second attempt to reduce payload
- Or call on a child nodeId (specific sub-component) rather than the full component root

**Skip for:** `model`, `service`, `store`, `routes`, `styles` file kinds — no visual reference needed.

### 2.1 Sub-agent inputs

```
- file: { path, kind, selector?, modelName?, dataApproach? }
- componentSpec: subset of architecture.componentTree for this component
- figmaDesignContext: { code: string, screenshot: url, nodeId: string }  ← PRIMARY visual spec (see §2.0)
- dsComponents: subset of component-map.json — only entries for elements THIS file renders
- iconsUsed: subset of icons.json — only icons THIS file references
- tokensNeeded: subset of tokens-verified.json — paths this file needs (CSS vars or template values)
- feStandardsPaths: list of paths to consult in .agents/standards/fe/ (e.g. angular.md, sanoma-ds.md, components.md) + specific rule IDs to focus on
- This file (generation-rules.md) for skeletons + must-do rules
```

The sub-agent does NOT receive:
- The full `node-tree.json`
- The full `tokens-verified.json`
- The full `architecture.json` (only the relevant component's spec)
- Other generated files (it's writing fresh)

### 2.2 Sub-agent output

Returns concise JSON:

```json
{
  "file": "<path>",
  "linesWritten": 87,
  "dsImports": ["sl-button", "sl-icon"],
  "tokensUsed": ["color/foreground/primary/bold", "spacing/lg"],
  "iconsUsed": ["graduation-cap"],
  "violations": []
}
```

`violations` is non-empty if the sub-agent caught itself about to violate a rule — should be EMPTY in a successful generation. If non-empty, orchestrator FAILS the file.

## 3. Code skeletons — Angular

### 3.1 `styles.scss` / `<screen>.scss`

```scss
// Generated by /sl-ds-implement. Values from tokens-verified.json. Do not hardcode hex/rgb.

:root {
  // Colors — prefix --sl-, slashes→dashes (per §5 + _shared/token-name-transform.md)
  --sl-color-foreground-primary-bold: #0a6165;
  --sl-color-background-surface-default: #ffffff;
  // Spacing (space/* → --sl-size-*)
  --sl-size-300: 24px;
  --sl-size-200: 16px;
  // Typography
  --sl-icon-typeset-fontfamily-sharp: "Open Sans";
}
```

Tokens map 1:1 from `tokens-verified.json` — prepend `--sl-`, slashes → dashes. See §5 + `_shared/token-name-transform.md` for full rule and exceptions.

### 3.2 Model (`<feature>.model.ts` / `<feature>.types.ts`)

```typescript
// Generated by /sl-ds-implement.

export interface DashboardGroup {
  id: string;
  name: string;
  studentCount: number;
  // ... derive fields from architecture spec
}

export type DashboardData = {
  groups: DashboardGroup[];
  // ... other shape per spec
};
```

### 3.3 Service / Store

For `dataApproach: signal-store`:

```typescript
// Generated by /sl-ds-implement.
import { signalStore, withState, withComputed, withMethods } from '@ngrx/signals';
import { DashboardData } from './dashboard.model';

const initialState: DashboardData = {
  groups: [
    { id: '1', name: 'Class 3A', studentCount: 24 },
    // mock data
  ],
};

export const DashboardStore = signalStore(
  withState(initialState),
  withComputed((state) => ({
    totalStudents: () => state.groups().reduce((sum, g) => sum + g.studentCount, 0),
  })),
  withMethods((state) => ({
    // ... per spec
  })),
);
```

For `dataApproach: service-rxjs`:

```typescript
// Generated by /sl-ds-implement.
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DashboardData } from './dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  // private http = inject(HttpClient);  // wire up when API ready

  getData(): Observable<DashboardData> {
    return of({
      groups: [/* mock data */],
    });
  }
}
```

### 3.4 Component (leaf or composite)

**CRITICAL (Sanoma project):** SLDS v2 exports Web Components (LitElement), NOT Angular components. There is NO `@sl-design-system/angular/*` package. Always use `register.js` + `CUSTOM_ELEMENTS_SCHEMA`. See team lesson `slds-register-js-pattern` in `context/foundation/sl-ds-lessons.md`.

**CRITICAL:** Template structure MUST be adapted from `figmaDesignContext.code` (§2.0) — do not invent layout. Convert React/Tailwind reference code to Angular template, preserving exact CSS token values, element hierarchy, and text content from Figma.

```typescript
// Generated by /sl-ds-implement. Figma node: 1:185 (Hero Section).
// Design context: adapted from figmaDesignContext.code
import { Component, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, input } from '@angular/core';
// Use inject() not constructor injection (NG-1):
// private service = inject(SomeService);

// SLDS Web Component registration — register.js per package, no Angular wrappers (SDS-1)
import '@sl-design-system/button/register.js';
import '@sl-design-system/icon/register.js';

@Component({
  selector: 'max-hero-section',
  imports: [],                               // ← always empty for sl-* (Web Components, SDS-1/SDS-2)
  schemas: [CUSTOM_ELEMENTS_SCHEMA],         // ← REQUIRED for sl-* tags (SDS-2)
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="max-hero-section" data-figma-id="1:185" data-testid="max-hero-section">
      <h1 data-figma-id="1:186">{{ title() }}</h1>
      @if (showCta()) {
        <sl-button variant="primary" (click)="onCta.emit()" data-figma-id="1:187">
          <sl-icon name="arrow-right" slot="suffix"></sl-icon>
          {{ ctaLabel() }}
        </sl-button>
      }
    </section>
  `,
  styleUrl: './max-hero-section.scss',
})
export class MaxHeroSection {
  title = input.required<string>();
  showCta = input(true);
  ctaLabel = input('Get started');
}
```

**4-state template (for data-bound components that fetch/receive async data):**

```typescript
template: `
  @if (loading()) {
    <div data-testid="max-[component]-loading">Loading...</div>
  } @else if (error()) {
    <div data-testid="max-[component]-error">{{ error() }}</div>
  } @else if (!data()) {
    <div data-testid="max-[component]-empty"></div>
  } @else {
    <div data-figma-id="..." data-testid="max-[component]">
      <!-- actual content -->
    </div>
  }
`
```

**Notes:**
- `selector: 'max-...'` — Sanoma convention (SDS-4)
- `imports: []` — zawsze puste dla sl-* (Web Components używają CUSTOM_ELEMENTS_SCHEMA per SDS-1/SDS-2)
- `changeDetection: ChangeDetectionStrategy.OnPush` — MANDATORY (NG-1)
- `input()`, `input.required()` — signals, NOT `@Input()` (NG-8)
- `@if` / `@for` — control flow, NOT `*ngIf` / `*ngFor` (NG-*)
- `inject()` if injecting services — never constructor injection (NG-*)
- `styleUrl` (singular, Angular 17+) — not `styleUrls`
- **`data-testid="[component-name]"` MANDATORY** on root element (presentational) or data state block (data-bound). Required by `/sl-ds-verify` test coverage check.
- **`data-figma-id="<nodeId>"` MANDATORY** on every element that corresponds to a Figma node in `node-tree.json` (root + level-1 + level-2 nodes minimum). Required by `/sl-ds-verify` Step 3 geometric measurement (`document.querySelector('[data-figma-id="<nodeId>"]')`). Generator MUST emit this attribute; absence is a hard gate failure in `/sl-ds-verify`. See §3.7 below for the emission rule.

### 3.5 Page

```typescript
// Generated by /sl-ds-implement.
import { Component, inject } from '@angular/core';
import { MaxHeroSection } from './components/max-hero-section';
import { MaxInsightsPanel } from './components/max-insights-panel';
import { DashboardStore } from './data/dashboard.store';

@Component({
  selector: 'max-teacher-dashboard-page',
  imports: [MaxHeroSection, MaxInsightsPanel],
  providers: [DashboardStore],
  template: `
    <max-hero-section [title]="'Welcome back, Marcin'" />
    <max-insights-panel [stats]="store.groups()" />
  `,
})
export class MaxTeacherDashboardPage {
  protected store = inject(DashboardStore);
}
```

### 3.6 Routes

```typescript
// Generated by /sl-ds-implement.
import { Routes } from '@angular/router';

export const teacherDashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./teacher-dashboard-page').then((m) => m.MaxTeacherDashboardPage),
  },
];
```

`loadComponent` for lazy loading (default per `architecture.routing: lazy`). Use `component:` directly if `routing: eager`.

### 3.7 `data-figma-id` emission rule (MANDATORY)

Every generated component's template MUST emit `data-figma-id="<nodeId>"` on elements that correspond to Figma nodes in `node-tree.json`. This is the contract between `/sl-ds-implement` and `/sl-ds-verify`: the verifier locates DOM elements by Figma nodeId, not by class name heuristics.

**Which elements get the attribute:**

| Element | Emit `data-figma-id`? | Source |
|---|---|---|
| Component root element (the one matching component's selector boundary) | YES — required | `architecture.componentTree[].figmaNodeId` |
| Level-1 children that are themselves Figma nodes in node-tree.json | YES — required | `node-tree.json` direct children with `level === 1` from this component's root |
| Level-2 children (grandchildren of component root) that are FRAME/TEXT in node-tree.json | YES — required | `node-tree.json` `level === 2` |
| Decorative children (`<img>` bg-pattern, purely-styled divs without a Figma counterpart) | NO | no nodeId to emit |
| Children projected via `<ng-content>` from a parent | NO at projection point | parent component already emitted theirs |
| Elements emitted by DS components (`<sl-button>` internal SVG) | NO | Shadow DOM, not measurable |

**Sub-agent input:** the orchestrator passes `figmaIdMap: { [domSelector]: nodeId }` derived from `node-tree.json` + `component-map.json`. Sub-agent uses this to emit `data-figma-id` on the right elements.

**Validation:** `/sl-ds-verify` Step 2 pattern check verifies that every level ≤ 2 FRAME/TEXT/INSTANCE node in `node-tree.json` for this component has a corresponding `data-figma-id` in the generated template. Missing emission → FAIL.

**Why mandatory:** without `data-figma-id`, `/sl-ds-verify` Step 3 falls back to class-name heuristics that may measure the wrong DOM element → false-positive geometric drift reports. This attribute closes that gap.

### 3.8 `file-generator` sub-agent output contract

Canonical contract — sub-agent MUST emit every field, even if empty array. Missing fields → orchestrator treats as malformed and re-spawns with this schema explicit in the briefing.

```json
{
  "schemaVersion": "1.4.0",
  "file": "features/teacher-dashboard/components/max-hero-section.ts",
  "kind": "component" | "page" | "service" | "store" | "model" | "routes" | "styles" | "barrel",
  "linesWritten": 87,
  "dsImports": ["sl-button", "sl-icon"],
  "tokensUsed": ["color/foreground/primary/bold", "spacing/lg"],
  "iconsUsed": ["graduation-cap"],
  "figmaNodeIdsEmitted": ["1:185", "1:186", "1:187"],
  "appliedRules": ["COMP-1", "COMP-3", "NG-1", "SDS-1", "SDS-4"],
  "violations": [],
  "acknowledgedLowConfidence": false
}
```

Field semantics:
- `figmaNodeIdsEmitted` — every `data-figma-id="<nodeId>"` placed in the template (per §3.7). `/sl-ds-verify` Step 2 cross-checks against `node-tree.json` — missing IDs → FAIL.
- `appliedRules` — fe-standards rule IDs the sub-agent consulted while writing. Audit trail in `generation-result.json`.
- `violations` — self-flagged rule violations the sub-agent could not avoid (e.g. SDS-1 violation because target package path is unknown). Non-empty → orchestrator FAILs this file.
- `acknowledgedLowConfidence` — `true` only when passed from `/sl-ds-implement` Step 1.5 confidence gate. File gets header comment: `// [low-confidence] Generated against architecture.json with confidence: <level>. Review the marked sections.`

### 3.9 Per-file-kind rule-ID subset matrix (orchestrator scope-narrowing)

Per [`@_shared/fe-standards-index.md`](../../_shared/fe-standards-index.md) §3.3, the orchestrator narrows the file-generator sub-agent's rule_ids to a per-file-kind subset. Reduces sub-agent context from ~165K (all 7 files) to ~50K (4-6 relevant files) per generation.

| File kind | Scoped rule IDs |
|---|---|
| Leaf component (no form) | `[COMP-1, COMP-3, COMP-4, COMP-7, ERR-1, STYLE-2, NG-1, NG-7, NG-8, SDS-1, SDS-4, SDS-5, AP-1, AP-7]` |
| Composite component (embeds other custom components) | `[COMP-1, COMP-5, COMP-7, ERR-1, NG-1, NG-7, NG-8, SDS-1, SDS-4, AP-1, AP-7]` |
| Form component | `[COMP-1, COMP-8, FORM-1, FORM-2, FORM-3, FORM-4, FORM-5, ERR-2, NG-1, NG-5, SDS-1, SDS-6, AP-3]` |
| Page (route entry) | `[COMP-1, NG-1, NG-3, SDS-4, AP-1]` |
| Service / Store | `[STATE-1, STATE-3, STATE-5, DATA-1, DATA-3, NG-4, NG-5, AP-7]` |
| Model / Types | `[STATE-2, NG-1]` (minimal — types are mechanical) |
| Routes file | `[NG-3]` (lazy-loading conventions) |
| Styles (CSS / SCSS) | `[STYLE-1, STYLE-2, STYLE-3, SDS-5]` (no NG-* — pure CSS) |

Sub-agent also loads ONLY the files needed for its scoped IDs. Example for leaf component without form: loads `angular.md` + `sanoma-ds.md` + `components.md` + `errors.md` + `styling.md` + `antipatterns.md` (NOT `forms.md`).

## 4. Mandatory rules (re-stated, hard gates)

These mirror `.agents/standards/fe/angular.md` (NG-*) + `.agents/standards/fe/sanoma-ds.md` (SDS-*) but the sub-agent MUST internalize them:

0. **`figmaDesignContext` is the PRIMARY visual spec.** Template structure, CSS values, text content — all derived from `figmaDesignContext.code` (§2.0). Sub-agent MUST NOT invent visual design. If design context contradicts `architecture.json` spec on layout — design context wins for visual decisions; spec wins for data/routing decisions.

1. **Tokens via CSS vars ONLY.** Never inline `#0a6165` — use `var(--color-foreground-primary-bold)`. The sub-agent that hardcodes a hex value when a token exists → FAIL. (SDS-5, STYLE-2)
2. **`register.js` side-effect import for every sl-* package used.** `import '@sl-design-system/<pkg>/register.js'` — no Angular wrapper classes in `imports[]`. Forgetting register.js → sl-* tag not defined at runtime → FAIL. (SDS-1)
3. **`CUSTOM_ELEMENTS_SCHEMA` REQUIRED** in every `@Component` with sl-* tags. Always add `schemas: [CUSTOM_ELEMENTS_SCHEMA]` — standard SLDS integration pattern, no decisions doc needed. Missing schema → NG8001 at compile time → FAIL. (SDS-2)
4. **Layout containers = `<div>`, NOT `<sl-card>`.** `component-map.json` already classifies — respect the classification. (SDS-3)
5. **i18n active** (per `.sl-ds-config.yaml` → `i18n.active: true`) → all user-facing strings use the configured pipe (`I18NextPipe` or `TranslatePipe`). Hardcoded strings → FAIL. (SDS-6, I18N-*)
6. **`@for` always has `track`.** No exceptions. (NG-*)
7. **`aria-label` on icon-only buttons.** Mandatory for a11y baseline. (A11Y-*)
8. **No `*ngIf`/`*ngFor`.** Control flow only. (NG-*)
9. **`data-figma-id` emission on every Figma-mapped element ≤ level 2.** Missing emission → FAIL. (See §3.7.)

## 5. Token → CSS var naming

> **MANDATORY: Full rule in [`@_shared/token-name-transform.md`](../../_shared/token-name-transform.md). Follow it exactly — do NOT invent var names.**

```
token path           "color/foreground/primary/bold"
CSS var              "--sl-color-foreground-primary-bold"
usage in scss        var(--sl-color-foreground-primary-bold)
usage in template    [style.color]="'var(--sl-color-foreground-primary-bold)'"
```

Rule: prepend `--sl-`, replace `/` with `-`. Lowercase. Exceptions: `space/*` → `--sl-size-*` (not `--sl-space-*`); `size/text-new/*` → `--sl-size-text-new-*` (stays under size, no prefix swap).

**Fallback values (MANDATORY):**
- Source: `tokens-verified.json["data"]["tokens"][<figma-path>]["value"]`
- Format: `var(--sl-color-X-Y, <value-from-tokens-verified>)`
- ❌ Do NOT use `get_design_context` fallback colors as CSS var fallback values
- ❌ Do NOT hardcode hex without `var()` wrapper when a token exists
- If `<figma-path>` not found in tokens-verified.json → emit `[MISSING_TOKEN_PATH: <path>]` and STOP for orchestrator to resolve. (Distinct from `⚠️[MISSING_TOKEN]` in `token-name-transform.md §Verification` — that fires post-transform when the CSS var isn't in the SLDS theme and uses emit-with-fallback instead of STOP.)

**Verification before emitting:**
```bash
grep -c "<css-var-name>" node_modules/@sl-design-system/sanoma-learning/light.css
# 0 = var does not exist in current SLDS — use fallback form
```

> ⚠️ **HARD GATE — PLAN.md code snippets and legacy codebase CSS are FORBIDDEN as CSS var sources:**
>
> PLAN.md template/CSS snippets may contain **wrong token names** (e.g., `--color-foreground-plain` instead of `--sl-color-foreground-plain`). This happens when the planner reads legacy code. **Never copy CSS var names from PLAN.md snippets verbatim.** Always re-derive from the Figma token paths in the SPEC section and apply the transform rule above.
>
> The app's `styles.css` defines **legacy custom properties** that look like tokens but are NOT `--sl-*`:
> - `--color-*`, `--elevation-*` (old color names, stale values)
> - `--space-new-*`, `--space-*` (old spacing aliases)
> - `--font-family-*`, `--font-size-*`, `--font-weight-*`, `--line-height-*` (old typography aliases)
> - `--border-radius-*` (old border-radius aliases)
>
> These resolve to **outdated/wrong values** (e.g., `--color-foreground-plain: #49555a` ≠ `--sl-color-foreground-plain: #25292f`). **NEVER emit these names in generated code.** Only `--sl-*` names derived from Figma token paths are correct.

### 3.10 Routing Integration (MANDATORY last step per phase)

After generating `<feature>.routes.ts` for a phase:

1. Find the root routes file: `codebase-analysis.json → appRoutesPath` (typically `app.routes.ts` or `app-routing.module.ts`). If `appRoutesPath` is null or absent → ask via `AskUserQuestion` before proceeding. Do NOT guess the path.
2. Check if feature path already exists in the file:
   ```bash
   grep -c "path:.*<feature-path>" <appRoutesPath>
   ```
3. If count = 0 → append lazy-loaded entry to the routes array:
   ```typescript
   {
     path: '<feature-path>',
     loadChildren: () =>
       import('./<feature>/<feature>.routes').then(m => m.<FeatureName>Routes)
   }
   ```
4. `<feature-path>` source: PLAN.md architecture section (routing key). If absent → ask via `AskUserQuestion` before writing.
5. **NEVER overwrite existing routes.** Append only.

If no `<feature>.routes.ts` was generated in this phase (e.g. phase adds only components to existing feature) → skip this step.

### 3.11 i18n Integration (conditional — only when `i18n.active: true`)

Condition: `.sl-ds-config.yaml` → `i18n.active: true` AND `i18n.pipe_name` set.

After completing all file generation for a phase:

1. Orchestrator spawns `sl-ds-i18n` as a sub-agent passing `filePaths[]` (generated `.html` + `.ts` files). Sub-agent returns `{ extractedKeys: { [file]: string[] }, localeUpdates: { [key]: string } }`. (Alternatively: dispatch as a skill redirect — sl-ds-implement pauses and resumes after sl-ds-i18n completes.)
2. `sl-ds-i18n` extracts string literals, generates keys (`<app>.<feature>.<component>.<string-id>` convention), writes to locale JSON
3. Orchestrator re-edits generated templates using the returned `localeUpdates` map: replaces hardcoded strings with `{{ '<key>' | <pipe_name> }}`
4. Verify locale JSON has all new keys before committing. If any key is missing → STOP, surface as `violations[]` entry; do NOT commit this phase.

If `i18n.active: false` → skip entirely (not a FAIL condition).

### 3.12 Barrel Export (MANDATORY per new feature directory)

When a phase creates a new `features/<feature>/` or `components/<group>/` directory:

**Public vs. private:** Public = consumed by a parent feature, page, or cross-feature module. Private = referenced only within their owning composite component. Only public exports go in `index.ts`.

1. Generate `index.ts` in that directory exporting all public components, services, and models:
   ```typescript
   export { MaxComponentName } from './max-component-name';
   export { FeatureService } from './feature.service';
   export { FeatureModel } from './feature.model';
   ```
2. If the directory already has `index.ts` → APPEND new exports, do NOT overwrite
3. For shared models/services: check `app/models/index.ts` and `app/services/index.ts` — update if they exist. If they do not exist yet → create them and add to `filesToCreate[]`.
4. `index.ts` is added to the phase's `filesToCreate[]` list in the orchestrator's output

## 6. Icon registration (MANDATORY before emitting `<sl-icon>`)

Before including `<sl-icon name="X">` in any generated template:

**Step 1 — Registry check:**
```bash
grep -c '"X"' node_modules/@sl-design-system/sanoma-learning/icons.js
# > 0 → registered, safe to use
# = 0 → NOT registered — follow steps below
```

Available registered icon names (as of SLDS sanoma-learning 1.1.3):
`angle-down`, `bars`, `calendar`, `caret-down`, `caret-down-solid`, `caret-left`, `caret-left-solid`, `caret-right`, `caret-right-solid`, `check`, `check-solid`, `chevron-down`, `chevron-left`, `chevron-right`, `circle`, `circle-check`, `circle-check-solid`, `circle-exclamation`, `circle-exclamation-solid`, `circle-solid`, `circle-xmark`, `circle-xmark-solid`, `clock`, `dash`, `dash-solid`, `diamond-exclamation`, `diamond-exclamation-solid`, `ellipsis`, `ellipsis-down`, `ellipsis-vertical`, `face-smile`, `grip-lines`, `home-blank`, `magnifying-glass`, `minus`, `octagon-exclamation`, `octagon-exclamation-solid`, `octagon-xmark`, `octagon-xmark-solid`, `plus`, `slash-forward`, `sort-down`, `sort-up`, `star`, `triangle-exclamation`, `triangle-exclamation-solid`, `xmark`

**Step 2 — Unregistered icon: three resolution paths (in order of preference):**

**A. Download SVG from Figma and register inline** ← preferred when Figma node ID is known:
1. Call `download_assets` MCP tool with the icon's Figma nodeId (from `node-tree.json`), format `svg`
2. Strip any hardcoded `fill` attributes from SVG paths; replace with `fill="var(--sl-icon-fill-default)"`
3. Register in `apps/<scope>/src/main.ts` **before** `setup()`:
   ```typescript
   import { Icon } from '@sl-design-system/icon';
   import '@sl-design-system/icon/register.js';
   Icon.register({
     'bolt': { svg: '<svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="...FA7 path data..." fill="var(--sl-icon-fill-default)"></path></svg>' }
   });
   setup(); // sanoma-learning setup() after Icon.register()
   ```
4. Use `<sl-icon name="bolt">` as normal in templates.

**B. Install Font Awesome Pro package** ← when `@fortawesome/pro-*-svg-icons` is available (check `package.json`):
```typescript
import { faBolt } from '@fortawesome/pro-light-svg-icons'; // or pro-regular, pro-solid
import { Icon } from '@sl-design-system/icon';
Icon.register(faBolt);
// Template: <sl-icon name="fal-bolt"> (prefix-iconName format)
```

**C. Substitute with closest registered icon + document** ← last resort:
- Pick the semantically closest icon from the registered list above
- Add a comment in the component's TypeScript file: `// ICON_SUBSTITUTION: bolt → star (FA7 Pro bolt not registered; register per generation-rules §6 to restore)`
- Do NOT emit `[ICON_SUBSTITUTION]` as a literal in HTML templates

**Step 3 — If PLAN.md flags an icon registration task:** implement it in Phase 1 (before any component that uses that icon), so the icon is available when components render.

> ⚠️ Skipping icon registration produces **empty/invisible icons** at runtime — no console error, no build error, silent visual failure. Always complete one of steps A/B/C before committing a component that uses `sl-icon`.

## 7. WIP commit message format

```
wip(sl-ds): generate <file-path> [sl-ds-implement]
```

One per file. Exception: skip for `styles.scss` if framework treats it as artifact.

If git is not in a clean state (uncommitted unrelated changes) → DO NOT commit; just write files and warn user that WIP commits are skipped this run.

## 7. What NOT to do

- ❌ Don't generate one giant file with everything — respect the componentTree decomposition
- ❌ Don't add a "TODO" comment as a workaround for a hard rule — fix it or FAIL
- ❌ Don't import all `@sl-design-system/angular/*` "just in case" — only what's used
- ❌ Don't use `forwardRef` to break circular deps — refactor the tree (shouldn't happen with proper sort)
- ❌ Don't include implementation notes in the actual code as comments — the user reads the diff, not the comments
- ❌ Don't run `nx build` to "test" the generated file — that's `/sl-ds-verify`'s job; this skill writes files
