---
name: sl-ds-feedback
description: "Reports an SL Design System (sl-ds, @sl-design-system/*) bug, missing feature or component need to the design-system team on GitHub. It searches the existing issues first and adds a +1 or a comment to a match, or creates a new issue from the repository's issue form, always after the developer's yes. Use it when a developer wants to report or request something in sl-ds, and offer it when you run into an sl-ds problem during any task."
argument-hint: '[what is wrong or missing, such as: sl-button has no focus ring with fill=link]'
---

# sl-ds feedback

The repository is github.com/sl-design-system/components, and it is public.
Read its files from the `main` branch.
Take steps 2 to 4 for each item the developer, or another skill, gives you.
Nothing is posted without the developer's yes.

## 1. Setup check

Always first, never skipped.
Copy this checklist into your reply and fill in each line from a call you make in this run:

```text
Setup check
1 GitHub      gh auth status and one gh search issues, or the GitHub MCP search_issues
2 Component   its name and installed version, from the lockfile
3 Framework   from the package manifest
4 Reporter    git config user.name, or the GitHub profile
5 Team        "For sl-ds issues" in .github/sl-ds-figma-to-code.md, if the file exists
```

Mark each line `ok`, `question`, `failed` or `n/a`, with what the call returned.

- A tool you cannot see is not missing yet: search for it, or ask the developer to turn it on or sign in.
- If GitHub fails, name it (not installed, signed out) with the fix: `gh auth login` after installing `gh` from https://cli.github.com, or a sign-in to the GitHub MCP server.
  Wait for the fix; work without GitHub, with the developer searching and filing by hand from your text, only if they say so.
- Ask for everything else you could not read in one list.
- Never store the reporter's name, and never read or print tokens.

## 2. Check

- The component's status: `componentStatus` in `website/src/categories/components/<name>/<name>.json`.
  If a `stable` component covers the need, tell the developer, no issue needed; a `preview` one is available but its API may change, and the need may be a request to make it Stable; never suggest a `draft` one.
- For a bug or a missing feature, compare the installed version with `packages/components/<name>/CHANGELOG.md` (newest first).
  If a newer release has it, the advice is to upgrade.

## 3. Search

Search open and closed issues by component name and key words (`gh search issues --repo sl-design-system/components <words>` returns both when you leave out `--state`).
If you are not sure about a match, show the closest two or three and let the developer pick.

## 4. Draft

- A match: a 👍 on the issue, and a comment only if the developer adds something new, such as another use case, version or browser.
- No match: the form in `.github/ISSUE_TEMPLATE/` that fits; read its fields there and fill in every required one.
  A required value the developer did not give and the repository does not show (a browser, the impact) is a question to them, never a guess.
  A request to make a Preview component Stable is a feature request; a Code Connect mapping that gives no working code goes to the Figma toolkit form, after reading `scripts/connect-figma-components/` on `main`: say whether the mapping exists, never assume it is missing.
- The body has the form's field labels as `###` headings, in the form's order.
- In a bug, the reproduction path goes into Steps to Reproduce, what was observed into Current Behavior and what was expected into Expected Behavior; in a feature request, the reproduction path goes into Context.
- The reproduction path must work for the design-system team: a story in their public Storybook or a small snippet with only sl-ds, never a path through the developer's product.
- Only what the form asks for: nothing about the developer's product beyond the form's product or team field, so no product names, plans or dates, ticket keys, internal links, product code or unreleased designs.
- Every new issue and comment ends with the line `<!-- sl-ds-feedback -->`, which GitHub hides on the page, so the team can find what came in through this skill (`gh search issues --repo sl-design-system/components sl-ds-feedback`).
  Show it in the text the developer confirms; a 👍 cannot carry it.

## 5. Advise, confirm, send

- If you would do something else, say so once and why: a likely duplicate (👍 it instead), fixed in a newer version (upgrade), a question (the contact link in `.github/ISSUE_TEMPLATE/config.yml`), another form fits better, not an sl-ds problem, or text that looks internal.
  The developer decides; if they insist, do as they ask, because it goes out under their name.
- Show one list: the setup check in one line, then per item the action and the exact text.
  One answer: send all, pick, edit or skip.
- After the yes:
  - 👍: `add_issue_comment` with `reaction: "+1"`, or `gh api -X POST repos/sl-design-system/components/issues/<n>/reactions -f content=+1`.
  - Comment: `add_issue_comment`, or `gh issue comment <n> --repo sl-design-system/components`.
  - New issue: `issue_write` with `method: "create"`, or `gh api -X POST repos/sl-design-system/components/issues`, with the title, the body and the form's `labels` and `type`.
- Then give the links.
  If GitHub dropped the form's labels or type, which it does for users without push access, say that the issue is in but without the `triage` label.
