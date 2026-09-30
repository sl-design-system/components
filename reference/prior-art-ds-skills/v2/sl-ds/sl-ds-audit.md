---
name: sl-ds-audit
type: entry-point
prefix: sl-ds
version: 1.0.0
description: Audits existing code against the latest Figma design for SLDS compliance without making changes
called_by:
  - developer
invokes:
  - sl-ds-figma
  - sl-ds-mapper
  - sl-ds-api
token_budget: "15–30K"
---

# sl-ds-audit

`sl-ds-audit` checks whether existing implementation code still matches the current Figma design and SLDS expectations. It reads the latest design without cache, derives what the code should look like, inspects what the code actually looks like, and emits a compliance report without mutating the project. It is strictly diagnostic.

## Purpose

`sl-ds-audit` is the user-facing compliance checker for design drift. Its job is to compare design intent and implementation reality, classify violations, score compliance, and produce a report that engineers can act on later.

The agent must never make code changes. Its only deliverable is analysis.

## Input

```json
{
  "figmaUrl": "https://www.figma.com/file/...",
  "projectRoot": "/path/to/project",
  "screenIds": ["login"],
  "version": "2.0.1",
  "reportPath": ".sl-ds-cache/compliance-report.md"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `figmaUrl` | Yes | Figma file or frame URL to audit against |
| `projectRoot` | Yes | Project root containing the code to inspect |
| `screenIds` | No | Limit the audit to specific screens or flows |
| `version` | No | Explicit SLDS version override for API validation |
| `reportPath` | No | Output location for the generated compliance report; default `.sl-ds-cache/compliance-report.md` |

## Output

```json
{
  "reportPath": ".sl-ds-cache/compliance-report.md",
  "summary": {
    "total_components": 15,
    "compliant": 12,
    "violations": 3,
    "score": 80
  },
  "violations": [
    {
      "component": "LoginFormComponent",
      "type": "wrong-variant",
      "expected": "sl-button[variant='primary']",
      "actual": "sl-button[variant='default']",
      "file": "src/app/login/login-form.component.html",
      "line": 23
    }
  ]
}
```

| Field | Description |
|-------|-------------|
| `reportPath` | Markdown report written by the audit |
| `summary.total_components` | Number of audited component instances or mapped nodes |
| `summary.compliant` | Count of instances with no detected violation |
| `summary.violations` | Count of detected violations |
| `summary.score` | 0–100 compliance score |
| `violations` | Detailed list of drift items with expected vs actual data and file location |

## Behavior

### 1. Read current Figma with no cache

```
1. Call `sl-ds-figma` using fresh retrieval only.
2. Ignore any cached design payloads.
3. Extract the latest frames, copy, layout, tokens, states, and interactions.
4. Normalize the design into an auditable screen model.
```

Fresh design retrieval is mandatory. `sl-ds-audit` must always use the latest available design state.

### 2. Map expected implementation

```
1. Call `sl-ds-mapper` on the fresh design model.
2. Call `sl-ds-api` for each mapped SLDS component.
3. Build `slds-tree.json` representing what the code should look like.
4. Record expected:
   - components
   - variants and props
   - slots
   - layout structure
   - tokens and theme usage
   - a11y expectations
```

This expected tree is the normative reference for all later comparison work.

### 3. Inspect existing code

```
1. Scan templates, component classes, styles, and story/test artifacts when relevant.
2. Build an actual implementation tree for the audited scope.
3. Capture file paths and line numbers for every observed mismatch candidate.
4. Do not modify any file.
```

Inspection should cover both structure and semantics, including layout wrappers, hardcoded tokens, and missing state behavior.

### 4. Compare expected vs actual

`sl-ds-audit` must compare the expected tree and actual tree across these categories:

1. Missing components — in design but absent in code.
2. Wrong variants or props — wrong component configuration.
3. Hardcoded values or token violations — colors, spacing, typography, radii, or sizes bypassing SLDS tokens.
4. Layout mismatches structure nesting, grouping, order, or semantic container drift. 
5. Accessibility regressions — labeling, keyboard behavior assumptions, semantics, or state announcements.

Each violation must include:

- a stable type identifier
- expected value
- actual value
- file path
- line number when available
- severity

### 5. Scoring model

```
1. Start from 100.
2. Apply weighted deductions per violation type.
3. Weight accessibility and missing-component violations highest.
4. Weight cosmetic drift lower than structural or semantic drift.
5. Clamp final score to 0–100.
```

Recommended severity weighting:

| Violation type | Weight |
|----------------|--------|
| A11y regression | −15 each |
| Missing component | −12 each |
| Wrong variant / prop | −8 each |
| Layout mismatch | −8 each |
| Token violation | −5 each |

### 6. Report generation

`sl-ds-audit` must write `compliance-report.md` and return the JSON summary. The markdown report should include:

1. Audit scope.
2. Resolved design and SLDS version context.
3. Summary score.
4. Violations grouped by severity and file.
5. A short “what to fix first” section.

The report is descriptive only. It must not contain code patches or auto-fix output.

### 7. Non-mutating guarantee

```
1. Do not edit source files.
2. Do not run code generators.
3. Do not open repair loops.
4. Emit findings only.
```

If a caller asks for remediation, `sl-ds-audit` should finish the audit and recommend handing the violations to `sl-ds-impl` or another implementation agent.

## Failure Modes

| Failure | Detection | Recovery |
|---------|-----------|----------|
| Fresh Figma read fails | `sl-ds-figma` cannot fetch latest design | Abort and report that the audit cannot proceed without current design data. |
| Expected mapping incomplete | `sl-ds-mapper` leaves unresolved design nodes | Continue with partial audit, mark uncovered regions, and lower confidence. |
| Project code cannot be inspected | Project root missing or unreadable | Abort with inspection error and no score. |
| File/line attribution unavailable | Parser can classify drift but not exact source line | Report file-level violation with `line: null`. |
| SLDS API lookup fails for one or more components | `sl-ds-api` cannot provide canonical component metadata | Continue comparison with structural drift only and warn that API validation is partial. |

## Confidence Scoring

| Condition | Confidence |
|-----------|------------|
| Fresh design parsed, expected mapping complete, code inspected cleanly | 90–100 |
| Minor mapping gaps or partial API metadata | 75–89 |
| Structural comparison possible but some files or lines unresolved | 55–74 |
| Major uncovered design regions or incomplete project inspection | 25–54 |
| Fresh design unavailable or project unreadable | 0–24 |

## Design Decisions

1. **Fresh design only.** Audit work is about drift against current reality, so cached design data is not acceptable.
2. **Expected-vs-actual trees.** Structural comparison is more reliable than line-by-line heuristics for component-based UIs.
3. **No code changes.** Keeping the agent read-only preserves trust in the report and separates diagnosis from remediation.
4. **Weighted scoring.** Not all violations matter equally; accessibility and missing UI are more severe than cosmetic token drift.
5. **File and line attribution.** Developers need violations that are easy to action, not just abstract mismatch summaries.
