# Run b-itsl-bookmk-deleted-course — BLOCKED at Stage 3

Case `B-Itsl-Bookmk-4549-8339` · Itslearning Bookmarks · frame `Deleted course - content`
(`ya00uFyX1rjxYWF0dlOsoT` / `4549:8339`) · pipeline commit `cdae0769`.

| Stage       | Status                                                                     |
| ----------- | -------------------------------------------------------------------------- |
| 1 ingest    | **done**                                                                   |
| 2 decompose | **done** — 5 components, 20 open questions, all defaults recorded          |
| 3 implement | **BLOCKED** — account weekly usage limit, resets Oct 4 20:00 Europe/Warsaw |
| 4 validate  | not reached                                                                |
| 5 author    | not reached                                                                |
| 6 review    | not reached                                                                |

All four leaf `component-implementer` subagents were launched in parallel and all four terminated
early inside the same minute with the identical API error. This is an environment/quota blocker,
not a pipeline defect.

## What is on disk

`generated/` holds what the dying agents managed to flush — it is **partial and unvalidated**:

- `course-files-bulk-actions/` — `.ts` + `.css`, carries one real type error (TS4114, a missing
  `override` on the static `styles` member).
- `its-app-nav/` — `.ts` only; **its `.css` was never written**, so the component is incomplete.
- `course-files-table/`, `course-files-pager/`, and the root `course-files-page.*` — never written.

`testing/` is empty: Stage 4 never ran, because there is no root component and therefore no story.

## Resuming

Per the runbook, Stage 3 resumes from _manifest + decomposition_, and both are in `manifest.md`:
the design manifest, the full five-component decomposition with verbatim shared types and
per-component geometry specs, and all 20 open questions with the default chosen for each.
`THEME-FACTS.md` carries the run-specific hard constraints (icon set, typography longhands,
token map, border widths).

To resume: delete the two partial component folders under
`examples/lit/src/_runs/b-itsl-bookmk-deleted-course/` and re-run Stage 3 from `manifest.md`.

**Refuse the resume if `git rev-parse HEAD` is not `cdae07695a8204b29ae71954c7011fb348ca3ddc`** —
a resume across a different pipeline commit produces a run that is half old and half new, and its
numbers describe neither.

## What the partial output already proves

Every run-specific hard rule held in the code that did land, checked mechanically:
no `@fortawesome` import, no `Icon.register`, no `font: var(--sl-text-new-*)` shorthand, no `var()`
fallback, no raw hex, no bare `font-weight: 700`, no `customElements.define` in a child. The only
two `sl-icon` names used (`search`, `xmark`) are both in the itslearning theme's registered set.
