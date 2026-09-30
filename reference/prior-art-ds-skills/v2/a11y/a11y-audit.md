---
name: a11y-audit
type: entry-point
prefix: a11y
version: 1.0.0
description: Automated accessibility audit orchestrator for generated pages, routes, and journeys
called_by:
  - developer
  - sl-ds-impl
invokes:
  - Playwright
  - @axe-core/playwright
  - Lighthouse
  - a11y-navigator
token_budget: "5–10K (automated), 10–20K (with navigator)"
---
# a11y-audit
`a11y-audit` is the quality-gate agent for the accessibility pipeline. It verifies that generated or existing UI meets the configured accessibility standard before integration or release. When journey analysis is enabled, it combines static rule checks with navigation analysis so pass/fail decisions reflect both code-level and task-level accessibility.
## Purpose
Accessibility cannot be deferred to a final checklist. This agent exists to turn accessibility into an enforceable gate at Step 5 and Step 7 of the generation pipeline. It provides one repeatable audit flow that can run against a local dev server, generated static output, or explicit URLs, then emits a human-readable report and machine-readable summary for downstream agents and CI.
1. **Single audit entry point** — one agent runs the full automated accessibility gate.
2. **Config-driven compliance** — standards and failure thresholds come from `.sl-ds-config.yaml`.
3. **Actionable output** — findings are normalized into reportable severity and remediation guidance.
## Input
```json
{
  "target": {
    "mode": "url",
    "urls": ["http://localhost:6006/?path=/story/button--default"]
  },
  "standard": "WCAG22-AA",
  "failOn": "critical",
  "withNavigator": true,
  "reportPath": ".sl-ds-cache/a11y-report.md"
}
```
| Field | Required | Description |
|-------|----------|-------------|
| `target.mode` | Yes | `url` \| `static-dir` \| `generated-files` |
| `target.urls` | For `url` mode | Absolute URLs to audit in Playwright |
| `target.path` | For file modes | Directory or file entry point to serve and inspect |
| `standard` | No | Accessibility standard to enforce; defaults to `WCAG22-AA` |
| `failOn` | No | Failure threshold override; defaults from `.sl-ds-config.yaml` |
| `withNavigator` | No | Whether to invoke `a11y-navigator` for keyboard journey analysis |
| `routes` | No | Explicit route list when a single target expands into multiple pages |
| `reportPath` | No | Markdown report output path; defaults to `.sl-ds-cache/a11y-report.md` |
## Output
```json
{
  "reportPath": ".sl-ds-cache/a11y-report.md",
  "standard": "WCAG22-AA",
  "summary": { "critical": 0, "serious": 1, "moderate": 3, "minor": 5 },
  "passed": false,
  "confidence": 85
}
```
| Field | Description |
|-------|-------------|
| `reportPath` | Markdown audit report written to disk |
| `standard` | Effective accessibility standard used for the audit |
| `summary` | Count of findings by normalized severity |
| `passed` | `true` when no findings exceed the `failOn` threshold |
| `navigator` | Optional `a11y-navigator` summary when journey analysis is enabled |
| `targetsTested` | Number of audited URLs or routes |
| `coverage` | Audit coverage notes, including skipped or partially audited targets |
| `confidence` | Confidence score from 0–100 |
## Behavior
### Preflight
Before opening a browser, the agent resolves configuration and target scope.
```
1. Read `.sl-ds-config.yaml`.
2. Resolve `accessibility.standard`.
   → If absent, use `WCAG22-AA`.
3. Resolve `accessibility.additional` as informational standards.
4. Resolve `accessibility.agents.a11y-audit.fail_on`.
   → If absent, use `critical`.
5. Resolve `accessibility.agents.a11y-audit.report_format`.
   → If absent, use `markdown`.
6. Merge explicit input overrides on top of config values.
7. Expand `target` into a final URL list.
```
### Target Resolution
The agent supports direct URLs and generated output.
```
1. If `target.mode = "url"`:
   a. Validate each URL syntax.
   b. De-duplicate URLs.
2. If `target.mode = "static-dir"` or `generated-files`:
   a. Start or reuse a local file server.
   b. Compute browseable route URLs.
   c. Verify each URL returns HTTP 200.
3. If `routes` are provided:
   a. Append route paths to the resolved origin.
4. If no reachable targets remain:
   a. abort with `passed = false`
   b. emit `Target unreachable`
```
### Browser Audit Flow
Each target is audited independently, then combined into one report.
```
1. Launch Playwright Chromium in headless mode.
2. Create a clean browser context per target.
3. Navigate to the URL and wait for:
   a. network idle, or
   b. a configurable app-ready selector, or
   c. a max timeout
4. Record page title, URL, viewport, and load status.
5. Inject `@axe-core/playwright`.
6. Run axe with ruleset mapped to the effective standard.
7. Run Lighthouse accessibility category on the same target.
8. Capture raw findings, source nodes, selectors, and rule identifiers.
9. Close the page context and continue with the next target.
```
### Severity Normalization
Axe and Lighthouse use different issue vocabularies. `a11y-audit` maps them into one severity scale for policy enforcement.
| Raw source | Raw level | Normalized severity |
|------------|-----------|---------------------|
| axe | `critical` | `critical` |
| axe | `serious` | `serious` |
| axe | `moderate` | `moderate` |
| axe | `minor` | `minor` |
| Lighthouse | score-impacting issue with complete block | `serious` |
| Lighthouse | warning with likely user friction | `moderate` |
| Lighthouse | best-practice recommendation | `minor` |
### Finding Consolidation
Duplicate findings must not inflate the final verdict.
```
1. Group findings by:
   a. target URL
   b. rule id
   c. normalized selector
2. Collapse duplicates from repeated nodes under the same component root.
3. Keep the highest severity if multiple tools report the same defect.
4. Attach:
   a. human summary
   b. affected nodes
   c. remediation guidance
   d. WCAG references
5. Count findings into:
   critical > serious > moderate > minor
```
### Threshold Evaluation
The pass/fail decision is deterministic.
```
1. Translate `failOn` into a severity floor:
   critical = only critical fails
   serious  = serious or critical fail
   moderate = moderate or above fail
   minor    = any finding fails
2. Compare summary counts against the floor.
3. Set `passed = true` only when all counts above the floor are zero.
4. If coverage is partial:
   a. keep pass/fail result based on executed checks
   b. lower confidence
   c. annotate report as partial coverage
```
### Optional Journey Analysis
When `withNavigator = true`, the agent augments rule-based findings with flow analysis.
```
1. Build navigator input from resolved routes and primary tasks.
2. Invoke `a11y-navigator`.
3. Merge navigator issues into a separate "Journey analysis" section.
4. Promote navigator issues into severity buckets when they indicate:
   a. broken focus restoration
   b. unreachable task completion
   c. illogical reading order
5. Recompute summary and `passed` after merged findings.
```
### Report Generation
The report is written as Markdown so humans can act on it immediately.
```
1. Ensure `.sl-ds-cache/` exists.
2. Write `.sl-ds-cache/a11y-report.md`.
3. Report sections:
   a. audit scope
   b. effective standards
   c. summary counts
   d. pass/fail verdict
   e. per-target findings
   f. journey analysis, if present
   g. recommended fixes sorted by severity
4. Include a machine-readable summary block at the end.
5. Return the output JSON to the caller.
```
### Output Contract
`a11y-audit` always returns a result object, even on partial failure.
```
1. If at least one target was audited:
   a. write report
   b. include skipped targets in coverage
2. If no targets were audited:
   a. write failure report if possible
   b. return `passed = false`
   c. set confidence to 0–25
```
## Failure Modes
| Failure | Detection | Recovery |
|---------|-----------|----------|
| Target unreachable | HTTP error, DNS failure, or app never becomes ready | Retry once, skip unreachable target, mark coverage partial, fail if no targets remain |
| Browser init failure | Playwright launch throws or browser binary missing | Abort automated audit, return failure, instruct caller to install browser dependencies |
| axe timeout | axe scan exceeds configured timeout | Retry once on a fresh page, then mark target partial and continue |
| Lighthouse failure | Lighthouse run errors or cannot attach to page | Continue with axe results only, lower confidence, note missing Lighthouse coverage |
| Partial coverage | Some routes skipped or crashed mid-run | Keep audited results, annotate report, reduce confidence |
| Invalid standard | Config requests unsupported standard | Fallback to `WCAG22-AA`, record warning in report |
| Navigator failure | `a11y-navigator` errors or times out | Continue automated audit without journey analysis, mark navigator section unavailable |
## Confidence Scoring
| Condition | Confidence |
|-----------|------------|
| axe + Lighthouse succeeded for all targets and navigator succeeded | 90–100 |
| axe + Lighthouse succeeded for all targets without navigator | 85–95 |
| Some targets audited, but coverage is partial | 55–80 |
| Only one engine succeeded (`axe` or Lighthouse) | 45–70 |
| No targets completed | 0–25 |
## Configuration
From `.sl-ds-config.yaml`:
```yaml
accessibility:
  standard: "WCAG22-AA"
  additional: ["EN-301-549"]
  agents:
    a11y-audit:
      fail_on: "critical"
      report_format: "markdown"
```
Configuration rules:
1. `accessibility.standard` sets the primary ruleset and reporting label.
2. `accessibility.additional` adds informational references to the report.
3. `accessibility.agents.a11y-audit.fail_on` controls the pass/fail floor.
4. `accessibility.agents.a11y-audit.report_format` currently supports `markdown`; future formats can be derived from the same result object.
5. Direct input overrides config for a single run without mutating repository defaults.
## Design Decisions
1. **Run two engines, not one** — axe is strong at rule detection, while Lighthouse adds page-level accessibility signals and scoring context.
2. **Normalize severity centrally** — callers should consume one severity model instead of tool-specific vocabularies.
3. **Treat journey analysis as optional but first-class** — many failures appear only in keyboard flow, so navigator data can change the verdict when enabled.
4. **Always write a report** — even failed or partial runs should leave an artifact that explains what happened.
5. **Use config as policy, not hardcoded rules** — standards and failure floors vary by project, so enforcement must be driven by `.sl-ds-config.yaml`.
6. **De-duplicate by rule and selector** — repeated DOM nodes should not hide the true shape of the problem.
7. **Lower confidence for missing coverage** — a green result with skipped routes should not look as trustworthy as a fully executed audit.
