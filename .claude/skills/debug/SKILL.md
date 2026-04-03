---
name: debug
description: Debug Storybook stories using Playwright screenshots and Chrome DevTools MCP server.
---

# Debugging Storybook stories

This skill covers how to inspect and debug stories in the SL Design System Storybook.

## Dev server

Run the dev server with:

```bash
yarn start --watch
```

Storybook starts on `http://localhost:6006` and **automatically reloads** when you save changes to `.ts`, `.scss`, or `.stories.ts` files — no manual restart needed.

## Taking screenshots with Playwright

Use the `mcp__playwright__browser_navigate` and `mcp__playwright__browser_take_screenshot` tools to capture a story's iframe directly.

Story IDs follow the pattern `<title-kebab>--<story-kebab>`. The title comes from the `title` field in the stories file (e.g. `'Actions/Button'` → `actions-button`).

```
# Navigate to a story iframe
http://localhost:6006/iframe.html?id=actions-button--basic

# Then take a screenshot
mcp__playwright__browser_take_screenshot
```

To find a story's ID: check the `title` in `src/<name>.stories.ts` and the exported story name (e.g. `export const Basic` → `basic`).

## Inspecting the console with Chrome DevTools

Use the `mcp__chrome-devtools__list_console_messages` and `mcp__chrome-devtools__get_console_message` tools to inspect errors and warnings logged by a story.

First navigate to the story URL in a Chrome DevTools page, then:

```
# List all console messages
mcp__chrome-devtools__list_console_messages

# Get details of a specific message
mcp__chrome-devtools__get_console_message
```

This is useful for catching Lit warnings, custom element registration errors, or unhandled promise rejections that don't show up visually.
