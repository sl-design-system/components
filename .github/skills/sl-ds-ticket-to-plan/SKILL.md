---
name: sl-ds-ticket-to-plan
description: "Turns a GitHub issue of the SL Design System (sl-design-system/components) into draft acceptance criteria for the developer to confirm, then into an implementation plan mapped to this repository's files. Use it when a design-system developer starts work on an issue, asks what an issue needs, or wants a plan for an issue number or link."
argument-hint: '<issue number, #number or issue link>'
---

# sl-ds ticket to plan

Two outputs, both in the chat, never written to a file unless the developer asks:

1. Draft acceptance criteria, for the developer to confirm or change.
2. The implementation plan, only after that confirmation.

Nothing is posted to GitHub: no comments, labels or branches.

## 1. Setup check

Always first, never skipped.
Copy this checklist into your reply and fill in each line from a call you make in this run:

```text
Setup check
1 GitHub      gh auth status, then gh issue view <n> --repo sl-design-system/components; or the GitHub MCP issue_read
2 Checkout    git remote -v shows sl-design-system/components; git fetch origin main; git status -sb: branch, and how far behind origin/main
3 Open work   gh pr list --repo sl-design-system/components --state all --search "<n>": a pull request that already handles it
4 Figma       only if the issue or its comments link a Figma file: whoami (any seat can read; View or Collab seats get few calls), else n/a
```

Mark each line `ok`, `question`, `failed` or `n/a`, with what the call returned.

- A tool you cannot see is not missing yet: clients defer or hide tools, so search for it, or ask the developer to turn it on or sign in.
- GitHub failed: name it (not installed, signed out) with the fix, `gh auth login` after installing `gh` from https://cli.github.com, or a sign-in to the GitHub MCP server, and stop until it works.
- Behind origin/main or on another branch: say so, because the plan is mapped to the files you read; never switch branches or pull without asking.
- An open or merged pull request for the issue: show it and ask whether to go on.
- Figma signed out or not configured: name it with the fix (sign in to the Figma MCP server in the client's MCP settings), then ask: fix it now, or go on from the issue's text and images.
- Never read, print or ask for tokens or the files that hold them.

## 2. Read the issue

- `gh issue view <n> --repo sl-design-system/components --json title,body,labels,state,comments,url`, or the GitHub MCP issue_read with its comments.
  Decisions often live in the comments; the newest decision wins over the body.
- The parent issue, for the wider goal: `gh api repos/sl-design-system/components/issues/<n>/parent` (404 means none).
  Read issues the body links to only where they change the scope.
- Look at images in the body when your client can open them; otherwise list them under open questions as not seen.
- Note the component(s): from the title prefix such as `[Dialog]`, the labels and the body; the code is in `packages/components/<name>/`.

## 3. Decide the kind of work

| The issue                                                | Then                                                                                                                                                                                                                                                                                                                   |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bug                                                      | Plan a fix; the first plan step reproduces it (spec test or story) before changing code                                                                                                                                                                                                                                |
| Feature, request or new component                        | Draft acceptance criteria, then plan                                                                                                                                                                                                                                                                                   |
| Tokens or theme                                          | Plan the change in Tokens Studio; `yarn import-tokens` (`studio pull`) then regenerates the committed `scripts/themes/export/` (e.g. `core-css/brand/<theme>.css`) and `scripts/themes/studio.lock`, which are never edited by hand; name the token, the export file you expect to change and what else uses the token |
| Documentation only                                       | Plan in `website/`; no changeset                                                                                                                                                                                                                                                                                       |
| Discovery, research or a spike                           | Skip the confirmation: give investigation questions and areas to explore instead of steps                                                                                                                                                                                                                              |
| Figma library work only (a `figma` label, no code asked) | Stop: say there is no code scope                                                                                                                                                                                                                                                                                       |

## 4. Read the design (only with a Figma link and access)

- Per link: the file key and node ID from the URL (`node-id=1-2` is node `1:2`), then get_screenshot first and read it whole: it shows every variant and state.
- Then get_design_context on the nodes you need, and get_variable_defs for the tokens.
- The Figma file is the design-system library, so read it as an API: component properties and variants map to the component's properties and attributes, and spacing or color values map to tokens, never to raw values.

## 5. Draft acceptance criteria and wait

```text
## Draft acceptance criteria: #<n> <title>

Confirm or change these; then I will make the plan.

1. <behavior or visual change, testable on its own>
   1. <condition or variant>
2. ...

Not in scope:
- <detail seen but not asked for>

Open questions:
- <what needs the issue author or a designer>
```

- If the issue already lists acceptance criteria, keep them as written and add only what is missing, marked `(added)`.
- Every item traces to a line in the issue, a comment or a state in the design; what you cannot trace is an open question.
- Name things as the design and the issue do: property names, labels, states.
- No file names or code here.
- Cover the public surface: properties and attributes, slots, events, CSS custom properties, keyboard and screen-reader behavior, and the Angular use if the issue mentions it.

Do not read the codebase for the plan before the developer confirms.

## 6. Map the change to the repository

After the confirmation, read the repository's own instructions first (`.github/copilot-instructions.md`, `CONTRIBUTING.md`) and the files the change touches:

- `packages/components/<name>/src/`: `<name>.ts`, `<name>.css`, `<name>.spec.ts`, `<name>.stories.ts`, plus `index.ts` when the public exports change.
- Shared behavior lives in `packages/components/shared/`; check it before adding a helper.
- New user-visible text uses `msg()` with an `id`, then `yarn extract-i18n` and a `<target>` in every `.xlf` file in `packages/locales/src/`; the `.ts` files there are generated.
- Angular: the component wrappers are generated from the custom-elements manifest; only `packages/angular/src/forms/`, `services/` and the top-level files such as `tooltip.directive.ts` are written by hand.
- Website docs: `website/src/categories/components/<name>/` (`usage.md`, `accessibility.md`, `code.md`); the component's status is in `<name>.json` there.
- `git log --oneline -15 -- packages/components/<name>` and the component's `CHANGELOG.md`: recent fixes the change must not undo.

## 7. The plan

```text
## Plan: #<n> <short title>

<Two lines: what the issue needs and the approach.>

Steps
1. <step> (acceptance criteria 1, 2)
   - depends on / parallel with: <n>

Files
- `<path>`: <what changes, by symbol>

Must not regress
- <behavior that is true now and must stay true, and how to check it>

Verification
1. yarn vitest --project=unit packages/components/<name>
2. eslint --config packages/components/eslint.config.mjs 'packages/components/<name>/**/*.ts' and stylelint 'packages/components/<name>/**/*.css'
3. The story for each changed state in Storybook (yarn start), checked in a browser against the design or the issue
4. Keyboard and screen reader: role, name, focus order and visible focus of what changed
5. Each "Must not regress" item

Release
- Branch `fix/<n>-<desc>` or `feature/<n>-<desc>`; a changeset per changed package (`.github/skills/changeset/SKILL.md`), with the bump type and why; the pull request says `Fixes #<n>`

Decisions
- <scope limits, assumptions, open items>
```

- Must not regress: earlier acceptance criteria on the same component, keyboard and focus behavior, accessibility, existing variants and themes, and anything the change edits near; for a bug, the correct behavior the fix restores, so it does not over-correct.
- A change to a public property, attribute, event, slot or CSS custom property is public API: say whether it breaks anything, and which bump type follows.
- Map every acceptance criterion to at least one step and one check.

## 8. Improve this skill

When the plan is done, and again when the work on the issue ends in this session, look back once: did this skill cause a problem?
For example, the developer corrected the draft or the plan in a way the skill should have caught, a command or path in this file was wrong, or a step did not fit the issue.
If so, show what happened in two lines and the smallest change to this file that would have prevented it, as a diff.
With the developer's yes, save it as `.github/skill-tests/sl-ds-ticket-to-plan/<YYYY-MM-DD>-<issue>.md`, in the format of `.github/skill-tests/README.md`; never change this file or post anything on your own.
If nothing went wrong, say nothing.
