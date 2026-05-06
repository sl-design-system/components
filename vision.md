# `/implement-design` — The Vision

A multi-agent pipeline where each stage feeds the next, with feedback loops at the right points.

---

## Why

Building a UI component correctly — one that matches the design, is accessible, uses the right tokens, has tests, stories, and docs — is repetitive, time-consuming, and easy to get wrong under deadline pressure. Developers end up context-switching between Figma, the codebase, design token docs, and accessibility guidelines before writing a single line of meaningful logic.

This pipeline automates the undifferentiated heavy lifting. The scaffold, the token mapping, the ARIA wiring, the boilerplate stories and tests — none of that requires creative judgment, yet it consumes the majority of implementation time. By handling it end-to-end, the pipeline frees the developer to focus on what actually matters: the business logic, the state management, the interactions that make the component useful in the application.

It also enforces best practices by construction. Every component that comes out of this pipeline will have used design tokens rather than hard-coded values, will be keyboard operable, will have been checked against the Figma design visually, and will have a test suite — not because the developer remembered to do all of that, but because the pipeline cannot produce output any other way. The review stage catches the gaps before they become PR comments or production bugs.

The end result is consistent quality at a fraction of the time, and a developer who spent their afternoon on the problem worth solving rather than the scaffolding around it.

---

## Stage 1: Design Ingestion

The command kicks off by calling the Figma MCP (`get_design_context`) with the provided URL. This returns two things: the Code Connect markup (which identifies SLDS components already mapped) and a screenshot of the design. A **design analyst agent** reads both and produces a structured manifest:

- Which parts of the design map to existing `@sl-design-system/*` components (via Code Connect)
- Which parts are _compositions_ of existing components — these become new components
- Which parts, if any, require net-new primitives
- Responsive breakpoints visible in the design (e.g., desktop vs. mobile frames)
- Any annotation layers the designer left (constraints, behavior notes)

---

## Stage 2: Component Decomposition

A **decomposition agent** takes the manifest and applies standard component design heuristics: single responsibility, reusability, slot boundaries, and how SLDS itself structures things. It proposes a tree:

```
<sl-checkout-card>
  ├── uses: <sl-button>, <sl-text-field>, <sl-badge>  (existing)
  └── composes into: <sl-checkout-card> (new)
```

For each proposed new component it defines: tag name, public API (properties/slots/events), expected accessibility role, and which SLDS design tokens map to which visual decisions in the design.

This proposal is presented to the user for a quick approval/redirect before any code is written.

---

## Stage 3: Parallel Implementation

Once the decomposition is approved, a **coordinator** spawns parallel agents — one per new component — each running the existing skill chain:

1. `/setup-component-package` — scaffolds the package
2. `/write-litelement` — implements the LitElement class, using `ForwardAriaMixin` where appropriate, `formAssociated` for form controls, correct ARIA roles
3. `/write-component-css` — maps every visual decision in the design to `--sl-color-*` and `--sl-size-*` tokens; never raw values

Each agent gets both the screenshot and the relevant Code Connect snippet as its spec.

---

## Stage 4: Visual Validation Loop

This is where Playwright MCP becomes the feedback mechanism. A **validator agent**:

1. Spins up Storybook (or a minimal HTML fixture) with the new component
2. Takes a screenshot at each relevant breakpoint
3. Does a structural diff against the original Figma screenshot — layout, spacing proportions, color regions, interactive states (hover, focus, disabled)
4. Feeds discrepancies back as specific, actionable instructions ("the gap between the icon and label is 8px, should be 12px — use `--sl-size-150`")

The implementation agents receive these notes and patch their SCSS. The loop runs until no significant visual regressions remain, or a max-iteration threshold is hit with a human handoff note.

---

## Stage 5: Test, Story & Documentation Generation

Three agents run in parallel once the implementation is stable:

- **Test agent** (`/write-tests`): writes Vitest browser tests covering default state, each reflected property, keyboard interactions, ARIA attributes, form association where applicable
- **Story agent** (`/write-stories`): writes Storybook stories with sensible arg defaults, `a11y` config excluding known false positives, and interactive controls for every public prop
- **Docs agent** (`/write-docs`): writes component documentation covering the public API, usage guidelines, accessibility notes, and design token references

All three agents take the component source + Figma design context as input so they know what states and variants actually exist in the design.

---

## Stage 6: Review & Iteration

A **reviewer agent** (`/review-component`) does a final pass over all outputs together — component source, CSS, tests, stories, docs — and checks:

- Accessibility completeness (keyboard operability, ARIA, color contrast via design tokens)
- Token hygiene (no raw values leaked in)
- API consistency with the SLDS convention (naming, event patterns, slot names)
- Test coverage gaps
- Story completeness against the Figma design states

It emits a prioritized punch list. Critical issues go back to the responsible implementation agent for a fix-and-re-validate cycle. Non-critical issues become GitHub PR review comments for the human to decide on.

---

## What makes this "holy grail" rather than just automation

The key is that **the Figma screenshot never leaves the loop** — it's the ground truth that the Playwright validator keeps checking against, not just a one-time spec. And Code Connect is what bridges the gap between "Figma layer" and "which SLDS component + which props" — without it, the design analyst would be guessing.

The weak points to solve before this is fully reliable: visual diffing is hard to make precise without a dedicated image-comparison model, and component decomposition requires good judgment about when to split vs. compose — that stage probably benefits most from a human checkpoint.
