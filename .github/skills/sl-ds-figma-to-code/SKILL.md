---
name: sl-ds-figma-to-code
description: "Implements a Figma design, a Jira or GitHub ticket with designs, or design screenshots in this repository's existing app. Use it whenever the developer asks to build or change UI from a design. It checks the developer's setup first, picks components in a fixed order, checks the result and passes design-system feedback on; `/sl-ds-figma-to-code check` runs only the setup check."
argument-hint: '[ticket key | Figma link | check]'
---

# Figma to code

## 1. Setup check

Always first, never skipped.
Copy this checklist into your reply and fill in each line from a call you make in this run:

```text
Setup check
1 Ticket        getJiraIssue (Jira), gh issue view or the GitHub MCP issue_read (GitHub), or none given
2 Figma         whoami: Dev or Full seat -> Figma path; View or Collab seat, or no Figma link -> screenshot path
3 Figma skill   figma-design-to-code loaded (Figma path only)
4 Images        screenshot path: from the ticket (downloadJiraIssueAttachment) or the chat, else get_screenshot per frame, else "Copy as PNG"; no design at all: ask for one
5 Context file  .github/sl-ds-figma-to-code.md read, or missing: drafted at the end
6 App           its URL opened with the browser tool for the check: the project's verify skill, the client's browser tools, playwright-cli or Playwright MCP
7 Commands      lint, type-check and unit tests, from the context file or package.json
```

Mark each line `ok`, `route`, `question`, `failed` or `n/a`, with what the call returned.

- A tool you cannot see is not missing yet: clients defer or hide tools, so search for it, or ask the developer to turn it on or sign in.
  An error earlier in the chat is not proof either.
- Name each failure (not installed, signed out, no access, limit reached) with its fix and fallback from [references/setup.md](references/setup.md).
- Then go through the open lines one at a time: wait for the developer's choice (fix it now, take the fallback, or skip that part) and check the line again after a fix.
  Never take a fallback on your own; a route that follows from the seat is not a failure.
- On a View or Collab seat, ask before each get_screenshot (these seats get 20 Figma calls a month) and offer "Copy as PNG" instead.
  Never drive figma.com in a browser to get images.
- If nobody can answer during the run (a cloud agent), take the fallbacks and list the failed checks at the top of the pull request description.
- Never read, print or ask for tokens or the files that hold them, and never write the check results anywhere.
- With `check`, fill in every line as if the request had a Jira ticket and a Figma link (atlassianUserInfo, gh auth status, whoami), help with the fixes, and stop there: no context file draft.

## 2. Read the design

- Figma path: use Figma's figma-design-to-code skill; where it and this skill differ, this skill wins.
- Screenshot path: list the visible elements and states; ask about a missing state only when it changes the code.
- Before coding, write down the regions and elements you will build: this is the list for the visual check.

## 3. Choose a component per element

The first that fits wins:

0. The component this project already uses for this kind of element.
1. An sl-ds component as it is, from the installed `@sl-design-system/*` packages.
2. An sl-ds component with small adjustments: variants, properties, slots, CSS custom properties or tokens, never its internals.
3. Another library the project already uses, when no Stable sl-ds component fits.
4. Custom, from the project's tokens and building blocks.

- Code Connect output is a suggestion, not an order, and this overrides Figma's skill: use a snippet only if every tag and attribute in it exists in the installed package (its `custom-elements.json`) and the order above allows it.
  Otherwise build the element from the design data and put the mapping on the design-system list.
- Before using an sl-ds component the project does not use yet, read its status: `componentStatus` in `website/src/categories/components/<name>/<name>.json` on `main` of github.com/sl-design-system/components.
- Ask before adding a UI library or a package, before using an sl-ds component that is not `stable`, before building something custom that sl-ds might cover, and before moving away from the project's convention.

## 4. Fit the project

- Follow the repository's instructions, the context file (its styling line above all) and the nearest similar screen.
- Where the project has its own skill for a step, such as planning or browser verification, use it for that step.
- Change only what the ticket and the design ask; list anything else you notice instead of changing it.

## 5. Check before saying done

- Visual: on the running app (ask before starting any server or backend), take a screenshot of the changed area and compare it with the design, item by item from your list.
  Save screenshots in the folder the context file names, else ask; never next to the source.
- Code: the project's lint on the changed files, the type-check and the affected unit tests.
  Fix what your change broke, and report what was broken before.
- Accessibility: in the accessibility tree of the changed area, every interactive element has a role and a name, images have alt text or are marked decorative, and fields have labels.
  One pass with Tab shows a visible focus in a sensible order.
  Run axe-core only if the project already depends on it.
- At most two fix rounds for the visual check and two for the code checks; then report what is left.

## 6. Summary

1. The setup checklist again, one line per check.
2. What changed, and per element: the component, where it came from (project, Code Connect, sl-ds, sl-ds adjusted, other library, custom) and a one-line reason.
3. The checks, what passed and what is left, and your assumptions; on the screenshot path, what the designer used is judged by look.
4. For the design system: elements built with another library or custom where sl-ds might fit, sl-ds bugs or missing features you met, and Code Connect mappings that gave no working code.
   Leave out what the context file lists as accepted decisions; in a project without sl-ds, this is one line.
   Hand the list to the sl-ds-feedback skill, or show it if that skill is not installed.

## 7. Context file

If `.github/sl-ds-figma-to-code.md` was missing, draft it from [templates/project-context.md](templates/project-context.md) with what this run learned, show it, and write it only after the developer agrees.
If it exists and this run learned something new, propose the change.
