---
'@sl-design-system/tooltip': minor
---

Various improvements:
- Fix broken behavior when the `tooltip()` directive is used on an `<sl-button>` by automatically falling back to the root node if a target's `ShadowRoot` does not contain `<sl-tooltip>` in its custom element registry
- Fix font not being applied correctly
