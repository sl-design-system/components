Agent completed. agent_id: fe-quality-metrics, agent_type: research, status: completed, description: FE quality metrics analysis, elapsed: 349s, total_turns: 0, duration: 345s

Now I have comprehensive context from the codebase. Let me compile the full research findings.

---

## Research Findings: Comprehensive Angular Quality Metrics

### Summary

Researched the SL Design System monorepo (`packages/angular`, agent architecture docs, token system, TypeScript/ESLint configs, and component patterns). The project uses **Angular 21**, **standalone components**, **Lit-based web components**, **CSS token variables** (`--sl-*`), and has an existing multi-agent pipeline (v3) with `sdl-quality`, `sdl-repair`, Chromatic visual regression, axe-core accessibility, and `web-codegen-scorer`. The `tsconfig.base.json` already enforces `noImplicitAny`, `noImplicitReturns`, `strictTemplates`, and `strictInjectionParameters`. Key gaps identified: only 3 custom ESLint rules, no token-enforcement linting rules, and `web-codegen-scorer` target is currently only `> 80` (below the 95% goal).

---

# 🏆 Angular Production Quality Metrics — SLDS AI Agent System

> **Target:** ≥ 95/100 composite score across all categories  
> **Context:** AI-generated Angular 21 code from Figma designs using `@sl-design-system/*` web components  
> **Enforcement model:** Fully automated — agent runs all checks without human intervention, max 3 repair cycles before escalation

---

## 1. Code Quality Metrics

### 1.1 Complexity

| # | Metric | What It Measures | Tool / Command | Threshold (Pass = 95%+) | Why It Matters |
|---|--------|-----------------|----------------|------------------------|---------------|
| C1 | **Cyclomatic Complexity** | Number of independent execution paths per method | `npx eslint --rule '{"complexity": ["error", 8]}' src/` | ≤ 8 per method (max 10 tolerated 1× per file) | High CC = hard to test (each path needs a test branch), high bug density |
| C2 | **Cognitive Complexity** | How difficult code is to read/understand (branching + nesting weight) | `@typescript-eslint/cognitive-complexity` ESLint rule | ≤ 12 per function | Human-authored proxy: maps to review effort and bug injection rate |
| C3 | **Max Nesting Depth** | Deepest level of block nesting in any function | `eslint: max-depth: ["error", 4]` | ≤ 4 levels | >4 levels → callback hell / nested subscriptions / illegible template conditions |
| C4 | **Template Nesting Depth** | Structural directive nesting in Angular templates (`*ngIf` inside `*ngFor` inside…) | Custom ESLint `@angular-eslint/template/cyclomatic-complexity` | ≤ 5 structural directives per template | Deep template nesting = impossible to debug change detection issues |
| C5 | **Branch Density** | % of lines with branch logic relative to total lines | `eslint` + custom metric script: `branch_lines / total_lines * 100` | ≤ 3% of lines in any single file | From `sdl-quality.md` §7: `branch_density > 3%` is a WARNING trigger |

---

### 1.2 Size

| # | Metric | What It Measures | Tool / Command | Threshold | Why It Matters |
|---|--------|-----------------|----------------|-----------|---------------|
| S1 | **Component LOC** | Lines of code in `*.component.ts` (class body only) | `wc -l` + custom script filtering class body | ≤ 200 LoC (smart), ≤ 150 LoC (dumb) | From architecture V3: dumb component > 150 lines → split further |
| S2 | **Method Length** | Lines per method/function | `eslint: max-lines-per-function: ["error", { max: 30 }]` | ≤ 30 lines per function | Long methods have high CC, resist refactoring |
| S3 | **File Length** | Total lines per `.ts` file | `eslint: max-lines: ["error", 300]` | ≤ 300 lines per file | From `sdl-quality.md` §7: `> 300 LOC` = WARNING |
| S4 | **Template Complexity Score** | Number of structural directives + bindings + event handlers in a single template | Custom `@angular-eslint` rule or `ng-complexity` npm tool | ≤ 30 bindings total per template | Bloated templates slow compile, destroy readability |
| S5 | **Component Input Count** | Number of `@Input()` / `input()` signals per dumb component | Custom ESLint rule or `grep -c "@Input\|input("` | ≤ 5 inputs per presentational component | From architecture V3: > 5 inputs → split further |
| S6 | **Max Parameters** | Number of parameters per function/constructor | `eslint: max-params: ["error", 4]` | ≤ 4 parameters | DI through `inject()` should replace constructor params; > 4 = design smell |

---

### 1.3 Architecture

| # | Metric | What It Measures | Tool / Command | Threshold | Why It Matters |
|---|--------|-----------------|----------------|-----------|---------------|
| A1 | **Circular Dependencies** | Import cycles between modules/files | `npx madge --circular src/` or `npx dpdm src/main.ts` | 0 circular dependencies | Circular deps break tree-shaking, cause runtime init order bugs |
| A2 | **Coupling (Afferent/Efferent)** | How many modules import a component (Ca) vs how many it imports (Ce) | `npx dependency-cruiser src/ --output-type text` | Instability I = Ce/(Ca+Ce) ≤ 0.7 for shared components | Highly unstable shared components = massive blast radius when changed |
| A3 | **Dependency Depth** | Longest import chain from leaf to root | `npx madge --depth src/` | Max depth ≤ 5 | Deep chains = hard to test in isolation |
| A4 | **Smart/Dumb Compliance** | No service injection in presentational components | Custom ESLint rule: any component NOT named `*Page*` or `*Container*` that uses `inject(Service)` | 0 violations | Architecture V3 rule: dumb components must NOT inject services (except utilities) |
| A5 | **Store Pattern Compliance** | Smart components with state use store pattern | All `*PageComponent` or `*ContainerComponent` with `signal()` state have a matching `*.store.ts` | 100% compliance | Architecture V3: state must live in store, not inline in smart component |
| A6 | **Layer Violation Detection** | NX boundary / layer rule violations | `npx nx lint --all` (enforces `@nx/enforce-module-boundaries`) | 0 boundary violations | Feature libraries must not import from other feature libs directly |

---

### 1.4 Type Safety

| # | Metric | What It Measures | Tool / Command | Threshold | Why It Matters |
|---|--------|-----------------|----------------|-----------|---------------|
| T1 | **`any` Usage** | Occurrences of explicit `any` type annotation | `grep -rn ": any\|<any>\|as any" src/ --include="*.ts" \| grep -v ".spec.ts"` | 0 occurrences in production code | From `sdl-quality.md` §1.1: ZERO TOLERANCE BLOCKER |
| T2 | **Type Assertions (`as`)** | Unsafe `as` casts that bypass type system | `grep -rn " as [A-Z]" src/ --include="*.ts" \| grep -v ".spec.ts\|// branded"` | 0 inline assertions (exception: branded type constructors) | From `sdl-quality.md` §1.2: BLOCKER except branded types |
| T3 | **Strict Mode Compliance** | Full TypeScript strict mode active | `cat tsconfig.json \| jq '.compilerOptions.strict'` → must be `true` OR all strict sub-flags explicitly set | 100% (all flags) | `strict: true` covers `strictNullChecks`, `strictFunctionTypes`, `noImplicitAny` |
| T4 | **`strictTemplates` Active** | Angular template type-checking | `cat tsconfig.json \| jq '.angularCompilerOptions.strictTemplates'` | `true` | Catches template binding errors at compile time, not runtime |
| T5 | **Generic Usage** | Functions/services typed with generics vs duplicated typed variants | Code review metric — count of `<T>` generic declarations / total service/utility count | ≥ 80% of reusable utilities use generics | Prevents code duplication of typed variants |
| T6 | **`noUncheckedIndexedAccess`** | Array/object index access must handle `undefined` | `tsconfig.json: "noUncheckedIndexedAccess": true` | Enabled | Prevents "undefined is not a function" runtime crashes from array indexing |

**Recommended `tsconfig.json` additions** (beyond current `tsconfig.base.json`):
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noPropertyAccessFromIndexSignature": true
  },
  "angularCompilerOptions": {
    "strictTemplates": true,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true
  }
}
```
*(Note: `noPropertyAccessFromIndexSignature` already present in `packages/angular/tsconfig.json:8`)*

---

### 1.5 Performance

| # | Metric | What It Measures | Tool / Command | Threshold | Why It Matters |
|---|--------|-----------------|----------------|-----------|---------------|
| P1 | **OnPush Usage Rate** | % of components using `ChangeDetectionStrategy.OnPush` | `grep -rn "changeDetection" src/ --include="*.component.ts" \| grep -c "OnPush"` / total component count | 100% of dumb components, ≥ 90% of smart components | Default `CheckAlways` re-runs on every event — catastrophic in complex UIs |
| P2 | **Signal Usage (Modern Reactivity)** | Use of `signal()`, `computed()`, `effect()` vs `BehaviorSubject` + async pipe in new code | `grep -rn "signal(\|computed(\|effect(" src/ --include="*.ts"` vs `grep -c "BehaviorSubject"` | ≥ 90% of new reactive state uses signals (not observables for local state) | Angular 21 signals avoid zone.js overhead; BehaviorSubject = legacy |
| P3 | **`trackBy` / `track` in `@for`** | Every `*ngFor` / `@for` has identity tracking | `grep -n "@for\|*ngFor" *.html \| grep -v "track "` | 0 untracked loops | Without tracking: every change destroys and recreates ALL DOM nodes |
| P4 | **Lazy Route Loading** | Feature modules loaded via `loadComponent` / `loadChildren` | `grep -rn "loadComponent\|loadChildren" src/ --include="*.routes.ts"` vs total route count | 100% of page-level routes are lazy | Eager-loaded pages bloat initial bundle; production apps must lazy load |
| P5 | **Bundle Size Budget** | Total initial bundle size after production build | `ng build --configuration=production; cat dist/stats.json \| jq '[.assets[].size] \| add'` | Initial bundle ≤ 200KB gzipped; lazy chunks ≤ 100KB each | LCP directly correlates with bundle size |
| P6 | **`zone.js` Zoneless Mode** | Component uses zoneless scheduling | `angular.json: "experimentalZoneless": true` (already in `packages/angular/angular.json:43`) | Enabled for all new generated apps | 30-40% render performance gain; required for SSR |
| P7 | **Async Density** | % of async operations (subscriptions + awaits) per component | Custom script: `async_ops / total_methods` | ≤ 20 async ops per file | From `sdl-quality.md`: `async_density > 20` = WARNING |

---

### 1.6 Testability

| # | Metric | What It Measures | Tool / Command | Threshold | Why It Matters |
|---|--------|-----------------|----------------|-----------|---------------|
| TS1 | **DI Usage Rate** | % of services accessed via `inject()` or constructor DI vs `new Service()` or singleton access | `grep -c "new.*Service\|getInstance()" src/ --include="*.ts"` | 0 direct instantiations of services in components | DI = mock-friendly; `new Service()` = untestable in isolation |
| TS2 | **Pure Function Ratio** | Functions with no side effects (I/O, external state, DOM manipulation) | Static analysis via `eslint-plugin-functional` or `no-side-effects` custom rule | ≥ 70% of utility/transform functions are pure | Pure functions: `f(x) => y` — trivial to unit test, trivially cacheable |
| TS3 | **Store Testability** | Store classes have no DOM dependencies (no `ElementRef`, no `@ViewChild`) | `grep -rn "ElementRef\|ViewChild\|document\." src/*.store.ts` | 0 DOM dependencies in store files | Stores must be testable without `TestBed`, using plain `new StoreClass()` |
| TS4 | **Mock Surface** | Every external dependency (HTTP, router, auth) injected as interface, not concrete class | Custom check: `grep -rn "inject(HttpClient)" src/ --include="*.ts"` (should use token/interface) | All HTTP calls wrapped in service; no direct `HttpClient` in components | Components injecting `HttpClient` directly cannot be tested without HTTP mocking |
| TS5 | **Hook Count** | Number of lifecycle hooks per component | `grep -c "ngOnInit\|ngOnChanges\|ngAfterView\|ngOnDestroy" src/*.component.ts` | ≤ 3 lifecycle hooks per component | From `sdl-quality.md`: `hook_count > 10` = WARNING |

---

### 1.7 Maintainability

| # | Metric | What It Measures | Tool / Command | Threshold | Why It Matters |
|---|--------|-----------------|----------------|-----------|---------------|
| M1 | **Code Duplication** | Copy-pasted blocks ≥ 5 lines | `npx jscpd src/ --min-lines 5 --min-tokens 50 --reporters console` | ≤ 2% duplication ratio | Duplicated code = doubled bug surface; design changes require multiple edits |
| M2 | **Naming Consistency** | File naming follows Angular conventions (`kebab-case.component.ts`) | `find src/ -name "*.ts" \| grep -v "^\(kebab-case-regex\)"` | 0 naming violations | Inconsistent naming defeats `ng generate` tooling, grep, import resolution |
| M3 | **Dead Code** | Unused exports, unreachable branches | `npx ts-prune src/ --error \| grep -v ".spec.ts"` or `@typescript-eslint/no-unused-vars` | 0 unused exports in production code | Dead code confuses agents and developers; inflates bundle |
| M4 | **TODO/FIXME Comments** | Unresolved technical debt markers | `grep -rn "TODO\|FIXME\|HACK\|XXX" src/ --include="*.ts" --include="*.html"` | 0 in production code | From `sdl-quality.md` §2: BLOCKER — no TODO/FIXME in shipped code |
| M5 | **Code Coverage (Statements)** | % of statements executed by tests | `ng test --code-coverage; cat coverage/lcov.info \| npx lcov-summary` | ≥ 80% statement coverage; ≥ 70% branch coverage | Coverage is a proxy for testability and regression safety |
| M6 | **JSDoc Coverage** | % of public APIs with JSDoc documentation | `npx compodoc -p tsconfig.json --coverageMinimumPerFile 80 --coverageThreshold 80` | ≥ 80% of public inputs/outputs/methods documented | AI agents (and humans) need to understand public API without reading implementation |

---

### 1.8 Angular-Specific

| # | Metric | What It Measures | Tool / Command | Threshold | Why It Matters |
|---|--------|-----------------|----------------|-----------|---------------|
| ANG1 | **Standalone Components** | All components use `standalone: true` (no NgModule) | `grep -rn "standalone: false\|NgModule" src/ --include="*.ts"` | 0 NgModule-based components in new code | Angular 21: NgModules are legacy; standalone = tree-shakeable, lazy-loadable |
| ANG2 | **`inject()` Pattern** | Constructor injection replaced by `inject()` function | `grep -rn "constructor(" src/ --include="*.component.ts" \| grep -v "private\|test"` | ≥ 95% of injections use `inject()` (constructor only for `super()` calls) | `inject()` is the Angular 14+ idiomatic pattern; constructor injection requires decorators |
| ANG3 | **Signal-Based Inputs** | `input()` / `input.required()` vs `@Input()` decorator | `grep -rn "@Input()" src/ --include="*.component.ts"` | 0 `@Input()` decorators in new components (use `input()` signal) | Signal inputs are zoneless-compatible, type-safe, composable |
| ANG4 | **Signal-Based Outputs** | `output()` vs `@Output()` + `EventEmitter` | `grep -rn "@Output()\|EventEmitter" src/ --include="*.component.ts"` | 0 `@Output()` decorators in new components (use `output()`) | Consistent reactive model; `EventEmitter` extends `Subject` (anti-pattern) |
| ANG5 | **Proper Observable Handling** | Observables unsubscribed via `takeUntilDestroyed()` or `async` pipe | `grep -rn "\.subscribe(" src/ --include="*.component.ts" \| grep -v "takeUntilDestroyed\|Subscription"` | 0 unguarded `.subscribe()` calls in components | Memory leaks in components are silent production killers |
| ANG6 | **`async`/`await` vs Observable Decision** | Local state: `async/await`; streams/events: `Observable` | Code review via composition plan | 100% compliance with pattern decision | Mixing paradigms causes confusion; follow architecture V3 rule |
| ANG7 | **No `throw` in Domain Code** | Error handling uses `Result<T,E>` pattern | `grep -rn "^.*throw " src/ --include="*.ts" \| grep -v ".spec.ts\|// intentional"` | 0 `throw` in domain/application services | From `sdl-quality.md` §1.3: BLOCKER |
| ANG8 | **`@for` over `*ngFor`** | Modern control flow syntax used | `grep -rn "\*ngFor\|\*ngIf\|\*ngSwitch" src/ --include="*.html"` | 0 legacy structural directives | Angular 17+ control flow (`@for`, `@if`) is 90% faster and zoneless-compatible |
| ANG9 | **Proper Lifecycle Hook Usage** | `ngOnInit` for DI-dependent init, `constructor` for assignment only | `grep -A5 "constructor" src/ --include="*.component.ts" \| grep -v "inject(\|super(\|="` | 0 side effects in constructors | Side effects in constructors break SSR and unit testing |
| ANG10 | **`CUSTOM_ELEMENTS_SCHEMA`** | Declared on host module/app config to allow SLDS web components | `grep -rn "CUSTOM_ELEMENTS_SCHEMA" src/ --include="*.ts"` | Declared exactly once in `app.config.ts` | Without it: Angular throws template compilation errors for `sl-*` elements |

---

### 1.9 Accessibility

| # | Metric | What It Measures | Tool / Command | Threshold | Why It Matters |
|---|--------|-----------------|----------------|-----------|---------------|
| ACC1 | **axe-core Violations** | WCAG 2.2 AA automated rule violations | `npx playwright test --project=a11y` (uses `@axe-core/playwright`) | 0 critical violations, 0 serious violations | From architecture V3: WCAG 2.2 AA is default standard; critical = BLOCKER |
| ACC2 | **ARIA Label Coverage** | Interactive elements with accessible names | Custom Playwright check: all `sl-button`, `sl-icon-button`, form fields have `aria-label` or visible text | 100% of interactive elements have accessible name | SLDS components use Shadow DOM — ARIA attributes must be on the host element |
| ACC3 | **Semantic HTML Structure** | Proper heading hierarchy, landmarks, list markup | Axe `best-practice` rules + `@angular-eslint/template/no-positive-tabindex` | 0 heading hierarchy violations, 0 positive tabindex | Semantic structure is the foundation of screen reader navigation |
| ACC4 | **Keyboard Navigation** | All interactive elements reachable and operable via keyboard | Playwright keyboard navigation test: `Tab` through all interactive elements | 100% reachability; focus visible at all times | WCAG 2.2 SC 2.1.1 — keyboard alone must accomplish all tasks |
| ACC5 | **Focus Management** | After modal open/close/navigation, focus moves correctly | Playwright test: open dialog → check `document.activeElement` is inside dialog | Focus trapped in modals, restored on close | WCAG 2.2 SC 2.4.3 — focus order must be logical |
| ACC6 | **Color Contrast** | Text contrast ratio against background | `npx lighthouse --only-categories=accessibility --output=json` or axe | ≥ 4.5:1 for normal text, ≥ 3:1 for large text | WCAG 2.2 SC 1.4.3 — SLDS tokens should guarantee this, but custom overrides may break it |
| ACC7 | **Live Region Announcements** | Dynamic content changes announced to screen readers | Custom test: trigger state change → check `aria-live` region updates | All async data load/error states announced | Required for SPAs — screen readers don't detect DOM changes without live regions |

---

### 1.10 Design System Compliance

| # | Metric | What It Measures | Tool / Command | Threshold | Why It Matters |
|---|--------|-----------------|----------------|-----------|---------------|
| DS1 | **SLDS Component Usage** | Correct `sl-*` element used (not custom re-implementation of existing component) | `ds-audit` agent + CEM lookup | 0 custom implementations of components available in SLDS | Re-implementing `sl-button` as `<button class="btn">` breaks design consistency |
| DS2 | **No Hardcoded Colors** | CSS/style values use `var(--sl-color-*)` not `#hex` / `rgb()` | `grep -rn "#[0-9a-fA-F]\{3,6\}\|rgb(\|rgba(" src/ --include="*.scss" --include="*.css"` | 0 hardcoded color values | From `analiza-projektu.md` §5: "NEVER hardcode values — always use `var(--sl-size-300)`" |
| DS3 | **No Hardcoded Spacing** | Spacing uses `var(--sl-size-*)` not `px`/`rem` literals | `grep -rn "[0-9]\+px\|[0-9]\+rem" src/ --include="*.scss" --include="*.css" \| grep -v "0px\|1px\|border"` | ≤ 5 exceptions (borders, 0-value resets are OK) | SLDS uses 8px grid (`--sl-size-100=8px`); hardcoded px breaks theme switching |
| DS4 | **Token Variable Validity** | Used `--sl-*` CSS variables actually exist in current theme | Custom script: extract all `var(--sl-*)` from generated CSS; diff against compiled theme | 0 references to non-existent tokens | Misspelled/non-existent tokens silently render as browser defaults |
| DS5 | **Correct Component Props** | Attributes/properties passed to `sl-*` match CEM-defined API | `ds-api` CEM validation + `@angular-eslint/template/no-unknown-property` | 0 unknown properties passed to SLDS components | CEM defines the public API contract — invalid props are silently ignored |
| DS6 | **Component Status Compliance** | No `draft`-status SLDS components in production code | Check `package.json["status"]` for each used component | 0 draft-status components in production output | From `analiza-projektu.md` §9: draft = API may change on patch update = breaking risk |
| DS7 | **No Inline Styles** | No `style=""` attribute or `[style]` binding on SLDS components | `grep -rn 'style="' src/ --include="*.html"` + ESLint `no-inline-styles` | 0 inline style attributes | Inline styles override Shadow DOM encapsulation and break theme switching |
| DS8 | **Typography Token Usage** | Text sizing uses `var(--sl-text-*)` or SLDS component typography | `grep -rn "font-size\|font-weight\|line-height" src/ --include="*.scss" \| grep -v "var(--sl"` | 0 hardcoded typography values | SLDS text tokens ensure consistent type scale across themes |

---

## 2. Visual Fidelity Metrics (Figma → Output)

### 2.1 Screenshot Comparison Tools

| Tool | Method | Use Case | Integration |
|------|--------|----------|-------------|
| **Chromatic** (already in repo: `chromatic/`) | Cloud-based pixel diff via Storybook stories | Component-level visual regression; PR gate | `npx chromatic --project-token=$TOKEN --exit-once-uploaded` |
| **Playwright screenshot diff** | Pixel-perfect PNG comparison with threshold | Page-level Figma comparison; CI integration | `expect(page).toHaveScreenshot('login.png', { maxDiffPixelRatio: 0.02 })` |
| **BackstopJS** | DOM screenshot + pixel diff (headless Chrome) | Responsive breakpoint comparison across viewport sizes | `npx backstop test --config=backstop.json` |
| **Percy** (BrowserStack) | Cloud AI-powered diff (context-aware, not pure pixel) | Handles font rendering differences; good for cross-browser | `npx percy exec -- playwright test` |
| **Storybook Vitest addon** (already in repo: `.storybook/`) | Snapshot tests integrated in Vitest | Component story vs baseline | `vitest run --reporter=storybook` |

### 2.2 Visual Fidelity Metric Categories

| # | Metric | What It Measures | Tool | Threshold |
|---|--------|-----------------|------|-----------|
| VF1 | **Pixel-Perfect Match** | Overall pixel difference between Figma export (PNG) and rendered component screenshot | Playwright `toHaveScreenshot` | ≤ 2% differing pixels (accounts for anti-aliasing, font hinting) |
| VF2 | **Layout Fidelity — Spacing** | Gap, padding, margin values match Figma spacing tokens | Playwright computed style extraction: `getComputedStyle(el).gap` vs Figma inspect values | ≤ 4px tolerance (1 SLDS grid unit) |
| VF3 | **Layout Fidelity — Alignment** | Elements aligned correctly (flex/grid axes, text alignment) | Playwright bounding box check: `el.boundingBox()` vs expected coordinates | ≤ 2px tolerance |
| VF4 | **Responsive Breakpoints** | Layout reflows correctly at mobile/tablet/desktop | Playwright multi-viewport: 375px, 768px, 1280px, 1920px | ≤ 2% diff at each breakpoint |
| VF5 | **Component Identity** | Correct SLDS component used (e.g., `sl-text-field` not `<input type="text">`) | `ds-mapper` validation + DOM query `document.querySelectorAll('sl-*')` | 100% component identity match |
| VF6 | **Property Fidelity** | Correct `variant`, `size`, `disabled` etc. props applied | DOM attribute inspection: `el.getAttribute('variant')` vs Figma annotation | 100% property match |
| VF7 | **Typography Fidelity** | Font family, size, weight, line-height match design tokens | `getComputedStyle(el).font` vs expected `--sl-text-*` token value | 0 typography mismatches |
| VF8 | **Color Fidelity** | Background, text, border colors match SLDS theme tokens | CSS variable resolution: `getPropertyValue('--sl-color-*')` | 0 color mismatches; 0 hardcoded overrides |
| VF9 | **Interaction States** | Hover, focus, active, disabled visual states match Figma variants | Playwright action + screenshot: `hover()` → screenshot diff | ≤ 2% diff for each interaction state |
| VF10 | **Animation/Transition Timing** | CSS transitions match design spec (duration, easing) | `getComputedStyle(el).transition` vs `--sl-animation-*` token value | Transition tokens used (no hardcoded `0.3s`) |

### 2.3 Automated Figma Comparison Workflow

```bash
# Step 1: Export Figma frame as PNG reference (via Figma API)
figma_export_frame() {
  curl "https://api.figma.com/v1/images/$FILE_KEY?ids=$FRAME_ID&format=png&scale=2" \
    -H "X-FIGMA-TOKEN: $FIGMA_TOKEN" > figma-reference.png
}

# Step 2: Render component in Storybook / Playwright
playwright_screenshot() {
  npx playwright test visual-fidelity.spec.ts --update-snapshots
}

# Step 3: Pixel diff
npx pixelmatch figma-reference.png playwright-actual.png diff.png 0.02 \
  && echo "PASS: ≤2% diff" || echo "FAIL: pixel diff exceeds threshold"

# Step 4: Layout metrics extraction
node scripts/extract-layout-metrics.js --story=login-page \
  --expected=figma-tokens.json --actual=computed-styles.json
```

---

## 3. Auto-Repair Strategy

### 3.1 Repair Trigger Conditions

```
QUALITY_GATE_FAIL triggers repair when:
  - Composite score < 95/100
  - ANY BLOCKER category score = 0
  - Visual fidelity diff > 5% 
  - axe-core critical violations > 0
  - TypeScript compilation errors > 0
  - ESLint error-level violations > 0
  - Bundle size exceeds budget
  - Circular dependencies detected
```

### 3.2 Auto-Repair vs. Escalation Matrix

| Issue Type | Severity | Auto-Repair? | Action | Max Attempts |
|------------|----------|--------------|--------|--------------|
| `any` type annotation | BLOCKER | ✅ Yes | Infer type from usage context; add explicit type | 2 |
| `as` type assertion | BLOCKER | ✅ Yes | Replace with type guard or proper cast | 2 |
| `throw` in domain code | BLOCKER | ✅ Yes | Wrap in `Result<T,E>` | 2 |
| TODO/FIXME comment | BLOCKER | ✅ Yes | Remove comment, implement or create backlog entry | 1 |
| Missing `OnPush` | HIGH | ✅ Yes | Add `changeDetection: ChangeDetectionStrategy.OnPush` | 1 |
| `*ngFor` without `trackBy` | HIGH | ✅ Yes | Add `track item.id` to `@for` | 1 |
| Missing `standalone: true` | HIGH | ✅ Yes | Add to component decorator | 1 |
| `@Input()` → `input()` | MEDIUM | ✅ Yes | Migrate decorator to signal input | 2 |
| Hardcoded color/spacing | MEDIUM | ✅ Yes | Replace with nearest SLDS token | 2 |
| LOC > 300 | WARNING | ⚠️ Attempt | Extract sub-component if structure permits | 1 |
| CC > 8 | WARNING | ⚠️ Attempt | Extract method | 1 |
| Visual diff > 2% | HIGH | ✅ Yes | Re-map Figma values → re-generate affected section | 3 |
| Visual diff > 10% | CRITICAL | ❌ Escalate | Re-run Figma interpretation step (Step 1) | 0 |
| axe critical violation | BLOCKER | ✅ Yes | Apply `a11y-impl` agent | 2 |
| Circular dependency | BLOCKER | ⚠️ Attempt | Introduce interface/token to break cycle | 1 |
| Circular dependency (complex) | CRITICAL | ❌ Escalate | Architecture decision required | 0 |
| Bundle over budget | WARNING | ✅ Yes | Add code splitting, lazy load | 2 |
| Bundle 2× over budget | CRITICAL | ❌ Escalate | Architecture review required | 0 |
| Test compilation failure | BLOCKER | ⚠️ Attempt | Fix type errors in test file | 2 |
| Runtime test failure | HIGH | ⚠️ Attempt | Fix implementation to match test expectation | 2 |
| Runtime test failure (cascade) | CRITICAL | ❌ Escalate | Multiple tests broken = systemic issue | 0 |

### 3.3 Repair Loop Algorithm

```
REPAIR_LOOP(issues, max_cycles=3):
  cycle = 0
  
  while issues.has_fixable() and cycle < max_cycles:
    cycle++
    
    # Priority order (fix highest impact first):
    sorted_issues = sort_by_priority([
      1. TypeScript compilation errors (blocks everything)
      2. BLOCKER-class lint violations (any, as, throw, TODO)
      3. Visual fidelity critical failures (>10% diff)
      4. axe-core critical/serious violations  
      5. Architecture violations (circular deps, layer violations)
      6. OnPush / signal migration
      7. Size/complexity warnings
      8. Documentation gaps
    ])
    
    for issue in sorted_issues:
      if issue.attempted_count >= issue.max_attempts:
        issue.status = "UNFIXABLE"
        continue
      
      fix = generate_fix(issue)
      apply_fix(fix)
      
      # Validate fix didn't break anything
      result = run_verification(issue.verification_command)
      if result.exit_code != 0:
        revert_fix(fix)
        issue.status = "UNFIXABLE: caused regression"
      else:
        issue.status = "FIXED"
        log_to_repair_report(issue, fix, result)
    
    # Re-score after cycle
    new_score = run_full_quality_check()
    if new_score >= 95:
      return "PASS — score achieved after {cycle} repair cycles"
  
  unfixable = issues.filter(status="UNFIXABLE")
  if unfixable.any():
    escalate_to_user(unfixable)
    return "PARTIAL — {N} issues require human decision"
  
  return "FAIL — max cycles exceeded, score={new_score}"
```

### 3.4 Infinite Loop Prevention

```
INFINITE_LOOP_GUARDS:
  1. Issue fingerprint: hash(file_path + line_number + issue_type)
     - Same fingerprint seen twice → mark UNFIXABLE immediately
     
  2. File state hash: hash(file_content) before each fix
     - Same hash after applying fix → no-op detected → mark UNFIXABLE
     
  3. Cycle budget: max 3 cycles regardless of remaining issues
  
  4. Regression detector: 
     - Track test suite pass count before/after each fix
     - If pass count drops → immediate revert + UNFIXABLE
  
  5. Token budget guard:
     - Repair cycle token limit: 15K tokens per cycle
     - If cycle exceeds budget → stop cycle, escalate
```

### 3.5 Repair Prioritization (Weighted Impact)

```
Priority = (Category_Weight × Issue_Severity) / Fix_Complexity

Category weights:
  TypeScript compilation:  10.0 (blocks all other checks)
  Type safety (any/as):     9.0 (production reliability)
  Visual fidelity:          8.5 (this is the core value prop)
  Accessibility:            8.0 (legal/ethical requirement)
  Architecture violations:  7.5 (long-term maintainability)
  Angular best practices:   7.0 (performance/correctness)
  Design system compliance: 6.5 (design coherence)
  Size/complexity:          5.0 (developer experience)
  Documentation:            4.0 (AI agent reusability)
```

### 3.6 Token Cost per Repair Cycle

| Cycle Type | Operations | Estimated Tokens |
|------------|-----------|-----------------|
| **Lint-only repair** | Read diff + apply ESLint fixes (any, OnPush, trackBy) | 3–8K |
| **Template repair** | Re-read template + fix bindings, ARIA, control flow | 5–12K |
| **Architecture repair** | Restructure component (extract store, split smart/dumb) | 10–20K |
| **Visual fidelity repair** | Re-map Figma tokens + regenerate styles | 8–15K |
| **Accessibility repair** | Add ARIA, fix focus management, add live regions | 6–12K |
| **Full repair cycle (all types)** | All of the above in one pass | 20–40K |
| **Escalation report generation** | Write UNFIXABLE report | 2–4K |

**Budget recommendation:** 3 cycles × 30K = **90K token repair budget** per generated screen.

---

## 4. Scoring Formula

### 4.1 Category Weights

```
COMPOSITE_SCORE = Σ(Category_Score × Weight) / Σ(Weights)

Where all scores are 0–100 within each category.
```

| # | Category | Weight | Rationale |
|---|----------|--------|-----------|
| 1 | **Type Safety** | 15 | Production reliability — `any` = silent runtime bombs |
| 2 | **Visual Fidelity** | 15 | Core value prop of AI Figma→code system |
| 3 | **Angular Best Practices** | 12 | Correctness + performance + future-proofing |
| 4 | **Design System Compliance** | 12 | Design coherence; theme switching; no re-invention |
| 5 | **Accessibility** | 12 | Legal requirement (WCAG); EN 301 549 mandate |
| 6 | **Architecture** | 10 | Long-term maintainability; testability at scale |
| 7 | **Performance** | 8 | User experience; LCP/TTI metrics |
| 8 | **Complexity** | 8 | Code readability; bug injection rate |
| 9 | **Maintainability** | 5 | Developer velocity over time |
| 10 | **Testability** | 3 | Testing quality proxy |

**Total weights: 100**

### 4.2 Per-Category Minimum (Floor Rules)

```
COMPOSITE PASS requires ALL of:
  1. Composite score ≥ 95/100
  2. Type Safety ≥ 90 (any/as violations = instant deduction)
  3. Visual Fidelity ≥ 90 (core deliverable)
  4. Accessibility ≥ 90 (WCAG critical = disqualifier)
  5. Angular Best Practices ≥ 85 (compilation must pass)
  6. Design System Compliance ≥ 85
  7. Architecture ≥ 80 (no circulars, no layer violations)
  
  → If ANY floor is not met: FAIL regardless of composite score
  
EXAMPLE: Component with 98/100 composite but Accessibility 50 → FAIL
EXAMPLE: Component with 94/100 composite but no floors violated → BORDERLINE (retry cycle)
```

### 4.3 Score Calculation Per Category

```javascript
// Example: Type Safety Score (weight=15)
function typeScafetyScore(metrics) {
  const anyCount = metrics.anyUsage;          // T1: 0 = 100pts; each +1 = -20pts (floor 0)
  const asCount = metrics.typeAssertions;      // T2: 0 = 100pts; each +1 = -20pts
  const strictMode = metrics.strictEnabled;    // T3: true = 100pts, false = 0pts (hard fail)
  const strictTemplates = metrics.strictTmpl;  // T4: true = 100pts, false = 60pts

  if (!strictMode) return 0; // Hard fail — strict mode is non-negotiable

  const anyScore = Math.max(0, 100 - anyCount * 20);
  const asScore = Math.max(0, 100 - asCount * 20);
  const strictScore = (strictMode ? 100 : 0);
  const tmplScore = (strictTemplates ? 100 : 60);

  return (anyScore + asScore + strictScore + tmplScore) / 4;
}

// Example: Visual Fidelity Score (weight=15)
function visualFidelityScore(metrics) {
  const pixelDiff = metrics.pixelDiffPercent;   // VF1: 0%=100, 2%=80, 5%=50, >10%=0
  const spacingDiff = metrics.spacingDeltaPx;   // VF2: 0=100, 4px=90, 8px=70
  const componentIdentity = metrics.identityMatch; // VF5: 100%=100, 95%=70, <95%=0
  const colorMatch = metrics.colorViolations;   // VF8: 0=100, each violation -15

  const pixelScore = pixelDiff <= 2 ? 100 : pixelDiff <= 5 ? Math.max(0, 80 - (pixelDiff-2)*10) : 0;
  const spacingScore = Math.max(0, 100 - spacingDiff * 2.5);
  const identityScore = componentIdentity >= 100 ? 100 : componentIdentity >= 95 ? 70 : 0;
  const colorScore = Math.max(0, 100 - colorMatch * 15);

  return (pixelScore * 0.4 + spacingScore * 0.2 + identityScore * 0.3 + colorScore * 0.1);
}
```

### 4.4 Handling N/A Metrics

```
N/A POLICY (for prototype vs. production mode):

Mode: PROTOTYPE (Angular Medium quality)
  - Testability metrics: N/A (weight redistributed to Architecture)
  - Coverage metrics: N/A
  - JSDoc metrics: N/A
  - Visual Fidelity: simplified (10% diff tolerance)
  - Score threshold: ≥ 75/100

Mode: PRODUCTION (Angular High quality) — THIS IS THE TARGET
  - All metrics apply
  - Score threshold: ≥ 95/100
  - All floor rules apply

N/A METRIC WEIGHT REDISTRIBUTION:
  When a metric is N/A, its weight is redistributed proportionally
  to remaining metrics in the same category.
  
  Example: No tests exist (prototype) → Testability weight=3 is added
  proportionally to Architecture (10→11.5) and Maintainability (5→6.5)
```

### 4.5 Example Composite Score Calculation

```
Component: login-page (smart) + login-form (dumb)

Category Scores:
  Type Safety:          100/100  (no any, no as, strict mode active)
  Visual Fidelity:       96/100  (1.2% pixel diff, all tokens correct)
  Angular Best Practices: 98/100 (signals, OnPush, inject(), standalone)
  DS Compliance:          95/100 (all sl-* correct, no hardcoded values)
  Accessibility:          92/100 (2 aria-label warnings, no critical)
  Architecture:          100/100 (clean smart/dumb, no circulars)
  Performance:            97/100 (OnPush, lazy route, trackBy)
  Complexity:             94/100 (1 method CC=9, minor warning)
  Maintainability:        90/100 (85% coverage, 0 duplication)
  Testability:            95/100 (DI clean, stores testable)

Weighted score:
  = (100×15 + 96×15 + 98×12 + 95×12 + 92×12 + 100×10 + 97×8 + 94×8 + 90×5 + 95×3) / 100
  = (1500 + 1440 + 1176 + 1140 + 1104 + 1000 + 776 + 752 + 450 + 285) / 100
  = 9623 / 100
  = 96.23/100 → PASS ✅

Floor check:
  Type Safety 100 ≥ 90 ✅
  Visual Fidelity 96 ≥ 90 ✅  
  Accessibility 92 ≥ 90 ✅
  Angular Best 98 ≥ 85 ✅
  DS Compliance 95 ≥ 85 ✅
  Architecture 100 ≥ 80 ✅

RESULT: PASS — 96.23/100
```

---

## 5. Tools & Integration

### 5.1 ESLint Rules & Plugins

```bash
# Install (add to devDependencies):
yarn add -D \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  @angular-eslint/eslint-plugin \
  @angular-eslint/eslint-plugin-template \
  @angular-eslint/template-parser \
  eslint-plugin-functional \
  eslint-plugin-import \
  eslint-plugin-unused-imports
```

**Complete `eslint.config.mjs` additions for generated Angular code:**

```javascript
// Rules for generated Angular components
const angularProductionRules = {
  // Complexity
  'complexity': ['error', 8],
  '@typescript-eslint/cognitive-complexity': ['error', 12],
  'max-depth': ['error', 4],
  'max-lines': ['error', 300],
  'max-lines-per-function': ['error', { max: 30, skipBlankLines: true }],
  'max-params': ['error', 4],

  // Type Safety
  '@typescript-eslint/no-explicit-any': 'error',           // T1 BLOCKER
  '@typescript-eslint/no-unsafe-argument': 'error',
  '@typescript-eslint/no-unsafe-assignment': 'error',
  '@typescript-eslint/consistent-type-assertions': [
    'error', { assertionStyle: 'never' }                   // T2 BLOCKER
  ],

  // Angular-specific
  '@angular-eslint/prefer-standalone': 'error',            // ANG1
  '@angular-eslint/prefer-on-push-component-change-detection': 'error', // P1
  '@angular-eslint/no-lifecycle-call': 'error',
  '@angular-eslint/use-lifecycle-interface': 'error',
  '@angular-eslint/template/cyclomatic-complexity': ['error', { maxComplexity: 5 }],
  '@angular-eslint/template/no-positive-tabindex': 'error', // ACC3
  '@angular-eslint/template/use-track-by-function': 'error', // P3

  // Maintainability
  '@typescript-eslint/no-unused-vars': 'error',            // M3
  'no-warning-comments': ['error', { terms: ['TODO', 'FIXME', 'HACK', 'XXX'] }], // M4
  
  // No throw in domain code (from sdl-quality §1.3)
  'no-throw-literal': 'error',
};
```

| Plugin | Rules Used | Metrics Covered |
|--------|-----------|-----------------|
| `@typescript-eslint` | `no-explicit-any`, `no-unsafe-*`, `cognitive-complexity` | T1, T2, C2 |
| `@angular-eslint` | `prefer-standalone`, `prefer-on-push`, `use-track-by-function` | ANG1, P1, P3 |
| `@angular-eslint/template` | `cyclomatic-complexity`, `no-positive-tabindex`, `accessibility-*` | C4, ACC2, ACC3 |
| `eslint-plugin-functional` | `no-side-effects`, `functional-parameters` | TS2, ANG9 |
| `eslint-plugin-import` | `no-cycle` | A1 |

---

### 5.2 Angular CLI & Build Tools

| Tool | Purpose | Command | Metrics |
|------|---------|---------|---------|
| **`ng build --configuration=production`** | Production build, stats JSON | `ng build --stats-json` | P5 bundle size |
| **`ng test --code-coverage`** | Unit tests + Istanbul coverage | `ng test --code-coverage --watch=false` | M5 coverage |
| **`ng lint`** | Run ESLint via Angular CLI | `ng lint --fix` (repair), `ng lint` (check) | All lint metrics |
| **`npx @angular/cli mcp`** | Angular MCP server for agent queries | `npx @angular/cli mcp` | ANG1-ANG10 |
| **`npx web-codegen-scorer`** | Official Angular code quality scorer | `npx web-codegen-scorer eval --env=angular --files="src/**/*.ts"` | Composite signal |
| **`tsc --noEmit`** | TypeScript type checking | `npx tsc --noEmit -p tsconfig.json` | T1-T6 |
| **`npx compodoc`** | Documentation coverage | `npx compodoc -p tsconfig.json --coverage` | M6 JSDoc |

**`web-codegen-scorer` target:** Change from current `> 80` (architecture V3) to **`> 93`** to align with 95% quality target.

---

### 5.3 SonarQube / Code Climate Metrics

| Tool | Setup | Key Metrics Reported |
|------|-------|---------------------|
| **SonarQube Community** | `sonar-project.properties` + GitHub Action | Cognitive complexity, duplication %, coverage, code smells, security hotspots |
| **SonarCloud** (SaaS) | GitHub App integration | Same as above; PR decoration with quality gate |
| **Code Climate** | `.codeclimate.yml` | Maintainability score, churn, complexity |

```properties
# sonar-project.properties
sonar.projectKey=sl-design-system-angular-generated
sonar.sources=src
sonar.exclusions=**/*.spec.ts,**/node_modules/**
sonar.typescript.tsconfigPath=tsconfig.json
sonar.coverage.exclusions=**/*.stories.ts
sonar.cpd.exclusions=**/*.spec.ts

# Quality Gate thresholds (align with 95% target):
# Condition: Coverage >= 80%
# Condition: Duplicated Lines <= 2%
# Condition: Maintainability Rating = A (CC <= 10)
# Condition: Reliability Rating = A (0 bugs)
# Condition: Security Rating = A (0 vulnerabilities)
```

---

### 5.4 Custom Analyzers

```bash
# 1. Smart/Dumb compliance analyzer
node scripts/check-architecture.js \
  --pattern="*Page*.component.ts → must have *.store.ts" \
  --pattern="*Component.ts (dumb) → no Service injection"
# Output: JSON report for A4, A5

# 2. SLDS token validator  
node scripts/validate-tokens.js \
  --css="src/**/*.scss" \
  --tokens="packages/themes/sanoma-learning/dist/light.css"
# Output: list of invalid --sl-* var references → DS3, DS4

# 3. CEM component validator
node scripts/validate-cem-usage.js \
  --html="src/**/*.html" \
  --cem="node_modules/@sl-design-system/*/custom-elements.json"
# Output: invalid props on sl-* elements → DS5

# 4. Angular signal migration check
node scripts/check-modern-angular.js \
  --check="signal-inputs" \      # @Input() → input()
  --check="signal-outputs" \     # @Output() → output()
  --check="control-flow" \       # *ngFor → @for
  --check="inject-pattern" \     # constructor DI → inject()
  --src="src/**/*.ts"
# Output: legacy pattern count → ANG2-ANG8

# 5. Dependency depth + circular check
npx madge --circular --depth src/
npx dpdm src/main.ts --tree --warning false
# Output: circular deps, max depth → A1, A3

# 6. Bundle analysis
npx webpack-bundle-analyzer dist/stats.json
npx source-map-explorer dist/*.js
# Visual: identify over-budget chunks → P5
```

---

### 5.5 Screenshot Comparison Tools

| Tool | Command | Threshold Config | CI Integration |
|------|---------|------------------|----------------|
| **Chromatic** (repo: `chromatic/`) | `npx chromatic --project-token=$TOKEN` | Auto-accept ≤ 2% per story | GitHub PR status check |
| **Playwright `toHaveScreenshot`** | `npx playwright test visual/` | `{ maxDiffPixelRatio: 0.02 }` | GitHub Actions artifact |
| **BackstopJS** | `npx backstop test` | `"misMatchThreshold": 2.0` in `backstop.json` | Docker-friendly CI |
| **Percy** | `npx percy exec -- playwright test` | Configurable in Percy dashboard | PR comment with diffs |

```typescript
// Playwright visual test for SLDS component fidelity
// visual-fidelity.spec.ts
test('login-page matches Figma design', async ({ page }) => {
  await page.goto('/login');
  await page.waitForSelector('sl-text-field'); // Wait for SLDS hydration
  
  // Full page screenshot
  await expect(page).toHaveScreenshot('login-page.png', {
    maxDiffPixelRatio: 0.02,
    animations: 'disabled'
  });
  
  // Component-level fidelity
  const form = page.locator('sl-form');
  await expect(form).toHaveScreenshot('login-form.png', {
    maxDiffPixelRatio: 0.015 // stricter for component level
  });
  
  // Computed style verification (token compliance)
  const gap = await form.evaluate(el => getComputedStyle(el).gap);
  expect(gap).toBe('var(--sl-size-300)'); // DS3: no hardcoded spacing
  
  // Accessibility check integrated
  const a11yResults = await checkA11y(page, null, {
    runOnly: { type: 'tag', values: ['wcag2aa', 'wcag22aa'] }
  });
  expect(a11yResults.violations).toHaveLength(0);
});
```

---

### 5.6 Bundle Analyzers

| Tool | Command | Output |
|------|---------|--------|
| **`@angular/build` built-in** | `ng build --stats-json` | `dist/stats.json` for webpack-bundle-analyzer |
| **`webpack-bundle-analyzer`** | `npx webpack-bundle-analyzer dist/stats.json` | Interactive treemap of all modules |
| **`source-map-explorer`** | `npx source-map-explorer 'dist/*.js'` | Accurate byte breakdown per source file |
| **`bundlemon`** | `npx bundlemon` + `.bundlemonrc.json` | CI gate with per-file budget enforcement |
| **`@angular/build` budget** | `angular.json: budgets[{type:"initial", maximumError:"200kb"}]` | Built-in ng build failure on budget exceeded |

```json
// angular.json — budget configuration for generated apps
"budgets": [
  {
    "type": "initial",
    "maximumWarning": "150kb",
    "maximumError": "200kb"
  },
  {
    "type": "anyComponentStyle",
    "maximumWarning": "2kb",
    "maximumError": "4kb"
  },
  {
    "type": "anyScript",
    "maximumWarning": "80kb",
    "maximumError": "100kb"
  }
]
```

---

### 5.7 Accessibility Testing Tools

| Tool | Command | Scope | Standard |
|------|---------|-------|----------|
| **`@axe-core/playwright`** | `checkA11y(page)` in Playwright tests | Full page automated scan | WCAG 2.2 AA (configurable) |
| **`Lighthouse`** | `npx lighthouse http://localhost:4200 --only-categories=accessibility` | Page-level score (0-100) | WCAG 2.1 AA subset |
| **`@axe-core/angular`** | Angular provider: `provideAxe()` in test config | Component-level in TestBed | WCAG 2.2 AA |
| **`eslint-plugin-jsx-a11y`** adapted as `@angular-eslint/template` rules | ESLint static analysis | Template static analysis | ARIA/WCAG rules |
| **`pa11y`** | `npx pa11y http://localhost:4200` | Full page, multiple standards | WCAG-AA, Section508 |
| **Storybook accessibility addon** | Storybook UI panel + CI with `@storybook/addon-a11y` | Per-story checks | axe-core rules |

```typescript
// Accessibility test integration pattern
// a11y.spec.ts (Playwright)
import { checkA11y, configureAxe } from 'axe-playwright';

test.beforeEach(async ({ page }) => {
  await configureAxe(page, {
    rules: [
      { id: 'color-contrast', enabled: true },
      { id: 'focus-trap', enabled: true },
    ],
    runOnly: {
      type: 'tag',
      values: ['wcag2aa', 'wcag22aa', 'best-practice']
    }
  });
});

test('ACC1: No axe violations on login page', async ({ page }) => {
  await page.goto('/login');
  const violations = await checkA11y(page, null, {
    detailedReport: true,
    detailedReportOptions: { html: true }
  });
  expect(violations.critical).toHaveLength(0);    // BLOCKER floor
  expect(violations.serious).toHaveLength(0);     // HIGH floor
});
```

---

### 5.8 Complete CI/CD Integration Pipeline

```yaml
# .github/workflows/quality-gate.yml
name: Angular Code Quality Gate

on: [pull_request, push]

jobs:
  quality-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      # 1. Type Safety (T1-T6) — BLOCKER gate
      - name: TypeScript strict check
        run: npx tsc --noEmit -p tsconfig.json
        
      # 2. Lint (C1-C5, S1-S6, ANG1-ANG10, DS2, DS7) — BLOCKER gate
      - name: ESLint production rules
        run: ng lint --max-warnings=0
        
      # 3. Architecture (A1-A6)
      - name: Circular dependency check
        run: npx madge --circular src/ && echo "No circular deps ✅"
        
      # 4. Bundle size (P5) 
      - name: Production build + budget check
        run: ng build --configuration=production
        # Budget violations cause ng build to fail
        
      # 5. Unit tests + Coverage (M5, TS1-TS5)
      - name: Tests with coverage
        run: ng test --watch=false --code-coverage
      - name: Coverage threshold check
        run: |
          COVERAGE=$(cat coverage/lcov.info | npx lcov-summary --json | jq '.lines.pct')
          [ $(echo "$COVERAGE >= 80" | bc) -eq 1 ] || (echo "Coverage $COVERAGE% < 80% FAIL" && exit 1)
        
      # 6. Visual fidelity (VF1-VF10)
      - name: Playwright visual tests
        run: npx playwright test visual/
      - name: Chromatic visual regression
        run: npx chromatic --project-token=${{ secrets.CHROMATIC_TOKEN }} --exit-zero-on-changes
        
      # 7. Accessibility (ACC1-ACC7)
      - name: axe-core accessibility audit
        run: npx playwright test a11y/
      - name: Lighthouse accessibility score
        run: |
          npx serve dist -p 4200 &
          npx lighthouse http://localhost:4200 \
            --only-categories=accessibility \
            --output=json > lighthouse.json
          SCORE=$(cat lighthouse.json | jq '.categories.accessibility.score * 100')
          [ $(echo "$SCORE >= 90" | bc) -eq 1 ] || (echo "A11y score $SCORE < 90 FAIL" && exit 1)
          
      # 8. SLDS compliance (DS1-DS8)
      - name: Token validation
        run: node scripts/validate-tokens.js
      - name: CEM component validation
        run: node scripts/validate-cem-usage.js
        
      # 9. Web Codegen Scorer (composite signal)
      - name: web-codegen-scorer
        run: |
          npx web-codegen-scorer eval --env=angular --files="src/**/*.ts" \
            --min-score=93  # ← Raised from 80 to align with 95% target
            
      # 10. Composite score report
      - name: Generate quality report
        run: node scripts/calculate-composite-score.js \
          --output=quality-report.json \
          --threshold=95
      - name: Upload quality report
        uses: actions/upload-artifact@v4
        with:
          name: quality-report
          path: quality-report.json
```

---

## 6. Quick Reference Cheat Sheet

```
┌─────────────────────────────────────────────────────────────────────┐
│  ANGULAR QUALITY GATE — MINIMUM 95/100 COMPOSITE                    │
├─────────────────────────────────────────────────────────────────────┤
│  BLOCKERS (instant FAIL — zero tolerance):                          │
│    ✗ any type annotation in production code                         │
│    ✗ as type assertion (except branded types)                       │
│    ✗ throw in domain/service code                                   │
│    ✗ TODO/FIXME comments                                             │
│    ✗ TypeScript compilation errors                                   │
│    ✗ axe-core critical/serious violations                           │
│    ✗ Circular import dependencies                                   │
│    ✗ strict: false in tsconfig                                       │
├─────────────────────────────────────────────────────────────────────┤
│  CATEGORY FLOORS (must meet ALL, regardless of composite):          │
│    ≥ 90: Type Safety, Visual Fidelity, Accessibility               │
│    ≥ 85: Angular Best Practices, DS Compliance                      │
│    ≥ 80: Architecture                                                │
├─────────────────────────────────────────────────────────────────────┤
│  KEY ANGULAR 21 PATTERNS (required for production quality):         │
│    ✅ standalone: true (no NgModules)                               │
│    ✅ inject() not constructor DI                                    │
│    ✅ input() / output() not @Input/@Output                         │
│    ✅ signal() / computed() not BehaviorSubject                     │
│    ✅ @for/@if not *ngFor/*ngIf                                      │
│    ✅ OnPush change detection                                        │
│    ✅ takeUntilDestroyed() for Observable subscriptions             │
│    ✅ Smart + Dumb component split with *.store.ts                  │
│    ✅ CUSTOM_ELEMENTS_SCHEMA in app.config.ts                       │
├─────────────────────────────────────────────────────────────────────┤
│  SLDS COMPLIANCE (design system rules):                             │
│    ✅ sl-* components from CEM (no re-implementations)              │
│    ✅ var(--sl-*) tokens only (no hardcoded px/hex/rgb)             │
│    ✅ Only stable/preview components (no draft in production)        │
│    ✅ No inline styles on SLDS components                           │
│    ✅ Correct CEM-defined props/attributes                          │
├─────────────────────────────────────────────────────────────────────┤
│  REPAIR BUDGET:                                                      │
│    Max 3 auto-repair cycles × 30K tokens = 90K tokens               │
│    Priority: TypeScript > Type Safety > Visual > A11Y > Architecture│
│    Infinite loop guard: fingerprint + state hash + token budget     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Gaps & Uncertainties

1. **`web-codegen-scorer` internal rubric is not public** — the current `> 80` threshold in architecture V3 is below the 95% target. The internal scoring dimensions are unknown; the tool should be treated as a signal, not a primary gate metric.

2. **Chromatic token** — `chromatic/package.json` exists but no project token found in repo. Visual fidelity automation requires `CHROMATIC_TOKEN` secret in CI.

3. **Custom ESLint rules gap** — `analiza-projektu.md` §7 explicitly notes "only 3 custom ESLint rules, no token-enforcement rules". The `DS2` (no hardcoded colors) and `DS3` (no hardcoded spacing) metrics require new custom ESLint rules to be authored (e.g., `eslint-plugin-slds` extension). These are defined above but must be implemented.

4. **Draft component detection script** — `DS6` requires a script that cross-references used `sl-*` tags against `package.json["status"]` in each SLDS component package. This script must be authored.

5. **Figma export API key** — the `VF1` pixel comparison workflow requires a Figma access token. The reference comparison PNGs must be exported per CI run or cached per Figma frame ID.

6. **`strictNullChecks` gap** — `tsconfig.base.json` has `noImplicitAny` but not the full `strict: true` flag. **Recommendation:** add `"strict": true` to `tsconfig.base.json` and verify all 54 existing components still compile (likely some have legacy patterns).