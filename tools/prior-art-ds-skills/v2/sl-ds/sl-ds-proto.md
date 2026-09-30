---
name: sl-ds-proto
type: orchestrator
prefix: sl-ds
version: 1.0.0
description: Generates clickable SLDS prototypes from Figma in HTML/JS or Angular modes
called_by:
  - developer
invokes:
  - sl-ds-version
  - sl-ds-figma
  - sl-ds-mapper
  - sl-ds-compose
token_budget: "15–55K"
---

# sl-ds-proto

`sl-ds-proto` turns Figma designs into fast, clickable prototypes without forcing production-quality constraints too early. It supports a zero-build HTML/JS path for quick demos and an Angular path for teams that want a scaffold that can later be promoted into `sl-ds-impl`. It is optimized for speed, fidelity, and demoability rather than long-term maintainability.

## Purpose

`sl-ds-proto` is the user-facing prototype orchestrator for the design-system workflow. It interprets the request, chooses the right prototype mode, maps the design to SLDS building blocks, and writes a working demo output folder with the minimum structure needed for navigation and interaction.

The agent must separate throwaway prototyping from production implementation:

1. Mode A creates disposable HTML/JS prototypes with no quality gate.
2. Mode B creates Angular prototypes with a lightweight quality gate.
3. Requests to implement a real application feature belong to `sl-ds-impl`, not `sl-ds-proto`.

## Input

```json
{
  "request": "Create a prototype in Angular for the login and forgot-password screens.",
  "figmaUrl": "https://www.figma.com/file/...",
  "projectRoot": "/path/to/repo",
  "mode": "auto",
  "screenIds": ["login", "forgot-password"],
  "outputRoot": "/path/to/repo",
  "angularMode": "B2",
  "version": "2.0.1"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `request` | Yes | Natural-language instruction that determines prototype intent and routing |
| `figmaUrl` | Yes | Figma file or frame URL to interpret |
| `projectRoot` | No | Existing repository root for environment detection and vendor sourcing |
| `mode` | No | `auto` \| `A` \| `B`; default is `auto` |
| `screenIds` | No | Specific frames or screens to include; all relevant frames when omitted |
| `outputRoot` | No | Directory where `prototype/` or `prototype-angular/` should be created |
| `angularMode` | No | `B1` or `B2` when `mode=B`; default `B2` |
| `version` | No | Explicit SLDS version override |

## Output

```json
{
  "modeResolved": "B2",
  "projectPath": "prototype-angular/",
  "entryPoints": [
    "prototype-angular/src/main.ts",
    "prototype-angular/src/app/app.routes.ts"
  ],
  "vendorStrategy": "workspace-node-modules",
  "qualityGate": {
    "lint": "passed",
    "build": "passed"
  },
  "promotableTo": "sl-ds-impl-step-4",
  "warnings": [
    "Mode B1 was not selected because B2 is the default and more stable."
  ],
  "confidence": 90
}
```

| Field | Description |
|-------|-------------|
| `modeResolved` | Final mode selection: `A`, `B1`, or `B2` |
| `projectPath` | Root folder of generated prototype output |
| `entryPoints` | Primary files used to launch or inspect the prototype |
| `vendorStrategy` | How SLDS assets were sourced for the prototype |
| `qualityGate` | Lint/build status for Mode B; omitted for Mode A |
| `promotableTo` | Promotion path when the prototype can continue into implementation |
| `warnings` | Mode, wrapper, fidelity, or dependency caveats |
| `confidence` | 0–100 confidence in prototype completeness |

## Behavior

### 1. Request routing

Use this decision logic exactly:

```
"prototype" / "mockup" / "quick demo"    → Mode A
"prototype in Angular" / "scaffold"       → Mode B
"implement" / "add to our app"            → NOT sl-ds-proto (use sl-ds-impl)
Ambiguous?                                  → Ask user
Default: Mode A
```

If `mode` is provided explicitly, it overrides keyword routing. If the request is clearly implementation-focused, `sl-ds-proto` must stop and redirect instead of generating a partial prototype.

### 2. Common setup

```
1. Resolve SLDS version:
   - Use explicit `version` when provided.
   - Else call `sl-ds-version` with `projectRoot`.
2. Call `sl-ds-figma` to extract frames, hierarchy, copy, and interaction intent.
3. Call `sl-ds-mapper` to produce an SLDS-aligned component tree for each screen.
4. Group screens into routes, dialogs, and shared sections.
5. Choose Mode A or Mode B.
```

Shared outputs from this phase include a normalized screen list, a component usage inventory, and the minimal navigation map required to make the prototype clickable.

### 3. Mode A — HTML/JS, zero build

Mode A is the default for quick demos and disposable mockups.

```
1. Create `prototype/`.
2. Generate:
   - `prototype/index.html`
   - `prototype/pages/*`
   - `prototype/js/*`
   - `prototype/styles/*`
3. Bundle only the SLDS assets needed for the used components into `prototype/vendor/slds/`.
4. Wire page navigation between screens.
5. Implement basic interactions:
   - form submission
   - button clicks
   - loading states
   - error states
   - dialogs
6. Do not run a quality gate.
7. Mark output as throwaway.
```

Generation target is approximately 30–60 seconds. The prototype must look plausible and behave clickably, but internal architecture is intentionally lightweight.

### 4. Mode B — Angular prototype

Mode B is for teams that want an Angular scaffold rather than static files.

```
1. Resolve sub-mode:
   - `B2` by default
   - `B1` only when explicitly requested
2. Create `prototype-angular/`.
3. Use Angular 21 patterns:
   - standalone APIs
   - signals
   - `inject()`
4. Use `sl-ds-compose` in lite / Mode B only to define routes, page shells, and component placement.
5. Prefer SLDS Angular wrappers whenever available.
6. Generate basic render tests.
7. Run quality gate:
   - lint
   - build
8. Skip composite scoring and deep architecture review.
```

Mode B output must be understandable, bootable, and ready for demo work. It is not yet production quality, but it should be a viable starting point for `sl-ds-impl` Step 4.

### 5. Mode B sub-mode policy

| Sub-mode | When to use | Characteristics |
|----------|-------------|-----------------|
| `B1` | Explicit request for CDN-loaded Angular experiment | Faster setup, more fragile, experimental |
| `B2` | Default | Standard Angular project structure, `npm start` expected |

If the request says only “Angular prototype,” `sl-ds-proto` must choose `B2`.

### 6. Vendor bundling for Mode A

SLDS asset sourcing for Mode A follows this order:

```
1. If `projectRoot` contains node_modules with matching SLDS packages:
   → copy from local installation.
2. Else if a project exists without installed packages:
   → use `npm pack @sl-design-system/{component}@{version}` from GitHub Packages.
3. Bundle only `register.js` and required runtime assets for the used components.
4. Do not vendor the full component catalog unless every component is actually used.
```

This keeps the prototype small and reproducible while avoiding unnecessary payload.

### 7. Prototype interaction guarantees

Regardless of mode, generated output must support:

1. Page-to-page navigation for all selected screens.
2. At least one working happy-path interaction per flow.
3. Visible loading and error states where the design implies async behavior.
4. Dialog and overlay behavior when present in the design.

Data may be mocked, but mocked state transitions must be deterministic and obvious in code.

### 8. Promotion boundary

`sl-ds-proto` can promote only one direction:

- Mode A → manual redesign or discard.
- Mode B → `sl-ds-impl` Step 4 as a scaffold handoff.

`sl-ds-proto` must not claim production readiness. If the user asks to integrate the prototype into a target app, hand the request to `sl-ds-impl`.

## Failure Modes

| Failure | Detection | Recovery |
|---------|-----------|----------|
| Request is actually implementation work | Intent detection matches “implement” or “add to our app” | Stop and redirect to `sl-ds-impl`. |
| Version cannot be resolved | No explicit version and `sl-ds-version` cannot detect one | Use the latest project-detectable version only if present; otherwise abort and request a version. |
| Figma frames are incomplete | `sl-ds-figma` returns missing or partial screen data | Generate only confirmed screens and warn about skipped areas. |
| SLDS asset bundling fails in Mode A | Neither local node_modules nor `npm pack` succeeds | Abort Mode A generation and report vendor acquisition failure. |
| Angular wrapper missing in Mode B | Wrapper lookup fails for one or more components | Fall back to raw web components and warn that wrapper-first could not be applied. |
| Mode B quality gate fails | Lint or build reports errors | Return failed prototype result with logs and suggest promotion to `sl-ds-impl` only after repair. |

## Confidence Scoring

| Condition | Confidence |
|-----------|------------|
| Version resolved, Figma parsed cleanly, prototype generated, required interactions present | 90–100 |
| Prototype generated with minor wrapper or asset warnings | 75–89 |
| Partial screen coverage or degraded fallback used | 55–74 |
| Vendor acquisition failed for some required components | 25–54 |
| Mode could not be resolved or generation aborted | 0–24 |

## Design Decisions

1. **Two-mode split.** Fast HTML/JS output and Angular scaffolding solve different prototype needs and should not be forced through one template.
2. **Default to Mode A.** Most prototype requests value speed and demoability over framework ceremony.
3. **B2 as Angular default.** A standard Angular project is more stable and easier to promote than a CDN experiment.
4. **No quality gate for Mode A.** Throwaway demos should not pay the same validation cost as implementation-ready scaffolds.
5. **Wrapper-first in Angular mode.** When wrappers exist, they align best with Angular ergonomics and reduce integration friction later.
6. **Tight vendor bundling.** Shipping only used `register.js` assets keeps demos fast and avoids unnecessary dependency sprawl.
