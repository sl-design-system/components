---
'@sl-design-system/angular': minor
---

Use the new tooltip implementation

The tooltip directive has been updated to use the new tooltip implementation. This means that the tooltip is now created as a separate element and positioned using the `for` attribute. The old implementation, which used a lazy loader, has been removed. The API of the tooltip directive remains the same, but the DOM structure may have changed.
