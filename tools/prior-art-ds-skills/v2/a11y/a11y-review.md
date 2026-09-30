---
name: a11y-review
type: sub-agent
prefix: a11y
version: 1.0.0
description: Reviews designs and SLDS mappings for accessibility risks before code generation
called_by:
  - sl-ds-impl
  - sl-ds-figma
  - sl-ds-mapper
invokes: []
token_budget: "2–4K per step"
---
# a11y-review
`a11y-review` is the earliest accessibility checkpoint in the pipeline. It runs twice: once after Figma interpretation to catch design risks, and again after SLDS mapping to turn those risks into implementation requirements. By auditing before code exists, it prevents expensive downstream rework.
## Purpose
Accessibility is not something to bolt on after generation. This agent exists to review accessibility at the design-intent stage and at the component-choice stage, where many problems are cheaper to detect and describe. Its outputs feed directly into `a11y-impl` and `a11y-test`, making early findings actionable instead of advisory only.
1. **Catch design issues early** — contrast, touch target, focus visibility, and readability are identified before code is written.
2. **Validate component choices** — mapped SLDS components are checked for semantic and ARIA implications before implementation.
3. **Produce structured outputs** — JSON artifacts become inputs for implementation and testing.
## Input
```json
{
  "step": 1,
  "sourcePath": ".sl-ds-cache/figma-interpretation.json",
  "standard": "WCAG22-AA",
  "strictTouchTarget": 44
}
```
```json
{
  "step": 2,
  "sourcePath": ".sl-ds-cache/component-mapping.json",
  "standard": "WCAG22-AA"
}
```
| Field | Required | Description |
|-------|----------|-------------|
| `step` | Yes | `1` for design audit, `2` for component-choice audit |
| `sourcePath` | Yes | Structured output from the upstream stage being reviewed |
| `standard` | No | Effective standard; defaults to `WCAG22-AA` |
| `strictTouchTarget` | No | Override for touch targets; default 44px, optionally 48px in stricter policy |
| `scope` | No | Optional subset of frames, flows, or mapped components to review |
| `additionalStandards` | No | Supplemental standards from policy for reporting only |
## Output
Step 1 output example:
```json
{
  "step": 1,
  "notes": [
    { "type": "contrast", "element": "subtitle text", "ratio": 3.2, "required": 4.5 },
    { "type": "touch-target", "element": "close icon", "size": 32, "required": 44 }
  ],
  "confidence": 90
}
```
Step 2 output example:
```json
{
  "step": 2,
  "outputFile": ".sl-ds-cache/a11y-requirements.json",
  "requirements": [
    {
      "component": "sl-dialog",
      "needs": ["focus trap", "aria-labelledby", "focus restoration"],
      "verified": false
    }
  ],
  "confidence": 88
}
```
| Field | Description |
|-------|-------------|
| `step` | Which review stage executed |
| `notes` | Step 1 design findings written to `a11y-notes.json` |
| `requirements` | Step 2 implementation requirements written to `a11y-requirements.json` |
| `outputFile` | Path to the file written for the executed step |
| `summary` | Count of findings or requirements by severity or verification state |
| `confidence` | Confidence score from 0–100 |
## Behavior
### Step 1: Design Audit
This step runs after Figma interpretation and before component mapping.
```
1. Read interpreted design data from `sourcePath`.
2. Resolve the effective standard and touch target threshold.
3. For each frame, screen, or component group:
   a. extract text nodes
   b. extract interactive elements
   c. extract headings and layout structure
4. Evaluate low contrast text against the effective standard.
5. Flag touch targets below 44px, or 48px when stricter policy applies.
6. Identify missing or insufficient focus indicators.
7. Check heading hierarchy for skipped or repeated levels.
8. Check text sizing and line length for readability.
9. Write findings to `.sl-ds-cache/a11y-notes.json`.
```
Step 1 checks include:
- Low contrast text
- Touch targets below 44px, or 48px under stricter config
- Missing focus indicators
- Heading hierarchy problems
- Text sizing and readability concerns
### Step 1 Evaluation Details
The design audit is deterministic and data-driven.
```
1. Contrast:
   a. calculate foreground/background ratio
   b. compare against AA or AAA thresholds
   c. flag unknown backgrounds for manual review
2. Touch targets:
   a. inspect width and height
   b. compare against configured minimum
   c. flag icon-only buttons separately
3. Focus indicators:
   a. look for a defined focus style token or annotated state
   b. flag elements with hover-only styling
4. Headings:
   a. sort by visual order
   b. check for h1 → h2 → h3 progression
   c. flag purely decorative heading usage
5. Readability:
   a. check font size bands
   b. note dense line length or cramped spacing
```
### Step 2: Component Choice Audit
This step runs after SLDS mapping and before code generation.
```
1. Read mapped component data from `sourcePath`.
2. For each mapped node:
   a. identify the chosen SLDS component
   b. identify its intended behavior in the flow
3. Validate component choice against accessibility implications.
4. Write required ARIA or focus behaviors to `.sl-ds-cache/a11y-requirements.json`.
5. Attach output to the mapped tree metadata when supported by the caller.
```
Step 2 checks include:
- Whether `sl-tab` needs `aria-label` on `tab-panel`
- Whether `sl-dialog` needs focus trap and focus restoration
- Whether `sl-form-field` has an associated label
- What ARIA attributes or keyboard patterns each mapped component needs
### Step 2 Evaluation Details
The mapping audit transforms component choices into implementation requirements.
```
1. For each mapped component, verify semantic fit:
   a. action vs navigation
   b. input vs display
   c. modal vs inline disclosure
2. For each complex component, determine required ARIA:
   a. dialog naming
   b. tab and panel associations
   c. expanded and controls states
   d. error relationships for forms
3. For each flow, verify keyboard expectations:
   a. tab order
   b. arrow key patterns
   c. focus entry and exit
4. For each form control, verify a label strategy exists.
5. For each mapped requirement, mark:
   a. already satisfied by chosen component
   b. must be added in `a11y-impl`
   c. requires manual developer decision
```
### Output Rules
The two steps produce different artifacts but share one contract.
```
1. If `step = 1`:
   a. write `.sl-ds-cache/a11y-notes.json`
   b. classify findings by severity
   c. include recommended next actions for design or mapping
2. If `step = 2`:
   a. write `.sl-ds-cache/a11y-requirements.json`
   b. attach requirement ids per component
   c. include implementation hints for `a11y-impl`
3. In both steps:
   a. return summary counts
   b. return confidence
   c. preserve unresolved ambiguity explicitly
```
### Severity and Requirement Policy
The review stage must be strict enough to be useful, but precise enough to avoid noise.
| Step | Output type | Examples |
|------|-------------|----------|
| 1 | Design notes | contrast, touch target, focus indicator, heading hierarchy |
| 2 | Implementation requirements | labels, focus trap, `aria-*` attributes, keyboard handlers |
```
1. Step 1 severity is based on user impact:
   critical > serious > moderate > minor
2. Step 2 verification is based on delivery readiness:
   verified > required > blocked
3. If a condition is ambiguous:
   a. never invent certainty
   b. record the missing data
   c. reduce confidence
```
## Failure Modes
| Failure | Detection | Recovery |
|---------|-----------|----------|
| Cannot determine contrast | Background color or image context is unknown | Record manual review note, reduce confidence, continue |
| Design too ambiguous for analysis | Element purpose or state is not clear in interpreted data | Record ambiguity, avoid false requirement, continue |
| Missing size data | Touch target dimensions absent from source data | Skip size verdict for that element and note coverage gap |
| Missing mapping metadata | SLDS component choice or role not present | Record blocked requirement and request upstream fix |
| Unsupported component pattern | Mapped component has no known accessibility profile | Emit manual requirement instead of unsafe guidance |
| Invalid standard | Config requests unsupported standard | Fall back to `WCAG22-AA`, note the fallback in output |
## Confidence Scoring
| Condition | Confidence |
|-----------|------------|
| Step completed with complete source data and low ambiguity | 90–100 |
| Step completed with minor missing data | 75–89 |
| Step completed but several findings are manual-review only | 55–74 |
| Source data is incomplete or mapping is ambiguous | 30–54 |
| No meaningful review could be performed | 0–29 |
## Configuration
`a11y-review` reads the shared accessibility policy from `.sl-ds-config.yaml`.
```yaml
accessibility:
  standard: "WCAG22-AA"
  additional: ["EN-301-549"]
```
Configuration rules:
1. `accessibility.standard` sets the baseline criteria for contrast and overall reporting.
2. `accessibility.additional` adds reference standards that may be echoed in notes.
3. If a project wants stricter design review thresholds, it can extend the shared model with an optional `accessibility.agents.a11y-review` block, for example: `min_touch_target: 48`.
4. Explicit input overrides config for a single review run.
## Design Decisions
1. **Review twice, not once** — design intent and component mapping reveal different kinds of accessibility risk, so a single pass would miss important issues.
2. **Separate notes from requirements** — design findings belong to designers and mappers, while implementation requirements belong to developers.
3. **Prefer structured JSON artifacts** — downstream agents need machine-readable outputs, not only prose recommendations.
4. **Flag ambiguity instead of guessing** — bad assumptions at Step 1 or 2 propagate into broken code later.
5. **Keep Step 1 visual and Step 2 semantic** — this division mirrors the actual decisions made at each stage of the pipeline.
6. **Support stricter touch targets by policy** — 44px is the baseline, but some teams need 48px or other guardrails without rewriting the agent.
7. **Emit implementation hints early** — by attaching ARIA and focus expectations before code, `a11y-impl` can work deterministically instead of rediscovering intent.
