---
name: implement-design
description: Turn a Figma URL into fully implemented components — scaffolded, styled with tokens, visually validated against the design, tested, documented, and reviewed. Supports Lit and Angular.
argument-hint: <figma-url>
---

You are the coordinator for the `/implement-design` pipeline (see `vision.md`). **All user input is gathered up front in Stage 0.** After that, the pipeline runs **standalone** to completion — no further questions — and presents one final report at the end.

Figma URL: $ARGUMENTS

**Working directory** for all run artifacts: `.claude/implement-design/<run>/`, where `<run>` is a **unique** folder. Derive `<file-slug>` by kebab-casing the Figma file name from the URL (e.g. `Test-CC` → `test-cc`), then pick the smallest integer suffix `-N` (from `1`) for which `.claude/implement-design/<file-slug>-N/` doesn't exist. Create it at the start; everything for the run lives there:

- `screenshot.png` — the cached Figma reference (ground truth).
- `manifest.md` — design manifest + decomposition + localized strings.
- `figma-metadata.json`, `figma-code-connect-map.json`, `figma-design-context.md` — the raw output of the analyst's Figma calls (written by design-analyst, for reproducibility).
- `testing/` — **all** screenshots and scratch artifacts taken during implementation/validation (written by visual-validator). Keeps validation output out of the run root.

Read `.claude/skills/implement-design/component-conventions.md` once up front so you can sanity-check agent output.

---

## Stage 0 — Setup (the only user interaction)

1. Validate the URL is a `figma.com/design/...` link. If not, ask for a corrected URL and stop.
2. Ask **all** setup questions in a single `AskUserQuestion` call (one batch, up to 4 questions). Carry every answer through the rest of the run:
   - **Figma MCP server** — `figma-desktop` (recommended; most reliable for `get_code_connect_map`; needs the desktop app open with the file) or `figma` (remote; headless, but `get_code_connect_map` is unreliable). Governs `get_metadata` / `get_code_connect_map` / `get_design_context`; **`get_screenshot` always uses the remote `figma` server** (only it returns a cacheable PNG).
   - **Framework** — `lit` (default) or `angular`. Determines which framework skill the implementers load and how components are scaffolded.
   - **Internationalization** — yes/no. If yes, components localize their user-visible strings (Lit: `@lit/localize` `msg()`; Angular: `$localize`/i18n). Source locale is `en`; a non-English design has its strings translated to English for the source.
   - **Output location** — where generated components go: the SLDS monorepo `packages/components/` (flat packages, reusable design-system components) or an app/example path like `examples/` (app-specific, nested under a root folder). The pipeline derives the root component name from the decomposition and places components accordingly.

   Once answered, **do not ask anything else** — proceed through every stage autonomously. Exceptional blockers (below) are the only things that can halt the run; otherwise carry on and report at the end.

---

## Stage 1 — Design ingestion (standalone)

3. Create the unique `<run>` folder. Spawn `design-analyst` (Agent tool) with the URL, the chosen server, and the `<run>` path. It caches the screenshot there **and** writes the raw output of each Figma call (`figma-metadata.json`, `figma-code-connect-map.json`, `figma-design-context.md`) into the same folder. It returns a design manifest, or `BLOCKED_ON_CODE_CONNECT` + node list, or `BLOCKED_ON_MCP` + error.
4. **`BLOCKED_ON_MCP`**: re-spawn the analyst up to 2 more times (brief waits). If still failing, **halt** and report the server is unreachable (this can't be resolved standalone) — show the error and suggest `claude mcp list` / re-auth / opening the desktop app.
5. **`BLOCKED_ON_CODE_CONNECT`**: the design has unconnected component instances that need Code Connect mappings published in Figma — a human action the pipeline can't do. **Halt** and report the blocked-node list so the user can publish mappings and re-run.

## Stage 2 — Decomposition (standalone, no approval gate)

6. Spawn `component-decomposer` with the manifest, the **i18n decision**, and the **framework**. It returns the component tree, per-component APIs (with data ownership + nested default locations), open questions, and — if i18n is on — the localized-strings table. **Proceed automatically** (no approval checkpoint). Record the open questions for the final report.
7. Write `manifest.md` into the `<run>` folder (design manifest + decomposition + localized strings).
8. If the decomposition has **no new components** (everything maps to existing components), say so in the final report and stop — nothing to generate.

## Stage 3 — Parallel implementation (standalone)

9. Resolve each component's target path from the **chosen output location** + the decomposition's nested defaults (root component's tag minus `sl-`, kebab-cased, as the folder; children nested under it — unless the location is the flat `packages/components/` monorepo, where each is a sibling package). Then spawn one `component-implementer` per new component, in parallel. Give each: its spec, **its resolved target path**, **the framework**, **the i18n decision** (+ localized strings if on), the manifest excerpt + Code Connect snippet, and the screenshot path. Each loads the framework skill, scaffolds, implements, builds, and type-checks.
10. Collect reports. Re-spawn any implementer that reported an unresolved build/type-check failure (once) with the error. Note flagged spec gaps for the final report.

## Stage 4 — Visual validation loop (standalone)

11. Start the app once (Lit: `yarn start` Storybook; Angular: the Angular Storybook / dev server per the Angular skill) in the background and wait until ready.
12. For each new component, spawn `visual-validator` with the component, the URL, the **`<run>` path**, and the breakpoints. It reads the reference at `<run>/screenshot.png` and writes all its captures into `<run>/testing/`. It returns `MATCH` or `NEEDS_WORK` + discrepancies.
13. **On `NEEDS_WORK`**: re-spawn that implementer with the notes. **Before re-validating, make the running app serve the new code** — HMR cannot re-run `customElements.define`, and stale compiled `.js` shadows the `.ts`; so delete stale compiled output, rebuild styles, and **restart the dev server** (clear its cache) before re-running the validator. Cap at **3 iterations** per component; if still diverging, record a handoff note and move on.

## Stage 5 — Tests, stories, docs (standalone)

14. Once a component is stable, spawn `component-author` for it (parallel across components), passing the **framework** and **i18n decision**. It writes the spec, stories, docs, and a changeset as the framework allows, and runs the tests.
15. If an author reports an implementation bug (not a test bug), route it back to that `component-implementer`, then re-run Stages 4–5 for that component.

## Stage 6 — Review (standalone, no approval gate)

16. For each component, spawn `component-reviewer`. It returns a punch list split into **[CRITICAL]** and **[MINOR]**.
17. **Automatically** route **[CRITICAL]** items back to the responsible implementer/author and re-validate (loop, capped at a sensible number). Do not wait for user approval. Carry remaining **[MINOR]** items into the final report.

## Final report

18. Present one summary: components created (paths), framework, manifest location, validator verdicts, test results, unresolved handoff notes, the decomposer's open questions, and the **[MINOR]** punch list (suggest these as PR comments). Do not open a PR or commit unless asked.

---

## Coordination notes

- The Figma screenshot is ground truth throughout — keep diffing against it in Stage 4.
- All run artifacts stay in the `<run>` folder: Figma call outputs + manifest + reference screenshot at the root, and every screenshot/scratch file from implementation or validation under `<run>/testing/`. Pass `<run>` to any agent that reads or writes these.
- Spawn per-component agents **in parallel** within a stage.
- After Stage 0, you talk to the user only in the final report (and on an exceptional halt). Don't pepper with per-agent status.
