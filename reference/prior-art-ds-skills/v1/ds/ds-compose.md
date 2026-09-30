---
name: ds-compose
type: sub-agent
prefix: ds
version: 1.0.0
description: Plans route, library, store, and component composition from an SLDS implementation tree
called_by:
  - ds-impl
invokes:
  - scripts/check-architecture.js
token_budget: "2–4K"
---

# ds-compose

Turns an **SLDS implementation tree into a project-aware composition plan** that respects NX boundaries, existing route patterns, and maintainable component sizing. It decides where smart components, dumb components, stores, and shared UI pieces belong before code is generated. The output is a deterministic `composition-plan.json` that implementation agents can follow file-by-file.

## Purpose

`ds-compose` exists to convert a mapped SLDS tree into an architecture-safe implementation plan for Angular and NX projects. Rather than generating components blindly, it analyzes state needs, route placement, library layering, and extraction opportunities so the resulting code fits the host application's conventions and scales beyond a single screen.

## Input

```json
{
  "sldsTree": ".ds-cache/slds-tree.json",
  "projectStructure": {
    "nxLayout": {
      "apps": ["shop"],
      "libs": ["feature-auth", "ui-auth", "data-access-auth"]
    },
    "existingRoutes": ["", "login", "account"],
    "existingLibs": ["feature-auth", "ui-auth", "data-access-auth"]
  }
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `sldsTree` | Yes | Path to the mapped `slds-tree.json` artifact produced by `ds-mapper` |
| `projectStructure` | Yes | Detected workspace context including NX layout, current route map, and existing library inventory |
| `projectStructure.nxLayout` | Yes | App and lib naming patterns used to place generated code |
| `projectStructure.existingRoutes` | Yes | Known route paths used to avoid conflicts and align with current navigation structure |
| `projectStructure.existingLibs` | Yes | Existing libraries that can be reused instead of creating redundant targets |

## Output

```json
{
  "routes": [
    { "path": "login", "component": "LoginPageComponent", "lib": "feature-auth", "lazy": true }
  ],
  "components": [
    {
      "name": "LoginPageComponent",
      "type": "smart",
      "lib": "feature-auth",
      "layer": "feature",
      "store": "LoginPageStore",
      "children": ["LoginFormComponent", "SocialLoginComponent"]
    },
    {
      "name": "LoginFormComponent",
      "type": "dumb",
      "lib": "ui-auth",
      "layer": "ui",
      "inputs": ["errorMessage"],
      "outputs": ["submitCredentials"]
    }
  ],
  "stores": [
    { "name": "LoginPageStore", "type": "signal-store", "lib": "feature-auth" }
  ],
  "sharedComponents": [
    { "name": "SocialLoginComponent", "reason": "Used in login + register", "lib": "ui-auth" }
  ]
}
```

| Field | Description |
|-------|-------------|
| `routes` | Lazy-route plan derived from pages and existing route structure |
| `components` | Full component decomposition with smart/dumb classification and library placement |
| `components[].store` | Store attached to smart components that own state or service coordination |
| `stores` | State artifacts to generate, including store type and destination library |
| `sharedComponents` | Reusable extracted components created because a pattern repeats or exceeds size thresholds |

## Behavior

### Overview
`ds-compose` takes a mapped tree and produces an implementation plan without generating code yet.

```
1. Read `sldsTree` and `projectStructure`.
2. Validate workspace assumptions with `scripts/check-architecture.js`.
3. Classify page containers, presentational blocks, repeated patterns, and stateful interactions.
4. Assign routes, libraries, stores, and extraction boundaries.
5. Emit `composition-plan.json` for downstream implementation.
```

### Step 1: workspace validation
Before planning composition, confirm the target project structure is usable.

```
1. Inspect `projectStructure.nxLayout`, `existingRoutes`, and `existingLibs`.
2. Run `scripts/check-architecture.js` to confirm supported conventions.
3. Verify that feature, UI, and data-access layers can be mapped.
4. If the workspace layout is unsupported:
   - abort early
   - request manual target guidance from the caller
```

### Step 2: smart/dumb split analysis
Every planned component must have a clear responsibility.

```
for each page and nested component cluster:
  1. mark as SMART if it owns:
     - route-level state
     - service calls
     - orchestration across children
     - side effects, navigation, or async workflows
  2. mark as DUMB if it is purely presentational and receives inputs/outputs only
  3. enforce limits:
     - smart component max 200 LOC target
     - dumb component max 150 LOC target
     - dumb component max 5 inputs
  4. allow smart → dumb nesting
  5. disallow smart-inside-smart beyond one level
```

When a planned component would exceed size or responsibility limits, split it before finalizing the plan.

### Step 3: store analysis
State ownership follows smart components, not leaf UI nodes.

```
1. For each smart component with state needs, create `*.store.ts`.
2. Detect the preferred store model from project conventions:
   - SignalStore
   - NgRx store
   - local component signals
3. Name stores after the owning smart component:
   - `LoginPageComponent` → `LoginPageStore`
4. Place route-specific stores in feature libs.
5. Place reusable API/state services in data-access libs when they are shared.
```

### Step 4: route assignment
Pages from `sldsTree` should become route-aware feature entry points.

```
1. Map each page to a route path.
2. Prefer lazy-loaded routes by default.
3. Respect existing route structure:
   - reuse established feature areas when obvious
   - avoid duplicate or conflicting route paths
4. If a page matches an existing route area, place it in the nearest corresponding feature lib.
5. If a route conflict exists, propose the nearest valid location and lower confidence.
```

### Step 5: NX layer placement
Place implementation artifacts in the correct architectural layer.

```
1. Feature libs contain:
   - smart components
   - route components
   - page stores
2. UI libs contain:
   - dumb components
   - reusable presentational shells
   - extracted shared fragments
3. Data-access libs contain:
   - API services
   - shared state access
   - facades or repository abstractions when the project uses them
4. Reuse existing libs when names and boundaries already fit.
5. Create new libs only when no valid home exists.
```

### Step 6: component extraction rules
Shared and oversized structures must be normalized before implementation.

```
1. Detect repeated visual patterns across pages and siblings.
2. If the same visual pattern appears 2 or more times:
   - extract a shared component
3. If a component is projected to exceed 150 LOC:
   - split it into sub-components
4. If a template would contain more than 30 bindings:
   - extract one or more child components
5. Prefer extracting stable presentational pieces into UI libs.
```

### Step 7: plan finalization
```
1. Build the `routes` array.
2. Build the `components` array with names, types, libs, layers, stores, children, inputs, and outputs.
3. Build the `stores` array.
4. Build the `sharedComponents` array with extraction reasons.
5. Compute confidence based on project convention clarity and route placement certainty.
6. Write `composition-plan.json`.
```

### Naming and placement conventions
```
1. Route components should use page-oriented names:
   - `LoginPageComponent`
   - `RegisterPageComponent`
2. Dumb components should use role-oriented names:
   - `LoginFormComponent`
   - `PasswordFieldComponent`
3. Shared extractions should be named by reusable intent, not screen location.
4. Libraries should align to detected NX names before creating new patterns.
```

## Failure Modes

| Failure | Detection | Recovery |
|---------|-----------|----------|
| NX workspace structure unsupported | `scripts/check-architecture.js` rejects the layout or required fields are missing | Abort and request a manual target structure from the caller. |
| Store model ambiguous | Multiple state patterns detected with no clear dominant convention | Choose the highest-confidence model, continue, and emit a warning. |
| Route placement conflict | Proposed path overlaps or contradicts `existingRoutes` | Suggest the nearest valid route placement and lower confidence. |
| Too many components from one screen (>20) | Component decomposition count for a single page exceeds 20 | Warn about complexity and recommend grouping or higher-level shared extraction. |

## Confidence Scoring

| Condition | Score |
|-----------|-------|
| Clear NX conventions, obvious route placement, and clean smart/dumb boundaries | 90–100 |
| Minor ambiguity in store model or library placement | 75–89 |
| Several route or extraction decisions rely on heuristics | 55–74 |
| Conflicting route structure or overly complex screen decomposition | 30–54 |
| Unsupported workspace layout prevents planning | 0 |

## Design Decisions

1. **Composition planning happens before code generation.** Separating planning from implementation keeps architecture concerns explicit and reviewable.
2. **Smart/dumb boundaries are enforced structurally.** This prevents route components from turning into oversized templates and keeps reusable UI pieces portable.
3. **Stores belong to stateful smart components.** Co-locating stores with the feature owner makes route logic easier to maintain and limits accidental global state growth.
4. **NX layer placement is part of the contract.** A correct component tree is not enough if files land in the wrong architectural layer.
5. **Extraction rules are quantitative on purpose.** Repetition counts, LOC targets, and binding thresholds provide deterministic triggers instead of subjective judgment.
6. **Route certainty affects confidence directly.** Even a good decomposition becomes risky when the target workspace structure does not clearly indicate where pages should live.
