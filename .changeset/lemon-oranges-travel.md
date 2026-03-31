---
'@sl-design-system/tooltip': minor
---

Reworked the tooltip interaction model for hover and keyboard focus, especially for shared anchors and shadow DOM scenarios.

### What changed

- Improved anchor detection across composed paths, shadow roots, `Element.aria*ByElements`, and `ElementInternals`.
- Added `show-delay` and `hide-delay` support to make opening/closing timing explicit and configurable.
- Refactored hide/show flow to handle rapid pointer transitions more reliably and prevent sticky/open-state race conditions.
- Added guard logic so tooltips stay open when keyboard focus moves between focusable descendants inside the same composite anchor (`:focus-within` handling), while still closing when the anchor truly loses focus.
- Added an optimization to avoid unnecessary hide-path processing when handling `pointerout` while the tooltip is already closed.
- Updated `sl-close` handling to listen at the document level (`ownerDocument`/`document`) so focus-return behavior works when close events originate outside the tooltip root.
- Improved immediate anchor switching behavior when moving between shared anchors (pointer and keyboard).
- Updated the `NestedChildren` story with mobile-specific layout fixes only, including proper centering of the eye-icon trigger on small viewports.
- Expanded and refactored tooltip tests, including a dedicated shared-anchor test suite, to cover rapid pointer movement, focus transitions, `sl-close` behavior, and composite-anchor keyboard navigation.
