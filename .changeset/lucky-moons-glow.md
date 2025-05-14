---
'@sl-design-system/inline-message': major
---

### Breaking change:
- Remove `action` slot for action buttons. The `action` slot has been removed due to accessibility reasons. We do not recommend using inline messages with interactive elements inside.

### Several changes:
- Remove `role` - announcer (aria-live) is used in the component instead.
- Added `announcer` to the component (for the `danger` variant there is `aria-live="assertive"` used, for the rest: `aria-live="polite"`).
