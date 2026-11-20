---
'@sl-design-system/checkbox': patch
'@sl-design-system/radio-group': patch
---

Initialize the form control element before connection so synchronous validation by Angular reactive forms does not throw when checkbox and radio groups first render.
