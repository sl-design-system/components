---
'@sl-design-system/select': patch
---

Fix cloned custom elements in the selected option not having a shadow root

This fixes a bug where options have custom elements (such as `<sl-icon>`) that are cloned when an option is selected, but the cloned elements are not upgraded and thus do not have a shadow root. This can be due to the custom element not being registered in the parent scope. This fix uses `importNode()` instead of `cloneNode()` to ensure that the cloned elements are properly upgraded and have their shadow DOM initialized.
