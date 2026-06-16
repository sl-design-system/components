---
'@sl-design-system/tag': patch
---

Accessibility improvements to `<sl-tag>` and `<sl-tag-list>`:

- The remove button now has a proper accessible label ("Remove tag 'X'") instead of being `aria-hidden`
- The remove button uses `aria-disabled` instead of `disabled`, keeping it keyboard-reachable when the tag is disabled
- Focus is delegated to the remove button via the component's `focus()` implementation; `:state(focus-visible)` tracks focus for styling
- `<sl-tag-list>` correctly sets `role="listitem"` on each tag
