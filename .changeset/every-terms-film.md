---
'@sl-design-system/tool-bar': minor
---

**Breaking Changes:**
- Removed `fill` property - use `type` property instead. If you were using `fill="outline"`, change it to `type="outline"`. If you were using `fill="ghost"`, change it to `type="ghost"`.
- Removed `no-border` property - border now only shows in `contained` variant (except when `inverted`).

**New Features:**
- Added `contained` property to enable contained mode
- Added keyboard navigation support for arrow keys when toolbar is focused
- Added `inverted` property to the divider component

**Improvements:**
- Improved overall styling and fixed overflow behavior issues