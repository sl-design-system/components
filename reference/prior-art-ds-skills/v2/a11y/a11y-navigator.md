---
name: a11y-navigator
type: sub-agent
prefix: a11y
version: 1.0.0
description: Evaluates keyboard journeys, reading order, and cognitive accessibility across routes
called_by:
  - a11y-audit
  - sl-ds-impl
invokes:
  - Playwright
token_budget: "4–8K"
---
# a11y-navigator
`a11y-navigator` evaluates how a keyboard and screen-reader user actually moves through the interface. It focuses on reading order, journey efficiency, focus continuity, and cognitive load rather than low-level rule violations alone. Its output helps `a11y-audit` decide whether the UI is usable, not just technically compliant.
## Purpose
Accessibility rules can pass while actual navigation still feels confusing or exhausting. This agent exists to test the cognitive experience of moving through pages, dialogs, and tasks with sequential focus and landmark-based navigation. It surfaces issues that are often invisible to static audits, such as inefficient tab flows, poor disclosure timing, and broken context restoration.
1. **Measure usability through focus movement** — count and score actual keyboard journeys.
2. **Verify cognitive clarity** — ensure order, landmarks, and state changes make sense.
3. **Support the audit gate** — contribute journey findings to final pass/fail evaluation.
## Input
```json
{
  "origin": "http://localhost:4173",
  "routes": ["/login", "/register", "/forgot-password"],
  "journeys": [
    { "route": "/login", "goal": "sign in" },
    { "route": "/register", "goal": "create account" }
  ],
  "maxTabOverOptimal": 2,
  "standard": "WCAG22-AA"
}
```
| Field | Required | Description |
|-------|----------|-------------|
| `origin` | Yes | Base URL to open in Playwright |
| `routes` | Yes | Routes or pages to analyze |
| `journeys` | No | Named tasks to simulate per route |
| `maxTabOverOptimal` | No | Allowed difference between observed and optimal tab counts |
| `standard` | No | Effective accessibility standard; defaults to `WCAG22-AA` |
| `landmarkExpectations` | No | Optional required landmarks per route |
| `selectors` | No | Optional route-specific selectors for journey steps |
## Output
```json
{
  "routes_tested": 3,
  "journey_scores": [
    { "route": "/login", "tab_count": 5, "optimal": 4, "score": 95 },
    { "route": "/register", "tab_count": 8, "optimal": 6, "score": 80 }
  ],
  "issues": [...],
  "confidence": 88
}
```
| Field | Description |
|-------|-------------|
| `routes_tested` | Number of routes successfully analyzed |
| `journey_scores` | Per-route navigation efficiency and quality scores |
| `issues` | Structured findings for order, focus, landmarks, disclosure, and recovery |
| `coverage` | Notes about skipped routes or partially executed journeys |
| `confidence` | Confidence score from 0–100 |
## Behavior
### Analysis Dimensions
The agent evaluates seven cognitive dimensions on each route.
1. **Reading order** — DOM order should match the expected visual and semantic order.
2. **Navigation journey** — task completion should require only necessary focus stops.
3. **Context preservation** — focus should return logically after dialog or action completion.
4. **Progressive disclosure** — complex content should appear in logical stages.
5. **Error recovery** — failures should be announced and linked to corrective action.
6. **Cognitive load** — announcements and UI changes should not compete or overwhelm.
7. **Landmarks** — main regions should expose meaningful structure for assistive tech users.
### Route Enumeration
The agent must know exactly which pages to walk.
```
1. Read `.sl-ds-config.yaml`.
2. Resolve `accessibility.standard`.
3. Merge explicit route and journey input.
4. De-duplicate routes.
5. Pair each route with:
   a. one or more named goals
   b. expected start selector or default page root
   c. expected completion selector when provided
```
### Focus Map Construction
Each route is mapped before scoring.
```
1. Open route in Playwright.
2. Wait for page-ready condition.
3. Enumerate all focusable elements reachable by Tab.
4. Record for each stop:
   a. DOM index
   b. accessible name
   c. role
   d. bounding box
   e. visibility state
5. Build a tab sequence list.
6. Detect skipped, hidden, or duplicate focus targets.
```
### Reading Order Verification
The first experience is whether content makes sense in sequence.
```
1. Compare focus sequence with DOM order.
2. Compare DOM order with visual coordinates:
   a. top to bottom
   b. left to right within a row
3. Flag order breaks when:
   a. focus jumps backward unexpectedly
   b. hidden utility items interrupt main content
   c. off-screen targets appear before visible primary actions
4. Allow intentional exceptions such as skip links and close buttons.
```
### Journey Simulation
The agent then performs goal-oriented navigation.
```
1. Select the journey goal for the route.
2. Simulate Tab and Shift+Tab movement.
3. Follow expected activation keys:
   a. Enter
   b. Space
   c. Arrow keys for composite widgets
4. Count actual Tab presses required to finish the task.
5. Estimate optimal Tab presses from the minimal path.
6. Compute route score from:
   a. tab efficiency
   b. missing focus cues
   c. dead ends
   d. unexpected detours
```
### Context Preservation
Focus should never disappear or restart arbitrarily.
```
1. Open dialogs, popovers, menus, or inline editors encountered in the journey.
2. Verify focus moves into the revealed context.
3. Verify focus is trapped only when the pattern requires it.
4. Close the context.
5. Verify focus returns to:
   a. the invoking control, or
   b. the next logical step in the workflow
6. Flag any loss of focus, body focus fallback, or jump to document start.
```
### Progressive Disclosure and Error Recovery
Complex UI must remain understandable as state changes.
```
1. Trigger expandable sections, validation errors, and async transitions.
2. Verify newly revealed content appears after an intentional user action.
3. Verify hidden advanced options do not steal focus prematurely.
4. On error:
   a. confirm the message is announced
   b. confirm focus moves to the error summary or first invalid field
   c. confirm recovery path is obvious
5. On success:
   a. confirm success feedback is polite
   b. confirm focus remains on the next useful action
```
### Cognitive Load and Landmark Checks
The route should remain orienting, not noisy.
```
1. Inspect live regions and timing of announcements.
2. Flag overlapping or repeated announcements.
3. Confirm only one primary `main` landmark exists.
4. Confirm navigation, search, banner, complementary, and contentinfo regions are
   present when relevant.
5. Flag unlabeled repeated landmarks.
6. Reward routes that support both Tab navigation and landmark jumps cleanly.
```
### Scoring
Scores are numeric so the audit agent can compare routes consistently.
| Signal | Weight |
|--------|--------|
| Tab efficiency | 30 |
| Reading order | 20 |
| Context preservation | 15 |
| Error recovery | 15 |
| Progressive disclosure | 10 |
| Cognitive load | 5 |
| Landmarks | 5 |
```
1. Start each route at 100.
2. Deduct points according to failed signals and severity.
3. Cap route score at a minimum of 0.
4. Mark route as degraded when score < 85.
5. Mark route as failing when task completion is impossible or focus is lost.
```
### Output
The agent returns route-level results and issue details.
```
1. Write per-route `journey_scores`.
2. Write issue objects with:
   a. route
   b. category
   c. severity
   d. observed behavior
   e. suggested fix
3. Add coverage notes for timed-out or partially executed journeys.
4. Return final aggregate object to the caller.
```
## Failure Modes
| Failure | Detection | Recovery |
|---------|-----------|----------|
| Route never becomes ready | Timeout waiting for main content | Skip route, mark partial coverage, lower confidence |
| Keyboard automation blocked | Focus cannot enter app or page traps the browser | Retry once with fresh context, then record failure |
| Dynamic UI changes too quickly | Elements appear or disappear before observation completes | Use stable selectors or waits, otherwise downgrade confidence |
| Journey goal ambiguous | No clear completion signal or task endpoint | Score route structure only, flag manual journey review |
| Hidden focusable elements | Tab lands on off-screen or aria-hidden controls | Record issue and continue counting actual focus stops |
| Landmark detection ambiguous | Multiple unlabeled regions of same type | Record issue, continue route analysis |
## Confidence Scoring
| Condition | Confidence |
|-----------|------------|
| All routes and journeys completed with stable focus data | 90–100 |
| All routes tested but some journeys inferred rather than explicit | 80–89 |
| Some routes completed and some partially covered | 60–79 |
| Only structural route checks completed | 40–59 |
| No usable journey data collected | 0–39 |
## Configuration
`a11y-navigator` inherits the shared accessibility policy from `.sl-ds-config.yaml`.
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
1. `accessibility.standard` determines the baseline language for reporting and issue mapping.
2. `accessibility.additional` can be echoed in findings when a route affects regulated flows.
3. When no dedicated `accessibility.agents.a11y-navigator` block exists, the agent uses explicit input plus sensible defaults derived from the audit stage.
4. Future navigator-specific options can extend the shared model without changing the current output contract.
## Design Decisions
1. **Focus on journeys, not only widgets** — a page can have accessible controls and still produce a confusing task flow.
2. **Use numeric route scores** — audit orchestration needs a compact way to compare multiple routes and decide when deeper investigation is needed.
3. **Allow intentional exceptions** — skip links and modal close buttons often break naive visual-order rules but are correct for accessibility.
4. **Measure optimal vs actual tabs** — the difference between the two reveals wasted effort and hidden complexity better than raw tab counts alone.
5. **Treat context restoration as a first-class concern** — losing focus after dialogs, inline edits, or async actions is a major usability failure.
6. **Keep landmark analysis lightweight** — navigator is not a full DOM linter; it validates structure only as it supports orientation and movement.
7. **Return issues even on partial runs** — partial evidence is still useful for audit and remediation planning.
