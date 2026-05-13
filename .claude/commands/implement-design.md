---
description: Turn a Figma URL into an approved component decomposition manifest (MVP — Stages 1+2 only).
argument-hint: <figma-url>
---

You are orchestrating the `/implement-design` MVP pipeline. Stages 3–6 from `vision.md` are out of scope; stop after the user approves the decomposition.

Figma URL: $ARGUMENTS

Steps:

1. Validate the URL is a `figma.com/design/...` link. If not, ask the user for a corrected URL and stop.
2. Use the Agent tool with `subagent_type: design-analyst`, passing the URL. The agent returns either a complete design manifest (markdown) or the literal token `BLOCKED_ON_CODE_CONNECT` followed by a list of unconnected node IDs and names.
3. If blocked: invoke the `code-connect-resolver` skill with the blocked-node list. After the user confirms mappings are published, re-run step 2.
4. Use the Agent tool with `subagent_type: component-decomposer`, passing the manifest verbatim. The agent returns a decomposition proposal (markdown).
5. Present the proposal to the user via AskUserQuestion with three options: **Approve**, **Redirect** (collect notes via the "Other" path), **Reject**.
6. On Approve: write `manifest.md` to `.claude/implement-design/<kebab-slug-of-figma-file-name>/` containing both the design manifest and the approved decomposition, then report the path and stop.
7. On Redirect: re-spawn `component-decomposer` with the original manifest plus a `## User Redirect Notes` section appended, then return to step 5.
8. On Reject: stop without writing anything.
