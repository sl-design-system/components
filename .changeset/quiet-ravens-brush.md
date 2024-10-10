---
'@sl-design-system/tooltip': patch
---

Make the lazy tooltip smarter when it comes to determining which context to use to create the `<sl-tooltip>` element

With this change, when the tooltip is lazily created, it checks if the target element has a shadow root. If it does, it uses the shadow root to create the tooltip custom element. If it doesn't, it uses the root node of the target element. If there is no parent custom element, then `getRootNode()` will return the document, so it will do `document.createElement('sl-tooltip')`.

After `createElement('sl-tooltip')` it then checks if the tooltip has a shadow root itself. If it doesn't, it means the tooltip custom element wasn't defined. When that happens, it will log a warning on the console.
