---
'@sl-design-system/eslint-plugin-slds': patch
---

Fixed a false positive in `slds/singleline-html-template-trimmed` where spaces between expressions in single-line `html` template literals were incorrectly reported as leading or trailing whitespace.
