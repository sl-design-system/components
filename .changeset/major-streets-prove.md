---
'@sl-design-system/format-number': patch
---

Minor fixes and promote to preview status

- Fixed unreachable `return html\`<slot></slot>\``dead code in`render()`
- Added missing unit tests for `minimumIntegerDigits`, `minimumSignificantDigits`, `maximumSignificantDigits`, `notation`, `signDisplay`, `currencyDisplay`, negative numbers, zero, `useGrouping: true`, explicit `NaN`, no number set, and locale-aware formatting
