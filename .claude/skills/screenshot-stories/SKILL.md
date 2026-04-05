---
name: screenshot-stories
description: Take screenshots of Storybook stories for visual inspection.
---

Take screenshots of Storybook stories for visual inspection.

Usage: pass a story ID prefix (e.g. `navigation-stepper`) and optionally a list of story names. If no story names are given, screenshot the `basic` story only.

## How to take a screenshot using the Playwright MCP server

**Never** write or run a manual Playwright Node.js script. Always use the MCP tools directly.

### Step 1 — Navigate to the story iframe

Story IDs follow the pattern `<title-kebab>--<story-kebab>`. Example:

```
http://localhost:6006/iframe.html?id=navigation-stepper--basic&viewMode=story
```

Use `mcp__playwright__browser_navigate` with that URL.

### Step 2 — Wait for the component to render

Use `mcp__playwright__browser_wait_for` with a CSS selector that matches the root custom element (e.g. `sl-stepper`).

### Step 3 — Take the screenshot

Use `mcp__playwright__browser_take_screenshot` to capture the current page state.
The screenshot is returned inline — read it visually. There is no need to save it to disk unless the user explicitly asks for a file.

### Repeating for multiple stories

Repeat steps 1–3 for each story name, changing the story slug in the URL each time.

## Story ID reference

The story ID is derived from the `title` field in `src/<name>.stories.ts` and the exported story constant name:

| stories file entry            | story ID                      |
| ----------------------------- | ----------------------------- |
| `title: 'Navigation/Stepper'` | prefix → `navigation-stepper` |
| `export const Basic = ...`    | slug → `basic`                |
| combined                      | `navigation-stepper--basic`   |
