---
'@sl-design-system/angular': minor
---

Use the new tooltip implementation

The tooltip directive has been updated to use the new tooltip implementation. This means that the tooltip is now created as a separate element and positioned using the `for` attribute. The old implementation, which used a lazy loader, has been removed. The API of the tooltip directive remains the same, but the DOM structure may have changed.

The directive also no longer creates an `<sl-tooltip>` element when the tooltip text is empty. Previously an empty tooltip was always inserted, which gave the anchor element an empty accessible name or description. The tooltip is now created as soon as the text becomes non-empty and removed again when it becomes empty.
