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

This is useful for catching:

- **Lit warnings**: e.g. "Element X was scheduled to render before a container...", multiple renderers warning
- **Custom element registration errors**: "Failed to execute 'define' on 'CustomElementRegistry'" — indicates a component was registered twice (common with ScopedElementsMixin integration)
- **Unhandled promise rejections**: often from async lifecycle methods or event handlers
- **Missing icon warnings**: when an icon name is not registered (use `Icon.register()` at module level)
- **ARIA validation warnings**: browser-emitted warnings about invalid ARIA attributes

## Common Storybook issues

| Symptom                               | Likely cause                                    | Fix                                                      |
| ------------------------------------- | ----------------------------------------------- | -------------------------------------------------------- |
| Blank story                           | Missing `register.js` import in stories file    | Add `import '../register.js';`                           |
| Component renders but unstyled        | SCSS not compiled                               | Run `yarn build` to compile `.scss` → `.scss.ts`         |
| "Element already defined" error       | Duplicate `customElements.define` call          | Use `ScopedElementsMixin` or `try/catch` around `define` |
| Story controls don't update component | Property not decorated with `@property`         | Add `@property()` decorator, or use `.prop=` binding     |
| Slot content not rendering            | Wrong slot name or missing `<slot>` in template | Check `render()` has matching `<slot name="...">`        |
| Icon not showing                      | Icon not registered                             | Add `Icon.register(faIconName)` at module level          |
