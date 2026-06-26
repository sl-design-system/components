---
name: implement-design
description: Turn a Figma URL into fully implemented components — scaffolded, styled with tokens, visually validated against the design, tested, documented, and reviewed. Supports Lit and Angular.
argument-hint: <figma-url>
---

You are the coordinator for the `/implement-design` pipeline (see `vision.md` in this skill's folder). **All user input is gathered up front in Stage 0.** After that, the pipeline runs **standalone** to completion — no further questions — and presents one final report at the end.

Figma URL: $ARGUMENTS

**Working directory** for all run artifacts: `.implement-design/<run>/` at the project root, where `<run>` is a **unique** folder. Derive `<file-slug>` by kebab-casing the Figma file name from the URL (e.g. `Test-CC` → `test-cc`), then pick the smallest integer suffix `-N` (from `1`) for which `.implement-design/<file-slug>-N/` doesn't exist. Create it at the start (and make sure `.implement-design/` is ignored — add it to the project's `.gitignore` if it isn't); everything for the run lives there:

- `screenshot.png` — the cached Figma reference (ground truth).
- `manifest.md` — design manifest + decomposition + localized strings.
- `figma-metadata.json`, `figma-code-connect-map.json`, `figma-design-context.md`, `figma-variable-defs.json` — the raw output of the analyst's Figma calls (written by design-analyst, for reproducibility).
- `testing/` — **all** screenshots and scratch artifacts taken during implementation/validation (written by visual-validator). Keeps validation output out of the run root.

**Plugin paths.** This skill is installed as part of a plugin, together with the pipeline's agents and supporting files. Let `<skill-dir>` be the absolute path of the folder containing this `SKILL.md`, and `<skills>` its parent (the plugin's `skills/` folder). The agents cannot guess where the plugin is installed, so **pass each agent the absolute path(s) it needs** when you spawn it:

- `design-analyst` → the manifest schema: `<skill-dir>/design-manifest.schema.md`
- `component-implementer` and `component-author` → the chosen framework skill: `<skills>/implement-design-lit/SKILL.md` or `<skills>/implement-design-angular/SKILL.md` (each of which references `<skill-dir>/component-conventions.md`, so pass that path too)
- `component-reviewer` → the conventions: `<skill-dir>/component-conventions.md`

Read `<skill-dir>/component-conventions.md` once up front yourself so you can sanity-check agent output.

---

## Stage 0 — Setup (the only user interaction)

1. Validate the URL is a `figma.com/design/...` link. If not, ask for a corrected URL and stop.
2. Ask **all** setup questions in one batch (in Claude Code: a single `AskUserQuestion` call, up to 4 questions; in other tools: one consolidated message listing every question). Carry every answer through the rest of the run:
   - **Figma MCP server** — `figma-desktop` (recommended; most reliable for `get_code_connect_map`; needs the desktop app open with the file) or `figma` (remote; headless, but `get_code_connect_map` is unreliable). Governs `get_metadata` / `get_code_connect_map` / `get_design_context`; **`get_screenshot` always uses the remote `figma` server** (only it returns a cacheable PNG).
   - **Framework** — `lit` (default) or `angular`. Determines which framework skill the implementers load and how components are scaffolded.
   - **Internationalization** — yes/no. If yes, components localize their user-visible strings (Lit: `@lit/localize` `msg()`; Angular: `$localize`/i18n). Source locale is `en`; a non-English design has its strings translated to English for the source.
   - **Output location** — where generated components go: the SLDS monorepo `packages/components/` (flat packages, reusable design-system components) or an app/example path like `examples/` (app-specific, nested under a root folder). The pipeline derives the root component name from the decomposition and places components accordingly.

   Once answered, **do not ask anything else** — proceed through every stage autonomously. Exceptional blockers (below) are the only things that can halt the run; otherwise carry on and report at the end.

---

## Stage 1 — Design ingestion (standalone)

3. Create the unique `<run>` folder. Spawn `design-analyst` (as a subagent — in Claude Code via the Agent tool; in Copilot via subagent delegation; the same applies to every "spawn" below) with the URL, the chosen server, the `<run>` path, and the manifest-schema path. It caches the screenshot there **and** writes the raw output of each Figma call (`figma-metadata.json`, `figma-code-connect-map.json`, `figma-design-context.md`, `figma-variable-defs.json`) into the same folder. It returns a design manifest, or `BLOCKED_ON_CODE_CONNECT` + node list, or `BLOCKED_ON_MCP` + error.
4. **`BLOCKED_ON_MCP`**: re-spawn the analyst up to 2 more times (brief waits). If still failing, **halt** and report the server is unreachable (this can't be resolved standalone) — show the error and suggest `claude mcp list` / re-auth / opening the desktop app.
5. **`BLOCKED_ON_CODE_CONNECT`**: the design has unconnected component instances that need Code Connect mappings published in Figma — a human action the pipeline can't do. **Halt** and report the blocked-node list so the user can publish mappings and re-run.

## Stage 2 — Decomposition (standalone, no approval gate)

6. Spawn `component-decomposer` with the manifest, the **i18n decision**, and the **framework**. It returns the component tree, per-component APIs (with data ownership + nested default locations), a **Shared Types / Contracts** section (every interface that crosses a component boundary — its fields + which component exports it), open questions, and — if i18n is on — the localized-strings table. **Proceed automatically** (no approval checkpoint). For each open question, pick a sensible default and proceed; record **both the question and the default you chose** for the final report.
7. Write `manifest.md` into the `<run>` folder (design manifest + decomposition + localized strings).
8. If the decomposition has **no new components** (everything maps to existing components), say so in the final report and stop — nothing to generate.

## Stage 3 — Implementation (dependency-ordered)

9. Resolve each component's target path from the **chosen output location** + the decomposition's nested defaults (root component's tag minus `sl-`, kebab-cased, as the folder; children nested under it — unless the location is the flat `packages/components/` monorepo, where each is a sibling package).
10. **Spawn implementers in dependency order, not all at once.** A parent imports its children's classes _and_ their exported types, so a parent can't type-check until its children exist. Walk the decomposition tree **leaves-first**: implement all components at the deepest level in parallel, then their parents, … up to the root last. Components with no dependency on each other (siblings) still go in parallel within a level. Give each implementer: its spec, **its resolved target path**, **the framework + the framework-skill path** (see "Plugin paths"), **the i18n decision** (+ verbatim localized strings if on), **the Shared Types / Contracts** it must export or consume (so parallel siblings don't drift), the manifest excerpt + Code Connect snippet, and the screenshot path. Each scaffolds, implements (component + **a basic Storybook story** so Stage 4 can render it), and reports **the exact Storybook story id** it created. **Styles are plain `.css` imported with `{ type: 'css' }` — no style-build step.** Children take a cohesive **model object**, not a pile of scalar props.
11. **Consolidated gate (orchestrator owns this) — must pass before Stage 4.** A leaf can't `tsc` standalone (no tsconfig until the package is wired), so after all implementers return, run **one** package-wide check yourself — `npx tsc -p <package>/tsconfig.json --noEmit` — and route any errors back to the responsible implementer (cap one retry each). **Two hard gates** that block Stage 4:
    - **Type-check is clean** (`tsc` exit 0).
    - **If i18n is on, the i18n-id check is clean**: grep every generated **literal** `msg(… { id: '…' })` id and diff it against the decomposer's localized-strings table, **both directions** — a generated id missing from the table is drift; a table id with no matching _literal_ generated id usually means the implementer used a **variable** `msg(x, { id: y })` (which lit-localize can't extract — a real bug). Route either back. Don't enter Stage 4 until both gates pass.
      Note flagged spec gaps for the final report.

## Stage 4 — Visual validation loop (standalone)

12. Start the app once (Lit: `yarn start` Storybook; Angular: the Angular Storybook / dev server per the Angular skill) in the background and wait until ready.
13. **Validate the page/root (and any component that's independently meaningful), not every leaf.** Pure presentational children only render inside their parent, so diffing them in isolation wastes spawns — they're covered by the page's validation. Spawn `visual-validator` for each such component with the component + **its story id** (from Stage 3), the URL, the **`<run>` path**, and the breakpoints. It reads the reference at `<run>/screenshot.png` **and the intended values from `<run>/manifest.md` (Token Reference + per-component specs)**, and writes all its captures into `<run>/testing/`. It returns `MATCH` or `NEEDS_WORK` + discrepancies — and its `MATCH` must be backed by the **measured comparison table** (per-element built-vs-expected), not a gestalt impression.
14. **On `NEEDS_WORK`**: re-spawn the responsible implementer with the notes, then re-run the validator. With plain `.css` (imported via `{ type: 'css' }`) and Lit, **edits hot-reload in the running dev server — do not restart Storybook**, and there's no style-build step to redo. If a discrepancy traces to a composed SLDS component's own built-in behavior (e.g. a collapse threshold, a slot you didn't use), tell the implementer to **read that component's source/stories for the right API rather than re-tweaking CSS**. Cap at **3 iterations** per component; if still diverging, record a handoff note and move on.

## Stage 5 — Tests, stories, docs (standalone)

15. Once a component is stable, spawn `component-author` for it (parallel across components), passing the **framework + the framework-skill path**, the **i18n decision**, and **the output location**. The basic story already exists (Stage 3); the author **scopes its work to where the code lives**:
    - **`packages/components/*` (published package)**: write the Vitest spec, add variant stories, write website docs, add a changeset, run the tests, and — when i18n is on — run `yarn extract-i18n` so the new `msg()` ids land in the locale files.
    - **`examples/` or another app path**: produce only what that location uses — typically just enrich the story (variants/states); **skip** tests/website-docs/changeset (and i18n extraction) unless the neighbouring code there has them. Don't force the published-package set onto an example.
16. If an author reports an implementation bug (not a test bug), route it back to that `component-implementer`, then re-run Stages 4–5 for that component.

## Stage 6 — Review (standalone, no approval gate)

17. For each component, spawn `component-reviewer`, passing the package path, **the output location** (so it scopes published-package-only checks correctly), **and the conventions path** (see "Plugin paths"). It returns a punch list split into **[CRITICAL]** and **[MINOR]**.
18. **Automatically** route **[CRITICAL]** items back to the responsible implementer/author and re-validate (loop, capped at a sensible number). Do not wait for user approval. Carry remaining **[MINOR]** items into the final report.

## Final report

19. Before reporting, **verify the working tree is clean of stray artifacts**: run `git status` and confirm nothing landed outside the intended trees (the `<run>` folder and the generated component path) — in particular no scratch screenshots at the repo root; remove any that slipped out. Then present one summary: components created (paths), framework, manifest location, validator verdicts, test results, unresolved handoff notes, the decomposer's open questions **with the default you chose for each**, and the **[MINOR]** punch list (suggest these as PR comments). Do not open a PR or commit unless asked.

---

## Coordination notes

- Agent names in this skill are unqualified (`design-analyst`, `component-implementer`, …); your tool may list them with a plugin namespace prefix (e.g. `implement-design:design-analyst`). Use the name exactly as it appears in your agent list.
- The Figma screenshot is ground truth throughout — keep diffing against it in Stage 4.
- All run artifacts stay in the `<run>` folder: Figma call outputs + manifest + reference screenshot at the root, and every screenshot/scratch file from implementation or validation under `<run>/testing/`. Pass `<run>` to any agent that reads or writes these.
- Spawn per-component agents **in parallel within a dependency level** — in Stage 3 that means leaves-first up the tree (a parent needs its children's types to type-check); in Stages 5–6 siblings can all go at once.
- After Stage 0, you talk to the user only in the final report (and on an exceptional halt). Don't pepper with per-agent status.
