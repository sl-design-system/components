---
'@sl-design-system/editor': minor
---

Add rich text editor toolbar with common formatting actions.

A new `<sl-editor-toolbar>` component is now rendered inside `<sl-editor>` by default. It provides buttons for:

- **Text marks**: Bold, Italic, Underline, Strikethrough, Inline code
- **Block formats**: Blockquote, Heading 1–3
- **Lists**: Bullet list, Ordered list
- **History**: Undo, Redo

The toolbar uses `<sl-tool-bar>` and `<sl-button>` from the design system, supports overflow and keyboard navigation, and reflects the current editor selection state via `aria-pressed`.

### New API

- `Editor.toolbar` (`boolean`, default `true`) — set to `false` to hide the toolbar
- `EditorToolbar` — exported class for the toolbar element (`sl-editor-toolbar`)
