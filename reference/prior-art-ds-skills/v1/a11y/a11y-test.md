---
name: a11y-test
type: entry-point
prefix: a11y
version: 1.0.0
description: Generates automated, guided, and manual accessibility test assets for CI and QA
called_by:
  - ds-impl
  - developer
invokes: []
token_budget: "5–15K"
---
# a11y-test
`a11y-test` turns accessibility requirements into executable test assets. It generates automated checks for CI, guided scripts for developers, and a manual plan for QA so accessibility remains verifiable after code generation. The agent closes the loop between intended behavior, implemented behavior, and release gates.
## Purpose
This agent exists because not every accessibility requirement is proven by the same kind of test. Some issues belong in CI, some need guided human verification, and some require formal manual scenarios across assistive technologies and zoom levels. `a11y-test` packages all three layers from a single source of truth so testing stays aligned with earlier review and implementation outputs.
1. **Generate CI-ready coverage** — produce repeatable automated tests for common regressions.
2. **Guide human validation** — emit structured walkthroughs for journeys and announcements.
3. **Support QA execution** — create a manual plan that matches the configured device matrix.
## Input
```json
{
  "targets": ["/login", "/register"],
  "requirementsPath": ".ds-cache/a11y-requirements.json",
  "changesPath": ".ds-cache/a11y-changes.json",
  "includeManual": true,
  "deviceMatrix": ["VoiceOver+Safari", "NVDA+Chrome", "TalkBack+Android"],
  "outputDir": ".ds-cache/a11y-tests"
}
```
| Field | Required | Description |
|-------|----------|-------------|
| `targets` | Yes | Routes, pages, or components that need test coverage |
| `requirementsPath` | No | Step 2 output used to infer expected semantics and flows |
| `changesPath` | No | Implementation manifest used to target added accessibility behaviors |
| `includeManual` | No | Whether to emit the manual QA plan |
| `deviceMatrix` | No | Assistive technology combinations to include in manual scenarios |
| `outputDir` | No | Base directory for generated artifacts |
| `standard` | No | Effective standard; defaults to `WCAG22-AA` |
## Output
```json
{
  "automatedFiles": [
    ".ds-cache/a11y-tests/login.axe.spec.ts",
    ".ds-cache/a11y-tests/register.keyboard.spec.ts"
  ],
  "semiAutomatedFiles": [
    ".ds-cache/a11y-tests/keyboard-journeys.md",
    ".ds-cache/a11y-tests/screen-reader-scripts.md"
  ],
  "manualPlanPath": ".ds-cache/manual-a11y-test-plan.md",
  "confidence": 89
}
```
| Field | Description |
|-------|-------------|
| `automatedFiles` | Generated CI-ready test files |
| `semiAutomatedFiles` | Guided scripts or checklists for developer-assisted validation |
| `manualPlanPath` | Markdown plan for QA execution |
| `coverage` | Summary of targets and WCAG criteria covered by generated assets |
| `confidence` | Confidence score from 0–100 |
## Behavior
### Input Resolution
The agent first resolves what needs to be tested and what evidence already exists.
```
1. Read `.ds-config.yaml`.
2. Resolve `accessibility.standard`.
3. Resolve `accessibility.agents.a11y-test.include_manual`.
4. Resolve `accessibility.agents.a11y-test.device_matrix`.
5. Merge explicit input overrides.
6. Read `a11y-requirements.json` if present.
7. Read `a11y-changes.json` if present.
8. Normalize targets into unique route or component ids.
```
### Coverage Model
A single target can produce multiple test artifacts.
```
1. Build a coverage row per target.
2. For each row, infer required checks from:
   a. mapped component type
   b. implemented change categories
   c. known user flows
3. Map requirements to three buckets:
   automated
   semi-automated
   manual
4. Avoid generating duplicate cases for repeated components on different pages.
```
### Automated Tests
The first output category is CI-ready and optimized for repeatability.
```
1. Generate axe-core Playwright tests per page or component.
2. Generate color contrast assertions for key text and state combinations.
3. Generate ARIA validity checks for names, roles, and values.
4. Generate keyboard Tab-order verification:
   a. first focus target
   b. logical tab progression
   c. skip-link reachability
5. Generate focus trap and focus restore verification for dialogs, drawers, and menus.
6. Add clear arrange/act/assert structure so files can be executed in CI.
7. Name files predictably by target and concern.
```
Automated coverage includes:
- axe-core Playwright tests per page/component
- Color contrast assertions
- ARIA validity checks
- Keyboard Tab-order verification
- Focus trap/restore verification
### Semi-Automated Tests
Some checks require a human to observe meaning, timing, or announcement quality.
```
1. Generate keyboard journey walkthrough scripts.
2. Generate screen reader announcement scripts with verification points.
3. Generate 200% and 400% zoom check procedures.
4. For each script, include:
   a. starting state
   b. exact key sequence
   c. expected focus target
   d. expected visible result
   e. expected spoken output when applicable
5. Mark each step as `verify`, `observe`, or `capture`.
```
Semi-automated coverage includes:
- Keyboard journey walkthrough scripts
- Screen reader announcement scripts
- 200% + 400% zoom check procedures
### Manual Test Plan
The final output is a Markdown plan for QA and release review.
```
1. Create `manual-a11y-test-plan.md`.
2. For each target, add:
   a. scenario statement in user language
   b. prerequisites
   c. step-by-step actions
   d. expected announcements
   e. failure indicators
3. Add edge cases:
   timeout
   error
   back navigation
4. Add device matrix from config or input.
5. Group scenarios by task, not by DOM rule, so QA can execute end-to-end journeys.
```
Manual plan coverage includes:
- Screen reader scenarios in the form "As a SR user, I want to..."
- Expected announcements at each step
- Edge cases such as timeout, error, and back navigation
- Configured device matrix
### File Emission
The agent writes deterministic file sets so other tools can consume them.
```
1. Ensure output directory exists.
2. Write automated specs into the output directory.
3. Write semi-automated guides into the output directory.
4. Write `manual-a11y-test-plan.md` at the configured path.
5. Emit a small index object summarizing produced files.
6. Return the output JSON to the caller.
```
### Quality Rules
Generated tests should verify intent, not reproduce implementation noise.
```
1. Prefer role- and name-based selectors over brittle CSS selectors.
2. Assert announcements and focus outcomes, not internal variable names.
3. Reuse shared flows when multiple targets share the same widget pattern.
4. Mark truly manual assertions clearly instead of pretending they are automated.
5. Keep each test mapped to a WCAG criterion or accessibility concern.
```
## Failure Modes
| Failure | Detection | Recovery |
|---------|-----------|----------|
| Missing requirements input | `a11y-requirements.json` absent or incomplete | Generate baseline tests from target structure, mark coverage inferred |
| Unknown component pattern | Target uses unsupported custom widget | Emit manual scenario and TODO note instead of unsafe automated test |
| Incomplete device matrix | Config omits required assistive technology combinations | Fall back to default matrix from policy and annotate output |
| Unclear screen reader announcement | No deterministic wording available from UI copy | Generate manual verification point without hardcoded announcement text |
| Duplicate target definitions | Same route or component requested multiple times | De-duplicate targets and merge coverage rows |
| No routable target | Input target cannot be resolved to page or component scope | Skip target, lower confidence, record gap in coverage summary |
## Confidence Scoring
| Condition | Confidence |
|-----------|------------|
| Automated, semi-automated, and manual assets generated for all targets | 90–100 |
| Automated and manual assets generated, with minor inferred coverage | 75–89 |
| Automated assets generated but human-guided coverage is partial | 60–74 |
| Mostly manual guidance due to unsupported patterns | 40–59 |
| Target scope could not be resolved | 0–39 |
## Configuration
From `.ds-config.yaml`:
```yaml
accessibility:
  standard: "WCAG22-AA"
  additional: ["EN-301-549"]
  agents:
    a11y-test:
      include_manual: true
      device_matrix:
        - "VoiceOver+Safari"
        - "NVDA+Chrome"
        - "TalkBack+Android"
```
Configuration rules:
1. `accessibility.standard` informs which criteria should be covered in generated tests.
2. `accessibility.additional` can add extra manual compliance notes.
3. `accessibility.agents.a11y-test.include_manual` decides whether the QA plan is required.
4. `accessibility.agents.a11y-test.device_matrix` defines the assistive technology matrix used in the manual plan.
5. Input can override these values for a single run.
## Design Decisions
1. **Generate three layers, not one** — automated, guided, and manual checks cover different classes of accessibility risk.
2. **Base tests on requirements and changes** — using both planned requirements and actual implementation changes keeps coverage aligned with the delivered UI.
3. **Prefer resilient selectors** — role and accessible name selectors survive refactors better than DOM-order or CSS-based selectors.
4. **Model tasks from a user perspective** — QA plans should read like journeys, not like axe rule names.
5. **Keep zoom and screen reader checks separate from CI** — these need human observation and should be explicit instead of flaky automation.
6. **Use device matrix as policy input** — organizations vary in the assistive technologies they certify, so the test plan must reflect configuration.
7. **Emit deterministic filenames** — stable output paths make CI and downstream orchestration easier to wire.
