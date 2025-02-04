---
'@sl-design-system/eslint-config': patch
---

Bump typescript-eslint version to fix false positive

Updating to the latest version fixes a false positive error that
was being thrown related to the `RovingTabindexController` having an `any` type.