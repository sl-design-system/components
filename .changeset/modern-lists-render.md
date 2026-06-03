---
'@sl-design-system/virtual-list': minor
---

Migrate to TanStack Virtual for improved performance and reliability

The virtual-list component has been refactored to use TanStack Virtual instead of the custom virtualization implementation. This provides better performance, smoother scrolling, and more reliable item measurement.

- Migrated to TanStack Virtual for core virtualization logic
- Added `scrollMargin` property to control scroll offset when scrolling items into view
- Added `requestLayout()` method to trigger re-measurement of item sizes
- Updated `VirtualListItemRenderer` type to support both Element and TemplateResult return types
