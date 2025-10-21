---
'@sl-design-system/tool-bar': patch
'@sl-design-system/grid': patch
---

Fix changes in the nested bulk actions slot in `<sl-grid>` not propagating to `<sl-tool-bar>`

The bulk actions `<slot>` is nested in the default slot of `<sl-tool-bar>`. This means that changes to the bulk actions slot are not automatically observed by the tool-bar. To work around this, we explicitly call `refresh()` on the tool-bar when the bulk actions slot changes. `refresh()` will update the mapping of the tool-bar actions.
