---
'@sl-design-system/rich-text-editor': minor
---

Rename `@sl-design-system/editor` to `@sl-design-system/rich-text-editor` and `<sl-editor>` to `<sl-rich-text-editor>` (class `Editor` is now `RichTextEditor`), and add a formatting toolbar, field states and checklists:

- New `features` attribute picks what an editor can do (`default`, a feature name, or `-name` to remove one); the schema, toolbar and keyboard shortcuts follow it
- Formatting toolbar with a text style select, marks, link, lists, indent, quote and undo/redo; buttons reflect the selection
- Opt-in `checklist` feature with `<sl-checkbox>` boxes, stable item ids, `Ctrl/⌘+Enter` to tick and `[] ` to start one
- Opt-in `character-count` feature with a footer count that uses `maxlength`
- On touch devices the toolbar only shows while editing, docked above the on-screen keyboard as one scrolling row, and the editor can open full screen (`expandable`, `expand()`, `collapse()`, `sl-expand` and `sl-collapse`)
- Markdown shortcuts (`- `, `1. `, `> `, `## `) and `Ctrl/⌘+K` to add a link; on touch devices links are added and edited in a bottom sheet
- New `placeholder`, `readonly`, `required` and `maxlength` properties, and `sl-change`, `sl-focus` and `sl-blur` events
- The editable is now rendered in light DOM, so native selection, IME and autocorrect work in every browser
