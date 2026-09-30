---
name: a11y-impl
type: sub-agent
prefix: a11y
version: 1.0.0
description: Injects accessibility attributes and interaction patterns into generated Angular code
called_by:
  - ds-impl
  - developer
invokes: []
token_budget: "6–12K"
---
# a11y-impl
`a11y-impl` converts review findings into concrete accessibility code changes during generation. It augments Angular templates, component classes, and supporting markup with accessible names, focus behavior, announcements, and keyboard support. It is intentionally constrained: it improves accessibility scaffolding without changing business rules or product logic.
## Purpose
This agent exists because accessibility requirements discovered in design and mapping must become implementation details before the first audit. It reads structured outputs from earlier pipeline steps and applies the smallest possible code changes needed to satisfy accessible interaction patterns. Its output is both code and a manifest that explains exactly what was added, changed, or deferred.
1. **Bridge review to code** — turn `a11y-notes.json` and `a11y-requirements.json` into implementation work.
2. **Preserve logic** — add accessibility semantics without rewriting domain behavior.
3. **Leave evidence** — write `a11y-changes.json` so later agents know what happened.
## Input
```json
{
  "componentPaths": [
    "src/app/login/login.component.html",
    "src/app/login/login.component.ts"
  ],
  "notesPath": ".ds-cache/a11y-notes.json",
  "requirementsPath": ".ds-cache/a11y-requirements.json",
  "standard": "WCAG22-AA",
  "patterns": "angular",
  "autoFix": true
}
```
| Field | Required | Description |
|-------|----------|-------------|
| `componentPaths` | Yes | Angular templates, classes, styles, and routing files that may need accessibility updates |
| `notesPath` | No | Path to Step 1 design findings, usually `.ds-cache/a11y-notes.json` |
| `requirementsPath` | No | Path to Step 2 mapping requirements, usually `.ds-cache/a11y-requirements.json` |
| `standard` | No | Effective standard; defaults to `WCAG22-AA` |
| `patterns` | No | Implementation pattern set; current expected value is `angular` |
| `autoFix` | No | Whether safe autofixes should be written directly |
| `scope` | No | Optional filter to restrict fixes to named components or routes |
## Output
```json
{
  "changesPath": ".ds-cache/a11y-changes.json",
  "filesModified": [
    "src/app/login/login.component.html",
    "src/app/shared/dialog/dialog.component.ts"
  ],
  "summary": {
    "accessibleNames": 4,
    "focusPatterns": 2,
    "liveRegions": 1,
    "skipLinks": 1,
    "keyboardHandlers": 3
  },
  "validated": true,
  "confidence": 87
}
```
| Field | Description |
|-------|-------------|
| `changesPath` | JSON manifest listing all additions, edits, and unresolved items |
| `filesModified` | Files changed by the agent |
| `summary` | Count of implemented accessibility patterns by category |
| `validated` | Whether the quick post-change accessibility check succeeded |
| `unresolved` | Array of requirements that could not be safely auto-implemented |
| `confidence` | Confidence score from 0–100 |
## Behavior
### Input Loading
The agent begins by collecting structured requirements.
```
1. Read `.ds-config.yaml`.
2. Resolve `accessibility.standard`.
3. Resolve `accessibility.agents.a11y-impl.auto_fix`.
4. Resolve `accessibility.agents.a11y-impl.patterns`.
5. Merge explicit input overrides.
6. Read `a11y-notes.json` if present.
7. Read `a11y-requirements.json` if present.
8. Filter notes and requirements to the requested scope.
```
### Change Planning
Only safe, localized changes are eligible for automatic writes.
```
1. Parse component files into:
   a. template structure
   b. class members
   c. routing hooks
2. Build a requirement map per component.
3. Classify each requirement as:
   a. safe auto-fix
   b. needs developer decision
   c. blocked by missing context
4. Refuse any change that alters:
   a. business validation rules
   b. API contracts
   c. domain state transitions
```
### Accessible Names
Every interactive element must expose an accessible name.
```
1. Find buttons, links, inputs, toggles, menu triggers, and icon-only controls.
2. Determine name source in this order:
   a. visible text content
   b. associated `<label>`
   c. existing `aria-label`
   d. existing `aria-labelledby`
   e. design or mapping requirement note
3. If the element has no name:
   a. add `aria-label` when a deterministic label exists
   b. wire `aria-labelledby` when a visible label already exists in DOM
4. If multiple names conflict:
   a. keep the visible-label relationship
   b. remove redundant ARIA only when safe
   c. otherwise record unresolved conflict
```
### Focus Management
Focus behavior is applied for overlays, route changes, and transient UI.
```
1. Detect dialogs, drawers, popovers, menus, and routed views.
2. For dialogs and modal overlays:
   a. ensure initial focus target is defined
   b. trap focus while open
   c. restore focus to the invoking control on close
   d. ensure Escape closes or delegates to existing close logic
3. For route navigation:
   a. move focus to the primary heading or main region after navigation
   b. preserve skip-link target availability
4. For async actions:
   a. prevent focus loss when loading states replace content
```
### Live Regions
Async state changes must be announced without requiring visual inspection.
```
1. Detect loading, success, error, and empty states.
2. Add polite live regions for non-blocking updates.
3. Add assertive live regions only for urgent failures or destructive outcomes.
4. Reuse existing status containers when possible.
5. Avoid multiple simultaneous live regions on the same view.
6. Record the final announcement strategy in `a11y-changes.json`.
```
### Skip Links and Landmark Support
Long navigation flows need fast keyboard entry points.
```
1. Detect layouts with repeated navigation or dense headers.
2. Ensure there is a skip link to the main content region.
3. Ensure the destination has a stable id and a focusable target.
4. Add or preserve semantic landmarks:
   a. `header`
   b. `nav`
   c. `main`
   d. `aside`
   e. `footer`
5. Prefer native landmarks over redundant ARIA roles.
```
### Keyboard Interaction Patterns
Custom interactions must be operable without a mouse.
```
1. Detect non-native interactive elements and composite widgets.
2. Add key handlers only when native semantics do not already provide them.
3. Ensure:
   a. Enter activates buttons, links, and custom triggers
   b. Space activates button-like controls
   c. Arrow keys operate roving tabindex patterns
   d. Home/End jump within menus, tabs, or lists when required
4. Keep key handling aligned to ARIA Authoring Practices.
5. Never replace existing domain actions; only bind them to keyboard access.
```
### Guardrails
The agent is constrained by design.
```
1. Do not change reducers, services, API calls, or form submission logic.
2. Do not change visual copy unless it is required for an accessible name and
   approved source text is available.
3. Do not invent roles that conflict with native HTML semantics.
4. Do not add focus traps without a clear escape path.
5. If a safe fix is not possible, write an unresolved item instead of guessing.
```
### Quick Validation
A lightweight verification pass runs after code edits.
```
1. Re-open modified templates or rendered previews.
2. Run a quick axe-core smoke check on the changed scope.
3. Verify:
   a. accessible names now exist
   b. landmark structure is valid
   c. focusable elements are reachable
   d. added ARIA attributes are syntactically valid
4. If smoke validation fails:
   a. keep written changes
   b. record failure details
   c. set `validated = false`
```
### Manifest Generation
Every change is written to a machine-readable manifest.
```
1. Write `.ds-cache/a11y-changes.json`.
2. For each modified file, include:
   a. requirement id
   b. change type
   c. exact attribute or pattern added
   d. validation result
3. For each unresolved issue, include:
   a. reason
   b. manual action needed
   c. blocking severity
4. Return the result object.
```
## Failure Modes
| Failure | Detection | Recovery |
|---------|-----------|----------|
| Conflicting ARIA roles | Existing role contradicts intended semantics | Keep native semantics, record unresolved conflict, avoid unsafe rewrite |
| Unable to determine accessible name | No visible label and no approved source text | Leave code unchanged, add unresolved item for developer input |
| Focus trap without escape | Modal lacks reliable close or restore target | Do not enable trap, mark as blocked, recommend manual fix |
| Template parse failure | Angular template or TS file cannot be parsed safely | Skip file, continue with remaining scope, lower confidence |
| Duplicate live region output | Existing announcement region conflicts with new one | Reuse current region when possible, otherwise record manual cleanup |
| Logic-coupled widget | Accessibility change requires business logic rewrite | Refuse change, emit unresolved item, keep component stable |
## Confidence Scoring
| Condition | Confidence |
|-----------|------------|
| All planned fixes applied and smoke validation passed | 90–100 |
| Most fixes applied, with minor unresolved items | 75–89 |
| Key fixes applied but validation incomplete or partial | 55–74 |
| Many requirements blocked by ambiguity or parse issues | 30–54 |
| No safe modifications could be made | 0–29 |
## Configuration
```yaml
accessibility:
  standard: "WCAG22-AA"
  additional: ["EN-301-549"]
  agents:
    a11y-impl:
      auto_fix: true
      patterns: "angular"
```
Configuration rules:
1. `accessibility.standard` defines the compliance baseline for patterns and validation.
2. `accessibility.additional` adds reference standards that may influence messaging.
3. `accessibility.agents.a11y-impl.auto_fix` decides whether safe changes are written automatically or emitted as recommendations only.
4. `accessibility.agents.a11y-impl.patterns` selects framework-specific transforms; the default documented pattern is `angular`.
5. Explicit input may narrow scope or override config for a single execution.
## Design Decisions
1. **Read review outputs, not raw design files** — `a11y-review` already normalizes design and mapping findings into JSON that implementation can act on directly.
2. **Prefer native semantics first** — the agent adds ARIA only when native HTML or framework bindings do not already solve the requirement.
3. **Protect business logic** — accessibility improvements should not silently alter validation rules, network calls, or state transitions.
4. **Use manifests for traceability** — later audit and test agents need to know exactly what was changed and what remains unresolved.
5. **Quick validation is a smoke check, not a full audit** — full compliance is confirmed later by `a11y-audit`; implementation only verifies it did not introduce obvious issues.
6. **Treat ambiguity as a blocker** — inaccessible guesses are worse than flagged unknowns, especially for accessible names and focus behavior.
7. **Optimize for smallest safe diff** — localized attribute and template updates are easier to review than large refactors.
